// src/utils/eventImages.js

export function getEventImage(bp, filename) {
  const folder = bp === 'sm' ? 'sm' : bp === 'md' ? 'md' : 'lg';
  return `/images/event/${folder}/${filename}`;
}

export function getRewardImage(bp) {
  const folder = bp ?? 'lg';
  return `/images/event/${folder}/reward.png`;
}
