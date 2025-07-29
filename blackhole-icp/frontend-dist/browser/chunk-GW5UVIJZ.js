import{a as c,b as m,c as h,d as Do,e as jo,f as zo}from"./chunk-QVE2JQAL.js";import{h as mt,i as at}from"./chunk-R4CYYJBF.js";import{C as pe,J as y,K as L,L as Oo,M as Z,N as d,b as Po,h as At,i as ht,j as f,k as Ke,l as B,m as H,o as N,p as T,q as E,r as Ft,s as x,t as yt,v,z as Ht}from"./chunk-L4TYMJQF.js";import{b as g,e as l,f as ft,h as Ge,j as p}from"./chunk-V22BWOKJ.js";import"./chunk-USJIJJ3H.js";import"./chunk-26CTAKM4.js";import"./chunk-V4X6BPGN.js";import"./chunk-ERZ25PT2.js";import{e as S,h as Pr,k as X}from"./chunk-HIVZEDT5.js";var ni=S((cd,ri)=>{"use strict";ri.exports=function(){return typeof Promise=="function"&&Promise.prototype&&Promise.prototype.then}});var wt=S($t=>{"use strict";var eo,Nr=[0,26,44,70,100,134,172,196,242,292,346,404,466,532,581,655,733,815,901,991,1085,1156,1258,1364,1474,1588,1706,1828,1921,2051,2185,2323,2465,2611,2761,2876,3034,3196,3362,3532,3706];$t.getSymbolSize=function(t){if(!t)throw new Error('"version" cannot be null or undefined');if(t<1||t>40)throw new Error('"version" should be in range from 1 to 40');return t*4+17};$t.getSymbolTotalCodewords=function(t){return Nr[t]};$t.getBCHDigit=function(r){let t=0;for(;r!==0;)t++,r>>>=1;return t};$t.setToSJISFunction=function(t){if(typeof t!="function")throw new Error('"toSJISFunc" is not a valid function.');eo=t};$t.isKanjiModeEnabled=function(){return typeof eo<"u"};$t.toSJIS=function(t){return eo(t)}});var Ie=S(Y=>{"use strict";Y.L={bit:1};Y.M={bit:0};Y.Q={bit:3};Y.H={bit:2};function Ur(r){if(typeof r!="string")throw new Error("Param is not a string");switch(r.toLowerCase()){case"l":case"low":return Y.L;case"m":case"medium":return Y.M;case"q":case"quartile":return Y.Q;case"h":case"high":return Y.H;default:throw new Error("Unknown EC Level: "+r)}}Y.isValid=function(t){return t&&typeof t.bit<"u"&&t.bit>=0&&t.bit<4};Y.from=function(t,e){if(Y.isValid(t))return t;try{return Ur(t)}catch{return e}}});var li=S((pd,ai)=>{"use strict";function si(){this.buffer=[],this.length=0}si.prototype={get:function(r){let t=Math.floor(r/8);return(this.buffer[t]>>>7-r%8&1)===1},put:function(r,t){for(let e=0;e<t;e++)this.putBit((r>>>t-e-1&1)===1)},getLengthInBits:function(){return this.length},putBit:function(r){let t=Math.floor(this.length/8);this.buffer.length<=t&&this.buffer.push(0),r&&(this.buffer[t]|=128>>>this.length%8),this.length++}};ai.exports=si});var ui=S((hd,ci)=>{"use strict";function te(r){if(!r||r<1)throw new Error("BitMatrix size must be defined and greater than 0");this.size=r,this.data=new Uint8Array(r*r),this.reservedBit=new Uint8Array(r*r)}te.prototype.set=function(r,t,e,i){let n=r*this.size+t;this.data[n]=e,i&&(this.reservedBit[n]=!0)};te.prototype.get=function(r,t){return this.data[r*this.size+t]};te.prototype.xor=function(r,t,e){this.data[r*this.size+t]^=e};te.prototype.isReserved=function(r,t){return this.reservedBit[r*this.size+t]};ci.exports=te});var di=S(We=>{"use strict";var Mr=wt().getSymbolSize;We.getRowColCoords=function(t){if(t===1)return[];let e=Math.floor(t/7)+2,i=Mr(t),n=i===145?26:Math.ceil((i-13)/(2*e-2))*2,o=[i-7];for(let s=1;s<e-1;s++)o[s]=o[s-1]-n;return o.push(6),o.reverse()};We.getPositions=function(t){let e=[],i=We.getRowColCoords(t),n=i.length;for(let o=0;o<n;o++)for(let s=0;s<n;s++)o===0&&s===0||o===0&&s===n-1||o===n-1&&s===0||e.push([i[o],i[s]]);return e}});var mi=S(hi=>{"use strict";var qr=wt().getSymbolSize,pi=7;hi.getPositions=function(t){let e=qr(t);return[[0,0],[e-pi,0],[0,e-pi]]}});var fi=S(A=>{"use strict";A.Patterns={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7};var _t={N1:3,N2:3,N3:40,N4:10};A.isValid=function(t){return t!=null&&t!==""&&!isNaN(t)&&t>=0&&t<=7};A.from=function(t){return A.isValid(t)?parseInt(t,10):void 0};A.getPenaltyN1=function(t){let e=t.size,i=0,n=0,o=0,s=null,a=null;for(let u=0;u<e;u++){n=o=0,s=a=null;for(let b=0;b<e;b++){let w=t.get(u,b);w===s?n++:(n>=5&&(i+=_t.N1+(n-5)),s=w,n=1),w=t.get(b,u),w===a?o++:(o>=5&&(i+=_t.N1+(o-5)),a=w,o=1)}n>=5&&(i+=_t.N1+(n-5)),o>=5&&(i+=_t.N1+(o-5))}return i};A.getPenaltyN2=function(t){let e=t.size,i=0;for(let n=0;n<e-1;n++)for(let o=0;o<e-1;o++){let s=t.get(n,o)+t.get(n,o+1)+t.get(n+1,o)+t.get(n+1,o+1);(s===4||s===0)&&i++}return i*_t.N2};A.getPenaltyN3=function(t){let e=t.size,i=0,n=0,o=0;for(let s=0;s<e;s++){n=o=0;for(let a=0;a<e;a++)n=n<<1&2047|t.get(s,a),a>=10&&(n===1488||n===93)&&i++,o=o<<1&2047|t.get(a,s),a>=10&&(o===1488||o===93)&&i++}return i*_t.N3};A.getPenaltyN4=function(t){let e=0,i=t.data.length;for(let o=0;o<i;o++)e+=t.data[o];return Math.abs(Math.ceil(e*100/i/5)-10)*_t.N4};function Vr(r,t,e){switch(r){case A.Patterns.PATTERN000:return(t+e)%2===0;case A.Patterns.PATTERN001:return t%2===0;case A.Patterns.PATTERN010:return e%3===0;case A.Patterns.PATTERN011:return(t+e)%3===0;case A.Patterns.PATTERN100:return(Math.floor(t/2)+Math.floor(e/3))%2===0;case A.Patterns.PATTERN101:return t*e%2+t*e%3===0;case A.Patterns.PATTERN110:return(t*e%2+t*e%3)%2===0;case A.Patterns.PATTERN111:return(t*e%3+(t+e)%2)%2===0;default:throw new Error("bad maskPattern:"+r)}}A.applyMask=function(t,e){let i=e.size;for(let n=0;n<i;n++)for(let o=0;o<i;o++)e.isReserved(o,n)||e.xor(o,n,Vr(t,o,n))};A.getBestMask=function(t,e){let i=Object.keys(A.Patterns).length,n=0,o=1/0;for(let s=0;s<i;s++){e(s),A.applyMask(s,t);let a=A.getPenaltyN1(t)+A.getPenaltyN2(t)+A.getPenaltyN3(t)+A.getPenaltyN4(t);A.applyMask(s,t),a<o&&(o=a,n=s)}return n}});var io=S(oo=>{"use strict";var bt=Ie(),Te=[1,1,1,1,1,1,1,1,1,1,2,2,1,2,2,4,1,2,4,4,2,4,4,4,2,4,6,5,2,4,6,6,2,5,8,8,4,5,8,8,4,5,8,11,4,8,10,11,4,9,12,16,4,9,16,16,6,10,12,18,6,10,17,16,6,11,16,19,6,13,18,21,7,14,21,25,8,16,20,25,8,17,23,25,9,17,23,34,9,18,25,30,10,20,27,32,12,21,29,35,12,23,34,37,12,25,34,40,13,26,35,42,14,28,38,45,15,29,40,48,16,31,43,51,17,33,45,54,18,35,48,57,19,37,51,60,19,38,53,63,20,40,56,66,21,43,59,70,22,45,62,74,24,47,65,77,25,49,68,81],Le=[7,10,13,17,10,16,22,28,15,26,36,44,20,36,52,64,26,48,72,88,36,64,96,112,40,72,108,130,48,88,132,156,60,110,160,192,72,130,192,224,80,150,224,264,96,176,260,308,104,198,288,352,120,216,320,384,132,240,360,432,144,280,408,480,168,308,448,532,180,338,504,588,196,364,546,650,224,416,600,700,224,442,644,750,252,476,690,816,270,504,750,900,300,560,810,960,312,588,870,1050,336,644,952,1110,360,700,1020,1200,390,728,1050,1260,420,784,1140,1350,450,812,1200,1440,480,868,1290,1530,510,924,1350,1620,540,980,1440,1710,570,1036,1530,1800,570,1064,1590,1890,600,1120,1680,1980,630,1204,1770,2100,660,1260,1860,2220,720,1316,1950,2310,750,1372,2040,2430];oo.getBlocksCount=function(t,e){switch(e){case bt.L:return Te[(t-1)*4+0];case bt.M:return Te[(t-1)*4+1];case bt.Q:return Te[(t-1)*4+2];case bt.H:return Te[(t-1)*4+3];default:return}};oo.getTotalCodewordsCount=function(t,e){switch(e){case bt.L:return Le[(t-1)*4+0];case bt.M:return Le[(t-1)*4+1];case bt.Q:return Le[(t-1)*4+2];case bt.H:return Le[(t-1)*4+3];default:return}}});var gi=S(Ae=>{"use strict";var ee=new Uint8Array(512),Be=new Uint8Array(256);(function(){let t=1;for(let e=0;e<255;e++)ee[e]=t,Be[t]=e,t<<=1,t&256&&(t^=285);for(let e=255;e<512;e++)ee[e]=ee[e-255]})();Ae.log=function(t){if(t<1)throw new Error("log("+t+")");return Be[t]};Ae.exp=function(t){return ee[t]};Ae.mul=function(t,e){return t===0||e===0?0:ee[Be[t]+Be[e]]}});var wi=S(oe=>{"use strict";var ro=gi();oe.mul=function(t,e){let i=new Uint8Array(t.length+e.length-1);for(let n=0;n<t.length;n++)for(let o=0;o<e.length;o++)i[n+o]^=ro.mul(t[n],e[o]);return i};oe.mod=function(t,e){let i=new Uint8Array(t);for(;i.length-e.length>=0;){let n=i[0];for(let s=0;s<e.length;s++)i[s]^=ro.mul(e[s],n);let o=0;for(;o<i.length&&i[o]===0;)o++;i=i.slice(o)}return i};oe.generateECPolynomial=function(t){let e=new Uint8Array([1]);for(let i=0;i<t;i++)e=oe.mul(e,new Uint8Array([1,ro.exp(i)]));return e}});var xi=S((xd,vi)=>{"use strict";var bi=wi();function no(r){this.genPoly=void 0,this.degree=r,this.degree&&this.initialize(this.degree)}no.prototype.initialize=function(t){this.degree=t,this.genPoly=bi.generateECPolynomial(this.degree)};no.prototype.encode=function(t){if(!this.genPoly)throw new Error("Encoder not initialized");let e=new Uint8Array(t.length+this.degree);e.set(t);let i=bi.mod(e,this.genPoly),n=this.degree-i.length;if(n>0){let o=new Uint8Array(this.degree);return o.set(i,n),o}return i};vi.exports=no});var so=S(yi=>{"use strict";yi.isValid=function(t){return!isNaN(t)&&t>=1&&t<=40}});var ao=S(ut=>{"use strict";var Ci="[0-9]+",Fr="[A-Z $%*+\\-./:]+",ie="(?:[u3000-u303F]|[u3040-u309F]|[u30A0-u30FF]|[uFF00-uFFEF]|[u4E00-u9FAF]|[u2605-u2606]|[u2190-u2195]|u203B|[u2010u2015u2018u2019u2025u2026u201Cu201Du2225u2260]|[u0391-u0451]|[u00A7u00A8u00B1u00B4u00D7u00F7])+";ie=ie.replace(/u/g,"\\u");var Hr="(?:(?![A-Z0-9 $%*+\\-./:]|"+ie+`)(?:.|[\r
]))+`;ut.KANJI=new RegExp(ie,"g");ut.BYTE_KANJI=new RegExp("[^A-Z0-9 $%*+\\-./:]+","g");ut.BYTE=new RegExp(Hr,"g");ut.NUMERIC=new RegExp(Ci,"g");ut.ALPHANUMERIC=new RegExp(Fr,"g");var Kr=new RegExp("^"+ie+"$"),Gr=new RegExp("^"+Ci+"$"),Yr=new RegExp("^[A-Z0-9 $%*+\\-./:]+$");ut.testKanji=function(t){return Kr.test(t)};ut.testNumeric=function(t){return Gr.test(t)};ut.testAlphanumeric=function(t){return Yr.test(t)}});var vt=S(j=>{"use strict";var Jr=so(),lo=ao();j.NUMERIC={id:"Numeric",bit:1,ccBits:[10,12,14]};j.ALPHANUMERIC={id:"Alphanumeric",bit:2,ccBits:[9,11,13]};j.BYTE={id:"Byte",bit:4,ccBits:[8,16,16]};j.KANJI={id:"Kanji",bit:8,ccBits:[8,10,12]};j.MIXED={bit:-1};j.getCharCountIndicator=function(t,e){if(!t.ccBits)throw new Error("Invalid mode: "+t);if(!Jr.isValid(e))throw new Error("Invalid version: "+e);return e>=1&&e<10?t.ccBits[0]:e<27?t.ccBits[1]:t.ccBits[2]};j.getBestModeForData=function(t){return lo.testNumeric(t)?j.NUMERIC:lo.testAlphanumeric(t)?j.ALPHANUMERIC:lo.testKanji(t)?j.KANJI:j.BYTE};j.toString=function(t){if(t&&t.id)return t.id;throw new Error("Invalid mode")};j.isValid=function(t){return t&&t.bit&&t.ccBits};function Qr(r){if(typeof r!="string")throw new Error("Param is not a string");switch(r.toLowerCase()){case"numeric":return j.NUMERIC;case"alphanumeric":return j.ALPHANUMERIC;case"kanji":return j.KANJI;case"byte":return j.BYTE;default:throw new Error("Unknown mode: "+r)}}j.from=function(t,e){if(j.isValid(t))return t;try{return Qr(t)}catch{return e}}});var Si=S(St=>{"use strict";var Pe=wt(),Xr=io(),Ei=Ie(),xt=vt(),co=so(),$i=7973,Ri=Pe.getBCHDigit($i);function Zr(r,t,e){for(let i=1;i<=40;i++)if(t<=St.getCapacity(i,e,r))return i}function _i(r,t){return xt.getCharCountIndicator(r,t)+4}function tn(r,t){let e=0;return r.forEach(function(i){let n=_i(i.mode,t);e+=n+i.getBitsLength()}),e}function en(r,t){for(let e=1;e<=40;e++)if(tn(r,e)<=St.getCapacity(e,t,xt.MIXED))return e}St.from=function(t,e){return co.isValid(t)?parseInt(t,10):e};St.getCapacity=function(t,e,i){if(!co.isValid(t))throw new Error("Invalid QR Code version");typeof i>"u"&&(i=xt.BYTE);let n=Pe.getSymbolTotalCodewords(t),o=Xr.getTotalCodewordsCount(t,e),s=(n-o)*8;if(i===xt.MIXED)return s;let a=s-_i(i,t);switch(i){case xt.NUMERIC:return Math.floor(a/10*3);case xt.ALPHANUMERIC:return Math.floor(a/11*2);case xt.KANJI:return Math.floor(a/13);case xt.BYTE:default:return Math.floor(a/8)}};St.getBestVersionForData=function(t,e){let i,n=Ei.from(e,Ei.M);if(Array.isArray(t)){if(t.length>1)return en(t,n);if(t.length===0)return 1;i=t[0]}else i=t;return Zr(i.mode,i.getLength(),n)};St.getEncodedBits=function(t){if(!co.isValid(t)||t<7)throw new Error("Invalid QR Code version");let e=t<<12;for(;Pe.getBCHDigit(e)-Ri>=0;)e^=$i<<Pe.getBCHDigit(e)-Ri;return t<<12|e}});var Li=S(Ti=>{"use strict";var uo=wt(),Wi=1335,on=21522,Ii=uo.getBCHDigit(Wi);Ti.getEncodedBits=function(t,e){let i=t.bit<<3|e,n=i<<10;for(;uo.getBCHDigit(n)-Ii>=0;)n^=Wi<<uo.getBCHDigit(n)-Ii;return(i<<10|n)^on}});var Ai=S((_d,Bi)=>{"use strict";var rn=vt();function jt(r){this.mode=rn.NUMERIC,this.data=r.toString()}jt.getBitsLength=function(t){return 10*Math.floor(t/3)+(t%3?t%3*3+1:0)};jt.prototype.getLength=function(){return this.data.length};jt.prototype.getBitsLength=function(){return jt.getBitsLength(this.data.length)};jt.prototype.write=function(t){let e,i,n;for(e=0;e+3<=this.data.length;e+=3)i=this.data.substr(e,3),n=parseInt(i,10),t.put(n,10);let o=this.data.length-e;o>0&&(i=this.data.substr(e),n=parseInt(i,10),t.put(n,o*3+1))};Bi.exports=jt});var Oi=S((Sd,Pi)=>{"use strict";var nn=vt(),po=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"," ","$","%","*","+","-",".","/",":"];function zt(r){this.mode=nn.ALPHANUMERIC,this.data=r}zt.getBitsLength=function(t){return 11*Math.floor(t/2)+6*(t%2)};zt.prototype.getLength=function(){return this.data.length};zt.prototype.getBitsLength=function(){return zt.getBitsLength(this.data.length)};zt.prototype.write=function(t){let e;for(e=0;e+2<=this.data.length;e+=2){let i=po.indexOf(this.data[e])*45;i+=po.indexOf(this.data[e+1]),t.put(i,11)}this.data.length%2&&t.put(po.indexOf(this.data[e]),6)};Pi.exports=zt});var ji=S((Id,Di)=>{"use strict";Di.exports=function(t){for(var e=[],i=t.length,n=0;n<i;n++){var o=t.charCodeAt(n);if(o>=55296&&o<=56319&&i>n+1){var s=t.charCodeAt(n+1);s>=56320&&s<=57343&&(o=(o-55296)*1024+s-56320+65536,n+=1)}if(o<128){e.push(o);continue}if(o<2048){e.push(o>>6|192),e.push(o&63|128);continue}if(o<55296||o>=57344&&o<65536){e.push(o>>12|224),e.push(o>>6&63|128),e.push(o&63|128);continue}if(o>=65536&&o<=1114111){e.push(o>>18|240),e.push(o>>12&63|128),e.push(o>>6&63|128),e.push(o&63|128);continue}e.push(239,191,189)}return new Uint8Array(e).buffer}});var ki=S((Wd,zi)=>{"use strict";var sn=ji(),an=vt();function kt(r){this.mode=an.BYTE,typeof r=="string"&&(r=sn(r)),this.data=new Uint8Array(r)}kt.getBitsLength=function(t){return t*8};kt.prototype.getLength=function(){return this.data.length};kt.prototype.getBitsLength=function(){return kt.getBitsLength(this.data.length)};kt.prototype.write=function(r){for(let t=0,e=this.data.length;t<e;t++)r.put(this.data[t],8)};zi.exports=kt});var Ui=S((Td,Ni)=>{"use strict";var ln=vt(),cn=wt();function Nt(r){this.mode=ln.KANJI,this.data=r}Nt.getBitsLength=function(t){return t*13};Nt.prototype.getLength=function(){return this.data.length};Nt.prototype.getBitsLength=function(){return Nt.getBitsLength(this.data.length)};Nt.prototype.write=function(r){let t;for(t=0;t<this.data.length;t++){let e=cn.toSJIS(this.data[t]);if(e>=33088&&e<=40956)e-=33088;else if(e>=57408&&e<=60351)e-=49472;else throw new Error("Invalid SJIS character: "+this.data[t]+`
Make sure your charset is UTF-8`);e=(e>>>8&255)*192+(e&255),r.put(e,13)}};Ni.exports=Nt});var Mi=S((Ld,ho)=>{"use strict";var re={single_source_shortest_paths:function(r,t,e){var i={},n={};n[t]=0;var o=re.PriorityQueue.make();o.push(t,0);for(var s,a,u,b,w,C,R,q,U;!o.empty();){s=o.pop(),a=s.value,b=s.cost,w=r[a]||{};for(u in w)w.hasOwnProperty(u)&&(C=w[u],R=b+C,q=n[u],U=typeof n[u]>"u",(U||q>R)&&(n[u]=R,o.push(u,R),i[u]=a))}if(typeof e<"u"&&typeof n[e]>"u"){var I=["Could not find a path from ",t," to ",e,"."].join("");throw new Error(I)}return i},extract_shortest_path_from_predecessor_list:function(r,t){for(var e=[],i=t,n;i;)e.push(i),n=r[i],i=r[i];return e.reverse(),e},find_path:function(r,t,e){var i=re.single_source_shortest_paths(r,t,e);return re.extract_shortest_path_from_predecessor_list(i,e)},PriorityQueue:{make:function(r){var t=re.PriorityQueue,e={},i;r=r||{};for(i in t)t.hasOwnProperty(i)&&(e[i]=t[i]);return e.queue=[],e.sorter=r.sorter||t.default_sorter,e},default_sorter:function(r,t){return r.cost-t.cost},push:function(r,t){var e={value:r,cost:t};this.queue.push(e),this.queue.sort(this.sorter)},pop:function(){return this.queue.shift()},empty:function(){return this.queue.length===0}}};typeof ho<"u"&&(ho.exports=re)});var Ji=S(Ut=>{"use strict";var _=vt(),Fi=Ai(),Hi=Oi(),Ki=ki(),Gi=Ui(),ne=ao(),Oe=wt(),un=Mi();function qi(r){return unescape(encodeURIComponent(r)).length}function se(r,t,e){let i=[],n;for(;(n=r.exec(e))!==null;)i.push({data:n[0],index:n.index,mode:t,length:n[0].length});return i}function Yi(r){let t=se(ne.NUMERIC,_.NUMERIC,r),e=se(ne.ALPHANUMERIC,_.ALPHANUMERIC,r),i,n;return Oe.isKanjiModeEnabled()?(i=se(ne.BYTE,_.BYTE,r),n=se(ne.KANJI,_.KANJI,r)):(i=se(ne.BYTE_KANJI,_.BYTE,r),n=[]),t.concat(e,i,n).sort(function(s,a){return s.index-a.index}).map(function(s){return{data:s.data,mode:s.mode,length:s.length}})}function mo(r,t){switch(t){case _.NUMERIC:return Fi.getBitsLength(r);case _.ALPHANUMERIC:return Hi.getBitsLength(r);case _.KANJI:return Gi.getBitsLength(r);case _.BYTE:return Ki.getBitsLength(r)}}function dn(r){return r.reduce(function(t,e){let i=t.length-1>=0?t[t.length-1]:null;return i&&i.mode===e.mode?(t[t.length-1].data+=e.data,t):(t.push(e),t)},[])}function pn(r){let t=[];for(let e=0;e<r.length;e++){let i=r[e];switch(i.mode){case _.NUMERIC:t.push([i,{data:i.data,mode:_.ALPHANUMERIC,length:i.length},{data:i.data,mode:_.BYTE,length:i.length}]);break;case _.ALPHANUMERIC:t.push([i,{data:i.data,mode:_.BYTE,length:i.length}]);break;case _.KANJI:t.push([i,{data:i.data,mode:_.BYTE,length:qi(i.data)}]);break;case _.BYTE:t.push([{data:i.data,mode:_.BYTE,length:qi(i.data)}])}}return t}function hn(r,t){let e={},i={start:{}},n=["start"];for(let o=0;o<r.length;o++){let s=r[o],a=[];for(let u=0;u<s.length;u++){let b=s[u],w=""+o+u;a.push(w),e[w]={node:b,lastCount:0},i[w]={};for(let C=0;C<n.length;C++){let R=n[C];e[R]&&e[R].node.mode===b.mode?(i[R][w]=mo(e[R].lastCount+b.length,b.mode)-mo(e[R].lastCount,b.mode),e[R].lastCount+=b.length):(e[R]&&(e[R].lastCount=b.length),i[R][w]=mo(b.length,b.mode)+4+_.getCharCountIndicator(b.mode,t))}}n=a}for(let o=0;o<n.length;o++)i[n[o]].end=0;return{map:i,table:e}}function Vi(r,t){let e,i=_.getBestModeForData(r);if(e=_.from(t,i),e!==_.BYTE&&e.bit<i.bit)throw new Error('"'+r+'" cannot be encoded with mode '+_.toString(e)+`.
 Suggested mode is: `+_.toString(i));switch(e===_.KANJI&&!Oe.isKanjiModeEnabled()&&(e=_.BYTE),e){case _.NUMERIC:return new Fi(r);case _.ALPHANUMERIC:return new Hi(r);case _.KANJI:return new Gi(r);case _.BYTE:return new Ki(r)}}Ut.fromArray=function(t){return t.reduce(function(e,i){return typeof i=="string"?e.push(Vi(i,null)):i.data&&e.push(Vi(i.data,i.mode)),e},[])};Ut.fromString=function(t,e){let i=Yi(t,Oe.isKanjiModeEnabled()),n=pn(i),o=hn(n,e),s=un.find_path(o.map,"start","end"),a=[];for(let u=1;u<s.length-1;u++)a.push(o.table[s[u]].node);return Ut.fromArray(dn(a))};Ut.rawSplit=function(t){return Ut.fromArray(Yi(t,Oe.isKanjiModeEnabled()))}});var Xi=S(Qi=>{"use strict";var je=wt(),fo=Ie(),mn=li(),fn=ui(),gn=di(),wn=mi(),bo=fi(),vo=io(),bn=xi(),De=Si(),vn=Li(),xn=vt(),go=Ji();function yn(r,t){let e=r.size,i=wn.getPositions(t);for(let n=0;n<i.length;n++){let o=i[n][0],s=i[n][1];for(let a=-1;a<=7;a++)if(!(o+a<=-1||e<=o+a))for(let u=-1;u<=7;u++)s+u<=-1||e<=s+u||(a>=0&&a<=6&&(u===0||u===6)||u>=0&&u<=6&&(a===0||a===6)||a>=2&&a<=4&&u>=2&&u<=4?r.set(o+a,s+u,!0,!0):r.set(o+a,s+u,!1,!0))}}function Cn(r){let t=r.size;for(let e=8;e<t-8;e++){let i=e%2===0;r.set(e,6,i,!0),r.set(6,e,i,!0)}}function En(r,t){let e=gn.getPositions(t);for(let i=0;i<e.length;i++){let n=e[i][0],o=e[i][1];for(let s=-2;s<=2;s++)for(let a=-2;a<=2;a++)s===-2||s===2||a===-2||a===2||s===0&&a===0?r.set(n+s,o+a,!0,!0):r.set(n+s,o+a,!1,!0)}}function Rn(r,t){let e=r.size,i=De.getEncodedBits(t),n,o,s;for(let a=0;a<18;a++)n=Math.floor(a/3),o=a%3+e-8-3,s=(i>>a&1)===1,r.set(n,o,s,!0),r.set(o,n,s,!0)}function wo(r,t,e){let i=r.size,n=vn.getEncodedBits(t,e),o,s;for(o=0;o<15;o++)s=(n>>o&1)===1,o<6?r.set(o,8,s,!0):o<8?r.set(o+1,8,s,!0):r.set(i-15+o,8,s,!0),o<8?r.set(8,i-o-1,s,!0):o<9?r.set(8,15-o-1+1,s,!0):r.set(8,15-o-1,s,!0);r.set(i-8,8,1,!0)}function $n(r,t){let e=r.size,i=-1,n=e-1,o=7,s=0;for(let a=e-1;a>0;a-=2)for(a===6&&a--;;){for(let u=0;u<2;u++)if(!r.isReserved(n,a-u)){let b=!1;s<t.length&&(b=(t[s]>>>o&1)===1),r.set(n,a-u,b),o--,o===-1&&(s++,o=7)}if(n+=i,n<0||e<=n){n-=i,i=-i;break}}}function _n(r,t,e){let i=new mn;e.forEach(function(u){i.put(u.mode.bit,4),i.put(u.getLength(),xn.getCharCountIndicator(u.mode,r)),u.write(i)});let n=je.getSymbolTotalCodewords(r),o=vo.getTotalCodewordsCount(r,t),s=(n-o)*8;for(i.getLengthInBits()+4<=s&&i.put(0,4);i.getLengthInBits()%8!==0;)i.putBit(0);let a=(s-i.getLengthInBits())/8;for(let u=0;u<a;u++)i.put(u%2?17:236,8);return Sn(i,r,t)}function Sn(r,t,e){let i=je.getSymbolTotalCodewords(t),n=vo.getTotalCodewordsCount(t,e),o=i-n,s=vo.getBlocksCount(t,e),a=i%s,u=s-a,b=Math.floor(i/s),w=Math.floor(o/s),C=w+1,R=b-w,q=new bn(R),U=0,I=new Array(s),$=new Array(s),z=0,W=new Uint8Array(r.buffer);for(let Bt=0;Bt<s;Bt++){let He=Bt<u?w:C;I[Bt]=W.slice(U,U+He),$[Bt]=q.encode(I[Bt]),U+=He,z=Math.max(z,He)}let k=new Uint8Array(i),O=0,D,st;for(D=0;D<z;D++)for(st=0;st<s;st++)D<I[st].length&&(k[O++]=I[st][D]);for(D=0;D<R;D++)for(st=0;st<s;st++)k[O++]=$[st][D];return k}function In(r,t,e,i){let n;if(Array.isArray(r))n=go.fromArray(r);else if(typeof r=="string"){let b=t;if(!b){let w=go.rawSplit(r);b=De.getBestVersionForData(w,e)}n=go.fromString(r,b||40)}else throw new Error("Invalid data");let o=De.getBestVersionForData(n,e);if(!o)throw new Error("The amount of data is too big to be stored in a QR Code");if(!t)t=o;else if(t<o)throw new Error(`
The chosen QR Code version cannot contain this amount of data.
Minimum version required to store current data is: `+o+`.
`);let s=_n(t,e,n),a=je.getSymbolSize(t),u=new fn(a);return yn(u,t),Cn(u),En(u,t),wo(u,e,0),t>=7&&Rn(u,t),$n(u,s),isNaN(i)&&(i=bo.getBestMask(u,wo.bind(null,u,e))),bo.applyMask(i,u),wo(u,e,i),{modules:u,version:t,errorCorrectionLevel:e,maskPattern:i,segments:n}}Qi.create=function(t,e){if(typeof t>"u"||t==="")throw new Error("No input text");let i=fo.M,n,o;return typeof e<"u"&&(i=fo.from(e.errorCorrectionLevel,fo.M),n=De.from(e.version),o=bo.from(e.maskPattern),e.toSJISFunc&&je.setToSJISFunction(e.toSJISFunc)),In(t,n,i,o)}});var xo=S(It=>{"use strict";function Zi(r){if(typeof r=="number"&&(r=r.toString()),typeof r!="string")throw new Error("Color should be defined as hex string");let t=r.slice().replace("#","").split("");if(t.length<3||t.length===5||t.length>8)throw new Error("Invalid hex color: "+r);(t.length===3||t.length===4)&&(t=Array.prototype.concat.apply([],t.map(function(i){return[i,i]}))),t.length===6&&t.push("F","F");let e=parseInt(t.join(""),16);return{r:e>>24&255,g:e>>16&255,b:e>>8&255,a:e&255,hex:"#"+t.slice(0,6).join("")}}It.getOptions=function(t){t||(t={}),t.color||(t.color={});let e=typeof t.margin>"u"||t.margin===null||t.margin<0?4:t.margin,i=t.width&&t.width>=21?t.width:void 0,n=t.scale||4;return{width:i,scale:i?4:n,margin:e,color:{dark:Zi(t.color.dark||"#000000ff"),light:Zi(t.color.light||"#ffffffff")},type:t.type,rendererOpts:t.rendererOpts||{}}};It.getScale=function(t,e){return e.width&&e.width>=t+e.margin*2?e.width/(t+e.margin*2):e.scale};It.getImageWidth=function(t,e){let i=It.getScale(t,e);return Math.floor((t+e.margin*2)*i)};It.qrToImageData=function(t,e,i){let n=e.modules.size,o=e.modules.data,s=It.getScale(n,i),a=Math.floor((n+i.margin*2)*s),u=i.margin*s,b=[i.color.light,i.color.dark];for(let w=0;w<a;w++)for(let C=0;C<a;C++){let R=(w*a+C)*4,q=i.color.light;if(w>=u&&C>=u&&w<a-u&&C<a-u){let U=Math.floor((w-u)/s),I=Math.floor((C-u)/s);q=b[o[U*n+I]?1:0]}t[R++]=q.r,t[R++]=q.g,t[R++]=q.b,t[R]=q.a}}});var tr=S(ze=>{"use strict";var yo=xo();function Wn(r,t,e){r.clearRect(0,0,t.width,t.height),t.style||(t.style={}),t.height=e,t.width=e,t.style.height=e+"px",t.style.width=e+"px"}function Tn(){try{return document.createElement("canvas")}catch{throw new Error("You need to specify a canvas element")}}ze.render=function(t,e,i){let n=i,o=e;typeof n>"u"&&(!e||!e.getContext)&&(n=e,e=void 0),e||(o=Tn()),n=yo.getOptions(n);let s=yo.getImageWidth(t.modules.size,n),a=o.getContext("2d"),u=a.createImageData(s,s);return yo.qrToImageData(u.data,t,n),Wn(a,o,s),a.putImageData(u,0,0),o};ze.renderToDataURL=function(t,e,i){let n=i;typeof n>"u"&&(!e||!e.getContext)&&(n=e,e=void 0),n||(n={});let o=ze.render(t,e,n),s=n.type||"image/png",a=n.rendererOpts||{};return o.toDataURL(s,a.quality)}});var ir=S(or=>{"use strict";var Ln=xo();function er(r,t){let e=r.a/255,i=t+'="'+r.hex+'"';return e<1?i+" "+t+'-opacity="'+e.toFixed(2).slice(1)+'"':i}function Co(r,t,e){let i=r+t;return typeof e<"u"&&(i+=" "+e),i}function Bn(r,t,e){let i="",n=0,o=!1,s=0;for(let a=0;a<r.length;a++){let u=Math.floor(a%t),b=Math.floor(a/t);!u&&!o&&(o=!0),r[a]?(s++,a>0&&u>0&&r[a-1]||(i+=o?Co("M",u+e,.5+b+e):Co("m",n,0),n=0,o=!1),u+1<t&&r[a+1]||(i+=Co("h",s),s=0)):n++}return i}or.render=function(t,e,i){let n=Ln.getOptions(e),o=t.modules.size,s=t.modules.data,a=o+n.margin*2,u=n.color.light.a?"<path "+er(n.color.light,"fill")+' d="M0 0h'+a+"v"+a+'H0z"/>':"",b="<path "+er(n.color.dark,"stroke")+' d="'+Bn(s,o,n.margin)+'"/>',w='viewBox="0 0 '+a+" "+a+'"',R='<svg xmlns="http://www.w3.org/2000/svg" '+(n.width?'width="'+n.width+'" height="'+n.width+'" ':"")+w+' shape-rendering="crispEdges">'+u+b+`</svg>
`;return typeof i=="function"&&i(null,R),R}});var nr=S(ae=>{"use strict";var An=ni(),Eo=Xi(),rr=tr(),Pn=ir();function Ro(r,t,e,i,n){let o=[].slice.call(arguments,1),s=o.length,a=typeof o[s-1]=="function";if(!a&&!An())throw new Error("Callback required as last argument");if(a){if(s<2)throw new Error("Too few arguments provided");s===2?(n=e,e=t,t=i=void 0):s===3&&(t.getContext&&typeof n>"u"?(n=i,i=void 0):(n=i,i=e,e=t,t=void 0))}else{if(s<1)throw new Error("Too few arguments provided");return s===1?(e=t,t=i=void 0):s===2&&!t.getContext&&(i=e,e=t,t=void 0),new Promise(function(u,b){try{let w=Eo.create(e,i);u(r(w,t,i))}catch(w){b(w)}})}try{let u=Eo.create(e,i);n(null,r(u,t,i))}catch(u){n(u)}}ae.create=Eo.create;ae.toCanvas=Ro.bind(null,rr.render);ae.toDataURL=Ro.bind(null,rr.renderToDataURL);ae.toString=Ro.bind(null,function(r,t,e){return Pn.render(r,e)})});var ko=g`
  :host {
    position: relative;
    background-color: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    width: var(--local-size);
    height: var(--local-size);
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host > wui-flex {
    overflow: hidden;
    border-radius: inherit;
    border-radius: var(--local-border-radius);
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host([name='Extension'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  :host([data-wallet-icon='allWallets']) {
    background-color: var(--wui-all-wallets-bg-100);
  }

  :host([data-wallet-icon='allWallets'])::after {
    border: 1px solid var(--wui-color-accent-glass-010);
  }

  wui-icon[data-parent-size='inherit'] {
    width: 75%;
    height: 75%;
    align-items: center;
  }

  wui-icon[data-parent-size='sm'] {
    width: 18px;
    height: 18px;
  }

  wui-icon[data-parent-size='md'] {
    width: 24px;
    height: 24px;
  }

  wui-icon[data-parent-size='lg'] {
    width: 42px;
    height: 42px;
  }

  wui-icon[data-parent-size='full'] {
    width: 100%;
    height: 100%;
  }

  :host > wui-icon-box {
    position: absolute;
    overflow: hidden;
    right: -1px;
    bottom: -2px;
    z-index: 1;
    border: 2px solid var(--wui-color-bg-150, #1e1f1f);
    padding: 1px;
  }
`;var Ct=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},lt=class extends p{constructor(){super(...arguments),this.size="md",this.name="",this.installed=!1,this.badgeSize="xs"}render(){let t="xxs";return this.size==="lg"?t="m":this.size==="md"?t="xs":t="xxs",this.style.cssText=`
       --local-border-radius: var(--wui-border-radius-${t});
       --local-size: var(--wui-wallet-image-size-${this.size});
   `,this.walletIcon&&(this.dataset.walletIcon=this.walletIcon),l`
      <wui-flex justifyContent="center" alignItems="center"> ${this.templateVisual()} </wui-flex>
    `}templateVisual(){return this.imageSrc?l`<wui-image src=${this.imageSrc} alt=${this.name}></wui-image>`:this.walletIcon?l`<wui-icon
        data-parent-size="md"
        size="md"
        color="inherit"
        name=${this.walletIcon}
      ></wui-icon>`:l`<wui-icon
      data-parent-size=${this.size}
      size="inherit"
      color="inherit"
      name="walletPlaceholder"
    ></wui-icon>`}};lt.styles=[L,y,ko];Ct([c()],lt.prototype,"size",void 0);Ct([c()],lt.prototype,"name",void 0);Ct([c()],lt.prototype,"imageSrc",void 0);Ct([c()],lt.prototype,"walletIcon",void 0);Ct([c({type:Boolean})],lt.prototype,"installed",void 0);Ct([c()],lt.prototype,"badgeSize",void 0);lt=Ct([d("wui-wallet-image")],lt);var No=g`
  :host {
    position: relative;
    border-radius: var(--wui-border-radius-xxs);
    width: 40px;
    height: 40px;
    overflow: hidden;
    background: var(--wui-color-gray-glass-002);
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: var(--wui-spacing-4xs);
    padding: 3.75px !important;
  }

  :host::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-gray-glass-010);
    pointer-events: none;
  }

  :host > wui-wallet-image {
    width: 14px;
    height: 14px;
    border-radius: var(--wui-border-radius-5xs);
  }

  :host > wui-flex {
    padding: 2px;
    position: fixed;
    overflow: hidden;
    left: 34px;
    bottom: 8px;
    background: var(--dark-background-150, #1e1f1f);
    border-radius: 50%;
    z-index: 2;
    display: flex;
  }
`;var Uo=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Ye=4,he=class extends p{constructor(){super(...arguments),this.walletImages=[]}render(){let t=this.walletImages.length<Ye;return l`${this.walletImages.slice(0,Ye).map(({src:e,walletName:i})=>l`
            <wui-wallet-image
              size="inherit"
              imageSrc=${e}
              name=${h(i)}
            ></wui-wallet-image>
          `)}
      ${t?[...Array(Ye-this.walletImages.length)].map(()=>l` <wui-wallet-image size="inherit" name=""></wui-wallet-image>`):null}
      <wui-flex>
        <wui-icon-box
          size="xxs"
          iconSize="xxs"
          iconcolor="success-100"
          backgroundcolor="success-100"
          icon="checkmark"
          background="opaque"
        ></wui-icon-box>
      </wui-flex>`}};he.styles=[y,No];Uo([c({type:Array})],he.prototype,"walletImages",void 0);he=Uo([d("wui-all-wallets-image")],he);var Mo=g`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 7px var(--wui-spacing-l) 7px var(--wui-spacing-xs);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-100);
  }

  button > wui-text:nth-child(2) {
    display: flex;
    flex: 1;
  }

  button:disabled {
    background-color: var(--wui-color-gray-glass-015);
    color: var(--wui-color-gray-glass-015);
  }

  button:disabled > wui-tag {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-300);
  }

  wui-icon {
    color: var(--wui-color-fg-200) !important;
  }
`;var V=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},M=class extends p{constructor(){super(...arguments),this.walletImages=[],this.imageSrc="",this.name="",this.tabIdx=void 0,this.installed=!1,this.disabled=!1,this.showAllWallets=!1,this.loading=!1,this.loadingSpinnerColor="accent-100"}render(){return l`
      <button ?disabled=${this.disabled} tabindex=${h(this.tabIdx)}>
        ${this.templateAllWallets()} ${this.templateWalletImage()}
        <wui-text variant="paragraph-500" color="inherit">${this.name}</wui-text>
        ${this.templateStatus()}
      </button>
    `}templateAllWallets(){return this.showAllWallets&&this.imageSrc?l` <wui-all-wallets-image .imageeSrc=${this.imageSrc}> </wui-all-wallets-image> `:this.showAllWallets&&this.walletIcon?l` <wui-wallet-image .walletIcon=${this.walletIcon} size="sm"> </wui-wallet-image> `:null}templateWalletImage(){return!this.showAllWallets&&this.imageSrc?l`<wui-wallet-image
        size="sm"
        imageSrc=${this.imageSrc}
        name=${this.name}
        .installed=${this.installed}
      ></wui-wallet-image>`:!this.showAllWallets&&!this.imageSrc?l`<wui-wallet-image size="sm" name=${this.name}></wui-wallet-image>`:null}templateStatus(){return this.loading?l`<wui-loading-spinner
        size="lg"
        color=${this.loadingSpinnerColor}
      ></wui-loading-spinner>`:this.tagLabel&&this.tagVariant?l`<wui-tag variant=${this.tagVariant}>${this.tagLabel}</wui-tag>`:this.icon?l`<wui-icon color="inherit" size="sm" name=${this.icon}></wui-icon>`:null}};M.styles=[y,L,Mo];V([c({type:Array})],M.prototype,"walletImages",void 0);V([c()],M.prototype,"imageSrc",void 0);V([c()],M.prototype,"name",void 0);V([c()],M.prototype,"tagLabel",void 0);V([c()],M.prototype,"tagVariant",void 0);V([c()],M.prototype,"icon",void 0);V([c()],M.prototype,"walletIcon",void 0);V([c()],M.prototype,"tabIdx",void 0);V([c({type:Boolean})],M.prototype,"installed",void 0);V([c({type:Boolean})],M.prototype,"disabled",void 0);V([c({type:Boolean})],M.prototype,"showAllWallets",void 0);V([c({type:Boolean})],M.prototype,"loading",void 0);V([c({type:String})],M.prototype,"loadingSpinnerColor",void 0);M=V([d("wui-list-wallet")],M);var Kt=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Pt=class extends p{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=x.state.connectors,this.count=T.state.count,this.isFetchingRecommendedWallets=T.state.isFetchingRecommendedWallets,this.unsubscribe.push(x.subscribeKey("connectors",t=>this.connectors=t),T.subscribeKey("count",t=>this.count=t),T.subscribeKey("isFetchingRecommendedWallets",t=>this.isFetchingRecommendedWallets=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.find(a=>a.id==="walletConnect"),{allWallets:e}=H.state;if(!t||e==="HIDE"||e==="ONLY_MOBILE"&&!f.isMobile())return null;let i=T.state.featured.length,n=this.count+i,o=n<10?n:Math.floor(n/10)*10,s=o<n?`${o}+`:`${o}`;return l`
      <wui-list-wallet
        name="All Wallets"
        walletIcon="allWallets"
        showAllWallets
        @click=${this.onAllWallets.bind(this)}
        tagLabel=${s}
        tagVariant="shade"
        data-testid="all-wallets"
        tabIdx=${h(this.tabIdx)}
        .loading=${this.isFetchingRecommendedWallets}
        loadingSpinnerColor=${this.isFetchingRecommendedWallets?"fg-300":"accent-100"}
      ></wui-list-wallet>
    `}onAllWallets(){N.sendEvent({type:"track",event:"CLICK_ALL_WALLETS"}),E.push("AllWallets")}};Kt([c()],Pt.prototype,"tabIdx",void 0);Kt([m()],Pt.prototype,"connectors",void 0);Kt([m()],Pt.prototype,"count",void 0);Kt([m()],Pt.prototype,"isFetchingRecommendedWallets",void 0);Pt=Kt([d("w3m-all-wallets-widget")],Pt);var Je=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},me=class extends p{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=x.state.connectors,this.unsubscribe.push(x.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(e=>e.type==="ANNOUNCED");return t?.length?l`
      <wui-flex flexDirection="column" gap="xs">
        ${t.filter(at.showConnector).map(e=>l`
              <wui-list-wallet
                imageSrc=${h(B.getConnectorImage(e))}
                name=${e.name??"Unknown"}
                @click=${()=>this.onConnector(e)}
                tagVariant="success"
                tagLabel="installed"
                data-testid=${`wallet-selector-${e.id}`}
                .installed=${!0}
                tabIdx=${h(this.tabIdx)}
              >
              </wui-list-wallet>
            `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){t.id==="walletConnect"?f.isMobile()?E.push("AllWallets"):E.push("ConnectingWalletConnect"):E.push("ConnectingExternal",{connector:t})}};Je([c()],me.prototype,"tabIdx",void 0);Je([m()],me.prototype,"connectors",void 0);me=Je([d("w3m-connect-announced-widget")],me);var fe=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Gt=class extends p{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=x.state.connectors,this.loading=!1,this.unsubscribe.push(x.subscribeKey("connectors",t=>this.connectors=t)),f.isTelegram()&&f.isIos()&&(this.loading=!v.state.wcUri,this.unsubscribe.push(v.subscribeKey("wcUri",t=>this.loading=!t)))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let{customWallets:t}=H.state;if(!t?.length)return this.style.cssText="display: none",null;let e=this.filterOutDuplicateWallets(t);return l`<wui-flex flexDirection="column" gap="xs">
      ${e.map(i=>l`
          <wui-list-wallet
            imageSrc=${h(B.getWalletImage(i))}
            name=${i.name??"Unknown"}
            @click=${()=>this.onConnectWallet(i)}
            data-testid=${`wallet-selector-${i.id}`}
            tabIdx=${h(this.tabIdx)}
            ?loading=${this.loading}
          >
          </wui-list-wallet>
        `)}
    </wui-flex>`}filterOutDuplicateWallets(t){let e=ht.getRecentWallets(),i=this.connectors.map(a=>a.info?.rdns).filter(Boolean),n=e.map(a=>a.rdns).filter(Boolean),o=i.concat(n);if(o.includes("io.metamask.mobile")&&f.isMobile()){let a=o.indexOf("io.metamask.mobile");o[a]="io.metamask"}return t.filter(a=>!o.includes(String(a?.rdns)))}onConnectWallet(t){this.loading||E.push("ConnectingWalletConnect",{wallet:t})}};fe([c()],Gt.prototype,"tabIdx",void 0);fe([m()],Gt.prototype,"connectors",void 0);fe([m()],Gt.prototype,"loading",void 0);Gt=fe([d("w3m-connect-custom-widget")],Gt);var Qe=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},ge=class extends p{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=x.state.connectors,this.unsubscribe.push(x.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let i=this.connectors.filter(n=>n.type==="EXTERNAL").filter(at.showConnector).filter(n=>n.id!==Po.CONNECTOR_ID.COINBASE_SDK);return i?.length?l`
      <wui-flex flexDirection="column" gap="xs">
        ${i.map(n=>l`
            <wui-list-wallet
              imageSrc=${h(B.getConnectorImage(n))}
              .installed=${!0}
              name=${n.name??"Unknown"}
              data-testid=${`wallet-selector-external-${n.id}`}
              @click=${()=>this.onConnector(n)}
              tabIdx=${h(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){E.push("ConnectingExternal",{connector:t})}};Qe([c()],ge.prototype,"tabIdx",void 0);Qe([m()],ge.prototype,"connectors",void 0);ge=Qe([d("w3m-connect-external-widget")],ge);var Xe=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},we=class extends p{constructor(){super(...arguments),this.tabIdx=void 0,this.wallets=[]}render(){return this.wallets.length?l`
      <wui-flex flexDirection="column" gap="xs">
        ${this.wallets.map(t=>l`
            <wui-list-wallet
              data-testid=${`wallet-selector-featured-${t.id}`}
              imageSrc=${h(B.getWalletImage(t))}
              name=${t.name??"Unknown"}
              @click=${()=>this.onConnectWallet(t)}
              tabIdx=${h(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){x.selectWalletConnector(t)}};Xe([c()],we.prototype,"tabIdx",void 0);Xe([c()],we.prototype,"wallets",void 0);we=Xe([d("w3m-connect-featured-widget")],we);var Ze=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},be=class extends p{constructor(){super(...arguments),this.tabIdx=void 0,this.connectors=[]}render(){let t=this.connectors;return!t?.length||t.length===1&&t[0]?.name==="Browser Wallet"&&!f.isMobile()?(this.style.cssText="display: none",null):l`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(e=>{let i=e.info?.rdns;return!f.isMobile()&&e.name==="Browser Wallet"?null:!i&&!v.checkInstalled()?(this.style.cssText="display: none",null):at.showConnector(e)?l`
            <wui-list-wallet
              imageSrc=${h(B.getConnectorImage(e))}
              .installed=${!0}
              name=${e.name??"Unknown"}
              tagVariant="success"
              tagLabel="installed"
              data-testid=${`wallet-selector-${e.id}`}
              @click=${()=>this.onConnector(e)}
              tabIdx=${h(this.tabIdx)}
            >
            </wui-list-wallet>
          `:null})}
      </wui-flex>
    `}onConnector(t){x.setActiveConnector(t),E.push("ConnectingExternal",{connector:t})}};Ze([c()],be.prototype,"tabIdx",void 0);Ze([c()],be.prototype,"connectors",void 0);be=Ze([d("w3m-connect-injected-widget")],be);var to=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},ve=class extends p{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=x.state.connectors,this.unsubscribe.push(x.subscribeKey("connectors",t=>this.connectors=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.connectors.filter(e=>e.type==="MULTI_CHAIN"&&e.name!=="WalletConnect");return t?.length?l`
      <wui-flex flexDirection="column" gap="xs">
        ${t.map(e=>l`
            <wui-list-wallet
              imageSrc=${h(B.getConnectorImage(e))}
              .installed=${!0}
              name=${e.name??"Unknown"}
              tagVariant="shade"
              tagLabel="multichain"
              data-testid=${`wallet-selector-${e.id}`}
              @click=${()=>this.onConnector(e)}
              tabIdx=${h(this.tabIdx)}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnector(t){x.setActiveConnector(t),E.push("ConnectingMultiChain")}};to([c()],ve.prototype,"tabIdx",void 0);to([m()],ve.prototype,"connectors",void 0);ve=to([d("w3m-connect-multi-chain-widget")],ve);var xe=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Yt=class extends p{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=x.state.connectors,this.loading=!1,this.unsubscribe.push(x.subscribeKey("connectors",t=>this.connectors=t)),f.isTelegram()&&f.isIos()&&(this.loading=!v.state.wcUri,this.unsubscribe.push(v.subscribeKey("wcUri",t=>this.loading=!t)))}render(){let e=ht.getRecentWallets().filter(i=>!mt.isExcluded(i)).filter(i=>!this.hasWalletConnector(i)).filter(i=>this.isWalletCompatibleWithCurrentChain(i));return e.length?l`
      <wui-flex flexDirection="column" gap="xs">
        ${e.map(i=>l`
            <wui-list-wallet
              imageSrc=${h(B.getWalletImage(i))}
              name=${i.name??"Unknown"}
              @click=${()=>this.onConnectWallet(i)}
              tagLabel="recent"
              tagVariant="shade"
              tabIdx=${h(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){this.loading||x.selectWalletConnector(t)}hasWalletConnector(t){return this.connectors.some(e=>e.id===t.id||e.name===t.name)}isWalletCompatibleWithCurrentChain(t){let e=Ht.state.activeChain;return e&&t.chains?t.chains.some(i=>{let n=i.split(":")[0];return e===n}):!0}};xe([c()],Yt.prototype,"tabIdx",void 0);xe([m()],Yt.prototype,"connectors",void 0);xe([m()],Yt.prototype,"loading",void 0);Yt=xe([d("w3m-connect-recent-widget")],Yt);var ye=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Jt=class extends p{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.wallets=[],this.loading=!1,f.isTelegram()&&f.isIos()&&(this.loading=!v.state.wcUri,this.unsubscribe.push(v.subscribeKey("wcUri",t=>this.loading=!t)))}render(){let{connectors:t}=x.state,{customWallets:e,featuredWalletIds:i}=H.state,n=ht.getRecentWallets(),o=t.find(C=>C.id==="walletConnect"),a=t.filter(C=>C.type==="INJECTED"||C.type==="ANNOUNCED"||C.type==="MULTI_CHAIN").filter(C=>C.name!=="Browser Wallet");if(!o)return null;if(i||e||!this.wallets.length)return this.style.cssText="display: none",null;let u=a.length+n.length,b=Math.max(0,2-u),w=mt.filterOutDuplicateWallets(this.wallets).slice(0,b);return w.length?l`
      <wui-flex flexDirection="column" gap="xs">
        ${w.map(C=>l`
            <wui-list-wallet
              imageSrc=${h(B.getWalletImage(C))}
              name=${C?.name??"Unknown"}
              @click=${()=>this.onConnectWallet(C)}
              tabIdx=${h(this.tabIdx)}
              ?loading=${this.loading}
            >
            </wui-list-wallet>
          `)}
      </wui-flex>
    `:(this.style.cssText="display: none",null)}onConnectWallet(t){if(this.loading)return;let e=x.getConnector(t.id,t.rdns);e?E.push("ConnectingExternal",{connector:e}):E.push("ConnectingWalletConnect",{wallet:t})}};ye([c()],Jt.prototype,"tabIdx",void 0);ye([c()],Jt.prototype,"wallets",void 0);ye([m()],Jt.prototype,"loading",void 0);Jt=ye([d("w3m-connect-recommended-widget")],Jt);var Ce=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Qt=class extends p{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=x.state.connectors,this.connectorImages=Ke.state.connectorImages,this.unsubscribe.push(x.subscribeKey("connectors",t=>this.connectors=t),Ke.subscribeKey("connectorImages",t=>this.connectorImages=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){if(f.isMobile())return this.style.cssText="display: none",null;let t=this.connectors.find(i=>i.id==="walletConnect");if(!t)return this.style.cssText="display: none",null;let e=t.imageUrl||this.connectorImages[t?.imageId??""];return l`
      <wui-list-wallet
        imageSrc=${h(e)}
        name=${t.name??"Unknown"}
        @click=${()=>this.onConnector(t)}
        tagLabel="qr code"
        tagVariant="main"
        tabIdx=${h(this.tabIdx)}
        data-testid="wallet-selector-walletconnect"
      >
      </wui-list-wallet>
    `}onConnector(t){x.setActiveConnector(t),E.push("ConnectingWalletConnect")}};Ce([c()],Qt.prototype,"tabIdx",void 0);Ce([m()],Qt.prototype,"connectors",void 0);Ce([m()],Qt.prototype,"connectorImages",void 0);Qt=Ce([d("w3m-connect-walletconnect-widget")],Qt);var qo=g`
  :host {
    margin-top: var(--wui-spacing-3xs);
  }
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }
`;var Xt=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Et=class extends p{constructor(){super(),this.unsubscribe=[],this.tabIdx=void 0,this.connectors=x.state.connectors,this.recommended=T.state.recommended,this.featured=T.state.featured,this.unsubscribe.push(x.subscribeKey("connectors",t=>this.connectors=t),T.subscribeKey("recommended",t=>this.recommended=t),T.subscribeKey("featured",t=>this.featured=t))}disconnectedCallback(){this.unsubscribe.forEach(t=>t())}render(){return l`
      <wui-flex flexDirection="column" gap="xs"> ${this.connectorListTemplate()} </wui-flex>
    `}connectorListTemplate(){let{custom:t,recent:e,announced:i,injected:n,multiChain:o,recommended:s,featured:a,external:u}=at.getConnectorsByType(this.connectors,this.recommended,this.featured);return at.getConnectorTypeOrder({custom:t,recent:e,announced:i,injected:n,multiChain:o,recommended:s,featured:a,external:u}).map(w=>{switch(w){case"injected":return l`
            ${o.length?l`<w3m-connect-multi-chain-widget
                  tabIdx=${h(this.tabIdx)}
                ></w3m-connect-multi-chain-widget>`:null}
            ${i.length?l`<w3m-connect-announced-widget
                  tabIdx=${h(this.tabIdx)}
                ></w3m-connect-announced-widget>`:null}
            ${n.length?l`<w3m-connect-injected-widget
                  .connectors=${n}
                  tabIdx=${h(this.tabIdx)}
                ></w3m-connect-injected-widget>`:null}
          `;case"walletConnect":return l`<w3m-connect-walletconnect-widget
            tabIdx=${h(this.tabIdx)}
          ></w3m-connect-walletconnect-widget>`;case"recent":return l`<w3m-connect-recent-widget
            tabIdx=${h(this.tabIdx)}
          ></w3m-connect-recent-widget>`;case"featured":return l`<w3m-connect-featured-widget
            .wallets=${a}
            tabIdx=${h(this.tabIdx)}
          ></w3m-connect-featured-widget>`;case"custom":return l`<w3m-connect-custom-widget
            tabIdx=${h(this.tabIdx)}
          ></w3m-connect-custom-widget>`;case"external":return l`<w3m-connect-external-widget
            tabIdx=${h(this.tabIdx)}
          ></w3m-connect-external-widget>`;case"recommended":return l`<w3m-connect-recommended-widget
            .wallets=${s}
            tabIdx=${h(this.tabIdx)}
          ></w3m-connect-recommended-widget>`;default:return console.warn(`Unknown connector type: ${w}`),null}})}};Et.styles=qo;Xt([c()],Et.prototype,"tabIdx",void 0);Xt([m()],Et.prototype,"connectors",void 0);Xt([m()],Et.prototype,"recommended",void 0);Xt([m()],Et.prototype,"featured",void 0);Et=Xt([d("w3m-connector-list")],Et);var Vo=g`
  :host {
    display: inline-flex;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-3xl);
    padding: var(--wui-spacing-3xs);
    position: relative;
    height: 36px;
    min-height: 36px;
    overflow: hidden;
  }

  :host::before {
    content: '';
    position: absolute;
    pointer-events: none;
    top: 4px;
    left: 4px;
    display: block;
    width: var(--local-tab-width);
    height: 28px;
    border-radius: var(--wui-border-radius-3xl);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transform: translateX(calc(var(--local-tab) * var(--local-tab-width)));
    transition: transform var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color, opacity;
  }

  :host([data-type='flex'])::before {
    left: 3px;
    transform: translateX(calc((var(--local-tab) * 34px) + (var(--local-tab) * 4px)));
  }

  :host([data-type='flex']) {
    display: flex;
    padding: 0px 0px 0px 12px;
    gap: 4px;
  }

  :host([data-type='flex']) > button > wui-text {
    position: absolute;
    left: 18px;
    opacity: 0;
  }

  button[data-active='true'] > wui-icon,
  button[data-active='true'] > wui-text {
    color: var(--wui-color-fg-100);
  }

  button[data-active='false'] > wui-icon,
  button[data-active='false'] > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='true']:disabled,
  button[data-active='false']:disabled {
    background-color: transparent;
    opacity: 0.5;
    cursor: not-allowed;
  }

  button[data-active='true']:disabled > wui-text {
    color: var(--wui-color-fg-200);
  }

  button[data-active='false']:disabled > wui-text {
    color: var(--wui-color-fg-300);
  }

  button > wui-icon,
  button > wui-text {
    pointer-events: none;
    transition: color var(--wui-e ase-out-power-1) var(--wui-duration-md);
    will-change: color;
  }

  button {
    width: var(--local-tab-width);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
  }

  :host([data-type='flex']) > button {
    width: 34px;
    position: relative;
    display: flex;
    justify-content: flex-start;
  }

  button:hover:enabled,
  button:active:enabled {
    background-color: transparent !important;
  }

  button:hover:enabled > wui-icon,
  button:active:enabled > wui-icon {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button:hover:enabled > wui-text,
  button:active:enabled > wui-text {
    transition: all var(--wui-ease-out-power-1) var(--wui-duration-lg);
    color: var(--wui-color-fg-125);
  }

  button {
    border-radius: var(--wui-border-radius-3xl);
  }
`;var gt=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},it=class extends p{constructor(){super(...arguments),this.tabs=[],this.onTabChange=()=>null,this.buttons=[],this.disabled=!1,this.localTabWidth="100px",this.activeTab=0,this.isDense=!1}render(){return this.isDense=this.tabs.length>3,this.style.cssText=`
      --local-tab: ${this.activeTab};
      --local-tab-width: ${this.localTabWidth};
    `,this.dataset.type=this.isDense?"flex":"block",this.tabs.map((t,e)=>{let i=e===this.activeTab;return l`
        <button
          ?disabled=${this.disabled}
          @click=${()=>this.onTabClick(e)}
          data-active=${i}
          data-testid="tab-${t.label?.toLowerCase()}"
        >
          ${this.iconTemplate(t)}
          <wui-text variant="small-600" color="inherit"> ${t.label} </wui-text>
        </button>
      `})}firstUpdated(){this.shadowRoot&&this.isDense&&(this.buttons=[...this.shadowRoot.querySelectorAll("button")],setTimeout(()=>{this.animateTabs(0,!0)},0))}iconTemplate(t){return t.icon?l`<wui-icon size="xs" color="inherit" name=${t.icon}></wui-icon>`:null}onTabClick(t){this.buttons&&this.animateTabs(t,!1),this.activeTab=t,this.onTabChange(t)}animateTabs(t,e){let i=this.buttons[this.activeTab],n=this.buttons[t],o=i?.querySelector("wui-text"),s=n?.querySelector("wui-text"),a=n?.getBoundingClientRect(),u=s?.getBoundingClientRect();i&&o&&!e&&t!==this.activeTab&&(o.animate([{opacity:0}],{duration:50,easing:"ease",fill:"forwards"}),i.animate([{width:"34px"}],{duration:500,easing:"ease",fill:"forwards"})),n&&a&&u&&s&&(t!==this.activeTab||e)&&(this.localTabWidth=`${Math.round(a.width+u.width)+6}px`,n.animate([{width:`${a.width+u.width}px`}],{duration:e?0:500,fill:"forwards",easing:"ease"}),s.animate([{opacity:1}],{duration:e?0:125,delay:e?0:200,fill:"forwards",easing:"ease"}))}};it.styles=[y,L,Vo];gt([c({type:Array})],it.prototype,"tabs",void 0);gt([c()],it.prototype,"onTabChange",void 0);gt([c({type:Array})],it.prototype,"buttons",void 0);gt([c({type:Boolean})],it.prototype,"disabled",void 0);gt([c()],it.prototype,"localTabWidth",void 0);gt([m()],it.prototype,"activeTab",void 0);gt([m()],it.prototype,"isDense",void 0);it=gt([d("wui-tabs")],it);var Ee=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Zt=class extends p{constructor(){super(),this.platformTabs=[],this.unsubscribe=[],this.platforms=[],this.onSelectPlatfrom=void 0,this.buffering=!1,this.unsubscribe.push(v.subscribeKey("buffering",t=>this.buffering=t))}disconnectCallback(){this.unsubscribe.forEach(t=>t())}render(){let t=this.generateTabs();return l`
      <wui-flex justifyContent="center" .padding=${["0","0","l","0"]}>
        <wui-tabs
          ?disabled=${this.buffering}
          .tabs=${t}
          .onTabChange=${this.onTabChange.bind(this)}
        ></wui-tabs>
      </wui-flex>
    `}generateTabs(){let t=this.platforms.map(e=>e==="browser"?{label:"Browser",icon:"extension",platform:"browser"}:e==="mobile"?{label:"Mobile",icon:"mobile",platform:"mobile"}:e==="qrcode"?{label:"Mobile",icon:"mobile",platform:"qrcode"}:e==="web"?{label:"Webapp",icon:"browser",platform:"web"}:e==="desktop"?{label:"Desktop",icon:"desktop",platform:"desktop"}:{label:"Browser",icon:"extension",platform:"unsupported"});return this.platformTabs=t.map(({platform:e})=>e),t}onTabChange(t){let e=this.platformTabs[t];e&&this.onSelectPlatfrom?.(e)}};Ee([c({type:Array})],Zt.prototype,"platforms",void 0);Ee([c()],Zt.prototype,"onSelectPlatfrom",void 0);Ee([m()],Zt.prototype,"buffering",void 0);Zt=Ee([d("w3m-connecting-header")],Zt);var Fo=g`
  :host {
    width: var(--local-width);
    position: relative;
  }

  button {
    border: none;
    border-radius: var(--local-border-radius);
    width: var(--local-width);
    white-space: nowrap;
  }

  /* -- Sizes --------------------------------------------------- */
  button[data-size='md'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-l);
    height: 36px;
  }

  button[data-size='md'][data-icon-left='true'][data-icon-right='false'] {
    padding: 8.2px var(--wui-spacing-l) 9px var(--wui-spacing-s);
  }

  button[data-size='md'][data-icon-right='true'][data-icon-left='false'] {
    padding: 8.2px var(--wui-spacing-s) 9px var(--wui-spacing-l);
  }

  button[data-size='lg'] {
    padding: var(--wui-spacing-m) var(--wui-spacing-2l);
    height: 48px;
  }

  /* -- Variants --------------------------------------------------------- */
  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='inverse'] {
    background-color: var(--wui-color-inverse-100);
    color: var(--wui-color-inverse-000);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='accent-error'] {
    background: var(--wui-color-error-glass-015);
    color: var(--wui-color-error-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-error-glass-010);
  }

  button[data-variant='accent-success'] {
    background: var(--wui-color-success-glass-015);
    color: var(--wui-color-success-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-success-glass-010);
  }

  button[data-variant='neutral'] {
    background: transparent;
    color: var(--wui-color-fg-100);
    border: none;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  /* -- Focus states --------------------------------------------------- */
  button[data-variant='main']:focus-visible:enabled {
    background-color: var(--wui-color-accent-090);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='inverse']:focus-visible:enabled {
    background-color: var(--wui-color-inverse-100);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent']:focus-visible:enabled {
    background-color: var(--wui-color-accent-glass-010);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0 0 0 4px var(--wui-color-accent-glass-020);
  }
  button[data-variant='accent-error']:focus-visible:enabled {
    background: var(--wui-color-error-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-error-100),
      0 0 0 4px var(--wui-color-error-glass-020);
  }
  button[data-variant='accent-success']:focus-visible:enabled {
    background: var(--wui-color-success-glass-015);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-success-100),
      0 0 0 4px var(--wui-color-success-glass-020);
  }
  button[data-variant='neutral']:focus-visible:enabled {
    background: var(--wui-color-gray-glass-005);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-gray-glass-010),
      0 0 0 4px var(--wui-color-gray-glass-002);
  }

  /* -- Hover & Active states ----------------------------------------------------------- */
  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='accent-error']:hover:enabled {
      background: var(--wui-color-error-glass-020);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-error']:active:enabled {
      background: var(--wui-color-error-glass-030);
      color: var(--wui-color-error-100);
    }

    button[data-variant='accent-success']:hover:enabled {
      background: var(--wui-color-success-glass-020);
      color: var(--wui-color-success-100);
    }

    button[data-variant='accent-success']:active:enabled {
      background: var(--wui-color-success-glass-030);
      color: var(--wui-color-success-100);
    }

    button[data-variant='neutral']:hover:enabled {
      background: var(--wui-color-gray-glass-002);
    }

    button[data-variant='neutral']:active:enabled {
      background: var(--wui-color-gray-glass-005);
    }

    button[data-size='lg'][data-icon-left='true'][data-icon-right='false'] {
      padding-left: var(--wui-spacing-m);
    }

    button[data-size='lg'][data-icon-right='true'][data-icon-left='false'] {
      padding-right: var(--wui-spacing-m);
    }
  }

  /* -- Disabled state --------------------------------------------------- */
  button:disabled {
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    color: var(--wui-color-gray-glass-020);
    cursor: not-allowed;
  }

  button > wui-text {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  ::slotted(*) {
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
    opacity: var(--local-opacity-100);
  }

  wui-loading-spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    opacity: var(--local-opacity-000);
  }
`;var rt=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Ho={main:"inverse-100",inverse:"inverse-000",accent:"accent-100","accent-error":"error-100","accent-success":"success-100",neutral:"fg-100",disabled:"gray-glass-020"},Or={lg:"paragraph-600",md:"small-600"},Dr={lg:"md",md:"md"},G=class extends p{constructor(){super(...arguments),this.size="lg",this.disabled=!1,this.fullWidth=!1,this.loading=!1,this.variant="main",this.hasIconLeft=!1,this.hasIconRight=!1,this.borderRadius="m"}render(){this.style.cssText=`
    --local-width: ${this.fullWidth?"100%":"auto"};
    --local-opacity-100: ${this.loading?0:1};
    --local-opacity-000: ${this.loading?1:0};
    --local-border-radius: var(--wui-border-radius-${this.borderRadius});
    `;let t=this.textVariant??Or[this.size];return l`
      <button
        data-variant=${this.variant}
        data-icon-left=${this.hasIconLeft}
        data-icon-right=${this.hasIconRight}
        data-size=${this.size}
        ?disabled=${this.disabled}
      >
        ${this.loadingTemplate()}
        <slot name="iconLeft" @slotchange=${()=>this.handleSlotLeftChange()}></slot>
        <wui-text variant=${t} color="inherit">
          <slot></slot>
        </wui-text>
        <slot name="iconRight" @slotchange=${()=>this.handleSlotRightChange()}></slot>
      </button>
    `}handleSlotLeftChange(){this.hasIconLeft=!0}handleSlotRightChange(){this.hasIconRight=!0}loadingTemplate(){if(this.loading){let t=Dr[this.size],e=this.disabled?Ho.disabled:Ho[this.variant];return l`<wui-loading-spinner color=${e} size=${t}></wui-loading-spinner>`}return l``}};G.styles=[y,L,Fo];rt([c()],G.prototype,"size",void 0);rt([c({type:Boolean})],G.prototype,"disabled",void 0);rt([c({type:Boolean})],G.prototype,"fullWidth",void 0);rt([c({type:Boolean})],G.prototype,"loading",void 0);rt([c()],G.prototype,"variant",void 0);rt([c({type:Boolean})],G.prototype,"hasIconLeft",void 0);rt([c({type:Boolean})],G.prototype,"hasIconRight",void 0);rt([c()],G.prototype,"borderRadius",void 0);rt([c()],G.prototype,"textVariant",void 0);G=rt([d("wui-button")],G);var Ko=g`
  button {
    padding: var(--wui-spacing-4xs) var(--wui-spacing-xxs);
    border-radius: var(--wui-border-radius-3xs);
    background-color: transparent;
    color: var(--wui-color-accent-100);
  }

  button:disabled {
    background-color: transparent;
    color: var(--wui-color-gray-glass-015);
  }

  button:hover {
    background-color: var(--wui-color-gray-glass-005);
  }
`;var Re=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Ot=class extends p{constructor(){super(...arguments),this.tabIdx=void 0,this.disabled=!1,this.color="inherit"}render(){return l`
      <button ?disabled=${this.disabled} tabindex=${h(this.tabIdx)}>
        <slot name="iconLeft"></slot>
        <wui-text variant="small-600" color=${this.color}>
          <slot></slot>
        </wui-text>
        <slot name="iconRight"></slot>
      </button>
    `}};Ot.styles=[y,L,Ko];Re([c()],Ot.prototype,"tabIdx",void 0);Re([c({type:Boolean})],Ot.prototype,"disabled",void 0);Re([c()],Ot.prototype,"color",void 0);Ot=Re([d("wui-link")],Ot);var Go=g`
  :host {
    display: block;
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  svg {
    width: var(--wui-box-size-md);
    height: var(--wui-box-size-md);
  }

  rect {
    fill: none;
    stroke: var(--wui-color-accent-100);
    stroke-width: 4px;
    stroke-linecap: round;
    animation: dash 1s linear infinite;
  }

  @keyframes dash {
    to {
      stroke-dashoffset: 0px;
    }
  }
`;var Yo=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},$e=class extends p{constructor(){super(...arguments),this.radius=36}render(){return this.svgLoaderTemplate()}svgLoaderTemplate(){let t=this.radius>50?50:this.radius,i=36-t,n=116+i,o=245+i,s=360+i*1.75;return l`
      <svg viewBox="0 0 110 110" width="110" height="110">
        <rect
          x="2"
          y="2"
          width="106"
          height="106"
          rx=${t}
          stroke-dasharray="${n} ${o}"
          stroke-dashoffset=${s}
        />
      </svg>
    `}};$e.styles=[y,Go];Yo([c({type:Number})],$e.prototype,"radius",void 0);$e=Yo([d("wui-loading-thumbnail")],$e);var Jo=g`
  button {
    border: none;
    border-radius: var(--wui-border-radius-3xl);
  }

  button[data-variant='main'] {
    background-color: var(--wui-color-accent-100);
    color: var(--wui-color-inverse-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='accent'] {
    background-color: var(--wui-color-accent-glass-010);
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
  }

  button[data-variant='gray'] {
    background-color: transparent;
    color: var(--wui-color-fg-200);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-variant='shade'] {
    background-color: transparent;
    color: var(--wui-color-accent-100);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  button[data-size='sm'] {
    height: 32px;
    padding: 0 var(--wui-spacing-s);
  }

  button[data-size='md'] {
    height: 40px;
    padding: 0 var(--wui-spacing-l);
  }

  button[data-size='sm'] > wui-image {
    width: 16px;
    height: 16px;
  }

  button[data-size='md'] > wui-image {
    width: 24px;
    height: 24px;
  }

  button[data-size='sm'] > wui-icon {
    width: 12px;
    height: 12px;
  }

  button[data-size='md'] > wui-icon {
    width: 14px;
    height: 14px;
  }

  wui-image {
    border-radius: var(--wui-border-radius-3xl);
    overflow: hidden;
  }

  button.disabled > wui-icon,
  button.disabled > wui-image {
    filter: grayscale(1);
  }

  button[data-variant='main'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-accent-090);
  }

  button[data-variant='shade'] > wui-image,
  button[data-variant='gray'] > wui-image {
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-010);
  }

  @media (hover: hover) and (pointer: fine) {
    button[data-variant='main']:focus-visible {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:hover:enabled {
      background-color: var(--wui-color-accent-090);
    }

    button[data-variant='main']:active:enabled {
      background-color: var(--wui-color-accent-080);
    }

    button[data-variant='accent']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }

    button[data-variant='accent']:active:enabled {
      background-color: var(--wui-color-accent-glass-020);
    }

    button[data-variant='shade']:focus-visible,
    button[data-variant='gray']:focus-visible,
    button[data-variant='shade']:hover,
    button[data-variant='gray']:hover {
      background-color: var(--wui-color-gray-glass-002);
    }

    button[data-variant='gray']:active,
    button[data-variant='shade']:active {
      background-color: var(--wui-color-gray-glass-005);
    }
  }

  button.disabled {
    color: var(--wui-color-gray-glass-020);
    background-color: var(--wui-color-gray-glass-002);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    pointer-events: none;
  }
`;var Rt=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},ct=class extends p{constructor(){super(...arguments),this.variant="accent",this.imageSrc="",this.disabled=!1,this.icon="externalLink",this.size="md",this.text=""}render(){let t=this.size==="sm"?"small-600":"paragraph-600";return l`
      <button
        class=${this.disabled?"disabled":""}
        data-variant=${this.variant}
        data-size=${this.size}
      >
        ${this.imageSrc?l`<wui-image src=${this.imageSrc}></wui-image>`:null}
        <wui-text variant=${t} color="inherit"> ${this.text} </wui-text>
        <wui-icon name=${this.icon} color="inherit" size="inherit"></wui-icon>
      </button>
    `}};ct.styles=[y,L,Jo];Rt([c()],ct.prototype,"variant",void 0);Rt([c()],ct.prototype,"imageSrc",void 0);Rt([c({type:Boolean})],ct.prototype,"disabled",void 0);Rt([c()],ct.prototype,"icon",void 0);Rt([c()],ct.prototype,"size",void 0);Rt([c()],ct.prototype,"text",void 0);ct=Rt([d("wui-chip-button")],ct);var Qo=g`
  wui-flex {
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
  }
`;var _e=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Dt=class extends p{constructor(){super(...arguments),this.disabled=!1,this.label="",this.buttonLabel=""}render(){return l`
      <wui-flex
        justifyContent="space-between"
        alignItems="center"
        .padding=${["1xs","2l","1xs","2l"]}
      >
        <wui-text variant="paragraph-500" color="fg-200">${this.label}</wui-text>
        <wui-chip-button size="sm" variant="shade" text=${this.buttonLabel} icon="chevronRight">
        </wui-chip-button>
      </wui-flex>
    `}};Dt.styles=[y,L,Qo];_e([c({type:Boolean})],Dt.prototype,"disabled",void 0);_e([c()],Dt.prototype,"label",void 0);_e([c()],Dt.prototype,"buttonLabel",void 0);Dt=_e([d("wui-cta-button")],Dt);var Xo=g`
  :host {
    display: block;
    padding: 0 var(--wui-spacing-xl) var(--wui-spacing-xl);
  }
`;var Zo=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Se=class extends p{constructor(){super(...arguments),this.wallet=void 0}render(){if(!this.wallet)return this.style.display="none",null;let{name:t,app_store:e,play_store:i,chrome_store:n,homepage:o}=this.wallet,s=f.isMobile(),a=f.isIos(),u=f.isAndroid(),b=[e,i,o,n].filter(Boolean).length>1,w=Z.getTruncateString({string:t,charsStart:12,charsEnd:0,truncate:"end"});return b&&!s?l`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${()=>E.push("Downloads",{wallet:this.wallet})}
        ></wui-cta-button>
      `:!b&&o?l`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${this.onHomePage.bind(this)}
        ></wui-cta-button>
      `:e&&a?l`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${this.onAppStore.bind(this)}
        ></wui-cta-button>
      `:i&&u?l`
        <wui-cta-button
          label=${`Don't have ${w}?`}
          buttonLabel="Get"
          @click=${this.onPlayStore.bind(this)}
        ></wui-cta-button>
      `:(this.style.display="none",null)}onAppStore(){this.wallet?.app_store&&f.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&f.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&f.openHref(this.wallet.homepage,"_blank")}};Se.styles=[Xo];Zo([c({type:Object})],Se.prototype,"wallet",void 0);Se=Zo([d("w3m-mobile-download-links")],Se);var ti=g`
  @keyframes shake {
    0% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(3px);
    }
    50% {
      transform: translateX(-3px);
    }
    75% {
      transform: translateX(3px);
    }
    100% {
      transform: translateX(0);
    }
  }

  wui-flex:first-child:not(:only-child) {
    position: relative;
  }

  wui-loading-thumbnail {
    position: absolute;
  }

  wui-icon-box {
    position: absolute;
    right: calc(var(--wui-spacing-3xs) * -1);
    bottom: calc(var(--wui-spacing-3xs) * -1);
    opacity: 0;
    transform: scale(0.5);
    transition-property: opacity, transform;
    transition-duration: var(--wui-duration-lg);
    transition-timing-function: var(--wui-ease-out-power-2);
    will-change: opacity, transform;
  }

  wui-text[align='center'] {
    width: 100%;
    padding: 0px var(--wui-spacing-l);
  }

  [data-error='true'] wui-icon-box {
    opacity: 1;
    transform: scale(1);
  }

  [data-error='true'] > wui-flex:first-child {
    animation: shake 250ms cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
  }

  [data-retry='false'] wui-link {
    display: none;
  }

  [data-retry='true'] wui-link {
    display: block;
    opacity: 1;
  }
`;var tt=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},P=class extends p{constructor(){super(),this.wallet=E.state.data?.wallet,this.connector=E.state.data?.connector,this.timeout=void 0,this.secondaryBtnIcon="refresh",this.onConnect=void 0,this.onRender=void 0,this.onAutoConnect=void 0,this.isWalletConnect=!0,this.unsubscribe=[],this.imageSrc=B.getWalletImage(this.wallet)??B.getConnectorImage(this.connector),this.name=this.wallet?.name??this.connector?.name??"Wallet",this.isRetrying=!1,this.uri=v.state.wcUri,this.error=v.state.wcError,this.ready=!1,this.showRetry=!1,this.secondaryBtnLabel="Try again",this.secondaryLabel="Accept connection request in the wallet",this.buffering=!1,this.isLoading=!1,this.isMobile=!1,this.onRetry=void 0,this.unsubscribe.push(v.subscribeKey("wcUri",t=>{this.uri=t,this.isRetrying&&this.onRetry&&(this.isRetrying=!1,this.onConnect?.())}),v.subscribeKey("wcError",t=>this.error=t),v.subscribeKey("buffering",t=>this.buffering=t)),(f.isTelegram()||f.isSafari())&&f.isIos()&&v.state.wcUri&&this.onConnect?.()}firstUpdated(){this.onAutoConnect?.(),this.showRetry=!this.onAutoConnect}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),clearTimeout(this.timeout)}render(){this.onRender?.(),this.onShowRetry();let t=this.error?"Connection can be declined if a previous request is still active":this.secondaryLabel,e=`Continue in ${this.name}`;return this.buffering&&(e="Connecting..."),this.error&&(e="Connection declined"),l`
      <wui-flex
        data-error=${h(this.error)}
        data-retry=${this.showRetry}
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center">
          <wui-wallet-image size="lg" imageSrc=${h(this.imageSrc)}></wui-wallet-image>

          ${this.error?null:this.loaderTemplate()}

          <wui-icon-box
            backgroundColor="error-100"
            background="opaque"
            iconColor="error-100"
            icon="close"
            size="sm"
            border
            borderColor="wui-color-bg-125"
          ></wui-icon-box>
        </wui-flex>

        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text variant="paragraph-500" color=${this.error?"error-100":"fg-100"}>
            ${e}
          </wui-text>
          <wui-text align="center" variant="small-500" color="fg-200">${t}</wui-text>
        </wui-flex>

        ${this.secondaryBtnLabel?l`
              <wui-button
                variant="accent"
                size="md"
                ?disabled=${this.isRetrying||!this.error&&this.buffering||this.isLoading}
                @click=${this.onTryAgain.bind(this)}
                data-testid="w3m-connecting-widget-secondary-button"
              >
                <wui-icon color="inherit" slot="iconLeft" name=${this.secondaryBtnIcon}></wui-icon>
                ${this.secondaryBtnLabel}
              </wui-button>
            `:null}
      </wui-flex>

      ${this.isWalletConnect?l`
            <wui-flex .padding=${["0","xl","xl","xl"]} justifyContent="center">
              <wui-link @click=${this.onCopyUri} color="fg-200" data-testid="wui-link-copy">
                <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
                Copy link
              </wui-link>
            </wui-flex>
          `:null}

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onShowRetry(){this.error&&!this.showRetry&&(this.showRetry=!0,this.shadowRoot?.querySelector("wui-button")?.animate([{opacity:0},{opacity:1}],{fill:"forwards",easing:"ease"}))}onTryAgain(){this.buffering||(v.setWcError(!1),this.onRetry?(this.isRetrying=!0,this.onRetry?.()):this.onConnect?.())}loaderTemplate(){let t=Ft.state.themeVariables["--w3m-border-radius-master"],e=t?parseInt(t.replace("px",""),10):4;return l`<wui-loading-thumbnail radius=${e*9}></wui-loading-thumbnail>`}onCopyUri(){try{this.uri&&(f.copyToClopboard(this.uri),yt.showSuccess("Link copied"))}catch{yt.showError("Failed to copy")}}};P.styles=ti;tt([m()],P.prototype,"isRetrying",void 0);tt([m()],P.prototype,"uri",void 0);tt([m()],P.prototype,"error",void 0);tt([m()],P.prototype,"ready",void 0);tt([m()],P.prototype,"showRetry",void 0);tt([m()],P.prototype,"secondaryBtnLabel",void 0);tt([m()],P.prototype,"secondaryLabel",void 0);tt([m()],P.prototype,"buffering",void 0);tt([m()],P.prototype,"isLoading",void 0);tt([c({type:Boolean})],P.prototype,"isMobile",void 0);tt([c()],P.prototype,"onRetry",void 0);var jr=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},ei=class extends P{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-browser: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onAutoConnect=this.onConnectProxy.bind(this),N.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}onConnectProxy(){return X(this,null,function*(){try{this.error=!1;let{connectors:t}=x.state,e=t.find(i=>i.type==="ANNOUNCED"&&i.info?.rdns===this.wallet?.rdns||i.type==="INJECTED"||i.name===this.wallet?.name);if(e)yield v.connectExternal(e,e.chain);else throw new Error("w3m-connecting-wc-browser: No connector found");pe.close(),N.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:"browser",name:this.wallet?.name||"Unknown"}})}catch(t){N.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:t?.message??"Unknown"}}),this.error=!0}})}};ei=jr([d("w3m-connecting-wc-browser")],ei);var zr=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},oi=class extends P{constructor(){if(super(),!this.wallet)throw new Error("w3m-connecting-wc-desktop: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.onRender=this.onRenderProxy.bind(this),N.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"desktop"}})}onRenderProxy(){!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())}onConnectProxy(){if(this.wallet?.desktop_link&&this.uri)try{this.error=!1;let{desktop_link:t,name:e}=this.wallet,{redirect:i,href:n}=f.formatNativeUrl(t,this.uri);v.setWcLinking({name:e,href:n}),v.setRecentWallet(this.wallet),f.openHref(i,"_blank")}catch{this.error=!0}}};oi=zr([d("w3m-connecting-wc-desktop")],oi);var kr=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},ii=class extends P{constructor(){if(super(),this.btnLabelTimeout=void 0,this.labelTimeout=void 0,this.onRender=()=>{!this.ready&&this.uri&&(this.ready=!0,this.onConnect?.())},this.onConnect=()=>{if(this.wallet?.mobile_link&&this.uri)try{this.error=!1;let{mobile_link:t,name:e}=this.wallet,{redirect:i,href:n}=f.formatNativeUrl(t,this.uri);v.setWcLinking({name:e,href:n}),v.setRecentWallet(this.wallet);let o=f.isIframe()?"_top":"_self";f.openHref(i,o),clearTimeout(this.labelTimeout),this.secondaryLabel=At.CONNECT_LABELS.MOBILE}catch(t){N.sendEvent({type:"track",event:"CONNECT_PROXY_ERROR",properties:{message:t instanceof Error?t.message:"Error parsing the deeplink",uri:this.uri,mobile_link:this.wallet.mobile_link,name:this.wallet.name}}),this.error=!0}},!this.wallet)throw new Error("w3m-connecting-wc-mobile: No wallet provided");this.initializeStateAndTimers(),document.addEventListener("visibilitychange",this.onBuffering.bind(this)),N.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"mobile"}})}disconnectedCallback(){super.disconnectedCallback(),document.removeEventListener("visibilitychange",this.onBuffering.bind(this)),clearTimeout(this.btnLabelTimeout),clearTimeout(this.labelTimeout)}initializeStateAndTimers(){this.secondaryBtnLabel=void 0,this.secondaryLabel=At.CONNECT_LABELS.MOBILE,this.btnLabelTimeout=setTimeout(()=>{this.secondaryBtnLabel="Try again",this.secondaryLabel=At.CONNECT_LABELS.MOBILE},At.FIVE_SEC_MS),this.labelTimeout=setTimeout(()=>{this.secondaryLabel="Hold tight... it's taking longer than expected"},At.THREE_SEC_MS)}onBuffering(){let t=f.isIos();document?.visibilityState==="visible"&&!this.error&&t&&(v.setBuffering(!0),setTimeout(()=>{v.setBuffering(!1)},5e3))}onTryAgain(){this.buffering||(clearTimeout(this.btnLabelTimeout),clearTimeout(this.labelTimeout),this.initializeStateAndTimers(),v.setWcError(!1),this.onConnect())}};ii=kr([d("w3m-connecting-wc-mobile")],ii);var ar=Pr(nr(),1);var On=.1,sr=2.5,dt=7;function $o(r,t,e){return r===t?!1:(r-t<0?t-r:r-t)<=e+On}function Dn(r,t){let e=Array.prototype.slice.call(ar.default.create(r,{errorCorrectionLevel:t}).modules.data,0),i=Math.sqrt(e.length);return e.reduce((n,o,s)=>(s%i===0?n.push([o]):n[n.length-1].push(o))&&n,[])}var lr={generate({uri:r,size:t,logoSize:e,dotColor:i="#141414"}){let n="transparent",s=[],a=Dn(r,"Q"),u=t/a.length,b=[{x:0,y:0},{x:1,y:0},{x:0,y:1}];b.forEach(({x:I,y:$})=>{let z=(a.length-dt)*u*I,W=(a.length-dt)*u*$,k=.45;for(let O=0;O<b.length;O+=1){let D=u*(dt-O*2);s.push(ft`
            <rect
              fill=${O===2?i:n}
              width=${O===0?D-5:D}
              rx= ${O===0?(D-5)*k:D*k}
              ry= ${O===0?(D-5)*k:D*k}
              stroke=${i}
              stroke-width=${O===0?5:0}
              height=${O===0?D-5:D}
              x= ${O===0?W+u*O+5/2:W+u*O}
              y= ${O===0?z+u*O+5/2:z+u*O}
            />
          `)}});let w=Math.floor((e+25)/u),C=a.length/2-w/2,R=a.length/2+w/2-1,q=[];a.forEach((I,$)=>{I.forEach((z,W)=>{if(a[$][W]&&!($<dt&&W<dt||$>a.length-(dt+1)&&W<dt||$<dt&&W>a.length-(dt+1))&&!($>C&&$<R&&W>C&&W<R)){let k=$*u+u/2,O=W*u+u/2;q.push([k,O])}})});let U={};return q.forEach(([I,$])=>{U[I]?U[I]?.push($):U[I]=[$]}),Object.entries(U).map(([I,$])=>{let z=$.filter(W=>$.every(k=>!$o(W,k,u)));return[Number(I),z]}).forEach(([I,$])=>{$.forEach(z=>{s.push(ft`<circle cx=${I} cy=${z} fill=${i} r=${u/sr} />`)})}),Object.entries(U).filter(([I,$])=>$.length>1).map(([I,$])=>{let z=$.filter(W=>$.some(k=>$o(W,k,u)));return[Number(I),z]}).map(([I,$])=>{$.sort((W,k)=>W<k?-1:1);let z=[];for(let W of $){let k=z.find(O=>O.some(D=>$o(W,D,u)));k?k.push(W):z.push([W])}return[I,z.map(W=>[W[0],W[W.length-1]])]}).forEach(([I,$])=>{$.forEach(([z,W])=>{s.push(ft`
              <line
                x1=${I}
                x2=${I}
                y1=${z}
                y2=${W}
                stroke=${i}
                stroke-width=${u/(sr/2)}
                stroke-linecap="round"
              />
            `)})}),s}};var cr=g`
  :host {
    position: relative;
    user-select: none;
    display: block;
    overflow: hidden;
    aspect-ratio: 1 / 1;
    width: var(--local-size);
  }

  :host([data-theme='dark']) {
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px);
    background-color: var(--wui-color-inverse-100);
    padding: var(--wui-spacing-l);
  }

  :host([data-theme='light']) {
    box-shadow: 0 0 0 1px var(--wui-color-bg-125);
    background-color: var(--wui-color-bg-125);
  }

  :host([data-clear='true']) > wui-icon {
    display: none;
  }

  svg:first-child,
  wui-image,
  wui-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }

  wui-image {
    width: 25%;
    height: 25%;
    border-radius: var(--wui-border-radius-xs);
  }

  wui-icon {
    width: 100%;
    height: 100%;
    color: var(--local-icon-color) !important;
    transform: translateY(-50%) translateX(-50%) scale(0.25);
  }
`;var pt=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},jn="#3396ff",et=class extends p{constructor(){super(...arguments),this.uri="",this.size=0,this.theme="dark",this.imageSrc=void 0,this.alt=void 0,this.arenaClear=void 0,this.farcaster=void 0}render(){return this.dataset.theme=this.theme,this.dataset.clear=String(this.arenaClear),this.style.cssText=`
     --local-size: ${this.size}px;
     --local-icon-color: ${this.color??jn}
    `,l`${this.templateVisual()} ${this.templateSvg()}`}templateSvg(){let t=this.theme==="light"?this.size:this.size-32;return ft`
      <svg height=${t} width=${t}>
        ${lr.generate({uri:this.uri,size:t,logoSize:this.arenaClear?0:t/4,dotColor:this.color})}
      </svg>
    `}templateVisual(){return this.imageSrc?l`<wui-image src=${this.imageSrc} alt=${this.alt??"logo"}></wui-image>`:this.farcaster?l`<wui-icon
        class="farcaster"
        size="inherit"
        color="inherit"
        name="farcaster"
      ></wui-icon>`:l`<wui-icon size="inherit" color="inherit" name="walletConnect"></wui-icon>`}};et.styles=[y,cr];pt([c()],et.prototype,"uri",void 0);pt([c({type:Number})],et.prototype,"size",void 0);pt([c()],et.prototype,"theme",void 0);pt([c()],et.prototype,"imageSrc",void 0);pt([c()],et.prototype,"alt",void 0);pt([c()],et.prototype,"color",void 0);pt([c({type:Boolean})],et.prototype,"arenaClear",void 0);pt([c({type:Boolean})],et.prototype,"farcaster",void 0);et=pt([d("wui-qr-code")],et);var ur=g`
  :host {
    display: block;
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-005);
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-200) 5%,
      var(--wui-color-bg-200) 48%,
      var(--wui-color-bg-300) 55%,
      var(--wui-color-bg-300) 60%,
      var(--wui-color-bg-300) calc(60% + 10px),
      var(--wui-color-bg-200) calc(60% + 12px),
      var(--wui-color-bg-200) 100%
    );
    background-size: 250%;
    animation: shimmer 3s linear infinite reverse;
  }

  :host([variant='light']) {
    background: linear-gradient(
      120deg,
      var(--wui-color-bg-150) 5%,
      var(--wui-color-bg-150) 48%,
      var(--wui-color-bg-200) 55%,
      var(--wui-color-bg-200) 60%,
      var(--wui-color-bg-200) calc(60% + 10px),
      var(--wui-color-bg-150) calc(60% + 12px),
      var(--wui-color-bg-150) 100%
    );
    background-size: 250%;
  }

  @keyframes shimmer {
    from {
      background-position: -250% 0;
    }
    to {
      background-position: 250% 0;
    }
  }
