#!/usr/bin/env python3
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
