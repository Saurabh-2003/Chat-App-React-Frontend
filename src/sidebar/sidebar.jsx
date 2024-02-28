// sidebar.jsx
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import FriendList from "./FriendList/FriendList";
import Settings from "./setting/setting.jsx";
import Loading from "./Loading.jsx";
import RequestSection from "./requestSection/requestSection.jsx";


function Sidebar({ user, onFriendClick, socket, setSelectedFriend, selectedFriend }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);



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
      className="flex flex-col max-sm:w-full max-sm:rounded-none h-full bg-white rounded-2xl text-white w-72 py-10 px-4"
    >
      <div className="flex items-center justify-between mb-2">
        <Settings 
          user={user} 
          socket={socket} 
          memoFetchFriends={memoFetchFriends}
          
        />
      </div>
      <div className="flex flex-col overflow-y-auto">
      {
        loading ? <Loading /> :
        (
          friends.length === 0 ? 
          <div className="text-black w-full mt-8">
              <p className="text-center">No Friends</p>
              <div className="w-full hover:bg-bg-primary/80 mx-auto mt-4 flex flex-shrink justify-center gap-4  h-10 bg-bg-primary">
                  <RequestSection text={"Invite Friends"} user={user} socket={socket} memoFetchFriends={memoFetchFriends}/>
              </div>
          </div> :
          <FriendList 
            selectedFriend={selectedFriend}  
            setSelectedFriend={setSelectedFriend}  
            memoFetchFriends={memoFetchFriends} 
            socket={socket} 
            friends={friends} 
            onFriendClick={onFriendClick} 
            user={user}
          />
        )
      }

      </div>
    </motion.div>
  );
}

export default Sidebar;
