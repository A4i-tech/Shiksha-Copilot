"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_admin_audit-log_audit-log_component_ts"],{

/***/ 38696:
/*!*************************************************************!*\
  !*** ./src/app/view/admin/audit-log/audit-log.component.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuditLogComponent: () => (/* binding */ AuditLogComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/directives/has-permission.directive */ 87944);
/* harmony import */ var src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _audit_log_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./audit-log.service */ 69952);








function AuditLogComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, "No Data Found"), " ");
  }
}
function AuditLogComponent_div_22_a_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const auditLogData_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("href", auditLogData_r5 == null ? null : auditLogData_r5.logUrl, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](auditLogData_r5 == null ? null : auditLogData_r5.logUrl);
  }
}
function AuditLogComponent_div_22_p_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const auditLogData_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", auditLogData_r5 == null ? null : auditLogData_r5.eventType, " Failed ");
  }
}
const _c0 = function (a0, a1) {
  return {
    "text-success bg-success-50": a0,
    "text-error bg-error-50": a1
  };
};
function AuditLogComponent_div_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 26)(1, "div", 27)(2, "div", 28)(3, "div")(4, "p", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "div")(10, "p", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](12, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "span", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "div")(16, "p", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](18, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "div")(22, "p", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](24, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](25, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](27, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "div")(29, "p", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](31, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](32, AuditLogComponent_div_22_a_32_Template, 2, 2, "a", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](33, AuditLogComponent_div_22_p_33_Template, 2, 1, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const auditLogData_r5 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](6, 12, "Event Type"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](auditLogData_r5 == null ? null : auditLogData_r5.eventType);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](12, 14, "Status"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction2"](25, _c0, (auditLogData_r5 == null ? null : auditLogData_r5.status) === "success", (auditLogData_r5 == null ? null : auditLogData_r5.status) === "failure"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](auditLogData_r5 == null ? null : auditLogData_r5.status);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](18, 16, "Name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](auditLogData_r5 == null ? null : auditLogData_r5.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](24, 18, "Date"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](27, 20, auditLogData_r5 == null ? null : auditLogData_r5.createdAt, "d/M/yy, h:mm a"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](31, 23, "Log URL"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", auditLogData_r5 == null ? null : auditLogData_r5.logUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !(auditLogData_r5 == null ? null : auditLogData_r5.logUrl));
  }
}
function AuditLogComponent_th_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "th", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const listHeader_r11 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, listHeader_r11), " ");
  }
}
function AuditLogComponent_tr_29_a_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const auditLogData_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("href", auditLogData_r12 == null ? null : auditLogData_r12.logUrl, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](auditLogData_r12 == null ? null : auditLogData_r12.logUrl);
  }
}
function AuditLogComponent_tr_29_p_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const auditLogData_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", auditLogData_r12 == null ? null : auditLogData_r12.eventType, " Failed ");
  }
}
function AuditLogComponent_tr_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "tr", 35)(1, "td", 36)(2, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "td", 36)(5, "p", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "td", 36)(8, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](10, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "td", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](12, AuditLogComponent_tr_29_a_12_Template, 2, 2, "a", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, AuditLogComponent_tr_29_p_13_Template, 2, 1, "p", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "td", 40)(15, "span", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const auditLogData_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](auditLogData_r12 == null ? null : auditLogData_r12.eventType);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](auditLogData_r12 == null ? null : auditLogData_r12.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](10, 7, auditLogData_r12 == null ? null : auditLogData_r12.createdAt, "d/M/yy, h:mm a"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", auditLogData_r12 == null ? null : auditLogData_r12.logUrl);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !(auditLogData_r12 == null ? null : auditLogData_r12.logUrl));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction2"](10, _c0, (auditLogData_r12 == null ? null : auditLogData_r12.status) === "success", (auditLogData_r12 == null ? null : auditLogData_r12.status) === "failure"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](auditLogData_r12 == null ? null : auditLogData_r12.status);
  }
}
function AuditLogComponent_tr_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "tr")(1, "td", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](3, 1, "No Data Found"), " ");
  }
}
const _c1 = function () {
  return ["admin", "manager"];
};
class AuditLogComponent {
  /**
   * Class constructor
   * @param auditLogService AuditLogService
   */
  constructor(auditLogService) {
    this.auditLogService = auditLogService;
    this.auditLogHeaders = ['Event Type', 'Created By', 'Created At', 'Log URL', 'Status'];
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalItems = 0;
  }
  /**
   * OnInit lifecycle hook for initialization
   */
  ngOnInit() {
    this.getAuditLogs();
  }
  /**
   * Function to get auditlog list data
   */
  getAuditLogs() {
    this.auditLogService.getAuditLogs(this.currentPage, this.pageSize).subscribe({
      next: res => {
        this.auditLogListData = res.data['results'];
        this.totalItems = res.data.totalItems;
        if (this.totalItems <= 10) {
          this.currentPage = 1;
        }
      },
      error: err => {
        console.error('Error while fetching list', err);
      }
    });
  }
  /**
   * Function to refresh the audit log list
   */
  refresh() {
    this.currentPage = 1;
    this.getAuditLogs();
  }
  /**
   * pagination
   */
  onPageChange(page) {
    this.currentPage = page;
    this.getAuditLogs();
  }
  static {
    this.ɵfac = function AuditLogComponent_Factory(t) {
      return new (t || AuditLogComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_audit_log_service__WEBPACK_IMPORTED_MODULE_2__.AuditLogService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: AuditLogComponent,
      selectors: [["app-audit-log"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
      decls: 32,
      vars: 22,
      consts: [[1, "audit-log-list-wrapper", "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "content-center"], [1, "text-2xl", "md:text-[30px]", "md:leading-[48px]", "font-bold", "text-content"], [1, "audit-log-list-container", "px-4", "py-6", "md:px-6", "md:py-8", "bg-white", "mt-6", "border", "rounded"], [1, "flex", "items-center", "justify-between", "gap-3", "sm:gap-5", "mb-3"], [1, "text-content", "text-2xl", "md:text-[30px]", "md:leading-[48px]", "font-bold", "min-w-0"], [1, "buttons", "shrink-0", "flex", "justify-end"], [1, "action-btn", "flex", "justify-end", "gap-2"], [1, "bg-primary", "text-white", "rounded", "w-8", "h-8", "p-0", "inline-flex", "items-center", "justify-center", "hover:bg-primary-100", "sm:hidden", 3, "hasPermission", "click"], [1, "flex", "items-center", "justify-center"], ["src", "assets/icons/Replay_light.svg", "alt", "", 1, "w-4", "h-4"], [1, "hidden", "sm:inline-flex", "btn-primary", "items-center", "justify-center", "gap-2", 3, "hasPermission", "click"], ["src", "assets/icons/Replay_light.svg", "alt", ""], [1, "text-nowrap"], [1, "space-y-4", "md:hidden"], ["class", "text-center text-content-60 py-4 border rounded-xl", 4, "ngIf"], ["class", "rounded-xl border p-4 bg-white shadow-sm", 4, "ngFor", "ngForOf"], [1, "hidden", "md:block", "w-full", "overflow-x-auto"], ["aria-label", "audit-log-list", 1, "table-auto", "min-w-[900px]", "w-full", "border", "mt-5", "rounded-lg"], [1, "header", "font-semibold", "text-left", "text-content", "table-header", "border-b", "border-shade"], ["class", "px-4 py-6 border text-sm", 4, "ngFor", "ngForOf"], [1, "bg-white"], ["class", "text-gray-700", 4, "ngFor", "ngForOf"], [4, "ngIf"], [3, "totalItems", "pageSize", "currentPage", "pageChange"], [1, "text-center", "text-content-60", "py-4", "border", "rounded-xl"], [1, "rounded-xl", "border", "p-4", "bg-white", "shadow-sm"], [1, "space-y-3", "text-sm"], [1, "grid", "grid-cols-2", "gap-3"], [1, "text-xs", "text-content-60"], [1, "capitalize", "break-words"], [1, "inline-flex", "px-3", "py-0.5", "sm:py-1", "rounded-full", "capitalize", 3, "ngClass"], ["class", "block break-all underline text-primary cursor-pointer", 3, "href", 4, "ngIf"], [1, "block", "break-all", "underline", "text-primary", "cursor-pointer", 3, "href"], [1, "px-4", "py-6", "border", "text-sm"], [1, "text-gray-700"], [1, "px-4", "py-6", "text-sm", "border"], [1, "capitalize"], [1, "px-4", "py-6", "text-sm", "border", "w-96"], ["class", "block text-nowrap whitespace-nowrap w-80 overflow-x-hidden text-ellipsis underline text-primary cursor-pointer", 3, "href", 4, "ngIf"], [1, "p-4", "text-sm", "border"], [1, "px-3", "py-2", "rounded-full", "capitalize", 3, "ngClass"], [1, "block", "text-nowrap", "whitespace-nowrap", "w-80", "overflow-x-hidden", "text-ellipsis", "underline", "text-primary", "cursor-pointer", 3, "href"], ["colspan", "7", 1, "text-center", "text-content-60", "py-2"]],
      template: function AuditLogComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 3)(6, "div", 4)(7, "h2", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](9, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div", 6)(11, "div", 7)(12, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AuditLogComponent_Template_button_click_12_listener() {
            return ctx.refresh();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](13, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](14, "img", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AuditLogComponent_Template_button_click_15_listener() {
            return ctx.refresh();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](16, "img", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "span", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](19, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "div", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](21, AuditLogComponent_div_21_Template, 3, 3, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](22, AuditLogComponent_div_22_Template, 34, 28, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "div", 17)(24, "table", 18)(25, "thead")(26, "tr", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](27, AuditLogComponent_th_27_Template, 3, 3, "th", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "tbody", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](29, AuditLogComponent_tr_29_Template, 17, 13, "tr", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](30, AuditLogComponent_tr_30_Template, 4, 3, "tr", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "app-pagination", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("pageChange", function AuditLogComponent_Template_app_pagination_pageChange_31_listener($event) {
            return ctx.onPageChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](4, 14, "Audit Log"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](9, 16, "Audit Log List"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](20, _c1));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵattribute"]("aria-label", "Refresh");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction0"](21, _c1));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](19, 18, "Refresh"));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.auditLogListData || !ctx.auditLogListData.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.auditLogListData);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.auditLogHeaders);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.auditLogListData);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.auditLogListData || !ctx.auditLogListData.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("totalItems", ctx.totalItems)("pageSize", ctx.pageSize)("currentPage", ctx.currentPage);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_4__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_4__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_5__.TranslatePipe, src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_0__.HasPermissionDirective, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_1__.PaginationComponent],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhdWRpdC1sb2cuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi9hdWRpdC1sb2cvYXVkaXQtbG9nLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSx3S0FBd0siLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 69952:
/*!***********************************************************!*\
  !*** ./src/app/view/admin/audit-log/audit-log.service.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuditLogService: () => (/* binding */ AuditLogService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);




class AuditLogService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  /**
   * Class constructor
   * @param http HttpClient
   */
  constructor(http) {
    super(http);
    this.setUri('audit');
  }
  /**
   * Function to get audit logs
   * @param page
   * @param limit
   * @returns
   */
  getAuditLogs(page, limit) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.get('log', params);
  }
  static {
    this.ɵfac = function AuditLogService_Factory(t) {
      return new (t || AuditLogService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_1__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: AuditLogService,
      factory: AuditLogService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_audit-log_audit-log_component_ts.717422b78c349d8b.js.map