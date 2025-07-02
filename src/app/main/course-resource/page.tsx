// 中药课程资源主页面
"use client"

import { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Tag, List, Typography, 
  Rate, Progress, Avatar, Breadcrumb, Divider, Tooltip, Empty
} from 'antd';
import { 
  FireOutlined, BookOutlined, ClockCircleOutlined,
  PlayCircleOutlined, FileTextOutlined, ExperimentOutlined, HeartOutlined,
  StarOutlined, HomeOutlined, RightOutlined
} from '@ant-design/icons';
import useSWR from 'swr';
// 引入课程类别和对象常量
import { COURSE_CATEGORIES, COURSE_TARGETS ,COURSE_TAGS} from '@/constants/course';
import CourseSearchBar from '@/components/course/CourseSearchBar';
import CourseList from '@/components/course/CourseList';
import LearningProgressPanel from '@/components/course/LearningProgressPanel';
import CourseCategoryPanel from '@/components/course/CourseCategoryPanel';
import type { Course , LearningCourse} from '@/constTypes/course';
import axiosInstance from '@/api/config';
import { useCourses } from '@/hooks/useCourses';
const { Title} = Typography;


export default function CourseResourcePage() {
  const [searchText, setSearchText] = useState('');
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  //组合请求参数
  const params: any = {
    page,
    size,
  };
  if (searchText) params.keyword = searchText;
  if (categoryFilter !== 'all') params.courseType = categoryFilter;
  if (targetFilter !== 'all') params.courseObject = targetFilter;
 const { courses, isLoading, isError } = useCourses(params);

// 搜索和筛选功能

useEffect(() => {
    let filtered = courses;
    
    // 关键词搜索
    if (searchText) {
      filtered = filtered.filter((course: Course) => 
        course.courseName.toLowerCase().includes(searchText.toLowerCase()) ||
        course.courseDes.toLowerCase().includes(searchText.toLowerCase()) 
        // course.relatedHerbs.some((herb: string) => herb.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    // 类别筛选
    if (categoryFilter !== 'all') {
      filtered = filtered.filter((course: Course) => 
        course.courseType === Number(categoryFilter)
      );
    }
    
    // 对象筛选
    if (targetFilter !== 'all') {
      filtered = filtered.filter((course: Course) => {
        if (Array.isArray(course.courseObject)) {
          return course.courseObject.includes(targetFilter);
        }
        // 是数字，直接比较
        return String(course.courseObject) === String(targetFilter);
      });
    }
    
    setFilteredCourses(filtered);
  }, [searchText, categoryFilter, targetFilter, courses]);
  
  // // 获取课程进度
  // interface LearningRecord {
  //   courseId: number;
  //   progress: number;
  //   [key: string]: any;
  // }
  // // 获取已学习的课程
  // const getLearningCourses = () => {
  //   return learningHistory
  //     .map(record => {
  //       const course = courses.find(c => c.id === record.courseId);
  //       if (!course) return null;
  //       // Ensure id is present and not undefined
  //       return { ...course, ...record, id: course.id ?? record.courseId };
  //     })
  //     .filter((item): item is NonNullable<typeof item> => item !== null);
  // };

  // if (isLoading) return <div>加载中...</div>;
  // if (isError) return <div>加载失败</div>;

  return (
    <div className="p-6 pt-20">
      <Title level={2} className="mb-6">中药课程资源</Title>
      
      {/* 搜索栏 */}
      <div className="mb-8">
        <CourseSearchBar
          searchText={searchText}
          setSearchText={setSearchText}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          targetFilter={targetFilter}
          setTargetFilter={setTargetFilter}
        />
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧内容区域 */}
        <Col xs={24} lg={18}>
          {/* 面包屑导航 */}
          <Breadcrumb
            className="mb-4"
            items={[
              {
                href: '/',
                title: (
                  <>
                    <HomeOutlined /> 首页
                  </>
                ),
              },
              {
                href: '/course-resource',
                title: '课程资源',
              },
              ...(categoryFilter !== 'all'
                ? [{ title: categoryFilter }]
                : []),
              ...(targetFilter !== 'all'
                ? [{ title: `适用于${targetFilter}` }]
                : []),
            ]}
          />    
          
          {/* 热门课程展示 */}
          <div className="mb-8">
            <Title level={4} className="mb-4">
              <FireOutlined className="mr-2 text-red-500" />
              热门课程
            </Title>
            <CourseList courses={courses}  />
          </div>
        </Col>
        
        {/* 右侧学习进度区域 */}
        <Col xs={24} lg={6}>
          {/* <LearningProgressPanel learningCourses={getLearningCourses()} /> */}
          <CourseCategoryPanel
            courses={filteredCourses}
            COURSE_CATEGORIES={COURSE_CATEGORIES}
            COURSE_TARGETS={COURSE_TARGETS}
          />
        </Col>
      </Row>
    </div>
  );
}