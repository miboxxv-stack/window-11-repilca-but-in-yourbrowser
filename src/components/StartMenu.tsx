import { useMemo, useState } from 'react'
import { Search, Power, UserCircle, ChevronRight, Globe, Folder, Gamepad2, Settings, Calculator, FileText, Store, Image } from 'lucide-react'
type Props={onOpen:(app:string)=>void; onSearch:(q:string)=>void}
const apps=[['Edge','edge',Globe],['File Explorer','files',Folder],['Steam','steam',Gamepad2],['Settings','settings',Settings],['Calculator','calculator',Calculator],['Notepad','notepad',FileText],['Microsoft Store','store',Store],['Photos','photos',Image]] as const
export default function StartMenu({onOpen,onSearch}:Props){
 const [query,setQuery]=useState('')
 const matches=useMemo(()=>apps.filter(a=>a[0].toLowerCase().includes(query.toLowerCase())),[query])
 return <div className="start-menu"><div className="start-search"><Search size={17}/><input value={query} onChange={e=>{setQuery(e.target.value);onSearch(e.target.value)}} placeholder="Type here to search"/></div>
 <div className="start-section-head"><b>{query?'Search results':'Pinned'}</b><button onClick={()=>setQuery('')}>All apps <ChevronRight size={14}/></button></div>
 <div className="pinned-grid">{matches.map(([label,id,Icon])=><button key={id} onClick={()=>onOpen(id)}><span className={`app-icon app-${id}`}><Icon size={21}/></span><small>{label}</small></button>)}</div>
 <div className="start-section-head recommended-head"><b>Recommended</b><button onClick={()=>onOpen('files')}>More <ChevronRight size={14}/></button></div>
 <div className="recommended-list"><button onClick={()=>onOpen('steam')}><span className="recommended-icon">🎮</span><span><b>Steam Library</b><small>Recently opened</small></span><small>Today</small></button><button onClick={()=>onOpen('notepad')}><span className="recommended-icon">📝</span><span><b>Notes.txt</b><small>Notepad</small></span><small>Today</small></button></div>
 <div className="start-profile"><button><UserCircle size={22}/> Player</button><button title="Power options" onClick={()=>onOpen('power')}><Power size={19}/></button></div></div>
}