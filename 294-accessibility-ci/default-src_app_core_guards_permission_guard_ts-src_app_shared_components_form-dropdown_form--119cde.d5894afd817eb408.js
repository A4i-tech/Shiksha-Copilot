"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["default-src_app_core_guards_permission_guard_ts-src_app_shared_components_form-dropdown_form--119cde"],{

/***/ 83811:
/*!*************************************************!*\
  !*** ./src/app/core/guards/permission.guard.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PermissionGuard: () => (/* binding */ PermissionGuard)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _services_utility_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/utility.service */ 8128);


const PermissionGuard = route => {
  const utilityServcie = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_services_utility_service__WEBPACK_IMPORTED_MODULE_0__.UtilityService);
  if (utilityServcie.hasPermission(route.data?.['permissions'])) {
    return true;
  } else {
    return false;
  }
};

/***/ }),

/***/ 55233:
/*!****************************************************************************!*\
  !*** ./src/app/shared/components/form-dropdown/form-dropdown.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FormDropdownComponent: () => (/* binding */ FormDropdownComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ng-select/ng-select */ 62223);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 90852);










function FormDropdownComponent_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function FormDropdownComponent_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 8);
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
function FormDropdownComponent_8_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "input", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r7 = ctx.item;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx_r6.dropDownCtrl.value == null ? null : ctx_r6.dropDownCtrl.value.includes(ctx_r6.config.selectAllValue ? item_r7[ctx_r6.config.selectAllValue] : item_r7));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx_r6.config.selectAllValue ? item_r7[ctx_r6.config.selectAllValue] : item_r7);
  }
}
function FormDropdownComponent_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, FormDropdownComponent_8_ng_template_0_Template, 4, 2, "ng-template", 9);
  }
}
function FormDropdownComponent_9_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "label", 10)(1, "input", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function FormDropdownComponent_9_ng_template_0_Template_input_change_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r11);
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r10.toggleSelectAll($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2, " Select All ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx_r9.isSelectAll());
  }
}
function FormDropdownComponent_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, FormDropdownComponent_9_ng_template_0_Template, 3, 1, "ng-template", 13);
  }
}
function FormDropdownComponent_small_10_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r12.config.fieldName), " ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 4, "is required"), "");
  }
}
function FormDropdownComponent_small_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormDropdownComponent_small_10_ng_container_1_Template, 4, 6, "ng-container", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", ctx_r4.dropDownControlName + "-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r4.dropDownCtrl.errors == null ? null : ctx_r4.dropDownCtrl.errors["required"]);
  }
}
function FormDropdownComponent_ng_container_11_ng_container_2_span_1_img_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 22);
  }
  if (rf & 2) {
    const item_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).$implicit;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("title", ctx_r17.getSafeInfo(ctx_r17.getItemForValue(item_r14)));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("aria-label", ctx_r17.getSafeInfo(ctx_r17.getItemForValue(item_r14)) || "Info");
  }
}
function FormDropdownComponent_ng_container_11_ng_container_2_span_1_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).$implicit;
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r18.getLabelForValue(item_r14)));
  }
}
function FormDropdownComponent_ng_container_11_ng_container_2_span_1_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).$implicit;
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r19.getLabelForValue(item_r14)));
  }
}
function FormDropdownComponent_ng_container_11_ng_container_2_span_1_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).$implicit;
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r20.getLabelForValue(item_r14)));
  }
}
function FormDropdownComponent_ng_container_11_ng_container_2_span_1_span_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r28 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FormDropdownComponent_ng_container_11_ng_container_2_span_1_span_5_Template_span_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r28);
      const i_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2).index;
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r26.removeItem(i_r15));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "\u00D7");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function FormDropdownComponent_ng_container_11_ng_container_2_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormDropdownComponent_ng_container_11_ng_container_2_span_1_img_1_Template, 1, 2, "img", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormDropdownComponent_ng_container_11_ng_container_2_span_1_span_2_Template, 3, 3, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, FormDropdownComponent_ng_container_11_ng_container_2_span_1_span_3_Template, 3, 3, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, FormDropdownComponent_ng_container_11_ng_container_2_span_1_span_4_Template, 3, 3, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, FormDropdownComponent_ng_container_11_ng_container_2_span_1_span_5_Template, 2, 0, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (tmp_0_0 = ctx_r16.getItemForValue(item_r14)) == null ? null : tmp_0_0.info);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r16.config == null ? null : ctx_r16.config.chipValueType) === "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r16.config == null ? null : ctx_r16.config.chipValueType) === "uppercase");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !(ctx_r16.config == null ? null : ctx_r16.config.chipValueType));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", (ctx_r16.config == null ? null : ctx_r16.config.chipClearableOff) ? false : true);
  }
}
function FormDropdownComponent_ng_container_11_ng_container_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, FormDropdownComponent_ng_container_11_ng_container_2_span_1_Template, 6, 5, "span", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", item_r14);
  }
}
function FormDropdownComponent_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, FormDropdownComponent_ng_container_11_ng_container_2_Template, 2, 1, "ng-container", 17);
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
class FormDropdownComponent {
  static {
    this.nextId = 0;
  }
  constructor() {
    this.inputId = `form-dropdown-${FormDropdownComponent.nextId++}`;
    /** Options for the dropdown; items may include optional `info` (string) for tooltip. */
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
    this.filterDropDownValues();
  }
  /**
   * Angular onchanges lifecycle hook to handle input changes
   */
  ngOnChanges(changes) {
    if (changes['dropDownValues']) {
      this.filterDropDownValues();
    }
  }
  /**
   * Filter out invalid items from dropDownValues to prevent ng-select errors
   */
  filterDropDownValues() {
    // Ensure dropDownValues is always an array
    if (!Array.isArray(this.dropDownValues)) {
      this.dropDownValues = [];
      return;
    }
    // Filter out null/undefined items to prevent ng-select errors
    this.dropDownValues = this.dropDownValues.filter(item => item != null);
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
      const data = this.dropDownValues.map(e => this.config?.selectAllValue ? e[this.config.selectAllValue] : e);
      this.dropDownCtrl.setValue(data);
      this.valueChange.emit(data);
    } else {
      const data = this.dropDownValues.map(e => this.config.bindValue ? e[this.config.bindValue] : e);
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
    const raw = this.dropDownCtrl?.value;
    const currentVal = Array.isArray(raw) ? [...raw] : [];
    const index = currentVal.findIndex(i => i === item);
    if (index === -1) {
      currentVal.push(item);
      this.dropDownCtrl.setValue(currentVal);
    } else {
      currentVal.splice(index, 1);
      this.dropDownCtrl.setValue(currentVal);
    }
  }
  toggleSelectAll(event) {
    const target = event.target;
    if (target?.checked) {
      if (this.config.selectAllValue) {
        const data = this.dropDownValues.map(e => this.config?.selectAllValue ? e[this.config.selectAllValue] : e);
        this.dropDownCtrl.setValue(data);
        this.valueChange.emit(data);
      } else {
        const data = this.dropDownValues.map(e => this.config.bindValue ? e[this.config.bindValue] : e);
        this.dropDownCtrl.setValue(data);
        this.valueChange.emit(data);
      }
    } else {
      this.dropDownCtrl.setValue([]);
      this.valueChange.emit([]);
    }
  }
  isSelectAll() {
    const raw = this.dropDownCtrl.value;
    const currentVal = Array.isArray(raw) ? raw : [];
    return currentVal.length === this.dropDownValues?.length;
  }
  isSelected(item) {
    const raw = this.dropDownCtrl.value;
    const currentVal = Array.isArray(raw) ? raw : [];
    return currentVal.some(i => i === item);
  }
  get hasSelections() {
    const raw = this.dropDownCtrl.value;
    const currentVal = Array.isArray(raw) ? raw : [];
    return currentVal.length > 0;
  }
  /**
   * Returns option info text for use in tooltip/aria-label.
   * This is not user-entered text and does not require additional sanitization.
   */
  getSafeInfo(item) {
    return item?.info ?? '';
  }
  /**
   * Get the display label for a value by looking it up in dropDownValues
   * @param value The value to look up (e.g., abbreviation)
   * @returns The label to display (e.g., boardName) or the value itself if not found
   */
  getLabelForValue(value) {
    if (value == null || value === '') {
      return '';
    }
    // If bindValue and bindLable are configured, look up the label
    if (this.config.bindValue && this.config.bindLable && this.dropDownValues?.length > 0) {
      // Find the item in dropDownValues that matches the value
      const item = this.dropDownValues.find(item => item && item[this.config.bindValue] === value);
      // Return the label if found (coerce to string to avoid [object Object] for non-string values)
      if (item && this.config.bindLable && item[this.config.bindLable] != null) {
        const raw = item[this.config.bindLable];
        return typeof raw === 'string' ? raw : String(raw);
      }
    }
    // Fallback: return the value itself (or empty string if value is falsy)
    return value != null && value !== '' ? String(value) : '';
  }
  /**
   * Get the original item object for a value by looking it up in dropDownValues
   * @param value The value to look up
   * @returns The original option object, or undefined if not found
   */
  getItemForValue(value) {
    if (value == null || value === '') {
      return undefined;
    }
    if (this.config.bindValue && this.dropDownValues?.length > 0) {
      // If value is an object, try to match by its bindValue property
      if (typeof value === 'object' && value[this.config.bindValue] !== undefined) {
        return this.dropDownValues.find(item => item && item[this.config.bindValue] === value[this.config.bindValue]);
      }
      return this.dropDownValues.find(item => item && item[this.config.bindValue] === value);
    }
    return typeof value === 'object' ? value : undefined;
  }
  static {
    this.ɵfac = function FormDropdownComponent_Factory(t) {
      return new (t || FormDropdownComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FormDropdownComponent,
      selectors: [["app-form-dropdown"]],
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
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 12,
      vars: 33,
      consts: [[1, "select-wrapper", 3, "formGroup"], [1, "form-control-label", 3, "for"], ["class", "text-[16px] text-error", 4, "ngIf"], ["class", "area-label", 3, "ngClass", 4, "ngIf"], [3, "labelForId", "items", "ngClass", "placeholder", "bindLabel", "bindValue", "dropdownPosition", "searchable", "clearable", "multiple", "formControl", "closeOnSelect", "change"], [4, "ngIf"], ["class", "form-control-error", 3, "id", 4, "ngIf"], [1, "text-[16px]", "text-error"], [1, "area-label", 3, "ngClass"], ["ng-option-tmp", ""], [1, "flex", "items-center", "gap-2"], ["type", "checkbox", 3, "checked"], [1, "whitespace-nowrap", "overflow-x-hidden", "text-ellipsis"], ["ng-header-tmp", ""], ["type", "checkbox", 3, "checked", "change"], [1, "form-control-error", 3, "id"], [1, "mt-2", "flex-wrap"], [4, "ngFor", "ngForOf"], ["class", "chip", 4, "ngIf"], [1, "chip"], ["src", "assets/icons/info-primary.svg", "class", "inline-block w-4 h-4 mr-1 cursor-help", "alt", "", 3, "title", 4, "ngIf"], ["class", "close-icon", 3, "click", 4, "ngIf"], ["src", "assets/icons/info-primary.svg", "alt", "", 1, "inline-block", "w-4", "h-4", "mr-1", "cursor-help", 3, "title"], [1, "close-icon", 3, "click"]],
      template: function FormDropdownComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "label", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, FormDropdownComponent_span_4_Template, 2, 0, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, FormDropdownComponent_span_5_Template, 3, 4, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "ng-select", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function FormDropdownComponent_Template_ng_select_change_6_listener($event) {
            return ctx.valueSelected($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](7, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](8, FormDropdownComponent_8_Template, 1, 0, null, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, FormDropdownComponent_9_Template, 1, 0, null, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, FormDropdownComponent_small_10_Template, 2, 2, "small", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, FormDropdownComponent_ng_container_11_Template, 3, 1, "ng-container", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("formGroup", ctx.formGroupTemp);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("sr-only", ctx.config.hideLabel);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", ctx.inputId);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 27, ctx.config.fieldName), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.required && ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.multi && (ctx.dropDownCtrl == null ? null : ctx.dropDownCtrl.value == null ? null : ctx.dropDownCtrl.value.length) > 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](31, _c0, ctx.config.height));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("bindLabel", ctx.config.bindLable ? ctx.config.bindLable : "name");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("bindValue", ctx.config.bindValue ? ctx.config.bindValue : "value");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("labelForId", ctx.inputId)("items", ctx.dropDownValues)("ngClass", ctx.config.isBackground && (ctx.dropDownCtrl.disabled || ctx.config.disabled) ? "with-background" : "")("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](7, 29, ctx.config.placeHolderTxt))("dropdownPosition", "auto")("searchable", ctx.config.searchable || false)("clearable", ctx.config.clearableOff ? false : true)("multiple", ctx.config.multi ? true : false)("formControl", ctx.dropDownCtrl)("closeOnSelect", ctx.config.openOnSelect ? false : true);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("aria-invalid", ctx.submitted && ctx.dropDownCtrl.invalid ? "true" : null)("aria-describedby", ctx.submitted && ctx.dropDownCtrl.invalid ? ctx.dropDownControlName + "-error" : null);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.multi && ctx.config.selectAllOption);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.multi && ctx.config.selectAllOption && ctx.dropDownValues.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.submitted && ctx.dropDownCtrl.invalid);
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

/***/ 60255:
/*!**************************************************************************************!*\
  !*** ./src/app/shared/components/instructions-popup/instructions-popup.component.ts ***!
  \**************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InstructionsPopupComponent: () => (/* binding */ InstructionsPopupComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _modal_modal_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modal/modal.service */ 51133);






function InstructionsPopupComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 8)(1, "p", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](3, "div", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const instruction_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](instruction_r1.type);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("innerHTML", instruction_r1.description, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeHtml"]);
  }
}
class InstructionsPopupComponent {
  constructor(modalServcie) {
    this.modalServcie = modalServcie;
    this.showInstructions = new _angular_core__WEBPACK_IMPORTED_MODULE_1__.EventEmitter();
    this.isChatbot = false;
  }
  closeModal() {
    this.showInstructions.emit(false);
    if (this.isChatbot) {
      this.modalServcie.showChatbotSampleDialog = false;
    }
  }
  static {
    this.ɵfac = function InstructionsPopupComponent_Factory(t) {
      return new (t || InstructionsPopupComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_modal_modal_service__WEBPACK_IMPORTED_MODULE_0__.ModalService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: InstructionsPopupComponent,
      selectors: [["app-instructions-popup"]],
      inputs: {
        instructions: "instructions",
        isChatbot: "isChatbot"
      },
      outputs: {
        showInstructions: "showInstructions"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
      decls: 10,
      vars: 1,
      consts: [[1, "z-100"], [1, "flex", "items-center", "gap-1", "mb-2"], ["src", "assets/icons/back-arrow.svg", "alt", "", 1, "w-5", "h-5", "cursor-pointer", 3, "click"], [1, "font-bold", "text-[20px]", "text-content"], [1, "h-[75vh]", "px-3", "overflow-y-auto", "instruction-container"], ["class", "my-4", 4, "ngFor", "ngForOf"], [1, "buttons", "mt-4", "flex", "items-center", "justify-end", "gap-2"], [1, "btn-outline-primary", 3, "click"], [1, "my-4"], [1, "text-sm", "my-1", "font-bold", "capitalize"], [1, "p-2", "bg-white", "rounded-md", "border", "text-sm", "block", 3, "innerHTML"]],
      template: function InstructionsPopupComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function InstructionsPopupComponent_Template_img_click_2_listener() {
            return ctx.closeModal();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Sample Instructions");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, InstructionsPopupComponent_div_6_Template, 4, 2, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 6)(8, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function InstructionsPopupComponent_Template_button_click_8_listener() {
            return ctx.closeModal();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Back");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.instructions);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormsModule],
      styles: [".instruction-container[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.instruction-container[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: var(--primary-40);\n}\n.instruction-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: var(--primary-80);\n}\n.instruction-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: var(--primary-DEFAULT);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluc3RydWN0aW9ucy1wb3B1cC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDSTtFQUNFLFVBQUE7QUFBTjtBQUdJO0VBQ0UsNkJBQUE7QUFETjtBQUlJO0VBQ0UsNkJBQUE7QUFGTjtBQUtJO0VBQ0Usa0NBQUE7QUFITiIsImZpbGUiOiJpbnN0cnVjdGlvbnMtcG9wdXAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaW5zdHJ1Y3Rpb24tY29udGFpbmVye1xuICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICAgIHdpZHRoOiA0cHg7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS00MCk7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS04MCk7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgICB9XG4gIH0iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvaW5zdHJ1Y3Rpb25zLXBvcHVwL2luc3RydWN0aW9ucy1wb3B1cC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDSTtFQUNFLFVBQUE7QUFBTjtBQUdJO0VBQ0UsNkJBQUE7QUFETjtBQUlJO0VBQ0UsNkJBQUE7QUFGTjtBQUtJO0VBQ0Usa0NBQUE7QUFITjtBQUNBLDR5QkFBNHlCIiwic291cmNlc0NvbnRlbnQiOlsiLmluc3RydWN0aW9uLWNvbnRhaW5lcntcbiAgICAmOjotd2Via2l0LXNjcm9sbGJhciB7XG4gICAgICB3aWR0aDogNHB4O1xuICAgIH1cblxuICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcbiAgICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktNDApO1xuICAgIH1cblxuICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcbiAgICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktODApO1xuICAgIH1cblxuICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iOmhvdmVyIHtcbiAgICAgIGJhY2tncm91bmQ6IHZhcigtLXByaW1hcnktREVGQVVMVCk7XG4gICAgfVxuICB9Il0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 69081:
/*!************************************************************!*\
  !*** ./src/app/shared/components/modal/modal.component.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModalComponent: () => (/* binding */ ModalComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/cdk/a11y */ 72102);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _modal_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./modal.service */ 51133);





const _c0 = ["*"];
class ModalComponent {
  constructor(modalService) {
    this.modalService = modalService;
    this.previousActiveElement = null;
  }
  ngOnInit() {
    this.previousActiveElement = document.activeElement;
  }
  ngOnDestroy() {
    if (this.previousActiveElement) {
      this.previousActiveElement.focus();
    }
  }
  handleEscape(event) {
    this.closeModal();
  }
  closeModal() {
    this.modalService.showDeleteUserDialog = false;
    this.modalService.showRenegenerateDialog = false;
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
  static {
    this.ɵfac = function ModalComponent_Factory(t) {
      return new (t || ModalComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_modal_service__WEBPACK_IMPORTED_MODULE_0__.ModalService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ModalComponent,
      selectors: [["app-modal"]],
      hostBindings: function ModalComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("keydown.escape", function ModalComponent_keydown_escape_HostBindingHandler($event) {
            return ctx.handleEscape($event);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresolveDocument"]);
        }
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
      ngContentSelectors: _c0,
      decls: 8,
      vars: 1,
      consts: [["aria-labelledby", "modal-title", "role", "dialog", "aria-modal", "true", "cdkTrapFocus", "", 1, "relative", "z-[1000]", 3, "cdkTrapFocusAutoCapture"], [1, "fixed", "inset-0", "bg-gray-500", "bg-opacity-75", "transition-opacity", "duration-500"], [1, "fixed", "inset-0", "z-10", "w-screen", "overflow-y-auto"], [1, "flex", "min-h-full", "items-center", "justify-center", "p-4", "text-center", "sm:items-center", "sm:p-3"], [1, "relative", "w-[100%]", "md:w-[40%]", "transform", "overflow-hidden", "rounded-lg", "bg-white", "text-left", "shadow-xl", "transition-all", "sm:my-8"], [1, "bg-white", "px-4", "pb-4", "pt-5", "sm:p-6", "sm:pb-4", 3, "click"], ["modalBody", ""]],
      template: function ModalComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojectionDef"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5, 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function ModalComponent_Template_div_click_5_listener($event) {
            return ctx.stopPropagation($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵprojection"](7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("cdkTrapFocusAutoCapture", true);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_3__.A11yModule, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_3__.CdkTrapFocus],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJtb2RhbC5jb21wb25lbnQuc2NzcyJ9 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvbW9kYWwvbW9kYWwuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUNBLGdLQUFnSyIsInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 51133:
/*!**********************************************************!*\
  !*** ./src/app/shared/components/modal/modal.service.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ModalService: () => (/* binding */ ModalService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);

class ModalService {
  constructor() {
    this.showDeleteUserDialog = false;
    this.showBlukUploadDialog = false;
    this.showGettingLessonPlanLoader = false;
    this.showRenegenerateDialog = false;
    this.showUploadErrorDialog = false;
    this.showChatbotSampleDialog = false;
  }
  static {
    this.ɵfac = function ModalService_Factory(t) {
      return new (t || ModalService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: ModalService,
      factory: ModalService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 94815:
/*!**********************************************************************!*\
  !*** ./src/app/shared/components/pagination/pagination.component.ts ***!
  \**********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   PaginationComponent: () => (/* binding */ PaginationComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);




function PaginationComponent_div_0_ng_container_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainer"](0);
  }
}
function PaginationComponent_div_0_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainer"](0);
  }
}
const _c0 = function (a0) {
  return {
    items: a0,
    responsiveClass: "sm:hidden",
    sizeClass: "px-3 py-2 text-xs"
  };
};
const _c1 = function (a0) {
  return {
    items: a0,
    responsiveClass: "hidden sm:inline-flex",
    sizeClass: "px-3 sm:px-4 py-2 text-xs sm:text-sm"
  };
};
function PaginationComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 2)(1, "div", 3)(2, "div", 4)(3, "p", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "div", 6)(6, "nav", 7)(7, "button", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_div_0_Template_button_click_7_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r5.onPageChange(ctx_r5.currentPage - 1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](8, "img", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, PaginationComponent_div_0_ng_container_9_Template, 1, 0, "ng-container", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, PaginationComponent_div_0_ng_container_10_Template, 1, 0, "ng-container", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "button", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_div_0_Template_button_click_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r7.onPageChange(ctx_r7.currentPage + 1));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](12, "img", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵreference"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("Showing ", ctx_r0.getDisplayRange(), " of total ", ctx_r0.totalItems, " records");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r0.currentPage === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngTemplateOutlet", _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](8, _c0, ctx_r0.mobileItems));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngTemplateOutlet", _r1)("ngTemplateOutletContext", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](10, _c1, ctx_r0.desktopItems));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("disabled", ctx_r0.currentPage * ctx_r0.pageSize >= ctx_r0.totalItems);
  }
}
const _c2 = function (a0, a1, a2) {
  return [a0, a1, a2];
};
function PaginationComponent_ng_template_1_ng_container_0_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function PaginationComponent_ng_template_1_ng_container_0_button_1_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r17);
      const item_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
      const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r15.onPageChange(item_r12.page));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]().$implicit;
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    const responsiveClass_r9 = ctx_r19.responsiveClass;
    const sizeClass_r10 = ctx_r19.sizeClass;
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("active", item_r12.page === ctx_r13.currentPage);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction3"](6, _c2, responsiveClass_r9, sizeClass_r10, item_r12.page === ctx_r13.currentPage ? "bg-primary text-white" : "text-content-50"));
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("aria-current", item_r12.page === ctx_r13.currentPage ? "page" : null)("aria-label", "Go to page " + item_r12.page);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", item_r12.page, " ");
  }
}
const _c3 = function (a0, a1) {
  return [a0, a1, "text-content-50"];
};
function PaginationComponent_ng_template_1_ng_container_0_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, " ... ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    const responsiveClass_r9 = ctx_r20.responsiveClass;
    const sizeClass_r10 = ctx_r20.sizeClass;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction2"](1, _c3, responsiveClass_r9, sizeClass_r10));
  }
}
function PaginationComponent_ng_template_1_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, PaginationComponent_ng_template_1_ng_container_0_button_1_Template, 2, 10, "button", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, PaginationComponent_ng_template_1_ng_container_0_span_2_Template, 2, 4, "span", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const item_r12 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", item_r12.type === "page");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", item_r12.type === "ellipsis");
  }
}
function PaginationComponent_ng_template_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, PaginationComponent_ng_template_1_ng_container_0_Template, 3, 2, "ng-container", 13);
  }
  if (rf & 2) {
    const items_r8 = ctx.items;
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngForOf", items_r8);
  }
}
class PaginationComponent {
  constructor() {
    this.totalItems = 0;
    this.pageSize = 10;
    this.currentPage = 1;
    this.pageChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this._desktopItems = [];
    this._mobileItems = [];
  }
  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }
  get desktopItems() {
    return this._desktopItems;
  }
  get mobileItems() {
    return this._mobileItems;
  }
  ngOnChanges(changes) {
    if (changes['totalItems'] || changes['pageSize'] || changes['currentPage']) {
      this._desktopItems = this.buildPaginationItems(1, 1);
      this._mobileItems = this.buildPaginationItems(1, 0);
    }
  }
  onPageChange(page) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }
    this.pageChange.emit(page);
  }
  getDisplayRange() {
    const startRecord = (this.currentPage - 1) * this.pageSize + 1;
    const endRecord = this.currentPage * this.pageSize;
    const adjustedEndRecord = endRecord > this.totalItems ? this.totalItems : endRecord;
    return `${startRecord} - ${adjustedEndRecord}`;
  }
  buildPaginationItems(boundaryCount, siblingCount) {
    const totalPages = this.totalPages;
    if (totalPages <= 0) {
      return [];
    }
    const startPages = this.range(1, Math.min(boundaryCount, totalPages));
    const endPages = this.range(Math.max(totalPages - boundaryCount + 1, boundaryCount + 1), totalPages);
    const siblingsStart = Math.max(Math.min(this.currentPage - siblingCount, totalPages - boundaryCount - siblingCount * 2 - 1), boundaryCount + 2);
    const siblingsEnd = Math.min(Math.max(this.currentPage + siblingCount, boundaryCount + siblingCount * 2 + 2), totalPages - boundaryCount - 1);
    const items = startPages.map(page => this.pageItem(page));
    if (siblingsStart > boundaryCount + 2) {
      items.push(this.ellipsisItem('start'));
    } else if (boundaryCount + 1 < totalPages - boundaryCount) {
      items.push(this.pageItem(boundaryCount + 1));
    }
    this.range(siblingsStart, siblingsEnd).forEach(page => {
      items.push(this.pageItem(page));
    });
    if (siblingsEnd < totalPages - boundaryCount - 1) {
      items.push(this.ellipsisItem('end'));
    } else if (totalPages - boundaryCount > boundaryCount) {
      items.push(this.pageItem(totalPages - boundaryCount));
    }
    endPages.forEach(page => {
      if (!items.some(item => item.type === 'page' && item.page === page)) {
        items.push(this.pageItem(page));
      }
    });
    return items;
  }
  pageItem(page) {
    return {
      type: 'page',
      page,
      key: `page-${page}`
    };
  }
  ellipsisItem(position) {
    return {
      type: 'ellipsis',
      key: `${position}-ellipsis`
    };
  }
  range(start, end) {
    if (end < start) {
      return [];
    }
    return Array.from({
      length: end - start + 1
    }, (_, index) => start + index);
  }
  static {
    this.ɵfac = function PaginationComponent_Factory(t) {
      return new (t || PaginationComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: PaginationComponent,
      selectors: [["app-pagination"]],
      inputs: {
        totalItems: "totalItems",
        pageSize: "pageSize",
        currentPage: "currentPage"
      },
      outputs: {
        pageChange: "pageChange"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵNgOnChangesFeature"], _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 3,
      vars: 1,
      consts: [["class", "pagination", 4, "ngIf"], ["paginationItems", ""], [1, "pagination"], [1, "border-gray-200", "bg-white", "px-4", "py-3"], [1, "flex", "flex-col", "gap-3", "sm:flex-row", "sm:items-center", "sm:justify-between"], [1, "text-content-50", "text-xs", "sm:text-sm", "text-center", "sm:text-left"], [1, "w-full", "sm:w-auto", "overflow-x-auto"], ["aria-label", "Pagination", 1, "isolate", "flex", "w-max", "min-w-full", "justify-center", "gap-1", "rounded-md", "shadow-sm", "sm:min-w-max"], ["type", "button", "aria-label", "Go to previous page", 1, "relative", "inline-flex", "items-center", "rounded", "px-2", "py-2", "text-content-50", "hover:bg-gray-50", "focus:z-20", "focus:outline-offset-0", 3, "disabled", "click"], ["src", "assets/icons/Chevron left large.svg", "alt", ""], [4, "ngTemplateOutlet", "ngTemplateOutletContext"], ["type", "button", "aria-label", "Go to next page", 1, "rounded", "relative", "inline-flex", "items-center", "px-2", "py-2", "text-content-50", "hover:bg-gray-50", "focus:z-20", "focus:outline-offset-0", 3, "disabled", "click"], ["src", "assets/icons/Chevron right large.svg", "alt", ""], [4, "ngFor", "ngForOf"], ["type", "button", "class", "rounded border relative inline-flex min-w-9 justify-center items-center font-semibold focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", 3, "active", "ngClass", "click", 4, "ngIf"], ["class", "rounded border relative inline-flex min-w-9 justify-center items-center font-semibold", "aria-hidden", "true", 3, "ngClass", 4, "ngIf"], ["type", "button", 1, "rounded", "border", "relative", "inline-flex", "min-w-9", "justify-center", "items-center", "font-semibold", "focus:z-20", "focus-visible:outline", "focus-visible:outline-2", "focus-visible:outline-offset-2", "focus-visible:outline-primary", 3, "ngClass", "click"], ["aria-hidden", "true", 1, "rounded", "border", "relative", "inline-flex", "min-w-9", "justify-center", "items-center", "font-semibold", 3, "ngClass"]],
      template: function PaginationComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, PaginationComponent_div_0_Template, 13, 12, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, PaginationComponent_ng_template_1_Template, 1, 1, "ng-template", null, 1, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplateRefExtractor"]);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.totalItems > ctx.pageSize);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgIf, _angular_common__WEBPACK_IMPORTED_MODULE_1__.NgTemplateOutlet],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 2216:
/*!***************************************************!*\
  !*** ./src/app/shared/services/master.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MasterService: () => (/* binding */ MasterService)
/* harmony export */ });
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);



