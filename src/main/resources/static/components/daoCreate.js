$('#transaction2').append('<section>' +
    '                    <div class="shadow-sm p-3 mb-5 bg-body rounded hmenu noselect" >' +
    '                        <div class="hitem2"  >' +
    '                            <i class="bi bi-file-earmark-plus"></i><br/>' +
    '                            注册' +
    '                        </div>' +
    '                        <div class="hitem2"   >' +
    '                            <i class="bi bi-file-earmark-image"></i><br/>' +
    '                            更新logo' +
    '                        </div>' +
    '                        <div class="hitem2"  >' +
    '                            <i class="bi bi-file-earmark-plus"></i><br/>' +
    '                            创建OS' +
    '                        </div>' +
    '                        <div class="hitem2"  >' +
    '                            <i class="bi bi-currency-dollar"></i><br/>' +
    '                            发行token' +
    '                        </div>' +
    '                    </div>' +
    '                </section>'
);

let menuobj = null
$('.hitem2').each(function (_j, v) {
    $(v).on('click', function () {
        for (let _i = 1; _i <= 4; _i++) {
            $('#h'+_i+'form').hide()
        }
        $('#h'+(_j + 1)+'form').show()
       // if((_j==1 || _j==2) && $('#connected').is(":visible")) getDaos(_j);

        if (menuobj) {
            menuobj.removeClass('bg-info')
        }
        $(v).addClass('bg-info')
        menuobj = $(v)
    })
})
