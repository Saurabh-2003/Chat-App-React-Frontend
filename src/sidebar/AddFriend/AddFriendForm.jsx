import React, { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { UsersRound, X } from "lucide-react";
import { motion } from "framer-motion";
import {useAppContext} from "../../AppContext";


const AddFriendForm = () => {
  const {user, socket} = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [addFriend, setAddFriend] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const toastId = toast.loading("Sending Request");
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/new/sendrequest",
        {
          userId: user._id,
          email: addFriend,
        }, 
      );
      toast.success(response.data.message);
      toast.dismiss(toastId);
      socket.emit("sendRequest", { user: user._id, email: addFriend });
      
      setAddFriend("");
    } catch (error) {
      toast.error(error.response.data.message);
      toast.dismiss(toastId);
    } finally{
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddFriend(e);
  };

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.1 }}
        className='bg-indigo-600 h-10 w-10 rounded-full flex items-center justify-center shadow-lg'
        onClick={openModal}
        title="Click to add a friend"
      >
        <UsersRound />
      </motion.button>
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Add Friend Modal"
        className={`grid place-items-center h-full w-full select-none backdrop-blur-sm bg-white/20`}
      >
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="relative flex pt-12 rounded-xl shadow-lg px-10 bg-white h-48 w-96 max-sm:w-full  flex-col space-y-2"
        >
          <h2 className="w-full text-lg font-bold text-center">Add Friend</h2>
          <input
            disabled={isLoading}
            type="email"
            name="addFriend"
            placeholder="Enter an Email to send Request"
            value={addFriend}
            onChange={(e) => setAddFriend(e.target.value)}
            className="bg-gray-100 border text-slate-700 disabled:cursor-not-allowed border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 transition duration-300"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-indigo-500 text-white px-6 py-1 disabled:cursor-wait rounded-md hover:bg-bg-primary transition duration-300"
          >
            Send Request
          </button>

          <motion.button
            whileHover={{ scale: 1.2 }}
            className="absolute top-0 right-0"
            onClick={closeModal}
          >
            <X />
          </motion.button>
        </motion.form>
      </Modal>
    </div>
  );
};

export default AddFriendForm;