class MasterService {
  /**
   * Class constructor
   * @param http HttpClient
   */
  constructor(http) {
    this.http = http;
    this.baseurl = src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl;
  }
  /**
   * Function to get regions data
   * @returns
   */
  getRegions() {
    return this.http.get(`${this.baseurl}/regions/list?limit=999`);
  }
  /**
   * Function to get states data
   * @returns
   */
  getStates() {
    return this.http.get(`${this.baseurl}/regions/states`);
  }
  /**
   * Function to get zones data for a state
   * @param state State name
   * @returns
   */
  getZones(state) {
    return this.http.get(`${this.baseurl}/regions/zones?state=${state}`);
  }
  /**
   * Function to get districts data for a zone
   * @param zone Zone name
   * @returns
   */
  getDistricts(zone) {
    return this.http.get(`${this.baseurl}/regions/districts?zone=${zone}`);
  }
  /**
   * Function to get taluks data for a district
   * @param district District name
   * @returns
   */
  getTaluks(district) {
    return this.http.get(`${this.baseurl}/regions/taluks?district=${district}`);
  }
  /**
   * Function to get schools data for a taluk
   * @param taluk Taluk name
   * @returns
   */
  getSchools(taluk) {
    return this.http.get(`${this.baseurl}/regions/schools?taluk=${taluk}`);
  }
  /**
   * Function to get board data
   * @returns
   */
  getBoards() {
    return this.http.get(`${this.baseurl}/board/list?limit=999`);
  }
  /**
   * Function to get resource data
   * Temp mock response
   * @revamp
   * @returns
   */
  getFacilities() {
    return this.http.get(`${this.baseurl}/facility/list?limit=999`);
  }
  static {
    this.ɵfac = function MasterService_Factory(t) {
      return new (t || MasterService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: MasterService,
      factory: MasterService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 56664:
/*!***********************************************************!*\
  !*** ./src/app/view/user/chatbot/chat-markdown.module.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChatMarkdownModule: () => (/* binding */ ChatMarkdownModule)
/* harmony export */ });
/* harmony import */ var ngx_markdown__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ngx-markdown */ 8329);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);



