---
title: mybatis源码（一）-配置文件加载
date: 2021-08-28 18:01:25
tags:
- mybatis
categories:
- mybatis
---
> MyBatis的版本是3.0.2
![mybatis文档](https://mybatis.org/mybatis-3/zh/index.html)
![参考文章，写的太好了](https://www.pdai.tech/md/framework/orm-mybatis/mybatis-y-arch.html)

## 原始接口demo
jdbc 它是Java程序访问数据库的标准接口。

java app ---> JDBC Interface---> JDBCDriver ----->Database
执行一个完整的操作需要 

1. 连接数据库
2. 编写语句
3. 传参
4. 执行
 
![JDBC连接数据库](https://gitee.com/isam2016/mybatis-source-code/tree/master/jdbc);

## 痛点分析(盲猜) 
1. 频繁建立连接
2. 事务处理（要在JDBC中执行事务，本质上就是如何把多条SQL包裹在一个数据库事务中执行）
3. sql 语句处理

## 架构分析

 ![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/WechatIMG239.png)
 
 接口层- mapper 文件的存在纯粹是为了实现面向接口编程
 
 盗图 

 ## MaBatis初始化方式
* 基于xml文件的初始化方式 
* Java 代码构建
  *  主动构建Configuration 对象，并把environment 对象set到Configuration 中，environment 元素体中包含了事务管理和连接池的配置
## xml配置流程分析

```java
// 配置文件引用 并初始化
String resource = "org/mybatis/example/mybatis-config.xml";
InputStream inputStream = Resources.getResourceAsStream(resource);
SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
// 获取sqlssion
 session = sqlSessionFactory.openSession();
 // 执行语句
User employeer = (User) session.selectOne("com.batis.mapper.UserMapper.getUserById", 1);
```

总体流程基本是JDBC原生的流程 三板斧。

### MyBatis的初始化流程
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/mybatis-y-init-1.png)

* 使用Resources获取xml配置文件的字符流Reader
* SqlSessionFactoryBuilder会根据输入流inputStream等信息创建XMLConfigBuilder对象
* SqlSessionFactoryBuilder.build()会根据字符流，调用XMLConfigBuilder（xml文件配置解析） 方法，返回该对象
*  加载XMLConfigBuilder 对象的时候，构造函数初始化了 Configuration(MyBatis配置中心)对象
* SqlSessionFactoryBuilder调用XMLConfigBuilder对象的parse()方法；
* XMLConfigBuilder对象返回Configuration对象；
* SqlSessionFactoryBuilder根据Configuration对象创建一个DefaultSessionFactory对象；
* SqlSessionFactoryBuilder返回 DefaultSessionFactory对象给Client，供Client使用。

上述过程设计的关键对象： 
*  new SqlSessionFactoryBuilder()：  构建MyBatis会话器
*  new Configuration(MyBatis配置中心)： 构建MyBatis 配置文件
*  new SqlSessionFactory： 构建SqlSession对象 sql 语句会话器
*  new XMLConfigBuilder: 负责解析xml 文件，形成Configuration 对象， 给XMLConfigBuilder使用
  
### 构建Configuration对象过程

* XMLConfigBuilder会将XML配置文件的信息转换为Document对象
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/mybatis-y-init-2.png)
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/mybatis-y-init-2%20(1).png)

* 之后XMLConfigBuilder调用parse()方法 会从XPathParser中取出<configuration>节点对应的Node对象，然后解析此Node节点的子Node：properties, settings, typeAliases,typeHandlers, objectFactory, objectWrapperFactory, plugins, environments,databaseIdProvider, mappers