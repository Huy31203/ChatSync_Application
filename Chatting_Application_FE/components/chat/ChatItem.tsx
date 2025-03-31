'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { ActionTooltip } from '@/components/ActionTooltip';
import { Form, FormControl, FormDescription, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UserAvatar } from '@/components/UserAvatar';
import { roleIconMap } from '@/constants/IconMap';
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
  timestamp: string;
  deleted?: boolean;
  isUpdated?: boolean;
  sendMessage: (destination: string, body: any, headers?: Record<string, string>) => void;
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
  timestamp,
  deleted = false,
  isUpdated = false,
  sendMessage,
}: ChatItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: content,
    },
  });

  if (deleted) {
    console.log(content, fileUrls);
  }

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
      // console.log('form submitted:', values);
      const data = {
        content: values.content,
      };
      const res = await conversationService.updateMessageInConversation(chatId, messageId, data);

      const newMessage = {
        id: res.result.id,
        content: res.result.content,
      };

      if (type === 'channel') {
        sendMessage(`/app/channels/${chatId}/messages/${messageId}/Edit`, JSON.stringify(newMessage));
      } else {
        sendMessage(`/app/conversations/${chatId}/messages/${messageId}/Edit`, JSON.stringify(newMessage));
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
      await conversationService.deleteMessageInConversation(chatId, messageId);

      console.log('Message deleted:', messageId);

      const newMessage = {
        content: 'This message was deleted',
      };

      if (type === 'channel') {
        sendMessage(`/app/channels/${chatId}/messages/${messageId}/Edit`, JSON.stringify(newMessage));
      } else {
        sendMessage(`/app/conversations/${chatId}/messages/${messageId}/Edit`, JSON.stringify(newMessage));
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
                <p className="text-sm font-semibold hover:underline cursor-pointer text-zinc-900 dark:text-zinc-100">
                  {sender.profile.name}
                </p>
                <ActionTooltip label={sender.memberRole} side="top">
                  {icon}
                </ActionTooltip>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{timestamp}</p>
            </div>
            <div className="flex flex-col gap-y-2 mt-1">
              {!isEditing && (
                <p
                  className={`text-sm text-zinc-800 dark:text-zinc-200 ${
                    deleted ? 'text-xs italic text-zinc-600 dark:text-zinc-400' : ''
                  }`}
                >
                  {deleted ? 'This message was deleted' : content}
                  {isUpdated && !deleted && (
                    <span className="text-xs text-zinc-500 dark:text-zinc-400 ml-2">{'(edited)'}</span>
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
                            className="dark:bg-zinc-700 focus-visible:ring-0 focus-visible:ring-offset-0"
                            autoFocus
                            placeholder="Type your message..."
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs text-zinc-500 dark:text-zinc-400">
                          Press <span className="font-semibold">Enter</span> to save,{' '}
                          <span className="font-semibold">Esc</span> to cancel
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" variant="primary">
                    Save
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
                  className="border rounded-sm p-1 bg-white dark:bg-zinc-800"
                >
                  <Edit
                    className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 dark:bg-zinc-800
                hover:text-zinc-600 dark:hover:text-zinc-300 transition duration-500"
                  />
                </button>
              </ActionTooltip>
            )}
            <ActionTooltip label="Delete" side="top">
              <button
                onClick={() => setIsDeleting(!isDeleting)}
                className="border rounded-sm p-1 bg-white dark:bg-zinc-800"
              >
                <Trash
                  className="cursor-pointer ml-auto w-4 h-4 text-zinc-500 dark:bg-zinc-800
              hover:text-zinc-600 dark:hover:text-zinc-300 transition duration-500"
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
            <AlertDialogCancel onClick={() => setIsDeleting(false)}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Đồng ý</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
