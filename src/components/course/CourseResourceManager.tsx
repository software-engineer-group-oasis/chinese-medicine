import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, Upload, 
  message, Space, Tooltip, Tag, Popconfirm
} from 'antd';
import { 
  UploadOutlined, DeleteOutlined, EditOutlined, 
  PlusOutlined, FileTextOutlined, VideoCameraOutlined,
  PictureOutlined, FileExcelOutlined, FilePdfOutlined
} from '@ant-design/icons';
import axiosInstance from '@/api/config';
import { userPermission } from '@/hooks/usePermission';
import { RESOURCE_API } from '@/api/HerbInfoApi';

const { Option } = Select;

interface CourseResource {
  courseResourceId: number;
  courseId: number;
  courseResourceType: number;
  courseResourceOrder: number;
  courseResourceTitle: string;
  courseResourceContent: string;
  courseResourceMetadata?: string;
  courseResourceTime: string;
  courseResourceIsvalid: boolean;
  courseResourceTypeName: string;
}

interface CourseResourceManagerProps {
  courseId: number;
}

const resourceTypeMap = {
  '视频': 0,
  '文档': 1,
  '图片': 2,
  '其他': 3,
};

const resourceTypeIcons = {
  '视频': <VideoCameraOutlined />,
  '文档': <FileTextOutlined />,
  '图片': <PictureOutlined />,
  'PDF': <FilePdfOutlined />,
  'Excel': <FileExcelOutlined />,
  '其他': <FileTextOutlined />,
};

export default function CourseResourceManager({ courseId }: CourseResourceManagerProps) {
  const [resources, setResources] = useState<CourseResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingResource, setEditingResource] = useState<CourseResource | null>(null);
  const [form] = Form.useForm();
  
  const permission = userPermission();
  const canCreateResource = permission?.hasPermission('resource:create');

  // 获取课程资源列表
  const fetchResources = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(RESOURCE_API.GET_COURSE_RESOURCES(courseId));
      if (response.data.code === 0) {
        setResources(response.data.data || []);
      } else {
        message.error('获取资源列表失败');
      }
    } catch (error) {
      console.error('获取资源列表错误:', error);
      message.error('获取资源列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchResources();
    }
  }, [courseId]);

  // 打开创建/编辑资源模态框
  const showModal = (resource: CourseResource | null = null) => {
    setEditingResource(resource);
    form.resetFields();
    
    if (resource) {
      // 编辑现有资源
      form.setFieldsValue({
        courseResourceTitle: resource.courseResourceTitle,
        courseResourceType: resource.courseResourceTypeName,
        courseResourceContent: resource.courseResourceContent,
        courseResourceOrder: resource.courseResourceOrder,
      });
    }
    
    setIsModalVisible(true);
  };

  // 处理模态框确认
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      // 准备提交的数据
      const resourceData = {
        courseResourceTitle: values.courseResourceTitle,
        courseResourceType: resourceTypeMap[values.courseResourceType as keyof typeof resourceTypeMap],
        courseResourceContent: values.courseResourceContent,
        courseResourceOrder: values.courseResourceOrder,
        courseId,
      };
      
      if (editingResource) {
        // 更新资源
        const response = await axiosInstance.put(
          RESOURCE_API.UPDATE_RESOURCE(editingResource.courseResourceId), 
          resourceData
        );
        if (response.data.code === 0) {
          message.success('资源更新成功');
          fetchResources(); // 刷新资源列表
        } else {
          message.error(response.data.message || '资源更新失败');
        }
      } else {
        // 创建新资源
        const response = await axiosInstance.post(
          RESOURCE_API.CREATE_RESOURCE(courseId), 
          resourceData
        );
        if (response.data.code === 0) {
          message.success('资源创建成功');
          fetchResources(); // 刷新资源列表
        } else {
          message.error(response.data.message || '资源创建失败');
        }
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证或提交错误:', error);
    }
  };

  // 处理删除资源
  const handleDelete = async (resourceId: number) => {
    try {
      const response = await axiosInstance.delete(RESOURCE_API.DELETE_RESOURCE(resourceId));
      if (response.data.code === 0) {
        message.success('资源删除成功');
        fetchResources(); // 刷新资源列表
      } else {
        message.error(response.data.message || '资源删除失败');
      }
    } catch (error) {
      console.error('删除资源错误:', error);
      message.error('删除资源失败，请稍后重试');
    }
  };

  // 资源列表列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'courseResourceOrder',
      key: 'courseResourceOrder',
      sorter: (a: CourseResource, b: CourseResource) => a.courseResourceOrder - b.courseResourceOrder,
    },
    {
      title: '标题',
      dataIndex: 'courseResourceTitle',
      key: 'courseResourceTitle',
    },
    {
      title: '类型',
      dataIndex: 'courseResourceTypeName',
      key: 'courseResourceTypeName',
      render: (type: string) => {
        const icon = resourceTypeIcons[type as keyof typeof resourceTypeIcons] || resourceTypeIcons['其他'];
        return (
          <Tag icon={icon} color="blue">
            {type}
          </Tag>
        );
      },
    },
    {
      title: '上传时间',
      dataIndex: 'courseResourceTime',
      key: 'courseResourceTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CourseResource) => (
        <Space size="middle">
          <Tooltip title="编辑资源">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => showModal(record)} 
            />
          </Tooltip>
          <Tooltip title="删除资源">
            <Popconfirm
              title="确定要删除这个资源吗?"
              onConfirm={() => handleDelete(record.courseResourceId)}
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">课程资源管理</h3>
        {canCreateResource && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={() => showModal()}
          >
            添加资源
          </Button>
        )}
      </div>

      <Table 
        columns={columns} 
        dataSource={resources.map(resource => ({ ...resource, key: resource.courseResourceId }))} 
        loading={loading}
        pagination={false}
      />

      {/* 创建/编辑资源模态框 */}
      <Modal
        title={editingResource ? '编辑资源' : '添加资源'}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            courseResourceType: '视频',
            courseResourceOrder: resources.length + 1,
          }}
        >
          <Form.Item
            name="courseResourceTitle"
            label="资源标题"
            rules={[{ required: true, message: '请输入资源标题' }]}
          >
            <Input placeholder="请输入资源标题" />
          </Form.Item>
          
          <Form.Item
            name="courseResourceType"
            label="资源类型"
            rules={[{ required: true, message: '请选择资源类型' }]}
          >
            <Select placeholder="请选择资源类型">
              <Option value="视频">视频</Option>
              <Option value="文档">文档</Option>
              <Option value="图片">图片</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          
          <Form.Item
            name="courseResourceContent"
            label="资源链接"
            rules={[{ required: true, message: '请输入资源链接' }]}
          >
            <Input placeholder="请输入资源链接" />
          </Form.Item>
          
          <Form.Item
            name="courseResourceOrder"
            label="排序序号"
            rules={[{ required: true, message: '请输入排序序号' }]}
          >
            <Input type="number" placeholder="请输入排序序号" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}