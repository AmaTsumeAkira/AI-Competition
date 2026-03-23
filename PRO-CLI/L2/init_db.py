#!/usr/bin/env python3
"""
数据库初始化脚本
创建示例学生成绩数据库
选手勿改本文件
"""
import sqlite3
import os

DB_FILE = os.path.join(os.path.dirname(__file__), "school.db")

def init_database():
    """创建数据库并插入示例数据"""
    # 如果存在则删除重建
    if os.path.exists(DB_FILE):
        os.remove(DB_FILE)
    
    conn = sqlite3.connect(DB_FILE)
    cursor = conn.cursor()
    
    # 创建学生表
    cursor.execute('''
        CREATE TABLE students (
            student_id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            class_name TEXT NOT NULL,
            enrollment_year INTEGER NOT NULL
        )
    ''')
    
    # 创建课程表
    cursor.execute('''
        CREATE TABLE courses (
            course_id INTEGER PRIMARY KEY,
            course_name TEXT NOT NULL,
            credit INTEGER NOT NULL
        )
    ''')
    
    # 创建成绩表
    cursor.execute('''
        CREATE TABLE grades (
            grade_id INTEGER PRIMARY KEY AUTOINCREMENT,
            student_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            score REAL NOT NULL,
            exam_date TEXT NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students(student_id),
            FOREIGN KEY (course_id) REFERENCES courses(course_id)
        )
    ''')
    
    # 插入学生数据
    students = [
        (1, "张三", "计算机2班", 2024),
        (2, "李四", "计算机2班", 2024),
        (3, "王五", "计算机1班", 2024),
        (4, "赵六", "计算机1班", 2024),
        (5, "陈七", "计算机2班", 2023),
        (6, "杨八", "计算机1班", 2023),
        (7, "黄九", "计算机2班", 2023),
        (8, "周十", "计算机1班", 2023),
    ]
    cursor.executemany("INSERT INTO students VALUES (?, ?, ?, ?)", students)
    
    # 插入课程数据
    courses = [
        (1, "高等数学", 4),
        (2, "线性代数", 3),
        (3, "Python程序设计", 3),
        (4, "数据结构", 4),
        (5, "英语", 2),
    ]
    cursor.executemany("INSERT INTO courses VALUES (?, ?, ?)", courses)
    
    # 插入成绩数据（每学生每课程一行）
    import random
    random.seed(42)  # 固定种子，保证可复现
    
    grades = []
    for student_id in range(1, 9):
        for course_id in range(1, 6):
            # 部分学生成绩偏低（制造不及格场景）
            if student_id in [3, 6] and course_id in [1, 4]:
                score = random.randint(40, 58)  # 不及格
            elif student_id == 7:
                score = random.randint(90, 100)  # 学霸
            else:
                score = random.randint(55, 98)
            
            exam_date = f"2025-{random.randint(1,6):02d}-{random.randint(1,28):02d}"
            grades.append((student_id, course_id, score, exam_date))
    
    cursor.executemany("INSERT INTO grades (student_id, course_id, score, exam_date) VALUES (?, ?, ?, ?)", grades)
    
    conn.commit()
    conn.close()
    print(f"✅ 数据库已创建: {DB_FILE}")
    print(f"   学生: 8 人")
    print(f"   课程: 5 门")
    print(f"   成绩记录: {len(grades)} 条")


if __name__ == "__main__":
    init_database()
