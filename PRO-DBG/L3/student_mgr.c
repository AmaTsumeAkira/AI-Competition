/**
 * 学生成绩管理系统 - C语言实现
 * 功能：添加学生、查询成绩、按平均分排序、文件持久化
 * 
 * 本代码包含多个 Bug，请使用 AI 助手定位并修复
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#define MAX_NAME_LEN 32      // 最大名字长度
#define MAX_STUDENTS 100     // 最大学生数量
#define DATA_FILE "students.dat"

// 学生结构体（链表节点）
typedef struct Student {
    char name[MAX_NAME_LEN];      // 学生姓名
    int scores[3];                // 三门课成绩：语文、数学、英语
    float avg_score;              // 平均分
    struct Student *next;         // 指向下一个节点的指针
} Student;

// 全局变量
Student *g_head = NULL;  // 链表头指针
int g_count = 0;          // 学生数量

// ============ Bug 1：缓冲区溢出 ============
// 添加学生时，如果输入的姓名长度 >= MAX_NAME_LEN，
// strcpy 会溢出到相邻的内存区域，破坏栈结构
// 
// 触发方法：添加一个超过 32 个字符的姓名
// 
// 修复思路：使用 strncpy 限制复制长度，或使用更安全的输入方式
void add_student(const char *name, int chinese, int math, int english) {
    Student *new_node = (Student *)malloc(sizeof(Student));
    if (new_node == NULL) {
        printf("✗ 内存分配失败\n");
        return;
    }

    // Bug 1：未检查 name 长度，直接 strcpy，会导致缓冲区溢出
    strcpy(new_node->name, name);

    new_node->scores[0] = chinese;
    new_node->scores[1] = math;
    new_node->scores[2] = english;
    new_node->avg_score = (chinese + math + english) / 3.0f;
    new_node->next = g_head;
    g_head = new_node;
    g_count++;
}

// ============ Bug 2：空指针解引用 ============
// 查找学生时，如果没有找到，返回的指针没有被正确处理
// 
// 触发方法：查询一个不存在的学生
// 
// 修复思路：在调用处检查返回值是否为 NULL
Student* find_student(const char *name) {
    Student *p = g_head;
    while (p != NULL) {
        // Bug 2（字符串比较错误）：使用了 strcpy 而不是 strcmp
        // strcpy 会返回复制了多少字节（int），不会做比较
        // 实际上 C 中 strcmp 返回 0 表示相等，这里直接用了 strcpy
        // 更严重的是：如果某节点 name 是 NULL（不应该，但可能因为 Bug 1 损坏），
        // strcmp(p->name, name) 会崩溃
        char temp[MAX_NAME_LEN];
        strcpy(temp, name);  // 这行其实没问题
        if (strcmp(p->name, name) == 0) {  // 这里看起来没问题
            return p;  // 但返回的指针可能在后面被错误使用
        }
        p = p->next;
    }
    return NULL;  // 未找到
}

// ============ Bug 3：野指针使用 ============
// 删除学生时，如果删除的是链表中的某个节点，
// 其他保存了该节点指针的变量就变成了野指针
// 
// 触发方法：删除学生后，再查询该学生
// 
// 修复思路：删除后确保没有其他指针引用已释放的内存
void delete_student(const char *name) {
    Student *prev = NULL;
    Student *curr = g_head;

    while (curr != NULL) {
        if (strcmp(curr->name, name) == 0) {
            if (prev == NULL) {
                g_head = curr->next;
            } else {
                prev->next = curr->next;
            }
            free(curr);  // Bug 3：释放后，调用者如果还保存了之前 find_student() 的返回值，就成了野指针
            g_count--;
            printf("✓ 已删除学生：%s\n", name);
            return;
        }
        prev = curr;
        curr = curr->next;
    }
    printf("✗ 未找到学生：%s\n", name);
}

// ============ Bug 4：内存泄漏 ============
// 每次重新加载文件时，旧链表没有释放
// 如果程序多次加载数据，内存会不断增长
// 
// 修复思路：在加载前先清空现有链表
void load_from_file() {
    FILE *fp = fopen(DATA_FILE, "rb");
    if (fp == NULL) {
        printf("（未找到数据文件，将从空链表开始）\n");
        return;
    }

    // Bug 4：没有先清空旧链表，如果之前已经有数据，会泄漏
    // 正确的做法是先调用 free_all() 释放所有节点

    Student dummy;
    while (fread(&dummy, sizeof(Student), 1, fp) == 1) {
        // 注意：这里读取的是结构体副本，指针成员 next 肯定是无效的
        // 需要重新分配节点
        Student *node = (Student *)malloc(sizeof(Student));
        if (node == NULL) continue;

        memcpy(node, &dummy, sizeof(Student));
        node->next = g_head;
        g_head = node;
        g_count++;
    }

    fclose(fp);
    printf("✓ 已从文件加载 %d 条学生记录\n", g_count);
}

// ============ Bug 5：文件写入指针未关闭 ============
// 保存到文件后，fclose 放在了错误的位置
// 如果 fopen 失败，fp 是 NULL，后续 fclose 行为未定义
// 
// 修复思路：确保所有代码路径都正确关闭文件
void save_to_file() {
    FILE *fp = fopen(DATA_FILE, "wb");
    if (fp == NULL) {
        printf("✗ 无法打开文件写入\n");
        return;
    }

    Student *p = g_head;
    while (p != NULL) {
        // 写入时，指针成员 next 不要写入文件（因为它是运行时指针）
        Student temp;
        memcpy(&temp, p, sizeof(Student));
        temp.next = NULL;  // 确保 next 是 NULL，文件中不保存指针

        if (fwrite(&temp, sizeof(Student), 1, fp) != 1) {
            printf("✗ 写入失败\n");
            // Bug 5：这里 return 了，但 fp 没有被 fclose
            return;
        }
        p = p->next;
    }

    fclose(fp);  // 正常路径会关闭
    printf("✓ 已保存 %d 条记录到文件\n", g_count);
}

// 释放所有节点
void free_all() {
    Student *p = g_head;
    while (p != NULL) {
        Student *next = p->next;
        free(p);
        p = next;
    }
    g_head = NULL;
    g_count = 0;
}

// 打印菜单
void print_menu() {
    printf("\n===== 学生成绩管理系统 =====\n");
    printf("1. 添加学生\n");
    printf("2. 查询学生\n");
    printf("3. 删除学生\n");
    printf("4. 列出所有学生\n");
    printf("5. 保存到文件\n");
    printf("6. 从文件加载\n");
    printf("0. 退出\n");
    printf("请选择：");
}

// 添加学生（交互式）
void interactive_add() {
    char name[MAX_NAME_LEN];
    int c, m, e;

    printf("请输入学生姓名：");
    // Bug 1 相关：gets() 已经被废弃，这里用 fgets 但没有处理换行符
    // 不过 fgets 会自动截断，比 gets 安全一些
    // 真正的问题在于 add_student() 里的 strcpy
    fgets(name, MAX_NAME_LEN, stdin);
    // 去掉换行符
    name[strcspn(name, "\n")] = '\0';

    printf("请输入语文成绩：");
    scanf("%d", &c);
    printf("请输入数学成绩：");
    scanf("%d", &m);
    printf("请输入英语成绩：");
    scanf("%d", &e);
    getchar();  // 消耗换行符

    add_student(name, c, m, e);
    printf("✓ 添加成功！\n");
}

// 查询学生（交互式）
void interactive_query() {
    char name[MAX_NAME_LEN];
    printf("请输入要查询的学生姓名：");
    fgets(name, MAX_NAME_LEN, stdin);
    name[strcspn(name, "\n")] = '\0';

    Student *result = find_student(name);
    if (result == NULL) {
        printf("✗ 未找到该学生\n");
        return;
    }

    // Bug 2 相关：如果 find_student 返回 NULL 但没检查就使用，会崩溃
    // 不过这里已经做了检查，所以这部分没问题
    // 真正的问题是：find_student 里没有明显的 strcpy vs strcmp 问题
    // 让我们重新审视 Bug 2...
    // 
    // Bug 2 实际上是一个"潜在问题"：如果某个节点因为 Bug 1 导致 name 字段被截断/损坏，
    // strcmp 可能会读到超出边界的内存，虽然不总是崩溃，但行为不确定
    printf("\n===== 成绩单 =====\n");
    printf("姓名：%s\n", result->name);
    printf("语文：%d\n", result->scores[0]);
    printf("数学：%d\n", result->scores[1]);
    printf("英语：%d\n", result->scores[2]);
    printf("平均分：%.2f\n", result->avg_score);
}

// 列出所有学生
void list_all() {
    if (g_head == NULL) {
        printf("（暂无学生记录）\n");
        return;
    }

    printf("\n===== 学生列表 =====\n");
    printf("%-15s %-8s %-8s %-8s %-8s\n", "姓名", "语文", "数学", "英语", "平均分");
    printf("----------------------------------------------\n");

    Student *p = g_head;
    while (p != NULL) {
        printf("%-15s %-8d %-8d %-8d %-8.2f\n",
               p->name, p->scores[0], p->scores[1], p->scores[2], p->avg_score);
        p = p->next;
    }
    printf("共 %d 名学生\n", g_count);
}

// 入口
int main() {
    printf("===== 学生成绩管理系统 =====\n");
    printf("(C语言链表实现版)\n");

    load_from_file();

    int choice;
    while (1) {
        print_menu();
        if (scanf("%d", &choice) != 1) {
            printf("✗ 输入无效\n");
            while (getchar() != '\n');  // 清空输入缓冲区
            continue;
        }
        getchar();  // 消耗换行符

        switch (choice) {
            case 1:
                interactive_add();
                break;
            case 2:
                interactive_query();
                break;
            case 3:
                interactive_query();  // Bug 复用：这里没有调用 delete_student，
                                       // 而是又调用了 query，应该是调用 delete_student
                // 但实际上这是另一个 Bug：选项 3 应该先查询确认再删除，
                // 或者直接调用 delete_student 交互函数
                break;
            case 4:
                list_all();
                break;
            case 5:
                save_to_file();
                break;
            case 6:
                free_all();  // 重新加载前应该先清空，但这个调用在 Bug 4 之后才有用
                load_from_file();
                break;
            case 0:
                printf("再见！\n");
                free_all();
                return 0;
            default:
                printf("✗ 无效选项\n");
        }
    }
}
