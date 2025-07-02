// 工作业绩管理模块的模拟数据

// 业绩类型
export const mockPerformanceTypes = [
  { id: '1', name: '教学成果', weight: 0.4, description: '包括教学质量、学生评价、教学创新等' },
  { id: '2', name: '科研成果', weight: 0.3, description: '包括论文发表、专利、项目立项等' },
  { id: '3', name: '学术贡献', weight: 0.2, description: '包括学术会议、学术交流、学术组织等' },
  { id: '4', name: '社会服务', weight: 0.1, description: '包括社会实践、志愿服务、社会影响等' },
];

// 业绩状态
export type PerformanceStatus = 'pending' | 'approved' | 'rejected';

// 业绩评分标准
export const mockScoreStandards = [
  {
    typeId: '1', // 教学成果
    criteria: [
      { id: '1-1', name: '教学质量', weight: 0.4, description: '课堂教学质量评价' },
      { id: '1-2', name: '学生评价', weight: 0.3, description: '学生对教师的评价' },
      { id: '1-3', name: '教学创新', weight: 0.2, description: '教学方法和内容的创新' },
      { id: '1-4', name: '教学成果', weight: 0.1, description: '教学成果的应用和推广' },
    ]
  },
  {
    typeId: '2', // 科研成果
    criteria: [
      { id: '2-1', name: '论文质量', weight: 0.4, description: '论文的影响因子和引用次数' },
      { id: '2-2', name: '项目级别', weight: 0.3, description: '科研项目的级别和规模' },
      { id: '2-3', name: '成果转化', weight: 0.2, description: '科研成果的转化和应用' },
      { id: '2-4', name: '团队贡献', weight: 0.1, description: '在科研团队中的贡献' },
    ]
  },
  {
    typeId: '3', // 学术贡献
    criteria: [
      { id: '3-1', name: '学术影响', weight: 0.4, description: '学术影响力和知名度' },
      { id: '3-2', name: '会议参与', weight: 0.3, description: '学术会议的参与和贡献' },
      { id: '3-3', name: '学术组织', weight: 0.2, description: '学术组织和活动的参与' },
      { id: '3-4', name: '同行评价', weight: 0.1, description: '同行专家的评价' },
    ]
  },
  {
    typeId: '4', // 社会服务
    criteria: [
      { id: '4-1', name: '服务时长', weight: 0.3, description: '社会服务的时长' },
      { id: '4-2', name: '服务质量', weight: 0.3, description: '社会服务的质量和效果' },
      { id: '4-3', name: '社会影响', weight: 0.2, description: '社会服务的影响和反响' },
      { id: '4-4', name: '创新性', weight: 0.2, description: '社会服务的创新性和特色' },
    ]
  },
];

// 业绩记录
export interface PerformanceRecord {
  id: string;
  userId: string;
  userName: string;
  department: string;
  position: string;
  title: string;
  typeId: string;
  typeName: string;
  description: string;
  attachments: {
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }[];
  submitTime: string;
  status: PerformanceStatus;
  reviewerId?: string;
  reviewerName?: string;
  reviewTime?: string;
  score?: number;
  comment?: string;
  auditLogs?: {
    id: string;
    time: string;
    operator: string;
    action: string;
    content: string;
  }[];
}