`;var le=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Wt=class extends p{constructor(){super(...arguments),this.width="",this.height="",this.borderRadius="m",this.variant="default"}render(){return this.style.cssText=`
      width: ${this.width};
      height: ${this.height};
      border-radius: ${`clamp(0px,var(--wui-border-radius-${this.borderRadius}), 40px)`};
    `,l`<slot></slot>`}};Wt.styles=[ur];le([c()],Wt.prototype,"width",void 0);le([c()],Wt.prototype,"height",void 0);le([c()],Wt.prototype,"borderRadius",void 0);le([c()],Wt.prototype,"variant",void 0);Wt=le([d("wui-shimmer")],Wt);var dr=g`
  .reown-logo {
    height: var(--wui-spacing-xxl);
  }
`;var zn=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},_o=class extends p{render(){return l`
      <wui-flex
        justifyContent="center"
        alignItems="center"
        gap="xs"
        .padding=${["0","0","l","0"]}
      >
        <wui-text variant="small-500" color="fg-100"> UX by </wui-text>
        <wui-icon name="reown" size="xxxl" class="reown-logo"></wui-icon>
      </wui-flex>
    `}};_o.styles=[y,L,dr];_o=zn([d("wui-ux-by-reown")],_o);var pr=g`
  @keyframes fadein {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  wui-shimmer {
    width: 100%;
    aspect-ratio: 1 / 1;
    border-radius: clamp(0px, var(--wui-border-radius-l), 40px) !important;
  }

  wui-qr-code {
    opacity: 0;
    animation-duration: 200ms;
    animation-timing-function: ease;
    animation-name: fadein;
    animation-fill-mode: forwards;
  }
`;var kn=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},So=class extends P{constructor(){super(),this.forceUpdate=()=>{this.requestUpdate()},window.addEventListener("resize",this.forceUpdate),N.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet?.name??"WalletConnect",platform:"qrcode"}})}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.forEach(t=>t()),window.removeEventListener("resize",this.forceUpdate)}render(){return this.onRenderProxy(),l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["0","xl","xl","xl"]}
        gap="xl"
      >
        <wui-shimmer borderRadius="l" width="100%"> ${this.qrCodeTemplate()} </wui-shimmer>

        <wui-text variant="paragraph-500" color="fg-100">
          Scan this QR Code with your phone
        </wui-text>
        ${this.copyTemplate()}
      </wui-flex>
      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}onRenderProxy(){!this.ready&&this.uri&&(this.timeout=setTimeout(()=>{this.ready=!0},200))}qrCodeTemplate(){if(!this.uri||!this.ready)return null;let t=this.getBoundingClientRect().width-40,e=this.wallet?this.wallet.name:void 0;return v.setWcLinking(void 0),v.setRecentWallet(this.wallet),l` <wui-qr-code
      size=${t}
      theme=${Ft.state.themeMode}
      uri=${this.uri}
      imageSrc=${h(B.getWalletImage(this.wallet))}
      color=${h(Ft.state.themeVariables["--w3m-qr-color"])}
      alt=${h(e)}
      data-testid="wui-qr-code"
    ></wui-qr-code>`}copyTemplate(){let t=!this.uri||!this.ready;return l`<wui-link
      .disabled=${t}
      @click=${this.onCopyUri}
      color="fg-200"
      data-testid="copy-wc2-uri"
    >
      <wui-icon size="xs" color="fg-200" slot="iconLeft" name="copy"></wui-icon>
      Copy link
    </wui-link>`}};So.styles=pr;So=kn([d("w3m-connecting-wc-qrcode")],So);var Nn=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},hr=class extends p{constructor(){if(super(),this.wallet=E.state.data?.wallet,!this.wallet)throw new Error("w3m-connecting-wc-unsupported: No wallet provided");N.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"browser"}})}render(){return l`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["3xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-wallet-image
          size="lg"
          imageSrc=${h(B.getWalletImage(this.wallet))}
        ></wui-wallet-image>

        <wui-text variant="paragraph-500" color="fg-100">Not Detected</wui-text>
      </wui-flex>

      <w3m-mobile-download-links .wallet=${this.wallet}></w3m-mobile-download-links>
    `}};hr=Nn([d("w3m-connecting-wc-unsupported")],hr);var mr=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Io=class extends P{constructor(){if(super(),this.isLoading=!0,!this.wallet)throw new Error("w3m-connecting-wc-web: No wallet provided");this.onConnect=this.onConnectProxy.bind(this),this.secondaryBtnLabel="Open",this.secondaryLabel="Open and continue in a new browser tab",this.secondaryBtnIcon="externalLink",this.updateLoadingState(),this.unsubscribe.push(v.subscribeKey("wcUri",()=>{this.updateLoadingState()})),N.sendEvent({type:"track",event:"SELECT_WALLET",properties:{name:this.wallet.name,platform:"web"}})}updateLoadingState(){this.isLoading=!this.uri}onConnectProxy(){if(this.wallet?.webapp_link&&this.uri)try{this.error=!1;let{webapp_link:t,name:e}=this.wallet,{redirect:i,href:n}=f.formatUniversalUrl(t,this.uri);v.setWcLinking({name:e,href:n}),v.setRecentWallet(this.wallet),f.openHref(i,"_blank")}catch{this.error=!0}}};mr([m()],Io.prototype,"isLoading",void 0);Io=mr([d("w3m-connecting-wc-web")],Io);var ke=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},ce=class extends p{constructor(){super(),this.wallet=E.state.data?.wallet,this.platform=void 0,this.platforms=[],this.isSiwxEnabled=!!H.state.siwx,this.determinePlatforms(),this.initializeConnection()}render(){return l`
      ${this.headerTemplate()}
      <div>${this.platformTemplate()}</div>
      <wui-ux-by-reown></wui-ux-by-reown>
    `}initializeConnection(t=!1){return X(this,null,function*(){if(!(this.platform==="browser"||H.state.manualWCControl&&!t))try{let{wcPairingExpiry:e,status:i}=v.state;(t||H.state.enableEmbedded||f.isPairingExpired(e)||i==="connecting")&&(yield v.connectWalletConnect(),this.isSiwxEnabled||pe.close())}catch(e){N.sendEvent({type:"track",event:"CONNECT_ERROR",properties:{message:e?.message??"Unknown"}}),v.setWcError(!0),yt.showError(e.message??"Connection error"),v.resetWcConnection(),E.goBack()}})}determinePlatforms(){if(!this.wallet){this.platforms.push("qrcode"),this.platform="qrcode";return}if(this.platform)return;let{mobile_link:t,desktop_link:e,webapp_link:i,injected:n,rdns:o}=this.wallet,s=n?.map(({injected_id:U})=>U).filter(Boolean),a=[...o?[o]:s??[]],u=H.state.isUniversalProvider?!1:a.length,b=t,w=i,C=v.checkInstalled(a),R=u&&C,q=e&&!f.isMobile();R&&!Ht.state.noAdapters&&this.platforms.push("browser"),b&&this.platforms.push(f.isMobile()?"mobile":"qrcode"),w&&this.platforms.push("web"),q&&this.platforms.push("desktop"),!R&&u&&!Ht.state.noAdapters&&this.platforms.push("unsupported"),this.platform=this.platforms[0]}platformTemplate(){switch(this.platform){case"browser":return l`<w3m-connecting-wc-browser></w3m-connecting-wc-browser>`;case"web":return l`<w3m-connecting-wc-web></w3m-connecting-wc-web>`;case"desktop":return l`
          <w3m-connecting-wc-desktop .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-desktop>
        `;case"mobile":return l`
          <w3m-connecting-wc-mobile isMobile .onRetry=${()=>this.initializeConnection(!0)}>
          </w3m-connecting-wc-mobile>
        `;case"qrcode":return l`<w3m-connecting-wc-qrcode></w3m-connecting-wc-qrcode>`;default:return l`<w3m-connecting-wc-unsupported></w3m-connecting-wc-unsupported>`}}headerTemplate(){return this.platforms.length>1?l`
      <w3m-connecting-header
        .platforms=${this.platforms}
        .onSelectPlatfrom=${this.onSelectPlatform.bind(this)}
      >
      </w3m-connecting-header>
    `:null}onSelectPlatform(t){return X(this,null,function*(){let e=this.shadowRoot?.querySelector("div");e&&(yield e.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.platform=t,e.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))})}};ke([m()],ce.prototype,"platform",void 0);ke([m()],ce.prototype,"platforms",void 0);ke([m()],ce.prototype,"isSiwxEnabled",void 0);ce=ke([d("w3m-connecting-wc-view")],ce);var fr=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Wo=class extends p{constructor(){super(...arguments),this.isMobile=f.isMobile()}render(){if(this.isMobile){let{featured:t,recommended:e}=T.state,{customWallets:i}=H.state,n=ht.getRecentWallets(),o=t.length||e.length||i?.length||n.length;return l`<wui-flex
        flexDirection="column"
        gap="xs"
        .margin=${["3xs","s","s","s"]}
      >
        ${o?l`<w3m-connector-list></w3m-connector-list>`:null}
        <w3m-all-wallets-widget></w3m-all-wallets-widget>
      </wui-flex>`}return l`<wui-flex flexDirection="column" .padding=${["0","0","l","0"]}>
      <w3m-connecting-wc-view></w3m-connecting-wc-view>
      <wui-flex flexDirection="column" .padding=${["0","m","0","m"]}>
        <w3m-all-wallets-widget></w3m-all-wallets-widget> </wui-flex
    ></wui-flex>`}};fr([m()],Wo.prototype,"isMobile",void 0);Wo=fr([d("w3m-connecting-wc-basic-view")],Wo);var Mt=()=>new Lo,Lo=class{},To=new WeakMap,qt=Do(class extends jo{render(r){return Ge}update(r,[t]){let e=t!==this.G;return e&&this.G!==void 0&&this.rt(void 0),(e||this.lt!==this.ct)&&(this.G=t,this.ht=r.options?.host,this.rt(this.ct=r.element)),Ge}rt(r){if(this.isConnected||(r=void 0),typeof this.G=="function"){let t=this.ht??globalThis,e=To.get(t);e===void 0&&(e=new WeakMap,To.set(t,e)),e.get(this.G)!==void 0&&this.G.call(this.ht,void 0),e.set(this.G,r),r!==void 0&&this.G.call(this.ht,r)}else this.G.value=r}get lt(){return typeof this.G=="function"?To.get(this.ht??globalThis)?.get(this.G):this.G?.value}disconnected(){this.lt===this.ct&&this.rt(void 0)}reconnected(){this.rt(this.ct)}});var gr=g`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  label {
    position: relative;
    display: inline-block;
    width: 32px;
    height: 22px;
  }

  input {
    width: 0;
    height: 0;
    opacity: 0;
  }

  span {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: var(--wui-color-blue-100);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-002);
    border-radius: 999px;
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color;
  }

  span:before {
    position: absolute;
    content: '';
    height: 16px;
    width: 16px;
    left: 3px;
    top: 2px;
    background-color: var(--wui-color-inverse-100);
    transition: transform var(--wui-ease-inout-power-1) var(--wui-duration-lg);
    will-change: transform;
    border-radius: 50%;
  }

  input:checked + span {
    border-color: var(--wui-color-gray-glass-005);
    background-color: var(--wui-color-blue-100);
  }

  input:not(:checked) + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  input:checked + span:before {
    transform: translateX(calc(100% - 7px));
  }
`;var wr=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Ne=class extends p{constructor(){super(...arguments),this.inputElementRef=Mt(),this.checked=void 0}render(){return l`
      <label>
        <input
          ${qt(this.inputElementRef)}
          type="checkbox"
          ?checked=${h(this.checked)}
          @change=${this.dispatchChangeEvent.bind(this)}
        />
        <span></span>
      </label>
    `}dispatchChangeEvent(){this.dispatchEvent(new CustomEvent("switchChange",{detail:this.inputElementRef.value?.checked,bubbles:!0,composed:!0}))}};Ne.styles=[y,L,Oo,gr];wr([c({type:Boolean})],Ne.prototype,"checked",void 0);Ne=wr([d("wui-switch")],Ne);var br=g`
  :host {
    height: 100%;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    column-gap: var(--wui-spacing-1xs);
    padding: var(--wui-spacing-xs) var(--wui-spacing-s);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: background-color;
    cursor: pointer;
  }

  wui-switch {
    pointer-events: none;
  }
`;var vr=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Ue=class extends p{constructor(){super(...arguments),this.checked=void 0}render(){return l`
      <button>
        <wui-icon size="xl" name="walletConnectBrown"></wui-icon>
        <wui-switch ?checked=${h(this.checked)}></wui-switch>
      </button>
    `}};Ue.styles=[y,L,br];vr([c({type:Boolean})],Ue.prototype,"checked",void 0);Ue=vr([d("wui-certified-switch")],Ue);var xr=g`
  button {
    background-color: var(--wui-color-fg-300);
    border-radius: var(--wui-border-radius-4xs);
    width: 16px;
    height: 16px;
  }

  button:disabled {
    background-color: var(--wui-color-bg-300);
  }

  wui-icon {
    color: var(--wui-color-bg-200) !important;
  }

  button:focus-visible {
    background-color: var(--wui-color-fg-250);
    border: 1px solid var(--wui-color-accent-100);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-fg-250);
    }

    button:active:enabled {
      background-color: var(--wui-color-fg-225);
    }
  }
