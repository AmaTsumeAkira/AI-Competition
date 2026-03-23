"""
工作线程模块
处理订单、库存、支付等核心业务逻辑
Bug #3: 库存超卖（并发竞态）
Bug #4: 死锁（两接口不同序取两把锁）
Bug #8: 支付回调无幂等（重复入账）
"""
import time
import uuid
import json
import threading
import logging
import random
from datetime import datetime
from typing import Dict, Any, List, Optional
from contextlib import contextmanager
from enum import Enum

import redis
import psycopg2
from psycopg2 import pool, sql
from psycopg2.extras import RealDictCursor

from config import Config

logger = logging.getLogger(__name__)


# ========================
# 数据库连接管理
# ========================

class DatabaseManager:
    """数据库连接管理器"""
    
    _instance = None
    _lock = threading.Lock()
    _connection_pool = None
    
    def __new__(cls):
        if cls._instance is None:
            with cls._lock:
                if cls._instance is None:
                    cls._instance = super().__new__(cls)
        return cls._instance
    
    def init_pool(self):
        """初始化连接池"""
        if self._connection_pool is not None:
            return
        
        db_config = Config.get_db_config()
        
        try:
            self._connection_pool = pool.ThreadedConnectionPool(
                minconn=1,
                maxconn=db_config.get("pool_size", 10),
                host=db_config["host"],
                port=db_config["port"],
                database=db_config["name"],
                user=db_config["user"],
                password=db_config["password"]
            )
            logger.info(f"数据库连接池初始化成功: {db_config['host']}:{db_config['port']}/{db_config['name']}")
        except Exception as e:
            logger.error(f"数据库连接池初始化失败: {e}")
            raise
    
    @contextmanager
    def get_connection(self):
        """获取数据库连接（上下文管理器）"""
        if self._connection_pool is None:
            self.init_pool()
        
        conn = None
        try:
            conn = self._connection_pool.getconn()
            yield conn
            conn.commit()
        except Exception as e:
            if conn:
                conn.rollback()
            raise
        finally:
            if conn:
                self._connection_pool.putconn(conn)
    
    @contextmanager
    def get_cursor(self, cursor_type=RealDictCursor):
        """获取数据库游标"""
        with self.get_connection() as conn:
            cursor = conn.cursor(cursor_factory=cursor_type)
            try:
                yield cursor
            finally:
                cursor.close()


# 全局数据库管理器
db_manager = DatabaseManager()


# 锁管理器 - Bug #4 相关
class LockManager:
    """分布式锁管理器（模拟，用于制造死锁）"""
    
    # 全局锁顺序字典 - 用于模拟死锁
    _locks = {}
    _lock_order = ["user_lock", "order_lock", "inventory_lock", "payment_lock"]
    
    @classmethod
    def get_lock(cls, lock_name: str, timeout: int = 10):
        """获取锁（模拟）"""
        if lock_name not in cls._locks:
            cls._locks[lock_name] = threading.Lock()
        return cls._locks[lock_name]
    
    @classmethod
    def acquire_in_order(cls, *lock_names) -> List:
        """
        按固定顺序获取多把锁
        用于避免死锁的正确做法
        """
        # 按全局顺序排序
        sorted_names = sorted(lock_names, key=lambda x: cls._lock_order.index(x))
        acquired = []
        try:
            for name in sorted_names:
                lock = cls.get_lock(name)
                lock.acquire(timeout=timeout)
                acquired.append(name)
            return acquired
        except:
            # 释放已获取的锁
            for name in acquired:
                cls.get_lock(name).release()
            raise


