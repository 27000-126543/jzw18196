import { forwardRef, type ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

interface AvatarProps extends ImgHTMLAttributes<HTMLImageElement> {
  size?: AvatarSize;
  name?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-2xl',
  '2xl': 'w-24 h-24 text-3xl'
};

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, size = 'md', name, src, alt, ...props }, ref) => {
    const getInitials = (name: string) => {
      return name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    };

    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-blue-600 text-white font-semibold overflow-hidden flex-shrink-0',
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          <img
            ref={ref}
            src={src}
            alt={alt || name || 'avatar'}
            className="w-full h-full object-cover"
            {...props}
          />
        ) : name ? (
          <span>{getInitials(name)}</span>
        ) : (
          <User className="w-1/2 h-1/2" />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

interface AvatarGroupProps {
  avatars: { src?: string; name?: string }[];
  size?: AvatarSize;
  max?: number;
}

export const AvatarGroup = ({ avatars, size = 'sm', max = 4 }: AvatarGroupProps) => {
  const visibleAvatars = avatars.slice(0, max);
  const remaining = avatars.length - max;

  return (
    <div className="flex items-center -space-x-2">
      {visibleAvatars.map((avatar, index) => (
        <Avatar
          key={index}
          src={avatar.src}
          name={avatar.name}
          size={size}
          className="border-2 border-white"
        />
      ))}
      {remaining > 0 && (
        <div
          className={cn(
            'relative inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 font-semibold border-2 border-white',
            sizeClasses[size]
          )}
        >
          <span className="text-xs">+{remaining}</span>
        </div>
      )}
    </div>
  );
};
