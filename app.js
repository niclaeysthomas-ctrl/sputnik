/* ============================================================
   СПУТНИК · SPUTNIK — app.js (moteur)
   Vanilla JS, locale-first. Aucune dépendance externe.
   ============================================================ */

/* ---------- Helpers ---------- */
const $  = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const todayStr = () => new Date().toISOString().slice(0,10);
const rnd = arr => arr[Math.floor(Math.random()*arr.length)];
const shuffle = a => { a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; };

/* ---------- Niveaux ---------- */
const TITRES = [
  {min:0,    fr:"Novice",       ru:"Новичок"},
  {min:150,  fr:"Touriste",     ru:"Турист"},
  {min:400,  fr:"Élève",        ru:"Ученик"},
  {min:800,  fr:"Voyageur",     ru:"Путешественник"},
  {min:1400, fr:"Cosmonaute",   ru:"Космонавт"},
  {min:2200, fr:"Connaisseur",  ru:"Знаток"},
  {min:3200, fr:"Maître",       ru:"Мастер"},
  {min:4600, fr:"Polyglotte",   ru:"Полиглот"},
];
function levelInfo(xp){
  let idx=0;
  for(let i=0;i<TITRES.length;i++){ if(xp>=TITRES[i].min) idx=i; }
  const cur=TITRES[idx], next=TITRES[idx+1];
  const base=cur.min, ceil=next?next.min:cur.min;
  const pct=next? Math.round(((xp-base)/(ceil-base))*100) : 100;
  return {niveau:idx+1, titre:cur, next, pct, toNext: next? ceil-xp : 0};
}

/* ---------- State ---------- */
const LS = "sputnik_v1";
const DEFAULT = {
  xp:0, streak:0, lastDay:null, bestStreak:0,
  seenLetters:{},        // up -> true (lettre "vue")
  masteredLetters:{},    // up -> true (réussie en quiz)
  deck:{},               // key(ru) -> {ru,tr,fr,ef,interval,reps,due,lapses}
  learnedThemes:{},      // theme id -> true (nouveaux mots injectés)
  quests:{ day:null, list:[] },
  stats:{ reviews:0, quizzes:0, sessions:0, correct:0, answered:0 },
  settings:{ showTr:true, rate:0.85 },
};
let state = load();
function load(){
  try{ const s=JSON.parse(localStorage.getItem(LS)); if(s) return Object.assign(structuredClone(DEFAULT), s, {settings:Object.assign({},DEFAULT.settings,s.settings||{})}); }catch(e){}
  return structuredClone(DEFAULT);
}
function save(){ localStorage.setItem(LS, JSON.stringify(state)); }

/* ---------- XP / Streak / Toast ---------- */
function addXP(n, why){
  const before=levelInfo(state.xp).niveau;
  state.xp+=n; save();
  const after=levelInfo(state.xp).niveau;
  toast(`+${n} XP${why?" · "+why:""}`);
  if(after>before){ setTimeout(()=>toast(`🚀 Niveau ${after} — ${levelInfo(state.xp).titre.fr} !`,2600), 700); }
  refreshHeader();
}
function checkStreak(){
  const t=todayStr();
  if(state.lastDay===t) return;
  const y=new Date(Date.now()-864e5).toISOString().slice(0,10);
  if(state.lastDay===y) state.streak+=1;
  else if(state.lastDay!==t) state.streak=1;
  state.lastDay=t;
  state.bestStreak=Math.max(state.bestStreak||0, state.streak);
  ensureQuests();
  save();
}
let toastT;
function toast(msg, ms=1800){
  let t=$("#toast");
  if(!t){ t=document.createElement("div"); t.id="toast"; document.body.appendChild(t); }
  t.textContent=msg; t.classList.add("show");
  clearTimeout(toastT); toastT=setTimeout(()=>t.classList.remove("show"), ms);
}

/* ---------- Audio (Web Speech API, ru-RU) ---------- */
let ruVoice=null;
function pickVoice(){
  const vs=speechSynthesis.getVoices();
  ruVoice = vs.find(v=>/ru[-_]RU/i.test(v.lang)) || vs.find(v=>/^ru/i.test(v.lang)) || null;
}
if("speechSynthesis" in window){ pickVoice(); speechSynthesis.onvoiceschanged=pickVoice; }
function speak(text, rate){
  if(!("speechSynthesis" in window)){ toast("🔇 Synthèse vocale indisponible"); return; }
  try{
    speechSynthesis.cancel();
    const u=new SpeechSynthesisUtterance(text.replace(/[´′″]/g,""));
    u.lang="ru-RU"; u.rate=rate||state.settings.rate; u.pitch=1;
    if(ruVoice) u.voice=ruVoice;
    speechSynthesis.speak(u);
  }catch(e){}
}
function speakBtn(text){ return `<button class="spk" data-say="${esc(text)}" aria-label="Écouter">🔊</button>`; }

/* ---------- SM-2 (répétition espacée) ---------- */
function cardKey(w){ return w.ru; }
function addToDeck(w){
  const k=cardKey(w);
  if(state.deck[k]) return false;
  state.deck[k]={ru:w.ru,tr:w.tr,fr:w.fr, ef:2.5, interval:0, reps:0, due:todayStr(), lapses:0};
  return true;
}
function dueCards(){
  const t=todayStr();
  return Object.values(state.deck).filter(c=>c.due<=t);
}
function grade(card, q){ // q: 0 (raté) .. 5 (parfait)
  if(q<3){ card.reps=0; card.interval=1; card.lapses=(card.lapses||0)+1; }
  else{
    card.ef = Math.max(1.3, card.ef + (0.1 - (5-q)*(0.08+(5-q)*0.02)));
    card.reps+=1;
    card.interval = card.reps===1?1 : card.reps===2?3 : Math.round(card.interval*card.ef);
  }
  const d=new Date(); d.setDate(d.getDate()+card.interval);
  card.due=d.toISOString().slice(0,10);
  state.stats.reviews++; save();
}

