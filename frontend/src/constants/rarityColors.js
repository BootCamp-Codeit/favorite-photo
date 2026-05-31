export const RARITY_COLORS = {
  COMMON: '#FFD700',
  RARE: '#60a5fa',
  'SUPER RARE': '#9D4EDD',
  LEGENDARY: '#FF1744',
};

export function getRarityColor(rarity) {
  const raw = String(rarity ?? 'COMMON').trim();
  if (RARITY_COLORS[raw]) return RARITY_COLORS[raw];

  const upper = raw.toUpperCase().replace(/_/g, ' ');
  if (upper === 'SUPER RARE') return RARITY_COLORS['SUPER RARE'];

  return RARITY_COLORS[upper] ?? RARITY_COLORS.COMMON;
}
