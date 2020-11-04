var EL = (sel) => document.querySelector(sel);
var sign_btn = EL("#sign_btn");
sign_btn.href += "?next=" + window.location.pathname
+ (window.location.href.indexOf('?') < 0 ? '' : window.location.href.substring(window.location.href.indexOf('?')).replace(/\&/gi,'%26'));
// console.log(window.location.href);
// console.log(sign_btn.href);
