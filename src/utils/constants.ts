import type { NoticeCategory, LeaveType, LeaveStatus, QuestionType, AttendanceStatus, MessageType, Gender } from '@/types';

export const NOTICE_CATEGORY_LABELS: Record<NoticeCategory, string> = {
  homework: '作业',
  activity: '活动',
  holiday: '假期',
  other: '其他'
};

export const NOTICE_CATEGORY_COLORS: Record<NoticeCategory, string> = {
  homework: 'bg-blue-100 text-blue-700 border-blue-200',
  activity: 'bg-pink-100 text-pink-700 border-pink-200',
  holiday: 'bg-green-100 text-green-700 border-green-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200'
};

export const LEAVE_TYPE_LABELS: Record<LeaveType, string> = {
  sick: '病假',
  personal: '事假',
  other: '其他'
};

export const LEAVE_STATUS_LABELS: Record<LeaveStatus, string> = {
  pending: '待审批',
  approved: '已批准',
  rejected: '已拒绝'
};

export const LEAVE_STATUS_COLORS: Record<LeaveStatus, string> = {
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  rejected: 'bg-red-100 text-red-700 border-red-200'
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single: '单选题',
  multiple: '多选题',
  text: '文本题'
};

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: '出勤',
  absent: '缺勤',
  late: '迟到',
  leave: '请假'
};

export const ATTENDANCE_STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'bg-green-100 text-green-700',
  absent: 'bg-red-100 text-red-700',
  late: 'bg-amber-100 text-amber-700',
  leave: 'bg-blue-100 text-blue-700'
};

export const MESSAGE_TYPE_LABELS: Record<MessageType, string> = {
  text: '文本',
  image: '图片',
  file: '文件'
};

export const GENDER_LABELS: Record<Gender, string> = {
  male: '男',
  female: '女'
};

export const STORAGE_KEYS = {
  CURRENT_USER: 'school_current_user',
  USERS: 'school_users',
  CLASS: 'school_class',
  STUDENTS: 'school_students',
  NOTICES: 'school_notices',
  LEAVES: 'school_leaves',
  SURVEYS: 'school_surveys',
  CHATS: 'school_chats',
  GROUPS: 'school_groups',
  GROUP_MESSAGES: 'school_group_messages'
};

export const DEFAULT_CLASS = {
  id: 'class-001',
  name: '三年级(2)班',
  grade: '三年级'
};

export const DEFAULT_TEACHER = {
  id: 'teacher-001',
  role: 'teacher' as const,
  name: '王老师',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=teacher',
  phone: '13800138000',
  classId: 'class-001',
  account: 'teacher',
  password: '123456'
};

export const DEFAULT_PARENTS = [
  {
    id: 'parent-001',
    role: 'parent' as const,
    name: '张伟妈妈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent1',
    phone: '13900139001',
    studentIds: ['student-001'],
    account: 'parent1',
    password: '123456'
  },
  {
    id: 'parent-002',
    role: 'parent' as const,
    name: '李娜爸爸',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent2',
    phone: '13900139002',
    studentIds: ['student-002'],
    account: 'parent2',
    password: '123456'
  },
  {
    id: 'parent-003',
    role: 'parent' as const,
    name: '王芳妈妈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent3',
    phone: '13900139003',
    studentIds: ['student-003'],
    account: 'parent3',
    password: '123456'
  },
  {
    id: 'parent-004',
    role: 'parent' as const,
    name: '刘洋爸爸',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent4',
    phone: '13900139004',
    studentIds: ['student-004'],
    account: 'parent4',
    password: '123456'
  },
  {
    id: 'parent-005',
    role: 'parent' as const,
    name: '陈静妈妈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent5',
    phone: '13900139005',
    studentIds: ['student-005'],
    account: 'parent5',
    password: '123456'
  },
  {
    id: 'parent-006',
    role: 'parent' as const,
    name: '杨磊爸爸',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent6',
    phone: '13900139006',
    studentIds: ['student-006'],
    account: 'parent6',
    password: '123456'
  },
  {
    id: 'parent-007',
    role: 'parent' as const,
    name: '赵敏妈妈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent7',
    phone: '13900139007',
    studentIds: ['student-007'],
    account: 'parent7',
    password: '123456'
  },
  {
    id: 'parent-008',
    role: 'parent' as const,
    name: '黄磊爸爸',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent8',
    phone: '13900139008',
    studentIds: ['student-008'],
    account: 'parent8',
    password: '123456'
  },
  {
    id: 'parent-009',
    role: 'parent' as const,
    name: '周婷妈妈',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent9',
    phone: '13900139009',
    studentIds: ['student-009'],
    account: 'parent9',
    password: '123456'
  },
  {
    id: 'parent-010',
    role: 'parent' as const,
    name: '吴强爸爸',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=parent10',
    phone: '13900139010',
    studentIds: ['student-010'],
    account: 'parent10',
    password: '123456'
  }
];

