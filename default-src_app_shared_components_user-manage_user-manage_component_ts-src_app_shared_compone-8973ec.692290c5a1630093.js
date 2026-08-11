"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["default-src_app_shared_components_user-manage_user-manage_component_ts-src_app_shared_compone-8973ec"],{

/***/ 30293:
/*!************************************************************************!*\
  !*** ./src/app/shared/components/user-manage/user-manage.component.ts ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserManageComponent: () => (/* binding */ UserManageComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _utility_scope_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utility/scope.util */ 56215);
/* harmony import */ var _dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dropdown/dropdown.component */ 62157);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _services_staff_user_common_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/staff-user-common.service */ 80798);













function UserManageComponent_span_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function UserManageComponent_small_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 1, ctx_r1.entity + " Name is required"), ".");
  }
}
function UserManageComponent_small_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 1, ctx_r2.entity + " Name is too short"), ".");
  }
}
function UserManageComponent_span_26_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function UserManageComponent_small_29_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 1, "Mobile Number is required"), ".");
  }
}
function UserManageComponent_small_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 1, "Phone number required should be 10 digits"));
  }
}
function UserManageComponent_small_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 1, "Invalid phone number"));
  }
}
function UserManageComponent_ng_container_32_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function UserManageComponent_ng_container_32_small_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 1, "Email is required"));
  }
}
function UserManageComponent_ng_container_32_small_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 1, "Enter valid email"), ".");
  }
}
function UserManageComponent_ng_container_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](1, "div")(2, "label", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, UserManageComponent_ng_container_32_span_5_Template, 2, 0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](6, "input", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](8, UserManageComponent_ng_container_32_small_8_Template, 3, 3, "small", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](9, UserManageComponent_ng_container_32_small_9_Template, 3, 3, "small", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](10, "app-dropdown", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    let tmp_3_0;
    let tmp_4_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 10, "Email"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r7.mode !== "view");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](7, 12, "Enter Email"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r7.submitted && ((tmp_3_0 = ctx_r7.form.get("email")) == null ? null : tmp_3_0.errors == null ? null : tmp_3_0.errors["required"]));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r7.submitted && ((tmp_4_0 = ctx_r7.form.get("email")) == null ? null : tmp_4_0.errors == null ? null : tmp_4_0.errors["email"]));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("mode", ctx_r7.mode)("dropDownCtrl", ctx_r7.form.get("state"))("dropDownValues", ctx_r7.profileRegions)("config", ctx_r7.profileStateConfig)("submitted", ctx_r7.submitted);
  }
}
function UserManageComponent_span_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
}
function UserManageComponent_div_38_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UserManageComponent_div_38_button_4_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r22);
      const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().index;
      const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r20.removeAssignment(i_r16));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](3, "img", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("title", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](1, 3, "Remove role"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](2, 5, "Remove role"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("alt", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 7, "Remove role"));
  }
}
function UserManageComponent_div_38_div_5_app_dropdown_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r29 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "app-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("valueUpdate", function UserManageComponent_div_38_div_5_app_dropdown_2_Template_app_dropdown_valueUpdate_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r29);
      const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).index;
      const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r27.zoneChanged(i_r16, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).index;
    const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("mode", ctx_r23.mode)("dropDownCtrl", ctx_r23.scopes[i_r16].zone)("dropDownValues", ctx_r23.scopes[i_r16].zones)("config", ctx_r23.zoneConfig)("submitted", ctx_r23.submitted);
  }
}
function UserManageComponent_div_38_div_5_app_dropdown_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r33 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "app-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("valueUpdate", function UserManageComponent_div_38_div_5_app_dropdown_3_Template_app_dropdown_valueUpdate_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r33);
      const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).index;
      const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r31.districtChanged(i_r16, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).index;
    const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("mode", ctx_r24.mode)("dropDownCtrl", ctx_r24.scopes[i_r16].district)("dropDownValues", ctx_r24.scopes[i_r16].districts)("config", ctx_r24.districtConfig)("submitted", ctx_r24.submitted);
  }
}
function UserManageComponent_div_38_div_5_app_dropdown_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r37 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "app-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("valueUpdate", function UserManageComponent_div_38_div_5_app_dropdown_4_Template_app_dropdown_valueUpdate_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r37);
      const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).index;
      const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r35.blockChanged(i_r16, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2).index;
    const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("mode", ctx_r25.mode)("dropDownCtrl", ctx_r25.scopes[i_r16].block)("dropDownValues", ctx_r25.scopes[i_r16].blocks)("config", ctx_r25.blockConfig)("submitted", ctx_r25.submitted);
  }
}
function UserManageComponent_div_38_div_5_app_dropdown_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](0, "app-dropdown", 21);
  }
  if (rf & 2) {
    const ctx_r39 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
    const assignment_r15 = ctx_r39.$implicit;
    const i_r16 = ctx_r39.index;
    const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("mode", ctx_r26.mode)("dropDownCtrl", assignment_r15.get("dep"))("dropDownValues", ctx_r26.scopes[i_r16].schools)("config", ctx_r26.schoolConfig)("submitted", ctx_r26.submitted);
  }
}
function UserManageComponent_div_38_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 31)(1, "app-dropdown", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("valueUpdate", function UserManageComponent_div_38_div_5_Template_app_dropdown_valueUpdate_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r42);
      const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().index;
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r40.stateChanged(i_r16, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](2, UserManageComponent_div_38_div_5_app_dropdown_2_Template, 1, 5, "app-dropdown", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](3, UserManageComponent_div_38_div_5_app_dropdown_3_Template, 1, 5, "app-dropdown", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, UserManageComponent_div_38_div_5_app_dropdown_4_Template, 1, 5, "app-dropdown", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, UserManageComponent_div_38_div_5_app_dropdown_5_Template, 1, 5, "app-dropdown", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().index;
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("mode", ctx_r18.mode)("dropDownCtrl", ctx_r18.scopes[i_r16].state)("dropDownValues", ctx_r18.scopes[i_r16].states)("config", ctx_r18.stateConfig)("submitted", ctx_r18.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r18.scopeIncludes(i_r16, "ZONE"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r18.scopeIncludes(i_r16, "DISTRICT"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r18.scopeIncludes(i_r16, "BLOCK"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r18.scopeIncludes(i_r16, "SCHOOL"));
  }
}
function UserManageComponent_div_38_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 35)(1, "label", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "input", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const i_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]().index;
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 2, "Scope"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("value", ctx_r19.assignmentRole(i_r16).scopeType);
  }
}
function UserManageComponent_div_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r46 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 22)(1, "div", 23)(2, "div", 24)(3, "app-dropdown", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("valueChange", function UserManageComponent_div_38_Template_app_dropdown_valueChange_3_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r46);
      const i_r16 = restoredCtx.index;
      const ctx_r45 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r45.assignmentChanged(i_r16));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, UserManageComponent_div_38_button_4_Template, 5, 9, "button", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](5, UserManageComponent_div_38_div_5_Template, 6, 9, "div", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](6, UserManageComponent_div_38_div_6_Template, 5, 4, "div", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const assignment_r15 = ctx.$implicit;
    const i_r16 = ctx.index;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroupName", i_r16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("mode", ctx_r9.mode)("dropDownCtrl", assignment_r15.get("roleId"))("dropDownValues", ctx_r9.scopes[i_r16].roles)("config", ctx_r9.roleConfig)("submitted", ctx_r9.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r9.assignments.length > 1 && ctx_r9.mode !== "view" && ctx_r9.canAssign);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r9.scopeIncludes(i_r16, "STATE"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx_r9.assignmentRole(i_r16) && !ctx_r9.scopeIncludes(i_r16, "STATE"));
  }
}
function UserManageComponent_button_39_Template(rf, ctx) {
  if (rf & 1) {
    const _r48 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "button", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UserManageComponent_button_39_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r48);
      const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r47.addAssignment());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](1, "img", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 1, "Add Role"), " ");
  }
}
function UserManageComponent_div_40_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 39)(1, "button", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](4, "button", 41)(5, "span", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](8, "img", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", ctx_r11.listRoute);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 4, "Cancel"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx_r11.form.pristine);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](7, 6, "Save"));
  }
}
class UserManageComponent {
  constructor(fb, route, utility, router, users) {
    this.fb = fb;
    this.route = route;
    this.utility = utility;
    this.router = router;
    this.users = users;
    this.roles = [];
    this.regions = [];
    this.profileRegions = [];
    this.scopes = [];
    this.roleConfig = {
      isBackground: true,
      placeHolderTxt: 'Select role',
      fieldName: 'Role',
      bindLabel: 'name',
      bindValue: '_id',
      showDescription: true,
      required: true,
      searchable: true
    };
    this.stateConfig = {
      isBackground: true,
      placeHolderTxt: 'Select state',
      fieldName: 'State',
      bindLabel: 'state',
      bindValue: 'state',
      required: true,
      searchable: true
    };
    this.profileStateConfig = {
      isBackground: true,
      placeHolderTxt: 'Select state',
      fieldName: 'State',
      bindLabel: 'state',
      bindValue: 'state',
      searchable: true
    };
    this.zoneConfig = {
      isBackground: true,
      placeHolderTxt: 'Select zone',
      fieldName: 'Zone',
      bindLabel: 'name',
      bindValue: 'name',
      required: true,
      searchable: true
    };
    this.districtConfig = {
      isBackground: true,
      placeHolderTxt: 'Select district',
      fieldName: 'District',
      bindLabel: 'name',
      bindValue: 'name',
      required: true,
      searchable: true
    };
    this.blockConfig = {
      isBackground: true,
      placeHolderTxt: 'Select block',
      fieldName: 'Block',
      bindLabel: 'name',
      bindValue: 'name',
      required: true,
      searchable: true
    };
    this.schoolConfig = {
      isBackground: true,
      placeHolderTxt: 'Search and select school',
      fieldName: 'School',
      bindLabel: 'label',
      bindValue: '_id',
      required: true,
      searchable: true
    };
    this.submitted = false;
    this.mode = '';
    this.teacherForm = false;
    this.canAssign = false;
    this.otherAssignments = [];
    this.assignmentGrants = [];
  }
  ngOnInit() {
    this.teacherForm = this.route.snapshot.data['teacherForm'];
    this.mode = this.route.snapshot.queryParamMap.get('mode') || '';
    this.userId = this.route.snapshot.params['id'];
    this.canAssign = this.mode !== 'view' && (this.userId ? this.utility.hasPermission(['role.assign']) : this.utility.hasPermission(['user.create']));
    if (this.canAssign) this.assignmentGrants = this.utility.getPermission(this.userId ? 'role.assign' : 'user.create');
    const accessDenied = this.mode === 'edit' && !this.utility.hasPermission(['user.edit']) || !this.userId && !this.utility.hasPermission(['user.create']);
    const controls = {
      name: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.minLength(this.teacherForm ? 5 : 3)]],
      phone: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.minLength(10), _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.pattern(this.utility.regexPattern.phoneRegex)]],
      roles: this.fb.array([])
    };
    if (!this.teacherForm) {
      controls.email = [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.email]];
      controls.state = [null];
    }
    this.form = this.fb.group(controls);
    this.appendAssignment({});
    if (this.mode === 'view') this.form.disable();
    if (accessDenied) {
      this.router.navigate([this.listRoute]);
      return;
    }
    if (this.canAssign) {
      this.users.getAssignmentData().subscribe(({
        roles,
        regions
      }) => {
        this.roles = roles.filter(role => this.teacherForm ? role.scopeType === 'SCHOOL' : role.scopeType !== 'SCHOOL');
        this.regions = regions;
        this.setProfileRegions();
        if (!this.userId) this.setRoleOptions(0);
        if (this.userId) this.loadUser();
      });
    } else {
      this.users.getRegions().subscribe(regions => {
        this.regions = regions;
        this.setProfileRegions();
        this.loadUser();
      });
    }
  }
  get assignments() {
    return this.form.get('roles');
  }
  get entity() {
    return this.teacherForm ? 'Teacher' : 'Staff';
  }
  get listRoute() {
    return this.teacherForm ? '/teachers/list' : '/staff/list';
  }
  addAssignment() {
    this.appendAssignment({});
    this.setRoleOptions(this.assignments.length - 1);
    this.form.markAsDirty();
  }
  removeAssignment(index) {
    this.assignments.removeAt(index);
    this.scopes.splice(index, 1);
    this.form.markAsDirty();
  }
  assignmentRole(index) {
    return this.roles.find(role => role._id === this.assignments.at(index).get('roleId')?.value);
  }
  canAssignScope(scopeType) {
    return (0,_utility_scope_util__WEBPACK_IMPORTED_MODULE_0__.scopeBelow)(this.assignmentGrants, scopeType, {});
  }
  pathAllowed(index, path) {
    return (0,_utility_scope_util__WEBPACK_IMPORTED_MODULE_0__.scopeBelow)(this.assignmentGrants, this.assignmentRole(index).scopeType, path);
  }
  scopeIncludes(index, scopeType) {
    return _utility_scope_util__WEBPACK_IMPORTED_MODULE_0__.SCOPE_FIELDS[this.assignmentRole(index)?.scopeType]?.includes(scopeType) === true;
  }
  assignmentChanged(index) {
    this.setDependencyValidator(index);
    this.assignments.at(index).get('dep').setValue(null);
    this.resetScope(index);
    this.setStateOptions(index);
  }
  stateChanged(index, state) {
    const scope = this.scopes[index];
    scope.zones = this.regions.find(region => region.state === state).zones.filter(zone => this.pathAllowed(index, {
      state,
      zone: zone.name
    }));
    scope.zone.reset();
    scope.district.reset();
    scope.block.reset();
    scope.districts = [];
    scope.blocks = [];
    scope.schools = [];
    this.setDependency(index, 'STATE', state);
    this.selectOnly(scope.zone, scope.zones, 'name', zone => this.zoneChanged(index, zone));
  }
  zoneChanged(index, zone) {
    const scope = this.scopes[index];
    scope.districts = scope.zones.find(item => item.name === zone).districts.filter(district => this.pathAllowed(index, {
      state: scope.state.value,
      zone,
      district: district.name
    }));
    scope.district.reset();
    scope.block.reset();
    scope.blocks = [];
    scope.schools = [];
    this.setDependency(index, 'ZONE', zone);
    this.selectOnly(scope.district, scope.districts, 'name', district => this.districtChanged(index, district));
  }
  districtChanged(index, district) {
    const scope = this.scopes[index];
    scope.blocks = scope.districts.find(item => item.name === district).blocks.filter(block => this.pathAllowed(index, {
      state: scope.state.value,
      zone: scope.zone.value,
      district,
      block: block.name
    }));
    scope.block.reset();
    scope.schools = [];
    this.setDependency(index, 'DISTRICT', district);
    this.selectOnly(scope.block, scope.blocks, 'name', block => this.blockChanged(index, block));
  }
  blockChanged(index, block) {
    const scope = this.scopes[index];
    scope.schools = [];
    this.setDependency(index, 'BLOCK', block);
    if (this.assignmentRole(index)?.scopeType === 'SCHOOL') {
      this.users.getSchools({
        state: scope.state.value,
        zone: scope.zone.value,
        district: scope.district.value,
        block
      }).subscribe(schools => {
        scope.schools = schools;
        this.selectOnly(this.assignments.at(index).get('dep'), schools, '_id');
      });
    }
  }
  submit() {
    this.submitted = true;
    if (this.form.invalid) return;
    const raw = this.form.getRawValue();
    const value = this.canAssign ? {
      ...raw,
      roles: [...raw.roles, ...this.otherAssignments]
    } : raw;
    const request = this.teacherForm ? this.mode === 'edit' ? this.users.updateTeacher(this.userId, value) : this.users.createTeacher(value) : this.mode === 'edit' ? this.users.updateStaff(this.userId, value) : this.users.createStaff(value);
    request.subscribe({
      next: response => {
        this.router.navigate([this.listRoute]);
        this.utility.handleResponse(response);
      },
      error: error => this.utility.handleError(error)
    });
  }
  appendAssignment(value) {
    const assignment = this.fb.group({
      roleId: [value.roleId, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required],
      dep: [value.dep]
    });
    if (value._id) assignment.addControl('_id', this.fb.control(value._id));
    if (this.mode === 'view' || !this.canAssign) assignment.disable();
    this.assignments.push(assignment);
    this.scopes.push(this.createScope());
  }
  createScope() {
    const control = () => new _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControl({
      value: null,
      disabled: this.mode === 'view' || !this.canAssign
    });
    return {
      state: control(),
      zone: control(),
      district: control(),
      block: control(),
      roles: [],
      states: [],
      zones: [],
      districts: [],
      blocks: [],
      schools: []
    };
  }
  setRoleOptions(index) {
    const selected = this.assignments.at(index).get('roleId')?.value;
    const options = this.roles.filter(role => role._id === selected || this.canAssignScope(role.scopeType));
    this.scopes[index].roles = options;
    this.selectOnly(this.assignments.at(index).get('roleId'), options, '_id', () => this.assignmentChanged(index), this.canAssign);
  }
  setStateOptions(index) {
    if (!_utility_scope_util__WEBPACK_IMPORTED_MODULE_0__.SCOPE_FIELDS[this.assignmentRole(index)?.scopeType]) return;
    const scope = this.scopes[index];
    scope.states = this.regions.filter(region => this.pathAllowed(index, {
      state: region.state
    }));
    this.selectOnly(scope.state, scope.states, 'state', state => this.stateChanged(index, state), this.canAssign);
  }
  setProfileRegions() {
    if (this.teacherForm) return;
    if (this.mode === 'view') {
      this.profileRegions = this.regions;
      return;
    }
    const permission = this.userId ? 'user.edit' : 'user.create';
    const grants = this.utility.getPermission(permission);
    this.profileRegions = grants.some(grant => grant.scopeType === 'GLOBAL') ? this.regions : this.regions.filter(region => grants.some(grant => grant.dep.state === region.state));
    this.selectOnly(this.form.get('state'), this.profileRegions, 'state');
  }
  selectOnly(control, options, valueKey, selected, editable = true) {
    if (!editable) return;
    control.enable({
      emitEvent: false
    });
    if (options.length !== 1) return;
    const value = options[0][valueKey];
    const changed = control.value !== value;
    control.setValue(value, {
      emitEvent: false
    });
    control.disable({
      emitEvent: false
    });
    if (changed) selected?.(value);
  }
  setDependencyValidator(index) {
    const dep = this.assignments.at(index).get('dep');
    dep.setValidators(['GLOBAL', 'UNBOUND'].includes(this.assignmentRole(index)?.scopeType) ? null : _angular_forms__WEBPACK_IMPORTED_MODULE_5__.Validators.required);
    dep.updateValueAndValidity();
  }
  setDependency(index, scopeType, value) {
    if (this.assignmentRole(index)?.scopeType !== scopeType) {
      this.assignments.at(index).get('dep').setValue(null);
      return;
    }
    const scope = this.scopes[index];
    const values = {
      state: scope.state.value,
      zone: scope.zone.value,
      district: scope.district.value,
      block: scope.block.value,
      [scopeType.toLowerCase()]: value
    };
    this.assignments.at(index).get('dep').setValue(Object.fromEntries(_utility_scope_util__WEBPACK_IMPORTED_MODULE_0__.SCOPE_FIELDS[scopeType].map(field => [field.toLowerCase(), values[field.toLowerCase()]])));
    this.assignments.at(index).get('dep').markAsDirty();
  }
  resetScope(index) {
    const scope = this.scopes[index];
    scope.state.reset();
    scope.zone.reset();
    scope.district.reset();
    scope.block.reset();
    scope.states = [];
    scope.zones = [];
    scope.districts = [];
    scope.blocks = [];
    scope.schools = [];
  }
  setPath(index, path) {
    const scope = this.scopes[index];
    const selectedRegion = this.regions.find(region => region.state === path.state);
    scope.states = this.regions.filter(region => this.pathAllowed(index, {
      state: region.state
    }));
    if (!scope.states.length) scope.states = [selectedRegion];
    scope.state.setValue(path.state);
    this.disableOnly(scope.state, scope.states);
    scope.zones = selectedRegion.zones.filter(zone => this.pathAllowed(index, {
      state: path.state,
      zone: zone.name
    }));
    if (!scope.zones.length && path.zone) scope.zones = selectedRegion.zones.filter(zone => zone.name === path.zone);
    if (!path.zone) return;
    scope.zone.setValue(path.zone);
    this.disableOnly(scope.zone, scope.zones);
    const selectedZone = selectedRegion.zones.find(zone => zone.name === path.zone);
    scope.districts = selectedZone.districts.filter(district => this.pathAllowed(index, {
      state: path.state,
      zone: path.zone,
      district: district.name
    }));
    if (!scope.districts.length && path.district) scope.districts = selectedZone.districts.filter(district => district.name === path.district);
    if (!path.district) return;
    scope.district.setValue(path.district);
    this.disableOnly(scope.district, scope.districts);
    const selectedDistrict = selectedZone.districts.find(district => district.name === path.district);
    scope.blocks = selectedDistrict.blocks.filter(block => this.pathAllowed(index, {
      state: path.state,
      zone: path.zone,
      district: path.district,
      block: block.name
    }));
    if (!scope.blocks.length && path.block) scope.blocks = selectedDistrict.blocks.filter(block => block.name === path.block);
    if (path.block) scope.block.setValue(path.block);
    this.disableOnly(scope.block, scope.blocks);
  }
  disableOnly(control, options) {
    if (!this.canAssign) return;
    if (options.length === 1) control.disable({
      emitEvent: false
    });else control.enable({
      emitEvent: false
    });
  }
  setExistingScope(index, scopeType, dep) {
    if (!_utility_scope_util__WEBPACK_IMPORTED_MODULE_0__.SCOPE_FIELDS[scopeType]) return;
    if (scopeType === 'SCHOOL') {
      this.users.getSchool(dep).subscribe(school => {
        this.setPath(index, school);
        this.users.getSchools({
          state: school.state,
          zone: school.zone,
          district: school.district,
          block: school.block
        }).subscribe(schools => {
          this.scopes[index].schools = schools;
          this.disableOnly(this.assignments.at(index).get('dep'), schools);
        });
      });
      return;
    }
    this.setPath(index, dep);
  }
  loadUser() {
    this.users.getById(this.userId).subscribe({
      next: response => {
        const user = response.data;
        this.assignments.clear();
        this.scopes = [];
        const assignments = user.roles.filter(assignment => assignment.role.scopeType === 'SCHOOL' === this.teacherForm);
        this.otherAssignments = user.roles.filter(assignment => assignment.role.scopeType === 'SCHOOL' !== this.teacherForm).map(assignment => ({
          _id: assignment._id,
          roleId: assignment.role._id,
          dep: assignment.dep
        }));
        if (!this.canAssign) this.roles = assignments.map(assignment => assignment.role);
        assignments.forEach((assignment, index) => {
          this.appendAssignment({
            _id: assignment._id,
            roleId: assignment.role._id,
            dep: assignment.dep
          });
          this.setDependencyValidator(index);
          this.setExistingScope(index, assignment.role.scopeType, assignment.dep);
          this.setRoleOptions(index);
        });
        this.form.patchValue({
          name: user.identity.name,
          phone: user.identity.phone
        });
        if (!this.teacherForm) this.form.patchValue({
          email: user.identity.email,
          state: user.profiles.admin.state
        });
      },
      error: error => this.utility.handleError(error)
    });
  }
  static {
    this.ɵfac = function UserManageComponent_Factory(t) {
      return new (t || UserManageComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_2__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_6__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_staff_user_common_service__WEBPACK_IMPORTED_MODULE_3__.StaffUserCommonService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
      type: UserManageComponent,
      selectors: [["app-user-manage"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
      decls: 41,
      vars: 38,
      consts: [[1, "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "items-center"], ["src", "assets/icons/Vector (3).svg", "alt", "", 1, "w-5", "h-5", "cursor-pointer", 3, "routerLink"], [1, "text-2xl", "md:text-[30px]", "font-bold", "text-content", "md:leading-[48px]", "ml-4"], [1, "border", "text-content", "rounded", "my-5", "px-4", "py-6", "md:px-6", "md:py-8", "bg-white"], [1, "text-content", "text-2xl", "md:text-[30px]", "font-bold", "md:leading-[48px]"], [3, "formGroup", "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "mt-8"], [1, "form-control-label"], ["class", "text-[16px] text-error", 4, "ngIf"], ["formControlName", "name", "type", "text", "maxlength", "255", "autocomplete", "off", 1, "form-control", 3, "placeholder"], ["class", "form-control-error", 4, "ngIf"], ["formControlName", "phone", "type", "text", "maxlength", "10", "oninput", "this.value=this.value.replace(/(?![0-9])./gmi,'')", "autocomplete", "off", 1, "form-control", 3, "placeholder"], [4, "ngIf"], ["formArrayName", "roles", 1, "mt-6", "md:mt-8"], ["class", "border rounded p-4 mb-4", 3, "formGroupName", 4, "ngFor", "ngForOf"], ["type", "button", "class", "btn-primary px-4 flex items-center gap-2", 3, "click", 4, "ngIf"], ["class", "buttons mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2", 4, "ngIf"], [1, "text-[16px]", "text-error"], [1, "form-control-error"], ["formControlName", "email", "type", "email", "autocomplete", "off", 1, "form-control", 3, "placeholder"], [3, "mode", "dropDownCtrl", "dropDownValues", "config", "submitted"], [1, "border", "rounded", "p-4", "mb-4", 3, "formGroupName"], [1, "flex", "gap-3", "items-end"], [1, "grow", "min-w-0"], [3, "mode", "dropDownCtrl", "dropDownValues", "config", "submitted", "valueChange"], ["type", "button", "class", "btn-danger w-9 h-9 !p-2 flex items-center justify-center shrink-0", 3, "title", "click", 4, "ngIf"], ["class", "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 mt-3", 4, "ngIf"], ["class", "mt-3", 4, "ngIf"], ["type", "button", 1, "btn-danger", "w-9", "h-9", "!p-2", "flex", "items-center", "justify-center", "shrink-0", 3, "title", "click"], ["src", "assets/icons/delete-icon.svg", 1, "w-5", "h-5", 3, "alt"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "xl:grid-cols-3", "gap-3", "mt-3"], [3, "mode", "dropDownCtrl", "dropDownValues", "config", "submitted", "valueUpdate"], [3, "mode", "dropDownCtrl", "dropDownValues", "config", "submitted", "valueUpdate", 4, "ngIf"], [3, "mode", "dropDownCtrl", "dropDownValues", "config", "submitted", 4, "ngIf"], [1, "mt-3"], ["disabled", "", 1, "form-control", "bg-surface-muted", 3, "value"], ["type", "button", 1, "btn-primary", "px-4", "flex", "items-center", "gap-2", 3, "click"], ["src", "assets/icons/add.svg", "alt", ""], [1, "buttons", "mt-8", "flex", "flex-col", "sm:flex-row", "items-stretch", "sm:items-center", "justify-end", "gap-2"], ["type", "button", 1, "w-full", "sm:w-20", "btn-outline-primary", 3, "routerLink"], ["type", "submit", 1, "btn-primary", "w-full", "sm:w-20", "flex", "items-center", "justify-center", 3, "disabled"], [1, "mr-1"], ["src", "assets/icons/Vector (4).svg", "alt", ""]],
      template: function UserManageComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](6, "div", 4)(7, "h2", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](9, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](10, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](11, "form", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("ngSubmit", function UserManageComponent_Template_form_ngSubmit_11_listener() {
            return ctx.submit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "div", 7)(13, "div")(14, "label", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](16, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](17, UserManageComponent_span_17_Template, 2, 0, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](18, "input", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](19, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](20, UserManageComponent_small_20_Template, 3, 3, "small", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](21, UserManageComponent_small_21_Template, 3, 3, "small", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](22, "div")(23, "label", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](24);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](25, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](26, UserManageComponent_span_26_Template, 2, 0, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](27, "input", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](28, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](29, UserManageComponent_small_29_Template, 3, 3, "small", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](30, UserManageComponent_small_30_Template, 3, 3, "small", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](31, UserManageComponent_small_31_Template, 3, 3, "small", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](32, UserManageComponent_ng_container_32_Template, 11, 14, "ng-container", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](33, "div", 14)(34, "label", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](35);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](36, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](37, UserManageComponent_span_37_Template, 2, 0, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](38, UserManageComponent_div_38_Template, 7, 9, "div", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](39, UserManageComponent_button_39_Template, 4, 3, "button", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](40, UserManageComponent_div_40_Template, 9, 8, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          let tmp_7_0;
          let tmp_8_0;
          let tmp_12_0;
          let tmp_13_0;
          let tmp_14_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("routerLink", ctx.listRoute);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](5, 22, ctx.entity + " Management"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](9, 24, ctx.mode === "view" ? "View" : ctx.mode === "edit" ? "Edit" : "Add"), " ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](10, 26, ctx.entity), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("formGroup", ctx.form);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](16, 28, ctx.entity + " Name"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](19, 30, "Enter " + ctx.entity + " Name"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.submitted && ((tmp_7_0 = ctx.form.get("name")) == null ? null : tmp_7_0.errors == null ? null : tmp_7_0.errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.submitted && ((tmp_8_0 = ctx.form.get("name")) == null ? null : tmp_8_0.errors == null ? null : tmp_8_0.errors["minlength"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](25, 32, "Mobile Number"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](28, 34, "Enter Mobile Number"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.submitted && ((tmp_12_0 = ctx.form.get("phone")) == null ? null : tmp_12_0.errors == null ? null : tmp_12_0.errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.submitted && ((tmp_13_0 = ctx.form.get("phone")) == null ? null : tmp_13_0.errors == null ? null : tmp_13_0.errors["minlength"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.submitted && !((tmp_14_0 = ctx.form.get("phone")) == null ? null : tmp_14_0.errors == null ? null : tmp_14_0.errors["minlength"]) && ((tmp_14_0 = ctx.form.get("phone")) == null ? null : tmp_14_0.errors == null ? null : tmp_14_0.errors["pattern"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", !ctx.teacherForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](36, 36, "Role assignments"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx.assignments.controls);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.mode !== "view" && ctx.canAssign);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_7__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_7__.NgIf, _dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_1__.DropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_5__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_5__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.MaxLengthValidator, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormControlName, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormGroupName, _angular_forms__WEBPACK_IMPORTED_MODULE_5__.FormArrayName, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterModule, _angular_router__WEBPACK_IMPORTED_MODULE_6__.RouterLink, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslatePipe],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 74333:
/*!********************************************************************************!*\
  !*** ./src/app/shared/components/user-staff-list/user-staff-list.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UserStaffListComponent: () => (/* binding */ UserStaffListComponent)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! rxjs */ 52575);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! rxjs */ 91817);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! rxjs */ 61873);
