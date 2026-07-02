"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["default-src_app_shared_components_disable-popup_disable-popup_component_ts-src_app_shared_com-3e4ea0"],{

/***/ 51541:
/*!****************************************************************************!*\
  !*** ./src/app/shared/components/disable-popup/disable-popup.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DisablePopupComponent: () => (/* binding */ DisablePopupComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/cdk/a11y */ 72102);
/* harmony import */ var _modal_modal_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modal/modal.service */ 51133);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);








function DisablePopupComponent_th_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "th", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const header_r10 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", header_r10, " ");
  }
}
function DisablePopupComponent_td_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r1.tableData.data == null ? null : ctx_r1.tableData.data.school_name));
  }
}
function DisablePopupComponent_td_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r2.tableData.data == null ? null : ctx_r2.tableData.data.school_id);
  }
}
function DisablePopupComponent_td_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r3.tableData.data == null ? null : ctx_r3.tableData.data.district));
  }
}
function DisablePopupComponent_td_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r4.tableData.data == null ? null : ctx_r4.tableData.data.zone));
  }
}
function DisablePopupComponent_td_17_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r5.tableData.data == null ? null : ctx_r5.tableData.data.user_name));
  }
}
function DisablePopupComponent_td_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r6.toast.formatValue(ctx_r6.tableData.data == null ? null : ctx_r6.tableData.data.role_name)));
  }
}
function DisablePopupComponent_td_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 15)(1, "span", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngClass", (ctx_r7.tableData.data == null ? null : ctx_r7.tableData.data.status) === "Active" ? "success-chip" : "error-chip");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx_r7.tableData.data == null ? null : ctx_r7.tableData.data.status);
  }
}
function DisablePopupComponent_td_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "td", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "img", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
function DisablePopupComponent_div_21_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("There is ", ctx_r11.users_of_school, " teacher registered with this school. Deactivating this school will deactivate the teacher also. Do you want to proceed?");
  }
}
function DisablePopupComponent_div_21_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("There are ", ctx_r12.users_of_school, " teachers registered with this school. Deactivating this school will deactivate the teachers also. Do you want to proceed?");
  }
}
function DisablePopupComponent_div_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 18)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](2, DisablePopupComponent_div_21_span_2_Template, 2, 1, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](3, DisablePopupComponent_div_21_span_3_Template, 2, 1, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r9.users_of_school === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx_r9.users_of_school > 1);
  }
}
class DisablePopupComponent {
  ngOnInit() {
    this.previousActiveElement = document.activeElement;
    console.log('tabledata frm disable popup', this.tableData);
  }
  ngOnDestroy() {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }
  handleEscape(event) {
    this.closeModal();
  }
  /**
   * Class constructor
   * @param modalService ModalService
   */
  constructor(modalService, toast) {
    this.modalService = modalService;
    this.toast = toast;
    this.previousActiveElement = null;
    this.sendDetails = new _angular_core__WEBPACK_IMPORTED_MODULE_2__.EventEmitter();
  }
  /**
   * Function to close popup
   */
  closeModal() {
    this.modalService.showDeleteUserDialog = false;
  }
  /**
   * Function to disable user
   */
  disableUser() {
    this.sendDetails.emit(this.tableData);
    this.modalService.showDeleteUserDialog = false;
  }
  static {
    this.ɵfac = function DisablePopupComponent_Factory(t) {
      return new (t || DisablePopupComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_modal_modal_service__WEBPACK_IMPORTED_MODULE_0__.ModalService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__.UtilityService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: DisablePopupComponent,
      selectors: [["app-disable-popup"]],
      hostBindings: function DisablePopupComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("keydown.escape", function DisablePopupComponent_keydown_escape_HostBindingHandler($event) {
            return ctx.handleEscape($event);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresolveDocument"]);
        }
      },
      inputs: {
        modalHeader: "modalHeader",
        modalSubHeader: "modalSubHeader",
        tableData: "tableData",
        users_of_school: "users_of_school"
      },
      outputs: {
        sendDetails: "sendDetails"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵStandaloneFeature"]],
      decls: 27,
      vars: 13,
      consts: [["role", "dialog", "aria-modal", "true", "aria-labelledby", "disable-dialog-title", "cdkTrapFocus", "", 1, "disable-popup-wrapper", "z-100", 3, "cdkTrapFocusAutoCapture"], [1, "flex", "items-center", "justify-between", "mb-2"], ["id", "disable-dialog-title", 1, "font-bold", "text-[20px]", "text-content"], ["src", "assets/icons/remove.svg", "alt", "", 1, "w-5", "h-5", "cursor-pointer", 3, "click"], [1, "text-sm"], ["aria-label", "disable-popUp", 1, "table-auto", "w-full", "border", "mt-5", "rounded-lg", "text-content"], [1, "bg-primary-60", "rounded-lg", "border-b"], ["class", "text-left p-4 rounded border-r", 4, "ngFor", "ngForOf"], [1, "border-b"], ["class", "p-4 border-r", 4, "ngIf"], ["class", "my-3", 4, "ngIf"], [1, "buttons", "mt-8", "flex", "items-center", "justify-end", "gap-2"], [1, "w-24", "btn-outline-primary", 3, "click"], [1, "btn-primary", "w-24", 3, "click"], [1, "text-left", "p-4", "rounded", "border-r"], [1, "p-4", "border-r"], [3, "ngClass"], ["src", "assets/icons/more_vert.svg", "alt", ""], [1, "my-3"], [4, "ngIf"]],
      template: function DisablePopupComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "img", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function DisablePopupComponent_Template_img_click_4_listener() {
            return ctx.closeModal();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "p", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](7, "table", 5)(8, "thead")(9, "tr", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](10, DisablePopupComponent_th_10_Template, 2, 1, "th", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "tbody")(12, "tr", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](13, DisablePopupComponent_td_13_Template, 3, 3, "td", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](14, DisablePopupComponent_td_14_Template, 2, 1, "td", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](15, DisablePopupComponent_td_15_Template, 3, 3, "td", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](16, DisablePopupComponent_td_16_Template, 3, 3, "td", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](17, DisablePopupComponent_td_17_Template, 3, 3, "td", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](18, DisablePopupComponent_td_18_Template, 3, 3, "td", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](19, DisablePopupComponent_td_19_Template, 3, 2, "td", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](20, DisablePopupComponent_td_20_Template, 2, 0, "td", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](21, DisablePopupComponent_div_21_Template, 4, 2, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](22, "div", 11)(23, "button", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function DisablePopupComponent_Template_button_click_23_listener() {
            return ctx.closeModal();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](24, "Cancel");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](25, "button", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("click", function DisablePopupComponent_Template_button_click_25_listener() {
            return ctx.disableUser();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](26, "Disable");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("cdkTrapFocusAutoCapture", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.modalHeader);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](ctx.modalSubHeader);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.tableData == null ? null : ctx.tableData.header);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.tableData.data == null ? null : ctx.tableData.data.school_name);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.tableData.data == null ? null : ctx.tableData.data.school_id);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.tableData.data == null ? null : ctx.tableData.data.district);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.tableData.data == null ? null : ctx.tableData.data.zone);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.tableData.data == null ? null : ctx.tableData.data.user_name);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.tableData.data == null ? null : ctx.tableData.data.role_name);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.tableData.data == null ? null : ctx.tableData.data.status);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.tableData.data == null ? null : ctx.tableData.data.more_icon);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", (ctx.tableData.data == null ? null : ctx.tableData.data.school_name) && ctx.users_of_school);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_3__.TitleCasePipe, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_4__.A11yModule, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_4__.CdkTrapFocus],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJkaXNhYmxlLXBvcHVwLmNvbXBvbmVudC5zY3NzIn0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZGlzYWJsZS1wb3B1cC9kaXNhYmxlLXBvcHVwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSw0S0FBNEsiLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 12321:
