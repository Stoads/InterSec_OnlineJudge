// console.log(page,pages);
var EL = (sel) => document.querySelector(sel);
var url = location.href;
if(url.indexOf('?')==-1) url += '?page=1';
// console.log(url);
var params_arr = url.substring(url.indexOf('?')+1).split('&');
// console.log(params_arr);
var params_json = {};
params_arr.forEach((v,i,c) => {
  v=v.split('=');
  params_json[v[0]]=v[1];
});
// console.log(params_json);
var json_to_params= (json_obj) =>{
  var ret = '';
  for(key in json_obj)
    ret += '&'+key+'='+json_obj[key];
  return ret.replace('&','?');
}
if(page>1){
  params_json['page']=1;
  EL('#go_first').href='/status' + json_to_params(params_json);
  params_json['page']=page-1;
  EL('#go_before').href='/status' + json_to_params(params_json);
}
if(page<pages){
  params_json['page']=page+1;
  EL('#go_next').href='/status' + json_to_params(params_json);
  params_json['page']=pages;
  EL('#go_last').href='/status' + json_to_params(params_json);
}
