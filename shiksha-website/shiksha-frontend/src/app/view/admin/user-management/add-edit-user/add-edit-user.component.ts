import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';
import { UserManagementService } from '../user-management.service';
import { MasterService } from 'src/app/shared/services/master.service';
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
  regionsData: any;

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private utilityService: UtilityService, private userManagementService: UserManagementService, private router: Router, private masterService: MasterService,private commonStaffUserService:StaffUserCommonService) { }

  ngOnInit(): void {
    this.initialize_add_form();
    this.route.queryParamMap.subscribe((qparams) => {
      this.mode = qparams?.get('mode');
    });

    this.route.params.subscribe((params) => {
      this.userId = params['id'];
    });

    if (this.mode === 'view') this.addForm.disable();
    this.commonStaffUserService.getRoles().subscribe((res: any) => {
      this.userRolesDropdownOptions = res.data.results.filter((role: any) => !role.isSuperUser && role.permissions.includes('dashboard.teacher.view'));
      if (this.userId) this.getUserDetails(this.userId);
    });
    this.getRegionsData();
    this.userManagementService.getSchoolList(false).subscribe((res: any) => {
      this.scopeOptions['SCHOOL'] = res.data.results.map((school: any) => ({ value: school._id, label: school.name }));
    });
  }

  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: (val) => {
        this.regionsData = val.data.results;
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
      },
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
    const required = !['GLOBAL', 'UNBOUND'].includes(this.assignmentRole(index)?.scopeType);
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
      isDeleted: user.isDeleted,
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
