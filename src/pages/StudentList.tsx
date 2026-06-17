import { useState, useMemo } from 'react';
import { Search, Filter, Users, GraduationCap, UserCheck, UserX, Phone, MessageSquare } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Input } from '@/components/common/Input';
import { Select } from '@/components/common/Input';
import { Badge } from '@/components/common/Badge';
import { StudentCard } from '@/components/features/StudentCard';
import { Empty } from '@/components/Empty';
import { useAppStore } from '@/store';
import { GENDER_LABELS, ATTENDANCE_STATUS_LABELS } from '@/utils/constants';

const StudentList = () => {
  const { currentUser, students, groups } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [genderFilter, setGenderFilter] = useState<'all' | 'male' | 'female'>('all');
  const [groupFilter, setGroupFilter] = useState<string>('all');

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const attendanceStats = {
      present: 0,
      absent: 0,
      late: 0,
      leave: 0
    };

    students.forEach(student => {
      const todayRecord = student.attendance.find(a => a.date === today);
      if (todayRecord) {
        attendanceStats[todayRecord.status]++;
      }
    });

    return {
      total: students.length,
      male: students.filter(s => s.gender === 'male').length,
      female: students.filter(s => s.gender === 'female').length,
      ...attendanceStats
    };
  }, [students]);

  const filteredStudents = useMemo(() => {
    let result = [...students];

    if (genderFilter !== 'all') {
      result = result.filter(s => s.gender === genderFilter);
    }

    if (groupFilter !== 'all') {
      result = result.filter(s => s.groupIds.includes(groupFilter));
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(term) ||
        s.studentNumber.toLowerCase().includes(term) ||
        s.emergencyContacts.some(c =>
          c.name.toLowerCase().includes(term) ||
          c.phone.includes(term)
        )
      );
    }

    return result.sort((a, b) => a.studentNumber.localeCompare(b.studentNumber));
  }, [students, genderFilter, groupFilter, searchTerm]);

  if (currentUser?.role !== 'teacher') {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">无权限访问</h2>
          <p className="text-sm text-gray-500">学生名册仅老师可查看</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">学生名册</h1>
            <p className="text-sm text-gray-500 mt-1">管理班级学生信息和紧急联系人</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                <p className="text-xs text-gray-500">总人数</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.male}</p>
                <p className="text-xs text-gray-500">男生</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-pink-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.female}</p>
                <p className="text-xs text-gray-500">女生</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.present}</p>
                <p className="text-xs text-gray-500">今日出勤</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
                <UserX className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.absent + stats.late}</p>
                <p className="text-xs text-gray-500">缺勤/迟到</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Phone className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
                <p className="text-xs text-gray-500">小组数</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="搜索学生姓名、学号或紧急联系人..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
            <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <Select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="w-24 flex-shrink-0"
            >
              <option value="all">全部</option>
              <option value="male">男生</option>
              <option value="female">女生</option>
            </Select>
            <Select
              value={groupFilter}
              onChange={(e) => setGroupFilter(e.target.value)}
              className="w-32 flex-shrink-0"
            >
              <option value="all">全部小组</option>
              {groups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </Select>
          </div>
        </div>
      </div>

      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredStudents.map((student, index) => (
            <div
              key={student.id}
              style={{ animationDelay: `${index * 50}ms` }}
              className="animate-fade-in-up"
            >
              <StudentCard student={student} />
            </div>
          ))}
        </div>
      ) : (
        <Empty
          icon={Users}
          title="暂无学生"
          description={searchTerm || genderFilter !== 'all' || groupFilter !== 'all'
            ? '没有找到匹配的学生'
            : '还没有添加学生'
          }
        />
      )}
    </PageContainer>
  );
};

export default StudentList;