/* harmony import */ var _utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utility/constant.util */ 64487);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dropdown/dropdown.component */ 62157);
/* harmony import */ var _modal_modal_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modal/modal.component */ 69081);
/* harmony import */ var _disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../disable-popup/disable-popup.component */ 51541);
/* harmony import */ var _upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../upload-popup/upload-popup.component */ 86487);
/* harmony import */ var _pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../pagination/pagination.component */ 94815);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @ng-select/ng-select */ 62223);
/* harmony import */ var src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/core/directives/has-permission.directive */ 87944);
/* harmony import */ var _upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../upload-error-popup/upload-error-popup.component */ 12321);
/* harmony import */ var _utility_animations_util__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utility/animations.util */ 29066);
/* harmony import */ var _utility_action_menu_controller_util__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../utility/action-menu-controller.util */ 37348);
/* harmony import */ var _utility_scope_util__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../utility/scope.util */ 56215);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _modal_modal_service__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../modal/modal.service */ 51133);
/* harmony import */ var src_app_view_admin_user_management_user_management_service__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! src/app/view/admin/user-management/user-management.service */ 58640);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _services_staff_user_common_service__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../services/staff-user-common.service */ 80798);
/* harmony import */ var _services_master_service__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../../services/master.service */ 2216);
/* harmony import */ var src_app_view_admin_school_management_school_management_service__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! src/app/view/admin/school-management/school-management.service */ 69700);



























