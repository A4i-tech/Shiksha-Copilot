const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  'n': 'ⁿ', 'x': 'ˣ', 'y': 'ʸ',
  '+': '⁺', '-': '⁻', '(': '⁽', ')': '⁾',
};

/**
 * Converts caret-based exponent notation (e.g. `2^3`, `x^10`) to
 * Unicode superscript characters (e.g. `2³`, `x¹⁰`).
 */
export function formatSuperscript(text: string): string {
  if (!text) return text;
  return text.replace(/\^([0-9nxy()+\-]+)/g, (_, exponent: string) => {
    return [...exponent].map(ch => SUPERSCRIPT_MAP[ch] ?? ch).join('');
  });
}
