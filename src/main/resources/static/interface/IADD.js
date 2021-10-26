class IADD
{
    static toWei(num)
     {
         return num*Math.pow(10,18);
     }

     static  fromWei(num)
     {
         return  (num/Math.pow(10,18)).toFixed(4);
     }
    async getPowerPoolPriceNDAOToToken(_utoken,_id) {
        if(!this.contract)  this.contract=new web3.eth.Contract(this.abi,this.address , {from: selectedAccount});
        let result= await this.contract.methods.getPowerPoolPriceNDAOToToken(_utoken,_id).call({from: selectedAccount});
        return result;
    }
    async getPowerPoolPriceTokenToNDAO(_token,_id) {
        if(!this.contract)  this.contract=new web3.eth.Contract(this.abi,this.address , {from: selectedAccount});
        let result= await this.contract.methods.getPowerPoolPriceTokenToNDAO(_token,_id).call({from: selectedAccount});
        return result;
    }


    async TokenToNDAOOutputPrice(_token,_id) {
        if(!this.contract)  this.contract=new web3.eth.Contract(this.abi,this.address , {from: selectedAccount});
        let result= await this.contract.methods.TokenToNDAOOutputPrice(_token,_id).call({from: selectedAccount});
        return result;
    }

    async NDAOToTokenOutputPrice(_token,_id) {
        if(!this.contract)  this.contract=new web3.eth.Contract(this.abi,this.address , {from: selectedAccount});
        let result= await this.contract.methods.NDAOToTokenOutputPrice(_token,_id).call({from: selectedAccount});
        return result;
    }

    async NDAOToToken(_mintoken,_token,_id) {
        console.log("IADD adress:"+this.address);
        console.log("function:NDAOToToken");
        console.log("paras:{minamount:"+_mintoken+",ndaoAmount:"+_token+",id:"+_id+"}");
        if(!this.contract)  this.contract=new web3.eth.Contract(this.abi,this.address , {from: selectedAccount});
        let result= await this.contract.methods.NDAOToToken(_mintoken,_token,_id).send({from: selectedAccount});
        return result;
    }

    async TokenToNDAO(_mintoken,_token,_id) {
        if(!this.contract)  this.contract=new web3.eth.Contract(this.abi,this.address , {from: selectedAccount});
        let result= await this.contract.methods.TokenToNDAO(_mintoken,_token,_id).send({from: selectedAccount});
        return result;
    }
    async TokenToToken(_mintoken1,_mintoken2,_token,_id1,_id2) {
        if(!this.contract)  this.contract=new web3.eth.Contract(this.abi,this.address , {from: selectedAccount});
        let result= await this.contract.methods.TokenToToken(_mintoken1,_mintoken2,_token,_id1,_id2).send({from: selectedAccount});
        return result;
    }


    // setLogo(id,logo,callback) {

    //     if(!this.contract)  this.contract=new web3.eth.Contract(this.abi,this.address , {from: selectedAccount});
    //     this.contract.methods.setLogo(id,logo).send({from: selectedAccount},function (err,re){callback.call(this,err,re);});
    //
    // }
    // changeLogo(id,logo,callback) {
    //     if(!this.contract)  this.contract.contract=new web3.eth.Contract(this.abi,this.address , {from: selectedAccount});
    //     this.methods.changeLogo(id,logo).send({from: selectedAccount},function (err,re){callback.call(this,err,re);});
    //
    // }
    constructor() {
        this.contract=undefined;
        this.address='0x409681B8B3d812e037e5ee00d705721a5DA3b48b';
        this.abi=
            [
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "_total_supply",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "_initUToken",
                            "type": "uint256"
                        },
                        {
                            "internalType": "address",
                            "name": "_uTokenAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_register",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_tokenAddress",
                            "type": "address"
                        },
                        {
                            "internalType": "address",
                            "name": "_feeTaker",
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
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "ethAmount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "swapTokenAmount",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "EETHToToken",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "tokenAmount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "swapTokenAmount",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "swapid",
                            "type": "uint256"
                        }
                    ],
                    "name": "ETokenToToken",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "tokenAmount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "uAmount",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "TokenToU",
                    "type": "event"
                },
                {
                    "anonymous": false,
                    "inputs": [
                        {
                            "indexed": true,
                            "internalType": "address",
                            "name": "spender",
                            "type": "address"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "uAmount",
                            "type": "uint256"
                        },
                        {
                            "indexed": false,
                            "internalType": "uint256",
                            "name": "tokenAmount",
                            "type": "uint256"
                        },
                        {
                            "indexed": true,
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "UToToken",
                    "type": "event"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "maxAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "NDAOToExactToken",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "minamount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "ndaoAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "NDAOToToken",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "token_out_amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "NDAOToTokenOutputPrice",
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
                            "name": "maxAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "ndaoAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "TokenToExactNDAO",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "maxAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id1",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id2",
                            "type": "uint256"
                        }
                    ],
                    "name": "TokenToExactToken",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "minamount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "tokenAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "TokenToNDAO",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "ndao_out_amount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "TokenToNDAOOutputPrice",
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
                            "name": "minamount1",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "minamount2",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "TokenAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id1",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id2",
                            "type": "uint256"
                        }
                    ],
                    "name": "TokenToToken",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [],
                    "name": "getFee",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "getPool",
                    "outputs": [
                        {
                            "components": [
                                {
                                    "internalType": "uint256",
                                    "name": "supply",
                                    "type": "uint256"
                                },
                                {
                                    "internalType": "uint256",
                                    "name": "uToken",
                                    "type": "uint256"
                                }
                            ],
                            "internalType": "struct IADD.Pool",
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
                            "internalType": "uint256",
                            "name": "ndaoAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "getPowerPoolPriceNDAOToToken",
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
                            "name": "tokenAmount",
                            "type": "uint256"
                        },
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "getPowerPoolPriceTokenToNDAO",
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
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "getTokenFee",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "id",
                            "type": "uint256"
                        }
                    ],
                    "name": "registerPool",
                    "outputs": [],
                    "stateMutability": "nonpayable",
                    "type": "function"
                },
                {
                    "inputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "name": "tokenFee",
                    "outputs": [
                        {
                            "internalType": "uint256",
                            "name": "",
                            "type": "uint256"
                        }
                    ],
                    "stateMutability": "view",
                    "type": "function"
                }
            ]

    }
}
const IADD_obj=new IADD();
