import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import {
  Bell, ChevronDown, CircleHelp, Compass, Hash, Headphones,
  Inbox, Mic, MoreHorizontal, Plus, Search,
  Send, Settings, Smile, Sticker, Users, X, MessageCircle,
} from 'lucide-react';

type ChatMessage = {
  id: string;
  author: string;
  content: string;
  createdAt: number;
  gif?: string;
};

type MessageStore = Record<string, ChatMessage[]>;

const CHANNELS = [
  { id: 'general', label: 'general' },
  { id: 'weather-chat', label: 'weather-chat' },
  { id: 'storm-chasing', label: 'storm-chasing' },
  { id: 'gaming', label: 'gaming' },
  { id: 'screenshots', label: 'screenshots-and-clips' },
];

const SEED_MESSAGES: MessageStore = {
  general: [
    { id: 'g1', author: 'StormTracker', content: 'Welcome to the WeatherWise community! 🌩️', createdAt: Date.now() - 1000 * 60 * 28 },
    { id: 'g2', author: 'RadarOperator', content: 'Anyone checking the radar this afternoon?', createdAt: Date.now() - 1000 * 60 * 17 },
    { id: 'g3', author: 'TIV2', content: 'I have the radar up. Looking quiet for now.', createdAt: Date.now() - 1000 * 60 * 8 },
  ],
  'weather-chat': [
    { id: 'w1', author: 'RadarOperator', content: 'The latest model runs are looking interesting.', createdAt: Date.now() - 1000 * 60 * 12 },
  ],
  'storm-chasing': [
    { id: 's1', author: 'StormTracker', content: 'Keep an eye on official warnings and stay well clear of storms.', createdAt: Date.now() - 1000 * 60 * 35 },
  ],
  gaming: [
    { id: 'gm1', author: 'WeatherFan', content: 'Anyone playing Brick Rigs?', createdAt: Date.now() - 1000 * 60 * 21 },
  ],
  screenshots: [],
};

const MEMBERS = [
  { name: 'StormTracker', color: 'bg-emerald-500', status: 'Online' },
  { name: 'RadarOperator', color: 'bg-sky-500', status: 'Online' },
  { name: 'WeatherFan', color: 'bg-amber-500', status: 'Idle' },
  { name: 'TIV2', color: 'bg-violet-500', status: 'Online' },
  { name: 'CloudWatcher', color: 'bg-rose-500', status: 'Do Not Disturb' },
];

const GIFS = [
  { label: 'Typing cat', url: 'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif' },
  { label: 'Keyboard cat', url: 'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif' },
  { label: 'Party', url: 'https://media.giphy.com/media/26BRuo6sLetdllPAQ/giphy.gif' },
];

const STORAGE_MESSAGES = 'weatherwise-discord-messages-v1';
const STORAGE_USERNAME = 'weatherwise-discord-username-v1';

function readMessages(): MessageStore {
  try {
    const raw = localStorage.getItem(STORAGE_MESSAGES);
    return raw ? { ...SEED_MESSAGES, ...JSON.parse(raw) } : SEED_MESSAGES;
  } catch {
    return SEED_MESSAGES;
  }
}

