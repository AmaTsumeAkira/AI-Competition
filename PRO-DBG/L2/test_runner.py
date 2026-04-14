"""
成绩查询系统 - 自动测试脚本
验证修复后的代码是否正确
"""

import sys
import os
import sqlite3

# 初始化数据库
def setup_db():
    """初始化测试数据库"""
    db_path = 'school.db'
    if os.path.exists(db_path):
        os.remove(db_path)

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute('''
        CREATE TABLE students (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            grade INTEGER NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE courses (
            id INTEGER PRIMARY KEY,
            name TEXT NOT NULL,
            teacher TEXT NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE grades (
            id INTEGER PRIMARY KEY,
            student_id INTEGER NOT NULL,
            course_id INTEGER NOT NULL,
            score REAL NOT NULL,
            FOREIGN KEY (student_id) REFERENCES students(id),
            FOREIGN KEY (course_id) REFERENCES courses(id)
        )
    ''')

    students = [('李明', 3), ('王芳', 2), ('张伟', 3)]
    cursor.executemany('INSERT INTO students (name, grade) VALUES (?, ?)', students)

    courses = [('数据结构', '刘老师'), ('操作系统', '陈老师'), ('计算机网络', '赵老师')]
    cursor.executemany('INSERT INTO courses (name, teacher) VALUES (?, ?)', courses)

    grades = [
        (1, 1, 90.0), (1, 2, 85.0), (1, 3, 80.0),
        (2, 1, 80.0), (2, 2, 85.0),
        (3, 1, 95.0), (3, 2, 90.0), (3, 3, 90.0),
    ]
    cursor.executemany('INSERT INTO grades (student_id, course_id, score) VALUES (?, ?, ?)', grades)

    conn.commit()
    conn.close()


def test_sql_execution():
    """测试1：SQL是否能正常执行（无语法错误）"""
    import io
    import sys

    setup_db()

    # 导入并尝试运行主程序
    import importlib
    import grade_query
    importlib.reload(grade_query)

    try:
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        grade_query.main()
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout

        # 如果能运行到这里（无异常），说明 SQL 语法没问题
        print("✓ 测试通过：SQL 语句语法正确")
        return True
    except sqlite3.OperationalError as e:
        sys.stdout = old_stdout
        print(f"✗ 测试失败：SQL 语法错误 - {e}")
        return False
    except Exception as e:
        sys.stdout = old_stdout
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_all_students_present():
    """测试2：是否查询到了所有学生（不仅仅是李明）"""
    setup_db()

    import grade_query
    import importlib
    importlib.reload(grade_query)

    try:
        import io
        import sys
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        grade_query.main()
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout

        # 检查是否包含所有三个学生
        required_names = ['李明', '王芳', '张伟']
        missing = [name for name in required_names if name not in output]

        if missing:
            print(f"✗ 测试失败：以下学生未被查询到：{missing}")
            print("  可能原因：SQL 查询中使用了 WHERE student_id=1 等限制条件")
            return False

        print("✓ 测试通过：所有学生都被正确查询到")
        return True
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_avg_scores():
    """测试3：平均分计算是否正确"""
    setup_db()

    import grade_query
    import importlib
    importlib.reload(grade_query)

    try:
        import io
        import sys
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        grade_query.main()
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout

        # 预期：李明=85.0, 王芳=82.5, 张伟=91.67
        # 允许小数点后2位误差
        expected = {
            '李明': 85.0,
            '王芳': 82.5,
            '张伟': 91.67
        }

        all_correct = True
        for name, expected_avg in expected.items():
            if name not in output:
                print(f"✗ {name} 未出现在输出中")
                all_correct = False
                continue

            # 尝试在输出中找到接近的数值
            import re
            # 找该学生那一行
            for line in output.split('\n'):
                if name in line:
                    # 提取数字
                    numbers = re.findall(r'\d+\.?\d*', line)
                    if numbers:
                        actual_avg = float(numbers[-1])  # 取最后一个数字（应该是平均分）
                        if abs(actual_avg - expected_avg) > 0.1:
                            print(f"✗ {name} 平均分错误：期望 {expected_avg}，实际 {actual_avg}")
                            all_correct = False
                    break

        if all_correct:
            print("✓ 测试通过：平均分计算正确")
        return all_correct

    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


def test_no_none_in_output():
    """测试4：输出中不应出现 None（除非是暂无成绩的学生）"""
    setup_db()

    import grade_query
    import importlib
    importlib.reload(grade_query)

    try:
        import io
        import sys
        old_stdout = sys.stdout
        sys.stdout = io.StringIO()
        grade_query.main()
        output = sys.stdout.getvalue()
        sys.stdout = old_stdout

        # 输出中不应该有 "None" 字符串（除了边界情况检查部分的说明文字）
        # 检查平均分列
        lines = output.split('\n')
        for line in lines:
            if '暂无成绩' not in line and 'None' in line:
                # 检查是否是平均分列的 None
                import re
                if re.search(r'\bNone\b', line):
                    print(f"✗ 测试失败：输出中出现 None 值（应处理为'暂无成绩'）")
                    return False

        print("✓ 测试通过：无 None 值异常")
        return True
    except Exception as e:
        print(f"✗ 测试失败：{type(e).__name__}: {e}")
        return False


if __name__ == '__main__':
    print("=" * 50)
    print("第三届AIGC数字素养大赛 - PRO-DBG L2")
    print("成绩查询系统 - 自动测试")
    print("=" * 50)
    print()

    results = []
    results.append(test_sql_execution())
    results.append(test_all_students_present())
    results.append(test_avg_scores())
    results.append(test_no_none_in_output())

    print()
    print("=" * 50)
    passed = sum(results)
    total = len(results)
    print(f"测试结果：{passed}/{total} 通过")
    if passed == total:
        print("🎉 所有测试通过！")
    else:
        print(f"⚠  还有 {total - passed} 项测试失败，请继续修复")
    print("=" * 50)