`;var yr=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Me=class extends p{constructor(){super(...arguments),this.icon="copy"}render(){return l`
      <button>
        <wui-icon color="inherit" size="xxs" name=${this.icon}></wui-icon>
      </button>
    `}};Me.styles=[y,L,xr];yr([c()],Me.prototype,"icon",void 0);Me=yr([d("wui-input-element")],Me);var Cr=g`
  :host {
    position: relative;
    width: 100%;
    display: inline-block;
    color: var(--wui-color-fg-275);
  }

  input {
    width: 100%;
    border-radius: var(--wui-border-radius-xs);
    box-shadow: inset 0 0 0 1px var(--wui-color-gray-glass-002);
    background: var(--wui-color-gray-glass-002);
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
    color: var(--wui-color-fg-100);
    transition:
      background-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      border-color var(--wui-ease-inout-power-1) var(--wui-duration-md),
      box-shadow var(--wui-ease-inout-power-1) var(--wui-duration-md);
    will-change: background-color, border-color, box-shadow;
    caret-color: var(--wui-color-accent-100);
  }

  input:disabled {
    cursor: not-allowed;
    border: 1px solid var(--wui-color-gray-glass-010);
  }

  input:disabled::placeholder,
  input:disabled + wui-icon {
    color: var(--wui-color-fg-300);
  }

  input::placeholder {
    color: var(--wui-color-fg-275);
  }

  input:focus:enabled {
    background-color: var(--wui-color-gray-glass-005);
    -webkit-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    -moz-box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
    box-shadow:
      inset 0 0 0 1px var(--wui-color-accent-100),
      0px 0px 0px 4px var(--wui-box-shadow-blue);
  }

  input:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  wui-icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px var(--wui-spacing-s);
  }

  wui-icon + .wui-size-sm {
    padding: 9px var(--wui-spacing-m) 10px 36px;
  }

  wui-icon[data-input='sm'] {
    left: var(--wui-spacing-s);
  }

  .wui-size-md {
    padding: 15px var(--wui-spacing-m) var(--wui-spacing-l) var(--wui-spacing-m);
  }

  wui-icon + .wui-size-md,
  wui-loading-spinner + .wui-size-md {
    padding: 10.5px var(--wui-spacing-3xl) 10.5px var(--wui-spacing-3xl);
  }

  wui-icon[data-input='md'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-lg {
    padding: var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-s) var(--wui-spacing-l);
    letter-spacing: var(--wui-letter-spacing-medium-title);
    font-size: var(--wui-font-size-medium-title);
    font-weight: var(--wui-font-weight-light);
    line-height: 130%;
    color: var(--wui-color-fg-100);
    height: 64px;
  }

  .wui-padding-right-xs {
    padding-right: var(--wui-spacing-xs);
  }

  .wui-padding-right-s {
    padding-right: var(--wui-spacing-s);
  }

  .wui-padding-right-m {
    padding-right: var(--wui-spacing-m);
  }

  .wui-padding-right-l {
    padding-right: var(--wui-spacing-l);
  }

  .wui-padding-right-xl {
    padding-right: var(--wui-spacing-xl);
  }

  .wui-padding-right-2xl {
    padding-right: var(--wui-spacing-2xl);
  }

  .wui-padding-right-3xl {
    padding-right: var(--wui-spacing-3xl);
  }

  .wui-padding-right-4xl {
    padding-right: var(--wui-spacing-4xl);
  }

  .wui-padding-right-5xl {
    padding-right: var(--wui-spacing-5xl);
  }

  wui-icon + .wui-size-lg,
  wui-loading-spinner + .wui-size-lg {
    padding-left: 50px;
  }

  wui-icon[data-input='lg'] {
    left: var(--wui-spacing-l);
  }

  .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-m) 17.25px var(--wui-spacing-m);
  }
  wui-icon + .wui-size-mdl,
  wui-loading-spinner + .wui-size-mdl {
    padding: 17.25px var(--wui-spacing-3xl) 17.25px 40px;
  }
  wui-icon[data-input='mdl'] {
    left: var(--wui-spacing-m);
  }

  input:placeholder-shown ~ ::slotted(wui-input-element),
  input:placeholder-shown ~ ::slotted(wui-icon) {
    opacity: 0;
    pointer-events: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }

  ::slotted(wui-input-element),
  ::slotted(wui-icon) {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
  }

  ::slotted(wui-input-element) {
    right: var(--wui-spacing-m);
  }

  ::slotted(wui-icon) {
    right: 0px;
  }
