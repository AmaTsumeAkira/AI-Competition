#!/usr/bin/env python3
"""
REST API 接口
⚠️ 包含安全和业务 Bug
"""
from flask import Flask, request, jsonify
from datetime import datetime
import traceback
import json


def create_app(scheduler=None):
    """创建 Flask 应用"""
    app = Flask(__name__)
    
    @app.route("/api/tasks", methods=["POST"])
    def submit_task():
        """提交任务"""
        data = request.get_json()
        # 缺少输入验证
        task_id = scheduler.submit_task(data)
        return jsonify({"task_id": task_id}), 201
    
    @app.route("/api/tasks/<task_id>", methods=["GET"])
    def get_task(task_id):
        """获取任务详情"""
        # 未验证 token
        for task in scheduler.completed_tasks:
            if task.get("id") == task_id:
                return jsonify(task)
        return jsonify({"error": "未找到"}), 404
    
    @app.route("/api/search", methods=["GET"])
    def search_tasks():
        """搜索任务"""
        keyword = request.args.get("q", "")
        # BUG①：直接拼接SQL
        query = f"SELECT * FROM tasks WHERE title LIKE '%{keyword}%'"
        return jsonify({"query": query, "results": []})
    
    @app.route("/api/payment/callback", methods=["POST"])
    def payment_callback():
        """支付回调"""
        data = request.get_json()
        # BUG⑧：无幂等校验 - 重复回调导致重复入账
        order_id = data.get("order_id")
        amount = data.get("amount")
        # 直接入账，无校验
        return jsonify({"status": "success", "order_id": order_id})
    
    @app.errorhandler(Exception)
    def handle_error(e):
        """全局错误处理"""
        # BUG⑦：泄露堆栈信息含数据库凭据
        error_info = {
            "error": str(e),
            "traceback": traceback.format_exc(),
            "config": app.config  # 泄露配置含DB密码
        }
        return jsonify(error_info), 500
    
    return app
