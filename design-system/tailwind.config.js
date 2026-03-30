/** @type {import('tailwindcss').Config} */
const tokens = require('./tokens/design-tokens.json');

// Resolve simple token references like "{colors.primary.900}" to actual values
function resolveRef(val, tokensRoot) {
  if (typeof val !== 'string') return val;
  const m = val.match(/^\{(.+)\}$/);
  if (!m) return val;
  const path = m[1].split('.');
  let cur = tokensRoot;
  for (const p of path) {
    if (cur == null || typeof cur !== 'object' || !(p in cur)) return val;
    cur = cur[p];
  }
  return typeof cur === 'string' ? cur : val;
}

function resolveObject(obj, tokensRoot) {
  if (typeof obj !== 'object' || obj == null) return obj;
  const out = {};
  for (const k of Object.keys(obj)) {
    const v = obj[k];
    if (typeof v === 'object' && v !== null) out[k] = resolveObject(v, tokensRoot);
    else out[k] = resolveRef(v, tokensRoot);
  }
  return out;
}

function flatten(obj, prefix = '') {
  let out = {};
  for (const k of Object.keys(obj)) {
    const key = prefix ? `${prefix}-${k}` : k;
    if (typeof obj[k] === 'object' && obj[k] !== null) out = { ...out, ...flatten(obj[k], key) };
    else out[key] = obj[k];
  }
  return out;
}

const semanticResolved = tokens.semantic ? resolveObject(tokens.semantic, tokens) : {};
const semanticFlat = flatten(semanticResolved);

module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './stories/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      // keep primitives available under their original keys
      colors: {
        ...tokens.colors,
        // expose structured semantic group and also flattened aliases
        semantic: semanticResolved,
        ...semanticFlat
      },
      // typography primitives mapped into Tailwind theme
      fontFamily: tokens.type && tokens.type.family ? tokens.type.family : {},
      fontWeight: tokens.type && tokens.type.weight ? tokens.type.weight : {},
      lineHeight: tokens.type && tokens.type.leading ? tokens.type.leading : {},
      letterSpacing: tokens.type && tokens.type.tracking ? tokens.type.tracking : {},
      spacing: tokens.spacing,
      fontSize: tokens.fontSizes,
      borderRadius: tokens.radii
    }
  },
  plugins: []
};
