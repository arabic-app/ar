import {LESSONS,CARDS,CARD_MAP,restoreState,createSession,rateCard,validateInput} from './learning.mjs';
import {TEXT,tipFor} from './i18n.mjs';
const $=id=>document.getElementById(id);
const icon=name=>`<svg aria-hidden="true"><use href="#i-${name}"/></svg>`;
const STORAGE='nour.learning.v2';
let storageFailed=false;
let raw=null;
try{raw=localStorage.getItem(STORAGE);}catch{storageFailed=true;}
let state=restoreState(raw);
if(!state.session)state.session=createSession('guided','alphabet',state);
let custom=null,showHint=false,audioToken=0,audioTimer=null,currentUtterance=null,installPrompt=null,offlineReady=false;
const t=key=>TEXT[state.prefs.lang][key]||key;
const lesson=()=>LESSONS.find(l=>l.id===state.session?.lessonId)||LESSONS[0];
const currentCard=()=>custom||CARD_MAP.get(state.session?.ids[state.session.index]);
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));}catch{if(!storageFailed){storageFailed=true;notify(t('savedError'));}}}
function notify(message){$('toast').textContent=message;$('toast').hidden=false;clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('toast').hidden=true,6500);}
function stopAudio(){audioToken++;clearTimeout(audioTimer);if('speechSynthesis'in window)window.speechSynthesis.cancel();currentUtterance=null;$('listenButton').classList.remove('playing');$('audioStatus').textContent='';$('audioStatus').classList.remove('error');$('listenButton').disabled=false;}
function connection(){$('connectionStatus').textContent=!navigator.onLine?t('offline'):offlineReady?t('offlineReady'):'';}
function updateTranslations(){
 document.documentElement.lang=state.prefs.lang;document.documentElement.dir=state.prefs.lang==='ar'?'rtl':'ltr';
 document.title=`Nour — ${t('atelier')}`;
 document.querySelectorAll('[data-t]').forEach(el=>{const key=el.dataset.t;if(['dailyNote','comfortable'].includes(key))el.innerHTML=t(key);else el.textContent=t(key);});
 document.querySelectorAll('[data-label]').forEach(el=>{el.setAttribute('aria-label',t(el.dataset.label));el.title=t(el.dataset.label);});
 document.querySelector('.sidebar').setAttribute('aria-label',t('workspace'));
 document.querySelector('.exercise-panel').setAttribute('aria-label',t('atelier'));
 $('freeModeGroup').setAttribute('aria-label',t('free'));
 $('languageSelect').value=state.prefs.lang;$('fontSelect').value=state.prefs.font;$('trackSelect').value=state.prefs.track;
 $('signsTable').replaceChildren();
 for(const [ar,key]of [['بَ','fatha'],['بِ','kasra'],['بُ','damma'],['بْ','sukun'],['بَّ','shadda'],['بًا بٍ بٌ','tanween'],['بَا بِي بُو','long']]){
  const row=document.createElement('div');row.className='sign-row';const sign=document.createElement('span');sign.lang='ar';sign.dir='rtl';sign.textContent=ar;const text=document.createElement('span');text.textContent=t(key);row.append(sign,text);$('signsTable').append(row);
 }
 connection();
}
function renderNavigation(){
 const kind=state.session.kind;
 document.querySelectorAll('[data-view]').forEach(b=>{b.classList.toggle('active',b.dataset.view===kind);if(b.dataset.view===kind)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');});
 $('breadcrumbTitle').textContent=t(kind);
 $('pageTitle').replaceChildren(document.createTextNode(t(kind==='guided'?'title':kind==='free'?'freeTitle':'reviewTitle')));
 const dot=document.createElement('span');dot.textContent='.';$('pageTitle').append(dot);
 $('pageDescription').textContent=t(kind==='guided'?'description':kind==='free'?'freeDescription':'reviewDescription');
 $('freeControls').hidden=kind!=='free';document.querySelector('.mobile-lesson').hidden=kind!=='guided';
 $('lessonList').replaceChildren();$('lessonSelect').replaceChildren();
 const lang=state.prefs.lang;
 LESSONS.forEach((l,i)=>{
  const cards=CARDS.filter(c=>c.lesson===l.id&&(l.id!=='words'||c.track===state.prefs.track));
  const done=cards.every(c=>state.progress[c.id]==='known');
  const active=kind==='guided'&&l.id===lesson().id;
  const button=document.createElement('button');button.className=`lesson-item${active?' active':''}${done?' done':''}`;button.dataset.lesson=l.id;
  if(active)button.setAttribute('aria-current','step');
  button.innerHTML=`<span class="lesson-number">${done?icon('check'):String(i+1).padStart(2,'0')}</span><span></span>`;button.lastElementChild.textContent=l[lang];$('lessonList').append(button);
  const option=document.createElement('option');option.value=l.id;option.textContent=`${String(i+1).padStart(2,'0')} · ${l[lang]}`;$('lessonSelect').append(option);
 });
 $('lessonSelect').value=lesson().id;
 $('lessonCount').textContent=`${String(LESSONS.indexOf(lesson())+1).padStart(2,'0')} / 09`;
 const known=Object.values(state.progress).filter(v=>v==='known').length;
 const review=Object.values(state.progress).filter(v=>v==='review').length;
 $('knownCount').textContent=known;$('reviewBadge').textContent=review;
 $('globalProgress').style.width=`${known/CARDS.length*100}%`;
 $('progressCaption').textContent=`${known} / ${CARDS.length} ${t('allCards')}`;
 document.querySelectorAll('[data-mode]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.mode===state.prefs.freeMode)));
 const tip=tipFor(custom?(state.prefs.freeMode==='word'?'words':state.prefs.freeMode==='assembly'?'assembly':'alphabet'):currentCard()?.lesson||lesson().id,lang);$('tipTitle').textContent=tip.title;$('tipText').textContent=tip.text;$('tipExample').textContent=tip.example;
 $('speedButton').textContent=state.prefs.slow?'0.75×':'1×';$('speedButton').setAttribute('aria-pressed',String(state.prefs.slow));
}
function renderHint(card){
 $('hintButton').setAttribute('aria-expanded',String(showHint));$('hintButton').querySelector('span').textContent=t(showHint?'hideHint':'showHint');
 $('hintContent').hidden=!showHint;$('hintContent').replaceChildren();
 if(card.name){const name=document.createElement('strong');name.lang='ar';name.textContent=card.name;$('hintContent').append(name,document.createTextNode(`${t('name')} · ${card.roman}`));}
 else if(card.meaning?.[state.prefs.lang]){const meaning=document.createElement('strong');meaning.textContent=card.meaning[state.prefs.lang];$('hintContent').append(meaning,document.createTextNode(t('meaning')));}
 else if(card.roman){const text=document.createElement('strong');text.dir='ltr';text.textContent=state.prefs.lang==='en'?card.roman.replaceAll('ou','u'):card.roman;$('hintContent').append(text,document.createTextNode(t('approximation')));}
 else $('hintContent').textContent=t(custom?'noCustomHint':'noHint');
 if(card.target){const p=document.createElement('p');p.textContent=`${t('target')} : ${card.target} · ${t(card.position)}`;$('hintContent').append(p);}
}
function renderCard(card){
 $('exerciseContent').hidden=false;$('summaryContent').hidden=true;
 const session=state.session;
 $('sessionLabel').textContent=custom?t('customCard'):session.kind==='guided'?`${t('step')} ${LESSONS.indexOf(lesson())+1} · ${lesson()[state.prefs.lang]}`:t(session.kind);
 $('cardCounter').textContent=custom?'':`${t('card')} ${session.index+1} ${t('of')} ${session.ids.length}`;
 $('sessionProgress').max=session.ids.length||1;$('sessionProgress').value=session.index;$('sessionProgress').hidden=!!custom;
 $('cardCategory').textContent=custom?t('customCard'):LESSONS.find(l=>l.id===card.lesson)?.[state.prefs.lang]||t('words');
 const arabic=$('arabicText');arabic.className=`arabic${card.kind==='word'?' word':''}${state.prefs.font==='amiri'?' amiri':''}`;arabic.replaceChildren();
 if(card.target){
  const segments=typeof Intl.Segmenter==='function'?[...new Intl.Segmenter('ar',{granularity:'grapheme'}).segment(card.ar)].map(s=>s.segment):[...card.ar];
  let highlighted=false;for(const segment of segments){if(!highlighted&&segment.startsWith(card.target)){const span=document.createElement('span');span.className='target-letter';span.textContent=segment;arabic.append(span);highlighted=true;}else arabic.append(document.createTextNode(segment));}
 }else arabic.textContent=card.ar;
 // Custom words use a smaller size so long user input cannot overflow the card.
 if(custom)arabic.style.fontSize=card.ar.length>14?'36px':card.ar.length>6?'54px':'';else arabic.style.fontSize='';
 $('cardContext').replaceChildren();
 if(card.target){const target=document.createElement('span');target.lang='ar';target.textContent=card.target;const caption=document.createElement('span');caption.textContent=t(card.position);$('cardContext').append(target,caption);}
 $('cardInstruction').textContent=t(custom?'customNote':card.lesson==='alphabet'?'observe':'read');
 $('listenText').textContent=t(card.lesson==='alphabet'?'listenName':'listen');
 $('previousButton').disabled=session.index===0&&!custom;
 $('skipButton').querySelector('span').textContent=t(custom?'resume':'skipCard');
 document.querySelector('.assessment').hidden=!!custom;$('hintButton').hidden=false;
 renderHint(card);
 const announcement=$('cardAnnouncement');announcement.replaceChildren(document.createTextNode($('cardCounter').textContent+' · '));
 const announcedCard=document.createElement('span');announcedCard.lang='ar';announcedCard.dir='rtl';announcedCard.textContent=card.ar;announcement.append(announcedCard);
 if(custom?.unvowelled)$('audioStatus').textContent=t('withoutVowels');
}
function renderSummary(){
 $('exerciseContent').hidden=true;$('summaryContent').hidden=false;
 const s=state.session;const empty=s.ids.length===0;
 const values=Object.values(s.answers);const known=values.filter(v=>v==='known').length;const review=values.filter(v=>v==='review').length;const skipped=s.ids.length-values.length;
 const box=$('summaryContent');box.innerHTML=`<div class="summary-symbol">${icon(empty?'book':'check')}</div><h2></h2><p></p>${empty?'':`<div class="summary-stats"><div><strong>${known}</strong><span>${t('successful')}</span></div><div><strong>${review}</strong><span>${t('toReview')}</span></div><div><strong>${skipped}</strong><span>${t('skipped')}</span></div></div>`}<div class="summary-actions"></div>`;
 box.querySelector('h2').textContent=t(empty?'emptyTitle':'completed');box.querySelector('p').textContent=t(empty?'emptyDescription':'completedDescription');
 const actions=box.querySelector('.summary-actions');actions.style.width='100%';actions.style.display='grid';actions.style.justifyItems='center';
 function action(label,fn,primary=true){const b=document.createElement('button');b.className=primary?'button primary':'text-button';b.textContent=t(label);b.addEventListener('click',fn);actions.append(b);}
 const reviewCount=Object.values(state.progress).filter(v=>v==='review').length;
 if(empty){action('backPath',()=>start('guided',s.lessonId));}
 else{
  const next=LESSONS[LESSONS.findIndex(l=>l.id===s.lessonId)+1];
  if(s.kind==='guided'&&next)action('nextLesson',()=>start('guided',next.id));
  else action(s.kind==='review'?'backPath':'restart',()=>start(s.kind==='review'?'guided':s.kind,s.lessonId));
  if(reviewCount)action('reviewNow',()=>start('review',s.lessonId),false);
  if(s.kind==='guided'&&next)action('restart',()=>start('guided',s.lessonId),false);
 }
}
function render(){updateTranslations();renderNavigation();const c=currentCard();if(c)renderCard(c);else renderSummary();save();}
function moveFocus(){ $('main').focus({preventScroll:true});if(window.innerWidth<651)$('main').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'}); }
function start(kind,lessonId=state.session.lessonId){stopAudio();custom=null;showHint=false;state.session=createSession(kind,lessonId,state);render();moveFocus();}
function advance(rating){
 if(custom){custom=null;stopAudio();showHint=false;render();return;}
 const card=currentCard();if(!card)return;
 if(rating)state=rateCard(state,card.id,rating);
 stopAudio();state.session.index++;showHint=false;render();
 if(!currentCard())moveFocus();
}
function audioError(key='audioError'){$('audioStatus').textContent=t(key);$('audioStatus').classList.add('error');$('listenButton').classList.remove('playing');$('listenButton').disabled=false;}
async function playAudio(){
 stopAudio();const token=audioToken;const card=currentCard();if(!card)return;
 if(!('speechSynthesis'in window)){audioError('noVoice');return;}
 $('audioStatus').textContent=t('loading');
 let voices=window.speechSynthesis.getVoices();
 if(!voices.some(v=>/^ar([_-]|$)/i.test(v.lang))){
  await new Promise(resolve=>{let timer;const done=()=>{window.speechSynthesis.removeEventListener('voiceschanged',done);clearTimeout(timer);resolve();};window.speechSynthesis.addEventListener('voiceschanged',done);timer=setTimeout(done,1200);});
  voices=window.speechSynthesis.getVoices();
 }
 if(token!==audioToken)return;
 const arabicVoices=voices.filter(v=>/^ar([_-]|$)/i.test(v.lang));
 if(!arabicVoices.length){audioError('noVoice');return;}
 const utterance=new SpeechSynthesisUtterance(card.audio);currentUtterance=utterance;
 utterance.voice=arabicVoices.find(v=>v.lang.toLowerCase()==='ar-sa')||arabicVoices[0];utterance.lang=utterance.voice.lang;utterance.rate=state.prefs.slow?.75:1;
 utterance.onstart=()=>{if(token!==audioToken)return;clearTimeout(audioTimer);$('audioStatus').textContent=t('playing');$('listenButton').classList.add('playing');};
 utterance.onend=()=>{if(token!==audioToken)return;clearTimeout(audioTimer);$('audioStatus').textContent=t('audioDone');$('listenButton').classList.remove('playing');currentUtterance=null;};
 utterance.onerror=event=>{if(token!==audioToken||event.error==='canceled'||event.error==='interrupted')return;clearTimeout(audioTimer);audioError();};
 audioTimer=setTimeout(()=>{if(token===audioToken){stopAudio();audioError();}},10000);
 try{window.speechSynthesis.speak(utterance);}catch{clearTimeout(audioTimer);audioError();}
}
$('listenButton').addEventListener('click',playAudio);
$('knownButton').addEventListener('click',()=>advance('known'));$('reviewButton').addEventListener('click',()=>advance('review'));$('skipButton').addEventListener('click',()=>advance());
$('previousButton').addEventListener('click',()=>{stopAudio();showHint=false;if(custom)custom=null;else state.session.index=Math.max(0,state.session.index-1);render();});
$('hintButton').addEventListener('click',()=>{showHint=!showHint;renderHint(currentCard());});
$('speedButton').addEventListener('click',()=>{stopAudio();state.prefs.slow=!state.prefs.slow;save();$('speedButton').textContent=state.prefs.slow?'0.75×':'1×';$('speedButton').setAttribute('aria-pressed',String(state.prefs.slow));});
$('lessonList').addEventListener('click',e=>{const b=e.target.closest('[data-lesson]');if(b)start('guided',b.dataset.lesson);});
$('lessonSelect').addEventListener('change',e=>start('guided',e.target.value));
// Keep the current session when clicking its selected navigation item.
for(const b of document.querySelectorAll('[data-view]'))b.addEventListener('click',()=>{if(state.session.kind!==b.dataset.view)start(b.dataset.view);});
for(const b of document.querySelectorAll('[data-mode]'))b.addEventListener('click',()=>{if(state.prefs.freeMode!==b.dataset.mode){state.prefs.freeMode=b.dataset.mode;start('free');}});
for(const [button,dialog] of [['settingsOpen','settingsDialog'],['helpOpen','helpDialog']])$(button).addEventListener('click',()=>$(dialog).showModal());
for(const dialog of document.querySelectorAll('dialog'))dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.target===dialog&&(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom))dialog.close();});
$('languageSelect').addEventListener('change',e=>{stopAudio();state.prefs.lang=e.target.value;render();});
$('fontSelect').addEventListener('change',e=>{state.prefs.font=e.target.value;render();});
$('trackSelect').addEventListener('change',e=>{stopAudio();state.prefs.track=e.target.value;if(state.session.kind!=='review'&&(state.session.lessonId==='words'||state.session.kind==='free'&&state.prefs.freeMode==='word'))state.session=createSession(state.session.kind,state.session.lessonId,state);custom=null;render();});
$('customOpen').addEventListener('click',()=>{
 $('customInput').value='';$('customInput').removeAttribute('aria-invalid');$('inputError').textContent='';$('inputHint').textContent=t(state.prefs.freeMode==='letter'?'inputLetter':state.prefs.freeMode==='assembly'?'inputAssembly':'inputWord');$('customDialog').showModal();$('customInput').focus();
});
const keys=[...'ابتثجحخدذرزسشصضطظعغفقكلمنهويأإآءؤئىة','َ','ِ','ُ','ْ','ّ','ً','ٍ','ٌ'];
for(const key of keys){const b=document.createElement('button');b.type='button';b.lang='ar';b.textContent=/[\u064B-\u0652]/.test(key)?'ـ'+key:key;b.className=/[\u064B-\u0652]/.test(key)?'mark-key':'';b.setAttribute('aria-label',({'َ':'فتحة','ِ':'كسرة','ُ':'ضمة','ْ':'سكون','ّ':'شدة','ً':'تنوين فتح','ٍ':'تنوين كسر','ٌ':'تنوين ضم'})[key]||key);b.addEventListener('click',()=>{
 const input=$('customInput');const start=input.selectionStart??input.value.length;const end=input.selectionEnd??start;if(input.value.length-(end-start)+key.length<=160){input.setRangeText(key,start,end,'end');input.dispatchEvent(new Event('input'));}input.focus();
});$('arabicKeyboard').append(b);}
$('eraseInput').addEventListener('click',()=>{const input=$('customInput');const start=input.selectionStart??input.value.length;const end=input.selectionEnd??start;input.setRangeText('',start===end?Math.max(0,start-1):start,end,'end');input.focus();input.dispatchEvent(new Event('input'));});
$('customInput').addEventListener('input',()=>{$('inputError').textContent='';$('customInput').removeAttribute('aria-invalid');});
$('customForm').addEventListener('submit',e=>{
 e.preventDefault();const result=validateInput($('customInput').value,state.prefs.freeMode);
 if(!result.ok){$('inputError').textContent=t(result.error==='arabic'?'errorArabic':result.error==='diacritics'?'errorDiacritics':'errorLength');$('customInput').setAttribute('aria-invalid','true');$('customInput').focus();return;}
 stopAudio();custom={ar:result.text,audio:result.text,kind:state.prefs.freeMode,unvowelled:result.unvowelled};showHint=false;$('customDialog').close();render();
});
window.addEventListener('online',connection);window.addEventListener('offline',connection);window.addEventListener('pagehide',stopAudio);
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;$('installButton').hidden=false;});
window.addEventListener('appinstalled',()=>{installPrompt=null;$('installButton').hidden=true;});
$('installButton').addEventListener('click',async()=>{if(installPrompt){await installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;$('installButton').hidden=true;}else $('installDialog').showModal();});
const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
if(ios&&!navigator.standalone&&!matchMedia('(display-mode: standalone)').matches)$('installButton').hidden=false;
render();if(storageFailed)notify(t('savedError'));
if('serviceWorker'in navigator && location.protocol.startsWith('http'))navigator.serviceWorker.register('./sw.js').then(async()=>{await navigator.serviceWorker.ready;offlineReady=true;connection();}).catch(()=>{offlineReady=false;connection();});