class ChatMarkdownModule {
  static {
    this.ɵfac = function ChatMarkdownModule_Factory(t) {
      return new (t || ChatMarkdownModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: ChatMarkdownModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      imports: [ngx_markdown__WEBPACK_IMPORTED_MODULE_1__.MarkdownModule.forRoot({
        markedOptions: {
          provide: ngx_markdown__WEBPACK_IMPORTED_MODULE_1__.MarkedOptions,
          useValue: {
            breaks: true
          }
        }
      }), ngx_markdown__WEBPACK_IMPORTED_MODULE_1__.MarkdownModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](ChatMarkdownModule, {
    imports: [ngx_markdown__WEBPACK_IMPORTED_MODULE_1__.MarkdownModule],
    exports: [ngx_markdown__WEBPACK_IMPORTED_MODULE_1__.MarkdownModule]
  });
})();

/***/ }),

/***/ 44154:
/*!********************************************************!*\
  !*** ./src/app/view/user/chatbot/chatbot.component.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChatbotComponent: () => (/* binding */ ChatbotComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var src_app_shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/components/profile-image/profile-image.component */ 85445);
/* harmony import */ var src_app_shared_components_instructions_popup_instructions_popup_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/components/instructions-popup/instructions-popup.component */ 60255);
/* harmony import */ var src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/components/modal/modal.component */ 69081);
/* harmony import */ var _chat_markdown_module__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./chat-markdown.module */ 56664);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _chatbot_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./chatbot.service */ 54334);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/platform-browser */ 80436);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var src_app_layout_sidebar_sidebar_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! src/app/layout/sidebar/sidebar.service */ 41883);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! src/app/shared/components/modal/modal.service */ 51133);
/* harmony import */ var ngx_markdown__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ngx-markdown */ 8329);


















