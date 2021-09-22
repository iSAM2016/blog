/*****
 * 服务器在同一时刻只与一个客户端相连接，并提供回声服务
 * 服务端依次向5个客户端提供服务并退出
 *  
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
    int str_len, i;

    struct sockaddr_in serv_adr, clnt_adr;
    socklen_t clnt_adr_sz;

    if (argc != 2)
    {
        printf("Usage: %s <port>\n", argv[0]);
        exit(1);
    }

    //  1. 调用socket, 创建准备连接服务器的套接字，此时创建的是TCP 套接字
    serv_sock = socket(PF_INET, SOCK_STREAM, 0);
    if (serv_sock == -1)
        error_handling("socket() error");

    memset(&serv_adr, 0, sizeof(serv_adr));
    serv_adr.sin_family = AF_INET;
    serv_adr.sin_addr.s_addr = htonl(INADDR_ANY);
    serv_adr.sin_port = htons(atoi(argv[1]));

    if (bind(serv_sock, (struct sockaddr *)&serv_adr, sizeof(serv_adr)) == -1)
        error_handling("bind() error");

    if (listen(serv_sock, 5) == -1)
        error_handling('listen() error');

    clnt_adr_sz = sizeof(clnt_adr);
    /**begin**/
    // 共计调用5次accept 函数，依次向5个客户端提供服务
    for (i = 0; i < 5; i++)
    {
        clnt_sock = accept(serv_sock, (struct sockaddr *)&clnt_adr, &clnt_adr_sz);
        if (clnt_sock == -1)
        {
            error_handling("accept error");
        }
        else
        {
            printf("conneted client %d \n", i + 1);
        }
        while ((str_len = read(clnt_sock, message, BUF_SIZE)) != 0)
        {
            write(clnt_sock, message, str_len);
        }
        //  针对套套接字调用close 函数，向连接的相应套接字发送EOF
        close(clnt_sock);
    }
    /**end**/
    close(serv_sock);
    return 0;
}

void error_handling(char *message)
{
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}