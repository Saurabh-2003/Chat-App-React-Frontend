import React, { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { Cross, Crosshair, UsersRound, X } from "lucide-react";
import { motion } from "framer-motion";

const AddFriendForm = ({ user, socket }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [addFriend, setAddFriend] = useState("");

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Sending Request");
    try {
      const response = await axios.post(
        process.env.REACT_APP_BACKEND + "/api/new/sendrequest",
        {
          userId: user._id,
          email: addFriend,
        }
      );
      toast.success("Request Sent Successfully!!");
      toast.dismiss(toastId);
      socket.emit("sendRequest", { user: user._id, email: addFriend });
      setAddFriend("");
    } catch (error) {
      toast.error(
        "User does not exist or Invalid Email\n Please enter a valid email"
      );
      toast.dismiss(toastId);
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
        className='bg-bg-primary/90 hover:bg-bg-primary active:bg-blue-700 h-12 w-12 rounded-full flex items-center justify-center shadow-lg'
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
            type="email"
            name="addFriend"
            placeholder="Enter an Email to send Request"
            value={addFriend}
            onChange={(e) => setAddFriend(e.target.value)}
            className="bg-gray-100 border text-slate-700 border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:border-blue-500 transition duration-300"
          />
          <button
            type="submit"
            className="bg-indigo-500 text-white px-6 py-1 rounded-md hover:bg-bg-primary transition duration-300"
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
