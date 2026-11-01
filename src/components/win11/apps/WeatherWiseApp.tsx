import { useEffect, useState } from 'react';
import { CloudLightning, Database, Map, Newspaper, Radar, Rows3 } from 'lucide-react';
import { setLocalNavigator } from '@/hooks/usePathname';
import RadarStationsPage from '@/pages/RadarStationsPage';
import StationDirectoryPage from '@/pages/StationDirectoryPage';
import RadarCoveragePage from '@/pages/RadarCoveragePage';
import AboutDataPage from '@/pages/AboutDataPage';
import TornadoArticlePage from '@/pages/TornadoArticlePage';

const ROUTES = [
  { path: '/radar-stations', label: 'Radar', icon: Radar, Page: RadarStationsPage },
  { path: '/station-directory', label: 'Directory', icon: Rows3, Page: StationDirectoryPage },
  { path: '/radar-coverage-map', label: 'Coverage', icon: Map, Page: RadarCoveragePage },
  { path: '/about-data', label: 'Data', icon: Database, Page: AboutDataPage },
  {
    path: '/articles/zap-beulah-ef4-tornado-2027',
    label: 'Article',
    icon: Newspaper,
    Page: TornadoArticlePage,
  },
];

export default function WeatherWiseApp() {
  const [path, setPath] = useState<string>('/radar-stations');

  useEffect(() => {
    setLocalNavigator(setPath);
    return () => setLocalNavigator(null);
  }, []);

  const active = ROUTES.find((route) => route.path === path) ?? ROUTES[0];
  const Page = active.Page;

  return (
    <div className="flex h-full flex-col bg-slate-50 text-slate-900">
      <header className="flex items-center justify-between gap-4 border-b border-slate-200 bg-white px-4 py-2.5">
        <div className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-ww-navy text-ww-amber">
            <CloudLightning size={18} />
          </span>
          <div className="leading-tight">
            <p className="text-sm font-bold text-ww-navy">WeatherWise</p>
            <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Live radar network</p>
          </div>
        </div>

        <nav className="flex items-center gap-1 overflow-x-auto">
          {ROUTES.map((route) => {
            const Icon = route.icon;
            const isActive = route.path === active.path;
            return (
              <button
                key={route.path}
                type="button"
                onClick={() => setPath(route.path)}
                className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold transition ${
                  isActive ? 'bg-ww-navy text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon size={14} />
                {route.label}
              </button>
            );
          })}
        </nav>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <Page />
      </div>
    </div>
  );
}
