---
title: 网络基础知识
date: 2022-02-01 09:13:28
tags:
categories:
- 计算机网络
---
# 网络基础概念

> 谢希仁

ISP: 电信运营商

广域网： 一般和带宽有关系

计算机一般有连个地址：

1. 网卡 mac 地址：固定
2. IP 地址
3. 数据包 数据帧

    ![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/databao.png)

-   IP 地址 决定了数据包到哪里
-   mac 地址决定了数据传输的路径（跳到那一站）

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/netcloud.png)

**注意：**

-   交换机只看 mac 地址，不会看路由地址
-   路由器会看 IP 地址，从新规划数据包

# 1 OSI 模型

## 1.1 OSI 七层解释

### 1.1.1 应用层

所有能产生网络流量的程序，

### 1.1.2 表示层

在传输之前是否进行压缩 或 加密, 编码，出现乱码一般是表示层

### 1.1.3 会话层

-   netstat -a 查看计算机正在连接的会话
-   netstat -n
-   netstat -tunlp 用于显示 tcp，udp 的端口和进程等相关情况，如下图：

### 1.1.4 传输层

-   可靠传输 一般是分包查询
-   流量控制
-   不可靠传输

### 1.1.5 网络层

-   选择最佳路径
-   动态规划 IP

### 1.1.6 数据链路层

-   帧的开始可结束
-   透明传输
-   交换机
-   差错校验

    1. 就像火车头一样，火车的头尾是开始、结束标注。中间是数据。
       例如： `0116666666011`

    2. 如果开始结尾的数据和内容重复，可以插入一些标识，然后在拿出，实现透明传输

    3. 进行数据的校验，数据包丢失，就丢掉数据。但他不进行数据错误处理

### 1.1.7 物理层

## 1.2 理解 OSI 模型

是从上到下的包容关系，可以用分层的概念思考问题,每一层的工作都是为上层能工作做准备

osi 网络模型对应网络错误排查指导，我们可以从下到上排查每个层级的问题。

1. 物理故障

2. 数据链路层故障

    - mac 地址冲突
    - adls 欠费
    - 网速协商

3. 网络层故障
   配置了错误的子网掩码、 网关

4. 可以给电脑增加多个 IP 地址

# 3 TCP/IP 协议和 OSI 参考模型

OSI 是标准模型，但是实际应用的是 TCP/IP 模型

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20180922-093519@2x.png)

## 3.1 封装-解封

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/1537346215063.png)

详细版

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20180922-103828@2x.png)

## 3.2 计算机网络性能

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20180922-145545@2x.png)

## 3.2.1 速率

    连接在计算机网络上的主机在数字`信道`上传送数据位数的速率，也成为 data rete 或 bit rate。单位是 b/s,kb/s,Mb/s,Gb/s

    - 速率 ：指两端的传递数据的快慢。

    * 信道： 例如没到服务器都可以连接多台的机器，这样他们之间可以形成信道，且每条信道的速率是相同的，`不能说速率是一个总单位`。

## 3.2.2 带宽

数字通信领域中，数字`信道`所能传送的最高数据率。单位是 b/s,kb/s,Mb/s,Gb/s

## 3.2.3 吞吐量

单位时间内通过某个网络的数据量

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20180922-152411@2x)

## 3.2.4 时延

介质的传输速度是固定的。铜的传播速度比光纤快。但是光纤的带宽高。典型的时间换空间的例子。

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20180922-155503@2x.png)

## 3.2.6 往返时间（RTT：round-trip time）

## 3.2.7 利用率

    ![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20180924-125840@2x.png)

# 4 网络层-详细

> 网络层是负责不同网络之间转发数据包，基于数据包的 IP 地址转发并不负责按顺序传输，不负责丢包重传（传输层负责）
> 路由器的工作效率比较高，相当于驿站
> 网路层关心是否是路径最优，

0.0.0.0 不确切地址 一般设备刚启动尚没 IP 地址的使用， 表示本机

255.255.255。255 首先广播地址 同一广播内的主机 ， 表示本网所有的主机

127.0.0.1 回环地址 向自己发送数据

169.254.x.x 自动专用地址，找不到 DHCP 服务器 主机给自己分配一个 IP

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20180924-135528@2x.png)

网络的复杂性，体现在物理层，数据连路层。不同的传输阶段有不同的规则。相对固定，网络错误，一般不会出现在这两层

路由器工作在第三层。

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20180924-141049@2x.png)

## 4.1 网络设备和 OSI 参考模型关系

> 跨网段

发送端

