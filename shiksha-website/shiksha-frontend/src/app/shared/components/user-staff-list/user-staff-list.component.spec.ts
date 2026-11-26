import { MatSnackBarModule } from '@angular/material/snack-bar';
import { NgIdleModule } from '@ng-idle/core';
import { DatePipe } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrModule } from 'ngx-toastr';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { StaffUserCommonService } from '../../services/staff-user-common.service';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserStaffListComponent } from './user-staff-list.component';

describe('UserStaffListComponent', () => {
  let component: UserStaffListComponent;
  let fixture: ComponentFixture<UserStaffListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA],
      providers: [DatePipe],
      imports: [MatSnackBarModule, NgIdleModule.forRoot(), TranslateModule.forRoot(), RouterTestingModule, ToastrModule.forRoot(), HttpClientTestingModule, UserStaffListComponent]
    });
    fixture = TestBed.createComponent(UserStaffListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('select-all toggles the ids of the current page', () => {
    component.usersList = [{ _id: 'a' }, { _id: 'b' }];
    component.toggleSelectAll(true);
    expect([...component.selectedIds]).toEqual(['a', 'b']);
    expect(component.allPageSelected).toBe(true);
    component.toggleSelectAll(false);
    expect(component.selectedIds.size).toBe(0);
  });

  it('keeps the selection when only the page changes', () => {
    component.selectedIds.add('a');
    component.onPageChange(2);
    expect([...component.selectedIds]).toEqual(['a']);
  });

  it('clears the selection when the list reloads', () => {
    component.selectedIds.add('a');
    component.getUsersList();
    expect(component.selectedIds.size).toBe(0);
  });

  it('bulk role change sends the selected ids and the chosen role', () => {
    const service = TestBed.inject(StaffUserCommonService);
    const spy = spyOn(service, 'bulkChangeRole').and.returnValue(of({ message: 'ok', data: { updated: 2, failed: [] } }));
    component.selectedIds = new Set(['a', 'b']);
    component.roleControl.setValue('role1');
    component.confirmRoleChange();
    expect(spy).toHaveBeenCalledWith(['a', 'b'], 'role1');
  });
});
