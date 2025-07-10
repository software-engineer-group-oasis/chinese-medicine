"use client";
import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, 
  message, Space, Tooltip, Tag, Popconfirm, Card, Row, Col, Statistic, Empty
} from 'antd';
import { 
  DeleteOutlined, EditOutlined, PlusOutlined,
  SearchOutlined, EyeOutlined, LinkOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/api/config';
import { HERB_API, COURSE_API, COURSE_HERB_API } from '@/api/HerbInfoApi';
import { userPermission } from '@/hooks/usePermission';
import ReactEcharts from "echarts-for-react";
import echarts from "echarts";

const { Option } = Select;

interface Herb {
  id: number;
  name: string;
  alias?: string;
  image?: string;
  des?: string;
  origin?: string;
  herbLinkCategoryList?: any[];
}

interface Course {
  courseId: number;
  courseName: string;
}

// 写死的echart数据
const mockPieData = [
  { name: '根类药材', value: 35 },
  { name: '茎类药材', value: 25 },
  { name: '叶类药材', value: 20 },
  { name: '花类药材', value: 15 },
  { name: '果实类药材', value: 5 }
];

const mockBarData = [
  { name: '黄柏', value: 120 },
  { name: '鹿茸', value: 98 },
  { name: '麻黄', value: 85 },
  { name: '丁香', value: 76 },
  { name: '何首乌', value: 65 },
  { name: '川贝母', value: 54 },
  { name: '杜仲', value: 43 },
  { name: '金钱草', value: 32 }
];

// 饼图配置
const pieOption: echarts.EChartOption = {
  title: {
    text: '中草药分类占比',
    left: 'center',
    textStyle: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)',
    backgroundColor: 'rgba(50, 50, 50, 0.7)',
    textStyle: {
      color: '#fff'
    }
  },
  legend: {
    orient: 'vertical',
    left: 'left',
    textStyle: {
      color: '#333'
    }
  },
  series: [
    {
      name: '中草药分类',
      type: 'pie',
      radius: ['30%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: true,
        formatter: '{b}: {d}%',
        color: '#333'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: true
      },
      data: mockPieData
    }
  ],
  animation: true,
  animationEasing: 'elasticOut',
};

