
document.write('<div id="backrefresh"><div class="d-flex justify-content-center align-items-center" style="width: 100%; height: 100%" ></div></div>' +
    '<header class="navbar navbar-expand-md navbar-dark bd-navbar fixed-top  " style="background:#2b669a !important;">' +
    '    <nav class="container-xxl flex-wrap flex-md-nowrap" >' +
    '        <a class="navbar-brand p-0 me-2" href="/" >' +
    '            <img src="/logo.svg" style="width: 40px">' +
    '        </a>' +
    '        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#bdNavbar" aria-controls="bdNavbar" aria-expanded="false" aria-label="Toggle navigation">' +
    '            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" class="bi" fill="currentColor" viewBox="0 0 16 16">' +
    '                <path fill-rule="evenodd" d="M2.5 11.5A.5.5 0 0 1 3 11h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 7h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 3 3h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z"/>' +
    '            </svg>' +
    '        </button>' +
    '        <div class="collapse navbar-collapse" id="bdNavbar">' +
    '            <ul class="navbar-nav flex-row flex-wrap bd-navbar-nav pt-2 py-md-0">' +
    '                <li class="nav-item col-6 col-md-auto">' +
    '                    <a class="nav-link p-2 active" id="route0"  href="#" >DAO列表</a>' +
    '                </li>' +
    '                <li class="nav-item col-6 col-md-auto">' +
    '                    <a class="nav-link p-2" id="route1"  href="#">IADD交易</a>' +
    '                </li>' +
    '                <li class="nav-item col-6 col-md-auto">' +
    '                    <a class="nav-link p-2" href="#" id="route2"  >创建DAO</a>' +
    '                </li>' +
    // '                <li class="nav-item col-6 col-md-auto">' +
    // '                    <a class="nav-link p-2" href="http://124.71.78.126:8081"  target="_blank" >博客</a>' +
    // '                </li>' +
    // '                <li class="nav-item col-6 col-md-auto">' +
    // '                    <a class="nav-link p-2" href="http://124.71.78.126:8081" target="_blank">文档</a>' +
    // '                </li>' +
    '            </ul>' +
    '            <hr class="d-md-none text-white-50">' +
    '            <ul class="navbar-nav flex-row flex-wrap ms-md-auto">' +
    '                <li class="nav-item col-6 col-md-auto">' +
    '                    <div id="prepare">' +
    '                    <button class="btn btn-success btn-sm" id="btn-connect"  style="border-radius: 12px;">' +
    '                        <i class="bi bi-wallet-fill"></i>' +
    '                        &nbsp;连接钱包&nbsp;' +
    '                    </button>' +
    '                    </div>' +
    '                    <div id="connected" style="display: none">' +
    '                        <span id="qpo" tabindex="0" data-bs-toggle="popover" data-bs-trigger="hover focus"' +
    '                              data-bs-placement="bottom" >' +
    '                            <span style="font-size: 24px; margin-right: 20px;display: inline-block; color: #1aa179 ">' +
    '                             <i  class="bi bi-person-circle"></i>' +
    '                                </span>' +
    '                        </span>' +
    '                        <button class="btn btn-warning btn-sm" id="btn-disconnect"  style="border-radius: 12px;">' +
    '                            <i class="bi bi-wallet-fill"></i>' +
    '                            &nbsp;退出钱包&nbsp;' +
    '                        </button>' +
    '                    </div>' +
    '                </li>' +
    '            </ul>' +
    '        </div>' +
    '    </nav>' +
    '</header>');

var backrefresh=$('#backrefresh');
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
