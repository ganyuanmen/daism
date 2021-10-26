$('#transaction1').append('<div>' +
    '<div class="card">' +
    '  <div class="card-body">' +
    '    <div class="d-flex justify-content-between align-content-center" style="padding-bottom: 16px" >' +
    '       <div>输入：</div><div id="in_blanceof1" style="color: #984c0c" ></div>' +
    '   </div>' +
    '   <div class="d-flex justify-content-between align-content-center">' +
    '       <input id="dw_inputtext1" data-tokenId="-1", type="text" autocomplete="off" style="font-size: 26px;border: 0; outline: none; min-width: 10px; flex: 1 " placeholder="0.0" />' +
    '      <div style="word-break: keep-all; white-space: nowrap"><button  id="dw_btn1" class="btn btn-lg btn-outline-secondary " style="border-radius: 26px;" > eth<i class="bi bi-chevron-down"></i></button></div>  ' +
    '   </div>' +
    '  </div>' +
    '</div>' +
    '<div style="text-align: center" ><i class="bi bi-arrow-down-short"></i></div>' +
    '<div class="card">' +
    '  <div class="card-body">' +
    '    <div class="d-flex justify-content-between align-content-center" style="padding-bottom: 16px" >' +
    '       <div>输出：</div><div  style="color: #984c0c; padding-right: 26px;" ><span id="out_blanceof1" ></span></div>' +
    '   </div>' +
    '   <div class="d-flex justify-content-between align-content-center">' +
    '       <input id="dw_outputtext1" type="text" style="font-size: 26px;border: 0; outline: none; min-width: 10px; " readonly placeholder="0.0" />' +
    '      <div style="word-break: keep-all; white-space: nowrap"><button  id="dw_btn2" class="btn btn-lg btn-outline-secondary " style="border-radius: 26px;" > 选择通行证<i class="bi bi-chevron-down"></i></button></div>  ' +
    '   </div>' +
    '  </div>' +
    '</div>' +
    '<div class="d-flex justify-content-between align-content-center text-black-50" style="padding: 2px 10px" >' +
    '<div>兑换比率</div>' +
    '<div id="bili1"></div>' +
    '</div>' +
    '                    <br/>' +
    '<div style="text-align: center;color: red" id="dw_mess1" >未连接钱包！</div>' +
    '                    <br/>' +
    '                    <div class="d-grid gap-2"  >' +
    '                        <button id="swapbtn1" class="btn btn-primary"  >' +
    '                            兑换' +
    '                        </button>' +
    '                    </div>' +
    '                        </div>' +
    '                    </div>' +
    '                </div>');

btns.push(document.getElementById('swapbtn1'));

let _bili=0;


$('<img/>').width(24).height(24).attr('src','data:image/svg+xml;base64,' + window.btoa('<svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M19.9 30L7.5 22.7 19.9 40l12.4-17.3zm.2-30L7.7 20.4l12.4 7.3 12.4-7.2z" fill="#38393a"/></svg>'))
    .prependTo('#dw_btn1');

