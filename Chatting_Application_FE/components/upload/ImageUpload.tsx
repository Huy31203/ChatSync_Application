'use client';

import { Upload, X } from 'lucide-react';
import Image from 'next/image';
import type React from 'react';
import { useRef, useState, type ChangeEvent } from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  onChange: (file: File | string | null) => void;
  value?: File | string | null;
  className?: string;
  maxSizeMB?: number;
  acceptedFileTypes?: string[];
}

export default function ImageUpload({
  onChange,
  value,
  className,
  maxSizeMB = 5,
  acceptedFileTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(typeof value === 'string' ? value : null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const maxSizeBytes = maxSizeMB * 1024 * 1024;

  const handleFileChange = (file: File | null) => {
    setError(null);

    if (!file) {
      setPreview(null);
      onChange(null);
      return;
    }

    // Validate file type
    if (!acceptedFileTypes.includes(file.type)) {
      setError(`File type not supported. Please upload ${acceptedFileTypes.join(', ')}`);
      return;
    }

    // Validate file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    onChange(file);
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0] || null;
    handleFileChange(file);
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn('space-y-4', className)}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleInputChange}
        accept={acceptedFileTypes.join(',')}
        className="hidden"
        aria-label="Upload image"
      />

      {preview ? (
        <div className="w-fit h-fit flex justify-center items-center rounded-full border">
          <div className="relative aspect-video w-fit rounded-full">
            <Image
              src={preview || '/placeholder.svg'}
              alt="Preview"
              className="rounded-full h-[100px] w-[100px]"
              width={100}
              height={100}
            />
            <Button
              size="icon"
              className="absolute top-0 right-[-0.5rem] h-8 w-8 rounded-full bg-red-500 hover:bg-red-500 text-white"
              onClick={handleRemove}
              type="button"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ) : (
        <div
          onClick={handleClick}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={cn(
            'border-2 border-dashed w-[300px] rounded-lg p-12 flex flex-col items-center justify-center gap-4 cursor-pointer transition-colors',
            isDragging ? 'border-primary bg-primary/5' : 'border-muted-foreground/25',
            className
          )}
        >
          <div className="rounded-full bg-primary/10 p-4">
            <Upload className="h-12 w-12" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium">
              <span className="text-sky-500">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {acceptedFileTypes.map((type) => type.replace('image/', '')).join(', ')} (max {maxSizeMB}MB)
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
