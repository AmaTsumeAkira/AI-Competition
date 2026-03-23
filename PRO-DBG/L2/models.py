"""
数据模型与工具函数
⚠️ 本文件包含若干 Bug
"""
from datetime import datetime, timedelta


# 任务优先级枚举
PRIORITIES = ["low", "medium", "high", "urgent"]

# 任务状态枚举
STATUSES = ["pending", "in_progress", "completed", "cancelled"]


def validate_date(date_str):
    """
    验证日期格式
    
    支持格式：YYYY-MM-DD 或 YYYY-MM-DD HH:MM
    返回：datetime 对象
    """
    # BUG：格式字符串与实际输入不匹配
    # 部分数据使用 "2026/03/22" 格式（斜杠），但此处只接受横杠
    for fmt in ["%Y-%m-%d", "%Y-%m-%d %H:%M"]:
        try:
            return datetime.strptime(date_str, fmt)
        except ValueError:
            continue
    raise ValueError(f"无法解析日期格式：{date_str}")


def format_date(dt):
    """
    格式化日期为字符串
    """
    return dt.strftime("%Y-%m-%d %H:%M")


def calculate_days_until(due_date_str):
    """
    计算距离截止日期的天数
    
    返回：正数表示还有多少天，负数表示已过期多少天
    """
    due = validate_date(due_date_str)
    now = datetime.now()
    delta = due - now
    return delta.days


def get_priority_color(priority):
    """
    获取优先级对应的颜色代码
    """
    colors = {
        "low": "#22c55e",
        "medium": "#3b82f6",
        "high": "#f59e0b",
        "urgent": "#ef4444"
    }
    return colors.get(priority, "#6b7280")


def export_tasks(tasks, format="json"):
    """
    导出任务列表
    
    支持格式：json, csv
    """
    if format == "json":
        return json.dumps(tasks, ensure_ascii=False, indent=2)
    elif format == "csv":
        if not tasks:
            return ""
        headers = list(tasks[0].keys())
        lines = [",".join(headers)]
        for task in tasks:
            row = [str(task.get(h, "")) for h in headers]
            lines.append(",".join(row))
        return "\n".join(lines)
    else:
        raise ValueError(f"不支持的导出格式：{format}")
