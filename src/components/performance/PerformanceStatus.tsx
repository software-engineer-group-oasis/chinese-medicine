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
import type { ColumnsType } from 'antd/es/table';
import axiosInstance from '@/api/config';
import useAuthStore from '@/store/useAuthStore';
import { GET } from '@/app/api/tencent-geocoder/route';
import useRequest from '@/hooks/useRequest';
import PerformanceApply from './PerformanceApply';
const { Title, Text, Paragraph } = Typography;

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
  performTime: string; // ISO 时间字符串
  performComment: string | null;
  submitUserId: number;
  submitUserName: string;
  submitUserRole: string;
  createdTime: string;
  updatedTime: string;
  auditTime: string | null;
  auditBy: string | null;
  fileCount: number;
  files: null | PerformanceAttachment[]; // 如果后面补充了文件信息
}


export default function PerformanceStatus() {
  const [performances, setPerformances] = useState<Performance[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentPerformance, setCurrentPerformance] = useState<Performance | null>(null);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
const [isEditModalVisible, setIsEditModalVisible] = useState(false);
const [editingPerformance, setEditingPerformance] = useState<Performance | null>(null);

  const { user } = useAuthStore() as any;
  const {get}=useRequest()
  const Performance_API = {
    GET_PERFORMANCES: (page: number, size: number) =>
      `/performance-service/performances/my?page=${page}&size=${size}`,
    GET_PerformanceDetail: (performanceId: number) => 
      `/performance-service/performances/${performanceId}`,
    DELETE_Performance: (performanceId: number) => 
      `/performance-service/performances/${performanceId}`,
  };
  // 获取业绩申请列表
  const fetchPerformances = async () => {
    if (!(user as any)) return;
    try {
      setLoading(true); // 加载中

      const res = await get(Performance_API.GET_PERFORMANCES(pagination.current, pagination.pageSize)) as any;
      if (res && res.code === 0) {
        console.log('拿到 performances:', res.data?.list); 
        setPerformances(res.data?.list || []); // 设置数据
      } else {
        message.error('获取业绩数据失败');
      }
    } catch (error) {
      console.error('获取业绩列表失败:', error);
    message.error('加载业绩数据失败');
  } finally {
    setLoading(false); // 结束加载
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
      const response = await axiosInstance.get(Performance_API.GET_PerformanceDetail(performanceId));
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

  //编辑草稿
// 编辑草稿
const editDraft = (performId: number) => {
  const draft = performances.find(p => p.performId === performId);
  if (!draft) {
    message.error('未找到该草稿');
    return;
  }
  setEditingPerformance(draft);
  setIsEditModalVisible(true);
};

// 关闭编辑弹窗后，清理状态并刷新列表
const handleEditSuccess = () => {
  setIsEditModalVisible(false);
  setEditingPerformance(null);
  fetchPerformances();
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
  const columns :ColumnsType<Performance>= [
    {
      title: '业绩ID',
      dataIndex: 'performId',
      key: 'performId',
    },
    {
      title: '业绩标题',
      dataIndex: 'performName',
      key: 'performName',
      ellipsis: true,
    },
    {
      title: '业绩类型',
      dataIndex: 'performTypeName',
      key: 'performTypeName',
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: '申请时间',
      dataIndex: 'createdTime',
      key: 'createdTime',
      sorter: (a: Performance, b: Performance) => {
        return new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime();
      },
    },
        {
      title: '更新时间',
      dataIndex: 'updatedTime',
      key: 'updatedTime',
      sorter: (a: Performance, b: Performance) => {
        return new Date(a.updatedTime).getTime() - new Date(b.updatedTime).getTime();
      },
    },
    {
      title: '状态',
      dataIndex: 'performStatusName',
      key: 'performStatusName',
      render: (text: string, record: Performance) => {
        let color = 'default';
        let icon = null;

        switch (record.performStatus) {
          case 0:// 草稿
            color = 'default';
            icon = <FileTextOutlined />;
            break;
          case 1:// 审核中
            color = 'processing';
            icon = <ClockCircleOutlined />;
            break;
          case 2:// 已通过
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 3:// 已拒绝
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
        { text: '草稿', value: 0 },
        { text: '审核中', value: 1 },
        { text: '已通过', value: 2 },
        { text: '已拒绝', value: 3 },
      ],
      onFilter: (value, record) => record.performStatus === value,
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Performance) => (
        <Space size="middle">
          <Tooltip title="查看详情" key="view">
            <Button 
              key="view-btn"
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => viewPerformanceDetail(record.performId)} 
            />
          </Tooltip>
    {record.performStatus === 0 && (
      <>
      <Tooltip title="编辑草稿">
        <Button 
          type="link" 
          onClick={() => editDraft(record.performId)}
        >
          编辑
        </Button>
      </Tooltip>
        <Tooltip title="删除草稿">
          <Button 
            type="link" 
            danger
            onClick={() => {
              Modal.confirm({
                title: '确认删除该草稿？',
                content: '删除后不可恢复，是否继续？',
                okText: '删除',
                okType: 'danger',
                cancelText: '取消',
                onOk: async () => {
                  try {
                    await axiosInstance.delete(Performance_API.DELETE_Performance(record.performId));
                    message.success('删除成功');
                    fetchPerformances();
                  } catch (err) {
                    message.error('删除失败');
                  }
                }
              });
            }}
          >
            删除
          </Button>
        </Tooltip>
      </>
    )}
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
        rowKey="performId"
        columns={columns} 
        dataSource={performances} 
        loading={loading}
        pagination={{
          current: pagination.current,
          pageSize: pagination.pageSize,
          onChange: (page, pageSize) => setPagination({ current: page, pageSize }),
        }}
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
             <Descriptions.Item label="业绩标题">{currentPerformance.performName}</Descriptions.Item>
              <Descriptions.Item label="业绩类型">
                <Tag color="blue">{currentPerformance.performTypeName}</Tag>
              </Descriptions.Item>
              {/* <Descriptions.Item label="业绩日期">{currentPerformance.performTime}</Descriptions.Item> */}
              <Descriptions.Item label="申请时间">{currentPerformance.createdTime}</Descriptions.Item>
              <Descriptions.Item label="状态">
                {(() => {
                  let color = 'default';
                  let icon = null;
                  

                switch (currentPerformance.performStatus) {
                  case 0:// 草稿
                    color = 'default';
                    icon = <FileTextOutlined />;
                    break;
                  case 1:// 审核中
                    color = 'processing';
                    icon = <ClockCircleOutlined />;
                    break;
                  case 2:// 已通过
                    color = 'success';
                    icon = <CheckCircleOutlined />;
                    break;
                  case 3:// 已拒绝
                    color = 'error';
                    icon = <ExclamationCircleOutlined />;
                    break;
                }
                  
                  return (
                    <Tag color={color} icon={icon}>
                      {currentPerformance.performStatusName}
                    </Tag>
                  );
                })()} 
              </Descriptions.Item>
              <Descriptions.Item label="业绩描述">
                <Paragraph>
                  {currentPerformance.performContent || '无描述'}
                </Paragraph>
              </Descriptions.Item>
              {currentPerformance.performTime && (
                <Descriptions.Item label="审核时间">{currentPerformance.performTime}</Descriptions.Item>
              )}
              {currentPerformance.performComment && (
                <Descriptions.Item label="审核意见">{currentPerformance.performComment}</Descriptions.Item>
              )}
            </Descriptions>

            {currentPerformance.files && currentPerformance.files.length > 0 && (
              <div className="mt-4">
                <Title level={5}>附件列表</Title>
                <List
                  bordered
                  dataSource={currentPerformance.files}
                  renderItem={item => (
                    <List.Item
                    key={item.performFileId} // 添加唯一 key
                      actions={[
                        <Button 
                          key="download" 
                          type="link" 
                          icon={<DownloadOutlined />}
                          onClick={() => downloadAttachment(item.performFileUrl, item.performFileDes)}
                        >
                          下载
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileTextOutlined />}
                        title={item.performName}
                      />
                    </List.Item>
                  )}
                />
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 编辑业绩草稿弹窗 */}
      <PerformanceApply 
        courses={[]} // 这里需要传入实际的courses数据
        visible={isEditModalVisible} 
        initialData={editingPerformance} 
        onCancel={() => setIsEditModalVisible(false)} 
        onSuccess={handleEditSuccess} 
      />
    </div>
  );
}