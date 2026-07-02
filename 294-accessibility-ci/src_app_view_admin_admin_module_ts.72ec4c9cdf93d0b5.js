"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_admin_admin_module_ts"],{

/***/ 37158:
/*!****************************************************!*\
  !*** ./src/app/view/admin/admin-routing.module.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminRoutingModule: () => (/* binding */ AdminRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/guards/permission.guard */ 83811);
/* harmony import */ var _content_activity_content_activity_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./content-activity/content-activity.component */ 33228);
/* harmony import */ var _view_lesson_plan_view_lesson_plan_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./view-lesson-plan/view-lesson-plan.component */ 90834);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);






const routes = [{
  path: '',
  redirectTo: 'dashboard',
  pathMatch: 'full'
}, {
  path: 'dashboard',
  loadComponent: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_exceljs_dist_exceljs_min_js"), __webpack_require__.e("default-node_modules_ng2-charts_fesm2020_ng2-charts_mjs"), __webpack_require__.e("src_app_view_admin_dashboard_dashboard_component_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./dashboard/dashboard.component */ 43068)).then(c => c.DashboardComponent),
  data: {
    permissions: ['admin', 'manager']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_0__.PermissionGuard]
}, {
  path: 'school-management',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_shared_components_disable-popup_disable-popup_component_ts-src_app_shared_com-3e4ea0"), __webpack_require__.e("src_app_view_admin_school-management_school-management_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./school-management/school-management.module */ 77435)).then(m => m.SchoolManagementModule),
  data: {
    permissions: ['admin', 'manager']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_0__.PermissionGuard]
}, {
  path: 'teacher-management',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_shared_components_disable-popup_disable-popup_component_ts-src_app_shared_com-3e4ea0"), __webpack_require__.e("default-src_app_shared_components_user-staff-list_user-staff-list_component_ts-node_modules_n-062fda"), __webpack_require__.e("src_app_view_admin_user-management_user-management_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./user-management/user-management.module */ 75831)).then(m => m.UserManagementModule),
  data: {
    permissions: ['admin', 'manager']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_0__.PermissionGuard]
}, {
  path: 'staff-management',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_shared_components_disable-popup_disable-popup_component_ts-src_app_shared_com-3e4ea0"), __webpack_require__.e("default-src_app_shared_components_user-staff-list_user-staff-list_component_ts-node_modules_n-062fda"), __webpack_require__.e("src_app_view_admin_shikshan-user-management_shikshan-user-management_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./shikshan-user-management/shikshan-user-management.module */ 81171)).then(m => m.ShikshanUserManagementModule),
  data: {
    permissions: ['admin']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_0__.PermissionGuard]
}, {
  path: 'content-activity',
  component: _content_activity_content_activity_component__WEBPACK_IMPORTED_MODULE_1__.ContentActivityComponent,
  data: {
    permissions: ['admin', 'manager']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_0__.PermissionGuard]
}, {
  path: 'content-activity/lesson-plan/:id',
  component: _view_lesson_plan_view_lesson_plan_component__WEBPACK_IMPORTED_MODULE_2__.ViewLessonPlanComponent,
  data: {
    permissions: ['admin', 'manager']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_0__.PermissionGuard]
}, {
  path: 'teacher-training',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_exceljs_dist_exceljs_min_js"), __webpack_require__.e("common"), __webpack_require__.e("src_app_view_admin_teacher-training_teacher-training_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./teacher-training/teacher-training.module */ 75199)).then(m => m.TeacherTrainingModule),
  data: {
    permissions: ['admin', 'manager']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_0__.PermissionGuard]
}, {
  path: 'audit-log',
  loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_view_admin_audit-log_audit-log_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./audit-log/audit-log.component */ 38696)).then(c => c.AuditLogComponent),
  data: {
    permissions: ['admin', 'manager']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_0__.PermissionGuard]
}];
class AdminRoutingModule {
  static {
    this.ɵfac = function AdminRoutingModule_Factory(t) {
      return new (t || AdminRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
      type: AdminRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](AdminRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
})();

/***/ }),

/***/ 17743:
/*!********************************************!*\
  !*** ./src/app/view/admin/admin.module.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminModule: () => (/* binding */ AdminModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _admin_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./admin-routing.module */ 37158);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var _content_activity_content_activity_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./content-activity/content-activity.component */ 33228);
/* harmony import */ var src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var _user_content_generation_content_generation_module__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../user/content-generation/content-generation.module */ 47055);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 37580);








class AdminModule {
  static {
    this.ɵfac = function AdminModule_Factory(t) {
      return new (t || AdminModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineNgModule"]({
      type: AdminModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _admin_routing_module__WEBPACK_IMPORTED_MODULE_0__.AdminRoutingModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormsModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_1__.CommonDropdownComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_3__.PaginationComponent, _user_content_generation_content_generation_module__WEBPACK_IMPORTED_MODULE_4__.ContentGenerationModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵsetNgModuleScope"](AdminModule, {
    declarations: [_content_activity_content_activity_component__WEBPACK_IMPORTED_MODULE_2__.ContentActivityComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, _admin_routing_module__WEBPACK_IMPORTED_MODULE_0__.AdminRoutingModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormsModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_1__.CommonDropdownComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_3__.PaginationComponent, _user_content_generation_content_generation_module__WEBPACK_IMPORTED_MODULE_4__.ContentGenerationModule]
  });
})();

/***/ }),

/***/ 33228:
/*!***************************************************************************!*\
  !*** ./src/app/view/admin/content-activity/content-activity.component.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContentActivityComponent: () => (/* binding */ ContentActivityComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 52575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 91817);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _content_activity_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./content-activity.service */ 77028);
/* harmony import */ var src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/services/master.service */ 2216);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _user_management_user_management_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../user-management/user-management.service */ 58640);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/components/pagination/pagination.component */ 94815);











