"use client";

import { useState, useEffect, use } from 'react';
import { 
  Typography, Tabs, Button, Modal, Form, Input, 
  Select, DatePicker, message, Table, Tag, Space, Tooltip, Empty
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  EyeOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import PerformanceApply from '@/components/course/PerformanceApply';
import PerformanceStatus from '@/components/course/PerformanceStatus';
import dayjs from 'dayjs';
import CourseList from '@/components/course/CourseList';
import useAuthStore from '@/store/useAuthStore';
import axiosInstance from '@/api/config';
import { COURSE_CATEGORIES, COURSE_TARGETS } from '@/constants/course';
import type { Course } from '@/constTypes/course';
import { userPermission } from '@/hooks/usePermission';
import useRequest from '@/hooks/useRequest';
import {useCourses} from '@/hooks/useCourses';
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;



export default function MyCoursesPage() {

  const [activeTab, setActiveTab] = useState('1');
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const permission = userPermission();
  const { courses, loading, createCourse, updateCourse, deleteCourse ,refetchCourses} = useCourses({});
  const myCourses = courses.filter(course => course.teacherId === user.id);

  // 检查是否有教师权限
  const isTeacher = permission?.hasRole('教师');

  // 业绩申请状态列
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let icon = null;
        
        switch (status) {
          case '审核中':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case '已通过':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case '已拒绝':
            color = 'error';
            icon = <ExclamationCircleOutlined />;
            break;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button type="link" icon={<EyeOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 模拟业绩申请数据
  const performanceData = [
    {
      key: '1',
      courseName: '中药学基础',
      applyTime: '2023-10-15',
      status: '已通过',
    },
    {
      key: '2',
      courseName: '中药鉴定学',
      applyTime: '2023-11-20',
      status: '审核中',
    },
  ];



  return (
    <div className="p-6">
      {/*我的业绩*/}
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>我的业绩</Title>   
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="业绩申请" key="3">
          <div className="mb-4">
            <PerformanceApply courses={courses} onSuccess={() => setActiveTab('3')} />
          </div>
          <PerformanceStatus />
        </TabPane>
        
        <TabPane tab="业绩状态" key="4">
          <PerformanceStatus />
        </TabPane>
      </Tabs>
    </div>
  );
}