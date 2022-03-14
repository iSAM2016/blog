---
title: c语言学习
date: 2021-10-31 19:13:17
tags: 导读
categories:
- 导读
---

# 实验准备
[VS Code之C/C++程序的调试(Debug)功能简介](https://zhuanlan.zhihu.com/p/85273055)


# 参考书籍 

1. [《C和指针》](https://item.jd.com/12956672.html)

# 文章链接

1. [C 语言教程和复习](https://wangdoc.com/clang/)
2. 如果是新手请直接看视频学习C语言, 然后再看1 [程序设计入门——C语言 浙大翁凯](https://www.icourse163.org/course/ZJU-199001)
3. [c和指针-指针](https://isam2016.cn/2021/10/26/c/c%E5%92%8C%E6%8C%87%E9%92%88-%E6%8C%87%E9%92%88/)
4.  [c和指针-struct结构](https://isam2016.cn/2021/10/30/c/c%E5%92%8C%E6%8C%87%E9%92%88-struct%E7%BB%93%E6%9E%84/)
5.  [c和指针-内存管理](https://isam2016.cn/2021/10/30/c/c%E5%92%8C%E6%8C%87%E9%92%88-%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/)

# c 语言实战 
> 建议写 大量的demo 来熟悉c 语言。 可以网上搜寻 [c 语言编程 100 例](https://www.runoob.com/cprogramming/c-100-examples.html)
> 为了适应以后编写操作系统的需要，我写了一个小项目

<!-- 4.  [c和指针-typeof](https://isam2016.cn/2021/11/06/c/c和指针-typeof/) -->

# 熟练c语言-todoList项目

todoList项目,为了熟悉c语言，为了更好的编写操作系统。减少陌生感。

需求：
1. 实现一个tidolist,主要实现 增， 删， 查， 列表
2. 列表输出到控制台 
3. 需要美化一下
4. list 按日期号 1-30号分类
5. 每天下，按顺序添加事件
6. 工程文件 组织合理
```
----------------------------------------------
1
**** 1. 打麻将
**** 2. 打篮球
---------------------------------------------
2
**** 1. 编程
**** 2. 运动
**** 3. 听歌
----------------------------------------------
19
**** 1. 编程
**** 2. 运动
**** 3. 听歌
----------------------------------------------
```
## 分析
1. 我们可以把数组存储在文件中或者内存中，我们选择存储在内存中
2. 1-30号 是连续的数字，我们采用数组进行表示
3. 每天下的事件的数据 是不固定的，每个事件节点，有两条关键信息： 序号和事件说明，采用struct 结构来存储事件
4.  主要事件分为 增， 删， 查 ，列表，要对动作进行区分和捕获， 我们从控制台输入信息。然后有对应的反应
5.  增加到同一天下，事件序号要递增，删除事件序号要自动规律变化，比如删除第二项，那么第三项的事件需要， 变为2
6.  要释放内存


```c
// 事件节点
struct todonode
{
    int order;             //序号
    char *thing;           //动词名称
    struct todonode *next; // 下一个节点的地址
};
// 给todoNODE 起别名
typedef struct todonode *NODE;

int main(int argc, char const *argv[])
{
    // 每个数组里存储的是当天事件集合的第一个事件地址
    // 数据类型不能是 int
    NODE day[] = {};
    // 测试 给第一天添加一个事件

    struct todonode *testnode1; // struct ，对于 struct 变量名，使用点运算符（.）获取属性；对于 struct 变量指针，使用箭头运算符（->）获取属性。
    testnode1 = malloc(sizeof(struct todonode));
    testnode1->order = 1;
    testnode1->thing = "打麻将";
    testnode1->next = malloc(sizeof(struct todonode));

    testnode1->next->order = 2;
    testnode1->next->thing = "踢球";
    testnode1->next->next = NULL;

    day[1] = testnode1;
    printf("1号第一件事件是 %s\n", day[1]->thing);
    printf("1号第二件事件是 %s\n", day[1]->next->thing);

    struct todonode *testnode2; // struct ，对于 struct 变量名，使用点运算符（.）获取属性；对于 struct 变量指针，使用箭头运算符（->）获取属性。
    testnode2 = malloc(sizeof(struct todonode));
    testnode2->order = 1;
    testnode2->thing = "炒股";
    testnode2->next = NULL;
    day[19] = testnode2;
    printf("19号第一件事件是 %s\n", day[19]->thing);

    return 0;
}

```

这样我们1，2，3 问题就解决了， 实现了数据的添加

继续优化链表
```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * @brief 事件节点 
 * 
 */
typedef struct todonode
{
    int order;             //序号
    char *thing;           //动词名称
    struct todonode *next; // 下一个节点的地址
} LinkList;
// 给todo 起别名
// typedef struct todonode *NODE;

/**
 * 初始化一个链表 节点
 * order 序号
 * thing 内容
 */
LinkList *create(char *thing)
{
    LinkList *node;                       // 定义节点
    node = malloc(sizeof(LinkList) * 10); // 分配地址 我们分配十个LinkList 大小空间 否则会出错
    node->order = 1;
    node->thing = thing;
    node->next = NULL;
    return node;
}
/**
 * 向链表添加节点 我们默认添加到尾部
 * order 序号
 * thing 内容
 */
void append(LinkList *list, char *thing)
{
    LinkList *t = list;
    while (t->next != NULL)
    {
        t = t->next;
    }
    if (t != NULL)
    {
        t->next = malloc(sizeof(LinkList) * 10);
        t->next->order = t->order + 1;
        t->next->thing = thing;
    }
}
/***
 * 通过序号修改节点信息
 * LinkList *list 链表地址
 * order 序号
 */
void *change(LinkList *list, int order, char *thing)
{
    LinkList *t = list;
    int i = 1;
    while (t != NULL && i < order)
    {
        t = t->next;
        i++;
    }
    if (t != NULL)
    {
        t->thing = thing;
    }
}

/***
 *  删除节点p,把当前p的父连接next连接到 p的next. 并释放内存 当然不能删除第一项
 * LinkList *list 链表地址
 * order 序号,
 */
void *delete (LinkList *list, int order)
{
    LinkList *t = list, *selectNode;
    int i = 1;
    while (t != NULL && i < order)
    {
        selectNode = t;
        t = t->next;
        i++;
    }
    if (t != NULL)
    {
        selectNode->next = t->next;
        free(t);
    }
}

int main(int argc, char const *argv[])
{
    // 每个数组里存储的是当天事件集合的第一个事件地址
    // 数据类型不能是 int
    LinkList *day[] = {};

    day[1] = create("打篮球");
    append(day[1], "听歌");
    append(day[1], "跳舞");
    append(day[1], "写代码");
    LinkList *h = day[1];
    printf("op---------------\n");
    while (h != NULL)
    {
        printf("序号%d ：事件：%s \n", h->order, h->thing);
        h = h->next;
    }
    printf("op---------------\n");
    change(day[1], 2, "听名族歌曲");
    delete (day[1], 1);
    h = day[1];
    while (h != NULL)
    {
        printf("序号%d ：事件：%s \n", h->order, h->thing);
        h = h->next;
    }

    return 0;
}

```

```
运行之后
op---------------
序号1 ：事件：打篮球 
序号2 ：事件：听歌 
序号3 ：事件：跳舞 
序号4 ：事件：写代码 
op---------------
序号1 ：事件：打篮球 
序号2 ：事件：听名族歌曲 
序号4 ：事件：写代码 
```
我们给每个动作进行标号，进行捕捉，分类管理

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

enum actionType
{
    CRTATE, // 创建
    CHANGE, // 修改
    DELETE, // 删除
    LIST    // 显示列表
};

/**
 * @brief 事件节点 
 * 
 */
typedef struct todonode
{
    int order;             //序号
    char *thing;           //动词名称
    struct todonode *next; // 下一个节点的地址
} LinkList;
// 给todo 起别名
// typedef struct todonode *NODE;
// 每个数组里存储的是当天事件集合的第一个事件地址

// 数据类型不能是 int
static LinkList *daylist[] = {};

/**
 * 初始化一个链表 节点
 * order 序号
 * thing 内容
 */
LinkList *create(char *thing)
{
    LinkList *node;                       // 定义节点
    node = malloc(sizeof(LinkList) * 10); // 分配地址 我们分配十个LinkList 大小空间 否则会出错
    node->order = 1;
    node->thing = thing;
    node->next = NULL;
    return node;
}
/**
 * 向链表添加节点 我们默认添加到尾部
 * order 序号
 * thing 内容
 */
void append(LinkList *list, char *thing)
{
    LinkList *t = list;
    while (t->next != NULL)
    {
        t = t->next;
    }
    if (t != NULL)
    {
        t->next = malloc(sizeof(LinkList) * 10);
        t->next->order = t->order + 1;
        t->next->thing = thing;
    }
}
/***
 * 通过序号修改节点信息
 * LinkList *list 链表地址
 * order 序号
 */
void change(LinkList *list, int order, char *thing)
{
    LinkList *t = list;
    int i = 1;
    while (t != NULL && i < order)
    {
        t = t->next;
        i++;
    }
    if (t != NULL)
    {
        t->thing = thing;
    }
}

/***
 *  删除节点p,把当前p的父连接next连接到 p的next. 并释放内存 当然不能删除第一项
 * LinkList *list 链表地址
 * order 序号,
 */
void deletenode (LinkList *list, int order)
{
    LinkList *t = list, *selectNode;
    int i = 1;
    while (t != NULL && i < order)
    {
        selectNode = t;
        t = t->next;
        i++;
    }
    if (t != NULL)
    {
        selectNode->next = t->next;
        free(t);
    }
}
/**
 * 输出todolist
 */
void printfList()
{
    LinkList *t;
    for (int i = 0; i < 30; i++)
    {
        t = daylist[i];
        if (t)
        {
            printf(" ---- %d 号事件汇总 ---- \n", i);
        }
        while (t && t != NULL)
        {
            printf("%d:%s \n", t->order, t->thing);
            t = t->next;
        }
    }
}
/**
 * 控制器
 */
void controle(int day, int type, char *thing, int order)
{
    // 首先判断当天是否已经有事件
    LinkList *currentDay = daylist[day];

    switch (type)
    {
    case 0:
        if (!currentDay) //指针判断
        {
            // 创建链表
            daylist[day] = create(thing);
        }
        else
        {
            // 添加链表
            append(currentDay, thing);
        }
        break;
    case 1:
        change(currentDay, order, thing);
        break;
    case 2:
        delete (currentDay, order);
        break;
    case 3:
        printfList();
        break;
    default:
        break;
    }
}

int main(int argc, char const *argv[])
{

    int currentDay = 1;
    controle(currentDay, CRTATE, "音乐", 0);
    controle(currentDay, CRTATE, "听歌", 0);
    controle(currentDay, CRTATE, "跳舞", 0);
    controle(currentDay, CRTATE, "写代码", 0);

    int currentDay19 = 19;
    controle(currentDay19, CRTATE, "写代码", 0);
    controle(currentDay19, CRTATE, "跳舞", 0);
    controle(currentDay19, CRTATE, "听歌", 0);
    controle(currentDay19, CRTATE, "音乐", 0);
    printf("op------- 新增和添加--------\n");
    LinkList *h = daylist[currentDay];
    while (h != NULL)
    {
        printf("序号%d ：事件：%s \n", h->order, h->thing);
        h = h->next;
    }
    printf("op---------------\n");
    h = daylist[currentDay19];
    while (h != NULL)
    {
        printf("序号%d ：事件：%s \n", h->order, h->thing);
        h = h->next;
    }
    controle(currentDay19, CHANGE, "-音乐-", 1);
    printf("op---------修改------\n");
    h = daylist[currentDay19];
    while (h != NULL)
    {
        printf("序号%d ：事件：%s \n", h->order, h->thing);
        h = h->next;
    }

    printf("op---------删除------\n");
    controle(currentDay19, DELETE, "", 2);
    h = daylist[currentDay19];
    while (h != NULL)
    {
        printf("序号%d ：事件：%s \n", h->order, h->thing);
        h = h->next;
    }

    controle(0, LIST, "", 0);

    return 0;
}

```
运行结果
``` 
 ---- 1 号事件汇总 ---- 
1:音乐 
2:听歌 
3:跳舞 
4:写代码 
 ---- 19 号事件汇总 ---- 
1:-音乐- 
3:听歌 
4:音乐 
```

## 组织工程文件
我们把项目拆分成合理的目录，使用gcc 来编译文件。
* core 核心文件夹
* lib 第三方库文件夹
* stand.h 环境变量文件
```
.
|____core
| |____todolist.c
|____.bashrc
|____lib
| |____utils.c
|____stand.h
```
在ubuntu32 下进行编译的：
1. 编译`gcc core/todolist.c lib/utils.c -o todolist`


```
root@ubuntu:/home/c/project# ./todolist 
op------- 新增和添加--------
序号1 ：事件：音乐 
序号2 ：事件：听歌 
序号3 ：事件：跳舞 
序号4 ：事件：写代码 
op---------------
序号1 ：事件：写代码 
序号2 ：事件：跳舞 
序号3 ：事件：听歌 
序号4 ：事件：音乐 
op---------修改------
序号1 ：事件：-音乐- 
序号2 ：事件：跳舞 
序号3 ：事件：听歌 
序号4 ：事件：音乐 
op---------删除------
序号1 ：事件：-音乐- 
序号3 ：事件：听歌 
序号4 ：事件：音乐 
 ---- 1 号事件汇总 ---- 
1:音乐 
2:听歌 
3:跳舞 
4:写代码 
 ---- 19 号事件汇总 ---- 
1:-音乐- 
3:听歌 
4:音乐 
```
