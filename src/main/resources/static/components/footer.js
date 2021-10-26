document.write('<footer class="bd-footer py-2 mt-3 bg-light">' +
    '    <div style="text-align: center" >' +
    '        DAISM.io' +
    '    </div>' +
    '</footer>' +
    '<div id="www" style="display: none" >' +
    '    <div>' +
    '        <strong>Connected blockchain:</strong> <span id="network-name"></span>' +
    '    </div>' +
    '    <div>' +
    '        <strong>Selected account:</strong> <span id="selected-account"></span>' +
    '    </div>' +
    '    <div>' +
    '        <strong>ETH balance:</strong> <span id="eth-balance"></span>' +
    '    </div>' +
    '</div>'
    // '<style>' +
    // '.modal-header{  padding-bottom: 6px;padding-top: 12px}' +
    // '.modal-header input{border: 0;outline: 0;}' +
    // '.modal-content{border-radius: 15px;}' +
    // '.modal-body{height: 400px;}' +
    // '</style>'+
    // '<div id="daowindow" class="modal fade"  data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">' +
    // '  <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">' +
    // '    <div class="modal-content">' +
    // '       <div class="modal-header d-flex justify-content-between">' +
    // '       <input type="text" placeholder="搜索项目、地址"  onkeyup="re_gene_item(this)" style="flex: 1"  > <i class="bi bi-search"></i>' +
    // '        ' +
    // '      </div>'+
    // '      <div class="modal-body">' +
    // '         <div id="modeLogoList" class="list-group ">' +
    // '        </div><br/>' +
    // '      </div>' +
    // '    </div>' +
    // '  </div>' +
    // '</div>'
);

//
//
//
// var myModal = new bootstrap.Modal(document.getElementById('daowindow'), {
//     keyboard: false
// });
//
// var last_item;
// function re_gene_item(_this)
// {
//     let _t=$(_this).val().trim();
//     console.log("current:"+_t);
//   //  if(_t!=last_item) {
//         showLogo(_t, function (e) {
//         })
//         last_item = _t;
//    // } else {
//      //   console.log("==========================="+last_item)
//    // }
// }
//
// var tokenList={};
// var tokenAllList;
//
// function gene_tokenList() {
//     tokenList={};
//     $.ajax({
//         type: 'POST',
//         url: http_url + 'getDaoList',
//         contentType: 'application/json',
//         dataType: 'json',
//         data: JSON.stringify({tokenId: 1, seacherText: ''}),
//         success(obj) {
//             console.log(obj);
//             tokenAllList=obj;
//             for(let i=0;i<10;i++) {
//                 let isok=false;
//                 obj.forEach(function (v) {
//                     let _item=v['daoSymbol'].substr(0,i+1);
//                     if(_item.length==i+1) {
//                         isok=true;
//                         if (tokenList[_item] === undefined) tokenList[_item] = [];
//                         tokenList[_item].push(v);
//                     }
//                 })
//                 if(!isok) break;
//             }
//         }
//     });
// }
//
//
//
// function showLogo(paras, fn) {
//     let listObj = $('#modeLogoList').empty();
//     let obj=tokenAllList;
//     if(paras){
//         obj=[];
//         if(tokenList[paras]!==undefined && tokenList[paras].length)
//         {
//             obj=tokenList[paras];
//         }
//     }
//     obj.forEach(function (v) {
//         let _item = $('<div class="list-group-item list-group-item-action d-flex justify-content-between align-items-start"></div>').on('click', function () {
//             fn.call(v);
//             myModal.hide();
//         }).appendTo(listObj);
//         $('<span></span>').html(v['daoSymbol']).appendTo(_item);
//         $('<img/>').height(24).width(24).attr('src', 'data:image/svg+xml;base64,' + window.btoa(v['daoLogo'])).appendTo(_item);
//     })
// }
//
//
//
//
//
//
