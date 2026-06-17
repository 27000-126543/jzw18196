import { useNavigate } from 'react-router-dom';
import { Clock, Eye, Users, ChevronRight } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useAppStore } from '@/store';
import { formatRelativeTime } from '@/utils/date';
import { NOTICE_CATEGORY_LABELS, NOTICE_CATEGORY_COLORS } from '@/utils/constants';
import type { Notice } from '@/types';
import { cn } from '@/lib/utils';

interface NoticeCardProps {
  notice: Notice;
  showReadStatus?: boolean;
}

export const NoticeCard = ({ notice, showReadStatus = true }: NoticeCardProps) => {
  const navigate = useNavigate();
  const { currentUser, users } = useAppStore();

  const totalParents = users.filter(u => u.role === 'parent').length;
  const readCount = notice.readStatus.length;
  const readPercent = totalParents > 0 ? Math.round((readCount / totalParents) * 100) : 0;

  const hasRead = currentUser?.role === 'parent'
    ? notice.readStatus.some(r => r.parentId === currentUser.id)
    : false;

  const categoryVariant = notice.category === 'homework' ? 'blue'
    : notice.category === 'activity' ? 'pink'
    : notice.category === 'holiday' ? 'green'
    : 'default';

  return (
    <Card
      hoverable
      onClick={() => navigate(`/notices/${notice.id}`)}
      className={cn(
        'group overflow-hidden',
        currentUser?.role === 'parent' && !hasRead && 'ring-2 ring-blue-400 ring-opacity-50'
      )}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <Badge variant={categoryVariant as any} size="sm">
              {NOTICE_CATEGORY_LABELS[notice.category]}
            </Badge>
            {currentUser?.role === 'parent' && (
              <Badge variant={hasRead ? 'success' : 'warning'} size="sm">
                {hasRead ? '已读' : '未读'}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            {formatRelativeTime(notice.createdAt)}
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
          {notice.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {notice.content}
        </p>

        {showReadStatus && currentUser?.role === 'teacher' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1 text-gray-500">
                <Eye className="w-3.5 h-3.5" />
                <span>已读 {readCount}/{totalParents} 人</span>
              </div>
              <span className="text-gray-400">{readPercent}%</span>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${readPercent}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Users className="w-3.5 h-3.5" />
            <span>全体家长</span>
          </div>
          <div className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            <span>查看详情</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Card>
  );
};
