'use client';

import { useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import { LoaderCircle, Pencil } from 'lucide-react';

interface UserProfileProps {
  name: string;
  email: string;
  profileImage?: string;
  className?: string;
  allowUpload?: boolean;
  onProfileImageUpload?: (url: string) => void;
}

export function UserProfile({
  name,
  email,
  profileImage,
  className,
  allowUpload = false,
  onProfileImageUpload,
}: UserProfileProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [uploading, setUploading] = useState(false);
  const [imagePreview, setImagePreview] = useState(profileImage);

  const handleImageClick = () => {
    if (allowUpload && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const reader = new FileReader();

    reader.onloadend = async () => {
      const base64 = reader.result;

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64 }),
        });

        const data = await res.json();
        setImagePreview(data.url);
        onProfileImageUpload?.(data.url);
      } catch (err) {
        console.error('Upload failed', err);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div
              onClick={handleImageClick}
              className={cn('cursor-pointer', uploading ? 'pointer-events-none opacity-50' : '')}
            >
              {imagePreview ? (
                <Image
                  src={imagePreview}
                  alt={name}
                  width={64}
                  height={64}
                  className="border-primary/20 h-16 w-16 rounded-full border-2 object-cover"
                />
              ) : (
                <div className="from-primary/20 to-primary/40 border-primary/20 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-gradient-to-br">
                  <span className="text-primary text-2xl font-semibold">
                    {name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black text-xs text-white">
                <LoaderCircle className="animate-spin" />
              </div>
            )}

            {!uploading && allowUpload && (
              <div className="absolute -right-1 -bottom-1 h-6 w-6 rounded-full">
                <Pencil size={20} />
              </div>
            )}
            {allowUpload && (
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-foreground truncate text-xl font-semibold">{name}</h3>
            <p className="text-muted-foreground truncate text-sm">{email}</p>
            <div className="mt-2 flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
              <span className="text-xs font-medium text-green-500">Online</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
