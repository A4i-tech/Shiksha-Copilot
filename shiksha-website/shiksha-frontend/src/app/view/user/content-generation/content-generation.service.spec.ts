import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ContentGenerationService } from './content-generation.service';

describe('ContentGenerationService', () => {
  let service: ContentGenerationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(ContentGenerationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('reads the chapters of a curator from the curator route, on the Draft tab', () => {
    service.getTopicsSubtopics('CBSE', undefined, undefined, undefined, true).subscribe();

    const req = httpMock.expectOne((r) => r.url.endsWith('/curator/content/chapters'));
    expect(req.request.params.get('includeDeleted')).toBe('3');
    expect(req.request.params.get('filter[board]')).toBe('CBSE');
    req.flush({});
  });

  it('reads the chapters of a teacher from the chapter list route, with no includeDeleted', () => {
    service.getTopicsSubtopics('CBSE').subscribe();

    const req = httpMock.expectOne((r) => r.url.endsWith('/chapter/list'));
    expect(req.request.params.has('includeDeleted')).toBeFalse();
    req.flush({});
  });

  describe('getSectionTemplate', () => {
    const chapter: any = { board: 'KSEEB', medium: 'english', standard: 9, subject: [{ subjectName: 'science_1' }] };
    const templates = (...workFlowIds: string[]) => workFlowIds.map((workFlowId, i) => ({ _id: `t${i}`, name: workFlowId, workFlowId, sections: [] }));

    function ask(response: object[]) {
      let result: any;
      let error: any;
      service.getSectionTemplate(chapter, 'lesson_plan').subscribe({ next: (value) => (result = value), error: (err) => (error = err) });
      const req = httpMock.expectOne((r) => r.url.endsWith('/lesson-plan-template/list'));
      expect(req.request.params.get('filter[subjects]')).toBe('science_1');
      expect(req.request.params.get('filter[type]')).toBe('lesson_plan');
      req.flush({ data: response });
      return { result, error };
    }

    it('takes the only template', () => {
      expect(ask(templates('telangana-physics-chapter')).result._id).toBe('t0');
    });

    it('takes the subtopic template when a chapter template exists beside it', () => {
      expect(ask(templates('karnataka-science-chapter', 'karnataka-science-subtopic-lesson-plan')).result._id).toBe('t1');
    });

    it('fails with a message that names the chapter when none matches', () => {
      const message = ask([]).error.error.message;
      expect(message).toContain('No single');
      expect(message).toContain('KSEEB, english, class 9, science_1');
    });

    it('fails when several templates match and none is a subtopic one', () => {
      const message = ask(templates('a-chapter', 'b-chapter')).error.error.message;
      expect(message).toContain('No single');
      expect(message).toContain('science_1');
    });
  });
});
