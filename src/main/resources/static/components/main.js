document.write('<div class="container-xxl my-md-4 bd-layout">' +
    '    <main class="bd-main order-1" >' +
    '        <div class="bd-content ps-lg-4">' +
    '            <br/>' +

    '            <div id="transaction0"  ></div>' +
    '            <div id="transaction1" style="display: none;" ></div>' +
    '            <div id="transaction2" style="display: none;" ></div>' +
    '        </div>' +
    '    </main>' +
    '</div>');

backrefresh.children('div').append('<div id="wtoast" class="toast frentfresh" role="alert" aria-live="assertive" aria-atomic="true">' +
    '    <div class="toast-header text-warning " >' +
    '      <strong class="me-auto">&nbsp;&nbsp;提示</strong>' +
    '      <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>' +
    '    </div>' +
    '    <div id="s_message" class="toast-body bg-light ">' +
    '    </div>' +
    '  </div>');

var w_toast= new bootstrap.Toast(document.getElementById('wtoast'), {animation:true,autohide:false});
document.getElementById('wtoast').addEventListener('show.bs.toast', function () {
    backrefresh.show();
});
document.getElementById('wtoast').addEventListener('hidden.bs.toast', function () {
    backrefresh.hide();
});


function makeBack(htmlstr,isBbutton,isStr) {
    if (isBbutton) backrefresh.find('button').show(); else backrefresh.find('button').hide();
    if (isStr) $('#s_message', backrefresh).html(' <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" class="bi bi-file-earmark-lock2" viewBox="0 0 16 16">' +
        ' <path d="M10 7v1.076c.54.166 1 .597 1 1.224v2.4c0 .816-.781 1.3-1.5 1.3h-3c-.719 0-1.5-.484-1.5-1.3V9.3c0-.627.46-1.058 1-1.224V7a2 2 0 1 1 4 0zM7 7v1h2V7a1 1 0 0 0-2 0z"/>' +
        ' <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/>' +
        '</svg>' +
        '<strong>' + htmlstr + '</strong>');
    else
        $('#s_message', backrefresh).html(htmlstr);

    let _item = backrefresh.children('div');
    w_toast.show();
}

function callbackFn(err,re){
    if(err) w_toast.hide();
    else makeBack('提交成功，等待链上确认。Hash:'+re,true,true);
}

