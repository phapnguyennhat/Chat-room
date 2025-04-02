'use client'
import {  useEffect } from "react";
import { io,  } from "socket.io-client";


export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
    
  

  useEffect(() => {
    const newSocket = io(process.env.BACKEND_URL, { withCredentials: true });
     
    return () => {
      newSocket.disconnect();
    };
  }, []);

    return <>{children}</>
};

