import type { TrackLevel } from '../types/competition'

// Vite raw imports — 将代码文件打包进前端产物
// @ts-ignore
import l1_inventoryChecker from '../../../PRO-DBG/L1/inventory_checker.py?raw'
// @ts-ignore
import l1_testData from '../../../PRO-DBG/L1/test_data.csv?raw'
// @ts-ignore
import l1_testRunner from '../../../PRO-DBG/L1/test_runner.py?raw'
// @ts-ignore
import l2_gradeQuery from '../../../PRO-DBG/L2/grade_query.py?raw'
// @ts-ignore
import l2_initDb from '../../../PRO-DBG/L2/init_db.py?raw'
// @ts-ignore
import l2_testRunner from '../../../PRO-DBG/L2/test_runner.py?raw'
// @ts-ignore
import l3_studentMgr from '../../../PRO-DBG/L3/student_mgr.c?raw'
// @ts-ignore
import l3_testData from '../../../PRO-DBG/L3/test_data.txt?raw'
// @ts-ignore
import l3_testRunner from '../../../PRO-DBG/L3/test_runner.py?raw'

import type { CodeFile } from '../types/competition'

export const debugLevels: TrackLevel[] = [
  {
    id: 'L1',
    title: 'Level 1：初赛 — 单文件基础逻辑与语法纠错',
    difficulty: 2,
    score: 20,
    phase: 'prelim',
    description: '组委会提供包含 3–5 个独立代码文件（语言涵盖 Python/JavaScript/Java/C 中的 2–3 种），每个文件为单一功能模块，含有若干已知 Bug。',
    criteria: [
      { id: 'D1-01', name: '语法错误识别', detail: '拼写错误、缺少分号/括号、缩进错误、类型声明不匹配等' },
      { id: 'D1-02', name: '基础逻辑修复', detail: '循环边界条件错误（off-by-one）、条件判断逻辑反转、变量误用等' },
      { id: 'D1-03', name: '运行时异常处理', detail: '空指针/未定义引用、数组越界、除零错误等常见运行时异常' },
      { id: 'D1-04', name: 'AI工具基本运用', detail: '能否正确使用AI工具进行代码解释、错误定位与修复建议获取' },
    ],
    standards: [
      '修复正确性（Bug是否消除且不引入新Bug）',
      '修复完整性（是否全部修复）',
      '完成效率（用时排名）',
    ],
    deliverables: [
      '修复后源代码',
      'Bug修复说明文档',
      '测试通过截图',
    ],
    files: [
      { filename: 'inventory_checker.py', label: '含 Bug 的脚本', type: 'code', language: 'python' },
      { filename: 'test_data.csv', label: '测试数据', type: 'data', language: 'csv' },
      { filename: 'test_runner.py', label: '测试用例', type: 'test', language: 'python' },
    ],
    hint: '注意变量名拼写和空数据处理',
  },
  {
    id: 'L2',
    title: 'Level 2：复赛 — 多文件/模块级依赖与接口调用纠错',
    difficulty: 4,
    score: 35,
    phase: 'semi',
    description: '组委会提供一个中等规模的多文件项目（包含 5–15 个源文件，含模块间依赖关系），项目可正常编译/加载但运行结果不正确，或部分功能失效。',
    criteria: [
      { id: 'D2-01', name: '跨文件依赖分析', detail: '模块导入/导出错误、循环依赖、包路径配置错误' },
      { id: 'D2-02', name: '接口调用纠错', detail: '函数签名不匹配、参数类型/顺序错误、返回值处理异常、回调/Promise链断裂' },
      { id: 'D2-03', name: '数据流追踪', detail: '变量在多模块间的传递异常、状态管理缺陷、数据格式转换错误' },
      { id: 'D2-04', name: '配置与环境排错', detail: '依赖版本冲突、环境变量缺失、配置文件格式错误' },
      { id: 'D2-05', name: 'AI深度运用', detail: '能否利用AI工具进行跨文件上下文关联分析、依赖图谱理解与系统性修复方案生成' },
    ],
    standards: [
      '项目修复后的功能完整性（通过官方提供的自动化测试套件验证）',
      '修复方案的合理性与工程规范性',
      '完成效率与AI工具使用策略的优劣',
    ],
    deliverables: [
      '修复后多文件项目',
      '依赖分析报告',
      '测试套件通过截图',
    ],
    files: [
      { filename: 'grade_query.py', label: '含 Bug 的脚本', type: 'code', language: 'python' },
      { filename: 'init_db.py', label: '数据库初始化', type: 'code', language: 'python' },
      { filename: 'test_runner.py', label: '测试用例', type: 'test', language: 'python' },
    ],
    hint: '注意 SQL 拼写、JOIN 条件、NULL 值处理',
  },
  {
    id: 'L3',
    title: 'Level 3：决赛 — 复杂系统级架构优化与深层隐藏Bug修复',
    difficulty: 5,
    score: 45,
    phase: 'final',
    description: '组委会提供一个大型复杂工程项目（20+ 源文件，涉及多层架构），项目包含显性 Bug 与深层隐藏缺陷（如竞态条件、内存泄漏、安全漏洞等），同时附带性能优化要求。',
    criteria: [
      { id: 'D3-01', name: '并发与异步缺陷', detail: '竞态条件（Race Condition）、死锁、线程安全问题、异步回调地狱' },
      { id: 'D3-02', name: '性能瓶颈定位与调优', detail: '算法复杂度优化、数据库查询优化（N+1问题等）、内存泄漏定位与修复' },
      { id: 'D3-03', name: '安全漏洞修复', detail: 'SQL注入、XSS、路径穿越、不安全的反序列化、敏感信息泄露等' },
      { id: 'D3-04', name: '架构级缺陷分析', detail: '设计模式误用、服务间通信异常、缓存策略缺陷、错误的异常传播链' },
      { id: 'D3-05', name: '隐藏Bug挖掘', detail: '仅在特定边界条件/高并发/大数据量下触发的深层潜伏Bug' },
      { id: 'D3-06', name: 'AI高阶运用与答辩', detail: '向评委阐述AI工具辅助系统级调试的完整方法论、Prompt策略及工具链组合逻辑' },
    ],
    standards: [
      '自动化测试通过率与功能回归完整性',
      '性能指标提升幅度（响应时间、吞吐量、内存占用等量化评测）',
      '安全漏洞修复完整性',
      '代码质量（可读性、可维护性、工程规范）',
      '现场答辩表现（解题思路清晰度、AI使用策略合理性）',
    ],
    deliverables: [
      '修复后工程源码',
      '性能优化报告',
      '安全修复说明',
      '答辩材料',
    ],
    files: [
      { filename: 'student_mgr.c', label: '含 Bug 的 C 代码', type: 'code', language: 'c' },
      { filename: 'test_data.txt', label: '测试数据', type: 'data', language: 'plaintext' },
      { filename: 'test_runner.py', label: '测试用例', type: 'test', language: 'python' },
    ],
    hint: '注意缓冲区大小、指针有效性、文件关闭',
  },
]

