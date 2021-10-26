$('#transaction0').append('  <div style="display: flex; padding-right: 10px; padding-left: 10px; padding-top: 10px;  align-items: center;justify-content: space-between; font-size: 12px; " >' +
    '                    <div style="display: flex; justify-content: center; align-items: center; padding-left: 30px;" >' +
    '                        <i class="bi bi-search"  style="margin-right: -24px; z-index: 999" ></i>' +
    '                        <input type="text" id=\'searchbox\' class="form-control form-control-sm" placeholder="搜索项目、地址" style="border-radius: 20px; width:160px;padding-left: 30px; " >' +
    // '                        <button id="refrebtn" class="btn   btn-sm " style="border: 1px solid bisque; border-radius: 12px;"  >刷新</button>' +
    '                    </div>' +
    '                    <div>' +
    '                        <span id=\'clickTime\' class="t" >按时间</span>' +
    '                        <span id=\'clickChart\' class="t" >按字母</span>' +
    '                    </div>' +
    '                </div>' +
    '                <div id=\'daoMain\' > </div>' +
    '                <div style="padding: 6px 10px;  display:  flex; justify-content: space-between;" >' +
    '                    <div> 总共有 &nbsp;<span id=\'daoCount\' style="color: blueviolet;font-weight: bold;" ></span> &nbsp; DAO</div>' +
    '                    <div>当前页：<span id=\'pageCur\' ></span></div>' +
    '                    <div>总页数：<span id=\'pageNum\' ></span></div>' +
    '                </div>' +
    '                <div style="display: flex; justify-content: center;  align-items: center;" >' +
    '                    <div class="btn-group" role="group" >' +
    '                        <button type="button" id=\'firstbtn\' class="btn btn-outline-primary"><i class="bi bi-chevron-bar-left"></i></button>' +
    '                        <button type="button" id=\'prevbtn\' class="btn btn-outline-primary"><i class="bi bi-chevron-left"></i></button>' +
    '                        <button type="button" id=\'nextbtn\' class="btn btn-outline-primary"><i class="bi bi-chevron-right"></i></button>' +
    '                        <button type="button" id=\'endbtn\' class="btn btn-outline-primary"><i class="bi bi-chevron-bar-right"></i></button>' +
    '                    </div>' +
    '                </div>');
var requestObj;
$(function (){
    showData({pageSize:10})
})