class RedisClient:
    """Redis 客户端封装"""
    
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._init()
        return cls._instance
    
    def _init(self):
        cfg = Config.REDIS_CONFIG
        self.client = redis.Redis(
            host=cfg["host"],
            port=cfg["port"],
            db=cfg["db"],
            password=cfg.get("password") or None,
            decode_responses=True,
            max_connections=cfg.get("max_connections", 100)
        )
    
    def get(self, key: str) -> Optional[str]:
        return self.client.get(key)
    
    def set(self, key: str, value: str, ex: Optional[int] = None) -> bool:
        return self.client.set(key, value, ex=ex)
    
    def delete(self, key: str) -> int:
        return self.client.delete(key)
    
    def incr(self, key: str) -> int:
        return self.client.incr(key)
    
    def decr(self, key: str) -> int:
        return self.client.decr(key)
    
    def lpush(self, key: str, *values) -> int:
        return self.client.lpush(key, *values)
    
    def rpop(self, key: str) -> Optional[str]:
        return self.client.rpop(key)
    
    def llen(self, key: str) -> int:
        return self.client.llen(key)


redis_client = RedisClient()


# ========================
# 数据访问层
# ========================

class UserRepository:
    """用户数据访问"""
    
    @staticmethod
    def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
        """根据 ID 获取用户"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT id, username, email, role, created_at FROM users WHERE id = %s",
                (user_id,)
            )
            result = cursor.fetchone()
            return dict(result) if result else None
    
    @staticmethod
    def get_user_by_username(username: str) -> Optional[Dict[str, Any]]:
        """根据用户名获取用户"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT id, username, email, password_hash, role, created_at FROM users WHERE username = %s",
                (username,)
            )
            result = cursor.fetchone()
            return dict(result) if result else None
    
    @staticmethod
    def create_user(username: str, password_hash: str, email: str, role: str = "user") -> Dict[str, Any]:
        """创建用户"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO users (username, password_hash, email, role, created_at)
                VALUES (%s, %s, %s, %s, NOW())
                RETURNING id, username, email, role, created_at
                """,
                (username, password_hash, email, role)
            )
            result = cursor.fetchone()
            return dict(result)


