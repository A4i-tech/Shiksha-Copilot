"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_admin_school-management_school-management_module_ts"],{

/***/ 3851:
/*!*******************************************************************************************!*\
  !*** ./src/app/view/admin/school-management/school-add-edit/school-add-edit.component.ts ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchoolAddEditComponent: () => (/* binding */ SchoolAddEditComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _school_management_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../school-management.service */ 69700);
/* harmony import */ var src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/modal/modal.service */ 51133);
/* harmony import */ var src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/services/master.service */ 2216);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/components/dropdown/dropdown.component */ 62157);
/* harmony import */ var _shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../shared/components/modal/modal.component */ 69081);
/* harmony import */ var _shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/components/upload-popup/upload-popup.component */ 86487);
/* harmony import */ var _core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../core/directives/has-permission.directive */ 87944);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
















function SchoolAddEditComponent_span_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_small_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "School name is required"));
  }
}
function SchoolAddEditComponent_small_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "School name should have atleast 5 characters"));
  }
}
function SchoolAddEditComponent_span_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_small_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "DISE Code is required"));
  }
}
function SchoolAddEditComponent_small_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "DISE Code should be of 11 digits"));
  }
}
function SchoolAddEditComponent_span_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_small_61_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Academic year start date is required"));
  }
}
function SchoolAddEditComponent_span_66_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_small_70_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Academic year end date is required"));
  }
}
function SchoolAddEditComponent_small_71_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Academic year end date must be greater than start date"));
  }
}
function SchoolAddEditComponent_th_87_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "th", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Action"), " ");
  }
}
function SchoolAddEditComponent_tr_89_p_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const holiday_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = holiday_r24.get("date")) == null ? null : tmp_0_0.value) || "-", " ");
  }
}
function SchoolAddEditComponent_tr_89_div_7_small_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Date is required"));
  }
}
function SchoolAddEditComponent_tr_89_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div")(1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "input", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](4, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_89_div_7_small_6_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const holiday_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 11, "Select date"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("min", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](3, 5, (tmp_1_0 = ctx_r27.schoolAddEditForm.get("academicYearStartDate")) == null ? null : tmp_1_0.value, "yyyy-MM-dd"))("max", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](4, 8, (tmp_2_0 = ctx_r27.schoolAddEditForm.get("academicYearEndDate")) == null ? null : tmp_2_0.value, "yyyy-MM-dd"))("required", ((tmp_3_0 = holiday_r24.get("reason")) == null ? null : tmp_3_0.value) !== "");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r27.submitted && ((tmp_4_0 = holiday_r24.get("date")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["required"]));
  }
}
function SchoolAddEditComponent_tr_89_p_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const holiday_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = holiday_r24.get("reason")) == null ? null : tmp_0_0.value) || "-", " ");
  }
}
function SchoolAddEditComponent_tr_89_div_13_p_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Reason is required"), " ");
  }
}
function SchoolAddEditComponent_tr_89_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div")(1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](4, SchoolAddEditComponent_tr_89_div_13_p_4_Template, 3, 3, "p", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const holiday_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    let tmp_1_0;
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](3, 3, "Reason"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("required", ((tmp_1_0 = holiday_r24.get("date")) == null ? null : tmp_1_0.value) !== "");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r29.submitted && ((tmp_2_0 = holiday_r24.get("reason")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["required"]));
  }
}
function SchoolAddEditComponent_tr_89_td_14_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_89_td_14_button_5_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r41);
      const i_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2).index;
      const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r39.removeHoliday(i_r25));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "img", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 1, "Delete"));
  }
}
function SchoolAddEditComponent_tr_89_td_14_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_89_td_14_button_6_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r43);
      const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r42.addHoliday());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 1, "Add"));
  }
}
function SchoolAddEditComponent_tr_89_td_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "td", 58)(1, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](5, SchoolAddEditComponent_tr_89_td_14_button_5_Template, 6, 3, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_89_td_14_button_6_Template, 6, 3, "button", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const i_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().index;
    const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](3, 4, "Action"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngClass", i_r25 === 0 ? "justify-center" : "justify-start");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", i_r25 !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", i_r25 === ctx_r30.holidayList.controls.length - 1);
  }
}
function SchoolAddEditComponent_tr_89_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "tr", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerStart"](1, 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](2, "td", 52)(3, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_89_p_6_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](7, SchoolAddEditComponent_tr_89_div_7_Template, 7, 13, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "td", 54)(9, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](11, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](12, SchoolAddEditComponent_tr_89_p_12_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](13, SchoolAddEditComponent_tr_89_div_13_Template, 5, 5, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](14, SchoolAddEditComponent_tr_89_td_14_Template, 7, 6, "td", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r25 = ctx.index;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("formGroupName", i_r25);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 8, "Date"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r12.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r12.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](11, 10, "Reason"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r12.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r12.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r12.mode !== "view");
  }
}
function SchoolAddEditComponent_th_105_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "th", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Action"), " ");
  }
}
function SchoolAddEditComponent_tr_107_p_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const resource_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = resource_r45.get("otherType")) == null ? null : tmp_0_0.value) ? (tmp_0_0 = resource_r45.get("otherType")) == null ? null : tmp_0_0.value : ((tmp_0_0 = resource_r45.get("type")) == null ? null : tmp_0_0.value) || "-", " ");
  }
}
function SchoolAddEditComponent_tr_107_ng_container_7_input_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](0, "input", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](1, "translate");
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](1, 1, "Enter resource type"));
  }
}
function SchoolAddEditComponent_tr_107_ng_container_7_p_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Resource type is required"), " ");
  }
}
function SchoolAddEditComponent_tr_107_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r57 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "div")(2, "app-dropdown", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("valueChange", function SchoolAddEditComponent_tr_107_ng_container_7_Template_app_dropdown_valueChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r57);
      const i_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().index;
      const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r55.setResourceDetailsValues(i_r46, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](3, SchoolAddEditComponent_tr_107_ng_container_7_input_3_Template, 2, 3, "input", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](4, SchoolAddEditComponent_tr_107_ng_container_7_p_4_Template, 3, 3, "p", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const resource_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    let tmp_2_0;
    let tmp_5_0;
    let tmp_6_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownCtrl", ctx_r48.convertToFormControl(resource_r45.get("type")))("dropDownValues", ctx_r48.resourceTypeDropdownOptions)("config", ((tmp_2_0 = resource_r45.get("typeChipSet")) == null ? null : tmp_2_0.value) ? ctx_r48.resourceTypeDropdownconfig : ctx_r48.resourceTypeDarkDropdownconfig)("submitted", ctx_r48.submitted)("mode", ctx_r48.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !((tmp_5_0 = resource_r45.get("typeChipSet")) == null ? null : tmp_5_0.value));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !((tmp_6_0 = resource_r45.get("typeChipSet")) == null ? null : tmp_6_0.value) && ctx_r48.submitted && ((tmp_6_0 = resource_r45.get("otherType")) == null ? null : tmp_6_0.errors == null ? null : tmp_6_0.errors["required"]));
  }
}
function SchoolAddEditComponent_tr_107_p_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const resource_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = resource_r45.get("details")) == null ? null : tmp_0_0.value == null ? null : tmp_0_0.value.length) ? (tmp_0_0 = resource_r45.get("details")) == null ? null : tmp_0_0.value : "-", " ");
  }
}
function SchoolAddEditComponent_tr_107_div_13_div_3_p_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Resource details are required"), " ");
  }
}
function SchoolAddEditComponent_tr_107_div_13_div_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](1, "app-dropdown", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](2, SchoolAddEditComponent_tr_107_div_13_div_3_p_2_Template, 3, 3, "p", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2);
    const resource_r45 = ctx_r62.$implicit;
    const i_r46 = ctx_r62.index;
    const ctx_r60 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    let tmp_4_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownCtrl", ctx_r60.convertToFormControl(resource_r45.get("details")))("dropDownValues", ctx_r60.resourceDetailsDropdownOptions[i_r46])("config", ctx_r60.resourceOtherDetailsDropdownconfig)("submitted", ctx_r60.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !((tmp_4_0 = resource_r45.get("detailsChipSet")) == null ? null : tmp_4_0.value) && ctx_r60.submitted && ((tmp_4_0 = resource_r45.get("details")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["required"]));
  }
}
function SchoolAddEditComponent_tr_107_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div")(1, "div", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "app-dropdown", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](3, SchoolAddEditComponent_tr_107_div_13_div_3_Template, 3, 5, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    const resource_r45 = ctx_r63.$implicit;
    const i_r46 = ctx_r63.index;
    const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    let tmp_0_0;
    let tmp_6_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("hidden", !((tmp_0_0 = resource_r45.get("detailsChipSet")) == null ? null : tmp_0_0.value));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownCtrl", ctx_r50.convertToFormControl(resource_r45.get("details")))("dropDownValues", ctx_r50.resourceDetailsDropdownOptions[i_r46])("config", ctx_r50.resourceDetailsDropdownconfig)("submitted", ctx_r50.submitted)("mode", ctx_r50.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !((tmp_6_0 = resource_r45.get("detailsChipSet")) == null ? null : tmp_6_0.value));
  }
}
function SchoolAddEditComponent_tr_107_td_14_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r68 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_107_td_14_button_5_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r68);
      const i_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2).index;
      const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r66.removeResource(i_r46));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "img", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 1, "Delete"));
  }
}
function SchoolAddEditComponent_tr_107_td_14_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r70 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_107_td_14_button_6_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r70);
      const ctx_r69 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r69.addResource());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 1, "Add"));
  }
}
function SchoolAddEditComponent_tr_107_td_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "td", 73)(1, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](5, SchoolAddEditComponent_tr_107_td_14_button_5_Template, 6, 3, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_107_td_14_button_6_Template, 6, 3, "button", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const i_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().index;
    const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](3, 4, "Action"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngClass", i_r46 === 0 ? "justify-center" : "justify-start");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", i_r46 !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", i_r46 === ctx_r51.facilities.controls.length - 1);
  }
}
function SchoolAddEditComponent_tr_107_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "tr", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerStart"](1, 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](2, "td", 65)(3, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_107_p_6_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](7, SchoolAddEditComponent_tr_107_ng_container_7_Template, 5, 7, "ng-container", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "td", 66)(9, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](11, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](12, SchoolAddEditComponent_tr_107_p_12_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](13, SchoolAddEditComponent_tr_107_div_13_Template, 4, 7, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](14, SchoolAddEditComponent_tr_107_td_14_Template, 7, 6, "td", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r46 = ctx.index;
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("formGroupName", i_r46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 8, "Resource Type"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r14.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r14.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](11, 10, "Resource details"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r14.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r14.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r14.mode !== "view");
  }
}
function SchoolAddEditComponent_p_108_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Add Board/Class Details"));
  }
}
function SchoolAddEditComponent_div_109_Template(rf, ctx) {
  if (rf & 1) {
    const _r73 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 75)(1, "button", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SchoolAddEditComponent_div_109_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r73);
      const ctx_r72 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r72.createBoard());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](2, "div", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](3, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](5, "Add Board/Class Details");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
  }
}
function SchoolAddEditComponent_div_110_small_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Board is required"));
  }
}
function SchoolAddEditComponent_div_110_small_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Medium is required"));
  }
}
function SchoolAddEditComponent_div_110_small_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Class min value is required"));
  }
}
function SchoolAddEditComponent_div_110_small_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "Class max value is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_span_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
const _c0 = function () {
  return {
    standalone: true
  };
};
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r97 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "input", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_2_Template_input_ngModelChange_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r97);
      const class_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](class_r85.standard = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](1, 3, "class"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", class_r85.standard)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](5, _c0));
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](class_r85.standard);
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r102 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "input", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_5_Template_input_ngModelChange_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r102);
      const class_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](class_r85.boysStrength = $event);
    })("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_5_Template_input_ngModelChange_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r102);
      const ctx_r104 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      const class_r85 = ctx_r104.$implicit;
      const j_r86 = ctx_r104.index;
      const i_r75 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2).index;
      const ctx_r103 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r103.updateTotalStrength(class_r85.boysStrength, class_r85.girlsStrength, i_r75, j_r86));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](1, 3, "No. of boys"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", class_r85.boysStrength)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](5, _c0));
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_small_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "No. of boys is required"));
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](class_r85.boysStrength);
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r110 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "input", 91);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_9_Template_input_ngModelChange_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r110);
      const class_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](class_r85.girlsStrength = $event);
    })("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_9_Template_input_ngModelChange_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r110);
      const ctx_r112 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      const class_r85 = ctx_r112.$implicit;
      const j_r86 = ctx_r112.index;
      const i_r75 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2).index;
      const ctx_r111 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r111.updateTotalStrength(class_r85.boysStrength, class_r85.girlsStrength, i_r75, j_r86));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](1, 3, "No. of girls"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngModel", class_r85.girlsStrength)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](5, _c0));
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_small_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, "No. of girls is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r85 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](class_r85.girlsStrength);
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "tr")(1, "td", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](2, SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_2_Template, 2, 6, "input", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](3, SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_3_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "td", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](5, SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_5_Template, 2, 6, "input", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](6, SchoolAddEditComponent_div_110_ng_container_14_tr_19_small_6_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](7, SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_7_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "td", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](9, SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_9_Template, 2, 6, "input", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](10, SchoolAddEditComponent_div_110_ng_container_14_tr_19_small_10_Template, 2, 0, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](11, SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_11_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const class_r85 = ctx.$implicit;
    const ctx_r84 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r84.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r84.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r84.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r84.submitted && !class_r85.boysStrength);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r84.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r84.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r84.submitted && !class_r85.girlsStrength);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r84.mode === "view");
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "p", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](4, "div", 83)(5, "table", 84)(6, "tr", 32)(7, "th", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](10, "th", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](12, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](13, SchoolAddEditComponent_div_110_ng_container_14_span_13_Template, 2, 0, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](14, "th", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](16, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](17, SchoolAddEditComponent_div_110_ng_container_14_span_17_Template, 2, 0, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerStart"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](19, SchoolAddEditComponent_div_110_ng_container_14_tr_19_Template, 12, 8, "tr", 86);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const board_r74 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]().$implicit;
    const ctx_r80 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](3, 7, "Class Details"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](9, 9, "Standard"));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](12, 11, "Boys"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r80.mode != "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](16, 13, "Girls"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r80.mode != "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", board_r74.classDetails);
  }
}
function SchoolAddEditComponent_div_110_div_15_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r121 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SchoolAddEditComponent_div_110_div_15_button_1_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r121);
      const i_r75 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](2).index;
      const ctx_r119 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r119.removeBoard(i_r75));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "img", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 1, "Delete"));
  }
}
function SchoolAddEditComponent_div_110_div_15_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r123 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SchoolAddEditComponent_div_110_div_15_button_2_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r123);
      const ctx_r122 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r122.createBoard());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 1, "Add Board/Class"));
  }
}
function SchoolAddEditComponent_div_110_div_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](1, SchoolAddEditComponent_div_110_div_15_button_1_Template, 6, 3, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](2, SchoolAddEditComponent_div_110_div_15_button_2_Template, 6, 3, "button", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r124 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    const i_r75 = ctx_r124.index;
    const board_r74 = ctx_r124.$implicit;
    const ctx_r81 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", i_r75 !== 0 && !(board_r74 == null ? null : board_r74._id));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", i_r75 === ctx_r81.classes.length - 1);
  }
}
function SchoolAddEditComponent_div_110_Template(rf, ctx) {
  if (rf & 1) {
    const _r126 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 78)(1, "div", 79)(2, "div")(3, "app-dropdown", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_Template_app_dropdown_ngModelChange_3_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r126);
      const board_r74 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](board_r74.board = $event);
    })("valueUpdate", function SchoolAddEditComponent_div_110_Template_app_dropdown_valueUpdate_3_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r126);
      const i_r75 = restoredCtx.index;
      const ctx_r127 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r127.boardMediumUpdate(i_r75, "board"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](4, SchoolAddEditComponent_div_110_small_4_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](5, "div")(6, "app-dropdown", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_Template_app_dropdown_ngModelChange_6_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r126);
      const board_r74 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](board_r74.medium = $event);
    })("valueUpdate", function SchoolAddEditComponent_div_110_Template_app_dropdown_valueUpdate_6_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r126);
      const i_r75 = restoredCtx.index;
      const ctx_r129 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r129.boardMediumUpdate(i_r75, "medium"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](7, SchoolAddEditComponent_div_110_small_7_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](8, "div")(9, "app-dropdown", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_Template_app_dropdown_ngModelChange_9_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r126);
      const board_r74 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](board_r74.start = $event);
    })("valueUpdate", function SchoolAddEditComponent_div_110_Template_app_dropdown_valueUpdate_9_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r126);
      const i_r75 = restoredCtx.index;
      const ctx_r131 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r131.classRangeUpdate(i_r75, "start", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](10, SchoolAddEditComponent_div_110_small_10_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](11, "div")(12, "app-dropdown", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_Template_app_dropdown_ngModelChange_12_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r126);
      const board_r74 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](board_r74.end = $event);
    })("valueUpdate", function SchoolAddEditComponent_div_110_Template_app_dropdown_valueUpdate_12_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r126);
      const i_r75 = restoredCtx.index;
      const ctx_r133 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r133.classRangeUpdate(i_r75, "end", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](13, SchoolAddEditComponent_div_110_small_13_Template, 2, 0, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](14, SchoolAddEditComponent_div_110_ng_container_14_Template, 20, 15, "ng-container", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](15, SchoolAddEditComponent_div_110_div_15_Template, 3, 2, "div", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const board_r74 = ctx.$implicit;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownValues", ctx_r17.classBoardOptions)("config", ctx_r17.classBoardDropdownconfig)("ngModel", board_r74.board)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](26, _c0))("mode", ctx_r17.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r17.submitted && !board_r74.board);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownValues", ctx_r17.classMediumOptions)("config", ctx_r17.classMediumDropdownconfig)("ngModel", board_r74.medium)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](27, _c0))("mode", ctx_r17.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r17.submitted && !board_r74.medium);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownValues", ctx_r17.classOptions)("config", ctx_r17.classMinDropdownconfig)("ngModel", board_r74.start)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](28, _c0))("mode", ctx_r17.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r17.submitted && !board_r74.start);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownValues", ctx_r17.classOptions)("config", ctx_r17.classMaxDropdownconfig)("ngModel", board_r74.end)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](29, _c0))("mode", ctx_r17.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r17.submitted && !board_r74.end);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", board_r74.classDetails.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx_r17.mode !== "view");
  }
}
function SchoolAddEditComponent_button_112_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Close"), " ");
  }
}
const _c1 = function () {
  return ["school.edit"];
};
function SchoolAddEditComponent_button_113_Template(rf, ctx) {
  if (rf & 1) {
    const _r135 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SchoolAddEditComponent_button_113_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r135);
      const ctx_r134 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r134.editSchoolDetails());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](1, "div", 1)(2, "span", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](5, "img", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](4, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](4, 2, "Edit"));
  }
}
function SchoolAddEditComponent_button_114_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](2, 1, "Cancel"), " ");
  }
}
function SchoolAddEditComponent_button_115_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "button", 97)(1, "div", 98)(2, "span", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](5, "img", 99);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](4, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](4, 2, "Save"));
  }
}
function SchoolAddEditComponent_app_modal_116_Template(rf, ctx) {
  if (rf & 1) {
    const _r137 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "app-modal")(1, "app-upload-popup", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("fileUploaded", function SchoolAddEditComponent_app_modal_116_Template_app_upload_popup_fileUploaded_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r137);
      const ctx_r136 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r136.uploadedFile($event));
    })("upload", function SchoolAddEditComponent_app_modal_116_Template_app_upload_popup_upload_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r137);
      const ctx_r138 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r138.upload($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("allowedFileTypes", ctx_r22.uploadFileTypes);
  }
}
const _c2 = "Deleting the resource may affect the teachers who are currently using it.";
const _c3 = function () {
  return {
    heading: "Delete Resource",
    confirmationText: _c2,
    primaryButtonLabel: "Delete",
    primaryButtonType: "delete"
  };
};
function SchoolAddEditComponent_app_delete_detail_117_Template(rf, ctx) {
  if (rf & 1) {
    const _r140 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "app-delete-detail", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("close", function SchoolAddEditComponent_app_delete_detail_117_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r140);
      const ctx_r139 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r139.updateFacility($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction0"](1, _c3));
  }
}
class SchoolAddEditComponent {
  /**
   * Class constructor
   * @param fb FormBuilder
   * @param utilityService UtilityService
   * @param route ActivatedRoute
   * @param schoolManagementService SchoolManagementService
   * @param modalService ModalService
   * @param masterService MasterService
   * @param router Router
   * @param datePipe DatePipe
   */
  constructor(fb, utilityService, route, schoolManagementService, modalService, masterService, router, datePipe) {
    this.fb = fb;
    this.utilityService = utilityService;
    this.route = route;
    this.schoolManagementService = schoolManagementService;
    this.modalService = modalService;
    this.masterService = masterService;
    this.router = router;
    this.datePipe = datePipe;
    this.submitted = false;
    this.stateDropdownOptions = [];
    this.zoneDropdownOptions = [];
    this.districtDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.boardDropdownOptions = [];
    this.mediumDropdownOptions = structuredClone(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.MEDIUMS);
    this.resourceTypeDropdownOptions = [];
    this.resourceDetailsDropdownOptions = [];
    this.schoolIdError = false;
    this.stateDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select state',
      fieldName: 'State',
      bindLabel: 'state',
      bindValue: 'state',
      required: true
    };
    this.zoneDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Zone',
      fieldName: 'Zone',
      bindLabel: 'name',
      bindValue: 'name',
      required: true
    };
    this.districtDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select district',
      fieldName: 'District',
      bindLabel: 'name',
      bindValue: 'name',
      required: true
    };
    this.blockDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Taluk',
      fieldName: 'Taluk',
      bindLabel: 'name',
      bindValue: 'name',
      required: true
    };
    this.boardDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select board',
      fieldName: 'Board',
      bindLabel: 'boardName',
      bindValue: 'abbreviation',
      multi: true,
      required: true
    };
    this.mediumDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select medium of instruction',
      fieldName: 'Medium of instruction',
      bindLabel: 'name',
      bindValue: 'value',
      multi: true,
      required: true
    };
    this.resourceTypeDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select Type',
      fieldName: 'Type',
      hideLabel: true,
      bindLabel: 'type',
      bindValue: 'type',
      required: true,
      clearableOff: true
    };
    this.resourceTypeDarkDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Type',
      fieldName: 'Type',
      hideLabel: true,
      bindLabel: 'type',
      bindValue: 'type',
      required: true,
      clearableOff: true
    };
    this.resourceDetailsDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select details',
      fieldName: 'Details',
      multi: true,
      clearableOff: true,
      hideLabel: true,
      required: true
    };
    this.resourceOtherDetailsDropdownconfig = {
      ...this.resourceDetailsDropdownconfig,
      placeHolderTxt: 'Enter resource details',
      hideLabel: false,
      searchable: true,
      addTag: true
    };
    this.classBoardOptions = [];
    this.classBoardDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Board',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'Board',
      required: true,
      clearableOff: true
    };
    this.classMediumOptions = [];
    this.classMediumDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Medium',
      bindLabel: 'name',
      bindValue: 'value',
      labelTxt: 'Medium',
      required: true,
      clearableOff: true
    };
    this.classOptions = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.CLASS_OPTIONS;
    this.classMinDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Min class',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'Min class',
      required: true,
      clearableOff: true
    };
    this.classMaxDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Max class',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'Max class',
      required: true,
      clearableOff: true
    };
    this.uploadFileTypes = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.BULK_UPLOAD_FILE_TYPES;
    this.classes = [];
    this.showFacilityDeleteConfirm = false;
  }
  /**
   * Angular oninit lifecycle hook used here for form initialization
   */
  ngOnInit() {
    this.setCurrentAcademicYear();
    this.createAddEditForm();
    this.queryParamSubscription = this.route.queryParamMap.subscribe(qparams => {
      this.mode = qparams?.get('mode');
    });
    this.paramSubscription = this.route.params.subscribe(params => {
      this.schoolId = params['id'];
      if (this.schoolId) {
        this.getSchoolData(this.schoolId);
      }
    });
    if (this.mode !== 'edit' && this.mode !== 'view') {
      this.getRegionsData();
      this.getResourceData();
      this.getBoardData();
      this.createBoard();
    }
  }
  /**
   * Function to set current academic year start and end date
   */
  setCurrentAcademicYear() {
    const today = new Date();
    const currentYear = today.getFullYear();
    const minMaxVals = {
      currentYearMin: new Date(currentYear, 0, 1),
      currentYearMax: new Date(currentYear, 11, 31),
      nextYearMin: new Date(currentYear + 1, 0, 1),
      nextYearMax: new Date(currentYear + 1, 11, 31)
    };
    this.minMaxDateValues = minMaxVals;
    this.academicYearStartDate = this.datePipe.transform(new Date(currentYear, 5, 1), 'yyyy-MM-dd');
    this.academicYearEndDate = this.datePipe.transform(new Date(currentYear + 1, 2, 31), 'yyyy-MM-dd');
  }
  /**
   * Angular aferview init hook used here to list dropdown changes
   */
  ngAfterViewInit() {
    this.f.state?.valueChanges.subscribe(val => {
      if (this.selectedStateObj && this.selectedStateObj.state !== val) {
        this.f.zone?.reset();
      }
      this.setZoneDropdownValues(val);
    });
    this.f.zone?.valueChanges.subscribe(val => {
      if (this.selectedZoneObj && this.selectedZoneObj.name !== val) {
        this.f.district?.reset();
      }
      this.setDistrictDropdownValues(val);
    });
    this.f.district?.valueChanges.subscribe(val => {
      if (this.selectedDistrictObj && this.selectedDistrictObj.name !== val) {
        this.f.block?.reset();
      }
      this.setBlockDropdownValues(val);
    });
    this.f.boards?.valueChanges.subscribe(val => {
      this.classBoardOptions = structuredClone(val);
      this.classDetailsUpdate('board', this.classBoardOptions);
    });
    this.f.mediums?.valueChanges.subscribe(val => {
      const medium = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.MEDIUMS.filter(ele => val.includes(ele.value));
      this.classMediumOptions = structuredClone(medium);
      this.classDetailsUpdate('medium', this.classMediumOptions);
    });
  }
  /**
   * Function to update class details on board and medium changes
   * @param type
   * @param options
   */
  classDetailsUpdate(type, options) {
    if (this.mode !== 'view') {
      let filteredArr = [];
      for (const classVal of this.classes) {
        if (classVal[type] && !options.includes(classVal[type])) {
          filteredArr = this.classes.filter(ele => ele[type] !== classVal[type]);
        }
      }
      if (filteredArr.length === 0) {
        if (options.length === 0) {
          this.classes = [];
          this.createBoard();
        }
      } else {
        this.classes = filteredArr;
      }
    }
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
  /**
   * Method to create school add edit form
   */
  createAddEditForm() {
    this.schoolAddEditForm = this.fb.group({
      name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.minLength(5)]],
      schoolId: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.minLength(11)]],
      boards: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      mediums: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      state: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      district: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      block: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      zone: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      academicYearStartDate: [this.academicYearStartDate, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      academicYearEndDate: [this.academicYearEndDate, [_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required]],
      holidayList: this.fb.array([]),
      facilities: this.fb.array([])
    }, {
      validator: this.dateRangeValidator
    });
    this.addHoliday();
    this.addResource();
  }
  /**
   * prevent the user to enter more than 10 digit of mobile number
   * @param event
   */
  checkLimit(event) {
    let input = event.target;
    const inputValue = input.value;
    if (this.schoolAddEditForm.get('schoolId')?.value) {
      if (inputValue.length === 11) {
        this.schoolIdError = false;
        event.preventDefault();
      }
    }
  }
  /**
   * Function to update school id error
   */
  updateError() {
    if (this.schoolAddEditForm.get('schoolId')?.value) {
      if (this.schoolAddEditForm.get('schoolId')?.value.toString().length === 11) {
        this.schoolIdError = false;
      } else {
        this.schoolIdError = true;
      }
    }
  }
  /**
   * Function to get regions data
   */
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
    this.f.state.setValue(this.dependentPatchData.state);
    this.f.zone.setValue(this.dependentPatchData.zone);
    this.f.district.setValue(this.dependentPatchData.district);
    this.f.block.setValue(this.dependentPatchData.block);
  }
  /**
   * Function to get board data
   */
  getBoardData() {
    this.masterService.getBoards().subscribe({
      next: val => {
        this.boardDropdownOptions = val.data.results;
        if (this.mode === 'edit') {
          this.boardDropdownOptions.forEach(ele => {
            if (this.schoolAddEditForm.value.boards.includes(ele.abbreviation)) {
              ele.disabled = true;
            }
          });
          this.mediumDropdownOptions.forEach(ele => {
            if (this.schoolAddEditForm.value.mediums.includes(ele.value)) {
              ele.disabled = true;
            }
          });
        }
      }
    });
  }
  /**
   * Function to get resource data
   */
  getResourceData() {
    this.masterService.getFacilities().subscribe({
      next: val => {
        this.resourceTypeDropdownOptions = val.data.results;
        const otherObj = {
          type: 'Others'
        };
        this.resourceTypeDropdownOptions.push(otherObj);
        this.resourceMasterData = val.data.results;
        if (this.mode === 'edit' || this.mode === 'view') {
          this.patchResourceDropdown();
        }
      }
    });
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
        this.facilities.controls[i].get('details')?.setValue(this.dependentPatchData.facilities[i].details);
        this.facilities.controls[i].get('details')?.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_11__.Validators.required);
        this.facilities.controls[i].get('details')?.updateValueAndValidity();
      }
    }
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
      this.zoneDropdownOptions = this.selectedStateObj.zones;
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
        this.blockDropdownOptions = this.selectedDistrictObj.blocks;
      } else {
        this.selectedDistrictObj = null;
        this.blockDropdownOptions = [];
      }
    } else {
      this.f.block?.reset();
    }
  }
  /**
   * Function triggered on class range selection
   * @param i
   * @param key
   * @param value
   */
  classRangeUpdate(i, key, value) {
    if (this.mode === 'edit') {
      this.editClassRange(i, key, value);
    } else {
      this.updateClassRange(i, key, value);
    }
  }
  updateClassRange(i, key, value) {
    if (!value) {
      this.classes[i].classDetails = [];
    }
    if (this.classes[i].start && this.classes[i].end) {
      if (this.classes[i].start > this.classes[i].end) {
        this.utilityService.showWarning(`please select appropriate value for ${key === 'start' ? 'min' : 'max'} class`);
        setTimeout(() => {
          this.classes[i][key] = null;
          this.classes[i].classDetails = [];
        }, 0);
      } else {
        this.addClasses(this.classes[i].start, this.classes[i].end, i);
      }
    }
  }
  /**
   * Function to create board based on range
   * @param start
   * @param end
   */
  createBoard() {
    const boardObj = {
      board: null,
      medium: null,
      start: null,
      end: null,
      classDetails: []
    };
    this.classes.push(boardObj);
  }
  /**
   * Function to remove board
   * @param i
   */
  removeBoard(i) {
    this.classes.splice(i, 1);
  }
  /**
   * Function to add classes for specified range
   * @param start
   * @param end
   * @param i
   */
  addClasses(start, end, i) {
    this.classes[i].classDetails = [];
    for (let j = start; j <= end; j++) {
      this.classes[i].classDetails.push(this.getClassObj(j));
    }
  }
  /**
   * Function to delete section form class
   * @param i
   * @param j
   */
  deleteSection(i, j) {
    this.classes[i].section.splice(j, 1);
  }
  /**
   * Function to get School data
   * @param id school id
   */
  getSchoolData(id) {
    this.schoolManagementService.getSchoolData(id).subscribe({
      next: val => {
        this.setFormValue(val.data);
      }
    });
  }
  /**
   * Function to set value to form
   * @param data
   */
  setFormValue(data) {
    for (let i = 0; i < data.holidayList.length - 1; i++) {
      this.addHoliday();
    }
    const keysToRemove = ['state', 'zone', 'district', 'block', 'classes', 'facilities'];
    const {
      newObj,
      removedObj
    } = this.utilityService.removeKeys(data, keysToRemove);
    this.dependentPatchData = removedObj;
    this.getResourceData();
    this.getRegionsData();
    newObj.academicYearStartDate = this.datePipe.transform(newObj?.academicYearStartDate, 'yyyy-MM-dd');
    newObj.academicYearEndDate = this.datePipe.transform(newObj?.academicYearEndDate, 'yyyy-MM-dd');
    newObj.holidayList.forEach(holiday => {
      holiday.date = this.datePipe.transform(holiday.date, 'yyyy-MM-dd');
    });
    this.schoolAddEditForm.patchValue(newObj);
    if (this.dependentPatchData?.facilities && this.dependentPatchData?.facilities.length > 0) {
      for (let i = 0; i < data.facilities.length - 1; i++) {
        this.addResource();
      }
    }
    this.getBoardData();
    this.classes = data.classes;
    this.previousClasses = structuredClone(this.classes);
    if (this.mode === 'view') {
      this.disableFields();
    }
  }
  boardMediumUpdate(i, type) {
    if (this.mode === 'edit') {
      switch (type) {
        case 'board':
          if (this.previousClasses[i]?._id) {
            this.utilityService.showWarning('Board cannot be updated for existing board-medium combination');
            setTimeout(() => {
              this.classes[i].board = this.previousClasses[i].board;
            }, 0);
          }
          break;
        case 'medium':
          if (this.previousClasses[i]?._id) {
            this.utilityService.showWarning('Medium cannot be updated for existing board-medium combination');
            setTimeout(() => {
              this.classes[i].medium = this.previousClasses[i].medium;
            }, 0);
          }
          break;
        default:
          break;
      }
    }
  }
  editClassRange(i, key, value) {
    if (this.previousClasses[i]?._id) {
      switch (key) {
        case 'start':
          if (value > this.previousClasses[i].start) {
            this.utilityService.showWarning(`Minimum class cannot exceed ${this.previousClasses[i].start}.`);
            setTimeout(() => {
              this.classes[i][key] = this.classes[i].classDetails[0].standard;
            }, 0);
          } else {
            const classAvailable = this.classes[i].classDetails.map(ele => ele.standard);
            const removeCouter = classAvailable.indexOf(value);
            if (removeCouter !== -1) {
              this.classes[i].classDetails.splice(0, removeCouter);
            }
            for (let j = this.previousClasses[i].start - 1; j >= value; j--) {
              if (!classAvailable.includes(this.getClassObj(j).standard)) {
                this.classes[i].classDetails.unshift(this.getClassObj(j));
              }
            }
          }
          break;
        case 'end':
          if (value < this.previousClasses[i].end) {
            this.utilityService.showWarning(`Maximum class cannot be less than ${this.previousClasses[i].end}.`);
            setTimeout(() => {
              this.classes[i][key] = this.classes[i].classDetails[this.classes[i].classDetails.length - 1].standard;
            }, 0);
          } else {
            const classAvailable = this.classes[i].classDetails.map(ele => ele.standard);
            const removeCouter = classAvailable.indexOf(value);
            if (removeCouter !== -1) {
              this.classes[i].classDetails.splice(removeCouter + 1, this.classes[i].classDetails.length - 1);
            }
            for (let j = this.previousClasses[i].end + 1; j <= value; j++) {
              if (!classAvailable.includes(this.getClassObj(j).standard)) {
                this.classes[i].classDetails.push(this.getClassObj(j));
              }
            }
          }
          break;
        default:
          break;
      }
    } else {
      this.updateClassRange(i, key, value);
    }
  }
  getClassObj(j) {
    const classObj = {
      standard: j,
      section: 'A',
      boysStrength: null,
      girlsStrength: null,
      totalStrength: null
    };
    return classObj;
  }
  /**
   * Function to disable input fields
   */
  disableFields() {
    this.schoolAddEditForm?.disable();
    this.districtDropdownconfig.isBackground = true;
    this.mediumDropdownconfig.isBackground = true;
    this.blockDropdownconfig.isBackground = true;
    this.boardDropdownconfig.isBackground = true;
    this.zoneDropdownconfig.isBackground = true;
    this.stateDropdownconfig.isBackground = true;
    this.classBoardDropdownconfig.disabled = true;
    this.classMediumDropdownconfig.disabled = true;
    this.classMinDropdownconfig.disabled = true;
    this.classMaxDropdownconfig.disabled = true;
    this.classBoardDropdownconfig.isBackground = true;
    this.classMediumDropdownconfig.isBackground = true;
    this.classMinDropdownconfig.isBackground = true;
    this.classMaxDropdownconfig.isBackground = true;
  }
  /**
   * getter for holiday list
   */
  get holidayList() {
    return this.schoolAddEditForm.get('holidayList');
  }
  /**
   * getter for facilities
   */
  get facilities() {
    return this.schoolAddEditForm.get('facilities');
  }
  /**
   * Function to update total strength
   * @param boysStrength
   * @param girlsStrength
   * @param classIndex
   * @param sectionIndex
   */
  updateTotalStrength(boysStrength, girlsStrength, classIndex, sectionIndex) {
    this.classes[classIndex].classDetails[sectionIndex].totalStrength = +boysStrength + +girlsStrength;
  }
  /**
   * Function to add holiday control
   */
  addHoliday() {
    this.holidayList.push(this.fb.group({
      date: [''],
      reason: ['']
    }));
  }
  /**
   * Function to remove holiday control
   * @param index
   */
  removeHoliday(index) {
    this.holidayList.removeAt(index);
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
  }
  /**
   * Function to remove resource control
   * @param index
   */
  removeResource(index) {
    if (this.facilities.controls[index].value?.type === 'Others' && this.mode === 'edit') {
      this.showFacilityDeleteConfirm = true;
      this.deleteIndex = index;
    } else {
      this.facilities.removeAt(index);
    }
  }
  updateFacility(val) {
    this.showFacilityDeleteConfirm = false;
    if (val === 'delete') {
      this.schoolManagementService.updateFacility(this.schoolId, this.facilities.controls[this.deleteIndex].value).subscribe({
        next: res => {
          this.utilityService.handleResponse(res);
          this.facilities.removeAt(this.deleteIndex);
        },
        error: err => {
          this.utilityService.handleError(err);
        }
      });
    }
  }
  /**
   * getter for formcontrol
   */
  get f() {
    return this.schoolAddEditForm.controls;
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
   * Function to edit school details
   */
  editSchoolDetails() {
    this.router.navigateByUrl('/empty', {
      skipLocationChange: true
    }).then(() => {
      this.router.navigate([`/schools/${this.schoolId}`], {
        relativeTo: this.route,
        queryParams: {
          mode: 'edit'
        }
      });
    });
  }
  /**
   * Function to open bulk upload popup
   */
  blukUpload() {
    this.modalService.showBlukUploadDialog = true;
  }
  /**
   * Function triggerd on file upload
   * @param fileDetails
   */
  uploadedFile(fileDetails) {
    this.fileToUpload = fileDetails.file;
  }
  /**
   * Function triggered on upload
   * @param isUpload
   */
  upload(isUpload) {
    if (isUpload) {
      console.log('upload file logic here');
      console.log(this.fileToUpload);
    }
  }
  /**
   * Function triggered on submit
   */
  onSubmit() {
    this.submitted = true;
    if (this.schoolAddEditForm.get('schoolId')?.value.toString().length < 11) {
      this.schoolIdError = true;
      return;
    }
    if (this.schoolAddEditForm.invalid) {
      return;
    }
    if (!this.utilityService.validateArray(this.classes)) {
      return;
    }
    if (this.utilityService.hasDuplicateBoardMedium(this.classes)) {
      this.utilityService.showWarning('Duplicate board-medium mapping found. Please verify.');
      return;
    }
    let data = {
      ...this.schoolAddEditForm.value,
      classes: this.classes
    };
    data.holidayList = this.utilityService.removeEmptyObjects(data.holidayList);
    data.facilities = this.utilityService.removeObjectsWithEmptyType(data.facilities);
    if (this.mode === 'edit') {
      this.schoolManagementService.updateSchool(data, this.schoolId).subscribe({
        next: res => {
          this.utilityService.handleResponse(res);
          this.router.navigate(['/schools']);
        },
        error: err => {
          this.utilityService.handleError(err);
        }
      });
    } else {
      this.schoolManagementService.createSchool(data).subscribe({
        next: res => {
          this.utilityService.handleResponse(res);
          this.router.navigate(['/schools']);
        },
        error: err => {
          this.utilityService.handleError(err);
        }
      });
    }
  }
  dateRangeValidator(control) {
    const startDate = control.get('academicYearStartDate')?.value;
    const endDate = control.get('academicYearEndDate')?.value;
    if (!startDate || !endDate) {
      return null;
    }
    if (startDate > endDate) {
      return {
        lessThanStart: true
      };
    }
    return null;
  }
  ngOnDestroy() {
    this.paramSubscription.unsubscribe();
    this.queryParamSubscription.unsubscribe();
  }
  static {
    this.ɵfac = function SchoolAddEditComponent_Factory(t) {
      return new (t || SchoolAddEditComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_school_management_service__WEBPACK_IMPORTED_MODULE_2__.SchoolManagementService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_3__.ModalService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_4__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_13__.DatePipe));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineComponent"]({
      type: SchoolAddEditComponent,
      selectors: [["app-school-add-edit"]],
      decls: 118,
      vars: 122,
      consts: [[1, "school-add-edit-wrapper", "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "content-center"], ["src", "assets/icons/back-arrow.svg", "routerLink", "/schools", "alt", "", 1, "cursor-pointer"], [1, "ml-3", "text-2xl", "md:text-[32px]", "md:leading-[48px]", "font-bold", "text-content"], [1, "school-container", "px-4", "py-6", "md:p-8", "bg-white", "mt-6", "rounded", "border-content-30"], [1, "flex", "justify-between", "content-center"], [1, "text-content", "text-2xl", "md:text-[32px]", "md:leading-[48px]", "font-bold", "tracking-tight"], ["routerLink", "/schools/add", 1, "hidden", "btn-primary", "h-9", 3, "click"], ["src", "assets/icons/add.svg", "alt", ""], [1, "ml-[6px]"], [1, "school-management-form", "mt-9"], [3, "formGroup", "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6"], ["for", "school-name", 1, "form-control-label"], ["class", "text-[16px] text-error", 4, "ngIf"], ["id", "school-name", "type", "text", "autocomplete", "off", "formControlName", "name", "maxlength", "255", 1, "form-control", 3, "placeholder"], ["class", "form-control-error", 4, "ngIf"], [1, "number-type"], ["for", "school-id", 1, "form-control-label"], ["id", "school-id", "type", "text", "oninput", "this.value=this.value.replace(/(?![0-9])./gmi,'')", "autocomplete", "off", "formControlName", "schoolId", 1, "form-control", 3, "placeholder", "keypress", "keyup"], [3, "dropDownCtrl", "dropDownValues", "config", "submitted", "mode"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6", "mt-6"], ["for", "academic-start-date", 1, "form-control-label"], ["id", "academic-start-date", "type", "date", "autocomplete", "off", "formControlName", "academicYearStartDate", 1, "form-control", 3, "min", "max", "placeholder"], ["for", "academic-end-date", 1, "form-control-label"], ["id", "academic-end-date", "type", "date", "placeholder", "Select date", "autocomplete", "off", "formControlName", "academicYearEndDate", 1, "form-control", 3, "min", "max"], [1, "mt-7"], [1, "text-lg", "font-bold", "text-content"], ["formArrayName", "holidayList"], [1, "mt-3"], ["aria-label", "holiday-list", 1, "w-full", "block", "md:table"], [1, "hidden", "md:table-header-group"], [1, "header", "font-semibold", "text-center", "text-content", "table-header", "border-b", "border-shade"], [1, "px-4", "py-3", "border", "text-sm", "text-content"], ["class", "px-4 py-3 border text-sm text-content", 4, "ngIf"], [1, "block", "md:table-row-group", "bg-white"], ["class", "block md:table-row text-gray-700 border rounded-xl md:border-0 mb-4 md:mb-0 overflow-hidden", 4, "ngFor", "ngForOf"], ["formArrayName", "facilities"], ["aria-label", "resource", 1, "w-full", "block", "md:table"], ["class", "text-lg font-bold mt-7 text-content", 4, "ngIf"], ["class", "py-6 border rounded flex items-center justify-center", 4, "ngIf"], ["class", "border rounded p-4 mb-4", 4, "ngFor", "ngForOf"], [1, "flex", "flex-col", "sm:flex-row", "justify-end", "mt-9", "gap-2"], ["class", "btn-outline-primary h-9 w-full sm:w-[74px]", "routerLink", "/schools", "type", "button", 4, "ngIf"], ["class", "btn-primary h-9 w-full sm:w-auto", "type", "button", 3, "hasPermission", "click", 4, "ngIf"], ["class", "btn-primary h-9 w-full sm:w-auto", 3, "hasPermission", 4, "ngIf"], [4, "ngIf"], [3, "config", "close", 4, "ngIf"], [1, "text-[16px]", "text-error"], [1, "form-control-error"], [1, "block", "md:table-row", "text-gray-700", "border", "rounded-xl", "md:border-0", "mb-4", "md:mb-0", "overflow-hidden"], [3, "formGroupName"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "first:border-t-0", "md:border", "w-full", "md:w-[40%]"], [1, "md:hidden", "text-xs", "font-semibold", "text-content-60", "mb-2"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "md:border", "w-full", "md:w-[40%]"], ["class", "block md:table-cell px-4 py-4 text-sm border-t md:border w-full md:w-[20%]", 4, "ngIf"], ["type", "date", "autocomplete", "off", "formControlName", "date", 1, "form-control", 3, "min", "max", "placeholder", "required"], ["type", "text", "autocomplete", "off", "formControlName", "reason", 1, "form-control", 3, "placeholder", "required"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "md:border", "w-full", "md:w-[20%]"], [1, "flex", "flex-col", "sm:flex-row", "gap-2", 3, "ngClass"], ["class", "btn-danger h-9 w-full sm:w-auto", "type", "button", 3, "click", 4, "ngIf"], ["class", "btn-primary h-9 w-full sm:w-auto", "type", "button", 3, "click", 4, "ngIf"], ["type", "button", 1, "btn-danger", "h-9", "w-full", "sm:w-auto", 3, "click"], ["src", "assets/icons/delete.svg", "alt", ""], ["type", "button", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "click"], [1, "block", "md:table-cell", "px-4", "py-4", "border-t", "first:border-t-0", "md:border", "w-full", "md:w-[40%]", "content-start"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "md:border", "w-full", "md:w-[40%]", "content-start"], ["class", "block md:table-cell px-4 py-4 text-sm border-t md:border w-full md:w-[20%] content-start", 4, "ngIf"], [3, "dropDownCtrl", "dropDownValues", "config", "submitted", "mode", "valueChange"], ["class", "form-control mt-4", "type", "text", "autocomplete", "off", "formControlName", "otherType", 3, "placeholder", 4, "ngIf"], ["type", "text", "autocomplete", "off", "formControlName", "otherType", 1, "form-control", "mt-4", 3, "placeholder"], [3, "hidden"], [3, "dropDownCtrl", "dropDownValues", "config", "submitted"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "md:border", "w-full", "md:w-[20%]", "content-start"], [1, "text-lg", "font-bold", "mt-7", "text-content"], [1, "py-6", "border", "rounded", "flex", "items-center", "justify-center"], [1, "btn-primary", "w-full", "sm:w-auto", "flex", "items-center", "justify-center", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "border", "rounded", "p-4", "mb-4"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "xl:grid-cols-4", "gap-4", "md:gap-6", "mt-4"], [3, "dropDownValues", "config", "ngModel", "ngModelOptions", "mode", "ngModelChange", "valueUpdate"], ["class", "flex flex-col sm:flex-row gap-2 mt-4 justify-end", 4, "ngIf"], [1, "font-bold", "mt-4"], [1, "overflow-x-auto", "mt-2"], ["aria-label", "class List", 1, "w-full", "min-w-[420px]", "number-type"], [1, "border", "px-4", "py-2"], [4, "ngFor", "ngForOf"], [1, "border", "px-2", "py-2"], ["class", "form-control", "disabled", "true", "type", "text", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange", 4, "ngIf"], ["class", "form-control", "type", "text", "maxlength", "3", "oninput", "this.value=this.value.replace(/[^0-9]/g, '').slice(0, 3)", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange", 4, "ngIf"], ["disabled", "true", "type", "text", 1, "form-control", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange"], ["type", "text", "maxlength", "3", "oninput", "this.value=this.value.replace(/[^0-9]/g, '').slice(0, 3)", 1, "form-control", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange"], [1, "flex", "flex-col", "sm:flex-row", "gap-2", "mt-4", "justify-end"], ["routerLink", "/schools", "type", "button", 1, "btn-outline-primary", "h-9", "w-full", "sm:w-[74px]"], ["type", "button", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission", "click"], [1, "mr-[6px]"], ["src", "assets/icons/edit-light.svg", "alt", ""], [1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission"], [1, "flex", "items-center", "justify-center"], ["src", "assets/icons/check.svg", "alt", ""], [3, "allowedFileTypes", "fileUploaded", "upload"], [3, "config", "close"]],
      template: function SchoolAddEditComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](6, "div", 4)(7, "div", 5)(8, "h2", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](10, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](11, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](12, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("click", function SchoolAddEditComponent_Template_button_click_12_listener() {
            return ctx.blukUpload();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](13, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](14, "img", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](15, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](16);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](17, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](18, "div", 10)(19, "form", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("ngSubmit", function SchoolAddEditComponent_Template_form_ngSubmit_19_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](20, "div", 12)(21, "div")(22, "label", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](23);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](24, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](25, SchoolAddEditComponent_span_25_Template, 2, 0, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](26, "input", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](27, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](28, SchoolAddEditComponent_small_28_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](29, SchoolAddEditComponent_small_29_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](30, "div", 17)(31, "label", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](32);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](33, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](34, SchoolAddEditComponent_span_34_Template, 2, 0, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](35, "input", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("keypress", function SchoolAddEditComponent_Template_input_keypress_35_listener($event) {
            return ctx.checkLimit($event);
          })("keyup", function SchoolAddEditComponent_Template_input_keyup_35_listener() {
            return ctx.updateError();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](36, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](37, SchoolAddEditComponent_small_37_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](38, SchoolAddEditComponent_small_38_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](39, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](40, "app-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](41, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](42, "app-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](43, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](44, "app-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](45, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](46, "app-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](47, "div", 21)(48, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](49, "app-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](50, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](51, "app-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](52, "div")(53, "label", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](54);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](55, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](56, SchoolAddEditComponent_span_56_Template, 2, 0, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](57, "input", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](58, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](59, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](60, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](61, SchoolAddEditComponent_small_61_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](62, "div")(63, "label", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](64);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](65, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](66, SchoolAddEditComponent_span_66_Template, 2, 0, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](67, "input", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](68, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](69, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](70, SchoolAddEditComponent_small_70_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](71, SchoolAddEditComponent_small_71_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](72, "div", 26)(73, "p", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](74);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](75, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerStart"](76, 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](77, "div", 29)(78, "table", 30)(79, "thead", 31)(80, "tr", 32)(81, "th", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](82);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](83, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](84, "th", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](85);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](86, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](87, SchoolAddEditComponent_th_87_Template, 3, 3, "th", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](88, "tbody", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](89, SchoolAddEditComponent_tr_89_Template, 15, 12, "tr", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](90, "div", 26)(91, "p", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](92);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](93, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerStart"](94, 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](95, "div", 29)(96, "table", 38)(97, "thead", 31)(98, "tr", 32)(99, "th", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](100);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](101, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](102, "th", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](103);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](104, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](105, SchoolAddEditComponent_th_105_Template, 3, 3, "th", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](106, "tbody", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](107, SchoolAddEditComponent_tr_107_Template, 15, 12, "tr", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementContainerEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](108, SchoolAddEditComponent_p_108_Template, 3, 3, "p", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](109, SchoolAddEditComponent_div_109_Template, 6, 0, "div", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](110, SchoolAddEditComponent_div_110_Template, 16, 30, "div", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](111, "div", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](112, SchoolAddEditComponent_button_112_Template, 3, 3, "button", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](113, SchoolAddEditComponent_button_113_Template, 6, 5, "button", 44);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](114, SchoolAddEditComponent_button_114_Template, 3, 3, "button", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](115, SchoolAddEditComponent_button_115_Template, 6, 5, "button", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](116, SchoolAddEditComponent_app_modal_116_Template, 2, 1, "app-modal", 46);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](117, SchoolAddEditComponent_app_delete_detail_117_Template, 1, 2, "app-delete-detail", 47);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 76, "School Management"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](10, 78, ctx.mode === "view" ? "View" : ctx.mode === "edit" ? "Edit" : "Add"), " ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](11, 80, "School Profile"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](17, 82, "Bulk Upload"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("formGroup", ctx.schoolAddEditForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](24, 84, "Name"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](27, 86, "Enter name"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["name"].errors == null ? null : ctx.f["name"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["name"].errors == null ? null : ctx.f["name"].errors["minlength"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](33, 88, "DISE Code"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](36, 90, "Enter DISE Code"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["schoolId"].errors == null ? null : ctx.f["schoolId"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.submitted && !(ctx.f["schoolId"].errors == null ? null : ctx.f["schoolId"].errors["required"]) && ctx.schoolIdError);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownCtrl", ctx.convertToFormControl(ctx.f["state"]))("dropDownValues", ctx.stateDropdownOptions)("config", ctx.stateDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownCtrl", ctx.convertToFormControl(ctx.f["zone"]))("dropDownValues", ctx.zoneDropdownOptions)("config", ctx.zoneDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownCtrl", ctx.convertToFormControl(ctx.f["district"]))("dropDownValues", ctx.districtDropdownOptions)("config", ctx.districtDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownCtrl", ctx.convertToFormControl(ctx.f["block"]))("dropDownValues", ctx.blockDropdownOptions)("config", ctx.blockDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownCtrl", ctx.convertToFormControl(ctx.f["boards"]))("dropDownValues", ctx.boardDropdownOptions)("config", ctx.boardDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("dropDownCtrl", ctx.convertToFormControl(ctx.f["mediums"]))("dropDownValues", ctx.mediumDropdownOptions)("config", ctx.mediumDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](55, 92, "Academic year start date"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](60, 100, "Select date"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("min", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](58, 94, ctx.minMaxDateValues.currentYearMin, "yyyy-MM-dd"))("max", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](59, 97, ctx.minMaxDateValues.currentYearMax, "yyyy-MM-dd"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["academicYearStartDate"].errors == null ? null : ctx.f["academicYearStartDate"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](65, 102, "Academic year end date"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("min", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](68, 104, ctx.minMaxDateValues.nextYearMin, "yyyy-MM-dd"))("max", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind2"](69, 107, ctx.minMaxDateValues.nextYearMax, "yyyy-MM-dd"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["academicYearEndDate"].errors == null ? null : ctx.f["academicYearEndDate"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.schoolAddEditForm.errors == null ? null : ctx.schoolAddEditForm.errors["lessThanStart"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](75, 110, "Holiday List"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](83, 112, "Date"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](86, 114, "Reason"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", ctx.holidayList.controls);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](93, 116, "Resources"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](101, 118, "Resource Type"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](104, 120, "Resource details"));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", ctx.facilities.controls);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", !(ctx.mode === "view" && ctx.classes.length === 0));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.classes.length === 0 && ctx.mode === "edit");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngForOf", ctx.classes);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode === "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode === "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.modalService.showBlukUploadDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.showFacilityDeleteConfirm);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_13__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterLink, _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_5__.DropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_11__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_11__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_11__.FormArrayName, _shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_6__.ModalComponent, _shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_7__.UploadPopupComponent, _core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_8__.HasPermissionDirective, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_9__.DeleteDetailComponent, _angular_common__WEBPACK_IMPORTED_MODULE_13__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__.TranslatePipe],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzY2hvb2wtYWRkLWVkaXQuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi9zY2hvb2wtbWFuYWdlbWVudC9zY2hvb2wtYWRkLWVkaXQvc2Nob29sLWFkZC1lZGl0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxnTEFBZ0wiLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 93811:
