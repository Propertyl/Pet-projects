
import { createContext,useContext, useEffect, useRef } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export const SocketProvider = ({children}:{children:any}) => {

  const socketRef:any = useRef(null);

  useEffect(() => {
    socketRef.current = io('http://localhost:3000/app', {
      withCredentials:true
    });
    console.log('socketing:',socketRef);

    return () => {
      socketRef.current?.disconnect();
    }
  },[])

  return (
    <SocketContext.Provider value={socketRef.current}>
        {children}
    </SocketContext.Provider>
  )
}

export const useSocket:any = () => useContext(SocketContext);