class InventoryRepository:
    """库存数据访问 - Bug #3 & #4 相关"""
    
    @staticmethod
    def get_inventory(product_id: int) -> Optional[Dict[str, Any]]:
        """获取商品库存"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT product_id, quantity, reserved, available FROM inventory WHERE product_id = %s",
                (product_id,)
            )
            result = cursor.fetchone()
            return dict(result) if result else None
    
    @staticmethod
    def reserve_stock(product_id: int, quantity: int, order_id: str) -> bool:
        """
        预留库存
        Bug #3: 库存超卖 - 并发竞态条件
        Bug #4: 死锁 - 两个接口按不同顺序获取锁
        """
        # 模拟获取 Redis 锁（本地锁，不能真正跨进程）
        # 正确做法：使用分布式锁如 Redlock
        
        # Bug #3: 先查询后更新，在并发时会导致超卖
        # 两个并发请求同时读到 available=10
        # 两者都认为可以扣减，最终 available 变成负数
        
        with db_manager.get_cursor() as cursor:
            # 步骤1: 查询当前库存
            cursor.execute(
                "SELECT available FROM inventory WHERE product_id = %s FOR UPDATE",
                (product_id,)
            )
            row = cursor.fetchone()
            if not row:
                logger.error(f"商品 {product_id} 库存记录不存在")
                return False
            
            current_available = row["available"]
            
            # Bug #3: 并发检查 - 两个线程同时到达这里
            # 都看到 available=10，都认为够用
            if current_available < quantity:
                logger.warning(f"库存不足: product={product_id}, 需要={quantity}, 可用={current_available}")
                return False
            
            # 步骤2: 扣减库存
            cursor.execute(
                """
                UPDATE inventory 
                SET available = available - %s,
                    reserved = reserved + %s,
                    updated_at = NOW()
                WHERE product_id = %s AND available >= %s
                """,
                (quantity, quantity, product_id, quantity)
            )
            
            if cursor.rowcount == 0:
                logger.error(f"库存扣减失败: product={product_id}, quantity={quantity}")
                return False
            
            # 记录预留流水
            cursor.execute(
                """
                INSERT INTO inventory_reservations (product_id, order_id, quantity, status, created_at)
                VALUES (%s, %s, %s, 'reserved', NOW())
                """,
                (product_id, order_id, quantity)
            )
            
            logger.info(f"库存预留成功: product={product_id}, quantity={quantity}, order={order_id}")
            return True
    
    @staticmethod
    def release_stock(product_id: int, quantity: int, order_id: str) -> bool:
        """释放预留库存"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                """
                UPDATE inventory 
                SET available = available + %s,
                    reserved = reserved - %s,
                    updated_at = NOW()
                WHERE product_id = %s
                """,
                (quantity, quantity, product_id)
            )
            
            cursor.execute(
                """
                UPDATE inventory_reservations 
                SET status = 'released', released_at = NOW()
                WHERE product_id = %s AND order_id = %s AND status = 'reserved'
                """,
                (product_id, order_id)
            )
            
            logger.info(f"库存释放: product={product_id}, quantity={quantity}, order={order_id}")
            return True


class OrderRepository:
    """订单数据访问 - Bug #4 相关（死锁）"""
    
    @staticmethod
    def create_order(user_id: int, product_id: int, quantity: int, total_amount: float) -> Dict[str, Any]:
        """创建订单"""
        order_id = f"ORD{uuid.uuid4().hex[:12].upper()}"
        
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO orders (order_id, user_id, product_id, quantity, total_amount, status, created_at)
                VALUES (%s, %s, %s, %s, %s, 'pending', NOW())
                RETURNING *
                """,
                (order_id, user_id, product_id, quantity, total_amount)
            )
            result = cursor.fetchone()
            return dict(result)
    
    @staticmethod
    def get_order(order_id: str) -> Optional[Dict[str, Any]]:
        """获取订单"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM orders WHERE order_id = %s",
                (order_id,)
            )
            result = cursor.fetchone()
            return dict(result) if result else None
    
    @staticmethod
    def update_order_status(order_id: str, status: str) -> bool:
        """更新订单状态"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                """
                UPDATE orders SET status = %s, updated_at = NOW()
                WHERE order_id = %s
                """,
                (status, order_id)
            )
            return cursor.rowcount > 0
    
    @staticmethod
    def get_user_orders(user_id: int) -> List[Dict[str, Any]]:
        """获取用户订单列表"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM orders WHERE user_id = %s ORDER BY created_at DESC",
                (user_id,)
            )
            return [dict(row) for row in cursor.fetchall()]
    
    @staticmethod
    def cancel_order(order_id: str, user_id: int) -> bool:
        """
        取消订单
        Bug #4: 死锁 - 与支付接口按不同顺序获取锁
        """
        # Bug #4: 本方法先锁 order，再锁 inventory（不同顺序）
        # 如果支付接口先锁 inventory 再锁 order，并发时就会死锁
        
        with db_manager.get_cursor() as cursor:
            # 先锁定订单行
            cursor.execute(
                "SELECT * FROM orders WHERE order_id = %s AND user_id = %s FOR UPDATE",
                (order_id, user_id)
            )
            order = cursor.fetchone()
            if not order:
                return False
            
            if order["status"] != "pending":
                logger.warning(f"订单 {order_id} 状态不是 pending，无法取消")
                return False
            
            # 释放库存（获取 inventory 锁）
            InventoryRepository.release_stock(
                order["product_id"],
                order["quantity"],
                order_id
            )
            
            # 更新订单状态
            cursor.execute(
                """
                UPDATE orders SET status = 'cancelled', updated_at = NOW()
                WHERE order_id = %s
                """,
                (order_id,)
            )
            
            logger.info(f"订单取消: {order_id}")
            return True


