
const { Web3 } = require('web3');
const Daoapi = require("./index");

const globalSubscriptionManager = require('./subscription-manager');

class Server {
    constructor() {
        this.daoapi = null;
        this.web3 = null;
    }

    // 启动服务
    async start() {
        try {
            const { WSS_URL, BLOCKCHAIN_NETWORK, ADMINISTRUTOR_ADDRESS } = process.env;

            if (!WSS_URL || !BLOCKCHAIN_NETWORK || !ADMINISTRUTOR_ADDRESS) {
                throw new Error("Missing required environment variables");
            }

            // 初始化 Web3 实例
            this.web3 = new Web3(WSS_URL.replace('${BLOCKCHAIN_NETWORK}', BLOCKCHAIN_NETWORK));

            // 初始化 Daoapi 实例
            this.daoapi = new Daoapi(this.web3, ADMINISTRUTOR_ADDRESS, BLOCKCHAIN_NETWORK);
        } catch (error) {
            console.error("Error starting the server:", error);
            throw error; // 重新抛出异常，以便外部处理
        }
    }

    // 重启服务
    async restart() {
        try {
            // 取消订阅 (如果存在)
            // if (this.daoapi?.unsub) {
            //     this.daoapi.unsub();
            // }
            await globalSubscriptionManager.unsubscribeAll();

            // 关闭 Web3 当前提供者 (如果存在)
            if (this.web3?.currentProvider?.close) {
                await this.web3.currentProvider.close();
            }

            // 重新启动服务
            await this.start();
        } catch (error) {
            console.error("Error restarting the server:", error);
            throw error; // 重新抛出异常，以便外部处理
        }
    }
}

module.exports = Server;