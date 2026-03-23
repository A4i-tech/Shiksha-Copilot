import { FormControl } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIdleModule } from '@ng-idle/core';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDropdownComponent } from './form-dropdown.component';

describe('FormDropdownComponent', () => {
  let component: FormDropdownComponent;
  let fixture: ComponentFixture<FormDropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [DatePipe],
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, TranslateModule.forRoot(), FormDropdownComponent]
    });
    fixture = TestBed.createComponent(FormDropdownComponent);
    component = fixture.componentInstance;
    component.config = { hideLabel: false, title: "test", defaultSelectLabel: "none", optionList: [] } as any;
    component.config = { hideLabel: false, bindLable: 'Test', bindValue: 'Test' } as any;
    component.dropDownCtrl = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