/*!**************************************************************************************!*\
  !*** ./src/app/shared/components/upload-error-popup/upload-error-popup.component.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UploadErrorPopupComponent: () => (/* binding */ UploadErrorPopupComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _modal_modal_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modal/modal.service */ 51133);



class UploadErrorPopupComponent {
  constructor(modalService) {
    this.modalService = modalService;
  }
  /**
   * Function to close popup
   */
  closeModal() {
    this.modalService.showUploadErrorDialog = false;
  }
  static {
    this.ɵfac = function UploadErrorPopupComponent_Factory(t) {
      return new (t || UploadErrorPopupComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_modal_modal_service__WEBPACK_IMPORTED_MODULE_0__.ModalService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: UploadErrorPopupComponent,
      selectors: [["app-upload-error-popup"]],
      inputs: {
        modalHeader: "modalHeader",
        errorUrl: "errorUrl"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
      decls: 13,
      vars: 2,
      consts: [[1, "disable-popup-wrapper", "z-100"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "font-bold", "text-[20px]", "text-content"], ["src", "assets/icons/remove.svg", "alt", "", 1, "w-5", "h-5", "cursor-pointer", 3, "click"], ["target", "_blank", 1, "text-primary", "underline", 3, "href", "click"], [1, "buttons", "mt-8", "flex", "items-center", "justify-end", "gap-2"], [1, "w-24", "btn-primary", 3, "click"]],
      template: function UploadErrorPopupComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "h1", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](4, "img", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UploadErrorPopupComponent_Template_img_click_4_listener() {
            return ctx.closeModal();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, " We encountered issues with your upload. Please review the issue report to understand what went wrong. You can download the report using the link below: ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](7, "br");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "a", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UploadErrorPopupComponent_Template_a_click_8_listener() {
            return ctx.closeModal();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "[Click here to download the error report]");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 5)(11, "button", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function UploadErrorPopupComponent_Template_button_click_11_listener() {
            return ctx.closeModal();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Close");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.modalHeader);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("href", ctx.errorUrl, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJ1cGxvYWQtZXJyb3ItcG9wdXAuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvdXBsb2FkLWVycm9yLXBvcHVwL3VwbG9hZC1lcnJvci1wb3B1cC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQ0Esb0xBQW9MIiwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 86487:
/*!**************************************************************************!*\
  !*** ./src/app/shared/components/upload-popup/upload-popup.component.ts ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UploadPopupComponent: () => (/* binding */ UploadPopupComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var ngx_file_drop__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ngx-file-drop */ 26823);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../utility/constant.util */ 64487);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/cdk/a11y */ 72102);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _modal_modal_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../modal/modal.service */ 51133);
/* harmony import */ var _services_excel_download_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../services/excel_download.service */ 19010);
















function UploadPopupComponent_ng_template_13_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 9)(1, "img", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UploadPopupComponent_ng_template_13_Template_img_click_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4);
      const openFileSelector_r2 = restoredCtx.openFileSelector;
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](openFileSelector_r2());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](2, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UploadPopupComponent_ng_template_13_Template_button_click_2_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4);
      const openFileSelector_r2 = restoredCtx.openFileSelector;
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](openFileSelector_r2());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "p", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "button", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UploadPopupComponent_ng_template_13_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r4);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r6.downloadTemplate());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](10, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 3, "Browse Files"), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](7, 5, "File supported .xlsx file, up to 5MB in size"), ". ");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](10, 7, "Download Template"));
  }
}
function UploadPopupComponent_div_14_div_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 17)(1, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](3, "button", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UploadPopupComponent_div_14_div_4_Template_button_click_3_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵrestoreView"](_r11);
      const i_r9 = restoredCtx.index;
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresetView"](ctx_r10.deleteFile(i_r9));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelement"](4, "img", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r8 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](item_r8.relativePath);
  }
}
function UploadPopupComponent_div_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 14)(1, "p", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](4, UploadPopupComponent_div_14_div_4_Template, 5, 1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](3, 2, "Uploaded File"));
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngForOf", ctx_r1.files);
  }
}
class UploadPopupComponent {
  ngOnInit() {
    this.previousActiveElement = document.activeElement;
    console.log('contxt', this.context);
  }
  ngOnDestroy() {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }
  handleEscape(event) {
    this.closeModal();
  }
  /**
   * Class constructor
   * @param utilityService UtilityService
   * @param modalService ModalService
   */
  constructor(utilityService, modalService, excelDownloadService) {
    this.utilityService = utilityService;
    this.modalService = modalService;
    this.excelDownloadService = excelDownloadService;
    this.previousActiveElement = null;
    this.files = [];
    this.allowedFileTypes = [];
    this.multiUpload = false;
    this.fileUploaded = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
    this.upload = new _angular_core__WEBPACK_IMPORTED_MODULE_4__.EventEmitter();
  }
  /**
   * Getter function to get file types
   */
  get acceptFileTypes() {
    return this.allowedFileTypes.join(', ');
  }
  /**
   * Function triggered on upload
   * @param files
   */
  dropped(files) {
    this.files = files;
    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry;
        fileEntry.file(file => {
          const fileType = `.${file.name.split('.').pop()}`;
          if (!this.allowedFileTypes.includes(fileType)) {
            this.utilityService.showWarning(`Unsupported file type. Please upload a file with the following extensions: ${this.allowedFileTypes.join(', ')}`);
            this.files = [];
            return;
          }
          if (file.size > _utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.MAX_FILE_SIZE) {
            this.utilityService.showWarning(`File size exceeds the maximum limit of 5MB.`);
            this.files = [];
            return;
          }
          const fileDetails = {
            path: droppedFile.relativePath,
            file
          };
          this.fileUploaded.emit(fileDetails);
        });
      }
    }
  }
  /**
   * Function to delete uploaded file
   * @param i index
   */
  deleteFile(i) {
    this.files.splice(i, 1);
    this.fileUploaded.emit(this.files);
  }
  /**
   * Function to close the popup
   */
  closeModal() {
    this.modalService.showBlukUploadDialog = false;
  }
  /**
   * Function triggered on upload
   */
  uploadFile() {
    this.upload.emit(true);
  }
  // Function to handle user template download
  downloadTemplate() {
    if (this.context === 'user-management') {
      this.excelDownloadService.downloadTemplate('teacher');
    } else if (this.context === 'school-management') {
      this.excelDownloadService.downloadTemplate('school');
    }
  }
  static {
    this.ɵfac = function UploadPopupComponent_Factory(t) {
      return new (t || UploadPopupComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_modal_modal_service__WEBPACK_IMPORTED_MODULE_2__.ModalService), _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdirectiveInject"](_services_excel_download_service__WEBPACK_IMPORTED_MODULE_3__.ExcelDownloadService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineComponent"]({
      type: UploadPopupComponent,
      selectors: [["app-upload-popup"]],
      hostBindings: function UploadPopupComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("keydown.escape", function UploadPopupComponent_keydown_escape_HostBindingHandler($event) {
            return ctx.handleEscape($event);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵresolveDocument"]);
        }
      },
      inputs: {
        allowedFileTypes: "allowedFileTypes",
        multiUpload: "multiUpload",
        context: "context"
      },
      outputs: {
        fileUploaded: "fileUploaded",
        upload: "upload"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵStandaloneFeature"]],
      decls: 22,
      vars: 14,
      consts: [["role", "dialog", "aria-modal", "true", "aria-labelledby", "upload-dialog-title", "cdkTrapFocus", "", 1, "center", "upload-wrapper", 3, "cdkTrapFocusAutoCapture"], ["id", "upload-dialog-title", 1, "text-lg", "font-bold", "mb-4"], [1, "my-4", "p-4", "rounded", "bg-warn-50", "text-sm", "text-content-80"], ["dropZoneLabel", "Drop files here", 3, "multiple", "accept", "onFileDrop"], ["ngx-file-drop-content-tmp", ""], ["class", "upload-table mt-4", 4, "ngIf"], [1, "flex", "justify-end", "mt-4", "gap-2"], [1, "btn-outline-primary", 3, "click"], [1, "btn-primary", 3, "disabled", "click"], [1, "flex", "flex-col", "p-2"], ["src", "assets/icons/file-upload.svg", "alt", "", 1, "h-16", 3, "click"], ["type", "button", 1, "text-nowrap", 3, "click"], [1, "text-content-100", "text-sm"], [1, "text-nowrap", "text-base", 3, "click"], [1, "upload-table", "mt-4"], [1, "text-sm", "text-content-80"], ["class", "flex flex-wrap-reverse justify-between content-center mt-2 py-2 px-4 rounded-sm border-content-80 bg-shade-80", 4, "ngFor", "ngForOf"], [1, "flex", "flex-wrap-reverse", "justify-between", "content-center", "mt-2", "py-2", "px-4", "rounded-sm", "border-content-80", "bg-shade-80"], [1, "w-60", "truncate"], [1, "btn-danger", 3, "click"], ["src", "assets/icons/delete.svg", "alt", ""]],
      template: function UploadPopupComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](0, "div", 0)(1, "form")(2, "h2", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](5, "div", 2)(6, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](7, "1. Make sure that every column in your file is completely filled.");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](8, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](9, "2. Do not modify the names of the columns in your file.");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](10, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](11, "3. The DISE Code in your file must be an 11-digit number.");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](12, "ngx-file-drop", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("onFileDrop", function UploadPopupComponent_Template_ngx_file_drop_onFileDrop_12_listener($event) {
            return ctx.dropped($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](13, UploadPopupComponent_ng_template_13_Template, 11, 9, "ng-template", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtemplate"](14, UploadPopupComponent_div_14_Template, 5, 4, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](15, "div", 6)(16, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UploadPopupComponent_Template_button_click_16_listener() {
            return ctx.closeModal();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](17);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](18, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementStart"](19, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵlistener"]("click", function UploadPopupComponent_Template_button_click_19_listener() {
            return ctx.uploadFile();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtext"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipe"](21, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("cdkTrapFocusAutoCapture", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](4, 8, "Bulk Upload"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("multiple", ctx.multiUpload)("accept", ctx.acceptFileTypes);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("ngIf", ctx.files.length > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](18, 10, "Cancel"));
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵproperty"]("disabled", ctx.files.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵpipeBind1"](21, 12, "Upload"));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, ngx_file_drop__WEBPACK_IMPORTED_MODULE_6__.NgxFileDropModule, ngx_file_drop__WEBPACK_IMPORTED_MODULE_6__.NgxFileDropComponent, ngx_file_drop__WEBPACK_IMPORTED_MODULE_6__.NgxFileDropContentTemplateDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_7__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.NgForm, _angular_forms__WEBPACK_IMPORTED_MODULE_7__.ReactiveFormsModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslatePipe, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_9__.A11yModule, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_9__.CdkTrapFocus],
      styles: [".upload-wrapper[_ngcontent-%COMP%]     .ngx-file-drop__drop-zone {\n  border-radius: 10px;\n  height: 200px;\n  border: 1px dashed var(--primary-100);\n}\n.upload-wrapper[_ngcontent-%COMP%]     .ngx-file-drop__content {\n  height: 200px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInVwbG9hZC1wb3B1cC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDSTtFQUNJLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHFDQUFBO0FBQVI7QUFFSTtFQUNJLGFBQUE7QUFBUiIsImZpbGUiOiJ1cGxvYWQtcG9wdXAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIudXBsb2FkLXdyYXBwZXJ7XG4gICAgOjpuZy1kZWVwIC5uZ3gtZmlsZS1kcm9wX19kcm9wLXpvbmV7XG4gICAgICAgIGJvcmRlci1yYWRpdXM6IDEwcHg7XG4gICAgICAgIGhlaWdodDogMjAwcHg7XG4gICAgICAgIGJvcmRlcjogMXB4IGRhc2hlZCB2YXIoLS1wcmltYXJ5LTEwMCk7XG4gICAgfVxuICAgIDo6bmctZGVlcCAubmd4LWZpbGUtZHJvcF9fY29udGVudHtcbiAgICAgICAgaGVpZ2h0OiAyMDBweDtcbiAgICB9XG59Il19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvdXBsb2FkLXBvcHVwL3VwbG9hZC1wb3B1cC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDSTtFQUNJLG1CQUFBO0VBQ0EsYUFBQTtFQUNBLHFDQUFBO0FBQVI7QUFFSTtFQUNJLGFBQUE7QUFBUjtBQUNBLGdvQkFBZ29CIiwic291cmNlc0NvbnRlbnQiOlsiLnVwbG9hZC13cmFwcGVye1xuICAgIDo6bmctZGVlcCAubmd4LWZpbGUtZHJvcF9fZHJvcC16b25le1xuICAgICAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgICAgICBoZWlnaHQ6IDIwMHB4O1xuICAgICAgICBib3JkZXI6IDFweCBkYXNoZWQgdmFyKC0tcHJpbWFyeS0xMDApO1xuICAgIH1cbiAgICA6Om5nLWRlZXAgLm5neC1maWxlLWRyb3BfX2NvbnRlbnR7XG4gICAgICAgIGhlaWdodDogMjAwcHg7XG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 19010:
/*!***********************************************************!*\
  !*** ./src/app/shared/services/excel_download.service.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ExcelDownloadService: () => (/* binding */ ExcelDownloadService)
/* harmony export */ });
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! file-saver */ 85841);
/* harmony import */ var file_saver__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(file_saver__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);




