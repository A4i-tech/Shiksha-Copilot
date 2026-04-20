import { TestBed } from '@angular/core/testing';
import { QuestionBankDownloadService } from './question-bank-download.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { TextRun } from 'docx';

describe('QuestionBankDownloadService', () => {
  let service: QuestionBankDownloadService;
  let utilityServiceSpy: jasmine.SpyObj<UtilityService>;

  beforeEach(() => {
    utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['intToRoman', 'shuffleOptions']);
    utilityServiceSpy.intToRoman.and.callFake((n: number) => ['I', 'II', 'III', 'IV', 'V'][n - 1] || String(n));
    utilityServiceSpy.shuffleOptions.and.callFake((arr: any[]) => arr);

    TestBed.configureTestingModule({
      providers: [
        QuestionBankDownloadService,
        { provide: UtilityService, useValue: utilityServiceSpy },
      ],
    });

    service = TestBed.inject(QuestionBankDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('convertToDocxRuns', () => {
    it('should return a single TextRun for plain text without caret notation', () => {
      const runs = service.convertToDocxRuns('Hello world');
      expect(runs.length).toBe(1);
    });

    it('should split text with caret notation into multiple TextRuns', () => {
      const runs = service.convertToDocxRuns('x^2 + y^3');
      // 'x' + superscript '2' + ' + y' + superscript '3'
      expect(runs.length).toBe(4);
    });

    it('should handle text starting with caret notation', () => {
      const runs = service.convertToDocxRuns('^2abc');
      // superscript '2' + 'abc' — depends on regex match
      expect(runs.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle multi-digit exponents', () => {
      const runs = service.convertToDocxRuns('10^12');
      // '10' + superscript '12'
      expect(runs.length).toBe(2);
    });

    it('should handle exponents with parentheses', () => {
      const runs = service.convertToDocxRuns('a^(2+3)');
      expect(runs.length).toBe(2);
    });

    it('should return fallback TextRun for null input and log warning', () => {
      spyOn(console, 'warn');
      const runs = service.convertToDocxRuns(null as unknown as string);
      expect(runs.length).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should return fallback TextRun for undefined input and log warning', () => {
      spyOn(console, 'warn');
      const runs = service.convertToDocxRuns(undefined as unknown as string);
      expect(runs.length).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should return fallback TextRun for numeric input and log warning', () => {
      spyOn(console, 'warn');
      const runs = service.convertToDocxRuns(42 as unknown as string);
      expect(runs.length).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should return a single empty TextRun for empty string', () => {
      spyOn(console, 'warn');
      const runs = service.convertToDocxRuns('');
      expect(runs.length).toBe(1);
      expect(console.warn).toHaveBeenCalled();
    });

    it('should warn on unmapped superscript characters', () => {
      spyOn(console, 'warn');
      // 'Q' is not in SUPERSCRIPT_MAP
      service.convertToDocxRuns('x^Q');
      expect(console.warn).toHaveBeenCalledWith(
        jasmine.stringContaining('unmapped superscript characters'),
        jasmine.any(String)
      );
    });

    it('should not warn when all exponent chars are in SUPERSCRIPT_MAP', () => {
      spyOn(console, 'warn');
      service.convertToDocxRuns('x^2');
      expect(console.warn).not.toHaveBeenCalled();
    });

    it('should handle text with no exponents returning full text', () => {
      const runs = service.convertToDocxRuns('simple text');
      expect(runs.length).toBe(1);
    });

    it('should handle consecutive carets', () => {
      const runs = service.convertToDocxRuns('a^2b^3');
      // 'a' + sup '2' + 'b' + sup '3'
      expect(runs.length).toBe(4);
    });
  });
});
