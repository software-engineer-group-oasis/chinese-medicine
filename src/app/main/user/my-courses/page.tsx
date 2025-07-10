"use client";

import { useState, useEffect, use } from 'react';
import { 
  Typography, Tabs, Button, Modal, Form, Input, 
  Select, DatePicker, message, Table, Tag, Space, Tooltip, Empty, Upload, Progress
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  EyeOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, ExperimentOutlined, UploadOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import CourseList from '@/components/course/CourseList';
import CourseLabManager from '@/components/course/CourseLabManager';
import CourseHerbManager from '@/components/course/CourseHerbManager';
import useAuthStore from '@/store/useAuthStore';
import axiosInstance from '@/api/config';
import { COURSE_CATEGORIES, COURSE_TARGETS } from '@/constants/course';
import type { Course } from '@/constTypes/course';
import { userPermission } from '@/hooks/usePermission';
import useRequest from '@/hooks/useRequest';
import {useCourses} from '@/hooks/useCourses';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

export default function MyCoursesPage() {

  const [activeTab, setActiveTab] = useState('1');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  // const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string>('');
  const [form] = Form.useForm();
  const { user } = useAuthStore() as any;

  const { courses, loading, createCourse, updateCourse, deleteCourse ,refetchCourses} = useCourses({});
  const myCourses = courses.filter(course => course.teacherId === user?.id);
  const permission = userPermission();
  // 检查是否有教师权限
  const isTeacher = permission?.hasRole('教师');
  const canCreateCourse = permission?.hasPermission('course:create');
  const canUpdateCourse = permission?.hasPermission('course:update');
  const canDeleteCourse = permission?.hasPermission('course:delete');

  // 获取选中的课程
  const selectedCourse = myCourses.find(course => course.courseId === selectedCourseId);

  // 处理文件上传
  const handleUploadChange: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList);
  };

  // 处理文件上传前的检查
  const beforeUpload = (file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isMP4 = file.type === 'video/mp4';
    const isAVI = file.type === 'video/x-msvideo';
    const isMOV = file.type === 'video/quicktime';
    
    if (!isVideo || (!isMP4 && !isAVI && !isMOV)) {
      message.error('只能上传MP4、AVI、MOV格式的视频文件!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt100M = file.size / 1024 / 1024 < 100;
    if (!isLt100M) {
      message.error('视频文件必须小于100MB!');
      return Upload.LIST_IGNORE;
    }
    
    return false; // 阻止自动上传，手动处理
  };

  // 上传视频到腾讯云COS
  const uploadVideoToCOS = async (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append('upload-file', file);

      // 创建XMLHttpRequest来监控上传进度
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploadProgress(progress);
        }
      });

      xhr.addEventListener('load', () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            if (response.url) {
              resolve(response.url);
            } else {
              reject(new Error('上传响应中没有URL'));
            }
          } catch (error) {
            reject(new Error('解析上传响应失败'));
          }
        } else {
          reject(new Error(`上传失败: ${xhr.status} ${xhr.statusText}`));
        }
      });

      xhr.addEventListener('error', () => {
        reject(new Error('网络错误，上传失败'));
      });

      xhr.open('POST', '/api/tencent-cos');
      xhr.send(formData);
    });
  };

  // 打开创建/编辑课程模态框
  const showModal = (course: Course | null = null) => {
    setEditingCourse(course);
    form.resetFields();
    setFileList([]);
    setUploadedVideoUrl('');
    setUploadProgress(0);
    
    if (course) {
      // 编辑现有课程
      form.setFieldsValue({
        courseName: course.courseName,
        courseType: course.courseType,
        courseObject: course.courseObject,
        courseDes: course.courseDes,
        courseStartTime: course.courseStartTime ? dayjs(course.courseStartTime) : null,
        courseEndTime: course.courseEndTime ? dayjs(course.courseEndTime) : null,
      });
    }
    
    setIsModalVisible(true);
  };

  // 处理模态框确认
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      setUploading(true);
      setUploadProgress(0);
      
      // 准备提交的数据
      const courseData = {
        courseName: values.courseName,
        courseType: Number(values.courseType),
        courseObject: Number(values.courseObject),
        courseDes: values.courseDes,
        courseStartTime: values.courseStartTime?.format('YYYY-MM-DDTHH:mm:ss'),
        courseEndTime: values.courseEndTime?.format('YYYY-MM-DDTHH:mm:ss'),
        coverImageUrl: '/images/草药.svg', // 默认封面
        teacherId: user?.id,
      };

      console.log('提交的课程数据:', courseData);
      console.log('用户信息:', user);
      
      let response: any;
      let courseId: number;

      if (editingCourse) {
        // 更新课程
        console.log('更新课程，ID:', editingCourse.courseId);
        response = await updateCourse(editingCourse.courseId, courseData);
        courseId = editingCourse.courseId;
      } else {
        // 创建新课程
        console.log('创建新课程');
        response = await createCourse(courseData);
        courseId = response.data?.courseId; // 获取新创建的课程ID
      }

      console.log('课程操作响应:', response);

      if (!response || response.code !== 0) {
        throw new Error(response?.message || '课程操作失败');
      }

      // 处理视频上传
      if (fileList.length > 0 && fileList[0].originFileObj) {
        try {
          console.log('开始上传视频文件...');
          const videoUrl = await uploadVideoToCOS(fileList[0].originFileObj);
          console.log('视频上传成功，URL:', videoUrl);
          
          // 将视频URL与课程关联 - 使用正确的API路径和数据结构
          const videoResourceData = {
            courseId: courseId,
            courseResourceType: 0, // 0表示视频类型
            courseResourceOrder: 1, // 排序序号
            courseResourceTitle: fileList[0].name || '教学视频',
            courseResourceContent: videoUrl, // 视频URL保存在courseResourceContent字段
            courseResourceMetadata: JSON.stringify({
              duration: '未知',
              size: fileList[0].size || 0,
              type: 'video'
            }),
            courseResourceIsvalid: true
          };

          // 调用API将视频资源与课程关联
          try {
            const resourceResponse = await axiosInstance.post(`/herb-teaching-service/courses/${courseId}/resources`, videoResourceData);
            if (resourceResponse.data.code === 0) {
              console.log('视频资源关联成功');
              message.success('视频上传并关联成功');
            } else {
              console.warn('视频资源关联失败:', resourceResponse.data.message);
              message.warning('课程创建成功，但视频关联失败');
            }
          } catch (resourceError) {
            console.error('视频资源关联错误:', resourceError);
            message.warning('课程创建成功，但视频关联失败');
          }
          
        } catch (uploadError) {
          console.error('视频上传失败:', uploadError);
          message.error('视频上传失败，但课程已保存');
        }
      }
      
      setIsModalVisible(false);
      refetchCourses(); // 刷新课程列表
      message.success(editingCourse ? '课程更新成功' : '课程创建成功');
    } catch (error) {
      console.error('表单验证或提交错误:', error);
      message.error((error as Error).message || '操作失败，请稍后重试');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  // 处理删除课程
  const handleDelete = (courseId: number) => {
    confirm({
      title: '确定要删除这个课程吗?',
      icon: <ExclamationCircleOutlined />,
      content: '删除后将无法恢复',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteCourse(courseId);
        } catch (error) {
          console.error('删除课程错误:', error);
          message.error('删除课程失败，请稍后重试');
        }
      },
    });
    refetchCourses(); // 刷新课程列表
  };

  return (
    <div className="p-6">
      {/*我的课程*/}
      <div className="flex justify-between items-center mb-6">
        <Title level={2}>我的课程</Title>
        {isTeacher && canCreateCourse && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            创建课程
          </Button>
        )}
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="我的课程" key="1">
          {loading ? (
            <div>加载中...</div>
          ) : myCourses.length > 0 ? (
            <div>
              <CourseList courses={myCourses} href="/main/user/my-courses" />
            </div>
          ) : (
            <Empty description="暂无课程" />
          )}
        </TabPane>
        <TabPane tab="课程管理" key="2">
              {/* 课程管理操作 */}
              {isTeacher && (
                <div className="mt-6">
                  <Title level={4}>课程管理</Title>
                  <Table 
                    dataSource={myCourses.map(course => ({
                      ...course,
                      key: course.courseId,
                    }))} 
                    columns={[
                      {
                        title: '课程名称',
                        dataIndex: 'courseName',
                        key: 'courseName',
                      },
                      {
                        title: '课程类型',
                        dataIndex: 'courseType',
                        key: 'courseType',
                        render: (type: string) => (
                          <Tag color="blue">{type}</Tag>
                        ),
                      },
                      {
                        title: '适用对象',
                        dataIndex: 'courseObject',
                        key: 'courseObject',
                        render: (object: string) => (
                          <Tag color="green">{object}</Tag>
                        ),
                      },
                      {
                        title: '开始时间',
                        dataIndex: 'courseStartTime',
                        key: 'courseStartTime',
                      },
                      {
                        title: '结束时间',
                        dataIndex: 'courseEndTime',
                        key: 'courseEndTime',
                      },
                      {
                        title: '操作',
                        key: 'action',
                        render: (_: any, record: Course) => (
                          <Space size="middle">
                            {canUpdateCourse && (
                              <Tooltip title="编辑课程">
                                <Button 
                                  type="link" 
                                  icon={<EditOutlined />} 
                                  onClick={() => showModal(record)} 
                                />
                              </Tooltip>
                            )}
                            {canDeleteCourse && (
                              <Tooltip title="删除课程">
                                <Button 
                                  type="link" 
                                  danger 
                                  icon={<DeleteOutlined />} 
                                  onClick={() => handleDelete(record.courseId)} 
                                />
                              </Tooltip>
                            )}
                          </Space>
                        ),
                      },
                    ]} 
                  />
                </div>
              )}
        </TabPane>
        <TabPane tab="实验管理" key="3">
          {isTeacher && myCourses.length > 0 ? (
            <div className="mt-6">
              <Title level={4}>实验管理</Title>
              <div className="mb-4">
                <Text type="secondary">选择要管理实验的课程：</Text>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCourses.map(course => (
                  <div
                    key={course.courseId}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedCourseId(course.courseId);
                      setActiveTab('4');
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{course.courseName}</h3>
                      <ExperimentOutlined style={{ fontSize: '20px', color: '#fa8c16' }} />
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{course.courseDes}</p>
                    <div className="flex gap-2">
                      <Tag color="blue">{course.courseType}</Tag>
                      <Tag color="green">{course.courseObject}</Tag>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Empty 
              description={isTeacher ? "暂无课程，请先创建课程" : "只有教师可以管理实验"} 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </TabPane>
        <TabPane tab="课程实验详情" key="4">
          {isTeacher && myCourses.length > 0 && (
            <div className="mt-6">
              <div className="mb-4">
                <Button 
                  type="link" 
                  onClick={() => setActiveTab('3')}
                  className="mb-4"
                >
                  ← 返回课程选择
                </Button>
              </div>
              <Title level={4}>
                {selectedCourse ? `${selectedCourse.courseName} - 实验管理` : '课程实验管理'}
              </Title>
              <div className="mb-4">
                {selectedCourse && (
                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedCourse.courseName}</h3>
                        <p className="text-gray-600">{selectedCourse.courseDes}</p>
                        <div className="flex gap-2 mt-2">
                          <Tag color="blue">{selectedCourse.courseType}</Tag>
                          <Tag color="green">{selectedCourse.courseObject}</Tag>
                        </div>
                      </div>
                      <ExperimentOutlined style={{ fontSize: '32px', color: '#fa8c16' }} />
                    </div>
                  </div>
                )}
              </div>
              <div className="text-center">
                <Button 
                  type="primary" 
                  size="large"
                  icon={<ExperimentOutlined />}
                  onClick={() => setActiveTab('5')}
                  disabled={!selectedCourseId}
                >
                  进入实验管理
                </Button>
              </div>
            </div>
          )}
        </TabPane>
        <TabPane tab="实验内容" key="5">
          {isTeacher && selectedCourseId && (
            <div className="mt-6">
              <div className="mb-4">
                <Button 
                  type="link" 
                  onClick={() => setActiveTab('4')}
                  className="mb-4"
                >
                  ← 返回课程选择
                </Button>
              </div>
              <CourseLabManager courseId={selectedCourseId} />
            </div>
          )}
        </TabPane>
        <TabPane tab="中草药管理" key="6">
          {isTeacher && myCourses.length > 0 ? (
            <div className="mt-6">
              <Title level={4}>中草药管理</Title>
              <div className="mb-4">
                <Text type="secondary">选择要管理中草药的课程：</Text>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCourses.map(course => (
                  <div
                    key={course.courseId}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedCourseId(course.courseId);
                      setActiveTab('7');
                    }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-lg">{course.courseName}</h3>
                      <span className="text-green-600">🌿</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">{course.courseDes}</p>
                    <div className="flex gap-2">
                      <Tag color="blue">{course.courseType}</Tag>
                      <Tag color="green">{course.courseObject}</Tag>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Empty 
              description={isTeacher ? "暂无课程，请先创建课程" : "只有教师可以管理中草药"} 
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </TabPane>
        <TabPane tab="课程中草药详情" key="7">
          {isTeacher && selectedCourseId && (
            <div className="mt-6">
              <div className="mb-4">
                <Button 
                  type="link" 
                  onClick={() => setActiveTab('6')}
                  className="mb-4"
                >
                  ← 返回课程选择
                </Button>
              </div>
              <Title level={4}>
                {selectedCourse ? `${selectedCourse.courseName} - 中草药管理` : '课程中草药管理'}
              </Title>
              <div className="mb-4">
                {selectedCourse && (
                  <div className="bg-green-50 p-4 rounded-lg mb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-lg">{selectedCourse.courseName}</h3>
                        <p className="text-gray-600">{selectedCourse.courseDes}</p>
                        <div className="flex gap-2 mt-2">
                          <Tag color="blue">{selectedCourse.courseType}</Tag>
                          <Tag color="green">{selectedCourse.courseObject}</Tag>
                        </div>
                      </div>
                      <span className="text-3xl">🌿</span>
                    </div>
                  </div>
                )}
              </div>
              <CourseHerbManager courseId={selectedCourseId} />
            </div>
          )}
        </TabPane>
      </Tabs>

      {/* 创建/编辑课程模态框 */}
      <Modal
        title={editingCourse ? '编辑课程' : '创建课程'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={uploading}
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            courseType: COURSE_CATEGORIES[1].value, // 默认选修
            courseObject: COURSE_TARGETS[1].value, // 默认本科生
          }}
        >
          <Form.Item
            name="courseName"
            label="课程名称"
            rules={[{ required: true, message: '请输入课程名称' }]}
          >
            <Input placeholder="请输入课程名称" />
          </Form.Item>
          
          <Form.Item
            name="courseType"
            label="课程类型"
            rules={[{ required: true, message: '请选择课程类型' }]}
          >
            <Select placeholder="请选择课程类型">
              {COURSE_CATEGORIES.filter(cat => cat.value !== 'all').map(category => (
                <Option key={category.value} value={category.value}>
                  {category.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="courseObject"
            label="适用对象"
            rules={[{ required: true, message: '请选择适用对象' }]}
          >
            <Select placeholder="请选择适用对象">
              {COURSE_TARGETS.filter(target => target.value !== 'all').map(target => (
                <Option key={target.value} value={target.value}>
                  {target.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="courseDes"
            label="课程描述"
            rules={[{ required: true, message: '请输入课程描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入课程描述" />
          </Form.Item>
          
          <Form.Item
            name="courseStartTime"
            label="开始时间"
            rules={[{ required: true, message: '请选择开始时间' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item
            name="courseEndTime"
            label="结束时间"
            rules={[{ required: true, message: '请选择结束时间' }]}
          >
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="上传教学视频"
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              multiple={false}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>选择视频文件</Button>
            </Upload>
            <div className="mt-2">
              <Text type="secondary" className="text-xs">
                支持上传MP4、AVI、MOV格式视频
              </Text>
            </div>
          </Form.Item>
        </Form>

        {uploading && (
          <div className="mt-4">
            <div className="mb-2">
              <Text>正在处理，请稍候...</Text>
            </div>
            {uploadProgress > 0 && (
              <Progress 
                percent={uploadProgress} 
                status="active"
                strokeColor={{
                  '0%': '#108ee9',
                  '100%': '#87d068',
                }}
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}