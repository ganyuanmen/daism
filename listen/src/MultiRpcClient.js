const ethers = require('ethers');
const dotenv=require('dotenv');
dotenv.config();

class MultiRpcClient {
    constructor(rpcUrls) {
        if (MultiRpcClient.instance) {
            return MultiRpcClient.instance;
        }
        
        this.providers = rpcUrls.map(url => {
                return new ethers.JsonRpcProvider(url, process.env.BLOCKCHAIN_NETWORK, {
                timeout: 15000,
                batchMaxCount: 1
            });
        });
        
        this.currentIndex = 0;
        this.maxRetries = 5;
        this.healthyProviders = new Set();
        this.initialized = false;
        
        MultiRpcClient.instance = this;
    }
    
    async initialize() {
        if (this.initialized) return;
        
        // console.log('Initializing RPC providers health check...');
        
        for (let i = 0; i < this.providers.length; i++) {
            try {
                const blockNumber = await Promise.race([
                    this.providers[i].getBlockNumber(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 10000)
                    )
                ]);
                
                this.healthyProviders.add(i);
                console.log(`✓ Provider ${i} is healthy, block: ${blockNumber}`);
            } catch (error) {
                console.warn(`✗ Provider ${i} is unhealthy:`, error.message);
                this.healthyProviders.delete(i);
            }
        }
        
