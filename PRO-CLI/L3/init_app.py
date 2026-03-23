#!/usr/bin/env python3
"""
项目初始化脚本
创建 Flask 应用初始代码（含 3 个 Bug）
选手勿改本文件，只运行一次
"""
import os

APP_CODE = '''#!/usr/bin/env python3
"""
学生信息管理 API
功能：增删改查学生信息

⚠️ 本文件包含 3 个配置错误，请修复后运行
"""
from flask import Flask, request, jsonify
import sqlite3
import json
import os

# BUG①：端口配置错误 - 这里写了 8080，但 Flask 默认监听 5000
# 应该统一为 5000 或修改启动命令
PORT = 8080

# BUG②：数据库路径使用绝对路径 - 换电脑就报错
# 应该使用相对路径或环境变量
DB_PATH = "/home/user/students.db"

app = Flask(__name__)

# BUG③：缺少 CORS 配置 - 前端调用会报跨域错误
# 需要添加 flask-cors 或手动设置响应头

def get_db():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

@app.route("/api/students", methods=["GET"])
def list_students():
    """获取学生列表"""
    conn = get_db()
    students = conn.execute("SELECT * FROM students").fetchall()
    conn.close()
    return jsonify([dict(s) for s in students])

@app.route("/api/students", methods=["POST"])
def create_student():
    """添加学生"""
    data = request.get_json()
    conn = get_db()
    conn.execute("INSERT INTO students (name, age, grade) VALUES (?, ?, ?)",
                 (data["name"], data["age"], data["grade"]))
    conn.commit()
    conn.close()
    return jsonify({"message": "添加成功"}), 201

@app.route("/api/students/<int:sid>", methods=["GET"])
def get_student(sid):
    """获取单个学生"""
    conn = get_db()
    student = conn.execute("SELECT * FROM students WHERE id = ?", (sid,)).fetchone()
    conn.close()
    if student:
        return jsonify(dict(student))
    return jsonify({"error": "未找到"}), 404

@app.route("/api/students/<int:sid>", methods=["DELETE"])
def delete_student(sid):
    """删除学生"""
    conn = get_db()
    conn.execute("DELETE FROM students WHERE id = ?", (sid,))
    conn.commit()
    conn.close()
    return jsonify({"message": "已删除"})

@app.route("/health", methods=["GET"])
def health_check():
    """健康检查"""
    return jsonify({"status": "ok"})

if __name__ == "__main__":
    print(f"启动服务器: http://localhost:{PORT}")
    app.run(host="0.0.0.0", port=PORT, debug=True)
'''

# 写入 app.py
with open(os.path.join(os.path.dirname(__file__), "app.py"), "w", encoding="utf-8") as f:
    f.write(APP_CODE)

# 创建数据库
import sqlite3
db_path = os.path.join(os.path.dirname(__file__), "students.db")
conn = sqlite3.connect(db_path)
conn.execute('''
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        grade TEXT NOT NULL
    )
''')
# 插入示例数据
conn.executemany("INSERT INTO students (name, age, grade) VALUES (?, ?, ?)", [
    ("张三", 20, "大二"),
    ("李四", 21, "大三"),
    ("王五", 19, "大一"),
])
conn.commit()
conn.close()

print("✅ 项目初始化完成")
print("   app.py - Flask 应用（含3个Bug）")
print("   students.db - 示例数据库")
print("")
print("你的任务：")
print("1. 修复 app.py 中的 3 个 Bug")
print("2. 编写 deploy.sh 启动脚本")
print("3. 编写 test_api.py 测试脚本")
