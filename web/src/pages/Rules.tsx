export default function Rules() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-8">评分规则</h1>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">基础分构成</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 text-gray-600">赛项</th>
                  <th className="text-center py-2 text-gray-600">Level 1</th>
                  <th className="text-center py-2 text-gray-600">Level 2</th>
                  <th className="text-center py-2 text-gray-600">Level 3</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-2 font-medium">AI纠错</td>
                  <td className="text-center">20分</td>
                  <td className="text-center">35分</td>
                  <td className="text-center">45分</td>
                </tr>
                <tr>
                  <td className="py-2 font-medium">CLI部署</td>
                  <td className="text-center">20分</td>
                  <td className="text-center">35分</td>
                  <td className="text-center">45分</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-500 mt-3">基础分上限 100 分，选单赛道或双赛道均可</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">极客加分</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">自主接入 API</span>
              <span className="text-blue-700 font-bold">+10 分</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">本地部署 Ollama</span>
              <span className="text-blue-700 font-bold">+12 分</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="font-medium">使用 OpenClaw</span>
              <span className="text-blue-700 font-bold">+8 分</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-3">加分上限 30 分，理论最高 130 分</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">工具限制</h2>
          <div className="space-y-2 text-sm text-gray-700">
            <p><b>AI纠错：</b>VSCode 插件 + CLI 工具均可使用</p>
            <p><b>CLI部署：</b>仅限 CLI 工具，禁止使用 VSCode 插件</p>
            <p className="text-red-600 font-medium">违规使用非白名单工具将取消成绩</p>
          </div>
        </div>
      </div>
    </div>
  )
}