function btn1even(dao_id)
{
    let _this=$('#dw_btn1');
    _this.empty().html(this.daoSymbol+'<i class="bi bi-chevron-down"></i>');
    $('<img/>').height(24).width(24).attr('src', 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(this.daoLogo)))).prependTo(_this);

    currentselectDao1=daoTokenWindow1.getDataFromId(dao_id);
    $('#dw_inputtext1').data('tokenId',currentselectDao1.tokenId);
    if(currentselectDao1.tokenId== currentselectDao2.tokenId)
    {
        $('#dw_outputtext1').data('tokenId','');
        $('#dw_outputtext1').val('');
        $('#out_blanceof1').html('');
        currentselectDao2= {};
        $('#dw_btn2').html(' 选择通行证<i class="bi bi-chevron-down"></i>');
        $('#bili1').html('-');
        $('#dw_mess1').html('-');
        document.getElementById('swapbtn1').disabled = true;
        _bili=0;
    }
    document.getElementById("dw_inputtext1").disabled = false;
    document.getElementById("dw_inputtext1").value='';
    document.getElementById("dw_outputtext1").value='';
    if(dao_id==-1) {
        $('#in_blanceof1').html('余额：'+IADDObject.blanceOfEth);
        upJin=IADDObject.blanceOfEth;
    } else if(dao_id==-2)
    {
        $('#in_blanceof1').html("余额："+  IADDObject.blanceOfUtoken);
        upJin=IADDObject.blanceOfUtoken;
        utoken_obj.allowance(selectedAccount,IADD_obj.address).then(r=>{
          if(r==0){
              let _prevbtn=document.getElementById('swapbtn1').disabled;
              document.getElementById('swapbtn1').disabled = true;
              let _prev=document.getElementById("dw_mess1").innerHTML;
              document.getElementById("dw_mess1").innerHTML = "未授权！";
              $('<button class="btn btn-info" style="border-radius: 20px;" >授权</button>').on('click',function (){
                  let __this=this;
                  makeBack('<div style="text-align: center" ><img src="/lodding.gif" />正在提交授权......</div>',false,false);
                  utoken_obj.approve(IADD_obj.address, web3.utils.toWei("9999999999", 'ether')).then(e=>{

                      document.getElementById('swapbtn1').disabled = _prevbtn;
                      document.getElementById("dw_mess1").innerHTML = _prev;
                      w_toast.hide();
                      $(__this).remove();
                  })
              }).prependTo($('#dw_btn1').parent());
          }
        })
    } else {
        ERC20s_obj.balanceOf(this.tokenId, selectedAccount).then(balance => {
            $('#in_blanceof1').html("余额：" + IADD.fromWei(balance));
            upJin = IADD.fromWei(balance);

            ERC20s_obj.approveAll(selectedAccount, IADD_obj.address).then(r => {
                if (!r) {
                    let _prevbtn = document.getElementById('swapbtn1').disabled;
                    document.getElementById('swapbtn1').disabled = true;
                    let _prev = document.getElementById("dw_mess1").innerHTML;
                    document.getElementById("dw_mess1").innerHTML = "未授权！";
                    $('<button class="btn btn-info" style="border-radius: 20px;" >授权</button>').on('click', function () {
                        let __this = this;
                        makeBack('<div style="text-align: center" ><img src="/lodding.gif" />正在提交授权......</div>', false, false);
                        ERC20s_obj.approve2(IADD_obj.address, true).then(e => {

                            document.getElementById('swapbtn1').disabled = _prevbtn;
                            document.getElementById("dw_mess1").innerHTML = _prev;
                            w_toast.hide();
                            $(__this).remove();
                        })
                    }).prependTo($('#dw_btn1').parent());

                }
            })
        });
    }
    gene_bili(currentselectDao1,currentselectDao2);
}
$('#dw_btn1').on('click',function (){
    if (DaoSelect.is_connect) {
        let _this = $(this);
        if (daoTokenWindow1 === undefined) {
            daoTokenWindow1 = new daoSelectWindow({tokenId: 1, seacherText: '',isEth:true});
            daoTokenWindow1.setFn(btn1even);
        } else {
            daoTokenWindow1.model.show();
        }

    }else {
        makeBack('没有连接钱包，无法操作！', true, true);
    }
})

function btn2even(dao_id){
//
    let _this=$('#dw_btn2');
    _this.empty().html(this.daoSymbol+'<i class="bi bi-chevron-down"></i>');
    $('<img/>').height(24).width(24).attr('src', 'data:image/svg+xml;base64,' + window.btoa(unescape(encodeURIComponent(this.daoLogo)))).prependTo(_this);
    currentselectDao2=daoTokenWindow2.getDataFromId(dao_id);
    $('#dw_outputtext1').data('tokenId',currentselectDao2.tokenId);
    if(currentselectDao2.tokenId==currentselectDao1.tokenId)
    {
        $('#dw_inputtext1').data('tokenId','');
        $('#dw_inputtext1').val('');
        $('#in_blanceof1').html('');
        upJin=0;
        document.getElementById("dw_inputtext1").disabled = true;
        currentselectDao1={};
        $('#dw_btn1').html(' 选择通行证<i class="bi bi-chevron-down"></i>');
        $('#bili1').html('-');
        $('#dw_mess1').html('-')
        document.getElementById('swapbtn1').disabled = true;
        _bili=0;
    }
    document.getElementById("dw_inputtext1").value='';
    document.getElementById("dw_outputtext1").value='';
   if(dao_id==-2)
    {
        $('#out_blanceof1').html("余额："+  IADDObject.blanceOfUtoken);
    } else {
        ERC20s_obj.balanceOf(this.tokenId,selectedAccount).then(balance=>{
            $('#out_blanceof1').html("余额："+  IADD.fromWei(balance));
        });
    }
    gene_bili(currentselectDao1,currentselectDao2);
}

