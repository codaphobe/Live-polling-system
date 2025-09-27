import { createContext, useContext, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const backendUrl = import.meta.env.VITE_API_URL;
const SocketContext = createContext(null);

function useSocket() {
  const socket = useContext(SocketContext);
  if (!socket) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return socket;
}

function SocketProvider({ children }) {
  const socketRef = useRef(null);

  // Initialize socket only once using useRef
  if (!socketRef.current) {
    console.log("Creating new socket instance");
    socketRef.current = io(backendUrl, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
      forceNew: false
    });
  }

  useEffect(() => {
    const socket = socketRef.current;

    const onConnect = () => {
      console.log('Socket connected with ID:', socket.id);
    };

    const onDisconnect = (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'transport close' || reason === 'ping timeout') {
        socket.connect();
      }
    };

    const onError = (error) => {
      console.error('Connection error:', error.message);
    };

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('connect_error', onError);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('connect_error', onError);
    };
  }, []);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
}

export { SocketProvider, useSocket };