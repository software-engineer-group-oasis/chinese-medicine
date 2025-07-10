// 个人业绩页面
"use client"
import React, { useState } from 'react';
import Card from 'antd/es/card';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Tag from 'antd/es/tag';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import DatePicker from 'antd/es/date-picker';
import Form from 'antd/es/form';
import Modal from 'antd/es/modal';
import Upload from 'antd/es/upload';
import Drawer from 'antd/es/drawer';
import Divider from 'antd/es/divider';
import Typography from 'antd/es/typography';
import Breadcrumb from 'antd/es/breadcrumb';
import Table from 'antd/es/table';
import Tabs from 'antd/es/tabs';
import Empty from 'antd/es/empty';
import Steps from 'antd/es/steps';
import Timeline from 'antd/es/timeline';
import Tooltip from 'antd/es/tooltip';
import Progress from 'antd/es/progress';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Statistic from 'antd/es/statistic';
import message from 'antd/es/message';
import { 
  ArrowLeftOutlined, PlusOutlined, SearchOutlined, 
  FilterOutlined, UploadOutlined, FileTextOutlined,
  FilePdfOutlined, FileExcelOutlined, FileImageOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
  EyeOutlined, EditOutlined, DeleteOutlined, DownloadOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import ReactECharts from 'echarts-for-react';
import useAxios from '@/hooks/useAxios';
import axiosInstance from '@/api/config';
import { useEffect } from 'react';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 状态标签渲染
const statusTagMap = {
  [0]: <Tag icon={<ClockCircleOutlined />} color="warning">待审核</Tag>,
  [1]: <Tag icon={<CheckCircleOutlined />} color="success">已通过</Tag>,
  [2]: <Tag icon={<CloseCircleOutlined />} color="error">未通过</Tag>
};

// 文件类型图标映射
const fileIconMap: Record<string, React.ReactNode> = {
  pdf: <FilePdfOutlined />,
  doc: <FileTextOutlined />,
  docx: <FileTextOutlined />,
  xls: <FileExcelOutlined />,
  xlsx: <FileExcelOutlined />,
  jpg: <FileImageOutlined />,
  jpeg: <FileImageOutlined />,
  png: <FileImageOutlined />
};

export default function PersonalPerformancePage() {
  const [form] = Form.useForm();
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const pageSize = 10;
  // 获取token和userId（假设从localStorage获取）
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
  const userId = typeof window !== 'undefined' ? localStorage.getItem('userId') : '';

  // 获取我的业绩列表
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/performance-service/performances/my?page=${page}&size=${pageSize}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId || ''
        }
      });
      if (res.data.code === 0) {
        setRecords(res.data.data.list || []);
        setTotal(res.data.data.total || 0);
      } else {
        message.error(res.data.message || '获取业绩失败');
      }
    } catch (e) {
      message.error('网络错误，获取业绩失败');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
    // eslint-disable-next-line
  }, [page]);

  // 查看详情
  const handleViewDetail = async (record: any) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/performance-service/performances/${record.performId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId || ''
        }
      });
      if (res.data.code === 0) {
        setSelectedRecord(res.data.data);
        setDetailVisible(true);
      } else {
        message.error(res.data.message || '获取详情失败');
      }
    } catch (e) {
      message.error('网络错误，获取详情失败');
    }
    setLoading(false);
  };

  // 删除业绩
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '确认删除该业绩？',
      onOk: async () => {
        try {
          const res = await axiosInstance.delete(`/performance-service/performances/${record.performId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId || ''
            }
          });
          if (res.data.code === 0) {
            message.success('删除成功');
            fetchRecords();
          } else {
            message.error(res.data.message || '删除失败');
          }
        } catch (e) {
          message.error('网络错误，删除失败');
        }
      }
    });
  };

  // 提交业绩
  const handleSubmit = async (record: any) => {
    Modal.confirm({
      title: '确认提交该业绩？',
      onOk: async () => {
        try {
          const res = await axiosInstance.post(`/performance-service/performances/${record.performId}/submit`, {}, {
            headers: {
              Authorization: `Bearer ${token}`,
              userId: userId || ''
            }
          });
          if (res.data.code === 0) {
            message.success('提交成功');
            fetchRecords();
          } else {
            message.error(res.data.message || '提交失败');
          }
        } catch (e) {
          message.error('网络错误，提交失败');
        }
      }
    });
  };

  // 编辑业绩（弹窗）
  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      performName: record.performName,
      performContent: record.performContent,
      performTypeId: record.performTypeId,
      performTime: record.performTime ? new Date(record.performTime) : null
    });
    setEditModalVisible(true);
  };

  // 保存编辑
  const handleSaveEdit = async () => {
    try {
      const values = await form.validateFields();
      const res = await axiosInstance.put(`/performance-service/performances/${selectedRecord.performId}`, {
        ...values,
        performTime: values.performTime ? values.performTime.toISOString() : undefined
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId || ''
        }
      });
      if (res.data.code === 0) {
        message.success('保存成功');
        setEditModalVisible(false);
        fetchRecords();
      } else {
        message.error(res.data.message || '保存失败');
      }
    } catch (e) {
      message.error('网络错误，保存失败');
    }
  };

  // 表格字段
  const columns = [
    { title: '业绩名称', dataIndex: 'performName', key: 'performName', render: (text: string, record: any) => <a onClick={() => handleViewDetail(record)}>{text}</a> },
    { title: '业绩类型', dataIndex: 'performTypeName', key: 'performTypeName' },
    { title: '业绩内容', dataIndex: 'performContent', key: 'performContent', ellipsis: true },
    { title: '状态', dataIndex: 'performStatusName', key: 'performStatusName' },
    { title: '提交时间', dataIndex: 'performTime', key: 'performTime', render: (text: string) => text ? new Date(text).toLocaleString() : '-' },
    { title: '操作', key: 'action', render: (_: any, record: any) => (
      <Space>
        {record.performStatus === 0 && <Button onClick={() => handleEdit(record)}>编辑</Button>}
        {record.performStatus === 0 && <Button danger onClick={() => handleDelete(record)}>删除</Button>}
        {record.performStatus === 0 && <Button type="primary" onClick={() => handleSubmit(record)}>提交</Button>}
        <Button onClick={() => handleViewDetail(record)}>详情</Button>
      </Space>
    ) }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">我的业绩</h1>
      <Card bordered={false} className="mb-4">
        <Table
          rowKey="performId"
          columns={columns}
          dataSource={records}
          loading={loading}
          pagination={{
            current: page,
            pageSize,
            total,
            onChange: setPage
          }}
        />
      </Card>
      {/* 编辑弹窗 */}
      <Modal
        title="编辑业绩"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={handleSaveEdit}
        okText="保存"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="performName" label="业绩名称" rules={[{ required: true, message: '请输入业绩名称' }]}/>
          <Form.Item name="performContent" label="业绩内容" rules={[{ required: true, message: '请输入业绩内容' }]}/>
          <Form.Item name="performTypeId" label="业绩类型" rules={[{ required: true, message: '请选择业绩类型' }]}> 
            <Select>
              {/* 业绩类型可通过接口获取，这里可后续优化 */}
              <Select.Option value={1}>教学成果</Select.Option>
              <Select.Option value={2}>科研成果</Select.Option>
              <Select.Option value={3}>社会服务</Select.Option>
              <Select.Option value={5}>其他业绩</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="performTime" label="业绩时间" rules={[{ required: true, message: '请选择业绩时间' }]}> 
            <DatePicker showTime />
          </Form.Item>
        </Form>
      </Modal>
      {/* 详情抽屉 */}
      <Drawer
        title="业绩详情"
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        width={600}
      >
        {selectedRecord && (
          <div>
            <p><b>业绩名称：</b>{selectedRecord.performName}</p>
            <p><b>业绩类型：</b>{selectedRecord.performTypeName}</p>
            <p><b>业绩内容：</b>{selectedRecord.performContent}</p>
            <p><b>状态：</b>{selectedRecord.performStatusName}</p>
            <p><b>提交时间：</b>{selectedRecord.performTime ? new Date(selectedRecord.performTime).toLocaleString() : '-'}</p>
            <p><b>审核意见：</b>{selectedRecord.performComment || '-'}</p>
            <p><b>审核时间：</b>{selectedRecord.auditTime ? new Date(selectedRecord.auditTime).toLocaleString() : '-'}</p>
            {/* 附件列表 */}
            {selectedRecord.files && selectedRecord.files.length > 0 && (
              <div>
                <b>附件：</b>
                <ul>
                  {selectedRecord.files.map((file: any) => (
                    <li key={file.performFileId}>
                      <a href={file.performFileUrl} target="_blank" rel="noopener noreferrer">{file.performFileName}</a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </Drawer>
    </div>
  );
}