import { File, X } from 'lucide-react';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface FilePreviewProps {
  file: File;
  onRemove: () => void;
}

export const FilePreview = ({ file, onRemove }: FilePreviewProps) => {
  const isImage = file.type.startsWith('image/');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Generate preview URL for images
  useEffect(() => {
    if (isImage) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, isImage]);

  return (
    <div className="relative group">
      <div className="flex flex-col bg-white dark:bg-zinc-700 rounded-md overflow-hidden border border-neutral-300 dark:border-zinc-600 w-[120px]">
        <div className="h-[80px] flex items-center justify-center bg-neutral-200 dark:bg-zinc-800">
          {isImage && previewUrl ? (
            <Image
              width={120}
              height={80}
              src={previewUrl || '/placeholder.svg'}
              alt={file.name}
              className="h-full w-full object-cover"
              crossOrigin="anonymous"
            />
          ) : (
            <File className="h-10 w-10 text-neutral-500 dark:text-neutral-400" />
          )}

          <button
            onClick={onRemove}
            className="absolute -top-1 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Remove file"
          >
            <X size={14} />
          </button>
        </div>

        <div className="p-2">
          <p className="text-xs font-medium truncate" title={file.name}>
            {file.name}
          </p>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{formatFileSize(file.size)}</p>
        </div>
      </div>
    </div>
  );
};

// Helper function to format file size
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};
