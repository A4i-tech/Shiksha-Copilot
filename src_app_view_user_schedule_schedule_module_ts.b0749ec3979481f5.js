"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_user_schedule_schedule_module_ts"],{

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
    // .cal-day-headers[role=row] holds role=columnheader children (needs a `row` ancestor —
    // satisfied), but its own parent has no grid/table/rowgroup role, so `row` itself is
    // orphaned (aria-required-parent). Give its direct parent role="grid": a self-contained
    // header-only grid (one row child), without touching the broader week-view body markup.
    this._patchDayHeaderParent(root);
    root.querySelectorAll('.cal-week-view[role="grid"]').forEach(g => g.removeAttribute('role'));
    root.querySelectorAll('[role="application"]').forEach(e => e.setAttribute('role', 'button'));
    root.querySelectorAll('.cal-day-headers[role="row"]').forEach(h => this._patchDayHeaderParent(h));
  }
  _patchDayHeaderParent(el) {
    if (el.classList?.contains('cal-day-headers') && el.getAttribute('role') === 'row') {
      const parent = el.parentElement;
      if (parent && !parent.getAttribute('role') && parent.children.length === 1) {
        parent.setAttribute('role', 'grid');
      }
    }
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

/***/ 32706:
/*!*************************************************************************************!*\
  !*** ./src/app/view/user/schedule/add-edit-schedule/add-edit-schedule.component.ts ***!
  \*************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AddEditScheduleComponent: () => (/* binding */ AddEditScheduleComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 61873);
/* harmony import */ var _schedule_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../schedule.service */ 56926);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/components/dropdown/dropdown.component */ 62157);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/cdk/a11y */ 72102);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ 90852);













