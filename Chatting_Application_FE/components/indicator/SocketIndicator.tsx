'use client';

import { Badge } from '@/components/ui/badge';
import { useSocket } from '@/hooks/useSocket';

export const SocketIndicator = () => {
  const { isConnected } = useSocket();

  console.log('SocketIndicator', isConnected);
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
