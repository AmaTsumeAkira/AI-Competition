"""
Flask 应用测试脚本
检查 app.py 的 Bug 是否修复，接口是否正常
"""

import subprocess
import sys
import os
import time
import json

APP_DIR = os.path.dirname(os.path.abspath(__file__))
APP_FILE = os.path.join(APP_DIR, "app.py")

def test_app_file_exists():
    """测试1：app.py 存在"""
    exists = os.path.exists(APP_FILE)
    print(f"{'✓' if exists else '✗'} app.py {'存在' if exists else '不存在'}")
    return exists


def test_port_config():
    """测试2：端口配置是否修复（不应是 8080）"""
    with open(APP_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    # 检查是否还有 PORT = 8080
    if 'PORT = 8080' in content:
        print("✗ 端口配置未修复：仍为 PORT = 8080")
        return False
    print("✓ 端口配置已修复")
    return True


def test_db_path():
    """测试3：数据库路径是否修复（不应是绝对路径）"""
    with open(APP_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    if '/home/user/students.db' in content:
        print("✗ 数据库路径未修复：仍为绝对路径 /home/user/students.db")
        return False
    print("✓ 数据库路径已修复")
    return True


def test_cors_config():
    """测试4：是否添加了 CORS 配置"""
    with open(APP_FILE, 'r', encoding='utf-8') as f:
        content = f.read()

    has_cors = ('flask_cors' in content or 'CORS' in content or
                'Access-Control' in content or 'cors' in content.lower())
    if not has_cors:
        print("✗ 未检测到 CORS 配置")
        return False
    print("✓ 检测到 CORS 配置")
    return True


def test_server_starts():
    """测试5：服务器能否启动"""
    try:
        # 获取端口号
        with open(APP_FILE, 'r', encoding='utf-8') as f:
            content = f.read()

        import re
        port_match = re.search(r'PORT\s*=\s*(\d+)', content)
        port = int(port_match.group(1)) if port_match else 5000

        # 启动服务器
        proc = subprocess.Popen(
            [sys.executable, APP_FILE],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            cwd=APP_DIR
        )

        time.sleep(3)  # 等待启动

        if proc.poll() is not None:
            _, stderr = proc.communicate()
            print(f"✗ 服务器启动失败: {stderr[:200]}")
            return False

        print(f"✓ 服务器启动成功 (端口 {port})")

        # 测试健康检查
        import urllib.request
        try:
            resp = urllib.request.urlopen(f"http://localhost:{port}/health", timeout=5)
            data = json.loads(resp.read())
            if data.get("status") == "ok":
                print("✓ /health 接口正常")
            else:
                print("✗ /health 接口返回异常")
        except Exception as e:
            print(f"✗ /health 接口请求失败: {e}")

        # 测试学生列表
        try:
            resp = urllib.request.urlopen(f"http://localhost:{port}/api/students", timeout=5)
            data = json.loads(resp.read())
            if isinstance(data, list) and len(data) > 0:
                print(f"✓ /api/students 接口正常 ({len(data)} 条记录)")
            else:
                print("✗ /api/students 接口返回空数据")
        except Exception as e:
            print(f"✗ /api/students 接口请求失败: {e}")

        proc.terminate()
        proc.wait(timeout=5)
        return True

    except Exception as e:
        print(f"✗ 测试失败: {type(e).__name__}: {e}")
        try:
            proc.terminate()
        except:
            pass
        return False


def test_deploy_script():
    """测试6：部署脚本是否存在"""
    has_sh = os.path.exists(os.path.join(APP_DIR, "deploy.sh"))
    has_bat = os.path.exists(os.path.join(APP_DIR, "deploy.bat"))

    if has_sh or has_bat:
        scripts = []
        if has_sh: scripts.append("deploy.sh")
        if has_bat: scripts.append("deploy.bat")
        print(f"✓ 部署脚本存在: {', '.join(scripts)}")
        return True
    else:
        print("✗ 未找到 deploy.sh 或 deploy.bat")
        return False


if __name__ == '__main__':
    print("=" * 50)
    print("第三届AIGC数字素养大赛 - PRO-CLI L3")
    print("Flask 应用 - 自动测试")
    print("=" * 50)
    print()

    results = []
    results.append(test_app_file_exists())
    results.append(test_port_config())
    results.append(test_db_path())
    results.append(test_cors_config())
    results.append(test_deploy_script())

    print()
    print("--- 服务器运行测试 ---")
    results.append(test_server_starts())

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
