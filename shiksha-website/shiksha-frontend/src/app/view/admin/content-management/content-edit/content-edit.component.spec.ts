import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { ContentEditComponent } from './content-edit.component';

describe('ContentEditComponent', () => {
  let component: ContentEditComponent;
  let fixture: ComponentFixture<ContentEditComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ContentEditComponent,
      ],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'entity' ? 'chapters' : 'new'),
            }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContentEditComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    // the chapters entity loads the subject dropdown options on init
    httpMock.match(() => true).forEach((req) => req.flush({ data: { results: [] } }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('cancel should send the admin back to the list of the current entity', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.cancel();

    expect(navigateSpy).toHaveBeenCalledWith(['/content-management', 'chapters']);
  });
});

describe('ContentEditComponent (existing record)', () => {
  let component: ContentEditComponent;
  let fixture: ComponentFixture<ContentEditComponent>;
  let httpMock: HttpTestingController;

  function setup(recordId: string) {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        TranslateModule.forRoot(),
        ContentEditComponent,
      ],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({
              get: (key: string) => (key === 'entity' ? 'chapters' : recordId),
            }),
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContentEditComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
  }

  afterEach(() => {
    httpMock.verify();
  });

  function flushLoad(recordId: string, record: any) {
    httpMock
      .match(() => true)
      .forEach((req) =>
        req.request.url.endsWith(`/chapters/${recordId}`)
          ? req.flush({ data: record })
          : req.flush({ data: { results: [] } })
      );
  }

  it('is read-only for an approved record, so the form shows View and hides the submit button', () => {
    setup('chapter-1');
    fixture.detectChanges();
    flushLoad('chapter-1', { _id: 'chapter-1', status: 'approved', topics: 'Algebra' });
    fixture.detectChanges();

    expect(component.isReadonly).toBe(true);

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('View');
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).toBeNull();
  });

  it('stays editable for a draft record, so the form shows Edit and keeps the submit button', () => {
    setup('chapter-2');
    fixture.detectChanges();
    flushLoad('chapter-2', { _id: 'chapter-2', status: 'draft', topics: 'Algebra' });
    fixture.detectChanges();

    expect(component.isReadonly).toBe(false);

    const heading = fixture.nativeElement.querySelector('h1');
    expect(heading.textContent).toContain('Edit');
    expect(fixture.nativeElement.querySelector('button[type="submit"]')).not.toBeNull();
  });

  it('save() no-ops on a read-only record, as a defense-in-depth guard behind the hidden submit button', () => {
    setup('chapter-1');
    fixture.detectChanges();
    flushLoad('chapter-1', { _id: 'chapter-1', status: 'approved', topics: 'Algebra' });
    fixture.detectChanges();

    component.save();

    httpMock.expectNone((r) => r.method === 'PUT');
  });
});
