$('#transaction2').append(' <form id="h3form"  style="display: none;" class="row g-3 needs-validation" novalidate>' +
    '                    <div class="card" >' +
    '                        <div  class="card-body">' +
    '                            <h5 class="card-title">创建OS</h5>' +
    '                            <div id="osselectdao" class="input-group mb-2">' +
    '                                <span class="input-group-text gaa" >DAO</span>' +
    '                            </div>' +
    '                    <div class="input-group mb-2">' +
    '                        <span class="input-group-text gaa" >logo</span>' +
    '                        <div id="oscurrentDaoLogo" class="form-control" ></div>' +
    '                    </div>' +
    '                            <div class="input-group mb-2">' +
    '                                <span class="input-group-text gaa"  >内部投票器</span>' +
    '                                <input type="number" id="m1" required class="form-control" value="1">' +
    '                                <span class="input-group-text ">外部投票器</span>' +
    '                                <input type="number" id="m2" required class="form-control"  value="1">' +
    '                            </div>' +
    '                            <div class="input-group mb-2">' +
    '                                <span class="input-group-text gaa" >内部票权数</span>' +
    '                                <input type="number" id="m3" required class="form-control" value="1">' +
    '                                <span class="input-group-text ">外部票权数</span>' +
    '                                <input type="number" id="m4" required class="form-control" value="1">' +
    '                            </div>' +
    '                            <div id="zp">' +
    '                                <div class="input-group mb-2">' +
    '                                    <span class="input-group-text gaa" >初始成员</span>' +
    '                                    <input  type="text" required class="form-control" placeholder="0x">' +
    '                                    <span class="input-group-text">票权</span>' +
    '                                    <input type="number" required class="form-control" style="width:80px; max-width: 80px;" value="1">' +
    '                                    <button id="newMemberbtn" class="input-group-text btn btn-primary ">增加成员</button>' +
    '                                </div>' +
    '                            </div>' +
    '                    <br/>' +
    '                    <div class="d-grid gap-2"  >' +
    '                        <button id="createosbtn" class="btn btn-primary"  type="submit" >' +
    '                            创建OS' +
    '                        </button>' +
    '                    </div>' +
    '                        </div>' +
    '                    </div>' +
    '                </form>');
btns.push(document.getElementById('createosbtn'));
document.getElementById('newMemberbtn').onclick=()=>{
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

let osSelect=new DaoSelect();
osSelect.init($('#osselectdao'),$('#oscurrentDaoLogo'));
console.log("os")
console.log(osSelect.selectobj.html())
let h3form=document.getElementById('h3form')
h3form.addEventListener('submit', function (e) {
    if (h3form.checkValidity()) {
        if (osSelect.selectobj.data('osaddress')) {
            makeBack('DAO已经创建OS， 不能再创建！', true, true)
            e.preventDefault()
            e.stopPropagation()
            return;
        }
        makeBack('<div style="text-align: center" ><img src="/lodding.gif" /></div>', false, false);
        let _daoName = osSelect.selectobj.data('daoname');
        let _ren1 = [];
        let _ren2 = [];
        $('#zp').find('input[type="text"]').each(function (i, v) {
            _ren1.push($(v).val())
        })
        $('#zp').find('input[type="number"]').each(function (i, v) {
            _ren2.push($(v).val())
        })
        let _ar1 = [$('#m1').val(), $('#m2').val(), $('#m3').val(), $('#m4').val()];
        //参数编码
        let _voteData = web3.eth.abi.encodeParameters(['uint32', 'uint32', 'uint32', 'uint32'], _ar1);
        //函数编码
        let _functionCode = web3.eth.abi.encodeFunctionCall({
            name: 'init',
            type: 'function',
            inputs: [{
                type: 'bytes',
                name: 'voteData'
            }, {
                type: 'uint32',
                name: '_daoNumber'
            }, {
                type: 'string',
                name: '_to'
            }]
        }, [_voteData, osSelect.selectobj.val(), '0xE05e6f08eb48830c245313e8bD6Cca22Bf14803C']);

        register_obj.createOs(_daoName, _ren1, _ren2, [_functionCode], [_voteData], callbackFn);

        // register_obj.contract.methods.createOs(_daoName,_ren1,_ren2,[_functionCode],[_voteData]).send({from: selectedAccount}
        //     ,function (err,re){
        //    console.log(err);
        //    console.log(re);
        // });


        // .then(re => {
        //     console.log(re);
        // if(re)
        //     makeBack('交易Hash:'+re,true,true);
        // else
        //     w_toast.hide();
        // })
    }
    h3form.classList.add('was-validated')
    e.preventDefault()
    e.stopPropagation()
}, false);