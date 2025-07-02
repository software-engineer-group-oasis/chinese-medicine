// 业绩导出页面
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
import Checkbox from 'antd/es/checkbox';
import Drawer from 'antd/es/drawer';
import message from 'antd/es/message';
import Row from 'antd/es/row';
import Col from 'antd/es/col';
import { 
  ArrowLeftOutlined, SearchOutlined, FilterOutlined, 
  DownloadOutlined, FileExcelOutlined, FilePdfOutlined,
  PrinterOutlined, SettingOutlined, CheckCircleOutlined,
  CloseCircleOutlined, ExclamationCircleOutlined
} from '@ant-design/icons';
import Link from 'next/link';
import ReactECharts from 'echarts-for-react';
// 导入模拟数据
import { 
  mockPerformanceRecords, 
  mockPerformanceTypes,
  PerformanceRecord
} from '@/mock/performance';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { RangePicker } = DatePicker;

export default function PerformanceExportPage() {
  // 状态管理
  const [performanceRecords, setPerformanceRecords] = useState<PerformanceRecord[]>(mockPerformanceRecords);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isFilterDrawerVisible, setIsFilterDrawerVisible] = useState(false);
  const [isStatisticsDrawerVisible, setIsStatisticsDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchParams, setSearchParams] = useState({});
  const [exportColumns, setExportColumns] = useState<string[]>(['title', 'userName', 'department', 'typeName', 'submitTime', 'status', 'score', 'comment']);

  // 处理行选择变化
  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  // 行选择配置
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
  };

  // 处理搜索
  const handleSearch = (values: any) => {
    setSearchParams(values);
    setIsFilterDrawerVisible(false);
    // 这里可以添加API调用，根据搜索条件获取业绩记录
    message.success('搜索条件已应用');
  };

  // 处理导出
  const handleExport = (type: 'excel' | 'pdf' | 'print') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一条记录进行导出');
      return;
    }

    // 获取选中的记录
    const selectedRecords = performanceRecords.filter(record => 
      selectedRowKeys.includes(record.id)
    );

    // 根据导出类型执行不同的操作
    if (type === 'excel') {
      message.success(`已导出 ${selectedRowKeys.length} 条记录到Excel文件`);
    } else if (type === 'pdf') {
      message.success(`已导出 ${selectedRowKeys.length} 条记录到PDF文件`);
    } else if (type === 'print') {
      message.success(`已准备 ${selectedRowKeys.length} 条记录用于打印`);
    }

    setIsExportModalVisible(false);
  };

  // 根据状态筛选记录
  const getFilteredRecords = () => {
    let filtered = [...performanceRecords];
    
    // 根据标签页筛选状态
    if (activeTab === 'approved') {
      filtered = filtered.filter(record => record.status === 'approved');
    } else if (activeTab === 'rejected') {
      filtered = filtered.filter(record => record.status === 'rejected');
    } else if (activeTab === 'pending') {
      filtered = filtered.filter(record => record.status === 'pending');
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
      title: '评语',
      dataIndex: 'comment',
      key: 'comment',
      ellipsis: true,
    }
  ];

  // 获取业绩类型分布数据
  const getPerformanceTypeData = () => {
    const typeCount: Record<string, number> = {};
    const filteredRecords = getFilteredRecords();
    
    filteredRecords.forEach(record => {
      if (typeCount[record.typeName]) {
        typeCount[record.typeName]++;
      } else {
        typeCount[record.typeName] = 1;
      }
    });
    
    return Object.keys(typeCount).map(typeName => ({
      name: typeName,
      value: typeCount[typeName]
    }));
  };

  // 获取业绩状态分布数据
  const getPerformanceStatusData = () => {
    const statusCount = {
      approved: 0,
      rejected: 0,
      pending: 0
    };
    const filteredRecords = getFilteredRecords();
    
    filteredRecords.forEach(record => {
      if (statusCount[record.status as keyof typeof statusCount] !== undefined) {
        statusCount[record.status as keyof typeof statusCount]++;
      }
    });
    
    return [
      { name: '已通过', value: statusCount.approved },
      { name: '已驳回', value: statusCount.rejected },
      { name: '待审核', value: statusCount.pending }
    ];
  };

  // 获取部门业绩分布数据
  const getDepartmentPerformanceData = () => {
    const departmentCount: Record<string, number> = {};
    const filteredRecords = getFilteredRecords();
    
    filteredRecords.forEach(record => {
      if (departmentCount[record.department]) {
        departmentCount[record.department]++;
      } else {
        departmentCount[record.department] = 1;
      }
    });
    
    return Object.keys(departmentCount).map(department => ({
      name: department,
      value: departmentCount[department]
    }));
  };

  // 获取月度业绩提交趋势数据
  const getMonthlySubmissionData = () => {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
    const approvedData = new Array(12).fill(0);
    const rejectedData = new Array(12).fill(0);
    const pendingData = new Array(12).fill(0);
    
    performanceRecords.forEach(record => {
      const date = new Date(record.submitTime);
      const month = date.getMonth();
      
      if (record.status === 'approved') {
        approvedData[month]++;
      } else if (record.status === 'rejected') {
        rejectedData[month]++;
      } else if (record.status === 'pending') {
        pendingData[month]++;
      }
    });
    
    return {
      months,
      approvedData,
      rejectedData,
      pendingData
    };
  };

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
        data: getPerformanceTypeData()
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
      data: ['已通过', '已驳回', '待审核']
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
        data: getPerformanceStatusData(),
        color: ['#52c41a', '#f5222d', '#faad14']
      }
    ]
  };

  // 部门业绩分布图表配置
  const departmentDistributionOption = {
    title: {
      text: '部门业绩分布',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      data: Array.from(new Set(performanceRecords.map(record => record.department)))
    },
    series: [
      {
        name: '部门业绩',
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
        data: getDepartmentPerformanceData()
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
    legend: {
      data: ['已通过', '已驳回', '待审核'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '10%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: getMonthlySubmissionData().months
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '已通过',
        type: 'line',
        stack: '总量',
        data: getMonthlySubmissionData().approvedData,
        color: '#52c41a'
      },
      {
        name: '已驳回',
        type: 'line',
        stack: '总量',
        data: getMonthlySubmissionData().rejectedData,
        color: '#f5222d'
      },
      {
        name: '待审核',
        type: 'line',
        stack: '总量',
        data: getMonthlySubmissionData().pendingData,
        color: '#faad14'
      }
    ]
  };

  return (
    <div className="p-6">
      <Breadcrumb className="mb-4">
        <Breadcrumb.Item>
          <Link href="/admin/performance"><ArrowLeftOutlined /> 工作业绩管理</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>业绩导出</Breadcrumb.Item>
      </Breadcrumb>

      <Title level={2}>业绩导出</Title>
      <Text type="secondary" className="block mb-6">导出业绩评价详情：哪些业绩审核通过、哪些没有、最终分数</Text>

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
            <Button 
              icon={<SettingOutlined />} 
              onClick={() => setIsStatisticsDrawerVisible(true)}
            >
              统计分析
            </Button>
          </Space>
          <Space>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />} 
              onClick={() => setIsExportModalVisible(true)}
              disabled={selectedRowKeys.length === 0}
            >
              导出选中 ({selectedRowKeys.length})
            </Button>
          </Space>
        </div>

        {/* 标签页 */}
        <Tabs activeKey={activeTab} onChange={setActiveTab} className="mb-4">
          <TabPane tab="全部" key="all" />
          <TabPane tab={<span><CheckCircleOutlined /> 已通过</span>} key="approved" />
          <TabPane tab={<span><CloseCircleOutlined /> 已驳回</span>} key="rejected" />
          <TabPane tab={<span><ExclamationCircleOutlined /> 待审核</span>} key="pending" />
        </Tabs>

        {/* 数据表格 */}
        <Table 
          rowSelection={rowSelection}
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

      {/* 导出选项模态框 */}
      <Modal
        title="导出选项"
        open={isExportModalVisible}
        onCancel={() => setIsExportModalVisible(false)}
        footer={null}
      >
        <div className="mb-4">
          <Text>已选择 {selectedRowKeys.length} 条记录</Text>
        </div>
        
        <Divider>导出格式</Divider>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card 
            hoverable 
            className="text-center" 
            onClick={() => handleExport('excel')}
          >
            <FileExcelOutlined style={{ fontSize: '32px', color: '#52c41a' }} />
            <div className="mt-2">Excel格式</div>
          </Card>
          <Card 
            hoverable 
            className="text-center" 
            onClick={() => handleExport('pdf')}
          >
            <FilePdfOutlined style={{ fontSize: '32px', color: '#f5222d' }} />
            <div className="mt-2">PDF格式</div>
          </Card>
          <Card 
            hoverable 
            className="text-center" 
            onClick={() => handleExport('print')}
          >
            <PrinterOutlined style={{ fontSize: '32px', color: '#1677ff' }} />
            <div className="mt-2">打印</div>
          </Card>
        </div>
        
        <Divider>导出字段</Divider>
        
        <div className="mb-4">
          <Checkbox.Group 
            value={exportColumns} 
            onChange={(checkedValues) => setExportColumns(checkedValues as string[])}
          >
            <Row>
              <Col span={8}>
                <Checkbox value="title">业绩标题</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="userName">提交人</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="department">部门</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="position">职位</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="typeName">业绩类型</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="submitTime">提交时间</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="reviewTime">审核时间</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="status">状态</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="score">评分</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="comment">评语</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="description">业绩描述</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="attachments">附件列表</Checkbox>
              </Col>
            </Row>
          </Checkbox.Group>
        </div>
        
        <div className="text-right">
          <Space>
            <Button onClick={() => setIsExportModalVisible(false)}>取消</Button>
            <Button 
              type="primary" 
              onClick={() => handleExport('excel')}
              disabled={exportColumns.length === 0}
            >
              确认导出
            </Button>
          </Space>
        </div>
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
        </Form>
      </Drawer>

      {/* 统计分析抽屉 */}
      <Drawer
        title="统计分析"
        placement="right"
        onClose={() => setIsStatisticsDrawerVisible(false)}
        open={isStatisticsDrawerVisible}
        width={700}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="业绩类型分布" key="1">
            <ReactECharts option={typeDistributionOption} style={{ height: 400 }} />
          </TabPane>
          <TabPane tab="业绩状态分布" key="2">
            <ReactECharts option={statusDistributionOption} style={{ height: 400 }} />
          </TabPane>
          <TabPane tab="部门业绩分布" key="3">
            <ReactECharts option={departmentDistributionOption} style={{ height: 400 }} />
          </TabPane>
          <TabPane tab="月度业绩提交趋势" key="4">
            <ReactECharts option={monthlySubmissionOption} style={{ height: 400 }} />
          </TabPane>
        </Tabs>
        
        <Divider>统计摘要</Divider>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card size="small" title="业绩总览">
            <div className="mb-2">
              <Text>总业绩数：{performanceRecords.length}</Text>
            </div>
            <div className="mb-2">
              <Text>已通过：{performanceRecords.filter(r => r.status === 'approved').length}</Text>
            </div>
            <div className="mb-2">
              <Text>已驳回：{performanceRecords.filter(r => r.status === 'rejected').length}</Text>
            </div>
            <div>
              <Text>待审核：{performanceRecords.filter(r => r.status === 'pending').length}</Text>
            </div>
          </Card>
          
          <Card size="small" title="评分统计">
            <div className="mb-2">
              <Text>平均分：
                {Math.round(performanceRecords
                  .filter(r => r.score !== undefined && r.score !== null)
                  .reduce((sum, r) => sum + (r.score || 0), 0) / 
                  performanceRecords.filter(r => r.score !== undefined && r.score !== null).length * 100) / 100}
              </Text>
            </div>
            <div className="mb-2">
              <Text>最高分：
                {Math.max(...performanceRecords
                  .filter(r => r.score !== undefined && r.score !== null)
                  .map(r => r.score || 0))}
              </Text>
            </div>
            <div>
              <Text>最低分：
                {Math.min(...performanceRecords
                  .filter(r => r.score !== undefined && r.score !== null && r.score > 0)
                  .map(r => r.score || 0))}
              </Text>
            </div>
          </Card>
        </div>
      </Drawer>
    </div>
  );
}