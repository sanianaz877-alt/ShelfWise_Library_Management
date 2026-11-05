(() => {
const C=window.LIBRARY_CONFIG||{};
const icons={
grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
book:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/>',
users:'<path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="10" cy="7" r="4"/><path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
swap:'<path d="m17 3 4 4-4 4"/><path d="M3 7h18"/><path d="m7 21-4-4 4-4"/><path d="M21 17H3"/>',
return:'<path d="M9 14 4 9l5-5"/><path d="M4 9h10a6 6 0 0 1 0 12h-2"/>',
report:'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-4 4"/>',
search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>',
bell:'<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
plus:'<path d="M12 5v14M5 12h14"/>',
edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
trash:'<path d="M3 6h18M8 6V4h8v2m-9 0 1 14h8l1-14M10 10v6m4-6v6"/>',
download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5M12 15V3"/>',
clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
check:'<path d="m5 12 4 4L19 6"/>',
logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',
x:'<path d="m18 6-12 12M6 6l12 12"/>',
alert:'<path d="m10.3 3.9-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.7-3.1l-8-14a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4m0 4h.01"/>',
calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',
bookplus:'<path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M12 6v6m-3-3h6"/>'
};
function icon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name]||icons.book}</svg>`}
const nav=[['dashboard.html','Dashboard','grid'],['books.html','Books Catalog','book'],['students.html','Students','users'],['issue.html','Issue a Book','swap'],['returns.html','Returns & Fines','return'],['reports.html','Reports','report'],['librarians.html','Manage Librarians','users']];
const page=location.pathname.split('/').pop()||'index.html';
const titleMap={'dashboard.html':'Dashboard','books.html':'Books Catalog','students.html':'Students','issue.html':'Issue a Book','returns.html':'Returns & Fines','reports.html':'Reports','librarians.html':'Manage Librarians','settings.html':'Settings'};
function layout(){
 const root=document.querySelector('#app'); if(!root)return;
 const title=titleMap[page]||'Library';
 root.innerHTML=`<div class="app-shell"><aside class="sidebar" id="sidebar"><a class="brand" href="dashboard.html"><span class="brand-mark">S</span><span>ShelfWise<small>LIBRARY SYSTEM</small></span></a><div class="nav-label">WORKSPACE</div><nav>${nav.filter(n=>{const u=JSON.parse(localStorage.getItem('sw_session')||'{}');return u.role==='Admin'||n[0]!=='reports.html'&&n[0]!=='librarians.html'}).map(n=>`<a class="nav-link ${page===n[0]?'active':''}" href="${n[0]}">${icon(n[2])}<span>${n[1]}</span></a>`).join('')}</nav><div class="sidebar-bottom"><div class="help-card">${icon('book')}<strong>Keep learning.</strong><p>Every book opens a new world. Keep your library organized and inspiring.</p></div><a class="nav-link" style="margin-top:15px" href="login.html" id="logoutLink">${icon('logout')}<span>Log out</span></a></div></aside><div class="mobile-overlay" id="mobileOverlay"></div><main class="main"><header class="topbar"><div style="display:flex;align-items:center;gap:12px"><button class="icon-btn menu-toggle" id="menuToggle" aria-label="Open navigation">${icon('menu')}</button><div><div class="crumb">Workspace / ${title}</div><h1 class="page-title">${title}</h1></div></div><div class="top-actions"><button class="icon-btn" id="alertBell" aria-label="Show alerts">${icon('bell')}</button><div class="avatar" id="userAvatar" title="Signed-in librarian">L</div></div></header><div id="pageContent"></div></main></div><div class="toast-container" id="toastContainer"></div><div class="modal-backdrop" id="modalBackdrop"><div class="modal"><div class="modal-head"><h2 id="modalTitle">Add new</h2><button class="modal-close" id="modalClose" aria-label="Close">×</button></div><div id="modalBody"></div></div></div>`;
 document.getElementById('menuToggle').onclick=()=>{document.getElementById('sidebar').classList.add('open');document.getElementById('mobileOverlay').classList.add('show')};
 document.getElementById('mobileOverlay').onclick=()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('mobileOverlay').classList.remove('show')};
 document.getElementById('modalClose').onclick=closeModal;document.getElementById('modalBackdrop').onclick=e=>{if(e.target.id==='modalBackdrop')closeModal()};
 document.getElementById('alertBell').onclick=()=>showAlerts();try{const u=JSON.parse(localStorage.getItem('sw_session')||'{}');const a=document.getElementById('userAvatar');if(a&&u.name){a.textContent=u.name.charAt(0).toUpperCase();a.title=u.name+' · '+(u.role||'Librarian')}}catch{}
 document.getElementById('logoutLink').onclick=async e=>{e.preventDefault();try{await fetch('/api/logout',{method:'POST'})}finally{localStorage.removeItem('sw_session');localStorage.removeItem('sw_server_ready');location.href='login.html'}};
}
function toast(message,type='success'){const box=document.getElementById('toastContainer');if(!box)return;const el=document.createElement('div');el.className='toast '+(type==='error'?'error':type==='warning'?'warning':'');el.innerHTML=`${icon(type==='error'?'alert':'check')}<span>${escapeHtml(message)}</span><button aria-label="Dismiss">×</button>`;el.querySelector('button').onclick=()=>el.remove();box.appendChild(el);setTimeout(()=>el.remove(),4500)}
function escapeHtml(s){return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function openModal(title,html){document.getElementById('modalTitle').textContent=title;document.getElementById('modalBody').innerHTML=html;document.getElementById('modalBackdrop').classList.add('open')}
function closeModal(){document.getElementById('modalBackdrop')?.classList.remove('open')}
function today(){return new Date().toISOString().slice(0,10)}
function datePlus(date,days){const d=new Date(date+'T12:00:00');d.setDate(d.getDate()+Number(days));return d.toISOString().slice(0,10)}
function fmtDate(d){if(!d)return '—';return new Date(d+'T12:00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}
function seed(){if(localStorage.getItem('sw_server_ready')==='1' && localStorage.getItem('sw_books')) return; if(!localStorage.getItem('sw_books'))localStorage.setItem('sw_books',JSON.stringify([
{id:1,title:'Atomic Habits',author:'James Clear',isbn:'9780735211292',category:'Personal Growth',shelf:'A-01',total:4,available:3,cover:'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=120&h=160&fit=crop'},
{id:2,title:'The Design of Everyday Things',author:'Don Norman',isbn:'9780465050659',category:'Design',shelf:'B-03',total:3,available:3,cover:'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=120&h=160&fit=crop'},
{id:3,title:'Clean Code',author:'Robert C. Martin',isbn:'9780132350884',category:'Technology',shelf:'C-02',total:5,available:2,cover:'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=120&h=160&fit=crop'},
{id:4,title:'The Psychology of Money',author:'Morgan Housel',isbn:'9780857197689',category:'Finance',shelf:'A-05',total:2,available:0,cover:'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=120&h=160&fit=crop'},
{id:5,title:'Deep Work',author:'Cal Newport',isbn:'9781455586691',category:'Productivity',shelf:'A-02',total:3,available:3,cover:'https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=120&h=160&fit=crop'}
]));
if(!localStorage.getItem('sw_students'))localStorage.setItem('sw_students',JSON.stringify([
{id:1,code:'ST-1001',name:'Ayesha Khan',email:'ayesha@example.com',department:'Computer Science',phone:'03001234567'},
{id:2,code:'ST-1002',name:'Hamza Ali',email:'hamza@example.com',department:'Business',phone:'03007654321'},
{id:3,code:'ST-1003',name:'Sara Ahmed',email:'sara@example.com',department:'Design',phone:'03111234567'}
]));
if(!localStorage.getItem('sw_issues'))localStorage.setItem('sw_issues',JSON.stringify([
{id:1,bookId:1,studentId:1,issueDate:datePlus(today(),-5),dueDate:datePlus(today(),9),returnDate:null,fine:0,status:'issued'},
{id:2,bookId:3,studentId:2,issueDate:datePlus(today(),-20),dueDate:datePlus(today(),-6),returnDate:null,fine:120,status:'issued'},
{id:3,bookId:2,studentId:3,issueDate:datePlus(today(),-10),dueDate:datePlus(today(),4),returnDate:null,fine:0,status:'issued'}
]));}
function get(key){try{return JSON.parse(localStorage.getItem('sw_'+key)||'[]')}catch{return []}}
function save(key,data){localStorage.setItem('sw_'+key,JSON.stringify(data));if(localStorage.getItem('sw_server_ready')==='1'){fetch('/api/data',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({[key]:data})}).catch(()=>toast('Could not sync with Python database.','error'))}window.dispatchEvent(new Event('library-data-changed'))}
function bookById(id){return get('books').find(x=>String(x.id)===String(id))}
function studentById(id){return get('students').find(x=>String(x.id)===String(id))}
function issueById(id){return get('issues').find(x=>String(x.id)===String(id))}
function available(book){return Number(book?.available||0)}
function showAlerts(){const issues=get('issues').filter(x=>x.status==='issued'&&x.dueDate<today());const noStock=get('books').filter(b=>available(b)===0);let msg='Library status: all clear.';if(issues.length||noStock.length)msg=`Library alerts: ${issues.length} overdue transaction(s), ${noStock.length} book title(s) currently unavailable.`;window.alert(msg)}
function requireSession(){
 if(page==='login.html')return true;
 let s;try{s=JSON.parse(localStorage.getItem('sw_session')||'null')}catch{}
 if(!s||!s.email){location.replace('login.html');return false}
 const accounts=(()=>{try{return JSON.parse(localStorage.getItem('sw_accounts')||'[]')}catch{return []}})();
 const account=accounts.find(a=>a.email===s.email&&a.role===s.role);
 if(!account){localStorage.removeItem('sw_session');location.replace('login.html');return false}
 if((page==='reports.html'||page==='librarians.html')&&s.role!=='Admin'){location.replace('dashboard.html');return false}
 if(page==='librarians.html'&&s.role!=='Admin'){location.replace('dashboard.html');return false}
 return true;
}
if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',()=>{seed();layout()})}else{seed();layout()}
window.Library={C,icon,toast,openModal,closeModal,escapeHtml,today,datePlus,fmtDate,get,save,bookById,studentById,issueById,available,showAlerts,requireSession};
})();
