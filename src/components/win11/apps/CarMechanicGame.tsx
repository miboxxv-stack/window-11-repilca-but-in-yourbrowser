import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ArrowLeft, Check, Droplets, Move, Palette } from 'lucide-react';
import { CAR_COLORS, createCar, createGarage, createPaintBooth } from './car-mechanic/scenes';

interface CarMechanicGameProps {
  onExit: () => void;
}

type Mode = 'garage' | 'booth';

const MOVE_KEYS = new Set(['w', 'a', 's', 'd', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright']);
const BOOTH_LIMIT = { x: 5.7, z: 4.7 };

export default function CarMechanicGame({ onExit }: CarMechanicGameProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const rigRef = useRef<ReturnType<typeof createCar> | null>(null);
  const colorRef = useRef<string>(CAR_COLORS[0]);
  const [mode, setMode] = useState<Mode>('garage');
  const [color, setColor] = useState<string>(CAR_COLORS[0]);
  const [selected, setSelected] = useState<string>(CAR_COLORS[0]);
  const [toast, setToast] = useState<string>('');

  useEffect(() => {
    colorRef.current = color;
    if (mode === 'garage') rigRef.current?.setColor(color);
  }, [color, mode]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(''), 1800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const inBooth = mode === 'booth';
    const scene = new THREE.Scene();
    const sky = inBooth ? '#c6d0da' : '#1b1f25';
    scene.background = new THREE.Color(sky);
    scene.fog = new THREE.Fog(sky, inBooth ? 20 : 16, inBooth ? 40 : 34);

    const camera = new THREE.PerspectiveCamera(inBooth ? 68 : 52, 1, 0.1, 120);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.cursor = 'grab';
    mount.appendChild(renderer.domElement);

    scene.add(new THREE.HemisphereLight(inBooth ? '#ffffff' : '#9fb0c3', '#22262c', inBooth ? 1.05 : 0.7));

    const key = new THREE.DirectionalLight('#ffffff', inBooth ? 1.5 : 1.1);
    key.position.set(6, 9, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -12;
    key.shadow.camera.right = 12;
    key.shadow.camera.top = 12;
    key.shadow.camera.bottom = -12;
    scene.add(key);

    const fill = new THREE.PointLight(inBooth ? '#eaf2ff' : '#ffd79a', inBooth ? 0.9 : 0.75, 22, 2);
    fill.position.set(-4, 4.2, 2.5);
    scene.add(fill);

    scene.add(inBooth ? createPaintBooth() : createGarage());

    const rig = createCar(colorRef.current);
    rig.group.position.set(0, inBooth ? 0.22 : 0.36, 0);
    scene.add(rig.group);
    rigRef.current = rig;

    const player = new THREE.Vector3(0, 1.66, 4.3);
    let yaw = 0;
    let pitch = -0.04;
    let orbit = { theta: 0.85, phi: 1.12, radius: 9.4, dragging: false, lastX: 0, lastY: 0 };
    const keys = new Set<string>();
    let dragging = false;
    let lastX = 0;
    let lastY = 0;

    const onKeyDown = (event: KeyboardEvent) => {
      const k = event.key.toLowerCase();
      if (MOVE_KEYS.has(k)) {
        keys.add(k);
        event.preventDefault();
      }
      if (k === 'm' && inBooth) setMode('garage');
      if (k === 'b' && !inBooth) setMode('booth');
      if (k === 'f' && inBooth) {
        rig.setColor(colorRef.current);
        setToast('Panel painted');
      }
    };
    const onKeyUp = (event: KeyboardEvent) => keys.delete(event.key.toLowerCase());

    const onPointerDown = (event: PointerEvent) => {
      dragging = true;
      lastX = event.clientX;
      lastY = event.clientY;
      renderer.domElement.style.cursor = 'grabbing';
      renderer.domElement.setPointerCapture(event.pointerId);
      orbit.dragging = true;
    };
    const onPointerUp = () => {
      dragging = false;
      orbit.dragging = false;
      renderer.domElement.style.cursor = 'grab';
    };
    const onPointerMove = (event: PointerEvent) => {
      if (!dragging) return;
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      lastX = event.clientX;
      lastY = event.clientY;
      if (inBooth) {
        yaw -= dx * 0.0035;
        pitch = THREE.MathUtils.clamp(pitch - dy * 0.0028, -0.85, 0.75);
      } else {
        orbit.theta -= dx * 0.006;
        orbit.phi = THREE.MathUtils.clamp(orbit.phi - dy * 0.004, 0.45, 1.42);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointermove', onPointerMove);

    const resize = () => {
      const width = mount.clientWidth || 1;
      const height = mount.clientHeight || 1;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const clock = new THREE.Clock();
    let frame = 0;

    const tick = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      frame = requestAnimationFrame(tick);

      if (inBooth) {
        const speed = 3.4 * delta;
        const forward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
        const right = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
        const move = new THREE.Vector3();
        if (keys.has('w') || keys.has('arrowup')) move.add(forward);
        if (keys.has('s') || keys.has('arrowdown')) move.sub(forward);
        if (keys.has('d') || keys.has('arrowright')) move.add(right);
        if (keys.has('a') || keys.has('arrowleft')) move.sub(right);
        if (move.lengthSq() > 0) {
          move.normalize().multiplyScalar(speed);
          player.add(move);
          player.x = THREE.MathUtils.clamp(player.x, -BOOTH_LIMIT.x, BOOTH_LIMIT.x);
          player.z = THREE.MathUtils.clamp(player.z, -BOOTH_LIMIT.z, BOOTH_LIMIT.z);
        }
        camera.position.copy(player);
        camera.rotation.set(pitch, yaw, 0, 'YXZ');
      } else {
        if (!orbit.dragging) orbit.theta += delta * 0.16;
        const x = Math.sin(orbit.theta) * Math.sin(orbit.phi) * orbit.radius;
        const z = Math.cos(orbit.theta) * Math.sin(orbit.phi) * orbit.radius;
        const y = Math.cos(orbit.phi) * orbit.radius + 0.6;
        camera.position.set(x, Math.max(y, 1.2), z);
        camera.lookAt(0, 1.1, 0);
      }

      renderer.render(scene, camera);
    };
    tick();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      rigRef.current = null;
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const material = object.material;
          if (Array.isArray(material)) material.forEach((entry) => entry.dispose());
          else material.dispose();
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [mode]);

  return (
    <div className="relative h-full w-full overflow-hidden bg-black text-white">
      <div ref={mountRef} className="absolute inset-0" />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 bg-gradient-to-b from-black/70 to-transparent p-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="pointer-events-auto inline-flex items-center gap-2 rounded-md bg-black/50 px-3 py-1.5 text-xs font-semibold text-white/90 transition hover:bg-black/70"
          >
            <ArrowLeft size={14} /> Exit
          </button>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-amber-400">Car Mechanic Simulator 2021</p>
            <p className="text-sm font-semibold">{mode === 'booth' ? 'Paint Booth — Bay 2' : 'Garage — Bay 1'}</p>
          </div>
        </div>
        <div className="pointer-events-auto flex items-center gap-2 rounded-lg bg-black/50 px-3 py-2">
          <Palette size={14} className="text-amber-400" />
          <div className="flex items-center gap-1.5">
            {CAR_COLORS.map((swatch) => (
              <button
                key={swatch}
                type="button"
                onClick={() => {
                  setSelected(swatch);
                  if (mode === 'garage') setColor(swatch);
                }}
                aria-label={`Paint ${swatch}`}
                className={`h-5 w-5 rounded-full border transition ${
                  selected === swatch ? 'border-white ring-2 ring-amber-400' : 'border-white/30 hover:border-white/70'
                }`}
                style={{ backgroundColor: swatch }}
              />
            ))}
          </div>
        </div>
      </div>

      {mode === 'booth' ? (
        <>
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/70" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p className="flex items-center gap-2 text-xs text-white/80">
              <Move size={14} /> WASD to walk, drag to look
              <span className="mx-1 text-white/30">|</span>
              <Droplets size={14} /> F to spray
              <span className="mx-1 text-white/30">|</span>
              <kbd className="rounded bg-white/15 px-1.5 py-0.5 font-mono text-[10px]">M</kbd> garage
            </p>
            <button
              type="button"
              onClick={() => setMode('garage')}
              className="pointer-events-auto rounded-md bg-amber-500 px-4 py-1.5 text-xs font-bold text-black transition hover:bg-amber-400"
            >
              Back to garage (M)
            </button>
          </div>
          {toast ? (
            <div className="pointer-events-none absolute left-1/2 top-20 flex -translate-x-1/2 items-center gap-2 rounded-md bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-black">
              <Check size={14} /> {toast}
            </div>
          ) : null}
        </>
      ) : (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Vehicle</p>
              <p className="text-lg font-bold">1998 Cobalt Coupe</p>
              <p className="text-xs text-white/60">
                Body panels restored · Paint {color.toUpperCase()} · Engine 92% · Drag to orbit
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setColor(selected);
                  rigRef.current?.setColor(selected);
                  setToast('Paint applied');
                }}
                className="pointer-events-auto rounded-md border border-white/25 px-3 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/10"
              >
                Apply selected paint
              </button>
              <button
                type="button"
                onClick={() => setMode('booth')}
                className="pointer-events-auto rounded-md bg-amber-500 px-4 py-2 text-xs font-bold text-black transition hover:bg-amber-400"
              >
                Enter paint booth
              </button>
            </div>
          </div>
        </div>
      )}

      {mode === 'garage' && toast ? (
        <div className="pointer-events-none absolute left-1/2 top-20 flex -translate-x-1/2 items-center gap-2 rounded-md bg-emerald-500/90 px-3 py-1.5 text-xs font-semibold text-black">
          <Check size={14} /> {toast}
        </div>
      ) : null}
    </div>
  );
}