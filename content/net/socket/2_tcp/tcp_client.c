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

void error_handling(char *message);

int main(int argc, char *argv[])
{
    /* code */
    int sock;
    struct sockaddr_in serv_addr;
    char message[30];
    int str_len = 0;
    int idx = 0, read_len = 0;

    if (argc != 3)
    {
        printf("Usage: %s <IP><port>\n", argv[0]);
        exit(1);
    }
    //  1. 调用socket
    sock = socket(PF_INET, SOCK_STREAM, 0);
    if (sock == -1)
        error_handling("socket() error");

    memset(&serv_addr, 0, sizeof(serv_addr));
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_addr.s_addr = inet_addr(argv[1]);
    serv_addr.sin_port = htons(atoi(argv[2]));

    if (connect(sock, (struct sockaddr *)&serv_addr, sizeof(serv_addr)) == -1)
        error_handling('connect() error');
    //  每次读取一个字节
    while (read_len = read(sock, &message[idx++], 1))
    {
        /* code */
        if (str_len == -1)
            error_handling('read() error');
        str_len += read_len;
    }

    // 课后作业客户端一次调用read
    str_len = read(sock, message, sizeof(message) - 1);
    printf("message from server: %s \n", message);
    printf("function read call count: %d \n", str_len);
    close(sock);
    return 0;
}

void error_handling(char *message)
{
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}