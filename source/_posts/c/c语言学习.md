---
title: c语言学习
date: 2021-10-31 19:13:17
tags: 导读
categories:
- 导读
---

#  debug
[VS Code之C/C++程序的调试(Debug)功能简介](https://zhuanlan.zhihu.com/p/85273055)
# 导读

1. [C 语言教程](https://wangdoc.com/clang/)
2. 如果是新手请直接看视频学习C语言。 [程序设计入门——C语言 浙大翁凯](https://www.icourse163.org/course/ZJU-199001)


# 参考书籍 

1. [《C和指针》](https://item.jd.com/12956672.html)

# 文章链接
1.  [c和指针-指针](https://isam2016.cn/2021/10/26/c/c%E5%92%8C%E6%8C%87%E9%92%88-%E6%8C%87%E9%92%88/)
2.  [c和指针-struct结构](https://isam2016.cn/2021/10/30/c/c%E5%92%8C%E6%8C%87%E9%92%88-struct%E7%BB%93%E6%9E%84/)
3.  [c和指针-内存管理](https://isam2016.cn/2021/10/30/c/c%E5%92%8C%E6%8C%87%E9%92%88-%E5%86%85%E5%AD%98%E7%AE%A1%E7%90%86/)
<!-- 4.  [c和指针-typeof](https://isam2016.cn/2021/11/06/c/c和指针-typeof/) -->

# 熟练c语言-TODOList项目

TODOList项目,为了熟悉c语言，为了更好的编写操作系统。减少陌生感。

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
// 给TODONODE 起别名
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

我们给每个动作进行标号，进行捕捉，分类管理