const _c0 = ["dropdownContent"];
const _c1 = ["dropdownContainer"];
const _c2 = function () {
  return ["user.import"];
};
function UserStaffListComponent_button_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_button_10_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r14);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r13.blukUpload());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](1, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](2, "img", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](3, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction0"](4, _c2));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](5, 2, "Bulk Upload"));
  }
}
const _c3 = function () {
  return ["user.export"];
};
function UserStaffListComponent_button_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "button", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_button_17_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r16);
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r15.exportUsersListToExcel());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](1, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](2, "img", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](3, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction0"](5, _c3))("disabled", !ctx_r1.usersList.length);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](5, 3, "Export"));
  }
}
function UserStaffListComponent_div_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 19)(1, "app-dropdown", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("valueUpdate", function UserStaffListComponent_div_32_Template_app_dropdown_valueUpdate_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r18);
      const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r17.onTrainingStatusChange($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("dropDownValues", ctx_r2.trainingStatusDropdownOptions)("config", ctx_r2.trainingStatusDropdownconfig);
  }
}
function UserStaffListComponent_button_33_img_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](0, "img", 41);
  }
}
function UserStaffListComponent_button_33_img_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](0, "img", 42);
  }
}
function UserStaffListComponent_button_33_Template(rf, ctx) {
  if (rf & 1) {
    const _r22 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "button", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_button_33_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r22);
      const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r21.toggleFilter());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](1, UserStaffListComponent_button_33_img_1_Template, 1, 0, "img", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](2, UserStaffListComponent_button_33_img_2_Template, 1, 0, "img", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("title", ctx_r3.showAdditionalFilters ? "Remove Additional Filters" : "Add Additional Filters");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵattribute"]("aria-label", ctx_r3.showAdditionalFilters ? "Remove Additional Filters" : "Add Additional Filters");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", !ctx_r3.showAdditionalFilters);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx_r3.showAdditionalFilters);
  }
}
function UserStaffListComponent_div_34_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 43)(1, "div", 14)(2, "app-dropdown", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("valueUpdate", function UserStaffListComponent_div_34_Template_app_dropdown_valueUpdate_2_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r24);
      const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r23.onFilterChange("state", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](3, "div", 14)(4, "app-dropdown", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("valueUpdate", function UserStaffListComponent_div_34_Template_app_dropdown_valueUpdate_4_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r24);
      const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r25.onFilterChange("zone", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](5, "div", 14)(6, "app-dropdown", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("valueUpdate", function UserStaffListComponent_div_34_Template_app_dropdown_valueUpdate_6_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r24);
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r26.onFilterChange("district", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](7, "div", 14)(8, "app-dropdown", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("valueUpdate", function UserStaffListComponent_div_34_Template_app_dropdown_valueUpdate_8_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r24);
      const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r27.onFilterChange("block", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](9, "div", 14)(10, "app-dropdown", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("valueUpdate", function UserStaffListComponent_div_34_Template_app_dropdown_valueUpdate_10_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r24);
      const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r28.onFilterChange("school", $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("@slideInOut", ctx_r4.showAdditionalFilters);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("dropDownCtrl", ctx_r4.stateControl)("dropDownValues", ctx_r4.stateDropdownOptions)("config", ctx_r4.stateDropdownconfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("dropDownCtrl", ctx_r4.zoneControl)("dropDownValues", ctx_r4.zoneDropdownOptions)("config", ctx_r4.zoneDropdownconfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("dropDownCtrl", ctx_r4.districtControl)("dropDownValues", ctx_r4.districtDropdownOptions)("config", ctx_r4.districtDropdownconfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("dropDownCtrl", ctx_r4.blockControl)("dropDownValues", ctx_r4.blockDropdownOptions)("config", ctx_r4.blockDropdownconfig);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("dropDownCtrl", ctx_r4.schoolControl)("dropDownValues", ctx_r4.schoolDropdownOptions)("config", ctx_r4.schoolDropdownconfig);
  }
}
function UserStaffListComponent_div_36_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](2, 1, "No items found"));
  }
}
function UserStaffListComponent_div_37_ul_12_li_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "li", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_div_37_ul_12_li_8_Template_li_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r39);
      const item_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2).$implicit;
      const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r37.editUser(item_r29));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](1, "a", 62)(2, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](3, "img", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](6, 1, ((tmp_0_0 = ctx_r34.getType()) == null ? null : tmp_0_0.type) === "user" ? "Edit Teacher" : "Edit Staff"));
  }
}
function UserStaffListComponent_div_37_ul_12_li_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r42 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "li", 69)(1, "a", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_div_37_ul_12_li_9_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r42);
      const item_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2).$implicit;
      const ctx_r40 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r40.openModalForDeleteConfirm(item_r29));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](2, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](3, "img", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](6, 1, ((tmp_0_0 = ctx_r35.getType()) == null ? null : tmp_0_0.type) === "user" ? "Disable Teacher" : "Disable Staff"));
  }
}
function UserStaffListComponent_div_37_ul_12_li_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r45 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "li", 69)(1, "a", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_div_37_ul_12_li_10_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r45);
      const item_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2).$implicit;
      const ctx_r43 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r43.activateUser(item_r29._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](2, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](3, "img", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](6, 1, "Activate User"));
  }
}
function UserStaffListComponent_div_37_ul_12_Template(rf, ctx) {
  if (rf & 1) {
    const _r48 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "ul", 60)(1, "li", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_div_37_ul_12_Template_li_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r48);
      const item_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]().$implicit;
      const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r46.viewUser(item_r29));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](2, "a", 62)(3, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](4, "img", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](8, UserStaffListComponent_div_37_ul_12_li_8_Template, 7, 3, "li", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](9, UserStaffListComponent_div_37_ul_12_li_9_Template, 7, 3, "li", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](10, UserStaffListComponent_div_37_ul_12_li_10_Template, 7, 3, "li", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]().$implicit;
    const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](7, 4, ((tmp_0_0 = ctx_r31.getType()) == null ? null : tmp_0_0.type) === "user" ? "View Teacher" : "View Staff"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx_r31.loggedUser() !== item_r29._id && ctx_r31.canManage(item_r29, "user.edit"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", !item_r29.isDeleted && ctx_r31.loggedUser() !== item_r29._id && ctx_r31.canManage(item_r29, "user.delete"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", item_r29.isDeleted && ctx_r31.canManage(item_r29, "user.delete"));
  }
}
function UserStaffListComponent_div_37_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 75)(1, "p", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "p", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](3, 2, "School"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](item_r29.school.name);
  }
}
const _c4 = function (a0, a1) {
  return {
    "text-success bg-success-50": a0,
    "text-warn bg-orange-50": a1
  };
};
function UserStaffListComponent_div_37_div_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 75)(1, "p", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r29 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](3, 3, "Training Status"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction2"](5, _c4, item_r29.trainingStatus === "trained", item_r29.trainingStatus === "untrained"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate1"](" ", item_r29.trainingStatus === "trained" ? "Trained" : "Untrained", " ");
  }
}
const _c5 = function (a0, a1) {
  return {
    "text-success bg-success-50": a0,
    "text-error-a11y bg-error-50": a1
  };
};
function UserStaffListComponent_div_37_Template(rf, ctx) {
  if (rf & 1) {
    const _r53 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 46)(1, "div", 47)(2, "div", 48)(3, "p", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](5, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](6, "p", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](7);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](8, "div", 51)(9, "button", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_div_37_Template_button_click_9_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r53);
      const i_r30 = restoredCtx.index;
      const ctx_r52 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r52.actionMenu.toggleMobileMenu(i_r30, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](10, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](11, "img", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](12, UserStaffListComponent_div_37_ul_12_Template, 11, 6, "ul", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](13, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](14, UserStaffListComponent_div_37_div_14_Template, 6, 4, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](15, "div")(16, "p", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](17);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](18, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](19, "p", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](20);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](21, "div")(22, "p", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](23);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](24, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](25, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](26);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](27, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](28, UserStaffListComponent_div_37_div_28_Template, 6, 8, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r29 = ctx.$implicit;
    const i_r30 = ctx.index;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    let tmp_4_0;
    let tmp_10_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](5, 11, item_r29.identity.name));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](item_r29.identity.phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](10, 13, "More options"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx_r6.actionMenu.openStates[i_r30]);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ((tmp_4_0 = ctx_r6.getType()) == null ? null : tmp_4_0.type) === "user");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](18, 15, "Role"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](ctx_r6.roleName(item_r29));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](24, 17, "Status"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction2"](21, _c5, !item_r29.isDeleted, item_r29.isDeleted));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](27, 19, !item_r29.isDeleted ? "Active" : "Inactive"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ((tmp_10_0 = ctx_r6.getType()) == null ? null : tmp_10_0.type) === "user");
  }
}
function UserStaffListComponent_th_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "th", 76);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const header_r54 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](2, 1, header_r54));
  }
}
function UserStaffListComponent_tr_44_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "tr")(1, "td", 77);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵattribute"]("colspan", ((tmp_0_0 = ctx_r8.getType()) == null ? null : tmp_0_0.type) === "user" ? 7 : 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](3, 2, "No items found"));
  }
}
function UserStaffListComponent_tr_46_td_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "td", 90);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](item_r55.school.name);
  }
}
function UserStaffListComponent_tr_46_td_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "td", 82)(1, "span", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction2"](2, _c4, item_r55.trainingStatus === "trained", item_r55.trainingStatus === "untrained"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate1"](" ", item_r55.trainingStatus === "trained" ? "Trained" : "Untrained", " ");
  }
}
function UserStaffListComponent_tr_46_ul_20_li_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r67 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "li", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_tr_46_ul_20_li_8_Template_li_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r67);
      const item_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2).$implicit;
      const ctx_r65 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r65.editUser(item_r55));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](1, "a", 62)(2, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](3, "img", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](6, 1, ((tmp_0_0 = ctx_r62.getType()) == null ? null : tmp_0_0.type) === "user" ? "Edit Teacher" : "Edit Staff"));
  }
}
function UserStaffListComponent_tr_46_ul_20_li_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r70 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "li", 69)(1, "a", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_tr_46_ul_20_li_9_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r70);
      const item_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2).$implicit;
      const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r68.openModalForDeleteConfirm(item_r55));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](2, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](3, "img", 71);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "span", 72);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const ctx_r63 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](6, 1, ((tmp_0_0 = ctx_r63.getType()) == null ? null : tmp_0_0.type) === "user" ? "Disable Teacher" : "Disable Staff"));
  }
}
function UserStaffListComponent_tr_46_ul_20_li_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r73 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "li", 69)(1, "a", 70);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_tr_46_ul_20_li_10_Template_a_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r73);
      const item_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"](2).$implicit;
      const ctx_r71 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r71.activateUser(item_r55._id));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](2, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](3, "img", 73);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "span", 74);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](6, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](6, 1, "Activate User"));
  }
}
function UserStaffListComponent_tr_46_ul_20_Template(rf, ctx) {
  if (rf & 1) {
    const _r76 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "ul", 91)(1, "li", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_tr_46_ul_20_Template_li_click_1_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r76);
      const item_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]().$implicit;
      const ctx_r74 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r74.viewUser(item_r55));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](2, "a", 62)(3, "div", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](4, "img", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](5, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](8, UserStaffListComponent_tr_46_ul_20_li_8_Template, 7, 3, "li", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](9, UserStaffListComponent_tr_46_ul_20_li_9_Template, 7, 3, "li", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](10, UserStaffListComponent_tr_46_ul_20_li_10_Template, 7, 3, "li", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r77 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    const i_r56 = ctx_r77.index;
    const item_r55 = ctx_r77.$implicit;
    const ctx_r59 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngStyle", ctx_r59.actionMenu.desktopPositions[i_r56]);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](7, 5, ((tmp_1_0 = ctx_r59.getType()) == null ? null : tmp_1_0.type) === "user" ? "View Teacher" : "View Staff"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx_r59.loggedUser() !== item_r55._id && ctx_r59.canManage(item_r55, "user.edit"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", !item_r55.isDeleted && ctx_r59.loggedUser() !== item_r55._id && ctx_r59.canManage(item_r55, "user.delete"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", item_r55.isDeleted && ctx_r59.canManage(item_r55, "user.delete"));
  }
}
function UserStaffListComponent_tr_46_Template(rf, ctx) {
  if (rf & 1) {
    const _r79 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "tr", 78)(1, "td", 79);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](3, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "td", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](6, UserStaffListComponent_tr_46_td_6_Template, 2, 1, "td", 81);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](7, "td", 80);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](9, "td", 82)(10, "span", 83);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](11);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](12, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](13, UserStaffListComponent_tr_46_td_13_Template, 3, 5, "td", 84);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](14, "td", 85)(15, "div", 86)(16, "div", 87);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_tr_46_Template_div_click_16_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r79);
      const i_r56 = restoredCtx.index;
      const ctx_r78 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r78.actionMenu.toggleDesktopMenu(i_r56, $event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](17, "button", 88);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](18, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](19, "img", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](20, UserStaffListComponent_tr_46_ul_20_Template, 11, 7, "ul", 89);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()()();
  }
  if (rf & 2) {
    const item_r55 = ctx.$implicit;
    const i_r56 = ctx.index;
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    let tmp_2_0;
    let tmp_6_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](3, 11, item_r55.identity.name));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](item_r55.identity.phone);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx_r9.getType()) == null ? null : tmp_2_0.type) === "user");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](ctx_r9.roleName(item_r55));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction2"](17, _c5, !item_r55.isDeleted, item_r55.isDeleted));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](12, 13, !item_r55.isDeleted ? "Active" : "Inactive"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ((tmp_6_0 = ctx_r9.getType()) == null ? null : tmp_6_0.type) === "user");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵclassProp"]("open", ctx_r9.actionMenu.openStates[i_r56]);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](18, 15, "More options"));
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx_r9.actionMenu.openStates[i_r56]);
  }
}
function UserStaffListComponent_app_modal_47_Template(rf, ctx) {
  if (rf & 1) {
    const _r81 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "app-modal")(1, "app-disable-popup", 92);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("sendDetails", function UserStaffListComponent_app_modal_47_Template_app_disable_popup_sendDetails_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r81);
      const ctx_r80 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r80.ondisableUser($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("modalHeader", ((tmp_0_0 = ctx_r10.getType()) == null ? null : tmp_0_0.type) === "user" ? "Disable Teacher" : "Disable Staff")("modalSubHeader", ctx_r10.modal_subheader)("tableData", ctx_r10.tableData);
  }
}
function UserStaffListComponent_app_modal_48_Template(rf, ctx) {
  if (rf & 1) {
    const _r83 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "app-modal")(1, "app-upload-popup", 93);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("fileUploaded", function UserStaffListComponent_app_modal_48_Template_app_upload_popup_fileUploaded_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r83);
      const ctx_r82 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r82.uploadedFile($event));
    })("upload", function UserStaffListComponent_app_modal_48_Template_app_upload_popup_upload_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵrestoreView"](_r83);
      const ctx_r84 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵresetView"](ctx_r84.upload($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("context", (tmp_0_0 = ctx_r11.getType()) == null ? null : tmp_0_0.download_file)("allowedFileTypes", ctx_r11.uploadFileTypes);
  }
}
function UserStaffListComponent_app_modal_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "app-modal");
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](1, "app-upload-error-popup", 94);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("modalHeader", "Upload Error")("errorUrl", ctx_r12.errorUrl);
  }
}
const _c6 = function () {
  return ["user.create"];
};
class UserStaffListComponent {
  constructor(elRef, route, router, modalService, userManagementService, utility, commonStaffUserService, masterService, schoolManagementService) {
    this.elRef = elRef;
    this.route = route;
    this.router = router;
    this.modalService = modalService;
    this.userManagementService = userManagementService;
    this.utility = utility;
    this.commonStaffUserService = commonStaffUserService;
    this.masterService = masterService;
    this.schoolManagementService = schoolManagementService;
    this.usersList = [];
    this.schoolNamesDropdownOptions = [];
    this.userRolesDropdownOptions = [];
    this.userStatusDropdownOptions = [{
      name: 'Active',
      value: 'active'
    }, {
      name: 'Inactive',
      value: 'inactive'
    }];
    this.trainingStatusDropdownOptions = [{
      name: 'Trained',
      value: 'trained'
    }, {
      name: 'Untrained',
      value: 'untrained'
    }];
    this.districtDropdownOptions = [];
    this.stateDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.zoneDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.stateControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormControl();
    this.zoneControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormControl();
    this.districtControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormControl();
    this.blockControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormControl();
    this.schoolControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormControl();
    this.schoolNamesDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'School Name',
      bindLabel: 'name',
      bindValue: '_id',
      labelTxt: "School Name",
      searchable: true
    };
    this.userRolesDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Type of Teacher',
      bindLabel: 'name',
      bindValue: '_id',
      labelTxt: 'Type of Teacher'
    };
    this.userStatusDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Status of user',
      bindLabel: 'name',
      bindValue: 'value',
      labelTxt: 'Status of user'
    };
    this.trainingStatusDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Training Status',
      bindLabel: 'name',
      bindValue: 'value',
      labelTxt: 'Training Status'
    };
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
    this.modal_subheader = 'Are you sure you want to delete this Teacher? This cannot be undone.';
    this.showAdditionalFilters = false;
    this.isEditing = false;
    this.actionMenu = new _utility_action_menu_controller_util__WEBPACK_IMPORTED_MODULE_9__.ActionMenuController();
    this.searchText = "";
    this.currentPage = 1;
    this.pageSize = 10;
    this.totalItems = 0;
    this.searchTerms = new rxjs__WEBPACK_IMPORTED_MODULE_19__.Subject();
    this.uploadFileTypes = _utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.BULK_UPLOAD_FILE_TYPES;
    this.contentListConfig = {
      "/teachers/list": {
        type: 'user',
        router: '/teachers/',
        table_headers: ['Teacher Name', 'Mobile Number', 'School Name', 'Type of Teacher', 'Status of Teacher', 'Training Status', ''],
        download_file: 'user-management'
      },
      "/staff/list": {
        type: "admin",
        router: '/staff/',
        table_headers: ['Staff Name', 'Mobile Number', 'Type of staff', 'Status of staff', ''],
        download_file: 'admin-shikshana-user-management'
      }
    };
    this.includeDeleted = 1;
    this.scopePaths = [];
    this.filterObj = {
      district: '',
      zone: '',
      block: '',
      school: '',
      search: '',
      includeDeleted: '',
      trainingStatus: ''
    };
    this.lessonContentType = this.router.url.split('?')[0];
    if (this.getType()?.type === 'admin') {
      this.userRolesDropdownconfig.placeHolderTxt = 'Type of staff';
      this.modal_subheader = 'Are you sure you want to delete this Staff? This cannot be undone.';
    }
  }
  ngOnInit() {
    this.onFilterChange('includeDeleted', this.includeDeleted);
    if (this.getType()?.type === 'user') {
      this.getRegionsData();
    }
    this.getUsersList(this.filterObj);
    this.loadRoles();
    this.searchSubscription = this.searchTerms.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_20__.debounceTime)(1000), (0,rxjs__WEBPACK_IMPORTED_MODULE_21__.distinctUntilChanged)()).subscribe(() => {
      this.onFilterChange('search', this.searchText);
    });
    this.updateDropdownConfig(this.getType()?.type);
  }
  /**
  * Function to get regions data
  */
  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: val => {
        this.regionsData = val?.data?.results;
        const grants = this.utility.getPermission('user.view');
        this.scopePaths = (0,_utility_scope_util__WEBPACK_IMPORTED_MODULE_10__.regionScopePaths)(grants);
        const schoolGrants = grants.filter(grant => grant.scopeType === 'SCHOOL');
        if (!schoolGrants.length) {
          this.setStateDropdownValues();
          return;
        }
        (0,rxjs__WEBPACK_IMPORTED_MODULE_22__.forkJoin)(schoolGrants.map(grant => this.schoolManagementService.getSchoolList(1, 1, {
          _id: grant.dep
        }))).subscribe(responses => {
          this.scopePaths.push(...responses.map(response => response.data.results[0]));
          this.setStateDropdownValues();
        });
      }
    });
  }
  setStateDropdownValues() {
    this.stateDropdownOptions = this.regionsData.filter(region => (0,_utility_scope_util__WEBPACK_IMPORTED_MODULE_10__.pathAllowed)(this.scopePaths, {
      state: region.state
    }));
    this.selectOnly('state', this.stateDropdownOptions, this.stateControl, 'state', state => this.setZoneDropdownValues(state));
    if (this.filterObj.state) this.getUsersList(this.filterObj);
  }
  updateDropdownConfig(type) {
    if (type === 'user') {
      this.userRolesDropdownconfig.placeHolderTxt = 'Type of Teacher';
      this.userRolesDropdownconfig.labelTxt = 'Type of Teacher';
      this.userStatusDropdownconfig.placeHolderTxt = 'Status of Teacher';
      this.userStatusDropdownconfig.labelTxt = 'Status of Teacher';
    } else if (type === 'admin') {
      this.userRolesDropdownconfig.placeHolderTxt = 'Type of Staff';
      this.userRolesDropdownconfig.labelTxt = 'Type of Staff';
      this.userStatusDropdownconfig.placeHolderTxt = 'Status of Staff';
      this.userStatusDropdownconfig.labelTxt = 'Status of Staff';
    }
  }
  ngAfterViewInit() {
    if (this.getType()?.type === 'user' && this.schoolId) {
      this.schoolControl.setValue(this.schoolId);
    }
  }
  /**
   * provide the id of the logged user
   * @returns
   */
  loggedUser() {
    return this.utility.loggedInUserData._id;
  }
  clickInside(event) {
    this.actionMenu.closeAllIfTriggeredInside(event, '.table-section');
  }
  viewUser(item) {
    this.router.navigate([`${this.getType()?.router}/${item._id}`], {
      queryParams: {
        mode: 'view'
      }
    });
  }
  editUser(item) {
    this.router.navigate([`${this.getType()?.router}/${item._id}`], {
      queryParams: {
        mode: 'edit'
      }
    });
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  openAddUserFormComp() {
    this.router.navigate([`${this.getType()?.router}/add`]);
  }
  openModalForDeleteConfirm(item) {
    this.modalService.showDeleteUserDialog = true;
    this.tableData = {
      id: item._id,
      header: this.getType()?.type === 'user' ? ['Teacher Name', 'Role Name', 'Status of Teacher'] : ['Staff Name', 'Role Name', 'Status of staff'],
      data: {
        status: item.isDeleted ? 'Inactive' : 'Active',
        isAction: true,
        user_name: item.identity.name,
        role_name: this.roleName(item),
        more_icon: false
      }
    };
  }
  loadRoles() {
    this.commonStaffUserService.getRoles().subscribe(res => {
      this.userRolesDropdownOptions = this.getType()?.type === 'user' ? res.data.results.filter(role => role.scopeType === 'SCHOOL') : res.data.results;
    });
  }
  roleName(item) {
    const roles = this.getType()?.type === 'user' ? item.roles.filter(assignment => assignment.role.scopeType === 'SCHOOL') : item.roles;
    return roles.map(assignment => assignment.role.name).join(', ');
  }
  ondisableUser(item) {
    this.commonStaffUserService.deactivate(item.id).subscribe({
      next: res => {
        this.modalService.showDeleteUserDialog = false;
        this.utility.handleResponse(res);
        this.getUsersList();
      },
      error: err => {
        console.error(err);
        this.utility.handleError(err);
      }
    });
  }
  searchInputChanged(event) {
    this.searchTerms.next(event.target.value);
    this.currentPage = 1;
  }
  onRoleChange(role) {
    this.selectedRole = role;
    this.currentPage = 1;
    this.getUsersList();
  }
  onTrainingStatusChange(trainingStatus) {
    this.currentPage = 1;
    this.onFilterChange('trainingStatus', trainingStatus);
  }
  onStatusChange(status) {
    this.currentPage = 1;
    if (status) {
      if (status === 'active') {
        this.includeDeleted = 0;
      } else if (status === 'inactive') {
        this.includeDeleted = 2;
      }
    } else {
      this.includeDeleted = 1;
    }
    this.onFilterChange('includeDeleted', this.includeDeleted);
  }
  toggleFilter() {
    if (this.showAdditionalFilters && this.filterObj?.state && !this.stateControl.disabled) {
      this.onFilterChange('state', null);
    }
    this.showAdditionalFilters = !this.showAdditionalFilters;
  }
  getUsersList(filter) {
    const profileType = this.getType()?.type === 'user' ? 'teacher' : 'admin';
    const observable = this.commonStaffUserService.list({
      profileType,
      page: this.currentPage,
      limit: this.pageSize,
      filters: filter
    });
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
    this.paginationSubscription = observable.subscribe({
      next: res => {
        if (res?.data?.results) {
          this.usersList = res.data.results;
          this.totalItems = res.data.totalItems;
        } else {
          this.usersList = [];
          this.totalItems = 0;
        }
      },
      error: err => {
        console.error('Error while fetching list', err);
        this.usersList = [];
        this.totalItems = 0;
      }
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
    if (isUpload && this.fileToUpload) {
      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      this.commonStaffUserService.importUsers(formData).subscribe({
        next: res => {
          this.utility.showSuccess(res.message);
          this.modalService.showBlukUploadDialog = false;
        },
        error: err => {
          if (err?.error?.errorUrl) {
            this.errorUrl = err?.error?.errorUrl;
            this.modalService.showBlukUploadDialog = false;
            this.modalService.showUploadErrorDialog = true;
          } else {
            this.utility.showError(err.error.message);
          }
        }
      });
    }
  }
  /**
     * pagination
     */
  onPageChange(page) {
    this.currentPage = page;
    this.getUsersList(this.filterObj);
  }
  getType() {
    if (this.lessonContentType) {
      return this.contentListConfig[this.lessonContentType];
    } else {
      return null;
    }
  }
  canManage(item, permission) {
    const grants = this.utility.getPermission(permission);
    return grants && item.roles.every(assignment => (0,_utility_scope_util__WEBPACK_IMPORTED_MODULE_10__.scopeBelow)(grants, assignment.role.scopeType, assignment.role.scopeType === 'SCHOOL' ? item.school : assignment.dep));
  }
  activateUser(id) {
    this.commonStaffUserService.activate(id).subscribe({
      next: res => {
        this.utility.handleResponse(res);
        this.getUsersList();
      },
      error: err => {
        this.utility.handleError(err);
      }
    });
  }
  exportUsersListToExcel() {
    if (!this.usersList.length) {
      return;
    }
    this.commonStaffUserService.exportTeachers(this.filterObj).subscribe({
      next: res => {
        this.utility.handleResponse(res);
      },
      error: err => {
        this.utility.handleError(err);
      }
    });
  }
  navigateToTraining() {
    this.router.navigate(['/training']);
  }
  toTitleCase(str) {
    return str.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
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
    this.getUsersList(this.filterObj);
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
      this.selectOnly('school', this.schoolDropdownOptions, this.schoolControl, '_id', () => this.getUsersList(this.filterObj));
    });
  }
  resetStates() {
    this.zoneControl.enable({
      emitEvent: false
    });
    this.districtControl.enable({
      emitEvent: false
    });
    this.blockControl.enable({
      emitEvent: false
    });
    this.schoolControl.enable({
      emitEvent: false
    });
    this.zoneDropdownOptions = [];
    this.districtDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.filterObj.zone = '';
    this.filterObj.district = '';
    this.filterObj.block = '';
    this.filterObj.school = '';
    this.zoneControl.reset();
    this.districtControl.reset();
    this.blockControl.reset();
    this.schoolControl.reset();
  }
  resetZone() {
    this.districtControl.enable({
      emitEvent: false
    });
    this.blockControl.enable({
      emitEvent: false
    });
    this.schoolControl.enable({
      emitEvent: false
    });
    this.filterObj.district = '';
    this.filterObj.block = '';
    this.filterObj.school = '';
    this.districtDropdownOptions = [];
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.districtControl.reset();
    this.blockControl.reset();
    this.schoolControl.reset();
  }
  resetDistrict() {
    this.blockControl.enable({
      emitEvent: false
    });
    this.schoolControl.enable({
      emitEvent: false
    });
    this.filterObj.block = '';
    this.filterObj.school = '';
    this.blockDropdownOptions = [];
    this.schoolDropdownOptions = [];
    this.blockControl.reset();
    this.schoolControl.reset();
  }
  resetBlock() {
    this.schoolControl.enable({
      emitEvent: false
    });
    this.filterObj.school = '';
    this.schoolDropdownOptions = [];
    this.schoolControl.reset();
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
  * Function to set zone dropdown values
  * @param selectedStateValue
  */
  setZoneDropdownValues(selectedStateValue) {
    if (selectedStateValue) {
      this.selectedStateObj = this.utility.filterDropdownValues(this.regionsData, 'state', selectedStateValue);
      this.zoneDropdownOptions = this.selectedStateObj.zones.filter(zone => (0,_utility_scope_util__WEBPACK_IMPORTED_MODULE_10__.pathAllowed)(this.scopePaths, {
        state: selectedStateValue,
        zone: zone.name
      }));
      this.selectOnly('zone', this.zoneDropdownOptions, this.zoneControl, 'name', zone => this.setDistrictDropdownValues(zone));
    }
  }
  /**
   * Function to set district dropdown values
   * @param selectedZone
   */
  setDistrictDropdownValues(selectedZone) {
    this.resetZone();
    if (selectedZone) {
      this.selectedZoneObj = this.utility.filterDropdownValues(this.selectedStateObj.zones, 'name', selectedZone);
      this.districtDropdownOptions = this.selectedZoneObj.districts.filter(district => (0,_utility_scope_util__WEBPACK_IMPORTED_MODULE_10__.pathAllowed)(this.scopePaths, {
        state: this.filterObj.state,
        zone: selectedZone,
        district: district.name
      }));
      this.selectOnly('district', this.districtDropdownOptions, this.districtControl, 'name', district => this.setBlockDropdownValues(district));
    }
  }
  /**
   * Function to set block dropdown values
   * @param selectedDistrict
   */
  setBlockDropdownValues(selectedDistrict) {
    this.resetDistrict();
    if (selectedDistrict) {
      this.selectedDistrictObj = this.utility.filterDropdownValues(this.selectedZoneObj.districts, 'name', selectedDistrict);
      this.blockDropdownOptions = this.selectedDistrictObj.blocks.filter(block => (0,_utility_scope_util__WEBPACK_IMPORTED_MODULE_10__.pathAllowed)(this.scopePaths, {
        state: this.filterObj.state,
        zone: this.filterObj.zone,
        district: selectedDistrict,
        block: block.name
      }));
      this.selectOnly('block', this.blockDropdownOptions, this.blockControl, 'name', () => this.getSchoolFilteredList());
    }
  }
  selectOnly(type, options, control, valueKey, selected) {
    control.enable({
      emitEvent: false
    });
    if (options.length !== 1) return;
    const value = options[0][valueKey];
    control.setValue(value, {
      emitEvent: false
    });
    control.disable({
      emitEvent: false
    });
    this.filterObj[type] = value;
    selected(value);
  }
  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.paginationSubscription) {
      this.paginationSubscription.unsubscribe();
    }
    if (this.nonPaginationSubscription) {
      this.nonPaginationSubscription.unsubscribe();
    }
  }
  static {
    this.ɵfac = function UserStaffListComponent_Factory(t) {
      return new (t || UserStaffListComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_17__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_23__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_23__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_modal_modal_service__WEBPACK_IMPORTED_MODULE_11__.ModalService), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](src_app_view_admin_user_management_user_management_service__WEBPACK_IMPORTED_MODULE_12__.UserManagementService), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_13__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_services_staff_user_common_service__WEBPACK_IMPORTED_MODULE_14__.StaffUserCommonService), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](_services_master_service__WEBPACK_IMPORTED_MODULE_15__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdirectiveInject"](src_app_view_admin_school_management_school_management_service__WEBPACK_IMPORTED_MODULE_16__.SchoolManagementService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵdefineComponent"]({
      type: UserStaffListComponent,
      selectors: [["app-user-staff-list"]],
      viewQuery: function UserStaffListComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵviewQuery"](_c0, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵviewQuery"](_c1, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵloadQuery"]()) && (ctx.dropdownContent = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵloadQuery"]()) && (ctx.dropdownContainer = _t.first);
        }
      },
      hostBindings: function UserStaffListComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_click_HostBindingHandler($event) {
            return ctx.clickInside($event);
          });
        }
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵStandaloneFeature"]],
      decls: 51,
      vars: 39,
      consts: [[1, "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "text-2xl", "md:text-[30px]", "font-bold", "text-content", "md:leading-[48px]"], [1, "table-section", "border", "text-content", "rounded", "my-5", "px-4", "py-6", "md:px-6", "md:py-8", "bg-white"], [1, "flex", "flex-col", "gap-4", "sm:gap-5", "sm:flex-row", "sm:justify-between", "sm:items-start"], [1, "text-content", "text-2xl", "md:text-[30px]", "font-bold", "md:leading-[48px]"], [1, "flex", "flex-col", "sm:flex-row", "sm:flex-wrap", "gap-2", "w-full", "sm:w-auto"], ["class", "btn-outline-primary h-9 w-full sm:w-auto", 3, "hasPermission", "click", 4, "ngIf"], [1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission", "click"], [1, "flex", "items-center", "justify-center", "gap-2"], ["src", "assets/icons/E add.svg", "alt", ""], [1, "text-nowrap"], ["class", "btn-primary h-9 w-full sm:w-auto", 3, "hasPermission", "disabled", "click", 4, "ngIf"], [1, "text-sm", "my-4", "md:my-6"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "gap-3", "items-end", 3, "ngClass"], [1, "w-full", "min-w-0"], ["for", "", 1, "form-control-label"], [1, "search-icon", "w-full", "flex", "items-center", "h-9"], ["src", "assets/icons/search.svg", "alt", "", 1, "mr-2"], ["type", "text", 1, "appearance-none", "border", "border-content-50", "rounded", "pl-10", "py-2", "px-3", "text-content", "leading-tight", "focus:outline-none", "bg-surface-muted", "w-full", "h-9", 3, "ngModel", "placeholder", "ngModelChange", "input"], [1, "w-full", "min-w-0", "cursor-pointer"], [3, "dropDownValues", "config", "valueUpdate"], ["class", "w-full min-w-0 cursor-pointer", 4, "ngIf"], ["class", "btn-primary flex items-center justify-center gap-2 w-full sm:w-40 xl:w-9 xl:h-9 xl:p-0 xl:justify-self-start", 3, "title", "click", 4, "ngIf"], ["class", "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-3 my-4", 4, "ngIf"], [1, "space-y-4", "md:hidden"], ["class", "text-center text-content-60 py-4 border rounded-xl", 4, "ngIf"], ["class", "rounded-xl border p-4 bg-white shadow-sm", 4, "ngFor", "ngForOf"], [1, "hidden", "md:block", "w-full", "overflow-x-auto"], ["aria-label", "User list", 1, "table-auto", "min-w-[900px]", "w-full", "border", "mt-3", "rounded-lg", "text-content"], [1, "bg-primary-60", "rounded-lg", "border-b"], ["class", "text-left p-4 rounded border-r text-sm text-content", 4, "ngFor", "ngForOf"], [4, "ngIf"], ["class", "border-b", 4, "ngFor", "ngForOf"], [3, "totalItems", "pageSize", "currentPage", "pageChange"], [1, "btn-outline-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission", "click"], ["src", "assets/icons/Vector (1).svg", "alt", ""], [1, "btn-primary", "h-9", "w-full", "sm:w-auto", 3, "hasPermission", "disabled", "click"], ["src", "assets/icons/upload_light.svg", "alt", ""], [1, "btn-primary", "flex", "items-center", "justify-center", "gap-2", "w-full", "sm:w-40", "xl:w-9", "xl:h-9", "xl:p-0", "xl:justify-self-start", 3, "title", "click"], ["src", "assets/icons/filter-plus.svg", "alt", "", 4, "ngIf"], ["src", "assets/icons/filter-minus.svg", "alt", "", 4, "ngIf"], ["src", "assets/icons/filter-plus.svg", "alt", ""], ["src", "assets/icons/filter-minus.svg", "alt", ""], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "xl:grid-cols-5", "gap-3", "my-4"], [3, "dropDownCtrl", "dropDownValues", "config", "valueUpdate"], [1, "text-center", "text-content-60", "py-4", "border", "rounded-xl"], [1, "rounded-xl", "border", "p-4", "bg-white", "shadow-sm"], [1, "flex", "items-start", "justify-between", "gap-3"], [1, "min-w-0"], [1, "font-semibold", "break-words"], [1, "text-sm", "text-content-60", "mt-1"], [1, "relative", "shrink-0"], [1, "py-1", "px-2", "rounded", "inline-flex", "items-center", 3, "click"], ["src", "assets/icons/more_vert.svg", "alt", "", 1, "w-5"], ["class", "absolute right-0 top-full mt-1 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50", "role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 4, "ngIf"], [1, "mt-4", "grid", "grid-cols-2", "gap-3", "text-sm"], ["class", "col-span-2", 4, "ngIf"], [1, "text-xs", "text-content-60"], [1, "break-words"], [1, "inline-flex", "px-3", "py-0.5", "sm:py-1", "rounded-full", 3, "ngClass"], ["role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 1, "absolute", "right-0", "top-full", "mt-1", "w-48", "rounded-md", "shadow-lg", "bg-white", "ring-1", "ring-black", "ring-opacity-5", "focus:outline-none", "z-50"], [1, "h-10", "mt-2", "hover:bg-shade-80", "cursor-pointer", 3, "click"], ["role", "menuitem", 1, "block", "px-4", "py-2", "text-sm", "text-content"], [1, "flex", "items-center"], ["src", "assets/icons/Visibility.svg", "alt", "", 1, "mx-2"], ["class", "h-10 hover:bg-shade-80 cursor-pointer", 3, "click", 4, "ngIf"], ["class", "h-10 mb-2 hover:bg-shade-80 cursor-pointer", 4, "ngIf"], [1, "h-10", "hover:bg-shade-80", "cursor-pointer", 3, "click"], ["src", "assets/icons/Vector.svg", "alt", "", 1, "mx-2"], [1, "h-10", "mb-2", "hover:bg-shade-80", "cursor-pointer"], ["role", "menuitem", 1, "block", "px-4", "py-2", "text-sm", "text-content", 3, "click"], ["src", "assets/icons/Vector (2).svg", "alt", "", 1, "mx-2"], [1, "text-error"], ["src", "assets/icons/switch-on.svg", "alt", "", 1, "mx-2", "w-7"], [1, "text-success"], [1, "col-span-2"], [1, "text-left", "p-4", "rounded", "border-r", "text-sm", "text-content"], [1, "text-center", "text-content-60", "py-2"], [1, "border-b"], [1, "text-sm", "p-4", "border-r", "w-72", "max-w-[20vw]", "break-all"], [1, "text-sm", "p-4", "border-r", "whitespace-nowrap", "w-36"], ["class", "text-sm p-4 border-r max-w-[20vw] break-all", 4, "ngIf"], [1, "text-sm", "p-4", "border-r", "whitespace-nowrap", "w-36", "text-center"], [1, "px-3", "py-2", "rounded-full", 3, "ngClass"], ["class", "text-sm p-4 border-r whitespace-nowrap w-36 text-center", 4, "ngIf"], [1, "text-sm", "p-4", "relative", "#dropdownContainer", "whitespace-nowrap", "w-32"], [1, "flex", "justify-center"], [1, "relative", 3, "click"], [1, "py-2", "px-4", "rounded", "inline-flex", "items-center"], ["class", "fixed w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50", "role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 3, "ngStyle", 4, "ngIf"], [1, "text-sm", "p-4", "border-r", "max-w-[20vw]", "break-all"], ["role", "menu", "aria-orientation", "vertical", "aria-labelledby", "options-menu", 1, "fixed", "w-48", "rounded-md", "shadow-lg", "bg-white", "ring-1", "ring-black", "ring-opacity-5", "focus:outline-none", "z-50", 3, "ngStyle"], [3, "modalHeader", "modalSubHeader", "tableData", "sendDetails"], [3, "context", "allowedFileTypes", "fileUploaded", "upload"], [3, "modalHeader", "errorUrl"]],
      template: function UserStaffListComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](0, "div", 0)(1, "h1", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](3, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](4, "div", 2)(5, "div", 3)(6, "h2", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](8, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](9, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](10, UserStaffListComponent_button_10_Template, 6, 5, "button", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](11, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("click", function UserStaffListComponent_Template_button_click_11_listener() {
            return ctx.openAddUserFormComp();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](12, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](13, "img", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](14, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](16, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](17, UserStaffListComponent_button_17_Template, 6, 6, "button", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](18, "div", 12)(19, "div", 13)(20, "div", 14)(21, "label", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtext"](22);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](23, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](24, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelement"](25, "img", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](26, "input", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("ngModelChange", function UserStaffListComponent_Template_input_ngModelChange_26_listener($event) {
            return ctx.searchText = $event;
          })("input", function UserStaffListComponent_Template_input_input_26_listener($event) {
            return ctx.searchInputChanged($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipe"](27, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](28, "div", 19)(29, "app-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("valueUpdate", function UserStaffListComponent_Template_app_dropdown_valueUpdate_29_listener($event) {
            return ctx.onFilterChange("role", $event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](30, "div", 19)(31, "app-dropdown", 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("valueUpdate", function UserStaffListComponent_Template_app_dropdown_valueUpdate_31_listener($event) {
            return ctx.onStatusChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](32, UserStaffListComponent_div_32_Template, 2, 2, "div", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](33, UserStaffListComponent_button_33_Template, 3, 4, "button", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](34, UserStaffListComponent_div_34_Template, 11, 16, "div", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](35, "div", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](36, UserStaffListComponent_div_36_Template, 3, 3, "div", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](37, UserStaffListComponent_div_37_Template, 29, 24, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](38, "div", 27)(39, "table", 28)(40, "thead")(41, "tr", 29);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](42, UserStaffListComponent_th_42_Template, 3, 3, "th", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](43, "tbody");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](44, UserStaffListComponent_tr_44_Template, 4, 4, "tr", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementContainerStart"](45);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](46, UserStaffListComponent_tr_46_Template, 21, 20, "tr", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementContainerEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](47, UserStaffListComponent_app_modal_47_Template, 2, 3, "app-modal", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](48, UserStaffListComponent_app_modal_48_Template, 2, 2, "app-modal", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementStart"](49, "app-pagination", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵlistener"]("pageChange", function UserStaffListComponent_Template_app_pagination_pageChange_49_listener($event) {
            return ctx.onPageChange($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtemplate"](50, UserStaffListComponent_app_modal_50_Template, 2, 2, "app-modal", 31);
        }
        if (rf & 2) {
          let tmp_0_0;
          let tmp_1_0;
          let tmp_2_0;
          let tmp_4_0;
          let tmp_5_0;
          let tmp_6_0;
          let tmp_14_0;
          let tmp_15_0;
          let tmp_16_0;
          let tmp_19_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](3, 28, ((tmp_0_0 = ctx.getType()) == null ? null : tmp_0_0.type) === "user" ? "Teacher Management" : "Staff Management"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](8, 30, ((tmp_1_0 = ctx.getType()) == null ? null : tmp_1_0.type) === "user" ? "Teacher List" : "Staff List"));
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx.getType()) == null ? null : tmp_2_0.type) === "user");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("hasPermission", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpureFunction0"](38, _c6));
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](16, 32, ((tmp_4_0 = ctx.getType()) == null ? null : tmp_4_0.type) === "user" ? "Add New Teacher" : "Add New Staff"));
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ((tmp_5_0 = ctx.getType()) == null ? null : tmp_5_0.type) === "user");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngClass", ((tmp_6_0 = ctx.getType()) == null ? null : tmp_6_0.type) === "user" ? "xl:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))_auto]" : "xl:grid-cols-[minmax(0,2fr)_repeat(2,minmax(0,1fr))]");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](23, 34, "Search"));
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵpipeBind1"](27, 36, "Search"));
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngModel", ctx.searchText);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("dropDownValues", ctx.userRolesDropdownOptions)("config", ctx.userRolesDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("dropDownValues", ctx.userStatusDropdownOptions)("config", ctx.userStatusDropdownconfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ((tmp_14_0 = ctx.getType()) == null ? null : tmp_14_0.type) === "user");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ((tmp_15_0 = ctx.getType()) == null ? null : tmp_15_0.type) === "user");
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ((tmp_16_0 = ctx.getType()) == null ? null : tmp_16_0.type) === "user" && ctx.showAdditionalFilters);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", !ctx.usersList || ctx.usersList.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngForOf", ctx.usersList);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngForOf", (tmp_19_0 = ctx.getType()) == null ? null : tmp_19_0.table_headers);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", !ctx.usersList || ctx.usersList.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngForOf", ctx.usersList);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx.modalService.showDeleteUserDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx.modalService.showBlukUploadDialog);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("totalItems", ctx.totalItems)("pageSize", ctx.pageSize)("currentPage", ctx.currentPage);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_17__["ɵɵproperty"]("ngIf", ctx.modalService.showUploadErrorDialog);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_24__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_24__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_24__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_24__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_24__.NgStyle, _angular_common__WEBPACK_IMPORTED_MODULE_24__.TitleCasePipe, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.NgModel, _angular_forms__WEBPACK_IMPORTED_MODULE_18__.ReactiveFormsModule, _dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_1__.DropdownComponent, _modal_modal_component__WEBPACK_IMPORTED_MODULE_2__.ModalComponent, _disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_3__.DisablePopupComponent, _upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_4__.UploadPopupComponent, _pagination_pagination_component__WEBPACK_IMPORTED_MODULE_5__.PaginationComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_25__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_25__.TranslatePipe, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_26__.NgSelectModule, src_app_core_directives_has_permission_directive__WEBPACK_IMPORTED_MODULE_6__.HasPermissionDirective, _upload_error_popup_upload_error_popup_component__WEBPACK_IMPORTED_MODULE_7__.UploadErrorPopupComponent],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ1c2VyLXN0YWZmLWxpc3QuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvdXNlci1zdGFmZi1saXN0L3VzZXItc3RhZmYtbGlzdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0EsZ0xBQWdMIiwic291cmNlUm9vdCI6IiJ9 */"],
      data: {
        animation: [_utility_animations_util__WEBPACK_IMPORTED_MODULE_8__.slideInOutAnimation]
      }
    });
  }
}

