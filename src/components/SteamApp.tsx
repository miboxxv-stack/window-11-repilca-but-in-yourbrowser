import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  Check,
  ChevronDown,
  Download,
  Gamepad2,
  Heart,
  Home,
  MessageCircle,
  Minus,
  Package,
  Play,
  Search,
  ShoppingCart,
  Store,
  Trash2,
  Users,
  X,
} from 'lucide-react';

import BrickRigsGame from '@/components/win11/apps/BrickRigsGame';
import BrickRigsWorkshop from '@/components/win11/apps/BrickRigsWorkshop';
import StormDashGame from '@/components/win11/apps/StormDashGame';
import CobaltExplorerGame from '@/components/win11/apps/CobaltExplorerGame';
import CarMechanicGame from '@/components/win11/apps/CarMechanicGame';

import SteamLibraryView from '@/components/win11/apps/steam/SteamLibraryView';
import SteamStoreView, {
  type SteamStorePage,
} from '@/components/win11/apps/steam/SteamStoreView';

import {
  BRICK_RIGS_ID,
  CAR_MECHANIC_ID,
  COBALT_EXPLORER_ID,
  LIBRARY_GAMES,
  STORE_GAMES,
  STORM_DASH_ID,
  type GameState,
} from '@/components/win11/apps/steam/steamData';

type MainTab = 'store' | 'library' | 'community' | 'downloads' | 'cart';

function initialStates(): Record<string, GameState> {
  return Object.fromEntries(
    LIBRARY_GAMES.map((game) => [
      game.id,
      {
        status: game.id === CAR_MECHANIC_ID ? 'installed' : 'not-installed',
        progress: game.id === CAR_MECHANIC_ID ? 100 : 0,
        playSeconds: 0,
      },
    ])
  );
}

