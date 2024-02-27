// sidebar.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import FriendList from "./FriendList/FriendList";
import AddFriendForm from "./AddFriend/AddFriendForm";
import Settings from "./setting/setting.jsx";
import RequestSection from "./requestSection/requestSection.jsx";
import toast from "react-hot-toast"
import Loading from "./Loading.jsx";

function Sidebar({ user, onFriendClick, socket }) {
  const [friends, setFriends] = useState([]);
  const [addFriend, setAddFriend] = useState("");
  const [loading, setLoading] = useState(true);

  const handleAddFriend = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Sending Request")
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND + "/api/new/sendrequest", {
        userId: user._id,
        email: addFriend,
      });
      toast.success("Request Sent Successfully!!");
      toast.dismiss(toastId);
      socket.emit("sendRequest", { user: user._id, email: addFriend });
      setAddFriend("");
    } catch (error) {
      toast.error("User does not exist or Invalid Email\n Please enter a valid email")
      toast.dismiss(toastId);
    }
  };

  const fetchFriends = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND+"/api/new/friends", {
        userId: user._id,
      });

      setFriends(response.data.friends);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  const memoFetchFriends = useCallback(fetchFriends, [user._id]);

  useEffect(() => {
    memoFetchFriends();
  }, [memoFetchFriends]);

  useEffect(() => {
    socket.on("requestAccepted", () => {
      console.log("Request accepted, updating friends list");
      memoFetchFriends();
    });
  }, [socket, memoFetchFriends]);

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col h-full bg-white rounded-2xl text-white w-72 py-10 px-4"
    >
      <div className="flex items-center justify-between mb-2">
        <Settings user={user} />
      </div>
      <div className="flex flex-col flex-grow">
        {
          loading ? <Loading />:
          <FriendList  memoFetchFriends={memoFetchFriends} socket={socket} friends={friends} onFriendClick={onFriendClick} user={user} />
        }
        <RequestSection user={user} socket={socket} memoFetchFriends={memoFetchFriends} />
      </div>
      <div className="mt-6">
        <AddFriendForm
          addFriend={addFriend}
          onAddFriendChange={(e) => setAddFriend(e.target.value)}
          onAddFriendSubmit={handleAddFriend}
        />
      </div>
    </motion.div>
  );
}

export default Sidebar;
