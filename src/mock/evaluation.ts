//herbs和ranking中使用
// 模拟中药数据
export const mockHerbs = [
    {
      id: 1,
      name: '黄连',
      latinName: 'Coptis chinensis',
      image: '/images/黄连.jpg',
      score: 4.8,
      rank: 1,
      region: '重庆石柱',
      efficacy: '清热燥湿、泻火解毒',
      usage: '治疗湿热腹泻、心烦口渴、目赤肿痛等症',
      feature: '重庆最著名的道地药材之一',
      price: 280,
      priceChange: '+5%',
      demand: '高',
      reviews: 128,
      quality: 'A+',
      tags: ['道地药材', '名贵', '热销']
    },
    {
      id: 2,
      name: '党参',
      latinName: 'Codonopsis pilosula',
      image: '/images/黄连.jpg', // 替代图片
      score: 4.6,
      rank: 2,
      region: '甘肃岷县',
      efficacy: '补中益气、健脾益肺',
      usage: '适用于脾肺气虚、食少倦怠、咳嗽气短等',
      feature: '质地松软，断面平整，气味特殊',
      price: 120,
      priceChange: '+2%',
      demand: '中高',
      reviews: 96,
      quality: 'A',
      tags: ['补气', '常用']
    },
    {
      id: 3,
      name: '川芎',
      latinName: 'Ligusticum chuanxiong',
      image: '/images/黄连.jpg', // 替代图片
      score: 4.5,
      rank: 3,
      region: '四川都江堰',
      efficacy: '活血行气，祛风止痛',
      usage: '用于月经不调、经闭痛经、头痛眩晕等',
      feature: '气味芳香浓烈，为常用活血化瘀药',
      price: 85,
      priceChange: '+1%',
      demand: '中',
      reviews: 88,
      quality: 'A',
      tags: ['活血', '祛风']
    },
    {
      id: 4,
      name: '当归',
      latinName: 'Angelica sinensis',
      image: '/images/黄连.jpg', // 替代图片
      score: 4.7,
      rank: 4,
      region: '甘肃岷县',
      efficacy: '补血活血，调经止痛',
      usage: '用于血虚萎黄、月经不调、虚寒腹痛等',
      feature: '气味芳香，甜中带苦，为补血良药',
      price: 150,
      priceChange: '+3%',
      demand: '高',
      reviews: 105,
      quality: 'A',
      tags: ['补血', '名贵']
    },
    {
      id: 5,
      name: '三七',
      latinName: 'Panax notoginseng',
      image: '/images/黄连.jpg', // 替代图片
      score: 4.9,
      rank: 5,
      region: '云南文山',
      efficacy: '散瘀止血，消肿定痛',
      usage: '用于咯血、吐血、外伤出血、跌打损伤等',
      feature: '云南特产，被誉为"金不换"',
      price: 350,
      priceChange: '+8%',
      demand: '极高',
      reviews: 156,
      quality: 'A+',
      tags: ['名贵', '止血', '热销']
    },
    {
      id: 6,
      name: '枸杞',
      latinName: 'Lycium barbarum',
      image: '/images/黄连.jpg', // 替代图片
      score: 4.4,
      rank: 6,
      region: '宁夏中宁',
      efficacy: '滋补肝肾，明目',
      usage: '用于肝肾阴虚、头晕目眩、视力减退等',
      feature: '宁夏特产，营养丰富',
      price: 80,
      priceChange: '0%',
      demand: '中高',
      reviews: 92,
      quality: 'B+',
      tags: ['滋补', '日常']
    },
    {
      id: 7,
      name: '白芍',
      latinName: 'Paeonia lactiflora',
      image: '/images/黄连.jpg', // 替代图片
      score: 4.3,
      rank: 7,
      region: '安徽亳州',
      efficacy: '养血调经，敛阴止汗',
      usage: '用于月经不调、自汗盗汗、腹痛腹泻等',
      feature: '色白质优，药用价值高',
      price: 95,
      priceChange: '-1%',
      demand: '中',
      reviews: 78,
      quality: 'B+',
      tags: ['养血', '常用']
    },
    {
      id: 8,
      name: '天麻',
      latinName: 'Gastrodia elata',
      image: '/images/黄连.jpg', // 替代图片
      score: 4.5,
      rank: 8,
      region: '四川绵阳',
      efficacy: '息风止痉，平抑肝阳',
      usage: '用于头痛眩晕、肢体麻木、小儿惊风等',
      feature: '质地细腻，断面呈淡黄色',
      price: 180,
      priceChange: '+4%',
      demand: '中高',
      reviews: 85,
      quality: 'A',
      tags: ['名贵', '止痉']
    },
    {
      id: 9,
      name: '黄芪',
      latinName: 'Astragalus membranaceus',
      image: '/images/黄连.jpg', // 替代图片
      score: 4.2,
      rank: 9,
      region: '内蒙古',
      efficacy: '补气固表，利水消肿',
      usage: '用于气虚乏力、自汗、水肿等',
      feature: '质地坚实，断面纤维性强',
      price: 60,
      priceChange: '-2%',
      demand: '中',
      reviews: 72,
      quality: 'B',
      tags: ['补气', '常用']
    },
    {
      id: 10,
      name: '石斛',
      latinName: 'Dendrobium nobile',
      image: '/images/黄连.jpg', // 替代图片
      score: 4.7,
      rank: 10,
      region: '云南西双版纳',
      efficacy: '养阴清热，益胃生津',
      usage: '用于阴虚发热、口干咽燥、胃阴不足等',
      feature: '茎节明显，质地坚韧',
      price: 320,
      priceChange: '+6%',
      demand: '高',
      reviews: 98,
      quality: 'A',
      tags: ['名贵', '养阴']
    }
  ];

