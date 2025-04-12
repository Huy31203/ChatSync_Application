'use client';

import { useCallback } from 'react';

import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          {!isConnected ? (
            <Badge variant="outline" className="bg-yellow-400 w-5 h-5 rounded-full border-none" />
          ) : (
            <Badge variant="outline" className="bg-emerald-400 w-5 h-5 rounded-full border-none" />
          )}
        </TooltipTrigger>
        <TooltipContent side="bottom" align="center">
          {!isConnected ? 'Connection not stable' : 'Connected'}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
