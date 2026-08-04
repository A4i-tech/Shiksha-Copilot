import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropDownConfig } from '../../interfaces/dropdown.interface';
import { PermissionGrant, RegionDependency } from '../../interfaces/permission.interface';
import { StaffUserCommonService } from '../../services/staff-user-common.service';
import { scopeBelow, SCOPE_FIELDS } from '../../utility/scope.util';
import { DropdownComponent } from '../dropdown/dropdown.component';

interface ScopeSelection {
  state: FormControl;
  zone: FormControl;
  district: FormControl;
  block: FormControl;
  roles: any[];
  states: any[];
  zones: any[];
  districts: any[];
  blocks: any[];
  schools: any[];
}

@Component({
  selector: 'app-user-manage',
  standalone: true,
  imports: [CommonModule, DropdownComponent, ReactiveFormsModule, RouterModule, TranslateModule],
  templateUrl: './user-manage.component.html',
})
export class UserManageComponent implements OnInit {
  roles: any[] = [];
  regions: any[] = [];
  profileRegions: any[] = [];
  scopes: ScopeSelection[] = [];
  roleConfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select role', fieldName: 'Role', bindLabel: 'name', bindValue: '_id', showDescription: true, required: true, searchable: true };
  stateConfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select state', fieldName: 'State', bindLabel: 'state', bindValue: 'state', required: true, searchable: true };
  profileStateConfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select state', fieldName: 'State', bindLabel: 'state', bindValue: 'state', searchable: true };
  zoneConfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select zone', fieldName: 'Zone', bindLabel: 'name', bindValue: 'name', required: true, searchable: true };
  districtConfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select district', fieldName: 'District', bindLabel: 'name', bindValue: 'name', required: true, searchable: true };
  blockConfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Select block', fieldName: 'Block', bindLabel: 'name', bindValue: 'name', required: true, searchable: true };
  schoolConfig: DropDownConfig = { isBackground: true, placeHolderTxt: 'Search and select school', fieldName: 'School', bindLabel: 'label', bindValue: '_id', required: true, searchable: true };
  form!: FormGroup;
  submitted = false;
  mode = '';
  userId!: string;
  teacherForm = false;
  canAssign = false;
  otherAssignments: any[] = [];
  private assignmentGrants: PermissionGrant[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private utility: UtilityService, private router: Router, private users: StaffUserCommonService) {}

