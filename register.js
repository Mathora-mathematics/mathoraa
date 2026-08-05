
document.addEventListener('DOMContentLoaded',()=>{
 const form=document.querySelector('form');
 if(!form) return;
 form.addEventListener('submit',e=>{
   e.preventDefault();
   localStorage.setItem('mathoraStudent',JSON.stringify(Object.fromEntries(new FormData(form))));
   window.location='test.html';
 });
});
