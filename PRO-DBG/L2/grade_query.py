"""
成绩查询脚本
功能：从 SQLite 数据库查询学生成绩，计算平均分并输出报表
"""

import sqlite3

def get_connection():
    """获取数据库连接"""
    conn = sqlite3.connect('school.db')
    conn.row_factory = sqlite3.Row  # 让查询结果可以通过列名访问
    return conn


def query_student_grades():
    """
    查询所有学生的成绩和平均分
    返回格式：[{'name': '李明', 'courses': 3, 'avg_score': 85.0}, ...]
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Bug 1（SQL拼写错误）：SELECT 语句中 courses 表的列名拼错了
    # courses 表中正确的列名是 'name'，但这里写成了 'naem'
    # Bug 2（JOIN条件错误）：这里只查了 student_id=1 的学生（李明），漏掉了其他学生
    # 正确做法应该是把 WHERE student_id=1 删掉，或者改成正确的逻辑
    query = '''
        SELECT
            s.name,
            c.naem,           -- Bug 1：列名拼写错误（naem → name）
            g.score,
            COUNT(c.id) OVER (PARTITION BY s.id) as course_count,
            AVG(g.score) OVER (PARTITION BY s.id) as avg_score
        FROM students s
        INNER JOIN grades g ON s.id = g.student_id
        INNER JOIN courses c ON g.course_id = c.id
        WHERE s.id = 1        -- Bug 2：只查询了李明（id=1），其他学生被过滤掉了
    '''

    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    # 处理查询结果，按学生聚合
    students_data = {}
    for row in rows:
        name = row['name']
        if name not in students_data:
            students_data[name] = {
                'name': name,
                'courses': row['course_count'],
                # Bug 3（数据类型错误）：avg_score 在 SQLite 中是 REAL 类型，
                # 但如果某学生没有成绩，AVG() 会返回 NULL，这里没有做 NULL 检查
                # 不过本赛题的 Bug 2 会导致王芳被过滤掉，而她的平均分实际上是 82.5
                'avg_score': row['avg_score']
            }

    return list(students_data.values())


def query_student_with_no_grades():
    """
    查询没有成绩的学生（边界情况测试）
    注意：当前数据库中没有无成绩的学生，但代码应能处理这种情况
    """
    conn = get_connection()
    cursor = conn.cursor()

    # Bug 4（边界情况未处理）：如果有学生没有任何成绩记录，
    # 这个查询会因为 AVG() 返回 NULL 而产生问题。
    # 实际上在 query_student_grades 中如果某学生无成绩，
    # 应该显示"暂无成绩"而不是显示 NULL
    query = '''
        SELECT
            s.name,
            AVG(g.score) as avg_score
        FROM students s
        LEFT JOIN grades g ON s.id = g.student_id
        GROUP BY s.id
    '''

    cursor.execute(query)
    rows = cursor.fetchall()
    conn.close()

    result = []
    for row in rows:
        # 这里没有处理 avg_score 为 NULL 的情况
        result.append({
            'name': row['name'],
            'avg_score': row['avg_score']
        })
    return result


def print_grade_report(grades_data):
    """打印成绩报表"""
    print("=" * 60)
    print(f"{'学生成绩报表':^60}")
    print("=" * 60)
    print(f"{'姓名':<10} {'课程数':<10} {'平均分':<15}")
    print("-" * 60)

    for student in grades_data:
        name = student['name']
        courses = student['courses']
        # Bug 3 相关：如果 avg_score 为 NULL，这里会显示 'None'
        avg = student['avg_score']
        avg_str = f"{avg:.2f}" if avg is not None else "暂无成绩"
        print(f"{name:<10} {courses:<10} {avg_str:<15}")

    print("-" * 60)


def main():
    """主函数"""
    print("正在查询学生成绩...\n")

    try:
        grades_data = query_student_grades()
        print_grade_report(grades_data)

        # 额外检查：边界情况
        print("\n--- 边界情况检查：无成绩学生 ---")
        no_grade_students = query_student_with_no_grades()
        for s in no_grade_students:
            print(f"  {s['name']}: {s['avg_score']}")

    except sqlite3.OperationalError as e:
        print(f"✗ SQL 执行错误：{e}")
        print("  请检查 SQL 语句是否有语法错误")
    except Exception as e:
        print(f"✗ 程序运行错误：{type(e).__name__}: {e}")


if __name__ == '__main__':
    main()