class PaymentRepository:
    """支付数据访问 - Bug #4 & #8 相关"""
    
    @staticmethod
    def create_payment(order_id: str, amount: float, payment_method: str) -> Dict[str, Any]:
        """创建支付记录"""
        payment_id = f"PAY{uuid.uuid4().hex[:12].upper()}"
        
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO payments (payment_id, order_id, amount, payment_method, status, created_at)
                VALUES (%s, %s, %s, %s, 'pending', NOW())
                RETURNING *
                """,
                (payment_id, order_id, amount, payment_method)
            )
            result = cursor.fetchone()
            return dict(result)
    
    @staticmethod
    def get_payment(payment_id: str) -> Optional[Dict[str, Any]]:
        """获取支付记录"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM payments WHERE payment_id = %s",
                (payment_id,)
            )
            result = cursor.fetchone()
            return dict(result) if result else None
    
    @staticmethod
    def get_payment_by_order(order_id: str) -> Optional[Dict[str, Any]]:
        """根据订单获取支付记录"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM payments WHERE order_id = %s ORDER BY created_at DESC LIMIT 1",
                (order_id,)
            )
            result = cursor.fetchone()
            return dict(result) if result else None
    
    @staticmethod
    def update_payment_status(payment_id: str, status: str) -> bool:
        """更新支付状态"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                """
                UPDATE payments SET status = %s, updated_at = NOW()
                WHERE payment_id = %s
                """,
                (status, payment_id)
            )
            return cursor.rowcount > 0
    
    @staticmethod
    def process_payment_callback(order_id: str, payment_id: str, amount: float, status: str) -> bool:
        """
        处理支付回调
        Bug #8: 无幂等性检查 - 重复回调会导致重复入账
        """
        # Bug #8: 没有检查是否已经处理过该订单
        # 支付网关重试发送回调时，会重复入账
        
        with db_manager.get_cursor() as cursor:
            # 查询当前支付状态
            cursor.execute(
                "SELECT status FROM payments WHERE payment_id = %s",
                (payment_id,)
            )
            payment = cursor.fetchone()
            
            if not payment:
                logger.error(f"支付记录不存在: {payment_id}")
                return False
            
            # Bug #8: 没有幂等检查！如果 status 已经是 success，再次更新会导致重复入账
            # 正确做法：
            # if payment["status"] == "success":
            #     logger.info(f"支付已处理，跳过幂等检查")
            #     return True  # 幂等返回
            
            # 更新支付状态
            cursor.execute(
                """
                UPDATE payments SET status = %s, updated_at = NOW()
                WHERE payment_id = %s
                """,
                (status, payment_id)
            )
            
            # 如果支付成功，更新订单状态并入账
            if status == "success":
                cursor.execute(
                    "SELECT * FROM orders WHERE order_id = %s",
                    (order_id,)
                )
                order = cursor.fetchone()
                
                if order:
                    # 更新订单为已支付
                    cursor.execute(
                        """
                        UPDATE orders SET status = 'paid', paid_at = NOW(), updated_at = NOW()
                        WHERE order_id = %s
                        """,
                        (order_id,)
                    )
                    
                    # 入账操作 - Bug #8: 重复回调会重复入账
                    cursor.execute(
                        """
                        UPDATE account_balance 
                        SET balance = balance + %s, updated_at = NOW()
                        WHERE user_id = %s
                        """,
                        (amount, order["user_id"])
                    )
                    
                    # 记录入账流水
                    cursor.execute(
                        """
                        INSERT INTO account_transactions (user_id, type, amount, reference_id, reference_type, created_at)
                        VALUES (%s, 'credit', %s, %s, 'payment', NOW())
                        """,
                        (order["user_id"], amount, payment_id)
                    )
                    
                    logger.info(f"支付成功，入账: user={order['user_id']}, amount={amount}")
            
            return True
    
    @staticmethod
    def refund_payment(order_id: str) -> bool:
        """
        退款
        Bug #4: 死锁 - 与取消订单接口按不同顺序获取锁
        """
        # Bug #4: 本方法先锁 payment，再锁 order
        # 如果 cancel_order 先锁 order 再锁 inventory，可能产生死锁
        
        with db_manager.get_cursor() as cursor:
            # 获取支付记录（锁定）
            cursor.execute(
                "SELECT * FROM payments WHERE order_id = %s AND status = 'success' FOR UPDATE",
                (order_id,)
            )
            payment = cursor.fetchone()
            
            if not payment:
                logger.warning(f"没有可退款的支付记录: {order_id}")
                return False
            
            # 获取订单（再次锁定 - 顺序与 cancel_order 不同！）
            cursor.execute(
                "SELECT * FROM orders WHERE order_id = %s FOR UPDATE",
                (order_id,)
            )
            order = cursor.fetchone()
            
            if not order:
                return False
            
            # 退款
            cursor.execute(
                """
                UPDATE payments SET status = 'refunded', updated_at = NOW()
                WHERE payment_id = %s
                """,
                (payment["payment_id"],)
            )
            
            cursor.execute(
                """
                UPDATE orders SET status = 'refunded', updated_at = NOW()
                WHERE order_id = %s
                """,
                (order_id,)
            )
            
            # 扣减余额
            cursor.execute(
                """
                UPDATE account_balance 
                SET balance = balance - %s, updated_at = NOW()
                WHERE user_id = %s
                """,
                (payment["amount"], order["user_id"])
            )
            
            logger.info(f"退款完成: order={order_id}, amount={payment['amount']}")
            return True


class AccountRepository:
    """账户数据访问"""
    
    @staticmethod
    def get_balance(user_id: int) -> float:
        """获取账户余额"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT balance FROM account_balance WHERE user_id = %s",
                (user_id,)
            )
            result = cursor.fetchone()
            return result["balance"] if result else 0.0
    
    @staticmethod
    def create_account(user_id: int, initial_balance: float = 0.0) -> bool:
        """创建账户"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                """
                INSERT INTO account_balance (user_id, balance, created_at, updated_at)
                VALUES (%s, %s, NOW(), NOW())
                ON CONFLICT (user_id) DO NOTHING
                """,
                (user_id, initial_balance)
            )
            return True


class ProductRepository:
    """商品数据访问"""
    
    @staticmethod
    def get_product(product_id: int) -> Optional[Dict[str, Any]]:
        """获取商品信息"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM products WHERE id = %s",
                (product_id,)
            )
            result = cursor.fetchone()
            return dict(result) if result else None
    
    @staticmethod
    def search_products(keyword: str) -> List[Dict[str, Any]]:
        """
        搜索商品
        Bug #1: SQL 注入 - 直接拼接用户输入
        """
        with db_manager.get_cursor() as cursor:
            # Bug #1: SQL 注入漏洞！直接拼接 keyword
            # 攻击者可以输入: "'; DROP TABLE products; --"
            query = f"SELECT * FROM products WHERE name LIKE '%{keyword}%' OR description LIKE '%{keyword}%'"
            
            cursor.execute(query)
            results = cursor.fetchall()
            return [dict(row) for row in results]
    
    @staticmethod
    def list_products(limit: int = 100, offset: int = 0) -> List[Dict[str, Any]]:
        """商品列表"""
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                "SELECT * FROM products LIMIT %s OFFSET %s",
                (limit, offset)
            )
            return [dict(row) for row in cursor.fetchall()]


