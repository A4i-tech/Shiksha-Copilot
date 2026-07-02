"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_admin_shikshan-user-management_shikshan-user-management_module_ts"],{

/***/ 59925:
/*!****************************************************************************************!*\
  !*** ./src/app/shared/components/staff-form-dropdown/staff-form-dropdown.component.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StafFormDropdownComponent: () => (/* binding */ StafFormDropdownComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ng-select/ng-select */ 62223);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 90852);










function StafFormDropdownComponent_label_1_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function StafFormDropdownComponent_label_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "label", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, StafFormDropdownComponent_label_1_span_3_Template, 2, 0, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r0.config.fieldName), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.config.required && ctx_r0.mode !== "view");
  }
}
function StafFormDropdownComponent_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", ctx_r1.config.hideLabel ? "top-[9px]" : "top-[39px]");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r1.config.placeHolderTxt), " ");
  }
}
function StafFormDropdownComponent_5_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 11)(1, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function StafFormDropdownComponent_5_ng_template_0_Template_input_change_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r11);
      const item_r8 = restoredCtx.item;
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r10.toggleSelection(item_r8));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r8 = ctx.item;
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx_r7.isSelected(item_r8));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r7.config.bindLable ? item_r8[ctx_r7.config.bindLable] : item_r8);
  }
}
function StafFormDropdownComponent_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, StafFormDropdownComponent_5_ng_template_0_Template, 4, 2, "ng-template", 10);
  }
}
function StafFormDropdownComponent_6_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "label", 11)(1, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function StafFormDropdownComponent_6_ng_template_0_Template_input_change_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r14);
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r13.toggleSelectAll($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Select All ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx_r12.isSelectAll());
  }
}
function StafFormDropdownComponent_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, StafFormDropdownComponent_6_ng_template_0_Template, 3, 1, "ng-template", 14);
  }
}
function StafFormDropdownComponent_small_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r4.config.fieldName), " ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 4, "is required"), "");
  }
}
function StafFormDropdownComponent_ng_container_8_ng_container_2_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, item_r16));
  }
}
function StafFormDropdownComponent_ng_container_8_ng_container_2_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, item_r16));
  }
}
function StafFormDropdownComponent_ng_container_8_ng_container_2_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, item_r16));
  }
}
function StafFormDropdownComponent_ng_container_8_ng_container_2_span_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function StafFormDropdownComponent_ng_container_8_ng_container_2_span_5_Template_span_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r27);
      const i_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().index;
      const ctx_r25 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r25.removeItem(i_r17));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function StafFormDropdownComponent_ng_container_8_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, StafFormDropdownComponent_ng_container_8_ng_container_2_span_2_Template, 3, 3, "span", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, StafFormDropdownComponent_ng_container_8_ng_container_2_span_3_Template, 3, 3, "span", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, StafFormDropdownComponent_ng_container_8_ng_container_2_span_4_Template, 3, 3, "span", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, StafFormDropdownComponent_ng_container_8_ng_container_2_span_5_Template, 2, 0, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r15.config == null ? null : ctx_r15.config.chipValueType) === "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r15.config == null ? null : ctx_r15.config.chipValueType) === "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !(ctx_r15.config == null ? null : ctx_r15.config.chipValueType));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r15.config == null ? null : ctx_r15.config.chipClearableOff) ? false : true);
  }
}
function StafFormDropdownComponent_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, StafFormDropdownComponent_ng_container_8_ng_container_2_Template, 6, 4, "ng-container", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", ctx_r5.dropDownCtrl == null ? null : ctx_r5.dropDownCtrl.value);
  }
}
const _c0 = function (a0) {
  return {
    height: a0
  };
};
class StafFormDropdownComponent {
  constructor() {
    this.dropDownValues = [];
    this.submitted = false;
    this.valueChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
  }
  /**
   * Angular oninit lifecycle hook used for initialization
   */
  ngOnInit() {
    const obj = {};
    obj[this.dropDownControlName] = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControl(null);
    this.formGroupTemp = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormGroup(obj);
  }
  /**
   * Function to remove chip value
   * @param i index
   */
  removeItem(i) {
    const raw = this.dropDownCtrl?.value;
    const currentVal = Array.isArray(raw) ? [...raw] : [];
    const updatedArr = currentVal.filter((_, index) => index !== i);
    this.dropDownCtrl?.setValue(updatedArr);
    this.valueChange.emit(updatedArr);
  }
  /**
   * Function to emit value change
   * @param val
   */
  valueSelected(val) {
    this.valueChange.emit(val);
  }
  onSelectAll() {
    if (this.config.selectAllValue) {
      let data = this.dropDownValues.map(e => this.config?.selectAllValue ? e[this.config.selectAllValue] : e);
      this.dropDownCtrl.setValue(data);
      this.valueChange.emit(data);
    } else {
      let data = this.dropDownValues.map(e => this.config.bindValue ? e[this.config.bindValue] : e);
      this.dropDownCtrl.setValue(data);
      this.valueChange.emit(data);
    }
  }
  onClearAll() {
    const emptyValue = this.config.multi ? [] : null;
    this.dropDownCtrl.setValue(emptyValue);
    this.valueChange.emit(emptyValue);
  }
  toggleSelection(item) {
    let currentVal = this.dropDownCtrl?.value || [];
    const itemValue = this.config.bindValue ? item[this.config.bindValue] : item;
    const index = currentVal.findIndex(i => i === itemValue);
    if (index === -1) {
      currentVal.push(itemValue);
    } else {
      currentVal.splice(index, 1);
    }
    this.dropDownCtrl.setValue([...currentVal]);
    this.valueChange.emit([...currentVal]);
  }
  toggleSelectAll(event) {
    if (event.target.checked) {
      if (this.config.selectAllValue) {
        let data = this.dropDownValues.map(e => this.config?.selectAllValue ? e[this.config.selectAllValue] : e);
        this.dropDownCtrl.setValue(data);
        this.valueChange.emit(data);
      } else {
        let data = this.dropDownValues.map(e => this.config.bindValue ? e[this.config.bindValue] : e);
        this.dropDownCtrl.setValue(data);
        this.valueChange.emit(data);
      }
    } else {
      this.dropDownCtrl.setValue([]);
      this.valueChange.emit([]);
    }
  }
  isSelectAll() {
    if (!this.dropDownCtrl.value || !this.dropDownValues) return false;
    return this.dropDownCtrl.value.length === this.dropDownValues.length;
  }
  isSelected(item) {
    if (!this.dropDownCtrl.value) return false;
    const itemValue = this.config.bindValue ? item[this.config.bindValue] : item;
    return this.dropDownCtrl.value.some(i => i === itemValue);
  }
  get hasSelections() {
    return this.dropDownCtrl.value?.length > 0;
  }
  static {
    this.ɵfac = function StafFormDropdownComponent_Factory(t) {
      return new (t || StafFormDropdownComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: StafFormDropdownComponent,
      selectors: [["app-staff-form-dropdown"]],
      inputs: {
        dropDownValues: "dropDownValues",
        dropDownControlName: "dropDownControlName",
        dropDownCtrl: "dropDownCtrl",
        config: "config",
        submitted: "submitted",
        mode: "mode"
      },
      outputs: {
        valueChange: "valueChange"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 9,
      vars: 24,
      consts: [[1, "select-wrapper", 3, "formGroup"], ["class", "form-control-label", "for", "email-address", 4, "ngIf"], ["class", "area-label", 3, "ngClass", 4, "ngIf"], [3, "items", "ngClass", "placeholder", "bindLabel", "bindValue", "dropdownPosition", "searchable", "clearable", "multiple", "formControl", "closeOnSelect", "change"], [4, "ngIf"], ["class", "form-control-error", 4, "ngIf"], ["for", "email-address", 1, "form-control-label"], ["class", "text-[16px] text-error", 4, "ngIf"], [1, "text-[16px]", "text-error"], [1, "area-label", 3, "ngClass"], ["ng-option-tmp", ""], [1, "flex", "items-center", "gap-2"], ["type", "checkbox", 3, "checked", "change"], [1, "whitespace-nowrap", "overflow-x-hidden", "text-ellipsis"], ["ng-header-tmp", ""], [1, "form-control-error"], [1, "mt-2", "flex-wrap"], [4, "ngFor", "ngForOf"], [1, "chip"], ["class", "close-icon", 3, "click", 4, "ngIf"], [1, "close-icon", 3, "click"]],
      template: function StafFormDropdownComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, StafFormDropdownComponent_label_1_Template, 4, 4, "label", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, StafFormDropdownComponent_span_2_Template, 3, 4, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "ng-select", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function StafFormDropdownComponent_Template_ng_select_change_3_listener($event) {
            return ctx.valueSelected($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, StafFormDropdownComponent_5_Template, 1, 0, null, 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, StafFormDropdownComponent_6_Template, 1, 0, null, 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](7, StafFormDropdownComponent_small_7_Template, 4, 6, "small", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, StafFormDropdownComponent_ng_container_8_Template, 3, 1, "ng-container", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.formGroupTemp);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.hideLabel ? false : true);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.multi && (ctx.dropDownCtrl == null ? null : ctx.dropDownCtrl.value == null ? null : ctx.dropDownCtrl.value.length) > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](22, _c0, ctx.config.height));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("bindLabel", ctx.config.bindLable ? ctx.config.bindLable : "name");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("bindValue", ctx.config.bindValue ? ctx.config.bindValue : "value");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("items", ctx.dropDownValues)("ngClass", ctx.config.isBackground && (ctx.dropDownCtrl.disabled || ctx.config.disabled) ? "with-background" : "")("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](4, 20, ctx.config.placeHolderTxt))("dropdownPosition", "auto")("searchable", ctx.config.searchable || false)("clearable", ctx.config.clearableOff ? false : true)("multiple", ctx.config.multi ? true : false)("formControl", ctx.dropDownCtrl)("closeOnSelect", ctx.config.openOnSelect ? false : true);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.multi && ctx.config.selectAllOption);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.multi && ctx.config.selectAllOption && ctx.dropDownValues.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.dropDownCtrl.errors == null ? null : ctx.dropDownCtrl.errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.hideChips ? false :  true && ctx.config.multi);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_2__.UpperCasePipe, _angular_common__WEBPACK_IMPORTED_MODULE_2__.TitleCasePipe, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_3__.NgSelectModule, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_3__.NgSelectComponent, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_3__.NgOptionTemplateDirective, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_3__.NgHeaderTemplateDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControlDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormGroupDirective, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslatePipe],
      styles: [".select-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-focused:not(.ng-select-opened) > .ng-select-container {\n  box-shadow: none;\n  border: 1px solid var(--content-50);\n}\n.select-wrapper[_ngcontent-%COMP%]     .with-background.ng-select .ng-select-container {\n  background: var(--surface-muted) !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-select-container {\n  background-color: var(--surface-DEFAULT) !important;\n  height: 100% !important;\n  border: 1px solid var(--content-50);\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-disabled > .ng-select-container {\n  background: var(--shade-80) !important;\n  border: none;\n  cursor: not-allowed;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-arrow-wrapper .ng-arrow {\n  border-color: none !important;\n  border-style: none !important;\n  border-width: 0 !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-arrow-wrapper {\n  background-image: url('drop-down.aad29f04a486a4ef.svg') !important;\n  background-repeat: no-repeat;\n  background-size: 14px 14px;\n  margin-top: 10px;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel.ng-select-bottom {\n  border: none;\n  margin-top: 5px;\n  box-shadow: 0px 4px 9px 0px rgba(75, 75, 75, 0.12);\n  box-shadow: 0px 4px 9px 0px color-mix(in srgb, var(--content-DEFAULT) 12%, transparent);\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel {\n  min-width: 200px !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-select-container .ng-value-container .ng-input > input[readonly] {\n  user-select: unset;\n  -webkit-user-select: unset;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected, .select-wrapper[_ngcontent-%COMP%]   .ng-dropdown-panel[_ngcontent-%COMP%]   .ng-dropdown-panel-items[_ngcontent-%COMP%]   .ng-option.ng-option-selected.ng-option-marked[_ngcontent-%COMP%] {\n  background-color: var(--shade-80) !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {\n  background-color: var(--shade-80) !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-value {\n  display: none;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value-container .ng-placeholder {\n  top: 8px;\n}\n.select-wrapper[_ngcontent-%COMP%]   .area-label[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 11px;\n  color: var(--content-50);\n  z-index: 1;\n  font-size: 0.875rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZvcm0tZHJvcGRvd24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxrQkFBQTtBQUNGO0FBQUU7RUFHRSxnQkFBQTtFQUNBLG1DQUFBO0FBQUo7QUFHRTtFQUNFLDJDQUFBO0FBREo7QUFHRTtFQUNFLG1EQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQ0FBQTtBQURKO0FBSUU7RUFDRSxzQ0FBQTtFQUNBLFlBQUE7RUFDQSxtQkFBQTtBQUZKO0FBS0U7RUFDRSw2QkFBQTtFQUNBLDZCQUFBO0VBQ0EsMEJBQUE7QUFISjtBQUtFO0VBQ0Usa0VBQUE7RUFDQSw0QkFBQTtFQUNBLDBCQUFBO0VBQ0EsZ0JBQUE7QUFISjtBQU1FO0VBQ0UsWUFBQTtFQUNBLGVBQUE7RUFDQSxrREFBQTtFQUNBLHVGQUFBO0FBSko7QUFPRTtFQUNFLDJCQUFBO0FBTEo7QUFRRTtFQUNFLGtCQUFBO0VBQ0EsMEJBQUE7QUFOSjtBQVNFOztFQU9FLDRDQUFBO0FBWko7QUFlRTtFQUlFLDRDQUFBO0FBaEJKO0FBbUJFO0VBS0UsYUFBQTtBQXJCSjtBQXdCRTtFQUtFLFFBQUE7QUExQko7QUE2QkU7RUFDRSxrQkFBQTtFQUNBLFVBQUE7RUFDQSx3QkFBQTtFQUNBLFVBQUE7RUFDQSxtQkFBQTtBQTNCSiIsImZpbGUiOiJmb3JtLWRyb3Bkb3duLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNlbGVjdC13cmFwcGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICA6Om5nLWRlZXBcbiAgICAubmctc2VsZWN0Lm5nLXNlbGVjdC1mb2N1c2VkOm5vdCgubmctc2VsZWN0LW9wZW5lZClcbiAgICA+IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBib3gtc2hhZG93OiBub25lO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNvbnRlbnQtNTApO1xuICB9XG5cbiAgOjpuZy1kZWVwIC53aXRoLWJhY2tncm91bmQubmctc2VsZWN0IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLW11dGVkKSAhaW1wb3J0YW50O1xuICB9XG4gIDo6bmctZGVlcCAubmctc2VsZWN0IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAxMDAlICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tY29udGVudC01MCk7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdC5uZy1zZWxlY3QtZGlzYWJsZWQgPiAubmctc2VsZWN0LWNvbnRhaW5lciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tc2hhZGUtODApICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctYXJyb3ctd3JhcHBlciAubmctYXJyb3cge1xuICAgIGJvcmRlci1jb2xvcjogbm9uZSAhaW1wb3J0YW50O1xuICAgIGJvcmRlci1zdHlsZTogbm9uZSAhaW1wb3J0YW50O1xuICAgIGJvcmRlci13aWR0aDogMCAhaW1wb3J0YW50O1xuICB9XG4gIDo6bmctZGVlcCAubmctc2VsZWN0IC5uZy1hcnJvdy13cmFwcGVyIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIuLi8uLi8uLi8uLi9hc3NldHMvaWNvbnMvZHJvcC1kb3duLnN2Z1wiKSAhaW1wb3J0YW50O1xuICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gICAgYmFja2dyb3VuZC1zaXplOiAxNHB4IDE0cHg7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbiAgfVxuXG4gIDo6bmctZGVlcCAubmctZHJvcGRvd24tcGFuZWwubmctc2VsZWN0LWJvdHRvbSB7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIG1hcmdpbi10b3A6IDVweDtcbiAgICBib3gtc2hhZG93OiAwcHggNHB4IDlweCAwcHggcmdiYSg3NSwgNzUsIDc1LCAwLjEyKTtcbiAgICBib3gtc2hhZG93OiAwcHggNHB4IDlweCAwcHggY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgMTIlLCB0cmFuc3BhcmVudCk7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLWRyb3Bkb3duLXBhbmVsIHtcbiAgICBtaW4td2lkdGg6IDIwMHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctc2VsZWN0LWNvbnRhaW5lciAubmctdmFsdWUtY29udGFpbmVyIC5uZy1pbnB1dD5pbnB1dFtyZWFkb25seV17XG4gICAgdXNlci1zZWxlY3Q6IHVuc2V0O1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IHVuc2V0O1xuICB9XG5cbiAgOjpuZy1kZWVwXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsLWl0ZW1zXG4gICAgLm5nLW9wdGlvbi5uZy1vcHRpb24tc2VsZWN0ZWQsXG4gIC5uZy1kcm9wZG93bi1wYW5lbFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtc1xuICAgIC5uZy1vcHRpb24ubmctb3B0aW9uLXNlbGVjdGVkLm5nLW9wdGlvbi1tYXJrZWQge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoYWRlLTgwKSAhaW1wb3J0YW50O1xuICB9XG5cbiAgOjpuZy1kZWVwXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsLWl0ZW1zXG4gICAgLm5nLW9wdGlvbi5uZy1vcHRpb24tbWFya2VkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGFkZS04MCkgIWltcG9ydGFudDtcbiAgfVxuXG4gIDo6bmctZGVlcFxuICAgIC5uZy1zZWxlY3Qubmctc2VsZWN0LW11bHRpcGxlXG4gICAgLm5nLXNlbGVjdC1jb250YWluZXJcbiAgICAubmctdmFsdWUtY29udGFpbmVyXG4gICAgLm5nLXZhbHVlIHtcbiAgICBkaXNwbGF5OiBub25lO1xuICB9XG5cbiAgOjpuZy1kZWVwXG4gICAgLm5nLXNlbGVjdC5uZy1zZWxlY3QtbXVsdGlwbGVcbiAgICAubmctc2VsZWN0LWNvbnRhaW5lclxuICAgIC5uZy12YWx1ZS1jb250YWluZXJcbiAgICAubmctcGxhY2Vob2xkZXIge1xuICAgIHRvcDogOHB4O1xuICB9XG5cbiAgLmFyZWEtbGFiZWwge1xuICAgIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgICBsZWZ0OiAxMXB4O1xuICAgIGNvbG9yOiB2YXIoLS1jb250ZW50LTUwKTtcbiAgICB6LWluZGV4OiAxO1xuICAgIGZvbnQtc2l6ZTogMC44NzVyZW07XG4gIH1cbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZm9ybS1kcm9wZG93bi9mb3JtLWRyb3Bkb3duLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0Usa0JBQUE7QUFDRjtBQUFFO0VBR0UsZ0JBQUE7RUFDQSxtQ0FBQTtBQUFKO0FBR0U7RUFDRSwyQ0FBQTtBQURKO0FBR0U7RUFDRSxtREFBQTtFQUNBLHVCQUFBO0VBQ0EsbUNBQUE7QUFESjtBQUlFO0VBQ0Usc0NBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7QUFGSjtBQUtFO0VBQ0UsNkJBQUE7RUFDQSw2QkFBQTtFQUNBLDBCQUFBO0FBSEo7QUFLRTtFQUNFLGtFQUFBO0VBQ0EsNEJBQUE7RUFDQSwwQkFBQTtFQUNBLGdCQUFBO0FBSEo7QUFNRTtFQUNFLFlBQUE7RUFDQSxlQUFBO0VBQ0Esa0RBQUE7RUFDQSx1RkFBQTtBQUpKO0FBT0U7RUFDRSwyQkFBQTtBQUxKO0FBUUU7RUFDRSxrQkFBQTtFQUNBLDBCQUFBO0FBTko7QUFTRTs7RUFPRSw0Q0FBQTtBQVpKO0FBZUU7RUFJRSw0Q0FBQTtBQWhCSjtBQW1CRTtFQUtFLGFBQUE7QUFyQko7QUF3QkU7RUFLRSxRQUFBO0FBMUJKO0FBNkJFO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0Esd0JBQUE7RUFDQSxVQUFBO0VBQ0EsbUJBQUE7QUEzQko7QUFDQSx3aUlBQXdpSSIsInNvdXJjZXNDb250ZW50IjpbIi5zZWxlY3Qtd3JhcHBlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgOjpuZy1kZWVwXG4gICAgLm5nLXNlbGVjdC5uZy1zZWxlY3QtZm9jdXNlZDpub3QoLm5nLXNlbGVjdC1vcGVuZWQpXG4gICAgPiAubmctc2VsZWN0LWNvbnRhaW5lciB7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb250ZW50LTUwKTtcbiAgfVxuXG4gIDo6bmctZGVlcCAud2l0aC1iYWNrZ3JvdW5kLm5nLXNlbGVjdCAubmctc2VsZWN0LWNvbnRhaW5lciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1tdXRlZCkgIWltcG9ydGFudDtcbiAgfVxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctc2VsZWN0LWNvbnRhaW5lciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKSAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogMTAwJSAhaW1wb3J0YW50O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNvbnRlbnQtNTApO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3Qubmctc2VsZWN0LWRpc2FibGVkID4gLm5nLXNlbGVjdC1jb250YWluZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXNoYWRlLTgwKSAhaW1wb3J0YW50O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLWFycm93LXdyYXBwZXIgLm5nLWFycm93IHtcbiAgICBib3JkZXItY29sb3I6IG5vbmUgIWltcG9ydGFudDtcbiAgICBib3JkZXItc3R5bGU6IG5vbmUgIWltcG9ydGFudDtcbiAgICBib3JkZXItd2lkdGg6IDAgIWltcG9ydGFudDtcbiAgfVxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctYXJyb3ctd3JhcHBlciB7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiLi4vLi4vLi4vLi4vYXNzZXRzL2ljb25zL2Ryb3AtZG93bi5zdmdcIikgIWltcG9ydGFudDtcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgIGJhY2tncm91bmQtc2l6ZTogMTRweCAxNHB4O1xuICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLWRyb3Bkb3duLXBhbmVsLm5nLXNlbGVjdC1ib3R0b20ge1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBtYXJnaW4tdG9wOiA1cHg7XG4gICAgYm94LXNoYWRvdzogMHB4IDRweCA5cHggMHB4IHJnYmEoNzUsIDc1LCA3NSwgMC4xMik7XG4gICAgYm94LXNoYWRvdzogMHB4IDRweCA5cHggMHB4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1jb250ZW50LURFRkFVTFQpIDEyJSwgdHJhbnNwYXJlbnQpO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1kcm9wZG93bi1wYW5lbCB7XG4gICAgbWluLXdpZHRoOiAyMDBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLXNlbGVjdC1jb250YWluZXIgLm5nLXZhbHVlLWNvbnRhaW5lciAubmctaW5wdXQ+aW5wdXRbcmVhZG9ubHlde1xuICAgIHVzZXItc2VsZWN0OiB1bnNldDtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiB1bnNldDtcbiAgfVxuXG4gIDo6bmctZGVlcFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtc1xuICAgIC5uZy1vcHRpb24ubmctb3B0aW9uLXNlbGVjdGVkLFxuICAubmctZHJvcGRvd24tcGFuZWxcbiAgICAubmctZHJvcGRvd24tcGFuZWwtaXRlbXNcbiAgICAubmctb3B0aW9uLm5nLW9wdGlvbi1zZWxlY3RlZC5uZy1vcHRpb24tbWFya2VkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGFkZS04MCkgIWltcG9ydGFudDtcbiAgfVxuXG4gIDo6bmctZGVlcFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtc1xuICAgIC5uZy1vcHRpb24ubmctb3B0aW9uLW1hcmtlZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hhZGUtODApICFpbXBvcnRhbnQ7XG4gIH1cblxuICA6Om5nLWRlZXBcbiAgICAubmctc2VsZWN0Lm5nLXNlbGVjdC1tdWx0aXBsZVxuICAgIC5uZy1zZWxlY3QtY29udGFpbmVyXG4gICAgLm5nLXZhbHVlLWNvbnRhaW5lclxuICAgIC5uZy12YWx1ZSB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuXG4gIDo6bmctZGVlcFxuICAgIC5uZy1zZWxlY3Qubmctc2VsZWN0LW11bHRpcGxlXG4gICAgLm5nLXNlbGVjdC1jb250YWluZXJcbiAgICAubmctdmFsdWUtY29udGFpbmVyXG4gICAgLm5nLXBsYWNlaG9sZGVyIHtcbiAgICB0b3A6IDhweDtcbiAgfVxuXG4gIC5hcmVhLWxhYmVsIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMTFweDtcbiAgICBjb2xvcjogdmFyKC0tY29udGVudC01MCk7XG4gICAgei1pbmRleDogMTtcbiAgICBmb250LXNpemU6IDAuODc1cmVtO1xuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 13830:
/*!************************************************************************************************************!*\
  !*** ./src/app/view/admin/shikshan-user-management/shikshan-user-manage/shikshan-user-manage.component.ts ***!
  \************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShikshanUserManageComponent: () => (/* binding */ ShikshanUserManageComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _shikshan_user_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../shikshan-user.service */ 49696);
/* harmony import */ var src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/services/master.service */ 2216);
/* harmony import */ var src_app_shared_services_staff_user_common_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/services/staff-user-common.service */ 80798);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_staff_form_dropdown_staff_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/components/staff-form-dropdown/staff-form-dropdown.component */ 59925);
/* harmony import */ var ng_toggle_button__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ng-toggle-button */ 80405);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngx-translate/core */ 90852);