const _c0 = ["pop_ele"];
function AddEditScheduleComponent_button_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 21)(1, "span", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "img", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](3, 1, "Add Lesson Plan"));
  }
}
function AddEditScheduleComponent_div_33_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function AddEditScheduleComponent_div_33_span_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function AddEditScheduleComponent_div_33_span_24_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "span", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function AddEditScheduleComponent_div_33_div_29_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AddEditScheduleComponent_div_33_div_29_button_1_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r15);
      const i_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2).index;
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r13.deleteScheduleInfo(i_r6));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "img", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](1, 1, "Delete Schedule Slot"));
  }
}
function AddEditScheduleComponent_div_33_div_29_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AddEditScheduleComponent_div_33_div_29_button_2_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r17);
      const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r16.addNewScheduleInfo());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](2, "img", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](1, 1, "Add Schedule Slot"));
  }
}
function AddEditScheduleComponent_div_33_div_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, AddEditScheduleComponent_div_33_div_29_button_1_Template, 3, 3, "button", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, AddEditScheduleComponent_div_33_div_29_button_2_Template, 3, 3, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().index;
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", i_r6 !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", i_r6 === ctx_r10.getScheduleControls().length - 1);
  }
}
function AddEditScheduleComponent_div_33_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 24)(1, "div", 25)(2, "label", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](5, AddEditScheduleComponent_div_33_span_5_Template, 2, 0, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](6, "input", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](7, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](8, "p", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](10, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](11, "div", 30)(12, "label", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](14, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](15, AddEditScheduleComponent_div_33_span_15_Template, 2, 0, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](16, "input", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "p", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](19, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](20, "div", 30)(21, "label", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](23, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](24, AddEditScheduleComponent_div_33_span_24_Template, 2, 0, "span", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](25, "input", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](26, "p", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](27);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](28, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](29, AddEditScheduleComponent_div_33_div_29_Template, 3, 2, "div", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const controls_r5 = ctx.$implicit;
    const i_r6 = ctx.index;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroupName", i_r6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](4, 18, "Date"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r2.mode != "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("readOnly", ctx_r2.mode === "view")("min", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind2"](7, 20, ctx_r2.currentDate, "yyyy-MM-dd"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵattribute"]("aria-required", ctx_r2.mode != "view" ? "true" : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](10, 23, ctx_r2.getDateError(controls_r5)), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](14, 25, "Start Time"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r2.mode != "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("readOnly", ctx_r2.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵattribute"]("aria-required", ctx_r2.mode != "view" ? "true" : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](19, 27, ctx_r2.getStartTimeError(controls_r5)), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](23, 29, "End Time"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r2.mode != "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("readOnly", ctx_r2.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵattribute"]("aria-required", ctx_r2.mode != "view" ? "true" : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](28, 31, ctx_r2.getEndTimeError(controls_r5)), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r2.mode !== "view");
  }
}
function AddEditScheduleComponent_hr_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](0, "hr", 7);
  }
}
function AddEditScheduleComponent_div_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 44)(1, "div", 45)(2, "button", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AddEditScheduleComponent_div_36_Template_button_click_2_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r20);
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r19.closePopUP());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "button", 47)(6, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](8, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](9, "img", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](4, 2, "Cancel"));
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](8, 4, ctx_r4.mode === "edit" ? "Update" : "Save"));
  }
}
class AddEditScheduleComponent {
  handleEscape() {
    this.closePopUP();
  }
  /**
   * building the formbuilder
   * @param fb
   */
  constructor(fb, service, utility) {
    this.fb = fb;
    this.service = service;
    this.utility = utility;
    this.previousActiveElement = null;
    this.close = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.submitted = false;
    this.currentDate = new Date();
    // dropdown configarations
    this.boardDropDownConfig = {
      isBackground: true,
      placeHolderTxt: 'Select the Board',
      fieldName: 'Board',
      hideLabel: false,
      bindLabel: 'board',
      bindValue: 'board',
      required: true
    };
    this.mediumDropDownConfig = {
      isBackground: true,
      placeHolderTxt: 'Select the Medium',
      fieldName: 'Medium',
      hideLabel: false,
      bindLabel: 'medium',
      bindValue: 'medium',
      required: true
    };
    this.classNameDropDownConfig = {
      isBackground: true,
      placeHolderTxt: 'Select Class',
      fieldName: 'Class Name',
      hideLabel: false,
      bindLabel: 'class',
      bindValue: 'class',
      required: true
    };
    this.subjectDropDownConfig = {
      isBackground: true,
      placeHolderTxt: 'Select Subject',
      fieldName: 'Subject',
      hideLabel: false,
      bindLabel: 'displayName',
      bindValue: 'subject',
      required: true
    };
    this.chapterDropDownConfig = {
      isBackground: true,
      placeHolderTxt: 'Select the Chapter',
      fieldName: 'Chapter',
      hideLabel: false,
      bindLabel: 'displayValue',
      bindValue: 'topics',
      required: true
    };
    this.subTopicDropDownConfig = {
      isBackground: true,
      placeHolderTxt: 'Select the SubTopic',
      fieldName: 'Sub Topic',
      hideLabel: false,
      bindLabel: 'label',
      bindValue: 'label',
      required: true
    };
    this.lessonDropDownConfig = {
      isBackground: true,
      placeHolderTxt: 'Select the Lesson Plan',
      fieldName: 'Lesson Plan',
      bindLabel: 'name',
      bindValue: 'name',
      required: true
    };
    this.boardDropdownValue = [];
    this.mediumDropdownValue = [];
    this.classDropDownValues = [];
    this.subjectDropdownValue = [];
    this.chapterDropdownValue = [];
    this.subTopicDropDownValue = [];
    this.lessonPlanDropDownValue = [];
    //finding the viewport width and height
    this.vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    this.vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    this.scheduleForm = this.fb.group({
      board: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      medium: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      className: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      otherClass: [''],
      subject: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      chapter: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      subTopic: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      lessonPlan: [null, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required],
      schedule: this.fb.array([])
    });
  }
  /**
   * set the form data based on the event datay
   * @param changes
   */
  ngOnInit() {
    this.previousActiveElement = document.activeElement;
    const userData = localStorage.getItem('userData'); //user data for teacher id and school id
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      this.schoolID = parsedUserData.school;
    }
    if (this.formData) {
      (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.forkJoin)({
        schoolInfo: this.service.getSchoolInfoByID(),
        schedule: this.service.getScheduleById(this.formData.event.id)
      }).subscribe({
        next: results => {
          this.teacherId = results.schedule.data.teacherId;
          this.editableItem = results.schedule;
          this.lessonPlanID = this.editableItem.data.lesson._id;
          if (this.mode !== 'view') {
            this.classArray = this.utility.formatResponse(results.schoolInfo.data.user.profiles.teacher.classes);
            this.boardDropdownValue = this.classArray;
            this.filterMediumByBoard(this.editableItem.data.board, this.classArray);
            this.filterClassByMedium(this.editableItem.data.medium, this.mediumDropdownValue);
            this.filterSubjectByClass(this.editableItem.data.class, this.classDropDownValues);
            this.loadChapterSubtopicAndLesson();
          } else {
            this.viewFormSetUp();
          }
        },
        error: err => {
          this.utility.handleError(err);
        }
      });
    }
  }
  /**
   * adjust the modal according  to the cordinate value
   */
  ngAfterViewInit() {
    this.setElementCoordinates(this.pop_ele.nativeElement);
  }
  /**
  * align the pop up item near to the clicked event
  */
  setElementCoordinates(nativeElement) {
    if (this.pop_ele) {
      nativeElement.style.left = `${this.cordinate.rect.left - nativeElement.offsetWidth - 10}px`;
      //  checking top is touching or not
      if (this.cordinate.rect.top - nativeElement.offsetHeight - 100 < 0) {
        nativeElement.style.top = `${this.cordinate.rect.bottom}px`;
      }
      // checking bottom is touching or not
      if (this.cordinate.rect.bottom + nativeElement.offsetHeight + 100 > this.vh) {
        nativeElement.style.top = `${this.cordinate.rect.top - nativeElement.offsetHeight - 50}px`;
      }
      // checking left is touching or not
      if (this.cordinate.rect.left - (nativeElement.offsetWidth + 254) < 0) {
        nativeElement.style.left = `${this.cordinate.rect.right}px`;
      }
      // checking right is touching or not
      if (this.cordinate.rect.right + nativeElement.offsetWidth > this.vw) {
        nativeElement.style.left = `${this.cordinate.rect.left - nativeElement.offsetWidth}px`;
      }
      // checking whether both top and bottom are touching or not
      if (this.cordinate.rect.top - nativeElement.offsetHeight - 100 < 0 && this.cordinate.rect.bottom + nativeElement.offsetHeight + 100 > this.vh) {
        nativeElement.style.top = '50%';
        nativeElement.style.transform = 'translateY(-50%)';
      }
      // checking whether both right and left touching or not
      if (this.cordinate.rect.left - nativeElement.offsetWidth < 0 && this.cordinate.rect.right + nativeElement.offsetWidth > this.vw) {
        nativeElement.style.left = `${this.cordinate.rect.right / 2}px`;
      }
    }
  }
  /**
   * for view disable the form and for add add new dateTime form and set the board arrray value
   * @param changes
   */
  ngOnChanges(changes) {
    if (this.mode === 'view') {
      this.scheduleForm.disable();
    }
    if (this.mode === 'add') {
      this.addNewScheduleInfo();
      if (this.cellData) {
        this.getScheduleControls().controls[0].patchValue({
          date: this.cellData.date,
          fromTime: this.cellData.time,
          toTime: this.cellData.EndHour
        });
      }
      this.service.getSchoolInfoByID().subscribe({
        next: val => {
          this.teacherId = val.data.user._id;
          this.setBoardDropdownValue(val.data.user.profiles.teacher.classes);
        },
        error: err => {
          this.utility.handleError(err);
        }
      });
    }
  }
  // =============== ADD FLOW ==========
  setBoardDropdownValue(classes) {
    this.classArray = this.utility.formatResponse(classes);
    this.boardDropdownValue = this.classArray;
    if (this.boardDropdownValue.length === 1) {
      this.scheduleForm.get('board')?.setValue(this.boardDropdownValue[0].board);
      this.setMediumDropdownArray(this.boardDropdownValue[0]);
    }
  }
  /**
   * called when board values changes , reset the all the formfiled except board and set the medium dropdown values
   * @param value
   */
  setMediumDropdownArray(value) {
    this.resetBoardChanges();
    if (value) {
      this.mediumDropdownValue = value.mediums;
      if (this.mediumDropdownValue.length === 1) {
        this.scheduleForm.get('medium')?.setValue(this.mediumDropdownValue[0].medium);
        this.setClassDropdownValue(this.mediumDropdownValue[0]);
      }
    }
  }
  /**
   * resetting the class and below formfiled and set the classDropdown array value
   * @param value
   */
  setClassDropdownValue(value) {
    this.resetMediumChanges();
    if (value) {
      this.classDropDownValues = value.classes.sort((a, b) => a.class - b.class);
      if (this.classDropDownValues.length === 1) {
        this.scheduleForm.get('className')?.setValue(this.classDropDownValues[0].class);
        this.setSubjectValue(this.classDropDownValues[0]);
      }
    }
  }
  /**
   * when the class values changes , setting the subject value based on class, resetting chapter and subtopic
   * @param value
   */
  setSubjectValue(value) {
    this.resetClassChanges();
    if (value) {
      this.subjectDropdownValue = this.utility.formatSubjectDropdown(value.data);
      if (this.subjectDropdownValue.length === 1) {
        this.scheduleForm.get('subject')?.setValue(this.subjectDropdownValue[0].subject);
        this.setChapterValues(this.subjectDropdownValue[0]);
      }
    }
  }
  /**
   * call the api to set the chapter dropdown value
   */
  setChapterValues(value) {
    this.resetSubjectChanges();
    if (value) {
      const body = {
        board: this.scheduleForm.get('board')?.value,
        medium: this.scheduleForm.get('medium')?.value,
        standard: this.scheduleForm.get('className')?.value,
        subject: this.scheduleForm.get('subject')?.value
      };
      this.service.getAllChapter(body).subscribe({
        next: val => {
          this.chapterDropdownValue = this.utility.formatChapterDropdown(val.data.results);
        },
        error: err => {
          this.utility.handleError(err);
        }
      });
    }
  }
  /**
   * if value is present it will define the value for the subTopicDropdown Array and if value not present(clear) reset the subtopic array
   * @param val
   */
  setSubTopicValue(value) {
    this.resetChapterChanges();
    if (value) {
      const body = {
        board: this.scheduleForm.get('board')?.value,
        medium: this.scheduleForm.get('medium')?.value,
        standard: this.scheduleForm.get('className')?.value,
        subject: this.scheduleForm.get('subject')?.value,
        topic: this.scheduleForm.get('chapter')?.value
      };
      this.service.getAllSubTopic(body).subscribe({
        next: val => {
          this.setSubTopicData(val.data);
        }
      });
    }
  }
  setSubTopicData(val) {
    const formatttedData = this.formatSubTopics(val);
    this.subTopicDropDownValue = formatttedData;
  }
  formatSubTopics(val) {
    let formateObj = [];
    val[0].subtopics.forEach(ele => {
      let obj;
      if (ele.isAll) {
        obj = {
          label: 'All Sub-Topics',
          lessonList: ele.lessons
        };
      } else {
        obj = {
          label: ele.subtopic.join(' | '),
          lessonList: ele.lessons
        };
      }
      formateObj.push(obj);
    });
    return formateObj;
  }
  /**
   * call the lesson api using className,chapter,subtopic and set the response array to the lesson plan array
   */
  setLessonPlan(val) {
    this.lessonPlanDropDownValue = [];
    this.scheduleForm.get('lessonPlan')?.reset();
    this.lessonPlanDropDownValue = val.lessonList;
    if (this.lessonPlanDropDownValue.length === 1) {
      this.scheduleForm.get('lessonPlan')?.setValue(this.lessonPlanDropDownValue[0].name);
      this.lessonPlanID = this.lessonPlanDropDownValue[0].lessonId;
    }
  }
  /**
   * on lesson changes get the lesson plan ID to send in the body of the api
   * @param lessonValue
   */
  getLessonId(lessonValue) {
    this.lessonPlanID = lessonValue.lessonId;
  }
  // ======== ADD FLOW END HERE ===========
  // ======== EDIT FLOW START HERE =========
  /**
   * called when edit called, filter the medium based on the board value from boardDropdownArray
   * @param val
   */
  filterMediumByBoard(val, dropdownValueArray) {
    if (val) {
      const mediumData = dropdownValueArray.filter(item => {
        return item.board === val;
      });
      this.mediumDropdownValue = mediumData[0].mediums;
    }
  }
  /**
   * called when edit called, it will filter the class based on the medium value from mediumDropdown
   * @param value
   * @param dropdownValueArray
   */
  filterClassByMedium(value, dropdownValueArray) {
    const classValues = dropdownValueArray.filter(item => {
      return value === item.medium;
    });
    this.classDropDownValues = classValues[0].classes.sort((a, b) => a.class - b.class);
  }
  /**
   * called when edit called, it will filter the subject based on the class value from classDropdown Array
   * @param value
   * @param dropdownValueArray
   */
  filterSubjectByClass(value, dropdownValueArray) {
    const subjectValues = dropdownValueArray.filter(item => {
      return value === item.class;
    });
    this.subjectDropdownValue = this.utility.formatSubjectDropdown(subjectValues[0].data);
  }
  /**
   * Not Used
   * @param value
   */
  filterSubTopicByTopic(value) {
    this.subTopicDropDownValue = value.subTopics;
    this.scheduleForm.get('lessonPlan')?.setValue(this.editableItem.data.lesson.name);
  }
  /**
   * call both chapter and subtopic api to get the array and set the lesson plan and call form setUp
   */
  loadChapterSubtopicAndLesson() {
    let chapterBody = {
      board: this.editableItem.data.board,
      medium: this.editableItem.data.medium,
      standard: this.editableItem.data.class,
      subject: this.editableItem.data.subject
    };
    let subTopicBody = {
      ...chapterBody,
      topic: this.editableItem.data.topic
    };
    (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.forkJoin)({
      chapter: this.service.getAllChapter(chapterBody),
      subTopic: this.service.getAllSubTopic(subTopicBody)
    }).subscribe({
      next: result => {
        this.chapterDropdownValue = this.utility.formatChapterDropdown(result.chapter.data.results);
        this.setSubTopicData(result.subTopic.data);
        this.setLessonPlan(this.subTopicDropDownValue[0]);
        this.setFormValues();
      }
    });
  }
  /**
   * Not Used
  * for edit purpose setting the formInfo
  */
  editFormSetup() {
    this.setFormValues();
  }
  setFormValues() {
    this.scheduleForm.patchValue({
      board: this.editableItem.data.board,
      medium: this.editableItem.data.medium,
      className: this.editableItem.data.class,
      otherClass: this.editableItem.data.otherClass,
      subject: this.editableItem.data.subject,
      chapter: this.editableItem.data.topic,
      subTopic: this.editableItem.data.subTopic,
      lessonPlan: this.editableItem.data.lesson.name,
      schedule: this.setDateTimeValue()
    });
  }
  // =========== EDIT FLOW END HERE =============
  // =============== VIEW FLOW HERE =============
  viewFormSetUp() {
    this.chapterDropdownValue = [];
    this.chapterDropdownValue.push({
      displayValue: `${this.editableItem?.data?.lesson?.chapter?.orderNumber}. ${this.editableItem.data.topic}`,
      topics: this.editableItem.data.topic
    });
    this.subjectDropdownValue = [];
    const subjects = [{
      ...this.editableItem?.data?.lesson?.subjects,
      subject: this.editableItem?.data?.subject
    }];
    if (subjects.length) {
      this.subjectDropdownValue = this.utility.formatSubjectDropdown(subjects);
    }
    this.setFormValues();
  }
  // =========== VIEW FLOW END HERE ==============
  // ========= DELETE FLOW START HERE =============
  /**
   * remove the specific formgroup of the formarray
   * @param index
   */
  deleteScheduleInfo(index) {
    this.getScheduleControls().removeAt(index);
  }
  // ============ DELETE FLOW END HERE ================
  /**
   * Not Used
   * this function will set the chapter dropdown value and patch the iniitial value for edit
   * @param value
   * @param body
   */
  chapterPatchValue(value) {
    const body = {
      board: this.editableItem.data.board,
      medium: this.editableItem.data.medium,
      standard: this.editableItem.data.class,
      subject: this.editableItem.data.subject
    };
    this.service.getAllChapter(body).subscribe({
      next: val => {
        this.chapterDropdownValue = this.utility.formatChapterDropdown(val.data.results);
        this.editSetSubTopicValue();
      },
      error: err => {
        this.utility.handleError(err);
      }
    });
  }
  /**
   * Not Used
   */
  editSetSubTopicValue() {
    this.resetChapterChanges();
    const body = {
      board: this.scheduleForm.get('board')?.value,
      medium: this.scheduleForm.get('medium')?.value,
      standard: this.scheduleForm.get('className')?.value,
      subject: this.scheduleForm.get('subject')?.value,
      topic: this.scheduleForm.get('chapter')?.value
    };
    this.service.getAllSubTopic(body).subscribe({
      next: val => {
        this.setSubTopicData(val.data);
        this.scheduleForm.get('subTopic')?.setValue(this.editableItem.data.subTopic);
        this.setLessonPlan(this.subTopicDropDownValue[0]);
        this.scheduleForm.get('lessonPlan')?.setValue(this.editableItem.data.lesson.name);
      }
    });
  }
  // ========= UTILITY METHODS =========
  /**
   * add the retrieved value event to the formarray other word setting the scheduleItems
   */
  setDateTimeValue() {
    for (let scheduleItem of this.editableItem.data.scheduleDateTime) {
      this.getScheduleControls().push(this.newScheduleInfo(scheduleItem));
    }
  }
  get f() {
    return this.scheduleForm.controls;
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
   * return the new form group with field date,startDate and endDate
   * @param data
   * @returns
   */
  newScheduleInfo(data = null) {
    return this.fb.group({
      date: [this.utility.formateDate(data).date ?? null, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required, this.dateValidator]],
      fromTime: [data?.fromTime ?? null, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required, this.startEndTimeValidator]],
      toTime: [data?.toTime ?? null, [_angular_forms__WEBPACK_IMPORTED_MODULE_4__.Validators.required, this.startEndTimeValidator]]
    }, {
      validator: [this.timeRangeValidator, this.pastTimeValidatory]
    });
  }
  /**
   * return the formarray of the schedule
   * @returns
   */
  getScheduleControls() {
    return this.scheduleForm.get('schedule');
  }
  /**
   * adding new form group to the formarray
   */
  addNewScheduleInfo() {
    this.getScheduleControls().push(this.newScheduleInfo(null));
  }
  /**
   * send the details to the backend
   */
  onSave() {
    let body;
    this.submitted = true;
    if (!this.scheduleForm.valid) {
      return;
    }
    const commonBodyValue = {
      teacherId: this.teacherId,
      board: this.scheduleForm.get('board')?.value,
      medium: this.scheduleForm.get('medium')?.value,
      subject: this.scheduleForm.get('subject')?.value,
      topic: this.scheduleForm.get('chapter')?.value,
      subTopic: this.scheduleForm.get('subTopic')?.value,
      scheduleType: 'regular',
      class: +this.scheduleForm.get('className')?.value,
      otherClass: this.scheduleForm.get('otherClass')?.value,
      scheduleDateTime: this.getScheduleControls().value,
      schoolId: this.schoolID._id,
      lessonId: this.lessonPlanID
    };
    if (this.mode === 'add') {
      this.service.createSchedule(commonBodyValue).subscribe({
        next: response => {
          this.close.emit('save');
          this.utility.showSuccess('Schedule Created Successfully');
        },
        error: err => {
          this.utility.handleError(err);
        }
      });
    } else if (this.mode === 'edit') {
      body = {
        _id: this.editableItem.data._id,
        ...commonBodyValue
      };
      this.service.updateSchedule(body).subscribe({
        next: response => {
          this.close.emit('save');
          this.utility.showSuccess('Schedule Update Successfully');
        },
        error: err => {
          this.utility.handleError(err);
        }
      });
    }
  }
  /**
   * close the pop upon clicking save,cancel and cross mark
   */
  closePopUP() {
    this.close.emit();
  }
  ngOnDestroy() {
    if (this.previousActiveElement?.isConnected) {
      this.previousActiveElement.focus();
    }
  }
  // error handling message functions for start , end and date
  /**
   *  getting errror message for the date formControl
   * @param controls
   * @returns
   */
  getDateError(controls) {
    if (this.submitted && controls.get('date')?.errors?.['required']) {
      return 'Date is required';
    } else {
      return this.submitted && controls.get('date')?.errors?.['inValidDate'] ? 'Please select the current date' : '';
    }
  }
  /**
   * getting the error message for the fromTime Control
   * @param control
   * @returns
   */
  getStartTimeError(control) {
    if (this.submitted && control.get('fromTime')?.errors?.['required']) {
      return 'Start Time Required';
    } else if (this.submitted && control.errors?.['InvalidTime']) {
      return 'Please choose a future time';
    } else {
      return this.submitted && control.get('fromTime')?.touched && control.get('fromTime')?.errors?.['InvalidStartDate'] ? 'Start Time must be between 7AM to 6PM' : '';
    }
  }
  /**
   * getting the error message for the EndTime Control
   * @param controls
   * @returns
   */
  getEndTimeError(controls) {
    if (this.submitted && controls.get('toTime')?.errors?.['required']) {
      return 'End Time Required';
    } else if (this.submitted && controls.get('toTime')?.errors?.['InvalidStartDate']) {
      return 'End Time must be between 7AM to 6PM';
    } else {
      return this.submitted && controls.errors?.['lessThanStart'] ? 'End Time must be greater than start' : '';
    }
  }
  // Validator for start,end and date
  startEndTimeValidator(control) {
    const value = control.value;
    if (!value) {
      return null;
    }
    const [hour, minute] = value.split(':').map(part => parseInt(part, 10)); // Parsing hour and minute
    // Invalid if hour is before 7, after 18, or at 18:01 or later
    if (hour < 7 || hour > 18 || hour === 18 && minute > 0) {
      return {
        InvalidStartDate: true
      };
    }
    return null; // Valid time
  }

  pastTimeValidatory(control) {
    const value = control.get('fromTime')?.value;
    const parentControl = control?.get('date')?.value;
    const selectedDate = new Date(parentControl);
    const now = new Date();
    const todayHour = now.getHours();
    const todayMin = now.getMinutes();
    now.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (!value) {
      return null;
    }
    const [hour, minute] = value.split(':').map(part => parseInt(part, 10)); // Parsing hour and minute
    if (selectedDate.toString() === now.toString() && (todayHour > hour || todayHour === hour && todayMin > minute)) {
      return {
        InvalidTime: true
      };
    }
    return null;
  }
  dateValidator(control) {
    const now = new Date();
    const selectedDate = new Date(control.value);
    now.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    if (control.value && now > selectedDate) {
      return {
        inValidDate: true
      };
    }
    return null;
  }
  timeRangeValidator(control) {
    const startTime = control.get('fromTime')?.value;
    const endTime = control.get('toTime')?.value;
    if (!startTime || !endTime) {
      return null;
    }
    if (startTime > endTime) {
      return {
        lessThanStart: true
      };
    }
    return null;
  }
  resetFormControls(...controls) {
    controls.forEach(controlName => {
      const control = this.scheduleForm.get(controlName);
      if (control) {
        control.reset();
      }
      switch (controlName) {
        case 'medium':
          this.mediumDropdownValue = [];
          break;
        case 'className':
          this.classDropDownValues = [];
          break;
        case 'subject':
          this.subjectDropdownValue = [];
          break;
        case 'chapter':
          this.chapterDropdownValue = [];
          break;
        case 'subTopic':
          this.subTopicDropDownValue = [];
          break;
        case 'lessonPlan':
          this.lessonPlanDropDownValue = [];
          break;
        default:
          break;
      }
    });
  }
  resetBoardChanges() {
    this.resetFormControls('medium', 'className', 'subject', 'chapter', 'subTopic', 'lessonPlan');
  }
  resetMediumChanges() {
    this.resetFormControls('className', 'subject', 'chapter', 'subTopic', 'lessonPlan');
  }
  resetClassChanges() {
    this.resetFormControls('subject', 'chapter', 'subTopic', 'lessonPlan');
  }
  resetSubjectChanges() {
    this.resetFormControls('chapter', 'subTopic', 'lessonPlan');
  }
  resetChapterChanges() {
    this.resetFormControls('subTopic', 'lessonPlan');
  }
  static {
    this.ɵfac = function AddEditScheduleComponent_Factory(t) {
      return new (t || AddEditScheduleComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_schedule_service__WEBPACK_IMPORTED_MODULE_0__.ScheduleService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__.UtilityService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: AddEditScheduleComponent,
      selectors: [["app-add-edit-schedule"]],
      viewQuery: function AddEditScheduleComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c0, 7);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.pop_ele = _t.first);
        }
      },
      hostBindings: function AddEditScheduleComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("keydown.escape", function AddEditScheduleComponent_keydown_escape_HostBindingHandler() {
            return ctx.handleEscape();
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresolveDocument"]);
        }
      },
      inputs: {
        cordinate: "cordinate",
        formData: "formData",
        cellData: "cellData",
        mode: "mode"
      },
      outputs: {
        close: "close"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵProvidersFeature"]([_angular_common__WEBPACK_IMPORTED_MODULE_6__.DatePipe]), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵNgOnChangesFeature"]],
      decls: 37,
      vars: 44,
      consts: [[1, "backdrop"], ["role", "dialog", "aria-modal", "true", "aria-labelledby", "schedule-dialog-title", "cdkTrapFocus", "", 1, "form-content", "bg-white", "fixed", "shadow-2xl", "rounded", 3, "cdkTrapFocusAutoCapture"], ["pop_ele", ""], [1, "header", "flex", "justify-between", "items-center", "px-4", "py-3"], ["id", "schedule-dialog-title", "data-testid", "add-edit-schedule-title", 1, "text-base", "font-bold", "leading-[26px]", "text-content"], ["data-testid", "add-edit-schedule-close-btn", 1, "bg-shade-50", "rounded-full", "text-center", "p-1", "cursor-pointer", 3, "click"], ["src", "assets/icons/E remove.svg", "alt", ""], [1, "border"], [1, "body-container", 3, "formGroup", "ngSubmit"], [1, "p-4"], [1, "form-wrapper", "max-h-[530px]", "overflow-y-auto", "flex", "flex-col", "gap-2"], [1, "grid", "gap-2", "md:grid-cols-2"], [1, "min-w-[250px]"], [3, "config", "dropDownValues", "mode", "dropDownCtrl", "submitted", "valueChange"], [1, "min-w-[250px]", "capitalize"], [3, "config", "dropDownValues", "submitted", "mode", "dropDownCtrl", "valueChange"], ["class", "btn-primary  flex items-center justify-center px-4 self-start", "type", "button", "routerLink", "/content-generation", 4, "ngIf"], ["formArrayName", "schedule", 1, "scheduleArray"], ["class", "grid md:gap-2 mb-2 md:grid-cols-12 items-start", 3, "formGroupName", 4, "ngFor", "ngForOf"], ["class", "border", 4, "ngIf"], ["class", "footer-container px-4 py-3 ", 4, "ngIf"], ["type", "button", "routerLink", "/content-generation", 1, "btn-primary", "flex", "items-center", "justify-center", "px-4", "self-start"], [1, "ms-1", "me-1"], ["src", "assets/icons/E add.svg", "alt", ""], [1, "grid", "md:gap-2", "mb-2", "md:grid-cols-12", "items-start", 3, "formGroupName"], [1, "md:col-span-4"], ["for", "datepicker", 1, "block", "mb-2", "form-control-label"], ["class", "text-[16px] text-error", 4, "ngIf"], ["id", "datepicker", "type", "date", "placeholder", "Select Date", "required", "", "formControlName", "date", 1, "form-control", "bg-surface-muted", 3, "readOnly", "min"], [1, "form-control-error"], [1, "md:col-span-3"], ["for", "timepicker1", 1, "block", "mb-2", "form-control-label"], ["type", "time", "id", "timepicker1", "placeholder", "Select Start Time", "required", "", "formControlName", "fromTime", "min", "07:00", "max", "17:00", 1, "form-control", "bg-surface-muted", 3, "readOnly"], [1, "form-control-error", "min-h-[20px]"], ["for", "timepicker2", 1, "block", "mb-2", "form-control-label"], ["type", "time", "id", "timepicker2", "placeholder", "Select End Time", "required", "", "formControlName", "toTime", "min", "07:00", "max", "17:00", 1, "form-control", "bg-surface-muted", 3, "readOnly"], ["class", "btn-container flex md:col-span-2 gap-2 self-end ", 4, "ngIf"], [1, "text-[16px]", "text-error"], [1, "btn-container", "flex", "md:col-span-2", "gap-2", "self-end"], ["class", "btn-danger flex items-center justify-center   h-[42px]", 3, "click", 4, "ngIf"], ["class", "btn-primary  flex items-center justify-center   h-[42px]", 3, "click", 4, "ngIf"], [1, "btn-danger", "flex", "items-center", "justify-center", "h-[42px]", 3, "click"], ["src", "assets/icons/delete.svg", "alt", ""], [1, "btn-primary", "flex", "items-center", "justify-center", "h-[42px]", 3, "click"], [1, "footer-container", "px-4", "py-3"], [1, "buttons", "flex", "items-center", "justify-end", "gap-2"], ["type", "button", 1, "w-20", "btn-outline-primary", 3, "click"], ["data-testid", "add-edit-schedule-save-btn", "type", "submit", 1, "btn-primary", "w-20", "flex", "items-center", "justify-center"], [1, "mr-1"], ["src", "assets/icons/Vector (4).svg", "alt", ""]],
      template: function AddEditScheduleComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0)(1, "div", 1, 2)(3, "div", 3)(4, "h1", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](6, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](7, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function AddEditScheduleComponent_Template_div_click_7_listener() {
            return ctx.closePopUP();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](8, "img", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](9, "hr", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](10, "div")(11, "form", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("ngSubmit", function AddEditScheduleComponent_Template_form_ngSubmit_11_listener() {
            return ctx.onSave();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](12, "div", 9)(13, "div", 10)(14, "div", 11)(15, "div", 12)(16, "app-dropdown", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueChange", function AddEditScheduleComponent_Template_app_dropdown_valueChange_16_listener($event) {
            return ctx.setMediumDropdownArray($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](17, "div", 14)(18, "app-dropdown", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueChange", function AddEditScheduleComponent_Template_app_dropdown_valueChange_18_listener($event) {
            return ctx.setClassDropdownValue($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](19, "div", 11)(20, "div", 12)(21, "app-dropdown", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueChange", function AddEditScheduleComponent_Template_app_dropdown_valueChange_21_listener($event) {
            return ctx.setSubjectValue($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](22, "div", 12)(23, "app-dropdown", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueChange", function AddEditScheduleComponent_Template_app_dropdown_valueChange_23_listener($event) {
            return ctx.setChapterValues($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](24, "div", 11)(25, "div", 12)(26, "app-dropdown", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueChange", function AddEditScheduleComponent_Template_app_dropdown_valueChange_26_listener($event) {
            return ctx.setSubTopicValue($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](27, "div", 12)(28, "app-dropdown", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueChange", function AddEditScheduleComponent_Template_app_dropdown_valueChange_28_listener($event) {
            return ctx.setLessonPlan($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](29, "div")(30, "app-dropdown", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueChange", function AddEditScheduleComponent_Template_app_dropdown_valueChange_30_listener($event) {
            return ctx.getLessonId($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](31, AddEditScheduleComponent_button_31_Template, 5, 3, "button", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](32, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](33, AddEditScheduleComponent_div_33_Template, 30, 33, "div", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](34, AddEditScheduleComponent_hr_34_Template, 1, 0, "hr", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](35, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](36, AddEditScheduleComponent_div_36_Template, 10, 6, "div", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("cdkTrapFocusAutoCapture", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](6, 42, ctx.mode === "view" ? "View Details" : ctx.mode === "edit" ? "Edit Details" : "Add Details"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("formGroup", ctx.scheduleForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("config", ctx.boardDropDownConfig)("dropDownValues", ctx.boardDropdownValue)("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["board"]))("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("config", ctx.mediumDropDownConfig)("dropDownValues", ctx.mediumDropdownValue)("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["medium"]))("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("config", ctx.classNameDropDownConfig)("dropDownValues", ctx.classDropDownValues)("submitted", ctx.submitted)("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["className"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("config", ctx.subjectDropDownConfig)("dropDownValues", ctx.subjectDropdownValue)("submitted", ctx.submitted)("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["subject"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("config", ctx.chapterDropDownConfig)("dropDownValues", ctx.chapterDropdownValue)("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["chapter"]))("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("config", ctx.subTopicDropDownConfig)("dropDownValues", ctx.subTopicDropDownValue)("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["subTopic"]))("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("config", ctx.lessonDropDownConfig)("dropDownValues", ctx.lessonPlanDropDownValue)("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["lessonPlan"]))("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.mode === "add");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.getScheduleControls().controls);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_6__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_6__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_2__.DropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_4__.FormArrayName, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_8__.CdkTrapFocus, _angular_common__WEBPACK_IMPORTED_MODULE_6__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslatePipe],
      styles: [".btn-container[_ngcontent-%COMP%] {\n  margin-bottom: 0.9lh;\n}\n\n.scheduleArray[_ngcontent-%COMP%]   .form-control-error[_ngcontent-%COMP%] {\n  height: 1lh;\n}\n\n.backdrop[_ngcontent-%COMP%] {\n  position: fixed;\n  width: 100%;\n  height: 100%;\n  background-color: rgba(248, 249, 250, 0.5);\n  background-color: color-mix(in srgb, var(--surface-muted) 50%, transparent);\n  inset: 0;\n  z-index: 999;\n}\n.backdrop[_ngcontent-%COMP%]   .form-wrapper[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.backdrop[_ngcontent-%COMP%]   .form-wrapper[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background-color: transparent;\n}\n.backdrop[_ngcontent-%COMP%]   .form-wrapper[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  border-radius: 30px;\n  background-color: var(--primary-DEFAULT);\n}\n\n.form-content[_ngcontent-%COMP%] {\n  width: min(650px, 90%);\n}\n\n@media screen and (max-width: 768px) {\n  .form-content[_ngcontent-%COMP%] {\n    top: 50% !important;\n    left: 50% !important;\n    transform: translate(-50%, -50%) !important;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFkZC1lZGl0LXNjaGVkdWxlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0Msb0JBQUE7QUFBRDs7QUFFQTtFQUNDLFdBQUE7QUFDRDs7QUFFQTtFQUNDLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDBDQUFBO0VBQ0EsMkVBQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtBQUNEO0FBQUM7RUFDQyxVQUFBO0FBRUY7QUFBQztFQUNDLDZCQUFBO0FBRUY7QUFBQztFQUNDLG1CQUFBO0VBQ0Esd0NBQUE7QUFFRjs7QUFFQTtFQUNDLHNCQUFBO0FBQ0Q7O0FBRUE7RUFDQztJQUNDLG1CQUFBO0lBQ0Esb0JBQUE7SUFDQSwyQ0FBQTtFQUNBO0FBQ0YiLCJmaWxlIjoiYWRkLWVkaXQtc2NoZWR1bGUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcbi5idG4tY29udGFpbmVye1xuXHRtYXJnaW4tYm90dG9tOi45bGggO1xufVxuLnNjaGVkdWxlQXJyYXkgLmZvcm0tY29udHJvbC1lcnJvcntcblx0aGVpZ2h0OiAxbGg7XG59XG5cbi5iYWNrZHJvcHtcblx0cG9zaXRpb246IGZpeGVkO1xuXHR3aWR0aDogMTAwJTtcblx0aGVpZ2h0OiAxMDAlO1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0OCwgMjQ5LCAyNTAsIDAuNSk7XG5cdGJhY2tncm91bmQtY29sb3I6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zdXJmYWNlLW11dGVkKSA1MCUsIHRyYW5zcGFyZW50KTtcblx0aW5zZXQ6IDA7XG5cdHotaW5kZXg6IDk5OTtcblx0LmZvcm0td3JhcHBlcjo6LXdlYmtpdC1zY3JvbGxiYXJ7XG5cdFx0d2lkdGg6IDRweDtcblx0fVxuXHQuZm9ybS13cmFwcGVyOjotd2Via2l0LXNjcm9sbGJhci10cmFja3tcblx0XHRiYWNrZ3JvdW5kLWNvbG9yOiB0cmFuc3BhcmVudDtcblx0fVxuXHQuZm9ybS13cmFwcGVyOjotd2Via2l0LXNjcm9sbGJhci10aHVtYntcblx0XHRib3JkZXItcmFkaXVzOiAzMHB4O1xuXHRcdGJhY2tncm91bmQtY29sb3I6IHZhcigtLXByaW1hcnktREVGQVVMVCk7XG5cdH1cblx0XG59XG4uZm9ybS1jb250ZW50e1xuXHR3aWR0aDogbWluKDY1MHB4LDkwJSk7XG59XG5cbkBtZWRpYSBzY3JlZW4gYW5kIChtYXgtd2lkdGggOiA3NjhweCl7XG5cdC5mb3JtLWNvbnRlbnR7XG5cdFx0dG9wOiA1MCUgIWltcG9ydGFudDtcblx0XHRsZWZ0OiA1MCUgIWltcG9ydGFudDtcblx0XHR0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLC01MCUpICFpbXBvcnRhbnQ7XG5cdH1cbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3NjaGVkdWxlL2FkZC1lZGl0LXNjaGVkdWxlL2FkZC1lZGl0LXNjaGVkdWxlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBO0VBQ0Msb0JBQUE7QUFBRDs7QUFFQTtFQUNDLFdBQUE7QUFDRDs7QUFFQTtFQUNDLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLDBDQUFBO0VBQ0EsMkVBQUE7RUFDQSxRQUFBO0VBQ0EsWUFBQTtBQUNEO0FBQUM7RUFDQyxVQUFBO0FBRUY7QUFBQztFQUNDLDZCQUFBO0FBRUY7QUFBQztFQUNDLG1CQUFBO0VBQ0Esd0NBQUE7QUFFRjs7QUFFQTtFQUNDLHNCQUFBO0FBQ0Q7O0FBRUE7RUFDQztJQUNDLG1CQUFBO0lBQ0Esb0JBQUE7SUFDQSwyQ0FBQTtFQUNBO0FBQ0Y7QUFDQSxvcURBQW9xRCIsInNvdXJjZXNDb250ZW50IjpbIlxuLmJ0bi1jb250YWluZXJ7XG5cdG1hcmdpbi1ib3R0b206LjlsaCA7XG59XG4uc2NoZWR1bGVBcnJheSAuZm9ybS1jb250cm9sLWVycm9ye1xuXHRoZWlnaHQ6IDFsaDtcbn1cblxuLmJhY2tkcm9we1xuXHRwb3NpdGlvbjogZml4ZWQ7XG5cdHdpZHRoOiAxMDAlO1xuXHRoZWlnaHQ6IDEwMCU7XG5cdGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ4LCAyNDksIDI1MCwgMC41KTtcblx0YmFja2dyb3VuZC1jb2xvcjogY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXN1cmZhY2UtbXV0ZWQpIDUwJSwgdHJhbnNwYXJlbnQpO1xuXHRpbnNldDogMDtcblx0ei1pbmRleDogOTk5O1xuXHQuZm9ybS13cmFwcGVyOjotd2Via2l0LXNjcm9sbGJhcntcblx0XHR3aWR0aDogNHB4O1xuXHR9XG5cdC5mb3JtLXdyYXBwZXI6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNre1xuXHRcdGJhY2tncm91bmQtY29sb3I6IHRyYW5zcGFyZW50O1xuXHR9XG5cdC5mb3JtLXdyYXBwZXI6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1ie1xuXHRcdGJvcmRlci1yYWRpdXM6IDMwcHg7XG5cdFx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcblx0fVxuXHRcbn1cbi5mb3JtLWNvbnRlbnR7XG5cdHdpZHRoOiBtaW4oNjUwcHgsOTAlKTtcbn1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aCA6IDc2OHB4KXtcblx0LmZvcm0tY29udGVudHtcblx0XHR0b3A6IDUwJSAhaW1wb3J0YW50O1xuXHRcdGxlZnQ6IDUwJSAhaW1wb3J0YW50O1xuXHRcdHRyYW5zZm9ybTogdHJhbnNsYXRlKC01MCUsLTUwJSkgIWltcG9ydGFudDtcblx0fVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 72748:
/*!***************************************************************!*\
  !*** ./src/app/view/user/schedule/schedule-routing.module.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleRoutingModule: () => (/* binding */ ScheduleRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _schedule_view_schedule_view_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule-view/schedule-view.component */ 18998);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);




const routes = [{
  path: '',
  component: _schedule_view_schedule_view_component__WEBPACK_IMPORTED_MODULE_0__.ScheduleViewComponent,
  data: {
    trackingTag: 'schedule'
  }
}];
class ScheduleRoutingModule {
  static {
    this.ɵfac = function ScheduleRoutingModule_Factory(t) {
      return new (t || ScheduleRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: ScheduleRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](ScheduleRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
  });
})();

/***/ }),

/***/ 82371:
/*!*******************************************************************************************!*\
  !*** ./src/app/view/user/schedule/schedule-view/custom-event-title-formatter.provider.ts ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CustomEventTitleFormatter: () => (/* binding */ CustomEventTitleFormatter)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var angular_calendar__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! angular-calendar */ 35519);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 60316);




class CustomEventTitleFormatter extends angular_calendar__WEBPACK_IMPORTED_MODULE_0__.CalendarEventTitleFormatter {
  constructor(locale) {
    super();
    this.locale = locale;
  }
  week(event) {
    return `<b>${(0,_angular_common__WEBPACK_IMPORTED_MODULE_1__.formatDate)(event.start, 'hh:mm a', this.locale)}</b> ${event.title} `;
  }
  weekTooltip(event) {
    return '';
  }
  static {
    this.ɵfac = function CustomEventTitleFormatter_Factory(t) {
      return new (t || CustomEventTitleFormatter)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_2__.LOCALE_ID));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: CustomEventTitleFormatter,
      factory: CustomEventTitleFormatter.ɵfac
    });
  }
}

/***/ }),

/***/ 18998:
/*!*****************************************************************************!*\
  !*** ./src/app/view/user/schedule/schedule-view/schedule-view.component.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleViewComponent: () => (/* binding */ ScheduleViewComponent)
/* harmony export */ });
/* harmony import */ var angular_calendar__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! angular-calendar */ 35519);
/* harmony import */ var date_fns__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! date-fns */ 23206);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var _custom_event_title_formatter_provider__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./custom-event-title-formatter.provider */ 82371);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var src_app_shared_utility_scheduleClassColors_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/scheduleClassColors.util */ 78346);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _schedule_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../schedule.service */ 56926);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _shared_directives_calendar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/directives/calendar */ 70127);
/* harmony import */ var _add_edit_schedule_add_edit_schedule_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../add-edit-schedule/add-edit-schedule.component */ 32706);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
















