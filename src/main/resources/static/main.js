"use strict";

const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;
const evmChains = window.evmChains;



let web3Modal
let provider;
let selectedAccount;
let web3;

let btns=[];
const sendbtn = document.getElementById('sendbtn')
const testbtn1 = document.getElementById('testbtn1')
const testbtn2 = document.getElementById('testbtn2')
const registerbtn = document.getElementById('registerbtn')
// const getDaoInfo = document.getElementById('getDaoInfo')
//const getDaosbtn = document.getElementById('getDaosbtn')
const createosbtn = document.getElementById('createosbtn')
const uploadlogo = document.getElementById('uploadlogo')
const newMemberbtn = document.getElementById('newMemberbtn')



btns.push(sendbtn)
btns.push(testbtn1)
btns.push(testbtn2)
btns.push(registerbtn)
// btns.push(getDaoInfo)
//btns.push(getDaosbtn)
btns.push(createosbtn)
btns.push(uploadlogo)

newMemberbtn.onclick=()=>{
   var _a=$('<div></div>').addClass('input-group mb-2').appendTo('#zp');
   _a.append(
       '<span class="input-group-text gaa" >初始成员</span>' +
       '<input  type="text" required class="form-control" placeholder="0x">' +
       '<span class="input-group-text">票权</span>' +
       '<input type="number" required class="form-control" style="width:80px; max-width: 80px;" value="1">');
   $('<button class="btn btn-warning" >删除成员</button>').on('click',function (){
       $(this).parent().remove();
   }).appendTo(_a);
}

function init() {
    // if(location.protocol !== 'https:') {
    //   const alert = document.querySelector("#alert-error-https");
    //   alert.style.display = "block";
    //   document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    //   return;
    // }

    setdisable(true);

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                // Mikko's test key - don't copy as your mileage may vary
                infuraId: "9676a35d629d488fb90d7eac1348c838",
            }
        },

        fortmatic: {
            package: Fortmatic,
            options: {
                // Mikko's TESTNET api key
                key: "pk_test_391E26A3B43A3350"
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
    });

}