/* ---------- Quêtes du jour ---------- */
const QUEST_POOL = [
  {id:"letters3", txt:"Étudier 3 lettres", goal:3, xp:30, prog:()=>dailyProg.letters},
  {id:"review5",  txt:"Réviser 5 mots",    goal:5, xp:30, prog:()=>dailyProg.reviews},
  {id:"quiz1",    txt:"Réussir 1 quiz",    goal:1, xp:25, prog:()=>dailyProg.quizzes},
  {id:"session",  txt:"Faire la Séance du jour", goal:1, xp:50, prog:()=>dailyProg.sessions},
  {id:"words4",   txt:"Apprendre 4 mots neufs", goal:4, xp:30, prog:()=>dailyProg.newWords},
];
let dailyProg = {letters:0,reviews:0,quizzes:0,sessions:0,newWords:0};
function ensureQuests(){
  const t=todayStr();
  if(state.quests.day!==t){
    state.quests={ day:t, list: shuffle(QUEST_POOL).slice(0,4).map(q=>({id:q.id,done:false})) };
    dailyProg={letters:0,reviews:0,quizzes:0,sessions:0,newWords:0};
    save();
  }
}
function bumpQuest(kind, n=1){
  dailyProg[kind]=(dailyProg[kind]||0)+n;
  state.quests.list.forEach(q=>{
    const def=QUEST_POOL.find(x=>x.id===q.id);
    if(def && !q.done && def.prog()>=def.goal){ q.done=true; addXP(def.xp,"quête !"); }
  });
  save();
  if($("#tab-home.active")) renderHome();
}

/* ============================================================
   NAVIGATION & SHELL
   ============================================================ */
const TABS=[
  {id:"home",  ic:"🛰️", lbl:"Accueil"},
  {id:"alpha", ic:"🔤", lbl:"Alphabet"},
  {id:"cours", ic:"📖", lbl:"Cours"},
  {id:"lex",   ic:"💬", lbl:"Lexique"},
  {id:"exos",  ic:"🎯", lbl:"Exos"},
];
let curTab="home";
function go(tab){ curTab=tab; render(); window.scrollTo(0,0); }
function render(){
  $("#nav").innerHTML = TABS.map(t=>
    `<button class="navbtn ${t.id===curTab?'active':''}" id="tab-${t.id}" data-go="${t.id}">
       <span class="nic">${t.ic}</span><span class="nlb">${t.lbl}</span></button>`).join("");
  const v=$("#view");
  if(curTab==="home")  renderHome();
  if(curTab==="alpha") renderAlpha();
  if(curTab==="cours") renderCours();
  if(curTab==="lex")   renderLex();
  if(curTab==="exos")  renderExos();
}
function refreshHeader(){
  const li=levelInfo(state.xp);
  const h=$("#hdr"); if(!h) return;
  h.innerHTML=`
    <div class="hleft">
      <div class="logo">СПУТНИК</div>
      <div class="sub">apprendre le russe · niveau ${li.niveau} — ${li.titre.fr}</div>
    </div>
    <div class="hright">
      <div class="streak" title="Série de jours">🔥 ${state.streak}</div>
      <div class="xp">${state.xp} XP</div>
    </div>`;
}

/* ============================================================
   VUE — ACCUEIL
   ============================================================ */