const _c0 = ["tooltip_modal"];
const _c1 = ["scrollableElement"];
function ScheduleViewComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div")(1, "app-add-edit-schedule", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("close", function ScheduleViewComponent_div_15_Template_app_add_edit_schedule_close_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r8);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r7.onClosePopUp($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("cordinate", ctx_r1.cordinate)("formData", ctx_r1.selectedEvent)("cellData", ctx_r1.cellData)("mode", ctx_r1.mode);
  }
}
function ScheduleViewComponent_mwl_calendar_week_view_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "mwl-calendar-week-view", 41, 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("hourSegmentClicked", function ScheduleViewComponent_mwl_calendar_week_view_38_Template_mwl_calendar_week_view_hourSegmentClicked_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r11);
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](45);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r10.onEmptySlotClicked($event, _r5));
    })("beforeViewRender", function ScheduleViewComponent_mwl_calendar_week_view_38_Template_mwl_calendar_week_view_beforeViewRender_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r11);
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r12.beforeViewRender($event));
    })("eventTimesChanged", function ScheduleViewComponent_mwl_calendar_week_view_38_Template_mwl_calendar_week_view_eventTimesChanged_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r11);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r13.eventTimesChanged($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](40);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("viewDate", ctx_r2.viewDate)("events", ctx_r2.events)("weekStartsOn", 1)("refresh", ctx_r2.refresh)("eventTemplate", _r3)("hourSegmentHeight", 100)("dayStartHour", 7)("dayEndHour", 18)("hourSegments", 1);
  }
}
function ScheduleViewComponent_ng_template_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function ScheduleViewComponent_ng_template_39_Template_div_click_0_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r18);
      const weekEvents_r14 = restoredCtx.weekEvent;
      const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](45);
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r17.handleCustomClick($event, {
        event: weekEvents_r14,
        sourceEvent: $event.currentTarget
      }, _r5));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](1, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](2, "img", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](5, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](9, "p", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const weekEvents_r14 = ctx.weekEvent;
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵstyleProp"]("color", "#ffffff")("background-color", weekEvents_r14.event.color.secondary)("border", "1px solid " + weekEvents_r14.event.color.primary);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", weekEvents_r14.event.meta.events.multi ? "multiSchedule" : "");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](weekEvents_r14.event.meta.events.teacher.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", weekEvents_r14.event.meta.class, " \u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", weekEvents_r14.event.meta.subject, " \u00A0");
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"]("", weekEvents_r14.event.meta.events.topic, " \u00A0");
  }
}
const _c2 = function () {
  return {
    heading: "Delete Schedule",
    confirmationText: "Are you sure you want to delete this Schedule?",
    primaryButtonLabel: "Delete",
    primaryButtonType: "delete"
  };
};
function ScheduleViewComponent_app_delete_detail_75_Template(rf, ctx) {
  if (rf & 1) {
    const _r20 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "app-delete-detail", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("close", function ScheduleViewComponent_app_delete_detail_75_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r20);
      const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r19.closeDelete($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction0"](1, _c2));
  }
}
class ScheduleViewComponent {
  constructor(service, utility, datePipe, router) {
    this.service = service;
    this.utility = utility;
    this.datePipe = datePipe;
    this.router = router;
    this.daysInWeek = [];
    this.showPopUp = false;
    this.title = 'Lesson Name:Electricity and Circuits';
    this.class = 6;
    this.section = 'A';
    this.subject = 'Sceince';
    this.events = [];
    this.activeDayIsOpen = true;
    this.viewOnly = false;
    this.teacherSchedule = true;
    this.view = angular_calendar__WEBPACK_IMPORTED_MODULE_8__.CalendarView.Week;
    this.CalendarView = angular_calendar__WEBPACK_IMPORTED_MODULE_8__.CalendarView;
    this.viewDate = new Date();
    // exclude weekends
    this.excludeDays = [0, 7];
    this.actions = [{
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({
        event
      }) => {
        this.handleEvent('Edited', event);
      }
    }, {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({
        event
      }) => {
        this.events = this.events.filter(iEvent => iEvent !== event);
        this.handleEvent('Deleted', event);
      }
    }];
    this.eventsData = [];
    this.refresh = new rxjs__WEBPACK_IMPORTED_MODULE_9__.Subject();
  }
  ngAfterViewInit() {
    this.scrollableElement.nativeElement.addEventListener('scroll', () => {
      this.tooltip.nativeElement.style.display = 'none';
    });
  }
  ngOnInit() {
    this.previousStartDate = '';
    this.previousEndDate = '';
    const userData = localStorage.getItem('userData'); //user data for teacher id and school id
    if (userData) {
      const parsedUserData = JSON.parse(userData);
      this.teacherId = parsedUserData._id;
    }
  }
  beforeViewRender(evenValue) {
    const newstartDate = this.datePipe.transform(evenValue.period.start, 'yyyy-MM-dd');
    const newendDate = this.datePipe.transform(evenValue.period.end, 'yyyy-MM-dd');
    if (newstartDate !== this.previousStartDate || newendDate !== this.previousEndDate) {
      this.startDate = newstartDate;
      this.endDate = newendDate;
      // Update previous dates
      this.previousStartDate = newstartDate;
      this.previousEndDate = newendDate;
      // Make the API call
      this.getAllDetails(this.startDate, this.endDate);
    }
  }
  /**
   * Function triggered on schedule type change
   * @param val
   */
  scheduleTypeChange(val) {
    this.teacherSchedule = val;
    this.getAllDetails(this.startDate, this.endDate);
  }
  getAllDetails(startDate, endDate) {
    this.service.getAllSchedule(startDate, endDate, this.teacherSchedule).subscribe({
      next: res => {
        this.eventsData = res.data;
        this.CreateEvent(this.eventsData);
        this.refresh.next();
      }
    });
  }
  handleEvent(action, event, ele = null) {
    this.modalData = {
      event,
      action
    };
    this.selectedEvent = event.event;
    if (this.selectedEvent.event.meta.teacherId !== this.teacherId) {
      this.viewOnly = true;
    } else {
      this.viewOnly = false;
    }
    let parentElement;
    if (event?.sourceEvent) {
      parentElement = event.sourceEvent?.parentNode;
    }
    this.placeTooltip(ele, parentElement);
    this.sendCordinate(parentElement);
    this.closeDialogue();
  }
  CreateEvent(eventsData) {
    this.events = [];
    for (let events of eventsData) {
      let index = 0;
      for (let scheduleItem of events.scheduleDateTime) {
        this.events.push(this.setEventData(events, this.utility.formateDate(scheduleItem), index));
        index++;
      }
    }
  }
  getEventColor(key) {
    return src_app_shared_utility_scheduleClassColors_util__WEBPACK_IMPORTED_MODULE_1__.dashboardColors.get(key) || {
      primary: '#000000',
      secondary: '#FFFFFF'
    }; // Default to black/white if key not found
  }

  setEventData(eventVal, date_time, index) {
    const [year, month, day] = date_time.date.split('-').map(Number);
    const [fromHour, fromMinute] = date_time.fromTime.split(':').map(Number);
    const [toHour, toMinute] = date_time.toTime.split(':').map(Number);
    const eventColor = this.getEventColor(eventVal.class);
    return {
      start: (0,date_fns__WEBPACK_IMPORTED_MODULE_10__.startOfMinute)(new Date(year, month - 1, day, fromHour, fromMinute, 0)),
      end: (0,date_fns__WEBPACK_IMPORTED_MODULE_10__.startOfMinute)(new Date(year, month - 1, day, toHour, toMinute, 0)),
      title: 'Schedule View',
      color: eventColor,
      actions: this.actions,
      id: eventVal._id,
      meta: {
        index: index,
        class: eventVal.class,
        section: eventVal.section,
        subject: this.utility.getSubjectDisplayName(eventVal.lesson.subjects),
        date: date_time.date,
        lessonId: this.title,
        schdule_id: date_time._id,
        teacherId: eventVal.teacherId,
        events: eventVal
      },
      draggable: false,
      resizable: {
        beforeStart: false,
        afterEnd: false
      }
    };
  }
  navigateLessonPlan(toolTip) {
    this.router.navigate(['/content-generation/lesson-plan', this.selectedEvent.event.meta.events.lessonId]);
    toolTip.style.display = 'none';
  }
  viewSchedule(toolTip) {
    toolTip.style.display = 'none';
    this.mode = 'view';
    this.showPopUp = true;
  }
  editSchedule(toolTip) {
    toolTip.style.display = 'none';
    this.mode = 'edit';
    this.showPopUp = true;
  }
  openModalForDeleteConfirm(toolTip) {
    toolTip.style.display = 'none';
    this.showDelete = true;
  }
  eventTimesChanged({
    event,
    newStart,
    newEnd
  }) {
    this.events = this.events.map(iEvent => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd
        };
      }
      return iEvent;
    });
  }
  handleCustomClick(event, calendarEvent, ele) {
    event.stopPropagation();
    event.preventDefault();
    this.handleEvent('clicked', calendarEvent, ele);
  }
  /**
   * triggered when empty slot clicked on the calendar
   * remove the tooltip if it is opened and return
   * formatted the date and time and set this to the celldata variable which will be passed to the modal
   *
   * @param mouseEvent
   * @param toolTip
   * @returns
   */
  onEmptySlotClicked(mouseEvent, toolTip) {
    // hide create in all schedule 
    if (!this.teacherSchedule) {
      return;
    }
    // if tooltip already open then just close the tooltip and return
    if (toolTip.style.display === "flex") {
      toolTip.style.display = 'none';
      return;
    }
    const date = mouseEvent.date;
    this.formateCellDate(date);
    let parentElement;
    if (mouseEvent.sourceEvent?.srcElement) {
      parentElement = mouseEvent.sourceEvent.srcElement.parentNode;
    }
    this.setScheduleData('cellClick', parentElement);
    this.closeDialogue();
  }
  formateCellDate(date) {
    // Extract date parts
    let day = date.getDate();
    let month = date.getMonth() + 1; // Months are zero-based
    let year = date.getFullYear();
    if (day < 10) {
      day = `0${day}`;
    }
    if (month < 10) {
      month = `0${month}`;
    }
    // Extract time parts
    let hours = date.getHours();
    let min = date.getMinutes();
    if (min > 0) {
      hours += 1;
    }
    let EndHour = hours + 1;
    if (hours < 10) {
      hours = `0${hours}`;
    }
    if (EndHour < 10) {
      EndHour = `0${EndHour}`;
    }
    // Format date and time as needed
    const formattedDate = `${year}-${month}-${day}`;
    const formattedTime = `${hours}:00`;
    const formatedEndHour = `${EndHour}:00`;
    this.cellData = {
      date: formattedDate,
      time: formattedTime,
      EndHour: formatedEndHour
    };
  }
  deleteEvent(eventToDelete) {
    this.events = this.events.filter(event => event !== eventToDelete);
  }
  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  /**
   * get the cordinates of the passed element and set that to cordinate variable to send to the modal
   * @param ele
   */
  sendCordinate(ele) {
    const rect = ele.getBoundingClientRect();
    this.cordinate = {
      rect: rect,
      element: ele
    };
  }
  placeTooltip(ele, parentElement) {
    ele.style.transform = 'translateY(0%)';
    ele.style.display = 'flex';
    const rect = parentElement.getBoundingClientRect();
    const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    ele.style.left = `${rect.left + parentElement.offsetWidth}px`;
    ele.style.top = `${rect.top + parentElement.offsetHeight}px`;
    // handling right intersection
    if (rect.right + ele.offsetWidth > vw) {
      ele.style.left = `${rect.left - ele.offsetWidth}px`;
    }
    if (rect.top - ele.offsetHeight < 0) {
      ele.style.top = `${rect.bottom}`;
    }
    // handling bottom intersection
    if (rect.bottom + ele.offsetHeight > vh) {
      ele.style.top = ` ${rect.top - ele.offsetHeight}px`;
    }
    if (rect.top - ele.offsetHeight < 0 && rect.bottom + ele.offsetHeight > vh) {
      ele.style.top = '50%';
      ele.style.transform = 'translateY(-50%)';
    }
  }
  onAddClick(ele) {
    const date = new Date();
    this.formateCellDate(date);
    this.setScheduleData('create', ele);
  }
  closeDialogue() {
    const dialogueEle = document.getElementById('dialogue');
    window.addEventListener('click', event => {
      if (dialogueEle) {
        const rectVal = dialogueEle?.getBoundingClientRect();
        const isInDialog = rectVal.top <= event.clientY && event.clientY <= rectVal.top + rectVal.height && rectVal.left <= event.clientX && event.clientX <= rectVal.left + rectVal.width;
        if (!isInDialog) {
          dialogueEle.style.display = 'none';
        }
      }
    });
  }
  closeDelete(value) {
    if (value === 'delete') {
      this.service.deleteSchedule(this.selectedEvent.event.id, this.selectedEvent.event.meta.schdule_id).subscribe({
        next: val => {
          this.utility.showSuccess('Successfully Deleted');
          this.getAllDetails(this.startDate, this.endDate);
        },
        error: err => {
          this.utility.handleError(err);
        }
      });
    }
    this.showDelete = false;
  }
  onClosePopUp(event) {
    if (event === 'save') {
      this.getAllDetails(this.startDate, this.endDate); //reset the event data
    }

    this.showPopUp = false;
  }
  setScheduleData(eventName, ele) {
    this.selectedEvent = null;
    this.sendCordinate(ele);
    //we don't send the date and time when opening create pop up while clicking create button
    // if(eventName === 'create'){
    //   this.cellData = null;
    // }
    this.mode = 'add';
    this.showPopUp = true;
  }
  static {
    this.ɵfac = function ScheduleViewComponent_Factory(t) {
      return new (t || ScheduleViewComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_schedule_service__WEBPACK_IMPORTED_MODULE_2__.ScheduleService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_11__.DatePipe), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
      type: ScheduleViewComponent,
      selectors: [["app-schedule-view"]],
      viewQuery: function ScheduleViewComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c0, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵviewQuery"](_c1, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.tooltip = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵloadQuery"]()) && (ctx.scrollableElement = _t.first);
        }
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵProvidersFeature"]([{
        provide: angular_calendar__WEBPACK_IMPORTED_MODULE_8__.CalendarEventTitleFormatter,
        useClass: _custom_event_title_formatter_provider__WEBPACK_IMPORTED_MODULE_0__.CustomEventTitleFormatter
      }, _angular_common__WEBPACK_IMPORTED_MODULE_11__.DatePipe])],
      decls: 76,
      vars: 50,
      consts: [[1, "schedule-wrapper", "bg-white", "p-8"], ["scrollableElement", ""], [1, "schedule-content"], [1, "header", "flex", "flex-col", "md:flex-row", "justify-between", "gap-4", "items-start", "md:items-center"], ["data-testid", "schedule-header-title", 1, "md:text-[30px]", "md:leading-[48px]", "font-bold", "text-content", "text-xl"], [1, "self-center"], ["data-testid", "my-schedules-tab-btn", 1, "rounded-r-none", "border", "border-primary", "min-w-36", 3, "ngClass", "click"], [1, "rounded-l-none", "border", "border-primary", "min-w-36", 3, "ngClass", "click"], [1, "border", "p-4", "md:p-8", "mt-2", "relative"], [4, "ngIf"], [1, "flex", "justify-between", "items-center", "flex-wrap", "gap-4"], [1, "min-w-fit"], [1, "font-normal", "md:text-2xl", "text-lg", "md:leading-9", "text-content-100"], [1, "btn-group", "flex", "gap-4", "items-center", "ml-auto", "min-w-fit"], ["mwlCalendarPreviousView", "", 1, "bg-shade-80", "p-1", "md:py-1", "md:px-4", "rounded", "text-sm", "md:text-lg", "text-primary", 3, "view", "viewDate", "viewDateChange"], ["src", "assets/icons/Chevron left large.svg", "alt", "", 1, "inline-block", "mb-[2px]"], [1, "sr-only", "md:not-sr-only", "md:inline", "text-base"], [1, "mb-0"], [1, "mb-0", "text-xs", "md:text-base", "text-content"], ["mwlCalendarNextView", "", 1, "bg-shade-80", "p-1", "md:py-1", "md:px-4", "rounded", "text-primary", "text-sm", "md:text-lg", 3, "view", "viewDate", "viewDateChange"], ["src", "assets/icons/Chevron right large.svg", "alt", "", 1, "inline-block"], [1, "week", "overflow-auto", "my-schedule", 3, "ngSwitch"], ["data-testid", "calendar-week-view", "appCalendarAccessibility", "", 3, "viewDate", "events", "weekStartsOn", "refresh", "eventTemplate", "hourSegmentHeight", "dayStartHour", "dayEndHour", "hourSegments", "hourSegmentClicked", "beforeViewRender", "eventTimesChanged", 4, "ngSwitchCase"], ["customCellTemplate", ""], ["id", "dialogue", "data-testid", "schedule-tooltip-menu", 1, "flex", "justify-center", "tooltip", "fixed", "z-[100]"], ["tooltip_modal", ""], ["role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 1, "mt-1", "w-48", "rounded-md", "shadow-lg", "bg-white", "ring-1", "ring-black", "ring-opacity-5", "focus:outline-none", "z-50"], [1, "h-10", "hover:bg-shade-80", "cursor-pointer", "lesson-plan", 3, "ngClass", "click"], ["role", "menuitem", 1, "block", "px-4", "py-2", "text-sm", "text-content"], [1, "flex", "items-center"], ["src", "assets/icons/lesson-plan-black.svg", "alt", "", 1, "mx-2"], ["data-testid", "tooltip-view-details-option", 1, "h-10", "hover:bg-shade-80", "cursor-pointer", 3, "click"], ["src", "assets/icons/Visibility.svg", "alt", "", 1, "mx-2"], ["data-testid", "tooltip-edit-details-option", 1, "h-10", "hover:bg-shade-80", "cursor-pointer", "edit", 3, "ngClass", "click"], ["src", "assets/icons/Vector.svg", "alt", "", 1, "mx-2"], ["data-testid", "tooltip-delete-option", 1, "h-10", "hover:bg-shade-80", "cursor-pointer", "delete", 3, "ngClass"], ["role", "menuitem", 1, "block", "px-4", "py-2", "text-sm", "text-content", 3, "click"], ["src", "assets/icons/trash.svg", "alt", "", 1, "mx-2"], [1, "text-error"], ["data-testid", "delete-confirm-modal", 3, "config", "close", 4, "ngIf"], ["data-testid", "add-edit-schedule-popup", 3, "cordinate", "formData", "cellData", "mode", "close"], ["data-testid", "calendar-week-view", "appCalendarAccessibility", "", 3, "viewDate", "events", "weekStartsOn", "refresh", "eventTemplate", "hourSegmentHeight", "dayStartHour", "dayEndHour", "hourSegments", "hourSegmentClicked", "beforeViewRender", "eventTimesChanged"], ["calender_ele", ""], ["data-testid", "schedule-event-card", 1, "bg-primary-100", "text-xs", "rounded", "p-2", "h-full", "min-h-[80px]", "text-ellipsis", "overflow-hidden", "whitespace-nowrap", "schedule-view", 3, "ngClass", "click"], [1, "font-bold", "text-left", "mb-1", "flex", "items-center", "gap-1"], ["src", "assets/icons/user-icon.svg", "alt", "", "width", "10", "height", "10", 1, "w-[20px]", "h-[20px]", "rounded-full"], [1, "overflow-hidden", "whitespace-nowrap", "text-ellipsis"], [1, "overflow-hidden", "text-ellipsis", "whitespace-nowrap"], ["data-testid", "delete-confirm-modal", 3, "config", "close"]],
      template: function ScheduleViewComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r21 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "section", 0, 1)(2, "div", 2)(3, "div", 3)(4, "h1", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](6, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](7, "div", 5)(8, "button", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function ScheduleViewComponent_Template_button_click_8_listener() {
            return ctx.scheduleTypeChange(true);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](10, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](11, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function ScheduleViewComponent_Template_button_click_11_listener() {
            return ctx.scheduleTypeChange(false);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](13, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](14, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](15, ScheduleViewComponent_div_15_Template, 2, 4, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](16, "div", 10)(17, "div", 11)(18, "h2", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](19);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](20, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](21, "div", 13)(22, "button", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("viewDateChange", function ScheduleViewComponent_Template_button_viewDateChange_22_listener($event) {
            return ctx.viewDate = $event;
          })("viewDateChange", function ScheduleViewComponent_Template_button_viewDateChange_22_listener() {
            return ctx.closeOpenMonthViewDay();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](23, "img", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](24, "span", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](25);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](26, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](27, "div", 17)(28, "h3", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](29);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](30, "calendarDate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](31, "button", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("viewDateChange", function ScheduleViewComponent_Template_button_viewDateChange_31_listener($event) {
            return ctx.viewDate = $event;
          })("viewDateChange", function ScheduleViewComponent_Template_button_viewDateChange_31_listener() {
            return ctx.closeOpenMonthViewDay();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](32, "span", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](34, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](35, "img", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](36, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](37, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](38, ScheduleViewComponent_mwl_calendar_week_view_38_Template, 2, 9, "mwl-calendar-week-view", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](39, ScheduleViewComponent_ng_template_39_Template, 11, 11, "ng-template", null, 23, _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](41, "br")(42, "br")(43, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](44, "div", 24, 25)(46, "ul", 26)(47, "li", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function ScheduleViewComponent_Template_li_click_47_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r21);
            const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](45);
            return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx.navigateLessonPlan(_r5));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](48, "a", 28)(49, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](50, "img", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](51, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](52);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](53, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](54, "li", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function ScheduleViewComponent_Template_li_click_54_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r21);
            const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](45);
            return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx.viewSchedule(_r5));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](55, "a", 28)(56, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](57, "img", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](58, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](59);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](60, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](61, "li", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function ScheduleViewComponent_Template_li_click_61_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r21);
            const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](45);
            return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx.editSchedule(_r5));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](62, "a", 28)(63, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](64, "img", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](65, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](66);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](67, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](68, "li", 35)(69, "a", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("click", function ScheduleViewComponent_Template_a_click_69_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r21);
            const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵreference"](45);
            return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx.openModalForDeleteConfirm(_r5));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](70, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](71, "img", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](72, "span", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](73);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](74, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](75, ScheduleViewComponent_app_delete_detail_75_Template, 1, 2, "app-delete-detail", 39);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](6, 24, "My Schedules"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", ctx.teacherSchedule ? "btn-primary" : "btn-primary-outline");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](10, 26, "My Schedules"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", !ctx.teacherSchedule ? "btn-primary" : "btn-primary-outline");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](13, 28, "Others' Schedules"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.showPopUp);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind2"](20, 30, ctx.viewDate, "MMMM YYYY"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("view", ctx.view)("viewDate", ctx.viewDate);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](26, 33, "Previous Week"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind4"](30, 35, ctx.viewDate, ctx.view + "ViewTitle", "en", 1));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("view", ctx.view)("viewDate", ctx.viewDate);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](34, 40, "Next week"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngSwitch", ctx.view);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngSwitchCase", ctx.CalendarView.Week);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", ctx.viewOnly ? "viewOnly" : "");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](53, 42, "View Lesson Plan"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](60, 44, "View Details"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", ctx.viewOnly ? "viewOnly" : "");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](67, 46, "Edit Details"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngClass", ctx.viewOnly ? "viewOnly" : "");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](74, 48, "Delete"));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.showDelete);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgSwitch, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgSwitchCase, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_4__.DeleteDetailComponent, angular_calendar__WEBPACK_IMPORTED_MODULE_8__["ɵCalendarPreviousViewDirective"], angular_calendar__WEBPACK_IMPORTED_MODULE_8__["ɵCalendarNextViewDirective"], angular_calendar__WEBPACK_IMPORTED_MODULE_8__.CalendarWeekViewComponent, _shared_directives_calendar__WEBPACK_IMPORTED_MODULE_5__.CalendarAccessibilityDirective, _add_edit_schedule_add_edit_schedule_component__WEBPACK_IMPORTED_MODULE_6__.AddEditScheduleComponent, _angular_common__WEBPACK_IMPORTED_MODULE_11__.DatePipe, angular_calendar__WEBPACK_IMPORTED_MODULE_8__["ɵCalendarDatePipe"], _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslatePipe],
      styles: [".schedule-wrapper[_ngcontent-%COMP%] {\n  height: 100vh;\n  overflow-y: auto;\n}\n.schedule-wrapper[_ngcontent-%COMP%]::-webkit-scrollbar {\n  display: none;\n}\n\n.pop-up[_ngcontent-%COMP%] {\n  position: absolute;\n  inset: 0;\n  background-color: var(--content-30);\n}\n\n.lesson-plan.viewOnly[_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.edit.viewOnly[_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.delete.viewOnly[_ngcontent-%COMP%] {\n  cursor: not-allowed;\n  opacity: 0.5;\n  pointer-events: none;\n}\n\n.tooltip[_ngcontent-%COMP%] {\n  display: none;\n}\n\n.schedule-view[_ngcontent-%COMP%]:hover {\n  width: 100%;\n  transition: all 0.3s ease;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNjaGVkdWxlLXZpZXcuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDQyxhQUFBO0VBQ0EsZ0JBQUE7QUFDRDtBQUFDO0VBQ0MsYUFBQTtBQUVGOztBQUNBO0VBQ0Msa0JBQUE7RUFDQSxRQUFBO0VBQ0EsbUNBQUE7QUFFRDs7QUFFQztFQUNDLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLG9CQUFBO0FBQ0Y7O0FBSUM7RUFDQyxtQkFBQTtFQUNBLFlBQUE7RUFDQSxvQkFBQTtBQURGOztBQUtDO0VBQ0MsbUJBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7QUFGRjs7QUFTQTtFQUNDLGFBQUE7QUFORDs7QUFTQTtFQUNDLFdBQUE7RUFDQSx5QkFBQTtBQU5EIiwiZmlsZSI6InNjaGVkdWxlLXZpZXcuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc2NoZWR1bGUtd3JhcHBlcntcblx0aGVpZ2h0OiAxMDB2aDtcblx0b3ZlcmZsb3cteTogYXV0bztcblx0Jjo6LXdlYmtpdC1zY3JvbGxiYXJ7XG5cdFx0ZGlzcGxheTogbm9uZTtcblx0fVxufVxuLnBvcC11cHtcblx0cG9zaXRpb246IGFic29sdXRlO1xuXHRpbnNldDogMDtcblx0YmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29udGVudC0zMCk7XG59XG5cbi5sZXNzb24tcGxhbntcblx0Ji52aWV3T25seXtcblx0XHRjdXJzb3I6IG5vdC1hbGxvd2VkO1xuXHRcdG9wYWNpdHk6IDAuNTtcblx0XHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0fVxufVxuXG4uZWRpdHtcblx0Ji52aWV3T25seXtcblx0XHRjdXJzb3I6IG5vdC1hbGxvd2VkO1xuXHRcdG9wYWNpdHk6IDAuNTtcblx0XHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0fVxufVxuLmRlbGV0ZXtcblx0Ji52aWV3T25seXtcblx0XHRjdXJzb3I6IG5vdC1hbGxvd2VkO1xuXHRcdG9wYWNpdHk6IDAuNTtcblx0XHRwb2ludGVyLWV2ZW50czogbm9uZTtcblx0XHRcblxuXHR9XG59XG5cblxuLnRvb2x0aXB7XG5cdGRpc3BsYXk6IG5vbmU7XG59XG5cbi5zY2hlZHVsZS12aWV3OmhvdmVye1xuXHR3aWR0aDogMTAwJTtcblx0dHJhbnNpdGlvbjogYWxsIC4zcyBlYXNlO1xufVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL3NjaGVkdWxlL3NjaGVkdWxlLXZpZXcvc2NoZWR1bGUtdmlldy5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNDLGFBQUE7RUFDQSxnQkFBQTtBQUNEO0FBQUM7RUFDQyxhQUFBO0FBRUY7O0FBQ0E7RUFDQyxrQkFBQTtFQUNBLFFBQUE7RUFDQSxtQ0FBQTtBQUVEOztBQUVDO0VBQ0MsbUJBQUE7RUFDQSxZQUFBO0VBQ0Esb0JBQUE7QUFDRjs7QUFJQztFQUNDLG1CQUFBO0VBQ0EsWUFBQTtFQUNBLG9CQUFBO0FBREY7O0FBS0M7RUFDQyxtQkFBQTtFQUNBLFlBQUE7RUFDQSxvQkFBQTtBQUZGOztBQVNBO0VBQ0MsYUFBQTtBQU5EOztBQVNBO0VBQ0MsV0FBQTtFQUNBLHlCQUFBO0FBTkQ7QUFDQSxvN0NBQW83QyIsInNvdXJjZXNDb250ZW50IjpbIi5zY2hlZHVsZS13cmFwcGVye1xuXHRoZWlnaHQ6IDEwMHZoO1xuXHRvdmVyZmxvdy15OiBhdXRvO1xuXHQmOjotd2Via2l0LXNjcm9sbGJhcntcblx0XHRkaXNwbGF5OiBub25lO1xuXHR9XG59XG4ucG9wLXVwe1xuXHRwb3NpdGlvbjogYWJzb2x1dGU7XG5cdGluc2V0OiAwO1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1jb250ZW50LTMwKTtcbn1cblxuLmxlc3Nvbi1wbGFue1xuXHQmLnZpZXdPbmx5e1xuXHRcdGN1cnNvcjogbm90LWFsbG93ZWQ7XG5cdFx0b3BhY2l0eTogMC41O1xuXHRcdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXHR9XG59XG5cbi5lZGl0e1xuXHQmLnZpZXdPbmx5e1xuXHRcdGN1cnNvcjogbm90LWFsbG93ZWQ7XG5cdFx0b3BhY2l0eTogMC41O1xuXHRcdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXHR9XG59XG4uZGVsZXRle1xuXHQmLnZpZXdPbmx5e1xuXHRcdGN1cnNvcjogbm90LWFsbG93ZWQ7XG5cdFx0b3BhY2l0eTogMC41O1xuXHRcdHBvaW50ZXItZXZlbnRzOiBub25lO1xuXHRcdFxuXG5cdH1cbn1cblxuXG4udG9vbHRpcHtcblx0ZGlzcGxheTogbm9uZTtcbn1cblxuLnNjaGVkdWxlLXZpZXc6aG92ZXJ7XG5cdHdpZHRoOiAxMDAlO1xuXHR0cmFuc2l0aW9uOiBhbGwgLjNzIGVhc2U7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 10957:
/*!*******************************************************!*\
  !*** ./src/app/view/user/schedule/schedule.module.ts ***!
  \*******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleModule: () => (/* binding */ ScheduleModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _schedule_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./schedule-routing.module */ 72748);
/* harmony import */ var _add_edit_schedule_add_edit_schedule_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./add-edit-schedule/add-edit-schedule.component */ 32706);
/* harmony import */ var _schedule_view_schedule_view_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./schedule-view/schedule-view.component */ 18998);
/* harmony import */ var src_app_shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/dropdown/dropdown.component */ 62157);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var angular_calendar__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! angular-calendar */ 35519);
/* harmony import */ var angular_calendar_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! angular-calendar/date-adapters/date-fns */ 66111);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var src_app_shared_directives_calendar__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/directives/calendar */ 70127);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/cdk/a11y */ 72102);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 37580);














