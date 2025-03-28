'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

import { useCookies } from '@/contexts/CookieContext';

let globalSocket: Socket | null = null;

interface UseSocketIOOptions {
  url: string;
  autoConnect?: boolean;
  auth: Record<string, string>;
  query?: Record<string, string>;
}

export const useSocket = () => {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  const { cookie } = useCookies();

  const url = process.env.NEXT_PUBLIC_BE_URL || 'http://localhost:8080';

  const auth = {
    token: cookie,
  };

  const hasAuth = auth && auth.token;

  const autoConnect = true;

  // Initialize socket connection
  useEffect(() => {
    // Don't create a connection if auth is missing
    if (!hasAuth) {
      console.log('Skipping socket connection - no auth token');
      return;
    }

    // Reuse existing global socket if available
    if (globalSocket) {
      console.log('Reusing existing socket connection');
      socketRef.current = globalSocket;
      setIsConnected(globalSocket.connected);
      return;
    }

    console.log('Creating new socket connection');

    const socketOptions = {
      autoConnect,
      path: '/api/socket.io/',
      extraHeaders: {
        authorization: `bearer ${auth.token}`,
      },
      // Add reconnection options
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    };

    const socket = io(url, socketOptions);
    socketRef.current = socket;
    globalSocket = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id);
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      setIsConnected(false);
    });

    // Cleanup on unmount - but keep global connection
    return () => {
      // Don't actually disconnect, just remove references
      // We'll keep the global connection alive
      socketRef.current = null;
    };
  }, [url, hasAuth]); // Simplified dependencies

  // Rest of your code remains the same...

  // When component using this hook unmounts
  useEffect(() => {
    return () => {
      // Only disconnect when no components are using the socket
      // In a real app, you might want to implement a reference counter
      if (process.env.NODE_ENV === 'development') {
        console.log('Component unmounted, but keeping socket alive');
      }
    };
  }, []);

  // Event listeners management
  const on = useCallback((event: string, callback: (...args: any[]) => void) => {
    const socket = socketRef.current;
    if (socket) {
      socket.on(event, callback);
    }

    return () => {
      if (socket) {
        socket.off(event, callback);
      }
    };
  }, []);

  // Send events
  const emit = useCallback((event: string, ...args: any[]) => {
    const socket = socketRef.current;
    if (socket) {
      socket.emit(event, ...args);
    } else {
      console.warn('Attempted to emit event but socket is not connected:', event);
    }
  }, []);

  // Connect manually if autoConnect is false
  const connect = useCallback(() => {
    const socket = socketRef.current;
    if (socket && !socket.connected) {
      socket.connect();
    }
  }, []);

  // Disconnect manually
  const disconnect = useCallback(() => {
    const socket = socketRef.current;
    if (socket && socket.connected) {
      socket.disconnect();
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    on,
    emit,
    connect,
    disconnect,
  };
};
