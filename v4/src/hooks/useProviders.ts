import { useSyncExternalStore, useState, useEffect } from "react";

// export interface WalletProviderInfoType {
//   uuid: string;
//   name: string;
//   icon: string;
//   rdns: string;
// }

// export interface WalletProviderType {
//   info: WalletProviderInfoType;
//   provider: any; // 可以根据需要更具体
// }

interface Store {
  value: () => WalletProviderType[];
  subscribe: (callback: () => void) => () => void;
  isInitialized: () => boolean;
  onInit: (callback: () => void) => void;
}

let providers: WalletProviderType[] = [];
let initialized = false;
let initCallbacks: (() => void)[] = [];

type AnnouncementEvent = CustomEvent & { detail: WalletProviderType };

const store: Store = {
  value: () => providers,

  subscribe(callback: () => void) {
    const onAnnouncement = (ev: Event) => {
      const event = ev as AnnouncementEvent;
      if (!providers.find(p => p.info.uuid === event.detail.info.uuid)) {
        providers = [...providers, event.detail];
        callback();
      }
    };

    window.addEventListener("eip6963:announceProvider", onAnnouncement as EventListener);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    // 标记初始化完成（即使没有钱包）
    setTimeout(() => {
      if (!initialized) {
        initialized = true;
        initCallbacks.forEach(fn => fn());
        initCallbacks = [];
      }
    }, 0);

    return () => {
      window.removeEventListener("eip6963:announceProvider", onAnnouncement as EventListener);
    };
  },

  isInitialized: () => initialized,

  onInit: (callback: () => void) => {
    if (initialized) {
      callback();
    } else {
      initCallbacks.push(callback);
    }
  },
};

/**
 * React hook
 * 返回 [providers, loading]
 */
export const useProviders = () => {
  const providers = useSyncExternalStore(store.subscribe, store.value, store.value);
  const [loading, setLoading] = useState(!store.isInitialized());

  useEffect(() => {
    if (loading) {
      store.onInit(() => setLoading(false));
    }
  }, [loading]);

  return [providers, loading] as const;
};
