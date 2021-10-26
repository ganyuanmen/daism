var requestObj;
$(function (){
    showData({pageSize:2})
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
            console.log(obj)
            $('#daoCount').html(obj.total)
            $('#pageNum').html(obj.pages)
            $('#pageCur').html(obj.current)
            $('#daoMain').empty()
            $.each(obj.records, function (_i, v) {
                const _div = $('<div></div>').addClass('card').appendTo('#daoMain')
                const _div1 = $('<div></div>').addClass('card-body').appendTo(_div)
                $('<div class="nowrap" style="padding-bottom: 10px; font-size: 11px"></div>')
                    .html(` DAF地址：${v.dafAddress}`).appendTo(_div1)
                $('<h4 class="nowrap" ></h4>').html(v.title).appendTo(_div1)
                const _div2 = $(' <div style="display: flex;"></div>').appendTo(_div1)
                $('<img/>').attr('src', v.logoUrl).height(70).width(70).appendTo(_div2)
                $('<p class="card-text carde"></p>').html(v.remark).appendTo(_div2)
                const _div3 = $('<div style="display: flex; align-items: center;justify-content: space-between; font-size: 10px; padding-top: 12px;"></div>').appendTo(_div1)
                $('<div></div>').html(`创建时间：${v.createTime}`).appendTo(_div3)
                $('<div></div>').html(`币价：${v.price}`).appendTo(_div3)
                $('<div></div>').html(`市值排名：${v.ethIndex}`).appendTo(_div3)
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
    console.log(e.keyCode === 13)
    {
        if ($('#searchbox').val().trim()) {
            const obj = { title: $('#searchbox').val().trim() }
            if ($('#clickChart').hasClass('ac')) {
                obj.order = 'title'
            } else if ($('#clickTime').hasClass('ac')) {
                obj.order = 'create_time'
            }
            showData($.extend(requestObj,obj))
        }
    }
})
$('#clickTime').on('click', function () {
    const obj = { order: 'create_time', title: $('#searchbox').val().trim() }
    showData($.extend(requestObj,obj))
    $('#clickChart').removeClass('ac')
    $('#clickTime').addClass('ac')

})


$('#clickChart').on('click', function () {
    const obj = { order: 'title', title: $('#searchbox').val().trim() }
    showData($.extend(requestObj,obj))
    $('#clickChart').addClass('ac')
    $('#clickTime').removeClass('ac')

})

$('#refrebtn').on('click',function (){
    const obj = { order: 'title', title: $('#searchbox').val().trim() }
    showData($.extend(requestObj,obj))
})

function clickMenu (id) {
    $('#route1').removeClass('active')
    $('#route2').removeClass('active')
    $('#route0').removeClass('active')
    $(`#route${id}`).addClass('active')

    $('#transaction0').hide()
    $('#transaction1').hide()
    $('#transaction2').hide()
    $(`#transaction${id}`).show()

}

$('#route0').on('click', function () {
    clickMenu(0)
})
$('#route1').on('click', function () {
    clickMenu(1)
})
$('#route2').on('click', function () {
    clickMenu(2)
})


let menuobj = null
$('.hitem2').each(function (_j, v) {
    $(v).on('click', function () {
        $('#neinei').hide();
        $('#h1formResult').hide();
        for (let _i = 1; _i <= 4; _i++) {
            $('#h'+_i+'form').hide()
        }
        $('#h'+(_j + 1)+'form').show()
        if((_j==1 || _j==2) && $('#connected').is(":visible")) getDaos(_j);

        if (menuobj) {
            menuobj.removeClass('bg-info')
        }
        $(v).addClass('bg-info')
        menuobj = $(v)
    })
})

$('.hitem').each(function (_j, v) {
    $(v).on('click', function () {
        for (let _i = 1; _i <= 4; _i++) {
            $(`#id${_i}`).hide()
        }
        $(`#id${_j + 1}`).show()
        if (menuobj) {
            menuobj.removeClass('bg-info')
        }
        $(v).addClass('bg-info')
        menuobj = $(v)
    })
})

$("#formFileLg").change(function () {
    var file = this.files[0];
    $('#errmesss').hide();

    var type = this.value.toLowerCase().split('.').splice(-1); //获取上传的文件的后缀名
    if (type[0] != 'svg') {
        $('#errmesss').show();
        return;
    }
    var reader = new FileReader();
    reader.onload = function() {
        if(reader.result) {
            //显示文件内容
            $("#selectDaoLogo").html(reader.result);
        }
    };
    reader.readAsText(file);
    // var fd = new FormData();
    // fd.append("file", file);
    // var xhr = new XMLHttpRequest();
    // xhr.addEventListener("load", uploadComplete, false);
    // xhr.open("POST", "/upload");
    // xhr.send(fd);
});
//
// function  uploadComplete(evt) {
//
//     var r = evt.target.responseText;
//     if (r) {
//       console.log(r);
//       $('#selectDaoLogo').attr('d',r);
//     }
//
// }
