import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user:{connected:0,account:'', chainId:0,networkName:''}, //0 未登录 1 已登录
    ethBalance:null, 
    tokenList:[], //tokens 列表
    tokenFilter:[], // tokens  过滤列表
    daoList:[], //已注册的dao列表
    daoFilter:[], //已注册的dao过滤列表
    tipText:'', // 提交链上等待窗口信息
    actor:{}, //{钱包地址，头像，昵称，描述，社交帐号} {manager,avatar,actor_name,actor_desc,actor_account,actor_url,domain,id}
    daoActor:[], //dao列表 //[{dao_id,dao_name,dao_symbol,dao_manager,dao_logo,dao_desc,actor_account,domain,actor_url}] accout=> XXX@domain
    messageText:'', // 提示窗口信息
    loginsiwe:false,  //登录siwe
    myFollow:[], //我关注列表
}
  
export const valueDataSlice = createSlice({
  name: 'valueData',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setMyFollow: (state, action) => {
      state.myFollow = action.payload;
    },
    setEthBalance: (state, action) => {
        state.ethBalance = action.payload;
      },
    setTipText: (state, action) => {
        state.tipText = action.payload;
      },
    setMessageText: (state, action) => {
        state.messageText = action.payload;
      },
    setTokenList: (state, action) => {
      state.tokenList = action.payload;
    },
    setTokenFilter: (state, action) => {
      state.tokenFilter = action.payload;
    },
    setDaoList: (state, action) => {
      state.daoList = action.payload;
    },
    setDaoFilter: (state, action) => {
      state.daoFilter = action.payload;
    },
    setActor: (state, action) => {
      state.actor = action.payload;
    },
    setDaoActor: (state, action) => {
      state.daoActor = action.payload;
    },
    setLoginsiwe: (state, action) => {
      state.loginsiwe = action.payload;
    }

  }
})

export const { setEthBalance,setTipText,setMessageText,setUser,setActor,setTokenList,setTokenFilter,setDaoList,
  setDaoFilter,setDaoActor,setLoginsiwe,setMyFollow} = valueDataSlice.actions
export default valueDataSlice.reducer
