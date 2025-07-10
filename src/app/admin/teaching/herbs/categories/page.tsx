"use client";
import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, 
  message, Space, Tooltip, Tag, Popconfirm, Card, Row, Col, Statistic
} from 'antd';
import { 
  DeleteOutlined, EditOutlined, PlusOutlined,
  SearchOutlined, EyeOutlined
} from '@ant-design/icons';
import axiosInstance from '@/api/config';
import { HERB_CATEGORY_API } from '@/api/HerbInfoApi';
import { userPermission } from '@/hooks/usePermission';

interface Category {
  id: number;
  categoryName: string;
  description?: string;
  herbCount?: number;
}

export default function AdminHerbCategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [viewingCategory, setViewingCategory] = useState<Category | null>(null);
  const [searchText, setSearchText] = useState('');
  
  const permission = userPermission();
  const canCreateCategory = permission?.hasPermission('category:create');
  const canUpdateCategory = permission?.hasPermission('category:update');
  const canDeleteCategory = permission?.hasPermission('category:delete');

  // 获取所有分类列表
  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(HERB_CATEGORY_API.GET_ALL_CATEGORIES());
      if (response.data.code === 0) {
        setCategories(response.data.data || []);
      } else {
        message.error('获取分类列表失败');
      }
    } catch (error) {
      console.error('获取分类列表错误:', error);
      message.error('获取分类列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 打开创建/编辑分类模态框
  const showModal = (category: Category | null = null) => {
    setEditingCategory(category);
    setIsModalVisible(true);
  };

  // 查看分类详情
  const showViewModal = (category: Category) => {
    setViewingCategory(category);
    setIsViewModalVisible(true);
  };

  // 处理分类模态框确认
  const handleCategoryOk = async () => {
    try {
      const values = await Form.useForm()[0].validateFields();
      
      // 准备提交的数据
      const categoryData = {
        categoryName: values.categoryName,
        description: values.description,
      };
      
      if (editingCategory) {
        // 更新分类
        const response = await axiosInstance.put(
          HERB_CATEGORY_API.UPDATE_CATEGORY(editingCategory.id), 
          categoryData
        );
        if (response.data.code === 0) {
          message.success('分类更新成功');
          fetchCategories(); // 刷新分类列表
        } else {
          message.error('分类更新失败');
        }
      } else {
        // 创建新分类
        const response = await axiosInstance.post(
          HERB_CATEGORY_API.CREATE_CATEGORY(), 
          categoryData
        );
        if (response.data.code === 0) {
          message.success('分类创建成功');
          fetchCategories(); // 刷新分类列表
        } else {
          message.error('分类创建失败');
        }
      }
      
      setIsModalVisible(false);
    } catch (error) {
      console.error('表单验证或提交错误:', error);
    }
  };

  // 处理删除分类
  const handleDeleteCategory = async (categoryId: number) => {
    try {
      const response = await axiosInstance.delete(
        HERB_CATEGORY_API.DELETE_CATEGORY(categoryId)
      );
      if (response.data.code === 0) {
        message.success('分类删除成功');
        fetchCategories(); // 刷新分类列表
      } else {
        message.error('分类删除失败');
      }
    } catch (error) {
      console.error('删除分类错误:', error);
      message.error('删除分类失败，请稍后重试');
    }
  };

  // 筛选分类
  const filteredCategories = categories.filter(category => 
    !searchText || 
    category.categoryName.toLowerCase().includes(searchText.toLowerCase()) ||
    (category.description && category.description.toLowerCase().includes(searchText.toLowerCase()))
  );

  // 统计信息
  const totalCategories = categories.length;
  const totalHerbs = categories.reduce((sum, cat) => sum + (cat.herbCount || 0), 0);

  // 分类列表列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => (
        <div style={{ maxWidth: 300, whiteSpace: 'pre-wrap' }}>
          {text?.length > 50 ? `${text.substring(0, 50)}...` : text || '-'}
        </div>
      ),
    },
    {
      title: '关联药材数',
      dataIndex: 'herbCount',
      key: 'herbCount',
      width: 120,
      render: (count: number) => (
        <Tag color="blue">{count || 0}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Tooltip title="查看详情">
            <Button 
              type="link" 
              icon={<EyeOutlined />} 
              onClick={() => showViewModal(record)} 
            />
          </Tooltip>
          {canUpdateCategory && (
            <Tooltip title="编辑分类">
              <Button 
                type="link" 
                icon={<EditOutlined />} 
                onClick={() => showModal(record)} 
              />
            </Tooltip>
          )}
          {canDeleteCategory && (
            <Tooltip title="删除分类">
              <Popconfirm
                title="确定要删除这个分类吗?"
                description="删除分类将同时移除该分类下的所有药材关联"
                onConfirm={() => handleDeleteCategory(record.id)}
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
        <h1 className="text-2xl font-bold mb-4">中草药分类管理</h1>
        
        {/* 统计卡片 */}
        <Row gutter={16} className="mb-6">
          <Col span={6}>
            <Card>
              <Statistic
                title="总分类数"
                value={totalCategories}
                prefix={<span>📂</span>}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总药材数"
                value={totalHerbs}
                prefix={<span>🌿</span>}
              />
            </Card>
          </Col>
        </Row>

        {/* 搜索和操作 */}
        <Card className="mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input.Search
              placeholder="搜索分类名称或描述"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={() => {}}
            />
            {canCreateCategory && (
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                onClick={() => showModal()}
              >
                添加分类
              </Button>
            )}
          </div>
        </Card>
      </div>

      {/* 分类列表 */}
      <Card>
        <Table 
          columns={columns} 
          dataSource={filteredCategories.map(category => ({ ...category, key: category.id }))} 
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 创建/编辑分类模态框 */}
      <Modal
        title={editingCategory ? '编辑分类' : '添加分类'}
        open={isModalVisible}
        onOk={handleCategoryOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form
          layout="vertical"
          initialValues={editingCategory || {}}
        >
          <Form.Item
            name="categoryName"
            label="分类名称"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="描述"
          >
            <Input.TextArea 
              rows={4} 
              placeholder="请输入分类描述" 
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* 查看分类详情模态框 */}
      <Modal
        title="分类详情"
        open={isViewModalVisible}
        onCancel={() => setIsViewModalVisible(false)}
        footer={null}
        width={600}
      >
        {viewingCategory && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">基本信息</h3>
              <div className="space-y-2">
                <div>
                  <label className="font-medium">分类名称：</label>
                  <span className="ml-2">{viewingCategory.categoryName}</span>
                </div>
                <div>
                  <label className="font-medium">关联药材数：</label>
                  <Tag color="blue" className="ml-2">{viewingCategory.herbCount || 0}</Tag>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">描述</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p>{viewingCategory.description || '暂无描述'}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 