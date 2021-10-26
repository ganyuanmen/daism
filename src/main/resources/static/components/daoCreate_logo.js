$('#transaction2').append('  <form id="h2form" style="display: none;" class="row g-3 needs-validation" novalidate>' +
    '                    <div class="card" >' +
    '                        <div class="card-body">' +
    '                            <div class="card-title">DAO logo更新</div>' +
    '                    <div id="daoselectParent" class="input-group mb-2">' +
    '                        <span class="input-group-text ga" >DAO</span>' +
    '                    </div>' +
    '                    <div class="input-group mb-2">' +
    '                        <span class="input-group-text ga" >当前logo</span>' +
    '                        <div id="currentDaoLogo" class="form-control" ></div>' +
    '                    </div>' +
    '                    <div id="logoParent" class="input-grou mb-2">' +
    '                    </div>' +
    '                    <div class="input-group mb-2">' +
    '                        <span class="input-group-text ga" >更新logo</span>' +
    '                        <div id="selectDaoLogo" class="form-control" ></div>' +
    '                    </div>' +
    '                            <div class="alert alert-warning" role="alert">' +
    '                                提案之后的DAO 才能更改logo!' +
    '                            </div>' +
    '                    <br/>' +
    '                    <div class="d-grid gap-2"  >' +
    '                        <button id="uploadlogo" type="submit" class="btn btn-primary"  >' +
    '                            更新logo' +
    '                        </button>' +
    '                    </div>' +
    '                        </div>' +
    '                    </div>' +
    '                </form>');

btns.push(document.getElementById('uploadlogo'));

gene_logoSelect($('#logoParent'),$('#selectDaoLogo'));
let daoLogo=new DaoSelect();
daoLogo.init($('#daoselectParent'),$('#currentDaoLogo'));
let h2form=document.getElementById('h2form')
h2form.addEventListener('submit', function (event) {
    if (h2form.checkValidity()) {
        makeBack('<div style="text-align: center" ><img src="/lodding.gif" /></div>',false,false);
        let _id=daoLogo.selectobj.val();
        debugger;
      //  let _is=DaoSelect.getAttr(_id,'isSet');
        if(!daoLogo.selectobj.data('logodaoId'))
            logos_obj.setLogo(_id, $('#selectDaoLogo').data('real_src'),callbackFn)
        else
         logos_obj.changeLogo(_id, $('#selectDaoLogo').data('real_src'),callbackFn);
    }
    h2form.classList.add('was-validated')
    event.preventDefault()
    event.stopPropagation()
}, false);

