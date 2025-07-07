
import {LayoutProps} from "@/app/admin/layout";
import Link from "next/link";
import { BsGeoAlt } from "react-icons/bs";
import { TbCategoryPlus } from "react-icons/tb";
import { CiRoute } from "react-icons/ci";

const routes = [
    {name: "地理信息", value: "/admin/herb/geo", icon: ()=> <BsGeoAlt />},
    {name: "中药详情", value: "/admin/herb/category", icon: ()=> <TbCategoryPlus />},
    {name: "药材溯源", value: "/admin/herb/growth", icon: ()=> <CiRoute />}
]

export default function AdminHerbLayout({children}:LayoutProps) {
    return (
        <>
            <div className={"min-h-[100%] flex gap-16"}>
                <nav className={'bg-zinc-500 flex flex-col gap-4 py-4 rounded-md'}>{
                    routes.map((route, index) => (
                        <Link href={route.value} key={index} className={"hover:bg-zinc-400 w-full px-2 text-zinc-50 text-xl flex gap-1 items-center py-1"}
                            style={{transition:"all 0.3s ease-in-out"}}
                        >{route.icon()} {route.name}</Link>
                    ))
                }</nav>
                <div className={"flex-1"}>{children}</div>
            </div>
        </>
    );
}
