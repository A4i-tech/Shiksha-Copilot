"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_user_user_module_ts"],{

/***/ 32292:
/*!******************************************************!*\
  !*** ./src/app/core/guards/baseline-survey.guard.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaselineSurveyGuard: () => (/* binding */ BaselineSurveyGuard)
/* harmony export */ });
/* harmony import */ var _home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _services_authorization_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/authorization.service */ 70581);
/* harmony import */ var src_app_auth_sign_in_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/auth/sign-in.service */ 44283);
/* harmony import */ var _services_baseline_survey_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/baseline-survey.service */ 91296);
/* harmony import */ var _services_baseline_survey_dialog_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/baseline-survey-dialog.service */ 66235);








class BaselineSurveyGuard {
  constructor() {
    this.authz = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_services_authorization_service__WEBPACK_IMPORTED_MODULE_1__.AuthorizationService);
    this.auth = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(src_app_auth_sign_in_service__WEBPACK_IMPORTED_MODULE_2__.SignInService);
    this.survey = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_services_baseline_survey_service__WEBPACK_IMPORTED_MODULE_3__.BaselineSurveyService);
    this.dialog = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_services_baseline_survey_dialog_service__WEBPACK_IMPORTED_MODULE_4__.BaselineSurveyDialogService);
    this.zone = (0,_angular_core__WEBPACK_IMPORTED_MODULE_5__.inject)(_angular_core__WEBPACK_IMPORTED_MODULE_5__.NgZone);
  }
  canActivate(_route, _state) {
    var _this = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      // If not logged in, don’t block routing here.
      if (!_this.authz.isLoggedIn()) return true;
      // 1) Ensure we have fresh user (and roles)
      try {
        const res = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this.auth.authMe());
        if (res?.data) localStorage.setItem('userData', JSON.stringify(res.data));
      } catch {
        // fall back to stored user if present
      }
      const user = _this.getUser();
      if (!_this.isEndUser(user)) return true; // skip for managers/admins
      // 2) Check completion
      try {
        const resp = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.firstValueFrom)(_this.survey.checkCompleted());
        const completed = !!resp?.data?.completed;
        // 3) Open dialog if not completed
        if (!completed) {
          // Defer dialog open to next macrotask to avoid change detection race with navigation
          _this.zone.runOutsideAngular(() => {
            setTimeout(() => {
              _this.zone.run(() => {
                // fire-and-forget so guard returns immediately
                void _this.dialog.openSurvey(true);
              });
            }, 0);
          });
        }
      } catch (e) {
        // swallow errors so routing isn't blocked
        console.error('[BaselineSurveyGuard] check/open failed', e);
      }
      return true;
    })();
  }
  getUser() {
    try {
      const s = localStorage.getItem('userData');
      return s ? JSON.parse(s) : null;
    } catch {
      return null;
    }
  }
  /** Treat everyone who is NOT an admin/manager as an end-user */
  isEndUser(user) {
    const roles = Array.isArray(user?.role) ? user.role : [user?.role].filter(Boolean);
    if (!roles.length) return false;
    const lower = roles.map(r => String(r).toLowerCase());
    const EXCLUDE = new Set(['admin', 'manager', 'super_admin', 'coordinator', 'trainer']);
    if (lower.some(r => EXCLUDE.has(r))) return false;
    return true;
  }
  static {
    this.ɵfac = function BaselineSurveyGuard_Factory(t) {
      return new (t || BaselineSurveyGuard)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
      token: BaselineSurveyGuard,
      factory: BaselineSurveyGuard.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 55602:
/*!********************************************************!*\
  !*** ./src/app/core/guards/isProfileComplete.guard.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IsProfileCompleteGuard: () => (/* binding */ IsProfileCompleteGuard)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _services_utility_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/utility.service */ 8128);



const IsProfileCompleteGuard = (route, state) => {
  const data = localStorage.getItem('userData') ?? '';
  const loggedInUser = JSON.parse(data);
  const utilityServcie = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_services_utility_service__WEBPACK_IMPORTED_MODULE_0__.UtilityService);
  const router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
  if (loggedInUser.isProfileCompleted) {
    return true;
  } else {
    utilityServcie.showWarning('Please complete the profile for further access');
    router.navigate(['/profile']);
    return false;
  }
};

/***/ }),

/***/ 70127:
/*!***********************************************!*\
  !*** ./src/app/shared/directives/calendar.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarAccessibilityDirective: () => (/* binding */ CalendarAccessibilityDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);

// Patches angular-calendar's hardcoded role="grid"/"application" attrs that
// can't be changed via templates. Safe no-op on month view.
class CalendarAccessibilityDirective {
  constructor(el) {
    this.el = el;
    this._observer = null;
  }
  ngAfterViewInit() {
    this._patchSubtree(this.el.nativeElement);
    this._observer = new MutationObserver(mutations => {
      for (const {
        addedNodes
      } of mutations) {
        addedNodes.forEach(node => {
          if (node instanceof HTMLElement) {
            this._patchSubtree(node);
          }
        });
      }
    });
    this._observer.observe(this.el.nativeElement, {
      childList: true,
      subtree: true
    });
  }
  ngOnDestroy() {
    this._observer?.disconnect();
    this._observer = null;
  }
  _patchSubtree(root) {
    if (root.classList?.contains('cal-week-view') && root.getAttribute('role') === 'grid') {
      root.removeAttribute('role');
    }
    if (root.getAttribute('role') === 'application') {
      root.setAttribute('role', 'button');
    }
    root.querySelectorAll('.cal-week-view[role="grid"]').forEach(g => g.removeAttribute('role'));
    root.querySelectorAll('[role="application"]').forEach(e => e.setAttribute('role', 'button'));
  }
  static {
    this.ɵfac = function CalendarAccessibilityDirective_Factory(t) {
      return new (t || CalendarAccessibilityDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef));
    };
  }
  static {
    this.ɵdir = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
      type: CalendarAccessibilityDirective,
      selectors: [["", "appCalendarAccessibility", ""]],
      standalone: true
    });
  }
}

/***/ }),

/***/ 59113:
/*!*************************************************!*\
  !*** ./src/app/shared/utility/languege.util.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   languege: () => (/* binding */ languege)
/* harmony export */ });
const languege = ['English', 'Kannada'];

/***/ }),

/***/ 78346:
/*!************************************************************!*\
  !*** ./src/app/shared/utility/scheduleClassColors.util.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   colors: () => (/* binding */ colors),
/* harmony export */   dashboardColors: () => (/* binding */ dashboardColors)
/* harmony export */ });
const colors = new Map([[1, {
  primary: '#6a6a3a',
  secondary: '#ffffdb'
}], [2, {
  primary: '#6f6fdc',
  secondary: '#dedef7'
}], [3, {
  primary: '#6fcfdc',
  secondary: '#def4f7'
}], [4, {
  primary: '#6a6a3a',
  secondary: '#eef7de'
}], [5, {
  primary: '#a07ce9',
  secondary: '#e8e5f0'
}], [6, {
  primary: '#dcb46f',
  secondary: '#f7eede'
}], [7, {
  primary: '#3ed1ce',
  secondary: '#e5fbff'
}], [8, {
  primary: '#1dd75b',
  secondary: '#eefdf3'
}], [9, {
  primary: '#b978ec',
  secondary: '#ebfdff'
}], [10, {
  primary: '#f19b5d',
  secondary: '#f1e9e5'
}], [11, {
  primary: '#dc9e6f',
  secondary: '#f7e9de'
}], [12, {
  primary: '#dc786f',
  secondary: '#f7e0de'
}]]);
// Event background = `secondary`, text is white (see _dashboard_schedule.scss).
// Each colour is darkened within its own hue to meet WCAG AA (>=4.5:1 vs white).
// `primary` (event marker) matches the background colour.
const dashboardColors = new Map([[1, {
  primary: '#b600e4',
  secondary: '#b600e4'
}], [2, {
  primary: '#e4006b',
  secondary: '#e4006b'
}], [3, {
  primary: '#00845D',
  secondary: '#00845D'
}], [4, {
  primary: '#3772DD',
  secondary: '#3772DD'
}], [5, {
  primary: '#008192',
  secondary: '#008192'
}], [6, {
  primary: '#338626',
  secondary: '#338626'
}], [7, {
  primary: '#1565C0',
  secondary: '#1565C0'
}], [8, {
  primary: '#B65D34',
  secondary: '#B65D34'
}], [9, {
  primary: '#9058DE',
  secondary: '#9058DE'
}], [10, {
  primary: '#906F2D',
  secondary: '#906F2D'
}]]);

/***/ }),

/***/ 69927:
/*!***********************************************************************!*\
  !*** ./src/app/view/user/dashboard/custom-date-formatter.provider.ts ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomDateFormatter: () => (/* binding */ CustomDateFormatter)
/* harmony export */ });
/* harmony import */ var angular_calendar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular-calendar */ 35519);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);





class CustomDateFormatter extends angular_calendar__WEBPACK_IMPORTED_MODULE_0__.CalendarDateFormatter {
  /**
   * Class constructor
   * @param locale string
   * @param dateAdapter DateAdapter
   */
  constructor(locale, dateAdapter) {
    super(dateAdapter);
    this.locale = locale;
  }
  monthViewColumnHeader({
    date
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_1__.formatDate)(date, 'EEE', this.locale);
  }
  dayViewHour({
    date
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_1__.formatDate)(date, 'hh:mm a', this.locale);
  }
  static {
    this.ɵfac = function CustomDateFormatter_Factory(t) {
      return new (t || CustomDateFormatter)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](angular_calendar__WEBPACK_IMPORTED_MODULE_0__.DateAdapter));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: CustomDateFormatter,
      factory: CustomDateFormatter.ɵfac
    });
  }
}

/***/ }),

/***/ 47906:
/*!************************************************************!*\
  !*** ./src/app/view/user/dashboard/dashboard.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardComponent: () => (/* binding */ DashboardComponent)
/* harmony export */ });
/* harmony import */ var angular_calendar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! angular-calendar */ 35519);
/* harmony import */ var _custom_date_formatter_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./custom-date-formatter.provider */ 69927);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! date-fns */ 23206);
/* harmony import */ var src_app_shared_utility_scheduleClassColors_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/scheduleClassColors.util */ 78346);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _dashboard_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./dashboard.service */ 63974);
/* harmony import */ var _content_generation_content_generation_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../content-generation/content-generation.service */ 22360);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ng2-charts */ 57839);
/* harmony import */ var _shared_directives_calendar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/directives/calendar */ 70127);
















const _c0 = ["analyticsDropdown"];
function DashboardComponent_p_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "p", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](2, 1, "View All"), " ");
  }
}
function DashboardComponent_div_31_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 44)(1, "div")(2, "div", 12)(3, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceSVG"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "svg", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](5, "path", 47)(6, "path", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnamespaceHTML"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](10, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](12, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](13, "div", 50)(14, "h4", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](16, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](17, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "p", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](21, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](22, "button", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function DashboardComponent_div_31_Template_button_click_22_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r9);
      const plan_r7 = restoredCtx.$implicit;
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r8.onView(plan_r7));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](23, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](25, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const plan_r7 = ctx.$implicit;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", plan_r7.iconBackground);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("fill", plan_r7.iconColor);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](9, 10, "Modified On"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind2"](12, 12, plan_r7.updatedAt, "MMM dd,yyyy"));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](16, 15, "Subject"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](plan_r7.isLesson ? ctx_r1.utiltyService.getSubjectDisplayName(plan_r7.lesson.subjects) : ctx_r1.utiltyService.getSubjectDisplayName(plan_r7.resource.subjects));
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](21, 17, "Topic"), ": ", plan_r7.isLesson ? (plan_r7.lesson.chapter == null ? null : plan_r7.lesson.chapter.orderNumber) + ". " + plan_r7.lesson.chapter.topics : (plan_r7.resource.chapter == null ? null : plan_r7.resource.chapter.orderNumber) + ". " + plan_r7.resource.chapter.topics, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", plan_r7.btnColor);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](25, 19, plan_r7.isLesson ? "View Lesson Plan" : "View Resource Plan"), " ");
  }
}
function DashboardComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 55)(1, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "img", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "h4", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](6, "button", 59)(7, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](5, 2, "No plans found"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](9, 4, "Generate"), " ");
  }
}
function DashboardComponent_ng_template_71_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](0, "div", 60);
  }
  if (rf & 2) {
    const event_r10 = ctx.event;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("innerHTML", ctx_r6.getTooltip(event_r10), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsanitizeHtml"]);
  }
}
class DashboardComponent {
  /**
   * Class constructor
   * @param dashboardService DashboardService
   * @param contentGenService ContentGenerationService
   * @param router Router
   * @param utiltyService UtilityService
   * @param datePipe DatePipe
   * @param translateService TranslateService
   */
  constructor(dashboardService, contentGenService, router, utiltyService, datePipe, translateService) {
    this.dashboardService = dashboardService;
    this.contentGenService = contentGenService;
    this.router = router;
    this.utiltyService = utiltyService;
    this.datePipe = datePipe;
    this.translateService = translateService;
    this.selectedAnalytics = 'quarter-year';
    this.analyticsDropdownOptions = [{
      name: '3 Months',
      value: 'quarter-year'
    }, {
      name: '6 Months',
      value: ' half-year'
    }, {
      name: 'Last year',
      value: 'last-year'
    }, {
      name: 'Current year',
      value: 'current-year'
    }];
    this.analyticsDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select duration',
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'value',
      clearableOff: true
    };
    this.recentLessonPlans = [];
    this.recentResoucePlans = [];
    this.recentPlans = [];
    this.resourceColors = {
      lesson: {
        iconColor: 'var(--tertiary-100)',
        btnColor: 'bg-tertiary',
        iconBackground: 'bg-purple-100'
      },
      resource: {
        iconColor: 'var(--success-80)',
        btnColor: 'bg-success',
        iconBackground: 'bg-green-100'
      }
    };
    this.viewDate = new Date();
    this.monthViewDate = new Date();
    this.activeDayIsOpen = true;
    this.view = angular_calendar__WEBPACK_IMPORTED_MODULE_8__.CalendarView.Month;
    this.events = [];
    this.refresh = new rxjs__WEBPACK_IMPORTED_MODULE_9__.Subject();
    this.lineChartOptions = {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          align: 'end'
        },
        tooltip: {
          backgroundColor: 'white',
          bodyColor: 'black',
          borderWidth: 1,
          borderColor: '#F3F4F6',
          boxHeight: 10,
          bodyAlign: 'center',
          titleColor: 'black'
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          }
        },
        y: {
          beginAtZero: true,
          suggestedMin: 0,
          suggestedMax: 50,
          ticks: {
            stepSize: 5
          },
          grid: {
            drawBorder: false
          }
        }
      }
    };
  }
  /**
   * Angular oninit lifecycle hook for initialization
   */
  ngOnInit() {
    this.getRecentLessonPlan();
    this.getScheduleData(this.datePipe.transform(this.viewDate, 'yyyy-MM-dd'));
    this.getChartData(this.selectedAnalytics);
  }
  /**
   * Angular ngAfterViewInit lifecycle hook used to set default filter value
   */
  ngAfterViewInit() {
    this.analyticsDropdown.selectedItem = this.selectedAnalytics;
  }
  /**
   * Function to get recent lesson plan
   */
  getRecentLessonPlan() {
    this.dashboardService.getRecentLessonPlan().subscribe({
      next: val => {
        const response = val.data;
        let lessonObj;
        let resourceObj;
        let plans = [];
        this.recentLessonPlans = response.filter(ele => ele.isLesson);
        this.recentResoucePlans = response.filter(ele => !ele.isLesson);
        if (this.recentLessonPlans.length) {
          lessonObj = {
            ...this.recentLessonPlans[0],
            ...this.resourceColors['lesson']
          };
          plans.push(lessonObj);
        }
        if (this.recentResoucePlans.length) {
          resourceObj = {
            ...this.recentResoucePlans[0],
            ...this.resourceColors['resource']
          };
          plans.push(resourceObj);
        }
        this.recentPlans = [...plans];
      },
      error: err => {
        console.log(err);
      }
    });
  }
  /**
   * Function called on analytics filter change
   * @param val
   */
  onFilterChange(val) {
    this.selectedAnalytics = val;
    this.getChartData(this.selectedAnalytics);
  }
  /**
   * Function to get chart data
   */
  getChartData(filterParam) {
    this.dashboardService.getChartData(filterParam).subscribe({
      next: val => {
        this.lineChartData = {
          labels: val.timeLine,
          datasets: [{
            data: val.lessonPlanCounts,
            label: this.translateService.instant('Lesson Plans'),
            fill: false,
            borderColor: '#A062F7',
            tension: 0.3,
            cubicInterpolationMode: 'monotone',
            pointBackgroundColor: '#A062F7',
            backgroundColor: '#A062F7'
          }, {
            data: val.resourcePlanCounts,
            label: this.translateService.instant('Lesson Resources'),
            fill: false,
            borderColor: '#70CF97',
            tension: 0.3,
            cubicInterpolationMode: 'monotone',
            pointBackgroundColor: '#70CF97',
            backgroundColor: '#70CF97'
          }]
        };
      },
      error: err => {
        console.log(err);
      }
    });
  }
  /**
   * Function called on view
   * @param data
   */
  onView(data) {
    if (data.isLesson) {
      this.router.navigate([`/content-generation/lesson-plan/${data.lesson._id}`]);
    } else {
      this.router.navigate([`/content-generation/resource-plan/${data.resource._id}`]);
    }
  }
  /**
   * Function called on day clicked on calender
   * @param day
   */
  dayClicked(day) {
    this.getScheduleData(this.datePipe.transform(day.date, 'yyyy-MM-dd'));
    if (this.selectedDay?.cssClass) {
      delete this.selectedDay.cssClass;
    }
    if (this.datePipe.transform(day.date, 'yyyy-MM-dd') === this.datePipe.transform(new Date(), 'yyyy-MM-dd')) {
      this.currentDay = false;
    } else {
      this.currentDay = true;
    }
    day.cssClass = 'cal-day-selected';
    this.selectedDay = day;
    this.viewDate = new Date(day.date);
  }
  /**
   * Function to get schedule data
   * @param date
   */
  getScheduleData(date) {
    this.dashboardService.getScheduleData(date).subscribe({
      next: res => {
        this.createEvent(res.data);
        this.refresh.next();
      },
      error: err => {
        console.log(err);
      }
    });
  }
  /**
   * Function to create events
   * @param eventsData
   */
  createEvent(eventsData) {
    this.events = [];
    for (let events of eventsData) {
      for (let scheduleItem of events.scheduleDateTime) {
        this.events.push(this.setEventData(events, this.utiltyService.formateDate(scheduleItem)));
      }
    }
  }
  /**
   * Function to set event data
   * @param eventVal
   * @param date_time
   * @returns
   */
  setEventData(eventVal, date_time) {
    const [year, month, day] = date_time.date.split('-').map(Number);
    const [fromHour, fromMinute] = date_time.fromTime.split(':').map(Number);
    const [toHour, toMinute] = date_time.toTime.split(':').map(Number);
    const eventColor = this.getEventColor(eventVal.class);
    return {
      start: (0,date_fns__WEBPACK_IMPORTED_MODULE_10__.startOfMinute)(new Date(year, month - 1, day, fromHour, fromMinute, 0)),
      end: (0,date_fns__WEBPACK_IMPORTED_MODULE_10__.startOfMinute)(new Date(year, month - 1, day, toHour, toMinute, 0)),
      title: `<span>${this.translateService.instant('Class')} : ${eventVal.class} | ${this.translateService.instant('Subject')} : ${this.utiltyService.getSubjectDisplayName(eventVal.subjects)}</span> <p class="cal-event-line2 overflow-hidden whitespace-nowrap text-ellipsis">${this.translateService.instant('Lesson Name')} : ${eventVal.topic}</p>`,
      color: eventColor,
      id: eventVal._id,
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false
      }
    };
  }
  /**
   * Function to get event colors based on subject
   * @param key
   * @returns
   */
  getEventColor(key) {
    return src_app_shared_utility_scheduleClassColors_util__WEBPACK_IMPORTED_MODULE_1__.dashboardColors.get(key) || {
      primary: '#000000',
      secondary: '#FFFFFF'
    };
  }
  /**
   * Funciton called on viewDateChange
   */
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  getTooltip(event) {
    return `${event.title} <p>Time: ${this.datePipe.transform(event.start, 'hh:mm a')} to ${this.datePipe.transform(event.end, 'hh:mm a')}</p>`;
  }
  static {
    this.ɵfac = function DashboardComponent_Factory(t) {
      return new (t || DashboardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_dashboard_service__WEBPACK_IMPORTED_MODULE_2__.DashboardService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_content_generation_content_generation_service__WEBPACK_IMPORTED_MODULE_3__.ContentGenerationService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_11__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_12__.DatePipe), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslateService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
      type: DashboardComponent,
      selectors: [["app-dashboard"]],
      viewQuery: function DashboardComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.analyticsDropdown = _t.first);
        }
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵProvidersFeature"]([{
        provide: angular_calendar__WEBPACK_IMPORTED_MODULE_8__.CalendarDateFormatter,
        useClass: _custom_date_formatter_provider__WEBPACK_IMPORTED_MODULE_0__.CustomDateFormatter
      }])],
      decls: 73,
      vars: 75,
      consts: [[1, "mt-16", "lg:mt-0", "mb-0", "lg:mb-4", "p-4", "lg:p-0", "pb-0"], [1, "text-xl", "text-content", "md:text-2xl", "font-bold"], [1, "text-sm", "md:text-sm", "font-light", "text-content-60"], [1, "dashboard-wrapper", "grid", "grid-cols-1", "md:grid-cols-10", "md:gap-[22px]", "p-4", "lg:p-0"], [1, "w-full", "col-span-6"], [1, "dashboard-landing-card"], [1, "flex", "flex-col", "md:flex-row", "gap-6", "mx-7", "my-7"], ["src", "assets/images/dashboard-computer.png", "alt", "", 1, "h-[186px]"], [1, "mt-1", "text-xl", "text-white", "font-semibold"], [1, "mt-3", "text-white", "text-sm"], ["routerLink", "/content-generation/lesson-plan", 1, "text-primary", "bg-white", "px-7", "py-2", "mt-7", "rounded", "font-medium", "text-sm"], ["role", "region", 1, "mt-10"], [1, "flex", "justify-between"], [1, "text-xl", "md:text-2xl", "font-medium", "text-content-100"], ["class", "text-sm font-medium text-primary cursor-pointer", "routerLink", "/content-generation", 4, "ngIf"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "mt-4"], ["class", "px-6 py-8 rounded-xl bg-white border flex flex-col justify-between", 4, "ngFor", "ngForOf"], ["class", "px-6 py-8 rounded-xl bg-white border flex flex-col items-center", 4, "ngIf"], ["role", "region", 1, "canvas-container", "mt-8", "bg-white", "py-7", "px-6", "rounded-xl", "border"], [1, "flex", "justify-between", "items-center", "mb-5"], [1, "text-base", "text-content"], [1, "w-44"], [3, "dropDownValues", "config", "valueUpdate"], ["analyticsDropdown", ""], ["baseChart", "", "role", "img", "height", "400", 3, "type", "data", "options"], [1, "w-full", "col-span-4", "mt-8", "md:mt-0"], ["role", "region", 1, "bg-white", "px-5", "py-7", "rounded-xl", "border", "open-calender-wrapper", "h-full"], [1, "font-bold", "text-xl", "md:text-[24px]", "pl-3", "text-content-100"], [1, "flex", "justify-between", "items-center", "flex-wrap", "gap-4", "mt-4", "pl-3"], [1, "min-w-fit"], [1, "font-normal", "md:text-xl", "text-lg", "md:leading-9", "text-content-100"], [1, "btn-group", "flex", "gap-4", "items-center", "ml-auto", "min-w-fit"], ["type", "button", "mwlCalendarPreviousView", "", 1, "p-1", "md:py-2", "md:px-4", "rounded", "text-sm", "md:text-lg", 3, "view", "viewDate", "viewDateChange"], ["src", "assets/icons/Chevron left large.svg", "alt", "", 1, "inline-block", "mb-[2px]"], ["type", "button", "mwlCalendarNextView", "", 1, "p-1", "md:py-2", "md:px-4", "rounded", "text-primary", "text-sm", "md:text-lg", 3, "view", "viewDate", "viewDateChange"], ["src", "assets/icons/Chevron right large.svg", "alt", "", 1, "inline-block"], ["appCalendarAccessibility", "", 3, "viewDate", "weekStartsOn", "ngClass", "dayClicked"], ["routerLink", "/schedule", 1, "px-6", "py-4", "bg-primary", "rounded", "w-full", "mt-7", "mb-5"], [1, "block", "text-white", "text-left", "font-medium"], [1, "mt-5", "dashboard-events"], ["appCalendarAccessibility", "", 3, "viewDate", "events", "hourSegmentHeight", "dayStartHour", "dayEndHour", "hourSegments", "refresh", "tooltipTemplate"], ["calender_ele", ""], ["customTooltip", ""], ["routerLink", "/content-generation", 1, "text-sm", "font-medium", "text-primary", "cursor-pointer"], [1, "px-6", "py-8", "rounded-xl", "bg-white", "border", "flex", "flex-col", "justify-between"], [1, "icon", "flex", "justify-center", "items-center", 3, "ngClass"], ["width", "24", "height", "24", "viewBox", "0 0 24 24", "xmlns", "http://www.w3.org/2000/svg"], ["fill-rule", "evenodd", "clip-rule", "evenodd", "d", "M14.25 2.5C14.25 2.4337 14.2237 2.37011 14.1768 2.32322C14.1299 2.27634 14.0663 2.25 14 2.25H7C6.27065 2.25 5.57118 2.53973 5.05546 3.05546C4.53973 3.57118 4.25 4.27065 4.25 5V19C4.25 19.7293 4.53973 20.4288 5.05546 20.9445C5.57118 21.4603 6.27065 21.75 7 21.75H17C17.7293 21.75 18.4288 21.4603 18.9445 20.9445C19.4603 20.4288 19.75 19.7293 19.75 19V9.147C19.75 9.0807 19.7237 9.01711 19.6768 8.97022C19.6299 8.92334 19.5663 8.897 19.5 8.897H15C14.8011 8.897 14.6103 8.81798 14.4697 8.67733C14.329 8.53668 14.25 8.34591 14.25 8.147V2.5ZM15 12.25C15.1989 12.25 15.3897 12.329 15.5303 12.4697C15.671 12.6103 15.75 12.8011 15.75 13C15.75 13.1989 15.671 13.3897 15.5303 13.5303C15.3897 13.671 15.1989 13.75 15 13.75H9C8.80109 13.75 8.61032 13.671 8.46967 13.5303C8.32902 13.3897 8.25 13.1989 8.25 13C8.25 12.8011 8.32902 12.6103 8.46967 12.4697C8.61032 12.329 8.80109 12.25 9 12.25H15ZM15 16.25C15.1989 16.25 15.3897 16.329 15.5303 16.4697C15.671 16.6103 15.75 16.8011 15.75 17C15.75 17.1989 15.671 17.3897 15.5303 17.5303C15.3897 17.671 15.1989 17.75 15 17.75H9C8.80109 17.75 8.61032 17.671 8.46967 17.5303C8.32902 17.3897 8.25 17.1989 8.25 17C8.25 16.8011 8.32902 16.6103 8.46967 16.4697C8.61032 16.329 8.80109 16.25 9 16.25H15Z"], ["d", "M15.75 2.82396C15.75 2.63996 15.943 2.52296 16.086 2.63796C16.207 2.73596 16.316 2.84996 16.409 2.97996L19.422 7.17696C19.49 7.27296 19.416 7.39696 19.298 7.39696H16C15.9337 7.39696 15.8701 7.37062 15.8232 7.32373C15.7763 7.27685 15.75 7.21326 15.75 7.14696V2.82396Z"], [1, "text-xs", "font-normal", "text-content-70"], [1, "mt-5"], [1, "text-base", "font-medium"], [1, "mt-2", "text-xs", "font-normal", "text-content-70"], [1, "mt-8", "w-full", "py-2", "rounded", 3, "ngClass", "click"], [1, "text-white", "text-sm"], [1, "px-6", "py-8", "rounded-xl", "bg-white", "border", "flex", "flex-col", "items-center"], [1, "rounded-full", "bg-warn-50", "p-4", "my-8"], ["src", "assets/icons/no-file.svg", "alt", ""], [1, "text-base", "text-center", "font-medium"], ["routerLink", "/content-generation", 1, "mt-7", "w-full", "py-2", "rounded", "bg-warn"], [1, "z-10", "custom-tooltip", "w-[60%]", "md:w-[20%]", "bg-gray-950", "text-white", "rounded-lg", "mb-2", "p-2", "text-xs", 3, "innerHTML"]],
      template: function DashboardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0)(1, "h1", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](3, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](4, "p", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](6, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "div", 3)(8, "div", 4)(9, "div", 5)(10, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](11, "img", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](12, "div")(13, "h2", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](14);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](15, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "p", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](17);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](18, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](19, "button", 10)(20, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](21);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](22, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](23, "div", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](24, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](25, "div", 12)(26, "h3", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](27);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](28, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](29, DashboardComponent_p_29_Template, 3, 3, "p", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](30, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](31, DashboardComponent_div_31_Template, 26, 21, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](32, DashboardComponent_div_32_Template, 10, 6, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](33, "div", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](34, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](35, "div", 19)(36, "h2", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](37);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](38, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](39, "div", 21)(40, "app-common-dropdown", 22, 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("valueUpdate", function DashboardComponent_Template_app_common_dropdown_valueUpdate_40_listener($event) {
            return ctx.onFilterChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](42, "canvas", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](43, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](44, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](45, "div", 25)(46, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](47, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](48, "h2", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](49);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](50, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](51, "div", 28)(52, "div", 29)(53, "h3", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](54);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](55, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](56, "div", 31)(57, "button", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("viewDateChange", function DashboardComponent_Template_button_viewDateChange_57_listener($event) {
            return ctx.monthViewDate = $event;
          })("viewDateChange", function DashboardComponent_Template_button_viewDateChange_57_listener() {
            return ctx.closeOpenMonthViewDay();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](58, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](59, "img", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](60, "button", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("viewDateChange", function DashboardComponent_Template_button_viewDateChange_60_listener($event) {
            return ctx.monthViewDate = $event;
          })("viewDateChange", function DashboardComponent_Template_button_viewDateChange_60_listener() {
            return ctx.closeOpenMonthViewDay();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](61, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](62, "img", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](63, "mwl-calendar-month-view", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("dayClicked", function DashboardComponent_Template_mwl_calendar_month_view_dayClicked_63_listener($event) {
            return ctx.dayClicked($event.day);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](64, "button", 37)(65, "span", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](66);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](67, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](68, "div", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](69, "mwl-calendar-day-view", 40, 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](71, DashboardComponent_ng_template_71_Template, 1, 1, "ng-template", null, 42, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](72);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](3, 40, "Hi"), ", ", ctx.utiltyService.loggedInUserData == null ? null : ctx.utiltyService.loggedInUserData.name, " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](6, 42, "Your Teacher Toolkit at a Glance"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](15, 44, "Lesson Plan Generation"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](18, 46, "Generating Comprehensive Lesson Plans: Strategies for Creating Engaging and Effective Learning Experiences in the Classroom"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](22, 48, "Generate"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](24, 50, "Recently Generated/Modified Plans"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](28, 52, "Recently Generated/Modified Plans"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.recentPlans.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngForOf", ctx.recentPlans);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.recentPlans.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](34, 54, "Lesson Plan/Resources Generated"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](38, 56, "Lesson Plan/Resources Generated"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("dropDownValues", ctx.analyticsDropdownOptions)("config", ctx.analyticsDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("type", "line")("data", ctx.lineChartData)("options", ctx.lineChartOptions);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](43, 58, "Lesson Plan/Resources Generated") + " - " + _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](44, 60, "line chart showing the number of lesson plans and resources generated over time"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](47, 62, "Calendar"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](50, 64, "Calendar"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind2"](55, 66, ctx.monthViewDate, "MMMM YYYY"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("view", ctx.view)("viewDate", ctx.monthViewDate);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](58, 69, "Previous month"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("view", ctx.view)("viewDate", ctx.monthViewDate);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](61, 71, "Next month"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("viewDate", ctx.monthViewDate)("weekStartsOn", 1)("ngClass", ctx.currentDay ? "current-blur" : "");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](67, 73, "My Schedule"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("viewDate", ctx.viewDate)("events", ctx.events)("hourSegmentHeight", 55)("dayStartHour", 7)("dayEndHour", 18)("hourSegments", 1)("refresh", ctx.refresh)("tooltipTemplate", _r5);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_12__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_11__.RouterLink, _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_5__.CommonDropdownComponent, angular_calendar__WEBPACK_IMPORTED_MODULE_8__["ɵCalendarPreviousViewDirective"], angular_calendar__WEBPACK_IMPORTED_MODULE_8__["ɵCalendarNextViewDirective"], angular_calendar__WEBPACK_IMPORTED_MODULE_8__.CalendarMonthViewComponent, angular_calendar__WEBPACK_IMPORTED_MODULE_8__.CalendarDayViewComponent, ng2_charts__WEBPACK_IMPORTED_MODULE_14__.BaseChartDirective, _shared_directives_calendar__WEBPACK_IMPORTED_MODULE_6__.CalendarAccessibilityDirective, _angular_common__WEBPACK_IMPORTED_MODULE_12__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslatePipe],
      styles: [".dashboard-wrapper[_ngcontent-%COMP%]   .dashboard-landing-card[_ngcontent-%COMP%] {\n  background-image: url('dashboard-card.061ab5a3b1b24076.png');\n  background-repeat: no-repeat;\n  background-size: cover;\n  border-radius: 10px;\n  overflow: hidden;\n  background-position: right;\n}\n.dashboard-wrapper[_ngcontent-%COMP%]   .icon[_ngcontent-%COMP%] {\n  height: 52px;\n  width: 52px;\n  border-radius: 50%;\n}\n.dashboard-wrapper[_ngcontent-%COMP%]   .canvas-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  height: auto;\n  position: relative;\n}\n.dashboard-wrapper[_ngcontent-%COMP%]   .canvas-container[_ngcontent-%COMP%]   canvas[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  height: auto;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRhc2hib2FyZC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDRTtFQUNFLDREQUFBO0VBQ0EsNEJBQUE7RUFDQSxzQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSwwQkFBQTtBQUFKO0FBRUU7RUFDRSxZQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0FBQUo7QUFFRTtFQUNFLFdBQUE7RUFDQSxlQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0FBQUo7QUFHRTtFQUNFLGNBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQURKIiwiZmlsZSI6ImRhc2hib2FyZC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5kYXNoYm9hcmQtd3JhcHBlciB7XG4gIC5kYXNoYm9hcmQtbGFuZGluZy1jYXJkIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIuLi8uLi8uLi8uLi9hc3NldHMvaW1hZ2VzL2Rhc2hib2FyZC1jYXJkLnBuZ1wiKTtcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgIGJhY2tncm91bmQtc2l6ZTogY292ZXI7XG4gICAgYm9yZGVyLXJhZGl1czogMTBweDtcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xuICAgIGJhY2tncm91bmQtcG9zaXRpb246IHJpZ2h0O1xuICB9XG4gIC5pY29uIHtcbiAgICBoZWlnaHQ6IDUycHg7XG4gICAgd2lkdGg6IDUycHg7XG4gICAgYm9yZGVyLXJhZGl1czogNTAlO1xuICB9XG4gIC5jYW52YXMtY29udGFpbmVyIHtcbiAgICB3aWR0aDogMTAwJTtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiBhdXRvO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgfVxuXG4gIC5jYW52YXMtY29udGFpbmVyIGNhbnZhcyB7XG4gICAgZGlzcGxheTogYmxvY2s7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgaGVpZ2h0OiBhdXRvO1xuICB9XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL2Rhc2hib2FyZC9kYXNoYm9hcmQuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFDRSw0REFBQTtFQUNBLDRCQUFBO0VBQ0Esc0JBQUE7RUFDQSxtQkFBQTtFQUNBLGdCQUFBO0VBQ0EsMEJBQUE7QUFBSjtBQUVFO0VBQ0UsWUFBQTtFQUNBLFdBQUE7RUFDQSxrQkFBQTtBQUFKO0FBRUU7RUFDRSxXQUFBO0VBQ0EsZUFBQTtFQUNBLFlBQUE7RUFDQSxrQkFBQTtBQUFKO0FBR0U7RUFDRSxjQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUFESjtBQUNBLGd2Q0FBZ3ZDIiwic291cmNlc0NvbnRlbnQiOlsiLmRhc2hib2FyZC13cmFwcGVyIHtcbiAgLmRhc2hib2FyZC1sYW5kaW5nLWNhcmQge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcIi4uLy4uLy4uLy4uL2Fzc2V0cy9pbWFnZXMvZGFzaGJvYXJkLWNhcmQucG5nXCIpO1xuICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gICAgYmFja2dyb3VuZC1zaXplOiBjb3ZlcjtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgYmFja2dyb3VuZC1wb3NpdGlvbjogcmlnaHQ7XG4gIH1cbiAgLmljb24ge1xuICAgIGhlaWdodDogNTJweDtcbiAgICB3aWR0aDogNTJweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gIH1cbiAgLmNhbnZhcy1jb250YWluZXIge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1heC13aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IGF1dG87XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG5cbiAgLmNhbnZhcy1jb250YWluZXIgY2FudmFzIHtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICB3aWR0aDogMTAwJTtcbiAgICBoZWlnaHQ6IGF1dG87XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 63974:
/*!**********************************************************!*\
  !*** ./src/app/view/user/dashboard/dashboard.service.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DashboardService: () => (/* binding */ DashboardService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);





class DashboardService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  /**
   * class constructor
   * @param http
   */
  constructor(http) {
    super(http);
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
    this.setUri('schedule');
  }
  /**
   * Function to get recent lesson plan
   * @returns
   */
  getRecentLessonPlan() {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('limit', '999').set('sortBy', 'updatedAt').set('filter[type]', 'all').set('filter[isCompleted]', 'true');
    const options = {
      params: params
    };
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/list`, options);
  }
  /**
   * Function to get schedule data
   * @param date
   * @returns
   */
  getScheduleData(date) {
    return this.get(`my-schedules?date=${date}`);
  }
  /**
   * Function to get analytics data
   * @param filterParam
   * @returns
   */
  getChartData(filterParam) {
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/monthly-count?filter=${filterParam}`);
  }
  static {
    this.ɵfac = function DashboardService_Factory(t) {
      return new (t || DashboardService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: DashboardService,
      factory: DashboardService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 37498:
/*!****************************************************************************!*\
  !*** ./src/app/view/user/generation-status/generation-status.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GenerationStatusComponent: () => (/* binding */ GenerationStatusComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 61318);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 59452);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _content_generation_content_generation_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../content-generation/content-generation.service */ 22360);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 90852);








function GenerationStatusComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 8)(1, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](3, "div", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "div", 14)(7, "div", 15)(8, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](9, "div", 17)(10, "div", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](11, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
const _c0 = function (a0, a1, a2, a3) {
  return {
    "bg-[#EB7B4A]": a0,
    "bg-[#D85B32]": a1,
    "bg-[#8B93A7]": a2,
    "bg-[#EDF6FE]": a3
  };
};
const _c1 = function (a0) {
  return {
    "animate-spin": a0
  };
};
const _c2 = function (a0, a1, a2, a3) {
  return {
    "text-[#3D8248] bg-[#F1FDF3]": a0,
    "text-[#DE3B40] bg-[#FDF2F2]": a1,
    "text-[#566074] bg-[#F3F4F8]": a2,
    "text-[#B76E00] bg-[#FFF7E8]": a3
  };
};
const _c3 = function (a0, a1, a2, a3) {
  return {
    "bg-[#3D8248]": a0,
    "bg-[#DE3B40]": a1,
    "bg-[#7B8198]": a2,
    "bg-[#F59E0B]": a3
  };
};
function GenerationStatusComponent_div_7_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "div", 23)(2, "div", 24)(3, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "img", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 27)(6, "h4", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](8, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](9, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 29)(12, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](14, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](15, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](17, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "p", 32)(19, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](20, "img", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](21, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](23, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 35)(25, "h6", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](27, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](28, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](30, "h6", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](32, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](33, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](35, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](36, "div", 35)(37, "h6", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](39, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](40, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](42, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](43, "button", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GenerationStatusComponent_div_7_ng_container_1_Template_button_click_43_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r9);
      const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r7.onView(item_r3));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](44, "h6", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](46, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](47, "div", 41)(48, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](49, "img", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](50, "div", 43)(51, "h4", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](53, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](54, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](55);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](56, "div", 29)(57, "p", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](58);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](59, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](60, "p", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](61);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](62, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](63, "p", 32)(64, "span", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](65, "img", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](66, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](67);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](68, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](69, "h6", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](70);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](71, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](72, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](73);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](74, "h6", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](75);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](76, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](77, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](78);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](79, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](80, "div", 46)(81, "h6", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](82);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](83, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](84, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](85);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](86, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](87, "button", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GenerationStatusComponent_div_7_ng_container_1_Template_button_click_87_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r9);
      const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r10.onView(item_r3));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](88, "h6", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](89);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](90, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction4"](78, _c0, item_r3.presentationStatusTone === "completed", item_r3.presentationStatusTone === "failed", item_r3.presentationStatusTone === "idle", item_r3.presentationStatusTone === "running"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](83, _c1, item_r3.presentationStatusTone === "running"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](8, 36, "Title"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r3.presentationTitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate2"](" ", item_r3.presentationSlideCount || "-", " ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](14, 38, "slides"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](17, 40, "Presentation"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction4"](85, _c2, item_r3.presentationStatusTone === "completed", item_r3.presentationStatusTone === "failed", item_r3.presentationStatusTone === "idle", item_r3.presentationStatusTone === "running"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction4"](90, _c3, item_r3.presentationStatusTone === "completed", item_r3.presentationStatusTone === "failed", item_r3.presentationStatusTone === "idle", item_r3.presentationStatusTone === "running"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", item_r3.presentationStatusTone === "completed" ? "assets/icons/completed-sm.svg" : item_r3.presentationStatusTone === "failed" ? "assets/icons/failed-sm.svg" : item_r3.presentationStatusTone === "idle" ? "assets/icons/draft-light-sm.svg" : "assets/icons/running-sm.svg", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](23, 42, item_r3.presentationStatusLabel));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](27, 44, "Status"), " : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r3.presentationStatusMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](32, 46, "Instructions"), " : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r3.instruction || _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](35, 48, "No extra instructions"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](39, 50, "Created On"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](42, 52, item_r3.updatedAt, "MMM dd,yyyy"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](46, 55, "View Progress"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction4"](95, _c0, item_r3.presentationStatusTone === "completed", item_r3.presentationStatusTone === "failed", item_r3.presentationStatusTone === "idle", item_r3.presentationStatusTone === "running"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction1"](100, _c1, item_r3.presentationStatusTone === "running"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](53, 57, "Title"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r3.presentationTitle);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate2"](" ", item_r3.presentationSlideCount || "-", " ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](59, 59, "slides"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](62, 61, "Presentation"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction4"](102, _c2, item_r3.presentationStatusTone === "completed", item_r3.presentationStatusTone === "failed", item_r3.presentationStatusTone === "idle", item_r3.presentationStatusTone === "running"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction4"](107, _c3, item_r3.presentationStatusTone === "completed", item_r3.presentationStatusTone === "failed", item_r3.presentationStatusTone === "idle", item_r3.presentationStatusTone === "running"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", item_r3.presentationStatusTone === "completed" ? "assets/icons/completed-sm.svg" : item_r3.presentationStatusTone === "failed" ? "assets/icons/failed-sm.svg" : item_r3.presentationStatusTone === "idle" ? "assets/icons/draft-light-sm.svg" : "assets/icons/running-sm.svg", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](68, 63, item_r3.presentationStatusLabel));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](71, 65, "Status"), " : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r3.presentationStatusMessage);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](76, 67, "Instructions"), " : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r3.instruction || _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](79, 69, "No extra instructions"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](83, 71, "Created On"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](86, 73, item_r3.updatedAt, "MMM dd,yyyy"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](90, 76, "View Progress"), " ");
  }
}
function GenerationStatusComponent_div_7_ng_template_2_img_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 66);
  }
}
function GenerationStatusComponent_div_7_ng_template_2_img_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 67);
  }
}
function GenerationStatusComponent_div_7_ng_template_2_img_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "img", 68);
  }
}
function GenerationStatusComponent_div_7_ng_template_2_div_13_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](3, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](3, 3, item_r3.status)));
  }
}
function GenerationStatusComponent_div_7_ng_template_2_div_13_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, "Regenerated"));
  }
}
const _c4 = function (a0, a1, a2) {
  return {
    "bg-green-500": a0,
    "bg-warn": a1,
    "bg-red-500": a2
  };
};
function GenerationStatusComponent_div_7_ng_template_2_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 69)(1, "div", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "img", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](3, GenerationStatusComponent_div_7_ng_template_2_div_13_span_3_Template, 4, 5, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](4, GenerationStatusComponent_div_7_ng_template_2_div_13_span_4_Template, 3, 3, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction3"](4, _c4, item_r3.status === "completed", item_r3.status === "running", item_r3.status === "failed"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", item_r3.status === "running" ? "assets/icons/running-sm.svg" : item_r3.status === "completed" ? "assets/icons/completed-sm.svg" : "assets/icons/failed-sm.svg", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r3.status !== "completed");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r3.status === "completed");
  }
}
function GenerationStatusComponent_div_7_ng_template_2_ng_container_34_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 75)(1, "p", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const subtopic_r25 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", subtopic_r25, " ");
  }
}
function GenerationStatusComponent_div_7_ng_template_2_ng_container_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, GenerationStatusComponent_div_7_ng_template_2_ng_container_34_span_1_Template, 3, 1, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", item_r3.lesson.subTopics);
  }
}
function GenerationStatusComponent_div_7_ng_template_2_div_35_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", item_r3.reason, " ");
  }
}
function GenerationStatusComponent_div_7_ng_template_2_button_36_h6_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h6", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, "Continue Editing"), " ");
  }
}
function GenerationStatusComponent_div_7_ng_template_2_button_36_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "h6", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](2, 1, item_r3.isLesson ? "View Lesson Plan" : "View Lesson Resource"), " ");
  }
}
function GenerationStatusComponent_div_7_ng_template_2_button_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function GenerationStatusComponent_div_7_ng_template_2_button_36_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r34);
      const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
      const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](!item_r3.isCompleted ? ctx_r32.onViewDraft(item_r3) : ctx_r32.onView(item_r3));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, GenerationStatusComponent_div_7_ng_template_2_button_36_h6_1_Template, 3, 3, "h6", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, GenerationStatusComponent_div_7_ng_template_2_button_36_ng_template_2_Template, 3, 3, "ng-template", null, 80, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !item_r3.isCompleted)("ngIfElse", _r29);
  }
}
const _c5 = function (a0, a1, a2) {
  return {
    "bg-purple-100": a0,
    "bg-yellow-100": a1,
    "bg-red-100": a2
  };
};
function GenerationStatusComponent_div_7_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div")(1, "div", 49)(2, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](3, GenerationStatusComponent_div_7_ng_template_2_img_3_Template, 1, 0, "img", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](4, GenerationStatusComponent_div_7_ng_template_2_img_4_Template, 1, 0, "img", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](5, GenerationStatusComponent_div_7_ng_template_2_img_5_Template, 1, 0, "img", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div", 54)(7, "h6", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](12, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](13, GenerationStatusComponent_div_7_ng_template_2_div_13_Template, 5, 8, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](14, "div", 56)(15, "h4", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](17, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](18, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "div", 58)(21, "p", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](23, "p", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](25, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](26, "h6", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](28, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](30);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](31, "h6", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](33, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](34, GenerationStatusComponent_div_7_ng_template_2_ng_container_34_Template, 2, 1, "ng-container", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](35, GenerationStatusComponent_div_7_ng_template_2_div_35_Template, 2, 1, "div", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](36, GenerationStatusComponent_div_7_ng_template_2_button_36_Template, 4, 2, "button", 65);
  }
  if (rf & 2) {
    const item_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction3"](30, _c5, item_r3.status === "completed", item_r3.status === "running", item_r3.status === "failed"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r3.status === "completed");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r3.status === "running");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r3.status === "failed");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](9, 17, item_r3.status === "running" ? "Initiated On" : item_r3.status === "completed" ? "Generated On" : "Last updated On"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](12, 19, item_r3.status === "running" ? item_r3.regeneratedcreatedAt : item_r3.regeneratedupdatedAt, "MMM dd,yyyy"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !item_r3.isCompleted);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](17, 22, "Subject"), ": ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r3.isLesson ? ctx_r6.utilityservice.getSubjectDisplayName(item_r3.lesson.subjects) : ctx_r6.utilityservice.getSubjectDisplayName(item_r3.resource.subjects));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" Class ", item_r3.isLesson ? item_r3.lesson.class : item_r3.resource.class, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](25, 24, item_r3.isLesson ? "Lesson Plan" : "Lesson Resource"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](28, 26, "Chapter"), " : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](item_r3.isLesson ? (item_r3.lesson.chapter == null ? null : item_r3.lesson.chapter.orderNumber) + ". " + item_r3.lesson.chapter.topics : (item_r3.resource.chapter == null ? null : item_r3.resource.chapter.orderNumber) + ". " + item_r3.resource.chapter.topics);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](33, 28, "Sub-Topic"), " : ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r3.isLesson);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r3.status === "failed" && item_r3.reason);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r3.status === "completed");
  }
}
function GenerationStatusComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, GenerationStatusComponent_div_7_ng_container_1_Template, 91, 112, "ng-container", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, GenerationStatusComponent_div_7_ng_template_2_Template, 37, 34, "ng-template", null, 22, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r3 = ctx.$implicit;
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵreference"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", item_r3.isPresentation)("ngIfElse", _r5);
  }
}
function GenerationStatusComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 81)(1, "div", 82)(2, "div", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "img", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](4, "div", 43)(5, "h4", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](7, 1, "No items found"), " ");
  }
}
class GenerationStatusComponent {
  constructor(contentGenService, utilityservice, router) {
    this.contentGenService = contentGenService;
    this.utilityservice = utilityservice;
    this.router = router;
    this.currentPage = 1;
    this.pageSize = 6;
    this.totalItems = 0;
    this.list = [];
    this.isInitialStatusLoading = true;
    this.presentationStreams = new Map();
  }
  ngOnInit() {
    this.getAllList(this.getListParams());
  }
  ngOnDestroy() {
    this.closeAllPresentationStreams();
  }
  onPageChange(page) {
    this.currentPage = page;
    this.getAllList(this.getListParams());
  }
  onView(data) {
    if (data.isPresentation) {
      this.router.navigate([`/content-generation/presentation/${data.id}`]);
      return;
    }
    if (data.isLesson) {
      this.router.navigate([`/content-generation/lesson-plan/${data.lesson._id}`]);
      return;
    }
    this.router.navigate([`/content-generation/resource-plan/${data.resource._id}`]);
  }
  onViewDraft(data) {
    if (data.isPresentation) {
      this.router.navigate([`/content-generation/presentation/${data.id}`]);
      return;
    }
    if (data.isLesson) {
      this.router.navigate([`/content-generation/lesson-plan/draft/${data.lesson._id}`]);
      return;
    }
    this.router.navigate([`/content-generation/resource-plan/draft/${data.resource._id}`]);
  }
  getListParams() {
    return {
      currentPage: this.currentPage,
      pageSize: this.pageSize
    };
  }
  getAllList(params) {
    this.closeAllPresentationStreams();
    this.contentGenService.getPresentationJobs(params).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.catchError)(() => (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.of)(null))).subscribe({
      next: res => {
        const nextList = this.filterPresentationJobs(Array.isArray(res) ? res : []).map(item => this.mapPresentationJob(item)).sort((a, b) => this.getItemTimestamp(b) - this.getItemTimestamp(a));
        this.list = nextList;
        this.totalItems = nextList.length;
        this.isInitialStatusLoading = false;
        this.syncPresentationStreams();
      },
      error: err => {
        this.isInitialStatusLoading = false;
        this.utilityservice.handleError(err);
      }
    });
  }
  filterPresentationJobs(list) {
    return list.filter(item => item.status !== 'complete');
  }
  mapPresentationJob(item) {
    const totalSlides = item.metadata?.quality?.total_slides || item.metadata?.plan?.outline?.total_slides || item.slides;
    const isCompleted = item.status === 'complete';
    const isRecovering = item.status === 'error' && item.metadata?.error?.attempting_recovery === true;
    const isTerminalError = item.status === 'error' && item.metadata?.error?.attempting_recovery === false;
    return {
      ...item,
      isPresentation: true,
      isCompleted,
      updatedAt: item.creation_time,
      presentationTitle: item.metadata?.plan?.outline?.title || 'Presentation deck',
      presentationStatusTone: isCompleted ? 'completed' : isTerminalError ? 'failed' : item.status === 'idle' ? 'idle' : 'running',
      presentationStatusLabel: isCompleted ? 'Completed' : isTerminalError ? 'Error' : isRecovering ? 'Recovering' : item.status === 'idle' ? 'Idle' : 'In Progress',
      presentationStatusMessage: item.message || 'Presentation job created',
      presentationSlideCount: totalSlides
    };
  }
  getItemTimestamp(item) {
    return new Date(item.updatedAt || item.regeneratedupdatedAt || item.regeneratedcreatedAt || item.creation_time || 0).getTime();
  }
  syncPresentationStreams() {
    const activePresentationIds = new Set(this.list.filter(item => item.isPresentation && item.status !== 'complete' && !(item.status === 'error' && item.metadata?.error?.attempting_recovery === false)).map(item => item.id));
    Array.from(this.presentationStreams.keys()).forEach(jobId => {
      if (!activePresentationIds.has(jobId)) {
        this.closePresentationStream(jobId);
      }
    });
    this.list.forEach(item => {
      if (!item.isPresentation || item.status === 'complete' || item.status === 'error' && item.metadata?.error?.attempting_recovery === false || this.presentationStreams.has(item.id)) {
        return;
      }
      this.contentGenService.openPresentationEventStream(item.id, event => {
        try {
          const payload = JSON.parse(event.data);
          if (payload?.type !== 'update' || !payload?.data) {
            return;
          }
          this.updatePresentationJob(payload.data);
        } catch {
          // Ignore malformed stream payloads.
        }
      }, () => {
        this.closePresentationStream(item.id);
        this.getAllList(this.getListParams());
      }).then(stream => {
        this.presentationStreams.set(item.id, stream);
      });
    });
  }
  updatePresentationJob(job) {
    const index = this.list.findIndex(item => item.isPresentation && item.id === job.id);
    if (index === -1) {
      return;
    }
    const nextList = [...this.list];
    if (job.status === 'complete') {
      nextList.splice(index, 1);
      this.closePresentationStream(job.id);
    } else {
      nextList[index] = this.mapPresentationJob(job);
      if (job.status === 'error' && job.metadata?.error?.attempting_recovery === false) {
        this.closePresentationStream(job.id);
      }
    }
    this.list = nextList.sort((a, b) => this.getItemTimestamp(b) - this.getItemTimestamp(a));
    this.totalItems = this.list.length;
  }
  closePresentationStream(jobId) {
    const stream = this.presentationStreams.get(jobId);
    if (!stream) return;
    this.contentGenService.closePresentationEventStream(stream);
    this.presentationStreams.delete(jobId);
  }
  closeAllPresentationStreams() {
    Array.from(this.presentationStreams.keys()).forEach(jobId => this.closePresentationStream(jobId));
  }
  static {
    this.ɵfac = function GenerationStatusComponent_Factory(t) {
      return new (t || GenerationStatusComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_content_generation_content_generation_service__WEBPACK_IMPORTED_MODULE_0__.ContentGenerationService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: GenerationStatusComponent,
      selectors: [["app-generation-status"]],
      decls: 10,
      vars: 9,
      consts: [[1, "p-8", "bg-white", "rounded-sm", "min-h-[90vh]"], [1, "flex", "items-center", "justify-between", "mt-5", "gap-4", "flex-wrap"], [1, "text-xl", "md:text-3xl", "font-bold", "text-content", "main-heading", "leading-[48px]"], [1, "flex", "flex-col", "gap-4", "mt-5"], ["class", "px-6 py-5 min-h-[96px] rounded-xl bg-white border flex items-center justify-between gap-4 animate-pulse w-full", 4, "ngIf"], ["class", "card px-6 py-5 rounded-xl bg-white border flex flex-col justify-between", 4, "ngFor", "ngForOf"], [3, "totalItems", "pageSize", "currentPage", "pageChange"], ["class", "flex w-full", 4, "ngIf"], [1, "px-6", "py-5", "min-h-[96px]", "rounded-xl", "bg-white", "border", "flex", "items-center", "justify-between", "gap-4", "animate-pulse", "w-full"], [1, "flex", "items-center", "gap-4", "flex-1", "min-w-0"], [1, "w-12", "h-12", "rounded-full", "bg-slate-200", "shrink-0"], [1, "flex-1", "min-w-0"], [1, "h-5", "w-2/3", "bg-slate-200", "rounded"], [1, "flex", "gap-2", "mt-3"], [1, "h-6", "w-16", "bg-slate-200", "rounded-full"], [1, "h-6", "w-20", "bg-slate-200", "rounded-full"], [1, "h-6", "w-24", "bg-slate-200", "rounded-full"], [1, "h-4", "w-3/4", "bg-slate-200", "rounded", "mt-3"], [1, "h-4", "w-full", "bg-slate-200", "rounded", "mt-2"], [1, "w-40", "h-10", "bg-slate-200", "rounded", "shrink-0"], [1, "card", "px-6", "py-5", "rounded-xl", "bg-white", "border", "flex", "flex-col", "justify-between"], [4, "ngIf", "ngIfElse"], ["statusLessonOrResource", ""], [1, "md:hidden"], [1, "flex", "items-start", "gap-3"], [1, "icon", "flex", "justify-center", "items-center", "shrink-0", "w-12", "h-12", 3, "ngClass"], ["src", "assets/icons/generation-status-light.svg", "alt", "", 3, "ngClass"], [1, "min-w-0", "flex-1"], [1, "text-sm", "font-medium", "leading-6"], [1, "flex", "flex-wrap", "items-center", "gap-2", "mt-2"], [1, "px-2", "py-1", "rounded-full", "text-primary", "bg-[#F1F4FD]", "text-[11px]"], [1, "px-2", "py-1", "rounded-full", "text-[#DE3B40]", "bg-[#FDF2F2]", "text-[11px]"], [1, "px-2", "py-1", "rounded-full", "text-[11px]", "inline-flex", "items-center", "gap-1", 3, "ngClass"], [1, "w-4", "h-4", "rounded-full", "inline-flex", "items-center", "justify-center", "shrink-0", 3, "ngClass"], ["alt", "", 1, "w-3", "h-3", 3, "src"], [1, "mt-3"], [1, "text-xs", "font-normal", "text-content-70"], [1, "mt-0.5", "text-xs", "font-normal", "text-content-70", "line-clamp-2"], [1, "text-xs", "font-normal", "text-content-70", "mb-2"], [1, "btn-primary", "w-full", "py-2", "px-4", "rounded", 3, "click"], [1, "text-white", "text-sm", "font-semibold"], [1, "hidden", "md:grid", "md:grid-cols-[56px_minmax(0,1fr)_auto]", "gap-4", "items-start"], [1, "icon", "flex", "justify-center", "items-center", "shrink-0", 3, "ngClass"], [1, "min-w-0"], [1, "text-base", "font-medium", "leading-6"], [1, "text-xs", "font-normal", "text-content-70", "mt-2"], [1, "flex", "flex-col", "items-end", "gap-2", "shrink-0"], [1, "text-xs", "font-normal", "text-content-70", "whitespace-nowrap"], [1, "btn-primary", "min-w-[160px]", "py-2", "px-4", "rounded", 3, "click"], [1, "flex", "justify-between"], [1, "icon", "flex", "justify-center", "items-center", 3, "ngClass"], ["src", "assets/icons/basil_document-solid.svg", "alt", "", 4, "ngIf"], ["src", "assets/icons/file-yellow.svg", "alt", "", 4, "ngIf"], ["src", "assets/icons/file-red.svg", "alt", "", 4, "ngIf"], [1, "flex", "flex-col", "items-end"], ["class", "mt-2 px-2 py-1 rounded-2xl", 3, "ngClass", 4, "ngIf"], [1, "mt-5"], [1, "text-sm", "font-medium"], [1, "flex", "items-center", "justify-start", "my-2"], [1, "px-2", "py-1", "rounded-full", "text-primary", "bg-[#F1F4FD]", "text-[11px]", "inline-block", "me-2"], [1, "px-2", "py-1", "rounded-full", "text-[#DE3B40]", "bg-[#FDF2F2]", "text-[11px]", "inline-block"], [1, "my-2", "text-xs", "font-normal", "text-content-70"], [1, "mt-2", "text-xs", "font-normal", "text-content-70"], [4, "ngIf"], ["class", "bg-red-50 text-content rounded-lg p-4 text-xs", 4, "ngIf"], ["class", "mt-7 w-full py-2 rounded bg-[#A062F7]", 3, "click", 4, "ngIf"], ["src", "assets/icons/basil_document-solid.svg", "alt", ""], ["src", "assets/icons/file-yellow.svg", "alt", ""], ["src", "assets/icons/file-red.svg", "alt", ""], [1, "mt-2", "px-2", "py-1", "rounded-2xl", 3, "ngClass"], [1, "flex", "items-center", "gap-1"], ["alt", "", 3, "src"], ["class", "text-xs text-white", 4, "ngIf"], [1, "text-xs", "text-white"], ["class", "", 4, "ngFor", "ngForOf"], [1, ""], [1, "subtopic-chip", "px-2", "py-1", "my-1", "rounded-full", "text-[#3D8248]", "bg-[#F1FDF3]", "text-[11px]", "me-2", "inline-block"], [1, "bg-red-50", "text-content", "rounded-lg", "p-4", "text-xs"], [1, "mt-7", "w-full", "py-2", "rounded", "bg-[#A062F7]", 3, "click"], ["class", "text-white text-sm font-semibold", 4, "ngIf", "ngIfElse"], ["viewLR", ""], [1, "flex", "w-full"], [1, "w-full", "px-6", "py-5", "flex", "items-center", "gap-4", "rounded-xl", "bg-white", "border"], [1, "rounded-full", "bg-warn-50", "p-4", "shrink-0"], ["src", "assets/icons/no-file.svg", "alt", ""], [1, "text-base", "font-medium"]],
      template: function GenerationStatusComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](6, GenerationStatusComponent_div_6_Template, 12, 0, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, GenerationStatusComponent_div_7_Template, 4, 2, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "app-pagination", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("pageChange", function GenerationStatusComponent_Template_app_pagination_pageChange_8_listener($event) {
            return ctx.onPageChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](9, GenerationStatusComponent_div_9_Template, 8, 3, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](4, 7, "Generation Status"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.isInitialStatusLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.list);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("totalItems", ctx.totalItems)("pageSize", ctx.pageSize)("currentPage", ctx.currentPage);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", !ctx.isInitialStatusLoading && ctx.list.length === 0);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_2__.PaginationComponent, _angular_common__WEBPACK_IMPORTED_MODULE_7__.TitleCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_7__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslatePipe],
      styles: ["h1[_ngcontent-%COMP%] {\n  font-weight: 700;\n}\n\n.icon[_ngcontent-%COMP%] {\n  height: 52px;\n  width: 52px;\n  border-radius: 50%;\n}\n\n.card[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImdlbmVyYXRpb24tc3RhdHVzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0MsZ0JBQUE7QUFDRDs7QUFFQTtFQUNFLFlBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLDhCQUFBO0FBQ0YiLCJmaWxlIjoiZ2VuZXJhdGlvbi1zdGF0dXMuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJoMXtcblx0Zm9udC13ZWlnaHQ6IDcwMDtcbn1cblxuLmljb24ge1xuICBoZWlnaHQ6IDUycHg7XG4gIHdpZHRoOiA1MnB4O1xuICBib3JkZXItcmFkaXVzOiA1MCU7XG59XG5cbi5jYXJkIHtcbiAgZGlzcGxheTogZmxleDtcbiAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xufVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL2dlbmVyYXRpb24tc3RhdHVzL2dlbmVyYXRpb24tc3RhdHVzLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0MsZ0JBQUE7QUFDRDs7QUFFQTtFQUNFLFlBQUE7RUFDQSxXQUFBO0VBQ0Esa0JBQUE7QUFDRjs7QUFFQTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLDhCQUFBO0FBQ0Y7QUFDQSx3b0JBQXdvQiIsInNvdXJjZXNDb250ZW50IjpbImgxe1xuXHRmb250LXdlaWdodDogNzAwO1xufVxuXG4uaWNvbiB7XG4gIGhlaWdodDogNTJweDtcbiAgd2lkdGg6IDUycHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbn1cblxuLmNhcmQge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 78790:
/*!********************************************************!*\
  !*** ./src/app/view/user/profile/profile.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProfileComponent: () => (/* binding */ ProfileComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_utility_languege_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/languege.util */ 59113);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs */ 61873);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _profile_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./profile.service */ 71594);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/services/master.service */ 2216);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_layout_sidebar_sidebar_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/layout/sidebar/sidebar.service */ 41883);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/components/form-dropdown/form-dropdown.component */ 55233);
/* harmony import */ var _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../shared/components/language-switcher/language-switcher.component */ 5429);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../shared/components/profile-image/profile-image.component */ 85445);
















function ProfileComponent_button_26_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ProfileComponent_button_26_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r9);
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r8.showDeleteProfileImageConfirm = true);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, "Remove"), " ");
  }
}
function ProfileComponent_th_88_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "th", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const header_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, header_r10), " ");
  }
}
function ProfileComponent_tr_90_button_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ProfileComponent_tr_90_button_43_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r18);
      const i_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().index;
      const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r16.openConfirmPopupforDeleteClass(i_r13));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "img", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 1, "Delete"));
  }
}
function ProfileComponent_tr_90_button_44_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ProfileComponent_tr_90_button_44_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r20);
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r19.addNewclasses("add"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](1, "img", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "span", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 1, "Add"));
  }
}
function ProfileComponent_tr_90_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "tr", 59)(1, "td", 60)(2, "label", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](5, "span", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](6, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "app-form-dropdown", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function ProfileComponent_tr_90_Template_app_form_dropdown_valueChange_7_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r22);
      const i_r13 = restoredCtx.index;
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r21.setMediumSubjectDropdown(i_r13, $event, "add"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "td", 60)(9, "label", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](11, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](12, "span", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](13, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "app-form-dropdown", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function ProfileComponent_tr_90_Template_app_form_dropdown_valueChange_14_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r22);
      const i_r13 = restoredCtx.index;
      const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r23.setClassDropdown(i_r13, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "td", 60)(16, "label", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](18, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](19, "span", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](20, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](21, "app-form-dropdown", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function ProfileComponent_tr_90_Template_app_form_dropdown_valueChange_21_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r22);
      const i_r13 = restoredCtx.index;
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r24.setStrength(i_r13, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](22, "td", 60)(23, "label", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](24);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](25, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](26, "span", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](27, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](28, "app-form-dropdown", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function ProfileComponent_tr_90_Template_app_form_dropdown_valueChange_28_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r22);
      const i_r13 = restoredCtx.index;
      const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r25.subjectMapper(i_r13, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](29, "td", 60)(30, "label", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](32, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](33, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](35, "td", 60)(36, "label", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](37);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](38, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](39, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](40);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](41, "td", 60)(42, "div", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](43, ProfileComponent_tr_90_button_43_Template, 5, 3, "button", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](44, ProfileComponent_tr_90_button_44_Template, 5, 3, "button", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const class_r12 = ctx.$implicit;
    const i_r13 = ctx.index;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    let tmp_26_0;
    let tmp_28_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroupName", i_r13);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](4, 31, "Board"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "board")("dropDownCtrl", ctx_r3.convertToFormControl(class_r12.get("board")))("dropDownValues", ctx_r3.boardDropdownOptions)("config", ctx_r3.boardTypeDropdownconfig)("submitted", ctx_r3.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](11, 33, "Medium"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "medium")("dropDownCtrl", ctx_r3.convertToFormControl(class_r12.get("medium")))("dropDownValues", ctx_r3.mediumDropdownOptions[i_r13])("config", ctx_r3.mediumTypeDropdownconfig)("submitted", ctx_r3.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](18, 35, "Class"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "class")("dropDownCtrl", ctx_r3.convertToFormControl(class_r12.get("class")))("dropDownValues", ctx_r3.classDropdownOptions[i_r13])("config", ctx_r3.classTypeDropdownconfig)("submitted", ctx_r3.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](25, 37, "Subject"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "subject")("dropDownCtrl", ctx_r3.convertToFormControl(class_r12.get("subject")))("dropDownValues", ctx_r3.subjectDropdownOptions[i_r13])("config", ctx_r3.subjectTypeDropdownconfig)("submitted", ctx_r3.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](32, 39, "Boys Strength"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](((tmp_26_0 = class_r12.get("boysStrength")) == null ? null : tmp_26_0.value) || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](38, 41, "Girls Strength"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](((tmp_28_0 = class_r12.get("girlsStrength")) == null ? null : tmp_28_0.value) || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", i_r13 !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", i_r13 === ctx_r3.getFormArray("classes").controls.length - 1);
  }
}
function ProfileComponent_div_97_input_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](0, "input", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](1, "translate");
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](1, 1, "Enter resource type"));
  }
}
function ProfileComponent_div_97_p_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, "Resource type required"), " ");
  }
}
function ProfileComponent_div_97_label_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "label", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, "Resource Details"));
  }
}
function ProfileComponent_div_97_div_13_p_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "p", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](2, 1, "Resource details required"), " ");
  }
}
const _c0 = function () {
  return {
    standalone: true
  };
};
function ProfileComponent_div_97_div_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div")(1, "div", 90)(2, "div", 91)(3, "label", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](6, "input", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("ngModelChange", function ProfileComponent_div_97_div_13_Template_input_ngModelChange_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r37);
      const i_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().index;
      const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r36.resourceOtherValue[i_r27] = $event);
    })("keydown.enter", function ProfileComponent_div_97_div_13_Template_input_keydown_enter_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r37);
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      const resource_r26 = ctx_r40.$implicit;
      const i_r27 = ctx_r40.index;
      const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      $event.preventDefault();
      $event.stopPropagation();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r39.addOtherResource(resource_r26, i_r27, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "button", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ProfileComponent_div_97_div_13_Template_button_click_8_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r37);
      const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      const resource_r26 = ctx_r42.$implicit;
      const i_r27 = ctx_r42.index;
      const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r41.addOtherResource(resource_r26, i_r27, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](9, "div", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](10, "img", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](11, ProfileComponent_div_97_div_13_p_11_Template, 3, 3, "p", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    const i_r27 = ctx_r43.index;
    const resource_r26 = ctx_r43.$implicit;
    const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    let tmp_4_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 5, "Resource Details"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](7, 7, "Enter resource details"));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngModel", ctx_r31.resourceOtherValue[i_r27])("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](9, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_4_0 = resource_r26.get("detailsChipSet")) == null ? null : tmp_4_0.value) && ctx_r31.submitted && ((tmp_4_0 = resource_r26.get("details")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["required"]));
  }
}
function ProfileComponent_div_97_ng_container_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r48 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "span", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span", 98);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ProfileComponent_div_97_ng_container_15_Template_span_click_3_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r48);
      const i_r45 = restoredCtx.index;
      const resource_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().$implicit;
      const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r46.removeItem(resource_r26, i_r45));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r44 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", item_r44, " ");
  }
}
function ProfileComponent_div_97_button_18_Template(rf, ctx) {
  if (rf & 1) {
    const _r51 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 99);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ProfileComponent_div_97_button_18_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r51);
      const i_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]().index;
      const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r49.openConfirmPopupforDeleteResource(i_r27));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](2, "img", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 1, "Delete"));
  }
}
function ProfileComponent_div_97_button_19_Template(rf, ctx) {
  if (rf & 1) {
    const _r53 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "button", 102);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ProfileComponent_div_97_button_19_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r53);
      const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r52.addResource());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](1, "div", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](2, "img", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](3, "span", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](5, 1, "Add"));
  }
}
function ProfileComponent_div_97_Template(rf, ctx) {
  if (rf & 1) {
    const _r55 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "div", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](1, 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](2, "div", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "div")(5, "app-form-dropdown", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("valueChange", function ProfileComponent_div_97_Template_app_form_dropdown_valueChange_5_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r55);
      const i_r27 = restoredCtx.index;
      const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r54.setResourceDetailsValues(i_r27, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](6, ProfileComponent_div_97_input_6_Template, 2, 3, "input", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](7, ProfileComponent_div_97_p_7_Template, 3, 3, "p", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](8, "div", 74)(9, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](10, ProfileComponent_div_97_label_10_Template, 3, 3, "label", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "div", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](12, "app-form-dropdown", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](13, ProfileComponent_div_97_div_13_Template, 12, 10, "div", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](14, "div", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](15, ProfileComponent_div_97_ng_container_15_Template, 5, 1, "ng-container", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](16, "div", 83)(17, "div", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](18, ProfileComponent_div_97_button_18_Template, 6, 3, "button", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](19, ProfileComponent_div_97_button_19_Template, 6, 3, "button", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const resource_r26 = ctx.$implicit;
    const i_r27 = ctx.index;
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
    let tmp_4_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    let tmp_9_0;
    let tmp_15_0;
    let tmp_16_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroupName", i_r27);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "type")("dropDownCtrl", ctx_r4.convertToFormControl(resource_r26.get("type")))("dropDownValues", ctx_r4.resourceTypeDropdownOptions)("config", ((tmp_4_0 = resource_r26.get("typeChipSet")) == null ? null : tmp_4_0.value) ? ctx_r4.resourceTypeDropdownconfig : ctx_r4.resourceTypeDarkDropdownconfig)("submitted", ctx_r4.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_6_0 = resource_r26.get("typeChipSet")) == null ? null : tmp_6_0.value));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_7_0 = resource_r26.get("typeChipSet")) == null ? null : tmp_7_0.value) && ctx_r4.submitted && ((tmp_7_0 = resource_r26.get("otherType")) == null ? null : tmp_7_0.errors == null ? null : tmp_7_0.errors["required"]));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", (tmp_8_0 = resource_r26.get("detailsChipSet")) == null ? null : tmp_8_0.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("hidden", !((tmp_9_0 = resource_r26.get("detailsChipSet")) == null ? null : tmp_9_0.value));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("dropDownControlName", "details")("dropDownCtrl", ctx_r4.convertToFormControl(resource_r26.get("details")))("dropDownValues", ctx_r4.resourceDetailsDropdownOptions[i_r27])("config", ctx_r4.resourceDetailsDropdownconfig)("submitted", ctx_r4.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", !((tmp_15_0 = resource_r26.get("detailsChipSet")) == null ? null : tmp_15_0.value));
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", (tmp_16_0 = resource_r26.get("details")) == null ? null : tmp_16_0.value);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngClass", i_r27 === 0 ? "justify-end md:justify-center" : "justify-end md:justify-start");
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", i_r27 !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", i_r27 === ctx_r4.facilities.controls.length - 1);
  }
}
const _c1 = "Are you sure you want to delete this class details?";
const _c2 = function () {
  return {
    heading: "Delete Class Details",
    confirmationText: _c1,
    primaryButtonLabel: "Delete",
    primaryButtonType: "delete"
  };
};
function ProfileComponent_app_delete_detail_103_Template(rf, ctx) {
  if (rf & 1) {
    const _r57 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "app-delete-detail", 103);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("close", function ProfileComponent_app_delete_detail_103_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r57);
      const ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r56.closeDeleteClass($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](1, _c2));
  }
}
const _c3 = function () {
  return {
    heading: "Delete Resource",
    confirmationText: "Are you sure you want to delete this resource?",
    primaryButtonLabel: "Delete",
    primaryButtonType: "delete"
  };
};
function ProfileComponent_app_delete_detail_104_Template(rf, ctx) {
  if (rf & 1) {
    const _r59 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "app-delete-detail", 103);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("close", function ProfileComponent_app_delete_detail_104_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r59);
      const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r58.closeDeleteResource($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](1, _c3));
  }
}
const _c4 = function () {
  return {
    heading: "Remove Profile Image",
    confirmationText: "Are you sure you want to remove profile image?",
    primaryButtonLabel: "Remove",
    primaryButtonType: "delete"
  };
};
function ProfileComponent_app_delete_detail_105_Template(rf, ctx) {
  if (rf & 1) {
    const _r61 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "app-delete-detail", 103);
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("close", function ProfileComponent_app_delete_detail_105_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r61);
      const ctx_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx_r60.closeDeleteProfileImage($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpureFunction0"](1, _c4));
  }
}
class ProfileComponent {
  constructor(fb, service, utilityService, masterService, router, sidebarService, translateService) {
    this.fb = fb;
    this.service = service;
    this.utilityService = utilityService;
    this.masterService = masterService;
    this.router = router;
    this.sidebarService = sidebarService;
    this.translateService = translateService;
    this.languageConfig = src_app_shared_utility_languege_util__WEBPACK_IMPORTED_MODULE_0__.languege;
    this.langDropDownConfig = {
      isBackground: false,
      placeHolderTxt: 'Select Preferred Language',
      height: 'auto',
      fieldName: 'languege'
    };
    this.submitted = false;
    this.boardDropdownOptions = [];
    this.boardTypeDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select board',
      height: 'auto',
      fieldName: 'Board',
      hideLabel: true,
      bindLable: '_id',
      bindValue: '_id'
    };
    this.mediumDropdownOptions = [];
    this.mediumTypeDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select medium',
      height: 'auto',
      fieldName: 'Medium',
      hideLabel: true,
      bindLable: 'medium',
      bindValue: 'medium'
    };
    this.classDropdownOptions = [];
    this.classTypeDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select class',
      height: 'auto',
      fieldName: 'Standard',
      hideLabel: true,
      bindLable: 'standard',
      bindValue: 'standard'
    };
    this.subjectDropdownOptions = [];
    this.subjectTypeDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select subject',
      height: 'auto',
      fieldName: 'Subject',
      hideLabel: true,
      bindLable: '_id',
      bindValue: '_id'
    };
    this.resourceTypeDropdownOptions = [];
    this.resourceTypeDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select Resource',
      height: 'auto',
      fieldName: 'Resource Type',
      hideLabel: false,
      bindLable: 'type',
      bindValue: 'type'
    };
    this.resourceTypeDarkDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Type',
      height: 'auto',
      fieldName: 'Resource Type',
      hideLabel: false,
      bindLable: 'type',
      bindValue: 'type'
    };
    this.resourceOtherValue = [''];
    this.resourceDetailsDropdownOptions = [];
    this.resourceDetailsDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select details',
      height: 'auto',
      fieldName: 'Resource Details',
      multi: true,
      clearableOff: true,
      hideLabel: true,
      hideChips: true
    };
    this.schoolTableHeader = ['Board', 'Medium', 'Class / Grade', 'Subject', 'No. of Boys', 'No. of Girls', 'Action'];
    this.defaultBoard = null;
    this.defaultMedium = null;
    this.showDeleteProfileImageConfirm = false;
    this.currentSubjects = [];
  }
  /**
   * Angular oninit lifecycle hook used here for form initialization
   */
  ngOnInit() {
    const data = localStorage.getItem('userData') ?? '';
    this.loggedInUser = JSON.parse(data);
    this.createUserForm();
    this.getData();
  }
  /**
   * Function to get all master data and profile data
   */
  getData() {
    const boardMaster = this.service.getClassesByBoard(this.loggedInUser.school._id);
    const resourceMaster = this.masterService.getFacilities();
    const userProfile = this.service.getProfileInfo(this.loggedInUser._id);
    (0,rxjs__WEBPACK_IMPORTED_MODULE_10__.forkJoin)([boardMaster, resourceMaster, userProfile]).subscribe({
      next: ([boardRes, resourceRes, profileRes]) => {
        this.setClassesByBoard(boardRes);
        this.setResourceData(resourceRes);
        this.setProfileInfo(profileRes);
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  setClassesByBoard(val) {
    this.boardMasterData = val.data;
    this.boardDropdownOptions = val.data;
    this.presetValues(this.boardMasterData);
  }
  /**
   * Function to get set present value if one board or medium
   * @param data
   */
  presetValues(data) {
    if (data.length === 1) {
      this.defaultBoard = data[0]._id;
      if (data[0].medium.length === 1) {
        this.defaultMedium = data[0].medium[0].medium;
      }
    }
  }
  /**
   * Function to set section and subject
   * @param i
   * @param val
   */
  setMediumSubjectDropdown(i, val, mode) {
    this.resetclassInfo('board', i);
    if (val) {
      this.mediumDropdownOptions[i] = val.medium;
      this.currentSubjects[i] = val.subjects;
      // this.subjectDropdownOptions[i] = val.subjects;
      if (val.medium.length === 1 && mode === 'add') {
        this.classes.controls[i].get('medium')?.setValue(val.medium[0].medium);
        this.classDropdownOptions[i] = val.medium[0].classDetails;
      }
    }
  }
  setClassDropdown(i, val) {
    this.resetclassInfo('medium', i);
    if (val) {
      this.classDropdownOptions[i] = val.classDetails;
    }
  }
  /**
   * Function to set strength
   * @param i
   * @param val
   */
  setStrength(i, val) {
    this.resetclassInfo('standard', i);
    if (val) {
      this.subjectDropdownOptions[i] = this.filterSubjects(val.standard, this.currentSubjects[i]);
      this.resetclassInfo('strength', i);
      this.classes.controls[i].get('boysStrength')?.setValue(val.boysStrength);
      this.classes.controls[i].get('girlsStrength')?.setValue(val.girlsStrength);
    } else {
      this.resetclassInfo('strength', i);
    }
  }
  /**
   * Function to reset class info
   * @param type
   * @param i
   */
  resetclassInfo(type, i) {
    if (type === 'board') {
      this.classes.controls[i].get('medium')?.reset();
      this.classes.controls[i].get('class')?.reset();
      this.classes.controls[i].get('subject')?.reset();
      this.classes.controls[i].get('subjectDetails')?.reset();
      this.classDropdownOptions[i] = [];
      this.mediumDropdownOptions[i] = [];
      this.subjectDropdownOptions[i] = [];
    } else if (type === 'medium') {
      this.classes.controls[i].get('class')?.reset();
      this.classes.controls[i].get('subject')?.reset();
      this.classes.controls[i].get('subjectDetails')?.reset();
      this.classDropdownOptions[i] = [];
      this.subjectDropdownOptions[i] = [];
    } else if (type === 'standard') {
      this.subjectDropdownOptions[i] = [];
      this.classes.controls[i].get('subject')?.reset();
      this.classes.controls[i].get('subjectDetails')?.reset();
    }
    this.classes.controls[i].get('boysStrength')?.reset();
    this.classes.controls[i].get('girlsStrength')?.reset();
  }
  /**
   * Function to get profile info
   */
  setProfileInfo(val) {
    const schoolFacilities = val?.data?.school?.facilities;
    this.mergeSchoolResource(schoolFacilities);
    this.userData = val?.data;
    const keysToRemove = ['classes', 'facilities'];
    const {
      newObj,
      removedObj
    } = this.utilityService.removeKeys(val?.data, keysToRemove);
    this.patchObj = newObj;
    this.dependentPatchData = removedObj;
    if (this.dependentPatchData.classes && this.dependentPatchData.classes.length > 0) {
      for (let data of this.dependentPatchData.classes) {
        if (data) {
          this.addNewclasses('edit');
        }
      }
      this.patchClasses();
    } else {
      this.addNewclasses('add');
    }
    if (this.dependentPatchData.facilities && this.dependentPatchData.facilities.length > 0) {
      this.resourceTypeDropdownOptions = this.resourceMasterData;
      for (let i = 0; i < this.dependentPatchData.facilities.length - 1; i++) {
        this.addResource();
      }
      this.patchResourceDropdown();
    }
  }
  /**
   * Function to create user profile form
   */
  createUserForm() {
    this.userPorfileForm = this.fb.group({
      classes: this.fb.array([]),
      facilities: this.fb.array([]),
      preferredLanguage: [this.loggedInUser?.preferredLanguage]
    });
    this.addResource();
  }
  /**
   * Function to get resource data
   */
  setResourceData(val) {
    this.resourceTypeDropdownOptions = val?.data?.results;
    this.resourceMasterData = val?.data?.results;
  }
  mergeSchoolResource(schoolResource) {
    const schoolOthers = schoolResource.filter(ele => ele.type == 'Others').map(item => {
      return {
        type: item.otherType,
        facilities: item.details,
        otherType: null,
        typeChipSet: item.typeChipSet,
        detailsChipSet: item.detailsChipSet
      };
    });
    this.resourceTypeDropdownOptions.push(...schoolOthers);
    const otherObj = {
      type: 'Others'
    };
    this.resourceTypeDropdownOptions.push(otherObj);
  }
  /**
   * Function to set resouce details options
   * @param i
   * @param val
   */
  setResourceDetailsValues(i, val) {
    const facilityControl = this.facilities.controls[i];
    this.utilityService.setResourceDetailsValue(facilityControl, this.resourceDetailsDropdownOptions, i, val);
  }
  subjectMapper(i, val) {
    if (val) {
      let mapSubjects = val.subjects.sort((a, b) => a.sem - b.sem);
      this.classes.controls[i].get('subjectDetails')?.setValue(mapSubjects);
    }
  }
  filterSubjects(standard, subjects) {
    return subjects.filter(e => {
      if (e?.subjects[0]?.applicableClasses?.length) {
        return e.subjects[0].applicableClasses.includes(standard);
      } else {
        return e;
      }
    });
  }
  setSubjectDropdown(i, val, standard) {
    if (val) {
      this.subjectDropdownOptions[i] = this.filterSubjects(standard, val.subjects);
    }
  }
  /**
   * Function to patch class data
   */
  patchClasses() {
    for (let i = 0; i < this.dependentPatchData.classes.length; i++) {
      this.classes.controls[i]?.get('board')?.setValue(this.dependentPatchData.classes[i].board);
      const mediums = this.boardMasterData.filter(e => e._id === this.dependentPatchData.classes[i].board);
      this.setMediumSubjectDropdown(i, mediums[0], 'edit');
      this.classes.controls[i]?.get('medium')?.setValue(this.dependentPatchData.classes[i].medium);
      if (!mediums[0]?.medium) {
        console.warn(`Orphaned class: board "${this.dependentPatchData.classes[i].board}" not found in master data`, this.dependentPatchData.classes[i]);
      }
      const classes = (mediums[0]?.medium ?? []).filter(e => e.medium === this.dependentPatchData.classes[i].medium);
      this.setClassDropdown(i, classes[0]);
      this.setSubjectDropdown(i, mediums[0], this.dependentPatchData.classes[i].class);
      this.classes.controls[i]?.get('class')?.setValue(this.dependentPatchData.classes[i].class);
      this.classes.controls[i]?.get('subject')?.setValue(this.dependentPatchData.classes[i].subject);
      this.classes.controls[i]?.get('boysStrength')?.setValue(this.dependentPatchData.classes[i].boysStrength);
      this.classes.controls[i]?.get('girlsStrength')?.setValue(this.dependentPatchData.classes[i].girlsStrength);
      this.classes.controls[i]?.get('subjectDetails')?.setValue(this.dependentPatchData.classes[i].subjectDetails);
    }
  }
  /**
   * Function to patch resource data
   */
  patchResourceDropdown() {
    if (this.dependentPatchData.facilities.length) {
      for (let i = 0; i < this.facilities.length; i++) {
        this.facilities.controls[i].get('type')?.setValue(this.dependentPatchData.facilities[i]?.type);
        this.facilities.controls[i].get('typeChipSet')?.setValue(this.dependentPatchData.facilities[i]?.typeChipSet);
        this.facilities.controls[i].get('detailsChipSet')?.setValue(this.dependentPatchData.facilities[i]?.typeChipSet);
        if (this.dependentPatchData.facilities[i]?.typeChipSet) {
          const valueForDetails = this.utilityService.filterDropdownValues(this.resourceMasterData, 'type', this.dependentPatchData.facilities[i].type);
          this.resourceDetailsDropdownOptions[i] = [...valueForDetails.facilities];
        }
        this.facilities.controls[i].get('otherType')?.setValue(this.dependentPatchData.facilities[i].otherType);
        this.facilities.controls[i].get('details')?.setValue(this.updatedDetailsMapper(this.dependentPatchData.facilities[i].otherType, this.dependentPatchData.facilities[i].details, i));
        if (this.dependentPatchData.facilities[i].otherType) {
          this.facilities.controls[i].get('otherType')?.addValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required);
          this.facilities.controls[i].get('otherType')?.updateValueAndValidity();
        }
        this.facilities.controls[i].get('details')?.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required);
        this.facilities.controls[i].get('details')?.updateValueAndValidity();
      }
    }
  }
  updatedDetailsMapper(type, userFacilityDetailsValue, i) {
    if (type === null) {
      return userFacilityDetailsValue.filter(item => this.resourceDetailsDropdownOptions[i].includes(item));
    } else {
      return userFacilityDetailsValue;
    }
  }
  /**
   * Function called on language change
   * @param lang
   */
  languageChanged(lang) {
    this.service.updatePreferedLanguage(lang).subscribe({
      next: res => {
        this.loggedInUser.preferredLanguage = lang;
        this.userPorfileForm.get('preferredLanguage')?.setValue(lang);
        this.utilityService.handleResponse(res);
        localStorage.setItem('userData', JSON.stringify(this.loggedInUser));
        this.translateService.use(lang);
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  /**
   * getter for formcontrol
   */
  get f() {
    return this.userPorfileForm.controls;
  }
  /**
   * Function to convert control to form control
   * @param absCtrl
   * @returns
   */
  convertToFormControl(absCtrl) {
    return absCtrl;
  }
  /**
   * gives the formArray of the respected group Name
   * @param groupName
   * @returns
   */
  getFormArray(groupName) {
    return this.userPorfileForm.get(groupName);
  }
  /**
   * getter for classes
   */
  get classes() {
    return this.userPorfileForm.get('classes');
  }
  /**
   * getter for facilities
   */
  get facilities() {
    return this.userPorfileForm.get('facilities');
  }
  /**
   * Function to add new classes controls
   */
  addNewclasses(mode) {
    this.mediumDropdownOptions.push([]);
    this.classDropdownOptions.push([]);
    this.subjectDropdownOptions.push([]);
    this.classes.push(this.fb.group({
      board: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      medium: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      class: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      subject: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      boysStrength: null,
      girlsStrength: null,
      subjectDetails: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]]
    }));
    if (mode === 'add') {
      this.defaultPreset();
    }
  }
  /**
   * Function to set default preset value for one board or medium
   */
  defaultPreset() {
    if (this.defaultBoard) {
      this.boardDropdownOptions = this.boardMasterData;
      this.mediumDropdownOptions[this.classes.length - 1] = this.boardMasterData[0].medium;
      // this.subjectDropdownOptions[this.classes.length - 1] =
      //   this.boardMasterData[0].subjects;
      this.currentSubjects[this.classes.length - 1] = this.boardMasterData[0].subjects;
      this.classes.controls[this.classes.length - 1].get('board')?.setValue(this.defaultBoard);
      if (this.defaultMedium) {
        this.classDropdownOptions[this.classes.length - 1] = this.boardMasterData[0].medium[0].classDetails;
        this.classes.controls[this.classes.length - 1].get('medium')?.setValue(this.defaultMedium);
      }
    }
  }
  /**
   * Function to delete class
   */
  deleteclass(i) {
    this.classes.removeAt(i);
  }
  /**
   * Function to add resource control
   */
  addResource() {
    this.resourceDetailsDropdownOptions.push([]);
    this.facilities.push(this.fb.group({
      type: [null],
      details: [[]],
      otherType: [],
      typeChipSet: [true],
      detailsChipSet: [true]
    }));
    this.resourceOtherValue.push('');
  }
  /**
   * Function to remove resource control
   * @param index
   */
  removeResource(index) {
    this.facilities.removeAt(index);
    this.resourceOtherValue = this.resourceOtherValue.splice(index, 1);
  }
  /**
   * Function to add other resource
   * @param control
   * @param i
   * @param event
   */
  addOtherResource(control, i, event) {
    if (this.resourceOtherValue[i]) {
      let updatedArr = structuredClone(control.get('details')?.value);
      updatedArr.push(this.resourceOtherValue[i]);
      control.get('details')?.setValue(updatedArr);
      this.resourceOtherValue[i] = '';
    }
  }
  /**
   * Function to remove chip item
   * @param control
   * @param i
   */
  removeItem(control, i) {
    let updatedArr = structuredClone(control.get('details')?.value);
    updatedArr = updatedArr.filter(item => item !== control.get('details')?.value[i]);
    control.get('details')?.setValue(updatedArr);
  }
  /**
   * get the image data from the file input and append the profile photo to the imageElement and remove the padding given to the parent
   * @param image_upload
   * @param imageEle
   */
  onImageSelect(image_upload) {
    if (image_upload.files) {
      const image = image_upload.files[0];
      const allowedTypes = ['image/png', 'image/jpeg'];
      if (!allowedTypes.includes(image.type)) {
        this.utilityService.showError('Invalid file type. Only PNG, JPG, and JPEG images are allowed.');
        return;
      }
      if (image.size > 5 * 1024 * 1024) {
        this.utilityService.showError('File size exceeds 5MB limit');
        return;
      }
      this.service.uploadProfileImage(image).subscribe({
        next: res => {
          this.loggedInUser.profileImage = res?.data?.profileImage;
          localStorage.setItem('userData', JSON.stringify(this.loggedInUser));
          // this.sidebarService.profileImg.set(res?.data?.profileImage);
          const localImageUrl = URL.createObjectURL(image);
          this.sidebarService.profileImg.set(localImageUrl);
          this.utilityService.handleResponse(res);
        },
        error: err => {
          this.utilityService.handleError(err);
        }
      });
    }
  }
  /**
   * set the default image to the profile photo by setting the new image src and add the padding
   * @param display_image
   */
  removeDP() {
    this.service.removeProfileImage().subscribe({
      next: res => {
        this.loggedInUser.profileImage = res?.data?.profileImage;
        localStorage.setItem('userData', JSON.stringify(this.loggedInUser));
        this.sidebarService.profileImg.set(res?.data?.profileImage);
        this.utilityService.handleResponse(res);
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  /**
   * Function to split classes
   * @param classes
   * @returns
   */
  splitClasses(classes) {
    const result = [];
    classes.forEach(obj => {
      const subjectName = obj.subject;
      const {
        subjectDetails
      } = obj;
      subjectDetails.forEach(detail => {
        result.push({
          ...obj,
          subject: detail.subjectName,
          sem: detail.sem,
          name: subjectName
        });
      });
    });
    result.forEach(ele => {
      delete ele.subjectDetails;
      delete ele.boysStrength;
      delete ele.girlsStrength;
    });
    return result;
  }
  /**
   * save the profile info and redirect the user to the home page
   */
  onSave() {
    this.submitted = true;
    if (this.classes.controls.length === 0) {
      return;
    }
    if (this.userPorfileForm.invalid) {
      return;
    }
    const classDetails = this.splitClasses(this.classes.value);
    if (this.utilityService.hasDuplicates(classDetails)) {
      this.utilityService.showWarning('Duplicate class-subject mapping found. Please verify.');
      return;
    }
    const data = this.userPorfileForm.value;
    data.facilities = this.utilityService.removeObjectsWithEmptyType(data.facilities);
    data.classes = classDetails;
    this.service.updateProfile(data).subscribe({
      next: res => {
        this.utilityService.handleResponse(res);
        localStorage.setItem('userData', JSON.stringify(res.data));
        this.router.navigate(['/']);
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  openConfirmPopupforDeleteClass(i) {
    this.selectedClassIndex = i;
    this.showDeleteClassDetailsConfirm = true;
  }
  closeDeleteClass(value) {
    if (value === 'delete') {
      this.deleteclass(this.selectedClassIndex);
    }
    this.showDeleteClassDetailsConfirm = false;
  }
  openConfirmPopupforDeleteResource(i) {
    this.selectedResIndex = i;
    this.showDeleteResourceConfirm = true;
  }
  closeDeleteResource(value) {
    if (value === 'delete') {
      this.removeResource(this.selectedResIndex);
    }
    this.showDeleteResourceConfirm = false;
  }
  closeDeleteProfileImage(value) {
    if (value === 'delete') {
      this.removeDP();
    }
    this.showDeleteProfileImageConfirm = false;
  }
  ngOnDestroy() {
    const profileUrl = this.utilityService.loggedInUserData?.profileImage || '';
    this.sidebarService.profileImg.set(profileUrl);
  }
  static {
    this.ɵfac = function ProfileComponent_Factory(t) {
      return new (t || ProfileComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_profile_service__WEBPACK_IMPORTED_MODULE_1__.ProfileService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_2__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_3__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](src_app_layout_sidebar_sidebar_service__WEBPACK_IMPORTED_MODULE_4__.SidebarService), _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslateService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵdefineComponent"]({
      type: ProfileComponent,
      selectors: [["app-profile"]],
      decls: 106,
      vars: 87,
      consts: [[1, "profile-wrapper", "p-8", "bg-white", "rounded"], [1, "text-xl", "md:text-[30px]", "leading-[48px]", "font-bold", "text-content"], [1, "text-content-50", "mt-1", "text-sm", "leading-[48px]", "tracking-tight"], [1, "flex", "flex-col", "gap-4", 3, "formGroup"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-4", "mb-4"], [1, "dp-setup", "flex", "gap-6"], [3, "profileImage", "size"], [1, "upload-container"], [1, "text-sm", "font-normal", "text-content", "leading-[22px]"], [1, "text-xs", "font-normal", "text-shade", "leading-[20px]", "mb-4"], [1, "btn-wrapper"], ["type", "button", 1, "relative", "text-white", "border", "focus:outline-none", "font-medium", "rounded", "text-sm", "px-5", "py-2", "text-center", "btn-primary", 3, "click"], ["id", "file_input", "type", "file", "accept", "image/*", 1, "hidden", "h-0", "w-0", "absolute", "text-sm", "text-gray-900", "rounded-lg", "cursor-pointer", "bg-gray-50", "focus:outline-none", 3, "change"], ["image_upload", ""], ["src", "assets/images/gallery.svg", "alt", "", 1, "inline-block", "mb-1"], [1, "ml-2"], ["type", "button", "class", " font-normal rounded-lg text-sm ml-4 text-primary", 3, "click", 4, "ngIf"], [1, "lang-setup", "flex", "sm:justify-end"], [1, "form-groups", "w-full", "xl:w-1/2", "ml-auto", "sm:ml-0", "md:place-self-end"], ["for", "lang", 1, "text-content", "text-sm", "leading-[22px]", "font-bold"], [3, "loggedInUser", "languageChange"], [1, "grid", "grid-cols-1", "gap-6", "md:mb-4", "md:grid-cols-4"], ["for", "profile-name", 1, "block", "mb-1", "form-control-label"], ["type", "text", "id", "profile-name", "required", "", "readonly", "", "aria-readonly", "true", 1, "appearance-none", "border", "border-content-50", "rounded-lg", "block", "w-full", "p-2.5", "text-content", "text-sm", "leading-tight", "outline-none", "bg-surface-muted", 3, "placeholder", "value"], ["for", "profile-phone", 1, "block", "mb-1", "form-control-label"], ["type", "text", "id", "profile-phone", "required", "", "readonly", "", "aria-readonly", "true", 1, "appearance-none", "border", "border-content-50", "rounded-lg", "block", "w-full", "p-2.5", "text-content", "text-sm", "leading-tight", "outline-none", "bg-surface-muted", 3, "placeholder", "value"], [1, "md:col-span-2"], ["for", "profile-school", 1, "block", "mb-1", "form-control-label"], ["type", "text", "id", "profile-school", "required", "", "readonly", "", "aria-readonly", "true", 1, "appearance-none", "border", "border-content-50", "rounded-lg", "block", "w-full", "p-2.5", "text-content", "text-sm", "leading-tight", "outline-none", "bg-surface-muted", 3, "value"], [1, "grid", "gap-6", "md:mb-4", "md:grid-cols-4"], ["for", "profile-state", 1, "block", "mb-1", "form-control-label"], ["type", "text", "id", "profile-state", "readonly", "", "required", "", "aria-readonly", "true", 1, "appearance-none", "border", "border-content-50", "rounded-lg", "block", "w-full", "p-2.5", "text-content", "text-sm", "leading-tight", "outline-none", "bg-surface-muted", 3, "placeholder", "value"], ["for", "profile-zone", 1, "block", "mb-1", "form-control-label"], ["type", "text", "id", "profile-zone", "readonly", "", "required", "", "aria-readonly", "true", 1, "appearance-none", "border", "border-content-50", "rounded-lg", "block", "w-full", "p-2.5", "text-content", "text-sm", "leading-tight", "outline-none", "bg-surface-muted", 3, "placeholder", "value"], ["for", "profile-district", 1, "block", "mb-1", "form-control-label"], ["type", "text", "id", "profile-district", "readonly", "", "required", "", "aria-readonly", "true", 1, "appearance-none", "border", "border-content-50", "rounded-lg", "block", "w-full", "p-2.5", "text-content", "text-sm", "leading-tight", "outline-none", "bg-surface-muted", 3, "placeholder", "value"], ["for", "profile-taluk", 1, "block", "mb-1", "form-control-label"], ["type", "text", "id", "profile-taluk", "readonly", "", "required", "", "aria-readonly", "true", 1, "appearance-none", "border", "border-content-50", "rounded-lg", "block", "w-full", "p-2.5", "text-content", "text-sm", "leading-tight", "outline-none", "bg-surface-muted", 3, "placeholder", "value"], [1, "relative"], [1, "font-bold", "text-lg", "leading-7", "mb-2", "mt-2", "lg:hidden"], [1, "rounded-lg", "bg-[#E5EDF67D]", "text-sm", "md:text-[16px]", "p-2", "mt-5", "mb-2", "text-content-100", "lg:grid", "grid-cols-[auto,1fr]", "gap-2", "items-start", "hidden"], ["src", "assets/icons/lesson-info.svg", "alt", "", 1, "me-1", "w-5"], [1, "text-[#1565C0]"], ["aria-label", "school-profile-list", 1, "table-auto", "w-full", "text-content", "rounded-lg"], [1, "text-xs", "text-content", "uppercase", "bg-[#edf6fe]", "hidden", "lg:table-header-group"], ["class", "px-6 py-3", 4, "ngFor", "ngForOf"], ["formArrayName", "classes"], ["class", "flex flex-col border rounded lg:rounded-none lg:border-none p-4 lg:p-0 mt-4 lg:mt-0 lg:table-row", 3, "formGroupName", 4, "ngFor", "ngForOf"], [1, "resource-block", "mt-4"], [1, "font-bold", "text-lg", "leading-7", "mb-4", "text-content"], [1, "mt-7"], ["formArrayName", "facilities"], ["class", "text-content grid md:grid-cols-12 gap-4 border p-4 mb-4 rounded", 4, "ngFor", "ngForOf"], [1, "mb-8"], [1, "w-full", "text-right"], ["type", "button", 1, "text-white", "btn-primary", "btn-primary:hover", "place-self-end", "font-medium", "rounded-lg", "text-sm", "px-5", "py-2.5", "me-2", "ml-auto", 3, "click"], [3, "config", "close", 4, "ngIf"], ["type", "button", 1, "font-normal", "rounded-lg", "text-sm", "ml-4", "text-primary", 3, "click"], [1, "px-6", "py-3"], [1, "flex", "flex-col", "border", "rounded", "lg:rounded-none", "lg:border-none", "p-4", "lg:p-0", "mt-4", "lg:mt-0", "lg:table-row", 3, "formGroupName"], [1, "px-1", "py-1", "lg:px-4", "lg:py-4"], [1, "lg:hidden", "mb-1", "form-control-label"], [1, "text-[16px]", "text-error"], [3, "dropDownControlName", "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], [1, "flex", "lg:w-24", "gap-2", "justify-end", "lg:justify-start"], ["type", "button", "class", "text-white btn-danger btn-danger:hover flex items-center lg:block gap-1  place-self-end font-medium rounded-lg text-sm", 3, "click", 4, "ngIf"], ["type", "button", "class", "text-white btn-primary btn-primary:hover flex lg:block items-center gap-1 place-self-end font-medium rounded-lg text-sm", 3, "click", 4, "ngIf"], ["type", "button", 1, "text-white", "btn-danger", "btn-danger:hover", "flex", "items-center", "lg:block", "gap-1", "place-self-end", "font-medium", "rounded-lg", "text-sm", 3, "click"], ["src", "assets/icons/delete.svg", "alt", "trash", 1, "inline-block"], [1, "lg:hidden"], ["type", "button", 1, "text-white", "btn-primary", "btn-primary:hover", "flex", "lg:block", "items-center", "gap-1", "place-self-end", "font-medium", "rounded-lg", "text-sm", 3, "click"], ["src", "assets/icons/plus.svg", "alt", "plus", 1, "inline-block"], [1, "text-content", "grid", "md:grid-cols-12", "gap-4", "border", "p-4", "mb-4", "rounded"], [3, "formGroupName"], [1, "py-2", "md:py-4", "text-sm", "content-start", "md:col-span-5"], ["class", "form-control h-9 mt-4", "type", "text", "autocomplete", "off", "formControlName", "otherType", 3, "placeholder", 4, "ngIf"], ["class", "form-control-error", 4, "ngIf"], ["class", "block  form-control-label ", 4, "ngIf"], [3, "hidden"], [3, "dropDownControlName", "dropDownCtrl", "dropDownValues", "config", "submitted"], [4, "ngIf"], [1, "selected-items", "mt-2"], [4, "ngFor", "ngForOf"], [1, "py-2", "md:py-4", "text-sm", "md:mt-[30px]", "md:col-span-2"], [1, "flex", "gap-2", 3, "ngClass"], ["class", "btn-danger h-9", "type", "button", 3, "click", 4, "ngIf"], ["class", "btn-primary h-9", "type", "button", 3, "click", 4, "ngIf"], ["type", "text", "autocomplete", "off", "formControlName", "otherType", 1, "form-control", "h-9", "mt-4", 3, "placeholder"], [1, "form-control-error"], [1, "block", "form-control-label"], [1, "flex", "gap-2"], [1, "w-full"], [1, "form-control-label"], ["type", "text", "autocomplete", "off", 1, "form-control", "h-9", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange", "keydown.enter"], ["type", "button", 1, "btn-primary", "h-9", "mt-[26px]", 3, "click"], [1, "flex", "content-center"], ["src", "assets/icons/add.svg", "alt", ""], [1, "chip"], [1, "close-icon", 3, "click"], ["type", "button", 1, "btn-danger", "h-9", 3, "click"], ["src", "assets/icons/delete.svg", "alt", ""], [1, "ml-[6px]"], ["type", "button", 1, "btn-primary", "h-9", 3, "click"], [3, "config", "close"]],
      template: function ProfileComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r62 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵgetCurrentView"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](0, "section", 0)(1, "h1", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](3, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](4, "p", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](6, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](7, "form", 3)(8, "div", 4)(9, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](10, "app-profile-image", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](11, "div", 7)(12, "p", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](13);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](14, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](15, "p", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](16);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](17, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](18, "div", 10)(19, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ProfileComponent_Template_button_click_19_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r62);
            const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](21);
            return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](_r0.click());
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](20, "input", 12, 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("change", function ProfileComponent_Template_input_change_20_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵrestoreView"](_r62);
            const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵreference"](21);
            return _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵresetView"](ctx.onImageSelect(_r0));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](22, "img", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](23, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](24);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](25, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](26, ProfileComponent_button_26_Template, 3, 3, "button", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](27, "div", 17)(28, "div", 18)(29, "label", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](30);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](31, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](32, "app-language-switcher", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("languageChange", function ProfileComponent_Template_app_language_switcher_languageChange_32_listener($event) {
            return ctx.languageChanged($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](33, "div", 21)(34, "div")(35, "label", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](37, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](38, "input", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](39, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](40, "div")(41, "label", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](42);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](43, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](44, "input", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](45, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](46, "div", 26)(47, "label", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](48);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](49, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](50, "input", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](51, "div", 29)(52, "div")(53, "label", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](54);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](55, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](56, "input", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](57, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](58, "div")(59, "label", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](60);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](61, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](62, "input", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](63, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](64, "div")(65, "label", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](66);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](67, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](68, "input", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](69, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](70, "div")(71, "label", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](72);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](73, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](74, "input", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](75, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](76, "div", 38)(77, "h2", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](78);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](79, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](80, "div", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](81, "img", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](82, "small", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](83);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](84, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](85, "table", 43)(86, "thead", 44)(87, "tr");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](88, ProfileComponent_th_88_Template, 3, 3, "th", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](89, "tbody", 46);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](90, ProfileComponent_tr_90_Template, 45, 43, "tr", 47);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](91, "div", 48)(92, "h2", 49);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](93);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](94, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](95, "div", 50);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerStart"](96, 51);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](97, ProfileComponent_div_97_Template, 20, 20, "div", 52);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementContainerEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelement"](98, "hr", 53);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementStart"](99, "div", 54)(100, "button", 55);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵlistener"]("click", function ProfileComponent_Template_button_click_100_listener() {
            return ctx.onSave();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtext"](101);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipe"](102, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](103, ProfileComponent_app_delete_detail_103_Template, 1, 2, "app-delete-detail", 56);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](104, ProfileComponent_app_delete_detail_104_Template, 1, 2, "app-delete-detail", 56);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtemplate"](105, ProfileComponent_app_delete_detail_105_Template, 1, 2, "app-delete-detail", 56);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](3, 41, "Setup Your Profile"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](6, 43, "Profile photo"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("formGroup", ctx.userPorfileForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("profileImage", ctx.sidebarService.profileImg())("size", "lg");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](14, 45, "Upload your photo"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](17, 47, "Your photo should be in PNG, JPG or JPEG format"), ". ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](25, 49, ctx.sidebarService.profileImg() ? "Change Image" : "Choose Image"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.sidebarService.profileImg());
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](31, 51, "Language"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("loggedInUser", ctx.loggedInUser);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](37, 53, "Name"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](39, 55, "Enter your name"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx.userData == null ? null : ctx.userData.name);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](43, 57, "Phone"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](45, 59, "Enter your phone number"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx.userData == null ? null : ctx.userData.phone);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](49, 61, "School/Organization"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx.userData == null ? null : ctx.userData.school == null ? null : ctx.userData.school.name);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](55, 63, "State"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](57, 65, "Enter your cluster"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx.userData == null ? null : ctx.userData.state);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](61, 67, "Zone"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](63, 69, "Enter your zone"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx.userData == null ? null : ctx.userData.zone);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](67, 71, "District"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](69, 73, "Enter your district"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx.userData == null ? null : ctx.userData.district);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](73, 75, "Taluk"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](75, 77, "Enter Taluk"));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("value", ctx.userData == null ? null : ctx.userData.block);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](79, 79, "Class Details"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](84, 81, "In the table below, please ensure that there is at least one class data and that all fields are filled."));
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.schoolTableHeader);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.getFormArray("classes").controls);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](94, 83, "Resources"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngForOf", ctx.facilities.controls);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵpipeBind1"](102, 85, "Save profile"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.showDeleteClassDetailsConfirm);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.showDeleteResourceConfirm);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_9__["ɵɵproperty"]("ngIf", ctx.showDeleteProfileImageConfirm);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_11__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_11__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormArrayName, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgModel, _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_5__.FormDropdownComponent, _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_6__.LanguageSwitcherComponent, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_7__.DeleteDetailComponent, _shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_8__.ProfileImageComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslatePipe],
      styles: ["@media (min-width: 1024px) {\n  table[_ngcontent-%COMP%], th[_ngcontent-%COMP%], td[_ngcontent-%COMP%] {\n    border: 1px solid var(--content-30);\n  }\n}\n\n@media (min-width: 768px) and (max-width: 1024px) {\n  .user-image[_ngcontent-%COMP%] {\n    width: 100px;\n    height: 100px;\n  }\n  .btn-wrapper[_ngcontent-%COMP%]   button[_ngcontent-%COMP%] {\n    width: 125px;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBR0U7RUFIRjs7O0lBSUUsbUNBQUE7RUFDQTtBQUNGOztBQUdBO0VBQ0U7SUFDRSxZQUFBO0lBQ0EsYUFBQTtFQUFGO0VBR0E7SUFDRSxZQUFBO0VBREY7QUFDRiIsImZpbGUiOiJwcm9maWxlLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsidGFibGUsXG50aCxcbnRkIHtcbiAgQG1lZGlhIChtaW4td2lkdGg6MTAyNHB4KSB7XG4gIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNvbnRlbnQtMzApO1xuICAgIFxuICB9XG59XG5cbkBtZWRpYSAobWluLXdpZHRoOiA3NjhweCkgYW5kIChtYXgtd2lkdGg6IDEwMjRweCkge1xuICAudXNlci1pbWFnZSB7XG4gICAgd2lkdGg6IDEwMHB4O1xuICAgIGhlaWdodDogMTAwcHg7XG4gIH1cblxuICAuYnRuLXdyYXBwZXIgYnV0dG9uIHtcbiAgICB3aWR0aDogMTI1cHg7XG4gIH1cbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3Byb2ZpbGUvcHJvZmlsZS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFHRTtFQUhGOzs7SUFJRSxtQ0FBQTtFQUNBO0FBQ0Y7O0FBR0E7RUFDRTtJQUNFLFlBQUE7SUFDQSxhQUFBO0VBQUY7RUFHQTtJQUNFLFlBQUE7RUFERjtBQUNGO0FBQ0EsNHNCQUE0c0IiLCJzb3VyY2VzQ29udGVudCI6WyJ0YWJsZSxcbnRoLFxudGQge1xuICBAbWVkaWEgKG1pbi13aWR0aDoxMDI0cHgpIHtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tY29udGVudC0zMCk7XG4gICAgXG4gIH1cbn1cblxuQG1lZGlhIChtaW4td2lkdGg6IDc2OHB4KSBhbmQgKG1heC13aWR0aDogMTAyNHB4KSB7XG4gIC51c2VyLWltYWdlIHtcbiAgICB3aWR0aDogMTAwcHg7XG4gICAgaGVpZ2h0OiAxMDBweDtcbiAgfVxuXG4gIC5idG4td3JhcHBlciBidXR0b24ge1xuICAgIHdpZHRoOiAxMjVweDtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 71594:
/*!******************************************************!*\
  !*** ./src/app/view/user/profile/profile.service.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProfileService: () => (/* binding */ ProfileService)
/* harmony export */ });
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 46443);




class ProfileService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  /**
   * Class constructor
   * @param http
   */
  constructor(http) {
    super(http);
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
    this.setUri('user');
  }
  /**
   * Function to get profile info
   * @param id
   * @returns
   */
  getProfileInfo(id) {
    return this.get(`get-profile/${id}`);
  }
  /**
   * Function to get school info
   * @param id
   * @returns
   */
  getSchoolInfo(id) {
    return this.http.get(`${this.baseUrl}/school/${id}`);
  }
  /**
   * Function to update profile
   * @param id
   * @param data
   * @returns
   */
  updateProfile(data) {
    return this.put(`set-profile`, data);
  }
  /**
   * Function to get classes by board
   * @param schoolId
   * @returns
   */
  getClassesByBoard(schoolId) {
    return this.http.get(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl}/class/group-by-board/${schoolId}`);
  }
  updatePreferedLanguage(language) {
    return this.patch('update-language', {
      preferredLanguage: language
    });
  }
  /**
  * Function to upload profile pic
  * @param image
  * @returns
  */
  uploadProfileImage(image) {
    const formData = new FormData();
    formData.append('file', image);
    return this.post('upload-profile-image', formData);
  }
  removeProfileImage() {
    return this.post('remove-profile-image', {});
  }
  static {
    this.ɵfac = function ProfileService_Factory(t) {
      return new (t || ProfileService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: ProfileService,
      factory: ProfileService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 95450:
/*!**************************************************!*\
  !*** ./src/app/view/user/user-routing.module.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserRoutingModule: () => (/* binding */ UserRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./profile/profile.component */ 78790);
/* harmony import */ var src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/guards/permission.guard */ 83811);
/* harmony import */ var src_app_core_guards_isProfileComplete_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/core/guards/isProfileComplete.guard */ 55602);
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./dashboard/dashboard.component */ 47906);
/* harmony import */ var _chatbot_chatbot_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chatbot/chatbot.component */ 44154);
/* harmony import */ var src_app_core_guards_baseline_survey_guard__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/core/guards/baseline-survey.guard */ 32292);
/* harmony import */ var _generation_status_generation_status_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./generation-status/generation-status.component */ 37498);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);










const routes = [{
  path: '',
  redirectTo: 'home',
  pathMatch: 'full'
}, {
  path: 'home',
  component: _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_3__.DashboardComponent,
  data: {
    permissions: ['standard', 'power']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard, src_app_core_guards_isProfileComplete_guard__WEBPACK_IMPORTED_MODULE_2__.IsProfileCompleteGuard, src_app_core_guards_baseline_survey_guard__WEBPACK_IMPORTED_MODULE_5__.BaselineSurveyGuard]
}, {
  path: 'content-generation',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_shared_services_docx-utility_service_ts-src_app_shared_utility_animations_uti-48fa82"), __webpack_require__.e("default-src_app_view_user_content-generation_content-generation_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./content-generation/content-generation.module */ 47055)).then(m => m.ContentGenerationModule),
  data: {
    permissions: ['standard', 'power']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard, src_app_core_guards_isProfileComplete_guard__WEBPACK_IMPORTED_MODULE_2__.IsProfileCompleteGuard, src_app_core_guards_baseline_survey_guard__WEBPACK_IMPORTED_MODULE_5__.BaselineSurveyGuard]
}, {
  path: 'generation-status',
  component: _generation_status_generation_status_component__WEBPACK_IMPORTED_MODULE_6__.GenerationStatusComponent,
  data: {
    permissions: ['power']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard, src_app_core_guards_isProfileComplete_guard__WEBPACK_IMPORTED_MODULE_2__.IsProfileCompleteGuard, src_app_core_guards_baseline_survey_guard__WEBPACK_IMPORTED_MODULE_5__.BaselineSurveyGuard]
}, {
  path: 'profile',
  component: _profile_profile_component__WEBPACK_IMPORTED_MODULE_0__.ProfileComponent,
  data: {
    permissions: ['standard', 'power']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard]
}, {
  path: 'chatbot',
  component: _chatbot_chatbot_component__WEBPACK_IMPORTED_MODULE_4__.ChatbotComponent,
  data: {
    permissions: ['power'],
    type: 'general'
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard, src_app_core_guards_isProfileComplete_guard__WEBPACK_IMPORTED_MODULE_2__.IsProfileCompleteGuard, src_app_core_guards_baseline_survey_guard__WEBPACK_IMPORTED_MODULE_5__.BaselineSurveyGuard]
}, {
  path: 'question-paper',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_shared_services_docx-utility_service_ts-src_app_shared_utility_animations_uti-48fa82"), __webpack_require__.e("common"), __webpack_require__.e("src_app_view_user_question-bank_question-bank_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./question-bank/question-bank.module */ 7845)).then(m => m.QuestionBankModule),
  data: {
    permissions: ['standard', 'power']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard, src_app_core_guards_isProfileComplete_guard__WEBPACK_IMPORTED_MODULE_2__.IsProfileCompleteGuard, src_app_core_guards_baseline_survey_guard__WEBPACK_IMPORTED_MODULE_5__.BaselineSurveyGuard]
}, {
  path: 'schedule',
  loadChildren: () => __webpack_require__.e(/*! import() */ "src_app_view_user_schedule_schedule_module_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./schedule/schedule.module */ 10957)).then(m => m.ScheduleModule),
  data: {
    permissions: ['standard', 'power']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard, src_app_core_guards_isProfileComplete_guard__WEBPACK_IMPORTED_MODULE_2__.IsProfileCompleteGuard, src_app_core_guards_baseline_survey_guard__WEBPACK_IMPORTED_MODULE_5__.BaselineSurveyGuard]
}, {
  path: 'help',
  loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_view_user_help_help_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./help/help.component */ 90814)).then(c => c.HelpComponent),
  data: {
    permissions: ['standard', 'power']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard]
}];
class UserRoutingModule {
  static {
    this.ɵfac = function UserRoutingModule_Factory(t) {
      return new (t || UserRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineNgModule"]({
      type: UserRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵsetNgModuleScope"](UserRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterModule]
  });
})();

/***/ }),

/***/ 10723:
/*!******************************************!*\
  !*** ./src/app/view/user/user.module.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserModule: () => (/* binding */ UserModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _user_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./user-routing.module */ 95450);
/* harmony import */ var _profile_profile_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./profile/profile.component */ 78790);
/* harmony import */ var src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/form-dropdown/form-dropdown.component */ 55233);
/* harmony import */ var src_app_shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/components/language-switcher/language-switcher.component */ 5429);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./dashboard/dashboard.component */ 47906);
/* harmony import */ var angular_calendar__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! angular-calendar */ 35519);
/* harmony import */ var angular_calendar_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! angular-calendar/date-adapters/date-fns */ 66111);
/* harmony import */ var ng2_charts__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ng2-charts */ 57839);
/* harmony import */ var src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var src_app_shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/shared/components/profile-image/profile-image.component */ 85445);
/* harmony import */ var _generation_status_generation_status_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./generation-status/generation-status.component */ 37498);
/* harmony import */ var src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var src_app_shared_directives_calendar__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/shared/directives/calendar */ 70127);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 37580);



















class UserModule {
  static {
    this.ɵfac = function UserModule_Factory(t) {
      return new (t || UserModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({
      type: UserModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _user_routing_module__WEBPACK_IMPORTED_MODULE_0__.UserRoutingModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_2__.CommonDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.FormDropdownComponent, src_app_shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__.LanguageSwitcherComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__.TranslateModule, angular_calendar__WEBPACK_IMPORTED_MODULE_15__.CalendarModule.forRoot({
        provide: angular_calendar__WEBPACK_IMPORTED_MODULE_15__.DateAdapter,
        useFactory: angular_calendar_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_16__.adapterFactory
      }), ng2_charts__WEBPACK_IMPORTED_MODULE_17__.NgChartsModule, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__.DeleteDetailComponent, src_app_shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_7__.ProfileImageComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_9__.PaginationComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](UserModule, {
    declarations: [_profile_profile_component__WEBPACK_IMPORTED_MODULE_1__.ProfileComponent, _dashboard_dashboard_component__WEBPACK_IMPORTED_MODULE_5__.DashboardComponent, _generation_status_generation_status_component__WEBPACK_IMPORTED_MODULE_8__.GenerationStatusComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _user_routing_module__WEBPACK_IMPORTED_MODULE_0__.UserRoutingModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_2__.CommonDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.FormDropdownComponent, src_app_shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__.LanguageSwitcherComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__.TranslateModule, angular_calendar__WEBPACK_IMPORTED_MODULE_15__.CalendarModule, ng2_charts__WEBPACK_IMPORTED_MODULE_17__.NgChartsModule, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__.DeleteDetailComponent, src_app_shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_7__.ProfileImageComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_9__.PaginationComponent, src_app_shared_directives_calendar__WEBPACK_IMPORTED_MODULE_10__.CalendarAccessibilityDirective]
  });
})();

/***/ }),

/***/ 68786:
/*!**********************************************************************!*\
  !*** ./node_modules/@mattlewis92/dom-autoscroller/dist/bundle.es.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function getDef(f, d) {
  if (typeof f === 'undefined') {
    return typeof d === 'undefined' ? f : d;
  }
  return f;
}
function boolean(func, def) {
  func = getDef(func, def);
  if (typeof func === 'function') {
    return function f() {
      var arguments$1 = arguments;
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments$1[_key];
      }
      return !!func.apply(this, args);
    };
  }
  return !!func ? function () {
    return true;
  } : function () {
    return false;
  };
}
var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
};

/**
 * Returns `true` if provided input is Element.
 * @name isElement
 * @param {*} [input]
 * @returns {boolean}
 */
var isElement$1 = function (input) {
  return input != null && (typeof input === 'undefined' ? 'undefined' : _typeof(input)) === 'object' && input.nodeType === 1 && _typeof(input.style) === 'object' && _typeof(input.ownerDocument) === 'object';
};
function indexOfElement(elements, element) {
  element = resolveElement(element, true);
  if (!isElement$1(element)) {
    return -1;
  }
  for (var i = 0; i < elements.length; i++) {
    if (elements[i] === element) {
      return i;
    }
  }
  return -1;
}
function hasElement(elements, element) {
  return -1 !== indexOfElement(elements, element);
}
function pushElements(elements, toAdd) {
  for (var i = 0; i < toAdd.length; i++) {
    if (!hasElement(elements, toAdd[i])) {
      elements.push(toAdd[i]);
    }
  }
  return toAdd;
}
function addElements(elements) {
  var arguments$1 = arguments;
  var toAdd = [],
    len = arguments.length - 1;
  while (len-- > 0) {
    toAdd[len] = arguments$1[len + 1];
  }
  toAdd = toAdd.map(resolveElement);
  return pushElements(elements, toAdd);
}
function removeElements(elements) {
  var arguments$1 = arguments;
  var toRemove = [],
    len = arguments.length - 1;
  while (len-- > 0) {
    toRemove[len] = arguments$1[len + 1];
  }
  return toRemove.map(resolveElement).reduce(function (last, e) {
    var index = indexOfElement(elements, e);
    if (index !== -1) {
      return last.concat(elements.splice(index, 1));
    }
    return last;
  }, []);
}
function resolveElement(element, noThrow) {
  if (typeof element === 'string') {
    try {
      return document.querySelector(element);
    } catch (e) {
      throw e;
    }
  }
  if (!isElement$1(element) && !noThrow) {
    throw new TypeError(element + " is not a DOM element.");
  }
  return element;
}
function createPointCB(object, options) {
  // A persistent object (as opposed to returned object) is used to save memory
  // This is good to prevent layout thrashing, or for games, and such

  // NOTE
  // This uses IE fixes which should be OK to remove some day. :)
  // Some speed will be gained by removal of these.

  // pointCB should be saved in a variable on return
  // This allows the usage of element.removeEventListener

  options = options || {};
  var allowUpdate = boolean(options.allowUpdate, true);

  /*if(typeof options.allowUpdate === 'function'){
      allowUpdate = options.allowUpdate;
  }else{
      allowUpdate = function(){return true;};
  }*/

  return function pointCB(event) {
    event = event || window.event; // IE-ism
    object.target = event.target || event.srcElement || event.originalTarget;
    object.element = this;
    object.type = event.type;
    if (!allowUpdate(event)) {
      return;
    }

    // Support touch
    // http://www.creativebloq.com/javascript/make-your-site-work-touch-devices-51411644

    if (event.targetTouches) {
      object.x = event.targetTouches[0].clientX;
      object.y = event.targetTouches[0].clientY;
      object.pageX = event.targetTouches[0].pageX;
      object.pageY = event.targetTouches[0].pageY;
      object.screenX = event.targetTouches[0].screenX;
      object.screenY = event.targetTouches[0].screenY;
    } else {
      // If pageX/Y aren't available and clientX/Y are,
      // calculate pageX/Y - logic taken from jQuery.
      // (This is to support old IE)
      // NOTE Hopefully this can be removed soon.

      if (event.pageX === null && event.clientX !== null) {
        var eventDoc = event.target && event.target.ownerDocument || document;
        var doc = eventDoc.documentElement;
        var body = eventDoc.body;
        object.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
        object.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc && doc.clientTop || body && body.clientTop || 0);
      } else {
        object.pageX = event.pageX;
        object.pageY = event.pageY;
      }

      // pageX, and pageY change with page scroll
      // so we're not going to use those for x, and y.
      // NOTE Most browsers also alias clientX/Y with x/y
      // so that's something to consider down the road.

      object.x = event.clientX;
      object.y = event.clientY;
      object.screenX = event.screenX;
      object.screenY = event.screenY;
    }
    object.clientX = object.x;
    object.clientY = object.y;
  };

  //NOTE Remember accessibility, Aria roles, and labels.
}

function createWindowRect() {
  var props = {
    top: {
      value: 0,
      enumerable: true
    },
    left: {
      value: 0,
      enumerable: true
    },
    right: {
      value: window.innerWidth,
      enumerable: true
    },
    bottom: {
      value: window.innerHeight,
      enumerable: true
    },
    width: {
      value: window.innerWidth,
      enumerable: true
    },
    height: {
      value: window.innerHeight,
      enumerable: true
    },
    x: {
      value: 0,
      enumerable: true
    },
    y: {
      value: 0,
      enumerable: true
    }
  };
  if (Object.create) {
    return Object.create({}, props);
  } else {
    var rect = {};
    Object.defineProperties(rect, props);
    return rect;
  }
}
function getClientRect(el) {
  if (el === window) {
    return createWindowRect();
  } else {
    try {
      var rect = el.getBoundingClientRect();
      if (rect.x === undefined) {
        rect.x = rect.left;
        rect.y = rect.top;
      }
      return rect;
    } catch (e) {
      throw new TypeError("Can't call getBoundingClientRect on " + el);
    }
  }
}
function pointInside(point, el) {
  var rect = getClientRect(el);
  return point.y > rect.top && point.y < rect.bottom && point.x > rect.left && point.x < rect.right;
}
var objectCreate = void 0;
if (typeof Object.create != 'function') {
  objectCreate = function (undefined$1) {
    var Temp = function Temp() {};
    return function (prototype, propertiesObject) {
      if (prototype !== Object(prototype) && prototype !== null) {
        throw TypeError('Argument must be an object, or null');
      }
      Temp.prototype = prototype || {};
      var result = new Temp();
      Temp.prototype = null;
      if (propertiesObject !== undefined$1) {
        Object.defineProperties(result, propertiesObject);
      }

      // to imitate the case of Object.create(null)
      if (prototype === null) {
        result.__proto__ = null;
      }
      return result;
    };
  }();
} else {
  objectCreate = Object.create;
}
var objectCreate$1 = objectCreate;
var mouseEventProps = ['altKey', 'button', 'buttons', 'clientX', 'clientY', 'ctrlKey', 'metaKey', 'movementX', 'movementY', 'offsetX', 'offsetY', 'pageX', 'pageY', 'region', 'relatedTarget', 'screenX', 'screenY', 'shiftKey', 'which', 'x', 'y'];
function createDispatcher(element) {
  var defaultSettings = {
    screenX: 0,
    screenY: 0,
    clientX: 0,
    clientY: 0,
    ctrlKey: false,
    shiftKey: false,
    altKey: false,
    metaKey: false,
    button: 0,
    buttons: 1,
    relatedTarget: null,
    region: null
  };
  if (element !== undefined) {
    element.addEventListener('mousemove', onMove);
  }
  function onMove(e) {
    for (var i = 0; i < mouseEventProps.length; i++) {
      defaultSettings[mouseEventProps[i]] = e[mouseEventProps[i]];
    }
  }
  var dispatch = function () {
    if (MouseEvent) {
      return function m1(element, initMove, data) {
        var evt = new MouseEvent('mousemove', createMoveInit(defaultSettings, initMove));

        //evt.dispatched = 'mousemove';
        setSpecial(evt, data);
        return element.dispatchEvent(evt);
      };
    } else if (typeof document.createEvent === 'function') {
      return function m2(element, initMove, data) {
        var settings = createMoveInit(defaultSettings, initMove);
        var evt = document.createEvent('MouseEvents');
        evt.initMouseEvent("mousemove", true,
        //can bubble
        true,
        //cancelable
        window,
        //view
        0,
        //detail
        settings.screenX,
        //0, //screenX
        settings.screenY,
        //0, //screenY
        settings.clientX,
        //80, //clientX
        settings.clientY,
        //20, //clientY
        settings.ctrlKey,
        //false, //ctrlKey
        settings.altKey,
        //false, //altKey
        settings.shiftKey,
        //false, //shiftKey
        settings.metaKey,
        //false, //metaKey
        settings.button,
        //0, //button
        settings.relatedTarget //null //relatedTarget
        );

        //evt.dispatched = 'mousemove';
        setSpecial(evt, data);
        return element.dispatchEvent(evt);
      };
    } else if (typeof document.createEventObject === 'function') {
      return function m3(element, initMove, data) {
        var evt = document.createEventObject();
        var settings = createMoveInit(defaultSettings, initMove);
        for (var name in settings) {
          evt[name] = settings[name];
        }

        //evt.dispatched = 'mousemove';
        setSpecial(evt, data);
        return element.dispatchEvent(evt);
      };
    }
  }();
  function destroy() {
    if (element) {
      element.removeEventListener('mousemove', onMove, false);
    }
    defaultSettings = null;
  }
  return {
    destroy: destroy,
    dispatch: dispatch
  };
}
function createMoveInit(defaultSettings, initMove) {
  initMove = initMove || {};
  var settings = objectCreate$1(defaultSettings);
  for (var i = 0; i < mouseEventProps.length; i++) {
    if (initMove[mouseEventProps[i]] !== undefined) {
      settings[mouseEventProps[i]] = initMove[mouseEventProps[i]];
    }
  }
  return settings;
}
function setSpecial(e, data) {
  console.log('data ', data);
  e.data = data || {};
  e.dispatched = 'mousemove';
}
var prefix = ['webkit', 'moz', 'ms', 'o'];
var requestFrame = function () {
  if (typeof window === "undefined") {
    return function () {};
  }
  for (var i = 0, limit = prefix.length; i < limit && !window.requestAnimationFrame; ++i) {
    window.requestAnimationFrame = window[prefix[i] + 'RequestAnimationFrame'];
  }
  if (!window.requestAnimationFrame) {
    var lastTime = 0;
    window.requestAnimationFrame = function (callback) {
      var now = new Date().getTime();
      var ttc = Math.max(0, 16 - now - lastTime);
      var timer = window.setTimeout(function () {
        return callback(now + ttc);
      }, ttc);
      lastTime = now + ttc;
      return timer;
    };
  }
  return window.requestAnimationFrame.bind(window);
}();
var cancelFrame = function () {
  if (typeof window === "undefined") {
    return function () {};
  }
  for (var i = 0, limit = prefix.length; i < limit && !window.cancelAnimationFrame; ++i) {
    window.cancelAnimationFrame = window[prefix[i] + 'CancelAnimationFrame'] || window[prefix[i] + 'CancelRequestAnimationFrame'];
  }
  if (!window.cancelAnimationFrame) {
    window.cancelAnimationFrame = function (timer) {
      window.clearTimeout(timer);
    };
  }
  return window.cancelAnimationFrame.bind(window);
}();
function AutoScroller(elements, options) {
  if (options === void 0) options = {};
  var self = this;
  var maxSpeed = 4,
    scrolling = false;
  if (typeof options.margin !== 'object') {
    var margin = options.margin || -1;
    this.margin = {
      left: margin,
      right: margin,
      top: margin,
      bottom: margin
    };
  } else {
    this.margin = options.margin;
  }

  //this.scrolling = false;
  this.scrollWhenOutside = options.scrollWhenOutside || false;
  var point = {},
    pointCB = createPointCB(point),
    dispatcher = createDispatcher(),
    down = false;
  window.addEventListener('mousemove', pointCB, false);
  window.addEventListener('touchmove', pointCB, false);
  if (!isNaN(options.maxSpeed)) {
    maxSpeed = options.maxSpeed;
  }
  if (typeof maxSpeed !== 'object') {
    maxSpeed = {
      left: maxSpeed,
      right: maxSpeed,
      top: maxSpeed,
      bottom: maxSpeed
    };
  }
  this.autoScroll = boolean(options.autoScroll);
  this.syncMove = boolean(options.syncMove, false);
  this.destroy = function (forceCleanAnimation) {
    window.removeEventListener('mousemove', pointCB, false);
    window.removeEventListener('touchmove', pointCB, false);
    window.removeEventListener('mousedown', onDown, false);
    window.removeEventListener('touchstart', onDown, false);
    window.removeEventListener('mouseup', onUp, false);
    window.removeEventListener('touchend', onUp, false);
    window.removeEventListener('pointerup', onUp, false);
    window.removeEventListener('mouseleave', onMouseOut, false);
    window.removeEventListener('mousemove', onMove, false);
    window.removeEventListener('touchmove', onMove, false);
    window.removeEventListener('scroll', setScroll, true);
    elements = [];
    if (forceCleanAnimation) {
      cleanAnimation();
    }
  };
  this.add = function () {
    var element = [],
      len = arguments.length;
    while (len--) element[len] = arguments[len];
    addElements.apply(void 0, [elements].concat(element));
    return this;
  };
  this.remove = function () {
    var element = [],
      len = arguments.length;
    while (len--) element[len] = arguments[len];
    return removeElements.apply(void 0, [elements].concat(element));
  };
  var hasWindow = null,
    windowAnimationFrame;
  if (Object.prototype.toString.call(elements) !== '[object Array]') {
    elements = [elements];
  }
  (function (temp) {
    elements = [];
    temp.forEach(function (element) {
      if (element === window) {
        hasWindow = window;
      } else {
        self.add(element);
      }
    });
  })(elements);
  Object.defineProperties(this, {
    down: {
      get: function () {
        return down;
      }
    },
    maxSpeed: {
      get: function () {
        return maxSpeed;
      }
    },
    point: {
      get: function () {
        return point;
      }
    },
    scrolling: {
      get: function () {
        return scrolling;
      }
    }
  });
  var current = null,
    animationFrame;
  window.addEventListener('mousedown', onDown, false);
  window.addEventListener('touchstart', onDown, false);
  window.addEventListener('mouseup', onUp, false);
  window.addEventListener('touchend', onUp, false);

  /*
  IE does not trigger mouseup event when scrolling.
  It is a known issue that Microsoft won't fix.
  https://connect.microsoft.com/IE/feedback/details/783058/scrollbar-trigger-mousedown-but-not-mouseup
  IE supports pointer events instead
  */
  window.addEventListener('pointerup', onUp, false);
  window.addEventListener('mousemove', onMove, false);
  window.addEventListener('touchmove', onMove, false);
  window.addEventListener('mouseleave', onMouseOut, false);
  window.addEventListener('scroll', setScroll, true);
  function setScroll(e) {
    for (var i = 0; i < elements.length; i++) {
      if (elements[i] === e.target) {
        scrolling = true;
        break;
      }
    }
    if (scrolling) {
      requestFrame(function () {
        return scrolling = false;
      });
    }
  }
  function onDown() {
    down = true;
  }
  function onUp() {
    down = false;
    cleanAnimation();
  }
  function cleanAnimation() {
    cancelFrame(animationFrame);
    cancelFrame(windowAnimationFrame);
  }
  function onMouseOut() {
    down = false;
  }
  function getTarget(target) {
    if (!target) {
      return null;
    }
    if (current === target) {
      return target;
    }
    if (hasElement(elements, target)) {
      return target;
    }
    while (target = target.parentNode) {
      if (hasElement(elements, target)) {
        return target;
      }
    }
    return null;
  }
  function getElementUnderPoint() {
    var underPoint = null;
    for (var i = 0; i < elements.length; i++) {
      if (inside(point, elements[i])) {
        underPoint = elements[i];
      }
    }
    return underPoint;
  }
  function onMove(event) {
    if (!self.autoScroll()) {
      return;
    }
    if (event['dispatched']) {
      return;
    }
    var target = event.target,
      body = document.body;
    if (current && !inside(point, current)) {
      if (!self.scrollWhenOutside) {
        current = null;
      }
    }
    if (target && target.parentNode === body) {
      //The special condition to improve speed.
      target = getElementUnderPoint();
    } else {
      target = getTarget(target);
      if (!target) {
        target = getElementUnderPoint();
      }
    }
    if (target && target !== current) {
      current = target;
    }
    if (hasWindow) {
      cancelFrame(windowAnimationFrame);
      windowAnimationFrame = requestFrame(scrollWindow);
    }
    if (!current) {
      return;
    }
    cancelFrame(animationFrame);
    animationFrame = requestFrame(scrollTick);
  }
  function scrollWindow() {
    autoScroll(hasWindow);
    cancelFrame(windowAnimationFrame);
    windowAnimationFrame = requestFrame(scrollWindow);
  }
  function scrollTick() {
    if (!current) {
      return;
    }
    autoScroll(current);
    cancelFrame(animationFrame);
    animationFrame = requestFrame(scrollTick);
  }
  function autoScroll(el) {
    var rect = getClientRect(el),
      scrollx,
      scrolly;
    if (point.x < rect.left + self.margin.left) {
      scrollx = Math.floor(Math.max(-1, (point.x - rect.left) / self.margin.left - 1) * self.maxSpeed.left);
    } else if (point.x > rect.right - self.margin.right) {
      scrollx = Math.ceil(Math.min(1, (point.x - rect.right) / self.margin.right + 1) * self.maxSpeed.right);
    } else {
      scrollx = 0;
    }
    if (point.y < rect.top + self.margin.top) {
      scrolly = Math.floor(Math.max(-1, (point.y - rect.top) / self.margin.top - 1) * self.maxSpeed.top);
    } else if (point.y > rect.bottom - self.margin.bottom) {
      scrolly = Math.ceil(Math.min(1, (point.y - rect.bottom) / self.margin.bottom + 1) * self.maxSpeed.bottom);
    } else {
      scrolly = 0;
    }
    if (self.syncMove()) {
      /*
      Notes about mousemove event dispatch.
      screen(X/Y) should need to be updated.
      Some other properties might need to be set.
      Keep the syncMove option default false until all inconsistencies are taken care of.
      */
      dispatcher.dispatch(el, {
        pageX: point.pageX + scrollx,
        pageY: point.pageY + scrolly,
        clientX: point.x + scrollx,
        clientY: point.y + scrolly
      });
    }
    setTimeout(function () {
      if (scrolly) {
        scrollY(el, scrolly);
      }
      if (scrollx) {
        scrollX(el, scrollx);
      }
    });
  }
  function scrollY(el, amount) {
    if (el === window) {
      window.scrollTo(el.pageXOffset, el.pageYOffset + amount);
    } else {
      el.scrollTop += amount;
    }
  }
  function scrollX(el, amount) {
    if (el === window) {
      window.scrollTo(el.pageXOffset + amount, el.pageYOffset);
    } else {
      el.scrollLeft += amount;
    }
  }
}
function AutoScrollerFactory(element, options) {
  return new AutoScroller(element, options);
}
function inside(point, el, rect) {
  if (!rect) {
    return pointInside(point, el);
  } else {
    return point.y > rect.top && point.y < rect.bottom && point.x > rect.left && point.x < rect.right;
  }
}

/*
git remote add origin https://github.com/hollowdoor/dom_autoscroller.git
git push -u origin master
*/

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AutoScrollerFactory);

/***/ }),

/***/ 66111:
/*!***************************************************************************!*\
  !*** ./node_modules/angular-calendar/date-adapters/esm/date-fns/index.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adapterFactory: () => (/* binding */ adapterFactory)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! tslib */ 24398);
/* harmony import */ var calendar_utils_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! calendar-utils/date-adapters/date-fns */ 10856);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns */ 6243);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! date-fns */ 36337);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! date-fns */ 12786);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! date-fns */ 19174);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! date-fns */ 70602);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! date-fns */ 27308);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! date-fns */ 16613);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! date-fns */ 57961);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! date-fns */ 54730);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! date-fns */ 36233);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! date-fns */ 72302);



function adapterFactory() {
  return (0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)((0,tslib__WEBPACK_IMPORTED_MODULE_1__.__assign)({}, (0,calendar_utils_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_0__.adapterFactory)()), {
    addWeeks: date_fns__WEBPACK_IMPORTED_MODULE_2__.addWeeks,
    addMonths: date_fns__WEBPACK_IMPORTED_MODULE_3__.addMonths,
    subDays: date_fns__WEBPACK_IMPORTED_MODULE_4__.subDays,
    subWeeks: date_fns__WEBPACK_IMPORTED_MODULE_5__.subWeeks,
    subMonths: date_fns__WEBPACK_IMPORTED_MODULE_6__.subMonths,
    getISOWeek: date_fns__WEBPACK_IMPORTED_MODULE_7__.getISOWeek,
    setDate: date_fns__WEBPACK_IMPORTED_MODULE_8__.setDate,
    setMonth: date_fns__WEBPACK_IMPORTED_MODULE_9__.setMonth,
    setYear: date_fns__WEBPACK_IMPORTED_MODULE_10__.setYear,
    getDate: date_fns__WEBPACK_IMPORTED_MODULE_11__.getDate,
    getYear: date_fns__WEBPACK_IMPORTED_MODULE_12__.getYear
  });
}

/***/ }),

/***/ 39333:
/*!*******************************************************!*\
  !*** ./node_modules/calendar-utils/calendar-utils.js ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DAYS_OF_WEEK: () => (/* binding */ DAYS_OF_WEEK),
/* harmony export */   EventValidationErrorMessage: () => (/* binding */ EventValidationErrorMessage),
/* harmony export */   SECONDS_IN_DAY: () => (/* binding */ SECONDS_IN_DAY),
/* harmony export */   getAllDayWeekEvents: () => (/* binding */ getAllDayWeekEvents),
/* harmony export */   getDifferenceInDaysWithExclusions: () => (/* binding */ getDifferenceInDaysWithExclusions),
/* harmony export */   getEventsInPeriod: () => (/* binding */ getEventsInPeriod),
/* harmony export */   getMonthView: () => (/* binding */ getMonthView),
/* harmony export */   getWeekView: () => (/* binding */ getWeekView),
/* harmony export */   getWeekViewHeader: () => (/* binding */ getWeekViewHeader),
/* harmony export */   validateEvents: () => (/* binding */ validateEvents)
/* harmony export */ });
var __assign = undefined && undefined.__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var DAYS_OF_WEEK;
(function (DAYS_OF_WEEK) {
  DAYS_OF_WEEK[DAYS_OF_WEEK["SUNDAY"] = 0] = "SUNDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["MONDAY"] = 1] = "MONDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["TUESDAY"] = 2] = "TUESDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["WEDNESDAY"] = 3] = "WEDNESDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["THURSDAY"] = 4] = "THURSDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["FRIDAY"] = 5] = "FRIDAY";
  DAYS_OF_WEEK[DAYS_OF_WEEK["SATURDAY"] = 6] = "SATURDAY";
})(DAYS_OF_WEEK || (DAYS_OF_WEEK = {}));
var DEFAULT_WEEKEND_DAYS = [DAYS_OF_WEEK.SUNDAY, DAYS_OF_WEEK.SATURDAY];
var DAYS_IN_WEEK = 7;
var HOURS_IN_DAY = 24;
var MINUTES_IN_HOUR = 60;
var SECONDS_IN_DAY = 60 * 60 * 24;
function getExcludedSeconds(dateAdapter, _a) {
  var startDate = _a.startDate,
    seconds = _a.seconds,
    excluded = _a.excluded,
    precision = _a.precision;
  if (excluded.length < 1) {
    return 0;
  }
  var addSeconds = dateAdapter.addSeconds,
    getDay = dateAdapter.getDay,
    addDays = dateAdapter.addDays;
  var endDate = addSeconds(startDate, seconds - 1);
  var dayStart = getDay(startDate);
  var dayEnd = getDay(endDate);
  var result = 0; // Calculated in seconds
  var current = startDate;
  var _loop_1 = function () {
    var day = getDay(current);
    if (excluded.some(function (excludedDay) {
      return excludedDay === day;
    })) {
      result += calculateExcludedSeconds(dateAdapter, {
        dayStart: dayStart,
        dayEnd: dayEnd,
        day: day,
        precision: precision,
        startDate: startDate,
        endDate: endDate
      });
    }
    current = addDays(current, 1);
  };
  while (current < endDate) {
    _loop_1();
  }
  return result;
}
function calculateExcludedSeconds(dateAdapter, _a) {
  var precision = _a.precision,
    day = _a.day,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd,
    startDate = _a.startDate,
    endDate = _a.endDate;
  var differenceInSeconds = dateAdapter.differenceInSeconds,
    endOfDay = dateAdapter.endOfDay,
    startOfDay = dateAdapter.startOfDay;
  if (precision === 'minutes') {
    if (day === dayStart) {
      return differenceInSeconds(endOfDay(startDate), startDate) + 1;
    } else if (day === dayEnd) {
      return differenceInSeconds(endDate, startOfDay(endDate)) + 1;
    }
  }
  return SECONDS_IN_DAY;
}
function getWeekViewEventSpan(dateAdapter, _a) {
  var event = _a.event,
    offset = _a.offset,
    startOfWeekDate = _a.startOfWeekDate,
    excluded = _a.excluded,
    precision = _a.precision,
    totalDaysInView = _a.totalDaysInView;
  var max = dateAdapter.max,
    differenceInSeconds = dateAdapter.differenceInSeconds,
    addDays = dateAdapter.addDays,
    endOfDay = dateAdapter.endOfDay,
    differenceInDays = dateAdapter.differenceInDays;
  var span = SECONDS_IN_DAY;
  var begin = max([event.start, startOfWeekDate]);
  if (event.end) {
    switch (precision) {
      case 'minutes':
        span = differenceInSeconds(event.end, begin);
        break;
      default:
        span = differenceInDays(addDays(endOfDay(event.end), 1), begin) * SECONDS_IN_DAY;
        break;
    }
  }
  var offsetSeconds = offset * SECONDS_IN_DAY;
  var totalLength = offsetSeconds + span;
  // the best way to detect if an event is outside the week-view
  // is to check if the total span beginning (from startOfWeekDay or event start) exceeds the total days in the view
  var secondsInView = totalDaysInView * SECONDS_IN_DAY;
  if (totalLength > secondsInView) {
    span = secondsInView - offsetSeconds;
  }
  span -= getExcludedSeconds(dateAdapter, {
    startDate: begin,
    seconds: span,
    excluded: excluded,
    precision: precision
  });
  return span / SECONDS_IN_DAY;
}
function getWeekViewEventOffset(dateAdapter, _a) {
  var event = _a.event,
    startOfWeekDate = _a.startOfWeek,
    excluded = _a.excluded,
    precision = _a.precision;
  var differenceInDays = dateAdapter.differenceInDays,
    startOfDay = dateAdapter.startOfDay,
    differenceInSeconds = dateAdapter.differenceInSeconds;
  if (event.start < startOfWeekDate) {
    return 0;
  }
  var offset = 0;
  switch (precision) {
    case 'days':
      offset = differenceInDays(startOfDay(event.start), startOfWeekDate) * SECONDS_IN_DAY;
      break;
    case 'minutes':
      offset = differenceInSeconds(event.start, startOfWeekDate);
      break;
  }
  offset -= getExcludedSeconds(dateAdapter, {
    startDate: startOfWeekDate,
    seconds: offset,
    excluded: excluded,
    precision: precision
  });
  return Math.abs(offset / SECONDS_IN_DAY);
}
function isEventIsPeriod(dateAdapter, _a) {
  var event = _a.event,
    periodStart = _a.periodStart,
    periodEnd = _a.periodEnd;
  var isSameSecond = dateAdapter.isSameSecond;
  var eventStart = event.start;
  var eventEnd = event.end || event.start;
  if (eventStart > periodStart && eventStart < periodEnd) {
    return true;
  }
  if (eventEnd > periodStart && eventEnd < periodEnd) {
    return true;
  }
  if (eventStart < periodStart && eventEnd > periodEnd) {
    return true;
  }
  if (isSameSecond(eventStart, periodStart) || isSameSecond(eventStart, periodEnd)) {
    return true;
  }
  if (isSameSecond(eventEnd, periodStart) || isSameSecond(eventEnd, periodEnd)) {
    return true;
  }
  return false;
}
function getEventsInPeriod(dateAdapter, _a) {
  var events = _a.events,
    periodStart = _a.periodStart,
    periodEnd = _a.periodEnd;
  return events.filter(function (event) {
    return isEventIsPeriod(dateAdapter, {
      event: event,
      periodStart: periodStart,
      periodEnd: periodEnd
    });
  });
}
function getWeekDay(dateAdapter, _a) {
  var date = _a.date,
    _b = _a.weekendDays,
    weekendDays = _b === void 0 ? DEFAULT_WEEKEND_DAYS : _b;
  var startOfDay = dateAdapter.startOfDay,
    isSameDay = dateAdapter.isSameDay,
    getDay = dateAdapter.getDay;
  var today = startOfDay(new Date());
  var day = getDay(date);
  return {
    date: date,
    day: day,
    isPast: date < today,
    isToday: isSameDay(date, today),
    isFuture: date > today,
    isWeekend: weekendDays.indexOf(day) > -1
  };
}
function getWeekViewHeader(dateAdapter, _a) {
  var viewDate = _a.viewDate,
    weekStartsOn = _a.weekStartsOn,
    _b = _a.excluded,
    excluded = _b === void 0 ? [] : _b,
    weekendDays = _a.weekendDays,
    _c = _a.viewStart,
    viewStart = _c === void 0 ? dateAdapter.startOfWeek(viewDate, {
      weekStartsOn: weekStartsOn
    }) : _c,
    _d = _a.viewEnd,
    viewEnd = _d === void 0 ? dateAdapter.addDays(viewStart, DAYS_IN_WEEK) : _d;
  var addDays = dateAdapter.addDays,
    getDay = dateAdapter.getDay;
  var days = [];
  var date = viewStart;
  while (date < viewEnd) {
    if (!excluded.some(function (e) {
      return getDay(date) === e;
    })) {
      days.push(getWeekDay(dateAdapter, {
        date: date,
        weekendDays: weekendDays
      }));
    }
    date = addDays(date, 1);
  }
  return days;
}
function getDifferenceInDaysWithExclusions(dateAdapter, _a) {
  var date1 = _a.date1,
    date2 = _a.date2,
    excluded = _a.excluded;
  var date = date1;
  var diff = 0;
  while (date < date2) {
    if (excluded.indexOf(dateAdapter.getDay(date)) === -1) {
      diff++;
    }
    date = dateAdapter.addDays(date, 1);
  }
  return diff;
}
function getAllDayWeekEvents(dateAdapter, _a) {
  var _b = _a.events,
    events = _b === void 0 ? [] : _b,
    _c = _a.excluded,
    excluded = _c === void 0 ? [] : _c,
    _d = _a.precision,
    precision = _d === void 0 ? 'days' : _d,
    _e = _a.absolutePositionedEvents,
    absolutePositionedEvents = _e === void 0 ? false : _e,
    viewStart = _a.viewStart,
    viewEnd = _a.viewEnd;
  viewStart = dateAdapter.startOfDay(viewStart);
  viewEnd = dateAdapter.endOfDay(viewEnd);
  var differenceInSeconds = dateAdapter.differenceInSeconds,
    differenceInDays = dateAdapter.differenceInDays;
  var maxRange = getDifferenceInDaysWithExclusions(dateAdapter, {
    date1: viewStart,
    date2: viewEnd,
    excluded: excluded
  });
  var totalDaysInView = differenceInDays(viewEnd, viewStart) + 1;
  var eventsMapped = events.filter(function (event) {
    return event.allDay;
  }).map(function (event) {
    var offset = getWeekViewEventOffset(dateAdapter, {
      event: event,
      startOfWeek: viewStart,
      excluded: excluded,
      precision: precision
    });
    var span = getWeekViewEventSpan(dateAdapter, {
      event: event,
      offset: offset,
      startOfWeekDate: viewStart,
      excluded: excluded,
      precision: precision,
      totalDaysInView: totalDaysInView
    });
    return {
      event: event,
      offset: offset,
      span: span
    };
  }).filter(function (e) {
    return e.offset < maxRange;
  }).filter(function (e) {
    return e.span > 0;
  }).map(function (entry) {
    return {
      event: entry.event,
      offset: entry.offset,
      span: entry.span,
      startsBeforeWeek: entry.event.start < viewStart,
      endsAfterWeek: (entry.event.end || entry.event.start) > viewEnd
    };
  }).sort(function (itemA, itemB) {
    var startSecondsDiff = differenceInSeconds(itemA.event.start, itemB.event.start);
    if (startSecondsDiff === 0) {
      return differenceInSeconds(itemB.event.end || itemB.event.start, itemA.event.end || itemA.event.start);
    }
    return startSecondsDiff;
  });
  var allDayEventRows = [];
  var allocatedEvents = [];
  eventsMapped.forEach(function (event, index) {
    if (allocatedEvents.indexOf(event) === -1) {
      allocatedEvents.push(event);
      var rowSpan_1 = event.span + event.offset;
      var otherRowEvents = eventsMapped.slice(index + 1).filter(function (nextEvent) {
        if (nextEvent.offset >= rowSpan_1 && rowSpan_1 + nextEvent.span <= totalDaysInView && allocatedEvents.indexOf(nextEvent) === -1) {
          var nextEventOffset = nextEvent.offset - rowSpan_1;
          if (!absolutePositionedEvents) {
            nextEvent.offset = nextEventOffset;
          }
          rowSpan_1 += nextEvent.span + nextEventOffset;
          allocatedEvents.push(nextEvent);
          return true;
        }
      });
      var weekEvents = __spreadArray([event], otherRowEvents, true);
      var id = weekEvents.filter(function (weekEvent) {
        return weekEvent.event.id;
      }).map(function (weekEvent) {
        return weekEvent.event.id;
      }).join('-');
      allDayEventRows.push(__assign({
        row: weekEvents
      }, id ? {
        id: id
      } : {}));
    }
  });
  return allDayEventRows;
}
function getWeekViewHourGrid(dateAdapter, _a) {
  var events = _a.events,
    viewDate = _a.viewDate,
    hourSegments = _a.hourSegments,
    hourDuration = _a.hourDuration,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd,
    weekStartsOn = _a.weekStartsOn,
    excluded = _a.excluded,
    weekendDays = _a.weekendDays,
    segmentHeight = _a.segmentHeight,
    viewStart = _a.viewStart,
    viewEnd = _a.viewEnd,
    minimumEventHeight = _a.minimumEventHeight;
  var dayViewHourGrid = getDayViewHourGrid(dateAdapter, {
    viewDate: viewDate,
    hourSegments: hourSegments,
    hourDuration: hourDuration,
    dayStart: dayStart,
    dayEnd: dayEnd
  });
  var weekDays = getWeekViewHeader(dateAdapter, {
    viewDate: viewDate,
    weekStartsOn: weekStartsOn,
    excluded: excluded,
    weekendDays: weekendDays,
    viewStart: viewStart,
    viewEnd: viewEnd
  });
  var setHours = dateAdapter.setHours,
    setMinutes = dateAdapter.setMinutes,
    getHours = dateAdapter.getHours,
    getMinutes = dateAdapter.getMinutes;
  return weekDays.map(function (day) {
    var dayView = getDayView(dateAdapter, {
      events: events,
      viewDate: day.date,
      hourSegments: hourSegments,
      dayStart: dayStart,
      dayEnd: dayEnd,
      segmentHeight: segmentHeight,
      eventWidth: 1,
      hourDuration: hourDuration,
      minimumEventHeight: minimumEventHeight
    });
    var hours = dayViewHourGrid.map(function (hour) {
      var segments = hour.segments.map(function (segment) {
        var date = setMinutes(setHours(day.date, getHours(segment.date)), getMinutes(segment.date));
        return __assign(__assign({}, segment), {
          date: date
        });
      });
      return __assign(__assign({}, hour), {
        segments: segments
      });
    });
    function getColumnCount(allEvents, prevOverlappingEvents) {
      var columnCount = Math.max.apply(Math, prevOverlappingEvents.map(function (iEvent) {
        return iEvent.left + 1;
      }));
      var nextOverlappingEvents = allEvents.filter(function (iEvent) {
        return iEvent.left >= columnCount;
      }).filter(function (iEvent) {
        return getOverLappingWeekViewEvents(prevOverlappingEvents, iEvent.top, iEvent.top + iEvent.height).length > 0;
      });
      if (nextOverlappingEvents.length > 0) {
        return getColumnCount(allEvents, nextOverlappingEvents);
      } else {
        return columnCount;
      }
    }
    var mappedEvents = dayView.events.map(function (event) {
      var columnCount = getColumnCount(dayView.events, getOverLappingWeekViewEvents(dayView.events, event.top, event.top + event.height));
      var width = 100 / columnCount;
      return __assign(__assign({}, event), {
        left: event.left * width,
        width: width
      });
    });
    return {
      hours: hours,
      date: day.date,
      events: mappedEvents.map(function (event) {
        var overLappingEvents = getOverLappingWeekViewEvents(mappedEvents.filter(function (otherEvent) {
          return otherEvent.left > event.left;
        }), event.top, event.top + event.height);
        if (overLappingEvents.length > 0) {
          return __assign(__assign({}, event), {
            width: Math.min.apply(Math, overLappingEvents.map(function (otherEvent) {
              return otherEvent.left;
            })) - event.left
          });
        }
        return event;
      })
    };
  });
}
function getWeekView(dateAdapter, _a) {
  var _b = _a.events,
    events = _b === void 0 ? [] : _b,
    viewDate = _a.viewDate,
    weekStartsOn = _a.weekStartsOn,
    _c = _a.excluded,
    excluded = _c === void 0 ? [] : _c,
    _d = _a.precision,
    precision = _d === void 0 ? 'days' : _d,
    _e = _a.absolutePositionedEvents,
    absolutePositionedEvents = _e === void 0 ? false : _e,
    hourSegments = _a.hourSegments,
    hourDuration = _a.hourDuration,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd,
    weekendDays = _a.weekendDays,
    segmentHeight = _a.segmentHeight,
    minimumEventHeight = _a.minimumEventHeight,
    _f = _a.viewStart,
    viewStart = _f === void 0 ? dateAdapter.startOfWeek(viewDate, {
      weekStartsOn: weekStartsOn
    }) : _f,
    _g = _a.viewEnd,
    viewEnd = _g === void 0 ? dateAdapter.endOfWeek(viewDate, {
      weekStartsOn: weekStartsOn
    }) : _g;
  if (!events) {
    events = [];
  }
  var startOfDay = dateAdapter.startOfDay,
    endOfDay = dateAdapter.endOfDay;
  viewStart = startOfDay(viewStart);
  viewEnd = endOfDay(viewEnd);
  var eventsInPeriod = getEventsInPeriod(dateAdapter, {
    events: events,
    periodStart: viewStart,
    periodEnd: viewEnd
  });
  var header = getWeekViewHeader(dateAdapter, {
    viewDate: viewDate,
    weekStartsOn: weekStartsOn,
    excluded: excluded,
    weekendDays: weekendDays,
    viewStart: viewStart,
    viewEnd: viewEnd
  });
  return {
    allDayEventRows: getAllDayWeekEvents(dateAdapter, {
      events: eventsInPeriod,
      excluded: excluded,
      precision: precision,
      absolutePositionedEvents: absolutePositionedEvents,
      viewStart: viewStart,
      viewEnd: viewEnd
    }),
    period: {
      events: eventsInPeriod,
      start: header[0].date,
      end: endOfDay(header[header.length - 1].date)
    },
    hourColumns: getWeekViewHourGrid(dateAdapter, {
      events: events,
      viewDate: viewDate,
      hourSegments: hourSegments,
      hourDuration: hourDuration,
      dayStart: dayStart,
      dayEnd: dayEnd,
      weekStartsOn: weekStartsOn,
      excluded: excluded,
      weekendDays: weekendDays,
      segmentHeight: segmentHeight,
      viewStart: viewStart,
      viewEnd: viewEnd,
      minimumEventHeight: minimumEventHeight
    })
  };
}
function getMonthView(dateAdapter, _a) {
  var _b = _a.events,
    events = _b === void 0 ? [] : _b,
    viewDate = _a.viewDate,
    weekStartsOn = _a.weekStartsOn,
    _c = _a.excluded,
    excluded = _c === void 0 ? [] : _c,
    _d = _a.viewStart,
    viewStart = _d === void 0 ? dateAdapter.startOfMonth(viewDate) : _d,
    _e = _a.viewEnd,
    viewEnd = _e === void 0 ? dateAdapter.endOfMonth(viewDate) : _e,
    weekendDays = _a.weekendDays;
  if (!events) {
    events = [];
  }
  var startOfWeek = dateAdapter.startOfWeek,
    endOfWeek = dateAdapter.endOfWeek,
    differenceInDays = dateAdapter.differenceInDays,
    startOfDay = dateAdapter.startOfDay,
    addHours = dateAdapter.addHours,
    endOfDay = dateAdapter.endOfDay,
    isSameMonth = dateAdapter.isSameMonth,
    getDay = dateAdapter.getDay;
  var start = startOfWeek(viewStart, {
    weekStartsOn: weekStartsOn
  });
  var end = endOfWeek(viewEnd, {
    weekStartsOn: weekStartsOn
  });
  var eventsInMonth = getEventsInPeriod(dateAdapter, {
    events: events,
    periodStart: start,
    periodEnd: end
  });
  var initialViewDays = [];
  var previousDate;
  var _loop_2 = function (i) {
    // hacky fix for https://github.com/mattlewis92/angular-calendar/issues/173
    var date;
    if (previousDate) {
      date = startOfDay(addHours(previousDate, HOURS_IN_DAY));
      if (previousDate.getTime() === date.getTime()) {
        // DST change, so need to add 25 hours
        /* istanbul ignore next */
        date = startOfDay(addHours(previousDate, HOURS_IN_DAY + 1));
      }
      previousDate = date;
    } else {
      date = previousDate = start;
    }
    if (!excluded.some(function (e) {
      return getDay(date) === e;
    })) {
      var day = getWeekDay(dateAdapter, {
        date: date,
        weekendDays: weekendDays
      });
      var eventsInPeriod = getEventsInPeriod(dateAdapter, {
        events: eventsInMonth,
        periodStart: startOfDay(date),
        periodEnd: endOfDay(date)
      });
      day.inMonth = isSameMonth(date, viewDate);
      day.events = eventsInPeriod;
      day.badgeTotal = eventsInPeriod.length;
      initialViewDays.push(day);
    }
  };
  for (var i = 0; i < differenceInDays(end, start) + 1; i++) {
    _loop_2(i);
  }
  var days = [];
  var totalDaysVisibleInWeek = DAYS_IN_WEEK - excluded.length;
  if (totalDaysVisibleInWeek < DAYS_IN_WEEK) {
    for (var i = 0; i < initialViewDays.length; i += totalDaysVisibleInWeek) {
      var row = initialViewDays.slice(i, i + totalDaysVisibleInWeek);
      var isRowInMonth = row.some(function (day) {
        return viewStart <= day.date && day.date < viewEnd;
      });
      if (isRowInMonth) {
        days = __spreadArray(__spreadArray([], days, true), row, true);
      }
    }
  } else {
    days = initialViewDays;
  }
  var rows = Math.floor(days.length / totalDaysVisibleInWeek);
  var rowOffsets = [];
  for (var i = 0; i < rows; i++) {
    rowOffsets.push(i * totalDaysVisibleInWeek);
  }
  return {
    rowOffsets: rowOffsets,
    totalDaysVisibleInWeek: totalDaysVisibleInWeek,
    days: days,
    period: {
      start: days[0].date,
      end: endOfDay(days[days.length - 1].date),
      events: eventsInMonth
    }
  };
}
function getOverLappingWeekViewEvents(events, top, bottom) {
  return events.filter(function (previousEvent) {
    var previousEventTop = previousEvent.top;
    var previousEventBottom = previousEvent.top + previousEvent.height;
    if (top < previousEventBottom && previousEventBottom < bottom) {
      return true;
    } else if (top < previousEventTop && previousEventTop < bottom) {
      return true;
    } else if (previousEventTop <= top && bottom <= previousEventBottom) {
      return true;
    }
    return false;
  });
}
function getDayView(dateAdapter, _a) {
  var events = _a.events,
    viewDate = _a.viewDate,
    hourSegments = _a.hourSegments,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd,
    eventWidth = _a.eventWidth,
    segmentHeight = _a.segmentHeight,
    hourDuration = _a.hourDuration,
    minimumEventHeight = _a.minimumEventHeight;
  var setMinutes = dateAdapter.setMinutes,
    setHours = dateAdapter.setHours,
    startOfDay = dateAdapter.startOfDay,
    startOfMinute = dateAdapter.startOfMinute,
    endOfDay = dateAdapter.endOfDay,
    differenceInMinutes = dateAdapter.differenceInMinutes;
  var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
  var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
  endOfView.setSeconds(59, 999);
  var previousDayEvents = [];
  var eventsInPeriod = getEventsInPeriod(dateAdapter, {
    events: events.filter(function (event) {
      return !event.allDay;
    }),
    periodStart: startOfView,
    periodEnd: endOfView
  });
  var dayViewEvents = eventsInPeriod.sort(function (eventA, eventB) {
    return eventA.start.valueOf() - eventB.start.valueOf();
  }).map(function (event) {
    var eventStart = event.start;
    var eventEnd = event.end || eventStart;
    var startsBeforeDay = eventStart < startOfView;
    var endsAfterDay = eventEnd > endOfView;
    var hourHeightModifier = hourSegments * segmentHeight / (hourDuration || MINUTES_IN_HOUR);
    var top = 0;
    if (eventStart > startOfView) {
      // adjust the difference in minutes if the user's offset is different between the start of the day and the event (e.g. when going to or from DST)
      var eventOffset = dateAdapter.getTimezoneOffset(eventStart);
      var startOffset = dateAdapter.getTimezoneOffset(startOfView);
      var diff = startOffset - eventOffset;
      top += differenceInMinutes(eventStart, startOfView) + diff;
    }
    top *= hourHeightModifier;
    top = Math.floor(top);
    var startDate = startsBeforeDay ? startOfView : eventStart;
    var endDate = endsAfterDay ? endOfView : eventEnd;
    var timezoneOffset = dateAdapter.getTimezoneOffset(startDate) - dateAdapter.getTimezoneOffset(endDate);
    var height = differenceInMinutes(endDate, startDate) + timezoneOffset;
    if (!event.end) {
      height = segmentHeight;
    } else {
      height *= hourHeightModifier;
    }
    if (minimumEventHeight && height < minimumEventHeight) {
      height = minimumEventHeight;
    }
    height = Math.floor(height);
    var bottom = top + height;
    var overlappingPreviousEvents = getOverLappingWeekViewEvents(previousDayEvents, top, bottom);
    var left = 0;
    while (overlappingPreviousEvents.some(function (previousEvent) {
      return previousEvent.left === left;
    })) {
      left += eventWidth;
    }
    var dayEvent = {
      event: event,
      height: height,
      width: eventWidth,
      top: top,
      left: left,
      startsBeforeDay: startsBeforeDay,
      endsAfterDay: endsAfterDay
    };
    previousDayEvents.push(dayEvent);
    return dayEvent;
  });
  var width = Math.max.apply(Math, dayViewEvents.map(function (event) {
    return event.left + event.width;
  }));
  var allDayEvents = getEventsInPeriod(dateAdapter, {
    events: events.filter(function (event) {
      return event.allDay;
    }),
    periodStart: startOfDay(startOfView),
    periodEnd: endOfDay(endOfView)
  });
  return {
    events: dayViewEvents,
    width: width,
    allDayEvents: allDayEvents,
    period: {
      events: eventsInPeriod,
      start: startOfView,
      end: endOfView
    }
  };
}
function sanitiseHours(hours) {
  return Math.max(Math.min(23, hours), 0);
}
function sanitiseMinutes(minutes) {
  return Math.max(Math.min(59, minutes), 0);
}
function getDayViewHourGrid(dateAdapter, _a) {
  var viewDate = _a.viewDate,
    hourSegments = _a.hourSegments,
    hourDuration = _a.hourDuration,
    dayStart = _a.dayStart,
    dayEnd = _a.dayEnd;
  var setMinutes = dateAdapter.setMinutes,
    setHours = dateAdapter.setHours,
    startOfDay = dateAdapter.startOfDay,
    startOfMinute = dateAdapter.startOfMinute,
    endOfDay = dateAdapter.endOfDay,
    addMinutes = dateAdapter.addMinutes,
    addDays = dateAdapter.addDays;
  var hours = [];
  var startOfView = setMinutes(setHours(startOfDay(viewDate), sanitiseHours(dayStart.hour)), sanitiseMinutes(dayStart.minute));
  var endOfView = setMinutes(setHours(startOfMinute(endOfDay(viewDate)), sanitiseHours(dayEnd.hour)), sanitiseMinutes(dayEnd.minute));
  var segmentDuration = (hourDuration || MINUTES_IN_HOUR) / hourSegments;
  var startOfViewDay = startOfDay(viewDate);
  var endOfViewDay = endOfDay(viewDate);
  var dateAdjustment = function (d) {
    return d;
  };
  // this means that we change from or to DST on this day and that's going to cause problems so we bump the date
  if (dateAdapter.getTimezoneOffset(startOfViewDay) !== dateAdapter.getTimezoneOffset(endOfViewDay)) {
    startOfViewDay = addDays(startOfViewDay, 1);
    startOfView = addDays(startOfView, 1);
    endOfView = addDays(endOfView, 1);
    dateAdjustment = function (d) {
      return addDays(d, -1);
    };
  }
  var dayDuration = hourDuration ? HOURS_IN_DAY * 60 / hourDuration : MINUTES_IN_HOUR;
  for (var i = 0; i < dayDuration; i++) {
    var segments = [];
    for (var j = 0; j < hourSegments; j++) {
      var date = addMinutes(addMinutes(startOfView, i * (hourDuration || MINUTES_IN_HOUR)), j * segmentDuration);
      if (date >= startOfView && date < endOfView) {
        segments.push({
          date: dateAdjustment(date),
          displayDate: date,
          isStart: j === 0
        });
      }
    }
    if (segments.length > 0) {
      hours.push({
        segments: segments
      });
    }
  }
  return hours;
}
var EventValidationErrorMessage;
(function (EventValidationErrorMessage) {
  EventValidationErrorMessage["NotArray"] = "Events must be an array";
  EventValidationErrorMessage["StartPropertyMissing"] = "Event is missing the `start` property";
  EventValidationErrorMessage["StartPropertyNotDate"] = "Event `start` property should be a javascript date object. Do `new Date(event.start)` to fix it.";
  EventValidationErrorMessage["EndPropertyNotDate"] = "Event `end` property should be a javascript date object. Do `new Date(event.end)` to fix it.";
  EventValidationErrorMessage["EndsBeforeStart"] = "Event `start` property occurs after the `end`";
})(EventValidationErrorMessage || (EventValidationErrorMessage = {}));
function validateEvents(events, log) {
  var isValid = true;
  function isError(msg, event) {
    log(msg, event);
    isValid = false;
  }
  if (!Array.isArray(events)) {
    log(EventValidationErrorMessage.NotArray, events);
    return false;
  }
  events.forEach(function (event) {
    if (!event.start) {
      isError(EventValidationErrorMessage.StartPropertyMissing, event);
    } else if (!(event.start instanceof Date)) {
      isError(EventValidationErrorMessage.StartPropertyNotDate, event);
    }
    if (event.end) {
      if (!(event.end instanceof Date)) {
        isError(EventValidationErrorMessage.EndPropertyNotDate, event);
      }
      if (event.start > event.end) {
        isError(EventValidationErrorMessage.EndsBeforeStart, event);
      }
    }
  });
  return isValid;
}

/***/ }),

/***/ 10856:
/*!*************************************************************************!*\
  !*** ./node_modules/calendar-utils/date-adapters/esm/date-fns/index.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   adapterFactory: () => (/* binding */ adapterFactory)
/* harmony export */ });
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! date-fns */ 28797);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! date-fns */ 29533);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! date-fns */ 49675);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! date-fns */ 75859);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! date-fns */ 71246);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! date-fns */ 1874);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! date-fns */ 64362);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! date-fns */ 56441);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! date-fns */ 21121);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! date-fns */ 60665);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! date-fns */ 1085);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! date-fns */ 76301);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! date-fns */ 31257);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! date-fns */ 79681);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! date-fns */ 2617);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! date-fns */ 17259);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! date-fns */ 3330);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! date-fns */ 77052);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! date-fns */ 33240);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! date-fns */ 23206);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! date-fns */ 60452);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! date-fns */ 90610);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! date-fns */ 89318);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! date-fns */ 89208);

function getTimezoneOffset(date) {
  return new Date(date).getTimezoneOffset();
}
function adapterFactory() {
  return {
    addDays: date_fns__WEBPACK_IMPORTED_MODULE_0__.addDays,
    addHours: date_fns__WEBPACK_IMPORTED_MODULE_1__.addHours,
    addMinutes: date_fns__WEBPACK_IMPORTED_MODULE_2__.addMinutes,
    addSeconds: date_fns__WEBPACK_IMPORTED_MODULE_3__.addSeconds,
    differenceInDays: date_fns__WEBPACK_IMPORTED_MODULE_4__.differenceInDays,
    differenceInMinutes: date_fns__WEBPACK_IMPORTED_MODULE_5__.differenceInMinutes,
    differenceInSeconds: date_fns__WEBPACK_IMPORTED_MODULE_6__.differenceInSeconds,
    endOfDay: date_fns__WEBPACK_IMPORTED_MODULE_7__.endOfDay,
    endOfMonth: date_fns__WEBPACK_IMPORTED_MODULE_8__.endOfMonth,
    endOfWeek: date_fns__WEBPACK_IMPORTED_MODULE_9__.endOfWeek,
    getDay: date_fns__WEBPACK_IMPORTED_MODULE_10__.getDay,
    getMonth: date_fns__WEBPACK_IMPORTED_MODULE_11__.getMonth,
    isSameDay: date_fns__WEBPACK_IMPORTED_MODULE_12__.isSameDay,
    isSameMonth: date_fns__WEBPACK_IMPORTED_MODULE_13__.isSameMonth,
    isSameSecond: date_fns__WEBPACK_IMPORTED_MODULE_14__.isSameSecond,
    max: date_fns__WEBPACK_IMPORTED_MODULE_15__.max,
    setHours: date_fns__WEBPACK_IMPORTED_MODULE_16__.setHours,
    setMinutes: date_fns__WEBPACK_IMPORTED_MODULE_17__.setMinutes,
    startOfDay: date_fns__WEBPACK_IMPORTED_MODULE_18__.startOfDay,
    startOfMinute: date_fns__WEBPACK_IMPORTED_MODULE_19__.startOfMinute,
    startOfMonth: date_fns__WEBPACK_IMPORTED_MODULE_20__.startOfMonth,
    startOfWeek: date_fns__WEBPACK_IMPORTED_MODULE_21__.startOfWeek,
    getHours: date_fns__WEBPACK_IMPORTED_MODULE_22__.getHours,
    getMinutes: date_fns__WEBPACK_IMPORTED_MODULE_23__.getMinutes,
    getTimezoneOffset: getTimezoneOffset
  };
}

/***/ }),

/***/ 71227:
/*!************************************************!*\
  !*** ./node_modules/positioning/dist/entry.js ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   positionElements: () => (/* reexport safe */ _positioning__WEBPACK_IMPORTED_MODULE_0__.positionElements)
/* harmony export */ });
/* harmony import */ var _positioning__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./positioning */ 77070);


/***/ }),

/***/ 77070:
/*!******************************************************!*\
  !*** ./node_modules/positioning/dist/positioning.js ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Positioning: () => (/* binding */ Positioning),
/* harmony export */   positionElements: () => (/* binding */ positionElements)
/* harmony export */ });
// previous version:
// https://github.com/angular-ui/bootstrap/blob/07c31d0731f7cb068a1932b8e01d2312b796b4ec/src/position/position.js
var Positioning = /** @class */function () {
  function Positioning() {}
  Positioning.prototype.getAllStyles = function (element) {
    return window.getComputedStyle(element);
  };
  Positioning.prototype.getStyle = function (element, prop) {
    return this.getAllStyles(element)[prop];
  };
  Positioning.prototype.isStaticPositioned = function (element) {
    return (this.getStyle(element, 'position') || 'static') === 'static';
  };
  Positioning.prototype.offsetParent = function (element) {
    var offsetParentEl = element.offsetParent || document.documentElement;
    while (offsetParentEl && offsetParentEl !== document.documentElement && this.isStaticPositioned(offsetParentEl)) {
      offsetParentEl = offsetParentEl.offsetParent;
    }
    return offsetParentEl || document.documentElement;
  };
  Positioning.prototype.position = function (element, round) {
    if (round === void 0) {
      round = true;
    }
    var elPosition;
    var parentOffset = {
      width: 0,
      height: 0,
      top: 0,
      bottom: 0,
      left: 0,
      right: 0
    };
    if (this.getStyle(element, 'position') === 'fixed') {
      elPosition = element.getBoundingClientRect();
      elPosition = {
        top: elPosition.top,
        bottom: elPosition.bottom,
        left: elPosition.left,
        right: elPosition.right,
        height: elPosition.height,
        width: elPosition.width
      };
    } else {
      var offsetParentEl = this.offsetParent(element);
      elPosition = this.offset(element, false);
      if (offsetParentEl !== document.documentElement) {
        parentOffset = this.offset(offsetParentEl, false);
      }
      parentOffset.top += offsetParentEl.clientTop;
      parentOffset.left += offsetParentEl.clientLeft;
    }
    elPosition.top -= parentOffset.top;
    elPosition.bottom -= parentOffset.top;
    elPosition.left -= parentOffset.left;
    elPosition.right -= parentOffset.left;
    if (round) {
      elPosition.top = Math.round(elPosition.top);
      elPosition.bottom = Math.round(elPosition.bottom);
      elPosition.left = Math.round(elPosition.left);
      elPosition.right = Math.round(elPosition.right);
    }
    return elPosition;
  };
  Positioning.prototype.offset = function (element, round) {
    if (round === void 0) {
      round = true;
    }
    var elBcr = element.getBoundingClientRect();
    var viewportOffset = {
      top: window.pageYOffset - document.documentElement.clientTop,
      left: window.pageXOffset - document.documentElement.clientLeft
    };
    var elOffset = {
      height: elBcr.height || element.offsetHeight,
      width: elBcr.width || element.offsetWidth,
      top: elBcr.top + viewportOffset.top,
      bottom: elBcr.bottom + viewportOffset.top,
      left: elBcr.left + viewportOffset.left,
      right: elBcr.right + viewportOffset.left
    };
    if (round) {
      elOffset.height = Math.round(elOffset.height);
      elOffset.width = Math.round(elOffset.width);
      elOffset.top = Math.round(elOffset.top);
      elOffset.bottom = Math.round(elOffset.bottom);
      elOffset.left = Math.round(elOffset.left);
      elOffset.right = Math.round(elOffset.right);
    }
    return elOffset;
  };
  /*
    Return false if the element to position is outside the viewport
  */
  Positioning.prototype.positionElements = function (hostElement, targetElement, placement, appendToBody) {
    var _a = placement.split('-'),
      _b = _a[0],
      placementPrimary = _b === void 0 ? 'top' : _b,
      _c = _a[1],
      placementSecondary = _c === void 0 ? 'center' : _c;
    var hostElPosition = appendToBody ? this.offset(hostElement, false) : this.position(hostElement, false);
    var targetElStyles = this.getAllStyles(targetElement);
    var marginTop = parseFloat(targetElStyles.marginTop);
    var marginBottom = parseFloat(targetElStyles.marginBottom);
    var marginLeft = parseFloat(targetElStyles.marginLeft);
    var marginRight = parseFloat(targetElStyles.marginRight);
    var topPosition = 0;
    var leftPosition = 0;
    switch (placementPrimary) {
      case 'top':
        topPosition = hostElPosition.top - (targetElement.offsetHeight + marginTop + marginBottom);
        break;
      case 'bottom':
        topPosition = hostElPosition.top + hostElPosition.height;
        break;
      case 'left':
        leftPosition = hostElPosition.left - (targetElement.offsetWidth + marginLeft + marginRight);
        break;
      case 'right':
        leftPosition = hostElPosition.left + hostElPosition.width;
        break;
    }
    switch (placementSecondary) {
      case 'top':
        topPosition = hostElPosition.top;
        break;
      case 'bottom':
        topPosition = hostElPosition.top + hostElPosition.height - targetElement.offsetHeight;
        break;
      case 'left':
        leftPosition = hostElPosition.left;
        break;
      case 'right':
        leftPosition = hostElPosition.left + hostElPosition.width - targetElement.offsetWidth;
        break;
      case 'center':
        if (placementPrimary === 'top' || placementPrimary === 'bottom') {
          leftPosition = hostElPosition.left + hostElPosition.width / 2 - targetElement.offsetWidth / 2;
        } else {
          topPosition = hostElPosition.top + hostElPosition.height / 2 - targetElement.offsetHeight / 2;
        }
        break;
    }
    /// The translate3d/gpu acceleration render a blurry text on chrome, the next line is commented until a browser fix
    // targetElement.style.transform = `translate3d(${Math.round(leftPosition)}px, ${Math.floor(topPosition)}px, 0px)`;
    targetElement.style.transform = "translate(" + Math.round(leftPosition) + "px, " + Math.round(topPosition) + "px)";
    // Check if the targetElement is inside the viewport
    var targetElBCR = targetElement.getBoundingClientRect();
    var html = document.documentElement;
    var windowHeight = window.innerHeight || html.clientHeight;
    var windowWidth = window.innerWidth || html.clientWidth;
    return targetElBCR.left >= 0 && targetElBCR.top >= 0 && targetElBCR.right <= windowWidth && targetElBCR.bottom <= windowHeight;
  };
  return Positioning;
}();

var placementSeparator = /\s+/;
var positionService = new Positioning();
/*
 * Accept the placement array and applies the appropriate placement dependent on the viewport.
 * Returns the applied placement.
 * In case of auto placement, placements are selected in order
 *   'top', 'bottom', 'left', 'right',
 *   'top-left', 'top-right',
 *   'bottom-left', 'bottom-right',
 *   'left-top', 'left-bottom',
 *   'right-top', 'right-bottom'.
 * */
function positionElements(hostElement, targetElement, placement, appendToBody, baseClass) {
  var placementVals = Array.isArray(placement) ? placement : placement.split(placementSeparator);
  var allowedPlacements = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right', 'left-top', 'left-bottom', 'right-top', 'right-bottom'];
  var classList = targetElement.classList;
  var addClassesToTarget = function (targetPlacement) {
    var _a = targetPlacement.split('-'),
      primary = _a[0],
      secondary = _a[1];
    var classes = [];
    if (baseClass) {
      classes.push(baseClass + "-" + primary);
      if (secondary) {
        classes.push(baseClass + "-" + primary + "-" + secondary);
      }
      classes.forEach(function (classname) {
        classList.add(classname);
      });
    }
    return classes;
  };
  // Remove old placement classes to avoid issues
  if (baseClass) {
    allowedPlacements.forEach(function (placementToRemove) {
      classList.remove(baseClass + "-" + placementToRemove);
    });
  }
  // replace auto placement with other placements
  var hasAuto = placementVals.findIndex(function (val) {
    return val === 'auto';
  });
  if (hasAuto >= 0) {
    allowedPlacements.forEach(function (obj) {
      if (placementVals.find(function (val) {
        return val.search('^' + obj) !== -1;
      }) == null) {
        placementVals.splice(hasAuto++, 1, obj);
      }
    });
  }
  // coordinates where to position
  // Required for transform:
  var style = targetElement.style;
  style.position = 'absolute';
  style.top = '0';
  style.left = '0';
  style['will-change'] = 'transform';
  var testPlacement;
  var isInViewport = false;
  for (var _i = 0, placementVals_1 = placementVals; _i < placementVals_1.length; _i++) {
    testPlacement = placementVals_1[_i];
    var addedClasses = addClassesToTarget(testPlacement);
    if (positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody)) {
      isInViewport = true;
      break;
    }
    // Remove the baseClasses for further calculation
    if (baseClass) {
      addedClasses.forEach(function (classname) {
        classList.remove(classname);
      });
    }
  }
  if (!isInViewport) {
    // If nothing match, the first placement is the default one
    testPlacement = placementVals[0];
    addClassesToTarget(testPlacement);
    positionService.positionElements(hostElement, targetElement, testPlacement, appendToBody);
  }
  return testPlacement;
}

/***/ }),

/***/ 19240:
/*!********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/observable/interval.js ***!
  \********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   interval: () => (/* binding */ interval)
/* harmony export */ });
/* harmony import */ var _scheduler_async__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../scheduler/async */ 18473);
/* harmony import */ var _timer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./timer */ 14876);


function interval(period = 0, scheduler = _scheduler_async__WEBPACK_IMPORTED_MODULE_0__.asyncScheduler) {
  if (period < 0) {
    period = 0;
  }
  return (0,_timer__WEBPACK_IMPORTED_MODULE_1__.timer)(period, period, scheduler);
}

/***/ }),

/***/ 25198:
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/operators/count.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   count: () => (/* binding */ count)
/* harmony export */ });
/* harmony import */ var _reduce__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./reduce */ 49923);

function count(predicate) {
  return (0,_reduce__WEBPACK_IMPORTED_MODULE_0__.reduce)((total, value, i) => !predicate || predicate(value, i) ? total + 1 : total, 0);
}

/***/ }),

/***/ 90090:
/*!**********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/operators/switchMapTo.js ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   switchMapTo: () => (/* binding */ switchMapTo)
/* harmony export */ });
/* harmony import */ var _switchMap__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./switchMap */ 36647);
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/isFunction */ 81530);


function switchMapTo(innerObservable, resultSelector) {
  return (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_0__.isFunction)(resultSelector) ? (0,_switchMap__WEBPACK_IMPORTED_MODULE_1__.switchMap)(() => innerObservable, resultSelector) : (0,_switchMap__WEBPACK_IMPORTED_MODULE_1__.switchMap)(() => innerObservable);
}

/***/ }),

/***/ 35519:
/*!*********************************************************************!*\
  !*** ./node_modules/angular-calendar/fesm2020/angular-calendar.mjs ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CalendarA11y: () => (/* binding */ CalendarA11y),
/* harmony export */   CalendarAngularDateFormatter: () => (/* binding */ CalendarAngularDateFormatter),
/* harmony export */   CalendarCommonModule: () => (/* binding */ CalendarCommonModule),
/* harmony export */   CalendarDateFormatter: () => (/* binding */ CalendarDateFormatter),
/* harmony export */   CalendarDayModule: () => (/* binding */ CalendarDayModule),
/* harmony export */   CalendarDayViewComponent: () => (/* binding */ CalendarDayViewComponent),
/* harmony export */   CalendarEventTimesChangedEventType: () => (/* binding */ CalendarEventTimesChangedEventType),
/* harmony export */   CalendarEventTitleFormatter: () => (/* binding */ CalendarEventTitleFormatter),
/* harmony export */   CalendarModule: () => (/* binding */ CalendarModule),
/* harmony export */   CalendarMomentDateFormatter: () => (/* binding */ CalendarMomentDateFormatter),
/* harmony export */   CalendarMonthModule: () => (/* binding */ CalendarMonthModule),
/* harmony export */   CalendarMonthViewComponent: () => (/* binding */ CalendarMonthViewComponent),
/* harmony export */   CalendarNativeDateFormatter: () => (/* binding */ CalendarNativeDateFormatter),
/* harmony export */   CalendarUtils: () => (/* binding */ CalendarUtils),
/* harmony export */   CalendarView: () => (/* binding */ CalendarView),
/* harmony export */   CalendarWeekModule: () => (/* binding */ CalendarWeekModule),
/* harmony export */   CalendarWeekViewComponent: () => (/* binding */ CalendarWeekViewComponent),
/* harmony export */   DAYS_OF_WEEK: () => (/* reexport safe */ calendar_utils__WEBPACK_IMPORTED_MODULE_1__.DAYS_OF_WEEK),
/* harmony export */   DateAdapter: () => (/* binding */ DateAdapter),
/* harmony export */   MOMENT: () => (/* binding */ MOMENT),
/* harmony export */   collapseAnimation: () => (/* binding */ collapseAnimation),
/* harmony export */   getWeekViewPeriod: () => (/* binding */ getWeekViewPeriod),
/* harmony export */   "ɵCalendarA11yPipe": () => (/* binding */ CalendarA11yPipe),
/* harmony export */   "ɵCalendarDatePipe": () => (/* binding */ CalendarDatePipe),
/* harmony export */   "ɵCalendarEventActionsComponent": () => (/* binding */ CalendarEventActionsComponent),
/* harmony export */   "ɵCalendarEventTitleComponent": () => (/* binding */ CalendarEventTitleComponent),
/* harmony export */   "ɵCalendarEventTitlePipe": () => (/* binding */ CalendarEventTitlePipe),
/* harmony export */   "ɵCalendarMonthCellComponent": () => (/* binding */ CalendarMonthCellComponent),
/* harmony export */   "ɵCalendarMonthViewHeaderComponent": () => (/* binding */ CalendarMonthViewHeaderComponent),
/* harmony export */   "ɵCalendarNextViewDirective": () => (/* binding */ CalendarNextViewDirective),
/* harmony export */   "ɵCalendarOpenDayEventsComponent": () => (/* binding */ CalendarOpenDayEventsComponent),
/* harmony export */   "ɵCalendarPreviousViewDirective": () => (/* binding */ CalendarPreviousViewDirective),
/* harmony export */   "ɵCalendarTodayDirective": () => (/* binding */ CalendarTodayDirective),
/* harmony export */   "ɵCalendarTooltipDirective": () => (/* binding */ CalendarTooltipDirective),
/* harmony export */   "ɵCalendarTooltipWindowComponent": () => (/* binding */ CalendarTooltipWindowComponent),
/* harmony export */   "ɵCalendarWeekViewCurrentTimeMarkerComponent": () => (/* binding */ CalendarWeekViewCurrentTimeMarkerComponent),
/* harmony export */   "ɵCalendarWeekViewEventComponent": () => (/* binding */ CalendarWeekViewEventComponent),
/* harmony export */   "ɵCalendarWeekViewHeaderComponent": () => (/* binding */ CalendarWeekViewHeaderComponent),
/* harmony export */   "ɵCalendarWeekViewHourSegmentComponent": () => (/* binding */ CalendarWeekViewHourSegmentComponent),
/* harmony export */   "ɵClickDirective": () => (/* binding */ ClickDirective),
/* harmony export */   "ɵKeydownEnterDirective": () => (/* binding */ KeydownEnterDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 43942);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs */ 59452);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 14876);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 19240);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 33900);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 36647);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 63037);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 90090);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var positioning__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! positioning */ 71227);
/* harmony import */ var calendar_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! calendar-utils */ 39333);
/* harmony import */ var angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! angular-draggable-droppable */ 99109);
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/animations */ 47172);
/* harmony import */ var angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! angular-resizable-element */ 59843);














const _c0 = function (a0) {
  return {
    action: a0
  };
};
function CalendarEventActionsComponent_ng_template_0_span_0_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "a", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarEventActionsComponent_ng_template_0_span_0_a_1_Template_a_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r10);
      const action_r7 = restoredCtx.$implicit;
      const event_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).event;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](action_r7.onClick({
        event: event_r3,
        sourceEvent: $event
      }));
    })("mwlKeydownEnter", function CalendarEventActionsComponent_ng_template_0_span_0_a_1_Template_a_mwlKeydownEnter_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r10);
      const action_r7 = restoredCtx.$implicit;
      const event_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).event;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](action_r7.onClick({
        event: event_r3,
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const action_r7 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", action_r7.cssClass)("innerHtml", action_r7.label, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](1, 3, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](6, _c0, action_r7), "actionButtonLabel"));
  }
}
function CalendarEventActionsComponent_ng_template_0_span_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarEventActionsComponent_ng_template_0_span_0_a_1_Template, 2, 8, "a", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const event_r3 = ctx_r13.event;
    const trackByActionId_r4 = ctx_r13.trackByActionId;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", event_r3.actions)("ngForTrackBy", trackByActionId_r4);
  }
}
function CalendarEventActionsComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarEventActionsComponent_ng_template_0_span_0_Template, 2, 2, "span", 2);
  }
  if (rf & 2) {
    const event_r3 = ctx.event;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", event_r3.actions);
  }
}
function CalendarEventActionsComponent_ng_template_2_Template(rf, ctx) {}
const _c1 = function (a0, a1) {
  return {
    event: a0,
    trackByActionId: a1
  };
};
const _c2 = function () {
  return {};
};
function CalendarEventTitleComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "span", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarEventTitle");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarA11y");
  }
  if (rf & 2) {
    const event_r3 = ctx.event;
    const view_r4 = ctx.view;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("innerHTML", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](1, 2, event_r3.title, view_r4, event_r3), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeHtml"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-hidden", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](2, 6, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](9, _c2), "hideEventTitle"));
  }
}
function CalendarEventTitleComponent_ng_template_2_Template(rf, ctx) {}
const _c3 = function (a0, a1) {
  return {
    event: a0,
    view: a1
  };
};
function CalendarTooltipWindowComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "div", 3)(2, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const contents_r3 = ctx.contents;
    const placement_r4 = ctx.placement;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", "cal-tooltip-" + placement_r4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("innerHtml", contents_r3, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsanitizeHtml"]);
  }
}
function CalendarTooltipWindowComponent_ng_template_2_Template(rf, ctx) {}
const _c4 = function (a0, a1, a2) {
  return {
    contents: a0,
    placement: a1,
    event: a2
  };
};
function CalendarMonthCellComponent_ng_template_0_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const day_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().day;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](day_r3.badgeTotal);
  }
}
const _c5 = function (a0) {
  return {
    backgroundColor: a0
  };
};
const _c6 = function (a0, a1) {
  return {
    event: a0,
    draggedFrom: a1
  };
};
const _c7 = function (a0, a1) {
  return {
    x: a0,
    y: a1
  };
};
const _c8 = function () {
  return {
    delay: 300,
    delta: 30
  };
};
function CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mouseenter", function CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template_div_mouseenter_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r21);
      const event_r19 = restoredCtx.$implicit;
      const highlightDay_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).highlightDay;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](highlightDay_r7.emit({
        event: event_r19
      }));
    })("mouseleave", function CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template_div_mouseleave_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r21);
      const event_r19 = restoredCtx.$implicit;
      const unhighlightDay_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).unhighlightDay;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](unhighlightDay_r8.emit({
        event: event_r19
      }));
    })("mwlClick", function CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template_div_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r21);
      const event_r19 = restoredCtx.$implicit;
      const eventClicked_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r9.emit({
        event: event_r19,
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarEventTitle");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const event_r19 = ctx.$implicit;
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    const tooltipPlacement_r6 = ctx_r27.tooltipPlacement;
    const tooltipTemplate_r10 = ctx_r27.tooltipTemplate;
    const tooltipAppendToBody_r11 = ctx_r27.tooltipAppendToBody;
    const tooltipDelay_r12 = ctx_r27.tooltipDelay;
    const day_r3 = ctx_r27.day;
    const validateDrag_r14 = ctx_r27.validateDrag;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-draggable", event_r19.draggable);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](22, _c5, event_r19.color == null ? null : event_r19.color.primary))("ngClass", event_r19 == null ? null : event_r19.cssClass)("mwlCalendarTooltip", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](1, 15, event_r19.title, "monthTooltip", event_r19))("tooltipPlacement", tooltipPlacement_r6)("tooltipEvent", event_r19)("tooltipTemplate", tooltipTemplate_r10)("tooltipAppendToBody", tooltipAppendToBody_r11)("tooltipDelay", tooltipDelay_r12)("dropData", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](24, _c6, event_r19, day_r3))("dragAxis", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](27, _c7, event_r19.draggable, event_r19.draggable))("validateDrag", validateDrag_r14)("touchStartLongPress", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](30, _c8));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-hidden", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](2, 19, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](31, _c2), "hideMonthCellEvents"));
  }
}
function CalendarMonthCellComponent_ng_template_0_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarMonthCellComponent_ng_template_0_div_7_div_1_Template, 3, 32, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const day_r3 = ctx_r28.day;
    const trackByEventId_r13 = ctx_r28.trackByEventId;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", day_r3.events)("ngForTrackBy", trackByEventId_r13);
  }
}
const _c9 = function (a0, a1) {
  return {
    day: a0,
    locale: a1
  };
};
function CalendarMonthCellComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "span", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, CalendarMonthCellComponent_ng_template_0_span_3_Template, 2, 1, "span", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](6, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, CalendarMonthCellComponent_ng_template_0_div_7_Template, 2, 2, "div", 6);
  }
  if (rf & 2) {
    const day_r3 = ctx.day;
    const locale_r5 = ctx.locale;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](1, 4, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](11, _c9, day_r3, locale_r5), "monthCell"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", day_r3.badgeTotal > 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](6, 7, day_r3.date, "monthViewDayNumber", locale_r5));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", day_r3.events.length > 0);
  }
}
function CalendarMonthCellComponent_ng_template_2_Template(rf, ctx) {}
const _c10 = function (a0, a1, a2, a3, a4, a5, a6, a7, a8, a9, a10, a11) {
  return {
    day: a0,
    openDay: a1,
    locale: a2,
    tooltipPlacement: a3,
    highlightDay: a4,
    unhighlightDay: a5,
    eventClicked: a6,
    tooltipTemplate: a7,
    tooltipAppendToBody: a8,
    tooltipDelay: a9,
    trackByEventId: a10,
    validateDrag: a11
  };
};
const _c11 = function (a0) {
  return {
    event: a0
  };
};
const _c12 = function (a0, a1) {
  return {
    event: a0,
    locale: a1
  };
};
function CalendarOpenDayEventsComponent_ng_template_0_div_0_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "mwl-calendar-event-title", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarOpenDayEventsComponent_ng_template_0_div_0_div_5_Template_mwl_calendar_event_title_mwlClick_3_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const event_r10 = restoredCtx.$implicit;
      const eventClicked_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r4.emit({
        event: event_r10,
        sourceEvent: $event
      }));
    })("mwlKeydownEnter", function CalendarOpenDayEventsComponent_ng_template_0_div_0_div_5_Template_mwl_calendar_event_title_mwlKeydownEnter_3_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const event_r10 = restoredCtx.$implicit;
      const eventClicked_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r4.emit({
        event: event_r10,
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](4, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](5, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](6, "mwl-calendar-event-actions", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const event_r10 = ctx.$implicit;
    const validateDrag_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2).validateDrag;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-draggable", event_r10.draggable);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", event_r10 == null ? null : event_r10.cssClass)("dropData", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](16, _c11, event_r10))("dragAxis", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](18, _c7, event_r10.draggable, event_r10.draggable))("validateDrag", validateDrag_r7)("touchStartLongPress", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](21, _c8));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](22, _c5, event_r10.color == null ? null : event_r10.color.primary));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("event", event_r10)("customTemplate", ctx_r9.eventTitleTemplate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](4, 13, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](24, _c12, event_r10, ctx_r9.locale), "eventDescription"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("event", event_r10)("customTemplate", ctx_r9.eventActionsTemplate);
  }
}
const _c13 = function (a0, a1) {
  return {
    date: a0,
    locale: a1
  };
};
function CalendarOpenDayEventsComponent_ng_template_0_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "span", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](4, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, CalendarOpenDayEventsComponent_ng_template_0_div_0_div_5_Template, 7, 27, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const events_r3 = ctx_r17.events;
    const trackByEventId_r6 = ctx_r17.trackByEventId;
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("@collapse", undefined);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](2, 5, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](11, _c13, ctx_r8.date, ctx_r8.locale), "openDayEventsAlert"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](4, 8, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](14, _c13, ctx_r8.date, ctx_r8.locale), "openDayEventsLandmark"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", events_r3)("ngForTrackBy", trackByEventId_r6);
  }
}
function CalendarOpenDayEventsComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarOpenDayEventsComponent_ng_template_0_div_0_Template, 6, 17, "div", 2);
  }
  if (rf & 2) {
    const isOpen_r5 = ctx.isOpen;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", isOpen_r5);
  }
}
function CalendarOpenDayEventsComponent_ng_template_2_Template(rf, ctx) {}
const _c14 = function (a0, a1, a2, a3, a4) {
  return {
    events: a0,
    eventClicked: a1,
    isOpen: a2,
    trackByEventId: a3,
    validateDrag: a4
  };
};
function CalendarMonthViewHeaderComponent_ng_template_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarMonthViewHeaderComponent_ng_template_0_div_1_Template_div_click_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r9);
      const day_r7 = restoredCtx.$implicit;
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r8.columnHeaderClicked.emit({
        isoDayNumber: day_r7.day,
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const day_r7 = ctx.$implicit;
    const locale_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().locale;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-past", day_r7.isPast)("cal-today", day_r7.isToday)("cal-future", day_r7.isFuture)("cal-weekend", day_r7.isWeekend);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", day_r7.cssClass);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](2, 10, day_r7.date, "monthViewColumnHeader", locale_r4), " ");
  }
}
function CalendarMonthViewHeaderComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarMonthViewHeaderComponent_ng_template_0_div_1_Template, 3, 14, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const days_r3 = ctx.days;
    const trackByWeekDayHeaderDate_r5 = ctx.trackByWeekDayHeaderDate;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", days_r3)("ngForTrackBy", trackByWeekDayHeaderDate_r5);
  }
}
function CalendarMonthViewHeaderComponent_ng_template_2_Template(rf, ctx) {}
const _c15 = function (a0, a1, a2) {
  return {
    days: a0,
    locale: a1,
    trackByWeekDayHeaderDate: a2
  };
};
function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-month-cell", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const day_r3 = restoredCtx.$implicit;
      const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r4.dayClicked.emit({
        day: day_r3,
        sourceEvent: $event
      }));
    })("mwlKeydownEnter", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_mwlKeydownEnter_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const day_r3 = restoredCtx.$implicit;
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r6.dayClicked.emit({
        day: day_r3,
        sourceEvent: $event
      }));
    })("highlightDay", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_highlightDay_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r7.toggleDayHighlight($event.event, true));
    })("unhighlightDay", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_unhighlightDay_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r8.toggleDayHighlight($event.event, false));
    })("drop", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_drop_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const day_r3 = restoredCtx.$implicit;
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r9.eventDropped(day_r3, $event.dropData.event, $event.dropData.draggedFrom));
    })("eventClicked", function CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template_mwl_calendar_month_cell_eventClicked_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r5);
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r10.eventClicked.emit({
        event: $event.event,
        sourceEvent: $event.sourceEvent
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const day_r3 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", day_r3 == null ? null : day_r3.cssClass)("day", day_r3)("openDay", ctx_r2.openDay)("locale", ctx_r2.locale)("tooltipPlacement", ctx_r2.tooltipPlacement)("tooltipAppendToBody", ctx_r2.tooltipAppendToBody)("tooltipTemplate", ctx_r2.tooltipTemplate)("tooltipDelay", ctx_r2.tooltipDelay)("customTemplate", ctx_r2.cellTemplate)("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](15, _c5, day_r3.backgroundColor))("clickListenerDisabled", ctx_r2.dayClicked.observers.length === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("tabindex", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](1, 12, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](17, _c2), "monthCellTabIndex"));
  }
}
function CalendarMonthViewComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div")(1, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarMonthViewComponent_div_3_mwl_calendar_month_cell_2_Template, 2, 18, "mwl-calendar-month-cell", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "slice");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "mwl-calendar-open-day-events", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarMonthViewComponent_div_3_Template_mwl_calendar_open_day_events_eventClicked_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r11.eventClicked.emit({
        event: $event.event,
        sourceEvent: $event.sourceEvent
      }));
    })("drop", function CalendarMonthViewComponent_div_3_Template_mwl_calendar_open_day_events_drop_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r13.eventDropped(ctx_r13.openDay, $event.dropData.event, $event.dropData.draggedFrom));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const rowIndex_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](3, 9, ctx_r0.view.days, rowIndex_r1, rowIndex_r1 + ctx_r0.view.totalDaysVisibleInWeek))("ngForTrackBy", ctx_r0.trackByDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("locale", ctx_r0.locale)("isOpen", ctx_r0.openRowIndex === rowIndex_r1)("events", ctx_r0.openDay == null ? null : ctx_r0.openDay.events)("date", ctx_r0.openDay == null ? null : ctx_r0.openDay.date)("customTemplate", ctx_r0.openDayEventsTemplate)("eventTitleTemplate", ctx_r0.eventTitleTemplate)("eventActionsTemplate", ctx_r0.eventActionsTemplate);
  }
}
function CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template_div_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const day_r10 = restoredCtx.$implicit;
      const dayHeaderClicked_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().dayHeaderClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](dayHeaderClicked_r5.emit({
        day: day_r10,
        sourceEvent: $event
      }));
    })("drop", function CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template_div_drop_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const day_r10 = restoredCtx.$implicit;
      const eventDropped_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().eventDropped;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventDropped_r6.emit({
        event: $event.dropData.event,
        newStart: day_r10.date
      }));
    })("dragEnter", function CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template_div_dragEnter_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r12);
      const day_r10 = restoredCtx.$implicit;
      const dragEnter_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().dragEnter;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](dragEnter_r8.emit({
        date: day_r10.date
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](1, "b");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](4, "br");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](7, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const day_r10 = ctx.$implicit;
    const locale_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().locale;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-past", day_r10.isPast)("cal-today", day_r10.isToday)("cal-future", day_r10.isFuture)("cal-weekend", day_r10.isWeekend);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", day_r10.cssClass);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](3, 11, day_r10.date, "weekViewColumnHeader", locale_r4));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](7, 15, day_r10.date, "weekViewColumnSubHeader", locale_r4));
  }
}
function CalendarWeekViewHeaderComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarWeekViewHeaderComponent_ng_template_0_div_1_Template, 8, 19, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const days_r3 = ctx.days;
    const trackByWeekDayHeaderDate_r7 = ctx.trackByWeekDayHeaderDate;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", days_r3)("ngForTrackBy", trackByWeekDayHeaderDate_r7);
  }
}
function CalendarWeekViewHeaderComponent_ng_template_2_Template(rf, ctx) {}
const _c16 = function (a0, a1, a2, a3, a4, a5) {
  return {
    days: a0,
    locale: a1,
    dayHeaderClicked: a2,
    eventDropped: a3,
    dragEnter: a4,
    trackByWeekDayHeaderDate: a5
  };
};
const _c17 = function (a0, a1, a2) {
  return {
    color: a0,
    backgroundColor: a1,
    borderColor: a2
  };
};
function CalendarWeekViewEventComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarWeekViewEventComponent_ng_template_0_Template_div_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r13);
      const eventClicked_r5 = restoredCtx.eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r5.emit({
        sourceEvent: $event
      }));
    })("mwlKeydownEnter", function CalendarWeekViewEventComponent_ng_template_0_Template_div_mwlKeydownEnter_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r13);
      const eventClicked_r5 = restoredCtx.eventClicked;
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](eventClicked_r5.emit({
        sourceEvent: $event
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarEventTitle");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "mwl-calendar-event-actions", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](4, " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "mwl-calendar-event-title", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const weekEvent_r3 = ctx.weekEvent;
    const tooltipPlacement_r4 = ctx.tooltipPlacement;
    const tooltipTemplate_r6 = ctx.tooltipTemplate;
    const tooltipAppendToBody_r7 = ctx.tooltipAppendToBody;
    const tooltipDisabled_r8 = ctx.tooltipDisabled;
    const tooltipDelay_r9 = ctx.tooltipDelay;
    const daysInWeek_r11 = ctx.daysInWeek;
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngStyle", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction3"](20, _c17, weekEvent_r3.event.color == null ? null : weekEvent_r3.event.color.secondaryText, weekEvent_r3.event.color == null ? null : weekEvent_r3.event.color.secondary, weekEvent_r3.event.color == null ? null : weekEvent_r3.event.color.primary))("mwlCalendarTooltip", !tooltipDisabled_r8 ? _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](1, 13, weekEvent_r3.event.title, daysInWeek_r11 === 1 ? "dayTooltip" : "weekTooltip", weekEvent_r3.tempEvent || weekEvent_r3.event) : "")("tooltipPlacement", tooltipPlacement_r4)("tooltipEvent", weekEvent_r3.tempEvent || weekEvent_r3.event)("tooltipTemplate", tooltipTemplate_r6)("tooltipAppendToBody", tooltipAppendToBody_r7)("tooltipDelay", tooltipDelay_r9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](2, 17, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](24, _c12, weekEvent_r3.tempEvent || weekEvent_r3.event, ctx_r1.locale), "eventDescription"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("event", weekEvent_r3.tempEvent || weekEvent_r3.event)("customTemplate", ctx_r1.eventActionsTemplate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("event", weekEvent_r3.tempEvent || weekEvent_r3.event)("customTemplate", ctx_r1.eventTitleTemplate)("view", daysInWeek_r11 === 1 ? "day" : "week");
  }
}
function CalendarWeekViewEventComponent_ng_template_2_Template(rf, ctx) {}
const _c18 = function (a0, a1, a2, a3, a4, a5, a6, a7, a8) {
  return {
    weekEvent: a0,
    tooltipPlacement: a1,
    eventClicked: a2,
    tooltipTemplate: a3,
    tooltipAppendToBody: a4,
    tooltipDisabled: a5,
    tooltipDelay: a6,
    column: a7,
    daysInWeek: a8
  };
};
function CalendarWeekViewHourSegmentComponent_ng_template_0_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "calendarDate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    const segment_r3 = ctx_r9.segment;
    const daysInWeek_r7 = ctx_r9.daysInWeek;
    const locale_r4 = ctx_r9.locale;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind3"](2, 1, segment_r3.displayDate, daysInWeek_r7 === 1 ? "dayViewHour" : "weekViewHour", locale_r4), " ");
  }
}
function CalendarWeekViewHourSegmentComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "calendarA11y");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewHourSegmentComponent_ng_template_0_div_2_Template, 3, 5, "div", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const segment_r3 = ctx.segment;
    const segmentHeight_r5 = ctx.segmentHeight;
    const isTimeLabel_r6 = ctx.isTimeLabel;
    const daysInWeek_r7 = ctx.daysInWeek;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("height", segmentHeight_r5, "px");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-hour-start", segment_r3.isStart)("cal-after-hour-start", !segment_r3.isStart);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", segment_r3.cssClass);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵattribute"]("aria-hidden", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind2"](1, 9, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](12, _c2), daysInWeek_r7 === 1 ? "hideDayHourSegment" : "hideWeekHourSegment"));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", isTimeLabel_r6);
  }
}
function CalendarWeekViewHourSegmentComponent_ng_template_2_Template(rf, ctx) {}
const _c19 = function (a0, a1, a2, a3, a4) {
  return {
    segment: a0,
    locale: a1,
    segmentHeight: a2,
    isTimeLabel: a3,
    daysInWeek: a4
  };
};
function CalendarWeekViewCurrentTimeMarkerComponent_ng_template_0_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 3);
  }
  if (rf & 2) {
    const topPx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().topPx;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("top", topPx_r9, "px");
  }
}
function CalendarWeekViewCurrentTimeMarkerComponent_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewCurrentTimeMarkerComponent_ng_template_0_div_0_Template, 1, 2, "div", 2);
  }
  if (rf & 2) {
    const isVisible_r8 = ctx.isVisible;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", isVisible_r8);
  }
}
function CalendarWeekViewCurrentTimeMarkerComponent_ng_template_2_Template(rf, ctx) {}
const _c20 = function (a0, a1, a2, a3, a4, a5, a6) {
  return {
    columnDate: a0,
    dayStartHour: a1,
    dayStartMinute: a2,
    dayEndHour: a3,
    dayEndMinute: a4,
    isVisible: a5,
    topPx: a6
  };
};
function CalendarWeekViewComponent_div_2_ng_container_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementContainer"](0);
  }
}
function CalendarWeekViewComponent_div_2_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("drop", function CalendarWeekViewComponent_div_2_div_5_Template_div_drop_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r10);
      const day_r8 = restoredCtx.$implicit;
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r9.eventDropped($event, day_r8.date, true));
    })("dragEnter", function CalendarWeekViewComponent_div_2_div_5_Template_div_dragEnter_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r10);
      const day_r8 = restoredCtx.$implicit;
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r11.dateDragEnter(day_r8.date));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
const _c21 = function () {
  return {
    left: true
  };
};
function CalendarWeekViewComponent_div_2_div_6_div_2_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 23);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("resizeEdges", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c21));
  }
}
const _c22 = function () {
  return {
    right: true
  };
};
function CalendarWeekViewComponent_div_2_div_6_div_2_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 24);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("resizeEdges", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c22));
  }
}
const _c23 = function (a0, a1) {
  return {
    left: a0,
    right: a1
  };
};
const _c24 = function (a0, a1) {
  return {
    event: a0,
    calendarId: a1
  };
};
const _c25 = function (a0) {
  return {
    x: a0
  };
};
function CalendarWeekViewComponent_div_2_div_6_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 18, 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("resizeStart", function CalendarWeekViewComponent_div_2_div_6_div_2_Template_div_resizeStart_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const allDayEvent_r15 = restoredCtx.$implicit;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r19.allDayEventResizeStarted(_r13, allDayEvent_r15, $event));
    })("resizing", function CalendarWeekViewComponent_div_2_div_6_div_2_Template_div_resizing_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const allDayEvent_r15 = restoredCtx.$implicit;
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r21.allDayEventResizing(allDayEvent_r15, $event, ctx_r21.dayColumnWidth));
    })("resizeEnd", function CalendarWeekViewComponent_div_2_div_6_div_2_Template_div_resizeEnd_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const allDayEvent_r15 = restoredCtx.$implicit;
      const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r22.allDayEventResizeEnded(allDayEvent_r15));
    })("dragStart", function CalendarWeekViewComponent_div_2_div_6_div_2_Template_div_dragStart_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const allDayEvent_r15 = restoredCtx.$implicit;
      const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r23.dragStarted(_r13, _r16, allDayEvent_r15, false));
    })("dragging", function CalendarWeekViewComponent_div_2_div_6_div_2_Template_div_dragging_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r24.allDayEventDragMove());
    })("dragEnd", function CalendarWeekViewComponent_div_2_div_6_div_2_Template_div_dragEnd_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const allDayEvent_r15 = restoredCtx.$implicit;
      const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r25.dragEnded(allDayEvent_r15, $event, ctx_r25.dayColumnWidth));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewComponent_div_2_div_6_div_2_div_2_Template, 1, 2, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "mwl-calendar-week-view-event", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarWeekViewComponent_div_2_div_6_div_2_Template_mwl_calendar_week_view_event_eventClicked_3_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r20);
      const allDayEvent_r15 = restoredCtx.$implicit;
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r26.eventClicked.emit({
        event: allDayEvent_r15.event,
        sourceEvent: $event.sourceEvent
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CalendarWeekViewComponent_div_2_div_6_div_2_div_4_Template, 1, 2, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const allDayEvent_r15 = ctx.$implicit;
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("width", 100 / ctx_r14.days.length * allDayEvent_r15.span, "%")("margin-left", ctx_r14.rtl ? null : 100 / ctx_r14.days.length * allDayEvent_r15.offset, "%")("margin-right", ctx_r14.rtl ? 100 / ctx_r14.days.length * allDayEvent_r15.offset : null, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-draggable", allDayEvent_r15.event.draggable && ctx_r14.allDayEventResizes.size === 0)("cal-starts-within-week", !allDayEvent_r15.startsBeforeWeek)("cal-ends-within-week", !allDayEvent_r15.endsAfterWeek);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", allDayEvent_r15.event == null ? null : allDayEvent_r15.event.cssClass)("resizeCursors", ctx_r14.resizeCursors)("resizeSnapGrid", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](33, _c23, ctx_r14.dayColumnWidth, ctx_r14.dayColumnWidth))("validateResize", ctx_r14.validateResize)("dropData", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](36, _c24, allDayEvent_r15.event, ctx_r14.calendarId))("dragAxis", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](39, _c7, allDayEvent_r15.event.draggable && ctx_r14.allDayEventResizes.size === 0, !ctx_r14.snapDraggedEvents && allDayEvent_r15.event.draggable && ctx_r14.allDayEventResizes.size === 0))("dragSnapGrid", ctx_r14.snapDraggedEvents ? _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction1"](42, _c25, ctx_r14.dayColumnWidth) : _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](44, _c2))("validateDrag", ctx_r14.validateDrag)("touchStartLongPress", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](45, _c8));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (allDayEvent_r15.event == null ? null : allDayEvent_r15.event.resizable == null ? null : allDayEvent_r15.event.resizable.beforeStart) && !allDayEvent_r15.startsBeforeWeek);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("locale", ctx_r14.locale)("weekEvent", allDayEvent_r15)("tooltipPlacement", ctx_r14.tooltipPlacement)("tooltipTemplate", ctx_r14.tooltipTemplate)("tooltipAppendToBody", ctx_r14.tooltipAppendToBody)("tooltipDelay", ctx_r14.tooltipDelay)("customTemplate", ctx_r14.eventTemplate)("eventTitleTemplate", ctx_r14.eventTitleTemplate)("eventActionsTemplate", ctx_r14.eventActionsTemplate)("daysInWeek", ctx_r14.daysInWeek);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (allDayEvent_r15.event == null ? null : allDayEvent_r15.event.resizable == null ? null : allDayEvent_r15.event.resizable.afterEnd) && !allDayEvent_r15.endsAfterWeek);
  }
}
function CalendarWeekViewComponent_div_2_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 15, 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewComponent_div_2_div_6_div_2_Template, 5, 46, "div", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const eventRow_r12 = ctx.$implicit;
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", eventRow_r12.row)("ngForTrackBy", ctx_r7.trackByWeekAllDayEvent);
  }
}
function CalendarWeekViewComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 8, 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("dragEnter", function CalendarWeekViewComponent_div_2_Template_div_dragEnter_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r28);
      const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r27.dragEnter("allDay"));
    })("dragLeave", function CalendarWeekViewComponent_div_2_Template_div_dragLeave_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r28);
      const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r29.dragLeave("allDay"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 5)(3, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CalendarWeekViewComponent_div_2_ng_container_4_Template, 1, 0, "ng-container", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](5, CalendarWeekViewComponent_div_2_div_5_Template, 1, 0, "div", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, CalendarWeekViewComponent_div_2_div_6_Template, 3, 2, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx_r0.allDayEventsLabelTemplate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r0.days)("ngForTrackBy", ctx_r0.trackByWeekDayHeaderDate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r0.view.allDayEventRows)("ngForTrackBy", ctx_r0.trackById);
  }
}
function CalendarWeekViewComponent_div_4_div_1_mwl_calendar_week_view_hour_segment_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "mwl-calendar-week-view-hour-segment", 28);
  }
  if (rf & 2) {
    const segment_r34 = ctx.$implicit;
    const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("height", ctx_r33.hourSegmentHeight, "px");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("segment", segment_r34)("segmentHeight", ctx_r33.hourSegmentHeight)("locale", ctx_r33.locale)("customTemplate", ctx_r33.hourSegmentTemplate)("isTimeLabel", true)("daysInWeek", ctx_r33.daysInWeek);
  }
}
function CalendarWeekViewComponent_div_4_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarWeekViewComponent_div_4_div_1_mwl_calendar_week_view_hour_segment_1_Template, 1, 8, "mwl-calendar-week-view-hour-segment", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const hour_r31 = ctx.$implicit;
    const odd_r32 = ctx.odd;
    const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-hour-odd", odd_r32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", hour_r31.segments)("ngForTrackBy", ctx_r30.trackByHourSegment);
  }
}
function CalendarWeekViewComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarWeekViewComponent_div_4_div_1_Template, 2, 4, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx_r1.view.hourColumns[0].hours)("ngForTrackBy", ctx_r1.trackByHour);
  }
}
const _c26 = function () {
  return {
    left: true,
    top: true
  };
};
function CalendarWeekViewComponent_div_7_div_3_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 23);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("resizeEdges", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c26));
  }
}
function CalendarWeekViewComponent_div_7_div_3_ng_template_3_Template(rf, ctx) {}
function CalendarWeekViewComponent_div_7_div_3_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r47 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-week-view-event", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarWeekViewComponent_div_7_div_3_ng_template_4_Template_mwl_calendar_week_view_event_eventClicked_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r47);
      const timeEvent_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
      const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r45.eventClicked.emit({
        event: timeEvent_r38.event,
        sourceEvent: $event.sourceEvent
      }));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const timeEvent_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const column_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]().$implicit;
    const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("locale", ctx_r43.locale)("weekEvent", timeEvent_r38)("tooltipPlacement", ctx_r43.tooltipPlacement)("tooltipTemplate", ctx_r43.tooltipTemplate)("tooltipAppendToBody", ctx_r43.tooltipAppendToBody)("tooltipDisabled", ctx_r43.dragActive || ctx_r43.timeEventResizes.size > 0)("tooltipDelay", ctx_r43.tooltipDelay)("customTemplate", ctx_r43.eventTemplate)("eventTitleTemplate", ctx_r43.eventTitleTemplate)("eventActionsTemplate", ctx_r43.eventActionsTemplate)("column", column_r35)("daysInWeek", ctx_r43.daysInWeek);
  }
}
const _c27 = function () {
  return {
    right: true,
    bottom: true
  };
};
function CalendarWeekViewComponent_div_7_div_3_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "div", 24);
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("resizeEdges", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](1, _c27));
  }
}
const _c28 = function (a0, a1, a2, a3) {
  return {
    left: a0,
    right: a1,
    top: a2,
    bottom: a3
  };
};
function CalendarWeekViewComponent_div_7_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r51 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 33, 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("resizeStart", function CalendarWeekViewComponent_div_7_div_3_Template_div_resizeStart_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r51);
      const timeEvent_r38 = restoredCtx.$implicit;
      const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](6);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r50.timeEventResizeStarted(_r2, timeEvent_r38, $event));
    })("resizing", function CalendarWeekViewComponent_div_7_div_3_Template_div_resizing_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r51);
      const timeEvent_r38 = restoredCtx.$implicit;
      const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r52.timeEventResizing(timeEvent_r38, $event));
    })("resizeEnd", function CalendarWeekViewComponent_div_7_div_3_Template_div_resizeEnd_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r51);
      const timeEvent_r38 = restoredCtx.$implicit;
      const ctx_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r53.timeEventResizeEnded(timeEvent_r38));
    })("dragStart", function CalendarWeekViewComponent_div_7_div_3_Template_div_dragStart_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r51);
      const timeEvent_r38 = restoredCtx.$implicit;
      const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](6);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r54.dragStarted(_r2, _r39, timeEvent_r38, true));
    })("dragging", function CalendarWeekViewComponent_div_7_div_3_Template_div_dragging_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r51);
      const timeEvent_r38 = restoredCtx.$implicit;
      const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r55.dragMove(timeEvent_r38, $event));
    })("dragEnd", function CalendarWeekViewComponent_div_7_div_3_Template_div_dragEnd_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r51);
      const timeEvent_r38 = restoredCtx.$implicit;
      const ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r56.dragEnded(timeEvent_r38, $event, ctx_r56.dayColumnWidth, true));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewComponent_div_7_div_3_div_2_Template, 1, 2, "div", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, CalendarWeekViewComponent_div_7_div_3_ng_template_3_Template, 0, 0, "ng-template", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CalendarWeekViewComponent_div_7_div_3_ng_template_4_Template, 1, 12, "ng-template", null, 35, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](6, CalendarWeekViewComponent_div_7_div_3_div_6_Template, 1, 2, "div", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const timeEvent_r38 = ctx.$implicit;
    const _r42 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](5);
    const ctx_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("top", timeEvent_r38.top, "px")("height", timeEvent_r38.height, "px")("left", timeEvent_r38.left, "%")("width", timeEvent_r38.width, "%");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-draggable", timeEvent_r38.event.draggable && ctx_r36.timeEventResizes.size === 0)("cal-starts-within-day", !timeEvent_r38.startsBeforeDay)("cal-ends-within-day", !timeEvent_r38.endsAfterDay);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", timeEvent_r38.event.cssClass)("hidden", timeEvent_r38.height === 0 && timeEvent_r38.width === 0)("resizeCursors", ctx_r36.resizeCursors)("resizeSnapGrid", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction4"](30, _c28, ctx_r36.dayColumnWidth, ctx_r36.dayColumnWidth, ctx_r36.eventSnapSize || ctx_r36.hourSegmentHeight, ctx_r36.eventSnapSize || ctx_r36.hourSegmentHeight))("validateResize", ctx_r36.validateResize)("allowNegativeResizes", true)("dropData", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](35, _c24, timeEvent_r38.event, ctx_r36.calendarId))("dragAxis", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](38, _c7, timeEvent_r38.event.draggable && ctx_r36.timeEventResizes.size === 0, timeEvent_r38.event.draggable && ctx_r36.timeEventResizes.size === 0))("dragSnapGrid", ctx_r36.snapDraggedEvents ? _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](41, _c7, ctx_r36.dayColumnWidth, ctx_r36.eventSnapSize || ctx_r36.hourSegmentHeight) : _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](44, _c2))("touchStartLongPress", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction0"](45, _c8))("ghostDragEnabled", !ctx_r36.snapDraggedEvents)("ghostElementTemplate", _r42)("validateDrag", ctx_r36.validateDrag);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (timeEvent_r38.event == null ? null : timeEvent_r38.event.resizable == null ? null : timeEvent_r38.event.resizable.beforeStart) && !timeEvent_r38.startsBeforeDay);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", _r42);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (timeEvent_r38.event == null ? null : timeEvent_r38.event.resizable == null ? null : timeEvent_r38.event.resizable.afterEnd) && !timeEvent_r38.endsAfterDay);
  }
}
function CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r62 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-week-view-hour-segment", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mwlClick", function CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template_mwl_calendar_week_view_hour_segment_mwlClick_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r62);
      const segment_r60 = restoredCtx.$implicit;
      const ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r61.hourSegmentClicked.emit({
        date: segment_r60.date,
        sourceEvent: $event
      }));
    })("drop", function CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template_mwl_calendar_week_view_hour_segment_drop_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r62);
      const segment_r60 = restoredCtx.$implicit;
      const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r63.eventDropped($event, segment_r60.date, false));
    })("dragEnter", function CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template_mwl_calendar_week_view_hour_segment_dragEnter_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r62);
      const segment_r60 = restoredCtx.$implicit;
      const ctx_r64 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r64.dateDragEnter(segment_r60.date));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const segment_r60 = ctx.$implicit;
    const ctx_r59 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵstyleProp"]("height", ctx_r59.hourSegmentHeight, "px");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("segment", segment_r60)("segmentHeight", ctx_r59.hourSegmentHeight)("locale", ctx_r59.locale)("customTemplate", ctx_r59.hourSegmentTemplate)("daysInWeek", ctx_r59.daysInWeek)("clickListenerDisabled", ctx_r59.hourSegmentClicked.observers.length === 0)("dragOverClass", !ctx_r59.dragActive || !ctx_r59.snapDraggedEvents ? "cal-drag-over" : null)("isTimeLabel", ctx_r59.daysInWeek === 1);
  }
}
function CalendarWeekViewComponent_div_7_div_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](1, CalendarWeekViewComponent_div_7_div_4_mwl_calendar_week_view_hour_segment_1_Template, 1, 10, "mwl-calendar-week-view-hour-segment", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const hour_r57 = ctx.$implicit;
    const odd_r58 = ctx.odd;
    const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-hour-odd", odd_r58);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", hour_r57.segments)("ngForTrackBy", ctx_r37.trackByHourSegment);
  }
}
function CalendarWeekViewComponent_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "mwl-calendar-week-view-current-time-marker", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, CalendarWeekViewComponent_div_7_div_3_Template, 7, 46, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CalendarWeekViewComponent_div_7_div_4_Template, 2, 4, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const column_r35 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("columnDate", column_r35.date)("dayStartHour", ctx_r3.dayStartHour)("dayStartMinute", ctx_r3.dayStartMinute)("dayEndHour", ctx_r3.dayEndHour)("dayEndMinute", ctx_r3.dayEndMinute)("hourSegments", ctx_r3.hourSegments)("hourDuration", ctx_r3.hourDuration)("hourSegmentHeight", ctx_r3.hourSegmentHeight)("customTemplate", ctx_r3.currentTimeMarkerTemplate);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", column_r35.events)("ngForTrackBy", ctx_r3.trackByWeekTimeEvent);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", column_r35.hours)("ngForTrackBy", ctx_r3.trackByHour);
  }
}
class ClickDirective {
  constructor(renderer, elm, document) {
    this.renderer = renderer;
    this.elm = elm;
    this.document = document;
    this.clickListenerDisabled = false;
    this.click = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter(); // eslint-disable-line
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
  }
  ngOnInit() {
    if (!this.clickListenerDisabled) {
      this.listen().pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.destroy$)).subscribe(event => {
        event.stopPropagation();
        this.click.emit(event);
      });
    }
  }
  ngOnDestroy() {
    this.destroy$.next();
  }
  listen() {
    return new rxjs__WEBPACK_IMPORTED_MODULE_5__.Observable(observer => {
      return this.renderer.listen(this.elm.nativeElement, 'click', event => {
        observer.next(event);
      });
    });
  }
}
ClickDirective.ɵfac = function ClickDirective_Factory(t) {
  return new (t || ClickDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_6__.DOCUMENT));
};
ClickDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: ClickDirective,
  selectors: [["", "mwlClick", ""]],
  inputs: {
    clickListenerDisabled: "clickListenerDisabled"
  },
  outputs: {
    click: "mwlClick"
  }
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](ClickDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlClick]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.DOCUMENT]
      }]
    }];
  }, {
    clickListenerDisabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    click: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output,
      args: ['mwlClick']
    }]
  });
})();
class KeydownEnterDirective {
  constructor(host, ngZone, renderer) {
    this.host = host;
    this.ngZone = ngZone;
    this.renderer = renderer;
    this.keydown = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter(); // eslint-disable-line
    this.keydownListener = null;
  }
  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      this.keydownListener = this.renderer.listen(this.host.nativeElement, 'keydown', event => {
        if (event.keyCode === 13 || event.which === 13 || event.key === 'Enter') {
          event.preventDefault();
          event.stopPropagation();
          this.ngZone.run(() => {
            this.keydown.emit(event);
          });
        }
      });
    });
  }
  ngOnDestroy() {
    if (this.keydownListener !== null) {
      this.keydownListener();
      this.keydownListener = null;
    }
  }
}
KeydownEnterDirective.ɵfac = function KeydownEnterDirective_Factory(t) {
  return new (t || KeydownEnterDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2));
};
KeydownEnterDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: KeydownEnterDirective,
  selectors: [["", "mwlKeydownEnter", ""]],
  outputs: {
    keydown: "mwlKeydownEnter"
  }
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](KeydownEnterDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlKeydownEnter]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }];
  }, {
    keydown: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output,
      args: ['mwlKeydownEnter']
    }]
  });
})();

/**
 * This class is responsible for adding accessibility to the calendar.
 * You may override any of its methods via angulars DI to suit your requirements.
 * For example:
 *
 * ```typescript
 * import { A11yParams, CalendarA11y } from 'angular-calendar';
 * import { formatDate, I18nPluralPipe } from '@angular/common';
 * import { Injectable } from '@angular/core';
 *
 * // adding your own a11y params
 * export interface CustomA11yParams extends A11yParams {
 *   isDrSuess?: boolean;
 * }
 *
 * @Injectable()
 * export class CustomCalendarA11y extends CalendarA11y {
 *   constructor(protected i18nPlural: I18nPluralPipe) {
 *     super(i18nPlural);
 *   }
 *
 *   // overriding a function
 *   public openDayEventsLandmark({ date, locale, isDrSuess }: CustomA11yParams): string {
 *     if (isDrSuess) {
 *       return `
 *         ${formatDate(date, 'EEEE MMMM d', locale)}
 *          Today you are you! That is truer than true! There is no one alive
 *          who is you-er than you!
 *       `;
 *     }
 *   }
 * }
 *
 * // in your component that uses the calendar
 * providers: [{
 *  provide: CalendarA11y,
 *  useClass: CustomCalendarA11y
 * }]
 * ```
 */
class CalendarA11y {
  constructor(i18nPlural) {
    this.i18nPlural = i18nPlural;
  }
  /**
   * Aria label for the badges/date of a cell
   * @example: `Saturday October 19 1 event click to expand`
   */
  monthCell({
    day,
    locale
  }) {
    if (day.badgeTotal > 0) {
      return `
        ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(day.date, 'EEEE MMMM d', locale)},
        ${this.i18nPlural.transform(day.badgeTotal, {
        '=0': 'No events',
        '=1': 'One event',
        other: '# events'
      })},
         click to expand
      `;
    } else {
      return `${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(day.date, 'EEEE MMMM d', locale)}`;
    }
  }
  /**
   * Aria label for the open day events start landmark
   * @example: `Saturday October 19 expanded view`
   */
  openDayEventsLandmark({
    date,
    locale
  }) {
    return `
      Beginning of expanded view for ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE MMMM dd', locale)}
    `;
  }
  /**
   * Aria label for alert that a day in the month view was expanded
   * @example: `Saturday October 19 expanded`
   */
  openDayEventsAlert({
    date,
    locale
  }) {
    return `${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE MMMM dd', locale)} expanded`;
  }
  /**
   * Descriptive aria label for an event
   * @example: `Saturday October 19th, Scott's Pizza Party, from 11:00am to 5:00pm`
   */
  eventDescription({
    event,
    locale
  }) {
    if (event.allDay === true) {
      return this.allDayEventDescription({
        event,
        locale
      });
    }
    const aria = `
      ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.start, 'EEEE MMMM dd', locale)},
      ${event.title}, from ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.start, 'hh:mm a', locale)}
    `;
    if (event.end) {
      return aria + ` to ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.end, 'hh:mm a', locale)}`;
    }
    return aria;
  }
  /**
   * Descriptive aria label for an all day event
   * @example:
   * `Scott's Party, event spans multiple days: start time October 19 5:00pm, no stop time`
   */
  allDayEventDescription({
    event,
    locale
  }) {
    const aria = `
      ${event.title}, event spans multiple days:
      start time ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.start, 'MMMM dd hh:mm a', locale)}
    `;
    if (event.end) {
      return aria + `, stop time ${(0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(event.end, 'MMMM d hh:mm a', locale)}`;
    }
    return aria + `, no stop time`;
  }
  /**
   * Aria label for the calendar event actions icons
   * @returns 'Edit' for fa-pencil icons, and 'Delete' for fa-times icons
   */
  actionButtonLabel({
    action
  }) {
    return action.a11yLabel;
  }
  /**
   * @returns {number} Tab index to be given to month cells
   */
  monthCellTabIndex() {
    return 0;
  }
  /**
   * @returns true if the events inside the month cell should be aria-hidden
   */
  hideMonthCellEvents() {
    return true;
  }
  /**
   * @returns true if event titles should be aria-hidden (global)
   */
  hideEventTitle() {
    return true;
  }
  /**
   * @returns true if hour segments in the week view should be aria-hidden
   */
  hideWeekHourSegment() {
    return true;
  }
  /**
   * @returns true if hour segments in the day view should be aria-hidden
   */
  hideDayHourSegment() {
    return true;
  }
}
CalendarA11y.ɵfac = function CalendarA11y_Factory(t) {
  return new (t || CalendarA11y)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_6__.I18nPluralPipe));
};
CalendarA11y.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarA11y,
  factory: CalendarA11y.ɵfac
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarA11y, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: _angular_common__WEBPACK_IMPORTED_MODULE_6__.I18nPluralPipe
    }];
  }, null);
})();

/**
 * This pipe is primarily for rendering aria labels. Example usage:
 * ```typescript
 * // where `myEvent` is a `CalendarEvent` and myLocale is a locale identifier
 * {{ { event: myEvent, locale: myLocale } | calendarA11y: 'eventDescription' }}
 * ```
 */
class CalendarA11yPipe {
  constructor(calendarA11y, locale) {
    this.calendarA11y = calendarA11y;
    this.locale = locale;
  }
  transform(a11yParams, method) {
    a11yParams.locale = a11yParams.locale || this.locale;
    if (typeof this.calendarA11y[method] === 'undefined') {
      const allowedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(CalendarA11y.prototype)).filter(iMethod => iMethod !== 'constructor');
      throw new Error(`${method} is not a valid a11y method. Can only be one of ${allowedMethods.join(', ')}`);
    }
    return this.calendarA11y[method](a11yParams);
  }
}
CalendarA11yPipe.ɵfac = function CalendarA11yPipe_Factory(t) {
  return new (t || CalendarA11yPipe)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarA11y, 16), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID, 16));
};
CalendarA11yPipe.ɵpipe = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefinePipe"]({
  name: "calendarA11y",
  type: CalendarA11yPipe,
  pure: true
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarA11yPipe, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Pipe,
    args: [{
      name: 'calendarA11y'
    }]
  }], function () {
    return [{
      type: CalendarA11y
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID]
      }]
    }];
  }, null);
})();
class CalendarEventActionsComponent {
  constructor() {
    this.trackByActionId = (index, action) => action.id ? action.id : action;
  }
}
CalendarEventActionsComponent.ɵfac = function CalendarEventActionsComponent_Factory(t) {
  return new (t || CalendarEventActionsComponent)();
};
CalendarEventActionsComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarEventActionsComponent,
  selectors: [["mwl-calendar-event-actions"]],
  inputs: {
    event: "event",
    customTemplate: "customTemplate"
  },
  decls: 3,
  vars: 5,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "cal-event-actions", 4, "ngIf"], [1, "cal-event-actions"], ["class", "cal-event-action", "href", "javascript:;", "tabindex", "0", "role", "button", 3, "ngClass", "innerHtml", "mwlClick", "mwlKeydownEnter", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["href", "javascript:;", "tabindex", "0", "role", "button", 1, "cal-event-action", 3, "ngClass", "innerHtml", "mwlClick", "mwlKeydownEnter"]],
  template: function CalendarEventActionsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarEventActionsComponent_ng_template_0_Template, 1, 1, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarEventActionsComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](2, _c1, ctx.event, ctx.trackByActionId));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, ClickDirective, KeydownEnterDirective, CalendarA11yPipe],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarEventActionsComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-event-actions',
      template: `
    <ng-template
      #defaultTemplate
      let-event="event"
      let-trackByActionId="trackByActionId"
    >
      <span *ngIf="event.actions" class="cal-event-actions">
        <a
          class="cal-event-action"
          href="javascript:;"
          *ngFor="let action of event.actions; trackBy: trackByActionId"
          (mwlClick)="action.onClick({ event: event, sourceEvent: $event })"
          (mwlKeydownEnter)="
            action.onClick({ event: event, sourceEvent: $event })
          "
          [ngClass]="action.cssClass"
          [innerHtml]="action.label"
          tabindex="0"
          role="button"
          [attr.aria-label]="
            { action: action } | calendarA11y : 'actionButtonLabel'
          "
        >
        </a>
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        trackByActionId: trackByActionId
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    event: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();

/**
 * This class is responsible for displaying all event titles within the calendar. You may override any of its methods via angulars DI to suit your requirements. For example:
 *
 * ```typescript
 * import { Injectable } from '@angular/core';
 * import { CalendarEventTitleFormatter, CalendarEvent } from 'angular-calendar';
 *
 * @Injectable()
 * class CustomEventTitleFormatter extends CalendarEventTitleFormatter {
 *
 *   month(event: CalendarEvent): string {
 *     return `Custom prefix: ${event.title}`;
 *   }
 *
 * }
 *
 * // in your component
 * providers: [{
 *  provide: CalendarEventTitleFormatter,
 *  useClass: CustomEventTitleFormatter
 * }]
 * ```
 */
class CalendarEventTitleFormatter {
  /**
   * The month view event title.
   */
  month(event, title) {
    return event.title;
  }
  /**
   * The month view event tooltip. Return a falsey value from this to disable the tooltip.
   */
  monthTooltip(event, title) {
    return event.title;
  }
  /**
   * The week view event title.
   */
  week(event, title) {
    return event.title;
  }
  /**
   * The week view event tooltip. Return a falsey value from this to disable the tooltip.
   */
  weekTooltip(event, title) {
    return event.title;
  }
  /**
   * The day view event title.
   */
  day(event, title) {
    return event.title;
  }
  /**
   * The day view event tooltip. Return a falsey value from this to disable the tooltip.
   */
  dayTooltip(event, title) {
    return event.title;
  }
}
class CalendarEventTitlePipe {
  constructor(calendarEventTitle) {
    this.calendarEventTitle = calendarEventTitle;
  }
  transform(title, titleType, event) {
    return this.calendarEventTitle[titleType](event, title);
  }
}
CalendarEventTitlePipe.ɵfac = function CalendarEventTitlePipe_Factory(t) {
  return new (t || CalendarEventTitlePipe)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarEventTitleFormatter, 16));
};
CalendarEventTitlePipe.ɵpipe = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefinePipe"]({
  name: "calendarEventTitle",
  type: CalendarEventTitlePipe,
  pure: true
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarEventTitlePipe, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Pipe,
    args: [{
      name: 'calendarEventTitle'
    }]
  }], function () {
    return [{
      type: CalendarEventTitleFormatter
    }];
  }, null);
})();
class CalendarEventTitleComponent {}
CalendarEventTitleComponent.ɵfac = function CalendarEventTitleComponent_Factory(t) {
  return new (t || CalendarEventTitleComponent)();
};
CalendarEventTitleComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarEventTitleComponent,
  selectors: [["mwl-calendar-event-title"]],
  inputs: {
    event: "event",
    customTemplate: "customTemplate",
    view: "view"
  },
  decls: 3,
  vars: 5,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "cal-event-title", 3, "innerHTML"]],
  template: function CalendarEventTitleComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarEventTitleComponent_ng_template_0_Template, 3, 10, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarEventTitleComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction2"](2, _c3, ctx.event, ctx.view));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, CalendarEventTitlePipe, CalendarA11yPipe],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarEventTitleComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-event-title',
      template: `
    <ng-template #defaultTemplate let-event="event" let-view="view">
      <span
        class="cal-event-title"
        [innerHTML]="event.title | calendarEventTitle : view : event"
        [attr.aria-hidden]="{} | calendarA11y : 'hideEventTitle'"
      >
      </span>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        event: event,
        view: view
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    event: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    view: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();
class CalendarTooltipWindowComponent {}
CalendarTooltipWindowComponent.ɵfac = function CalendarTooltipWindowComponent_Factory(t) {
  return new (t || CalendarTooltipWindowComponent)();
};
CalendarTooltipWindowComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarTooltipWindowComponent,
  selectors: [["mwl-calendar-tooltip-window"]],
  inputs: {
    contents: "contents",
    placement: "placement",
    event: "event",
    customTemplate: "customTemplate"
  },
  decls: 3,
  vars: 6,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "cal-tooltip", 3, "ngClass"], [1, "cal-tooltip-arrow"], [1, "cal-tooltip-inner", 3, "innerHtml"]],
  template: function CalendarTooltipWindowComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarTooltipWindowComponent_ng_template_0_Template, 3, 2, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarTooltipWindowComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction3"](2, _c4, ctx.contents, ctx.placement, ctx.event));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarTooltipWindowComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-tooltip-window',
      template: `
    <ng-template
      #defaultTemplate
      let-contents="contents"
      let-placement="placement"
      let-event="event"
    >
      <div class="cal-tooltip" [ngClass]="'cal-tooltip-' + placement">
        <div class="cal-tooltip-arrow"></div>
        <div class="cal-tooltip-inner" [innerHtml]="contents"></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        contents: contents,
        placement: placement,
        event: event
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    contents: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    placement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    event: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();
class CalendarTooltipDirective {
  constructor(elementRef, injector, renderer, componentFactoryResolver, viewContainerRef, document // eslint-disable-line
  ) {
    this.elementRef = elementRef;
    this.injector = injector;
    this.renderer = renderer;
    this.viewContainerRef = viewContainerRef;
    this.document = document;
    this.placement = 'auto'; // eslint-disable-line  @angular-eslint/no-input-rename
    this.delay = null; // eslint-disable-line  @angular-eslint/no-input-rename
    this.cancelTooltipDelay$ = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
    this.tooltipFactory = componentFactoryResolver.resolveComponentFactory(CalendarTooltipWindowComponent);
  }
  ngOnChanges(changes) {
    if (this.tooltipRef && (changes.contents || changes.customTemplate || changes.event)) {
      this.tooltipRef.instance.contents = this.contents;
      this.tooltipRef.instance.customTemplate = this.customTemplate;
      this.tooltipRef.instance.event = this.event;
      this.tooltipRef.changeDetectorRef.markForCheck();
      if (!this.contents) {
        this.hide();
      }
    }
  }
  ngOnDestroy() {
    this.hide();
  }
  onMouseOver() {
    const delay$ = this.delay === null ? (0,rxjs__WEBPACK_IMPORTED_MODULE_7__.of)('now') : (0,rxjs__WEBPACK_IMPORTED_MODULE_8__.timer)(this.delay);
    delay$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.takeUntil)(this.cancelTooltipDelay$)).subscribe(() => {
      this.show();
    });
  }
  onMouseOut() {
    this.hide();
  }
  show() {
    if (!this.tooltipRef && this.contents) {
      this.tooltipRef = this.viewContainerRef.createComponent(this.tooltipFactory, 0, this.injector, []);
      this.tooltipRef.instance.contents = this.contents;
      this.tooltipRef.instance.customTemplate = this.customTemplate;
      this.tooltipRef.instance.event = this.event;
      if (this.appendToBody) {
        this.document.body.appendChild(this.tooltipRef.location.nativeElement);
      }
      requestAnimationFrame(() => {
        this.positionTooltip();
      });
    }
  }
  hide() {
    if (this.tooltipRef) {
      this.viewContainerRef.remove(this.viewContainerRef.indexOf(this.tooltipRef.hostView));
      this.tooltipRef = null;
    }
    this.cancelTooltipDelay$.next();
  }
  positionTooltip(previousPositions = []) {
    if (this.tooltipRef) {
      this.tooltipRef.changeDetectorRef.detectChanges();
      this.tooltipRef.instance.placement = (0,positioning__WEBPACK_IMPORTED_MODULE_0__.positionElements)(this.elementRef.nativeElement, this.tooltipRef.location.nativeElement.children[0], this.placement, this.appendToBody);
      // keep re-positioning the tooltip until the arrow position doesn't make a difference
      if (previousPositions.indexOf(this.tooltipRef.instance.placement) === -1) {
        this.positionTooltip([...previousPositions, this.tooltipRef.instance.placement]);
      }
    }
  }
}
CalendarTooltipDirective.ɵfac = function CalendarTooltipDirective_Factory(t) {
  return new (t || CalendarTooltipDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Injector), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ComponentFactoryResolver), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ViewContainerRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_6__.DOCUMENT));
};
CalendarTooltipDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: CalendarTooltipDirective,
  selectors: [["", "mwlCalendarTooltip", ""]],
  hostBindings: function CalendarTooltipDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("mouseenter", function CalendarTooltipDirective_mouseenter_HostBindingHandler() {
        return ctx.onMouseOver();
      })("mouseleave", function CalendarTooltipDirective_mouseleave_HostBindingHandler() {
        return ctx.onMouseOut();
      });
    }
  },
  inputs: {
    contents: ["mwlCalendarTooltip", "contents"],
    placement: ["tooltipPlacement", "placement"],
    customTemplate: ["tooltipTemplate", "customTemplate"],
    event: ["tooltipEvent", "event"],
    appendToBody: ["tooltipAppendToBody", "appendToBody"],
    delay: ["tooltipDelay", "delay"]
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarTooltipDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlCalendarTooltip]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injector
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ComponentFactoryResolver
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ViewContainerRef
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.DOCUMENT]
      }]
    }];
  }, {
    contents: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['mwlCalendarTooltip']
    }],
    placement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipPlacement']
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipTemplate']
    }],
    event: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipEvent']
    }],
    appendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipAppendToBody']
    }],
    delay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input,
      args: ['tooltipDelay']
    }],
    onMouseOver: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['mouseenter']
    }],
    onMouseOut: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['mouseleave']
    }]
  });
})();
var CalendarView;
(function (CalendarView) {
  CalendarView["Month"] = "month";
  CalendarView["Week"] = "week";
  CalendarView["Day"] = "day";
})(CalendarView || (CalendarView = {}));
const validateEvents = events => {
  const warn = (...args) => console.warn('angular-calendar', ...args);
  return (0,calendar_utils__WEBPACK_IMPORTED_MODULE_1__.validateEvents)(events, warn);
};
function isInsideLeftAndRight(outer, inner) {
  return Math.floor(outer.left) <= Math.ceil(inner.left) && Math.floor(inner.left) <= Math.ceil(outer.right) && Math.floor(outer.left) <= Math.ceil(inner.right) && Math.floor(inner.right) <= Math.ceil(outer.right);
}
function isInsideTopAndBottom(outer, inner) {
  return Math.floor(outer.top) <= Math.ceil(inner.top) && Math.floor(inner.top) <= Math.ceil(outer.bottom) && Math.floor(outer.top) <= Math.ceil(inner.bottom) && Math.floor(inner.bottom) <= Math.ceil(outer.bottom);
}
function isInside(outer, inner) {
  return isInsideLeftAndRight(outer, inner) && isInsideTopAndBottom(outer, inner);
}
function roundToNearest(amount, precision) {
  return Math.round(amount / precision) * precision;
}
const trackByEventId = (index, event) => event.id ? event.id : event;
const trackByWeekDayHeaderDate = (index, day) => day.date.toISOString();
const trackByHourSegment = (index, segment) => segment.date.toISOString();
const trackByHour = (index, hour) => hour.segments[0].date.toISOString();
const trackByWeekAllDayEvent = (index, weekEvent) => weekEvent.event.id ? weekEvent.event.id : weekEvent.event;
const trackByWeekTimeEvent = (index, weekEvent) => weekEvent.event.id ? weekEvent.event.id : weekEvent.event;
const MINUTES_IN_HOUR = 60;
function getPixelAmountInMinutes(hourSegments, hourSegmentHeight, hourDuration) {
  return (hourDuration || MINUTES_IN_HOUR) / (hourSegments * hourSegmentHeight);
}
function getMinutesMoved(movedY, hourSegments, hourSegmentHeight, eventSnapSize, hourDuration) {
  const draggedInPixelsSnapSize = roundToNearest(movedY, eventSnapSize || hourSegmentHeight);
  const pixelAmountInMinutes = getPixelAmountInMinutes(hourSegments, hourSegmentHeight, hourDuration);
  return draggedInPixelsSnapSize * pixelAmountInMinutes;
}
function getDefaultEventEnd(dateAdapter, event, minimumMinutes) {
  if (event.end) {
    return event.end;
  } else {
    return dateAdapter.addMinutes(event.start, minimumMinutes);
  }
}
function addDaysWithExclusions(dateAdapter, date, days, excluded) {
  let daysCounter = 0;
  let daysToAdd = 0;
  const changeDays = days < 0 ? dateAdapter.subDays : dateAdapter.addDays;
  let result = date;
  while (daysToAdd <= Math.abs(days)) {
    result = changeDays(date, daysCounter);
    const day = dateAdapter.getDay(result);
    if (excluded.indexOf(day) === -1) {
      daysToAdd++;
    }
    daysCounter++;
  }
  return result;
}
function isDraggedWithinPeriod(newStart, newEnd, period) {
  const end = newEnd || newStart;
  return period.start <= newStart && newStart <= period.end || period.start <= end && end <= period.end;
}
function shouldFireDroppedEvent(dropEvent, date, allDay, calendarId) {
  return dropEvent.dropData && dropEvent.dropData.event && (dropEvent.dropData.calendarId !== calendarId || dropEvent.dropData.event.allDay && !allDay || !dropEvent.dropData.event.allDay && allDay);
}
function getWeekViewPeriod(dateAdapter, viewDate, weekStartsOn, excluded = [], daysInWeek) {
  let viewStart = daysInWeek ? dateAdapter.startOfDay(viewDate) : dateAdapter.startOfWeek(viewDate, {
    weekStartsOn
  });
  const endOfWeek = dateAdapter.endOfWeek(viewDate, {
    weekStartsOn
  });
  while (excluded.indexOf(dateAdapter.getDay(viewStart)) > -1 && viewStart < endOfWeek) {
    viewStart = dateAdapter.addDays(viewStart, 1);
  }
  if (daysInWeek) {
    const viewEnd = dateAdapter.endOfDay(addDaysWithExclusions(dateAdapter, viewStart, daysInWeek - 1, excluded));
    return {
      viewStart,
      viewEnd
    };
  } else {
    let viewEnd = endOfWeek;
    while (excluded.indexOf(dateAdapter.getDay(viewEnd)) > -1 && viewEnd > viewStart) {
      viewEnd = dateAdapter.subDays(viewEnd, 1);
    }
    return {
      viewStart,
      viewEnd
    };
  }
}
function isWithinThreshold({
  x,
  y
}) {
  const DRAG_THRESHOLD = 1;
  return Math.abs(x) > DRAG_THRESHOLD || Math.abs(y) > DRAG_THRESHOLD;
}
class DateAdapter {}

/**
 * Change the view date to the previous view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarPreviousView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Previous
 * </button>
 * ```
 */
class CalendarPreviousViewDirective {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
    /**
     * Days to skip when going back by 1 day
     */
    this.excludeDays = [];
    /**
     * Called when the view date is changed
     */
    this.viewDateChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
  /**
   * @hidden
   */
  onClick() {
    const subFn = {
      day: this.dateAdapter.subDays,
      week: this.dateAdapter.subWeeks,
      month: this.dateAdapter.subMonths
    }[this.view];
    if (this.view === CalendarView.Day) {
      this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -1, this.excludeDays));
    } else if (this.view === CalendarView.Week && this.daysInWeek) {
      this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, -this.daysInWeek, this.excludeDays));
    } else {
      this.viewDateChange.emit(subFn(this.viewDate, 1));
    }
  }
}
CalendarPreviousViewDirective.ɵfac = function CalendarPreviousViewDirective_Factory(t) {
  return new (t || CalendarPreviousViewDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter));
};
CalendarPreviousViewDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: CalendarPreviousViewDirective,
  selectors: [["", "mwlCalendarPreviousView", ""]],
  hostBindings: function CalendarPreviousViewDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarPreviousViewDirective_click_HostBindingHandler() {
        return ctx.onClick();
      });
    }
  },
  inputs: {
    view: "view",
    viewDate: "viewDate",
    excludeDays: "excludeDays",
    daysInWeek: "daysInWeek"
  },
  outputs: {
    viewDateChange: "viewDateChange"
  }
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarPreviousViewDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlCalendarPreviousView]'
    }]
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, {
    view: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    excludeDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDateChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    onClick: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['click']
    }]
  });
})();

/**
 * Change the view date to the next view. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarNextView
 *  [(viewDate)]="viewDate"
 *  [view]="view">
 *  Next
 * </button>
 * ```
 */
class CalendarNextViewDirective {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
    /**
     * Days to skip when going forward by 1 day
     */
    this.excludeDays = [];
    /**
     * Called when the view date is changed
     */
    this.viewDateChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
  /**
   * @hidden
   */
  onClick() {
    const addFn = {
      day: this.dateAdapter.addDays,
      week: this.dateAdapter.addWeeks,
      month: this.dateAdapter.addMonths
    }[this.view];
    if (this.view === CalendarView.Day) {
      this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, 1, this.excludeDays));
    } else if (this.view === CalendarView.Week && this.daysInWeek) {
      this.viewDateChange.emit(addDaysWithExclusions(this.dateAdapter, this.viewDate, this.daysInWeek, this.excludeDays));
    } else {
      this.viewDateChange.emit(addFn(this.viewDate, 1));
    }
  }
}
CalendarNextViewDirective.ɵfac = function CalendarNextViewDirective_Factory(t) {
  return new (t || CalendarNextViewDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter));
};
CalendarNextViewDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: CalendarNextViewDirective,
  selectors: [["", "mwlCalendarNextView", ""]],
  hostBindings: function CalendarNextViewDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarNextViewDirective_click_HostBindingHandler() {
        return ctx.onClick();
      });
    }
  },
  inputs: {
    view: "view",
    viewDate: "viewDate",
    excludeDays: "excludeDays",
    daysInWeek: "daysInWeek"
  },
  outputs: {
    viewDateChange: "viewDateChange"
  }
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarNextViewDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlCalendarNextView]'
    }]
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, {
    view: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    excludeDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDateChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    onClick: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['click']
    }]
  });
})();

/**
 * Change the view date to the current day. For example:
 *
 * ```typescript
 * <button
 *  mwlCalendarToday
 *  [(viewDate)]="viewDate">
 *  Today
 * </button>
 * ```
 */
class CalendarTodayDirective {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
    /**
     * Called when the view date is changed
     */
    this.viewDateChange = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
  /**
   * @hidden
   */
  onClick() {
    this.viewDateChange.emit(this.dateAdapter.startOfDay(new Date()));
  }
}
CalendarTodayDirective.ɵfac = function CalendarTodayDirective_Factory(t) {
  return new (t || CalendarTodayDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter));
};
CalendarTodayDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: CalendarTodayDirective,
  selectors: [["", "mwlCalendarToday", ""]],
  hostBindings: function CalendarTodayDirective_HostBindings(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function CalendarTodayDirective_click_HostBindingHandler() {
        return ctx.onClick();
      });
    }
  },
  inputs: {
    viewDate: "viewDate"
  },
  outputs: {
    viewDateChange: "viewDateChange"
  }
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarTodayDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlCalendarToday]'
    }]
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, {
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    viewDateChange: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    onClick: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.HostListener,
      args: ['click']
    }]
  });
})();

/**
 * This will use the angular date pipe to do all date formatting. It is the default date formatter used by the calendar.
 */
class CalendarAngularDateFormatter {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
  }
  /**
   * The month view header week day labels
   */
  monthViewColumnHeader({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE', locale);
  }
  /**
   * The month view cell day number
   */
  monthViewDayNumber({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'd', locale);
  }
  /**
   * The month view title
   */
  monthViewTitle({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'LLLL y', locale);
  }
  /**
   * The week view header week day labels
   */
  weekViewColumnHeader({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE', locale);
  }
  /**
   * The week view sub header day and month labels
   */
  weekViewColumnSubHeader({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'MMM d', locale);
  }
  /**
   * The week view title
   */
  weekViewTitle({
    date,
    locale,
    weekStartsOn,
    excludeDays,
    daysInWeek
  }) {
    const {
      viewStart,
      viewEnd
    } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
    const format = (dateToFormat, showYear) => (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(dateToFormat, 'MMM d' + (showYear ? ', yyyy' : ''), locale);
    return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
  }
  /**
   * The time formatting down the left hand side of the week view
   */
  weekViewHour({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'h a', locale);
  }
  /**
   * The time formatting down the left hand side of the day view
   */
  dayViewHour({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'h a', locale);
  }
  /**
   * The day view title
   */
  dayViewTitle({
    date,
    locale
  }) {
    return (0,_angular_common__WEBPACK_IMPORTED_MODULE_6__.formatDate)(date, 'EEEE, MMMM d, y', locale);
  }
}
CalendarAngularDateFormatter.ɵfac = function CalendarAngularDateFormatter_Factory(t) {
  return new (t || CalendarAngularDateFormatter)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](DateAdapter));
};
CalendarAngularDateFormatter.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarAngularDateFormatter,
  factory: CalendarAngularDateFormatter.ɵfac
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarAngularDateFormatter, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, null);
})();

/**
 * This class is responsible for all formatting of dates. There are 3 implementations available, the `CalendarAngularDateFormatter` (default) which uses the angular date pipe to format dates, the `CalendarNativeDateFormatter` which will use the <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to format dates, or there is the `CalendarMomentDateFormatter` which uses <a href="http://momentjs.com/" target="_blank">moment</a>.
 *
 * If you wish, you may override any of the defaults via angulars DI. For example:
 *
 * ```typescript
 * import { CalendarDateFormatter, DateFormatterParams } from 'angular-calendar';
 * import { formatDate } from '@angular/common';
 * import { Injectable } from '@angular/core';
 *
 * @Injectable()
 * class CustomDateFormatter extends CalendarDateFormatter {
 *
 *   public monthViewColumnHeader({date, locale}: DateFormatterParams): string {
 *     return formatDate(date, 'EEE', locale); // use short week days
 *   }
 *
 * }
 *
 * // in your component that uses the calendar
 * providers: [{
 *   provide: CalendarDateFormatter,
 *   useClass: CustomDateFormatter
 * }]
 * ```
 */
class CalendarDateFormatter extends CalendarAngularDateFormatter {}
CalendarDateFormatter.ɵfac = /* @__PURE__ */function () {
  let ɵCalendarDateFormatter_BaseFactory;
  return function CalendarDateFormatter_Factory(t) {
    return (ɵCalendarDateFormatter_BaseFactory || (ɵCalendarDateFormatter_BaseFactory = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetInheritedFactory"](CalendarDateFormatter)))(t || CalendarDateFormatter);
  };
}();
CalendarDateFormatter.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarDateFormatter,
  factory: CalendarDateFormatter.ɵfac
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarDateFormatter, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], null, null);
})();

/**
 * This pipe is primarily for rendering the current view title. Example usage:
 * ```typescript
 * // where `viewDate` is a `Date` and view is `'month' | 'week' | 'day'`
 * {{ viewDate | calendarDate:(view + 'ViewTitle'):'en' }}
 * ```
 */
class CalendarDatePipe {
  constructor(dateFormatter, locale) {
    this.dateFormatter = dateFormatter;
    this.locale = locale;
  }
  transform(date, method, locale = this.locale, weekStartsOn = 0, excludeDays = [], daysInWeek) {
    if (typeof this.dateFormatter[method] === 'undefined') {
      const allowedMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(CalendarDateFormatter.prototype)).filter(iMethod => iMethod !== 'constructor');
      throw new Error(`${method} is not a valid date formatter. Can only be one of ${allowedMethods.join(', ')}`);
    }
    return this.dateFormatter[method]({
      date,
      locale,
      weekStartsOn,
      excludeDays,
      daysInWeek
    });
  }
}
CalendarDatePipe.ɵfac = function CalendarDatePipe_Factory(t) {
  return new (t || CalendarDatePipe)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarDateFormatter, 16), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID, 16));
};
CalendarDatePipe.ɵpipe = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefinePipe"]({
  name: "calendarDate",
  type: CalendarDatePipe,
  pure: true
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarDatePipe, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Pipe,
    args: [{
      name: 'calendarDate'
    }]
  }], function () {
    return [{
      type: CalendarDateFormatter
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID]
      }]
    }];
  }, null);
})();
class CalendarUtils {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
  }
  getMonthView(args) {
    return (0,calendar_utils__WEBPACK_IMPORTED_MODULE_1__.getMonthView)(this.dateAdapter, args);
  }
  getWeekViewHeader(args) {
    return (0,calendar_utils__WEBPACK_IMPORTED_MODULE_1__.getWeekViewHeader)(this.dateAdapter, args);
  }
  getWeekView(args) {
    return (0,calendar_utils__WEBPACK_IMPORTED_MODULE_1__.getWeekView)(this.dateAdapter, args);
  }
}
CalendarUtils.ɵfac = function CalendarUtils_Factory(t) {
  return new (t || CalendarUtils)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](DateAdapter));
};
CalendarUtils.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarUtils,
  factory: CalendarUtils.ɵfac
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarUtils, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, null);
})();
const MOMENT = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.InjectionToken('Moment');
/**
 * This will use <a href="http://momentjs.com/" target="_blank">moment</a> to do all date formatting. To use this class:
 *
 * ```typescript
 * import { CalendarDateFormatter, CalendarMomentDateFormatter, MOMENT } from 'angular-calendar';
 * import moment from 'moment';
 *
 * // in your component
 * provide: [{
 *   provide: MOMENT, useValue: moment
 * }, {
 *   provide: CalendarDateFormatter, useClass: CalendarMomentDateFormatter
 * }]
 *
 * ```
 */
class CalendarMomentDateFormatter {
  /**
   * @hidden
   */
  constructor(moment, dateAdapter) {
    this.moment = moment;
    this.dateAdapter = dateAdapter;
  }
  /**
   * The month view header week day labels
   */
  monthViewColumnHeader({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('dddd');
  }
  /**
   * The month view cell day number
   */
  monthViewDayNumber({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('D');
  }
  /**
   * The month view title
   */
  monthViewTitle({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('MMMM YYYY');
  }
  /**
   * The week view header week day labels
   */
  weekViewColumnHeader({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('dddd');
  }
  /**
   * The week view sub header day and month labels
   */
  weekViewColumnSubHeader({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('MMM D');
  }
  /**
   * The week view title
   */
  weekViewTitle({
    date,
    locale,
    weekStartsOn,
    excludeDays,
    daysInWeek
  }) {
    const {
      viewStart,
      viewEnd
    } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
    const format = (dateToFormat, showYear) => this.moment(dateToFormat).locale(locale).format('MMM D' + (showYear ? ', YYYY' : ''));
    return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
  }
  /**
   * The time formatting down the left hand side of the week view
   */
  weekViewHour({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('ha');
  }
  /**
   * The time formatting down the left hand side of the day view
   */
  dayViewHour({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('ha');
  }
  /**
   * The day view title
   */
  dayViewTitle({
    date,
    locale
  }) {
    return this.moment(date).locale(locale).format('dddd, LL'); // dddd = Thursday
  } // LL = locale-dependent Month Day, Year
}

CalendarMomentDateFormatter.ɵfac = function CalendarMomentDateFormatter_Factory(t) {
  return new (t || CalendarMomentDateFormatter)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](MOMENT), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](DateAdapter));
};
CalendarMomentDateFormatter.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarMomentDateFormatter,
  factory: CalendarMomentDateFormatter.ɵfac
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMomentDateFormatter, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [MOMENT]
      }]
    }, {
      type: DateAdapter
    }];
  }, null);
})();

/**
 * This will use <a href="https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Intl" target="_blank">Intl</a> API to do all date formatting.
 *
 * You will need to include a <a href="https://github.com/andyearnshaw/Intl.js/">polyfill</a> for older browsers.
 */
class CalendarNativeDateFormatter {
  constructor(dateAdapter) {
    this.dateAdapter = dateAdapter;
  }
  /**
   * The month view header week day labels
   */
  monthViewColumnHeader({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long'
    }).format(date);
  }
  /**
   * The month view cell day number
   */
  monthViewDayNumber({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric'
    }).format(date);
  }
  /**
   * The month view title
   */
  monthViewTitle({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'long'
    }).format(date);
  }
  /**
   * The week view header week day labels
   */
  weekViewColumnHeader({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      weekday: 'long'
    }).format(date);
  }
  /**
   * The week view sub header day and month labels
   */
  weekViewColumnSubHeader({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short'
    }).format(date);
  }
  /**
   * The week view title
   */
  weekViewTitle({
    date,
    locale,
    weekStartsOn,
    excludeDays,
    daysInWeek
  }) {
    const {
      viewStart,
      viewEnd
    } = getWeekViewPeriod(this.dateAdapter, date, weekStartsOn, excludeDays, daysInWeek);
    const format = (dateToFormat, showYear) => new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'short',
      year: showYear ? 'numeric' : undefined
    }).format(dateToFormat);
    return `${format(viewStart, viewStart.getUTCFullYear() !== viewEnd.getUTCFullYear())} - ${format(viewEnd, true)}`;
  }
  /**
   * The time formatting down the left hand side of the week view
   */
  weekViewHour({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric'
    }).format(date);
  }
  /**
   * The time formatting down the left hand side of the day view
   */
  dayViewHour({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      hour: 'numeric'
    }).format(date);
  }
  /**
   * The day view title
   */
  dayViewTitle({
    date,
    locale
  }) {
    return new Intl.DateTimeFormat(locale, {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      weekday: 'long'
    }).format(date);
  }
}
CalendarNativeDateFormatter.ɵfac = function CalendarNativeDateFormatter_Factory(t) {
  return new (t || CalendarNativeDateFormatter)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](DateAdapter));
};
CalendarNativeDateFormatter.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: CalendarNativeDateFormatter,
  factory: CalendarNativeDateFormatter.ɵfac
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarNativeDateFormatter, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable
  }], function () {
    return [{
      type: DateAdapter
    }];
  }, null);
})();
var CalendarEventTimesChangedEventType;
(function (CalendarEventTimesChangedEventType) {
  CalendarEventTimesChangedEventType["Drag"] = "drag";
  CalendarEventTimesChangedEventType["Drop"] = "drop";
  CalendarEventTimesChangedEventType["Resize"] = "resize";
})(CalendarEventTimesChangedEventType || (CalendarEventTimesChangedEventType = {}));

/**
 * Import this module to if you're just using a singular view and want to save on bundle size. Example usage:
 *
 * ```typescript
 * import { CalendarCommonModule, CalendarMonthModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalendarCommonModule.forRoot(),
 *     CalendarMonthModule
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
class CalendarCommonModule {
  static forRoot(dateAdapter, config = {}) {
    return {
      ngModule: CalendarCommonModule,
      providers: [dateAdapter, config.eventTitleFormatter || CalendarEventTitleFormatter, config.dateFormatter || CalendarDateFormatter, config.utils || CalendarUtils, config.a11y || CalendarA11y]
    };
  }
}
CalendarCommonModule.ɵfac = function CalendarCommonModule_Factory(t) {
  return new (t || CalendarCommonModule)();
};
CalendarCommonModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarCommonModule
});
CalendarCommonModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  providers: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.I18nPluralPipe],
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarCommonModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      declarations: [CalendarEventActionsComponent, CalendarEventTitleComponent, CalendarTooltipWindowComponent, CalendarTooltipDirective, CalendarPreviousViewDirective, CalendarNextViewDirective, CalendarTodayDirective, CalendarDatePipe, CalendarEventTitlePipe, CalendarA11yPipe, ClickDirective, KeydownEnterDirective],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule],
      exports: [CalendarEventActionsComponent, CalendarEventTitleComponent, CalendarTooltipWindowComponent, CalendarTooltipDirective, CalendarPreviousViewDirective, CalendarNextViewDirective, CalendarTodayDirective, CalendarDatePipe, CalendarEventTitlePipe, CalendarA11yPipe, ClickDirective, KeydownEnterDirective],
      providers: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.I18nPluralPipe]
    }]
  }], null, null);
})();
class CalendarMonthCellComponent {
  constructor() {
    this.highlightDay = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.unhighlightDay = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.trackByEventId = trackByEventId;
    this.validateDrag = isWithinThreshold;
  }
}
CalendarMonthCellComponent.ɵfac = function CalendarMonthCellComponent_Factory(t) {
  return new (t || CalendarMonthCellComponent)();
};
CalendarMonthCellComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarMonthCellComponent,
  selectors: [["mwl-calendar-month-cell"]],
  hostAttrs: [1, "cal-cell", "cal-day-cell"],
  hostVars: 18,
  hostBindings: function CalendarMonthCellComponent_HostBindings(rf, ctx) {
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-past", ctx.day.isPast)("cal-today", ctx.day.isToday)("cal-future", ctx.day.isFuture)("cal-weekend", ctx.day.isWeekend)("cal-in-month", ctx.day.inMonth)("cal-out-month", !ctx.day.inMonth)("cal-has-events", ctx.day.events.length > 0)("cal-open", ctx.day === ctx.openDay)("cal-event-highlight", !!ctx.day.backgroundColor);
    }
  },
  inputs: {
    day: "day",
    openDay: "openDay",
    locale: "locale",
    tooltipPlacement: "tooltipPlacement",
    tooltipAppendToBody: "tooltipAppendToBody",
    customTemplate: "customTemplate",
    tooltipTemplate: "tooltipTemplate",
    tooltipDelay: "tooltipDelay"
  },
  outputs: {
    highlightDay: "highlightDay",
    unhighlightDay: "unhighlightDay",
    eventClicked: "eventClicked"
  },
  decls: 3,
  vars: 15,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "cal-cell-top"], ["aria-hidden", "true"], ["class", "cal-day-badge", 4, "ngIf"], [1, "cal-day-number"], ["class", "cal-events", 4, "ngIf"], [1, "cal-day-badge"], [1, "cal-events"], ["class", "cal-event", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "ngStyle", "ngClass", "mwlCalendarTooltip", "tooltipPlacement", "tooltipEvent", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "cal-draggable", "dropData", "dragAxis", "validateDrag", "touchStartLongPress", "mouseenter", "mouseleave", "mwlClick", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDraggable", "", "dragActiveClass", "cal-drag-active", 1, "cal-event", 3, "ngStyle", "ngClass", "mwlCalendarTooltip", "tooltipPlacement", "tooltipEvent", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "dropData", "dragAxis", "validateDrag", "touchStartLongPress", "mouseenter", "mouseleave", "mwlClick"]],
  template: function CalendarMonthCellComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarMonthCellComponent_ng_template_0_Template, 8, 14, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarMonthCellComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunctionV"](2, _c10, [ctx.day, ctx.openDay, ctx.locale, ctx.tooltipPlacement, ctx.highlightDay, ctx.unhighlightDay, ctx.eventClicked, ctx.tooltipTemplate, ctx.tooltipAppendToBody, ctx.tooltipDelay, ctx.trackByEventId, ctx.validateDrag]));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgStyle, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DraggableDirective, CalendarTooltipDirective, ClickDirective, CalendarDatePipe, CalendarEventTitlePipe, CalendarA11yPipe],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMonthCellComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-month-cell',
      template: `
    <ng-template
      #defaultTemplate
      let-day="day"
      let-openDay="openDay"
      let-locale="locale"
      let-tooltipPlacement="tooltipPlacement"
      let-highlightDay="highlightDay"
      let-unhighlightDay="unhighlightDay"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDelay="tooltipDelay"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-cell-top"
        [attr.aria-label]="
          { day: day, locale: locale } | calendarA11y : 'monthCell'
        "
      >
        <span aria-hidden="true">
          <span class="cal-day-badge" *ngIf="day.badgeTotal > 0">{{
            day.badgeTotal
          }}</span>
          <span class="cal-day-number">{{
            day.date | calendarDate : 'monthViewDayNumber' : locale
          }}</span>
        </span>
      </div>
      <div class="cal-events" *ngIf="day.events.length > 0">
        <div
          class="cal-event"
          *ngFor="let event of day.events; trackBy: trackByEventId"
          [ngStyle]="{ backgroundColor: event.color?.primary }"
          [ngClass]="event?.cssClass"
          (mouseenter)="highlightDay.emit({ event: event })"
          (mouseleave)="unhighlightDay.emit({ event: event })"
          [mwlCalendarTooltip]="
            event.title | calendarEventTitle : 'monthTooltip' : event
          "
          [tooltipPlacement]="tooltipPlacement"
          [tooltipEvent]="event"
          [tooltipTemplate]="tooltipTemplate"
          [tooltipAppendToBody]="tooltipAppendToBody"
          [tooltipDelay]="tooltipDelay"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event, draggedFrom: day }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
          (mwlClick)="eventClicked.emit({ event: event, sourceEvent: $event })"
          [attr.aria-hidden]="{} | calendarA11y : 'hideMonthCellEvents'"
        ></div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        day: day,
        openDay: openDay,
        locale: locale,
        tooltipPlacement: tooltipPlacement,
        highlightDay: highlightDay,
        unhighlightDay: unhighlightDay,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDelay: tooltipDelay,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `,
      // eslint-disable-next-line @angular-eslint/no-host-metadata-property
      host: {
        class: 'cal-cell cal-day-cell',
        '[class.cal-past]': 'day.isPast',
        '[class.cal-today]': 'day.isToday',
        '[class.cal-future]': 'day.isFuture',
        '[class.cal-weekend]': 'day.isWeekend',
        '[class.cal-in-month]': 'day.inMonth',
        '[class.cal-out-month]': '!day.inMonth',
        '[class.cal-has-events]': 'day.events.length > 0',
        '[class.cal-open]': 'day === openDay',
        '[class.cal-event-highlight]': '!!day.backgroundColor'
      }
    }]
  }], null, {
    day: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    openDay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    highlightDay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    unhighlightDay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
const collapseAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.trigger)('collapse', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.state)('void', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.style)({
  height: 0,
  overflow: 'hidden',
  'padding-top': 0,
  'padding-bottom': 0
})), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.state)('*', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.style)({
  height: '*',
  overflow: 'hidden',
  'padding-top': '*',
  'padding-bottom': '*'
})), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.transition)('* => void', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.animate)('150ms ease-out')), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.transition)('void => *', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_10__.animate)('150ms ease-in'))]);
class CalendarOpenDayEventsComponent {
  constructor() {
    this.isOpen = false;
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.trackByEventId = trackByEventId;
    this.validateDrag = isWithinThreshold;
  }
}
CalendarOpenDayEventsComponent.ɵfac = function CalendarOpenDayEventsComponent_Factory(t) {
  return new (t || CalendarOpenDayEventsComponent)();
};
CalendarOpenDayEventsComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarOpenDayEventsComponent,
  selectors: [["mwl-calendar-open-day-events"]],
  inputs: {
    locale: "locale",
    isOpen: "isOpen",
    events: "events",
    customTemplate: "customTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    date: "date"
  },
  outputs: {
    eventClicked: "eventClicked"
  },
  decls: 3,
  vars: 8,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "cal-open-day-events", "role", "application", 4, "ngIf"], ["role", "application", 1, "cal-open-day-events"], ["tabindex", "-1", "role", "alert"], ["tabindex", "0", "role", "landmark"], ["mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "ngClass", "cal-draggable", "dropData", "dragAxis", "validateDrag", "touchStartLongPress", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "ngClass", "dropData", "dragAxis", "validateDrag", "touchStartLongPress"], [1, "cal-event", 3, "ngStyle"], ["view", "month", "tabindex", "0", 3, "event", "customTemplate", "mwlClick", "mwlKeydownEnter"], [3, "event", "customTemplate"]],
  template: function CalendarOpenDayEventsComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarOpenDayEventsComponent_ng_template_0_Template, 1, 1, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarOpenDayEventsComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction5"](2, _c14, ctx.events, ctx.eventClicked, ctx.isOpen, ctx.trackByEventId, ctx.validateDrag));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgStyle, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DraggableDirective, CalendarEventActionsComponent, CalendarEventTitleComponent, ClickDirective, KeydownEnterDirective, CalendarA11yPipe],
  encapsulation: 2,
  data: {
    animation: [collapseAnimation]
  }
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarOpenDayEventsComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-open-day-events',
      template: `
    <ng-template
      #defaultTemplate
      let-events="events"
      let-eventClicked="eventClicked"
      let-isOpen="isOpen"
      let-trackByEventId="trackByEventId"
      let-validateDrag="validateDrag"
    >
      <div
        class="cal-open-day-events"
        [@collapse]
        *ngIf="isOpen"
        role="application"
      >
        <span
          tabindex="-1"
          role="alert"
          [attr.aria-label]="
            { date: date, locale: locale } | calendarA11y : 'openDayEventsAlert'
          "
        ></span>
        <span
          tabindex="0"
          role="landmark"
          [attr.aria-label]="
            { date: date, locale: locale }
              | calendarA11y : 'openDayEventsLandmark'
          "
        ></span>
        <div
          *ngFor="let event of events; trackBy: trackByEventId"
          [ngClass]="event?.cssClass"
          mwlDraggable
          [class.cal-draggable]="event.draggable"
          dragActiveClass="cal-drag-active"
          [dropData]="{ event: event }"
          [dragAxis]="{ x: event.draggable, y: event.draggable }"
          [validateDrag]="validateDrag"
          [touchStartLongPress]="{ delay: 300, delta: 30 }"
        >
          <span
            class="cal-event"
            [ngStyle]="{ backgroundColor: event.color?.primary }"
          >
          </span>
          &ngsp;
          <mwl-calendar-event-title
            [event]="event"
            [customTemplate]="eventTitleTemplate"
            view="month"
            (mwlClick)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            (mwlKeydownEnter)="
              eventClicked.emit({ event: event, sourceEvent: $event })
            "
            tabindex="0"
            [attr.aria-label]="
              { event: event, locale: locale }
                | calendarA11y : 'eventDescription'
            "
          >
          </mwl-calendar-event-title>
          &ngsp;
          <mwl-calendar-event-actions
            [event]="event"
            [customTemplate]="eventActionsTemplate"
          >
          </mwl-calendar-event-actions>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        events: events,
        eventClicked: eventClicked,
        isOpen: isOpen,
        trackByEventId: trackByEventId,
        validateDrag: validateDrag
      }"
    >
    </ng-template>
  `,
      animations: [collapseAnimation]
    }]
  }], null, {
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    isOpen: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    events: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    date: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarMonthViewHeaderComponent {
  constructor() {
    this.columnHeaderClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
  }
}
CalendarMonthViewHeaderComponent.ɵfac = function CalendarMonthViewHeaderComponent_Factory(t) {
  return new (t || CalendarMonthViewHeaderComponent)();
};
CalendarMonthViewHeaderComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarMonthViewHeaderComponent,
  selectors: [["mwl-calendar-month-view-header"]],
  inputs: {
    days: "days",
    locale: "locale",
    customTemplate: "customTemplate"
  },
  outputs: {
    columnHeaderClicked: "columnHeaderClicked"
  },
  decls: 3,
  vars: 6,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["role", "row", 1, "cal-cell-row", "cal-header"], ["class", "cal-cell", "tabindex", "0", "role", "columnheader", 3, "cal-past", "cal-today", "cal-future", "cal-weekend", "ngClass", "click", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["tabindex", "0", "role", "columnheader", 1, "cal-cell", 3, "ngClass", "click"]],
  template: function CalendarMonthViewHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarMonthViewHeaderComponent_ng_template_0_Template, 2, 2, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarMonthViewHeaderComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction3"](2, _c15, ctx.days, ctx.locale, ctx.trackByWeekDayHeaderDate));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, CalendarDatePipe],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMonthViewHeaderComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-month-view-header',
      template: `
    <ng-template
      #defaultTemplate
      let-days="days"
      let-locale="locale"
      let-trackByWeekDayHeaderDate="trackByWeekDayHeaderDate"
    >
      <div class="cal-cell-row cal-header" role="row">
        <div
          class="cal-cell"
          *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-today]="day.isToday"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          (click)="
            columnHeaderClicked.emit({
              isoDayNumber: day.day,
              sourceEvent: $event
            })
          "
          [ngClass]="day.cssClass"
          tabindex="0"
          role="columnheader"
        >
          {{ day.date | calendarDate : 'monthViewColumnHeader' : locale }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        days: days,
        locale: locale,
        trackByWeekDayHeaderDate: trackByWeekDayHeaderDate
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    days: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    columnHeaderClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();

/**
 * Shows all events on a given month. Example usage:
 *
 * ```typescript
 * <mwl-calendar-month-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-month-view>
 * ```
 */
class CalendarMonthViewComponent {
  /**
   * @hidden
   */
  constructor(cdr, utils, locale, dateAdapter) {
    this.cdr = cdr;
    this.utils = utils;
    this.dateAdapter = dateAdapter;
    /**
     * An array of events to display on view.
     * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    this.events = [];
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    this.excludeDays = [];
    /**
     * Whether the events list for the day of the `viewDate` option is visible or not
     */
    this.activeDayIsOpen = false;
    /**
     * The placement of the event tooltip
     */
    this.tooltipPlacement = 'auto';
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    this.tooltipAppendToBody = true;
    /**
     * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
     * will be displayed immediately.
     */
    this.tooltipDelay = null;
    /**
     * An output that will be called before the view is rendered for the current month.
     * If you add the `cssClass` property to a day in the body it will add that class to the cell element in the template
     */
    this.beforeViewRender = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when the day cell is clicked
     */
    this.dayClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when the event title is clicked
     */
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when a header week day is clicked. Returns ISO day number.
     */
    this.columnHeaderClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an event is dragged and dropped
     */
    this.eventTimesChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * @hidden
     */
    this.trackByRowOffset = (index, offset) => this.view.days.slice(offset, this.view.totalDaysVisibleInWeek).map(day => day.date.toISOString()).join('-');
    /**
     * @hidden
     */
    this.trackByDate = (index, day) => day.date.toISOString();
    this.locale = locale;
  }
  /**
   * @hidden
   */
  ngOnInit() {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshAll();
        this.cdr.markForCheck();
      });
    }
  }
  /**
   * @hidden
   */
  ngOnChanges(changes) {
    const refreshHeader = changes.viewDate || changes.excludeDays || changes.weekendDays;
    const refreshBody = changes.viewDate || changes.events || changes.excludeDays || changes.weekendDays;
    if (refreshHeader) {
      this.refreshHeader();
    }
    if (changes.events) {
      validateEvents(this.events);
    }
    if (refreshBody) {
      this.refreshBody();
    }
    if (refreshHeader || refreshBody) {
      this.emitBeforeViewRender();
    }
    if (changes.activeDayIsOpen || changes.viewDate || changes.events || changes.excludeDays || changes.activeDay) {
      this.checkActiveDayIsOpen();
    }
  }
  /**
   * @hidden
   */
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  /**
   * @hidden
   */
  toggleDayHighlight(event, isHighlighted) {
    this.view.days.forEach(day => {
      if (isHighlighted && day.events.indexOf(event) > -1) {
        day.backgroundColor = event.color && event.color.secondary || '#D1E8FF';
      } else {
        delete day.backgroundColor;
      }
    });
  }
  /**
   * @hidden
   */
  eventDropped(droppedOn, event, draggedFrom) {
    if (droppedOn !== draggedFrom) {
      const year = this.dateAdapter.getYear(droppedOn.date);
      const month = this.dateAdapter.getMonth(droppedOn.date);
      const date = this.dateAdapter.getDate(droppedOn.date);
      const newStart = this.dateAdapter.setDate(this.dateAdapter.setMonth(this.dateAdapter.setYear(event.start, year), month), date);
      let newEnd;
      if (event.end) {
        const secondsDiff = this.dateAdapter.differenceInSeconds(newStart, event.start);
        newEnd = this.dateAdapter.addSeconds(event.end, secondsDiff);
      }
      this.eventTimesChanged.emit({
        event,
        newStart,
        newEnd,
        day: droppedOn,
        type: CalendarEventTimesChangedEventType.Drop
      });
    }
  }
  refreshHeader() {
    this.columnHeaders = this.utils.getWeekViewHeader({
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays
    });
  }
  refreshBody() {
    this.view = this.utils.getMonthView({
      events: this.events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays
    });
  }
  checkActiveDayIsOpen() {
    if (this.activeDayIsOpen === true) {
      const activeDay = this.activeDay || this.viewDate;
      this.openDay = this.view.days.find(day => this.dateAdapter.isSameDay(day.date, activeDay));
      const index = this.view.days.indexOf(this.openDay);
      this.openRowIndex = Math.floor(index / this.view.totalDaysVisibleInWeek) * this.view.totalDaysVisibleInWeek;
    } else {
      this.openRowIndex = null;
      this.openDay = null;
    }
  }
  refreshAll() {
    this.refreshHeader();
    this.refreshBody();
    this.emitBeforeViewRender();
    this.checkActiveDayIsOpen();
  }
  emitBeforeViewRender() {
    if (this.columnHeaders && this.view) {
      this.beforeViewRender.emit({
        header: this.columnHeaders,
        body: this.view.days,
        period: this.view.period
      });
    }
  }
}
CalendarMonthViewComponent.ɵfac = function CalendarMonthViewComponent_Factory(t) {
  return new (t || CalendarMonthViewComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarUtils), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter));
};
CalendarMonthViewComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarMonthViewComponent,
  selectors: [["mwl-calendar-month-view"]],
  inputs: {
    viewDate: "viewDate",
    events: "events",
    excludeDays: "excludeDays",
    activeDayIsOpen: "activeDayIsOpen",
    activeDay: "activeDay",
    refresh: "refresh",
    locale: "locale",
    tooltipPlacement: "tooltipPlacement",
    tooltipTemplate: "tooltipTemplate",
    tooltipAppendToBody: "tooltipAppendToBody",
    tooltipDelay: "tooltipDelay",
    weekStartsOn: "weekStartsOn",
    headerTemplate: "headerTemplate",
    cellTemplate: "cellTemplate",
    openDayEventsTemplate: "openDayEventsTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    weekendDays: "weekendDays"
  },
  outputs: {
    beforeViewRender: "beforeViewRender",
    dayClicked: "dayClicked",
    eventClicked: "eventClicked",
    columnHeaderClicked: "columnHeaderClicked",
    eventTimesChanged: "eventTimesChanged"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]],
  decls: 4,
  vars: 5,
  consts: [["role", "grid", 1, "cal-month-view"], [3, "days", "locale", "customTemplate", "columnHeaderClicked"], [1, "cal-days"], [4, "ngFor", "ngForOf", "ngForTrackBy"], ["role", "row", 1, "cal-cell-row"], ["role", "gridcell", "mwlDroppable", "", "dragOverClass", "cal-drag-over", 3, "ngClass", "day", "openDay", "locale", "tooltipPlacement", "tooltipAppendToBody", "tooltipTemplate", "tooltipDelay", "customTemplate", "ngStyle", "clickListenerDisabled", "mwlClick", "mwlKeydownEnter", "highlightDay", "unhighlightDay", "drop", "eventClicked", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", "dragOverClass", "cal-drag-over", 3, "locale", "isOpen", "events", "date", "customTemplate", "eventTitleTemplate", "eventActionsTemplate", "eventClicked", "drop"], ["role", "gridcell", "mwlDroppable", "", "dragOverClass", "cal-drag-over", 3, "ngClass", "day", "openDay", "locale", "tooltipPlacement", "tooltipAppendToBody", "tooltipTemplate", "tooltipDelay", "customTemplate", "ngStyle", "clickListenerDisabled", "mwlClick", "mwlKeydownEnter", "highlightDay", "unhighlightDay", "drop", "eventClicked"]],
  template: function CalendarMonthViewComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "mwl-calendar-month-view-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("columnHeaderClicked", function CalendarMonthViewComponent_Template_mwl_calendar_month_view_header_columnHeaderClicked_1_listener($event) {
        return ctx.columnHeaderClicked.emit($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, CalendarMonthViewComponent_div_3_Template, 5, 13, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("days", ctx.columnHeaders)("locale", ctx.locale)("customTemplate", ctx.headerTemplate);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.view.rowOffsets)("ngForTrackBy", ctx.trackByRowOffset);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgStyle, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DroppableDirective, ClickDirective, KeydownEnterDirective, CalendarMonthCellComponent, CalendarOpenDayEventsComponent, CalendarMonthViewHeaderComponent, _angular_common__WEBPACK_IMPORTED_MODULE_6__.SlicePipe, CalendarA11yPipe],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMonthViewComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-month-view',
      template: `
    <div class="cal-month-view" role="grid">
      <mwl-calendar-month-view-header
        [days]="columnHeaders"
        [locale]="locale"
        (columnHeaderClicked)="columnHeaderClicked.emit($event)"
        [customTemplate]="headerTemplate"
      >
      </mwl-calendar-month-view-header>
      <div class="cal-days">
        <div
          *ngFor="let rowIndex of view.rowOffsets; trackBy: trackByRowOffset"
        >
          <div role="row" class="cal-cell-row">
            <mwl-calendar-month-cell
              role="gridcell"
              *ngFor="
                let day of view.days
                  | slice : rowIndex : rowIndex + view.totalDaysVisibleInWeek;
                trackBy: trackByDate
              "
              [ngClass]="day?.cssClass"
              [day]="day"
              [openDay]="openDay"
              [locale]="locale"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipDelay]="tooltipDelay"
              [customTemplate]="cellTemplate"
              [ngStyle]="{ backgroundColor: day.backgroundColor }"
              (mwlClick)="dayClicked.emit({ day: day, sourceEvent: $event })"
              [clickListenerDisabled]="dayClicked.observers.length === 0"
              (mwlKeydownEnter)="
                dayClicked.emit({ day: day, sourceEvent: $event })
              "
              (highlightDay)="toggleDayHighlight($event.event, true)"
              (unhighlightDay)="toggleDayHighlight($event.event, false)"
              mwlDroppable
              dragOverClass="cal-drag-over"
              (drop)="
                eventDropped(
                  day,
                  $event.dropData.event,
                  $event.dropData.draggedFrom
                )
              "
              (eventClicked)="
                eventClicked.emit({
                  event: $event.event,
                  sourceEvent: $event.sourceEvent
                })
              "
              [attr.tabindex]="{} | calendarA11y : 'monthCellTabIndex'"
            >
            </mwl-calendar-month-cell>
          </div>
          <mwl-calendar-open-day-events
            [locale]="locale"
            [isOpen]="openRowIndex === rowIndex"
            [events]="openDay?.events"
            [date]="openDay?.date"
            [customTemplate]="openDayEventsTemplate"
            [eventTitleTemplate]="eventTitleTemplate"
            [eventActionsTemplate]="eventActionsTemplate"
            (eventClicked)="
              eventClicked.emit({
                event: $event.event,
                sourceEvent: $event.sourceEvent
              })
            "
            mwlDroppable
            dragOverClass="cal-drag-over"
            (drop)="
              eventDropped(
                openDay,
                $event.dropData.event,
                $event.dropData.draggedFrom
              )
            "
          >
          </mwl-calendar-open-day-events>
        </div>
      </div>
    </div>
  `
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef
    }, {
      type: CalendarUtils
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID]
      }]
    }, {
      type: DateAdapter
    }];
  }, {
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    events: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    excludeDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    activeDayIsOpen: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    activeDay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    refresh: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekStartsOn: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    headerTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    cellTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    openDayEventsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekendDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    beforeViewRender: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dayClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    columnHeaderClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarMonthModule {}
CalendarMonthModule.ɵfac = function CalendarMonthModule_Factory(t) {
  return new (t || CalendarMonthModule)();
};
CalendarMonthModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarMonthModule
});
CalendarMonthModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarCommonModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarMonthModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarCommonModule],
      declarations: [CalendarMonthViewComponent, CalendarMonthCellComponent, CalendarOpenDayEventsComponent, CalendarMonthViewHeaderComponent],
      exports: [angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarMonthViewComponent, CalendarMonthCellComponent, CalendarOpenDayEventsComponent, CalendarMonthViewHeaderComponent]
    }]
  }], null, null);
})();
class CalendarDragHelper {
  constructor(dragContainerElement, draggableElement) {
    this.dragContainerElement = dragContainerElement;
    this.startPosition = draggableElement.getBoundingClientRect();
  }
  validateDrag({
    x,
    y,
    snapDraggedEvents,
    dragAlreadyMoved,
    transform
  }) {
    const isDraggedWithinThreshold = isWithinThreshold({
      x,
      y
    }) || dragAlreadyMoved;
    if (snapDraggedEvents) {
      const inner = Object.assign({}, this.startPosition, {
        left: this.startPosition.left + transform.x,
        right: this.startPosition.right + transform.x,
        top: this.startPosition.top + transform.y,
        bottom: this.startPosition.bottom + transform.y
      });
      if (isDraggedWithinThreshold) {
        const outer = this.dragContainerElement.getBoundingClientRect();
        const isTopInside = outer.top < inner.top && inner.top < outer.bottom;
        const isBottomInside = outer.top < inner.bottom && inner.bottom < outer.bottom;
        return isInsideLeftAndRight(outer, inner) && (isTopInside || isBottomInside);
      }
      /* istanbul ignore next */
      return false;
    } else {
      return isDraggedWithinThreshold;
    }
  }
}
class CalendarResizeHelper {
  constructor(resizeContainerElement, minWidth, rtl) {
    this.resizeContainerElement = resizeContainerElement;
    this.minWidth = minWidth;
    this.rtl = rtl;
  }
  validateResize({
    rectangle,
    edges
  }) {
    if (this.rtl) {
      // TODO - find a way of testing this, for some reason the tests always fail but it does actually work
      /* istanbul ignore next */
      if (typeof edges.left !== 'undefined') {
        rectangle.left -= edges.left;
        rectangle.right += edges.left;
      } else if (typeof edges.right !== 'undefined') {
        rectangle.left += edges.right;
        rectangle.right -= edges.right;
      }
      rectangle.width = rectangle.right - rectangle.left;
    }
    if (this.minWidth && Math.ceil(rectangle.width) < Math.ceil(this.minWidth)) {
      return false;
    }
    return isInside(this.resizeContainerElement.getBoundingClientRect(), rectangle);
  }
}
class CalendarWeekViewHeaderComponent {
  constructor() {
    this.dayHeaderClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.eventDropped = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.dragEnter = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
  }
}
CalendarWeekViewHeaderComponent.ɵfac = function CalendarWeekViewHeaderComponent_Factory(t) {
  return new (t || CalendarWeekViewHeaderComponent)();
};
CalendarWeekViewHeaderComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewHeaderComponent,
  selectors: [["mwl-calendar-week-view-header"]],
  inputs: {
    days: "days",
    locale: "locale",
    customTemplate: "customTemplate"
  },
  outputs: {
    dayHeaderClicked: "dayHeaderClicked",
    eventDropped: "eventDropped",
    dragEnter: "dragEnter"
  },
  decls: 3,
  vars: 9,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["role", "row", 1, "cal-day-headers"], ["class", "cal-header", "mwlDroppable", "", "dragOverClass", "cal-drag-over", "tabindex", "0", "role", "columnheader", 3, "cal-past", "cal-today", "cal-future", "cal-weekend", "ngClass", "mwlClick", "drop", "dragEnter", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", "dragOverClass", "cal-drag-over", "tabindex", "0", "role", "columnheader", 1, "cal-header", 3, "ngClass", "mwlClick", "drop", "dragEnter"]],
  template: function CalendarWeekViewHeaderComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewHeaderComponent_ng_template_0_Template, 2, 2, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewHeaderComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction6"](2, _c16, ctx.days, ctx.locale, ctx.dayHeaderClicked, ctx.eventDropped, ctx.dragEnter, ctx.trackByWeekDayHeaderDate));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DroppableDirective, ClickDirective, CalendarDatePipe],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewHeaderComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view-header',
      template: `
    <ng-template
      #defaultTemplate
      let-days="days"
      let-locale="locale"
      let-dayHeaderClicked="dayHeaderClicked"
      let-eventDropped="eventDropped"
      let-trackByWeekDayHeaderDate="trackByWeekDayHeaderDate"
      let-dragEnter="dragEnter"
    >
      <div class="cal-day-headers" role="row">
        <div
          class="cal-header"
          *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
          [class.cal-past]="day.isPast"
          [class.cal-today]="day.isToday"
          [class.cal-future]="day.isFuture"
          [class.cal-weekend]="day.isWeekend"
          [ngClass]="day.cssClass"
          (mwlClick)="dayHeaderClicked.emit({ day: day, sourceEvent: $event })"
          mwlDroppable
          dragOverClass="cal-drag-over"
          (drop)="
            eventDropped.emit({
              event: $event.dropData.event,
              newStart: day.date
            })
          "
          (dragEnter)="dragEnter.emit({ date: day.date })"
          tabindex="0"
          role="columnheader"
        >
          <b>{{ day.date | calendarDate : 'weekViewColumnHeader' : locale }}</b
          ><br />
          <span>{{
            day.date | calendarDate : 'weekViewColumnSubHeader' : locale
          }}</span>
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        days: days,
        locale: locale,
        dayHeaderClicked: dayHeaderClicked,
        eventDropped: eventDropped,
        dragEnter: dragEnter,
        trackByWeekDayHeaderDate: trackByWeekDayHeaderDate
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    days: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayHeaderClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventDropped: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragEnter: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarWeekViewEventComponent {
  constructor() {
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
}
CalendarWeekViewEventComponent.ɵfac = function CalendarWeekViewEventComponent_Factory(t) {
  return new (t || CalendarWeekViewEventComponent)();
};
CalendarWeekViewEventComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewEventComponent,
  selectors: [["mwl-calendar-week-view-event"]],
  inputs: {
    locale: "locale",
    weekEvent: "weekEvent",
    tooltipPlacement: "tooltipPlacement",
    tooltipAppendToBody: "tooltipAppendToBody",
    tooltipDisabled: "tooltipDisabled",
    tooltipDelay: "tooltipDelay",
    customTemplate: "customTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    tooltipTemplate: "tooltipTemplate",
    column: "column",
    daysInWeek: "daysInWeek"
  },
  outputs: {
    eventClicked: "eventClicked"
  },
  decls: 3,
  vars: 12,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["tabindex", "0", "role", "application", 1, "cal-event", 3, "ngStyle", "mwlCalendarTooltip", "tooltipPlacement", "tooltipEvent", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "mwlClick", "mwlKeydownEnter"], [3, "event", "customTemplate"], [3, "event", "customTemplate", "view"]],
  template: function CalendarWeekViewEventComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewEventComponent_ng_template_0_Template, 6, 27, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewEventComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunctionV"](2, _c18, [ctx.weekEvent, ctx.tooltipPlacement, ctx.eventClicked, ctx.tooltipTemplate, ctx.tooltipAppendToBody, ctx.tooltipDisabled, ctx.tooltipDelay, ctx.column, ctx.daysInWeek]));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgStyle, CalendarEventActionsComponent, CalendarEventTitleComponent, CalendarTooltipDirective, ClickDirective, KeydownEnterDirective, CalendarEventTitlePipe, CalendarA11yPipe],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewEventComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view-event',
      template: `
    <ng-template
      #defaultTemplate
      let-weekEvent="weekEvent"
      let-tooltipPlacement="tooltipPlacement"
      let-eventClicked="eventClicked"
      let-tooltipTemplate="tooltipTemplate"
      let-tooltipAppendToBody="tooltipAppendToBody"
      let-tooltipDisabled="tooltipDisabled"
      let-tooltipDelay="tooltipDelay"
      let-column="column"
      let-daysInWeek="daysInWeek"
    >
      <div
        class="cal-event"
        [ngStyle]="{
          color: weekEvent.event.color?.secondaryText,
          backgroundColor: weekEvent.event.color?.secondary,
          borderColor: weekEvent.event.color?.primary
        }"
        [mwlCalendarTooltip]="
          !tooltipDisabled
            ? (weekEvent.event.title
              | calendarEventTitle
                : (daysInWeek === 1 ? 'dayTooltip' : 'weekTooltip')
                : weekEvent.tempEvent || weekEvent.event)
            : ''
        "
        [tooltipPlacement]="tooltipPlacement"
        [tooltipEvent]="weekEvent.tempEvent || weekEvent.event"
        [tooltipTemplate]="tooltipTemplate"
        [tooltipAppendToBody]="tooltipAppendToBody"
        [tooltipDelay]="tooltipDelay"
        (mwlClick)="eventClicked.emit({ sourceEvent: $event })"
        (mwlKeydownEnter)="eventClicked.emit({ sourceEvent: $event })"
        tabindex="0"
        role="application"
        [attr.aria-label]="
          { event: weekEvent.tempEvent || weekEvent.event, locale: locale }
            | calendarA11y : 'eventDescription'
        "
      >
        <mwl-calendar-event-actions
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventActionsTemplate"
        >
        </mwl-calendar-event-actions>
        &ngsp;
        <mwl-calendar-event-title
          [event]="weekEvent.tempEvent || weekEvent.event"
          [customTemplate]="eventTitleTemplate"
          [view]="daysInWeek === 1 ? 'day' : 'week'"
        >
        </mwl-calendar-event-title>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        weekEvent: weekEvent,
        tooltipPlacement: tooltipPlacement,
        eventClicked: eventClicked,
        tooltipTemplate: tooltipTemplate,
        tooltipAppendToBody: tooltipAppendToBody,
        tooltipDisabled: tooltipDisabled,
        tooltipDelay: tooltipDelay,
        column: column,
        daysInWeek: daysInWeek
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekEvent: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDisabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    column: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarWeekViewHourSegmentComponent {}
CalendarWeekViewHourSegmentComponent.ɵfac = function CalendarWeekViewHourSegmentComponent_Factory(t) {
  return new (t || CalendarWeekViewHourSegmentComponent)();
};
CalendarWeekViewHourSegmentComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewHourSegmentComponent,
  selectors: [["mwl-calendar-week-view-hour-segment"]],
  inputs: {
    segment: "segment",
    segmentHeight: "segmentHeight",
    locale: "locale",
    isTimeLabel: "isTimeLabel",
    daysInWeek: "daysInWeek",
    customTemplate: "customTemplate"
  },
  decls: 3,
  vars: 8,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], [1, "cal-hour-segment", 3, "ngClass"], ["class", "cal-time", 4, "ngIf"], [1, "cal-time"]],
  template: function CalendarWeekViewHourSegmentComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewHourSegmentComponent_ng_template_0_Template, 3, 13, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewHourSegmentComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction5"](2, _c19, ctx.segment, ctx.locale, ctx.segmentHeight, ctx.isTimeLabel, ctx.daysInWeek));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, CalendarDatePipe, CalendarA11yPipe],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewHourSegmentComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view-hour-segment',
      template: `
    <ng-template
      #defaultTemplate
      let-segment="segment"
      let-locale="locale"
      let-segmentHeight="segmentHeight"
      let-isTimeLabel="isTimeLabel"
      let-daysInWeek="daysInWeek"
    >
      <div
        [attr.aria-hidden]="
          {}
            | calendarA11y
              : (daysInWeek === 1
                  ? 'hideDayHourSegment'
                  : 'hideWeekHourSegment')
        "
        class="cal-hour-segment"
        [style.height.px]="segmentHeight"
        [class.cal-hour-start]="segment.isStart"
        [class.cal-after-hour-start]="!segment.isStart"
        [ngClass]="segment.cssClass"
      >
        <div class="cal-time" *ngIf="isTimeLabel">
          {{
            segment.displayDate
              | calendarDate
                : (daysInWeek === 1 ? 'dayViewHour' : 'weekViewHour')
                : locale
          }}
        </div>
      </div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        segment: segment,
        locale: locale,
        segmentHeight: segmentHeight,
        isTimeLabel: isTimeLabel,
        daysInWeek: daysInWeek
      }"
    >
    </ng-template>
  `
    }]
  }], null, {
    segment: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    segmentHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    isTimeLabel: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();
class CalendarWeekViewCurrentTimeMarkerComponent {
  constructor(dateAdapter, zone) {
    this.dateAdapter = dateAdapter;
    this.zone = zone;
    this.columnDate$ = new rxjs__WEBPACK_IMPORTED_MODULE_11__.BehaviorSubject(undefined);
    this.marker$ = this.zone.onStable.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.switchMap)(() => (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.interval)(60 * 1000)), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.startWith)(0), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.switchMapTo)(this.columnDate$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.map)(columnDate => {
      const startOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayStartHour), this.dayStartMinute);
      const endOfDay = this.dateAdapter.setMinutes(this.dateAdapter.setHours(columnDate, this.dayEndHour), this.dayEndMinute);
      const hourHeightModifier = this.hourSegments * this.hourSegmentHeight / (this.hourDuration || 60);
      const now = new Date();
      return {
        isVisible: this.dateAdapter.isSameDay(columnDate, now) && now >= startOfDay && now <= endOfDay,
        top: this.dateAdapter.differenceInMinutes(now, startOfDay) * hourHeightModifier
      };
    }));
  }
  ngOnChanges(changes) {
    if (changes.columnDate) {
      this.columnDate$.next(changes.columnDate.currentValue);
    }
  }
}
CalendarWeekViewCurrentTimeMarkerComponent.ɵfac = function CalendarWeekViewCurrentTimeMarkerComponent_Factory(t) {
  return new (t || CalendarWeekViewCurrentTimeMarkerComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone));
};
CalendarWeekViewCurrentTimeMarkerComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewCurrentTimeMarkerComponent,
  selectors: [["mwl-calendar-week-view-current-time-marker"]],
  inputs: {
    columnDate: "columnDate",
    dayStartHour: "dayStartHour",
    dayStartMinute: "dayStartMinute",
    dayEndHour: "dayEndHour",
    dayEndMinute: "dayEndMinute",
    hourSegments: "hourSegments",
    hourDuration: "hourDuration",
    hourSegmentHeight: "hourSegmentHeight",
    customTemplate: "customTemplate"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]],
  decls: 5,
  vars: 14,
  consts: [["defaultTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "cal-current-time-marker", 3, "top", 4, "ngIf"], [1, "cal-current-time-marker"]],
  template: function CalendarWeekViewCurrentTimeMarkerComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](0, CalendarWeekViewCurrentTimeMarkerComponent_ng_template_0_Template, 1, 1, "ng-template", null, 0, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplateRefExtractor"]);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewCurrentTimeMarkerComponent_ng_template_2_Template, 0, 0, "ng-template", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "async");
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](4, "async");
    }
    if (rf & 2) {
      const _r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵreference"](1);
      let tmp_1_0;
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngTemplateOutlet", ctx.customTemplate || _r0)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpureFunction7"](6, _c20, ctx.columnDate, ctx.dayStartHour, ctx.dayStartMinute, ctx.dayEndHour, ctx.dayEndMinute, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](3, 2, ctx.marker$)) == null ? null : tmp_1_0.isVisible, (tmp_1_0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](4, 4, ctx.marker$)) == null ? null : tmp_1_0.top));
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, _angular_common__WEBPACK_IMPORTED_MODULE_6__.AsyncPipe],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewCurrentTimeMarkerComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view-current-time-marker',
      template: `
    <ng-template
      #defaultTemplate
      let-columnDate="columnDate"
      let-dayStartHour="dayStartHour"
      let-dayStartMinute="dayStartMinute"
      let-dayEndHour="dayEndHour"
      let-dayEndMinute="dayEndMinute"
      let-isVisible="isVisible"
      let-topPx="topPx"
    >
      <div
        class="cal-current-time-marker"
        *ngIf="isVisible"
        [style.top.px]="topPx"
      ></div>
    </ng-template>
    <ng-template
      [ngTemplateOutlet]="customTemplate || defaultTemplate"
      [ngTemplateOutletContext]="{
        columnDate: columnDate,
        dayStartHour: dayStartHour,
        dayStartMinute: dayStartMinute,
        dayEndHour: dayEndHour,
        dayEndMinute: dayEndMinute,
        isVisible: (marker$ | async)?.isVisible,
        topPx: (marker$ | async)?.top
      }"
    >
    </ng-template>
  `
    }]
  }], function () {
    return [{
      type: DateAdapter
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone
    }];
  }, {
    columnDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegments: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourDuration: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    customTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }]
  });
})();

/**
 * Shows all events on a given week. Example usage:
 *
 * ```typescript
 * <mwl-calendar-week-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-week-view>
 * ```
 */
class CalendarWeekViewComponent {
  /**
   * @hidden
   */
  constructor(cdr, utils, locale, dateAdapter, element) {
    this.cdr = cdr;
    this.utils = utils;
    this.dateAdapter = dateAdapter;
    this.element = element;
    /**
     * An array of events to display on view
     * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    this.events = [];
    /**
     * An array of day indexes (0 = sunday, 1 = monday etc) that will be hidden on the view
     */
    this.excludeDays = [];
    /**
     * The placement of the event tooltip
     */
    this.tooltipPlacement = 'auto';
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    this.tooltipAppendToBody = true;
    /**
     * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
     * will be displayed immediately.
     */
    this.tooltipDelay = null;
    /**
     * The precision to display events.
     * `days` will round event start and end dates to the nearest day and `minutes` will not do this rounding
     */
    this.precision = 'days';
    /**
     * Whether to snap events to a grid when dragging
     */
    this.snapDraggedEvents = true;
    /**
     * The number of segments in an hour. Must divide equally into 60.
     */
    this.hourSegments = 2;
    /**
     * The height in pixels of each hour segment
     */
    this.hourSegmentHeight = 30;
    /**
     * The minimum height in pixels of each event
     */
    this.minimumEventHeight = 30;
    /**
     * The day start hours in 24 hour time. Must be 0-23
     */
    this.dayStartHour = 0;
    /**
     * The day start minutes. Must be 0-59
     */
    this.dayStartMinute = 0;
    /**
     * The day end hours in 24 hour time. Must be 0-23
     */
    this.dayEndHour = 23;
    /**
     * The day end minutes. Must be 0-59
     */
    this.dayEndMinute = 59;
    /**
     * Called when a header week day is clicked. Adding a `cssClass` property on `$event.day` will add that class to the header element
     */
    this.dayHeaderClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an event title is clicked
     */
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an event is resized or dragged and dropped
     */
    this.eventTimesChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * An output that will be called before the view is rendered for the current week.
     * If you add the `cssClass` property to a day in the header it will add that class to the cell element in the template
     */
    this.beforeViewRender = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an hour segment is clicked
     */
    this.hourSegmentClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * @hidden
     */
    this.allDayEventResizes = new Map();
    /**
     * @hidden
     */
    this.timeEventResizes = new Map();
    /**
     * @hidden
     */
    this.eventDragEnterByType = {
      allDay: 0,
      time: 0
    };
    /**
     * @hidden
     */
    this.dragActive = false;
    /**
     * @hidden
     */
    this.dragAlreadyMoved = false;
    /**
     * @hidden
     */
    this.calendarId = Symbol('angular calendar week view id');
    /**
     * @hidden
     */
    this.rtl = false;
    /**
     * @hidden
     */
    this.trackByWeekDayHeaderDate = trackByWeekDayHeaderDate;
    /**
     * @hidden
     */
    this.trackByHourSegment = trackByHourSegment;
    /**
     * @hidden
     */
    this.trackByHour = trackByHour;
    /**
     * @hidden
     */
    this.trackByWeekAllDayEvent = trackByWeekAllDayEvent;
    /**
     * @hidden
     */
    this.trackByWeekTimeEvent = trackByWeekTimeEvent;
    /**
     * @hidden
     */
    this.trackByHourColumn = (index, column) => column.hours[0] ? column.hours[0].segments[0].date.toISOString() : column;
    /**
     * @hidden
     */
    this.trackById = (index, row) => row.id;
    this.locale = locale;
  }
  /**
   * @hidden
   */
  ngOnInit() {
    if (this.refresh) {
      this.refreshSubscription = this.refresh.subscribe(() => {
        this.refreshAll();
        this.cdr.markForCheck();
      });
    }
  }
  /**
   * @hidden
   */
  ngOnChanges(changes) {
    const refreshHeader = changes.viewDate || changes.excludeDays || changes.weekendDays || changes.daysInWeek || changes.weekStartsOn;
    const refreshBody = changes.viewDate || changes.dayStartHour || changes.dayStartMinute || changes.dayEndHour || changes.dayEndMinute || changes.hourSegments || changes.hourDuration || changes.weekStartsOn || changes.weekendDays || changes.excludeDays || changes.hourSegmentHeight || changes.events || changes.daysInWeek || changes.minimumEventHeight;
    if (refreshHeader) {
      this.refreshHeader();
    }
    if (changes.events) {
      validateEvents(this.events);
    }
    if (refreshBody) {
      this.refreshBody();
    }
    if (refreshHeader || refreshBody) {
      this.emitBeforeViewRender();
    }
  }
  /**
   * @hidden
   */
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }
  /**
   * @hidden
   */
  ngAfterViewInit() {
    this.rtl = typeof window !== 'undefined' && getComputedStyle(this.element.nativeElement).direction === 'rtl';
    this.cdr.detectChanges();
  }
  /**
   * @hidden
   */
  timeEventResizeStarted(eventsContainer, timeEvent, resizeEvent) {
    this.timeEventResizes.set(timeEvent.event, resizeEvent);
    this.resizeStarted(eventsContainer, timeEvent);
  }
  /**
   * @hidden
   */
  timeEventResizing(timeEvent, resizeEvent) {
    this.timeEventResizes.set(timeEvent.event, resizeEvent);
    const adjustedEvents = new Map();
    const tempEvents = [...this.events];
    this.timeEventResizes.forEach((lastResizeEvent, event) => {
      const newEventDates = this.getTimeEventResizedDates(event, lastResizeEvent);
      const adjustedEvent = {
        ...event,
        ...newEventDates
      };
      adjustedEvents.set(adjustedEvent, event);
      const eventIndex = tempEvents.indexOf(event);
      tempEvents[eventIndex] = adjustedEvent;
    });
    this.restoreOriginalEvents(tempEvents, adjustedEvents, true);
  }
  /**
   * @hidden
   */
  timeEventResizeEnded(timeEvent) {
    this.view = this.getWeekView(this.events);
    const lastResizeEvent = this.timeEventResizes.get(timeEvent.event);
    if (lastResizeEvent) {
      this.timeEventResizes.delete(timeEvent.event);
      const newEventDates = this.getTimeEventResizedDates(timeEvent.event, lastResizeEvent);
      this.eventTimesChanged.emit({
        newStart: newEventDates.start,
        newEnd: newEventDates.end,
        event: timeEvent.event,
        type: CalendarEventTimesChangedEventType.Resize
      });
    }
  }
  /**
   * @hidden
   */
  allDayEventResizeStarted(allDayEventsContainer, allDayEvent, resizeEvent) {
    this.allDayEventResizes.set(allDayEvent, {
      originalOffset: allDayEvent.offset,
      originalSpan: allDayEvent.span,
      edge: typeof resizeEvent.edges.left !== 'undefined' ? 'left' : 'right'
    });
    this.resizeStarted(allDayEventsContainer, allDayEvent, this.getDayColumnWidth(allDayEventsContainer));
  }
  /**
   * @hidden
   */
  allDayEventResizing(allDayEvent, resizeEvent, dayWidth) {
    const currentResize = this.allDayEventResizes.get(allDayEvent);
    const modifier = this.rtl ? -1 : 1;
    if (typeof resizeEvent.edges.left !== 'undefined') {
      const diff = Math.round(+resizeEvent.edges.left / dayWidth) * modifier;
      allDayEvent.offset = currentResize.originalOffset + diff;
      allDayEvent.span = currentResize.originalSpan - diff;
    } else if (typeof resizeEvent.edges.right !== 'undefined') {
      const diff = Math.round(+resizeEvent.edges.right / dayWidth) * modifier;
      allDayEvent.span = currentResize.originalSpan + diff;
    }
  }
  /**
   * @hidden
   */
  allDayEventResizeEnded(allDayEvent) {
    const currentResize = this.allDayEventResizes.get(allDayEvent);
    if (currentResize) {
      const allDayEventResizingBeforeStart = currentResize.edge === 'left';
      let daysDiff;
      if (allDayEventResizingBeforeStart) {
        daysDiff = allDayEvent.offset - currentResize.originalOffset;
      } else {
        daysDiff = allDayEvent.span - currentResize.originalSpan;
      }
      allDayEvent.offset = currentResize.originalOffset;
      allDayEvent.span = currentResize.originalSpan;
      const newDates = this.getAllDayEventResizedDates(allDayEvent.event, daysDiff, allDayEventResizingBeforeStart);
      this.eventTimesChanged.emit({
        newStart: newDates.start,
        newEnd: newDates.end,
        event: allDayEvent.event,
        type: CalendarEventTimesChangedEventType.Resize
      });
      this.allDayEventResizes.delete(allDayEvent);
    }
  }
  /**
   * @hidden
   */
  getDayColumnWidth(eventRowContainer) {
    return Math.floor(eventRowContainer.offsetWidth / this.days.length);
  }
  /**
   * @hidden
   */
  dateDragEnter(date) {
    this.lastDragEnterDate = date;
  }
  /**
   * @hidden
   */
  eventDropped(dropEvent, date, allDay) {
    if (shouldFireDroppedEvent(dropEvent, date, allDay, this.calendarId) && this.lastDragEnterDate.getTime() === date.getTime() && (!this.snapDraggedEvents || dropEvent.dropData.event !== this.lastDraggedEvent)) {
      this.eventTimesChanged.emit({
        type: CalendarEventTimesChangedEventType.Drop,
        event: dropEvent.dropData.event,
        newStart: date,
        allDay
      });
    }
    this.lastDraggedEvent = null;
  }
  /**
   * @hidden
   */
  dragEnter(type) {
    this.eventDragEnterByType[type]++;
  }
  /**
   * @hidden
   */
  dragLeave(type) {
    this.eventDragEnterByType[type]--;
  }
  /**
   * @hidden
   */
  dragStarted(eventsContainerElement, eventElement, event, useY) {
    this.dayColumnWidth = this.getDayColumnWidth(eventsContainerElement);
    const dragHelper = new CalendarDragHelper(eventsContainerElement, eventElement);
    this.validateDrag = ({
      x,
      y,
      transform
    }) => {
      const isAllowed = this.allDayEventResizes.size === 0 && this.timeEventResizes.size === 0 && dragHelper.validateDrag({
        x,
        y,
        snapDraggedEvents: this.snapDraggedEvents,
        dragAlreadyMoved: this.dragAlreadyMoved,
        transform
      });
      if (isAllowed && this.validateEventTimesChanged) {
        const newEventTimes = this.getDragMovedEventTimes(event, {
          x,
          y
        }, this.dayColumnWidth, useY);
        return this.validateEventTimesChanged({
          type: CalendarEventTimesChangedEventType.Drag,
          event: event.event,
          newStart: newEventTimes.start,
          newEnd: newEventTimes.end
        });
      }
      return isAllowed;
    };
    this.dragActive = true;
    this.dragAlreadyMoved = false;
    this.lastDraggedEvent = null;
    this.eventDragEnterByType = {
      allDay: 0,
      time: 0
    };
    if (!this.snapDraggedEvents && useY) {
      this.view.hourColumns.forEach(column => {
        const linkedEvent = column.events.find(columnEvent => columnEvent.event === event.event && columnEvent !== event);
        // hide any linked events while dragging
        if (linkedEvent) {
          linkedEvent.width = 0;
          linkedEvent.height = 0;
        }
      });
    }
    this.cdr.markForCheck();
  }
  /**
   * @hidden
   */
  dragMove(dayEvent, dragEvent) {
    const newEventTimes = this.getDragMovedEventTimes(dayEvent, dragEvent, this.dayColumnWidth, true);
    const originalEvent = dayEvent.event;
    const adjustedEvent = {
      ...originalEvent,
      ...newEventTimes
    };
    const tempEvents = this.events.map(event => {
      if (event === originalEvent) {
        return adjustedEvent;
      }
      return event;
    });
    this.restoreOriginalEvents(tempEvents, new Map([[adjustedEvent, originalEvent]]), this.snapDraggedEvents);
    this.dragAlreadyMoved = true;
  }
  /**
   * @hidden
   */
  allDayEventDragMove() {
    this.dragAlreadyMoved = true;
  }
  /**
   * @hidden
   */
  dragEnded(weekEvent, dragEndEvent, dayWidth, useY = false) {
    this.view = this.getWeekView(this.events);
    this.dragActive = false;
    this.validateDrag = null;
    const {
      start,
      end
    } = this.getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY);
    if ((this.snapDraggedEvents || this.eventDragEnterByType[useY ? 'time' : 'allDay'] > 0) && isDraggedWithinPeriod(start, end, this.view.period)) {
      this.lastDraggedEvent = weekEvent.event;
      this.eventTimesChanged.emit({
        newStart: start,
        newEnd: end,
        event: weekEvent.event,
        type: CalendarEventTimesChangedEventType.Drag,
        allDay: !useY
      });
    }
  }
  refreshHeader() {
    this.days = this.utils.getWeekViewHeader({
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      weekendDays: this.weekendDays,
      ...getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)
    });
  }
  refreshBody() {
    this.view = this.getWeekView(this.events);
  }
  refreshAll() {
    this.refreshHeader();
    this.refreshBody();
    this.emitBeforeViewRender();
  }
  emitBeforeViewRender() {
    if (this.days && this.view) {
      this.beforeViewRender.emit({
        header: this.days,
        ...this.view
      });
    }
  }
  getWeekView(events) {
    return this.utils.getWeekView({
      events,
      viewDate: this.viewDate,
      weekStartsOn: this.weekStartsOn,
      excluded: this.excludeDays,
      precision: this.precision,
      absolutePositionedEvents: true,
      hourSegments: this.hourSegments,
      hourDuration: this.hourDuration,
      dayStart: {
        hour: this.dayStartHour,
        minute: this.dayStartMinute
      },
      dayEnd: {
        hour: this.dayEndHour,
        minute: this.dayEndMinute
      },
      segmentHeight: this.hourSegmentHeight,
      weekendDays: this.weekendDays,
      minimumEventHeight: this.minimumEventHeight,
      ...getWeekViewPeriod(this.dateAdapter, this.viewDate, this.weekStartsOn, this.excludeDays, this.daysInWeek)
    });
  }
  getDragMovedEventTimes(weekEvent, dragEndEvent, dayWidth, useY) {
    const daysDragged = roundToNearest(dragEndEvent.x, dayWidth) / dayWidth * (this.rtl ? -1 : 1);
    const minutesMoved = useY ? getMinutesMoved(dragEndEvent.y, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize, this.hourDuration) : 0;
    const start = this.dateAdapter.addMinutes(addDaysWithExclusions(this.dateAdapter, weekEvent.event.start, daysDragged, this.excludeDays), minutesMoved);
    let end;
    if (weekEvent.event.end) {
      end = this.dateAdapter.addMinutes(addDaysWithExclusions(this.dateAdapter, weekEvent.event.end, daysDragged, this.excludeDays), minutesMoved);
    }
    return {
      start,
      end
    };
  }
  restoreOriginalEvents(tempEvents, adjustedEvents, snapDraggedEvents = true) {
    const previousView = this.view;
    if (snapDraggedEvents) {
      this.view = this.getWeekView(tempEvents);
    }
    const adjustedEventsArray = tempEvents.filter(event => adjustedEvents.has(event));
    this.view.hourColumns.forEach((column, columnIndex) => {
      previousView.hourColumns[columnIndex].hours.forEach((hour, hourIndex) => {
        hour.segments.forEach((segment, segmentIndex) => {
          column.hours[hourIndex].segments[segmentIndex].cssClass = segment.cssClass;
        });
      });
      adjustedEventsArray.forEach(adjustedEvent => {
        const originalEvent = adjustedEvents.get(adjustedEvent);
        const existingColumnEvent = column.events.find(columnEvent => columnEvent.event === (snapDraggedEvents ? adjustedEvent : originalEvent));
        if (existingColumnEvent) {
          // restore the original event so trackBy kicks in and the dom isn't changed
          existingColumnEvent.event = originalEvent;
          existingColumnEvent['tempEvent'] = adjustedEvent;
          if (!snapDraggedEvents) {
            existingColumnEvent.height = 0;
            existingColumnEvent.width = 0;
          }
        } else {
          // add a dummy event to the drop so if the event was removed from the original column the drag doesn't end early
          const event = {
            event: originalEvent,
            left: 0,
            top: 0,
            height: 0,
            width: 0,
            startsBeforeDay: false,
            endsAfterDay: false,
            tempEvent: adjustedEvent
          };
          column.events.push(event);
        }
      });
    });
    adjustedEvents.clear();
  }
  getTimeEventResizedDates(calendarEvent, resizeEvent) {
    const newEventDates = {
      start: calendarEvent.start,
      end: getDefaultEventEnd(this.dateAdapter, calendarEvent, this.minimumEventHeight)
    };
    const {
      end,
      ...eventWithoutEnd
    } = calendarEvent;
    const smallestResizes = {
      start: this.dateAdapter.addMinutes(newEventDates.end, this.minimumEventHeight * -1),
      end: getDefaultEventEnd(this.dateAdapter, eventWithoutEnd, this.minimumEventHeight)
    };
    const modifier = this.rtl ? -1 : 1;
    if (typeof resizeEvent.edges.left !== 'undefined') {
      const daysDiff = Math.round(+resizeEvent.edges.left / this.dayColumnWidth) * modifier;
      const newStart = addDaysWithExclusions(this.dateAdapter, newEventDates.start, daysDiff, this.excludeDays);
      if (newStart < smallestResizes.start) {
        newEventDates.start = newStart;
      } else {
        newEventDates.start = smallestResizes.start;
      }
    } else if (typeof resizeEvent.edges.right !== 'undefined') {
      const daysDiff = Math.round(+resizeEvent.edges.right / this.dayColumnWidth) * modifier;
      const newEnd = addDaysWithExclusions(this.dateAdapter, newEventDates.end, daysDiff, this.excludeDays);
      if (newEnd > smallestResizes.end) {
        newEventDates.end = newEnd;
      } else {
        newEventDates.end = smallestResizes.end;
      }
    }
    if (typeof resizeEvent.edges.top !== 'undefined') {
      const minutesMoved = getMinutesMoved(resizeEvent.edges.top, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize, this.hourDuration);
      const newStart = this.dateAdapter.addMinutes(newEventDates.start, minutesMoved);
      if (newStart < smallestResizes.start) {
        newEventDates.start = newStart;
      } else {
        newEventDates.start = smallestResizes.start;
      }
    } else if (typeof resizeEvent.edges.bottom !== 'undefined') {
      const minutesMoved = getMinutesMoved(resizeEvent.edges.bottom, this.hourSegments, this.hourSegmentHeight, this.eventSnapSize, this.hourDuration);
      const newEnd = this.dateAdapter.addMinutes(newEventDates.end, minutesMoved);
      if (newEnd > smallestResizes.end) {
        newEventDates.end = newEnd;
      } else {
        newEventDates.end = smallestResizes.end;
      }
    }
    return newEventDates;
  }
  resizeStarted(eventsContainer, event, dayWidth) {
    this.dayColumnWidth = this.getDayColumnWidth(eventsContainer);
    const resizeHelper = new CalendarResizeHelper(eventsContainer, dayWidth, this.rtl);
    this.validateResize = ({
      rectangle,
      edges
    }) => {
      const isWithinBoundary = resizeHelper.validateResize({
        rectangle: {
          ...rectangle
        },
        edges
      });
      if (isWithinBoundary && this.validateEventTimesChanged) {
        let newEventDates;
        if (!dayWidth) {
          newEventDates = this.getTimeEventResizedDates(event.event, {
            rectangle,
            edges
          });
        } else {
          const modifier = this.rtl ? -1 : 1;
          if (typeof edges.left !== 'undefined') {
            const diff = Math.round(+edges.left / dayWidth) * modifier;
            newEventDates = this.getAllDayEventResizedDates(event.event, diff, !this.rtl);
          } else {
            const diff = Math.round(+edges.right / dayWidth) * modifier;
            newEventDates = this.getAllDayEventResizedDates(event.event, diff, this.rtl);
          }
        }
        return this.validateEventTimesChanged({
          type: CalendarEventTimesChangedEventType.Resize,
          event: event.event,
          newStart: newEventDates.start,
          newEnd: newEventDates.end
        });
      }
      return isWithinBoundary;
    };
    this.cdr.markForCheck();
  }
  /**
   * @hidden
   */
  getAllDayEventResizedDates(event, daysDiff, beforeStart) {
    let start = event.start;
    let end = event.end || event.start;
    if (beforeStart) {
      start = addDaysWithExclusions(this.dateAdapter, start, daysDiff, this.excludeDays);
    } else {
      end = addDaysWithExclusions(this.dateAdapter, end, daysDiff, this.excludeDays);
    }
    return {
      start,
      end
    };
  }
}
CalendarWeekViewComponent.ɵfac = function CalendarWeekViewComponent_Factory(t) {
  return new (t || CalendarWeekViewComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](CalendarUtils), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DateAdapter), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef));
};
CalendarWeekViewComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarWeekViewComponent,
  selectors: [["mwl-calendar-week-view"]],
  inputs: {
    viewDate: "viewDate",
    events: "events",
    excludeDays: "excludeDays",
    refresh: "refresh",
    locale: "locale",
    tooltipPlacement: "tooltipPlacement",
    tooltipTemplate: "tooltipTemplate",
    tooltipAppendToBody: "tooltipAppendToBody",
    tooltipDelay: "tooltipDelay",
    weekStartsOn: "weekStartsOn",
    headerTemplate: "headerTemplate",
    eventTemplate: "eventTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    precision: "precision",
    weekendDays: "weekendDays",
    snapDraggedEvents: "snapDraggedEvents",
    hourSegments: "hourSegments",
    hourDuration: "hourDuration",
    hourSegmentHeight: "hourSegmentHeight",
    minimumEventHeight: "minimumEventHeight",
    dayStartHour: "dayStartHour",
    dayStartMinute: "dayStartMinute",
    dayEndHour: "dayEndHour",
    dayEndMinute: "dayEndMinute",
    hourSegmentTemplate: "hourSegmentTemplate",
    eventSnapSize: "eventSnapSize",
    allDayEventsLabelTemplate: "allDayEventsLabelTemplate",
    daysInWeek: "daysInWeek",
    currentTimeMarkerTemplate: "currentTimeMarkerTemplate",
    validateEventTimesChanged: "validateEventTimesChanged",
    resizeCursors: "resizeCursors"
  },
  outputs: {
    dayHeaderClicked: "dayHeaderClicked",
    eventClicked: "eventClicked",
    eventTimesChanged: "eventTimesChanged",
    beforeViewRender: "beforeViewRender",
    hourSegmentClicked: "hourSegmentClicked"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]],
  decls: 8,
  vars: 9,
  consts: [["role", "grid", 1, "cal-week-view"], [3, "days", "locale", "customTemplate", "dayHeaderClicked", "eventDropped", "dragEnter"], ["class", "cal-all-day-events", "mwlDroppable", "", 3, "dragEnter", "dragLeave", 4, "ngIf"], ["mwlDroppable", "", 1, "cal-time-events", 3, "dragEnter", "dragLeave"], ["class", "cal-time-label-column", 4, "ngIf"], [1, "cal-day-columns"], ["dayColumns", ""], ["class", "cal-day-column", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", 1, "cal-all-day-events", 3, "dragEnter", "dragLeave"], ["allDayEventsContainer", ""], [1, "cal-time-label-column"], [4, "ngTemplateOutlet"], ["class", "cal-day-column", "mwlDroppable", "", "dragOverClass", "cal-drag-over", 3, "drop", "dragEnter", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "cal-events-row", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", "dragOverClass", "cal-drag-over", 1, "cal-day-column", 3, "drop", "dragEnter"], [1, "cal-events-row"], ["eventRowContainer", ""], ["class", "cal-event-container", "mwlResizable", "", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "cal-draggable", "cal-starts-within-week", "cal-ends-within-week", "ngClass", "width", "marginLeft", "marginRight", "resizeCursors", "resizeSnapGrid", "validateResize", "dropData", "dragAxis", "dragSnapGrid", "validateDrag", "touchStartLongPress", "resizeStart", "resizing", "resizeEnd", "dragStart", "dragging", "dragEnd", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlResizable", "", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 1, "cal-event-container", 3, "ngClass", "resizeCursors", "resizeSnapGrid", "validateResize", "dropData", "dragAxis", "dragSnapGrid", "validateDrag", "touchStartLongPress", "resizeStart", "resizing", "resizeEnd", "dragStart", "dragging", "dragEnd"], ["event", ""], ["class", "cal-resize-handle cal-resize-handle-before-start", "mwlResizeHandle", "", 3, "resizeEdges", 4, "ngIf"], [3, "locale", "weekEvent", "tooltipPlacement", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "customTemplate", "eventTitleTemplate", "eventActionsTemplate", "daysInWeek", "eventClicked"], ["class", "cal-resize-handle cal-resize-handle-after-end", "mwlResizeHandle", "", 3, "resizeEdges", 4, "ngIf"], ["mwlResizeHandle", "", 1, "cal-resize-handle", "cal-resize-handle-before-start", 3, "resizeEdges"], ["mwlResizeHandle", "", 1, "cal-resize-handle", "cal-resize-handle-after-end", 3, "resizeEdges"], ["class", "cal-hour", 3, "cal-hour-odd", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "cal-hour"], [3, "height", "segment", "segmentHeight", "locale", "customTemplate", "isTimeLabel", "daysInWeek", 4, "ngFor", "ngForOf", "ngForTrackBy"], [3, "segment", "segmentHeight", "locale", "customTemplate", "isTimeLabel", "daysInWeek"], [1, "cal-day-column"], [3, "columnDate", "dayStartHour", "dayStartMinute", "dayEndHour", "dayEndMinute", "hourSegments", "hourDuration", "hourSegmentHeight", "customTemplate"], [1, "cal-events-container"], ["class", "cal-event-container", "mwlResizable", "", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 3, "cal-draggable", "cal-starts-within-day", "cal-ends-within-day", "ngClass", "hidden", "top", "height", "left", "width", "resizeCursors", "resizeSnapGrid", "validateResize", "allowNegativeResizes", "dropData", "dragAxis", "dragSnapGrid", "touchStartLongPress", "ghostDragEnabled", "ghostElementTemplate", "validateDrag", "resizeStart", "resizing", "resizeEnd", "dragStart", "dragging", "dragEnd", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlResizable", "", "mwlDraggable", "", "dragActiveClass", "cal-drag-active", 1, "cal-event-container", 3, "ngClass", "hidden", "resizeCursors", "resizeSnapGrid", "validateResize", "allowNegativeResizes", "dropData", "dragAxis", "dragSnapGrid", "touchStartLongPress", "ghostDragEnabled", "ghostElementTemplate", "validateDrag", "resizeStart", "resizing", "resizeEnd", "dragStart", "dragging", "dragEnd"], [3, "ngTemplateOutlet"], ["weekEventTemplate", ""], [3, "locale", "weekEvent", "tooltipPlacement", "tooltipTemplate", "tooltipAppendToBody", "tooltipDisabled", "tooltipDelay", "customTemplate", "eventTitleTemplate", "eventActionsTemplate", "column", "daysInWeek", "eventClicked"], ["mwlDroppable", "", "dragActiveClass", "cal-drag-active", 3, "height", "segment", "segmentHeight", "locale", "customTemplate", "daysInWeek", "clickListenerDisabled", "dragOverClass", "isTimeLabel", "mwlClick", "drop", "dragEnter", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["mwlDroppable", "", "dragActiveClass", "cal-drag-active", 3, "segment", "segmentHeight", "locale", "customTemplate", "daysInWeek", "clickListenerDisabled", "dragOverClass", "isTimeLabel", "mwlClick", "drop", "dragEnter"]],
  template: function CalendarWeekViewComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "mwl-calendar-week-view-header", 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("dayHeaderClicked", function CalendarWeekViewComponent_Template_mwl_calendar_week_view_header_dayHeaderClicked_1_listener($event) {
        return ctx.dayHeaderClicked.emit($event);
      })("eventDropped", function CalendarWeekViewComponent_Template_mwl_calendar_week_view_header_eventDropped_1_listener($event) {
        return ctx.eventDropped({
          dropData: $event
        }, $event.newStart, true);
      })("dragEnter", function CalendarWeekViewComponent_Template_mwl_calendar_week_view_header_dragEnter_1_listener($event) {
        return ctx.dateDragEnter($event.date);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, CalendarWeekViewComponent_div_2_Template, 7, 5, "div", 2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](3, "div", 3);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("dragEnter", function CalendarWeekViewComponent_Template_div_dragEnter_3_listener() {
        return ctx.dragEnter("time");
      })("dragLeave", function CalendarWeekViewComponent_Template_div_dragLeave_3_listener() {
        return ctx.dragLeave("time");
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](4, CalendarWeekViewComponent_div_4_Template, 2, 2, "div", 4);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "div", 5, 6);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](7, CalendarWeekViewComponent_div_7_Template, 5, 13, "div", 7);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("days", ctx.days)("locale", ctx.locale)("customTemplate", ctx.headerTemplate);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.view.allDayEventRows.length > 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.view.hourColumns.length > 0 && ctx.daysInWeek !== 1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵclassProp"]("cal-resize-active", ctx.timeEventResizes.size > 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.view.hourColumns)("ngForTrackBy", ctx.trackByHourColumn);
    }
  },
  dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgTemplateOutlet, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableDirective, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizeHandleDirective, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DraggableDirective, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DroppableDirective, ClickDirective, CalendarWeekViewHeaderComponent, CalendarWeekViewEventComponent, CalendarWeekViewHourSegmentComponent, CalendarWeekViewCurrentTimeMarkerComponent],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekViewComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-week-view',
      template: `
    <div class="cal-week-view" role="grid">
      <mwl-calendar-week-view-header
        [days]="days"
        [locale]="locale"
        [customTemplate]="headerTemplate"
        (dayHeaderClicked)="dayHeaderClicked.emit($event)"
        (eventDropped)="
          eventDropped({ dropData: $event }, $event.newStart, true)
        "
        (dragEnter)="dateDragEnter($event.date)"
      >
      </mwl-calendar-week-view-header>
      <div
        class="cal-all-day-events"
        #allDayEventsContainer
        *ngIf="view.allDayEventRows.length > 0"
        mwlDroppable
        (dragEnter)="dragEnter('allDay')"
        (dragLeave)="dragLeave('allDay')"
      >
        <div class="cal-day-columns">
          <div class="cal-time-label-column">
            <ng-container
              *ngTemplateOutlet="allDayEventsLabelTemplate"
            ></ng-container>
          </div>
          <div
            class="cal-day-column"
            *ngFor="let day of days; trackBy: trackByWeekDayHeaderDate"
            mwlDroppable
            dragOverClass="cal-drag-over"
            (drop)="eventDropped($event, day.date, true)"
            (dragEnter)="dateDragEnter(day.date)"
          ></div>
        </div>
        <div
          *ngFor="let eventRow of view.allDayEventRows; trackBy: trackById"
          #eventRowContainer
          class="cal-events-row"
        >
          <div
            *ngFor="
              let allDayEvent of eventRow.row;
              trackBy: trackByWeekAllDayEvent
            "
            #event
            class="cal-event-container"
            [class.cal-draggable]="
              allDayEvent.event.draggable && allDayEventResizes.size === 0
            "
            [class.cal-starts-within-week]="!allDayEvent.startsBeforeWeek"
            [class.cal-ends-within-week]="!allDayEvent.endsAfterWeek"
            [ngClass]="allDayEvent.event?.cssClass"
            [style.width.%]="(100 / days.length) * allDayEvent.span"
            [style.marginLeft.%]="
              rtl ? null : (100 / days.length) * allDayEvent.offset
            "
            [style.marginRight.%]="
              rtl ? (100 / days.length) * allDayEvent.offset : null
            "
            mwlResizable
            [resizeCursors]="resizeCursors"
            [resizeSnapGrid]="{ left: dayColumnWidth, right: dayColumnWidth }"
            [validateResize]="validateResize"
            (resizeStart)="
              allDayEventResizeStarted(eventRowContainer, allDayEvent, $event)
            "
            (resizing)="
              allDayEventResizing(allDayEvent, $event, dayColumnWidth)
            "
            (resizeEnd)="allDayEventResizeEnded(allDayEvent)"
            mwlDraggable
            dragActiveClass="cal-drag-active"
            [dropData]="{ event: allDayEvent.event, calendarId: calendarId }"
            [dragAxis]="{
              x: allDayEvent.event.draggable && allDayEventResizes.size === 0,
              y:
                !snapDraggedEvents &&
                allDayEvent.event.draggable &&
                allDayEventResizes.size === 0
            }"
            [dragSnapGrid]="snapDraggedEvents ? { x: dayColumnWidth } : {}"
            [validateDrag]="validateDrag"
            [touchStartLongPress]="{ delay: 300, delta: 30 }"
            (dragStart)="
              dragStarted(eventRowContainer, event, allDayEvent, false)
            "
            (dragging)="allDayEventDragMove()"
            (dragEnd)="dragEnded(allDayEvent, $event, dayColumnWidth)"
          >
            <div
              class="cal-resize-handle cal-resize-handle-before-start"
              *ngIf="
                allDayEvent.event?.resizable?.beforeStart &&
                !allDayEvent.startsBeforeWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ left: true }"
            ></div>
            <mwl-calendar-week-view-event
              [locale]="locale"
              [weekEvent]="allDayEvent"
              [tooltipPlacement]="tooltipPlacement"
              [tooltipTemplate]="tooltipTemplate"
              [tooltipAppendToBody]="tooltipAppendToBody"
              [tooltipDelay]="tooltipDelay"
              [customTemplate]="eventTemplate"
              [eventTitleTemplate]="eventTitleTemplate"
              [eventActionsTemplate]="eventActionsTemplate"
              [daysInWeek]="daysInWeek"
              (eventClicked)="
                eventClicked.emit({
                  event: allDayEvent.event,
                  sourceEvent: $event.sourceEvent
                })
              "
            >
            </mwl-calendar-week-view-event>
            <div
              class="cal-resize-handle cal-resize-handle-after-end"
              *ngIf="
                allDayEvent.event?.resizable?.afterEnd &&
                !allDayEvent.endsAfterWeek
              "
              mwlResizeHandle
              [resizeEdges]="{ right: true }"
            ></div>
          </div>
        </div>
      </div>
      <div
        class="cal-time-events"
        mwlDroppable
        (dragEnter)="dragEnter('time')"
        (dragLeave)="dragLeave('time')"
      >
        <div
          class="cal-time-label-column"
          *ngIf="view.hourColumns.length > 0 && daysInWeek !== 1"
        >
          <div
            *ngFor="
              let hour of view.hourColumns[0].hours;
              trackBy: trackByHour;
              let odd = odd
            "
            class="cal-hour"
            [class.cal-hour-odd]="odd"
          >
            <mwl-calendar-week-view-hour-segment
              *ngFor="let segment of hour.segments; trackBy: trackByHourSegment"
              [style.height.px]="hourSegmentHeight"
              [segment]="segment"
              [segmentHeight]="hourSegmentHeight"
              [locale]="locale"
              [customTemplate]="hourSegmentTemplate"
              [isTimeLabel]="true"
              [daysInWeek]="daysInWeek"
            >
            </mwl-calendar-week-view-hour-segment>
          </div>
        </div>
        <div
          class="cal-day-columns"
          [class.cal-resize-active]="timeEventResizes.size > 0"
          #dayColumns
        >
          <div
            class="cal-day-column"
            *ngFor="let column of view.hourColumns; trackBy: trackByHourColumn"
          >
            <mwl-calendar-week-view-current-time-marker
              [columnDate]="column.date"
              [dayStartHour]="dayStartHour"
              [dayStartMinute]="dayStartMinute"
              [dayEndHour]="dayEndHour"
              [dayEndMinute]="dayEndMinute"
              [hourSegments]="hourSegments"
              [hourDuration]="hourDuration"
              [hourSegmentHeight]="hourSegmentHeight"
              [customTemplate]="currentTimeMarkerTemplate"
            ></mwl-calendar-week-view-current-time-marker>
            <div class="cal-events-container">
              <div
                *ngFor="
                  let timeEvent of column.events;
                  trackBy: trackByWeekTimeEvent
                "
                #event
                class="cal-event-container"
                [class.cal-draggable]="
                  timeEvent.event.draggable && timeEventResizes.size === 0
                "
                [class.cal-starts-within-day]="!timeEvent.startsBeforeDay"
                [class.cal-ends-within-day]="!timeEvent.endsAfterDay"
                [ngClass]="timeEvent.event.cssClass"
                [hidden]="timeEvent.height === 0 && timeEvent.width === 0"
                [style.top.px]="timeEvent.top"
                [style.height.px]="timeEvent.height"
                [style.left.%]="timeEvent.left"
                [style.width.%]="timeEvent.width"
                mwlResizable
                [resizeCursors]="resizeCursors"
                [resizeSnapGrid]="{
                  left: dayColumnWidth,
                  right: dayColumnWidth,
                  top: eventSnapSize || hourSegmentHeight,
                  bottom: eventSnapSize || hourSegmentHeight
                }"
                [validateResize]="validateResize"
                [allowNegativeResizes]="true"
                (resizeStart)="
                  timeEventResizeStarted(dayColumns, timeEvent, $event)
                "
                (resizing)="timeEventResizing(timeEvent, $event)"
                (resizeEnd)="timeEventResizeEnded(timeEvent)"
                mwlDraggable
                dragActiveClass="cal-drag-active"
                [dropData]="{ event: timeEvent.event, calendarId: calendarId }"
                [dragAxis]="{
                  x: timeEvent.event.draggable && timeEventResizes.size === 0,
                  y: timeEvent.event.draggable && timeEventResizes.size === 0
                }"
                [dragSnapGrid]="
                  snapDraggedEvents
                    ? {
                        x: dayColumnWidth,
                        y: eventSnapSize || hourSegmentHeight
                      }
                    : {}
                "
                [touchStartLongPress]="{ delay: 300, delta: 30 }"
                [ghostDragEnabled]="!snapDraggedEvents"
                [ghostElementTemplate]="weekEventTemplate"
                [validateDrag]="validateDrag"
                (dragStart)="dragStarted(dayColumns, event, timeEvent, true)"
                (dragging)="dragMove(timeEvent, $event)"
                (dragEnd)="dragEnded(timeEvent, $event, dayColumnWidth, true)"
              >
                <div
                  class="cal-resize-handle cal-resize-handle-before-start"
                  *ngIf="
                    timeEvent.event?.resizable?.beforeStart &&
                    !timeEvent.startsBeforeDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    left: true,
                    top: true
                  }"
                ></div>
                <ng-template
                  [ngTemplateOutlet]="weekEventTemplate"
                ></ng-template>
                <ng-template #weekEventTemplate>
                  <mwl-calendar-week-view-event
                    [locale]="locale"
                    [weekEvent]="timeEvent"
                    [tooltipPlacement]="tooltipPlacement"
                    [tooltipTemplate]="tooltipTemplate"
                    [tooltipAppendToBody]="tooltipAppendToBody"
                    [tooltipDisabled]="dragActive || timeEventResizes.size > 0"
                    [tooltipDelay]="tooltipDelay"
                    [customTemplate]="eventTemplate"
                    [eventTitleTemplate]="eventTitleTemplate"
                    [eventActionsTemplate]="eventActionsTemplate"
                    [column]="column"
                    [daysInWeek]="daysInWeek"
                    (eventClicked)="
                      eventClicked.emit({
                        event: timeEvent.event,
                        sourceEvent: $event.sourceEvent
                      })
                    "
                  >
                  </mwl-calendar-week-view-event>
                </ng-template>
                <div
                  class="cal-resize-handle cal-resize-handle-after-end"
                  *ngIf="
                    timeEvent.event?.resizable?.afterEnd &&
                    !timeEvent.endsAfterDay
                  "
                  mwlResizeHandle
                  [resizeEdges]="{
                    right: true,
                    bottom: true
                  }"
                ></div>
              </div>
            </div>

            <div
              *ngFor="
                let hour of column.hours;
                trackBy: trackByHour;
                let odd = odd
              "
              class="cal-hour"
              [class.cal-hour-odd]="odd"
            >
              <mwl-calendar-week-view-hour-segment
                *ngFor="
                  let segment of hour.segments;
                  trackBy: trackByHourSegment
                "
                [style.height.px]="hourSegmentHeight"
                [segment]="segment"
                [segmentHeight]="hourSegmentHeight"
                [locale]="locale"
                [customTemplate]="hourSegmentTemplate"
                [daysInWeek]="daysInWeek"
                (mwlClick)="
                  hourSegmentClicked.emit({
                    date: segment.date,
                    sourceEvent: $event
                  })
                "
                [clickListenerDisabled]="
                  hourSegmentClicked.observers.length === 0
                "
                mwlDroppable
                [dragOverClass]="
                  !dragActive || !snapDraggedEvents ? 'cal-drag-over' : null
                "
                dragActiveClass="cal-drag-active"
                (drop)="eventDropped($event, segment.date, false)"
                (dragEnter)="dateDragEnter(segment.date)"
                [isTimeLabel]="daysInWeek === 1"
              >
              </mwl-calendar-week-view-hour-segment>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ChangeDetectorRef
    }, {
      type: CalendarUtils
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID]
      }]
    }, {
      type: DateAdapter
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }];
  }, {
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    events: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    excludeDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    refresh: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekStartsOn: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    headerTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    precision: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    weekendDays: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    snapDraggedEvents: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegments: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourDuration: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    minimumEventHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventSnapSize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    allDayEventsLabelTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    daysInWeek: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    currentTimeMarkerTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    validateEventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    resizeCursors: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayHeaderClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    beforeViewRender: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    hourSegmentClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarWeekModule {}
CalendarWeekModule.ɵfac = function CalendarWeekModule_Factory(t) {
  return new (t || CalendarWeekModule)();
};
CalendarWeekModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarWeekModule
});
CalendarWeekModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarCommonModule, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarWeekModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarCommonModule],
      declarations: [CalendarWeekViewComponent, CalendarWeekViewHeaderComponent, CalendarWeekViewEventComponent, CalendarWeekViewHourSegmentComponent, CalendarWeekViewCurrentTimeMarkerComponent],
      exports: [angular_resizable_element__WEBPACK_IMPORTED_MODULE_17__.ResizableModule, angular_draggable_droppable__WEBPACK_IMPORTED_MODULE_9__.DragAndDropModule, CalendarWeekViewComponent, CalendarWeekViewHeaderComponent, CalendarWeekViewEventComponent, CalendarWeekViewHourSegmentComponent, CalendarWeekViewCurrentTimeMarkerComponent]
    }]
  }], null, null);
})();

/**
 * Shows all events on a given day. Example usage:
 *
 * ```typescript
 * <mwl-calendar-day-view
 *  [viewDate]="viewDate"
 *  [events]="events">
 * </mwl-calendar-day-view>
 * ```
 */
class CalendarDayViewComponent {
  constructor() {
    /**
     * An array of events to display on view
     * The schema is available here: https://github.com/mattlewis92/calendar-utils/blob/c51689985f59a271940e30bc4e2c4e1fee3fcb5c/src/calendarUtils.ts#L49-L63
     */
    this.events = [];
    /**
     * The number of segments in an hour. Must divide equally into 60.
     */
    this.hourSegments = 2;
    /**
     * The height in pixels of each hour segment
     */
    this.hourSegmentHeight = 30;
    /**
     * The minimum height in pixels of each event
     */
    this.minimumEventHeight = 30;
    /**
     * The day start hours in 24 hour time. Must be 0-23
     */
    this.dayStartHour = 0;
    /**
     * The day start minutes. Must be 0-59
     */
    this.dayStartMinute = 0;
    /**
     * The day end hours in 24 hour time. Must be 0-23
     */
    this.dayEndHour = 23;
    /**
     * The day end minutes. Must be 0-59
     */
    this.dayEndMinute = 59;
    /**
     * The placement of the event tooltip
     */
    this.tooltipPlacement = 'auto';
    /**
     * Whether to append tooltips to the body or next to the trigger element
     */
    this.tooltipAppendToBody = true;
    /**
     * The delay in milliseconds before the tooltip should be displayed. If not provided the tooltip
     * will be displayed immediately.
     */
    this.tooltipDelay = null;
    /**
     * Whether to snap events to a grid when dragging
     */
    this.snapDraggedEvents = true;
    /**
     * Called when an event title is clicked
     */
    this.eventClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an hour segment is clicked
     */
    this.hourSegmentClicked = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when an event is resized or dragged and dropped
     */
    this.eventTimesChanged = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * An output that will be called before the view is rendered for the current day.
     * If you add the `cssClass` property to an hour grid segment it will add that class to the hour segment in the template
     */
    this.beforeViewRender = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
}
CalendarDayViewComponent.ɵfac = function CalendarDayViewComponent_Factory(t) {
  return new (t || CalendarDayViewComponent)();
};
CalendarDayViewComponent.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
  type: CalendarDayViewComponent,
  selectors: [["mwl-calendar-day-view"]],
  inputs: {
    viewDate: "viewDate",
    events: "events",
    hourSegments: "hourSegments",
    hourSegmentHeight: "hourSegmentHeight",
    hourDuration: "hourDuration",
    minimumEventHeight: "minimumEventHeight",
    dayStartHour: "dayStartHour",
    dayStartMinute: "dayStartMinute",
    dayEndHour: "dayEndHour",
    dayEndMinute: "dayEndMinute",
    refresh: "refresh",
    locale: "locale",
    eventSnapSize: "eventSnapSize",
    tooltipPlacement: "tooltipPlacement",
    tooltipTemplate: "tooltipTemplate",
    tooltipAppendToBody: "tooltipAppendToBody",
    tooltipDelay: "tooltipDelay",
    hourSegmentTemplate: "hourSegmentTemplate",
    eventTemplate: "eventTemplate",
    eventTitleTemplate: "eventTitleTemplate",
    eventActionsTemplate: "eventActionsTemplate",
    snapDraggedEvents: "snapDraggedEvents",
    allDayEventsLabelTemplate: "allDayEventsLabelTemplate",
    currentTimeMarkerTemplate: "currentTimeMarkerTemplate",
    validateEventTimesChanged: "validateEventTimesChanged",
    resizeCursors: "resizeCursors"
  },
  outputs: {
    eventClicked: "eventClicked",
    hourSegmentClicked: "hourSegmentClicked",
    eventTimesChanged: "eventTimesChanged",
    beforeViewRender: "beforeViewRender"
  },
  decls: 1,
  vars: 27,
  consts: [[1, "cal-day-view", 3, "daysInWeek", "viewDate", "events", "hourSegments", "hourDuration", "hourSegmentHeight", "minimumEventHeight", "dayStartHour", "dayStartMinute", "dayEndHour", "dayEndMinute", "refresh", "locale", "eventSnapSize", "tooltipPlacement", "tooltipTemplate", "tooltipAppendToBody", "tooltipDelay", "resizeCursors", "hourSegmentTemplate", "eventTemplate", "eventTitleTemplate", "eventActionsTemplate", "snapDraggedEvents", "allDayEventsLabelTemplate", "currentTimeMarkerTemplate", "validateEventTimesChanged", "eventClicked", "hourSegmentClicked", "eventTimesChanged", "beforeViewRender"]],
  template: function CalendarDayViewComponent_Template(rf, ctx) {
    if (rf & 1) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "mwl-calendar-week-view", 0);
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("eventClicked", function CalendarDayViewComponent_Template_mwl_calendar_week_view_eventClicked_0_listener($event) {
        return ctx.eventClicked.emit($event);
      })("hourSegmentClicked", function CalendarDayViewComponent_Template_mwl_calendar_week_view_hourSegmentClicked_0_listener($event) {
        return ctx.hourSegmentClicked.emit($event);
      })("eventTimesChanged", function CalendarDayViewComponent_Template_mwl_calendar_week_view_eventTimesChanged_0_listener($event) {
        return ctx.eventTimesChanged.emit($event);
      })("beforeViewRender", function CalendarDayViewComponent_Template_mwl_calendar_week_view_beforeViewRender_0_listener($event) {
        return ctx.beforeViewRender.emit($event);
      });
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    }
    if (rf & 2) {
      _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("daysInWeek", 1)("viewDate", ctx.viewDate)("events", ctx.events)("hourSegments", ctx.hourSegments)("hourDuration", ctx.hourDuration)("hourSegmentHeight", ctx.hourSegmentHeight)("minimumEventHeight", ctx.minimumEventHeight)("dayStartHour", ctx.dayStartHour)("dayStartMinute", ctx.dayStartMinute)("dayEndHour", ctx.dayEndHour)("dayEndMinute", ctx.dayEndMinute)("refresh", ctx.refresh)("locale", ctx.locale)("eventSnapSize", ctx.eventSnapSize)("tooltipPlacement", ctx.tooltipPlacement)("tooltipTemplate", ctx.tooltipTemplate)("tooltipAppendToBody", ctx.tooltipAppendToBody)("tooltipDelay", ctx.tooltipDelay)("resizeCursors", ctx.resizeCursors)("hourSegmentTemplate", ctx.hourSegmentTemplate)("eventTemplate", ctx.eventTemplate)("eventTitleTemplate", ctx.eventTitleTemplate)("eventActionsTemplate", ctx.eventActionsTemplate)("snapDraggedEvents", ctx.snapDraggedEvents)("allDayEventsLabelTemplate", ctx.allDayEventsLabelTemplate)("currentTimeMarkerTemplate", ctx.currentTimeMarkerTemplate)("validateEventTimesChanged", ctx.validateEventTimesChanged);
    }
  },
  dependencies: [CalendarWeekViewComponent],
  encapsulation: 2
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarDayViewComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Component,
    args: [{
      selector: 'mwl-calendar-day-view',
      template: `
    <mwl-calendar-week-view
      class="cal-day-view"
      [daysInWeek]="1"
      [viewDate]="viewDate"
      [events]="events"
      [hourSegments]="hourSegments"
      [hourDuration]="hourDuration"
      [hourSegmentHeight]="hourSegmentHeight"
      [minimumEventHeight]="minimumEventHeight"
      [dayStartHour]="dayStartHour"
      [dayStartMinute]="dayStartMinute"
      [dayEndHour]="dayEndHour"
      [dayEndMinute]="dayEndMinute"
      [refresh]="refresh"
      [locale]="locale"
      [eventSnapSize]="eventSnapSize"
      [tooltipPlacement]="tooltipPlacement"
      [tooltipTemplate]="tooltipTemplate"
      [tooltipAppendToBody]="tooltipAppendToBody"
      [tooltipDelay]="tooltipDelay"
      [resizeCursors]="resizeCursors"
      [hourSegmentTemplate]="hourSegmentTemplate"
      [eventTemplate]="eventTemplate"
      [eventTitleTemplate]="eventTitleTemplate"
      [eventActionsTemplate]="eventActionsTemplate"
      [snapDraggedEvents]="snapDraggedEvents"
      [allDayEventsLabelTemplate]="allDayEventsLabelTemplate"
      [currentTimeMarkerTemplate]="currentTimeMarkerTemplate"
      [validateEventTimesChanged]="validateEventTimesChanged"
      (eventClicked)="eventClicked.emit($event)"
      (hourSegmentClicked)="hourSegmentClicked.emit($event)"
      (eventTimesChanged)="eventTimesChanged.emit($event)"
      (beforeViewRender)="beforeViewRender.emit($event)"
    ></mwl-calendar-week-view>
  `
    }]
  }], null, {
    viewDate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    events: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegments: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourDuration: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    minimumEventHeight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayStartMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndHour: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dayEndMinute: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    refresh: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    locale: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventSnapSize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipPlacement: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipAppendToBody: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    tooltipDelay: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    hourSegmentTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventTitleTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventActionsTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    snapDraggedEvents: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    allDayEventsLabelTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    currentTimeMarkerTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    validateEventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    resizeCursors: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    eventClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    hourSegmentClicked: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    eventTimesChanged: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    beforeViewRender: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class CalendarDayModule {}
CalendarDayModule.ɵfac = function CalendarDayModule_Factory(t) {
  return new (t || CalendarDayModule)();
};
CalendarDayModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarDayModule
});
CalendarDayModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, CalendarCommonModule, CalendarWeekModule]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarDayModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.CommonModule, CalendarCommonModule, CalendarWeekModule],
      declarations: [CalendarDayViewComponent],
      exports: [CalendarDayViewComponent]
    }]
  }], null, null);
})();

/**
 * The main module of this library. Example usage:
 *
 * ```typescript
 * import { CalenderModule } from 'angular-calendar';
 *
 * @NgModule({
 *   imports: [
 *     CalenderModule.forRoot()
 *   ]
 * })
 * class MyModule {}
 * ```
 *
 */
class CalendarModule {
  static forRoot(dateAdapter, config = {}) {
    return {
      ngModule: CalendarModule,
      providers: [dateAdapter, config.eventTitleFormatter || CalendarEventTitleFormatter, config.dateFormatter || CalendarDateFormatter, config.utils || CalendarUtils, config.a11y || CalendarA11y]
    };
  }
}
CalendarModule.ɵfac = function CalendarModule_Factory(t) {
  return new (t || CalendarModule)();
};
CalendarModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: CalendarModule
});
CalendarModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
  imports: [CalendarCommonModule, CalendarMonthModule, CalendarWeekModule, CalendarDayModule, CalendarCommonModule, CalendarMonthModule, CalendarWeekModule, CalendarDayModule]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](CalendarModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      imports: [CalendarCommonModule, CalendarMonthModule, CalendarWeekModule, CalendarDayModule],
      exports: [CalendarCommonModule, CalendarMonthModule, CalendarWeekModule, CalendarDayModule]
    }]
  }], null, null);
})();

/*
 * Public API Surface of angular-calendar
 */

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=angular-calendar.mjs.map

/***/ }),

/***/ 99109:
/*!*******************************************************************************************!*\
  !*** ./node_modules/angular-draggable-droppable/fesm2020/angular-draggable-droppable.mjs ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DragAndDropModule: () => (/* binding */ DragAndDropModule),
/* harmony export */   DraggableDirective: () => (/* binding */ DraggableDirective),
/* harmony export */   DraggableScrollContainerDirective: () => (/* binding */ DraggableScrollContainerDirective),
/* harmony export */   DroppableDirective: () => (/* binding */ DroppableDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 43942);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs */ 56042);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 63617);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 19999);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs */ 18537);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 51567);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 13255);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 63037);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 71870);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs/operators */ 33900);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs/operators */ 64334);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! rxjs/operators */ 80602);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 25198);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 5057);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! rxjs/operators */ 91817);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _mattlewis92_dom_autoscroller__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @mattlewis92/dom-autoscroller */ 68786);






function addClass(renderer, element, classToAdd) {
  if (classToAdd) {
    classToAdd.split(' ').forEach(className => renderer.addClass(element.nativeElement, className));
  }
}
function removeClass(renderer, element, classToRemove) {
  if (classToRemove) {
    classToRemove.split(' ').forEach(className => renderer.removeClass(element.nativeElement, className));
  }
}
class DraggableHelper {
  constructor() {
    this.currentDrag = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
  }
}
DraggableHelper.ɵfac = function DraggableHelper_Factory(t) {
  return new (t || DraggableHelper)();
};
DraggableHelper.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
  token: DraggableHelper,
  factory: DraggableHelper.ɵfac,
  providedIn: 'root'
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DraggableHelper, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Injectable,
    args: [{
      providedIn: 'root'
    }]
  }], null, null);
})();

/**
 * If the window isn't scrollable, then place this on the scrollable container that draggable elements are inside. e.g.
 * ```html
  <div style="overflow: scroll" mwlDraggableScrollContainer>
    <div mwlDraggable>Drag me!</div>
  </div>
  ```
 */
class DraggableScrollContainerDirective {
  /**
   * @hidden
   */
  constructor(elementRef) {
    this.elementRef = elementRef;
  }
}
DraggableScrollContainerDirective.ɵfac = function DraggableScrollContainerDirective_Factory(t) {
  return new (t || DraggableScrollContainerDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef));
};
DraggableScrollContainerDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: DraggableScrollContainerDirective,
  selectors: [["", "mwlDraggableScrollContainer", ""]]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DraggableScrollContainerDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlDraggableScrollContainer]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }];
  }, null);
})();
class DraggableDirective {
  /**
   * @hidden
   */
  constructor(element, renderer, draggableHelper, zone, vcr, scrollContainer, document) {
    this.element = element;
    this.renderer = renderer;
    this.draggableHelper = draggableHelper;
    this.zone = zone;
    this.vcr = vcr;
    this.scrollContainer = scrollContainer;
    this.document = document;
    /**
     * The axis along which the element is draggable
     */
    this.dragAxis = {
      x: true,
      y: true
    };
    /**
     * Snap all drags to an x / y grid
     */
    this.dragSnapGrid = {};
    /**
     * Show a ghost element that shows the drag when dragging
     */
    this.ghostDragEnabled = true;
    /**
     * Show the original element when ghostDragEnabled is true
     */
    this.showOriginalElementWhileDragging = false;
    /**
     * The cursor to use when hovering over a draggable element
     */
    this.dragCursor = '';
    /*
     * Options used to control the behaviour of auto scrolling: https://www.npmjs.com/package/dom-autoscroller
     */
    this.autoScroll = {
      margin: 20
    };
    /**
     * Called when the element can be dragged along one axis and has the mouse or pointer device pressed on it
     */
    this.dragPointerDown = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when the element has started to be dragged.
     * Only called after at least one mouse or touch move event.
     * If you call $event.cancelDrag$.emit() it will cancel the current drag
     */
    this.dragStart = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called after the ghost element has been created
     */
    this.ghostElementCreated = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when the element is being dragged
     */
    this.dragging = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called after the element is dragged
     */
    this.dragEnd = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * @hidden
     */
    this.pointerDown$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    /**
     * @hidden
     */
    this.pointerMove$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    /**
     * @hidden
     */
    this.pointerUp$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.eventListenerSubscriptions = {};
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.timeLongPress = {
      timerBegin: 0,
      timerEnd: 0
    };
  }
  ngOnInit() {
    this.checkEventListeners();
    const pointerDragged$ = this.pointerDown$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(() => this.canDrag()), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.mergeMap)(pointerDownEvent => {
      // fix for https://github.com/mattlewis92/angular-draggable-droppable/issues/61
      // stop mouse events propagating up the chain
      if (pointerDownEvent.event.stopPropagation && !this.scrollContainer) {
        pointerDownEvent.event.stopPropagation();
      }
      // hack to prevent text getting selected in safari while dragging
      const globalDragStyle = this.renderer.createElement('style');
      this.renderer.setAttribute(globalDragStyle, 'type', 'text/css');
      this.renderer.appendChild(globalDragStyle, this.renderer.createText(`
          body * {
           -moz-user-select: none;
           -ms-user-select: none;
           -webkit-user-select: none;
           user-select: none;
          }
        `));
      requestAnimationFrame(() => {
        this.document.head.appendChild(globalDragStyle);
      });
      const startScrollPosition = this.getScrollPosition();
      const scrollContainerScroll$ = new rxjs__WEBPACK_IMPORTED_MODULE_5__.Observable(observer => {
        const scrollContainer = this.scrollContainer ? this.scrollContainer.elementRef.nativeElement : 'window';
        return this.renderer.listen(scrollContainer, 'scroll', e => observer.next(e));
      }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.startWith)(startScrollPosition), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(() => this.getScrollPosition()));
      const currentDrag$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
      const cancelDrag$ = new rxjs__WEBPACK_IMPORTED_MODULE_8__.ReplaySubject();
      if (this.dragPointerDown.observers.length > 0) {
        this.zone.run(() => {
          this.dragPointerDown.next({
            x: 0,
            y: 0
          });
        });
      }
      const dragComplete$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.merge)(this.pointerUp$, this.pointerDown$, cancelDrag$, this.destroy$).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
      const pointerMove = (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.combineLatest)([this.pointerMove$, scrollContainerScroll$]).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(([pointerMoveEvent, scroll]) => {
        return {
          currentDrag$,
          transformX: pointerMoveEvent.clientX - pointerDownEvent.clientX,
          transformY: pointerMoveEvent.clientY - pointerDownEvent.clientY,
          clientX: pointerMoveEvent.clientX,
          clientY: pointerMoveEvent.clientY,
          scrollLeft: scroll.left,
          scrollTop: scroll.top,
          target: pointerMoveEvent.event.target
        };
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(moveData => {
        if (this.dragSnapGrid.x) {
          moveData.transformX = Math.round(moveData.transformX / this.dragSnapGrid.x) * this.dragSnapGrid.x;
        }
        if (this.dragSnapGrid.y) {
          moveData.transformY = Math.round(moveData.transformY / this.dragSnapGrid.y) * this.dragSnapGrid.y;
        }
        return moveData;
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(moveData => {
        if (!this.dragAxis.x) {
          moveData.transformX = 0;
        }
        if (!this.dragAxis.y) {
          moveData.transformY = 0;
        }
        return moveData;
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(moveData => {
        const scrollX = moveData.scrollLeft - startScrollPosition.left;
        const scrollY = moveData.scrollTop - startScrollPosition.top;
        return {
          ...moveData,
          x: moveData.transformX + scrollX,
          y: moveData.transformY + scrollY
        };
      }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(({
        x,
        y,
        transformX,
        transformY
      }) => !this.validateDrag || this.validateDrag({
        x,
        y,
        transform: {
          x: transformX,
          y: transformY
        }
      })), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_12__.takeUntil)(dragComplete$), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
      const dragStarted$ = pointerMove.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
      const dragEnded$ = pointerMove.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_14__.takeLast)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
      dragStarted$.subscribe(({
        clientX,
        clientY,
        x,
        y
      }) => {
        if (this.dragStart.observers.length > 0) {
          this.zone.run(() => {
            this.dragStart.next({
              cancelDrag$
            });
          });
        }
        this.scroller = (0,_mattlewis92_dom_autoscroller__WEBPACK_IMPORTED_MODULE_0__["default"])([this.scrollContainer ? this.scrollContainer.elementRef.nativeElement : this.document.defaultView], {
          ...this.autoScroll,
          autoScroll() {
            return true;
          }
        });
        addClass(this.renderer, this.element, this.dragActiveClass);
        if (this.ghostDragEnabled) {
          const rect = this.element.nativeElement.getBoundingClientRect();
          const clone = this.element.nativeElement.cloneNode(true);
          if (!this.showOriginalElementWhileDragging) {
            this.renderer.setStyle(this.element.nativeElement, 'visibility', 'hidden');
          }
          if (this.ghostElementAppendTo) {
            this.ghostElementAppendTo.appendChild(clone);
          } else {
            this.element.nativeElement.parentNode.insertBefore(clone, this.element.nativeElement.nextSibling);
          }
          this.ghostElement = clone;
          this.document.body.style.cursor = this.dragCursor;
          this.setElementStyles(clone, {
            position: 'fixed',
            top: `${rect.top}px`,
            left: `${rect.left}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            cursor: this.dragCursor,
            margin: '0',
            willChange: 'transform',
            pointerEvents: 'none'
          });
          if (this.ghostElementTemplate) {
            const viewRef = this.vcr.createEmbeddedView(this.ghostElementTemplate);
            clone.innerHTML = '';
            viewRef.rootNodes.filter(node => node instanceof Node).forEach(node => {
              clone.appendChild(node);
            });
            dragEnded$.subscribe(() => {
              this.vcr.remove(this.vcr.indexOf(viewRef));
            });
          }
          if (this.ghostElementCreated.observers.length > 0) {
            this.zone.run(() => {
              this.ghostElementCreated.emit({
                clientX: clientX - x,
                clientY: clientY - y,
                element: clone
              });
            });
          }
          dragEnded$.subscribe(() => {
            clone.parentElement.removeChild(clone);
            this.ghostElement = null;
            this.renderer.setStyle(this.element.nativeElement, 'visibility', '');
          });
        }
        this.draggableHelper.currentDrag.next(currentDrag$);
      });
      dragEnded$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.mergeMap)(dragEndData => {
        const dragEndData$ = cancelDrag$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.count)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(calledCount => ({
          ...dragEndData,
          dragCancelled: calledCount > 0
        })));
        cancelDrag$.complete();
        return dragEndData$;
      })).subscribe(({
        x,
        y,
        dragCancelled
      }) => {
        this.scroller.destroy();
        if (this.dragEnd.observers.length > 0) {
          this.zone.run(() => {
            this.dragEnd.next({
              x,
              y,
              dragCancelled
            });
          });
        }
        removeClass(this.renderer, this.element, this.dragActiveClass);
        currentDrag$.complete();
      });
      (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.merge)(dragComplete$, dragEnded$).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1)).subscribe(() => {
        requestAnimationFrame(() => {
          this.document.head.removeChild(globalDragStyle);
        });
      });
      return pointerMove;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.share)());
    (0,rxjs__WEBPACK_IMPORTED_MODULE_9__.merge)(pointerDragged$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_13__.take)(1), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(value => [, value])), pointerDragged$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.pairwise)())).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(([previous, next]) => {
      if (!previous) {
        return true;
      }
      return previous.x !== next.x || previous.y !== next.y;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(([previous, next]) => next)).subscribe(({
      x,
      y,
      currentDrag$,
      clientX,
      clientY,
      transformX,
      transformY,
      target
    }) => {
      if (this.dragging.observers.length > 0) {
        this.zone.run(() => {
          this.dragging.next({
            x,
            y
          });
        });
      }
      requestAnimationFrame(() => {
        if (this.ghostElement) {
          const transform = `translate3d(${transformX}px, ${transformY}px, 0px)`;
          this.setElementStyles(this.ghostElement, {
            transform,
            '-webkit-transform': transform,
            '-ms-transform': transform,
            '-moz-transform': transform,
            '-o-transform': transform
          });
        }
      });
      currentDrag$.next({
        clientX,
        clientY,
        dropData: this.dropData,
        target
      });
    });
  }
  ngOnChanges(changes) {
    if (changes.dragAxis) {
      this.checkEventListeners();
    }
  }
  ngOnDestroy() {
    this.unsubscribeEventListeners();
    this.pointerDown$.complete();
    this.pointerMove$.complete();
    this.pointerUp$.complete();
    this.destroy$.next();
  }
  checkEventListeners() {
    const canDrag = this.canDrag();
    const hasEventListeners = Object.keys(this.eventListenerSubscriptions).length > 0;
    if (canDrag && !hasEventListeners) {
      this.zone.runOutsideAngular(() => {
        this.eventListenerSubscriptions.mousedown = this.renderer.listen(this.element.nativeElement, 'mousedown', event => {
          this.onMouseDown(event);
        });
        this.eventListenerSubscriptions.mouseup = this.renderer.listen('document', 'mouseup', event => {
          this.onMouseUp(event);
        });
        this.eventListenerSubscriptions.touchstart = this.renderer.listen(this.element.nativeElement, 'touchstart', event => {
          this.onTouchStart(event);
        });
        this.eventListenerSubscriptions.touchend = this.renderer.listen('document', 'touchend', event => {
          this.onTouchEnd(event);
        });
        this.eventListenerSubscriptions.touchcancel = this.renderer.listen('document', 'touchcancel', event => {
          this.onTouchEnd(event);
        });
        this.eventListenerSubscriptions.mouseenter = this.renderer.listen(this.element.nativeElement, 'mouseenter', () => {
          this.onMouseEnter();
        });
        this.eventListenerSubscriptions.mouseleave = this.renderer.listen(this.element.nativeElement, 'mouseleave', () => {
          this.onMouseLeave();
        });
      });
    } else if (!canDrag && hasEventListeners) {
      this.unsubscribeEventListeners();
    }
  }
  onMouseDown(event) {
    if (event.button === 0) {
      if (!this.eventListenerSubscriptions.mousemove) {
        this.eventListenerSubscriptions.mousemove = this.renderer.listen('document', 'mousemove', mouseMoveEvent => {
          this.pointerMove$.next({
            event: mouseMoveEvent,
            clientX: mouseMoveEvent.clientX,
            clientY: mouseMoveEvent.clientY
          });
        });
      }
      this.pointerDown$.next({
        event,
        clientX: event.clientX,
        clientY: event.clientY
      });
    }
  }
  onMouseUp(event) {
    if (event.button === 0) {
      if (this.eventListenerSubscriptions.mousemove) {
        this.eventListenerSubscriptions.mousemove();
        delete this.eventListenerSubscriptions.mousemove;
      }
      this.pointerUp$.next({
        event,
        clientX: event.clientX,
        clientY: event.clientY
      });
    }
  }
  onTouchStart(event) {
    let startScrollPosition;
    let isDragActivated;
    let hasContainerScrollbar;
    if (this.touchStartLongPress) {
      this.timeLongPress.timerBegin = Date.now();
      isDragActivated = false;
      hasContainerScrollbar = this.hasScrollbar();
      startScrollPosition = this.getScrollPosition();
    }
    if (!this.eventListenerSubscriptions.touchmove) {
      const contextMenuListener = (0,rxjs__WEBPACK_IMPORTED_MODULE_17__.fromEvent)(this.document, 'contextmenu').subscribe(e => {
        e.preventDefault();
      });
      const touchMoveListener = (0,rxjs__WEBPACK_IMPORTED_MODULE_17__.fromEvent)(this.document, 'touchmove', {
        passive: false
      }).subscribe(touchMoveEvent => {
        if (this.touchStartLongPress && !isDragActivated && hasContainerScrollbar) {
          isDragActivated = this.shouldBeginDrag(event, touchMoveEvent, startScrollPosition);
        }
        if (!this.touchStartLongPress || !hasContainerScrollbar || isDragActivated) {
          touchMoveEvent.preventDefault();
          this.pointerMove$.next({
            event: touchMoveEvent,
            clientX: touchMoveEvent.targetTouches[0].clientX,
            clientY: touchMoveEvent.targetTouches[0].clientY
          });
        }
      });
      this.eventListenerSubscriptions.touchmove = () => {
        contextMenuListener.unsubscribe();
        touchMoveListener.unsubscribe();
      };
    }
    this.pointerDown$.next({
      event,
      clientX: event.touches[0].clientX,
      clientY: event.touches[0].clientY
    });
  }
  onTouchEnd(event) {
    if (this.eventListenerSubscriptions.touchmove) {
      this.eventListenerSubscriptions.touchmove();
      delete this.eventListenerSubscriptions.touchmove;
      if (this.touchStartLongPress) {
        this.enableScroll();
      }
    }
    this.pointerUp$.next({
      event,
      clientX: event.changedTouches[0].clientX,
      clientY: event.changedTouches[0].clientY
    });
  }
  onMouseEnter() {
    this.setCursor(this.dragCursor);
  }
  onMouseLeave() {
    this.setCursor('');
  }
  canDrag() {
    return this.dragAxis.x || this.dragAxis.y;
  }
  setCursor(value) {
    if (!this.eventListenerSubscriptions.mousemove) {
      this.renderer.setStyle(this.element.nativeElement, 'cursor', value);
    }
  }
  unsubscribeEventListeners() {
    Object.keys(this.eventListenerSubscriptions).forEach(type => {
      this.eventListenerSubscriptions[type]();
      delete this.eventListenerSubscriptions[type];
    });
  }
  setElementStyles(element, styles) {
    Object.keys(styles).forEach(key => {
      this.renderer.setStyle(element, key, styles[key]);
    });
  }
  getScrollElement() {
    if (this.scrollContainer) {
      return this.scrollContainer.elementRef.nativeElement;
    } else {
      return this.document.body;
    }
  }
  getScrollPosition() {
    if (this.scrollContainer) {
      return {
        top: this.scrollContainer.elementRef.nativeElement.scrollTop,
        left: this.scrollContainer.elementRef.nativeElement.scrollLeft
      };
    } else {
      return {
        top: window.pageYOffset || this.document.documentElement.scrollTop,
        left: window.pageXOffset || this.document.documentElement.scrollLeft
      };
    }
  }
  shouldBeginDrag(event, touchMoveEvent, startScrollPosition) {
    const moveScrollPosition = this.getScrollPosition();
    const deltaScroll = {
      top: Math.abs(moveScrollPosition.top - startScrollPosition.top),
      left: Math.abs(moveScrollPosition.left - startScrollPosition.left)
    };
    const deltaX = Math.abs(touchMoveEvent.targetTouches[0].clientX - event.touches[0].clientX) - deltaScroll.left;
    const deltaY = Math.abs(touchMoveEvent.targetTouches[0].clientY - event.touches[0].clientY) - deltaScroll.top;
    const deltaTotal = deltaX + deltaY;
    const longPressConfig = this.touchStartLongPress;
    if (deltaTotal > longPressConfig.delta || deltaScroll.top > 0 || deltaScroll.left > 0) {
      this.timeLongPress.timerBegin = Date.now();
    }
    this.timeLongPress.timerEnd = Date.now();
    const duration = this.timeLongPress.timerEnd - this.timeLongPress.timerBegin;
    if (duration >= longPressConfig.delay) {
      this.disableScroll();
      return true;
    }
    return false;
  }
  enableScroll() {
    if (this.scrollContainer) {
      this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', '');
    }
    this.renderer.setStyle(this.document.body, 'overflow', '');
  }
  disableScroll() {
    /* istanbul ignore next */
    if (this.scrollContainer) {
      this.renderer.setStyle(this.scrollContainer.elementRef.nativeElement, 'overflow', 'hidden');
    }
    this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
  }
  hasScrollbar() {
    const scrollContainer = this.getScrollElement();
    const containerHasHorizontalScroll = scrollContainer.scrollWidth > scrollContainer.clientWidth;
    const containerHasVerticalScroll = scrollContainer.scrollHeight > scrollContainer.clientHeight;
    return containerHasHorizontalScroll || containerHasVerticalScroll;
  }
}
DraggableDirective.ɵfac = function DraggableDirective_Factory(t) {
  return new (t || DraggableDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DraggableHelper), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ViewContainerRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DraggableScrollContainerDirective, 8), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_18__.DOCUMENT));
};
DraggableDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: DraggableDirective,
  selectors: [["", "mwlDraggable", ""]],
  inputs: {
    dropData: "dropData",
    dragAxis: "dragAxis",
    dragSnapGrid: "dragSnapGrid",
    ghostDragEnabled: "ghostDragEnabled",
    showOriginalElementWhileDragging: "showOriginalElementWhileDragging",
    validateDrag: "validateDrag",
    dragCursor: "dragCursor",
    dragActiveClass: "dragActiveClass",
    ghostElementAppendTo: "ghostElementAppendTo",
    ghostElementTemplate: "ghostElementTemplate",
    touchStartLongPress: "touchStartLongPress",
    autoScroll: "autoScroll"
  },
  outputs: {
    dragPointerDown: "dragPointerDown",
    dragStart: "dragStart",
    ghostElementCreated: "ghostElementCreated",
    dragging: "dragging",
    dragEnd: "dragEnd"
  },
  features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵNgOnChangesFeature"]]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DraggableDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlDraggable]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }, {
      type: DraggableHelper
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ViewContainerRef
    }, {
      type: DraggableScrollContainerDirective,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Optional
      }]
    }, {
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Inject,
        args: [_angular_common__WEBPACK_IMPORTED_MODULE_18__.DOCUMENT]
      }]
    }];
  }, {
    dropData: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragAxis: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragSnapGrid: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    ghostDragEnabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    showOriginalElementWhileDragging: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    validateDrag: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragCursor: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragActiveClass: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    ghostElementAppendTo: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    ghostElementTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    touchStartLongPress: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    autoScroll: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragPointerDown: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragStart: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    ghostElementCreated: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragging: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragEnd: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
function isCoordinateWithinRectangle(clientX, clientY, rect) {
  return clientX >= rect.left && clientX <= rect.right && clientY >= rect.top && clientY <= rect.bottom;
}
class DroppableDirective {
  constructor(element, draggableHelper, zone, renderer, scrollContainer) {
    this.element = element;
    this.draggableHelper = draggableHelper;
    this.zone = zone;
    this.renderer = renderer;
    this.scrollContainer = scrollContainer;
    /**
     * Called when a draggable element starts overlapping the element
     */
    this.dragEnter = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when a draggable element stops overlapping the element
     */
    this.dragLeave = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when a draggable element is moved over the element
     */
    this.dragOver = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
    /**
     * Called when a draggable element is dropped on this element
     */
    this.drop = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter(); // eslint-disable-line  @angular-eslint/no-output-native
  }

  ngOnInit() {
    this.currentDragSubscription = this.draggableHelper.currentDrag.subscribe(drag$ => {
      addClass(this.renderer, this.element, this.dragActiveClass);
      const droppableElement = {
        updateCache: true
      };
      const deregisterScrollListener = this.renderer.listen(this.scrollContainer ? this.scrollContainer.elementRef.nativeElement : 'window', 'scroll', () => {
        droppableElement.updateCache = true;
      });
      let currentDragEvent;
      const overlaps$ = drag$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(({
        clientX,
        clientY,
        dropData,
        target
      }) => {
        currentDragEvent = {
          clientX,
          clientY,
          dropData,
          target
        };
        if (droppableElement.updateCache) {
          droppableElement.rect = this.element.nativeElement.getBoundingClientRect();
          if (this.scrollContainer) {
            droppableElement.scrollContainerRect = this.scrollContainer.elementRef.nativeElement.getBoundingClientRect();
          }
          droppableElement.updateCache = false;
        }
        const isWithinElement = isCoordinateWithinRectangle(clientX, clientY, droppableElement.rect);
        const isDropAllowed = !this.validateDrop || this.validateDrop({
          clientX,
          clientY,
          target,
          dropData
        });
        if (droppableElement.scrollContainerRect) {
          return isWithinElement && isDropAllowed && isCoordinateWithinRectangle(clientX, clientY, droppableElement.scrollContainerRect);
        } else {
          return isWithinElement && isDropAllowed;
        }
      }));
      const overlapsChanged$ = overlaps$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_19__.distinctUntilChanged)());
      let dragOverActive; // TODO - see if there's a way of doing this via rxjs
      overlapsChanged$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(overlapsNow => overlapsNow)).subscribe(() => {
        dragOverActive = true;
        addClass(this.renderer, this.element, this.dragOverClass);
        if (this.dragEnter.observers.length > 0) {
          this.zone.run(() => {
            this.dragEnter.next(currentDragEvent);
          });
        }
      });
      overlaps$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(overlapsNow => overlapsNow)).subscribe(() => {
        if (this.dragOver.observers.length > 0) {
          this.zone.run(() => {
            this.dragOver.next(currentDragEvent);
          });
        }
      });
      overlapsChanged$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.pairwise)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.filter)(([didOverlap, overlapsNow]) => didOverlap && !overlapsNow)).subscribe(() => {
        dragOverActive = false;
        removeClass(this.renderer, this.element, this.dragOverClass);
        if (this.dragLeave.observers.length > 0) {
          this.zone.run(() => {
            this.dragLeave.next(currentDragEvent);
          });
        }
      });
      drag$.subscribe({
        complete: () => {
          deregisterScrollListener();
          removeClass(this.renderer, this.element, this.dragActiveClass);
          if (dragOverActive) {
            removeClass(this.renderer, this.element, this.dragOverClass);
            if (this.drop.observers.length > 0) {
              this.zone.run(() => {
                this.drop.next(currentDragEvent);
              });
            }
          }
        }
      });
    });
  }
  ngOnDestroy() {
    if (this.currentDragSubscription) {
      this.currentDragSubscription.unsubscribe();
    }
  }
}
DroppableDirective.ɵfac = function DroppableDirective_Factory(t) {
  return new (t || DroppableDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DraggableHelper), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](DraggableScrollContainerDirective, 8));
};
DroppableDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineDirective"]({
  type: DroppableDirective,
  selectors: [["", "mwlDroppable", ""]],
  inputs: {
    dragOverClass: "dragOverClass",
    dragActiveClass: "dragActiveClass",
    validateDrop: "validateDrop"
  },
  outputs: {
    dragEnter: "dragEnter",
    dragLeave: "dragLeave",
    dragOver: "dragOver",
    drop: "drop"
  }
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DroppableDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Directive,
    args: [{
      selector: '[mwlDroppable]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.ElementRef
    }, {
      type: DraggableHelper
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgZone
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Renderer2
    }, {
      type: DraggableScrollContainerDirective,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Optional
      }]
    }];
  }, {
    dragOverClass: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragActiveClass: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    validateDrop: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Input
    }],
    dragEnter: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragLeave: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    dragOver: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }],
    drop: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.Output
    }]
  });
})();
class DragAndDropModule {}
DragAndDropModule.ɵfac = function DragAndDropModule_Factory(t) {
  return new (t || DragAndDropModule)();
};
DragAndDropModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
  type: DragAndDropModule
});
DragAndDropModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵsetClassMetadata"](DragAndDropModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_2__.NgModule,
    args: [{
      declarations: [DraggableDirective, DroppableDirective, DraggableScrollContainerDirective],
      exports: [DraggableDirective, DroppableDirective, DraggableScrollContainerDirective]
    }]
  }], null, null);
})();

/*
 * Public API Surface of angular-draggable-droppable
 */

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=angular-draggable-droppable.mjs.map

/***/ }),

/***/ 59843:
/*!***************************************************************************************!*\
  !*** ./node_modules/angular-resizable-element/fesm2020/angular-resizable-element.mjs ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ResizableDirective: () => (/* binding */ ResizableDirective),
/* harmony export */   ResizableModule: () => (/* binding */ ResizableModule),
/* harmony export */   ResizeHandleDirective: () => (/* binding */ ResizeHandleDirective)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 63617);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! rxjs */ 43942);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! rxjs */ 18537);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 98764);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs/operators */ 71870);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs/operators */ 13255);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 64334);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 5057);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 51567);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 33900);






/**
 * @hidden
 */
const IS_TOUCH_DEVICE = (() => {
  // In case we're in Node.js environment.
  if (typeof window === 'undefined') {
    return false;
  } else {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
  }
})();

/** Creates a deep clone of an element. */
function deepCloneNode(node) {
  const clone = node.cloneNode(true);
  const descendantsWithId = clone.querySelectorAll('[id]');
  const nodeName = node.nodeName.toLowerCase();
  // Remove the `id` to avoid having multiple elements with the same id on the page.
  clone.removeAttribute('id');
  descendantsWithId.forEach(descendant => {
    descendant.removeAttribute('id');
  });
  if (nodeName === 'canvas') {
    transferCanvasData(node, clone);
  } else if (nodeName === 'input' || nodeName === 'select' || nodeName === 'textarea') {
    transferInputData(node, clone);
  }
  transferData('canvas', node, clone, transferCanvasData);
  transferData('input, textarea, select', node, clone, transferInputData);
  return clone;
}
/** Matches elements between an element and its clone and allows for their data to be cloned. */
function transferData(selector, node, clone, callback) {
  const descendantElements = node.querySelectorAll(selector);
  if (descendantElements.length) {
    const cloneElements = clone.querySelectorAll(selector);
    for (let i = 0; i < descendantElements.length; i++) {
      callback(descendantElements[i], cloneElements[i]);
    }
  }
}
// Counter for unique cloned radio button names.
let cloneUniqueId = 0;
/** Transfers the data of one input element to another. */
function transferInputData(source, clone) {
  // Browsers throw an error when assigning the value of a file input programmatically.
  if (clone.type !== 'file') {
    clone.value = source.value;
  }
  // Radio button `name` attributes must be unique for radio button groups
  // otherwise original radio buttons can lose their checked state
  // once the clone is inserted in the DOM.
  if (clone.type === 'radio' && clone.name) {
    clone.name = `mat-clone-${clone.name}-${cloneUniqueId++}`;
  }
}
/** Transfers the data of one canvas element to another. */
function transferCanvasData(source, clone) {
  const context = clone.getContext('2d');
  if (context) {
    // In some cases `drawImage` can throw (e.g. if the canvas size is 0x0).
    // We can't do much about it so just ignore the error.
    try {
      context.drawImage(source, 0, 0);
    } catch {}
  }
}
function getNewBoundingRectangle(startingRect, edges, clientX, clientY) {
  const newBoundingRect = {
    top: startingRect.top,
    bottom: startingRect.bottom,
    left: startingRect.left,
    right: startingRect.right
  };
  if (edges.top) {
    newBoundingRect.top += clientY;
  }
  if (edges.bottom) {
    newBoundingRect.bottom += clientY;
  }
  if (edges.left) {
    newBoundingRect.left += clientX;
  }
  if (edges.right) {
    newBoundingRect.right += clientX;
  }
  newBoundingRect.height = newBoundingRect.bottom - newBoundingRect.top;
  newBoundingRect.width = newBoundingRect.right - newBoundingRect.left;
  return newBoundingRect;
}
function getElementRect(element, ghostElementPositioning) {
  let translateX = 0;
  let translateY = 0;
  const style = element.nativeElement.style;
  const transformProperties = ['transform', '-ms-transform', '-moz-transform', '-o-transform'];
  const transform = transformProperties.map(property => style[property]).find(value => !!value);
  if (transform && transform.includes('translate')) {
    translateX = transform.replace(/.*translate3?d?\((-?[0-9]*)px, (-?[0-9]*)px.*/, '$1');
    translateY = transform.replace(/.*translate3?d?\((-?[0-9]*)px, (-?[0-9]*)px.*/, '$2');
  }
  if (ghostElementPositioning === 'absolute') {
    return {
      height: element.nativeElement.offsetHeight,
      width: element.nativeElement.offsetWidth,
      top: element.nativeElement.offsetTop - translateY,
      bottom: element.nativeElement.offsetHeight + element.nativeElement.offsetTop - translateY,
      left: element.nativeElement.offsetLeft - translateX,
      right: element.nativeElement.offsetWidth + element.nativeElement.offsetLeft - translateX
    };
  } else {
    const boundingRect = element.nativeElement.getBoundingClientRect();
    return {
      height: boundingRect.height,
      width: boundingRect.width,
      top: boundingRect.top - translateY,
      bottom: boundingRect.bottom - translateY,
      left: boundingRect.left - translateX,
      right: boundingRect.right - translateX,
      scrollTop: element.nativeElement.scrollTop,
      scrollLeft: element.nativeElement.scrollLeft
    };
  }
}
const DEFAULT_RESIZE_CURSORS = Object.freeze({
  topLeft: 'nw-resize',
  topRight: 'ne-resize',
  bottomLeft: 'sw-resize',
  bottomRight: 'se-resize',
  leftOrRight: 'col-resize',
  topOrBottom: 'row-resize'
});
function getResizeCursor(edges, cursors) {
  if (edges.left && edges.top) {
    return cursors.topLeft;
  } else if (edges.right && edges.top) {
    return cursors.topRight;
  } else if (edges.left && edges.bottom) {
    return cursors.bottomLeft;
  } else if (edges.right && edges.bottom) {
    return cursors.bottomRight;
  } else if (edges.left || edges.right) {
    return cursors.leftOrRight;
  } else if (edges.top || edges.bottom) {
    return cursors.topOrBottom;
  } else {
    return '';
  }
}
function getEdgesDiff({
  edges,
  initialRectangle,
  newRectangle
}) {
  const edgesDiff = {};
  Object.keys(edges).forEach(edge => {
    edgesDiff[edge] = (newRectangle[edge] || 0) - (initialRectangle[edge] || 0);
  });
  return edgesDiff;
}
const RESIZE_ACTIVE_CLASS = 'resize-active';
const RESIZE_GHOST_ELEMENT_CLASS = 'resize-ghost-element';
const MOUSE_MOVE_THROTTLE_MS = 50;
/**
 * Place this on an element to make it resizable. For example:
 *
 * ```html
 * <div
 *   mwlResizable
 *   [resizeEdges]="{bottom: true, right: true, top: true, left: true}"
 *   [enableGhostResize]="true">
 * </div>
 * ```
 * Or in case they are sibling elements:
 * ```html
 * <div mwlResizable #resizableElement="mwlResizable"></div>
 * <div mwlResizeHandle [resizableContainer]="resizableElement" [resizeEdges]="{bottom: true, right: true}"></div>
 * ```
 */
class ResizableDirective {
  /**
   * @hidden
   */
  constructor(platformId, renderer, elm, zone) {
    this.platformId = platformId;
    this.renderer = renderer;
    this.elm = elm;
    this.zone = zone;
    /**
     * Set to `true` to enable a temporary resizing effect of the element in between the `resizeStart` and `resizeEnd` events.
     */
    this.enableGhostResize = false;
    /**
     * A snap grid that resize events will be locked to.
     *
     * e.g. to only allow the element to be resized every 10px set it to `{left: 10, right: 10}`
     */
    this.resizeSnapGrid = {};
    /**
     * The mouse cursors that will be set on the resize edges
     */
    this.resizeCursors = DEFAULT_RESIZE_CURSORS;
    /**
     * Define the positioning of the ghost element (can be fixed or absolute)
     */
    this.ghostElementPositioning = 'fixed';
    /**
     * Allow elements to be resized to negative dimensions
     */
    this.allowNegativeResizes = false;
    /**
     * The mouse move throttle in milliseconds, default: 50 ms
     */
    this.mouseMoveThrottleMS = MOUSE_MOVE_THROTTLE_MS;
    /**
     * Called when the mouse is pressed and a resize event is about to begin. `$event` is a `ResizeEvent` object.
     */
    this.resizeStart = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /**
     * Called as the mouse is dragged after a resize event has begun. `$event` is a `ResizeEvent` object.
     */
    this.resizing = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /**
     * Called after the mouse is released after a resize event. `$event` is a `ResizeEvent` object.
     */
    this.resizeEnd = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    /**
     * @hidden
     */
    this.mouseup = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    /**
     * @hidden
     */
    this.mousedown = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    /**
     * @hidden
     */
    this.mousemove = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.pointerEventListeners = PointerEventListeners.getInstance(renderer, zone);
  }
  /**
   * @hidden
   */
  ngOnInit() {
    const mousedown$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(this.pointerEventListeners.pointerDown, this.mousedown);
    const mousemove$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(this.pointerEventListeners.pointerMove, this.mousemove).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.tap)(({
      event
    }) => {
      if (currentResize && event.cancelable) {
        event.preventDefault();
      }
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.share)());
    const mouseup$ = (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(this.pointerEventListeners.pointerUp, this.mouseup);
    let currentResize;
    const removeGhostElement = () => {
      if (currentResize && currentResize.clonedNode) {
        this.elm.nativeElement.parentElement.removeChild(currentResize.clonedNode);
        this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'inherit');
      }
    };
    const getResizeCursors = () => {
      return {
        ...DEFAULT_RESIZE_CURSORS,
        ...this.resizeCursors
      };
    };
    const mousedrag = mousedown$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_5__.mergeMap)(startCoords => {
      function getDiff(moveCoords) {
        return {
          clientX: moveCoords.clientX - startCoords.clientX,
          clientY: moveCoords.clientY - startCoords.clientY
        };
      }
      const getSnapGrid = () => {
        const snapGrid = {
          x: 1,
          y: 1
        };
        if (currentResize) {
          if (this.resizeSnapGrid.left && currentResize.edges.left) {
            snapGrid.x = +this.resizeSnapGrid.left;
          } else if (this.resizeSnapGrid.right && currentResize.edges.right) {
            snapGrid.x = +this.resizeSnapGrid.right;
          }
          if (this.resizeSnapGrid.top && currentResize.edges.top) {
            snapGrid.y = +this.resizeSnapGrid.top;
          } else if (this.resizeSnapGrid.bottom && currentResize.edges.bottom) {
            snapGrid.y = +this.resizeSnapGrid.bottom;
          }
        }
        return snapGrid;
      };
      function getGrid(coords, snapGrid) {
        return {
          x: Math.ceil(coords.clientX / snapGrid.x),
          y: Math.ceil(coords.clientY / snapGrid.y)
        };
      }
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(mousemove$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.take)(1)).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(coords => [, coords])), mousemove$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.pairwise)())).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(([previousCoords, newCoords]) => {
        return [previousCoords ? getDiff(previousCoords) : previousCoords, getDiff(newCoords)];
      })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(([previousCoords, newCoords]) => {
        if (!previousCoords) {
          return true;
        }
        const snapGrid = getSnapGrid();
        const previousGrid = getGrid(previousCoords, snapGrid);
        const newGrid = getGrid(newCoords, snapGrid);
        return previousGrid.x !== newGrid.x || previousGrid.y !== newGrid.y;
      })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(([, newCoords]) => {
        const snapGrid = getSnapGrid();
        return {
          clientX: Math.round(newCoords.clientX / snapGrid.x) * snapGrid.x,
          clientY: Math.round(newCoords.clientY / snapGrid.y) * snapGrid.y
        };
      })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(mouseup$, mousedown$)));
    })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(() => !!currentResize));
    mousedrag.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(({
      clientX,
      clientY
    }) => {
      return getNewBoundingRectangle(currentResize.startingRect, currentResize.edges, clientX, clientY);
    })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(newBoundingRect => {
      return this.allowNegativeResizes || !!(newBoundingRect.height && newBoundingRect.width && newBoundingRect.height > 0 && newBoundingRect.width > 0);
    })).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(newBoundingRect => {
      return this.validateResize ? this.validateResize({
        rectangle: newBoundingRect,
        edges: getEdgesDiff({
          edges: currentResize.edges,
          initialRectangle: currentResize.startingRect,
          newRectangle: newBoundingRect
        })
      }) : true;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe(newBoundingRect => {
      if (currentResize && currentResize.clonedNode) {
        this.renderer.setStyle(currentResize.clonedNode, 'height', `${newBoundingRect.height}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'width', `${newBoundingRect.width}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'top', `${newBoundingRect.top}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'left', `${newBoundingRect.left}px`);
      }
      if (this.resizing.observers.length > 0) {
        this.zone.run(() => {
          this.resizing.emit({
            edges: getEdgesDiff({
              edges: currentResize.edges,
              initialRectangle: currentResize.startingRect,
              newRectangle: newBoundingRect
            }),
            rectangle: newBoundingRect
          });
        });
      }
      currentResize.currentRect = newBoundingRect;
    });
    mousedown$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.map)(({
      edges
    }) => {
      return edges || {};
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.filter)(edges => {
      return Object.keys(edges).length > 0;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe(edges => {
      if (currentResize) {
        removeGhostElement();
      }
      const startingRect = getElementRect(this.elm, this.ghostElementPositioning);
      currentResize = {
        edges,
        startingRect,
        currentRect: startingRect
      };
      const resizeCursors = getResizeCursors();
      const cursor = getResizeCursor(currentResize.edges, resizeCursors);
      this.renderer.setStyle(document.body, 'cursor', cursor);
      this.setElementClass(this.elm, RESIZE_ACTIVE_CLASS, true);
      if (this.enableGhostResize) {
        currentResize.clonedNode = deepCloneNode(this.elm.nativeElement);
        this.elm.nativeElement.parentElement.appendChild(currentResize.clonedNode);
        this.renderer.setStyle(this.elm.nativeElement, 'visibility', 'hidden');
        this.renderer.setStyle(currentResize.clonedNode, 'position', this.ghostElementPositioning);
        this.renderer.setStyle(currentResize.clonedNode, 'left', `${currentResize.startingRect.left}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'top', `${currentResize.startingRect.top}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'height', `${currentResize.startingRect.height}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'width', `${currentResize.startingRect.width}px`);
        this.renderer.setStyle(currentResize.clonedNode, 'cursor', getResizeCursor(currentResize.edges, resizeCursors));
        this.renderer.addClass(currentResize.clonedNode, RESIZE_GHOST_ELEMENT_CLASS);
        currentResize.clonedNode.scrollTop = currentResize.startingRect.scrollTop;
        currentResize.clonedNode.scrollLeft = currentResize.startingRect.scrollLeft;
      }
      if (this.resizeStart.observers.length > 0) {
        this.zone.run(() => {
          this.resizeStart.emit({
            edges: getEdgesDiff({
              edges,
              initialRectangle: startingRect,
              newRectangle: startingRect
            }),
            rectangle: getNewBoundingRectangle(startingRect, {}, 0, 0)
          });
        });
      }
    });
    mouseup$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$)).subscribe(() => {
      if (currentResize) {
        this.renderer.removeClass(this.elm.nativeElement, RESIZE_ACTIVE_CLASS);
        this.renderer.setStyle(document.body, 'cursor', '');
        this.renderer.setStyle(this.elm.nativeElement, 'cursor', '');
        if (this.resizeEnd.observers.length > 0) {
          this.zone.run(() => {
            this.resizeEnd.emit({
              edges: getEdgesDiff({
                edges: currentResize.edges,
                initialRectangle: currentResize.startingRect,
                newRectangle: currentResize.currentRect
              }),
              rectangle: currentResize.currentRect
            });
          });
        }
        removeGhostElement();
        currentResize = null;
      }
    });
  }
  /**
   * @hidden
   */
  ngOnDestroy() {
    // browser check for angular universal, because it doesn't know what document is
    if ((0,_angular_common__WEBPACK_IMPORTED_MODULE_11__.isPlatformBrowser)(this.platformId)) {
      this.renderer.setStyle(document.body, 'cursor', '');
    }
    this.mousedown.complete();
    this.mouseup.complete();
    this.mousemove.complete();
    this.destroy$.next();
  }
  setElementClass(elm, name, add) {
    if (add) {
      this.renderer.addClass(elm.nativeElement, name);
    } else {
      this.renderer.removeClass(elm.nativeElement, name);
    }
  }
}
ResizableDirective.ɵfac = function ResizableDirective_Factory(t) {
  return new (t || ResizableDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.PLATFORM_ID), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone));
};
ResizableDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
  type: ResizableDirective,
  selectors: [["", "mwlResizable", ""]],
  inputs: {
    validateResize: "validateResize",
    enableGhostResize: "enableGhostResize",
    resizeSnapGrid: "resizeSnapGrid",
    resizeCursors: "resizeCursors",
    ghostElementPositioning: "ghostElementPositioning",
    allowNegativeResizes: "allowNegativeResizes",
    mouseMoveThrottleMS: "mouseMoveThrottleMS"
  },
  outputs: {
    resizeStart: "resizeStart",
    resizing: "resizing",
    resizeEnd: "resizeEnd"
  },
  exportAs: ["mwlResizable"]
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ResizableDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: '[mwlResizable]',
      exportAs: 'mwlResizable'
    }]
  }], function () {
    return [{
      type: undefined,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_0__.PLATFORM_ID]
      }]
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone
    }];
  }, {
    validateResize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    enableGhostResize: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    resizeSnapGrid: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    resizeCursors: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    ghostElementPositioning: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    allowNegativeResizes: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    mouseMoveThrottleMS: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    resizeStart: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    resizing: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    resizeEnd: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }]
  });
})();
class PointerEventListeners {
  constructor(renderer, zone) {
    this.pointerDown = new rxjs__WEBPACK_IMPORTED_MODULE_12__.Observable(observer => {
      let unsubscribeMouseDown;
      let unsubscribeTouchStart;
      zone.runOutsideAngular(() => {
        unsubscribeMouseDown = renderer.listen('document', 'mousedown', event => {
          observer.next({
            clientX: event.clientX,
            clientY: event.clientY,
            event
          });
        });
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchStart = renderer.listen('document', 'touchstart', event => {
            observer.next({
              clientX: event.touches[0].clientX,
              clientY: event.touches[0].clientY,
              event
            });
          });
        }
      });
      return () => {
        unsubscribeMouseDown();
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchStart();
        }
      };
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.share)());
    this.pointerMove = new rxjs__WEBPACK_IMPORTED_MODULE_12__.Observable(observer => {
      let unsubscribeMouseMove;
      let unsubscribeTouchMove;
      zone.runOutsideAngular(() => {
        unsubscribeMouseMove = renderer.listen('document', 'mousemove', event => {
          observer.next({
            clientX: event.clientX,
            clientY: event.clientY,
            event
          });
        });
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchMove = renderer.listen('document', 'touchmove', event => {
            observer.next({
              clientX: event.targetTouches[0].clientX,
              clientY: event.targetTouches[0].clientY,
              event
            });
          });
        }
      });
      return () => {
        unsubscribeMouseMove();
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchMove();
        }
      };
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.share)());
    this.pointerUp = new rxjs__WEBPACK_IMPORTED_MODULE_12__.Observable(observer => {
      let unsubscribeMouseUp;
      let unsubscribeTouchEnd;
      let unsubscribeTouchCancel;
      zone.runOutsideAngular(() => {
        unsubscribeMouseUp = renderer.listen('document', 'mouseup', event => {
          observer.next({
            clientX: event.clientX,
            clientY: event.clientY,
            event
          });
        });
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchEnd = renderer.listen('document', 'touchend', event => {
            observer.next({
              clientX: event.changedTouches[0].clientX,
              clientY: event.changedTouches[0].clientY,
              event
            });
          });
          unsubscribeTouchCancel = renderer.listen('document', 'touchcancel', event => {
            observer.next({
              clientX: event.changedTouches[0].clientX,
              clientY: event.changedTouches[0].clientY,
              event
            });
          });
        }
      });
      return () => {
        unsubscribeMouseUp();
        if (IS_TOUCH_DEVICE) {
          unsubscribeTouchEnd();
          unsubscribeTouchCancel();
        }
      };
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_4__.share)());
  }
  static getInstance(renderer, zone) {
    if (!PointerEventListeners.instance) {
      PointerEventListeners.instance = new PointerEventListeners(renderer, zone);
    }
    return PointerEventListeners.instance;
  }
}

/**
 * An element placed inside a `mwlResizable` directive to be used as a drag and resize handle
 *
 * For example
 *
 * ```html
 * <div mwlResizable>
 *   <div mwlResizeHandle [resizeEdges]="{bottom: true, right: true}"></div>
 * </div>
 * ```
 * Or in case they are sibling elements:
 * ```html
 * <div mwlResizable #resizableElement="mwlResizable"></div>
 * <div mwlResizeHandle [resizableContainer]="resizableElement" [resizeEdges]="{bottom: true, right: true}"></div>
 * ```
 */
class ResizeHandleDirective {
  constructor(renderer, element, zone, resizableDirective) {
    this.renderer = renderer;
    this.element = element;
    this.zone = zone;
    this.resizableDirective = resizableDirective;
    /**
     * The `Edges` object that contains the edges of the parent element that dragging the handle will trigger a resize on
     */
    this.resizeEdges = {};
    this.eventListeners = {};
    this.destroy$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
  }
  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.listenOnTheHost('mousedown').subscribe(event => {
        this.onMousedown(event, event.clientX, event.clientY);
      });
      this.listenOnTheHost('mouseup').subscribe(event => {
        this.onMouseup(event.clientX, event.clientY);
      });
      if (IS_TOUCH_DEVICE) {
        this.listenOnTheHost('touchstart').subscribe(event => {
          this.onMousedown(event, event.touches[0].clientX, event.touches[0].clientY);
        });
        (0,rxjs__WEBPACK_IMPORTED_MODULE_2__.merge)(this.listenOnTheHost('touchend'), this.listenOnTheHost('touchcancel')).subscribe(event => {
          this.onMouseup(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
        });
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.unsubscribeEventListeners();
  }
  /**
   * @hidden
   */
  onMousedown(event, clientX, clientY) {
    if (event.cancelable) {
      event.preventDefault();
    }
    if (!this.eventListeners.touchmove) {
      this.eventListeners.touchmove = this.renderer.listen(this.element.nativeElement, 'touchmove', touchMoveEvent => {
        this.onMousemove(touchMoveEvent, touchMoveEvent.targetTouches[0].clientX, touchMoveEvent.targetTouches[0].clientY);
      });
    }
    if (!this.eventListeners.mousemove) {
      this.eventListeners.mousemove = this.renderer.listen(this.element.nativeElement, 'mousemove', mouseMoveEvent => {
        this.onMousemove(mouseMoveEvent, mouseMoveEvent.clientX, mouseMoveEvent.clientY);
      });
    }
    this.resizable.mousedown.next({
      clientX,
      clientY,
      edges: this.resizeEdges
    });
  }
  /**
   * @hidden
   */
  onMouseup(clientX, clientY) {
    this.unsubscribeEventListeners();
    this.resizable.mouseup.next({
      clientX,
      clientY,
      edges: this.resizeEdges
    });
  }
  // directive might be passed from DI or as an input
  get resizable() {
    return this.resizableDirective || this.resizableContainer;
  }
  onMousemove(event, clientX, clientY) {
    this.resizable.mousemove.next({
      clientX,
      clientY,
      edges: this.resizeEdges,
      event
    });
  }
  unsubscribeEventListeners() {
    Object.keys(this.eventListeners).forEach(type => {
      this.eventListeners[type]();
      delete this.eventListeners[type];
    });
  }
  listenOnTheHost(eventName) {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_13__.fromEvent)(this.element.nativeElement, eventName).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.takeUntil)(this.destroy$));
  }
}
ResizeHandleDirective.ɵfac = function ResizeHandleDirective_Factory(t) {
  return new (t || ResizeHandleDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](ResizableDirective, 8));
};
ResizeHandleDirective.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
  type: ResizeHandleDirective,
  selectors: [["", "mwlResizeHandle", ""]],
  inputs: {
    resizeEdges: "resizeEdges",
    resizableContainer: "resizableContainer"
  }
});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ResizeHandleDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: '[mwlResizeHandle]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ElementRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone
    }, {
      type: ResizableDirective,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Optional
      }]
    }];
  }, {
    resizeEdges: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    resizableContainer: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }]
  });
})();
class ResizableModule {}
ResizableModule.ɵfac = function ResizableModule_Factory(t) {
  return new (t || ResizableModule)();
};
ResizableModule.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
  type: ResizableModule
});
ResizableModule.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({});
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](ResizableModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
    args: [{
      declarations: [ResizableDirective, ResizeHandleDirective],
      exports: [ResizableDirective, ResizeHandleDirective]
    }]
  }], null, null);
})();

/*
 * Public API Surface of angular-resizable-element
 */

/**
 * Generated bundle index. Do not edit.
 */


//# sourceMappingURL=angular-resizable-element.mjs.map

/***/ }),

/***/ 19857:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/_lib/defaultOptions.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getDefaultOptions: () => (/* binding */ getDefaultOptions),
/* harmony export */   setDefaultOptions: () => (/* binding */ setDefaultOptions)
/* harmony export */ });
let defaultOptions = {};
function getDefaultOptions() {
  return defaultOptions;
}
function setDefaultOptions(newOptions) {
  defaultOptions = newOptions;
}

/***/ }),

/***/ 65225:
/*!**********************************************************!*\
  !*** ./node_modules/date-fns/_lib/getRoundingMethod.mjs ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getRoundingMethod: () => (/* binding */ getRoundingMethod)
/* harmony export */ });
function getRoundingMethod(method) {
  return number => {
    const round = method ? Math[method] : Math.trunc;
    const result = round(number);
    // Prevent negative zero
    return result === 0 ? 0 : result;
  };
}

/***/ }),

/***/ 88889:
/*!************************************************************************!*\
  !*** ./node_modules/date-fns/_lib/getTimezoneOffsetInMilliseconds.mjs ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTimezoneOffsetInMilliseconds: () => (/* binding */ getTimezoneOffsetInMilliseconds)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../toDate.mjs */ 58700);


/**
 * Google Chrome as of 67.0.3396.87 introduced timezones with offset that includes seconds.
 * They usually appear for dates that denote time before the timezones were introduced
 * (e.g. for 'Europe/Prague' timezone the offset is GMT+00:57:44 before 1 October 1891
 * and GMT+01:00:00 after that date)
 *
 * Date#getTimezoneOffset returns the offset in minutes and would return 57 for the example above,
 * which would lead to incorrect calculations.
 *
 * This function returns the timezone offset in milliseconds that takes seconds in account.
 */
function getTimezoneOffsetInMilliseconds(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const utcDate = new Date(Date.UTC(_date.getFullYear(), _date.getMonth(), _date.getDate(), _date.getHours(), _date.getMinutes(), _date.getSeconds(), _date.getMilliseconds()));
  utcDate.setUTCFullYear(_date.getFullYear());
  return +date - +utcDate;
}

/***/ }),

/***/ 28797:
/*!*******************************************!*\
  !*** ./node_modules/date-fns/addDays.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addDays: () => (/* binding */ addDays),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);
/* harmony import */ var _constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructFrom.mjs */ 56814);



/**
 * @name addDays
 * @category Day Helpers
 * @summary Add the specified number of days to the given date.
 *
 * @description
 * Add the specified number of days to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of days to be added.
 *
 * @returns The new date with the days added
 *
 * @example
 * // Add 10 days to 1 September 2014:
 * const result = addDays(new Date(2014, 8, 1), 10)
 * //=> Thu Sep 11 2014 00:00:00
 */
function addDays(date, amount) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  if (isNaN(amount)) return (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, NaN);
  if (!amount) {
    // If 0 days, no-op to avoid changing times in the hour before end of DST
    return _date;
  }
  _date.setDate(_date.getDate() + amount);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addDays);

/***/ }),

/***/ 29533:
/*!********************************************!*\
  !*** ./node_modules/date-fns/addHours.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addHours: () => (/* binding */ addHours),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _addMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addMilliseconds.mjs */ 81962);
/* harmony import */ var _constants_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.mjs */ 87870);



/**
 * @name addHours
 * @category Hour Helpers
 * @summary Add the specified number of hours to the given date.
 *
 * @description
 * Add the specified number of hours to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of hours to be added.
 *
 * @returns The new date with the hours added
 *
 * @example
 * // Add 2 hours to 10 July 2014 23:00:00:
 * const result = addHours(new Date(2014, 6, 10, 23, 0), 2)
 * //=> Fri Jul 11 2014 01:00:00
 */
function addHours(date, amount) {
  return (0,_addMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__.addMilliseconds)(date, amount * _constants_mjs__WEBPACK_IMPORTED_MODULE_1__.millisecondsInHour);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addHours);

/***/ }),

/***/ 81962:
/*!***************************************************!*\
  !*** ./node_modules/date-fns/addMilliseconds.mjs ***!
  \***************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addMilliseconds: () => (/* binding */ addMilliseconds),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);
/* harmony import */ var _constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructFrom.mjs */ 56814);



/**
 * @name addMilliseconds
 * @category Millisecond Helpers
 * @summary Add the specified number of milliseconds to the given date.
 *
 * @description
 * Add the specified number of milliseconds to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of milliseconds to be added.
 *
 * @returns The new date with the milliseconds added
 *
 * @example
 * // Add 750 milliseconds to 10 July 2014 12:45:30.000:
 * const result = addMilliseconds(new Date(2014, 6, 10, 12, 45, 30, 0), 750)
 * //=> Thu Jul 10 2014 12:45:30.750
 */
function addMilliseconds(date, amount) {
  const timestamp = +(0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  return (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, timestamp + amount);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addMilliseconds);

/***/ }),

/***/ 49675:
/*!**********************************************!*\
  !*** ./node_modules/date-fns/addMinutes.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addMinutes: () => (/* binding */ addMinutes),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _addMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addMilliseconds.mjs */ 81962);
/* harmony import */ var _constants_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.mjs */ 87870);



/**
 * @name addMinutes
 * @category Minute Helpers
 * @summary Add the specified number of minutes to the given date.
 *
 * @description
 * Add the specified number of minutes to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of minutes to be added.
 *
 * @returns The new date with the minutes added
 *
 * @example
 * // Add 30 minutes to 10 July 2014 12:00:00:
 * const result = addMinutes(new Date(2014, 6, 10, 12, 0), 30)
 * //=> Thu Jul 10 2014 12:30:00
 */
function addMinutes(date, amount) {
  return (0,_addMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__.addMilliseconds)(date, amount * _constants_mjs__WEBPACK_IMPORTED_MODULE_1__.millisecondsInMinute);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addMinutes);

/***/ }),

/***/ 36337:
/*!*********************************************!*\
  !*** ./node_modules/date-fns/addMonths.mjs ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addMonths: () => (/* binding */ addMonths),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);
/* harmony import */ var _constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructFrom.mjs */ 56814);



/**
 * @name addMonths
 * @category Month Helpers
 * @summary Add the specified number of months to the given date.
 *
 * @description
 * Add the specified number of months to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of months to be added.
 *
 * @returns The new date with the months added
 *
 * @example
 * // Add 5 months to 1 September 2014:
 * const result = addMonths(new Date(2014, 8, 1), 5)
 * //=> Sun Feb 01 2015 00:00:00
 *
 * // Add one month to 30 January 2023:
 * const result = addMonths(new Date(2023, 0, 30), 1)
 * //=> Tue Feb 28 2023 00:00:00
 */
function addMonths(date, amount) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  if (isNaN(amount)) return (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, NaN);
  if (!amount) {
    // If 0 months, no-op to avoid changing times in the hour before end of DST
    return _date;
  }
  const dayOfMonth = _date.getDate();

  // The JS Date object supports date math by accepting out-of-bounds values for
  // month, day, etc. For example, new Date(2020, 0, 0) returns 31 Dec 2019 and
  // new Date(2020, 13, 1) returns 1 Feb 2021.  This is *almost* the behavior we
  // want except that dates will wrap around the end of a month, meaning that
  // new Date(2020, 13, 31) will return 3 Mar 2021 not 28 Feb 2021 as desired. So
  // we'll default to the end of the desired month by adding 1 to the desired
  // month and using a date of 0 to back up one day to the end of the desired
  // month.
  const endOfDesiredMonth = (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, _date.getTime());
  endOfDesiredMonth.setMonth(_date.getMonth() + amount + 1, 0);
  const daysInMonth = endOfDesiredMonth.getDate();
  if (dayOfMonth >= daysInMonth) {
    // If we're already at the end of the month, then this is the correct date
    // and we're done.
    return endOfDesiredMonth;
  } else {
    // Otherwise, we now know that setting the original day-of-month value won't
    // cause an overflow, so set the desired day-of-month. Note that we can't
    // just set the date of `endOfDesiredMonth` because that object may have had
    // its time changed in the unusual case where where a DST transition was on
    // the last day of the month and its local time was in the hour skipped or
    // repeated next to a DST transition.  So we use `date` instead which is
    // guaranteed to still have the original time.
    _date.setFullYear(endOfDesiredMonth.getFullYear(), endOfDesiredMonth.getMonth(), dayOfMonth);
    return _date;
  }
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addMonths);

/***/ }),

/***/ 75859:
/*!**********************************************!*\
  !*** ./node_modules/date-fns/addSeconds.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addSeconds: () => (/* binding */ addSeconds),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _addMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addMilliseconds.mjs */ 81962);


/**
 * @name addSeconds
 * @category Second Helpers
 * @summary Add the specified number of seconds to the given date.
 *
 * @description
 * Add the specified number of seconds to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of seconds to be added.
 *
 * @returns The new date with the seconds added
 *
 * @example
 * // Add 30 seconds to 10 July 2014 12:45:00:
 * const result = addSeconds(new Date(2014, 6, 10, 12, 45, 0), 30)
 * //=> Thu Jul 10 2014 12:45:30
 */
function addSeconds(date, amount) {
  return (0,_addMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__.addMilliseconds)(date, amount * 1000);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addSeconds);

/***/ }),

/***/ 6243:
/*!********************************************!*\
  !*** ./node_modules/date-fns/addWeeks.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addWeeks: () => (/* binding */ addWeeks),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _addDays_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addDays.mjs */ 28797);


/**
 * @name addWeeks
 * @category Week Helpers
 * @summary Add the specified number of weeks to the given date.
 *
 * @description
 * Add the specified number of week to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of weeks to be added.
 *
 * @returns The new date with the weeks added
 *
 * @example
 * // Add 4 weeks to 1 September 2014:
 * const result = addWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Sep 29 2014 00:00:00
 */
function addWeeks(date, amount) {
  const days = amount * 7;
  return (0,_addDays_mjs__WEBPACK_IMPORTED_MODULE_0__.addDays)(date, days);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (addWeeks);

/***/ }),

/***/ 87870:
/*!*********************************************!*\
  !*** ./node_modules/date-fns/constants.mjs ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   daysInWeek: () => (/* binding */ daysInWeek),
/* harmony export */   daysInYear: () => (/* binding */ daysInYear),
/* harmony export */   maxTime: () => (/* binding */ maxTime),
/* harmony export */   millisecondsInDay: () => (/* binding */ millisecondsInDay),
/* harmony export */   millisecondsInHour: () => (/* binding */ millisecondsInHour),
/* harmony export */   millisecondsInMinute: () => (/* binding */ millisecondsInMinute),
/* harmony export */   millisecondsInSecond: () => (/* binding */ millisecondsInSecond),
/* harmony export */   millisecondsInWeek: () => (/* binding */ millisecondsInWeek),
/* harmony export */   minTime: () => (/* binding */ minTime),
/* harmony export */   minutesInDay: () => (/* binding */ minutesInDay),
/* harmony export */   minutesInHour: () => (/* binding */ minutesInHour),
/* harmony export */   minutesInMonth: () => (/* binding */ minutesInMonth),
/* harmony export */   minutesInYear: () => (/* binding */ minutesInYear),
/* harmony export */   monthsInQuarter: () => (/* binding */ monthsInQuarter),
/* harmony export */   monthsInYear: () => (/* binding */ monthsInYear),
/* harmony export */   quartersInYear: () => (/* binding */ quartersInYear),
/* harmony export */   secondsInDay: () => (/* binding */ secondsInDay),
/* harmony export */   secondsInHour: () => (/* binding */ secondsInHour),
/* harmony export */   secondsInMinute: () => (/* binding */ secondsInMinute),
/* harmony export */   secondsInMonth: () => (/* binding */ secondsInMonth),
/* harmony export */   secondsInQuarter: () => (/* binding */ secondsInQuarter),
/* harmony export */   secondsInWeek: () => (/* binding */ secondsInWeek),
/* harmony export */   secondsInYear: () => (/* binding */ secondsInYear)
/* harmony export */ });
/**
 * @module constants
 * @summary Useful constants
 * @description
 * Collection of useful date constants.
 *
 * The constants could be imported from `date-fns/constants`:
 *
 * ```ts
 * import { maxTime, minTime } from "./constants/date-fns/constants";
 *
 * function isAllowedTime(time) {
 *   return time <= maxTime && time >= minTime;
 * }
 * ```
 */

/**
 * @constant
 * @name daysInWeek
 * @summary Days in 1 week.
 */
const daysInWeek = 7;

/**
 * @constant
 * @name daysInYear
 * @summary Days in 1 year.
 *
 * @description
 * How many days in a year.
 *
 * One years equals 365.2425 days according to the formula:
 *
 * > Leap year occures every 4 years, except for years that are divisable by 100 and not divisable by 400.
 * > 1 mean year = (365+1/4-1/100+1/400) days = 365.2425 days
 */
const daysInYear = 365.2425;

/**
 * @constant
 * @name maxTime
 * @summary Maximum allowed time.
 *
 * @example
 * import { maxTime } from "./constants/date-fns/constants";
 *
 * const isValid = 8640000000000001 <= maxTime;
 * //=> false
 *
 * new Date(8640000000000001);
 * //=> Invalid Date
 */
const maxTime = Math.pow(10, 8) * 24 * 60 * 60 * 1000;

/**
 * @constant
 * @name minTime
 * @summary Minimum allowed time.
 *
 * @example
 * import { minTime } from "./constants/date-fns/constants";
 *
 * const isValid = -8640000000000001 >= minTime;
 * //=> false
 *
 * new Date(-8640000000000001)
 * //=> Invalid Date
 */
const minTime = -maxTime;

/**
 * @constant
 * @name millisecondsInWeek
 * @summary Milliseconds in 1 week.
 */
const millisecondsInWeek = 604800000;

/**
 * @constant
 * @name millisecondsInDay
 * @summary Milliseconds in 1 day.
 */
const millisecondsInDay = 86400000;

/**
 * @constant
 * @name millisecondsInMinute
 * @summary Milliseconds in 1 minute
 */
const millisecondsInMinute = 60000;

/**
 * @constant
 * @name millisecondsInHour
 * @summary Milliseconds in 1 hour
 */
const millisecondsInHour = 3600000;

/**
 * @constant
 * @name millisecondsInSecond
 * @summary Milliseconds in 1 second
 */
const millisecondsInSecond = 1000;

/**
 * @constant
 * @name minutesInYear
 * @summary Minutes in 1 year.
 */
const minutesInYear = 525600;

/**
 * @constant
 * @name minutesInMonth
 * @summary Minutes in 1 month.
 */
const minutesInMonth = 43200;

/**
 * @constant
 * @name minutesInDay
 * @summary Minutes in 1 day.
 */
const minutesInDay = 1440;

/**
 * @constant
 * @name minutesInHour
 * @summary Minutes in 1 hour.
 */
const minutesInHour = 60;

/**
 * @constant
 * @name monthsInQuarter
 * @summary Months in 1 quarter.
 */
const monthsInQuarter = 3;

/**
 * @constant
 * @name monthsInYear
 * @summary Months in 1 year.
 */
const monthsInYear = 12;

/**
 * @constant
 * @name quartersInYear
 * @summary Quarters in 1 year
 */
const quartersInYear = 4;

/**
 * @constant
 * @name secondsInHour
 * @summary Seconds in 1 hour.
 */
const secondsInHour = 3600;

/**
 * @constant
 * @name secondsInMinute
 * @summary Seconds in 1 minute.
 */
const secondsInMinute = 60;

/**
 * @constant
 * @name secondsInDay
 * @summary Seconds in 1 day.
 */
const secondsInDay = secondsInHour * 24;

/**
 * @constant
 * @name secondsInWeek
 * @summary Seconds in 1 week.
 */
const secondsInWeek = secondsInDay * 7;

/**
 * @constant
 * @name secondsInYear
 * @summary Seconds in 1 year.
 */
const secondsInYear = secondsInDay * daysInYear;

/**
 * @constant
 * @name secondsInMonth
 * @summary Seconds in 1 month
 */
const secondsInMonth = secondsInYear / 12;

/**
 * @constant
 * @name secondsInQuarter
 * @summary Seconds in 1 quarter.
 */
const secondsInQuarter = secondsInMonth * 3;

/***/ }),

/***/ 56814:
/*!*************************************************!*\
  !*** ./node_modules/date-fns/constructFrom.mjs ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   constructFrom: () => (/* binding */ constructFrom),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @name constructFrom
 * @category Generic Helpers
 * @summary Constructs a date using the reference date and the value
 *
 * @description
 * The function constructs a new date using the constructor from the reference
 * date and the given value. It helps to build generic functions that accept
 * date extensions.
 *
 * It defaults to `Date` if the passed reference date is a number or a string.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The reference date to take constructor from
 * @param value - The value to create the date
 *
 * @returns Date initialized using the given date and value
 *
 * @example
 * import { constructFrom } from 'date-fns'
 *
 * // A function that clones a date preserving the original type
 * function cloneDate<DateType extends Date(date: DateType): DateType {
 *   return constructFrom(
 *     date, // Use contrustor from the given date
 *     date.getTime() // Use the date value to create a new date
 *   )
 * }
 */
function constructFrom(date, value) {
  if (date instanceof Date) {
    return new date.constructor(value);
  } else {
    return new Date(value);
  }
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (constructFrom);

/***/ }),

/***/ 56248:
/*!************************************************************!*\
  !*** ./node_modules/date-fns/differenceInCalendarDays.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   differenceInCalendarDays: () => (/* binding */ differenceInCalendarDays)
/* harmony export */ });
/* harmony import */ var _constants_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./constants.mjs */ 87870);
/* harmony import */ var _startOfDay_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./startOfDay.mjs */ 33240);
/* harmony import */ var _lib_getTimezoneOffsetInMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_lib/getTimezoneOffsetInMilliseconds.mjs */ 88889);




/**
 * @name differenceInCalendarDays
 * @category Day Helpers
 * @summary Get the number of calendar days between the given dates.
 *
 * @description
 * Get the number of calendar days between the given dates. This means that the times are removed
 * from the dates and then the difference in days is calculated.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of calendar days
 *
 * @example
 * // How many calendar days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInCalendarDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 366
 * // How many calendar days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInCalendarDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 1
 */
function differenceInCalendarDays(dateLeft, dateRight) {
  const startOfDayLeft = (0,_startOfDay_mjs__WEBPACK_IMPORTED_MODULE_0__.startOfDay)(dateLeft);
  const startOfDayRight = (0,_startOfDay_mjs__WEBPACK_IMPORTED_MODULE_0__.startOfDay)(dateRight);
  const timestampLeft = +startOfDayLeft - (0,_lib_getTimezoneOffsetInMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_1__.getTimezoneOffsetInMilliseconds)(startOfDayLeft);
  const timestampRight = +startOfDayRight - (0,_lib_getTimezoneOffsetInMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_1__.getTimezoneOffsetInMilliseconds)(startOfDayRight);

  // Round the number of days to the nearest integer because the number of
  // milliseconds in a day is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round((timestampLeft - timestampRight) / _constants_mjs__WEBPACK_IMPORTED_MODULE_2__.millisecondsInDay);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (differenceInCalendarDays);

/***/ }),

/***/ 71246:
/*!****************************************************!*\
  !*** ./node_modules/date-fns/differenceInDays.mjs ***!
  \****************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   differenceInDays: () => (/* binding */ differenceInDays)
/* harmony export */ });
/* harmony import */ var _differenceInCalendarDays_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./differenceInCalendarDays.mjs */ 56248);
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);



/**
 * @name differenceInDays
 * @category Day Helpers
 * @summary Get the number of full days between the given dates.
 *
 * @description
 * Get the number of full day periods between two dates. Fractional days are
 * truncated towards zero.
 *
 * One "full day" is the distance between a local time in one day to the same
 * local time on the next or previous day. A full day can sometimes be less than
 * or more than 24 hours if a daylight savings change happens between two dates.
 *
 * To ignore DST and only measure exact 24-hour periods, use this instead:
 * `Math.trunc(differenceInHours(dateLeft, dateRight)/24)|0`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of full days according to the local timezone
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:00:00 and 2 July 2012 00:00:00?
 * const result = differenceInDays(
 *   new Date(2012, 6, 2, 0, 0),
 *   new Date(2011, 6, 2, 23, 0)
 * )
 * //=> 365
 *
 * @example
 * // How many full days are between
 * // 2 July 2011 23:59:00 and 3 July 2011 00:01:00?
 * const result = differenceInDays(
 *   new Date(2011, 6, 3, 0, 1),
 *   new Date(2011, 6, 2, 23, 59)
 * )
 * //=> 0
 *
 * @example
 * // How many full days are between
 * // 1 March 2020 0:00 and 1 June 2020 0:00 ?
 * // Note: because local time is used, the
 * // result will always be 92 days, even in
 * // time zones where DST starts and the
 * // period has only 92*24-1 hours.
 * const result = differenceInDays(
 *   new Date(2020, 5, 1),
 *   new Date(2020, 2, 1)
 * )
 * //=> 92
 */
function differenceInDays(dateLeft, dateRight) {
  const _dateLeft = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(dateLeft);
  const _dateRight = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(dateRight);
  const sign = compareLocalAsc(_dateLeft, _dateRight);
  const difference = Math.abs((0,_differenceInCalendarDays_mjs__WEBPACK_IMPORTED_MODULE_1__.differenceInCalendarDays)(_dateLeft, _dateRight));
  _dateLeft.setDate(_dateLeft.getDate() - sign * difference);

  // Math.abs(diff in full days - diff in calendar days) === 1 if last calendar day is not full
  // If so, result must be decreased by 1 in absolute value
  const isLastDayNotFull = Number(compareLocalAsc(_dateLeft, _dateRight) === -sign);
  const result = sign * (difference - isLastDayNotFull);
  // Prevent negative zero
  return result === 0 ? 0 : result;
}

// Like `compareAsc` but uses local time not UTC, which is needed
// for accurate equality comparisons of UTC timestamps that end up
// having the same representation in local time, e.g. one hour before
// DST ends vs. the instant that DST ends.
function compareLocalAsc(dateLeft, dateRight) {
  const diff = dateLeft.getFullYear() - dateRight.getFullYear() || dateLeft.getMonth() - dateRight.getMonth() || dateLeft.getDate() - dateRight.getDate() || dateLeft.getHours() - dateRight.getHours() || dateLeft.getMinutes() - dateRight.getMinutes() || dateLeft.getSeconds() - dateRight.getSeconds() || dateLeft.getMilliseconds() - dateRight.getMilliseconds();
  if (diff < 0) {
    return -1;
  } else if (diff > 0) {
    return 1;
    // Return 0 if diff is 0; return NaN if diff is NaN
  } else {
    return diff;
  }
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (differenceInDays);

/***/ }),

/***/ 15213:
/*!************************************************************!*\
  !*** ./node_modules/date-fns/differenceInMilliseconds.mjs ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   differenceInMilliseconds: () => (/* binding */ differenceInMilliseconds)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name differenceInMilliseconds
 * @category Millisecond Helpers
 * @summary Get the number of milliseconds between the given dates.
 *
 * @description
 * Get the number of milliseconds between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 *
 * @returns The number of milliseconds
 *
 * @example
 * // How many milliseconds are between
 * // 2 July 2014 12:30:20.600 and 2 July 2014 12:30:21.700?
 * const result = differenceInMilliseconds(
 *   new Date(2014, 6, 2, 12, 30, 21, 700),
 *   new Date(2014, 6, 2, 12, 30, 20, 600)
 * )
 * //=> 1100
 */
function differenceInMilliseconds(dateLeft, dateRight) {
  return +(0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(dateLeft) - +(0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(dateRight);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (differenceInMilliseconds);

/***/ }),

/***/ 1874:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/differenceInMinutes.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   differenceInMinutes: () => (/* binding */ differenceInMinutes)
/* harmony export */ });
/* harmony import */ var _lib_getRoundingMethod_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_lib/getRoundingMethod.mjs */ 65225);
/* harmony import */ var _constants_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.mjs */ 87870);
/* harmony import */ var _differenceInMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./differenceInMilliseconds.mjs */ 15213);




/**
 * The {@link differenceInMinutes} function options.
 */

/**
 * @name differenceInMinutes
 * @category Minute Helpers
 * @summary Get the number of minutes between the given dates.
 *
 * @description
 * Get the signed number of full (rounded towards 0) minutes between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of minutes
 *
 * @example
 * // How many minutes are between 2 July 2014 12:07:59 and 2 July 2014 12:20:00?
 * const result = differenceInMinutes(
 *   new Date(2014, 6, 2, 12, 20, 0),
 *   new Date(2014, 6, 2, 12, 7, 59)
 * )
 * //=> 12
 *
 * @example
 * // How many minutes are between 10:01:59 and 10:00:00
 * const result = differenceInMinutes(
 *   new Date(2000, 0, 1, 10, 0, 0),
 *   new Date(2000, 0, 1, 10, 1, 59)
 * )
 * //=> -1
 */
function differenceInMinutes(dateLeft, dateRight, options) {
  const diff = (0,_differenceInMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__.differenceInMilliseconds)(dateLeft, dateRight) / _constants_mjs__WEBPACK_IMPORTED_MODULE_1__.millisecondsInMinute;
  return (0,_lib_getRoundingMethod_mjs__WEBPACK_IMPORTED_MODULE_2__.getRoundingMethod)(options?.roundingMethod)(diff);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (differenceInMinutes);

/***/ }),

/***/ 64362:
/*!*******************************************************!*\
  !*** ./node_modules/date-fns/differenceInSeconds.mjs ***!
  \*******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   differenceInSeconds: () => (/* binding */ differenceInSeconds)
/* harmony export */ });
/* harmony import */ var _lib_getRoundingMethod_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./_lib/getRoundingMethod.mjs */ 65225);
/* harmony import */ var _differenceInMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./differenceInMilliseconds.mjs */ 15213);



/**
 * The {@link differenceInSeconds} function options.
 */

/**
 * @name differenceInSeconds
 * @category Second Helpers
 * @summary Get the number of seconds between the given dates.
 *
 * @description
 * Get the number of seconds between the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The later date
 * @param dateRight - The earlier date
 * @param options - An object with options.
 *
 * @returns The number of seconds
 *
 * @example
 * // How many seconds are between
 * // 2 July 2014 12:30:07.999 and 2 July 2014 12:30:20.000?
 * const result = differenceInSeconds(
 *   new Date(2014, 6, 2, 12, 30, 20, 0),
 *   new Date(2014, 6, 2, 12, 30, 7, 999)
 * )
 * //=> 12
 */
function differenceInSeconds(dateLeft, dateRight, options) {
  const diff = (0,_differenceInMilliseconds_mjs__WEBPACK_IMPORTED_MODULE_0__.differenceInMilliseconds)(dateLeft, dateRight) / 1000;
  return (0,_lib_getRoundingMethod_mjs__WEBPACK_IMPORTED_MODULE_1__.getRoundingMethod)(options?.roundingMethod)(diff);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (differenceInSeconds);

/***/ }),

/***/ 56441:
/*!********************************************!*\
  !*** ./node_modules/date-fns/endOfDay.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   endOfDay: () => (/* binding */ endOfDay)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name endOfDay
 * @category Day Helpers
 * @summary Return the end of a day for the given date.
 *
 * @description
 * Return the end of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a day
 *
 * @example
 * // The end of a day for 2 September 2014 11:55:00:
 * const result = endOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 23:59:59.999
 */
function endOfDay(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (endOfDay);

/***/ }),

/***/ 21121:
/*!**********************************************!*\
  !*** ./node_modules/date-fns/endOfMonth.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   endOfMonth: () => (/* binding */ endOfMonth)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name endOfMonth
 * @category Month Helpers
 * @summary Return the end of a month for the given date.
 *
 * @description
 * Return the end of a month for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The end of a month
 *
 * @example
 * // The end of a month for 2 September 2014 11:55:00:
 * const result = endOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 30 2014 23:59:59.999
 */
function endOfMonth(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const month = _date.getMonth();
  _date.setFullYear(_date.getFullYear(), month + 1, 0);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (endOfMonth);

/***/ }),

/***/ 60665:
/*!*********************************************!*\
  !*** ./node_modules/date-fns/endOfWeek.mjs ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   endOfWeek: () => (/* binding */ endOfWeek)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toDate.mjs */ 58700);
/* harmony import */ var _lib_defaultOptions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_lib/defaultOptions.mjs */ 19857);



/**
 * The {@link endOfWeek} function options.
 */

/**
 * @name endOfWeek
 * @category Week Helpers
 * @summary Return the end of a week for the given date.
 *
 * @description
 * Return the end of a week for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The end of a week
 *
 * @example
 * // The end of a week for 2 September 2014 11:55:00:
 * const result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sat Sep 06 2014 23:59:59.999
 *
 * @example
 * // If the week starts on Monday, the end of the week for 2 September 2014 11:55:00:
 * const result = endOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
 * //=> Sun Sep 07 2014 23:59:59.999
 */
function endOfWeek(date, options) {
  const defaultOptions = (0,_lib_defaultOptions_mjs__WEBPACK_IMPORTED_MODULE_0__.getDefaultOptions)();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_1__.toDate)(date);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? -7 : 0) + 6 - (day - weekStartsOn);
  _date.setDate(_date.getDate() + diff);
  _date.setHours(23, 59, 59, 999);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (endOfWeek);

/***/ }),

/***/ 36233:
/*!*******************************************!*\
  !*** ./node_modules/date-fns/getDate.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getDate: () => (/* binding */ getDate)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name getDate
 * @category Day Helpers
 * @summary Get the day of the month of the given date.
 *
 * @description
 * Get the day of the month of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The day of month
 *
 * @example
 * // Which day of the month is 29 February 2012?
 * const result = getDate(new Date(2012, 1, 29))
 * //=> 29
 */
function getDate(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const dayOfMonth = _date.getDate();
  return dayOfMonth;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getDate);

/***/ }),

/***/ 1085:
/*!******************************************!*\
  !*** ./node_modules/date-fns/getDay.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getDay: () => (/* binding */ getDay)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name getDay
 * @category Weekday Helpers
 * @summary Get the day of the week of the given date.
 *
 * @description
 * Get the day of the week of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The day of week, 0 represents Sunday
 *
 * @example
 * // Which day of the week is 29 February 2012?
 * const result = getDay(new Date(2012, 1, 29))
 * //=> 3
 */
function getDay(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const day = _date.getDay();
  return day;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getDay);

/***/ }),

/***/ 32173:
/*!**************************************************!*\
  !*** ./node_modules/date-fns/getDaysInMonth.mjs ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getDaysInMonth: () => (/* binding */ getDaysInMonth)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);
/* harmony import */ var _constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructFrom.mjs */ 56814);



/**
 * @name getDaysInMonth
 * @category Month Helpers
 * @summary Get the number of days in a month of the given date.
 *
 * @description
 * Get the number of days in a month of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The number of days in a month
 *
 * @example
 * // How many days are in February 2000?
 * const result = getDaysInMonth(new Date(2000, 1))
 * //=> 29
 */
function getDaysInMonth(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const year = _date.getFullYear();
  const monthIndex = _date.getMonth();
  const lastDayOfMonth = (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, 0);
  lastDayOfMonth.setFullYear(year, monthIndex + 1, 0);
  lastDayOfMonth.setHours(0, 0, 0, 0);
  return lastDayOfMonth.getDate();
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getDaysInMonth);

/***/ }),

/***/ 89318:
/*!********************************************!*\
  !*** ./node_modules/date-fns/getHours.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getHours: () => (/* binding */ getHours)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name getHours
 * @category Hour Helpers
 * @summary Get the hours of the given date.
 *
 * @description
 * Get the hours of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The hours
 *
 * @example
 * // Get the hours of 29 February 2012 11:45:00:
 * const result = getHours(new Date(2012, 1, 29, 11, 45))
 * //=> 11
 */
function getHours(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const hours = _date.getHours();
  return hours;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getHours);

/***/ }),

/***/ 27308:
/*!**********************************************!*\
  !*** ./node_modules/date-fns/getISOWeek.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getISOWeek: () => (/* binding */ getISOWeek)
/* harmony export */ });
/* harmony import */ var _constants_mjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.mjs */ 87870);
/* harmony import */ var _startOfISOWeek_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./startOfISOWeek.mjs */ 47545);
/* harmony import */ var _startOfISOWeekYear_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./startOfISOWeekYear.mjs */ 11050);
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);





/**
 * @name getISOWeek
 * @category ISO Week Helpers
 * @summary Get the ISO week of the given date.
 *
 * @description
 * Get the ISO week of the given date.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The ISO week
 *
 * @example
 * // Which week of the ISO-week numbering year is 2 January 2005?
 * const result = getISOWeek(new Date(2005, 0, 2))
 * //=> 53
 */
function getISOWeek(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const diff = +(0,_startOfISOWeek_mjs__WEBPACK_IMPORTED_MODULE_1__.startOfISOWeek)(_date) - +(0,_startOfISOWeekYear_mjs__WEBPACK_IMPORTED_MODULE_2__.startOfISOWeekYear)(_date);

  // Round the number of weeks to the nearest integer because the number of
  // milliseconds in a week is not constant (e.g. it's different in the week of
  // the daylight saving time clock shift).
  return Math.round(diff / _constants_mjs__WEBPACK_IMPORTED_MODULE_3__.millisecondsInWeek) + 1;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getISOWeek);

/***/ }),

/***/ 31359:
/*!**************************************************!*\
  !*** ./node_modules/date-fns/getISOWeekYear.mjs ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getISOWeekYear: () => (/* binding */ getISOWeekYear)
/* harmony export */ });
/* harmony import */ var _constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructFrom.mjs */ 56814);
/* harmony import */ var _startOfISOWeek_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./startOfISOWeek.mjs */ 47545);
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);




/**
 * @name getISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Get the ISO week-numbering year of the given date.
 *
 * @description
 * Get the ISO week-numbering year of the given date,
 * which always starts 3 days before the year's first Thursday.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The ISO week-numbering year
 *
 * @example
 * // Which ISO-week numbering year is 2 January 2005?
 * const result = getISOWeekYear(new Date(2005, 0, 2))
 * //=> 2004
 */
function getISOWeekYear(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const year = _date.getFullYear();
  const fourthOfJanuaryOfNextYear = (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, 0);
  fourthOfJanuaryOfNextYear.setFullYear(year + 1, 0, 4);
  fourthOfJanuaryOfNextYear.setHours(0, 0, 0, 0);
  const startOfNextYear = (0,_startOfISOWeek_mjs__WEBPACK_IMPORTED_MODULE_2__.startOfISOWeek)(fourthOfJanuaryOfNextYear);
  const fourthOfJanuaryOfThisYear = (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, 0);
  fourthOfJanuaryOfThisYear.setFullYear(year, 0, 4);
  fourthOfJanuaryOfThisYear.setHours(0, 0, 0, 0);
  const startOfThisYear = (0,_startOfISOWeek_mjs__WEBPACK_IMPORTED_MODULE_2__.startOfISOWeek)(fourthOfJanuaryOfThisYear);
  if (_date.getTime() >= startOfNextYear.getTime()) {
    return year + 1;
  } else if (_date.getTime() >= startOfThisYear.getTime()) {
    return year;
  } else {
    return year - 1;
  }
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getISOWeekYear);

/***/ }),

/***/ 89208:
/*!**********************************************!*\
  !*** ./node_modules/date-fns/getMinutes.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getMinutes: () => (/* binding */ getMinutes)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name getMinutes
 * @category Minute Helpers
 * @summary Get the minutes of the given date.
 *
 * @description
 * Get the minutes of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The minutes
 *
 * @example
 * // Get the minutes of 29 February 2012 11:45:05:
 * const result = getMinutes(new Date(2012, 1, 29, 11, 45, 5))
 * //=> 45
 */
function getMinutes(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const minutes = _date.getMinutes();
  return minutes;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getMinutes);

/***/ }),

/***/ 76301:
/*!********************************************!*\
  !*** ./node_modules/date-fns/getMonth.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getMonth: () => (/* binding */ getMonth)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name getMonth
 * @category Month Helpers
 * @summary Get the month of the given date.
 *
 * @description
 * Get the month of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The month index (0-11)
 *
 * @example
 * // Which month is 29 February 2012?
 * const result = getMonth(new Date(2012, 1, 29))
 * //=> 1
 */
function getMonth(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const month = _date.getMonth();
  return month;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getMonth);

/***/ }),

/***/ 72302:
/*!*******************************************!*\
  !*** ./node_modules/date-fns/getYear.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getYear: () => (/* binding */ getYear)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name getYear
 * @category Year Helpers
 * @summary Get the year of the given date.
 *
 * @description
 * Get the year of the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The given date
 *
 * @returns The year
 *
 * @example
 * // Which year is 2 July 2014?
 * const result = getYear(new Date(2014, 6, 2))
 * //=> 2014
 */
function getYear(date) {
  return (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date).getFullYear();
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getYear);

/***/ }),

/***/ 31257:
/*!*********************************************!*\
  !*** ./node_modules/date-fns/isSameDay.mjs ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   isSameDay: () => (/* binding */ isSameDay)
/* harmony export */ });
/* harmony import */ var _startOfDay_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./startOfDay.mjs */ 33240);


/**
 * @name isSameDay
 * @category Day Helpers
 * @summary Are the given dates in the same day (and year and month)?
 *
 * @description
 * Are the given dates in the same day (and year and month)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check

 * @returns The dates are in the same day (and year and month)
 *
 * @example
 * // Are 4 September 06:00:00 and 4 September 18:00:00 in the same day?
 * const result = isSameDay(new Date(2014, 8, 4, 6, 0), new Date(2014, 8, 4, 18, 0))
 * //=> true
 *
 * @example
 * // Are 4 September and 4 October in the same day?
 * const result = isSameDay(new Date(2014, 8, 4), new Date(2014, 9, 4))
 * //=> false
 *
 * @example
 * // Are 4 September, 2014 and 4 September, 2015 in the same day?
 * const result = isSameDay(new Date(2014, 8, 4), new Date(2015, 8, 4))
 * //=> false
 */
function isSameDay(dateLeft, dateRight) {
  const dateLeftStartOfDay = (0,_startOfDay_mjs__WEBPACK_IMPORTED_MODULE_0__.startOfDay)(dateLeft);
  const dateRightStartOfDay = (0,_startOfDay_mjs__WEBPACK_IMPORTED_MODULE_0__.startOfDay)(dateRight);
  return +dateLeftStartOfDay === +dateRightStartOfDay;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSameDay);

/***/ }),

/***/ 79681:
/*!***********************************************!*\
  !*** ./node_modules/date-fns/isSameMonth.mjs ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   isSameMonth: () => (/* binding */ isSameMonth)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name isSameMonth
 * @category Month Helpers
 * @summary Are the given dates in the same month (and year)?
 *
 * @description
 * Are the given dates in the same month (and year)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 *
 * @returns The dates are in the same month (and year)
 *
 * @example
 * // Are 2 September 2014 and 25 September 2014 in the same month?
 * const result = isSameMonth(new Date(2014, 8, 2), new Date(2014, 8, 25))
 * //=> true
 *
 * @example
 * // Are 2 September 2014 and 25 September 2015 in the same month?
 * const result = isSameMonth(new Date(2014, 8, 2), new Date(2015, 8, 25))
 * //=> false
 */
function isSameMonth(dateLeft, dateRight) {
  const _dateLeft = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(dateLeft);
  const _dateRight = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(dateRight);
  return _dateLeft.getFullYear() === _dateRight.getFullYear() && _dateLeft.getMonth() === _dateRight.getMonth();
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSameMonth);

/***/ }),

/***/ 2617:
/*!************************************************!*\
  !*** ./node_modules/date-fns/isSameSecond.mjs ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   isSameSecond: () => (/* binding */ isSameSecond)
/* harmony export */ });
/* harmony import */ var _startOfSecond_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./startOfSecond.mjs */ 66306);


/**
 * @name isSameSecond
 * @category Second Helpers
 * @summary Are the given dates in the same second (and hour and day)?
 *
 * @description
 * Are the given dates in the same second (and hour and day)?
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dateLeft - The first date to check
 * @param dateRight - The second date to check
 *
 * @returns The dates are in the same second (and hour and day)
 *
 * @example
 * // Are 4 September 2014 06:30:15.000 and 4 September 2014 06:30.15.500 in the same second?
 * const result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 30, 15),
 *   new Date(2014, 8, 4, 6, 30, 15, 500)
 * )
 * //=> true
 *
 * @example
 * // Are 4 September 2014 06:00:15.000 and 4 September 2014 06:01.15.000 in the same second?
 * const result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 0, 15),
 *   new Date(2014, 8, 4, 6, 1, 15)
 * )
 * //=> false
 *
 * @example
 * // Are 4 September 2014 06:00:15.000 and 5 September 2014 06:00.15.000 in the same second?
 * const result = isSameSecond(
 *   new Date(2014, 8, 4, 6, 0, 15),
 *   new Date(2014, 8, 5, 6, 0, 15)
 * )
 * //=> false
 */
function isSameSecond(dateLeft, dateRight) {
  const dateLeftStartOfSecond = (0,_startOfSecond_mjs__WEBPACK_IMPORTED_MODULE_0__.startOfSecond)(dateLeft);
  const dateRightStartOfSecond = (0,_startOfSecond_mjs__WEBPACK_IMPORTED_MODULE_0__.startOfSecond)(dateRight);
  return +dateLeftStartOfSecond === +dateRightStartOfSecond;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (isSameSecond);

/***/ }),

/***/ 17259:
/*!***************************************!*\
  !*** ./node_modules/date-fns/max.mjs ***!
  \***************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   max: () => (/* binding */ max)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name max
 * @category Common Helpers
 * @summary Return the latest of the given dates.
 *
 * @description
 * Return the latest of the given dates.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param dates - The dates to compare
 *
 * @returns The latest of the dates
 *
 * @example
 * // Which of these dates is the latest?
 * const result = max([
 *   new Date(1989, 6, 10),
 *   new Date(1987, 1, 11),
 *   new Date(1995, 6, 2),
 *   new Date(1990, 0, 1)
 * ])
 * //=> Sun Jul 02 1995 00:00:00
 */
function max(dates) {
  let result;
  dates.forEach(function (dirtyDate) {
    const currentDate = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(dirtyDate);
    if (result === undefined || result < currentDate || isNaN(Number(currentDate))) {
      result = currentDate;
    }
  });
  return result || new Date(NaN);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (max);

/***/ }),

/***/ 16613:
/*!*******************************************!*\
  !*** ./node_modules/date-fns/setDate.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setDate: () => (/* binding */ setDate)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name setDate
 * @category Day Helpers
 * @summary Set the day of the month to the given date.
 *
 * @description
 * Set the day of the month to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param dayOfMonth - The day of the month of the new date
 *
 * @returns The new date with the day of the month set
 *
 * @example
 * // Set the 30th day of the month to 1 September 2014:
 * const result = setDate(new Date(2014, 8, 1), 30)
 * //=> Tue Sep 30 2014 00:00:00
 */
function setDate(date, dayOfMonth) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  _date.setDate(dayOfMonth);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setDate);

/***/ }),

/***/ 3330:
/*!********************************************!*\
  !*** ./node_modules/date-fns/setHours.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setHours: () => (/* binding */ setHours)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name setHours
 * @category Hour Helpers
 * @summary Set the hours to the given date.
 *
 * @description
 * Set the hours to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param hours - The hours of the new date
 *
 * @returns The new date with the hours set
 *
 * @example
 * // Set 4 hours to 1 September 2014 11:30:00:
 * const result = setHours(new Date(2014, 8, 1, 11, 30), 4)
 * //=> Mon Sep 01 2014 04:30:00
 */
function setHours(date, hours) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  _date.setHours(hours);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setHours);

/***/ }),

/***/ 77052:
/*!**********************************************!*\
  !*** ./node_modules/date-fns/setMinutes.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setMinutes: () => (/* binding */ setMinutes)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name setMinutes
 * @category Minute Helpers
 * @summary Set the minutes to the given date.
 *
 * @description
 * Set the minutes to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param minutes - The minutes of the new date
 *
 * @returns The new date with the minutes set
 *
 * @example
 * // Set 45 minutes to 1 September 2014 11:30:40:
 * const result = setMinutes(new Date(2014, 8, 1, 11, 30, 40), 45)
 * //=> Mon Sep 01 2014 11:45:40
 */
function setMinutes(date, minutes) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  _date.setMinutes(minutes);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setMinutes);

/***/ }),

/***/ 57961:
/*!********************************************!*\
  !*** ./node_modules/date-fns/setMonth.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setMonth: () => (/* binding */ setMonth)
/* harmony export */ });
/* harmony import */ var _constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructFrom.mjs */ 56814);
/* harmony import */ var _getDaysInMonth_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./getDaysInMonth.mjs */ 32173);
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);




/**
 * @name setMonth
 * @category Month Helpers
 * @summary Set the month to the given date.
 *
 * @description
 * Set the month to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param month - The month index to set (0-11)
 *
 * @returns The new date with the month set
 *
 * @example
 * // Set February to 1 September 2014:
 * const result = setMonth(new Date(2014, 8, 1), 1)
 * //=> Sat Feb 01 2014 00:00:00
 */
function setMonth(date, month) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  const year = _date.getFullYear();
  const day = _date.getDate();
  const dateWithDesiredMonth = (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, 0);
  dateWithDesiredMonth.setFullYear(year, month, 15);
  dateWithDesiredMonth.setHours(0, 0, 0, 0);
  const daysInMonth = (0,_getDaysInMonth_mjs__WEBPACK_IMPORTED_MODULE_2__.getDaysInMonth)(dateWithDesiredMonth);
  // Set the last day of the new month
  // if the original date was the last day of the longer month
  _date.setMonth(month, Math.min(day, daysInMonth));
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setMonth);

/***/ }),

/***/ 54730:
/*!*******************************************!*\
  !*** ./node_modules/date-fns/setYear.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   setYear: () => (/* binding */ setYear)
/* harmony export */ });
/* harmony import */ var _constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructFrom.mjs */ 56814);
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);



/**
 * @name setYear
 * @category Year Helpers
 * @summary Set the year to the given date.
 *
 * @description
 * Set the year to the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param year - The year of the new date
 *
 * @returns The new date with the year set
 *
 * @example
 * // Set year 2013 to 1 September 2014:
 * const result = setYear(new Date(2014, 8, 1), 2013)
 * //=> Sun Sep 01 2013 00:00:00
 */
function setYear(date, year) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);

  // Check if date is Invalid Date because Date.prototype.setFullYear ignores the value of Invalid Date
  if (isNaN(+_date)) {
    return (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, NaN);
  }
  _date.setFullYear(year);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (setYear);

/***/ }),

/***/ 33240:
/*!**********************************************!*\
  !*** ./node_modules/date-fns/startOfDay.mjs ***!
  \**********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   startOfDay: () => (/* binding */ startOfDay)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name startOfDay
 * @category Day Helpers
 * @summary Return the start of a day for the given date.
 *
 * @description
 * Return the start of a day for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a day
 *
 * @example
 * // The start of a day for 2 September 2014 11:55:00:
 * const result = startOfDay(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Tue Sep 02 2014 00:00:00
 */
function startOfDay(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (startOfDay);

/***/ }),

/***/ 47545:
/*!**************************************************!*\
  !*** ./node_modules/date-fns/startOfISOWeek.mjs ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   startOfISOWeek: () => (/* binding */ startOfISOWeek)
/* harmony export */ });
/* harmony import */ var _startOfWeek_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./startOfWeek.mjs */ 90610);


/**
 * @name startOfISOWeek
 * @category ISO Week Helpers
 * @summary Return the start of an ISO week for the given date.
 *
 * @description
 * Return the start of an ISO week for the given date.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of an ISO week
 *
 * @example
 * // The start of an ISO week for 2 September 2014 11:55:00:
 * const result = startOfISOWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfISOWeek(date) {
  return (0,_startOfWeek_mjs__WEBPACK_IMPORTED_MODULE_0__.startOfWeek)(date, {
    weekStartsOn: 1
  });
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (startOfISOWeek);

/***/ }),

/***/ 11050:
/*!******************************************************!*\
  !*** ./node_modules/date-fns/startOfISOWeekYear.mjs ***!
  \******************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   startOfISOWeekYear: () => (/* binding */ startOfISOWeekYear)
/* harmony export */ });
/* harmony import */ var _getISOWeekYear_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getISOWeekYear.mjs */ 31359);
/* harmony import */ var _startOfISOWeek_mjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./startOfISOWeek.mjs */ 47545);
/* harmony import */ var _constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constructFrom.mjs */ 56814);




/**
 * @name startOfISOWeekYear
 * @category ISO Week-Numbering Year Helpers
 * @summary Return the start of an ISO week-numbering year for the given date.
 *
 * @description
 * Return the start of an ISO week-numbering year,
 * which always starts 3 days before the year's first Thursday.
 * The result will be in the local timezone.
 *
 * ISO week-numbering year: http://en.wikipedia.org/wiki/ISO_week_date
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of an ISO week-numbering year
 *
 * @example
 * // The start of an ISO week-numbering year for 2 July 2005:
 * const result = startOfISOWeekYear(new Date(2005, 6, 2))
 * //=> Mon Jan 03 2005 00:00:00
 */
function startOfISOWeekYear(date) {
  const year = (0,_getISOWeekYear_mjs__WEBPACK_IMPORTED_MODULE_0__.getISOWeekYear)(date);
  const fourthOfJanuary = (0,_constructFrom_mjs__WEBPACK_IMPORTED_MODULE_1__.constructFrom)(date, 0);
  fourthOfJanuary.setFullYear(year, 0, 4);
  fourthOfJanuary.setHours(0, 0, 0, 0);
  return (0,_startOfISOWeek_mjs__WEBPACK_IMPORTED_MODULE_2__.startOfISOWeek)(fourthOfJanuary);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (startOfISOWeekYear);

/***/ }),

/***/ 23206:
/*!*************************************************!*\
  !*** ./node_modules/date-fns/startOfMinute.mjs ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   startOfMinute: () => (/* binding */ startOfMinute)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name startOfMinute
 * @category Minute Helpers
 * @summary Return the start of a minute for the given date.
 *
 * @description
 * Return the start of a minute for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a minute
 *
 * @example
 * // The start of a minute for 1 December 2014 22:15:45.400:
 * const result = startOfMinute(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:00
 */
function startOfMinute(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  _date.setSeconds(0, 0);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (startOfMinute);

/***/ }),

/***/ 60452:
/*!************************************************!*\
  !*** ./node_modules/date-fns/startOfMonth.mjs ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   startOfMonth: () => (/* binding */ startOfMonth)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name startOfMonth
 * @category Month Helpers
 * @summary Return the start of a month for the given date.
 *
 * @description
 * Return the start of a month for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a month
 *
 * @example
 * // The start of a month for 2 September 2014 11:55:00:
 * const result = startOfMonth(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfMonth(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  _date.setDate(1);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (startOfMonth);

/***/ }),

/***/ 66306:
/*!*************************************************!*\
  !*** ./node_modules/date-fns/startOfSecond.mjs ***!
  \*************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   startOfSecond: () => (/* binding */ startOfSecond)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toDate.mjs */ 58700);


/**
 * @name startOfSecond
 * @category Second Helpers
 * @summary Return the start of a second for the given date.
 *
 * @description
 * Return the start of a second for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 *
 * @returns The start of a second
 *
 * @example
 * // The start of a second for 1 December 2014 22:15:45.400:
 * const result = startOfSecond(new Date(2014, 11, 1, 22, 15, 45, 400))
 * //=> Mon Dec 01 2014 22:15:45.000
 */
function startOfSecond(date) {
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_0__.toDate)(date);
  _date.setMilliseconds(0);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (startOfSecond);

/***/ }),

/***/ 90610:
/*!***********************************************!*\
  !*** ./node_modules/date-fns/startOfWeek.mjs ***!
  \***********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   startOfWeek: () => (/* binding */ startOfWeek)
/* harmony export */ });
/* harmony import */ var _toDate_mjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./toDate.mjs */ 58700);
/* harmony import */ var _lib_defaultOptions_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_lib/defaultOptions.mjs */ 19857);



/**
 * The {@link startOfWeek} function options.
 */

/**
 * @name startOfWeek
 * @category Week Helpers
 * @summary Return the start of a week for the given date.
 *
 * @description
 * Return the start of a week for the given date.
 * The result will be in the local timezone.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The original date
 * @param options - An object with options
 *
 * @returns The start of a week
 *
 * @example
 * // The start of a week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0))
 * //=> Sun Aug 31 2014 00:00:00
 *
 * @example
 * // If the week starts on Monday, the start of the week for 2 September 2014 11:55:00:
 * const result = startOfWeek(new Date(2014, 8, 2, 11, 55, 0), { weekStartsOn: 1 })
 * //=> Mon Sep 01 2014 00:00:00
 */
function startOfWeek(date, options) {
  const defaultOptions = (0,_lib_defaultOptions_mjs__WEBPACK_IMPORTED_MODULE_0__.getDefaultOptions)();
  const weekStartsOn = options?.weekStartsOn ?? options?.locale?.options?.weekStartsOn ?? defaultOptions.weekStartsOn ?? defaultOptions.locale?.options?.weekStartsOn ?? 0;
  const _date = (0,_toDate_mjs__WEBPACK_IMPORTED_MODULE_1__.toDate)(date);
  const day = _date.getDay();
  const diff = (day < weekStartsOn ? 7 : 0) + day - weekStartsOn;
  _date.setDate(_date.getDate() - diff);
  _date.setHours(0, 0, 0, 0);
  return _date;
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (startOfWeek);

/***/ }),

/***/ 12786:
/*!*******************************************!*\
  !*** ./node_modules/date-fns/subDays.mjs ***!
  \*******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   subDays: () => (/* binding */ subDays)
/* harmony export */ });
/* harmony import */ var _addDays_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addDays.mjs */ 28797);


/**
 * @name subDays
 * @category Day Helpers
 * @summary Subtract the specified number of days from the given date.
 *
 * @description
 * Subtract the specified number of days from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of days to be subtracted.
 *
 * @returns The new date with the days subtracted
 *
 * @example
 * // Subtract 10 days from 1 September 2014:
 * const result = subDays(new Date(2014, 8, 1), 10)
 * //=> Fri Aug 22 2014 00:00:00
 */
function subDays(date, amount) {
  return (0,_addDays_mjs__WEBPACK_IMPORTED_MODULE_0__.addDays)(date, -amount);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (subDays);

/***/ }),

/***/ 70602:
/*!*********************************************!*\
  !*** ./node_modules/date-fns/subMonths.mjs ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   subMonths: () => (/* binding */ subMonths)
/* harmony export */ });
/* harmony import */ var _addMonths_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addMonths.mjs */ 36337);


/**
 * @name subMonths
 * @category Month Helpers
 * @summary Subtract the specified number of months from the given date.
 *
 * @description
 * Subtract the specified number of months from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of months to be subtracted.
 *
 * @returns The new date with the months subtracted
 *
 * @example
 * // Subtract 5 months from 1 February 2015:
 * const result = subMonths(new Date(2015, 1, 1), 5)
 * //=> Mon Sep 01 2014 00:00:00
 */
function subMonths(date, amount) {
  return (0,_addMonths_mjs__WEBPACK_IMPORTED_MODULE_0__.addMonths)(date, -amount);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (subMonths);

/***/ }),

/***/ 19174:
/*!********************************************!*\
  !*** ./node_modules/date-fns/subWeeks.mjs ***!
  \********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   subWeeks: () => (/* binding */ subWeeks)
/* harmony export */ });
/* harmony import */ var _addWeeks_mjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./addWeeks.mjs */ 6243);


/**
 * @name subWeeks
 * @category Week Helpers
 * @summary Subtract the specified number of weeks from the given date.
 *
 * @description
 * Subtract the specified number of weeks from the given date.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param date - The date to be changed
 * @param amount - The amount of weeks to be subtracted.
 *
 * @returns The new date with the weeks subtracted
 *
 * @example
 * // Subtract 4 weeks from 1 September 2014:
 * const result = subWeeks(new Date(2014, 8, 1), 4)
 * //=> Mon Aug 04 2014 00:00:00
 */
function subWeeks(date, amount) {
  return (0,_addWeeks_mjs__WEBPACK_IMPORTED_MODULE_0__.addWeeks)(date, -amount);
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (subWeeks);

/***/ }),

/***/ 58700:
/*!******************************************!*\
  !*** ./node_modules/date-fns/toDate.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   toDate: () => (/* binding */ toDate)
/* harmony export */ });
/**
 * @name toDate
 * @category Common Helpers
 * @summary Convert the given argument to an instance of Date.
 *
 * @description
 * Convert the given argument to an instance of Date.
 *
 * If the argument is an instance of Date, the function returns its clone.
 *
 * If the argument is a number, it is treated as a timestamp.
 *
 * If the argument is none of the above, the function returns Invalid Date.
 *
 * **Note**: *all* Date arguments passed to any *date-fns* function is processed by `toDate`.
 *
 * @typeParam DateType - The `Date` type, the function operates on. Gets inferred from passed arguments. Allows to use extensions like [`UTCDate`](https://github.com/date-fns/utc).
 *
 * @param argument - The value to convert
 *
 * @returns The parsed date in the local time zone
 *
 * @example
 * // Clone the date:
 * const result = toDate(new Date(2014, 1, 11, 11, 30, 30))
 * //=> Tue Feb 11 2014 11:30:30
 *
 * @example
 * // Convert the timestamp to date:
 * const result = toDate(1392098430000)
 * //=> Tue Feb 11 2014 11:30:30
 */
function toDate(argument) {
  const argStr = Object.prototype.toString.call(argument);

  // Clone the date
  if (argument instanceof Date || typeof argument === "object" && argStr === "[object Date]") {
    // Prevent the date to lose the milliseconds when passed to new Date() in IE10
    return new argument.constructor(+argument);
  } else if (typeof argument === "number" || argStr === "[object Number]" || typeof argument === "string" || argStr === "[object String]") {
    // TODO: Can we get rid of as?
    return new Date(argument);
  } else {
    // TODO: Can we get rid of as?
    return new Date(NaN);
  }
}

// Fallback for modularized imports:
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (toDate);

/***/ })

}]);
//# sourceMappingURL=src_app_view_user_user_module_ts.9ffb0cd9f8e3c74e.js.map