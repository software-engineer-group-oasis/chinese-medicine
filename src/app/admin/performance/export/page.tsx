// 业绩导出页面
"use client"
import React, { useState, useMemo, useEffect } from 'react';
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
import useAxios from '@/hooks/useAxios';
import axiosInstance from '@/api/config';
import { exportToExcel } from '@/utils/exportToExcel';
import { FormInstance } from 'antd';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const { RangePicker } = DatePicker;

// 参数清洗函数
const cleanParams = (params: any) => {
  const cleaned: any = {};
  Object.keys(params).forEach(key => {
    // 不过滤0值，因为后端已经处理了
    if (params[key] !== undefined && params[key] !== '' && params[key] !== null) {
      cleaned[key] = params[key];
    }
  });
  return cleaned;
};

export default function PerformanceExportPage() {
  // 分页和筛选参数
  const [pageNum, setPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchParams, setSearchParams] = useState<any>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [isExportModalVisible, setIsExportModalVisible] = useState(false);
  const [isStatisticsDrawerVisible, setIsStatisticsDrawerVisible] = useState(false);
  const [exportColumns, setExportColumns] = useState<string[]>(['performName', 'submitUserName', 'performTypeName', 'performTime', 'performStatusName', 'performComment']);
  const [form] = Form.useForm();

  // 构建请求参数
  const requestParams = useMemo(() => {
    const params = {
      page: pageNum,
      size: pageSize,
      keyword: searchParams.keyword || undefined,
      performTypeId: searchParams.performTypeId || undefined,
      performStatus: searchParams.performStatus || undefined
      // 状态筛选发送到后端，确保分页正确
    };
    
    return params;
  }, [pageNum, pageSize, searchParams.keyword, searchParams.performTypeId, searchParams.performStatus]);

  // 获取业绩数据（后端接口）
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [performanceLoading, setPerformanceLoading] = useState(false);

  // 获取业绩列表数据
  const fetchPerformanceData = async () => {
    setPerformanceLoading(true);
    try {
      const res = await axiosInstance.get('/performance-service/performances', {
        params: requestParams
      });
      if (res.data.code === 0) {
        setPerformanceData(res.data);
      } else {
        message.error(res.data.message || '获取业绩失败');
      }
    } catch (e) {
      message.error('网络错误，获取业绩失败');
    }
    setPerformanceLoading(false);
  };

  // 监听参数变化重新获取数据
  useEffect(() => {
    fetchPerformanceData();
  }, [pageNum, pageSize, searchParams.keyword, searchParams.performTypeId, searchParams.performStatus]);
  
  // 使用后端返回的数据
  const performanceRecords = performanceData?.data?.list || [];
  const total = performanceData?.data?.total || 0;

  // 获取业绩统计数据（后端接口）
  const { data: statisticsData } = useAxios(
    '/performance-service/performances/statistics',
    'GET',
    null,
    null
  ) as any;

  // 使用useMemo优化数据处理
  const processedStats = useMemo(() => {
    const stats = statisticsData?.data || {};
    
    // 处理类型分布数据
    const typeDistributionArr = stats.typeDistribution
      ? Object.entries(stats.typeDistribution)
          .map(([performTypeName, count]) => ({ performTypeName, count }))
          .filter((item: any) => item.count > 0)
      : [];

    // 处理月度趋势数据
    const monthlyTrendArr = stats.monthlyTrend
      ? Object.entries(stats.monthlyTrend)
          .map(([month, count]) => ({ month, count }))
          .filter((item: any) => item.count > 0)
          .sort((a: any, b: any) => a.month.localeCompare(b.month))
      : [];

    return {
      typeDistributionArr,
      monthlyTrendArr,
      stats
    };
  }, [statisticsData]);

  // 获取业绩类型分布数据
  const getPerformanceTypeData = () => {
    return processedStats.typeDistributionArr.map((item: any) => ({
      name: item.performTypeName,
      value: item.count
    }));
  };

  // 获取业绩状态分布数据
  const getPerformanceStatusData = () => {
    const total = processedStats.stats.totalCount || 0;
    const approved = processedStats.stats.approvedCount || 0;
    const rejected = processedStats.stats.rejectedCount || 0;
    const pending = processedStats.stats.pendingCount || 0;
    
    return [
      { name: '已通过', value: approved },
      { name: '已驳回', value: rejected },
      { name: '待审核', value: pending }
    ];
  };

  // 获取月度业绩提交趋势数据
  const getMonthlySubmissionData = () => {
    const months = processedStats.monthlyTrendArr.map((item: any) => item.month);
    const counts = processedStats.monthlyTrendArr.map((item: any) => item.count);
    
    return {
      months,
      approvedData: counts, // 简化处理，实际应该按状态分类
      rejectedData: new Array(months.length).fill(0),
      pendingData: new Array(months.length).fill(0)
    };
  };

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
    // 类型转换，保证和后端一致
    const params = {
      ...values,
      performTypeId: values.performTypeId ? Number(values.performTypeId) : undefined,
      performStatus: values.performStatus ? Number(values.performStatus) : undefined,
    };
    
    setSearchParams(cleanParams(params));
    setPageNum(1);
    message.success('搜索条件已应用');
  };

  // 处理导出
  const handleExport = (type: 'excel' | 'pdf' | 'print') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请至少选择一条记录进行导出');
      return;
    }

    // 获取选中的记录
    const selectedRecords = performanceRecords.filter((record: any) => 
      selectedRowKeys.includes(record.performId)
    );

    if (type === 'excel') {
      exportToExcel(selectedRecords, columns, '业绩导出.xlsx');
      message.success(`已导出 ${selectedRowKeys.length} 条记录到Excel文件`);
    } else if (type === 'pdf') {
      message.success(`已导出 ${selectedRowKeys.length} 条记录到PDF文件（请用Excel导出）`);
    } else if (type === 'print') {
      message.success(`已准备 ${selectedRowKeys.length} 条记录用于打印（请用Excel导出）`);
    }

    setIsExportModalVisible(false);
  };

  // getFilteredRecords已不再需要，数据由后端分页筛选

  const columns = [
    {
      title: '标题',
      dataIndex: 'performName',
      key: 'performName',
    },
    {
      title: '提交人',
      dataIndex: 'submitUserName',
      key: 'submitUserName',
    },
    {
      title: '业绩类型',
      dataIndex: 'performTypeName',
      key: 'performTypeName',
      render: (text: string) => {
        const colorMap: Record<string, string> = {
          '教学成果': 'blue',
          '科研成果': 'green',
          '社会服务': 'orange',
          '学术交流': 'purple',
          '其他业绩': 'yellow'
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      }
    },
    {
      title: '业绩时间',
      dataIndex: 'performTime',
      key: 'performTime',
    },
    {
      title: '状态',
      dataIndex: 'performStatusName',
      key: 'performStatusName',
      render: (text: string) => {
        const colorMap: Record<string, string> = {
          '已提交': 'gold',
          '已通过': 'green',
          '已驳回': 'red'
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      }
    },
    {
      title: '评语',
      dataIndex: 'performComment',
      key: 'performComment',
      ellipsis: true,
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
      data: getPerformanceTypeData().map(item => item.name)
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
        data: getPerformanceTypeData().map((item: any, idx: number) => ({
          ...item,
          itemStyle: { color: ['#1677ff', '#52c41a', '#722ed1', '#faad14', '#f5222d'][idx % 5] }
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
      <Text type="secondary" className="block mb-6">导出业绩评价详情：哪些业绩审核通过、驳回</Text>

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
                <Option value="1">教学成果</Option>
                <Option value="2">科研成果</Option>
                <Option value="3">社会服务</Option>
                <Option value="4">学术交流</Option>
                <Option value="5">其他业绩</Option>
              </Select>
            </Form.Item>
            
            <Form.Item name="performStatus" label="状态">
              <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
                <Option value="1">已提交</Option>
                <Option value="2">已通过</Option>
                <Option value="3">已驳回</Option>
              </Select>
            </Form.Item>
            
            <Form.Item>
              <Space>
                <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                  查询
                </Button>
                <Button onClick={() => {
                  form.resetFields();
                  setSearchParams({});
                  setPageNum(1);
                }}>
                  重置
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </div>

        {/* 操作工具栏 */}
        <div className="flex justify-between mb-4">
          <Space>
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

        {/* 数据表格 */}
        <Table 
          rowSelection={rowSelection}
          columns={columns} 
          dataSource={performanceRecords}
          rowKey={(record: { performId: string | number }) => record.performId}
          pagination={{
            current: pageNum,
            pageSize: pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
            onChange: (page, size) => {
              setPageNum(page);
              setPageSize(size);
            }
          }}
          loading={performanceLoading}
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
                <Checkbox value="performName">业绩标题</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="submitUserName">提交人</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="performTypeName">业绩类型</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="performTime">业绩时间</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="performStatusName">状态</Checkbox>
              </Col>
              <Col span={8}>
                <Checkbox value="performComment">评语</Checkbox>
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



      {/* 统计分析抽屉 */}
      <Drawer
        title="统计分析"
        placement="right"
        onClose={() => setIsStatisticsDrawerVisible(false)}
        open={isStatisticsDrawerVisible}
        width={700}
      >
        <Tabs 
          defaultActiveKey="1"
          items={[
            {
              key: '1',
              label: '业绩类型分布',
              children: <ReactECharts option={typeDistributionOption} style={{ height: 400 }} />
            },
            {
              key: '2',
              label: '业绩状态分布',
              children: <ReactECharts option={statusDistributionOption} style={{ height: 400 }} />
            },
            {
              key: '4',
              label: '月度业绩提交趋势',
              children: <ReactECharts option={monthlySubmissionOption} style={{ height: 400 }} />
            }
          ]}
        />
        
        <Divider>统计摘要</Divider>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card size="small" title="业绩总览">
            <div className="mb-2">
              <Text>总业绩数：{total}</Text>
            </div>
            <div className="mb-2">
              <Text>已通过：{performanceRecords.filter((r: { performStatusName: string }) => r.performStatusName === '已通过').length}</Text>
            </div>
            <div className="mb-2">
              <Text>已驳回：{performanceRecords.filter((r: { performStatusName: string }) => r.performStatusName === '已驳回').length}</Text>
            </div>
            <div>
              <Text>待审核：{performanceRecords.filter((r: { performStatusName: string }) => r.performStatusName === '待审核').length}</Text>
            </div>
          </Card>
        </div>
      </Drawer>
    </div>
  );
}