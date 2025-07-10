"use client"
import ResearchDataCreate from "@/components/research/ResearchDataCreate";
import ResearchDataUpload from "@/components/research/ResearchDataUpload";
import { Skeleton } from "antd";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

 function ResearchUpload() {
    const params = useSearchParams();
    const topicId = params.get("topicId") || "";
    const [contentId, setContentId] = useState<number>();
    const [current, setCurrent] = useState(1);
    
    const handleCreate = (contentId:number)=> {
        console.log("contentId:", contentId);
        setContentId(contentId);
        setCurrent(2);
    }
    
    return (
        <div className="flex justify-center">
            {current === 1 && <ResearchDataCreate onSuccess={handleCreate} topicId={topicId}/>}
            {current === 2  && contentId && <ResearchDataUpload contentId={contentId}/>}
        </div>
    )
}

export default function Page() {
    return (
    <Suspense fallback={<Skeleton />}>
        <ResearchUpload />
    </Suspense>
    )
}