export const DEFAULT_STUDENTS = [
  {
    id: 'student-001',
    name: '张伟',
    gender: 'male' as const,
    className: '三年级(2)班',
    studentNumber: '2023001',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student1',
    emergencyContacts: [
      { name: '张伟妈妈', relationship: '母亲', phone: '13900139001' },
      { name: '张伟爸爸', relationship: '父亲', phone: '13900139101' }
    ],
    groupIds: ['group-001'],
    attendance: []
  },
  {
    id: 'student-002',
    name: '李娜',
    gender: 'female' as const,
    className: '三年级(2)班',
    studentNumber: '2023002',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student2',
    emergencyContacts: [
      { name: '李娜爸爸', relationship: '父亲', phone: '13900139002' },
      { name: '李娜妈妈', relationship: '母亲', phone: '13900139102' }
    ],
    groupIds: ['group-001'],
    attendance: []
  },
  {
    id: 'student-003',
    name: '王芳',
    gender: 'female' as const,
    className: '三年级(2)班',
    studentNumber: '2023003',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student3',
    emergencyContacts: [
      { name: '王芳妈妈', relationship: '母亲', phone: '13900139003' }
    ],
    groupIds: ['group-001'],
    attendance: []
  },
  {
    id: 'student-004',
    name: '刘洋',
    gender: 'male' as const,
    className: '三年级(2)班',
    studentNumber: '2023004',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student4',
    emergencyContacts: [
      { name: '刘洋爸爸', relationship: '父亲', phone: '13900139004' }
    ],
    groupIds: ['group-001', 'group-002'],
    attendance: []
  },
  {
    id: 'student-005',
    name: '陈静',
    gender: 'female' as const,
    className: '三年级(2)班',
    studentNumber: '2023005',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student5',
    emergencyContacts: [
      { name: '陈静妈妈', relationship: '母亲', phone: '13900139005' }
    ],
    groupIds: ['group-002'],
    attendance: []
  },
  {
    id: 'student-006',
    name: '杨磊',
    gender: 'male' as const,
    className: '三年级(2)班',
    studentNumber: '2023006',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student6',
    emergencyContacts: [
      { name: '杨磊爸爸', relationship: '父亲', phone: '13900139006' }
    ],
    groupIds: ['group-002'],
    attendance: []
  },
  {
    id: 'student-007',
    name: '赵敏',
    gender: 'female' as const,
    className: '三年级(2)班',
    studentNumber: '2023007',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student7',
    emergencyContacts: [
      { name: '赵敏妈妈', relationship: '母亲', phone: '13900139007' }
    ],
    groupIds: ['group-002', 'group-003'],
    attendance: []
  },
  {
    id: 'student-008',
    name: '黄磊',
    gender: 'male' as const,
    className: '三年级(2)班',
    studentNumber: '2023008',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student8',
    emergencyContacts: [
      { name: '黄磊爸爸', relationship: '父亲', phone: '13900139008' }
    ],
    groupIds: ['group-003'],
    attendance: []
  },
  {
    id: 'student-009',
    name: '周婷',
    gender: 'female' as const,
    className: '三年级(2)班',
    studentNumber: '2023009',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student9',
    emergencyContacts: [
      { name: '周婷妈妈', relationship: '母亲', phone: '13900139009' }
    ],
    groupIds: ['group-003'],
    attendance: []
  },
  {
    id: 'student-010',
    name: '吴强',
    gender: 'male' as const,
    className: '三年级(2)班',
    studentNumber: '2023010',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=student10',
    emergencyContacts: [
      { name: '吴强爸爸', relationship: '父亲', phone: '13900139010' }
    ],
    groupIds: ['group-003'],
    attendance: []
  }
];

export const DEFAULT_GROUPS = [
  {
    id: 'group-001',
    name: '第一小组',
    classId: 'class-001',
    studentIds: ['student-001', 'student-002', 'student-003', 'student-004'],
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'group-002',
    name: '第二小组',
    classId: 'class-001',
    studentIds: ['student-004', 'student-005', 'student-006', 'student-007'],
    createdAt: '2024-01-15T08:00:00Z'
  },
  {
    id: 'group-003',
    name: '第三小组',
    classId: 'class-001',
    studentIds: ['student-007', 'student-008', 'student-009', 'student-010'],
    createdAt: '2024-01-15T08:00:00Z'
  }
];
