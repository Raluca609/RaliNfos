// --- Demo local storage auth ---
let DB_KEY='ri_demo_users';
let SESSION_KEY='ri_demo_session';
let CHAT_KEY='ri_demo_chat';

// load/save db
function loadDB(){return JSON.parse(localStorage.getItem(DB_KEY)||'{}');}
function saveDB(db){localStorage.setItem(DB_KEY,JSON.stringify(db));}
function getSession(){return localStorage.getItem(SESSION_KEY);}
function setSession(email){localStorage.setItem(SESSION_KEY,email);renderAuthState();}
function clearSession(){localStorage.removeItem(SESSION_KEY);renderAuthState();}

// render auth
function renderAuthState(){
  const sess=getSession();
  document.getElementById('btn-login').style.display = sess?'none':'inline-block';
  document.getElementById('btn-signup').style.display = sess?'none':'inline-block';
  document.getElementById('btn-logout').style.display = sess?'inline-block':'none';
  document.getElementById('btn-send').disabled=!sess;
  document.getElementById('chat-input').disabled=!sess;
  renderProfile();
}

// profile
function getProfile(email){
  const db=loadDB();
  return db[email]&&db[email].profile?db[email].profile:null;
}
function saveProfile(email,profile){
  const db=loadDB();
  if(!db[email]) db[email]={pass:'',profile:null};
  db[email].profile=profile;
  saveDB(db);
}

// render profile
function renderProfile(){
  const sess=getSession();
  const prof=getProfile(sess);
  const avatar=document.getElementById('profile-avatar');
  const nameEl=document.getElementById('profile-name');
  const descEl=document.getElementById('profile-desc');
  const editBtn=document.getElementById('btn-edit-profile');
  if(!sess){avatar.src='assets/avatar-default.png';nameEl.textContent='Neautentificat';descEl.textContent='Fă login sau înregistrează-te pentru a crea profil';editBtn.style.display='none';return;}
  if(prof){
    avatar.src=prof.avatarData||'assets/avatar-default.png';
    nameEl.textContent=prof.name||sess.split('@')[0];
    descEl.textContent=prof.desc||'';
  }else{avatar.src='assets/avatar-default.png';nameEl.textContent=sess.split('@')[0];descEl.textContent='Profil gol';}
  editBtn.style.display='inline-block';
}

// --- Chat ---
function loadChat(){return JSON.parse(localStorage.getItem(CHAT_KEY)||'[]');}
function saveChat(arr){localStorage.setItem(CHAT_KEY,JSON.stringify(arr));}
function renderChat(){
  const win=document.getElementById('chat-window');
  const arr=loadChat();
  win.innerHTML='';
  arr.forEach(m=>{
    const div=document.createElement('div');
    div.textContent=m.user+': '+m.msg;
    win.appendChild(div);
  });
  win.scrollTop=win.scrollHeight;
}
document.getElementById('btn-send').addEventListener('click',()=>{
  const sess=getSession();
  if(!sess) return alert('Log in pentru a scrie');
  const txt=document.getElementById('chat-input').value.trim();
  if(!txt) return;
  const arr=loadChat();
  arr.push({user:sess.split('@')[0],msg:txt});
  saveChat(arr);
  document.getElementById('chat-input').value='';
  renderChat();
});

// --- Background ---
document.querySelectorAll('.bg-choice').forEach(img=>{
  img.addEventListener('click',()=>{document.body.style.backgroundImage=`url(${img.src})`;document.body.style.backgroundSize='cover';});
});

// --- logout ---
document.getElementById('btn-logout').addEventListener('click',()=>{clearSession();});

// --- init ---
renderAuthState();
renderChat();