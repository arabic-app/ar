export const LESSONS = [
 ['alphabet','Les lettres','The letters','الحروف','Reconnaître les lettres et découvrir leur nom.','Recognise letters and discover their names.','تعرّف على الحروف وأسمائها.','ا'],
 ['vowels','Les voyelles courtes','Short vowels','الحركات القصيرة','Une lettre, trois lectures : a, i, ou.','One letter, three sounds: a, i, u.','حرف واحد وثلاث حركات.','بَ'],
 ['shapes','Les lettres liées','Joined letters','أشكال الحروف','Observer les formes dans de vrais mots.','See letter shapes in real words.','لاحظ أشكال الحروف في كلمات.','بـ'],
 ['assembly','Les assemblages','Combinations','تركيب الحروف','Lire deux lettres, pas à pas.','Read two letters, step by step.','اقرأ حرفين خطوة بخطوة.','بَتَ'],
 ['long','Les voyelles longues','Long vowels','المدود','Distinguer une voyelle courte d’une longue.','Distinguish short and long vowels.','ميّز بين الحركة القصيرة والمدّ.','بَا'],
 ['sukun','Le sukūn','Sukūn','السكون','Lire une consonne sans voyelle courte.','Read a consonant without a short vowel.','اقرأ حرفًا ساكنًا.','بْ'],
 ['shadda','La shadda','Shadda','الشدة','Comprendre le doublement d’une consonne.','Understand a doubled consonant.','تعلّم تضعيف الحرف.','بّ'],
 ['tanween','Le tanwīn','Tanwīn','التنوين','Découvrir les terminaisons an, in, oun.','Discover the endings an, in, un.','تعرّف على التنوين.','بٌ'],
 ['words','Les premiers mots','First words','الكلمات الأولى','Assembler ses acquis pour lire des mots.','Use what you know to read words.','استخدم ما تعلّمته لقراءة الكلمات.','كِتَابٌ']
].map(([id,fr,en,ar,descFr,descEn,descAr,glyph])=>({id,fr,en,ar,description:{fr:descFr,en:descEn,ar:descAr},glyph}));
const alphabet = [
 ['ا','alif','أَلِف'],['ب','bāʾ','بَاء'],['ت','tāʾ','تَاء'],['ث','thāʾ','ثَاء'],['ج','jīm','جِيم'],['ح','ḥāʾ','حَاء'],['خ','khāʾ','خَاء'],['د','dāl','دَال'],['ذ','dhāl','ذَال'],['ر','rāʾ','رَاء'],['ز','zāy','زَاي'],['س','sīn','سِين'],['ش','shīn','شِين'],['ص','ṣād','صَاد'],['ض','ḍād','ضَاد'],['ط','ṭāʾ','طَاء'],['ظ','ẓāʾ','ظَاء'],['ع','ʿayn','عَيْن'],['غ','ghayn','غَيْن'],['ف','fāʾ','فَاء'],['ق','qāf','قَاف'],['ك','kāf','كَاف'],['ل','lām','لَام'],['م','mīm','مِيم'],['ن','nūn','نُون'],['ه','hāʾ','هَاء'],['و','wāw','وَاو'],['ي','yāʾ','يَاء']
];
export const CARDS=alphabet.map(([ar,roman,audio],i)=>({id:`alphabet-${i}`,lesson:'alphabet',ar,audio,roman,name:audio,kind:'letter'}));
function add(lesson,ar,roman,extra={}) { CARDS.push({id:`${lesson}-${CARDS.filter(c=>c.lesson===lesson).length}`,lesson,ar,audio:ar,roman,kind:'assembly',...extra}); }
for(const [letter,roman] of [['ب','b'],['ت','t'],['م','m'],['ن','n']]) {
 for(const [mark,sound] of [['َ','a'],['ِ','i'],['ُ','ou']]) add('vowels',letter+mark,roman+sound,{kind:'letter'});
}
for(const [ar,roman,target,position] of [
 ['بَابٌ','bāboun','ب','initial'],['كَبِيرٌ','kabīroun','ب','medial'],['كِتَابٌ','kitāboun','ب','endSeparate'],['كَلْبٌ','kalboun','ب','final'],
 ['تَمْرٌ','tamroun','ت','initial'],['كُتُبٌ','koutouboun','ت','medial'],['بَيْتٌ','baytoun','ت','final'],['وَلَدٌ','waladoun','و','nonjoining']
]) add('shapes',ar,roman,{kind:'word',target,position});
for(const [ar,r] of [['بَتَ','bata'],['تَبَ','taba'],['مَنَ','mana'],['نَمَ','nama'],['كَتَ','kata'],['لَمَ','lama'],['سَمَ','sama'],['فَتَ','fata'],['بِتَ','bita'],['تُبِ','toubi']]) add('assembly',ar,r);
for(const [ar,r] of [['بَا','bā'],['بِي','bī'],['بُو','bū'],['تَا','tā'],['تِي','tī'],['تُو','tū'],['مَا','mā'],['مِي','mī'],['مُو','mū']]) add('long',ar,r);
for(const [ar,r] of [['بَتْ','bat'],['مِنْ','min'],['هَلْ','hal'],['لَمْ','lam'],['قَدْ','qad'],['بَلْ','bal'],['عَنْ','ʿan'],['كَمْ','kam']]) add('sukun',ar,r);
for(const [ar,r] of [['بَّ','bba'],['بِّ','bbi'],['بُّ','bbou'],['مَّ','mma'],['مِّ','mmi'],['مُّ','mmou'],['نَّ','nna'],['نِّ','nni'],['نُّ','nnou']]) add('shadda',ar,r);
for(const [ar,r] of [['بًا','ban'],['بٍ','bin'],['بٌ','boun'],['تًا','tan'],['تٍ','tin'],['تٌ','toun'],['مًا','man'],['مٍ','min'],['مٌ','moun']]) add('tanween',ar,r);

