import Accordion from '../components/Accordion'

export default function CliTrack() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-blue-900 mb-2">CLI部署开发赛项</h1>
        <p className="text-gray-600 mb-8">使用 AI 命令行工具完成编程项目</p>

        <Accordion title="Level 1：网页数据爬虫 ★★☆☆☆" defaultOpen={true}>
          <div className="space-y-2 text-sm text-gray-700">
            <p><b>语言：</b>Python</p>
            <p><b>工具：</b>requests + BeautifulSoup</p>
            <p><b>分值：</b>20 分</p>
            <p><b>限时：</b>30 分钟</p>
            <p><b>说明：</b>从网页抓取数据并保存为 CSV 文件</p>
            <p className="text-blue-600">提示：pip 使用清华镜像源</p>
          </div>
        </Accordion>

        <Accordion title="Level 2：数据库分析 ★★★☆☆">
          <div className="space-y-2 text-sm text-gray-700">
            <p><b>语言：</b>Python + SQL</p>
            <p><b>工具：</b>sqlite3 + pandas</p>
            <p><b>分值：</b>35 分</p>
            <p><b>限时：</b>60 分钟</p>
            <p><b>说明：</b>分析 SQLite 数据库中的学生成绩数据，生成统计报表</p>
            <p className="text-blue-600">提示：使用 JOIN、GROUP BY、HAVING</p>
          </div>
        </Accordion>

        <Accordion title="Level 3：Flask Web 应用 ★★★★☆">
          <div className="space-y-2 text-sm text-gray-700">
            <p><b>语言：</b>Python</p>
            <p><b>工具：</b>Flask</p>
            <p><b>分值：</b>45 分</p>
            <p><b>限时：</b>90 分钟</p>
            <p><b>说明：</b>修复 Flask 应用的配置错误并部署到本机运行</p>
            <p className="text-blue-600">提示：注意端口配置、数据库路径、CORS</p>
          </div>
        </Accordion>
      </div>
    </div>
  )
}