class ExcelDownloadService {
  constructor(http, utilityService) {
    this.http = http;
    this.utilityService = utilityService;
  }
  downloadTemplate(templateType) {
    const filePath = `assets/excel_templates/${templateType}_template.xlsx`;
    this.http.get(filePath, {
      responseType: 'blob'
    }).subscribe({
      next: blob => {
        (0,file_saver__WEBPACK_IMPORTED_MODULE_0__.saveAs)(blob, `${templateType}_template.xlsx`);
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  static {
    this.ɵfac = function ExcelDownloadService_Factory(t) {
      return new (t || ExcelDownloadService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__.UtilityService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: ExcelDownloadService,
      factory: ExcelDownloadService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 37348:
/*!***************************************************************!*\
  !*** ./src/app/shared/utility/action-menu-controller.util.ts ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionMenuController: () => (/* binding */ ActionMenuController)
/* harmony export */ });
class ActionMenuController {
  constructor(options = {}) {
    this.options = options;
    this.openStates = [];
    this.desktopPositions = {};
  }
  toggleMobileMenu(index, event) {
    event.stopPropagation();
    const wasOpen = !!this.openStates[index];
    this.closeAll();
    if (!wasOpen) {
      this.openStates[index] = true;
    }
  }
  toggleDesktopMenu(index, event) {
    event.stopPropagation();
    const wasOpen = !!this.openStates[index];
    this.closeAll();
    if (wasOpen) {
      return;
    }
    const target = event.currentTarget;
    if (target) {
      this.desktopPositions[index] = this.getDesktopMenuPosition(target);
    }
    this.openStates[index] = true;
  }
  closeAll() {
    this.openStates = [];
    this.desktopPositions = {};
  }
  closeAllIfTriggeredInside(event, containerSelector) {
    if (event.target.closest(containerSelector)) {
      this.closeAll();
    }
  }
  getDesktopMenuPosition(target) {
    const rect = target.getBoundingClientRect();
    // Keep this estimate in sync with the action-menu templates until the
    // positioning logic is upgraded to measure the rendered menu height.
    const menuWidth = this.options.menuWidth ?? 192;
    const menuHeight = this.options.menuHeight ?? 220;
    const viewportPadding = this.options.viewportPadding ?? 8;
    const verticalOffset = this.options.verticalOffset ?? 4;
    const top = rect.bottom + verticalOffset + menuHeight > window.innerHeight ? Math.max(viewportPadding, rect.top - menuHeight - verticalOffset) : rect.bottom + verticalOffset;
    const left = Math.max(viewportPadding, Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - viewportPadding));
    return {
      top: `${top}px`,
      left: `${left}px`
    };
  }
}

/***/ }),

/***/ 69700:
/*!***************************************************************************!*\
  !*** ./src/app/view/admin/school-management/school-management.service.ts ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SchoolManagementService: () => (/* binding */ SchoolManagementService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);





class SchoolManagementService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  /**
   * class constructor
   * @param http HttpClient
   */
  constructor(http) {
    super(http);
    this.setUri('school');
    this.baseurl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
  }
  /**
   * Function to get school list data
   * @returns
   * @revamp
   */
  getSchoolList(page, limit, filters, search) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpParams().set('page', page.toString()).set('limit', limit.toString()).set('includeDeleted', 1);
    if (filters) {
      Object.keys(filters).forEach(key => {
        if (filters[key]) {
          if (key === 'search') {
            params = params.set(`${key}`, filters[key]);
          } else if (Array.isArray(filters[key])) {
            filters[key].forEach(item => {
              params = params.append(`filter[${key}]`, item);
            });
          } else {
            params = params.set(`filter[${key}]`, filters[key]);
          }
        }
      });
    }
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(`${this.baseurl}/school/list`, {
      params: params
    });
  }
  /**
   * Function to get all school list
   * @returns
   */
  getAllSchoolList() {
    return this.get('list?limit=999');
  }
  /**
   * Function to get school data
   * @param id
   * @returns
   * @revamp
   */
  getSchoolData(id) {
    return this.http.get(`${this.baseurl}/school/${id}`);
  }
  /**
   * Function to create school
   * @param data
   * @returns
   */
  createSchool(data) {
    return this.post('create', data);
  }
  /**
   * Function to update school
   * @param data
   * @param id
   * @returns
   */
  updateSchool(data, id) {
    return this.put(`update/${id}`, data);
  }
  bulkUpload(formdata) {
    return this.http.post(`${this.baseurl}/school/bulk-upload`, formdata);
  }
  disableSchool(id) {
    return this.put(`deactivate/${id}`, {});
  }
  activateSchool(id) {
    return this.put(`activate/${id}`, {});
  }
  updateFacility(id, facility) {
    return this.put(`facility/${id}`, facility);
  }
  exportSchoolList(filters, search) {
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
    return this.http.get(`${this.baseurl}/school/export`, {
      params: params
    });
  }
  static {
    this.ɵfac = function SchoolManagementService_Factory(t) {
      return new (t || SchoolManagementService)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: SchoolManagementService,
      factory: SchoolManagementService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 26823:
/*!***************************************************************!*\
  !*** ./node_modules/ngx-file-drop/fesm2022/ngx-file-drop.mjs ***!
  \***************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NgxFileDropComponent: () => (/* binding */ NgxFileDropComponent),
/* harmony export */   NgxFileDropContentTemplateDirective: () => (/* binding */ NgxFileDropContentTemplateDirective),
/* harmony export */   NgxFileDropEntry: () => (/* binding */ NgxFileDropEntry),
/* harmony export */   NgxFileDropModule: () => (/* binding */ NgxFileDropModule)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 14876);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);