function showData (paras) {
    requestObj = paras
    $.ajax({
        type: 'POST',
        url: '/getData',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(paras),
        success (obj) {
          //  console.log(obj)
            $('#daoCount').html(obj.total)
            $('#pageNum').html(obj.pages)
            $('#pageCur').html(obj.current)
            $('#daoMain').empty()
            $.each(obj.records, function (_i, v) {
                const _div = $('<div></div>').addClass('card').appendTo('#daoMain')
                const _div1 = $('<div></div>').addClass('card-body').appendTo(_div)
                $('<div class="nowrap" style="padding-bottom: 10px; font-size: 11px"></div>')
                    .html(` DAF地址：${v.osAddress}`).appendTo(_div1)
                $('<h4 class="nowrap" ></h4>').html(v.daoName).appendTo(_div1)
                const _div2 = $(' <div style="display: flex;"></div>').appendTo(_div1)
                if(!v.daoLogo || v.daoLogo.length<12 ) {
                    v.daoLogo = '<svg width="60px" height="60px" viewBox="0 0 60 60" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><defs><linearGradient x1="83.9390387%" y1="42.6668547%" x2="16.4712778%" y2="98.0841187%" id="linearGradient-1"><stop stop-color="#FFFFFF" offset="5%"></stop><stop stop-color="#9B8278" offset="47%"></stop><stop stop-color="#736264" offset="62%"></stop><stop stop-color="#413A4C" offset="82%"></stop><stop stop-color="#2D2A42" offset="93%"></stop></linearGradient><linearGradient x1="88.5697538%" y1="37.4905169%" x2="21.0433763%" y2="99.9110614%" id="linearGradient-2"><stop stop-color="#F7F7F7" offset="15%"></stop><stop stop-color="#9B8278" offset="49%"></stop><stop stop-color="#8A7470" offset="56%"></stop><stop stop-color="#584C57" offset="75%"></stop><stop stop-color="#393348" offset="90%"></stop><stop stop-color="#2D2A42" offset="99%"></stop></linearGradient><linearGradient x1="95.1348183%" y1="54.2882407%" x2="1.93434936%" y2="34.4456123%" id="linearGradient-3"><stop stop-color="#F7F7F7" offset="17%"></stop><stop stop-color="#9B8278" offset="55%"></stop><stop stop-color="#554A56" offset="81%"></stop><stop stop-color="#2D2A42" offset="99%"></stop></linearGradient><linearGradient x1="85.8147714%" y1="52.0313108%" x2="-5.04103165%" y2="34.8667347%" id="linearGradient-4"><stop stop-color="#F7F7F7" offset="9%"></stop><stop stop-color="#9B8278" offset="42%"></stop><stop stop-color="#736264" offset="56%"></stop><stop stop-color="#413A4C" offset="76%"></stop><stop stop-color="#2D2A42" offset="86%"></stop></linearGradient><linearGradient x1="11.6647128%" y1="46.9804696%" x2="105.568581%" y2="67.939563%" id="linearGradient-5"><stop stop-color="#F7F7F7" offset="16%"></stop><stop stop-color="#F3F2F2" offset="17%"></stop><stop stop-color="#C4B6B0" offset="31%"></stop><stop stop-color="#A69088" offset="42%"></stop><stop stop-color="#9B8278" offset="47%"></stop><stop stop-color="#63555C" offset="68%"></stop><stop stop-color="#2D2A42" offset="87%"></stop></linearGradient><linearGradient x1="57.8546307%" y1="107.980059%" x2="26.4361079%" y2="25.8183825%" id="linearGradient-6"><stop stop-color="#F7F7F7" offset="12%"></stop><stop stop-color="#9B8278" offset="51%"></stop><stop stop-color="#2D2A42" offset="99%"></stop></linearGradient><linearGradient x1="54.982415%" y1="103.717192%" x2="30.0117233%" y2="22.5704843%" id="linearGradient-7"><stop stop-color="#F7F7F7" offset="16%"></stop><stop stop-color="#9B8278" offset="51%"></stop><stop stop-color="#736264" offset="65%"></stop><stop stop-color="#413A4C" offset="86%"></stop><stop stop-color="#2D2A42" offset="96%"></stop></linearGradient><linearGradient x1="12.8370457%" y1="61.1900244%" x2="75.6154748%" y2="3.59057887%" id="linearGradient-8"><stop stop-color="#F7F7F7" offset="12%"></stop><stop stop-color="#9B8278" offset="54%"></stop><stop stop-color="#2D2A42" offset="93%"></stop></linearGradient><linearGradient x1="14.1852286%" y1="59.5153269%" x2="82.7667057%" y2="-0.773784409%" id="linearGradient-9"><stop stop-color="#F7F7F7" offset="8%"></stop><stop stop-color="#9B8278" offset="45%"></stop><stop stop-color="#61545C" offset="66%"></stop><stop stop-color="#3B3649" offset="81%"></stop><stop stop-color="#2D2A42" offset="90%"></stop></linearGradient><linearGradient x1="45.8382181%" y1="0.545674256%" x2="72.6846424%" y2="77.6832578%" id="linearGradient-10"><stop stop-color="#F7F7F7" offset="11%"></stop><stop stop-color="#9B8278" offset="43%"></stop><stop stop-color="#736264" offset="61%"></stop><stop stop-color="#413A4C" offset="85%"></stop><stop stop-color="#2D2A42" offset="97%"></stop></linearGradient><linearGradient x1="45.8382181%" y1="-5.64563179%" x2="66.2368113%" y2="83.9760606%" id="linearGradient-11"><stop stop-color="#F7F7F7" offset="21%"></stop><stop stop-color="#9B8278" offset="50%"></stop><stop stop-color="#61535B" offset="71%"></stop><stop stop-color="#3B3549" offset="87%"></stop><stop stop-color="#2D2A42" offset="95%"></stop></linearGradient><linearGradient x1="7.97186401%" y1="46.8789728%" x2="101.23095%" y2="63.981187%" id="linearGradient-12"><stop stop-color="#F7F7F7" offset="13%"></stop><stop stop-color="#9B8278" offset="47%"></stop><stop stop-color="#836F6C" offset="56%"></stop><stop stop-color="#554A55" offset="76%"></stop><stop stop-color="#383347" offset="91%"></stop><stop stop-color="#2D2A42" offset="100%"></stop></linearGradient>    </defs>    <g id="页面-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><g id="资源-2" fill-rule="nonzero"><circle id="椭圆形" fill="#141E3D" cx="30" cy="30" r="30"></circle><polygon id="路径" fill="url(#linearGradient-1)" points="30 30 21.47 15.23 12.94 30"></polygon><polygon id="路径" fill="url(#linearGradient-2)" points="55.59 44.77 47.06 30 38.53 44.77"></polygon><polygon id="路径" fill="url(#linearGradient-3)" points="30 30 38.53 15.23 21.47 15.23"></polygon><polygon id="路径" fill="url(#linearGradient-4)" points="30 59.55 38.53 44.77 21.47 44.77"></polygon><polygon id="路径" fill="url(#linearGradient-5)" points="30 0.46 21.47 15.23 38.53 15.23"></polygon><polygon id="路径" fill="url(#linearGradient-6)" points="38.53 15.23 30 30 47.06 30"></polygon><polygon id="路径" fill="url(#linearGradient-7)" points="12.94 30 4.41 44.77 21.47 44.77"></polygon><polygon id="路径" fill="url(#linearGradient-8)" points="30 30 38.53 44.77 47.06 30"></polygon><polygon id="路径" fill="url(#linearGradient-9)" points="4.41 15.23 12.94 30 21.47 15.23"></polygon><polygon id="路径" fill="url(#linearGradient-10)" points="30 30 12.94 30 21.47 44.77"></polygon><polygon id="路径" fill="url(#linearGradient-11)" points="55.59 15.23 38.53 15.23 47.06 30"></polygon><polygon id="路径" fill="url(#linearGradient-12)" points="30 30 21.47 44.77 38.53 44.77"></polygon></g>    </g></svg>';
                }
                $('<img/>').width(64).height(64).attr('src',"data:image/svg+xml;base64,"+window.btoa(unescape(encodeURIComponent(v.daoLogo)))).appendTo(_div2);

             //   $('<div></div>').html(v.daoLogo).appendTo(_div2)
                $('<p class="card-text carde" style="padding-left: 16px;text-indent:2em;" ></p>').html(v.daoDsc).appendTo(_div2)
                const _div3 = $('<div style="display: flex; align-items: center;justify-content: space-between; font-size: 10px; padding-top: 12px;"></div>').appendTo(_div1)
                $('<div></div>').html(`创建时间：${v.daoTime}`).appendTo(_div3)
                $('<div></div>').html(`币价：`).appendTo(_div3)
                $('<div></div>').html(`市值排名：`).appendTo(_div3)
            })
        },
    })
}


