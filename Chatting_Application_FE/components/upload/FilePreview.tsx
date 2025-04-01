import { File as FileIcon, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import { useCookies } from '@/contexts/CookieContext';
import { createImageLoader } from '@/lib/imageLoader';
import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file?: File;
  url?: string;
  removeable?: boolean;
  onRemove: () => void;
}

export const FilePreview = ({ file, url, removeable = true, onRemove }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { cookie } = useCookies();

  const customImageLoader = createImageLoader(cookie);

  // Check if file exists before accessing its properties
  const isImage = file ? file.type.startsWith('image/') : url ? isImageUrl(url) : false;

  const isShowingName = file != null || (url && !isImage);

  // Generate preview URL for images
  useEffect(() => {
    if (file && isImage) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (url) {
      setPreviewUrl(url);
    }
  }, [file, url, isImage]);

  const fileName =
    file?.name ||
    (url
      ? // Try to extract fileName from query parameters first
        new URL(url, window.location.origin).searchParams.get('fileName') ||
        // Fall back to the path segment if no query parameter
        url.split('/').pop()?.split('?')[0] ||
        'File'
      : 'File');

  const fileExt = fileName.split('.').pop()?.toUpperCase() || 'FILE';

  const fileSize = file?.size || 0;

  return (
    <>
      {url && url.length > 0 ? (
        <Link
          href={previewUrl || ''}
          target="_blank"
          className={cn('group relative flex items-center', removeable && 'group-hover:opacity-100')}
        >
          <div className="flex flex-col bg-white dark:bg-zinc-700 rounded-md overflow-hidden border border-neutral-300 dark:border-zinc-600 w-[120px]">
            <div
              className={cn(
                'flex items-center justify-center bg-neutral-200 dark:bg-zinc-800',
                isShowingName ? 'h-[80px]' : 'h-[110px]'
              )}
            >
              {isImage && previewUrl ? (
                <Image
                  loader={customImageLoader}
                  width={500}
                  height={500}
                  src={previewUrl}
                  alt={fileName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <FileIcon className="h-10 w-10 text-neutral-500 dark:text-neutral-400" />
                  <p className="text-lg text-neutral-500 dark:text-neutral-400">{fileExt}</p>
                </>
              )}

              {removeable && (
                <button
                  onClick={onRemove}
                  className="absolute -top-1 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove file"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {isShowingName && (
              <div className="p-2">
                <p className="text-xs font-medium truncate" title={fileName}>
                  {fileName}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{file ? formatFileSize(fileSize) : ''}</p>
              </div>
            )}
          </div>
        </Link>
      ) : (
        <div className={cn('group relative flex items-center', removeable && 'group-hover:opacity-100')}>
          <div className="flex flex-col bg-white dark:bg-zinc-700 rounded-md overflow-hidden border border-neutral-300 dark:border-zinc-600 w-[120px]">
            <div
              className={cn(
                'flex items-center justify-center bg-neutral-200 dark:bg-zinc-800',
                isShowingName ? 'h-[80px]' : 'h-[110px]'
              )}
            >
              {isImage && previewUrl ? (
                <Image
                  loader={customImageLoader}
                  width={500}
                  height={500}
                  src={previewUrl}
                  alt={fileName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <>
                  <FileIcon className="h-10 w-10 text-neutral-500 dark:text-neutral-400" />
                  <p className="text-lg text-neutral-500 dark:text-neutral-400">{fileExt}</p>
                </>
              )}

              {removeable && (
                <button
                  onClick={onRemove}
                  className="absolute -top-1 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="Remove file"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {isShowingName && (
              <div className="p-2">
                <p className="text-xs font-medium truncate" title={fileName}>
                  {fileName}
                </p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{file ? formatFileSize(fileSize) : ''}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

// Helper function to detect if a URL is an image
const isImageUrl = (url: string): boolean => {
  const extensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp', '.svg'];
  return extensions.some((ext) => url.toLowerCase().includes(ext));
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
