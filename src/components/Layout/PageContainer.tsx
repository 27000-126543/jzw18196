import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

export const PageContainer = ({ children, className }: PageContainerProps) => {
  return (
    <main className="ml-60 min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      <div className={cn('px-8 py-6 max-w-[1600px] mx-auto', className)}>
        {children}
      </div>
    </main>
  );
};
