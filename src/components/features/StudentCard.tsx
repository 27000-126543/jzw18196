import { useNavigate } from 'react-router-dom';
import { MessageSquare, Phone, ChevronRight } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Badge } from '@/components/common/Badge';
import { Avatar } from '@/components/common/Avatar';
import { AvatarGroup } from '@/components/common/Avatar';
import { useAppStore } from '@/store';
import { GENDER_LABELS } from '@/utils/constants';
import type { Student } from '@/types';

interface StudentCardProps {
  student: Student;
  showActions?: boolean;
}

export const StudentCard = ({ student, showActions = true }: StudentCardProps) => {
  const navigate = useNavigate();
  const { groups, getParentByStudentId, currentUser, getOrCreateChat } = useAppStore();

  const studentGroups = groups.filter(g => student.groupIds.includes(g.id));
  const parent = getParentByStudentId(student.id);

  const handleChat = () => {
    if (currentUser && parent) {
      const chat = getOrCreateChat(currentUser.id, parent.id, student.id);
      navigate(`/chats/${chat.id}`);
    }
  };

  const handleCall = () => {
    if (student.emergencyContacts.length > 0) {
      window.location.href = `tel:${student.emergencyContacts[0].phone}`;
    }
  };

  return (
    <Card hoverable onClick={() => navigate(`/students/${student.id}`)} className="overflow-hidden group">
      <div className="p-5">
        <div className="flex items-center gap-4 mb-4">
          <Avatar
            src={student.avatar}
            name={student.name}
            size="xl"
            className="flex-shrink-0 ring-4 ring-blue-50 ring-offset-2"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {student.name}
              </h3>
              <Badge variant="info" size="sm">
                {GENDER_LABELS[student.gender]}
              </Badge>
            </div>
            <p className="text-sm text-gray-500">
              学号：{student.studentNumber}
            </p>
          </div>
        </div>

        {studentGroups.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {studentGroups.map(group => (
              <Badge key={group.id} variant="default" size="sm">
                {group.name}
              </Badge>
            ))}
          </div>
        )}

        {parent && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
            <Avatar
              src={parent.avatar}
              name={parent.name}
              size="sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {parent.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {parent.phone}
              </p>
            </div>
          </div>
        )}

        {showActions && (
          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCall();
                }}
                className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
              >
                <Phone className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChat();
                }}
                className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>查看详情</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
