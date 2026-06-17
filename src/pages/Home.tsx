import { useNavigate } from 'react-router-dom';
import { Bell, CalendarClock, ClipboardList, Users, Plus, TrendingUp, ChevronRight } from 'lucide-react';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { NoticeCard } from '@/components/features/NoticeCard';
import { useAppStore } from '@/store';
import { formatRelativeTime } from '@/utils/date';
import { useEffect } from 'react';

export const Home = () => {
  const navigate = useNavigate();
  const { currentUser, notices, leaves, surveys, users, init, isInitialized } = useAppStore();

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [init, isInitialized]);

  const totalParents = users.filter(u => u.role === 'parent').length;
  const pendingLeaves = leaves.filter(l => l.status === 'pending').length;
  const activeSurveys = surveys.filter(s => new Date(s.deadline) > new Date()).length;

  const latestNotices = notices.slice(0, 3);

  const stats = [
    {
      title: '通知总数',
      value: notices.length,
      icon: Bell,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      title: '待审批请假',
      value: pendingLeaves,
      icon: CalendarClock,
      color: 'from-amber-500 to-orange-500',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      title: '进行中问卷',
      value: activeSurveys,
      icon: ClipboardList,
      color: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    },
    {
      title: '家长人数',
      value: totalParents,
      icon: Users,
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50',
      iconColor: 'text-pink-600'
    }
  ];

  if (!currentUser) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute left-0 bottom-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <h1 className="text-2xl font-bold mb-1">
            {currentUser.role === 'teacher' ? '欢迎回来，王老师' : `欢迎，${currentUser.name}`}
          </h1>
          <p className="text-blue-100 mb-6">
            {currentUser.role === 'teacher' 
              ? '今天是美好的一天，来看看班级的最新动态吧' 
              : '了解孩子在学校的最新情况'}
          </p>

          {currentUser.role === 'teacher' && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/notices/new')}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Plus className="w-4 h-4" />
                发布通知
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/surveys/new')}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <ClipboardList className="w-4 h-4" />
                创建问卷
              </Button>
            </div>
          )}

          {currentUser.role === 'parent' && (
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={() => navigate('/leaves/new')}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <CalendarClock className="w-4 h-4" />
                提交请假
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/chats')}
                className="bg-white/20 hover:bg-white/30 text-white border-0"
              >
                <Bell className="w-4 h-4" />
                联系老师
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-3 text-xs text-gray-400">
                  <TrendingUp className="w-3.5 h-3.5 text-green-500" />
                  <span>数据实时更新</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">最新通知</h2>
          <button
            onClick={() => navigate('/notices')}
            className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {latestNotices.length > 0 ? (
            latestNotices.map((notice, index) => (
              <div
                key={notice.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className="animate-in fade-in slide-in-from-bottom-4"
              >
                <NoticeCard notice={notice} />
              </div>
            ))
          ) : (
            <Card className="col-span-full p-8 text-center">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">暂无通知</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
