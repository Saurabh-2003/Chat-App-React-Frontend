import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../sidebar/sidebar";
import MessageContainer from "../sidebar/messageContainer/messageContainer.jsx";
import axios from "axios";
import ErrorMessage from "../utils/ErrorMessage.jsx";
import { motion } from "framer-motion";
import UserLoading from "./UserLoading.jsx";
import { useAppContext } from "../AppContext.jsx";

function Chat() {
  const [useLoading, setUserLoading] = useState(true);
  const {  user, setUser, selectedFriend, socket} = useAppContext();
  const { id } = useParams();

  useEffect(() => {
    const getUserDetails = async () => {
      try {
        const { data } = await axios.get(`${process.env.REACT_APP_BACKEND}/api/new/getmyinfo/${id}`);
        setUser(data.info);
        setUserLoading(false);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    getUserDetails();
  }, [id]);

  useEffect(() => {
    const joinSocket = async () => {
      if (!socket.connected) {
        await new Promise(resolve => socket.once('connect', resolve));
      }
      socket.emit('join', user?._id);
    };
  
    if (user && user._id) {
      joinSocket();
    }
  
    return () => {
      if (user && user._id) {
        socket.emit('leave', user._id);
      }
    };
  }, [ user]);


  if(useLoading){
    return <UserLoading />
  }

  if (!user) {
    return <ErrorMessage />;
  }

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="flex h-screen max-sm:py-0"
    >
      <section className="flex w-full ">
          <SideBar  />
        <section className={`flex relative flex-col w-full max-sm:bg-transparent bg-white max-sm:fixed max-sm:overflow-scroll max-sm:h-screen max-sm:bg-white max-sm:w-full ${selectedFriend === "" ? "max-sm:hidden" : "max-sm:block"}`}>
          
          <div className="flex-grow h-full max-sm:px-0 ">
            {selectedFriend && (
                <div className="h-full flex flex-col justify-between">
                    <MessageContainer />
                </div>
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