// 模拟业绩记录数据
export const mockPerformanceRecords: PerformanceRecord[] = [
  {
    id: '1',
    userId: '2',
    userName: '张教授',
    department: '中医学院',
    position: '教授',
    title: '中医药学教学改革与创新',
    typeId: '1',
    typeName: '教学成果',
    description: '通过引入现代教学技术和方法，对传统中医药学教学进行改革与创新，提高教学质量和效果。',
    attachments: [
      { id: '1-1', name: '教学改革方案.pdf', url: '/uploads/教学改革方案.pdf', type: 'application/pdf', size: 2048000 },
      { id: '1-2', name: '教学效果分析报告.docx', url: '/uploads/教学效果分析报告.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1536000 },
    ],
    submitTime: '2023-04-15 09:30:00',
    status: 'approved',
    reviewerId: '1',
    reviewerName: '系统管理员',
    reviewTime: '2023-04-20 14:20:00',
    score: 92,
    comment: '教学改革方案设计合理，实施效果良好，学生反馈积极。建议进一步扩大应用范围，形成可推广的教学模式。',
    auditLogs: [
      { id: '1-1', time: '2023-04-15 09:30:00', operator: '张教授', action: '提交', content: '提交业绩记录' },
      { id: '1-2', time: '2023-04-18 10:15:00', operator: '系统管理员', action: '审核', content: '初步审核通过，等待最终评分' },
      { id: '1-3', time: '2023-04-20 14:20:00', operator: '系统管理员', action: '评分', content: '最终评分：92分，审核通过' },
    ],
  },
  {
    id: '2',
    userId: '3',
    userName: '李副教授',
    department: '中医学院',
    position: '副教授',
    title: '中药材质量评价方法研究',
    typeId: '2',
    typeName: '科研成果',
    description: '研究开发了一种基于多指标综合评价的中药材质量评价方法，可以更加客观、全面地评价中药材质量。',
    attachments: [
      { id: '2-1', name: '研究论文.pdf', url: '/uploads/研究论文.pdf', type: 'application/pdf', size: 3072000 },
      { id: '2-2', name: '实验数据.xlsx', url: '/uploads/实验数据.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 2048000 },
      { id: '2-3', name: '评价方法说明.pptx', url: '/uploads/评价方法说明.pptx', type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', size: 5120000 },
    ],
    submitTime: '2023-05-10 15:45:00',
    status: 'approved',
    reviewerId: '1',
    reviewerName: '系统管理员',
    reviewTime: '2023-05-15 11:30:00',
    score: 88,
    comment: '研究方法科学，实验设计合理，研究成果具有一定的创新性和应用价值。建议进一步完善评价指标体系，增强方法的适用性。',
    auditLogs: [
      { id: '2-1', time: '2023-05-10 15:45:00', operator: '李副教授', action: '提交', content: '提交业绩记录' },
      { id: '2-2', time: '2023-05-12 09:20:00', operator: '系统管理员', action: '审核', content: '初步审核通过，等待最终评分' },
      { id: '2-3', time: '2023-05-15 11:30:00', operator: '系统管理员', action: '评分', content: '最终评分：88分，审核通过' },
    ],
  },
  {
    id: '3',
    userId: '2',
    userName: '张教授',
    department: '中医学院',
    position: '教授',
    title: '第三届全国中医药教育教学研讨会组织工作',
    typeId: '3',
    typeName: '学术贡献',
    description: '作为组委会成员，参与组织了第三届全国中医药教育教学研讨会，负责会议的学术交流环节。',
    attachments: [
      { id: '3-1', name: '会议手册.pdf', url: '/uploads/会议手册.pdf', type: 'application/pdf', size: 4096000 },
      { id: '3-2', name: '工作总结.docx', url: '/uploads/工作总结.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1024000 },
    ],
    submitTime: '2023-03-20 16:30:00',
    status: 'approved',
    reviewerId: '1',
    reviewerName: '系统管理员',
    reviewTime: '2023-03-25 10:45:00',
    score: 85,
    comment: '会议组织工作认真负责，学术交流环节安排合理，取得了良好的效果。建议今后加强会议的国际交流合作。',
    auditLogs: [
      { id: '3-1', time: '2023-03-20 16:30:00', operator: '张教授', action: '提交', content: '提交业绩记录' },
      { id: '3-2', time: '2023-03-22 14:10:00', operator: '系统管理员', action: '审核', content: '初步审核通过，等待最终评分' },
      { id: '3-3', time: '2023-03-25 10:45:00', operator: '系统管理员', action: '评分', content: '最终评分：85分，审核通过' },
    ],
  },
  {
    id: '4',
    userId: '3',
    userName: '李副教授',
    department: '中医学院',
    position: '副教授',
    title: '社区中医药知识普及活动',
    typeId: '4',
    typeName: '社会服务',
    description: '在社区开展中医药知识普及活动，包括中医养生讲座、中药材识别教学、常见疾病的中医预防等内容。',
    attachments: [
      { id: '4-1', name: '活动方案.docx', url: '/uploads/活动方案.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1024000 },
      { id: '4-2', name: '活动照片.zip', url: '/uploads/活动照片.zip', type: 'application/zip', size: 10240000 },
      { id: '4-3', name: '反馈调查表.xlsx', url: '/uploads/反馈调查表.xlsx', type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', size: 512000 },
    ],
    submitTime: '2023-05-05 09:15:00',
    status: 'pending',
    auditLogs: [
      { id: '4-1', time: '2023-05-05 09:15:00', operator: '李副教授', action: '提交', content: '提交业绩记录' },
    ],
  },
  {
    id: '5',
    userId: '2',
    userName: '张教授',
    department: '中医学院',
    position: '教授',
    title: '中医经典著作翻译与注释',
    typeId: '2',
    typeName: '科研成果',
    description: '对《黄帝内经》进行了现代汉语翻译与注释，并加入了现代医学的解读，使经典著作更易于理解和应用。',
    attachments: [
      { id: '5-1', name: '翻译样章.pdf', url: '/uploads/翻译样章.pdf', type: 'application/pdf', size: 5120000 },
      { id: '5-2', name: '出版合同.pdf', url: '/uploads/出版合同.pdf', type: 'application/pdf', size: 1024000 },
    ],
    submitTime: '2023-04-25 14:00:00',
    status: 'rejected',
    reviewerId: '1',
    reviewerName: '系统管理员',
    reviewTime: '2023-04-28 16:30:00',
    score: 65,
    comment: '翻译工作尚未完成，提交的材料不完整，无法全面评价成果质量。建议完成全部翻译工作后再提交业绩申报。',
    auditLogs: [
      { id: '5-1', time: '2023-04-25 14:00:00', operator: '张教授', action: '提交', content: '提交业绩记录' },
      { id: '5-2', time: '2023-04-28 16:30:00', operator: '系统管理员', action: '驳回', content: '材料不完整，驳回申请' },
    ],
  },
  {
    id: '6',
    userId: '3',
    userName: '李副教授',
    department: '中医学院',
    position: '副教授',
    title: '中医药学本科教材编写',
    typeId: '1',
    typeName: '教学成果',
    description: '参与编写了《中医药学基础》本科教材，负责其中的中药学部分，融入了最新的研究成果和教学经验。',
    attachments: [
      { id: '6-1', name: '教材样章.pdf', url: '/uploads/教材样章.pdf', type: 'application/pdf', size: 3072000 },
      { id: '6-2', name: '编写大纲.docx', url: '/uploads/编写大纲.docx', type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', size: 1024000 },
    ],
    submitTime: '2023-05-12 11:20:00',
    status: 'pending',
    auditLogs: [
      { id: '6-1', time: '2023-05-12 11:20:00', operator: '李副教授', action: '提交', content: '提交业绩记录' },
    ],
  },
];

// 业绩统计数据
export const mockPerformanceStats = {
  totalCount: 6,
  approvedCount: 3,
  pendingCount: 2,
  rejectedCount: 1,
  typeDistribution: [
    { type: '教学成果', count: 2, avgScore: 92 },
    { type: '科研成果', count: 2, avgScore: 76.5 },
    { type: '学术贡献', count: 1, avgScore: 85 },
    { type: '社会服务', count: 1, avgScore: 0 },
  ],
  monthlySubmission: [
    { month: '1月', count: 0 },
    { month: '2月', count: 0 },
    { month: '3月', count: 1 },
    { month: '4月', count: 2 },
    { month: '5月', count: 3 },
    { month: '6月', count: 0 },
  ],
  departmentDistribution: [
    { department: '中医学院', count: 6, avgScore: 82.5 },
  ],
};