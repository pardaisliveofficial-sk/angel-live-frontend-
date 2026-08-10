/* Angel Live standalone runtime bridge. AppDeploy auth is used on web; APK uses native Firebase/Google auth. */
type User = { userId: string; email?: string; name?: string; picture?: string; scope?: string; [key:string]: unknown };
type ApiResponse = { data: any };
type ApiClient = { get(url:string,data?:any):Promise<ApiResponse>; post(url:string,data?:any):Promise<ApiResponse>; put(url:string,data?:any):Promise<ApiResponse>; delete(url:string,data?:any):Promise<ApiResponse> };
type AuthClient = { signIn(options?:{scope?:string}):Promise<{user:User;accessToken?:string;expiresIn?:number}>; getUser():Promise<User|null>; getAccessToken():Promise<string|null>; signOut():Promise<void>; isSignedIn():boolean };
type RuntimeGlobals = typeof globalThis & { api?:ApiClient; auth?:AuthClient; __APPDEPLOY__?:{api?:ApiClient;auth?:AuthClient}; __angelNativeGoogleAuth?: (resolveId:string)=>void; };
const runtime=globalThis as RuntimeGlobals;
const injectedApi=runtime.api??runtime.__APPDEPLOY__?.api;
const injectedAuth=runtime.auth??runtime.__APPDEPLOY__?.auth;
const API_BASE='https://app.angellive.soulverseapps.com';
async function request(method:string,path:string,body?:unknown):Promise<ApiResponse>{const token=localStorage.getItem('angel_live_access_token');const headers:Record<string,string>={Accept:'application/json'};if(body!==undefined)headers['Content-Type']='application/json';if(token)headers.Authorization=`Bearer ${token}`;const response=await fetch(`${API_BASE}${path}`,{method,headers,credentials:'include',body:body===undefined?undefined:JSON.stringify(body)});const text=await response.text();let data:any=null;try{data=text?JSON.parse(text):null}catch{data=text}if(!response.ok)throw new Error(data?.message||data?.error||`Request failed (${response.status})`);return{data}}
const fallbackApi:ApiClient={get:(u,d)=>request('GET',u,d),post:(u,d)=>request('POST',u,d),put:(u,d)=>request('PUT',u,d),delete:(u,d)=>request('DELETE',u,d)};
type NativeResult={ok:boolean;user?:User;accessToken?:string;error?:string};
let nativeSeq=0;const nativePending=new Map<string,(r:NativeResult)=>void>();
(runtime as any).__angelNativeGoogleAuth=(id:string)=>{try{const raw=JSON.parse(atob(id));const resolve=nativePending.get(resolveIdFrom(raw));if(resolve){nativePending.delete(resolveIdFrom(raw));resolve(raw)}}catch{}};
function resolveIdFrom(raw:any){return raw.callbackId as string}
function nativeGoogleSignIn():Promise<NativeResult>{const bridge=(runtime as any).AndroidGoogleAuth;if(!bridge?.signIn)return Promise.reject(Object.assign(new Error('Native Google authentication is not available.'),{code:'auth_bridge_unavailable'}));const callbackId=`angel-google-${Date.now()}-${++nativeSeq}`;return new Promise((resolve,reject)=>{nativePending.set(callbackId,resolve);try{bridge.signIn(callbackId)}catch(e){nativePending.delete(callbackId);reject(e)}})}
const fallbackAuth:AuthClient={isSignedIn:()=>Boolean(localStorage.getItem('angel_live_access_token')),getAccessToken:async()=>localStorage.getItem('angel_live_access_token'),getUser:async()=>{const raw=localStorage.getItem('angel_live_user');return raw?JSON.parse(raw):null},signOut:async()=>{localStorage.removeItem('angel_live_access_token');localStorage.removeItem('angel_live_user')},signIn:async()=>{const result=await nativeGoogleSignIn();if(!result.ok||!result.user||!result.accessToken)throw Object.assign(new Error(result.error||'Google authentication failed.'),{code:'native_auth_failed'});localStorage.setItem('angel_live_access_token',result.accessToken);localStorage.setItem('angel_live_user',JSON.stringify(result.user));return{user:result.user,accessToken:result.accessToken}}};
export const api:ApiClient=injectedApi??fallbackApi;export const auth:AuthClient=injectedAuth??fallbackAuth;
