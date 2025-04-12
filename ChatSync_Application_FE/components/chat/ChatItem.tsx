'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, SendIcon, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { ActionTooltip } from '@/components/ActionTooltip';
import { Form, FormControl, FormDescription, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/UserAvatar';
import { roleIconMap } from '@/constants/IconMap';
import { channelService } from '@/services/channelService';
import { conversationService } from '@/services/conversationService';
import { IMember } from '@/types';
import logError from '@/utils';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Button } from '../ui/button';
import { FilePreview } from '../upload/FilePreview';

interface ChatItemProps {
  content: string;
  fileUrls?: string[];
  type: 'channel' | 'conversation';
  sender: IMember;
  currentMember: IMember;
  messageId: string;
  chatId: string;
  serverId: string;
  timestamp: string;
  deleted?: boolean;
  isUpdated?: boolean;
  send: (destination: string, body?: any, headers?: Record<string, string>) => void;
}

const formSchema = z.object({
  content: z.string().min(1, 'Content is required'),
});

export const ChatItem = ({
  content,
  fileUrls,
  type,
  sender,
  currentMember,
  messageId,
  chatId,
  serverId,
  timestamp,
  deleted = false,
  isUpdated = false,
  send,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  const icon = roleIconMap[sender.memberRole];

  const isAdmin = currentMember.memberRole === 'ADMIN';
  const isModerator = currentMember.memberRole === 'MODERATOR';
  const isOwner = sender.id === currentMember.id;

  const canDelete = !deleted && (isAdmin || (isModerator && sender.memberRole === 'GUEST') || isOwner);
  const canEdit = !deleted && isOwner && fileUrls?.length === 0;

  useEffect(() => {
    form.reset({
      content: content,
    });
  }, [content]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsEditing(false);
        setIsDeleting(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const data = {
        content: values.content,
      };

      if (type === 'channel') {
        await channelService.updateMessageInChannel(serverId, chatId, messageId, data);

        send(`/app/channels/${chatId}/messages/${messageId}/Get`);
      } else {
        await conversationService.updateMessageInConversation(serverId, chatId, messageId, data);

        send(`/app/conversations/${chatId}/messages/${messageId}/Get`);
      }

      toast.success('Message updated successfully!');
    } catch (error) {
      logError(error);
    } finally {
      setIsEditing(false);
    }
  }

  async function handleDelete() {
    try {
      if (type === 'channel') {
        await channelService.deleteMessageInChannel(serverId, chatId, messageId);

        send(`/app/channels/${chatId}/messages/${messageId}/Get`);
      } else {
        await conversationService.deleteMessageInConversation(serverId, chatId, messageId);

        send(`/app/conversations/${chatId}/messages/${messageId}/Get`);
      }

      toast.success('Message deleted successfully!');
    } catch (error) {
      logError(error);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <>
      <div className="relative group flex items-center hover:bg-black/5 p-4 transition w-full">
        <div className="group flex gap-x-2 items-start w-full">
          <div className="cursor-pointer hover:drop-shadow-md transition">
            <UserAvatar src={sender.profile.avatarUrl} />
          </div>
          <div className="flex flex-col w-full">
            <div className="flex items-center gap-x-2">
              <div className="flex items-center">
                <p className="text-sm font-semibold hover:underline cursor-pointer text-zinc-900 dark:text-gray-100">
                  {sender.profile.name}
                </p>
                <ActionTooltip label={sender.memberRole} side="top">
                  {icon}
                </ActionTooltip>
              </div>
              <p className="text-xs text-zinc-500 dark:text-gray-400">{timestamp}</p>
            </div>
            <div className="flex flex-col gap-y-2 mt-1">
              {!isEditing && (
                <p
                  className={`text-sm text-zinc-800 dark:text-gray-200 ${
                    deleted ? 'text-xs italic text-zinc-600 dark:text-gray-400' : ''
                  }`}
                >
                  {deleted ? 'This message was deleted' : content}
                  {isUpdated && !deleted && (
                    <span className="text-xs text-zinc-500 dark:text-gray-400 ml-2">{'(edited)'}</span>
                  )}
                </p>
              )}
              {fileUrls && fileUrls.length > 0 && (
                <div className="flex gap-x-2">
                  {fileUrls.map((url, index) => (
                    <FilePreview key={url || index.toString()} url={url} removeable={false} onRemove={() => {}} />
                  ))}
                </div>
              )}
            </div>
            {canEdit && isEditing && (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-x-2 mt-2">
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormControl>
                          <Input
                            className="dark:bg-gray-900/60  dark:text-white 
                          placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
                            autoFocus
                            placeholder="Type your message..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                          Press <span className="font-semibold dark:text-gray-300">Enter</span> to save,{' '}
                          <span className="font-semibold dark:text-gray-300">Esc</span> to cancel
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="bg-sky-500 hover:bg-sky-600 text-white !py-2 !pr-2.5 !pl-2 font-medium rounded-full transition-all duration-200 shadow-lg shadow-sky-500/25 w-10 h-10"
                    variant="primary"
                  >
                    <SendIcon className="w-4 h-4" aria-hidden="true" />
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
        {canDelete && (
          <div className="hidden group-hover:flex items-center gap-x-2 absolute top-2 right-5">
            {canEdit && (
              <ActionTooltip label="Edit" side="top">
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="border rounded-sm p-1 bg-white dark:bg-gray-800"
                >
                  <Edit
                    className="cursor-pointer ml-auto w-4 h-4 text-gray-400 dark:bg-gray-800
                hover:text-zinc-600 dark:hover:text-gray-200 transition duration-500"
                  />
                </button>
              </ActionTooltip>
            )}
            <ActionTooltip label="Delete" side="top">
              <button
                onClick={() => setIsDeleting(!isDeleting)}
                className="border rounded-sm p-1 bg-white dark:bg-gray-800"
              >
                <Trash
                  className="cursor-pointer ml-auto w-4 h-4 text-gray-400 dark:bg-gray-800
              hover:text-zinc-600 dark:hover:text-gray-200 transition duration-500"
                />
              </button>
            </ActionTooltip>
          </div>
        )}
      </div>
      <AlertDialog open={isDeleting} onOpenChange={() => setIsDeleting(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa?</AlertDialogTitle>
            <AlertDialogDescription>Bạn sẽ không thể khôi phục lại tin nhắn đã xóa!</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="rounded-md" onClick={() => setIsDeleting(false)}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Đồng ý</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
