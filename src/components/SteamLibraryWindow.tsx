import { useMemo, useState } from 'react'
import { Search, Settings, Grid3X3, List, Play, Download, ChevronDown, Home, Users, Store, Gamepad2 } from 'lucide-react'
import { FAVORITE_GAMES, RECENT_GAMES, TOP_GAMES, UNCATEGORIZED_GAMES } from '../lib/libraryData'

type Props = { onOpenProfile: () => void; onClose: () => void }
const gameIcon = (title: string) => {
  const icons: Record<string,string> = { 'Brick Rigs':'🧱','BeamNG.drive':'🚙','My Summer Car':'🔧',"Garry's Mod":'🧰','Twisted':'🌪️','Stormworks':'🚢','Forza Horizon 5':'🏎️','Microsoft Flight Simulator (2020)':'✈️' }
  return icons[title] || '🎮'
}
export default function SteamLibraryWindow({ onOpenProfile, onClose }: Props) {
  const [selected, setSelected] = useState('Brick Rigs')
  const [query, setQuery] = useState('')
  const [tab, setTab] = useState('All')
  const [notice, setNotice] = useState('')
  const all = useMemo(() => {
    const titles = [...new Set([...FAVORITE_GAMES.map(g=>g.title), ...TOP_GAMES.map(g=>g.title), ...RECENT_GAMES.map(g=>g.title), ...UNCATEGORIZED_GAMES.map(g=>g.title), 'Twisted','Stormworks'])]
    return titles.filter(t => t.toLowerCase().includes(query.toLowerCase()) && (tab !== 'Favorites' || FAVORITE_GAMES.some(g=>g.title===t)))
  }, [query,tab])
  const select = (title:string) => { setSelected(title); setNotice('') }
  return <div className="steam-shell">
    <aside className="steam-sidebar">
      <div className="steam-brand"><span className="steam-mark">◉</span><b>STEAM</b><span className="steam-small">DEMO</span></div>
      <div className="steam-nav"><button className="steam-nav-active"><Home size={16}/> Home</button><button onClick={()=>setNotice('Store preview selected. This demo does not connect to Steam.') }><Store size={16}/> Store</button><button onClick={onOpenProfile}><Users size={16}/> Community</button><button className="steam-nav-active"><Gamepad2 size={16}/> Library</button></div>
      <div className="steam-side-label">COLLECTION <button title="Collection options" onClick={()=>setNotice('Collection options are available in this demo.')}>＋</button></div>
      <button className="steam-collection" onClick={()=>setTab('All')}>▣ All Games <small>{all.length}</small></button><button className="steam-collection" onClick={()=>setTab('Favorites')}>★ Favorites <small>{FAVORITE_GAMES.length}</small></button>
      <div className="steam-side-label">TOOLS</div><button className="steam-collection" onClick={()=>setNotice('Downloads: no real downloads are connected.')}>↓ Downloads</button>
      <div className="steam-user"><div className="steam-user-avatar">P</div><span>Player<small>Online</small></span><button onClick={onOpenProfile}>⋯</button></div>
    </aside>
    <section className="steam-main">
      <div className="steam-top"><div className="steam-breadcrumb">LIBRARY <span>›</span> HOME</div><div className="steam-top-actions"><button onClick={onOpenProfile}>Profile ↗</button><button onClick={()=>setNotice('Steam settings demo')}><Settings size={16}/></button><button onClick={onClose}>—</button></div></div>
      <div className="steam-toolbar"><div className="steam-tabs"><button className="steam-tab-active">Home</button><button onClick={()=>setTab('All')}>Collections</button></div><div className="steam-search"><Search size={15}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search games"/></div><button className="steam-tool-btn" onClick={()=>setNotice('Grid view selected')}><Grid3X3 size={17}/></button><button className="steam-tool-btn" onClick={()=>setNotice('List view selected')}><List size={17}/></button></div>
      <div className="steam-content">
        <div className="steam-welcome"><div><p className="steam-eyebrow">YOUR COLLECTION</p><h1>Games</h1><p>Pick a game from your library to view its details.</p></div><div className="steam-avatar">🎮</div></div>
        <div className="steam-library-layout"><div className="steam-game-list"><div className="steam-list-heading">GAMES <span>{all.length}</span><ChevronDown size={14}/></div>{all.map(title=><button key={title} className={`steam-game-row ${selected===title?'chosen':''}`} onClick={()=>select(title)}><span className="steam-game-icon">{gameIcon(title)}</span><span className="steam-game-name"><b>{title}</b><small>{FAVORITE_GAMES.some(g=>g.title===title)?'In library':'Collection entry'}</small></span>{title==='BeamNG.drive'&&<span className="steam-update-dot"/>}</button>)}{all.length===0&&<p className="steam-no-games">No games found.</p>}</div>
          <div className="steam-detail"><div className="steam-hero-art" style={{background:`linear-gradient(125deg, ${TOP_GAMES.find(g=>g.title.toLowerCase()===selected.toLowerCase())?.from||'#203c57'}, ${TOP_GAMES.find(g=>g.title.toLowerCase()===selected.toLowerCase())?.to||'#172333'})`}}><span>{gameIcon(selected)}</span><div className="hero-shade"/><b>{selected}</b></div><div className="steam-game-info"><p className="steam-eyebrow">IN YOUR LIBRARY</p><h2>{selected}</h2><p className="steam-description">{selected==='Twisted'?'Storm chasing · Roblox — a community game entry for tracking severe weather and intercepting storms.':`${selected} is listed in this simulated game library. This preview does not check whether it is installed on your PC.`}</p><div className="steam-actions"><button className="steam-play" onClick={()=>setNotice(`${selected}: demo selected. Real games cannot be launched from a browser.`)}><Play size={16} fill="currentColor"/> Play</button><button className="steam-secondary" onClick={()=>setNotice(`${selected} is not connected to a real Steam installation.`)}><Download size={16}/> Install</button><button className="steam-secondary" onClick={()=>setNotice('More options opened for '+selected)}>⋯</button></div><div className="steam-meta"><span>STATUS</span><b>Library entry · Demo mode</b><span>LAST PLAYED</span><b>Not available</b></div>{notice&&<div className="steam-notice">{notice}</div>}</div></div></div>
      </div>
      <div className="steam-bottom"><span>Library · {all.length} games</span><span>Steam-inspired desktop simulation</span></div>
    </section>
  </div>
}