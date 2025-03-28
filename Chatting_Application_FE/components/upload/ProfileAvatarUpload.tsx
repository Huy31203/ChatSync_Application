'use client';

import { Camera } from 'lucide-react';
import { useRef, useState, type ChangeEvent } from 'react';

import { ActionTooltip } from '@/components/ActionTooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface ProfileAvatarUploadProps {
  avatarUrl: string;
  name: string;
  onImageChange: (file: File) => void;
  className?: string;
}

export function ProfileAvatarUpload({ avatarUrl, name, onImageChange, className }: ProfileAvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string>(avatarUrl);
  const [isHovering, setIsHovering] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, or WEBP)');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Create a preview URL
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    // Call the callback with the selected file
    onImageChange(file);

    // Clean up the object URL when component unmounts
    return () => URL.revokeObjectURL(objectUrl);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={cn('relative cursor-pointer group w-fit', className)}
      onClick={handleClick}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={handleFileChange}
      />

      <div className="relative w-fit">
        <ActionTooltip side="right" align="center" label="Click to change avatar">
          <Avatar className="w-[100px] h-[100px] cursor-pointer rounded-full object-cover border border-border transition-opacity duration-200">
            <AvatarImage src={previewUrl} alt="User avatar" />
            <AvatarFallback>{name ? name[0].toUpperCase() : 'P'}</AvatarFallback>
          </Avatar>
        </ActionTooltip>

        <div
          className={cn(
            'absolute inset-0 w-[100px] h-[100px] flex items-center justify-center rounded-full bg-black/40 transition-opacity',
            isHovering ? 'opacity-100' : 'opacity-0'
          )}
        >
          <Camera className="h-8 w-8 text-white" />
        </div>
      </div>
    </div>
  );
}
