#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/**
 * @brief 事件节点 
 * 
 */
struct todonode
{
    int order;             //序号
    char *thing;           //动词名称
    struct todonode *next; // 下一个节点的地址
};
// 给TODO 起别名
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