$('#firstbtn').on('click', () => {
    if ($('#pageCur').html() !== '1') {
        requestObj.pageNum = 1
        showData(requestObj)
    }
})

$('#endbtn').on('click', () => {
    if ($('#pageCur').html() !== $('#pageNum').html()) {
        requestObj.pageNum = $('#pageNum').html()
        showData(requestObj)
    }
})


$('#nextbtn').on('click', () => {
    const curn = parseInt($('#pageCur').html())
    if (curn < parseInt($('#pageNum').html())) {
        requestObj.pageNum = curn + 1
        showData(requestObj)
    }
})

$('#prevbtn').on('click', () => {
    const curn = parseInt($('#pageCur').html())
    if (curn > 1) {
        requestObj.pageNum = curn - 1
        showData(requestObj)
    }
})


$('#searchbox').on('keydown', function (e) {
    if(e.keyCode === 13)
    {
       // if ($('#searchbox').val().trim()) {
            const obj = { title: $('#searchbox').val().trim() }
            if ($('#clickChart').hasClass('ac')) {
                obj.order = 'dao_name'
            } else if ($('#clickTime').hasClass('ac')) {
                obj.order = 'dao_time'
            }
            showData($.extend(requestObj,obj))
       // }
    }
})
$('#clickTime').on('click', function () {
    const obj = { order: 'dao_time', title: $('#searchbox').val().trim() }
    showData($.extend(requestObj,obj))
    $('#clickChart').removeClass('ac')
    $('#clickTime').addClass('ac')

})


$('#clickChart').on('click', function () {
    const obj = { order: 'dao_name', title: $('#searchbox').val().trim() }
    showData($.extend(requestObj,obj))
    $('#clickChart').addClass('ac')
    $('#clickTime').removeClass('ac')

})

$('#refrebtn').on('click',function (){
    const obj = { order: 'dao_name', title: $('#searchbox').val().trim() }
    showData($.extend(requestObj,obj))
})
