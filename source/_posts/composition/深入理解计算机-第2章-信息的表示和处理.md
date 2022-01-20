---
title: 计组-信息的表示和处理
date: 2021-11-06 11:39:49
tags:
categories:
- 计组
---
# 信息存储

在之前的汇编课程中， 了解伪指令，db和dw定义字节型数据和字型数据。dd是用来定义dword（double word，双字）型数据的伪指令。 他们存储数据的容量是不一样的。

我们学习的汇编是在计算机的实模式下（x86）进行的，实模式下的段寻址找到就是真实的物理地址。但是进入保护模式，开启分页。计算机的寻址方式就放生了改变，cpu 提供给程序的是虚拟地址，供程序使用。 cpu会把虚拟地址转为为物理地址。 分页模式下，我们会在操作系统中介绍。

此时（开启分页模式）计算机程序将内存视为一个非常大的字节数组。称为虚拟内存。

对于一个字长为w位的机器语言，虚拟地址的范围为0-2^w-1,程序最多访问2^w个字节。

c语言的数据类型所占用的字节数如图。
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211106120337.jpg)

不同的系统存储的数据的顺序可能不同。 有大端法小端法。
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211106124734.jpg)

使用强制类型来访问和打印不同程序对象的字节表。

```c
#include <stdio.h>
typedef unsigned char *byte_pointer;
void show_bytes(byte_pointer start, size_t len)
{
    // len 代表有几个字节
    size_t i;
    for (i = 0; i < len; i++)
    {
        printf(" %.2x", start[i]);
    }
    printf("\n");
}
void show_int(int x)
{
    show_bytes((byte_pointer)&x, sizeof(int));
}

void show_float(float x)
{
    show_bytes((byte_pointer)&x, sizeof(float));
}
void show_pointer(void *x)
{
    show_bytes((byte_pointer)&x, sizeof(void *));
}

int main(int argc, char const *argv[])
{
    int x = 12345;
    int *y = &x;
    show_int(x);
    show_float(12345.0);
    show_pointer(y);

    return 0;
}

```
mac 64位输出的格式为
```
39 30 00 00
00 e4 40 46
0c 44 25 e4 fe 7f 00 00
```
不同机器下，输出的数据格式如图
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211106131330.jpg)


如果我们使用文本数据(ASCII)测试show_bytes 函数，任何系统上都将得到相同的结果，与字节的顺序和大小无关，因为文本数据比二进制具有更强的平台独立性。但是二进制很少能在不同机器和操作系统足额之间进行移植。

