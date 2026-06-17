import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Send, Users, CheckCircle, AlertTriangle, User, MessageSquare } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Input, TextArea, Select } from '@/components/common/Input';
import { Avatar, AvatarGroup } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { useAppStore } from '@/store';
import { formatRelativeTime } from '@/utils/date';
import type { Group } from '@/types';

const GroupMessage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, groups, students, getStudentById, getParentByStudentId, sendGroupMessage, groupMessages } = useAppStore();
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    (location.state as any)?.selectedGroupId || ''
  );
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState('');

  const selectedGroup = groups.find(g => g.id === selectedGroupId);

  const groupMembers = useMemo(() => {
    if (!selectedGroup) return [];
    return selectedGroup.studentIds.map(sid => {
      const student = getStudentById(sid);
      const parent = student ? getParentByStudentId(student.id) : undefined;
      return { student, parent };
    }).filter(m => m.student);
  }, [selectedGroup, getStudentById, getParentByStudentId]);

  const recentMessages = useMemo(() => {
    if (!selectedGroupId) return [];
    return groupMessages
      .filter(m => m.groupId === selectedGroupId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 10);
  }, [groupMessages, selectedGroupId]);

  const handleSubmit = async () => {
    const content = message.trim();
    if (!content) return;

    if (!selectedGroupId) {
      setError('请选择发送小组');
      return;
    }

    setIsSending(true);
    try {
      sendGroupMessage(selectedGroupId, content);
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  if (currentUser?.role !== 'teacher') {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">无权限访问</h2>
          <p className="text-sm text-gray-500">小组消息仅老师可发送</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">发送小组消息</h1>
          <p className="text-sm text-gray-500 mt-1">选择小组，给小组内的所有家长发送消息</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-6 space-y-6">
                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
                    <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <Users className="w-4 h-4 text-gray-400" />
                    选择小组
                  </label>
                  <Select
                    value={selectedGroupId}
                    onChange={(e) => setSelectedGroupId(e.target.value)}
                  >
                    <option value="">请选择小组...</option>
                    {groups.map(group => (
                      <option key={group.id} value={group.id}>
                        {group.name} ({group.studentIds.length}人)
                      </option>
                    ))}
                  </Select>
                </div>

                {selectedGroup && (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                        <User className="w-4 h-4 text-gray-400" />
                        接收家长
                      </label>
                      <span className="text-xs text-gray-400">共 {groupMembers.length} 位家长</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {groupMembers.map((member) => (
                        <div
                          key={member.student?.id}
                          className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg"
                        >
                          <Avatar
                            src={member.parent?.avatar}
                            name={member.parent?.name}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {member.parent?.name}
                            </p>
                            <p className="text-xs text-gray-500 truncate">
                              {member.student?.name}家长
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                    <MessageSquare className="w-4 h-4 text-gray-400" />
                    消息内容
                  </label>
                  <TextArea
                    placeholder="请输入消息内容..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    maxLength={1000}
                    disabled={!selectedGroupId}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {message.length}/1000
                    </span>
                    {selectedGroup && (
                      <span className="text-xs text-gray-400">
                        将发送给 {groupMembers.length} 位家长
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(-1)}
                    disabled={isSending}
                  >
                    取消
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedGroupId || !message.trim() || isSending}
                    isLoading={isSending}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    发送消息
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <div className="p-4 border-b border-gray-100">
                <h3 className="font-semibold text-gray-900">小组信息</h3>
              </div>
              {selectedGroup ? (
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{selectedGroup.name}</p>
                      <p className="text-sm text-gray-500">{groupMembers.length} 位学生</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">成员头像</p>
                    <AvatarGroup
                      avatars={groupMembers.map(m => ({
                        src: m.student?.avatar,
                        name: m.student?.name
                      }))}
                      max={8}
                      size="md"
                    />
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">请选择小组</p>
                </div>
              )}
            </Card>

            {selectedGroup && recentMessages.length > 0 && (
              <Card>
                <div className="p-4 border-b border-gray-100">
                  <h3 className="font-semibold text-gray-900">最近消息记录</h3>
                </div>
                <div className="divide-y divide-gray-50">
                  {recentMessages.map(msg => (
                    <div key={msg.id} className="p-4">
                      <p className="text-sm text-gray-700 mb-1 whitespace-pre-wrap">
                        {msg.content}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400">
                        <span>{formatRelativeTime(msg.createdAt)}</span>
                        <span>
                          <CheckCircle className="w-3 h-3 inline mr-1" />
                          已读 {msg.readStatus.length}/{groupMembers.length}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default GroupMessage;
