"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_admin_dashboard_dashboard_component_ts"],{

/***/ 92002:
/*!*****************************************************************!*\
  !*** ./src/app/view/admin/dashboard/admin-dashboard.service.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AdminDashboardService: () => (/* binding */ AdminDashboardService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);





class AdminDashboardService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  /**
   * class constructor
   * @param http
   */
  constructor(http) {
    super(http);
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
    this.setUri('admin');
  }
  getData(isLesson, schoolId, filters) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('isLesson', isLesson.toString());
    if (schoolId) {
      params = params.set('schoolId', schoolId);
    } else if (filters) {
      if (filters.state) {
        params = params.set('state', filters.state);
      }
      if (filters.zone) {
        params = params.set('zone', filters.zone);
      }
      if (filters.district) {
        params = params.set('district', filters.district);
      }
      if (filters.block) {
        params = params.set('block', filters.block);
      }
      if (filters.schoolId) {
        params = params.set('schoolId', filters.schoolId);
      }
      if (filters.fromDate) {
        params = params.set('fromDate', filters.fromDate);
      }
      if (filters.toDate) {
        params = params.set('toDate', filters.toDate);
      }
    }
    return this.http.get(`${this.baseUrl}/admin/dashboard`, {
      params
    });
  }
  static {
    this.ɵfac = function AdminDashboardService_Factory(t) {
      return new (t || AdminDashboardService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: AdminDashboardService,
      factory: AdminDashboardService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 43068:
/*!*************************************************************!*\
  !*** ./src/app/view/admin/dashboard/dashboard.component.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardComponent: () => (/* binding */ DashboardComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ng2-charts */ 57839);
/* harmony import */ var src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! exceljs */ 54058);
/* harmony import */ var exceljs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(exceljs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! file-saver */ 85841);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/services/master.service */ 2216);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _user_management_user_management_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../user-management/user-management.service */ 58640);
/* harmony import */ var _admin_dashboard_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./admin-dashboard.service */ 92002);

















