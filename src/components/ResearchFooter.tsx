
const data = [
    {
        name:'科学数据中心',
        value: 32,
    },
    {
        name: '汇交项目',
        value: 453,
    },
    {
        name: '在线数据集',
        value: 100138,
    },
]

export default function ResearchFooter() {
    return (
        <footer>
            <ul className={'flex justify-center gap-10 font-bold rounded-md backdrop-blur-2xl px-12 py-4'}>
                {
                    data.map((item, index) => (
                        <li key={index}>
                            <p>{item.name}</p>
                            <p className={'text-blue-500'}>{item.value}</p>
                        </li>
                    ))
                }
            </ul>
        </footer>
    )
}