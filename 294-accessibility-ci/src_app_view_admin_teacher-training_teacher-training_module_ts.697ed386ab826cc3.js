"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_admin_teacher-training_teacher-training_module_ts"],{

/***/ 68010:
/*!***********************************************!*\
  !*** ./src/app/core/services/auth.service.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthService: () => (/* binding */ AuthService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 46443);





class AuthService {
  constructor(http) {
    this.http = http;
    this.apiUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl;
    this.currentUserSubject = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(this.getUserFromStorage());
    this.currentUser$ = this.currentUserSubject.asObservable();
  }
  getUserFromStorage() {
    const userStr = localStorage.getItem('currentUser');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch {
        return null;
      }
    }
    return null;
  }
  getCurrentUser() {
    return this.currentUserSubject.value;
  }
  login(email, password) {
    return this.http.post(`${this.apiUrl}/auth/login`, {
      email,
      password
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response.success && response.data) {
        const user = response.data;
        localStorage.setItem('currentUser', JSON.stringify(user));
        if (user.token) {
          localStorage.setItem('token', user.token);
        }
        this.currentUserSubject.next(user);
        return user;
      }
      throw new Error('Login failed');
    }));
  }
  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
  isAuthenticated() {
    return !!this.getCurrentUser();
  }
  getUserLocation() {
    const user = this.getCurrentUser();
    return {
      state: user?.state || null,
      zone: user?.zone || null,
      district: user?.district || null
    };
  }
  getFLNLastViewed() {
    return this.http.get(`${this.apiUrl}/user/fln-last-viewed`);
  }
  setFLNLastViewed(grade, day) {
    return this.http.post(`${this.apiUrl}/user/fln-last-viewed`, {
      grade,
      day
    });
  }
  static {
    this.ɵfac = function AuthService_Factory(t) {
      return new (t || AuthService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: AuthService,
      factory: AuthService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 6821:
/*!**************************************************************!*\
  !*** ./src/app/view/admin/teacher-training/batch.service.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BatchService: () => (/* binding */ BatchService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/services/auth.service */ 68010);






class BatchService {
  constructor(http, authService) {
    this.http = http;
    this.authService = authService;
    this.batchesSubject = new rxjs__WEBPACK_IMPORTED_MODULE_2__.BehaviorSubject([]);
    this.batches$ = this.batchesSubject.asObservable();
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl;
  }
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpHeaders({
      'Authorization': token || '',
      'Content-Type': 'application/json'
    });
  }
  addBatch(batchData) {
    const headers = this.getAuthHeaders();
    if (batchData instanceof FormData) {
      // For FormData, don't set Content-Type header as it will be set automatically
      const token = localStorage.getItem('token');
      const formDataHeaders = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpHeaders({
        'Authorization': token || ''
      });
      return this.http.post(`${this.baseUrl}/teacher-training-batches`, batchData, {
        headers: formDataHeaders
      });
    }
    return this.http.post(`${this.baseUrl}/teacher-training-batches`, batchData, {
      headers
    });
  }
  fetchBatches() {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/teacher-training-batches`, {
      headers
    });
  }
  assignTeacherToBatch(batchId, teacherId) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}/assign-teacher`, {
      teacherId
    }, {
      headers
    });
  }
  removeTeacherFromBatch(batchId, teacherId) {
    const headers = this.getAuthHeaders();
    return this.http.post(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}/remove-teacher`, {
      teacherId
    }, {
      headers
    });
  }
  setBatches(batches) {
    this.batchesSubject.next(batches);
  }
  deleteBatch(batchId) {
    const headers = this.getAuthHeaders();
    return this.http.delete(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}`, {
      headers
    });
  }
  updateAttendance(batchId, attendance) {
    const headers = this.getAuthHeaders();
    return this.http.put(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}/attendance`, {
      attendance
    }, {
      headers
    });
  }
  submitBatch(batchId) {
    const headers = this.getAuthHeaders();
    return this.http.put(`${`${this.baseUrl}/teacher-training-batches`}/${batchId}/submit`, {}, {
      headers
    });
  }
  getBatchById(batchId) {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/teacher-training-batches/${batchId}`, {
      headers
    });
  }
  // New method to fetch a file as a Blob
  getFile(path) {
    const headers = this.getAuthHeaders();
    // Assuming the path starts with 'uploads/' and needs to be relative to the base URL
    const fullUrl = `/${path}`;
    return this.http.get(fullUrl, {
      headers,
      responseType: 'blob'
    });
  }
  extractActualFilename(url) {
    try {
      const parsedUrl = new URL(url);
      const segments = parsedUrl.pathname.split("/");
      const fullFilename = segments[segments.length - 1];
      if (!fullFilename) return null; // No filename found
      if (!fullFilename.includes("_")) return fullFilename;
      return fullFilename.split("_").slice(1).join("_");
    } catch (err) {
      console.error("Invalid URL:", err);
      return null;
    }
  }
  updateBatchInList(updatedBatch) {
    const currentBatches = this.batchesSubject.getValue();
    const index = currentBatches.findIndex(batch => batch._id === updatedBatch._id);
    if (index !== -1) {
      currentBatches[index] = updatedBatch;
      this.batchesSubject.next([...currentBatches]);
    }
  }
  uploadBatchFiles(batchId, formData) {
    const token = localStorage.getItem('token');
    const headers = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpHeaders({
      'Authorization': token || ''
    });
    return this.http.post(`${this.baseUrl}/teacher-training-batches/${batchId}/upload-pdf`, formData, {
      headers
    });
  }
  getTeacherTrainingStats() {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/teacher-training-batches/stats`, {
      headers
    });
  }
  // Download the batch Excel report from the backend
  downloadBatchExcelReport(batchId) {
    const headers = this.getAuthHeaders();
    return this.http.get(`${this.baseUrl}/teacher-training-batches/${batchId}/export-report`, {
      headers,
      responseType: 'blob'
    });
  }
  static {
    this.ɵfac = function BatchService_Factory(t) {
      return new (t || BatchService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
      token: BatchService,
      factory: BatchService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 25514:
/*!************************************************************************************!*\
  !*** ./src/app/view/admin/teacher-training/create-batch/create-batch.component.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateBatchComponent: () => (/* binding */ CreateBatchComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_view_admin_teacher_training_batch_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/view/admin/teacher-training/batch.service */ 6821);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../../shared/components/form-dropdown/form-dropdown.component */ 55233);









function CreateBatchComponent_small_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "small", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Batch Name is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CreateBatchComponent_small_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "small", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Schedule Date is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function CreateBatchComponent_small_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "small", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" Selected: ", ctx_r2.selectedFile.name, " ");
  }
}
function CreateBatchComponent_small_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "small", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, " Description is required. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
class CreateBatchComponent {
  constructor() {
    this.selectedFile = null;
    this.mode = 'add';
    this.trainingTypeDropdownOptions = [{
      name: 'OFFLINE/ Face to Face',
      value: 'offline'
    }, {
      name: 'ONLINE/ Virtual',
      value: 'online'
    }, {
      name: 'School-Level',
      value: 'School-Level'
    }];
    this.trainingTypeDropdownConfig = {
      isBackground: true,
      placeHolderTxt: 'Select mode',
      height: '44px',
      fieldName: 'Mode of Training',
      bindLable: 'name',
      bindValue: 'value',
      required: true
    };
    this.fb = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder);
    this.batchService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(src_app_view_admin_teacher_training_batch_service__WEBPACK_IMPORTED_MODULE_0__.BatchService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router);
  }
  ngOnInit() {
    this.batchForm = this.fb.group({
      batchName: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      description: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      scheduleDate: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      trainingType: [this.trainingTypeDropdownOptions[0].value, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      pdfFile: [null]
    });
  }
  onFileSelected(event) {
    const element = event.currentTarget;
    const fileList = element.files;
    if (fileList && fileList.length > 0) {
      this.selectedFile = fileList[0];
      this.batchForm.patchValue({
        pdfFile: this.selectedFile
      });
      this.batchForm.get('pdfFile')?.updateValueAndValidity();
    } else {
      this.selectedFile = null;
      this.batchForm.patchValue({
        pdfFile: null
      });
      this.batchForm.get('pdfFile')?.updateValueAndValidity();
    }
  }
  onSubmit() {
    if (this.batchForm.valid) {
      const formData = new FormData();
      formData.append('batchName', this.batchForm.get('batchName')?.value);
      formData.append('description', this.batchForm.get('description')?.value);
      formData.append('scheduleDate', this.batchForm.get('scheduleDate')?.value);
      formData.append('trainingType', this.batchForm.get('trainingType')?.value);
      if (this.selectedFile) {
        formData.append('pdfFile', this.selectedFile, this.selectedFile.name);
      }
      this.batchService.addBatch(formData).subscribe({
        next: response => {
          console.log('Batch Created:', response);
          this.batchForm.reset();
          this.selectedFile = null;
          this.router.navigate(['/teacher-training/view-batch']);
        },
        error: error => {
          console.error('Error creating batch:', error);
          // Handle error (e.g., show a toast message)
        }
      });
    } else {
      console.log('Form is invalid or no file selected.');
      this.batchForm.markAllAsTouched();
    }
  }
  convertToFormControl(absCtrl) {
    return absCtrl;
  }
  static {
    this.ɵfac = function CreateBatchComponent_Factory(t) {
      return new (t || CreateBatchComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: CreateBatchComponent,
      selectors: [["app-create-batch"]],
      decls: 45,
      vars: 11,
      consts: [[1, "create-batch-wrapper", "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "content-center"], ["src", "assets/icons/back-arrow.svg", "routerLink", "/teacher-training/view-batch", "alt", "", 1, "cursor-pointer"], [1, "ml-3", "text-[32px]", "leading-[48px]", "font-bold", "text-content"], [1, "batch-container", "px-4", "py-6", "md:px-6", "md:py-8", "bg-white", "mt-6", "rounded", "border-content-30", "border"], [1, "flex", "justify-between", "content-center"], [1, "text-content", "text-[32px]", "leading-[48px]", "font-bold", "tracking-tight"], [1, "batch-form", "mt-9"], [3, "formGroup", "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], ["for", "batch-name", 1, "form-control-label"], [1, "text-[16px]", "text-error"], ["id", "batch-name", "type", "text", "placeholder", "Enter batch name", "autocomplete", "off", "formControlName", "batchName", 1, "form-control"], ["class", "form-control-error", 4, "ngIf"], ["for", "schedule-date", 1, "form-control-label"], ["id", "schedule-date", "type", "date", "formControlName", "scheduleDate", 1, "form-control"], [3, "dropDownControlName", "dropDownCtrl", "dropDownValues", "config", "mode"], ["for", "pdf-file", 1, "form-control-label"], ["id", "pdf-file", "type", "file", "accept", ".pdf", 1, "form-control-disabled", "batch-file-input", 3, "change"], ["class", "text-content-60 text-xs mt-1 block", 4, "ngIf"], [1, "mt-6"], ["for", "description", 1, "form-control-label"], ["id", "description", "formControlName", "description", "rows", "4", "placeholder", "Provide a brief description", 1, "form-control", "min-h-[110px]"], [1, "flex", "flex-col-reverse", "sm:flex-row", "justify-end", "gap-2", "mt-8"], ["type", "button", "routerLink", "/teacher-training/view-batch", 1, "btn-outline-primary", "h-9"], ["type", "submit", 1, "btn-primary", "h-9", 3, "disabled"], [1, "form-control-error"], [1, "text-content-60", "text-xs", "mt-1", "block"]],
      template: function CreateBatchComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, " Teacher Training ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 4)(6, "div", 5)(7, "p", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](8, " Create Batch ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](9, "div", 7)(10, "form", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function CreateBatchComponent_Template_form_ngSubmit_10_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "div", 9)(12, "div")(13, "label", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](14, " Batch Name ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](15, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](16, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](17, "input", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](18, CreateBatchComponent_small_18_Template, 2, 0, "small", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](19, "div")(20, "label", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21, " Schedule Date ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](23, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](24, "input", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](25, CreateBatchComponent_small_25_Template, 2, 0, "small", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](26, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](27, "app-form-dropdown", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](28, "div")(29, "label", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](30, " Upload Permission Letter ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](31, "input", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function CreateBatchComponent_Template_input_change_31_listener($event) {
            return ctx.onFileSelected($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](32, CreateBatchComponent_small_32_Template, 2, 1, "small", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "div", 20)(34, "label", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](35, " Description ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](36, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](37, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](38, "textarea", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](39, CreateBatchComponent_small_39_Template, 2, 0, "small", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](40, "div", 23)(41, "button", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](42, " Cancel ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](43, "button", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](44, " Create Batch ");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()()()()();
        }
        if (rf & 2) {
          let tmp_1_0;
          let tmp_2_0;
          let tmp_9_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.batchForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ((tmp_1_0 = ctx.batchForm.get("batchName")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx.batchForm.get("batchName")) == null ? null : tmp_1_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx.batchForm.get("scheduleDate")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx.batchForm.get("scheduleDate")) == null ? null : tmp_2_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("dropDownControlName", "trainingType")("dropDownCtrl", ctx.convertToFormControl(ctx.batchForm.get("trainingType")))("dropDownValues", ctx.trainingTypeDropdownOptions)("config", ctx.trainingTypeDropdownConfig)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.selectedFile);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ((tmp_9_0 = ctx.batchForm.get("description")) == null ? null : tmp_9_0.invalid) && ((tmp_9_0 = ctx.batchForm.get("description")) == null ? null : tmp_9_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.batchForm.invalid);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_1__.FormDropdownComponent],
      styles: [".batch-file-input[_ngcontent-%COMP%] {\n  height: auto;\n  padding-top: 0.5rem;\n  padding-bottom: 0.5rem;\n  cursor: pointer;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNyZWF0ZS1iYXRjaC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFlBQUE7RUFDQSxtQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZUFBQTtBQUNGIiwiZmlsZSI6ImNyZWF0ZS1iYXRjaC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5iYXRjaC1maWxlLWlucHV0IHtcbiAgaGVpZ2h0OiBhdXRvO1xuICBwYWRkaW5nLXRvcDogMC41cmVtO1xuICBwYWRkaW5nLWJvdHRvbTogMC41cmVtO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi90ZWFjaGVyLXRyYWluaW5nL2NyZWF0ZS1iYXRjaC9jcmVhdGUtYmF0Y2guY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSxzQkFBQTtFQUNBLGVBQUE7QUFDRjtBQUNBLHdjQUF3YyIsInNvdXJjZXNDb250ZW50IjpbIi5iYXRjaC1maWxlLWlucHV0IHtcbiAgaGVpZ2h0OiBhdXRvO1xuICBwYWRkaW5nLXRvcDogMC41cmVtO1xuICBwYWRkaW5nLWJvdHRvbTogMC41cmVtO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 10571:
/*!***********************************************************************!*\
  !*** ./src/app/view/admin/teacher-training/teacher-absent.service.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TeacherAbsentService: () => (/* binding */ TeacherAbsentService)
/* harmony export */ });
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../../environments/environment */ 45312);
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! exceljs */ 54058);
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(exceljs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! file-saver */ 85841);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 46443);





class TeacherAbsentService {
  constructor(http) {
    this.http = http;
    this.baseUrl = _environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl;
  }
  getAbsentTeachers() {
    return this.http.get(`${this.baseUrl}/teacher-absent`);
  }
  getAbsentTeachersByBatch(batchId) {
    return this.http.get(`${`${this.baseUrl}/teacher-absent`}/batch/${batchId}`);
  }
  getPresentTeachersByBatch(batchId) {
    return this.http.get(`${`${this.baseUrl}/teacher-absent`}/batch/${batchId}/present`);
  }
  downloadConsolidatedReport(batchId, batchName, totalTeachers, presentTeachers, absentTeachers) {
    // Create workbook
    const workbook = new exceljs__WEBPACK_IMPORTED_MODULE_1__.Workbook();
    // Summary worksheet
    const summarySheet = workbook.addWorksheet('Batch Report');
    const summaryData = [['Batch Details'], ['Batch Name', batchName], ['Total Participants', totalTeachers], ['Present Teachers', presentTeachers], ['Absent Teachers', absentTeachers], [''], ['Detailed List']];
    summaryData.forEach(row => summarySheet.addRow(row));
    // Add headers for absent teachers
    const headers = ['Name', 'Phone', 'Zone', 'District'];
    summarySheet.addRow(headers);
    // Get absent teachers data
    this.getAbsentTeachersByBatch(batchId).subscribe({
      next: absentTeachersList => {
        absentTeachersList.forEach(teacher => {
          summarySheet.addRow([teacher.teacherName, teacher.teacherPhone, teacher.teacherZone, teacher.teacherDistrict]);
        });
        // Optionally also fetch present teachers and add as a separate sheet
        this.getPresentTeachersByBatch(batchId).subscribe({
          next: presentTeachersList => {
            const presentSheet = workbook.addWorksheet('Present Teachers');
            presentSheet.addRow(headers);
            presentTeachersList.forEach(t => {
              presentSheet.addRow([t.teacherName, t.teacherPhone, t.teacherZone, t.teacherDistrict]);
            });
            // Download after both sheets are ready
            workbook.xlsx.writeBuffer().then(buffer => {
              const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });
              (0,file_saver__WEBPACK_IMPORTED_MODULE_2__.saveAs)(blob, `${batchName}_Report.xlsx`);
            });
          },
          error: error => {
            // Still download the summary sheet if present teachers fail
            workbook.xlsx.writeBuffer().then(buffer => {
              const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
              });
              (0,file_saver__WEBPACK_IMPORTED_MODULE_2__.saveAs)(blob, `${batchName}_Report.xlsx`);
            });
          }
        });
      },
      error: error => {
        console.error('Error generating report:', error);
      }
    });
  }
  static {
    this.ɵfac = function TeacherAbsentService_Factory(t) {
      return new (t || TeacherAbsentService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: TeacherAbsentService,
      factory: TeacherAbsentService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 95062:
/*!********************************************************************************!*\
  !*** ./src/app/view/admin/teacher-training/teacher-training-routing.module.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TeacherTrainingRoutingModule: () => (/* binding */ TeacherTrainingRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _create_batch_create_batch_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-batch/create-batch.component */ 25514);
/* harmony import */ var _view_batch_view_batch_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view-batch/view-batch.component */ 5656);
/* harmony import */ var _view_assigned_teachers_view_assigned_teachers_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-assigned-teachers/view-assigned-teachers.component */ 48884);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);






const routes = [{
  path: '',
  redirectTo: 'view-batch',
  pathMatch: 'full'
}, {
  path: 'create-batch',
  component: _create_batch_create_batch_component__WEBPACK_IMPORTED_MODULE_0__.CreateBatchComponent
}, {
  path: 'view-batch',
  component: _view_batch_view_batch_component__WEBPACK_IMPORTED_MODULE_1__.ViewBatchComponent
}, {
  path: 'view-teachers/:batchId',
  component: _view_assigned_teachers_view_assigned_teachers_component__WEBPACK_IMPORTED_MODULE_2__.ViewAssignedTeachersComponent
}];
class TeacherTrainingRoutingModule {
  static {
    this.ɵfac = function TeacherTrainingRoutingModule_Factory(t) {
      return new (t || TeacherTrainingRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
      type: TeacherTrainingRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](TeacherTrainingRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
})();

/***/ }),

/***/ 75199:
/*!************************************************************************!*\
  !*** ./src/app/view/admin/teacher-training/teacher-training.module.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TeacherTrainingModule: () => (/* binding */ TeacherTrainingModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _teacher_training_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./teacher-training-routing.module */ 95062);
/* harmony import */ var _create_batch_create_batch_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create-batch/create-batch.component */ 25514);
/* harmony import */ var _view_batch_view_batch_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-batch/view-batch.component */ 5656);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _view_assigned_teachers_view_assigned_teachers_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./view-assigned-teachers/view-assigned-teachers.component */ 48884);
/* harmony import */ var src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/components/form-dropdown/form-dropdown.component */ 55233);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);











class TeacherTrainingModule {
  static {
    this.ɵfac = function TeacherTrainingModule_Factory(t) {
      return new (t || TeacherTrainingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({
      type: TeacherTrainingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _teacher_training_routing_module__WEBPACK_IMPORTED_MODULE_0__.TeacherTrainingRoutingModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.CommonDropdownComponent, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_6__.FormDropdownComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__.PaginationComponent, _angular_common_http__WEBPACK_IMPORTED_MODULE_10__.HttpClientModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](TeacherTrainingModule, {
    declarations: [_create_batch_create_batch_component__WEBPACK_IMPORTED_MODULE_1__.CreateBatchComponent, _view_batch_view_batch_component__WEBPACK_IMPORTED_MODULE_2__.ViewBatchComponent, _view_assigned_teachers_view_assigned_teachers_component__WEBPACK_IMPORTED_MODULE_3__.ViewAssignedTeachersComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _teacher_training_routing_module__WEBPACK_IMPORTED_MODULE_0__.TeacherTrainingRoutingModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_9__.FormsModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.CommonDropdownComponent, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_6__.FormDropdownComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__.PaginationComponent, _angular_common_http__WEBPACK_IMPORTED_MODULE_10__.HttpClientModule]
  });
})();

/***/ }),

/***/ 33635:
/*!****************************************************************!*\
  !*** ./src/app/view/admin/teacher-training/teacher.service.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TeacherService: () => (/* binding */ TeacherService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../core/services/auth.service */ 68010);





class TeacherService {
  constructor(http, authService) {
    this.http = http;
    this.authService = authService;
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl;
  }
  getTeachers(zone, district, page = 1, limit = 10, searchTerm = '') {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams();
    // Send zone/district parameters if explicitly provided for filtering
    if (zone) {
      params = params.append('zone', zone);
    }
    if (district) {
      params = params.append('district', district);
    }
    // Add pagination parameters
    params = params.append('page', page.toString());
    params = params.append('limit', limit.toString());
    // Add search term parameter - this will search across name, phone, zone, and district
    if (searchTerm && searchTerm.trim()) {
      params = params.append('search', searchTerm.trim());
    }
    // Use the correct role values for teachers: 'standard' and 'power'
    // The backend expects role to be an array, so we need to send both values
    params = params.append('role', 'standard');
    params = params.append('role', 'power');
    console.log('TeacherService.getTeachers - API call with params:', {
      zone,
      district,
      page,
      limit,
      searchTerm,
      fullParams: params.toString()
    });
    return this.http.get(`${this.baseUrl}/user/list`, {
      params
    });
  }
  static {
    this.ɵfac = function TeacherService_Factory(t) {
      return new (t || TeacherService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_core_services_auth_service__WEBPACK_IMPORTED_MODULE_1__.AuthService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: TeacherService,
      factory: TeacherService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 48884:
/*!********************************************************************************************************!*\
  !*** ./src/app/view/admin/teacher-training/view-assigned-teachers/view-assigned-teachers.component.ts ***!
  \********************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewAssignedTeachersComponent: () => (/* binding */ ViewAssignedTeachersComponent)
/* harmony export */ });
/* harmony import */ var _home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_view_admin_teacher_training_batch_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/view/admin/teacher-training/batch.service */ 6821);
/* harmony import */ var src_app_view_admin_teacher_training_teacher_absent_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/view/admin/teacher-training/teacher-absent.service */ 10571);
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! exceljs */ 54058);
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(exceljs__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var canvas_confetti__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! canvas-confetti */ 11691);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 60316);









function ViewAssignedTeachersComponent_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "button", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_button_13_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r15);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r14.onSaveAndSubmit(ctx_r14.selectedBatch._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "div", 35)(2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3, "Save and Submit");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
  }
}
function ViewAssignedTeachersComponent_span_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Submitted ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ViewAssignedTeachersComponent_button_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "button", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_button_37_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r17);
      const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r16.generateAttendanceSheet());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](1, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2, "Attendance Sheet");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "p", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4, "Download Excel (.xlsx)");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
}
function ViewAssignedTeachersComponent_div_45_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 47)(1, "div", 21)(2, "div", 4)(3, "p", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_div_45_div_1_Template_button_click_7_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r21);
      const teacher_r19 = restoredCtx.$implicit;
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r20.onRemoveAssignedTeacher(ctx_r20.selectedBatch, teacher_r19));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "svg", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](9, "path", 52)(10, "path", 53)(11, "line", 54)(12, "line", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](13, "div", 56)(14, "div")(15, "p", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](16, "Zone");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](17, "p", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](19, "div")(20, "p", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](21, "District");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](22, "p", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](24, "div", 59)(25, "label", 60)(26, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](27, "Present");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](28, "input", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("change", function ViewAssignedTeachersComponent_div_45_div_1_Template_input_change_28_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r21);
      const teacher_r19 = restoredCtx.$implicit;
      const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r22.onAttendanceChange(teacher_r19._id, $event.target.checked));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const teacher_r19 = ctx.$implicit;
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](teacher_r19.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](teacher_r19.phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx_r18.selectedBatch.isSubmitted)("title", ctx_r18.selectedBatch.isSubmitted ? "Cannot remove teachers from a submitted batch" : "Remove teacher");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](teacher_r19.zone || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](teacher_r19.district || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("checked", ctx_r18.getTeacherAttendanceStatus(teacher_r19._id))("disabled", ctx_r18.selectedBatch.isSubmitted);
  }
}
function ViewAssignedTeachersComponent_div_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, ViewAssignedTeachersComponent_div_45_div_1_Template, 29, 8, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx_r3.selectedBatch.assignedTeachers);
  }
}
function ViewAssignedTeachersComponent_div_46_tr_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "tr", 70)(1, "td", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "td", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](5, "td", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](7, "td", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](9, "td", 73)(10, "input", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("change", function ViewAssignedTeachersComponent_div_46_tr_17_Template_input_change_10_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r26);
      const teacher_r24 = restoredCtx.$implicit;
      const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r25.onAttendanceChange(teacher_r24._id, $event.target.checked));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](11, "td", 74)(12, "button", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_div_46_tr_17_Template_button_click_12_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r26);
      const teacher_r24 = restoredCtx.$implicit;
      const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r27.onRemoveAssignedTeacher(ctx_r27.selectedBatch, teacher_r24));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](13, "svg", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](14, "path", 52)(15, "path", 53)(16, "line", 54)(17, "line", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const teacher_r24 = ctx.$implicit;
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](teacher_r24.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](teacher_r24.phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](teacher_r24.zone);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](teacher_r24.district);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("checked", ctx_r23.getTeacherAttendanceStatus(teacher_r24._id))("disabled", ctx_r23.selectedBatch.isSubmitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx_r23.selectedBatch.isSubmitted)("title", ctx_r23.selectedBatch.isSubmitted ? "Cannot remove teachers from a submitted batch" : "Remove teacher");
  }
}
function ViewAssignedTeachersComponent_div_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 62)(1, "table", 63)(2, "thead")(3, "tr", 64)(4, "th", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](5, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](7, "Phone");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](9, "Zone");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](11, "District");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "th", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](13, "Attendance");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](14, "th", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](15, "Actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](16, "tbody", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](17, ViewAssignedTeachersComponent_div_46_tr_17_Template, 18, 8, "tr", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx_r4.selectedBatch.assignedTeachers);
  }
}
function ViewAssignedTeachersComponent_div_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " No teachers assigned to this batch. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ViewAssignedTeachersComponent_div_54_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ctx_r6.uploadError, " ");
  }
}
function ViewAssignedTeachersComponent_div_70_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "img", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](2, "button", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_div_70_div_1_Template_button_click_2_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r32);
      const i_r30 = restoredCtx.index;
      const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r31.removePhoto(i_r30));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](3, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const photo_r29 = ctx.$implicit;
    const i_r30 = ctx.index;
    const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("src", photo_r29.objectURL, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsanitizeUrl"])("alt", "Selected photo " + (i_r30 + 1));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx_r28.selectedBatch == null ? null : ctx_r28.selectedBatch.isSubmitted);
  }
}
function ViewAssignedTeachersComponent_div_70_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, ViewAssignedTeachersComponent_div_70_div_1_Template, 4, 3, "div", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx_r8.selectedPhotos);
  }
}
function ViewAssignedTeachersComponent_div_71_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "img", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const photo_r34 = ctx.$implicit;
    const i_r35 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("src", photo_r34.path, _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsanitizeUrl"])("alt", "Selected photo " + (i_r35 + 1));
  }
}
function ViewAssignedTeachersComponent_div_71_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](1, ViewAssignedTeachersComponent_div_71_div_1_Template, 2, 2, "div", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngForOf", ctx_r9.batchPhotos);
  }
}
function ViewAssignedTeachersComponent_span_85_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ctx_r11.selectedPdf ? ctx_r11.selectedPdf.name : "No file selected", " ");
  }
}
function ViewAssignedTeachersComponent_span_86_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", ctx_r12.batchPdf ? ctx_r12.batchPdf.name : "No file selected", " ");
  }
}
function ViewAssignedTeachersComponent_button_87_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "button", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_button_87_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r37);
      const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](ctx_r36.removePdf());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, " Remove ");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx_r13.selectedBatch == null ? null : ctx_r13.selectedBatch.isSubmitted);
  }
}
const _c0 = function () {
  return [];
};
class ViewAssignedTeachersComponent {
  constructor() {
    this.selectedBatch = null;
    this.batches = [];
    this.presentTeachers = [];
    this.absentTeachers = [];
    this.photos = [];
    // File upload properties
    this.selectedPhotos = [];
    this.selectedPdf = null;
    this.maxPhotoSize = 5 * 1024 * 1024; // 5MB
    this.maxPdfSize = 10 * 1024 * 1024; // 10MB
    this.allowedPhotoTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    this.allowedPdfType = 'application/pdf';
    this.uploadError = null;
    this.URL = window.URL; // Add URL property for image preview
    this.route = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_6__.ActivatedRoute);
    this.batchService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(src_app_view_admin_teacher_training_batch_service__WEBPACK_IMPORTED_MODULE_1__.BatchService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router);
    this.teacherAbsentService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(src_app_view_admin_teacher_training_teacher_absent_service__WEBPACK_IMPORTED_MODULE_2__.TeacherAbsentService);
  }
  ngOnInit() {
    this.batchSubscription = this.route.paramMap.subscribe(params => {
      this.batchId = params.get('batchId');
      this.fetchBatchDetails(this.batchId);
    });
    // Subscribe to batch service updates
    this.batchesSubscription = this.batchService.batches$.subscribe(batches => {
      if (this.selectedBatch) {
        const updatedBatch = batches.find(b => b._id === this.selectedBatch._id);
        if (updatedBatch) {
          // Keep existing data and merge with updates
          this.selectedBatch = {
            ...this.selectedBatch,
            ...updatedBatch,
            assignedTeachers: this.selectedBatch.assignedTeachers || [],
            attendance: this.selectedBatch.attendance || []
          };
        }
      }
    });
  }
  fetchBatchDetails(batchId) {
    var _this = this;
    this.batchService.getBatchById(batchId).subscribe({
      next: function () {
        var _ref = (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (batch) {
          // Initialize with complete data
          _this.selectedBatch = {
            ...batch,
            assignedTeachers: batch.assignedTeachers || [],
            attendance: batch.attendance || []
          };
          // Clear previous selections
          _this.selectedPhotos = [];
          _this.selectedPdf = null;
          _this.batchPhotos = batch?.photoPaths;
          _this.batchPdf = {
            name: _this.batchService.extractActualFilename(batch?.attendancePdfPath)
          };
          // Fetch and populate existing photos
          // if (batch.photoPaths && batch.photoPaths.length > 0) {
          //   for (const photoData of batch.photoPaths) {
          //     if (!photoData || !photoData.path) {
          //       // Skip invalid entries
          //       continue;
          //     }
          //     try {
          //       const photoBlob = await this.batchService.getFile(photoData.path).toPromise();
          //       if (photoBlob) {
          //         // Use the mimetype fetched from the backend to create the File object
          //         const photoFile = new File([photoBlob], photoData.path.substring(photoData.path.lastIndexOf('/') + 1), { type: photoData.mimetype });
          //         (photoFile as FileWithObjectURL).objectURL = this.URL.createObjectURL(photoFile);
          //         this.selectedPhotos.push(photoFile as FileWithObjectURL);
          //       }
          //     } catch (error) {
          //       console.error(`Error fetching photo from ${photoData.path}:`, error);
          //     }
          //   }
          // }
          // Fetch and populate existing attendance PDF
          // if (batch.attendancePdfPath) {
          //   try {
          //     const pdfBlob = await this.batchService.getFile(batch.attendancePdfPath).toPromise();
          //     if (pdfBlob) {
          //       this.selectedPdf = new File([pdfBlob], batch.attendancePdfPath.substring(batch.attendancePdfPath.lastIndexOf('/') + 1), { type: pdfBlob.type });
          //     }
          //   } catch (error) {
          //     console.error(`Error fetching PDF from ${batch.attendancePdfPath}:`, error);
          //   }
          // }
        });
        return function next(_x) {
          return _ref.apply(this, arguments);
        };
      }(),
      error: error => {
        console.error('Error fetching batch details:', error);
        if (error.status === 403) {
          alert('Access denied. You can only view batches you created.');
        } else if (error.status === 404) {
          alert('Batch not found.');
        } else if (error.status === 401) {
          alert('Authentication required. Please log in again.');
        } else {
          alert('Error fetching batch details. Please try again.');
        }
        this.router.navigate(['/teacher-training/view-batch']);
      }
    });
  }
  getTeacherAttendanceStatus(teacherId) {
    if (!this.selectedBatch?.attendance) {
      return false;
    }
    return this.selectedBatch.attendance.includes(teacherId);
  }
  onAttendanceChange(teacherId, isPresent) {
    if (!this.selectedBatch) {
      console.error('No batch selected for attendance update.');
      return;
    }
    if (this.selectedBatch.isSubmitted) {
      console.warn('Cannot change attendance for a submitted batch.');
      return;
    }
    const batchId = this.selectedBatch._id;
    const currentAttendance = [...(this.selectedBatch.attendance || [])];
    let updatedAttendance;
    if (isPresent) {
      if (!currentAttendance.includes(teacherId)) {
        updatedAttendance = [...currentAttendance, teacherId];
      } else {
        updatedAttendance = currentAttendance;
      }
    } else {
      updatedAttendance = currentAttendance.filter(id => id !== teacherId);
    }
    // Create a new batch object with updated attendance
    const updatedBatch = {
      ...this.selectedBatch,
      attendance: updatedAttendance
    };
    // Update local state immediately
    this.selectedBatch = updatedBatch;
    // Update server
    this.batchService.updateAttendance(batchId, updatedAttendance).subscribe({
      next: response => {
        // Merge server response with current state
        this.selectedBatch = {
          ...this.selectedBatch,
          ...response,
          assignedTeachers: this.selectedBatch?.assignedTeachers || [],
          attendance: updatedAttendance
        };
        this.batchService.updateBatchInList(this.selectedBatch);
      },
      error: error => {
        console.error('Error updating attendance:', error);
        // Revert to previous state
        if (this.selectedBatch) {
          this.selectedBatch = {
            ...this.selectedBatch,
            attendance: currentAttendance
          };
        }
        if (error.status === 403) {
          alert('Access denied. You can only update batches you created.');
        } else if (error.status === 404) {
          alert('Batch not found.');
        } else {
          alert('Error updating attendance. Please try again.');
        }
      }
    });
  }
  onRemoveAssignedTeacher(batch, teacher) {
    if (batch.isSubmitted) {
      console.warn('Cannot remove teachers from a submitted batch.');
      return;
    }
    if (!batch._id || !teacher._id) {
      console.error('Batch ID or Teacher ID is missing.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${teacher.name} from ${batch.batchName}?`)) {
      const currentAttendance = [...(this.selectedBatch?.attendance || [])];
      const updatedAttendance = currentAttendance.filter(id => id !== teacher._id);
      this.batchService.removeTeacherFromBatch(batch._id, teacher._id).subscribe({
        next: updatedBatch => {
          this.selectedBatch = {
            ...updatedBatch,
            attendance: updatedAttendance
          };
          this.batchService.updateBatchInList(this.selectedBatch);
        },
        error: error => {
          console.error('Error removing teacher from batch:', error);
          if (error.status === 403) {
            alert('Access denied. You can only remove teachers from batches you created.');
          } else if (error.status === 404) {
            alert('Batch or teacher not found.');
          } else {
            alert('Error removing teacher from batch. Please try again.');
          }
        }
      });
    }
  }
  onPhotoSelect(event) {
    const input = event.target;
    if (input.files) {
      const files = Array.from(input.files);
      // Validate number of photos
      if (this.selectedPhotos.length + files.length > 2) {
        this.uploadError = 'You can only upload a maximum of 2 photos';
        return;
      }
      // Validate each file
      for (const file of files) {
        if (!this.allowedPhotoTypes.includes(file.type)) {
          this.uploadError = 'Only JPG, JPEG, and PNG files are allowed for photos';
          return;
        }
        if (file.size > this.maxPhotoSize) {
          this.uploadError = 'Photo size should not exceed 5MB';
          return;
        }
        // Create object URL immediately and attach it to the file object
        file.objectURL = this.URL.createObjectURL(file);
      }
      this.selectedPhotos = [...this.selectedPhotos, ...files.map(file => file)];
      this.uploadError = null;
    }
  }
  onPdfSelect(event) {
    const input = event.target;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.type !== this.allowedPdfType) {
        this.uploadError = 'Only PDF files are allowed';
        return;
      }
      if (file.size > this.maxPdfSize) {
        this.uploadError = 'PDF size should not exceed 10MB';
        return;
      }
      this.selectedPdf = file;
      this.uploadError = null;
    }
  }
  removePhoto(index) {
    if (this.selectedPhotos[index] && this.selectedPhotos[index].objectURL) {
      this.URL.revokeObjectURL(this.selectedPhotos[index].objectURL);
    }
    this.selectedPhotos.splice(index, 1);
  }
  removePdf() {
    this.selectedPdf = null;
  }
  onSaveAndSubmit(batchId) {
    if (!batchId) {
      console.error('Batch ID is missing.');
      return;
    }
    if (confirm('Are you sure you want to save and submit this batch? Once submitted, it cannot be modified.')) {
      const currentData = {
        assignedTeachers: this.selectedBatch?.assignedTeachers || [],
        attendance: this.selectedBatch?.attendance || []
      };
      // Only upload files if they are selected
      if (this.selectedPhotos.length > 0 || this.selectedPdf) {
        const formData = new FormData();
        this.selectedPhotos.forEach(photo => {
          formData.append('photos', photo);
        });
        if (this.selectedPdf) {
          formData.append('attendanceSheetFile', this.selectedPdf);
        }
        // First upload files if any
        this.batchService.uploadBatchFiles(batchId, formData).subscribe({
          next: () => {
            this.submitBatch(batchId, currentData);
          },
          error: error => {
            console.error('Error uploading files:', error);
            this.uploadError = 'Error uploading files. Please try again.';
          }
        });
      } else {
        // Submit batch without files
        this.submitBatch(batchId, currentData);
      }
    }
  }
  submitBatch(batchId, currentData) {
    this.batchService.submitBatch(batchId).subscribe({
      next: updatedBatch => {
        if (this.selectedBatch) {
          const newBatch = {
            ...updatedBatch,
            ...currentData
          };
          this.selectedBatch = newBatch;
          this.batchService.updateBatchInList(newBatch);
          // Trigger celebration animation after successful submission
          this.triggerCelebration();
        }
      },
      error: error => {
        console.error('Error submitting batch:', error);
        if (error.status === 403) {
          alert('Access denied. You can only submit batches you created.');
        } else if (error.status === 404) {
          alert('Batch not found.');
        } else {
          alert('Error submitting batch. Please try again.');
        }
      }
    });
  }
  triggerCelebration() {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = {
      startVelocity: 30,
      spread: 360,
      ticks: 60,
      zIndex: 0
    };
    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }
    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        return clearInterval(interval);
      }
      const particleCount = 50 * (timeLeft / duration);
      // since particles fall down, start a bit higher than random
      (0,canvas_confetti__WEBPACK_IMPORTED_MODULE_4__["default"])({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.1, 0.3),
          y: Math.random() - 0.2
        }
      });
      (0,canvas_confetti__WEBPACK_IMPORTED_MODULE_4__["default"])({
        ...defaults,
        particleCount,
        origin: {
          x: randomInRange(0.7, 0.9),
          y: Math.random() - 0.2
        }
      });
    }, 250);
  }
  goBack() {
    this.router.navigate(['/teacher-training/view-batch']);
  }
  getPresentCount() {
    if (!this.selectedBatch?.attendance) {
      return 0;
    }
    // Count only teachers who are both assigned and marked present
    return this.selectedBatch.attendance.filter(teacherId => this.selectedBatch?.assignedTeachers?.some(teacher => teacher._id === teacherId)).length;
  }
  getAbsentCount() {
    return this.getAbsentTeachers().length;
  }
  getAbsentTeachers() {
    if (!this.selectedBatch?.assignedTeachers) {
      return [];
    }
    // Count teachers who are assigned but not marked present
    return this.selectedBatch.assignedTeachers.filter(teacher => !this.selectedBatch?.attendance?.includes(teacher._id));
  }
  getPresentTeachers() {
    if (!this.selectedBatch?.attendance || !this.selectedBatch?.assignedTeachers) {
      return [];
    }
    const assignedTeachers = this.selectedBatch.assignedTeachers;
    return this.selectedBatch.attendance.filter(teacherId => assignedTeachers.some(teacher => teacher._id === teacherId)).map(teacherId => assignedTeachers.find(teacher => teacher._id === teacherId)).filter(teacher => teacher !== undefined);
  }
  // Convert File to Base64
  convertFileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
  downloadReport() {
    if (this.selectedBatch && this.selectedBatch._id) {
      const batchId = this.selectedBatch._id;
      this.batchService.downloadBatchExcelReport(batchId).subscribe({
        next: blob => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `teacher-report-${batchId}.xlsx`;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
          }, 100);
        },
        error: () => {
          alert('Failed to download report');
        }
      });
    } else {
      console.error('Cannot download report: Missing required batch information');
    }
  }
  generateAttendanceSheet() {
    var _this2 = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this2.selectedBatch || !_this2.selectedBatch.assignedTeachers || _this2.selectedBatch.assignedTeachers.length === 0) {
        alert('No teachers assigned to this batch.');
        return;
      }
      const batch = _this2.selectedBatch;
      const teachers = batch.assignedTeachers || [];
      const batchName = batch.batchName || '';
      const batchDate = batch.scheduleDate ? new Date(batch.scheduleDate) : null;
      const formattedDate = batchDate ? batchDate.toLocaleDateString() : '';
      // Create workbook and worksheet
      const workbook = new exceljs__WEBPACK_IMPORTED_MODULE_3__.Workbook();
      const worksheet = workbook.addWorksheet('Attendance Sheet');
      // Title row
      worksheet.mergeCells('A1', 'H1');
      const titleCell = worksheet.getCell('A1');
      titleCell.value = `Attendance Sheet – Batch ${batchName}`;
      titleCell.font = {
        size: 16,
        bold: true
      };
      titleCell.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
      titleCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FFD9EAD3'
        }
      };
      // Header row
      const headerRow = worksheet.addRow(['S.No', 'Teacher Name', 'Phone', 'Zone', 'District', 'Date', 'Signature']);
      headerRow.font = {
        bold: true
      };
      headerRow.alignment = {
        vertical: 'middle',
        horizontal: 'center'
      };
      headerRow.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'FFE2EFDA'
        }
      };
      // Data rows
      for (let idx = 0; idx < teachers.length; idx++) {
        const teacher = teachers[idx];
        worksheet.addRow([idx + 1, teacher.name || '', teacher.phone || '', teacher.zone || '', teacher.district || '', formattedDate, '' // Signature column left blank
        ]);
      }
      // Autofit columns
      worksheet.columns.forEach(column => {
        let maxLength = 10;
        if (typeof column.eachCell === 'function') {
          column.eachCell({
            includeEmpty: true
          }, cell => {
            const cellValue = cell.value ? cell.value.toString() : '';
            maxLength = Math.max(maxLength, cellValue.length + 2);
          });
        }
        column.width = maxLength;
      });
      // Add border to all cells
      worksheet.eachRow({
        includeEmpty: false
      }, row => {
        row.eachCell({
          includeEmpty: false
        }, cell => {
          cell.border = {
            top: {
              style: 'thin'
            },
            left: {
              style: 'thin'
            },
            bottom: {
              style: 'thin'
            },
            right: {
              style: 'thin'
            }
          };
        });
      });
      // Download the Excel file
      const buffer = yield workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Attendance_Sheet_${batchName.replace(/\s+/g, '_')}.xlsx`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      }, 100);
    })();
  }
  ngOnDestroy() {
    if (this.batchSubscription) {
      this.batchSubscription.unsubscribe();
    }
    if (this.batchesSubscription) {
      this.batchesSubscription.unsubscribe();
    }
    // Revoke all object URLs to prevent memory leaks
    this.selectedPhotos.forEach(photo => {
      if (photo.objectURL) {
        this.URL.revokeObjectURL(photo.objectURL);
      }
    });
  }
  static {
    this.ɵfac = function ViewAssignedTeachersComponent_Factory(t) {
      return new (t || ViewAssignedTeachersComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
      type: ViewAssignedTeachersComponent,
      selectors: [["app-view-assigned-teachers"]],
      decls: 88,
      vars: 23,
      consts: [[1, "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "text-2xl", "md:text-[30px]", "font-bold", "text-content", "md:leading-[48px]"], [1, "border", "rounded", "bg-white", "mt-6", "px-4", "py-6", "md:px-6", "md:py-8"], [1, "flex", "flex-col", "gap-4", "sm:flex-row", "sm:items-start", "sm:justify-between"], [1, "min-w-0"], ["type", "button", 1, "back-link", 3, "click"], [1, "mt-2", "text-content", "text-2xl", "md:text-[30px]", "font-bold", "md:leading-[48px]", "break-words"], [1, "mt-2", "text-content-60", "break-words"], [1, "w-full", "sm:w-auto", "flex", "flex-col", "sm:flex-row", "gap-2", "sm:items-center"], ["type", "button", "class", "btn-primary h-9 w-full sm:w-auto", 3, "click", 4, "ngIf"], ["class", "inline-flex items-center justify-center px-3 py-1 rounded-full text-green bg-success-50 w-full sm:w-auto", 4, "ngIf"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "xl:grid-cols-4", "gap-3", "mt-6"], ["type", "button", 1, "metric-card", "text-left", 3, "click"], [1, "metric-label"], [1, "metric-value"], [1, "metric-copy"], [1, "metric-card"], [1, "metric-value", "text-green"], [1, "metric-value", "text-orange"], ["type", "button", "class", "metric-card text-left", 3, "click", 4, "ngIf"], [1, "mt-7"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "text-content", "text-xl", "md:text-2xl", "font-bold"], [1, "mt-1", "text-sm", "text-content-60"], ["class", "space-y-4 md:hidden mt-4", 4, "ngIf"], ["class", "hidden md:block w-full overflow-x-auto mt-4", 4, "ngIf"], ["class", "text-center text-content-60 py-4 border rounded-xl mt-4", 4, "ngIf"], ["class", "upload-error mt-4", 4, "ngIf"], [1, "upload-section", "mt-4"], [1, "font-semibold", "text-content"], [1, "text-sm", "text-content-60", "mt-1"], [1, "upload-actions", "mt-4"], ["id", "photoInput", "type", "file", "accept", "image/jpeg,image/png,image/jpg", "multiple", "", 1, "hidden", 3, "disabled", "change"], ["photoInput", ""], ["type", "button", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "disabled", "click"], [1, "flex", "items-center", "justify-center", "gap-2"], [1, "text-sm", "text-content-60", "break-words"], ["class", "upload-preview-grid mt-4", 4, "ngIf"], ["id", "pdfInput", "type", "file", "accept", "application/pdf", 1, "hidden", 3, "disabled", "change"], ["pdfInput", ""], ["class", "text-sm text-content-60 break-words", 4, "ngIf"], ["type", "button", "class", "upload-remove-link", 3, "disabled", "click", 4, "ngIf"], ["type", "button", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "click"], [1, "inline-flex", "items-center", "justify-center", "px-3", "py-1", "rounded-full", "text-green", "bg-success-50", "w-full", "sm:w-auto"], [1, "metric-copy", "mt-2"], [1, "space-y-4", "md:hidden", "mt-4"], ["class", "rounded-xl border p-4 bg-white shadow-sm", 4, "ngFor", "ngForOf"], [1, "rounded-xl", "border", "p-4", "bg-white", "shadow-sm"], [1, "font-semibold", "break-words"], [1, "text-sm", "text-content-60", "mt-1", "break-all"], ["type", "button", 1, "remove-assigned-teacher-icon", 3, "disabled", "title", "click"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["d", "M3 6h18"], ["d", "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"], ["x1", "10", "y1", "11", "x2", "10", "y2", "17"], ["x1", "14", "y1", "11", "x2", "14", "y2", "17"], [1, "mt-4", "grid", "grid-cols-2", "gap-3", "text-sm"], [1, "text-xs", "text-content-60"], [1, "break-words"], [1, "col-span-2"], [1, "attendance-row"], ["type", "checkbox", 3, "checked", "disabled", "change"], [1, "hidden", "md:block", "w-full", "overflow-x-auto", "mt-4"], [1, "table-auto", "min-w-[900px]", "w-full", "border", "rounded-lg", "text-content"], [1, "bg-primary-60", "rounded-lg", "border-b"], [1, "text-left", "p-4", "rounded", "border-r", "text-sm", "text-content"], [1, "text-left", "p-4", "border-r", "text-sm", "text-content"], [1, "text-left", "p-4", "text-sm", "text-content"], [1, "bg-white"], ["class", "border-b", 4, "ngFor", "ngForOf"], [1, "border-b"], [1, "text-sm", "p-4", "border-r", "break-words"], [1, "text-sm", "p-4", "border-r", "whitespace-nowrap"], [1, "text-sm", "p-4", "border-r", "text-center"], [1, "text-sm", "p-4", "text-center"], [1, "text-center", "text-content-60", "py-4", "border", "rounded-xl", "mt-4"], [1, "upload-error", "mt-4"], [1, "upload-preview-grid", "mt-4"], ["class", "upload-preview-card", 4, "ngFor", "ngForOf"], [1, "upload-preview-card"], [1, "upload-preview-image", 3, "src", "alt"], ["type", "button", 1, "upload-remove-btn", 3, "disabled", "click"], ["type", "button", 1, "upload-remove-link", 3, "disabled", "click"]],
      template: function ViewAssignedTeachersComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵgetCurrentView"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0)(1, "h1", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2, " Teacher Training ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "div", 2)(4, "div", 3)(5, "div", 4)(6, "button", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_Template_button_click_6_listener() {
            return ctx.goBack();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](7, "\u2190 Back to Batches");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](8, "h2", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](10, "p", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](11);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](13, ViewAssignedTeachersComponent_button_13_Template, 4, 0, "button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](14, ViewAssignedTeachersComponent_span_14_Template, 2, 0, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](15, "div", 11)(16, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_Template_button_click_16_listener() {
            return ctx.downloadReport();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](17, "p", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](18, "Total Participants");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](19, "p", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](21, "p", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](22, "Download batch report");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](23, "div", 16)(24, "p", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](25, "Present");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](26, "p", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](27);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](28, "p", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](29, "Attendance marked present");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](30, "div", 16)(31, "p", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](32, "Absent");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](33, "p", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](34);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](35, "p", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](36, "Assigned but not marked present");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](37, ViewAssignedTeachersComponent_button_37_Template, 5, 0, "button", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](38, "div", 20)(39, "div", 21)(40, "div")(41, "p", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](42, "Assigned Teachers");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](43, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](44, "Mark attendance and remove teachers before the batch is submitted.");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](45, ViewAssignedTeachersComponent_div_45_Template, 2, 1, "div", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](46, ViewAssignedTeachersComponent_div_46_Template, 18, 1, "div", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](47, ViewAssignedTeachersComponent_div_47_Template, 2, 0, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](48, "div", 20)(49, "div")(50, "p", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](51, "Proof Documents");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](52, "p", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](53, "Upload photos and the attendance sheet for this batch.");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](54, ViewAssignedTeachersComponent_div_54_Template, 2, 1, "div", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](55, "div", 28)(56, "div")(57, "p", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](58, "Upload Photos");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](59, "p", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](60, "Maximum 2 images, up to 5MB each. Allowed types: JPG, JPEG, PNG.");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](61, "div", 31)(62, "input", 32, 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("change", function ViewAssignedTeachersComponent_Template_input_change_62_listener($event) {
            return ctx.onPhotoSelect($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](64, "button", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_Template_button_click_64_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r38);
            const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](63);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](_r7.click());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](65, "div", 35)(66, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](67, "Select Photos");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](68, "span", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](69);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](70, ViewAssignedTeachersComponent_div_70_Template, 2, 1, "div", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](71, ViewAssignedTeachersComponent_div_71_Template, 2, 1, "div", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](72, "div", 28)(73, "div")(74, "p", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](75, "Upload Attendance Sheet");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](76, "p", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](77, "PDF only, up to 10MB.");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](78, "div", 31)(79, "input", 38, 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("change", function ViewAssignedTeachersComponent_Template_input_change_79_listener($event) {
            return ctx.onPdfSelect($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](81, "button", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("click", function ViewAssignedTeachersComponent_Template_button_click_81_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵrestoreView"](_r38);
            const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵreference"](80);
            return _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵresetView"](_r10.click());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](82, "div", 35)(83, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](84, "Select PDF");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](85, ViewAssignedTeachersComponent_span_85_Template, 2, 1, "span", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](86, ViewAssignedTeachersComponent_span_86_Template, 2, 1, "span", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](87, ViewAssignedTeachersComponent_button_87_Template, 2, 1, "button", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", (ctx.selectedBatch == null ? null : ctx.selectedBatch.batchName) || "Batch Details", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", (ctx.selectedBatch == null ? null : ctx.selectedBatch.description) || "Track attendance, manage participants, and upload supporting documents.", " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.selectedBatch && !ctx.selectedBatch.isSubmitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.selectedBatch && ctx.selectedBatch.isSubmitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"]((ctx.selectedBatch == null ? null : ctx.selectedBatch.assignedTeachers == null ? null : ctx.selectedBatch.assignedTeachers.length) || 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](ctx.getPresentCount());
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](ctx.getAbsentCount());
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((ctx.selectedBatch == null ? null : ctx.selectedBatch.assignedTeachers) || _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction0"](22, _c0)).length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.selectedBatch && ctx.selectedBatch.assignedTeachers && ctx.selectedBatch.assignedTeachers.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.selectedBatch && ctx.selectedBatch.assignedTeachers && ctx.selectedBatch.assignedTeachers.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !ctx.selectedBatch || !ctx.selectedBatch.assignedTeachers || ctx.selectedBatch.assignedTeachers.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.uploadError);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx.selectedBatch == null ? null : ctx.selectedBatch.isSubmitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx.selectedBatch == null ? null : ctx.selectedBatch.isSubmitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", ctx.selectedPhotos.length, " photos selected");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !(ctx.selectedBatch == null ? null : ctx.selectedBatch.isSubmitted));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.selectedBatch == null ? null : ctx.selectedBatch.isSubmitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx.selectedBatch == null ? null : ctx.selectedBatch.isSubmitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx.selectedBatch == null ? null : ctx.selectedBatch.isSubmitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", !(ctx.selectedBatch == null ? null : ctx.selectedBatch.isSubmitted));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.selectedBatch == null ? null : ctx.selectedBatch.isSubmitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.selectedPdf);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf],
      styles: ["input[type=checkbox][_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  accent-color: var(--success-DEFAULT);\n  cursor: pointer;\n}\n\ninput[type=checkbox][_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXctYXNzaWduZWQtdGVhY2hlcnMuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLG9DQUFBO0VBQ0EsZUFBQTtBQUNGOztBQUVBO0VBQ0UsWUFBQTtFQUNBLG1CQUFBO0FBQ0YiLCJmaWxlIjoidmlldy1hc3NpZ25lZC10ZWFjaGVycy5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbImlucHV0W3R5cGU9J2NoZWNrYm94J10ge1xuICB3aWR0aDogMThweDtcbiAgaGVpZ2h0OiAxOHB4O1xuICBhY2NlbnQtY29sb3I6IHZhcigtLXN1Y2Nlc3MtREVGQVVMVCk7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuaW5wdXRbdHlwZT0nY2hlY2tib3gnXTpkaXNhYmxlZCB7XG4gIG9wYWNpdHk6IDAuNjtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi90ZWFjaGVyLXRyYWluaW5nL3ZpZXctYXNzaWduZWQtdGVhY2hlcnMvdmlldy1hc3NpZ25lZC10ZWFjaGVycy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0Esb0NBQUE7RUFDQSxlQUFBO0FBQ0Y7O0FBRUE7RUFDRSxZQUFBO0VBQ0EsbUJBQUE7QUFDRjtBQUNBLHdvQkFBd29CIiwic291cmNlc0NvbnRlbnQiOlsiaW5wdXRbdHlwZT0nY2hlY2tib3gnXSB7XG4gIHdpZHRoOiAxOHB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIGFjY2VudC1jb2xvcjogdmFyKC0tc3VjY2Vzcy1ERUZBVUxUKTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG5pbnB1dFt0eXBlPSdjaGVja2JveCddOmRpc2FibGVkIHtcbiAgb3BhY2l0eTogMC42O1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 5656:
/*!********************************************************************************!*\
  !*** ./src/app/view/admin/teacher-training/view-batch/view-batch.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewBatchComponent: () => (/* binding */ ViewBatchComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_view_admin_teacher_training_batch_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/view/admin/teacher-training/batch.service */ 6821);
/* harmony import */ var src_app_view_admin_teacher_training_teacher_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/view/admin/teacher-training/teacher.service */ 33635);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 95429);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 51903);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 43143);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 89475);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/core/services/auth.service */ 68010);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../../../shared/components/pagination/pagination.component */ 94815);











function ViewBatchComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 16)(1, "div", 17)(2, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3, "Total Teachers");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "p", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "div", 17)(7, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8, "Trained Teachers");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "p", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 17)(12, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Untrained Teachers");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r0.teacherStats.totalTeachers);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r0.teacherStats.trainedTeachers);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r0.teacherStats.untrainedTeachers);
  }
}
function ViewBatchComponent_div_16_div_1_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div")(1, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Manager");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const batch_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"]((batch_r7.createdBy == null ? null : batch_r7.createdBy.name) || "-");
  }
}
const _c0 = function (a0, a1) {
  return {
    "text-green bg-success-50": a0,
    "text-orange bg-orange-50": a1
  };
};
function ViewBatchComponent_div_16_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 25)(1, "div", 26)(2, "div", 4)(3, "p", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "p", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](7, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "div", 30)(11, "div")(12, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Mode of Training");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](16, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](17, ViewBatchComponent_div_16_div_1_div_17_Template, 5, 1, "div", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "div", 34)(19, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_16_div_1_Template_button_click_19_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r11);
      const batch_r7 = restoredCtx.$implicit;
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r10.onViewTeachers(batch_r7));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "div", 8)(21, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](22, "View Teachers");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](23, "button", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_16_div_1_Template_button_click_23_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r11);
      const batch_r7 = restoredCtx.$implicit;
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r12.toggleTeachersPanel(batch_r7));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "div", 8)(25, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](27, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_16_div_1_Template_button_click_27_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r11);
      const batch_r7 = restoredCtx.$implicit;
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r13.onDeleteBatch(batch_r7._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](28, "div", 8)(29, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](30, "Delete Batch");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const batch_r7 = ctx.$implicit;
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](batch_r7.batchName);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](7, 9, batch_r7.scheduleDate));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction2"](13, _c0, batch_r7.isSubmitted, !batch_r7.isSubmitted));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", batch_r7.isSubmitted ? "Completed" : "Ongoing", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](16, 11, batch_r7.trainingType));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r5.isAdmin);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", batch_r7.isSubmitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"]((ctx_r5.selectedBatch == null ? null : ctx_r5.selectedBatch._id) === batch_r7._id && ctx_r5.showTeachersPanel ? "Close Participants" : "Add Participants");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", batch_r7.isSubmitted);
  }
}
function ViewBatchComponent_div_16_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " No batches found. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ViewBatchComponent_div_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](1, ViewBatchComponent_div_16_div_1_Template, 31, 16, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, ViewBatchComponent_div_16_div_2_Template, 2, 0, "div", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r1.batches);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r1.batches || !ctx_r1.batches.length);
  }
}
function ViewBatchComponent_div_17_th_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "Manager");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ViewBatchComponent_div_17_tr_18_td_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "td", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const batch_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"]((batch_r16.createdBy == null ? null : batch_r16.createdBy.name) || "-");
  }
}
const _c1 = function (a0) {
  return {
    "bg-blue-50": a0
  };
};
function ViewBatchComponent_div_17_tr_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr", 48)(1, "td", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](5, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "td", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](8, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, ViewBatchComponent_div_17_tr_18_td_9_Template, 2, 1, "td", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "td", 52)(11, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_17_tr_18_Template_button_click_11_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r20);
      const batch_r16 = restoredCtx.$implicit;
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r19.onViewTeachers(batch_r16));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "div", 8)(13, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "View Teachers");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "td", 52)(16, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "td", 55)(19, "div", 56)(20, "button", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_17_tr_18_Template_button_click_20_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r20);
      const batch_r16 = restoredCtx.$implicit;
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r21.toggleTeachersPanel(batch_r16));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "div", 8)(22, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](24, "button", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_17_tr_18_Template_button_click_24_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r20);
      const batch_r16 = restoredCtx.$implicit;
      const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r22.onDeleteBatch(batch_r16._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](25, "div", 8)(26, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](27, "Delete Batch");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()()()();
  }
  if (rf & 2) {
    const batch_r16 = ctx.$implicit;
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction1"](14, _c1, (ctx_r15.selectedBatch == null ? null : ctx_r15.selectedBatch._id) === batch_r16._id && ctx_r15.showTeachersPanel));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](batch_r16.batchName);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](5, 10, batch_r16.scheduleDate));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](8, 12, batch_r16.trainingType));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r15.isAdmin);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpureFunction2"](16, _c0, batch_r16.isSubmitted, !batch_r16.isSubmitted));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", batch_r16.isSubmitted ? "Completed" : "Ongoing", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", batch_r16.isSubmitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"]((ctx_r15.selectedBatch == null ? null : ctx_r15.selectedBatch._id) === batch_r16._id && ctx_r15.showTeachersPanel ? "Close Participants" : "Add Participants");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", batch_r16.isSubmitted);
  }
}
function ViewBatchComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 39)(1, "table", 40)(2, "thead")(3, "tr", 41)(4, "th", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5, "Batch Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, "Schedule Date");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, "Mode of Training");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](10, ViewBatchComponent_div_17_th_10_Template, 2, 0, "th", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12, "View Teacher");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](16, "Actions");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](17, "tbody", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, ViewBatchComponent_div_17_tr_18_Template, 28, 19, "tr", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r2.isAdmin);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r2.batches);
  }
}
function ViewBatchComponent_div_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, " No batches found. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function ViewBatchComponent_div_19_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_19_button_19_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r32);
      const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r31.clearSearch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "svg", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "line", 84)(3, "line", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function ViewBatchComponent_div_19_ng_container_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" (", ctx_r24.selectedTeachersForAssignment.length, ")");
  }
}
function ViewBatchComponent_div_19_div_25_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" (searching \"", ctx_r33.teacherSearchTerm, "\")");
  }
}
function ViewBatchComponent_div_19_div_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, ViewBatchComponent_div_19_div_25_span_2_Template, 2, 1, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"](" ", ctx_r25.filteredTeachers.length, " of ", ctx_r25.teachersTotalItems, " teachers ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r25.teacherSearchTerm.trim());
  }
}
function ViewBatchComponent_div_19_div_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 87)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, "Loading teachers...");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
}
function ViewBatchComponent_div_19_div_28_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "tr", 91)(1, "td", 52)(2, "input", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("change", function ViewBatchComponent_div_19_div_28_tr_19_Template_input_change_2_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r37);
      const teacher_r35 = restoredCtx.$implicit;
      const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r36.selectedBatch && ctx_r36.onTeacherCheckboxChange(ctx_r36.selectedBatch, teacher_r35, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "td", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "td", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "td", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "td", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "td", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "td", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const teacher_r35 = ctx.$implicit;
    const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("checked", ctx_r34.isTeacherSelectedForAssignment(teacher_r35));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](teacher_r35.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](teacher_r35.phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](teacher_r35.role);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](teacher_r35.zone);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](teacher_r35.district);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](teacher_r35.block);
  }
}
function ViewBatchComponent_div_19_div_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 88)(1, "table", 89)(2, "thead")(3, "tr", 41)(4, "th", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](5, "Select");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, "Name");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, "Phone");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "Role");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](13, "Zone");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](14, "th", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15, "District");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "th", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17, "Block");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](18, "tbody", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](19, ViewBatchComponent_div_19_div_28_tr_19_Template, 15, 7, "tr", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r27.filteredTeachers);
  }
}
function ViewBatchComponent_div_19_p_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "p", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", ctx_r28.isLoadingTeachers ? "Loading teachers..." : "No teachers found.", " ");
  }
}
function ViewBatchComponent_div_19_div_30_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 95)(1, "app-pagination", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("pageChange", function ViewBatchComponent_div_19_div_30_Template_app_pagination_pageChange_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r39);
      const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r38.onTeachersPageChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("totalItems", ctx_r29.teachersTotalItems)("pageSize", ctx_r29.teachersPageSize)("currentPage", ctx_r29.teachersCurrentPage);
  }
}
function ViewBatchComponent_div_19_div_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 97)(1, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_19_div_31_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r41);
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r40.loadMoreTeachers());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "div", 8)(3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"]("Load More Teachers (", ctx_r30.allTeachers.length, " of ", ctx_r30.teachersTotalItems, ")");
  }
}
function ViewBatchComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 60)(1, "button", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_19_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r43);
      const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r42.closeAddParticipantsSidebar());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "aside", 62)(3, "div", 63)(4, "div", 4)(5, "h3");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6, "Add Participants to Batch");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](7, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](9, "button", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_19_Template_button_click_9_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r43);
      const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r44.closeAddParticipantsSidebar());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](10, "Close");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "div", 65)(12, "div", 66)(13, "div", 67)(14, "input", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngModelChange", function ViewBatchComponent_div_19_Template_input_ngModelChange_14_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r43);
      const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r45.teacherSearchTerm = $event);
    })("input", function ViewBatchComponent_div_19_Template_input_input_14_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r43);
      const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r46.onTeacherSearch());
    })("keypress", function ViewBatchComponent_div_19_Template_input_keypress_14_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r43);
      const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r47.onSearchKeyPress($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "div", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](16, "svg", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](17, "circle", 71)(18, "path", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](19, ViewBatchComponent_div_19_button_19_Template, 4, 0, "button", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](20, "button", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function ViewBatchComponent_div_19_Template_button_click_20_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r43);
      const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r48.assignSelectedTeachersToBatch());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](21, "div", 8)(22, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](24, ViewBatchComponent_div_19_ng_container_24_Template, 2, 1, "ng-container", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](25, ViewBatchComponent_div_19_div_25_Template, 3, 3, "div", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](26, "div", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](27, ViewBatchComponent_div_19_div_27_Template, 3, 0, "div", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](28, ViewBatchComponent_div_19_div_28_Template, 20, 1, "div", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](29, ViewBatchComponent_div_19_p_29_Template, 2, 1, "p", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](30, ViewBatchComponent_div_19_div_30_Template, 2, 3, "div", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](31, ViewBatchComponent_div_19_div_31_Template, 5, 2, "div", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r4.selectedBatch.batchName);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngModel", ctx_r4.teacherSearchTerm)("disabled", ctx_r4.isLoadingTeachers || ctx_r4.isAssigningTeachers);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r4.teacherSearchTerm.trim());
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", !ctx_r4.selectedTeachersForAssignment.length || ctx_r4.isLoadingTeachers || ctx_r4.isAssigningTeachers || ctx_r4.selectedBatch.isSubmitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](ctx_r4.isAssigningTeachers ? "Assigning..." : "Assign to Batch");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r4.selectedTeachersForAssignment.length && !ctx_r4.isAssigningTeachers);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r4.isLoadingTeachers);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r4.isLoadingTeachers);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r4.filteredTeachers && ctx_r4.filteredTeachers.length > 0 && !ctx_r4.isLoadingTeachers);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx_r4.filteredTeachers || ctx_r4.filteredTeachers.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r4.teachersTotalItems > 0 && !ctx_r4.isLoadingTeachers);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r4.allTeachers.length < ctx_r4.teachersTotalItems && !ctx_r4.isLoadingTeachers);
  }
}
class ViewBatchComponent {
  constructor() {
    this.batches = [];
    this.teacherStats = null;
    this.showTeachersPanel = false;
    this.selectedBatch = null;
    this.allTeachers = [];
    this.filteredTeachers = [];
    this.selectedTeachersForAssignment = [];
    // Pagination properties for Add Participants
    this.teachersCurrentPage = 1;
    this.teachersPageSize = 50; // Load more teachers per page
    this.teachersTotalItems = 0;
    this.isLoadingTeachers = false;
    this.isAssigningTeachers = false;
    this.batchId = null;
    // Search functionality
    this.teacherSearchTerm = '';
    this.searchTimeout = null;
    this.isAdmin = false;
    this.route = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_5__.ActivatedRoute);
    this.batchService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(src_app_view_admin_teacher_training_batch_service__WEBPACK_IMPORTED_MODULE_0__.BatchService);
    this.teacherService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(src_app_view_admin_teacher_training_teacher_service__WEBPACK_IMPORTED_MODULE_1__.TeacherService);
    this.router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_5__.Router);
    this.authService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_4__.inject)(src_app_core_services_auth_service__WEBPACK_IMPORTED_MODULE_2__.AuthService);
    this.batchId = this.route.snapshot.params['id'];
  }
  ngOnInit() {
    this.fetchBatches(); // Then fetch batches
    this.fetchTeacherStats();
    this.batchesSubscription = this.batchService.batches$.subscribe(batches => {
      this.batches = batches;
    });
    this.loadBatchDetails();
    const currentUser = this.authService.getCurrentUser();
    this.isAdmin = !!(currentUser && (Array.isArray(currentUser.role) ? currentUser.role.includes('admin') : currentUser.role === 'admin'));
  }
  fetchBatches() {
    this.batchService.fetchBatches().subscribe({
      next: batches => {
        this.batchService.setBatches(batches);
      },
      error: error => {
        console.error('Error fetching batches:', error);
        // Handle specific error cases
        if (error.status === 403) {
          console.error('Access denied: You do not have permission to view these batches');
        } else if (error.status === 401) {
          console.error('Authentication required : Please log in again');
        }
        // Handle error (e.g., show a toast message)
      }
    });
  }

  fetchTeacherStats() {
    this.batchService.getTeacherTrainingStats().subscribe({
      next: stats => {
        this.teacherStats = stats;
      },
      error: error => {
        console.error('Error fetching teacher stats:', error);
      }
    });
  }
  toggleTeachersPanel(batch) {
    if (batch.isSubmitted) {
      console.warn('Cannot add participants to a submitted batch.');
      return;
    }
    const isSameBatch = this.selectedBatch?._id === batch._id;
    if (isSameBatch && this.showTeachersPanel) {
      this.closeAddParticipantsSidebar();
      return;
    }
    this.selectedBatch = batch;
    this.showTeachersPanel = true;
    this.selectedTeachersForAssignment = [];
    this.teacherSearchTerm = '';
    this.teachersCurrentPage = 1;
    this.loadTeachersAndFilter();
  }
  onTeacherSearch() {
    // Clear existing timeout
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    // Debounce search to avoid too many API calls
    this.searchTimeout = setTimeout(() => {
      this.teachersCurrentPage = 1; // Reset to first page when searching
      this.loadTeachersAndFilter();
    }, 3000);
  }
  clearSearch() {
    this.teacherSearchTerm = '';
    this.teachersCurrentPage = 1; // Reset to first page when clearing search
    this.loadTeachersAndFilter();
  }
  closeAddParticipantsSidebar() {
    this.showTeachersPanel = false;
    this.selectedBatch = null;
    this.selectedTeachersForAssignment = [];
    this.teacherSearchTerm = '';
    this.isAssigningTeachers = false;
  }
  loadTeachersAndFilter() {
    this.isLoadingTeachers = true;
    this.teacherService.getTeachers(undefined, undefined, this.teachersCurrentPage, this.teachersPageSize, this.teacherSearchTerm).subscribe({
      next: response => {
        // Type guard for expected response structure
        const res = response;
        this.isLoadingTeachers = false;
        if (res.success && res.data) {
          this.allTeachers = res.data.results || [];
          this.teachersTotalItems = res.data.totalItems || 0;
          this.filterTeachersForSidebar();
        } else {
          this.allTeachers = [];
          this.filteredTeachers = [];
          this.teachersTotalItems = 0;
        }
      },
      error: () => {
        this.isLoadingTeachers = false;
        this.allTeachers = [];
        this.filteredTeachers = [];
        this.teachersTotalItems = 0;
      }
    });
  }
  filterTeachersForSidebar() {
    const activelyAssignedTeacherIds = new Set();
    // Process all batches to determine which teachers should be filtered out
    this.batches.forEach(batch => {
      if (!batch.isSubmitted) {
        // For unsubmitted batches: All assigned teachers should be filtered out
        batch.assignedTeachers?.forEach(teacher => {
          if (teacher._id) {
            activelyAssignedTeacherIds.add(teacher._id);
          }
        });
      } else {
        // For submitted batches: Only present teachers should be filtered out
        // Absent teachers should re-appear in the available list
        batch.assignedTeachers?.forEach(teacher => {
          if (teacher._id) {
            const isPresent = batch.attendance?.includes(teacher._id) || false;
            if (isPresent) {
              // Teacher was present in submitted batch - filter them out
              activelyAssignedTeacherIds.add(teacher._id);
            } else {
              // Teacher was absent in submitted batch - they should re-appear
            }
          }
        });
      }
    });
    // Filter teachers based on assignment status only (search is handled server-side)
    this.filteredTeachers = this.allTeachers.filter(teacher => {
      // Check if teacher is actively assigned to an unsubmitted batch or present in submitted batch
      if (activelyAssignedTeacherIds.has(teacher._id)) {
        return false;
      }
      return true;
    });
  }
  onTeacherCheckboxChange(batch, teacher, event) {
    const checkbox = event.target;
    if (checkbox.checked) {
      if (!this.selectedTeachersForAssignment.includes(teacher._id)) {
        this.selectedTeachersForAssignment.push(teacher._id);
      }
    } else {
      this.selectedTeachersForAssignment = this.selectedTeachersForAssignment.filter(id => id !== teacher._id);
    }
  }
  onDeleteBatch(batchId) {
    if (!batchId) {
      console.error('Batch ID is undefined. Cannot delete batch.');
      return;
    }
    if (confirm('Are you sure you want to delete this batch? This action cannot be undone.')) {
      this.batchService.deleteBatch(batchId).subscribe({
        next: () => {
          // Remove the batch from the local array
          this.batches = this.batches.filter(batch => batch._id !== batchId);
          this.batchService.setBatches(this.batches);
        },
        error: error => {
          console.error('Error deleting batch:', error);
          if (error.status === 403) {
            alert('Access denied. You can only delete batches you created.');
          } else if (error.status === 404) {
            alert('Batch not found.');
          } else {
            alert('Error deleting batch. Please try again.');
          }
        }
      });
    }
  }
  onViewTeachers(batch) {
    if (batch._id) {
      // First check if we can access this batch
      this.batchService.getBatchById(batch._id).subscribe({
        next: () => {
          // If we can access the batch, navigate to view teachers
          this.router.navigate(['/teacher-training/view-teachers', batch._id]);
        },
        error: error => {
          console.error('Error accessing batch:', error);
          if (error.status === 403) {
            alert('Access denied. You can only view batches you created.');
          } else if (error.status === 404) {
            alert('Batch not found.');
          } else {
            alert('Error accessing batch details. Please try again.');
          }
        }
      });
    } else {
      console.error('Batch ID is undefined. Cannot navigate to view teachers page.');
    }
  }
  onRemoveAssignedTeacher(batch, teacher) {
    if (batch.isSubmitted) {
      console.warn('Cannot remove teachers from a submitted batch.');
      return;
    }
    if (!batch._id || !teacher._id) {
      console.error('Batch ID or Teacher ID is missing.');
      return;
    }
    if (confirm(`Are you sure you want to remove ${teacher.name} from ${batch.batchName}?`)) {
      this.batchService.removeTeacherFromBatch(batch._id, teacher._id).subscribe({
        next: updatedBatch => {
          // Update the specific batch in the local array
          const index = this.batches.findIndex(b => b._id === updatedBatch._id);
          if (index !== -1) {
            this.batches[index] = updatedBatch;
            this.selectedBatch = updatedBatch; // Update selected batch if it's the one being viewed
          }
          // Re-filter teachers for the 'Add Participants' sidebar to show the removed teacher
          if (this.showTeachersPanel) {
            this.filterTeachersForSidebar();
          }
        },
        error: error => {
          console.error('Error removing teacher from batch:', error);
          if (error.status === 403) {
            alert('Access denied. You can only remove teachers from batches you created.');
          } else if (error.status === 404) {
            alert('Batch or teacher not found.');
          } else {
            alert('Error removing teacher from batch. Please try again.');
          }
        }
      });
    }
  }
  getTeacherAttendanceStatus(teacherId) {
    return this.selectedBatch?.attendance?.includes(teacherId) || false;
  }
  onAttendanceChange(teacherId, isPresent) {
    if (!this.selectedBatch) {
      console.error('No batch selected for attendance update.');
      return;
    }
    if (this.selectedBatch.isSubmitted) {
      console.warn('Cannot change attendance for a submitted batch.');
      return;
    }
    const batchId = this.selectedBatch._id;
    let updatedAttendance = [...(this.selectedBatch.attendance || [])];
    if (isPresent) {
      if (!updatedAttendance.includes(teacherId)) {
        updatedAttendance.push(teacherId);
      }
    } else {
      updatedAttendance = updatedAttendance.filter(id => id !== teacherId);
    }
    // Optimistically update the UI
    this.selectedBatch.attendance = updatedAttendance;
    // Call backend service to update attendance for this batch
    this.batchService.updateAttendance(batchId, updatedAttendance).subscribe({
      next: updatedBatch => {
        // Optionally, update the main batches list if attendance changes affect other views
        const index = this.batches.findIndex(b => b._id === updatedBatch._id);
        if (index !== -1) {
          this.batches[index] = updatedBatch;
        }
      },
      error: error => {
        console.error('Error updating attendance:', error);
        // Revert UI if backend update fails, or show an error message
        // You might want to reload batches or specifically revert the checkbox state
      }
    });
  }

  isTeacherAssigned(batch, teacher) {
    return batch.assignedTeachers?.some(t => t._id === teacher._id) || false;
  }
  isTeacherAbsent(batch, teacher) {
    return (batch.assignedTeachers?.some(t => t._id === teacher._id) || false) && !(batch.attendance?.includes(teacher._id) || false);
  }
  assignSelectedTeachersToBatch() {
    if (!this.selectedBatch || this.selectedTeachersForAssignment.length === 0) {
      return;
    }
    if (this.selectedBatch.isSubmitted) {
      console.warn('Cannot assign teachers to a submitted batch.');
      return;
    }
    const batchId = this.selectedBatch._id;
    const selectedTeacherIds = [...this.selectedTeachersForAssignment];
    this.isAssigningTeachers = true;
    (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.from)(selectedTeacherIds).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_7__.concatMap)(teacherId => this.batchService.assignTeacherToBatch(batchId, teacherId)), (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.toArray)(), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.finalize)(() => {
      this.isAssigningTeachers = false;
    })).subscribe({
      next: updatedBatches => {
        const latestUpdatedBatch = updatedBatches[updatedBatches.length - 1];
        if (latestUpdatedBatch) {
          const index = this.batches.findIndex(b => b._id === latestUpdatedBatch._id);
          if (index !== -1) {
            this.batches[index] = latestUpdatedBatch;
          }
          this.selectedBatch = latestUpdatedBatch;
          this.batchService.setBatches([...this.batches]);
          this.selectedTeachersForAssignment = [];
          this.filterTeachersForSidebar();
        }
      },
      error: error => {
        console.error('Error assigning teachers to batch:', error);
        if (error.status === 403) {
          alert('Access denied. You can only assign teachers to batches you created.');
        } else if (error.status === 404) {
          alert('Batch or teacher not found.');
        } else {
          alert('Error assigning teachers to batch. Please try again.');
        }
      }
    });
  }
  onSaveAndSubmit(batchId) {
    if (!batchId) {
      console.error('Batch ID is missing.');
      return;
    }
    if (confirm('Are you sure you want to save and submit this batch? Once submitted, it cannot be modified.')) {
      this.batchService.submitBatch(batchId).subscribe({
        next: updatedBatch => {
          // Update the local batches list and selectedBatch to reflect the submitted status
          const index = this.batches.findIndex(b => b._id === updatedBatch._id);
          if (index !== -1) {
            this.batches[index] = updatedBatch;
            this.selectedBatch = updatedBatch; // Update selected batch if it's the one being viewed
          }

          this.batchService.setBatches(this.batches); // Notify other components of the change
          // Re-filter teachers to allow absent teachers from submitted batch to re-appear
          if (this.showTeachersPanel) {
            this.filterTeachersForSidebar();
          }
        },
        error: error => {
          console.error('Error submitting batch:', error);
          if (error.status === 403) {
            alert('Access denied. You can only submit batches you created.');
          } else if (error.status === 404) {
            alert('Batch not found.');
          } else {
            alert('Error submitting batch. Please try again.');
          }
        }
      });
    }
  }
  ngOnDestroy() {
    if (this.batchesSubscription) {
      this.batchesSubscription.unsubscribe();
    }
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }
  loadBatchDetails() {
    // Implementation of loadBatchDetails method
  }
  // Handle pagination for teachers
  onTeachersPageChange(page) {
    this.teachersCurrentPage = page;
    this.loadTeachersAndFilter();
  }
  // Load more teachers (for infinite scroll or load more button)
  loadMoreTeachers() {
    if (this.allTeachers.length < this.teachersTotalItems && !this.isLoadingTeachers) {
      this.teachersCurrentPage++;
      this.loadTeachersAndFilter();
    }
  }
  isTeacherSelectedForAssignment(teacher) {
    return !!teacher._id && this.selectedTeachersForAssignment.includes(teacher._id);
  }
  onSearchKeyPress(event) {
    if (event.key === 'Enter') {
      if (this.searchTimeout) {
        clearTimeout(this.searchTimeout);
      }
      this.teachersCurrentPage = 1; // Reset to first page when searching
      this.loadTeachersAndFilter();
    }
  }
  static {
    this.ɵfac = function ViewBatchComponent_Factory(t) {
      return new (t || ViewBatchComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
      type: ViewBatchComponent,
      selectors: [["app-view-batch"]],
      decls: 20,
      vars: 5,
      consts: [[1, "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "text-2xl", "md:text-[30px]", "font-bold", "text-content", "md:leading-[48px]"], [1, "border", "rounded", "bg-white", "mt-6", "px-4", "py-6", "md:px-6", "md:py-8"], [1, "flex", "flex-col", "gap-4", "sm:flex-row", "sm:items-start", "sm:justify-between"], [1, "min-w-0"], [1, "text-content", "text-2xl", "md:text-[30px]", "font-bold", "md:leading-[48px]"], [1, "mt-1", "text-sm", "text-content-60"], ["routerLink", "/teacher-training/create-batch", 1, "btn-primary", "h-9", "w-full", "sm:w-auto"], [1, "flex", "items-center", "justify-center", "gap-2"], ["src", "assets/icons/add.svg", "alt", ""], [1, "text-nowrap"], ["class", "grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6", 4, "ngIf"], ["class", "space-y-4 md:hidden mt-6", 4, "ngIf"], ["class", "hidden md:block w-full overflow-x-auto mt-6", 4, "ngIf"], ["class", "hidden md:block text-center text-content-60 py-4 border rounded-xl mt-6", 4, "ngIf"], ["class", "participants-overlay", 4, "ngIf"], [1, "grid", "grid-cols-1", "sm:grid-cols-3", "gap-3", "mt-6"], [1, "metric-card"], [1, "metric-label"], [1, "metric-value"], [1, "metric-value", "text-green"], [1, "metric-value", "text-orange"], [1, "space-y-4", "md:hidden", "mt-6"], ["class", "rounded-xl border p-4 bg-white shadow-sm", 4, "ngFor", "ngForOf"], ["class", "text-center text-content-60 py-4 border rounded-xl", 4, "ngIf"], [1, "rounded-xl", "border", "p-4", "bg-white", "shadow-sm"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "font-semibold", "break-words"], [1, "text-sm", "text-content-60", "mt-1"], [1, "inline-flex", "px-3", "py-0.5", "sm:py-1", "rounded-full", "text-sm", "shrink-0", 3, "ngClass"], [1, "mt-4", "grid", "grid-cols-2", "gap-3", "text-sm"], [1, "text-xs", "text-content-60"], [1, "break-words"], [4, "ngIf"], [1, "mt-4", "flex", "flex-col", "gap-2"], [1, "btn-primary", "h-9", "w-full", 3, "click"], ["type", "button", 1, "btn-primary", "h-9", "w-full", 3, "disabled", "click"], ["type", "button", 1, "btn-outline-primary", "h-9", "w-full", 3, "disabled", "click"], [1, "text-center", "text-content-60", "py-4", "border", "rounded-xl"], [1, "hidden", "md:block", "w-full", "overflow-x-auto", "mt-6"], [1, "table-auto", "min-w-[980px]", "w-full", "border", "rounded-lg", "text-content"], [1, "bg-primary-60", "rounded-lg", "border-b"], [1, "text-left", "p-4", "rounded", "border-r", "text-sm", "text-content"], [1, "text-left", "p-4", "border-r", "text-sm", "text-content"], ["class", "text-left p-4 border-r text-sm text-content", 4, "ngIf"], [1, "text-left", "p-4", "text-sm", "text-content"], [1, "bg-white"], ["class", "border-b", 3, "ngClass", 4, "ngFor", "ngForOf"], [1, "border-b", 3, "ngClass"], [1, "text-sm", "p-4", "border-r", "break-words"], [1, "text-sm", "p-4", "border-r", "whitespace-nowrap"], ["class", "text-sm p-4 border-r break-words", 4, "ngIf"], [1, "text-sm", "p-4", "border-r"], [1, "btn-primary", "h-9", 3, "click"], [1, "inline-flex", "px-3", "py-0.5", "sm:py-1", "rounded-full", "text-sm", 3, "ngClass"], [1, "text-sm", "p-4"], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "btn-primary", "h-9", 3, "disabled", "click"], ["type", "button", 1, "btn-outline-primary", "h-9", 3, "disabled", "click"], [1, "hidden", "md:block", "text-center", "text-content-60", "py-4", "border", "rounded-xl", "mt-6"], [1, "participants-overlay"], ["type", "button", "aria-label", "Close participants panel", 1, "participants-backdrop", 3, "click"], ["aria-label", "Add participants to batch", 1, "participants-panel"], [1, "participants-panel-header"], ["type", "button", 1, "participants-close-btn", 3, "click"], [1, "participants-toolbar"], [1, "search-container"], [1, "search-input-wrapper"], ["type", "text", "placeholder", "Search teachers by name, phone, zone, or district...", 1, "search-input", 3, "ngModel", "disabled", "ngModelChange", "input", "keypress"], [1, "search-icon"], ["xmlns", "http://www.w3.org/2000/svg", "width", "16", "height", "16", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["cx", "11", "cy", "11", "r", "8"], ["d", "m21 21-4.35-4.35"], ["class", "clear-search-btn", "type", "button", "title", "Clear search", 3, "click", 4, "ngIf"], ["type", "button", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "disabled", "click"], ["class", "px-5 pt-3 text-xs text-content-60", 4, "ngIf"], [1, "participants-panel-body"], ["class", "loading-indicator", 4, "ngIf"], ["class", "participants-table-wrapper", 4, "ngIf"], ["class", "text-content-60 italic px-5 py-4", 4, "ngIf"], ["class", "teachers-pagination", 4, "ngIf"], ["class", "load-more-container", 4, "ngIf"], ["type", "button", "title", "Clear search", 1, "clear-search-btn", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "width", "14", "height", "14", "viewBox", "0 0 24 24", "fill", "none", "stroke", "currentColor", "stroke-width", "2", "stroke-linecap", "round", "stroke-linejoin", "round"], ["x1", "18", "y1", "6", "x2", "6", "y2", "18"], ["x1", "6", "y1", "6", "x2", "18", "y2", "18"], [1, "px-5", "pt-3", "text-xs", "text-content-60"], [1, "loading-indicator"], [1, "participants-table-wrapper"], [1, "table-auto", "min-w-[680px]", "w-full", "border", "rounded-lg", "text-content"], ["class", "border-b", 4, "ngFor", "ngForOf"], [1, "border-b"], ["type", "checkbox", 3, "checked", "change"], [1, "text-sm", "p-4", "break-words"], [1, "text-content-60", "italic", "px-5", "py-4"], [1, "teachers-pagination"], [3, "totalItems", "pageSize", "currentPage", "pageChange"], [1, "load-more-container"]],
      template: function ViewBatchComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "h1", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2, " Teacher Training ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "div", 2)(4, "div", 3)(5, "div", 4)(6, "p", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, "Batch List");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "p", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, "Manage training batches and assign participants.");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "button", 7)(11, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](12, "img", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](13, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](14, "Create Batch");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](15, ViewBatchComponent_div_15_Template, 16, 3, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](16, ViewBatchComponent_div_16_Template, 3, 2, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](17, ViewBatchComponent_div_17_Template, 19, 2, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](18, ViewBatchComponent_div_18_Template, 2, 0, "div", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](19, ViewBatchComponent_div_19_Template, 32, 13, "div", 15);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.teacherStats);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.batches && ctx.batches.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.batches && ctx.batches.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx.batches || !ctx.batches.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.showTeachersPanel && ctx.selectedBatch);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_5__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgModel, _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_3__.PaginationComponent, _angular_common__WEBPACK_IMPORTED_MODULE_10__.TitleCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_10__.DatePipe],
      styles: [".participants-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  inset: 0;\n  z-index: 1200;\n}\n\n.participants-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  border: none;\n  background: rgba(75, 75, 75, 0.45);\n  background: color-mix(in srgb, var(--content-DEFAULT) 45%, transparent);\n  cursor: pointer;\n}\n\n.participants-panel[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  z-index: 1201;\n  width: min(100vw, 560px);\n  max-width: 560px;\n  background: var(--surface-DEFAULT);\n  display: flex;\n  flex-direction: column;\n  overflow: hidden;\n  margin: 0;\n  padding: 0;\n  border-radius: 0;\n  box-shadow: -16px 0 40px rgba(75, 75, 75, 0.16);\n  box-shadow: -16px 0 40px color-mix(in srgb, var(--content-DEFAULT) 16%, transparent);\n}\n\n.participants-panel-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 12px;\n  padding: 20px;\n  border-bottom: 1px solid var(--content-30);\n}\n.participants-panel-header[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1.1rem;\n  font-weight: 700;\n  color: var(--content-DEFAULT);\n}\n.participants-panel-header[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 6px 0 0;\n  color: var(--content-60);\n  font-size: 0.92rem;\n}\n\n.participants-close-btn[_ngcontent-%COMP%] {\n  border: none;\n  background: transparent;\n  color: var(--content-60);\n  font-weight: 600;\n  cursor: pointer;\n}\n\n.participants-toolbar[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 16px 20px;\n  border-bottom: 1px solid var(--content-30);\n}\n\n.search-container[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n\n.search-input-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n}\n\n.search-input[_ngcontent-%COMP%] {\n  width: 100%;\n  min-width: 0;\n  padding: 10px 38px;\n  border: 1px solid var(--content-30);\n  border-radius: 12px;\n  font-size: 0.95rem;\n  background: var(--shade-50);\n  transition: border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--primary-DEFAULT);\n  background: var(--surface-DEFAULT);\n  box-shadow: 0 0 0 3px rgba(70, 160, 241, 0.12);\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-DEFAULT) 12%, transparent);\n}\n.search-input[_ngcontent-%COMP%]:disabled {\n  background: var(--shade-80);\n  color: var(--content-50);\n  cursor: not-allowed;\n}\n.search-input[_ngcontent-%COMP%]::placeholder {\n  color: var(--content-50);\n}\n\n.search-icon[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 12px;\n  display: flex;\n  align-items: center;\n  color: var(--content-50);\n  pointer-events: none;\n}\n\n.clear-search-btn[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 10px;\n  top: 50%;\n  transform: translateY(-50%);\n  border: none;\n  background: transparent;\n  color: var(--content-50);\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n\n.participants-panel-body[_ngcontent-%COMP%] {\n  flex: 1;\n  overflow-y: auto;\n  padding-bottom: 20px;\n}\n\n.loading-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  padding: 32px 20px;\n  color: var(--content-60);\n  font-style: italic;\n}\n\n.participants-table-wrapper[_ngcontent-%COMP%] {\n  overflow-x: auto;\n  padding: 12px 20px 0;\n}\n\n.teachers-pagination[_ngcontent-%COMP%] {\n  margin-top: 16px;\n  padding: 16px 20px 0;\n  border-top: 1px solid var(--content-30);\n}\n\n.load-more-container[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  padding: 16px 20px 0;\n}\n\ninput[type=checkbox][_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  accent-color: var(--success-DEFAULT);\n  cursor: pointer;\n}\n\ninput[type=checkbox][_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n\n@media (max-width: 767px) {\n  .participants-panel[_ngcontent-%COMP%] {\n    width: 100vw;\n    max-width: 100vw;\n  }\n  .participants-toolbar[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: stretch;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXctYmF0Y2guY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxlQUFBO0VBQ0EsUUFBQTtFQUNBLGFBQUE7QUFDRjs7QUFFQTtFQUNFLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFlBQUE7RUFDQSxrQ0FBQTtFQUNBLHVFQUFBO0VBQ0EsZUFBQTtBQUNGOztBQUVBO0VBQ0UsZUFBQTtFQUNBLE1BQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLGFBQUE7RUFDQSx3QkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0NBQUE7RUFDQSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxnQkFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EsZ0JBQUE7RUFDQSwrQ0FBQTtFQUNBLG9GQUFBO0FBQ0Y7O0FBRUE7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSx1QkFBQTtFQUNBLFNBQUE7RUFDQSxhQUFBO0VBQ0EsMENBQUE7QUFDRjtBQUNFO0VBQ0UsU0FBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSw2QkFBQTtBQUNKO0FBRUU7RUFDRSxlQUFBO0VBQ0Esd0JBQUE7RUFDQSxrQkFBQTtBQUFKOztBQUlBO0VBQ0UsWUFBQTtFQUNBLHVCQUFBO0VBQ0Esd0JBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7QUFERjs7QUFJQTtFQUNFLGFBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSxrQkFBQTtFQUNBLDBDQUFBO0FBREY7O0FBSUE7RUFDRSxPQUFBO0VBQ0EsWUFBQTtBQURGOztBQUlBO0VBQ0Usa0JBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7QUFERjs7QUFJQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQ0FBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSwyQkFBQTtFQUNBLG9GQUFBO0FBREY7QUFHRTtFQUNFLGFBQUE7RUFDQSxvQ0FBQTtFQUNBLGtDQUFBO0VBQ0EsOENBQUE7RUFDQSxpRkFBQTtBQURKO0FBSUU7RUFDRSwyQkFBQTtFQUNBLHdCQUFBO0VBQ0EsbUJBQUE7QUFGSjtBQUtFO0VBQ0Usd0JBQUE7QUFISjs7QUFPQTtFQUNFLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHdCQUFBO0VBQ0Esb0JBQUE7QUFKRjs7QUFPQTtFQUNFLGtCQUFBO0VBQ0EsV0FBQTtFQUNBLFFBQUE7RUFDQSwyQkFBQTtFQUNBLFlBQUE7RUFDQSx1QkFBQTtFQUNBLHdCQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FBSkY7O0FBT0E7RUFDRSxPQUFBO0VBQ0EsZ0JBQUE7RUFDQSxvQkFBQTtBQUpGOztBQU9BO0VBQ0UsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLHdCQUFBO0VBQ0Esa0JBQUE7QUFKRjs7QUFPQTtFQUNFLGdCQUFBO0VBQ0Esb0JBQUE7QUFKRjs7QUFPQTtFQUNFLGdCQUFBO0VBQ0Esb0JBQUE7RUFDQSx1Q0FBQTtBQUpGOztBQU9BO0VBQ0UsYUFBQTtFQUNBLHVCQUFBO0VBQ0Esb0JBQUE7QUFKRjs7QUFPQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0Esb0NBQUE7RUFDQSxlQUFBO0FBSkY7O0FBT0E7RUFDRSxZQUFBO0VBQ0EsbUJBQUE7QUFKRjs7QUFPQTtFQUNFO0lBQ0UsWUFBQTtJQUNBLGdCQUFBO0VBSkY7RUFPQTtJQUNFLHNCQUFBO0lBQ0Esb0JBQUE7RUFMRjtBQUNGIiwiZmlsZSI6InZpZXctYmF0Y2guY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIucGFydGljaXBhbnRzLW92ZXJsYXkge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIGluc2V0OiAwO1xuICB6LWluZGV4OiAxMjAwO1xufVxuXG4ucGFydGljaXBhbnRzLWJhY2tkcm9wIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBpbnNldDogMDtcbiAgYm9yZGVyOiBub25lO1xuICBiYWNrZ3JvdW5kOiByZ2JhKDc1LCA3NSwgNzUsIDAuNDUpO1xuICBiYWNrZ3JvdW5kOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSA0NSUsIHRyYW5zcGFyZW50KTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG4ucGFydGljaXBhbnRzLXBhbmVsIHtcbiAgcG9zaXRpb246IGZpeGVkO1xuICB0b3A6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIHotaW5kZXg6IDEyMDE7XG4gIHdpZHRoOiBtaW4oMTAwdncsIDU2MHB4KTtcbiAgbWF4LXdpZHRoOiA1NjBweDtcbiAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbiAgbWFyZ2luOiAwO1xuICBwYWRkaW5nOiAwO1xuICBib3JkZXItcmFkaXVzOiAwO1xuICBib3gtc2hhZG93OiAtMTZweCAwIDQwcHggcmdiYSg3NSwgNzUsIDc1LCAwLjE2KTtcbiAgYm94LXNoYWRvdzogLTE2cHggMCA0MHB4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1jb250ZW50LURFRkFVTFQpIDE2JSwgdHJhbnNwYXJlbnQpO1xufVxuXG4ucGFydGljaXBhbnRzLXBhbmVsLWhlYWRlciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogc3BhY2UtYmV0d2VlbjtcbiAgYWxpZ24taXRlbXM6IGZsZXgtc3RhcnQ7XG4gIGdhcDogMTJweDtcbiAgcGFkZGluZzogMjBweDtcbiAgYm9yZGVyLWJvdHRvbTogMXB4IHNvbGlkIHZhcigtLWNvbnRlbnQtMzApO1xuXG4gIGgzIHtcbiAgICBtYXJnaW46IDA7XG4gICAgZm9udC1zaXplOiAxLjFyZW07XG4gICAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgICBjb2xvcjogdmFyKC0tY29udGVudC1ERUZBVUxUKTtcbiAgfVxuXG4gIHAge1xuICAgIG1hcmdpbjogNnB4IDAgMDtcbiAgICBjb2xvcjogdmFyKC0tY29udGVudC02MCk7XG4gICAgZm9udC1zaXplOiAwLjkycmVtO1xuICB9XG59XG5cbi5wYXJ0aWNpcGFudHMtY2xvc2UtYnRuIHtcbiAgYm9yZGVyOiBub25lO1xuICBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDtcbiAgY29sb3I6IHZhcigtLWNvbnRlbnQtNjApO1xuICBmb250LXdlaWdodDogNjAwO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5wYXJ0aWNpcGFudHMtdG9vbGJhciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMTJweDtcbiAgcGFkZGluZzogMTZweCAyMHB4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tY29udGVudC0zMCk7XG59XG5cbi5zZWFyY2gtY29udGFpbmVyIHtcbiAgZmxleDogMTtcbiAgbWluLXdpZHRoOiAwO1xufVxuXG4uc2VhcmNoLWlucHV0LXdyYXBwZXIge1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG59XG5cbi5zZWFyY2gtaW5wdXQge1xuICB3aWR0aDogMTAwJTtcbiAgbWluLXdpZHRoOiAwO1xuICBwYWRkaW5nOiAxMHB4IDM4cHg7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNvbnRlbnQtMzApO1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICBmb250LXNpemU6IDAuOTVyZW07XG4gIGJhY2tncm91bmQ6IHZhcigtLXNoYWRlLTUwKTtcbiAgdHJhbnNpdGlvbjogYm9yZGVyLWNvbG9yIDAuMnMgZWFzZSwgYm94LXNoYWRvdyAwLjJzIGVhc2UsIGJhY2tncm91bmQtY29sb3IgMC4ycyBlYXNlO1xuXG4gICY6Zm9jdXMge1xuICAgIG91dGxpbmU6IG5vbmU7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtREVGQVVMVCk7XG4gICAgYm94LXNoYWRvdzogMCAwIDAgM3B4IHJnYmEoNzAsIDE2MCwgMjQxLCAwLjEyKTtcbiAgICBib3gtc2hhZG93OiAwIDAgMCAzcHggY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXByaW1hcnktREVGQVVMVCkgMTIlLCB0cmFuc3BhcmVudCk7XG4gIH1cblxuICAmOmRpc2FibGVkIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zaGFkZS04MCk7XG4gICAgY29sb3I6IHZhcigtLWNvbnRlbnQtNTApO1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIH1cblxuICAmOjpwbGFjZWhvbGRlciB7XG4gICAgY29sb3I6IHZhcigtLWNvbnRlbnQtNTApO1xuICB9XG59XG5cbi5zZWFyY2gtaWNvbiB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgbGVmdDogMTJweDtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgY29sb3I6IHZhcigtLWNvbnRlbnQtNTApO1xuICBwb2ludGVyLWV2ZW50czogbm9uZTtcbn1cblxuLmNsZWFyLXNlYXJjaC1idG4ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIHJpZ2h0OiAxMHB4O1xuICB0b3A6IDUwJTtcbiAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC01MCUpO1xuICBib3JkZXI6IG5vbmU7XG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICBjb2xvcjogdmFyKC0tY29udGVudC01MCk7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG59XG5cbi5wYXJ0aWNpcGFudHMtcGFuZWwtYm9keSB7XG4gIGZsZXg6IDE7XG4gIG92ZXJmbG93LXk6IGF1dG87XG4gIHBhZGRpbmctYm90dG9tOiAyMHB4O1xufVxuXG4ubG9hZGluZy1pbmRpY2F0b3Ige1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgcGFkZGluZzogMzJweCAyMHB4O1xuICBjb2xvcjogdmFyKC0tY29udGVudC02MCk7XG4gIGZvbnQtc3R5bGU6IGl0YWxpYztcbn1cblxuLnBhcnRpY2lwYW50cy10YWJsZS13cmFwcGVyIHtcbiAgb3ZlcmZsb3cteDogYXV0bztcbiAgcGFkZGluZzogMTJweCAyMHB4IDA7XG59XG5cbi50ZWFjaGVycy1wYWdpbmF0aW9uIHtcbiAgbWFyZ2luLXRvcDogMTZweDtcbiAgcGFkZGluZzogMTZweCAyMHB4IDA7XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1jb250ZW50LTMwKTtcbn1cblxuLmxvYWQtbW9yZS1jb250YWluZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgcGFkZGluZzogMTZweCAyMHB4IDA7XG59XG5cbmlucHV0W3R5cGU9J2NoZWNrYm94J10ge1xuICB3aWR0aDogMThweDtcbiAgaGVpZ2h0OiAxOHB4O1xuICBhY2NlbnQtY29sb3I6IHZhcigtLXN1Y2Nlc3MtREVGQVVMVCk7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuaW5wdXRbdHlwZT0nY2hlY2tib3gnXTpkaXNhYmxlZCB7XG4gIG9wYWNpdHk6IDAuNjtcbiAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbn1cblxuQG1lZGlhIChtYXgtd2lkdGg6IDc2N3B4KSB7XG4gIC5wYXJ0aWNpcGFudHMtcGFuZWwge1xuICAgIHdpZHRoOiAxMDB2dztcbiAgICBtYXgtd2lkdGg6IDEwMHZ3O1xuICB9XG5cbiAgLnBhcnRpY2lwYW50cy10b29sYmFyIHtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICAgIGFsaWduLWl0ZW1zOiBzdHJldGNoO1xuICB9XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi90ZWFjaGVyLXRyYWluaW5nL3ZpZXctYmF0Y2gvdmlldy1iYXRjaC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGVBQUE7RUFDQSxRQUFBO0VBQ0EsYUFBQTtBQUNGOztBQUVBO0VBQ0Usa0JBQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtFQUNBLGtDQUFBO0VBQ0EsdUVBQUE7RUFDQSxlQUFBO0FBQ0Y7O0FBRUE7RUFDRSxlQUFBO0VBQ0EsTUFBQTtFQUNBLFFBQUE7RUFDQSxTQUFBO0VBQ0EsYUFBQTtFQUNBLHdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxrQ0FBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0VBQ0EsU0FBQTtFQUNBLFVBQUE7RUFDQSxnQkFBQTtFQUNBLCtDQUFBO0VBQ0Esb0ZBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLHVCQUFBO0VBQ0EsU0FBQTtFQUNBLGFBQUE7RUFDQSwwQ0FBQTtBQUNGO0FBQ0U7RUFDRSxTQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLDZCQUFBO0FBQ0o7QUFFRTtFQUNFLGVBQUE7RUFDQSx3QkFBQTtFQUNBLGtCQUFBO0FBQUo7O0FBSUE7RUFDRSxZQUFBO0VBQ0EsdUJBQUE7RUFDQSx3QkFBQTtFQUNBLGdCQUFBO0VBQ0EsZUFBQTtBQURGOztBQUlBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLGtCQUFBO0VBQ0EsMENBQUE7QUFERjs7QUFJQTtFQUNFLE9BQUE7RUFDQSxZQUFBO0FBREY7O0FBSUE7RUFDRSxrQkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtBQURGOztBQUlBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtFQUNBLG1DQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLDJCQUFBO0VBQ0Esb0ZBQUE7QUFERjtBQUdFO0VBQ0UsYUFBQTtFQUNBLG9DQUFBO0VBQ0Esa0NBQUE7RUFDQSw4Q0FBQTtFQUNBLGlGQUFBO0FBREo7QUFJRTtFQUNFLDJCQUFBO0VBQ0Esd0JBQUE7RUFDQSxtQkFBQTtBQUZKO0FBS0U7RUFDRSx3QkFBQTtBQUhKOztBQU9BO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0Esd0JBQUE7RUFDQSxvQkFBQTtBQUpGOztBQU9BO0VBQ0Usa0JBQUE7RUFDQSxXQUFBO0VBQ0EsUUFBQTtFQUNBLDJCQUFBO0VBQ0EsWUFBQTtFQUNBLHVCQUFBO0VBQ0Esd0JBQUE7RUFDQSxlQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7QUFKRjs7QUFPQTtFQUNFLE9BQUE7RUFDQSxnQkFBQTtFQUNBLG9CQUFBO0FBSkY7O0FBT0E7RUFDRSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQkFBQTtFQUNBLGtCQUFBO0VBQ0Esd0JBQUE7RUFDQSxrQkFBQTtBQUpGOztBQU9BO0VBQ0UsZ0JBQUE7RUFDQSxvQkFBQTtBQUpGOztBQU9BO0VBQ0UsZ0JBQUE7RUFDQSxvQkFBQTtFQUNBLHVDQUFBO0FBSkY7O0FBT0E7RUFDRSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxvQkFBQTtBQUpGOztBQU9BO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxvQ0FBQTtFQUNBLGVBQUE7QUFKRjs7QUFPQTtFQUNFLFlBQUE7RUFDQSxtQkFBQTtBQUpGOztBQU9BO0VBQ0U7SUFDRSxZQUFBO0lBQ0EsZ0JBQUE7RUFKRjtFQU9BO0lBQ0Usc0JBQUE7SUFDQSxvQkFBQTtFQUxGO0FBQ0Y7QUFDQSx3Z09BQXdnTyIsInNvdXJjZXNDb250ZW50IjpbIi5wYXJ0aWNpcGFudHMtb3ZlcmxheSB7XG4gIHBvc2l0aW9uOiBmaXhlZDtcbiAgaW5zZXQ6IDA7XG4gIHotaW5kZXg6IDEyMDA7XG59XG5cbi5wYXJ0aWNpcGFudHMtYmFja2Ryb3Age1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIGluc2V0OiAwO1xuICBib3JkZXI6IG5vbmU7XG4gIGJhY2tncm91bmQ6IHJnYmEoNzUsIDc1LCA3NSwgMC40NSk7XG4gIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1jb250ZW50LURFRkFVTFQpIDQ1JSwgdHJhbnNwYXJlbnQpO1xuICBjdXJzb3I6IHBvaW50ZXI7XG59XG5cbi5wYXJ0aWNpcGFudHMtcGFuZWwge1xuICBwb3NpdGlvbjogZml4ZWQ7XG4gIHRvcDogMDtcbiAgcmlnaHQ6IDA7XG4gIGJvdHRvbTogMDtcbiAgei1pbmRleDogMTIwMTtcbiAgd2lkdGg6IG1pbigxMDB2dywgNTYwcHgpO1xuICBtYXgtd2lkdGg6IDU2MHB4O1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBtYXJnaW46IDA7XG4gIHBhZGRpbmc6IDA7XG4gIGJvcmRlci1yYWRpdXM6IDA7XG4gIGJveC1zaGFkb3c6IC0xNnB4IDAgNDBweCByZ2JhKDc1LCA3NSwgNzUsIDAuMTYpO1xuICBib3gtc2hhZG93OiAtMTZweCAwIDQwcHggY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgMTYlLCB0cmFuc3BhcmVudCk7XG59XG5cbi5wYXJ0aWNpcGFudHMtcGFuZWwtaGVhZGVyIHtcbiAgZGlzcGxheTogZmxleDtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZ2FwOiAxMnB4O1xuICBwYWRkaW5nOiAyMHB4O1xuICBib3JkZXItYm90dG9tOiAxcHggc29saWQgdmFyKC0tY29udGVudC0zMCk7XG5cbiAgaDMge1xuICAgIG1hcmdpbjogMDtcbiAgICBmb250LXNpemU6IDEuMXJlbTtcbiAgICBmb250LXdlaWdodDogNzAwO1xuICAgIGNvbG9yOiB2YXIoLS1jb250ZW50LURFRkFVTFQpO1xuICB9XG5cbiAgcCB7XG4gICAgbWFyZ2luOiA2cHggMCAwO1xuICAgIGNvbG9yOiB2YXIoLS1jb250ZW50LTYwKTtcbiAgICBmb250LXNpemU6IDAuOTJyZW07XG4gIH1cbn1cblxuLnBhcnRpY2lwYW50cy1jbG9zZS1idG4ge1xuICBib3JkZXI6IG5vbmU7XG4gIGJhY2tncm91bmQ6IHRyYW5zcGFyZW50O1xuICBjb2xvcjogdmFyKC0tY29udGVudC02MCk7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbn1cblxuLnBhcnRpY2lwYW50cy10b29sYmFyIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgZ2FwOiAxMnB4O1xuICBwYWRkaW5nOiAxNnB4IDIwcHg7XG4gIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCB2YXIoLS1jb250ZW50LTMwKTtcbn1cblxuLnNlYXJjaC1jb250YWluZXIge1xuICBmbGV4OiAxO1xuICBtaW4td2lkdGg6IDA7XG59XG5cbi5zZWFyY2gtaW5wdXQtd3JhcHBlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbn1cblxuLnNlYXJjaC1pbnB1dCB7XG4gIHdpZHRoOiAxMDAlO1xuICBtaW4td2lkdGg6IDA7XG4gIHBhZGRpbmc6IDEwcHggMzhweDtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tY29udGVudC0zMCk7XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gIGZvbnQtc2l6ZTogMC45NXJlbTtcbiAgYmFja2dyb3VuZDogdmFyKC0tc2hhZGUtNTApO1xuICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4ycyBlYXNlLCBib3gtc2hhZG93IDAuMnMgZWFzZSwgYmFja2dyb3VuZC1jb2xvciAwLjJzIGVhc2U7XG5cbiAgJjpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLXByaW1hcnktREVGQVVMVCk7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgICBib3gtc2hhZG93OiAwIDAgMCAzcHggcmdiYSg3MCwgMTYwLCAyNDEsIDAuMTIpO1xuICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tcHJpbWFyeS1ERUZBVUxUKSAxMiUsIHRyYW5zcGFyZW50KTtcbiAgfVxuXG4gICY6ZGlzYWJsZWQge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXNoYWRlLTgwKTtcbiAgICBjb2xvcjogdmFyKC0tY29udGVudC01MCk7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgfVxuXG4gICY6OnBsYWNlaG9sZGVyIHtcbiAgICBjb2xvcjogdmFyKC0tY29udGVudC01MCk7XG4gIH1cbn1cblxuLnNlYXJjaC1pY29uIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBsZWZ0OiAxMnB4O1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBjb2xvcjogdmFyKC0tY29udGVudC01MCk7XG4gIHBvaW50ZXItZXZlbnRzOiBub25lO1xufVxuXG4uY2xlYXItc2VhcmNoLWJ0biB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgcmlnaHQ6IDEwcHg7XG4gIHRvcDogNTAlO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTUwJSk7XG4gIGJvcmRlcjogbm9uZTtcbiAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gIGNvbG9yOiB2YXIoLS1jb250ZW50LTUwKTtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbn1cblxuLnBhcnRpY2lwYW50cy1wYW5lbC1ib2R5IHtcbiAgZmxleDogMTtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgcGFkZGluZy1ib3R0b206IDIwcHg7XG59XG5cbi5sb2FkaW5nLWluZGljYXRvciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBwYWRkaW5nOiAzMnB4IDIwcHg7XG4gIGNvbG9yOiB2YXIoLS1jb250ZW50LTYwKTtcbiAgZm9udC1zdHlsZTogaXRhbGljO1xufVxuXG4ucGFydGljaXBhbnRzLXRhYmxlLXdyYXBwZXIge1xuICBvdmVyZmxvdy14OiBhdXRvO1xuICBwYWRkaW5nOiAxMnB4IDIwcHggMDtcbn1cblxuLnRlYWNoZXJzLXBhZ2luYXRpb24ge1xuICBtYXJnaW4tdG9wOiAxNnB4O1xuICBwYWRkaW5nOiAxNnB4IDIwcHggMDtcbiAgYm9yZGVyLXRvcDogMXB4IHNvbGlkIHZhcigtLWNvbnRlbnQtMzApO1xufVxuXG4ubG9hZC1tb3JlLWNvbnRhaW5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICBwYWRkaW5nOiAxNnB4IDIwcHggMDtcbn1cblxuaW5wdXRbdHlwZT0nY2hlY2tib3gnXSB7XG4gIHdpZHRoOiAxOHB4O1xuICBoZWlnaHQ6IDE4cHg7XG4gIGFjY2VudC1jb2xvcjogdmFyKC0tc3VjY2Vzcy1ERUZBVUxUKTtcbiAgY3Vyc29yOiBwb2ludGVyO1xufVxuXG5pbnB1dFt0eXBlPSdjaGVja2JveCddOmRpc2FibGVkIHtcbiAgb3BhY2l0eTogMC42O1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNzY3cHgpIHtcbiAgLnBhcnRpY2lwYW50cy1wYW5lbCB7XG4gICAgd2lkdGg6IDEwMHZ3O1xuICAgIG1heC13aWR0aDogMTAwdnc7XG4gIH1cblxuICAucGFydGljaXBhbnRzLXRvb2xiYXIge1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgYWxpZ24taXRlbXM6IHN0cmV0Y2g7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 11691:
/*!***************************************************************!*\
  !*** ./node_modules/canvas-confetti/dist/confetti.module.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: () => (/* binding */ create),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
// canvas-confetti v1.9.4 built on 2025-10-25T05:14:56.640Z
var module = {};

// source content
/* globals Map */

(function main(global, module, isWorker, workerSize) {
  var canUseWorker = !!(global.Worker && global.Blob && global.Promise && global.OffscreenCanvas && global.OffscreenCanvasRenderingContext2D && global.HTMLCanvasElement && global.HTMLCanvasElement.prototype.transferControlToOffscreen && global.URL && global.URL.createObjectURL);
  var canUsePaths = typeof Path2D === 'function' && typeof DOMMatrix === 'function';
  var canDrawBitmap = function () {
    // this mostly supports ssr
    if (!global.OffscreenCanvas) {
      return false;
    }
    try {
      var canvas = new OffscreenCanvas(1, 1);
      var ctx = canvas.getContext('2d');
      ctx.fillRect(0, 0, 1, 1);
      var bitmap = canvas.transferToImageBitmap();
      ctx.createPattern(bitmap, 'no-repeat');
    } catch (e) {
      return false;
    }
    return true;
  }();
  function noop() {}

  // create a promise if it exists, otherwise, just
  // call the function directly
  function promise(func) {
    var ModulePromise = module.exports.Promise;
    var Prom = ModulePromise !== void 0 ? ModulePromise : global.Promise;
    if (typeof Prom === 'function') {
      return new Prom(func);
    }
    func(noop, noop);
    return null;
  }
  var bitmapMapper = function (skipTransform, map) {
    // see https://github.com/catdad/canvas-confetti/issues/209
    // creating canvases is actually pretty expensive, so we should create a
    // 1:1 map for bitmap:canvas, so that we can animate the confetti in
    // a performant manner, but also not store them forever so that we don't
    // have a memory leak
    return {
      transform: function (bitmap) {
        if (skipTransform) {
          return bitmap;
        }
        if (map.has(bitmap)) {
          return map.get(bitmap);
        }
        var canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
        var ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0);
        map.set(bitmap, canvas);
        return canvas;
      },
      clear: function () {
        map.clear();
      }
    };
  }(canDrawBitmap, new Map());
  var raf = function () {
    var TIME = Math.floor(1000 / 60);
    var frame, cancel;
    var frames = {};
    var lastFrameTime = 0;
    if (typeof requestAnimationFrame === 'function' && typeof cancelAnimationFrame === 'function') {
      frame = function (cb) {
        var id = Math.random();
        frames[id] = requestAnimationFrame(function onFrame(time) {
          if (lastFrameTime === time || lastFrameTime + TIME - 1 < time) {
            lastFrameTime = time;
            delete frames[id];
            cb();
          } else {
            frames[id] = requestAnimationFrame(onFrame);
          }
        });
        return id;
      };
      cancel = function (id) {
        if (frames[id]) {
          cancelAnimationFrame(frames[id]);
        }
      };
    } else {
      frame = function (cb) {
        return setTimeout(cb, TIME);
      };
      cancel = function (timer) {
        return clearTimeout(timer);
      };
    }
    return {
      frame: frame,
      cancel: cancel
    };
  }();
  var getWorker = function () {
    var worker;
    var prom;
    var resolves = {};
    function decorate(worker) {
      function execute(options, callback) {
        worker.postMessage({
          options: options || {},
          callback: callback
        });
      }
      worker.init = function initWorker(canvas) {
        var offscreen = canvas.transferControlToOffscreen();
        worker.postMessage({
          canvas: offscreen
        }, [offscreen]);
      };
      worker.fire = function fireWorker(options, size, done) {
        if (prom) {
          execute(options, null);
          return prom;
        }
        var id = Math.random().toString(36).slice(2);
        prom = promise(function (resolve) {
          function workerDone(msg) {
            if (msg.data.callback !== id) {
              return;
            }
            delete resolves[id];
            worker.removeEventListener('message', workerDone);
            prom = null;
            bitmapMapper.clear();
            done();
            resolve();
          }
          worker.addEventListener('message', workerDone);
          execute(options, id);
          resolves[id] = workerDone.bind(null, {
            data: {
              callback: id
            }
          });
        });
        return prom;
      };
      worker.reset = function resetWorker() {
        worker.postMessage({
          reset: true
        });
        for (var id in resolves) {
          resolves[id]();
          delete resolves[id];
        }
      };
    }
    return function () {
      if (worker) {
        return worker;
      }
      if (!isWorker && canUseWorker) {
        var code = ['var CONFETTI, SIZE = {}, module = {};', '(' + main.toString() + ')(this, module, true, SIZE);', 'onmessage = function(msg) {', '  if (msg.data.options) {', '    CONFETTI(msg.data.options).then(function () {', '      if (msg.data.callback) {', '        postMessage({ callback: msg.data.callback });', '      }', '    });', '  } else if (msg.data.reset) {', '    CONFETTI && CONFETTI.reset();', '  } else if (msg.data.resize) {', '    SIZE.width = msg.data.resize.width;', '    SIZE.height = msg.data.resize.height;', '  } else if (msg.data.canvas) {', '    SIZE.width = msg.data.canvas.width;', '    SIZE.height = msg.data.canvas.height;', '    CONFETTI = module.exports.create(msg.data.canvas);', '  }', '}'].join('\n');
        try {
          worker = new Worker(URL.createObjectURL(new Blob([code])));
        } catch (e) {
          // eslint-disable-next-line no-console
          typeof console !== 'undefined' && typeof console.warn === 'function' ? console.warn('🎊 Could not load worker', e) : null;
          return null;
        }
        decorate(worker);
      }
      return worker;
    };
  }();
  var defaults = {
    particleCount: 50,
    angle: 90,
    spread: 45,
    startVelocity: 45,
    decay: 0.9,
    gravity: 1,
    drift: 0,
    ticks: 200,
    x: 0.5,
    y: 0.5,
    shapes: ['square', 'circle'],
    zIndex: 100,
    colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff'],
    // probably should be true, but back-compat
    disableForReducedMotion: false,
    scalar: 1
  };
  function convert(val, transform) {
    return transform ? transform(val) : val;
  }
  function isOk(val) {
    return !(val === null || val === undefined);
  }
  function prop(options, name, transform) {
    return convert(options && isOk(options[name]) ? options[name] : defaults[name], transform);
  }
  function onlyPositiveInt(number) {
    return number < 0 ? 0 : Math.floor(number);
  }
  function randomInt(min, max) {
    // [min, max)
    return Math.floor(Math.random() * (max - min)) + min;
  }
  function toDecimal(str) {
    return parseInt(str, 16);
  }
  function colorsToRgb(colors) {
    return colors.map(hexToRgb);
  }
  function hexToRgb(str) {
    var val = String(str).replace(/[^0-9a-f]/gi, '');
    if (val.length < 6) {
      val = val[0] + val[0] + val[1] + val[1] + val[2] + val[2];
    }
    return {
      r: toDecimal(val.substring(0, 2)),
      g: toDecimal(val.substring(2, 4)),
      b: toDecimal(val.substring(4, 6))
    };
  }
  function getOrigin(options) {
    var origin = prop(options, 'origin', Object);
    origin.x = prop(origin, 'x', Number);
    origin.y = prop(origin, 'y', Number);
    return origin;
  }
  function setCanvasWindowSize(canvas) {
    canvas.width = document.documentElement.clientWidth;
    canvas.height = document.documentElement.clientHeight;
  }
  function setCanvasRectSize(canvas) {
    var rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  }
  function getCanvas(zIndex) {
    var canvas = document.createElement('canvas');
    canvas.style.position = 'fixed';
    canvas.style.top = '0px';
    canvas.style.left = '0px';
    canvas.style.pointerEvents = 'none';
    canvas.style.zIndex = zIndex;
    return canvas;
  }
  function ellipse(context, x, y, radiusX, radiusY, rotation, startAngle, endAngle, antiClockwise) {
    context.save();
    context.translate(x, y);
    context.rotate(rotation);
    context.scale(radiusX, radiusY);
    context.arc(0, 0, 1, startAngle, endAngle, antiClockwise);
    context.restore();
  }
  function randomPhysics(opts) {
    var radAngle = opts.angle * (Math.PI / 180);
    var radSpread = opts.spread * (Math.PI / 180);
    return {
      x: opts.x,
      y: opts.y,
      wobble: Math.random() * 10,
      wobbleSpeed: Math.min(0.11, Math.random() * 0.1 + 0.05),
      velocity: opts.startVelocity * 0.5 + Math.random() * opts.startVelocity,
      angle2D: -radAngle + (0.5 * radSpread - Math.random() * radSpread),
      tiltAngle: (Math.random() * (0.75 - 0.25) + 0.25) * Math.PI,
      color: opts.color,
      shape: opts.shape,
      tick: 0,
      totalTicks: opts.ticks,
      decay: opts.decay,
      drift: opts.drift,
      random: Math.random() + 2,
      tiltSin: 0,
      tiltCos: 0,
      wobbleX: 0,
      wobbleY: 0,
      gravity: opts.gravity * 3,
      ovalScalar: 0.6,
      scalar: opts.scalar,
      flat: opts.flat
    };
  }
  function updateFetti(context, fetti) {
    fetti.x += Math.cos(fetti.angle2D) * fetti.velocity + fetti.drift;
    fetti.y += Math.sin(fetti.angle2D) * fetti.velocity + fetti.gravity;
    fetti.velocity *= fetti.decay;
    if (fetti.flat) {
      fetti.wobble = 0;
      fetti.wobbleX = fetti.x + 10 * fetti.scalar;
      fetti.wobbleY = fetti.y + 10 * fetti.scalar;
      fetti.tiltSin = 0;
      fetti.tiltCos = 0;
      fetti.random = 1;
    } else {
      fetti.wobble += fetti.wobbleSpeed;
      fetti.wobbleX = fetti.x + 10 * fetti.scalar * Math.cos(fetti.wobble);
      fetti.wobbleY = fetti.y + 10 * fetti.scalar * Math.sin(fetti.wobble);
      fetti.tiltAngle += 0.1;
      fetti.tiltSin = Math.sin(fetti.tiltAngle);
      fetti.tiltCos = Math.cos(fetti.tiltAngle);
      fetti.random = Math.random() + 2;
    }
    var progress = fetti.tick++ / fetti.totalTicks;
    var x1 = fetti.x + fetti.random * fetti.tiltCos;
    var y1 = fetti.y + fetti.random * fetti.tiltSin;
    var x2 = fetti.wobbleX + fetti.random * fetti.tiltCos;
    var y2 = fetti.wobbleY + fetti.random * fetti.tiltSin;
    context.fillStyle = 'rgba(' + fetti.color.r + ', ' + fetti.color.g + ', ' + fetti.color.b + ', ' + (1 - progress) + ')';
    context.beginPath();
    if (canUsePaths && fetti.shape.type === 'path' && typeof fetti.shape.path === 'string' && Array.isArray(fetti.shape.matrix)) {
      context.fill(transformPath2D(fetti.shape.path, fetti.shape.matrix, fetti.x, fetti.y, Math.abs(x2 - x1) * 0.1, Math.abs(y2 - y1) * 0.1, Math.PI / 10 * fetti.wobble));
    } else if (fetti.shape.type === 'bitmap') {
      var rotation = Math.PI / 10 * fetti.wobble;
      var scaleX = Math.abs(x2 - x1) * 0.1;
      var scaleY = Math.abs(y2 - y1) * 0.1;
      var width = fetti.shape.bitmap.width * fetti.scalar;
      var height = fetti.shape.bitmap.height * fetti.scalar;
      var matrix = new DOMMatrix([Math.cos(rotation) * scaleX, Math.sin(rotation) * scaleX, -Math.sin(rotation) * scaleY, Math.cos(rotation) * scaleY, fetti.x, fetti.y]);

      // apply the transform matrix from the confetti shape
      matrix.multiplySelf(new DOMMatrix(fetti.shape.matrix));
      var pattern = context.createPattern(bitmapMapper.transform(fetti.shape.bitmap), 'no-repeat');
      pattern.setTransform(matrix);
      context.globalAlpha = 1 - progress;
      context.fillStyle = pattern;
      context.fillRect(fetti.x - width / 2, fetti.y - height / 2, width, height);
      context.globalAlpha = 1;
    } else if (fetti.shape === 'circle') {
      context.ellipse ? context.ellipse(fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI) : ellipse(context, fetti.x, fetti.y, Math.abs(x2 - x1) * fetti.ovalScalar, Math.abs(y2 - y1) * fetti.ovalScalar, Math.PI / 10 * fetti.wobble, 0, 2 * Math.PI);
    } else if (fetti.shape === 'star') {
      var rot = Math.PI / 2 * 3;
      var innerRadius = 4 * fetti.scalar;
      var outerRadius = 8 * fetti.scalar;
      var x = fetti.x;
      var y = fetti.y;
      var spikes = 5;
      var step = Math.PI / spikes;
      while (spikes--) {
        x = fetti.x + Math.cos(rot) * outerRadius;
        y = fetti.y + Math.sin(rot) * outerRadius;
        context.lineTo(x, y);
        rot += step;
        x = fetti.x + Math.cos(rot) * innerRadius;
        y = fetti.y + Math.sin(rot) * innerRadius;
        context.lineTo(x, y);
        rot += step;
      }
    } else {
      context.moveTo(Math.floor(fetti.x), Math.floor(fetti.y));
      context.lineTo(Math.floor(fetti.wobbleX), Math.floor(y1));
      context.lineTo(Math.floor(x2), Math.floor(y2));
      context.lineTo(Math.floor(x1), Math.floor(fetti.wobbleY));
    }
    context.closePath();
    context.fill();
    return fetti.tick < fetti.totalTicks;
  }
  function animate(canvas, fettis, resizer, size, done) {
    var animatingFettis = fettis.slice();
    var context = canvas.getContext('2d');
    var animationFrame;
    var destroy;
    var prom = promise(function (resolve) {
      function onDone() {
        animationFrame = destroy = null;
        context.clearRect(0, 0, size.width, size.height);
        bitmapMapper.clear();
        done();
        resolve();
      }
      function update() {
        if (isWorker && !(size.width === workerSize.width && size.height === workerSize.height)) {
          size.width = canvas.width = workerSize.width;
          size.height = canvas.height = workerSize.height;
        }
        if (!size.width && !size.height) {
          resizer(canvas);
          size.width = canvas.width;
          size.height = canvas.height;
        }
        context.clearRect(0, 0, size.width, size.height);
        animatingFettis = animatingFettis.filter(function (fetti) {
          return updateFetti(context, fetti);
        });
        if (animatingFettis.length) {
          animationFrame = raf.frame(update);
        } else {
          onDone();
        }
      }
      animationFrame = raf.frame(update);
      destroy = onDone;
    });
    return {
      addFettis: function (fettis) {
        animatingFettis = animatingFettis.concat(fettis);
        return prom;
      },
      canvas: canvas,
      promise: prom,
      reset: function () {
        if (animationFrame) {
          raf.cancel(animationFrame);
        }
        if (destroy) {
          destroy();
        }
      }
    };
  }
  function confettiCannon(canvas, globalOpts) {
    var isLibCanvas = !canvas;
    var allowResize = !!prop(globalOpts || {}, 'resize');
    var hasResizeEventRegistered = false;
    var globalDisableForReducedMotion = prop(globalOpts, 'disableForReducedMotion', Boolean);
    var shouldUseWorker = canUseWorker && !!prop(globalOpts || {}, 'useWorker');
    var worker = shouldUseWorker ? getWorker() : null;
    var resizer = isLibCanvas ? setCanvasWindowSize : setCanvasRectSize;
    var initialized = canvas && worker ? !!canvas.__confetti_initialized : false;
    var preferLessMotion = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion)').matches;
    var animationObj;
    function fireLocal(options, size, done) {
      var particleCount = prop(options, 'particleCount', onlyPositiveInt);
      var angle = prop(options, 'angle', Number);
      var spread = prop(options, 'spread', Number);
      var startVelocity = prop(options, 'startVelocity', Number);
      var decay = prop(options, 'decay', Number);
      var gravity = prop(options, 'gravity', Number);
      var drift = prop(options, 'drift', Number);
      var colors = prop(options, 'colors', colorsToRgb);
      var ticks = prop(options, 'ticks', Number);
      var shapes = prop(options, 'shapes');
      var scalar = prop(options, 'scalar');
      var flat = !!prop(options, 'flat');
      var origin = getOrigin(options);
      var temp = particleCount;
      var fettis = [];
      var startX = canvas.width * origin.x;
      var startY = canvas.height * origin.y;
      while (temp--) {
        fettis.push(randomPhysics({
          x: startX,
          y: startY,
          angle: angle,
          spread: spread,
          startVelocity: startVelocity,
          color: colors[temp % colors.length],
          shape: shapes[randomInt(0, shapes.length)],
          ticks: ticks,
          decay: decay,
          gravity: gravity,
          drift: drift,
          scalar: scalar,
          flat: flat
        }));
      }

      // if we have a previous canvas already animating,
      // add to it
      if (animationObj) {
        return animationObj.addFettis(fettis);
      }
      animationObj = animate(canvas, fettis, resizer, size, done);
      return animationObj.promise;
    }
    function fire(options) {
      var disableForReducedMotion = globalDisableForReducedMotion || prop(options, 'disableForReducedMotion', Boolean);
      var zIndex = prop(options, 'zIndex', Number);
      if (disableForReducedMotion && preferLessMotion) {
        return promise(function (resolve) {
          resolve();
        });
      }
      if (isLibCanvas && animationObj) {
        // use existing canvas from in-progress animation
        canvas = animationObj.canvas;
      } else if (isLibCanvas && !canvas) {
        // create and initialize a new canvas
        canvas = getCanvas(zIndex);
        document.body.appendChild(canvas);
      }
      if (allowResize && !initialized) {
        // initialize the size of a user-supplied canvas
        resizer(canvas);
      }
      var size = {
        width: canvas.width,
        height: canvas.height
      };
      if (worker && !initialized) {
        worker.init(canvas);
      }
      initialized = true;
      if (worker) {
        canvas.__confetti_initialized = true;
      }
      function onResize() {
        if (worker) {
          // TODO this really shouldn't be immediate, because it is expensive
          var obj = {
            getBoundingClientRect: function () {
              if (!isLibCanvas) {
                return canvas.getBoundingClientRect();
              }
            }
          };
          resizer(obj);
          worker.postMessage({
            resize: {
              width: obj.width,
              height: obj.height
            }
          });
          return;
        }

        // don't actually query the size here, since this
        // can execute frequently and rapidly
        size.width = size.height = null;
      }
      function done() {
        animationObj = null;
        if (allowResize) {
          hasResizeEventRegistered = false;
          global.removeEventListener('resize', onResize);
        }
        if (isLibCanvas && canvas) {
          if (document.body.contains(canvas)) {
            document.body.removeChild(canvas);
          }
          canvas = null;
          initialized = false;
        }
      }
      if (allowResize && !hasResizeEventRegistered) {
        hasResizeEventRegistered = true;
        global.addEventListener('resize', onResize, false);
      }
      if (worker) {
        return worker.fire(options, size, done);
      }
      return fireLocal(options, size, done);
    }
    fire.reset = function () {
      if (worker) {
        worker.reset();
      }
      if (animationObj) {
        animationObj.reset();
      }
    };
    return fire;
  }

  // Make default export lazy to defer worker creation until called.
  var defaultFire;
  function getDefaultFire() {
    if (!defaultFire) {
      defaultFire = confettiCannon(null, {
        useWorker: true,
        resize: true
      });
    }
    return defaultFire;
  }
  function transformPath2D(pathString, pathMatrix, x, y, scaleX, scaleY, rotation) {
    var path2d = new Path2D(pathString);
    var t1 = new Path2D();
    t1.addPath(path2d, new DOMMatrix(pathMatrix));
    var t2 = new Path2D();
    // see https://developer.mozilla.org/en-US/docs/Web/API/DOMMatrix/DOMMatrix
    t2.addPath(t1, new DOMMatrix([Math.cos(rotation) * scaleX, Math.sin(rotation) * scaleX, -Math.sin(rotation) * scaleY, Math.cos(rotation) * scaleY, x, y]));
    return t2;
  }
  function shapeFromPath(pathData) {
    if (!canUsePaths) {
      throw new Error('path confetti are not supported in this browser');
    }
    var path, matrix;
    if (typeof pathData === 'string') {
      path = pathData;
    } else {
      path = pathData.path;
      matrix = pathData.matrix;
    }
    var path2d = new Path2D(path);
    var tempCanvas = document.createElement('canvas');
    var tempCtx = tempCanvas.getContext('2d');
    if (!matrix) {
      // attempt to figure out the width of the path, up to 1000x1000
      var maxSize = 1000;
      var minX = maxSize;
      var minY = maxSize;
      var maxX = 0;
      var maxY = 0;
      var width, height;

      // do some line skipping... this is faster than checking
      // every pixel and will be mostly still correct
      for (var x = 0; x < maxSize; x += 2) {
        for (var y = 0; y < maxSize; y += 2) {
          if (tempCtx.isPointInPath(path2d, x, y, 'nonzero')) {
            minX = Math.min(minX, x);
            minY = Math.min(minY, y);
            maxX = Math.max(maxX, x);
            maxY = Math.max(maxY, y);
          }
        }
      }
      width = maxX - minX;
      height = maxY - minY;
      var maxDesiredSize = 10;
      var scale = Math.min(maxDesiredSize / width, maxDesiredSize / height);
      matrix = [scale, 0, 0, scale, -Math.round(width / 2 + minX) * scale, -Math.round(height / 2 + minY) * scale];
    }
    return {
      type: 'path',
      path: path,
      matrix: matrix
    };
  }
  function shapeFromText(textData) {
    var text,
      scalar = 1,
      color = '#000000',
      // see https://nolanlawson.com/2022/04/08/the-struggle-of-using-native-emoji-on-the-web/
      fontFamily = '"Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji", "EmojiOne Color", "Android Emoji", "Twemoji Mozilla", "system emoji", sans-serif';
    if (typeof textData === 'string') {
      text = textData;
    } else {
      text = textData.text;
      scalar = 'scalar' in textData ? textData.scalar : scalar;
      fontFamily = 'fontFamily' in textData ? textData.fontFamily : fontFamily;
      color = 'color' in textData ? textData.color : color;
    }

    // all other confetti are 10 pixels,
    // so this pixel size is the de-facto 100% scale confetti
    var fontSize = 10 * scalar;
    var font = '' + fontSize + 'px ' + fontFamily;
    var canvas = new OffscreenCanvas(fontSize, fontSize);
    var ctx = canvas.getContext('2d');
    ctx.font = font;
    var size = ctx.measureText(text);
    var width = Math.ceil(size.actualBoundingBoxRight + size.actualBoundingBoxLeft);
    var height = Math.ceil(size.actualBoundingBoxAscent + size.actualBoundingBoxDescent);
    var padding = 2;
    var x = size.actualBoundingBoxLeft + padding;
    var y = size.actualBoundingBoxAscent + padding;
    width += padding + padding;
    height += padding + padding;
    canvas = new OffscreenCanvas(width, height);
    ctx = canvas.getContext('2d');
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
    var scale = 1 / scalar;
    return {
      type: 'bitmap',
      // TODO these probably need to be transfered for workers
      bitmap: canvas.transferToImageBitmap(),
      matrix: [scale, 0, 0, scale, -width * scale / 2, -height * scale / 2]
    };
  }
  module.exports = function () {
    return getDefaultFire().apply(this, arguments);
  };
  module.exports.reset = function () {
    getDefaultFire().reset();
  };
  module.exports.create = confettiCannon;
  module.exports.shapeFromPath = shapeFromPath;
  module.exports.shapeFromText = shapeFromText;
})(function () {
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof self !== 'undefined') {
    return self;
  }
  return this || {};
}(), module, false);

// end source content

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (module.exports);
var create = module.exports.create;

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_teacher-training_teacher-training_module_ts.697ed386ab826cc3.js.map