const _c0 = ["textArea"];
const _c1 = ["header"];
function ChatbotComponent_img_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r12 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "img", 26);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function ChatbotComponent_img_2_Template_img_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r12);
      const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r11.backNavigation());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
}
function ChatbotComponent_p_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "p", 27);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](5, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](7, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](8, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](10, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](11, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpropertyInterpolateV"]("title", ["", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](1, 22, "Board"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.board, ", ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](2, 24, "Medium"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.medium, ", ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](3, 26, "Class"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.standard, ", ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](4, 28, "Subject"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.subject, ", ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](5, 30, "Chapter"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.orderNumber, ". ", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.topics, ""]);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolateV"](["", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](7, 32, "Board"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.board, ", ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](8, 34, "Medium"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.medium, ", ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](9, 36, "Class"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.standard, ", ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](10, 38, "Subject"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.subject, ", ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](11, 40, "Chapter"), "-", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.orderNumber, ". ", ctx_r2.chapterDetails == null ? null : ctx_r2.chapterDetails.topics, ""]);
  }
}
function ChatbotComponent_p_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "p", 28);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate4"]("", ctx_r3.chapterDetails == null ? null : ctx_r3.chapterDetails.standard, ". ", ctx_r3.chapterDetails == null ? null : ctx_r3.chapterDetails.subject, " ", ctx_r3.chapterDetails == null ? null : ctx_r3.chapterDetails.orderNumber, ". ", ctx_r3.chapterDetails == null ? null : ctx_r3.chapterDetails.topics, "");
  }
}
function ChatbotComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "div", 29);
  }
}
function ChatbotComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "img", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](2, "p", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](4, 1, "Hello! I am here to assist you. Just type your question to get started!"), " ");
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_div_1_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "div", 46);
  }
  if (rf & 2) {
    const message_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).$implicit;
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("innerHTML", ctx_r17.transformText(message_r14.answer), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsanitizeHtml"]);
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_div_1_markdown_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](0, "markdown", 47);
  }
  if (rf & 2) {
    const message_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("data", message_r14.answer);
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_div_6_a_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "a", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ref_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("href", ref_r23.url, _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", ref_r23.title, " ");
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_div_6_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ref_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](ref_r23.title);
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_div_6_p_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "p", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ref_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](ref_r23.text);
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 53)(1, "span", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](3, ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_div_6_a_3_Template, 2, 2, "a", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](4, ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_div_6_span_4_Template, 2, 1, "span", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](5, ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_div_6_p_5_Template, 2, 1, "p", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ref_r23 = ctx.$implicit;
    const i_r24 = ctx.index;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"]("", i_r24 + 1, ".");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ref_r23.url);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !ref_r23.url);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ref_r23.text && !ref_r23.url);
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 48)(1, "details", 49)(2, "summary", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](5, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](6, ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_div_6_Template, 6, 4, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const message_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2).$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate2"](" \uD83D\uDCDA ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](4, 3, "References"), " (", message_r14.references.length, ") ");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", message_r14.references);
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r34 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 36)(1, "div", 37)(2, "span", 38);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](3, "C");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](4, "div", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](5, ChatbotComponent_ng_container_14_ng_container_1_div_1_div_5_Template, 1, 1, "div", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](6, ChatbotComponent_ng_container_14_ng_container_1_div_1_markdown_6_Template, 1, 1, "markdown", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](7, "div", 42)(8, "button", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function ChatbotComponent_ng_container_14_ng_container_1_div_1_Template_button_click_8_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r34);
      const message_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
      const ctx_r32 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r32.utilityService.copyToClipboard(message_r14.answer, (message_r14 == null ? null : message_r14.version) || 0));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](9, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](10, "img", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](11, ChatbotComponent_ng_container_14_ng_container_1_div_1_div_11_Template, 7, 5, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const message_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", (message_r14 == null ? null : message_r14.version) === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !message_r14.version || (message_r14 == null ? null : message_r14.version) === 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpropertyInterpolate"]("title", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](9, 4, "Copy to clipboard"));
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", message_r14.references && message_r14.references.length > 0);
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 61)(1, "div", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](2, "markdown", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](3, "app-profile-image", 64);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const message_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]().$implicit;
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("data", message_r14.question);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("profileImage", ctx_r16.sidebarService.profileImg())("size", "c-md");
  }
}
function ChatbotComponent_ng_container_14_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, ChatbotComponent_ng_container_14_ng_container_1_div_1_Template, 12, 6, "div", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, ChatbotComponent_ng_container_14_ng_container_1_div_2_Template, 4, 3, "div", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const message_r14 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", message_r14.answer);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", message_r14.question);
  }
}
function ChatbotComponent_ng_container_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, ChatbotComponent_ng_container_14_ng_container_1_Template, 3, 2, "ng-container", 33);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngForOf", ctx_r6.messages);
  }
}
function ChatbotComponent_ng_container_19_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](1, "span", 65)(2, "span", 65)(3, "span", 65);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementContainerEnd"]();
  }
}
function ChatbotComponent_span_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "span", 66);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate"](ctx_r8.loadingStatus);
  }
}
function ChatbotComponent_app_modal_38_app_instructions_popup_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "app-instructions-popup", 68);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("showInstructions", function ChatbotComponent_app_modal_38_app_instructions_popup_1_Template_app_instructions_popup_showInstructions_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r39);
      const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx_r38.showInstructions = $event);
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("instructions", ctx_r37.instructions)("isChatbot", true);
  }
}
function ChatbotComponent_app_modal_38_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "app-modal");
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](1, ChatbotComponent_app_modal_38_app_instructions_popup_1_Template, 1, 2, "app-instructions-popup", 67);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx_r10.showInstructions);
  }
}
const _c2 = function (a0) {
  return {
    show: a0
  };
};
class ChatbotComponent {
  /**
   * Class constructor
   * @param chatbotService
   * @param sanitizer
   * @param utilityService
   */
  constructor(chatbotService, sanitizer, utilityService, sidebarService, activatedRoute, router, modalService) {
    this.chatbotService = chatbotService;
    this.sanitizer = sanitizer;
    this.utilityService = utilityService;
    this.sidebarService = sidebarService;
    this.activatedRoute = activatedRoute;
    this.router = router;
    this.modalService = modalService;
    this.messages = [];
    this.loadingStatus = '';
    this.isLoading = false;
    this.showInstructions = false;
    this.instructions = [{
      type: 'Science',
      description: '1. Incorporate a real-world scenario involving the use of reflective surfaces in everyday life, such as car mirrors or solar panels.<br><br>2. Add an experiment involving the use of mirrors to study the reflection of light, including practical applications of redirecting light using mirrors.<br><br>3. Include questions about the different types of asexual reproduction in plants, such as budding and fragmentation.<br><br>4. Suggest an activity where students compare the motion of different objects, such as a rolling ball and a sliding book, and analyze the factors affecting their speeds.<br><br>5. Introduce an experiment demonstrating the reaction of metals with acids, highlighting the production of hydrogen gas.'
    }, {
      type: 'Social Science',
      description: '1. Add a discussion on the role of media in elections and how it influences public opinion.<br><br>Examine the principles of administration, foreign policy, and financial management in the Arthashastra and their application in the Mauryan and Kushan empires, including the roles of spies, the military system, and tax collection.<br><br>2. Discuss the historical transition from monarchies to democracies and its impact on decision-making in societies, using examples from the chapter.<br><br>3. Suggest students create a project on the role of government policies in shaping land use and agricultural development in India.<br><br>4. Compare the social structures and economic activities of urban, rural, and tribal communities, highlighting the impact of industrialization and urbanization.'
    }, {
      type: 'Mathematics',
      description: "1. Suggest hands-on activities using materials like cardboard, string, or sticks to explore the properties of isosceles and equilateral triangles.<br><br>2. Add an experiment where students create and test the stability of different triangular structures using materials like straws or sticks.<br><br>Design interactive activities for both small and large groups that involve solving percentage problems through collaborative and competitive tasks.<br><br>3. Propose a real-world application where students calculate the area of an irregularly shaped plot of land using Heron's Formula, emphasizing the importance of accurate measurements.<br><br>4. Include MCQs that test understanding of the derivation of Heron's formula.<br><br>5. Include an explanation of the Pythagorean Theorem and its application in right triangles."
    }, {
      type: 'English',
      description: '1. Analyze the character traits of a merciful person based on the poem. How do these traits compare to those of a just person?<br><br>2. Write a paragraph about your favorite hobby using at least five adjectives. Highlight the adjectives.<br><br>3. Create ten sentences using different tenses (past, present, and future).<br><br>4. Write a four-line poem about your best friend.<br><br>5. Write a poem about your favorite season. Use vivid imagery to describe the sights, sounds, and feelings it evokes.<br><br>6. Suggest an activity to discuss personal experiences with insects that connect with the poem "The Fly."'
    }];
    this.typeSubscription = this.activatedRoute.data.subscribe(data => {
      this.type = data.type;
    });
    if (this.type === 'index') {
      this.paramSubscription = this.activatedRoute.queryParams.subscribe(params => {
        this.recordId = params['recordId'];
        this.chapterId = params['chapterId'];
      });
    }
  }
  /**
   * ngOnInit lifecycle hook of angular used here to initialize chat messages
   */
  ngOnInit() {
    if (this.type === 'general') {
      this.getGeneralMessages();
    } else if (this.type === 'index') {
      this.getIndexMessages();
    } else {
      return;
    }
  }
  /**
   * Function to have dynamic textarea height
   * @param textArea
   */
  adjustHeight(textArea) {
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight}px`;
  }
  scrollToTextarea() {
    this.textArea.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'end'
    });
  }
  scrollToTop() {
    this.header.nativeElement.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
  /**
   * Function to format chat response
   * @param text
   * @returns
   */
  transformText(text) {
    let transformedText = text.replace(/\\n/g, '<br>').replace(/\\"/g, '"').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/###/g, '');
    return this.sanitizer.bypassSecurityTrustHtml(transformedText);
  }
  /**
   * Function to get messages
   */
  getGeneralMessages() {
    this.chatbotService.getGeneralMessages().subscribe({
      next: res => {
        this.messages = res.data.messages;
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      }
    });
  }
  /**
  * Function to get messages
  */
  getIndexMessages() {
    this.chatbotService.getIndexMessages(this.recordId, this.chapterId).subscribe({
      next: res => {
        this.messages = res.data.messages;
        this.chapterDetails = res?.data?.chapterDetails;
        this.chapterDetails.subject = this.utilityService.getSubjectDisplayName(res?.data?.subject);
        this.isLoading = false;
      },
      error: err => {
        this.isLoading = false;
        this.utilityService.handleError(err);
      }
    });
  }
  /**
   * Function to send message
   * @returns
   */
  sendMessage() {
    if (this.isLoading) {
      return;
    }
    if (this.chatValue.trim()) {
      const messageObj = {
        message: this.chatValue
      };
      const questionObj = {
        question: this.chatValue,
        answer: '',
        createdAt: '',
        _id: ''
      };
      this.messages.unshift(questionObj);
      this.chatValue = null;
      this.textArea.nativeElement.style.height = '36px';
      this.isLoading = true;
      if (this.type === 'general') {
        this.sendGeneralMessage(messageObj);
      } else {
        this.sendIndexMessage(messageObj);
      }
    }
  }
  sendGeneralMessage(messageObj) {
    // initialize empty message holder
    const responseMessage = {
      question: '',
      answer: '',
      createdAt: new Date().toISOString(),
      _id: 'temp-id',
      references: []
    };
    this.messages.unshift(responseMessage);
    // We already unshifted the question in sendMessage, but wait.
    // sendMessage unshifts:
    /*
      const questionObj: ChatMessages = {
        question: this.chatValue,
        answer: '',
        createdAt: '',
        _id: '',
      };
      this.messages.unshift(questionObj);
    */
    // So the top message is the user question.
    // We need to append the answer to THIS message or add a new one?
    // The UI likely shows question and answer in same block or separate?
    // Looking at `messages` structure: `{ answer?: string; question?: string; ... }`
    // It seems each item in `messages` array is a Q&A pair.
    // So `messages[0]` is the current Q&A being built.
    this.chatbotService.sendGeneralMessage(messageObj).subscribe({
      next: data => {
        const currentMessage = this.messages[0];
        if (data.type === 'status') {
          // Show status. For now, maybe prepend to answer or distinct UI?
          // The user execution requested "loading states".
          // I will set a temporary property or simply use the answer field with a spinner/text if empty.
          // However, to be cleaner, let's use a separate property if possible, or just log it for now 
          // and update the answer text if it's "Thinking...".
          // Actually, let's append status to a "status" field if we had one.
          // Since we don't, I will use `isLoading` coupled with a status tracking variable if needed.
          // But `isLoading` is boolean.
          // Let's just assume `answer` is the content.
          // If we receive "status", we could show it as a placeholder?
          // Let's strictly handle 'content' for answer.
          // For 'status', I'll update a local variable `loadingStatus` and display it in template if I could edit HTML.
          // Since I am editing TS, I will create a variable `loadingStatus`.
          this.loadingStatus = data.message;
        } else if (data.type === 'content') {
          this.loadingStatus = ''; // Clear status when content starts
          currentMessage.answer = (currentMessage.answer || '') + data.delta;
        } else if (data.type === 'references') {
          currentMessage.references = data.data;
        } else if (data.type === 'error') {
          this.utilityService.showError(data.message);
        }
      },
      error: err => {
        this.isLoading = false;
        this.loadingStatus = '';
        this.utilityService.handleError(err);
      },
      complete: () => {
        this.isLoading = false;
        this.loadingStatus = '';
        if (this.messages[0]?.answer) {
          const extractedRefs = this.extractReferences(this.messages[0].answer);
          if (extractedRefs.length > 0) {
            // Merge with existing references if any, avoiding duplicates
            const existingRefs = this.messages[0].references || [];
            const existingUrls = new Set(existingRefs.map(r => r.url));
            extractedRefs.forEach(ref => {
              if (!existingUrls.has(ref.url)) {
                existingRefs.push(ref);
                existingUrls.add(ref.url);
              }
            });
            this.messages[0].references = existingRefs;
          }
        }
      }
    });
  }
  extractReferences(text) {
    const references = [];
    const seenUrls = new Set();
    // Pass 1: Extract Markdown links [Title](URL)
    const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/g;
    let match;
    while ((match = markdownLinkRegex.exec(text)) !== null) {
      const title = match[1];
      let url = match[2];
      // Clean potential trailing punctuation if regex grabbed it
      if (url.endsWith(')')) url = url.slice(0, -1);
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        references.push({
          title,
          url
        });
      }
    }
    // Pass 2: Extract bare URLs
    const urlRegex = /(https?:\/\/[^\s\)]+)/g;
    let urlMatch;
    while ((urlMatch = urlRegex.exec(text)) !== null) {
      let url = urlMatch[1];
      // Clean common trailing punctuation from bare URLs
      url = url.replace(/[.,;)]$/, '');
      if (url && !seenUrls.has(url)) {
        seenUrls.add(url);
        references.push({
          title: url,
          url
        });
      }
    }
    return references;
  }
  sendIndexMessage(messageObj) {
    this.chatbotService.sendIndexMessage(messageObj, this.recordId, this.chapterId).subscribe({
      next: res => {
        if (res.data) {
          this.getIndexMessages();
        }
      },
      error: err => {
        if (err.status === 404) {
          this.messages.shift();
          this.utilityService.showError(err?.error?.message);
        } else {
          this.utilityService.handleError(err);
        }
        this.isLoading = false;
      }
    });
  }
  backNavigation() {
    this.router.navigate(['/content-generation']);
  }
  ngOnDestroy() {
    this.typeSubscription.unsubscribe();
    if (this.paramSubscription) {
      this.paramSubscription.unsubscribe();
    }
  }
  static {
    this.ɵfac = function ChatbotComponent_Factory(t) {
      return new (t || ChatbotComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_chatbot_service__WEBPACK_IMPORTED_MODULE_4__.ChatbotService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_9__.DomSanitizer), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_5__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_layout_sidebar_sidebar_service__WEBPACK_IMPORTED_MODULE_6__.SidebarService), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.ActivatedRoute), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_10__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdirectiveInject"](src_app_shared_components_modal_modal_service__WEBPACK_IMPORTED_MODULE_7__.ModalService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineComponent"]({
      type: ChatbotComponent,
      selectors: [["app-chatbot"]],
      viewQuery: function ChatbotComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c0, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵviewQuery"](_c1, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.textArea = _t.first);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵloadQuery"]()) && (ctx.header = _t.first);
        }
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵStandaloneFeature"]],
      decls: 39,
      vars: 38,
      consts: [[1, "p-4", "border-b-2", "border-shade-80"], [1, "flex", "gap-2"], ["src", "assets/icons/back-arrow.svg", "alt", "", "class", "cursor-pointer", 3, "click", 4, "ngIf"], [1, "text-xl", "md:text-[30px]", "leading-[48px]", "font-bold", "text-content"], ["header", ""], ["class", "hidden md:block text-content-60 text-sm ml-8 text-nowrap overflow-hidden overflow-ellipsis", 3, "title", 4, "ngIf"], ["class", "md:hidden text-content-60 text-sm ml-8 text-nowrap overflow-hidden overflow-ellipsis", 4, "ngIf"], ["class", "flex items-center gap-1 py-1 mt-2", 4, "ngIf"], [1, "chat-wrapper", "px-4"], ["aria-live", "polite", 1, "chat-container", "px-2", "md:px-36", "mb-4", "md:mb-2", "flex", "flex-col-reverse"], ["class", "flex flex-col items-center relative top-[-40%]", 4, "ngIf"], [4, "ngIf"], [1, "loading-indicator", "flex", "items-center", "gap-1", "ml-2", "relative", "top-[-25px]", "md:top-0", "px-0", "md:px-36", 3, "ngClass"], [1, "bg-secondary", "rounded-full", "w-5", "h-5", "flex", "items-center", "justify-center"], [1, "text-[11px]", "text-white", "font-bold"], ["class", "text-xs text-content-60 ml-2 animate-pulse", 4, "ngIf"], [1, "relative", "flex", "flex-col-reverse"], [1, "absolute", "w-full", "px-0", "md:px-36", 3, "ngClass"], [1, "flex", "items-end", "gap-2", "bg-white", "border", "p-2", "rounded-lg", 3, "ngClass"], ["type", "text", 1, "chat-input", 3, "placeholder", "ngModel", "disabled", "ngModelChange", "keydown.enter", "focus", "blur", "input"], ["textArea", ""], ["type", "submit", 1, "btn-primary", "p-1", "rounded-full", 3, "disabled", "click"], ["src", "assets/icons/send.svg", "alt", ""], [1, "flex", "items-center", "justify-center", "gap-1", "py-1", "mt-1"], [1, "text-content-60"], [1, "underline", "cursor-pointer", "text-primary", 3, "click"], ["src", "assets/icons/back-arrow.svg", "alt", "", 1, "cursor-pointer", 3, "click"], [1, "hidden", "md:block", "text-content-60", "text-sm", "ml-8", "text-nowrap", "overflow-hidden", "overflow-ellipsis", 3, "title"], [1, "md:hidden", "text-content-60", "text-sm", "ml-8", "text-nowrap", "overflow-hidden", "overflow-ellipsis"], [1, "flex", "items-center", "gap-1", "py-1", "mt-2"], [1, "flex", "flex-col", "items-center", "relative", "top-[-40%]"], ["src", "assets/icons/chat-bot-empty.svg", "alt", "", 1, "w-28", "h-28", "relative"], [1, "mt-4", "text-content-60", "text-center"], [4, "ngFor", "ngForOf"], ["class", "chatbot-chat flex gap-2 md:gap-4 justify-start items-end mb-5", 4, "ngIf"], ["class", "user-chat flex gap-2 md:gap-4 justify-end items-end mb-9 mt-4", 4, "ngIf"], [1, "chatbot-chat", "flex", "gap-2", "md:gap-4", "justify-start", "items-end", "mb-5"], [1, "w-7", "md:w-10", "h-7", "md:h-10", "bg-secondary", "rounded-full", "flex", "items-center", "justify-center"], [1, "text-sm", "md:text-xl", "font-bold", "text-white"], [1, "flex", "gap-2", "p-4", "bg-primary-40", "rounded-lg", "text-content", "text-sm", "max-w-[80%]", "break-words", "items-start"], [3, "innerHTML", 4, "ngIf"], ["class", "chat-markdown", 3, "data", 4, "ngIf"], [1, "min-w-5", "max-w-5"], [3, "title", "click"], ["src", "assets/icons/copy-clipboard.svg", "alt", ""], ["class", "references-section ml-11 md:ml-14 mt-1 max-w-[80%]", 4, "ngIf"], [3, "innerHTML"], [1, "chat-markdown", 3, "data"], [1, "references-section", "ml-11", "md:ml-14", "mt-1", "max-w-[80%]"], [1, "references-details"], [1, "references-summary", "cursor-pointer", "text-xs", "text-content-60", "hover:text-primary"], [1, "references-list", "mt-1", "p-2", "bg-shade-80", "rounded-md"], ["class", "reference-item text-xs mb-1 last:mb-0", 4, "ngFor", "ngForOf"], [1, "reference-item", "text-xs", "mb-1", "last:mb-0"], [1, "text-content-60", "mr-1"], ["target", "_blank", "rel", "noopener noreferrer", "class", "text-primary hover:underline", 3, "href", 4, "ngIf"], ["class", "font-medium text-content", 4, "ngIf"], ["class", "text-content-60 text-[11px] mt-0.5 leading-tight", 4, "ngIf"], ["target", "_blank", "rel", "noopener noreferrer", 1, "text-primary", "hover:underline", 3, "href"], [1, "font-medium", "text-content"], [1, "text-content-60", "text-[11px]", "mt-0.5", "leading-tight"], [1, "user-chat", "flex", "gap-2", "md:gap-4", "justify-end", "items-end", "mb-9", "mt-4"], [1, "p-4", "bg-primary-40", "rounded-lg", "text-content", "text-sm", "border", "border-primary", "max-w-[80%]", "break-words"], [3, "data"], [3, "profileImage", "size"], [1, "dot"], [1, "text-xs", "text-content-60", "ml-2", "animate-pulse"], [3, "instructions", "isChatbot", "showInstructions", 4, "ngIf"], [3, "instructions", "isChatbot", "showInstructions"]],
      template: function ChatbotComponent_Template(rf, ctx) {
        if (rf & 1) {
          const _r40 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵgetCurrentView"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](2, ChatbotComponent_img_2_Template, 1, 0, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](3, "h1", 3, 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](6, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](7, ChatbotComponent_p_7_Template, 12, 42, "p", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](8, ChatbotComponent_p_8_Template, 2, 4, "p", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](9, ChatbotComponent_div_9_Template, 1, 0, "div", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](10, "section", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](11, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](12, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](13, ChatbotComponent_div_13_Template, 5, 3, "div", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](14, ChatbotComponent_ng_container_14_Template, 2, 1, "ng-container", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](15, "div", 12)(16, "div", 13)(17, "span", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](18, "C");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](19, ChatbotComponent_ng_container_19_Template, 4, 0, "ng-container", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](20, ChatbotComponent_span_20_Template, 2, 1, "span", 15);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](21, "div", 16)(22, "div", 17)(23, "div", 18)(24, "textarea", 19, 20);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("ngModelChange", function ChatbotComponent_Template_textarea_ngModelChange_24_listener($event) {
            return ctx.chatValue = $event;
          })("keydown.enter", function ChatbotComponent_Template_textarea_keydown_enter_24_listener($event) {
            ctx.sendMessage();
            return $event.preventDefault();
          })("focus", function ChatbotComponent_Template_textarea_focus_24_listener() {
            return ctx.scrollToTextarea();
          })("blur", function ChatbotComponent_Template_textarea_blur_24_listener() {
            return ctx.scrollToTop();
          })("input", function ChatbotComponent_Template_textarea_input_24_listener() {
            _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵrestoreView"](_r40);
            const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵreference"](25);
            return _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵresetView"](ctx.adjustHeight(_r9));
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](26, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](27, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](28, "button", 21);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function ChatbotComponent_Template_button_click_28_listener() {
            return ctx.sendMessage();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](29, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelement"](30, "img", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](31, "div", 23)(32, "small", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](33);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](34, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementStart"](35, "span", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵlistener"]("click", function ChatbotComponent_Template_span_click_35_listener() {
            ctx.modalService.showChatbotSampleDialog = true;
            return ctx.showInstructions = true;
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtext"](36);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipe"](37, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtemplate"](38, ChatbotComponent_app_modal_38_Template, 2, 1, "app-modal", 11);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.type === "index");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](6, 22, ctx.type === "index" ? "Lesson Chatbot" : "Edu Chatbot"), "\n");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.type === "index");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.type === "index");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.type === "general");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](11, 24, "Chat conversation"));
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.messages.length === 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.messages.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpureFunction1"](36, _c2, ctx.isLoading));
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", !ctx.loadingStatus);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.loadingStatus);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngClass", ctx.type === "general" ? "bottom-[-65px] md:bottom-[-95px]" : "bottom-[-65px] md:bottom-[-95px]");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngClass", !ctx.isLoading ? "border-primary" : "");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpropertyInterpolate"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](27, 28, "Send a message"));
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngModel", ctx.chatValue)("disabled", ctx.isLoading);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](26, 26, "Message input"));
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("disabled", ctx.isLoading || !ctx.chatValue);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵattribute"]("aria-label", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](29, 30, "Send message"));
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](34, 32, "Daily chat limit: 20 messages per day"), ". ");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵpipeBind1"](37, 34, "Sample Instructions"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵproperty"]("ngIf", ctx.modalService.showChatbotSampleDialog);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_11__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_11__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_12__.NgModel, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_13__.TranslatePipe, src_app_shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_0__.ProfileImageComponent, src_app_shared_components_instructions_popup_instructions_popup_component__WEBPACK_IMPORTED_MODULE_1__.InstructionsPopupComponent, src_app_shared_components_modal_modal_component__WEBPACK_IMPORTED_MODULE_2__.ModalComponent, _chat_markdown_module__WEBPACK_IMPORTED_MODULE_3__.ChatMarkdownModule, ngx_markdown__WEBPACK_IMPORTED_MODULE_14__.MarkdownComponent],
      styles: ["@charset \"UTF-8\";\n.chat-wrapper[_ngcontent-%COMP%] {\n  height: calc(100vh - 240px);\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%] {\n  height: calc(100vh - 316px);\n  overflow-y: auto;\n}\n@media (max-width: 768px) {\n  .chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%] {\n    height: calc(100vh - 260px);\n  }\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: var(--primary-40);\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: var(--primary-80);\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: var(--primary-DEFAULT);\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .chat-markdown[_ngcontent-%COMP%]     ul {\n  list-style-type: disc;\n  padding-left: 1rem;\n  margin-bottom: 0.5em;\n  line-height: 1.5;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .chat-markdown[_ngcontent-%COMP%]     ol {\n  list-style-type: decimal;\n  padding-left: 1rem;\n  margin-bottom: 0.5em;\n  line-height: 1.5;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .chat-markdown[_ngcontent-%COMP%]     p {\n  margin-bottom: 0.5em;\n  line-height: 1.5;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .chat-markdown[_ngcontent-%COMP%]     h3 {\n  margin-bottom: 1em;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .references-section[_ngcontent-%COMP%]   .references-details[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%] {\n  list-style: none;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .references-section[_ngcontent-%COMP%]   .references-details[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]::-webkit-details-marker {\n  display: none;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .references-section[_ngcontent-%COMP%]   .references-details[_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]::before {\n  content: \"\u25B6 \";\n  font-size: 8px;\n  vertical-align: middle;\n  transition: transform 0.2s;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .references-section[_ngcontent-%COMP%]   .references-details[open][_ngcontent-%COMP%]   summary[_ngcontent-%COMP%]::before {\n  content: \"\u25BC \";\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .references-section[_ngcontent-%COMP%]   .references-list[_ngcontent-%COMP%] {\n  border-left: 2px solid var(--primary-DEFAULT);\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .references-section[_ngcontent-%COMP%]   .reference-item[_ngcontent-%COMP%] {\n  line-height: 1.4;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-container[_ngcontent-%COMP%]   .references-section[_ngcontent-%COMP%]   .reference-item[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  word-break: break-word;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-input[_ngcontent-%COMP%] {\n  height: 36px;\n  max-height: 150px;\n  overflow-y: auto;\n  box-sizing: border-box;\n  font-size: 16px;\n  resize: none;\n  width: 100%;\n  padding: 5px;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-input[_ngcontent-%COMP%]:focus {\n  border: none;\n  outline: none;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-input[_ngcontent-%COMP%]:disabled {\n  background: none;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-input[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-input[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: var(--primary-40);\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-input[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: var(--primary-80);\n}\n.chat-wrapper[_ngcontent-%COMP%]   .chat-input[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: var(--primary-DEFAULT);\n}\n.chat-wrapper[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%] {\n  visibility: hidden;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  background-color: var(--content-DEFAULT);\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_dotFlashing 1.5s infinite ease-in-out;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.3s;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%]   .dot[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.6s;\n}\n.chat-wrapper[_ngcontent-%COMP%]   .loading-indicator.show[_ngcontent-%COMP%] {\n  visibility: visible;\n}\n@keyframes _ngcontent-%COMP%_dotFlashing {\n  0% {\n    opacity: 0;\n  }\n  50% {\n    opacity: 1;\n  }\n  100% {\n    opacity: 0;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNoYXRib3QuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsZ0JBQWdCO0FBQWhCO0VBQ0UsMkJBQUE7QUFFRjtBQUdFO0VBQ0UsMkJBQUE7RUFJQSxnQkFBQTtBQUpKO0FBQ0k7RUFGRjtJQUdFLDJCQUFBO0VBRUY7QUFDRjtBQUNJO0VBQ0UsVUFBQTtBQUNOO0FBRUk7RUFDRSw2QkFBQTtBQUFOO0FBR0k7RUFDRSw2QkFBQTtBQUROO0FBSUk7RUFDRSxrQ0FBQTtBQUZOO0FBTU07RUFDRSxxQkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0JBQUE7RUFDQSxnQkFBQTtBQUpSO0FBT007RUFDRSx3QkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0JBQUE7RUFDQSxnQkFBQTtBQUxSO0FBUU07RUFDRSxvQkFBQTtFQUNBLGdCQUFBO0FBTlI7QUFTTTtFQUNFLGtCQUFBO0FBUFI7QUFhUTtFQUNFLGdCQUFBO0FBWFY7QUFZVTtFQUNFLGFBQUE7QUFWWjtBQVlVO0VBQ0UsYUFBQTtFQUNBLGNBQUE7RUFDQSxzQkFBQTtFQUNBLDBCQUFBO0FBVlo7QUFjUTtFQUNFLGFBQUE7QUFaVjtBQWdCTTtFQUNFLDZDQUFBO0FBZFI7QUFpQk07RUFDRSxnQkFBQTtBQWZSO0FBaUJRO0VBQ0Usc0JBQUE7QUFmVjtBQW9CRTtFQUNFLFlBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0Esc0JBQUE7RUFDQSxlQUFBO0VBQ0EsWUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0FBbEJKO0FBb0JJO0VBQ0UsWUFBQTtFQUNBLGFBQUE7QUFsQk47QUFvQkk7RUFDRSxnQkFBQTtBQWxCTjtBQXFCSTtFQUNFLFVBQUE7QUFuQk47QUFzQkk7RUFDRSw2QkFBQTtBQXBCTjtBQXVCSTtFQUNFLDZCQUFBO0FBckJOO0FBd0JJO0VBQ0Usa0NBQUE7QUF0Qk47QUEwQkU7RUFDRSxrQkFBQTtBQXhCSjtBQXlCSTtFQUNFLFVBQUE7RUFDQSxXQUFBO0VBQ0Esd0NBQUE7RUFDQSxrQkFBQTtFQUNBLGdEQUFBO0FBdkJOO0FBeUJNO0VBQ0UscUJBQUE7QUF2QlI7QUEwQk07RUFDRSxxQkFBQTtBQXhCUjtBQTZCRTtFQUNFLG1CQUFBO0FBM0JKO0FBOEJFO0VBQ0U7SUFDRSxVQUFBO0VBNUJKO0VBOEJFO0lBQ0UsVUFBQTtFQTVCSjtFQThCRTtJQUNFLFVBQUE7RUE1Qko7QUFDRiIsImZpbGUiOiJjaGF0Ym90LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmNoYXQtd3JhcHBlciB7XG4gIGhlaWdodDogY2FsYygxMDB2aCAtIDI0MHB4KTtcbiAgLy8gQG1lZGlhIChtYXgtd2lkdGggOiA3NjhweCkge1xuICAvLyAgIGhlaWdodDogY2FsYygxMDB2aCAtIDU0cHgpO1xuICAvLyB9XG5cbiAgLmNoYXQtY29udGFpbmVyIHtcbiAgICBoZWlnaHQ6IGNhbGMoMTAwdmggLSAzMTZweCk7XG4gICAgQG1lZGlhIChtYXgtd2lkdGggOiA3NjhweCkge1xuICAgIGhlaWdodDogY2FsYygxMDB2aCAtIDI2MHB4KTtcbiAgICB9XG4gICAgb3ZlcmZsb3cteTogYXV0bztcblxuICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICAgIHdpZHRoOiA0cHg7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS00MCk7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS04MCk7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgICB9XG5cbiAgICAuY2hhdC1tYXJrZG93biB7XG4gICAgICA6Om5nLWRlZXAgdWwge1xuICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IGRpc2M7XG4gICAgICAgIHBhZGRpbmctbGVmdDogdGhlbWUoXCJwYWRkaW5nLjRcIik7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDAuNWVtO1xuICAgICAgICBsaW5lLWhlaWdodDogMS41O1xuICAgICAgfVxuXG4gICAgICA6Om5nLWRlZXAgb2wge1xuICAgICAgICBsaXN0LXN0eWxlLXR5cGU6IGRlY2ltYWw7XG4gICAgICAgIHBhZGRpbmctbGVmdDogdGhlbWUoXCJwYWRkaW5nLjRcIik7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDAuNWVtO1xuICAgICAgICBsaW5lLWhlaWdodDogMS41O1xuICAgICAgfVxuXG4gICAgICA6Om5nLWRlZXAgcCB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDAuNWVtO1xuICAgICAgICBsaW5lLWhlaWdodDogMS41O1xuICAgICAgfVxuXG4gICAgICA6Om5nLWRlZXAgaDMge1xuICAgICAgICBtYXJnaW4tYm90dG9tOiAxZW07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLnJlZmVyZW5jZXMtc2VjdGlvbiB7XG4gICAgICAucmVmZXJlbmNlcy1kZXRhaWxzIHtcbiAgICAgICAgc3VtbWFyeSB7XG4gICAgICAgICAgbGlzdC1zdHlsZTogbm9uZTtcbiAgICAgICAgICAmOjotd2Via2l0LWRldGFpbHMtbWFya2VyIHtcbiAgICAgICAgICAgIGRpc3BsYXk6IG5vbmU7XG4gICAgICAgICAgfVxuICAgICAgICAgICY6OmJlZm9yZSB7XG4gICAgICAgICAgICBjb250ZW50OiAn4pa2ICc7XG4gICAgICAgICAgICBmb250LXNpemU6IDhweDtcbiAgICAgICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XG4gICAgICAgICAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC4ycztcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAmW29wZW5dIHN1bW1hcnk6OmJlZm9yZSB7XG4gICAgICAgICAgY29udGVudDogJ+KWvCAnO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC5yZWZlcmVuY2VzLWxpc3Qge1xuICAgICAgICBib3JkZXItbGVmdDogMnB4IHNvbGlkIHZhcigtLXByaW1hcnktREVGQVVMVCk7XG4gICAgICB9XG5cbiAgICAgIC5yZWZlcmVuY2UtaXRlbSB7XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG5cbiAgICAgICAgYSB7XG4gICAgICAgICAgd29yZC1icmVhazogYnJlYWstd29yZDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxuICAuY2hhdC1pbnB1dCB7XG4gICAgaGVpZ2h0OiAzNnB4O1xuICAgIG1heC1oZWlnaHQ6IDE1MHB4O1xuICAgIG92ZXJmbG93LXk6IGF1dG87XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgICBmb250LXNpemU6IDE2cHg7XG4gICAgcmVzaXplOiBub25lO1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIHBhZGRpbmc6IDVweDtcblxuICAgICY6Zm9jdXMge1xuICAgICAgYm9yZGVyOiBub25lO1xuICAgICAgb3V0bGluZTogbm9uZTtcbiAgICB9XG4gICAgJjpkaXNhYmxlZCB7XG4gICAgICBiYWNrZ3JvdW5kOiBub25lO1xuICAgIH1cblxuICAgICY6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICAgIHdpZHRoOiA0cHg7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdHJhY2sge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS00MCk7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS04MCk7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xuICAgICAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgICB9XG4gIH1cblxuICAubG9hZGluZy1pbmRpY2F0b3Ige1xuICAgIHZpc2liaWxpdHk6IGhpZGRlbjtcbiAgICAuZG90IHtcbiAgICAgIHdpZHRoOiA4cHg7XG4gICAgICBoZWlnaHQ6IDhweDtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLWNvbnRlbnQtREVGQVVMVCk7XG4gICAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgICBhbmltYXRpb246IGRvdEZsYXNoaW5nIDEuNXMgaW5maW5pdGUgZWFzZS1pbi1vdXQ7XG5cbiAgICAgICY6bnRoLWNoaWxkKDIpIHtcbiAgICAgICAgYW5pbWF0aW9uLWRlbGF5OiAwLjNzO1xuICAgICAgfVxuXG4gICAgICAmOm50aC1jaGlsZCgzKSB7XG4gICAgICAgIGFuaW1hdGlvbi1kZWxheTogMC42cztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAubG9hZGluZy1pbmRpY2F0b3Iuc2hvdyB7XG4gICAgdmlzaWJpbGl0eTogdmlzaWJsZTtcbiAgfVxuXG4gIEBrZXlmcmFtZXMgZG90Rmxhc2hpbmcge1xuICAgIDAlIHtcbiAgICAgIG9wYWNpdHk6IDA7XG4gICAgfVxuICAgIDUwJSB7XG4gICAgICBvcGFjaXR5OiAxO1xuICAgIH1cbiAgICAxMDAlIHtcbiAgICAgIG9wYWNpdHk6IDA7XG4gICAgfVxuICB9XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL2NoYXRib3QvY2hhdGJvdC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQkFBZ0I7QUFBaEI7RUFDRSwyQkFBQTtBQUVGO0FBR0U7RUFDRSwyQkFBQTtFQUlBLGdCQUFBO0FBSko7QUFDSTtFQUZGO0lBR0UsMkJBQUE7RUFFRjtBQUNGO0FBQ0k7RUFDRSxVQUFBO0FBQ047QUFFSTtFQUNFLDZCQUFBO0FBQU47QUFHSTtFQUNFLDZCQUFBO0FBRE47QUFJSTtFQUNFLGtDQUFBO0FBRk47QUFNTTtFQUNFLHFCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGdCQUFBO0FBSlI7QUFPTTtFQUNFLHdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQkFBQTtFQUNBLGdCQUFBO0FBTFI7QUFRTTtFQUNFLG9CQUFBO0VBQ0EsZ0JBQUE7QUFOUjtBQVNNO0VBQ0Usa0JBQUE7QUFQUjtBQWFRO0VBQ0UsZ0JBQUE7QUFYVjtBQVlVO0VBQ0UsYUFBQTtBQVZaO0FBWVU7RUFDRSxhQUFBO0VBQ0EsY0FBQTtFQUNBLHNCQUFBO0VBQ0EsMEJBQUE7QUFWWjtBQWNRO0VBQ0UsYUFBQTtBQVpWO0FBZ0JNO0VBQ0UsNkNBQUE7QUFkUjtBQWlCTTtFQUNFLGdCQUFBO0FBZlI7QUFpQlE7RUFDRSxzQkFBQTtBQWZWO0FBb0JFO0VBQ0UsWUFBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxzQkFBQTtFQUNBLGVBQUE7RUFDQSxZQUFBO0VBQ0EsV0FBQTtFQUNBLFlBQUE7QUFsQko7QUFvQkk7RUFDRSxZQUFBO0VBQ0EsYUFBQTtBQWxCTjtBQW9CSTtFQUNFLGdCQUFBO0FBbEJOO0FBcUJJO0VBQ0UsVUFBQTtBQW5CTjtBQXNCSTtFQUNFLDZCQUFBO0FBcEJOO0FBdUJJO0VBQ0UsNkJBQUE7QUFyQk47QUF3Qkk7RUFDRSxrQ0FBQTtBQXRCTjtBQTBCRTtFQUNFLGtCQUFBO0FBeEJKO0FBeUJJO0VBQ0UsVUFBQTtFQUNBLFdBQUE7RUFDQSx3Q0FBQTtFQUNBLGtCQUFBO0VBQ0EsZ0RBQUE7QUF2Qk47QUF5Qk07RUFDRSxxQkFBQTtBQXZCUjtBQTBCTTtFQUNFLHFCQUFBO0FBeEJSO0FBNkJFO0VBQ0UsbUJBQUE7QUEzQko7QUE4QkU7RUFDRTtJQUNFLFVBQUE7RUE1Qko7RUE4QkU7SUFDRSxVQUFBO0VBNUJKO0VBOEJFO0lBQ0UsVUFBQTtFQTVCSjtBQUNGO0FBQ0EsNDdLQUE0N0siLCJzb3VyY2VzQ29udGVudCI6WyIuY2hhdC13cmFwcGVyIHtcbiAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMjQwcHgpO1xuICAvLyBAbWVkaWEgKG1heC13aWR0aCA6IDc2OHB4KSB7XG4gIC8vICAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gNTRweCk7XG4gIC8vIH1cblxuICAuY2hhdC1jb250YWluZXIge1xuICAgIGhlaWdodDogY2FsYygxMDB2aCAtIDMxNnB4KTtcbiAgICBAbWVkaWEgKG1heC13aWR0aCA6IDc2OHB4KSB7XG4gICAgaGVpZ2h0OiBjYWxjKDEwMHZoIC0gMjYwcHgpO1xuICAgIH1cbiAgICBvdmVyZmxvdy15OiBhdXRvO1xuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgICAgd2lkdGg6IDRweDtcbiAgICB9XG5cbiAgICAmOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LTQwKTtcbiAgICB9XG5cbiAgICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LTgwKTtcbiAgICB9XG5cbiAgICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xuICAgIH1cblxuICAgIC5jaGF0LW1hcmtkb3duIHtcbiAgICAgIDo6bmctZGVlcCB1bCB7XG4gICAgICAgIGxpc3Qtc3R5bGUtdHlwZTogZGlzYztcbiAgICAgICAgcGFkZGluZy1sZWZ0OiB0aGVtZShcInBhZGRpbmcuNFwiKTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMC41ZW07XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gICAgICB9XG5cbiAgICAgIDo6bmctZGVlcCBvbCB7XG4gICAgICAgIGxpc3Qtc3R5bGUtdHlwZTogZGVjaW1hbDtcbiAgICAgICAgcGFkZGluZy1sZWZ0OiB0aGVtZShcInBhZGRpbmcuNFwiKTtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMC41ZW07XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gICAgICB9XG5cbiAgICAgIDo6bmctZGVlcCBwIHtcbiAgICAgICAgbWFyZ2luLWJvdHRvbTogMC41ZW07XG4gICAgICAgIGxpbmUtaGVpZ2h0OiAxLjU7XG4gICAgICB9XG5cbiAgICAgIDo6bmctZGVlcCBoMyB7XG4gICAgICAgIG1hcmdpbi1ib3R0b206IDFlbTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICAucmVmZXJlbmNlcy1zZWN0aW9uIHtcbiAgICAgIC5yZWZlcmVuY2VzLWRldGFpbHMge1xuICAgICAgICBzdW1tYXJ5IHtcbiAgICAgICAgICBsaXN0LXN0eWxlOiBub25lO1xuICAgICAgICAgICY6Oi13ZWJraXQtZGV0YWlscy1tYXJrZXIge1xuICAgICAgICAgICAgZGlzcGxheTogbm9uZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgJjo6YmVmb3JlIHtcbiAgICAgICAgICAgIGNvbnRlbnQ6ICfDosKWwrYgJztcbiAgICAgICAgICAgIGZvbnQtc2l6ZTogOHB4O1xuICAgICAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcbiAgICAgICAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgICZbb3Blbl0gc3VtbWFyeTo6YmVmb3JlIHtcbiAgICAgICAgICBjb250ZW50OiAnw6LClsK8ICc7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLnJlZmVyZW5jZXMtbGlzdCB7XG4gICAgICAgIGJvcmRlci1sZWZ0OiAycHggc29saWQgdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgICAgIH1cblxuICAgICAgLnJlZmVyZW5jZS1pdGVtIHtcbiAgICAgICAgbGluZS1oZWlnaHQ6IDEuNDtcblxuICAgICAgICBhIHtcbiAgICAgICAgICB3b3JkLWJyZWFrOiBicmVhay13b3JkO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIC5jaGF0LWlucHV0IHtcbiAgICBoZWlnaHQ6IDM2cHg7XG4gICAgbWF4LWhlaWdodDogMTUwcHg7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICAgIGZvbnQtc2l6ZTogMTZweDtcbiAgICByZXNpemU6IG5vbmU7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcGFkZGluZzogNXB4O1xuXG4gICAgJjpmb2N1cyB7XG4gICAgICBib3JkZXI6IG5vbmU7XG4gICAgICBvdXRsaW5lOiBub25lO1xuICAgIH1cbiAgICAmOmRpc2FibGVkIHtcbiAgICAgIGJhY2tncm91bmQ6IG5vbmU7XG4gICAgfVxuXG4gICAgJjo6LXdlYmtpdC1zY3JvbGxiYXIge1xuICAgICAgd2lkdGg6IDRweDtcbiAgICB9XG5cbiAgICAmOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LTQwKTtcbiAgICB9XG5cbiAgICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LTgwKTtcbiAgICB9XG5cbiAgICAmOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xuICAgIH1cbiAgfVxuXG4gIC5sb2FkaW5nLWluZGljYXRvciB7XG4gICAgdmlzaWJpbGl0eTogaGlkZGVuO1xuICAgIC5kb3Qge1xuICAgICAgd2lkdGg6IDhweDtcbiAgICAgIGhlaWdodDogOHB4O1xuICAgICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tY29udGVudC1ERUZBVUxUKTtcbiAgICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICAgIGFuaW1hdGlvbjogZG90Rmxhc2hpbmcgMS41cyBpbmZpbml0ZSBlYXNlLWluLW91dDtcblxuICAgICAgJjpudGgtY2hpbGQoMikge1xuICAgICAgICBhbmltYXRpb24tZGVsYXk6IDAuM3M7XG4gICAgICB9XG5cbiAgICAgICY6bnRoLWNoaWxkKDMpIHtcbiAgICAgICAgYW5pbWF0aW9uLWRlbGF5OiAwLjZzO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIC5sb2FkaW5nLWluZGljYXRvci5zaG93IHtcbiAgICB2aXNpYmlsaXR5OiB2aXNpYmxlO1xuICB9XG5cbiAgQGtleWZyYW1lcyBkb3RGbGFzaGluZyB7XG4gICAgMCUge1xuICAgICAgb3BhY2l0eTogMDtcbiAgICB9XG4gICAgNTAlIHtcbiAgICAgIG9wYWNpdHk6IDE7XG4gICAgfVxuICAgIDEwMCUge1xuICAgICAgb3BhY2l0eTogMDtcbiAgICB9XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 54334:
/*!******************************************************!*\
  !*** ./src/app/view/user/chatbot/chatbot.service.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ChatbotService: () => (/* binding */ ChatbotService)
/* harmony export */ });
/* harmony import */ var _home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 43942);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ 46443);






class ChatbotService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_1__.BaseRestService {
  /**
   * Class constructor
   * @param http HttpClient
   */
  constructor(http) {
    super(http);
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.apiUrl;
    this.setUri('chat');
  }
  /**
   * Function to send message
   * @param messageObj
   * @returns
   */
  sendGeneralMessage(messageObj) {
    const url = `${this.baseUrl}/chat/message`;
    return new rxjs__WEBPACK_IMPORTED_MODULE_3__.Observable(observer => {
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token') || ''}`
        },
        body: JSON.stringify(messageObj)
      }).then( /*#__PURE__*/function () {
        var _ref = (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (response) {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          if (!reader) {
            throw new Error('Response body is null');
          }
          while (true) {
            const {
              done,
              value
            } = yield reader.read();
            if (done) break;
            const chunk = decoder.decode(value, {
              stream: true
            });
            // Process multiple JSON objects in one chunk
            const lines = chunk.split('\n').filter(line => line.trim() !== '');
            for (const line of lines) {
              try {
                const data = JSON.parse(line);
                observer.next(data);
              } catch (e) {
                console.error('Error parsing JSON chunk', e);
              }
            }
          }
          observer.complete();
        });
        return function (_x) {
          return _ref.apply(this, arguments);
        };
      }()).catch(err => {
        observer.error(err);
      });
    });
  }
  sendIndexMessage(messageObj, recordId, chapterId) {
    return this.http.post(`${this.baseUrl}/lessonchat/message/${recordId}/${chapterId}`, messageObj);
  }
  /**
   * Function to get messages
   * @returns
   */
  getGeneralMessages() {
    return this.get('messages');
  }
  getIndexMessages(recordId, chapterId) {
    return this.http.get(`${this.baseUrl}/lessonchat/messages/${recordId}/${chapterId}`);
  }
  static {
    this.ɵfac = function ChatbotService_Factory(t) {
      return new (t || ChatbotService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
      token: ChatbotService,
      factory: ChatbotService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 22360:
/*!****************************************************************************!*\
  !*** ./src/app/view/user/content-generation/content-generation.service.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContentGenerationService: () => (/* binding */ ContentGenerationService)
/* harmony export */ });
/* harmony import */ var _home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);