function renderHome(){
  ensureQuests();
  const li=levelInfo(state.xp);
  const due=dueCards().length;
  const seen=Object.keys(state.seenLetters).length;
  const mast=Object.keys(state.masteredLetters).length;
  const acc = state.stats.answered? Math.round(state.stats.correct/state.stats.answered*100):0;

  const quests = state.quests.list.map(q=>{
    const def=QUEST_POOL.find(x=>x.id===q.id);
    const p=Math.min(def.prog(),def.goal);
    return `<div class="quest ${q.done?'qdone':''}">
      <span class="qcheck">${q.done?'✅':'⬜'}</span>
      <span class="qtxt">${def.txt}</span>
      <span class="qbar"><i style="width:${p/def.goal*100}%"></i></span>
      <span class="qxp">+${def.xp}</span>
    </div>`;
  }).join("");

  $("#view").innerHTML=`
    <div class="hero">
      <div class="hero-title">Séance du jour</div>
      <p class="hero-sub">10 min guidées : révision, sons, nouveaux mots, quiz. Le meilleur moyen d'avancer chaque jour.</p>
      <button class="big-cta" data-act="session">▶ Lancer la séance ${state.stats.sessions?`<span class="cta-note">déjà ${state.stats.sessions}×</span>`:""}</button>
    </div>

    <div class="lvlcard">
      <div class="lvlrow"><b>Niveau ${li.niveau} — ${li.titre.fr}</b><span>${li.next?`${li.toNext} XP → ${li.next.fr}`:"niveau max 🏆"}</span></div>
      <div class="pbar"><i style="width:${li.pct}%"></i></div>
    </div>

    <div class="grid2">
      <div class="stat"><div class="snum">${seen}/33</div><div class="slab">lettres vues</div></div>
      <div class="stat"><div class="snum">${mast}/33</div><div class="slab">lettres maîtrisées</div></div>
      <div class="stat ${due?'hot':''}"><div class="snum">${due}</div><div class="slab">mots à réviser</div></div>
      <div class="stat"><div class="snum">${acc}%</div><div class="slab">de réussite</div></div>
    </div>

    <div class="card">
      <div class="card-h">🎯 Quêtes du jour</div>
      <div class="quests">${quests}</div>
    </div>

    <div class="card">
      <div class="card-h">⚡ Accès rapide</div>
      <div class="quicks">
        <button class="quick" data-act="review">🔁 Réviser<small>${due} dus</small></button>
        <button class="quick" data-go="alpha">🔤 Alphabet<small>${seen}/33</small></button>
        <button class="quick" data-act="quizalpha">🎯 Quiz lettres<small>test</small></button>
        <button class="quick" data-go="lex">💬 Mots & phrases<small>parcourir</small></button>
      </div>
    </div>

    ${state.bestStreak>1?`<p class="foot">Meilleure série : 🔥 ${state.bestStreak} jours. ${state.streak<state.bestStreak?"Reviens demain pour ne rien lâcher.":"Tu es sur ton record — tiens bon."}</p>`:`<p class="foot">Reviens chaque jour : la régularité bat l'intensité. Даваи́ !</p>`}
  `;
}

/* ============================================================
   VUE — ALPHABET
   ============================================================ */
function renderAlpha(){
  const seen=Object.keys(state.seenLetters).length;
  let html=`<div class="page-h"><h2>Азбука · L'alphabet</h2><p class="lead">33 lettres, regroupées par logique d'apprentissage — pas par ordre alphabétique. Touche une lettre pour le son et un exemple.</p>
    <div class="progwrap"><div class="pbar big"><i style="width:${seen/33*100}%"></i></div><span>${seen}/33 vues</span></div></div>`;

  DATA.alphabetGroups.forEach(g=>{
    const letters=DATA.alphabet.filter(l=>l.group===g.id);
    html+=`<div class="card">
      <div class="grp-h"><span class="grp-n">${g.id}</span><div><b>${g.titre}</b><small>${g.desc}</small></div></div>
      <div class="letters">
        ${letters.map(l=>{
          const idx=DATA.alphabet.indexOf(l);
          const cl=state.masteredLetters[l.up]?'lok':state.seenLetters[l.up]?'lseen':'';
          return `<button class="lcell ${cl}" data-letter="${idx}">
            <span class="lch">${l.up} ${l.low}</span>
            <span class="ltr">${l.tr}</span>
            ${l.piege?'<span class="lwarn">!</span>':''}
          </button>`;
        }).join("")}
      </div>
      <button class="ghost full" data-act="quizgroup" data-grp="${g.id}">🎯 Tester ce groupe</button>
    </div>`;
  });
  $("#view").innerHTML=html;
}

function openLetter(idx){
  const l=DATA.alphabet[idx];
  if(!state.seenLetters[l.up]){ state.seenLetters[l.up]=true; save(); bumpQuest("letters"); addXP(5,"nouvelle lettre"); }
  const modal=`
    <div class="lmodal">
      <div class="lbig">${l.up} ${l.low}</div>
      <div class="lname">« ${l.name} »</div>
      <div class="lson">${l.son}</div>
      ${l.piege?`<div class="piege">⚠️ ${l.piege}</div>`:""}
      <div class="lex" data-say="${esc(l.ex)}">
        <span class="lex-ru">${l.ex}</span>
        <span class="lex-fr">${l.exFr} · <i>${l.exTr}</i></span>
        <span class="lex-spk">🔊</span>
      </div>
      <div class="lbtns">
        <button class="ghost" data-say="${esc(l.ex)}">🔊 Écouter</button>
        <button class="primary" data-act="closemodal">Compris</button>
      </div>
    </div>`;
  openModal(modal);
  speak(l.ex);
}

/* ============================================================
   VUE — COURS (prononciation + grammaire)
   ============================================================ */
function renderCours(){
  let html=`<div class="page-h"><h2>Cours</h2><p class="lead">D'abord les règles de prononciation qui piègent tout le monde, puis la grammaire, du plus simple aux 6 cas.</p></div>`;

  html+=`<div class="card"><div class="card-h">🗣️ Prononciation — les 6 règles d'or</div>`;
  DATA.pronunciation.forEach(p=>{
    html+=`<details class="acc"><summary>${p.icon} ${p.titre}</summary>
      <div class="acc-body">
        <p>${mdBold(p.corps)}</p>
        <div class="exlist">${p.exemples.map(e=>exRow(e)).join("")}</div>
      </div></details>`;
  });
  html+=`</div>`;

  const byLvl={};
  DATA.grammar.forEach(g=>{ (byLvl[g.niveau]=byLvl[g.niveau]||[]).push(g); });
  Object.keys(byLvl).forEach(lvl=>{
    html+=`<div class="card"><div class="card-h">📘 Grammaire · ${lvl}</div>`;
    byLvl[lvl].forEach(g=>{
      html+=`<details class="acc"><summary>${g.icon} ${g.titre}</summary><div class="acc-body">${g.blocks.map(renderBlock).join("")}</div></details>`;
    });
    html+=`</div>`;
  });
  $("#view").innerHTML=html;
}
function renderBlock(b){
  if(b.type==="p")   return `<p>${mdBold(b.texte)}</p>`;
  if(b.type==="tip") return `<div class="tip">💡 ${mdBold(b.texte)}</div>`;
  if(b.type==="exs") return `<div class="exlist">${b.items.map(exRow).join("")}</div>`;
  if(b.type==="table") return `<div class="tblwrap"><table><thead><tr>${b.head.map(h=>`<th>${h}</th>`).join("")}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map((c,i)=>`<td>${i===0?"<b>"+c+"</b>":c}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
  return "";
}
function exRow(e){
  return `<div class="exrow" data-say="${esc(e.ru)}">
    <span class="ex-ru">${e.ru} <span class="mini-spk">🔊</span></span>
    <span class="ex-tr">${e.tr}</span>
    <span class="ex-fr">${e.fr}</span></div>`;
}
function mdBold(s){ return esc(s).replace(/\*\*(.+?)\*\*/g,"<b>$1</b>"); }

