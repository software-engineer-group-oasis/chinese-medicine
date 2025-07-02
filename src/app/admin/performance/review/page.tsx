// 业绩审核与评分页面
"use client"
import React, { useState } from 'react';
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Tag from 'antd/es/tag';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import DatePicker from 'antd/es/date-picker';
import Divider from 'antd/es/divider';
import Typography from 'antd/es/typography';
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
  PaperClipOutlined, CommentOutlined, HistoryOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import Image from 'next/image';
// 导入模拟数据
import { 
  mockPerformanceRecords, 
  mockScoreStandards, 
  mockPerformanceTypes,
  PerformanceRecord
} from '@/mock/performance';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;
const { Panel } = Collapse;

export default function PerformanceReviewPage() {
  // 状态管理
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>(mockPerformanceRecords);
  const [selectedRecord, setSelectedRecord] = useState<PerformanceRecord | null>(null);
  const [isReviewModalVisible, setIsReviewModalVisible] = useState(false);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [isAttachmentModalVisible, setIsAttachmentModalVisible] = useState(false);
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('pending');
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({});

  // 处理查看详情
  const handleViewDetail = (record: PerformanceRecord) => {
    setSelectedRecord(record);
    setIsDetailDrawerVisible(true);
  };

  // 处理审核评分
  const handleReview = (record: PerformanceRecord) => {
    setSelectedRecord(record);
    setIsReviewModalVisible(true);
    
    // 根据业绩类型获取对应的评分标准
    const typeStandard = mockScoreStandards.find(standard => standard.typeId === record.typeId);
    
    // 设置表单初始值
    form.setFieldsValue({
      score: record.score || 0,
      comment: record.comment || '',
      // 设置各评分项的初始值
      ...(typeStandard?.criteria.reduce((acc, criterion) => {
        acc[`criterion_${criterion.id}`] = 0;
        return acc;
      }, {} as Record<string, number>))
    });
  };

  // 处理查看附件
  const handleViewAttachment = (attachment: any) => {
    setSelectedAttachment(attachment);
    setIsAttachmentModalVisible(true);
  };

  // 处理提交审核
  const handleSubmitReview = () => {
    form.validateFields().then(values => {
      if (!selectedRecord) return;
      
      // 获取业绩类型对应的评分标准
      const typeStandard = mockScoreStandards.find(standard => standard.typeId === selectedRecord.typeId);
      
      // 计算加权总分
      let totalScore = 0;
      if (typeStandard) {
        totalScore = typeStandard.criteria.reduce((sum, criterion) => {
          const criterionScore = values[`criterion_${criterion.id}`] || 0;
          return sum + criterionScore * criterion.weight;
        }, 0);
        totalScore = Math.round(totalScore * 100) / 100; // 保留两位小数
      }
      
      // 更新业绩记录
      const updatedRecords = performanceRecords.map(record => {
        if (record.id === selectedRecord.id) {
          const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
          const newAuditLog = {
            id: `${record.id}-${(record.auditLogs?.length || 0) + 1}`,
            time: now,
            operator: '系统管理员', // 实际应用中应该是当前登录用户
            action: values.status === 'approved' ? '审核通过' : '驳回',
            content: `评分：${totalScore}分，评语：${values.comment}`
          };
          
          return {
            ...record,
            status: values.status,
            score: totalScore,
            comment: values.comment,
            reviewerId: '1', // 实际应用中应该是当前登录用户ID
            reviewerName: '系统管理员', // 实际应用中应该是当前登录用户名
            reviewTime: now,
            auditLogs: [...(record.auditLogs || []), newAuditLog]
          };
        }
        return record;
      });
      
      setPerformanceRecords(updatedRecords);
      setIsReviewModalVisible(false);
      message.success(`业绩审核${values.status === 'approved' ? '通过' : '驳回'}成功！`);
    });
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    setSearchParams(values);
    setIsFilterDrawerVisible(false);
    // 这里可以添加API调用，根据搜索条件获取业绩记录
    message.success('搜索条件已应用');
  };

  // 根据状态筛选记录
  const getFilteredRecords = () => {
    let filtered = [...performanceRecords];
    
    // 根据标签页筛选状态
    if (activeTab === 'pending') {
      filtered = filtered.filter(record => record.status === 'pending');
    } else if (activeTab === 'approved') {
      filtered = filtered.filter(record => record.status === 'approved');
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter(record => record.status === 'rejected');
    }
    
    // 这里可以添加更多的筛选逻辑，根据searchParams
    
    return filtered;
  };

  // 表格列定义
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: PerformanceRecord) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      )
    },
    {
      title: '提交人',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '部门',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: '业绩类型',
      dataIndex: 'typeName',
      key: 'typeName',
      render: (text: string) => {
        const colorMap: Record<string, string> = {
          '教学成果': 'blue',
          '科研成果': 'green',
          '学术贡献': 'purple',
          '社会服务': 'orange'
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      }
    },
    {
      title: '提交时间',
      dataIndex: 'submitTime',
      key: 'submitTime',
      sorter: (a: PerformanceRecord, b: PerformanceRecord) => 
        new Date(a.submitTime).getTime() - new Date(b.submitTime).getTime()
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusMap: Record<string, { color: string, text: string }> = {
          'pending': { color: 'gold', text: '待审核' },
          'approved': { color: 'green', text: '已通过' },
          'rejected': { color: 'red', text: '已驳回' }
        };
        const { color, text } = statusMap[status] || { color: 'default', text: '未知' };
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '评分',
      dataIndex: 'score',
      key: 'score',
      render: (score: number) => score ? `${score}分` : '-'
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: PerformanceRecord) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)} 
            />
          </Tooltip>
          {record.status === 'pending' && (
            <Tooltip title="审核评分">
              <Button 
                type="text" 
                icon={<StarOutlined />} 
                onClick={() => handleReview(record)} 
              />
            </Tooltip>
          )}
          {record.attachments && record.attachments.length > 0 && (
            <Tooltip title={`${record.attachments.length}个附件`}>
              <Button 
                type="text" 
                icon={<PaperClipOutlined />} 
                onClick={() => handleViewDetail(record)} 
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // 渲染评分标准表单项
  const renderScoreCriteriaItems = () => {
    if (!selectedRecord) return null;
    
    const typeStandard = mockScoreStandards.find(standard => standard.typeId === selectedRecord.typeId);
    if (!typeStandard) return null;
    
    return typeStandard.criteria.map(criterion => (
      <Form.Item
        key={criterion.id}
        label={
          <Tooltip title={criterion.description}>
            {criterion.name} ({criterion.weight * 100}%)
          </Tooltip>
        }
        name={`criterion_${criterion.id}`}
        rules={[{ required: true, message: `请为${criterion.name}评分!` }]}
      >
        <InputNumber 
          min={0} 
          max={100} 
          step={1}
          addonAfter="分" 
          style={{ width: '100%' }} 
          onChange={(value) => {
            // 实时计算总分
            const formValues = form.getFieldsValue();
            let totalScore = 0;
            
            typeStandard.criteria.forEach(c => {
              const score = formValues[`criterion_${c.id}`] || 0;
              totalScore += score * c.weight;
            });
            
            form.setFieldsValue({ score: Math.round(totalScore * 100) / 100 });
          }}
        />
      </Form.Item>
    ));
  };

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/admin/performance"><ArrowLeftOutlined /> 工作业绩管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>业绩审核与评分</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>业绩审核与评分</Title>
      <Text type="secondary" className="block mb-6">审核教师/科研人员上传的工作业绩，进行评分和评语</Text>

      <Card>
        {/* 搜索和操作工具栏 */}
        <div className="flex justify-between mb-4">
          <Space>
            <Input.Search 
              placeholder="搜索业绩标题" 
              onSearch={(value) => console.log(value)} 
              style={{ width: 250 }}
            />
            <Button 
              icon={<FilterOutlined />} 
              onClick={() => setIsFilterDrawerVisible(true)}
            >
              高级筛选
            </Button>
          </Space>
        </div>

        {/* 标签页 */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
          <TabPane tab={`待审核 (${performanceRecords.filter(r => r.status === 'pending').length})`} key="pending" />
          <TabPane tab={`已通过 (${performanceRecords.filter(r => r.status === 'approved').length})`} key="approved" />
          <TabPane tab={`已驳回 (${performanceRecords.filter(r => r.status === 'rejected').length})`} key="rejected" />
          <TabPane tab="全部" key="all" />
        </Tabs>

        {/* 数据表格 */}
        <Table 
          columns={columns} 
          dataSource={getFilteredRecords()}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 审核评分模态框 */}
      <Modal
        title="业绩审核与评分"
        open={isReviewModalVisible}
        onCancel={() => setIsReviewModalVisible(false)}
        footer={null}
        width={700}
      >
        {selectedRecord && (
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSubmitReview}
          >
            <div className="mb-4">
              <Text strong>业绩标题：</Text> {selectedRecord.title}
            </div>
            <div className="mb-4">
              <Text strong>提交人：</Text> {selectedRecord.userName} ({selectedRecord.department} - {selectedRecord.position})
            </div>
            <div className="mb-4">
              <Text strong>业绩类型：</Text> {selectedRecord.typeName}
            </div>
            <div className="mb-4">
              <Text strong>提交时间：</Text> {selectedRecord.submitTime}
            </div>
            <div className="mb-4">
              <Text strong>业绩描述：</Text>
              <Paragraph>{selectedRecord.description}</Paragraph>
            </div>

            <Divider>评分标准</Divider>

            {renderScoreCriteriaItems()}

            <Form.Item label="总评分" name="score">
              <InputNumber 
                min={0} 
                max={100} 
                step={0.1}
                addonAfter="分" 
                style={{ width: '100%' }} 
                disabled
              />
            </Form.Item>

            <Form.Item label="审核结果" name="status" rules={[{ required: true, message: '请选择审核结果!' }]}>
              <Select placeholder="请选择审核结果">
                <Option value="approved">通过</Option>
                <Option value="rejected">驳回</Option>
              </Select>
            </Form.Item>

            <Form.Item label="评语" name="comment" rules={[{ required: true, message: '请输入评语!' }]}>
              <TextArea rows={4} placeholder="请输入评语" />
            </Form.Item>

            <Form.Item className="mb-0 text-right">
              <Space>
                <Button onClick={() => setIsReviewModalVisible(false)}>取消</Button>
                <Button type="primary" htmlType="submit">提交审核</Button>
              </Space>
            </Form.Item>
          </Form>
        )}
      </Modal>

      {/* 详情抽屉 */}
      <Drawer
        title="业绩详情"
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
        width={700}
        extra={
          selectedRecord && selectedRecord.status === 'pending' && (
            <Button type="primary" onClick={() => {
              setIsDetailDrawerVisible(false);
              handleReview(selectedRecord);
            }}>
              审核评分
            </Button>
          )
        }
      >
        {selectedRecord && (
          <>
            <Card className="mb-4">
              <Title level={4}>{selectedRecord.title}</Title>
              <div className="mb-2">
                <Space>
                  <Tag color="blue">{selectedRecord.typeName}</Tag>
                  {selectedRecord.status === 'pending' && <Tag color="gold">待审核</Tag>}
                  {selectedRecord.status === 'approved' && <Tag color="green">已通过</Tag>}
                  {selectedRecord.status === 'rejected' && <Tag color="red">已驳回</Tag>}
                </Space>
              </div>
              <div className="mb-2">
                <Text type="secondary">提交人：{selectedRecord.userName} ({selectedRecord.department} - {selectedRecord.position})</Text>
              </div>
              <div className="mb-2">
                <Text type="secondary">提交时间：{selectedRecord.submitTime}</Text>
              </div>
              {selectedRecord.reviewTime && (
                <div className="mb-2">
                  <Text type="secondary">审核时间：{selectedRecord.reviewTime}</Text>
                </div>
              )}
              {selectedRecord.score && (
                <div className="mb-2">
                  <Text strong>评分：{selectedRecord.score}分</Text>
                </div>
              )}
              <Divider />
              <Title level={5}>业绩描述</Title>
              <Paragraph>{selectedRecord.description}</Paragraph>
            </Card>

            {selectedRecord.attachments && selectedRecord.attachments.length > 0 && (
              <Card title="附件" className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedRecord.attachments.map(attachment => (
                    <Card key={attachment.id} size="small" hoverable onClick={() => handleViewAttachment(attachment)}>
                      <div className="flex items-center">
                        <div className="mr-3">
                          {attachment.type.includes('image') ? (
                            <FileTextOutlined style={{ fontSize: '24px', color: '#1677ff' }} />
                          ) : attachment.type.includes('pdf') ? (
                            <FileTextOutlined style={{ fontSize: '24px', color: '#f5222d' }} />
                          ) : attachment.type.includes('word') ? (
                            <FileTextOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                          ) : attachment.type.includes('sheet') ? (
                            <FileTextOutlined style={{ fontSize: '24px', color: '#52c41a' }} />
                          ) : (
                            <FileTextOutlined style={{ fontSize: '24px', color: '#faad14' }} />
                          )}
                        </div>
                        <div>
                          <div>{attachment.name}</div>
                          <div className="text-xs text-gray-500">{(attachment.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </Card>
            )}

            {selectedRecord.comment && (
              <Card title="评语" className="mb-4">
                <Paragraph>{selectedRecord.comment}</Paragraph>
              </Card>
            )}

            {selectedRecord.auditLogs && selectedRecord.auditLogs.length > 0 && (
              <Card title="审核日志">
                <div className="space-y-4">
                  {selectedRecord.auditLogs.map(log => (
                    <div key={log.id} className="border-b pb-3">
                      <div className="flex justify-between mb-1">
                        <Text strong>{log.action}</Text>
                        <Text type="secondary">{log.time}</Text>
                      </div>
                      <div className="mb-1">
                        <Text type="secondary">操作人：{log.operator}</Text>
                      </div>
                      <div>
                        <Text>{log.content}</Text>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </>
        )}
      </Drawer>

      {/* 附件查看模态框 */}
      <Modal
        title={selectedAttachment?.name}
        open={isAttachmentModalVisible}
        onCancel={() => setIsAttachmentModalVisible(false)}
        footer={[
          <Button key="download" type="primary" icon={<DownloadOutlined />}>
            下载附件
          </Button>
        ]}
        width={800}
      >
        {selectedAttachment && (
          <div className="text-center">
            {selectedAttachment.type.includes('image') ? (
              <img 
                src={selectedAttachment.url} 
                alt={selectedAttachment.name} 
                style={{ maxWidth: '100%', maxHeight: '500px' }} 
              />
            ) : (
              <div className="p-10 bg-gray-100 rounded-lg">
                <FileTextOutlined style={{ fontSize: '64px', color: '#1677ff' }} />
                <p className="mt-4">此文件类型不支持预览，请下载后查看</p>
                <p className="text-gray-500">{selectedAttachment.name} ({(selectedAttachment.size / 1024 / 1024).toFixed(2)} MB)</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* 高级筛选抽屉 */}
      <Drawer
        title="高级筛选"
        placement="right"
        onClose={() => setIsFilterDrawerVisible(false)}
        open={isFilterDrawerVisible}
        width={500}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => form.resetFields()}>重置</Button>
              <Button type="primary" onClick={() => form.submit()}>应用筛选</Button>
            </Space>
          </div>
        }
      >
        <Form
          layout="vertical"
          onFinish={handleSearch}
        >
          <Form.Item name="title" label="业绩标题">
            <Input placeholder="请输入业绩标题" />
          </Form.Item>
          
          <Form.Item name="userName" label="提交人">
            <Input placeholder="请输入提交人姓名" />
          </Form.Item>
          
          <Form.Item name="department" label="部门">
            <Select placeholder="请选择部门" allowClear>
              <Option value="中医学院">中医学院</Option>
              <Option value="药学院">药学院</Option>
              <Option value="护理学院">护理学院</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="typeId" label="业绩类型">
            <Select placeholder="请选择业绩类型" allowClear>
              {mockPerformanceTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item name="dateRange" label="提交日期范围">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="status" label="状态">
            <Select placeholder="请选择状态" allowClear>
              <Option value="pending">待审核</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已驳回</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="scoreRange" label="评分范围">
            <Input.Group compact>
              <InputNumber 
                style={{ width: '45%' }} 
                placeholder="最低分" 
                min={0} 
                max={100}
              />
              <Input 
                style={{ width: '10%', textAlign: 'center', pointerEvents: 'none' }} 
                placeholder="~" 
                disabled 
              />
              <InputNumber 
                style={{ width: '45%' }} 
                placeholder="最高分" 
                min={0} 
                max={100}
              />
            </Input.Group>
          </Form.Item>
          
          <Form.Item name="hasAttachments" label="附件">
            <Select placeholder="请选择" allowClear>
              <Option value="true">有附件</Option>
              <Option value="false">无附件</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}