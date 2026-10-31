export interface SimGame {
  id: string
  title: string
  from: string
  to: string
}

export const FAVORITE_GAMES: { title: string; status?: 'update' }[] = [
  { title: 'Brick Rigs' }, { title: 'ACTION SANDBOX' }, { title: 'Animal Shelter' },
  { title: 'Animal Shelter 2: Prologue' }, { title: 'Automation - The Car Company' },
  { title: 'BeamMP-Launcher' }, { title: 'BeamNG.drive', status: 'update' }, { title: 'Besiege' },
  { title: 'Car Mechanic Simulator 2015' }, { title: 'Car Mechanic Simulator 2018' },
  { title: 'Car Mechanic Simulator 2021' }, { title: 'Cities: Skylines' }, { title: 'Citystate' },
  { title: 'Fireworks Mania' }, { title: 'Forza Horizon 4' }, { title: 'Forza Horizon 5' },
  { title: 'Forza Horizon 6' }, { title: 'Garage Flipper: Prologue' }, { title: "Garry's Mod" },
  { title: 'Gas Station Simulator' }, { title: 'Junkyard Simulator' }, { title: 'The Long Drive' },
  { title: 'Microsoft Flight Simulator (2020)' }, { title: 'Mini Metro' }, { title: 'Mini Motorways', status: 'update' },
  { title: 'Model Railway Easily' }, { title: 'Model Railway Easily Christmas' }, { title: 'Mon Bazou' },
  { title: 'My Summer Car' },
]

export const TOP_GAMES: SimGame[] = [
  { id: 'top-1', title: 'Brick Rigs', from: '#2f4f6f', to: '#c9a24a' },
  { id: 'top-2', title: 'Accident', from: '#1d3b52', to: '#e0a526' },
  { id: 'top-3', title: 'Accident Deluxe', from: '#2a4a2e', to: '#d96b2b' },
  { id: 'top-4', title: 'Action Sandbox', from: '#1a1f29', to: '#8d2b2b' },
  { id: 'top-5', title: 'Aeris', from: '#274b5e', to: '#73a2b8' },
  { id: 'top-6', title: 'Airline Manager', from: '#3b5873', to: '#d9e4ec' },
]
export const RECENT_GAMES: SimGame[] = [
  { id: 'rec-1', title: "Garry's Mod", from: '#1b5fb0', to: '#0f3d73' },
  { id: 'rec-2', title: 'Brick Rigs', from: '#2f4f6f', to: '#c9a24a' },
  { id: 'rec-3', title: 'My Summer Car', from: '#3f7d46', to: '#e9c75c' },
  { id: 'rec-4', title: 'Wand', from: '#143a57', to: '#1f5a86' },
  { id: 'rec-5', title: 'Car Mechanic Simulator 2027 Demo', from: '#1e2a3d', to: '#d6452b' },
  { id: 'rec-6', title: 'BeamNG.drive', from: '#3c6a86', to: '#c33a2b' },
  { id: 'rec-7', title: 'Derail Valley Simulator', from: '#2b1e16', to: '#c26d2c' },
  { id: 'rec-8', title: 'Team Multi', from: '#1d4f4a', to: '#e0b44c' },
]
export const UNCATEGORIZED_GAMES: SimGame[] = [
  { id: 'unc-1', title: 'Train Simulator Classic', from: '#86a9c4', to: '#e7d6b0' },
  { id: 'unc-2', title: 'Cityscape Builder', from: '#40587a', to: '#a7c3d9' },
  { id: 'unc-3', title: 'Small Town Life', from: '#3b6e8f', to: '#f0c99a' },
  { id: 'unc-4', title: 'DrainSim', from: '#20344a', to: '#e06c2a' },
  { id: 'unc-5', title: 'Derail Valley Simulator', from: '#2b1e16', to: '#c26d2c' },
  { id: 'unc-6', title: 'Supermarket Simulator', from: '#2c7a84', to: '#f6d3a2' },
]