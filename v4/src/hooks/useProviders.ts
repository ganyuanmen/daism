"use client";
import { useSyncExternalStore, useState, useEffect } from "react";

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

// ✅ 白名单与黑名单
const ALLOWED_WALLETS = ["metamask", "okxwallet", "okx", "okx wallet","coinbase","coinbase Wallet"];
const BLOCKED_WALLETS = ["pocket universe", "backpack"];

// ✅ 检测 iOS
// const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
const isIOS =typeof navigator !== "undefined" &&
  /iPad|iPhone|iPod/.test(navigator.userAgent);

// ✅ 捕获“Cannot redefine property: ethereum”错误
if (typeof window !== "undefined") {
  window.addEventListener("error", (e) => {
    if (e.message?.includes("Cannot redefine property: ethereum")) {
      console.warn("[Wallet Injection Warning]", e.message);
      e.preventDefault(); // 阻止报错影响页面
    }
  });
}

const store: Store = {
  value: () => providers,

  subscribe(callback: () => void) {
    const onAnnouncement = (ev: Event) => {
      const event = ev as AnnouncementEvent;
      const walletName = event.detail.info.name?.toLowerCase() ?? "";
      const rdns = event.detail.info.rdns?.toLowerCase() ?? "";

      // ✅ 白名单 & 黑名单逻辑
      const isAllowed =
        ALLOWED_WALLETS.some(
          (key) => walletName.includes(key) || rdns.includes(key)
        ) &&
        !BLOCKED_WALLETS.some(
          (key) => walletName.includes(key) || rdns.includes(key)
        );

      // 🪵 动态日志输出
      console.groupCollapsed(
        `%c[Wallet Detected] ${event.detail.info.name}`,
        "color:#00b894;font-weight:bold;"
      );
      console.log("🆔 uuid:", event.detail.info.uuid);
      console.log("🏷️ name:", event.detail.info.name);
      console.log("🔗 rdns:", event.detail.info.rdns);
      console.log("✅ allowed:", isAllowed);
      console.groupEnd();

      if (
        isAllowed &&
        !providers.find((p) => p.info.uuid === event.detail.info.uuid)
      ) {
        providers = [...providers, event.detail];
        console.log("💡 Added provider:", event.detail.info.name);
        console.table(
          providers.map((p) => ({
            uuid: p.info.uuid,
            name: p.info.name,
            rdns: p.info.rdns,
          }))
        );
        callback();
      }
    };

    window.addEventListener(
      "eip6963:announceProvider",
      onAnnouncement as EventListener
    );

    // ✅ 在 iOS 上延迟触发请求
    const triggerRequest = () => {
      try {
        console.log(
          `[EIP6963] Requesting providers... (isIOS=${isIOS})`
        );
        window.dispatchEvent(new Event("eip6963:requestProvider"));
      } catch (err) {
        console.warn("[Wallet Request Error]", err);
      }
    };

    if (isIOS) {
      setTimeout(triggerRequest, 500); // 延迟 500ms
    } else {
      triggerRequest();
    }

    // ✅ 初始化完成标记
    setTimeout(() => {
      if (!initialized) {
        initialized = true;
        initCallbacks.forEach((fn) => fn());
        initCallbacks = [];
        console.log("[Wallet Store] Initialization complete.");
      }
    }, 0);

    return () => {
      window.removeEventListener(
        "eip6963:announceProvider",
        onAnnouncement as EventListener
      );
    };
  },

  isInitialized: () => initialized,

  onInit: (callback: () => void) => {
    if (initialized) callback();
    else initCallbacks.push(callback);
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
