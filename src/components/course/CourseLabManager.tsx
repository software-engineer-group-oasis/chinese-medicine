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
  courseLabId: number;
  courseId: number;
  courseLabTitle: string;
  courseLabDescription: string;
  courseLabOrder: number;
  courseLabTime: string;
  steps?: LabStep[];
}

interface CourseLabManagerProps {
  courseId: number;
}

export default function CourseLabManager({ courseId }: CourseLabManagerProps) {
  const [labs, setLabs] = useState<CourseLab[]>([]);
  const [loading, setLoading] = useState(false);
  const [isLabModalVisible, setIsLabModalVisible] = useState(false);
  const [isStepModalVisible, setIsStepModalVisible] = useState(false);
  const [editingLab, setEditingLab] = useState<CourseLab | null>(null);
  const [editingStep, setEditingStep] = useState<LabStep | null>(null);
  const [currentLabId, setCurrentLabId] = useState<number | null>(null);
  const [labForm] = Form.useForm();
  const [stepForm] = Form.useForm();
  
  const permission = userPermission();
  const canCreateLab = permission?.hasPermission('lab:create');
  const canUpdateLab = permission?.hasPermission('lab:update');
  const canDeleteLab = permission?.hasPermission('lab:delete');

  // 获取课程实验列表
  const fetchLabs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/herb-teaching-service/courses/${courseId}/labs`);
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
        courseLabTitle: lab.courseLabTitle,
        courseLabDescription: lab.courseLabDescription,
        courseLabOrder: lab.courseLabOrder,
      });
    }
    
    setIsLabModalVisible(true);
  };

  // 打开创建/编辑实验步骤模态框
  const showStepModal = (labId: number, step: LabStep | null = null) => {
    setCurrentLabId(labId);
    setEditingStep(step);
    stepForm.resetFields();
    
    if (step) {
      // 编辑现有步骤
      stepForm.setFieldsValue({
        stepTitle: step.stepTitle,
        stepContent: step.stepContent,
        stepOrder: step.stepOrder,
      });
    } else {
      // 新步骤，设置默认排序
      const currentLab = labs.find(lab => lab.courseLabId === labId);
      const stepsCount = currentLab?.steps?.length || 0;
      stepForm.setFieldsValue({
        stepOrder: stepsCount + 1,
      });
    }
    
    setIsStepModalVisible(true);
  };

  // 处理实验模态框确认
  const handleLabOk = async () => {
    try {
      const values = await labForm.validateFields();
      
      // 准备提交的数据
      const labData = {
        courseLabTitle: values.courseLabTitle,
        courseLabDescription: values.courseLabDescription,
        courseLabOrder: values.courseLabOrder,
        courseId,
      };
      
      if (editingLab) {
        // 更新实验
        const response = await axiosInstance.put(
          `/herb-teaching-service/courses/${courseId}/labs/${editingLab.courseLabId}`, 
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
          `/herb-teaching-service/courses/${courseId}/labs`, 
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

  // 处理步骤模态框确认
  const handleStepOk = async () => {
    if (!currentLabId) return;
    
    try {
      const values = await stepForm.validateFields();
      
      // 准备提交的数据
      const stepData = {
        stepTitle: values.stepTitle,
        stepContent: values.stepContent,
        stepOrder: values.stepOrder,
      };
      
      if (editingStep?.stepId) {
        // 更新步骤
        const response = await axiosInstance.put(
          `/herb-teaching-service/courses/${courseId}/labs/${currentLabId}/steps/${editingStep.stepId}`, 
          stepData
        );
        if (response.data.code === 0) {
          message.success('步骤更新成功');
          fetchLabs(); // 刷新实验列表
        } else {
          message.error('步骤更新失败');
        }
      } else {
        // 创建新步骤
        const response = await axiosInstance.post(
          `/herb-teaching-service/courses/${courseId}/labs/${currentLabId}/steps`, 
          stepData
        );
        if (response.data.code === 0) {
          message.success('步骤创建成功');
          fetchLabs(); // 刷新实验列表
        } else {
          message.error('步骤创建失败');
        }
      }
      
      setIsStepModalVisible(false);
    } catch (error) {
      console.error('表单验证或提交错误:', error);
    }
  };

  // 处理删除实验
  const handleDeleteLab = async (labId: number) => {
    try {
      const response = await axiosInstance.delete(
        `/herb-teaching-service/courses/${courseId}/labs/${labId}`
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

  // 处理删除步骤
  const handleDeleteStep = async (labId: number, stepId: number) => {
    try {
      const response = await axiosInstance.delete(
        `/herb-teaching-service/courses/${courseId}/labs/${labId}/steps/${stepId}`
      );
      if (response.data.code === 0) {
        message.success('步骤删除成功');
        fetchLabs(); // 刷新实验列表
      } else {
        message.error('步骤删除失败');
      }
    } catch (error) {
      console.error('删除步骤错误:', error);
      message.error('删除步骤失败，请稍后重试');
    }
  };

  // 实验列表列定义
  const columns = [
    {
      title: '序号',
      dataIndex: 'courseLabOrder',
      key: 'courseLabOrder',
      sorter: (a: CourseLab, b: CourseLab) => a.courseLabOrder - b.courseLabOrder,
    },
    {
      title: '标题',
      dataIndex: 'courseLabTitle',
      key: 'courseLabTitle',
    },
    {
      title: '描述',
      dataIndex: 'courseLabDescription',
      key: 'courseLabDescription',
      ellipsis: true,
    },
    {
      title: '创建时间',
      dataIndex: 'courseLabTime',
      key: 'courseLabTime',
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
          <Tooltip title="添加步骤">
            <Button 
              type="link" 
              icon={<PlusOutlined />} 
              onClick={() => showStepModal(record.courseLabId, null)} 
            />
          </Tooltip>
          {canDeleteLab && (
            <Tooltip title="删除实验">
              <Popconfirm
                title="确定要删除这个实验吗?"
                onConfirm={() => handleDeleteLab(record.courseLabId)}
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

  // 实验步骤展开面板
  const expandedRowRender = (record: CourseLab) => {
    const steps = record.steps || [];
    return (
      <div className="pl-8 pr-4 py-2">
        <h4 className="text-base font-medium mb-2">实验步骤</h4>
        {steps.length > 0 ? (
          <Collapse>
            {steps.map((step, index) => (
              <Panel 
                header={
                  <div className="flex justify-between items-center">
                    <span>{`${step.stepOrder}. ${step.stepTitle}`}</span>
                    <Space>
                      <Button 
                        type="text" 
                        size="small" 
                        icon={<EditOutlined />} 
                        onClick={(e) => {
                          e.stopPropagation();
                          showStepModal(record.courseLabId, step);
                        }}
                      />
                      <Popconfirm
                        title="确定要删除这个步骤吗?"
                        onConfirm={(e) => {
                          e?.stopPropagation();
                          handleDeleteStep(record.courseLabId, step.stepId!);
                        }}
                        okText="确定"
                        cancelText="取消"
                      >
                        <Button 
                          type="text" 
                          danger 
                          size="small" 
                          icon={<DeleteOutlined />} 
                          onClick={(e) => e.stopPropagation()}
                        />
                      </Popconfirm>
                    </Space>
                  </div>
                } 
                key={index}
              >
                <div dangerouslySetInnerHTML={{ __html: step.stepContent }} />
              </Panel>
            ))}
          </Collapse>
        ) : (
          <div className="text-gray-500">暂无步骤，请添加</div>
        )}
      </div>
    );
  };

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
        expandable={{
          expandedRowRender,
          expandIcon: ({ expanded, onExpand, record }) =>
            expanded ? (
              <DownOutlined onClick={e => onExpand(record, e)} />
            ) : (
              <ExperimentOutlined onClick={e => onExpand(record, e)} />
            ),
        }}
        dataSource={labs.map(lab => ({ ...lab, key: lab.courseLabId }))} 
        loading={loading}
        pagination={false}
      />

      {/* 创建/编辑实验模态框 */}
      <Modal
        title={editingLab ? '编辑实验' : '添加实验'}
        open={isLabModalVisible}
        onOk={handleLabOk}
        onCancel={() => setIsLabModalVisible(false)}
      >
        <Form
          form={labForm}
          layout="vertical"
          initialValues={{
            courseLabOrder: labs.length + 1,
          }}
        >
          <Form.Item
            name="courseLabTitle"
            label="实验标题"
            rules={[{ required: true, message: '请输入实验标题' }]}
          >
            <Input placeholder="请输入实验标题" />
          </Form.Item>
          
          <Form.Item
            name="courseLabDescription"
            label="实验描述"
            rules={[{ required: true, message: '请输入实验描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请输入实验描述" />
          </Form.Item>
          
          <Form.Item
            name="courseLabOrder"
            label="排序序号"
            rules={[{ required: true, message: '请输入排序序号' }]}
          >
            <Input type="number" placeholder="请输入排序序号" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 创建/编辑步骤模态框 */}
      <Modal
        title={editingStep ? '编辑步骤' : '添加步骤'}
        open={isStepModalVisible}
        onOk={handleStepOk}
        onCancel={() => setIsStepModalVisible(false)}
      >
        <Form
          form={stepForm}
          layout="vertical"
        >
          <Form.Item
            name="stepTitle"
            label="步骤标题"
            rules={[{ required: true, message: '请输入步骤标题' }]}
          >
            <Input placeholder="请输入步骤标题" />
          </Form.Item>
          
          <Form.Item
            name="stepContent"
            label="步骤内容"
            rules={[{ required: true, message: '请输入步骤内容' }]}
          >
            <Input.TextArea rows={6} placeholder="请输入步骤内容，支持HTML格式" />
          </Form.Item>
          
          <Form.Item
            name="stepOrder"
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