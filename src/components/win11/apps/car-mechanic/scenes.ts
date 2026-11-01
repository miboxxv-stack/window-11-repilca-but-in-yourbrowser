import * as THREE from 'three';

export const CAR_COLORS = ['#c81e2e', '#f59e0b', '#0ea5e9', '#10b981', '#a855f7', '#e2e8f0', '#111827'];

export interface CarRig {
  group: THREE.Group;
  setColor: (color: string) => void;
}

const mat = (color: string, roughness = 0.6, metalness = 0.2) =>
  new THREE.MeshStandardMaterial({ color: new THREE.Color(color), roughness, metalness });

/** A stylised coupe built from primitives, so the scene never depends on external assets. */
export function createCar(color: string): CarRig {
  const group = new THREE.Group();
  const paint = mat(color, 0.32, 0.6);

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(4.4, 0.62, 1.86), paint);
  chassis.position.y = 0.78;
  chassis.castShadow = true;

  const hood = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.22, 1.7), paint);
  hood.position.set(1.42, 1.18, 0);
  hood.castShadow = true;

  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.95, 0.62, 1.62), paint);
  cabin.position.set(-0.35, 1.36, 0);
  cabin.castShadow = true;

  const glass = new THREE.Mesh(
    new THREE.BoxGeometry(1.8, 0.42, 1.52),
    new THREE.MeshStandardMaterial({ color: '#0f172a', roughness: 0.1, metalness: 0.9, transparent: true, opacity: 0.85 }),
  );
  glass.position.set(-0.35, 1.44, 0);

  const wheelGeo = new THREE.CylinderGeometry(0.44, 0.44, 0.34, 22);
  const tyre = mat('#15181d', 0.95, 0);
  const rimGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.36, 16);
  const rim = mat('#cbd5e1', 0.35, 0.9);

  [
    [1.42, 0.95],
    [1.42, -0.95],
    [-1.42, 0.95],
    [-1.42, -0.95],
  ].forEach(([x, z]) => {
    const w = new THREE.Mesh(wheelGeo, tyre);
    w.rotation.x = Math.PI / 2;
    w.position.set(x, 0.46, z);
    w.castShadow = true;
    group.add(w);
    const r = new THREE.Mesh(rimGeo, rim);
    r.rotation.x = Math.PI / 2;
    r.position.set(x, 0.46, z);
    group.add(r);
  });

  const lightGeo = new THREE.BoxGeometry(0.1, 0.18, 0.5);
  const head = mat('#fff8dc', 0.2, 0.1);
  [-0.55, 0.55].forEach((z) => {
    const l = new THREE.Mesh(lightGeo, head);
    l.position.set(2.2, 0.92, z);
    group.add(l);
  });
  const tail = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.16, 1.3), mat('#ff2d2d', 0.3, 0.2));
  tail.position.set(-2.2, 0.92, 0);
  group.add(tail);

  group.add(chassis, hood, cabin, glass);

  return {
    group,
    setColor: (next: string) => paint.color.set(next),
  };
}

function panelWall(width: number, height: number, color: string) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.14), mat(color, 0.75, 0.05));
  mesh.receiveShadow = true;
  return mesh;
}

/** Bright, tiled spray booth with an extraction wall and ceiling light panels. */
export function createPaintBooth(): THREE.Group {
  const room = new THREE.Group();

  const floor = new THREE.Mesh(new THREE.BoxGeometry(13, 0.2, 11), mat('#dfe4ea', 0.85, 0.02));
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  room.add(floor);

  const tileLine = new THREE.MeshBasicMaterial({ color: '#bcc5cf' });
  for (let i = -6; i <= 6; i += 1) {
    const line = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 11), tileLine);
    line.position.set(i, 0.005, 0);
    room.add(line);
  }

  const back = panelWall(13, 5.2, '#f3f6f9');
  back.position.set(0, 2.6, -5.4);
  const left = panelWall(11, 5.2, '#eef2f6');
  left.rotation.y = Math.PI / 2;
  left.position.set(-6.4, 2.6, 0);
  const right = left.clone();
  right.position.x = 6.4;

  const extractor = new THREE.Mesh(new THREE.BoxGeometry(9, 3.2, 0.3), mat('#b9c3cf', 0.9, 0.05));
  extractor.position.set(0, 2.1, -5.25);

  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(13, 0.2, 11), mat('#f7f9fb', 0.9, 0.02));
  ceiling.position.y = 5.2;

  room.add(back, left, right, extractor, ceiling);

  const lightMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#f4f7ff', emissiveIntensity: 1.4 });
  [-4.2, 0, 4.2].forEach((x) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.1, 1.5), lightMat);
    panel.position.set(x, 5.05, 0);
    room.add(panel);
  });

  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(3.6, 3.7, 0.18, 40), mat('#9aa7b6', 0.7, 0.3));
  plinth.position.y = 0.1;
  plinth.receiveShadow = true;
  room.add(plinth);

  return room;
}

/** Concrete workshop with a bench, toolbox and a lift the car sits on. */
export function createGarage(): THREE.Group {
  const room = new THREE.Group();

  const floor = new THREE.Mesh(new THREE.BoxGeometry(15, 0.2, 13), mat('#3b424b', 0.95, 0.05));
  floor.position.y = -0.1;
  floor.receiveShadow = true;
  room.add(floor);

  const wallMat = '#525b66';
  const back = panelWall(15, 5.6, wallMat);
  back.position.set(0, 2.8, -6.4);
  const left = panelWall(13, 5.6, wallMat);
  left.rotation.y = Math.PI / 2;
  left.position.set(-7.4, 2.8, 0);
  room.add(back, left);

  const bench = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.18, 1.1), mat('#8a5a2b', 0.8, 0.1));
  bench.position.set(-4.6, 0.95, -5.6);
  const benchLegs = new THREE.Mesh(new THREE.BoxGeometry(4, 0.9, 0.9), mat('#5c6873', 0.9, 0.2));
  benchLegs.position.set(-4.6, 0.48, -5.6);
  room.add(bench, benchLegs);

  const box = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.85, 0.6), mat('#c0392b', 0.6, 0.3));
  box.position.set(4.9, 1.5, -5.9);
  const boxes = new THREE.Mesh(new THREE.BoxGeometry(1.1, 1.6, 0.6), mat('#7f1d1d', 0.7, 0.3));
  boxes.position.set(4.9, 0.8, -5.9);
  room.add(box, boxes);

  const lift = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.34, 2.6), mat('#2b3138', 0.8, 0.4));
  lift.position.y = 0.17;
  lift.receiveShadow = true;
  room.add(lift);

  [-2.1, 2.1].forEach((x) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.1, 0.34), mat('#f0b323', 0.6, 0.4));
    post.position.set(x, 1.05, -2.2);
    room.add(post);
  });

  const lampMat = new THREE.MeshStandardMaterial({ color: '#ffffff', emissive: '#ffe9b8', emissiveIntensity: 1.1 });
  [-3, 3].forEach((x) => {
    const panel = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.12, 0.7), lampMat);
    panel.position.set(x, 4.6, 0);
    room.add(panel);
  });

  return room;
}