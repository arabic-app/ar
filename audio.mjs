// Compatibility with the original Google voice. Display text stays unchanged.
// Repeated madd letters are deliberately restored in the speech payload only.
function google(text,rate){return {text,rate,src:`https://translate.google.com/translate_tts?ie=UTF-8&tl=ar&client=tw-ob&q=${encodeURIComponent(text)}`};}
export function getAudioPlan(card,slow=false){
 const rate=slow?.75:1;
 const text=(card?.audio||card?.ar||'').normalize('NFC').replace(/[\u200C\u200D]/g,'');
 if(card?.ar==='ل'&&card.lesson==='alphabet')return google('لَامْ',rate);
 const madd=text.match(/^([\u0621-\u063A\u0641-\u064A])([َُِ])([اوي])$/u);
 if(madd&&({'َ':'ا','ِ':'ي','ُ':'و'})[madd[2]]===madd[3])return google(text+madd[3]+madd[3],rate);
 const tanween=text.match(/^([\u0621-\u063A\u0641-\u064A])([ًٌٍ])ا?$/u);
 if(tanween)return google(tanween[1]+({'ً':'َ','ٍ':'ِ','ٌ':'ُ'})[tanween[2]]+'نْ',rate);
 return google(text,rate);
}