function ShikshanUserManageComponent_span_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ShikshanUserManageComponent_small_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Staff name is required."));
  }
}
function ShikshanUserManageComponent_small_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Staff name should be minimum 3 character long."));
  }
}
function ShikshanUserManageComponent_span_27_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ShikshanUserManageComponent_small_30_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Mobile Number is required."));
  }
}
function ShikshanUserManageComponent_small_31_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Phone number required should be 10 digits"));
  }
}
function ShikshanUserManageComponent_small_32_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Invalid phone number"));
  }
}
function ShikshanUserManageComponent_span_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
}
function ShikshanUserManageComponent_small_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Email is required"));
  }
}
function ShikshanUserManageComponent_small_42_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "small", 24);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](2, 1, "Enter valid email"), ".");
  }
}
function ShikshanUserManageComponent_div_45_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 14)(1, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](2, "app-staff-form-dropdown", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "div");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](4, "app-staff-form-dropdown", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "state")("mode", ctx_r10.mode)("dropDownCtrl", ctx_r10.convertToFormControl(ctx_r10.f["state"]))("dropDownValues", ctx_r10.stateDropdownOptions)("config", ctx_r10.stateDropdownconfig)("submitted", ctx_r10.submitted);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "zones")("mode", ctx_r10.mode)("dropDownCtrl", ctx_r10.convertToFormControl(ctx_r10.f["zones"]))("dropDownValues", ctx_r10.zoneDropdownOptions)("config", ctx_r10.zoneDropdownconfig)("submitted", ctx_r10.submitted);
  }
}
function ShikshanUserManageComponent_div_46_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](1, "app-staff-form-dropdown", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "districts")("mode", ctx_r11.mode)("dropDownCtrl", ctx_r11.convertToFormControl(ctx_r11.f["districts"]))("dropDownValues", ctx_r11.districtDropdownOptions)("config", ctx_r11.districtDropdownconfig)("submitted", ctx_r11.submitted);
  }
}
function ShikshanUserManageComponent_div_56_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 26)(1, "button", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](4, "button", 28)(5, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](8, "img", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](3, 3, "Cancel"));
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("disabled", ctx_r12.addForm.pristine);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](7, 5, "Save"));
  }
}
const _c0 = function (a0) {
  return {
    "pointer-events-none": a0
  };
};
class ShikshanUserManageComponent {
  constructor(fb, route, utilityService, shikshanaUserService, router, masterService, commonStaffUserService) {
    this.fb = fb;
    this.route = route;
    this.utilityService = utilityService;
    this.shikshanaUserService = shikshanaUserService;
    this.router = router;
    this.masterService = masterService;
    this.commonStaffUserService = commonStaffUserService;
    this.userRolesDropdownOptions = [];
    this.userRoleDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Staff Role',
      height: '44px',
      fieldName: 'Staff Role',
      bindLable: 'name',
      bindValue: 'value',
      required: true
    };
    this.stateDropdownOptions = [];
    this.zoneDropdownOptions = [];
    this.districtDropdownOptions = [];
    this.regionsData = [];
    this.stateDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select State',
      height: '44px',
      fieldName: 'State',
      bindLable: 'state',
      bindValue: 'state',
      required: true
    };
    this.zoneDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select Zone',
      height: '44px',
      fieldName: 'Zone',
      bindLable: 'name',
      bindValue: 'name',
      required: true,
      multi: true,
      selectAllOption: true,
      hideChips: false,
      chipValueType: 'titlecase'
    };
    this.districtDropdownconfig = {
      isBackground: true,
      placeHolderTxt: 'Select District',
      height: '44px',
      fieldName: 'District',
      bindLable: 'name',
      bindValue: 'name',
      required: true,
      multi: true,
      selectAllOption: true,
      hideChips: false,
      chipValueType: 'titlecase'
    };
    this.toggleconfig = {
      color: {
        checked: '#4069E5',
        unchecked: '#dcdcdc'
      }
    };
    this.submitted = false;
  }
  ngOnInit() {
    this.userRolesDropdownOptions = this.shikshanaUserService.userRoleDropdownOptions;
    this.route.queryParamMap.subscribe(qparams => {
      this.mode = qparams?.get('mode');
    });
    this.route.params.subscribe(params => {
      this.userId = params['id'];
    });
    this.initialize_add_form();
    this.getRegionsData();
    this.handleRoleChange();
  }
  initialize_add_form() {
    this.addForm = this.fb.group({
      name: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.minLength(3)]],
      phone: ['', [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.minLength(10), _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.pattern(this.utilityService.regexPattern.phoneRegex)]],
      email: [null, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.email]],
      role: ['manager', [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]],
      isDeleted: [false, [_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]],
      state: [null],
      zones: [[]],
      districts: [[]]
    });
  }
  getRegionsData() {
    this.masterService.getRegions().subscribe({
      next: val => {
        this.regionsData = val?.data?.results || [];
        this.stateDropdownOptions = this.regionsData;
        if (this.userId) {
          this.getUserDetails(this.userId);
        }
      }
    });
  }
  handleRoleChange() {
    this.addForm.get('role')?.valueChanges.subscribe(role => {
      if (role === 'manager') {
        this.addForm.get('state')?.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]);
        this.addForm.get('zones')?.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]);
        this.addForm.get('districts')?.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_6__.Validators.required]);
      } else {
        this.addForm.get('state')?.clearValidators();
        this.addForm.get('zones')?.clearValidators();
        this.addForm.get('districts')?.clearValidators();
        this.addForm.get('state')?.setValue(null);
        this.addForm.get('zones')?.setValue([]);
        this.addForm.get('districts')?.setValue([]);
      }
      this.addForm.get('state')?.updateValueAndValidity();
      this.addForm.get('zones')?.updateValueAndValidity();
      this.addForm.get('districts')?.updateValueAndValidity();
    });
    this.addForm.get('state')?.valueChanges.subscribe(state => {
      this.updateZoneOptions(state);
    });
    this.addForm.get('zones')?.valueChanges.subscribe(selectedZones => {
      this.updateDistrictOptions(selectedZones);
    });
  }
  updateZoneOptions(state) {
    if (!state) {
      this.zoneDropdownOptions = [];
      this.districtDropdownOptions = [];
      this.addForm.get('zones')?.setValue([]);
      this.addForm.get('districts')?.setValue([]);
      return;
    }
    // Find the selected state object
    const stateObj = this.regionsData.find(region => region.state === state);
    if (stateObj && stateObj.zones) {
      // Transform zones into the correct format for the dropdown
      this.zoneDropdownOptions = stateObj.zones.map(zone => ({
        name: zone.name,
        value: zone.name
      }));
    } else {
      this.zoneDropdownOptions = [];
    }
    // Reset selections when state changes
    this.addForm.get('zones')?.setValue([]);
    this.addForm.get('districts')?.setValue([]);
    this.districtDropdownOptions = [];
  }
  updateDistrictOptions(selectedZones) {
    if (!selectedZones || selectedZones.length === 0) {
      this.districtDropdownOptions = [];
      this.addForm.get('districts')?.setValue([]);
      return;
    }
    const state = this.addForm.get('state')?.value;
    const stateObj = this.regionsData.find(region => region.state === state);
    if (!stateObj) {
      this.districtDropdownOptions = [];
      return;
    }
    // Collect all districts from selected zones
    const allDistricts = new Set();
    selectedZones.forEach(zoneName => {
      const zone = stateObj.zones.find(z => z.name === zoneName);
      if (zone && zone.districts) {
        if (Array.isArray(zone.districts)) {
          zone.districts.forEach(district => {
            if (district.name) {
              allDistricts.add(district.name);
            }
          });
        } else if (zone.districts.name) {
          allDistricts.add(zone.districts.name);
        }
      }
    });
    // Transform districts into dropdown format
    this.districtDropdownOptions = Array.from(allDistricts).map(districtName => ({
      name: districtName,
      value: districtName
    }));
    // Reset districts selection when zones change
    this.addForm.get('districts')?.setValue([]);
  }
  on_form_submit() {
    this.submitted = true;
    if (this.addForm.invalid) {
      return;
    }
    // Create a copy of the form value to avoid modifying the form directly
    const formData = {
      ...this.addForm.value
    };
    // Remove state, zones, and districts if the role is not 'manager'
    if (formData.role !== 'manager') {
      delete formData.state;
      delete formData.zones;
      delete formData.districts;
    }
    // Format the data according to API requirements
    const formattedData = {
      name: formData.name?.trim(),
      phone: formData.phone?.toString(),
      email: formData.email?.trim().toLowerCase(),
      role: [formData.role],
      isDeleted: formData.isDeleted
    };
    // Add state, zones, and districts only if role is manager
    if (formData.role === 'manager') {
      if (!formData.state || !formData.zones?.length || !formData.districts?.length) {
        this.utilityService.handleError({
          error: {
            message: 'State, zones, and districts are required for manager role'
          }
        });
        return;
      }
      formattedData.state = formData.state;
      formattedData.zones = formData.zones;
      formattedData.districts = formData.districts;
    }
    if (this.mode === 'edit') {
      formattedData._id = this.userId;
      this.shikshanaUserService.editUserDetails(this.userId, formattedData).subscribe({
        next: res => {
          this.router.navigate(['/staff-management/list']);
          this.utilityService.handleResponse(res);
        },
        error: err => {
          console.error('Edit error:', err);
          console.error('Error details:', err.error);
          this.utilityService.handleError(err);
        }
      });
    } else {
      // For create, we need to send the data to the correct endpoint
      this.shikshanaUserService.createUser(formattedData).subscribe({
        next: res => {
          this.router.navigate(['/staff-management/list']);
          this.utilityService.handleResponse(res);
        },
        error: err => {
          if (err.error?.error) {}
          this.utilityService.handleError(err);
        }
      });
    }
  }
  convertToFormControl(absCtrl) {
    return absCtrl;
  }
  get f() {
    return this.addForm.controls;
  }
  patchStatus() {
    if (this.addForm.value.isDeleted === false) {
      this.addForm.patchValue({
        isDeleted: true
      });
    } else {
      this.addForm.patchValue({
        isDeleted: false
      });
    }
  }
  getUserDetails(id) {
    this.commonStaffUserService.getUserDetails(id, 'admin').subscribe({
      next: res => {
        const userData = res.data;
        const roleValue = Array.isArray(userData.role) ? userData.role[0] : userData.role;
        if (roleValue === 'manager' && userData.state) {
          this.updateZoneOptions(userData.state);
          this.updateDistrictOptions(userData.zones);
          this.addForm.patchValue({
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            role: roleValue,
            isDeleted: userData.isDeleted,
            state: userData.state,
            zones: userData.zones,
            districts: userData.districts
          });
        } else {
          // For admin or other roles, clear state/zones/districts
          this.addForm.patchValue({
            name: userData.name,
            phone: userData.phone,
            email: userData.email,
            role: roleValue,
            isDeleted: userData.isDeleted,
            state: null,
            zones: [],
            districts: []
          });
        }
      },
      error: err => {
        console.error(err);
        this.utilityService.handleError(err);
      }
    });
  }
  get isActive() {
    return !this.addForm.get('isDeleted')?.value;
  }
  set isActive(val) {
    this.addForm.get('isDeleted')?.setValue(!val);
  }
  static {
    this.ɵfac = function ShikshanUserManageComponent_Factory(t) {
      return new (t || ShikshanUserManageComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_shikshan_user_service__WEBPACK_IMPORTED_MODULE_1__.ShikshanService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_shared_services_master_service__WEBPACK_IMPORTED_MODULE_2__.MasterService), _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdirectiveInject"](src_app_shared_services_staff_user_common_service__WEBPACK_IMPORTED_MODULE_3__.StaffUserCommonService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵdefineComponent"]({
      type: ShikshanUserManageComponent,
      selectors: [["app-shikshan-user-manage"]],
      decls: 57,
      vars: 57,
      consts: [[1, "px-4", "pt-4", "md:px-0", "md:pt-0"], [1, "flex", "items-center"], ["src", "assets/icons/Vector (3).svg", "routerLink", "/staff-management/list", "alt", "", 1, "w-5", "h-5", "cursor-pointer"], [1, "text-2xl", "md:text-[30px]", "font-bold", "text-content", "md:leading-[48px]", "ml-4"], [1, "border", "text-content", "rounded", "my-5", "px-4", "py-6", "md:px-6", "md:py-8", "bg-white", 3, "ngClass"], [1, "text-content", "text-2xl", "md:text-[30px]", "font-bold", "md:leading-[48px]"], [3, "formGroup", "ngSubmit"], [1, "mt-8"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], [1, "form-control-label"], ["class", "text-[16px] text-error", 4, "ngIf"], ["formControlName", "name", "type", "text", "maxlength", "255", "autocomplete", "off", 1, "form-control", "h-[44px]", 3, "placeholder"], ["class", "form-control-error", 4, "ngIf"], ["formControlName", "phone", "type", "text", "maxlength", "10", "oninput", "this.value=this.value.replace(/(?![0-9])./gmi,'')", "autocomplete", "off", 1, "form-control", "h-[44px]", 3, "placeholder"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "mt-6", "md:mt-8"], ["formControlName", "email", "type", "email", "autocomplete", "off", 1, "form-control", "h-[44px]", 3, "placeholder"], [1, "cursor-pointer"], [3, "dropDownControlName", "mode", "dropDownCtrl", "dropDownValues", "config", "submitted"], ["class", "grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 md:mt-8", 4, "ngIf"], ["class", "mt-6 md:mt-8", 4, "ngIf"], [1, "flex", "items-center", "space-x-4"], ["formControlName", "isDeleted", 3, "color"], ["class", "buttons mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2", 4, "ngIf"], [1, "text-[16px]", "text-error"], [1, "form-control-error"], [1, "mt-6", "md:mt-8"], [1, "buttons", "mt-8", "flex", "flex-col", "sm:flex-row", "items-stretch", "sm:items-center", "justify-end", "gap-2"], ["type", "button", "routerLink", "/staff-management/list", 1, "w-full", "sm:w-20", "btn-outline-primary"], ["type", "submit", 1, "btn-primary", "w-full", "sm:w-20", "flex", "items-center", "justify-center", 3, "disabled"], [1, "mr-1"], ["src", "assets/icons/Vector (4).svg", "alt", ""]],
      template: function ShikshanUserManageComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](6, "div", 4)(7, "h2", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](8);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](9, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](10, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](11, "form", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵlistener"]("ngSubmit", function ShikshanUserManageComponent_Template_form_ngSubmit_11_listener() {
            return ctx.on_form_submit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](12, "div", 7)(13, "div", 8)(14, "div")(15, "label", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](17, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](18, ShikshanUserManageComponent_span_18_Template, 2, 0, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](19, "input", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](20, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](21, ShikshanUserManageComponent_small_21_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](22, ShikshanUserManageComponent_small_22_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](23, "div")(24, "label", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](25);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](26, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](27, ShikshanUserManageComponent_span_27_Template, 2, 0, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](28, "input", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](29, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](30, ShikshanUserManageComponent_small_30_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](31, ShikshanUserManageComponent_small_31_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](32, ShikshanUserManageComponent_small_32_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](33, "div", 14)(34, "div")(35, "label", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](36);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](37, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](38, ShikshanUserManageComponent_span_38_Template, 2, 0, "span", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](39, "input", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](40, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](41, ShikshanUserManageComponent_small_41_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](42, ShikshanUserManageComponent_small_42_Template, 3, 3, "small", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](43, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](44, "app-staff-form-dropdown", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](45, ShikshanUserManageComponent_div_45_Template, 5, 12, "div", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](46, ShikshanUserManageComponent_div_46_Template, 2, 6, "div", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](47, "div", 7)(48, "label", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](49);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](50, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementStart"](51, "div", 20)(52, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtext"](53);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipe"](54, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelement"](55, "ng-toggle", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtemplate"](56, ShikshanUserManageComponent_div_56_Template, 9, 7, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          let tmp_7_0;
          let tmp_8_0;
          let tmp_12_0;
          let tmp_18_0;
          let tmp_19_0;
          let tmp_26_0;
          let tmp_27_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](5, 33, "Staff Management"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpureFunction1"](55, _c0, ctx.mode === "view"));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](9, 35, ctx.mode === "view" ? "View" : ctx.mode === "edit" ? "Edit" : "Add"), " ", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](10, 37, "Staff"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("formGroup", ctx.addForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](17, 39, "Staff Name"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](20, 41, "Enter staff name"));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && ((tmp_7_0 = ctx.addForm.get("name")) == null ? null : tmp_7_0.errors == null ? null : tmp_7_0.errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && ((tmp_8_0 = ctx.addForm.get("name")) == null ? null : tmp_8_0.errors == null ? null : tmp_8_0.errors["minlength"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](26, 43, "Mobile Number"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](29, 45, "Enter Mobile Number"));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && ((tmp_12_0 = ctx.addForm.get("phone")) == null ? null : tmp_12_0.errors == null ? null : tmp_12_0.errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && (ctx.f["phone"].errors == null ? null : ctx.f["phone"].errors["minlength"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && !(ctx.f["phone"].errors == null ? null : ctx.f["phone"].errors["minlength"]) && (ctx.f["phone"].errors == null ? null : ctx.f["phone"].errors["pattern"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](37, 47, "Email"), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.mode != "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](40, 49, "Enter Email"));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && ((tmp_18_0 = ctx.addForm.get("email")) == null ? null : tmp_18_0.errors == null ? null : tmp_18_0.errors["required"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.submitted && ((tmp_19_0 = ctx.addForm.get("email")) == null ? null : tmp_19_0.errors == null ? null : tmp_19_0.errors["email"]));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("dropDownControlName", "role")("mode", ctx.mode)("dropDownCtrl", ctx.convertToFormControl(ctx.f["role"]))("dropDownValues", ctx.userRolesDropdownOptions)("config", ctx.userRoleDropdownconfig)("submitted", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_26_0 = ctx.addForm.get("role")) == null ? null : tmp_26_0.value) === "manager");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ((tmp_27_0 = ctx.addForm.get("role")) == null ? null : tmp_27_0.value) === "manager");
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](50, 51, "Status of staff"));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵpipeBind1"](54, 53, "Active"));
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("color", ctx.toggleconfig.color);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_5__["ɵɵproperty"]("ngIf", ctx.mode !== "view");
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _angular_forms__WEBPACK_IMPORTED_MODULE_6__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_6__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.MaxLengthValidator, _shared_components_staff_form_dropdown_staff_form_dropdown_component__WEBPACK_IMPORTED_MODULE_4__.StafFormDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormControlName, ng_toggle_button__WEBPACK_IMPORTED_MODULE_9__.NgToggleComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__.TranslatePipe],
      styles: ["#toggle[_ngcontent-%COMP%]:checked    + .toggle-label[_ngcontent-%COMP%]   .toggle__dot[_ngcontent-%COMP%] {\n  transform: translateX(100%);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNoaWtzaGFuLXVzZXItbWFuYWdlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0MsMkJBQUE7QUFDRCIsImZpbGUiOiJzaGlrc2hhbi11c2VyLW1hbmFnZS5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIiN0b2dnbGU6Y2hlY2tlZCsudG9nZ2xlLWxhYmVsIC50b2dnbGVfX2RvdCB7XG5cdHRyYW5zZm9ybTogdHJhbnNsYXRlWCgxMDAlKTtcbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi9zaGlrc2hhbi11c2VyLW1hbmFnZW1lbnQvc2hpa3NoYW4tdXNlci1tYW5hZ2Uvc2hpa3NoYW4tdXNlci1tYW5hZ2UuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDQywyQkFBQTtBQUNEO0FBQ0EsNFlBQTRZIiwic291cmNlc0NvbnRlbnQiOlsiI3RvZ2dsZTpjaGVja2VkKy50b2dnbGUtbGFiZWwgLnRvZ2dsZV9fZG90IHtcblx0dHJhbnNmb3JtOiB0cmFuc2xhdGVYKDEwMCUpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 59242:
/*!************************************************************************************************!*\
  !*** ./src/app/view/admin/shikshan-user-management/shikshan-user-management-routing.module.ts ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShikshanUserManagementRoutingModule: () => (/* binding */ ShikshanUserManagementRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _shikshan_user_manage_shikshan_user_manage_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shikshan-user-manage/shikshan-user-manage.component */ 13830);
