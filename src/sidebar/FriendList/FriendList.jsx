import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import FriendItem from "../FriedItem/FriendItem.jsx";

const FriendList = ({ memoFetchFriends, selectedFriend, friends, onFriendClick, socket, user, setSelectedFriend }) => {


  return (
    <ul className="h-full">
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
              isSelected={friend._id === selectedFriend}
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
