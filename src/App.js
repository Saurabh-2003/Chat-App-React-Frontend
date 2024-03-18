import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './navbar/navBar';
import Login from './login/login.jsx';
import Signup from './signup/signup.js';
import Home from './home/home.jsx';
import Chat from './chat/Chat.jsx';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useAppContext } from './AppContext'; 
import { io } from 'socket.io-client';

function App() {
  const {setSocket} = useAppContext();
  useEffect(() => {
    const socket = io.connect(process.env.REACT_APP_BACKEND);
    setSocket(socket)
    return () => {
      socket.disconnect(); 
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Router>
      <Toaster />
      <div className="App">
        <NavigationBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/chat/:id" element={<Chat />} />
        </Routes>
      </div>
    </Router>
  );
}

const WrappedApp = () => (
  <AppProvider>
    <App />
  </AppProvider>
);

export default WrappedApp;
