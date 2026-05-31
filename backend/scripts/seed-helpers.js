import {
  CARD_DESCRIPTIONS,
  CARD_IMAGES,
  CARD_NAME_PARTS,
  GRADE_WEIGHTS,
  GRADES,
} from './seed-data.js';

export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function pick(arr) {
  return arr[randomInt(0, arr.length - 1)];
}

export function pickWeighted(items, weights) {
  const total = weights.reduce((a, b) => a + b, 0);
  let r = Math.random() * total;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

export function shuffle(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randomInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function daysAgo(days) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(randomInt(9, 22), randomInt(0, 59), randomInt(0, 59), 0);
  return d;
}

export function buildCardName(index) {
  const { artists, places, events, moods } = CARD_NAME_PARTS;
  const pattern = index % 4;
  if (pattern === 0) return `${pick(artists)} ${pick(events)} #${index + 1}`;
  if (pattern === 1) return `${pick(places)} ${pick(moods)} Photocard ${index + 1}`;
  if (pattern === 2) return `${pick(artists)} x ${pick(places)} ${pick(events)}`;
  return `${pick(moods)} ${pick(artists)} Collection ${index + 1}`;
}

export function buildPhotoCard(index, creatorUserId) {
  const grade = pickWeighted(GRADES, GRADE_WEIGHTS);
  const minPrice =
    grade === 'LEGENDARY' ? randomInt(8000, 20000)
    : grade === 'SUPER RARE' ? randomInt(4000, 12000)
    : grade === 'RARE' ? randomInt(1500, 6000)
    : randomInt(300, 2500);

  return {
    creatorUserId,
    name: buildCardName(index),
    description: pick(CARD_DESCRIPTIONS),
    genre: pick(GENRES),
    grade,
    minPrice,
    totalSupply: randomInt(3, 30),
    imageUrl: CARD_IMAGES[index % CARD_IMAGES.length],
    regDate: daysAgo(randomInt(1, 120)),
  };
}

export function priceForGrade(grade, minPrice) {
  const mult =
    grade === 'LEGENDARY' ? randomInt(12, 18) / 10
    : grade === 'SUPER RARE' ? randomInt(10, 15) / 10
    : grade === 'RARE' ? randomInt(8, 12) / 10
    : randomInt(6, 10) / 10;
  return Math.max(minPrice, Math.round(minPrice * mult));
}