/* ============================================================
   VUE — LEXIQUE (vocab + phrases)
   ============================================================ */
let lexMode="vocab";
function renderLex(){
  let html=`<div class="page-h"><h2>Lexique</h2>
    <div class="seg"><button class="${lexMode==='vocab'?'on':''}" data-lex="vocab">Mots par thème</button><button class="${lexMode==='phrases'?'on':''}" data-lex="phrases">Phrases utiles</button></div></div>`;

  if(lexMode==="vocab"){
    DATA.vocab.forEach(th=>{
      const n=th.mots.filter(m=>state.deck[m.ru]).length;
      html+=`<div class="card">
        <div class="lex-h"><b>${th.icon} ${th.titre}</b>
          <button class="ghost sm" data-act="addtheme" data-theme="${th.id}">+ tout réviser</button></div>
        <div class="wlist">${th.mots.map(m=>wordRow(m)).join("")}</div>
        ${n?`<div class="lex-note">${n}/${th.mots.length} dans ta révision</div>`:""}
      </div>`;
    });
  } else {
    DATA.phrases.forEach(s=>{
      html+=`<div class="card"><div class="lex-h"><b>${s.icon} ${s.titre}</b></div>
        <div class="wlist">${s.items.map(m=>wordRow(m,true)).join("")}</div></div>`;
    });
  }
  $("#view").innerHTML=html;
}
function wordRow(m, phrase=false){
  const inDeck=!!state.deck[m.ru];
  return `<div class="wrow" data-say="${esc(m.ru)}">
    <button class="wspk" data-say="${esc(m.ru)}">🔊</button>
    <div class="wmid">
      <div class="wru">${m.ru}</div>
      <div class="wtr">${state.settings.showTr?m.tr:""}</div>
    </div>
    <div class="wfr">${m.fr}</div>
    ${phrase?"":`<button class="wadd ${inDeck?'in':''}" data-add="${esc(m.ru)}" data-tr="${esc(m.tr)}" data-fr="${esc(m.fr)}" title="Réviser">${inDeck?'✓':'＋'}</button>`}
  </div>`;
}

/* ============================================================
   VUE — EXOS (hub)
   ============================================================ */
function renderExos(){
  const due=dueCards().length;
  $("#view").innerHTML=`<div class="page-h"><h2>Exercices</h2><p class="lead">Le russe se muscle par la pratique active. Choisis ton terrain.</p></div>
    <div class="exgrid">
      <button class="excard" data-act="review"><span class="exic">🔁</span><b>Révision espacée</b><small>${due} mot(s) à revoir aujourd'hui</small></button>
      <button class="excard" data-act="quizalpha"><span class="exic">🔤</span><b>Reconnaître les lettres</b><small>lettre → son, chrono</small></button>
      <button class="excard" data-act="translit"><span class="exic">⌨️</span><b>Écrire en cyrillique</b><small>clavier russe intégré</small></button>
      <button class="excard" data-act="dictee"><span class="exic">👂</span><b>Dictée sonore</b><small>écoute puis écris</small></button>
      <button class="excard" data-act="match"><span class="exic">🔗</span><b>Associer mot ↔ sens</b><small>vocabulaire</small></button>
    </div>`;
}

/* ============================================================
   MOTEUR D'ÉCRAN (exos plein écran + séance)
   ============================================================ */
function screen(html){ // ouvre un écran plein qui remplace #view (avec bouton retour géré par appelant)
  $("#view").innerHTML=html; window.scrollTo(0,0);
}
function backBar(title){ return `<div class="xbar"><button class="xback" data-act="rerender">✕</button><b>${title}</b><span></span></div>`; }

/* ---------- Quiz alphabet ---------- */
let QA=null;
function startQuizAlpha(pool){
  const letters = pool || DATA.alphabet.filter(l=>!["Ъ","Ь"].includes(l.up));
  QA={ q:0, n:Math.min(10,letters.length), score:0, pool:shuffle(letters) };
  nextQuizAlpha();
}
function nextQuizAlpha(){
  if(QA.q>=QA.n){ finishQuizAlpha(); return; }
  const l=QA.pool[QA.q];
  const distract = shuffle(DATA.alphabet.filter(x=>x.up!==l.up && x.tr!==l.tr)).slice(0,3);
  const opts=shuffle([l,...distract]);
  screen(`${backBar("Reconnaître les lettres")}
    <div class="quiz">
      <div class="qprog">Question ${QA.q+1}/${QA.n} · score ${QA.score}</div>
      <div class="qbig">${l.up} ${l.low}</div>
      <div class="qask">Quel est son son ?</div>
      <div class="qopts">
        ${opts.map(o=>`<button class="qopt" data-qa="${esc(o.tr)}" data-ok="${o.tr===l.tr}"><b>${o.tr}</b><small>${o.son.split("(")[0]}</small></button>`).join("")}
      </div>
    </div>`);
}
function answerQuizAlpha(btn){
  const ok=btn.dataset.ok==="true";
  const l=QA.pool[QA.q];
  state.stats.answered++; if(ok){state.stats.correct++; QA.score++; state.masteredLetters[l.up]=true;} save();
  $$(".qopt").forEach(b=>{ b.disabled=true; if(b.dataset.ok==="true")b.classList.add("good"); });
  if(!ok) btn.classList.add("bad");
  speak(l.ex);
  setTimeout(()=>{ QA.q++; nextQuizAlpha(); }, ok?650:1300);
}
function finishQuizAlpha(){
  const pct=Math.round(QA.score/QA.n*100);
  if(pct>=70) bumpQuest("quizzes");
  addXP(QA.score*4,"quiz lettres");
  screen(`${backBar("Résultat")}
    <div class="result">
      <div class="rbig">${pct>=90?"🏆":pct>=70?"👍":"💪"}</div>
      <div class="rscore">${QA.score}/${QA.n}</div>
      <p>${pct>=90?"Sans faute ou presque. Tu lis le cyrillique.":pct>=70?"Solide. Encore un ou deux passages et c'est acquis.":"Le cyrillique se grave par la répétition. On y retourne ?"}</p>
      <button class="primary" data-act="quizalpha">Rejouer</button>
      <button class="ghost" data-act="rerender">Terminer</button>
    </div>`);
}

