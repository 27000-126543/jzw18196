import { useNavigate } from 'react-router-dom';
import { Clock, Users, ChevronRight, BarChart3, CheckCircle2 } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { useAppStore } from '@/store';
import { formatRelativeTime, formatDate, isExpired } from '@/utils/date';
import type { Survey } from '@/types';
import { cn } from '@/lib/utils';

interface SurveyCardProps {
  survey: Survey;
}

export const SurveyCard = ({ survey }: SurveyCardProps) => {
  const navigate = useNavigate();
  const { currentUser, users } = useAppStore();

  const totalParents = users.filter(u => u.role === 'parent').length;
  const responseCount = survey.responses.length;
  const responsePercent = totalParents > 0 ? Math.round((responseCount / totalParents) * 100) : 0;

  const hasResponded = currentUser?.role === 'parent'
    ? survey.responses.some(r => r.parentId === currentUser.id)
    : false;

  const expired = isExpired(survey.deadline);
  const isActive = !expired;

  const handleClick = () => {
    if (currentUser?.role === 'teacher') {
      navigate(`/surveys/${survey.id}/results`);
    } else {
      if (!hasResponded && isActive) {
        navigate(`/surveys/${survey.id}`);
      } else {
        navigate(`/surveys/${survey.id}/results`);
      }
    }
  };

  return (
    <Card hoverable onClick={handleClick} className="overflow-hidden group">
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={isActive ? 'success' : 'default'} size="sm">
              {isActive ? '进行中' : '已结束'}
            </Badge>
            {currentUser?.role === 'parent' && hasResponded && (
              <Badge variant="success" size="sm">
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  已回复
                </span>
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            {formatRelativeTime(survey.createdAt)}
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
          {survey.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-2 mb-4">
          {survey.description}
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1 text-gray-500">
              <Users className="w-3.5 h-3.5" />
              <span>已回复 {responseCount}/{totalParents} 人</span>
            </div>
            <span className="text-gray-400">{responsePercent}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full rounded-full transition-all duration-500',
                isActive ? 'bg-gradient-to-r from-green-500 to-emerald-600' : 'bg-gradient-to-r from-gray-400 to-gray-500'
              )}
              style={{ width: `${responsePercent}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
          <div className="text-xs text-gray-400">
            截止：{formatDate(survey.deadline)}
          </div>
          <div className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
            {currentUser?.role === 'teacher' ? (
              <>
                <BarChart3 className="w-4 h-4" />
                <span>查看统计</span>
              </>
            ) : (
              <>
                <span>{!hasResponded && isActive ? '填写问卷' : '查看结果'}</span>
                <ChevronRight className="w-4 h-4" />
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