const vocabulary = [{"ar": "بَابٌ", "fr": "Porte", "en": "Door", "track": "daily"}, {"ar": "البَابُ", "fr": "La porte", "en": "The door", "track": "daily"}, {"ar": "بَيْتٌ", "fr": "Maison", "en": "House", "track": "daily"}, {"ar": "البَيْتُ", "fr": "La maison", "en": "The house", "track": "daily"}, {"ar": "كَلْبٌ", "fr": "Chien", "en": "Dog", "track": "daily"}, {"ar": "الكَلْبُ", "fr": "Le chien", "en": "The dog", "track": "daily"}, {"ar": "قَلَمٌ", "fr": "Stylo", "en": "Pen", "track": "daily"}, {"ar": "القَلَمُ", "fr": "Le stylo", "en": "The pen", "track": "daily"}, {"ar": "كِتَابٌ", "fr": "Livre", "en": "Book", "track": "daily"}, {"ar": "الكِتَابُ", "fr": "Le livre", "en": "The book", "track": "daily"}, {"ar": "شَجَرَةٌ", "fr": "Arbre", "en": "Tree", "track": "daily"}, {"ar": "مَاءٌ", "fr": "Eau", "en": "Water", "track": "daily"}, {"ar": "وَلَدٌ", "fr": "Garçon", "en": "Boy", "track": "daily"}, {"ar": "أُمٌّ", "fr": "Mère", "en": "Mother", "track": "daily"}, {"ar": "أَبٌ", "fr": "Père", "en": "Father", "track": "daily"}, {"ar": "كَتَبَ", "fr": "Il a écrit", "en": "He wrote", "track": "daily"}, {"ar": "قَرَأَ", "fr": "Il a lu", "en": "He read", "track": "daily"}, {"ar": "ذَهَبَ", "fr": "Il est allé", "en": "He went", "track": "daily"}, {"ar": "سَمِعَ", "fr": "Il a entendu", "en": "He heard", "track": "daily"}, {"ar": "عَلِمَ", "fr": "Il a su", "en": "He knew", "track": "daily"}, {"ar": "سَجَدَ", "fr": "Il s'est prosterné", "en": "He prostrated", "track": "quran"}, {"ar": "رَكَعَ", "fr": "Il s'est incliné", "en": "He bowed", "track": "quran"}, {"ar": "قَامَ", "fr": "Il s'est levé", "en": "He stood up", "track": "quran"}, {"ar": "صَلَّى", "fr": "Il a prié", "en": "He prayed", "track": "quran"}, {"ar": "دَعَا", "fr": "Il a invoqué", "en": "He supplicated", "track": "quran"}, {"ar": "اللهُ", "fr": "Allah", "en": "Allah", "track": "quran"}, {"ar": "الإِسْلَامُ", "fr": "L'Islam", "en": "Islam", "track": "quran"}, {"ar": "الإِيمَانُ", "fr": "La foi", "en": "Faith", "track": "quran"}, {"ar": "الإِحْسَانُ", "fr": "L'excellence", "en": "Excellence", "track": "quran"}, {"ar": "صَلَاةٌ", "fr": "Prière", "en": "Prayer", "track": "quran"}, {"ar": "الصَّلَاةُ", "fr": "La prière", "en": "The prayer", "track": "quran"}, {"ar": "زَكَاةٌ", "fr": "Zakat", "en": "Zakat", "track": "quran"}, {"ar": "صَوْمٌ", "fr": "Jeûne", "en": "Fasting", "track": "quran"}, {"ar": "حَجٌّ", "fr": "Pèlerinage", "en": "Hajj", "track": "quran"}, {"ar": "شَهَادَةٌ", "fr": "Attestation", "en": "Testimony", "track": "quran"}, {"ar": "رَسُولٌ", "fr": "Messager", "en": "Messenger", "track": "quran"}, {"ar": "مَلَكٌ", "fr": "Ange", "en": "Angel", "track": "quran"}, {"ar": "المَلَائِكَةُ", "fr": "Les anges", "en": "The angels", "track": "quran"}, {"ar": "القَدَرُ", "fr": "Le destin", "en": "Destiny", "track": "quran"}, {"ar": "نَبِيٌّ", "fr": "Prophète", "en": "Prophet", "track": "quran"}, {"ar": "قُرْآنٌ", "fr": "Coran", "en": "Quran", "track": "quran"}, {"ar": "وُضُوءٌ", "fr": "Ablutions", "en": "Wudu", "track": "quran"}, {"ar": "نِيَّةٌ", "fr": "Intention", "en": "Intention", "track": "quran"}, {"ar": "تَكْبِيرَةٌ", "fr": "Takbir", "en": "Takbir", "track": "quran"}, {"ar": "سُجُودٌ", "fr": "Prosternation", "en": "Prostration", "track": "quran"}, {"ar": "رُكُوعٌ", "fr": "Inclinaison", "en": "Bowing", "track": "quran"}, {"ar": "قِيَامٌ", "fr": "Station debout", "en": "Standing", "track": "quran"}, {"ar": "فَاتِحَةٌ", "fr": "Al-Fatiha", "en": "Al-Fatiha", "track": "quran"}, {"ar": "سَلَامٌ", "fr": "Salutation", "en": "Greeting", "track": "quran"}, {"ar": "قِبْلَةٌ", "fr": "Qibla", "en": "Qibla", "track": "quran"}, {"ar": "مَسْجِدٌ", "fr": "Mosquée", "en": "Mosque", "track": "quran"}, {"ar": "أَذَانٌ", "fr": "Adhan", "en": "Adhan", "track": "quran"}, {"ar": "إِقَامَةٌ", "fr": "Iqama", "en": "Iqama", "track": "quran"}, {"ar": "إِخْلَاصٌ", "fr": "Sincérité", "en": "Sincerity", "track": "quran"}, {"ar": "يَقِينٌ", "fr": "Certitude", "en": "Certainty", "track": "quran"}, {"ar": "تَوَكُّلٌ", "fr": "Confiance en Allah", "en": "Trust in Allah", "track": "quran"}, {"ar": "مَحَبَّةٌ", "fr": "Amour", "en": "Love", "track": "quran"}, {"ar": "رَجَاءٌ", "fr": "Espérance", "en": "Hope", "track": "quran"}, {"ar": "صَبْرٌ", "fr": "Patience", "en": "Patience", "track": "quran"}, {"ar": "صِدْقٌ", "fr": "Véracité", "en": "Truthfulness", "track": "quran"}, {"ar": "أَمَانَةٌ", "fr": "Dépôt / Loyauté", "en": "Trustworthiness", "track": "quran"}, {"ar": "رَحْمَةٌ", "fr": "Miséricorde", "en": "Mercy", "track": "quran"}, {"ar": "تَقْوَى", "fr": "Piété", "en": "Piety", "track": "quran"}, {"ar": "خُشُوعٌ", "fr": "Recueillement", "en": "Humility", "track": "quran"}, {"ar": "شُكْرٌ", "fr": "Gratitude", "en": "Gratitude", "track": "quran"}, {"ar": "الرَّحْمَنُ", "fr": "Le Tout Miséricordieux", "en": "The Entirely Merciful", "track": "quran"}, {"ar": "الرَّحِيمُ", "fr": "Le Très Miséricordieux", "en": "The Especially Merciful", "track": "quran"}, {"ar": "الخَالِقُ", "fr": "Le Créateur", "en": "The Creator", "track": "quran"}, {"ar": "العَلِيمُ", "fr": "L'Omniscient", "en": "The All-Knowing", "track": "quran"}, {"ar": "السَّمِيعُ", "fr": "L'Audient", "en": "The All-Hearing", "track": "quran"}, {"ar": "البَصِيرُ", "fr": "Le Clairvoyant", "en": "The All-Seeing", "track": "quran"}, {"ar": "المَلِكُ", "fr": "Le Souverain", "en": "The Sovereign", "track": "quran"}, {"ar": "القُدُّوسُ", "fr": "L'Infiniment Saint", "en": "The Holy", "track": "quran"}, {"ar": "السَّلَامُ", "fr": "La Paix", "en": "The Source of Peace", "track": "quran"}, {"ar": "المُؤْمِنُ", "fr": "Le Fidèle", "en": "The Granter of Security", "track": "quran"}];
vocabulary.forEach(w=>add('words',w.ar,'',{kind:'word',track:w.track,meaning:{fr:w.fr,en:w.en,ar:''}}));
export const CARD_MAP = new Map(CARDS.map(c=>[c.id,c]));
export function validateInput(raw, mode='word') {
 const text=String(raw).normalize('NFC').trim();
 if(!text || !/^[\u0621-\u063A\u0641-\u0652\u0670\u0671]+$/u.test(text) || /^[\u064B-\u0652\u0670]/u.test(text)) return {ok:false,error:'arabic'};
 for(const cluster of text.match(/[\u0621-\u063A\u0641-\u064A\u0671][\u064B-\u0652\u0670]*/gu)||[]) {
  const marks=Array.from(cluster.slice(1));
  if(new Set(marks).size!==marks.length || marks.filter(m=>/[\u064B-\u0650]/u.test(m)).length>1 || (marks.includes('ْ') && marks.length>1)) return {ok:false,error:'diacritics'};
 }
 const letters=Array.from(text.replace(/[\u064B-\u0652\u0670]/gu,''));
 if(letters.length===0) return {ok:false,error:'arabic'};
 if((mode==='letter' && letters.length!==1)||(mode==='assembly'&&letters.length!==2)||letters.length>40) return {ok:false,error:'length'};
 return {ok:true,text,unvowelled: !/[\u064B-\u0652]/u.test(text)};
}
export function restoreState(raw) {
 const clean={version:2,prefs:{lang:'fr',font:'standard',track:'daily',freeMode:'letter',slow:false},progress:{},session:null};
 try {
  const saved=JSON.parse(raw); if(!saved || saved.version!==2 || Array.isArray(saved)) return clean;
  for(const [key,allowed] of Object.entries({lang:['fr','en','ar'],font:['standard','amiri'],track:['daily','quran'],freeMode:['letter','assembly','word']})) if(allowed.includes(saved.prefs?.[key])) clean.prefs[key]=saved.prefs[key];
  clean.prefs.slow=saved.prefs?.slow===true;
  if(saved.progress && typeof saved.progress==='object') for(const [id,value] of Object.entries(saved.progress)) if(CARD_MAP.has(id)&&['known','review'].includes(value)) clean.progress[id]=value;
  const s=saved.session;
  if(s && ['guided','free','review'].includes(s.kind) && Array.isArray(s.ids) && s.ids.length>0 && s.ids.length<=CARDS.length && new Set(s.ids).size===s.ids.length && s.ids.every(id=>CARD_MAP.has(id)) && Number.isInteger(s.index) && s.index>=0 && s.index<=s.ids.length && LESSONS.some(l=>l.id===s.lessonId)) {
   clean.session={kind:s.kind,lessonId:s.lessonId,ids:s.ids,index:s.index,answers:{}};
   for(const [id,value] of Object.entries(s.answers||{})) if(s.ids.includes(id)&&['known','review'].includes(value)) clean.session.answers[id]=value;
  }
 } catch {}
 return clean;
}
export function createSession(kind,lessonId='alphabet',state=restoreState(null)) {
 let cards;
 if(kind==='review') cards=CARDS.filter(c=>state.progress[c.id]==='review');
 else if(kind==='free') cards=CARDS.filter(c=>c.kind===state.prefs.freeMode && (c.lesson!=='words'||c.track===state.prefs.track));
 else cards=CARDS.filter(c=>c.lesson===lessonId && (lessonId!=='words'||c.track===state.prefs.track));
 if(kind==='free') {
  cards=[...cards]; for(let i=cards.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [cards[i],cards[j]]=[cards[j],cards[i]];} cards=cards.slice(0,10);
 }
 return {kind,lessonId,ids:cards.map(c=>c.id),index:0,answers:{}};
}
export function rateCard(state,id,rating) {
 if(!CARD_MAP.has(id)||!['known','review'].includes(rating)) return state;
 return {...state,progress:{...state.progress,[id]:rating},session:state.session?{...state.session,answers:{...state.session.answers,[id]:rating}}:null};
}
