'use client';

import { Plus } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect } from 'react';

import { ActionTooltip } from '@/components/ActionTooltip';
import { useModal } from '@/hooks/useModalStore';
import { IServer } from '@/types';

interface NavigationActionProps {
  servers: IServer[];
  setServers: Dispatch<SetStateAction<IServer[]>>;
}

export const NavigationAction = ({ servers, setServers }: NavigationActionProps) => {
  const { data, onOpen } = useModal();

  useEffect(() => {
    if (data.servers && data.servers?.length > 0) {
      setServers(data.servers);
    }
  }, [data.servers]);

  return (
    <div>
      <ActionTooltip side="right" align="center" label="add a new server">
        <button
          onClick={() => {
            onOpen('createServer', { servers });
          }}
          className="group flex items-center"
        >
          <div
            className="flex mx-3 h-[48px] w-[48px] rounded-[24px]
          group-hover:rounded-[12px] transition-all overflow-hidden
          items-center justify-center bg-background
          dark:bg-neutral-700
          group-hover:bg-emerald-500"
          >
            <Plus className="group-hover:text-white transition text-emerald-500" size={25} />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};
