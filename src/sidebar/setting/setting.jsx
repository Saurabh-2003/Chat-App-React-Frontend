import React, { useState, useEffect, useRef } from "react";
import { Settings, User, CircleUser, LogOut, UsersRound, Plus, X } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { Mail } from 'lucide-react';
import RequestSection from "../requestSection/requestSection";
import toast from 'react-hot-toast'
import axios from "axios";
import { useAppContext } from "../../AppContext";
import AddFriendForm from "../AddFriend/AddFriendForm";
import CreateGroup from "../CreateGroup/CreateGroup";

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
      className="fixed top-0 left-0 w-full h-full max-sm:w-screen flex justify-center items-center z-50 bg-black/70 backdrop-blur-sm"
    >
      <div className="bg-gray-900 max-sm:h-full max-sm:rounded-none max-sm:w-full h-[500px] w-[500px] rounded-lg p-8 shadow-lg">
        <span
          className="absolute top-4  hover:scale-110 px-4 rounded-lg hover:text-white py-1 hover right-2 text-gray-200 cursor-pointer"
          onClick={onClose}
        >
          <X/>
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
                className="block mt-10 mb-4 w-full focus:outline-emerald-600 disabled:cursor-not-allowed text-slate-200 bg-gray-700 outline-none rounded-md p-2"
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
             <div className="w-full  space-y-4 mt-8"> 
             <p className="text-slate-300 flex gap-x-16 py-2 border-b border-b-slate-600">
                <span>Name</span>
                <span> {editedUser.name}</span>
              </p>
              <p className="text-slate-300 flex gap-x-16 py-2 border-b border-b-slate-600">
                <span>Email</span> 
                <span>{editedUser.email}</span>
              </p>
             </div>
            </div>
          )}
          <div className="flex justify-center">
            {isEditing ? (
              <>
                <button
                  onClick={handleUpdate}
                  disabled={isLoading}
                  className="bg-emerald-600 disabled:bg-black disabled:cursor-wait hover:bg-emerald-700 border border-emerald-500 transition text-white px-4 py-2 rounded-md mr-2"
                >
                  {isLoading ? "Updating..." : "Update"}
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="bg-gray-600 hover:bg-gray-500 transition text-gray-200 px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-emerald-600 hover:bg-emerald-700 transition border border-emerald-500 text-white px-10 py-2 rounded-md mr-2"
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
  const { user } = useAppContext();
  const [isAddFriendOpen, setIsAddFriendOpen] = useState(false); // State for add friend modal
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false); // State for create group modal

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

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSettingsIconClick = () => {
    setSettingsMenuVisible((prevState) => !prevState);
    closeModals(); // Close all modals when settings menu opens
  };

  const handleUserInfoClick = (event) => {
    event.stopPropagation();
    setUserInfoVisible(true);
    setSettingsMenuVisible(false);
    closeModals(); // Close all modals when user info is clicked
  };

  const handleLogout = async (event) => {
    event.stopPropagation();
    await axios.post(`${process.env.REACT_APP_BACKEND}/api/new/logout`, {
      withCredentials: true,
    });
    navigate("/login");
  };

  const openAddFriendForm = (e) => {
    e.stopPropagation();
    setSettingsMenuVisible(false);
    setIsAddFriendOpen(true); // Open add friend modal
  };

  const openCreateGroupForm = (e) => {
    e.stopPropagation();
    setSettingsMenuVisible(false);
    setIsCreateGroupOpen(true); // Open create group modal
  };

  const closeModals = () => {
    setIsAddFriendOpen(false);
    setIsCreateGroupOpen(false);
  };

  return (
    <div className="flex select-none bg-gray-800  text-slate-400 w-full px-4  py-4 items-center justify-between">
      <div
        className="cursor-pointer"
        onClick={(event) => handleUserInfoClick(event)}
      >
        <img
          src={user.image ? user.image : "/placeholder.jpg"}
          alt="Profile"
          className={` size-10 rounded-full `}
          title="Profile"
        />
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
            <div
              ref={menuRef}
              className="absolute shadow-black border border-slate-700 bg-gray-800 mt-2  max-sm:right-0  shadow-md w-max z-10 rounded-md overflow-hidden flex flex-col"
            >
              <div
                className="flex items-center py-4 gap-2  px-2 hover:bg-gray-900"
                onClick={(e) => openAddFriendForm(e)}
              >
                <UsersRound /> Add a Friend
              </div>
              <div
                className="flex items-center gap-2 py-4 px-2 hover:bg-gray-900"
                onClick={(e) => openCreateGroupForm(e)}
              >
                <Plus /> New Group
              </div>
              <div
                className="cursor-pointer py-4 gap-2 px-2 flex w-full  hover:bg-gray-900"
                onClick={(event) => handleLogout(event)}
              >
                <LogOut className="inline-block mr-1" />
                Logout
              </div>
            </div>
          )}
        </motion.div>
      </div>
      {/* Render AddFriendForm modal */}
      <AddFriendForm isOpen={isAddFriendOpen} setIsOpen={setIsAddFriendOpen} />
      {/* Render CreateGroup modal */}
      <CreateGroup isOpen={isCreateGroupOpen} setIsOpen={setIsCreateGroupOpen} />
      {isUserInfoVisible && (
        <UserInfoCard onClose={() => setUserInfoVisible(false)} />
      )}
    </div>
  );
};

export default Setting;

