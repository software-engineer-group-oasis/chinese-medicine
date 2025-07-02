// 通用侧边栏组件
import Link from "next/link";

const navs = [
  { href: "/admin/user", label: "用户管理" },
  { href: "/admin/herb", label: "中药信息管理" },
  { href: "/admin/teaching", label: "教学实验管理" },
  { href: "/admin/research", label: "研究课题管理" },
  { href: "/admin/training", label: "培训资料管理" },
  { href: "/admin/evaluation", label: "中药材评价管理" },
  { href: "/admin/performance", label: "工作业绩管理" },
];

export default function AdminSidebar() {
  return (
    <aside className="w-60 bg-gray-100 p-4 border-r min-h-full">
      <nav>
        <ul className="space-y-2">
          {navs.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block px-2 py-2 rounded hover:bg-gray-200 text-gray-700">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
