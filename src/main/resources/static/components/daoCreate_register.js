$('#transaction2').append('  <form id="h1form" class="row g-2 needs-validation" novalidate >' +
    '                        <div class="form-floating">' +
    '                            <input type="text" class="form-control" id="maddress" required  placeholder="管理员地址">' +
    '                            <label for="maddress">管理员地址</label>' +
    '                        </div>' +
    '                        <div class="form-floating">' +
    '                            <input type="text" class="form-control" id="mname" required  placeholder="dao名称">' +
    '                            <label for="mname">dao名称</label>' +
    '                        </div>' +
    '                        <div class="form-floating">' +
    '                            <input type="text" class="form-control" id="msname" required placeholder="dao符号">' +
    '                            <label for="msname">dao符号</label>' +
    '                        </div>' +
    '                    <div id="logoParent_register" class="input-group">' +
    '                    </div>' +
    '                    <div class="input-group">' +
    '                        <span class="input-group-text ga" >logo</span>' +
    '                        <div id="selectDaoLogo_register" class="form-control" ></div>' +
    '                    </div>' +
    '                        <div class="form-floating">' +
    '                            <textarea class="form-control" placeholder="dao描述" required id="mremark" style="height: 120px"></textarea>' +
    '                            <label for="mremark">dao描述</label>' +
    '                        </div>' +
    '                        <br/>' +
    '                        <div class="d-grid gap-2"  >' +
    '                            <button id="registerbtn" class="btn btn-primary" type="submit"  >' +
    '                                注册' +
    '                            </button>' +
    '                        </div>' +
    '                    </form>');
btns.push(document.getElementById('registerbtn'));
gene_logoSelect($('#logoParent_register'),$('#selectDaoLogo_register'));

let h1form=document.getElementById('h1form')
h1form.addEventListener('submit', function (e) {
    if (h1form.checkValidity()) {
        makeBack('<div style="text-align: center" ><img src="/lodding.gif" /></div>',false,false);

        register_obj.create($('#maddress').val(), $('#mname').val(), $('#msname').val(), $('#mremark').val(), true,$('#selectDaoLogo_register').data('real_src'),callbackFn)
            // .then(re => {
            //     console.log(re);
            // if(re)
            //     makeBack('交易Hash:'+re,true,true);
            // else
            //     w_toast.hide();
            // })
    }
    h1form.classList.add('was-validated')
    e.preventDefault()
    e.stopPropagation()
}, false);