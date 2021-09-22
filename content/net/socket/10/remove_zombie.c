
#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <unistd.h>
#include <sys/wait.h>

void read_childprc(int sig)
{
    int status;
    pid_t id = waitpid(-1, &status, WNOHANG);
    if (WIFEXITED(status))
    {
        printf("remove proc id: %d \n", id);
        printf("child send %d\n", WEXITSTATUS(status));
    }
};

int main(int argc, char const *argv[])
{
    pid_t pid;
    struct sigaction act;
    act.sa_handler = read_childprc;
    sigemptyset(&act.sa_mask);
    act.sa_flags = 0;
    sigaction(SIGCHLD, &act, 0);

    pid = fork();
    if (pid == 0)
    {
        puts("hi i am child process");
        sleep(10);
        return 12;
    }
    else
    {
        // 父进程
        printf("child proc id: %d \n", pid);
        pid = fork();
        if (pid == 0)
        {
            puts("hi i am chldproess");
            sleep(10);
            exit(24);
        }
        else
        {
            int i;
            printf("child proc id: %d \n", pid);
            for (i = 0; i < 3; i++)
            {
                puts("wait...");
                sleep(100);
            }
        }
    }

    return 0;
}
