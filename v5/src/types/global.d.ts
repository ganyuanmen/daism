
export {};

declare global {
  interface Window {
    __MY_CACHE__?: Record<string, { value: any; expire: number }>;
  }

  interface EnkiMessType { //嗯文
    id:number;
    send_type:number; //message 类型，0 发送，1 关注接收，2 私下推送，9 转发
    receive_account:string  //接收人
    message_id:string; //message_id 唯一 
    manager:string; //发贴人钱包地址
    actor_name:string; //发贴人昵称
    avatar:string; //头像地址
    actor_account:string; //发贴人完整帐号
    actor_url:string; //发贴人帐号 url 表示
    actor_inbox:string; //发贴人收件箱
    link_url:string; //嗯文链接地址
    title:string; //嗯文瓢虫
    content:string; //嗯文内容。html,css混合
    is_send:number;//允许推送
    is_discussion:number; //允许回复
    top_img:string; //嗯文图片，贴子最下方
    createtime:Date; //创建日期
    reply_time:Date; //最后回复日期
    total:number; //回复次数
    property_index:number; //嗯文查看属性 1:public  2:follow  3@私下
    type_index:number;  //嗯文属性0:short  1:long html
    vedio_url:string; //视频url
    account_at:string; //私下推送帐号，用逗号分隔
    content_link:string; //底部链接条的html 代码
    is_top:number; //是否；置顶
    dao_id:number; //公器ID
    actor_id:number; //帐号ID
    tips:number; //打赏次数
    utoken:number; //打赏数量
    currentTime:string; //当前时间，冗余

 //----------公器特有
    start_time?:Date;// 活动开始时间
    end_time?:Date;//活动结束时间
    event_url?:string;// 活动网址
    event_address?:string; //活动线下地址
    _type?:number; //公器嗯文属性 0:普通 1:活动
    time_event?:number; //活动定时活动,星期几,-1 表示不定期
    self_account?:string; //实际发贴人帐号
    self_avatar?:string; //实际发贴人头像

    httpNetWork?:boolean; //是否跨域下载

  }
 
  interface FetchWhere {
    currentPageNum: number;
    menutype: number; //1 我的社区，2 公区社区 3 个人社区
    daoid: number|string;
    actorid: number;
    where: string;
    order: string;
    eventnum: number; //社区: 0 非活动，1活动, 个人：1:首页 2:我的嗯文 3:我的收藏 4:我的接收嗯文 ,8 过滤（where 为过滤值）
    account: string;
    v: number; //附加 v: 1 我关注的社区
  }
  

  interface ActorInfo{
    account: string;
    url:string;
    inbox: string;
    avatar: string;
    id?:number; //帐号ID
    name?: string;
    domain?: string;
    pubkey?: string;
    manager?: string;
    follow_id?:string; //关注ID
    actor_id?:number; //0 非本地帐户，大于0是本地帐户
    createtime?:string;
    desc?:string;
  }

  interface DaoMember{
    member_address:string;
    actor_url:string;
    actor_account:string;
    avatar:string
  }

  //提案
  interface Proposal {
    account: string;
    dividendRights: number; // uint16
    createTime: number; // uint32
    rights: number; // uint16
    antirights: number; // uint16
    desc: string;
    proposalType: number; // uint8
  }

  //公器信息
  interface SCInfo {
    name: string;
    symbol: string;
    desc: string;
    manager: string;
    version: number;
    SCType: string;
 
  }

  //公器图片
  interface SCFile {
    fileType: string;
    fileContent: string;
  }

  interface DaismUserInfo {
    connected: number;
    account: string;
    networkName: string;
    chainId: number;
  }

  interface DaismToken {
    dao_id:number;
    token_id:number;
    dao_name:string;
    dao_symbol:string;
    dao_logo:string;
    delegator:string;
    token_cost:number;
  }


  interface DaismActor {
    id?:number;
    dao_id?:number;
    actor_name?:string;
    domain?:string;
    manager?:string;
    actor_account?:string;
    actor_url?:string;
    avatar?:string;
    actor_desc?:string;
    pubkey?:string;
    privkey?:string;
  }

  
  interface DaismDao {
    strategy:number;
    cool_time:number;
    lifetime:number;
    dao_id:number;
    block_num:bigint;
    sctype:string;
    dao_name:string;
    dao_symbol:string;
    dao_desc:string;
    dao_time:string;
    dao_manager:string;
    dao_logo:string;
    creator:string;
    delegator:string;
    utoken_cost:number;
    dao_ranking:number;
    dao_exec:string;
    token_id:number;
    _time:string;
    actor_account:string; //表示已注册
    actor_url:string;
    domain:stringl
  }

  
  interface DaismFollow {
    actor_account:string;
  }


interface WalletProviderInfoType {
    uuid: string;
    name: string;
    icon: string;
    rdns: string;
  }

interface WalletProviderType {
    info: WalletProviderInfoType;
    provider: any; // 简化类型，实际可更具体
  }

  //打赏
  interface DaismTipType {
    id: number;
    token_to: string;  //打赏人 钱包地址
    tip_to:string; //接收打赏 钱包地址
    utoken:number; //打赏金额
    actor_account:string;// 钱包地址对应的enki帐号
    avatar:string;// 头像
    message_id:string;// 被打赏嗯文ID
    dao_id:number;//公器ID
    _time:string;
  }

   //回复
   interface DaismReplyType {
    message_id: string;
    manager: string;  
    actor_name:string; 
    avatar:string;// 头像
    actor_url:string; 
    actor_account:string;//
    content:string;//内容 html+css
    createtime:Date;//
    type_index:number; //短，长文0:short  1:long html
    vedio_url:string;
    top_img:string;//
    content_link:Date;//底部链接条html代码
    pid:string; //嗯文message_id
    bid:number; //排序用的ID
    currentTime:string;
    actor_id:string;
    httpNetWork?:boolean; //是否跨域下载
  }

  //NFT
  interface NftObjType {
    _type: number;
    tips?: string;
    tokensvg: string;
    to_address: string;
    token_id: string | number;
    block_num: string | number;
    contract_address: string;
    _time: string;
    dao_id:number;
    dao_name?: string;
    [key:string]:any;
  }
 
  interface AccountType{
    actor_name:string;
    avatar:string;
  }

}