class ContentGenerationService extends src_app_core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_1__.BaseRestService {
  constructor(http) {
    super(http);
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.apiUrl;
    this.showDraftConfirmation = false;
    this.setUri('teacher-lesson-plan');
  }
  getAllList(paramVals) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams().set('page', '1').set('limit', '999');
    if (paramVals.selectedType) {
      params = params.set('filter[type]', paramVals.selectedType);
    }
    if (paramVals.selectedBoard) {
      params = params.set('filter[board]', paramVals.selectedBoard);
    }
    if (paramVals.selectedMedium) {
      params = params.set('filter[medium]', paramVals.selectedMedium);
    }
    if (paramVals.selectedClass) {
      params = params.set('filter[class]', paramVals.selectedClass);
    }
    if (paramVals.selectedSubject) {
      params = params.set('filter[subject]', paramVals.selectedSubject);
    }
    if (paramVals.searchTerm) {
      params = params.set('search', paramVals.searchTerm);
    }
    if (paramVals.selectedMonth) {
      params = params.set('filter[createdMonth]', paramVals.selectedMonth);
    }
    if (paramVals.isCompleted) {
      params = params.set('filter[isCompleted]', paramVals.isCompleted);
    }
    if (paramVals.isGenerated) {
      params = params.set('filter[isGenerated]', paramVals.isGenerated);
    }
    const options = {
      params: params
    };
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/list`, options);
  }
  getMedium() {
    return this.http.get(`${this.baseUrl}/auth/me`);
  }
  getFromMasterClass(medium) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    if (medium) {
      params = params.set('filter[medium]', medium);
    }
    return this.http.get(`${this.baseUrl}/master-class/list?limit=999&sortBy=standard&sortOrder=asc`, {
      params
    });
  }
  getSubjects(boardAbbr) {
    return this.http.get(`${this.baseUrl}/master-subject/get-by-board/${boardAbbr}`);
  }
  getTemplates(params) {
    const options = {
      params: params
    };
    return this.http.get(`${this.baseUrl}/lesson-plan-template/list`, options);
  }
  getLessonPlan(formValue) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    if (formValue.medium) {
      params = params.set('filter[medium]', formValue.medium);
    }
    if (formValue.board) {
      params = params.set('filter[board]', formValue.board);
    }
    if (formValue.class) {
      params = params.set('filter[class]', formValue.class);
    }
    if (formValue.subject) {
      params = params.set('filter[subject]', formValue.subject);
    }
    if (formValue.semester) {
      params = params.set('filter[semester]', formValue.semester);
    }
    if (formValue.topics) {
      params = params.set('filter[topics]', formValue.topics);
    }
    if (formValue.subtopics) {
      params = params.set('filter[subTopics]', JSON.stringify(formValue.subtopics));
    }
    if (formValue.level) {
      params = params.set('filter[level]', formValue.level);
    }
    if (formValue.model) {
      params = params.set('filter[teachingModel]', formValue.model);
    }
    if (formValue.videos) {
      params = params.set('filter[includeVideos]', formValue.videos);
    }
    const options = {
      params: params
    };
    return this.http.get(`${this.baseUrl}/master-lesson/list`, options);
  }
  modifyContent(data) {
    return this.http.post(`${this.baseUrl}/lesson-plan/save-to-teacher`, data);
  }
  saveLessonPlan(data) {
    return this.http.post(`${this.baseUrl}/lesson-plan/save-to-teacher`, data);
  }
  getResourcePlan(formvalues) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    if (formvalues.medium) {
      params = params.set('filter[medium]', formvalues.medium);
    }
    if (formvalues.board) {
      params = params.set('filter[board]', formvalues.board);
    }
    if (formvalues.class) {
      params = params.set('filter[class]', formvalues.class);
    }
    if (formvalues.subject) {
      params = params.set('filter[subject]', formvalues.subject);
    }
    if (formvalues.topics) {
      params = params.set('filter[topics]', formvalues.topics);
    }
    if (formvalues.subtopics) {
      params = params.set('filter[subTopics]', formvalues.subtopics);
    }
    const options = {
      params: params
    };
    return this.http.get(`${this.baseUrl}/resource-plan/list`, options);
  }
  saveResourcePlan(data) {
    return this.http.post(`${this.baseUrl}/lesson-plan/save-to-teacher`, data);
  }
  createFeedback(data) {
    return this.http.post(`${this.baseUrl}/lesson-feedback/create`, data);
  }
  createResourceFeedback(data) {
    return this.http.post(`${this.baseUrl}/teacher-resource-feedback/create`, data);
  }
  getBoardsList() {
    return this.http.get(`${this.baseUrl}/board/list?limit=99`);
  }
  getTopicsSubtopics(board, medium, standard, subject) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams();
    if (board) {
      params = params.set('filter[board]', board);
    }
    if (subject) {
      params = params.set('filter[subject]', subject);
    }
    if (medium) {
      params = params.set('filter[medium]', medium);
    }
    if (standard) {
      params = params.set('filter[standard]', standard);
    }
    params = params.set('limit', '999');
    params = params.set('sortBy', 'orderNumber');
    params = params.set('sortOrder', 'asc');
    return this.http.get(`${this.baseUrl}/chapter/list`, {
      params
    });
  }
  lessonPlanExists(lessonPlanId) {
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/exists/${lessonPlanId}`);
  }
  getSubtopics(body, type) {
    if (type === 'lesson') {
      return this.http.post(`${this.baseUrl}/master-lesson/learning-outcomes`, body);
    } else {
      return this.http.post(`${this.baseUrl}/resource-plan/learning-outcomes`, body);
    }
  }
  getLessonPlanDetails(planId, params) {
    return this.http.get(`${this.baseUrl}/master-lesson/${planId}`, {
      params
    });
  }
  getResourcePlanDetails(planId, params) {
    return this.http.get(`${this.baseUrl}/master-resource/${planId}`, {
      params
    });
  }
  getLessonPlanById(id) {
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/lesson/${id}`);
  }
  getLessonPlanPresentation(lessonPlanId) {
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/presentation/${lessonPlanId}`);
  }
  generateLessonPlanPresentation(lessonPlanId) {
    return this.http.post(`${this.baseUrl}/teacher-lesson-plan/presentation/${lessonPlanId}`, {});
  }
  getResourcePlanById(id) {
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/resource/${id}`);
  }
  getRegenerationLimit() {
    return this.http.get(`${this.baseUrl}/teacher-lesson-plan/regeneration-limit`);
  }
  generateNewContent(data) {
    return this.http.post(`${this.baseUrl}/teacher-lesson-plan/generate`, data);
  }
  regenerateContent(data) {
    return this.http.post(`${this.baseUrl}/teacher-lesson-plan/regenerate`, data);
  }
  retry(data) {
    return this.http.post(`${this.baseUrl}/teacher-lesson-plan/retry`, data);
  }
  downloadLPDetails(lessonId) {
    return this.http.get(`${this.baseUrl}/master-lesson/lesson/tables/${lessonId}`);
  }
  createPresentationJob(formData) {
    return this.http.post(`${this.baseUrl}/presentation/job`, formData);
  }
  getPresentationJob(id) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams().set('id', id);
    return this.http.get(`${this.baseUrl}/presentation/job`, {
      params
    });
  }
  deletePresentationJob(id) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams().set('id', id);
    return this.http.delete(`${this.baseUrl}/presentation/job`, {
      params
    });
  }
  retryPresentationJob(id) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams().set('id', id);
    return this.http.get(`${this.baseUrl}/presentation/job/retry`, {
      params
    });
  }
  getPresentationJobs(paramVals) {
    let params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams().set('offset', '0').set('limit', '100');
    if (paramVals.presentationMonth) {
      const [year, month] = paramVals.presentationMonth.split('-').map(Number);
      const createdAfter = new Date(year, month - 1, 1).toISOString();
      const createdBefore = new Date(year, month, 0, 23, 59, 59, 999).toISOString();
      params = params.set('created_after', createdAfter).set('created_before', createdBefore);
    }
    if (paramVals.presentationStatus === 'complete') {
      params = params.set('status', 'complete');
    }
    return this.http.get(`${this.baseUrl}/presentation/jobs`, {
      params
    });
  }
  getPresentationTools() {
    return this.http.get(`${this.baseUrl}/presentation/tools`);
  }
  openPresentationEventStream(jobId, onMessage, onError) {
    var _this = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const res = yield fetch(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_2__.environment.apiUrl}/presentation/events/token?jobId=${jobId}`, {
        method: "POST",
        headers: {
          "Authorization": localStorage.getItem('token') || ""
        }
      });
      const token = yield res.text();
      const eventSource = new EventSource(`${_this.baseUrl}/presentation/events/${token}`);
      eventSource.onmessage = onMessage;
      eventSource.onerror = onError;
      return eventSource;
    })();
  }
  closePresentationEventStream(eventSource) {
    if (eventSource) {
      eventSource.close();
    }
    return null;
  }
  getPresentationStatusLabel(status) {
    if (status === 'complete') return 'Complete';
    if (status === 'error') return 'Failed';
    if (status === 'idle') return 'Queued';
    return 'In Progress';
  }
  downloadPresentationFile(jobId, fileFormat) {
    const params = new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams().set('file_format', fileFormat);
    return this.http.get(`${this.baseUrl}/presentation/job/${jobId}`, {
      params,
      responseType: 'blob'
    });
  }
  headPresentationFile(jobId) {
    return this.http.head(`${this.baseUrl}/presentation/job/${jobId}`, {
      params: new _angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpParams().set('file_format', 'pptx'),
      observe: 'response'
    });
  }
  static {
    this.ɵfac = function ContentGenerationService_Factory(t) {
      return new (t || ContentGenerationService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
      token: ContentGenerationService,
      factory: ContentGenerationService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 8329:
/*!*************************************************************!*\
  !*** ./node_modules/ngx-markdown/fesm2022/ngx-markdown.mjs ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClipboardButtonComponent: () => (/* binding */ ClipboardButtonComponent),
/* harmony export */   ClipboardOptions: () => (/* binding */ ClipboardOptions),
/* harmony export */   ClipboardRenderOptions: () => (/* binding */ ClipboardRenderOptions),
/* harmony export */   ExtendedRenderer: () => (/* binding */ ExtendedRenderer),
/* harmony export */   KatexSpecificOptions: () => (/* binding */ KatexSpecificOptions),
/* harmony export */   LanguagePipe: () => (/* binding */ LanguagePipe),
/* harmony export */   MarkdownComponent: () => (/* binding */ MarkdownComponent),
/* harmony export */   MarkdownModule: () => (/* binding */ MarkdownModule),
/* harmony export */   MarkdownPipe: () => (/* binding */ MarkdownPipe),
/* harmony export */   MarkdownService: () => (/* binding */ MarkdownService),
/* harmony export */   MarkedOptions: () => (/* binding */ MarkedOptions),
/* harmony export */   MarkedRenderer: () => (/* reexport safe */ marked__WEBPACK_IMPORTED_MODULE_0__.Renderer),
/* harmony export */   MermaidAPI: () => (/* binding */ MermaidAPI),
/* harmony export */   PrismPlugin: () => (/* binding */ PrismPlugin),
/* harmony export */   SECURITY_CONTEXT: () => (/* binding */ SECURITY_CONTEXT),
/* harmony export */   errorClipboardNotLoaded: () => (/* binding */ errorClipboardNotLoaded),
/* harmony export */   errorClipboardViewContainerRequired: () => (/* binding */ errorClipboardViewContainerRequired),
/* harmony export */   errorJoyPixelsNotLoaded: () => (/* binding */ errorJoyPixelsNotLoaded),
/* harmony export */   errorKatexNotLoaded: () => (/* binding */ errorKatexNotLoaded),
/* harmony export */   errorMermaidNotLoaded: () => (/* binding */ errorMermaidNotLoaded),
/* harmony export */   errorSrcWithoutHttpClient: () => (/* binding */ errorSrcWithoutHttpClient)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 63617);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 59452);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 14876);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 36647);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs/operators */ 87378);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! rxjs/operators */ 91817);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! rxjs/operators */ 86301);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! rxjs/operators */ 63037);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! rxjs/operators */ 33900);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! rxjs/operators */ 2435);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! marked */ 60997);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser */ 80436);










