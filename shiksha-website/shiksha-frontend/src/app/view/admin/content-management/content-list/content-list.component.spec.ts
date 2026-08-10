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
import { of } from 'rxjs';

import { ContentListComponent } from './content-list.component';

describe('ContentListComponent', () => {
  let component: ContentListComponent;
  let fixture: ComponentFixture<ContentListComponent>;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientTestingModule,
        ContentListComponent,
      ],
      providers: [
        DatePipe,
        {
          provide: ActivatedRoute,
          useValue: { paramMap: of({ get: () => 'chapters' }) },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContentListComponent);
    component = fixture.componentInstance;
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
    fixture.detectChanges();
    // the initial load fires a records request, drain it before each test
    httpMock.match(() => true).forEach((req) => req.flush({ items: [], total: 0 }));
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should resolve the entity config from the route segment', () => {
    expect(component.config.key).toBe('chapters');
  });

  it('backNavigation should send the admin back to the dashboard', () => {
    const navigateSpy = spyOn(router, 'navigate');

    component.backNavigation();

    expect(navigateSpy).toHaveBeenCalledWith(['/dashboard']);
  });

  it('checkUpload should call the generic bulk-upload route for the current segment', () => {
    component.uploadRows = [{ chapterNumber: 1 }];
    component.checkUpload();

    const req = httpMock.expectOne(
      (r) => r.url.endsWith('/chapters/bulk-upload') && r.body.dryRun === true
    );
    req.flush({ total: 1, valid: 1, invalid: 0, inserted: 0, rows: [] });

    expect(component.isUploading).toBeFalse();
  });

  it('saveUpload should call the generic bulk-upload route with dryRun false', () => {
    component.uploadRows = [{ chapterNumber: 1 }];
    component.saveUpload();

    const req = httpMock.expectOne(
      (r) => r.url.endsWith('/chapters/bulk-upload') && r.body.dryRun === false
    );
    req.flush({ total: 1, valid: 1, invalid: 0, inserted: 1, rows: [] });
    // saveUpload reloads the list on success, drain that request too
    httpMock.match(() => true).forEach((r) => r.flush({ items: [], total: 0 }));

    expect(component.uploadCanSave).toBeFalse();
  });
});
