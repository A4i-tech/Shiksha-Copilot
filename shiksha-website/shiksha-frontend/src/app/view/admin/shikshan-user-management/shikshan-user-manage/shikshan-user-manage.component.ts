import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from 'src/app/core/services/utility.service';
import { DropDownConfig } from 'src/app/shared/interfaces/dropdown.interface';
import { ShikshanService } from '../shikshan-user.service';
import { MasterService } from 'src/app/shared/services/master.service';
import { StaffUserCommonService } from 'src/app/shared/services/staff-user-common.service';

@Component({
  selector: 'app-shikshan-user-manage',
  templateUrl: './shikshan-user-manage.component.html',
  styleUrls: ['./shikshan-user-manage.component.scss']
})

export class ShikshanUserManageComponent implements OnInit {

  userRolesDropdownOptions: any[] = [];

  userRoleDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select Staff Role',
    fieldName: 'Staff Role',
    bindLabel: 'name',
    bindValue: '_id',
    multi: true,
    required: true
  };

  stateDropdownOptions: any[] = [];
  zoneDropdownOptions: any[] = [];
  districtDropdownOptions: any[] = [];
  regionsData: any[] = [];

  stateDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select State',
    fieldName: 'State',
    bindLabel: 'state',
    bindValue: 'state',
    required: true
  };

  zoneDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select Zone',
    fieldName: 'Zone',
    bindLabel: 'name',
    bindValue: 'name',
    required: true,
    multi: true,
    selectAllOption: true
  };

  districtDropdownconfig: DropDownConfig = {
    isBackground: true,
    placeHolderTxt: 'Select District',
    fieldName: 'District',
    bindLabel: 'name',
    bindValue: 'name',
    required: true,
    multi: true,
    selectAllOption: true
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

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private utilityService: UtilityService, private shikshanaUserService: ShikshanService, private router: Router, private masterService: MasterService, private commonStaffUserService: StaffUserCommonService) { }

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
    this.handleRoleChange();
  }

  initialize_add_form() {
    this.addForm = this.fb.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.pattern(this.utilityService.regexPattern.phoneRegex)]],
      email: [null, [Validators.required, Validators.email]],
      roles: [[], [Validators.required]],
      isDeleted: [false, [Validators.required]],
      state: [null],
      zones: [[]],
      districts: [[]]
    });
  }

  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: (val) => {
        this.regionsData = val.data.results;
        this.stateDropdownOptions = this.regionsData;
        if (this.userId) {
          this.getUserDetails(this.userId);
        }
      }
    });
  }

  handleRoleChange() {
    this.addForm.get('roles')?.valueChanges.subscribe(() => {
      if (this.selectedRoleHas('scope.regional')) {
        this.addForm.get('state')?.setValidators([Validators.required]);
        this.addForm.get('zones')?.setValidators([Validators.required]);
        this.addForm.get('districts')?.setValidators([Validators.required]);
      } else {
        this.addForm.get('state')?.clearValidators();
        this.addForm.get('zones')?.clearValidators();
        this.addForm.get('districts')?.clearValidators();
        this.addForm.get('state')?.setValue(null);
        this.addForm.get('zones')?.setValue([]);
        this.addForm.get('districts')?.setValue([]);
      }
      this.addForm.get('state')?.updateValueAndValidity();
      this.addForm.get('zones')?.updateValueAndValidity();
      this.addForm.get('districts')?.updateValueAndValidity();
    });

    this.addForm.get('state')?.valueChanges.subscribe((state: string) => {
      this.updateZoneOptions(state);
    });

    this.addForm.get('zones')?.valueChanges.subscribe((selectedZones: any[]) => {
      this.updateDistrictOptions(selectedZones);
    });
  }

  updateZoneOptions(state: string) {
    if (!state) {
      this.zoneDropdownOptions = [];
      this.districtDropdownOptions = [];
      this.addForm.get('zones')?.setValue([]);
      this.addForm.get('districts')?.setValue([]);
      return;
    }

    // Find the selected state object
    const stateObj = this.regionsData.find((region: any) => region.state === state);

    if (stateObj && stateObj.zones) {
      // Transform zones into the correct format for the dropdown
      this.zoneDropdownOptions = stateObj.zones.map((zone: any) => ({
        name: zone.name,
        value: zone.name
      }));
    } else {
      this.zoneDropdownOptions = [];
    }

    // Reset selections when state changes
    this.addForm.get('zones')?.setValue([]);
    this.addForm.get('districts')?.setValue([]);
    this.districtDropdownOptions = [];
  }

  updateDistrictOptions(selectedZones: any[]) {
    if (!selectedZones || selectedZones.length === 0) {
      this.districtDropdownOptions = [];
      this.addForm.get('districts')?.setValue([]);
      return;
    }

    const state = this.addForm.get('state')?.value;
    const stateObj = this.regionsData.find((region: any) => region.state === state);

    if (!stateObj) {
      this.districtDropdownOptions = [];
      return;
    }

    // Collect all districts from selected zones
    const allDistricts = new Set();
    selectedZones.forEach(zoneName => {
      const zone = stateObj.zones.find((z: any) => z.name === zoneName);
      if (zone && zone.districts) {
        if (Array.isArray(zone.districts)) {
          zone.districts.forEach((district: any) => {
            if (district.name) {
              allDistricts.add(district.name);
            }
          });
        } else if (zone.districts.name) {
          allDistricts.add(zone.districts.name);
        }
      }
    });

    // Transform districts into dropdown format
    this.districtDropdownOptions = Array.from(allDistricts).map(districtName => ({
      name: districtName,
      value: districtName
    }));

    // Reset districts selection when zones change
    this.addForm.get('districts')?.setValue([]);
  }

  on_form_submit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }

    // Create a copy of the form value to avoid modifying the form directly
    const formData = { ...this.addForm.value };

    if (!this.selectedRoleHas('scope.regional')) {
      delete formData.state;
      delete formData.zones;
      delete formData.districts;
    }

    // Define the type for the formatted data
    interface FormattedData {
      _id?: string;
      name: string;
      phone: string;
      email: string;
      roles: string[];
      isDeleted: boolean;
      state?: string;
      zones?: string[];
      districts?: string[];
    }

    // Format the data according to API requirements
    const formattedData: FormattedData = {
      name: formData.name?.trim(),
      phone: formData.phone?.toString(),
      email: formData.email?.trim().toLowerCase(),
      roles: formData.roles,
      isDeleted: formData.isDeleted
    };

    if (this.selectedRoleHas('scope.regional')) {
      if (!formData.state || !formData.zones?.length || !formData.districts?.length) {
        this.utilityService.handleError({ error: { message: 'State, zones, and districts are required for manager role' } });
        return;
      }
      formattedData.state = formData.state;
      formattedData.zones = formData.zones;
      formattedData.districts = formData.districts;
    }
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

  getUserDetails(id: string) {
    this.commonStaffUserService.getById(id).subscribe({
      next: (res: any) => {
        const u = res.data;
        const roleIds = u.roles.map((r: any) => r._id);
        const admin = u.profiles.admin;
        const patch: any = {
          name: u.identity.name,
          phone: u.identity.phone,
          email: u.identity.email,
          roles: roleIds,
          isDeleted: u.isDeleted,
          state: null,
          zones: [],
          districts: [],
        };
        if (this.roleHas(roleIds, 'scope.regional') && admin?.state) {
          this.updateZoneOptions(admin.state);
          this.updateDistrictOptions(admin.zones);
          Object.assign(patch, { state: admin.state, zones: admin.zones, districts: admin.districts });
        }
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

  selectedRoleHas(permission: string): boolean {
    return this.roleHas(this.addForm.get('roles')!.value, permission);
  }

  roleHas(roleIds: string[], permission: string): boolean {
    return this.userRolesDropdownOptions.some((role) => roleIds.includes(role._id) && role.permissions.includes(permission));
  }

}