function gene_bili(obj1,obj2)
{

    if(obj1.daoId ==-1) {
        if (obj2.tokenId == -2) { //eth to utoken
            $('#bili1').html("1 ETH=" + IADDObject.ethToUtokenBili + "utoken");
            _bili=IADDObject.ethToUtokenBili;
            gene_mess();
        } else {  // eth to token
            let _v=IADDObject.ethToUtokenBili *(1-5/100000)
            let _upv=web3.utils.toWei(_v.toString(),'ether');
            // console.log("_upv:"+_upv)
            IADD_obj.getPowerPoolPriceNDAOToToken(_upv,obj2.tokenId).then(e=>{
                let _min=Math.round(e*(1-195/100000));
                let _realv=IADD.fromWei(_min);
                //  console.log(_realv);
                $('#bili1').html('1 eth = '+_realv+' '+obj2['daoSymbol']);
                _bili=_realv;
                gene_mess();
            })

        }
    } else  if( obj1.daoId==-2) { //utoken to token
        let _v=1-5/100000;
        let _upv=web3.utils.toWei(_v.toString(),'ether');
        // console.log("_upv:"+_upv)
        IADD_obj.getPowerPoolPriceNDAOToToken(_upv,obj2.tokenId).then(e=>{
            let _min=Math.round(e*(1-195/100000));
            let _realv=IADD.fromWei(_min);
            //console.log(_realv);
            $('#bili1').html('1 utoken = '+_realv+' '+obj2['daoSymbol'])
            _bili=_realv;
            gene_mess();
        })
    } else if(obj1.daoId) {
        if (obj2.tokenId == -2) {  //token to utoken
            let _v=1-195/100000;
            let _upv=web3.utils.toWei(_v.toString(),'ether');
            console.log("_upv:"+_upv)
            IADD_obj.getPowerPoolPriceTokenToNDAO(_upv,obj1.tokenId).then(e=>{
                let _min=Math.round(e*(1-5/100000));
                let _realv=IADD.fromWei(_min);
                console.log(_realv);
                $('#bili1').html('1 '+obj1['daoSymbol']+' = '+_realv+' utoken');
                _bili=_realv;
                gene_mess();
            })
        } else {  //token to token
            let _v=1-195/100000;
            let _upv=web3.utils.toWei(_v.toString(),'ether');
            IADD_obj.getPowerPoolPriceTokenToNDAO(_upv,obj1.tokenId).then(e=>{
                let _min=Math.round(e*(1-5/100000));
                IADD_obj.getPowerPoolPriceNDAOToToken(_min.toString(),obj2.tokenId).then(e=>{
                    let _min1=Math.round(e*(1-195/100000));
                    let _realv1=IADD.fromWei(_min1);
                    $('#bili1').html('1 '+obj1['daoSymbol']+' = '+_realv1+' '+obj2['daoSymbol']);
                    _bili=_realv1;
                    gene_mess();
                })


            })
        }
    }
}

$('#dw_btn2').on('click',function (){
    let _this = $(this);
    if (DaoSelect.is_connect) {
            if (daoTokenWindow2 === undefined) {
                daoTokenWindow2 = new daoSelectWindow({tokenId: 1, seacherText: ''});
                daoTokenWindow2.setFn(btn2even);
            } else {
                daoTokenWindow2.model.show();
            }

    }else {
        makeBack('没有连接钱包，无法操作！', true, true);
    }
})


document.getElementById("dw_inputtext1").addEventListener("input",function(event) {
    event.target.value = event.target.value.replace(/[^\d^\.]/, "");

    let _b = parseFloat(event.target.value);


    document.getElementById('dw_outputtext1').value = (IADDObject.ethToUtokenBili * _b).toFixed(4);

    if (!_b) {
        document.getElementById('swapbtn1').disabled = true;
        document.getElementById('dw_inputtext1').classList.add('redText');
        document.getElementById("dw_mess1").innerHTML = "兑换数不能为0！";
        return;
    }
    else
    if (_b >upJin) {
        document.getElementById('swapbtn1').disabled = true;
        document.getElementById('dw_inputtext1').classList.add('redText');
        document.getElementById("dw_mess1").innerHTML = "余额不足！";
    } else {
        document.getElementById('swapbtn1').disabled = false;
        document.getElementById('dw_inputtext1').classList.remove('redText');
        gene_mess();
    }


});

