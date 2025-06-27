"use client"
import Link from "next/link";
import {DatabaseTwoTone, DownCircleTwoTone, UpCircleTwoTone} from "@ant-design/icons";


const routes = [
    {
        name: '课题资料',
        path: '/research/data',
        icon: () => <DatabaseTwoTone />,
    },
    {
        name: '数据上传',
        path: '/research/upload',
        icon: () => <UpCircleTwoTone />,
    },
    {
        name: '数据下载',
        path: '/research/download',
        icon: () => <DownCircleTwoTone />,
    }
]

export default function ResearchNav() {
    return (
        <>
            <nav>
                <ul className={'flex gap-10 py-4 px-6'}>
                    {routes.map((route) => (
                        <li key={route.path}>
                            {route.icon()}
                            <Link href={route.path} className={'px-4 hover:underline hover:text-blue-400'}>{route.name}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    )
}