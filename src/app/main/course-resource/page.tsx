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
import { mockCourses ,mockLearningHistory} from '@/mock/courseResource';
import { COURSE_CATEGORIES, COURSE_TARGETS ,COURSE_TAGS} from '@/constants/course';
const { Title, Text, Paragraph } = Typography;




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
                 {COURSE_CATEGORIES.map(cat => (
                  <Button
                    key={cat.value}
                    type={categoryFilter === cat.value ? 'primary' : 'default'}
                    onClick={() => setCategoryFilter(cat.value)}
                  >
                    {cat.label}
                  </Button>
              ))}
              </div>
              <div>
                <Text strong className="mr-2">适用对象:</Text>
                  {COURSE_TARGETS.map(tar => (
                        <Button
                          key={tar.value}
                          type={targetFilter === tar.value ? 'primary' : 'default'}
                          onClick={() => setTargetFilter(tar.value)}
                        >
                          {tar.label}
                        </Button>
                   ))}
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
                                {course.tags.map(tag => {
                                  const tagConf = COURSE_TAGS.find(t => t.value === tag);
                                  return (
                                    <Tag key={tag} color={tagConf?.color || 'default'}>
                                      {tagConf?.label || tag}
                                    </Tag>
                                  );
                                })}
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
                            src={item.cover || "/default-cover.png"} 
                            alt={item.title || "课程封面"}
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
                // { title: '全部课程', count: mockCourses.length, link: '/course-resource' },
                // { title: '基础课程', count: mockCourses.filter(c => c.category === '基础课程').length, link: '/course-resource?category=基础课程' },
                // { title: '进阶课程', count: mockCourses.filter(c => c.category === '进阶课程').length, link: '/course-resource?category=进阶课程' },
                // { title: '实验课程', count: mockCourses.filter(c => c.category === '实验课程').length, link: '/course-resource?category=实验课程' },
                // { title: '本科生课程', count: mockCourses.filter(c => c.tags.includes('本科生')).length, link: '/course-resource?target=本科生' },
                // { title: '研究生课程', count: mockCourses.filter(c => c.tags.includes('研究生')).length, link: '/course-resource?target=研究生' },
                  { title: '全部课程', count: mockCourses.length, link: '/course-resource' },
                  ...COURSE_CATEGORIES.filter(c => c.value !== 'all').map(c => ({
                    title: `${c.label}课程`,
                    count: mockCourses.filter(course => course.category === c.value).length,
                    link: `/course-resource?category=${c.value}`,
                  })),
                  ...COURSE_TARGETS.filter(t => t.value !== 'all').map(t => ({
                    title: `${t.label}课程`,
                    count: mockCourses.filter(course => course.tags.includes(t.value)).length,
                    link: `/course-resource?target=${t.value}`,
                  })),
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