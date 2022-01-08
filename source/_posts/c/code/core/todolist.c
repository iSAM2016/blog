#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "../stand.h"

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
