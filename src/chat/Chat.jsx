import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "../sidebar/sidebar";
import MessageContainer from "../sidebar/messageContainer/messageContainer.jsx";
import axios from "axios";
import { io } from "socket.io-client";
import EmojiPicker from 'emoji-picker-react';
import { SmilePlus, SendHorizonal, ArrowLeft } from "lucide-react";
import ErrorMessage from "../utils/ErrorMessage.jsx";
import { motion } from "framer-motion";
import Loading from './Loading.jsx';

const socket = await io.connect(process.env.REACT_APP_BACKEND);

function Chat() {
  const location = useLocation();
  const { state } = location;
  const { user } = state || {};
  const [selectedFriend, setSelectedFriend] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false); // Initialize loading state

  // Function to handle friend click
  const handleFriendClick = async (friendId) => {
    try {
      setLoading(true); // Set loading to true before fetching messages
      if (!user) {
        console.error("User is null");
        return;
      }
  
      const response = await axios.post(process.env.REACT_APP_BACKEND + "/api/mes/allmessages", {
        userId: user._id,
        friendId,
      });
  
      setSelectedFriend(friendId);
      setMessages(response.data.messages);
      setLoading(false); // Set loading to false after fetching messages
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to handle emoji click
  const handleEmojiClick = (emojiData, MouseEvent) => {
    setSendMessage(sendMessage + " " + emojiData.emoji);
  };

  // Function to handle sending messages
  const handleSend = async (event) => {
    event.preventDefault();
    try {
      // Prevent multiple sends
      if (sendMessage.trim() === '') return;

      await socket.emit('sendMessage', { from: user._id, to: selectedFriend, mess: sendMessage });
      setSendMessage('');
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Join socket on user ID change
  useEffect(() => {
    const joinSocket = async () => {
      if (!socket.connected) {
        // Wait for the socket to connect before emitting events
        await new Promise(resolve => socket.once('connect', resolve));
      }
      socket.emit('join', user._id);
    };
  
    if (user && user._id) {
      joinSocket();
    }
  
    // Clean up function to leave socket room when component unmounts
    return () => {
      if (user && user._id) {
        socket.emit('leave', user._id);
      }
    };
  }, [socket, user]);

  // Socket event listener for incoming messages
  useEffect(() => {
    const messageHandler = (newMessage) => {
      console.log('message-received');
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    };
    
    socket.on('messageReceived', messageHandler);
    return () => {
      socket.off('messageReceived', messageHandler);
    };
  }, [messages]);

  //Delete a friend 
  const deleteFriend = async (event) => {
    event.stopPropagation(); // Stop event propagation
    try {
      await axios.delete(process.env.REACT_APP_BACKEND+"/api/new/removefriend", {
        data: {
          userId: user._id,
          friendId: selectedFriend,
        },
      });
      socket.emit('friendDelete', {
        userId : user._id,
        friendId: selectedFriend
      });
  
      setSelectedFriend("");
    } catch (error) {
      console.error("Error deleting friend:", error);
    } finally {
      // setConfirmationVisible(false);
    }
  };

  //Return an error if the user is not found :
  if (!user) {
    return <ErrorMessage />;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen py-10 max-sm:py-0"
    >
      <section className="flex w-full gap-6 px-10 max-sm:px-0">
        <SideBar 
          selectedFriend={selectedFriend} 
          setSelectedFriend={setSelectedFriend} 
          user={user} 
          onFriendClick={handleFriendClick} 
          socket={socket} 
        />
        <section className={`flex relative flex-col w-full max-sm:bg-transparent bg-white max-sm:fixed max-sm:overflow-scroll max-sm:h-screen max-sm:bg-white max-sm:w-full rounded-xl ${selectedFriend === "" ? "max-sm:hidden" : "max-sm:block"}`}>
          <div className="absolute  left-2 top-2  max-sm:bg-transparent">
            {selectedFriend !== "" && (
              <ArrowLeft onClick={() => setSelectedFriend("")} size={30} />
            )}
          </div>
          <div className="flex-grow h-full max-sm:px-0 p-4">
            {selectedFriend && (
              loading ? (
                <Loading />
              ) : (
                <div className="h-full flex flex-col justify-between">
                  <div className="overflow-y-auto">
                    <MessageContainer user={user} messages={messages} />
                  </div>
                  <form className="flex max-sm:px-0  max-sm:rounded-none items-center mt-4 bg-gray-100 rounded-full w-full px-2 py-2" onSubmit={handleSend}>
                    <div className="mr-4 max-sm:mr-1 px-2 py-2 relative">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute bottom-10 mt-8 z-10 ${showEmojiPicker ? '' : 'hidden'}`}
                      >
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                      </motion.div>
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="cursor-pointer"
                        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                      >
                        <SmilePlus className="text-bg-primary max-sm:size-6 size-8" />
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
                      <SendHorizonal />
                    </button>
                  </form>
                </div>
              )
            )}
            {!selectedFriend && (
              <div className="text-center mt-4 max-sm:hidden">Start a Conversation</div>
            )}
          </div>
        </section>
      </section>
    </motion.main>
  );
}

export default Chat;
