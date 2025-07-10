// components/GrowthTimeline.jsx
'use client';

import { Timeline, Modal, Card } from 'antd';
import { useState } from 'react';

interface GrowthStage {
    title: string;
    time: string;
    description: string;
    image: string;
}


const growthStages:GrowthStage[] = [
    {
        title: '播种',
        time: 'Day 0',
        description: '将种子埋入土壤中，保持湿润环境以促进发芽。',
        image: '/images/黄连.jpg',
    },
    {
        title: '发芽',
        time: 'Day 3 - Day 7',
        description: '幼苗破土而出，开始进行光合作用。',
        image: '/images/黄连.jpg',
    },
    {
        title: '成长期',
        time: 'Week 2 - Week 4',
        description: '植株快速生长，需要充足的阳光和水分。',
        image: '/images/黄连.jpg',
    },
    {
        title: '开花',
        time: 'Week 5 - Week 6',
        description: '开出第一朵花，准备授粉。',
        image: '/images/黄连.jpg',
    },
    {
        title: '结果',
        time: 'Week 7 - Week 8',
        description: '花朵凋谢后形成果实，果实逐渐长大。',
        image: '/images/黄连.jpg',
    },
    {
        title: '成熟',
        time: 'Week 9 - Week 10',
        description: '果实变红，达到采摘标准。',
        image: '/images/黄连.jpg',
    },
];

export default function GrowthTimeline() {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedStage, setSelectedStage] = useState(null);

//@ts-ignore
    const handleItemClick = (stage) => {
        setSelectedStage(stage);
        setModalVisible(true);
    };

    return (
        <>
            <Timeline mode="left" style={{ marginTop: 20 }}
              items={growthStages.map(stage => ({
                  label: stage.time,
                  children: (
                      <div onClick={() => handleItemClick(stage)} style={{ cursor: 'pointer' }}>
                          {stage.title}
                      </div>
                  )
              }))}
            >
            </Timeline>

            {selectedStage && (
                <Modal
                //@ts-ignore
                    title={selectedStage.title}
                    open={modalVisible}
                    onCancel={() => setModalVisible(false)}
                    footer={null}
                >
                {/* @ts-ignore */}
                    <Card cover={<img alt={selectedStage.title} src={selectedStage.image} style={{ width: '100%' }} />}>
                    {/* @ts-ignore */}
                        <p>{selectedStage.description}</p>
                    </Card>
                </Modal>
            )}
        </>
    );
}