function getDaos(id)
{
    let seletDao=id==1?$('#logoDaoList'):$('#logoDaoList1');
    var myContract = new web3.eth.Contract(abigetinfo,addressInfo , {from: selectedAccount});
   // console.log(myContract);
    myContract.methods.getInfos(selectedAccount).call({from: selectedAccount}, function(error, result) {
        console.log(error);
        console.log(result);
        if (result && result.length) {
            console.log(result)
            seletDao.empty();
            if(id==1) {
                $('#currentDaoLogo').html(result[0]['daoInfo'][2])
            }
            result.forEach(function (v) {
                if(id==1)
                     $(`<option value=${v['id']}>${v['daoInfo'][0]}</option>`).data('logo', v['daoInfo'][2]).appendTo(seletDao);
                else {
                    if (v['daoInfo']['os'] == '0x0000000000000000000000000000000000000000')
                        $(`<option value=${v['daoInfo'][0]}>${v['daoInfo'][0]}</option>`).appendTo(seletDao);
                }
            })
        }
    });
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

    // Get a Web3 instance for the wallet
    web3 = new Web3(provider);

    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();
    // Load chain information over an HTTP API
    const chainData = evmChains.getChain(chainId);
    document.querySelector("#network-name").textContent = chainData.name;

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();

    // MetaMask does not give you all accounts, only the selected account
   // console.log("Got accounts", accounts);
    selectedAccount = accounts[0];
    document.querySelector("#selected-account").textContent = selectedAccount;
    const balance = await web3.eth.getBalance(selectedAccount);
    const ethBalance = web3.utils.fromWei(balance, "ether");
    const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    document.querySelector("#eth-balance").textContent = humanFriendlyBalance+' ETH';

   // $("#qpo").attr("data-bs-content",document.getElementById('www').innerText)
   // console.log($('#qpo').attr("data-bs-content"))
    new bootstrap.Popover('#qpo',{content:document.getElementById('www').innerHTML,html:true})

   // data-bs-content="Disabled popover"

    // Get a handl
   // const template = document.querySelector("#template-balance");
  //  const accountContainer = document.querySelector("#accounts");

    // Purge UI elements any previously loaded accounts
  //  accountContainer.innerHTML = '';

    // Go through all accounts and get their ETH balance
    // const rowResolvers = accounts.map(async (address) => {
    //     const balance = await web3.eth.getBalance(address);
    //     // ethBalance is a BigNumber instance
    //     // https://github.com/indutny/bn.js/
    //     const ethBalance = web3.utils.fromWei(balance, "ether");
    //     const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
    //     // Fill in the templated row and put in the document
    //     const clone = template.content.cloneNode(true);
    //     clone.querySelector(".address").textContent = address;
    //     clone.querySelector(".balance").textContent = humanFriendlyBalance;
    //     accountContainer.appendChild(clone);
   // });

    // Because rendering account does its own RPC commucation
    // with Ethereum node, we do not want to display any results
    // until data for all accounts is loaded
   // await Promise.all(rowResolvers);

    // Display fully loaded UI for wallet data
    document.querySelector("#prepare").style.display = "none";
    document.querySelector("#connected").style.display = "block";
    $('#maddress').val(selectedAccount);
    setdisable(false);
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

    // If any current data is displayed when
    // the user is switching acounts in the wallet
    // immediate hide this data
    document.querySelector("#connected").style.display = "none";
    document.querySelector("#prepare").style.display = "block";

    // Disable button while UI is loading.
    // fetchAccountData() will take a while as it communicates
    // with Ethereum node via JSON-RPC and loads chain data
    // over an API call.
    document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
    await fetchAccountData(provider);
    document.querySelector("#btn-connect").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {
    try {
        provider = await web3Modal.connect();
    } catch(e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", (accounts) => {
        fetchAccountData();
    });

    // Subscribe to chainId change
    provider.on("chainChanged", (chainId) => {
        fetchAccountData();
    });

    // Subscribe to networkId change
    provider.on("networkChanged", (networkId) => {
        fetchAccountData();
    });

    await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

    // TODO: Which providers have close method?
    if(provider.close) {
        await provider.close();

        // If the cached provider is not cleared,
        // WalletConnect will default to the existing session
        // and does not allow to re-scan the QR code with a new wallet.
        // Depending on your use case you may want or want not his behavir.
        await web3Modal.clearCachedProvider();
        provider = null;
    }

    selectedAccount = null;

    // Set the UI back to the initial state
    document.querySelector("#prepare").style.display = "block";
    document.querySelector("#connected").style.display = "none";
    setdisable(true);
}


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
    init();
    document.querySelector("#btn-connect").addEventListener("click", onConnect);
    document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
});


function  setdisable(lok) {
    btns.forEach(function (v){
        v.disabled=lok;
    })
 //   sendbtn.disabled = lok
}


sendbtn.onclick = () => {
    let value=web3.utils.toWei($('#w1').val(), 'ether');
    // web3.utils.toWei('1', 'ether')
    var message = {from: selectedAccount, to:$('#w2').val(), value:value};
    web3.eth.sendTransaction(message, (err, res) => {
        var output = "";
        if (!err) {
            output += res;
            this.txHash=res
        } else {
            output = "Error"+err;
        }
        console.log('转账:',output)
    })
}


