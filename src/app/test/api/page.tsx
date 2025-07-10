"use client";

import { useState } from 'react';
import { Button, message, Card, Typography } from 'antd';
import axiosInstance from '@/api/config';

const { Title, Text } = Typography;

export default function TestApiPage() {
  const [loading, setLoading] = useState(false);
  const [envInfo, setEnvInfo] = useState<any>({});

  const checkEnvironment = () => {
    const env = {
      baseURL: process.env.NEXT_PUBLIC_BASE_URL,
      nodeEnv: process.env.NODE_ENV,
      hasBaseURL: !!process.env.NEXT_PUBLIC_BASE_URL,
    };
    setEnvInfo(env);
    console.log('环境变量信息:', env);
  };

  const testCourseCreation = async () => {
    setLoading(true);
    try {
      const testData = {
        courseName: '测试课程',
        courseType: 1,
        courseObject: 1,
        courseDes: '这是一个测试课程',
        courseStartTime: '2024-01-01T00:00:00',
        courseEndTime: '2024-12-31T23:59:59',
        coverImageUrl: 'https://example.com/images/cover_zydx.jpg',
        teacherId: 1,
      };

      console.log('测试数据:', testData);
      console.log('axiosInstance baseURL:', axiosInstance.defaults.baseURL);
      
      const response = await axiosInstance.post('/herb-teaching-service/courses', testData);
      console.log('API响应:', response);
      
      if (response.data.code === 0) {
        message.success('课程创建测试成功');
      } else {
        message.error(`课程创建失败: ${response.data.message}`);
      }
    } catch (error: any) {
      console.error('测试失败:', error);
      if (error.response) {
        console.error('错误响应:', error.response);
        message.error(`API错误: ${error.response.status} - ${error.response.data?.message || error.message}`);
      } else if (error.request) {
        console.error('请求错误:', error.request);
        message.error('网络错误：无法连接到服务器');
      } else {
        message.error(`请求错误: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const testFileUpload = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      const testFile = new File(['test content'], 'test.txt', { type: 'text/plain' });
      formData.append('upload-file', testFile);

      const response = await fetch('/api/tencent-cos', {
        method: 'POST',
        body: formData,
      });

      console.log('上传响应状态:', response.status);
      const result = await response.json();
      console.log('上传结果:', result);

      if (result.status === 'success') {
        message.success('文件上传测试成功');
      } else {
        message.error(`文件上传失败: ${result.error}`);
      }
    } catch (error) {
      console.error('上传测试失败:', error);
      message.error('文件上传测试失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Title level={2}>API测试页面</Title>
      
      <div className="space-y-4 mb-6">
        <Button 
          type="primary" 
          onClick={checkEnvironment}
        >
          检查环境变量
        </Button>
        
        <Button 
          type="primary" 
          onClick={testCourseCreation}
          loading={loading}
        >
          测试课程创建API
        </Button>
        
        <Button 
          type="default" 
          onClick={testFileUpload}
          loading={loading}
        >
          测试文件上传API
        </Button>
      </div>

      {Object.keys(envInfo).length > 0 && (
        <Card title="环境变量信息" className="mb-6">
          <div className="space-y-2">
            <div><Text strong>Base URL:</Text> {envInfo.baseURL || '未设置'}</div>
            <div><Text strong>Node Env:</Text> {envInfo.nodeEnv}</div>
            <div><Text strong>Has Base URL:</Text> {envInfo.hasBaseURL ? '是' : '否'}</div>
          </div>
        </Card>
      )}
      
      <Card title="调试信息">
        <div className="space-y-2">
          <Text>请打开浏览器控制台查看详细的调试信息</Text>
          <Text>如果遇到500错误，请检查：</Text>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>后端服务是否正常运行</li>
            <li>API端点是否正确</li>
            <li>环境变量是否配置正确</li>
            <li>网络连接是否正常</li>
            <li>用户认证是否有效</li>
          </ul>
        </div>
      </Card>
    </div>
  );
}
