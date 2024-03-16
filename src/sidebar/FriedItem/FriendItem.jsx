import React, { useEffect, useState } from "react";
import { Trash } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import Modal from "react-modal";

const FriendItem = ({ socket, memoFetchFriends, setSelectedFriend, friend, selectedFriend, onFriendClick, user, isSelected }) => {
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);

  const deleteFriend = async (event) => {
    event.stopPropagation();
    console.log(friend.admin, user._id);
    try {
      if (friend.isGroup && friend.admin === user._id) {
        const res = await axios.delete(`${process.env.REACT_APP_BACKEND}/api/new/delete-group`, {
          data: { id: friend._id } 
        });
        if(res.data.success){
          toast.success(res.data.message);
        }
      } else {
        const response = await axios.delete(process.env.REACT_APP_BACKEND + "/api/new/removefriend", {
          data: {
            userId: user._id,
            friendId: friend._id,
          },
        });

        if(response.data.success){
          toast.success(response.data.message);
        }
      }
      socket.emit("friendDelete", {
        userId: user._id,
        friendId: friend._id,
      });
  
      if (selectedFriend === friend._id) {
        setSelectedFriend("");
      }
    } catch (error) {
      console.error("Error deleting friend:", error);
    } finally {
      setConfirmationVisible(false);
    }
  };

  const cancelDeleteRequest = async(event) => {
    event.stopPropagation();
    setConfirmationVisible(false)
  }



  return (
    <div 
      onClick={() => onFriendClick(friend._id)} 
      className={`hover:bg-gray-100 cursor-pointer flex items-center text-slate-600 justify-between p-4 border-b border-gray-200 relative ${isSelected ? 'bg-gray-200' : ''}`}
    >
      <div className="w-12 h-12 flex-shrink-0">
        {friend.image ? (
          <img src={friend.image} alt={friend.name} className="w-full h-full rounded-full" />
        ) : (
          <img src="/placeholder.jpg" alt="Placeholder" className="w-full h-full rounded-full" />
        )}
      </div>
      <div className="flex-grow capitalize ml-4 text-lg font-semibold select-none">{friend.name.split(" ")[0]}</div>
      <div className={` ${friend?.isGroup ? 'absolute' : 'hidden'} top-3 left-20 text-[10px] text-white bg-emerald-500
                      font-bold  rounded-full px-1`}>GROUP</div>
 
      <motion.div
        className={`delete-icon relative cursor-pointer`}
        onClick={(event) => {
          event.stopPropagation(); 
          setConfirmationVisible(true);
        }}
        whileHover={{ scale: 1.3 }}
        whileTap={{ scale: 0.9 }}
      >
        <Trash className="w-6 h-6 text-red-500" />
      </motion.div>

      <Modal
        isOpen={isConfirmationVisible}
        onRequestClose={() => setConfirmationVisible(false)}
        className={`h-full w-full grid place-items-center`}
      >
        <div className="text-center bg-white rounded-md shadow-lg px-10 py-4">
          <p className="text-xl font-semibold mb-2">ARE YOU SURE?</p>
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
};

export default FriendItem;
