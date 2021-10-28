---
title: c和指针-指针
date: 2021-10-26 17:48:21
tags:
categories:
- c语言
---

如果能把汇编学了，就能更好理解指针了。

指针变量就是一个其值为另外一个内存地址的变量。比较官网的说法。

每个人有固定的省份证号，代表是你自己，这是绝对的标识。但是我们用名字来代理你自己 这是逻辑标识

每个电脑网络有唯一的mac 地址，是绝对地址.但是我们使用IP地址进行通信。这是逻辑地址

一栋楼的房间有固定的经纬，高度坐标。这是绝对地址，但是我们使用省市区，街道小区，门牌号来表示房间地址，这是逻辑地址

数据是存储在内存中的，我们知道找到内存的绝对地址（0x00000001），就能找到存储在其中的值。 但是我们不可能使用这个绝对地址的。

计算机内存中的每个位置都由一个地址标识，指针就是它的值表示内存地址的变量。

`char *message ="hello w";`

这条语句是把message声明为一个指向字符串的指针。相当于两步
```
char *message; 声明
message="hello w";
```
# 内存和地址 


![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211026195913.jpg)

我们使用符号，代替的内存地址。进行如下操作，变量d和e的声明，他们都被声明为了指针。注意是a和e是指针，不是\*e和\*a. **指针也是变量，变量在等号的左边是赋值操作，右边是取值操作。**
```c
// p6-1
int a = 112, b=-1; // a 的地址为0x7ffeefbff4d8 
float c = 3.14; // c的地址为 0x7ffeefbff4d0
int *d = &a;
float *e = &c;
printf("a-address：%p\n", &a);
printf("c-address：%p\n", &c);
```
指针的初始化是用&操作完成的，用于产生操作的内存地址

变量d和e的声明，他们被声明为指针，并记录了其他内存的地址。

d存储是a的地址，e存储的是c的地址，变量d的地址是112，他的内容是100。我们看到数字100 也用于第一个内存块的地址

dubug 观察一下内存情况
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211028095601.jpg)
打印的a的物理地址 和 c的物理地址
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211028100057.jpg)

我们不难发现 d存储的值就是a的物理地址， e存储的值就是c的物理地址

通过一个指针访问它所指向的地址的过程称为间接访问，使用单目操作符号* (通过逻辑地址来访问内容)
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211026203414.jpg)

看到倒数第二行的\*d是不是蒙了 哈哈

在刚在`int *d = &a; d为100`

\*d被声明为一个指针，将a的地址100存入d,并且这个指针指向的内存数据是int类型，并不是\*d是int类型，也不是d是int类型。 也就解释了`float *e = &c` 这个语句谁是float类型。是c下的数据是float。  

此时，d的类型是指针，d的值是地址100。 

此时 再一次使用\*即\*d,对指针进行间接访问，访问的就是内存的值。前边已经提到 `int *d `中的int 代表的 d地址下的数据是int 类型，访问到的数据是112， 同理\*e访问的就是float数据类型.

# 指针，间接访问和左值

书中介绍的让我头晕。 我们可以记忆， 指针也是变量，变量在等号的左边是赋值操作，右边是取值操作。

我们看一下 `*d = 112 - *d`

1. 右边的\*d是获取位置d(100)的内存值是112， 112-112=0
2. 左边 给\*d的赋值，d存储的是0

```c
#include <stdio.h>

int main()
{
    int a = 112, b = -1;
    float c = 3.14;
    int *d = &a;
    float *e = &c;
    long f = 0xffffffffffff;
    /* 我的第一个 C 程序 */
    printf("*d获取地址内存中的数据: %d\n", *d);
    *d = *d - 0;
    printf("指针（地址）的值为：%p\n", d);
    printf("*d获取地址内存中的数据: %d\n", *d);
    return 0;
}
```

```shell
*d获取地址内存中的数据: 112
指针（地址）的值为：0x7ffee5cf3528
*d获取地址内存中的数据: 112
```

# 指针的指针

```c
int a =12;
int *b = &a;
int **c = &b;
```
他们如图所示进行内存分配：
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027172435.jpg) 

c 是指针的指针，他的声明式 `int **c`,\* 操作符具有从右想左的结核性，所以这个表达式相当于\*(\*c),我们必须从里面向外边逐层求值， \*c 访问c所指的位置，是变量b.第二个间接访问操作符访问这个位置所指向的地址，就是变量a。

我们也可以使用箭头和 \* 对应来想象指针的指向。如果表达式出现了间接访问操作符，你的箭头访问它所指向的位置

我们观察一下实际的debug情况。主要观察c的值
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211028101413.jgp)

我们刚才分析了\*\*c指向的问题

赋值过程：\*\*c: c存储的是b的地址
 
