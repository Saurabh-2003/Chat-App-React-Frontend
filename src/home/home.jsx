import React from "react";
import { useNavigate } from 'react-router-dom';
import Footer from "../footer/footer";
import { KeyRound, UsersRound, Repeat2, BookUser } from 'lucide-react';
import { Lamp } from "../utils/Lamp";
import { motion } from "framer-motion";

function Home() {
    const navigate = useNavigate();

    return (
        <main className="w-full bg-gray-100">

            {/* Hero Section */}
            <div className="flex flex-wrap w-full">
                <Lamp />
            </div>

            {/* Second Panel */}
            <div className="flex flex-col mt-10 select-none gap-10 w-full">
                <p className="text-5xl font-bold text-slate-700 text-center">Features</p>
                <div className="grid gap-6 lg:grid-cols-4 h-fit md:grid-cols-2 px-10 sm:grid-cols-1">
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-40 gap-2 text-center flex justify-center text-xl flex-col items-center rounded-xl bg-white "
                    >
                        <Repeat2 className="text-indigo-500" size={60} />
                        Seamless Connection
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-40 gap-2 text-center flex justify-center text-xl flex-col items-center rounded-xl bg-white "
                    >
                        <KeyRound className="text-indigo-500" size={50} />
                        Privacy and Security
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-40 gap-2 text-center flex justify-center text-xl flex-col items-center rounded-xl bg-white "
                    >
                        <UsersRound className="text-indigo-500" size={50} />
                        Connect Around The World
                    </motion.div>
                    <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="h-40 gap-2 flex text-center justify-center text-xl flex-col items-center rounded-xl bg-white "
                    >
                        <BookUser className="text-indigo-500" size={50} />
                        Create Groups
                    </motion.div>
                </div>
            </div>

            {/* Third panel */}

            <div className="w-full mt-20 gap-16 lg:px-40 max-md:px-20 max-sm:px-0 flex flex-col items-center justify-center text-text-primary">
                <div className="flex gap-10 bg-white rounded-xl overflow-hidden pl-10 items-center w-full ">
                    <div className="w-1/2">
                        <h1 className="text-4xl text-indigo-500">Keep in touch with your groups</h1>
                        <p className="text-lg text-slate-700">Whether it's planning an outing with friends or simply staying on top of your family chats, group conversations should feel effortless.</p>
                    </div>
                    <img className="w-1/2 h-[400px] object-cover" src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8Z3JvdXAlMjBjaGF0fGVufDB8fDB8fHww" alt="Group Communication" />
                </div>
                <div className="bg-white rounded-xl overflow-hidden pr-10 flex gap-10 items-center w-full mt-10 ">
                    <img className="w-1/2 object-cover h-[400px]" src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fGdyb3VwJTIwY2hhdHxlbnwwfHwwfHx8MA%3D%3D" alt="End-to-end Encryption" />
                    <div className="w-1/2">
                        <h1 className="text-4xl text-indigo-500">Speak freely</h1>
                        <p className="text-lg text-slate-700">With end-to-end encryption, your personal messages and calls are secured. Only you and the person you're talking to can read or listen to them, and nobody in between, not even WhatsApp.</p>
                    </div>
                </div>
                <div className="bg-white rounded-xl overflow-hidden pl-10 flex gap-10 items-center w-full mt-10 ">
                    <div className="w-1/2">
                        <h1 className="text-4xl text-indigo-500">Say what you feel</h1>
                        <p className="text-lg text-slate-700">Express yourself without words. Use stickers and GIFs or share everyday moments on Status. Record a voice message for a quick hello or a longer story.</p>
                    </div>
                    <img className="w-1/2 object-cover h-[400px]" src="https://images.unsplash.com/photo-1604881991720-f91add269bed?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGdyb3VwJTIwY2hhdHxlbnwwfHwwfHx8MA%3D%3D" alt="Express Yourself" />
                </div>
            </div>

            {/* Fourth Panel */}
            <div className="w-[90%] py-10 mt-20   text-center flex flex-col gap-4 mx-auto h-60 rounded-xl  my-10 bg-white ">
                <h2 className="text-4xl font-bold text-slate-800">Start Connecting Today</h2>
                <p className="text-lg text-slate-600">Join our community and experience the joy of seamless communication. Connect with friends and family, create groups, and share moments effortlessly.</p>
                <button className="bg-indigo-500 w-40 py-2 rounded-xl transition-transform duration-300 ease-in-out hover:-translate-y-2 mx-auto text-white" onClick={() => navigate('/signup')}>Sign Up Now</button>
            </div>

            <Footer />
        </main>
    )
}

export default Home;
