# PRO-DBG L3：成绩管理系统（C语言）

## 赛项简介

**AI 纠错赛项**：利用 AI 代码助手定位并修复 C 语言项目中的 Bug。

本赛题难度较高，涉及 **指针、内存管理、字符串操作**，适合学过 C 语言的大二学生（大一下或大二上已修读 C 程序设计课程）。

## 难度定位

- **高级**：C 语言系统级 Bug
- **技术栈**：C 语言（需要 gcc 编译器）
- **预计用时**：60~90 分钟

## 题目背景

一个简单的学生成绩管理系统，使用纯 C 语言编写，包含链表和文件读写。程序编译通过，但运行时出现了段错误（Segmentation Fault）或输出异常……

## 你的任务

1. **编译** `student_mgr.c`（在 Windows 上可用 MinGW-w64 或 WSL）
2. **运行**程序，观察崩溃或异常输出
3. **识别**至少 4 处 Bug（指针、内存、字符串相关）
4. **使用 AI 助手**：向 AI 描述问题，获取修复建议（可以用 AI 解释 C 语言内存模型）
5. **应用修复**：修改代码使程序稳定运行
6. **验证**：确保所有测试通过

## 文件说明

| 文件 | 说明 |
|------|------|
| `student_mgr.c` | 学生管理系统源码（含 Bug） |
| `test_runner.py` | Python 测试脚本（调用编译后的程序） |
| `test_data.txt` | 测试数据文件 |

## 编译与运行

**Windows（MinGW-w64）**
```powershell
gcc -o student_mgr.exe student_mgr.c -Wall
student_mgr.exe
```

**Linux / macOS / WSL**
```bash
gcc -o student_mgr student_mgr.c -Wall
./student_mgr
```

**运行测试**
```powershell
python test_runner.py
```

## 评分标准（满分 100 分）

| 得分项 | 分值 | 说明 |
|--------|------|------|
| 正确识别所有 Bug | 50 分 | 每个 Bug 约 12.5 分，识别 4 个得满分 |
| AI 使用过程记录完整 | 15 分 | 提交 AI 对话截图或文字记录 |
| 代码修复正确 | 25 分 | 全部修复 25 分，部分修复按比例 |
| 测试通过 | 10 分 | `test_runner.py` 运行无报错 |

## Bug 类型预告（仅供参考）

本赛题包含以下类型的 Bug（不要直接告诉 AI）：
- **缓冲区溢出**：字符串输入超长导致栈损坏
- **空指针解引用**：链表操作时未检查 NULL
- **内存泄漏**：malloc 后未 free
- **野指针**：指针释放后继续使用
- **字符串操作错误**：strcpy/strcmp 使用不当

## 环境要求

- **GCC 编译器**（Windows 可用 [MinGW-w64](https://www.mingw-w64.org/) 或 WSL）
- Python 3.8+（用于运行测试脚本）
- 推荐使用 **WSL（Windows Subsystem for Linux）** 在 Windows 上获得原生 GCC 体验

## AI 使用建议

1. **描述段错误**：告诉 AI "程序出现了段错误（Segmentation Fault），发生在某行"，AI 可以帮你分析
2. **利用 AI 解释内存模型**：C 语言的内存问题很难肉眼发现，让 AI 画内存布局图
3. **使用 AddressSanitizer**：可以问 AI "如何在 GCC 中启用内存检测工具"
4. **不要盲目复制**：AI 给的修复代码要理解后再使用，避免引入新问题
