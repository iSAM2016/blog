/* 
 *  signal.c 
 *  version 2 
 *  Created on: 2010-5-29 
 *      Author: wangth 
 */
#include <stdio.h>
#include <unistd.h>
#define BUF_SIZE 30

int main(int argc, char const *argv[])
{
    int fds[2];
    char str1[] = "who are you?";
    char str2[] = "think you for you messsage";
    char buf[BUF_SIZE];
    pid_t pid;

    pipe(fds);
    pid = fork();
    if (pid == 0)
    {
        write(fds[1], str1, sizeof(str1));
        // sleep(2);
        read(fds[0], buf, BUF_SIZE);
        printf("child proc out put %s \n", buf);
    }
    else
    {
        read(fds[0], buf, BUF_SIZE);
        printf("parent  proc out put %s \n", buf);
        write(fds[1], str2, sizeof(str2));
        sleep(3);
    }
    return 0;
}
