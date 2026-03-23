"""
认证模块
处理用户认证、JWT Token 生成和验证
Bug #2: JWT密钥硬编码 + 无Token过期时间
"""
import hashlib
import hmac
import jwt
import time
import logging
import secrets
from datetime import datetime, timedelta
from typing import Optional, Dict, Any, Tuple
from functools import wraps
from flask import request, jsonify, g

from config import Config

logger = logging.getLogger(__name__)


class AuthError(Exception):
    """认证异常"""
    def __init__(self, message: str, status_code: int = 401):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)


class TokenManager:
    """Token 管理器"""
    
    # Bug #2: 密钥硬编码在代码中，应该从 Config 或环境变量读取
    # 并且没有设置过期时间机制
    _secret_key = "jwt_hardcoded_secret_key_ak47_2024"  # 硬编码密钥！
    _algorithm = "HS256"
    
    # Token 类型
    ACCESS_TOKEN = "access"
    REFRESH_TOKEN = "refresh"
    
    @classmethod
    def generate_access_token(cls, user_id: int, username: str, role: str = "user") -> str:
        """
        生成访问令牌
        Bug #2: 没有设置 exp (过期时间)，Token 永不过期
        """
        payload = {
            "user_id": user_id,
            "username": username,
            "role": role,
            "type": cls.ACCESS_TOKEN,
            "iat": int(time.time()),  # 签发时间
            # 缺少 "exp": int(time.time()) + ACCESS_TOKEN_EXPIRE_MINUTES * 60
        }
        # Bug #2: 使用硬编码的密钥而非 Config.JWT_SECRET
        token = jwt.encode(payload, cls._secret_key, algorithm=cls._algorithm)
        logger.info(f"为用户 {username} 生成访问令牌 (无过期时间)")
        return token
    
    @classmethod
    def generate_refresh_token(cls, user_id: int) -> str:
        """生成刷新令牌"""
        payload = {
            "user_id": user_id,
            "type": cls.REFRESH_TOKEN,
            "iat": int(time.time()),
            "jti": secrets.token_urlsafe(16),  # Token 唯一标识
        }
        token = jwt.encode(payload, cls._secret_key, algorithm=cls._algorithm)
        return token
    
    @classmethod
    def verify_token(cls, token: str, token_type: str = ACCESS_TOKEN) -> Dict[str, Any]:
        """
        验证 Token
        存在 Bug #2: 未设置 exp 验证，所以即使 Token 过期也不会被拒绝
        """
        try:
            # 解码时不检查 exp（因为根本没设置）
            payload = jwt.decode(
                token, 
                cls._secret_key, 
                algorithms=[cls._algorithm]
            )
            
            # 验证 Token 类型
            if payload.get("type") != token_type:
                raise AuthError(f"Token 类型错误，期望 {token_type}")
            
            return payload
            
        except jwt.ExpiredSignatureError:
            # 由于没有设置 exp，这个分支永远不会触发
            raise AuthError("Token 已过期")
        except jwt.InvalidTokenError as e:
            raise AuthError(f"无效的 Token: {str(e)}")
    
    @classmethod
    def decode_token_unsafe(cls, token: str) -> Dict[str, Any]:
        """
        不验证直接解码（用于调试）
        Bug #7 相关: 如果在生产环境使用，会泄露用户信息
        """
        try:
            # 不验证签名直接解码，危险！
            payload = jwt.decode(token, options={"verify_signature": False})
            return payload
        except Exception as e:
            logger.error(f"Token 解码失败: {e}")
            return {}
    
    @classmethod
    def refresh_access_token(cls, refresh_token: str) -> str:
        """使用刷新令牌获取新的访问令牌"""
        payload = cls.verify_token(refresh_token, cls.REFRESH_TOKEN)
        user_id = payload.get("user_id")
        
        # 需要从数据库获取用户信息
        from worker import UserRepository
        user = UserRepository.get_user_by_id(user_id)
        if not user:
            raise AuthError("用户不存在")
        
        return cls.generate_access_token(
            user_id=user["id"],
            username=user["username"],
            role=user.get("role", "user")
        )


