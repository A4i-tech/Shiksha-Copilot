import { FormBuilder } from '@angular/forms';
import { UserManageComponent } from './user-manage.component';

describe('UserManageComponent assignmentChanged', () => {
  const roles = [
    { _id: 'power', scopeType: 'SCHOOL' },
    { _id: 'teacher', scopeType: 'SCHOOL' },
    { _id: 'manager', scopeType: 'STATE' },
  ];
  let component: any;

  beforeEach(() => {
    const fb = new FormBuilder();
    component = new UserManageComponent(fb, {} as any, {} as any, {} as any, {} as any);
    component.form = fb.group({ roles: fb.array([]) });
    component.roles = roles;
    component.regions = [];
    component.appendAssignment({ roleId: 'power', dep: 'school-1' });
    component.scopes[0].scopeType = 'SCHOOL';
    component.scopes[0].state.setValue('Telangana');
    component.scopes[0].zones = [{ name: 'Zone 1' }];
  });

  const changeRole = (roleId: string) => {
    component.assignments.at(0).get('roleId').setValue(roleId);
    component.assignmentChanged(0);
  };

  it('keeps the area when the new role has the same scope type', () => {
    changeRole('teacher');
    expect(component.scopes[0].state.value).toBe('Telangana');
    expect(component.scopes[0].zones.length).toBe(1);
    expect(component.assignments.at(0).get('dep').value).toBe('school-1');
  });

  it('resets the area when the new role has a different scope type', () => {
    changeRole('manager');
    expect(component.scopes[0].state.value).toBeNull();
    expect(component.scopes[0].zones.length).toBe(0);
    expect(component.assignments.at(0).get('dep').value).toBeNull();
    expect(component.scopes[0].scopeType).toBe('STATE');
  });
});
