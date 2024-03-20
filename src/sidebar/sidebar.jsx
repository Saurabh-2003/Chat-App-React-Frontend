// sidebar.jsx
import React from "react";
import { motion } from "framer-motion";
import FriendList from "./FriendList/FriendList";
import Settings from "./setting/setting.jsx";
function Sidebar() {


  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col max-sm:w-full h-full bg-gray-900 border-r border-r-slate-700 text-white w-[500px] "
    >
      <div className="flex items-center justify-between">
        <Settings />
      </div>
      <div className="flex flex-col overflow-y-auto">
        <FriendList />
      </div>
      
    </motion.div>
  );
}

export default Sidebar;