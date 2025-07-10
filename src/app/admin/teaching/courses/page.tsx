"use client";

import { useState, useEffect, use } from 'react';
import { 
  Typography, Tabs, Button, Modal, Form, Input, 
  Select, DatePicker, message, Table, Tag, Space, Tooltip, Empty
} from 'antd';
import { 
  PlusOutlined, EditOutlined, DeleteOutlined, 
  EyeOutlined, CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, ExperimentOutlined
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
  const [form] = Form.useForm();
  const { user } = useAuthStore() as any;

  const { courses, loading, createCourse, updateCourse, deleteCourse ,refetchCourses} = useCourses({});
  const myCourses = courses;
  // 获取选中的课程
  const selectedCourse = myCourses.find(course => course.courseId === selectedCourseId);

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
        <Title level={2}>课程管理</Title>
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            创建课程
          </Button>
      </div>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <TabPane tab="课程管理" key="1">
              {/* 课程管理操作 */}
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

                              <Tooltip title="编辑课程">
                                <Button 
                                  type="link" 
                                  icon={<EditOutlined />} 
                                  onClick={() => showModal(record)} 
                                />
                              </Tooltip>

                              <Tooltip title="删除课程">
                                <Button 
                                  type="link" 
                                  danger 
                                  icon={<DeleteOutlined />} 
                                  onClick={() => handleDelete(record.courseId)} 
                                />
                              </Tooltip>

                          </Space>
                        ),
                      },
                    ]} 
                  />
                </div>
        </TabPane>
        <TabPane tab="实验管理" key="3">

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

        </TabPane>
        <TabPane tab="课程实验详情" key="4">

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

        </TabPane>
        <TabPane tab="实验内容" key="5">

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
              <CourseLabManager courseId={selectedCourseId || 0  } />
            </div>

        </TabPane>
        <TabPane tab="中草药管理" key="6">

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

        </TabPane>
        <TabPane tab="课程中草药详情" key="7">

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
              <CourseHerbManager courseId={selectedCourseId || 0} />
            </div>

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

// export default function CoursesPage() {
//   // 课程数据
//   const [courses, setCourses] = useState<CourseRecord[]>(
//     mockCourses.map(c => ({
//       ...c,
//       status: (c.status === 'draft' || c.status === 'published' ? c.status : 'draft') as 'draft' | 'published',
//     }))
//   );
//   const [filterText, setFilterText] = useState('');
//   const [modalVisible, setModalVisible] = useState(false);
//   const [editingCourse, setEditingCourse] = useState<any>(null);
//   const [form] = Form.useForm();
//   const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

//   // 辅助函数
//   const getCategoryName = (id: string) => mockCategories.find(c => c.id === id)?.name || '-';
//   const getTagNames = (ids: string[]) => mockTags.filter(t => ids.includes(t.id)).map(t => t.name);

//   // 新增课程
//   const handleAddCourse = () => {
//     setEditingCourse(null);
//     form.resetFields();
//     setModalVisible(true);
//   };
//   // 编辑
//   const handleEdit = (record: any) => {
//     setEditingCourse(record);
//     form.setFieldsValue(record);
//     setModalVisible(true);
//   };
//   // 删除
//   const handleDelete = (record: any) => {
//     Modal.confirm({
//       title: '确认删除该课程？',
//       content: `课程：${record.title}`,
//       okText: '删除',
//       okType: 'danger',
//       cancelText: '取消',
//       onOk: () => {
//         setCourses(prev => prev.filter(c => c.id !== record.id));
//         message.success('删除成功');
//       },
//     });
//   };

//   // 批量删除
//   const handleBatchDelete = () => {
//     if (selectedRowKeys.length === 0) {
//       message.warning('请选择要删除的课程');
//       return;
//     }
//     Modal.confirm({
//       title: '批量删除课程',
//       content: `确定要删除选中的 ${selectedRowKeys.length} 个课程吗？`,
//       okText: '删除',
//       okType: 'danger',
//       cancelText: '取消',
//       onOk: () => {
//         setCourses(prev => prev.filter(c => !selectedRowKeys.includes(c.id)));
//         setSelectedRowKeys([]);
//         message.success('批量删除成功');
//       },
//     });
//   };

