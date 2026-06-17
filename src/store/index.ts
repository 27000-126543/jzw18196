import { create } from 'zustand';
import { storage } from '@/services/storage';
import { initMockData } from '@/services/mockData';
import { STORAGE_KEYS } from '@/utils/constants';
import type { User, Notice, LeaveRequest, Survey, Chat, Student, Group, GroupMessage, ClassInfo, NoticeCategory, LeaveStatus, SurveyResponse, ChatMessage } from '@/types';
import { generateId } from '@/utils/date';

interface AppState {
  currentUser: User | null;
  users: User[];
  classInfo: ClassInfo | null;
  students: Student[];
  notices: Notice[];
  leaves: LeaveRequest[];
  surveys: Survey[];
  chats: Chat[];
  groups: Group[];
  groupMessages: GroupMessage[];
  isInitialized: boolean;

  init: () => void;
  login: (role: string, account: string, password: string) => Promise<User | null>;
  logout: () => void;

  createNotice: (notice: Omit<Notice, 'id' | 'authorId' | 'classId' | 'createdAt' | 'readStatus'>) => Notice;
  markNoticeRead: (noticeId: string, parentId: string) => void;
  getNoticeReadCount: (noticeId: string) => number;

  createLeave: (leave: Omit<LeaveRequest, 'id' | 'parentId' | 'status' | 'createdAt'>) => LeaveRequest;
  approveLeave: (leaveId: string, status: LeaveStatus, note?: string) => void;

  createSurvey: (survey: Omit<Survey, 'id' | 'authorId' | 'classId' | 'createdAt' | 'responses'>) => Survey;
  submitSurveyResponse: (surveyId: string, parentId: string, answers: SurveyResponse['answers']) => void;

  getOrCreateChat: (teacherId: string, parentId: string, studentId: string) => Chat;
  sendChatMessage: (chatId: string, senderId: string, content: string, type?: ChatMessage['type']) => ChatMessage;
  markMessagesRead: (chatId: string, userId: string) => void;

  createGroup: (name: string, studentIds: string[]) => Group;
  updateGroup: (groupId: string, name: string, studentIds: string[]) => void;
  deleteGroup: (groupId: string) => void;
  sendGroupMessage: (groupId: string, content: string) => GroupMessage;

  getParentByStudentId: (studentId: string) => User | undefined;
  getStudentById: (studentId: string) => Student | undefined;
  getUnreadCount: (userId: string) => number;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  users: [],
  classInfo: null,
  students: [],
  notices: [],
  leaves: [],
  surveys: [],
  chats: [],
  groups: [],
  groupMessages: [],
  isInitialized: false,

  init: () => {
    initMockData();

    const currentUser = storage.get<User | null>(STORAGE_KEYS.CURRENT_USER, null);
    const users = storage.get<User[]>(STORAGE_KEYS.USERS, []);
    const classInfo = storage.get<ClassInfo | null>(STORAGE_KEYS.CLASS, null);
    const students = storage.get<Student[]>(STORAGE_KEYS.STUDENTS, []);
    const notices = storage.get<Notice[]>(STORAGE_KEYS.NOTICES, []);
    const leaves = storage.get<LeaveRequest[]>(STORAGE_KEYS.LEAVES, []);
    const surveys = storage.get<Survey[]>(STORAGE_KEYS.SURVEYS, []);
    const chats = storage.get<Chat[]>(STORAGE_KEYS.CHATS, []);
    const groups = storage.get<Group[]>(STORAGE_KEYS.GROUPS, []);
    const groupMessages = storage.get<GroupMessage[]>(STORAGE_KEYS.GROUP_MESSAGES, []);

    set({
      currentUser,
      users,
      classInfo,
      students,
      notices,
      leaves,
      surveys,
      chats,
      groups,
      groupMessages,
      isInitialized: true
    });
  },

  login: async (role, account, password) => {
    const { users } = get();
    const user = users.find(
      u => u.role === role && u.account === account && (u as any).password === password
    );

    if (user) {
      storage.set(STORAGE_KEYS.CURRENT_USER, user);
      set({ currentUser: user });
      return user;
    }
    return null;
  },

  logout: () => {
    storage.remove(STORAGE_KEYS.CURRENT_USER);
    set({ currentUser: null });
  },