/* harmony import */ var src_app_shared_components_user_staff_list_user_staff_list_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/components/user-staff-list/user-staff-list.component */ 74333);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);





const routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
}, {
  path: 'list',
  component: src_app_shared_components_user_staff_list_user_staff_list_component__WEBPACK_IMPORTED_MODULE_1__.UserStaffListComponent
}, {
  path: 'add',
  component: _shikshan_user_manage_shikshan_user_manage_component__WEBPACK_IMPORTED_MODULE_0__.ShikshanUserManageComponent
}, {
  path: ':id',
  component: _shikshan_user_manage_shikshan_user_manage_component__WEBPACK_IMPORTED_MODULE_0__.ShikshanUserManageComponent
}];
class ShikshanUserManagementRoutingModule {
  static {
    this.ɵfac = function ShikshanUserManagementRoutingModule_Factory(t) {
      return new (t || ShikshanUserManagementRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: ShikshanUserManagementRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](ShikshanUserManagementRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterModule]
  });
})();

/***/ }),

/***/ 81171:
/*!****************************************************************************************!*\
  !*** ./src/app/view/admin/shikshan-user-management/shikshan-user-management.module.ts ***!
  \****************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShikshanUserManagementModule: () => (/* binding */ ShikshanUserManagementModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shikshan_user_management_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shikshan-user-management-routing.module */ 59242);
