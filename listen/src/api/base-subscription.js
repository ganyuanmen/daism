
class BaseSubscription {
  constructor() {
    this.subscriptions = new Map();
  }

  // 取消所有订阅
  unsubscribeAll() {
    let count = 0;
    for (const [key, subscription] of this.subscriptions) {
      try {
        if (subscription && typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe();
        }
        if (subscription && typeof subscription.removeAllListeners === 'function') {
          subscription.removeAllListeners();
        }
        count++;
      } catch (error) {
        console.warn(`Error unsubscribing ${key}:`, error.message);
      }
    }
    this.subscriptions.clear();
    return count;
  }

  // 取消特定订阅
  unsubscribe(key) {
    const subscription = this.subscriptions.get(key);
    if (subscription) {
      try {
        if (typeof subscription.unsubscribe === 'function') {
          subscription.unsubscribe();
        }
        if (typeof subscription.removeAllListeners === 'function') {
          subscription.removeAllListeners();
        }
      } catch (error) {
        console.warn(`Error unsubscribing ${key}:`, error.message);
      }
      this.subscriptions.delete(key);
    }
  }
a
  // 获取订阅状态
  getSubscriptionStatus() {
    const status = {};
    for (const [key, subscription] of this.subscriptions) {
      status[key] = {
        hasSubscription: !!subscription,
        hasListeners: subscription && subscription.eventNames ? subscription.eventNames().length > 0 : false
      };
    }
    return status;
  }
}

module.exports = BaseSubscription;