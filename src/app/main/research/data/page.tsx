// 研究数据汇总展示
"use client"
import ResearchInfoCards from "@/components/ResearchInfoCards";
import ResearchDataTable from "@/components/ResearchDataTable";

export default function ResearchData() {
    return (
        <>
            <ResearchInfoCards />
            <div className={'h-40'}></div>
            <ResearchDataTable />
        </>
    )
}