const _c0 = ["*"];
const BUTTON_TEXT_COPY = 'Copy';
const BUTTON_TEXT_COPIED = 'Copied';
class ClipboardButtonComponent {
  constructor() {
    this._buttonClick$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.copied$ = this._buttonClick$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.switchMap)(() => (0,rxjs__WEBPACK_IMPORTED_MODULE_3__.merge)((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.of)(true), (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.timer)(3000).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_6__.mapTo)(false)))), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_7__.distinctUntilChanged)(), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_8__.shareReplay)(1));
    this.copiedText$ = this.copied$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_9__.startWith)(false), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(copied => copied ? BUTTON_TEXT_COPIED : BUTTON_TEXT_COPY));
  }
  onCopyToClipboardClick() {
    this._buttonClick$.next();
  }
  static {
    this.ɵfac = function ClipboardButtonComponent_Factory(t) {
      return new (t || ClipboardButtonComponent)();
    };
  }
  static {
    this.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineComponent"]({
      type: ClipboardButtonComponent,
      selectors: [["markdown-clipboard"]],
      decls: 4,
      vars: 7,
      consts: [[1, "markdown-clipboard-button", 3, "click"]],
      template: function ClipboardButtonComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementStart"](0, "button", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵlistener"]("click", function ClipboardButtonComponent_Template_button_click_0_listener() {
            return ctx.onCopyToClipboardClick();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](1, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtext"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipe"](3, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵclassProp"]("copied", _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](1, 3, ctx.copied$));
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵpipeBind1"](3, 5, ctx.copiedText$));
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.AsyncPipe],
      encapsulation: 2,
      changeDetection: 0
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵsetClassMetadata"](ClipboardButtonComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Component,
    args: [{
      selector: 'markdown-clipboard',
      template: `
    <button
      class="markdown-clipboard-button"
      [class.copied]="copied$ | async"
      (click)="onCopyToClipboardClick()"
    >{{ copiedText$ | async }}</button>
  `,
      changeDetection: _angular_core__WEBPACK_IMPORTED_MODULE_11__.ChangeDetectionStrategy.OnPush
    }]
  }], null, null);
})();
class ClipboardOptions {}
class ClipboardRenderOptions extends ClipboardOptions {}

