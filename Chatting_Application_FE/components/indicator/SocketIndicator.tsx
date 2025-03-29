'use client';

import { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';
import logError from '@/utils';

export const SocketIndicator = () => {
  const handleConnect = useCallback(() => {
    console.log('Connected to chat server');
  }, []);

  const handleError = useCallback((error) => {
    logError(error);
  }, []);

  const { isConnected } = useSocket({
    onConnect: handleConnect,
    onError: handleError,
  });

  // useEffect(() => {
  //   if (!isConnected) return;

  //   // Subscribe to a topic
  //   const subscription = subscribe('/topic/conversations/c1c0792d-6ccc-43ac-9501-0a48341906f5', (message) => {
  //     // Handle received message
  //     console.log('Received message:', message);
  //     // message is already parsed from JSON
  //   });

  //   sendMessage();

  //   // Clean up subscription when component unmounts
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [isConnected]);

  // const sendMessage = () => {
  //   // Send a message to the server
  //   send(
  //     '/app/conversations/c1c0792d-6ccc-43ac-9501-0a48341906f5',
  //     JSON.stringify({
  //       content: 'hello world',
  //       fileUrl: null,
  //     })
  //   );
  // };

  return (
    <>
      {!isConnected ? (
        <Badge variant="outline" className="bg-yellow-500 dark:bg-yellow-600 text-white border-none">
          Fallback: Polling every 1s
        </Badge>
      ) : (
        <Badge variant="outline" className="bg-emerald-500 dark:bg-emerald-600 text-white border-none">
          Live: Real-time updates
        </Badge>
      )}
    </>
  );
};
