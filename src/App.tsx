import { useEffect, useState } from 'react'
import { CloudSun, Search, Bell, ChevronUp, X } from 'lucide-react'
import WindowsTaskbar from './components/WindowsTaskbar'
import StartMenu from './components/StartMenu'
import AppWindow from './components/AppWindow'
import WindowsDesktop from './components/WindowsDesktop'

type Win={id:string; app:string; minimized:boolean; maximized:boolean}
const desktopApps=[['Edge','edge','🌐'],['File Explorer','files','📁'],['Steam','steam','◉'],['Recycle Bin','recycle','🗑️']] as const
export default function App(){
 const [windows,setWindows]=useState<Win[]>([])
 const [start,setStart]=useState(false); const [search,setSearch]=useState(false); const [searchQuery,setSearchQuery]=useState('')
 const [quick,setQuick]=useState(false); const [notifications,setNotifications]=useState(false)
 const [wallpaper,setWallpaper]=useState(0)
 const openApp=(app:string)=>{if(app==='power'){setNotifications(true);return} if(app==='recycle'){openApp('files');return} setWindows(old=>{const existing=old.find(w=>w.app===app);if(existing)return old.map(w=>w.app===app?{...w,minimized:false}:w);return [...old,{id:app+'-'+Date.now(),app,minimized:false,maximized:app==='steam'}]});setStart(false);setSearch(false);setQuick(false)}
 const close=(id:string)=>setWindows(old=>old.filter(w=>w.id!==id))
 const update=(id:string,patch:Partial<Win>)=>setWindows(old=>old.map(w=>w.id===id?{...w,...patch}:w))
 useEffect(()=>{const handler=()=>setWindows(old=>old.map(w=>({...w,minimized:true})));window.addEventListener('desktop:show',handler);return()=>window.removeEventListener('desktop:show',handler)},[])
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(e.key==='Escape'){setStart(false);setSearch(false);setQuick(false);setNotifications(false)} if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='e'){e.preventDefault();openApp('files')} if(e.key==='Meta'){setStart(true)}};window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key)},[])
 const active=windows.filter(w=>!w.minimized).map(w=>w.app)
 return <main className={`desktop wallpaper-${wallpaper}`} onClick={()=>{}}>
  <div className="desktop-top"><div className="weather-chip"><CloudSun size={17}/><span>18°</span><small>Mostly sunny</small></div><div className="desktop-top-right"><button onClick={()=>setWallpaper((wallpaper+1)%3)} title="Change wallpaper">Change wallpaper</button></div></div>
  <div className="desktop-icons">{desktopApps.map(([label,id,emoji])=><button key={id} onDoubleClick={()=>openApp(id)} onClick={()=>{if(id==='recycle')openApp('files')}}><span className="desktop-app-icon">{emoji}</span><small>{label}</small></button>)}</div>
  {windows.filter(w=>!w.minimized).map(w=><AppWindow key={w.id} app={w.app} onClose={()=>close(w.id)} onMinimize={()=>update(w.id,{minimized:true})} onMaximize={()=>update(w.id,{maximized:!w.maximized})} maximized={w.maximized} onOpen={openApp}/>)}
  {start&&<StartMenu onOpen={openApp} onSearch={q=>{setSearchQuery(q);setSearch(!!q)}}/>}
  {search&&<div className="search-panel"><div className="search-panel-top"><Search size={18}/><input autoFocus value={searchQuery} onChange={e=>setSearchQuery(e.target.value)} placeholder="Search for apps, settings, and documents"/><button onClick={()=>setSearch(false)}><X size={17}/></button></div><p>Best match</p>{['Edge','File Explorer','Steam','Settings','Calculator','Notepad'].filter(x=>x.toLowerCase().includes(searchQuery.toLowerCase())).map((x,i)=><button key={x} onClick={()=>openApp(x==='File Explorer'?'files':x.toLowerCase())}><span>{['🌐','📁','◉','⚙️','🧮','📝'][i]}</span>{x}<small>App</small></button>)}</div>}
  {quick&&<WindowsDesktop onClose={()=>setQuick(false)}/>}
  {notifications&&<div className="notification-panel"><div><b>Notification center</b><button onClick={()=>setNotifications(false)}><X size={17}/></button></div><p className="notification-date">Saturday, October 31</p><div className="notification-card"><b>You're all caught up</b><p>New notifications will appear here.</p></div><button className="notification-settings" onClick={()=>{setNotifications(false);openApp('settings')}}>Manage notifications</button></div>}
  <WindowsTaskbar onStart={()=>{setStart(v=>!v);setSearch(false);setQuick(false)}} onSearch={()=>{setSearch(v=>!v);setStart(false)}} onOpen={openApp} active={active} onQuick={()=>{setQuick(v=>!v);setStart(false)}}/>
  <button className="notification-trigger" onClick={()=>setNotifications(v=>!v)} title="Notifications"><Bell size={15}/></button>
 </main>
}