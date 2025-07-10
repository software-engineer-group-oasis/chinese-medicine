// 展示一个搜索框，用于研究材料的搜索
"use client";
import { Button, Form, Input, message, Modal, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ResearchNav from "@/components/ResearchNav";
import ResearchFooter from "@/components/ResearchFooter";
import useAxios from "@/hooks/useAxios";
import { Team } from "@/constTypes/research";
import axiosInstance from "@/api/config";
import dayjs from "dayjs";
import useAuthStore from "@/store/useAuthStore";
const { Search } = Input;
export default function ResearchPage() {
  const [isSearch, setIsSearch] = useState(false);
  const router = useRouter();
  const [teams, setTeams] = useState<Team[]>([]);
  const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
  const {
    data: teamsData,
    loading: teamsLoading,
    error,
  } = useAxios("/herb-research-service/teams/user");
  const {user, initializeAuth} = useAuthStore();

  const fetchTeams = async()=> {
    try {
      const data = (await axiosInstance.get("/herb-research-service/teams/user")).data
      if (data.code === 0) {
        setTeams(data.teams);
      }
    } catch (e) {
        console.error(e.message);
    }
  }

  const openCreateTeamModal =()=> {
    setShowCreateTeamModal(true);
  }

  const closeCreateTeamModal =()=> {
    setShowCreateTeamModal(false);
  }

  const createTeam = async (values)=> {
    const body = {
        ...values,
        teamTime: dayjs().format("YYYY-MM-DD")+"T12:00:00"
    }
    try {
        const data = (await axiosInstance.post("/herb-research-service/teams/add", body)).data;
        if (data.code === 0) {
            message.success("创建队伍成功")
            const team = data.team as Team;
            const captainData =(await axiosInstance.post("/herb-research-service/teams/member", {
                teamId: team.teamId,
                userId: user.id,
                teamMemberName: user.username,
                teamMemberDes: "队长",
                teamMemberIsCaptain: true,
            })).data

            if (captainData.code === 0) {
                fetchTeams();
            } else throw new Error(captainData.message);
        } else throw new Error(data.message)
    } catch (err) {
        console.error(err.message)
        message.error("创建团队失败")
    }
  }

  useEffect(() => {
    if (teamsData && teamsData.teams) {
      setTeams(teamsData.teams);
      console.log(teamsData.teams);
    }
    if (error) {
      message.warning("你不属于任何课题团队，请加入团队或者自己创建");
    }
  }, [teamsData, error]);

  useEffect(()=> {
    if (!user) {
        initializeAuth();
    }
  }, [])

  const handleSearch = (value: string) => {
    value = value.trim();
    if (value) router.push(`/main/research/query?query=${value}`);
  };

  if (teamsLoading) {
    return <Skeleton active />;
  }

  return (
    <>
      <main id={"main"}>
        <div
          id={"search-wrapper"}
          className={`flex flex-col justify-center gap-2 items-center ${
            isSearch ? "backdrop-blur-md" : ""
          } h-[100%] w-[100%]`}
        >
          <ResearchNav teams={teams} />
          <div>
            <Button type="primary" onClick={openCreateTeamModal}>创建团队</Button>
          </div>
          <div className={"w-[30%]"}>
            <Search
              placeholder=""
              enterButton="搜索"
              size="large"
              onSearch={handleSearch}
              allowClear
              onClickCapture={() => setIsSearch(true)}
              onBlur={() => setIsSearch(false)}
            />
            <div className={"py-60"}></div>
          </div>
          <ResearchFooter />
        </div>
      </main>
      {/* 创建团队 */}
      <Modal
      title="创建团队"
      open={showCreateTeamModal}
      footer={null}
      onCancel={closeCreateTeamModal}
      >
        <Form onFinish={createTeam}>
            <Form.Item name="teamName" label="团队名称" rules={[{required:true}]}>
                <Input />
            </Form.Item>
            <Form.Item name="teamDes" label="团队介绍" rules={[{required:true}]}>
                <Input />
            </Form.Item>
            <Form.Item >
                <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
        </Form>
      </Modal>
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
  );
}
