/*
 * linux 文件操作
 * @Author: isam2016 
 * @Date: 2019-03-23 21:04:34 
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-03-23 21:13:04
 */

#include <stdio.h>
#include <stdlib.h>
#include <fcntl.h> // 头文件
#include <unistd.h>

void error_handling(char *message);

int main(void)
{
    int fd;
    char buf[] = "let's go\n";
    //  打开文件
    //  如果存在 data.txt 则清除文件数据
    fd = open("data.txt", O_CREAT | O_WRONLY | O_TRUNC);
    if (fd == -1)
        error_handling('open() error');

    printf('file descriptor: %d \n', fd);

    //  写入文件
    if (write(fd, buf, sizeof(buf)) == -1)
        error_handling("write() error");
    //  关闭文件
    close(fd);

    return 0;
}
void error_handling(char *message)
{
    fputs(message, stderr);
    fputc('\n', stderr);
    exit(1);
}
