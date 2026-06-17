import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, FileText, User, AlertTriangle } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input, Select, TextArea } from '@/components/common/Input';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { useAppStore } from '@/store';
import { LEAVE_TYPE_LABELS } from '@/utils/constants';
import type { LeaveType } from '@/types';

const LeaveNew = () => {
  const navigate = useNavigate();
  const { currentUser, students, createLeave } = useAppStore();
  const [studentId, setStudentId] = useState('');
  const [type, setType] = useState<LeaveType>('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const myStudents = students.filter(s =>
    currentUser?.studentIds?.includes(s.id)
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!studentId) {
      setError('请选择请假学生');
      return;
    }
    if (!startDate || !endDate) {
      setError('请选择请假起止日期');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('结束日期不能早于开始日期');
      return;
    }
    if (!reason.trim()) {
      setError('请填写请假原因');
      return;
    }

    setIsSubmitting(true);
    try {
      const startTime = new Date(startDate).toISOString();
      const endTimeDate = new Date(endDate);
      endTimeDate.setHours(23, 59, 59, 999);
      const endTime = endTimeDate.toISOString();

      createLeave({
        studentId,
        type,
        startTime,
        endTime,
        reason: reason.trim()
      });

      navigate('/leaves');
    } catch (err) {
      setError('提交失败，请重试');
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
          <h1 className="text-2xl font-bold text-gray-900">提交请假申请</h1>
          <p className="text-sm text-gray-500 mt-1">填写请假信息，提交后由老师审批</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <User className="w-4 h-4 text-gray-400" />
                选择学生
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {myStudents.map(student => (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => setStudentId(student.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all text-left ${
                      studentId === student.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <Avatar
                      src={student.avatar}
                      name={student.name}
                      size="md"
                    />
                    <div>
                      <p className="font-medium text-gray-900">{student.name}</p>
                      <p className="text-xs text-gray-500">学号: {student.studentNumber}</p>
                    </div>
                    {studentId === student.id && (
                      <Badge variant="primary" size="sm" className="ml-auto">
                        已选择
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <FileText className="w-4 h-4 text-gray-400" />
                请假类型
              </label>
              <Select
                value={type}
                onChange={(e) => setType(e.target.value as LeaveType)}
              >
                {Object.entries(LEAVE_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </Select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  开始日期
                </label>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  结束日期
                </label>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <FileText className="w-4 h-4 text-gray-400" />
                请假原因
              </label>
              <TextArea
                placeholder="请详细说明请假原因..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                maxLength={500}
              />
              <p className="text-xs text-gray-400 mt-2 text-right">
                {reason.length}/500
              </p>
            </div>

            <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0" />
              <div className="text-sm text-amber-700">
                <p className="font-medium">温馨提示</p>
                <p className="mt-0.5 text-amber-600">
                  请假申请提交后，老师会在24小时内审批。如需紧急请假，请直接电话联系班主任。
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <Button
                type="button"
                variant="ghost"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
              >
                取消
              </Button>
              <Button
                type="submit"
                isLoading={isSubmitting}
                disabled={isSubmitting}
              >
                提交申请
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </PageContainer>
  );
};

export default LeaveNew;
