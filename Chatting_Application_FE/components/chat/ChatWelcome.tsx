import { Hash } from 'lucide-react';

interface ChatWelcomeProps {
  name: string;
  type: 'channel' | 'conversation';
}

export const ChatWelcome = ({ name, type }: ChatWelcomeProps) => {
  return (
    <div className="space-y-2 px-4 mb-4">
      {type === 'channel' && (
        <div className="w-[75px] h-[75px] rounded-full bg-gray-500 dark:bg-gray-700 flex items-center justify-center">
          <Hash className="w-12 h-12 text-white" />
        </div>
      )}
      <p className="text-2xl md:text-3xl font-bold">
        {type === 'channel' ? 'Welcome to Channel #' : ''}
        {name}
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 text-sm">
        {type === 'channel'
          ? `This is the start of the #${name} channel.`
          : `This is the start of your conversation with ${name}.`}
      </p>
    </div>
  );
};