1. 应用程序准备要传送的文件
2. 传输层将文件分段并编码
3. 网路层添加目标 IP 地址源 IP 地址
4. 数据链路层两种情况

    - 使用自己的子掩网吗 判断自己在哪个网段

    * 用自己的子网掩码 判断目标在哪个网段
    * 如果在同一个网段 arp 协议广播解析目标 IP 地址的 MAC
    * 如果不是一个网段 先找网关的 mac（路由）地址， 在通过路由器转发

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20181009-212528@2x.png)

    * 路由器是三层设备，他接收的的数据是没有mac 地址的

## 4.3 网络层-ARP 协议

> 网路层协议

-   arp -a 查看发送广播的设备

## 4.4 网路层——ICMP 协议

> 检测网络故障的

-   ping
    -   time 延迟
    -   TTL 数据包的生存时间，防止数据包的死循环（每过一个路由器则会减一）
        -   linux 64
        -   windows 127
        -   unix 255

*   ping address -l 200 制定数据包的大小
*   pathping 计算 IP 经过所有的路由

## 4.5 ping 和 telnet

ping: 检查 IP 的可达性

telnet 检查服务的可用性

```
telnet 10.75.44.10 80
```

```
ping www.imooc.com 不允许ping
telnet www.imooc.com
```

useradd 添加用户
passwd 添加密码
w 查看用户登录的信息

## 4.6 网络层-IGMP 协议

播放模式

1. 点到点
   每个点形成一个
2. 广播
    - 可以在本网段进行播放（不能跨过路由器），也叫做全网广播
    * 一份视频投影到各处
3. 组播=多播

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20181014-195906@2x.png)

-   比如有的学生看数学，有的看语文，能提供返回看视频的能力.类似频道的概念

## 4.7 IP 数据包

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20181109-230344@2x.png)

-   区分服务： 相当于火车售卖火车票，有特属窗口。数据包也有特别着急传输的，比如语音

-   分片： 数据链路层和网路层传输的数据容量不一致，网路层的容量偏大，数据包需要切分

    -   网路层： 数据包最大 655535 字节

    *   数据连路层 数据包最大 1500 字节

    利用 ping 发大数据包，ping -l size

*   标识： 当数据包分割之后，需要按顺序重组，利用标识序号进行重新组合怕列

*   标志： 为了 区分 数据包分片和较小的完整数据包, 使用标志进行区分。

    -   如果有标志： 分片

        -   MF=1 表示还有分片
        -   MF = 0 表示最后一个分片

    -   没有： 数据包

    ![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20181109-233333@2x.png)

*   生存时间是 ttl
*   ICMP 协议号是 1

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/WX20181101-145812@2x.png)

网路层怎么转发 IP ,静态表，动态表

IP 协议：能让路由自动学习，生成路由表的协议都是 IP 协议，比如：fe

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20181110-000406@2x.png)

## 4.8 公有 IP 和私有 IP

-   Public IP
-   Private IP 不可在互联网使用，仅供机器内部使

A 类 10.0.0.0 -10.255.255.255
B 类 172.16.0.0 -172.31.255.255

# 5 传输层

知识点：

-   传输层协议 UDP 和 TCP
-   网络安全
-   TCP 可靠传输的实现
-   TCP 的流量控制
-   TCP 的拥堵控制
-   TCP 的运输谅解管理

osi 模型和 DOD 模型

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/微信截图_20181112171507.png)

在 TCP/IP 协议栈膻中，传输层有连个协议 TCP 和 UDP

-   TCP： 传输控制协议，需要将传输的文件分段 传输 建立回话可靠传输。
-   UDP: 用户数据协议 一个数据包就能完成传输 不分段 不需要建立会话 不需要流量控制，不可靠传输
    -   dns 解析是 udp 请求

一个数据包的大小 一般为 65 kb ，肯定存在分包的情况。tcp 能保证数据包不丢失。（路由器负责中转传递包裹，如果不能负责就会丢包）

```
netstat -n 查看会话 TCP 链接
netstat -nb 查看建立会话的进程
```

## 5.1 传输层的协议和应用层协议之间的关系

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/微信截图_20181112174134.png)

## 5.2 TCP 和 UDP

传输层为相互通信的应用进程提供了路基通信

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20181117-193946@2x.png)
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20181117-194244@2x.png)

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20181117-194952@2x.png)

## 5.2.0 TCP 和 UDP 的区别

## 5.3 TCP 协议的特点

注意：

-   tcp 协议如何实现可靠传输
-   流量控控制
-   阻塞控制

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/WX20181127-170909@2x.png)

### 5.3.0 tcp 报文格式

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/WX20181206-142651@2x.png)

每条 tcp 有两个端点，TCP 的链接不是主机，不是 IP 地址，不是应用进程，也不是传输层的端口。TCP 链接的端点叫做套接字

