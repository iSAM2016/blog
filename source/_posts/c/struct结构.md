---
title: 结构
date: 2021-10-30 14:57:08
tags:
- c语言
---
# struct
C 语言没有其他语言的对象（object）和类（class）的概念，struct 结构很大程度上提供了对象和类的功能。

下面是struct自定义数据类型的一个例子。

```c
struct tag { 
    member-list
    member-list 
    member-list  
    ...
} variable-list ;
```

声明了数据类型car和该类型的变量car。
```c
struct car
{
    char *name;
    float price;
    int speed;
} mycar;
struct car myca = {"大众", 178.9, 100};
mycar.name = "本田";
```
如果将 struct 变量传入函数，函数内部得到的是一个原始值的副本。

```c
#include <stdio.h>

struct turtle {
  char* name;
  char* species;
  int age;
};

void happy(struct turtle t) {
  t.age = t.age + 1;
}

int main() {
  struct turtle myTurtle = {"MyTurtle", "sea turtle", 99};
  happy(myTurtle);
  printf("Age is %i\n", myTurtle.age); // 输出 99
  return 0;
}
```

上面示例中，函数happy()传入的是一个 struct 变量myTurtle，函数内部有一个自增操作。但是，执行完happy()以后，函数外部的age属性值根本没变。原因就是函数内部得到的是 struct 变量的副本，改变副本影响不到函数外部的原始数据。

指针变量也可以指向struct结构。

```c
struct book {
  char title[500];
  char author[100];
  float value;
}* b1;
```

上面示例中，变量b1是一个指针，指向的数据是struct book类型的实例。

为了使用指向该结构的指针访问结构的成员，必须使用 -> 运算符，如下所示：

`b1->title;`
```c
//9-2.c
struct Books
{
    char title[50];
    char author[50];
    char subject[100];
    int book_id;
};

// 函数声明
void printBook(struct Books *books);

int main()
{
    struct Books Book1;
    struct Books Book2;

    /**
     * Book1 描述 
     */
    strcpy(Book1.title, "C Programming");
    strcpy(Book1.author, "Nuha Ali");
    strcpy(Book1.subject, "C Programming Tutorial");
    Book1.book_id = 6495407;

    /* Book2 详述 */
    strcpy(Book2.title, "Telecom Billing");
    strcpy(Book2.author, "Zara Ali");
    strcpy(Book2.subject, "Telecom Billing Tutorial");
    Book2.book_id = 6495700;

    /* 通过传 Book1 的地址来输出 Book1 信息 */
    printBook(&Book1);

    /* 通过传 Book2 的地址来输出 Book2 信息 */
    printBook(&Book2);

    return 0;
}


void printBook(struct Books *book)
{
    printf("Book title : %s\n", book->title);
    printf("Book author : %s\n", book->author);
    printf("Book subject : %s\n", book->subject);
    printf("Book before book_id : %d\n", book->book_id);

    (*book).book_id = (*book).book_id + 1;
    printf("Book agter book_id : %d\n", book->book_id);
}
```
struct 结构也可以作为数组成员。下面示例声明了一个有1000个成员的数组books，每个成员都是自定义类型book的实例。

```c
struct Books
{
    char title[50];
    char author[50];
    char subject[100];
    int book_id;
};

int main(int argc, char const *argv[])
{
    struct Books books[1000];

    books[0].book_id = 22;
    books[0].book_id = 7;
    return 0;
}

```

# struct的嵌套
struct 结构的成员可以是另一个 struct 结构。
```c
struct species {
  char* name;
  int kinds;
};

struct fish {
  char* name;
  int age;
  struct species breed;
};
```

上面示例中，fish的属性breed是另一个 struct 结构species。

```c
// 写法三
struct fish shark = {
  .name="shark",
  .age=9,
  .breed={"Selachimorpha", 500}
};
```
引用breed属性的内部属性，要使用两次点运算符（shark.breed.name）。

对字符数组属性赋值，要使用strcpy()函数，不能直接赋值，因为直接改掉字符数组名的地址会报错。

strcpy(shark.breed.name）, "Harry");