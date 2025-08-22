import {configureStore, createSlice, PayloadAction} from '@reduxjs/toolkit';

  interface CounterState {
    user: DaismUserInfo;
    ethBalance: string;
    utoBalance: string;
    tokenList: DaismToken[];
    tokenFilter: DaismToken[];
    tipText: string;
    actor: DaismActor|null;      // 如果结构不固定
    daoActor: DaismDao[] | null;
    messageText: string; // 信息提示
    errText: string; // 错误提示
    loginsiwe: boolean;
    myFollow: DaismFollow[];
    showNotice: boolean;  //显示打赏提示

  }

const initialState: CounterState = 
{
    user:{connected:0,account:'', chainId:0,networkName:''}, //0 未登录 1 已登录
    ethBalance:'0', 
    tokenList:[], //tokens 列表
    tokenFilter:[], // tokens  过滤列表
    tipText:'', // 提交链上等待窗口信息
    actor:null, //{钱包地址，头像，昵称，描述，社交帐号}
    daoActor:null, //dao列表 
    messageText:'', // 提示窗口信息
    errText:'',
    loginsiwe:false,  //登录siwe
    myFollow:[], //我关注列表
    showNotice:false, //打赏弹窗
    utoBalance:'0'

};

const valueDataSlice = createSlice({
  name: 'valueData',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<DaismUserInfo>) => {
      state.user = action.payload;
    },
    setMyFollow: (state, action:PayloadAction<DaismFollow[]>) => {
      state.myFollow = action.payload;
    },
    setEthBalance: (state, action:PayloadAction<string>) => {
        state.ethBalance = action.payload;
      },
    setUtoBalance: (state, action:PayloadAction<string>) => {
      state.utoBalance = action.payload;
    },
    setTipText: (state, action:PayloadAction<string>) => {
        state.tipText = action.payload;
      },
    setMessageText: (state, action:PayloadAction<string>) => {
        state.messageText = action.payload;
      },
      setErrText: (state, action:PayloadAction<string>) => {
        state.errText = action.payload;
      },

    setShowNotice: (state, action:PayloadAction<boolean>) => {
      state.showNotice = action.payload;
    },

    setTokenList: (state, action:PayloadAction<DaismToken[]>) => {
      state.tokenList = action.payload;
    },
    setTokenFilter: (state, action:PayloadAction<DaismToken[]>) => {
      state.tokenFilter = action.payload;
    },
  
    setActor: (state, action:PayloadAction<DaismActor| null>) => {
      state.actor = action.payload;
    },
    setDaoActor: (state, action:PayloadAction<DaismDao[] | null>) => {
      state.daoActor = action.payload;
    },
    setLoginsiwe: (state, action:PayloadAction<boolean>) => {
      state.loginsiwe = action.payload;
    }
  }
});

export const { setEthBalance,setTipText,setMessageText,setUser,setActor,setErrText,setUtoBalance,
    setTokenList,setTokenFilter,setDaoActor,setLoginsiwe,setMyFollow,setShowNotice} 
    = valueDataSlice.actions

export const store = configureStore({
    reducer: {valueData: valueDataSlice.reducer}
  });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