`;var nt=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},J=class extends p{constructor(){super(...arguments),this.inputElementRef=Mt(),this.size="md",this.disabled=!1,this.placeholder="",this.type="text",this.value=""}render(){let t=`wui-padding-right-${this.inputRightPadding}`,i={[`wui-size-${this.size}`]:!0,[t]:!!this.inputRightPadding};return l`${this.templateIcon()}
      <input
        data-testid="wui-input-text"
        ${qt(this.inputElementRef)}
        class=${zo(i)}
        type=${this.type}
        enterkeyhint=${h(this.enterKeyHint)}
        ?disabled=${this.disabled}
        placeholder=${this.placeholder}
        @input=${this.dispatchInputChangeEvent.bind(this)}
        .value=${this.value||""}
        tabindex=${h(this.tabIdx)}
      />
      <slot></slot>`}templateIcon(){return this.icon?l`<wui-icon
        data-input=${this.size}
        size=${this.size}
        color="inherit"
        name=${this.icon}
      ></wui-icon>`:null}dispatchInputChangeEvent(){this.dispatchEvent(new CustomEvent("inputChange",{detail:this.inputElementRef.value?.value,bubbles:!0,composed:!0}))}};J.styles=[y,L,Cr];nt([c()],J.prototype,"size",void 0);nt([c()],J.prototype,"icon",void 0);nt([c({type:Boolean})],J.prototype,"disabled",void 0);nt([c()],J.prototype,"placeholder",void 0);nt([c()],J.prototype,"type",void 0);nt([c()],J.prototype,"keyHint",void 0);nt([c()],J.prototype,"value",void 0);nt([c()],J.prototype,"inputRightPadding",void 0);nt([c()],J.prototype,"tabIdx",void 0);J=nt([d("wui-input-text")],J);var Er=g`
  :host {
    position: relative;
    display: inline-block;
    width: 100%;
  }
