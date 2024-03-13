import React, { useState, useEffect, useRef } from "react";
import { Trash } from "lucide-react";
import axios from "axios";
import { motion } from "framer-motion";
import toast from "react-hot-toast"

const FriendItem = ({ socket, memoFetchFriends, setSelectedFriend, friend, selectedFriend, onFriendClick, user }) => {
  const [isConfirmationVisible, setConfirmationVisible] = useState(false);
  const confirmationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (confirmationRef.current && !confirmationRef.current.contains(event.target)) {
        setConfirmationVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const deleteFriend = async (event) => {
    event.stopPropagation(); // Stop event propagation
    console.log(friend.admin, user._id)
    try {
      if (friend.isGroup && friend.admin === user._id) {
        const res = await axios.delete(`${process.env.REACT_APP_BACKEND}/api/new/delete-group`, {
          data: { id: friend._id } 
        })
        if(res.data.success){
          toast.success(res.data.message)
        }
      } else {
        // Proceed with deleting the friend as usual
        await axios.delete(process.env.REACT_APP_BACKEND + "/api/new/removefriend", {
          data: {
            userId: user._id,
            friendId: friend._id,
          },
        });
      }
      socket.emit("friendDelete", {
        userId: user._id,
        friendId: friend._id,
      });
  
      if (selectedFriend === friend._id) {
        setSelectedFriend("");
      }
      memoFetchFriends()
    } catch (error) {
      console.error("Error deleting friend:", error);
    } finally {
      setConfirmationVisible(false);
    }
  };
  

  const showConfirmation = () => {
    setConfirmationVisible(!isConfirmationVisible);
  };

  const hideConfirmation = (e) => {
    e.stopPropagation(); // Stop event propagation
    setConfirmationVisible(false);
  };


  return (
    <div onClick={() => onFriendClick(friend._id)} className="hover:bg-gray-100  cursor-pointer flex items-center text-slate-600 justify-between p-4 border-b border-gray-200 relative">
      <div className="w-12 h-12 flex-shrink-0">
        {friend.image ? (
          <img src={friend.image} alt={friend.name} className="w-full h-full rounded-full" />
        ) : (
          <img src="/placeholder.jpg" alt="Placeholder" className="w-full h-full rounded-full" />
        )}
      </div>
      <div className="flex-grow capitalize ml-4 text-lg font-semibold select-none">{friend.name.split(" ")[0]}</div>
      <div className={` ${friend?.isGroup ? 'absolute' : 'hidden'} top-2 left-20 text-[10px] text-emerald-400
                      font-bold border-emerald-400 rounded-full border px-1`}>GROUP</div>
 
         <motion.div
         className={`delete-icon relative cursor-pointer`}
         onClick={(event) => {
           event.stopPropagation(); 
           showConfirmation();
         }}
         whileHover={{ scale: 1.3 }}
         whileTap={{ scale: 0.9 }}
       >
         <Trash className="w-6 h-6 text-red-500" />
       </motion.div>
      {isConfirmationVisible && (
        <div ref={confirmationRef} className="absolute right-0 mt-8 mr-4 bg-white border border-gray-200 rounded-lg p-4 shadow-md">
          <p className="text-xl font-semibold mb-2 text-center">ARE YOU SURE?</p>
          <div className="flex justify-between">
            <button onClick={deleteFriend} className="delete-accept bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md mr-2">
              Yes
            </button>
            <button onClick={(event) => hideConfirmation(event)} className="delete-reject bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-md">
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FriendItem;
