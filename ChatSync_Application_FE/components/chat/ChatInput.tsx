'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, SendIcon } from 'lucide-react';
import { ChangeEvent, useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FilePreview } from '@/components/upload/FilePreview';
import { useAuth } from '@/hooks/useAuth';
import { useSocket } from '@/hooks/useSocket';
import uploadService from '@/services/uploadService';
import { IChannel, IConversation } from '@/types';
import logError from '@/utils';

import { EmojiPicker } from './EmojiPicker';

interface ChatInputProps {
  name: string;
  type: 'channel' | 'conversation';
  channel?: IChannel;
  conversation?: IConversation;
}

const formSchema = z
  .object({
    content: z.string(),
    attachments: z.array(z.any()).optional(),
  })
  .refine((data) => !!data.content || (!!data.attachments && data.attachments.length > 0), {
    message: 'You must provide either message content or attachments',
    path: ['content'], // Highlights the content field when validation fails
  });

type FormValues = z.infer<typeof formSchema>;

export const ChatInput = ({ name, type, channel, conversation }: ChatInputProps) => {
  const handleConnect = useCallback(() => {}, []);

  const handleError = useCallback((error) => {
    logError(error);
  }, []);

  const { send } = useSocket({
    onConnect: handleConnect,
    onError: handleError,
  });

  const { profile } = useAuth();

  // Form handling logic
  const [showAttachments, setShowAttachments] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: '',
      attachments: [],
    },
  });

  const attachments = form.watch('attachments') || [];

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      form.setValue('attachments', [...(form.getValues('attachments') || []), ...files]);
      setShowAttachments(true);
    }
    // Reset the file input so the same file can be selected again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const currentFiles = form.getValues('attachments') || [];
    const updatedFiles = [...currentFiles];
    updatedFiles.splice(index, 1);
    form.setValue('attachments', updatedFiles);

    if (updatedFiles.length === 0) {
      setShowAttachments(false);
    }
  };

  const handleChooseFiles = () => {
    fileInputRef.current?.click();
  };

  async function onSubmit(values: FormValues) {
    // Handle form submission logic here
    try {
      if (type === 'channel') {
        const data = {
          content: values.content,
          fileUrls: [],
          senderId: profile.members.find((m) => m.server.id === channel.server.id).id,
          channelId: channel.id,
        };

        if (values.attachments && values.attachments.length > 0) {
          const uploadPromises = attachments.map(async (file) => {
            const isImage = file.type.startsWith('image/');
            if (isImage) {
              const { fileUrl } = await uploadService.uploadImage(file);
              return fileUrl;
            } else {
              const { fileUrl } = await uploadService.uploadFile(file);
              return fileUrl;
            }
          });

          data.fileUrls = await Promise.all(uploadPromises);
        }

        send(`/app/channels/${channel.id}`, JSON.stringify(data));
      } else {
        const data = {
          content: values.content,
          fileUrls: [],
        };

        if (values.attachments && values.attachments.length > 0) {
          const uploadPromises = attachments.map(async (file) => {
            const isImage = file.type.startsWith('image/');
            if (isImage) {
              const { fileUrl } = await uploadService.uploadImage(file);
              return fileUrl;
            } else {
              const { fileUrl } = await uploadService.uploadFile(file);
              return fileUrl;
            }
          });

          data.fileUrls = await Promise.all(uploadPromises);
        }

        send(`/app/conversations/${conversation.id}`, JSON.stringify(data));
      }

      form.reset();
      setShowAttachments(false);
    } catch (error) {
      logError(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full flex flex-col">
        {showAttachments && attachments.length > 0 && (
          <div className="px-4 pt-2">
            <div className="bg-neutral-100 dark:bg-gray-900 rounded-md p-3">
              <div className="flex p-2 gap-4 overflow-x-auto">
                {attachments.map((file, index) => (
                  <FilePreview key={file.name || index.toString()} file={file} onRemove={() => removeFile(index)} />
                ))}
              </div>
            </div>
          </div>
        )}

        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />

        <div className="w-full flex items-center gap-2 p-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={handleChooseFiles}
                      className="absolute bg-neutral-400 hover:bg-neutral-200 transition-all duration-500 top-1/2 -translate-y-1/2 start-2 flex w-6 h-6 items-center justify-center rounded-full"
                    >
                      <Plus size={14} className="text-black" aria-hidden="true" />
                    </button>
                    <Input
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          form.handleSubmit(onSubmit)();
                        }
                      }}
                      className="ps-[45px] pe-24 !py-6 bg-neutral-200 dark:bg-gray-900 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                      placeholder={type == 'channel' ? `Message to #${name}` : `Message to @${name}`}
                      {...field}
                    />
                    <div
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-10 
                              flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] 
                              disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 duration-500 -translate-y-[1px]"
                    >
                      <EmojiPicker
                        onEmojiClick={(emoji: string) => {
                          field.onChange(`${field.value}${emoji}`);
                        }}
                      />
                    </div>
                    <button
                      className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-1 
                              flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] 
                              disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 duration-500"
                      type="submit"
                      aria-label="Send"
                    >
                      <SendIcon size={18} aria-hidden="true" />
                    </button>
                  </div>
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );
};