const _c0 = ["stateDropDown"];
const _c1 = ["zoneDropDown"];
const _c2 = ["districtDropDown"];
const _c3 = ["blockDropDown"];
const _c4 = ["schoolDropDown"];
const _c5 = ["planTypeDropDown"];
function DashboardComponent_button_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardComponent_button_39_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r25);
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r24.clearFrmDate());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "svg", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "path", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_button_45_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardComponent_button_45_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r27);
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r26.clearToDate());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "svg", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "path", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_ng_template_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "img", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "p", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "No Data Available!");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_ng_template_49_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "img", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3, "No Data Available!");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_div_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "div", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "p", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("No. of ", ctx_r12.selectedPlanType === "lesson" ? "Lesson Plans" : "Lesson Resources", "");
  }
}
const _c6 = function (a0) {
  return {
    "w-[3000px]": a0
  };
};
function DashboardComponent_div_57_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "canvas", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](6, _c6, ((tmp_0_0 = ctx_r13.byUserBarChartData.labels == null ? null : ctx_r13.byUserBarChartData.labels.length) !== null && tmp_0_0 !== undefined ? tmp_0_0 : 0) > 18));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("data", ctx_r13.byUserBarChartData)("options", ctx_r13.byUserBarChartOptions)("plugins", ctx_r13.byUserBarChartPlugins)("legend", ctx_r13.byUserBarChartLegend)("type", "bar");
  }
}
function DashboardComponent_div_63_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "div", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "p", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("No. of ", ctx_r14.selectedPlanType === "lesson" ? "Lesson Plans" : "Lesson Resources", "");
  }
}
function DashboardComponent_div_65_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "canvas", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("data", ctx_r15.bySubjectBarChartData)("options", ctx_r15.bySubjectBarChartOptions)("plugins", ctx_r15.bySubjectBarChartPlugins)("legend", ctx_r15.bySubjectBarChartLegend)("type", "bar");
  }
}
function DashboardComponent_div_70_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "canvas", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("data", ctx_r16.byMediumDonutChartData)("options", ctx_r16.byMediumDonutChartOptions)("plugins", ctx_r16.byMediumDonutChartPlugins)("legend", ctx_r16.byMediumDonutChartLegend)("type", "doughnut");
  }
}
function DashboardComponent_div_81_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "canvas", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](2, "div", 74)(3, "h2", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("data", ctx_r17.statusDonutChartData)("options", ctx_r17.statusDonutChartOptions)("plugins", ctx_r17.statusDonutChartPlugins)("legend", ctx_r17.statusDonutChartLegend)("type", "doughnut");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"]("", ctx_r17.activeUsersCount, " / ", ctx_r17.allUsersCount, "");
  }
}
function DashboardComponent_button_87_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "button", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardComponent_button_87_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r29);
      const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r28.navigateToUserMgmt(ctx_r28.selectedSchoolId));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1, " View All ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
}
function DashboardComponent_div_95_div_2_p_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](2, 1, item_r33.role.join(", ")), " ");
  }
}
const _c7 = function (a0, a1) {
  return {
    "text-green bg-success-50": a0,
    "text-error bg-error-50": a1
  };
};
function DashboardComponent_div_95_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 86)(1, "div", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "img", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "div", 89)(4, "div", 90)(5, "span", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](7, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "span", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](10, DashboardComponent_div_95_div_2_p_10_Template, 3, 3, "p", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const item_r33 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](7, 4, item_r33 == null ? null : item_r33.name));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction2"](6, _c7, !item_r33.isDeleted, item_r33.isDeleted));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", !item_r33.isDeleted ? "Active" : "Inactive", " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", item_r33 == null ? null : item_r33.role == null ? null : item_r33.role.length);
  }
}
function DashboardComponent_div_95_th_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "th", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const header_r36 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](header_r36);
  }
}
function DashboardComponent_div_95_tr_10_span_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](2, 1, item_r37.role.join(", ")), " ");
  }
}
function DashboardComponent_div_95_tr_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "tr")(1, "td", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "img", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "span", 98);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](5, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "td", 99);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](7, DashboardComponent_div_95_tr_10_span_7_Template, 3, 3, "span", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](8, "td", 101)(9, "span", 102);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const item_r37 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](5, 4, item_r37 == null ? null : item_r37.name));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", item_r37 == null ? null : item_r37.role == null ? null : item_r37.role.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction2"](6, _c7, !item_r37.isDeleted, item_r37.isDeleted));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](!item_r37.isDeleted ? "Active" : "Inactive");
  }
}
function DashboardComponent_div_95_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 77)(1, "div", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](2, DashboardComponent_div_95_div_2_Template, 11, 9, "div", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](3, "slice");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "div", 80)(5, "table", 81)(6, "thead")(7, "tr", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](8, DashboardComponent_div_95_th_8_Template, 2, 1, "th", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "tbody", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](10, DashboardComponent_div_95_tr_10_Template, 11, 9, "tr", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](11, "slice");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind3"](3, 3, ctx_r19.filteredUsersList, 0, 3));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx_r19.tableHeaders);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind3"](11, 7, ctx_r19.filteredUsersList, 0, 3));
  }
}
function DashboardComponent_ng_template_96_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 103)(1, "p", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, "No Data Available!");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
}
function DashboardComponent_div_104_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "canvas", 104);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("data", ctx_r22.avgFeedbackDonutChartData)("options", ctx_r22.avgFeedbackDonutChartOptions)("plugins", ctx_r22.avgFeedbackDonutChartPlugins)("legend", ctx_r22.avgFeedbackDonutChartLegend)("type", "doughnut");
  }
}
function DashboardComponent_div_110_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](1, "canvas", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("data", ctx_r23.chatbotRequestsBarChartData)("options", ctx_r23.chatbotRequestsBarChartOptions)("plugins", ctx_r23.chatbotRequestsBarChartPlugins)("legend", ctx_r23.chatbotRequestsBarChartLegend)("type", "bar");
  }
}
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
class DashboardComponent {
  constructor(renderer, masterService, route, cdr, utilityService, userManagementService, adminDashboardService) {
    this.renderer = renderer;
    this.masterService = masterService;
    this.route = route;
    this.cdr = cdr;
    this.utilityService = utilityService;
    this.userManagementService = userManagementService;
    this.adminDashboardService = adminDashboardService;
    this.tableHeaders = ['User Name', 'Type of User', 'Status'];
    this.stateDropdownOptions = [];
    this.stateDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select State',
      height: 'auto',
      bindLabel: 'state',
      bindValue: 'state',
      clearableOff: true,
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
    this.planTypeDropdownOptions = [{
      name: 'Lesson Plan',
      value: 'lesson'
    }, {
      name: 'Resource Plan',
      value: 'resource'
    }];
    this.planTypeDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Plan Type',
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'value',
      labelTxt: 'Plan Type',
      clearableOff: true
    };
    this.allUsersList = [];
    this.filteredUsersList = [];
    this.allUsersCount = 0;
    this.activeUsersCount = 0;
    this.inactiveUsersCount = 0;
    this.userMediumMetrics = [];
    this.selectedMedium = 'all';
    this.userDataAvailable = false;
    this.subDataAvailable = false;
    this.mediumDataAvailable = false;
    this.statusDataAvailable = false;
    this.avgScoreDataAvailable = false;
    this.chatbotDataAvailable = false;
    this.selectedPlanType = 'lesson';
    this.isLesson = true;
    // by user bar chart
    this.byUserBarChartLegend = false;
    this.byUserBarChartPlugins = [];
    this.byUserBarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
            lineWidth: 1
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            display: true
          },
          grid: {
            color: '#DEE1E6'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#4B4B4B'
          }
        },
        tooltip: {
          backgroundColor: '#000000',
          titleMarginBottom: 0
        }
      }
    };
    // by subject bar chart
    this.bySubjectBarChartLegend = false;
    this.bySubjectBarChartPlugins = [];
    this.bySubjectBarChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
            lineWidth: 1
          }
        },
        y: {
          beginAtZero: true,
          ticks: {
            display: true
          },
          grid: {
            color: '#DEE1E6'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#4B4B4B'
          }
        },
        tooltip: {
          backgroundColor: '#000000'
        }
      }
    };
    // by medium donut chart
    this.byMediumDonutChartLegend = true;
    this.byMediumDonutChartPlugins = [];
    this.byMediumDonutChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            usePointStyle: true,
            color: '#4B4B4B'
          }
        },
        tooltip: {
          backgroundColor: '#000000'
        }
      },
      cutout: '70%',
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      }
    };
    //status
    this.statusDonutChartLegend = true;
    this.statusDonutChartPlugins = [];
    this.statusDonutChartOptions = {
      responsive: true,
      rotation: -90,
      circumference: 180,
      layout: {
        padding: {
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            generateLabels: chart => {
              const data = chart.data;
              const dataset = data.datasets[0];
              const activeUsersCount = dataset.data[0]; // Assuming the first index corresponds to active users
              const inactiveUsersCount = dataset.data[1]; // Assuming the second index corresponds to inactive users
              // Define your custom images
              const activeUserImage = new Image(20, 20);
              activeUserImage.src = 'assets/icons/Profile_1.svg';
              const inactiveUserImage = new Image(20, 20);
              inactiveUserImage.src = 'assets/icons/Profile_2.svg';
              // Return the custom labels with user counts
              return data.labels.map((label, index) => {
                const userCount = index === 0 ? activeUsersCount : inactiveUsersCount;
                return {
                  text: `${label} (${userCount})`,
                  hidden: isNaN(dataset.data[index]) || dataset.data[index] === null,
                  lineCap: 'butt',
                  lineDash: [],
                  lineDashOffset: 0,
                  lineJoin: 'miter',
                  pointStyle: index === 0 ? activeUserImage : inactiveUserImage,
                  datasetIndex: 0
                };
              });
            },
            usePointStyle: true
          }
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 1)',
          xAlign: 'center'
        }
      },
      cutout: '70%',
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      }
    };
    // Average feedback score donut chart
    this.avgFeedbackDonutChartLegend = true;
    this.avgFeedbackDonutChartPlugins = [];
    this.avgFeedbackDonutChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            usePointStyle: true,
            color: '#4B4B4B'
          }
        },
        tooltip: {
          backgroundColor: '#000000'
        }
      },
      cutout: '70%',
      scales: {
        x: {
          display: false
        },
        y: {
          display: false
        }
      }
    };
    // chatbot requests bar chart
    this.chatbotRequestsBarChartLegend = true;
    this.chatbotRequestsBarChartPlugins = [];
    this.chatbotRequestsBarChartOptions = {
      responsive: true,
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: '#DEE1E6'
          }
        }
      },
      plugins: {
        legend: {
          labels: {
            usePointStyle: true,
            color: '#4B4B4B'
          }
        },
        tooltip: {
          backgroundColor: '#000000'
        }
      }
    };
    this.formatDate = dateString => {
      const date = new Date(dateString);
      const day = ('0' + date.getDate()).slice(-2);
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };
  }
  ngOnInit() {
    this.getRegionsData();
  }
  ngAfterViewInit() {
    if (this.plantypedropdown) {
      this.plantypedropdown.selectedItem = this.planTypeDropdownOptions[0].value;
    }
    this.cdr.detectChanges();
  }
  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: val => {
        this.regionsData = val?.data?.results;
        this.setStateDropdownValues(this.regionsData);
        this.statedropdown.selectedItem = this.regionsData[0].state;
        this.onStateChange(this.statedropdown.selectedItem);
      }
    });
  }
  setStateDropdownValues(val) {
    this.stateDropdownOptions = [{
      state: 'Overall'
    }, ...val];
  }
  onStateChange(val) {
    if (val && val === 'Overall') {
      this.selectedState = null;
      this.resetStateChange();
      this.triggerGetDetails(this.isLesson);
      this.resetData();
    } else {
      this.selectedState = val;
      this.resetStateChange();
      if (val) {
        this.setZoneDropdownValues(val);
      } else {
        this.statedropdown.selectedItem = 'Overall';
        this.triggerGetDetails(this.isLesson);
        this.resetData();
      }
    }
  }
  resetStateChange() {
    this.zoneDropdownOptions = [];
    this.zonedropdown.selectedItem = null;
    this.selectedZone = null;
    this.districtDropdownOptions = [];
    this.districtdropdown.selectedItem = null;
    this.selectedDistrict = null;
    this.blockDropdownOptions = [];
    this.blockdropdown.selectedItem = null;
    this.selectedBlock = null;
    this.schoolDropdownOptions = [];
    this.schooldropdown.selectedItem = null;
    this.selectedSchoolId = null;
    this.selectedFromDate = null;
    this.selectedToDate = null;
  }
  setZoneDropdownValues(selectedStateValue) {
    if (selectedStateValue) {
      this.selectedStateObj = this.utilityService.filterDropdownValues(this.regionsData, 'state', selectedStateValue);
      this.zoneDropdownOptions = this.selectedStateObj.zones;
      this.onZoneChange(this.zonedropdown.selectedItem);
    }
  }
  onZoneChange(val) {
    this.selectedZone = val;
    this.resetZoneChange();
    if (val) {
      this.setDistrictDropdownValues(val);
    } else {
      this.resetZoneChange();
      this.triggerGetDetails(this.isLesson);
      this.resetData();
    }
  }
  resetZoneChange() {
    this.selectedDistrict = null;
    this.districtDropdownOptions = [];
    this.districtdropdown.selectedItem = null;
    this.selectedBlock = null;
    this.blockDropdownOptions = [];
    this.blockdropdown.selectedItem = null;
    this.selectedSchoolId = null;
    this.schoolDropdownOptions = [];
    this.schooldropdown.selectedItem = null;
  }
  setDistrictDropdownValues(selectedZoneValue) {
    if (selectedZoneValue) {
      this.selectedZoneObj = this.utilityService.filterDropdownValues(this.selectedStateObj.zones, 'name', selectedZoneValue);
      this.districtDropdownOptions = this.selectedZoneObj.districts;
      this.onDistrictChange(this.districtdropdown.selectedItem);
    }
  }
  onDistrictChange(val) {
    this.selectedDistrict = val;
    this.resetDistrictChange();
    if (val) {
      this.setBlockDropdownValues(val);
    } else {
      this.resetDistrictChange();
      this.triggerGetDetails(this.isLesson);
      this.resetData();
    }
  }
  resetDistrictChange() {
    this.selectedBlock = null;
    this.blockDropdownOptions = [];
    this.blockdropdown.selectedItem = null;
    this.selectedSchoolId = null;
    this.schoolDropdownOptions = [];
    this.schooldropdown.selectedItem = null;
  }
  setBlockDropdownValues(selectedDistrictValue) {
    if (selectedDistrictValue) {
      this.selectedDistrictObj = this.utilityService.filterDropdownValues(this.selectedZoneObj.districts, 'name', selectedDistrictValue);
      this.blockDropdownOptions = this.selectedDistrictObj.blocks;
      this.onBlockChange(this.blockdropdown.selectedItem);
    }
  }
  onBlockChange(val) {
    this.selectedBlock = val;
    this.resetBlockChange();
    if (val) {
      const filters = {
        state: this.selectedState,
        district: this.selectedDistrict,
        zone: this.selectedZone,
        block: this.selectedBlock
      };
      this.userManagementService.getSchoolList(true, filters).subscribe(res => {
        this.schools = res.data['results'];
        // Check if there are any schools available for the selected block
        if (this.schools.length === 0) {
          this.resetData();
        } else {
          // Populate the school dropdown with available schools
          this.schoolDropdownOptions = this.schools.map(school => ({
            _id: school._id,
            name: school.name
          }));
          // Automatically select the first school if options are available
          if (this.schoolDropdownOptions.length > 0) {
            this.onSchoolChange(this.schooldropdown.selectedItem);
          }
        }
      });
    } else {
      this.selectedSchoolId = null;
      this.schoolDropdownOptions = [];
      this.triggerGetDetails(this.isLesson);
      this.resetData();
    }
  }
  resetData() {
    this.userDataAvailable = false;
    this.subDataAvailable = false;
    this.mediumDataAvailable = false;
  }
  resetBlockChange() {
    this.schoolDropdownOptions = [];
    this.schooldropdown.selectedItem = null;
  }
  onSchoolChange(val) {
    const selectedSchool = this.schoolDropdownOptions.find(school => school._id === val);
    if (selectedSchool) {
      this.selectedSchoolName = selectedSchool.name; // Set the selected school name based on the selected ID
    }

    this.selectedSchoolId = val;
    this.triggerGetDetails(this.isLesson);
    if (!val) {
      this.resetData();
    }
  }
  validateDateRange() {
    if (this.selectedFromDate && this.selectedToDate) {
      const fromDate = new Date(this.selectedFromDate);
      const toDate = new Date(this.selectedToDate);
      if (fromDate > toDate) {
        this.utilityService.showError('From Date should be earlier than or equal to To Date');
        return false;
      }
      if (toDate < fromDate) {
        this.utilityService.showError('To Date should be later than or equal to From Date');
        return false;
      }
    }
    return true;
  }
  triggerGetDetails(isLesson) {
    const params = {
      state: this.selectedState,
      zone: this.selectedZone,
      district: this.selectedDistrict,
      block: this.selectedBlock,
      schoolId: this.selectedSchoolId,
      fromDate: this.selectedFromDate,
      toDate: this.selectedToDate
    };
    this.getDetails(isLesson, params);
  }
  onFrmDateSelection(event) {
    const input = event.target;
    this.selectedFromDate = input.value;
    if (this.selectedFromDate) {
      if (this.validateDateRange()) {
        this.triggerGetDetails(this.isLesson);
      }
    } else {
      this.selectedToDate = null;
      this.triggerGetDetails(this.isLesson);
    }
  }
  clearFrmDate() {
    this.selectedFromDate = null;
    this.triggerGetDetails(this.isLesson);
  }
  clearToDate() {
    this.selectedToDate = null;
    this.triggerGetDetails(this.isLesson);
  }
  onToDateSelection(event) {
    const input = event.target;
    this.selectedToDate = input.value;
    if (this.validateDateRange()) {
      this.triggerGetDetails(this.isLesson);
    } else {
      this.triggerGetDetails(this.isLesson);
    }
  }
  onPlanTypeChange(selectedValue) {
    this.selectedPlanType = selectedValue;
    this.isLesson = selectedValue === 'lesson';
    this.triggerGetDetails(this.isLesson);
  }
  getSelectedLocationLevel() {
    if (this.selectedSchoolId) {
      return 'by User';
    } else if (this.selectedBlock) {
      return 'by School';
    } else if (this.selectedDistrict) {
      return 'by Block';
    } else if (this.selectedZone) {
      return 'by District';
    } else if (this.selectedState) {
      return 'by Zone';
    } else {
      return 'by State';
    }
  }
  getDetails(isLesson, filtersOrSchoolId) {
    let schoolId;
    let filters = {};
    // Determine if the argument is a schoolId or a filters object
    if (typeof filtersOrSchoolId === 'string') {
      schoolId = filtersOrSchoolId;
    } else if (typeof filtersOrSchoolId === 'object') {
      filters = filtersOrSchoolId;
    }
    // If a schoolId is provided, clear the filters; otherwise, populate the filters
    if (schoolId) {
      filters = {};
    } else {
      filters = {
        state: filters.state || this.selectedState,
        zone: filters.zone || this.selectedZone,
        district: this.selectedDistrict,
        block: this.selectedBlock,
        schoolId: this.selectedSchoolId,
        fromDate: this.selectedFromDate,
        toDate: this.selectedToDate
      };
    }
    // Call the service method with isLesson, schoolId, and filters
    this.adminDashboardService.getData(isLesson, schoolId, filters).subscribe({
      next: res => {
        if (!res.success || !res.data) {
          this.utilityService.showError("Failed to load dashboard metrics.");
          this.resetData();
          return;
        }
        const data = res.data;
        this.updateUserChartData(data);
        this.userDataAvailable = this.byUserBarChartData?.datasets?.length > 0 && this.byUserBarChartData.datasets.some(dataset => dataset.data.length > 0);
        this.updateSubjectChartData(data);
        this.subDataAvailable = this.bySubjectBarChartData?.datasets?.length > 0 && this.bySubjectBarChartData.datasets.some(dataset => dataset.data.length > 0);
        this.updateMediumDonutChartData(data);
        this.mediumDataAvailable = this.byMediumDonutChartData?.datasets?.length > 0 && this.byMediumDonutChartData.datasets.some(dataset => dataset.data && dataset.data.length > 0 && dataset.data.some(count => count > 0));
        this.updateStatusDonutChartData(data);
        this.updateAvgFbScoreDonutChartData(data);
        this.avgScoreDataAvailable = this.avgFeedbackDonutChartData?.datasets?.length > 0 && this.avgFeedbackDonutChartData.datasets.some(dataset => dataset.data && dataset.data.length > 0 && dataset.data.some(count => count > 0));
        this.updateChatbotRequestsChartData(data);
        this.chatbotDataAvailable = this.chatbotRequestsBarChartData?.datasets?.length > 0 && this.chatbotRequestsBarChartData.datasets.some(dataset => dataset.data.length > 0);
        this.allUsersList = data.userCounts.allUsers;
        this.userMediumMetrics = data.userMediums;
        this.filterUsers(this.allUsersList, this.userMediumMetrics, this.selectedMedium);
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  capitalizeFirstLetter(label) {
    if (!label) return label;
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase();
  }
  /**
   * Lesson plan by User bar chart   *
   */
  updateUserChartData(data) {
    const labels = this.extractUserLabels(data);
    const dataset = this.createUserDataset(data);
    this.byUserBarChartData = {
      labels: labels,
      datasets: [dataset]
    };
  }
  extractUserLabels(data) {
    const labels = data.lessonPlanCount.map(item => item.name);
    return labels.map(this.capitalizeFirstLetter);
  }
  createUserDataset(data) {
    const numberOfUsers = data.lessonPlanCount.length;
    return {
      data: data.lessonPlanCount.map(item => item.lessonPlanCount),
      label: 'No. of Lesson Plans',
      backgroundColor: '#379AE6',
      hoverBackgroundColor: '#379AE6',
      borderColor: '#FFFFFF',
      categoryPercentage: 0.8,
      barPercentage: 0.6,
      ...(numberOfUsers < 6 && {
        barThickness: 50
      })
    };
  }
  /**
   * Lesson plan by subject bar chart   *
   */
  updateSubjectChartData(data) {
    const labels = this.extractSubLabels(data);
    const dataset = this.createSubDataset(data);
    this.bySubjectBarChartData = {
      labels: labels,
      datasets: [dataset]
    };
  }
  extractSubLabels(data) {
    if (!data?.lessonPlanCountBySubject || !Array.isArray(data.lessonPlanCountBySubject)) {
      return [];
    }
    const labels = data.lessonPlanCountBySubject.map(item => this.utilityService.getSubjectDisplayName(item.subject));
    return labels;
  }
  createSubDataset(data) {
    if (!data?.lessonPlanCountBySubject || !Array.isArray(data.lessonPlanCountBySubject)) {
      return {
        data: [],
        label: 'No. of Lesson Plans',
        backgroundColor: '#8353E2',
        hoverBackgroundColor: '#8353E2',
        borderColor: '#FFFFFF',
        categoryPercentage: 0.8,
        barPercentage: 0.6
      };
    }
    const numberOfRecords = data.lessonPlanCountBySubject.length;
    return {
      data: data.lessonPlanCountBySubject.map(item => item.lessonPlanCount),
      label: 'No. of Lesson Plans',
      backgroundColor: '#8353E2',
      hoverBackgroundColor: '#8353E2',
      borderColor: '#FFFFFF',
      categoryPercentage: 0.8,
      barPercentage: 0.6,
      ...(numberOfRecords < 6 && {
        barThickness: 50
      })
    };
  }
  /**
   * Lesson plan by Medium Donut chart   *
   */
  updateMediumDonutChartData(data) {
    const labels = ['Kannada', 'English'];
    const dataset = this.createMediumDataset(data);
    this.byMediumDonutChartData = {
      labels: labels,
      datasets: [dataset]
    };
  }
  createMediumDataset(data) {
    // Initialize the counts array with zeros for Kannada and English
    const counts = [0, 0];
    // Map medium names to index in the counts array
    const mediumMapping = {
      'Kannada': 0,
      'English': 1
    };
    // Loop through the mediumLessonPlanCount data and update the counts
    if (data?.lessonPlanCountByMedium && Array.isArray(data.lessonPlanCountByMedium)) {
      data.lessonPlanCountByMedium.forEach(item => {
        const mediumName = this.capitalizeFirstLetter(item.medium);
        const index = mediumMapping[mediumName];
        if (index !== undefined) {
          counts[index] = item.lessonPlanCount;
        }
      });
    }
    return {
      data: counts,
      backgroundColor: ['#ED7D2D', '#F9D8C0'],
      hoverBackgroundColor: ['#ED7D2D', '#F9D8C0'],
      borderColor: ['rgba(0, 0, 0, 0)'],
      borderWidth: 0
    };
  }
  /**
   * Active/inactive users Donut chart   *
   */
  updateStatusDonutChartData(data) {
    const counts = data?.userCounts?.userCounts;
    const active = counts?.activeUsers ?? 0;
    const inactive = counts?.inactiveUsers ?? 0;
    const labels = ['Active Users', 'Inactive Users'];
    const dataset = this.createStatusDataset(data);
    this.statusDonutChartData = {
      labels: labels,
      datasets: [dataset]
    };
    this.allUsersCount = active + inactive;
    this.activeUsersCount = active;
    this.inactiveUsersCount = inactive;
    this.statusDataAvailable = this.activeUsersCount > 0 || this.inactiveUsersCount > 0;
  }
  createStatusDataset(data) {
    const counts = data?.userCounts?.userCounts;
    return {
      data: [counts?.activeUsers ?? 0, counts?.inactiveUsers ?? 0],
      backgroundColor: ['#46A0F1', '#E5696D'],
      hoverBackgroundColor: ['#46A0F1', '#E5696D'],
      borderColor: ['rgba(0, 0, 0, 0)'],
      borderWidth: 0,
      label: 'User Status'
    };
  }
  filterUsers(allUsersList, userMediumMetrics, medium) {
    if (medium === 'all') {
      this.filteredUsersList = allUsersList;
    } else {
      const mediumData = userMediumMetrics.find(m => m.medium === medium);
      this.filteredUsersList = mediumData ? mediumData.users : [];
    }
  }
  setMedium(medium) {
    this.selectedMedium = medium;
    this.filterUsers(this.allUsersList, this.userMediumMetrics, this.selectedMedium);
  }
  navigateToUserMgmt(selectedSchoolId) {
    this.route.navigate(['/teacher-management/list']);
  }
  /**
   * Average score Donut chart   *
   */
  updateAvgFbScoreDonutChartData(data) {
    const labels = ["Very good", "Needs improvement", "Doesn't meet requirement"];
    const dataset = this.createAvgFbDataset(data);
    this.avgFeedbackDonutChartData = {
      labels: labels,
      datasets: [dataset]
    };
  }
  createAvgFbDataset(data) {
    // Initialize the count array with zeros for the three categories
    const counts = [0, 0, 0];
    // Map feedback text to index in the counts array
    const feedbackMapping = {
      'Very good to use in the classroom': 0,
      'Needs some improvement to use in the classroom': 1,
      'Does not meet the requirements to use it in the classroom.': 2 // Below Average
    };
    // Loop through the feedback data and update the counts
    if (data?.feedbackCount && Array.isArray(data.feedbackCount)) {
      data.feedbackCount.forEach(item => {
        const index = feedbackMapping[item._id];
        if (index !== undefined) {
          counts[index] = item.count;
        }
      });
    }
    return {
      data: counts,
      backgroundColor: ['#379AE6', '#82c2f3', '#C3E1F8'],
      hoverBackgroundColor: ['#379AE6', '#82c2f3', '#C3E1F8'],
      borderColor: ['rgba(0, 0, 0, 0)'],
      borderWidth: 0
    };
  }
  /**
   * chatbot requests bar chart   *
   */
  updateChatbotRequestsChartData(data) {
    const labels = this.extractChatbotRequestsLabels(data);
    const eduChatDataset = this.createChatbotRequestsDataset(data);
    const lessonChatDataset = this.createLessonChatRequestsDataset(data);
    this.chatbotRequestsBarChartData = {
      labels: labels,
      datasets: [eduChatDataset, lessonChatDataset]
    };
  }
  extractChatbotRequestsLabels(data) {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    if (!data?.botRequestCount || !Array.isArray(data.botRequestCount) || data.botRequestCount.length === 0) {
      return [];
    }
    const labels = data.botRequestCount.map(item => {
      const [year, month] = item.month.split("-");
      const monthIndex = parseInt(month) - 1; // Convert month to zero-based index
      return `${monthNames[monthIndex]} ${year}`;
    });
    return labels;
  }
  createChatbotRequestsDataset(data) {
    if (!data?.botRequestCount || !Array.isArray(data.botRequestCount)) {
      return {
        data: [],
        label: 'Edu Chat',
        backgroundColor: '#379AE6',
        hoverBackgroundColor: '#379AE6',
        borderColor: '#FFFFFF',
        barPercentage: 0.8,
        categoryPercentage: 0.5
      };
    }
    return {
      data: data.botRequestCount.map(item => item.requestCount),
      label: 'Edu Chat',
      backgroundColor: '#379AE6',
      hoverBackgroundColor: '#379AE6',
      borderColor: '#FFFFFF',
      barPercentage: 0.8,
      categoryPercentage: 0.5
    };
  }
  createLessonChatRequestsDataset(data) {
    if (!data?.lessonbotRequestCount || !Array.isArray(data.lessonbotRequestCount)) {
      return {
        data: [],
        label: 'Lesson Chat',
        backgroundColor: '#ED7D2D',
        hoverBackgroundColor: '#ED7D2D',
        borderColor: '#FFFFFF',
        barPercentage: 0.8,
        categoryPercentage: 0.5
      };
    }
    return {
      data: data.lessonbotRequestCount.map(item => item.requestCount),
      label: 'Lesson Chat',
      backgroundColor: '#ED7D2D',
      hoverBackgroundColor: '#ED7D2D',
      borderColor: '#FFFFFF',
      barPercentage: 0.8,
      categoryPercentage: 0.5
    };
  }
  areFiltersSelected() {
    // Check if all required filters are selected
    return this.selectedState != null;
  }
  exportDashboardDataToExcel() {
    const workbook = new exceljs__WEBPACK_IMPORTED_MODULE_1__.Workbook();
    const worksheet = workbook.addWorksheet('Dashboard Data');
    let rowIndex = 1;
    // Add main heading
    this.addMainHeading(worksheet, 'Dashboard', rowIndex, 18);
    // Merge cells in the row below the main heading
    rowIndex += 1; // Move to the row after the main heading and add a blank row
    worksheet.mergeCells(rowIndex, 1, rowIndex, 8); // Adjust the column range as needed
    // Move to the next row after merging cells
    rowIndex += 1;
    // Add filters row
    rowIndex = this.addFiltersRow(worksheet, rowIndex);
    // Merge cells in the row after filters
    worksheet.mergeCells(rowIndex, 1, rowIndex, 8);
    // Move to the next row after merging cells
    rowIndex += 1;
    // Get the selected plan type from the dropdown (assuming this is a property on the component)
    const selectedPlanType = this.selectedPlanType; // Either 'Lesson' or 'Resource'
    // Add sections side by side
    rowIndex = this.addSectionsSideBySide(worksheet, rowIndex, selectedPlanType);
    // Apply borders to the entire report based on the actual data
    this.applyFullBorder(worksheet);
    // Apply column widths
    this.setColumnWidths(worksheet);
    // Save the workbook
    workbook.xlsx.writeBuffer().then(buffer => {
      const blob = new Blob([buffer], {
        type: EXCEL_TYPE
      });
      (0,file_saver__WEBPACK_IMPORTED_MODULE_2__.saveAs)(blob, 'dashboard_data.xlsx');
      this.utilityService.showSuccess('Report has been downloaded successfully.');
    }).catch(error => {
      this.utilityService.showError(error);
    });
  }
  addSectionsSideBySide(worksheet, rowIndex, selectedPlanType) {
    const columnOffsets = [1, 3, 5];
    // Determine the label based on the selected dropdown filter
    let filterLabel = 'State';
    if (this.selectedSchoolId) {
      filterLabel = 'User';
    } else if (this.selectedBlock) {
      filterLabel = 'School';
    } else if (this.selectedDistrict) {
      filterLabel = 'Taluk';
    } else if (this.selectedZone) {
      filterLabel = 'District';
    } else if (this.selectedState) {
      filterLabel = 'Zone';
    }
    // Determine the number label based on the selected plan type
    const numberLabel = selectedPlanType === 'lesson' ? 'No. of Lesson Plans' : 'No. of Lesson Resources';
    // Define the sections based on the selected plan type and filter label
    const sections = selectedPlanType === 'lesson' ? [{
      title: `Lesson Plans by ${filterLabel}`,
      data: this.byUserBarChartData,
      subHeading1: filterLabel,
      subHeading2: numberLabel
    }, {
      title: 'Lesson Plans by Subject',
      data: this.bySubjectBarChartData,
      subHeading1: 'Subject',
      subHeading2: numberLabel
    }, {
      title: 'Lesson Plans by Medium',
      data: this.byMediumDonutChartData,
      subHeading1: 'Medium',
      subHeading2: numberLabel
    }] : [{
      title: `Lesson Resources by ${filterLabel}`,
      data: this.byUserBarChartData,
      subHeading1: filterLabel,
      subHeading2: numberLabel
    }, {
      title: 'Lesson Resources by Subject',
      data: this.bySubjectBarChartData,
      subHeading1: 'Subject',
      subHeading2: numberLabel
    }, {
      title: 'Lesson Resources by Medium',
      data: this.byMediumDonutChartData,
      subHeading1: 'Medium',
      subHeading2: numberLabel
    }];
    // Add the first group of sections
    sections.forEach((section, index) => {
      this.addSectionToSheet(worksheet, section.title, section.data, [section.subHeading1, section.subHeading2],
      // Second subheading (e.g., No. of Lesson Plans or No. of Lesson Resources)
      rowIndex, columnOffsets[index], true);
    });
    const firstGroupMaxRows = Math.max(...sections.map(section => this.getRowsUsedForSection(section.data)));
    const nextRowIndex = rowIndex + firstGroupMaxRows + 2;
    this.addMainHeading(worksheet, 'All Users Info', nextRowIndex, 14);
    // Merge cells in the row below 'All Users Info' heading
    const allUsersInfoRowIndex = nextRowIndex + 1;
    worksheet.mergeCells(allUsersInfoRowIndex, 1, allUsersInfoRowIndex, 8);
    // Move to the next row after merging cells
    const secondGroupStartRowIndex = allUsersInfoRowIndex + 1;
    const secondSections = [{
      title: 'Users Status Data',
      data: this.statusDonutChartData,
      subHeading1: 'User Status',
      subHeading2: 'No. of Users'
    }, {
      title: 'Avg Feedback Data',
      data: this.avgFeedbackDonutChartData,
      subHeading1: 'Feedback Level',
      subHeading2: 'Feedback Score'
    }, {
      title: 'Chatbot Requests Data',
      data: this.chatbotRequestsBarChartData,
      subHeading1: 'Month',
      subHeading2: 'No. of Edu chat',
      subHeading3: 'No. of Lesson chat'
    }];
    // Add the second group of sections
    secondSections.forEach((section, index) => {
      const headings = [section.subHeading1, section.subHeading2];
      if (section.subHeading3) {
        headings.push(section.subHeading3);
      }
      this.addSectionToSheet(worksheet, section.title, section.data, headings, secondGroupStartRowIndex, columnOffsets[index], true);
    });
    const secondGroupMaxRows = Math.max(...secondSections.map(section => this.getRowsUsedForSection(section.data)));
    return secondGroupStartRowIndex + secondGroupMaxRows;
  }
  getRowsUsedForSection(chartData) {
    return chartData.labels && chartData.labels.length > 0 ? chartData.labels.length + 3 : 4; // Rows for title, headers, and data
  }

  setColumnWidths(worksheet) {
    worksheet.columns = [{
      width: 25
    }, {
      width: 25
    }, {
      width: 25
    }, {
      width: 25
    }, {
      width: 25
    }, {
      width: 25
    }, {
      width: 20
    }, {
      width: 20
    }];
  }
  addSectionToSheet(worksheet, sectionTitle, chartData, headingLabels, startRowIndex, startColumnIndex, mergeCells = false) {
    let rowIndex = startRowIndex;
    let colIndex = startColumnIndex;
    // Add section title
    const titleCell = worksheet.getCell(rowIndex, colIndex);
    titleCell.value = sectionTitle;
    titleCell.font = {
      bold: true,
      size: 14
    };
    titleCell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: {
        argb: 'FFFF00'
      }
    };
    titleCell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    if (mergeCells) {
      worksheet.mergeCells(rowIndex, colIndex, rowIndex, colIndex + (headingLabels.length - 1));
    }
    worksheet.getRow(rowIndex).height = 25;
    rowIndex += 1;
    // Add custom headers with background color
    const headerRow = worksheet.getRow(rowIndex);
    const headers = headingLabels;
    headers.forEach((header, i) => {
      const cell = worksheet.getCell(rowIndex, colIndex + i);
      cell.value = header;
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: 'D3D3D3'
        }
      };
    });
    headerRow.font = {
      bold: true
    };
    headerRow.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    rowIndex += 1;
    // Add data rows
    if (chartData.labels && chartData.labels.length > 0) {
      chartData.labels.forEach((label, index) => {
        worksheet.getCell(rowIndex, colIndex).value = label;
        for (let j = 0; j < chartData.datasets.length; j++) {
          worksheet.getCell(rowIndex, colIndex + j + 1).value = chartData.datasets[j].data[index] ?? 0;
        }
        rowIndex += 1;
      });
    } else {
      worksheet.getCell(rowIndex, colIndex).value = 'No Data';
      worksheet.getCell(rowIndex, colIndex + 1).value = 0;
      rowIndex += 1;
    }
    // Add a blank row for separation
    rowIndex += 1;
    // Apply table formatting (assuming you have this method)
    this.applyTableFormatting(worksheet, startRowIndex, rowIndex);
    return rowIndex;
  }
  applyTableFormatting(worksheet, startRowIndex, endRowIndex) {
    const headerRow = worksheet.getRow(startRowIndex);
    headerRow.font = {
      bold: true
    };
    headerRow.alignment = {
      horizontal: 'center',
      vertical: 'middle'
    };
    for (let rowIndex = startRowIndex + 1; rowIndex < endRowIndex; rowIndex++) {
      const row = worksheet.getRow(rowIndex);
      row.alignment = {
        horizontal: 'center'
      };
    }
  }
  addMainHeading(worksheet, heading, rowIndex, fontSize = 16) {
    worksheet.getCell(rowIndex, 1).value = heading;
    worksheet.getCell(rowIndex, 1).font = {
      bold: true,
      size: fontSize
    };
    worksheet.getCell(rowIndex, 1).alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
    worksheet.mergeCells(rowIndex, 1, rowIndex, 8); // Merge cells for the main heading
    worksheet.getRow(rowIndex).height = 30; // You can adjust the height as needed
  }

  addFiltersRow(worksheet, rowIndex) {
    // Define filters
    const filters = {
      state: this.selectedState ? this.selectedState : 'Overall',
      zone: this.selectedZone ? this.selectedZone : '-',
      district: this.selectedDistrict ? this.selectedDistrict : '-',
      taluk: this.selectedBlock ? this.selectedBlock : '-',
      school: this.selectedSchoolName ? this.selectedSchoolName : '-',
      planType: this.selectedPlanType === 'lesson' ? 'Lesson Plan' : this.selectedPlanType === 'resource' ? 'Resource Plan' : '-',
      from: this.selectedFromDate ? this.formatDate(this.selectedFromDate) : '-',
      to: this.selectedToDate ? this.formatDate(this.selectedToDate) : '-'
    };
    let columnIndex = 1;
    // Define background color for filter headings
    const headingColor = 'FFFF00'; // Yellow background
    // Add filter labels and values horizontally
    ['state', 'zone', 'district', 'taluk', 'school', 'planType', 'from', 'to'].forEach(filter => {
      const headingCell = worksheet.getCell(rowIndex, columnIndex);
      headingCell.value = filter.charAt(0).toUpperCase() + filter.slice(1); // Capitalize first letter
      headingCell.font = {
        bold: true
      };
      headingCell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: {
          argb: headingColor
        }
      };
      headingCell.border = {
        top: {
          style: 'thin',
          color: {
            argb: '000000'
          }
        },
        left: {
          style: 'thin',
          color: {
            argb: '000000'
          }
        },
        bottom: {
          style: 'thin',
          color: {
            argb: '000000'
          }
        },
        right: {
          style: 'thin',
          color: {
            argb: '000000'
          }
        }
      };
      headingCell.alignment = {
        horizontal: 'center'
      };
      const valueCell = worksheet.getCell(rowIndex + 1, columnIndex);
      valueCell.value = filters[filter];
      valueCell.border = {
        top: {
          style: 'thin',
          color: {
            argb: '000000'
          }
        },
        left: {
          style: 'thin',
          color: {
            argb: '000000'
          }
        },
        bottom: {
          style: 'thin',
          color: {
            argb: '000000'
          }
        },
        right: {
          style: 'thin',
          color: {
            argb: '000000'
          }
        }
      };
      valueCell.alignment = {
        horizontal: 'center'
      };
      columnIndex++;
    });
    // Increment rowIndex to account for the filters row and the blank row
    rowIndex += 1;
    return ++rowIndex;
  }
  applyFullBorder(worksheet) {
    const lastRow = worksheet.lastRow?.number || 1;
    const lastColumn = worksheet.columns.length;
    for (let rowIndex = 1; rowIndex <= lastRow; rowIndex++) {
      for (let colIndex = 1; colIndex <= lastColumn; colIndex++) {
        const cell = worksheet.getCell(rowIndex, colIndex);
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
      }
    }
  }
  static {
    this.ɵfac = function DashboardComponent_Factory(t) {
      return new (t || DashboardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_7__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_3__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_7__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_user_management_user_management_service__WEBPACK_IMPORTED_MODULE_5__.UserManagementService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_admin_dashboard_service__WEBPACK_IMPORTED_MODULE_6__.AdminDashboardService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
      type: DashboardComponent,
      selectors: [["app-dashboard"]],
      viewQuery: function DashboardComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c0, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c1, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c2, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c3, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c4, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c5, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.statedropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.zonedropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.districtdropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.blockdropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.schooldropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.plantypedropdown = _t.first);
        }
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵStandaloneFeature"]],
      decls: 111,
      vars: 58,
      consts: [[1, "mb-0", "lg:mb-4", "p-4", "lg:p-0", "pb-0"], [1, "text-xl", "text-content", "md:text-3xl", "font-bold", "mb-3"], [1, "px-6", "py-8", "rounded", "bg-white", "border"], [1, "flex", "items-center", "justify-between"], [1, "flex", "items-center", "justify-start"], ["src", "assets/icons/dashboard.svg", "alt", ""], [1, "ms-2", "text-content", "md:text-2xl", "font-bold"], [1, "btn-primary", "h-9", "py-2", "px-5", 3, "click"], [1, "flex", "content-center"], ["width", "18", "src", "assets/icons/download-2.svg", "alt", ""], [1, "ml-[6px]", "text-nowrap"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "xl:grid-cols-4", "2xl:grid-cols-8", "gap-3", "mt-5", "items-end"], [1, "w-full", "min-w-0", "cursor-pointer"], [3, "dropDownValues", "config", "valueUpdate"], ["stateDropDown", ""], [3, "dropDownValues", "config", "valueCleared", "valueUpdate"], ["zoneDropDown", ""], ["districtDropDown", ""], ["blockDropDown", ""], ["schoolDropDown", ""], ["planTypeDropDown", ""], [1, "relative", "flex-col", "min-w-0"], ["for", "fromDateInput", 1, "form-control-label"], [1, "relative"], ["id", "fromDateInput", "aria-label", "From date", "type", "date", "name", "fromDate", 1, "form-control", "h-[35px]", "pr-3", "pl-2", 3, "ngModel", "ngModelChange", "change"], ["type", "button", "class", "absolute inset-y-0 right-6 flex items-center pr-3 cursor-pointer", 3, "click", 4, "ngIf"], ["for", "toDateInput", 1, "form-control-label"], ["id", "toDateInput", "aria-label", "To date", "type", "date", "name", "toDate", 1, "form-control", "h-[35px]", "pr-3", "pl-2", 3, "ngModel", "ngModelChange", "change"], [1, ""], ["noData", ""], ["nodonutData", ""], [1, "canvas-container", "overflow-x-auto", "h-fit", "mt-8", "bg-[#EBFDFF]", "py-7", "px-6", "rounded-xl", "border"], [1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-lg", "text-content", "font-bold"], ["class", "flex items-center justify-center", 4, "ngIf"], [1, "chartWrapper"], [3, "ngClass", 4, "ngIf", "ngIfElse"], [1, "grid", "grid-cols-1", "md:grid-cols-[1fr_25%]", "gap-4", "mt-4"], [1, "canvas-container", "h-fit", "bg-[#F5F2FD]", "py-7", "px-6", "rounded-xl", "border"], [1, "flex", "justify-between", "items-center", "mb-5"], [1, "text-lg", "text-content", "font-bold", "mb-6"], [4, "ngIf", "ngIfElse"], [1, "canvas-container", "h-fit", "bg-[#FFF4E5]", "py-7", "px-6", "rounded-xl", "border"], [1, "px-4", "md:px-6", "py-6", "md:py-8", "mt-3", "rounded", "bg-white", "border"], [1, "grid", "grid-cols-1", "md:grid-cols-10", "gap-4"], [1, "col-span-1", "md:col-span-3", "canvas-container", "flex30", "mt-4", "md:mt-8", "bg-white", "py-6", "md:py-7", "px-4", "md:px-6", "rounded-xl", "border", "flex-1"], [1, "relative", "flex", "justify-center", "items-center"], [1, "col-span-1", "md:col-span-7", "mt-4", "md:mt-8", "bg-white", "py-6", "md:py-7", "px-4", "md:px-6", "rounded-xl", "border", "flex-1"], [1, "flex", "flex-wrap", "justify-between", "items-center", "gap-3", "mb-5"], ["class", "text-primary bg-[#F1F8FE] p-3 rounded", 3, "click", 4, "ngIf"], [1, "flex", "flex-wrap", "gap-x-4", "gap-y-2", "text-content"], [1, "cursor-pointer", 3, "click"], ["class", "mt-5", 4, "ngIf", "ngIfElse"], ["notableData", ""], [1, "grid", "grid-cols-1", "md:grid-cols-10", "gap-4", "mt-4"], [1, "col-span-1", "md:col-span-3", "canvas-container", "h-fit", "bg-white", "py-6", "md:py-7", "px-4", "md:px-6", "rounded-xl", "border"], [1, "col-span-1", "md:col-span-7", "canvas-container", "bg-white", "py-6", "md:py-7", "px-4", "md:px-6", "rounded-xl", "border", "h-full", "flex", "flex-col"], ["type", "button", 1, "absolute", "inset-y-0", "right-6", "flex", "items-center", "pr-3", "cursor-pointer", 3, "click"], ["width", "10", "fill", "#6E7787", "viewBox", "0 0 16 16", 1, "bi", "bi-x"], ["d", "M1.5 1.5a.75.75 0 0 1 1.061 0L8 6.439 13.439 1.5a.75.75 0 1 1 1.061 1.061L9.061 8l5.439 5.439a.75.75 0 0 1-1.061 1.061L8 9.061 2.561 14.5a.75.75 0 0 1-1.061-1.061L6.939 8 1.5 2.561a.75.75 0 0 1 0-1.061z"], [1, "flex", "flex-col", "justify-center", "items-center", "h-[400px]"], ["width", "80", "src", "assets/icons/three-bars-chart-svgrepo-com.svg", "alt", ""], [1, "text-content-60", "mt-2"], ["width", "100", "src", "assets/icons/donut-chart-svgrepo-com.svg", "alt", ""], [1, "text-content-60"], [1, "flex", "items-center", "justify-center"], [1, "w-4", "h-4", "bg-[#379AE6]", "rounded-full", "me-1"], [1, "!text-[14px]", "text-content"], [3, "ngClass"], ["baseChart", "", "height", "400px", "role", "img", "aria-label", "Bar chart showing lesson plans by location level", 3, "data", "options", "plugins", "legend", "type"], [1, "w-4", "h-4", "bg-[#8353E2]", "rounded-full", "me-1"], ["baseChart", "", "height", "400px", "role", "img", "aria-label", "Bar chart showing lesson plans by subject", 1, "subCanvas", 3, "data", "options", "plugins", "legend", "type"], ["baseChart", "", "role", "img", "aria-label", "Doughnut chart showing lesson plans by medium", 3, "data", "options", "plugins", "legend", "type"], ["baseChart", "", "height", "315", "width", "315", "role", "img", "aria-label", "Doughnut chart showing active and inactive users", 3, "data", "options", "plugins", "legend", "type"], [1, "absolute", "top-[60%]", "left-1/2", "transform", "-translate-x-1/2", "-translate-y-1/2", "text-center"], [1, "text-[20px]", "font-bold"], [1, "text-primary", "bg-[#F1F8FE]", "p-3", "rounded", 3, "click"], [1, "mt-5"], [1, "space-y-3", "md:hidden"], ["class", "rounded-xl border p-4 bg-shade-50", 4, "ngFor", "ngForOf"], [1, "hidden", "md:block", "overflow-x-auto", "overflow-y-hidden", "h-[260px]"], [1, "min-w-full"], [1, "bg-primary-60", "rounded-lg", "border-b"], ["class", "text-left p-4 rounded text-sm text-content", 4, "ngFor", "ngForOf"], [1, "bg-white", "divide-y", "divide-gray-200"], [4, "ngFor", "ngForOf"], [1, "rounded-xl", "border", "p-4", "bg-shade-50"], [1, "flex", "items-start", "gap-3"], ["src", "assets/icons/profile.svg", "alt", "Profile Pic", 1, "w-10", "h-10", "rounded-full", "shrink-0"], [1, "min-w-0", "flex-1"], [1, "flex", "flex-wrap", "items-center", "justify-between", "gap-2"], [1, "font-bold", "text-content", "break-words"], [1, "px-3", "py-0.5", "sm:py-1", "rounded-full", "text-sm", 3, "ngClass"], ["class", "text-sm text-content-60 mt-2 break-words", 4, "ngIf"], [1, "text-sm", "text-content-60", "mt-2", "break-words"], [1, "text-left", "p-4", "rounded", "text-sm", "text-content"], [1, "px-4", "py-2", "whitespace-nowrap", "flex", "items-center", "space-x-4", "w-[15rem]"], ["src", "assets/icons/profile.svg", "alt", "Profile Pic", 1, "w-12", "h-12", "rounded-full"], [1, "font-bold"], [1, "px-4", "py-2", "whitespace-nowrap", "w-[24rem]"], [4, "ngIf"], [1, "px-4", "py-2", "whitespace-nowrap", "w-[9rem]"], [1, "px-3", "py-2", "rounded-full", 3, "ngClass"], [1, "flex", "justify-center", "items-center", "h-[280px]", "mt-5"], ["baseChart", "", "role", "img", "aria-label", "Doughnut chart showing average feedback score on generated content", 3, "data", "options", "plugins", "legend", "type"], ["baseChart", "", "height", "400px", "role", "img", "aria-label", "Bar chart showing number of requests made to the chatbot", 1, "chatbotCanvas", 3, "data", "options", "plugins", "legend", "type"]],
      template: function DashboardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0)(1, "h1", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, " Dashboard ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "div", 2)(4, "div", 3)(5, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](6, "img", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "h2", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8, "Overview");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardComponent_Template_button_click_9_listener() {
            return ctx.exportDashboardDataToExcel();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](11, "img", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](12, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](13);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](14, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](15, "div", 11)(16, "div", 12)(17, "app-common-dropdown", 13, 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("valueUpdate", function DashboardComponent_Template_app_common_dropdown_valueUpdate_17_listener($event) {
            return ctx.onStateChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "div", 12)(20, "app-common-dropdown", 15, 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("valueCleared", function DashboardComponent_Template_app_common_dropdown_valueCleared_20_listener() {
            return ctx.resetData();
          })("valueUpdate", function DashboardComponent_Template_app_common_dropdown_valueUpdate_20_listener($event) {
            return ctx.onZoneChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](22, "div", 12)(23, "app-common-dropdown", 15, 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("valueCleared", function DashboardComponent_Template_app_common_dropdown_valueCleared_23_listener() {
            return ctx.resetData();
          })("valueUpdate", function DashboardComponent_Template_app_common_dropdown_valueUpdate_23_listener($event) {
            return ctx.onDistrictChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](25, "div", 12)(26, "app-common-dropdown", 15, 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("valueCleared", function DashboardComponent_Template_app_common_dropdown_valueCleared_26_listener() {
            return ctx.resetData();
          })("valueUpdate", function DashboardComponent_Template_app_common_dropdown_valueUpdate_26_listener($event) {
            return ctx.onBlockChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](28, "div", 12)(29, "app-common-dropdown", 15, 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("valueCleared", function DashboardComponent_Template_app_common_dropdown_valueCleared_29_listener() {
            return ctx.resetData();
          })("valueUpdate", function DashboardComponent_Template_app_common_dropdown_valueUpdate_29_listener($event) {
            return ctx.onSchoolChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](31, "div", 12)(32, "app-common-dropdown", 13, 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("valueUpdate", function DashboardComponent_Template_app_common_dropdown_valueUpdate_32_listener($event) {
            return ctx.onPlanTypeChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](34, "div", 21)(35, "label", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](36, "From");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](37, "div", 23)(38, "input", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function DashboardComponent_Template_input_ngModelChange_38_listener($event) {
            return ctx.selectedFromDate = $event;
          })("change", function DashboardComponent_Template_input_change_38_listener($event) {
            return ctx.onFrmDateSelection($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](39, DashboardComponent_button_39_Template, 3, 0, "button", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](40, "div", 21)(41, "label", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](42, "To");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](43, "div", 23)(44, "input", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("ngModelChange", function DashboardComponent_Template_input_ngModelChange_44_listener($event) {
            return ctx.selectedToDate = $event;
          })("change", function DashboardComponent_Template_input_change_44_listener($event) {
            return ctx.onToDateSelection($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](45, DashboardComponent_button_45_Template, 3, 0, "button", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](46, "div", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](47, DashboardComponent_ng_template_47_Template, 4, 0, "ng-template", null, 29, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](49, DashboardComponent_ng_template_49_Template, 4, 0, "ng-template", null, 30, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](51, "div", 31)(52, "div", 32)(53, "h2", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](54);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](55, DashboardComponent_div_55_Template, 4, 1, "div", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](56, "div", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](57, DashboardComponent_div_57_Template, 2, 8, "div", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](58, "div", 37)(59, "div", 38)(60, "div", 39)(61, "h2", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](62);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](63, DashboardComponent_div_63_Template, 4, 1, "div", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](64, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](65, DashboardComponent_div_65_Template, 2, 5, "div", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](66, "div", 42)(67, "div", 39)(68, "h2", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](69);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](70, DashboardComponent_div_70_Template, 2, 5, "div", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](71, "div", 43)(72, "h2", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](73, "All Users Info");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](74, "div", 44)(75, "div", 45)(76, "div", 39)(77, "h2", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](78);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](79, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](80, "div", 46);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](81, DashboardComponent_div_81_Template, 5, 7, "div", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](82, "div", 47)(83, "div", 48)(84, "h2", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](85);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](86, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](87, DashboardComponent_button_87_Template, 2, 0, "button", 49);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](88, "div", 50)(89, "p", 51);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardComponent_Template_p_click_89_listener() {
            return ctx.setMedium("all");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](90, "All");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](91, "p", 51);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardComponent_Template_p_click_91_listener() {
            return ctx.setMedium("english");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](92, "English Medium");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](93, "p", 51);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardComponent_Template_p_click_93_listener() {
            return ctx.setMedium("kannada");
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](94, "Kannada Medium");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](95, DashboardComponent_div_95_Template, 12, 11, "div", 52);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](96, DashboardComponent_ng_template_96_Template, 3, 0, "ng-template", null, 53, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](98, "div", 54)(99, "div", 55)(100, "div", 39)(101, "h2", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](102);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](103, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](104, DashboardComponent_div_104_Template, 2, 5, "div", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](105, "div", 56)(106, "div", 39)(107, "h2", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](108);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](109, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](110, DashboardComponent_div_110_Template, 2, 5, "div", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](48);
          const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](50);
          const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](97);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](13);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](14, 48, "Download Report"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("dropDownValues", ctx.stateDropdownOptions)("config", ctx.stateDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("dropDownValues", ctx.zoneDropdownOptions)("config", ctx.zoneDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("dropDownValues", ctx.districtDropdownOptions)("config", ctx.districtDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("dropDownValues", ctx.blockDropdownOptions)("config", ctx.blockDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("dropDownValues", ctx.schoolDropdownOptions)("config", ctx.schoolDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("dropDownValues", ctx.planTypeDropdownOptions)("config", ctx.planTypeDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx.selectedFromDate);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.selectedFromDate);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngModel", ctx.selectedToDate);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.selectedToDate);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"](" ", ctx.selectedPlanType === "lesson" ? "Lesson Plans" : "Lesson Resources", " ", ctx.getSelectedLocationLevel(), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.userDataAvailable);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.userDataAvailable)("ngIfElse", _r8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx.selectedPlanType === "lesson" ? "Lesson Plans" : "Lesson Resources", " by Subject ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.subDataAvailable);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.subDataAvailable)("ngIfElse", _r8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", ctx.selectedPlanType === "lesson" ? "Lesson Plans" : "Lesson Resources", " by Medium ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.mediumDataAvailable)("ngIfElse", _r10);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](79, 50, "Active/Inactive"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.statusDataAvailable)("ngIfElse", _r10);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](86, 52, "Activity"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.filteredUsersList.length >= 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("text-primary", ctx.selectedMedium === "all");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("text-primary", ctx.selectedMedium === "english");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵclassProp"]("text-primary", ctx.selectedMedium === "kannada");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.filteredUsersList.length > 0)("ngIfElse", _r20);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](103, 54, "Average Feedback Score on the Generated Content"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.avgScoreDataAvailable)("ngIfElse", _r10);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](109, 56, "Number of requests made to the Chatbot"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.chatbotDataAvailable)("ngIfElse", _r8);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_9__.SlicePipe, _angular_common__WEBPACK_IMPORTED_MODULE_9__.TitleCasePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__.TranslatePipe, ng2_charts__WEBPACK_IMPORTED_MODULE_11__.NgChartsModule, ng2_charts__WEBPACK_IMPORTED_MODULE_11__.BaseChartDirective, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_0__.CommonDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgModel],
      styles: ["p[_ngcontent-%COMP%] {\n  font-size: inherit;\n}\n\n.flex30[_ngcontent-%COMP%] {\n  flex: 0 0 30%;\n}\n\n.canvas-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  position: relative;\n  height: auto;\n}\n.canvas-container[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: 100%;\n}\n.canvas-container[_ngcontent-%COMP%]   .chartWrapper[_ngcontent-%COMP%] {\n  position: relative;\n  overflow-x: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNDLGtCQUFBO0FBQ0Q7O0FBRUE7RUFDQyxhQUFBO0FBQ0Q7O0FBRUE7RUFDQyxXQUFBO0VBQ0EsZUFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtBQUNEO0FBQ0M7RUFDQyxjQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUFDRjtBQUVDO0VBQ0Msa0JBQUE7RUFDQSxnQkFBQTtBQUFGIiwiZmlsZSI6ImRhc2hib2FyZC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbInAge1xuXHRmb250LXNpemU6IGluaGVyaXQ7XG59XG5cbi5mbGV4MzAge1xuXHRmbGV4OiAwIDAgMzAlO1xufVxuXG4uY2FudmFzLWNvbnRhaW5lciB7XG5cdHdpZHRoOiAxMDAlO1xuXHRtYXgtd2lkdGg6IDEwMCU7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0aGVpZ2h0OiBhdXRvO1xuXG5cdGNhbnZhcyB7XG5cdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0d2lkdGg6IDEwMCU7XG5cdFx0aGVpZ2h0OiAxMDAlO1xuXHR9XG5cblx0LmNoYXJ0V3JhcHBlciB7XG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdG92ZXJmbG93LXg6IGF1dG87XHRcdFxuXHR9XG5cbn0iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi9kYXNoYm9hcmQvZGFzaGJvYXJkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Msa0JBQUE7QUFDRDs7QUFFQTtFQUNDLGFBQUE7QUFDRDs7QUFFQTtFQUNDLFdBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7RUFDQSxZQUFBO0FBQ0Q7QUFDQztFQUNDLGNBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQUNGO0FBRUM7RUFDQyxrQkFBQTtFQUNBLGdCQUFBO0FBQUY7QUFDQSxnM0JBQWczQiIsInNvdXJjZXNDb250ZW50IjpbInAge1xuXHRmb250LXNpemU6IGluaGVyaXQ7XG59XG5cbi5mbGV4MzAge1xuXHRmbGV4OiAwIDAgMzAlO1xufVxuXG4uY2FudmFzLWNvbnRhaW5lciB7XG5cdHdpZHRoOiAxMDAlO1xuXHRtYXgtd2lkdGg6IDEwMCU7XG5cdHBvc2l0aW9uOiByZWxhdGl2ZTtcblx0aGVpZ2h0OiBhdXRvO1xuXG5cdGNhbnZhcyB7XG5cdFx0ZGlzcGxheTogYmxvY2s7XG5cdFx0d2lkdGg6IDEwMCU7XG5cdFx0aGVpZ2h0OiAxMDAlO1xuXHR9XG5cblx0LmNoYXJ0V3JhcHBlciB7XG5cdFx0cG9zaXRpb246IHJlbGF0aXZlO1xuXHRcdG92ZXJmbG93LXg6IGF1dG87XHRcdFxuXHR9XG5cbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_dashboard_dashboard_component_ts.3d870a116f7ec9bc.js.map