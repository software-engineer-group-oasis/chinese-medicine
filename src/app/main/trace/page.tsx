"use client"
import {useSearchParams} from "next/navigation";
import TraceInfo from "@/components/TraceInfo";
import { Suspense } from "react";
import { Skeleton } from "antd";

function TracePage() {
    const params =  useSearchParams();
    const herbName = params.get('herbName');

    return (
        <>
            {
                herbName && (
                    <>
                        <h1 className={"font-bold text-3xl py-4 mx-auto w-fit"}>中药信息溯源</h1>
                        <TraceInfo herbName={herbName} />
                    </>
                )
            }
        </>
    )
}

export default function Page() {
    return (
        <Suspense fallback={<Skeleton active/>}>
            <TracePage />
        </Suspense>
    )
}