class PasswordHasher:
    """密码哈希工具"""
    
    @staticmethod
    def hash(password: str, salt: Optional[str] = None) -> str:
        """对密码进行哈希"""
        if not salt:
            salt = secrets.token_hex(16)
        
        # 使用 PBKDF2 哈希
        key = hashlib.pbkdf2_hmac(
            'sha256',
            password.encode('utf-8'),
            salt.encode('utf-8'),
            100000
        )
        return f"{salt}${key.hex()}"
    
    @staticmethod
    def verify(password: str, hashed: str) -> bool:
        """验证密码"""
        try:
            salt, key_hex = hashed.split('$')
            expected_key = hashlib.pbkdf2_hmac(
                'sha256',
                password.encode('utf-8'),
                salt.encode('utf-8'),
                100000
            )
            return hmac.compare_digest(expected_key.hex(), key_hex)
        except (ValueError, AttributeError):
            return False


class AuthService:
    """认证服务"""
    
    def __init__(self):
        self.token_manager = TokenManager()
        self.password_hasher = PasswordHasher()
    
    def authenticate(self, username: str, password: str) -> Dict[str, str]:
        """
        用户认证
        返回 token 信息
        """
        from worker import UserRepository
        
        # 查询用户
        user = UserRepository.get_user_by_username(username)
        if not user:
            logger.warning(f"登录失败: 用户 {username} 不存在")
            raise AuthError("用户名或密码错误")
        
        # 验证密码
        if not self.password_hasher.verify(password, user["password_hash"]):
            logger.warning(f"登录失败: 用户 {username} 密码错误")
            raise AuthError("用户名或密码错误")
        
        # 生成 Token
        access_token = self.token_manager.generate_access_token(
            user_id=user["id"],
            username=user["username"],
            role=user.get("role", "user")
        )
        refresh_token = self.token_manager.generate_refresh_token(user["id"])
        
        logger.info(f"用户 {username} 登录成功")
        
        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
            # Bug #2: 缺少 expires_in 字段，客户端不知道何时刷新
        }
    
    def register(self, username: str, password: str, email: str) -> Dict[str, Any]:
        """用户注册"""
        from worker import UserRepository, db
        
        # 检查用户名是否已存在
        existing = UserRepository.get_user_by_username(username)
        if existing:
            raise AuthError("用户名已存在", status_code=400)
        
        # 密码哈希
        password_hash = self.password_hasher.hash(password)
        
        # 创建用户
        user = UserRepository.create_user(
            username=username,
            password_hash=password_hash,
            email=email
        )
        
        logger.info(f"新用户注册: {username}")
        
        return {
            "id": user["id"],
            "username": user["username"],
            "email": user["email"]
        }
    
    def get_current_user(self, token: str) -> Optional[Dict[str, Any]]:
        """获取当前用户信息"""
        try:
            payload = self.token_manager.verify_token(token)
            user_id = payload.get("user_id")
            
            from worker import UserRepository
            return UserRepository.get_user_by_id(user_id)
        except AuthError:
            return None


# 全局认证服务实例
auth_service = AuthService()


def require_auth(f):
    """认证装饰器"""
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        
        if not auth_header:
            return jsonify({"error": "缺少认证头"}), 401
        
        try:
            scheme, token = auth_header.split()
            if scheme.lower() != "bearer":
                return jsonify({"error": "认证方案错误"}), 401
            
            # 验证 Token
            payload = TokenManager.verify_token(token)
            
            # 将用户信息存入 g 对象
            g.user_id = payload.get("user_id")
            g.username = payload.get("username")
            g.role = payload.get("role")
            
        except AuthError as e:
            return jsonify({"error": e.message}), e.status_code
        except ValueError:
            return jsonify({"error": "无效的认证头格式"}), 401
        
        return f(*args, **kwargs)
    
    return decorated


def require_role(role: str):
    """角色验证装饰器"""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            if not hasattr(g, 'role') or g.role != role:
                return jsonify({"error": "权限不足"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator
