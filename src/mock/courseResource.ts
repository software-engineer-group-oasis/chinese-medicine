// 模拟课程数据
export const mockCourses = [
    {
      id: 1,
      title: '中药材鉴别基础',
      cover: '/images/黄连.jpg',
      description: '学习中药材的基本鉴别方法，包括性状鉴别、显微鉴别等技术',
      tags: ['基础', '本科生', '鉴别'],
      rating: 4.8,
      reviews: 156,
      likes: 230,
      category: '基础课程',
      relatedHerbs: ['黄连', '党参', '当归'],
      createdAt: '2023-05-15',
      author: '张教授',
      duration: '3小时20分钟',
      progress: 0
    },
    {
      id: 2,
      title: '中药炮制工艺实验',
      cover: '/images/黄连.jpg',
      description: '详细讲解中药炮制的各种方法，包括炒、炙、蒸、煮等工艺流程',
      tags: ['实验', '本科生', '炮制'],
      rating: 4.6,
      reviews: 98,
      likes: 185,
      category: '实验课程',
      relatedHerbs: ['黄芪', '白芍', '甘草'],
      createdAt: '2023-06-22',
      author: '李教授',
      duration: '4小时15分钟',
      progress: 35
    },
    {
      id: 3,
      title: '中药化学成分分析',
      cover: '/images/黄连.jpg',
      description: '介绍中药材中常见化学成分的提取、分离与鉴定方法',
      tags: ['进阶', '研究生', '化学分析'],
      rating: 4.9,
      reviews: 120,
      likes: 210,
      category: '进阶课程',
      relatedHerbs: ['三七', '丹参', '黄芩'],
      createdAt: '2023-07-10',
      author: '王教授',
      duration: '5小时40分钟',
      progress: 75
    },
    {
      id: 4,
      title: '道地药材生产与质量控制',
      cover: '/images/黄连.jpg',
      description: '探讨道地药材的生产环境、种植技术与质量控制体系',
      tags: ['进阶', '研究生', '质量控制'],
      rating: 4.7,
      reviews: 88,
      likes: 165,
      category: '进阶课程',
      relatedHerbs: ['黄连', '杜仲', '川芎'],
      createdAt: '2023-08-05',
      author: '赵教授',
      duration: '4小时50分钟',
      progress: 20
    },
    {
      id: 5,
      title: '中药材栽培技术',
      cover: '/images/黄连.jpg',
      description: '详解中药材的栽培环境、种植方法、田间管理等技术',
      tags: ['基础', '本科生', '栽培'],
      rating: 4.5,
      reviews: 76,
      likes: 142,
      category: '基础课程',
      relatedHerbs: ['党参', '枸杞', '金银花'],
      createdAt: '2023-09-12',
      author: '刘教授',
      duration: '3小时45分钟',
      progress: 0
    },
    {
      id: 6,
      title: '中药药理学研究方法',
      cover: '/images/黄连.jpg',
      description: '介绍中药药理学研究的基本方法与实验设计',
      tags: ['进阶', '研究生', '药理'],
      rating: 4.8,
      reviews: 92,
      likes: 178,
      category: '进阶课程',
      relatedHerbs: ['人参', '黄芪', '灵芝'],
      createdAt: '2023-10-08',
      author: '陈教授',
      duration: '6小时10分钟',
      progress: 0
    }
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