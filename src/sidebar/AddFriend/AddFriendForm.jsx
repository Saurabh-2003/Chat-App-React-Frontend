import React, { useState } from "react";
import Modal from "react-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { UsersRound, X } from "lucide-react";
import { motion } from "framer-motion";
import { useAppContext } from "../../AppContext";

const AddFriendForm = ({ isOpen, setIsOpen }) => {
  const { user, socket } = useAppContext();
  const [addFriend, setAddFriend] = useState("");
  const [isLoading, setIsLoading] = useState(false);



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
        }
      );
      toast.success(response.data.message);
      toast.dismiss(toastId);
      socket.emit("sendRequest", { user: user._id, email: addFriend });

      setAddFriend("");
    } catch (error) {
      toast.error(error.response.data.message);
      toast.dismiss(toastId);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddFriend(e);
  };

  return (
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        contentLabel="Add Friend Modal"
        className={`grid place-items-center h-full w-full select-none backdrop-blur-sm bg-black/70`}
      >
        <motion.form
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          onSubmit={handleSubmit}
          className="relative flex max-sm:h-full max-sm:justify-center pt-12 rounded-xl shadow-lg px-10 bg-gray-900 h-48 w-96 max-sm:w-full  flex-col space-y-2"
        >
          <h2 className="w-full text-stone-200 text-lg font-bold text-center">Add Friend</h2>
          <input
            disabled={isLoading}
            type="email"
            name="addFriend"
            placeholder="Enter an Email to send Request"
            value={addFriend}
            onChange={(e) => setAddFriend(e.target.value)}
            className="bg-gray-600 border text-slate-100 disabled:cursor-not-allowed border-gray-400 rounded-md px-2 py-1 focus:outline-none focus:border-emerald-500 transition duration-300"
          />
          <button
            type="submit"
            disabled={isLoading}
            className="bg-emerald-600 text-white px-6 py-1 disabled:cursor-wait rounded-md hover:bg-emerald-700 transition duration-300"
          >
            Send Request
          </button>

          <motion.button
            whileHover={{ scale: 1.2 }}
            className="absolute text-stone-300 top-0 right-2"
            onClick={closeModal}
          >
            <X />
          </motion.button>
        </motion.form>
      </Modal>
  );
};

export default AddFriendForm;
