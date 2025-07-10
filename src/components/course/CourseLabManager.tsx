import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, 
  message, Space, Tooltip, Tag, Popconfirm, Collapse
} from 'antd';
import { 
  DeleteOutlined, EditOutlined, PlusOutlined,
  ExperimentOutlined, DownOutlined
} from '@ant-design/icons';
import axiosInstance from '@/api/config';
import { LAB_API } from '@/api/HerbInfoApi';
import { userPermission } from '@/hooks/usePermission';

const { Option } = Select;
const { Panel } = Collapse;

interface LabStep {
  stepId?: number;
  stepTitle: string;
  stepContent: string;
  stepOrder: number;
}

interface CourseLab {
  labId: number;
  courseId: number;
  labName: string;
  labSteps: string;
  labOrder: number;
}

interface CourseLabManagerProps {
  courseId: number;
}

export default function CourseLabManager({ courseId }: CourseLabManagerProps) {
  const [labs, setLabs] = useState<CourseLab[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLabModalVisible, setIsLabModalVisible] = useState(false);
  const [editingLab, setEditingLab] = useState<CourseLab | null>(null);
  const [labForm] = Form.useForm();
  
  const permission = userPermission();
  const canCreateLab = permission?.hasPermission('lab:create');
  const canUpdateLab = permission?.hasPermission('lab:update');
  const canDeleteLab = permission?.hasPermission('lab:delete');

  // 获取课程实验列表
  const fetchLabs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(LAB_API.GET_COURSE_LABS(courseId));
      if (response.data.code === 0) {
        setLabs(response.data.data || []);
      } else {
        message.error('获取课程实验失败');
      }
    } catch (error) {
      console.error('获取课程实验错误:', error);
      message.error('获取课程实验失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchLabs();
    }
  }, [courseId]);

  // 打开创建/编辑实验模态框
  const showLabModal = (lab: CourseLab | null = null) => {
    setEditingLab(lab);
    labForm.resetFields();
    
    if (lab) {
      // 编辑现有实验
      labForm.setFieldsValue({
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

  // 处理实验模态框确认
  const handleLabOk = async () => {
    try {
      const values = await labForm.validateFields();
      
      // 准备提交的数据
      const labData = {
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
          LAB_API.CREATE_LAB(courseId), 
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

  // 实验列表列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'labOrder',
      key: 'labOrder',
      sorter: (a: CourseLab, b: CourseLab) => a.labOrder - b.labOrder,
    },
    {
      title: '实验名称',
      dataIndex: 'labName',
      key: 'labName',
    },
    {
      title: '实验步骤',
      dataIndex: 'labSteps',
      key: 'labSteps',
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>
          {text}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: CourseLab) => (
        <Space size="middle">
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">课程实验管理</h3>
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

      <Table 
        columns={columns} 
        dataSource={labs.map(lab => ({ ...lab, key: lab.labId }))} 
        loading={loading}
        pagination={false}
      />

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
    </div>
  );
}