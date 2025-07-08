import React, { useState, useEffect } from 'react';
import { 
  Table, Tag, Space, Button, Modal, Typography, 
  Descriptions, List, message, Tooltip
} from 'antd';
import { 
  EyeOutlined, FileTextOutlined, 
  CheckCircleOutlined, ClockCircleOutlined,
  ExclamationCircleOutlined, DownloadOutlined
} from '@ant-design/icons';
import axiosInstance from '@/api/config';
import useAuthStore from '@/store/useAuthStore';

const { Title, Text, Paragraph } = Typography;

interface PerformanceAttachment {
  attachmentId: number;
  attachmentUrl: string;
  attachmentName: string;
}

interface Performance {
  performanceId: number;
  teacherId: number;
  courseId: number;
  courseName: string;
  performanceType: string;
  performanceTypeName: string;
  performanceTitle: string;
  performanceDescription: string;
  performanceDate: string;
  applyTime: string;
  status: string;
  statusName: string;
  reviewTime?: string;
  reviewComment?: string;
  attachments?: PerformanceAttachment[];
}

export default function PerformanceStatus() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPerformance, setCurrentPerformance] = useState<Performance | null>(null);
  const { user } = useAuthStore();

  // 获取业绩申请列表
  const fetchPerformances = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/performance-service/performances/teacher/${user.id}`);
      if (response.data.code === 0) {
        setPerformances(response.data.data || []);
      } else {
        message.error('获取业绩申请列表失败');
      }
    } catch (error) {
      console.error('获取业绩申请列表错误:', error);
      message.error('获取业绩申请列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchPerformances();
    }
  }, [user]);

  // 查看业绩详情
  const viewPerformanceDetail = async (performanceId: number) => {
    try {
      const response = await axiosInstance.get(`/herb-teaching-service/performances/${performanceId}`);
      if (response.data.code === 0) {
        setCurrentPerformance(response.data.data);
        setIsModalVisible(true);
      } else {
        message.error('获取业绩详情失败');
      }
    } catch (error) {
      console.error('获取业绩详情错误:', error);
      message.error('获取业绩详情失败，请稍后重试');
    }
  };

  // 下载附件
  const downloadAttachment = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 业绩状态列定义
  const columns = [
    {
      title: '课程名称',
      dataIndex: 'courseName',
      key: 'courseName',
    },
    {
      title: '业绩标题',
      dataIndex: 'performanceTitle',
      key: 'performanceTitle',
      ellipsis: true,
    },
    {
      title: '业绩类型',
      dataIndex: 'performanceTypeName',
      key: 'performanceTypeName',
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'applyTime',
      key: 'applyTime',
      sorter: (a: Performance, b: Performance) => {
        return new Date(a.applyTime).getTime() - new Date(b.applyTime).getTime();
      },
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      key: 'statusName',
      render: (text: string, record: Performance) => {
        let color = 'default';
        let icon = null;
        
        switch (record.status) {
          case 'pending':
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case 'approved':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'rejected':
            color = 'error';
            icon = <ExclamationCircleOutlined />;
            break;
        }
        
        return (
          <Tag color={color} icon={icon}>
            {text}
          </Tag>
        );
      },
      filters: [
        { text: '审核中', value: 'pending' },
        { text: '已通过', value: 'approved' },
        { text: '已拒绝', value: 'rejected' },
      ],
      onFilter: (value: string, record: Performance) => record.status === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Performance) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => viewPerformanceDetail(record.performanceId)} 
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">业绩申请状态</h3>
        <Button 
          type="primary" 
          onClick={fetchPerformances}
        >
          刷新
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={performances.map(item => ({ ...item, key: item.performanceId }))} 
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      {/* 业绩详情模态框 */}
      <Modal
        title="业绩申请详情"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setIsModalVisible(false)}>
            关闭
          </Button>
        ]}
        width={700}
      >
        {currentPerformance && (
          <div>
            <Descriptions bordered column={1}>
              <Descriptions.Item label="课程名称">{currentPerformance.courseName}</Descriptions.Item>
              <Descriptions.Item label="业绩标题">{currentPerformance.performanceTitle}</Descriptions.Item>
              <Descriptions.Item label="业绩类型">
                <Tag color="blue">{currentPerformance.performanceTypeName}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="业绩日期">{currentPerformance.performanceDate}</Descriptions.Item>
              <Descriptions.Item label="申请时间">{currentPerformance.applyTime}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {(() => {
                  let color = 'default';
                  let icon = null;
                  
                  switch (currentPerformance.status) {
                    case 'pending':
                      color = 'processing';
                      icon = <ClockCircleOutlined />;
                      break;
                    case 'approved':
                      color = 'success';
                      icon = <CheckCircleOutlined />;
                      break;
                    case 'rejected':
                      color = 'error';
                      icon = <ExclamationCircleOutlined />;
                      break;
                  }
                  
                  return (
                    <Tag color={color} icon={icon}>
                      {currentPerformance.statusName}
                    </Tag>
                  );
                })()} 
              </Descriptions.Item>
              <Descriptions.Item label="业绩描述">
                <Paragraph>
                  {currentPerformance.performanceDescription}
                </Paragraph>
              </Descriptions.Item>
              {currentPerformance.reviewTime && (
                <Descriptions.Item label="审核时间">{currentPerformance.reviewTime}</Descriptions.Item>
              )}
              {currentPerformance.reviewComment && (
                <Descriptions.Item label="审核意见">{currentPerformance.reviewComment}</Descriptions.Item>
              )}
            </Descriptions>

            {currentPerformance.attachments && currentPerformance.attachments.length > 0 && (
              <div className="mt-4">
                <Title level={5}>附件列表</Title>
                <List
                  bordered
                  dataSource={currentPerformance.attachments}
                  renderItem={item => (
                    <List.Item
                      actions={[
                        <Button 
                          key="download" 
                          type="link" 
                          icon={<DownloadOutlined />}
                          onClick={() => downloadAttachment(item.attachmentUrl, item.attachmentName)}
                        >
                          下载
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileTextOutlined />}
                        title={item.attachmentName}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}