'use client';

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
import { useModal } from '@/hooks/useModalStore';
import { useRouter } from '@/hooks/useRouter';
import { channelService } from '@/services/channelService';
import { ChannelTypeEnum, IServer } from '@/types';
import logError from '@/utils';

export const CreateChannelModal = () => {
  const router = useRouter();

  const { isOpen, onClose, type, data, setData } = useModal();

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

      const res = await channelService.createChannel(server.id, data);

      const { channels, ...rest } = server;
      const newServer = {
        ...rest,
        channels: [...channels, res.result],
      };

      toast.success('Channel created successfully');

      setData({ server: newServer });

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
      <DialogContent className="p-0 overflow-hidden">
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
                    <FormLabel className="uppercase text-xs font-semibold">Channel name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="dark:bg-gray-900/60  dark:text-white 
                      placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
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
                    <FormLabel className="uppercase text-xs font-semibold">Channel type</FormLabel>
                    <Select disabled={isLoading} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="dark:bg-gray-700 focus:ring-0 focus:ring-offset-0 capitalize outline-none">
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
            <DialogFooter className="px-6 pb-6">
              <Button
                variant="primary"
                disabled={isLoading}
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-medium py-2.5 transition-all duration-200 shadow-lg shadow-sky-500/25"
              >
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
