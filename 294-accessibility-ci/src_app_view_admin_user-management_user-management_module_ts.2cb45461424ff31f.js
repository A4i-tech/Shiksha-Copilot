"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_admin_user-management_user-management_module_ts"],{

/***/ 23502:
/*!*************************************************************************************!*\
  !*** ./src/app/view/admin/user-management/add-edit-user/add-edit-user.component.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AddEditUserComponent: () => (/* binding */ AddEditUserComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _user_management_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../user-management.service */ 58640);
/* harmony import */ var src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/services/master.service */ 2216);
/* harmony import */ var src_app_shared_services_staff_user_common_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/services/staff-user-common.service */ 80798);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/form-dropdown/form-dropdown.component */ 55233);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ 90852);











function AddEditUserComponent_span_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function AddEditUserComponent_small_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Teacher Name is required"), ".");
  }
}
function AddEditUserComponent_small_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Teacher Name should be minimum 5 character long"), ".");
  }
}
function AddEditUserComponent_span_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function AddEditUserComponent_small_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Mobile Number is required"), ".");
  }
}
function AddEditUserComponent_small_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Phone number required should be 10 digits"));
  }
}
function AddEditUserComponent_small_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Invalid phone number"));
  }
}
function AddEditUserComponent_div_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 20)(1, "button", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "button", 22)(5, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](8, "img", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](3, 3, "Cancel"));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx_r7.addForm.pristine);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](7, 5, "Save"));
  }
}
const _c0 = function (a0) {
  return {
    "pointer-events-none": a0
  };
};
class AddEditUserComponent {
  constructor(fb, route, utilityService, userManagementService, router, masterService, commonStaffUserService) {
    this.fb = fb;
    this.route = route;
    this.utilityService = utilityService;
    this.userManagementService = userManagementService;
    this.router = router;
    this.masterService = masterService;
    this.commonStaffUserService = commonStaffUserService;
    this.stateDropdownOptions = [];
    this.zoneDropdownOptions = [];
    this.districtDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.schoolNamesDropdownOptions = [];
    this.userRolesDropdownOptions = [];
    this.stateDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select state',
      height: '44px',
      fieldName: 'State',
      bindLable: 'state',
      bindValue: 'state',
      required: true
    };
    this.zoneDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Zone',
      height: '44px',
      fieldName: 'Zone',
      bindLable: 'name',
      bindValue: 'name',
      required: true
    };
    this.districtDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select district',
      height: '44px',
      fieldName: 'District',
      bindLable: 'name',
      bindValue: 'name',
      required: true
    };
    this.blockDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Taluk',
      height: '44px',
      fieldName: 'Taluk',
      bindLable: 'name',
      bindValue: 'name',
      required: true
    };
    this.schoolNameDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select School Name',
      height: '44px',
      fieldName: 'School Name',
      bindLable: 'name',
      bindValue: '_id',
      required: true,
      searchable: true
    };
    this.userRoleDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Teacher Role',
      height: '44px',
      fieldName: 'Teacher Role',
      bindLable: 'name',
      bindValue: 'value',
      required: true
    };
    this.toggleconfig = {
      color: {
        checked: '#4069E5',
        unchecked: '#dcdcdc'
      }
    };
    this.submitted = false;
  }
  ngOnInit() {
    this.userRolesDropdownOptions = this.userManagementService.userRoleDropdownOptions;
    this.route.queryParamMap.subscribe(qparams => {
      this.mode = qparams?.get('mode');
    });
    this.route.params.subscribe(params => {
      this.userId = params['id'];
      if (this.userId) {
        this.getUserDetails(this.userId);
      }
    });
    this.initialize_add_form();
    if (this.mode !== 'view' || this.mode !== 'edit') {
      this.getRegionsData();
    }
  }
  ngAfterViewInit() {
    this.f.state?.valueChanges.subscribe(val => {
      if (this.selectedStateObj && this.selectedStateObj.state !== val) {
        this.f.zone?.reset();
        this.zoneDropdownOptions = [];
      }
      this.setZoneDropdownValues(val);
    });
    this.f.zone?.valueChanges.subscribe(val => {
      if (this.selectedZoneObj && this.selectedZoneObj.name !== val) {
        this.f.district?.reset();
        this.districtDropdownOptions = [];
      }
      this.setDistrictDropdownValues(val);
    });
    this.f.district?.valueChanges.subscribe(val => {
      if (this.selectedDistrictObj && this.selectedDistrictObj.name !== val) {
        this.f.block?.reset();
        this.blockDropdownOptions = [];
      }
      this.setBlockDropdownValues(val);
    });
    this.f.block?.valueChanges.subscribe(val => {
      this.schoolNamesDropdownOptions = [];
      this.f.school?.reset();
      if (val) {
        this.getSchoolList();
      }
    });
  }
  /**
   * Function to set state dropdown values
   * @param val
   */
  setStateDropdownValues(val) {
    this.stateDropdownOptions = val;
  }
  /**
   * Function to set zone dropdown values
   * @param selectedStateValue
   */
  setZoneDropdownValues(selectedStateValue) {
    if (selectedStateValue) {
      this.selectedStateObj = this.utilityService.filterDropdownValues(this.regionsData, 'state', selectedStateValue);
      // Only show manager's zones if role is manager
      const loggedInUser = this.utilityService.loggedInUserData;
      const role = this.addForm.get('role')?.value || loggedInUser && loggedInUser.role;
      if (role && (Array.isArray(role) ? role.includes('manager') : role === 'manager') && loggedInUser && loggedInUser.zones) {
        this.zoneDropdownOptions = this.utilityService.getZonesForManager(this.regionsData, loggedInUser);
      } else {
        this.zoneDropdownOptions = this.selectedStateObj.zones;
      }
    } else {
      this.f.zone?.reset();
    }
  }
  /**
   * Function to set district dropdown values
   * @param selectedZone
   */
  setDistrictDropdownValues(selectedZone) {
    if (selectedZone) {
      this.selectedZoneObj = this.utilityService.filterDropdownValues(this.selectedStateObj.zones, 'name', selectedZone);
      // districts is now an array
      if (this.selectedZoneObj && this.selectedZoneObj.districts) {
        this.districtDropdownOptions = Array.isArray(this.selectedZoneObj.districts) ? this.selectedZoneObj.districts : [this.selectedZoneObj.districts]; // Handle legacy object structure
      } else {
        this.districtDropdownOptions = [];
      }
    } else {
      this.f.district?.reset();
    }
  }
  /**
   * Function to set block dropdown values
   * @param selectedDistrict
   */
  setBlockDropdownValues(selectedDistrict) {
    if (selectedDistrict) {
      // districts is now an array, find the matching district
      if (this.selectedZoneObj && this.selectedZoneObj.districts) {
        const districts = Array.isArray(this.selectedZoneObj.districts) ? this.selectedZoneObj.districts : [this.selectedZoneObj.districts]; // Handle legacy object structure
        this.selectedDistrictObj = this.utilityService.filterDropdownValues(districts, 'name', selectedDistrict);
        this.blockDropdownOptions = this.selectedDistrictObj?.blocks || [];
      } else {
        this.selectedDistrictObj = null;
        this.blockDropdownOptions = [];
      }
    } else {
      this.f.block?.reset();
    }
  }
  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: val => {
        this.regionsData = val?.data?.results;
        this.setStateDropdownValues(this.regionsData);
        if (this.mode === 'edit' || this.mode === 'view') {
          this.patchRegionDropDown();
        }
      }
    });
  }
  /**
   * Function to patch regions data
   */
  patchRegionDropDown() {
    this.f.state?.setValue(this.dependentPatchData.state);
    this.f.zone?.setValue(this.dependentPatchData.zone);
    this.f.district?.setValue(this.dependentPatchData.district);
    this.f.block?.setValue(this.dependentPatchData.block);
    this.f.school?.setValue(this.dependentPatchData.school._id);
  }
  getSchoolList() {
    const filters = {
      state: this.addForm.get('state')?.value,
      district: this.addForm.get('district')?.value,
      zone: this.addForm.get('zone')?.value,
      block: this.addForm.get('block')?.value
    };
    this.userManagementService.getSchoolList(false, filters).subscribe(res => {
      this.schools = res.data['results'];
      this.schoolNamesDropdownOptions = this.schools.map(school => ({
        _id: school._id,
        name: school.name
      }));
    });
  }
  initialize_add_form() {
    this.addForm = this.fb.group({
      name: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.minLength(5)]],
      phone: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.minLength(10), _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.pattern(this.utilityService.regexPattern.phoneRegex)]],
      state: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]],
      zone: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]],
      district: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]],
      block: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]],
      school: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]],
      role: [this.mode === 'edit' || this.mode === 'view' ? null : 'standard', [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]]
    });
    this.getRegionsData();
    this.patchStatus();
  }
  on_form_submit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    const currentSchoolValue = this.f.school?.value;
    if (this.mode === 'edit') {
      const updatedData = {
        ...this.addForm.value,
        isSchoolChanged: this.savedSchoolId !== this.addForm.value.school
      };
      // Check if the school value has changed
      if (currentSchoolValue !== this.initialSchoolValue) {
        this.userManagementService.editUserDetails(this.userId, updatedData).subscribe({
          next: res => {
            this.router.navigate(['/teacher-management/list']);
            this.utilityService.handleResponse(res);
          },
          error: err => {
            console.error(err);
            this.utilityService.handleError(err);
          }
        });
      } else {
        this.userManagementService.editUserDetails(this.userId, this.addForm.value).subscribe({
          next: res => {
            this.router.navigate(['/teacher-management/list']);
            this.utilityService.handleResponse(res);
          },
          error: err => {
            console.error(err);
            this.utilityService.handleError(err);
          }
        });
      }
    } else {
      this.commonStaffUserService.addUser(this.addForm.value, 'user').subscribe({
        next: res => {
          this.router.navigate(['/teacher-management/list']);
          this.utilityService.handleResponse(res);
        },
        error: err => {
          this.utilityService.handleError(err);
        }
      });
    }
  }
  convertToFormControl(absCtrl) {
    return absCtrl;
  }
  get f() {
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
  setFormValue(data) {
    const keysToRemove = ['state', 'zone', 'district', 'block', 'school'];
    const {
      newObj,
      removedObj
    } = this.utilityService.removeKeys(data, keysToRemove);
    newObj.role = newObj.role[0];
    this.dependentPatchData = removedObj;
    this.getRegionsData();
    this.addForm.patchValue(newObj);
    this.initialSchoolValue = newObj.school; // Set the initial school value
  }

  getUserDetails(id) {
    this.commonStaffUserService.getUserDetails(id, 'user').subscribe({
      next: res => {
        const userData = res.data;
        this.savedSchoolId = userData?.school?._id;
        this.setFormValue(userData);
        this.patchStatus();
      },
      error: err => {
        console.error(err);
        this.utilityService.handleError(err);
      }
    });
  }
  static {
    this.ɵfac = function AddEditUserComponent_Factory(t) {
      return new (t || AddEditUserComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_user_management_service__WEBPACK_IMPORTED_MODULE_1__.UserManagementService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_2__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_shared_services_staff_user_common_service__WEBPACK_IMPORTED_MODULE_3__.StaffUserCommonService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
      type: AddEditUserComponent,
      selectors: [["app-add-edit-user"]],
      decls: 55,
      vars: 69,
      consts: [[1, "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "items-center"], ["src", "assets/icons/Vector (3).svg", "routerLink", "/teacher-management/list", "alt", "", 1, "w-5", "h-5", "cursor-pointer"], [1, "text-2xl", "md:text-[30px]", "font-bold", "text-content", "md:leading-[48px]", "ml-4"], [1, "border", "text-content", "rounded", "my-5", "px-4", "py-6", "md:px-6", "md:py-8", "bg-white", 3, "ngClass"], [1, "text-content", "text-2xl", "md:text-3xl", "font-bold", "md:leading-[48px]"], [3, "formGroup", "ngSubmit"], [1, "mt-8"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "form-control-label"], ["class", "text-[16px] text-error", 4, "ngIf"], ["formControlName", "name", "type", "text", "maxlength", "255", "autocomplete", "off", 1, "form-control", "h-[44px]", 3, "placeholder"], ["class", "form-control-error", 4, "ngIf"], ["formControlName", "phone", "type", "text", "maxlength", "10", "oninput", "this.value=this.value.replace(/(?![0-9])./gmi,'')", "autocomplete", "off", 1, "form-control", "h-[44px]", 3, "placeholder"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "mt-6", "md:mt-8"], [1, "cursor-pointer"], [3, "dropDownControlName", "mode", "dropDownCtrl", "dropDownValues", "config", "submitted"], ["class", "buttons mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2", 4, "ngIf"], [1, "text-[16px]", "text-error"], [1, "form-control-error"], [1, "buttons", "mt-8", "flex", "flex-col", "sm:flex-row", "items-stretch", "sm:items-center", "justify-end", "gap-2"], ["type", "button", "routerLink", "/teacher-management/list", 1, "w-full", "sm:w-20", "btn-outline-primary"], ["type", "submit", 1, "btn-primary", "w-full", "sm:w-20", "flex", "items-center", "justify-center", 3, "disabled"], [1, "mr-1"], ["src", "assets/icons/Vector (4).svg", "alt", ""]],
      template: function AddEditUserComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "div", 4)(7, "h2", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](9, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](10, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](11, "form", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("ngSubmit", function AddEditUserComponent_Template_form_ngSubmit_11_listener() {
            return ctx.on_form_submit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "div", 7)(13, "div", 8)(14, "div")(15, "label", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](17, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](18, AddEditUserComponent_span_18_Template, 2, 0, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](19, "input", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](20, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](21, AddEditUserComponent_small_21_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](22, AddEditUserComponent_small_22_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](23, "div")(24, "label", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](25);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](26, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](27, AddEditUserComponent_span_27_Template, 2, 0, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](28, "input", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](29, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](30, AddEditUserComponent_small_30_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](31, AddEditUserComponent_small_31_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](32, AddEditUserComponent_small_32_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](33, "div", 14)(34, "div")(35, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](36, "app-form-dropdown", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](37, "div")(38, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](39, "app-form-dropdown", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](40, "div", 14)(41, "div")(42, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](43, "app-form-dropdown", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](44, "div")(45, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](46, "app-form-dropdown", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](47, "div", 14)(48, "div")(49, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](50, "app-form-dropdown", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](51, "div")(52, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](53, "app-form-dropdown", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](54, AddEditUserComponent_div_54_Template, 9, 7, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](5, 53, "Teacher Management"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](67, _c0, ctx.mode === "view"));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](9, 55, ctx.mode === "view" ? "View" : ctx.mode === "edit" ? "Edit" : "Add"), " ", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](10, 57, "Teacher"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("formGroup", ctx.addForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](17, 59, "Teacher Name"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](20, 61, "Enter Teacher Name"));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["name"] == null ? null : ctx.f["name"].errors == null ? null : ctx.f["name"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["name"] == null ? null : ctx.f["name"].errors == null ? null : ctx.f["name"].errors["minlength"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](26, 63, "Mobile Number"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](29, 65, "Enter Mobile Number"));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["phone"] == null ? null : ctx.f["phone"].errors == null ? null : ctx.f["phone"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["phone"].errors == null ? null : ctx.f["phone"].errors["minlength"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && !(ctx.f["phone"].errors == null ? null : ctx.f["phone"].errors["minlength"]) && (ctx.f["phone"].errors == null ? null : ctx.f["phone"].errors["pattern"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "state")("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["state"]))("dropDownValues", ctx.stateDropdownOptions)("config", ctx.stateDropdownconfig)("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "zone")("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["zone"]))("dropDownValues", ctx.zoneDropdownOptions)("config", ctx.zoneDropdownconfig)("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "district")("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["district"]))("dropDownValues", ctx.districtDropdownOptions)("config", ctx.districtDropdownconfig)("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "block")("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["block"]))("dropDownValues", ctx.blockDropdownOptions)("config", ctx.blockDropdownconfig)("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "school")("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["school"]))("dropDownValues", ctx.schoolNamesDropdownOptions)("config", ctx.schoolNameDropdownconfig)("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "role")("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["role"]))("dropDownValues", ctx.userRolesDropdownOptions)("config", ctx.userRoleDropdownconfig)("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormControlName, _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.FormDropdownComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslatePipe],
      styles: ["#toggle[_ngcontent-%COMP%]:checked    + .toggle-label[_ngcontent-%COMP%]   .toggle__dot[_ngcontent-%COMP%] {\n  transform: translateX(100%);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZC1lZGl0LXVzZXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUk7RUFDSSwyQkFBQTtBQUNSIiwiZmlsZSI6ImFkZC1lZGl0LXVzZXIuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIgICAgI3RvZ2dsZTpjaGVja2VkKy50b2dnbGUtbGFiZWwgLnRvZ2dsZV9fZG90IHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpO1xuICAgIH0iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi91c2VyLW1hbmFnZW1lbnQvYWRkLWVkaXQtdXNlci9hZGQtZWRpdC11c2VyLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFJO0VBQ0ksMkJBQUE7QUFDUjtBQUNBLHdZQUF3WSIsInNvdXJjZXNDb250ZW50IjpbIiAgICAjdG9nZ2xlOmNoZWNrZWQrLnRvZ2dsZS1sYWJlbCAudG9nZ2xlX19kb3Qge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMTAwJSk7XG4gICAgfSJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 4174:
/*!******************************************************************************!*\
  !*** ./src/app/view/admin/user-management/user-management-routing.module.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserManagementRoutingModule: () => (/* binding */ UserManagementRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _add_edit_user_add_edit_user_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./add-edit-user/add-edit-user.component */ 23502);
/* harmony import */ var src_app_shared_components_user_staff_list_user_staff_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/components/user-staff-list/user-staff-list.component */ 74333);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);





const routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
}, {
  path: 'list',
  component: src_app_shared_components_user_staff_list_user_staff_list_component__WEBPACK_IMPORTED_MODULE_1__.UserStaffListComponent
}, {
  path: 'add',
  component: _add_edit_user_add_edit_user_component__WEBPACK_IMPORTED_MODULE_0__.AddEditUserComponent
}, {
  path: ':id',
  component: _add_edit_user_add_edit_user_component__WEBPACK_IMPORTED_MODULE_0__.AddEditUserComponent
}];
class UserManagementRoutingModule {
  static {
    this.ɵfac = function UserManagementRoutingModule_Factory(t) {
      return new (t || UserManagementRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: UserManagementRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](UserManagementRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
  });
})();

/***/ }),

