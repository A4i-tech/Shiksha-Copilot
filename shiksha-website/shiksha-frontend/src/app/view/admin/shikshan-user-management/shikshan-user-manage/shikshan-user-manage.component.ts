import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { ShikshanService } from '../shikshan-user.service';
import { StaffUserCommonService } from 'src/app/shared/services/staff-user-common.service';

@Component({
  selector: 'app-shikshan-user-manage',
  templateUrl: './shikshan-user-manage.component.html',
  styleUrls: ['./shikshan-user-manage.component.scss']
})

export class ShikshanUserManageComponent implements OnInit {

  userRolesDropdownOptions: any[] = [];

  stateDropdownOptions: any[] = [];
  scopeOptions: Record<string, any[]> = { STATE: [], ZONE: [], DISTRICT: [], BLOCK: [], SCHOOL: [] };

  stateDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select State',
    fieldName: 'State',
    bindLabel: 'state',
    bindValue: 'state'
  };

  addForm!: FormGroup;
  submitted: boolean = false;
  mode!: any;
  userId!: string;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private utilityService: UtilityService, private shikshanaUserService: ShikshanService, private router: Router, private commonStaffUserService: StaffUserCommonService) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((qparams) => {
      this.mode = qparams?.get('mode');
    });

    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });

    this.initialize_add_form();
    if (this.mode === 'view') this.addForm.disable();
    this.commonStaffUserService.getAssignmentData().subscribe(({ roles, regions, scopeOptions }) => {
      this.userRolesDropdownOptions = roles;
      this.stateDropdownOptions = regions;
      this.scopeOptions = scopeOptions;
      if (this.userId) this.getUserDetails(this.userId);
    });
  }

  initialize_add_form() {
    this.addForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.utilityService.regexPattern.phoneRegex)]],
      email: [null, [Validators.required, Validators.email]],
      roles: this.fb.array([this.createAssignment({})]),
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
    const scopeType = this.assignmentRole(index)?.scopeType;
    const required = scopeType ? !['GLOBAL', 'UNBOUND'].includes(scopeType) : false;
    dep.setValidators(required ? Validators.required : null);
    if (!required) dep.setValue(null);
    dep.updateValueAndValidity();
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
      state: formData.state,
    };

    if (this.mode === 'edit') {
      this.shikshanaUserService.editUserDetails(this.userId, formattedData).subscribe({
        next: (res: any) => {
          this.router.navigate(['/staff/list']);
          this.utilityService.handleResponse(res);
        },
        error: (err) => {
          this.utilityService.handleError(err);
        }
      });
    } else {
      this.shikshanaUserService.createUser(formattedData).subscribe({
        next: (res: any) => {
          this.router.navigate(['/staff/list']);
          this.utilityService.handleResponse(res)
        },
        error: (err) => {
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

}