取值过程：\*c 取到的是b存储的值即a的物理地址，\*\*c取到的值是a的存储的值是12

# 指针表达式
我们看一下声明，
```c
char ch ='a';
char *cp = &ch;
```

## 表达式ch
我们看一下内存的初始化。
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027180445.jpg)

当他当做右值使用的时候，表达式的值为'a',如下图所示：
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027180734.jpg)

当这个表达式作为左值使用的时候，他是之歌内存的地址，而不是该地址所包含的值
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027181051.jpg)

## 表达式&ch
作为右值 这个表达式的值是变量ch 的地址，变量cp存储的就是这个地址。

## 表达式cp
他的右值就是cp的值，他的左值就是cp所处的内存位置
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027181939.jpg)

## 表达式&cp
&cp 所取得就是指针变量地址，这个结果的类型是指向字符的指针的指针。
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027182845.jpg)

## 表达式*cp
右值表示内存中的值，左值是内存地址
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027183142.jpg)

## 表达式*cp+1

1. \*的优先级高于+,执行\*cp,获取到ch的值
2. 取得的这个值的一份拷贝并把它+1，得到字符串`b` 

## 表达式*(cp+1)
有括号，先执行加法运算，就是把1和cp中所存储的地址相加。 然后和 表达式\*cp 一样

## ++cp
增加了指针变量的cp的值，运算的结果增值后的指针的一份拷贝，前缀++先增加它的操作数的值在返回这个结果

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027191110.jpg)

## cp++
后缀++操作符同样增加cp的值，但是它先返回cp的值的一份拷贝，然后在增加cp的值，这样，这个表达式的值技术cp原来的值的一份拷贝。
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027191950.jpg)

## *++cp 
间接操作符作用于增值后的指针的拷贝上，所以它的右值是ch 后面那个内存地址的值，而他的左值就是那个位置本身

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027192944.jpg)

## *cp++
1. ++ 操作符产生cp的一份拷贝
2. 让后++操作符增加cp的值
3. 最后 在cp的拷贝上（步骤1的拷贝）执行间接访问操作

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027194027)
## ++*cp
cp所指向位置的值增加1
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211027194238.jpg)

# 实验：计算字符串的长度

```c
// s6.1
#include <stdio.h>

size_t
strlen(char *string)
{
    int length = 0;
    /***
     * 依次访问字符串内容 计算字符串 并计数 
     */
    while (*string++ != '\0')
    {
        ++length;
    }
    return length;
}

int main()
{
    char *str = "123";
    int len = strlen(str);
    printf("*d获取地址内存中的数据: %d\n", len);
    return 0;
}
```
# 实验：查找指定字符，并调试

给定一个指向以NULL结尾的指针列表的指针，在列表的字符串中查找一个特定字符
```c
// s6.2
#include <stdio.h>
#define TRUE 1
#define FALSE 2

int find_char(char **strings, char value)
{
    char *string;
    while ((string = *strings++) != NULL) 
    {
        while (*string != '\0') 
        {

            if (*string++ == value)
            {
                return TRUE;
            }
        }
    };
    return FALSE;
}
int main()
{
    //字符串
    char a[10] = "China";
    char b[10] = "American";
    char c[10] = "Japan";
    char d[10] = "Germany";
    char e[10] = "British";
    char f[10] = "French";
    char g[10] = "Russia";
    //指针列表 逐个初始化 存放的字符换的开始地址
    char *strlist[] = {&a[0], &b[0], &c[0], &d[0], &e[0], &f[0], &g[0], NULL};
    //指针列表指针
    char **ppoint = &strlist[0];
    //输入要查询的字符
    char value[] = 'C';
    int num = find_char(ppoint, value);
    printf("是否出现字符: %d\n", num);
    return 0;
}
```

程序分析： 
1. 这个程序的物理模型如图

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211028103906.jpg)

我们画一个物理内存示意图
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211028111551.jpg)

其中一个关键函数 `char **ppoint = &strlist[0];` 作用是获取了数组的内存地址,这样通过ppint 就可以访问到所有数据的内存地址了

我们debug 验证一下**ppoint的存储的值
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211028112457.jpg)

当进入find_char 后，如图
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211028113237.jpg) 

此时 string 是变量，没有赋值， strings的值是strlist[0]的物理地址。然后`string = *strings++`

1. ++ 操作符产生strings的一份拷贝
2. 然让后++操作符增加strings，此时strings存储的地址是strlist[2]的物理地址
3. 最后 在strings的拷贝上，（步骤1的拷贝）执行间接访问操作,访问strlist[0] 存储的值, 就是`Chana` 中 ”C“的物理地址
4. `  while (*string != '\0')` 中的 *string 就是通过”C“的物理地址访问内存内容，就是”C“。
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20211028113606.jpg)