// 模拟地区排名数据
export const regionRankings = [
    { region: '重庆石柱', score: 4.9, herbs: ['黄连', '厚朴', '杜仲'], quality: 'A+', production: 1200, change: '+5%' },
    { region: '云南文山', score: 4.8, herbs: ['三七', '石斛', '重楼'], quality: 'A+', production: 1500, change: '+8%' },
    { region: '甘肃岷县', score: 4.7, herbs: ['党参', '当归', '黄芪'], quality: 'A', production: 1800, change: '+3%' },
    { region: '四川都江堰', score: 4.6, herbs: ['川芎', '川贝', '天麻'], quality: 'A', production: 1300, change: '+2%' },
    { region: '安徽亳州', score: 4.5, herbs: ['白芍', '牡丹皮', '柴胡'], quality: 'A', production: 2200, change: '+1%' },
    { region: '宁夏中宁', score: 4.4, herbs: ['枸杞', '甘草', '麻黄'], quality: 'B+', production: 1100, change: '0%' },
    { region: '内蒙古', score: 4.3, herbs: ['黄芪', '防风', '柴胡'], quality: 'B+', production: 1600, change: '-1%' },
    { region: '云南西双版纳', score: 4.7, herbs: ['石斛', '重楼', '血竭'], quality: 'A', production: 900, change: '+6%' },
    { region: '四川绵阳', score: 4.5, herbs: ['天麻', '川芎', '黄柏'], quality: 'A', production: 1000, change: '+4%' },
    { region: '湖北恩施', score: 4.4, herbs: ['天麻', '杜仲', '五味子'], quality: 'B+', production: 1200, change: '+2%' }
  ];

//application中使用
  // 模拟申报模板数据
export const applicationTemplates = [
    { id: '1', name: '非物质文化遗产申报模板', type: '国家级', lastUpdated: '2023-10-15' },
    { id: '2', name: '地理标志产品保护申报模板', type: '省级', lastUpdated: '2023-09-22' },
    { id: '3', name: '中药材品质认证申报模板', type: '行业标准', lastUpdated: '2023-11-05' },
    { id: '4', name: '道地药材认定申报模板', type: '国家级', lastUpdated: '2023-08-18' },
  ];
  
  // 模拟药材评价数据
export const herbEvaluations = [
    {
      id: '1',
      herbName: '黄连',
      latinName: 'Coptis chinensis',
      origin: '重庆石柱',
      evaluationCount: 56,
      averageScore: 4.7,
      lastEvaluated: '2023-11-20',
      qualityLevel: '优秀',
    },
    {
      id: '2',
      herbName: '党参',
      latinName: 'Codonopsis pilosula',
      origin: '甘肃岷县',
      evaluationCount: 42,
      averageScore: 4.2,
      lastEvaluated: '2023-11-18',
      qualityLevel: '良好',
    },
    {
      id: '3',
      herbName: '川芎',
      latinName: 'Ligusticum chuanxiong',
      origin: '四川都江堰',
      evaluationCount: 38,
      averageScore: 4.5,
      lastEvaluated: '2023-11-15',
      qualityLevel: '优秀',
    },
    {
      id: '4',
      herbName: '当归',
      latinName: 'Angelica sinensis',
      origin: '甘肃岷县',
      evaluationCount: 45,
      averageScore: 3.8,
      lastEvaluated: '2023-10-25',
      qualityLevel: '良好',
    },
  ];

  // 模拟申报要求数据
export const applicationRequirements = [
    { id: '1', name: '基本信息', required: true, description: '包括药材名称、产地、历史沿革等基本信息' },
    { id: '2', name: '质量评价报告', required: true, description: '药材质量评价的详细报告，包括外观、成分等维度' },
    { id: '3', name: '生产工艺', required: true, description: '药材的种植、采收、加工等工艺流程' },
    { id: '4', name: '特色与价值', required: true, description: '药材的特色、价值及其在医药学上的意义' },
    { id: '5', name: '历史文献', required: false, description: '相关历史文献记载及考证' },
    { id: '6', name: '图片资料', required: true, description: '药材外观、生长环境、加工过程等图片' },
    { id: '7', name: '检测报告', required: true, description: '权威机构出具的检测报告' },
    { id: '8', name: '专家意见', required: false, description: '行业专家对药材质量的评价意见' },
  ];