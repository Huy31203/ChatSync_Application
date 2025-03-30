import { File as FileIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { cn } from '@/lib/utils';

interface FilePreviewProps {
  file?: File;
  url?: string;
  removeable?: boolean;
  onRemove: () => void;
}

export const FilePreview = ({ file, url, removeable = true, onRemove }: FilePreviewProps) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Check if file exists before accessing its properties
  const isImage = file ? file.type.startsWith('image/') : url ? isImageUrl(url) : false;

  console.log('isImage', isImage);

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

  console.log('previewUrl', previewUrl);

  const fileName =
    file?.name ||
    (url
      ? // Try to extract fileName from query parameters first
        new URL(url, window.location.origin).searchParams.get('fileName') ||
        // Fall back to the path segment if no query parameter
        url.split('/').pop()?.split('?')[0] ||
        'File'
      : 'File');
  const fileSize = file?.size || 0;

  return (
    <div
      onClick={() => {
        if (url) {
          // Navigate to the URL when clicked
          window.open(url, '_blank');
        }
      }}
      className={cn('relative group', { 'cursor-pointer': !!url })}
    >
      <div className="flex flex-col bg-white dark:bg-zinc-700 rounded-md overflow-hidden border border-neutral-300 dark:border-zinc-600 w-[120px]">
        <div className="h-[80px] flex items-center justify-center bg-neutral-200 dark:bg-zinc-800">
          {isImage && previewUrl ? (
            <img src={previewUrl} alt={fileName} className="h-full w-full object-cover" />
          ) : (
            <FileIcon className="h-10 w-10 text-neutral-500 dark:text-neutral-400" />
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

        <div className="p-2">
          <p className="text-xs font-medium truncate" title={fileName}>
            {fileName}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{file ? formatFileSize(fileSize) : ''}</p>
        </div>
      </div>
    </div>
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
