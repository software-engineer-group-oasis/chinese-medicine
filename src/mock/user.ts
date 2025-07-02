// 用户管理模块的模拟数据

// 用户角色
export const mockRoles = [
  { id: '1', name: '超级管理员', code: 'super_admin', description: '拥有所有权限' },
  { id: '2', name: '管理员', code: 'admin', description: '拥有大部分管理权限' },
  { id: '3', name: '教师', code: 'teacher', description: '教学资源管理权限' },
  { id: '4', name: '学生', code: 'student', description: '学习和实验权限' },
  { id: '5', name: '访客', code: 'guest', description: '只读权限' },
];

// 用户状态
export type UserStatus = 'active' | 'inactive' | 'locked';

// 用户信息
export interface UserInfo {
  id: string;
  username: string;
  realName: string;
  avatar?: string;
  email: string;
  phone?: string;
  roleIds: string[];
  department?: string;
  position?: string;
  status: UserStatus;
  lastLoginTime?: string;
  createTime: string;
}

// 模拟用户数据
export const mockUsers: UserInfo[] = [
  {
    id: '1',
    username: 'admin',
    realName: '系统管理员',
    email: 'admin@example.com',
    phone: '13800138000',
    roleIds: ['1'],
    department: '信息技术部',
    position: '系统管理员',
    status: 'active',
    lastLoginTime: '2023-05-20 08:30:00',
    createTime: '2023-01-01 00:00:00',
  },
  {
    id: '2',
    username: 'teacher1',
    realName: '张教授',
    email: 'teacher1@example.com',
    phone: '13900139001',
    roleIds: ['3'],
    department: '中医学院',
    position: '教授',
    status: 'active',
    lastLoginTime: '2023-05-19 14:20:00',
    createTime: '2023-01-10 09:00:00',
  },
  {
    id: '3',
    username: 'teacher2',
    realName: '李副教授',
    email: 'teacher2@example.com',
    phone: '13900139002',
    roleIds: ['3'],
    department: '中医学院',
    position: '副教授',
    status: 'active',
    lastLoginTime: '2023-05-18 16:45:00',
    createTime: '2023-01-15 10:30:00',
  },
  {
    id: '4',
    username: 'student1',
    realName: '王同学',
    email: 'student1@example.com',
    phone: '13700137001',
    roleIds: ['4'],
    department: '中医学院',
    position: '学生',
    status: 'active',
    lastLoginTime: '2023-05-20 10:15:00',
    createTime: '2023-02-01 08:00:00',
  },
  {
    id: '5',
    username: 'student2',
    realName: '赵同学',
    email: 'student2@example.com',
    phone: '13700137002',
    roleIds: ['4'],
    department: '中医学院',
    position: '学生',
    status: 'inactive',
    lastLoginTime: '2023-05-10 09:20:00',
    createTime: '2023-02-05 14:30:00',
  },
  {
    id: '6',
    username: 'guest1',
    realName: '访客用户',
    email: 'guest@example.com',
    roleIds: ['5'],
    status: 'active',
    createTime: '2023-03-01 16:00:00',
  },
  {
    id: '7',
    username: 'locked_user',
    realName: '锁定用户',
    email: 'locked@example.com',
    phone: '13600136000',
    roleIds: ['4'],
    status: 'locked',
    lastLoginTime: '2023-04-01 11:30:00',
    createTime: '2023-02-10 09:15:00',
  },
];