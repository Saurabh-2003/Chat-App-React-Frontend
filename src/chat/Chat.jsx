import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import SideBar from "../sidebar/sidebar";
import MessageContainer from "../sidebar/messageContainer/messageContainer.jsx";
import axios from "axios";
import { io } from "socket.io-client";
import EmojiPicker from 'emoji-picker-react';
import { SmilePlus, SendHorizonal } from "lucide-react";
import ErrorMessage from "../utils/ErrorMessage.jsx";
import { motion } from "framer-motion";
import Loading from './Loading.jsx'


const socket = await io.connect(process.env.REACT_APP_BACKEND);

function Chat() {
  const location = useLocation();
  const { state } = location;
  const { user } = state || {};
  const [selectedFriend, setSelectedFriend] = useState("");
  const [messages, setMessages] = useState([]);
  const [sendMessage, setSendMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(true);
  // Function to handle friend click
  const handleFriendClick = async (friendId) => {
    try {
      setLoading(true)
      if (!user) {
        console.error("User is null");
        return;
      }
  
      const response = await axios.post(process.env.REACT_APP_BACKEND+"/api/mes/allmessages", {
        userId: user._id,
        friendId,
      });
  
      setSelectedFriend(friendId);
      setMessages(response.data.messages);
      setLoading(false);
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

  useEffect(() => {
    console.log(loading)
  }, [loading])

  // Join socket on user ID change
  useEffect(() => {
    const joinSocket = async () => {
      await socket.emit('join', user._id);
    };
    joinSocket();
  }, [user._id]);

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

  if(!user){
    return <ErrorMessage />
  }


  return  (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen py-10 "
    >
      <section className="flex w-full gap-6 px-10">
        <SideBar user={user} onFriendClick={handleFriendClick} socket={socket}/>
        <section className="flex flex-col w-full bg-white rounded-xl">
          <div className="flex-grow h-full p-4">
            {selectedFriend && (
              loading ? (
                <Loading />
              ) : (
                  <div className="h-full flex flex-col justify-between">
                    <div className="overflow-y-auto"><MessageContainer user={user} messages={messages} /></div>
                    <form className="flex items-center mt-4" onSubmit={handleSend}>
                      <div className="mr-4 px-2 py-2 relative">
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.3 }}
                          className={`absolute bottom-10 mt-8 z-10 ${showEmojiPicker ? '' : 'hidden'}`}
                        >
                          <EmojiPicker onEmojiClick={handleEmojiClick} />
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.2 }} // Increase scale on hover
                          className="cursor-pointer"
                          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                        >
                          <SmilePlus size={30} className=" text-bg-primary" />
                        </motion.div>
                      </div>
                      <input
                        type="text"
                        required={true}
                        minLength={1}
                        name="sendMessage"
                        value={sendMessage}
                        onChange={(e) => setSendMessage(e.target.value)}
                        className="flex-grow border border-gray-300 rounded-md p-2 focus:outline-none"
                      />
                      <button type="submit" className="bg-bg-primary text-white flex items-center justify-center px-2 rounded-full py-2 ml-4 hover:scale-125 transition"><SendHorizonal/></button>
                    </form>
                  </div>
              )
            )}
            {!selectedFriend && (
              <div className="text-center mt-4">Start a Conversation</div>
            )}
          </div>
        </section>
      </section>
    </motion.main>
  );
}

export default Chat;