const _c0 = ["stateDropdown"];
const _c1 = ["zoneDropdown"];
const _c2 = ["districtDropdown"];
const _c3 = ["blockDropdown"];
const _c4 = ["schoolDropdown"];
function ContentActivityComponent_button_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ContentActivityComponent_button_13_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r11.exportContentActivities());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](2, "img", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4, "Export");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("disabled", !ctx_r0.listData.length);
  }
}
function ContentActivityComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1, "No items found");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
const _c5 = function (a1) {
  return ["lesson-plan", a1];
};
const _c6 = function (a0, a1, a2) {
  return {
    "success-chip": a0,
    "warning-chip": a1,
    "error-chip": a2
  };
};
function ContentActivityComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 35)(1, "div", 36)(2, "div")(3, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](4, "Teacher");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](5, "p", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](7, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "div")(9, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](10, "Generated Content");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "a", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](13, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "div")(15, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](16, "Source Content");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "a", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](19, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](20, "div", 40)(21, "div")(22, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](23, "Status");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](26, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "div")(28, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](29, "Updated At");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](30, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](32, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const item_r13 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](7, 10, item_r13 == null ? null : item_r13.userName));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("disableLink", (item_r13 == null ? null : item_r13.teacherLessonPlanStatus) !== "completed");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction1"](21, _c5, item_r13 == null ? null : item_r13.genContentId));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](13, 12, item_r13 == null ? null : item_r13.genContent));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction1"](23, _c5, item_r13 == null ? null : item_r13.contentId));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](19, 14, item_r13 == null ? null : item_r13.content));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction3"](25, _c6, (item_r13 == null ? null : item_r13.teacherLessonPlanStatus) === "completed", (item_r13 == null ? null : item_r13.teacherLessonPlanStatus) !== "completed", (item_r13 == null ? null : item_r13.teacherLessonPlanStatus) === "failed"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](26, 16, item_r13 == null ? null : item_r13.teacherLessonPlanStatus), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind2"](32, 18, item_r13 == null ? null : item_r13.updatedAt, "d/M/yy, h:mm a"));
  }
}
function ContentActivityComponent_th_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "th", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const header_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](header_r14);
  }
}
function ContentActivityComponent_tr_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "tr")(1, "td", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2, "No items found");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
}
function ContentActivityComponent_tr_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "tr", 44)(1, "td", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](3, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "td", 45)(5, "a", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](7, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "td", 45)(9, "a", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](11, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "td", 47)(13, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](15, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](16, "td", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](18, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r15 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](3, 10, item_r15 == null ? null : item_r15.userName));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵclassProp"]("disableLink", (item_r15 == null ? null : item_r15.teacherLessonPlanStatus) !== "completed");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction1"](21, _c5, item_r15 == null ? null : item_r15.genContentId));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](7, 12, item_r15 == null ? null : item_r15.genContent));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("routerLink", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction1"](23, _c5, item_r15 == null ? null : item_r15.contentId));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](11, 14, item_r15 == null ? null : item_r15.content));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction3"](25, _c6, (item_r15 == null ? null : item_r15.teacherLessonPlanStatus) === "completed", (item_r15 == null ? null : item_r15.teacherLessonPlanStatus) !== "completed", (item_r15 == null ? null : item_r15.teacherLessonPlanStatus) === "failed"));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](15, 16, item_r15 == null ? null : item_r15.teacherLessonPlanStatus), "");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind2"](18, 18, item_r15 == null ? null : item_r15.updatedAt, "d/M/yy, h:mm a"));
  }
}
class ContentActivityComponent {
  constructor(contentActivityService, masterService, utilityService, userManagementService) {
    this.contentActivityService = contentActivityService;
    this.masterService = masterService;
    this.utilityService = utilityService;
    this.userManagementService = userManagementService;
    this.searchText = "";
    this.currentPage = 1;
    this.totalItems = 0;
    this.pageSize = 10;
    this.listData = [];
    this.searchTerms = new rxjs__WEBPACK_IMPORTED_MODULE_7__.Subject();
    this.table_headers = ['Teacher Name', 'Content Regenerated', 'Original Content', 'Status', 'Date of Modification'];
    this.stateDropdownOptions = [];
    this.stateDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select State',
      height: 'auto',
      bindLabel: 'state',
      bindValue: 'state',
      clearableOff: false,
      labelTxt: 'State'
    };
    this.zoneDropdownOptions = [];
    this.zoneDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Zone',
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'name',
      clearableOff: false,
      labelTxt: 'Zone'
    };
    this.districtDropdownOptions = [];
    this.districtDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select District',
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'name',
      clearableOff: false,
      labelTxt: 'District'
    };
    this.blockDropdownOptions = [];
    this.blockDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Taluk',
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'name',
      clearableOff: false,
      labelTxt: 'Taluk'
    };
    this.schoolDropdownOptions = [];
    this.schoolDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select School',
      height: 'auto',
      bindLabel: 'name',
      bindValue: '_id',
      clearableOff: false,
      labelTxt: 'School',
      searchable: true
    };
    this.filterObj = {
      district: '',
      zone: '',
      block: '',
      _id: '',
      search: ''
    };
  }
  ngOnInit() {
    this.getRegionsData();
    this.searchSubscription = this.searchTerms.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_8__.debounceTime)(1000), (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.distinctUntilChanged)()).subscribe(() => {
      this.onFilterChange('search', this.searchText);
    });
    this.getContentActivityData();
  }
  getContentActivityData(filters) {
    let observable;
    if (this.searchText.trim() !== '') {
      observable = this.contentActivityService.getContentActivityData(this.currentPage, this.pageSize, filters, this.searchText);
    } else {
      observable = this.contentActivityService.getContentActivityData(this.currentPage, this.pageSize, filters);
    }
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
    this.paginationSubscription = observable.subscribe({
      next: res => {
        this.listData = res.data['results'];
        this.totalItems = res.data.totalItems;
        if (this.totalItems <= 10) {
          this.currentPage = 1;
        }
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  searchInputChanged(event) {
    this.searchTerms.next(event.target.value);
    this.currentPage = 1;
  }
  /**
   * Function to get regions data
   */
  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: val => {
        this.regionsData = val?.data?.results;
        this.stateDropdownOptions = this.regionsData;
      }
    });
  }
  /**
   * Function to set zone dropdown values
   * @param selectedStateValue
   */
  setZoneDropdownValues(selectedStateValue) {
    const loggedInUser = this.utilityService.loggedInUserData;
    if (selectedStateValue) {
      this.selectedStateObj = this.utilityService.filterDropdownValues(this.regionsData, 'state', selectedStateValue);
      if (loggedInUser && loggedInUser.role.includes('manager') && loggedInUser.zones && loggedInUser.zones.length > 0) {
        // Only show manager's zones
        this.zoneDropdownOptions = this.selectedStateObj.zones.filter(zone => loggedInUser.zones.includes(zone.name));
      } else {
        this.zoneDropdownOptions = this.selectedStateObj.zones;
      }
    } else {
      this.zoneDropdownOptions = [];
    }
  }
  /**
   * Function to set district dropdown values
   * @param selectedZone
   */
  setDistrictDropdownValues(selectedZone) {
    this.resetZone();
    if (selectedZone) {
      this.selectedZoneObj = this.utilityService.filterDropdownValues(this.selectedStateObj.zones, 'name', selectedZone);
      // districts is now an array
      if (this.selectedZoneObj && this.selectedZoneObj.districts) {
        this.districtDropdownOptions = Array.isArray(this.selectedZoneObj.districts) ? this.selectedZoneObj.districts : [this.selectedZoneObj.districts]; // Handle legacy object structure
      } else {
        this.districtDropdownOptions = [];
      }
    }
  }
  /**
   * Function to set block dropdown values
   * @param selectedDistrict
   */
  setBlockDropdownValues(selectedDistrict) {
    this.resetDistrict();
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
    }
  }
  onFilterChange(type, value) {
    this.filterObj[type] = value;
    if (value) {
      switch (type) {
        case 'state':
          this.setZoneDropdownValues(value);
          break;
        case 'zone':
          this.setDistrictDropdownValues(value);
          break;
        case 'district':
          this.setBlockDropdownValues(value);
          break;
        case 'block':
          this.getSchoolFilteredList();
          break;
      }
    } else {
      switch (type) {
        case 'state':
          this.resetStates();
          break;
        case 'zone':
          this.resetZone();
          break;
        case 'district':
          this.resetDistrict();
          break;
        case 'block':
          this.resetBlock();
          break;
      }
    }
    this.currentPage = 1;
    this.getContentActivityData(this.filterObj);
  }
  /**
       * Function to get filtered school list
       */
  getSchoolFilteredList() {
    this.resetBlock();
    const filters = {
      state: this.filterObj.state,
      district: this.filterObj.district,
      zone: this.filterObj.zone,
      block: this.filterObj.block
    };
    this.userManagementService.getSchoolList(true, filters).subscribe(res => {
      this.schoolDropdownOptions = res?.data?.results;
    });
  }
  resetStates() {
    this.zoneDropdownOptions = [];
    this.districtDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.filterObj.zone = '';
    this.filterObj.district = '';
    this.filterObj.block = '';
    this.filterObj._id = '';
    this.zoneDropdown.selectedItem = null;
    this.districtDropdown.selectedItem = null;
    this.blockDropdown.selectedItem = null;
    this.schoolDropdown.selectedItem = null;
  }
  resetZone() {
    this.filterObj.district = '';
    this.filterObj.block = '';
    this.filterObj._id = '';
    this.districtDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.districtDropdown.selectedItem = null;
    this.blockDropdown.selectedItem = null;
    this.schoolDropdown.selectedItem = null;
  }
  resetDistrict() {
    this.filterObj.block = '';
    this.filterObj._id = '';
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.blockDropdown.selectedItem = null;
    this.schoolDropdown.selectedItem = null;
  }
  resetBlock() {
    this.filterObj._id = '';
    this.schoolDropdownOptions = [];
    this.schoolDropdown.selectedItem = null;
  }
  /**
   * pagination
   */
  onPageChange(page) {
    this.currentPage = page;
    this.getContentActivityData(this.filterObj);
  }
  exportContentActivities() {
    if (!this.listData.length) {
      return;
    }
    this.contentActivityService.exportContentActivities(this.filterObj).subscribe({
      next: res => {
        this.utilityService.handleResponse(res);
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
  }
  static {
    this.ɵfac = function ContentActivityComponent_Factory(t) {
      return new (t || ContentActivityComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_content_activity_service__WEBPACK_IMPORTED_MODULE_0__.ContentActivityService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_1__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_2__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_user_management_user_management_service__WEBPACK_IMPORTED_MODULE_3__.UserManagementService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
      type: ContentActivityComponent,
      selectors: [["app-content-activity"]],
      viewQuery: function ContentActivityComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c0, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c1, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c2, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c3, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c4, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.stateDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.zoneDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.districtDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.blockDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.schoolDropdown = _t.first);
        }
      },
      decls: 42,
      vars: 20,
      consts: [[1, "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "flex-col", "gap-4", "sm:flex-row", "sm:items-start", "sm:justify-between"], [1, "text-2xl", "md:text-[30px]", "font-bold", "text-content", "md:leading-[48px]"], [1, "border", "text-content", "rounded", "my-5", "px-4", "py-6", "md:px-6", "md:py-8", "bg-white"], [1, "flex", "flex-col", "gap-4", "sm:gap-5", "sm:flex-row", "sm:justify-between", "sm:items-start"], [1, "text-content", "text-2xl", "md:text-[30px]", "font-bold", "md:leading-[48px]"], [1, "w-full", "sm:w-auto", "flex", "flex-col", "sm:flex-row", "gap-2", "sm:items-center"], [1, "w-full", "sm:w-[300px]"], [1, "search-icon", "min-w-[100px]", "flex", "items-center", "h-9"], ["src", "assets/icons/search.svg", "alt", "", 1, "mr-2"], ["type", "text", "placeholder", "Search", 1, "appearance-none", "border", "border-content-50", "rounded", "pl-10", "py-2", "px-3", "text-content", "leading-tight", "focus:outline-none", "bg-surface-muted", "w-full", "h-9", 3, "ngModel", "ngModelChange", "input"], ["class", "btn-primary w-full sm:w-auto", 3, "disabled", "click", 4, "ngIf"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "xl:grid-cols-5", "gap-3", "my-4"], [1, "w-full", "min-w-0", "cursor-pointer"], [3, "dropDownValues", "config", "valueUpdate"], ["stateDropdown", ""], ["zoneDropdown", ""], ["districtDropdown", ""], ["blockDropdown", ""], ["schoolDropdown", ""], [1, "space-y-4", "md:hidden"], ["class", "text-center text-content-60 py-4 border rounded-xl", 4, "ngIf"], ["class", "rounded-xl border p-4 bg-white shadow-sm", 4, "ngFor", "ngForOf"], [1, "hidden", "md:block", "w-full", "overflow-x-auto"], ["aria-label", "User list", 1, "table-auto", "min-w-[900px]", "w-full", "border", "mt-3", "rounded-lg", "text-content"], [1, "bg-primary-60", "rounded-lg", "border-b"], ["class", "text-left p-4 rounded border-r text-sm text-content", 4, "ngFor", "ngForOf"], [4, "ngIf"], ["class", "border", 4, "ngFor", "ngForOf"], [3, "totalItems", "pageSize", "currentPage", "pageChange"], [1, "btn-primary", "w-full", "sm:w-auto", 3, "disabled", "click"], [1, "flex", "items-center", "justify-center", "gap-2"], ["src", "assets/icons/upload_light.svg", "alt", ""], [1, "text-nowrap"], [1, "text-center", "text-content-60", "py-4", "border", "rounded-xl"], [1, "rounded-xl", "border", "p-4", "bg-white", "shadow-sm"], [1, "space-y-3", "text-sm"], [1, "text-xs", "text-content-60"], [1, "font-semibold", "break-words"], [1, "text-primary", "break-words", 3, "routerLink"], [1, "grid", "grid-cols-2", "gap-3"], [3, "ngClass"], [1, "text-left", "p-4", "rounded", "border-r", "text-sm", "text-content"], ["colspan", "6", 1, "text-center", "text-content-60", "py-2"], [1, "border"], [1, "p-4", "border"], [1, "text-primary", 3, "routerLink"], [1, "p-4", "border", "text-sm"], [1, "p-4", "border-r", "whitespace-nowrap"]],
      template: function ContentActivityComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, " Content Activity ");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "div", 3)(5, "div", 4)(6, "h2", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](7, " Content History ");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](8, "div", 6)(9, "div", 7)(10, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](11, "img", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](12, "input", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("ngModelChange", function ContentActivityComponent_Template_input_ngModelChange_12_listener($event) {
            return ctx.searchText = $event;
          })("input", function ContentActivityComponent_Template_input_input_12_listener($event) {
            return ctx.searchInputChanged($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](13, ContentActivityComponent_button_13_Template, 5, 1, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](14, "div", 12)(15, "div", 13)(16, "app-common-dropdown", 14, 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("valueUpdate", function ContentActivityComponent_Template_app_common_dropdown_valueUpdate_16_listener($event) {
            return ctx.onFilterChange("state", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](18, "div", 13)(19, "app-common-dropdown", 14, 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("valueUpdate", function ContentActivityComponent_Template_app_common_dropdown_valueUpdate_19_listener($event) {
            return ctx.onFilterChange("zone", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](21, "div", 13)(22, "app-common-dropdown", 14, 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("valueUpdate", function ContentActivityComponent_Template_app_common_dropdown_valueUpdate_22_listener($event) {
            return ctx.onFilterChange("district", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](24, "div", 13)(25, "app-common-dropdown", 14, 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("valueUpdate", function ContentActivityComponent_Template_app_common_dropdown_valueUpdate_25_listener($event) {
            return ctx.onFilterChange("block", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](27, "div", 13)(28, "app-common-dropdown", 14, 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("valueUpdate", function ContentActivityComponent_Template_app_common_dropdown_valueUpdate_28_listener($event) {
            return ctx.onFilterChange("_id", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](30, "div", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](31, ContentActivityComponent_div_31_Template, 2, 0, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](32, ContentActivityComponent_div_32_Template, 33, 29, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](33, "div", 23)(34, "table", 24)(35, "thead")(36, "tr", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](37, ContentActivityComponent_th_37_Template, 2, 1, "th", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](38, "tbody");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](39, ContentActivityComponent_tr_39_Template, 3, 0, "tr", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](40, ContentActivityComponent_tr_40_Template, 19, 29, "tr", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](41, "app-pagination", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("pageChange", function ContentActivityComponent_Template_app_pagination_pageChange_41_listener($event) {
            return ctx.onPageChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngModel", ctx.searchText);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.listData);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("dropDownValues", ctx.stateDropdownOptions)("config", ctx.stateDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("dropDownValues", ctx.zoneDropdownOptions)("config", ctx.zoneDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("dropDownValues", ctx.districtDropdownOptions)("config", ctx.districtDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("dropDownValues", ctx.blockDropdownOptions)("config", ctx.blockDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("dropDownValues", ctx.schoolDropdownOptions)("config", ctx.schoolDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.listData || ctx.listData.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.listData);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.table_headers);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.listData || ctx.listData.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx.listData);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("totalItems", ctx.totalItems)("pageSize", ctx.pageSize)("currentPage", ctx.currentPage);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_10__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_10__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgModel, _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.CommonDropdownComponent, _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__.PaginationComponent, _angular_common__WEBPACK_IMPORTED_MODULE_10__.TitleCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_10__.DatePipe],
      styles: [".disableLink[_ngcontent-%COMP%] {\n  pointer-events: none;\n  color: var(--content-50);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnQtYWN0aXZpdHkuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxvQkFBQTtFQUNBLHdCQUFBO0FBQ0oiLCJmaWxlIjoiY29udGVudC1hY3Rpdml0eS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5kaXNhYmxlTGlua3tcbiAgICBwb2ludGVyLWV2ZW50czogbm9uZTtcbiAgICBjb2xvcjogdmFyKC0tY29udGVudC01MCk7XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi9jb250ZW50LWFjdGl2aXR5L2NvbnRlbnQtYWN0aXZpdHkuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxvQkFBQTtFQUNBLHdCQUFBO0FBQ0o7QUFDQSx3WUFBd1kiLCJzb3VyY2VzQ29udGVudCI6WyIuZGlzYWJsZUxpbmt7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gICAgY29sb3I6IHZhcigtLWNvbnRlbnQtNTApO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 77028:
/*!*************************************************************************!*\
  !*** ./src/app/view/admin/content-activity/content-activity.service.ts ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContentActivityService: () => (/* binding */ ContentActivityService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);





class ContentActivityService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  /**
   * class constructor
   * @param http
   */
  constructor(http) {
    super(http);
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
    this.setUri('admin');
  }
  getContentActivityData(page, limit, filters, search) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (search) {
      params = params.set('search', search);
    }
    if (filters) {
      if (filters.state) {
        params = params.set('filter[state]', filters.state);
      }
      if (filters.district) {
        params = params.set('filter[district]', filters.district);
      }
      if (filters.zone) {
        params = params.set('filter[zone]', filters.zone);
      }
      if (filters.block) {
        params = params.set('filter[block]', filters.block);
      }
      if (filters._id) {
        params = params.set('filter[schoolId]', filters._id);
      }
    }
    return this.get('get-content-activity', params);
  }
  getLessonPlanDetFrmContentActivity(id) {
    return this.http.get(`${this.baseUrl}/master-lesson/activity/${id}`);
  }
  exportContentActivities(filters, search) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('includeDeleted', 1);
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          if (key === 'search') {
            params = params.set(`${key}`, filters[key]);
          } else {
            params = params.set(`filter[${key}]`, filters[key]);
          }
        }
      });
    }
    return this.http.get(`${this.baseUrl}/admin/content-activity/export`, {
      params: params
    });
  }
  static {
    this.ɵfac = function ContentActivityService_Factory(t) {
      return new (t || ContentActivityService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: ContentActivityService,
      factory: ContentActivityService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 58640:
/*!***********************************************************************!*\
  !*** ./src/app/view/admin/user-management/user-management.service.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserManagementService: () => (/* binding */ UserManagementService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);





class UserManagementService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  constructor(http) {
    super(http);
    this.userRoleDropdownOptions = [{
      name: 'Standard',
      value: 'standard'
    }, {
      name: 'Power',
      value: 'power'
    }];
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
    this.setUri('user');
  }
  editUserDetails(id, data) {
    return this.http.put(`${this.baseUrl}/user/${id}`, data);
  }
  getSchoolList(includeDeleted, filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams();
    if (includeDeleted) {
      params = params.append('includeDeleted', 1);
    }
    if (filters) {
      if (filters.state) {
        params = params.set('filter[state]', filters.state);
      }
      if (filters.district) {
        if (Array.isArray(filters.district)) {
          filters.district.forEach(item => {
            params = params.append('filter[district]', item);
          });
        } else {
          params = params.set('filter[district]', filters.district);
        }
      }
      if (filters.zone) {
        if (Array.isArray(filters.zone)) {
          filters.zone.forEach(item => {
            params = params.append('filter[zone]', item);
          });
        } else {
          params = params.set('filter[zone]', filters.zone);
        }
      }
      if (filters.block) {
        params = params.set('filter[block]', filters.block);
      }
    }
    return this.http.get(`${this.baseUrl}/school/list?limit=999`, {
      params: params
    });
  }
  bulkUpload(formdata) {
    return this.http.post(`${this.baseUrl}/user/bulk-upload`, formdata);
  }
  getUsersOfSchool(schoolId) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('filter[school]', schoolId);
    return this.http.get(`${this.baseUrl}/user/list`, {
      params: params
    });
  }
  static {
    this.ɵfac = function UserManagementService_Factory(t) {
      return new (t || UserManagementService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: UserManagementService,
      factory: UserManagementService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 90834:
/*!***************************************************************************!*\
  !*** ./src/app/view/admin/view-lesson-plan/view-lesson-plan.component.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewLessonPlanComponent: () => (/* binding */ ViewLessonPlanComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _user_content_generation_content_generation_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../user/content-generation/content-generation.module */ 47055);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _content_activity_content_activity_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../content-activity/content-activity.service */ 77028);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _user_content_generation_lesson_plan_formats_lesson_plan_formats_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../user/content-generation/lesson-plan-formats/lesson-plan-formats.component */ 92001);
/* harmony import */ var _user_content_generation_lesson_plan_subject_details_lesson_plan_subject_details_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../user/content-generation/lesson-plan-subject-details/lesson-plan-subject-details.component */ 41785);











const _c0 = ["contentContainer"];
function ViewLessonPlanComponent_div_8_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ViewLessonPlanComponent_div_8_button_3_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r8);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r7.expandedContainer = true);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "img", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
const _c1 = function (a0) {
  return {
    "bg-primary-40 text-primary font-bold": a0
  };
};
function ViewLessonPlanComponent_div_8_ng_container_5_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ViewLessonPlanComponent_div_8_ng_container_5_div_1_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r13);
      const section_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r11.scrollToSection(section_r9.id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const section_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]().$implicit;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction1"](2, _c1, ctx_r10.activeSectionId === section_r9.id));
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", section_r9.title, " ");
  }
}
function ViewLessonPlanComponent_div_8_ng_container_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](1, ViewLessonPlanComponent_div_8_ng_container_5_div_1_Template, 2, 4, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const section_r9 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !(section_r9 == null ? null : section_r9.isAdditional));
  }
}
function ViewLessonPlanComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 16)(1, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](3, ViewLessonPlanComponent_div_8_button_3_Template, 2, 0, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerStart"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](5, ViewLessonPlanComponent_div_8_ng_container_5_Template, 2, 1, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ctx_r0.activeTab(), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx_r0.expandedContainer);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngForOf", ctx_r0.sections);
  }
}
function ViewLessonPlanComponent_button_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ViewLessonPlanComponent_button_9_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r16);
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r15.toggleAccordion());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](1, "div", 25)(2, "p", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](3, "Chapter Details");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](4, "img", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpropertyInterpolate"]("src", ctx_r1.isOpen ? "assets/icons/up-drop.svg" : "assets/icons/down-drop.svg", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
  }
}
function ViewLessonPlanComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "app-lesson-plan-subject-details", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("subjectDetails", ctx_r2.subjectDetails);
  }
}
function ViewLessonPlanComponent_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "button", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function ViewLessonPlanComponent_button_14_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r18);
      const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r17.expandedContainer = false);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "img", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
}
class ViewLessonPlanComponent {
  constructor(route, contentActService, utilityService) {
    this.route = route;
    this.contentActService = contentActService;
    this.utilityService = utilityService;
    this.sections = [];
    this.activeTab = (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.signal)('');
    this.expandedContainer = false;
    this.isOpen = true;
    this.lessonPlanId = null;
    this.activeTab.set('Lesson Plan');
  }
  ngOnInit() {
    this.routeSubs = this.route.paramMap.subscribe(params => {
      this.lessonPlanId = params.get('id');
      if (this.lessonPlanId) {
        this.getLessonPlanDetails(this.lessonPlanId);
      }
    });
    if (this.isMobile()) {
      this.isOpen = false;
    }
  }
  ngAfterViewInit() {
    this.contentContainer.nativeElement.addEventListener('scroll', () => {
      this.onScroll();
    });
  }
  isMobile() {
    return window.innerWidth <= 768;
  }
  toggleAccordion() {
    if (this.isMobile()) {
      this.isOpen = !this.isOpen;
    }
  }
  toggleContainer() {
    this.expandedContainer = !this.expandedContainer;
  }
  scrollToSection(sectionId) {
    const sectionEl = document.getElementById(sectionId);
    const containerEl = this.contentContainer?.nativeElement;
    if (sectionEl && containerEl) {
      const offset = sectionEl.offsetTop;
      const scrollOffset = 50;
      containerEl.scrollTo({
        top: offset - scrollOffset,
        behavior: 'smooth'
      });
    }
  }
  onScroll() {
    const scrollTop = this.contentContainer.nativeElement.scrollTop;
    const offsets = this.sections.map(section => {
      const el = document.getElementById(section.id);
      return {
        id: section.id,
        offset: el ? el.offsetTop : 0
      };
    });
    const visible = offsets.slice().reverse().find(o => scrollTop + 170 >= o.offset);
    if (visible && visible.id !== this.activeSectionId) {
      this.activeSectionId = visible.id;
    }
  }
  getLessonPlanDetails(id) {
    this.contentActService.getLessonPlanDetFrmContentActivity(id).subscribe({
      next: res => {
        console.log(res);
        this.planDetails = res.data[0];
        this.subjectDetails = this.planDetails;
        this.setContent();
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  setContent() {
    this.sections = this.planDetails.sections.map(section => {
      if (section.id === 'section_checklist') {
        return {
          id: section.id,
          title: 'Lesson Summary',
          outputFormat: section?.outputFormat,
          content: this.transformChecklist(section.content),
          editable: false
        };
      } else {
        return {
          ...section,
          editable: false
        };
      }
    });
    let lo = this.planDetails.learningOutcomes.map(item => `- ${item}`).join('\n');
    this.sections.unshift({
      id: 'learning_outcome',
      title: 'Learning Outcomes',
      content: lo,
      outputFormat: 'plain_text',
      editable: false
    });
    this.activeSectionId = this.sections[0].id;
  }
  transformChecklist(content) {
    const steps = ['engage', 'explore', 'explain', 'elaborate', 'evaluate'];
    const subjectName = this.planDetails?.subjects?.name || this.planDetails?.lesson?.subjects.name;
    const medium = this.planDetails?.chapter?.medium || this.planDetails?.lesson?.chapter?.medium;
    const cceToolMapper = this.utilityService.getCceTools(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.CCE_TYPE_MAPPER[subjectName], medium);
    return steps.filter(step => content[step]).map(step => ({
      type: step.toUpperCase(),
      activity: content[step].activity,
      materials: content[step].materials,
      cceTools: cceToolMapper[step.toUpperCase()]
    }));
  }
  ngOnDestroy() {
    this.routeSubs.unsubscribe();
  }
  static {
    this.ɵfac = function ViewLessonPlanComponent_Factory(t) {
      return new (t || ViewLessonPlanComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_content_activity_content_activity_service__WEBPACK_IMPORTED_MODULE_2__.ContentActivityService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__.UtilityService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
      type: ViewLessonPlanComponent,
      selectors: [["app-view-lesson-plan"]],
      viewQuery: function ViewLessonPlanComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵloadQuery"]()) && (ctx.contentContainer = _t.first);
        }
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵStandaloneFeature"]],
      decls: 19,
      vars: 8,
      consts: [[1, "p-4", "md:p-0"], [1, "flex", "justify-between", "items-center"], [1, "flex", "gap-2"], ["src", "assets/icons/back-arrow.svg", "alt", "", 1, "cursor-pointer"], [1, "text-xl", "md:text-3xl", "font-bold", "text-content"], [1, "flex", "flex-col", "md:flex-row", "main-container", "mt-4", 3, "ngClass"], [1, "flex", "flex-col", "transition-all", "duration-900", "ease-in-out", 3, "ngClass"], ["class", "hidden md:block flex-[70%] overflow-y-auto bg-white border-r border-gray-200 rounded-t-md shadow-sm section-navigation", 4, "ngIf"], ["class", "w-full text-left px-4 py-2 text-primary text-sm bg-primary-40 shadow-sm border-r border-gray-200", 3, "click", 4, "ngIf"], ["class", "flex-[30%] p-4 overflow-y-auto bg-white border-r border-gray-200 text-sm rounded-b-md shadow-sm section-navigation transition-all duration-1200 ease-in-out", 4, "ngIf"], [1, "pb-8", "overflow-x-hidden", "overflow-y-auto", "scroll-smooth", "bg-white", "rounded-md", "content-container", "group", "relative", "transition-all", "duration-1200", "ease-in-out", 3, "ngClass"], ["contentContainer", ""], [1, "flex", "border-b", "border-gray-200", "sticky", "top-0", "bg-white", "z-10"], ["class", "px-4 py-2 -mb-px", 3, "click", 4, "ngIf"], [1, "px-4", "py-2", "-mb-px", "border-b-2", "border-primary", "text-primary", "font-bold"], [3, "sections"], [1, "hidden", "md:block", "flex-[70%]", "overflow-y-auto", "bg-white", "border-r", "border-gray-200", "rounded-t-md", "shadow-sm", "section-navigation"], [1, "flex", "items-center", "justify-between", "sticky", "top-0", "bg-white", "z-10", "font-semibold", "text-content", "p-4"], [3, "click", 4, "ngIf"], [4, "ngFor", "ngForOf"], [3, "click"], ["src", "assets/icons/left-arrow.svg", "alt", ""], ["class", "cursor-pointer px-4 py-2 border-b text-content", 3, "ngClass", "click", 4, "ngIf"], [1, "cursor-pointer", "px-4", "py-2", "border-b", "text-content", 3, "ngClass", "click"], [1, "w-full", "text-left", "px-4", "py-2", "text-primary", "text-sm", "bg-primary-40", "shadow-sm", "border-r", "border-gray-200", 3, "click"], [1, "flex", "items-center", "justify-between"], [1, "font-semibold"], ["alt", "", 1, "md:hidden", 3, "src"], [1, "flex-[30%]", "p-4", "overflow-y-auto", "bg-white", "border-r", "border-gray-200", "text-sm", "rounded-b-md", "shadow-sm", "section-navigation", "transition-all", "duration-1200", "ease-in-out"], [3, "subjectDetails"], [1, "px-4", "py-2", "-mb-px", 3, "click"], ["src", "assets/icons/menu.svg", "alt", ""]],
      template: function ViewLessonPlanComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](3, "img", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "h1", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5, "Lesson Plan");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "div", 5)(7, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](8, ViewLessonPlanComponent_div_8_Template, 6, 3, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](9, ViewLessonPlanComponent_button_9_Template, 5, 1, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](10, ViewLessonPlanComponent_div_10_Template, 2, 1, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "div", 10, 11)(13, "div", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](14, ViewLessonPlanComponent_button_14_Template, 2, 0, "button", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](15, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](16, " Lesson Plan ");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](17, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](18, "app-lesson-plan-formats", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngClass", ctx.expandedContainer ? "gap-0" : "gap-4");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngClass", ctx.expandedContainer ? "w-0" : "w-full md:w-1/5");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.expandedContainer);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", !ctx.expandedContainer);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.isOpen && !ctx.expandedContainer && ctx.subjectDetails);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngClass", ctx.expandedContainer ? "w-full  md:w-full" : "md:w-4/5");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.expandedContainer);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("sections", ctx.sections);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _user_content_generation_content_generation_module__WEBPACK_IMPORTED_MODULE_0__.ContentGenerationModule, _user_content_generation_lesson_plan_formats_lesson_plan_formats_component__WEBPACK_IMPORTED_MODULE_4__.LessonPlanFormatsComponent, _user_content_generation_lesson_plan_subject_details_lesson_plan_subject_details_component__WEBPACK_IMPORTED_MODULE_5__.LessonPlanSubjectDetailsComponent],
      styles: [".active[_ngcontent-%COMP%] {\n  background-color: var(--primary-DEFAULT);\n  color: var(--surface-DEFAULT);\n}\n\n.editable-content[contenteditable=true][_ngcontent-%COMP%] {\n  border: 1px solid var(--content-30);\n  padding: 10px;\n  border-radius: 4px;\n}\n\n.inspect-wrapper[_ngcontent-%COMP%]   .tabs[_ngcontent-%COMP%] {\n  box-shadow: rgba(75, 75, 75, 0.1) 0px 10px 10px -10px;\n  box-shadow: color-mix(in srgb, var(--content-DEFAULT) 10%, transparent) 0px 10px 10px -10px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInZpZXctbGVzc29uLXBsYW4uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSx3Q0FBQTtFQUNBLDZCQUFBO0FBQ0o7O0FBRUE7RUFDSSxtQ0FBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtBQUNKOztBQUdJO0VBQ0kscURBQUE7RUFDQSwyRkFBQTtBQUFSIiwiZmlsZSI6InZpZXctbGVzc29uLXBsYW4uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuYWN0aXZlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xuICAgIGNvbG9yOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpO1xufVxuXG4uZWRpdGFibGUtY29udGVudFtjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJdIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb250ZW50LTMwKTtcbiAgICBwYWRkaW5nOiAxMHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbn1cblxuLmluc3BlY3Qtd3JhcHBlciB7XG4gICAgLnRhYnMge1xuICAgICAgICBib3gtc2hhZG93OiByZ2JhKDc1LCA3NSwgNzUsIDAuMSkgMHB4IDEwcHggMTBweCAtMTBweDtcbiAgICAgICAgYm94LXNoYWRvdzogY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgMTAlLCB0cmFuc3BhcmVudCkgMHB4IDEwcHggMTBweCAtMTBweDtcblxuICAgIH1cbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi92aWV3LWxlc3Nvbi1wbGFuL3ZpZXctbGVzc29uLXBsYW4uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSx3Q0FBQTtFQUNBLDZCQUFBO0FBQ0o7O0FBRUE7RUFDSSxtQ0FBQTtFQUNBLGFBQUE7RUFDQSxrQkFBQTtBQUNKOztBQUdJO0VBQ0kscURBQUE7RUFDQSwyRkFBQTtBQUFSO0FBQ0EsZytCQUFnK0IiLCJzb3VyY2VzQ29udGVudCI6WyIuYWN0aXZlIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xuICAgIGNvbG9yOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpO1xufVxuXG4uZWRpdGFibGUtY29udGVudFtjb250ZW50ZWRpdGFibGU9XCJ0cnVlXCJdIHtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb250ZW50LTMwKTtcbiAgICBwYWRkaW5nOiAxMHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbn1cblxuLmluc3BlY3Qtd3JhcHBlciB7XG4gICAgLnRhYnMge1xuICAgICAgICBib3gtc2hhZG93OiByZ2JhKDc1LCA3NSwgNzUsIDAuMSkgMHB4IDEwcHggMTBweCAtMTBweDtcbiAgICAgICAgYm94LXNoYWRvdzogY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgMTAlLCB0cmFuc3BhcmVudCkgMHB4IDEwcHggMTBweCAtMTBweDtcblxuICAgIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */", ".main-container[_ngcontent-%COMP%] {\n  height: calc(100vh - 200px);\n}\n\n.content-container[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.content-container[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: var(--primary-40);\n}\n.content-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: var(--primary-80);\n}\n.content-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: var(--primary-DEFAULT);\n}\n.content-container[_ngcontent-%COMP%]     ul {\n  list-style-type: disc;\n  padding-left: 1rem;\n  margin-bottom: 1em;\n  line-height: 1.5;\n}\n.content-container[_ngcontent-%COMP%]     ol {\n  list-style-type: decimal;\n  padding-left: 1rem;\n  margin-bottom: 1em;\n  line-height: 1.5;\n}\n.content-container[_ngcontent-%COMP%]     p {\n  margin-bottom: 1em;\n  line-height: 1.5;\n}\n.content-container[_ngcontent-%COMP%]     h3 {\n  margin-bottom: 1em;\n}\n\n.section-navigation[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.section-navigation[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: var(--primary-40);\n}\n.section-navigation[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: var(--primary-80);\n}\n.section-navigation[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: var(--primary-DEFAULT);\n}\n.section-navigation[_ngcontent-%COMP%]     ul {\n  list-style-type: disc;\n  padding-left: 1rem;\n}\n.section-navigation[_ngcontent-%COMP%]     ol {\n  list-style-type: decimal;\n  padding-left: 1rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlc3Nvbi1wbGFuLXZpZXctZWRpdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLDJCQUFBO0FBQ0Y7O0FBR0U7RUFDRSxVQUFBO0FBQUo7QUFHRTtFQUNFLDZCQUFBO0FBREo7QUFJRTtFQUNFLDZCQUFBO0FBRko7QUFLRTtFQUNFLGtDQUFBO0FBSEo7QUFNRTtFQUNFLHFCQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBSko7QUFPRTtFQUNFLHdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBTEo7QUFRRTtFQUNFLGtCQUFBO0VBQ0EsZ0JBQUE7QUFOSjtBQVNFO0VBQ0Usa0JBQUE7QUFQSjs7QUFZRTtFQUNFLFVBQUE7QUFUSjtBQVlFO0VBQ0UsNkJBQUE7QUFWSjtBQWFFO0VBQ0UsNkJBQUE7QUFYSjtBQWNFO0VBQ0Usa0NBQUE7QUFaSjtBQWVFO0VBQ0UscUJBQUE7RUFDQSxrQkFBQTtBQWJKO0FBZ0JFO0VBQ0Usd0JBQUE7RUFDQSxrQkFBQTtBQWRKIiwiZmlsZSI6Imxlc3Nvbi1wbGFuLXZpZXctZWRpdC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5tYWluLWNvbnRhaW5lciB7XG4gIGhlaWdodDogY2FsYygxMDB2aCAtIDIwMHB4KTtcbn1cblxuLmNvbnRlbnQtY29udGFpbmVyIHtcbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIHdpZHRoOiA0cHg7XG4gIH1cblxuICAmOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS00MCk7XG4gIH1cblxuICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS04MCk7XG4gIH1cblxuICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgfVxuXG4gIDo6bmctZGVlcCB1bCB7XG4gICAgbGlzdC1zdHlsZS10eXBlOiBkaXNjO1xuICAgIHBhZGRpbmctbGVmdDogdGhlbWUoXCJwYWRkaW5nLjRcIik7XG4gICAgbWFyZ2luLWJvdHRvbTogMWVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gIH1cblxuICA6Om5nLWRlZXAgb2wge1xuICAgIGxpc3Qtc3R5bGUtdHlwZTogZGVjaW1hbDtcbiAgICBwYWRkaW5nLWxlZnQ6IHRoZW1lKFwicGFkZGluZy40XCIpO1xuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICB9XG5cbiAgOjpuZy1kZWVwIHAge1xuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICB9XG5cbiAgOjpuZy1kZWVwIGgzIHtcbiAgICBtYXJnaW4tYm90dG9tOiAxZW07XG4gIH1cbn1cblxuLnNlY3Rpb24tbmF2aWdhdGlvbiB7XG4gICY6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICB3aWR0aDogNHB4O1xuICB9XG5cbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktNDApO1xuICB9XG5cbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktODApO1xuICB9XG5cbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktREVGQVVMVCk7XG4gIH1cblxuICA6Om5nLWRlZXAgdWwge1xuICAgIGxpc3Qtc3R5bGUtdHlwZTogZGlzYztcbiAgICBwYWRkaW5nLWxlZnQ6IHRoZW1lKFwicGFkZGluZy40XCIpO1xuICB9XG5cbiAgOjpuZy1kZWVwIG9sIHtcbiAgICBsaXN0LXN0eWxlLXR5cGU6IGRlY2ltYWw7XG4gICAgcGFkZGluZy1sZWZ0OiB0aGVtZShcInBhZGRpbmcuNFwiKTtcbiAgfVxufVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL2NvbnRlbnQtZ2VuZXJhdGlvbi9sZXNzb24tcGxhbi12aWV3LWVkaXQvbGVzc29uLXBsYW4tdmlldy1lZGl0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsMkJBQUE7QUFDRjs7QUFHRTtFQUNFLFVBQUE7QUFBSjtBQUdFO0VBQ0UsNkJBQUE7QUFESjtBQUlFO0VBQ0UsNkJBQUE7QUFGSjtBQUtFO0VBQ0Usa0NBQUE7QUFISjtBQU1FO0VBQ0UscUJBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFKSjtBQU9FO0VBQ0Usd0JBQUE7RUFDQSxrQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFMSjtBQVFFO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtBQU5KO0FBU0U7RUFDRSxrQkFBQTtBQVBKOztBQVlFO0VBQ0UsVUFBQTtBQVRKO0FBWUU7RUFDRSw2QkFBQTtBQVZKO0FBYUU7RUFDRSw2QkFBQTtBQVhKO0FBY0U7RUFDRSxrQ0FBQTtBQVpKO0FBZUU7RUFDRSxxQkFBQTtFQUNBLGtCQUFBO0FBYko7QUFnQkU7RUFDRSx3QkFBQTtFQUNBLGtCQUFBO0FBZEo7QUFDQSxvOUVBQW85RSIsInNvdXJjZXNDb250ZW50IjpbIi5tYWluLWNvbnRhaW5lciB7XG4gIGhlaWdodDogY2FsYygxMDB2aCAtIDIwMHB4KTtcbn1cblxuLmNvbnRlbnQtY29udGFpbmVyIHtcbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgIHdpZHRoOiA0cHg7XG4gIH1cblxuICAmOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS00MCk7XG4gIH1cblxuICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS04MCk7XG4gIH1cblxuICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgfVxuXG4gIDo6bmctZGVlcCB1bCB7XG4gICAgbGlzdC1zdHlsZS10eXBlOiBkaXNjO1xuICAgIHBhZGRpbmctbGVmdDogdGhlbWUoXCJwYWRkaW5nLjRcIik7XG4gICAgbWFyZ2luLWJvdHRvbTogMWVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gIH1cblxuICA6Om5nLWRlZXAgb2wge1xuICAgIGxpc3Qtc3R5bGUtdHlwZTogZGVjaW1hbDtcbiAgICBwYWRkaW5nLWxlZnQ6IHRoZW1lKFwicGFkZGluZy40XCIpO1xuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICB9XG5cbiAgOjpuZy1kZWVwIHAge1xuICAgIG1hcmdpbi1ib3R0b206IDFlbTtcbiAgICBsaW5lLWhlaWdodDogMS41O1xuICB9XG5cbiAgOjpuZy1kZWVwIGgzIHtcbiAgICBtYXJnaW4tYm90dG9tOiAxZW07XG4gIH1cbn1cblxuLnNlY3Rpb24tbmF2aWdhdGlvbiB7XG4gICY6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICB3aWR0aDogNHB4O1xuICB9XG5cbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktNDApO1xuICB9XG5cbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktODApO1xuICB9XG5cbiAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktREVGQVVMVCk7XG4gIH1cblxuICA6Om5nLWRlZXAgdWwge1xuICAgIGxpc3Qtc3R5bGUtdHlwZTogZGlzYztcbiAgICBwYWRkaW5nLWxlZnQ6IHRoZW1lKFwicGFkZGluZy40XCIpO1xuICB9XG5cbiAgOjpuZy1kZWVwIG9sIHtcbiAgICBsaXN0LXN0eWxlLXR5cGU6IGRlY2ltYWw7XG4gICAgcGFkZGluZy1sZWZ0OiB0aGVtZShcInBhZGRpbmcuNFwiKTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_admin_module_ts.72ec4c9cdf93d0b5.js.map