/* eslint-disable */
class KatexSpecificOptions {}
class LanguagePipe {
  transform(value, language) {
    if (value == null) {
      value = '';
    }
    if (language == null) {
      language = '';
    }
    if (typeof value !== 'string') {
      console.error(`LanguagePipe has been invoked with an invalid value type [${typeof value}]`);
      return value;
    }
    if (typeof language !== 'string') {
      console.error(`LanguagePipe has been invoked with an invalid parameter [${typeof language}]`);
      return value;
    }
    return '```' + language + '\n' + value + '\n```';
  }
  static {
    this.ɵfac = function LanguagePipe_Factory(t) {
      return new (t || LanguagePipe)();
    };
  }
  static {
    this.ɵpipe = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefinePipe"]({
      name: "language",
      type: LanguagePipe,
      pure: true
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵsetClassMetadata"](LanguagePipe, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Pipe,
    args: [{
      name: 'language'
    }]
  }], null, null);
})();
var PrismPlugin;
(function (PrismPlugin) {
  PrismPlugin["CommandLine"] = "command-line";
  PrismPlugin["LineHighlight"] = "line-highlight";
  PrismPlugin["LineNumbers"] = "line-numbers";
})(PrismPlugin || (PrismPlugin = {}));
class MarkedOptions {}

/* eslint-disable max-len */
const errorJoyPixelsNotLoaded = '[ngx-markdown] When using the `emoji` attribute you *have to* include Emoji-Toolkit files to `angular.json` or use imports. See README for more information';
const errorKatexNotLoaded = '[ngx-markdown] When using the `katex` attribute you *have to* include KaTeX files to `angular.json` or use imports. See README for more information';
const errorMermaidNotLoaded = '[ngx-markdown] When using the `mermaid` attribute you *have to* include Mermaid files to `angular.json` or use imports. See README for more information';
const errorClipboardNotLoaded = '[ngx-markdown] When using the `clipboard` attribute you *have to* include Clipboard files to `angular.json` or use imports. See README for more information';
const errorClipboardViewContainerRequired = '[ngx-markdown] When using the `clipboard` attribute you *have to* provide the `viewContainerRef` parameter to `MarkdownService.render()` function';
const errorSrcWithoutHttpClient = '[ngx-markdown] When using the `src` attribute you *have to* pass the `HttpClient` as a parameter of the `forRoot` method. See README for more information';
/* eslint-enable max-len */
const SECURITY_CONTEXT = new _angular_core__WEBPACK_IMPORTED_MODULE_11__.InjectionToken('SECURITY_CONTEXT');
class ExtendedRenderer extends marked__WEBPACK_IMPORTED_MODULE_0__.Renderer {
  constructor() {
    super(...arguments);
    this.ɵNgxMarkdownRendererExtended = false;
  }
}
class MarkdownService {
  get options() {
    return this._options;
  }
  set options(value) {
    this._options = {
      ...this.DEFAULT_MARKED_OPTIONS,
      ...value
    };
  }
  get renderer() {
    return this.options.renderer;
  }
  set renderer(value) {
    this.options.renderer = value;
  }
  constructor(platform, securityContext, http, clipboardOptions, options, sanitizer) {
    this.platform = platform;
    this.securityContext = securityContext;
    this.http = http;
    this.clipboardOptions = clipboardOptions;
    this.sanitizer = sanitizer;
    this.DEFAULT_MARKED_OPTIONS = {
      renderer: new marked__WEBPACK_IMPORTED_MODULE_0__.Renderer()
    };
    this.DEFAULT_KATEX_OPTIONS = {
      delimiters: [{
        left: "$$",
        right: "$$",
        display: true
      }, {
        left: "$",
        right: "$",
        display: false
      }, {
        left: "\\(",
        right: "\\)",
        display: false
      }, {
        left: "\\begin{equation}",
        right: "\\end{equation}",
        display: true
      }, {
        left: "\\begin{align}",
        right: "\\end{align}",
        display: true
      }, {
        left: "\\begin{alignat}",
        right: "\\end{alignat}",
        display: true
      }, {
        left: "\\begin{gather}",
        right: "\\end{gather}",
        display: true
      }, {
        left: "\\begin{CD}",
        right: "\\end{CD}",
        display: true
      }, {
        left: "\\[",
        right: "\\]",
        display: true
      }]
    };
    this.DEFAULT_MERMAID_OPTIONS = {
      startOnLoad: false
    };
    this.DEFAULT_CLIPBOARD_OPTIONS = {
      buttonComponent: undefined
    };
    this.DEFAULT_PARSE_OPTIONS = {
      decodeHtml: false,
      inline: false,
      emoji: false,
      mermaid: false,
      markedOptions: this.DEFAULT_MARKED_OPTIONS,
      disableSanitizer: false
    };
    this.DEFAULT_RENDER_OPTIONS = {
      clipboard: false,
      clipboardOptions: undefined,
      katex: false,
      katexOptions: undefined,
      mermaid: false,
      mermaidOptions: undefined
    };
    this._reload$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
    this.reload$ = this._reload$.asObservable();
    this.options = options;
  }
  parse(markdown, parseOptions = this.DEFAULT_PARSE_OPTIONS) {
    const {
      decodeHtml,
      inline,
      emoji,
      mermaid,
      disableSanitizer
    } = parseOptions;
    const markedOptions = {
      ...this.options,
      ...parseOptions.markedOptions
    };
    if (mermaid) {
      this.renderer = this.extendRenderer(markedOptions.renderer || new marked__WEBPACK_IMPORTED_MODULE_0__.Renderer());
    }
    const trimmed = this.trimIndentation(markdown);
    const decoded = decodeHtml ? this.decodeHtml(trimmed) : trimmed;
    const emojified = emoji ? this.parseEmoji(decoded) : decoded;
    const marked = this.parseMarked(emojified, markedOptions, inline);
    const sanitized = disableSanitizer ? marked : this.sanitizer.sanitize(this.securityContext, marked);
    return sanitized || '';
  }
  render(element, options = this.DEFAULT_RENDER_OPTIONS, viewContainerRef) {
    const {
      clipboard,
      clipboardOptions,
      katex,
      katexOptions,
      mermaid,
      mermaidOptions
    } = options;
    if (clipboard) {
      this.renderClipboard(element, viewContainerRef, {
        ...this.DEFAULT_CLIPBOARD_OPTIONS,
        ...this.clipboardOptions,
        ...clipboardOptions
      });
    }
    if (katex) {
      this.renderKatex(element, {
        ...this.DEFAULT_KATEX_OPTIONS,
        ...katexOptions
      });
    }
    if (mermaid) {
      this.renderMermaid(element, {
        ...this.DEFAULT_MERMAID_OPTIONS,
        ...mermaidOptions
      });
    }
    this.highlight(element);
  }
  reload() {
    this._reload$.next();
  }
  getSource(src) {
    if (!this.http) {
      throw new Error(errorSrcWithoutHttpClient);
    }
    return this.http.get(src, {
      responseType: 'text'
    }).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_10__.map)(markdown => this.handleExtension(src, markdown)));
  }
  highlight(element) {
    if (!(0,_angular_common__WEBPACK_IMPORTED_MODULE_12__.isPlatformBrowser)(this.platform)) {
      return;
    }
    if (typeof Prism === 'undefined' || typeof Prism.highlightAllUnder === 'undefined') {
      return;
    }
    if (!element) {
      element = document;
    }
    const noLanguageElements = element.querySelectorAll('pre code:not([class*="language-"])');
    Array.prototype.forEach.call(noLanguageElements, x => x.classList.add('language-none'));
    Prism.highlightAllUnder(element);
  }
  decodeHtml(html) {
    if (!(0,_angular_common__WEBPACK_IMPORTED_MODULE_12__.isPlatformBrowser)(this.platform)) {
      return html;
    }
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  }
  extendRenderer(renderer) {
    const extendedRenderer = renderer;
    if (extendedRenderer.ɵNgxMarkdownRendererExtended === true) {
      return renderer;
    }
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const defaultCode = renderer.code;
    renderer.code = function (code, language, isEscaped) {
      return language === 'mermaid' ? `<div class="mermaid">${code}</div>` : defaultCode.call(this, code, language, isEscaped);
    };
    extendedRenderer.ɵNgxMarkdownRendererExtended = true;
    return renderer;
  }
  handleExtension(src, markdown) {
    const urlProtocolIndex = src.lastIndexOf('://');
    const urlWithoutProtocol = urlProtocolIndex > -1 ? src.substring(urlProtocolIndex + 4) : src;
    const lastSlashIndex = urlWithoutProtocol.lastIndexOf('/');
    const lastUrlSegment = lastSlashIndex > -1 ? urlWithoutProtocol.substring(lastSlashIndex + 1).split('?')[0] : '';
    const lastDotIndex = lastUrlSegment.lastIndexOf('.');
    const extension = lastDotIndex > -1 ? lastUrlSegment.substring(lastDotIndex + 1) : '';
    return !!extension && extension !== 'md' ? '```' + extension + '\n' + markdown + '\n```' : markdown;
  }
  parseMarked(html, markedOptions, inline = false) {
    return inline ? marked__WEBPACK_IMPORTED_MODULE_0__.marked.parseInline(html, markedOptions) : marked__WEBPACK_IMPORTED_MODULE_0__.marked.parse(html, markedOptions);
  }
  parseEmoji(html) {
    if (!(0,_angular_common__WEBPACK_IMPORTED_MODULE_12__.isPlatformBrowser)(this.platform)) {
      return html;
    }
    if (typeof joypixels === 'undefined' || typeof joypixels.shortnameToUnicode === 'undefined') {
      throw new Error(errorJoyPixelsNotLoaded);
    }
    return joypixels.shortnameToUnicode(html);
  }
  renderKatex(element, options) {
    if (!(0,_angular_common__WEBPACK_IMPORTED_MODULE_12__.isPlatformBrowser)(this.platform)) {
      return;
    }
    if (typeof katex === 'undefined' || typeof renderMathInElement === 'undefined') {
      throw new Error(errorKatexNotLoaded);
    }
    renderMathInElement(element, options);
  }
  renderClipboard(element, viewContainerRef, options) {
    if (!(0,_angular_common__WEBPACK_IMPORTED_MODULE_12__.isPlatformBrowser)(this.platform)) {
      return;
    }
    if (typeof ClipboardJS === 'undefined') {
      throw new Error(errorClipboardNotLoaded);
    }
    if (!viewContainerRef) {
      throw new Error(errorClipboardViewContainerRequired);
    }
    const {
      buttonComponent,
      buttonTemplate
    } = options;
    // target every <pre> elements
    const preElements = element.querySelectorAll('pre');
    for (let i = 0; i < preElements.length; i++) {
      const preElement = preElements.item(i);
      // create <pre> wrapper element
      const preWrapperElement = document.createElement('div');
      preWrapperElement.style.position = 'relative';
      preElement.parentNode.insertBefore(preWrapperElement, preElement);
      preWrapperElement.appendChild(preElement);
      // create toolbar element
      const toolbarWrapperElement = document.createElement('div');
      toolbarWrapperElement.style.position = 'absolute';
      toolbarWrapperElement.style.top = '.5em';
      toolbarWrapperElement.style.right = '.5em';
      toolbarWrapperElement.style.opacity = '0';
      toolbarWrapperElement.style.transition = 'opacity 250ms ease-out';
      preWrapperElement.insertAdjacentElement('beforeend', toolbarWrapperElement);
      // register listener to show/hide toolbar
      preElement.onmouseover = () => toolbarWrapperElement.style.opacity = '1';
      preElement.onmouseout = () => toolbarWrapperElement.style.opacity = '0';
      // declare embeddedViewRef holding variable
      let embeddedViewRef;
      // use provided component via input property
      // or provided via ClipboardOptions provider
      if (buttonComponent) {
        const componentRef = viewContainerRef.createComponent(buttonComponent);
        embeddedViewRef = componentRef.hostView;
      }
      // use provided template via input property
      else if (buttonTemplate) {
        embeddedViewRef = viewContainerRef.createEmbeddedView(buttonTemplate);
      }
      // use default component
      else {
        const componentRef = viewContainerRef.createComponent(ClipboardButtonComponent);
        embeddedViewRef = componentRef.hostView;
      }
      // declare clipboard instance variable
      let clipboardInstance;
      // attach clipboard.js to root node
      embeddedViewRef.rootNodes.forEach(node => {
        node.onmouseover = () => toolbarWrapperElement.style.opacity = '1';
        toolbarWrapperElement.appendChild(node);
        clipboardInstance = new ClipboardJS(node, {
          text: () => preElement.innerText
        });
      });
      // destroy clipboard instance when view is destroyed
      embeddedViewRef.onDestroy(() => clipboardInstance.destroy());
    }
  }
  renderMermaid(element, options = this.DEFAULT_MERMAID_OPTIONS) {
    if (!(0,_angular_common__WEBPACK_IMPORTED_MODULE_12__.isPlatformBrowser)(this.platform)) {
      return;
    }
    if (typeof mermaid === 'undefined' || typeof mermaid.init === 'undefined') {
      throw new Error(errorMermaidNotLoaded);
    }
    const mermaidElements = element.querySelectorAll('.mermaid');
    if (mermaidElements.length === 0) {
      return;
    }
    mermaid.initialize(options);
    mermaid.init(mermaidElements);
  }
  trimIndentation(markdown) {
    if (!markdown) {
      return '';
    }
    let indentStart;
    return markdown.split('\n').map(line => {
      let lineIdentStart = indentStart;
      if (line.length > 0) {
        lineIdentStart = isNaN(lineIdentStart) ? line.search(/\S|$/) : Math.min(line.search(/\S|$/), lineIdentStart);
      }
      if (isNaN(indentStart)) {
        indentStart = lineIdentStart;
      }
      return lineIdentStart ? line.substring(lineIdentStart) : line;
    }).join('\n');
  }
  static {
    this.ɵfac = function MarkdownService_Factory(t) {
      return new (t || MarkdownService)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](_angular_core__WEBPACK_IMPORTED_MODULE_11__.PLATFORM_ID), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](SECURITY_CONTEXT), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_13__.HttpClient, 8), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](ClipboardOptions, 8), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](MarkedOptions, 8), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵinject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__.DomSanitizer));
    };
  }
  static {
    this.ɵprov = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjectable"]({
      token: MarkdownService,
      factory: MarkdownService.ɵfac
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵsetClassMetadata"](MarkdownService, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Injectable
  }], function () {
    return [{
      type: Object,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Inject,
        args: [_angular_core__WEBPACK_IMPORTED_MODULE_11__.PLATFORM_ID]
      }]
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.SecurityContext,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Inject,
        args: [SECURITY_CONTEXT]
      }]
    }, {
      type: _angular_common_http__WEBPACK_IMPORTED_MODULE_13__.HttpClient,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Optional
      }]
    }, {
      type: ClipboardOptions,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Optional
      }]
    }, {
      type: MarkedOptions,
      decorators: [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Optional
      }]
    }, {
      type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__.DomSanitizer
    }];
  }, null);
})();

