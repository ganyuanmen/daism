interface WalletProviderInfoType {
  uuid: string;
  name: string;
  icon: string;
  rdns: string;
}

interface WalletProviderType {
  info: WalletProviderInfoType;
  provider: any; // 根据实际情况可以更具体地定义 provider 类型
}

interface Store {
  value: () => WalletProviderType[];
  subscribe: (callback: () => void) => () => void;
}

// 自定义事件类型
interface EIP6963AnnounceProviderEvent extends CustomEvent {
  detail: WalletProviderType;
}

declare global {
  interface Window {
    addEventListener(
      type: "eip6963:announceProvider",
      listener: (event: EIP6963AnnounceProviderEvent) => void,
      options?: boolean | AddEventListenerOptions
    ): void;
    removeEventListener(
      type: "eip6963:announceProvider",
      listener: (event: EIP6963AnnounceProviderEvent) => void,
      options?: boolean | EventListenerOptions
    ): void;
    dispatchEvent(event: Event): boolean;
  }
}

let providers: WalletProviderType[] = [];

export const store: Store = {
  value: (): WalletProviderType[] => providers,
  
  subscribe: (callback: () => void): (() => void) => {
    const onAnnouncement = (event: EIP6963AnnounceProviderEvent): void => {
      if (providers.map(p => p.info.uuid).includes(event.detail.info.uuid)) {
        return;
      }
      providers = [...providers, event.detail];
      callback();
    };

    window.addEventListener("eip6963:announceProvider", onAnnouncement as EventListener);
    window.dispatchEvent(new Event("eip6963:requestProvider"));

    return (): void => {
      window.removeEventListener("eip6963:announceProvider", onAnnouncement as EventListener);
    };
  }
};


// let providers = []

//   export const store = {
//     value: ()=> providers,
//     subscribe: (callback) => {
//       function onAnnouncement(event){
//         if(providers.map(p => p.info.uuid).includes(event.detail.info.uuid)) return
//         providers = [...providers, event.detail]
//         callback()
//       }
//       window.addEventListener("eip6963:announceProvider", onAnnouncement);
//       window.dispatchEvent(new Event("eip6963:requestProvider"));
  
//       return () => window.removeEventListener("eip6963:announceProvider", onAnnouncement)
//     }
//   }