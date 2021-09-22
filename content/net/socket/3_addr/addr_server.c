/* 服务端 
 * 服务器端套接字或监听套接字
 * @Author: isam2016 
 * @Date: 2019-03-23 20:04:34 
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-03-24 11:08:42
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>
void error_handling(char *message);

int main()
{
    int serv_sock;
    int clnt_sock;

    struct sockaddr_in serv_addr;
    char *serv_port = "9188";

    struct sockaddr_in clnt_addr;
    socklen_t clnt_addr_size;

    char message[] = "hello world";

    //  1.调用docket 套接字
    serv_sock = socket(PF_INET, SOCK_STREAM, 0);

    if (serv_sock == -1)
    {
        error_handling('socket() error');
    }
    // 地址信息初始化
    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;                    // 指定地址族
    serv_addr.sin_addr.s_addr = inet_addr(INADDR_ANY); // 基于字符串 的IP 地址 初始化
    serv_addr.sin_port = htons(atoi(serv_port));       // 基于字符串的端口号初始化 htons 字节转换

    //  2. 使用bind 函数分配IP地址 和端口号
    if (bind(serv_sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) == -1)
    {
        error_handling('bind() error');
    }
    //   3 抵用listen 函数转为可接收请求转态
    if (listen(serv_sock, 5) == -1)
    {
        error_handling('acept() error');
    }

    clnt_addr_size = sizeof(clnt_addr);
    //   调用accept 函数接收请求连接
    clnt_sock = accept(serv_sock, (struct sockaddr *)&clnt_addr, &clnt_addr_size);

    if (clnt_sock == -1)
        error_handling("accept() error");

    write(clnt_sock, message, sizeof(message));
    close(clnt_sock);
    close(serv_sock);
    return 0;
}

void error_handling(char *message)
{
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}