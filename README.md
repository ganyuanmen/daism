
#  道易程网站

道易程网站是一个专注于道易程智能合约API使用和信息发布的平台。我们的合约API涵盖了道易程各种代币和兑换的功能，以及用户的各种统计信息，为用户提供便捷的交易和转换服务。同时，我们采用了activityPub协议来支持信息发布，这使得其他联邦软件可以方便地订阅并获取道易程发布的信息。我们致力于为用户提供高效、安全和便利的智能合约服务和信息共享平台。在道易程网站上，您可以轻松地使用智能合约API进行代币交易和兑换，并获取关于您的统计信息。我们的平台使用activityPub协议，让您的信息能够被其他联邦软件方便地订阅和获取。我们致力于为用户提供高效、安全和便利的智能合约服务和信息共享平台。

## 网站的部署

采用 docker compose 部署, 
```js

docker compose up -d

```

## 配置文件

config 目录下

- web_config.json 网站配置

```js
{
  # 0 表示不使用https协议， 1 表示使用https协议
  "HTTPS": "1",  

  #域名
  "DOMAIN": "nngym.cn",

  #网站端口号， 注：该端口号要与docker-compose.yml 中的网站端口号一致。
  "PORT": "443",

  # https 证书的相关文件
  "PRIVKEY_PATH": "config/private.key",
  "CERT_PATH": "config/public.crt",
  "CA_PATH": "config/ca.crt"
}

```

> HTTPS 配置说明: 设置HTTPS为0时，表示不使用https协议。网站无法与其它联邦宇宙软件通讯，因为其它联邦宇宙软件使用的是https协议，而https协议的网站是无法访问http协议的网站。使用http协议可以使用道易程和智能合约接口，但无法使用activityPub协议。如果要完整的使用网站的功能，建议使用https证书。


- mysql_config.json 连接数据库及其它参数配置


```js
{
  # 数据库主机名
  "host":"daism-mysql",

  #帐户
  "user":"root",

  #密码 注：要与docker-compose.yml 中的MYSQL_ROOT_PASSWORD 一致。
  "password":"Dao..123",

  #数据库名称，固定值， 不要修改
  "database":"dao_db",

  #端口号
  "port":"3306",

  #智能合约新部署的网络  sepolia(测试网络) ，goerli(测试网络)，mainnet(主网)
  "network":"sepolia",

  # 0 打印调试信息 1 不打印
  "debugger_level":"1"
}


```

- redis_config.json 连接redis数据库参数配置


```js

{
  #主机
  "host":"daism-redis",

  #密码（注：要与docker-compose.yml requirepass 一致。）
  "password":"222333",

  #端口号
  "port":"6379"
}

```

## 挂载目录

- mysql容器：  存放数据的目录/var/lib/mysql， 需要挂载到宿主机上
- web 容器： 存放图片的目录/app/public/uploads， 需要挂载到宿主机上

 >  注：uploads目录下要有这4个子目录： 1.admin目录: 系统图片，2.news目录：新闻图片，3.events目录:活动图片，4.discussions目录：讨论图片。

- web 容器： 配置文件目录/app/config， 需要从宿主机上上读取
- daoserver 容器： 配置文件目录/app/config， 需要从宿主机上上读取

## mysql连接说明

nodejs 连接mysql 需要用到  --default-authentication-plugin=mysql_native_password ，低版本的docker compose 可能不支持该选项，会产生错误:  ER_NOT_SUPPORTED_AUTH_MODE: Client does not support authentication protocol requested by server; 

解决方法： 进到容器内部，登录mysql, 执行alter user....： 

```js

docker exec -it 容器名 /bin/sh

mysql -u root -p

alter user 'root'@'%' identified with mysql_native_password by '密码';

flush privileges;

```

这些步骤将帮助您完成道易程网站的部署。请根据您的环境和需求进行相应的配置和操作。如有任何问题，请随时与我们联系。