$('#transaction1').append('<div id="d1form" >' +
    '<div class="card">' +
    '  <div class="card-body">' +
    '    <div class="d-flex justify-content-between align-content-center" style="padding-bottom: 16px" >' +
    '       <div>输入：</div><div style="color: #984c0c; padding-right: 26px;" ><span id="in_blanceof1" ></span></div>' +
    '   </div>' +
    '   <div class="d-flex justify-content-between align-content-center">' +
    '       <input id="dw_inputtext1" min="0"  disabled autofocus="autofocus"  autocomplete="off" style="font-size: 26px;border: 0; outline: none; min-width: 10px; flex: 1 " placeholder="0.0" />' +
    '      <div style="word-break: keep-all; white-space: nowrap; font-size: 26px; width: 130px;"><img src="/eth.svg" style="width: 32px;height: 32px" > eth</div>  ' +
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
    '      <div style="word-break: keep-all; white-space: nowrap; font-size: 26px; width: 130px;"><img src="/logo.svg" style="width：32px;height:32px;"> utoken</div>  ' +
    '   </div>' +
    '  </div>' +
    '</div>' +
    '<div class="d-flex justify-content-between align-content-center text-black-50" style="padding: 2px 10px" >' +
    '<div>兑换比率</div>' +
    '<div id="bili1"></div>' +
    '</div>' +
    '                    <br/>' +
    '<div style="text-align: center;color: red" id="dw_mess1" >未连接钱包！</div>' +
    '                    <div class="d-grid gap-2"  >' +
    '                        <button id="swapbtn1"  class="btn btn-primary"  >' +
    '                            兑换' +
    '                        </button>' +
    '                    </div>' +
    '                        </div>' +
    '                    </div>' +
    '                </div>');

btns.push(document.getElementById('swapbtn1'));


$('#swapbtn1').on('click',function (){
    makeBack('<div style="text-align: center" ><img src="/lodding.gif" />正在使用钱包提交请求......</div>',false,false);
    utoken_obj.swap(document.getElementById('dw_inputtext1').value).then(re=>{
        web3.eth.getBalance(selectedAccount).then(balance=>{
            const ethBalance = web3.utils.fromWei(balance, "ether");
            IADDObject.blanceOfEth = parseFloat(ethBalance).toFixed(4);
            $('#in_blanceof1').html('余额：'+IADDObject.blanceOfEth);
        })
        utoken_obj.balanceOf(selectedAccount).then(balance=>{
            const ethBalance = web3.utils.fromWei(balance, "ether");
           IADDObject.blanceOfUtoken = parseFloat(ethBalance).toFixed(4);
            $('#out_blanceof1').html("余额："+  IADDObject.blanceOfUtoken);
            $('#in_blanceof2').html("余额：" + IADDObject.blanceOfUtoken );
            $('#out_blanceof3').html("余额：" + IADDObject.blanceOfUtoken );

        });
    w_toast.hide();
        document.getElementById('dw_inputtext1').value='';
        document.getElementById('dw_outputtext1').value=''
        document.getElementById('swapbtn1').disabled=true;
    })
})

document.getElementById("dw_inputtext1").addEventListener("input",function(event){
    event.target.value = event.target.value.replace(/[^\d^\.]/,"");

    let _b=parseFloat(event.target.value);

    document.getElementById('dw_outputtext1').value=(IADDObject.ethToUtokenBili*_b).toFixed(4);

    if(!_b)
    {
        document.getElementById('swapbtn1').disabled=true;
        document.getElementById('dw_inputtext1').classList.add('redText');
        document.getElementById("dw_mess1").innerHTML="兑换数不能为0！";
        return;
    }
    if(_b>IADDObject.blanceOfEth)
    {
        document.getElementById('swapbtn1').disabled=true;
        document.getElementById('dw_inputtext1').classList.add('redText');
        document.getElementById("dw_mess1").innerHTML="余额不足！";
    }
    else
    {
        document.getElementById('swapbtn1').disabled=false;
        document.getElementById('dw_inputtext1').classList.remove('redText');
        document.getElementById("dw_mess1").innerHTML="";
    }

});