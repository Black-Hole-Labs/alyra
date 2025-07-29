import{a as pe,b as Me}from"./chunk-V22BWOKJ.js";import{A as Ot,B as Ut,C as Dt,D as Mt,E as Lt,F as Bt,G as Ft,H as Ht,I as rr,J as or,K as nr,a as it,c as Ct,d as er,e as $e,f as Et,g as De,h as tr,i as bt,j as vt,k as At,l as St,m as It,n as at,o as yt,p as Nt,q as _t,r as Xe,s as Qe,t as ct,u as Tt,v as qe,w as xt,x as Pt,y as Rt,z as kt}from"./chunk-USJIJJ3H.js";import{a as kr,s as Or}from"./chunk-26CTAKM4.js";import{a as d,b as A,c as Ae,h as Rr,k as u}from"./chunk-HIVZEDT5.js";var K={WC_NAME_SUFFIX:".reown.id",WC_NAME_SUFFIX_LEGACY:".wcn.id",BLOCKCHAIN_API_RPC_URL:"https://rpc.walletconnect.org",PULSE_API_URL:"https://pulse.walletconnect.org",W3M_API_URL:"https://api.web3modal.org",CONNECTOR_ID:{WALLET_CONNECT:"walletConnect",INJECTED:"injected",WALLET_STANDARD:"announced",COINBASE:"coinbaseWallet",COINBASE_SDK:"coinbaseWalletSDK",SAFE:"safe",LEDGER:"ledger",OKX:"okx",EIP6963:"eip6963",AUTH:"ID_AUTH"},CONNECTOR_NAMES:{AUTH:"Auth"},AUTH_CONNECTOR_SUPPORTED_CHAINS:["eip155","solana"],LIMITS:{PENDING_TRANSACTIONS:99},CHAIN:{EVM:"eip155",SOLANA:"solana",POLKADOT:"polkadot",BITCOIN:"bip122"},CHAIN_NAME_MAP:{eip155:"EVM Networks",solana:"Solana",polkadot:"Polkadot",bip122:"Bitcoin"},ADAPTER_TYPES:{BITCOIN:"bitcoin",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5"},USDT_CONTRACT_ADDRESSES:["0xdac17f958d2ee523a2206206994597c13d831ec7","0xc2132d05d31c914a87c6611c10748aeb04b58e8f","0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7","0x919C1c267BC06a7039e03fcc2eF738525769109c","0x48065fbBE25f71C9282ddf5e1cD6D6A887483D5e","0x55d398326f99059fF775485246999027B3197955","0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9"],HTTP_STATUS_CODES:{SERVICE_UNAVAILABLE:503,FORBIDDEN:403},UNSUPPORTED_NETWORK_NAME:"Unknown Network"};var Wt={caipNetworkIdToNumber(e){return e?Number(e.split(":")[1]):void 0},parseEvmChainId(e){return typeof e=="string"?this.caipNetworkIdToNumber(e):e},getNetworksByNamespace(e,t){return e?.filter(r=>r.chainNamespace===t)||[]},getFirstNetworkByNamespace(e,t){return this.getNetworksByNamespace(e,t)[0]}};var Ur=20,Dr=1,Le=1e6,sr=1e6,Mr=-7,Lr=21,Br=!1,Ze="[big.js] ",Be=Ze+"Invalid ",lt=Be+"decimal places",Fr=Be+"rounding mode",ir=Ze+"Division by zero",W={},be=void 0,Hr=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;function ar(){function e(t){var r=this;if(!(r instanceof e))return t===be?ar():new e(t);if(t instanceof e)r.s=t.s,r.e=t.e,r.c=t.c.slice();else{if(typeof t!="string"){if(e.strict===!0&&typeof t!="bigint")throw TypeError(Be+"value");t=t===0&&1/t<0?"-0":String(t)}Wr(r,t)}r.constructor=e}return e.prototype=W,e.DP=Ur,e.RM=Dr,e.NE=Mr,e.PE=Lr,e.strict=Br,e.roundDown=0,e.roundHalfUp=1,e.roundHalfEven=2,e.roundUp=3,e}function Wr(e,t){var r,o,n;if(!Hr.test(t))throw Error(Be+"number");for(e.s=t.charAt(0)=="-"?(t=t.slice(1),-1):1,(r=t.indexOf("."))>-1&&(t=t.replace(".","")),(o=t.search(/e/i))>0?(r<0&&(r=o),r+=+t.slice(o+1),t=t.substring(0,o)):r<0&&(r=t.length),n=t.length,o=0;o<n&&t.charAt(o)=="0";)++o;if(o==n)e.c=[e.e=0];else{for(;n>0&&t.charAt(--n)=="0";);for(e.e=r-o-1,e.c=[],r=0;o<=n;)e.c[r++]=+t.charAt(o++)}return e}function Fe(e,t,r,o){var n=e.c;if(r===be&&(r=e.constructor.RM),r!==0&&r!==1&&r!==2&&r!==3)throw Error(Fr);if(t<1)o=r===3&&(o||!!n[0])||t===0&&(r===1&&n[0]>=5||r===2&&(n[0]>5||n[0]===5&&(o||n[1]!==be))),n.length=1,o?(e.e=e.e-t+1,n[0]=1):n[0]=e.e=0;else if(t<n.length){if(o=r===1&&n[t]>=5||r===2&&(n[t]>5||n[t]===5&&(o||n[t+1]!==be||n[t-1]&1))||r===3&&(o||!!n[0]),n.length=t,o){for(;++n[--t]>9;)if(n[t]=0,t===0){++e.e,n.unshift(1);break}}for(t=n.length;!n[--t];)n.pop()}return e}function He(e,t,r){var o=e.e,n=e.c.join(""),s=n.length;if(t)n=n.charAt(0)+(s>1?"."+n.slice(1):"")+(o<0?"e":"e+")+o;else if(o<0){for(;++o;)n="0"+n;n="0."+n}else if(o>0)if(++o>s)for(o-=s;o--;)n+="0";else o<s&&(n=n.slice(0,o)+"."+n.slice(o));else s>1&&(n=n.charAt(0)+"."+n.slice(1));return e.s<0&&r?"-"+n:n}W.abs=function(){var e=new this.constructor(this);return e.s=1,e};W.cmp=function(e){var t,r=this,o=r.c,n=(e=new r.constructor(e)).c,s=r.s,c=e.s,a=r.e,p=e.e;if(!o[0]||!n[0])return o[0]?s:n[0]?-c:0;if(s!=c)return s;if(t=s<0,a!=p)return a>p^t?1:-1;for(c=(a=o.length)<(p=n.length)?a:p,s=-1;++s<c;)if(o[s]!=n[s])return o[s]>n[s]^t?1:-1;return a==p?0:a>p^t?1:-1};W.div=function(e){var t=this,r=t.constructor,o=t.c,n=(e=new r(e)).c,s=t.s==e.s?1:-1,c=r.DP;if(c!==~~c||c<0||c>Le)throw Error(lt);if(!n[0])throw Error(ir);if(!o[0])return e.s=s,e.c=[e.e=0],e;var a,p,i,f,h,b=n.slice(),R=a=n.length,g=o.length,v=o.slice(0,a),O=v.length,L=e,U=L.c=[],Y=0,ne=c+(L.e=t.e-e.e)+1;for(L.s=s,s=ne<0?0:ne,b.unshift(0);O++<a;)v.push(0);do{for(i=0;i<10;i++){if(a!=(O=v.length))f=a>O?1:-1;else for(h=-1,f=0;++h<a;)if(n[h]!=v[h]){f=n[h]>v[h]?1:-1;break}if(f<0){for(p=O==a?n:b;O;){if(v[--O]<p[O]){for(h=O;h&&!v[--h];)v[h]=9;--v[h],v[O]+=10}v[O]-=p[O]}for(;!v[0];)v.shift()}else break}U[Y++]=f?i:++i,v[0]&&f?v[O]=o[R]||0:v=[o[R]]}while((R++<g||v[0]!==be)&&s--);return!U[0]&&Y!=1&&(U.shift(),L.e--,ne--),Y>ne&&Fe(L,ne,r.RM,v[0]!==be),L};W.eq=function(e){return this.cmp(e)===0};W.gt=function(e){return this.cmp(e)>0};W.gte=function(e){return this.cmp(e)>-1};W.lt=function(e){return this.cmp(e)<0};W.lte=function(e){return this.cmp(e)<1};W.minus=W.sub=function(e){var t,r,o,n,s=this,c=s.constructor,a=s.s,p=(e=new c(e)).s;if(a!=p)return e.s=-p,s.plus(e);var i=s.c.slice(),f=s.e,h=e.c,b=e.e;if(!i[0]||!h[0])return h[0]?e.s=-p:i[0]?e=new c(s):e.s=1,e;if(a=f-b){for((n=a<0)?(a=-a,o=i):(b=f,o=h),o.reverse(),p=a;p--;)o.push(0);o.reverse()}else for(r=((n=i.length<h.length)?i:h).length,a=p=0;p<r;p++)if(i[p]!=h[p]){n=i[p]<h[p];break}if(n&&(o=i,i=h,h=o,e.s=-e.s),(p=(r=h.length)-(t=i.length))>0)for(;p--;)i[t++]=0;for(p=t;r>a;){if(i[--r]<h[r]){for(t=r;t&&!i[--t];)i[t]=9;--i[t],i[r]+=10}i[r]-=h[r]}for(;i[--p]===0;)i.pop();for(;i[0]===0;)i.shift(),--b;return i[0]||(e.s=1,i=[b=0]),e.c=i,e.e=b,e};W.mod=function(e){var t,r=this,o=r.constructor,n=r.s,s=(e=new o(e)).s;if(!e.c[0])throw Error(ir);return r.s=e.s=1,t=e.cmp(r)==1,r.s=n,e.s=s,t?new o(r):(n=o.DP,s=o.RM,o.DP=o.RM=0,r=r.div(e),o.DP=n,o.RM=s,this.minus(r.times(e)))};W.neg=function(){var e=new this.constructor(this);return e.s=-e.s,e};W.plus=W.add=function(e){var t,r,o,n=this,s=n.constructor;if(e=new s(e),n.s!=e.s)return e.s=-e.s,n.minus(e);var c=n.e,a=n.c,p=e.e,i=e.c;if(!a[0]||!i[0])return i[0]||(a[0]?e=new s(n):e.s=n.s),e;if(a=a.slice(),t=c-p){for(t>0?(p=c,o=i):(t=-t,o=a),o.reverse();t--;)o.push(0);o.reverse()}for(a.length-i.length<0&&(o=i,i=a,a=o),t=i.length,r=0;t;a[t]%=10)r=(a[--t]=a[t]+i[t]+r)/10|0;for(r&&(a.unshift(r),++p),t=a.length;a[--t]===0;)a.pop();return e.c=a,e.e=p,e};W.pow=function(e){var t=this,r=new t.constructor("1"),o=r,n=e<0;if(e!==~~e||e<-sr||e>sr)throw Error(Be+"exponent");for(n&&(e=-e);e&1&&(o=o.times(t)),e>>=1,!!e;)t=t.times(t);return n?r.div(o):o};W.prec=function(e,t){if(e!==~~e||e<1||e>Le)throw Error(Be+"precision");return Fe(new this.constructor(this),e,t)};W.round=function(e,t){if(e===be)e=0;else if(e!==~~e||e<-Le||e>Le)throw Error(lt);return Fe(new this.constructor(this),e+this.e+1,t)};W.sqrt=function(){var e,t,r,o=this,n=o.constructor,s=o.s,c=o.e,a=new n("0.5");if(!o.c[0])return new n(o);if(s<0)throw Error(Ze+"No square root");s=Math.sqrt(+He(o,!0,!0)),s===0||s===1/0?(t=o.c.join(""),t.length+c&1||(t+="0"),s=Math.sqrt(t),c=((c+1)/2|0)-(c<0||c&1),e=new n((s==1/0?"5e":(s=s.toExponential()).slice(0,s.indexOf("e")+1))+c)):e=new n(s+""),c=e.e+(n.DP+=4);do r=e,e=a.times(r.plus(o.div(r)));while(r.c.slice(0,c).join("")!==e.c.slice(0,c).join(""));return Fe(e,(n.DP-=4)+e.e+1,n.RM)};W.times=W.mul=function(e){var t,r=this,o=r.constructor,n=r.c,s=(e=new o(e)).c,c=n.length,a=s.length,p=r.e,i=e.e;if(e.s=r.s==e.s?1:-1,!n[0]||!s[0])return e.c=[e.e=0],e;for(e.e=p+i,c<a&&(t=n,n=s,s=t,i=c,c=a,a=i),t=new Array(i=c+a);i--;)t[i]=0;for(p=a;p--;){for(a=0,i=c+p;i>p;)a=t[i]+s[p]*n[i-p-1]+a,t[i--]=a%10,a=a/10|0;t[i]=a}for(a?++e.e:t.shift(),p=t.length;!t[--p];)t.pop();return e.c=t,e};W.toExponential=function(e,t){var r=this,o=r.c[0];if(e!==be){if(e!==~~e||e<0||e>Le)throw Error(lt);for(r=Fe(new r.constructor(r),++e,t);r.c.length<e;)r.c.push(0)}return He(r,!0,!!o)};W.toFixed=function(e,t){var r=this,o=r.c[0];if(e!==be){if(e!==~~e||e<0||e>Le)throw Error(lt);for(r=Fe(new r.constructor(r),e+r.e+1,t),e=e+r.e+1;r.c.length<e;)r.c.push(0)}return He(r,!1,!!o)};W[Symbol.for("nodejs.util.inspect.custom")]=W.toJSON=W.toString=function(){var e=this,t=e.constructor;return He(e,e.e<=t.NE||e.e>=t.PE,!!e.c[0])};W.toNumber=function(){var e=+He(this,!0,!0);if(this.constructor.strict===!0&&!this.eq(e.toString()))throw Error(Ze+"Imprecise conversion");return e};W.toPrecision=function(e,t){var r=this,o=r.constructor,n=r.c[0];if(e!==be){if(e!==~~e||e<1||e>Le)throw Error(Be+"precision");for(r=Fe(new o(r),e,t);r.c.length<e;)r.c.push(0)}return He(r,e<=r.e||r.e<=o.NE||r.e>=o.PE,!!n)};W.valueOf=function(){var e=this,t=e.constructor;if(t.strict===!0)throw Error(Ze+"valueOf disallowed");return He(e,e.e<=t.NE||e.e>=t.PE,!0)};var jr=ar(),Ve=jr;var Ke={bigNumber(e){return e?new Ve(e):new Ve(0)},multiply(e,t){if(e===void 0||t===void 0)return new Ve(0);let r=new Ve(e),o=new Ve(t);return r.times(o)},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})},parseLocalStringToNumber(e){return e===void 0?0:parseFloat(e.replace(/,/gu,""))}};var cr=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"_from",type:"address"},{name:"_to",type:"address"},{name:"_value",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];var lr=[{type:"function",name:"approve",stateMutability:"nonpayable",inputs:[{name:"spender",type:"address"},{name:"amount",type:"uint256"}],outputs:[{type:"bool"}]}];var ur=[{type:"function",name:"transfer",stateMutability:"nonpayable",inputs:[{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[]},{type:"function",name:"transferFrom",stateMutability:"nonpayable",inputs:[{name:"sender",type:"address"},{name:"recipient",type:"address"},{name:"amount",type:"uint256"}],outputs:[{name:"",type:"bool"}]}];var jt={getERC20Abi:e=>K.USDT_CONTRACT_ADDRESSES.includes(e)?ur:cr,getSwapAbi:()=>lr};var $r={validateCaipAddress(e){if(e.split(":")?.length!==3)throw new Error("Invalid CAIP Address");return e},parseCaipAddress(e){let t=e.split(":");if(t.length!==3)throw new Error(`Invalid CAIP-10 address: ${e}`);let[r,o,n]=t;if(!r||!o||!n)throw new Error(`Invalid CAIP-10 address: ${e}`);return{chainNamespace:r,chainId:o,address:n}},parseCaipNetworkId(e){let t=e.split(":");if(t.length!==2)throw new Error(`Invalid CAIP-2 network id: ${e}`);let[r,o]=t;if(!r||!o)throw new Error(`Invalid CAIP-2 network id: ${e}`);return{chainNamespace:r,chainId:o}}};var _={WALLET_ID:"@appkit/wallet_id",WALLET_NAME:"@appkit/wallet_name",SOLANA_WALLET:"@appkit/solana_wallet",SOLANA_CAIP_CHAIN:"@appkit/solana_caip_chain",ACTIVE_CAIP_NETWORK_ID:"@appkit/active_caip_network_id",CONNECTED_SOCIAL:"@appkit/connected_social",CONNECTED_SOCIAL_USERNAME:"@appkit-wallet/SOCIAL_USERNAME",RECENT_WALLETS:"@appkit/recent_wallets",DEEPLINK_CHOICE:"WALLETCONNECT_DEEPLINK_CHOICE",ACTIVE_NAMESPACE:"@appkit/active_namespace",CONNECTED_NAMESPACES:"@appkit/connected_namespaces",CONNECTION_STATUS:"@appkit/connection_status",SIWX_AUTH_TOKEN:"@appkit/siwx-auth-token",SIWX_NONCE_TOKEN:"@appkit/siwx-nonce-token",TELEGRAM_SOCIAL_PROVIDER:"@appkit/social_provider",NATIVE_BALANCE_CACHE:"@appkit/native_balance_cache",PORTFOLIO_CACHE:"@appkit/portfolio_cache",ENS_CACHE:"@appkit/ens_cache",IDENTITY_CACHE:"@appkit/identity_cache",PREFERRED_ACCOUNT_TYPES:"@appkit/preferred_account_types"};function et(e){if(!e)throw new Error("Namespace is required for CONNECTED_CONNECTOR_ID");return`@appkit/${e}:connected_connector_id`}var I={setItem(e,t){We()&&t!==void 0&&localStorage.setItem(e,t)},getItem(e){if(We())return localStorage.getItem(e)||void 0},removeItem(e){We()&&localStorage.removeItem(e)},clear(){We()&&localStorage.clear()}};function We(){return typeof window<"u"&&typeof localStorage<"u"}function de(e,t){return t==="light"?{"--w3m-accent":e?.["--w3m-accent"]||"hsla(231, 100%, 70%, 1)","--w3m-background":"#fff"}:{"--w3m-accent":e?.["--w3m-accent"]||"hsla(230, 100%, 67%, 1)","--w3m-background":"#121313"}}var w={cacheExpiry:{portfolio:3e4,nativeBalance:3e4,ens:3e5,identity:3e5},isCacheExpired(e,t){return Date.now()-e>t},getActiveNetworkProps(){let e=w.getActiveNamespace(),t=w.getActiveCaipNetworkId(),r=t?t.split(":")[1]:void 0,o=r?isNaN(Number(r))?r:Number(r):void 0;return{namespace:e,caipNetworkId:t,chainId:o}},setWalletConnectDeepLink({name:e,href:t}){try{I.setItem(_.DEEPLINK_CHOICE,JSON.stringify({href:t,name:e}))}catch{console.info("Unable to set WalletConnect deep link")}},getWalletConnectDeepLink(){try{let e=I.getItem(_.DEEPLINK_CHOICE);if(e)return JSON.parse(e)}catch{console.info("Unable to get WalletConnect deep link")}},deleteWalletConnectDeepLink(){try{I.removeItem(_.DEEPLINK_CHOICE)}catch{console.info("Unable to delete WalletConnect deep link")}},setActiveNamespace(e){try{I.setItem(_.ACTIVE_NAMESPACE,e)}catch{console.info("Unable to set active namespace")}},setActiveCaipNetworkId(e){try{I.setItem(_.ACTIVE_CAIP_NETWORK_ID,e),w.setActiveNamespace(e.split(":")[0])}catch{console.info("Unable to set active caip network id")}},getActiveCaipNetworkId(){try{return I.getItem(_.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to get active caip network id");return}},deleteActiveCaipNetworkId(){try{I.removeItem(_.ACTIVE_CAIP_NETWORK_ID)}catch{console.info("Unable to delete active caip network id")}},deleteConnectedConnectorId(e){try{let t=et(e);I.removeItem(t)}catch{console.info("Unable to delete connected connector id")}},setAppKitRecent(e){try{let t=w.getRecentWallets();t.find(o=>o.id===e.id)||(t.unshift(e),t.length>2&&t.pop(),I.setItem(_.RECENT_WALLETS,JSON.stringify(t)))}catch{console.info("Unable to set AppKit recent")}},getRecentWallets(){try{let e=I.getItem(_.RECENT_WALLETS);return e?JSON.parse(e):[]}catch{console.info("Unable to get AppKit recent")}return[]},setConnectedConnectorId(e,t){try{let r=et(e);I.setItem(r,t)}catch{console.info("Unable to set Connected Connector Id")}},getActiveNamespace(){try{return I.getItem(_.ACTIVE_NAMESPACE)}catch{console.info("Unable to get active namespace")}},getConnectedConnectorId(e){if(e)try{let t=et(e);return I.getItem(t)}catch{console.info("Unable to get connected connector id in namespace ",e)}},setConnectedSocialProvider(e){try{I.setItem(_.CONNECTED_SOCIAL,e)}catch{console.info("Unable to set connected social provider")}},getConnectedSocialProvider(){try{return I.getItem(_.CONNECTED_SOCIAL)}catch{console.info("Unable to get connected social provider")}},deleteConnectedSocialProvider(){try{I.removeItem(_.CONNECTED_SOCIAL)}catch{console.info("Unable to delete connected social provider")}},getConnectedSocialUsername(){try{return I.getItem(_.CONNECTED_SOCIAL_USERNAME)}catch{console.info("Unable to get connected social username")}},getStoredActiveCaipNetworkId(){return I.getItem(_.ACTIVE_CAIP_NETWORK_ID)?.split(":")?.[1]},setConnectionStatus(e){try{I.setItem(_.CONNECTION_STATUS,e)}catch{console.info("Unable to set connection status")}},getConnectionStatus(){try{return I.getItem(_.CONNECTION_STATUS)}catch{return}},getConnectedNamespaces(){try{let e=I.getItem(_.CONNECTED_NAMESPACES);return e?.length?e.split(","):[]}catch{return[]}},setConnectedNamespaces(e){try{let t=Array.from(new Set(e));I.setItem(_.CONNECTED_NAMESPACES,t.join(","))}catch{console.info("Unable to set namespaces in storage")}},addConnectedNamespace(e){try{let t=w.getConnectedNamespaces();t.includes(e)||(t.push(e),w.setConnectedNamespaces(t))}catch{console.info("Unable to add connected namespace")}},removeConnectedNamespace(e){try{let t=w.getConnectedNamespaces(),r=t.indexOf(e);r>-1&&(t.splice(r,1),w.setConnectedNamespaces(t))}catch{console.info("Unable to remove connected namespace")}},getTelegramSocialProvider(){try{return I.getItem(_.TELEGRAM_SOCIAL_PROVIDER)}catch{return console.info("Unable to get telegram social provider"),null}},setTelegramSocialProvider(e){try{I.setItem(_.TELEGRAM_SOCIAL_PROVIDER,e)}catch{console.info("Unable to set telegram social provider")}},removeTelegramSocialProvider(){try{I.removeItem(_.TELEGRAM_SOCIAL_PROVIDER)}catch{console.info("Unable to remove telegram social provider")}},getBalanceCache(){let e={};try{let t=I.getItem(_.PORTFOLIO_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromBalanceCache(e){try{let t=w.getBalanceCache();I.setItem(_.PORTFOLIO_CACHE,JSON.stringify(A(d({},t),{[e]:void 0})))}catch{console.info("Unable to remove address from balance cache",e)}},getBalanceCacheForCaipAddress(e){try{let r=w.getBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.portfolio))return r.balance;w.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateBalanceCache(e){try{let t=w.getBalanceCache();t[e.caipAddress]=e,I.setItem(_.PORTFOLIO_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getNativeBalanceCache(){let e={};try{let t=I.getItem(_.NATIVE_BALANCE_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get balance cache")}return e},removeAddressFromNativeBalanceCache(e){try{let t=w.getBalanceCache();I.setItem(_.NATIVE_BALANCE_CACHE,JSON.stringify(A(d({},t),{[e]:void 0})))}catch{console.info("Unable to remove address from balance cache",e)}},getNativeBalanceCacheForCaipAddress(e){try{let r=w.getNativeBalanceCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.nativeBalance))return r;console.info("Discarding cache for address",e),w.removeAddressFromBalanceCache(e)}catch{console.info("Unable to get balance cache for address",e)}},updateNativeBalanceCache(e){try{let t=w.getNativeBalanceCache();t[e.caipAddress]=e,I.setItem(_.NATIVE_BALANCE_CACHE,JSON.stringify(t))}catch{console.info("Unable to update balance cache",e)}},getEnsCache(){let e={};try{let t=I.getItem(_.ENS_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get ens name cache")}return e},getEnsFromCacheForAddress(e){try{let r=w.getEnsCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.ens))return r.ens;w.removeEnsFromCache(e)}catch{console.info("Unable to get ens name from cache",e)}},updateEnsCache(e){try{let t=w.getEnsCache();t[e.address]=e,I.setItem(_.ENS_CACHE,JSON.stringify(t))}catch{console.info("Unable to update ens name cache",e)}},removeEnsFromCache(e){try{let t=w.getEnsCache();I.setItem(_.ENS_CACHE,JSON.stringify(A(d({},t),{[e]:void 0})))}catch{console.info("Unable to remove ens name from cache",e)}},getIdentityCache(){let e={};try{let t=I.getItem(_.IDENTITY_CACHE);e=t?JSON.parse(t):{}}catch{console.info("Unable to get identity cache")}return e},getIdentityFromCacheForAddress(e){try{let r=w.getIdentityCache()[e];if(r&&!this.isCacheExpired(r.timestamp,this.cacheExpiry.identity))return r.identity;w.removeIdentityFromCache(e)}catch{console.info("Unable to get identity from cache",e)}},updateIdentityCache(e){try{let t=w.getIdentityCache();t[e.address]={identity:e.identity,timestamp:e.timestamp},I.setItem(_.IDENTITY_CACHE,JSON.stringify(t))}catch{console.info("Unable to update identity cache",e)}},removeIdentityFromCache(e){try{let t=w.getIdentityCache();I.setItem(_.IDENTITY_CACHE,JSON.stringify(A(d({},t),{[e]:void 0})))}catch{console.info("Unable to remove identity from cache",e)}},clearAddressCache(){try{I.removeItem(_.PORTFOLIO_CACHE),I.removeItem(_.NATIVE_BALANCE_CACHE),I.removeItem(_.ENS_CACHE),I.removeItem(_.IDENTITY_CACHE)}catch{console.info("Unable to clear address cache")}},setPreferredAccountTypes(e){try{I.setItem(_.PREFERRED_ACCOUNT_TYPES,JSON.stringify(e))}catch{console.info("Unable to set preferred account types",e)}},getPreferredAccountTypes(){try{let e=I.getItem(_.PREFERRED_ACCOUNT_TYPES);return JSON.parse(e)}catch{console.info("Unable to get preferred account types")}}};var $t=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org";var ee={FOUR_MINUTES_MS:24e4,TEN_SEC_MS:1e4,FIVE_SEC_MS:5e3,THREE_SEC_MS:3e3,ONE_SEC_MS:1e3,SECURE_SITE:$t,SECURE_SITE_DASHBOARD:`${$t}/dashboard`,SECURE_SITE_FAVICON:`${$t}/images/favicon.png`,RESTRICTED_TIMEZONES:["ASIA/SHANGHAI","ASIA/URUMQI","ASIA/CHONGQING","ASIA/HARBIN","ASIA/KASHGAR","ASIA/MACAU","ASIA/HONG_KONG","ASIA/MACAO","ASIA/BEIJING","ASIA/HARBIN"],WC_COINBASE_PAY_SDK_CHAINS:["ethereum","arbitrum","polygon","berachain","avalanche-c-chain","optimism","celo","base"],WC_COINBASE_PAY_SDK_FALLBACK_CHAIN:"ethereum",WC_COINBASE_PAY_SDK_CHAIN_NAME_MAP:{Ethereum:"ethereum","Arbitrum One":"arbitrum",Polygon:"polygon",Berachain:"berachain",Avalanche:"avalanche-c-chain","OP Mainnet":"optimism",Celo:"celo",Base:"base"},WC_COINBASE_ONRAMP_APP_ID:"bf18c88d-495a-463b-b249-0b9d3656cf5e",SWAP_SUGGESTED_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP"],SWAP_POPULAR_TOKENS:["ETH","UNI","1INCH","AAVE","SOL","ADA","AVAX","DOT","LINK","NITRO","GAIA","MILK","TRX","NEAR","GNO","WBTC","DAI","WETH","USDC","USDT","ARB","BAL","BICO","CRV","ENS","MATIC","OP","METAL","DAI","CHAMP","WOLF","SALE","BAL","BUSD","MUST","BTCpx","ROUTE","HEX","WELT","amDAI","VSQ","VISION","AURUM","pSP","SNX","VC","LINK","CHP","amUSDT","SPHERE","FOX","GIDDY","GFC","OMEN","OX_OLD","DE","WNT"],BALANCE_SUPPORTED_CHAINS:["eip155","solana"],SWAP_SUPPORTED_NETWORKS:["eip155:1","eip155:42161","eip155:10","eip155:324","eip155:8453","eip155:56","eip155:137","eip155:100","eip155:43114","eip155:250","eip155:8217","eip155:1313161554"],NAMES_SUPPORTED_CHAIN_NAMESPACES:["eip155"],ONRAMP_SUPPORTED_CHAIN_NAMESPACES:["eip155","solana"],ACTIVITY_ENABLED_CHAIN_NAMESPACES:["eip155"],NATIVE_TOKEN_ADDRESS:{eip155:"0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",solana:"So11111111111111111111111111111111111111111",polkadot:"0x",bip122:"0x"},CONVERT_SLIPPAGE_TOLERANCE:1,CONNECT_LABELS:{MOBILE:"Open and continue in a new browser tab"},DEFAULT_FEATURES:{swaps:!0,onramp:!0,receive:!0,send:!0,email:!0,emailShowWallets:!0,socials:["google","x","discord","farcaster","github","apple","facebook"],connectorTypeOrder:["walletConnect","recent","injected","featured","custom","external","recommended"],history:!0,analytics:!0,allWallets:!0,legalCheckbox:!1,smartSessions:!1,collapseWallets:!1,walletFeaturesOrder:["onramp","swaps","receive","send"],connectMethodsOrder:void 0},DEFAULT_ACCOUNT_TYPES:{bip122:"payment",eip155:"smartAccount",polkadot:"eoa",solana:"eoa"},ADAPTER_TYPES:{UNIVERSAL:"universal",SOLANA:"solana",WAGMI:"wagmi",ETHERS:"ethers",ETHERS5:"ethers5",BITCOIN:"bitcoin"}};var N={isMobile(){return this.isClient()?!!(window?.matchMedia("(pointer:coarse)")?.matches||/Android|webOS|iPhone|iPad|iPod|BlackBerry|Opera Mini/u.test(navigator.userAgent)):!1},checkCaipNetwork(e,t=""){return e?.caipNetworkId.toLocaleLowerCase().includes(t.toLowerCase())},isAndroid(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return N.isMobile()&&e.includes("android")},isIos(){if(!this.isMobile())return!1;let e=window?.navigator.userAgent.toLowerCase();return e.includes("iphone")||e.includes("ipad")},isSafari(){return this.isClient()?(window?.navigator.userAgent.toLowerCase()).includes("safari"):!1},isClient(){return typeof window<"u"},isPairingExpired(e){return e?e-Date.now()<=ee.TEN_SEC_MS:!0},isAllowedRetry(e,t=ee.ONE_SEC_MS){return Date.now()-e>=t},copyToClopboard(e){navigator.clipboard.writeText(e)},isIframe(){try{return window?.self!==window?.top}catch{return!1}},getPairingExpiry(){return Date.now()+ee.FOUR_MINUTES_MS},getNetworkId(e){return e?.split(":")[1]},getPlainAddress(e){return e?.split(":")[2]},wait(e){return u(this,null,function*(){return new Promise(t=>{setTimeout(t,e)})})},debounce(e,t=500){let r;return(...o)=>{function n(){e(...o)}r&&clearTimeout(r),r=setTimeout(n,t)}},isHttpUrl(e){return e.startsWith("http://")||e.startsWith("https://")},formatNativeUrl(e,t){if(N.isHttpUrl(e))return this.formatUniversalUrl(e,t);let r=e;r.includes("://")||(r=e.replaceAll("/","").replaceAll(":",""),r=`${r}://`),r.endsWith("/")||(r=`${r}/`),this.isTelegram()&&this.isAndroid()&&(t=encodeURIComponent(t));let o=encodeURIComponent(t);return{redirect:`${r}wc?uri=${o}`,href:r}},formatUniversalUrl(e,t){if(!N.isHttpUrl(e))return this.formatNativeUrl(e,t);let r=e;r.endsWith("/")||(r=`${r}/`);let o=encodeURIComponent(t);return{redirect:`${r}wc?uri=${o}`,href:r}},getOpenTargetForPlatform(e){return e==="popupWindow"?e:this.isTelegram()?w.getTelegramSocialProvider()?"_top":"_blank":e},openHref(e,t,r){window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},returnOpenHref(e,t,r){return window?.open(e,this.getOpenTargetForPlatform(t),r||"noreferrer noopener")},isTelegram(){return typeof window<"u"&&(!!window.TelegramWebviewProxy||!!window.Telegram||!!window.TelegramWebviewProxyProto)},preloadImage(e){return u(this,null,function*(){let t=new Promise((r,o)=>{let n=new Image;n.onload=r,n.onerror=o,n.crossOrigin="anonymous",n.src=e});return Promise.race([t,N.wait(2e3)])})},formatBalance(e,t){let r="0.000";if(typeof e=="string"){let o=Number(e);if(o){let n=Math.floor(o*1e3)/1e3;n&&(r=n.toString())}}return`${r}${t?` ${t}`:""}`},formatBalance2(e,t){let r;if(e==="0")r="0";else if(typeof e=="string"){let o=Number(e);o&&(r=o.toString().match(/^-?\d+(?:\.\d{0,3})?/u)?.[0])}return{value:r??"0",rest:r==="0"?"000":"",symbol:t}},getApiUrl(){return K.W3M_API_URL},getBlockchainApiUrl(){return K.BLOCKCHAIN_API_RPC_URL},getAnalyticsUrl(){return K.PULSE_API_URL},getUUID(){return crypto?.randomUUID?crypto.randomUUID():"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/gu,e=>{let t=Math.random()*16|0;return(e==="x"?t:t&3|8).toString(16)})},parseError(e){return typeof e=="string"?e:typeof e?.issues?.[0]?.message=="string"?e.issues[0].message:e instanceof Error?e.message:"Unknown error"},sortRequestedNetworks(e,t=[]){let r={};return t&&e&&(e.forEach((o,n)=>{r[o]=n}),t.sort((o,n)=>{let s=r[o.id],c=r[n.id];return s!==void 0&&c!==void 0?s-c:s!==void 0?-1:c!==void 0?1:0})),t},calculateBalance(e){let t=0;for(let r of e)t+=r.value??0;return t},formatTokenBalance(e){let t=e.toFixed(2),[r,o]=t.split(".");return{dollars:r,pennies:o}},isAddress(e,t="eip155"){switch(t){case"eip155":if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)){if(/^(?:0x)?[0-9a-f]{40}$/iu.test(e)||/^(?:0x)?[0-9A-F]{40}$/iu.test(e))return!0}else return!1;return!1;case"solana":return/[1-9A-HJ-NP-Za-km-z]{32,44}$/iu.test(e);default:return!1}},uniqueBy(e,t){let r=new Set;return e.filter(o=>{let n=o[t];return r.has(n)?!1:(r.add(n),!0)})},generateSdkVersion(e,t,r){let n=e.length===0?ee.ADAPTER_TYPES.UNIVERSAL:e.map(s=>s.adapterType).join(",");return`${t}-${n}-${r}`},createAccount(e,t,r,o,n){return{namespace:e,address:t,type:r,publicKey:o,path:n}},isCaipAddress(e){if(typeof e!="string")return!1;let t=e.split(":"),r=t[0];return t.filter(Boolean).length===3&&r in K.CHAIN_NAME_MAP},isMac(){let e=window?.navigator.userAgent.toLowerCase();return e.includes("macintosh")&&!e.includes("safari")},formatTelegramSocialLoginUrl(e){let t=`--${encodeURIComponent(window?.location.href)}`,r="state=";if(new URL(e).host==="auth.magic.link"){let n="provider_authorization_url=",s=e.substring(e.indexOf(n)+n.length),c=this.injectIntoUrl(decodeURIComponent(s),r,t);return e.replace(s,encodeURIComponent(c))}return this.injectIntoUrl(e,r,t)},injectIntoUrl(e,t,r){let o=e.indexOf(t);if(o===-1)throw new Error(`${t} parameter not found in the URL: ${e}`);let n=e.indexOf("&",o),s=t.length,c=n!==-1?n:e.length,a=e.substring(0,o+s),p=e.substring(o+s,c),i=e.substring(n),f=p+r;return a+f+i}};var tn=Symbol(),qr=Symbol();var pr=Object.getPrototypeOf,qt=new WeakMap,Vr=e=>e&&(qt.has(e)?qt.get(e):pr(e)===Object.prototype||pr(e)===Array.prototype);var dr=e=>Vr(e)&&e[qr]||null,Vt=(e,t=!0)=>{qt.set(e,t)};var Kt=e=>typeof e=="object"&&e!==null,xe=new WeakMap,tt=new WeakSet,Kr=(e=Object.is,t=(i,f)=>new Proxy(i,f),r=i=>Kt(i)&&!tt.has(i)&&(Array.isArray(i)||!(Symbol.iterator in i))&&!(i instanceof WeakMap)&&!(i instanceof WeakSet)&&!(i instanceof Error)&&!(i instanceof Number)&&!(i instanceof Date)&&!(i instanceof String)&&!(i instanceof RegExp)&&!(i instanceof ArrayBuffer),o=i=>{switch(i.status){case"fulfilled":return i.value;case"rejected":throw i.reason;default:throw i}},n=new WeakMap,s=(i,f,h=o)=>{let b=n.get(i);if(b?.[0]===f)return b[1];let R=Array.isArray(i)?[]:Object.create(Object.getPrototypeOf(i));return Vt(R,!0),n.set(i,[f,R]),Reflect.ownKeys(i).forEach(g=>{if(Object.getOwnPropertyDescriptor(R,g))return;let v=Reflect.get(i,g),{enumerable:O}=Reflect.getOwnPropertyDescriptor(i,g),L={value:v,enumerable:O,configurable:!0};if(tt.has(v))Vt(v,!1);else if(v instanceof Promise)delete L.value,L.get=()=>h(v);else if(xe.has(v)){let[U,Y]=xe.get(v);L.value=s(U,Y(),h)}Object.defineProperty(R,g,L)}),Object.preventExtensions(R)},c=new WeakMap,a=[1,1],p=i=>{if(!Kt(i))throw new Error("object required");let f=c.get(i);if(f)return f;let h=a[0],b=new Set,R=(x,k=++a[0])=>{h!==k&&(h=k,b.forEach(S=>S(x,k)))},g=a[1],v=(x=++a[1])=>(g!==x&&!b.size&&(g=x,L.forEach(([k])=>{let S=k[1](x);S>h&&(h=S)})),h),O=x=>(k,S)=>{let Z=[...k];Z[1]=[x,...Z[1]],R(Z,S)},L=new Map,U=(x,k)=>{if((import.meta.env?import.meta.env.MODE:void 0)!=="production"&&L.has(x))throw new Error("prop listener already exists");if(b.size){let S=k[3](O(x));L.set(x,[k,S])}else L.set(x,[k])},Y=x=>{var k;let S=L.get(x);S&&(L.delete(x),(k=S[1])==null||k.call(S))},ne=x=>(b.add(x),b.size===1&&L.forEach(([S,Z],oe)=>{if((import.meta.env?import.meta.env.MODE:void 0)!=="production"&&Z)throw new Error("remove already exists");let Ue=S[3](O(oe));L.set(oe,[S,Ue])}),()=>{b.delete(x),b.size===0&&L.forEach(([S,Z],oe)=>{Z&&(Z(),L.set(oe,[S]))})}),we=Array.isArray(i)?[]:Object.create(Object.getPrototypeOf(i)),ce=t(we,{deleteProperty(x,k){let S=Reflect.get(x,k);Y(k);let Z=Reflect.deleteProperty(x,k);return Z&&R(["delete",[k],S]),Z},set(x,k,S,Z){let oe=Reflect.has(x,k),Ue=Reflect.get(x,k,Z);if(oe&&(e(Ue,S)||c.has(S)&&e(Ue,c.get(S))))return!0;Y(k),Kt(S)&&(S=dr(S)||S);let st=S;if(S instanceof Promise)S.then(Te=>{S.status="fulfilled",S.value=Te,R(["resolve",[k],Te])}).catch(Te=>{S.status="rejected",S.reason=Te,R(["reject",[k],Te])});else{!xe.has(S)&&r(S)&&(st=p(S));let Te=!tt.has(st)&&xe.get(st);Te&&U(k,Te)}return Reflect.set(x,k,st,Z),R(["set",[k],S,Ue]),!0}});c.set(i,ce);let _e=[we,v,s,ne];return xe.set(ce,_e),Reflect.ownKeys(i).forEach(x=>{let k=Object.getOwnPropertyDescriptor(i,x);"value"in k&&(ce[x]=i[x],delete k.value,delete k.writable),Object.defineProperty(we,x,k)}),ce})=>[p,xe,tt,e,t,r,o,n,s,c,a],[zr]=Kr();function y(e={}){return zr(e)}function z(e,t,r){let o=xe.get(e);(import.meta.env?import.meta.env.MODE:void 0)!=="production"&&!o&&console.warn("Please use proxy object");let n,s=[],c=o[3],a=!1,i=c(f=>{if(s.push(f),r){t(s.splice(0));return}n||(n=Promise.resolve().then(()=>{n=void 0,a&&t(s.splice(0))}))});return a=!0,()=>{a=!1,i()}}function ve(e,t){let r=xe.get(e);(import.meta.env?import.meta.env.MODE:void 0)!=="production"&&!r&&console.warn("Please use proxy object");let[o,n,s]=r;return s(o,n(),t)}function Ce(e){return tt.add(e),e}function q(e,t,r,o){let n=e[t];return z(e,()=>{let s=e[t];Object.is(n,s)||r(n=s)},o)}var cn=Symbol();function mr(e){let t=y({data:Array.from(e||[]),has(r){return this.data.some(o=>o[0]===r)},set(r,o){let n=this.data.find(s=>s[0]===r);return n?n[1]=o:this.data.push([r,o]),this},get(r){var o;return(o=this.data.find(n=>n[0]===r))==null?void 0:o[1]},delete(r){let o=this.data.findIndex(n=>n[0]===r);return o===-1?!1:(this.data.splice(o,1),!0)},clear(){this.data.splice(0)},get size(){return this.data.length},toJSON(){return new Map(this.data)},forEach(r){this.data.forEach(o=>{r(o[1],o[0],this)})},keys(){return this.data.map(r=>r[0]).values()},values(){return this.data.map(r=>r[1]).values()},entries(){return new Map(this.data).entries()},get[Symbol.toStringTag](){return"Map"},[Symbol.iterator](){return this.entries()}});return Object.defineProperties(t,{data:{enumerable:!1},size:{enumerable:!1},toJSON:{enumerable:!1}}),Object.seal(t),t}var hr={getFeatureValue(e,t){let r=t?.[e];return r===void 0?ee.DEFAULT_FEATURES[e]:r},filterSocialsByPlatform(e){if(!e||!e.length)return e;if(N.isTelegram()){if(N.isIos())return e.filter(t=>t!=="google");if(N.isMac())return e.filter(t=>t!=="x");if(N.isAndroid())return e.filter(t=>!["facebook","x"].includes(t))}return e}};var E=y({features:ee.DEFAULT_FEATURES,projectId:"",sdkType:"appkit",sdkVersion:"html-wagmi-undefined",defaultAccountTypes:{solana:"eoa",bip122:"payment",polkadot:"eoa",eip155:"smartAccount"},enableNetworkSwitch:!0}),P={state:E,subscribeKey(e,t){return q(E,e,t)},setOptions(e){Object.assign(E,e)},setFeatures(e){if(!e)return;E.features||(E.features=ee.DEFAULT_FEATURES);let t=d(d({},E.features),e);E.features=t,E.features.socials&&(E.features.socials=hr.filterSocialsByPlatform(E.features.socials))},setProjectId(e){E.projectId=e},setCustomRpcUrls(e){E.customRpcUrls=e},setAllWallets(e){E.allWallets=e},setIncludeWalletIds(e){E.includeWalletIds=e},setExcludeWalletIds(e){E.excludeWalletIds=e},setFeaturedWalletIds(e){E.featuredWalletIds=e},setTokens(e){E.tokens=e},setTermsConditionsUrl(e){E.termsConditionsUrl=e},setPrivacyPolicyUrl(e){E.privacyPolicyUrl=e},setCustomWallets(e){E.customWallets=e},setIsSiweEnabled(e){E.isSiweEnabled=e},setIsUniversalProvider(e){E.isUniversalProvider=e},setSdkVersion(e){E.sdkVersion=e},setMetadata(e){E.metadata=e},setDisableAppend(e){E.disableAppend=e},setEIP6963Enabled(e){E.enableEIP6963=e},setDebug(e){E.debug=e},setEnableWalletConnect(e){E.enableWalletConnect=e},setEnableWalletGuide(e){E.enableWalletGuide=e},setEnableAuthLogger(e){E.enableAuthLogger=e},setEnableWallets(e){E.enableWallets=e},setHasMultipleAddresses(e){E.hasMultipleAddresses=e},setSIWX(e){E.siwx=e},setConnectMethodsOrder(e){E.features=A(d({},E.features),{connectMethodsOrder:e})},setWalletFeaturesOrder(e){E.features=A(d({},E.features),{walletFeaturesOrder:e})},setSocialsOrder(e){E.features=A(d({},E.features),{socials:e})},setCollapseWallets(e){E.features=A(d({},E.features),{collapseWallets:e})},setEnableEmbedded(e){E.enableEmbedded=e},setAllowUnsupportedChain(e){E.allowUnsupportedChain=e},setManualWCControl(e){E.manualWCControl=e},setEnableNetworkSwitch(e){E.enableNetworkSwitch=e},setDefaultAccountTypes(e={}){Object.entries(e).forEach(([t,r])=>{r&&(E.defaultAccountTypes[t]=r)})},setUniversalProviderConfigOverride(e){E.universalProviderConfigOverride=e},getUniversalProviderConfigOverride(){return E.universalProviderConfigOverride},getSnapshot(){return ve(E)}};var le=y({walletImages:{},networkImages:{},chainImages:{},connectorImages:{},tokenImages:{},currencyImages:{}}),se={state:le,subscribeNetworkImages(e){return z(le.networkImages,()=>e(le.networkImages))},subscribeKey(e,t){return q(le,e,t)},subscribe(e){return z(le,()=>e(le))},setWalletImage(e,t){le.walletImages[e]=t},setNetworkImage(e,t){le.networkImages[e]=t},setChainImage(e,t){le.chainImages[e]=t},setConnectorImage(e,t){le.connectorImages=A(d({},le.connectorImages),{[e]:t})},setTokenImage(e,t){le.tokenImages[e]=t},setCurrencyImage(e,t){le.currencyImages[e]=t}};var Gr={eip155:"ba0ba0cd-17c6-4806-ad93-f9d174f17900",solana:"a1b58899-f671-4276-6a5e-56ca5bd59700",polkadot:"",bip122:"0b4838db-0161-4ffe-022d-532bf03dba00"},zt=y({networkImagePromises:{}}),Gt={fetchWalletImage(e){return u(this,null,function*(){if(e)return yield T._fetchWalletImage(e),this.getWalletImageById(e)})},fetchNetworkImage(e){return u(this,null,function*(){if(!e)return;let t=this.getNetworkImageById(e);return t||(zt.networkImagePromises[e]||(zt.networkImagePromises[e]=T._fetchNetworkImage(e)),yield zt.networkImagePromises[e],this.getNetworkImageById(e))})},getWalletImageById(e){if(e)return se.state.walletImages[e]},getWalletImage(e){if(e?.image_url)return e?.image_url;if(e?.image_id)return se.state.walletImages[e.image_id]},getNetworkImage(e){if(e?.assets?.imageUrl)return e?.assets?.imageUrl;if(e?.assets?.imageId)return se.state.networkImages[e.assets.imageId]},getNetworkImageById(e){if(e)return se.state.networkImages[e]},getConnectorImage(e){if(e?.imageUrl)return e.imageUrl;if(e?.imageId)return se.state.connectorImages[e.imageId]},getChainImage(e){return se.state.networkImages[Gr[e]]}};function rt(...e){return u(this,null,function*(){let t=yield fetch(...e);if(!t.ok)throw new Error(`HTTP status code: ${t.status}`,{cause:t});return t})}var Se=class{constructor({baseUrl:t,clientId:r}){this.baseUrl=t,this.clientId=r}get(s){return u(this,null,function*(){var c=s,{headers:t,signal:r,cache:o}=c,n=Ae(c,["headers","signal","cache"]);let a=this.createUrl(n);return(yield rt(a,{method:"GET",headers:t,signal:r,cache:o})).json()})}getBlob(n){return u(this,null,function*(){var s=n,{headers:t,signal:r}=s,o=Ae(s,["headers","signal"]);let c=this.createUrl(o);return(yield rt(c,{method:"GET",headers:t,signal:r})).blob()})}post(s){return u(this,null,function*(){var c=s,{body:t,headers:r,signal:o}=c,n=Ae(c,["body","headers","signal"]);let a=this.createUrl(n);return(yield rt(a,{method:"POST",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()})}put(s){return u(this,null,function*(){var c=s,{body:t,headers:r,signal:o}=c,n=Ae(c,["body","headers","signal"]);let a=this.createUrl(n);return(yield rt(a,{method:"PUT",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()})}delete(s){return u(this,null,function*(){var c=s,{body:t,headers:r,signal:o}=c,n=Ae(c,["body","headers","signal"]);let a=this.createUrl(n);return(yield rt(a,{method:"DELETE",headers:r,body:t?JSON.stringify(t):void 0,signal:o})).json()})}createUrl({path:t,params:r}){let o=new URL(t,this.baseUrl);return r&&Object.entries(r).forEach(([n,s])=>{s&&o.searchParams.append(n,s)}),this.clientId&&o.searchParams.append("clientId",this.clientId),o}};var fr={handleSolanaDeeplinkRedirect(e){if(l.state.activeChain===K.CHAIN.SOLANA){let t=window.location.href,r=encodeURIComponent(t);if(e==="Phantom"&&!("phantom"in window)){let o=t.startsWith("https")?"https":"http",n=t.split("/")[2],s=encodeURIComponent(`${o}://${n}`);window.location.href=`https://phantom.app/ul/browse/${r}?ref=${s}`}e==="Coinbase Wallet"&&!("coinbaseSolana"in window)&&(window.location.href=`https://go.cb-w.com/dapp?cb_url=${r}`)}}};var je=Object.freeze({message:"",variant:"success",svg:void 0,open:!1,autoClose:!0}),re=y(d({},je)),Q={state:re,subscribeKey(e,t){return q(re,e,t)},showLoading(e,t={}){this._showMessage(d({message:e,variant:"loading"},t))},showSuccess(e){this._showMessage({message:e,variant:"success"})},showSvg(e,t){this._showMessage({message:e,svg:t})},showError(e){let t=N.parseError(e);this._showMessage({message:t,variant:"error"})},hide(){re.message=je.message,re.variant=je.variant,re.svg=je.svg,re.open=je.open,re.autoClose=je.autoClose},_showMessage({message:e,svg:t,variant:r="success",autoClose:o=je.autoClose}){re.open?(re.open=!1,setTimeout(()=>{re.message=e,re.variant=r,re.svg=t,re.open=!0,re.autoClose=o},150)):(re.message=e,re.variant=r,re.svg=t,re.open=!0,re.autoClose=o)}};var Yr={purchaseCurrencies:[{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"USD Coin",symbol:"USDC",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]},{id:"2b92315d-eab7-5bef-84fa-089a131333f5",name:"Ether",symbol:"ETH",networks:[{name:"ethereum-mainnet",display_name:"Ethereum",chain_id:"1",contract_address:"0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"},{name:"polygon-mainnet",display_name:"Polygon",chain_id:"137",contract_address:"0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174"}]}],paymentCurrencies:[{id:"USD",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]},{id:"EUR",payment_method_limits:[{id:"card",min:"10.00",max:"7500.00"},{id:"ach_bank_account",min:"10.00",max:"25000.00"}]}]},gr=N.getBlockchainApiUrl(),ue=y({clientId:null,api:new Se({baseUrl:gr,clientId:null}),supportedChains:{http:[],ws:[]}}),C={state:ue,get(e){return u(this,null,function*(){let{st:t,sv:r}=C.getSdkProperties(),o=P.state.projectId,n=A(d({},e.params||{}),{st:t,sv:r,projectId:o});return ue.api.get(A(d({},e),{params:n}))})},getSdkProperties(){let{sdkType:e,sdkVersion:t}=P.state;return{st:e||"unknown",sv:t||"unknown"}},isNetworkSupported(e){return u(this,null,function*(){if(!e)return!1;try{ue.supportedChains.http.length||(yield C.getSupportedNetworks())}catch{return!1}return ue.supportedChains.http.includes(e)})},getSupportedNetworks(){return u(this,null,function*(){let e=yield C.get({path:"v1/supported-chains"});return ue.supportedChains=e,e})},fetchIdentity(r){return u(this,arguments,function*({address:e,caipNetworkId:t}){if(!(yield C.isNetworkSupported(t)))return{avatar:"",name:""};let n=w.getIdentityFromCacheForAddress(e);if(n)return n;let s=yield C.get({path:`/v1/identity/${e}`,params:{sender:l.state.activeCaipAddress?N.getPlainAddress(l.state.activeCaipAddress):void 0}});return w.updateIdentityCache({address:e,identity:s,timestamp:Date.now()}),s})},fetchTransactions(c){return u(this,arguments,function*({account:e,cursor:t,onramp:r,signal:o,cache:n,chainId:s}){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?C.get({path:`/v1/account/${e}/history`,params:{cursor:t,onramp:r,chainId:s},signal:o,cache:n}):{data:[],next:void 0}})},fetchSwapQuote(s){return u(this,arguments,function*({amount:e,userAddress:t,from:r,to:o,gasPrice:n}){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?C.get({path:"/v1/convert/quotes",headers:{"Content-Type":"application/json"},params:{amount:e,userAddress:t,from:r,to:o,gasPrice:n}}):{quotes:[]}})},fetchSwapTokens(t){return u(this,arguments,function*({chainId:e}){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?C.get({path:"/v1/convert/tokens",params:{chainId:e}}):{tokens:[]}})},fetchTokenPrice(t){return u(this,arguments,function*({addresses:e}){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?ue.api.post({path:"/v1/fungible/price",body:{currency:"usd",addresses:e,projectId:P.state.projectId},headers:{"Content-Type":"application/json"}}):{fungibles:[]}})},fetchSwapAllowance(r){return u(this,arguments,function*({tokenAddress:e,userAddress:t}){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?C.get({path:"/v1/convert/allowance",params:{tokenAddress:e,userAddress:t},headers:{"Content-Type":"application/json"}}):{allowance:"0"}})},fetchGasPrice(t){return u(this,arguments,function*({chainId:e}){let{st:r,sv:o}=C.getSdkProperties();if(!(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId)))throw new Error("Network not supported for Gas Price");return C.get({path:"/v1/convert/gas-price",headers:{"Content-Type":"application/json"},params:{chainId:e,st:r,sv:o}})})},generateSwapCalldata(s){return u(this,arguments,function*({amount:e,from:t,to:r,userAddress:o,disableEstimate:n}){if(!(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId)))throw new Error("Network not supported for Swaps");return ue.api.post({path:"/v1/convert/build-transaction",headers:{"Content-Type":"application/json"},body:{amount:e,eip155:{slippage:ee.CONVERT_SLIPPAGE_TOLERANCE},projectId:P.state.projectId,from:t,to:r,userAddress:o,disableEstimate:n}})})},generateApproveCalldata(o){return u(this,arguments,function*({from:e,to:t,userAddress:r}){let{st:n,sv:s}=C.getSdkProperties();if(!(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId)))throw new Error("Network not supported for Swaps");return C.get({path:"/v1/convert/build-approve",headers:{"Content-Type":"application/json"},params:{userAddress:r,from:e,to:t,st:n,sv:s}})})},getBalance(e,t,r){return u(this,null,function*(){let{st:o,sv:n}=C.getSdkProperties();if(!(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId)))return Q.showError("Token Balance Unavailable"),{balances:[]};let c=`${t}:${e}`,a=w.getBalanceCacheForCaipAddress(c);if(a)return a;let p=yield C.get({path:`/v1/account/${e}/balance`,params:{currency:"usd",chainId:t,forceUpdate:r,st:o,sv:n}});return w.updateBalanceCache({caipAddress:c,balance:p,timestamp:Date.now()}),p})},lookupEnsName(e){return u(this,null,function*(){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?C.get({path:`/v1/profile/account/${e}`,params:{apiVersion:"2"}}):{addresses:{},attributes:[]}})},reverseLookupEnsName(t){return u(this,arguments,function*({address:e}){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?C.get({path:`/v1/profile/reverse/${e}`,params:{sender:D.state.address,apiVersion:"2"}}):[]})},getEnsNameSuggestions(e){return u(this,null,function*(){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?C.get({path:`/v1/profile/suggestions/${e}`,params:{zone:"reown.id"}}):{suggestions:[]}})},registerEnsName(n){return u(this,arguments,function*({coinType:e,address:t,message:r,signature:o}){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?ue.api.post({path:"/v1/profile/account",body:{coin_type:e,address:t,message:r,signature:o},headers:{"Content-Type":"application/json"}}):{success:!1}})},generateOnRampURL(s){return u(this,arguments,function*({destinationWallets:e,partnerUserId:t,defaultNetwork:r,purchaseAmount:o,paymentAmount:n}){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?(yield ue.api.post({path:"/v1/generators/onrampurl",params:{projectId:P.state.projectId},body:{destinationWallets:e,defaultNetwork:r,partnerUserId:t,defaultExperience:"buy",presetCryptoAmount:o,presetFiatAmount:n}})).url:""})},getOnrampOptions(){return u(this,null,function*(){if(!(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId)))return{paymentCurrencies:[],purchaseCurrencies:[]};try{return yield C.get({path:"/v1/onramp/options"})}catch{return Yr}})},getOnrampQuote(n){return u(this,arguments,function*({purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}){try{return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?yield ue.api.post({path:"/v1/onramp/quote",params:{projectId:P.state.projectId},body:{purchaseCurrency:e,paymentCurrency:t,amount:r,network:o}}):null}catch{return{coinbaseFee:{amount:r,currency:t.id},networkFee:{amount:r,currency:t.id},paymentSubtotal:{amount:r,currency:t.id},paymentTotal:{amount:r,currency:t.id},purchaseAmount:{amount:r,currency:t.id},quoteId:"mocked-quote-id"}}})},getSmartSessions(e){return u(this,null,function*(){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?C.get({path:`/v1/sessions/${e}`}):[]})},revokeSmartSession(e,t,r){return u(this,null,function*(){return(yield C.isNetworkSupported(l.state.activeCaipNetwork?.caipNetworkId))?ue.api.post({path:`/v1/sessions/${e}/revoke`,params:{projectId:P.state.projectId},body:{pci:t,signature:r}}):{success:!1}})},setClientId(e){ue.clientId=e,ue.api=new Se({baseUrl:gr,clientId:e})}};var me=y({currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[]}),D={state:me,replaceState(e){e&&Object.assign(me,Ce(e))},subscribe(e){return l.subscribeChainProp("accountState",t=>{if(t)return e(t)})},subscribeKey(e,t,r){let o;return l.subscribeChainProp("accountState",n=>{if(n){let s=n[e];o!==s&&(o=s,t(s))}},r)},setStatus(e,t){l.setAccountProp("status",e,t)},getCaipAddress(e){return l.getAccountProp("caipAddress",e)},setCaipAddress(e,t){let r=e?N.getPlainAddress(e):void 0;t===l.state.activeChain&&(l.state.activeCaipAddress=e),l.setAccountProp("caipAddress",e,t),l.setAccountProp("address",r,t)},setBalance(e,t,r){l.setAccountProp("balance",e,r),l.setAccountProp("balanceSymbol",t,r)},setProfileName(e,t){l.setAccountProp("profileName",e,t)},setProfileImage(e,t){l.setAccountProp("profileImage",e,t)},setUser(e,t){l.setAccountProp("user",e,t)},setAddressExplorerUrl(e,t){l.setAccountProp("addressExplorerUrl",e,t)},setSmartAccountDeployed(e,t){l.setAccountProp("smartAccountDeployed",e,t)},setCurrentTab(e){l.setAccountProp("currentTab",e,l.state.activeChain)},setTokenBalance(e,t){e&&l.setAccountProp("tokenBalance",e,t)},setShouldUpdateToAddress(e,t){l.setAccountProp("shouldUpdateToAddress",e,t)},setAllAccounts(e,t){l.setAccountProp("allAccounts",e,t)},addAddressLabel(e,t,r){let o=l.getAccountProp("addressLabels",r)||new Map;o.set(e,t),l.setAccountProp("addressLabels",o,r)},removeAddressLabel(e,t){let r=l.getAccountProp("addressLabels",t)||new Map;r.delete(e),l.setAccountProp("addressLabels",r,t)},setConnectedWalletInfo(e,t){l.setAccountProp("connectedWalletInfo",e,t,!1)},setPreferredAccountType(e,t){l.setAccountProp("preferredAccountTypes",A(d({},me.preferredAccountTypes),{[t]:e}),t)},setPreferredAccountTypes(e){me.preferredAccountTypes=e},setSocialProvider(e,t){e&&l.setAccountProp("socialProvider",e,t)},setSocialWindow(e,t){l.setAccountProp("socialWindow",e?Ce(e):void 0,t)},setFarcasterUrl(e,t){l.setAccountProp("farcasterUrl",e,t)},fetchTokenBalance(e){return u(this,null,function*(){me.balanceLoading=!0;let t=l.state.activeCaipNetwork?.caipNetworkId,r=l.state.activeCaipNetwork?.chainNamespace,o=l.state.activeCaipAddress,n=o?N.getPlainAddress(o):void 0;if(me.lastRetry&&!N.isAllowedRetry(me.lastRetry,30*ee.ONE_SEC_MS))return me.balanceLoading=!1,[];try{if(n&&t&&r){let c=(yield C.getBalance(n,t)).balances.filter(a=>a.quantity.decimals!=="0");return this.setTokenBalance(c,r),me.lastRetry=void 0,me.balanceLoading=!1,c}}catch(s){me.lastRetry=Date.now(),e?.(s),Q.showError("Token Balance Unavailable")}finally{me.balanceLoading=!1}return[]})},resetAccount(e){l.resetAccount(e)}};var Xr=Rr(kr());var Qr="wc",Zr="universal_provider",ms=`${Qr}@2:${Zr}:`,eo="https://rpc.walletconnect.org/v1/";var hs=`${eo}bundler`;var to="https://secure.walletconnect.org/sdk",ws=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_SDK_URL:void 0)||to,Cs=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_DEFAULT_LOG_LEVEL:void 0)||"error",Es=(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_SDK_VERSION:void 0)||"4";var he={SAFE_RPC_METHODS:["eth_accounts","eth_blockNumber","eth_call","eth_chainId","eth_estimateGas","eth_feeHistory","eth_gasPrice","eth_getAccount","eth_getBalance","eth_getBlockByHash","eth_getBlockByNumber","eth_getBlockReceipts","eth_getBlockTransactionCountByHash","eth_getBlockTransactionCountByNumber","eth_getCode","eth_getFilterChanges","eth_getFilterLogs","eth_getLogs","eth_getProof","eth_getStorageAt","eth_getTransactionByBlockHashAndIndex","eth_getTransactionByBlockNumberAndIndex","eth_getTransactionByHash","eth_getTransactionCount","eth_getTransactionReceipt","eth_getUncleCountByBlockHash","eth_getUncleCountByBlockNumber","eth_maxPriorityFeePerGas","eth_newBlockFilter","eth_newFilter","eth_newPendingTransactionFilter","eth_sendRawTransaction","eth_syncing","eth_uninstallFilter","wallet_getCapabilities","wallet_getCallsStatus","eth_getUserOperationReceipt","eth_estimateUserOperationGas","eth_getUserOperationByHash","eth_supportedEntryPoints","wallet_getAssets"],NOT_SAFE_RPC_METHODS:["personal_sign","eth_signTypedData_v4","eth_sendTransaction","solana_signMessage","solana_signTransaction","solana_signAllTransactions","solana_signAndSendTransaction","wallet_sendCalls","wallet_grantPermissions","wallet_revokePermissions","eth_sendUserOperation"],GET_CHAIN_ID:"eth_chainId",RPC_METHOD_NOT_ALLOWED_MESSAGE:"Requested RPC call is not allowed",RPC_METHOD_NOT_ALLOWED_UI_MESSAGE:"Action not allowed",ACCOUNT_TYPES:{EOA:"eoa",SMART_ACCOUNT:"smartAccount"}};var Pe=y({message:"",variant:"info",open:!1}),Yt={state:Pe,subscribeKey(e,t){return q(Pe,e,t)},open(e,t){let{debug:r}=P.state,{shortMessage:o,longMessage:n}=e;r&&(Pe.message=o,Pe.variant=t,Pe.open=!0),n&&console.error(typeof n=="function"?n():n)},close(){Pe.open=!1,Pe.message="",Pe.variant="info"}};var ro=N.getAnalyticsUrl(),oo=new Se({baseUrl:ro,clientId:null}),no=["MODAL_CREATED"],Ie=y({timestamp:Date.now(),reportedErrors:{},data:{type:"track",event:"MODAL_CREATED"}}),F={state:Ie,subscribe(e){return z(Ie,()=>e(Ie))},getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=P.state;return{projectId:e,st:t,sv:r||"html-wagmi-4.2.2"}},_sendAnalyticsEvent(e){return u(this,null,function*(){try{let t=D.state.address;if(no.includes(e.data.event)||typeof window>"u")return;yield oo.post({path:"/e",params:F.getSdkProperties(),body:{eventId:N.getUUID(),url:window.location.href,domain:window.location.hostname,timestamp:e.timestamp,props:A(d({},e.data),{address:t})}}),Ie.reportedErrors.FORBIDDEN=!1}catch(t){t instanceof Error&&t.cause instanceof Response&&t.cause.status===K.HTTP_STATUS_CODES.FORBIDDEN&&!Ie.reportedErrors.FORBIDDEN&&(Yt.open({shortMessage:"Invalid App Configuration",longMessage:`Origin ${We()?window.origin:"uknown"} not found on Allowlist - update configuration on cloud.reown.com`},"error"),Ie.reportedErrors.FORBIDDEN=!0)}})},sendEvent(e){Ie.timestamp=Date.now(),Ie.data=e,P.state.features?.analytics&&F._sendAnalyticsEvent(Ie)}};var ze={getSIWX(){return P.state.siwx},initializeIfEnabled(){return u(this,null,function*(){let e=P.state.siwx,t=l.getActiveCaipAddress();if(!(e&&t))return;let[r,o,n]=t.split(":");if(l.checkIfSupportedNetwork(r))try{if((yield e.getSessions(`${r}:${o}`,n)).length)return;yield te.open({view:"SIWXSignMessage"})}catch(s){console.error("SIWXUtil:initializeIfEnabled",s),F.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:this.getSIWXEventProperties()}),yield X._getClient()?.disconnect().catch(console.error),B.reset("Connect"),Q.showError("A problem occurred while trying initialize authentication")}})},requestSignMessage(){return u(this,null,function*(){let e=P.state.siwx,t=N.getPlainAddress(l.getActiveCaipAddress()),r=l.getActiveCaipNetwork(),o=X._getClient();if(!e)throw new Error("SIWX is not enabled");if(!t)throw new Error("No ActiveCaipAddress found");if(!r)throw new Error("No ActiveCaipNetwork or client found");if(!o)throw new Error("No ConnectionController client found");try{let n=yield e.createMessage({chainId:r.caipNetworkId,accountAddress:t}),s=n.toString();V.getConnectorId(r.chainNamespace)===K.CONNECTOR_ID.AUTH&&B.pushTransactionStack({view:null,goBack:!1,replace:!0});let a=yield o.signMessage(s);yield e.addSession({data:n,message:s,signature:a}),te.close(),F.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:this.getSIWXEventProperties()})}catch(n){let s=this.getSIWXEventProperties();(!te.state.open||B.state.view==="ApproveTransaction")&&(yield te.open({view:"SIWXSignMessage"})),s.isSmartAccount?Q.showError("This application might not support Smart Accounts"):Q.showError("Signature declined"),F.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:s}),console.error("SWIXUtil:requestSignMessage",n)}})},cancelSignMessage(){return u(this,null,function*(){try{this.getSIWX()?.getRequired?.()?yield X.disconnect():te.close(),B.reset("Connect"),F.sendEvent({event:"CLICK_CANCEL_SIWX",type:"track",properties:this.getSIWXEventProperties()})}catch(e){console.error("SIWXUtil:cancelSignMessage",e)}})},getSessions(){return u(this,null,function*(){let e=P.state.siwx,t=N.getPlainAddress(l.getActiveCaipAddress()),r=l.getActiveCaipNetwork();return e&&t&&r?e.getSessions(r.caipNetworkId,t):[]})},isSIWXCloseDisabled(){return u(this,null,function*(){let e=this.getSIWX();if(e){let t=B.state.view==="ApproveTransaction",r=B.state.view==="SIWXSignMessage";if(t||r)return e.getRequired?.()&&(yield this.getSessions()).length===0}return!1})},universalProviderAuthenticate(o){return u(this,arguments,function*({universalProvider:e,chains:t,methods:r}){let n=ze.getSIWX(),s=new Set(t.map(p=>p.split(":")[0]));if(!n||s.size!==1||!s.has("eip155"))return!1;let c=yield n.createMessage({chainId:l.getActiveCaipNetwork()?.caipNetworkId||"",accountAddress:""}),a=yield e.authenticate({nonce:c.nonce,domain:c.domain,uri:c.uri,exp:c.expirationTime,iat:c.issuedAt,nbf:c.notBefore,requestId:c.requestId,version:c.version,resources:c.resources,statement:c.statement,chainId:c.chainId,methods:r,chains:[c.chainId,...t.filter(p=>p!==c.chainId)]});if(Q.showLoading("Authenticating...",{autoClose:!1}),D.setConnectedWalletInfo(A(d({},a.session.peer.metadata),{name:a.session.peer.metadata.name,icon:a.session.peer.metadata.icons?.[0],type:"WALLET_CONNECT"}),Array.from(s)[0]),a?.auths?.length){let p=a.auths.map(i=>{let f=e.client.formatAuthMessage({request:i.p,iss:i.p.iss});return{data:A(d({},i.p),{accountAddress:i.p.iss.split(":").slice(-1).join(""),chainId:i.p.iss.split(":").slice(2,4).join(":"),uri:i.p.aud,version:i.p.version||c.version,expirationTime:i.p.exp,issuedAt:i.p.iat,notBefore:i.p.nbf}),message:f,signature:i.s.s,cacao:i}});try{yield n.setSessions(p),F.sendEvent({type:"track",event:"SIWX_AUTH_SUCCESS",properties:ze.getSIWXEventProperties()})}catch(i){throw console.error("SIWX:universalProviderAuth - failed to set sessions",i),F.sendEvent({type:"track",event:"SIWX_AUTH_ERROR",properties:ze.getSIWXEventProperties()}),yield e.disconnect().catch(console.error),i}finally{Q.hide()}}return!0})},getSIWXEventProperties(){let e=l.state.activeChain;return{network:l.state.activeCaipNetwork?.caipNetworkId||"",isSmartAccount:D.state.preferredAccountTypes?.[e]===he.ACCOUNT_TYPES.SMART_ACCOUNT}},clearSessions(){return u(this,null,function*(){let e=this.getSIWX();e&&(yield e.setSessions([]))})}};var G=y({transactions:[],coinbaseTransactions:{},transactionsByYear:{},lastNetworkInView:void 0,loading:!1,empty:!1,next:void 0}),wr={state:G,subscribe(e){return z(G,()=>e(G))},setLastNetworkInView(e){G.lastNetworkInView=e},fetchTransactions(e,t){return u(this,null,function*(){if(!e)throw new Error("Transactions can't be fetched without an accountAddress");G.loading=!0;try{let r=yield C.fetchTransactions({account:e,cursor:G.next,onramp:t,cache:t==="coinbase"?"no-cache":void 0,chainId:l.state.activeCaipNetwork?.caipNetworkId}),o=this.filterSpamTransactions(r.data),n=this.filterByConnectedChain(o),s=[...G.transactions,...n];G.loading=!1,t==="coinbase"?G.coinbaseTransactions=this.groupTransactionsByYearAndMonth(G.coinbaseTransactions,r.data):(G.transactions=s,G.transactionsByYear=this.groupTransactionsByYearAndMonth(G.transactionsByYear,n)),G.empty=s.length===0,G.next=r.next?r.next:void 0}catch{let o=l.state.activeChain;F.sendEvent({type:"track",event:"ERROR_FETCH_TRANSACTIONS",properties:{address:e,projectId:P.state.projectId,cursor:G.next,isSmartAccount:D.state.preferredAccountTypes?.[o]===he.ACCOUNT_TYPES.SMART_ACCOUNT}}),Q.showError("Failed to fetch transactions"),G.loading=!1,G.empty=!0,G.next=void 0}})},groupTransactionsByYearAndMonth(e={},t=[]){let r=e;return t.forEach(o=>{let n=new Date(o.metadata.minedAt).getFullYear(),s=new Date(o.metadata.minedAt).getMonth(),c=r[n]??{},p=(c[s]??[]).filter(i=>i.id!==o.id);r[n]=A(d({},c),{[s]:[...p,o].sort((i,f)=>new Date(f.metadata.minedAt).getTime()-new Date(i.metadata.minedAt).getTime())})}),r},filterSpamTransactions(e){return e.filter(t=>!t.transfers.every(o=>o.nft_info?.flags.is_spam===!0))},filterByConnectedChain(e){let t=l.state.activeCaipNetwork?.caipNetworkId;return e.filter(o=>o.metadata.chain===t)},clearCursor(){G.next=void 0},resetTransactions(){G.transactions=[],G.transactionsByYear={},G.lastNetworkInView=void 0,G.loading=!1,G.empty=!1,G.next=void 0}};var J=y({wcError:!1,buffering:!1,status:"disconnected"}),Ge,X={state:J,subscribeKey(e,t){return q(J,e,t)},_getClient(){return J._client},setClient(e){J._client=Ce(e)},connectWalletConnect(){return u(this,null,function*(){if(N.isTelegram()||N.isSafari()&&N.isIos()){if(Ge){yield Ge,Ge=void 0;return}if(!N.isPairingExpired(J?.wcPairingExpiry)){let e=J.wcUri;J.wcUri=e;return}Ge=this._getClient()?.connectWalletConnect?.().catch(()=>{}),this.state.status="connecting",yield Ge,Ge=void 0,J.wcPairingExpiry=void 0,this.state.status="connected"}else yield this._getClient()?.connectWalletConnect?.()})},connectExternal(e,t,r=!0){return u(this,null,function*(){yield this._getClient()?.connectExternal?.(e),r&&l.setActiveNamespace(t)})},reconnectExternal(e){return u(this,null,function*(){yield this._getClient()?.reconnectExternal?.(e);let t=e.chain||l.state.activeChain;t&&V.setConnectorId(e.id,t)})},setPreferredAccountType(e,t){return u(this,null,function*(){te.setLoading(!0,l.state.activeChain);let r=V.getAuthConnector();r&&(D.setPreferredAccountType(e,t),yield r.provider.setPreferredAccount(e),w.setPreferredAccountTypes(D.state.preferredAccountTypes??{[t]:e}),yield this.reconnectExternal(r),te.setLoading(!1,l.state.activeChain),F.sendEvent({type:"track",event:"SET_PREFERRED_ACCOUNT_TYPE",properties:{accountType:e,network:l.state.activeCaipNetwork?.caipNetworkId||""}}))})},signMessage(e){return u(this,null,function*(){return this._getClient()?.signMessage(e)})},parseUnits(e,t){return this._getClient()?.parseUnits(e,t)},formatUnits(e,t){return this._getClient()?.formatUnits(e,t)},sendTransaction(e){return u(this,null,function*(){return this._getClient()?.sendTransaction(e)})},getCapabilities(e){return u(this,null,function*(){return this._getClient()?.getCapabilities(e)})},grantPermissions(e){return u(this,null,function*(){return this._getClient()?.grantPermissions(e)})},walletGetAssets(e){return u(this,null,function*(){return this._getClient()?.walletGetAssets(e)??{}})},estimateGas(e){return u(this,null,function*(){return this._getClient()?.estimateGas(e)})},writeContract(e){return u(this,null,function*(){return this._getClient()?.writeContract(e)})},getEnsAddress(e){return u(this,null,function*(){return this._getClient()?.getEnsAddress(e)})},getEnsAvatar(e){return u(this,null,function*(){return this._getClient()?.getEnsAvatar(e)})},checkInstalled(e){return this._getClient()?.checkInstalled?.(e)||!1},resetWcConnection(){J.wcUri=void 0,J.wcPairingExpiry=void 0,J.wcLinking=void 0,J.recentWallet=void 0,J.status="disconnected",wr.resetTransactions(),w.deleteWalletConnectDeepLink()},resetUri(){J.wcUri=void 0,J.wcPairingExpiry=void 0},finalizeWcConnection(){let{wcLinking:e,recentWallet:t}=X.state;e&&w.setWalletConnectDeepLink(e),t&&w.setAppKitRecent(t),F.sendEvent({type:"track",event:"CONNECT_SUCCESS",properties:{method:e?"mobile":"qrcode",name:B.state.data?.wallet?.name||"Unknown"}})},setWcBasic(e){J.wcBasic=e},setUri(e){J.wcUri=e,J.wcPairingExpiry=N.getPairingExpiry()},setWcLinking(e){J.wcLinking=e},setWcError(e){J.wcError=e,J.buffering=!1},setRecentWallet(e){J.recentWallet=e},setBuffering(e){J.buffering=e},setStatus(e){J.status=e},disconnect(e){return u(this,null,function*(){try{te.setLoading(!0,e),yield ze.clearSessions(),yield l.disconnect(e),te.setLoading(!1,e),V.setFilterByNamespace(void 0)}catch{throw new Error("Failed to disconnect")}})}};var Ye=y({loading:!1,open:!1,selectedNetworkId:void 0,activeChain:void 0,initialized:!1}),ye={state:Ye,subscribe(e){return z(Ye,()=>e(Ye))},subscribeOpen(e){return q(Ye,"open",e)},set(e){Object.assign(Ye,d(d({},Ye),e))}};var ie=y({loading:!1,loadingNamespaceMap:new Map,open:!1,shake:!1,namespace:void 0}),te={state:ie,subscribe(e){return z(ie,()=>e(ie))},subscribeKey(e,t){return q(ie,e,t)},open(e){return u(this,null,function*(){let t=D.state.status==="connected";X.state.wcBasic?T.prefetch({fetchNetworkImages:!1,fetchConnectorImages:!1}):yield T.prefetch({fetchConnectorImages:!t,fetchFeaturedWallets:!t,fetchRecommendedWallets:!t}),e?.namespace?(yield l.switchActiveNamespace(e.namespace),te.setLoading(!0,e.namespace)):te.setLoading(!0),V.setFilterByNamespace(e?.namespace);let r=l.getAccountData(e?.namespace)?.caipAddress;l.state.noAdapters&&!r?N.isMobile()?B.reset("AllWallets"):B.reset("ConnectingWalletConnectBasic"):e?.view?B.reset(e.view,e.data):r?B.reset("Account"):B.reset("Connect"),ie.open=!0,ye.set({open:!0}),F.sendEvent({type:"track",event:"MODAL_OPEN",properties:{connected:!!r}})})},close(){let e=P.state.enableEmbedded,t=!!l.state.activeCaipAddress;ie.open&&F.sendEvent({type:"track",event:"MODAL_CLOSE",properties:{connected:t}}),ie.open=!1,te.clearLoading(),e?t?B.replace("Account"):B.push("Connect"):ye.set({open:!1}),X.resetUri()},setLoading(e,t){t&&ie.loadingNamespaceMap.set(t,e),ie.loading=e,ye.set({loading:e})},clearLoading(){ie.loadingNamespaceMap.clear(),ie.loading=!1},shake(){ie.shake||(ie.shake=!0,setTimeout(()=>{ie.shake=!1},500))}};var H=y({view:"Connect",history:["Connect"],transactionStack:[]}),B={state:H,subscribeKey(e,t){return q(H,e,t)},pushTransactionStack(e){H.transactionStack.push(e)},popTransactionStack(e){let t=H.transactionStack.pop();if(t)if(e)this.goBack(),t?.onCancel?.();else{if(t.goBack)this.goBack();else if(t.replace){let o=H.history.indexOf("ConnectingSiwe");o>0?this.goBackToIndex(o-1):(te.close(),H.history=[])}else t.view&&this.reset(t.view);t?.onSuccess?.()}},push(e,t){e!==H.view&&(H.view=e,H.history.push(e),H.data=t)},reset(e,t){H.view=e,H.history=[e],H.data=t},replace(e,t){H.history.at(-1)===e||(H.view=e,H.history[H.history.length-1]=e,H.data=t)},goBack(){let e=!l.state.activeCaipAddress&&this.state.view==="ConnectingFarcaster";if(H.history.length>1&&!H.history.includes("UnsupportedChain")){H.history.pop();let[t]=H.history.slice(-1);t&&(H.view=t)}else te.close();H.data?.wallet&&(H.data.wallet=void 0),setTimeout(()=>{if(e){D.setFarcasterUrl(void 0,l.state.activeChain);let t=V.getAuthConnector();t?.provider?.reload();let r=ve(P.state);t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType})}},100)},goBackToIndex(e){if(H.history.length>1){H.history=H.history.slice(0,e+1);let[t]=H.history.slice(-1);t&&(H.view=t)}}};var Ne=y({themeMode:"dark",themeVariables:{},w3mThemeVariables:void 0}),Re={state:Ne,subscribe(e){return z(Ne,()=>e(Ne))},setThemeMode(e){Ne.themeMode=e;try{let t=V.getAuthConnector();if(t){let r=Re.getSnapshot().themeVariables;t.provider.syncTheme({themeMode:e,themeVariables:r,w3mThemeVariables:de(r,e)})}}catch{console.info("Unable to sync theme to auth connector")}},setThemeVariables(e){Ne.themeVariables=d(d({},Ne.themeVariables),e);try{let t=V.getAuthConnector();if(t){let r=Re.getSnapshot().themeVariables;t.provider.syncTheme({themeVariables:r,w3mThemeVariables:de(Ne.themeVariables,Ne.themeMode)})}}catch{console.info("Unable to sync theme to auth connector")}},getSnapshot(){return ve(Ne)}};var Cr={eip155:void 0,solana:void 0,polkadot:void 0,bip122:void 0},j=y({allConnectors:[],connectors:[],activeConnector:void 0,filterByNamespace:void 0,activeConnectorIds:d({},Cr)}),V={state:j,subscribe(e){return z(j,()=>{e(j)})},subscribeKey(e,t){return q(j,e,t)},initialize(e){e.forEach(t=>{let r=w.getConnectedConnectorId(t);r&&this.setConnectorId(r,t)})},setActiveConnector(e){e&&(j.activeConnector=Ce(e))},setConnectors(e){e.filter(r=>!j.allConnectors.some(o=>o.id===r.id&&this.getConnectorName(o.name)===this.getConnectorName(r.name)&&o.chain===r.chain)).forEach(r=>{r.type!=="MULTI_CHAIN"&&j.allConnectors.push(Ce(r))}),j.connectors=this.mergeMultiChainConnectors(j.allConnectors)},removeAdapter(e){j.allConnectors=j.allConnectors.filter(t=>t.chain!==e),j.connectors=this.mergeMultiChainConnectors(j.allConnectors)},mergeMultiChainConnectors(e){let t=this.generateConnectorMapByName(e),r=[];return t.forEach(o=>{let n=o[0],s=n?.id===K.CONNECTOR_ID.AUTH;o.length>1&&n?r.push({name:n.name,imageUrl:n.imageUrl,imageId:n.imageId,connectors:[...o],type:s?"AUTH":"MULTI_CHAIN",chain:"eip155",id:n?.id||""}):n&&r.push(n)}),r},generateConnectorMapByName(e){let t=new Map;return e.forEach(r=>{let{name:o}=r,n=this.getConnectorName(o);if(!n)return;let s=t.get(n)||[];s.find(a=>a.chain===r.chain)||s.push(r),t.set(n,s)}),t},getConnectorName(e){return e&&({"Trust Wallet":"Trust"}[e]||e)},getUniqueConnectorsByName(e){let t=[];return e.forEach(r=>{t.find(o=>o.chain===r.chain)||t.push(r)}),t},addConnector(e){if(e.id===K.CONNECTOR_ID.AUTH){let t=e,r=ve(P.state),o=Re.getSnapshot().themeMode,n=Re.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,projectId:r.projectId,sdkType:r.sdkType}),t?.provider?.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:de(n,o)}),this.setConnectors([e])}else this.setConnectors([e])},getAuthConnector(e){let t=e||l.state.activeChain,r=j.connectors.find(o=>o.id===K.CONNECTOR_ID.AUTH);if(r)return r?.connectors?.length?r.connectors.find(n=>n.chain===t):r},getAnnouncedConnectorRdns(){return j.connectors.filter(e=>e.type==="ANNOUNCED").map(e=>e.info?.rdns)},getConnectorById(e){return j.allConnectors.find(t=>t.id===e)},getConnector(e,t){return j.allConnectors.filter(o=>o.chain===l.state.activeChain).find(o=>o.explorerId===e||o.info?.rdns===t)},syncIfAuthConnector(e){if(e.id!=="ID_AUTH")return;let t=e,r=ve(P.state),o=Re.getSnapshot().themeMode,n=Re.getSnapshot().themeVariables;t?.provider?.syncDappData?.({metadata:r.metadata,sdkVersion:r.sdkVersion,sdkType:r.sdkType,projectId:r.projectId}),t.provider.syncTheme({themeMode:o,themeVariables:n,w3mThemeVariables:de(n,o)})},getConnectorsByNamespace(e){let t=j.allConnectors.filter(r=>r.chain===e);return this.mergeMultiChainConnectors(t)},selectWalletConnector(e){let t=V.getConnector(e.id,e.rdns);l.state.activeChain===K.CHAIN.SOLANA&&fr.handleSolanaDeeplinkRedirect(t?.name||e.name||""),t?B.push("ConnectingExternal",{connector:t}):B.push("ConnectingWalletConnect",{wallet:e})},getConnectors(e){return e?this.getConnectorsByNamespace(e):this.mergeMultiChainConnectors(j.allConnectors)},setFilterByNamespace(e){j.filterByNamespace=e,j.connectors=this.getConnectors(e),T.setFilterByNamespace(e)},setConnectorId(e,t){e&&(j.activeConnectorIds=A(d({},j.activeConnectorIds),{[t]:e}),w.setConnectedConnectorId(t,e))},removeConnectorId(e){j.activeConnectorIds=A(d({},j.activeConnectorIds),{[e]:void 0}),w.deleteConnectedConnectorId(e)},getConnectorId(e){if(e)return j.activeConnectorIds[e]},isConnected(e){return e?!!j.activeConnectorIds[e]:Object.values(j.activeConnectorIds).some(t=>!!t)},resetConnectorIds(){j.activeConnectorIds=d({},Cr)}};function ot(e,t){return V.getConnectorId(e)===t}function Er(e){let t=Array.from(l.state.chains.keys()),r=[];return e?(r.push([e,l.state.chains.get(e)]),ot(e,K.CONNECTOR_ID.WALLET_CONNECT)?t.forEach(o=>{o!==e&&ot(o,K.CONNECTOR_ID.WALLET_CONNECT)&&r.push([o,l.state.chains.get(o)])}):ot(e,K.CONNECTOR_ID.AUTH)&&t.forEach(o=>{o!==e&&ot(o,K.CONNECTOR_ID.AUTH)&&r.push([o,l.state.chains.get(o)])})):r=Array.from(l.state.chains.entries()),r}function ut(e){return u(this,null,function*(){return new Promise(t=>setTimeout(t,e))})}var pt=256,dt;function br(e=11){if(!dt||pt+e>256*2){dt="",pt=0;for(let t=0;t<256;t++)dt+=(256+Math.random()*256|0).toString(16).substring(1)}return dt.substring(pt,pt+++e)}var mt=new er(8192);function vr(e,{enabled:t=!0,id:r}){if(!t||!r)return e();if(mt.get(r))return mt.get(r);let o=e().finally(()=>mt.delete(r));return mt.set(r,o),o}function Ar(e,{delay:t=100,retryCount:r=2,shouldRetry:o=()=>!0}={}){return new Promise((n,s)=>{let c=(...p)=>u(this,[...p],function*({count:a=0}={}){let i=h=>u(this,[h],function*({error:f}){let b=typeof t=="function"?t({count:a,error:f}):t;b&&(yield ut(b)),c({count:a+1})});try{let f=yield e();n(f)}catch(f){if(a<r&&(yield o({count:a,error:f})))return i({error:f});s(f)}});c()})}function Sr(e,t={}){return(n,...s)=>u(this,[n,...s],function*(r,o={}){let{dedupe:c=!1,methods:a,retryDelay:p=150,retryCount:i=3,uid:f}=d(d({},t),o),{method:h}=r;if(a?.exclude?.includes(h))throw new Qe(new Error("method not supported"),{method:h});if(a?.include&&!a.include.includes(h))throw new Qe(new Error("method not supported"),{method:h});let b=c?Ct(`${f}.${$e(r)}`):void 0;return vr(()=>Ar(()=>u(this,null,function*(){try{return yield e(r)}catch(R){let g=R;switch(g.code){case vt.code:throw new vt(g);case At.code:throw new At(g);case St.code:throw new St(g,{method:r.method});case It.code:throw new It(g);case at.code:throw new at(g);case yt.code:throw new yt(g);case Nt.code:throw new Nt(g);case _t.code:throw new _t(g);case Xe.code:throw new Xe(g);case Qe.code:throw new Qe(g,{method:r.method});case ct.code:throw new ct(g);case Tt.code:throw new Tt(g);case qe.code:throw new qe(g);case xt.code:throw new xt(g);case Pt.code:throw new Pt(g);case Rt.code:throw new Rt(g);case kt.code:throw new kt(g);case Ot.code:throw new Ot(g);case Ut.code:throw new Ut(g);case Dt.code:throw new Dt(g);case Mt.code:throw new Mt(g);case Lt.code:throw new Lt(g);case Bt.code:throw new Bt(g);case Ft.code:throw new Ft(g);case Ht.code:throw new Ht(g);case 5e3:throw new qe(g);default:throw R instanceof it?R:new rr(g)}}}),{delay:({count:R,error:g})=>{if(g&&g instanceof De){let v=g?.headers?.get("Retry-After");if(v?.match(/\d/))return Number.parseInt(v)*1e3}return~~(1<<R)*p},retryCount:i,shouldRetry:({error:R})=>so(R)}),{enabled:c,id:b})})}function so(e){return"code"in e&&typeof e.code=="number"?e.code===-1||e.code===ct.code||e.code===at.code:e instanceof De&&e.status?e.status===403||e.status===408||e.status===413||e.status===429||e.status===500||e.status===502||e.status===503||e.status===504:!0}function ht({key:e,methods:t,name:r,request:o,retryCount:n=3,retryDelay:s=150,timeout:c,type:a},p){let i=br();return{config:{key:e,methods:t,name:r,request:o,retryCount:n,retryDelay:s,timeout:c,type:a},request:Sr(o,{methods:t,retryCount:n,retryDelay:s,uid:i}),value:p}}function io(e,t={}){let{key:r="fallback",name:o="Fallback",rank:n=!1,shouldThrow:s=Ir,retryCount:c,retryDelay:a}=t;return b=>{var R=b,{chain:p,pollingInterval:i=4e3,timeout:f}=R,h=Ae(R,["chain","pollingInterval","timeout"]);let g=e,v=()=>{},O=ht({key:r,name:o,request(ne){return u(this,arguments,function*({method:U,params:Y}){let we,ae=(ce=0)=>u(this,null,function*(){let _e=g[ce](A(d({},h),{chain:p,retryCount:0,timeout:f}));try{let x=yield _e.request({method:U,params:Y});return v({method:U,params:Y,response:x,transport:_e,status:"success"}),x}catch(x){if(v({error:x,method:U,params:Y,transport:_e,status:"error"}),s(x)||ce===g.length-1||(we??=g.slice(ce+1).some(k=>{let{include:S,exclude:Z}=k({chain:p}).config.methods||{};return S?S.includes(U):Z?!Z.includes(U):!0}),!we))throw x;return ae(ce+1)}});return ae()})},retryCount:c,retryDelay:a,type:"fallback"},{onResponse:U=>v=U,transports:g.map(U=>U({chain:p,retryCount:0}))});if(n){let U=typeof n=="object"?n:{};ao({chain:p,interval:U.interval??i,onTransports:Y=>g=Y,ping:U.ping,sampleCount:U.sampleCount,timeout:U.timeout,transports:g,weights:U.weights})}return O}}function Ir(e){return!!("code"in e&&typeof e.code=="number"&&(e.code===Xe.code||e.code===qe.code||or.nodeMessage.test(e.message)||e.code===5e3))}function ao({chain:e,interval:t=4e3,onTransports:r,ping:o,sampleCount:n=10,timeout:s=1e3,transports:c,weights:a={}}){let{stability:p=.7,latency:i=.3}=a,f=[],h=()=>u(this,null,function*(){let b=yield Promise.all(c.map(v=>u(this,null,function*(){let O=v({chain:e,retryCount:0,timeout:s}),L=Date.now(),U,Y;try{yield o?o({transport:O}):O.request({method:"net_listening"}),Y=1}catch{Y=0}finally{U=Date.now()}return{latency:U-L,success:Y}})));f.push(b),f.length>n&&f.shift();let R=Math.max(...f.map(v=>Math.max(...v.map(({latency:O})=>O)))),g=c.map((v,O)=>{let L=f.map(ae=>ae[O].latency),Y=1-L.reduce((ae,ce)=>ae+ce,0)/L.length/R,ne=f.map(ae=>ae[O].success),we=ne.reduce((ae,ce)=>ae+ce,0)/ne.length;return we===0?[0,O]:[i*Y+p*we,O]}).sort((v,O)=>O[0]-v[0]);r(g.map(([,v])=>c[v])),yield ut(t),h()});h()}var ft=class extends it{constructor(){super("No URL was provided to the Transport. Please provide a valid RPC URL to the Transport.",{docsPath:"/docs/clients/intro",name:"UrlRequiredError"})}};function yr(e,{errorInstance:t=new Error("timed out"),timeout:r,signal:o}){return new Promise((n,s)=>{u(this,null,function*(){let c;try{let a=new AbortController;r>0&&(c=setTimeout(()=>{o?a.abort():s(t)},r)),n(yield e({signal:a?.signal||null}))}catch(a){a?.name==="AbortError"&&s(t),s(a)}finally{clearTimeout(c)}})})}function co(){return{current:0,take(){return this.current++},reset(){this.current=0}}}var Jt=co();function Nr(e,t={}){return{request(o){return u(this,null,function*(){let{body:n,onRequest:s=t.onRequest,onResponse:c=t.onResponse,timeout:a=t.timeout??1e4}=o,p=d(d({},t.fetchOptions??{}),o.fetchOptions??{}),{headers:i,method:f,signal:h}=p;try{let b=yield yr(v=>u(this,[v],function*({signal:g}){let O=A(d({},p),{body:Array.isArray(n)?$e(n.map(ne=>d({jsonrpc:"2.0",id:ne.id??Jt.take()},ne))):$e(d({jsonrpc:"2.0",id:n.id??Jt.take()},n)),headers:d({"Content-Type":"application/json"},i),method:f||"POST",signal:h||(a>0?g:null)}),L=new Request(e,O),U=(yield s?.(L,O))??A(d({},O),{url:e});return yield fetch(U.url??e,U)}),{errorInstance:new bt({body:n,url:e}),timeout:a,signal:!0});c&&(yield c(b));let R;if(b.headers.get("Content-Type")?.startsWith("application/json"))R=yield b.json();else{R=yield b.text();try{R=JSON.parse(R||"{}")}catch(g){if(b.ok)throw g;R={error:R}}}if(!b.ok)throw new De({body:n,details:$e(R.error)||b.statusText,headers:b.headers,status:b.status,url:e});return R}catch(b){throw b instanceof De||b instanceof bt?b:new De({body:n,cause:b,url:e})}})}}}function lo(e,t={}){let{batch:r,fetchOptions:o,key:n="http",methods:s,name:c="HTTP JSON-RPC",onFetchRequest:a,onFetchResponse:p,retryDelay:i,raw:f}=t;return({chain:h,retryCount:b,timeout:R})=>{let{batchSize:g=1e3,wait:v=0}=typeof r=="object"?r:{},O=t.retryCount??b,L=R??t.timeout??1e4,U=e||h?.rpcUrls.default.http[0];if(!U)throw new ft;let Y=Nr(U,{fetchOptions:o,onRequest:a,onResponse:p,timeout:L});return ht({key:n,methods:s,name:c,request(ce){return u(this,arguments,function*({method:we,params:ae}){let _e={method:we,params:ae},{schedule:x}=nr({id:U,wait:v,shouldSplitBatch(oe){return oe.length>g},fn:oe=>Y.request({body:oe}),sort:(oe,Ue)=>oe.id-Ue.id}),k=oe=>u(this,null,function*(){return r?x(oe):[yield Y.request({body:oe})]}),[{error:S,result:Z}]=yield k(_e);if(f)return{error:S,result:Z};if(S)throw new tr({body:_e,error:S,url:U});return Z})},retryCount:O,retryDelay:i,timeout:L,type:"http"},{fetchOptions:o,url:U})}}var gt={createBalance(e,t){let r={name:e.metadata.name||"",symbol:e.metadata.symbol||"",decimals:e.metadata.decimals||0,value:e.metadata.value||0,price:e.metadata.price||0,iconUrl:e.metadata.iconUrl||""};return{name:r.name,symbol:r.symbol,chainId:t,address:e.address==="native"?void 0:this.convertAddressToCAIP10Address(e.address,t),value:r.value,price:r.price,quantity:{decimals:r.decimals.toString(),numeric:this.convertHexToBalance({hex:e.balance,decimals:r.decimals})},iconUrl:r.iconUrl}},convertHexToBalance({hex:e,decimals:t}){return Et(BigInt(e),t)},convertAddressToCAIP10Address(e,t){return`${t}:${e}`},createCAIP2ChainId(e,t){return`${t}:${parseInt(e,16)}`},getChainIdHexFromCAIP2ChainId(e){let t=e.split(":");if(t.length<2||!t[1])return"0x0";let r=t[1],o=parseInt(r,10);return isNaN(o)?"0x0":`0x${o.toString(16)}`},isWalletGetAssetsResponse(e){return typeof e!="object"||e===null?!1:Object.values(e).every(t=>Array.isArray(t)&&t.every(r=>this.isValidAsset(r)))},isValidAsset(e){return typeof e=="object"&&e!==null&&typeof e.address=="string"&&typeof e.balance=="string"&&(e.type==="ERC20"||e.type==="NATIVE")&&typeof e.metadata=="object"&&e.metadata!==null&&typeof e.metadata.name=="string"&&typeof e.metadata.symbol=="string"&&typeof e.metadata.decimals=="number"&&typeof e.metadata.price=="number"&&typeof e.metadata.iconUrl=="string"}};var Xt={getMyTokensWithBalance(e){return u(this,null,function*(){let t=D.state.address,r=l.state.activeCaipNetwork;if(!t||!r)return[];if(r.chainNamespace==="eip155"){let n=yield this.getEIP155Balances(t,r);if(n)return this.filterLowQualityTokens(n)}let o=yield C.getBalance(t,r.caipNetworkId,e);return this.filterLowQualityTokens(o.balances)})},getEIP155Balances(e,t){return u(this,null,function*(){try{let r=gt.getChainIdHexFromCAIP2ChainId(t.caipNetworkId);if(!(yield X.getCapabilities(e))?.[r]?.assetDiscovery?.supported)return null;let n=yield X.walletGetAssets({account:e,chainFilter:[r]});return gt.isWalletGetAssetsResponse(n)?(n[r]||[]).map(c=>gt.createBalance(c,t.caipNetworkId)):null}catch{return null}})},filterLowQualityTokens(e){return e.filter(t=>t.quantity.decimals!=="0")},mapBalancesToSwapTokens(e){return e?.map(t=>A(d({},t),{address:t?.address?t.address:l.getActiveNetworkTokenAddress(),decimals:parseInt(t.quantity.decimals,10),logoUri:t.iconUrl,eip2612:!1}))||[]}};var M=y({tokenBalances:[],loading:!1}),Qt={state:M,subscribe(e){return z(M,()=>e(M))},subscribeKey(e,t){return q(M,e,t)},setToken(e){e&&(M.token=Ce(e))},setTokenAmount(e){M.sendTokenAmount=e},setReceiverAddress(e){M.receiverAddress=e},setReceiverProfileImageUrl(e){M.receiverProfileImageUrl=e},setReceiverProfileName(e){M.receiverProfileName=e},setGasPrice(e){M.gasPrice=e},setGasPriceInUsd(e){M.gasPriceInUSD=e},setNetworkBalanceInUsd(e){M.networkBalanceInUSD=e},setLoading(e){M.loading=e},sendToken(){switch(l.state.activeCaipNetwork?.chainNamespace){case"eip155":this.sendEvmToken();return;case"solana":this.sendSolanaToken();return;default:throw new Error("Unsupported chain")}},sendEvmToken(){let e=l.state.activeChain,t=D.state.preferredAccountTypes?.[e];this.state.token?.address&&this.state.sendTokenAmount&&this.state.receiverAddress?(F.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===he.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token.address,amount:this.state.sendTokenAmount,network:l.state.activeCaipNetwork?.caipNetworkId||""}}),this.sendERC20Token({receiverAddress:this.state.receiverAddress,tokenAddress:this.state.token.address,sendTokenAmount:this.state.sendTokenAmount,decimals:this.state.token.quantity.decimals})):this.state.receiverAddress&&this.state.sendTokenAmount&&this.state.gasPrice&&this.state.token?.quantity.decimals&&(F.sendEvent({type:"track",event:"SEND_INITIATED",properties:{isSmartAccount:t===he.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token?.symbol,amount:this.state.sendTokenAmount,network:l.state.activeCaipNetwork?.caipNetworkId||""}}),this.sendNativeToken({receiverAddress:this.state.receiverAddress,sendTokenAmount:this.state.sendTokenAmount,gasPrice:this.state.gasPrice,decimals:this.state.token.quantity.decimals}))},fetchTokenBalance(e){return u(this,null,function*(){M.loading=!0;let t=l.state.activeCaipNetwork?.caipNetworkId,r=l.state.activeCaipNetwork?.chainNamespace,o=l.state.activeCaipAddress,n=o?N.getPlainAddress(o):void 0;if(M.lastRetry&&!N.isAllowedRetry(M.lastRetry,30*ee.ONE_SEC_MS))return M.loading=!1,[];try{if(n&&t&&r){let s=yield Xt.getMyTokensWithBalance();return M.tokenBalances=s,M.lastRetry=void 0,s}}catch(s){M.lastRetry=Date.now(),e?.(s),Q.showError("Token Balance Unavailable")}finally{M.loading=!1}return[]})},fetchNetworkBalance(){if(M.tokenBalances.length===0)return;let e=Xt.mapBalancesToSwapTokens(M.tokenBalances);if(!e)return;let t=e.find(r=>r.address===l.getActiveNetworkTokenAddress());t&&(M.networkBalanceInUSD=t?Ke.multiply(t.quantity.numeric,t.price).toString():"0")},isInsufficientNetworkTokenForGas(e,t){let r=t||"0";return Ke.bigNumber(e).eq(0)?!0:Ke.bigNumber(Ke.bigNumber(r)).gt(e)},hasInsufficientGasFunds(){let e=l.state.activeChain,t=!0;return D.state.preferredAccountTypes?.[e]===he.ACCOUNT_TYPES.SMART_ACCOUNT?t=!1:M.networkBalanceInUSD&&(t=this.isInsufficientNetworkTokenForGas(M.networkBalanceInUSD,M.gasPriceInUSD)),t},sendNativeToken(e){return u(this,null,function*(){let t=l.state.activeChain;B.pushTransactionStack({view:"Account",goBack:!1});let r=e.receiverAddress,o=D.state.address,n=X.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals)),s="0x";try{yield X.sendTransaction({chainNamespace:"eip155",to:r,address:o,data:s,value:n??BigInt(0),gasPrice:e.gasPrice}),Q.showSuccess("Transaction started"),F.sendEvent({type:"track",event:"SEND_SUCCESS",properties:{isSmartAccount:D.state.preferredAccountTypes?.[t]===he.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token?.symbol||"",amount:e.sendTokenAmount,network:l.state.activeCaipNetwork?.caipNetworkId||""}}),this.resetSend()}catch(c){console.error("SendController:sendERC20Token - failed to send native token",c);let a=c instanceof Error?c.message:"Unknown error";F.sendEvent({type:"track",event:"SEND_ERROR",properties:{message:a,isSmartAccount:D.state.preferredAccountTypes?.[t]===he.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token?.symbol||"",amount:e.sendTokenAmount,network:l.state.activeCaipNetwork?.caipNetworkId||""}}),Q.showError("Something went wrong")}})},sendERC20Token(e){return u(this,null,function*(){B.pushTransactionStack({view:"Account",goBack:!1});let t=X.parseUnits(e.sendTokenAmount.toString(),Number(e.decimals));try{if(D.state.address&&e.sendTokenAmount&&e.receiverAddress&&e.tokenAddress){let r=N.getPlainAddress(e.tokenAddress);yield X.writeContract({fromAddress:D.state.address,tokenAddress:r,args:[e.receiverAddress,t??BigInt(0)],method:"transfer",abi:jt.getERC20Abi(r),chainNamespace:"eip155"}),Q.showSuccess("Transaction started"),this.resetSend()}}catch(r){console.error("SendController:sendERC20Token - failed to send erc20 token",r);let o=r instanceof Error?r.message:"Unknown error";F.sendEvent({type:"track",event:"SEND_ERROR",properties:{message:o,isSmartAccount:D.state.preferredAccountTypes?.eip155===he.ACCOUNT_TYPES.SMART_ACCOUNT,token:this.state.token?.symbol||"",amount:e.sendTokenAmount,network:l.state.activeCaipNetwork?.caipNetworkId||""}}),Q.showError("Something went wrong")}})},sendSolanaToken(){if(!this.state.sendTokenAmount||!this.state.receiverAddress){Q.showError("Please enter a valid amount and receiver address");return}B.pushTransactionStack({view:"Account",goBack:!1}),X.sendTransaction({chainNamespace:"solana",to:this.state.receiverAddress,value:this.state.sendTokenAmount}).then(()=>{this.resetSend(),D.fetchTokenBalance()}).catch(e=>{Q.showError("Failed to send transaction. Please try again."),console.error("SendController:sendToken - failed to send solana transaction",e)})},resetSend(){M.token=void 0,M.sendTokenAmount=void 0,M.receiverAddress=void 0,M.receiverProfileImageUrl=void 0,M.receiverProfileName=void 0,M.loading=!1,M.tokenBalances=[]}};var Zt={currentTab:0,tokenBalance:[],smartAccountDeployed:!1,addressLabels:new Map,allAccounts:[],user:void 0},wt={caipNetwork:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]},m=y({chains:mr(),activeCaipAddress:void 0,activeChain:void 0,activeCaipNetwork:void 0,noAdapters:!1,universalAdapter:{networkControllerClient:void 0,connectionControllerClient:void 0},isSwitchingNamespace:!1}),l={state:m,subscribe(e){return z(m,()=>{e(m)})},subscribeKey(e,t){return q(m,e,t)},subscribeChainProp(e,t,r){let o;return z(m.chains,()=>{let n=r||m.activeChain;if(n){let s=m.chains.get(n)?.[e];o!==s&&(o=s,t(s))}})},initialize(e,t,r){let{chainId:o,namespace:n}=w.getActiveNetworkProps(),s=t?.find(i=>i.id.toString()===o?.toString()),a=e.find(i=>i?.namespace===n)||e?.[0],p=new Set([...t?.map(i=>i.chainNamespace)??[]]);(e?.length===0||!a)&&(m.noAdapters=!0),m.noAdapters||(m.activeChain=a?.namespace,m.activeCaipNetwork=s,this.setChainNetworkData(a?.namespace,{caipNetwork:s}),m.activeChain&&ye.set({activeChain:a?.namespace})),p.forEach(i=>{let f=t?.filter(h=>h.chainNamespace===i);l.state.chains.set(i,d({namespace:i,networkState:y(A(d({},wt),{caipNetwork:f?.[0]})),accountState:y(Zt),caipNetworks:f??[]},r)),this.setRequestedCaipNetworks(f??[],i)})},removeAdapter(e){if(m.activeChain===e){let t=Array.from(m.chains.entries()).find(([r])=>r!==e);if(t){let r=t[1]?.caipNetworks?.[0];r&&this.setActiveCaipNetwork(r)}}m.chains.delete(e)},addAdapter(e,{networkControllerClient:t,connectionControllerClient:r},o){m.chains.set(e.namespace,{namespace:e.namespace,networkState:A(d({},wt),{caipNetwork:o[0]}),accountState:Zt,caipNetworks:o,connectionControllerClient:r,networkControllerClient:t}),this.setRequestedCaipNetworks(o?.filter(n=>n.chainNamespace===e.namespace)??[],e.namespace)},addNetwork(e){let t=m.chains.get(e.chainNamespace);if(t){let r=[...t.caipNetworks||[]];t.caipNetworks?.find(o=>o.id===e.id)||r.push(e),m.chains.set(e.chainNamespace,A(d({},t),{caipNetworks:r})),this.setRequestedCaipNetworks(r,e.chainNamespace)}},removeNetwork(e,t){let r=m.chains.get(e);if(r){let o=m.activeCaipNetwork?.id===t,n=[...r.caipNetworks?.filter(s=>s.id!==t)||[]];o&&r?.caipNetworks?.[0]&&this.setActiveCaipNetwork(r.caipNetworks[0]),m.chains.set(e,A(d({},r),{caipNetworks:n})),this.setRequestedCaipNetworks(n||[],e)}},setAdapterNetworkState(e,t){let r=m.chains.get(e);r&&(r.networkState=d(d({},r.networkState||wt),t),m.chains.set(e,r))},setChainAccountData(e,t,r=!0){if(!e)throw new Error("Chain is required to update chain account data");let o=m.chains.get(e);if(o){let n=d(d({},o.accountState||Zt),t);m.chains.set(e,A(d({},o),{accountState:n})),(m.chains.size===1||m.activeChain===e)&&(t.caipAddress&&(m.activeCaipAddress=t.caipAddress),D.replaceState(n))}},setChainNetworkData(e,t){if(!e)return;let r=m.chains.get(e);if(r){let o=d(d({},r.networkState||wt),t);m.chains.set(e,A(d({},r),{networkState:o}))}},setAccountProp(e,t,r,o=!0){this.setChainAccountData(r,{[e]:t},o),e==="status"&&t==="disconnected"&&r&&V.removeConnectorId(r)},setActiveNamespace(e){m.activeChain=e;let t=e?m.chains.get(e):void 0,r=t?.networkState?.caipNetwork;r?.id&&e&&(m.activeCaipAddress=t?.accountState?.caipAddress,m.activeCaipNetwork=r,this.setChainNetworkData(e,{caipNetwork:r}),w.setActiveCaipNetworkId(r?.caipNetworkId),ye.set({activeChain:e,selectedNetworkId:r?.caipNetworkId}))},setActiveCaipNetwork(e){if(!e)return;m.activeChain!==e.chainNamespace&&this.setIsSwitchingNamespace(!0);let t=m.chains.get(e.chainNamespace);m.activeChain=e.chainNamespace,m.activeCaipNetwork=e,this.setChainNetworkData(e.chainNamespace,{caipNetwork:e}),t?.accountState?.address?m.activeCaipAddress=`${e.chainNamespace}:${e.id}:${t?.accountState?.address}`:m.activeCaipAddress=void 0,this.setAccountProp("caipAddress",m.activeCaipAddress,e.chainNamespace),t&&D.replaceState(t.accountState),Qt.resetSend(),ye.set({activeChain:m.activeChain,selectedNetworkId:m.activeCaipNetwork?.caipNetworkId}),w.setActiveCaipNetworkId(e.caipNetworkId),!this.checkIfSupportedNetwork(e.chainNamespace)&&P.state.enableNetworkSwitch&&!P.state.allowUnsupportedChain&&!X.state.wcBasic&&this.showUnsupportedChainUI()},addCaipNetwork(e){if(!e)return;let t=m.chains.get(e.chainNamespace);t&&t?.caipNetworks?.push(e)},switchActiveNamespace(e){return u(this,null,function*(){if(!e)return;let t=e!==l.state.activeChain,r=l.getNetworkData(e)?.caipNetwork,o=l.getCaipNetworkByNamespace(e,r?.id);t&&o&&(yield l.switchActiveNetwork(o))})},switchActiveNetwork(e){return u(this,null,function*(){!l.state.chains.get(l.state.activeChain)?.caipNetworks?.some(n=>n.id===m.activeCaipNetwork?.id)&&B.goBack();let o=this.getNetworkControllerClient(e.chainNamespace);o&&(yield o.switchCaipNetwork(e),F.sendEvent({type:"track",event:"SWITCH_NETWORK",properties:{network:e.caipNetworkId}}))})},getNetworkControllerClient(e){let t=e||m.activeChain,r=m.chains.get(t);if(!r)throw new Error("Chain adapter not found");if(!r.networkControllerClient)throw new Error("NetworkController client not set");return r.networkControllerClient},getConnectionControllerClient(e){let t=e||m.activeChain;if(!t)throw new Error("Chain is required to get connection controller client");let r=m.chains.get(t);if(!r?.connectionControllerClient)throw new Error("ConnectionController client not set");return r.connectionControllerClient},getAccountProp(e,t){let r=m.activeChain;if(t&&(r=t),!r)return;let o=m.chains.get(r)?.accountState;if(o)return o[e]},getNetworkProp(e,t){let r=m.chains.get(t)?.networkState;if(r)return r[e]},getRequestedCaipNetworks(e){let t=m.chains.get(e),{approvedCaipNetworkIds:r=[],requestedCaipNetworks:o=[]}=t?.networkState||{};return N.sortRequestedNetworks(r,o)},getAllRequestedCaipNetworks(){let e=[];return m.chains.forEach(t=>{let r=this.getRequestedCaipNetworks(t.namespace);e.push(...r)}),e},setRequestedCaipNetworks(e,t){this.setAdapterNetworkState(t,{requestedCaipNetworks:e})},getAllApprovedCaipNetworkIds(){let e=[];return m.chains.forEach(t=>{let r=this.getApprovedCaipNetworkIds(t.namespace);e.push(...r)}),e},getActiveCaipNetwork(){return m.activeCaipNetwork},getActiveCaipAddress(){return m.activeCaipAddress},getApprovedCaipNetworkIds(e){return m.chains.get(e)?.networkState?.approvedCaipNetworkIds||[]},setApprovedCaipNetworksData(e){return u(this,null,function*(){let r=yield this.getNetworkControllerClient()?.getApprovedCaipNetworksData();this.setAdapterNetworkState(e,{approvedCaipNetworkIds:r?.approvedCaipNetworkIds,supportsAllNetworks:r?.supportsAllNetworks})})},checkIfSupportedNetwork(e,t){let r=t||m.activeCaipNetwork,o=this.getRequestedCaipNetworks(e);return o.length?o?.some(n=>n.id===r?.id):!0},checkIfSupportedChainId(e){return m.activeChain?this.getRequestedCaipNetworks(m.activeChain)?.some(r=>r.id===e):!0},setSmartAccountEnabledNetworks(e,t){this.setAdapterNetworkState(t,{smartAccountEnabledNetworks:e})},checkIfSmartAccountEnabled(){let e=Wt.caipNetworkIdToNumber(m.activeCaipNetwork?.caipNetworkId),t=m.activeChain;return!t||!e?!1:!!this.getNetworkProp("smartAccountEnabledNetworks",t)?.includes(Number(e))},getActiveNetworkTokenAddress(){let e=m.activeCaipNetwork?.chainNamespace||"eip155",t=m.activeCaipNetwork?.id||1,r=ee.NATIVE_TOKEN_ADDRESS[e];return`${e}:${t}:${r}`},showUnsupportedChainUI(){te.open({view:"UnsupportedChain"})},checkIfNamesSupported(){let e=m.activeCaipNetwork;return!!(e?.chainNamespace&&ee.NAMES_SUPPORTED_CHAIN_NAMESPACES.includes(e.chainNamespace))},resetNetwork(e){this.setAdapterNetworkState(e,{approvedCaipNetworkIds:void 0,supportsAllNetworks:!0,smartAccountEnabledNetworks:[]})},resetAccount(e){let t=e;if(!t)throw new Error("Chain is required to set account prop");m.activeCaipAddress=void 0,this.setChainAccountData(t,{smartAccountDeployed:!1,currentTab:0,caipAddress:void 0,address:void 0,balance:void 0,balanceSymbol:void 0,profileName:void 0,profileImage:void 0,addressExplorerUrl:void 0,tokenBalance:[],connectedWalletInfo:void 0,preferredAccountTypes:void 0,socialProvider:void 0,socialWindow:void 0,farcasterUrl:void 0,allAccounts:[],user:void 0,status:"disconnected"}),V.removeConnectorId(t)},disconnect(e){return u(this,null,function*(){let t=Er(e);try{Qt.resetSend();let r=yield Promise.allSettled(t.map(c=>u(this,[c],function*([n,s]){try{let{caipAddress:a}=this.getAccountData(n)||{};a&&s.connectionControllerClient?.disconnect&&(yield s.connectionControllerClient.disconnect(n)),this.resetAccount(n),this.resetNetwork(n)}catch(a){throw new Error(`Failed to disconnect chain ${n}: ${a.message}`)}})));X.resetWcConnection();let o=r.filter(n=>n.status==="rejected");if(o.length>0)throw new Error(o.map(n=>n.reason.message).join(", "));w.deleteConnectedSocialProvider(),e?V.removeConnectorId(e):V.resetConnectorIds(),F.sendEvent({type:"track",event:"DISCONNECT_SUCCESS",properties:{namespace:e||"all"}})}catch(r){console.error(r.message||"Failed to disconnect chains"),F.sendEvent({type:"track",event:"DISCONNECT_ERROR",properties:{message:r.message||"Failed to disconnect chains"}})}})},setIsSwitchingNamespace(e){m.isSwitchingNamespace=e},getFirstCaipNetworkSupportsAuthConnector(){let e=[],t;if(m.chains.forEach(r=>{K.AUTH_CONNECTOR_SUPPORTED_CHAINS.find(o=>o===r.namespace)&&r.namespace&&e.push(r.namespace)}),e.length>0){let r=e[0];return t=r?m.chains.get(r)?.caipNetworks?.[0]:void 0,t}},getAccountData(e){return e?l.state.chains.get(e)?.accountState:D.state},getNetworkData(e){let t=e||m.activeChain;if(t)return l.state.chains.get(t)?.networkState},getCaipNetworkByNamespace(e,t){if(!e)return;let r=l.state.chains.get(e),o=r?.caipNetworks?.find(n=>n.id===t);return o||r?.networkState?.caipNetwork||r?.caipNetworks?.[0]},getRequestedCaipNetworkIds(){let e=V.state.filterByNamespace;return(e?[m.chains.get(e)]:Array.from(m.chains.values())).flatMap(r=>r?.caipNetworks||[]).map(r=>r.caipNetworkId)},getCaipNetworks(e){return e?l.getRequestedCaipNetworks(e):l.getAllRequestedCaipNetworks()}};var uo=["1ca0bdd4747578705b1939af023d120677c64fe6ca76add81fda36e350605e79","fd20dc426fb37566d803205b19bbc1d4096b248ac04548e3cfb6b3a38bd033aa","a797aa35c0fadbfc1a53e7f675162ed5226968b44a19ee3d24385c64d1d3c393"],po=N.getApiUrl(),fe=new Se({baseUrl:po,clientId:null}),mo=40,_r=4,ho=20,$=y({promises:{},page:1,count:0,featured:[],allFeatured:[],recommended:[],allRecommended:[],wallets:[],search:[],isAnalyticsEnabled:!1,excludedWallets:[],isFetchingRecommendedWallets:!1}),T={state:$,subscribeKey(e,t){return q($,e,t)},_getSdkProperties(){let{projectId:e,sdkType:t,sdkVersion:r}=P.state;return{projectId:e,st:t||"appkit",sv:r||"html-wagmi-4.2.2"}},_filterOutExtensions(e){return P.state.isUniversalProvider?e.filter(t=>!!(t.mobile_link||t.desktop_link||t.webapp_link)):e},_fetchWalletImage(e){return u(this,null,function*(){let t=`${fe.baseUrl}/getWalletImage/${e}`,r=yield fe.getBlob({path:t,params:T._getSdkProperties()});se.setWalletImage(e,URL.createObjectURL(r))})},_fetchNetworkImage(e){return u(this,null,function*(){let t=`${fe.baseUrl}/public/getAssetImage/${e}`,r=yield fe.getBlob({path:t,params:T._getSdkProperties()});se.setNetworkImage(e,URL.createObjectURL(r))})},_fetchConnectorImage(e){return u(this,null,function*(){let t=`${fe.baseUrl}/public/getAssetImage/${e}`,r=yield fe.getBlob({path:t,params:T._getSdkProperties()});se.setConnectorImage(e,URL.createObjectURL(r))})},_fetchCurrencyImage(e){return u(this,null,function*(){let t=`${fe.baseUrl}/public/getCurrencyImage/${e}`,r=yield fe.getBlob({path:t,params:T._getSdkProperties()});se.setCurrencyImage(e,URL.createObjectURL(r))})},_fetchTokenImage(e){return u(this,null,function*(){let t=`${fe.baseUrl}/public/getTokenImage/${e}`,r=yield fe.getBlob({path:t,params:T._getSdkProperties()});se.setTokenImage(e,URL.createObjectURL(r))})},fetchNetworkImages(){return u(this,null,function*(){let t=l.getAllRequestedCaipNetworks()?.map(({assets:r})=>r?.imageId).filter(Boolean).filter(r=>!Gt.getNetworkImageById(r));t&&(yield Promise.allSettled(t.map(r=>T._fetchNetworkImage(r))))})},fetchConnectorImages(){return u(this,null,function*(){let{connectors:e}=V.state,t=e.map(({imageId:r})=>r).filter(Boolean);yield Promise.allSettled(t.map(r=>T._fetchConnectorImage(r)))})},fetchCurrencyImages(){return u(this,arguments,function*(e=[]){yield Promise.allSettled(e.map(t=>T._fetchCurrencyImage(t)))})},fetchTokenImages(){return u(this,arguments,function*(e=[]){yield Promise.allSettled(e.map(t=>T._fetchTokenImage(t)))})},fetchWallets(e){return u(this,null,function*(){let t=e.exclude??[];return T._getSdkProperties().sv.startsWith("html-core-")&&t.push(...uo),yield fe.get({path:"/getWallets",params:A(d(d({},T._getSdkProperties()),e),{page:String(e.page),entries:String(e.entries),include:e.include?.join(","),exclude:e.exclude?.join(",")})})})},fetchFeaturedWallets(){return u(this,null,function*(){let{featuredWalletIds:e}=P.state;if(e?.length){let t=A(d({},T._getSdkProperties()),{page:1,entries:e?.length??_r,include:e}),{data:r}=yield T.fetchWallets(t);r.sort((n,s)=>e.indexOf(n.id)-e.indexOf(s.id));let o=r.map(n=>n.image_id).filter(Boolean);yield Promise.allSettled(o.map(n=>T._fetchWalletImage(n))),$.featured=r,$.allFeatured=r}})},fetchRecommendedWallets(){return u(this,null,function*(){try{$.isFetchingRecommendedWallets=!0;let{includeWalletIds:e,excludeWalletIds:t,featuredWalletIds:r}=P.state,o=[...t??[],...r??[]].filter(Boolean),n=l.getRequestedCaipNetworkIds().join(","),s={page:1,entries:_r,include:e,exclude:o,chains:n},{data:c,count:a}=yield T.fetchWallets(s),p=w.getRecentWallets(),i=c.map(h=>h.image_id).filter(Boolean),f=p.map(h=>h.image_id).filter(Boolean);yield Promise.allSettled([...i,...f].map(h=>T._fetchWalletImage(h))),$.recommended=c,$.allRecommended=c,$.count=a??0}catch{}finally{$.isFetchingRecommendedWallets=!1}})},fetchWalletsByPage(t){return u(this,arguments,function*({page:e}){let{includeWalletIds:r,excludeWalletIds:o,featuredWalletIds:n}=P.state,s=l.getRequestedCaipNetworkIds().join(","),c=[...$.recommended.map(({id:h})=>h),...o??[],...n??[]].filter(Boolean),a={page:e,entries:mo,include:r,exclude:c,chains:s},{data:p,count:i}=yield T.fetchWallets(a),f=p.slice(0,ho).map(h=>h.image_id).filter(Boolean);yield Promise.allSettled(f.map(h=>T._fetchWalletImage(h))),$.wallets=N.uniqueBy([...$.wallets,...T._filterOutExtensions(p)],"id"),$.count=i>$.count?i:$.count,$.page=e})},initializeExcludedWallets(t){return u(this,arguments,function*({ids:e}){let r=l.getRequestedCaipNetworkIds().join(","),o={page:1,entries:e.length,include:e,chains:r},{data:n}=yield T.fetchWallets(o);n&&n.forEach(s=>{$.excludedWallets.push({rdns:s.rdns,name:s.name})})})},searchWallet(r){return u(this,arguments,function*({search:e,badge:t}){let{includeWalletIds:o,excludeWalletIds:n}=P.state,s=l.getRequestedCaipNetworkIds().join(",");$.search=[];let c={page:1,entries:100,search:e?.trim(),badge_type:t,include:o,exclude:n,chains:s},{data:a}=yield T.fetchWallets(c);F.sendEvent({type:"track",event:"SEARCH_WALLET",properties:{badge:t??"",search:e??""}});let p=a.map(i=>i.image_id).filter(Boolean);yield Promise.allSettled([...p.map(i=>T._fetchWalletImage(i)),N.wait(300)]),$.search=T._filterOutExtensions(a)})},initPromise(e,t){let r=$.promises[e];return r||($.promises[e]=t())},prefetch({fetchConnectorImages:e=!0,fetchFeaturedWallets:t=!0,fetchRecommendedWallets:r=!0,fetchNetworkImages:o=!0}={}){let n=[e&&T.initPromise("connectorImages",T.fetchConnectorImages),t&&T.initPromise("featuredWallets",T.fetchFeaturedWallets),r&&T.initPromise("recommendedWallets",T.fetchRecommendedWallets),o&&T.initPromise("networkImages",T.fetchNetworkImages)].filter(Boolean);return Promise.allSettled(n)},prefetchAnalyticsConfig(){P.state.features?.analytics&&T.fetchAnalyticsConfig()},fetchAnalyticsConfig(){return u(this,null,function*(){try{let{isAnalyticsEnabled:e}=yield fe.get({path:"/getAnalyticsConfig",params:T._getSdkProperties()});P.setFeatures({analytics:e})}catch{P.setFeatures({analytics:!1})}})},setFilterByNamespace(e){if(!e){$.featured=$.allFeatured,$.recommended=$.allRecommended;return}let t=l.getRequestedCaipNetworkIds().join(",");$.featured=$.allFeatured.filter(r=>r.chains?.some(o=>t.includes(o))),$.recommended=$.allRecommended.filter(r=>r.chains?.some(o=>t.includes(o)))}};var Ee=y({message:"",open:!1,triggerRect:{width:0,height:0,top:0,left:0},variant:"shade"}),fo={state:Ee,subscribe(e){return z(Ee,()=>e(Ee))},subscribeKey(e,t){return q(Ee,e,t)},showTooltip({message:e,triggerRect:t,variant:r}){Ee.open=!0,Ee.message=e,Ee.triggerRect=t,Ee.variant=r},hide(){Ee.open=!1,Ee.message="",Ee.triggerRect={width:0,height:0,top:0,left:0}}};var Tr={convertEVMChainIdToCoinType(e){if(e>=2147483648)throw new Error("Invalid chainId");return(2147483648|e)>>>0}};var ge=y({suggestions:[],loading:!1}),go={state:ge,subscribe(e){return z(ge,()=>e(ge))},subscribeKey(e,t){return q(ge,e,t)},resolveName(e){return u(this,null,function*(){try{return yield C.lookupEnsName(e)}catch(t){let r=t;throw new Error(r?.reasons?.[0]?.description||"Error resolving name")}})},isNameRegistered(e){return u(this,null,function*(){try{return yield C.lookupEnsName(e),!0}catch{return!1}})},getSuggestions(e){return u(this,null,function*(){try{ge.loading=!0,ge.suggestions=[];let t=yield C.getEnsNameSuggestions(e);return ge.suggestions=t.suggestions.map(r=>A(d({},r),{name:r.name}))||[],ge.suggestions}catch(t){let r=this.parseEnsApiError(t,"Error fetching name suggestions");throw new Error(r)}finally{ge.loading=!1}})},getNamesForAddress(e){return u(this,null,function*(){try{if(!l.state.activeCaipNetwork)return[];let r=w.getEnsFromCacheForAddress(e);if(r)return r;let o=yield C.reverseLookupEnsName({address:e});return w.updateEnsCache({address:e,ens:o,timestamp:Date.now()}),o}catch(t){let r=this.parseEnsApiError(t,"Error fetching names for address");throw new Error(r)}})},registerName(e){return u(this,null,function*(){let t=l.state.activeCaipNetwork;if(!t)throw new Error("Network not found");let r=D.state.address,o=V.getAuthConnector();if(!r||!o)throw new Error("Address or auth connector not found");ge.loading=!0;try{let n=JSON.stringify({name:e,attributes:{},timestamp:Math.floor(Date.now()/1e3)});B.pushTransactionStack({view:"RegisterAccountNameSuccess",goBack:!1,replace:!0,onCancel(){ge.loading=!1}});let s=yield X.signMessage(n),c=t.id;if(!c)throw new Error("Network not found");let a=Tr.convertEVMChainIdToCoinType(Number(c));yield C.registerEnsName({coinType:a,address:r,signature:s,message:n}),D.setProfileName(e,t.chainNamespace),B.replace("RegisterAccountNameSuccess")}catch(n){let s=this.parseEnsApiError(n,`Error registering name ${e}`);throw B.replace("RegisterAccountName"),new Error(s)}finally{ge.loading=!1}})},validateName(e){return/^[a-zA-Z0-9-]{4,}$/u.test(e)},parseEnsApiError(e,t){return e?.reasons?.[0]?.description||t}};var nt,ke,Oe;function wo(e,t){nt=document.createElement("style"),ke=document.createElement("style"),Oe=document.createElement("style"),nt.textContent=Je(e).core.cssText,ke.textContent=Je(e).dark.cssText,Oe.textContent=Je(e).light.cssText,document.head.appendChild(nt),document.head.appendChild(ke),document.head.appendChild(Oe),xr(t)}function xr(e){ke&&Oe&&(e==="light"?(ke.removeAttribute("media"),Oe.media="enabled"):(Oe.removeAttribute("media"),ke.media="enabled"))}function Co(e){nt&&ke&&Oe&&(nt.textContent=Je(e).core.cssText,ke.textContent=Je(e).dark.cssText,Oe.textContent=Je(e).light.cssText)}function Je(e){return{core:Me`
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
      @keyframes w3m-shake {
        0% {
          transform: scale(1) rotate(0deg);
        }
        20% {
          transform: scale(1) rotate(-1deg);
        }
        40% {
          transform: scale(1) rotate(1.5deg);
        }
        60% {
          transform: scale(1) rotate(-1.5deg);
        }
        80% {
          transform: scale(1) rotate(1deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
      @keyframes w3m-iframe-fade-out {
        0% {
          opacity: 1;
        }
        100% {
          opacity: 0;
        }
      }
      @keyframes w3m-iframe-zoom-in {
        0% {
          transform: translateY(50px);
          opacity: 0;
        }
        100% {
          transform: translateY(0px);
          opacity: 1;
        }
      }
      @keyframes w3m-iframe-zoom-in-mobile {
        0% {
          transform: scale(0.95);
          opacity: 0;
        }
        100% {
          transform: scale(1);
          opacity: 1;
        }
      }
      :root {
        --w3m-modal-width: 360px;
        --w3m-color-mix-strength: ${pe(e?.["--w3m-color-mix-strength"]?`${e["--w3m-color-mix-strength"]}%`:"0%")};
        --w3m-font-family: ${pe(e?.["--w3m-font-family"]||"Inter, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;")};
        --w3m-font-size-master: ${pe(e?.["--w3m-font-size-master"]||"10px")};
        --w3m-border-radius-master: ${pe(e?.["--w3m-border-radius-master"]||"4px")};
        --w3m-z-index: ${pe(e?.["--w3m-z-index"]||999)};

        --wui-font-family: var(--w3m-font-family);

        --wui-font-size-mini: calc(var(--w3m-font-size-master) * 0.8);
        --wui-font-size-micro: var(--w3m-font-size-master);
        --wui-font-size-tiny: calc(var(--w3m-font-size-master) * 1.2);
        --wui-font-size-small: calc(var(--w3m-font-size-master) * 1.4);
        --wui-font-size-paragraph: calc(var(--w3m-font-size-master) * 1.6);
        --wui-font-size-medium: calc(var(--w3m-font-size-master) * 1.8);
        --wui-font-size-large: calc(var(--w3m-font-size-master) * 2);
        --wui-font-size-title-6: calc(var(--w3m-font-size-master) * 2.2);
        --wui-font-size-medium-title: calc(var(--w3m-font-size-master) * 2.4);
        --wui-font-size-2xl: calc(var(--w3m-font-size-master) * 4);

        --wui-border-radius-5xs: var(--w3m-border-radius-master);
        --wui-border-radius-4xs: calc(var(--w3m-border-radius-master) * 1.5);
        --wui-border-radius-3xs: calc(var(--w3m-border-radius-master) * 2);
        --wui-border-radius-xxs: calc(var(--w3m-border-radius-master) * 3);
        --wui-border-radius-xs: calc(var(--w3m-border-radius-master) * 4);
        --wui-border-radius-s: calc(var(--w3m-border-radius-master) * 5);
        --wui-border-radius-m: calc(var(--w3m-border-radius-master) * 7);
        --wui-border-radius-l: calc(var(--w3m-border-radius-master) * 9);
        --wui-border-radius-3xl: calc(var(--w3m-border-radius-master) * 20);

        --wui-font-weight-light: 400;
        --wui-font-weight-regular: 500;
        --wui-font-weight-medium: 600;
        --wui-font-weight-bold: 700;

        --wui-letter-spacing-2xl: -1.6px;
        --wui-letter-spacing-medium-title: -0.96px;
        --wui-letter-spacing-title-6: -0.88px;
        --wui-letter-spacing-large: -0.8px;
        --wui-letter-spacing-medium: -0.72px;
        --wui-letter-spacing-paragraph: -0.64px;
        --wui-letter-spacing-small: -0.56px;
        --wui-letter-spacing-tiny: -0.48px;
        --wui-letter-spacing-micro: -0.2px;
        --wui-letter-spacing-mini: -0.16px;

        --wui-spacing-0: 0px;
        --wui-spacing-4xs: 2px;
        --wui-spacing-3xs: 4px;
        --wui-spacing-xxs: 6px;
        --wui-spacing-2xs: 7px;
        --wui-spacing-xs: 8px;
        --wui-spacing-1xs: 10px;
        --wui-spacing-s: 12px;
        --wui-spacing-m: 14px;
        --wui-spacing-l: 16px;
        --wui-spacing-2l: 18px;
        --wui-spacing-xl: 20px;
        --wui-spacing-xxl: 24px;
        --wui-spacing-2xl: 32px;
        --wui-spacing-3xl: 40px;
        --wui-spacing-4xl: 90px;
        --wui-spacing-5xl: 95px;

        --wui-icon-box-size-xxs: 14px;
        --wui-icon-box-size-xs: 20px;
        --wui-icon-box-size-sm: 24px;
        --wui-icon-box-size-md: 32px;
        --wui-icon-box-size-mdl: 36px;
        --wui-icon-box-size-lg: 40px;
        --wui-icon-box-size-2lg: 48px;
        --wui-icon-box-size-xl: 64px;

        --wui-icon-size-inherit: inherit;
        --wui-icon-size-xxs: 10px;
        --wui-icon-size-xs: 12px;
        --wui-icon-size-sm: 14px;
        --wui-icon-size-md: 16px;
        --wui-icon-size-mdl: 18px;
        --wui-icon-size-lg: 20px;
        --wui-icon-size-xl: 24px;
        --wui-icon-size-xxl: 28px;

        --wui-wallet-image-size-inherit: inherit;
        --wui-wallet-image-size-sm: 40px;
        --wui-wallet-image-size-md: 56px;
        --wui-wallet-image-size-lg: 80px;

        --wui-visual-size-size-inherit: inherit;
        --wui-visual-size-sm: 40px;
        --wui-visual-size-md: 55px;
        --wui-visual-size-lg: 80px;

        --wui-box-size-md: 100px;
        --wui-box-size-lg: 120px;

        --wui-ease-out-power-2: cubic-bezier(0, 0, 0.22, 1);
        --wui-ease-out-power-1: cubic-bezier(0, 0, 0.55, 1);

        --wui-ease-in-power-3: cubic-bezier(0.66, 0, 1, 1);
        --wui-ease-in-power-2: cubic-bezier(0.45, 0, 1, 1);
        --wui-ease-in-power-1: cubic-bezier(0.3, 0, 1, 1);

        --wui-ease-inout-power-1: cubic-bezier(0.45, 0, 0.55, 1);

        --wui-duration-lg: 200ms;
        --wui-duration-md: 125ms;
        --wui-duration-sm: 75ms;

        --wui-path-network-sm: path(
          'M15.4 2.1a5.21 5.21 0 0 1 5.2 0l11.61 6.7a5.21 5.21 0 0 1 2.61 4.52v13.4c0 1.87-1 3.59-2.6 4.52l-11.61 6.7c-1.62.93-3.6.93-5.22 0l-11.6-6.7a5.21 5.21 0 0 1-2.61-4.51v-13.4c0-1.87 1-3.6 2.6-4.52L15.4 2.1Z'
        );

        --wui-path-network-md: path(
          'M43.4605 10.7248L28.0485 1.61089C25.5438 0.129705 22.4562 0.129705 19.9515 1.61088L4.53951 10.7248C2.03626 12.2051 0.5 14.9365 0.5 17.886V36.1139C0.5 39.0635 2.03626 41.7949 4.53951 43.2752L19.9515 52.3891C22.4562 53.8703 25.5438 53.8703 28.0485 52.3891L43.4605 43.2752C45.9637 41.7949 47.5 39.0635 47.5 36.114V17.8861C47.5 14.9365 45.9637 12.2051 43.4605 10.7248Z'
        );

        --wui-path-network-lg: path(
          'M78.3244 18.926L50.1808 2.45078C45.7376 -0.150261 40.2624 -0.150262 35.8192 2.45078L7.6756 18.926C3.23322 21.5266 0.5 26.3301 0.5 31.5248V64.4752C0.5 69.6699 3.23322 74.4734 7.6756 77.074L35.8192 93.5492C40.2624 96.1503 45.7376 96.1503 50.1808 93.5492L78.3244 77.074C82.7668 74.4734 85.5 69.6699 85.5 64.4752V31.5248C85.5 26.3301 82.7668 21.5266 78.3244 18.926Z'
        );

        --wui-width-network-sm: 36px;
        --wui-width-network-md: 48px;
        --wui-width-network-lg: 86px;

        --wui-height-network-sm: 40px;
        --wui-height-network-md: 54px;
        --wui-height-network-lg: 96px;

        --wui-icon-size-network-xs: 12px;
        --wui-icon-size-network-sm: 16px;
        --wui-icon-size-network-md: 24px;
        --wui-icon-size-network-lg: 42px;

        --wui-color-inherit: inherit;

        --wui-color-inverse-100: #fff;
        --wui-color-inverse-000: #000;

        --wui-cover: rgba(20, 20, 20, 0.8);

        --wui-color-modal-bg: var(--wui-color-modal-bg-base);

        --wui-color-accent-100: var(--wui-color-accent-base-100);
        --wui-color-accent-090: var(--wui-color-accent-base-090);
        --wui-color-accent-080: var(--wui-color-accent-base-080);

        --wui-color-success-100: var(--wui-color-success-base-100);
        --wui-color-success-125: var(--wui-color-success-base-125);

        --wui-color-warning-100: var(--wui-color-warning-base-100);

        --wui-color-error-100: var(--wui-color-error-base-100);
        --wui-color-error-125: var(--wui-color-error-base-125);

        --wui-color-blue-100: var(--wui-color-blue-base-100);
        --wui-color-blue-90: var(--wui-color-blue-base-90);

        --wui-icon-box-bg-error-100: var(--wui-icon-box-bg-error-base-100);
        --wui-icon-box-bg-blue-100: var(--wui-icon-box-bg-blue-base-100);
        --wui-icon-box-bg-success-100: var(--wui-icon-box-bg-success-base-100);
        --wui-icon-box-bg-inverse-100: var(--wui-icon-box-bg-inverse-base-100);

        --wui-all-wallets-bg-100: var(--wui-all-wallets-bg-100);

        --wui-avatar-border: var(--wui-avatar-border-base);

        --wui-thumbnail-border: var(--wui-thumbnail-border-base);

        --wui-wallet-button-bg: var(--wui-wallet-button-bg-base);

        --wui-box-shadow-blue: var(--wui-color-accent-glass-020);
      }

      @supports (background: color-mix(in srgb, white 50%, black)) {
        :root {
          --wui-color-modal-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-modal-bg-base)
          );

          --wui-box-shadow-blue: color-mix(in srgb, var(--wui-color-accent-100) 20%, transparent);

          --wui-color-accent-100: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 100%,
            transparent
          );
          --wui-color-accent-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-090: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 90%,
            transparent
          );
          --wui-color-accent-glass-080: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 80%,
            transparent
          );
          --wui-color-accent-glass-020: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 20%,
            transparent
          );
          --wui-color-accent-glass-015: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 15%,
            transparent
          );
          --wui-color-accent-glass-010: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 10%,
            transparent
          );
          --wui-color-accent-glass-005: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 5%,
            transparent
          );
          --wui-color-accent-002: color-mix(
            in srgb,
            var(--wui-color-accent-base-100) 2%,
            transparent
          );

          --wui-color-fg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-100)
          );
          --wui-color-fg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-125)
          );
          --wui-color-fg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-150)
          );
          --wui-color-fg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-175)
          );
          --wui-color-fg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-200)
          );
          --wui-color-fg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-225)
          );
          --wui-color-fg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-250)
          );
          --wui-color-fg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-275)
          );
          --wui-color-fg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-300)
          );
          --wui-color-fg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-325)
          );
          --wui-color-fg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-fg-350)
          );

          --wui-color-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-100)
          );
          --wui-color-bg-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-125)
          );
          --wui-color-bg-150: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-150)
          );
          --wui-color-bg-175: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-175)
          );
          --wui-color-bg-200: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-200)
          );
          --wui-color-bg-225: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-225)
          );
          --wui-color-bg-250: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-250)
          );
          --wui-color-bg-275: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-275)
          );
          --wui-color-bg-300: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-300)
          );
          --wui-color-bg-325: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-325)
          );
          --wui-color-bg-350: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-bg-350)
          );

          --wui-color-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-100)
          );
          --wui-color-success-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-success-base-125)
          );

          --wui-color-warning-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-warning-base-100)
          );

          --wui-color-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-100)
          );
          --wui-color-blue-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-100)
          );
          --wui-color-blue-90: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-blue-base-90)
          );
          --wui-color-error-125: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-color-error-base-125)
          );

          --wui-icon-box-bg-error-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-error-base-100)
          );
          --wui-icon-box-bg-accent-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-blue-base-100)
          );
          --wui-icon-box-bg-success-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-success-base-100)
          );
          --wui-icon-box-bg-inverse-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-icon-box-bg-inverse-base-100)
          );

          --wui-all-wallets-bg-100: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-all-wallets-bg-100)
          );

          --wui-avatar-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-avatar-border-base)
          );

          --wui-thumbnail-border: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-thumbnail-border-base)
          );

          --wui-wallet-button-bg: color-mix(
            in srgb,
            var(--w3m-color-mix) var(--w3m-color-mix-strength),
            var(--wui-wallet-button-bg-base)
          );
        }
      }
    `,light:Me`
      :root {
        --w3m-color-mix: ${pe(e?.["--w3m-color-mix"]||"#fff")};
        --w3m-accent: ${pe(de(e,"dark")["--w3m-accent"])};
        --w3m-default: #fff;

        --wui-color-modal-bg-base: ${pe(de(e,"dark")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(230, 100%, 67%, 1);
        --wui-color-blueberry-090: hsla(231, 76%, 61%, 1);
        --wui-color-blueberry-080: hsla(230, 59%, 55%, 1);
        --wui-color-blueberry-050: hsla(231, 100%, 70%, 0.1);

        --wui-color-fg-100: #e4e7e7;
        --wui-color-fg-125: #d0d5d5;
        --wui-color-fg-150: #a8b1b1;
        --wui-color-fg-175: #a8b0b0;
        --wui-color-fg-200: #949e9e;
        --wui-color-fg-225: #868f8f;
        --wui-color-fg-250: #788080;
        --wui-color-fg-275: #788181;
        --wui-color-fg-300: #6e7777;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #363636;

        --wui-color-bg-100: #141414;
        --wui-color-bg-125: #191a1a;
        --wui-color-bg-150: #1e1f1f;
        --wui-color-bg-175: #222525;
        --wui-color-bg-200: #272a2a;
        --wui-color-bg-225: #2c3030;
        --wui-color-bg-250: #313535;
        --wui-color-bg-275: #363b3b;
        --wui-color-bg-300: #3b4040;
        --wui-color-bg-325: #252525;
        --wui-color-bg-350: #ffffff;

        --wui-color-success-base-100: #26d962;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f25a67;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 217, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 217, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 217, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 217, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 217, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 217, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 217, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 217, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 217, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 217, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(242, 90, 103, 0.01);
        --wui-color-error-glass-002: rgba(242, 90, 103, 0.02);
        --wui-color-error-glass-005: rgba(242, 90, 103, 0.05);
        --wui-color-error-glass-010: rgba(242, 90, 103, 0.1);
        --wui-color-error-glass-015: rgba(242, 90, 103, 0.15);
        --wui-color-error-glass-020: rgba(242, 90, 103, 0.2);
        --wui-color-error-glass-025: rgba(242, 90, 103, 0.25);
        --wui-color-error-glass-030: rgba(242, 90, 103, 0.3);
        --wui-color-error-glass-060: rgba(242, 90, 103, 0.6);
        --wui-color-error-glass-080: rgba(242, 90, 103, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-color-gray-glass-001: rgba(255, 255, 255, 0.01);
        --wui-color-gray-glass-002: rgba(255, 255, 255, 0.02);
        --wui-color-gray-glass-005: rgba(255, 255, 255, 0.05);
        --wui-color-gray-glass-010: rgba(255, 255, 255, 0.1);
        --wui-color-gray-glass-015: rgba(255, 255, 255, 0.15);
        --wui-color-gray-glass-020: rgba(255, 255, 255, 0.2);
        --wui-color-gray-glass-025: rgba(255, 255, 255, 0.25);
        --wui-color-gray-glass-030: rgba(255, 255, 255, 0.3);
        --wui-color-gray-glass-060: rgba(255, 255, 255, 0.6);
        --wui-color-gray-glass-080: rgba(255, 255, 255, 0.8);
        --wui-color-gray-glass-090: rgba(255, 255, 255, 0.9);

        --wui-color-dark-glass-100: rgba(42, 42, 42, 1);

        --wui-icon-box-bg-error-base-100: #3c2426;
        --wui-icon-box-bg-blue-base-100: #20303f;
        --wui-icon-box-bg-success-base-100: #1f3a28;
        --wui-icon-box-bg-inverse-base-100: #243240;

        --wui-all-wallets-bg-100: #222b35;

        --wui-avatar-border-base: #252525;

        --wui-thumbnail-border-base: #252525;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --w3m-card-embedded-shadow-color: rgb(17 17 18 / 25%);
      }
    `,dark:Me`
      :root {
        --w3m-color-mix: ${pe(e?.["--w3m-color-mix"]||"#000")};
        --w3m-accent: ${pe(de(e,"light")["--w3m-accent"])};
        --w3m-default: #000;

        --wui-color-modal-bg-base: ${pe(de(e,"light")["--w3m-background"])};
        --wui-color-accent-base-100: var(--w3m-accent);

        --wui-color-blueberry-100: hsla(231, 100%, 70%, 1);
        --wui-color-blueberry-090: hsla(231, 97%, 72%, 1);
        --wui-color-blueberry-080: hsla(231, 92%, 74%, 1);

        --wui-color-fg-100: #141414;
        --wui-color-fg-125: #2d3131;
        --wui-color-fg-150: #474d4d;
        --wui-color-fg-175: #636d6d;
        --wui-color-fg-200: #798686;
        --wui-color-fg-225: #828f8f;
        --wui-color-fg-250: #8b9797;
        --wui-color-fg-275: #95a0a0;
        --wui-color-fg-300: #9ea9a9;
        --wui-color-fg-325: #9a9a9a;
        --wui-color-fg-350: #d0d0d0;

        --wui-color-bg-100: #ffffff;
        --wui-color-bg-125: #f5fafa;
        --wui-color-bg-150: #f3f8f8;
        --wui-color-bg-175: #eef4f4;
        --wui-color-bg-200: #eaf1f1;
        --wui-color-bg-225: #e5eded;
        --wui-color-bg-250: #e1e9e9;
        --wui-color-bg-275: #dce7e7;
        --wui-color-bg-300: #d8e3e3;
        --wui-color-bg-325: #f3f3f3;
        --wui-color-bg-350: #202020;

        --wui-color-success-base-100: #26b562;
        --wui-color-success-base-125: #30a46b;

        --wui-color-warning-base-100: #f3a13f;

        --wui-color-error-base-100: #f05142;
        --wui-color-error-base-125: #df4a34;

        --wui-color-blue-base-100: rgba(102, 125, 255, 1);
        --wui-color-blue-base-90: rgba(102, 125, 255, 0.9);

        --wui-color-success-glass-001: rgba(38, 181, 98, 0.01);
        --wui-color-success-glass-002: rgba(38, 181, 98, 0.02);
        --wui-color-success-glass-005: rgba(38, 181, 98, 0.05);
        --wui-color-success-glass-010: rgba(38, 181, 98, 0.1);
        --wui-color-success-glass-015: rgba(38, 181, 98, 0.15);
        --wui-color-success-glass-020: rgba(38, 181, 98, 0.2);
        --wui-color-success-glass-025: rgba(38, 181, 98, 0.25);
        --wui-color-success-glass-030: rgba(38, 181, 98, 0.3);
        --wui-color-success-glass-060: rgba(38, 181, 98, 0.6);
        --wui-color-success-glass-080: rgba(38, 181, 98, 0.8);

        --wui-color-success-glass-reown-020: rgba(48, 164, 107, 0.2);

        --wui-color-warning-glass-reown-020: rgba(243, 161, 63, 0.2);

        --wui-color-error-glass-001: rgba(240, 81, 66, 0.01);
        --wui-color-error-glass-002: rgba(240, 81, 66, 0.02);
        --wui-color-error-glass-005: rgba(240, 81, 66, 0.05);
        --wui-color-error-glass-010: rgba(240, 81, 66, 0.1);
        --wui-color-error-glass-015: rgba(240, 81, 66, 0.15);
        --wui-color-error-glass-020: rgba(240, 81, 66, 0.2);
        --wui-color-error-glass-025: rgba(240, 81, 66, 0.25);
        --wui-color-error-glass-030: rgba(240, 81, 66, 0.3);
        --wui-color-error-glass-060: rgba(240, 81, 66, 0.6);
        --wui-color-error-glass-080: rgba(240, 81, 66, 0.8);

        --wui-color-error-glass-reown-020: rgba(223, 74, 52, 0.2);

        --wui-icon-box-bg-error-base-100: #f4dfdd;
        --wui-icon-box-bg-blue-base-100: #d9ecfb;
        --wui-icon-box-bg-success-base-100: #daf0e4;
        --wui-icon-box-bg-inverse-base-100: #dcecfc;

        --wui-all-wallets-bg-100: #e8f1fa;

        --wui-avatar-border-base: #f3f4f4;

        --wui-thumbnail-border-base: #eaefef;

        --wui-wallet-button-bg-base: var(--wui-color-bg-125);

        --wui-color-gray-glass-001: rgba(0, 0, 0, 0.01);
        --wui-color-gray-glass-002: rgba(0, 0, 0, 0.02);
        --wui-color-gray-glass-005: rgba(0, 0, 0, 0.05);
        --wui-color-gray-glass-010: rgba(0, 0, 0, 0.1);
        --wui-color-gray-glass-015: rgba(0, 0, 0, 0.15);
        --wui-color-gray-glass-020: rgba(0, 0, 0, 0.2);
        --wui-color-gray-glass-025: rgba(0, 0, 0, 0.25);
        --wui-color-gray-glass-030: rgba(0, 0, 0, 0.3);
        --wui-color-gray-glass-060: rgba(0, 0, 0, 0.6);
        --wui-color-gray-glass-080: rgba(0, 0, 0, 0.8);
        --wui-color-gray-glass-090: rgba(0, 0, 0, 0.9);

        --wui-color-dark-glass-100: rgba(233, 233, 233, 1);

        --w3m-card-embedded-shadow-color: rgb(224 225 233 / 25%);
      }
    `}}var su=Me`
  *,
  *::after,
  *::before,
  :host {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-style: normal;
    text-rendering: optimizeSpeed;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-tap-highlight-color: transparent;
    font-family: var(--wui-font-family);
    backface-visibility: hidden;
  }
`,iu=Me`
  button,
  a {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    transition:
      color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      background-color var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border var(--wui-duration-lg) var(--wui-ease-out-power-1),
      border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1),
      box-shadow var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: background-color, color, border, box-shadow, border-radius;
    outline: none;
    border: none;
    column-gap: var(--wui-spacing-3xs);
    background-color: transparent;
    text-decoration: none;
  }

  wui-flex {
    transition: border-radius var(--wui-duration-lg) var(--wui-ease-out-power-1);
    will-change: border-radius;
  }

  button:disabled > wui-wallet-image,
  button:disabled > wui-all-wallets-image,
  button:disabled > wui-network-image,
  button:disabled > wui-image,
  button:disabled > wui-transaction-visual,
  button:disabled > wui-logo {
    filter: grayscale(1);
  }

  @media (hover: hover) and (pointer: fine) {
    button:hover:enabled {
      background-color: var(--wui-color-gray-glass-005);
    }

    button:active:enabled {
      background-color: var(--wui-color-gray-glass-010);
    }
  }

  button:disabled > wui-icon-box {
    opacity: 0.5;
  }

  input {
    border: none;
    outline: none;
    appearance: none;
  }
`,au=Me`
  .wui-color-inherit {
    color: var(--wui-color-inherit);
  }

  .wui-color-accent-100 {
    color: var(--wui-color-accent-100);
  }

  .wui-color-error-100 {
    color: var(--wui-color-error-100);
  }

  .wui-color-blue-100 {
    color: var(--wui-color-blue-100);
  }

  .wui-color-blue-90 {
    color: var(--wui-color-blue-90);
  }

  .wui-color-error-125 {
    color: var(--wui-color-error-125);
  }

  .wui-color-success-100 {
    color: var(--wui-color-success-100);
  }

  .wui-color-success-125 {
    color: var(--wui-color-success-125);
  }

  .wui-color-inverse-100 {
    color: var(--wui-color-inverse-100);
  }

  .wui-color-inverse-000 {
    color: var(--wui-color-inverse-000);
  }

  .wui-color-fg-100 {
    color: var(--wui-color-fg-100);
  }

  .wui-color-fg-200 {
    color: var(--wui-color-fg-200);
  }

  .wui-color-fg-300 {
    color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    color: var(--wui-color-fg-350);
  }

  .wui-bg-color-inherit {
    background-color: var(--wui-color-inherit);
  }

  .wui-bg-color-blue-100 {
    background-color: var(--wui-color-accent-100);
  }

  .wui-bg-color-error-100 {
    background-color: var(--wui-color-error-100);
  }

  .wui-bg-color-error-125 {
    background-color: var(--wui-color-error-125);
  }

  .wui-bg-color-success-100 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-success-125 {
    background-color: var(--wui-color-success-100);
  }

  .wui-bg-color-inverse-100 {
    background-color: var(--wui-color-inverse-100);
  }

  .wui-bg-color-inverse-000 {
    background-color: var(--wui-color-inverse-000);
  }

  .wui-bg-color-fg-100 {
    background-color: var(--wui-color-fg-100);
  }

  .wui-bg-color-fg-200 {
    background-color: var(--wui-color-fg-200);
  }

  .wui-bg-color-fg-300 {
    background-color: var(--wui-color-fg-300);
  }

  .wui-color-fg-325 {
    background-color: var(--wui-color-fg-325);
  }

  .wui-color-fg-350 {
    background-color: var(--wui-color-fg-350);
  }
`;var Pr={getSpacingStyles(e,t){if(Array.isArray(e))return e[t]?`var(--wui-spacing-${e[t]})`:void 0;if(typeof e=="string")return`var(--wui-spacing-${e})`},getFormattedDate(e){return new Intl.DateTimeFormat("en-US",{month:"short",day:"numeric"}).format(e)},getHostName(e){try{return new URL(e).hostname}catch{return""}},getTruncateString({string:e,charsStart:t,charsEnd:r,truncate:o}){return e.length<=t+r?e:o==="end"?`${e.substring(0,t)}...`:o==="start"?`...${e.substring(e.length-r)}`:`${e.substring(0,Math.floor(t))}...${e.substring(e.length-Math.floor(r))}`},generateAvatarColors(e){let r=e.toLowerCase().replace(/^0x/iu,"").replace(/[^a-f0-9]/gu,"").substring(0,6).padEnd(6,"0"),o=this.hexToRgb(r),n=getComputedStyle(document.documentElement).getPropertyValue("--w3m-border-radius-master"),c=100-3*Number(n?.replace("px","")),a=`${c}% ${c}% at 65% 40%`,p=[];for(let i=0;i<5;i+=1){let f=this.tintColor(o,.15*i);p.push(`rgb(${f[0]}, ${f[1]}, ${f[2]})`)}return`
    --local-color-1: ${p[0]};
    --local-color-2: ${p[1]};
    --local-color-3: ${p[2]};
    --local-color-4: ${p[3]};
    --local-color-5: ${p[4]};
    --local-radial-circle: ${a}
   `},hexToRgb(e){let t=parseInt(e,16),r=t>>16&255,o=t>>8&255,n=t&255;return[r,o,n]},tintColor(e,t){let[r,o,n]=e,s=Math.round(r+(255-r)*t),c=Math.round(o+(255-o)*t),a=Math.round(n+(255-n)*t);return[s,c,a]},isNumber(e){return{number:/^[0-9]+$/u}.number.test(e)},getColorTheme(e){return e||(typeof window<"u"&&window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)")?.matches?"dark":"light":"dark")},splitBalance(e){let t=e.split(".");return t.length===2?[t[0],t[1]]:["0","00"]},roundNumber(e,t,r){return e.toString().length>=t?Number(e).toFixed(r):e},formatNumberToLocalString(e,t=2){return e===void 0?"0.00":typeof e=="number"?e.toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t}):parseFloat(e).toLocaleString("en-US",{maximumFractionDigits:t,minimumFractionDigits:t})}};function Eo(e,t){let{kind:r,elements:o}=t;return{kind:r,elements:o,finisher(n){customElements.get(e)||customElements.define(e,n)}}}function bo(e,t){return customElements.get(e)||customElements.define(e,t),t}function vo(e){return function(r){return typeof r=="function"?bo(e,r):Eo(e,r)}}var Au={ACCOUNT_TABS:[{label:"Tokens"},{label:"NFTs"},{label:"Activity"}],SECURE_SITE_ORIGIN:(typeof process<"u"&&typeof process.env<"u"?process.env.NEXT_PUBLIC_SECURE_SITE_ORIGIN:void 0)||"https://secure.walletconnect.org",VIEW_DIRECTION:{Next:"next",Prev:"prev"},DEFAULT_CONNECT_METHOD_ORDER:["email","social","wallet"],ANIMATION_DURATIONS:{HeaderText:120,ModalHeight:150,ViewTransition:150}};export{Wt as a,K as b,$r as c,y as d,z as e,Ce as f,q as g,ee as h,w as i,N as j,se as k,Gt as l,P as m,Yt as n,F as o,T as p,B as q,Re as r,V as s,Q as t,ze as u,X as v,ye as w,io as x,lo as y,l as z,C as A,D as B,te as C,fo as D,go as E,Au as F,wo as G,xr as H,Co as I,su as J,iu as K,au as L,Pr as M,vo as N};
