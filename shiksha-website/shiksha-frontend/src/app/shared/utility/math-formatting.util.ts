export const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
  '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  'a': 'ᵃ', 'b': 'ᵇ', 'c': 'ᶜ', 'd': 'ᵈ', 'e': 'ᵉ',
  'f': 'ᶠ', 'g': 'ᵍ', 'h': 'ʰ', 'i': 'ⁱ', 'j': 'ʲ',
  'k': 'ᵏ', 'l': 'ˡ', 'm': 'ᵐ', 'n': 'ⁿ', 'o': 'ᵒ',
  'p': 'ᵖ', 'r': 'ʳ', 's': 'ˢ', 't': 'ᵗ', 'u': 'ᵘ',
  'v': 'ᵛ', 'w': 'ʷ', 'x': 'ˣ', 'y': 'ʸ', 'z': 'ᶻ',
  '+': '⁺', '-': '⁻', '(': '⁽', ')': '⁾',
};

/**
 * Converts caret-based exponent notation (e.g. `2^3`, `x^10`) to
 * Unicode superscript characters (e.g. `2³`, `x¹⁰`).
 */
export function formatSuperscript(text: any): string {
  if (typeof text !== 'string') return text != null ? String(text) : '';
  if (!text) return text;
  return text.replace(/\^([a-zA-Z0-9()+\-]+)/g, (_, exponent: string) => {
    return [...exponent].map(ch => SUPERSCRIPT_MAP[ch] ?? ch).join('');
  });
}
