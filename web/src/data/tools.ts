// 工具白名单数据

export interface VSCodePlugin {
  id: string
  name: string
  description: string
}

export interface CLITool {
  id: string
  name: string
  description: string
}

export const vscodePlugins: VSCodePlugin[] = [
  { id: 'vscode-1', name: '通义灵码（TONGYILingma）', description: '阿里云智能编码助手' },
  { id: 'vscode-2', name: '智谱 CodeGeeX', description: '智谱AI代码生成与辅助工具' },
  { id: 'vscode-3', name: '腾讯云 CodeBuddy', description: '腾讯云AI编程伙伴' },
  { id: 'vscode-4', name: '文心快码 BaiduComate', description: '百度AI代码助手' },
  { id: 'vscode-5', name: 'KiloCode', description: '开源AI编码插件' },
  { id: 'vscode-6', name: 'Cline', description: '自主AI编码代理' },
  { id: 'vscode-7', name: 'RooCode', description: 'AI编码助手' },
]

export const cliTools: CLITool[] = [
  { id: 'cli-1', name: '通义灵码 CLI', description: '阿里云终端AI编码助手' },
  { id: 'cli-2', name: 'CodeGeeX CLI', description: '智谱终端AI编码助手' },
  { id: 'cli-3', name: 'Claude Code', description: 'Anthropic终端AI编码助手' },
  { id: 'cli-4', name: 'CodeLlama CLI', description: 'Meta终端AI编码助手' },
]