export default function SteamApp() {
  const [tab, setTab] = useState<MainTab>('store');
  const [storePage, setStorePage] = useState<SteamStorePage>('store');

  const [states, setStates] = useState<Record<string, GameState>>(
    initialStates
  );

  const [selectedId, setSelectedId] = useState(LIBRARY_GAMES[0].id);
  const [activeGame, setActiveGame] = useState<string | null>(null);
  const [workshopOpen, setWorkshopOpen] = useState(false);

  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [cart, setCart] = useState<string[]>([]);

  const [notification, setNotification] = useState('');

  const patch = (id: string, change: Partial<GameState>) => {
    setStates((previous) => ({
      ...previous,
      [id]: {
        ...previous[id],
        ...change,
      },
    }));
  };

  // Download simulation
  useEffect(() => {
    const timer = window.setInterval(() => {
      setStates((previous) => {
        let changed = false;
        const next = { ...previous };

        for (const [id, state] of Object.entries(previous)) {
          if (state.status !== 'downloading') continue;

          const progress = Math.min(100, state.progress + 2);

          next[id] = {
            ...state,
            progress,
            status: progress >= 100 ? 'installed' : 'downloading',
          };

          changed = true;
        }

        return changed ? next : previous;
      });
    }, 400);

    return () => window.clearInterval(timer);
  }, []);

  // Playtime simulation
  useEffect(() => {
    const timer = window.setInterval(() => {
      setStates((previous) => {
        let changed = false;
        const next = { ...previous };

        for (const [id, state] of Object.entries(previous)) {
          if (state.status !== 'running') continue;

          next[id] = {
            ...state,
            playSeconds: state.playSeconds + 1,
          };

          changed = true;
        }

        return changed ? next : previous;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const showNotification = (message: string) => {
    setNotification(message);
    window.setTimeout(() => setNotification(''), 2500);
  };

  const handlePlay = (id: string) => {
    patch(id, { status: 'running' });
    setActiveGame(id);
  };

  const exitGame = () => {
    if (activeGame) {
      patch(activeGame, { status: 'installed' });
    }

    setActiveGame(null);
  };

  const addToCart = (id: string) => {
    if (cart.includes(id)) return;

    setCart((previous) => [...previous, id]);
    showNotification('Added to your cart');
  };

  const removeFromCart = (id: string) => {
    setCart((previous) => previous.filter((item) => item !== id));
  };

  const toggleWishlist = (id: string) => {
    const exists = wishlistIds.includes(id);

    setWishlistIds((previous) =>
      exists
        ? previous.filter((item) => item !== id)
        : [...previous, id]
    );

    showNotification(
      exists ? 'Removed from your wishlist' : 'Added to your wishlist'
    );
  };

  const cartGames = STORE_GAMES.filter((game) => cart.includes(game.id));

  const downloadingGames = LIBRARY_GAMES.filter(
    (game) => states[game.id]?.status === 'downloading'
  );

  const installedCount = Object.values(states).filter(
    (state) => state.status === 'installed' || state.status === 'running'
  ).length;

  const totalProgress =
    downloadingGames.length > 0
      ? Math.round(
          downloadingGames.reduce(
            (total, game) => total + states[game.id].progress,
            0
          ) / downloadingGames.length
        )
      : 0;

  // Individual game screens
  if (activeGame === STORM_DASH_ID) {
    return <StormDashGame onExit={exitGame} />;
  }

  if (activeGame === BRICK_RIGS_ID) {
    return <BrickRigsGame onExit={exitGame} />;
  }

  if (activeGame === COBALT_EXPLORER_ID) {
    return <CobaltExplorerGame onExit={exitGame} />;
  }

  if (activeGame === CAR_MECHANIC_ID) {
    return <CarMechanicGame onExit={exitGame} />;
  }

  if (activeGame) {
    const game = LIBRARY_GAMES.find((item) => item.id === activeGame);

    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#101923] p-8 text-center text-white">
        <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-blue-950 text-5xl">
          <Gamepad2 size={48} />
        </div>

        <p className="mb-2 text-xs font-bold uppercase tracking-[0.3em] text-sky-400">
          WeatherWise Steam
        </p>

        <h1 className="text-3xl font-bold">
          {game?.title ?? 'Game'}
        </h1>

        <p className="mt-3 max-w-md text-sm text-slate-400">
          This game is a library demo entry. Its real executable is not
          connected to this desktop simulator.
        </p>

        <div className="mt-6 flex items-center gap-2 rounded-lg bg-emerald-500/10 px-4 py-2 text-sm text-emerald-400">
          <Check size={16} />
          Demo session running
        </div>

        <button
          type="button"
          onClick={exitGame}
          className="mt-8 rounded-lg bg-[#1a9fff] px-6 py-3 text-sm font-bold text-white hover:bg-sky-500"
        >
          Exit game
        </button>
      </div>
    );
  }

  if (workshopOpen) {
    return (
      <BrickRigsWorkshop onBack={() => setWorkshopOpen(false)} />
    );
  }

  return (
    <div className="flex h-full min-h-0 flex-col overflow-hidden bg-[#1b2838] font-sans text-[#c6d4df]">

      {/* Top application menu */}
      <header className="flex h-10 shrink-0 items-center justify-between bg-[#171a21] px-4">
        <div className="flex items-center gap-4">
          <Gamepad2 size={19} className="text-[#66c0f4]" />

          <span className="text-sm font-bold text-white">Steam</span>

          {['View', 'Friends', 'Games', 'Help'].map((item) => (
            <button
              key={item}
              type="button"
              className="hidden text-xs text-[#c6d4df] hover:text-white sm:block"
            >
              {item}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            title="Notifications"
            className="text-[#8f98a0] hover:text-white"
          >
            <Bell size={17} />
          </button>

          <button
            type="button"
            className="flex items-center gap-2 rounded-sm bg-[#2a3f5a] px-2 py-1 text-xs text-white hover:bg-[#36536f]"
          >
            <span className="h-5 w-5 rounded-sm bg-gradient-to-br from-sky-400 to-slate-700" />
            TIV2 2020 CHASECON
            <ChevronDown size={13} />
          </button>
        </div>
      </header>

      {/* Main navigation */}
      <nav className="flex shrink-0 items-center gap-1 bg-[#171a21] px-3 sm:gap-3 sm:px-5">
        {([
          ['store', 'STORE', Store],
          ['library', 'LIBRARY', Gamepad2],
          ['community', 'COMMUNITY', Users],
          ['downloads', 'DOWNLOADS', Download],
        ] as const).map(([id, label, Icon]) => {
          const active = tab === id;

          return (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex items-center gap-2 border-b-2 px-2 py-3 text-[11px] font-bold tracking-wide transition-colors sm:px-3 ${
                active
                  ? 'border-[#1a9fff] text-white'
                  : 'border-transparent text-[#8f98a0] hover:text-white'
              }`}
            >
              <Icon size={15} />
              {label}

              {id === 'downloads' && downloadingGames.length > 0 && (
                <span className="rounded-full bg-[#1a9fff] px-1.5 text-[9px] text-white">
                  {downloadingGames.length}
                </span>
              )}
            </button>
          );
        })}

        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => setTab('downloads')}
            title="Downloads"
            className="relative rounded p-2 text-[#8f98a0] hover:bg-white/5 hover:text-white"
          >
            <Download size={17} />
            {downloadingGames.length > 0 && (
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-sky-400" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setTab('cart')}
            title="Shopping cart"
            className="relative rounded p-2 text-[#8f98a0] hover:bg-white/5 hover:text-white"
          >
            <ShoppingCart size={17} />
            {cart.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#5c7e10] px-1 text-[9px] text-white">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Browser-style navigation strip */}
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-black/30 bg-[#1b2838] px-4 text-[#8f98a0]">
        <button type="button" onClick={() => setTab('store')} title="Back to store">
          <ArrowLeft size={14} />
        </button>

        <button type="button" onClick={() => setTab('library')} title="Library">
          <ArrowRight size={14} />
        </button>

        <div className="flex min-w-0 flex-1 items-center gap-2 rounded-sm bg-[#16202d] px-3 py-1 text-[10px]">
          <Home size={12} />
          <span className="truncate font-mono">
            steam://
            {tab === 'store'
              ? storePage
              : tab === 'library'
                ? 'open/library'
                : tab === 'downloads'
                  ? 'open/downloads'
                  : tab === 'cart'
                    ? 'open/cart'
                    : 'open/community'}
          </span>
        </div>
      </div>

      {/* Main page content */}
      <main className="relative flex min-h-0 flex-1 flex-col overflow-hidden">

        {tab === 'store' && (
          <SteamStoreView
            view={storePage}
            onViewChange={setStorePage}
            games={STORE_GAMES}
            wishlistIds={wishlistIds}
            cart={cart}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
          />
        )}

        {tab === 'library' && (
          <SteamLibraryView
            states={states}
            selectedId={selectedId}
            onSelect={setSelectedId}
            onChange={patch}
            onPlay={handlePlay}
            onOpenWorkshop={() => setWorkshopOpen(true)}
          />
        )}

        {tab === 'downloads' && (
          <DownloadsPage
            games={LIBRARY_GAMES}
            states={states}
            onChange={patch}
            totalProgress={totalProgress}
          />
        )}

        {tab === 'cart' && (
          <CartPage
            games={cartGames}
            onRemove={removeFromCart}
            onContinue={() => setTab('store')}
          />
        )}

        {tab === 'community' && (
          <CommunityPage />
        )}

        {/* Notification toast */}
        {notification && (
          <div className="absolute bottom-5 right-5 z-20 flex items-center gap-2 rounded-lg border border-white/10 bg-[#26394d] px-4 py-3 text-sm text-white shadow-xl">
            <Check size={16} className="text-emerald-400" />
            {notification}
          </div>
        )}
      </main>

      {/* Bottom status bar */}
      <footer className="flex h-7 shrink-0 items-center justify-between border-t border-black/30 bg-[#171a21] px-4 text-[10px] text-[#8f98a0]">
        <span>
          {installedCount} of {LIBRARY_GAMES.length} games installed
        </span>

        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          WeatherWise Steam Simulator
        </span>
      </footer>
    </div>
  );
}

function DownloadsPage({
  games,
  states,
  onChange,
  totalProgress,
}: {
  games: typeof LIBRARY_GAMES;
  states: Record<string, GameState>;
  onChange: (id: string, change: Partial<GameState>) => void;
  totalProgress: number;
}) {
  const downloading = games.filter(
    (game) => states[game.id]?.status === 'downloading'
  );

  const installed = games.filter(
    (game) => states[game.id]?.status === 'installed' ||
      states[game.id]?.status === 'running'
  );

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-7">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#66c0f4]">
            Steam client
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">Downloads</h1>
          <p className="mt-1 text-xs text-[#8f98a0]">
            Manage your simulated game downloads.
          </p>
        </div>

        <div className="rounded-lg bg-[#16202d] px-4 py-3">
          <p className="text-[10px] uppercase text-[#8f98a0]">Overall progress</p>
          <p className="mt-1 text-xl font-bold text-white">{totalProgress}%</p>
        </div>
      </div>

      <section className="mb-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Downloading</h2>
          <span className="text-xs text-[#8f98a0]">
            {downloading.length} active
          </span>
        </div>

        {downloading.length === 0 ? (
          <div className="rounded-lg border border-dashed border-white/10 bg-[#16202d] p-8 text-center">
            <Download className="mx-auto mb-3 text-[#64758a]" size={30} />
            <p className="text-sm font-semibold text-white">No active downloads</p>
            <p className="mt-1 text-xs text-[#8f98a0]">
              Install a game from your Library to see it here.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {downloading.map((game) => {
              const progress = states[game.id].progress;

              return (
                <div key={game.id} className="rounded-lg bg-[#16202d] p-4">
                  <div className="mb-3 flex items-center gap-3">
                    <div className={`h-12 w-16 rounded bg-gradient-to-br ${game.artClassName}`} />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {game.title}
                      </p>
                      <p className="text-[11px] text-[#8f98a0]">
                        Downloading · {progress}%
                      </p>
                    </div>
                    <button
                      type="button"
                      title="Cancel download"
                      onClick={() => onChange(game.id, {
                        status: 'not-installed',
                        progress: 0,
                      })}
                      className="rounded p-2 text-[#8f98a0] hover:bg-white/10 hover:text-red-400"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="h-2 overflow-hidden rounded-full bg-black/40">
                    <div
                      className="h-full rounded-full bg-[#1a9fff] transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold text-white">Installed games</h2>

        {installed.length === 0 ? (
          <p className="rounded-lg bg-[#16202d] p-5 text-xs text-[#8f98a0]">
            No games installed yet.
          </p>
        ) : (
          <div className="space-y-2">
            {installed.map((game) => (
              <div
                key={game.id}
                className="flex items-center gap-3 rounded-lg bg-[#16202d] p-3"
              >
                <div className={`h-9 w-12 rounded bg-gradient-to-br ${game.artClassName}`} />
                <span className="min-w-0 flex-1 truncate text-sm text-white">
                  {game.title}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <Check size={13} />
                  Installed
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function CartPage({
  games,
  onRemove,
  onContinue,
}: {
  games: typeof STORE_GAMES;
  onRemove: (id: string) => void;
  onContinue: () => void;
}) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#66c0f4]">
          Store
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">Your Cart</h1>
      </div>

      {games.length === 0 ? (
        <div className="rounded-lg border border-dashed border-white/10 bg-[#16202d] p-10 text-center">
          <ShoppingCart size={36} className="mx-auto mb-3 text-[#64758a]" />
          <h2 className="font-semibold text-white">Your cart is empty</h2>
          <p className="mt-2 text-xs text-[#8f98a0]">
            Browse the Store and add a game to your cart.
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="mt-5 rounded bg-[#1a9fff] px-5 py-2 text-sm font-semibold text-white hover:bg-sky-500"
          >
            Browse Store
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {games.map((game) => (
            <div
              key={game.id}
              className="flex flex-wrap items-center gap-3 rounded-lg bg-[#16202d] p-3"
            >
              <div className={`h-16 w-24 rounded bg-gradient-to-br ${game.artClassName}`} />
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-white">{game.title}</h3>
                <p className="mt-1 text-xs text-[#8f98a0]">
                  {game.price ?? 'Not currently priced'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => onRemove(game.id)}
                className="flex items-center gap-1 rounded px-3 py-2 text-xs text-red-400 hover:bg-red-400/10"
              >
                <Trash2 size={14} />
                Remove
              </button>
            </div>
          ))}

          <div className="mt-5 rounded-lg bg-[#16202d] p-4">
            <p className="text-xs text-[#8f98a0]">
              This is a local shopping-cart demonstration. Checkout and payments
              are not connected.
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {games.length} {games.length === 1 ? 'item' : 'items'} in cart
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function CommunityPage() {
  const friends = [
    { name: 'StormTracker', game: 'Online', color: 'bg-emerald-500' },
    { name: 'RadarOperator', game: 'Playing Storm Dash', color: 'bg-sky-500' },
    { name: 'WeatherFan', game: 'Away', color: 'bg-amber-500' },
    { name: 'TIV2', game: 'Online', color: 'bg-violet-500' },
  ];

  return (
    <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-8">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#66c0f4]">
          Steam community
        </p>
        <h1 className="mt-1 text-2xl font-bold text-white">Friends & Community</h1>
        <p className="mt-1 text-xs text-[#8f98a0]">
          Your local demo friends list.
        </p>
      </div>

      <div className="max-w-2xl rounded-lg bg-[#16202d] p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white">Friends</h2>
          <span className="text-xs text-[#8f98a0]">{friends.length} friends</span>
        </div>

        <div className="space-y-4">
          {friends.map((friend) => (
            <div key={friend.name} className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-full ${friend.color}`} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white">{friend.name}</p>
                <p className="text-xs text-[#8f98a0]">{friend.game}</p>
              </div>
              <MessageCircle size={17} className="text-[#64758a]" />
            </div>
          ))}
        </div>

        <p className="mt-5 border-t border-white/5 pt-4 text-[11px] text-[#8f98a0]">
          Friends and activity shown here are sample data. No real Steam
          accounts or chats are connected.
        </p>
      </div>
    </div>
  );
}