import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Paperclip, AlertCircle } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card, CardContent } from '@/components/common/Card';
import { Input, TextArea, Select } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { useAppStore } from '@/store';
import { NOTICE_CATEGORY_LABELS } from '@/utils/constants';
import type { NoticeCategory } from '@/types';
import { useEffect } from 'react';

export const NoticeNew = () => {
  const navigate = useNavigate();
  const { createNotice, currentUser, init, isInitialized } = useAppStore();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<NoticeCategory>('homework');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isInitialized) {
      init();
    }
  }, [init, isInitialized]);

  useEffect(() => {
    if (currentUser?.role !== 'teacher') {
      navigate('/');
    }
  }, [currentUser, navigate]);

  const categoryOptions = Object.entries(NOTICE_CATEGORY_LABELS).map(([value, label]) => ({
    value,
    label
  }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('请输入通知标题');
      return;
    }
    if (!content.trim()) {
      setError('请输入通知内容');
      return;
    }

    setIsSubmitting(true);
    try {
      createNotice({
        title: title.trim(),
        category,
        content: content.trim()
      });
      navigate('/notices');
    } catch (err) {
      setError('发布失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentUser || currentUser.role !== 'teacher') return null;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">发布通知</h1>
          <p className="text-sm text-gray-500 mt-1">创建新的班级通知并推送给全体家长</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <Card>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <p className="text-sm text-blue-700">
                通知发布后将立即推送给全体家长，家长阅读后会标记已读状态。
              </p>
            </div>

            <Input
              label="通知标题"
              placeholder="请输入通知标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
            />

            <Select
              label="通知分类"
              value={category}
              onChange={(e) => setCategory(e.target.value as NoticeCategory)}
              options={categoryOptions}
            />

            <TextArea
              label="通知内容"
              placeholder="请输入通知详细内容..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
              maxLength={2000}
            />

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Paperclip className="w-4 h-4" />
                <span>附件功能即将上线</span>
              </div>
              <div className="text-xs text-gray-400">
                {content.length}/2000 字
              </div>
            </div>

            {error && (
              <div className="text-sm text-red-500 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </CardContent>

          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl flex justify-end gap-3">
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
              disabled={isSubmitting}
            >
              <Send className="w-4 h-4" />
              {isSubmitting ? '发布中...' : '发布通知'}
            </Button>
          </div>
        </Card>
      </form>
    </div>
  );
};

export default NoticeNew;
