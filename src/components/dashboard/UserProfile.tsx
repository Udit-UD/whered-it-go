import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface UserProfileProps {
  name: string;
  email: string;
  profileImage?: string;
  className?: string;
}

export function UserProfile({ name, email, profileImage, className }: UserProfileProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4">
          <div className="relative">
            {profileImage ? (
              <Image
                src={profileImage}
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
            <div className="border-card absolute -right-1 -bottom-1 h-4 w-4 rounded-full border-2 bg-green-500"></div>
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
