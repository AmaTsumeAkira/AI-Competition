interface EnvSectionProps {
  icon: string
  title: string
  description: string
  installCommand: string
  verifyCommand: string
  faq?: { q: string; a: string }[]
}

function EnvSection({ icon, title, description, installCommand, verifyCommand, faq }: EnvSectionProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <span className="text-2xl">{icon}</span>
          {title}
        </h3>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
      </div>
      <div className="p-6 space-y-4">
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">安装命令</p>
          <div className="bg-gray-900 rounded-lg p-3 relative group">
            <code className="text-green-400 text-sm block whitespace-pre-wrap">{installCommand}</code>
            <button
              onClick={() => navigator.clipboard.writeText(installCommand)}
              className="absolute top-2 right-2 text-xs text-gray-500 hover:text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              复制
            </button>
          </div>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700 mb-2">验证命令</p>
          <div className="bg-gray-900 rounded-lg p-3 relative group">
            <code className="text-green-400 text-sm block whitespace-pre-wrap">{verifyCommand}</code>
            <button
              onClick={() => navigator.clipboard.writeText(verifyCommand)}
              className="absolute top-2 right-2 text-xs text-gray-500 hover:text-white bg-gray-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            >
              复制
            </button>
          </div>
        </div>
        {faq && faq.length > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">常见问题</p>
            <div className="space-y-2">
              {faq.map((item, i) => (
                <div key={i} className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <p className="text-sm font-medium text-amber-800 mb-1">Q: {item.q}</p>
                  <p className="text-xs text-amber-700">A: {item.a}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Environment() {
  const sections: EnvSectionProps[] = [
    {
      icon: '🐍',
      title: 'Python 环境',
      description: 'Python 3.8+ 是比赛的基础运行环境，几乎所有赛题都需要 Python 支持。',
      installCommand: `# Ubuntu/Debian
sudo apt update && sudo apt install python3 python3-pip python3-venv

# macOS (使用 Homebrew)
brew install python@3.11

# Windows
# 从 https://www.python.org/downloads/ 下载安装包
# 安装时勾选 "Add Python to PATH"

# 配置 pip 镜像源（加速依赖安装，任选一个）
pip config set global.index-url https://mirrors.aliyun.com/pypi/simple/
# 或清华源: pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple/
# Windows 同上命令`,
      verifyCommand: `python3 --version  # Linux/macOS
python --version   # Windows（如安装时勾选了 PATH）
pip3 --version     # Linux/macOS
pip --version      # Windows
python3 -c "import sys; print(sys.executable)"`,
      faq: [
        { q: 'python3 命令找不到', a: '尝试使用 python 代替 python3，或检查 PATH 环境变量' },
        { q: 'pip 安装很慢', a: '使用镜像源：pip install -i https://mirrors.aliyun.com/pypi/simple/ package_name（阿里云）或 pip install -i https://pypi.tuna.tsinghua.edu.cn/simple/ package_name（清华）' },
        { q: '权限不足', a: '使用 --user 参数：pip install --user package_name，或创建虚拟环境' },
      ],
    },
    {
      icon: '🔧',
      title: 'C 编译环境',
      description: 'Level 3 决赛赛题涉及 C 语言代码，需要 GCC 编译器。',
      installCommand: `# Ubuntu/Debian
sudo apt install build-essential gcc

# macOS
xcode-select --install

# Windows — 方案一：Dev-C++（推荐，开箱即用）
# 1. 从 https://sourceforge.net/projects/orwelldevcpp/ 下载 Dev-C++
# 2. 安装后自带 GCC 编译器，无需额外配置 PATH
# 3. 可直接在 Dev-C++ IDE 中编写、编译、运行 C 程序

# Windows — 方案二：MSYS2 + MinGW
# 1. 从 https://www.msys2.org 下载安装
# 2. 安装后打开 MSYS2 终端运行：
pacman -S mingw-w64-x86_64-gcc
# 3. 将 C:\\msys64\\mingw64\\bin 添加到系统 PATH

# 验证
gcc --version`,
      verifyCommand: `gcc --version
# 编译测试 — Linux/macOS
echo '#include <stdio.h>
int main() { printf("Hello GCC\\n"); return 0; }' > test.c
gcc test.c -o test && ./test && rm test test.c

# 编译测试 — Windows（在 cmd/PowerShell 中）
# echo #include <stdio.h> > test.c
# echo int main() { printf("Hello GCC\\n"); return 0; } >> test.c
# gcc test.c -o test.exe && test.exe`,
      faq: [
        { q: 'gcc 命令找不到', a: 'Ubuntu: sudo apt install build-essential | macOS: xcode-select --install | Windows: 安装 Dev-C++（自带GCC）或 MSYS2 + MinGW' },
        { q: '编译警告太多', a: '比赛关注的是 Bug 修复正确性，编译警告不影响评分但建议清理' },
      ],
    },
    {
      icon: '🗃️',
      title: 'SQLite 基础',
      description: '部分赛题使用 SQLite 作为轻量级数据库，需要了解基本操作。',
      installCommand: `# Ubuntu/Debian
sudo apt install sqlite3

# macOS
brew install sqlite

# Windows
# 从 https://www.sqlite.org/download.html 下载 sqlite-tools-win32-*.zip
# 解压后将 sqlite3.exe 所在目录添加到系统 PATH

# Python SQLite 支持（通常内置）
python3 -c "import sqlite3; print(sqlite3.sqlite_version)"
# Windows: python -c "import sqlite3; print(sqlite3.sqlite_version)"`,
      verifyCommand: `sqlite3 --version
# 基本操作测试
sqlite3 :memory: "CREATE TABLE test(id INTEGER PRIMARY KEY, name TEXT); INSERT INTO test VALUES(1,'hello'); SELECT * FROM test;"`,
      faq: [
        { q: 'Python 的 sqlite3 模块不可用', a: '通常内置，如缺失需重新编译 Python 并启用 sqlite 支持' },
      ],
    },
    {
      icon: '🌐',
      title: 'Flask 依赖',
      description: 'CLI 赛道的 Level 3 使用 Flask 框架构建 Web 应用。',
      installCommand: `# 创建虚拟环境（推荐）
python3 -m venv venv        # Linux/macOS
python -m venv venv         # Windows
source venv/bin/activate    # Linux/macOS
venv\\Scripts\\activate      # Windows

# 安装 Flask
pip install flask flask-cors

# 或一次性安装所有依赖
pip install -i https://mirrors.aliyun.com/pypi/simple/ flask flask-cors`,
      verifyCommand: `python3 -c "import flask; print(f'Flask {flask.__version__}')"
# Windows: python -c "import flask; print(f'Flask {flask.__version__}')"
python3 -c "import flask_cors; print(f'Flask-CORS OK')"
# Windows: python -c "import flask_cors; print(f'Flask-CORS OK')"`,
      faq: [
        { q: 'Flask 版本不兼容', a: '使用 pip install flask==2.3.0 安装指定版本' },
        { q: '端口被占用', a: 'Linux/macOS: lsof -i :5000 | Windows: netstat -ano | findstr :5000，或修改 app.py 中的端口号' },
      ],
    },
    {
      icon: '💻',
      title: 'VS Code 编辑器',
      description: 'AI纠错赛项允许使用 VS Code 插件类 AI 工具，推荐安装 VS Code 作为主力编辑器。',
      installCommand: `# 从 VS Code 官网下载安装
# https://code.visualstudio.com/

# Windows: 下载 .exe 安装包，安装时勾选：
# ✅ 添加到 PATH
# ✅ 添加"通过 Code 打开"右键菜单

# 安装后打开终端验证
code --version`,
      verifyCommand: `code --version
# 打开项目
code .`,
      faq: [
        { q: 'code 命令找不到', a: '安装 VS Code 时未勾选"添加到 PATH"，手动添加或重启终端' },
        { q: '如何安装 AI 插件', a: '打开 VS Code → 左侧扩展图标 → 搜索"通义灵码"或"CodeGeeX"等 → 安装' },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-10">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">Environment</p>
          <h1 className="text-3xl font-bold text-blue-900 mb-3">环境搭建</h1>
          <p className="text-gray-500">比赛所需的开发环境与工具安装指南</p>
        </div>

        {/* 快速检查清单 */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-bold text-blue-900 mb-3">⚡ 快速检查清单</h2>
          <p className="text-sm text-blue-800 mb-4">比赛开始前，请确保以下环境已就绪：</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {['Python 3.8+', 'pip（配置阿里云/清华镜像）', 'GCC 编译器（Dev-C++ 或 MinGW）', 'Git', 'VS Code', '网络连接正常', 'AI工具已安装'].map((item) => (
              <label key={item} className="flex items-center gap-2 text-sm text-blue-800">
                <input type="checkbox" className="rounded border-blue-300" />
                {item}
              </label>
            ))}
          </div>
        </div>

        {sections.map((section) => (
          <EnvSection key={section.title} {...section} />
        ))}

        {/* Windows 终端基础 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span className="text-2xl">🪟</span>
              Windows 终端基础
            </h3>
            <p className="text-sm text-gray-500 mt-1">Windows 用户必读：常用命令对照、终端打开方式、权限与路径</p>
          </div>
          <div className="p-6 space-y-4 text-sm text-gray-700">
            <div>
              <p className="font-semibold text-gray-900 mb-2">如何打开终端</p>
              <ul className="space-y-1 ml-4">
                <li><code className="bg-gray-100 px-1.5 py-0.5 rounded">Win + R</code> → 输入 <code className="bg-gray-100 px-1.5 py-0.5 rounded">cmd</code> 或 <code className="bg-gray-100 px-1.5 py-0.5 rounded">powershell</code> → 回车</li>
                <li>推荐安装 <a href="https://github.com/microsoft/terminal" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Windows Terminal</a>，支持多标签页</li>
                <li>管理员权限：右键「以管理员身份运行」终端</li>
              </ul>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">常用命令对照</p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse text-xs">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="text-left py-1.5 px-2 border border-gray-200">功能</th>
                      <th className="text-left py-1.5 px-2 border border-gray-200">Linux / macOS</th>
                      <th className="text-left py-1.5 px-2 border border-gray-200">Windows (cmd)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-1 px-2 border border-gray-200">列出文件</td><td className="py-1 px-2 border border-gray-200"><code>ls</code></td><td className="py-1 px-2 border border-gray-200"><code>dir</code></td></tr>
                    <tr className="bg-gray-50"><td className="py-1 px-2 border border-gray-200">切换目录</td><td className="py-1 px-2 border border-gray-200"><code>cd</code></td><td className="py-1 px-2 border border-gray-200"><code>cd</code> / <code>cd /d</code></td></tr>
                    <tr><td className="py-1 px-2 border border-gray-200">查看文件</td><td className="py-1 px-2 border border-gray-200"><code>cat file</code></td><td className="py-1 px-2 border border-gray-200"><code>type file</code></td></tr>
                    <tr className="bg-gray-50"><td className="py-1 px-2 border border-gray-200">删除文件</td><td className="py-1 px-2 border border-gray-200"><code>rm file</code></td><td className="py-1 px-2 border border-gray-200"><code>del file</code></td></tr>
                    <tr><td className="py-1 px-2 border border-gray-200">删除目录</td><td className="py-1 px-2 border border-gray-200"><code>rm -rf dir</code></td><td className="py-1 px-2 border border-gray-200"><code>rmdir /s /q dir</code></td></tr>
                    <tr className="bg-gray-50"><td className="py-1 px-2 border border-gray-200">查找进程</td><td className="py-1 px-2 border border-gray-200"><code>ps aux | grep</code></td><td className="py-1 px-2 border border-gray-200"><code>tasklist | findstr</code></td></tr>
                    <tr><td className="py-1 px-2 border border-gray-200">查看端口</td><td className="py-1 px-2 border border-gray-200"><code>lsof -i :PORT</code></td><td className="py-1 px-2 border border-gray-200"><code>netstat -ano | findstr :PORT</code></td></tr>
                    <tr className="bg-gray-50"><td className="py-1 px-2 border border-gray-200">路径分隔符</td><td className="py-1 px-2 border border-gray-200"><code>/</code></td><td className="py-1 px-2 border border-gray-200"><code>\\</code>（cmd）或 <code>/</code>（PowerShell）</td></tr>
                    <tr><td className="py-1 px-2 border border-gray-200">激活虚拟环境</td><td className="py-1 px-2 border border-gray-200"><code>source venv/bin/activate</code></td><td className="py-1 px-2 border border-gray-200"><code>venv\\Scripts\\activate</code></td></tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-2">注意事项</p>
              <ul className="space-y-1 ml-4 list-disc list-inside text-gray-600">
                <li>Windows 下 <code className="bg-gray-100 px-1 rounded">python</code> 代替 <code className="bg-gray-100 px-1 rounded">python3</code>，<code className="bg-gray-100 px-1 rounded">pip</code> 代替 <code className="bg-gray-100 px-1 rounded">pip3</code></li>
                <li>路径使用反斜杠 <code className="bg-gray-100 px-1 rounded">\\</code>，或在 PowerShell 中使用正斜杠 <code className="bg-gray-100 px-1 rounded">/</code></li>
                <li>执行脚本遇到权限问题时，先运行 <code className="bg-gray-100 px-1 rounded">Set-ExecutionPolicy RemoteSigned -Scope CurrentUser</code></li>
                <li>Linux/macOS 的 <code className="bg-gray-100 px-1 rounded">&&</code> 在 cmd 中同样可用，PowerShell 中用 <code className="bg-gray-100 px-1 rounded">;</code></li>
              </ul>
            </div>
          </div>
        </div>

        {/* 通用建议 */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">📋 环境搭建通用建议</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex gap-2"><span className="text-blue-500">1.</span>始终使用虚拟环境隔离项目依赖，避免系统级污染</li>
            <li className="flex gap-2"><span className="text-blue-500">2.</span>比赛前检查机房电脑环境是否已就绪，熟悉终端基本操作</li>
            <li className="flex gap-2"><span className="text-blue-500">3.</span>保持网络畅通，部分 AI 工具需要在线 API 调用</li>
            <li className="flex gap-2"><span className="text-blue-500">4.</span>准备一个干净的开发环境，避免已有项目干扰</li>
            <li className="flex gap-2"><span className="text-blue-500">5.</span>提前熟悉终端操作，CLI 赛道全程在终端中完成</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
