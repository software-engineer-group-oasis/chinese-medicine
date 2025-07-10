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
import PerformanceApply from '@/components/performance/PerformanceApply';
import PerformanceStatus from '@/components/performance/PerformanceStatus';
import dayjs from 'dayjs';
import CourseList from '@/components/course/CourseList';
import useAuthStore from '@/store/useAuthStore';
import axiosInstance from '@/api/config';
import type { Course } from '@/constTypes/course';
import { userPermission } from '@/hooks/usePermission';
import useRequest from '@/hooks/useRequest';
import {useCourses} from '@/hooks/useCourses';
const { Title, Text } = Typography;
const { TabPane } = Tabs;


export default function MyCoursesPage() {

  const [activeTab, setActiveTab] = useState('1');
  //@ts-ignore
  const { user } = useAuthStore();
  const { courses, loading} = useCourses({});
  const myCourses = courses.filter(course => course.teacherId === user.id);


 if(loading) return (
    <div className="flex justify-center items-center h-screen">
      <Text>加载中...</Text>
    </div>
  );
  return (
    <div className="p-6">
      {/*我的业绩*/}
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>我的业绩</Title>   
      </div>
      <div className="mb-4">
        <PerformanceApply courses={myCourses} onSuccess={() => setActiveTab('3')} />
      </div>
        <PerformanceStatus />
    </div>
  );
}