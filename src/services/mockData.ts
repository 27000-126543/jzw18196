import { storage } from './storage';
import {
  STORAGE_KEYS,
  DEFAULT_CLASS,
  DEFAULT_TEACHER,
  DEFAULT_PARENTS,
  DEFAULT_STUDENTS,
  DEFAULT_GROUPS
} from '@/utils/constants';
import type { Notice, LeaveRequest, Survey, Chat, GroupMessage } from '@/types';
import { generateId } from '@/utils/date';

export const initMockData = (): void => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const allUsers = [DEFAULT_TEACHER, ...DEFAULT_PARENTS];
    storage.set(STORAGE_KEYS.USERS, allUsers);
  }

  if (!localStorage.getItem(STORAGE_KEYS.CLASS)) {
    storage.set(STORAGE_KEYS.CLASS, DEFAULT_CLASS);
  }

  if (!localStorage.getItem(STORAGE_KEYS.STUDENTS)) {
    storage.set(STORAGE_KEYS.STUDENTS, DEFAULT_STUDENTS);
  }

  if (!localStorage.getItem(STORAGE_KEYS.GROUPS)) {
    storage.set(STORAGE_KEYS.GROUPS, DEFAULT_GROUPS);
  }

  if (!localStorage.getItem(STORAGE_KEYS.NOTICES)) {
    const sampleNotices: Notice[] = [
      {
        id: generateId(),
        title: '期中考试家长会通知',
        content: '各位家长，您好！本学期期中考试定于11月15日-11月17日进行，家长会定于11月20日下午2:00在本班教室召开，请各位家长准时参加。',
        category: 'activity',
        authorId: 'teacher-001',
        classId: 'class-001',
        createdAt: '2024-11-10T10:00:00Z',
        readStatus: [
          { parentId: 'parent-001', readAt: '2024-11-10T11:30:00Z' },
          { parentId: 'parent-002', readAt: '2024-11-10T12:15:00Z' },
          { parentId: 'parent-003', readAt: '2024-11-10T14:20:00Z' }
        ]
      },
      {
        id: generateId(),
        title: '语文作业布置',
        content: '本周语文作业：\n1. 背诵《古诗三首》并默写\n2. 完成练习册第15-18页\n3. 写一篇300字作文《我的周末》\n\n请家长监督孩子按时完成作业，下周一上交。',
        category: 'homework',
        authorId: 'teacher-001',
        classId: 'class-001',
        createdAt: '2024-11-08T16:30:00Z',
        readStatus: [
          { parentId: 'parent-001', readAt: '2024-11-08T17:00:00Z' },
          { parentId: 'parent-002', readAt: '2024-11-08T18:30:00Z' },
          { parentId: 'parent-004', readAt: '2024-11-08T19:00:00Z' },
          { parentId: 'parent-005', readAt: '2024-11-09T08:00:00Z' }
        ]
      },
      {
        id: generateId(),
        title: '寒假放假安排',
        content: '各位家长，根据教育局通知，本学期寒假安排如下：\n- 放假时间：2025年1月20日-2月16日\n- 开学时间：2025年2月17日（星期一）\n\n假期期间请家长注意孩子的安全，合理安排作息时间。',
        category: 'holiday',
        authorId: 'teacher-001',
        classId: 'class-001',
        createdAt: '2024-12-25T09:00:00Z',
        readStatus: [
          { parentId: 'parent-001', readAt: '2024-12-25T10:00:00Z' },
          { parentId: 'parent-002', readAt: '2024-12-25T11:00:00Z' },
          { parentId: 'parent-003', readAt: '2024-12-25T13:00:00Z' },
          { parentId: 'parent-004', readAt: '2024-12-25T14:00:00Z' },
          { parentId: 'parent-005', readAt: '2024-12-25T15:00:00Z' },
          { parentId: 'parent-006', readAt: '2024-12-25T16:00:00Z' },
          { parentId: 'parent-007', readAt: '2024-12-26T09:00:00Z' }
        ]
      },
      {
        id: generateId(),
        title: '秋季运动会报名',
        content: '学校秋季运动会定于10月25日举行，请各位家长鼓励孩子积极报名参加。比赛项目有：短跑、跳远、跳绳、接力赛等。报名截止日期10月15日。',
        category: 'activity',
        authorId: 'teacher-001',
        classId: 'class-001',
        createdAt: '2024-10-08T14:00:00Z',
        readStatus: [
          { parentId: 'parent-001', readAt: '2024-10-08T15:00:00Z' },
          { parentId: 'parent-002', readAt: '2024-10-08T16:00:00Z' },
          { parentId: 'parent-003', readAt: '2024-10-08T17:00:00Z' },
          { parentId: 'parent-006', readAt: '2024-10-09T08:00:00Z' },
          { parentId: 'parent-008', readAt: '2024-10-09T10:00:00Z' }
        ]
      }
    ];
    storage.set(STORAGE_KEYS.NOTICES, sampleNotices);
  }

  if (!localStorage.getItem(STORAGE_KEYS.LEAVES)) {
    const sampleLeaves: LeaveRequest[] = [
      {
        id: generateId(),
        studentId: 'student-001',
        parentId: 'parent-001',
        type: 'sick',
        startTime: '2024-11-12T08:00:00Z',
        endTime: '2024-11-12T17:00:00Z',
        reason: '孩子感冒发烧，需要在家休息一天。',
        status: 'approved',
        createdAt: '2024-11-12T07:30:00Z',
        approvedAt: '2024-11-12T07:45:00Z',
        approverId: 'teacher-001',
        approvalNote: '收到，请让孩子好好休息，注意身体。'
      },
      {
        id: generateId(),
        studentId: 'student-004',
        parentId: 'parent-004',
        type: 'personal',
        startTime: '2024-11-15T08:00:00Z',
        endTime: '2024-11-17T17:00:00Z',
        reason: '家中有事，需要带孩子回老家三天。',
        status: 'pending',
        createdAt: '2024-11-13T10:00:00Z'
      },
      {
        id: generateId(),
        studentId: 'student-006',
        parentId: 'parent-006',
        type: 'sick',
        startTime: '2024-11-05T08:00:00Z',
        endTime: '2024-11-06T17:00:00Z',
        reason: '急性肠胃炎，需要输液治疗。',
        status: 'approved',
        createdAt: '2024-11-05T06:00:00Z',
        approvedAt: '2024-11-05T06:30:00Z',
        approverId: 'teacher-001',
        approvalNote: '好的，注意让孩子多喝水，饮食清淡。'
      },
      {
        id: generateId(),
        studentId: 'student-008',
        parentId: 'parent-008',
        type: 'other',
        startTime: '2024-11-20T13:00:00Z',
        endTime: '2024-11-20T17:00:00Z',
        reason: '下午需要去医院做牙齿矫正复诊。',
        status: 'rejected',
        createdAt: '2024-11-19T09:00:00Z',
        approvedAt: '2024-11-19T10:00:00Z',
        approverId: 'teacher-001',
        approvalNote: '下午有数学单元测试，建议改到周末。'
      }
    ];
    storage.set(STORAGE_KEYS.LEAVES, sampleLeaves);
  }

  if (!localStorage.getItem(STORAGE_KEYS.SURVEYS)) {
    const sampleSurveys: Survey[] = [
      {
        id: generateId(),
        title: '秋游活动意见征集',
        description: '各位家长，我们计划组织全班同学参加秋季研学活动，请您填写以下问卷，以便我们更好地安排活动。',
        authorId: 'teacher-001',
        classId: 'class-001',
        questions: [
          {
            id: 'q1',
            type: 'single',
            title: '您是否同意孩子参加本次秋游活动？',
            options: ['同意参加', '不同意参加'],
            required: true
          },
          {
            id: 'q2',
            type: 'single',
            title: '您倾向的活动时间是？',
            options: ['11月25日（周一）', '11月26日（周二）', '11月27日（周三）'],
            required: true
          },
          {
            id: 'q3',
            type: 'multiple',
            title: '孩子有哪些食物过敏或特殊饮食要求？（可多选）',
            options: ['无', '海鲜过敏', '坚果过敏', '乳糖不耐受', '素食', '其他'],
            required: false
          },
          {
            id: 'q4',
            type: 'text',
            title: '如有其他意见或建议，请在此留言：',
            required: false
          }
        ],
        deadline: '2024-11-20T23:59:59Z',
        createdAt: '2024-11-12T10:00:00Z',
        responses: [
          {
            id: 'r1',
            parentId: 'parent-001',
            answers: [
              { questionId: 'q1', value: '同意参加' },
              { questionId: 'q2', value: '11月26日（周二）' },
              { questionId: 'q3', value: ['无'] },
              { questionId: 'q4', value: '希望活动时间能安排在上午，下午早点结束。' }
            ],
            submittedAt: '2024-11-12T14:30:00Z'
          },
          {
            id: 'r2',
            parentId: 'parent-002',
            answers: [
              { questionId: 'q1', value: '同意参加' },
              { questionId: 'q2', value: '11月25日（周一）' },
              { questionId: 'q3', value: ['海鲜过敏'] },
              { questionId: 'q4', value: '' }
            ],
            submittedAt: '2024-11-13T09:15:00Z'
          },
          {
            id: 'r3',
            parentId: 'parent-003',
            answers: [
              { questionId: 'q1', value: '同意参加' },
              { questionId: 'q2', value: '11月26日（周二）' },
              { questionId: 'q3', value: ['无'] },
              { questionId: 'q4', value: '' }
            ],
            submittedAt: '2024-11-13T11:00:00Z'
          },
          {
            id: 'r4',
            parentId: 'parent-004',
            answers: [
              { questionId: 'q1', value: '同意参加' },
              { questionId: 'q2', value: '11月27日（周三）' },
              { questionId: 'q3', value: ['坚果过敏', '乳糖不耐受'] },
              { questionId: 'q4', value: '孩子容易晕车，能否安排坐在前排？' }
            ],
            submittedAt: '2024-11-13T16:45:00Z'
          },
          {
            id: 'r5',
            parentId: 'parent-005',
            answers: [
              { questionId: 'q1', value: '同意参加' },
              { questionId: 'q2', value: '11月26日（周二）' },
              { questionId: 'q3', value: ['素食'] },
              { questionId: 'q4', value: '' }
            ],
            submittedAt: '2024-11-14T08:30:00Z'
          }
        ]
      }
    ];
    storage.set(STORAGE_KEYS.SURVEYS, sampleSurveys);
  }

  if (!localStorage.getItem(STORAGE_KEYS.CHATS)) {
    const sampleChats: Chat[] = [
      {
        id: 'chat-001',
        teacherId: 'teacher-001',
        parentId: 'parent-001',
        studentId: 'student-001',
        createdAt: '2024-09-01T00:00:00Z',
        messages: [
          {
            id: generateId(),
            senderId: 'parent-001',
            content: '王老师您好，我是张伟妈妈。想咨询一下张伟最近在学校的表现怎么样？',
            type: 'text',
            createdAt: '2024-11-10T14:30:00Z',
            read: true
          },
          {
            id: generateId(),
            senderId: 'teacher-001',
            content: '张伟妈妈您好！张伟最近表现很好，上课认真听讲，作业完成质量也很高。特别是这次数学测验进步很大，考了95分。',
            type: 'text',
            createdAt: '2024-11-10T14:45:00Z',
            read: true
          },
          {
            id: generateId(),
            senderId: 'parent-001',
            content: '太好了！感谢老师的悉心教导。我们在家也会继续督促他学习的。',
            type: 'text',
            createdAt: '2024-11-10T15:00:00Z',
            read: true
          },
          {
            id: generateId(),
            senderId: 'teacher-001',
            content: '不客气，家校共同努力，孩子会越来越棒的！😊',
            type: 'text',
            createdAt: '2024-11-10T15:05:00Z',
            read: true
          }
        ]
      },
      {
        id: 'chat-002',
        teacherId: 'teacher-001',
        parentId: 'parent-004',
        studentId: 'student-004',
        createdAt: '2024-09-01T00:00:00Z',
        messages: [
          {
            id: generateId(),
            senderId: 'teacher-001',
            content: '刘洋爸爸您好，想和您说一下刘洋最近的情况。他上课注意力不太集中，经常和同桌说话，作业也有点马虎。',
            type: 'text',
            createdAt: '2024-11-11T16:00:00Z',
            read: true
          },
          {
            id: generateId(),
            senderId: 'parent-004',
            content: '王老师您好，感谢您的反馈。我们最近确实发现他有点浮躁，在家也经常玩手机。我们会加强管教的。',
            type: 'text',
            createdAt: '2024-11-11T17:30:00Z',
            read: true
          },
          {
            id: generateId(),
            senderId: 'teacher-001',
            content: '好的，我们一起努力。刘洋其实很聪明，只要注意力集中，成绩肯定能提高。明天有时间的话可以来学校一趟，我们详细聊聊。',
            type: 'text',
            createdAt: '2024-11-11T17:40:00Z',
            read: false
          }
        ]
      }
    ];
    storage.set(STORAGE_KEYS.CHATS, sampleChats);
  }

  if (!localStorage.getItem(STORAGE_KEYS.GROUP_MESSAGES)) {
    const sampleGroupMessages: GroupMessage[] = [];
    storage.set(STORAGE_KEYS.GROUP_MESSAGES, sampleGroupMessages);
  }
};
