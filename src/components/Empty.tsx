import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/common/Button';

interface EmptyProps {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  size?: 'sm' | 'md' | 'lg';
}

export const Empty = ({ icon: Icon, title, description, action, size = 'md' }: EmptyProps) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-20 h-20'
  };

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className={`${sizeClasses[size]} bg-gray-100 rounded-full flex items-center justify-center mb-4`}>
        <Icon className={`${size === 'lg' ? 'w-10 h-10' : size === 'md' ? 'w-8 h-8' : 'w-5 h-5'} text-gray-400`} />
      </div>
      <h3 className={`font-semibold text-gray-900 ${size === 'lg' ? 'text-xl' : size === 'md' ? 'text-lg' : 'text-base'} mb-2`}>
        {title}
      </h3>
      {description && (
        <p className={`text-gray-500 ${size === 'lg' ? 'text-base' : 'text-sm'} max-w-md`}>
          {description}
        </p>
      )}
      {action && (
        <Button onClick={action.onClick} className="mt-6">
          {action.label}
        </Button>
      )}
    </div>
  );
};

export default Empty;
