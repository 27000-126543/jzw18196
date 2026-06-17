import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Calendar, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { LeaveCard } from '@/components/features/LeaveCard';
import { Empty } from '@/components/Empty';
import { useAppStore } from '@/store';
import { LEAVE_STATUS_LABELS } from '@/utils/constants';
import type { LeaveStatus } from '@/types';

const LeaveList = () => {
  const navigate = useNavigate();
  const { currentUser, leaves, students } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | 'all'>('all');

  const filteredLeaves = useMemo(() => {
    let result = [...leaves];

    if (currentUser?.role === 'parent') {
      const studentIds = currentUser.studentIds || [];
      result = result.filter(leave => studentIds.includes(leave.studentId));
    }

    if (statusFilter !== 'all') {
      result = result.filter(leave => leave.status === statusFilter);
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(leave => {
        const student = students.find(s => s.id === leave.studentId);
        return (
          student?.name.toLowerCase().includes(term) ||
          leave.reason.toLowerCase().includes(term)
        );
      });
    }

    return result;
  }, [leaves, currentUser, statusFilter, searchTerm, students]);

  const stats = useMemo(() => {
    const targetLeaves = currentUser?.role === 'parent'
      ? leaves.filter(l => (currentUser.studentIds || []).includes(l.studentId))
      : leaves;

    return {
      total: targetLeaves.length,
      pending: targetLeaves.filter(l => l.status === 'pending').length,
      approved: targetLeaves.filter(l => l.status === 'approved').length,
      rejected: targetLeaves.filter(l => l.status === 'rejected').length
    };
  }, [leaves, currentUser]);

  const filterOptions: { value: LeaveStatus | 'all'; label: string; icon: any; color: string }[] = [
    { value: 'all', label: '全部', icon: Calendar, color: 'bg-gray-100 text-gray-700' },
    { value: 'pending', label: '待审批', icon: AlertCircle, color: 'bg-amber-100 text-amber-700' },
    { value: 'approved', label: '已批准', icon: CheckCircle, color: 'bg-green-100 text-green-700' },
    { value: 'rejected', label: '已拒绝', icon: XCircle, color: 'bg-red-100 text-red-700' }
  ];

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">请假管理</h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentUser?.role === 'teacher' ? '管理学生请假申请，记录出勤情况' : '提交和查看孩子的请假申请'}
            </p>
          </div>
          {currentUser?.role === 'parent' && (
            <Button onClick={() => navigate('/leaves/new')}>
              <Plus className="w-4 h-4 mr-2" />
              提交请假
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">全部申请</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
                <p className="text-xs text-gray-500">待审批</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
                <p className="text-xs text-gray-500">已批准</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
                <p className="text-xs text-gray-500">已拒绝</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder={currentUser?.role === 'teacher' ? '搜索学生姓名或请假原因...' : '搜索请假原因...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            {filterOptions.map(option => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    statusFilter === option.value
                      ? `${option.color} ring-2 ring-offset-1 ring-current/20`
                      : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filteredLeaves.length > 0 ? (
        <div className="space-y-4">
          {filteredLeaves.map((leave, index) => (
            <div
              key={leave.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in-up"
            >
              <LeaveCard leave={leave} />
            </div>
          ))}
        </div>
      ) : (
        <Empty
          icon={Calendar}
          title="暂无请假记录"
          description={currentUser?.role === 'teacher' ? '还没有学生提交请假申请' : '还没有提交过请假申请'}
          action={currentUser?.role === 'parent' ? {
            label: '提交请假',
            onClick: () => navigate('/leaves/new')
          } : undefined}
        />
      )}
    </PageContainer>
  );
};

export default LeaveList;
