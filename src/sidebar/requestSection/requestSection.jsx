import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserRoundPlus, UserX } from 'lucide-react';
import toast from 'react-hot-toast';

const Requests = ({ setOpenRequest, user, socket, memoFetchFriends }) => {
  const closeCard = () => {
    setOpenRequest(false);
  };

  const [requestsRecieved, setRequestsRecieved] = useState([]);

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
      const response = await axios.get(process.env.REACT_APP_BACKEND + '/api/new/getrequestsall', {
        params: { id: user._id },
      });
      setRequestsRecieved(response.data.requestsRecieved);
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
  })
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-white backdrop-blur-sm bg-opacity-50"
    >
      <div className=" overflow-auto bg-white rounded-lg shadow-lg p-4 w-96 h-2/3">
        <span className="absolute top-4 hover:bg-red-500 px-4  rounded-lg hover:text-white py-1 hover right-2 text-gray-700 cursor-pointer" onClick={closeCard}>
          Close
        </span>
        <div className=" text-slate-500">
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
      </div>
    </motion.div>
  );
};

function RequestSection({ user, socket, memoFetchFriends }) {
  const [openRequest, setOpenRequest] = useState(false);

  const handleRequest = () => {
    setOpenRequest(!openRequest);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="request-section relative w-full px-2 cursor-pointer bg-gray-200 text-slate-800 py-2 px-4transition duration-300 ease-in-out"
        onClick={handleRequest}
      >
        Friend Requests
        <div className='h-4 w-4 hidden bg-bg-primary animate-bounce absolute rounded-full -top-1 -right-1 border-2 border-white'/>
      </motion.div>
      {openRequest && <Requests user={user} setOpenRequest={setOpenRequest} socket={socket} memoFetchFriends={memoFetchFriends} />}
    </>
  );
}

export default RequestSection;
