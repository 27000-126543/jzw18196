import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Edit2, Trash2, Send, ChevronRight } from 'lucide-react';
import { Card } from '@/components/common/Card';
import { Button } from '@/components/common/Button';
import { AvatarGroup } from '@/components/common/Avatar';
import { Modal } from '@/components/common/Modal';
import { Input } from '@/components/common/Input';
import { useAppStore } from '@/store';
import type { Group } from '@/types';

interface GroupCardProps {
  group: Group;
  onEdit?: (group: Group) => void;
}

export const GroupCard = ({ group, onEdit }: GroupCardProps) => {
  const navigate = useNavigate();
  const { getStudentById, deleteGroup } = useAppStore();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const students = group.studentIds.map(id => getStudentById(id)).filter(Boolean);

  const avatars = students.map(s => ({
    src: s?.avatar,
    name: s?.name
  }));

  const handleDelete = () => {
    deleteGroup(group.id);
    setShowDeleteModal(false);
  };

  return (
    <>
      <Card hoverable className="overflow-hidden group">
        <div className="p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-gray-900">{group.name}</h3>
                <p className="text-sm text-gray-500">{students.length} 位学生</p>
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(group);
                }}
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
                className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <AvatarGroup avatars={avatars} max={5} size="sm" />
          </div>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {students.slice(0, 4).map(student => (
              <span
                key={student?.id}
                className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-full"
              >
                {student?.name}
              </span>
            ))}
            {students.length > 4 && (
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-500 rounded-full">
                +{students.length - 4}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/groups/message', { state: { selectedGroupId: group.id } });
              }}
            >
              <Send className="w-4 h-4" />
              发送消息
            </Button>
            <div className="flex items-center gap-1 text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
              <span>查看详情</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </Card>

      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="确认删除"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              取消
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              删除
            </Button>
          </div>
        }
      >
        <p className="text-gray-600">
          确定要删除小组「{group.name}」吗？此操作不可撤销。
        </p>
      </Modal>
    </>
  );
};
