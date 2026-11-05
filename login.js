// Offline browser sign-in. This provides basic local role separation, not server-grade security.
const STORE='sw_accounts';
async function hashPassword(value){
  if(window.crypto&&crypto.subtle){
    const enc=new TextEncoder(),salt=crypto.getRandomValues(new Uint8Array(16));
    const key=await crypto.subtle.importKey('raw',enc.encode(value),'PBKDF2',false,['deriveBits']);
    const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:150000,hash:'SHA-256'},key,256);
    const hex=b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
    return {salt:hex(salt),hash:hex(bits),algorithm:'PBKDF2-SHA256'};
  }
  return {salt:'legacy',hash:btoa(unescape(encodeURIComponent(value))),algorithm:'legacy'};
}
async function verifyPassword(value,record){
 if(!record)return false;
 if(typeof record==='string'){if(/^[a-f0-9]{64}$/i.test(record)&&crypto.subtle){const d=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(value));return Array.from(new Uint8Array(d)).map(x=>x.toString(16).padStart(2,'0')).join('')===record.toLowerCase()}return record===btoa(unescape(encodeURIComponent(value)));}
 if(record.algorithm==='legacy')return record.hash===btoa(unescape(encodeURIComponent(value)));
 if(!crypto.subtle)return false;
 const enc=new TextEncoder(),salt=new Uint8Array(record.salt.match(/.{2}/g).map(x=>parseInt(x,16)));
 const key=await crypto.subtle.importKey('raw',enc.encode(value),'PBKDF2',false,['deriveBits']);
 const bits=await crypto.subtle.deriveBits({name:'PBKDF2',salt,iterations:150000,hash:'SHA-256'},key,256);
 return Array.from(new Uint8Array(bits)).map(x=>x.toString(16).padStart(2,'0')).join('')===record.hash;
}
function accounts(){try{return JSON.parse(localStorage.getItem(STORE)||'[]')}catch{return []}}
function saveAccounts(a){localStorage.setItem(STORE,JSON.stringify(a))}
function seedLibrary(){
 if(!localStorage.getItem('sw_books'))localStorage.setItem('sw_books',JSON.stringify([
 {id:1,title:'Atomic Habits',author:'James Clear',isbn:'9780735211292',category:'Personal Growth',shelf:'A-01',total:4,available:3,cover:''},
 {id:2,title:'The Design of Everyday Things',author:'Don Norman',isbn:'9780465050659',category:'Design',shelf:'B-03',total:3,available:3,cover:''},
 {id:3,title:'Clean Code',author:'Robert C. Martin',isbn:'9780132350884',category:'Technology',shelf:'C-02',total:5,available:2,cover:''},
 {id:4,title:'The Psychology of Money',author:'Morgan Housel',isbn:'9780857197689',category:'Finance',shelf:'A-05',total:2,available:0,cover:''},
 {id:5,title:'Deep Work',author:'Cal Newport',isbn:'9781455586691',category:'Productivity',shelf:'A-02',total:3,available:3,cover:''}
 ]));
 if(!localStorage.getItem('sw_students'))localStorage.setItem('sw_students',JSON.stringify([
 {id:1,code:'ST-1001',name:'Ayesha Khan',email:'ayesha@example.com',department:'Computer Science',phone:'03001234567'},
 {id:2,code:'ST-1002',name:'Hamza Ali',email:'hamza@example.com',department:'Business',phone:'03007654321'},
 {id:3,code:'ST-1003',name:'Sara Ahmed',email:'sara@example.com',department:'Design',phone:'03111234567'}
 ]));
 if(!localStorage.getItem('sw_issues'))localStorage.setItem('sw_issues','[]');
}
document.addEventListener('DOMContentLoaded',()=>{
 const form=document.getElementById('loginForm');if(!form)return;
 const error=document.getElementById('loginError'),panel=document.getElementById('registerPanel');let list=accounts();
 if(list.length){let changed=false;list=list.map((a,i)=>{const role=i===0?'Admin':'Librarian';if(a.role!==role){a.role=role;changed=true}return a});if(changed)saveAccounts(list)}
 const registerLink=document.getElementById('showRegister');
 if(list.length>0)registerLink.parentElement.hidden=true;
 form.addEventListener('submit',async e=>{
  e.preventDefault();const btn=form.querySelector('button[type="submit"]');btn.disabled=true;btn.textContent='Checking…';error.hidden=true;
  const email=document.getElementById('email').value.trim().toLowerCase(),password=document.getElementById('password').value;
  const a=accounts().find(x=>x.email===email);
  if(!a||!await verifyPassword(password,a.passwordHash)){error.textContent='Incorrect email or password.';error.hidden=false;btn.disabled=false;btn.textContent='Sign in securely →';return}
  seedLibrary();localStorage.setItem('sw_session',JSON.stringify({name:a.name,email:a.email,role:a.role}));location.href='dashboard.html';
 });
 registerLink.onclick=e=>{e.preventDefault();if(accounts().length){return}panel.style.display='block'};
 document.getElementById('closeRegister').onclick=()=>panel.style.display='none';
 document.getElementById('registerForm').addEventListener('submit',async e=>{
  e.preventDefault();const msg=document.getElementById('registerError');msg.hidden=true;const name=document.getElementById('regName').value.trim(),email=document.getElementById('regEmail').value.trim().toLowerCase(),password=document.getElementById('regPassword').value;const list=accounts();
  if(list.length){msg.textContent='The first Admin already exists. Ask the Admin to create your Librarian account.';msg.hidden=false;return}
  if(password.length<10){msg.textContent='Use at least 10 characters for a stronger password.';msg.hidden=false;return}
  if(list.some(a=>a.email===email)){msg.textContent='This email is already registered.';msg.hidden=false;return}
  const record=await hashPassword(password);list.push({name,email,passwordHash:record,role:'Admin',createdAt:new Date().toISOString()});saveAccounts(list);seedLibrary();localStorage.setItem('sw_session',JSON.stringify({name,email,role:'Admin'}));location.href='dashboard.html';
 });
});
