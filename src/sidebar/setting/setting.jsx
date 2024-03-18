import React, { useState, useEffect, useRef } from "react";
import { Settings, User, CircleUser, LogOut } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Mail } from 'lucide-react';
import RequestSection from "../requestSection/requestSection";
import toast from 'react-hot-toast'
import axios from "axios";
import { useAppContext } from "../../AppContext";

const UserInfoCard = ({ onClose }) => {
  const {  user, setUser} = useAppContext();
  const [editedUser, setEditedUser] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const updateProfile = async () => {
    try {
      const formData = new FormData();
      formData.append('name', editedUser.name);
      formData.append('image', editedUser.image);
      formData.append('email', editedUser.email);
  
      const res = await axios.put(process.env.REACT_APP_BACKEND+'/api/new/updateprofile', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Important to set the correct content type
          'withCredentials': true
        }
      });
      editedUser.name = res.data.user.name;
      editedUser.image = res.data.user.image;
      setUser(res.data.user)
      return res.data;
    } catch (error) {
      throw error;
    }
  };



  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      const data  = await updateProfile(); // Make sure to await the asynchronous function
      setIsEditing(false);
      setIsLoading(false);
      if(data.success ){
        toast.success(data.message)
      }
    } catch (error) {
      setIsLoading(false);
      toast.error(error.message); // Access error.message to display the error message
    }
  };
  

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      const imageDataUrl = reader.result; // This is the base64 representation of the image
      setEditedUser((prevUser) => ({
        ...prevUser,
        image: imageDataUrl,
      }));
    };
    reader.readAsDataURL(file);
  };


  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.05 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 w-full h-full max-sm:w-screen flex justify-center items-center z-50 bg-white backdrop-blur-sm bg-opacity-50"
    >
      <div className="bg-white max-sm:h-full max-sm:rounded-none max-sm:w-full h-[500px] w-[500px] rounded-lg p-8 shadow-lg">
        <span
          className="absolute top-4 hover:bg-red-500 px-4 rounded-lg hover:text-white py-1 hover right-2 text-gray-700 cursor-pointer"
          onClick={onClose}
        >
          Close
        </span>
        {isEditing && (
          <label htmlFor="avatar" className="block mb-4 w-full">
            <img
              src={editedUser.image ? editedUser.image : "/placeholder.jpg"}
              alt="Profile"
              className={`w-40 h-40 rounded-full  mx-auto  border-4 border-gray-400 ${isLoading && 'cursor-not-allowed'}`}
            />
          </label>
        )}
        {isEditing && (
          <input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleAvatarChange}
            className="hidden disabled:cursor-progress"
            disabled={isLoading}
          />
        )}
        <div className="mt-4">
          {isEditing ? (
            <>
              <input
                type="text"
                name="name"
                value={editedUser.name}
                onChange={handleInputChange}
                className="block mt-10 mb-4 w-full border disabled:cursor-not-allowed text-slate-700 border-gray-300 rounded-md p-2"
                disabled={isLoading}
              />
            </>
          ) : (
            <div className="flex flex-col items-center justify-start gap-4  mb-8">
              <img
                src={editedUser.image ? editedUser.image : "/placeholder.jpg"}
                alt="Profile"
                className="w-40 h-40 rounded-full mx-auto"
              />
              <p className="text-slate-700">
                <User size={40} className="inline-block mr-1 text-indigo-500" /> {editedUser.name}
              </p>
              <p className="text-slate-700">
                <Mail size={40} className="inline-block mr-1 text-indigo-500" /> {editedUser.email}
              </p>
            </div>
          )}
          <div className="flex justify-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="bg-indigo-500 disabled:bg-black disabled:cursor-wait hover:bg-indigo-600 transition text-white px-4 py-2 rounded-md mr-2"
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-200 hover:bg-gray-300 transition text-gray-700 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-indigo-500 hover:bg-indigo-600 transition text-white px-10 py-2 rounded-md mr-2"
              >
                Edit
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};



const Setting = () => {
  const [isSettingsMenuVisible, setSettingsMenuVisible] = useState(false);
  const [isUserInfoVisible, setUserInfoVisible] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);
  const menuIconRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        menuIconRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuIconRef.current.contains(event.target)
      ) {
        setSettingsMenuVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSettingsIconClick = () => {
    setSettingsMenuVisible(prevState => !prevState);
  };

  const handleUserInfoClick = (event) => {
    event.stopPropagation();
    setUserInfoVisible(true);
    setSettingsMenuVisible(false);
  };
  
  const handleLogout = async (event) => {
    event.stopPropagation();
    await axios.post(
        `${process.env.REACT_APP_BACKEND}/api/new/logout`,
        { withCredentials: true } 
    );
    navigate('/login');
};


  return (
    <div className="flex select-none bg-indigo-600 text-white w-full px-4 border-b-2 py-4 items-center justify-between">
      <div className="flex items-center gap-x-2">
        <img className="size-10"  alt="dummyImage" src="/icon.png" />
        <div className="text-xl font-bold capitalize">ChitChat</div>
      </div>
      <div className="flex gap-x-2 relative">
        <RequestSection />
        <motion.div
          className=" cursor-pointer"
          onClick={handleSettingsIconClick}
          ref={menuIconRef}
        >
          <Settings size={30} className="inline-block hover:scale-110" />
          {isSettingsMenuVisible && (
            <div ref={menuRef} className="absolute mt-2 border max-sm:right-0 bg-white shadow-md w-48  z-10 rounded-md overflow-hidden flex flex-col">
              <div 
                className="cursor-pointer py-4 border-b gap-2 px-2 flex w-full text-indigo-600 hover:text-slate-100 hover:bg-indigo-600" 
                onClick={(event) => handleUserInfoClick(event)}
              >
                <CircleUser className="inline-block mr-1" />User Info
              </div>
              <div 
                className="cursor-pointer py-4 border-b gap-2 px-2 flex w-full text-red-500 hover:text-slate-100 hover:bg-red-500" 
                onClick={(event) => handleLogout(event)}
              >
                <LogOut className="inline-block mr-1" />Logout
              </div>
            </div>
          )}
        </motion.div>
      </div>
      {isUserInfoVisible && <UserInfoCard onClose={() => setUserInfoVisible(false)} />}
    </div>
  );
};

export default Setting;
