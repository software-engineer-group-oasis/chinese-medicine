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
// 导入模拟数据
import { 
  mockPerformanceRecords, 
  mockPerformanceTypes,
  mockScoreStandards,
  PerformanceStatus
} from '@/mock/performance';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 状态标签渲染
const statusTagMap = {
  [PerformanceStatus.Pending]: <Tag icon={<ClockCircleOutlined />} color="warning">待审核</Tag>,
  [PerformanceStatus.Approved]: <Tag icon={<CheckCircleOutlined />} color="success">已通过</Tag>,
  [PerformanceStatus.Rejected]: <Tag icon={<CloseCircleOutlined />} color="error">未通过</Tag>
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
  // 状态管理
  const [form] = Form.useForm();
  const [searchParams, setSearchParams] = useState({});
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [submitModalVisible, setSubmitModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [attachmentModalVisible, setAttachmentModalVisible] = useState(false);
  const [currentAttachment, setCurrentAttachment] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [fileList, setFileList] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [confirmDeleteVisible, setConfirmDeleteVisible] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<any>(null);

  // 获取当前用户的业绩记录
  // 在实际应用中，这里应该根据当前登录用户ID过滤
  const getCurrentUserRecords = () => {
    // 模拟当前用户ID为1
    const currentUserId = 1;
    return mockPerformanceRecords.filter(record => record.submitterId === currentUserId);
  };

  // 根据状态过滤记录
  const getFilteredRecords = () => {
    const records = getCurrentUserRecords();
    
    if (activeTab === 'all') {
      return records;
    }
    
    return records.filter(record => {
      if (activeTab === 'pending') return record.status === PerformanceStatus.Pending;
      if (activeTab === 'approved') return record.status === PerformanceStatus.Approved;
      if (activeTab === 'rejected') return record.status === PerformanceStatus.Rejected;
      return true;
    });
  };

  // 获取业绩统计数据
  const getPerformanceStats = () => {
    const records = getCurrentUserRecords();
    
    return {
      total: records.length,
      pending: records.filter(r => r.status === PerformanceStatus.Pending).length,
      approved: records.filter(r => r.status === PerformanceStatus.Approved).length,
      rejected: records.filter(r => r.status === PerformanceStatus.Rejected).length,
      averageScore: records.filter(r => r.status === PerformanceStatus.Approved)
        .reduce((sum, r) => sum + r.finalScore, 0) / 
        (records.filter(r => r.status === PerformanceStatus.Approved).length || 1)
    };
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    setSearchParams(values);
  };

  // 处理查看详情
  const handleViewDetail = (record: any) => {
    setSelectedRecord(record);
    setDetailVisible(true);
  };

  // 处理编辑
  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      title: record.title,
      type: record.type,
      description: record.description,
      date: record.date ? new Date(record.date) : null,
      // 其他字段...
    });
    setEditModalVisible(true);
  };

  // 处理删除
  const handleDelete = (record: any) => {
    setRecordToDelete(record);
    setConfirmDeleteVisible(true);
  };

  // 确认删除
  const confirmDelete = () => {
    // 在实际应用中，这里应该调用API删除记录
    message.success('删除成功');
    setConfirmDeleteVisible(false);
  };

  // 处理查看附件
  const handleViewAttachment = (attachment: any) => {
    setCurrentAttachment(attachment);
    setAttachmentModalVisible(true);
  };

  // 处理提交新业绩
  const handleSubmit = (values: any) => {
    // 在实际应用中，这里应该调用API提交业绩
    console.log('提交业绩:', values, fileList);
    setSubmitModalVisible(false);
    setCurrentStep(0);
    setFileList([]);
    form.resetFields();
    message.success('业绩提交成功，等待审核');
  };

  // 处理文件上传变化
  const handleFileChange = ({ fileList }: any) => {
    setFileList(fileList);
  };

  // 处理下一步
  const handleNextStep = () => {
    form.validateFields().then(() => {
      setCurrentStep(currentStep + 1);
    }).catch(err => {
      console.log('表单验证失败:', err);
    });
  };

  // 处理上一步
  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  // 获取业绩类型名称
  const getTypeName = (typeId: string) => {
    const type = mockPerformanceTypes.find(t => t.id === typeId);
    return type ? type.name : '未知类型';
  };

  // 表格列定义
  const columns = [
    {
      title: '业绩标题',
      dataIndex: 'title',
      key: 'title',
      render: (text: string, record: any) => (
        <a onClick={() => handleViewDetail(record)}>{text}</a>
      )
    },
    {
      title: '业绩类型',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => getTypeName(type)
    },
    {
      title: '提交日期',
      dataIndex: 'submissionTime',
      key: 'submissionTime',
      render: (time: string) => new Date(time).toLocaleDateString()
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: PerformanceStatus) => statusTagMap[status]
    },
    {
      title: '评分',
      dataIndex: 'finalScore',
      key: 'finalScore',
      render: (score: number, record: any) => {
        if (record.status === PerformanceStatus.Approved) {
          return <span>{score}</span>;
        }
        return '-';
      }
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: any) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record)} 
            />
          </Tooltip>
          {record.status === PerformanceStatus.Pending && (
            <Tooltip title="编辑">
              <Button 
                type="text" 
                icon={<EditOutlined />} 
                onClick={() => handleEdit(record)} 
              />
            </Tooltip>
          )}
          {record.status === PerformanceStatus.Pending && (
            <Tooltip title="删除">
              <Button 
                type="text" 
                danger 
                icon={<DeleteOutlined />} 
                onClick={() => handleDelete(record)} 
              />
            </Tooltip>
          )}
          {record.attachments && record.attachments.length > 0 && (
            <Tooltip title="查看附件">
              <Button 
                type="text" 
                icon={<FileTextOutlined />} 
                onClick={() => {
                  setSelectedRecord(record);
                  setAttachmentModalVisible(true);
                }} 
              />
            </Tooltip>
          )}
        </Space>
      )
    }
  ];

  // 业绩类型分布图表配置
  const typeDistributionOption = {
    title: {
      text: '业绩类型分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: mockPerformanceTypes.map(type => type.name)
    },
    series: [
      {
        name: '业绩类型',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: mockPerformanceTypes.map(type => ({
          name: type.name,
          value: getCurrentUserRecords().filter(r => r.type === type.id).length
        }))
      }
    ]
  };

  // 业绩状态分布图表配置
  const statusDistributionOption = {
    title: {
      text: '业绩状态分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: ['待审核', '已通过', '未通过']
    },
    series: [
      {
        name: '业绩状态',
        type: 'pie',
        radius: ['50%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        data: [
          { name: '待审核', value: getPerformanceStats().pending },
          { name: '已通过', value: getPerformanceStats().approved },
          { name: '未通过', value: getPerformanceStats().rejected }
        ],
        color: ['#faad14', '#52c41a', '#f5222d']
      }
    ]
  };

  // 月度业绩提交趋势图表配置
  const monthlySubmissionOption = {
    title: {
      text: '月度业绩提交趋势',
      left: 'center'
    },
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '提交数量',
        type: 'line',
        stack: '总量',
        data: [2, 1, 3, 4, 2, 5, 3, 2, 4, 5, 3, 6],
        areaStyle: {},
        color: '#1677ff'
      }
    ]
  };

  // 获取表单步骤内容
  const getStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div>
            <Form.Item
              name="title"
              label="业绩标题"
              rules={[{ required: true, message: '请输入业绩标题' }]}
            >
              <Input placeholder="请输入业绩标题" />
            </Form.Item>
            
            <Form.Item
              name="type"
              label="业绩类型"
              rules={[{ required: true, message: '请选择业绩类型' }]}
            >
              <Select placeholder="请选择业绩类型">
                {mockPerformanceTypes.map(type => (
                  <Option key={type.id} value={type.id}>{type.name}</Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="date"
              label="业绩日期"
              rules={[{ required: true, message: '请选择业绩日期' }]}
            >
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item
              name="description"
              label="业绩描述"
              rules={[{ required: true, message: '请输入业绩描述' }]}
            >
              <Input.TextArea rows={4} placeholder="请详细描述您的业绩内容" />
            </Form.Item>
          </div>
        );
      case 1:
        return (
          <div>
            <Form.Item
              name="standard"
              label="评分标准"
              rules={[{ required: true, message: '请选择评分标准' }]}
            >
              <Select placeholder="请选择适用的评分标准">
                {mockScoreStandards.map(standard => (
                  <Option key={standard.id} value={standard.id}>
                    {standard.name} (v{standard.version})
                  </Option>
                ))}
              </Select>
            </Form.Item>
            
            <Form.Item
              name="selfEvaluation"
              label="自评说明"
              rules={[{ required: true, message: '请输入自评说明' }]}
            >
              <Input.TextArea rows={4} placeholder="请对照评分标准进行自评说明" />
            </Form.Item>
            
            <Form.Item
              name="expectedScore"
              label="预期分数"
              rules={[{ required: true, message: '请输入预期分数' }]}
            >
              <Input type="number" min={0} max={100} placeholder="请输入您预期的分数" />
            </Form.Item>
          </div>
        );
      case 2:
        return (
          <div>
            <Form.Item
              name="attachments"
              label="业绩附件"
              rules={[{ required: true, message: '请上传业绩附件' }]}
            >
              <Upload
                fileList={fileList}
                onChange={handleFileChange}
                beforeUpload={() => false}
                multiple
              >
                <Button icon={<UploadOutlined />}>上传附件</Button>
                <Text type="secondary" className="ml-4">
                  支持PDF、Word、Excel、图片等格式文件
                </Text>
              </Upload>
            </Form.Item>
            
            <Form.Item
              name="attachmentDescription"
              label="附件说明"
            >
              <Input.TextArea rows={3} placeholder="请简要说明上传附件的内容" />
            </Form.Item>
          </div>
        );
      case 3:
        return (
          <div>
            <Paragraph>
              <Text strong>请确认以下信息无误：</Text>
            </Paragraph>
            
            <Card className="mb-4" size="small">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text type="secondary">业绩标题：</Text>
                  <Text strong>{form.getFieldValue('title')}</Text>
                </div>
                <div>
                  <Text type="secondary">业绩类型：</Text>
                  <Text strong>
                    {getTypeName(form.getFieldValue('type'))}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">业绩日期：</Text>
                  <Text strong>
                    {form.getFieldValue('date')?.format('YYYY-MM-DD')}
                  </Text>
                </div>
                <div>
                  <Text type="secondary">预期分数：</Text>
                  <Text strong>{form.getFieldValue('expectedScore')}</Text>
                </div>
              </div>
              
              <Divider style={{ margin: '12px 0' }} />
              
              <div>
                <Text type="secondary">业绩描述：</Text>
                <Paragraph>{form.getFieldValue('description')}</Paragraph>
              </div>
              
              <div>
                <Text type="secondary">自评说明：</Text>
                <Paragraph>{form.getFieldValue('selfEvaluation')}</Paragraph>
              </div>
              
              <div>
                <Text type="secondary">附件：</Text>
                <ul className="list-disc pl-5">
                  {fileList.map((file, index) => (
                    <li key={index}>{file.name}</li>
                  ))}
                </ul>
              </div>
            </Card>
            
            <Form.Item
              name="comments"
              label="备注"
            >
              <Input.TextArea rows={3} placeholder="其他需要说明的事项（选填）" />
            </Form.Item>
          </div>
        );
      default:
        return null;
    }
  };

  // 获取业绩详情内容
  const getRecordDetailContent = () => {
    if (!selectedRecord) return null;
    
    return (
      <div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Text type="secondary">业绩标题：</Text>
            <Text strong>{selectedRecord.title}</Text>
          </div>
          <div>
            <Text type="secondary">业绩类型：</Text>
            <Text strong>{getTypeName(selectedRecord.type)}</Text>
          </div>
          <div>
            <Text type="secondary">提交日期：</Text>
            <Text strong>{new Date(selectedRecord.submissionTime).toLocaleDateString()}</Text>
          </div>
          <div>
            <Text type="secondary">状态：</Text>
            {statusTagMap[selectedRecord.status]}
          </div>
          {selectedRecord.status === PerformanceStatus.Approved && (
            <div>
              <Text type="secondary">最终评分：</Text>
              <Text strong>{selectedRecord.finalScore}</Text>
            </div>
          )}
          {selectedRecord.reviewTime && (
            <div>
              <Text type="secondary">审核日期：</Text>
              <Text strong>{new Date(selectedRecord.reviewTime).toLocaleDateString()}</Text>
            </div>
          )}
        </div>
        
        <Divider orientation="left">业绩详情</Divider>
        
        <Paragraph>
          <Text type="secondary">业绩描述：</Text>
          <Paragraph>{selectedRecord.description}</Paragraph>
        </Paragraph>
        
        <Paragraph>
          <Text type="secondary">自评说明：</Text>
          <Paragraph>{selectedRecord.selfEvaluation}</Paragraph>
        </Paragraph>
        
        {selectedRecord.status !== PerformanceStatus.Pending && (
          <Paragraph>
            <Text type="secondary">审核评语：</Text>
            <Paragraph>{selectedRecord.reviewComments}</Paragraph>
          </Paragraph>
        )}
        
        <Divider orientation="left">附件材料</Divider>
        
        {selectedRecord.attachments && selectedRecord.attachments.length > 0 ? (
          <ul className="list-disc pl-5">
            {selectedRecord.attachments.map((attachment: any, index: number) => {
              const fileExt = attachment.name.split('.').pop().toLowerCase();
              const icon = fileIconMap[fileExt] || <FileTextOutlined />;
              
              return (
                <li key={index} className="mb-2">
                  <Space>
                    {icon}
                    <a onClick={() => handleViewAttachment(attachment)}>
                      {attachment.name}
                    </a>
                    <Button 
                      type="text" 
                      size="small" 
                      icon={<DownloadOutlined />}
                      onClick={() => {
                        // 在实际应用中，这里应该调用API下载附件
                        message.success(`开始下载 ${attachment.name}`);
                      }}
                    >
                      下载
                    </Button>
                  </Space>
                </li>
              );
            })}
          </ul>
        ) : (
          <Empty description="暂无附件" />
        )}
        
        {selectedRecord.auditLogs && selectedRecord.auditLogs.length > 0 && (
          <>
            <Divider orientation="left">审核日志</Divider>
            
            <Timeline>
              {selectedRecord.auditLogs.map((log: any, index: number) => {
                let color = 'blue';
                let icon = <InfoCircleOutlined />;
                
                if (log.action === 'approve') {
                  color = 'green';
                  icon = <CheckCircleOutlined />;
                } else if (log.action === 'reject') {
                  color = 'red';
                  icon = <CloseCircleOutlined />;
                }
                
                return (
                  <Timeline.Item key={index} color={color} dot={icon}>
                    <p>
                      <Text strong>{log.auditorName}</Text>
                      <Text type="secondary" className="ml-2">
                        {new Date(log.time).toLocaleString()}
                      </Text>
                    </p>
                    <p>{log.comments}</p>
                  </Timeline.Item>
                );
              })}
            </Timeline>
          </>
        )}
      </div>
    );
  };

  const stats = getPerformanceStats();

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/admin/performance"><ArrowLeftOutlined /> 工作业绩管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>个人业绩</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>个人业绩</Title>
      <Text type="secondary" className="block mb-6">管理和查看您提交的工作业绩记录</Text>

      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <Statistic 
            title="总业绩数" 
            value={stats.total} 
            suffix="条"
          />
        </Card>
        <Card>
          <Statistic 
            title="待审核" 
            value={stats.pending} 
            suffix="条"
            valueStyle={{ color: '#faad14' }}
          />
        </Card>
        <Card>
          <Statistic 
            title="已通过" 
            value={stats.approved} 
            suffix="条"
            valueStyle={{ color: '#52c41a' }}
          />
        </Card>
        <Card>
          <Statistic 
            title="平均得分" 
            value={Math.round(stats.averageScore * 10) / 10} 
            suffix="分"
            valueStyle={{ color: '#1677ff' }}
          />
        </Card>
      </div>

      {/* 图表分析 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <ReactECharts option={typeDistributionOption} style={{ height: 300 }} />
        </Card>
        <Card>
          <ReactECharts option={statusDistributionOption} style={{ height: 300 }} />
        </Card>
        <Card>
          <ReactECharts option={monthlySubmissionOption} style={{ height: 300 }} />
        </Card>
      </div>

      {/* 业绩列表 */}
      <Card 
        title="业绩记录" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setCurrentStep(0);
              setFileList([]);
              setSubmitModalVisible(true);
            }}
          >
            提交新业绩
          </Button>
        }
      >
        {/* 搜索栏 */}
        <div className="mb-4">
          <Form layout="inline" onFinish={handleSearch}>
            <Form.Item name="keyword">
              <Input 
                placeholder="搜索业绩标题" 
                prefix={<SearchOutlined />} 
                style={{ width: 250 }}
              />
            </Form.Item>
            <Form.Item name="type">
              <Select 
                placeholder="业绩类型" 
                style={{ width: 150 }}
                allowClear
              >
                {mockPerformanceTypes.map(type => (
                  <Option key={type.id} value={type.id}>{type.name}</Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="dateRange">
              <RangePicker style={{ width: 250 }} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                搜索
              </Button>
            </Form.Item>
          </Form>
        </div>

        {/* 标签页 */}
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="全部" key="all" />
          <TabPane 
            tab={
              <span>
                待审核
                <Tag color="orange" className="ml-1">{stats.pending}</Tag>
              </span>
            } 
            key="pending" 
          />
          <TabPane 
            tab={
              <span>
                已通过
                <Tag color="green" className="ml-1">{stats.approved}</Tag>
              </span>
            } 
            key="approved" 
          />
          <TabPane 
            tab={
              <span>
                未通过
                <Tag color="red" className="ml-1">{stats.rejected}</Tag>
              </span>
            } 
            key="rejected" 
          />
        </Tabs>

        {/* 业绩表格 */}
        <Table 
          columns={columns} 
          dataSource={getFilteredRecords()} 
          rowKey="id"
          pagination={{
            pageSize: 10,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 提交新业绩模态框 */}
      <Modal
        title="提交新业绩"
        open={submitModalVisible}
        width={700}
        footer={null}
        onCancel={() => setSubmitModalVisible(false)}
      >
        <Steps current={currentStep} className="mb-6">
          <Steps.Step title="基本信息" />
          <Steps.Step title="评分标准" />
          <Steps.Step title="上传附件" />
          <Steps.Step title="确认提交" />
        </Steps>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          {getStepContent()}
          
          <div className="flex justify-between mt-4">
            {currentStep > 0 && (
              <Button onClick={handlePrevStep}>
                上一步
              </Button>
            )}
            <div className="ml-auto">
              <Button 
                onClick={() => setSubmitModalVisible(false)} 
                className="mr-2"
              >
                取消
              </Button>
              {currentStep < 3 ? (
                <Button type="primary" onClick={handleNextStep}>
                  下一步
                </Button>
              ) : (
                <Button type="primary" htmlType="submit">
                  提交
                </Button>
              )}
            </div>
          </div>
        </Form>
      </Modal>

      {/* 编辑业绩模态框 */}
      <Modal
        title="编辑业绩"
        open={editModalVisible}
        onOk={() => {
          form.validateFields().then(values => {
            // 在实际应用中，这里应该调用API更新业绩
            console.log('更新业绩:', values);
            setEditModalVisible(false);
            message.success('业绩更新成功');
          });
        }}
        onCancel={() => setEditModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="title"
            label="业绩标题"
            rules={[{ required: true, message: '请输入业绩标题' }]}
          >
            <Input placeholder="请输入业绩标题" />
          </Form.Item>
          
          <Form.Item
            name="type"
            label="业绩类型"
            rules={[{ required: true, message: '请选择业绩类型' }]}
          >
            <Select placeholder="请选择业绩类型">
              {mockPerformanceTypes.map(type => (
                <Option key={type.id} value={type.id}>{type.name}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Form.Item
            name="description"
            label="业绩描述"
            rules={[{ required: true, message: '请输入业绩描述' }]}
          >
            <Input.TextArea rows={4} placeholder="请详细描述您的业绩内容" />
          </Form.Item>
        </Form>
      </Modal>

      {/* 业绩详情抽屉 */}
      <Drawer
        title="业绩详情"
        width={600}
        open={detailVisible}
        onClose={() => setDetailVisible(false)}
        extra={
          selectedRecord && selectedRecord.status === PerformanceStatus.Pending ? (
            <Space>
              <Button 
                type="primary" 
                onClick={() => {
                  setDetailVisible(false);
                  handleEdit(selectedRecord);
                }}
              >
                编辑
              </Button>
            </Space>
          ) : null
        }
      >
        {getRecordDetailContent()}
      </Drawer>

      {/* 附件查看模态框 */}
      <Modal
        title="附件列表"
        open={attachmentModalVisible}
        footer={null}
        onCancel={() => setAttachmentModalVisible(false)}
      >
        {selectedRecord && selectedRecord.attachments && (
          <ul className="list-disc pl-5">
            {selectedRecord.attachments.map((attachment: any, index: number) => {
              const fileExt = attachment.name.split('.').pop().toLowerCase();
              const icon = fileIconMap[fileExt] || <FileTextOutlined />;
              
              return (
                <li key={index} className="mb-3">
                  <Space>
                    {icon}
                    <Text>{attachment.name}</Text>
                    <Button 
                      type="primary" 
                      size="small" 
                      onClick={() => {
                        // 在实际应用中，这里应该调用API预览附件
                        setCurrentAttachment(attachment);
                      }}
                    >
                      预览
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => {
                        // 在实际应用中，这里应该调用API下载附件
                        message.success(`开始下载 ${attachment.name}`);
                      }}
                    >
                      下载
                    </Button>
                  </Space>
                </li>
              );
            })}
          </ul>
        )}
        
        {currentAttachment && (
          <div className="mt-4">
            <Divider>附件预览</Divider>
            <div className="text-center">
              {/* 在实际应用中，这里应该根据附件类型显示不同的预览内容 */}
              <Empty description="附件预览功能开发中" />
            </div>
          </div>
        )}
      </Modal>

      {/* 确认删除模态框 */}
      <Modal
        title="确认删除"
        open={confirmDeleteVisible}
        onOk={confirmDelete}
        onCancel={() => setConfirmDeleteVisible(false)}
      >
        <p>确定要删除业绩 "{recordToDelete?.title}" 吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
}
// // 消息提示组件
// const message = {
//   success: (content: string) => {
//     // 在实际应用中，这里应该使用Ant Design的message组件
//     console.log('成功:', content);
//   },
//   error: (content: string) => {
//     // 在实际应用中，这里应该使用Ant Design的message组件
//     console.log('错误:', content);
//   }
// };
