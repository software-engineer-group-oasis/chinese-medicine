
const treeOrigins = [
    {
        origin: '石柱县（黄连之乡）',
        description: '石柱是全国最大的黄连种植基地，所产黄连（味连）以“条粗、色黄、味苦”著称，药用价值极高，被誉为“黄连之乡”。',
        image: '/images/石柱县.webp'
    },
    {
        origin: '秀山县（金银花之乡）',
        description: '秀山是西南地区最大的金银花产区，花蕾饱满、绿原酸含量高，广泛用于清热解毒类药品。',
        image: '/images/秀山县.webp'
    },
    {
        origin: '巫溪县（独活之乡）',
        description: '巫溪独活根茎粗壮、香气浓郁，是治疗风湿痹痛的重要药材，产量占全国重要份额。',
        image: '/images/巫溪县.jpg'
    }
]

export default function TreeOrigins() {
    return (
        <div className={'flex gap-10 justify-center py-8 max-w-[80%] mx-auto'}>
            {
                treeOrigins.map((treeOrigin, index) => (
                    <div key={index} className={'flex flex-col py-4 px-2 items-center rounded-md transition-all duration-300 hover:bg-green-500 hover:shadow-lg'}>
                        <img src={treeOrigin.image} alt={treeOrigin.origin} className={'rounded-md w-40 h-40 object-cover'} />
                        <p className={'text-xl font-bold py-4'}>{treeOrigin.origin}</p>
                        <p className={'text-xs text-center w-60'}>{treeOrigin.description}</p>
                    </div>
                ))
            }
        </div>
    )
}