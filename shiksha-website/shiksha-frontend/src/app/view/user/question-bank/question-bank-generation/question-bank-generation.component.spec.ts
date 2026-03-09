import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrModule } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';
import { NgIdleModule } from '@ng-idle/core';
import { ClipboardService } from 'ngx-clipboard';
import { TimerService } from 'src/app/shared/services/timer.service';

import { QuestionBankGenerationComponent } from './question-bank-generation.component';

describe('QuestionBankGenerationComponent', () => {
  let component: QuestionBankGenerationComponent;
  let fixture: ComponentFixture<QuestionBankGenerationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        NgIdleModule.forRoot(),
        NoopAnimationsModule
      ],
      declarations: [QuestionBankGenerationComponent],
      providers: [
        DatePipe,
        ClipboardService,
        TimerService
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });
    fixture = TestBed.createComponent(QuestionBankGenerationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
