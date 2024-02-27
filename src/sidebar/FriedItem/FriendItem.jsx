import React, { useState } from "react";
import { Trash } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";

const FriendItem = ({ socket, memoFetchFriends, friend, onFriendClick, user }) => {
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  const deleteFriend = async () => {
    try {
      await axios.delete(process.env.REACT_APP_BACKEND+"/api/new/removefriend", {
        data: {
          userId: user._id,
          friendId: friend._id,
        },
      });
      socket.emit('friendDelete', {
        userId : user._id,
        friendId: friend._id
      })

    } catch (error) {
      console.error("Error deleting friend:", error);
    } finally {
      setConfirmationVisible(false);
    }
  };

  const showConfirmation = () => {
    setConfirmationVisible(!isConfirmationVisible);
  };

  const hideConfirmation = () => {
    setConfirmationVisible(false);
  };

  return (
    <div onClick={() => onFriendClick(friend._id)} className="hover:bg-gray-100 cursor-pointer flex items-center text-slate-600 justify-between p-4 border-b border-gray-200">
      <div className="w-12 h-12 flex-shrink-0">
        {friend.image ? (
          <img src={friend.image} alt={friend.name} className="w-full h-full rounded-full" />
        ) : (
          <img src="/placeholder.jpg" alt="Placeholder" className="w-full h-full rounded-full" />
        )}
      </div>
      <div className="flex-grow capitalize ml-4 text-lg font-semibold select-none">{friend.name.split(" ")[0]}</div>
      <motion.div
        className="delete-icon cursor-pointer"
        onClick={showConfirmation}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
      >
        <Trash className="w-6 h-6 text-red-500" />
      </motion.div>

      {isConfirmationVisible && (
        <div className=" absolute ml-48 mt-4 mr-4 bg-white border  border-gray-200 rounded-lg p-4">
          <p className=" text-xl text-center font-semibold mb-2">ARE YOU SURE?</p>
          <div className=" flex w-full justify-between">
            <button onClick={deleteFriend} className="delete-accept bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2">Yes</button>
            <button onClick={hideConfirmation} className="delete-reject bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">No</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendItem;