/* ---------- Révision SM-2 ---------- */
let RV=null;
function startReview(cards){
  const due = cards || dueCards();
  if(!due.length){ screen(`${backBar("Révision")}<div class="result"><div class="rbig">✨</div><p>Rien à réviser pour aujourd'hui. Ajoute des mots depuis le Lexique, ou reviens demain.</p><button class="ghost" data-go="lex">Aller au Lexique</button><button class="ghost" data-act="rerender">Retour</button></div>`); return; }
  RV={ queue:shuffle(due), i:0, done:0, right:0, flip:false };
  showCard();
}
function showCard(){
  if(RV.i>=RV.queue.length){ finishReview(); return; }
  const c=RV.queue[RV.i];
  screen(`${backBar("Révision espacée")}
    <div class="flash">
      <div class="fprog">${RV.i+1}/${RV.queue.length}</div>
      <div class="fcard" data-act="flip">
        <div class="fru">${c.ru} <button class="mini-spk" data-say="${esc(c.ru)}">🔊</button></div>
        ${RV.flip?`<div class="ftr">${c.tr}</div><div class="ffr">${c.fr}</div>`:`<div class="fhint">Touche pour retourner</div>`}
      </div>
      ${RV.flip?`
      <div class="grades">
        <button class="grade g0" data-grade="0">Raté</button>
        <button class="grade g3" data-grade="3">Dur</button>
        <button class="grade g4" data-grade="4">Bien</button>
        <button class="grade g5" data-grade="5">Facile</button>
      </div>`:`<button class="primary full" data-act="flip">Voir la réponse</button>`}
    </div>`);
  if(!RV.flip) speak(c.ru);
}
function gradeCard(q){
  const c=RV.queue[RV.i];
  grade(c,q);
  state.stats.answered++; if(q>=3){state.stats.correct++; RV.right++;} save();
  bumpQuest("reviews");
  RV.i++; RV.flip=false; showCard();
}
function finishReview(){
  addXP(RV.queue.length*3 + RV.right*2, "révision");
  screen(`${backBar("Révision terminée")}
    <div class="result"><div class="rbig">🧠</div>
      <div class="rscore">${RV.right}/${RV.queue.length}</div>
      <p>Mémoire consolidée. Les mots ratés reviendront vite, les autres s'espaceront. C'est la magie du SM-2.</p>
      <button class="ghost" data-act="rerender">Terminer</button>
    </div>`);
}

/* ---------- Écrire en cyrillique (translittération inverse) ---------- */
let TR=null;
function startTranslit(){
  const pool = shuffle(DATA.vocab.flatMap(t=>t.mots)).slice(0,8);
  TR={ pool, i:0, right:0 };
  showTranslit();
}
function showTranslit(){
  if(TR.i>=TR.pool.length){
    addXP(TR.right*4,"écriture"); if(TR.right>=Math.ceil(TR.pool.length*0.6)) bumpQuest("quizzes");
    screen(`${backBar("Écriture")}<div class="result"><div class="rbig">⌨️</div><div class="rscore">${TR.right}/${TR.pool.length}</div><p>Écrire de mémoire, c'est le vrai test. Bravo pour l'effort.</p><button class="primary" data-act="translit">Rejouer</button><button class="ghost" data-act="rerender">Terminer</button></div>`); return; }
  const w=TR.pool[TR.i];
  screen(`${backBar("Écrire en cyrillique")}
    <div class="translit">
      <div class="fprog">${TR.i+1}/${TR.pool.length}</div>
      <div class="tprompt"><div class="tfr">${w.fr}</div><div class="ttr">[${w.tr}]</div></div>
      <input id="trin" class="tin" autocomplete="off" autocapitalize="off" spellcheck="false" readonly placeholder="…">
      <div id="trfeed" class="tfeed"></div>
      ${cyrKeyboard()}
      <button class="primary full" data-act="trcheck">Vérifier</button>
    </div>`);
  bindKeyboard("trin");
}
function checkTranslit(){
  const w=TR.pool[TR.i];
  const val=($("#trin").value||"").trim().toLowerCase().replace(/ё/g,"е");
  const target=w.ru.toLowerCase().replace(/ё/g,"е");
  const ok=val===target;
  state.stats.answered++; if(ok){state.stats.correct++; TR.right++;} save();
  const f=$("#trfeed");
  f.innerHTML = ok? `<span class="ok">✅ ${w.ru}</span>` : `<span class="ko">❌ Réponse : <b>${w.ru}</b></span>`;
  speak(w.ru);
  setTimeout(()=>{ TR.i++; showTranslit(); }, ok?800:1600);
}

