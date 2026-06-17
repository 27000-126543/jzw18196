import { Bell, Search, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '@/store';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { useState } from 'react';

export const Header = () => {
  const navigate = useNavigate();
  const { currentUser, logout, classInfo } = useAppStore();
  const [showLogout, setShowLogout] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!currentUser) return null;

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100">
      <div className="flex items-center justify-between px-8 py-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {classInfo?.name || '班级管理'}
          </h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {currentUser.role === 'teacher' ? '欢迎回来，王老师' : `欢迎，${currentUser.name}`}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="搜索通知、学生..."
              className="pl-10 pr-4 py-2 w-64 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowLogout(!showLogout)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Avatar src={currentUser.avatar} name={currentUser.name} size="sm" />
            </button>

            {showLogout && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowLogout(false)}
                />
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-sm font-medium text-gray-900">{currentUser.name}</p>
                    <p className="text-xs text-gray-500">{currentUser.phone}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
