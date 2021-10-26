$('#transaction1').append('<div id="d3form"  style="display: none" >' +
    '<div class="card">' +
    '  <div class="card-body">' +
    '    <div class="d-flex justify-content-between align-content-center" style="padding-bottom: 16px" >' +
    '       <div>输入：</div><div id="in_blanceof3" style="color: #984c0c; padding-right: 26px;" ></div>' +
    '   </div>' +
    '   <div class="d-flex justify-content-between align-content-center">' +
    '       <input id="dw_inputtext3" disabled type="text" autocomplete="off" style="font-size: 26px;border: 0; outline: none; min-width: 10px; flex: 1 " placeholder="0.0" />' +
    '      <div style="word-break: keep-all; white-space: nowrap; font-size: 26px;width: 130px;"></div>  ' +
    '   </div>' +
    '  </div>' +
    '</div>' +
    '<div style="text-align: center" ><i class="bi bi-arrow-down-short"></i></div>' +
    '<div class="card">' +
    '  <div class="card-body">' +
    '    <div class="d-flex justify-content-between align-content-center" style="padding-bottom: 16px" >' +
    '       <div>估计输出：</div><div id="out_blanceof3"  style="color: #984c0c; padding-right: 26px;" ></div>' +
    '   </div>' +
    '   <div class="d-flex justify-content-between align-content-center">' +
    '       <input id="dw_outputtext3" type="text" style="font-size: 26px;border: 0; outline: none; min-width: 10px; " readonly placeholder="0.0" />' +
    '      <div style="word-break: keep-all; white-space: nowrap; font-size: 26px;width: 130px;"><img src="/logo.svg" style="width：32px;height:32px;"> utoken</div>  ' +
    '   </div>' +
    '  </div>' +
    '</div>' +
    '<div class="d-flex justify-content-between align-content-center" >' +
    '<div>兑换比率</div>' +
    '<div id="bili3"></div>' +
    '</div>' +
    '                    <br/>' +
    '<div style="text-align: center;color: red" id="dw_mess3" >未连接钱包！</div>' +
    '                    <div class="d-grid gap-2"  >' +
    '                        <button id="swapbtn3"  class="btn btn-primary"  >' +
    '                            兑换' +
    '                        </button>' +
    '                    </div>' +
    '                        </div>' +
    '                    </div>' +
    '                </div>');

btns.push(document.getElementById('swapbtn3'));


$('#swapbtn3').on('click',function (){
    utoken_obj.swap($('#dw_inputtext').val(),callbackFn)
})