import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserRoundPlus, UserX, UserSquare, LucidePersonStanding, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import AddFriendForm from '../AddFriend/AddFriendForm';
import Loading from './Loading';


const Requests = ({ setOpenRequest, setNewRequest, user, socket, memoFetchFriends }) => {
  const closeCard = () => {
    setOpenRequest(false);
    setNewRequest(false);
  };

  const [requestsRecieved, setRequestsRecieved] = useState([]);
  const [loading, setLoading] = useState(false);
  const [addFriend, setAddFriend] = useState("");

  const onAcceptClick = async (request) => {
    try {
      await axios.post(process.env.REACT_APP_BACKEND+'/api/new/addfriend', {
        userId: request._id,
        friendId: user._id,
      });
      socket.emit('acceptedRequest', { to: user._id, from: request._id });
      memoFetchFriends();
    } catch (error) {
      toast.error('Error accepting request');
    }
  };

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


  const onDeclineClick = async (request) => {
    try {
      await axios.put(process.env.REACT_APP_BACKEND + '/api/new/declinerequest', {
        senderId: request._id,
        recieverId: user._id,
      });
      socket.emit('declineRequest', { to: user._id, from: request._id });
    } catch (error) {
      toast.error('Error declining request');
    }
  };

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const response = await axios.get(process.env.REACT_APP_BACKEND + '/api/new/getrequestsall', {
        params: { id: user._id },
      });
      setRequestsRecieved(response.data.requestsRecieved);
      setLoading(false)
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };

  const memoizedFetchRequests = useCallback(fetchRequests, [user._id]);

  useEffect(() => {
    socket.on('requestAccepted', () => {
      memoizedFetchRequests();
    });
    socket.on('requestDeclined', () => {
      memoizedFetchRequests();
    });
    return () => {
      socket.off('requestAccepted');
      socket.off('requestDeclined');
    };
  }, [memoizedFetchRequests, socket]);


  useEffect(() => {
    memoizedFetchRequests();
  }, [])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-white backdrop-blur-sm bg-opacity-50"
    >
      <div className=" overflow-auto max-sm:pt-10 max-sm:px-2 bg-white rounded-lg shadow-lg p-4 max-sm:w-full max-sm:h-full w-96 h-2/3">
        <span className="absolute max-sm:top-0 top-4 hover:bg-red-500 px-4  rounded-lg hover:text-white py-1 hover max-sm:right-0 right-2 text-gray-700 cursor-pointer" onClick={closeCard}>
          Close
        </span>
        <div className='my-4'>
          <AddFriendForm
            addFriend={addFriend}
            onAddFriendChange={(e) => setAddFriend(e.target.value)}
            onAddFriendSubmit={handleAddFriend}
          />
        </div>
        <div className=" text-slate-500">
          <div className='text-center text-lg mb-4 bg-stone-100 shadow-md'> Requests</div>
          {
            loading ? <Loading count={10}/> :
            <div>
            {requestsRecieved.length === 0 ? (
              <p className="text-center">NO FRIEND REQUESTS RECEIVED</p>
            ) : (
              <div>
                {requestsRecieved.map((request) => (
                  <div key={request._id} className="request-single flex justify-between items-center py-2">
                    <span>{request.name.toUpperCase()}</span>
                    <div className="icons-here flex">
                      <button
                        onClick={() => onAcceptClick(request)}
                        className="accept-button bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md mr-2 transition duration-300 ease-in-out"
                      >
                        <UserRoundPlus className="w-6 h-6" />
                      </button>
                      <button
                        onClick={() => onDeclineClick(request)}
                        className="decline-button bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition duration-300 ease-in-out"
                      >
                        <UserX className="w-6 h-6" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          }
        </div>
      </div>
    </motion.div>
  );
};

const RequestSection = ({ user, socket, memoFetchFriends , text }) => {
  const [openRequest, setOpenRequest] = useState(false);
  const [newRequest, setNewRequest] = useState(false);

  const handleRequest = () => {
    setOpenRequest(!openRequest);
    if (!newRequest) {
      setNewRequest(true); // Mark as seen when opening requests
    }
  };

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_BACKEND + '/api/new/getrequestsall', {
          params: { id: user._id },
        });
        if (response.data.requestsRecieved.length > 0) {
          setNewRequest(true);
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };

    fetchRequests();
  }, [newRequest, user._id]);

  useEffect(() => {
    if (openRequest) {
      setNewRequest(false); // Reset new request flag when closing
    }
  }, [openRequest]);

  return (
    <>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="request-section w-full flex items-center justify-center relative cursor-pointer text-slate-800 transition duration-300 ease-in-out"
        onClick={handleRequest}
      >
        {text ? (
          <span className='text-white'>{text}</span>
        ) : (
          <HeartHandshake size={32} className='bg-transparent hover:scale-110 transition hover:text-bg-primary'/>
        )}
        <div className={`h-4 w-4 ${newRequest ? 'block' : 'hidden'} bg-bg-primary animate-bounce absolute rounded-full -top-1 -right-1 border-2 border-white`}/>
      </motion.div>
      {openRequest && <Requests setNewRequest={setNewRequest} user={user} setOpenRequest={setOpenRequest} socket={socket} memoFetchFriends={memoFetchFriends} />}
    </>
  );
};

export default RequestSection;
