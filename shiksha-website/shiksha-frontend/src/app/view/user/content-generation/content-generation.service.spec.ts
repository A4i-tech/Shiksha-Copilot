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
});
