// 展示一个搜索框，用于研究材料的搜索
"use client"
import { Input } from "antd";
import {useState} from "react";
import {useRouter} from "next/navigation";
import ResearchNav from "@/components/ResearchNav";
import ResearchFooter from "@/components/ResearchFooter";
const {Search} = Input;
export default function ResearchPage() {
    const [isSearch, setIsSearch] = useState(false)
    const router = useRouter()
    const handleSearch = (value:string) => {
        value = value.trim();
        if (value) router.push(`/main/research/query?query=${value}`)
    }
    return (
        <>
        <main id={'main'} >
            <div id={'search-wrapper'} className={`flex flex-col justify-center items-center ${isSearch? 'backdrop-blur-md':''} h-[100%] w-[100%]`}>
                <ResearchNav />
                <div className={"w-[30%]"}>
                    <Search placeholder="" enterButton="搜索" size="large" onSearch={handleSearch} allowClear onClickCapture={()=>setIsSearch(true)}
                    onBlur={()=>setIsSearch(false)}/>
                    <div className={'py-60'}></div>
                </div>
                <ResearchFooter />
            </div>

        </main>
            <style jsx>{`
                #main {
                    width: 100%;
                    height: 100vh;
                    background-image: url("/images/flower.avif");
                    position: relative;
                    background-size: cover;
                    background-position: center;
                }
                #search-wrapper {
                    transition: backdrop-filter 0.3s ease;
                }
            `}</style>
        </>
    )
}