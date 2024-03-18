// sidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import FriendList from "./FriendList/FriendList";
import Settings from "./setting/setting.jsx";
import CreateGroup from "./CreateGroup/CreateGroup.jsx";
import AddFriendForm from "./AddFriend/AddFriendForm.jsx";
function Sidebar() {


  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col max-sm:w-full h-full bg-white border-r-2 text-white w-[500px] "
    >
      <div className="flex items-center justify-between">
        <Settings />
      </div>
      <div className="flex flex-col overflow-y-auto">
        <FriendList />
      </div>
      <div className=" mt-auto border-t-2 py-2 px-2  flex items-center gap-y-2 p">
          <AddFriendForm  />
          <h2 className="text-black font-bold w-full text-center">Add Friend 
          <span className="text-xl text-indigo-600"> OR</span> Create Group</h2>
          <CreateGroup />
      </div>
    </motion.div>
  );
}

export default Sidebar;