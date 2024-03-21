import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import EmojiPicker from 'emoji-picker-react';
import { SmilePlus, SendHorizontal, ArrowLeft, Settings } from "lucide-react";
import axios from 'axios';
import Modal from 'react-modal';
import GroupSettingsModal from "./GroupSettingsModal"
import { useAppContext } from "../../AppContext";
import FriendInfoLoading from "./FriendInfoLoading";
import { MessageSkeletonLoading } from "./MessageLoading";

import { EllipsisVertical } from "lucide-react";

import toast from "react-hot-toast";
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
  const [isLoadingFriendInfo, setIsLoadingFriendInfo] = useState(false);
  const [isLoadingInitialMessages, setIsLoadingInitialMessages] = useState(false);
  const [isDeleteVisible, setDeleteVisible] = useState(false);
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const ellipsis = useRef(null);
  const deleteRef = useRef(null);
  const [noMessages, setNoMessages] = useState(false);

  // Logic fot handling click outisd the delete button when its opened
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        deleteRef.current &&
        ellipsis.current &&
        !deleteRef.current.contains(event.target) &&
        !ellipsis.current.contains(event.target)
      ) {
        setDeleteVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

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

    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
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
        setNoMessages(false);
        // Fetch friend's information
        setIsLoadingFriendInfo(prev => !prev)
        setIsLoadingInitialMessages(prev => !prev)
        const friendInfoResponse = await axios.get(`${process.env.REACT_APP_BACKEND}/api/new/getmyinfo/${selectedFriend}`);
        const { info } = friendInfoResponse.data;
        setIsLoadingFriendInfo(prev => !prev)
        setFriendData(info);
  
        // Fetch initial messages
        const messagesResponse = await axios.post(`${process.env.REACT_APP_BACKEND}/api/mes/allmessages`, {
          userId: user._id,
          friendId: selectedFriend,
        });

        if( messagesResponse.data.messages.length  <= 9){
          setNoMessages(true);
        }
        setIsLoadingInitialMessages(prev => !prev)
        if (messagesResponse.data.messages.length > 0) {
          setMessages(messagesResponse.data.messages);
        }else{
          setNoMessages(true);
        }
        
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
       
        if(response.data.messages.length > 0){
          setMessages(prev => [...response.data.messages, ...prev]);
        }else{
          setNoMessages(true);
        }
        messagesRef.current.scrollTop = 0;
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsGettingMessages(false)
      }
    };

    if(page > 1){
      fetchMessages();
    } 
  }, [page]); 

  // Delete the selected user :
  const deleteFriend = async (event) => {
    event.stopPropagation();
    try {
      if (friendData.isGroup && friendData.admin === user._id) {
        const res = await axios.delete(
          `${process.env.REACT_APP_BACKEND}/api/new/delete-group`,
          {
            data: { id: friendData._id },
          }
        );
        if (res.data.success) {
          toast.success(res.data.message);
        }
      } else {
        const response = await axios.delete(
          process.env.REACT_APP_BACKEND + "/api/new/removefriend",
          {
            data: {
              userId: user._id,
              friendId: friendData._id,
            },
          }
        );

        if (response.data.success) {
          toast.success(response.data.message);
        }
      }
      socket.emit("friendDelete", {
        userId: user._id,
        friendId: friendData._id,
      });

      if (selectedFriend === friendData._id) {
        setSelectedFriend("");
      }
    } catch (error) {
      console.error("Error deleting friend:", error);
    } finally {
      setDeleteVisible(false);
    }
  };

  const toggleDeleteButton = (event) => {
    event.stopPropagation();
    setDeleteVisible(!isDeleteVisible);
  };

  const cancelDeleteRequest = async(event) => {
    event.stopPropagation();
    setConfirmationVisible(false)
  }

  return (
    <div key={selectedFriend} className="h-full relative flex flex-col overflow-hidden bg-gray-900">
      {selectedFriend !== "" && (
        isLoadingFriendInfo ? <FriendInfoLoading /> :
        <div className="flex  bg-gray-800 items-center justify-between py-4 px-4 max-sm:px-6  shadow-md">
          <ArrowLeft onClick={() => setSelectedFriend("")} className="cursor-pointer size-10 text-gray-400 hover:text-gray-500" />
          {friendData && (
            <div className="flex items-center space-x-2">
              <img src={friendData.image != null ? friendData.image : "/placeholder.jpg"} className="size-10 rounded-full" alt="Friend" />
              <span className="text-lg text-slate-400 font-semibold">{friendData.name.split(' ')[0]}</span>
            </div>
          )}
          <div className="flex gap-2">
            {friendData && friendData.isGroup && (
              <button onClick={openModal} className="text-gray-400 hover:text-gray-500">
                <Settings size={30} />
              </button>
            )}
            <div className="  items-center flex">
              <EllipsisVertical
              ref={ellipsis}
                className="ellipsis-icon hover:bg-gray-600 text-gray-400 transition rounded-lg py-1 cursor-pointer"
                size={35}
                onClick={toggleDeleteButton}
              />
              {isDeleteVisible && (
                  <button 
                  ref={deleteRef}
                  onClick={(event) => { 
                    event.stopPropagation(); 
                    setConfirmationVisible(true);
                    setDeleteVisible(false)
                  }}
                  className=" absolute right-7 top-14  z-10 bg-gray-600 hover:bg-gray-700 text-gray-300 rounded-lg px-10 py-3" >
                    Delete
                  </button>
              )}
            </div>
          </div>
        </div>
      )}
      {
        isLoadingInitialMessages ?
        <MessageSkeletonLoading /> :
        <>{
          isLoadingInitialMessages ? <MessageSkeletonLoading /> :
          <div 
          style={{
            background: `linear-gradient(rgba(0, 0, 0, 0.8), rgba(0,0,0, 0.8)), url('https://camo.githubusercontent.com/cba518ead87b032dc6f1cbfc7fade27604449201ac1baf34d889f77f093f01ac/68747470733a2f2f7765622e77686174736170702e636f6d2f696d672f62672d636861742d74696c652d6461726b5f61346265353132653731393562366237333364393131306234303866303735642e706e67')`,
            
            backgroundRepeat: 'repeat-x', 
          }} 
          className="h-full py-2 max-sm:px-6 relative max-sm:py-0 w-full px-10 overflow-y-auto" 
          ref={messagesRef}
        >
  
  <button 
  onClick={() => setPage(prev => prev + 1)} 
  className="w-full text-center text-slate-300 hover:underline mb-4 text-sm" 
  disabled={isGettingMessages || noMessages}
>
  {isGettingMessages ? "Loading......" : noMessages? "No Older Messages" : "Show Older Messages "}
</button>

          {Object.entries(groupedMessages).map(([formattedDate, messagesForDate]) => (
            <div key={formattedDate}>
              <div className="text-center text-slate-400 bg-gray-900/90 rounded-md mx-auto py-2 w-28 text-sm mb-3 ">{formattedDate}</div>
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
                    <span className="text-sm capitalize text-slate-200">{(m.fromName.name.split(' '))[0]}</span>
                  </div>
                  <div className={`max-w-80 overflow-hidden px-6 rounded-xl text-slate-200 ${m.from === user._id ? "bg-[#36454F] mr-10 rounded-tr-none self-end w-fit" : "bg-emerald-700 ml-10 rounded-tl-none  self-start w-fit"}`}>
                    <div className="whitespace-pre-wrap" style={{ wordWrap: 'break-word' }}>{m.message}</div>
                    <div className="text-xs text-right">{formatMessageTime(m.timestamp)}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          ))}
        </div>
        }
        <form className="flex relative bg-gray-800 items-center   w-full px-2 py-4" onSubmit={handleSend}>
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
              className="cursor-pointer absolute left-4 top-6"
              onClick={handleEmojiPickerClick}
              
            >
              <SmilePlus ref={emojiPickerIconRef} className="text-gray-400 select-none  size-8" />
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
            className="flex-grow bg-gray-700 text-white flex-shrink disabled:cursor-not-allowed  rounded-full px-14 py-3 focus:outline-none"
          />
          <button
            disabled={isSendingMessage}
            type="submit"
            className={`absolute right-4 bg-emerald-600 max-sm:size-8 text-gray-200  flex items-center justify-center px-2 rounded-full py-2 hover:scale-110 transition ${isSendingMessage ? 'cursor-not-allowed opacity-50' : ''}`}
          >
            <SendHorizontal />
          </button>
  
        </form></>
      }
      <Modal className={` grid place-items-center`} ariaHideApp={false}  isOpen={showModal} onRequestClose={closeModal}>
        <GroupSettingsModal  onRequestClose={closeModal} user={user} selectedFriend={selectedFriend}
          isOpen={showModal}/>
      </Modal>

      <Modal
        isOpen={isConfirmationVisible}
        onRequestClose={() => setConfirmationVisible(false)}
        className={`h-full w-full bg-black/80 grid place-items-center`}
      >
        <div className="text-center bg-gray-900 rounded-md shadow-lg px-10 py-4">
          <p className="text-xl text-stone-300 font-semibold mb-2">ARE YOU SURE?</p>
          <div className="flex justify-center">
            <button onClick={deleteFriend} className="delete-accept bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2">
              Yes
            </button>
            <button onClick={cancelDeleteRequest} className="delete-reject bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
              No
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

export default MessageContainer;