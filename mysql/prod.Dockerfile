FROM docker.io/mysql 

#指明该镜像的作者和电子邮箱
MAINTAINER gym "393909065@qq.com"
 
EXPOSE 3306

#定义会被容器自动执行的目录
ENV AUTO_RUN_DIR /docker-entrypoint-initdb.d

#定义初始化sql文件
ENV INIT_SQL admin.sql

#把要执行的sql文件放到/docker-entrypoint-initdb.d/目录下，容器会自动执行这个sql
COPY admin.sql ./$INIT_SQL $AUTO_RUN_DIR/

#给执行文件增加可执行权限
RUN chmod 777 $AUTO_RUN_DIR/$INIT_SQL

