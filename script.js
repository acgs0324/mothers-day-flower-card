const flowersEl = document.getElementById('flowers');
const scene = document.getElementById('scene');
const bloomMoreBtn = document.getElementById('bloomMore');
const showerBtn = document.getElementById('shower');

const palettes = [
  ['#ff6f91', '#ff8fb1', '#ffc0d5'],
  ['#ff5d5d', '#ff7c6b', '#ffb3a4'],
  ['#ff8a3d', '#ffb15f', '#ffd3a8'],
  ['#ffd45e', '#ffe486', '#fff2b5'],
  ['#f062c0', '#ff8bdd', '#ffc2f0'],
  ['#8f7cff', '#b29cff', '#d7cdff'],
  ['#5aa9ff', '#8bc6ff', '#cbe6ff'],
  ['#f79ecb', '#ffbdd9', '#ffe0ee']
];

const flowerVariants = [
  { className: 'variant-round', petalCount: 8 },
  { className: 'variant-daisy', petalCount: 12 },
  { className: 'variant-tulip', petalCount: 3 },
  { className: 'variant-star', petalCount: 6 },
  { className: 'variant-rose', petalCount: 10 }
];

const butterflyPalettes = [
  ['#ff8db8', '#ffc3dc'],
  ['#ffd57e', '#fff1b8'],
  ['#9bc7ff', '#d7ecff'],
  ['#c59cff', '#ecd7ff']
];

let flowerCount = 0;
const maxFlowers = 90;

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function petalGradient(colors) {
  return `linear-gradient(180deg, ${colors[2]} 0%, ${colors[1]} 48%, ${colors[0]} 100%)`;
}

function butterflyGradient(colors) {
  return `linear-gradient(180deg, ${colors[1]} 0%, ${colors[0]} 100%)`;
}

function petalTransform(variantName, index, count) {
  if (variantName === 'variant-tulip') {
    return [
      'rotate(-28deg) translateY(4%)',
      'rotate(0deg) translateY(-8%)',
      'rotate(28deg) translateY(4%)'
    ][index];
  }

  const angle = (360 / count) * index;
  const offset = variantName === 'variant-rose' ? rand(-4, 4) : 0;
  const lift = variantName === 'variant-daisy' ? -18 : variantName === 'variant-star' ? -13 : -8;
  return `rotate(${angle + offset}deg) translateY(${lift}%)`;
}

function createFlower(xPercent, scale = 1, delay = 0) {
  if (flowerCount >= maxFlowers) return;
  flowerCount += 1;

  const size = rand(38, 78) * scale;
  const stemH = rand(120, 290) * Math.min(scale + 0.12, 1.28);
  const palette = pick(palettes);
  const variant = pick(flowerVariants);
  const tilt = rand(-7, 7);
  const swayAmp = rand(-8, 8);
  const swayDur = rand(2.6, 5.6);

  const flower = document.createElement('div');
  flower.className = `flower ${variant.className}`;
  flower.style.left = `${xPercent}%`;
  flower.style.width = `${size}px`;
  flower.style.height = `${stemH + size}px`;
  flower.style.setProperty('--size', size.toFixed(1));
  flower.style.setProperty('--stemH', `${stemH.toFixed(1)}px`);
  flower.style.setProperty('--baseTilt', tilt.toFixed(2));
  flower.style.setProperty('--swayAmp', swayAmp.toFixed(2));
  flower.style.setProperty('--swayDur', `${swayDur.toFixed(2)}s`);
  flower.style.setProperty('--delay', `${delay.toFixed(2)}s`);
  flower.style.animationDelay = `${delay.toFixed(2)}s`;

  const sway = document.createElement('div');
  sway.className = 'sway';

  const stem = document.createElement('div');
  stem.className = 'stem';

  const bloom = document.createElement('div');
  bloom.className = 'bloom';
  bloom.style.setProperty('--petalColor', petalGradient(palette));

  for (let i = 0; i < variant.petalCount; i += 1) {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.setProperty('--petalColor', petalGradient(palette));
    petal.style.transform = petalTransform(variant.className, i, variant.petalCount);
    bloom.appendChild(petal);
  }

  const center = document.createElement('div');
  center.className = 'center';
  bloom.appendChild(center);

  const leftLeaf = document.createElement('div');
  leftLeaf.className = 'leaf left';
  leftLeaf.style.setProperty('--leafY', rand(42, stemH * 0.7).toFixed(1));

  const rightLeaf = document.createElement('div');
  rightLeaf.className = 'leaf right';
  rightLeaf.style.setProperty('--leafY', rand(42, stemH * 0.72).toFixed(1));

  sway.appendChild(stem);
  sway.appendChild(leftLeaf);
  sway.appendChild(rightLeaf);
  sway.appendChild(bloom);
  flower.appendChild(sway);
  flowersEl.appendChild(flower);

  if (Math.random() < 0.45) {
    setTimeout(() => releasePetals(xPercent, palette, Math.floor(rand(1, 3))), rand(1800, 6500));
  }
}

