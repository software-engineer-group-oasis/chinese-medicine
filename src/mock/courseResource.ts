import type { Course } from '@/constTypes/course';
// 模拟课程数据
export const mockCourses: Course[] = [
  // {
  //   id: 1,
  //   title: '中药材鉴别基础',
  //   cover: '/images/黄连.jpg',
  //   description: '学习中药材的基本鉴别方法，包括性状鉴别、显微鉴别等技术',
  //   tags: ['基础', '本科生', '鉴别'],
  //   rating: 4.8,
  //   reviews: 156,
  //   likes: 230,
  //   category: '基础课程',
  //   relatedHerbs: ['黄连', '党参', '当归'],
  //   createdAt: '2023-05-15',
  //   author: '张教授',
  //   duration: '3小时20分钟',
  //   progress: 0,
  //   experimentSteps: [
  //     { title: '步骤一', content: '准备显微镜和药材切片\n调整显微镜焦距' },
  //     { title: '步骤二', content: '观察药材横切面\n记录显微特征' },
  //     { title: '步骤三', content: '对比标准图谱\n完成鉴别报告' }
  //   ],
  //   resources: [
  //     { name: '中药材鉴别视频', type: 'video', size: '200MB', url: '/videos/鉴别基础.mp4' },
  //     { name: '中药材鉴别手册', type: 'pdf', size: '50MB', url: '/docs/鉴别手册.pdf' }
  //   ],
  //   viewCount: 1200,
  //   downloadCount: 300,
  //   authorAvatar: '/images/zhang_professor.jpg',
  //   authorTitle: '中医学教授'
  // },
  // {
  //   id: 2,
  //   title: '中药炮制工艺实验',
  //   cover: '/images/黄连.jpg',
  //   description: '详细讲解中药炮制的各种方法，包括炒、炙、蒸、煮等工艺流程',
  //   tags: ['实验', '本科生', '炮制'],
  //   rating: 4.6,
  //   reviews: 98,
  //   likes: 185,
  //   category: '实验课程',
  //   relatedHerbs: ['黄芪', '白芍', '甘草'],
  //   createdAt: '2023-06-22',
  //   author: '李教授',
  //   duration: '4小时15分钟',
  //   progress: 35,
  //   experimentSteps: [
  //     { title: '步骤一', content: '称量药材并清洗\n准备炮制器具' },
  //     { title: '步骤二', content: '进行炒制或炙制操作\n控制火候和时间' },
  //     { title: '步骤三', content: '冷却、分装\n记录炮制过程与结果' }
  //   ],
  //   resources: [
  //     { name: '中药炮制工艺视频', type: 'video', size: '250MB', url: '/videos/炮制工艺.mp4' },
  //     { name: '中药炮制实验报告模板', type: 'excel', size: '30MB', url: '/docs/炮制实验报告模板.xlsx' }
  //   ],
  //   viewCount: 900,
  //   downloadCount: 250,
  //   authorAvatar: '/images/li_professor.jpg',
  //   authorTitle: '中药炮制专家'
  // },
  // {
  //   id: 3,
  //   title: '中药化学成分分析',
  //   cover: '/images/黄连.jpg',
  //   description: '介绍中药材中常见化学成分的提取、分离与鉴定方法',
  //   tags: ['进阶', '研究生', '化学分析'],
  //   rating: 4.9,
  //   reviews: 120,
  //   likes: 210,
  //   category: '进阶课程',
  //   relatedHerbs: ['三七', '丹参', '黄芩'],
  //   createdAt: '2023-07-10',
  //   author: '王教授',
  //   duration: '5小时40分钟',
  //   progress: 75,
  //   experimentSteps: [
  //     { title: '步骤一', content: '称取药材粉末\n加入溶剂进行提取' },
  //     { title: '步骤二', content: '过滤提取液\n进行色谱分离' },
  //     { title: '步骤三', content: '分析色谱图谱\n鉴定主要成分' }
  //   ],
  //   resources: [
  //     { name: '中药化学成分分析视频', type: 'video', size: '300MB', url: '/videos/化学成分分析.mp4' },
  //     { name: '色谱分析软件', type: 'excel', size: '100MB', url: '/docs/色谱分析软件.xlsx' }
  //   ],
  //   viewCount: 1500,
  //   downloadCount: 400,
  //   authorAvatar: '/images/wang_professor.jpg',
  //   authorTitle: '中药化学专家'
  // },
  // {
  //   id: 4,
  //   title: '道地药材生产与质量控制',
  //   cover: '/images/黄连.jpg',
  //   description: '探讨道地药材的生产环境、种植技术与质量控制体系',
  //   tags: ['进阶', '研究生', '质量控制'],
  //   rating: 4.7,
  //   reviews: 88,
  //   likes: 165,
  //   category: '进阶课程',
  //   relatedHerbs: ['黄连', '杜仲', '川芎'],
  //   createdAt: '2023-08-05',
  //   author: '赵教授',
  //   duration: '4小时50分钟',
  //   progress: 20,
  //   experimentSteps: [
  //     { title: '步骤一', content: '采集土壤和药材样品\n记录采集环境' },
  //     { title: '步骤二', content: '检测药材有效成分含量\n分析质量指标' },
  //     { title: '步骤三', content: '整理实验数据\n撰写质量评估报告' }
  //   ],
  //   resources: [
  //     { name: '道地药材生产视频', type: 'video', size: '280MB', url: '/videos/道地药材生产.mp4' },
  //     { name: '质量控制标准文档', type: 'pdf', size: '60MB', url: '/docs/质量控制标准.pdf' }
  //   ],
  //   viewCount: 1100,
  //   downloadCount: 350,
  //   authorAvatar: '/images/zhao_professor.jpg',
  //   authorTitle: '药材生产与质量控制专家'
  // },
  // {
  //   id: 5,
  //   title: '中药材栽培技术',
  //   cover: '/images/黄连.jpg',
  //   description: '详解中药材的栽培环境、种植方法、田间管理等技术',
  //   tags: ['基础', '本科生', '栽培'],
  //   rating: 4.5,
  //   reviews: 76,
  //   likes: 142,
  //   category: '基础课程',
  //   relatedHerbs: ['党参', '枸杞', '金银花'],
  //   createdAt: '2023-09-12',
  //   author: '刘教授',
  //   duration: '3小时45分钟',
  //   progress: 0,
  //   experimentSteps: [
  //     { title: '步骤一', content: '选择适宜的种植地块\n整地施肥' },
  //     { title: '步骤二', content: '播种或移栽药材苗\n浇水保湿' },
  //     { title: '步骤三', content: '田间管理与病虫害防治\n定期记录生长情况' }
  //   ],
  //   resources: [
  //     { name: '中药材栽培技术视频', type: 'video', size: '220MB', url: '/videos/栽培技术.mp4' },
  //     { name: '栽培技术指导手册', type: 'pdf', size: '55MB', url: '/docs/栽培技术手册.pdf' }
  //   ],
  //   viewCount: 950,
  //   downloadCount: 270,
  //   authorAvatar: '/images/liu_professor.jpg',
  //   authorTitle: '中药材栽培专家'
  // },
  // {
  //   id: 6,
  //   title: '中药药理学研究方法',
  //   cover: '/images/黄连.jpg',
  //   description: '介绍中药药理学研究的基本方法与实验设计',
  //   tags: ['进阶', '研究生', '药理'],
  //   rating: 4.8,
  //   reviews: 92,
  //   likes: 178,
  //   category: '进阶课程',
  //   relatedHerbs: ['人参', '黄芪', '灵芝'],
  //   createdAt: '2023-10-08',
  //   author: '陈教授',
  //   duration: '6小时10分钟',
  //   progress: 0,
  //   experimentSteps: [
  //     { title: '步骤一', content: '设计药理实验方案\n准备实验动物或细胞' },
  //     { title: '步骤二', content: '给药并观察反应\n采集实验数据' },
  //     { title: '步骤三', content: '统计分析实验结果\n撰写实验报告' }
  //   ],
  //   resources: [
  //     { name: '药理学研究方法视频', type: 'video', size: '260MB', url: '/videos/药理学研究方法.mp4' },
  //     { name: '实验设计模板', type: 'excel', size: '40MB', url: '/docs/实验设计模板.xlsx' }
  //   ],
  //   viewCount: 1300,
  //   downloadCount: 320,
  //   authorAvatar: '/images/chen_professor.jpg',
  //   authorTitle: '中药药理学专家'
  // }
];
// 模拟已学习课程数据
export const mockLearningHistory = [
    {
      courseId: 3,
      lastViewedAt: '2023-11-15 14:30',
      progress: 75,
      lastPosition: '03:15:22'
    },
    {
      courseId: 2,
      lastViewedAt: '2023-11-14 10:15',
      progress: 35,
      lastPosition: '01:28:45'
    },
    {
      courseId: 4,
      lastViewedAt: '2023-11-12 16:40',
      progress: 20,
      lastPosition: '00:58:30'
    }
  ];
// 模拟视频播放进度记录
export const mockVideoProgress = {
    1: 0,
    2: 1255, // 秒
    3: 4500  // 秒
  };