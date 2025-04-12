'use client';

import { Menu } from 'lucide-react';

import { NavigationSidebar } from '@/components/navigation/NavigationSidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

import { ServerSidebar } from '../server/ServerSidebar';

export const MobileToggle = () => {
  return (
    <Sheet>
      <SheetTrigger
        asChild
        className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
      >
        <Menu className="p-2" />
      </SheetTrigger>
      <SheetContent side="left" className="p-0 gap-0 flex !outline-none">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar />
      </SheetContent>
    </Sheet>
  );
};