function seedGarden() {
  const isMobile = window.innerWidth <= 768;
  const total = isMobile ? 68 : 56;
  const positions = [];

  for (let i = 0; i < total; i += 1) {
    positions.push((i / (total - 1)) * 100);
  }

  positions
    .sort(() => Math.random() - 0.5)
    .forEach((x, i) => {
      const depth = isMobile
        ? 0.68 + (x > 12 && x < 88 ? rand(0.16, 0.52) : rand(0.02, 0.24))
        : 0.74 + (x > 18 && x < 82 ? rand(0.15, 0.46) : rand(0, 0.22));

      createFlower(
        Math.max(3, Math.min(97, x + rand(-1.2, 1.2))),
        depth,
        i * 0.04
      );
    });
}

function addMoreFlowers(count = window.innerWidth <= 768 ? 12 : 14) {
  for (let i = 0; i < count; i += 1) {
    createFlower(rand(4, 96), rand(0.78, 1.25), i * 0.02);
  }
}

function releasePetals(xPercent = rand(10, 90), palette = pick(palettes), amount = 16) {
  for (let i = 0; i < amount; i += 1) {
    const petal = document.createElement('div');
    petal.className = 'petal-fall';
    petal.style.left = `${xPercent + rand(-8, 8)}%`;
    petal.style.top = `${rand(22, 68)}%`;
    petal.style.setProperty('--color', petalGradient(palette));
    petal.style.setProperty('--driftX', `${rand(-120, 120)}px`);
    petal.style.setProperty('--spin', `${rand(180, 880)}deg`);
    petal.style.animationDuration = `${rand(4.5, 8.5)}s`;
    petal.style.animationDelay = `${rand(0, 0.6)}s`;
    scene.appendChild(petal);
    setTimeout(() => petal.remove(), 9000);
  }
}

function createSparkles() {
  for (let i = 0; i < 22; i += 1) {
    const spark = document.createElement('div');
    spark.className = 'sparkle';
    spark.style.left = `${rand(4, 96)}%`;
    spark.style.top = `${rand(8, 70)}%`;
    spark.style.setProperty('--dur', `${rand(1.6, 3.8)}s`);
    spark.style.animationDelay = `${rand(0, 3)}s`;
    scene.appendChild(spark);
  }
}

