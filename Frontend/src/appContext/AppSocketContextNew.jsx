import { createContext, useContext, useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import io from "socket.io-client";
import userAtom from "../atoms/userAtom";

const AppSocketContextNew = createContext();

export const useSocketNew = () => {
  return useContext(AppSocketContextNew);
};

export const AppSocketContextNewProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const user = useRecoilValue(userAtom);

  useEffect(() => {
    const socket = io("http://localhost:5000", {
      query: {
        userId: user?._id,
      },
    });
    // console.log('Attempting to connect with socket:', socket);

    setSocket(socket);
    socket.on("getOnlineUsers", (users) => {
      setOnlineUser(users);
    });

    return () => socket && socket.close();
  }, [user?._id]);

  // console.log("Online Users: ", onlineUser);

  return (
    <AppSocketContextNew.Provider value={{ socket, onlineUser }}>
      {children}
    </AppSocketContextNew.Provider>
  );
};
