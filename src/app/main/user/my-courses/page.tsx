"use client";

import { useState, useEffect, use } from 'react';
import { 
  Typography, Tabs, Button, Modal, Form, Input, 
  Select, DatePicker, message, Table, Tag, Space, Tooltip, Empty
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  EyeOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';
import CourseList from '@/components/course/CourseList';
import useAuthStore from '@/store/useAuthStore';
import axiosInstance from '@/api/config';
import { COURSE_CATEGORIES, COURSE_TARGETS } from '@/constants/course';
import type { Course } from '@/constTypes/course';
import { userPermission } from '@/hooks/usePermission';
import useRequest from '@/hooks/useRequest';
import {useCourses} from '@/hooks/useCourses';
const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;
const { confirm } = Modal;



export default function MyCoursesPage() {

  const [activeTab, setActiveTab] = useState('1');
  // const [myCourses, setMyCourses] = useState<Course[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const { user } = useAuthStore();

  const { courses, loading, createCourse, updateCourse, deleteCourse ,refetchCourses} = useCourses({});
  const myCourses = courses.filter(course => course.teacherId === user.id);
  const permission = userPermission();
  // 检查是否有教师权限
  const isTeacher = permission?.hasRole('教师');
  const canCreateCourse = permission?.hasPermission('course:create');
  const canUpdateCourse = permission?.hasPermission('course:update');
  const canDeleteCourse = permission?.hasPermission('course:delete');

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
        courseType: Number(values.courseType),
        courseObject: Number(values.courseObject),
        courseDes: values.courseDes,
        courseStartTime: values.courseStartTime?.format('YYYY-MM-DDTHH:mm:ss'),
        courseEndTime: values.courseEndTime?.format('YYYY-MM-DDTHH:mm:ss'),
        coverImageUrl: 'https://example.com/images/cover_zydx.jpg', // 默认封面
        teacherId: user?.id,
      };
      
      if (editingCourse) {
        // 更新课程
        await updateCourse(editingCourse.courseId, courseData);
      } else {
        // 创建新课程
        await createCourse(courseData);
      }
      
      setIsModalVisible(false);
      refetchCourses(); // 刷新课程列表
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