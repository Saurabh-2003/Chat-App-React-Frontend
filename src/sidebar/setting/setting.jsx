import React, { useState, useEffect, useRef } from "react";
import { Settings, User, CircleUser, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Facebook, Instagram, Twitter, Mail, Phone } from 'lucide-react';


const UserInfoCard = ({ user, onClose, onUpdate }) => {
  const [editedUser, setEditedUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser(prevUser => ({
      ...prevUser,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    if (
      editedUser.avatar !== user.avatar ||
      editedUser.name !== user.name ||
      editedUser.email !== user.email
    ) {
      await onUpdate(editedUser);
      onClose();
    } else {
      // Handle case where no changes were made
      console.log("No changes were made.");
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setEditedUser(prevUser => ({
        ...prevUser,
        avatar: reader.result
      }));
    };
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-white backdrop-blur-sm bg-opacity-50"
    >
      <div className="bg-white max-sm:h-full max-sm:w-full h-[500px] w-[500px] rounded-lg p-8 max-w-md shadow-lg">
        <span className="absolute top-4 hover:bg-red-500 px-4  rounded-lg hover:text-white py-1 hover right-2 text-gray-700 cursor-pointer" onClick={onClose}>
         Close
        </span>
        <img
          src={user.avatar ? user.avatar : "/placeholder.jpg"}
          alt="Profile"
          className="w-40 h-40 rounded-full mx-auto mb-4"
        />
        <div className="mt-4">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="block mt-20 mb-4 w-full border border-gray-300 text-slate-700 rounded-md p-2 "
              />
              <input
                type="email"
                name="email"
                value={editedUser.email}
                onChange={handleInputChange}
                className="block text-slate-700 mb-8  w-full border border-gray-300 rounded-md p-2"
              />
            </>
          ) : (
            <div className="flex flex-col justify-start gap-4 mt-20 mb-8">
              <p className=" text-slate-700">
                <User size={40} className="inline-block mr-1 text-indigo-500" /> {user.name}
              </p>
              <p className=" text-slate-700">
                <Mail size={40} className="inline-block mr-1 text-indigo-500" /> {user.email}
              </p>
            </div>
          )}
          <div className="flex justify-center">
            {isEditing ? (
              <div> 
                <button onClick={handleUpdate} className="bg-indigo-500 hover:bg-bg-primary hover:scale-105 transition text-white px-4 py-2 rounded-md mr-2">Update</button>
              <button onClick={() => setIsEditing(false)} className="bg-gray-200 hover:scale-105 hover:bg-gray-300 transition text-gray-700 px-4 py-2 rounded-md">Cancel</button>
                </div>
              ) : (
              <button onClick={() => setIsEditing(true)} className=" bg-indigo-500 hover:bg-bg-primary hover:scale-105 transition text-white px-10 py-2 rounded-md mr-2">Edit</button>
            )}
            
          </div>
        </div>
      </div>
    </motion.div>
  );
};




const Setting = ({ user }) => {
  const [isSettingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [isUserInfoVisible, setUserInfoVisible] = useState(false);
  const navigate = useNavigate();

  const handleSettingsIconClick = () => {
    setSettingsMenuVisible(prevState => !prevState);
  };

  const handleUserInfoClick = () => {
    setUserInfoVisible(true);
    setSettingsMenuVisible(false);
  };

  const handleLogout = () => {
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".settings-menu")) {
        setSettingsMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex w-full   px-4 shadow-md border py-2 rounded-2xl items-center justify-between ">
      <div className="text-slate-700 text-xl capitalize">{(user.name.split(' '))[0]}</div>
      <div className="cursor-pointer text-slate-800 " onClick={handleSettingsIconClick}>
        <Settings size={30} className="inline-block hover:text-bg-primary" />
      </div>
      {isSettingsMenuVisible && (
        <div className="settings-menu translate-x-56 bg-white shadow-md absolute w-40 rounded-md overflow-hidden flex flex-col gap-3">
          <div 
          className="cursor-pointer py-2 px-2 flex w-full text-blue-500 hover:text-slate-100 hover:bg-blue-500" 
          onClick={handleUserInfoClick}>
            <CircleUser className="inline-block mr-1" />User Info
          </div>
          <div className="text-red-500 px-2 py-2 hover:bg-red-500 hover:text-slate-100 cursor-pointer" onClick={handleLogout}>
            <LogOut className="inline-block mr-1" />Logout
          </div>
        </div>
      )}
      {isUserInfoVisible && <UserInfoCard user={user} onClose={() => setUserInfoVisible(false)} />}
    </div>
  );
};

export default Setting;
