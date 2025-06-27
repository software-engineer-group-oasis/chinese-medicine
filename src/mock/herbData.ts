export interface HerbDetail {
  name: string;
  scientificName: string;
  origin: string;
  effect: string;
  usage: string;
  feature: string;
  img: string;
  property: string;
  part: string;
}

export const herbDetails: HerbDetail[] = [
  {
    name: "黄连",
    scientificName: "Coptis chinensis",
    origin: "重庆石柱土家族自治县（中国黄连之乡）",
    effect: "清热燥湿、泻火解毒",
    usage: "治疗湿热腹泻、心烦口渴、目赤肿痛等症",
    feature: "重庆最著名的道地药材之一",
    img: "/images/黄连.jpg",
    property: "苦",
    part: "根"
  },
  {
    name: "丁香",
    scientificName: "Syzygium aromaticum",
    origin: "主产于中国、印尼、马达加斯加等地",
    effect: "温中降逆，温肾助阳",
    usage: "用于脘腹冷痛、呕吐、呃逆、肾虚阳痿等",
    feature: "花蕾为药用部分，香气浓郁",
    img: "/images/何首乌.webp",
    property: "温",
    part: "花"
  },
  {
    name: "川木通",
    scientificName: "Akebia trifoliata",
    origin: "主产于中国四川、湖北等地",
    effect: "利尿通淋，清热利湿",
    usage: "用于小便不利、水肿、湿热淋证等",
    feature: "藤茎为药用部分，质地坚韧",
    img: "/images/川贝母.jpg",
    property: "寒",
    part: "茎"
  },
  {
    name: "紫苏叶",
    scientificName: "Perilla frutescens",
    origin: "中国各地均有分布",
    effect: "解表散寒，理气宽中",
    usage: "用于感冒风寒、咳嗽、胸闷等",
    feature: "叶片紫绿色，芳香浓郁",
    img: "/images/金钱草.webp",
    property: "温",
    part: "叶"
  },
  {
    name: "桂枝",
    scientificName: "Cinnamomum cassia",
    origin: "主产于中国广西、广东等地",
    effect: "发汗解肌，温经通脉",
    usage: "用于风寒感冒、关节疼痛等",
    feature: "嫩枝为药用部分，气味芳香",
    img: "/images/黄连.jpg",
    property: "温",
    part: "茎"
  },
  {
    name: "麻黄",
    scientificName: "Ephedra sinica",
    origin: "主产于中国北方干旱地区",
    effect: "发汗解表，宣肺平喘",
    usage: "用于风寒感冒、咳嗽气喘等",
    feature: "茎为药用部分，含麻黄碱",
    img: "/images/杜仲.webp",
    property: "温",
    part: "茎"
  },
  {
    name: "丁公藤",
    scientificName: "Tripterygium wilfordii",
    origin: "主产于中国南方地区",
    effect: "祛风除湿，通络止痛",
    usage: "用于风湿痹痛、关节炎等",
    feature: "藤茎为药用部分，有毒需谨慎",
    img: "/images/秀山县.webp",
    property: "苦",
    part: "茎"
  },
  {
    name: "黄精",
    scientificName: "Polygonatum sibiricum",
    origin: "主产于中国东北、华北等地",
    effect: "补气养阴，润肺益肾",
    usage: "用于体虚乏力、肺燥咳嗽等",
    feature: "根茎肥厚，质地坚实",
    img: "/images/石柱县.webp",
    property: "平",
    part: "根"
  },
  {
    name: "一枝黄花",
    scientificName: "Solidago decurrens",
    origin: "主产于中国南方地区",
    effect: "清热解毒，利咽消肿",
    usage: "用于咽喉肿痛、热毒疮疡等",
    feature: "花序金黄色，药用价值高",
    img: "/images/巫溪县.jpg",
    property: "凉",
    part: "花"
  },
  {
    name: "狗脊",
    scientificName: "Cibotium barometz",
    origin: "主产于中国南方山区",
    effect: "补肝肾，强筋骨，祛风湿",
    usage: "用于腰膝酸软、风湿痹痛等",
    feature: "根茎密被金黄色茸毛",
    img: "/images/草药.svg",
    property: "温",
    part: "根"
  },
  {
    name: "七叶一枝花",
    scientificName: "Paris polyphylla",
    origin: "主产于中国西南地区",
    effect: "清热解毒，消肿止痛",
    usage: "用于疮疡肿毒、跌打损伤等",
    feature: "叶片轮生，花单生于茎顶",
    img: "/images/flower.avif",
    property: "寒",
    part: "全草"
  },
  {
    name: "玫瑰花",
    scientificName: "Rosa rugosa",
    origin: "中国各地均有栽培",
    effect: "理气解郁，活血散瘀",
    usage: "用于肝胃气痛、月经不调等",
    feature: "花瓣为药用部分，香气浓郁",
    img: "/images/flower.avif",
    property: "温",
    part: "花"
  },
  {
    name: "山慈菇",
    scientificName: "Pleione bulbocodioides",
    origin: "主产于中国西南山区",
    effect: "清热解毒，消肿散结",
    usage: "用于痈肿疮毒、瘰疬结核等",
    feature: "假鳞茎为药用部分",
    img: "/images/flower.avif",
    property: "凉",
    part: "根"
  },
  {
    name: "天麻",
    scientificName: "Gastrodia elata",
    origin: "主产于中国西南、华中等地",
    effect: "息风止痉，平抑肝阳",
    usage: "用于头痛眩晕、肢体麻木等",
    feature: "块茎为药用部分，无叶绿素",
    img: "/images/flower.avif",
    property: "平",
    part: "根"
  },
  {
    name: "三七",
    scientificName: "Panax notoginseng",
    origin: "主产于中国云南文山等地",
    effect: "散瘀止血，消肿定痛",
    usage: "用于跌打损伤、出血等",
    feature: "根为药用部分，名贵中药材",
    img: "/images/flower.avif",
    property: "温",
    part: "根"
  },
  {
    name: "五加皮",
    scientificName: "Acanthopanax gracilistylus",
    origin: "主产于中国中南、华东等地",
    effect: "祛风湿，补肝肾，强筋骨",
    usage: "用于风湿痹痛、腰膝酸软等",
    feature: "根皮为药用部分，气味芳香",
    img: "/images/flower.avif",
    property: "辛",
    part: "根"
  },
  {
    name: "灵芷安",
    scientificName: "Lingzhian fictitious",
    origin: "西湖区湖底公园1号",
    effect: "灵动如芷，安神定志",
    usage: "用于安神定志、缓解焦虑等",
    feature: "虚构药材，安神效果显著",
    img: "/images/flower.avif",
    property: "平",
    part: "全草"
  },
  {
    name: "云茯神",
    scientificName: "Yunfushen fictitious",
    origin: "西湖区湖底公园1号",
    effect: "出自山野云端，宁心安神",
    usage: "用于宁心安神、改善睡眠",
    feature: "虚构药材，形如云团，性味甘平",
    img: "/images/flower.avif",
    property: "甘",
    part: "根"
  },
  {
    name: "夜寒花",
    scientificName: "Yehuanhua fictitious",
    origin: "西湖区湖底公园1号",
    effect: "夜中绽放，清热解毒",
    usage: "用于清热解毒、消炎降火",
    feature: "虚构药材，夜间开放，花色洁白",
    img: "/images/flower.avif",
    property: "凉",
    part: "花"
  },
  {
    name: "青黛莲",
    scientificName: "Qingdailian fictitious",
    origin: "西湖区湖底公园1号",
    effect: "色泽青幽，凉血清肝",
    usage: "用于凉血清肝、降压安神",
    feature: "虚构药材，莲叶青翠，性味苦寒",
    img: "/images/flower.avif",
    property: "寒",
    part: "叶"
  },
  {
    name: "白羽参",
    scientificName: "Baiyushen fictitious",
    origin: "西湖区湖底公园1号",
    effect: "形似羽毛，补气养元",
    usage: "用于补气养元、增强体力",
    feature: "虚构药材，根须如羽，性味甘温",
    img: "/images/flower.avif",
    property: "温",
    part: "根"
  }
]; 