//   // 批量修改状态
//   const handleBatchChangeStatus = (status: 'draft' | 'published') => {
//     if (selectedRowKeys.length === 0) {
//       message.warning('请选择要修改的课程');
//       return;
//     }
//     setCourses(prev => prev.map(c => 
//       selectedRowKeys.includes(c.id) ? { ...c, status } : c
//     ));
//     message.success(`已将 ${selectedRowKeys.length} 个课程${status === 'published' ? '发布' : '设为草稿'}`);
//   };

//   // 批量操作菜单
//   const batchActionItems: MenuProps['items'] = [
//     {
//       key: 'publish',
//       label: '批量发布',
//       onClick: () => handleBatchChangeStatus('published'),
//     },
//     {
//       key: 'draft',
//       label: '批量设为草稿',
//       onClick: () => handleBatchChangeStatus('draft'),
//     },
//     {
//       key: 'delete',
//       label: '批量删除',
//       danger: true,
//       onClick: handleBatchDelete,
//     },
//   ];

//   // 提交表单
//   const handleModalOk = async () => {
//     try {
//       const values = await form.validateFields();
//       if (editingCourse) {
//         setCourses(prev => prev.map(c => c.id === editingCourse.id ? { ...c, ...values } : c));
//         message.success('编辑成功');
//       } else {
//         setCourses(prev => [
//           { ...values, id: Date.now().toString(), status: 'draft' },
//           ...prev,
//         ]);
//         message.success('添加成功');
//       }
//       setModalVisible(false);
//     } catch (error) {
//       message.error('请检查表单填写');
//     }
//   };

//   return (
//     <div className="p-6">
//       <AdminBreadcrumb className="mb-4" items={[
//         { title: '教学实验管理', href: '/admin/teaching' },
//         { title: '课程管理' }
//       ]} />
//       <Card bordered={false} className="mb-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-xl font-bold mb-1">课程管理</h1>
//             <div className="text-gray-500">查看、编辑、排序、删除课程，管理课程内容</div>
//           </div>
//           <div>
//             <Button type="primary" icon={<PlusOutlined />} onClick={handleAddCourse} className="mr-2">新增课程</Button>
//             <Dropdown menu={{ items: batchActionItems }} disabled={selectedRowKeys.length === 0}>
//               <Button>批量操作 {selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}</Button>
//             </Dropdown>
//           </div>
//         </div>
//       </Card>
//       <Card bordered={false}>
//         <CourseTable
//           dataSource={courses}
//           categories={mockCategories}
//           tags={mockTags}
//           filterText={filterText}
//           onFilterTextChange={setFilterText}
//           onEdit={handleEdit}
//           onDelete={handleDelete}
//           rowSelection={{
//             selectedRowKeys,
//             onChange: setSelectedRowKeys,
//           }}
//         />
//       </Card>
//       <Modal
//         title={editingCourse ? '编辑课程' : '新增课程'}
//         open={modalVisible}
//         onOk={handleModalOk}
//         onCancel={() => setModalVisible(false)}
//         destroyOnClose
//       >
//         <Form
//           form={form}
//           layout="vertical"
//           initialValues={editingCourse || {}}
//         >
//           <Form.Item name="title" label="课程标题" rules={[{ required: true, message: '请输入课程标题' }]}> <Input /> </Form.Item>
//           <Form.Item name="description" label="简介"> <Input.TextArea rows={2} /> </Form.Item>
//           <Form.Item name="categoryId" label="类别" rules={[{ required: true, message: '请选择类别' }]}> <Select options={mockCategories.map(c => ({ label: c.name, value: c.id }))} /> </Form.Item>
//           <Form.Item name="tagIds" label="标签"> <Select mode="multiple" options={mockTags.map(t => ({ label: t.name, value: t.id }))} /> </Form.Item>
//           <Form.Item name="sort" label="排序" rules={[{ required: true, message: '请输入排序' }]}> <Input type="number" /> </Form.Item>
//           {editingCourse && (
//             <Form.Item name="status" label="状态" rules={[{ required: true }]}>
//               <Select>
//                 <Select.Option value="draft">草稿</Select.Option>
//                 <Select.Option value="published">已发布</Select.Option>
//               </Select>
//             </Form.Item>
//           )}
//         </Form>
//       </Modal>
//     </div>
//   );
// }