// 柱状图配置
const barOption: echarts.EChartOption = {
  title: {
    text: '热门中草药统计',
    left: 'center',
    textStyle: {
      color: '#333',
      fontSize: 16,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  xAxis: {
    type: 'category',
    data: mockBarData.map(item => item.name),
    axisLabel: {
      rotate: 45,
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value',
    name: '数量'
  },
  series: [
    {
      name: '使用量',
      type: 'bar',
      data: mockBarData.map(item => item.value),
      itemStyle: {
        color: '#6bb89e'
      },
      label: {
        show: true,
        position: 'top'
      }
    }
  ],
  animation: true
};

export default function AdminHerbManagement() {
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingHerb, setEditingHerb] = useState<Herb | null>(null);
  const [viewingHerb, setViewingHerb] = useState<Herb | null>(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const router = useRouter();
  const permission = userPermission();
  const canCreateHerb = permission?.hasPermission('herb:create');
  const canUpdateHerb = permission?.hasPermission('herb:update');
  const canDeleteHerb = permission?.hasPermission('herb:delete');
  const isAdmin = permission?.hasRole('管理员');

  // 获取所有中草药列表
  const fetchHerbs = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(HERB_API.GET_ALL_HERBS);
      if (response.data.code === 0) {
        setHerbs(response.data.herbs || []);
      } else {
        message.error('获取中草药列表失败');
      }
    } catch (error) {
      console.error('获取中草药列表错误:', error);
      message.error('获取中草药列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取课程列表
  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(COURSE_API.GET_COURSES());
      if (response.data.code === 0) {
        const courses = response.data.data?.list || response.data.data || [];
        setCourses(courses);
      } else {
        message.error('获取课程列表失败');
      }
    } catch (error) {
      console.error('获取课程列表错误:', error);
      message.error('获取课程列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHerbs();
    fetchCourses();
  }, []);

  // 打开创建/编辑中草药模态框
  const showModal = (herb: Herb | null = null) => {
    setEditingHerb(herb);
    setIsModalVisible(true);
  };

  // 查看中草药详情
  const showViewModal = (herb: Herb) => {
    setViewingHerb(herb);
    setIsViewModalVisible(true);
  };

  // 处理中草药模态框确认
  const handleHerbOk = async () => {
    try {
      const values = await Form.useForm()[0].validateFields();
      
      // 准备提交的数据
      const herbData = {
        name: values.name,
        alias: values.alias,
        des: values.des,
        origin: values.origin,
      };
      
      if (editingHerb) {
        // 更新中草药
        const response = await axiosInstance.put(
          `/herb-service/herbs/${editingHerb.id}`, 
          herbData
        );
        if (response.data.code === 0) {
          message.success('中草药更新成功');
          fetchHerbs(); // 刷新中草药列表
        } else {
          message.error('中草药更新失败');
        }
      } else {
        // 创建新中草药
        const response = await axiosInstance.post(
          `/herb-service/herbs`, 
          herbData
        );
        if (response.data.code === 0) {
          message.success('中草药创建成功');
          fetchHerbs(); // 刷新中草药列表
        } else {
          message.error('中草药创建失败');
        }
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证或提交错误:', error);
    }
  };

  // 处理删除中草药
  const handleDeleteHerb = async (herbId: number) => {
    try {
      const response = await axiosInstance.delete(
        `/herb-service/herbs/${herbId}`
      );
      if (response.data.code === 0) {
        message.success('中草药删除成功');
        fetchHerbs(); // 刷新中草药列表
      } else {
        message.error('中草药删除失败');
      }
    } catch (error) {
      console.error('删除中草药错误:', error);
      message.error('删除中草药失败，请稍后重试');
    }
  };

  // 筛选中草药
  const filteredHerbs = herbs.filter(herb => {
    const matchesSearch = !searchText || 
      herb.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (herb.alias && herb.alias.toLowerCase().includes(searchText.toLowerCase()));
    const matchesCategory = categoryFilter === 'all' || 
      (herb.herbLinkCategoryList && herb.herbLinkCategoryList.some((c: any) => c.categoryName === categoryFilter));
    return matchesSearch && matchesCategory;
  });

  // 统计信息
  const totalHerbs = herbs.length;
  const totalCourses = courses.length;

  // 中草药列表列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '中草药名称',
      dataIndex: 'name',
      key: 'name',
      width: 150,
    },
    {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: '产地',
      dataIndex: 'origin',
      key: 'origin',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '分类',
      dataIndex: 'herbLinkCategoryList',
      key: 'categories',
      width: 200,
      render: (categories: any[]) => (
        <div>
          {categories?.map((cat, index) => (
            <Tag key={index} color="blue">{cat.categoryName}</Tag>
          )) || '-'}
        </div>
      ),
    },
    {
      title: '描述',
      dataIndex: 'des',
      key: 'des',
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxWidth: 200, whiteSpace: 'pre-wrap' }}>
          {text?.length > 50 ? `${text.substring(0, 50)}...` : text || '-'}
        </div>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Herb) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => showViewModal(record)} 
            />
          </Tooltip>
          {canUpdateHerb && (
            <Tooltip title="编辑中草药">
              <Button 
                type="link" 
                icon={<EditOutlined />} 
                onClick={() => showModal(record)} 
              />
            </Tooltip>
          )}
          {canDeleteHerb && (
            <Tooltip title="删除中草药">
              <Popconfirm
                title="确定要删除这个中草药吗?"
                onConfirm={() => handleDeleteHerb(record.id)}
                okText="确定"
                cancelText="取消"
              >
                <Button 
                  type="link" 
                  danger 
                  icon={<DeleteOutlined />} 
                />
              </Popconfirm>
            </Tooltip>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">中草药管理</h1>
        
        {/* 统计卡片 */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="总中草药数"
                value={totalHerbs}
                prefix={<span>🌿</span>}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总课程数"
                value={totalCourses}
                prefix={<span>📚</span>}
              />
            </Card>
          </Col>
        </Row>

        {/* 图表展示区域 */}
        <Row gutter={16} className="mb-6">
          <Col span={12}>
            <Card title="中草药分类占比" className="h-80">
              <ReactEcharts
                option={pieOption}
                style={{ height: '300px', width: '100%' }}
              />
            </Card>
          </Col>
          <Col span={12}>
            <Card title="热门中草药统计" className="h-80">
              <ReactEcharts
                option={barOption}
                style={{ height: '300px', width: '100%' }}
              />
            </Card>
          </Col>
        </Row>

        {/* 搜索和筛选 */}
        <Card className="mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input.Search
              placeholder="搜索中草药名称或别名"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={() => {}}
            />
            <Select
              placeholder="选择分类"
              style={{ width: 200 }}
              value={categoryFilter}
              onChange={setCategoryFilter}
              allowClear
            >
              <Option value="all">全部分类</Option>
              <Option value="根类">根类</Option>
              <Option value="茎类">茎类</Option>
              <Option value="叶类">叶类</Option>
              <Option value="花类">花类</Option>
              <Option value="果实类">果实类</Option>
              <Option value="全草类">全草类</Option>
              <Option value="皮类">皮类</Option>
              <Option value="种子类">种子类</Option>
            </Select>
            {canCreateHerb && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showModal()}
              >
                添加中草药
              </Button>
            )}
            <Button 
              type="default" 
              icon={<LinkOutlined />} 
              onClick={() => router.push('/admin/teaching/herbs/categories')}
            >
              分类管理
            </Button>
            <Button 
              type="default" 
              icon={<LinkOutlined />} 
              onClick={() => router.push('/admin/teaching/herbs/associations')}
            >
              关联管理
            </Button>
          </div>
        </Card>
      </div>

      {/* 中草药列表 */}
      <Card>
        <Table 
          columns={columns} 
          dataSource={filteredHerbs.map(herb => ({ ...herb, key: herb.id }))} 
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建/编辑中草药模态框 */}
      <Modal
        title={editingHerb ? '编辑中草药' : '添加中草药'}
        open={isModalVisible}
        onOk={handleHerbOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          layout="vertical"
          initialValues={editingHerb || {}}
        >
          <Form.Item
            name="name"
            label="中草药名称"
            rules={[{ required: true, message: '请输入中草药名称' }]}
          >
            <Input placeholder="请输入中草药名称" />
          </Form.Item>
          
          <Form.Item
            name="alias"
            label="别名"
          >
            <Input placeholder="请输入别名" />
          </Form.Item>
          
          <Form.Item
            name="origin"
            label="产地"
          >
            <Input placeholder="请输入产地" />
          </Form.Item>
          
          <Form.Item
            name="des"
            label="描述"
            rules={[{ required: true, message: '请输入描述' }]}
          >
            <Input.TextArea 
              rows={4} 
              placeholder="请输入中草药描述" 
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看中草药详情模态框 */}
      <Modal
        title="中草药详情"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={800}
      >
        {viewingHerb && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">基本信息</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-medium">中草药名称：</label>
                  <span>{viewingHerb.name}</span>
                </div>
                <div>
                  <label className="font-medium">别名：</label>
                  <span>{viewingHerb.alias || '-'}</span>
                </div>
                <div>
                  <label className="font-medium">产地：</label>
                  <span>{viewingHerb.origin || '-'}</span>
                </div>
                <div>
                  <label className="font-medium">分类：</label>
                  <div>
                    {viewingHerb.herbLinkCategoryList?.map((cat, index) => (
                      <Tag key={index} color="blue">{cat.categoryName}</Tag>
                    )) || '-'}
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">描述</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p>{viewingHerb.des || '暂无描述'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 