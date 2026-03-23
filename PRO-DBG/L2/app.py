#!/usr/bin/env python3
"""
Flask 任务管理微服务 - 主应用
⚠️ 本文件包含若干 Bug，选手需定位并修复
"""
from flask import Flask, request, jsonify
from datetime import datetime, timedelta
import json
import os

app = Flask(__name__)
DB_FILE = "tasks.json"


def load_db():
    """加载任务数据库"""
    if os.path.exists(DB_FILE):
        with open(DB_FILE, "r") as f:
            return json.load(f)
    return {"tasks": [], "next_id": 1}


def save_db(db):
    """保存任务数据库"""
    with open(DB_FILE, "w") as f:
        json.dump(db, f, ensure_ascii=False, indent=2)


@app.route("/api/tasks", methods=["GET"])
def list_tasks():
    """获取任务列表"""
    db = load_db()
    page = request.args.get("page", 0, type=int)  # BUG③：页码从0开始，应为1
    per_page = request.args.get("per_page", 10, type=int)
    
    start = page * per_page
    end = start + per_page
    tasks = db["tasks"][start:end]
    
    return jsonify({
        "tasks": tasks,
        "total": len(db["tasks"]),
        "page": page,
        "per_page": per_page
    })


@app.route("/api/tasks", methods=["POST"])
def create_task():
    """创建新任务"""
    db = load_db()
    data = request.get_json()
    
    # BUG②：缺少参数校验，异常被全局处理器吞掉返回200
    title = data["title"]
    due_date = data["due_date"]
    priority = data.get("priority", "medium")
    
    # BUG①：日期格式不一致 - 混用 str 和 datetime
    # 入库时用 str，查询时用 datetime 比较 → 静默失败
    task = {
        "id": db["next_id"],
        "title": title,
        "due_date": due_date,  # 直接存字符串
        "priority": priority,
        "status": "pending",
        "created_at": str(datetime.now())
    }
    
    db["tasks"].append(task)
    db["next_id"] += 1
    save_db(db)
    
    return jsonify(task), 201


@app.route("/api/tasks/<int:task_id>", methods=["GET"])
def get_task(task_id):
    """获取单个任务"""
    db = load_db()
    for task in db["tasks"]:
        if task["id"] == task_id:
            return jsonify(task)
    return jsonify({"error": "任务不存在"}), 404


@app.route("/api/tasks/<int:task_id>", methods=["PUT"])
def update_task(task_id):
    """更新任务"""
    db = load_db()
    data = request.get_json()
    
    for task in db["tasks"]:
        if task["id"] == task_id:
            task.update(data)
            save_db(db)
            return jsonify(task)
    
    return jsonify({"error": "任务不存在"}), 404


@app.route("/api/tasks/<int:task_id>", methods=["DELETE"])
def delete_task(task_id):
    """删除任务"""
    db = load_db()
    db["tasks"] = [t for t in db["tasks"] if t["id"] != task_id]
    save_db(db)
    return jsonify({"message": "已删除"})


@app.route("/api/tasks/batch", methods=["POST"])
def batch_import():
    """批量导入任务"""
    db = load_db()
    data = request.get_json()
    imported = []
    
    for item in data.get("tasks", []):
        task = {
            "id": db["next_id"],
            "title": item["title"],
            "due_date": item["due_date"],  # BUG④连锁：修复Bug①后此处断裂
            "priority": item.get("priority", "medium"),
            "status": "pending",
            "created_at": str(datetime.now())
        }
        db["tasks"].append(task)
        db["next_id"] += 1
        imported.append(task)
    
    save_db(db)
    return jsonify({"imported": len(imported), "tasks": imported}), 201


@app.errorhandler(Exception)
def handle_error(e):
    """全局错误处理"""
    return jsonify({"error": str(e)}), 200  # BUG②关联：所有异常返回200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
