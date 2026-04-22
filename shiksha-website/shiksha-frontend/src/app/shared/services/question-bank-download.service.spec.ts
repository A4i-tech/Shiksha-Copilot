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

  describe('tokenizeForDocxRuns', () => {
    it('should return a single TextRun for plain text without caret notation', () => {
      const runs = service.tokenizeForDocxRuns('Hello world');
      expect(runs).toEqual([{text: "Hello world"}])
    });

    it('should split text with caret notation into multiple TextRuns', () => {
      const runs = service.tokenizeForDocxRuns('x^2 + y^3');
      expect(runs).toEqual([
        {text: "x"}, {text: "2", superScript: true},
        {text: " + y"}, {text: "3", superScript: true},
      ])
    });

    it('should handle text starting with caret notation', () => {
      const runs = service.tokenizeForDocxRuns('^2abc');
      expect(runs).toEqual([{text: "2abc", superScript: true}])
    });

    it('should handle multi-digit exponents', () => {
      const runs = service.tokenizeForDocxRuns('10^12');
      expect(runs).toEqual([
        {text: "10"}, {text: "12", superScript: true}
      ])
    });

    it('should handle exponents with parentheses', () => {
      const runs = service.tokenizeForDocxRuns('a^(2+3)');
      expect(runs).toEqual([
        {text: "a"}, {text: "(2+3)", superScript: true}
      ])
    });

    it('should return fallback TextRun for null input and log warning', () => {
      spyOn(console, 'warn');
      const runs = service.tokenizeForDocxRuns(null as unknown as string);
      expect(runs).toEqual([{text: ""}])
      expect(console.warn).toHaveBeenCalled();
    });

    it('should return fallback TextRun for undefined input and log warning', () => {
      spyOn(console, 'warn');
      const runs = service.tokenizeForDocxRuns(undefined as unknown as string);
      expect(runs).toEqual([{text: ""}])
      expect(console.warn).toHaveBeenCalled();
    });

    it('should return fallback TextRun for numeric input and log warning', () => {
      spyOn(console, 'warn');
      const runs = service.tokenizeForDocxRuns(42 as unknown as string);
      expect(runs).toEqual([{text: "42"}])
      expect(console.warn).toHaveBeenCalled();
    });

    it('should return a single empty TextRun for empty string', () => {
      spyOn(console, 'warn');
      const runs = service.tokenizeForDocxRuns('');
      expect(runs).toEqual([{text: ""}])
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
      const runs = service.tokenizeForDocxRuns('simple text');
      expect(runs).toEqual([{text: "simple text"}])
    });

    it('should handle consecutive carets', () => {
      const runs = service.tokenizeForDocxRuns('a^2b^3');
      expect(runs).toEqual([
        {text: "a"}, {text: "2b", superScript: true}, {text: "3", superScript: true}
      ])
    });

    it('should correctly tokenize a full question text with exponents', () => {
      const runs = service.tokenizeForDocxRuns('Identify the vertex of the parabola represented by the equation y = 2x^2 - 4x + 1.');
      expect(runs).toEqual([
        { text: 'Identify the vertex of the parabola represented by the equation y = 2x' },
        { text: '2', superScript: true },
        { text: ' - 4x + 1.' }
      ]);
    });
  });
});