### 5.3.1 tcp 协议如何实现可靠传输

基本的原则是， 确认收到再发送

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/WX20181206-140850@2x.png)

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/WX20181206-140850@2x.png)

### 5.3.3 接收窗口和发送窗口

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20190328-230549@2x.png)

tcp 套接字中的缓冲

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20181207-125611@2x.png)

### 5.3.4 滑动窗口

#### 5.3.4.1 滑动窗口正常

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20190328-232342@2x.png)

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20190328-232522@2x.png)

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20190328-232616@2x.png)

#### 5.3.4.2 滑动窗口丢失

sask: 选择性确认

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/QQ20190328-233023@2x.png)

## 5.3.4 TCP 流量控制

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/WX20190329-103254@2x.png)

b 向 a 发送窗口确认信息

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/1553830131297.png)

接收窗口会类周期变化，实现流量控制。b 计算机的缓存窗口满了，发送窗口 Rwnd 会变为 0，应用程序处理缓存数据后，窗口会从新开放
![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/WX20190329-114248@2x.png)

### 计算机网络拥塞控制

造成这个是阻塞是多台计算机造成的

## 5.4 TCP 的传输链接管理

传输链接有三个阶段： 连接建立 、数据传送、链接释放

TCP 运输链的建立和释放是每一次面向链接的通信中必不可少的过程

![](https://isam2016hexo.oss-cn-hangzhou.aliyuncs.com/img/20150619094210336)

## 5.5 通俗大白话来理解 TCP 协议的三次握手和四次分手

[通俗大白话来理解 TCP 协议的三次握手和四次分手 #14](https://github.com/jawil/blog/issues/14)

### 5.5.1 连接建立(三次握手)

TCP 连接的建立都是采用 客户服务器方式

主动发起连接的建立的应用进程叫做客户（client）

被动等待连接的建立的进程叫做服务器（sever）

过程：

-   A 的 TCP 客户进程首先创建传输控制模块 TCB，然后向 B 发出连接请求报文。首部中同步位 SYN=1，序列号 seq=x.  TCP 规定，SYN 报文段（SYN=1 的报文段）不能够携带数据，但是要消耗一个序列号。发送完之后，A 进入 SYN-SENT 状态。（同步已发送状态）。
-   B 收到连接请求报文段后，如同意建立连接，就向 A 发送确认。确认字段中把 SYN 和 ACK 都置为 1，确认号是 ack=x+1，同时也为自己选择一个序列号：seq=y.   请注意，这个报文段也不能够携带数据，但是要消耗序列号。发送完之后，B 进入 SYN-RCVD 状态（同步收到状态）。
-   A 收到 B 的确认之后，还要向 B 给出确认。确认报文的 ACK 置为 1，确认号 ack=y+1，而自己的序号为 seq=x+1。TCP 标准规定，ACK 报文可以携带数据，但是如果不携带数据则不消耗序号，在这种情况下，下一个数据报文的序号仍然是 seq=x+1。发送完毕之后，TCP 连接建立。A 进入 ESTABLISHED 状态，B 收到 A 的确认之后，也进入 ESTABLISHED 状态。
    此时，三次握手完成。

**问题：为什么 A 最后还要发送一次确认呢？**

答案：这主要是为了防止已经失效的连接请求报文段突然又传送到 B，因而产生错误。

所谓“已经失效的连接请求报文段”是这样产生的。

SYN: 表示建立连接

FIN: 表示关闭连接

ACK: 表示响应

PSH: 表示有 DATA 数据传输

RST: 表示连接重置。

### 5.5.2 断开连接（四次挥手）

断开一个 TCP 链接则需要“四次握手”

-   第一次挥手： 主动官邸对方发送的一个 FIN, 用来关闭主动方到被动关闭方的数据传输，也就是主动关闭方告诉被动关闭方：我已经不会再发送数据了，但是此时主动关闭方还可以接受数据

-   第二次挥手： 被动关闭方接收到 FIN 包后， 发送一个 ACK 给对方，确认序号为接受序号+1，

-   第三次挥手： 被动关闭方发送一个 FIN,用来关闭被动关闭方的数据传输，也就是告诉制动关闭方，我的数据也发送完了，不会再给你发数据了。

-   第四次挥手： 主动关闭对方收到 FIN 后，发送一个 ACK 给被动关闭方，确认序号接收到序号+1，

# DNS

## 细节

计算机上有 NDS 客户端，而相当 DNS 客户端的部分称为 DNS 解析器，通过 DNS 查询 IP 地址的操作称为域名解析。

利用 socket 库想 DNS 发布查询
