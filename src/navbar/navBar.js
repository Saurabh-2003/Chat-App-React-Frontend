import React from 'react';
import icon from "../images/icon.png";
import { Link, useLocation } from 'react-router-dom';

function NavigationBar() {
    const location = useLocation();
    const currentPath = location.pathname;

    if (currentPath.startsWith('/chat')) {
        return null;
    }

    return (
            <nav className='flex items-center  bg-white/10 fixed z-50 w-full max-sm:px-4  px-10 py-2'>
                <div className=' flex w-full items-center justify-between flex-wrap text-slate-500 text-lg'> 
                    <div className='flex items-center'>
                        <img className='h-8 w-8 ml-4' src={icon} alt='site-icon'/> 
                        <span className='font-bold max-sm:hidden'>Chat App</span>
                    </div>
                    <div className='flex gap-4 items-center '>
                        <Link to='/'> <div className='px-4 py-1 hover:bg-bg-primary transition-colors duration-300 hover:text-text-primary'> Home</div> </Link>
                        <Link to='/login'> <div className='px-4 py-1 hover:bg-bg-primary transition-colors duration-300 hover:text-text-primary'>Login</div></Link>
                        <Link to='/signup'><div className='px-4 py-1 hover:bg-bg-primary transition-colors duration-300 hover:text-text-primary'>SignUp</div></Link>
                    </div>
                </div>
            </nav>
    );
}

export default NavigationBar;