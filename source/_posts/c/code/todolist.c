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
// 给TODO 起别名
// typedef struct todonode *NODE;
// 每个数组里存储的是当天事件集合的第一个事件地址

// 数据类型不能是 int
LinkList *daylist[] = {};

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
