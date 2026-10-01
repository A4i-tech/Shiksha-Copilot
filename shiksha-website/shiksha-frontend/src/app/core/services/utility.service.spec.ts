import { DatePipe } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ToastrModule } from 'ngx-toastr';

import { UtilityService } from './utility.service';

describe('UtilityService.handleError', () => {
  let service: UtilityService;
  let showError: jasmine.Spy;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DatePipe],
      imports: [RouterTestingModule, TranslateModule.forRoot(), ToastrModule.forRoot()],
    });
    service = TestBed.inject(UtilityService);
    showError = spyOn(service, 'showError');
  });

  it('hides the server message on a 500 response', () => {
    service.handleError({ status: 500, error: { message: 'Internal server error' } });
    const shown = showError.calls.mostRecent().args[0];
    expect(shown).not.toContain('Internal server error');
    expect(shown).toContain('try again');
  });

  it('keeps the server message on a 4xx response', () => {
    service.handleError({ status: 400, error: { message: 'Daily limit reached' } });
    expect(showError).toHaveBeenCalledWith('Daily limit reached');
  });

  it('joins validation errors on a 4xx response', () => {
    service.handleError({ status: 422, error: { error: ['a', 'b'] } });
    expect(showError).toHaveBeenCalledWith('a, b');
  });
});