/*!***********************************************************************************!*\
  !*** ./src/app/view/admin/school-management/school-list/school-list.component.ts ***!
  \***********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchoolListComponent: () => (/* binding */ SchoolListComponent)
/* harmony export */ });
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs */ 52575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! rxjs */ 91817);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! rxjs */ 61873);
/* harmony import */ var src_app_shared_utility_action_menu_controller_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/action-menu-controller.util */ 37348);
/* harmony import */ var src_app_shared_utility_scope_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/utility/scope.util */ 56215);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _school_management_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../school-management.service */ 69700);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/components/modal/modal.service */ 51133);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/services/master.service */ 2216);
/* harmony import */ var _user_management_user_management_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../user-management/user-management.service */ 58640);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../shared/components/dropdown/dropdown.component */ 62157);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../shared/components/modal/modal.component */ 69081);
/* harmony import */ var _shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../shared/components/disable-popup/disable-popup.component */ 51541);
/* harmony import */ var _shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../shared/components/upload-popup/upload-popup.component */ 86487);
/* harmony import */ var _core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../core/directives/has-permission.directive */ 87944);
/* harmony import */ var _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var _shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../../shared/components/upload-error-popup/upload-error-popup.component */ 12321);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @ngx-translate/core */ 90852);





















const _c0 = ["stateDropdown"];
const _c1 = ["zoneDropdown"];
const _c2 = ["districtDropdown"];
const _c3 = ["blockDropdown"];
const _c4 = ["schoolDropdown"];
function SchoolListComponent_button_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r15 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "button", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_button_29_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r15);
      const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r14.exportSchoolList());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](1, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](2, "img", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](3, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("disabled", !ctx_r0.schoolListData.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](5, 2, "Export"));
  }
}
const _c5 = function () {
  return ["school.delete"];
};
function SchoolListComponent_div_47_ul_12_li_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r23 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "li", 62)(1, "a", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_div_47_ul_12_li_15_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r23);
      const schoolData_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2).$implicit;
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r21.openModalForDeleteConfirm(schoolData_r16));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](3, "img", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](4, _c5));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](6, 2, "Disable School"));
  }
}
function SchoolListComponent_div_47_ul_12_li_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r26 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "li", 62)(1, "a", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_div_47_ul_12_li_16_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r26);
      const schoolData_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2).$implicit;
      const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r24.activateSchool(schoolData_r16._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](3, "img", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "span", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](4, _c5));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](6, 2, "Activate School"));
  }
}
const _c6 = function () {
  return ["school.edit"];
};
function SchoolListComponent_div_47_ul_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "ul", 54)(1, "li", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_div_47_ul_12_Template_li_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r29);
      const schoolData_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r27.viewSchool(schoolData_r16._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "a", 56)(3, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](4, "img", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "li", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_div_47_ul_12_Template_li_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r29);
      const schoolData_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r30.editSchool(schoolData_r16._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](9, "a", 56)(10, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](11, "img", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](12, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](14, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](15, SchoolListComponent_div_47_ul_12_li_15_Template, 7, 5, "li", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](16, SchoolListComponent_div_47_ul_12_li_16_Template, 7, 5, "li", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const schoolData_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](7, 5, "View School"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](9, _c6));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](14, 7, "Edit School"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", !schoolData_r16.isDeleted);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", schoolData_r16.isDeleted);
  }
}
const _c7 = function (a0, a1) {
  return {
    "text-green bg-success-50": a0,
    "text-error-a11y bg-error-50": a1
  };
};
function SchoolListComponent_div_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "div", 40)(1, "div", 41)(2, "div", 42)(3, "p", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](6, "p", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "div", 45)(9, "button", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_div_47_Template_button_click_9_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r34);
      const i_r17 = restoredCtx.index;
      const ctx_r33 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r33.actionMenu.toggleMobileMenu(i_r17, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](10, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](11, "img", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](12, SchoolListComponent_div_47_ul_12_Template, 17, 10, "ul", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](13, "div", 49)(14, "div")(15, "p", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](16);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](17, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](18, "p", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](19);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](20, "div", 51)(21, "div")(22, "p", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](24, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](25, "p", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](27, "div")(28, "p", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](29);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](30, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](31, "p", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](32);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](33, "div")(34, "p", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](35);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](36, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](37, "p", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](38);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](39, "div")(40, "p", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](41);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](42, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](43, "span", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](44);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const schoolData_r16 = ctx.$implicit;
    const i_r17 = ctx.index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](5, 15, "DISE Code"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r16 == null ? null : schoolData_r16.schoolId);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](10, 17, "More options"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r6.actionMenu.openStates[i_r17]);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](17, 19, "School Name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r16.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](24, 21, "District"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r16.district || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](30, 23, "Taluk"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r16.block || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](36, 25, "Zone"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r16.zone || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](42, 27, "Status"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction2"](29, _c7, !schoolData_r16.isDeleted, schoolData_r16.isDeleted));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate1"](" ", !schoolData_r16.isDeleted ? "Active" : "Inactive", " ");
  }
}
function SchoolListComponent_div_48_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "div", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](2, 1, "No Data Found"), " ");
  }
}
function SchoolListComponent_th_53_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "th", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const listHeader_r35 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](2, 1, listHeader_r35), " ");
  }
}
function SchoolListComponent_tr_55_ul_25_li_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "li", 62)(1, "a", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_tr_55_ul_25_li_15_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r43);
      const schoolData_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2).$implicit;
      const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r41.openModalForDeleteConfirm(schoolData_r36));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](3, "img", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](4, _c5));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](6, 2, "Disable School"));
  }
}
function SchoolListComponent_tr_55_ul_25_li_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "li", 62)(1, "a", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_tr_55_ul_25_li_16_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r46);
      const schoolData_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"](2).$implicit;
      const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r44.activateSchool(schoolData_r36._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](3, "img", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "span", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](4, _c5));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](6, 2, "Activate School"));
  }
}
function SchoolListComponent_tr_55_ul_25_Template(rf, ctx) {
  if (rf & 1) {
    const _r49 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "ul", 80)(1, "li", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_tr_55_ul_25_Template_li_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r49);
      const schoolData_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r47.viewSchool(schoolData_r36._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](2, "a", 56)(3, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](4, "img", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](8, "li", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_tr_55_ul_25_Template_li_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r49);
      const schoolData_r36 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]().$implicit;
      const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r50.editSchool(schoolData_r36._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](9, "a", 56)(10, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](11, "img", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](12, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](14, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](15, SchoolListComponent_tr_55_ul_25_li_15_Template, 7, 5, "li", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](16, SchoolListComponent_tr_55_ul_25_li_16_Template, 7, 5, "li", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    const i_r37 = ctx_r52.index;
    const schoolData_r36 = ctx_r52.$implicit;
    const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngStyle", ctx_r38.actionMenu.desktopPositions[i_r37]);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](7, 6, "View School"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](10, _c6));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](14, 8, "Edit School"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", !schoolData_r36.isDeleted);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", schoolData_r36.isDeleted);
  }
}
function SchoolListComponent_tr_55_Template(rf, ctx) {
  if (rf & 1) {
    const _r54 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "tr", 70)(1, "td", 71)(2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](4, "td", 72)(5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](7, "td", 71)(8, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](10, "td", 71)(11, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](13, "td", 71)(14, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](16, "td", 73)(17, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](19, "td", 75)(20, "div", 76)(21, "div", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_tr_55_Template_div_click_21_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r54);
      const i_r37 = restoredCtx.index;
      const ctx_r53 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r53.actionMenu.toggleDesktopMenu(i_r37, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](22, "button", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](23, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](24, "img", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](25, SchoolListComponent_tr_55_ul_25_Template, 17, 11, "ul", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const schoolData_r36 = ctx.$implicit;
    const i_r37 = ctx.index;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r36 == null ? null : schoolData_r36.schoolId);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r36.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r36.district);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r36.block);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](schoolData_r36.zone);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction2"](13, _c7, !schoolData_r36.isDeleted, schoolData_r36.isDeleted));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](!schoolData_r36.isDeleted ? "Active" : "Inactive");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵclassProp"]("open", ctx_r9.actionMenu.openStates[i_r37]);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](23, 11, "More options"));
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx_r9.actionMenu.openStates[i_r37]);
  }
}
function SchoolListComponent_tr_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "tr")(1, "td", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](3, 1, "No Data Found"));
  }
}
function SchoolListComponent_app_modal_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r56 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "app-modal")(1, "app-disable-popup", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("sendDetails", function SchoolListComponent_app_modal_57_Template_app_disable_popup_sendDetails_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r56);
      const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r55.onDisableSchool($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("modalHeader", "Disable School")("modalSubHeader", "Are you sure you want to disable this School?")("tableData", ctx_r11.tableData)("users_of_school", ctx_r11.users_of_school);
  }
}
function SchoolListComponent_app_modal_58_Template(rf, ctx) {
  if (rf & 1) {
    const _r58 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "app-modal")(1, "app-upload-popup", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("fileUploaded", function SchoolListComponent_app_modal_58_Template_app_upload_popup_fileUploaded_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r58);
      const ctx_r57 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r57.uploadedFile($event));
    })("upload", function SchoolListComponent_app_modal_58_Template_app_upload_popup_upload_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵrestoreView"](_r58);
      const ctx_r59 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵresetView"](ctx_r59.upload($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("allowedFileTypes", ctx_r12.uploadFileTypes);
  }
}
function SchoolListComponent_app_modal_59_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "app-modal");
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](1, "app-upload-error-popup", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("modalHeader", "Upload Error")("errorUrl", ctx_r13.errorUrl);
  }
}
class SchoolListComponent {
  /**
   * Class constructor
   * @param schoolManagementService SchoolManagementService
   * @param router Router
   * @param modalService ModalService
   * @param utilityService UtilityService
   * @param masterService MasterService
   * @param userManagementService UserManagementService
   */
  constructor(schoolManagementService, router, modalService, utilityService, masterService, userManagementService) {
    this.schoolManagementService = schoolManagementService;
    this.router = router;
    this.modalService = modalService;
    this.utilityService = utilityService;
    this.masterService = masterService;
    this.userManagementService = userManagementService;
    this.schoolListTableHeaders = ['DISE Code', 'School Name', 'District', 'Taluk', 'Zone', 'Status', 'Action'];
    this.districtDropdownOptions = [];
    this.stateDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.zoneDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.stateDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'State',
      bindLabel: 'state',
      bindValue: 'state',
      labelTxt: 'State'
    };
    this.districtDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'District',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'District'
    };
    this.blockDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Taluk',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'Taluk'
    };
    this.zoneDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Zone',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'Zone'
    };
    this.schoolDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'School',
      bindLabel: 'name',
      bindValue: '_id',
      labelTxt: 'School',
      searchable: true
    };
    this.actionMenu = new src_app_shared_utility_action_menu_controller_util__WEBPACK_IMPORTED_MODULE_1__.ActionMenuController();
    this.uploadFileTypes = src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.BULK_UPLOAD_FILE_TYPES;
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalItems = 0;
    this.searchText = '';
    this.searchTerms = new rxjs__WEBPACK_IMPORTED_MODULE_16__.Subject();
    this.filterObj = {
      district: '',
      zone: '',
      block: '',
      _id: '',
      search: ''
    };
    this.states = [];
    this.valAssigned = false;
    this.scopePaths = [];
  }
  /**
   * OnInit lifecycle hook for initialization
   */
  ngOnInit() {
    this.getRegionsData();
    this.getShcoolList();
    this.searchSubscription = this.searchTerms.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_17__.debounceTime)(1000), (0,rxjs__WEBPACK_IMPORTED_MODULE_18__.distinctUntilChanged)()).subscribe(() => {
      this.onFilterChange('search', this.searchText);
    });
  }
  /**
   * Function to get regions data
   */
  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: val => {
        this.regionsData = val?.data?.results;
        const grants = this.utilityService.getPermission('school.list');
        this.scopePaths = (0,src_app_shared_utility_scope_util__WEBPACK_IMPORTED_MODULE_2__.regionScopePaths)(grants);
        const schoolGrants = grants.filter(grant => grant.scopeType === 'SCHOOL');
        if (!schoolGrants.length) {
          this.setStateDropdownValues();
          return;
        }
        (0,rxjs__WEBPACK_IMPORTED_MODULE_19__.forkJoin)(schoolGrants.map(grant => this.schoolManagementService.getSchoolList(1, 1, {
          _id: grant.dep
        }))).subscribe(responses => {
          this.scopePaths.push(...responses.map(response => response.data.results[0]));
          this.setStateDropdownValues();
        });
      }
    });
  }
  setStateDropdownValues() {
    this.stateDropdownOptions = this.regionsData.filter(region => (0,src_app_shared_utility_scope_util__WEBPACK_IMPORTED_MODULE_2__.pathAllowed)(this.scopePaths, {
      state: region.state
    }));
    this.selectOnly('state', this.stateDropdownOptions, this.stateDropdownconfig, this.stateDropdown, 'state', state => this.setZoneDropdownValues(state));
    if (this.filterObj.state) this.getShcoolList(this.filterObj);
  }
  /**
   * Function to set zone dropdown values
   * @param selectedStateValue
   */
  setZoneDropdownValues(selectedStateValue) {
    if (selectedStateValue) {
      this.selectedStateObj = this.utilityService.filterDropdownValues(this.regionsData, 'state', selectedStateValue);
      this.zoneDropdownOptions = this.selectedStateObj.zones.filter(zone => (0,src_app_shared_utility_scope_util__WEBPACK_IMPORTED_MODULE_2__.pathAllowed)(this.scopePaths, {
        state: selectedStateValue,
        zone: zone.name
      }));
      this.selectOnly('zone', this.zoneDropdownOptions, this.zoneDropdownconfig, this.zoneDropdown, 'name', zone => this.setDistrictDropdownValues(zone));
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
      this.districtDropdownOptions = this.selectedZoneObj.districts.filter(district => (0,src_app_shared_utility_scope_util__WEBPACK_IMPORTED_MODULE_2__.pathAllowed)(this.scopePaths, {
        state: this.filterObj.state,
        zone: selectedZone,
        district: district.name
      }));
      this.selectOnly('district', this.districtDropdownOptions, this.districtDropdownconfig, this.districtDropdown, 'name', district => this.setBlockDropdownValues(district));
    }
  }
  /**
   * Function to set block dropdown values
   * @param selectedDistrict
   */
  setBlockDropdownValues(selectedDistrict) {
    this.resetDistrict();
    if (selectedDistrict) {
      this.selectedDistrictObj = this.utilityService.filterDropdownValues(this.selectedZoneObj.districts, 'name', selectedDistrict);
      this.blockDropdownOptions = this.selectedDistrictObj.blocks.filter(block => (0,src_app_shared_utility_scope_util__WEBPACK_IMPORTED_MODULE_2__.pathAllowed)(this.scopePaths, {
        state: this.filterObj.state,
        zone: this.filterObj.zone[0],
        district: selectedDistrict,
        block: block.name
      }));
      this.selectOnly('block', this.blockDropdownOptions, this.blockDropdownconfig, this.blockDropdown, 'name', () => this.getSchoolFilteredList());
    }
  }
  selectOnly(type, options, config, dropdown, valueKey, selected) {
    config.disabled = options.length === 1;
    if (options.length !== 1) return;
    const value = options[0][valueKey];
    dropdown.selectedItem = value;
    this.filterObj[type] = ['zone', 'district'].includes(type) ? [value] : value;
    selected(value);
  }
  clickInside(event) {
    this.actionMenu.closeAllIfTriggeredInside(event, '.school-list-container');
  }
  onFilterChange(type, value) {
    if (type === 'zone' && value !== undefined && value !== null && !Array.isArray(value)) {
      this.filterObj[type] = [value];
    } else if (type === 'district' && value !== undefined && value !== null && !Array.isArray(value)) {
      this.filterObj[type] = [value];
    } else {
      this.filterObj[type] = value;
    }
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
    this.getShcoolList(this.filterObj);
  }
  resetStates() {
    this.zoneDropdownconfig.disabled = false;
    this.districtDropdownconfig.disabled = false;
    this.blockDropdownconfig.disabled = false;
    this.schoolDropdownconfig.disabled = false;
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
    this.districtDropdownconfig.disabled = false;
    this.blockDropdownconfig.disabled = false;
    this.schoolDropdownconfig.disabled = false;
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
    this.blockDropdownconfig.disabled = false;
    this.schoolDropdownconfig.disabled = false;
    this.filterObj.block = '';
    this.filterObj._id = '';
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.blockDropdown.selectedItem = null;
    this.schoolDropdown.selectedItem = null;
  }
  resetBlock() {
    this.schoolDropdownconfig.disabled = false;
    this.filterObj._id = '';
    this.schoolDropdownOptions = [];
    this.schoolDropdown.selectedItem = null;
  }
  /**
   * Function to get school list data
   */
  getShcoolList(filter) {
    let observable;
    if (filter) {
      observable = this.schoolManagementService.getSchoolList(this.currentPage, this.pageSize, filter);
    } else {
      observable = this.schoolManagementService.getSchoolList(this.currentPage, this.pageSize);
    }
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
    this.paginationSubscription = observable.subscribe({
      next: res => {
        this.schoolListData = res.data['results'];
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
   * Function to navigate to view school details
   * @param id school id
   */
  viewSchool(id) {
    this.router.navigate([`/schools/${id}`], {
      queryParams: {
        mode: 'view'
      }
    });
  }
  /**
   * Function to navigate to edit school details
   * @param id school id
   */
  editSchool(id) {
    this.router.navigate([`/schools/${id}`], {
      queryParams: {
        mode: 'edit'
      }
    });
  }
  /**
   * Function to open disable school popup
   */
  openModalForDeleteConfirm(item) {
    this.users_of_school = 0;
    this.userManagementService.getUsersOfSchool(item._id).subscribe({
      next: res => {
        this.users_of_school = res.data.totalItems;
      }
    });
    this.modalService.showDeleteUserDialog = true;
    this.tableData = {
      id: item._id,
      header: ['School Name', 'School ID', 'District', 'Zone'],
      data: {
        school_name: item.name,
        school_id: item.schoolId || '-',
        district: item.district,
        zone: item.zone
      }
    };
  }
  /**
   * Function to open bulk upload popup
   */
  blukUpload() {
    this.modalService.showBlukUploadDialog = true;
  }
  exportSchoolList() {
    if (!this.schoolListData.length) {
      return;
    }
    this.schoolManagementService.exportSchoolList(this.filterObj).subscribe({
      next: res => {
        this.utilityService.handleResponse(res);
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
  onDisableSchool(item) {
    this.schoolManagementService.disableSchool(item.id).subscribe({
      next: res => {
        this.modalService.showDeleteUserDialog = false;
        this.utilityService.handleResponse(res);
        this.getShcoolList();
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  /**
   * pagination
   */
  onPageChange(page) {
    this.currentPage = page;
    this.getShcoolList(this.filterObj);
  }
  /**
  * Function triggerd on file upload
  * @param fileDetails
  */
  uploadedFile(fileDetails) {
    this.fileToUpload = fileDetails.file;
  }
  /**
   * Function triggered on upload
   * @param isUpload
   */
  upload(isUpload) {
    if (isUpload && this.fileToUpload) {
      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      this.schoolManagementService.bulkUpload(formData).subscribe({
        next: res => {
          this.utilityService.showSuccess(res.message);
          this.modalService.showBlukUploadDialog = false;
        },
        error: err => {
          if (err?.error?.errorUrl) {
            this.errorUrl = err?.error?.errorUrl;
            this.modalService.showBlukUploadDialog = false;
            this.modalService.showUploadErrorDialog = true;
          } else {
            this.utilityService.showError(err.error.message);
          }
        }
      });
    }
  }
  activateSchool(id) {
    this.schoolManagementService.activateSchool(id).subscribe({
      next: res => {
        this.utilityService.handleResponse(res);
        this.getShcoolList();
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
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
      this.schoolDropdownOptions = res.data.results;
      this.selectOnly('_id', this.schoolDropdownOptions, this.schoolDropdownconfig, this.schoolDropdown, '_id', () => this.getShcoolList(this.filterObj));
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
    this.ɵfac = function SchoolListComponent_Factory(t) {
      return new (t || SchoolListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdirectiveInject"](_school_management_service__WEBPACK_IMPORTED_MODULE_3__.SchoolManagementService), _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_20__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdirectiveInject"](src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_4__.ModalService), _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_5__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdirectiveInject"](src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_6__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdirectiveInject"](_user_management_user_management_service__WEBPACK_IMPORTED_MODULE_7__.UserManagementService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵdefineComponent"]({
      type: SchoolListComponent,
      selectors: [["app-school-list"]],
      viewQuery: function SchoolListComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵviewQuery"](_c0, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵviewQuery"](_c1, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵviewQuery"](_c2, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵviewQuery"](_c3, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵviewQuery"](_c4, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵloadQuery"]()) && (ctx.stateDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵloadQuery"]()) && (ctx.zoneDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵloadQuery"]()) && (ctx.districtDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵloadQuery"]()) && (ctx.blockDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵloadQuery"]()) && (ctx.schoolDropdown = _t.first);
        }
      },
      hostBindings: function SchoolListComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_click_HostBindingHandler($event) {
            return ctx.clickInside($event);
          });
        }
      },
      decls: 61,
      vars: 42,
      consts: [[1, "school-list-wrapper", "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "content-center"], [1, "text-2xl", "md:text-[30px]", "md:leading-[48px]", "font-bold", "text-content"], [1, "school-list-container", "px-4", "py-6", "md:px-6", "md:py-8", "bg-white", "mt-6", "border", "rounded"], [1, "flex", "flex-col", "gap-4", "sm:gap-5", "sm:flex-row", "sm:justify-between", "sm:items-start"], [1, "text-content", "text-2xl", "md:text-[30px]", "md:leading-[48px]", "font-bold"], [1, "buttons", "w-full", "sm:w-auto", "flex", "flex-col", "sm:flex-row", "gap-2", "sm:items-center"], [1, "w-full", "sm:w-auto"], [1, "search-icon", "min-w-0", "flex", "items-center", "h-9", "w-full", "sm:w-[300px]"], ["src", "assets/icons/search.svg", "alt", "", 1, "mr-2"], ["type", "text", 1, "appearance-none", "border", "border-content-50", "rounded", "py-2", "px-3", "text-content", "leading-tight", "focus:outline-none", "bg-surface-muted", "h-full", "w-full", 3, "placeholder", "ngModel", "ngModelChange", "input"], [1, "action-btn", "flex", "flex-col", "sm:flex-row", "sm:flex-wrap", "gap-2"], [1, "btn-outline-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission", "click"], [1, "flex", "items-center", "justify-center", "gap-2"], ["src", "assets/icons/upload.svg", "alt", ""], [1, "text-nowrap"], ["routerLink", "/schools/add", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission"], ["src", "assets/icons/add.svg", "alt", ""], ["class", "btn-primary h-9 w-full sm:w-auto", 3, "disabled", "click", 4, "ngIf"], [1, "mt-7", "grid", "gap-3", "grid-cols-1", "sm:grid-cols-2", "xl:grid-cols-5", "mb-2", "md:mb-4"], [1, "w-full", "min-w-0"], [3, "dropDownValues", "config", "valueUpdate"], ["stateDropdown", ""], ["zoneDropdown", ""], ["districtDropdown", ""], ["blockDropdown", ""], ["schoolDropdown", ""], [1, "space-y-4", "md:hidden"], ["class", "rounded-xl border p-4 bg-white shadow-sm", 4, "ngFor", "ngForOf"], ["class", "text-center text-content-60 py-4 border rounded-xl", 4, "ngIf"], [1, "hidden", "md:block", "w-full", "overflow-x-auto"], ["aria-label", "school-list", 1, "table-auto", "min-w-[900px]", "w-full", "border", "mt-3", "rounded-lg"], [1, "header", "font-semibold", "text-left", "text-content", "table-header", "border-b", "border-shade"], ["class", "px-4 py-6 border text-sm", 4, "ngFor", "ngForOf"], [1, "bg-white"], ["class", "text-gray-700", 4, "ngFor", "ngForOf"], [4, "ngIf"], [3, "totalItems", "pageSize", "currentPage", "pageChange"], [1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "disabled", "click"], ["src", "assets/icons/upload_light.svg", "alt", ""], [1, "rounded-xl", "border", "p-4", "bg-white", "shadow-sm"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "min-w-0"], [1, "text-xs", "text-content-60"], [1, "font-semibold", "break-all"], [1, "relative", "shrink-0"], [1, "py-1", "px-2", "rounded", "inline-flex", "items-center", 3, "click"], ["src", "assets/icons/more_vert.svg", "alt", "", 1, "w-5"], ["class", "absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50", "role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 4, "ngIf"], [1, "mt-4", "space-y-3", "text-sm"], [1, "font-semibold", "break-words"], [1, "grid", "grid-cols-2", "gap-3"], [1, "break-words"], [1, "inline-flex", "px-3", "py-0.5", "sm:py-1", "rounded-full", "text-sm", 3, "ngClass"], ["role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 1, "absolute", "right-0", "top-full", "mt-1", "w-48", "rounded-md", "shadow-lg", "bg-white", "ring-1", "ring-black", "ring-opacity-5", "focus:outline-none", "z-50"], [1, "h-10", "mt-2", "hover:bg-shade-80", "cursor-pointer", 3, "click"], ["role", "menuitem", 1, "block", "px-4", "py-2", "text-sm", "text-content"], [1, "flex", "items-center"], ["src", "assets/icons/Visibility.svg", "alt", "", 1, "ms-2", "me-3"], [1, "h-10", "hover:bg-shade-80", "cursor-pointer", 3, "hasPermission", "click"], ["src", "assets/icons/Vector.svg", "alt", "", 1, "ms-2", "me-3"], ["class", "h-10 mb-2 hover:bg-shade-80 cursor-pointer", 3, "hasPermission", 4, "ngIf"], [1, "h-10", "mb-2", "hover:bg-shade-80", "cursor-pointer", 3, "hasPermission"], ["role", "menuitem", 1, "block", "px-4", "py-2", "text-sm", "text-content", 3, "click"], ["src", "assets/icons/Vector (2).svg", "alt", "", 1, "mx-2"], [1, "text-error"], ["src", "assets/icons/switch-on.svg", "alt", "", 1, "mx-2", "w-7"], [1, "text-success"], [1, "text-center", "text-content-60", "py-4", "border", "rounded-xl"], [1, "px-4", "py-6", "border", "text-sm"], [1, "text-gray-700"], [1, "px-4", "py-6", "text-sm", "border"], [1, "px-4", "py-6", "text-sm", "border", "max-w-[16rem]", "break-words"], [1, "p-4", "text-sm", "border"], [1, "px-3", "py-2", "rounded-full", 3, "ngClass"], [1, "px-4", "py-6", "text-sm", "border", "relative"], [1, "flex", "justify-center"], [3, "click"], [1, "py-2", "px-4", "rounded", "inline-flex", "items-center"], ["class", "fixed w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50", "role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 3, "ngStyle", 4, "ngIf"], ["role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 1, "fixed", "w-48", "rounded-md", "shadow-lg", "bg-white", "ring-1", "ring-black", "ring-opacity-5", "focus:outline-none", "z-50", 3, "ngStyle"], ["colspan", "7", 1, "text-center", "text-content-60", "py-2"], [3, "modalHeader", "modalSubHeader", "tableData", "users_of_school", "sendDetails"], ["context", "school-management", 3, "allowedFileTypes", "fileUploaded", "upload"], [3, "modalHeader", "errorUrl"]],
      template: function SchoolListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](5, "div", 3)(6, "div", 4)(7, "p", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](9, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](10, "div", 6)(11, "div", 7)(12, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](13, "img", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](14, "input", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("ngModelChange", function SchoolListComponent_Template_input_ngModelChange_14_listener($event) {
            return ctx.searchText = $event;
          })("input", function SchoolListComponent_Template_input_input_14_listener($event) {
            return ctx.searchInputChanged($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](15, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](16, "div", 11)(17, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("click", function SchoolListComponent_Template_button_click_17_listener() {
            return ctx.blukUpload();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](18, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](19, "img", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](20, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](21);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](22, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](23, "button", 16)(24, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelement"](25, "img", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](26, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtext"](27);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipe"](28, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](29, SchoolListComponent_button_29_Template, 6, 4, "button", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](30, "div", 19)(31, "div", 20)(32, "app-dropdown", 21, 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_dropdown_valueUpdate_32_listener($event) {
            return ctx.onFilterChange("state", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](34, "div", 20)(35, "app-dropdown", 21, 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_dropdown_valueUpdate_35_listener($event) {
            return ctx.onFilterChange("zone", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](37, "div", 20)(38, "app-dropdown", 21, 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_dropdown_valueUpdate_38_listener($event) {
            return ctx.onFilterChange("district", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](40, "div", 20)(41, "app-dropdown", 21, 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_dropdown_valueUpdate_41_listener($event) {
            return ctx.onFilterChange("block", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](43, "div", 20)(44, "app-dropdown", 21, 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_dropdown_valueUpdate_44_listener($event) {
            return ctx.onFilterChange("_id", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](46, "div", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](47, SchoolListComponent_div_47_Template, 45, 32, "div", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](48, SchoolListComponent_div_48_Template, 3, 3, "div", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](49, "div", 30)(50, "table", 31)(51, "thead")(52, "tr", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](53, SchoolListComponent_th_53_Template, 3, 3, "th", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](54, "tbody", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](55, SchoolListComponent_tr_55_Template, 26, 16, "tr", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](56, SchoolListComponent_tr_56_Template, 4, 3, "tr", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](57, SchoolListComponent_app_modal_57_Template, 2, 4, "app-modal", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](58, SchoolListComponent_app_modal_58_Template, 2, 1, "app-modal", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtemplate"](59, SchoolListComponent_app_modal_59_Template, 2, 2, "app-modal", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementStart"](60, "app-pagination", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵlistener"]("pageChange", function SchoolListComponent_Template_app_pagination_pageChange_60_listener($event) {
            return ctx.onPageChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](4, 30, "School Management"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](9, 32, "School List"));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](15, 34, "Search School Name/DISE Code"));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngModel", ctx.searchText);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](40, _c6));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](22, 36, "Bulk Upload"));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpureFunction0"](41, _c6));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵpipeBind1"](28, 38, "Add School"));
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.schoolListData);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("dropDownValues", ctx.stateDropdownOptions)("config", ctx.stateDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("dropDownValues", ctx.zoneDropdownOptions)("config", ctx.zoneDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("dropDownValues", ctx.districtDropdownOptions)("config", ctx.districtDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("dropDownValues", ctx.blockDropdownOptions)("config", ctx.blockDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("dropDownValues", ctx.schoolDropdownOptions)("config", ctx.schoolDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx.schoolListData);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", !ctx.schoolListData || !ctx.schoolListData.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx.schoolListTableHeaders);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngForOf", ctx.schoolListData);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", !ctx.schoolListData || !ctx.schoolListData.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.modalService.showDeleteUserDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.modalService.showBlukUploadDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("ngIf", ctx.modalService.showUploadErrorDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_15__["ɵɵproperty"]("totalItems", ctx.totalItems)("pageSize", ctx.pageSize)("currentPage", ctx.currentPage);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_21__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_21__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_21__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_21__.NgStyle, _angular_router__WEBPACK_IMPORTED_MODULE_20__.RouterLink, _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_8__.DropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_22__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_22__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_22__.NgModel, _shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_9__.ModalComponent, _shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_10__.DisablePopupComponent, _shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_11__.UploadPopupComponent, _core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_12__.HasPermissionDirective, _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_13__.PaginationComponent, _shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_14__.UploadErrorPopupComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_23__.TranslatePipe],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzY2hvb2wtbGlzdC5jb21wb25lbnQuc2NzcyJ9 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi9zY2hvb2wtbWFuYWdlbWVudC9zY2hvb2wtbGlzdC9zY2hvb2wtbGlzdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0Esd0tBQXdLIiwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 37234:
/*!**********************************************************************************!*\
  !*** ./src/app/view/admin/school-management/school-management-routing.module.ts ***!
  \**********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchoolManagementRoutingModule: () => (/* binding */ SchoolManagementRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _school_list_school_list_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./school-list/school-list.component */ 93811);
/* harmony import */ var _school_add_edit_school_add_edit_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./school-add-edit/school-add-edit.component */ 3851);
/* harmony import */ var src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/core/guards/permission.guard */ 83811);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);






const routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
}, {
  path: 'list',
  component: _school_list_school_list_component__WEBPACK_IMPORTED_MODULE_0__.SchoolListComponent,
  data: {
    permissions: ['school.list'],
    idleTracking: 'custom'
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_2__.PermissionGuard]
}, {
  path: 'add',
  component: _school_add_edit_school_add_edit_component__WEBPACK_IMPORTED_MODULE_1__.SchoolAddEditComponent,
  data: {
    permissions: ['school.create'],
    idleTracking: 'custom'
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_2__.PermissionGuard]
}, {
  path: ':id',
  component: _school_add_edit_school_add_edit_component__WEBPACK_IMPORTED_MODULE_1__.SchoolAddEditComponent,
  data: {
    permissions: ['school.read'],
    idleTracking: 'custom'
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_2__.PermissionGuard]
}];
class SchoolManagementRoutingModule {
  static {
    this.ɵfac = function SchoolManagementRoutingModule_Factory(t) {
      return new (t || SchoolManagementRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
      type: SchoolManagementRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](SchoolManagementRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
  });
})();

/***/ }),

/***/ 77435:
/*!**************************************************************************!*\
  !*** ./src/app/view/admin/school-management/school-management.module.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchoolManagementModule: () => (/* binding */ SchoolManagementModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _school_management_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./school-management-routing.module */ 37234);
/* harmony import */ var _school_list_school_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./school-list/school-list.component */ 93811);
/* harmony import */ var _school_add_edit_school_add_edit_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./school-add-edit/school-add-edit.component */ 3851);
/* harmony import */ var src_app_shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/dropdown/dropdown.component */ 62157);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/components/modal/modal.component */ 69081);
/* harmony import */ var src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/disable-popup/disable-popup.component */ 51541);
/* harmony import */ var src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/components/upload-popup/upload-popup.component */ 86487);
/* harmony import */ var src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/core/directives/has-permission.directive */ 87944);
/* harmony import */ var src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var src_app_shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/shared/components/upload-error-popup/upload-error-popup.component */ 12321);
/* harmony import */ var src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 37580);