function formatTime(timestamp: number) {
  return new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function initials(name: string) {
  return name.trim().slice(0, 2).toUpperCase() || 'WW';
}

export default function DiscordApp() {
  const [activeChannel, setActiveChannel] = useState('general');
  const [messages, setMessages] = useState<MessageStore>(readMessages);
  const [username, setUsername] = useState(() => localStorage.getItem(STORAGE_USERNAME) || 'TIV2');
  const [draft, setDraft] = useState('');
  const [gifOpen, setGifOpen] = useState(false);
  const [gifUrl, setGifUrl] = useState('');
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileDraft, setProfileDraft] = useState(username);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [showMembers, setShowMembers] = useState(true);
  const [activeServer, setActiveServer] = useState('weatherwise');
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const channelMessages = messages[activeChannel] ?? [];
  const filteredMessages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return query ? channelMessages.filter((item) => `${item.author} ${item.content}`.toLowerCase().includes(query)) : channelMessages;
  }, [channelMessages, search]);

  useEffect(() => {
    localStorage.setItem(STORAGE_MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_USERNAME, username);
  }, [username]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [activeChannel, channelMessages.length]);

  const postMessage = (content: string, gif?: string) => {
    if (!content.trim() && !gif) return;
    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      author: username,
      content: content.trim(),
      createdAt: Date.now(),
      gif,
    };
    setMessages((previous) => ({
      ...previous,
      [activeChannel]: [...(previous[activeChannel] ?? []), message],
    }));
    setDraft('');
    setGifOpen(false);
    setGifUrl('');
    inputRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    postMessage(draft);
  };

  const saveProfile = () => {
    const next = profileDraft.trim().slice(0, 24);
    if (next) setUsername(next);
    setProfileOpen(false);
  };

  return (
    <div className="flex h-full min-h-0 overflow-hidden bg-[#313338] font-sans text-[#f2f3f5]">
      {/* Server rail */}
      <aside className="flex w-[68px] shrink-0 flex-col items-center gap-2 overflow-y-auto bg-[#1e1f22] py-3">
        <button title="Direct Messages" onClick={() => setActiveServer('home')} className={`relative flex h-12 w-12 items-center justify-center rounded-2xl transition-all hover:rounded-xl ${activeServer === 'home' ? 'bg-[#5865f2]' : 'bg-[#313338] hover:bg-[#5865f2]'}`}>
          <MessageCircle size={25} />
        </button>
        <div className="my-1 h-[2px] w-8 rounded bg-[#35363c]" />
        <button title="WeatherWise Community" onClick={() => setActiveServer('weatherwise')} className={`relative flex h-12 w-12 items-center justify-center rounded-2xl text-sm font-black transition-all hover:rounded-xl ${activeServer === 'weatherwise' ? 'bg-[#5865f2]' : 'bg-[#3b3d45] hover:bg-[#5865f2]'}`}>
          WW
          {activeServer === 'weatherwise' && <span className="absolute -left-[17px] h-8 w-1 rounded-r-full bg-white" />}
        </button>
        <button title="Storm Chasers" onClick={() => setActiveServer('stormchasers')} className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3b3d45] text-lg font-black transition-all hover:rounded-xl hover:bg-[#5865f2] ${activeServer === 'stormchasers' ? 'bg-[#5865f2]' : ''}`}>
          🌪️
        </button>
        <button title="Add a server (demo)" onClick={() => setActiveServer('weatherwise')} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#313338] text-[#23a559] transition-all hover:rounded-xl hover:bg-[#23a559] hover:text-white">
          <Plus size={24} />
        </button>
        <button title="Explore servers (demo)" onClick={() => setActiveServer('weatherwise')} className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#313338] text-[#23a559] transition-all hover:rounded-xl hover:bg-[#23a559] hover:text-white">
          <Compass size={22} />
        </button>
      </aside>

      {/* Channel / DM sidebar */}
      <aside className="flex w-[220px] shrink-0 flex-col bg-[#2b2d31] sm:w-[240px]">
        <button className="flex h-12 shrink-0 items-center justify-between border-b border-black/20 px-4 text-left text-sm font-bold shadow-sm hover:bg-white/[0.03]">
          {activeServer === 'home' ? 'Direct Messages' : activeServer === 'stormchasers' ? 'Storm Chasers' : 'WeatherWise Community'}
          <ChevronDown size={16} className="text-[#b5bac1]" />
        </button>
        {activeServer === 'home' ? (
          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase text-[#949ba4]">Direct Messages <Plus size={15} /></div>
            {MEMBERS.map((member) => (
              <button key={member.name} onClick={() => { setActiveServer('weatherwise'); setActiveChannel('general'); }} className="mb-1 flex w-full items-center gap-2 rounded px-2 py-2 text-left hover:bg-[#35373c]">
                <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${member.color}`}>{initials(member.name)}</span>
                <span className="truncate text-sm text-[#dbdee1]">{member.name}</span>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-3">
            <div className="mb-2 flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-wide text-[#949ba4]">
              <span>Text Channels</span><Plus size={15} />
            </div>
            {CHANNELS.map((channel) => (
              <button key={channel.id} onClick={() => setActiveChannel(channel.id)} className={`mb-0.5 flex w-full items-center gap-2 rounded px-2 py-[7px] text-left text-sm transition-colors ${activeChannel === channel.id ? 'bg-[#404249] text-white' : 'text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]'}`}>
                <Hash size={17} className="shrink-0 text-[#80848e]" />
                <span className="truncate">{channel.label}</span>
              </button>
            ))}
            <div className="mb-2 mt-6 flex items-center justify-between px-1 text-[11px] font-bold uppercase tracking-wide text-[#949ba4]">
              <span>Voice Channels</span><Plus size={15} />
            </div>
            {['Lobby', 'Storm Watch'].map((voice) => (
              <button key={voice} className="flex w-full items-center gap-2 rounded px-2 py-2 text-sm text-[#949ba4] hover:bg-[#35373c] hover:text-[#dbdee1]">
                <Headphones size={16} />{voice}
              </button>
            ))}
          </div>
        )}
        {/* User panel */}
        <div className="flex h-[54px] shrink-0 items-center gap-2 bg-[#232428] px-2">
          <button onClick={() => { setProfileDraft(username); setProfileOpen(true); }} title="Edit profile" className="flex h-8 w-8 items-center justify-center rounded-full bg-[#5865f2] text-[11px] font-bold">{initials(username)}</button>
          <button onClick={() => { setProfileDraft(username); setProfileOpen(true); }} className="min-w-0 flex-1 text-left">
            <p className="truncate text-xs font-bold text-white">{username}</p><p className="text-[10px] text-[#949ba4]">Online</p>
          </button>
          <button title="Mute microphone (visual only)" className="rounded p-1.5 text-[#b5bac1] hover:bg-[#35373c] hover:text-white"><Mic size={17} /></button>
          <button title="Deafen (visual only)" className="rounded p-1.5 text-[#b5bac1] hover:bg-[#35373c] hover:text-white"><Headphones size={17} /></button>
          <button title="User settings" onClick={() => { setProfileDraft(username); setProfileOpen(true); }} className="rounded p-1.5 text-[#b5bac1] hover:bg-[#35373c] hover:text-white"><Settings size={17} /></button>
        </div>
      </aside>

      {/* Chat column */}
      <main className="flex min-w-0 flex-1 flex-col bg-[#313338]">
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-black/20 px-4 shadow-sm">
          <Hash size={21} className="text-[#949ba4]" />
          <span className="text-sm font-bold">{CHANNELS.find((item) => item.id === activeChannel)?.label}</span>
          <div className="mx-1 h-6 w-px bg-[#3f4147]" />
          <span className="hidden truncate text-xs text-[#949ba4] md:block">Welcome to the channel!</span>
          <div className="ml-auto flex items-center gap-3 text-[#b5bac1]">
            <button title="Notifications" className="hover:text-white"><Bell size={18} /></button>
            <button title="Toggle member list" onClick={() => setShowMembers((value) => !value)} className={`hover:text-white ${showMembers ? 'text-white' : ''}`}><Users size={19} /></button>
            <button title="Search messages" onClick={() => setSearchOpen((value) => !value)} className="hover:text-white"><Search size={18} /></button>
            <button title="Inbox" className="hover:text-white"><Inbox size={18} /></button>
            <button title="Help" className="hidden hover:text-white sm:block"><CircleHelp size={18} /></button>
          </div>
        </header>

        {searchOpen && (
          <div className="shrink-0 border-b border-black/20 bg-[#2b2d31] px-4 py-2">
            <input autoFocus value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search messages in this channel" className="w-full rounded bg-[#1e1f22] px-3 py-2 text-sm text-white outline-none placeholder:text-[#949ba4]" />
          </div>
        )}

        <section ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-6">
          <div className="mb-7">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#41434b]"><Hash size={34} className="text-white" /></div>
            <h1 className="text-[26px] font-bold tracking-tight text-white">Welcome to #{CHANNELS.find((item) => item.id === activeChannel)?.label}!</h1>
            <p className="mt-1 text-sm text-[#b5bac1]">This is the beginning of the #{CHANNELS.find((item) => item.id === activeChannel)?.label} channel.</p>
          </div>

          <div className="space-y-5">
            {filteredMessages.map((item) => (
              <article key={item.id} className="group flex gap-4 rounded px-1 py-0.5 hover:bg-[#2e3035]">
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-bold ${item.author === username ? 'bg-[#5865f2]' : 'bg-[#4e5058]'}`}>{initials(item.author)}</div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="cursor-pointer text-sm font-semibold text-white hover:underline">{item.author}</span>
                    <time className="text-[10px] text-[#949ba4]">{formatTime(item.createdAt)}</time>
                  </div>
                  {item.content && <p className="whitespace-pre-wrap break-words text-sm leading-[1.45rem] text-[#dbdee1]">{item.content}</p>}
                  {item.gif && <img src={item.gif} alt="Shared GIF" loading="lazy" className="mt-2 max-h-56 max-w-[min(100%,420px)] rounded-lg object-contain" />}
                </div>
                <button title="More message actions" className="hidden h-7 rounded px-1 text-[#949ba4] hover:bg-[#404249] hover:text-white group-hover:block"><MoreHorizontal size={18} /></button>
              </article>
            ))}
            {filteredMessages.length === 0 && <p className="py-8 text-center text-sm text-[#949ba4]">No messages found.</p>}
          </div>
        </section>

        {/* GIF picker */}
        {gifOpen && (
          <div className="mx-4 mb-2 rounded-lg border border-[#1e1f22] bg-[#2b2d31] p-3 shadow-xl">
            <div className="mb-3 flex items-center justify-between"><span className="text-xs font-bold text-white">GIF picker</span><button onClick={() => setGifOpen(false)} className="text-[#949ba4] hover:text-white"><X size={16} /></button></div>
            <div className="grid grid-cols-3 gap-2">
              {GIFS.map((gif) => <button key={gif.url} onClick={() => postMessage('', gif.url)} className="overflow-hidden rounded-md bg-[#1e1f22] text-left hover:ring-2 hover:ring-[#5865f2]"><img src={gif.url} alt={gif.label} className="h-20 w-full object-cover" /><span className="block truncate px-2 py-1 text-[10px] text-[#dbdee1]">{gif.label}</span></button>)}
            </div>
            <form onSubmit={(event) => { event.preventDefault(); if (/^https?:\/\//i.test(gifUrl.trim())) postMessage('', gifUrl.trim()); }} className="mt-3 flex gap-2">
              <input value={gifUrl} onChange={(event) => setGifUrl(event.target.value)} placeholder="Paste a GIF URL..." className="min-w-0 flex-1 rounded bg-[#1e1f22] px-3 py-2 text-xs text-white outline-none placeholder:text-[#949ba4]" />
              <button type="submit" disabled={!/^https?:\/\//i.test(gifUrl.trim())} className="rounded bg-[#5865f2] px-3 py-2 text-xs font-semibold text-white disabled:opacity-40">Send GIF</button>
            </form>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mx-4 mb-5 flex min-h-[44px] shrink-0 items-center gap-3 rounded-lg bg-[#383a40] px-3">
          <button type="button" title="Add attachment (demo)" className="shrink-0 text-[#b5bac1] hover:text-white"><Plus size={21} /></button>
          <input ref={inputRef} value={draft} onChange={(event) => setDraft(event.target.value)} placeholder={`Message #${CHANNELS.find((item) => item.id === activeChannel)?.label}`} className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-[#949ba4]" />
          <button type="button" title="GIF picker" onClick={() => setGifOpen((value) => !value)} className={`shrink-0 rounded p-1 text-[#b5bac1] hover:text-white ${gifOpen ? 'text-white' : ''}`}><span className="rounded border border-current px-1 text-[10px] font-black">GIF</span></button>
          <button type="button" title="Stickers (demo)" className="hidden shrink-0 text-[#b5bac1] hover:text-white sm:block"><Sticker size={19} /></button>
          <button type="button" title="Emoji (demo)" className="shrink-0 text-[#b5bac1] hover:text-white"><Smile size={20} /></button>
          <button type="submit" disabled={!draft.trim()} aria-label="Send message" className="shrink-0 rounded p-1 text-[#b5bac1] hover:text-white disabled:opacity-30"><Send size={18} /></button>
        </form>
      </main>

      {/* Member list */}
      {showMembers && <aside className="hidden w-[190px] shrink-0 overflow-y-auto bg-[#2b2d31] px-3 py-5 xl:block">
        <p className="mb-3 px-1 text-[11px] font-bold uppercase text-[#949ba4]">Online — {MEMBERS.filter((m) => m.status === 'Online').length + 1}</p>
        {[...MEMBERS.filter((m) => m.status === 'Online'), { name: username, color: 'bg-[#5865f2]', status: 'Online' }].map((member, index) => <div key={`${member.name}-${index}`} className="mb-3 flex items-center gap-2 opacity-90"><span className={`relative flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${member.color}`}>{initials(member.name)}<i className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#2b2d31] bg-[#23a559]" /></span><div className="min-w-0"><p className="truncate text-xs font-medium text-[#dbdee1]">{member.name}</p><p className="text-[10px] text-[#949ba4]">{member.status}</p></div></div>)}
        <p className="mb-3 mt-6 px-1 text-[11px] font-bold uppercase text-[#949ba4]">Offline — 2</p>
        {MEMBERS.filter((m) => m.status !== 'Online').map((member) => <div key={member.name} className="mb-3 flex items-center gap-2 opacity-50"><span className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-bold ${member.color}`}>{initials(member.name)}</span><span className="truncate text-xs">{member.name}</span></div>)}
      </aside>}

      {/* Profile editor */}
      {profileOpen && <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setProfileOpen(false); }}>
        <div className="w-full max-w-sm rounded-xl bg-[#2b2d31] p-5 shadow-2xl">
          <div className="mb-4 flex items-center justify-between"><h2 className="text-base font-bold text-white">Edit profile</h2><button onClick={() => setProfileOpen(false)} className="text-[#949ba4] hover:text-white"><X size={18} /></button></div>
          <label className="block text-xs font-bold uppercase text-[#b5bac1]">Display name</label>
          <input autoFocus maxLength={24} value={profileDraft} onChange={(event) => setProfileDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') saveProfile(); }} className="mt-2 w-full rounded-md bg-[#1e1f22] px-3 py-2.5 text-sm text-white outline-none focus:ring-2 focus:ring-[#5865f2]" />
          <p className="mt-2 text-[11px] text-[#949ba4]">Your name is saved locally and shown on messages you send.</p>
          <div className="mt-5 flex justify-end gap-2"><button onClick={() => setProfileOpen(false)} className="rounded px-3 py-2 text-xs font-semibold text-[#dbdee1] hover:underline">Cancel</button><button onClick={saveProfile} disabled={!profileDraft.trim()} className="rounded bg-[#5865f2] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4752c4] disabled:opacity-40">Save changes</button></div>
        </div>
      </div>}
    </div>
  );
}
