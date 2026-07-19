import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';
import { StaffUserCommonService } from 'src/app/shared/services/staff-user-common.service';

@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss']
})
export class AddEditUserComponent implements OnInit {
  userRolesDropdownOptions: any[] = [];
  scopeOptions: Record<string, any[]> = { STATE: [], ZONE: [], DISTRICT: [], BLOCK: [], SCHOOL: [] };

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
  constructor(private fb: FormBuilder, private route: ActivatedRoute, private utilityService: UtilityService, private router: Router, private commonStaffUserService: StaffUserCommonService) { }

  ngOnInit(): void {
    this.initialize_add_form();
    this.route.queryParamMap.subscribe((qparams) => {
      this.mode = qparams?.get('mode');
    });

    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });

    if (this.mode === 'view') this.addForm.disable();
    this.commonStaffUserService.getAssignmentData().subscribe(({ roles, scopeOptions }) => {
      this.userRolesDropdownOptions = roles;
      this.scopeOptions = scopeOptions;
      if (this.userId) this.getUserDetails(this.userId);
    });
  }

  initialize_add_form() {
    this.addForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.utilityService.regexPattern.phoneRegex)]],
      roles: this.fb.array([this.createAssignment({})]),
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
      return
    }
    if (this.mode === 'edit') {
      this.commonStaffUserService.updateTeacher(this.userId, this.addForm.value).subscribe({
        next: (res: any) => {
          this.router.navigate(['/teachers/list']);
          this.utilityService.handleResponse(res);
        },
        error: (err) => {
          console.error(err);
          this.utilityService.handleError(err);
        }
      });
    } else {
      this.commonStaffUserService.createTeacher(this.addForm.value).subscribe({
        next: (res: any) => {
          this.router.navigate(['/teachers/list']);
          this.utilityService.handleResponse(res);
        },
        error: (err) => {
          this.utilityService.handleError(err);
        }
      });
    }


  }

  get f(): any {
    return this.addForm.controls;
  }

  setFormValue(user: any) {
    this.assignments.clear();
    user.roles.forEach((assignment: any) => {
      this.assignments.push(this.createAssignment({ _id: assignment._id, roleId: assignment.role._id, dep: assignment.dep }));
      this.assignmentChanged(this.assignments.length - 1);
    });
    this.addForm.patchValue({
      name: user.identity.name,
      phone: user.identity.phone,
    });
  }

  getUserDetails(id: string) {
    this.commonStaffUserService.getById(id).subscribe({
      next: (res: any) => {
        this.setFormValue(res.data);
      },
      error: (err) => {
        console.error(err);
        this.utilityService.handleError(err);
      }
    });
  }

}
