'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import * as z from 'zod';

import { Button } from '@/components/ui//button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useModal } from '@/hooks/useModalStore';
import { serverService } from '@/services/serverService';
import uploadService from '@/services/uploadService';
import { IServer } from '@/types';
import logError from '@/utils';

import FileUpload from '../upload/ImageUpload';

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required.',
  }),
  image: z.any().optional(),
});

export const EditServerModal = () => {
  const { isOpen, onClose, type, data, setData } = useModal();

  const isModalOpen = isOpen && type === 'editServer';
  const { server, servers } = data as {
    server: IServer;
    servers: IServer[];
  };

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      image: '',
    },
  });

  useEffect(() => {
    if (server) {
      form.setValue('name', server.name);
      form.setValue('image', server.imageUrl);
    }
  }, [server, form, isOpen]);

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const data = {
        name: values.name,
        imageUrl: '',
      };
      if (values.image) {
        if (typeof values.image !== 'string') {
          const { fileUrl } = await uploadService.uploadImage(values.image);
          data.imageUrl = fileUrl;
        } else {
          data.imageUrl = values.image;
        }
      }

      const res = await serverService.updateServer(server?.id ?? '', data);

      toast.success('Server edited successfully');

      const newServers = servers.map((s) => {
        if (s.id === server?.id) {
          return res.result;
        }
        return s;
      });

      setData({ server: res.result, servers: newServers });

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
          <DialogTitle className="text-2xl text-center font-bold">Modify your Server</DialogTitle>
          <DialogDescription className="text-center">
            You can change the name and image of your server
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <div className="flex items-center justify-center text-center">
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <FileUpload value={field.value} onChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="uppercase text-xs font-semibold">Name</FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        className="dark:bg-gray-900/60  dark:text-white 
                      placeholder:text-gray-500 focus:border-sky-500 focus:ring-sky-500/30"
                        placeholder="Enter Server name"
                        {...field}
                      ></Input>
                    </FormControl>
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
                Save
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
