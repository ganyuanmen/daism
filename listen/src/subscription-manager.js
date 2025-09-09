// subscription-manager.js
class SubscriptionManager {
  constructor() {
    this.subscriptionInstances = new Map();
    this.isListening = false;
  }

  registerInstance(name, instance) {
    this.subscriptionInstances.set(name, instance);
    // console.log(`注册订阅实例: ${name}`);
  }

  async unsubscribeAll() {
    // console.log('开始取消所有现有订阅...');
    let totalUnsubscribed = 0;

    for (const [name, instance] of this.subscriptionInstances) {
      if (instance && typeof instance.unsubscribeAll === 'function') {
        try {
          const count = instance.unsubscribeAll();
          totalUnsubscribed += count;
          // console.log(`已取消 ${name} 的 ${count} 个订阅`);
        } catch (error) {
          console.error(`取消 ${name} 订阅时出错:`, error.message);
        }
      }
    }

    console.log(`共取消 ${totalUnsubscribed} 个订阅`);
    this.isListening = false;
    return totalUnsubscribed;
  }

  getStatus() {
    const status = {
      totalInstances: this.subscriptionInstances.size,
      isListening: this.isListening,
      instances: {},
    };

    for (const [name, instance] of this.subscriptionInstances) {
      if (instance && typeof instance.getSubscriptionStatus === 'function') {
        status.instances[name] = instance.getSubscriptionStatus();
      } else {
        status.instances[name] = { error: 'No status method' };
      }
    }
    return status;
  }
}

// 创建全局单例
const globalSubscriptionManager = new SubscriptionManager();

// 导出单例
module.exports = globalSubscriptionManager;