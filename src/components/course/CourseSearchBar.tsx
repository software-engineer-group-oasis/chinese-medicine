import { Row, Col, Input, Button, Typography } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { COURSE_CATEGORIES, COURSE_TARGETS } from '@/constants/course';
import type { CourseSearchBarProps } from '@/constTypes/course';

export default function CourseSearchBar({
  searchText,
  setSearchText,
  categoryFilter,
  setCategoryFilter,
  targetFilter,
  setTargetFilter,
}: CourseSearchBarProps) {
  return (
    <Row gutter={16} align="middle">
      <Col xs={24} md={12} lg={8}>
        <Input.Search
          placeholder="搜索课程名称、描述或相关药材..."
          enterButton={<Button type="primary" icon={<SearchOutlined />}>搜索</Button>}
          size="large"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </Col>
      <Col xs={24} md={12} lg={16}>
        <div className="flex flex-wrap gap-4 mt-4 md:mt-0">
          <div>
            <Typography.Text strong className="mr-2">课程类别:</Typography.Text>
            {COURSE_CATEGORIES.map(cat => (
              <Button
                key={cat.value}
                type={categoryFilter === cat.value ? 'primary' : 'default'}
                onClick={() => setCategoryFilter(cat.value)}
              >
                {cat.label}
              </Button>
            ))}
          </div>
          <div>
            <Typography.Text strong className="mr-2">适用对象:</Typography.Text>
            {COURSE_TARGETS.map(tar => (
              <Button
                key={tar.value}
                type={targetFilter === tar.value ? 'primary' : 'default'}
                onClick={() => setTargetFilter(tar.value)}
              >
                {tar.label}
              </Button>
            ))}
          </div>
        </div>
      </Col>
    </Row>
  );
}