class ScheduleModule {
  static {
    this.ɵfac = function ScheduleModule_Factory(t) {
      return new (t || ScheduleModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineNgModule"]({
      type: ScheduleModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineInjector"]({
      providers: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.DatePipe],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _schedule_routing_module__WEBPACK_IMPORTED_MODULE_0__.ScheduleRoutingModule, src_app_shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.DropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_4__.DeleteDetailComponent, angular_calendar__WEBPACK_IMPORTED_MODULE_9__.CalendarModule.forRoot({
        provide: angular_calendar__WEBPACK_IMPORTED_MODULE_9__.DateAdapter,
        useFactory: angular_calendar_date_adapters_date_fns__WEBPACK_IMPORTED_MODULE_10__.adapterFactory
      }), _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslateModule, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_12__.A11yModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsetNgModuleScope"](ScheduleModule, {
    declarations: [_add_edit_schedule_add_edit_schedule_component__WEBPACK_IMPORTED_MODULE_1__.AddEditScheduleComponent, _schedule_view_schedule_view_component__WEBPACK_IMPORTED_MODULE_2__.ScheduleViewComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _schedule_routing_module__WEBPACK_IMPORTED_MODULE_0__.ScheduleRoutingModule, src_app_shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.DropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_8__.ReactiveFormsModule, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_4__.DeleteDetailComponent, angular_calendar__WEBPACK_IMPORTED_MODULE_9__.CalendarModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslateModule, src_app_shared_directives_calendar__WEBPACK_IMPORTED_MODULE_5__.CalendarAccessibilityDirective, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_12__.A11yModule]
  });
})();

