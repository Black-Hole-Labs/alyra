import{J as d,K as tt,L as O,M as y,N as f}from"./chunk-L4TYMJQF.js";import{b as h,c as K,d as Z,e as p,g as A,h as Q,i as J,j as u}from"./chunk-V22BWOKJ.js";import{a as Y,b as X,k as o}from"./chunk-HIVZEDT5.js";var gt={attribute:!0,type:String,converter:K,reflect:!1,hasChanged:Z},wt=(e=gt,t,i)=>{let{kind:r,metadata:a}=i,s=globalThis.litPropertyMetadata.get(a);if(s===void 0&&globalThis.litPropertyMetadata.set(a,s=new Map),r==="setter"&&((e=Object.create(e)).wrapped=!0),s.set(i.name,e),r==="accessor"){let{name:n}=i;return{set(c){let w=t.get.call(this);t.set.call(this,c),this.requestUpdate(n,w,e)},init(c){return c!==void 0&&this.C(n,void 0,e,c),c}}}if(r==="setter"){let{name:n}=i;return function(c){let w=this[n];t.call(this,c),this.requestUpdate(n,w,e)}}throw Error("Unsupported decorator location: "+r)};function l(e){return(t,i)=>typeof i=="object"?wt(e,t,i):((r,a,s)=>{let n=a.hasOwnProperty(s);return a.constructor.createProperty(s,r),n?Object.getOwnPropertyDescriptor(a,s):void 0})(e,t,i)}function Ct(e){return l(X(Y({},e),{state:!0,attribute:!1}))}var et=h`
  :host {
    display: flex;
    width: inherit;
    height: inherit;
  }
`;var g=function(e,t,i,r){var a=arguments.length,s=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s},m=class extends u{render(){return this.style.cssText=`
      flex-direction: ${this.flexDirection};
      flex-wrap: ${this.flexWrap};
      flex-basis: ${this.flexBasis};
      flex-grow: ${this.flexGrow};
      flex-shrink: ${this.flexShrink};
      align-items: ${this.alignItems};
      justify-content: ${this.justifyContent};
      column-gap: ${this.columnGap&&`var(--wui-spacing-${this.columnGap})`};
      row-gap: ${this.rowGap&&`var(--wui-spacing-${this.rowGap})`};
      gap: ${this.gap&&`var(--wui-spacing-${this.gap})`};
      padding-top: ${this.padding&&y.getSpacingStyles(this.padding,0)};
      padding-right: ${this.padding&&y.getSpacingStyles(this.padding,1)};
      padding-bottom: ${this.padding&&y.getSpacingStyles(this.padding,2)};
      padding-left: ${this.padding&&y.getSpacingStyles(this.padding,3)};
      margin-top: ${this.margin&&y.getSpacingStyles(this.margin,0)};
      margin-right: ${this.margin&&y.getSpacingStyles(this.margin,1)};
      margin-bottom: ${this.margin&&y.getSpacingStyles(this.margin,2)};
      margin-left: ${this.margin&&y.getSpacingStyles(this.margin,3)};
    `,p`<slot></slot>`}};m.styles=[d,et];g([l()],m.prototype,"flexDirection",void 0);g([l()],m.prototype,"flexWrap",void 0);g([l()],m.prototype,"flexBasis",void 0);g([l()],m.prototype,"flexGrow",void 0);g([l()],m.prototype,"flexShrink",void 0);g([l()],m.prototype,"alignItems",void 0);g([l()],m.prototype,"justifyContent",void 0);g([l()],m.prototype,"columnGap",void 0);g([l()],m.prototype,"rowGap",void 0);g([l()],m.prototype,"gap",void 0);g([l()],m.prototype,"padding",void 0);g([l()],m.prototype,"margin",void 0);m=g([f("wui-flex")],m);var me=e=>e??Q;var D={ATTRIBUTE:1,CHILD:2,PROPERTY:3,BOOLEAN_ATTRIBUTE:4,EVENT:5,ELEMENT:6},P=e=>(...t)=>({_$litDirective$:e,values:t}),S=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,i,r){this._$Ct=t,this._$AM=i,this._$Ci=r}_$AS(t,i){return this.update(t,i)}update(t,i){return this.render(...i)}};var it=P(class extends S{constructor(e){if(super(e),e.type!==D.ATTRIBUTE||e.name!=="class"||e.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(e){return" "+Object.keys(e).filter(t=>e[t]).join(" ")+" "}update(e,[t]){if(this.st===void 0){this.st=new Set,e.strings!==void 0&&(this.nt=new Set(e.strings.join(" ").split(/\s/).filter(r=>r!=="")));for(let r in t)t[r]&&!this.nt?.has(r)&&this.st.add(r);return this.render(t)}let i=e.element.classList;for(let r of this.st)r in t||(i.remove(r),this.st.delete(r));for(let r in t){let a=!!t[r];a===this.st.has(r)||this.nt?.has(r)||(a?(i.add(r),this.st.add(r)):(i.remove(r),this.st.delete(r)))}return A}});var ot=h`
  :host {
    display: inline-flex !important;
  }

  slot {
    width: 100%;
    display: inline-block;
    font-style: normal;
    font-family: var(--wui-font-family);
    font-feature-settings:
      'tnum' on,
      'lnum' on,
      'case' on;
    line-height: 130%;
    font-weight: var(--wui-font-weight-regular);
    overflow: inherit;
    text-overflow: inherit;
    text-align: var(--local-align);
    color: var(--local-color);
  }

  .wui-line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .wui-line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }

  .wui-font-medium-400 {
    font-size: var(--wui-font-size-medium);
    font-weight: var(--wui-font-weight-light);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-medium-600 {
    font-size: var(--wui-font-size-medium);
    letter-spacing: var(--wui-letter-spacing-medium);
  }

  .wui-font-title-600 {
    font-size: var(--wui-font-size-title);
    letter-spacing: var(--wui-letter-spacing-title);
  }

  .wui-font-title-6-600 {
    font-size: var(--wui-font-size-title-6);
    letter-spacing: var(--wui-letter-spacing-title-6);
  }

  .wui-font-mini-700 {
    font-size: var(--wui-font-size-mini);
    letter-spacing: var(--wui-letter-spacing-mini);
    text-transform: uppercase;
  }

  .wui-font-large-500,
  .wui-font-large-600,
  .wui-font-large-700 {
    font-size: var(--wui-font-size-large);
    letter-spacing: var(--wui-letter-spacing-large);
  }

  .wui-font-2xl-500,
  .wui-font-2xl-600,
  .wui-font-2xl-700 {
    font-size: var(--wui-font-size-2xl);
    letter-spacing: var(--wui-letter-spacing-2xl);
  }

  .wui-font-paragraph-400,
  .wui-font-paragraph-500,
  .wui-font-paragraph-600,
  .wui-font-paragraph-700 {
    font-size: var(--wui-font-size-paragraph);
    letter-spacing: var(--wui-letter-spacing-paragraph);
  }

  .wui-font-small-400,
  .wui-font-small-500,
  .wui-font-small-600 {
    font-size: var(--wui-font-size-small);
    letter-spacing: var(--wui-letter-spacing-small);
  }

  .wui-font-tiny-400,
  .wui-font-tiny-500,
  .wui-font-tiny-600 {
    font-size: var(--wui-font-size-tiny);
    letter-spacing: var(--wui-letter-spacing-tiny);
  }

  .wui-font-micro-700,
  .wui-font-micro-600 {
    font-size: var(--wui-font-size-micro);
    letter-spacing: var(--wui-letter-spacing-micro);
    text-transform: uppercase;
  }

  .wui-font-tiny-400,
  .wui-font-small-400,
  .wui-font-medium-400,
  .wui-font-paragraph-400 {
    font-weight: var(--wui-font-weight-light);
  }

  .wui-font-large-700,
  .wui-font-paragraph-700,
  .wui-font-micro-700,
  .wui-font-mini-700 {
    font-weight: var(--wui-font-weight-bold);
  }

  .wui-font-medium-600,
  .wui-font-medium-title-600,
  .wui-font-title-6-600,
  .wui-font-large-600,
  .wui-font-paragraph-600,
  .wui-font-small-600,
  .wui-font-tiny-600,
  .wui-font-micro-600 {
    font-weight: var(--wui-font-weight-medium);
  }

  :host([disabled]) {
    opacity: 0.4;
  }
`;var k=function(e,t,i,r){var a=arguments.length,s=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s},b=class extends u{constructor(){super(...arguments),this.variant="paragraph-500",this.color="fg-300",this.align="left",this.lineClamp=void 0}render(){let t={[`wui-font-${this.variant}`]:!0,[`wui-color-${this.color}`]:!0,[`wui-line-clamp-${this.lineClamp}`]:!!this.lineClamp};return this.style.cssText=`
      --local-align: ${this.align};
      --local-color: var(--wui-color-${this.color});
    `,p`<slot class=${it(t)}></slot>`}};b.styles=[d,ot];k([l()],b.prototype,"variant",void 0);k([l()],b.prototype,"color",void 0);k([l()],b.prototype,"align",void 0);k([l()],b.prototype,"lineClamp",void 0);b=k([f("wui-text")],b);var{I:Be}=J,rt=e=>e===null||typeof e!="object"&&typeof e!="function";var st=e=>e.strings===void 0;var R=(e,t)=>{let i=e._$AN;if(i===void 0)return!1;for(let r of i)r._$AO?.(t,!1),R(r,t);return!0},L=e=>{let t,i;do{if((t=e._$AM)===void 0)break;i=t._$AN,i.delete(e),e=t}while(i?.size===0)},at=e=>{for(let t;t=e._$AM;e=t){let i=t._$AN;if(i===void 0)t._$AN=i=new Set;else if(i.has(e))break;i.add(e),xt(t)}};function vt(e){this._$AN!==void 0?(L(this),this._$AM=e,at(this)):this._$AM=e}function yt(e,t=!1,i=0){let r=this._$AH,a=this._$AN;if(a!==void 0&&a.size!==0)if(t)if(Array.isArray(r))for(let s=i;s<r.length;s++)R(r[s],!1),L(r[s]);else r!=null&&(R(r,!1),L(r));else R(this,e)}var xt=e=>{e.type==D.CHILD&&(e._$AP??=yt,e._$AQ??=vt)},I=class extends S{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,i,r){super._$AT(t,i,r),at(this),this.isConnected=t._$AU}_$AO(t,i=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),i&&(R(this,t),L(this))}setValue(t){if(st(this._$Ct))this._$Ct._$AI(t,this);else{let i=[...this._$Ct._$AH];i[this._$Ci]=t,this._$Ct._$AI(i,this,0)}}disconnected(){}reconnected(){}};var M=class{constructor(t){this.G=t}disconnect(){this.G=void 0}reconnect(t){this.G=t}deref(){return this.G}},H=class{constructor(){this.Y=void 0,this.Z=void 0}get(){return this.Y}pause(){this.Y??=new Promise(t=>this.Z=t)}resume(){this.Z?.(),this.Y=this.Z=void 0}};var nt=e=>!rt(e)&&typeof e.then=="function",ct=1073741823,N=class extends I{constructor(){super(...arguments),this._$Cwt=ct,this._$Cbt=[],this._$CK=new M(this),this._$CX=new H}render(...t){return t.find(i=>!nt(i))??A}update(t,i){let r=this._$Cbt,a=r.length;this._$Cbt=i;let s=this._$CK,n=this._$CX;this.isConnected||this.disconnected();for(let c=0;c<i.length&&!(c>this._$Cwt);c++){let w=i[c];if(!nt(w))return this._$Cwt=c,w;c<a&&w===r[c]||(this._$Cwt=ct,a=0,Promise.resolve(w).then(C=>o(this,null,function*(){for(;n.get();)yield n.get();let z=s.deref();if(z!==void 0){let G=z._$Cbt.indexOf(w);G>-1&&G<z._$Cwt&&(z._$Cwt=G,z.setValue(C))}})))}return A}disconnected(){this._$CK.disconnect(),this._$CX.pause()}reconnected(){this._$CK.reconnect(this),this._$CX.resume()}},lt=P(N);var U=class{constructor(){this.cache=new Map}set(t,i){this.cache.set(t,i)}get(t){return this.cache.get(t)}has(t){return this.cache.has(t)}delete(t){this.cache.delete(t)}clear(){this.cache.clear()}},W=new U;var pt=h`
  :host {
    display: flex;
    aspect-ratio: var(--local-aspect-ratio);
    color: var(--local-color);
    width: var(--local-width);
  }

  svg {
    width: inherit;
    height: inherit;
    object-fit: contain;
    object-position: center;
  }

  .fallback {
    width: var(--local-width);
    height: var(--local-height);
  }
`;var T=function(e,t,i,r){var a=arguments.length,s=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s},mt={add:()=>o(void 0,null,function*(){return(yield import("./chunk-NRXBPSCW.js")).addSvg}),allWallets:()=>o(void 0,null,function*(){return(yield import("./chunk-K7CTEEPI.js")).allWalletsSvg}),arrowBottomCircle:()=>o(void 0,null,function*(){return(yield import("./chunk-XSX35ZJ6.js")).arrowBottomCircleSvg}),appStore:()=>o(void 0,null,function*(){return(yield import("./chunk-6DTRJOVC.js")).appStoreSvg}),apple:()=>o(void 0,null,function*(){return(yield import("./chunk-GRHDOLCQ.js")).appleSvg}),arrowBottom:()=>o(void 0,null,function*(){return(yield import("./chunk-GHVWKAAH.js")).arrowBottomSvg}),arrowLeft:()=>o(void 0,null,function*(){return(yield import("./chunk-MIUSYN6X.js")).arrowLeftSvg}),arrowRight:()=>o(void 0,null,function*(){return(yield import("./chunk-V2NVWQPN.js")).arrowRightSvg}),arrowTop:()=>o(void 0,null,function*(){return(yield import("./chunk-ZG3U2PC7.js")).arrowTopSvg}),bank:()=>o(void 0,null,function*(){return(yield import("./chunk-GZI73SEZ.js")).bankSvg}),browser:()=>o(void 0,null,function*(){return(yield import("./chunk-Q6AXZYAI.js")).browserSvg}),card:()=>o(void 0,null,function*(){return(yield import("./chunk-DRZYZ7SG.js")).cardSvg}),checkmark:()=>o(void 0,null,function*(){return(yield import("./chunk-LJSNZH2I.js")).checkmarkSvg}),checkmarkBold:()=>o(void 0,null,function*(){return(yield import("./chunk-52L7H4UV.js")).checkmarkBoldSvg}),chevronBottom:()=>o(void 0,null,function*(){return(yield import("./chunk-WMB3PC74.js")).chevronBottomSvg}),chevronLeft:()=>o(void 0,null,function*(){return(yield import("./chunk-2CY3PDZ2.js")).chevronLeftSvg}),chevronRight:()=>o(void 0,null,function*(){return(yield import("./chunk-4LYC7W47.js")).chevronRightSvg}),chevronTop:()=>o(void 0,null,function*(){return(yield import("./chunk-RZ3FCJLX.js")).chevronTopSvg}),chromeStore:()=>o(void 0,null,function*(){return(yield import("./chunk-DRPAEG7D.js")).chromeStoreSvg}),clock:()=>o(void 0,null,function*(){return(yield import("./chunk-UYHAOUXJ.js")).clockSvg}),close:()=>o(void 0,null,function*(){return(yield import("./chunk-5LFKRUCS.js")).closeSvg}),compass:()=>o(void 0,null,function*(){return(yield import("./chunk-AHIRULH7.js")).compassSvg}),coinPlaceholder:()=>o(void 0,null,function*(){return(yield import("./chunk-KY374MD2.js")).coinPlaceholderSvg}),copy:()=>o(void 0,null,function*(){return(yield import("./chunk-JYAVTHY4.js")).copySvg}),cursor:()=>o(void 0,null,function*(){return(yield import("./chunk-LKVFF62Y.js")).cursorSvg}),cursorTransparent:()=>o(void 0,null,function*(){return(yield import("./chunk-LMQZOIPL.js")).cursorTransparentSvg}),desktop:()=>o(void 0,null,function*(){return(yield import("./chunk-JPZWPK7I.js")).desktopSvg}),disconnect:()=>o(void 0,null,function*(){return(yield import("./chunk-UZK7QBJN.js")).disconnectSvg}),discord:()=>o(void 0,null,function*(){return(yield import("./chunk-FZBJBAKY.js")).discordSvg}),etherscan:()=>o(void 0,null,function*(){return(yield import("./chunk-XLYWURKO.js")).etherscanSvg}),extension:()=>o(void 0,null,function*(){return(yield import("./chunk-W4FBCETW.js")).extensionSvg}),externalLink:()=>o(void 0,null,function*(){return(yield import("./chunk-TAI33HHH.js")).externalLinkSvg}),facebook:()=>o(void 0,null,function*(){return(yield import("./chunk-2KUA3B3E.js")).facebookSvg}),farcaster:()=>o(void 0,null,function*(){return(yield import("./chunk-Q6IJ5BMP.js")).farcasterSvg}),filters:()=>o(void 0,null,function*(){return(yield import("./chunk-O72ZFWE6.js")).filtersSvg}),github:()=>o(void 0,null,function*(){return(yield import("./chunk-ZCKT6PZA.js")).githubSvg}),google:()=>o(void 0,null,function*(){return(yield import("./chunk-WYL2CZFB.js")).googleSvg}),helpCircle:()=>o(void 0,null,function*(){return(yield import("./chunk-IU574BK2.js")).helpCircleSvg}),image:()=>o(void 0,null,function*(){return(yield import("./chunk-TG7EBS32.js")).imageSvg}),id:()=>o(void 0,null,function*(){return(yield import("./chunk-VKDKZP2J.js")).idSvg}),infoCircle:()=>o(void 0,null,function*(){return(yield import("./chunk-ZILPRP76.js")).infoCircleSvg}),lightbulb:()=>o(void 0,null,function*(){return(yield import("./chunk-NSFNN77S.js")).lightbulbSvg}),mail:()=>o(void 0,null,function*(){return(yield import("./chunk-WBLQCURR.js")).mailSvg}),mobile:()=>o(void 0,null,function*(){return(yield import("./chunk-NIEYFFKP.js")).mobileSvg}),more:()=>o(void 0,null,function*(){return(yield import("./chunk-5SPPKH2B.js")).moreSvg}),networkPlaceholder:()=>o(void 0,null,function*(){return(yield import("./chunk-EZLCSIYJ.js")).networkPlaceholderSvg}),nftPlaceholder:()=>o(void 0,null,function*(){return(yield import("./chunk-OCK5DNIW.js")).nftPlaceholderSvg}),off:()=>o(void 0,null,function*(){return(yield import("./chunk-EHDKNRXN.js")).offSvg}),playStore:()=>o(void 0,null,function*(){return(yield import("./chunk-SEY67MXJ.js")).playStoreSvg}),plus:()=>o(void 0,null,function*(){return(yield import("./chunk-UJINZBU2.js")).plusSvg}),qrCode:()=>o(void 0,null,function*(){return(yield import("./chunk-GKTZXDSX.js")).qrCodeIcon}),recycleHorizontal:()=>o(void 0,null,function*(){return(yield import("./chunk-65BDTS25.js")).recycleHorizontalSvg}),refresh:()=>o(void 0,null,function*(){return(yield import("./chunk-YGSGPZ6H.js")).refreshSvg}),search:()=>o(void 0,null,function*(){return(yield import("./chunk-WXCFNHAV.js")).searchSvg}),send:()=>o(void 0,null,function*(){return(yield import("./chunk-7KWIDFBI.js")).sendSvg}),swapHorizontal:()=>o(void 0,null,function*(){return(yield import("./chunk-4JJJ6LZ4.js")).swapHorizontalSvg}),swapHorizontalMedium:()=>o(void 0,null,function*(){return(yield import("./chunk-VVNRQDJP.js")).swapHorizontalMediumSvg}),swapHorizontalBold:()=>o(void 0,null,function*(){return(yield import("./chunk-2N6FICB4.js")).swapHorizontalBoldSvg}),swapHorizontalRoundedBold:()=>o(void 0,null,function*(){return(yield import("./chunk-REQEL6XA.js")).swapHorizontalRoundedBoldSvg}),swapVertical:()=>o(void 0,null,function*(){return(yield import("./chunk-4KGFQVCB.js")).swapVerticalSvg}),telegram:()=>o(void 0,null,function*(){return(yield import("./chunk-XPRFT3XV.js")).telegramSvg}),threeDots:()=>o(void 0,null,function*(){return(yield import("./chunk-OLDZLH7M.js")).threeDotsSvg}),twitch:()=>o(void 0,null,function*(){return(yield import("./chunk-M77KAKZT.js")).twitchSvg}),twitter:()=>o(void 0,null,function*(){return(yield import("./chunk-KUDYFDYS.js")).xSvg}),twitterIcon:()=>o(void 0,null,function*(){return(yield import("./chunk-NFDQAF2C.js")).twitterIconSvg}),verify:()=>o(void 0,null,function*(){return(yield import("./chunk-3PACB5NR.js")).verifySvg}),verifyFilled:()=>o(void 0,null,function*(){return(yield import("./chunk-5LUAVL6D.js")).verifyFilledSvg}),wallet:()=>o(void 0,null,function*(){return(yield import("./chunk-XE6EVTGZ.js")).walletSvg}),walletConnect:()=>o(void 0,null,function*(){return(yield import("./chunk-WXYSH24F.js")).walletConnectSvg}),walletConnectLightBrown:()=>o(void 0,null,function*(){return(yield import("./chunk-WXYSH24F.js")).walletConnectLightBrownSvg}),walletConnectBrown:()=>o(void 0,null,function*(){return(yield import("./chunk-WXYSH24F.js")).walletConnectBrownSvg}),walletPlaceholder:()=>o(void 0,null,function*(){return(yield import("./chunk-AUCPELQQ.js")).walletPlaceholderSvg}),warningCircle:()=>o(void 0,null,function*(){return(yield import("./chunk-RQG7PHXX.js")).warningCircleSvg}),x:()=>o(void 0,null,function*(){return(yield import("./chunk-KUDYFDYS.js")).xSvg}),info:()=>o(void 0,null,function*(){return(yield import("./chunk-OVEIUXDI.js")).infoSvg}),exclamationTriangle:()=>o(void 0,null,function*(){return(yield import("./chunk-4RV7VVG5.js")).exclamationTriangleSvg}),reown:()=>o(void 0,null,function*(){return(yield import("./chunk-FEDG6COQ.js")).reownSvg})};function bt(e){return o(this,null,function*(){if(W.has(e))return W.get(e);let i=(mt[e]??mt.copy)();return W.set(e,i),i})}var $=class extends u{constructor(){super(...arguments),this.size="md",this.name="copy",this.color="fg-300",this.aspectRatio="1 / 1"}render(){return this.style.cssText=`
      --local-color: ${`var(--wui-color-${this.color});`}
      --local-width: ${`var(--wui-icon-size-${this.size});`}
      --local-aspect-ratio: ${this.aspectRatio}
    `,p`${lt(bt(this.name),p`<div class="fallback"></div>`)}`}};$.styles=[d,O,pt];T([l()],$.prototype,"size",void 0);T([l()],$.prototype,"name",void 0);T([l()],$.prototype,"color",void 0);T([l()],$.prototype,"aspectRatio",void 0);$=T([f("wui-icon")],$);var ht=h`
  :host {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    background-color: var(--wui-color-gray-glass-020);
    border-radius: var(--local-border-radius);
    border: var(--local-border);
    box-sizing: content-box;
    width: var(--local-size);
    height: var(--local-size);
    min-height: var(--local-size);
    min-width: var(--local-size);
  }

  @supports (background: color-mix(in srgb, white 50%, black)) {
    :host {
      background-color: color-mix(in srgb, var(--local-bg-value) var(--local-bg-mix), transparent);
    }
  }
`;var x=function(e,t,i,r){var a=arguments.length,s=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s},v=class extends u{constructor(){super(...arguments),this.size="md",this.backgroundColor="accent-100",this.iconColor="accent-100",this.background="transparent",this.border=!1,this.borderColor="wui-color-bg-125",this.icon="copy"}render(){let t=this.iconSize||this.size,i=this.size==="lg",r=this.size==="xl",a=i?"12%":"16%",s=i?"xxs":r?"s":"3xl",n=this.background==="gray",c=this.background==="opaque",w=this.backgroundColor==="accent-100"&&c||this.backgroundColor==="success-100"&&c||this.backgroundColor==="error-100"&&c||this.backgroundColor==="inverse-100"&&c,C=`var(--wui-color-${this.backgroundColor})`;return w?C=`var(--wui-icon-box-bg-${this.backgroundColor})`:n&&(C=`var(--wui-color-gray-${this.backgroundColor})`),this.style.cssText=`
       --local-bg-value: ${C};
       --local-bg-mix: ${w||n?"100%":a};
       --local-border-radius: var(--wui-border-radius-${s});
       --local-size: var(--wui-icon-box-size-${this.size});
       --local-border: ${this.borderColor==="wui-color-bg-125"?"2px":"1px"} solid ${this.border?`var(--${this.borderColor})`:"transparent"}
   `,p` <wui-icon color=${this.iconColor} size=${t} name=${this.icon}></wui-icon> `}};v.styles=[d,tt,ht];x([l()],v.prototype,"size",void 0);x([l()],v.prototype,"backgroundColor",void 0);x([l()],v.prototype,"iconColor",void 0);x([l()],v.prototype,"iconSize",void 0);x([l()],v.prototype,"background",void 0);x([l({type:Boolean})],v.prototype,"border",void 0);x([l()],v.prototype,"borderColor",void 0);x([l()],v.prototype,"icon",void 0);v=x([f("wui-icon-box")],v);var ut=h`
  :host {
    display: block;
    width: var(--local-width);
    height: var(--local-height);
  }

  img {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center center;
    border-radius: inherit;
  }
`;var q=function(e,t,i,r){var a=arguments.length,s=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s},_=class extends u{constructor(){super(...arguments),this.src="./path/to/image.jpg",this.alt="Image",this.size=void 0}render(){return this.style.cssText=`
      --local-width: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      --local-height: ${this.size?`var(--wui-icon-size-${this.size});`:"100%"};
      `,p`<img src=${this.src} alt=${this.alt} @error=${this.handleImageError} />`}handleImageError(){this.dispatchEvent(new CustomEvent("onLoadError",{bubbles:!0,composed:!0}))}};_.styles=[d,O,ut];q([l()],_.prototype,"src",void 0);q([l()],_.prototype,"alt",void 0);q([l()],_.prototype,"size",void 0);_=q([f("wui-image")],_);var dt=h`
  :host {
    display: flex;
    justify-content: center;
    align-items: center;
    height: var(--wui-spacing-m);
    padding: 0 var(--wui-spacing-3xs) !important;
    border-radius: var(--wui-border-radius-5xs);
    transition:
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius, background-color;
  }

  :host > wui-text {
    transform: translateY(5%);
  }

  :host([data-variant='main']) {
    background-color: var(--wui-color-accent-glass-015);
    color: var(--wui-color-accent-100);
  }

  :host([data-variant='shade']) {
    background-color: var(--wui-color-gray-glass-010);
    color: var(--wui-color-fg-200);
  }

  :host([data-variant='success']) {
    background-color: var(--wui-icon-box-bg-success-100);
    color: var(--wui-color-success-100);
  }

  :host([data-variant='error']) {
    background-color: var(--wui-icon-box-bg-error-100);
    color: var(--wui-color-error-100);
  }

  :host([data-size='lg']) {
    padding: 11px 5px !important;
  }

  :host([data-size='lg']) > wui-text {
    transform: translateY(2%);
  }
`;var V=function(e,t,i,r){var a=arguments.length,s=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s},j=class extends u{constructor(){super(...arguments),this.variant="main",this.size="lg"}render(){this.dataset.variant=this.variant,this.dataset.size=this.size;let t=this.size==="md"?"mini-700":"micro-700";return p`
      <wui-text data-variant=${this.variant} variant=${t} color="inherit">
        <slot></slot>
      </wui-text>
    `}};j.styles=[d,dt];V([l()],j.prototype,"variant",void 0);V([l()],j.prototype,"size",void 0);j=V([f("wui-tag")],j);var ft=h`
  :host {
    display: flex;
  }

  :host([data-size='sm']) > svg {
    width: 12px;
    height: 12px;
  }

  :host([data-size='md']) > svg {
    width: 16px;
    height: 16px;
  }

  :host([data-size='lg']) > svg {
    width: 24px;
    height: 24px;
  }

  :host([data-size='xl']) > svg {
    width: 32px;
    height: 32px;
  }

  svg {
    animation: rotate 2s linear infinite;
  }

  circle {
    fill: none;
    stroke: var(--local-color);
    stroke-width: 4px;
    stroke-dasharray: 1, 124;
    stroke-dashoffset: 0;
    stroke-linecap: round;
    animation: dash 1.5s ease-in-out infinite;
  }

  :host([data-size='md']) > svg > circle {
    stroke-width: 6px;
  }

  :host([data-size='sm']) > svg > circle {
    stroke-width: 8px;
  }

  @keyframes rotate {
    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes dash {
    0% {
      stroke-dasharray: 1, 124;
      stroke-dashoffset: 0;
    }

    50% {
      stroke-dasharray: 90, 124;
      stroke-dashoffset: -35;
    }

    100% {
      stroke-dashoffset: -125;
    }
  }
`;var F=function(e,t,i,r){var a=arguments.length,s=a<3?t:r===null?r=Object.getOwnPropertyDescriptor(t,i):r,n;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")s=Reflect.decorate(e,t,i,r);else for(var c=e.length-1;c>=0;c--)(n=e[c])&&(s=(a<3?n(s):a>3?n(t,i,s):n(t,i))||s);return a>3&&s&&Object.defineProperty(t,i,s),s},E=class extends u{constructor(){super(...arguments),this.color="accent-100",this.size="lg"}render(){return this.style.cssText=`--local-color: ${this.color==="inherit"?"inherit":`var(--wui-color-${this.color})`}`,this.dataset.size=this.size,p`<svg viewBox="25 25 50 50">
      <circle r="20" cy="50" cx="50"></circle>
    </svg>`}};E.styles=[d,ft];F([l()],E.prototype,"color",void 0);F([l()],E.prototype,"size",void 0);E=F([f("wui-loading-spinner")],E);export{l as a,Ct as b,me as c,P as d,I as e,it as f};
