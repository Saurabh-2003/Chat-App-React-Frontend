// sidebar.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import FriendList from "./FriendList/FriendList";
import Settings from "./setting/setting.jsx";
import Loading from "./Loading.jsx";
import RequestSection from "./requestSection/requestSection.jsx";
import CreateGroup from "./CreateGroup/CreateGroup.jsx";
import AddFriendForm from "./AddFriend/AddFriendForm.jsx";

function Sidebar({ user, onFriendClick, socket, setSelectedFriend, selectedFriend, setUser }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFriends = async () => {
    try {
      const response = await axios.post(process.env.REACT_APP_BACKEND + "/api/new/friends", {
        userId: user._id,
      });
      setFriends(response.data.friends);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching friends:", error);
    }
  };

  useEffect(() => {
    const fetchFriends1 = async () => {
      try {
        const response = await axios.post(process.env.REACT_APP_BACKEND + "/api/new/friends", {
          userId: user._id,
        });
        setFriends(response.data.friends);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };
    fetchFriends1();
  }, []);

  useEffect(() => {
    socket.on('requestAccepted', () => {
      fetchFriends();
    });
    return () => {
      socket.off('requestAccepted');
    };
  }, [fetchFriends, socket]);

  useEffect(() => {
    socket.on('deleteFriend', ()=> {
      fetchFriends();
    })
    return () => {
      socket.off('deleteFriend')
    }
  }, [socket, fetchFriends])

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col max-sm:w-full h-full bg-white border-r-2 text-white w-[500px] "
    >
      <div className="flex items-center justify-between">
        <Settings user={user} socket={socket} memoFetchFriends={fetchFriends} setUser={setUser} />
      </div>
      <div className="flex flex-col overflow-y-auto">
        {loading ? (
          <Loading />
        ) : friends.length === 0 ? (
          <div className="text-black w-full mt-8">
            <p className="text-center">No Friends</p>
            <div className="w-full hover:bg-bg-primary/80 mx-auto mt-4 flex flex-shrink justify-center gap-4  h-10 bg-bg-primary">
              <RequestSection text={"Invite Friends"} user={user} socket={socket} memoFetchFriends={fetchFriends} />
            </div>
          </div>
        ) : (
          <FriendList
            selectedFriend={selectedFriend}
            setSelectedFriend={setSelectedFriend}
            memoFetchFriends={fetchFriends}
            socket={socket}
            friends={friends}
            onFriendClick={onFriendClick}
            user={user}
          />
        )}
      </div>
      <div className=" mt-auto border-t-2 py-2 px-2  flex items-center gap-y-2 p">
          <AddFriendForm user={user} socket={socket} />
          <h2 className="text-black font-bold w-full text-center">Add Friend 
          <span className="text-xl text-indigo-600"> OR</span> Create Group</h2>
          <CreateGroup user={user} socket={socket} />
      </div>
    </motion.div>
  );
}

export default Sidebar;