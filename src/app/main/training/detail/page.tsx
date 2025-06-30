// 展示某门培训课程的详细信息
"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, Rate, Button, Image, Typography, Divider } from "antd";

const { Title, Paragraph, Text } = Typography;

// 模拟数据
const trainingData = {
    '1': {
        title: '人参鉴定与应用',
        category: '根茎类药材',
        imageUrl: '/images/金钱草.webp',
        description: '学习人参的鉴别特征、药用价值及临床应用。本课程涵盖人参的植物学特征、化学成分、药理作用及在中医药中的具体应用方法。',
        content: '人参是一种多年生草本植物，其主要活性成分包括人参皂苷、多糖和挥发油。人参具有增强免疫力、抗疲劳、改善记忆功能等多种药理作用，在中医临床上广泛用于治疗气虚、阳虚等症状。本课程将详细介绍人参的不同品种、质量鉴别方法、炮制工艺以及现代研究进展。',
        rating: 4.5,
        reviews: [
            { id: 1, user: '张医生', score: 5, comment: '内容非常专业详细，对临床实践有很大帮助！' },
            { id: 2, user: '李药师', score: 4, comment: '系统地讲解了人参的药用价值，建议增加更多实际案例分析。' },
            { id: 3, user: '王研究员', score: 5, comment: '现代研究部分非常前沿，期待后续更新更多研究成果。' }
        ]
    },
    '2': {
        title: '当归种植技术',
        category: '中药材栽培',
        imageUrl: '/images/金钱草.webp',
        description: '掌握当归的种植环境、栽培技术和采收加工方法。本课程重点讲解当归生长特性、土壤选择、病虫害防治等关键技术要点。',
        content: '当归（Angelica sinensis）是一种重要的传统中药材，其生长周期为两年。本课程详细解析当归种植的全过程：\n\n1. 生长环境要求：当归喜欢凉爽湿润的气候，适宜生长温度为15-20℃，需要充足的光照但忌强光直射。\n\n2. 土壤选择：以排水良好、富含有机质的沙壤土或壤土为佳，pH值6.5-7.5最为适宜。\n\n3. 种植技术要点：\n   - 育苗阶段：选择无病害的优质种子，采用条播方式播种\n   - 移栽定植：控制合理密度，注意保持土壤湿度\n   - 田间管理：定期除草、适时追肥、及时疏花\n\n4. 病虫害防治：针对叶斑病、根腐病、蚜虫等常见问题提供综合防治方案。\n\n5. 采收加工：指导最佳采收时间、清洗处理、干燥保存等环节的技术要点。\n\n通过本课程的学习，学员可以全面掌握当归种植的关键技术，提高药材产量和品质。',
        rating: 4.2,
        reviews: [
            { id: 1, user: '陈农户', score: 5, comment: '种植技巧讲得很实用，按照课程的方法，我的产量提高了20%！' },
            { id: 2, user: '刘专家', score: 4, comment: '基础理论扎实，希望增加不同地区种植差异的讨论。' },
            { id: 3, user: '赵学生', score: 4, comment: '图文并茂，容易理解，对我毕业论文帮助很大。' }
        ]
    },
    '3': {
        title: '黄连的炮制工艺',
        category: '中药加工',
        imageUrl: '/images/金钱草.webp',
        description: '了解黄连的不同炮制方法及其药效变化。本课程深入解析黄连炮制的科学原理和实际操作技术。',
        content: '黄连是毛茛科植物黄连的干燥根茎，含有多种生物碱类有效成分。本课程详细介绍了黄连的传统炮制方法和现代改进技术，并分析了不同炮制工艺对药效的影响。\n\n## 一、黄连的主要成分\n- 小檗碱（Berberine）：主要抗菌成分\n- 黄连素：具有抗炎、降压作用\n- 其他生物碱：如巴马汀、药根碱等\n\n## 二、传统炮制方法\n1. 酒炙法：使用黄酒进行浸泡后炒制\n2. 姜制法：生姜汁拌匀后闷润炒干\n3. 吴茱萸制法：吴茱萸煎汤后与黄连共煮\n\n## 三、现代炮制技术\n- 微波炮制：快速均匀加热，有效成分损失少\n- 酶解技术：利用特定酶类提高有效成分提取率\n- 控温发酵：优化微生物转化条件，提升药效\n\n## 四、炮制对药效的影响\n1. 提高有效成分溶出率：适当炮制可使小檗碱溶出率提高30%\n2. 改变药性：姜制黄连可降低苦寒之性，增强止呕作用\n3. 减低毒性：高温处理可降低某些刺激性成分\n\n## 五、质量控制标准\n- 外观：条粗壮、断面金黄色\n- 水分含量：不超过12%\n- 灰分含量：不超过5%\n- 有效成分含量：小檗碱含量不低于3.6%',
        rating: 4.7,
        reviews: [
            { id: 1, user: '孙药师', score: 5, comment: '非常专业的炮制技术讲解，对实验室研究很有参考价值。' },
            { id: 2, user: '周教授', score: 5, comment: '从历史文献到现代研究都讲得很透彻，值得推荐！' },
            { id: 3, user: '吴生产经理', score: 4, comment: '工业级炮制流程介绍很实用，建议增加设备选型指南。' }
        ]
    }
};

export default function TrainingDetailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const key = searchParams.get('key') || '1';

    // 获取当前课程数据
    const data = trainingData[key] || {
        title: '未知课程',
        category: '未分类',
        imageUrl: '',
        description: '没有找到相关的课程信息',
        content: '',
        rating: 0,
        reviews: []
    };

    // 返回按钮点击事件
    const handleBackClick = () => {
        router.back();
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* 返回按钮 */}
            <Button type="link" onClick={handleBackClick} className="mb-4">
                &lt; 返回列表
            </Button>

            {/* 课程卡片 */}
            <Card
                className="shadow-lg"
                cover={
                    <Image
                        src={data.imageUrl}
                        alt={data.title}
                        height={400}
                        className="object-cover"
                    />
                }
            >
                {/* 标题区域 */}
                <div className="flex justify-between items-start mb-4">
                    <Title level={2} className="text-2xl font-bold">{data.title}</Title>
                    <div className="text-right">
                        <Text className="block text-gray-500 mb-2">{data.category}</Text>
                        <Rate disabled value={data.rating} className="text-xl" />
                        <Text className="ml-2">({data.rating})</Text>
                    </div>
                </div>

                {/* 描述 */}
                <Paragraph className="text-gray-700 mb-6">
                    {data.description}
                </Paragraph>

                <Divider />

                {/* 主要内容 */}
                <div className="mb-8">
                    <Title level={3} className="text-xl font-semibold mb-4">课程内容</Title>
                    <Paragraph className="whitespace-pre-line text-gray-600">
                        {data.content}
                    </Paragraph>
                </div>

                <Divider />

                {/* 用户评价 */}
                <div>
                    <Title level={3} className="text-xl font-semibold mb-4">用户评价</Title>

                    {data.reviews.length === 0 ? (
                        <Text type="secondary" className="text-gray-500">暂无评价</Text>
                    ) : (
                        <div className="space-y-6">
                            {data.reviews.map(review => (
                                <div key={review.id} className="border-b border-gray-100 pb-4">
                                    <div className="flex justify-between mb-2">
                                        <Text strong>{review.user}</Text>
                                        <Rate disabled value={review.score} size="small" />
                                    </div>
                                    <Paragraph className="text-gray-600">{review.comment}</Paragraph>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
