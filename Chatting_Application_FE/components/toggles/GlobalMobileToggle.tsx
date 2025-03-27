'use client';

import { Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';

import { NavigationSidebar } from '@/components/navigation/NavigationSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { ServerSidebar } from '../server/ServerSidebar';

export const GlobalMobileToggle = () => {
  const pathName = usePathname();
  const isServer = pathName.includes('/servers');
  const isChannel = pathName.includes('/channels');
  const isConversation = pathName.includes('/conversations');

  return (
    <>
      {!isChannel && !isConversation && (
        <div
          className="md:hidden text-md font-semibold px-3 flex items-center h-12
                    border-neutral-200 dark:border-neutral-800 border-b-2"
        >
          <Sheet>
            <SheetTrigger
              asChild
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <Menu className="p-2" />
            </SheetTrigger>
            <SheetContent side="left" className="p-0 gap-0 flex w-fit !outline-none">
              <div className="w-[72px]">
                <NavigationSidebar />
              </div>
              {isServer && <ServerSidebar />}
            </SheetContent>
          </Sheet>
        </div>
      )}
    </>
  );
};
