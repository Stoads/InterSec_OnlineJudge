var EL = (sel) => document.querySelector(sel);
var search_btn = EL('#search');
var add_btn = EL('#add');
var delete_btn = EL('#delete');

search_btn.addEventListener('click',function(){
  var val = EL('#no').value;

  var data = {data : val};
  data=JSON.stringify(data);
  var xhr = new XMLHttpRequest();
  xhr.open('POST','/manage/search');
  xhr.setRequestHeader("Content-type","application/json");
  xhr.send(data);

  xhr.addEventListener('load',()=>{
    var res = JSON.parse(xhr.responseText);
    if(res.result=='ok'){
      EL('#link').innerHTML=res.no + '. '+res.title;
      EL('#link').href='/manage/update/'+res.no;
    }
    else{
      EL('#link').innerHTML='';
      EL('#link').hret='';
    }
  });
});
add_btn.addEventListener('click',function(){
  location.href='/manage/insert'
});
delete_btn.addEventListener('click',function(){
  var val = EL('#no').value;

  var data = { data : val, async:false };
  data=JSON.stringify(data);
  var xhr = new XMLHttpRequest();
  // xhr.onreadystatechange =
  xhr.open('POST','/manage/delete');
  xhr.setRequestHeader("Content-type","application/json");
  xhr.send(data);

  xhr.addEventListener('load',()=>{
    var res = JSON.parse(xhr.responseText);
    if(res.result=='ok'){
      alert(res.no+'번이 제거되었습니다.');
    }
    else{
      alert('오류');
    }
  });
});
