import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Select, DatePicker, 
  message, Modal, Upload, Space, Typography
} from 'antd';
import { 
  UploadOutlined, FileTextOutlined, 
  CheckCircleOutlined, SendOutlined, SaveOutlined
} from '@ant-design/icons';
import axios from 'axios';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import axiosInstance from '@/api/config';
import useAuthStore from '@/store/useAuthStore';
import type { Course } from '@/constTypes/course';
import useRequest from '@/hooks/useRequest';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface PerformanceAttachment {
  performId: number;
  performFileId: number;
  performFileDes: string;
  performFileType: string;
  performFileUrl: string;
  performFileIsvalid: boolean;
  performName: string;
  uploadTime: string; 
}

interface Performance {
  performId: number;
  performName: string;
  performContent: string;
  performTypeId: number;
  performTypeName: string;
  performStatus: number;
  performStatusName: string;
  performTime: string;
  performComment: string | null;
  submitUserId: number;
  submitUserName: string;
  submitUserRole: string;
  createdTime: string;
  updatedTime: string;
  auditTime: string | null;
  auditBy: string | null;
  fileCount: number;
  files: null | PerformanceAttachment[];
}

interface PerformanceApplyProps {
  courses: Course[];
  visible?: boolean;
  initialData?: Performance | null;
  onCancel?: () => void;
  onSuccess?: () => void;
}

const performanceTypes = [
  { id: 1, name: '教学成果' },
  { id: 2, name: '科研成果' },
  { id: 3, name: '社会服务' },
  { id: 4, name: '学术交流' },
  { id: 5, name: '其他业绩' },
];