class SchoolManagementModule {
  static {
    this.ɵfac = function SchoolManagementModule_Factory(t) {
      return new (t || SchoolManagementModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({
      type: SchoolManagementModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({
      providers: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.DatePipe],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _school_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.SchoolManagementRoutingModule, src_app_shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.DropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.ReactiveFormsModule, src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_4__.ModalComponent, src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_5__.DisablePopupComponent, src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_6__.UploadPopupComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_8__.PaginationComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__.TranslateModule, src_app_shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_9__.UploadErrorPopupComponent, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_10__.DeleteDetailComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵsetNgModuleScope"](SchoolManagementModule, {
    declarations: [_school_list_school_list_component__WEBPACK_IMPORTED_MODULE_1__.SchoolListComponent, _school_add_edit_school_add_edit_component__WEBPACK_IMPORTED_MODULE_2__.SchoolAddEditComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule, _school_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.SchoolManagementRoutingModule, src_app_shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.DropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_13__.ReactiveFormsModule, src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_4__.ModalComponent, src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_5__.DisablePopupComponent, src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_6__.UploadPopupComponent, src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_7__.HasPermissionDirective, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_8__.PaginationComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_14__.TranslateModule, src_app_shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_9__.UploadErrorPopupComponent, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_10__.DeleteDetailComponent]
  });
})();

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_school-management_school-management_module_ts.98ee90728caeeab8.js.map