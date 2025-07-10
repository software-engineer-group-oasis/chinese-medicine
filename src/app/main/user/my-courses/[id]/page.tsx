"use client";

import { useState, useEffect } from 'react';
import { 
  Typography, Tabs, Button, Breadcrumb, Spin, message, Card
} from 'antd';
import { 
  HomeOutlined, EditOutlined, ArrowLeftOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import CourseResourceManager from '@/components/course/CourseResourceManager';
import CourseLabManager from '@/components/course/CourseLabManager';
import CourseHerbManager from '@/components/course/CourseHerbManager';
import axiosInstance from '@/api/config';
import { COURSE_API } from '@/api/HerbInfoApi';
import useAuthStore from '@/store/useAuthStore';
import { userPermission } from '@/hooks/usePermission';
import type { Course } from '@/constTypes/course';

const { Title } = Typography;
const { TabPane } = Tabs;

export default function CourseEditPage({ params }: { params: { id: string } }) {
  const courseId = parseInt(params.id);
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  //@ts-ignore
  const { user } = useAuthStore();
  const permission = userPermission();
  
  // 检查是否有教师权限
  const isTeacher = permission?.hasRole('教师');
  const canUpdateCourse = permission?.hasPermission('course:update');

  // 获取课程详情
  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(COURSE_API.GET_COURSE_DETAIL(courseId));
      if (response.data.code === 0) {
        // 适配课程数据格式
        const courseData = response.data.data;
        const adaptedCourse = {
          courseId: courseData.courseId,
          courseName: courseData.courseName,
          coverImageUrl: courseData.coverImageUrl || 'https://example.com/images/cover_zydx.jpg',
          courseType: courseData.courseTypeName || '未分类',
          courseObject: courseData.courseObjectName || '通用',
          teacherId: courseData.teacherId,
          courseStartTime: courseData.courseStartTime || '',
          courseEndTime: courseData.courseEndTime || '',
          courseDes: courseData.courseDes || '',
          courseAverageRating: Number(courseData.courseAverageRating || 0),
          courseRatingCount: Number(courseData.courseRatingCount || 0),
          resources: courseData.resources || [],
          labs: courseData.labs || [],
          herbs: courseData.herbs || [],
        };
        setCourse(adaptedCourse);
      } else {
        message.error('获取课程详情失败');
      }
    } catch (error) {
      console.error('获取课程详情错误:', error);
      message.error('获取课程详情失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  // 检查权限
  useEffect(() => {
    if (!loading && course) {
      // 检查是否是课程的教师
      const isOwner = user?.id === course.teacherId;
      
      if (!isTeacher || !isOwner || !canUpdateCourse) {
        message.error('您没有权限编辑此课程');
        router.push('/main/user/my-courses');
      }
    }
  }, [loading, course, user, isTeacher, canUpdateCourse, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" tip="加载中..." />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-6">
        <div className="text-center">
          <Title level={4}>课程不存在或已被删除</Title>
          <Button type="primary" onClick={() => router.push('/main/user/my-courses')}>
            返回我的课程
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* 面包屑导航 */}
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/">
            <HomeOutlined /> 首页
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/main/user/my-courses">我的课程</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{course.courseName}</Breadcrumb.Item>
        <Breadcrumb.Item>编辑</Breadcrumb.Item>
      </Breadcrumb>

      {/* 返回按钮 */}
      <div className="mb-4">
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => router.push('/main/user/my-courses')}
        >
          返回我的课程
        </Button>
      </div>

      <Title level={2} className="mb-6">
        <EditOutlined className="mr-2" />
        编辑课程: {course.courseName}
      </Title>

      {/* 课程基本信息卡片 */}
      <Card className="mb-6">
        <div className="flex items-start">
          <div className="w-32 h-32 bg-gray-200 rounded-md overflow-hidden mr-6">
            <img 
              src={'/images/草药.svg'} //course.coverImageUrl||
              alt={course.courseName} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <Title level={4}>{course.courseName}</Title>
            <p><strong>课程类型:</strong> {course.courseType}</p>
            <p><strong>适用对象:</strong> {course.courseObject}</p>
            <p><strong>开始时间:</strong> {course.courseStartTime}</p>
            <p><strong>结束时间:</strong> {course.courseEndTime}</p>
            <p><strong>课程描述:</strong> {course.courseDes}</p>
            <Button 
              type="primary" 
              icon={<EditOutlined />} 
              onClick={() => router.push(`/main/user/my-courses?edit=${courseId}`)}
              className="mt-2"
            >
              编辑基本信息
            </Button>
          </div>
        </div>
      </Card>

      {/* 课程内容管理标签页 */}
      <Tabs defaultActiveKey="1">
        <TabPane tab="课程资源" key="1">
          <CourseResourceManager courseId={courseId} />
        </TabPane>
        <TabPane tab="实验内容" key="2">
          <CourseLabManager courseId={courseId} />
        </TabPane>
        <TabPane tab="关联药材" key="3">
          <CourseHerbManager courseId={courseId} />
        </TabPane>
      </Tabs>
    </div>
  );
}