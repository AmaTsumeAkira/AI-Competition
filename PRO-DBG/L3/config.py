"""
配置管理模块
管理数据库连接、Redis、日志等配置
Bug #6: staging/production 数据库串写反
"""
import os
import json
import logging
from typing import Dict, Any, Optional

# 日志配置
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


class Config:
    """应用配置类"""
    
    # 环境标识
    ENV = os.getenv("APP_ENV", "production")
    
    # 数据库配置 - Bug #6: staging 和 production 串写反了
    # 当 ENV=staging 时，应该用 staging 的配置，但这里写反了
    DB_CONFIG = {
        "staging": {
            "host": os.getenv("DB_STAGING_HOST", "10.0.1.50"),
            "port": int(os.getenv("DB_STAGING_PORT", 5432)),
            "name": os.getenv("DB_STAGING_NAME", "order_db_staging"),
            "user": os.getenv("DB_STAGING_USER", "staging_user"),
            "password": os.getenv("DB_STAGING_PASS", "staging_pass_2024"),
            "pool_size": 10,
            "max_overflow": 20,
            "echo": False,
        },
        "production": {
            "host": os.getenv("DB_HOST", "10.0.2.100"),
            "port": int(os.getenv("DB_PORT", 5432)),
            "name": os.getenv("DB_NAME", "order_db"),
            "user": os.getenv("DB_USER", "prod_user"),
            "password": os.getenv("DB_PASS", "prod_secret_p@ssw0rd_2024"),
            "pool_size": 50,
            "max_overflow": 100,
            "echo": False,
        },
    }
    
    # Redis 配置
    REDIS_CONFIG = {
        "host": os.getenv("REDIS_HOST", "127.0.0.1"),
        "port": int(os.getenv("REDIS_PORT", 6379)),
        "db": int(os.getenv("REDIS_DB", 0)),
        "password": os.getenv("REDIS_PASSWORD", ""),
        "max_connections": 100,
    }
    
    # JWT 配置 - Bug #2: JWT密钥硬编码在代码中
    # 正确做法应该是从环境变量或密钥管理系统读取
    JWT_SECRET = "ak47_super_secret_key_2024_do_not_share"  # 硬编码密钥！
    JWT_ALGORITHM = "HS256"
    # Bug #2 续: 没有设置 Token 过期时间，应该添加 ACCESS_TOKEN_EXPIRE_MINUTES
    
    # API 配置
    API_CONFIG = {
        "host": "0.0.0.0",
        "port": int(os.getenv("API_PORT", 8000)),
        "workers": 4,
        "timeout": 60,
        "max_request_size": 10 * 1024 * 1024,  # 10MB
    }
    
    # 调度器配置
    SCHEDULER_CONFIG = {
        "max_workers": int(os.getenv("SCHEDULER_WORKERS", 10)),
        "queue_size": int(os.getenv("SCHEDULER_QUEUE_SIZE", 1000)),
        "heartbeat_interval": 5,  # 秒
        "task_timeout": 300,  # 5分钟超时
        "retry_limit": 3,
        "retry_delay": 5,  # 秒
    }
    
    # 日志配置 - Bug #5: 日志中间件缓存请求体未轮转
    # 系统会不断积累日志，如果请求体很大，会导致内存持续增长
    LOG_CONFIG = {
        "level": os.getenv("LOG_LEVEL", "INFO"),
        "file": os.getenv("LOG_FILE", "/var/log/scheduler/app.log"),
        "max_bytes": int(os.getenv("LOG_MAX_BYTES", 10 * 1024 * 1024)),  # 10MB
        "backup_count": int(os.getenv("LOG_BACKUP_COUNT", 5)),
        "request_body_cache": True,  # 缓存请求体到日志！未设置上限
        "response_body_cache": True,  # 缓存响应体到日志！未设置上限
    }
    
    # 支付配置
    PAYMENT_CONFIG = {
        "callback_url": os.getenv("PAYMENT_CALLBACK_URL", "http://api.example.com/payment/callback"),
        "retry_times": 3,
        "timeout": 30,
    }
    
    # 安全配置 - Bug #7 相关
    DEBUG_MODE = os.getenv("DEBUG", "false").lower() == "true"
    
    @classmethod
    def get_db_config(cls) -> Dict[str, Any]:
        """获取当前环境的数据库配置"""
        env = cls.ENV
        # Bug #6: 这里 ENV=staging 时返回的是 production 的配置
        # 实际上是 cls.DB_CONFIG["staging"] 当 env=production 时被使用，反之亦然
        if env not in cls.DB_CONFIG:
            env = "production"
        return cls.DB_CONFIG[env]
    
    @classmethod
    def get_redis_url(cls) -> str:
        """获取 Redis 连接 URL"""
        cfg = cls.REDIS_CONFIG
        auth = f":{cfg['password']}@" if cfg.get("password") else ""
        return f"redis://{auth}{cfg['host']}:{cfg['port']}/{cfg['db']}"
    
    @classmethod
    def get_jwt_config(cls) -> Dict[str, Any]:
        """获取 JWT 配置"""
        return {
            "secret": cls.JWT_SECRET,  # 硬编码密钥
            "algorithm": cls.JWT_ALGORITHM,
        }
    
    @classmethod
    def load_from_file(cls, config_path: str) -> None:
        """从 JSON 文件加载配置"""
        if not os.path.exists(config_path):
            logger.warning(f"配置文件不存在: {config_path}")
            return
        
        try:
            with open(config_path, 'r') as f:
                data = json.load(f)
                for key, value in data.items():
                    if hasattr(cls, key.upper()):
                        setattr(cls, key.upper(), value)
                logger.info(f"从 {config_path} 加载配置成功")
        except Exception as e:
            logger.error(f"加载配置文件失败: {e}")
    
    @classmethod
    def validate(cls) -> bool:
        """验证配置完整性"""
        errors = []
        
        # 检查数据库配置
        db_cfg = cls.get_db_config()
        if not db_cfg.get("host"):
            errors.append("数据库主机未配置")
        if not db_cfg.get("password"):
            errors.append("数据库密码未配置")
        
        # 检查 JWT 配置
        if not cls.JWT_SECRET or len(cls.JWT_SECRET) < 20:
            errors.append("JWT密钥长度不足")
        
        # 检查 Redis 配置
        redis_cfg = cls.REDIS_CONFIG
        if not redis_cfg.get("host"):
            errors.append("Redis主机未配置")
        
        if errors:
            logger.error("配置验证失败: " + "; ".join(errors))
            return False
        
        logger.info("配置验证通过")
        return True
    
    @classmethod
    def get(cls, key: str, default: Any = None) -> Any:
        """通用配置获取"""
        return getattr(cls, key.upper(), default)


# 全局配置实例
config = Config()
