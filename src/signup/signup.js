import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { motion } from "framer-motion";
import Loading from "../utils/Loading"
import toast from 'react-hot-toast'


function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Set isLoading to true when the user submits the form
    setIsLoading(true);

    try {
      // Make request to backend for signup
      const response = await axios.post(process.env.REACT_APP_BACKEND+'/api/new/signup', {
        name,
        email,
        password,
      });

      // Handle Successful Signup :
      setIsLoading(false);
      toast.success("Register Successful",response.message)
      navigate('/login');
    } catch (error) {
      
      toast.error('signup failed : ', error)
      setIsLoading(false);
    }
  };

  if(isLoading)
    return (<Loading />)

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-md w-full bg-white shadow-lg rounded-lg overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl text-slate-700 text-center font-bold mb-4">Sign Up</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <motion.input
                type="text"
                id="name"
                placeholder="Username"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-4 focus:outline-none focus:border-indigo-500"
                whileFocus={{ scale: 1.05 }}
              />
            </div>
            <div className="space-y-2">
              <motion.input
                type="email"
                id="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-4 focus:outline-none focus:border-indigo-500"
                whileFocus={{ scale: 1.05 }}
              />
            </div>
            <div className="space-y-2">
              <motion.input
                type="password"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full border-gray-300 rounded-md shadow-sm py-2 px-4 focus:outline-none focus:border-indigo-500"
                whileFocus={{ scale: 1.05 }}
              />
            </div>
            <motion.button
              type='submit'
              className="w-full bg-indigo-500 text-white py-3 rounded-md hover:bg-indigo-600 transition duration-300 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              disabled={isLoading}
            >
               Register
            </motion.button>
          </form>
          <p className="mt-4 text-sm text-center">
            Already have an account? <Link to='/login' className="text-indigo-500 hover:underline">Log in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}

export default Signup;