/* ---------- Dictée sonore ---------- */
let DI=null;
function startDictee(){
  const pool=shuffle(DATA.vocab.flatMap(t=>t.mots).filter(m=>m.ru.length<=9)).slice(0,8);
  DI={pool,i:0,right:0}; showDictee();
}
function showDictee(){
  if(DI.i>=DI.pool.length){ addXP(DI.right*5,"dictée"); if(DI.right>=Math.ceil(DI.pool.length*0.6)) bumpQuest("quizzes");
    screen(`${backBar("Dictée")}<div class="result"><div class="rbig">👂</div><div class="rscore">${DI.right}/${DI.pool.length}</div><p>Entendre puis transcrire : c'est comme ça qu'on décolle à l'oral.</p><button class="primary" data-act="dictee">Rejouer</button><button class="ghost" data-act="rerender">Terminer</button></div>`); return; }
  const w=DI.pool[DI.i];
  screen(`${backBar("Dictée sonore")}
    <div class="translit">
      <div class="fprog">${DI.i+1}/${DI.pool.length}</div>
      <button class="hearbig" data-say="${esc(w.ru)}">🔊 Réécouter</button>
      <div class="dhint">${w.fr}</div>
      <input id="trin" class="tin" readonly placeholder="écris ce que tu entends">
      <div id="trfeed" class="tfeed"></div>
      ${cyrKeyboard()}
      <button class="primary full" data-act="dicheck">Vérifier</button>
    </div>`);
  bindKeyboard("trin");
  setTimeout(()=>speak(w.ru), 300);
}
function checkDictee(){
  const w=DI.pool[DI.i];
  const val=($("#trin").value||"").trim().toLowerCase().replace(/ё/g,"е");
  const ok=val===w.ru.toLowerCase().replace(/ё/g,"е");
  state.stats.answered++; if(ok){state.stats.correct++; DI.right++;} save();
  $("#trfeed").innerHTML= ok?`<span class="ok">✅ ${w.ru} — ${w.fr}</span>`:`<span class="ko">❌ C'était <b>${w.ru}</b></span>`;
  setTimeout(()=>{ DI.i++; showDictee(); }, ok?800:1700);
}

/* ---------- Associer mot ↔ sens ---------- */
let MA=null;
function startMatch(){
  const set=shuffle(DATA.vocab.flatMap(t=>t.mots)).slice(0,5);
  MA={ left:shuffle(set), right:shuffle(set), sel:null, done:0, total:set.length };
  showMatch();
}
function showMatch(){
  screen(`${backBar("Associer")}
    <div class="match">
      <p class="matchhint">Relie chaque mot russe à son sens.</p>
      <div class="mcols">
        <div class="mcol">${MA.left.map((w,i)=>`<button class="mcell mru ${MA.doneKeys&&MA.doneKeys.has(w.ru)?'mdone':''}" data-mru="${esc(w.ru)}" data-say="${esc(w.ru)}">${w.ru}</button>`).join("")}</div>
        <div class="mcol">${MA.right.map((w,i)=>`<button class="mcell mfr ${MA.doneKeys&&MA.doneKeys.has(w.ru)?'mdone':''}" data-mfr="${esc(w.ru)}">${w.fr}</button>`).join("")}</div>
      </div>
    </div>`);
}
function matchTap(btn){
  MA.doneKeys=MA.doneKeys||new Set();
  if(btn.dataset.mru!==undefined){
    speak(btn.dataset.mru);
    $$(".mru").forEach(b=>b.classList.remove("sel")); btn.classList.add("sel"); MA.sel=btn.dataset.mru; return;
  }
  if(btn.dataset.mfr!==undefined && MA.sel!=null){
    if(btn.dataset.mfr===MA.sel){
      MA.doneKeys.add(MA.sel); MA.sel=null;
      state.stats.answered++; state.stats.correct++; save();
      if(MA.doneKeys.size>=MA.total){ addXP(MA.total*4,"associations"); bumpQuest("quizzes");
        setTimeout(()=>screen(`${backBar("Bravo")}<div class="result"><div class="rbig">🔗</div><p>Toutes les paires reliées.</p><button class="primary" data-act="match">Rejouer</button><button class="ghost" data-act="rerender">Terminer</button></div>`),400);
      } else showMatch();
    } else { toast("❌ pas cette paire"); state.stats.answered++; save(); const b=$(`.mfr[data-mfr="${CSS.escape(btn.dataset.mfr)}"]`); if(b){b.classList.add("bad"); setTimeout(()=>b.classList.remove("bad"),500);} }
  }
}

/* ============================================================
   SÉANCE DU JOUR
   ============================================================ */
