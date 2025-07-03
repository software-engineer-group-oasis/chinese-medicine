// 中药课程资源主页面
"use client"

import { useState, useEffect,useMemo } from 'react';
import { 
  Card, Row, Col, Button, Tag, List, Typography, 
  Rate, Progress, Avatar, Breadcrumb, Divider, Tooltip, Empty,
  Pagination
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
import CoursePagination from '@/components/common/Pagination';
import type { Course , LearningCourse} from '@/constTypes/course';
import axiosInstance from '@/api/config';
import { useCourses } from '@/hooks/useCourses';
const { Title} = Typography;


export default function CourseResourcePage() {
  const [searchText, setSearchText] = useState('');
  // const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  interface CourseQueryParams {
  page: number;
  size: number;
  keyword?: string;
  courseType?: string;
  courseObject?: string;
}

  //组合请求参数
  const params: CourseQueryParams = {
    page,
    size,
  };
  if (searchText) params.keyword = searchText;
  if (categoryFilter !== 'all') params.courseType = categoryFilter;
  if (targetFilter !== 'all') params.courseObject = targetFilter;
 const { courses, isLoading, isError } = useCourses(params);

//筛选

const filteredCourses = useMemo(() => {
  console.log('筛选课程，当前数据:', courses);
  console.log('筛选条件:', { categoryFilter, targetFilter });
  
  return courses.filter(course => {
    const matchCategory = categoryFilter === 'all' || course.courseType === categoryFilter;
    const matchTarget = targetFilter === 'all' || course.courseObject === targetFilter;
    
    console.log(`课程 ${course.courseName} 匹配结果:`, { matchCategory, matchTarget });
    return matchCategory && matchTarget;
  });
}, [courses, categoryFilter, targetFilter]);


// useEffect(() => {
//     let filtered = courses;
    
//     // // 关键词搜索
//     // if (searchText) {
//     //   filtered = filtered.filter((course: Course) => 
//     //     course.courseName.toLowerCase().includes(searchText.toLowerCase()) ||
//     //     course.courseDes.toLowerCase().includes(searchText.toLowerCase()) 
//     //     // course.relatedHerbs.some((herb: string) => herb.toLowerCase().includes(searchText.toLowerCase()))
//     //   );
//     // }
    
//     // 类别筛选
//     if (categoryFilter !== 'all') {
//       filtered = filtered.filter((course: Course) => 
//         course.courseType === Number(categoryFilter)
//       );
//     }
    
//     // 对象筛选
//     if (targetFilter !== 'all') {
//       filtered = filtered.filter((course: Course) => {
//         if (Array.isArray(course.courseObject)) {
//           return course.courseObject.includes(targetFilter);
//         }
//         // 是数字，直接比较
//         return String(course.courseObject) === String(targetFilter);
//       });
//     }
    
//     setFilteredCourses(filtered);
//   }, [searchText, categoryFilter, targetFilter, courses]);
  

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
                href: '/main/course-resource',
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
            <CourseList courses={filteredCourses}  />
          </div>
          {/* <CoursePagination
            current={page}
            total={filteredCourses.length}
            pageSize={pageSize}
            onChange={handlePageChange}
          /> */}
        </Col>
        
        {/* 右侧学习进度区域 */}
        <Col xs={24} lg={6}>
          {/* <LearningProgressPanel learningCourses={getLearningCourses()} /> */}
          <CourseCategoryPanel
            courses={courses}
            COURSE_CATEGORIES={COURSE_CATEGORIES}
            COURSE_TARGETS={COURSE_TARGETS}
          />
        </Col>
      </Row>
    </div>
  );
}