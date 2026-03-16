import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIdleModule } from '@ng-idle/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisablePopupComponent } from './disable-popup.component';

describe('DisablePopupComponent', () => {
  let component: DisablePopupComponent;
  let fixture: ComponentFixture<DisablePopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, HttpClientTestingModule, ToastrModule.forRoot(), DisablePopupComponent],
      providers: [{ provide: MAT_DIALOG_DATA, useValue: { data: {} } }, DatePipe],
    });
    fixture = TestBed.createComponent(DisablePopupComponent);
    component = fixture.componentInstance;
    component.tableData = { data: {} };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
