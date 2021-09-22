/* tcp 示例 传输的数据不存在边界 
 * @Author: isam2016 
 * @Date: 2019-03-24 09:17:43 
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-03-24 09:59:22
 */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <arpa/inet.h>
#include <sys/socket.h>

#define BUF_SIZE 1024
void error_handling(char *message);

int main(int argc, char *argv[])
{
    /* code */
    int serv_sock, clnt_sock;
    char message[BUF_SIZE];
    struct sockaddr_in serv_addr;
    int str_len, i;

    struct sockaddr_in serv_adr, clnt_adr;
    socklen_t clnt_adr_sz;

    if (argc != 2)
    {
        printf("Usage: %s <IP><port>\n", argv[0]);
        exit(1);
    }
    //  1. 调用socket
    serv_sock = socket(PF_INET, SOCK_STREAM, 0);
    if (serv_sock == -1)
        error_handling("socket() error");

    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_addr.sin_port = htons(atoi(argv[1]));

    // if (connect(serv_sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) == -1)
    //     error_handling('connect() error');
    if (bind(serv_sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) == -1)
    {
        error_handling('bind() error');
    }
    //   3 抵用listen  函数进入等待连接请求状态  此时的套接字才是服务器套接字
    if (listen(serv_sock, 5) == -1)
    {
        error_handling('acept() error');
    }

    clnt_adr_sz = sizeof(clnt_adr);

    // //   调用accept 函数接收请求连接， 从队头取一个请求连接与客户端建立发链接，并且返回创建的套接字文件描述符，

    //  每次读取一个字节
    for (i = 0; i < 5; i++)
    {
        /* code */
        clnt_sock = accept(serv_sock, (struct sockaddr *)&clnt_adr, &clnt_adr_sz);
        if (clnt_sock == -1)
            error_handling('read() error');
        else
            printf("connected client %d \n", i + 1);
        while ((str_len = read(clnt_sock, message, BUF_SIZE)) != 0)
        {
            write(clnt_sock, message, str_len);
        }

        close(clnt_sock);
    }

    // 课后作业客户端一次调用read
    close(serv_sock);
    return 0;
}

void error_handling(char *message)
{
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}