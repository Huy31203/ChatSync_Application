/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { ChevronDown, LogOut, PlusCircle, Settings, Trash, User, UserPlus } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect } from 'react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useModal } from '@/hooks/useModalStore';
import { IServer, MemberRoleEnum } from '@/types';

interface ServerHeaderProps {
  servers: IServer[];
  setServers: Dispatch<SetStateAction<IServer[]>>;
  server: IServer;
  setServer: Dispatch<SetStateAction<IServer | null>>;
  role?: MemberRoleEnum;
}

export const ServerHeader = ({ servers, setServers, server, setServer, role }: ServerHeaderProps) => {
  const { data, onOpen } = useModal();

  useEffect(() => {
    if (data.servers) {
      setServers(data.servers);
    }
  }, [data.servers, setServers]);

  useEffect(() => {
    if (data.server) {
      setServer(data.server);
    }
  }, [data.server]);

  const isAdmin = role === MemberRoleEnum.ADMIN;
  const isModerator = isAdmin || role === MemberRoleEnum.MODERATOR;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none" asChild>
        <button
          className="w-full text-md font-semibold px-3 flex items-center h-12 border-gray-200
          border-b-2 hover:bg-gray-700/10 dark:border-gray-700
          dark:hover:bg-gray-700/50 transition"
        >
          {server.name}
          <ChevronDown className="h-5 w-5 ml-auto" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 text-xs font-normal
        dark:bg-gray-900
        dark:text-neutral-400 space-y-[2px]"
      >
        <DropdownMenuItem
          onClick={() => onOpen('invite', { server })}
          className="text-indigo-600 dark:hover:bg-gray-800 dark:text-indigo-400 px-3 py-2 text-sm cursor-pointer"
        >
          Invite Friends
          <UserPlus className="h-4 w-4 ml-auto" />
        </DropdownMenuItem>

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('editServer', { server, servers })}
            className="px-3 py-2 text-sm cursor-pointer dark:hover:bg-gray-800"
          >
            Server Settings
            <Settings className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('members', { server })}
            className="px-3 py-2 text-sm cursor-pointer dark:hover:bg-gray-800"
          >
            Manage Members
            <User className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen('createChannel', { server })}
            className="px-3 py-2 text-sm cursor-pointer dark:hover:bg-gray-800"
          >
            Create Channel
            <PlusCircle className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        <DropdownMenuSeparator />

        {isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('deleteServer', { server, servers })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer dark:hover:bg-gray-800"
          >
            Delete Server
            <Trash className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}

        {!isAdmin && (
          <DropdownMenuItem
            onClick={() => onOpen('leaveServer', { server, servers })}
            className="text-rose-500 px-3 py-2 text-sm cursor-pointer dark:hover:bg-gray-800"
          >
            Leave Server
            <LogOut className="h-4 w-4 ml-auto" />
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
