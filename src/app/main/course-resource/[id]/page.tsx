// 中药课程资源详情页面
"use client"

import { useState, useRef, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Typography, Tag, Divider, Tabs, 
  List, Tooltip, Rate, Space, Statistic, Descriptions, Progress,
  Dropdown, Menu, message, Avatar, Slider
} from 'antd';
import { 
  PlayCircleOutlined, PauseCircleOutlined, DownloadOutlined, 
  HeartOutlined, HeartFilled, StarOutlined, StarFilled,
  ShareAltOutlined, FileTextOutlined, ExperimentOutlined,
  InfoCircleOutlined, MedicineBoxOutlined, SettingOutlined,
  FullscreenOutlined, SoundOutlined, ArrowLeftOutlined,
  ClockCircleOutlined, CommentOutlined, FireOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import CommentSection from '@/components/CommentSection';
import { mockCourses, mockVideoProgress } from '@/mock/courseResource';
import { COURSE_TAGS} from '@/constants/course';   
const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;




// 格式化时间（秒转为时:分:秒）
const formatTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  return [
    hours.toString().padStart(2, '0'),
    minutes.toString().padStart(2, '0'),
    secs.toString().padStart(2, '0')
  ].join(':');
};

// 解析时间字符串为秒数
const parseTimeToSeconds = (timeStr: string) => {
  if (!timeStr) return 0;
  
  const parts = timeStr.split(':').map(part => parseInt(part, 10));
  if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  }
  return 0;
};

