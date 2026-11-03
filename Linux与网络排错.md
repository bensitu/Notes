# Linux 与网络排错：沿请求路径定位问题

学习目标：能在服务器上定位进程、端口、配置和日志问题。先了解文件路径和 HTTP 请求。

**适用范围：** 服务器命令以常见 Linux 为例，标为 bash；Windows 本机对照使用 PowerShell。不同发行版的软件安装命令不混用。

[文档目录](README.md) · [贯穿项目与运行说明](examples/taskboard/README.md)

**内容导航**

- [一条请求经过哪里](#section-1)
- [最小练习：检查本机服务](#section-2)
- [常用排查命令](#section-3)
- [按症状查原因](#section-4)
- [权限、环境变量与退出](#section-5)
- [验证与开发速查](#section-6)
- [官方参考](#section-7)

<a id="section-1"></a>

## 一条请求经过哪里

浏览器 → DNS 解析 → 服务器端口 → Nginx → 后端进程 → 数据库。先判断失败发生在哪一段，再改对应配置。

文件路径区分大小写；/ 是根目录，~ 通常是当前用户主目录。相对路径从当前目录开始。不要假设 Windows 路径与大小写规则可以直接照搬。

<a id="section-2"></a>

## 最小练习：检查本机服务

先按[项目说明](examples/taskboard/README.md)启动后端，再在 Linux 上执行：

```bash
pwd
java -version
ps -ef
ss -lnt
curl -i --connect-timeout 3 --max-time 10 http://127.0.0.1:8080/actuator/health
curl -i --connect-timeout 3 --max-time 10 http://127.0.0.1:8080/api/tasks
```

健康检查预期为 HTTP 200；未登录读取任务预期为 401。这说明服务器可达，后一个请求失败的原因是认证，不是端口不通。

Windows 对照：

```powershell
Get-Location
Get-Process java -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
Test-NetConnection 127.0.0.1 -Port 8080
curl.exe -i http://127.0.0.1:8080/actuator/health
```

<a id="section-3"></a>

## 常用排查命令

以下 systemctl 和 journalctl 命令仅适用于使用 systemd、且已创建 taskboard 服务的服务器，不是本示例的安装步骤。

```bash
systemctl status taskboard --no-pager
journalctl -u taskboard -n 100 --no-pager
df -h
df -i
free -h
getent hosts example.com
```

容器运行时改用 docker compose ps、docker compose logs。容器内部的 localhost 指向当前容器，访问其他服务使用 Compose 服务名。

<a id="section-4"></a>

## 按症状查原因

| 症状 | 先检查 | 不应直接得出的结论 |
| --- | --- | --- |
| 名称无法解析 | DNS、域名拼写、本机 hosts | 后端代码出错 |
| Connection refused | 进程是否存活、监听地址与端口 | 一定是防火墙 |
| 连接超时 | 路由、防火墙、安全组、服务负载 | 一定是客户端问题 |
| HTTP 502 | Nginx 到上游的连接与上游日志 | 浏览器缓存问题 |
| HTTP 504 | 上游响应、请求链路与超时设置 | 增大超时就能解决 |
| HTTP 401 / 403 | 登录状态、权限、CSRF | 网络不通 |
| No space left | 磁盘容量及 inode | 单纯重启就能恢复 |

先在服务器访问 127.0.0.1，再从外部访问；先访问后端，再经过代理。一次只改变一项条件，保留时间、请求路径、状态码和关联日志。

<a id="section-5"></a>

## 权限、环境变量与退出

进程只应拥有需要的目录权限。chmod 777 会扩大权限，不是部署问题的默认答案。普通应用一般不需要以 root 运行。

环境变量属于进程环境：修改当前终端不会自动改变已经运行的服务。使用 systemd 时检查服务的 EnvironmentFile；使用容器时修改配置后按部署方式重新创建容器。

先请求程序正常退出，等待连接与任务结束；强制终止只是最后手段。发信号前核实 PID 与命令，不对模糊匹配结果批量结束进程。

<a id="section-6"></a>

## 验证与开发速查

修复后用原请求复测，并检查错误率、响应时间和日志。只看到启动成功不等于数据库访问、认证和写入都正常。

日志可能包含个人信息或凭证，分享前只保留排错所需部分。记录系统、运行时和启动方式，避免把开发机现象误认为所有服务器都一样。

<a id="section-7"></a>

## 官方参考

- [systemd 服务管理](https://www.freedesktop.org/software/systemd/man/latest/systemctl.html)
- [curl 手册](https://curl.se/docs/manpage.html)