  createNotice: (notice) => {
    const { currentUser, classInfo, notices } = get();
    if (!currentUser || !classInfo) throw new Error('User not logged in');

    const newNotice: Notice = {
      ...notice,
      id: generateId(),
      authorId: currentUser.id,
      classId: classInfo.id,
      createdAt: new Date().toISOString(),
      readStatus: []
    };

    const updatedNotices = [newNotice, ...notices];
    storage.set(STORAGE_KEYS.NOTICES, updatedNotices);
    set({ notices: updatedNotices });
    return newNotice;
  },

  markNoticeRead: (noticeId, parentId) => {
    const { notices } = get();
    const updatedNotices = notices.map(notice => {
      if (notice.id === noticeId) {
        const hasRead = notice.readStatus.some(r => r.parentId === parentId);
        if (!hasRead) {
          return {
            ...notice,
            readStatus: [...notice.readStatus, { parentId, readAt: new Date().toISOString() }]
          };
        }
      }
      return notice;
    });

    storage.set(STORAGE_KEYS.NOTICES, updatedNotices);
    set({ notices: updatedNotices });
  },

  getNoticeReadCount: (noticeId) => {
    const { notices } = get();
    const notice = notices.find(n => n.id === noticeId);
    return notice?.readStatus.length || 0;
  },

  createLeave: (leave) => {
    const { currentUser, leaves } = get();
    if (!currentUser) throw new Error('User not logged in');

    const newLeave: LeaveRequest = {
      ...leave,
      id: generateId(),
      parentId: currentUser.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    const updatedLeaves = [newLeave, ...leaves];
    storage.set(STORAGE_KEYS.LEAVES, updatedLeaves);
    set({ leaves: updatedLeaves });
    return newLeave;
  },

  approveLeave: (leaveId, status, note) => {
    const { currentUser, leaves, students } = get();
    if (!currentUser) throw new Error('User not logged in');
    if (currentUser.role !== 'teacher') throw new Error('Only teachers can approve leaves');

    const updatedLeaves = leaves.map(leave => {
      if (leave.id === leaveId) {
        const updated = {
          ...leave,
          status,
          approvedAt: new Date().toISOString(),
          approverId: currentUser.id,
          approvalNote: note
        };

        if (status === 'approved') {
          const student = students.find(s => s.id === leave.studentId);
          if (student) {
            const startDate = new Date(leave.startTime);
            const endDate = new Date(leave.endTime);
            const records = student.attendance || [];

            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
              const dateStr = d.toISOString().split('T')[0];
              if (!records.some(r => r.date === dateStr)) {
                records.push({
                  date: dateStr,
                  status: 'leave',
                  note: `请假: ${leave.type}`
                });
              }
            }

            const updatedStudents = students.map(s =>
              s.id === leave.studentId ? { ...s, attendance: records } : s
            );
            storage.set(STORAGE_KEYS.STUDENTS, updatedStudents);
            set({ students: updatedStudents });
          }
        }

        return updated;
      }
      return leave;
    });

    storage.set(STORAGE_KEYS.LEAVES, updatedLeaves);
    set({ leaves: updatedLeaves });
  },

  createSurvey: (survey) => {
    const { currentUser, classInfo, surveys } = get();
    if (!currentUser || !classInfo) throw new Error('User not logged in');

    const newSurvey: Survey = {
      ...survey,
      id: generateId(),
      authorId: currentUser.id,
      classId: classInfo.id,
      createdAt: new Date().toISOString(),
      responses: []
    };

    const updatedSurveys = [newSurvey, ...surveys];
    storage.set(STORAGE_KEYS.SURVEYS, updatedSurveys);
    set({ surveys: updatedSurveys });
    return newSurvey;
  },

  submitSurveyResponse: (surveyId, parentId, answers) => {
    const { surveys } = get();

    const updatedSurveys = surveys.map(survey => {
      if (survey.id === surveyId) {
        const existingResponse = survey.responses.findIndex(r => r.parentId === parentId);
        const newResponse: SurveyResponse = {
          id: generateId(),
          parentId,
          answers,
          submittedAt: new Date().toISOString()
        };

        let responses;
        if (existingResponse >= 0) {
          responses = survey.responses.map((r, i) =>
            i === existingResponse ? newResponse : r
          );
        } else {
          responses = [...survey.responses, newResponse];
        }

        return { ...survey, responses };
      }
      return survey;
    });

    storage.set(STORAGE_KEYS.SURVEYS, updatedSurveys);
    set({ surveys: updatedSurveys });
  },

