$('#transaction1').append('   <section>' +
    '                    <div class="shadow-sm p-3 mb-5 bg-body rounded hmenu noselect" >' +
    '                        <div class="hitem bg-info"  >' +
    '                             <i class="bi bi-arrow-left-right"></i><br/>' +
    '                            eth 转 utoken' +
    '                        </div>' +
    '                        <div class="hitem"  >' +
    '                             <i class="bi bi-arrow-left-right"></i><br/>' +
    '                            utoken 转 token' +
    '                        </div>' +
    '                        <div class="hitem"  >' +
    '                             <i class="bi bi-arrow-left-right"></i><br/>' +
    '                            token 转 utoken' +
    '                        </div>' +
    '                    </div>' +
    '                </section>' );

let menuobj1 = $('.hitem').eq(0);
$('.hitem').each(function (_j, v) {
    $(v).on('click', function () {
        for (let _i = 1; _i <= 3; _i++) {
            $('#d'+_i+'form').hide()
        }
        $('#d'+(_j + 1)+'form').show()
        // if((_j==1 || _j==2) && $('#connected').is(":visible")) getDaos(_j);

        if (menuobj1) {
            menuobj1.removeClass('bg-info')
        }
        $(v).addClass('bg-info')
        menuobj1 = $(v)
    })
})
