import { Card, Dropdown, Menu, Tabs, Typography, Button, Slider } from 'antd';
import { FileTextOutlined, ExperimentOutlined, FullscreenOutlined, SoundOutlined,SettingOutlined,PauseCircleOutlined,PlayCircleOutlined, DownloadOutlined } from '@ant-design/icons';
import type { Course } from '@/constTypes/course';
const { Title, Paragraph } = Typography;
const { TabPane } = Tabs;

import React, { useRef } from 'react';

export default function CourseTabs({
  course,
  activeTab,
  setActiveTab,
  videoProps,
  handleDownload
}: {
  course: any;
  activeTab: string;
  setActiveTab: (key: string) => void;
  videoProps: any;
  handleDownload: (resource: any) => void;
}) {
  // 使用传入的videoRef而不是创建新的

  return (
    <Card className="mb-6">
            <Tabs activeKey={activeTab} onChange={setActiveTab}>
              <TabPane 
                tab={<span><PlayCircleOutlined />视频播放</span>} 
                key="video"
              >
                <div id="video-container" className="relative bg-black rounded-lg overflow-hidden mb-4">
                  {/* 视频播放器 */}
                  <video
                    ref={videoProps.videoRef}
                    className="w-full aspect-video"
                    onTimeUpdate={videoProps.handleTimeUpdate}
                    onLoadedMetadata={videoProps.handleLoadedMetadata}
                    onPlay={() => videoProps.setIsPlaying(true)}
                    onPause={() => videoProps.setIsPlaying(false)}
                    onEnded={() => videoProps.setIsPlaying(false)}
                    poster={course.coverImageUrl}
                    controls={false}
                  >
                    <source src={course.videoUrl || ''} type="video/mp4" />
                    您的浏览器不支持HTML5视频播放。
                  </video>
                  
                  {/* 自定义控制栏 */}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2">
                    <div className="flex items-center justify-between mb-2">
                      {/* 播放/暂停按钮 */}
                      <Button 
                        type="text" 
                        icon={videoProps.isPlaying ? <PauseCircleOutlined className="text-white text-xl" /> : <PlayCircleOutlined className="text-white text-xl" />} 
                        onClick={videoProps.handlePlayPause}
                        className="text-white"
                      />
                      
                      {/* 时间显示 */}
                      <div className="text-xs">
                        {videoProps.formatTime(videoProps.currentTime)} / {videoProps.formatTime(videoProps.duration)}
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
                                  value={videoProps.volume}
                                  onChange={videoProps.handleVolumeChange}
                                />
                              </div>
                              <div className="ml-2 w-8 text-center">{videoProps.volume}%</div>
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
                            <Menu.Item key="1080p" onClick={() => videoProps.handleQualityChange('1080p')}>1080p</Menu.Item>
                            <Menu.Item key="720p" onClick={() => videoProps.handleQualityChange('720p')}>720p</Menu.Item>
                            <Menu.Item key="480p" onClick={() => videoProps.handleQualityChange('480p')}>480p</Menu.Item>
                            <Menu.Item key="360p" onClick={() => videoProps.handleQualityChange('360p')}>360p</Menu.Item>
                          </Menu>
                        } 
                        placement="top"
                      >
                        <Button 
                          type="text" 
                          icon={<SettingOutlined className="text-white" />} 
                          className="text-white"
                        >
                          {videoProps.quality}
                        </Button>
                      </Dropdown>
                      
                      {/* 全屏按钮 */}
                      <Button 
                        type="text" 
                        icon={<FullscreenOutlined className="text-white" />} 
                        onClick={videoProps.handleFullscreen}
                        className="text-white"
                      />
                    </div>
                    
                    {/* 进度条 */}
                    <div 
                      className="h-1 bg-gray-600 rounded cursor-pointer"
                      onClick={videoProps.handleSeek}
                    >
                      <div 
                        className="h-full bg-blue-500 rounded"
                        style={{ width: `${(videoProps.currentTime / videoProps.duration) * 100}%` }}
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
                  
                  {course.resources && course.resources.length > 0 ? (
                    <>
                      <Paragraph className="mb-4">课程相关文档资源</Paragraph>
                      {course.resources.map((resource: { resourceName?: string }, index: number) => (
                        <Button 
                          key={index} 
                          type="primary" 
                          icon={<DownloadOutlined />} 
                          onClick={() => handleDownload(resource)}
                          className="mb-2"
                        >
                          下载{resource.resourceName || `资源${index + 1}`}
                        </Button>
                      ))}
                    </>
                  ) : (
                    <>
                      <Paragraph className="mb-4">暂无课程相关文档</Paragraph>
                      <Button type="primary" icon={<DownloadOutlined />} disabled>
                        下载文档
                      </Button>
                    </>
                  )}
                </div>
              </TabPane>
              
              <TabPane 
                tab={<span><ExperimentOutlined />实验步骤</span>} 
                key="experiment"
              >
                <div className="bg-white p-4 rounded-lg">
                  <Title level={4} className="mb-4">实验步骤指导</Title>                  
                  {course.labs && course.labs.length > 0 ? (
                    course.labs.map((lab: { labId?: 
                      string; labOrder?: number; labName: string; labSteps: string }, 
                      index:number) => (
                      <div key={lab.labId || index} className="mb-6">
                        <div className="flex items-center mb-2">
                          <div className="bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2">
                            {lab.labOrder || index + 1}
                          </div>
                          <Title level={5} className="mb-0">{lab.labName}</Title>
                        </div>
                        <div className="ml-8">
                          {lab.labSteps.split('\n').map((line, i) => (
                            <Paragraph key={i} className="mb-1">{line}</Paragraph>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <Paragraph className="text-center text-gray-500">暂无实验步骤</Paragraph>
                  )
                }
                </div>
              </TabPane>
            </Tabs>
    </Card>
  );
}