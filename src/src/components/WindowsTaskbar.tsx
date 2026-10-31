import { useEffect, useState } from 'react'
import { BatteryFull, ChevronUp, Folder, Gamepad2, Globe, LayoutGrid, Search, Settings, Volume2, Wifi } from 'lucide-react'

type Props = { onStart: () => void; onSearch: () => void; onOpen: (app: string) => void; active: string[]; onQuick: () => void }
function formatClock(date: Date) {
  return { time: date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }), day: date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' }) }
}
export default function WindowsTaskbar({ onStart, onSearch, onOpen, active, onQuick }: Props) {
  const [now, setNow] = useState(new Date())
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer) }, [])
  const { time, day } = formatClock(now)
  const pins = [
    { label: 'Search', icon: Search, action: onSearch }, { label: 'Edge', icon: Globe, action: () => onOpen('edge') },
    { label: 'File Explorer', icon: Folder, action: () => onOpen('files') }, { label: 'Steam', icon: Gamepad2, action: () => onOpen('steam') },
    { label: 'Settings', icon: Settings, action: () => onOpen('settings') },
  ]
  return <footer className="taskbar">
    <div className="taskbar-left"><button className="task-icon windows-logo" title="Start" onClick={onStart}><svg viewBox="0 0 24 24"><path d="M2 3.5 10.5 2v9H2zm10 8V1.7L22 0v11.5zM2 13h8.5v9L2 20.5zm10 0H22V24l-10-1.7z" /></svg></button>
      <button className="task-search" onClick={onSearch}><Search size={17}/><span>Search</span></button>
      {pins.slice(1).map(({label,icon:Icon,action}) => <button key={label} className={`task-icon ${active.includes(label.toLowerCase()) ? 'task-active' : ''}`} title={label} onClick={action}><Icon size={19}/></button>)}
    </div>
    <div className="taskbar-tray"><button className="tray-chevron" onClick={onQuick} title="Hidden icons"><ChevronUp size={15}/></button><button className="tray-status" onClick={onQuick} title="Network, volume and battery"><Wifi size={16}/><Volume2 size={16}/><BatteryFull size={17}/></button><button className="clock" onClick={onQuick}><span>{time}</span><span>{day}</span></button><button className="show-desktop" title="Show desktop" onClick={() => window.dispatchEvent(new Event('desktop:show'))}/></div>
  </footer>
}