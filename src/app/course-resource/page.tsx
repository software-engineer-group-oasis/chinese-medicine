// 中药课程资源主页面
"use client"

import { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Input, Button, Tag, List, Typography, 
  Rate, Progress, Avatar, Breadcrumb, Divider, Tooltip, Empty
} from 'antd';
import { 
  SearchOutlined, FireOutlined, BookOutlined, ClockCircleOutlined,
  PlayCircleOutlined, FileTextOutlined, ExperimentOutlined, HeartOutlined,
  StarOutlined, HomeOutlined, RightOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';

const { Title, Text, Paragraph } = Typography;

// 模拟课程数据
const mockCourses = [
  {
    id: 1,
    title: '中药材鉴别基础',
    cover: '/images/黄连.jpg',
    description: '学习中药材的基本鉴别方法，包括性状鉴别、显微鉴别等技术',
    tags: ['基础', '本科生', '鉴别'],
    rating: 4.8,
    reviews: 156,
    likes: 230,
    category: '基础课程',
    relatedHerbs: ['黄连', '党参', '当归'],
    createdAt: '2023-05-15',
    author: '张教授',
    duration: '3小时20分钟',
    progress: 0
  },
  {
    id: 2,
    title: '中药炮制工艺实验',
    cover: '/images/黄连.jpg',
    description: '详细讲解中药炮制的各种方法，包括炒、炙、蒸、煮等工艺流程',
    tags: ['实验', '本科生', '炮制'],
    rating: 4.6,
    reviews: 98,
    likes: 185,
    category: '实验课程',
    relatedHerbs: ['黄芪', '白芍', '甘草'],
    createdAt: '2023-06-22',
    author: '李教授',
    duration: '4小时15分钟',
    progress: 35
  },
  {
    id: 3,
    title: '中药化学成分分析',
    cover: '/images/黄连.jpg',
    description: '介绍中药材中常见化学成分的提取、分离与鉴定方法',
    tags: ['进阶', '研究生', '化学分析'],
    rating: 4.9,
    reviews: 120,
    likes: 210,
    category: '进阶课程',
    relatedHerbs: ['三七', '丹参', '黄芩'],
    createdAt: '2023-07-10',
    author: '王教授',
    duration: '5小时40分钟',
    progress: 75
  },
  {
    id: 4,
    title: '道地药材生产与质量控制',
    cover: '/images/黄连.jpg',
    description: '探讨道地药材的生产环境、种植技术与质量控制体系',
    tags: ['进阶', '研究生', '质量控制'],
    rating: 4.7,
    reviews: 88,
    likes: 165,
    category: '进阶课程',
    relatedHerbs: ['黄连', '杜仲', '川芎'],
    createdAt: '2023-08-05',
    author: '赵教授',
    duration: '4小时50分钟',
    progress: 20
  },
  {
    id: 5,
    title: '中药材栽培技术',
    cover: '/images/黄连.jpg',
    description: '详解中药材的栽培环境、种植方法、田间管理等技术',
    tags: ['基础', '本科生', '栽培'],
    rating: 4.5,
    reviews: 76,
    likes: 142,
    category: '基础课程',
    relatedHerbs: ['党参', '枸杞', '金银花'],
    createdAt: '2023-09-12',
    author: '刘教授',
    duration: '3小时45分钟',
    progress: 0
  },
  {
    id: 6,
    title: '中药药理学研究方法',
    cover: '/images/黄连.jpg',
    description: '介绍中药药理学研究的基本方法与实验设计',
    tags: ['进阶', '研究生', '药理'],
    rating: 4.8,
    reviews: 92,
    likes: 178,
    category: '进阶课程',
    relatedHerbs: ['人参', '黄芪', '灵芝'],
    createdAt: '2023-10-08',
    author: '陈教授',
    duration: '6小时10分钟',
    progress: 0
  }
];

// 模拟已学习课程数据
const mockLearningHistory = [
  {
    courseId: 3,
    lastViewedAt: '2023-11-15 14:30',
    progress: 75,
    lastPosition: '03:15:22'
  },
  {
    courseId: 2,
    lastViewedAt: '2023-11-14 10:15',
    progress: 35,
    lastPosition: '01:28:45'
  },
  {
    courseId: 4,
    lastViewedAt: '2023-11-12 16:40',
    progress: 20,
    lastPosition: '00:58:30'
  }
];

export default function CourseResourcePage() {
  const [searchText, setSearchText] = useState('');
  const [filteredCourses, setFilteredCourses] = useState(mockCourses);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');
  
  // 搜索和筛选功能
  useEffect(() => {
    let filtered = mockCourses;
    
    // 关键词搜索
    if (searchText) {
      filtered = filtered.filter(course => 
        course.title.toLowerCase().includes(searchText.toLowerCase()) ||
        course.description.toLowerCase().includes(searchText.toLowerCase()) ||
        course.relatedHerbs.some(herb => herb.toLowerCase().includes(searchText.toLowerCase()))
      );
    }
    
    // 类别筛选
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(course => 
        course.category === categoryFilter
      );
    }
    
    // 对象筛选
    if (targetFilter !== 'all') {
      filtered = filtered.filter(course => 
        course.tags.includes(targetFilter)
      );
    }
    
    setFilteredCourses(filtered);
  }, [searchText, categoryFilter, targetFilter]);
  
  // 获取课程进度
  const getCourseProgress = (courseId) => {
    const learningRecord = mockLearningHistory.find(record => record.courseId === courseId);
    return learningRecord ? learningRecord.progress : 0;
  };
  
  // 获取已学习的课程
  const getLearningCourses = () => {
    return mockLearningHistory.map(record => {
      const course = mockCourses.find(c => c.id === record.courseId);
      return { ...course, ...record };
    });
  };

  return (
    <div className="p-6 pt-20">
      <Title level={2} className="mb-6">中药课程资源</Title>
      
      {/* 搜索栏 */}
      <div className="mb-8">
        <Row gutter={16} align="middle">
          <Col xs={24} md={12} lg={8}>
            <Input.Search
              placeholder="搜索课程名称、描述或相关药材..."
              enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
              size="large"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
          <Col xs={24} md={12} lg={16}>
            <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
              <div>
                <Text strong className="mr-2">课程类别:</Text>
                <Button.Group>
                  <Button 
                    type={categoryFilter === 'all' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('all')}
                  >
                    全部
                  </Button>
                  <Button 
                    type={categoryFilter === '基础课程' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('基础课程')}
                  >
                    基础课程
                  </Button>
                  <Button 
                    type={categoryFilter === '进阶课程' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('进阶课程')}
                  >
                    进阶课程
                  </Button>
                  <Button 
                    type={categoryFilter === '实验课程' ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter('实验课程')}
                  >
                    实验课程
                  </Button>
                </Button.Group>
              </div>
              <div>
                <Text strong className="mr-2">适用对象:</Text>
                <Button.Group>
                  <Button 
                    type={targetFilter === 'all' ? 'primary' : 'default'}
                    onClick={() => setTargetFilter('all')}
                  >
                    全部
                  </Button>
                  <Button 
                    type={targetFilter === '本科生' ? 'primary' : 'default'}
                    onClick={() => setTargetFilter('本科生')}
                  >
                    本科生
                  </Button>
                  <Button 
                    type={targetFilter === '研究生' ? 'primary' : 'default'}
                    onClick={() => setTargetFilter('研究生')}
                  >
                    研究生
                  </Button>
                </Button.Group>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      <Row gutter={[24, 24]}>
        {/* 左侧内容区域 */}
        <Col xs={24} lg={18}>
          {/* 面包屑导航 */}
          <Breadcrumb className="mb-4">
            <Breadcrumb.Item href="/">
              <HomeOutlined /> 首页
            </Breadcrumb.Item>
            <Breadcrumb.Item href="/course-resource">
              课程资源
            </Breadcrumb.Item>
            {categoryFilter !== 'all' && (
              <Breadcrumb.Item>{categoryFilter}</Breadcrumb.Item>
            )}
            {targetFilter !== 'all' && (
              <Breadcrumb.Item>适用于{targetFilter}</Breadcrumb.Item>
            )}
          </Breadcrumb>
          
          {/* 热门课程展示 */}
          <div className="mb-8">
            <Title level={4} className="mb-4">
              <FireOutlined className="mr-2 text-red-500" />
              热门课程
            </Title>
            
            {filteredCourses.length > 0 ? (
              <Row gutter={[16, 16]}>
                {filteredCourses.map(course => {
                  const progress = getCourseProgress(course.id);
                  
                  return (
                    <Col xs={24} sm={12} md={8} key={course.id}>
                      <Link href={`/course-resource/${course.id}`}>
                        <Card 
                          hoverable 
                          className="h-full"
                          cover={
                            <div className="relative pt-[56.25%] bg-gray-100">
                              <Image 
                                src={course.cover} 
                                alt={course.title}
                                fill
                                style={{objectFit: 'cover'}}
                                className="rounded-t-lg"
                              />
                              {progress > 0 && (
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 px-2 py-1">
                                  <Progress 
                                    percent={progress} 
                                    size="small" 
                                    status="active"
                                    strokeColor="#52c41a"
                                    format={() => `${progress}%`}
                                  />
                                </div>
                              )}
                              <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                                {course.duration}
                              </div>
                            </div>
                          }
                        >
                          <div>
                            <Title level={5} className="mb-1" ellipsis={{ rows: 1 }}>
                              {course.title}
                            </Title>
                            
                            <div className="mb-2">
                              {course.tags.map(tag => (
                                <Tag 
                                  key={tag} 
                                  color={
                                    tag === '基础' ? 'blue' : 
                                    tag === '进阶' ? 'purple' : 
                                    tag === '实验' ? 'green' : 
                                    tag === '本科生' ? 'cyan' : 
                                    tag === '研究生' ? 'magenta' : 
                                    'default'
                                  }
                                  className="mr-1 mb-1"
                                >
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                            
                            <Paragraph ellipsis={{ rows: 2 }} className="text-gray-500 mb-2">
                              {course.description}
                            </Paragraph>
                            
                            <div className="flex justify-between items-center">
                              <div>
                                <Rate disabled defaultValue={Math.round(course.rating)} className="text-xs" />
                                <Text className="ml-1 text-xs">{course.rating}</Text>
                              </div>
                              <div>
                                <HeartOutlined className="text-red-500 mr-1" />
                                <Text className="text-xs">{course.likes}</Text>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </Link>
                    </Col>
                  );
                })}
              </Row>
            ) : (
              <Empty description="未找到相关课程" />
            )}
          </div>
        </Col>
        
        {/* 右侧学习进度区域 */}
        <Col xs={24} lg={6}>
          <Card 
            title={
              <div className="flex items-center">
                <ClockCircleOutlined className="mr-2" />
                <span>学习进度</span>
              </div>
            }
            className="mb-6"
          >
            {getLearningCourses().length > 0 ? (
              <List
                itemLayout="horizontal"
                dataSource={getLearningCourses()}
                renderItem={item => (
                  <List.Item>
                    <div className="w-full">
                      <div className="flex items-start mb-2">
                        <div className="relative w-16 h-12 mr-2 flex-shrink-0">
                          <Image 
                            src={item.cover} 
                            alt={item.title}
                            fill
                            style={{objectFit: 'cover'}}
                            className="rounded"
                          />
                        </div>
                        <div className="flex-1">
                          <Link href={`/course-resource/${item.id}?t=${item.lastPosition}`}>
                            <Text strong ellipsis>{item.title}</Text>
                          </Link>
                          <div className="text-xs text-gray-500">
                            <ClockCircleOutlined className="mr-1" />
                            {item.lastViewedAt}
                          </div>
                        </div>
                      </div>
                      <Progress 
                        percent={item.progress} 
                        size="small" 
                        status="active"
                        strokeColor="#52c41a"
                      />
                      <div className="mt-1 text-right">
                        <Link href={`/course-resource/${item.id}?t=${item.lastPosition}`}>
                          <Button type="link" size="small" className="p-0">
                            继续学习 <RightOutlined />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="暂无学习记录" image={Empty.PRESENTED_IMAGE_SIMPLE} />
            )}
            <div className="mt-4 text-center">
              <Link href="/user/learning-center">
                <Button type="primary">查看全部学习记录</Button>
              </Link>
            </div>
          </Card>
          
          <Card 
            title={
              <div className="flex items-center">
                <BookOutlined className="mr-2" />
                <span>课程分类</span>
              </div>
            }
          >
            <List
              size="small"
              dataSource={[
                { title: '全部课程', count: mockCourses.length, link: '/course-resource' },
                { title: '基础课程', count: mockCourses.filter(c => c.category === '基础课程').length, link: '/course-resource?category=基础课程' },
                { title: '进阶课程', count: mockCourses.filter(c => c.category === '进阶课程').length, link: '/course-resource?category=进阶课程' },
                { title: '实验课程', count: mockCourses.filter(c => c.category === '实验课程').length, link: '/course-resource?category=实验课程' },
                { title: '本科生课程', count: mockCourses.filter(c => c.tags.includes('本科生')).length, link: '/course-resource?target=本科生' },
                { title: '研究生课程', count: mockCourses.filter(c => c.tags.includes('研究生')).length, link: '/course-resource?target=研究生' },
              ]}
              renderItem={item => (
                <List.Item>
                  <Link href={item.link} className="w-full flex justify-between">
                    <Text>{item.title}</Text>
                    <Text type="secondary">{item.count}</Text>
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}