import React from "react";

function Footer() {
    return (
        <footer className=" py-4 bg-gray-200">
            <div className="flex flex-col items-center gap-4">
                <div className="text-slate-700">ChatMe - Connect with your friends and family</div>
                <div className="flex gap-6">
                    <img className="h-8 w-8 cursor-pointer  hover:opacity-80" src="https://cdn.iconscout.com/icon/free/png-512/free-instagram-188-498425.png?f=webp&w=512" alt="Instagram" />
                    <img className="h-8 w-8 cursor-pointer  hover:opacity-80" src="https://cdn.iconscout.com/icon/free/png-512/free-linkedin-162-498418.png?f=webp&w=512" alt="LinkedIn" />
                    <img className="h-8 w-8 cursor-pointer  hover:opacity-80" src="https://cdn.iconscout.com/icon/free/png-512/free-gmail-2981844-2476484.png?f=webp&w=512" alt="Gmail" />
                </div>
                <div className="text-indigo-500 hover:underline cursor-pointer">© Copyright 2023-Saurabh Thapliyal</div>
            </div>
        </footer>
    );
}

export default Footer;
