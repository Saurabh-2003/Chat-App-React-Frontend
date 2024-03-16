import React from 'react';
import icon from "../images/icon.png";
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

function NavigationBar() {
    const location = useLocation();
    const currentPath = location.pathname;

    if (currentPath.startsWith('/chat')) {
        return null;
    }

    return (
        <motion.nav
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex items-center bg-white/10 fixed z-50 w-full max-sm:px-4 px-10 py-2'
        >
            <div className='flex w-full items-center justify-between flex-wrap text-slate-500 text-lg'>
                <div className='flex items-center'>
                    <img className='h-8 w-8 ml-4' src={icon} alt='site-icon' />
                    <span className='font-bold max-sm:hidden'>ChitChat</span>
                </div>
                <div className='flex gap-4 items-center '>
                    <Link to='/'>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='px-4 py-1 hover:bg-bg-primary transition-colors duration-300 hover:text-text-primary'
                        >
                            Home
                        </motion.div>
                    </Link>
                    <Link to='/login'>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='px-4 py-1 hover:bg-bg-primary transition-colors duration-300 hover:text-text-primary'
                        >
                            Login
                        </motion.div>
                    </Link>
                    <Link to='/signup'>
                        <motion.div
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className='px-4 py-1 hover:bg-bg-primary transition-colors duration-300 hover:text-text-primary'
                        >
                            SignUp
                        </motion.div>
                    </Link>
                </div>
            </div>
        </motion.nav>
    );
}

export default NavigationBar;
