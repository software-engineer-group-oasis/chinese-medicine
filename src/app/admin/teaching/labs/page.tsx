"use client";
import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, 
  message, Space, Tooltip, Tag, Popconfirm, Card, Row, Col, Statistic
} from 'antd';
import { 
  DeleteOutlined, EditOutlined, PlusOutlined,
  ExperimentOutlined, EyeOutlined, SearchOutlined
} from '@ant-design/icons';
import axiosInstance from '@/api/config';
import { LAB_API } from '@/api/HerbInfoApi';
import { userPermission } from '@/hooks/usePermission';

const { Option } = Select;

interface Lab {
  labId: number;
  courseId: number;
  courseName?: string;
  labName: string;
  labSteps: string;
  labOrder: number;
}

interface Course {
  courseId: number;
  courseName: string;
}

export default function AdminLabManagement() {
  const [labs, setLabs] = useState<Lab[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLabModalVisible, setIsLabModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingLab, setEditingLab] = useState<Lab | null>(null);
  const [viewingLab, setViewingLab] = useState<Lab | null>(null);
  const [labForm] = Form.useForm();
  const [searchText, setSearchText] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  
  const permission = userPermission();
  const canCreateLab = permission?.hasPermission('lab:create');
  const canUpdateLab = permission?.hasPermission('lab:update');
  const canDeleteLab = permission?.hasPermission('lab:delete');
  const isAdmin = permission?.hasRole('管理员');

  // 获取所有实验列表
  const fetchLabs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(LAB_API.GET_ALL_LABS());
      if (response.data.code === 0) {
        setLabs(response.data.data || []);
      } else {
        message.error('获取实验列表失败');
      }
    } catch (error) {
      console.error('获取实验列表错误:', error);
      message.error('获取实验列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取课程列表
  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/herb-teaching-service/courses');
      if (response.data.code === 0) {
        setCourses(response.data.data || []);
      }
    } catch (error) {
      console.error('获取课程列表错误:', error);
    }
  };

  useEffect(() => {
    fetchLabs();
    fetchCourses();
  }, []);

  // 打开创建/编辑实验模态框
  const showLabModal = (lab: Lab | null = null) => {
    setEditingLab(lab);
    labForm.resetFields();
    
    if (lab) {
      // 编辑现有实验
      labForm.setFieldsValue({
        courseId: lab.courseId,
        labName: lab.labName,
        labSteps: lab.labSteps,
        labOrder: lab.labOrder,
      });
    } else {
      // 新实验，设置默认排序
      labForm.setFieldsValue({
        labOrder: labs.length + 1,
      });
    }
    
    setIsLabModalVisible(true);
  };

  // 查看实验详情
  const showViewModal = (lab: Lab) => {
    setViewingLab(lab);
    setIsViewModalVisible(true);
  };

  // 处理实验模态框确认
  const handleLabOk = async () => {
    try {
      const values = await labForm.validateFields();
      
      // 准备提交的数据
      const labData = {
        courseId: values.courseId,
        labName: values.labName,
        labSteps: values.labSteps,
        labOrder: values.labOrder,
      };
      
      if (editingLab) {
        // 更新实验
        const response = await axiosInstance.put(
          LAB_API.UPDATE_LAB(editingLab.labId), 
          labData
        );
        if (response.data.code === 0) {
          message.success('实验更新成功');
          fetchLabs(); // 刷新实验列表
        } else {
          message.error('实验更新失败');
        }
      } else {
        // 创建新实验
        const response = await axiosInstance.post(
          LAB_API.CREATE_LAB(values.courseId), 
          labData
        );
        if (response.data.code === 0) {
          message.success('实验创建成功');
          fetchLabs(); // 刷新实验列表
        } else {
          message.error('实验创建失败');
        }
      }
      
      setIsLabModalVisible(false);
    } catch (error) {
      console.error('表单验证或提交错误:', error);
    }
  };

  // 处理删除实验
  const handleDeleteLab = async (labId: number) => {
    try {
      const response = await axiosInstance.delete(
        LAB_API.DELETE_LAB(labId)
      );
      if (response.data.code === 0) {
        message.success('实验删除成功');
        fetchLabs(); // 刷新实验列表
      } else {
        message.error('实验删除失败');
      }
    } catch (error) {
      console.error('删除实验错误:', error);
      message.error('删除实验失败，请稍后重试');
    }
  };

  // 筛选实验
  const filteredLabs = labs.filter(lab => {
    const matchesSearch = !searchText || 
      lab.labName.toLowerCase().includes(searchText.toLowerCase()) ||
      lab.courseName?.toLowerCase().includes(searchText.toLowerCase());
    const matchesCourse = courseFilter === 'all' || lab.courseId.toString() === courseFilter;
    return matchesSearch && matchesCourse;
  });

  // 统计信息
  const totalLabs = labs.length;
  const totalCourses = courses.length;

  // 实验列表列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'labOrder',
      key: 'labOrder',
      sorter: (a: Lab, b: Lab) => a.labOrder - b.labOrder,
      width: 80,
    },
    {
      title: '所属课程',
      dataIndex: 'courseName',
      key: 'courseName',
      width: 150,
    },
    {
      title: '实验名称',
      dataIndex: 'labName',
      key: 'labName',
      width: 200,
    },
    {
      title: '实验步骤',
      dataIndex: 'labSteps',
      key: 'labSteps',
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>
          {text.length > 100 ? `${text.substring(0, 100)}...` : text}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Lab) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => showViewModal(record)} 
            />
          </Tooltip>
          {canUpdateLab && (
            <Tooltip title="编辑实验">
              <Button 
                type="link" 
                icon={<EditOutlined />} 
                onClick={() => showLabModal(record)} 
              />
            </Tooltip>
          )}
          {canDeleteLab && (
            <Tooltip title="删除实验">
              <Popconfirm
                title="确定要删除这个实验吗?"
                onConfirm={() => handleDeleteLab(record.labId)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="link" 
                  danger 
                  icon={<DeleteOutlined />} 
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">实验管理</h1>
        
        {/* 统计卡片 */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="总实验数"
                value={totalLabs}
                prefix={<ExperimentOutlined />}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总课程数"
                value={totalCourses}
                prefix={<ExperimentOutlined />}
              />
            </Card>
          </Col>
        </Row>

        {/* 搜索和筛选 */}
        <Card className="mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input.Search
              placeholder="搜索实验名称或课程名称"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={() => {}}
            />
            <Select
              placeholder="选择课程"
              style={{ width: 200 }}
              value={courseFilter}
              onChange={setCourseFilter}
              allowClear
            >
              <Option value="all">全部课程</Option>
              {courses.map(course => (
                <Option key={course.courseId} value={course.courseId.toString()}>
                  {course.courseName}
                </Option>
              ))}
            </Select>
            {canCreateLab && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showLabModal()}
              >
                添加实验
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* 实验列表 */}
      <Card>
        <Table 
          columns={columns} 
          dataSource={filteredLabs.map(lab => ({ ...lab, key: lab.labId }))} 
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建/编辑实验模态框 */}
      <Modal
        title={editingLab ? '编辑实验' : '添加实验'}
        open={isLabModalVisible}
        onOk={handleLabOk}
        onCancel={() => setIsLabModalVisible(false)}
        width={600}
      >
        <Form
          form={labForm}
          layout="vertical"
        >
          <Form.Item
            name="courseId"
            label="所属课程"
            rules={[{ required: true, message: '请选择所属课程' }]}
          >
            <Select placeholder="请选择课程">
              {courses.map(course => (
                <Option key={course.courseId} value={course.courseId}>
                  {course.courseName}
                </Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="labName"
            label="实验名称"
            rules={[{ required: true, message: '请输入实验名称' }]}
          >
            <Input placeholder="请输入实验名称" />
          </Form.Item>
          
          <Form.Item
            name="labSteps"
            label="实验步骤"
            rules={[{ required: true, message: '请输入实验步骤' }]}
          >
            <Input.TextArea 
              rows={8} 
              placeholder="请输入实验步骤，支持换行格式" 
            />
          </Form.Item>
          
          <Form.Item
            name="labOrder"
            label="排序序号"
            rules={[{ required: true, message: '请输入排序序号' }]}
          >
            <Input type="number" placeholder="请输入排序序号" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看实验详情模态框 */}
      <Modal
        title="实验详情"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingLab && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">基本信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">实验名称：</label>
                  <span>{viewingLab.labName}</span>
                </div>
                <div>
                  <label className="font-medium">所属课程：</label>
                  <span>{viewingLab.courseName}</span>
                </div>
                <div>
                  <label className="font-medium">排序序号：</label>
                  <span>{viewingLab.labOrder}</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">实验步骤</h3>
              <div className="bg-gray-50 p-4 rounded">
                <pre className="whitespace-pre-wrap">{viewingLab.labSteps}</pre>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 