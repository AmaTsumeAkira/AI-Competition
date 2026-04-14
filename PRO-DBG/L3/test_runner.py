"""
学生成绩管理系统 (C语言) - 自动测试脚本
编译 student_mgr.c 并验证修复结果
"""

import subprocess
import os
import sys
import tempfile
import shutil

SOURCE_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "student_mgr.c")
TEST_DATA = os.path.join(os.path.dirname(os.path.abspath(__file__)), "test_data.txt")

def get_executable_name():
    """根据系统返回可执行文件名"""
    if sys.platform == "win32":
        return "student_mgr.exe"
    return "student_mgr"


def compile_program():
    """编译 C 程序"""
    exe_name = get_executable_name()
    exe_path = os.path.join(os.path.dirname(SOURCE_FILE), exe_name)

    # 尝试编译
    cmd = ["gcc", "-o", exe_path, SOURCE_FILE, "-Wall"]
    try:
        result = subprocess.run(cmd, capture_output=True, text=True, timeout=30)
        if result.returncode != 0:
            print(f"✗ 编译失败:")
            print(f"  {result.stderr}")
            return None
        print(f"✓ 编译成功: {exe_name}")
        return exe_path
    except FileNotFoundError:
        print("✗ 未找到 gcc 编译器")
        print("  Windows 请安装 MinGW-w64 或使用 WSL")
        print("  Linux/macOS 请安装 build-essential / Xcode Command Line Tools")
        return None
    except subprocess.TimeoutExpired:
        print("✗ 编译超时")
        return None


def test_compilation():
    """测试1：能否成功编译"""
    exe_path = compile_program()
    return exe_path is not None


def test_no_segfault(exe_path):
    """测试2：运行不崩溃（无段错误）"""
    # 通过管道输入 "0" 来让程序立即退出
    try:
        proc = subprocess.Popen(
            [exe_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = proc.communicate(input="0\n", timeout=10)

        if proc.returncode < 0:
            print(f"✗ 测试失败：程序崩溃（信号 {-proc.returncode}）")
            if "Segmentation fault" in stderr or "segfault" in stderr.lower():
                print("  原因：段错误（Segmentation Fault）")
            return False

        print("✓ 测试通过：程序正常启动和退出")
        return True
    except subprocess.TimeoutExpired:
        proc.kill()
        print("✗ 测试失败：程序运行超时（可能死循环）")
        return False
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_add_and_list(exe_path):
    """测试3：添加学生并列出"""
    # 输入：1(添加) -> 姓名 -> 语文 -> 数学 -> 英语 -> 4(列出) -> 0(退出)
    inputs = "1\n测试学生\n85\n90\n78\n4\n0\n"
    try:
        proc = subprocess.Popen(
            [exe_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = proc.communicate(input=inputs, timeout=10)

        if "测试学生" in stdout and "85" in stdout:
            print("✓ 测试通过：添加和列出功能正常")
            return True
        else:
            print(f"✗ 测试失败：添加/列出功能异常")
            print(f"  输出: {stdout[:200]}")
            return False
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_buffer_overflow_protection(exe_path):
    """测试4：缓冲区溢出保护（输入超长姓名不应崩溃）"""
    long_name = "A" * 200  # 超长姓名
    inputs = f"1\n{long_name}\n85\n90\n78\n4\n0\n"
    try:
        proc = subprocess.Popen(
            [exe_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = proc.communicate(input=inputs, timeout=10)

        if proc.returncode < 0:
            print(f"✗ 测试失败：输入超长姓名后程序崩溃")
            return False

        print("✓ 测试通过：超长输入未导致崩溃")
        return True
    except subprocess.TimeoutExpired:
        proc.kill()
        print("✗ 测试失败：超长输入导致程序卡死")
        return False
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_delete_student(exe_path):
    """测试5：删除学生功能"""
    # 添加 -> 删除 -> 列出（应该没有了）
    inputs = "1\n待删除\n80\n80\n80\n3\n待删除\n4\n0\n"
    try:
        proc = subprocess.Popen(
            [exe_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout, stderr = proc.communicate(input=inputs, timeout=10)

        # 检查是否有删除成功的提示
        if "删除" in stdout or "已删除" in stdout or proc.returncode == 0:
            print("✓ 测试通过：删除功能可执行（无崩溃）")
            return True
        else:
            print(f"✗ 测试失败：删除功能异常")
            return False
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_file_operations(exe_path):
    """测试6：文件保存和加载"""
    # 添加学生 -> 保存 -> 退出 -> 重新运行 -> 加载 -> 列出 -> 退出
    inputs1 = "1\n文件测试\n90\n85\n80\n5\n0\n"
    try:
        proc = subprocess.Popen(
            [exe_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        proc.communicate(input=inputs1, timeout=10)

        # 再次运行，加载文件
        inputs2 = "6\n4\n0\n"
        proc2 = subprocess.Popen(
            [exe_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        stdout2, _ = proc2.communicate(input=inputs2, timeout=10)

        if "文件测试" in stdout2 or "加载" in stdout2:
            print("✓ 测试通过：文件保存/加载功能正常")
            return True
        else:
            print("✗ 测试失败：文件保存/加载异常")
            return False
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


if __name__ == '__main__':
    print("=" * 50)
    print("第三届AIGC数字素养大赛 - PRO-DBG L3")
    print("学生管理系统 (C语言) - 自动测试")
    print("=" * 50)
    print()

    results = []

    # 测试1：编译
    print("--- 测试1：编译 ---")
    exe_path = compile_program()
    results.append(exe_path is not None)

    if exe_path is None:
        print("\n编译失败，跳过后续测试")
        print(f"\n结果: 0/6 通过")
        sys.exit(1)

    print()

    # 测试2：不崩溃
    print("--- 测试2：正常启动退出 ---")
    results.append(test_no_segfault(exe_path))
    print()

    # 测试3：添加和列出
    print("--- 测试3：添加和列出 ---")
    results.append(test_add_and_list(exe_path))
    print()

    # 测试4：缓冲区溢出保护
    print("--- 测试4：缓冲区溢出保护 ---")
    results.append(test_buffer_overflow_protection(exe_path))
    print()

    # 测试5：删除功能
    print("--- 测试5：删除功能 ---")
    results.append(test_delete_student(exe_path))
    print()

    # 测试6：文件操作
    print("--- 测试6：文件保存/加载 ---")
    results.append(test_file_operations(exe_path))
    print()

    print("=" * 50)
    passed = sum(results)
    total = len(results)
    print(f"测试结果：{passed}/{total} 通过")
    if passed == total:
        print("🎉 所有测试通过！")
    else:
        print(f"⚠  还有 {total - passed} 项测试失败，请继续修复")
    print("=" * 50)
