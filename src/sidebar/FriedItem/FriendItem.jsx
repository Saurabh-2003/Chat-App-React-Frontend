import React, {  useState } from "react";
import { EllipsisVertical } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "react-modal";
import { useAppContext } from "../../AppContext";

const FriendItem = ({  friend,  isSelected }) => {
  const { user, setSelectedFriend, selectedFriend, socket} = useAppContext();




  return (
    <div 
      onClick={() => setSelectedFriend(friend._id)} 
      className={`hover:bg-gray-700/30 cursor-pointer flex items-center text-slate-600 justify-between p-4 border-b border-b-slate-700 relative ${isSelected ? 'bg-gray-700/70' : ''}`}
    >
      <div className="w-12 h-12 flex-shrink-0">
        {friend.image ? (
          <img src={friend.image} alt={friend.name} className="w-full h-full rounded-full" />
        ) : (
          <img src="/placeholder.jpg" alt="Placeholder" className="w-full h-full rounded-full" />
        )}
      </div>
      <div className="flex-grow capitalize ml-4 text-lg text-stone-300/90 font-semibold select-none">{friend.name.split(" ")[0]}</div>
      <div className={` ${friend?.isGroup ? 'absolute' : 'hidden'} top-3 left-20 text-[10px] text-white bg-emerald-500
                      font-bold  rounded-full px-1`}>
      GROUP</div> 
    </div>
  );
};

export default FriendItem;
