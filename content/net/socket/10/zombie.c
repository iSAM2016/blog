#include <stdio.h>
#include <unistd.h>

int main(int argc, char const *argv[])
{
    pid_t pid = fork();
    printf("pid:[%d] \n", pid);
    if (pid == 0) // if child press
    {
        puts("hi i am a child process");
    }
    else
    {
        printf("child proc ID:[%d] \n", pid);
        sleep(10);
    }

    if (pid == 0)
    {
        puts("end child process");
    }
    else
    {
        puts("end parent process");
    }

    return 0;
}
