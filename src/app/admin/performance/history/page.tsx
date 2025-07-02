// 审核历史页面
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
import Timeline from 'antd/es/timeline';
import Drawer from 'antd/es/drawer';
import Form from 'antd/es/form';
import message from 'antd/es/message';
import { 
  ArrowLeftOutlined, SearchOutlined, FilterOutlined, 
  HistoryOutlined, EyeOutlined, UserOutlined,
  ClockCircleOutlined, CheckCircleOutlined, CloseCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
// 导入模拟数据
import { 
  mockPerformanceRecords, 
  PerformanceRecord
} from '@/mock/performance';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { RangePicker } = DatePicker;

// 审核日志类型
interface AuditLog {
  id: string;
  performanceId: string;
  performanceTitle: string;
  userName: string;
  department: string;
  typeName: string;
  time: string;
  operator: string;
  action: string;
  content: string;
  status: 'approved' | 'rejected' | 'pending';
}

export default function PerformanceHistoryPage() {
  // 从业绩记录中提取所有审核日志
  const extractAuditLogs = (): AuditLog[] => {
    const logs: AuditLog[] = [];
    
    mockPerformanceRecords.forEach(record => {
      if (record.auditLogs && record.auditLogs.length > 0) {
        record.auditLogs.forEach(log => {
          logs.push({
            id: log.id,
            performanceId: record.id,
            performanceTitle: record.title,
            userName: record.userName,
            department: record.department,
            typeName: record.typeName,
            time: log.time,
            operator: log.operator,
            action: log.action,
            content: log.content,
            status: log.action.includes('通过') ? 'approved' : 'rejected'
          });
        });
      }
    });
    
    // 按时间降序排序
    return logs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());
  };

  // 状态管理
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(extractAuditLogs());
  const [selectedRecord, setSelectedRecord] = useState<PerformanceRecord | null>(null);
  const [isDetailDrawerVisible, setIsDetailDrawerVisible] = useState(false);
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({});

  // 处理查看详情
  const handleViewDetail = (performanceId: string) => {
    const record = mockPerformanceRecords.find(r => r.id === performanceId);
    if (record) {
      setSelectedRecord(record);
      setIsDetailDrawerVisible(true);
    }
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    setSearchParams(values);
    setIsFilterDrawerVisible(false);
    // 这里可以添加API调用，根据搜索条件获取审核日志
    message.success('搜索条件已应用');
  };

  // 表格列定义
  const columns = [
    {
      title: '业绩标题',
      dataIndex: 'performanceTitle',
      key: 'performanceTitle',
      render: (text: string, record: AuditLog) => (
        <a onClick={() => handleViewDetail(record.performanceId)}>{text}</a>
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
      title: '审核时间',
      dataIndex: 'time',
      key: 'time',
      sorter: (a: AuditLog, b: AuditLog) => 
        new Date(a.time).getTime() - new Date(b.time).getTime()
    },
    {
      title: '审核人',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: '审核结果',
      dataIndex: 'action',
      key: 'action',
      render: (text: string, record: AuditLog) => {
        const color = record.status === 'approved' ? 'green' : 'red';
        return <Tag color={color}>{text}</Tag>;
      }
    },
    {
      title: '操作',
      key: 'operation',
      render: (_: any, record: AuditLog) => (
        <Space size="small">
          <Tooltip title="查看详情">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => handleViewDetail(record.performanceId)} 
            />
          </Tooltip>
        </Space>
      )
    }
  ];

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/admin/performance"><ArrowLeftOutlined /> 工作业绩管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>审核历史</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>审核历史</Title>
      <Text type="secondary" className="block mb-6">查看所有业绩的审核历史记录</Text>

      <Card>
        {/* 搜索和操作工具栏 */}
        <div className="flex justify-between mb-4">
          <Space>
            <Input.Search 
              placeholder="搜索业绩标题或提交人" 
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

        {/* 数据表格 */}
        <Table 
          columns={columns} 
          dataSource={auditLogs}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      {/* 详情抽屉 */}
      <Drawer
        title="业绩审核详情"
        placement="right"
        onClose={() => setIsDetailDrawerVisible(false)}
        open={isDetailDrawerVisible}
        width={700}
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

            {selectedRecord.comment && (
              <Card title="评语" className="mb-4">
                <Paragraph>{selectedRecord.comment}</Paragraph>
              </Card>
            )}

            {selectedRecord.auditLogs && selectedRecord.auditLogs.length > 0 && (
              <Card title="审核日志">
                <Timeline mode="left">
                  {selectedRecord.auditLogs.map(log => (
                    <Timeline.Item 
                      key={log.id} 
                      color={log.action.includes('通过') ? 'green' : 'red'}
                      label={log.time}
                    >
                      <div className="mb-1">
                        <Text strong>{log.action}</Text>
                      </div>
                      <div className="mb-1">
                        <Text type="secondary">操作人：{log.operator}</Text>
                      </div>
                      <div>
                        <Text>{log.content}</Text>
                      </div>
                    </Timeline.Item>
                  ))}
                  <Timeline.Item 
                    color="blue" 
                    label={selectedRecord.submitTime}
                  >
                    <div className="mb-1">
                      <Text strong>提交业绩</Text>
                    </div>
                    <div>
                      <Text type="secondary">提交人：{selectedRecord.userName}</Text>
                    </div>
                  </Timeline.Item>
                </Timeline>
              </Card>
            )}
          </>
        )}
      </Drawer>

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
              <Button onClick={() => {}}>重置</Button>
              <Button type="primary" onClick={() => handleSearch({})}>应用筛选</Button>
            </Space>
          </div>
        }
      >
        <Form
          layout="vertical"
          onFinish={handleSearch}
        >
          <Form.Item name="performanceTitle" label="业绩标题">
            <Input placeholder="请输入业绩标题" />
          </Form.Item>
          
          <Form.Item name="userName" label="提交人">
            <Input placeholder="请输入提交人姓名" />
          </Form.Item>
          
          <Form.Item name="operator" label="审核人">
            <Input placeholder="请输入审核人姓名" />
          </Form.Item>
          
          <Form.Item name="department" label="部门">
            <Select placeholder="请选择部门" allowClear>
              <Option value="中医学院">中医学院</Option>
              <Option value="药学院">药学院</Option>
              <Option value="护理学院">护理学院</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="typeName" label="业绩类型">
            <Select placeholder="请选择业绩类型" allowClear>
              <Option value="教学成果">教学成果</Option>
              <Option value="科研成果">科研成果</Option>
              <Option value="学术贡献">学术贡献</Option>
              <Option value="社会服务">社会服务</Option>
            </Select>
          </Form.Item>
          
          <Form.Item name="dateRange" label="审核日期范围">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
          
          <Form.Item name="status" label="审核结果">
            <Select placeholder="请选择审核结果" allowClear>
              <Option value="approved">通过</Option>
              <Option value="rejected">驳回</Option>
            </Select>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
}