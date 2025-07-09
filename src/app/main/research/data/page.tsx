// 研究数据汇总展示
"use client";
import ResearchInfoCards from "@/components/ResearchInfoCards";
import ResearchDataTable from "@/components/ResearchDataTable";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import { Content, Team, TeamMember, Topic } from "@/constTypes/research";
import { message, Skeleton, Table } from "antd";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/api/config";
import TopicsTable from "@/components/research/TopicsTable";
import TeamMembers from "@/components/research/TeamMembers";
import TeamContentsTable from "@/components/research/TeamContentsTable";

export default function ResearchData() {
  const [team, setTeam] = useState<Team>();
  const [topics, setTopics] = useState<Topic[]>([])
  const [members, setMembers] = useState<TeamMember[]>([])
  const [contents, setContents] = useState<Content[]>([])
  const params = useSearchParams();
  const teamId = params.get("teamId") || "";
  const { data: teamData, loading: teamLoading } = useAxios(
    `/herb-research-service/teams/${teamId}`
  );

  const {data: membersData, loading: membersLoading} = useAxios(`/herb-research-service/teams/${teamId}/member/all`)
  const {data:contentsData, loading: contentsLoading} =  useAxios(`/herb-research-service/contents/team/${teamId}`)

  const fetchTopics = async ()=> {
    try {
        const res = await axiosInstance.get(`/herb-research-service/topics/team/${teamId}`)
        const data = res.data
        console.log(data);
        if (data.code !== 0) {
            message.error(data.message || "API请求失败")
        } else {
            setTopics(data.topics)
        }
    } catch(e) {
        message.error("服务器错误")
    }
    
  }

  useEffect(()=> {
    fetchTopics();
  },[])

  useEffect(() => {
    if (teamData && teamData.team) {
      setTeam(teamData.team);
      fetchTopics();
    }
  }, [teamData]);

  useEffect(()=> {
    if (membersData && membersData.teamMembers) {
        //console.log(membersData.teamMembers);
        setMembers(membersData.teamMembers);
    }

    if (contentsData && contentsData.contents) {
        console.log("contents:", contentsData.contents)
        setContents(contentsData.contents)
    }
  }, [membersData, contentsData])

  if (teamLoading || membersLoading || contentsLoading) {
    return <Skeleton active />;
  }

  if (team) {
    return (
      <>
        <ResearchInfoCards team={team} />
        <div className={"h-40"}></div>
        {/* <ResearchDataTable /> */}

        {/* <button onClick={fetchTopics}>fetchTopics</button> */}
        <div className="flex flex-col items-center justify-center gap-16 mt-20">
            <TeamMembers members={members} />
            <TopicsTable topics={topics}/>
            <TeamContentsTable contents={contents}/>
        </div>
        
      </>
    );
  }
}
