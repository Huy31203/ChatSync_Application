'use client';

import { useRouter } from '@/hooks/use-router';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/components/ui//button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useModal } from '@/hooks/use-modal-store';
import { channelService } from '@/services/channel-service';
import { ChannelTypeEnum, IServer } from '@/types';
import { logError } from '@/utils';

export const CreateChannelModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data } = useModal();

  const isModalOpen = isOpen && type === 'createChannel';

  const { server, channelType } = data as {
    server: IServer;
    channelType: ChannelTypeEnum;
  };

  const nameList = server?.channels?.map((channel) => channel.name);

  const FormSchema = z.object({
    name: z
      .string()
      .min(1, {
        message: 'Channel name is required.',
      })
      .refine((name) => name.toLowerCase() !== 'general', {
        message: 'Channel name cannot be "general".',
      })
      .refine((name) => !nameList.includes(name), {
        message: 'Channel name cannot be dublicated.',
      }),
    type: z.nativeEnum(ChannelTypeEnum),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      type: channelType || ChannelTypeEnum.TEXT,
    },
  });

  useEffect(() => {
    if (channelType) form.setValue('type', channelType);
    else form.setValue('type', ChannelTypeEnum.TEXT);
  }, [channelType, form]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const data = {
        name: values.name,
        type: values.type,
      };

      await channelService.createChannel(server.id, data);

      toast.success('Channel created successfully');

      router.refresh();

      form.reset();
      onClose();
    } catch (error) {
      logError(error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white text-black p-0 overflow-hidden">
        <DialogHeader className="pt-8 px-6">
          <DialogTitle className="text-2xl text-center font-bold">Create Channel</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
											dark:text-secondary/70"
                    >
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="bg-zinc-300/50 border-0
												focus-visible:ring-0 text-black
												focus-visible:ring-offset-0"
                        placeholder="Enter Channel name"
                        {...field}
                      ></Input>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel
                      className="uppercase text-xs font-bold text-zinc-500
											dark:text-secondary/70"
                    >
                      Channel type
                    </FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger
                          className="bg-zinc-300/50 border-0 focus:ring-0
                          text-black ring-offset-0 fucus:ring-offset-0 capitalize outline-none"
                        >
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ChannelTypeEnum).map((type) => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button variant="primary" disabled={isLoading}>
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