let SE=null;
function startSession(){
  const queue=[];
  // 1) échauffement : 3 lettres pas encore maîtrisées (ou aléatoires)
  const lettersPool = DATA.alphabet.filter(l=>!["Ъ","Ь"].includes(l.up));
  const warm = shuffle(lettersPool.filter(l=>!state.masteredLetters[l.up])).slice(0,3);
  (warm.length?warm:shuffle(lettersPool).slice(0,3)).forEach(l=>queue.push({k:"letter",l}));
  // 2) révisions dues (max 6)
  dueCards().slice(0,6).forEach(c=>queue.push({k:"review",c}));
  // 3) nouveaux mots : 4 depuis un thème pas encore appris
  const freshTheme = DATA.vocab.find(t=>!state.learnedThemes[t.id]) || rnd(DATA.vocab);
  const newWords = shuffle(freshTheme.mots).slice(0,4);
  newWords.forEach(m=>queue.push({k:"newword",m,theme:freshTheme.id}));
  // 4) quiz éclair : 4 lettres
  shuffle(lettersPool).slice(0,4).forEach(l=>queue.push({k:"quiz",l}));
  SE={ queue, i:0, xp:0, right:0, total:0 };
  stepSession();
}
function stepSession(){
  if(!SE) return;
  const pct=Math.round(SE.i/SE.queue.length*100);
  if(SE.i>=SE.queue.length){ finishSession(); return; }
  const it=SE.queue[SE.i];
  const bar=`<div class="sbar"><i style="width:${pct}%"></i></div>`;
  const head=`<div class="xbar"><button class="xback" data-act="quitsession">✕</button><b>Séance du jour</b><span class="sstep">${SE.i+1}/${SE.queue.length}</span></div>${bar}`;

  if(it.k==="letter"){
    if(!state.seenLetters[it.l.up]){ state.seenLetters[it.l.up]=true; save(); bumpQuest("letters"); }
    screen(`${head}<div class="sess">
      <div class="stag">Échauffement · la lettre</div>
      <div class="lbig">${it.l.up} ${it.l.low}</div>
      <div class="lname">« ${it.l.name} » — ${it.l.son}</div>
      <div class="lex" data-say="${esc(it.l.ex)}"><span class="lex-ru">${it.l.ex}</span><span class="lex-fr">${it.l.exFr} · <i>${it.l.exTr}</i></span><span class="lex-spk">🔊</span></div>
      <button class="primary full" data-act="snext">Continuer</button>
    </div>`);
    speak(it.l.ex);
  }
  else if(it.k==="review"){
    SE._flip=false;
    renderSessReview(it,head);
  }
  else if(it.k==="newword"){
    if(!addToDeck(it.m)){} else { bumpQuest("newWords"); }
    if(!state.learnedThemes[it.theme]){ state.learnedThemes[it.theme]=true; save(); }
    screen(`${head}<div class="sess">
      <div class="stag">Nouveau mot · ajouté à ta révision</div>
      <div class="fru big">${it.m.ru} <button class="mini-spk" data-say="${esc(it.m.ru)}">🔊</button></div>
      <div class="ftr">${it.m.tr}</div><div class="ffr">${it.m.fr}</div>
      <button class="primary full" data-act="snext">Continuer</button>
    </div>`);
    speak(it.m.ru);
  }
  else if(it.k==="quiz"){
    const l=it.l;
    const opts=shuffle([l,...shuffle(DATA.alphabet.filter(x=>x.up!==l.up&&x.tr!==l.tr)).slice(0,3)]);
    screen(`${head}<div class="sess">
      <div class="stag">Quiz éclair</div>
      <div class="qbig">${l.up} ${l.low}</div>
      <div class="qask">Son ?</div>
      <div class="qopts">${opts.map(o=>`<button class="qopt" data-sq="${o.tr===l.tr}" data-l="${DATA.alphabet.indexOf(l)}"><b>${o.tr}</b></button>`).join("")}</div>
    </div>`);
  }
}
function renderSessReview(it,head){
  const c=it.c;
  screen(`${head}<div class="sess">
    <div class="stag">Révision</div>
    <div class="fcard" data-act="sflip">
      <div class="fru">${c.ru} <button class="mini-spk" data-say="${esc(c.ru)}">🔊</button></div>
      ${SE._flip?`<div class="ftr">${c.tr}</div><div class="ffr">${c.fr}</div>`:`<div class="fhint">Touche pour la réponse</div>`}
    </div>
    ${SE._flip?`<div class="grades"><button class="grade g0" data-sgrade="0">Raté</button><button class="grade g3" data-sgrade="3">Dur</button><button class="grade g4" data-sgrade="4">Bien</button><button class="grade g5" data-sgrade="5">Facile</button></div>`:`<button class="primary full" data-act="sflip">Voir</button>`}
  </div>`);
  if(!SE._flip) speak(c.ru);
}
function sessAnswerQuiz(btn){
  const ok=btn.dataset.sq==="true";
  const l=DATA.alphabet[+btn.dataset.l];
  SE.total++; state.stats.answered++;
  if(ok){ SE.right++; state.stats.correct++; state.masteredLetters[l.up]=true; }
  save();
  $$(".qopt").forEach(b=>{ b.disabled=true; if(b.dataset.sq==="true")b.classList.add("good"); });
  if(!ok) btn.classList.add("bad");
  speak(l.ex);
  setTimeout(()=>{ SE.i++; stepSession(); }, ok?600:1200);
}
function finishSession(){
  state.stats.sessions++; bumpQuest("sessions");
  const gained=30 + SE.right*4;
  addXP(gained,"séance du jour");
  const acc=SE.total?Math.round(SE.right/SE.total*100):100;
  SE=null;
  screen(`<div class="xbar"><span></span><b>Séance bouclée</b><span></span></div>
    <div class="result closer">
      <div class="rbig">🛰️</div>
      <div class="rscore">+${gained} XP</div>
      <p class="closer-msg">${acc>=80?"Séance propre. Le cyrillique rentre, le vocab se dépose. ":"Séance faite — et c'est TOUT ce qui compte aujourd'hui. "}Reviens demain : ta série est à 🔥 ${state.streak}.</p>
      <p class="closer-cmd">Maintenant ferme l'app et va vivre. Даваи́, до за́втра.</p>
      <button class="primary" data-act="rerender">Terminer</button>
    </div>`);
}