testbtn2.onclick = () => {

    var myContract = new web3.eth.Contract(abitest,addrsstest , {
        from: selectedAccount, // default from address
       // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });
    myContract.methods.retrieve().call({from: selectedAccount}, function(error, result){
     console.log(result)
        $('#t2').val(result);
    });
}

testbtn1.onclick = () => {

    var myContract = new web3.eth.Contract(abitest,addrsstest , {
        from: selectedAccount, // default from address
        // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });

    myContract.methods.store(parseInt($('#t1').val())).send({from: selectedAccount}, function(error, result){
        console.log(result)
    });
}


registerbtn.onclick = () => {

    var myContract = new web3.eth.Contract(abiRegister,addressRegister , {
        from: selectedAccount, // default from address
        // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    });

    myContract.methods.crate().send({from: selectedAccount}, function(error, result){
        console.log(result)
    });
}



// // Example starter JavaScript for disabling form submissions if there are invalid fields
    // (function () {
    //     'use strict'
    //
    //     // Fetch all the forms we want to apply custom Bootstrap validation styles to
    //     var forms = document.querySelectorAll('.needs-validation')
    //
    //     // Loop over them and prevent submission
    //     Array.prototype.slice.call(forms)
    //         .forEach(function (form) {
    //             form.addEventListener('submit', function (event) {
    //                 if (!form.checkValidity()) {
    //                     event.preventDefault()
    //                     event.stopPropagation()
    //                 }
    //
    //                 form.classList.add('was-validated')
    //             }, false)
    //         })
    // })()

//
// registerbtn.onclick = (event) => {
//
//
// }

// $('#logoDaoList').on('change',function (){
//     $('#currentDaoLogo').html($(this).data['logo']);
// })
//
// getDaosbtn.onclick = () => {
//     getDaosbtn.disabled=true;
//      getDaosbtn.innerHTML="正在下载DAO......";
//     var myContract = new web3.eth.Contract(abigetinfo,addressInfo , {
//         from: selectedAccount, // default from address
//         // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
//     });

//     console.log(myContract);
//     myContract.methods.getInfos(selectedAccount).call({from: selectedAccount}, function(error, result){
//         console.log(error);
//         console.log(result);

//         if(result && result.length)
//         {
//             $('#logoDaoList').empty();
//             $('#currentDaoLogo').attr('d',result[0]['daoInfo'][2]);
//             result.forEach(function (v){
//                 $(`<option value=${v['id']}>${v['daoInfo'][0]}</option>`).data('logo',v['daoInfo'][2]).appendTo('#logoDaoList')
//             })
//         }
//         getDaosbtn.disabled=false;
//         getDaosbtn.innerHTML="获取已注册的DAO";
//     });
// }
//
// getDaosbtn.onclick = () => {
//     getDaosbtn.disabled=true;
//     getDaosbtn.innerHTML="正在下载DAO......";
//
//     var myContract = new web3.eth.Contract(abiRegister,addressRegister , {
//         from: selectedAccount, // default from address
//         // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
//     });

//     console.log(myContract);
//     myContract.methods.getDaos(selectedAccount).call({from: selectedAccount}, function(error, result){
//         console.log(error);
//         console.log(result);
//         if(result._names && result._names.length)
//         {
//
//         }
//         getDaosbtn.disabled=false;
//         getDaosbtn.innerHTML="获取已注册的DAO";
//     });
// }


createosbtn.onclick = () => {
    // var myContract = new web3.eth.Contract(abitoken,addresstoken,{from: selectedAccount});
    // console.log(myContract);
    // myContract.methods.swap().send({from: selectedAccount,value: web3.utils.toWei('0.01','ether')}, function(error, result){
    //     ;
    // console.log(error);
    // console.log(result);
    // });
var myContract = new web3.eth.Contract(abitoken,addresstoken,{from: selectedAccount});
    console.log(myContract);
    myContract.methods.balanceOf(selectedAccount).call({from: selectedAccount}, function(error, result){

    console.log(error);
    console.log(result);
    });

    // var myContract = new web3.eth.Contract(abicheckvote,addressCheckvote , {
    //     from: selectedAccount, // default from address
    //     // gasPrice: '20000000000' // default gas price in wei, 20 gwei in this case
    // });
    // //
    // console.log(myContract);
    // myContract.methods.getTo().call({from: selectedAccount}, function(error, result){
    //     console.log(error);
    //     console.log(result);
    //     //参数编码
    //     let _voteData = web3.eth.abi.encodeParameters(['uint32', 'uint32', 'uint32', 'uint32'], ['1', '1', '2', '3']);
    //     console.log(_voteData);
    //     //
    //     //函数编码
    //     let _functionCode = web3.eth.abi.encodeFunctionCall({
    //         name: 'init',
    //         type: 'function',
    //         inputs: [{
    //             type: 'bytes',
    //             name: 'voteData'
    //         },{
    //             type: 'uint32',
    //             name: '_daoNumber'
    //         },{
    //             type: 'string',
    //             name: '_to'
    //         }]
    //     }, [_voteData, '3',result?result:addressCheckvote]);
    //
    //     console.log(_functionCode)

   // });


}



const abitest=[
    {
        "inputs": [],
        "name": "retrieve",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "num",
                "type": "uint256"
            }
        ],
        "name": "store",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]
const addrsstest="0xAC94c6dA2Dd089a6B392F31e89dEe9560C3F7AB4";
const addressRegister="0x84bB9f75af35e310C6F606e9a5e83f5fa4cc514D"
const addressInfo="0x4aEa2Ad5aD787353d2D16dfB684D836961D07EA5"
const addressCheckvote="0xE05e6f08eb48830c245313e8bD6Cca22Bf14803C"
const addresslogo="0x1F828710c40466271f31Ce1aF5526b09499c180C"
const addresstoken='0x49b0fF1CE7a7Baf8E0CcDE95CAcD70fbc49f94fd';
const abiRegister=
    [
    {
    "inputs": [{
        "internalType": "address",
        "name": "_manager",
        "type": "address"
    },
        {
            "internalType": "address",
            "name": "_global",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "_owner",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "_iOsA",
            "type": "address"
        },
        {
            "internalType": "address",
            "name": "_iVoteA",
            "type": "address"
        }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
},
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "string",
            "name": "_name",
            "type": "string"
        },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_symbol",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "string",
                "name": "_logo",
                "type": "string"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "Create",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [{
            "indexed": true,
            "internalType": "string",
            "name": "_name",
            "type": "string"
        },
            {
                "indexed": true,
                "internalType": "address",
                "name": "os",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "CreateOs",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "changePay",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "_msg",
            "type": "address"
        },
            {
                "internalType": "string",
                "name": "_name",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_symbol",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_logo",
                "type": "string"
            },
            {
                "internalType": "string",
                "name": "_dsc",
                "type": "string"
            },
            {
                "internalType": "bool",
                "name": "_issue",
                "type": "bool"
            }
        ],
        "name": "create",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "string",
            "name": "_name",
            "type": "string"
        },
            {
                "internalType": "address[]",
                "name": "adds",
                "type": "address[]"
            },
            {
                "internalType": "uint256[]",
                "name": "_bili",
                "type": "uint256[]"
            },
            {
                "internalType": "bytes[]",
                "name": "_initData",
                "type": "bytes[]"
            },
            {
                "internalType": "bytes[]",
                "name": "_message",
                "type": "bytes[]"
            }
        ],
        "name": "createOs",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        },
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "name": "daosOf",
        "outputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "_manager",
            "type": "address"
        }],
        "name": "getDaos",
        "outputs": [{
            "internalType": "string[]",
            "name": "_names",
            "type": "string[]"
        },
            {
                "internalType": "uint32[]",
                "name": "_ids",
                "type": "uint32[]"
            },
            {
                "internalType": "bool[]",
                "name": "isCreate",
                "type": "bool[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint32",
            "name": "_id",
            "type": "uint32"
        }],
        "name": "getName",
        "outputs": [{
            "internalType": "string",
            "name": "_name",
            "type": "string"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint32",
            "name": "_id",
            "type": "uint32"
        }],
        "name": "getOss",
        "outputs": [{
            "components": [{
                "internalType": "string",
                "name": "name",
                "type": "string"
            },
                {
                    "internalType": "string",
                    "name": "symbol",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "logo",
                    "type": "string"
                },
                {
                    "internalType": "string",
                    "name": "dsc",
                    "type": "string"
                },
                {
                    "internalType": "address",
                    "name": "os",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "token",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "databaseChart",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "voteChart",
                    "type": "address"
                },
                {
                    "internalType": "address",
                    "name": "appInfo",
                    "type": "address"
                }
            ],
            "internalType": "struct Register.state",
            "name": "",
            "type": "tuple"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "iOsA",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "iVoteA",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "init",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "_token",
            "type": "address"
        },
            {
                "internalType": "address",
                "name": "_init",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_install",
                "type": "address"
            }
        ],
        "name": "initOneTime",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "install",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
        }],
        "name": "isIssue",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "isPay",
        "outputs": [{
            "internalType": "bool",
            "name": "",
            "type": "bool"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
        }],
        "name": "manager",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "string",
            "name": "",
            "type": "string"
        }],
        "name": "nameToId",
        "outputs": [{
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nextOs",
        "outputs": [{
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "owner",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "payModule",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "_paymodule",
            "type": "address"
        }],
        "name": "setPaymodule",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "name": "times",
        "outputs": [{
            "internalType": "uint32",
            "name": "",
            "type": "uint32"
        }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "tokenA",
        "outputs": [{
            "internalType": "address",
            "name": "",
            "type": "address"
        }],
        "stateMutability": "view",
        "type": "function"
    }
]

const abigetinfo=
    [
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_registe",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_token",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "manager",
                "type": "address"
            }
        ],
        "name": "getInfos",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "symbol",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "logo",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "dsc",
                                "type": "string"
                            },
                            {
                                "internalType": "address",
                                "name": "os",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "databaseChart",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "voteChart",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "appInfo",
                                "type": "address"
                            }
                        ],
                        "internalType": "struct state",
                        "name": "daoInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint32",
                        "name": "id",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bool",
                        "name": "isCreate",
                        "type": "bool"
                    }
                ],
                "internalType": "struct getInfo.states[]",
                "name": "",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "_id",
                "type": "uint32"
            }
        ],
        "name": "getInfostest",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "string",
                        "name": "name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "symbol",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "logo",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "dsc",
                        "type": "string"
                    },
                    {
                        "internalType": "address",
                        "name": "os",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "token",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "databaseChart",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "voteChart",
                        "type": "address"
                    },
                    {
                        "internalType": "address",
                        "name": "appInfo",
                        "type": "address"
                    }
                ],
                "internalType": "struct state",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32[]",
                "name": "_ids",
                "type": "uint32[]"
            }
        ],
        "name": "getOss",
        "outputs": [
            {
                "components": [
                    {
                        "components": [
                            {
                                "internalType": "string",
                                "name": "name",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "symbol",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "logo",
                                "type": "string"
                            },
                            {
                                "internalType": "string",
                                "name": "dsc",
                                "type": "string"
                            },
                            {
                                "internalType": "address",
                                "name": "os",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "token",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "databaseChart",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "voteChart",
                                "type": "address"
                            },
                            {
                                "internalType": "address",
                                "name": "appInfo",
                                "type": "address"
                            }
                        ],
                        "internalType": "struct state",
                        "name": "daoInfo",
                        "type": "tuple"
                    },
                    {
                        "internalType": "uint256",
                        "name": "tokenId",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint32",
                        "name": "id",
                        "type": "uint32"
                    },
                    {
                        "internalType": "bool",
                        "name": "isCreate",
                        "type": "bool"
                    }
                ],
                "internalType": "struct getInfo.states[]",
                "name": "returnData",
                "type": "tuple[]"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "register",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "token",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
const abicheckvote=[
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_global",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "daoNumber",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "_sumvotes",
                "type": "uint256"
            },
            {
                "internalType": "uint256",
                "name": "supportVotes",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "_data",
                "type": "bytes"
            },
            {
                "internalType": "bytes",
                "name": "others",
                "type": "bytes"
            },
            {
                "internalType": "bool",
                "name": "status",
                "type": "bool"
            }
        ],
        "name": "exec",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "externalDatabase",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "externalVote",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTo",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes",
                "name": "voteData",
                "type": "bytes"
            },
            {
                "internalType": "uint32",
                "name": "_daoNumber",
                "type": "uint32"
            },
            {
                "internalType": "address",
                "name": "_to",
                "type": "address"
            }
        ],
        "name": "init",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint64",
                "name": "_number",
                "type": "uint64"
            },
            {
                "internalType": "uint32",
                "name": "_version",
                "type": "uint32"
            }
        ],
        "name": "install",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "internalDatabase",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "internalVote",
        "outputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "to",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]
const abilogo=
    [
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "id",
                "type": "uint32"
            },
            {
                "internalType": "string",
                "name": "_logo",
                "type": "string"
            }
        ],
        "name": "changeLogo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "id",
                "type": "uint32"
            },
            {
                "internalType": "string",
                "name": "_logo",
                "type": "string"
            }
        ],
        "name": "setLogo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "_register",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "_global",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [],
        "name": "global",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint32",
                "name": "",
                "type": "uint32"
            }
        ],
        "name": "logos",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "register",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
]

const abitoken=[
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Approval",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "Transfer",
        "type": "event"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "name": "allowance",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "approve",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "balanceOf",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "balances",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "bili",
        "outputs": [
            {
                "internalType": "uint16",
                "name": "",
                "type": "uint16"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "subtractedValue",
                "type": "uint256"
            }
        ],
        "name": "decreaseAllowance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "addedValue",
                "type": "uint256"
            }
        ],
        "name": "increaseAllowance",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "swap",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            }
        ],
        "name": "swapTo",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "totalSupply",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "from",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "to",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transferFrom",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]