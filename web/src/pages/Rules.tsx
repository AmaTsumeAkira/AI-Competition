import { CURRENT_PHASE, isStageVisible, COMPETITION_NAME } from '../config'

export default function Rules() {
  const showSemi = isStageVisible('semifinal')
  const showFinal = isStageVisible('final')

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        {/* Page Header */}
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Scoring</p>
          <h1 className="text-3xl font-bold text-blue-900 mb-3">评分规则</h1>
          <p className="text-gray-500">百分制基础分 + 加分项，理论最高 130 分</p>
        </div>

        {/* 评分体系总览 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">评分体系总览</h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            本赛事采用<strong className="text-gray-900">百分制基础分 + 加分项</strong>的评分模型。基础分上限为<strong className="text-gray-900">100分</strong>，加分项上限为<strong className="text-gray-900">30分</strong>，选手理论最高可得<strong className="text-blue-700">130分</strong>。
          </p>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-2">基础分（满分 100 分）</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 功能正确性</li>
                <li>• 代码质量</li>
                <li>• AI工具运用</li>
                <li>• 完成效率</li>
                {showFinal && <li>• 答辩表现（决赛）</li>}
              </ul>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <h3 className="font-bold text-gray-900 mb-2">加分项（满分 30 分）</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• 自主接入 API（+10分）</li>
                <li>• Ollama 本地化部署（+12分）</li>
                <li>• 使用 OpenClaw（+8分）</li>
              </ul>
            </div>
          </div>
        </section>

        {/* AI纠错赛项基础分构成 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">AI纠错赛项基础分构成</h2>
          <p className="text-sm text-gray-500 mb-4">{showFinal ? '各维度权重随阶段递进调整，决赛增设答辩环节' : '各维度权重随阶段递进调整'}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">评分维度</th>
                  <th className="text-center py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">初赛</th>
                  {showSemi && <th className="text-center py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">复赛</th>}
                  {showFinal && <th className="text-center py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">决赛</th>}
                  <th className="text-left py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">评分说明</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ['功能正确性', '50%', '40%', '30%', 'Bug修复正确率，以自动化测试通过率为核心指标'],
                  ['修复完整性', '20%', '20%', '15%', '全部Bug的发现率与修复覆盖率'],
                  ['代码质量', '10%', '15%', '20%', '修复方案的工程规范性、可读性、无副作用引入'],
                  ['AI工具运用', '10%', '15%', '15%', 'AI工具使用的策略性、Prompt质量、工具链组合能力'],
                  ['完成效率', '10%', '10%', '5%', '同等正确率下，用时更短者得分更高'],
                  ['现场答辩', '—', '—', '15%', '解题思路、技术决策合理性、表达清晰度'],
                ] as string[][]).filter(([dim]) => dim !== '现场答辩' || showFinal).map(([dim, pre, semi, final, desc], i) => (
                  <tr key={dim} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="py-2.5 px-3 border border-gray-200 font-medium">{dim}</td>
                    <td className="py-2.5 px-3 border border-gray-200 text-center text-gray-600">{pre}</td>
                    {showSemi && <td className="py-2.5 px-3 border border-gray-200 text-center text-gray-600">{semi}</td>}
                    {showFinal && <td className="py-2.5 px-3 border border-gray-200 text-center text-gray-600">{final}</td>}
                    <td className="py-2.5 px-3 border border-gray-200 text-gray-500 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* CLI部署开发赛项基础分构成 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2">CLI部署开发赛项基础分构成</h2>
          <p className="text-sm text-gray-500 mb-4">{showFinal ? '侧重部署成功性与工程化规范，决赛增设自动化与答辩维度' : '侧重部署成功性与工程化规范'}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">评分维度</th>
                  <th className="text-center py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">初赛</th>
                  {showSemi && <th className="text-center py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">复赛</th>}
                  {showFinal && <th className="text-center py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">决赛</th>}
                  <th className="text-left py-2.5 px-3 font-semibold text-gray-700 border border-gray-200">评分说明</th>
                </tr>
              </thead>
              <tbody>
                {([
                  ['部署成功性', '40%', '20%', '10%', 'CLI工具是否正确安装、配置并可正常运行'],
                  ['项目功能完整性', '25%', '30%', '30%', '应用项目的功能覆盖度与业务逻辑正确性'],
                  ['工程化规范', '10%', '15%', '20%', '代码结构、文档完整性、版本管理、可复现性'],
                  ['AI CLI运用', '15%', '20%', '15%', '终端下AI工具的使用深度与效率'],
                  ['完成效率', '10%', '5%', '5%', '同等质量下，用时更短者得分更高'],
                  ['自动化与闭环', '—', '10%', '5%', '自动化脚本质量与业务闭环程度'],
                  ['现场答辩', '—', '—', '15%', '工作流演示、技术架构阐述、Q&A表现'],
                ] as string[][])
                  .filter(([dim]) => {
                    if (dim === '现场答辩') return showFinal
                    if (dim === '自动化与闭环') return showSemi || showFinal
                    return true
                  })
                  .map(([dim, pre, semi, final, desc], i) => (
                  <tr key={dim} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="py-2.5 px-3 border border-gray-200 font-medium">{dim}</td>
                    <td className="py-2.5 px-3 border border-gray-200 text-center text-gray-600">{pre}</td>
                    {showSemi && <td className="py-2.5 px-3 border border-gray-200 text-center text-gray-600">{semi}</td>}
                    {showFinal && <td className="py-2.5 px-3 border border-gray-200 text-center text-gray-600">{final}</td>}
                    <td className="py-2.5 px-3 border border-gray-200 text-gray-500 text-xs">{desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 极客加分机制 */}
        <section className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">极客加分机制（统一加分项）</h2>
          <p className="text-gray-600 text-sm mb-6">适用于<strong>两个赛项{showFinal ? '的所有阶段（初赛/复赛/决赛）' : showSemi ? '的初赛和复赛阶段' : '的初赛阶段'}</strong>。三个加分项<strong>可独立叠加</strong>：基础分100分 + 极客加分上限30分（API +10 + Ollama +12 + OpenClaw +8）= <strong>理论最高130分</strong>。</p>

          <div className="space-y-6">
            {/* 加分项一 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">加分项一：自主接入API</h3>
                  <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">+10 分</span>
                </div>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">加分项</th>
                        <th className="text-center py-2 px-3 font-semibold text-gray-700 border border-gray-200 w-16">分值</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">认定标准</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['成功申请并配置大模型API密钥', '+4分', '选手在比赛环境中展示有效的API Key配置，且该Key为选手自行在API开放平台申请获取'],
                        ['API驱动AI工具完成核心任务', '+4分', '选手使用自主接入的API（而非工具默认内置的商业化封装端）驱动AI编码工具完成比赛中的关键操作'],
                        ['多模型API切换与对比运用', '+2分', '选手接入2个及以上不同厂商的API，并在比赛中展示了针对不同任务场景进行模型选择与切换的策略'],
                      ].map(([item, score, standard], i) => (
                        <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-2.5 px-3 border border-gray-200 font-medium">{item}</td>
                          <td className="py-2.5 px-3 border border-gray-200 text-center text-blue-700 font-bold">{score}</td>
                          <td className="py-2.5 px-3 border border-gray-200 text-gray-600">{standard}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3"><strong>认定方式：</strong>选手需在提交物中包含API配置文件截图（敏感信息可脱敏）、API调用日志或终端操作录屏作为佐证。</p>
              </div>
            </div>

            {/* 加分项二 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">加分项二：本地化部署 Ollama</h3>
                  <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">+12 分</span>
                </div>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">加分项</th>
                        <th className="text-center py-2 px-3 font-semibold text-gray-700 border border-gray-200 w-16">分值</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">认定标准</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['成功安装并运行Ollama', '+3分', '在本地电脑成功安装Ollama并拉取至少一个开源模型，展示ollama list与ollama run命令执行结果'],
                        ['使用Ollama驱动AI工具完成比赛任务', '+5分', '将Ollama作为AI编程工具的模型后端，成功驱动工具（如Cline、RooCode、CLI工具等）完成比赛核心任务'],
                        ['模型选型与参数调优', '+2分', '展示针对比赛任务场景的模型选型策略（如选择CodeQwen用于代码纠错），并进行了推理参数调优'],
                        ['多模型本地编排', '+2分', '本地部署2个及以上模型，并展示了基于任务分工的多模型协同调度能力'],
                      ].map(([item, score, standard], i) => (
                        <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-2.5 px-3 border border-gray-200 font-medium">{item}</td>
                          <td className="py-2.5 px-3 border border-gray-200 text-center text-indigo-700 font-bold">{score}</td>
                          <td className="py-2.5 px-3 border border-gray-200 text-gray-600">{standard}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3"><strong>认定方式：</strong>选手需提交Ollama安装验证截图、模型拉取列表截图、AI工具连接Ollama的配置截图及实际调用记录。</p>
              </div>
            </div>

            {/* 加分项三 */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-600 to-violet-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">加分项三：使用 OpenClaw</h3>
                  <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full">+8 分</span>
                </div>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-blue-50">
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">加分项</th>
                        <th className="text-center py-2 px-3 font-semibold text-gray-700 border border-gray-200 w-16">分值</th>
                        <th className="text-left py-2 px-3 font-semibold text-gray-700 border border-gray-200">认定标准</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ['成功安装并配置OpenClaw', '+2分', '在竞赛环境中成功安装OpenClaw工具并完成基础配置'],
                        ['使用OpenClaw进行深度代码修改', '+3分', '利用OpenClaw对比赛项目进行深度代码分析与修改操作，展示操作过程与结果'],
                        ['使用OpenClaw实现自动化处理', '+3分', '利用OpenClaw构建自动化代码处理流程（如批量重构、代码风格统一、自动化补丁生成等）'],
                      ].map(([item, score, standard], i) => (
                        <tr key={i} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                          <td className="py-2.5 px-3 border border-gray-200 font-medium">{item}</td>
                          <td className="py-2.5 px-3 border border-gray-200 text-center text-violet-700 font-bold">{score}</td>
                          <td className="py-2.5 px-3 border border-gray-200 text-gray-600">{standard}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 mt-3"><strong>认定方式：</strong>选手需提交OpenClaw工具操作、命令行操作历史或输出日志作为佐证。</p>
              </div>
            </div>
          </div>

          {/* 加分项汇总 */}
          <div className="mt-6 bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">加分项汇总</h3>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { title: '自主接入 API', score: '+10分', spirit: '突破封装壁垒，理解AI工程化底层逻辑', color: 'border-blue-200 bg-blue-50' },
                { title: 'Ollama 本地化部署', score: '+12分', spirit: '拥抱开源生态，实现技术自主可控', color: 'border-indigo-200 bg-indigo-50' },
                { title: '使用 OpenClaw', score: '+8分', spirit: '探索前沿工具，拓展AI辅助编程边界', color: 'border-violet-200 bg-violet-50' },
              ].map((item) => (
                <div key={item.title} className={`rounded-lg border p-4 ${item.color}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-900">{item.title}</span>
                    <span className="text-lg font-bold text-blue-700">{item.score}</span>
                  </div>
                  <p className="text-xs text-gray-600">{item.spirit}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 工具限制 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">工具使用限制（第五章）</h2>

          <h3 className="text-base font-bold text-gray-800 mb-3">白名单制度</h3>
          <p className="text-gray-700 text-sm mb-4">本赛事采用<strong>严格的AI工具白名单制度</strong>。选手<strong>仅可使用</strong>本秩序册第三章明确列出的AI辅助工具完成比赛。</p>
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h4 className="font-bold text-gray-900 mb-1">AI纠错赛项（PRO-DBG）</h4>
              <p className="text-sm text-gray-600">可使用 VSCode 插件类 + CLI 类工具</p>
            </div>
            <div className="bg-red-50 rounded-lg p-4 border border-red-100">
              <h4 className="font-bold text-gray-900 mb-1">CLI部署开发赛项（PRO-CLI）</h4>
              <p className="text-sm text-gray-600">仅可使用 CLI 类工具，<strong className="text-red-700">严禁</strong>使用 VSCode 插件类 AI 工具</p>
            </div>
          </div>

          <h3 className="text-base font-bold text-gray-800 mb-3">违规处罚</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-blue-50">
                  <th className="text-left py-2.5 px-4 font-semibold text-gray-700 border border-gray-200">违规等级</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-gray-700 border border-gray-200">情形描述</th>
                  <th className="text-left py-2.5 px-4 font-semibold text-gray-700 border border-gray-200">处罚措施</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['一般违规', '无意中启动了非白名单AI工具但未实质性使用', '口头警告一次，要求立即关闭'],
                  ['严重违规', '使用非白名单AI工具完成了部分比赛任务', '该阶段成绩扣减50%'],
                  ['特别严重违规', '蓄意使用非白名单工具、或使用他人代码/账号', '取消该赛项全部成绩，通报批评'],
                ].map(([level, situation, penalty], i) => (
                  <tr key={level} className={i % 2 === 1 ? 'bg-gray-50' : ''}>
                    <td className="py-2.5 px-4 border border-gray-200 font-medium">{level}</td>
                    <td className="py-2.5 px-4 border border-gray-200 text-gray-600">{situation}</td>
                    <td className="py-2.5 px-4 border border-gray-200 text-gray-600">{penalty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* 赛场纪律 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">赛场纪律</h2>
          <div className="space-y-3">
            {[
              { id: 'R-01', text: '选手须使用组委会提供或认可的竞赛设备与账号，不得自行携带含有预设代码的存储介质' },
              { id: 'R-02', text: '比赛期间禁止与场外人员通过任何方式（即时通讯、邮件、电话等）交流比赛内容' },
              { id: 'R-03', text: '选手不得在比赛前获取或窥探赛题内容，组委会将对赛题严格保密至比赛开始' },
              { id: 'R-04', text: '比赛全程将进行屏幕录制与操作日志留存，供赛后审查使用' },
              { id: 'R-05', text: '选手应服从裁判指令，遵守赛场秩序与时间安排' },
              { id: 'R-06', text: '选手对AI工具生成的代码承担最终审查责任，须确保提交代码不含恶意内容或违法信息' },
            ].map((rule) => (
              <div key={rule.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                <span className="shrink-0 bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">{rule.id}</span>
                <p className="text-sm text-gray-700">{rule.text}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
