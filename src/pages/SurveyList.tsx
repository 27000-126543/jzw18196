import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, FileText, Users, Clock, CheckCircle } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { SurveyCard } from '@/components/features/SurveyCard';
import { Empty } from '@/components/Empty';
import { useAppStore } from '@/store';
import { isExpired } from '@/utils/date';

const SurveyList = () => {
  const navigate = useNavigate();
  const { currentUser, surveys, users } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired' | 'responded'>('all');

  const totalParents = users.filter(u => u.role === 'parent').length;

  const filteredSurveys = useMemo(() => {
    let result = [...surveys];

    if (currentUser?.role === 'parent') {
      if (statusFilter === 'responded') {
        result = result.filter(s => s.responses.some(r => r.parentId === currentUser.id));
      } else if (statusFilter === 'active') {
        result = result.filter(s => !isExpired(s.deadline) && !s.responses.some(r => r.parentId === currentUser.id));
      } else if (statusFilter === 'expired') {
        result = result.filter(s => isExpired(s.deadline));
      }
    } else {
      if (statusFilter === 'active') {
        result = result.filter(s => !isExpired(s.deadline));
      } else if (statusFilter === 'expired') {
        result = result.filter(s => isExpired(s.deadline));
      }
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.title.toLowerCase().includes(term) ||
        s.description.toLowerCase().includes(term)
      );
    }

    return result;
  }, [surveys, currentUser, statusFilter, searchTerm]);

  const stats = useMemo(() => {
    const targetSurveys = currentUser?.role === 'parent'
      ? surveys.filter(s => s.responses.some(r => r.parentId === currentUser.id) || !isExpired(s.deadline))
      : surveys;

    return {
      total: surveys.length,
      active: surveys.filter(s => !isExpired(s.deadline)).length,
      totalResponses: surveys.reduce((acc, s) => acc + s.responses.length, 0),
      myResponses: currentUser?.role === 'parent'
        ? surveys.filter(s => s.responses.some(r => r.parentId === currentUser.id)).length
        : 0
    };
  }, [surveys, currentUser, totalParents]);

  const filterOptions = [
    { value: 'all' as const, label: '全部', icon: FileText },
    { value: 'active' as const, label: '进行中', icon: Clock },
    { value: 'expired' as const, label: '已结束', icon: CheckCircle },
    ...(currentUser?.role === 'parent' ? [{ value: 'responded' as const, label: '已回复', icon: CheckCircle }] : [])
  ];

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">家长问卷</h1>
            <p className="text-sm text-gray-500 mt-1">
              {currentUser?.role === 'teacher' ? '发起问卷收集家长意见，自动汇总统计' : '查看和回复老师发起的问卷'}
            </p>
          </div>
          {currentUser?.role === 'teacher' && (
            <Button onClick={() => navigate('/surveys/new')}>
              <Plus className="w-4 h-4 mr-2" />
              发起问卷
            </Button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">问卷总数</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <Clock className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
                <p className="text-xs text-gray-500">进行中</p>
              </div>
            </div>
          </div>
          {currentUser?.role === 'teacher' ? (
            <>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <Users className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalResponses}</p>
                    <p className="text-xs text-gray-500">总回复数</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{totalParents}</p>
                    <p className="text-xs text-gray-500">家长总数</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.myResponses}</p>
                    <p className="text-xs text-gray-500">已回复</p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                    <Clock className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stats.active - stats.myResponses > 0 ? stats.active - stats.myResponses : 0}</p>
                    <p className="text-xs text-gray-500">待回复</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索问卷标题或描述..."
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
                      ? 'bg-blue-100 text-blue-700 ring-2 ring-offset-1 ring-blue-200'
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

      {filteredSurveys.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSurveys.map((survey, index) => (
            <div
              key={survey.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in-up"
            >
              <SurveyCard survey={survey} />
            </div>
          ))}
        </div>
      ) : (
        <Empty
          icon={FileText}
          title="暂无问卷"
          description={currentUser?.role === 'teacher' ? '还没有发起过问卷，点击右上角发起第一个问卷吧' : '还没有需要回复的问卷'}
          action={currentUser?.role === 'teacher' ? {
            label: '发起问卷',
            onClick: () => navigate('/surveys/new')
          } : undefined}
        />
      )}
    </PageContainer>
  );
};

export default SurveyList;
