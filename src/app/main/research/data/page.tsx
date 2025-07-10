// 研究数据汇总展示
"use client";
import ResearchInfoCards from "@/components/ResearchInfoCards";
import ResearchDataTable from "@/components/ResearchDataTable";
import useAxios from "@/hooks/useAxios";
import { useEffect, useState } from "react";
import { Contents, Team, TeamMember, Topic } from "@/constTypes/research";
import { message, Skeleton, Table } from "antd";
import { useSearchParams } from "next/navigation";
import axiosInstance from "@/api/config";
import TopicsTable from "@/components/research/TopicsTable";
import TeamMembers from "@/components/research/TeamMembers";
import TeamContentsTable from "@/components/research/TeamContentsTable";
import useAuthStore from "@/store/useAuthStore";

export default function ResearchData() {
  const [team, setTeam] = useState<Team>();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [contents, setContents] = useState<Contents[]>([]);
  const params = useSearchParams();
  const teamId = params.get("teamId") || "";
  //@ts-ignore
  const { user, initializeAuth } = useAuthStore(); // 与checkAuth一起用于判断该用户是否为组长
  //@ts-ignore
  const { data: teamData, loading: teamLoading } = useAxios(
    `/herb-research-service/teams/${teamId}`
  );
//@ts-ignore
  const { data: membersData, loading: membersLoading } = useAxios(
    `/herb-research-service/teams/${teamId}/member/all`
  );
  //@ts-ignore
  const { data: contentsData, loading: contentsLoading } = useAxios(
    `/herb-research-service/contents/team/${teamId}`
  );

  const fetchTopics = async () => {
    try {
      const res = await axiosInstance.get(
        `/herb-research-service/topics/team/${teamId}`
      );
      const data = res.data;
      console.log(data);
      if (data.code !== 0) {
        message.error(data.message || "API请求失败");
      } else {
        setTopics(data.topics);
      }
    } catch (e) {
      message.error("服务器错误");
    }
  };

  const fetchMembers = async () => {
    try {
      const res = await axiosInstance.get(
        `/herb-research-service/teams/${teamId}/member/all`
      );
      const data = res.data;
      console.log(data);
      if (data.code !== 0) {
        message.error(data.message || "API请求失败");
      } else {
        setMembers(data.teamMembers);
      }
    } catch (e) {
      message.error("服务器错误");
    }
  };

  useEffect(() => {
    fetchTopics();
  }, []);

  useEffect(() => {
  //@ts-ignore
    if (teamData && teamData.team) {
    //@ts-ignore
      setTeam(teamData.team);
      fetchTopics();
    }
  }, [teamData]);

  useEffect(() => {
  //@ts-ignore
    if (membersData && membersData.teamMembers) {
      //console.log(membersData.teamMembers);
      //@ts-ignore
      setMembers(membersData.teamMembers);
    }

//@ts-ignore
    if (contentsData && contentsData.contents) {
    //@ts-ignore
      console.log("contents:", contentsData.contents);
      //@ts-ignore
      setContents(contentsData.contents);
    }
  }, [membersData, contentsData]);

  useEffect(() => {
    if (!user) {
      initializeAuth();
    }
    //console.log("captain:", captain())
  }, []);

  if (teamLoading || membersLoading || contentsLoading) {
    return <Skeleton active />;
  }

  const checkCaptain = () => {
    return members.filter((member: TeamMember) => member.userId === user.id)[0]
      .teamMemberIsCaptain;
  };

  if (team) {
    return (
      <>
        <ResearchInfoCards team={team} />
        <div className={"h-40"}></div>
        {/* <ResearchDataTable /> */}

        {/* <button onClick={fetchTopics}>fetchTopics</button> */}
        <div className="flex flex-col items-center justify-center gap-16 mt-20">
          <TeamMembers members={members} onUpdate={fetchMembers} checkCaptain={checkCaptain}/>
          <TopicsTable topics={topics} onUpdate={fetchTopics} checkCaptain={checkCaptain}/>
          <TeamContentsTable contents={contents} />
        </div>
      </>
    );
  }
}