/***/ }),

/***/ 80798:
/*!**************************************************************!*\
  !*** ./src/app/shared/services/staff-user-common.service.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StaffUserCommonService: () => (/* binding */ StaffUserCommonService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs */ 70271);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 61873);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 37580);






class StaffUserCommonService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  constructor(http) {
    super(http);
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
    this.setUri('users');
  }
  getById(id) {
    return this.get(id);
  }
  getRoles() {
    return this.http.get(`${this.baseUrl}/roles`);
  }
  getRegions() {
    return this.http.get(`${this.baseUrl}/regions/list?limit=999`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data.results));
  }
  getAssignmentData() {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.forkJoin)({
      roles: this.http.get(`${this.baseUrl}/roles`),
      regions: this.getRegions()
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(({
      roles,
      regions
    }) => ({
      roles: roles.data.results,
      regions
    })));
  }
  getSchool(id) {
    return this.http.get(`${this.baseUrl}/school/${id}`).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data));
  }
  getSchools(scope) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpParams().set('limit', '0').set('filter[state]', scope.state).set('filter[zone]', scope.zone).set('filter[district]', scope.district).set('filter[block]', scope.block);
    return this.http.get(`${this.baseUrl}/school/list`, {
      params
    }).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_2__.map)(response => response.data.results.map(school => ({
      ...school,
      label: `${school.name} (${school.schoolId})`
    }))));
  }
  deactivate(id) {
    return this.http.put(`${this.baseUrl}/users/${id}/deactivate`, {});
  }
  activate(id) {
    return this.http.put(`${this.baseUrl}/users/${id}/activate`, {});
  }
  importUsers(formdata) {
    return this.http.post(`${this.baseUrl}/users/import`, formdata);
  }
  list(opts) {
    let params = this.buildFilterParams(opts.filters, opts.search).set('filter[profileType]', opts.profileType);
    if (opts.page != null && opts.limit != null) {
      params = params.set('page', String(opts.page)).set('limit', String(opts.limit));
    }
    return this.http.get(`${this.baseUrl}/users`, {
      params
    });
  }
  createTeacher(form) {
    return this.post('', {
      identity: {
        name: form.name.trim(),
        phone: String(form.phone)
      },
      roles: form.roles,
      profiles: {
        teacher: {
          facilities: [],
          classes: [],
          isProfileCompleted: false
        }
      }
    });
  }
  updateTeacher(id, form) {
    return this.http.put(`${this.baseUrl}/users/${id}`, {
      identity: {
        name: form.name.trim(),
        phone: String(form.phone)
      },
      roles: form.roles
    });
  }
  createStaff(form) {
    return this.post('', {
      identity: {
        name: form.name.trim(),
        phone: String(form.phone),
        email: form.email.trim().toLowerCase()
      },
      roles: form.roles,
      profiles: {
        admin: {
          state: form.state
        }
      }
    });
  }
  updateStaff(id, form) {
    return this.put(id, {
      identity: {
        name: form.name.trim(),
        phone: String(form.phone),
        email: form.email.trim().toLowerCase()
      },
      roles: form.roles,
      profiles: {
        admin: {
          state: form.state
        }
      }
    });
  }
  exportTeachers(filters, search) {
    return this.http.get(`${this.baseUrl}/users/export`, {
      params: this.buildFilterParams(filters, search).set('filter[profileType]', 'teacher')
    });
  }
  buildFilterParams(filters, search) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpParams();
    if (search) params = params.set('search', search);
    if (!filters) return params;
    for (const [key, value] of Object.entries(filters)) {
      if (value == null || value === '') continue;
      if (key === 'search' || key === 'includeDeleted') params = params.set(key, value);else if (Array.isArray(value)) value.forEach(v => params = params.append(`filter[${key}]`, v));else params = params.set(`filter[${key}]`, value);
    }
    return params;
  }
  static {
    this.ɵfac = function StaffUserCommonService_Factory(t) {
      return new (t || StaffUserCommonService)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_4__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineInjectable"]({
      token: StaffUserCommonService,
      factory: StaffUserCommonService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=default-src_app_shared_components_user-manage_user-manage_component_ts-src_app_shared_compone-8973ec.692290c5a1630093.js.map