import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";


function MessageContainer({ user, messages }) {
  const messagesRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the messages container when messages change
    messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
  }, [messages]);

  // Function to get formatted date for display
  const getFormattedDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  // Collect messages grouped by date
  const groupedMessages = messages.reduce((acc, message) => {
    const formattedDate = getFormattedDate(message.timestamp);
    acc[formattedDate] = acc[formattedDate] || [];
    acc[formattedDate].push(message);
    return acc;
  }, {});

  return (
    <div className="h-full py-2 max-sm:px-6 relative max-sm:py-0 w-full px-10 overflow-y-auto" ref={messagesRef}>
      {Object.entries(groupedMessages).map(([formattedDate, messagesForDate]) => (
        <div key={formattedDate}>
          {/* Show "Yesterday" or "Today" above the respective messages */}
          <div className="text-center text-gray-500 text-sm mb-3 ">{formattedDate}</div>

          {/* Display messages for the date */}
          {messagesForDate.map((m) => (
            <motion.div
              className={`flex flex-col w-full mb-2`}
              key={m._id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <div className={`flex gap-2 items-center ${m.from === user._id ? "self-end flex-row-reverse" : "self-start"}`}>
                {m.fromImage.image ? (
                  <img src={m.fromImage.image} className="h-8 w-8 rounded-full mr-2" alt="From" />
                ) : (
                  <img src="/placeholder.jpg" className="h-8 w-8 rounded-full mr-2" alt="Placeholder" />
                )}
                <span className="text-sm capitalize text-slate-700">{(m.fromName.name.split(' '))[0]}</span>
              </div>

              <div className={`max-w-80 overflow-hidden px-6 rounded-full ${m.from === user._id ? "bg-gray-200 mr-6 rounded-tl-none text-slate-900 self-end w-fit" : "bg-bg-primary ml-6 rounded-br-none text-white self-start w-fit"}`}>
                <div className="whitespace-pre-wrap" style={{ wordWrap: 'break-word' }}>{m.message}</div>
                <div className="text-xs text-right">{formatMessageTime(m.timestamp)}</div>
              </div>
            </motion.div>
          ))}

        </div>
      ))}
    </div>
  );
}

const formatMessageTime = (timestamp) => {
  const date = new Date(timestamp);
  return `${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
};

export default MessageContainer;
