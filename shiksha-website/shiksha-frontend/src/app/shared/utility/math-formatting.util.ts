import { SUPERSCRIPT_MAP } from './constant.util';

/**
 * Converts caret-based exponent notation (e.g. `2^3`, `x^10`) to
 * Unicode superscript characters (e.g. `2³`, `x¹⁰`).
 */
export function formatSuperscript(text: string): string {
  if (typeof text !== 'string') {
    console.warn('[WARNING] formatSuperscript: expected string but received', typeof text);
    return text != null ? String(text) : '';
  }
  if (!text) return text;
  return text.replace(/\^([a-zA-Z0-9()+\-]+)/g, (_, exponent: string) => {
    return [...exponent].map(ch => SUPERSCRIPT_MAP[ch] ?? ch).join('');
  });
}
