'use client';

import { Client, Frame } from '@stomp/stompjs';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import SockJS from 'sockjs-client';

import { useRefresh } from './useRefesh';

import { BE_URL, SOCKET_CONTEXT } from '@/constants/endpoint';
import { useCookies } from '@/contexts/CookieContext';
import logError from '@/utils';

interface UseSocketProps {
  url?: string;
  headers?: Record<string, string>;
  autoConnect?: boolean;
  onConnect?: (frame?: Frame) => void;
  onError?: (error: any) => void;
  onDisconnect?: () => void;
}

export const useSocket = ({
  url = BE_URL && SOCKET_CONTEXT ? `${BE_URL}/api/${SOCKET_CONTEXT}` : 'http://localhost:8080/api/chat',
  headers = {},
  autoConnect = true,
  onConnect,
  onError,
  onDisconnect,
}: UseSocketProps) => {
  const { cookie } = useCookies();
  const { isTokenExpired, refreshToken } = useRefresh();

  // Stabilize headers with useMemo
  const stableHeaders = useMemo(() => {
    const authHeaders = cookie ? { Authorization: `Bearer ${cookie}` } : {};
    return { ...authHeaders, ...headers };
  }, [cookie, headers]);

  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef<Client | null>(null);
  const subscriptionsRef = useRef<{ [id: string]: { unsubscribe: () => void } }>({});

  // Use a ref to track if we've already connected to avoid connection loops
  const hasConnectedRef = useRef(false);

  useEffect(() => {
    if (autoConnect && !hasConnectedRef.current) {
      hasConnectedRef.current = true; // Prevent multiple connections
      connect();
    }

    return () => {
      if (hasConnectedRef.current) {
        disconnect();
        hasConnectedRef.current = false; // Reset connection state on unmount
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoConnect]);

  // Store callback refs to avoid dependency changes
  const callbacksRef = useRef({ onConnect, onError, onDisconnect });

  // Update callback refs when they change
  useEffect(() => {
    callbacksRef.current = { onConnect, onError, onDisconnect };
  }, [onConnect, onError, onDisconnect]);

  const connect = useCallback(async () => {
    if (clientRef.current?.connected) return;

    // Check if token is expired before connecting
    if (isTokenExpired()) {
      console.log('Token expired, refreshing before connecting');
      const newToken = await refreshToken();
      if (!newToken) {
        console.error('Failed to refresh token before connecting');
        return;
      }
      // Token refreshed, connect will be called by effect when cookie updates
      return;
    }

    const client = new Client({
      webSocketFactory: () => new SockJS(url),
      connectHeaders: stableHeaders,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // Disable console logging
    // client.debug = () => {};

    client.onConnect = (frame) => {
      console.log('Connected to WebSocket');
      setIsConnected(true);
      if (callbacksRef.current.onConnect) callbacksRef.current.onConnect(frame);
    };

    client.onStompError = (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
      if (callbacksRef.current.onError) callbacksRef.current.onError(error);
    };

    client.activate();
    clientRef.current = client;
  }, [url, stableHeaders]); // Only depends on url and stable headers

  const disconnect = useCallback(() => {
    if (clientRef.current?.connected) {
      // Unsubscribe from all topics
      Object.values(subscriptionsRef.current).forEach((sub) => sub.unsubscribe());
      subscriptionsRef.current = {};

      // Disconnect client
      clientRef.current.deactivate().then(() => {
        console.log('Disconnected from WebSocket');
        setIsConnected(false);
        if (callbacksRef.current.onDisconnect) callbacksRef.current.onDisconnect();
      });
    }
  }, []);

  const subscribe = useCallback((destination: string, callback: (message: any) => void) => {
    if (!clientRef.current?.connected) {
      console.error('Cannot subscribe: client not connected');
      return { unsubscribe: () => {} };
    }

    const subscription = clientRef.current.subscribe(destination, (message) => {
      const payload = message.body ? JSON.parse(message.body) : {};
      callback(payload);
    });

    const id = `${destination}-${Date.now()}`;
    subscriptionsRef.current[id] = subscription;

    return {
      unsubscribe: () => {
        subscription.unsubscribe();
        delete subscriptionsRef.current[id];
      },
    };
  }, []);

  const send = useCallback((destination: string, body?: any, headers: Record<string, string> = {}) => {
    if (!clientRef.current?.connected) {
      logError('Cannot send message: try to refresh page');
      return;
    }

    console.log('Sending message:', { destination, body, headers });

    clientRef.current?.publish({ destination, headers, body: typeof body === 'string' ? body : null });
  }, []);

  return {
    isConnected,
    client: clientRef.current,
    connect,
    disconnect,
    subscribe,
    send,
  };
};
