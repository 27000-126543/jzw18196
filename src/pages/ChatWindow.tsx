import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Send, Phone, MoreVertical, AlertTriangle } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Input } from '@/components/common/Input';
import { Button } from '@/components/common/Button';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { ChatBubble } from '@/components/features/ChatBubble';
import { useAppStore } from '@/store';
import { formatDate } from '@/utils/date';

const ChatWindow = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, chats, users, getStudentById, sendChatMessage, markMessagesRead } = useAppStore();
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const markedReadRef = useRef(false);

  const chat = chats.find(c => c.id === id);
  const otherUser = chat
    ? users.find(u => u.id === (currentUser?.role === 'teacher' ? chat.parentId : chat.teacherId))
    : undefined;
  const student = chat ? getStudentById(chat.studentId) : undefined;

  useEffect(() => {
    if (chat && currentUser && !markedReadRef.current) {
      const hasUnread = chat.messages.some(m => m.senderId !== currentUser.id && !m.read);
      if (hasUnread) {
        markMessagesRead(chat.id, currentUser.id);
      }
      markedReadRef.current = true;
    }
  }, [chat?.id, currentUser?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat?.messages.length]);

  if (!chat || !otherUser || !currentUser) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">聊天不存在</h2>
          <Button onClick={() => navigate('/chats')}>返回消息列表</Button>
        </div>
      </PageContainer>
    );
  }

  const handleSend = async () => {
    const content = message.trim();
    if (!content) return;

    setIsSending(true);
    try {
      sendChatMessage(chat.id, currentUser.id, content);
      setMessage('');
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const messages = chat.messages;
  const groupedMessages: { date: string; messages: typeof messages }[] = [];

  messages.forEach(msg => {
    const date = formatDate(msg.createdAt);
    const lastGroup = groupedMessages[groupedMessages.length - 1];
    if (lastGroup && lastGroup.date === date) {
      lastGroup.messages.push(msg);
    } else {
      groupedMessages.push({ date, messages: [msg] });
    }
  });

  return (
    <PageContainer className="h-[calc(100vh-4rem)] flex flex-col p-0">
      <div className="flex items-center gap-4 px-4 py-3 bg-white border-b border-gray-100">
        <button
          onClick={() => navigate('/chats')}
          className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <Avatar
          src={otherUser.avatar}
          name={otherUser.name}
          size="md"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-gray-900 truncate">{otherUser.name}</span>
            {student && (
              <Badge variant="info" size="sm">{student.name}家长</Badge>
            )}
          </div>
          <p className="text-xs text-gray-500">{otherUser.phone}</p>
        </div>

        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <Phone className="w-5 h-5" />
        </button>
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {groupedMessages.length > 0 ? (
          <div className="max-w-3xl mx-auto">
            {groupedMessages.map((group, groupIndex) => (
              <div key={groupIndex} className="mb-6">
                <div className="flex justify-center mb-4">
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                    {group.date}
                  </span>
                </div>
                {group.messages.map((msg, msgIndex) => (
                  <ChatBubble
                    key={msg.id}
                    message={msg}
                    isOwn={msg.senderId === currentUser.id}
                    senderAvatar={msg.senderId !== currentUser.id ? otherUser.avatar : undefined}
                    senderName={msg.senderId !== currentUser.id ? otherUser.name : undefined}
                  />
                ))}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center">
              <Avatar
                src={otherUser.avatar}
                name={otherUser.name}
                size="xl"
                className="mx-auto mb-4"
              />
              <h3 className="font-medium text-gray-900 mb-1">{otherUser.name}</h3>
              <p className="text-sm text-gray-500">开始与{otherUser.name}的对话</p>
              {student && (
                <Badge variant="info" size="sm" className="mt-2">
                  {student.name}家长
                </Badge>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white border-t border-gray-100 p-4">
        <div className="max-w-3xl mx-auto flex items-end gap-3">
          <div className="flex-1 relative">
            <Input
              placeholder="输入消息..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              className="pr-12 min-h-[44px] py-3"
              maxLength={1000}
            />
            {message && (
              <span className="absolute right-3 bottom-3 text-xs text-gray-400">
                {message.length}/1000
              </span>
            )}
          </div>
          <Button
            onClick={handleSend}
            disabled={!message.trim() || isSending}
            isLoading={isSending}
            className="px-4 h-[44px]"
          >
            <Send className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </PageContainer>
  );
};

export default ChatWindow;
