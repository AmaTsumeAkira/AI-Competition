"""
成绩数据库初始化脚本
创建 SQLite 数据库并插入测试数据
"""

import sqlite3
import os

def init_database():
    """初始化数据库"""
    db_path = 'school.db'

    # 如果已存在，先删除
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # 创建学生表
    cursor.execute('''
        CREATE TABLE students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            grade INTEGER NOT NULL
        )
    ''')

    # 创建课程表
    cursor.execute('''
        CREATE TABLE courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            teacher TEXT NOT NULL
        )
    ''')

    # 创建成绩表
    cursor.execute('''
        CREATE TABLE grades (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            score REAL NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )
    ''')

    # 插入学生数据
    students = [
        ('李明', 3),
        ('王芳', 2),
        ('张伟', 3),
    ]
    cursor.executemany('INSERT INTO students (name, grade) VALUES (?, ?)', students)

    # 插入课程数据
    courses = [
        ('数据结构', '刘老师'),
        ('操作系统', '陈老师'),
        ('计算机网络', '赵老师'),
    ]
    cursor.executemany('INSERT INTO courses (name, teacher) VALUES (?, ?)', courses)

    # 插入成绩数据
    # 李明：数据结构90，操作系统85，计算机网络80
    # 王芳：数据结构80，操作系统85（缺考网络）
    # 张伟：数据结构95，操作系统90，计算机网络90
    grades = [
        (1, 1, 90.0),   # 李明 - 数据结构
        (1, 2, 85.0),   # 李明 - 操作系统
        (1, 3, 80.0),   # 李明 - 计算机网络
        (2, 1, 80.0),   # 王芳 - 数据结构
        (2, 2, 85.0),   # 王芳 - 操作系统
        (3, 1, 95.0),   # 张伟 - 数据结构
        (3, 2, 90.0),   # 张伟 - 操作系统
        (3, 3, 90.0),   # 张伟 - 计算机网络
    ]
    cursor.executemany('INSERT INTO grades (student_id, course_id, score) VALUES (?, ?, ?)', grades)

    conn.commit()
    conn.close()
    print(f"✓ 数据库初始化完成：{db_path}")


if __name__ == '__main__':
    init_database()
