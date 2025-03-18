'use client';

import { LogOut, User } from 'lucide-react';

import { ModeToggle } from '@/components/mode-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';
import { IServer } from '@/types';

import { NavigationAction } from './navigation-action';
import { NavigationItem } from './navigation-item';

export const NavigationSidebar = ({ servers }: { servers: IServer[] }) => {
  const { profile, logout } = useAuth();

  return (
    <div
      className="space-y-4 flex flex-col items-center h-full text-primary w-full
          dark:bg-[#1E1F22] bg-[#E3E5E8] py-3"
    >
      {servers && (
        <>
          <NavigationAction />
          {servers.length > 0 && (
            <Separator
              className="h-[2px] bg-zinc-300
            dark:gb-zinc-700 rounded-md w-10 mx-auto"
            />
          )}
          <ScrollArea className="flex-1 w-full">
            {servers.map((server) => (
              <div key={server.id} className="mb-4">
                <NavigationItem id={server.id} name={server.name} imageUrl={server.imageUrl} />
              </div>
            ))}
          </ScrollArea>
          <div className="pb-3 mt-auto flex items-center flex-col gap-y-4">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-10 w-10 border border-primary/10 cursor-pointer">
                  <AvatarImage src={profile?.avatarUrl} alt="User avatar" />
                  <AvatarFallback>{profile?.name[0].toUpperCase()}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem className="cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Edit Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-500">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      )}
    </div>
  );
};
