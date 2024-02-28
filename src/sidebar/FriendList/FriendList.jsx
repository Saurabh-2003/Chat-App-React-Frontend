import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import FriendItem from "../FriedItem/FriendItem.jsx";
import toast from 'react-hot-toast';

const FriendList = ({ memoFetchFriends, selectedFriend, friends, onFriendClick, socket, user, setSelectedFriend }) => {
  socket.on('deleteFriend', () => {
    toast.success("Friend deleted successfully");
    memoFetchFriends();
  });

  return (
    <ul className=" h-full">
      <AnimatePresence>
        {friends.map((friend, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <FriendItem
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
              socket={socket} 
              memoFetchFriends={memoFetchFriends} 
              friend={friend} 
              onFriendClick={onFriendClick} 
              user={user}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
  );
};

export default FriendList;
