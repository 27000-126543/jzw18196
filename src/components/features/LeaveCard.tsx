import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, ChevronRight, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { useAppStore } from '@/store';
import { formatDate, formatDateTime, formatRelativeTime } from '@/utils/date';
import { LEAVE_TYPE_LABELS, LEAVE_STATUS_LABELS, LEAVE_STATUS_COLORS } from '@/utils/constants';
import type { LeaveRequest } from '@/types';

interface LeaveCardProps {
  leave: LeaveRequest;
}

export const LeaveCard = ({ leave }: LeaveCardProps) => {
  const navigate = useNavigate();
  const { currentUser, getStudentById } = useAppStore();
  const student = getStudentById(leave.studentId);

  const statusIcon = leave.status === 'pending' ? AlertCircle
    : leave.status === 'approved' ? CheckCircle
    : XCircle;

  const StatusIcon = statusIcon;

  const handleClick = () => {
    if (currentUser?.role === 'teacher' && leave.status === 'pending') {
      navigate(`/leaves/${leave.id}/approve`);
    }
  };

  return (
    <Card
      hoverable={currentUser?.role === 'teacher' && leave.status === 'pending'}
      onClick={handleClick}
      className="overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <Avatar
            src={student?.avatar}
            name={student?.name}
            size="lg"
            className="flex-shrink-0"
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-semibold text-gray-900">
                  {student?.name}
                </h3>
                <Badge variant="info" size="sm">
                  {LEAVE_TYPE_LABELS[leave.type]}
                </Badge>
              </div>
              <Badge
                variant={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}
                size="sm"
                className="flex-shrink-0"
              >
                <span className="flex items-center gap-1">
                  <StatusIcon className="w-3 h-3" />
                  {LEAVE_STATUS_LABELS[leave.status]}
                </span>
              </Badge>
            </div>

            <div className="space-y-1.5 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  {formatDate(leave.startTime)} 至 {formatDate(leave.endTime)}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{formatRelativeTime(leave.createdAt)} 提交</span>
              </div>
            </div>

            <p className="text-sm text-gray-600 bg-gray-50 rounded-lg p-3 mb-3">
              {leave.reason}
            </p>

            {leave.approvalNote && (
              <div className="text-xs text-gray-500 bg-blue-50 rounded-lg p-2.5 border border-blue-100">
                <span className="font-medium text-blue-700">审批意见：</span>
                {leave.approvalNote}
              </div>
            )}

            {leave.status === 'pending' && currentUser?.role === 'teacher' && (
              <div className="flex items-center justify-end mt-3 pt-3 border-t border-gray-50">
                <div className="flex items-center gap-1 text-blue-600 text-sm font-medium">
                  <span>点击审批</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
