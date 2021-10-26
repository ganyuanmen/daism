__CreateJSPath = function (js) {
    let scripts = document.getElementsByTagName("script");
    let path = "";
    for (var i = 0, l = scripts.length; i < l; i++) {
        var src = scripts[i].src;
        if (src.indexOf(js) != -1) {
            var ss = src.split(js);
            path = ss[0];
            break;
        }
    }
    let href = location.href;
    href = href.split("#")[0];
    href = href.split("?")[0];
    var ss = href.split("/");
    ss.length = ss.length - 1;
    href = ss.join("/");
    if (path.indexOf("https:") == -1 && path.indexOf("http:") == -1 && path.indexOf("file:") == -1 && path.indexOf("\/") != 0) {
        path = href + "/" + path;
    }
    return path;
}

let bootPATH = __CreateJSPath("boot.js");

let version=''; //0.1
document.write('<link href="' + bootPATH + '/bootstrap-5.0.2-dist/css/bootstrap.min.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + '/bootstrap-5.0.2-dist/css/docs.css" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + '/bootstrap-5.0.2-dist/icons/font/bootstrap-icons.css" rel="stylesheet" type="text/css" />');
document.write('<script src="' + bootPATH + 'jquery-3.2.1.min.js"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/bootstrap.bundle.min.js"></sc' + 'ript>');

document.write('<link href="' + bootPATH + '/wait.css?_t='+(version?version:(new Date()).getTime())+'" rel="stylesheet" type="text/css" />');
document.write('<link href="' + bootPATH + '/main.css?_t='+(version?version:(new Date()).getTime())+'" rel="stylesheet" type="text/css" />');



 document.write('<script src="' + bootPATH + '/components/header.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
 document.write('<script src="' + bootPATH + '/components/main.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
 document.write('<script src="' + bootPATH + '/components/footer.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');

 document.write('<script src="' + bootPATH + '/components/daoList.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');

document.write('<script src="' + bootPATH + '/public/web3.min.js"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/public/web3model.js"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/public/chains.min.js"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/public/wallectconnect.min.js"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/public/fortmatic.js"></sc' + 'ript>');

document.write('<script src="' + bootPATH + '/components/daoSelect.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/events/main.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');


document.write('<script src="' + bootPATH + '/interface/register.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/interface/logos.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/interface/daoInfo.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/interface/ERC20s.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/interface/IADD.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/interface/Utoken.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');


document.write('<script src="' + bootPATH + '/components/logoSelect.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');


// document.write('<script src="' + bootPATH + '/components/IADD.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/components/IADD_swap.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');

// document.write('<script src="' + bootPATH + '/components/IADD_swap1.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
// document.write('<script src="' + bootPATH + '/components/IADD_swap2.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
// document.write('<script src="' + bootPATH + '/components/IADD_swap3.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');


document.write('<script src="' + bootPATH + '/components/daoCreate.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/components/daoCreate_register.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/components/daoCreate_logo.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/components/daoCreate_os.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');
document.write('<script src="' + bootPATH + '/components/daoCreate_token.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');

document.write('<script src="' + bootPATH + '/components/daoSelectWindow.js?_t='+(version?version:(new Date()).getTime())+'"></sc' + 'ript>');

//
// btns.push(document.getElementById('createosbtn'))
// btns.push(document.getElementById('registerbtn'))
// btns.push(document.getElementById('createtokenbtn'))
