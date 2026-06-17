import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, Mail, LogOut, Settings, Bell, Shield, GraduationCap, Users, Edit2, RotateCcw } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { useAppStore } from '@/store';
import { STORAGE_KEYS } from '@/utils/constants';

const Profile = () => {
  const navigate = useNavigate();
  const { currentUser, logout, classInfo, students, init } = useAppStore();
  const [activeTab, setActiveTab] = useState<'info' | 'settings'>('info');
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = () => {
    setIsResetting(true);
    setTimeout(() => {
      Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
      init();
      navigate('/login');
      setShowResetModal(false);
      setIsResetting(false);
    }, 500);
  };

  if (!currentUser) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const myStudents = currentUser.role === 'parent'
    ? students.filter(s => currentUser.studentIds?.includes(s.id))
    : [];

  const menuItems = [
    { icon: Bell, label: '通知设置', description: '管理消息推送和提醒方式' },
    { icon: Shield, label: '隐私安全', description: '账户安全和隐私设置' },
    { icon: Settings, label: '通用设置', description: '语言、主题等偏好设置' },
  ];

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
          <p className="text-sm text-gray-500 mt-1">查看和管理您的个人信息</p>
        </div>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="relative">
                <Avatar
                  src={currentUser.avatar}
                  name={currentUser.name}
                  size="2xl"
                  className="ring-4 ring-blue-50 ring-offset-2"
                />
                <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
                  <Edit2 className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-xl font-bold text-gray-900">{currentUser.name}</h2>
                  <Badge variant={currentUser.role === 'teacher' ? 'primary' : 'success'}>
                    {currentUser.role === 'teacher' ? '老师' : '家长'}
                  </Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    <span>{currentUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>账号：{currentUser.account}</span>
                  </div>
                  {classInfo && (
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-4 h-4" />
                      <span>{classInfo.grade} {classInfo.name}</span>
                    </div>
                  )}
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </Card>

        <div className="flex border-b border-gray-200 mb-6">
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'info'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <User className="w-4 h-4" />
            基本信息
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Settings className="w-4 h-4" />
            设置
          </button>
        </div>

        {activeTab === 'info' ? (
          <div className="space-y-6">
            {currentUser.role === 'parent' && myStudents.length > 0 && (
              <Card>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    我的孩子
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {myStudents.map(student => (
                      <div
                        key={student.id}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                      >
                        <Avatar
                          src={student.avatar}
                          name={student.name}
                          size="md"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{student.name}</p>
                          <p className="text-xs text-gray-500">学号：{student.studentNumber}</p>
                        </div>
                        <Badge variant="info" size="sm">
                          {student.gender === 'male' ? '男' : '女'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            )}

            <Card>
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  账号信息
                </h3>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="flex items-center justify-between p-4">
                  <span className="text-gray-500">用户名</span>
                  <span className="font-medium text-gray-900">{currentUser.name}</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-gray-500">账号</span>
                  <span className="font-medium text-gray-900">{currentUser.account}</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-gray-500">手机号</span>
                  <span className="font-medium text-gray-900">{currentUser.phone}</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-gray-500">角色</span>
                  <Badge variant={currentUser.role === 'teacher' ? 'primary' : 'success'}>
                    {currentUser.role === 'teacher' ? '老师' : '家长'}
                  </Badge>
                </div>
                {classInfo && (
                  <div className="flex items-center justify-between p-4">
                    <span className="text-gray-500">所属班级</span>
                    <span className="font-medium text-gray-900">{classInfo.grade} {classInfo.name}</span>
                  </div>
                )}
              </div>
            </Card>
          </div>
        ) : (
          <div className="space-y-3">
            {menuItems.map((item, index) => (
              <Card key={index} hoverable className="cursor-pointer">
                <div className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <item.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{item.label}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </div>
              </Card>
            ))}

            <Card className="mt-6">
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">关于应用</h3>
              </div>
              <div className="divide-y divide-gray-50">
                <div className="flex items-center justify-between p-4">
                  <span className="text-gray-500">版本号</span>
                  <span className="font-medium text-gray-900">1.0.0</span>
                </div>
                <div className="flex items-center justify-between p-4">
                  <span className="text-gray-500">更新时间</span>
                  <span className="font-medium text-gray-900">2024-01-15</span>
                </div>
              </div>
            </Card>

            <Card className="mt-6 border-red-100">
              <div className="p-4 border-b border-red-100 bg-red-50/50">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <RotateCcw className="w-5 h-5 text-red-500" />
                  危险操作
                </h3>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 mb-4">
                  重置所有演示数据，包括通知、请假、问卷、聊天记录等。此操作不可撤销。
                </p>
                <Button
                  variant="danger"
                  onClick={() => setShowResetModal(true)}
                  fullWidth
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  重置演示数据
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>

      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="确认重置"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            确定要重置所有演示数据吗？此操作将清除所有通知、请假、问卷、聊天记录等数据，且不可撤销。
          </p>
          <div className="flex items-center gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => setShowResetModal(false)}
              fullWidth
              disabled={isResetting}
            >
              取消
            </Button>
            <Button
              variant="danger"
              onClick={handleResetData}
              fullWidth
              isLoading={isResetting}
            >
              确认重置
            </Button>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default Profile;
