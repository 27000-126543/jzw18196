import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Users, Search, Filter, UserPlus, Edit2, Trash2, X, Check } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Input } from '@/components/common/Input';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Modal } from '@/components/common/Modal';
import { GroupCard } from '@/components/features/GroupCard';
import { Empty } from '@/components/Empty';
import { useAppStore } from '@/store';
import { generateId } from '@/utils/date';
import type { Group, Student } from '@/types';

const GroupList = () => {
  const navigate = useNavigate();
  const { currentUser, groups, students, createGroup, updateGroup } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [groupName, setGroupName] = useState('');
  const [selectedStudents, setSelectedStudents] = useState<string[]>([]);
  const [error, setError] = useState('');

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.studentIds.some(sid => {
      const student = students.find(s => s.id === sid);
      return student?.name.toLowerCase().includes(searchTerm.toLowerCase());
    })
  );

  const openCreateModal = () => {
    setEditingGroup(null);
    setGroupName('');
    setSelectedStudents([]);
    setError('');
    setShowCreateModal(true);
  };

  const openEditModal = (group: Group) => {
    setEditingGroup(group);
    setGroupName(group.name);
    setSelectedStudents([...group.studentIds]);
    setError('');
    setShowCreateModal(true);
  };

  const toggleStudent = (studentId: string) => {
    setSelectedStudents(prev =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };

  const handleSubmit = () => {
    setError('');

    if (!groupName.trim()) {
      setError('请输入小组名称');
      return;
    }
    if (selectedStudents.length === 0) {
      setError('请至少选择一名学生');
      return;
    }

    if (editingGroup) {
      updateGroup(editingGroup.id, groupName.trim(), selectedStudents);
    } else {
      createGroup(groupName.trim(), selectedStudents);
    }

    setShowCreateModal(false);
  };

  if (currentUser?.role !== 'teacher') {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">无权限访问</h2>
          <p className="text-sm text-gray-500">小组管理仅老师可查看</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">小组管理</h1>
            <p className="text-sm text-gray-500 mt-1">创建和管理学生小组，按小组发送消息</p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4 mr-2" />
            创建小组
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
                <p className="text-xs text-gray-500">小组数</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {groups.reduce((acc, g) => acc + g.studentIds.length, 0)}
                </p>
                <p className="text-xs text-gray-500">成员总数</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{students.length}</p>
                <p className="text-xs text-gray-500">班级学生</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <Edit2 className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {Math.round((groups.reduce((acc, g) => acc + g.studentIds.length, 0) / Math.max(students.length, 1)) * 100)}%
                </p>
                <p className="text-xs text-gray-500">分组覆盖率</p>
              </div>
            </div>
          </div>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="搜索小组名称或学生姓名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {filteredGroups.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredGroups.map((group, index) => (
            <div
              key={group.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in-up"
            >
              <GroupCard group={group} onEdit={openEditModal} />
            </div>
          ))}
        </div>
      ) : (
        <Empty
          icon={Users}
          title="暂无小组"
          description={searchTerm ? '没有找到匹配的小组' : '还没有创建任何小组，点击右上角创建第一个小组吧'}
          action={!searchTerm ? {
            label: '创建小组',
            onClick: openCreateModal
          } : undefined}
        />
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title={editingGroup ? '编辑小组' : '创建新小组'}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              取消
            </Button>
            <Button onClick={handleSubmit}>
              {editingGroup ? '保存修改' : '创建小组'}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              小组名称
            </label>
            <Input
              placeholder="例如：第一小组、数学兴趣小组"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              maxLength={20}
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                选择学生 <span className="text-gray-400 font-normal">({selectedStudents.length}人已选)</span>
              </label>
              <div className="flex gap-2">
                {selectedStudents.length < students.length && (
                  <button
                    type="button"
                    onClick={() => setSelectedStudents(students.map(s => s.id))}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    全选
                  </button>
                )}
                {selectedStudents.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedStudents([])}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    清空
                  </button>
                )}
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-64 overflow-y-auto">
              {students.map(student => {
                const isSelected = selectedStudents.includes(student.id);
                return (
                  <button
                    key={student.id}
                    type="button"
                    onClick={() => toggleStudent(student.id)}
                    className={`flex items-center gap-2 p-2 rounded-lg border-2 transition-all text-left ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <Avatar
                      src={student.avatar}
                      name={student.name}
                      size="sm"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {student.name}
                      </p>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </Modal>
    </PageContainer>
  );
};

export default GroupList;
