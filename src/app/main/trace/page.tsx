"use client"
import {useSearchParams} from "next/navigation";
import TraceInfo from "@/components/TraceInfo";

export default function TracePage() {
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