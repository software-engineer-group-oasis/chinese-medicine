"use client";
import Link from "next/link";
import { DatabaseTwoTone, UpCircleTwoTone } from "@ant-design/icons";
import { Team } from "@/constTypes/research";
import { Tag, Divider, Flex, Button } from "antd";

// const routes = [
//   {
//     name: "课题资料",
//     path: "/main/research/data",
//     icon: () => <DatabaseTwoTone />,
//   },
//   {
//     name: "数据上传",
//     path: "/main/research/upload",
//     icon: () => <UpCircleTwoTone />,
//   },
// ];
const colors = ["magenta", "red", "volcano", "orange", "gold"];

export default function ResearchNav({ teams }: { teams: Team[] }) {
  if (teams && teams.length > 0) {
    return (
      <>
        <nav>
          <ul className={"flex gap-10 py-4 px-6"}>
            {/*  丢弃，因一个人可能属于多个团队 */}
            {/* {routes.map((route) => (
              <li key={route.path}>
                {route.icon()}
                <Link
                  href={route.path}
                  className={"px-4 hover:underline hover:text-blue-400"}
                >
                  {route.name}
                </Link>
              </li>
            ))} */}
            <div className="text-lg">我的团队：</div>
            <Flex gap="4px 0" wrap>
              {teams
                .filter((team: Team) => team.teamIsvalid)
                .map((team: Team, index: number) => (
                  <Tag color={colors[index]}>
                    <Link href={`/main/research/data?teamId=${team.teamId}`}>
                      {team.teamName}
                    </Link>
                  </Tag>
                ))}
            </Flex>
          </ul>
        </nav>
      </>
    );
  } else return <></>;
}
