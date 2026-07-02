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
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _school_management_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../school-management.service */ 69700);
/* harmony import */ var src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/modal/modal.service */ 51133);
/* harmony import */ var src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/services/master.service */ 2216);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../../shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../shared/components/form-dropdown/form-dropdown.component */ 55233);
/* harmony import */ var _shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/components/modal/modal.component */ 69081);
/* harmony import */ var _shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../shared/components/upload-popup/upload-popup.component */ 86487);
/* harmony import */ var _core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../core/directives/has-permission.directive */ 87944);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @ngx-translate/core */ 90852);

















function SchoolAddEditComponent_span_25_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_small_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "School name is required"));
  }
}
function SchoolAddEditComponent_small_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "School name should have atleast 5 characters"));
  }
}
function SchoolAddEditComponent_span_34_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_small_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "DISE Code is required"));
  }
}
function SchoolAddEditComponent_small_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "DISE Code should be of 11 digits"));
  }
}
function SchoolAddEditComponent_span_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_small_61_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Academic year start date is required"));
  }
}
function SchoolAddEditComponent_span_66_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_small_70_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Academic year end date is required"));
  }
}
function SchoolAddEditComponent_small_71_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Academic year end date must be greater than start date"));
  }
}
function SchoolAddEditComponent_th_87_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Action"), " ");
  }
}
function SchoolAddEditComponent_tr_89_p_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const holiday_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = holiday_r24.get("date")) == null ? null : tmp_0_0.value) || "-", " ");
  }
}
function SchoolAddEditComponent_tr_89_div_7_small_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Date is required"));
  }
}
function SchoolAddEditComponent_tr_89_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div")(1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "input", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](4, "date");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_89_div_7_small_6_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const holiday_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    let tmp_1_0;
    let tmp_2_0;
    let tmp_3_0;
    let tmp_4_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 11, "Select date"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("min", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](3, 5, (tmp_1_0 = ctx_r27.schoolAddEditForm.get("academicYearStartDate")) == null ? null : tmp_1_0.value, "yyyy-MM-dd"))("max", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](4, 8, (tmp_2_0 = ctx_r27.schoolAddEditForm.get("academicYearEndDate")) == null ? null : tmp_2_0.value, "yyyy-MM-dd"))("required", ((tmp_3_0 = holiday_r24.get("reason")) == null ? null : tmp_3_0.value) !== "");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r27.submitted && ((tmp_4_0 = holiday_r24.get("date")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["required"]));
  }
}
function SchoolAddEditComponent_tr_89_p_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const holiday_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = holiday_r24.get("reason")) == null ? null : tmp_0_0.value) || "-", " ");
  }
}
function SchoolAddEditComponent_tr_89_div_13_p_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Reason is required"), " ");
  }
}
function SchoolAddEditComponent_tr_89_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div")(1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "input", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](4, SchoolAddEditComponent_tr_89_div_13_p_4_Template, 3, 3, "p", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const holiday_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    let tmp_1_0;
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 3, "Reason"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("required", ((tmp_1_0 = holiday_r24.get("date")) == null ? null : tmp_1_0.value) !== "");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r29.submitted && ((tmp_2_0 = holiday_r24.get("reason")) == null ? null : tmp_2_0.errors == null ? null : tmp_2_0.errors["required"]));
  }
}
function SchoolAddEditComponent_tr_89_td_14_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r41 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_89_td_14_button_5_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r41);
      const i_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).index;
      const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r39.removeHoliday(i_r25));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "img", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 1, "Delete"));
  }
}
function SchoolAddEditComponent_tr_89_td_14_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r43 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_89_td_14_button_6_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r43);
      const ctx_r42 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r42.addHoliday());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 1, "Add"));
  }
}
function SchoolAddEditComponent_tr_89_td_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 58)(1, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](5, SchoolAddEditComponent_tr_89_td_14_button_5_Template, 6, 3, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_89_td_14_button_6_Template, 6, 3, "button", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const i_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().index;
    const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 4, "Action"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", i_r25 === 0 ? "justify-center" : "justify-start");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", i_r25 !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", i_r25 === ctx_r30.holidayList.controls.length - 1);
  }
}
function SchoolAddEditComponent_tr_89_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "tr", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](1, 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](2, "td", 52)(3, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_89_p_6_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](7, SchoolAddEditComponent_tr_89_div_7_Template, 7, 13, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](8, "td", 54)(9, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](11, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](12, SchoolAddEditComponent_tr_89_p_12_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](13, SchoolAddEditComponent_tr_89_div_13_Template, 5, 5, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](14, SchoolAddEditComponent_tr_89_td_14_Template, 7, 6, "td", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r25 = ctx.index;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("formGroupName", i_r25);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 8, "Date"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r12.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r12.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](11, 10, "Reason"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r12.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r12.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r12.mode !== "view");
  }
}
function SchoolAddEditComponent_th_105_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "th", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Action"), " ");
  }
}
function SchoolAddEditComponent_tr_107_p_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const resource_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = resource_r45.get("otherType")) == null ? null : tmp_0_0.value) ? (tmp_0_0 = resource_r45.get("otherType")) == null ? null : tmp_0_0.value : ((tmp_0_0 = resource_r45.get("type")) == null ? null : tmp_0_0.value) || "-", " ");
  }
}
function SchoolAddEditComponent_tr_107_ng_container_7_input_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](0, "input", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](1, "translate");
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](1, 1, "Enter resource type"));
  }
}
function SchoolAddEditComponent_tr_107_ng_container_7_p_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Resource type is required"), " ");
  }
}
function SchoolAddEditComponent_tr_107_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r58 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div")(2, "app-form-dropdown", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("valueChange", function SchoolAddEditComponent_tr_107_ng_container_7_Template_app_form_dropdown_valueChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r58);
      const i_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().index;
      const ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r56.setResourceDetailsValues(i_r46, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](3, SchoolAddEditComponent_tr_107_ng_container_7_input_3_Template, 2, 3, "input", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](4, SchoolAddEditComponent_tr_107_ng_container_7_p_4_Template, 3, 3, "p", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const resource_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    let tmp_3_0;
    let tmp_6_0;
    let tmp_7_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownControlName", "type")("dropDownCtrl", ctx_r48.convertToFormControl(resource_r45.get("type")))("dropDownValues", ctx_r48.resourceTypeDropdownOptions)("config", ((tmp_3_0 = resource_r45.get("typeChipSet")) == null ? null : tmp_3_0.value) ? ctx_r48.resourceTypeDropdownconfig : ctx_r48.resourceTypeDarkDropdownconfig)("submitted", ctx_r48.submitted)("mode", ctx_r48.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !((tmp_6_0 = resource_r45.get("typeChipSet")) == null ? null : tmp_6_0.value));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !((tmp_7_0 = resource_r45.get("typeChipSet")) == null ? null : tmp_7_0.value) && ctx_r48.submitted && ((tmp_7_0 = resource_r45.get("otherType")) == null ? null : tmp_7_0.errors == null ? null : tmp_7_0.errors["required"]));
  }
}
function SchoolAddEditComponent_tr_107_p_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const resource_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", ((tmp_0_0 = resource_r45.get("details")) == null ? null : tmp_0_0.value == null ? null : tmp_0_0.value.length) ? (tmp_0_0 = resource_r45.get("details")) == null ? null : tmp_0_0.value : "-", " ");
  }
}
function SchoolAddEditComponent_tr_107_div_13_div_3_p_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Resource details are required"), " ");
  }
}
const _c0 = function () {
  return {
    standalone: true
  };
};
function SchoolAddEditComponent_tr_107_div_13_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r64 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div")(1, "div", 73)(2, "input", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_tr_107_div_13_div_3_Template_input_ngModelChange_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r64);
      const i_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).index;
      const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r63.resourceOtherValue[i_r46] = $event);
    })("keydown.enter", function SchoolAddEditComponent_tr_107_div_13_div_3_Template_input_keydown_enter_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r64);
      const ctx_r67 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      const resource_r45 = ctx_r67.$implicit;
      const i_r46 = ctx_r67.index;
      const ctx_r66 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      $event.preventDefault();
      $event.stopPropagation();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r66.addOtherResource(resource_r45, i_r46, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "button", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_107_div_13_div_3_Template_button_click_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r64);
      const ctx_r69 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
      const resource_r45 = ctx_r69.$implicit;
      const i_r46 = ctx_r69.index;
      const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r68.addOtherResource(resource_r45, i_r46, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](6, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](7, SchoolAddEditComponent_tr_107_div_13_div_3_p_7_Template, 3, 3, "p", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r70 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2);
    const i_r46 = ctx_r70.index;
    const resource_r45 = ctx_r70.$implicit;
    const ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    let tmp_3_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 4, "Enter resource details"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngModel", ctx_r61.resourceOtherValue[i_r46])("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](6, _c0));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !((tmp_3_0 = resource_r45.get("detailsChipSet")) == null ? null : tmp_3_0.value) && ctx_r61.submitted && ((tmp_3_0 = resource_r45.get("details")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["required"]));
  }
}
function SchoolAddEditComponent_tr_107_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div")(1, "div", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "app-form-dropdown", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](3, SchoolAddEditComponent_tr_107_div_13_div_3_Template, 8, 7, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r71 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    const resource_r45 = ctx_r71.$implicit;
    const i_r46 = ctx_r71.index;
    const ctx_r50 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    let tmp_0_0;
    let tmp_7_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("hidden", !((tmp_0_0 = resource_r45.get("detailsChipSet")) == null ? null : tmp_0_0.value));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownControlName", "details")("dropDownCtrl", ctx_r50.convertToFormControl(resource_r45.get("details")))("dropDownValues", ctx_r50.resourceDetailsDropdownOptions[i_r46])("config", ctx_r50.resourceDetailsDropdownconfig)("submitted", ctx_r50.submitted)("mode", ctx_r50.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !((tmp_7_0 = resource_r45.get("detailsChipSet")) == null ? null : tmp_7_0.value));
  }
}
function SchoolAddEditComponent_tr_107_div_14_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r77 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "span", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_107_div_14_ng_container_1_Template_span_click_3_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r77);
      const i_r74 = restoredCtx.index;
      const resource_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).$implicit;
      const ctx_r75 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r75.removeItem(resource_r45, i_r74));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r73 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("", item_r73, " ");
  }
}
function SchoolAddEditComponent_tr_107_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, SchoolAddEditComponent_tr_107_div_14_ng_container_1_Template, 5, 1, "ng-container", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const resource_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", (tmp_0_0 = resource_r45.get("details")) == null ? null : tmp_0_0.value);
  }
}
function SchoolAddEditComponent_tr_107_td_15_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r83 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_107_td_15_button_5_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r83);
      const i_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).index;
      const ctx_r81 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r81.removeResource(i_r46));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "img", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 1, "Delete"));
  }
}
function SchoolAddEditComponent_tr_107_td_15_button_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r85 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_tr_107_td_15_button_6_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r85);
      const ctx_r84 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r84.addResource());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 1, "Add"));
  }
}
function SchoolAddEditComponent_tr_107_td_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "td", 80)(1, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "div", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](5, SchoolAddEditComponent_tr_107_td_15_button_5_Template, 6, 3, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_107_td_15_button_6_Template, 6, 3, "button", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const i_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().index;
    const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 4, "Action"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngClass", i_r46 === 0 ? "justify-center" : "justify-start");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", i_r46 !== 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", i_r46 === ctx_r52.facilities.controls.length - 1);
  }
}
function SchoolAddEditComponent_tr_107_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "tr", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](1, 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](2, "td", 65)(3, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](6, SchoolAddEditComponent_tr_107_p_6_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](7, SchoolAddEditComponent_tr_107_ng_container_7_Template, 5, 8, "ng-container", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](8, "td", 66)(9, "p", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](10);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](11, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](12, SchoolAddEditComponent_tr_107_p_12_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](13, SchoolAddEditComponent_tr_107_div_13_Template, 4, 8, "div", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](14, SchoolAddEditComponent_tr_107_div_14_Template, 2, 1, "div", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](15, SchoolAddEditComponent_tr_107_td_15_Template, 7, 6, "td", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r46 = ctx.index;
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("formGroupName", i_r46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 9, "Resource Type"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r14.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r14.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](11, 11, "Resource details"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r14.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r14.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r14.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r14.mode !== "view");
  }
}
function SchoolAddEditComponent_p_108_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Add Board/Class Details"));
  }
}
function SchoolAddEditComponent_div_109_Template(rf, ctx) {
  if (rf & 1) {
    const _r88 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 82)(1, "button", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_div_109_Template_button_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r88);
      const ctx_r87 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r87.createBoard());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](2, "div", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](3, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](5, "Add Board/Class Details");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
  }
}
function SchoolAddEditComponent_div_110_small_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Board is required"));
  }
}
function SchoolAddEditComponent_div_110_small_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Medium is required"));
  }
}
function SchoolAddEditComponent_div_110_small_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Class min value is required"));
  }
}
function SchoolAddEditComponent_div_110_small_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "Class max value is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_span_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_span_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "span", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r112 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "input", 96);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_2_Template_input_ngModelChange_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r112);
      const class_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](class_r100.standard = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](1, 3, "class"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngModel", class_r100.standard)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](5, _c0));
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](class_r100.standard);
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r117 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "input", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_5_Template_input_ngModelChange_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r117);
      const class_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](class_r100.boysStrength = $event);
    })("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_5_Template_input_ngModelChange_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r117);
      const ctx_r119 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      const class_r100 = ctx_r119.$implicit;
      const j_r101 = ctx_r119.index;
      const i_r90 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).index;
      const ctx_r118 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r118.updateTotalStrength(class_r100.boysStrength, class_r100.girlsStrength, i_r90, j_r101));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](1, 3, "No. of boys"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngModel", class_r100.boysStrength)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](5, _c0));
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_small_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "No. of boys is required"));
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](class_r100.boysStrength);
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r125 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "input", 97);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_9_Template_input_ngModelChange_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r125);
      const class_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](class_r100.girlsStrength = $event);
    })("ngModelChange", function SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_9_Template_input_ngModelChange_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r125);
      const ctx_r127 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      const class_r100 = ctx_r127.$implicit;
      const j_r101 = ctx_r127.index;
      const i_r90 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).index;
      const ctx_r126 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r126.updateTotalStrength(class_r100.boysStrength, class_r100.girlsStrength, i_r90, j_r101));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](1, 3, "No. of girls"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngModel", class_r100.girlsStrength)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](5, _c0));
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_small_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "small", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1, "No. of girls is required");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const class_r100 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](class_r100.girlsStrength);
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_tr_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "tr")(1, "td", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](2, SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_2_Template, 2, 6, "input", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](3, SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_3_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "td", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](5, SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_5_Template, 2, 6, "input", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](6, SchoolAddEditComponent_div_110_ng_container_14_tr_19_small_6_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](7, SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_7_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](8, "td", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](9, SchoolAddEditComponent_div_110_ng_container_14_tr_19_input_9_Template, 2, 6, "input", 95);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](10, SchoolAddEditComponent_div_110_ng_container_14_tr_19_small_10_Template, 2, 0, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](11, SchoolAddEditComponent_div_110_ng_container_14_tr_19_p_11_Template, 2, 1, "p", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const class_r100 = ctx.$implicit;
    const ctx_r99 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r99.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r99.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r99.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r99.submitted && !class_r100.boysStrength);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r99.mode === "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r99.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r99.submitted && !class_r100.girlsStrength);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r99.mode === "view");
  }
}
function SchoolAddEditComponent_div_110_ng_container_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "p", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](4, "div", 90)(5, "table", 91)(6, "tr", 32)(7, "th", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](10, "th", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](12, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](13, SchoolAddEditComponent_div_110_ng_container_14_span_13_Template, 2, 0, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](14, "th", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](16, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](17, SchoolAddEditComponent_div_110_ng_container_14_span_17_Template, 2, 0, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](19, SchoolAddEditComponent_div_110_ng_container_14_tr_19_Template, 12, 8, "tr", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const board_r89 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]().$implicit;
    const ctx_r95 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 7, "Class Details"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](9, 9, "Standard"));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](12, 11, "Boys"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r95.mode != "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](16, 13, "Girls"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r95.mode != "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", board_r89.classDetails);
  }
}
function SchoolAddEditComponent_div_110_div_15_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r136 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_div_110_div_15_button_1_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r136);
      const i_r90 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](2).index;
      const ctx_r134 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r134.removeBoard(i_r90));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "img", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 1, "Delete"));
  }
}
function SchoolAddEditComponent_div_110_div_15_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r138 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_div_110_div_15_button_2_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r138);
      const ctx_r137 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r137.createBoard());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "img", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 1, "Add Board/Class"));
  }
}
function SchoolAddEditComponent_div_110_div_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 98);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](1, SchoolAddEditComponent_div_110_div_15_button_1_Template, 6, 3, "button", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](2, SchoolAddEditComponent_div_110_div_15_button_2_Template, 6, 3, "button", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r139 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    const i_r90 = ctx_r139.index;
    const board_r89 = ctx_r139.$implicit;
    const ctx_r96 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", i_r90 !== 0 && !(board_r89 == null ? null : board_r89._id));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", i_r90 === ctx_r96.classes.length - 1);
  }
}
function SchoolAddEditComponent_div_110_Template(rf, ctx) {
  if (rf & 1) {
    const _r141 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 85)(1, "div", 86)(2, "div")(3, "app-common-dropdown", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_Template_app_common_dropdown_ngModelChange_3_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r141);
      const board_r89 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](board_r89.board = $event);
    })("valueUpdate", function SchoolAddEditComponent_div_110_Template_app_common_dropdown_valueUpdate_3_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r141);
      const i_r90 = restoredCtx.index;
      const ctx_r142 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r142.boardMediumUpdate(i_r90, "board"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](4, SchoolAddEditComponent_div_110_small_4_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](5, "div")(6, "app-common-dropdown", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_Template_app_common_dropdown_ngModelChange_6_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r141);
      const board_r89 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](board_r89.medium = $event);
    })("valueUpdate", function SchoolAddEditComponent_div_110_Template_app_common_dropdown_valueUpdate_6_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r141);
      const i_r90 = restoredCtx.index;
      const ctx_r144 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r144.boardMediumUpdate(i_r90, "medium"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](7, SchoolAddEditComponent_div_110_small_7_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](8, "div")(9, "app-common-dropdown", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_Template_app_common_dropdown_ngModelChange_9_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r141);
      const board_r89 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](board_r89.start = $event);
    })("valueUpdate", function SchoolAddEditComponent_div_110_Template_app_common_dropdown_valueUpdate_9_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r141);
      const i_r90 = restoredCtx.index;
      const ctx_r146 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r146.classRangeUpdate(i_r90, "start", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](10, SchoolAddEditComponent_div_110_small_10_Template, 3, 3, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](11, "div")(12, "app-common-dropdown", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngModelChange", function SchoolAddEditComponent_div_110_Template_app_common_dropdown_ngModelChange_12_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r141);
      const board_r89 = restoredCtx.$implicit;
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](board_r89.end = $event);
    })("valueUpdate", function SchoolAddEditComponent_div_110_Template_app_common_dropdown_valueUpdate_12_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r141);
      const i_r90 = restoredCtx.index;
      const ctx_r148 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r148.classRangeUpdate(i_r90, "end", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](13, SchoolAddEditComponent_div_110_small_13_Template, 2, 0, "small", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](14, SchoolAddEditComponent_div_110_ng_container_14_Template, 20, 15, "ng-container", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](15, SchoolAddEditComponent_div_110_div_15_Template, 3, 2, "div", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const board_r89 = ctx.$implicit;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownValues", ctx_r17.classBoardOptions)("config", ctx_r17.classBoardDropdownconfig)("ngModel", board_r89.board)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](26, _c0))("mode", ctx_r17.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r17.submitted && !board_r89.board);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownValues", ctx_r17.classMediumOptions)("config", ctx_r17.classMediumDropdownconfig)("ngModel", board_r89.medium)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](27, _c0))("mode", ctx_r17.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r17.submitted && !board_r89.medium);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownValues", ctx_r17.classOptions)("config", ctx_r17.classMinDropdownconfig)("ngModel", board_r89.start)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](28, _c0))("mode", ctx_r17.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r17.submitted && !board_r89.start);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownValues", ctx_r17.classOptions)("config", ctx_r17.classMaxDropdownconfig)("ngModel", board_r89.end)("ngModelOptions", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](29, _c0))("mode", ctx_r17.mode);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r17.submitted && !board_r89.end);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", board_r89.classDetails.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx_r17.mode !== "view");
  }
}
function SchoolAddEditComponent_button_112_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 99);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Close"), " ");
  }
}
const _c1 = function () {
  return ["admin"];
};
function SchoolAddEditComponent_button_113_Template(rf, ctx) {
  if (rf & 1) {
    const _r150 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 100);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_button_113_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r150);
      const ctx_r149 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r149.editSchoolDetails());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](1, "div", 1)(2, "span", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](5, "img", 102);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](4, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](4, 2, "Edit"));
  }
}
function SchoolAddEditComponent_button_114_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 99);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](2, 1, "Cancel"), " ");
  }
}
function SchoolAddEditComponent_button_115_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 103)(1, "div", 104)(2, "span", 101);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](5, "img", 105);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](4, _c1));
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](4, 2, "Save"));
  }
}
function SchoolAddEditComponent_app_modal_116_Template(rf, ctx) {
  if (rf & 1) {
    const _r152 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "app-modal")(1, "app-upload-popup", 106);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("fileUploaded", function SchoolAddEditComponent_app_modal_116_Template_app_upload_popup_fileUploaded_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r152);
      const ctx_r151 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r151.uploadedFile($event));
    })("upload", function SchoolAddEditComponent_app_modal_116_Template_app_upload_popup_upload_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r152);
      const ctx_r153 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r153.upload($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("allowedFileTypes", ctx_r22.uploadFileTypes);
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
    const _r155 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "app-delete-detail", 107);
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("close", function SchoolAddEditComponent_app_delete_detail_117_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵrestoreView"](_r155);
      const ctx_r154 = _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵresetView"](ctx_r154.updateFacility($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpureFunction0"](1, _c3));
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
    this.mediumDropdownOptions = [];
    this.resourceTypeDropdownOptions = [];
    this.resourceDetailsDropdownOptions = [];
    this.resourceOtherValue = [''];
    this.schoolIdError = false;
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
    this.boardDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select board',
      height: '44px',
      fieldName: 'Board',
      bindLable: 'boardName',
      bindValue: 'abbreviation',
      multi: true,
      chipValueType: 'uppercase',
      required: true
    };
    this.mediumDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select medium of instruction',
      height: '44px',
      fieldName: 'Medium of instruction',
      bindLable: 'name',
      bindValue: 'value',
      multi: true,
      required: true
    };
    this.resourceTypeDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select Type',
      height: 'auto',
      fieldName: 'Type',
      hideLabel: true,
      bindLable: 'type',
      bindValue: 'type',
      required: true,
      clearableOff: true
    };
    this.resourceTypeDarkDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Type',
      height: 'auto',
      fieldName: 'Type',
      hideLabel: true,
      bindLable: 'type',
      bindValue: 'type',
      required: true,
      clearableOff: true
    };
    this.resourceDetailsDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Select details',
      height: 'auto',
      fieldName: 'Details',
      multi: true,
      clearableOff: true,
      hideLabel: true,
      hideChips: true,
      required: true
    };
    this.classBoardOptions = [];
    this.classBoardDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Board',
      height: 'auto',
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
      height: 'auto',
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
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'Min class',
      required: true,
      clearableOff: true
    };
    this.classMaxDropdownconfig = {
      isBackground: false,
      placeHolderTxt: 'Max class',
      height: 'auto',
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
      this.mediumDropdownOptions = structuredClone(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.MEDIUMS);
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
      name: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.minLength(5)]],
      schoolId: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.minLength(11)]],
      boards: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required]],
      mediums: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required]],
      state: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required]],
      district: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required]],
      block: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required]],
      zone: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required]],
      academicYearStartDate: [this.academicYearStartDate, [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required]],
      academicYearEndDate: [this.academicYearEndDate, [_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required]],
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
        this.boardDropdownOptions = val?.data?.results;
        if (this.mode === 'edit') {
          this.boardDropdownOptions.forEach(ele => {
            if (this.schoolAddEditForm.value.boards.includes(ele.abbreviation)) {
              ele.disabled = true;
            }
          });
          this.mediumDropdownOptions = structuredClone(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.MEDIUMS);
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
        this.resourceTypeDropdownOptions = val?.data?.results;
        const otherObj = {
          type: 'Others'
        };
        this.resourceTypeDropdownOptions.push(otherObj);
        this.resourceMasterData = val?.data?.results;
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
        this.facilities.controls[i].get('details')?.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_12__.Validators.required);
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
        this.blockDropdownOptions = this.selectedDistrictObj?.blocks || [];
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
    if (this.mode === 'edit') {
      this.disableBoardFields();
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
    this.mediumDropdownconfig.chipClearableOff = true;
    this.boardDropdownconfig.chipClearableOff = true;
    this.classBoardDropdownconfig.disabled = true;
    this.classMediumDropdownconfig.disabled = true;
    this.classMinDropdownconfig.disabled = true;
    this.classMaxDropdownconfig.disabled = true;
    this.classBoardDropdownconfig.isBackground = true;
    this.classMediumDropdownconfig.isBackground = true;
    this.classMinDropdownconfig.isBackground = true;
    this.classMaxDropdownconfig.isBackground = true;
    this.disableBoardFields();
  }
  /**
   * Function to disable board fields
   */
  disableBoardFields() {
    this.mediumDropdownconfig.chipClearableOff = true;
    this.boardDropdownconfig.chipClearableOff = true;
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
    this.resourceOtherValue.push('');
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
      this.resourceOtherValue = this.resourceOtherValue.splice(index, 1);
    }
  }
  updateFacility(val) {
    this.showFacilityDeleteConfirm = false;
    if (val === 'delete') {
      this.schoolManagementService.updateFacility(this.schoolId, this.facilities.controls[this.deleteIndex].value).subscribe({
        next: res => {
          this.utilityService.handleResponse(res);
          this.facilities.removeAt(this.deleteIndex);
          this.resourceOtherValue = this.resourceOtherValue.splice(this.deleteIndex, 1);
        },
        error: err => {
          this.utilityService.handleError(err);
        }
      });
    }
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
   * Function to edit school details
   */
  editSchoolDetails() {
    this.router.navigateByUrl('/empty', {
      skipLocationChange: true
    }).then(() => {
      this.router.navigate([`/school-management/${this.schoolId}`], {
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
          this.router.navigate(['/school-management']);
        },
        error: err => {
          this.utilityService.handleError(err);
        }
      });
    } else {
      this.schoolManagementService.createSchool(data).subscribe({
        next: res => {
          this.utilityService.handleResponse(res);
          this.router.navigate(['/school-management']);
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
      return new (t || SchoolAddEditComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_school_management_service__WEBPACK_IMPORTED_MODULE_2__.SchoolManagementService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_3__.ModalService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_4__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_13__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_14__.DatePipe));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineComponent"]({
      type: SchoolAddEditComponent,
      selectors: [["app-school-add-edit"]],
      decls: 118,
      vars: 128,
      consts: [[1, "school-add-edit-wrapper", "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "content-center"], ["src", "assets/icons/back-arrow.svg", "routerLink", "/school-management", "alt", "", 1, "cursor-pointer"], [1, "ml-3", "text-2xl", "md:text-[32px]", "md:leading-[48px]", "font-bold", "text-content"], [1, "school-container", "px-4", "py-6", "md:p-8", "bg-white", "mt-6", "rounded", "border-content-30"], [1, "flex", "justify-between", "content-center"], [1, "text-content", "text-2xl", "md:text-[32px]", "md:leading-[48px]", "font-bold", "tracking-tight"], ["routerLink", "/school-management/add", 1, "hidden", "btn-primary", "h-9", 3, "click"], ["src", "assets/icons/add.svg", "alt", ""], [1, "ml-[6px]"], [1, "school-management-form", "mt-9"], [3, "formGroup", "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-6"], ["for", "school-name", 1, "form-control-label"], ["class", "text-[16px] text-error", 4, "ngIf"], ["id", "school-name", "type", "text", "autocomplete", "off", "formControlName", "name", "maxlength", "255", 1, "form-control", 3, "placeholder"], ["class", "form-control-error", 4, "ngIf"], [1, "number-type"], ["for", "school-id", 1, "form-control-label"], ["id", "school-id", "type", "text", "oninput", "this.value=this.value.replace(/(?![0-9])./gmi,'')", "autocomplete", "off", "formControlName", "schoolId", 1, "form-control", 3, "placeholder", "keypress", "keyup"], [3, "dropDownControlName", "dropDownCtrl", "dropDownValues", "config", "submitted", "mode"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6", "mt-6"], ["for", "academic-start-date", 1, "form-control-label"], ["id", "academic-start-date", "type", "date", "autocomplete", "off", "formControlName", "academicYearStartDate", 1, "form-control", 3, "min", "max", "placeholder"], ["for", "academic-end-date", 1, "form-control-label"], ["id", "academic-end-date", "type", "date", "placeholder", "Select date", "autocomplete", "off", "formControlName", "academicYearEndDate", 1, "form-control", 3, "min", "max"], [1, "mt-7"], [1, "text-lg", "font-bold", "text-content"], ["formArrayName", "holidayList"], [1, "mt-3"], ["aria-label", "holiday-list", 1, "w-full", "block", "md:table"], [1, "hidden", "md:table-header-group"], [1, "header", "font-semibold", "text-center", "text-content", "table-header", "border-b", "border-shade"], [1, "px-4", "py-3", "border", "text-sm", "text-content"], ["class", "px-4 py-3 border text-sm text-content", 4, "ngIf"], [1, "block", "md:table-row-group", "bg-white"], ["class", "block md:table-row text-gray-700 border rounded-xl md:border-0 mb-4 md:mb-0 overflow-hidden", 4, "ngFor", "ngForOf"], ["formArrayName", "facilities"], ["aria-label", "resource", 1, "w-full", "block", "md:table"], ["class", "text-lg font-bold mt-7 text-content", 4, "ngIf"], ["class", "py-6 border rounded flex items-center justify-center", 4, "ngIf"], ["class", "border rounded p-4 mb-4", 4, "ngFor", "ngForOf"], [1, "flex", "flex-col", "sm:flex-row", "justify-end", "mt-9", "gap-2"], ["class", "btn-outline-primary h-9 w-full sm:w-[74px]", "routerLink", "/school-management", "type", "button", 4, "ngIf"], ["class", "btn-primary h-9 w-full sm:w-auto", "type", "button", 3, "hasPermission", "click", 4, "ngIf"], ["class", "btn-primary h-9 w-full sm:w-auto", 3, "hasPermission", 4, "ngIf"], [4, "ngIf"], [3, "config", "close", 4, "ngIf"], [1, "text-[16px]", "text-error"], [1, "form-control-error"], [1, "block", "md:table-row", "text-gray-700", "border", "rounded-xl", "md:border-0", "mb-4", "md:mb-0", "overflow-hidden"], [3, "formGroupName"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "first:border-t-0", "md:border", "w-full", "md:w-[40%]"], [1, "md:hidden", "text-xs", "font-semibold", "text-content-60", "mb-2"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "md:border", "w-full", "md:w-[40%]"], ["class", "block md:table-cell px-4 py-4 text-sm border-t md:border w-full md:w-[20%]", 4, "ngIf"], ["type", "date", "autocomplete", "off", "formControlName", "date", 1, "form-control", "h-9", "focus:outline-none", 3, "min", "max", "placeholder", "required"], ["type", "text", "autocomplete", "off", "formControlName", "reason", 1, "form-control", "h-9", 3, "placeholder", "required"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "md:border", "w-full", "md:w-[20%]"], [1, "flex", "flex-col", "sm:flex-row", "gap-2", 3, "ngClass"], ["class", "btn-danger h-9 w-full sm:w-auto", "type", "button", 3, "click", 4, "ngIf"], ["class", "btn-primary h-9 w-full sm:w-auto", "type", "button", 3, "click", 4, "ngIf"], ["type", "button", 1, "btn-danger", "h-9", "w-full", "sm:w-auto", 3, "click"], ["src", "assets/icons/delete.svg", "alt", ""], ["type", "button", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "click"], [1, "block", "md:table-cell", "px-4", "py-4", "border-t", "first:border-t-0", "md:border", "w-full", "md:w-[40%]", "content-start"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "md:border", "w-full", "md:w-[40%]", "content-start"], ["class", "selected-items mt-2", 4, "ngIf"], ["class", "block md:table-cell px-4 py-4 text-sm border-t md:border w-full md:w-[20%] content-start", 4, "ngIf"], [3, "dropDownControlName", "dropDownCtrl", "dropDownValues", "config", "submitted", "mode", "valueChange"], ["class", "form-control h-9 mt-4", "type", "text", "autocomplete", "off", "formControlName", "otherType", 3, "placeholder", 4, "ngIf"], ["type", "text", "autocomplete", "off", "formControlName", "otherType", 1, "form-control", "h-9", "mt-4", 3, "placeholder"], [3, "hidden"], [1, "flex", "flex-col", "sm:flex-row", "gap-2"], ["type", "text", "autocomplete", "off", 1, "form-control", "h-9", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange", "keydown.enter"], ["aria-label", "Add resource detail", "type", "button", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "click"], [1, "selected-items", "mt-2"], [4, "ngFor", "ngForOf"], [1, "chip"], [1, "close-icon", 3, "click"], [1, "block", "md:table-cell", "px-4", "py-4", "text-sm", "border-t", "md:border", "w-full", "md:w-[20%]", "content-start"], [1, "text-lg", "font-bold", "mt-7", "text-content"], [1, "py-6", "border", "rounded", "flex", "items-center", "justify-center"], [1, "btn-primary", "w-full", "sm:w-auto", "flex", "items-center", "justify-center", 3, "click"], [1, "flex", "items-center", "gap-2"], [1, "border", "rounded", "p-4", "mb-4"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "xl:grid-cols-4", "gap-4", "md:gap-6", "mt-4"], [3, "dropDownValues", "config", "ngModel", "ngModelOptions", "mode", "ngModelChange", "valueUpdate"], ["class", "flex flex-col sm:flex-row gap-2 mt-4 justify-end", 4, "ngIf"], [1, "font-bold", "mt-4"], [1, "overflow-x-auto", "mt-2"], ["aria-label", "class List", 1, "w-full", "min-w-[420px]", "number-type"], [1, "border", "px-4", "py-2"], [1, "border", "px-2", "py-2"], ["class", "form-control", "disabled", "true", "type", "text", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange", 4, "ngIf"], ["class", "form-control", "type", "text", "maxlength", "3", "oninput", "this.value=this.value.replace(/[^0-9]/g, '').slice(0, 3)", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange", 4, "ngIf"], ["disabled", "true", "type", "text", 1, "form-control", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange"], ["type", "text", "maxlength", "3", "oninput", "this.value=this.value.replace(/[^0-9]/g, '').slice(0, 3)", 1, "form-control", 3, "placeholder", "ngModel", "ngModelOptions", "ngModelChange"], [1, "flex", "flex-col", "sm:flex-row", "gap-2", "mt-4", "justify-end"], ["routerLink", "/school-management", "type", "button", 1, "btn-outline-primary", "h-9", "w-full", "sm:w-[74px]"], ["type", "button", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission", "click"], [1, "mr-[6px]"], ["src", "assets/icons/edit-light.svg", "alt", ""], [1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission"], [1, "flex", "items-center", "justify-center"], ["src", "assets/icons/check.svg", "alt", ""], [3, "allowedFileTypes", "fileUploaded", "upload"], [3, "config", "close"]],
      template: function SchoolAddEditComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](6, "div", 4)(7, "div", 5)(8, "h2", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](10, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](11, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](12, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function SchoolAddEditComponent_Template_button_click_12_listener() {
            return ctx.blukUpload();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](13, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](14, "img", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](15, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](16);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](17, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](18, "div", 10)(19, "form", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("ngSubmit", function SchoolAddEditComponent_Template_form_ngSubmit_19_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](20, "div", 12)(21, "div")(22, "label", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](23);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](24, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](25, SchoolAddEditComponent_span_25_Template, 2, 0, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](26, "input", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](27, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](28, SchoolAddEditComponent_small_28_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](29, SchoolAddEditComponent_small_29_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](30, "div", 17)(31, "label", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](32);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](33, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](34, SchoolAddEditComponent_span_34_Template, 2, 0, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](35, "input", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("keypress", function SchoolAddEditComponent_Template_input_keypress_35_listener($event) {
            return ctx.checkLimit($event);
          })("keyup", function SchoolAddEditComponent_Template_input_keyup_35_listener() {
            return ctx.updateError();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](36, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](37, SchoolAddEditComponent_small_37_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](38, SchoolAddEditComponent_small_38_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](39, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](40, "app-form-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](41, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](42, "app-form-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](43, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](44, "app-form-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](45, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](46, "app-form-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](47, "div", 21)(48, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](49, "app-form-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](50, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](51, "app-form-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](52, "div")(53, "label", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](54);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](55, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](56, SchoolAddEditComponent_span_56_Template, 2, 0, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](57, "input", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](58, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](59, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](60, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](61, SchoolAddEditComponent_small_61_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](62, "div")(63, "label", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](64);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](65, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](66, SchoolAddEditComponent_span_66_Template, 2, 0, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelement"](67, "input", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](68, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](69, "date");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](70, SchoolAddEditComponent_small_70_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](71, SchoolAddEditComponent_small_71_Template, 3, 3, "small", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](72, "div", 26)(73, "p", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](74);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](75, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](76, 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](77, "div", 29)(78, "table", 30)(79, "thead", 31)(80, "tr", 32)(81, "th", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](82);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](83, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](84, "th", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](85);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](86, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](87, SchoolAddEditComponent_th_87_Template, 3, 3, "th", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](88, "tbody", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](89, SchoolAddEditComponent_tr_89_Template, 15, 12, "tr", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](90, "div", 26)(91, "p", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](92);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](93, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerStart"](94, 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](95, "div", 29)(96, "table", 38)(97, "thead", 31)(98, "tr", 32)(99, "th", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](100);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](101, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](102, "th", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](103);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](104, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](105, SchoolAddEditComponent_th_105_Template, 3, 3, "th", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](106, "tbody", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](107, SchoolAddEditComponent_tr_107_Template, 16, 13, "tr", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementContainerEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](108, SchoolAddEditComponent_p_108_Template, 3, 3, "p", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](109, SchoolAddEditComponent_div_109_Template, 6, 0, "div", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](110, SchoolAddEditComponent_div_110_Template, 16, 30, "div", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](111, "div", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](112, SchoolAddEditComponent_button_112_Template, 3, 3, "button", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](113, SchoolAddEditComponent_button_113_Template, 6, 5, "button", 44);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](114, SchoolAddEditComponent_button_114_Template, 3, 3, "button", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](115, SchoolAddEditComponent_button_115_Template, 6, 5, "button", 45);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](116, SchoolAddEditComponent_app_modal_116_Template, 2, 1, "app-modal", 46);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtemplate"](117, SchoolAddEditComponent_app_delete_detail_117_Template, 1, 2, "app-delete-detail", 47);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](5, 82, "School Management"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate2"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](10, 84, ctx.mode === "view" ? "View" : ctx.mode === "edit" ? "Edit" : "Add"), " ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](11, 86, "School Profile"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](17, 88, "Bulk Upload"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("formGroup", ctx.schoolAddEditForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](24, 90, "Name"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](27, 92, "Enter name"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["name"].errors == null ? null : ctx.f["name"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["name"].errors == null ? null : ctx.f["name"].errors["minlength"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](33, 94, "DISE Code"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](36, 96, "Enter DISE Code"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["schoolId"].errors == null ? null : ctx.f["schoolId"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.submitted && !(ctx.f["schoolId"].errors == null ? null : ctx.f["schoolId"].errors["required"]) && ctx.schoolIdError);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownControlName", "state")("dropDownCtrl", ctx.convertToFormControl(ctx.f["state"]))("dropDownValues", ctx.stateDropdownOptions)("config", ctx.stateDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownControlName", "zone")("dropDownCtrl", ctx.convertToFormControl(ctx.f["zone"]))("dropDownValues", ctx.zoneDropdownOptions)("config", ctx.zoneDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownControlName", "district")("dropDownCtrl", ctx.convertToFormControl(ctx.f["district"]))("dropDownValues", ctx.districtDropdownOptions)("config", ctx.districtDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownControlName", "block")("dropDownCtrl", ctx.convertToFormControl(ctx.f["block"]))("dropDownValues", ctx.blockDropdownOptions)("config", ctx.blockDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownControlName", "boards")("dropDownCtrl", ctx.convertToFormControl(ctx.f["boards"]))("dropDownValues", ctx.boardDropdownOptions)("config", ctx.boardDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("dropDownControlName", "mediums")("dropDownCtrl", ctx.convertToFormControl(ctx.f["mediums"]))("dropDownValues", ctx.mediumDropdownOptions)("config", ctx.mediumDropdownconfig)("submitted", ctx.submitted)("mode", ctx.mode);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](55, 98, "Academic year start date"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](60, 106, "Select date"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("min", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](58, 100, ctx.minMaxDateValues.currentYearMin, "yyyy-MM-dd"))("max", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](59, 103, ctx.minMaxDateValues.currentYearMax, "yyyy-MM-dd"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["academicYearStartDate"].errors == null ? null : ctx.f["academicYearStartDate"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](65, 108, "Academic year end date"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("min", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](68, 110, ctx.minMaxDateValues.nextYearMin, "yyyy-MM-dd"))("max", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind2"](69, 113, ctx.minMaxDateValues.nextYearMax, "yyyy-MM-dd"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["academicYearEndDate"].errors == null ? null : ctx.f["academicYearEndDate"].errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.schoolAddEditForm.errors == null ? null : ctx.schoolAddEditForm.errors["lessThanStart"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](75, 116, "Holiday List"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](83, 118, "Date"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](86, 120, "Reason"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", ctx.holidayList.controls);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](93, 122, "Resources"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](101, 124, "Resource Type"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](104, 126, "Resource details"));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", ctx.facilities.controls);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", !(ctx.mode === "view" && ctx.classes.length === 0));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.classes.length === 0 && ctx.mode === "edit");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngForOf", ctx.classes);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode === "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode === "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.modalService.showBlukUploadDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵproperty"]("ngIf", ctx.showFacilityDeleteConfirm);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_14__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_14__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_13__.RouterLink, _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_5__.CommonDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_12__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_12__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.RequiredValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormArrayName, _shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_6__.FormDropdownComponent, _shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_7__.ModalComponent, _shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_8__.UploadPopupComponent, _core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_9__.HasPermissionDirective, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_10__.DeleteDetailComponent, _angular_common__WEBPACK_IMPORTED_MODULE_14__.DatePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_15__.TranslatePipe],
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
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs */ 52575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! rxjs */ 91817);
/* harmony import */ var src_app_shared_utility_action_menu_controller_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/action-menu-controller.util */ 37348);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _school_management_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../school-management.service */ 69700);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/modal/modal.service */ 51133);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/services/master.service */ 2216);
/* harmony import */ var _user_management_user_management_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../user-management/user-management.service */ 58640);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../../../shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../../shared/components/modal/modal.component */ 69081);
/* harmony import */ var _shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../../../shared/components/disable-popup/disable-popup.component */ 51541);
/* harmony import */ var _shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../../../shared/components/upload-popup/upload-popup.component */ 86487);
/* harmony import */ var _core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../../../../core/directives/has-permission.directive */ 87944);
/* harmony import */ var _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../../../../shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var _shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../../../../shared/components/upload-error-popup/upload-error-popup.component */ 12321);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @ngx-translate/core */ 90852);




















