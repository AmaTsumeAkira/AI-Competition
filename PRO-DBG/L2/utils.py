"""
工具函数模块
⚠️ 本文件包含若干 Bug
"""
import json
import os
from datetime import datetime


def load_json_file(filepath):
    """
    加载 JSON 文件
    
    如果文件不存在，返回空字典
    """
    if not os.path.exists(filepath):
        return {}
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)


def save_json_file(filepath, data):
    """
    保存数据到 JSON 文件
    
    自动创建目录（如果不存在）
    """
    dirpath = os.path.dirname(filepath)
    if dirpath and not os.path.exists(dirpath):
        os.makedirs(dirpath)
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def merge_task_updates(original, updates):
    """
    合并任务更新
    
    只更新 updates 中存在的字段
    保留 original 中未被更新的字段
    """
    merged = original.copy()
    for key, value in updates.items():
        if key in merged:
            merged[key] = value
    return merged


def paginate(items, page, per_page):
    """
    分页工具函数
    
    返回：(当前页数据, 总页数)
    """
    total = len(items)
    total_pages = (total + per_page - 1) // per_page if total > 0 else 1
    
    start = (page - 1) * per_page
    end = start + per_page
    
    return items[start:end], total_pages


def generate_task_summary(tasks):
    """
    生成任务统计摘要
    """
    total = len(tasks)
    by_status = {}
    by_priority = {}
    
    for task in tasks:
        status = task.get("status", "unknown")
        priority = task.get("priority", "unknown")
        by_status[status] = by_status.get(status, 0) + 1
        by_priority[priority] = by_priority.get(priority, 0) + 1
    
    return {
        "total": total,
        "by_status": by_status,
        "by_priority": by_priority,
        "generated_at": datetime.now().isoformat()
    }