export default function CourseDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const courseId = parseInt(params.id, 10);
  const course = mockCourses.find(c => c.id === courseId);
  
  const [activeTab, setActiveTab] = useState('video');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [quality, setQuality] = useState('720p');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // 初始化视频播放位置
  useEffect(() => {
    if (!course) return;
    
    // 从URL参数获取时间点
    const timeParam = searchParams.get('t');
    let startTime = 0;
    
    if (timeParam) {
      // 如果URL中有时间参数，优先使用
      startTime = parseTimeToSeconds(timeParam);
    } else if (mockVideoProgress[courseId as keyof typeof mockVideoProgress]) {
      // 否则使用保存的进度
      startTime = mockVideoProgress[courseId as keyof typeof mockVideoProgress];
    }
    
    // 设置视频开始时间
    if (videoRef.current && startTime > 0) {
      videoRef.current.currentTime = startTime;
      setCurrentTime(startTime);
    }
  }, [courseId, searchParams]);
  
  // 视频事件处理
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };
  
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
    }
  };
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume / 100;
    }
  };
  
  const handleQualityChange = (quality: string) => {
    setQuality(quality);
    message.success(`已切换到${quality}画质`);
    // 实际项目中这里需要切换视频源
  };
  
  const handleFullscreen = () => {
    const videoContainer = document.getElementById('video-container');
    if (!videoContainer) return;
    
    if (!isFullscreen) {
      if (videoContainer.requestFullscreen) {
        videoContainer.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    
    setIsFullscreen(!isFullscreen);
  };
  
  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current || !duration) return;
    
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const newTime = (offsetX / rect.width) * duration;
    
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const handleLike = () => {
    setIsLiked(!isLiked);
    message.success(isLiked ? '已取消点赞' : '已点赞');
  };
  
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    message.success(isFavorite ? '已取消收藏' : '已收藏到我的课程');
  };
  
  const handleDownload = (resource: any) => {
    message.success(`开始下载: ${resource.name}`);
    // 实际项目中这里需要处理文件下载逻辑
  };
  
  const handleShare = () => {
    // 复制当前页面链接
    navigator.clipboard.writeText(window.location.href);
    message.success('链接已复制，可以分享给他人');
  };
  
  if (!course) {
    return (
      <div className="p-6 pt-20 text-center">
        <Title level={4}>课程不存在</Title>
        <Button type="primary" onClick={() => router.push('/course-resource')}>
          <ArrowLeftOutlined /> 返回课程列表
        </Button>
      </div>
    );
  }

  return (
    <div className="p-6 pt-20">
      {/* 返回按钮 */}
      <div className="mb-4">
        <Button type="link" onClick={() => router.push('/course-resource')} className="pl-0">
          <ArrowLeftOutlined /> 返回课程列表
        </Button>
      </div>
      
      {/* 课程标题 */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <Title level={2} className="mb-2">{course.title}</Title>
          <div>
            {course.tags.map(tag => {
              const tagConf = COURSE_TAGS.find(t => t.value === tag);
              return (
                <Tag key={tag} color={tagConf?.color || 'default'}>
                  {tagConf?.label || tag}
                </Tag>
              );
            })}
            <Text type="secondary" className="ml-2">
              <ClockCircleOutlined className="mr-1" />
              {course.duration}
            </Text>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            icon={isLiked ? <HeartFilled className="text-red-500" /> : <HeartOutlined />} 
            onClick={handleLike}
          >
            {isLiked ? '已点赞' : '点赞'} ({course.likes + (isLiked ? 1 : 0)})
          </Button>
          <Button 
            icon={isFavorite ? <StarFilled className="text-yellow-500" /> : <StarOutlined />} 
            onClick={handleFavorite}
          >
            {isFavorite ? '已收藏' : '收藏'}
          </Button>
          <Button icon={<ShareAltOutlined />} onClick={handleShare}>分享</Button>
        </div>
      </div>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={18}>
          {/* 内容展示区 */}
          <Card className="mb-6">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane 
                tab={<span><PlayCircleOutlined />视频播放</span>} 
                key="video"
              >
                <div id="video-container" className="relative bg-black rounded-lg overflow-hidden mb-4">
                  {/* 视频播放器 */}
                  <video
                    ref={videoRef}
                    className="w-full aspect-video"
                    onTimeUpdate={handleTimeUpdate}
                    onLoadedMetadata={handleLoadedMetadata}
                    onPlay={() => setIsPlaying(true)}
                    onPause={() => setIsPlaying(false)}
                    onEnded={() => setIsPlaying(false)}
                    poster={course.cover}
                    controls={false}
                  >
                    <source src={(course as any).videoUrl || ''} type="video/mp4" />
                    您的浏览器不支持HTML5视频播放。
                  </video>
                  
                  {/* 自定义控制栏 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                    <div className="flex items-center justify-between mb-2">
                      {/* 播放/暂停按钮 */}
                      <Button 
                        type="text" 
                        icon={isPlaying ? <PauseCircleOutlined className="text-white text-xl" /> : <PlayCircleOutlined className="text-white text-xl" />} 
                        onClick={handlePlayPause}
                        className="text-white"
                      />
                      
                      {/* 时间显示 */}
                      <div className="text-xs">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                      
                      {/* 音量控制 */}
                      <Dropdown 
                        overlay={
                          <Card className="p-2" style={{ width: 200 }}>
                            <div className="flex items-center">
                              <SoundOutlined className="mr-2" />
                              <div className="flex-1">
                                <Slider 
                                  min={0}
                                  max={100}
                                  value={volume}
                                  onChange={handleVolumeChange}
                                />
                              </div>
                              <div className="ml-2 w-8 text-center">{volume}%</div>
                            </div>
                          </Card>
                        } 
                        placement="top"
                        trigger={['click']}
                      >
                        <Button 
                          type="text" 
                          icon={<SoundOutlined className="text-white" />} 
                          className="text-white"
                        />
                      </Dropdown>
                      
                      {/* 画质选择 */}
                      <Dropdown 
                        overlay={
                          <Menu>
                            <Menu.Item key="1080p" onClick={() => handleQualityChange('1080p')}>1080p</Menu.Item>
                            <Menu.Item key="720p" onClick={() => handleQualityChange('720p')}>720p</Menu.Item>
                            <Menu.Item key="480p" onClick={() => handleQualityChange('480p')}>480p</Menu.Item>
                            <Menu.Item key="360p" onClick={() => handleQualityChange('360p')}>360p</Menu.Item>
                          </Menu>
                        } 
                        placement="top"
                      >
                        <Button 
                          type="text" 
                          icon={<SettingOutlined className="text-white" />} 
                          className="text-white"
                        >
                          {quality}
                        </Button>
                      </Dropdown>
                      
                      {/* 全屏按钮 */}
                      <Button 
                        type="text" 
                        icon={<FullscreenOutlined className="text-white" />} 
                        onClick={handleFullscreen}
                        className="text-white"
                      />
                    </div>
                    
                    {/* 进度条 */}
                    <div 
                      className="h-1 bg-gray-600 rounded cursor-pointer"
                      onClick={handleSeek}
                    >
                      <div 
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </TabPane>
              
              <TabPane 
                tab={<span><FileTextOutlined />文档预览</span>} 
                key="document"
              >
                <div className="bg-gray-100 p-4 rounded-lg text-center h-[400px] flex flex-col items-center justify-center">
                  <FileTextOutlined style={{ fontSize: 48 }} className="text-gray-400 mb-4" />
                  <Title level={4}>文档预览</Title>
                  <Paragraph className="mb-4">此处将显示PDF或PPT文档预览</Paragraph>
                  <Button type="primary" icon={<DownloadOutlined />} onClick={() => handleDownload(course.resources?.find(r => r.type === 'pdf'))}>
                    下载文档
                  </Button>
                </div>
              </TabPane>
              
              <TabPane 
                tab={<span><ExperimentOutlined />实验步骤</span>} 
                key="experiment"
              >
                <div className="bg-white p-4 rounded-lg">
                  <Title level={4} className="mb-4">实验步骤指导</Title>
                  
                  {course.experimentSteps.map((step, index) => (
                    <div key={index} className="mb-6">
                      <div className="flex items-center mb-2">
                        <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                          {index + 1}
                        </div>
                        <Title level={5} className="mb-0">{step.title}</Title>
                      </div>
                      <div className="ml-8">
                        {step.content.split('\n').map((line, i) => (
                          <Paragraph key={i} className="mb-1">{line}</Paragraph>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </TabPane>
            </Tabs>
          </Card>
          
          {/* 课程信息 */}
          <Card 
            title={<span><InfoCircleOutlined className="mr-2" />课程信息</span>}
            className="mb-6"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} md={16}>
                <Title level={4} className="mb-4">课程简介</Title>
                <Paragraph>{course.description}</Paragraph>
                
                <Divider />
                
                <Descriptions title="基本信息" column={{ xs: 1, sm: 2, md: 3 }}>
                  <Descriptions.Item label="创建时间">{course.createdAt}</Descriptions.Item>
                  <Descriptions.Item label="课程时长">{course.duration}</Descriptions.Item>
                  <Descriptions.Item label="适用对象">{course.tags.find(tag => tag === '本科生' || tag === '研究生')}</Descriptions.Item>
                  <Descriptions.Item label="课程类别">{course.category}</Descriptions.Item>
                  <Descriptions.Item label="观看次数">{course.viewCount}</Descriptions.Item>
                  <Descriptions.Item label="下载次数">{course.downloadCount}</Descriptions.Item>
                </Descriptions>
              </Col>
              
              <Col xs={24} md={8}>
                <Card className="bg-gray-50">
                  <div className="flex items-center mb-4">
                    <Avatar src={course.authorAvatar} size={64} className="mr-4" />
                    <div>
                      <Title level={5} className="mb-0">{course.author}</Title>
                      <Text type="secondary">{course.authorTitle}</Text>
                    </div>
                  </div>
                  <div className="flex justify-between mb-2">
                    <Statistic title="课程数" value={mockCourses.filter(c => c.author === course.author).length} />
                    <Statistic title="评分" value={course.rating} suffix="/5" />
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
          
          {/* 关联药材 */}
          <Card 
            title={<span><MedicineBoxOutlined className="mr-2" />关联药材</span>}
            className="mb-6"
          >
            <List
              grid={{ gutter: 16, xs: 1, sm: 2, md: 3 }}
              dataSource={course.relatedHerbs || []}
              renderItem={herb => (
                <List.Item>
                  <Link href={`/herb?name=${herb}`}>
                    <Card hoverable className="text-center">
                      <div className="mb-2">
                        <Avatar size={64} src="/images/黄连.jpg" />
                      </div>
                      <Title level={5}>{herb}</Title>
                    </Card>
                  </Link>
                </List.Item>
              )}
            />
          </Card>
          
          {/* 资源下载 */}
          <Card 
            title={<span><DownloadOutlined className="mr-2" />资源下载</span>}
            className="mb-6"
          >
            <List
              dataSource={course.resources || []}
              renderItem={resource => (
                <List.Item
                  actions={[
                    <Button 
                      key="download" 
                      type="primary" 
                      icon={<DownloadOutlined />}
                      onClick={() => handleDownload(resource)}
                    >
                      下载
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar 
                        icon={
                          resource.type === 'video' ? <PlayCircleOutlined /> : 
                          resource.type === 'pdf' ? <FileTextOutlined /> : 
                          resource.type === 'excel' ? <FileTextOutlined /> : 
                          <DownloadOutlined />
                        } 
                        style={{
                          backgroundColor: 
                            resource.type === 'video' ? '#1890ff' : 
                            resource.type === 'pdf' ? '#f5222d' : 
                            resource.type === 'excel' ? '#52c41a' : 
                            '#faad14'
                        }}
                      />
                    }
                    title={resource.name}
                    description={`${resource.type.toUpperCase()} · ${resource.size}`}
                  />
                </List.Item>
              )}
            />
          </Card>
          
          {/* 评论区 */}
          <Card 
            title={<span><CommentOutlined className="mr-2" />评论区</span>}
            className="mb-6"
          >
            <CommentSection />
          </Card>
        </Col>
        
        {/* 右侧推荐课程 */}
        <Col xs={24} lg={6}>
          <Card 
            title={<span><FireOutlined className="mr-2 text-red-500" />相关课程推荐</span>}
            className="mb-6"
          >
            <List
              itemLayout="horizontal"
              dataSource={mockCourses.filter(c => c.id !== courseId).slice(0, 3)}
              renderItem={item => (
                <List.Item>
                  <Link href={`/course-resource/${item.id}`} className="w-full">
                    <div className="flex">
                      <div className="relative w-20 h-12 mr-2 flex-shrink-0">
                        <Image 
                          src={item.cover} 
                          alt={item.title}
                          fill
                          sizes="80px"
                          priority
                          style={{objectFit: 'cover'}}
                          className="rounded"
                        />
                      </div>
                      <div className="flex-1">
                        <Text strong ellipsis>{item.title}</Text>
                        <div>
                          <Rate disabled defaultValue={Math.round(item.rating)} className="text-xs" />
                          <Text className="text-xs ml-1">{item.rating}</Text>
                        </div>
                      </div>
                    </div>
                  </Link>
                </List.Item>
              )}
            />
            <div className="mt-4 text-center">
              <Link href="/course-resource">
                <Button type="link">查看更多课程</Button>
              </Link>
            </div>
          </Card>
          
          <Card title={<span><StarOutlined className="mr-2 text-yellow-500" />课程评分</span>}>
            <div className="text-center mb-4">
              <Title level={2} className="mb-0 text-yellow-500">{course.rating}</Title>
              <Rate disabled defaultValue={Math.round(course.rating)} className="text-xl" />
              <div className="text-gray-500 mt-1">{course.reviews} 人评价</div>
            </div>
            
            <div>
              {[5, 4, 3, 2, 1].map(star => {
                // 模拟各星级的评价比例
                const percent = star === 5 ? 70 : star === 4 ? 20 : star === 3 ? 7 : star === 2 ? 2 : 1;
                
                return (
                  <div key={star} className="flex items-center mb-2">
                    <div className="w-8 text-right mr-2">{star}星</div>
                    <Progress 
                      percent={percent} 
                      size="small" 
                      showInfo={false} 
                      strokeColor={star >= 4 ? '#52c41a' : star === 3 ? '#faad14' : '#f5222d'}
                      className="flex-1"
                    />
                    <div className="w-10 text-right">{percent}%</div>
                  </div>
                );
              })}
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}