  getOrCreateChat: (teacherId, parentId, studentId) => {
    const { chats } = get();
    let chat = chats.find(
      c => c.teacherId === teacherId && c.parentId === parentId && c.studentId === studentId
    );

    if (!chat) {
      chat = {
        id: generateId(),
        teacherId,
        parentId,
        studentId,
        messages: [],
        createdAt: new Date().toISOString()
      };
      const updatedChats = [chat, ...chats];
      storage.set(STORAGE_KEYS.CHATS, updatedChats);
      set({ chats: updatedChats });
    }

    return chat;
  },

  sendChatMessage: (chatId, senderId, content, type = 'text') => {
    const { chats } = get();

    const newMessage: ChatMessage = {
      id: generateId(),
      senderId,
      content,
      type,
      createdAt: new Date().toISOString(),
      read: false
    };

    const updatedChats = chats.map(chat => {
      if (chat.id === chatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    });

    storage.set(STORAGE_KEYS.CHATS, updatedChats);
    set({ chats: updatedChats });
    return newMessage;
  },

  markMessagesRead: (chatId, userId) => {
    const { chats, groupMessages } = get();
    const now = new Date().toISOString();

    const chat = chats.find(c => c.id === chatId);
    if (!chat) return;

    const hasUnread = chat.messages.some(m => m.senderId !== userId && !m.read);
    if (!hasUnread) return;

    const groupMessageIds = new Set<string>();
    chat.messages.forEach(msg => {
      if (msg.groupMessageId && msg.senderId !== userId && !msg.read) {
        groupMessageIds.add(msg.groupMessageId);
      }
    });

    const updatedChats = chats.map(c => {
      if (c.id === chatId) {
        return {
          ...c,
          messages: c.messages.map(msg =>
            msg.senderId !== userId && !msg.read ? { ...msg, read: true } : msg
          )
        };
      }
      return c;
    });

    if (groupMessageIds.size > 0) {
      const updatedGroupMessages = groupMessages.map(gm => {
        if (groupMessageIds.has(gm.id)) {
          const alreadyRead = gm.readStatus.some(r => r.parentId === userId);
          if (!alreadyRead) {
            return {
              ...gm,
              readStatus: [...gm.readStatus, { parentId: userId, readAt: now }]
            };
          }
        }
        return gm;
      });

      storage.set(STORAGE_KEYS.GROUP_MESSAGES, updatedGroupMessages);
      storage.set(STORAGE_KEYS.CHATS, updatedChats);
      set({ chats: updatedChats, groupMessages: updatedGroupMessages });
    } else {
      storage.set(STORAGE_KEYS.CHATS, updatedChats);
      set({ chats: updatedChats });
    }
  },

  createGroup: (name, studentIds) => {
    const { classInfo, groups, students } = get();
    if (!classInfo) throw new Error('Class info not found');

    const newGroup: Group = {
      id: generateId(),
      name,
      classId: classInfo.id,
      studentIds,
      createdAt: new Date().toISOString()
    };

    const updatedGroups = [...groups, newGroup];
    storage.set(STORAGE_KEYS.GROUPS, updatedGroups);

    const updatedStudents = students.map(student => {
      if (studentIds.includes(student.id) && !student.groupIds.includes(newGroup.id)) {
        return { ...student, groupIds: [...student.groupIds, newGroup.id] };
      }
      return student;
    });
    storage.set(STORAGE_KEYS.STUDENTS, updatedStudents);

    set({ groups: updatedGroups, students: updatedStudents });
    return newGroup;
  },

  updateGroup: (groupId, name, studentIds) => {
    const { groups, students } = get();
    const oldGroup = groups.find(g => g.id === groupId);
    const oldStudentIds = oldGroup?.studentIds || [];

    const addedStudentIds = studentIds.filter(id => !oldStudentIds.includes(id));
    const removedStudentIds = oldStudentIds.filter(id => !studentIds.includes(id));

    const updatedGroups = groups.map(group =>
      group.id === groupId ? { ...group, name, studentIds } : group
    );
    storage.set(STORAGE_KEYS.GROUPS, updatedGroups);

    const updatedStudents = students.map(student => {
      if (addedStudentIds.includes(student.id) && !student.groupIds.includes(groupId)) {
        return { ...student, groupIds: [...student.groupIds, groupId] };
      }
      if (removedStudentIds.includes(student.id)) {
        return { ...student, groupIds: student.groupIds.filter(gid => gid !== groupId) };
      }
      return student;
    });
    storage.set(STORAGE_KEYS.STUDENTS, updatedStudents);

    set({ groups: updatedGroups, students: updatedStudents });
  },

  deleteGroup: (groupId) => {
    const { groups, students } = get();
    const group = groups.find(g => g.id === groupId);
    const updatedGroups = groups.filter(g => g.id !== groupId);
    storage.set(STORAGE_KEYS.GROUPS, updatedGroups);

    if (group) {
      const updatedStudents = students.map(student => {
        if (group.studentIds.includes(student.id)) {
          return { ...student, groupIds: student.groupIds.filter(gid => gid !== groupId) };
        }
        return student;
      });
      storage.set(STORAGE_KEYS.STUDENTS, updatedStudents);
      set({ groups: updatedGroups, students: updatedStudents });
    } else {
      set({ groups: updatedGroups });
    }
  },

  sendGroupMessage: (groupId, content) => {
    const { currentUser, groupMessages, groups, getParentByStudentId } = get();
    if (!currentUser) throw new Error('User not logged in');
    if (currentUser.role !== 'teacher') throw new Error('Only teachers can send group messages');

    const group = groups.find(g => g.id === groupId);
    if (!group) throw new Error('Group not found');

    const newMessage: GroupMessage = {
      id: generateId(),
      groupId,
      authorId: currentUser.id,
      content,
      createdAt: new Date().toISOString(),
      readStatus: []
    };

    const updatedGroupMessages = [newMessage, ...groupMessages];
    storage.set(STORAGE_KEYS.GROUP_MESSAGES, updatedGroupMessages);

    group.studentIds.forEach(studentId => {
      const parent = getParentByStudentId(studentId);
      if (parent) {
        let chat = get().chats.find(
          c => c.teacherId === currentUser.id && c.parentId === parent.id && c.studentId === studentId
        );

        if (!chat) {
          chat = {
            id: generateId(),
            teacherId: currentUser.id,
            parentId: parent.id,
            studentId,
            messages: [],
            createdAt: new Date().toISOString()
          };
        }

        const chatMessage: ChatMessage = {
          id: generateId(),
          senderId: currentUser.id,
          content,
          type: 'text',
          createdAt: newMessage.createdAt,
          read: false,
          groupId,
          groupMessageId: newMessage.id
        };

        const updatedChat = {
          ...chat,
          messages: [...chat.messages, chatMessage]
        };

        const currentChats = get().chats;
        const existingIndex = currentChats.findIndex(c => c.id === chat!.id);
        let updatedChats: Chat[];
        if (existingIndex >= 0) {
          updatedChats = currentChats.map(c => c.id === chat!.id ? updatedChat : c);
        } else {
          updatedChats = [updatedChat, ...currentChats];
        }
        storage.set(STORAGE_KEYS.CHATS, updatedChats);
        set({ chats: updatedChats });
      }
    });

    set({ groupMessages: updatedGroupMessages });
    return newMessage;
  },

  getParentByStudentId: (studentId) => {
    const { users } = get();
    return users.find(u => u.role === 'parent' && (u.studentIds || []).includes(studentId));
  },

  getStudentById: (studentId) => {
    const { students } = get();
    return students.find(s => s.id === studentId);
  },

  getUnreadCount: (userId) => {
    const { chats, notices, surveys } = get();
    let count = 0;

    chats.forEach(chat => {
      if (chat.teacherId === userId || chat.parentId === userId) {
        count += chat.messages.filter(m => m.senderId !== userId && !m.read).length;
      }
    });

    return count;
  }
}));
