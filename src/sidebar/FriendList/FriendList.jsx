import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FriendItem from "../FriedItem/FriendItem.jsx";
import { useAppContext } from "../../AppContext.jsx";
import Loading from "./Loading.jsx";
import axios from "axios";

const FriendList = () => {
  const {user, socket} = useAppContext()
  const {selectedFriend} = useAppContext();
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function for fecthing the updated friends:
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


  // WHen Compoennt Mounted the initial friends should be set :
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
    <>{
      loading ? 
      <Loading/> :
      friends.length === 0 ? (
        <div className="text-black w-full mt-8">
          <p className="text-center">No Contacts yet</p>
          
        </div>
      ) : (
        <ul className="h-full">
      <AnimatePresence>
        {friends.map((friend, index) => (
          <motion.li
            key={index}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5 }}
          >
            <FriendItem
              isSelected={friend._id === selectedFriend}
              friend={friend} 
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </ul>
      )
    }
    </>
  );
};

export default FriendList;
