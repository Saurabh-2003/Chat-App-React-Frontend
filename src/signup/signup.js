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

    setIsLoading(true);

    try {
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json', 
        }
      }
      const response = await axios.post(process.env.REACT_APP_BACKEND + '/api/new/signup', {
          name,
          email,
          password,
      }, config);
      setIsLoading(false);
      toast.success("Register Successful", response.message);
      navigate('/login');
  } catch (error) {
      setIsLoading(false);
      if (error.response && error.response.data && error.response.data.errors) {
          const errors = error.response.data.errors;
          toast.error(
              <ul className="text-sm">
                  {errors.map((err, index) => (
                      <li key={index} className="text-red-500">{index + 1}) {err}</li>
                  ))}
              </ul>
          );
      } else {
          toast.error(error.response.data.message);
      }
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
        className="max-w-md max-sm:max-w-full flex items-center flex-col justify-center max-sm:p-0 p-8 max-sm:w-full max-sm:rounded-none max-sm:h-full w-full bg-white shadow-lg rounded-lg overflow-hidden"
      >
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
      </motion.div>
    </div>
  );
}

export default Signup;