function gene_mess()
{
    let _b = parseFloat($('#dw_inputtext1').val());
    if(_bili>0 && _b>0) {
        document.getElementById("dw_mess1").innerHTML = "你正在出售 " + _b + " " + currentselectDao1['daoSymbol']
            + "<br/> 你将收到 " + (_b * _bili).toFixed(4) + ' ' + currentselectDao2['daoSymbol'] + " 或者交易失败。";
        $('#dw_outputtext1').val((_b * _bili).toFixed(4));

    } else {
        $('#dw_outputtext1').val('');
    }
}

    $('#swapbtn1').on('click',function (){
        if(currentselectDao1.tokenId==-1 && currentselectDao2.tokenId==-2)
        {
            eth_utoken();
        } else if(currentselectDao1.tokenId==-1 && currentselectDao2.tokenId>0)
        {
            eth_token();
        } else if(currentselectDao1.tokenId==-2 && currentselectDao2.tokenId>0)
        {
            utoken_token();
        }else if(currentselectDao1.tokenId>0 && currentselectDao2.tokenId==-2)
        {
            token_utoken();
        } else if(currentselectDao1.tokenId>0 && currentselectDao2.tokenId>0)
        {
            token_token();
        }





    });

function  eth_utoken() {
    makeBack('<div style="text-align: center" ><img src="/lodding.gif" />正在使用钱包提交请求......</div>',false,false);
    utoken_obj.swap(document.getElementById('dw_inputtext1').value).then(re => {
        closeok();
        web3.eth.getBalance(selectedAccount).then(balance => {
            const ethBalance = web3.utils.fromWei(balance, "ether");
            IADDObject.blanceOfEth = parseFloat(ethBalance).toFixed(4);
            $('#in_blanceof1').html('余额：' + IADDObject.blanceOfEth);
        })
        utoken_obj.balanceOf(selectedAccount).then(balance => {
            const ethBalance = web3.utils.fromWei(balance, "ether");
            IADDObject.blanceOfUtoken = parseFloat(ethBalance).toFixed(4);
            $('#out_blanceof1').html("余额：" + IADDObject.blanceOfUtoken);

        });
    });
}


function  eth_token() {
    makeBack('<div style="text-align: center" ><img src="/lodding.gif" />正在使用钱包提交请求......</div>',false,false);
    let _v1 = parseFloat(document.getElementById('dw_inputtext1').value)*IADDObject.ethToUtokenBili;
    let _v = _v1 * (1 - 5 / 100000);

    let _upv = web3.utils.toWei(_v.toString(), 'ether');
    IADD_obj.getPowerPoolPriceNDAOToToken(_upv, currentselectDao2.tokenId).then(e => {

        let _min =IADD.fromWei(Math.round(e * (1 - 195 / 100000)))-1;
        IADD_obj.NDAOToToken(web3.utils.toWei(_min.toString(),'ether'), web3.utils.toWei(_v1.toString(), 'ether'), currentselectDao2.tokenId)
            .then(re => {
                closeok();
                web3.eth.getBalance(selectedAccount).then(balance => {
                    const ethBalance = web3.utils.fromWei(balance, "ether");
                    IADDObject.blanceOfEth = parseFloat(ethBalance).toFixed(4);
                    $('#in_blanceof1').html('余额：' + IADDObject.blanceOfEth);
                })
                ERC20s_obj.balanceOf(currentselectDao2.tokenId, selectedAccount).then(balance => {
                    $('#out_blanceof1').html("余额：" + IADD.fromWei(balance));
                });
            })
    });
}

function  utoken_token() {

    makeBack('<div style="text-align: center" ><img src="/lodding.gif" />正在使用钱包提交请求......</div>',false,false);
    let _v1 = parseFloat(document.getElementById('dw_inputtext1').value);
    let _v = _v1 * (1 - 5 / 100000);
    console.log("把1 utoken 兑换成 token ")
    console.log("第一步：收取5/100000的ndaoAmount的uToken，剩："+_v)
    let _upv = web3.utils.toWei(_v.toString(), 'ether');
    IADD_obj.getPowerPoolPriceNDAOToToken(_upv, currentselectDao2.tokenId).then(e => {
        let _min =IADD.fromWei(e) * (1 - 195 / 100000);
        console.log("第二步：调用getPowerPoolPriceNDAOToToken来计算出剩下的uToken可以兑换多少token："+e);
        console.log("第三步：收取195/100000的token作为手续费，余下的token便为兑换到的token，即minamount："+_min);
        _min=_min-1;
        console.log("minamount 减1后："+_min);
        let _minup=web3.utils.toWei(_min.toString(),'ether');

        IADD_obj.NDAOToToken(_minup, web3.utils.toWei(_v1.toString(), 'ether'), currentselectDao2.tokenId)
            .then(re => {
                closeok();
                utoken_obj.balanceOf(selectedAccount).then(balance => {
                    const ethBalance = web3.utils.fromWei(balance, "ether");
                    IADDObject.blanceOfUtoken = parseFloat(ethBalance).toFixed(4);
                    $('#in_blanceof1').html("余额：" + IADDObject.blanceOfUtoken);
                })
                ERC20s_obj.balanceOf(currentselectDao2.tokenId, selectedAccount).then(balance => {
                    $('#out_blanceof1').html("余额：" + IADD.fromWei(balance));
                });
            })
    });
}

