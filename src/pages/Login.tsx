import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, GraduationCap, User, Lock } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { useAppStore } from '@/store';
import { cn } from '@/lib/utils';
import type { UserRole } from '@/types';

export const Login = () => {
  const navigate = useNavigate();
  const { login, currentUser, init, isInitialized } = useAppStore();
  const [role, setRole] = useState<UserRole>('teacher');
  const [account, setAccount] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [init, isInitialized]);

  useEffect(() => {
    if (currentUser) {
      navigate('/');
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    setAccount(role === 'teacher' ? 'teacher' : 'parent1');
    setPassword('123456');
  }, [role]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(role, account, password);
      if (user) {
        navigate('/');
      } else {
        setError('账号或密码错误，请重试');
      }
    } catch (err) {
      setError('登录失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <Card className="relative w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-8 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <GraduationCap className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-1">家校通平台</h1>
          <p className="text-blue-100 text-sm">连接学校与家庭的桥梁</p>
        </div>

        <div className="p-8">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            {(['teacher', 'parent'] as UserRole[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={cn(
                  'flex-1 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200',
                  role === r
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {r === 'teacher' ? '老师登录' : '家长登录'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="账号"
              type="text"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              placeholder="请输入账号"
              icon={<User className="w-4 h-4" />}
              autoComplete="username"
            />

            <div className="relative">
              <Input
                label="密码"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="请输入密码"
                icon={<Lock className="w-4 h-4" />}
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-400 hover:text-gray-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg animate-in shake">
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isLoading}
              className="mt-6"
            >
              {isLoading ? '登录中...' : '登 录'}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
            <p className="text-xs text-blue-600 font-medium mb-2">演示账号</p>
            <div className="text-xs text-gray-500 space-y-1">
              <p>老师：账号 <code className="bg-white px-1.5 py-0.5 rounded">teacher</code> 密码 <code className="bg-white px-1.5 py-0.5 rounded">123456</code></p>
              <p>家长：账号 <code className="bg-white px-1.5 py-0.5 rounded">parent1</code> 密码 <code className="bg-white px-1.5 py-0.5 rounded">123456</code></p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login;
