/*  将字符串信息转换为网络字节序的整数型
 * @Author: isam2016 
 * @Date: 2019-03-24 09:17:43 
 * @Last Modified by: isam2016
 * @Last Modified time: 2019-03-24 10:49:43
 */

#include <stdio.h>
#include <arpa/inet.h>

int main(int argc, char *argv[])
{
    char *addr1 = "1.2.3.4";
    char *addr2 = "1.2.3.4.256"; // 错误的IP地址，需要检测出来

    unsigned long conv_addr = inet_addr(addr1);
    if (conv_addr == INADDR_NONE)
        printf("Error occured");
    else
        printf("network order addr: %#1x \n", conv_addr);

    conv_addr = inet_addr(addr2);
    if (conv_addr == INADDR_NONE)
        printf("Error occured \n");
    else
        printf("network order addr: %#1x \n", conv_addr);
    return 0;
}