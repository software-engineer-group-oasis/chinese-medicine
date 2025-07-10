import React, { useState, useEffect } from 'react';
import { 
  Table, Button, Modal, Form, Input, Select, 
  message, Space, Tooltip, Tag, Popconfirm, Empty, Transfer
} from 'antd';
import { 
  DeleteOutlined, PlusOutlined, SearchOutlined,
  LinkOutlined, CheckCircleOutlined
} from '@ant-design/icons';
import axiosInstance from '@/api/config';
import { HERB_API, COURSE_HERB_API } from '@/api/HerbInfoApi';
import { userPermission } from '@/hooks/usePermission';

const { Option } = Select;

interface Herb {
//   herbId: number;
//   herbName: string;
//   herbAlias?: string;
//   herbImageUrl?: string;
//   herbDescription?: string;
// }

// interface CourseHerb {
//   courseHerbId: number;
//   courseId: number;
//   herbId: number;
//   herbName: string;
//   herbAlias?: string;
//   herbImageUrl?: string;
//   linkTime: string;
  id: number;
  name: string;
  alias?: string;
  image?: string;
  des?: string;
}

interface CourseHerbManagerProps {
  courseId: number;
}

export default function CourseHerbManager({ courseId }: CourseHerbManagerProps) {
  const [courseHerbIds, setCourseHerbIds] = useState<number[]>([]);
  const [allHerbs, setAllHerbs] = useState<Herb[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [selectedHerbIds, setSelectedHerbIds] = useState<number[]>([]);
  
  const permission = userPermission();
  const canLinkHerb = permission?.hasPermission('course:update');

  // 获取课程关联的药材ID列表
  const fetchCourseHerbIds = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(COURSE_HERB_API.GET_COURSE_HERB_IDS(courseId));
      if (response.data.code === 0) {
        setCourseHerbIds(response.data.data || []);
      } else {
        message.error('获取课程关联药材失败');
      }
    } catch (error) {
      console.error('获取课程关联药材错误:', error);
      message.error('获取课程关联药材失败，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  // 获取所有药材列表
  const fetchAllHerbs = async () => {
    try {
      const response = await axiosInstance.get(HERB_API.GET_ALL_HERBS);
      if (response.data.code === 0) {
        setAllHerbs(response.data.herbs || []);
      } else {
        message.error('获取药材列表失败');
      }
    } catch (error) {
      console.error('获取药材列表错误:', error);
      message.error('获取药材列表失败，请稍后重试');
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchCourseHerbIds();
      fetchAllHerbs();
    }
  }, [courseId]);

  // 打开关联药材模态框
  const showModal = () => {
    setIsModalVisible(true);
    setSelectedHerbIds([]);
    setSearchValue('');
  };

  // 处理搜索药材
  const handleSearch = () => {
    // 搜索逻辑在渲染时处理
  };

  // 处理添加单个药材
  const handleAddHerb = async (herbId: number) => {
    try {
      const response = await axiosInstance.post(COURSE_HERB_API.ADD_HERB_TO_COURSE(courseId, herbId));
      if (response.data.code === 0) {
        message.success('药材添加成功');
        fetchCourseHerbIds(); // 刷新关联药材列表
      } else {
        message.error(response.data.message || '药材添加失败');
      }
    } catch (error) {
      console.error('添加药材错误:', error);
      message.error('药材添加失败，请稍后重试');
    }
  };

  // 处理批量更新药材
  const handleBatchUpdateHerbs = async () => {
    if (selectedHerbIds.length === 0) {
      message.warning('请选择要关联的药材');
      return;
    }

    try {
      const response = await axiosInstance.put(COURSE_HERB_API.BATCH_UPDATE_COURSE_HERBS(courseId), {
        courseId: courseId,
        herbIds: selectedHerbIds
      });
      if (response.data.code === 0) {
        message.success('药材批量更新成功');
        fetchCourseHerbIds(); // 刷新关联药材列表
        setIsModalVisible(false);
      } else {
        message.error('药材批量更新失败');
      }
    } catch (error) {
      console.error('批量更新药材错误:', error);
      message.error('药材批量更新失败，请稍后重试');
    }
  };

  // 处理移除药材
  const handleRemoveHerb = async (herbId: number) => {
    try {
      const response = await axiosInstance.delete(COURSE_HERB_API.REMOVE_HERB_FROM_COURSE(courseId, herbId));
      if (response.data.code === 0) {
        message.success('药材移除成功');
        fetchCourseHerbIds(); // 刷新关联药材列表
      } else {
        message.error('药材移除失败');
      }
    } catch (error) {
      console.error('移除药材错误:', error);
      message.error('药材移除失败，请稍后重试');
    }
  };

  // 获取课程关联的药材详情
  const courseHerbs = allHerbs.filter(herb => courseHerbIds.includes(herb.id));

  // 获取可添加的药材（未关联的）
  const availableHerbs = allHerbs.filter(herb => !courseHerbIds.includes(herb.id));

  // 关联药材列表列定义
  const columns = [
    {
      title: '药材名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '别名',
      dataIndex: 'alias',
      key: 'alias',
      render: (text: string) => text || '-',
    },
    {
      title: '描述',
      dataIndex: 'des',
      key: 'des',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Herb) => (
        <Space size="middle">
          <Tooltip title="查看药材详情">
            <Button 
              type="link" 
              icon={<SearchOutlined />} 
              onClick={() => window.open(`/main/herb?id=${record.name}`, '_blank')}
            />
          </Tooltip>
          <Tooltip title="移除药材">
            <Popconfirm
              title="确定要移除这个药材吗?"
              onConfirm={() => handleRemoveHerb(record.id)}
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
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">课程关联药材管理</h3>
        {canLinkHerb && (
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={showModal}
          >
            关联药材
          </Button>
        )}
      </div>

      {courseHerbs.length > 0 ? (
        <Table 
          columns={columns} 
          dataSource={courseHerbs.map(herb => ({ ...herb, key: herb.id }))} 
          loading={loading}
          pagination={false}
        />
      ) : (
        <Empty description="暂无关联药材" />
      )}

      {/* 关联药材模态框 */}
      <Modal
        title="关联药材"
        open={isModalVisible}
        onOk={handleBatchUpdateHerbs}
        onCancel={() => setIsModalVisible(false)}
        width={800}
      >
        <div className="mb-4">
          <Input.Search
            placeholder="输入药材名称搜索" 
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onSearch={handleSearch}
            style={{ width: '300px' }}
          />
        </div>

        <div className="max-h-96 overflow-y-auto">
          {availableHerbs.length > 0 ? (
            <Table 
              rowSelection={{
                type: 'checkbox',
                selectedRowKeys: selectedHerbIds,
                onChange: (selectedRowKeys) => {
                  setSelectedHerbIds(selectedRowKeys as number[]);
                },
              }}
              columns={[
                {
                  title: '药材名称',
                  dataIndex: 'name',
                  key: 'name',
                },
                {
                  title: '别名',
                  dataIndex: 'alias',
                  key: 'alias',
                  render: (text: string) => text || '-',
                },
                {
                  title: '描述',
                  dataIndex: 'des',
                  key: 'des',
                  ellipsis: true,
                  render: (text: string) => text || '-',
                },
              ]} 
              dataSource={availableHerbs
                .filter(herb => 
                  !searchValue || 
                  herb.name.toLowerCase().includes(searchValue.toLowerCase()) ||
                  (herb.alias && herb.alias.toLowerCase().includes(searchValue.toLowerCase()))
                )
                .map(herb => ({ ...herb, key: herb.id }))} 
              pagination={false}
              size="small"
            />
          ) : (
            <Empty description="暂无可关联药材" />
          )}
        </div>

        <div className="mt-4">
          <Space>
            <Tag icon={<CheckCircleOutlined />} color="success">
              已选择 {selectedHerbIds.length} 个药材
            </Tag>
            <Button 
              type="primary" 
              icon={<LinkOutlined />} 
              onClick={handleBatchUpdateHerbs}
              disabled={selectedHerbIds.length === 0}
            >
              确认关联
            </Button>
          </Space>
        </div>
      </Modal>
    </div>
  );
}