/* harmony import */ var src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/components/modal/modal.component */ 69081);
/* harmony import */ var src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/components/disable-popup/disable-popup.component */ 51541);
/* harmony import */ var src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/shared/components/common-dropdown/common-dropdown.component */ 48033);
/* harmony import */ var _shikshan_user_manage_shikshan_user_manage_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shikshan-user-manage/shikshan-user-manage.component */ 13830);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var ng_toggle_button__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ng-toggle-button */ 80405);
/* harmony import */ var src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/shared/components/upload-popup/upload-popup.component */ 86487);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/shared/components/pagination/pagination.component */ 94815);
/* harmony import */ var src_app_shared_components_staff_form_dropdown_staff_form_dropdown_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/shared/components/staff-form-dropdown/staff-form-dropdown.component */ 59925);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);













class ShikshanUserManagementModule {
  static {
    this.ɵfac = function ShikshanUserManagementModule_Factory(t) {
      return new (t || ShikshanUserManagementModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({
      type: ShikshanUserManagementModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_1__.ModalComponent, _shikshan_user_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.ShikshanUserManagementRoutingModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.CommonDropdownComponent, src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_2__.DisablePopupComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, src_app_shared_components_staff_form_dropdown_staff_form_dropdown_component__WEBPACK_IMPORTED_MODULE_7__.StafFormDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.ReactiveFormsModule, ng_toggle_button__WEBPACK_IMPORTED_MODULE_11__.NgToggleModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__.TranslateModule, src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_5__.UploadPopupComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_6__.PaginationComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](ShikshanUserManagementModule, {
    declarations: [_shikshan_user_manage_shikshan_user_manage_component__WEBPACK_IMPORTED_MODULE_4__.ShikshanUserManageComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_1__.ModalComponent, _shikshan_user_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.ShikshanUserManagementRoutingModule, src_app_shared_components_common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_3__.CommonDropdownComponent, src_app_shared_components_disable_popup_disable_popup_component__WEBPACK_IMPORTED_MODULE_2__.DisablePopupComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.FormsModule, src_app_shared_components_staff_form_dropdown_staff_form_dropdown_component__WEBPACK_IMPORTED_MODULE_7__.StafFormDropdownComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_10__.ReactiveFormsModule, ng_toggle_button__WEBPACK_IMPORTED_MODULE_11__.NgToggleModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_12__.TranslateModule, src_app_shared_components_upload_popup_upload_popup_component__WEBPACK_IMPORTED_MODULE_5__.UploadPopupComponent, src_app_shared_components_pagination_pagination_component__WEBPACK_IMPORTED_MODULE_6__.PaginationComponent]
  });
})();

/***/ }),

/***/ 49696:
/*!******************************************************************************!*\
  !*** ./src/app/view/admin/shikshan-user-management/shikshan-user.service.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShikshanService: () => (/* binding */ ShikshanService)
/* harmony export */ });
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 46443);




class ShikshanService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  constructor(http) {
    super(http);
    this.userRoleDropdownOptions = [{
      name: 'Admin',
      value: 'admin'
    }, {
      name: 'Manager',
      value: 'manager'
    }];
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
    this.setUri('admin');
  }
  editUserDetails(id, data) {
    const updatedData = {
      _id: id,
      name: data.name,
      phone: data.phone,
      email: data.email,
      role: Array.isArray(data.role) ? data.role : [data.role],
      isDeleted: data.isDeleted,
      state: data.state,
      zones: data.zones,
      districts: data.districts
    };
    return this.put('update', updatedData);
  }
  createUser(data) {
    const createData = {
      ...data,
      role: Array.isArray(data.role) ? data.role : [data.role]
    };
    return this.post('create', createData);
  }
  bulkUpload(formdata) {
    return this.post('bulk-upload', formdata);
  }
  static {
    this.ɵfac = function ShikshanService_Factory(t) {
      return new (t || ShikshanService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: ShikshanService,
      factory: ShikshanService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_shikshan-user-management_shikshan-user-management_module_ts.044bfc77dfdf2abf.js.map