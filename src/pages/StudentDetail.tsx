import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, MessageSquare, User, Calendar, AlertTriangle, Users, Clock, CheckCircle, XCircle } from 'lucide-react';
import { PageContainer } from '@/components/Layout/PageContainer';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/common/Badge';
import { Empty } from '@/components/Empty';
import { useAppStore } from '@/store';
import { GENDER_LABELS, ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_COLORS } from '@/utils/constants';
import { formatDate } from '@/utils/date';

const StudentDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentUser, students, getStudentById, getParentByStudentId, getOrCreateChat, groups } = useAppStore();

  const student = id ? getStudentById(id) : undefined;
  const parent = student ? getParentByStudentId(student.id) : undefined;
  const studentGroups = useMemo(() =>
    groups.filter(g => student?.groupIds.includes(g.id)),
    [groups, student]
  );

  const recentAttendance = useMemo(() => {
    if (!student) return [];
    return [...(student.attendance || [])]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 14);
  }, [student]);

  const attendanceStats = useMemo(() => {
    if (!student) return null;
    const records = student.attendance || [];
    return {
      total: records.length,
      present: records.filter(r => r.status === 'present').length,
      absent: records.filter(r => r.status === 'absent').length,
      late: records.filter(r => r.status === 'late').length,
      leave: records.filter(r => r.status === 'leave').length
    };
  }, [student]);

  if (currentUser?.role !== 'teacher') {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">无权限访问</h2>
          <p className="text-sm text-gray-500">学生详情仅老师可查看</p>
        </div>
      </PageContainer>
    );
  }

  if (!student) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-gray-900 mb-2">学生不存在</h2>
          <Button onClick={() => navigate('/students')}>返回列表</Button>
        </div>
      </PageContainer>
    );
  }

  const handleChat = () => {
    if (currentUser && parent) {
      const chat = getOrCreateChat(currentUser.id, parent.id, student.id);
      navigate(`/chats/${chat.id}`);
    }
  };

  const handleCall = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回</span>
        </button>

        <Card className="mb-6">
          <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <Avatar
                src={student.avatar}
                name={student.name}
                size="2xl"
                className="ring-4 ring-blue-50 ring-offset-2"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-2xl font-bold text-gray-900">{student.name}</h1>
                  <Badge variant="info">{GENDER_LABELS[student.gender]}</Badge>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">
                  <span>学号：{student.studentNumber}</span>
                  <span>班级：{student.className}</span>
                </div>
                {studentGroups.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {studentGroups.map(group => (
                      <Badge key={group.id} variant="default" size="sm">
                        {group.name}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                {parent && (
                  <>
                    <Button variant="outline" onClick={handleChat}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      联系家长
                    </Button>
                    <Button onClick={() => handleCall(parent.phone)}>
                      <Phone className="w-4 h-4 mr-2" />
                      拨打电话
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                家长信息
              </h2>
              {parent ? (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
                  <Avatar
                    src={parent.avatar}
                    name={parent.name}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900">{parent.name}</p>
                    <p className="text-sm text-gray-500">{parent.phone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleChat()}
                      className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCall(parent.phone)}
                      className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <Empty
                  icon={User}
                  title="暂无家长信息"
                  size="sm"
                />
              )}
            </div>
          </Card>

          <Card>
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600" />
                紧急联系人
              </h2>
              {student.emergencyContacts.length > 0 ? (
                <div className="space-y-3">
                  {student.emergencyContacts.map((contact, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 p-4 bg-orange-50 border border-orange-100 rounded-xl"
                    >
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-orange-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{contact.name}</p>
                          <Badge variant="warning" size="sm">{contact.relationship}</Badge>
                        </div>
                        <p className="text-sm text-gray-500">{contact.phone}</p>
                      </div>
                      <button
                        onClick={() => handleCall(contact.phone)}
                        className="p-2 rounded-lg bg-orange-100 text-orange-600 hover:bg-orange-200 transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  icon={Phone}
                  title="暂无紧急联系人"
                  size="sm"
                />
              )}
            </div>
          </Card>
        </div>

        {attendanceStats && (
          <Card className="mb-6">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-purple-600" />
                出勤统计
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-4 bg-gray-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-gray-900">{attendanceStats.total}</p>
                  <p className="text-sm text-gray-500">总记录</p>
                </div>
                <div className="p-4 bg-green-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-green-600">{attendanceStats.present}</p>
                  <p className="text-sm text-gray-500">出勤</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-amber-600">{attendanceStats.late}</p>
                  <p className="text-sm text-gray-500">迟到</p>
                </div>
                <div className="p-4 bg-red-50 rounded-xl text-center">
                  <p className="text-3xl font-bold text-red-600">{attendanceStats.absent + attendanceStats.leave}</p>
                  <p className="text-sm text-gray-500">缺勤/请假</p>
                </div>
              </div>

              <h3 className="font-medium text-gray-700 mb-3">近期出勤记录</h3>
              {recentAttendance.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {recentAttendance.map((record, index) => (
                    <div
                      key={index}
                      className={`px-3 py-2 rounded-lg text-sm ${ATTENDANCE_STATUS_COLORS[record.status]}`}
                      title={record.note}
                    >
                      <span className="font-medium">{formatDate(record.date)}</span>
                      <span className="ml-2">{ATTENDANCE_STATUS_LABELS[record.status]}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <Empty
                  icon={Calendar}
                  title="暂无出勤记录"
                  size="sm"
                />
              )}
            </div>
          </Card>
        )}
      </div>
    </PageContainer>
  );
};

export default StudentDetail;