/**
 * fileEntry is an instance of {@link FileSystemFileEntry} or {@link FileSystemDirectoryEntry}.
 * Which one is it can be checked using {@link FileSystemEntry.isFile} or {@link FileSystemEntry.isDirectory}
 * properties of the given {@link FileSystemEntry}.
 */
const _c0 = ["fileSelector"];
function NgxFileDropComponent_ng_template_4_div_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r4.dropZoneLabel);
  }
}
function NgxFileDropComponent_ng_template_4_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div")(1, "input", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function NgxFileDropComponent_ng_template_4_div_1_Template_input_click_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r6.openFileSelector($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("value", ctx_r5.browseBtnLabel);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("className", ctx_r5.browseBtnClassName);
  }
}
function NgxFileDropComponent_ng_template_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, NgxFileDropComponent_ng_template_4_div_0_Template, 2, 1, "div", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, NgxFileDropComponent_ng_template_4_div_1_Template, 2, 2, "div", 7);
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.dropZoneLabel);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r2.showBrowseBtn);
  }
}
function NgxFileDropComponent_ng_template_6_Template(rf, ctx) {}
const _c1 = function (a0) {
  return {
    openFileSelector: a0
  };
};
class NgxFileDropEntry {
  constructor(relativePath, fileEntry) {
    this.relativePath = relativePath;
    this.fileEntry = fileEntry;
  }
}
class NgxFileDropContentTemplateDirective {
  constructor(template) {
    this.template = template;
  }
  static {
    this.ɵfac = function NgxFileDropContentTemplateDirective_Factory(t) {
      return new (t || NgxFileDropContentTemplateDirective)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.TemplateRef));
    };
  }
  static {
    this.ɵdir = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineDirective"]({
      type: NgxFileDropContentTemplateDirective,
      selectors: [["", "ngx-file-drop-content-tmp", ""]]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NgxFileDropContentTemplateDirective, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Directive,
    args: [{
      selector: '[ngx-file-drop-content-tmp]'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.TemplateRef
    }];
  }, null);
})();
class NgxFileDropComponent {
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value != null && `${value}` !== 'false';
  }
  constructor(zone, renderer) {
    this.zone = zone;
    this.renderer = renderer;
    this.accept = '*';
    this.directory = false;
    this.multiple = true;
    this.dropZoneLabel = '';
    this.dropZoneClassName = 'ngx-file-drop__drop-zone';
    this.useDragEnter = false;
    this.contentClassName = 'ngx-file-drop__content';
    this.showBrowseBtn = false;
    this.browseBtnClassName = 'btn btn-primary btn-xs ngx-file-drop__browse-btn';
    this.browseBtnLabel = 'Browse files';
    this.onFileDrop = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.onFileOver = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.onFileLeave = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.isDraggingOverDropZone = false;
    this.globalDraggingInProgress = false;
    this.files = [];
    this.numOfActiveReadEntries = 0;
    this.helperFormEl = null;
    this.fileInputPlaceholderEl = null;
    this.dropEventTimerSubscription = null;
    this._disabled = false;
    this.openFileSelector = event => {
      if (this.fileSelector && this.fileSelector.nativeElement) {
        this.fileSelector.nativeElement.click();
      }
    };
    this.globalDragStartListener = this.renderer.listen('document', 'dragstart', evt => {
      this.globalDraggingInProgress = true;
    });
    this.globalDragEndListener = this.renderer.listen('document', 'dragend', evt => {
      this.globalDraggingInProgress = false;
    });
  }
  ngOnDestroy() {
    if (this.dropEventTimerSubscription) {
      this.dropEventTimerSubscription.unsubscribe();
      this.dropEventTimerSubscription = null;
    }
    this.globalDragStartListener();
    this.globalDragEndListener();
    this.files = [];
    this.helperFormEl = null;
    this.fileInputPlaceholderEl = null;
  }
  onDragOver(event) {
    if (this.useDragEnter) {
      this.preventAndStop(event);
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = 'copy';
      }
    } else if (!this.isDropzoneDisabled() && !this.useDragEnter && event.dataTransfer) {
      if (!this.isDraggingOverDropZone) {
        this.isDraggingOverDropZone = true;
        this.onFileOver.emit(event);
      }
      this.preventAndStop(event);
      event.dataTransfer.dropEffect = 'copy';
    }
  }
  onDragEnter(event) {
    if (!this.isDropzoneDisabled() && this.useDragEnter) {
      if (!this.isDraggingOverDropZone) {
        this.isDraggingOverDropZone = true;
        this.onFileOver.emit(event);
      }
      this.preventAndStop(event);
    }
  }
  onDragLeave(event) {
    if (!this.isDropzoneDisabled()) {
      if (this.isDraggingOverDropZone) {
        this.isDraggingOverDropZone = false;
        this.onFileLeave.emit(event);
      }
      this.preventAndStop(event);
    }
  }
  dropFiles(event) {
    if (this.isDropzoneDisabled()) {
      return;
    }
    this.isDraggingOverDropZone = false;
    if (event.dataTransfer) {
      let items;
      if (event.dataTransfer.items) {
        items = event.dataTransfer.items;
      } else {
        items = event.dataTransfer.files;
      }
      this.preventAndStop(event);
      this.checkFiles(items);
    }
  }
  /**
   * Processes the change event of the file input and adds the given files.
   * @param Event event
   */
  uploadFiles(event) {
    if (this.isDropzoneDisabled()) {
      return;
    }
    if (event.target) {
      const items = event.target.files || [];
      this.checkFiles(items);
      this.resetFileInput();
    }
  }
  getFakeDropEntry(file) {
    const fakeFileEntry = {
      name: file.name,
      isDirectory: false,
      isFile: true,
      file: callback => callback(file)
    };
    return new NgxFileDropEntry(fakeFileEntry.name, fakeFileEntry);
  }
  checkFile(item) {
    if (!item) {
      return;
    }
    // if ("getAsFile" in item) {
    //   const file = item.getAsFile();
    //   if (file) {
    //     this.addToQueue(
    //       this.getFakeDropEntry(file)
    //     );
    //     return;
    //   }
    // }
    if ("webkitGetAsEntry" in item) {
      let entry = item.webkitGetAsEntry();
      if (entry) {
        if (entry.isFile) {
          const toUpload = new NgxFileDropEntry(entry.name, entry);
          this.addToQueue(toUpload);
        } else if (entry.isDirectory) {
          this.traverseFileTree(entry, entry.name);
        }
        return;
      }
    }
    this.addToQueue(this.getFakeDropEntry(item));
  }
  checkFiles(items) {
    for (let i = 0; i < items.length; i++) {
      this.checkFile(items[i]);
    }
    if (this.dropEventTimerSubscription) {
      this.dropEventTimerSubscription.unsubscribe();
    }
    this.dropEventTimerSubscription = (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.timer)(200, 200).subscribe(() => {
      if (this.files.length > 0 && this.numOfActiveReadEntries === 0) {
        const files = this.files;
        this.files = [];
        this.onFileDrop.emit(files);
      }
    });
  }
  traverseFileTree(item, path) {
    if (item.isFile) {
      const toUpload = new NgxFileDropEntry(path, item);
      this.files.push(toUpload);
    } else {
      path = path + '/';
      const dirReader = item.createReader();
      let entries = [];
      const readEntries = () => {
        this.numOfActiveReadEntries++;
        dirReader.readEntries(result => {
          if (!result.length) {
            // add empty folders
            if (entries.length === 0) {
              const toUpload = new NgxFileDropEntry(path, item);
              this.zone.run(() => {
                this.addToQueue(toUpload);
              });
            } else {
              for (let i = 0; i < entries.length; i++) {
                this.zone.run(() => {
                  this.traverseFileTree(entries[i], path + entries[i].name);
                });
              }
            }
          } else {
            // continue with the reading
            entries = entries.concat(result);
            readEntries();
          }
          this.numOfActiveReadEntries--;
        });
      };
      readEntries();
    }
  }
  /**
   * Clears any added files from the file input element so the same file can subsequently be added multiple times.
   */
  resetFileInput() {
    if (this.fileSelector && this.fileSelector.nativeElement) {
      const fileInputEl = this.fileSelector.nativeElement;
      const fileInputContainerEl = fileInputEl.parentElement;
      const helperFormEl = this.getHelperFormElement();
      const fileInputPlaceholderEl = this.getFileInputPlaceholderElement();
      // Just a quick check so we do not mess up the DOM (will never happen though).
      if (fileInputContainerEl !== helperFormEl) {
        // Insert the form input placeholder in the DOM before the form input element.
        this.renderer.insertBefore(fileInputContainerEl, fileInputPlaceholderEl, fileInputEl);
        // Add the form input as child of the temporary form element, removing the form input from the DOM.
        this.renderer.appendChild(helperFormEl, fileInputEl);
        // Reset the form, thus clearing the input element of any files.
        helperFormEl.reset();
        // Add the file input back to the DOM in place of the file input placeholder element.
        this.renderer.insertBefore(fileInputContainerEl, fileInputEl, fileInputPlaceholderEl);
        // Remove the input placeholder from the DOM
        this.renderer.removeChild(fileInputContainerEl, fileInputPlaceholderEl);
      }
    }
  }
  /**
   * Get a cached HTML form element as a helper element to clear the file input element.
   */
  getHelperFormElement() {
    if (!this.helperFormEl) {
      this.helperFormEl = this.renderer.createElement('form');
    }
    return this.helperFormEl;
  }
  /**
   * Get a cached HTML div element to be used as placeholder for the file input element when clearing said element.
   */
  getFileInputPlaceholderElement() {
    if (!this.fileInputPlaceholderEl) {
      this.fileInputPlaceholderEl = this.renderer.createElement('div');
    }
    return this.fileInputPlaceholderEl;
  }
  isDropzoneDisabled() {
    return this.globalDraggingInProgress || this.disabled;
  }
  addToQueue(item) {
    this.files.push(item);
  }
  preventAndStop(event) {
    event.stopPropagation();
    event.preventDefault();
  }
  static {
    this.ɵfac = function NgxFileDropComponent_Factory(t) {
      return new (t || NgxFileDropComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2));
    };
  }
  static {
    this.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: NgxFileDropComponent,
      selectors: [["ngx-file-drop"]],
      contentQueries: function NgxFileDropComponent_ContentQueries(rf, ctx, dirIndex) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵcontentQuery"](dirIndex, NgxFileDropContentTemplateDirective, 5, _angular_core__WEBPACK_IMPORTED_MODULE_0__.TemplateRef);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.contentTemplate = _t.first);
        }
      },
      viewQuery: function NgxFileDropComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_c0, 7);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.fileSelector = _t.first);
        }
      },
      inputs: {
        accept: "accept",
        directory: "directory",
        multiple: "multiple",
        dropZoneLabel: "dropZoneLabel",
        dropZoneClassName: "dropZoneClassName",
        useDragEnter: "useDragEnter",
        contentClassName: "contentClassName",
        showBrowseBtn: "showBrowseBtn",
        browseBtnClassName: "browseBtnClassName",
        browseBtnLabel: "browseBtnLabel",
        disabled: "disabled"
      },
      outputs: {
        onFileDrop: "onFileDrop",
        onFileOver: "onFileOver",
        onFileLeave: "onFileLeave"
      },
      decls: 7,
      vars: 15,
      consts: [[3, "className", "drop", "dragover", "dragenter", "dragleave"], [3, "className"], ["type", "file", 1, "ngx-file-drop__file-input", 3, "accept", "multiple", "change"], ["fileSelector", ""], ["defaultContentTemplate", ""], [3, "ngTemplateOutlet", "ngTemplateOutletContext"], ["class", "ngx-file-drop__drop-zone-label", 4, "ngIf"], [4, "ngIf"], [1, "ngx-file-drop__drop-zone-label"], ["type", "button", 3, "className", "value", "click"]],
      template: function NgxFileDropComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("drop", function NgxFileDropComponent_Template_div_drop_0_listener($event) {
            return ctx.dropFiles($event);
          })("dragover", function NgxFileDropComponent_Template_div_dragover_0_listener($event) {
            return ctx.onDragOver($event);
          })("dragenter", function NgxFileDropComponent_Template_div_dragenter_0_listener($event) {
            return ctx.onDragEnter($event);
          })("dragleave", function NgxFileDropComponent_Template_div_dragleave_0_listener($event) {
            return ctx.onDragLeave($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1)(2, "input", 2, 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function NgxFileDropComponent_Template_input_change_2_listener($event) {
            return ctx.uploadFiles($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, NgxFileDropComponent_ng_template_4_Template, 2, 2, "ng-template", null, 4, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, NgxFileDropComponent_ng_template_6_Template, 0, 0, "ng-template", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("ngx-file-drop__drop-zone--over", ctx.isDraggingOverDropZone);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("className", ctx.dropZoneClassName);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("className", ctx.contentClassName);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("accept", ctx.accept)("multiple", ctx.multiple);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("directory", ctx.directory || undefined)("webkitdirectory", ctx.directory || undefined)("mozdirectory", ctx.directory || undefined)("msdirectory", ctx.directory || undefined)("odirectory", ctx.directory || undefined);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngTemplateOutlet", ctx.contentTemplate || _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](13, _c1, ctx.openFileSelector));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgTemplateOutlet],
      styles: [".ngx-file-drop__drop-zone[_ngcontent-%COMP%]{height:100px;margin:auto;border:2px dotted #0782d0;border-radius:30px}.ngx-file-drop__drop-zone--over[_ngcontent-%COMP%]{background-color:#93939380}.ngx-file-drop__content[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:center;height:100px;color:#0782d0}.ngx-file-drop__drop-zone-label[_ngcontent-%COMP%]{text-align:center}.ngx-file-drop__file-input[_ngcontent-%COMP%]{display:none}"]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NgxFileDropComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Component,
    args: [{
      selector: 'ngx-file-drop',
      template: "<div [className]=\"dropZoneClassName\"\r\n     [class.ngx-file-drop__drop-zone--over]=\"isDraggingOverDropZone\"\r\n     (drop)=\"dropFiles($event)\"\r\n     (dragover)=\"onDragOver($event)\"\r\n     (dragenter)=\"onDragEnter($event)\"\r\n     (dragleave)=\"onDragLeave($event)\">\r\n  <div [className]=\"contentClassName\">\r\n    <input \r\n      type=\"file\" \r\n      #fileSelector \r\n      [accept]=\"accept\" \r\n      [attr.directory]=\"directory || undefined\" \r\n      [attr.webkitdirectory]=\"directory || undefined\"\r\n      [attr.mozdirectory]=\"directory || undefined\"\r\n      [attr.msdirectory]=\"directory || undefined\"\r\n      [attr.odirectory]=\"directory || undefined\"\r\n      [multiple]=\"multiple\"\r\n      (change)=\"uploadFiles($event)\" \r\n      class=\"ngx-file-drop__file-input\" \r\n    />\r\n\r\n    <ng-template #defaultContentTemplate>\r\n      <div *ngIf=\"dropZoneLabel\" class=\"ngx-file-drop__drop-zone-label\">{{dropZoneLabel}}</div>\r\n      <div *ngIf=\"showBrowseBtn\">\r\n        <input type=\"button\" [className]=\"browseBtnClassName\" value=\"{{browseBtnLabel}}\" (click)=\"openFileSelector($event)\" />\r\n      </div>\r\n    </ng-template>\r\n\r\n    <ng-template\r\n      [ngTemplateOutlet]=\"contentTemplate || defaultContentTemplate\"\r\n      [ngTemplateOutletContext]=\"{ openFileSelector: openFileSelector }\">\r\n    </ng-template>\r\n  </div>\r\n</div>\r\n",
      styles: [".ngx-file-drop__drop-zone{height:100px;margin:auto;border:2px dotted #0782d0;border-radius:30px}.ngx-file-drop__drop-zone--over{background-color:#93939380}.ngx-file-drop__content{display:flex;align-items:center;justify-content:center;height:100px;color:#0782d0}.ngx-file-drop__drop-zone-label{text-align:center}.ngx-file-drop__file-input{display:none}\n"]
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgZone
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Renderer2
    }];
  }, {
    accept: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    directory: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    multiple: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    dropZoneLabel: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    dropZoneClassName: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    useDragEnter: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    contentClassName: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    showBrowseBtn: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    browseBtnClassName: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    browseBtnLabel: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }],
    onFileDrop: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    onFileOver: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    onFileLeave: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Output
    }],
    contentTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ContentChild,
      args: [NgxFileDropContentTemplateDirective, {
        read: _angular_core__WEBPACK_IMPORTED_MODULE_0__.TemplateRef
      }]
    }],
    fileSelector: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.ViewChild,
      args: ['fileSelector', {
        static: true
      }]
    }],
    disabled: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.Input
    }]
  });
})();
class NgxFileDropModule {
  static {
    this.ɵfac = function NgxFileDropModule_Factory(t) {
      return new (t || NgxFileDropModule)();
    };
  }
  static {
    this.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: NgxFileDropModule,
      bootstrap: [NgxFileDropComponent]
    });
  }
  static {
    this.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](NgxFileDropModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_0__.NgModule,
    args: [{
      declarations: [NgxFileDropComponent, NgxFileDropContentTemplateDirective],
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule],
      exports: [NgxFileDropComponent, NgxFileDropContentTemplateDirective],
      providers: [],
      bootstrap: [NgxFileDropComponent]
    }]
  }], null, null);
})();

/**
 * Generated bundle index. Do not edit.
 */



/***/ })

}]);
//# sourceMappingURL=default-src_app_shared_components_disable-popup_disable-popup_component_ts-src_app_shared_com-3e4ea0.e8b6d1910ad01cd8.js.map