function  token_utoken() {
    makeBack('<div style="text-align: center" ><img src="/lodding.gif" />正在使用钱包提交请求......</div>',false,false);
    let _v1 = parseFloat(document.getElementById('dw_inputtext1').value);
    let _v = _v1 * (1 - 195/100000);
    let _upv = web3.utils.toWei(_v.toString(), 'ether');
    IADD_obj.getPowerPoolPriceTokenToNDAO(_upv, currentselectDao1.tokenId).then(e => {
        let _min = Math.round(e * (1 - 5/100000))-1;
        IADD_obj.TokenToNDAO(_min.toString(), web3.utils.toWei(_v1.toString(), 'ether'), currentselectDao1.tokenId)
            .then(re => {
                closeok();
                utoken_obj.balanceOf(selectedAccount).then(balance => {
                    const ethBalance = web3.utils.fromWei(balance, "ether");
                    IADDObject.blanceOfUtoken = parseFloat(ethBalance).toFixed(4);
                    $('#out_blanceof1').html("余额：" +  IADDObject.blanceOfUtoken);

                })
                ERC20s_obj.balanceOf(currentselectDao1.tokenId, selectedAccount).then(balance => {
                    $('#in_blanceof1').html("余额：" + IADD.fromWei(balance));
                });
            })
    });
}


function  token_token() {
    makeBack('<div style="text-align: center" ><img src="/lodding.gif" />正在使用钱包提交请求......</div>',false,false);
    let _v1 = parseFloat(document.getElementById('dw_inputtext1').value);
    let _v = _v1 * (1 - 195/100000);
    let _upv=web3.utils.toWei(_v.toString(),'ether');
    IADD_obj.getPowerPoolPriceTokenToNDAO(_upv,currentselectDao1.tokenId).then(e=>{
        let _min = IADD.fromWei(Math.round(e * (1 - 5/100000))-1);
        IADD_obj.getPowerPoolPriceNDAOToToken(web3.utils.toWei(_min.toString(), 'ether'),currentselectDao2.tokenId).then(e=>{
            let _min1=IADD.fromWei(Math.round(e*(1-195/100000)))-1;
            IADD_obj.TokenToToken(web3.utils.toWei(_min.toString(),'ether'),web3.utils.toWei(_min1.toString(),'ether')
                ,web3.utils.toWei(document.getElementById('dw_inputtext1').value,'ether')
                ,currentselectDao1.tokenId,currentselectDao2.tokenId)
                .then(re => {
                    closeok();

                    ERC20s_obj.balanceOf(currentselectDao1.tokenId, selectedAccount).then(balance => {
                        $('#in_blanceof1').html("余额：" + IADD.fromWei(balance));
                    });
                    ERC20s_obj.balanceOf(currentselectDao2.tokenId, selectedAccount).then(balance => {
                        $('#out_blanceof1').html("余额：" + IADD.fromWei(balance));
                    });
                })
        })
    })





    // let _upv = web3.utils.toWei(_v.toString(), 'ether');
    // IADD_obj.getPowerPoolPriceTokenToNDAO(_upv, currentselectDao1.tokenId).then(e => {
    //     let _min = Math.round(e * (1 - 5/100000));
    //     IADD_obj.TokenToNDAO(_min.toString(), web3.utils.toWei(_v1.toString(), 'ether'), currentselectDao1.tokenId)
    //         .then(re => {
    //             closeok();
    //             utoken_obj.balanceOf(selectedAccount).then(balance => {
    //                 const ethBalance = web3.utils.fromWei(balance, "ether");
    //                 IADDObject.blanceOfUtoken = parseFloat(ethBalance).toFixed(4);
    //                 $('#out_blanceof1').html("余额：" +  IADDObject.blanceOfUtoken);
    //
    //             })
    //             ERC20s_obj.balanceOf(currentselectDao1.tokenId, selectedAccount).then(balance => {
    //                 $('#in_blanceof1').html("余额：" + IADD.fromWei(balance));
    //             });
    //         })
    // });
}


function closeok()
{
    w_toast.hide();
    document.getElementById('dw_inputtext1').value='';
    document.getElementById('dw_outputtext1').value=''
    document.getElementById('swapbtn1').disabled=true;

}