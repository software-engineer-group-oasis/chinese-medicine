
// 业绩审核页面
"use client"
import React, { useState, useEffect, useMemo } from 'react';
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Space from 'antd/es/space';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import DatePicker from 'antd/es/date-picker';
import Divider from 'antd/es/divider';
import Breadcrumb from 'antd/es/breadcrumb';
import Tooltip from 'antd/es/tooltip';
import Tabs from 'antd/es/tabs';
import Form from 'antd/es/form';
import Modal from 'antd/es/modal';
import Rate from 'antd/es/rate';
import InputNumber from 'antd/es/input-number';
import Drawer from 'antd/es/drawer';
import message from 'antd/es/message';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import Collapse from 'antd/es/collapse';
import { 
  ArrowLeftOutlined, SearchOutlined, FilterOutlined, 
  DownloadOutlined, EyeOutlined, CheckOutlined,
  CloseOutlined, FileTextOutlined, StarOutlined,
  PaperClipOutlined, CommentOutlined, HistoryOutlined,
  CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import { Tag, List, Button, Typography } from 'antd';
const { Title, Text, Paragraph } = Typography;
import Link from 'next/link';
import Image from 'next/image';
import useAxios from '@/hooks/useAxios';
import axiosInstance from '@/api/config';

const { Option } = Select;
const { TextArea } = Input;

const { RangePicker } = DatePicker;
const { Panel } = Collapse;

export default function PerformanceReviewPage() {
  const [records, setRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [form] = Form.useForm();
  const pageSize = 10;

  // 搜索和筛选参数
  const [filters, setFilters] = useState({ keyword: '', performTypeId: undefined, performStatus: undefined });

  // 获取业绩类型列表（用于下拉）
  const [typeList, setTypeList] = useState<any[]>([]);
  const fetchTypeList = async () => {
    try {
      const res = await axiosInstance.get('/performance-service/perform-types');
      if (res.data.code === 0) setTypeList(res.data.data || []);
    } catch {}
  };

  useEffect(() => { fetchTypeList(); }, []);

  // 构建请求参数
  const requestParams = useMemo(() => {
    const params = {
      keyword: filters.keyword || undefined,
      performTypeId: filters.performTypeId || undefined,
      performStatus: filters.performStatus || undefined,
      page,
      size: pageSize
    };
    return params;
  }, [filters.keyword, filters.performTypeId, filters.performStatus, page, pageSize]);

  // 获取业绩列表（支持筛选、分页）
  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get('/performance-service/performances', {
        params: requestParams
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

  // 搜索表单提交
  const handleSearch = (values: any) => {
    // 类型转换，保证和后端一致
    const params = {
      ...values,
      performTypeId: values.performTypeId ? Number(values.performTypeId) : undefined,
      performStatus: values.performStatus ? Number(values.performStatus) : undefined,
    };
    setFilters(params);
    setPage(1);
    message.success('搜索条件已应用');
  };

  // 搜索表单重置
  const handleReset = () => {
    setFilters({ keyword: '', performTypeId: undefined, performStatus: undefined });
    setPage(1);
    form.resetFields();
  };

  // 监听参数变化重新获取数据
  useEffect(() => { 
    fetchRecords(); 
  }, [requestParams]);

  // 查看详情
  const handleViewDetail = async (record: any) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(`/performance-service/performances/${record.performId}`);
      if (res.data.code === 0) {
        setSelectedRecord(res.data.data);
        setIsDetailDrawerVisible(true);
      } else {
        message.error(res.data.message || '获取详情失败');
      }
    } catch (e) {
      message.error('网络错误，获取详情失败');
    }
    setLoading(false);
  };

  // 审核操作
  const handleReview = (record: any) => {
    setSelectedRecord(record);
    setIsReviewModalVisible(true);
    form.setFieldsValue({
      auditResult: 2,
      performComment: ''
    });
  };

  // 提交审核
  const handleSubmitReview = async () => {
    try {
      const values = await form.validateFields();
      const res = await axiosInstance.post(`/performance-service/performances/${selectedRecord.performId}/audit`, {
        auditResult: values.auditResult,
        performComment: values.performComment
      });
      if (res.data.code === 0) {
        message.success('审核成功');
        setIsReviewModalVisible(false);
        fetchRecords();
      } else {
        message.error(res.data.message || '审核失败');
      }
    } catch (e) {
      message.error('网络错误，审核失败');
    }
  };

  // 业绩类型颜色映射
  const typeColorMap: Record<string, string> = {
    '教学成果': 'blue',
    '科研成果': 'green',
    '社会服务': 'orange',
    '学术交流': 'purple',
    '其他业绩': 'gold'
  };

  // 表格字段
  const columns = [
    { title: '业绩名称', dataIndex: 'performName', key: 'performName' },
    { title: '业绩类型', dataIndex: 'performTypeName', key: 'performTypeName', render: (text: string) => <Tag color={typeColorMap[text] || 'default'}>{text}</Tag> },
    { title: '提交人', dataIndex: 'submitUserName', key: 'submitUserName' },
    { title: '提交时间', dataIndex: 'performTime', key: 'performTime', render: (text: string) => text ? new Date(text).toLocaleString() : '-' },
    { title: '创建时间', dataIndex: 'createdTime', key: 'createdTime', render: (text: string) => text ? new Date(text).toLocaleString() : '-' },
    { title: '审核时间', dataIndex: 'auditTime', key: 'auditTime', render: (text: string) => text ? new Date(text).toLocaleString() : '-' },
    { title: '审核人', dataIndex: 'auditBy', key: 'auditBy', render: (text: string, record: any) => record.auditBy ? record.auditBy : '-' },
    { title: '状态', dataIndex: 'performStatusName', key: 'performStatusName', render: (text: string) => {
      const colorMap: Record<string, string> = {
        '已提交': 'gold',
        '已通过': 'green',
        '已驳回': 'red'
      };
      return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
    }},
    { title: '审核意见', dataIndex: 'performComment', key: 'performComment', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleViewDetail(record)} />
          {/* 只有已提交状态的记录才显示审核按钮 */}
          {record.performStatus === 1 && (
            <Button type="primary" onClick={() => handleReview(record)}>审核</Button>
          )}
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">业绩审核评分</h1>
      <Card>
        {/* 多条件查询工具栏 */}
        <div className="mb-4">
          <Form
            layout="inline"
            form={form}
            onFinish={handleSearch}
            className="flex flex-wrap gap-4 items-end"
          >
            <Form.Item name="keyword" label="业绩标题">
              <Input placeholder="请输入业绩标题" style={{ width: 200 }} />
            </Form.Item>
            
            <Form.Item name="performTypeId" label="业绩类型">
              <Select placeholder="请选择业绩类型" allowClear style={{ width: 150 }}>
                {typeList.map(type => (
                  <Select.Option key={type.performTypeId} value={type.performTypeId}>{type.performTypeName}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item name="performStatus" label="状态">
              <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
                <Select.Option value={1}>已提交</Select.Option>
                <Select.Option value={2}>已通过</Select.Option>
                <Select.Option value={3}>已驳回</Select.Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button onClick={handleReset}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>

        {/* 数据表格 */}
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
      {/* 审核弹窗 */}
      <Modal
        title="业绩审核"
        open={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        onOk={handleSubmitReview}
        okText="提交"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="auditResult" label="审核结果" rules={[{ required: true, message: '请选择审核结果' }]}> 
            <Select>
              <Select.Option value={2}>通过</Select.Option>
              <Select.Option value={3}>驳回</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="performComment" label="审核意见" rules={[{ required: true, message: '请输入审核意见' }]}> 
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
      {/* 详情抽屉 */}
      <Drawer
        title="业绩详情"
        open={isDetailDrawerVisible}
        onClose={() => setIsDetailDrawerVisible(false)}
        width={600}
      >
        {selectedRecord && (
          <div style={{ padding: 8 }}>
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 8 }}>
                  <FileTextOutlined style={{ color: '#1677ff', marginRight: 8 }} />{selectedRecord.performName}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>业绩类型：</b>
                  <Tag color={typeColorMap[selectedRecord.performTypeName] || 'default'}>{selectedRecord.performTypeName}</Tag>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>提交人：</b>{selectedRecord.submitUserName}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>提交时间：</b>{selectedRecord.performTime ? new Date(selectedRecord.performTime).toLocaleString() : '-'}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>创建时间：</b>{selectedRecord.createdTime ? new Date(selectedRecord.createdTime).toLocaleString() : '-'}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>状态：</b>{selectedRecord.performStatusName}
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 8 }}>
                  <b>审核人：</b>{selectedRecord.auditBy || '-'}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>审核时间：</b>{selectedRecord.auditTime ? new Date(selectedRecord.auditTime).toLocaleString() : '-'}
                </div>
                <div style={{ marginBottom: 8 }}>
                  <b>审核意见：</b>{selectedRecord.performComment || '-'}
                </div>
              </Col>
            </Row>
            <Divider orientation="left" style={{ margin: '16px 0 8px 0' }}>
              <CommentOutlined style={{ color: '#faad14', marginRight: 4 }} />业绩内容
            </Divider>
            <div style={{ background: '#f6f8fa', padding: 12, borderRadius: 6, marginBottom: 16, minHeight: 60 }}>
              {selectedRecord.performContent}
            </div>
            {selectedRecord.files && selectedRecord.files.length > 0 && (
              <>
                <Divider orientation="left" style={{ margin: '16px 0 8px 0' }}>
                  <PaperClipOutlined style={{ color: '#52c41a', marginRight: 4 }} />附件资源
                </Divider>
                <List
                  bordered
                  dataSource={selectedRecord.files}
                  renderItem={(item: any) => (
                    <List.Item
                      key={item.performFileId}
                      actions={[
                        <Button
                          key="download"
                          type="link"
                          icon={<DownloadOutlined />}
                          href={item.performFileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          下载
                        </Button>
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<FileTextOutlined />}
                        title={item.performFileName}
                        description={item.performFileDes || ''}
                      />
                    </List.Item>
                  )}
                />
              </>
            )}
          </div>
        )}
      </Drawer>

    </div>
  );
}
