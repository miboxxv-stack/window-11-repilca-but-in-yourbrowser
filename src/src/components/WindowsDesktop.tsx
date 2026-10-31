import { useEffect, useState } from 'react'
import { BatteryFull, Bluetooth, ChevronRight, Cloud, Moon, Plane, Search, Settings, Sun, Volume2, Wifi, X } from 'lucide-react'
type Props = { onClose: () => void }
export default function WindowsDesktop({onClose}:Props) {
  const [wifi,setWifi]=useState(true); const [bluetooth,setBluetooth]=useState(false); const [brightness,setBrightness]=useState(80); const [volume,setVolume]=useState(65)
  return <div className="quick-panel">
    <div className="quick-grid">
      <button className={wifi?'quick-tile selected':''} onClick={()=>setWifi(!wifi)}><Wifi/><span>Wi-Fi</span><small>{wifi?'Connected':'Off'}</small></button>
      <button className={bluetooth?'quick-tile selected':''} onClick={()=>setBluetooth(!bluetooth)}><Bluetooth/><span>Bluetooth</span><small>{bluetooth?'On':'Off'}</small></button>
      <button className="quick-tile" onClick={()=>{}}><Plane/><span>Airplane mode</span><small>Off</small></button>
      <button className="quick-tile" onClick={()=>{}}><BatteryFull/><span>Battery saver</span><small>Off</small></button>
      <button className="quick-tile" onClick={()=>{}}><Moon/><span>Focus</span><small>Off</small></button>
      <button className="quick-tile" onClick={()=>{}}><Cloud/><span>Nearby sharing</span><small>Ready</small></button>
    </div>
    <div className="quick-slider"><Sun size={17}/><input aria-label="Brightness" type="range" min="0" max="100" value={brightness} onChange={e=>setBrightness(+e.target.value)}/></div>
    <div className="quick-slider"><Volume2 size={17}/><input aria-label="Volume" type="range" min="0" max="100" value={volume} onChange={e=>setVolume(+e.target.value)}/></div>
    <div className="quick-footer"><span><BatteryFull size={16}/> 100%</span><button onClick={onClose}><Settings size={17}/> Settings</button><button onClick={onClose}><X size={17}/></button></div>
  </div>
}