/***/ }),

/***/ 56926:
/*!********************************************************!*\
  !*** ./src/app/view/user/schedule/schedule.service.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ScheduleService: () => (/* binding */ ScheduleService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);





class ScheduleService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  constructor(http) {
    super(http);
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
    this.setUri('schedule');
  }
  getAllSchedule(fromDate, toDate, teacherScheduleVal) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('fromDate', fromDate).set('toDate', toDate).set('teacherSchedule', teacherScheduleVal);
    return this.get('get-by-school', params);
  }
  getSchoolInfoByID() {
    return this.http.get(`${this.baseUrl}/auth/me`);
  }
  getAllChapter(body) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('filter[board]', body.board).set('filter[medium]', body.medium).set('filter[standard]', body.standard).set('filter[subject]', body.subject).set('limit', "999").set('sortBy', 'orderNumber').set('sortOrder', 'asc');
    return this.http.get(`${this.baseUrl}/chapter/list`, {
      params: params
    });
  }
  getAllSubTopic(body) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('filter[board]', body.board).set('filter[medium]', body.medium).set('filter[class]', body.standard).set('filter[subject]', body.subject).set('filter[topics]', body.topic).set('filter[type]', "lesson").set('filter[isCompleted]', "true").set('filter[isGroupedSubTopics]', "true").set('page', "1").set('limit', "999");
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/list`, {
      params: params
    });
  }
  getLessonPlan(body) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('filter[topics]', body.topics).set('filter[subTopics]', body.subTopics).set('filter[class]', body.class).set('filter[type]', 'lesson');
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/list`, {
      params: params
    });
  }
  createSchedule(body) {
    return this.post('create', body);
  }
  deleteSchedule(scheduleId, timeId) {
    return this.delete(`${scheduleId}/${timeId}`);
  }
  getScheduleById(id) {
    return this.get(id);
  }
  updateSchedule(body) {
    return this.put('update', body);
  }
  static {
    this.ɵfac = function ScheduleService_Factory(t) {
      return new (t || ScheduleService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: ScheduleService,
      factory: ScheduleService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_view_user_schedule_schedule_module_ts.b0749ec3979481f5.js.map