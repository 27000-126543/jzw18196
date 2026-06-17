import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Filter, Search } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { NoticeCard } from '@/components/features/NoticeCard';
import { Badge } from '@/components/common/Badge';
import { useAppStore } from '@/store';
import { NOTICE_CATEGORY_LABELS } from '@/utils/constants';
import type { NoticeCategory } from '@/types';
import { cn } from '@/lib/utils';

export const NoticeList = () => {
  const navigate = useNavigate();
  const { notices, currentUser } = useAppStore();
  const [categoryFilter, setCategoryFilter] = useState<NoticeCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredNotices = notices.filter(notice => {
    const matchCategory = categoryFilter === 'all' || notice.category === categoryFilter;
    const matchSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  const categories: { value: NoticeCategory | 'all'; label: string }[] = [
    { value: 'all', label: '全部' },
    { value: 'homework', label: '作业' },
    { value: 'activity', label: '活动' },
    { value: 'holiday', label: '假期' },
    { value: 'other', label: '其他' }
  ];

  if (!currentUser) return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">通知管理</h1>
          <p className="text-sm text-gray-500 mt-1">查看和管理班级通知</p>
        </div>
        {currentUser.role === 'teacher' && (
          <Button onClick={() => navigate('/notices/new')}>
            <Plus className="w-4 h-4" />
            发布通知
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索通知标题或内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategoryFilter(cat.value)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                categoryFilter === cat.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredNotices.length > 0 ? (
          filteredNotices.map((notice, index) => (
            <div
              key={notice.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-in fade-in slide-in-from-bottom-4"
            >
              <NoticeCard notice={notice} />
            </div>
          ))
        ) : (
          <Card className="col-span-full p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">暂无通知</h3>
            <p className="text-gray-500">
              {searchQuery || categoryFilter !== 'all'
                ? '没有找到匹配的通知，请尝试其他筛选条件'
                : '还没有发布任何通知'}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NoticeList;