/***/ 75831:
/*!**********************************************************************!*\
  !*** ./src/app/view/admin/user-management/user-management.module.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserManagementModule: () => (/* binding */ UserManagementModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _user_management_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user-management-routing.module */ 4174);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _add_edit_user_add_edit_user_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./add-edit-user/add-edit-user.component */ 23502);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ng-select/ng-select */ 62223);
/* harmony import */ var src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var ng_toggle_button__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ng-toggle-button */ 80405);
/* harmony import */ var src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/modal/modal.component */ 69081);
/* harmony import */ var src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/components/form-dropdown/form-dropdown.component */ 55233);
/* harmony import */ var src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/disable-popup/disable-popup.component */ 51541);
/* harmony import */ var src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/components/upload-popup/upload-popup.component */ 86487);
/* harmony import */ var src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/core/directives/has-permission.directive */ 87944);
/* harmony import */ var src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);















class UserManagementModule {
  static {
    this.ɵfac = function UserManagementModule_Factory(t) {
      return new (t || UserManagementModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineNgModule"]({
      type: UserManagementModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _user_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.UserManagementRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormsModule, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_13__.NgSelectModule, ng_toggle_button__WEBPACK_IMPORTED_MODULE_14__.NgToggleModule, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.FormDropdownComponent, src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_5__.DisablePopupComponent, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_2__.CommonDropdownComponent, src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_3__.ModalComponent, src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_6__.UploadPopupComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_8__.PaginationComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵsetNgModuleScope"](UserManagementModule, {
    declarations: [_add_edit_user_add_edit_user_component__WEBPACK_IMPORTED_MODULE_1__.AddEditUserComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.CommonModule, _user_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.UserManagementRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslateModule, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormsModule, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_13__.NgSelectModule, ng_toggle_button__WEBPACK_IMPORTED_MODULE_14__.NgToggleModule, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.FormDropdownComponent, src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_5__.DisablePopupComponent, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_2__.CommonDropdownComponent, src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_3__.ModalComponent, src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_6__.UploadPopupComponent, src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_7__.HasPermissionDirective, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_8__.PaginationComponent]
  });
})();

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_user-management_user-management_module_ts.2cb45461424ff31f.js.map