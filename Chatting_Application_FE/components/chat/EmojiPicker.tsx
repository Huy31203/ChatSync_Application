'use client';

import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';
import { Smile } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface EmojiPickerProps {
  onEmojiClick: (emoji: string) => void;
}

export const EmojiPicker = ({ onEmojiClick }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();
  return (
    <Popover>
      <PopoverTrigger>
        <Smile />
      </PopoverTrigger>
      <PopoverContent className="bg-transparent border-0 shadow-none -translate-x-28" side="top">
        <Picker data={data} theme={resolvedTheme} onEmojiSelect={(emoji: any) => onEmojiClick(emoji.native)} />
      </PopoverContent>
    </Popover>
  );
};