const _c0 = ["zoneDropdown"];
const _c1 = ["districtDropdown"];
const _c2 = ["blockDropdown"];
const _c3 = ["schoolDropdown"];
function SchoolListComponent_button_29_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_button_29_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r14);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r13.exportSchoolList());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](1, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](2, "img", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](3, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("disabled", !ctx_r0.schoolListData.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](5, 2, "Export"));
  }
}
const _c4 = function () {
  return ["admin"];
};
function SchoolListComponent_div_46_ul_11_li_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "li", 62)(1, "a", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_div_46_ul_11_li_15_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r22);
      const schoolData_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2).$implicit;
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r20.openModalForDeleteConfirm(schoolData_r15));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](3, "img", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction0"](4, _c4));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](6, 2, "Disable School"));
  }
}
function SchoolListComponent_div_46_ul_11_li_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r25 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "li", 66)(1, "a", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_div_46_ul_11_li_16_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r25);
      const schoolData_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2).$implicit;
      const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r23.activateSchool(schoolData_r15._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](3, "img", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](6, 1, "Activate School"));
  }
}
function SchoolListComponent_div_46_ul_11_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "ul", 53)(1, "li", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_div_46_ul_11_Template_li_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r28);
      const schoolData_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r26.viewSchool(schoolData_r15._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "a", 55)(3, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](4, "img", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "li", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_div_46_ul_11_Template_li_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r28);
      const schoolData_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r29.editSchool(schoolData_r15._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](9, "a", 55)(10, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](11, "img", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](12, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](14, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](15, SchoolListComponent_div_46_ul_11_li_15_Template, 7, 5, "li", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](16, SchoolListComponent_div_46_ul_11_li_16_Template, 7, 3, "li", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const schoolData_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](7, 5, "View School"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction0"](9, _c4));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](14, 7, "Edit School"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", !schoolData_r15.isDeleted);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", schoolData_r15.isDeleted);
  }
}
const _c5 = function (a0, a1) {
  return {
    "text-green bg-success-50": a0,
    "text-error bg-error-50": a1
  };
};
function SchoolListComponent_div_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "div", 39)(1, "div", 40)(2, "div", 41)(3, "p", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](6, "p", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "div", 44)(9, "button", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_div_46_Template_button_click_9_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r33);
      const i_r16 = restoredCtx.index;
      const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r32.actionMenu.toggleMobileMenu(i_r16, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](10, "img", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](11, SchoolListComponent_div_46_ul_11_Template, 17, 10, "ul", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](12, "div", 48)(13, "div")(14, "p", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](16, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](17, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](19, "div", 50)(20, "div")(21, "p", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](22);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](23, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](24, "p", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](25);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](26, "div")(27, "p", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](28);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](29, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](30, "p", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](31);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](32, "div")(33, "p", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](34);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](35, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](36, "p", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](37);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](38, "div")(39, "p", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](40);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](41, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](42, "span", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](43);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()()();
  }
  if (rf & 2) {
    const schoolData_r15 = ctx.$implicit;
    const i_r16 = ctx.index;
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](5, 14, "DISE Code"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r15 == null ? null : schoolData_r15.schoolId);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r5.actionMenu.openStates[i_r16]);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](16, 16, "School Name"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r15.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](23, 18, "District"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r15.district || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](29, 20, "Taluk"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r15.block || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](35, 22, "Zone"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r15.zone || "-");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](41, 24, "Status"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction2"](26, _c5, !schoolData_r15.isDeleted, schoolData_r15.isDeleted));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate1"](" ", !schoolData_r15.isDeleted ? "Active" : "Inactive", " ");
  }
}
function SchoolListComponent_div_47_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "div", 69);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](2, 1, "No Data Found"), " ");
  }
}
function SchoolListComponent_th_52_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "th", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const listHeader_r34 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](2, 1, listHeader_r34), " ");
  }
}
function SchoolListComponent_tr_54_ul_24_li_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "li", 62)(1, "a", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_tr_54_ul_24_li_15_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r42);
      const schoolData_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2).$implicit;
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r40.openModalForDeleteConfirm(schoolData_r35));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](3, "img", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction0"](4, _c4));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](6, 2, "Disable School"));
  }
}
function SchoolListComponent_tr_54_ul_24_li_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r45 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "li", 66)(1, "a", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_tr_54_ul_24_li_16_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r45);
      const schoolData_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"](2).$implicit;
      const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r43.activateSchool(schoolData_r35._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](3, "img", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "span", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](6, 1, "Activate School"));
  }
}
function SchoolListComponent_tr_54_ul_24_Template(rf, ctx) {
  if (rf & 1) {
    const _r48 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "ul", 81)(1, "li", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_tr_54_ul_24_Template_li_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r48);
      const schoolData_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r46.viewSchool(schoolData_r35._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](2, "a", 55)(3, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](4, "img", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](8, "li", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_tr_54_ul_24_Template_li_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r48);
      const schoolData_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]().$implicit;
      const ctx_r49 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r49.editSchool(schoolData_r35._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](9, "a", 55)(10, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](11, "img", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](12, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](13);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](14, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](15, SchoolListComponent_tr_54_ul_24_li_15_Template, 7, 5, "li", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](16, SchoolListComponent_tr_54_ul_24_li_16_Template, 7, 3, "li", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    const i_r36 = ctx_r51.index;
    const schoolData_r35 = ctx_r51.$implicit;
    const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngStyle", ctx_r37.actionMenu.desktopPositions[i_r36]);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](7, 6, "View School"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction0"](10, _c4));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](14, 8, "Edit School"));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", !schoolData_r35.isDeleted);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", schoolData_r35.isDeleted);
  }
}
function SchoolListComponent_tr_54_Template(rf, ctx) {
  if (rf & 1) {
    const _r53 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "tr", 71)(1, "td", 72)(2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](4, "td", 73)(5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](7, "td", 72)(8, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](10, "td", 72)(11, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](12);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](13, "td", 72)(14, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](15);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](16, "td", 74)(17, "span", 75);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](18);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](19, "td", 76)(20, "div", 77)(21, "div", 78);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_tr_54_Template_div_click_21_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r53);
      const i_r36 = restoredCtx.index;
      const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r52.actionMenu.toggleDesktopMenu(i_r36, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](22, "button", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](23, "img", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](24, SchoolListComponent_tr_54_ul_24_Template, 17, 11, "ul", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const schoolData_r35 = ctx.$implicit;
    const i_r36 = ctx.index;
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r35 == null ? null : schoolData_r35.schoolId);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r35.name);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r35.district);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r35.block);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](schoolData_r35.zone);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction2"](10, _c5, !schoolData_r35.isDeleted, schoolData_r35.isDeleted));
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](!schoolData_r35.isDeleted ? "Active" : "Inactive");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵclassProp"]("open", ctx_r8.actionMenu.openStates[i_r36]);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx_r8.actionMenu.openStates[i_r36]);
  }
}
function SchoolListComponent_tr_55_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "tr")(1, "td", 82);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](3, 1, "No Data Found"));
  }
}
function SchoolListComponent_app_modal_56_Template(rf, ctx) {
  if (rf & 1) {
    const _r55 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "app-modal")(1, "app-disable-popup", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("sendDetails", function SchoolListComponent_app_modal_56_Template_app_disable_popup_sendDetails_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r55);
      const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r54.onDisableSchool($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("modalHeader", "Disable School")("modalSubHeader", "Are you sure you want to disable this School?")("tableData", ctx_r10.tableData)("users_of_school", ctx_r10.users_of_school);
  }
}
function SchoolListComponent_app_modal_57_Template(rf, ctx) {
  if (rf & 1) {
    const _r57 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "app-modal")(1, "app-upload-popup", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("fileUploaded", function SchoolListComponent_app_modal_57_Template_app_upload_popup_fileUploaded_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r57);
      const ctx_r56 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r56.uploadedFile($event));
    })("upload", function SchoolListComponent_app_modal_57_Template_app_upload_popup_upload_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵrestoreView"](_r57);
      const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵresetView"](ctx_r58.upload($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("allowedFileTypes", ctx_r11.uploadFileTypes);
  }
}
function SchoolListComponent_app_modal_58_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "app-modal");
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](1, "app-upload-error-popup", 85);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("modalHeader", "Upload Error")("errorUrl", ctx_r12.errorUrl);
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
      height: 'auto',
      bindLabel: 'state',
      bindValue: 'state',
      labelTxt: 'State'
    };
    this.districtDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'District',
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'District'
    };
    this.blockDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Taluk',
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'Taluk'
    };
    this.zoneDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Zone',
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'name',
      labelTxt: 'Zone'
    };
    this.schoolDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'School',
      height: 'auto',
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
    this.searchTerms = new rxjs__WEBPACK_IMPORTED_MODULE_15__.Subject();
    this.filterObj = {
      district: '',
      zone: '',
      block: '',
      _id: '',
      search: ''
    };
    this.states = [];
    this.valAssigned = false;
  }
  /**
   * OnInit lifecycle hook for initialization
   */
  ngOnInit() {
    this.getRegionsData();
    const loggedInUser = this.utilityService.loggedInUserData;
    if (loggedInUser && loggedInUser.role.includes('manager')) {
      if (loggedInUser.state) {
        this.filterObj.state = loggedInUser.state;
      }
      if (loggedInUser.zones && loggedInUser.zones.length > 0) {
        this.filterObj.zone = loggedInUser.zones;
      }
      if (loggedInUser.districts && loggedInUser.districts.length > 0) {
        this.filterObj.district = loggedInUser.districts;
      }
      // Only show manager's zones in dropdown
      setTimeout(() => this.setZoneDropdownOptionsForManager(), 0);
      this.getShcoolList(this.filterObj);
    } else {
      this.getShcoolList();
    }
    this.searchSubscription = this.searchTerms.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_16__.debounceTime)(1000), (0,rxjs__WEBPACK_IMPORTED_MODULE_17__.distinctUntilChanged)()).subscribe(() => {
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
      this.districtDropdownOptions = this.selectedZoneObj.districts;
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
      this.blockDropdownOptions = this.selectedDistrictObj.blocks;
    }
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
    this.router.navigate([`/school-management/${id}`], {
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
    this.router.navigate([`/school-management/${id}`], {
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
      this.schoolDropdownOptions = res?.data?.results;
    });
  }
  setZoneDropdownOptionsForManager() {
    const loggedInUser = this.utilityService.loggedInUserData;
    if (loggedInUser && loggedInUser.zones && this.regionsData) {
      // Find the state object
      const stateObj = this.regionsData.find(state => state.state === loggedInUser.state);
      if (stateObj) {
        // Only include zones assigned to the manager
        this.zoneDropdownOptions = stateObj.zones.filter(zone => loggedInUser.zones.includes(zone.name));
      }
    }
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
      return new (t || SchoolListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdirectiveInject"](_school_management_service__WEBPACK_IMPORTED_MODULE_2__.SchoolManagementService), _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_18__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdirectiveInject"](src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_3__.ModalService), _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_4__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdirectiveInject"](src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_5__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdirectiveInject"](_user_management_user_management_service__WEBPACK_IMPORTED_MODULE_6__.UserManagementService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵdefineComponent"]({
      type: SchoolListComponent,
      selectors: [["app-school-list"]],
      viewQuery: function SchoolListComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵviewQuery"](_c0, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵviewQuery"](_c1, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵviewQuery"](_c2, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵviewQuery"](_c3, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵloadQuery"]()) && (ctx.zoneDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵloadQuery"]()) && (ctx.districtDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵloadQuery"]()) && (ctx.blockDropdown = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵloadQuery"]()) && (ctx.schoolDropdown = _t.first);
        }
      },
      hostBindings: function SchoolListComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_click_HostBindingHandler($event) {
            return ctx.clickInside($event);
          });
        }
      },
      decls: 60,
      vars: 42,
      consts: [[1, "school-list-wrapper", "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "content-center"], [1, "text-2xl", "md:text-[30px]", "md:leading-[48px]", "font-bold", "text-content"], [1, "school-list-container", "px-4", "py-6", "md:px-6", "md:py-8", "bg-white", "mt-6", "border", "rounded"], [1, "flex", "flex-col", "gap-4", "sm:gap-5", "sm:flex-row", "sm:justify-between", "sm:items-start"], [1, "text-content", "text-2xl", "md:text-[30px]", "md:leading-[48px]", "font-bold"], [1, "buttons", "w-full", "sm:w-auto", "flex", "flex-col", "sm:flex-row", "gap-2", "sm:items-center"], [1, "w-full", "sm:w-auto"], [1, "search-icon", "min-w-0", "flex", "items-center", "h-9", "w-full", "sm:w-[300px]"], ["src", "assets/icons/search.svg", "alt", "", 1, "mr-2"], ["type", "text", 1, "appearance-none", "border", "border-content-50", "rounded", "py-2", "px-3", "text-content", "leading-tight", "focus:outline-none", "bg-surface-muted", "h-full", "w-full", 3, "placeholder", "ngModel", "ngModelChange", "input"], [1, "action-btn", "flex", "flex-col", "sm:flex-row", "sm:flex-wrap", "gap-2"], [1, "btn-outline-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission", "click"], [1, "flex", "items-center", "justify-center", "gap-2"], ["src", "assets/icons/upload.svg", "alt", ""], [1, "text-nowrap"], ["routerLink", "/school-management/add", 1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission"], ["src", "assets/icons/add.svg", "alt", ""], ["class", "btn-primary h-9 w-full sm:w-auto", 3, "disabled", "click", 4, "ngIf"], [1, "mt-7", "grid", "gap-3", "grid-cols-1", "sm:grid-cols-2", "xl:grid-cols-5", "mb-2", "md:mb-4"], [1, "w-full", "min-w-0"], [3, "dropDownValues", "config", "valueUpdate"], ["zoneDropdown", ""], ["districtDropdown", ""], ["blockDropdown", ""], ["schoolDropdown", ""], [1, "space-y-4", "md:hidden"], ["class", "rounded-xl border p-4 bg-white shadow-sm", 4, "ngFor", "ngForOf"], ["class", "text-center text-content-60 py-4 border rounded-xl", 4, "ngIf"], [1, "hidden", "md:block", "w-full", "overflow-x-auto"], ["aria-label", "school-list", 1, "table-auto", "min-w-[900px]", "w-full", "border", "mt-3", "rounded-lg"], [1, "header", "font-semibold", "text-left", "text-content", "table-header", "border-b", "border-shade"], ["class", "px-4 py-6 border text-sm", 4, "ngFor", "ngForOf"], [1, "bg-white"], ["class", "text-gray-700", 4, "ngFor", "ngForOf"], [4, "ngIf"], [3, "totalItems", "pageSize", "currentPage", "pageChange"], [1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "disabled", "click"], ["src", "assets/icons/upload_light.svg", "alt", ""], [1, "rounded-xl", "border", "p-4", "bg-white", "shadow-sm"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "min-w-0"], [1, "text-xs", "text-content-60"], [1, "font-semibold", "break-all"], [1, "relative", "shrink-0"], [1, "py-1", "px-2", "rounded", "inline-flex", "items-center", 3, "click"], ["src", "assets/icons/more_vert.svg", "alt", "", 1, "w-5"], ["class", "absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50", "role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 4, "ngIf"], [1, "mt-4", "space-y-3", "text-sm"], [1, "font-semibold", "break-words"], [1, "grid", "grid-cols-2", "gap-3"], [1, "break-words"], [1, "inline-flex", "px-3", "py-0.5", "sm:py-1", "rounded-full", "text-sm", 3, "ngClass"], ["role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 1, "absolute", "right-0", "top-full", "mt-1", "w-48", "rounded-md", "shadow-lg", "bg-white", "ring-1", "ring-black", "ring-opacity-5", "focus:outline-none", "z-50"], [1, "h-10", "mt-2", "hover:bg-shade-80", "cursor-pointer", 3, "click"], ["role", "menuitem", 1, "block", "px-4", "py-2", "text-sm", "text-content"], [1, "flex", "items-center"], ["src", "assets/icons/Visibility.svg", "alt", "", 1, "ms-2", "me-3"], [1, "h-10", "hover:bg-shade-80", "cursor-pointer", 3, "hasPermission", "click"], ["src", "assets/icons/Vector.svg", "alt", "", 1, "ms-2", "me-3"], ["class", "h-10 mb-2 hover:bg-shade-80 cursor-pointer", 3, "hasPermission", 4, "ngIf"], ["class", "h-10 mb-2 hover:bg-shade-80 cursor-pointer", 4, "ngIf"], [1, "h-10", "mb-2", "hover:bg-shade-80", "cursor-pointer", 3, "hasPermission"], ["role", "menuitem", 1, "block", "px-4", "py-2", "text-sm", "text-content", 3, "click"], ["src", "assets/icons/Vector (2).svg", "alt", "", 1, "mx-2"], [1, "text-error"], [1, "h-10", "mb-2", "hover:bg-shade-80", "cursor-pointer"], ["src", "assets/icons/switch-on.svg", "alt", "", 1, "mx-2", "w-7"], [1, "text-success"], [1, "text-center", "text-content-60", "py-4", "border", "rounded-xl"], [1, "px-4", "py-6", "border", "text-sm"], [1, "text-gray-700"], [1, "px-4", "py-6", "text-sm", "border"], [1, "px-4", "py-6", "text-sm", "border", "max-w-[16rem]", "break-words"], [1, "p-4", "text-sm", "border"], [1, "px-3", "py-2", "rounded-full", 3, "ngClass"], [1, "px-4", "py-6", "text-sm", "border", "relative"], [1, "flex", "justify-center"], [3, "click"], [1, "py-2", "px-4", "rounded", "inline-flex", "items-center"], ["class", "fixed w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50", "role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 3, "ngStyle", 4, "ngIf"], ["role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 1, "fixed", "w-48", "rounded-md", "shadow-lg", "bg-white", "ring-1", "ring-black", "ring-opacity-5", "focus:outline-none", "z-50", 3, "ngStyle"], ["colspan", "7", 1, "text-center", "text-content-60", "py-2"], [3, "modalHeader", "modalSubHeader", "tableData", "users_of_school", "sendDetails"], ["context", "school-management", 3, "allowedFileTypes", "fileUploaded", "upload"], [3, "modalHeader", "errorUrl"]],
      template: function SchoolListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](5, "div", 3)(6, "div", 4)(7, "p", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](9, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](10, "div", 6)(11, "div", 7)(12, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](13, "img", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](14, "input", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("ngModelChange", function SchoolListComponent_Template_input_ngModelChange_14_listener($event) {
            return ctx.searchText = $event;
          })("input", function SchoolListComponent_Template_input_input_14_listener($event) {
            return ctx.searchInputChanged($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](15, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](16, "div", 11)(17, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("click", function SchoolListComponent_Template_button_click_17_listener() {
            return ctx.blukUpload();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](18, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](19, "img", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](20, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](21);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](22, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](23, "button", 16)(24, "div", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelement"](25, "img", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](26, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtext"](27);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipe"](28, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](29, SchoolListComponent_button_29_Template, 6, 4, "button", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](30, "div", 19)(31, "div", 20)(32, "app-common-dropdown", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_common_dropdown_valueUpdate_32_listener($event) {
            return ctx.onFilterChange("state", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](33, "div", 20)(34, "app-common-dropdown", 21, 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_common_dropdown_valueUpdate_34_listener($event) {
            return ctx.onFilterChange("zone", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](36, "div", 20)(37, "app-common-dropdown", 21, 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_common_dropdown_valueUpdate_37_listener($event) {
            return ctx.onFilterChange("district", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](39, "div", 20)(40, "app-common-dropdown", 21, 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_common_dropdown_valueUpdate_40_listener($event) {
            return ctx.onFilterChange("block", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](42, "div", 20)(43, "app-common-dropdown", 21, 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("valueUpdate", function SchoolListComponent_Template_app_common_dropdown_valueUpdate_43_listener($event) {
            return ctx.onFilterChange("_id", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](45, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](46, SchoolListComponent_div_46_Template, 44, 29, "div", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](47, SchoolListComponent_div_47_Template, 3, 3, "div", 28);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](48, "div", 29)(49, "table", 30)(50, "thead")(51, "tr", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](52, SchoolListComponent_th_52_Template, 3, 3, "th", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](53, "tbody", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](54, SchoolListComponent_tr_54_Template, 25, 13, "tr", 34);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](55, SchoolListComponent_tr_55_Template, 4, 3, "tr", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](56, SchoolListComponent_app_modal_56_Template, 2, 4, "app-modal", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](57, SchoolListComponent_app_modal_57_Template, 2, 1, "app-modal", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtemplate"](58, SchoolListComponent_app_modal_58_Template, 2, 2, "app-modal", 35);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementStart"](59, "app-pagination", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵlistener"]("pageChange", function SchoolListComponent_Template_app_pagination_pageChange_59_listener($event) {
            return ctx.onPageChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](4, 30, "School Management"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](9, 32, "School List"));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](15, 34, "Search School Name/DISE Code"));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngModel", ctx.searchText);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction0"](40, _c4));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](22, 36, "Bulk Upload"));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpureFunction0"](41, _c4));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵpipeBind1"](28, 38, "Add School"));
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.schoolListData);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("dropDownValues", ctx.stateDropdownOptions)("config", ctx.stateDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("dropDownValues", ctx.zoneDropdownOptions)("config", ctx.zoneDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("dropDownValues", ctx.districtDropdownOptions)("config", ctx.districtDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("dropDownValues", ctx.blockDropdownOptions)("config", ctx.blockDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("dropDownValues", ctx.schoolDropdownOptions)("config", ctx.schoolDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx.schoolListData);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", !ctx.schoolListData || !ctx.schoolListData.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx.schoolListTableHeaders);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngForOf", ctx.schoolListData);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", !ctx.schoolListData || !ctx.schoolListData.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.modalService.showDeleteUserDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.modalService.showBlukUploadDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("ngIf", ctx.modalService.showUploadErrorDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_14__["ɵɵproperty"]("totalItems", ctx.totalItems)("pageSize", ctx.pageSize)("currentPage", ctx.currentPage);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_19__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_19__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_19__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_19__.NgStyle, _angular_router__WEBPACK_IMPORTED_MODULE_18__.RouterLink, _shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_7__.CommonDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_20__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_20__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_20__.NgModel, _shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_8__.ModalComponent, _shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_9__.DisablePopupComponent, _shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_10__.UploadPopupComponent, _core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_11__.HasPermissionDirective, _shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_12__.PaginationComponent, _shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_13__.UploadErrorPopupComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_21__.TranslatePipe],
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
    permissions: ['admin', 'manager']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_2__.PermissionGuard]
}, {
  path: 'add',
  component: _school_add_edit_school_add_edit_component__WEBPACK_IMPORTED_MODULE_1__.SchoolAddEditComponent,
  data: {
    permissions: ['admin']
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_2__.PermissionGuard]
}, {
  path: ':id',
  component: _school_add_edit_school_add_edit_component__WEBPACK_IMPORTED_MODULE_1__.SchoolAddEditComponent,
  data: {
    permissions: ['admin', 'manager']
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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _school_management_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./school-management-routing.module */ 37234);
/* harmony import */ var _school_list_school_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./school-list/school-list.component */ 93811);
/* harmony import */ var _school_add_edit_school_add_edit_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./school-add-edit/school-add-edit.component */ 3851);
/* harmony import */ var src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! src/app/shared/components/form-dropdown/form-dropdown.component */ 55233);
/* harmony import */ var src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/modal/modal.component */ 69081);
/* harmony import */ var src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/components/disable-popup/disable-popup.component */ 51541);
/* harmony import */ var src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/shared/components/upload-popup/upload-popup.component */ 86487);
/* harmony import */ var src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! src/app/core/directives/has-permission.directive */ 87944);
/* harmony import */ var src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! src/app/shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var src_app_shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! src/app/shared/components/upload-error-popup/upload-error-popup.component */ 12321);
/* harmony import */ var src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! src/app/shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/core */ 37580);
















