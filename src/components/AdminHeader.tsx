// 通用头部组件
export default function AdminHeader() {
  return (
    <header className="h-16 bg-gray-800 text-white flex items-center px-4 shadow">
      <span className="text-lg font-semibold tracking-wide">中药后台管理系统</span>
      {/* 可扩展：右侧用户信息、主题切换、退出登录等 */}
      <div className="ml-auto flex items-center space-x-4">
        <span className="text-sm">管理员</span>
        <button className="bg-gray-700 px-3 py-1 rounded hover:bg-gray-600">退出</button>
      </div>
    </header>
  );
}