  ngOnInit() {
    this.teacherForm = this.route.snapshot.data['teacherForm'];
    this.mode = this.route.snapshot.queryParamMap.get('mode') || '';
    this.userId = this.route.snapshot.params['id'];
    this.canAssign = this.mode !== 'view' && (this.userId ? this.utility.hasPermission(['role.assign']) : this.utility.hasPermission(['user.create']));
    if (this.canAssign) this.assignmentGrants = this.utility.getPermission(this.userId ? 'role.assign' : 'user.create')!;
    const accessDenied = (this.mode === 'edit' && !this.utility.hasPermission(['user.edit']))
      || (!this.userId && !this.utility.hasPermission(['user.create']));
    const controls: any = {
      name: [null, [Validators.required, Validators.minLength(this.teacherForm ? 5 : 3)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.utility.regexPattern.phoneRegex)]],
      roles: this.fb.array([]),
    };
    if (!this.teacherForm) {
      controls.email = [null, [Validators.required, Validators.email]];
      controls.state = [null];
    }
    this.form = this.fb.group(controls);
    this.appendAssignment({});
    if (this.mode === 'view') this.form.disable();
    if (accessDenied) {
      this.router.navigate([this.listRoute]);
      return;
    }
    if (this.canAssign) {
      this.users.getAssignmentData().subscribe(({ roles, regions }) => {
        this.roles = roles.filter((role: any) => this.teacherForm ? role.scopeType === 'SCHOOL' : role.scopeType !== 'SCHOOL');
        this.regions = regions;
        this.setProfileRegions();
        if (!this.userId) this.setRoleOptions(0);
        if (this.userId) this.loadUser();
      });
    } else {
      this.users.getRegions().subscribe((regions) => {
        this.regions = regions;
        this.setProfileRegions();
        this.loadUser();
      });
    }
  }

  get assignments(): FormArray {
    return this.form.get('roles') as FormArray;
  }

  get entity() {
    return this.teacherForm ? 'Teacher' : 'Staff';
  }

  get listRoute() {
    return this.teacherForm ? '/teachers/list' : '/staff/list';
  }

  addAssignment() {
    this.appendAssignment({});
    this.setRoleOptions(this.assignments.length - 1);
    this.form.markAsDirty();
  }

  removeAssignment(index: number) {
    this.assignments.removeAt(index);
    this.scopes.splice(index, 1);
    this.form.markAsDirty();
  }

  assignmentRole(index: number) {
    return this.roles.find((role) => role._id === this.assignments.at(index).get('roleId')?.value);
  }

  private canAssignScope(scopeType: string) {
    return scopeBelow(this.assignmentGrants, scopeType, {});
  }

  private pathAllowed(index: number, path: RegionDependency) {
    return scopeBelow(this.assignmentGrants, this.assignmentRole(index).scopeType, path);
  }

  scopeIncludes(index: number, scopeType: string) {
    return SCOPE_FIELDS[this.assignmentRole(index)?.scopeType]?.includes(scopeType) === true;
  }

  assignmentChanged(index: number) {
    this.setDependencyValidator(index);
    this.assignments.at(index).get('dep')!.setValue(null);
    this.resetScope(index);
    this.setStateOptions(index);
  }

  stateChanged(index: number, state: any) {
    const scope = this.scopes[index];
    scope.zones = this.regions.find((region) => region.state === state).zones.filter((zone: any) => this.pathAllowed(index, { state, zone: zone.name }));
    scope.zone.reset();
    scope.district.reset();
    scope.block.reset();
    scope.districts = [];
    scope.blocks = [];
    scope.schools = [];
    this.setDependency(index, 'STATE', state);
    this.selectOnly(scope.zone, scope.zones, 'name', (zone) => this.zoneChanged(index, zone));
  }

  zoneChanged(index: number, zone: any) {
    const scope = this.scopes[index];
    scope.districts = scope.zones.find((item) => item.name === zone).districts.filter((district: any) =>
      this.pathAllowed(index, { state: scope.state.value, zone, district: district.name }));
    scope.district.reset();
    scope.block.reset();
    scope.blocks = [];
    scope.schools = [];
    this.setDependency(index, 'ZONE', zone);
    this.selectOnly(scope.district, scope.districts, 'name', (district) => this.districtChanged(index, district));
  }

  districtChanged(index: number, district: any) {
    const scope = this.scopes[index];
    scope.blocks = scope.districts.find((item) => item.name === district).blocks.filter((block: any) =>
      this.pathAllowed(index, { state: scope.state.value, zone: scope.zone.value, district, block: block.name }));
    scope.block.reset();
    scope.schools = [];
    this.setDependency(index, 'DISTRICT', district);
    this.selectOnly(scope.block, scope.blocks, 'name', (block) => this.blockChanged(index, block));
  }

  blockChanged(index: number, block: any) {
    const scope = this.scopes[index];
    scope.schools = [];
    this.setDependency(index, 'BLOCK', block);
    if (this.assignmentRole(index)?.scopeType === 'SCHOOL') {
      this.users.getSchools({ state: scope.state.value, zone: scope.zone.value, district: scope.district.value, block }).subscribe((schools) => {
        scope.schools = schools;
        this.selectOnly(this.assignments.at(index).get('dep') as FormControl, schools, '_id');
      });
    }
  }

  submit() {
    this.submitted = true;
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const value = this.canAssign ? { ...raw, roles: [...raw.roles, ...this.otherAssignments] } : raw;
    const request = this.teacherForm
      ? this.mode === 'edit' ? this.users.updateTeacher(this.userId, value) : this.users.createTeacher(value)
      : this.mode === 'edit' ? this.users.updateStaff(this.userId, value) : this.users.createStaff(value);
    request.subscribe({
      next: (response: any) => {
        this.router.navigate([this.listRoute]);
        this.utility.handleResponse(response);
      },
      error: (error) => this.utility.handleError(error),
    });
  }

  private appendAssignment(value: any) {
    const assignment: FormGroup = this.fb.group({ roleId: [value.roleId, Validators.required], dep: [value.dep] });
    if (value._id) assignment.addControl('_id', this.fb.control(value._id));
    if (this.mode === 'view' || !this.canAssign) assignment.disable();
    this.assignments.push(assignment);
    this.scopes.push(this.createScope());
  }

  private createScope(): ScopeSelection {
    const control = () => new FormControl({ value: null, disabled: this.mode === 'view' || !this.canAssign });
    return { state: control(), zone: control(), district: control(), block: control(), roles: [], states: [], zones: [], districts: [], blocks: [], schools: [] };
  }

  private setRoleOptions(index: number) {
    const selected = this.assignments.at(index).get('roleId')?.value;
    const options = this.roles.filter((role) => role._id === selected || this.canAssignScope(role.scopeType));
    this.scopes[index].roles = options;
    this.selectOnly(this.assignments.at(index).get('roleId') as FormControl, options, '_id', () => this.assignmentChanged(index), this.canAssign);
  }

  private setStateOptions(index: number) {
    if (!SCOPE_FIELDS[this.assignmentRole(index)?.scopeType]) return;
    const scope = this.scopes[index];
    scope.states = this.regions.filter((region) => this.pathAllowed(index, { state: region.state }));
    this.selectOnly(scope.state, scope.states, 'state', (state) => this.stateChanged(index, state), this.canAssign);
  }

  private setProfileRegions() {
    if (this.teacherForm) return;
    if (this.mode === 'view') {
      this.profileRegions = this.regions;
      return;
    }
    const permission = this.userId ? 'user.edit' : 'user.create';
    const grants = this.utility.getPermission(permission)!;
    this.profileRegions = grants.some((grant) => grant.scopeType === 'GLOBAL')
      ? this.regions
      : this.regions.filter((region) => grants.some((grant) => (grant.dep as RegionDependency).state === region.state));
    this.selectOnly(this.form.get('state') as FormControl, this.profileRegions, 'state');
  }

  private selectOnly(control: FormControl, options: any[], valueKey: string, selected?: (value: any) => void, editable = true) {
    if (!editable) return;
    control.enable({ emitEvent: false });
    if (options.length !== 1) return;
    const value = options[0][valueKey];
    const changed = control.value !== value;
    control.setValue(value, { emitEvent: false });
    control.disable({ emitEvent: false });
    if (changed) selected?.(value);
  }

  private setDependencyValidator(index: number) {
    const dep = this.assignments.at(index).get('dep')!;
    dep.setValidators(['GLOBAL', 'UNBOUND'].includes(this.assignmentRole(index)?.scopeType) ? null : Validators.required);
    dep.updateValueAndValidity();
  }

  private setDependency(index: number, scopeType: string, value: string) {
    if (this.assignmentRole(index)?.scopeType !== scopeType) {
      this.assignments.at(index).get('dep')!.setValue(null);
      return;
    }
    const scope = this.scopes[index];
    const values: Record<string, string> = {
      state: scope.state.value,
      zone: scope.zone.value,
      district: scope.district.value,
      block: scope.block.value,
      [scopeType.toLowerCase()]: value,
    };
    this.assignments.at(index).get('dep')!.setValue(Object.fromEntries(SCOPE_FIELDS[scopeType].map((field) => [field.toLowerCase(), values[field.toLowerCase()]])));
    this.assignments.at(index).get('dep')!.markAsDirty();
  }

  private resetScope(index: number) {
    const scope = this.scopes[index];
    scope.state.reset();
    scope.zone.reset();
    scope.district.reset();
    scope.block.reset();
    scope.states = [];
    scope.zones = [];
    scope.districts = [];
    scope.blocks = [];
    scope.schools = [];
  }

  private setPath(index: number, path: any) {
    const scope = this.scopes[index];
    const selectedRegion = this.regions.find((region) => region.state === path.state);
    scope.states = this.regions.filter((region) => this.pathAllowed(index, { state: region.state }));
    if (!scope.states.length) scope.states = [selectedRegion];
    scope.state.setValue(path.state);
    this.disableOnly(scope.state, scope.states);
    scope.zones = selectedRegion.zones.filter((zone: any) => this.pathAllowed(index, { state: path.state, zone: zone.name }));
    if (!scope.zones.length && path.zone) scope.zones = selectedRegion.zones.filter((zone: any) => zone.name === path.zone);
    if (!path.zone) return;
    scope.zone.setValue(path.zone);
    this.disableOnly(scope.zone, scope.zones);
    const selectedZone = selectedRegion.zones.find((zone: any) => zone.name === path.zone);
    scope.districts = selectedZone.districts.filter((district: any) => this.pathAllowed(index, { state: path.state, zone: path.zone, district: district.name }));
    if (!scope.districts.length && path.district) scope.districts = selectedZone.districts.filter((district: any) => district.name === path.district);
    if (!path.district) return;
    scope.district.setValue(path.district);
    this.disableOnly(scope.district, scope.districts);
    const selectedDistrict = selectedZone.districts.find((district: any) => district.name === path.district);
    scope.blocks = selectedDistrict.blocks.filter((block: any) =>
      this.pathAllowed(index, { state: path.state, zone: path.zone, district: path.district, block: block.name }));
    if (!scope.blocks.length && path.block) scope.blocks = selectedDistrict.blocks.filter((block: any) => block.name === path.block);
    if (path.block) scope.block.setValue(path.block);
    this.disableOnly(scope.block, scope.blocks);
  }

  private disableOnly(control: FormControl, options: any[]) {
    if (!this.canAssign) return;
    if (options.length === 1) control.disable({ emitEvent: false });
    else control.enable({ emitEvent: false });
  }

  private setExistingScope(index: number, scopeType: string, dep: any) {
    if (!SCOPE_FIELDS[scopeType]) return;
    if (scopeType === 'SCHOOL') {
      this.users.getSchool(dep).subscribe((school) => {
        this.setPath(index, school);
        this.users.getSchools({ state: school.state, zone: school.zone, district: school.district, block: school.block }).subscribe((schools) => {
          this.scopes[index].schools = schools;
          this.disableOnly(this.assignments.at(index).get('dep') as FormControl, schools);
        });
      });
      return;
    }
    this.setPath(index, dep);
  }

  private loadUser() {
    this.users.getById(this.userId).subscribe({
      next: (response: any) => {
        const user = response.data;
        this.assignments.clear();
        this.scopes = [];
        const assignments = user.roles.filter((assignment: any) => (assignment.role.scopeType === 'SCHOOL') === this.teacherForm);
        this.otherAssignments = user.roles.filter((assignment: any) => (assignment.role.scopeType === 'SCHOOL') !== this.teacherForm)
          .map((assignment: any) => ({ _id: assignment._id, roleId: assignment.role._id, dep: assignment.dep }));
        if (!this.canAssign) this.roles = assignments.map((assignment: any) => assignment.role);
        assignments.forEach((assignment: any, index: number) => {
          this.appendAssignment({ _id: assignment._id, roleId: assignment.role._id, dep: assignment.dep });
          this.setDependencyValidator(index);
          this.setExistingScope(index, assignment.role.scopeType, assignment.dep);
          this.setRoleOptions(index);
        });
        this.form.patchValue({ name: user.identity.name, phone: user.identity.phone });
        if (!this.teacherForm) this.form.patchValue({ email: user.identity.email, state: user.profiles.admin.state });
      },
      error: (error) => this.utility.handleError(error),
    });
  }
}
