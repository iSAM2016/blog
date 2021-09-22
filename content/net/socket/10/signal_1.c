/* 
 *  signal.c 
 *  version 2 
 *  Created on: 2010-5-29 
 *      Author: wangth 
 */
#include <stdio.h>
#include <unistd.h>
#include <signal.h>

void timeout(int sig)
{
    if (sig == SIGALRM)
    {
        puts("time out");
    }
    // alarm(2);
}

void keycontrol(int sig)
{
    if (sig == SIGINT)
    {
        puts("ctrl +c out");
    }
}

int main(void)
{
    int i = 0;
    signal(SIGALRM, timeout);
    signal(SIGINT, keycontrol);
    alarm(2);
    for (i = 0; i < 3; i++)
    {
        puts("wait...");
        sleep(1);
    }
    return 0;
}
