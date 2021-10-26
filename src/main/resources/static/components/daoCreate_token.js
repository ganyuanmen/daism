$('#transaction2').append(' <form id="h4form"  style="display: none;" class="row g-3 needs-validation" novalidate>' +
    '                    <div class="card" >' +
    '                        <div  class="card-body">' +
    '                            <h5 class="card-title">发行token</h5>' +
    '                            <div id="tokenselectdao" class="input-group mb-2">' +
    '                                <span class="input-group-text gaa" >DAO</span>' +
    '                            </div>' +
    '                    <div class="input-group mb-2">' +
    '                        <span class="input-group-text gaa" >logo</span>' +
    '                        <div id="tokencurrentDaoLogo" class="form-control" ></div>' +
    '                    </div>' +
    '                    <br/>' +
    '                    <div class="d-grid gap-2"  >' +
    '                        <button id="createtokenbtn" class="btn btn-primary"  type="submit" >' +
    '                            发行token' +
    '                        </button>' +
    '                    </div>' +
    '                        </div>' +
    '                    </div>' +
    '                </form>');
btns.push(document.getElementById('createtokenbtn'));
let tokenSelect=new DaoSelect();
tokenSelect.init($('#tokenselectdao'),$('#tokencurrentDaoLogo'));

console.log(tokenSelect.selectobj.html())

let h4form=document.getElementById('h4form')
h4form.addEventListener('submit', function (e) {
    if (h4form.checkValidity()) {
        if(!tokenSelect.selectobj.data('osaddress'))
        {
            makeBack('未创建OS，不能发布token！',true,true)
            e.preventDefault()
            e.stopPropagation()
            return;
        }
        if(tokenSelect.selectobj.data('tokenid'))
        {
            makeBack('DAO已经发行token， 不能再发行！',true,true)
            e.preventDefault()
            e.stopPropagation()
            return;
        }

        makeBack('<div style="text-align: center" ><img src="/lodding.gif" /></div>',false,false);

        ERC20s_obj.issue(tokenSelect.selectobj.val(),callbackFn);
    }
    h4form.classList.add('was-validated')
    e.preventDefault()
    e.stopPropagation()
}, false);
