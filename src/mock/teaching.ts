// 教学实验管理模块 mock 数据

// 课程列表
export const mockCourses = [
  {
    id: '1',
    title: '中药学基础',
    description: '介绍中药学的基本理论和常用药材。',
    categoryId: 'cat1',
    targetIds: ['t1'],
    tagIds: ['tag1', 'tag2'],
    resources: ['res1', 'res2'],
    steps: [
      { id: 's1', title: '实验准备', content: '准备实验器材和药材。', order: 1 },
      { id: 's2', title: '操作步骤', content: '按照实验流程进行操作。', order: 2 }
    ],
    status: 'published',
    sort: 1,
    relatedHerbs: ['herb1'],
    createdAt: '2024-06-01',
    updatedAt: '2024-06-10'
  },
  {
    id: '2',
    title: '实验中药鉴定',
    description: '学习常见中药材的鉴定方法。',
    categoryId: 'cat2',
    targetIds: ['t2'],
    tagIds: ['tag2', 'tag3'],
    resources: ['res3'],
    steps: [],
    status: 'draft',
    sort: 2,
    relatedHerbs: ['herb2'],
    createdAt: '2024-06-05',
    updatedAt: '2024-06-10'
  }
];

// 资源列表
export const mockResources = [
  {
    id: 'res1',
    type: 'video',
    url: '/mock/video1.mp4',
    name: '中药学基础视频',
    previewUrl: '',
    downloadCount: 12
  },
  {
    id: 'res2',
    type: 'pdf',
    url: '/mock/doc1.pdf',
    name: '中药学基础讲义',
    previewUrl: '',
    downloadCount: 8
  },
  {
    id: 'res3',
    type: 'ppt',
    url: '/mock/ppt1.pptx',
    name: '实验鉴定PPT',
    previewUrl: '',
    downloadCount: 5
  }
];

// 课程类别
export const mockCategories = [
  { id: 'cat1', name: '基础课程' },
  { id: 'cat2', name: '实验课程' },
  { id: 'cat3', name: '进阶课程' }
];

// 标签
export const mockTags = [
  { id: 'tag1', name: '理论' },
  { id: 'tag2', name: '实验' },
  { id: 'tag3', name: '鉴定' }
];

// 适用对象
export const mockTargets = [
  { id: 't1', name: '本科生' },
  { id: 't2', name: '研究生' }
];

// 统计数据
export const mockStatistics = {
  totalCourses: 2,
  totalResources: 3,
  totalCategories: 3,
  totalTags: 3,
  totalVisits: 1234
}; 