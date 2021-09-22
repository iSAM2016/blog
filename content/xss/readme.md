# 常见六大 Web 安全攻防解析

> [](https://mp.weixin.qq.com/s/JttR5idAeAWLHUVu-_7CHA)

## xss

-   即时性，不经过服务器存储，直接通过 HTTP 的 GET 和 POST 请求就能完成一次攻击，拿到用户隐私数据。
-   攻击者需要诱骗点击,必须要通过用户点击链接才能发起
-   盗取用户敏感保密信息

*   反射型 xss-form
*   反射型 xss-dom

## 点击劫持

## xss + csrf = xsrf 注入脚本