/* ============================================================
   CLAVIER CYRILLIQUE
   ============================================================ */
function cyrKeyboard(){
  const rows=DATA.keyboardRows.map(r=>`<div class="krow">${r.map(k=>`<button class="key" data-k="${k}">${k}</button>`).join("")}</div>`).join("");
  return `<div class="kbd">${rows}<div class="krow"><button class="key wide" data-k=" ">espace</button><button class="key del" data-act="kbksp">⌫</button></div></div>`;
}
function bindKeyboard(inputId){ window._kbTarget=inputId; }
function kbType(ch){
  const t=$("#"+window._kbTarget); if(!t) return;
  t.value+=ch;
}
function kbBksp(){ const t=$("#"+window._kbTarget); if(t) t.value=t.value.slice(0,-1); }

/* ============================================================
   MODALE
   ============================================================ */
function openModal(inner){
  let m=$("#modal");
  if(!m){ m=document.createElement("div"); m.id="modal"; document.body.appendChild(m); }
  m.innerHTML=`<div class="modal-back" data-act="closemodal"></div><div class="modal-box">${inner}</div>`;
  m.classList.add("show");
}
function closeModal(){ const m=$("#modal"); if(m) m.classList.remove("show"); }

/* ============================================================
   ROUTAGE DES CLICS (délégation globale)
   ============================================================ */
document.addEventListener("click", e=>{
  const t=e.target.closest("[data-go],[data-act],[data-letter],[data-say],[data-add],[data-qa],[data-grade],[data-grp],[data-lex],[data-theme],[data-k],[data-sgrade],[data-sq],[data-mru],[data-mfr]");
  if(!t) return;

  // audio (ne bloque pas les autres actions posées sur le même noeud)
  if(t.dataset.say!==undefined && !("go" in t.dataset) && !("act" in t.dataset && ["flip","sflip"].includes(t.dataset.act))){
    // laisser passer si c'est aussi un bouton d'action lettre etc. — on parle quand même
  }

  if(t.dataset.go){ go(t.dataset.go); return; }
  if(t.dataset.letter!==undefined){ openLetter(+t.dataset.letter); return; }
  if(t.dataset.grp){ startQuizAlpha(DATA.alphabet.filter(l=>l.group==+t.dataset.grp && !["Ъ","Ь"].includes(l.up))); return; }
  if(t.dataset.lex){ lexMode=t.dataset.lex; renderLex(); return; }
  if(t.dataset.k!==undefined){ kbType(t.dataset.k); return; }
  if(t.dataset.qa!==undefined){ answerQuizAlpha(t); return; }
  if(t.dataset.grade!==undefined){ gradeCard(+t.dataset.grade); return; }
  if(t.dataset.sgrade!==undefined){ grade(SE.queue[SE.i].c,+t.dataset.sgrade); bumpQuest("reviews"); SE.i++; SE._flip=false; stepSession(); return; }
  if(t.dataset.sq!==undefined){ sessAnswerQuiz(t); return; }
  if(t.dataset.mru!==undefined || t.dataset.mfr!==undefined){ matchTap(t); return; }

  if(t.dataset.add!==undefined){
    const added=addToDeck({ru:t.dataset.add,tr:t.dataset.tr,fr:t.dataset.fr});
    if(added){ t.classList.add("in"); t.textContent="✓"; toast("＋ ajouté à la révision"); addXP(2); }
    else toast("déjà dans ta révision");
    return;
  }
  if(t.dataset.theme){
    const th=DATA.vocab.find(x=>x.id===t.dataset.theme); let c=0;
    th.mots.forEach(m=>{ if(addToDeck(m)) c++; });
    save(); toast(c?`＋ ${c} mots ajoutés`:"déjà tous ajoutés"); renderLex(); return;
  }

  if(t.dataset.act){
    switch(t.dataset.act){
      case "session": checkStreak(); startSession(); break;
      case "quitsession": SE=null; go("home"); break;
      case "snext": SE.i++; stepSession(); break;
      case "sflip": SE._flip=true; renderSessReview(SE.queue[SE.i], `<div class="xbar"><button class="xback" data-act="quitsession">✕</button><b>Séance du jour</b><span class="sstep">${SE.i+1}/${SE.queue.length}</span></div><div class="sbar"><i style="width:${Math.round(SE.i/SE.queue.length*100)}%"></i></div>`); break;
      case "review": checkStreak(); startReview(); break;
      case "flip": RV.flip=true; showCard(); break;
      case "quizalpha": checkStreak(); startQuizAlpha(); break;
      case "translit": checkStreak(); startTranslit(); break;
      case "trcheck": checkTranslit(); break;
      case "dictee": checkStreak(); startDictee(); break;
      case "dicheck": checkDictee(); break;
      case "match": checkStreak(); startMatch(); break;
      case "kbksp": kbBksp(); break;
      case "closemodal": closeModal(); break;
      case "rerender": render(); break;
    }
    // audio en plus si le bouton porte aussi data-say
  }
  if(t.dataset.say!==undefined){ speak(t.dataset.say); }
});

/* Réglages (header long-press / bouton) */
function toggleTr(){ state.settings.showTr=!state.settings.showTr; save(); if(curTab==="lex")renderLex(); toast(state.settings.showTr?"Prononciation affichée":"Prononciation masquée"); }

/* ============================================================
   BOOT
   ============================================================ */
function boot(){
  checkStreak();
  refreshHeader();
  render();
  // service worker
  if("serviceWorker" in navigator){ navigator.serviceWorker.register("sw.js").catch(()=>{}); }
}
document.addEventListener("DOMContentLoaded", boot);