# ========================
# 业务服务层
# ========================

class OrderService:
    """订单服务"""
    
    @staticmethod
    def create_order(user_id: int, product_id: int, quantity: int) -> Dict[str, Any]:
        """创建订单"""
        # 获取商品信息
        product = ProductRepository.get_product(product_id)
        if not product:
            raise ValueError(f"商品不存在: {product_id}")
        
        if product["status"] != "active":
            raise ValueError("商品不可用")
        
        # 计算金额
        total_amount = product["price"] * quantity
        
        # 预留库存（Bug #3 相关）
        order_id = None
        try:
            # 创建订单
            order = OrderRepository.create_order(
                user_id=user_id,
                product_id=product_id,
                quantity=quantity,
                total_amount=total_amount
            )
            order_id = order["order_id"]
            
            # 预留库存
            reserved = InventoryRepository.reserve_stock(product_id, quantity, order_id)
            if not reserved:
                OrderRepository.update_order_status(order_id, "stock_failed")
                raise ValueError("库存不足")
            
            # 创建支付记录
            payment = PaymentRepository.create_payment(
                order_id=order_id,
                amount=total_amount,
                payment_method="balance"
            )
            
            return {
                "order": order,
                "payment": payment,
                "product": product
            }
            
        except Exception as e:
            logger.error(f"创建订单失败: {e}")
            if order_id:
                OrderRepository.update_order_status(order_id, "failed")
            raise
    
    @staticmethod
    def pay_order(order_id: str, user_id: int) -> bool:
        """支付订单（使用余额）"""
        order = OrderRepository.get_order(order_id)
        if not order:
            raise ValueError("订单不存在")
        
        if order["user_id"] != user_id:
            raise ValueError("无权支付此订单")
        
        if order["status"] != "pending":
            raise ValueError(f"订单状态不是 pending: {order['status']}")
        
        # 检查余额
        balance = AccountRepository.get_balance(user_id)
        if balance < order["total_amount"]:
            raise ValueError("余额不足")
        
        # 扣减余额
        with db_manager.get_cursor() as cursor:
            cursor.execute(
                """
                UPDATE account_balance 
                SET balance = balance - %s, updated_at = NOW()
                WHERE user_id = %s AND balance >= %s
                """,
                (order["total_amount"], user_id, order["total_amount"])
            )
            
            if cursor.rowcount == 0:
                raise ValueError("余额不足")
            
            # 记录支出流水
            cursor.execute(
                """
                INSERT INTO account_transactions (user_id, type, amount, reference_id, reference_type, created_at)
                VALUES (%s, 'debit', %s, %s, 'order', NOW())
                """,
                (user_id, order["total_amount"], order_id)
            )
        
        # 更新订单和支付状态
        payment = PaymentRepository.get_payment_by_order(order_id)
        if payment:
            PaymentRepository.update_payment_status(payment["payment_id"], "success")
        
        OrderRepository.update_order_status(order_id, "paid")
        
        logger.info(f"订单支付成功: {order_id}")
        return True
    
    @staticmethod
    def cancel_order(order_id: str, user_id: int) -> bool:
        """取消订单"""
        return OrderRepository.cancel_order(order_id, user_id)


