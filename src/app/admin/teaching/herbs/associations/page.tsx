"use client";
import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, 
  message, Space, Tooltip, Tag, Popconfirm, Card, Row, Col, Statistic, Transfer
} from 'antd';
import { 
  DeleteOutlined, EditOutlined, PlusOutlined,
  SearchOutlined, EyeOutlined, LinkOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/navigation';
import axiosInstance from '@/api/config';
import { HERB_API, HERB_CATEGORY_API, HERB_ASSOCIATION_API } from '@/api/HerbInfoApi';
import { userPermission } from '@/hooks/usePermission';

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

interface Category {
  id: number;
  categoryName: string;
  description?: string;
}

interface HerbCategoryAssociation {
  id: number;
  herbId: number;
  herbName: string;
  categoryId: number;
  categoryName: string;
}

export default function AdminHerbAssociationManagement() {
  const [herbs, setHerbs] = useState<Herb[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [associations, setAssociations] = useState<HerbCategoryAssociation[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedHerb, setSelectedHerb] = useState<Herb | null>(null);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState('');
  
  const router = useRouter();
  const permission = userPermission();
  const canCreateAssociation = permission?.hasPermission('herb:update');
  const canDeleteAssociation = permission?.hasPermission('herb:delete');

  // 获取所有中草药列表
  const fetchHerbs = async () => {
    try {
      const response = await axiosInstance.get(HERB_API.GET_ALL_HERBS);
      if (response.data.code === 0) {
        setHerbs(response.data.herbs || []);
      } else {
        message.error('获取中草药列表失败');
      }
    } catch (error) {
      console.error('获取中草药列表错误:', error);
      message.error('获取中草药列表失败，请稍后重试');
    }
  };

  // 获取所有分类列表
  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get(HERB_CATEGORY_API.GET_ALL_CATEGORIES());
      if (response.data.code === 0) {
        setCategories(response.data.data || []);
      } else {
        message.error('获取分类列表失败');
      }
    } catch (error) {
      console.error('获取分类列表错误:', error);
      message.error('获取分类列表失败，请稍后重试');
    }
  };

  // 获取关联列表
  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(HERB_ASSOCIATION_API.GET_ALL_ASSOCIATIONS());
      if (response.data.code === 0) {
        setAssociations(response.data.data || []);
      } else {
        message.error('获取关联列表失败');
      }
    } catch (error) {
      console.error('获取关联列表错误:', error);
      message.error('获取关联列表失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHerbs();
    fetchCategories();
    fetchAssociations();
  }, []);

  // 打开关联管理模态框
  const showModal = (herb: Herb) => {
    setSelectedHerb(herb);
    // 设置已关联的分类
    const linkedCategoryIds = herb.herbLinkCategoryList?.map(cat => cat.id) || [];
    setSelectedCategoryIds(linkedCategoryIds);
    setIsModalVisible(true);
  };

  // 处理关联管理确认
  const handleAssociationOk = async () => {
    if (!selectedHerb) return;

    try {
      const response = await axiosInstance.put(
        HERB_ASSOCIATION_API.UPDATE_HERB_CATEGORIES(selectedHerb.id),
        {
          herbId: selectedHerb.id,
          categoryIds: selectedCategoryIds
        }
      );
      if (response.data.code === 0) {
        message.success('关联更新成功');
        fetchHerbs(); // 刷新中草药列表
        fetchAssociations(); // 刷新关联列表
        setIsModalVisible(false);
      } else {
        message.error('关联更新失败');
      }
    } catch (error) {
      console.error('更新关联错误:', error);
      message.error('关联更新失败，请稍后重试');
    }
  };

  // 处理删除关联
  const handleDeleteAssociation = async (associationId: number) => {
    try {
      const response = await axiosInstance.delete(
        HERB_ASSOCIATION_API.DELETE_ASSOCIATION(associationId)
      );
      if (response.data.code === 0) {
        message.success('关联删除成功');
        fetchAssociations(); // 刷新关联列表
      } else {
        message.error('关联删除失败');
      }
    } catch (error) {
      console.error('删除关联错误:', error);
      message.error('关联删除失败，请稍后重试');
    }
  };

  // 筛选关联
  const filteredAssociations = associations.filter(association => 
    !searchText || 
    association.herbName.toLowerCase().includes(searchText.toLowerCase()) ||
    association.categoryName.toLowerCase().includes(searchText.toLowerCase())
  );

  // 统计信息
  const totalHerbs = herbs.length;
  const totalCategories = categories.length;
  const totalAssociations = associations.length;

  // 关联列表列定义
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: '中草药名称',
      dataIndex: 'herbName',
      key: 'herbName',
      width: 150,
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_: any, record: HerbCategoryAssociation) => (
        <Space size="middle">
          {canDeleteAssociation && (
            <Tooltip title="删除关联">
              <Popconfirm
                title="确定要删除这个关联吗?"
                onConfirm={() => handleDeleteAssociation(record.id)}
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
        <h1 className="text-2xl font-bold mb-4">中草药分类关联管理</h1>
        
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
                title="总分类数"
                value={totalCategories}
                prefix={<span>📂</span>}
              />
            </Card>
          </Col>
          <Col span={6}>
            <Card>
              <Statistic
                title="总关联数"
                value={totalAssociations}
                prefix={<span>🔗</span>}
              />
            </Card>
          </Col>
        </Row>

        {/* 搜索和操作 */}
        <Card className="mb-4">
          <div className="flex flex-wrap gap-4 items-center">
            <Input.Search
              placeholder="搜索中草药名称或分类名称"
              allowClear
              style={{ width: 300 }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onSearch={() => {}}
            />
            <Button 
              type="default" 
              icon={<LinkOutlined />} 
              onClick={() => router.push('/admin/teaching/herbs')}
            >
              中草药管理
            </Button>
            <Button 
              type="default" 
              icon={<LinkOutlined />} 
              onClick={() => router.push('/admin/teaching/herbs/categories')}
            >
              分类管理
            </Button>
          </div>
        </Card>
      </div>

      {/* 中草药列表 - 用于关联管理 */}
      <Card title="中草药关联管理" className="mb-4">
        <Table 
          columns={[
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
              title: '当前分类',
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
              title: '操作',
              key: 'action',
              width: 150,
              render: (_: any, record: Herb) => (
                <Space size="middle">
                  {canCreateAssociation && (
                    <Tooltip title="管理分类关联">
                      <Button 
                        type="link" 
                        icon={<EditOutlined />} 
                        onClick={() => showModal(record)} 
                      />
                    </Tooltip>
                  )}
                </Space>
              ),
            },
          ]} 
          dataSource={herbs.map(herb => ({ ...herb, key: herb.id }))} 
          pagination={false}
          size="small"
        />
      </Card>

      {/* 关联列表 */}
      <Card title="关联列表">
        <Table 
          columns={columns} 
          dataSource={filteredAssociations.map(association => ({ ...association, key: association.id }))} 
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `第 ${range[0]}-${range[1]} 条，共 ${total} 条`,
          }}
        />
      </Card>

      {/* 关联管理模态框 */}
      <Modal
        title={`管理 ${selectedHerb?.name} 的分类关联`}
        open={isModalVisible}
        onOk={handleAssociationOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        {selectedHerb && (
          <div>
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">中草药信息</h3>
              <div className="bg-gray-50 p-4 rounded">
                <p><strong>名称：</strong>{selectedHerb.name}</p>
                <p><strong>别名：</strong>{selectedHerb.alias || '-'}</p>
                <p><strong>当前分类：</strong>
                  {selectedHerb.herbLinkCategoryList?.map((cat, index) => (
                    <Tag key={index} color="blue">{cat.categoryName}</Tag>
                  )) || '-'}
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">选择分类</h3>
              <Transfer
                dataSource={categories.map(cat => ({
                  key: cat.id.toString(),
                  title: cat.categoryName,
                  description: cat.description,
                }))}
                titles={['可选分类', '已选分类']}
                targetKeys={selectedCategoryIds.map(id => id.toString())}
                onChange={(targetKeys) => {
                  setSelectedCategoryIds(targetKeys.map(key => parseInt(key)));
                }}
                render={(item) => item.title}
                listStyle={{
                  width: 250,
                  height: 300,
                }}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
} 