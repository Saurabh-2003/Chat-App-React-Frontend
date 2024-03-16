import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import EmojiPicker from 'emoji-picker-react';
import { SmilePlus, SendHorizontal, ArrowLeft, Settings } from "lucide-react";
import axios from 'axios';
import Modal from 'react-modal';
import GroupSettingsModal from "./GroupSettingsModal"

function MessageContainer({ user, socket, selectedFriend, setSelectedFriend }) {
  const messagesRef = useRef(null);
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [friendData, setFriendData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const emojiPickerRef = useRef(null);
  const emojiPickerIconRef = useRef(null);

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

  const handleEmojiPickerClick = () => {
    setShowEmojiPicker(prevState => !prevState);
  };


  useEffect(() => {
    socket.on('messageReceived', (message) => {
      console.log(message)
      setMessages(prevMessages => [...prevMessages, message]);
    });
    
    return () => {
      socket.off('messageReceived');
    };
  }, [socket]);
  


  useEffect(() => {
    const getFriendData = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BACKEND}/api/new/getmyinfo/${selectedFriend}`);
        const { info } = res.data;
        setFriendData(info);
      } catch (error) {
        console.error("Error fetching friend data:", error);
      }
    };
    getFriendData();
  }, [selectedFriend]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND}/api/mes/allmessages`, {
          userId: user._id,
          friendId: selectedFriend,
        });
        setMessages(response.data.messages);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    if (selectedFriend) {
      fetchMessages();
    }
  }, [selectedFriend, user._id]);

  useEffect(() => {
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return "Today";
    else if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    else return date.toLocaleDateString();
  };

  const groupedMessages = messages.reduce((acc, message) => {
    const formattedDate = getFormattedDate(message.timestamp);
    acc[formattedDate] = acc[formattedDate] || [];
    acc[formattedDate].push(message);
    return acc;
  }, {});

  const handleEmojiClick = (emojiData, MouseEvent) => {
    setSendMessage(prevMessage => prevMessage + emojiData.emoji);
  };
  

  const handleSend = async (event) => {
    event.preventDefault();
    try {
      if (sendMessage.trim() === '') return;
      await socket.emit('sendMessage', { from: user._id, to: selectedFriend, mess: sendMessage });
      setSendMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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
        {Object.entries(groupedMessages).map(([formattedDate, messagesForDate]) => (
          <div key={formattedDate}>
            <div className="text-center text-gray-500 text-sm mb-3 ">{formattedDate}</div>
            {messagesForDate.map((m) => (
              <motion.div
                className={`flex flex-col w-full mb-2`}
                key={m._id}
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
      <form className="flex border-t-2 items-center   w-full px-2 py-2" onSubmit={handleSend}>
        <div className="mr-4 max-sm:mr-1 px-2 py-2 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className={`absolute bottom-10 mt-8 z-10 ${showEmojiPicker ? '' : 'hidden'}`}
            ref={emojiPickerRef}
          >
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="cursor-pointer"
            onClick={handleEmojiPickerClick}
            
          >
            <SmilePlus ref={emojiPickerIconRef} className="text-bg-primary select-none max-sm:size-6 size-8" />
          </motion.div>
        </div>
        <input
          type="text"
          required={true}
          minLength={1}
          name="sendMessage"
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
          className="flex-grow border flex-shrink border-gray-300 rounded-md p-2 focus:outline-none"
        />
        <button type="submit" className="bg-bg-primary max-sm:size-8 text-white flex items-center justify-center px-2 rounded-full py-2 ml-4 hover:scale-125 transition">
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
