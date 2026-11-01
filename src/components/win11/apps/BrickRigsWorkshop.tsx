import { ArrowLeft, Star } from 'lucide-react';

interface BrickRigsWorkshopProps {
  onBack: () => void;
}

const WORKSHOP_TABS = ['All', 'Discussions', 'Screenshots', 'Artwork', 'Broadcasts', 'Videos', 'Workshop', 'News', 'Guides', 'Reviews'];
const SUB_NAV = ['Home', 'Browse', 'Your Items', 'Discussions', 'About'];

const VEHICLES = [
  { title: 'Half-Life Alyx: Combine Ci...', author: 'z1', rating: 4, artClassName: 'from-slate-500 to-slate-800' },
  { title: 'QAV-90 Vulture', author: 'Randomly Gamer', rating: 4, artClassName: 'from-stone-500 to-stone-800' },
  { title: 'EMB 314 Super Tucano', author: 'AXI.OMA', rating: 0, artClassName: 'from-emerald-700 to-slate-800' },
  { title: 'Kantan EXR 250', author: 'R8', rating: 0, artClassName: 'from-amber-600 to-slate-800' },
  { title: '2020 Chevrolet Silverado', author: 'Fast Lane Luke', rating: 0, artClassName: 'from-red-700 to-slate-900' },
  { title: 'Typical CIWS, (The "C-RIZ...', author: 'Erixen', rating: 4, artClassName: 'from-zinc-500 to-zinc-800' },
];

export default function BrickRigsWorkshop({ onBack }: BrickRigsWorkshopProps) {
  return (
    <div className="flex h-full min-h-0 flex-col overflow-y-auto bg-[#1b2838] text-slate-100">
      <div className="flex items-center justify-between border-b border-black/30 bg-[#171a21] px-5 py-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-md px-2 py-1 text-sm text-slate-300 transition-colors duration-150 hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to library
        </button>
        <span className="text-sm font-semibold">Brick Rigs</span>
        <span className="rounded bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white">Store Page</span>
      </div>

      <nav aria-label="Community tabs" className="flex flex-wrap gap-4 border-b border-black/30 bg-[#171a21] px-5 py-2 text-xs text-slate-400">
        {WORKSHOP_TABS.map((tab) => (
          <span key={tab} className={tab === 'Workshop' ? 'border-b-2 border-sky-400 pb-1 text-white' : 'pb-1'}>
            {tab}
          </span>
        ))}
      </nav>

      <div className="relative m-5 h-44 overflow-hidden rounded-md bg-gradient-to-r from-amber-700 via-slate-700 to-sky-800">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" aria-hidden="true" />
        <div className="absolute bottom-5 left-8">
          <h2 className="text-2xl font-bold text-white drop-shadow">Brick Rigs Workshop</h2>
          <p className="text-sm text-slate-200">Share your creations with your friends and the rest of the world!</p>
        </div>
      </div>

      <nav aria-label="Workshop sections" className="mx-5 flex gap-6 border-b border-black/30 px-2 pb-2 text-sm text-slate-300">
        {SUB_NAV.map((item, index) => (
          <span key={item} className={index === 0 ? 'border-b-2 border-white pb-1 font-medium text-white' : 'pb-1'}>
            {item}
          </span>
        ))}
      </nav>

      <section aria-label="Vehicles" className="mx-5 my-5 rounded-md bg-[#16202d] p-5">
        <div className="mb-4 flex items-end justify-between">
          <div>
            <h3 className="text-lg font-semibold">Vehicles</h3>
            <p className="text-xs text-slate-400">In the past week</p>
          </div>
          <span className="rounded border border-sky-500 px-3 py-1 text-xs text-sky-300">View All</span>
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
          {VEHICLES.map((item) => (
            <li key={item.title} className="flex flex-col gap-2">
              <div className={`aspect-[4/3] rounded-md bg-gradient-to-br ${item.artClassName} transition-transform duration-200 hover:-translate-y-1`} aria-hidden="true" />
              <div className="flex gap-0.5 text-amber-400" aria-label={`${item.rating} of 5 stars`}>
                {Array.from({ length: 5 }, (_, index) => (
                  <Star
                    key={index}
                    className={`h-3.5 w-3.5 ${index < item.rating ? 'fill-amber-400' : 'fill-transparent text-slate-600'}`}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="truncate text-sm font-medium">{item.title}</p>
              <p className="truncate text-xs text-slate-400">By {item.author}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
