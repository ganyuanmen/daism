let Web3Modal = window.Web3Modal.default;
let WalletConnectProvider = window.WalletConnectProvider.default;
let Fortmatic = window.Fortmatic;
let evmChains = window.evmChains;
let web3Modal
let provider;
var selectedAccount;
var web3;

var currentselectDao1= {daoId:-1};
var currentselectDao2= {};
var upJin=0;  //兑换余额
//var http_url='http://localhost:8088/';
var http_url='http://124.71.78.126:8088/';
var btns=[];
var IADDObject={ethToUtokenBili:0,blanceOfEth:0,blanceOfUtoken:0};
window.addEventListener('load', async () => {
    init();
    document.querySelector("#btn-connect").addEventListener("click", onConnect);
    document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});

function init() {
    setdisable(true);
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "9676a35d629d488fb90d7eac1348c838",
            }
        },
        fortmatic: {
            package: Fortmatic,
            options: {
                key: "pk_test_391E26A3B43A3350"
            }
        }
    };
    web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
        disableInjectedProvider: false
    });
}

async function fetchAccountData() {
    web3 = new Web3(provider);
    const chainId = await web3.eth.getChainId();
    const chainData = evmChains.getChain(chainId);
    document.querySelector("#network-name").textContent = chainData.name;
    const accounts = await web3.eth.getAccounts();
    selectedAccount = accounts[0];
    document.querySelector("#selected-account").textContent = selectedAccount;
    const balance = await web3.eth.getBalance(selectedAccount);
    const ethBalance = web3.utils.fromWei(balance, "ether");
    IADDObject.blanceOfEth = parseFloat(ethBalance).toFixed(4);

    document.querySelector("#eth-balance").textContent = IADDObject.blanceOfEth+' ETH';
    $('#in_blanceof1').html('余额：'+IADDObject.blanceOfEth);
    upJin=IADDObject.blanceOfEth;
    utoken_obj.balanceOf(selectedAccount).then(balance=>{
        const ethBalance = web3.utils.fromWei(balance, "ether");
       IADDObject.blanceOfUtoken = parseFloat(ethBalance).toFixed(4);
        // $('#out_blanceof1').html("余额："+  IADDObject.blanceOfUtoken);
        // $('#in_blanceof2').html("余额：" + IADDObject.blanceOfUtoken );
        // $('#out_blanceof3').html("余额：" + IADDObject.blanceOfUtoken );

    });
    new bootstrap.Popover('#qpo',{content:document.getElementById('www').innerHTML,html:true})
    document.querySelector("#prepare").style.display = "none";
    document.querySelector("#connected").style.display = "block";
    $('#maddress').val(selectedAccount);
    $('#zp').find('input').eq(0).val(selectedAccount);
    setdisable(false);
    listeners();

    utoken_obj.getPrice().then(r => {
        const r1 = parseFloat(r) /  Math.pow(10,8); //(100000000);
        IADDObject.ethToUtokenBili = parseFloat(r1).toFixed(0);
      //  $('#bili1').html("1 ETH=" + IADDObject.ethToUtokenBili + " UTOKEN");
    });


   // let f=web3.utils.toWei('999','ether');
    //ERC20s_obj.totalSupply('1').then(r=>{console.log(r)})
   // ERC20s_obj.approve('1','0xE78549d3445Cca336a86689F57E3188b180B2F72',callbackFn)
  //  ERC20s_obj.approve2(IADD_obj.address,false).then(e=>{
  //
  //      ERC20s_obj.approveAll(selectedAccount,IADD_obj.address).then(r=>{
  //          console.log("------------------");
  //          console.log(r)
  //      })
  //
  // })

   // utoken_obj.approve(IADD_obj.address, web3.utils.toWei("0", 'ether')).then(e=>{
   //
   //      utoken_obj.allowance(selectedAccount,IADD_obj.address).then(r=>{
   //          console.log("---------yyyyyyyyy---------");
   //          console.log(r)
   //      })
   // })

    // makeBack('<div style="text-align: center" ><img src="/lodding.gif" /></div>',false,false);
   //  ERC20s_obj.approve()
   //  .then(re => {
   //      w_toast.hide();
   //      console.log(re);
   //
   //  });
   //
   //  let f=web3.utils.toWei('1','ether');
   //  console.log(f);
   //  IADD_obj.TokenToNDAOOutputPrice(f,"1").then(re=>{
   //      console.log("TokenToNDAOOutputPrice:"+re);
   //  })
   //
   //  IADD_obj.NDAOToTokenOutputPrice(f,"1").then(re=>{
   //      console.log("NDAOToTokenOutputPrice:"+re);
   //  })
   //
   //  IADD_obj.getPowerPoolPriceNDAOToToken(f,"1").then(re=>{
   //      console.log("getPowerPoolPriceNDAOToToken:"+re);
   //  })
   //
   //  IADD_obj.getPowerPoolPriceTokenToNDAO(f,"1").then(re=>{
   //      console.log("getPowerPoolPriceTokenToNDAO:"+re);
   //  })

}

async function refreshAccountData() {
    document.querySelector("#connected").style.display = "none";
    document.querySelector("#prepare").style.display = "block";
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    await fetchAccountData(provider);
    document.querySelector("#btn-connect").removeAttribute("disabled")
}

async function onConnect() {
    try {
        provider = await web3Modal.connect();
    } catch(e) {
        console.log("Could not get a wallet connection", e);
        return;
    }
    provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
    });
    provider.on("chainChanged", (chainId) => {
        fetchAccountData();
    });
    provider.on("networkChanged", (networkId) => {
        fetchAccountData();
    });
    await refreshAccountData();
}

async function onDisconnect() {
    if(provider.close) {
        await provider.close();
        await web3Modal.clearCachedProvider();
        provider = null;
    }
    selectedAccount = null;
    document.querySelector("#prepare").style.display = "block";
    document.querySelector("#connected").style.display = "none";
    setdisable(true);
}

function setdisable(lok) {

   DaoSelect.is_connect=!lok;
   if(DaoSelect.is_connect) {
    currentselectDao1= {daoId:-1,daoSymbol:'eth',tokenId:-1};
     currentselectDao2= {};
   }
    btns.forEach(function (v){
        v.disabled=lok;
    })
   // for(let i=1;i<=1;i++) {
        document.getElementById("dw_inputtext1").disabled = lok;
        document.getElementById("dw_inputtext1").value = '';
        document.getElementById("swapbtn1").disabled = true;
        document.getElementById("dw_mess1").innerHTML = lok ? "没有连接钱包！":'';
    //}

}

function  listeners()
{

    if(register_obj.isListener) {
        register_obj.listener_events();
        logos_obj.listener_events();
        ERC20s_obj.listener_events();
        register_obj.isListener=false;
    }
}

