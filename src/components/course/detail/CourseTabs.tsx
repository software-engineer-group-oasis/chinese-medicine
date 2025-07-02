import { Card, Dropdown, Menu,Tabs, Typography, Button,Slider }from 'antd';
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
  const videoRef = useRef<HTMLVideoElement>(null);

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
  );
}