        this.initialized = true;
        console.log(`Health check completed. ${this.healthyProviders.size} healthy providers found.`);
    }
    
    async getHealthyProvider() {
        if (!this.initialized) {
            await this.initialize();
        }
        
        if (this.healthyProviders.size > 0) {
            const healthyIndices = Array.from(this.healthyProviders);
            const providerIndex = healthyIndices[this.currentIndex % healthyIndices.length];
            this.currentIndex = (this.currentIndex + 1) % healthyIndices.length;
            return this.providers[providerIndex];
        }
        
        throw new Error('No healthy RPC providers available');
    }
    
    // 新增：获取交易详情的方法
    async getTransaction(transactionHash, retryCount = 0) {
        console.log(`Getting transaction: ${transactionHash}`);
        
        try {
            const provider = await this.getHealthyProvider();
            const transaction = await provider.getTransaction(transactionHash);
            
            if (!transaction) {
                throw new Error(`Transaction ${transactionHash} not found`);
            }
            
            console.log(`Successfully retrieved transaction: ${transactionHash}`);
            return transaction;
            
        } catch (error) {
            console.error(`Failed to get transaction ${transactionHash}:`, error.message);
            
            // 如果是网络错误，重新健康检查
            if (error.message.includes('network') || 
                error.message.includes('connection') ||
                error.code === 'NETWORK_ERROR') {
                
                console.log('Network error detected, performing health check...');
                await this.checkAllProviders();
            }
            
            if (retryCount < this.maxRetries) {
                const delay = Math.pow(2, retryCount) * 300;
                console.warn(`Retry ${retryCount + 1} for getTransaction in ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.getTransaction(transactionHash, retryCount + 1);
            }
            
            throw error;
        }
    }
    
    // 新增：获取交易收据的方法
    async getTransactionReceipt(transactionHash, retryCount = 0) {
        console.log(`Getting transaction receipt: ${transactionHash}`);
        
        try {
            const provider = await this.getHealthyProvider();
            const receipt = await provider.getTransactionReceipt(transactionHash);
            
            if (!receipt) {
                throw new Error(`Transaction receipt ${transactionHash} not found`);
            }
            
            console.log(`Successfully retrieved transaction receipt: ${transactionHash}`);
            return receipt;
            
        } catch (error) {
            console.error(`Failed to get transaction receipt ${transactionHash}:`, error.message);
            
            if (error.message.includes('network') || 
                error.message.includes('connection') ||
                error.code === 'NETWORK_ERROR') {
                
                console.log('Network error detected, performing health check...');
                await this.checkAllProviders();
            }
            
            if (retryCount < this.maxRetries) {
                const delay = Math.pow(2, retryCount) * 300;
                console.warn(`Retry ${retryCount + 1} for getTransactionReceipt in ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.getTransactionReceipt(transactionHash, retryCount + 1);
            }
            
            throw error;
        }
    }
    
    // 新增：批量获取交易的方法
    async getTransactions(transactionHashes, retryCount = 0) {
        console.log(`Getting ${transactionHashes.length} transactions`);
        
        const results = [];
        const failedHashes = [];
        
        for (const txHash of transactionHashes) {
            try {
                const transaction = await this.getTransaction(txHash);
                results.push({ hash: txHash, transaction, error: null });
            } catch (error) {
                results.push({ hash: txHash, transaction: null, error: error.message });
                failedHashes.push(txHash);
            }
            
            // 添加小延迟避免速率限制
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        // 如果有失败的交易且还有重试次数，重试失败的
        if (failedHashes.length > 0 && retryCount < this.maxRetries) {
            console.warn(`Retry ${retryCount + 1} for ${failedHashes.length} failed transactions`);
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const retryResults = await this.getTransactions(failedHashes, retryCount + 1);
            
            // 合并结果
            return results.map(result => {
                if (result.error) {
                    const retryResult = retryResults.find(r => r.hash === result.hash);
                    return retryResult || result;
                }
                return result;
            });
        }
        
        return results;
    }
    
    async callContract(contractAddress, abi, functionName, params, retryCount = 0) {
        try {
            const provider = await this.getHealthyProvider();
            const contract = new ethers.Contract(contractAddress, abi, provider);
            
            console.log(`Calling ${functionName} with params:`, params);
            
            const result = await contract[functionName](...params);
            
            return result;
        } catch (error) {
            console.error(`Call failed with error: ${error.message}, code: ${error.code}`);
            
            if (error.message.includes('network') || 
                error.message.includes('connection') ||
                error.code === 'NETWORK_ERROR') {
                
                console.log('Network error detected, performing health check...');
                await this.checkAllProviders();
            }
            
            if (retryCount < this.maxRetries) {
                const delay = Math.pow(2, retryCount) * 300;
                console.warn(`Retry ${retryCount + 1} for ${functionName} in ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.callContract(contractAddress, abi, functionName, params, retryCount + 1);
            }
            
            throw error;
        }
    }
    
    async checkAllProviders() {
        console.log('Performing health check...');
        const newHealthyProviders = new Set();
        
        for (let i = 0; i < this.providers.length; i++) {
            try {
                const blockNumber = await Promise.race([
                    this.providers[i].getBlockNumber(),
                    new Promise((_, reject) => 
                        setTimeout(() => reject(new Error('Timeout')), 8000)
                    )
                ]);
                
                newHealthyProviders.add(i);
                console.log(`✓ Provider ${i} is healthy, block: ${blockNumber}`);
            } catch (error) {
                console.warn(`✗ Provider ${i} health check failed:`, error.message);
            }
        }
        
        this.healthyProviders = newHealthyProviders;
        console.log(`Health check completed. ${this.healthyProviders.size} healthy providers.`);
    }
    
    getHealthyCount() {
        return this.healthyProviders.size;
    }
    
    async getProviderStatus() {
        const status = [];
        for (let i = 0; i < this.providers.length; i++) {
            const provider = this.providers[i];
            const connection = provider._getConnection ? provider._getConnection() : { url: 'unknown' };
            status.push({
                index: i,
                healthy: this.healthyProviders.has(i),
                url: connection.url || 'unknown'
            });
        }
        return status;
    }
    
    // 新增：获取区块信息的方法
    async getBlock(blockNumberOrHash, retryCount = 0) {
        console.log(`Getting block: ${blockNumberOrHash}`);
        
        try {
            const provider = await this.getHealthyProvider();
            const block = await provider.getBlock(blockNumberOrHash);
            
            if (!block) {
                throw new Error(`Block ${blockNumberOrHash} not found`);
            }
            
            console.log(`Successfully retrieved block: ${blockNumberOrHash}`);
            return block;
            
        } catch (error) {
            console.error(`Failed to get block ${blockNumberOrHash}:`, error.message);
            
            if (error.message.includes('network') || 
                error.message.includes('connection') ||
                error.code === 'NETWORK_ERROR') {
                
                console.log('Network error detected, performing health check...');
                await this.checkAllProviders();
            }
            
            if (retryCount < this.maxRetries) {
                const delay = Math.pow(2, retryCount) * 300;
                console.warn(`Retry ${retryCount + 1} for getBlock in ${delay}ms`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.getBlock(blockNumberOrHash, retryCount + 1);
            }
            
            throw error;
        }
    }
}

MultiRpcClient.instance = null;
module.exports = MultiRpcClient;

