import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { ShikshanService } from '../shikshan-user.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { StaffUserCommonService } from 'src/app/shared/services/staff-user-common.service';
import { UserManagementService } from '../../user-management/user-management.service';

@Component({
  selector: 'app-shikshan-user-manage',
  templateUrl: './shikshan-user-manage.component.html',
  styleUrls: ['./shikshan-user-manage.component.scss']
})

export class ShikshanUserManageComponent implements OnInit {

  userRolesDropdownOptions: any[] = [];

  stateDropdownOptions: any[] = [];
  regionsData: any[] = [];
  scopeOptions: Record<string, any[]> = { STATE: [], ZONE: [], DISTRICT: [], BLOCK: [], SCHOOL: [] };

  stateDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select State',
    fieldName: 'State',
    bindLabel: 'state',
    bindValue: 'state'
  };

  toggleconfig = {
    color: {
      checked: '#4069E5',
      unchecked: '#dcdcdc',
    }
  };
  addForm!: FormGroup;
  submitted: boolean = false;
  mode!: any;
  userId!: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private utilityService: UtilityService, private shikshanaUserService: ShikshanService, private router: Router, private masterService: MasterService, private commonStaffUserService: StaffUserCommonService, private userManagementService: UserManagementService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((qparams) => {
      this.mode = qparams?.get('mode');
    });

    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });

    this.initialize_add_form();
    if (this.mode === 'view') this.addForm.disable();
    this.shikshanaUserService.getRoles().subscribe((res: any) => {
      this.userRolesDropdownOptions = res.data.results.filter((role: any) => !role.isSuperUser && role.permissions.includes('dashboard.admin.view'));
      this.getRegionsData();
    });
    this.userManagementService.getSchoolList(false).subscribe((res: any) => {
      this.scopeOptions['SCHOOL'] = res.data.results.map((school: any) => ({ value: school._id, label: school.name }));
    });
  }

  initialize_add_form() {
    this.addForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.utilityService.regexPattern.phoneRegex)]],
      email: [null, [Validators.required, Validators.email]],
      roles: this.fb.array([this.createAssignment({})]),
      isDeleted: [false, [Validators.required]],
      state: [null],
    });
  }

  createAssignment(value: any) {
    return this.fb.group({ _id: [value._id], roleId: [value.roleId, Validators.required], dep: [value.dep] });
  }

  get assignments(): FormArray {
    return this.addForm.get('roles') as FormArray;
  }

  addAssignment() {
    this.assignments.push(this.createAssignment({}));
  }

  removeAssignment(index: number) {
    this.assignments.removeAt(index);
  }

  assignmentRole(index: number) {
    return this.userRolesDropdownOptions.find((role) => role._id === this.assignments.at(index).get('roleId')?.value);
  }

  assignmentChanged(index: number) {
    const dep = this.assignments.at(index).get('dep')!;
    const required = !['GLOBAL', 'UNBOUND'].includes(this.assignmentRole(index)?.scopeType);
    dep.setValidators(required ? Validators.required : null);
    if (!required) dep.setValue(null);
    dep.updateValueAndValidity();
  }

  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: (val) => {
        this.regionsData = val.data.results;
        this.stateDropdownOptions = this.regionsData;
        for (const scopeType of ['STATE', 'ZONE', 'DISTRICT', 'BLOCK']) this.scopeOptions[scopeType] = [];
        for (const region of this.regionsData) {
          this.scopeOptions['STATE'].push({ value: region.state, label: region.state });
          for (const zone of region.zones) {
            this.scopeOptions['ZONE'].push({ value: zone.name, label: `${region.state} / ${zone.name}` });
            for (const district of zone.districts) {
              this.scopeOptions['DISTRICT'].push({ value: district.name, label: `${zone.name} / ${district.name}` });
              for (const block of district.blocks) this.scopeOptions['BLOCK'].push({ value: block.name, label: `${district.name} / ${block.name}` });
            }
          }
        }
        if (this.userId) {
          this.getUserDetails(this.userId);
        }
      }
    });
  }

  on_form_submit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }

    const formData = { ...this.addForm.value };
    const formattedData: any = {
      name: formData.name?.trim(),
      phone: formData.phone?.toString(),
      email: formData.email?.trim().toLowerCase(),
      roles: formData.roles,
      isDeleted: formData.isDeleted
    };

    formattedData.state = formData.state;
    if (this.mode === 'edit') {
      formattedData._id = this.userId;
      this.shikshanaUserService.editUserDetails(this.userId, formattedData).subscribe({
        next: (res: any) => {
          this.router.navigate(['/staff/list']);
          this.utilityService.handleResponse(res);
        },
        error: (err) => {
          console.error('Edit error:', err);
          console.error('Error details:', err.error);
          this.utilityService.handleError(err);
        }
      });
    } else {
      // For create, we need to send the data to the correct endpoint
      this.shikshanaUserService.createUser(formattedData).subscribe({
        next: (res: any) => {
          this.router.navigate(['/staff/list']);
          this.utilityService.handleResponse(res)
        },
        error: (err) => {
          if (err.error?.error) {
          }
          this.utilityService.handleError(err);
        }
      });
    }
  }

  convertToFormControl(absCtrl: AbstractControl | null): FormControl {
    return absCtrl as FormControl;
  }
  get f(): any {
    return this.addForm.controls;
  }

  patchStatus() {
    if (this.addForm.value.isDeleted === false) {
      this.addForm.patchValue({
        isDeleted: true
      });
    } else {
      this.addForm.patchValue({
        isDeleted: false
      });
    }
  }

  getUserDetails(id: string) {
    this.commonStaffUserService.getById(id).subscribe({
      next: (res: any) => {
        const u = res.data;
        this.assignments.clear();
        u.roles.forEach((assignment: any) => {
          this.assignments.push(this.createAssignment({ _id: assignment._id, roleId: assignment.role._id, dep: assignment.dep }));
          this.assignmentChanged(this.assignments.length - 1);
        });
        const patch: any = {
          name: u.identity.name,
          phone: u.identity.phone,
          email: u.identity.email,
          isDeleted: u.isDeleted,
          state: u.profiles.admin.state,
        };
        this.addForm.patchValue(patch);
      },
      error: (err) => {
        console.error(err);
        this.utilityService.handleError(err);
      },
    });
  }

  get isActive(): boolean {
    return !this.addForm.get('isDeleted')?.value;
  }
  set isActive(val: boolean) {
    this.addForm.get('isDeleted')?.setValue(!val);
    this.addForm.markAsDirty();
  }

}
