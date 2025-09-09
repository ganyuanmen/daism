const RPC_PROVIDERS = [
    'https://sepolia.infura.io/v3/2e68e4d6017344cd89bab57981783954',
    'https://eth-sepolia.g.alchemy.com/v2/Q5CwDjcSGYsGkbO7J4cQ1TQL7vrsjMad',
    'https://eth.llamarpc.com',
    'https://sepolia.infura.io/v3/982d49c829f4428db93d5a077085d995',
    'https://rpc.ankr.com/eth',
    'https://sepolia.infura.io/v3/9676a35d629d488fb90d7eac1348c838',
    'https://cloudflare-eth.com'
];

class FallbackWeb3 {
    constructor() {
        this.providers = RPC_PROVIDERS;
        this.currentIndex = 0;
        this.web3 = this.createWeb3Instance();
    }

    createWeb3Instance() {
        return new Web3(this.providers[this.currentIndex]);
    }

    async callWithFallback(method, params, retries = 7) {
        for (let attempt = 0; attempt < retries; attempt++) {
            try {
                const result = await method.apply(this.web3.eth, params);
                return result;
            } catch (error) {
                console.error(`Attempt ${attempt + 1} failed:`, error.message);
                
                if (attempt < retries - 1) {
                    // 切换到下一个提供商
                    this.currentIndex = (this.currentIndex + 1) % this.providers.length;
                    this.web3 = this.createWeb3Instance();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                } else {
                    throw error;
                }
            }
        }
    }

    async getBlockNumber() {
        return this.callWithFallback(this.web3.eth.getBlockNumber, []);
    }

    async callContract(contractMethod, options) {
        return this.callWithFallback(contractMethod.call, [options]);
    }
}

// 使用
// const fallbackWeb3 = new FallbackWeb3();
// const blockNumber = await fallbackWeb3.getBlockNumber();