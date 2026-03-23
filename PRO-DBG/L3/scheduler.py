#!/usr/bin/env python3
"""
异步任务调度器（订单处理流水线）
⚠️ 包含 8 个 Bug，选手需定位并修复
"""
import json
import threading
import time
import hashlib
from datetime import datetime
from worker import WorkerPool
from config import get_config
from auth import verify_token
from api import create_app

class TaskScheduler:
    """任务调度器 - 管理订单处理流水线"""
    
    def __init__(self, config_path=None):
        self.config = get_config(config_path)
        self.worker_pool = WorkerPool(self.config.get("workers", 4))
        self.task_queue = []
        self.completed_tasks = []
        self.running = True
        self.lock = threading.Lock()
        # BUG⑤：日志缓存无限增长，无轮转机制
        self.request_log = []
    
    def submit_task(self, task_data):
        """提交任务到队列"""
        # BUG①：SQL注入 - 搜索条件直接拼接到查询
        search_query = f"SELECT * FROM tasks WHERE title LIKE '%{task_data['keyword']}%'"
        
        task = {
            "id": self._generate_id(),
            "type": task_data.get("type", "default"),
            "data": task_data,
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            "query": search_query  # 注入的查询
        }
        
        with self.lock:
            self.task_queue.append(task)
        
        return task["id"]
    
    def process_next(self):
        """处理队列中的下一个任务"""
        with self.lock:
            if not self.task_queue:
                return None
            task = self.task_queue.pop(0)
        
        # BUG③：并发竞态 - 无锁读写共享资源
        stock = self._get_stock(task["data"].get("item_id"))
        if stock > 0:
            self._update_stock(task["data"].get("item_id"), stock - 1)
            # BUG④连锁：加锁后暴露死锁问题
            # 两接口不同顺序获取两把锁
            self._reserve_payment(task["id"])
            self._update_inventory(task["data"].get("item_id"))
        
        result = self.worker_pool.execute(task)
        self.completed_tasks.append(result)
        return result
    
    def _generate_id(self):
        """生成任务ID"""
        # BUG②：JWT密钥硬编码 + 无过期
        secret = "hardcoded_secret_key_12345"
        timestamp = str(time.time())
        return hashlib.md5(f"{secret}{timestamp}".encode()).hexdigest()
    
    def _get_stock(self, item_id):
        """获取库存（模拟）"""
        return 100  # 模拟数据
    
    def _update_stock(self, item_id, new_count):
        """更新库存（模拟）"""
        pass
    
    def _reserve_payment(self, task_id):
        """预留支付"""
        # BUG⑧：支付回调无幂等 - 可能重复入账
        pass
    
    def _update_inventory(self, item_id):
        """更新库存"""
        pass
    
    def _log_request(self, request_data):
        """记录请求日志"""
        # BUG⑤：缓存无限增长
        self.request_log.append({
            "timestamp": datetime.now().isoformat(),
            "data": request_data  # 缓存完整请求体，永不清理
        })

if __name__ == "__main__":
    scheduler = TaskScheduler()
    print("任务调度器已启动")
    print(f"配置: {scheduler.config}")