class SchoolManagementModule {
  static {
    this.ɵfac = function SchoolManagementModule_Factory(t) {
      return new (t || SchoolManagementModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineNgModule"]({
      type: SchoolManagementModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵdefineInjector"]({
      providers: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.DatePipe],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.CommonModule, _school_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.SchoolManagementRoutingModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.CommonDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.ReactiveFormsModule, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.FormDropdownComponent, src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_5__.ModalComponent, src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_6__.DisablePopupComponent, src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_7__.UploadPopupComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_9__.PaginationComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_15__.TranslateModule, src_app_shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_10__.UploadErrorPopupComponent, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_11__.DeleteDetailComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_12__["ɵɵsetNgModuleScope"](SchoolManagementModule, {
    declarations: [_school_list_school_list_component__WEBPACK_IMPORTED_MODULE_1__.SchoolListComponent, _school_add_edit_school_add_edit_component__WEBPACK_IMPORTED_MODULE_2__.SchoolAddEditComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.CommonModule, _school_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.SchoolManagementRoutingModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.CommonDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_14__.ReactiveFormsModule, src_app_shared_components_form_dropdown_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.FormDropdownComponent, src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_5__.ModalComponent, src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_6__.DisablePopupComponent, src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_7__.UploadPopupComponent, src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_8__.HasPermissionDirective, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_9__.PaginationComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_15__.TranslateModule, src_app_shared_components_upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_10__.UploadErrorPopupComponent, src_app_shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_11__.DeleteDetailComponent]
  });
})();

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_school-management_school-management_module_ts.8dd82cf159f6bdb3.js.map