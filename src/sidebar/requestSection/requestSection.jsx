import React, {  useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { UserRoundPlus, UserX, HeartHandshake } from 'lucide-react';
import toast from 'react-hot-toast';
import Loading from './Loading';


const Requests = ({ setOpenRequest, setNewRequest, user, socket }) => {
  const closeCard = () => {
    setOpenRequest(false);
    setNewRequest(false);
  };

  const [requestsRecieved, setRequestsRecieved] = useState([]);
  const [loading, setLoading] = useState(false);

  const onAcceptClick = async (request) => {
    try {
      const response  = await axios.post(process.env.REACT_APP_BACKEND+'/api/new/addfriend', {
        userId: request._id,
        friendId: user._id,
      });
      if(response.data.success) toast.success("Friend Request Accepted")
      socket.emit('acceptedRequest', {
        userId: request._id,
        friendId: user._id,});   
        setRequestsRecieved(prevRequests => prevRequests.filter(req => req._id !== request._id))
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  
  const onDeclineClick = async (request) => {
    try {
        const reponse = await axios.put(process.env.REACT_APP_BACKEND + '/api/new/declinerequest', {
        senderId: request._id,
        recieverId: user._id,
      });
      toast.success(reponse.data.message);
      setRequestsRecieved(prevRequests => prevRequests.filter(req => req._id !== request._id));
    } catch (error) {
      toast.error('Error declining request');
    }
  };
  


  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND}/api/new/getrequestsall/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
          withCredentials: true
        });
        
        setRequestsRecieved(response.data.requestsRecieved);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requests:', error);
      }
    };
  
    fetchRequests();
  }, []);
  
  
  
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
                    {request.isGroup && <span className='text-blue-400 text-[12px] px-2 rounded-xl border border-blue-400'>Group Invite</span>}
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

const RequestSection = ({ user, socket, memoFetchFriends, text }) => {
  const [openRequest, setOpenRequest] = useState(false);
  const [newRequest, setNewRequest] = useState(false);

  const handleRequest = () => {
    setOpenRequest(!openRequest);
    if (!newRequest) {
      setNewRequest(true); // Mark as seen when opening requests
    }
  };

  useEffect(() => {
    if (openRequest) {
      setNewRequest(false); // Reset new request flag when closing
    }
  }, [openRequest]);

  return (
    <>
      <motion.div
        whileTap={{ scale: 0.95 }}
        className="request-section w-full flex items-center justify-center relative cursor-pointer  transition duration-300 ease-in-out"
        onClick={handleRequest}
      >
        {text ? (
          <span className='text-white'>{text}</span>
        ) : (
          <HeartHandshake size={32} className='bg-transparent hover:scale-110 transition '/>
        )}
        <div className={`h-4 w-4 ${newRequest ? 'block' : 'hidden'} bg-bg-primary animate-bounce absolute rounded-full -top-1 -right-1 border-2 border-white`}/>
      </motion.div>
      {openRequest && <Requests setNewRequest={setNewRequest} user={user} setOpenRequest={setOpenRequest} socket={socket} memoFetchFriends={memoFetchFriends} />}
    </>
  );
};


export default RequestSection;