`;var Un=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Bo=class extends p{constructor(){super(...arguments),this.inputComponentRef=Mt()}render(){return l`
      <wui-input-text
        ${qt(this.inputComponentRef)}
        placeholder="Search wallet"
        icon="search"
        type="search"
        enterKeyHint="search"
        size="sm"
      >
        <wui-input-element @click=${this.clearValue} icon="close"></wui-input-element>
      </wui-input-text>
    `}clearValue(){let e=this.inputComponentRef.value?.inputElementRef.value;e&&(e.value="",e.focus(),e.dispatchEvent(new Event("input")))}};Bo.styles=[y,Er];Bo=Un([d("wui-search-bar")],Bo);var Rr=ft`<svg  viewBox="0 0 48 54" fill="none">
  <path
    d="M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z"
  />
</svg>`;var $r=g`
  :host {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-xs) 10px;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    position: relative;
  }

  wui-shimmer[data-type='network'] {
    border: none;
    -webkit-clip-path: var(--wui-path-network);
    clip-path: var(--wui-path-network);
  }

  svg {
    position: absolute;
    width: 48px;
    height: 54px;
    z-index: 1;
  }

  svg > path {
    stroke: var(--wui-color-gray-glass-010);
    stroke-width: 1px;
  }

  @media (max-width: 350px) {
    :host {
      width: 100%;
    }
  }
