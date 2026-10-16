const LETTERS=[...'أبتثجحخدذرزسشصضطظعغفقكلمنهوي'];
const NON_JOINING=new Set([...'أادذرزو']);
const VOWELS=['َ','ِ','ُ'];const TANWEEN=['ً','ٍ','ٌ'];
const pick=(xs,random)=>xs[Math.min(xs.length-1,Math.floor(random()*xs.length))];
export function generateFreeCard(mode,words=[],random=Math.random){
 if(mode==='word'){
  const word=pick(words,random);return word?{...word,position:'word'}:{ar:'بَابٌ',audio:'بَابٌ',kind:'word',position:'word',lesson:'words'};
 }
 const first=pick(LETTERS,random);let ar,last=first,isMadd=false;
 if(mode==='letter')ar=first+pick([...VOWELS,...TANWEEN],random);
 else{
  const vowel=pick(VOWELS,random);
  isMadd=random()<.5;
  last=isMadd?({'َ':'ا','ِ':'ي','ُ':'و'})[vowel]:pick(LETTERS,random);
  const mark=isMadd?'':pick([...VOWELS,'ْ','َّ','ِّ','ُّ'],random);
  ar=first+vowel+last+mark;
 }
 const positions=NON_JOINING.has(last)?['isolated','final']:['isolated','initial','medial','final'];
 const position=pick(positions,random);
 if(mode==='letter'&&['initial','medial'].includes(position))ar=first+pick(VOWELS,random);
 return {ar,audio:ar,kind:mode,lesson:mode==='letter'?TANWEEN.some(m=>ar.includes(m))?'tanween':'vowels':isMadd?'long':'assembly',isMadd,position};
}
export function freeDisplay(card){
 if(card.position==='initial')return card.ar+'\u200D';
 if(card.position==='medial')return '\u200D'+card.ar+'\u200D';
 if(card.position==='final')return '\u200D'+card.ar;
 return card.ar;
}
