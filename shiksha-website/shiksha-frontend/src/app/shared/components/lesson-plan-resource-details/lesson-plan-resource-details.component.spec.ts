import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NgIdleModule } from '@ng-idle/core';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { LessonPlanResourceDetailsComponent } from './lesson-plan-resource-details.component';

describe('LessonPlanResourceDetailsComponent (curator chapters)', () => {
  const chapter = (board: string, standard: number, subjectName: string) => ({
    board,
    medium: 'english',
    standard,
    subject: [{ subjectName }],
  });

  function curatorClasses(chapters: any[]): any[] {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        TranslateModule.forRoot(),
        NgIdleModule.forRoot(),
        LessonPlanResourceDetailsComponent,
      ],
      providers: [DatePipe],
    });
    const component = TestBed.createComponent(LessonPlanResourceDetailsComponent).componentInstance;
    return component['curatorClasses'](chapters);
  }

  it('lists one entry for each board, medium, class and subject, whatever the number of chapters', () => {
    const entries = curatorClasses([
      chapter('CBSE', 8, 'Science'),
      chapter('CBSE', 8, 'Science'),
      chapter('CBSE', 9, 'Science'),
      chapter('ICSE', 8, 'Science'),
      chapter('CBSE', 8, 'Maths'),
    ]);

    expect(entries.map((entry) => `${entry.board}|${entry.class}|${entry.subject}`)).toEqual([
      'CBSE|8|Science',
      'CBSE|9|Science',
      'ICSE|8|Science',
      'CBSE|8|Maths',
    ]);
  });
});
