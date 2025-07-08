"use client";

import { useState, useEffect } from 'react';
import { 
  Typography, Tabs, Button, Modal, Form, Input, 
  Select, DatePicker, message, Table, Tag, Space, Tooltip, Empty
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  EyeOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import PerformanceApply from '@/components/course/PerformanceApply';
import PerformanceStatus from '@/components/course/PerformanceStatus';
import dayjs from 'dayjs';
import CourseList from '@/components/course/CourseList';
import useAuthStore from '@/store/useAuthStore';
import axiosInstance from '@/api/config';
import { COURSE_CATEGORIES, COURSE_TARGETS } from '@/constants/course';
import type { Course } from '@/constTypes/course';
import { userPermission } from '@/hooks/usePermission';

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;

export default function MyCoursesPage() {
  const [activeTab, setActiveTab] = useState('1');
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const { user } = useAuthStore();
  const permission = userPermission();
  
  // 检查是否有教师权限
  const isTeacher = permission?.hasRole('教师');
  const canCreateCourse = permission?.hasPermission('course:create');
  const canUpdateCourse = permission?.hasPermission('course:update');
  const canDeleteCourse = permission?.hasPermission('course:delete');

  // 获取我的课程列表
  const fetchMyCourses = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/herb-teaching-service/courses/teacher/${user.id}`);
      if (response.data.code === 0) {
        // 适配课程数据格式
        const adaptedCourses = response.data.data.list.map((course: any) => ({
          courseId: course.courseId,
          courseName: course.courseName,
          coverImageUrl: course.coverImageUrl || 'https://example.com/images/cover_zydx.jpg',
          courseType: course.courseTypeName || '未分类',
          courseObject: course.courseObjectName || '通用',
          teacherId: course.teacherId,
          courseStartTime: course.courseStartTime || '',
          courseEndTime: course.courseEndTime || '',
          courseDes: course.courseDes || '',
          courseAverageRating: Number(course.courseAverageRating || 0),
          courseRatingCount: Number(course.courseRatingCount || 0),
        }));
        setMyCourses(adaptedCourses);
      } else {
        message.error('获取课程列表失败');
      }
    } catch (error) {
      console.error('获取课程列表错误:', error);
      message.error('获取课程列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchMyCourses();
    }
  }, [user]);

  // 打开创建/编辑课程模态框
  const showModal = (course: Course | null = null) => {
    setEditingCourse(course);
    form.resetFields();
    
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
      
      // 准备提交的数据
      const courseData = {
        courseName: values.courseName,
        courseType: values.courseType,
        courseObject: values.courseObject,
        courseDes: values.courseDes,
        courseStartTime: values.courseStartTime?.format('YYYY-MM-DDTHH:mm:ss'),
        courseEndTime: values.courseEndTime?.format('YYYY-MM-DDTHH:mm:ss'),
        coverImageUrl: 'https://example.com/images/cover_zydx.jpg', // 默认封面
        teacherId: user?.id,
      };
      
      if (editingCourse) {
        // 更新课程
        const response = await axiosInstance.put(`/herb-teaching-service/courses/${editingCourse.courseId}`, courseData);
        if (response.data.code === 0) {
          message.success('课程更新成功');
          fetchMyCourses(); // 刷新课程列表
        } else {
          message.error('课程更新失败');
        }
      } else {
        // 创建新课程
        const response = await axiosInstance.post('/herb-teaching-service/courses', courseData);
        if (response.data.code === 0) {
          message.success('课程创建成功');
          fetchMyCourses(); // 刷新课程列表
        } else {
          message.error('课程创建失败');
        }
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证或提交错误:', error);
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
          const response = await axiosInstance.delete(`/herb-teaching-service/courses/${courseId}`);
          if (response.data.code === 0) {
            message.success('课程删除成功');
            fetchMyCourses(); // 刷新课程列表
          } else {
            message.error('课程删除失败');
          }
        } catch (error) {
          console.error('删除课程错误:', error);
          message.error('删除课程失败，请稍后重试');
        }
      },
    });
  };

  // 业绩申请状态列
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let color = 'default';
        let icon = null;
        
        switch (status) {
          case '审核中':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case '已通过':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case '已拒绝':
            color = 'error';
            icon = <ExclamationCircleOutlined />;
            break;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {status}
          </Tag>
        );
      },
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button type="link" icon={<EyeOutlined />} size="small" />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // 模拟业绩申请数据
  const performanceData = [
    {
      key: '1',
      courseName: '中药学基础',
      applyTime: '2023-10-15',
      status: '已通过',
    },
    {
      key: '2',
      courseName: '中药鉴定学',
      applyTime: '2023-11-20',
      status: '审核中',
    },
  ];

  return (
    <div className="p-6">
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
              <CourseList courses={myCourses} />
              
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
            </div>
          ) : (
            <Empty description="暂无课程" />
          )}
        </TabPane>
        
        <TabPane tab="业绩申请" key="2">
          <div className="mb-4">
            <PerformanceApply courses={myCourses} onSuccess={() => setActiveTab('3')} />
          </div>
          <PerformanceStatus />
        </TabPane>
        
        <TabPane tab="业绩状态" key="3">
          <PerformanceStatus />
        </TabPane>
      </Tabs>

      {/* 创建/编辑课程模态框 */}
      <Modal
        title={editingCourse ? '编辑课程' : '创建课程'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
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
        </Form>
      </Modal>
    </div>
  );
}