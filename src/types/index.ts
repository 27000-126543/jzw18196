export type UserRole = 'teacher' | 'parent';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  avatar: string;
  phone: string;
  account: string;
  classId?: string;
  studentIds?: string[];
}

export type NoticeCategory = 'homework' | 'activity' | 'holiday' | 'other';

export interface Notice {
  id: string;
  title: string;
  content: string;
  category: NoticeCategory;
  authorId: string;
  classId: string;
  createdAt: string;
  attachments?: string[];
  readStatus: { parentId: string; readAt: string }[];
}

export type LeaveType = 'sick' | 'personal' | 'other';
export type LeaveStatus = 'pending' | 'approved' | 'rejected';

export interface LeaveRequest {
  id: string;
  studentId: string;
  parentId: string;
  type: LeaveType;
  startTime: string;
  endTime: string;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  approvedAt?: string;
  approverId?: string;
  approvalNote?: string;
}

export type QuestionType = 'single' | 'multiple' | 'text';

export interface SurveyQuestion {
  id: string;
  type: QuestionType;
  title: string;
  options?: string[];
  required: boolean;
}

export interface SurveyResponse {
  id: string;
  parentId: string;
  answers: { questionId: string; value: string | string[] }[];
  submittedAt: string;
}

export interface Survey {
  id: string;
  title: string;
  description: string;
  authorId: string;
  classId: string;
  questions: SurveyQuestion[];
  deadline: string;
  createdAt: string;
  responses: SurveyResponse[];
}

export type MessageType = 'text' | 'image' | 'file';

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  type: MessageType;
  createdAt: string;
  read: boolean;
  groupId?: string;
  groupMessageId?: string;
}

export interface Chat {
  id: string;
  teacherId: string;
  parentId: string;
  studentId: string;
  messages: ChatMessage[];
  createdAt: string;
}

export type Gender = 'male' | 'female';
export type AttendanceStatus = 'present' | 'absent' | 'late' | 'leave';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface AttendanceRecord {
  date: string;
  status: AttendanceStatus;
  note?: string;
}

export interface Student {
  id: string;
  name: string;
  gender: Gender;
  className: string;
  studentNumber: string;
  avatar: string;
  emergencyContacts: EmergencyContact[];
  groupIds: string[];
  attendance: AttendanceRecord[];
}

export interface Group {
  id: string;
  name: string;
  classId: string;
  studentIds: string[];
  createdAt: string;
}

export interface GroupMessage {
  id: string;
  groupId: string;
  authorId: string;
  content: string;
  createdAt: string;
  readStatus: { parentId: string; readAt: string }[];
}

export interface ClassInfo {
  id: string;
  name: string;
  grade: string;
}
