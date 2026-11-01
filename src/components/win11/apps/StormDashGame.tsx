import { useEffect, useRef } from 'react';

interface StormDashGameProps {
  onExit: () => void;
}

interface Point {
  x: number;
  y: number;
}

interface Cell extends Point {
  vx: number;
  vy: number;
}

interface World {
  player: Point;
  orbs: Point[];
  cells: Cell[];
  score: number;
  health: number;
  hitUntil: number;
}

const WIDTH = 640;
const HEIGHT = 360;
const PLAYER_SPEED = 240;
const PLAYER_RADIUS = 14;
const ORB_RADIUS = 8;
const CELL_RADIUS = 18;
const MAX_ORBS = 6;
const MAX_CELLS = 4;
const MAX_HEALTH = 3;
const HIT_COOLDOWN_MS = 1200;
const MOVE_KEYS: Record<string, { dx: number; dy: number }> = {
  w: { dx: 0, dy: -1 },
  a: { dx: -1, dy: 0 },
  s: { dx: 0, dy: 1 },
  d: { dx: 1, dy: 0 },
};

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function distance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function createWorld(): World {
  return {
    player: { x: WIDTH / 2, y: HEIGHT / 2 },
    orbs: [],
    cells: [],
    score: 0,
    health: MAX_HEALTH,
    hitUntil: 0,
  };
}

function spawnOrb(): Point {
  return { x: randomBetween(24, WIDTH - 24), y: randomBetween(40, HEIGHT - 24) };
}

function spawnCell(): Cell {
  return {
    x: WIDTH + CELL_RADIUS,
    y: randomBetween(CELL_RADIUS, HEIGHT - CELL_RADIUS),
    vx: -randomBetween(70, 150),
    vy: randomBetween(-30, 30),
  };
}

function step(world: World, keys: Set<string>, dt: number, now: number): void {
  let dx = 0;
  let dy = 0;
  for (const key of keys) {
    const move = MOVE_KEYS[key];
    if (move) {
      dx += move.dx;
      dy += move.dy;
    }
  }
  if (dx !== 0 || dy !== 0) {
    const length = Math.hypot(dx, dy);
    world.player.x = Math.min(
      WIDTH - PLAYER_RADIUS,
      Math.max(PLAYER_RADIUS, world.player.x + (dx / length) * PLAYER_SPEED * dt),
    );
    world.player.y = Math.min(
      HEIGHT - PLAYER_RADIUS,
      Math.max(PLAYER_RADIUS, world.player.y + (dy / length) * PLAYER_SPEED * dt),
    );
  }

  if (world.orbs.length < MAX_ORBS && Math.random() < dt * 1.5) world.orbs.push(spawnOrb());
  world.orbs = world.orbs.filter((orb) => {
    if (distance(orb, world.player) < PLAYER_RADIUS + ORB_RADIUS) {
      world.score += 10;
      return false;
    }
    return true;
  });

  if (world.cells.length < MAX_CELLS && Math.random() < dt * 0.6) world.cells.push(spawnCell());
  for (const cell of world.cells) {
    cell.x += cell.vx * dt;
    cell.y += cell.vy * dt;
    if (cell.y < CELL_RADIUS || cell.y > HEIGHT - CELL_RADIUS) cell.vy *= -1;
  }
  world.cells = world.cells.filter((cell) => cell.x > -CELL_RADIUS);

  const hit = world.cells.some((cell) => distance(cell, world.player) < PLAYER_RADIUS + CELL_RADIUS);
  if (hit && now >= world.hitUntil) {
    world.health -= 1;
    world.hitUntil = now + HIT_COOLDOWN_MS;
    if (world.health <= 0) Object.assign(world, createWorld());
  }
}

function draw(ctx: CanvasRenderingContext2D, world: World, now: number): void {
  const sky = ctx.createLinearGradient(0, 0, 0, HEIGHT);
  sky.addColorStop(0, '#1e3a5f');
  sky.addColorStop(1, '#0f172a');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  ctx.fillStyle = 'rgba(14, 116, 144, 0.3)';
  ctx.beginPath();
  ctx.moveTo(0, HEIGHT);
  for (let x = 0; x <= WIDTH; x += 16) ctx.lineTo(x, HEIGHT * 0.8 + Math.sin(x / 60) * 12);
  ctx.lineTo(WIDTH, HEIGHT);
  ctx.closePath();
  ctx.fill();

  for (const orb of world.orbs) {
    ctx.beginPath();
    ctx.arc(orb.x, orb.y, ORB_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = '#fde047';
    ctx.shadowColor = '#facc15';
    ctx.shadowBlur = 14;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  for (const cell of world.cells) {
    ctx.beginPath();
    ctx.arc(cell.x, cell.y, CELL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(239, 68, 68, 0.55)';
    ctx.fill();
    ctx.strokeStyle = 'rgba(254, 202, 202, 0.8)';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  const flashing = now < world.hitUntil && Math.floor(now / 120) % 2 === 0;
  ctx.beginPath();
  ctx.arc(world.player.x, world.player.y, PLAYER_RADIUS, 0, Math.PI * 2);
  ctx.fillStyle = flashing ? '#fca5a5' : '#38bdf8';
  ctx.fill();
  ctx.strokeStyle = '#e0f2fe';
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#f8fafc';
  ctx.font = '600 16px sans-serif';
  ctx.fillText(`Score ${world.score}`, 16, 28);
  ctx.fillText(`Health ${'\u2665'.repeat(world.health)}`, 16, 52);

  ctx.textAlign = 'right';
  ctx.font = '500 13px sans-serif';
  ctx.fillStyle = 'rgba(248, 250, 252, 0.8)';
  ctx.fillText('WASD to move  \u00b7  M to return to the garage', WIDTH - 16, HEIGHT - 16);
}

export default function StormDashGame({ onExit }: StormDashGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onExitRef = useRef(onExit);

  useEffect(() => {
    onExitRef.current = onExit;
  }, [onExit]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const keys = new Set<string>();
    const world = createWorld();
    let frameId = 0;
    let last = performance.now();

    const handleKeyDown = (event: KeyboardEvent) => {
      const key = event.key.toLowerCase();
      if (key === 'm') {
        onExitRef.current();
        return;
      }
      if (key in MOVE_KEYS) {
        event.preventDefault();
        keys.add(key);
      }
    };
    const handleKeyUp = (event: KeyboardEvent) => {
      keys.delete(event.key.toLowerCase());
    };
    const handleBlur = () => keys.clear();

    const loop = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      step(world, keys, dt, now);
      draw(ctx, world, now);
      frameId = window.requestAnimationFrame(loop);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);
    frameId = window.requestAnimationFrame(loop);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  return (
    <div className="relative flex h-full items-center justify-center bg-black">
      <canvas
        ref={canvasRef}
        width={WIDTH}
        height={HEIGHT}
        aria-label="Storm Dash game"
        className="h-full w-full object-contain"
      />
      <button
        type="button"
        onClick={() => onExitRef.current()}
        className="absolute right-3 top-3 rounded-md border border-white/20 bg-black/50 px-3 py-1.5 text-xs font-medium text-white transition-colors duration-200 hover:bg-white/20"
      >
        Back to garage
      </button>
    </div>
  );
}
