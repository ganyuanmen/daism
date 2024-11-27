
FROM node:18-alpine
RUN npm install -g npm@9.6.7
# 安装wait-for脚本
ADD https://github.com/eficode/wait-for/raw/master/wait-for /usr/local/bin/wait-for
RUN chmod +x /usr/local/bin/wait-for
WORKDIR /app
COPY ["package.json", "package-lock.json*", "./"]
#RUN npm config set registry http://registry.npm.taobao.org/
RUN npm install -g npm@10.3.0
RUN npm install  --omit=dev
COPY . .
CMD ["wait-for", "daism-mysql:3306", "--", "node", "app.js"]