/* eslint-disable @typescript-eslint/no-unused-vars */
class MarkdownComponent {
  get disableSanitizer() {
    return this._disableSanitizer;
  }
  set disableSanitizer(value) {
    this._disableSanitizer = this.coerceBooleanProperty(value);
  }
  get inline() {
    return this._inline;
  }
  set inline(value) {
    this._inline = this.coerceBooleanProperty(value);
  }
  get srcRelativeLink() {
    return this._srcRelativeLink;
  }
  set srcRelativeLink(value) {
    this._srcRelativeLink = this.coerceBooleanProperty(value);
  }
  // Plugin - clipboard
  get clipboard() {
    return this._clipboard;
  }
  set clipboard(value) {
    this._clipboard = this.coerceBooleanProperty(value);
  }
  // Plugin - emoji
  get emoji() {
    return this._emoji;
  }
  set emoji(value) {
    this._emoji = this.coerceBooleanProperty(value);
  }
  // Plugin - katex
  get katex() {
    return this._katex;
  }
  set katex(value) {
    this._katex = this.coerceBooleanProperty(value);
  }
  // Plugin - mermaid
  get mermaid() {
    return this._mermaid;
  }
  set mermaid(value) {
    this._mermaid = this.coerceBooleanProperty(value);
  }
  // Plugin - lineHighlight
  get lineHighlight() {
    return this._lineHighlight;
  }
  set lineHighlight(value) {
    this._lineHighlight = this.coerceBooleanProperty(value);
  }
  // Plugin - lineNumbers
  get lineNumbers() {
    return this._lineNumbers;
  }
  set lineNumbers(value) {
    this._lineNumbers = this.coerceBooleanProperty(value);
  }
  // Plugin - commandLine
  get commandLine() {
    return this._commandLine;
  }
  set commandLine(value) {
    this._commandLine = this.coerceBooleanProperty(value);
  }
  constructor(element, markdownService, viewContainerRef) {
    this.element = element;
    this.markdownService = markdownService;
    this.viewContainerRef = viewContainerRef;
    // Event emitters
    this.error = new _angular_core__WEBPACK_IMPORTED_MODULE_11__.EventEmitter();
    this.load = new _angular_core__WEBPACK_IMPORTED_MODULE_11__.EventEmitter();
    this.ready = new _angular_core__WEBPACK_IMPORTED_MODULE_11__.EventEmitter();
    this._clipboard = false;
    this._commandLine = false;
    this._disableSanitizer = false;
    this._emoji = false;
    this._inline = false;
    this._katex = false;
    this._lineHighlight = false;
    this._lineNumbers = false;
    this._mermaid = false;
    this._srcRelativeLink = false;
    this.destroyed$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.Subject();
  }
  ngOnChanges() {
    this.loadContent();
  }
  loadContent() {
    if (this.data != null) {
      this.handleData();
      return;
    }
    if (this.src != null) {
      this.handleSrc();
      return;
    }
  }
  ngAfterViewInit() {
    if (!this.data && !this.src) {
      this.handleTransclusion();
    }
    this.markdownService.reload$.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_15__.takeUntil)(this.destroyed$)).subscribe(() => this.loadContent());
  }
  ngOnDestroy() {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
  render(markdown, decodeHtml = false) {
    let markedOptions;
    if (this.src && this.srcRelativeLink) {
      const baseUrl = new URL(this.src, location.origin).pathname;
      markedOptions = {
        baseUrl
      };
    }
    const parsedOptions = {
      decodeHtml,
      inline: this.inline,
      emoji: this.emoji,
      mermaid: this.mermaid,
      markedOptions,
      disableSanitizer: this.disableSanitizer
    };
    const renderOptions = {
      clipboard: this.clipboard,
      clipboardOptions: {
        buttonComponent: this.clipboardButtonComponent,
        buttonTemplate: this.clipboardButtonTemplate
      },
      katex: this.katex,
      katexOptions: this.katexOptions,
      mermaid: this.mermaid,
      mermaidOptions: this.mermaidOptions
    };
    const parsed = this.markdownService.parse(markdown, parsedOptions);
    this.element.nativeElement.innerHTML = parsed;
    this.handlePlugins();
    this.markdownService.render(this.element.nativeElement, renderOptions, this.viewContainerRef);
    this.ready.emit();
  }
  coerceBooleanProperty(value) {
    return value != null && `${String(value)}` !== 'false';
  }
  handleData() {
    this.render(this.data);
  }
  handleSrc() {
    this.markdownService.getSource(this.src).subscribe({
      next: markdown => {
        this.render(markdown);
        this.load.emit(markdown);
      },
      error: error => this.error.emit(error)
    });
  }
  handleTransclusion() {
    this.render(this.element.nativeElement.innerHTML, true);
  }
  handlePlugins() {
    if (this.commandLine) {
      this.setPluginClass(this.element.nativeElement, PrismPlugin.CommandLine);
      this.setPluginOptions(this.element.nativeElement, {
        dataFilterOutput: this.filterOutput,
        dataHost: this.host,
        dataPrompt: this.prompt,
        dataOutput: this.output,
        dataUser: this.user
      });
    }
    if (this.lineHighlight) {
      this.setPluginOptions(this.element.nativeElement, {
        dataLine: this.line,
        dataLineOffset: this.lineOffset
      });
    }
    if (this.lineNumbers) {
      this.setPluginClass(this.element.nativeElement, PrismPlugin.LineNumbers);
      this.setPluginOptions(this.element.nativeElement, {
        dataStart: this.start
      });
    }
  }
  setPluginClass(element, plugin) {
    const preElements = element.querySelectorAll('pre');
    for (let i = 0; i < preElements.length; i++) {
      const classes = plugin instanceof Array ? plugin : [plugin];
      preElements.item(i).classList.add(...classes);
    }
  }
  setPluginOptions(element, options) {
    const preElements = element.querySelectorAll('pre');
    for (let i = 0; i < preElements.length; i++) {
      Object.keys(options).forEach(option => {
        const attributeValue = options[option];
        if (attributeValue) {
          const attributeName = this.toLispCase(option);
          preElements.item(i).setAttribute(attributeName, attributeValue.toString());
        }
      });
    }
  }
  toLispCase(value) {
    const upperChars = value.match(/([A-Z])/g);
    if (!upperChars) {
      return value;
    }
    let str = value.toString();
    for (let i = 0, n = upperChars.length; i < n; i++) {
      str = str.replace(new RegExp(upperChars[i]), '-' + upperChars[i].toLowerCase());
    }
    if (str.slice(0, 1) === '-') {
      str = str.slice(1);
    }
    return str;
  }
  static {
    this.ɵfac = function MarkdownComponent_Factory(t) {
      return new (t || MarkdownComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_11__.ElementRef), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](MarkdownService), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_11__.ViewContainerRef));
    };
  }
  static {
    this.ɵcmp = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineComponent"]({
      type: MarkdownComponent,
      selectors: [["markdown"], ["", "markdown", ""]],
      inputs: {
        data: "data",
        src: "src",
        disableSanitizer: "disableSanitizer",
        inline: "inline",
        srcRelativeLink: "srcRelativeLink",
        clipboard: "clipboard",
        clipboardButtonComponent: "clipboardButtonComponent",
        clipboardButtonTemplate: "clipboardButtonTemplate",
        emoji: "emoji",
        katex: "katex",
        katexOptions: "katexOptions",
        mermaid: "mermaid",
        mermaidOptions: "mermaidOptions",
        lineHighlight: "lineHighlight",
        line: "line",
        lineOffset: "lineOffset",
        lineNumbers: "lineNumbers",
        start: "start",
        commandLine: "commandLine",
        filterOutput: "filterOutput",
        host: "host",
        prompt: "prompt",
        output: "output",
        user: "user"
      },
      outputs: {
        error: "error",
        load: "load",
        ready: "ready"
      },
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵNgOnChangesFeature"]],
      ngContentSelectors: _c0,
      decls: 1,
      vars: 0,
      template: function MarkdownComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵprojectionDef"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵprojection"](0);
        }
      },
      encapsulation: 2
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵsetClassMetadata"](MarkdownComponent, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Component,
    args: [{
      // eslint-disable-next-line @angular-eslint/component-selector
      selector: 'markdown, [markdown]',
      template: '<ng-content></ng-content>'
    }]
  }], function () {
    return [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.ElementRef
    }, {
      type: MarkdownService
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.ViewContainerRef
    }];
  }, {
    data: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    src: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    disableSanitizer: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    inline: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    srcRelativeLink: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    clipboard: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    clipboardButtonComponent: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    clipboardButtonTemplate: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    emoji: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    katex: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    katexOptions: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    mermaid: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    mermaidOptions: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    lineHighlight: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    line: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    lineOffset: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    lineNumbers: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    start: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    commandLine: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    filterOutput: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    host: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    prompt: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    output: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    user: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Input
    }],
    error: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Output
    }],
    load: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Output
    }],
    ready: [{
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Output
    }]
  });
})();
class MarkdownPipe {
  constructor(domSanitizer, elementRef, markdownService, viewContainerRef, zone) {
    this.domSanitizer = domSanitizer;
    this.elementRef = elementRef;
    this.markdownService = markdownService;
    this.viewContainerRef = viewContainerRef;
    this.zone = zone;
  }
  transform(value, options) {
    if (value == null) {
      return '';
    }
    if (typeof value !== 'string') {
      console.error(`MarkdownPipe has been invoked with an invalid value type [${typeof value}]`);
      return value;
    }
    const markdown = this.markdownService.parse(value, options);
    this.zone.onStable.pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_16__.first)()).subscribe(() => this.markdownService.render(this.elementRef.nativeElement, options, this.viewContainerRef));
    return this.domSanitizer.bypassSecurityTrustHtml(markdown);
  }
  static {
    this.ɵfac = function MarkdownPipe_Factory(t) {
      return new (t || MarkdownPipe)(_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__.DomSanitizer, 16), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_11__.ElementRef, 16), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](MarkdownService, 16), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_11__.ViewContainerRef, 16), _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdirectiveInject"](_angular_core__WEBPACK_IMPORTED_MODULE_11__.NgZone, 16));
    };
  }
  static {
    this.ɵpipe = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefinePipe"]({
      name: "markdown",
      type: MarkdownPipe,
      pure: true
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵsetClassMetadata"](MarkdownPipe, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.Pipe,
    args: [{
      name: 'markdown'
    }]
  }], function () {
    return [{
      type: _angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__.DomSanitizer
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.ElementRef
    }, {
      type: MarkdownService
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.ViewContainerRef
    }, {
      type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.NgZone
    }];
  }, null);
})();
const sharedDeclarations = [ClipboardButtonComponent, LanguagePipe, MarkdownComponent, MarkdownPipe];
class MarkdownModule {
  static forRoot(markdownModuleConfig) {
    return {
      ngModule: MarkdownModule,
      providers: [MarkdownService, markdownModuleConfig && markdownModuleConfig.loader || [], markdownModuleConfig && markdownModuleConfig.clipboardOptions || [], markdownModuleConfig && markdownModuleConfig.markedOptions || [], {
        provide: SECURITY_CONTEXT,
        useValue: markdownModuleConfig && markdownModuleConfig.sanitize != null ? markdownModuleConfig.sanitize : _angular_core__WEBPACK_IMPORTED_MODULE_11__.SecurityContext.HTML
      }]
    };
  }
  static forChild() {
    return {
      ngModule: MarkdownModule
    };
  }
  static {
    this.ɵfac = function MarkdownModule_Factory(t) {
      return new (t || MarkdownModule)();
    };
  }
  static {
    this.ɵmod = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineNgModule"]({
      type: MarkdownModule
    });
  }
  static {
    this.ɵinj = /* @__PURE__ */_angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule]
    });
  }
}
(function () {
  (typeof ngDevMode === "undefined" || ngDevMode) && _angular_core__WEBPACK_IMPORTED_MODULE_11__["ɵsetClassMetadata"](MarkdownModule, [{
    type: _angular_core__WEBPACK_IMPORTED_MODULE_11__.NgModule,
    args: [{
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_12__.CommonModule],
      exports: sharedDeclarations,
      declarations: sharedDeclarations
    }]
  }], null, null);
})();

/* eslint-disable */
var MermaidAPI;
(function (MermaidAPI) {
  let SecurityLevel;
  (function (SecurityLevel) {
    /**
     * (default) tags in text are encoded, click functionality is disabled
     */
    SecurityLevel["Strict"] = "strict";
    /**
     * tags in text are allowed, click functionality is enabled
     */
    SecurityLevel["Loose"] = "loose";
    /**
     * html tags in text are allowed, (only script element is removed), click functionality is enabled
     */
    SecurityLevel["Antiscript"] = "antiscript";
    /**
     * with this security level all rendering takes place in a sandboxed iframe.
     * This prevent any javascript running in the context.
     * This may hinder interactive functionality of the diagram like scripts,
     * popups in sequence diagram or links to other tabs/targets etc.
     */
    SecurityLevel["Sandbox"] = "sandbox";
  })(SecurityLevel = MermaidAPI.SecurityLevel || (MermaidAPI.SecurityLevel = {}));
  let Theme;
  (function (Theme) {
    /**
     * Designed to modified, as the name implies it is supposed to be used as the base for making custom themes.
     */
    Theme["Base"] = "base";
    /**
     * A theme full of light greens that is easy on the eyes.
     */
    Theme["Forest"] = "forest";
    /**
     * A theme that would go well with other dark colored elements.
     */
    Theme["Dark"] = "dark";
    /**
     *  The default theme for all diagrams.
     */
    Theme["Default"] = "default";
    /**
     * The theme to be used for black and white printing
     */
    Theme["Neutral"] = "neutral";
  })(Theme = MermaidAPI.Theme || (MermaidAPI.Theme = {}));
  let LogLevel;
  (function (LogLevel) {
    LogLevel[LogLevel["Debug"] = 1] = "Debug";
    LogLevel[LogLevel["Info"] = 2] = "Info";
    LogLevel[LogLevel["Warn"] = 3] = "Warn";
    LogLevel[LogLevel["Error"] = 4] = "Error";
    LogLevel[LogLevel["Fatal"] = 5] = "Fatal";
  })(LogLevel = MermaidAPI.LogLevel || (MermaidAPI.LogLevel = {}));
})(MermaidAPI || (MermaidAPI = {}));

/**
 * Generated bundle index. Do not edit.
 */



/***/ })

}]);
//# sourceMappingURL=default-src_app_core_guards_permission_guard_ts-src_app_shared_components_form-dropdown_form--119cde.d5894afd817eb408.js.map