`;var _r=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},qe=class extends p{constructor(){super(...arguments),this.type="wallet"}render(){return l`
      ${this.shimmerTemplate()}
      <wui-shimmer width="56px" height="20px" borderRadius="xs"></wui-shimmer>
    `}shimmerTemplate(){return this.type==="network"?l` <wui-shimmer
          data-type=${this.type}
          width="48px"
          height="54px"
          borderRadius="xs"
        ></wui-shimmer>
        ${Rr}`:l`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}};qe.styles=[y,L,$r];_r([c()],qe.prototype,"type",void 0);qe=_r([d("wui-card-select-loader")],qe);var Sr=g`
  :host {
    display: grid;
    width: inherit;
    height: inherit;
  }
`;var Q=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},F=class extends p{render(){return this.style.cssText=`
      grid-template-rows: ${this.gridTemplateRows};
      grid-template-columns: ${this.gridTemplateColumns};
      justify-items: ${this.justifyItems};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      align-content: ${this.alignContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&Z.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&Z.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&Z.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&Z.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&Z.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&Z.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&Z.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&Z.getSpacingStyles(this.margin,3)};
    `,l`<slot></slot>`}};F.styles=[y,Sr];Q([c()],F.prototype,"gridTemplateRows",void 0);Q([c()],F.prototype,"gridTemplateColumns",void 0);Q([c()],F.prototype,"justifyItems",void 0);Q([c()],F.prototype,"alignItems",void 0);Q([c()],F.prototype,"justifyContent",void 0);Q([c()],F.prototype,"alignContent",void 0);Q([c()],F.prototype,"columnGap",void 0);Q([c()],F.prototype,"rowGap",void 0);Q([c()],F.prototype,"gap",void 0);Q([c()],F.prototype,"padding",void 0);Q([c()],F.prototype,"margin",void 0);F=Q([d("wui-grid")],F);var Ir=g`
  button {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    width: 104px;
    row-gap: var(--wui-spacing-xs);
    padding: var(--wui-spacing-s) var(--wui-spacing-0);
    background-color: var(--wui-color-gray-glass-002);
    border-radius: clamp(0px, var(--wui-border-radius-xs), 20px);
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border-radius;
    outline: none;
    border: none;
  }

  button > wui-flex > wui-text {
    color: var(--wui-color-fg-100);
    max-width: 86px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    justify-content: center;
  }

  button > wui-flex > wui-text.certified {
    max-width: 66px;
  }

  button:hover:enabled {
    background-color: var(--wui-color-gray-glass-005);
  }

  button:disabled > wui-flex > wui-text {
    color: var(--wui-color-gray-glass-015);
  }

  [data-selected='true'] {
    background-color: var(--wui-color-accent-glass-020);
  }

  @media (hover: hover) and (pointer: fine) {
    [data-selected='true']:hover:enabled {
      background-color: var(--wui-color-accent-glass-015);
    }
  }

  [data-selected='true']:active:enabled {
    background-color: var(--wui-color-accent-glass-010);
  }

  @media (max-width: 350px) {
    button {
      width: 100%;
    }
  }
`;var ue=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Tt=class extends p{constructor(){super(),this.observer=new IntersectionObserver(()=>{}),this.visible=!1,this.imageSrc=void 0,this.imageLoading=!1,this.wallet=void 0,this.observer=new IntersectionObserver(t=>{t.forEach(e=>{e.isIntersecting?(this.visible=!0,this.fetchImageSrc()):this.visible=!1})},{threshold:.01})}firstUpdated(){this.observer.observe(this)}disconnectedCallback(){this.observer.disconnect()}render(){let t=this.wallet?.badge_type==="certified";return l`
      <button>
        ${this.imageTemplate()}
        <wui-flex flexDirection="row" alignItems="center" justifyContent="center" gap="3xs">
          <wui-text
            variant="tiny-500"
            color="inherit"
            class=${h(t?"certified":void 0)}
            >${this.wallet?.name}</wui-text
          >
          ${t?l`<wui-icon size="sm" name="walletConnectBrown"></wui-icon>`:null}
        </wui-flex>
      </button>
    `}imageTemplate(){return!this.visible&&!this.imageSrc||this.imageLoading?this.shimmerTemplate():l`
      <wui-wallet-image
        size="md"
        imageSrc=${h(this.imageSrc)}
        name=${this.wallet?.name}
        .installed=${this.wallet?.installed}
        badgeSize="sm"
      >
      </wui-wallet-image>
    `}shimmerTemplate(){return l`<wui-shimmer width="56px" height="56px" borderRadius="xs"></wui-shimmer>`}fetchImageSrc(){return X(this,null,function*(){this.wallet&&(this.imageSrc=B.getWalletImage(this.wallet),!this.imageSrc&&(this.imageLoading=!0,this.imageSrc=yield B.fetchWalletImage(this.wallet.image_id),this.imageLoading=!1))})}};Tt.styles=Ir;ue([m()],Tt.prototype,"visible",void 0);ue([m()],Tt.prototype,"imageSrc",void 0);ue([m()],Tt.prototype,"imageLoading",void 0);ue([c()],Tt.prototype,"wallet",void 0);Tt=ue([d("w3m-all-wallets-list-item")],Tt);var Wr=g`
  wui-grid {
    max-height: clamp(360px, 400px, 80vh);
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    padding-top: var(--wui-spacing-l);
    padding-bottom: var(--wui-spacing-l);
    justify-content: center;
    grid-column: 1 / span 4;
  }
`;var de=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Tr="local-paginator",Lt=class extends p{constructor(){super(),this.unsubscribe=[],this.paginationObserver=void 0,this.loading=!T.state.wallets.length,this.wallets=T.state.wallets,this.recommended=T.state.recommended,this.featured=T.state.featured,this.unsubscribe.push(T.subscribeKey("wallets",t=>this.wallets=t),T.subscribeKey("recommended",t=>this.recommended=t),T.subscribeKey("featured",t=>this.featured=t))}firstUpdated(){this.initialFetch(),this.createPaginationObserver()}disconnectedCallback(){this.unsubscribe.forEach(t=>t()),this.paginationObserver?.disconnect()}render(){return l`
      <wui-grid
        data-scroll=${!this.loading}
        .padding=${["0","s","s","s"]}
        columnGap="xxs"
        rowGap="l"
        justifyContent="space-between"
      >
        ${this.loading?this.shimmerTemplate(16):this.walletsTemplate()}
        ${this.paginationLoaderTemplate()}
      </wui-grid>
    `}initialFetch(){return X(this,null,function*(){this.loading=!0;let t=this.shadowRoot?.querySelector("wui-grid");t&&(yield T.fetchWalletsByPage({page:1}),yield t.animate([{opacity:1},{opacity:0}],{duration:200,fill:"forwards",easing:"ease"}).finished,this.loading=!1,t.animate([{opacity:0},{opacity:1}],{duration:200,fill:"forwards",easing:"ease"}))})}shimmerTemplate(t,e){return[...Array(t)].map(()=>l`
        <wui-card-select-loader type="wallet" id=${h(e)}></wui-card-select-loader>
      `)}walletsTemplate(){let t=f.uniqueBy([...this.featured,...this.recommended,...this.wallets],"id");return mt.markWalletsAsInstalled(t).map(i=>l`
        <w3m-all-wallets-list-item
          @click=${()=>this.onConnectWallet(i)}
          .wallet=${i}
        ></w3m-all-wallets-list-item>
      `)}paginationLoaderTemplate(){let{wallets:t,recommended:e,featured:i,count:n}=T.state,o=window.innerWidth<352?3:4,s=t.length+e.length,u=Math.ceil(s/o)*o-s+o;return u-=t.length?i.length%o:0,n===0&&i.length>0?null:n===0||[...i,...t,...e].length<n?this.shimmerTemplate(u,Tr):null}createPaginationObserver(){let t=this.shadowRoot?.querySelector(`#${Tr}`);t&&(this.paginationObserver=new IntersectionObserver(([e])=>{if(e?.isIntersecting&&!this.loading){let{page:i,count:n,wallets:o}=T.state;o.length<n&&T.fetchWalletsByPage({page:i+1})}}),this.paginationObserver.observe(t))}onConnectWallet(t){x.selectWalletConnector(t)}};Lt.styles=Wr;de([m()],Lt.prototype,"loading",void 0);de([m()],Lt.prototype,"wallets",void 0);de([m()],Lt.prototype,"recommended",void 0);de([m()],Lt.prototype,"featured",void 0);Lt=de([d("w3m-all-wallets-list")],Lt);var Lr=g`
  wui-grid,
  wui-loading-spinner,
  wui-flex {
    height: 360px;
  }

  wui-grid {
    overflow: scroll;
    scrollbar-width: none;
    grid-auto-rows: min-content;
    grid-template-columns: repeat(auto-fill, 104px);
  }

  wui-grid[data-scroll='false'] {
    overflow: hidden;
  }

  wui-grid::-webkit-scrollbar {
    display: none;
  }

  wui-loading-spinner {
    justify-content: center;
    align-items: center;
  }

  @media (max-width: 350px) {
    wui-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
`;var Ve=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Vt=class extends p{constructor(){super(...arguments),this.prevQuery="",this.prevBadge=void 0,this.loading=!0,this.query=""}render(){return this.onSearch(),this.loading?l`<wui-loading-spinner color="accent-100"></wui-loading-spinner>`:this.walletsTemplate()}onSearch(){return X(this,null,function*(){(this.query.trim()!==this.prevQuery.trim()||this.badge!==this.prevBadge)&&(this.prevQuery=this.query,this.prevBadge=this.badge,this.loading=!0,yield T.searchWallet({search:this.query,badge:this.badge}),this.loading=!1)})}walletsTemplate(){let{search:t}=T.state,e=mt.markWalletsAsInstalled(t);return t.length?l`
      <wui-grid
        data-testid="wallet-list"
        .padding=${["0","s","s","s"]}
        rowGap="l"
        columnGap="xs"
        justifyContent="space-between"
      >
        ${e.map(i=>l`
            <w3m-all-wallets-list-item
              @click=${()=>this.onConnectWallet(i)}
              .wallet=${i}
              data-testid="wallet-search-item-${i.id}"
            ></w3m-all-wallets-list-item>
          `)}
      </wui-grid>
    `:l`
        <wui-flex
          data-testid="no-wallet-found"
          justifyContent="center"
          alignItems="center"
          gap="s"
          flexDirection="column"
        >
          <wui-icon-box
            size="lg"
            iconColor="fg-200"
            backgroundColor="fg-300"
            icon="wallet"
            background="transparent"
          ></wui-icon-box>
          <wui-text data-testid="no-wallet-found-text" color="fg-200" variant="paragraph-500">
            No Wallet found
          </wui-text>
        </wui-flex>
      `}onConnectWallet(t){x.selectWalletConnector(t)}};Vt.styles=Lr;Ve([m()],Vt.prototype,"loading",void 0);Ve([c()],Vt.prototype,"query",void 0);Ve([c()],Vt.prototype,"badge",void 0);Vt=Ve([d("w3m-all-wallets-search")],Vt);var Ao=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Fe=class extends p{constructor(){super(...arguments),this.search="",this.onDebouncedSearch=f.debounce(t=>{this.search=t})}render(){let t=this.search.length>=2;return l`
      <wui-flex .padding=${["0","s","s","s"]} gap="xs">
        <wui-search-bar @inputChange=${this.onInputChange.bind(this)}></wui-search-bar>
        <wui-certified-switch
          ?checked=${this.badge}
          @click=${this.onClick.bind(this)}
          data-testid="wui-certified-switch"
        ></wui-certified-switch>
        ${this.qrButtonTemplate()}
      </wui-flex>
      ${t||this.badge?l`<w3m-all-wallets-search
            query=${this.search}
            badge=${h(this.badge)}
          ></w3m-all-wallets-search>`:l`<w3m-all-wallets-list badge=${h(this.badge)}></w3m-all-wallets-list>`}
    `}onInputChange(t){this.onDebouncedSearch(t.detail)}onClick(){if(this.badge==="certified"){this.badge=void 0;return}this.badge="certified",yt.showSvg("Only WalletConnect certified",{icon:"walletConnectBrown",iconColor:"accent-100"})}qrButtonTemplate(){return f.isMobile()?l`
        <wui-icon-box
          size="lg"
          iconSize="xl"
          iconColor="accent-100"
          backgroundColor="accent-100"
          icon="qrCode"
          background="transparent"
          border
          borderColor="wui-accent-glass-010"
          @click=${this.onWalletConnectQr.bind(this)}
        ></wui-icon-box>
      `:null}onWalletConnectQr(){E.push("ConnectingWalletConnect")}};Ao([m()],Fe.prototype,"search",void 0);Ao([m()],Fe.prototype,"badge",void 0);Fe=Ao([d("w3m-all-wallets-view")],Fe);var Br=g`
  button {
    column-gap: var(--wui-spacing-s);
    padding: 11px 18px 11px var(--wui-spacing-s);
    width: 100%;
    background-color: var(--wui-color-gray-glass-002);
    border-radius: var(--wui-border-radius-xs);
    color: var(--wui-color-fg-250);
    transition:
      color var(--wui-ease-out-power-1) var(--wui-duration-md),
      background-color var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: color, background-color;
  }

  button[data-iconvariant='square'],
  button[data-iconvariant='square-blue'] {
    padding: 6px 18px 6px 9px;
  }

  button > wui-flex {
    flex: 1;
  }

  button > wui-image {
    width: 32px;
    height: 32px;
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
    border-radius: var(--wui-border-radius-3xl);
  }

  button > wui-icon {
    width: 36px;
    height: 36px;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-md);
    will-change: opacity;
  }

  button > wui-icon-box[data-variant='blue'] {
    box-shadow: 0 0 0 2px var(--wui-color-accent-glass-005);
  }

  button > wui-icon-box[data-variant='overlay'] {
    box-shadow: 0 0 0 2px var(--wui-color-gray-glass-005);
  }

  button > wui-icon-box[data-variant='square-blue'] {
    border-radius: var(--wui-border-radius-3xs);
    position: relative;
    border: none;
    width: 36px;
    height: 36px;
  }

  button > wui-icon-box[data-variant='square-blue']::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    border-radius: inherit;
    border: 1px solid var(--wui-color-accent-glass-010);
    pointer-events: none;
  }

  button > wui-icon:last-child {
    width: 14px;
    height: 14px;
  }

  button:disabled {
    color: var(--wui-color-gray-glass-020);
  }

  button[data-loading='true'] > wui-icon {
    opacity: 0;
  }

  wui-loading-spinner {
    position: absolute;
    right: 18px;
    top: 50%;
    transform: translateY(-50%);
  }
`;var ot=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},K=class extends p{constructor(){super(...arguments),this.tabIdx=void 0,this.variant="icon",this.disabled=!1,this.imageSrc=void 0,this.alt=void 0,this.chevron=!1,this.loading=!1}render(){return l`
      <button
        ?disabled=${this.loading?!0:!!this.disabled}
        data-loading=${this.loading}
        data-iconvariant=${h(this.iconVariant)}
        tabindex=${h(this.tabIdx)}
      >
        ${this.loadingTemplate()} ${this.visualTemplate()}
        <wui-flex gap="3xs">
          <slot></slot>
        </wui-flex>
        ${this.chevronTemplate()}
      </button>
    `}visualTemplate(){if(this.variant==="image"&&this.imageSrc)return l`<wui-image src=${this.imageSrc} alt=${this.alt??"list item"}></wui-image>`;if(this.iconVariant==="square"&&this.icon&&this.variant==="icon")return l`<wui-icon name=${this.icon}></wui-icon>`;if(this.variant==="icon"&&this.icon&&this.iconVariant){let t=["blue","square-blue"].includes(this.iconVariant)?"accent-100":"fg-200",e=this.iconVariant==="square-blue"?"mdl":"md",i=this.iconSize?this.iconSize:e;return l`
        <wui-icon-box
          data-variant=${this.iconVariant}
          icon=${this.icon}
          iconSize=${i}
          background="transparent"
          iconColor=${t}
          backgroundColor=${t}
          size=${e}
        ></wui-icon-box>
      `}return null}loadingTemplate(){return this.loading?l`<wui-loading-spinner
        data-testid="wui-list-item-loading-spinner"
        color="fg-300"
      ></wui-loading-spinner>`:l``}chevronTemplate(){return this.chevron?l`<wui-icon size="inherit" color="fg-200" name="chevronRight"></wui-icon>`:null}};K.styles=[y,L,Br];ot([c()],K.prototype,"icon",void 0);ot([c()],K.prototype,"iconSize",void 0);ot([c()],K.prototype,"tabIdx",void 0);ot([c()],K.prototype,"variant",void 0);ot([c()],K.prototype,"iconVariant",void 0);ot([c({type:Boolean})],K.prototype,"disabled",void 0);ot([c()],K.prototype,"imageSrc",void 0);ot([c()],K.prototype,"alt",void 0);ot([c({type:Boolean})],K.prototype,"chevron",void 0);ot([c({type:Boolean})],K.prototype,"loading",void 0);K=ot([d("wui-list-item")],K);var Mn=function(r,t,e,i){var n=arguments.length,o=n<3?t:i===null?i=Object.getOwnPropertyDescriptor(t,e):i,s;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")o=Reflect.decorate(r,t,e,i);else for(var a=r.length-1;a>=0;a--)(s=r[a])&&(o=(n<3?s(o):n>3?s(t,e,o):s(t,e))||o);return n>3&&o&&Object.defineProperty(t,e,o),o},Ar=class extends p{constructor(){super(...arguments),this.wallet=E.state.data?.wallet}render(){if(!this.wallet)throw new Error("w3m-downloads-view");return l`
      <wui-flex gap="xs" flexDirection="column" .padding=${["s","s","l","s"]}>
        ${this.chromeTemplate()} ${this.iosTemplate()} ${this.androidTemplate()}
        ${this.homepageTemplate()}
      </wui-flex>
    `}chromeTemplate(){return this.wallet?.chrome_store?l`<wui-list-item
      variant="icon"
      icon="chromeStore"
      iconVariant="square"
      @click=${this.onChromeStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Chrome Extension</wui-text>
    </wui-list-item>`:null}iosTemplate(){return this.wallet?.app_store?l`<wui-list-item
      variant="icon"
      icon="appStore"
      iconVariant="square"
      @click=${this.onAppStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">iOS App</wui-text>
    </wui-list-item>`:null}androidTemplate(){return this.wallet?.play_store?l`<wui-list-item
      variant="icon"
      icon="playStore"
      iconVariant="square"
      @click=${this.onPlayStore.bind(this)}
      chevron
    >
      <wui-text variant="paragraph-500" color="fg-100">Android App</wui-text>
    </wui-list-item>`:null}homepageTemplate(){return this.wallet?.homepage?l`
      <wui-list-item
        variant="icon"
        icon="browser"
        iconVariant="square-blue"
        @click=${this.onHomePage.bind(this)}
        chevron
      >
        <wui-text variant="paragraph-500" color="fg-100">Website</wui-text>
      </wui-list-item>
    `:null}onChromeStore(){this.wallet?.chrome_store&&f.openHref(this.wallet.chrome_store,"_blank")}onAppStore(){this.wallet?.app_store&&f.openHref(this.wallet.app_store,"_blank")}onPlayStore(){this.wallet?.play_store&&f.openHref(this.wallet.play_store,"_blank")}onHomePage(){this.wallet?.homepage&&f.openHref(this.wallet.homepage,"_blank")}};Ar=Mn([d("w3m-downloads-view")],Ar);export{Fe as W3mAllWalletsView,Wo as W3mConnectingWcBasicView,Ar as W3mDownloadsView};
