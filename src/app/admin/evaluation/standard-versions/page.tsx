// 评价标准版本控制页面
"use client"
import React, { useState } from 'react';
import type { FC } from 'react';
import Card from 'antd/es/card';
import Table from 'antd/es/table';
import type { ColumnsType } from 'antd/es/table';
import type { TableRowSelection } from 'antd/es/table/interface';
import Button from 'antd/es/button';
import Space from 'antd/es/space';
import Tag from 'antd/es/tag';
import Tooltip from 'antd/es/tooltip';
import Modal from 'antd/es/modal';
import Form from 'antd/es/form';
import useForm from 'antd/es/form/hooks/useForm';
import Input from 'antd/es/input';
import Select from 'antd/es/select';
import DatePicker from 'antd/es/date-picker';
import Typography from 'antd/es/typography';
import Timeline from 'antd/es/timeline';
import Tabs from 'antd/es/tabs';
import Badge from 'antd/es/badge';
import Popconfirm from 'antd/es/popconfirm';
import message from 'antd/es/message';
import Drawer from 'antd/es/drawer';
import List from 'antd/es/list';
import Breadcrumb from 'antd/es/breadcrumb';
import {
  ArrowLeftOutlined, PlusOutlined, EditOutlined,
  HistoryOutlined, CheckCircleOutlined, CloseCircleOutlined,
  ExclamationCircleOutlined, EyeOutlined, CompressOutlined,
  DiffOutlined, CopyOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import ReactEcharts from 'echarts-for-react';
import type { EChartsOption } from 'echarts';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

// 类型定义
interface StandardVersion {
  id: string;
  name: string;
  version: string;
  status: 'active' | 'archived' | 'draft';
  createdBy: string;
  createdAt: string;
  appliedCount: number;
  description: string;
}

interface VersionHistoryItem {
  id: string;
  version: string;
  date: string;
  author: string;
  changes: string[];
}

interface UsageRecord {
  id: string;
  standardName: string;
  version: string;
  appliedDate: string;
  appliedBy: string;
  herbName: string;
  evaluationResult: string;
}

const StandardVersionsPage: FC = () => {
  // 状态管理
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDrawerVisible, setIsDrawerVisible] = useState<boolean>(false);
  const [selectedVersion, setSelectedVersion] = useState<StandardVersion | null>(null);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [selectedVersions, setSelectedVersions] = useState<StandardVersion[]>([]);
  const [form] = useForm();

  // 模拟评价标准版本数据
  const [standardVersions, setStandardVersions] = useState<StandardVersion[]>(
    [
      {
        id: '1',
        name: '通用中药材评价标准',
        version: 'v3.0',
        status: 'active',
        createdBy: '张医师',
        createdAt: '2023-10-15',
        appliedCount: 56,
        description: '适用于大多数常见中药材的通用评价标准，包含外观、成分、来源等维度',
      },
      {
        id: '2',
        name: '通用中药材评价标准',
        version: 'v2.5',
        status: 'archived',
        createdBy: '李研究员',
        createdAt: '2023-06-22',
        appliedCount: 128,
        description: '通用评价标准的早期版本，已被v3.0取代',
      },
      {
        id: '3',
        name: '道地药材专用评价标准',
        version: 'v1.5',
        status: 'active',
        createdBy: '王主任',
        createdAt: '2023-08-10',
        appliedCount: 42,
        description: '专门针对道地药材特性设计的评价标准，强调产地特征',
      },
      {
        id: '4',
        name: '进口药材评价标准',
        version: 'v1.0',
        status: 'draft',
        createdBy: '赵博士',
        createdAt: '2023-11-05',
        appliedCount: 0,
        description: '针对进口药材的特殊评价标准，增加了原产地认证等维度',
      },
    ]
  );

  // 模拟版本变更历史
  const versionHistory: VersionHistoryItem[] = [
    {
      id: '1',
      version: 'v3.0',
      date: '2023-10-15',
      author: '张医师',
      changes: [
        '增加了药材有效成分含量的评价维度',
        '优化了外观评价的评分标准',
        '新增了储存条件评价项'
      ]
    },
    {
      id: '2',
      version: 'v2.5',
      date: '2023-06-22',
      author: '李研究员',
      changes: [
        '调整了各评价维度的权重分配',
        '完善了来源渠道的评价选项'
      ]
    },
    {
      id: '3',
      version: 'v2.0',
      date: '2023-01-10',
      author: '王主任',
      changes: [
        '首次引入多维度评价体系',
        '建立了基础的评分机制'
      ]
    },
  ];

  // 模拟使用记录数据
  const usageRecords: UsageRecord[] = [
    {
      id: '1',
      standardName: '通用中药材评价标准',
      version: 'v3.0',
      appliedDate: '2023-11-20',
      appliedBy: '张医师',
      herbName: '黄连',
      evaluationResult: '优秀'
    },
    {
      id: '2',
      standardName: '通用中药材评价标准',
      version: 'v3.0',
      appliedDate: '2023-11-18',
      appliedBy: '李研究员',
      herbName: '党参',
      evaluationResult: '良好'
    },
    {
      id: '3',
      standardName: '道地药材专用评价标准',
      version: 'v1.5',
      appliedDate: '2023-11-15',
      appliedBy: '王主任',
      herbName: '川芎',
      evaluationResult: '优秀'
    },
    {
      id: '4',
      standardName: '通用中药材评价标准',
      version: 'v2.5',
      appliedDate: '2023-10-25',
      appliedBy: '赵博士',
      herbName: '当归',
      evaluationResult: '合格'
    },
  ];

  // 处理新建/编辑标准
  const handleAddOrEdit = (record: StandardVersion | null = null) => {
    setSelectedVersion(record);
    if (record) {
      form.setFieldsValue({
        name: record.name,
        version: record.version,
        description: record.description,
        status: record.status,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  // 处理表单提交
  const handleFormSubmit = () => {
    form.validateFields().then((values: any) => {
      console.log('表单提交数据:', values);
      // 这里可以添加API调用，保存评价标准到后端
      if (selectedVersion) {
        message.success('评价标准已更新');
      } else {
        message.success('新评价标准已创建');
      }
      setIsModalVisible(false);
    }).catch((error: any) => {
      console.log('表单验证失败:', error);
    });
  };

  // 查看版本历史
  const handleViewHistory = (record: StandardVersion) => {
    setSelectedVersion(record);
    setIsDrawerVisible(true);
  };

  // 处理版本比较
  const handleCompare = () => {
    if (selectedVersions.length !== 2) {
      message.open({ type: 'warning', content: '请选择两个版本进行比较' });
      return;
    }
    message.info('版本比较功能正在开发中');
  };

  // 处理版本选择
  const handleVersionSelect = (record: StandardVersion, selected: boolean) => {
    if (selected) {
      if (selectedVersions.length < 2) {
        setSelectedVersions([...selectedVersions, record]);
      } else {
        message.open({ type: 'warning', content: '最多只能选择两个版本进行比较' });
      }
    } else {
      setSelectedVersions(selectedVersions.filter(v => v.id !== record.id));
    }
  };

  // 处理复制版本
  const handleCopyVersion = (record: StandardVersion) => {
    message.success(`已复制 ${record.name} ${record.version} 作为新版本的基础`);
  };

  // 处理激活/归档版本
  const handleStatusChange = (record: StandardVersion, newStatus: 'active' | 'archived') => {
    const statusText = newStatus === 'active' ? '激活' : '归档';
    message.success(`已${statusText} ${record.name} ${record.version}`);
  };

  // 版本使用趋势图表配置
  const usageTrendOption: EChartsOption = {
    title: {
      text: '评价标准使用趋势',
      left: 'center',
      textStyle: {
        fontSize: 14
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    legend: {
      data: ['v3.0', 'v2.5', 'v1.5'],
      bottom: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: ['6月', '7月', '8月', '9月', '10月', '11月']
    },
    yAxis: {
      type: 'value',
      name: '使用次数'
    },
    series: [
      {
        name: 'v3.0',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: [0, 0, 0, 12, 22, 22]
      },
      {
        name: 'v2.5',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: [18, 24, 32, 28, 18, 8]
      },
      {
        name: 'v1.5',
        type: 'bar',
        stack: 'total',
        emphasis: {
          focus: 'series'
        },
        data: [5, 8, 10, 12, 8, 7]
      }
    ]
  };

  // 表格列定义
  const columns: ColumnsType<StandardVersion> = [
    {
      title: '标准名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: StandardVersion) => (
        <Space>
          <Text strong>{text}</Text>
          <Tag color={record.status === 'active' ? 'green' : record.status === 'archived' ? 'default' : 'orange'}>
            {record.version}
          </Tag>
        </Space>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: StandardVersion['status']) => {
        let color = 'default';
        let text = '';
        if (status === 'active') {
          color = 'green';
          text = '激活';
        } else if (status === 'archived') {
          color = 'default';
          text = '归档';
        } else {
          color = 'orange';
          text = '草稿';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '创建者',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: '创建日期',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: '使用次数',
      dataIndex: 'appliedCount',
      key: 'appliedCount',
      sorter: (a: StandardVersion, b: StandardVersion) => a.appliedCount - b.appliedCount,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      render: (_: any, record: StandardVersion) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleAddOrEdit(record)}>
            编辑
          </Button>
          <Button type="link" icon={<HistoryOutlined />} onClick={() => handleViewHistory(record)}>
            历史
          </Button>
          <Button type="link" icon={<CopyOutlined />} onClick={() => handleCopyVersion(record)}>
            复制
          </Button>
          {record.status !== 'active' && (
            <Popconfirm
              title="确定要激活此版本吗?"
              onConfirm={() => handleStatusChange(record, 'active')}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" icon={<CheckCircleOutlined />}>激活</Button>
            </Popconfirm>
          )}
          {record.status === 'active' && (
            <Popconfirm
              title="确定要归档此版本吗?"
              onConfirm={() => handleStatusChange(record, 'archived')}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<CloseCircleOutlined />}>归档</Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  // rowSelection 类型
  const rowSelection: TableRowSelection<StandardVersion> | undefined = compareMode ? {
    type: 'checkbox',
    selectedRowKeys: selectedVersions.map(v => v.id),
    onChange: (_selectedRowKeys, selectedRows) => setSelectedVersions(selectedRows as StandardVersion[]),
    getCheckboxProps: (record: StandardVersion) => ({ disabled: false }),
  } : undefined;

  // 使用记录表格列定义
  const usageColumns: ColumnsType<UsageRecord> = [
    {
      title: '评价标准',
      dataIndex: 'standardName',
      key: 'standardName',
      render: (text: string, record: UsageRecord) => (
        <Space>
          <Text>{text}</Text>
          <Tag color="blue">{record.version}</Tag>
        </Space>
      ),
    },
    {
      title: '应用日期',
      dataIndex: 'appliedDate',
      key: 'appliedDate',
    },
    {
      title: '评价人员',
      dataIndex: 'appliedBy',
      key: 'appliedBy',
    },
    {
      title: '评价药材',
      dataIndex: 'herbName',
      key: 'herbName',
    },
    {
      title: '评价结果',
      dataIndex: 'evaluationResult',
      key: 'evaluationResult',
      render: (text: string) => {
        let color: string = 'default';
        switch (text) {
          case '优秀':
            color = 'green';
            break;
          case '良好':
            color = 'blue';
            break;
          case '合格':
            color = 'orange';
            break;
          case '不合格':
            color = 'red';
            break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Button type="link" icon={<EyeOutlined />}>查看详情</Button>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/evaluation"><ArrowLeftOutlined /> 中药评价与申报</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>评价标准版本控制</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>评价标准版本控制</Title>
      <Text type="secondary" className="block mb-6">配置不同版本的评价标准，并记录使用历史</Text>

      <Tabs defaultActiveKey="1">
        <TabPane tab="标准版本管理" key="1">
          <Card
            title="评价标准版本列表"
            extra={
              <Space>
                {compareMode ? (
                  <>
                    <Button
                      type="primary"
                      icon={<CompressOutlined />} // 修正 CompareOutlined 为 CompressOutlined
                      onClick={handleCompare}
                      disabled={selectedVersions.length !== 2}
                    >
                      比较所选版本
                    </Button>
                    <Button onClick={() => {
                      setCompareMode(false);
                      setSelectedVersions([]);
                    }}>
                      取消比较
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      icon={<DiffOutlined />}
                      onClick={() => setCompareMode(true)}
                    >
                      版本比较
                    </Button>
                    <Button
                      type="primary"
                      icon={<PlusOutlined />}
                      onClick={() => handleAddOrEdit()}
                    >
                      新建标准
                    </Button>
                  </>
                )}
              </Space>
            }
          >
            <Table
              dataSource={standardVersions}
              columns={columns}
              rowKey="id"
              rowSelection={rowSelection}
            />
          </Card>

          <Card title="版本使用趋势" className="mt-6">
            <ReactEcharts option={usageTrendOption} style={{ height: '400px' }} />
          </Card>
        </TabPane>

        <TabPane tab="使用记录" key="2">
          <Card title="评价标准使用记录">
            <div className="mb-4">
              <Space>
                <RangePicker placeholder={['开始日期', '结束日期']} />
                <Select placeholder="选择标准版本" style={{ width: 200 }}>
                  <Option value="all">全部版本</Option>
                  <Option value="v3.0">通用中药材评价标准 v3.0</Option>
                  <Option value="v2.5">通用中药材评价标准 v2.5</Option>
                  <Option value="v1.5">道地药材专用评价标准 v1.5</Option>
                </Select>
                <Button type="primary">查询</Button>
                <Button>重置</Button>
              </Space>
            </div>
            <Table
              dataSource={usageRecords}
              columns={usageColumns}
              rowKey="id"
            />
          </Card>
        </TabPane>
      </Tabs>

      {/* 新建/编辑标准模态框 */}
      <Modal
        title={selectedVersion ? '编辑评价标准' : '新建评价标准'}
        open={isModalVisible}
        onOk={handleFormSubmit}
        onCancel={() => setIsModalVisible(false)}
        width={700}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="标准名称"
            rules={[{ required: true, message: '请输入标准名称!' }]}
          >
            <Input placeholder="请输入评价标准名称" />
          </Form.Item>

          <Form.Item
            name="version"
            label="版本号"
            rules={[{ required: true, message: '请输入版本号!' }]}
          >
            <Input placeholder="例如: v1.0" />
          </Form.Item>

          <Form.Item
            name="description"
            label="描述"
            rules={[{ required: true, message: '请输入标准描述!' }]}
          >
            <Input.TextArea rows={4} placeholder="请描述此评价标准的适用范围和特点" />
          </Form.Item>

          <Form.Item
            name="status"
            label="状态"
            rules={[{ required: true, message: '请选择状态!' }]}
          >
            <Select placeholder="请选择状态">
              <Option value="draft">草稿</Option>
              <Option value="active">激活</Option>
              <Option value="archived">归档</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 版本历史抽屉 */}
      <Drawer
        title={`${selectedVersion?.name ?? ''} ${selectedVersion?.version ?? ''} 版本历史`}
        placement="right"
        onClose={() => setIsDrawerVisible(false)}
        open={isDrawerVisible}
        width={500}
      >
        <Timeline mode="left">
          {versionHistory.map((item) => (
            <Timeline.Item key={item.id} label={item.date}>
              <div className="mb-2">
                <Text strong>{item.version}</Text> <Text type="secondary">by {item.author}</Text>
              </div>
              <List
                size="small"
                dataSource={item.changes}
                renderItem={(change: string) => (
                  <List.Item>
                    <Text>{change}</Text>
                  </List.Item>
                )}
              />
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>
    </div>
  );
};

export default StandardVersionsPage;