import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user:{connected:0,account:'', chainId:0,networkName:''}, //0 未登录 1 已登录
    ethBalance:null, 
    tokenList:[], //tokens 列表
    tokenFilter:[], // tokens  过滤列表
    tipText:'', // 提交链上等待窗口信息
    actor:null, //社交帐号 {member_address:did,member_icon:'',member_nick:'',member_desc:''}
    daoActor:null, //dao帐号列表
    messageText:'', // 提示窗口信息
    loginsiwe:false,  //登录siwe
    daoAddress:{}  // daism 合约地址,包括其它
}
  
export const valueDataSlice = createSlice({
  name: 'valueData',
  initialState,
  reducers: {
    setDaoAddress: (state, action) => {
      state.daoAddress = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
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

export const { setEthBalance,setTipText,setMessageText,setUser,setActor,setTokenList,setTokenFilter,setDaoActor,setLoginsiwe,setDaoAddress,setIs_ceateDao} = valueDataSlice.actions
export default valueDataSlice.reducer