export default function PerformanceApply({ 
  courses, 
  visible, 
  initialData, 
  onCancel, 
  onSuccess 
}: PerformanceApplyProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuthStore() as any;
  const { post, put } = useRequest();
  
  const API = {
    POST_File: (performanceId: number) =>
      `/performance-service/files/performances/${performanceId}/url`,
    POST_Performance: `/performance-service/performances`,
    PUT_Performance: (performanceId: number) => `/performance-service/performances/${performanceId}`,
    SUBMIT_Performance: (performanceId: number) => `/performance-service/performances/${performanceId}/submit`,
  };

  // 根据initialData初始化表单
  useEffect(() => {
    if (initialData) {
      form.setFieldsValue({
        performTypeId: initialData.performTypeId,
        performName: initialData.performName,
        performContent: initialData.performContent,
        performTime: initialData.performTime ? dayjs(initialData.performTime) : undefined,
      });
      // 如果有附件，也可以初始化 fileList
      // setFileList(...)
    } else {
      form.resetFields();
      setFileList([]);
    }
  }, [initialData, form]);

  // 处理文件上传
  const handleUploadChange: UploadProps['onChange'] = ({ fileList }) => {
    setFileList(fileList);
  };

  // 处理文件上传前的检查
  const beforeUpload = (file: File) => {
    const isPDF = file.type === 'application/pdf';
    const isDocx = file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    
    if (!isPDF && !isDocx) {
      message.error('只能上传PDF或DOCX文件!');
      return Upload.LIST_IGNORE;
    }
    
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error('文件必须小于10MB!');
      return Upload.LIST_IGNORE;
    }
    
    return false; // 阻止自动上传
  };

  // 打开模态框（用于独立申请按钮）
  const showModal = () => {
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async (isDraft: boolean = false) => {
    try {
      const values = await form.validateFields();
      
      if (fileList.length === 0) {
        message.info('您未上传证明材料，将仅提交业绩内容');
      }
      
      setUploading(true);
      
      const performanceData = {
        performTypeId: values.performTypeId,
        performName: values.performName,
        performContent: values.performContent,
        performTime: values.performTime.toISOString(),
        performStatus: isDraft ? 0 : 1, // 0: 草稿, 1: 审核中
      };

      // 添加调试信息
      console.log('提交的数据:', performanceData);
      console.log('是否为草稿:', isDraft);
      console.log('是否为编辑模式:', !!initialData);

      let response: any;
      if (initialData) {
        // 编辑模式
        if (isDraft) {
          // 保存草稿：调用PUT接口
          console.log('编辑模式-保存草稿，调用PUT接口:', API.PUT_Performance(initialData.performId));
          response = await put(API.PUT_Performance(initialData.performId), performanceData);
        } else {
          // 提交申请：调用专门的提交接口
          console.log('编辑模式-提交申请，调用SUBMIT接口:', API.SUBMIT_Performance(initialData.performId));
          response = await post(API.SUBMIT_Performance(initialData.performId), {});
        }
      } else {
        // 新建：调用POST接口
        console.log('新建模式，调用POST接口:', API.POST_Performance);
        response = await post(API.POST_Performance, performanceData);
      }

      console.log('API响应:', response);

      if (response && response.code === 0) {
        const actionText = isDraft ? '草稿保存成功' : (initialData ? '草稿更新成功' : '业绩申请提交成功');
        message.success(actionText);
        if (onSuccess) {
          onSuccess();
        } else {
          setIsModalVisible(false);
        }
      } else {
        message.error(response?.message || '提交失败');
      }

      // 如果是新建且有文件，处理文件上传
      if (!initialData && response?.data?.performId && fileList.length > 0) {
        const performId = response.data.performId;
        
        const formData = new FormData();
        fileList.forEach(file => {
          if (file.originFileObj) {
            formData.append('upload-file', file.originFileObj);
          }
        });
        
        // 上传文件到服务器
        const uploadResponse = await fetch('/api/tencent-cos', {
          method: 'POST',
          body: formData,
        });
        
        const uploadResult = await uploadResponse.json();
        if (uploadResult.status !== 'success') {
          throw new Error('文件上传失败');
        }

        // 提交附件与 performId 绑定
        const attachment = {
          performFileName: fileList[0].name,
          performFileDes: '详细的业绩证明材料描述',
          performFileType: fileList[0].name.split('.').pop()?.toLowerCase() || '',
          performFileUrl: uploadResult.url,
          fileSize: fileList[0].size,
        };

        const attachRes = await post(API.POST_File(performId), attachment);
        if (attachRes && attachRes.code === 0) {
          if (onSuccess) {
            onSuccess();
          } else {
            setIsModalVisible(false);
          }
        } else {
          message.error(attachRes?.message || '附件提交失败');
        }
      }

    } catch (error) {
      console.error('业绩申请提交错误:', error);
      message.error('业绩申请提交失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

  // 保存草稿
  const handleSaveDraft = () => {
    handleSubmit(true);
  };

  // 提交申请
  const handleSubmitApplication = () => {
    handleSubmit(false);
  };

  // 如果传入了visible等props，说明是作为编辑弹窗使用
  if (visible !== undefined) {
    return (
      <Modal
        title={initialData ? '编辑业绩草稿' : '申请业绩'}
        open={visible}
        onCancel={onCancel}
        confirmLoading={uploading}
        width={600}
        footer={[
          <Button key="cancel" onClick={onCancel}>
            取消
          </Button>,
          <Button 
            key="draft" 
            icon={<SaveOutlined />} 
            onClick={handleSaveDraft}
            loading={uploading}
          >
            保存草稿
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSubmitApplication}
            loading={uploading}
          >
            提交申请
          </Button>
        ]}
      >
        <div className="mb-4">
          <Text type="secondary">
            请填写业绩申请信息，并上传相关证明材料。您可以选择保存草稿或直接提交申请。
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="performTypeId"
            label="业绩类型"
            rules={[{ required: true, message: '请选择业绩类型' }]}
          >
            <Select placeholder="请选择业绩类型">
              {performanceTypes.map(type => (
                <Select.Option key={type.id} value={type.id}>
                    {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="performName"
            label="业绩标题"
            rules={[{ required: true, message: '请输入业绩标题' }]}
          >
            <Input placeholder="请输入业绩标题" />
          </Form.Item>

          <Form.Item
            name="performContent"
            label="业绩描述"
            rules={[{ required: true, message: '请输入业绩描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述您的业绩内容" />
          </Form.Item>

          <Form.Item
            name="performTime"
            label="业绩日期"
            rules={[{ required: true, message: '请选择业绩日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="上传证明材料"
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              multiple
              maxCount={5}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <div className="mt-2">
              <Text type="secondary" className="text-xs">
                支持上传PDF、DOCX格式文件，单个文件不超过10MB，最多上传5个文件
              </Text>
            </div>
          </Form.Item>
        </Form>

        {uploading && (
          <div className="text-center mt-4">
            <Text>文件上传中，请稍候...</Text>
          </div>
        )}
      </Modal>
    );
  }

  // 否则作为独立的申请按钮使用
  return (
    <div>
      <Button 
        type="primary" 
        icon={<SendOutlined />} 
        onClick={showModal}
      >
        申请业绩
      </Button>

      <Modal
        title="课程业绩申请"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={uploading}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setIsModalVisible(false)}>
            取消
          </Button>,
          <Button 
            key="draft" 
            icon={<SaveOutlined />} 
            onClick={handleSaveDraft}
            loading={uploading}
          >
            保存草稿
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            icon={<SendOutlined />} 
            onClick={handleSubmitApplication}
            loading={uploading}
          >
            提交申请
          </Button>
        ]}
      >
        <div className="mb-4">
          <Text type="secondary">
            请填写业绩申请信息，并上传相关证明材料。您可以选择保存草稿或直接提交申请。
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="performTypeId"
            label="业绩类型"
            rules={[{ required: true, message: '请选择业绩类型' }]}
          >
            <Select placeholder="请选择业绩类型">
              {performanceTypes.map(type => (
                <Select.Option key={type.id} value={type.id}>
                    {type.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="performName"
            label="业绩标题"
            rules={[{ required: true, message: '请输入业绩标题' }]}
          >
            <Input placeholder="请输入业绩标题" />
          </Form.Item>

          <Form.Item
            name="performContent"
            label="业绩描述"
            rules={[{ required: true, message: '请输入业绩描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述您的业绩内容" />
          </Form.Item>

          <Form.Item
            name="performTime"
            label="业绩日期"
            rules={[{ required: true, message: '请选择业绩日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="上传证明材料"
          >
            <Upload
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              multiple
              maxCount={5}
            >
              <Button icon={<UploadOutlined />}>选择文件</Button>
            </Upload>
            <div className="mt-2">
              <Text type="secondary" className="text-xs">
                支持上传PDF、DOCX格式文件，单个文件不超过10MB，最多上传5个文件
              </Text>
            </div>
          </Form.Item>
        </Form>

        {uploading && (
          <div className="text-center mt-4">
            <Text>文件上传中，请稍候...</Text>
          </div>
        )}
      </Modal>
    </div>
  );
}