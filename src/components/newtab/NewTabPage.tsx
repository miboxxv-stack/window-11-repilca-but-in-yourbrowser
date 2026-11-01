import { useState, type FormEvent } from 'react';
import { Bookmark, CloudSun, Download, Droplets, Home, Newspaper, Radar, Search, Settings, Thermometer, Wind } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

interface NewTabPageProps {
  onOpen: (input: string) => void;
}

interface TopSite {
  name: string;
  url: string;
  initials: string;
  className: string;
}

const TOP_SITES: TopSite[] = [
  { name: 'Environment Canada', url: 'https://weather.gc.ca/', initials: 'EC', className: 'bg-red-600' },
  { name: 'National Weather Service', url: 'https://www.weather.gov/', initials: 'NWS', className: 'bg-sky-700' },
  { name: 'RainViewer', url: 'https://www.rainviewer.com/', initials: 'RV', className: 'bg-cyan-600' },
  { name: 'Open-Meteo', url: 'https://open-meteo.com/', initials: 'OM', className: 'bg-amber-600' },
  { name: 'OpenStreetMap', url: 'https://www.openstreetmap.org/', initials: 'OSM', className: 'bg-emerald-700' },
  { name: 'Weather Underground', url: 'https://www.wunderground.com/', initials: 'WU', className: 'bg-teal-700' },
  { name: 'Steam Store', url: 'https://store.steampowered.com/', initials: 'ST', className: 'bg-slate-700' },
  { name: 'Wikipedia', url: 'https://en.wikipedia.org/', initials: 'W', className: 'bg-stone-600' },
];

const FORECAST = {
  city: 'Kamloops, BC',
  temperature: 4,
  high: 6,
  low: -1,
  summary: 'Mostly cloudy',
};

const STORIES = [
  { title: 'Storm season outlook for the southern Interior', source: 'WeatherWise Desk', minutes: 12 },
  { title: 'How Doppler radar tracks rotation inside a storm cell', source: 'WeatherWise Desk', minutes: 6 },
  { title: 'Lightning safety for backcountry trips this summer', source: 'WeatherWise Desk', minutes: 9 },
];

const SIDEBAR_ITEMS: { icon: LucideIcon; label: string }[] = [
  { icon: Home, label: 'Home' },
  { icon: Search, label: 'Search' },
  { icon: Bookmark, label: 'Bookmarks' },
  { icon: Download, label: 'Downloads' },
  { icon: Settings, label: 'Settings' },
];

export default function NewTabPage({ onOpen }: NewTabPageProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (query.trim()) onOpen(query);
  };

  return (
    <div className="flex min-h-full bg-slate-50 text-slate-900">
      <aside className="hidden w-16 shrink-0 flex-col items-center gap-2 border-r border-slate-200 bg-white py-5 sm:flex">
        <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-sky-600 text-white shadow-md shadow-sky-600/30">
          <CloudSun className="h-5 w-5" aria-hidden="true" />
        </span>
        {SIDEBAR_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.label}
              type="button"
              aria-label={item.label}
              title={item.label}
              className="flex h-10 w-10 items-center justify-center rounded-lg text-slate-500 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900"
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
            </button>
          );
        })}
      </aside>

      <div className="mx-auto w-full max-w-5xl px-5 py-10 sm:px-10">
        <header className="flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-semibold tracking-wide text-sky-700">WeatherWise</p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">Good to see you</h1>
        </header>

        <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-xl items-center gap-2 rounded-full bg-white px-4 py-2.5 shadow-md shadow-slate-900/5 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-sky-400">
          <Search className="h-4 w-4 shrink-0 text-slate-400" aria-hidden="true" />
          <label className="min-w-0 flex-1">
            <span className="sr-only">Search or enter address</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search the web or enter an address"
              className="w-full bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          </label>
        </form>

        <ul className="mt-10 grid grid-cols-4 gap-3 sm:grid-cols-8">
          {TOP_SITES.map((site) => (
            <li key={site.url}>
              <button
                type="button"
                onClick={() => onOpen(site.url)}
                className="group flex w-full flex-col items-center gap-2 rounded-2xl p-2 text-center transition-colors duration-150 hover:bg-white hover:shadow-sm"
              >
                <span className={`flex h-12 w-12 items-center justify-center rounded-xl text-xs font-semibold text-white shadow-sm transition-transform duration-200 group-hover:-translate-y-0.5 ${site.className}`}>
                  {site.initials}
                </span>
                <span className="w-full truncate text-xs text-slate-600">{site.name}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <section className="rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 p-6 text-white shadow-lg shadow-sky-900/20 md:col-span-2" aria-label="Kamloops forecast">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-sky-100">{FORECAST.city}</p>
                <p className="mt-3 text-6xl font-semibold tracking-tight">{FORECAST.temperature}°</p>
                <p className="mt-2 text-base text-sky-50">{FORECAST.summary}</p>
              </div>
              <CloudSun className="h-16 w-16 text-sky-100" aria-hidden="true" />
            </div>
            <dl className="mt-6 flex gap-6 text-sm text-sky-100">
              <div className="flex items-center gap-1.5">
                <Thermometer className="h-4 w-4" aria-hidden="true" />
                <dt className="sr-only">High</dt>
                <dd>High {FORECAST.high}°</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <Droplets className="h-4 w-4" aria-hidden="true" />
                <dt className="sr-only">Low</dt>
                <dd>Low {FORECAST.low}°</dd>
              </div>
              <div className="flex items-center gap-1.5">
                <Wind className="h-4 w-4" aria-hidden="true" />
                <dt className="sr-only">Conditions</dt>
                <dd>Cloud cover</dd>
              </div>
            </dl>
          </section>

          <button
            type="button"
            onClick={() => onOpen('https://www.rainviewer.com/')}
            className="group flex flex-col justify-between rounded-2xl bg-white p-6 text-left shadow-sm ring-1 ring-slate-200 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-cyan-700">
              <Radar className="h-5 w-5" aria-hidden="true" />
            </span>
            <span>
              <span className="block text-base font-semibold text-slate-900">Live radar</span>
              <span className="mt-1 block text-sm text-slate-500">Check precipitation and storm cells near you.</span>
            </span>
          </button>
        </div>

        <section className="mt-10" aria-label="Stories">
          <h2 className="text-sm font-semibold text-slate-700">Stories from WeatherWise</h2>
          <ul className="mt-4 grid gap-4 md:grid-cols-3">
            {STORIES.map((story) => (
              <li key={story.title}>
                <article className="flex h-full flex-col justify-between rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-shadow duration-200 hover:shadow-md">
                  <Newspaper className="h-5 w-5 text-sky-700" aria-hidden="true" />
                  <h3 className="mt-4 text-sm font-semibold leading-snug text-slate-900">{story.title}</h3>
                  <p className="mt-3 text-xs text-slate-500">
                    {story.source} · {story.minutes} min read
                  </p>
                </article>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
