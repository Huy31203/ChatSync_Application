'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import ImageUpload from '@/components/upload/ImageUpload';
import { useModal } from '@/hooks/useModalStore';
import { useRouter } from '@/hooks/useRouter';
import { serverService } from '@/services/serverService';
import uploadService from '@/services/uploadService';
import { IServer } from '@/types';
import logError from '@/utils';

const FormSchema = z.object({
  name: z.string().min(1, {
    message: 'Server name is required.',
  }),
  image: z.any().optional(),
});

export const CreateServerModal = () => {
  const { data, setData, isOpen, onClose, type } = useModal();
  const router = useRouter();

  const { servers } = data as {
    servers: IServer[];
  };

  const isModalOpen = isOpen && type === 'createServer';

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      image: '',
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      const data = {
        name: values.name,
        imageUrl: '',
      };
      if (values.image) {
        const { fileUrl } = await uploadService.uploadImage(values.image);
        data.imageUrl = fileUrl;
      }

      const res = await serverService.createServer(data);

      setData({ servers: [...servers, res.result] });

      toast.success('Server created successfully');

      router.push(`/servers/${res.result.id}`);

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
          <DialogTitle className="text-2xl text-center font-bold">Customize your Server</DialogTitle>
          <DialogDescription className="text-center text-zinc-500">
            Give your Server a personality with a name and an image. You can change it later.
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
                        <ImageUpload value={field.value} onChange={field.onChange} />
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
                    <FormLabel className="uppercase text-xs font-semibold">Server name</FormLabel>
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
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
