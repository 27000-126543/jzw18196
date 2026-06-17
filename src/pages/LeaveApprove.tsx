import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, User, FileText, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { TextArea } from '@/components/common/Input';
import { useAppStore } from '@/store';
import { LEAVE_TYPE_LABELS, LEAVE_STATUS_LABELS } from '@/utils/constants';
import { formatDate, formatRelativeTime } from '@/utils/date';
import type { LeaveStatus } from '@/types';

const LeaveApprove = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, leaves, getStudentById, getParentByStudentId, approveLeave } = useAppStore();
  const [approvalNote, setApprovalNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const leave = leaves.find(l => l.id === id);
  const student = leave ? getStudentById(leave.studentId) : undefined;
  const parent = student ? getParentByStudentId(student.id) : undefined;

  if (currentUser?.role !== 'teacher') {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">无权限访问</h2>
          <p className="text-sm text-gray-500 mb-6">请假审批仅老师可操作</p>
          <Button onClick={() => navigate('/leaves')}>返回请假列表</Button>
        </div>
      </PageContainer>
    );
  }

  if (!leave || !student) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">请假申请不存在</h2>
          <Button onClick={() => navigate('/leaves')}>返回列表</Button>
        </div>
      </PageContainer>
    );
  }

  const handleApprove = async (status: LeaveStatus) => {
    setError('');
    setIsSubmitting(true);
    try {
      approveLeave(leave.id, status, approvalNote.trim() || undefined);
      navigate('/leaves');
    } catch (err) {
      setError('操作失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">审批请假申请</h1>
          <p className="text-sm text-gray-500 mt-1">审核学生请假信息，决定是否批准</p>
        </div>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex items-start gap-4 mb-6">
              <Avatar
                src={student.avatar}
                name={student.name}
                size="xl"
                className="flex-shrink-0"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-xl font-semibold text-gray-900">{student.name}</h2>
                  <Badge variant="info" size="sm">
                    {LEAVE_TYPE_LABELS[leave.type]}
                  </Badge>
                  <Badge
                    variant={leave.status === 'approved' ? 'success' : leave.status === 'rejected' ? 'danger' : 'warning'}
                    size="sm"
                  >
                    {LEAVE_STATUS_LABELS[leave.status]}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-2">
                  学号: {student.studentNumber} | {student.className}
                </p>
                {parent && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <User className="w-4 h-4" />
                    <span>{parent.name}</span>
                    <span className="text-gray-300">|</span>
                    <span>{parent.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Calendar className="w-4 h-4" />
                  <span>请假时间</span>
                </div>
                <p className="font-medium text-gray-900">
                  {formatDate(leave.startTime)} 至 {formatDate(leave.endTime)}
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
                  <Clock className="w-4 h-4" />
                  <span>提交时间</span>
                </div>
                <p className="font-medium text-gray-900">
                  {formatRelativeTime(leave.createdAt)}
                </p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                <FileText className="w-4 h-4" />
                <span>请假原因</span>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
                <p className="text-gray-700 whitespace-pre-wrap">{leave.reason}</p>
              </div>
            </div>

            {leave.status !== 'pending' && (
              <div className={`p-4 rounded-xl border ${
                leave.status === 'approved' ? 'bg-green-50 border-green-100' : 'bg-red-50 border-red-100'
              }`}>
                <div className="flex items-center gap-2 mb-1">
                  {leave.status === 'approved' ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <span className={`font-medium ${
                    leave.status === 'approved' ? 'text-green-700' : 'text-red-700'
                  }`}>
                    {LEAVE_STATUS_LABELS[leave.status]}
                  </span>
                </div>
                {leave.approvalNote && (
                  <p className="text-sm text-gray-600 mt-1 ml-7">
                    审批意见：{leave.approvalNote}
                  </p>
                )}
              </div>
            )}
          </div>
        </Card>

        {leave.status === 'pending' && (
          <Card>
            <div className="p-6">
              <h3 className="font-semibold text-gray-900 mb-4">填写审批意见（可选）</h3>
              <TextArea
                placeholder="请输入审批意见..."
                value={approvalNote}
                onChange={(e) => setApprovalNote(e.target.value)}
                rows={3}
                maxLength={200}
              />
              <p className="text-xs text-gray-400 mt-2 text-right">
                {approvalNote.length}/200
              </p>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm mt-4">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  取消
                </Button>
                <Button
                  variant="danger"
                  onClick={() => handleApprove('rejected')}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  拒绝
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleApprove('approved')}
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  批准
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default LeaveApprove;
