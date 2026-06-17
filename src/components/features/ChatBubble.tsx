import { Check, CheckCheck, Users } from 'lucide-react';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { useAppStore } from '@/store';
import { formatTime } from '@/utils/date';
import type { ChatMessage } from '@/types';
import { cn } from '@/lib/utils';

interface ChatBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
  senderAvatar?: string;
  senderName?: string;
}

export const ChatBubble = ({ message, isOwn, senderAvatar, senderName }: ChatBubbleProps) => {
  const { groups } = useAppStore();
  const group = message.groupId ? groups.find(g => g.id === message.groupId) : undefined;

  return (
    <div className={cn(
      'flex gap-3 mb-4 animate-in fade-in slide-in-from-bottom-2 duration-300',
      isOwn ? 'flex-row-reverse' : 'flex-row'
    )}>
      {!isOwn && (
        <Avatar
          src={senderAvatar}
          name={senderName}
          size="sm"
          className="flex-shrink-0 mt-1"
        />
      )}

      <div className={cn(
        'max-w-[70%] flex flex-col',
        isOwn ? 'items-end' : 'items-start'
      )}>
        {(!isOwn || group) && (
          <div className="flex items-center gap-2 mb-1 px-1">
            {!isOwn && senderName && (
              <span className="text-xs text-gray-500">{senderName}</span>
            )}
            {group && (
              <Badge variant="info" size="sm">
                <Users className="w-3 h-3 mr-1" />
                {group.name}
              </Badge>
            )}
          </div>
        )}

        <div className={cn(
          'px-4 py-2.5 rounded-2xl',
          isOwn
            ? 'bg-blue-600 text-white rounded-br-md'
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-sm'
        )}>
          <p className="text-sm whitespace-pre-wrap leading-relaxed">
            {message.content}
          </p>
        </div>

        <div className={cn(
          'flex items-center gap-1 mt-1 px-1',
          isOwn ? 'flex-row-reverse' : 'flex-row'
        )}>
          <span className="text-xs text-gray-400">
            {formatTime(message.createdAt)}
          </span>
          {isOwn && (
            message.read
              ? <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
              : <Check className="w-3.5 h-3.5 text-gray-400" />
          )}
        </div>
      </div>

      {isOwn && (
        <div className="w-8 flex-shrink-0" />
      )}
    </div>
  );
};