class PaymentService:
    """支付服务"""
    
    @staticmethod
    def handle_callback(order_id: str, payment_id: str, amount: float, status: str) -> bool:
        """
        处理第三方支付回调
        Bug #8: 无幂等性
        """
        return PaymentRepository.process_payment_callback(order_id, payment_id, amount, status)
    
    @staticmethod
    def refund(order_id: str) -> bool:
        """退款"""
        return PaymentRepository.refund_payment(order_id)


class TaskQueue:
    """任务队列"""
    
    QUEUE_NAME = "task_queue"
    
    @classmethod
    def enqueue(cls, task_type: str, payload: Dict[str, Any], delay: int = 0) -> str:
        """添加任务到队列"""
        task_id = f"TASK{uuid.uuid4().hex[:12].upper()}"
        
        task = {
            "task_id": task_id,
            "type": task_type,
            "payload": payload,
            "status": "pending",
            "created_at": datetime.now().isoformat(),
            "delay": delay
        }
        
        if delay > 0:
            # 延迟任务
            redis_client.set(f"delayed_task:{task_id}", json.dumps(task), ex=delay)
        else:
            redis_client.lpush(cls.QUEUE_NAME, json.dumps(task))
        
        logger.info(f"任务入队: {task_id}, type={task_type}")
        return task_id
    
    @classmethod
    def dequeue(cls, timeout: int = 5) -> Optional[Dict[str, Any]]:
        """从队列取出任务"""
        result = redis_client.client.brpop(cls.QUEUE_NAME, timeout=timeout)
        if result:
            _, task_json = result
            return json.loads(task_json)
        return None
    
    @classmethod
    def get_task_status(cls, task_id: str) -> Optional[str]:
        """获取任务状态"""
        return redis_client.get(f"task_status:{task_id}")
    
    @classmethod
    def update_task_status(cls, task_id: str, status: str) -> None:
        """更新任务状态"""
        redis_client.set(f"task_status:{task_id}", status, ex=3600)
