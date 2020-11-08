var EL = (sel) => document.querySelector(sel);
const pw_sel = EL("#pw");
const pr_sel = EL("#pr");
const id_sel = EL("#id");
const nm_sel = EL("#nm");
const nn_sel = EL("#nn");

var pw_chk = () => {
  if (EL("#pw").value == EL("#pr").value) {
    EL("#prc").className = "input-group-prepend blue-shadow";
    EL("#submit").disabled = false;
  }
  if (EL("#pw").value != EL("#pr").value) {
    EL("#prc").className = "input-group-prepend red-shadow";
    EL("#submit").disabled = true;
  }
}
pr_sel.addEventListener("input", pw_chk);
pw_sel.addEventListener("input", pw_chk);

var replaceChar = /[~!@\#$%^&*\()\-=+_'\;<>\/.\`:\"\\,\[\]?|{}]/gi;

var replaceSpace = /\s/

var spec_delete = (str) => {
  if (str && str.length) {
    str = str.replace(replaceChar, "").replace(replaceSpace, "");
  }
  return str;
};
var func = function() {
  var str = this.value;
  this.value = spec_delete(this.value);
  if(str==this.value){
    var data = {'type' : this.name,'data' : this.value};
    data=JSON.stringify(data);
    var xhr = new XMLHttpRequest();
    xhr.open('POST','/signup/ajax');
    xhr.setRequestHeader("Content-type","application/json");
    xhr.send(data);

    xhr.addEventListener('load',()=>{
      var res = JSON.parse(xhr.responseText);
      if(res.result=='ok')
        EL('#'+this.id+'chk').innerHTML='';
      if(res.result=='no')
        EL('#'+this.id+'chk').innerHTML='사용이 불가합니다.';
    });
  }
}
id_sel.addEventListener("input", func);
nn_sel.addEventListener("input", func);
nm_sel.addEventListener("input", function () {
  this.value = spec_delete(this.value)
});
