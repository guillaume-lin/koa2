# koa2
koa template project

for start a koa project quickly

如何运行(以下假设本项目目录为d:/workspace/koa2)
1. 安装docker toolbox
2. 设置virtual box共享文件夹 d:/workspace/koa2 挂载到 /workspace 目录下
3. 运行docker build -t xqx .  构建镜像, xqx为镜像名称
4. 运行 docker run -it -v /workspace/koa2:/node-project -p 8000:8000 --name xqx1 xqx
5. 如果运行不起来，用 docker logs <容器id> 查看log
