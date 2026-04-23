import { formatSuperscript } from './math-formatting.util';

describe('math-formatting.util', () => {
  describe('formatSuperscript()', () => {
    it('should format numbers correctly', () => {
      expect(formatSuperscript('x^2')).toBe('x²');
      expect(formatSuperscript('2^10')).toBe('2¹⁰');
    });

    it('should format variable exponents correctly', () => {
      expect(formatSuperscript('2^n')).toBe('2ⁿ');
      expect(formatSuperscript('y^x')).toBe('yˣ');
      expect(formatSuperscript('a^z')).toBe('aᶻ');
      expect(formatSuperscript('10^a')).toBe('10ᵃ');
    });

    it('should format exponents with symbols', () => {
      expect(formatSuperscript('2^(n-1)')).toBe('2⁽ⁿ⁻¹⁾');
      expect(formatSuperscript('x^(2+y)')).toBe('x⁽²⁺ʸ⁾');
    });

    it('should keep letters without mappings unchanged', () => {
      // 'q' is not in the map, so it stays 'q'
      expect(formatSuperscript('2^q')).toBe('2q');
    });

    it('should handle non-strings safely', () => {
      expect(formatSuperscript(null as any)).toBe('');
      expect(formatSuperscript(undefined as any)).toBe('');
      expect(formatSuperscript(123 as any)).toBe('123');
      expect(formatSuperscript({ text: 'x^2' } as any)).toBe('[object Object]');
    });

    it('should handle empty strings', () => {
      expect(formatSuperscript('')).toBe('');
    });

    it('should handle strings without exponent', () => {
      expect(formatSuperscript('abc')).toBe('abc');
      expect(formatSuperscript('123')).toBe('123');
    });
  });
});
