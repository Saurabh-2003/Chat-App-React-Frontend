import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import EmojiPicker from 'emoji-picker-react';
import { SmilePlus, SendHorizontal, ArrowLeft, Settings } from "lucide-react";
import axios from 'axios';
import Modal from 'react-modal';
import GroupSettingsModal from "./GroupSettingsModal"
import { useAppContext } from "../../AppContext";
function MessageContainer() {
  const { user, selectedFriend, setSelectedFriend, socket} = useAppContext();
  const messagesRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [friendData, setFriendData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiPickerIconRef = useRef(null);
  const [page, setPage] = useState(1);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [isGettingMessages, setIsGettingMessages] = useState(false);

  // Format messsages dates :
  const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    else if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    else return date.toLocaleDateString();
  };

  // Grouping Messages according to the dates
  const groupedMessages = messages.reduce((acc, message) => {
    const formattedDate = getFormattedDate(message.timestamp);
    acc[formattedDate] = acc[formattedDate] || [];
    acc[formattedDate].push(message);
    return acc;
  }, {});

  // For adding emojis to the message that is being
  const handleEmojiClick = (emojiData, MouseEvent) => {
    setSendMessage(prevMessage => prevMessage + emojiData.emoji);
  };
  
  // Sending message to the selected friend
  const handleSend = async (event) => {
    event.preventDefault();
    try {
      if (sendMessage.trim() === '') return;
      setIsSendingMessage(true);
      await socket.emit('sendMessage', { from: user._id, to: selectedFriend, mess: sendMessage });
      setSendMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally{
      setIsSendingMessage(false);
    }
  };

  // For Opening and closing the Group Setting Modal :
  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  // For opening and closing the emoji picker 
  const handleEmojiPickerClick = () => {
    setShowEmojiPicker(prevState => !prevState);
  };


  // If a user clicks outside of the emoji picker after opening it then the emoji picker is closed using even handlers
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        emojiPickerRef.current &&
        emojiPickerIconRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        !emojiPickerIconRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  // If a new messgae is recieved in realtime the append that message to the end of the messages
  useEffect(() => {
    socket.on('messageReceived', (message) => {
      console.log(message)
      setMessages(prevMessages => [...prevMessages, message]);
    });
    
    return () => {
      socket.off('messageReceived');
    };
  }, [socket]);
  

// When the selected friend changes we fetch new selected friend adata and latest messages 
  useEffect(() => {
    const fetchData = async () => {
      try {
        setPage(1);
        setMessages([])
        // Fetch friend's information
        const friendInfoResponse = await axios.get(`${process.env.REACT_APP_BACKEND}/api/new/getmyinfo/${selectedFriend}`);
        const { info } = friendInfoResponse.data;
        setFriendData(info);
  
        // Fetch initial messages
        const messagesResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/api/mes/allmessages`, {
          userId: user._id,
          friendId: selectedFriend,
        });
        setMessages(messagesResponse.data.messages);
        messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    if (selectedFriend) {
      fetchData();
    }
  }, [selectedFriend, user._id]);
  

  // When the pages chages fetch the older messages and puy them on top of the older newer messages : 
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsGettingMessages(true);
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/api/mes/allmessages`, {
          userId: user._id,
          friendId: selectedFriend,
          page
        });
        setMessages(prev => [...response.data.messages, ...prev]);
        messagesRef.current.scrollTop = 0;
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsGettingMessages(false)
      }
    };
    fetchMessages();
  }, [page]);



  return (
    <div className="h-full flex flex-col">
      {selectedFriend !== "" && (
        <div className="flex items-center justify-between py-4 px-4 max-sm:px-6  border-b border-gray-300 shadow-md">
          <ArrowLeft onClick={() => setSelectedFriend("")} className="cursor-pointer size-10 text-gray-600 hover:text-gray-800" />
          {friendData && (
            <div className="flex items-center space-x-2">
              <img src={friendData.image != null ? friendData.image : "/placeholder.jpg"} className="size-10 rounded-full" alt="Friend" />
              <span className="text-lg font-semibold">{friendData.name.split(' ')[0]}</span>
            </div>
          )}
          {friendData && friendData.isGroup && (
            <button onClick={openModal} className="text-gray-600 hover:text-gray-800">
              <Settings />
            </button>
          )}
        </div>
      )}
      <div className="h-full py-2 max-sm:px-6 relative max-sm:py-0 w-full px-10 overflow-y-auto" ref={messagesRef}>
        <button onClick={() => setPage(prev => prev +1)} className="w-full text-center bg-indigo-500 text-white mb-4 text-sm"> 
        {isGettingMessages ? "Loading" : "Show Older Messages"}</button>
        {Object.entries(groupedMessages).map(([formattedDate, messagesForDate]) => (
          <div key={formattedDate}>
            <div className="text-center text-gray-500 text-sm mb-3 ">{formattedDate}</div>
            {messagesForDate.map((m, index) => (
              <motion.div
                className={`flex flex-col w-full mb-2`}
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className={`flex gap-2 items-center ${m.from === user._id ? "self-end flex-row-reverse" : "self-start"}`}>
                  <img src={m.fromImage.image || "/placeholder.jpg"} className="h-8 w-8 rounded-full mr-2" alt="From" />
                  <span className="text-sm capitalize text-slate-700">{(m.fromName.name.split(' '))[0]}</span>
                </div>
                <div className={`max-w-80 overflow-hidden px-6 rounded-xl ${m.from === user._id ? "bg-gray-200 mr-6 rounded-tr-none text-slate-900 self-end w-fit" : "bg-bg-primary ml-6 rounded-tl-none text-white self-start w-fit"}`}>
                  <div className="whitespace-pre-wrap" style={{ wordWrap: 'break-word' }}>{m.message}</div>
                  <div className="text-xs text-right">{formatMessageTime(m.timestamp)}</div>
                </div>
              </motion.div>
            ))}
          </div>
        ))}
      </div>
      <form className="flex relative border-t-2 items-center   w-full px-2 py-2" onSubmit={handleSend}>
        <div className="">
          <motion.div
            disabled={isSendingMessage}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`absolute bottom-14 disabled:cursor-not-allowed mt-8 z-10 ${showEmojiPicker ? '' : 'hidden'}`}
            ref={emojiPickerRef}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.1 }}
            className="cursor-pointer absolute left-4 top-4"
            onClick={handleEmojiPickerClick}
            
          >
            <SmilePlus ref={emojiPickerIconRef} className="text-bg-primary  select-none  size-8" />
          </motion.div>
        </div>
        <input
          type="text"
          required={true}
          minLength={1}
          name="sendMessage"
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
          disabled={isSendingMessage}
          className="flex-grow border flex-shrink disabled:cursor-not-allowed border-gray-300 rounded-full px-14 py-3 focus:outline-none"
        />
        <button
          disabled={isSendingMessage}
          type="submit"
          className={`absolute right-4 bg-bg-primary max-sm:size-8 text-white flex items-center justify-center px-2 rounded-full py-2 hover:scale-110 transition ${isSendingMessage ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          <SendHorizontal />
        </button>

      </form>
      <Modal ariaHideApp={false}  isOpen={showModal} onRequestClose={closeModal}>
        <GroupSettingsModal  onRequestClose={closeModal} user={user} selectedFriend={selectedFriend}
          isOpen={showModal}/>
      </Modal>
    </div>
  );
}

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

export default MessageContainer;