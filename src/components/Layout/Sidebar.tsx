import { NavLink, useLocation } from 'react-router-dom';
import {
  Home,
  Bell,
  CalendarClock,
  ClipboardList,
  MessageSquare,
  Users,
  UsersRound,
  Send,
  Settings,
  GraduationCap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store';

interface NavItem {
  path: string;
  label: string;
  icon: React.ElementType;
  roles: ('teacher' | 'parent')[];
}

const navItems: NavItem[] = [
  { path: '/', label: '班级主页', icon: Home, roles: ['teacher', 'parent'] },
  { path: '/notices', label: '通知管理', icon: Bell, roles: ['teacher', 'parent'] },
  { path: '/leaves', label: '请假管理', icon: CalendarClock, roles: ['teacher', 'parent'] },
  { path: '/surveys', label: '家长问卷', icon: ClipboardList, roles: ['teacher', 'parent'] },
  { path: '/chats', label: '私聊频道', icon: MessageSquare, roles: ['teacher', 'parent'] },
  { path: '/students', label: '学生名册', icon: Users, roles: ['teacher'] },
  { path: '/groups', label: '小组管理', icon: UsersRound, roles: ['teacher'] },
  { path: '/groups/message', label: '小组消息', icon: Send, roles: ['teacher'] },
  { path: '/profile', label: '个人中心', icon: Settings, roles: ['teacher', 'parent'] }
];

export const Sidebar = () => {
  const location = useLocation();
  const { currentUser, classInfo, getUnreadCount } = useAppStore();

  if (!currentUser) return null;

  const unreadCount = getUnreadCount(currentUser.id);

  const filteredNavItems = navItems.filter(item => item.roles.includes(currentUser.role));

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 bg-white border-r border-gray-100 shadow-sm z-40 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">家校通</h1>
            {classInfo && (
              <p className="text-xs text-gray-500">{classInfo.name}</p>
            )}
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {filteredNavItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path ||
            (item.path !== '/' && location.pathname.startsWith(item.path));

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                'hover:bg-blue-50 hover:text-blue-600',
                isActive
                  ? 'bg-blue-50 text-blue-600 shadow-sm'
                  : 'text-gray-600',
                'animate-in fade-in slide-in-from-left-4 duration-300'
              )}
              style={{ animationDelay: `${index * 30}ms` }}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.path === '/chats' && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm overflow-hidden">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.slice(0, 1)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{currentUser.name}</p>
            <p className="text-xs text-gray-500">
              {currentUser.role === 'teacher' ? '班主任' : '家长'}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
