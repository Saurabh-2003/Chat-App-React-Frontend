import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavigationBar from './navbar/navBar';
import Login from './login/login.jsx';
import Signup from './signup/signup.js';
import Home from './home/home.jsx';
import Chat from './chat/Chat.jsx';
import {Toaster} from 'react-hot-toast'

function App() {
  return (
    <Router>
      <Toaster/>
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


export default App;
