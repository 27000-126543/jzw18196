import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Search, ChevronRight, User, Phone } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Input } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { Empty } from '@/components/Empty';
import { useAppStore } from '@/store';
import { formatRelativeTime, formatTime } from '@/utils/date';
import { cn } from '@/lib/utils';

const ChatList = () => {
  const navigate = useNavigate();
  const { currentUser, chats, users, students, getStudentById, getOrCreateChat, markMessagesRead } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');

  const myChats = useMemo(() => {
    if (!currentUser) return [];

    let chatList: {
      chat: typeof chats[0];
      otherUser: typeof users[0];
      student: typeof students[0] | undefined;
      unreadCount: number;
      lastMessage: typeof chats[0]['messages'][0] | undefined;
    }[] = [];

    if (currentUser.role === 'teacher') {
      users.filter(u => u.role === 'parent').forEach(parent => {
        (parent.studentIds || []).forEach(studentId => {
          const student = getStudentById(studentId);
          const chat = getOrCreateChat(currentUser.id, parent.id, studentId);
          const unreadCount = chat.messages.filter(m => m.senderId !== currentUser.id && !m.read).length;
          const lastMessage = chat.messages[chat.messages.length - 1];

          chatList.push({
            chat,
            otherUser: parent,
            student,
            unreadCount,
            lastMessage
          });
        });
      });
    } else {
      const teacher = users.find(u => u.role === 'teacher');
      if (teacher) {
        (currentUser.studentIds || []).forEach(studentId => {
          const student = getStudentById(studentId);
          const chat = getOrCreateChat(teacher.id, currentUser.id, studentId);
          const unreadCount = chat.messages.filter(m => m.senderId !== currentUser.id && !m.read).length;
          const lastMessage = chat.messages[chat.messages.length - 1];

          chatList.push({
            chat,
            otherUser: teacher,
            student,
            unreadCount,
            lastMessage
          });
        });
      }
    }

    return chatList.sort((a, b) => {
      const aTime = a.lastMessage?.createdAt || a.chat.createdAt;
      const bTime = b.lastMessage?.createdAt || b.chat.createdAt;
      return new Date(bTime).getTime() - new Date(aTime).getTime();
    });
  }, [chats, currentUser, users, getOrCreateChat, getStudentById]);

  const filteredChats = useMemo(() => {
    if (!searchTerm) return myChats;
    const term = searchTerm.toLowerCase();
    return myChats.filter(item =>
      item.otherUser.name.toLowerCase().includes(term) ||
      item.student?.name.toLowerCase().includes(term) ||
      item.lastMessage?.content.toLowerCase().includes(term)
    );
  }, [myChats, searchTerm]);

  const handleChatClick = (chatId: string) => {
    navigate(`/chats/${chatId}`);
  };

  return (
    <PageContainer>
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">消息中心</h1>
          <p className="text-sm text-gray-500">
            {currentUser?.role === 'teacher' ? '与家长一对一沟通，聊天记录可存档查看' : '与老师沟通孩子的学习和生活情况'}
          </p>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索家长、学生或聊天内容..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {filteredChats.length > 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {filteredChats.map((item, index) => (
              <div
                key={item.chat.id}
                onClick={() => handleChatClick(item.chat.id)}
                className={cn(
                  'flex items-center gap-4 p-4 cursor-pointer transition-all hover:bg-gray-50 animate-fade-in-up',
                  index !== filteredChats.length - 1 && 'border-b border-gray-50'
                )}
                style={{ animationDelay: `${index * 30}ms` }}
              >
                <div className="relative">
                  <Avatar
                    src={item.otherUser.avatar}
                    name={item.otherUser.name}
                    size="lg"
                  />
                  {item.unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                      {item.unreadCount > 99 ? '99+' : item.unreadCount}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3 mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="font-medium text-gray-900 truncate">
                        {item.otherUser.name}
                      </span>
                      {item.student && (
                        <Badge variant="info" size="sm" className="flex-shrink-0">
                          {item.student.name}家长
                        </Badge>
                      )}
                    </div>
                    {item.lastMessage && (
                      <span className="text-xs text-gray-400 flex-shrink-0">
                        {formatRelativeTime(item.lastMessage.createdAt)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    {item.lastMessage ? (
                      <>
                        {item.lastMessage.senderId === currentUser?.id && (
                          <span className="text-gray-400">我：</span>
                        )}
                        {item.lastMessage.content}
                      </>
                    ) : (
                      <span className="text-gray-400">暂无消息，点击开始聊天</span>
                    )}
                  </p>
                </div>

                <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <Empty
            icon={MessageSquare}
            title="暂无聊天"
            description={searchTerm ? '没有找到匹配的聊天记录' : '还没有开始任何聊天，点击列表开始沟通'}
          />
        )}
      </div>
    </PageContainer>
  );
};

export default ChatList;
