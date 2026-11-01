import { useState } from "react";

type Game = {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  status: string;
};

const games: Game[] = [
  { title: "Twisted", subtitle: "Storm chasing · Roblox", icon: "🌪️", description: "A storm-chasing experience focused on tracking severe weather, intercepting storms, and learning how dangerous weather systems evolve.", status: "Community game · Launch externally" },
  { title: "BeamNG.drive", subtitle: "Vehicle simulation", icon: "🚙", description: "A vehicle simulation concept entry. This mock library does not verify installation or launch the real game.", status: "Library entry · Not launched" },
  { title: "Brick Rigs", subtitle: "Building · Vehicle sandbox", icon: "🧱", description: "A sandbox game entry for building vehicles and testing creations in physics-based environments.", status: "Library entry · Not launched" },
  { title: "Stormworks", subtitle: "Engineering · Simulation", icon: "🚢", description: "A creative engineering and rescue simulation library entry.", status: "Library entry · Not launched" },
  { title: "My Summer Car", subtitle: "Vehicle · Life simulation", icon: "🔧", description: "A vehicle-building and life simulation library entry.", status: "Library entry · Not launched" },
];

export default function SteamLibraryWindow({ onOpenProfile }: { onOpenProfile: () => void }) {
  const [selected, setSelected] = useState<Game | null>(null);
  return (
    <div className="steam-shell">
      <aside className="steam-sidebar">
        <div className="steam-brand">◉ <b>game library</b></div>
        <button className="steam-side-active">▣ Library</button>
        <button onClick={onOpenProfile}>👤 Community Profile</button>
        <div className="steam-side-label">COLLECTION</div>
        <span>All Games <small>{games.length}</small></span>
        <span>Favorites</span>
      </aside>
      <section className="steam-main">
        <div className="steam-top"><span>LIBRARY</span><button onClick={onOpenProfile}>Profile ↗</button></div>
        <div className="steam-welcome"><div><p className="steam-eyebrow">YOUR COLLECTION</p><h1>Games</h1><p>Select a title to view its library page.</p></div><div className="steam-avatar">🎮</div></div>
        <div className="steam-layout">
          <div className="steam-game-list">{games.map(game => <button key={game.title} className={`steam-game-row ${selected?.title === game.title ? "chosen" : ""}`} onClick={() => setSelected(game)}><span>{game.icon}</span><span><b>{game.title}</b><small>{game.subtitle}</small></span></button>)}</div>
          <div className="steam-detail">
            {selected ? <><div className="game-art">{selected.icon}</div><p className="steam-eyebrow">LIBRARY</p><h2>{selected.title}</h2><p>{selected.description}</p><div className="game-status">{selected.status}</div><button className="launch-placeholder" onClick={() => alert("This is a desktop mockup. It does not launch or verify installed games.")}>▶ Launch (demo)</button></> : <div className="steam-empty"><span>🎮</span><h2>Choose a game</h2><p>Your selected game's information will appear here.</p></div>}
          </div>
        </div>
      </section>
    </div>
  );
}
