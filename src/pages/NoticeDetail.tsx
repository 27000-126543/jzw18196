import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Eye, User, CheckCircle2, BellRing, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { useAppStore } from '@/store';
import { formatDateTime, formatRelativeTime } from '@/utils/date';
import { NOTICE_CATEGORY_LABELS } from '@/utils/constants';
import { cn } from '@/lib/utils';

export const NoticeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notices, users, currentUser, markNoticeRead, getParentByStudentId, students, init, isInitialized } = useAppStore();
  const [activeTab, setActiveTab] = useState<'read' | 'unread'>('read');

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [init, isInitialized]);

  const notice = notices.find(n => n.id === id);

  useEffect(() => {
    if (notice && currentUser?.role === 'parent') {
      markNoticeRead(notice.id, currentUser.id);
    }
  }, [notice, currentUser, markNoticeRead]);

  if (!notice || !currentUser) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">通知不存在</p>
          <Button variant="outline" className="mt-4" onClick={() => navigate(-1)}>
            返回
          </Button>
        </div>
      </div>
    );
  }

  const totalParents = users.filter(u => u.role === 'parent').length;
  const readParents = notice.readStatus.map(rs => {
    const parent = users.find(u => u.id === rs.parentId);
    return { ...rs, parent };
  }).filter(item => item.parent);

  const unreadParentIds = users
    .filter(u => u.role === 'parent')
    .filter(u => !notice.readStatus.some(rs => rs.parentId === u.id));

  const categoryVariant = notice.category === 'homework' ? 'blue'
    : notice.category === 'activity' ? 'pink'
    : notice.category === 'holiday' ? 'green'
    : 'default';

  const hasRead = currentUser.role === 'parent'
    ? notice.readStatus.some(r => r.parentId === currentUser.id)
    : false;

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">通知详情</h1>
          <p className="text-sm text-gray-500 mt-1">查看通知内容和阅读状态</p>
        </div>
      </div>

      <Card>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant={categoryVariant as any}>
              {NOTICE_CATEGORY_LABELS[notice.category]}
            </Badge>
            {currentUser.role === 'parent' && (
              <Badge variant={hasRead ? 'success' : 'warning'}>
                {hasRead ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    已读
                  </span>
                ) : '未读'}
              </Badge>
            )}
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3.5 h-3.5" />
              {formatDateTime(notice.createdAt)}
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900">{notice.title}</h2>

          <div className="prose prose-sm max-w-none">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {notice.content}
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <User className="w-4 h-4" />
              <span>发布者：王老师</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {currentUser.role === 'teacher' && (
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">阅读统计</h3>
                <p className="text-sm text-gray-500 mt-1">
                  已读 {readParents.length}/{totalParents} 位家长
                </p>
              </div>
              {unreadParentIds.length > 0 && (
                <Button variant="outline" size="sm">
                  <BellRing className="w-4 h-4" />
                  提醒未读家长
                </Button>
              )}
            </div>

            <div className="mb-6">
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                  style={{ width: `${(readParents.length / totalParents) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex gap-2 mb-6">
              {(['read', 'unread'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {tab === 'read' ? `已读 (${readParents.length})` : `未读 (${unreadParentIds.length})`}
                </button>
              ))}
            </div>

            {activeTab === 'read' ? (
              readParents.length > 0 ? (
                <div className="space-y-3">
                  {readParents.map((item, index) => (
                    <div
                      key={item.parentId}
                      className="flex items-center gap-4 p-3 bg-green-50 rounded-lg border border-green-100 animate-in fade-in slide-in-from-left-4"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <Avatar
                        src={item.parent?.avatar}
                        name={item.parent?.name}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{item.parent?.name}</p>
                        <p className="text-xs text-gray-500">
                          于 {formatRelativeTime(item.readAt)} 阅读
                        </p>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  暂无已读家长
                </div>
              )
            ) : (
              unreadParentIds.length > 0 ? (
                <div className="space-y-3">
                  {unreadParentIds.map((parent, index) => (
                    <div
                      key={parent.id}
                      className="flex items-center gap-4 p-3 bg-amber-50 rounded-lg border border-amber-100 animate-in fade-in slide-in-from-left-4"
                      style={{ animationDelay: `${index * 30}ms` }}
                    >
                      <Avatar
                        src={parent.avatar}
                        name={parent.name}
                        size="sm"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">{parent.name}</p>
                        <p className="text-xs text-gray-500">尚未阅读通知</p>
                      </div>
                      <div className="w-2 h-2 bg-amber-500 rounded-full flex-shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  所有家长都已阅读
                </div>
              )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NoticeDetail;
