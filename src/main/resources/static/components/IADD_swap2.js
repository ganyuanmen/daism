$('#transaction1').append('<div id="d2form"  style="display: none">' +
    '<div class="card">' +
    '  <div class="card-body">' +
    '    <div class="d-flex justify-content-between align-content-center" style="padding-bottom: 16px" >' +
    '       <div>输入：</div><div style="color: #984c0c; padding-right: 26px;" ><span id="in_blanceof2" ></span></div>' +
    '   </div>' +
    '   <div class="d-flex justify-content-between align-content-center">' +
    '       <input id="dw_inputtext2" min="0"  disabled autofocus="autofocus"  autocomplete="off" style="font-size: 26px;border: 0; outline: none; min-width: 10px; flex: 1 " placeholder="0.0" />' +
    '      <div style="word-break: keep-all; white-space: nowrap; font-size: 26px; width: 150px;"><img src="/logo.svg" style="width: 32px;height: 32px" > utoken</div>  ' +
    '   </div>' +
    '  </div>' +
    '</div>' +
    '<div style="text-align: center" ><i class="bi bi-arrow-down-short"></i></div>' +
    '<div class="card">' +
    '  <div class="card-body">' +
    '    <div class="d-flex justify-content-between align-content-center" style="padding-bottom: 16px" >' +
    '       <div>估计输出：</div><div  style="color: #984c0c; padding-right: 26px;" ><span id="out_blanceof2" ></span></div>' +
    '   </div>' +
    '   <div class="d-flex justify-content-between align-content-center">' +
    '       <input id="dw_outputtext2" type="text" style="font-size: 26px;border: 0; outline: none; min-width: 10px; " readonly placeholder="0.0" />' +
    '      <div style="word-break: keep-all; white-space: nowrap; font-size: 26px; width: 150px;"><button  id="dw_btn2" class="btn btn-lg btn-outline-secondary " style="border-radius: 26px;" > 选择通行证<i class="bi bi-chevron-double-down"></i></button></div>  ' +
    '   </div>' +
    '  </div>' +
    '</div>' +
    '<div class="d-flex justify-content-between align-content-center text-black-50" style="padding: 2px 10px" >' +
    '<div>兑换比率</div>' +
    '<div id="bili2"></div>' +
    '</div>' +
    '                    <br/>' +
    '<div style="text-align: center;color: red" id="dw_mess2" >未连接钱包！</div>' +
    '                    <div class="d-grid gap-2"  >' +
    '                        <button id="swapbtn2"  class="btn btn-primary"  >' +
    '                            兑换' +
    '                        </button>' +
    '                    </div>' +
    '                        </div>' +
    '                    </div>' +
    '                </div>');

btns.push(document.getElementById('swapbtn2'));

var currentselectDao=null;

function btn1even(dao_id)
{
    let _this=$('#dw_btn2');
    _this.empty().html(this.daoSymbol+'<i class="bi bi-chevron-double-down"></i>');
    $('<img/>').height(32).width(32).attr('src', 'data:image/svg+xml;base64,' + window.btoa(this.daoLogo)).prependTo(_this);
    currentselectDao=daoTokenWindow.getDataFromId(dao_id);
    console.log(currentselectDao);
    console.log(currentselectDao.tokenId);
    $('#dw_outputtext2').data('tokenId',currentselectDao.tokenId);
    // if(dao_id>0) {
    //
    //     utoken_obj.allowance(selectedAccount, utoken_obj.address).then(r => {
    //         $('#dw_inputtext').data('isallow', r);
    //         if (r == 0) {
    //             $('<button class="btn btn-primary" style="border-radius: 20px;" >授权</button>').on('click', function () {
    //
    //             }).appendTo(_this.parent());
    //         }
    //     })
    //
    // }
    // if(dao_id==-1) {
    //     web3.eth.getBalance(selectedAccount).then(balance => {
    //         gene_blance(balance," ETH");
    //     })
    // } else if(dao_id==-2)
    // {
    //     utoken_obj.balanceOf(selectedAccount).then(balance=>{
    //         gene_blance(balance," UTOKEN");
    //     });
    // } else {
    //     ERC20s_obj.balanceOf(this.tokenId,selectedAccount).then(balance=>{
    //         gene_blance(balance," "+this.daoSymbol);
    //     });
    //     //    ERC20s_obj.
    // }
}
$('#dw_btn2').on('click',function (){
    if (DaoSelect.is_connect) {
        let _this = $(this);
        if (daoTokenWindow === undefined) {
            daoTokenWindow = new daoSelectWindow({tokenId: 1, seacherText: ''});
        } else {
            daoTokenWindow.model.show();
        }
        daoTokenWindow.setFn(btn1even);
    }else {
        makeBack('没有连接钱包，无法操作！', true, true);
    }
})

$('#swapbtn2').on('click',function (){
    makeBack('<div style="text-align: center" ><img src="/lodding.gif" />正在使用钱包提交请求......</div>',false,false);
    let _a=document.getElementById('dw_inputtext2').value;
    IADD_obj.NDAOToToken(_a,_a,"1").then(re=>{

        utoken_obj.balanceOf(selectedAccount).then(balance=>{
            const ethBalance = web3.utils.fromWei(balance, "ether");
            IADDObject.blanceOfUtoken = parseFloat(ethBalance).toFixed(4);
            $('#out_blanceof2').html("余额："+  IADDObject.blanceOfUtoken);
            $('#in_blanceof2').html("余额：" + IADDObject.blanceOfUtoken );
            $('#out_blanceof3').html("余额：" + IADDObject.blanceOfUtoken );

        });
        ERC20s_obj.balanceOf("1",selectedAccount).then(re=>{
            console.log(re);
        })
        w_toast.hide();
        document.getElementById('dw_inputtext2').value='';
        document.getElementById('dw_outputtext2').value=''
        document.getElementById('swapbtn2').disabled=true;
    })
})

document.getElementById("dw_inputtext2").addEventListener("input",function(event){
    event.target.value = event.target.value.replace(/[^\d^\.]/,"");

    let _b=parseFloat(event.target.value);



   // document.getElementById('dw_outputtext1').value=(IADDObject.ethToUtokenBili*_b).toFixed(4);
    if($('#dw_outputtext2').data('tokenId') && _b>0)
    {

        let _id=$('#dw_outputtext2').data('tokenId');
        console.log("_id:"+_id)
        let _v=IADD.toWei(_b);
        console.log("_v:"+_v)
        let _upv=Math.round(_v*(1-5/100000)).toString();
        console.log("_upv:"+_upv)
        IADD_obj.getPowerPoolPriceNDAOToToken(_upv,_id).then(e=>{
            let _min=Math.round(e*(1-195/100000));
            let _realv=IADD.fromWei(_min);
            console.log(_realv);
            $('#bili2').html('1 utoken = '+_realv+' '+currentselectDao['daoSymbol'])
        })


    } else
    {
        $('#dw_outputtext2').val('');
    }

    if(!_b)
    {
        document.getElementById('swapbtn2').disabled=true;
        document.getElementById('dw_inputtext2').classList.add('redText');
        document.getElementById("dw_mess2").innerHTML="兑换数不能为0！";
        return;
    }
    if(_b>IADDObject.blanceOfUtoken)
    {
        document.getElementById('swapbtn2').disabled=true;
        document.getElementById('dw_inputtext2').classList.add('redText');
        document.getElementById("dw_mess2").innerHTML="余额不足！";
    }
    else
    {
        document.getElementById('swapbtn2').disabled=false;
        document.getElementById('dw_inputtext2').classList.remove('redText');
        document.getElementById("dw_mess2").innerHTML="";
    }

});