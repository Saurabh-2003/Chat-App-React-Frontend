import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [selectedFriend, setSelectedFriend] = useState("");
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);

  return (
    <AppContext.Provider value={{ selectedFriend, setSelectedFriend, user, setUser, socket, setSocket}}>
      {children}
    </AppContext.Provider>
  );
};
