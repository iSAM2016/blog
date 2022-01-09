#ifndef MYHEADER_H
#define MYHEADER_H
enum actionType
{
    CRTATE, // 创建
    CHANGE, // 修改
    DELETE, // 删除
    LIST    // 显示列表
};

/**
 * @brief 链表节点 
 */
typedef struct todonode
{
    int order;             //序号
    char *thing;           //动词名称
    struct todonode *next; // 下一个节点的地址
} LinkList;
// 给TODO 起别名
// typedef struct todonode *NODE;
// 数据类型不能是 int
static LinkList *daylist[] = {};
/**
 * 初始化一个链表 节点
 * order 序号
 * thing 内容
 */
LinkList *create(char *thing);
/**
 * 向链表添加节点 我们默认添加到尾部
 * order 序号
 * thing 内容
 */
void append(LinkList *list, char *thing);
/***
 * 通过序号修改节点信息
 * LinkList *list 链表地址
 * order 序号
 */
void change(LinkList *list, int order, char *thing);

/***
 *  删除节点p,把当前p的父连接next连接到 p的next. 并释放内存 当然不能删除第一项
 * LinkList *list 链表地址
 * order 序号,
 */
void deletenode(LinkList *list, int order);
/**
 * 输出todolist
 */
void printfList();
/**
 * 控制器
 */
void controle(int day, int type, char *thing, int order);

#endif