function createButterfly(delay = 0) {
  const butterfly = document.createElement('div');
  const palette = pick(butterflyPalettes);
  const size = rand(38, 72);

  butterfly.className = 'butterfly';
  butterfly.style.setProperty('--wingColor', butterflyGradient(palette));
  butterfly.style.setProperty('--butterfly-size', size.toFixed(1));
  butterfly.style.setProperty('--butterflyScale', rand(0.95, 1.28).toFixed(2));
  butterfly.style.setProperty('--flightDur', `${rand(16, 28).toFixed(2)}s`);
  butterfly.style.setProperty('--flightDelay', `${delay.toFixed(2)}s`);
  butterfly.style.setProperty('--flapDur', `${rand(0.26, 0.46).toFixed(2)}s`);
  butterfly.style.setProperty('--yStart', `${rand(6, 82).toFixed(1)}vh`);
  butterfly.style.setProperty('--yMidA', `${rand(0, 88).toFixed(1)}vh`);
  butterfly.style.setProperty('--yMidB', `${rand(4, 90).toFixed(1)}vh`);
  butterfly.style.setProperty('--yMidC', `${rand(0, 86).toFixed(1)}vh`);
  butterfly.style.setProperty('--yEnd', `${rand(6, 84).toFixed(1)}vh`);

  const flap = document.createElement('div');
  flap.className = 'flap';

  ['left', 'right'].forEach((sideName) => {
    const side = document.createElement('div');
    side.className = `side ${sideName}`;

    ['top', 'bottom'].forEach((wingName) => {
      const wing = document.createElement('div');
      wing.className = `wing ${wingName}`;
      side.appendChild(wing);
    });

    flap.appendChild(side);
  });

  const body = document.createElement('div');
  body.className = 'body';
  const head = document.createElement('div');
  head.className = 'head';
  const face = document.createElement('div');
  face.className = 'face';

  ['left', 'right'].forEach((side) => {
    const eye = document.createElement('div');
    eye.className = `eye ${side}`;
    face.appendChild(eye);

    const blush = document.createElement('div');
    blush.className = `blush ${side}`;
    face.appendChild(blush);

    const antenna = document.createElement('div');
    antenna.className = `antenna ${side}`;
    flap.appendChild(antenna);
  });

  head.appendChild(face);
  flap.appendChild(body);
  flap.appendChild(head);
  butterfly.appendChild(flap);

  return butterfly;
}

function createButterflies() {
  const butterfliesEl = document.createElement('div');
  butterfliesEl.className = 'butterflies';

  const total = window.innerWidth <= 768 ? 6 : 8;
  for (let i = 0; i < total; i += 1) {
    butterfliesEl.appendChild(createButterfly(i * rand(1.2, 2.8)));
  }

  scene.appendChild(butterfliesEl);
}

scene.addEventListener('pointerdown', (event) => {
  const rect = scene.getBoundingClientRect();
  const xPercent = ((event.clientX - rect.left) / rect.width) * 100;
  releasePetals(xPercent, pick(palettes), Math.floor(rand(10, 22)));
});

bloomMoreBtn.addEventListener('click', () => addMoreFlowers(10));
showerBtn.addEventListener('click', () => {
  for (let i = 0; i < 7; i += 1) {
    setTimeout(() => releasePetals(rand(6, 94), pick(palettes), Math.floor(rand(8, 18))), i * 180);
  }
});

seedGarden();
createSparkles();
createButterflies();
setTimeout(() => releasePetals(50, pick(palettes), 24), 1400);

function createCherryTree(xPercent, scale = 1) {
  const orchard = document.querySelector('.orchard');

  const tree = document.createElement('div');
  tree.className = 'tree';
  tree.style.left = `${xPercent}%`;
  tree.style.transform = `translateX(-50%) scale(${scale})`;

  const trunk = document.createElement('div');
  trunk.className = 'branch';
  trunk.style.height = '60%';
  trunk.style.left = '50%';
  trunk.style.bottom = '0';

  tree.appendChild(trunk);

  for (let i = 0; i < 14; i++) {
    const branch = document.createElement('div');
    branch.className = 'branch';

    const height = rand(60, 140);
    const angle = rand(-40, 40);

    branch.style.height = `${height}px`;
    branch.style.bottom = `${rand(30, 120)}px`;
    branch.style.left = '50%';
    branch.style.transform = `rotate(${angle}deg)`;

    tree.appendChild(branch);

    const blossoms = Math.floor(rand(6, 14));

    for (let j = 0; j < blossoms; j++) {
      const flower = document.createElement('div');
      flower.className = 'blossom';
      flower.style.left = `${rand(-20, 20)}px`;
      flower.style.top = `${rand(0, height)}px`;
      branch.appendChild(flower);
    }
  }

  orchard.appendChild(tree);
}

function seedCherryBlossoms() {
  createCherryTree(12, 1.2);
  createCherryTree(85, 1.1);
  createCherryTree(45, 0.9);
}

seedCherryBlossoms();