// 导入的代码文件内容
export const debugCodeFiles: Record<string, CodeFile[]> = {
  L1: [
    {
      filename: 'inventory_checker.py',
      language: 'python',
      label: '含 Bug 的脚本',
      type: 'code',
      content: l1_inventoryChecker,
    },
    {
      filename: 'test_data.csv',
      language: 'csv',
      label: '测试数据',
      type: 'data',
      content: l1_testData,
    },
    {
      filename: 'test_runner.py',
      language: 'python',
      label: '测试用例',
      type: 'test',
      content: l1_testRunner,
    },
  ],
  L2: [
    {
      filename: 'grade_query.py',
      language: 'python',
      label: '含 Bug 的脚本',
      type: 'code',
      content: l2_gradeQuery,
    },
    {
      filename: 'init_db.py',
      language: 'python',
      label: '数据库初始化',
      type: 'code',
      content: l2_initDb,
    },
    {
      filename: 'test_runner.py',
      language: 'python',
      label: '测试用例',
      type: 'test',
      content: l2_testRunner,
    },
  ],
  L3: [
    {
      filename: 'student_mgr.c',
      language: 'c',
      label: '含 Bug 的 C 代码',
      type: 'code',
      content: l3_studentMgr,
    },
    {
      filename: 'test_data.txt',
      language: 'plaintext',
      label: '测试数据',
      type: 'data',
      content: l3_testData,
    },
    {
      filename: 'test_runner.py',
      language: 'python',
      label: '测试用例',
      type: 'test',
      content: l3_testRunner,
    },
  ],
}
