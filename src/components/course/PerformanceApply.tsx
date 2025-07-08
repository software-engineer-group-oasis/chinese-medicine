import React, { useState, useEffect } from 'react';
import { 
  Form, Input, Button, Select, DatePicker, 
  message, Modal, Upload, Space, Typography
} from 'antd';
import { 
  UploadOutlined, FileTextOutlined, 
  CheckCircleOutlined, SendOutlined
} from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd/es/upload/interface';
import axiosInstance from '@/api/config';
import useAuthStore from '@/store/useAuthStore';
import type { Course } from '@/constTypes/course';

const { Option } = Select;
const { TextArea } = Input;
const { Title, Text } = Typography;

interface PerformanceApplyProps {
  courses: Course[];
  onSuccess: () => void;
}

export default function PerformanceApply({ courses, onSuccess }: PerformanceApplyProps) {
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { user } = useAuthStore();

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

  // 打开模态框
  const showModal = () => {
    form.resetFields();
    setFileList([]);
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (fileList.length === 0) {
        message.warning('请上传业绩证明材料');
        return;
      }
      
      setUploading(true);
      
      // 先上传文件
      const formData = new FormData();
      fileList.forEach(file => {
        if (file.originFileObj) {
          formData.append('files', file.originFileObj);
        }
      });
      
      // 上传文件到服务器
      const uploadResponse = await fetch('/api/upload-performance-files', {
        method: 'POST',
        body: formData,
      });
      
      const uploadResult = await uploadResponse.json();
      
      if (uploadResult.status !== 'success') {
        throw new Error('文件上传失败');
      }
      
      // 提交业绩申请
      const performanceData = {
        teacherId: user?.id,
        courseId: values.courseId,
        performanceType: values.performanceType,
        performanceTitle: values.performanceTitle,
        performanceDescription: values.performanceDescription,
        performanceDate: values.performanceDate.format('YYYY-MM-DD'),
        attachmentUrls: uploadResult.fileUrls,
      };
      
      const response = await axiosInstance.post('/performance-service/performances', performanceData);
      
      if (response.data.code === 0) {
        message.success('业绩申请提交成功');
        setIsModalVisible(false);
        onSuccess(); // 通知父组件刷新列表
      } else {
        message.error(response.data.message || '业绩申请提交失败');
      }
    } catch (error) {
      console.error('业绩申请提交错误:', error);
      message.error('业绩申请提交失败，请稍后重试');
    } finally {
      setUploading(false);
    }
  };

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
        onOk={handleSubmit}
        onCancel={() => setIsModalVisible(false)}
        confirmLoading={uploading}
        width={600}
      >
        <div className="mb-4">
          <Text type="secondary">
            请填写业绩申请信息，并上传相关证明材料。审核通过后将计入您的教学业绩。
          </Text>
        </div>

        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="courseId"
            label="选择课程"
            rules={[{ required: true, message: '请选择课程' }]}
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
            name="performanceType"
            label="业绩类型"
            rules={[{ required: true, message: '请选择业绩类型' }]}
          >
            <Select placeholder="请选择业绩类型">
              <Option value="teaching">教学业绩</Option>
              <Option value="research">科研业绩</Option>
              <Option value="innovation">教学创新</Option>
              <Option value="other">其他业绩</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="performanceTitle"
            label="业绩标题"
            rules={[{ required: true, message: '请输入业绩标题' }]}
          >
            <Input placeholder="请输入业绩标题" />
          </Form.Item>

          <Form.Item
            name="performanceDescription"
            label="业绩描述"
            rules={[{ required: true, message: '请输入业绩描述' }]}
          >
            <TextArea rows={4} placeholder="请详细描述您的业绩内容" />
          </Form.Item>

          <Form.Item
            name="performanceDate"
            label="业绩日期"
            rules={[{ required: true, message: '请选择业绩日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="上传证明材料"
            required
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