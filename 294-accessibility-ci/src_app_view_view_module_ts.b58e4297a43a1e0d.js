"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_view_module_ts"],{

/***/ 98521:
/*!*******************************************************************!*\
  !*** ./src/app/layout/content-layout/content-layout.component.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContentLayoutComponent: () => (/* binding */ ContentLayoutComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../sidebar/sidebar.component */ 30755);
/* harmony import */ var _header_header_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../header/header.component */ 60679);




class ContentLayoutComponent {
  constructor() {
    this.isSidebarOpen = false;
  }
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  static {
    this.ɵfac = function ContentLayoutComponent_Factory(t) {
      return new (t || ContentLayoutComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: ContentLayoutComponent,
      selectors: [["app-content-layout"]],
      decls: 6,
      vars: 0,
      consts: [[1, "flex", "h-screen", "flex-col", "lg:flex-row"], [1, "sticky", "top-0", "lg:static", "bg-tertiary-30", "z-50"], [1, "flex-1", "overflow-y-auto", "main-content"], ["id", "main-content", 1, "lg:p-9", "mt-12"]],
      template: function ContentLayoutComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](1, "app-sidebar", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](2, "main", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](3, "app-header");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](4, "main", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](5, "router-outlet");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        }
      },
      dependencies: [_angular_router__WEBPACK_IMPORTED_MODULE_3__.RouterOutlet, _sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_0__.SidebarComponent, _header_header_component__WEBPACK_IMPORTED_MODULE_1__.HeaderComponent],
      styles: [".main-content[_ngcontent-%COMP%] {\n  background-color: var(--surface-muted);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbnRlbnQtbGF5b3V0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksc0NBQUE7QUFDSiIsImZpbGUiOiJjb250ZW50LWxheW91dC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5tYWluLWNvbnRlbnR7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc3VyZmFjZS1tdXRlZCk7XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0L2NvbnRlbnQtbGF5b3V0L2NvbnRlbnQtbGF5b3V0LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0ksc0NBQUE7QUFDSjtBQUNBLG9XQUFvVyIsInNvdXJjZXNDb250ZW50IjpbIi5tYWluLWNvbnRlbnR7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc3VyZmFjZS1tdXRlZCk7XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 60679:
/*!***************************************************!*\
  !*** ./src/app/layout/header/header.component.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HeaderComponent: () => (/* binding */ HeaderComponent)
/* harmony export */ });
/* harmony import */ var _home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _sidebar_sidebar_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../sidebar/sidebar.service */ 41883);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../shared/components/profile-image/profile-image.component */ 85445);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ 90852);











function HeaderComponent_a_5_span_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "span", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", ctx_r3.activeGenerationCount > 99 ? "99+" : ctx_r3.activeGenerationCount, " ");
  }
}
const _c0 = function (a0) {
  return {
    "status-activity-spin": a0
  };
};
function HeaderComponent_a_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "a", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](1, "img", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](2, HeaderComponent_a_5_span_2_Template, 2, 1, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngClass", ctx_r0.router.url.includes("/generation-status") ? "bg-[#EDF6FE] border-primary" : "bg-white border-[#D9E1EC] hover:bg-[#EDF6FE]");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction1"](4, _c0, ctx_r0.activeGenerationCount > 0 && !ctx_r0.router.url.includes("/generation-status")))("src", ctx_r0.router.url.includes("/generation-status") ? "assets/icons/generation-status-light.svg" : "assets/icons/generation-status.svg", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx_r0.activeGenerationCount > 0 && !ctx_r0.router.url.includes("/generation-status"));
  }
}
function HeaderComponent_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "div", 15)(1, "div", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](2, "app-profile-image", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](3, "div")(4, "p", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](6, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](7, "p", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](9, "titlecase");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](10, "hr");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](11, "div", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function HeaderComponent_div_9_Template_div_click_11_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r5);
      const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r4.openModalForLogoutConfirm());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](12, "img", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](13, "p", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtext"](14);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipe"](15, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("profileImage", ctx_r1.sidebarService.profileImg())("size", "md");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](6, 5, ctx_r1.utilityService.loggedInUserData == null ? null : ctx_r1.utilityService.loggedInUserData.name), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate1"](" ", (ctx_r1.utilityService.loggedInUserData == null ? null : ctx_r1.utilityService.loggedInUserData.school == null ? null : ctx_r1.utilityService.loggedInUserData.school.name) || _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](9, 7, ctx_r1.utilityService.loggedInUserData == null ? null : ctx_r1.utilityService.loggedInUserData.role.join(" | ")), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpipeBind1"](15, 9, "Logout"));
  }
}
const _c1 = function () {
  return {
    heading: "Confirm",
    confirmationText: "Do you want to logout?",
    primaryButtonLabel: "Logout",
    primaryButtonType: "logout"
  };
};
function HeaderComponent_app_delete_detail_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "app-delete-detail", 22);
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("close", function HeaderComponent_app_delete_detail_10_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵrestoreView"](_r7);
      const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresetView"](ctx_r6.closeModal($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](1, _c1));
  }
}
const _c2 = function () {
  return ["power"];
};
class HeaderComponent {
  /**
   * Class constructor
   * @param sidebarService
   * @param utilityService
   */
  constructor(sidebarService, utilityService, router) {
    this.sidebarService = sidebarService;
    this.utilityService = utilityService;
    this.router = router;
    this.isMenuOpen = false;
    this.activeGenerationCount = 0;
    this.generationStatusStream = null;
    this.generationStatusReconnectTimeout = null;
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_6__.effect)(() => {
      if (!this.sidebarService.headerOptionShow()) {
        this.isMenuOpen = false;
      }
    });
  }
  ngOnInit() {
    if (this.utilityService.hasPermission(['power'])) {
      this.connectGenerationStatusStream();
    }
  }
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (this.isMenuOpen) {
      this.sidebarService.headerOptionShow.set(true);
    }
  }
  onDocumentClick(event) {
    if (!event.target.closest('.relative')) {
      this.isMenuOpen = false;
    }
  }
  openSidebar() {
    this.sidebarService.sidebarOpen.set(true);
  }
  openModalForLogoutConfirm() {
    this.showLogoutConfirm = true;
  }
  closeModal(value) {
    if (value === 'logout') {
      this.utilityService.logout();
    }
    this.showLogoutConfirm = false;
  }
  connectGenerationStatusStream() {
    var _this = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      _this.clearGenerationStatusStream();
      const res = yield fetch(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl}/presentation/events/token`, {
        method: "POST",
        headers: {
          "Authorization": localStorage.getItem('token') || ""
        }
      });
      const token = yield res.text();
      _this.generationStatusStream = new EventSource(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl}/presentation/events/${token}`);
      _this.generationStatusStream.onmessage = event => {
        const count = Number(event.data);
        _this.activeGenerationCount = Number.isFinite(count) ? count : 0;
      };
      _this.generationStatusStream.onerror = () => {
        _this.clearGenerationStatusStream();
        _this.generationStatusReconnectTimeout = setTimeout(() => _this.connectGenerationStatusStream(), 5000);
      };
    })();
  }
  clearGenerationStatusStream() {
    if (this.generationStatusStream) {
      this.generationStatusStream.close();
      this.generationStatusStream = null;
    }
    if (this.generationStatusReconnectTimeout) {
      clearTimeout(this.generationStatusReconnectTimeout);
      this.generationStatusReconnectTimeout = null;
    }
  }
  ngOnDestroy() {
    this.clearGenerationStatusStream();
  }
  static {
    this.ɵfac = function HeaderComponent_Factory(t) {
      return new (t || HeaderComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_sidebar_sidebar_service__WEBPACK_IMPORTED_MODULE_2__.SidebarService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_7__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵdefineComponent"]({
      type: HeaderComponent,
      selectors: [["app-header"]],
      hostBindings: function HeaderComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function HeaderComponent_click_HostBindingHandler($event) {
            return ctx.onDocumentClick($event);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵresolveDocument"]);
        }
      },
      decls: 11,
      vars: 8,
      consts: [[1, "fixed", "z-30", "top-0", "left-0", "md:left-[270px]", "right-0", "header", "shadow-md", "py-2", "px-4", "md:px-8", "flex", "justify-between", "lg:justify-end", "items-center"], ["type", "button", "aria-label", "Open navigation menu", 1, "p-2", "rounded-md", "lg:hidden", 3, "click"], ["aria-hidden", "true", "xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 17 14", 1, "w-5", "h-5", "text-content-80"], ["stroke", "currentColor", "stroke-linecap", "round", "stroke-linejoin", "round", "stroke-width", "2", "d", "M1 1h15M1 7h15M1 13h15"], [1, "flex", "items-center", "gap-3"], ["routerLink", "/generation-status", "title", "Generation Status", "class", "relative flex items-center justify-center w-11 h-11 rounded-full border transition-colors", 3, "ngClass", 4, "ngIf"], [1, "relative"], ["type", "button", "aria-label", "Open profile menu", "aria-haspopup", "true", 1, "focus:outline-none", "rounded-full", "cursor-pointer", "focus-visible:ring-2", "focus-visible:ring-primary-100", 3, "click"], [3, "profileImage", "size"], ["class", "absolute right-0 mt-2 w-60 bg-white rounded shadow-lg p-4", 4, "ngIf"], [3, "config", "close", 4, "ngIf"], ["routerLink", "/generation-status", "title", "Generation Status", 1, "relative", "flex", "items-center", "justify-center", "w-11", "h-11", "rounded-full", "border", "transition-colors", 3, "ngClass"], ["alt", "Generation Status", 1, "w-5", "h-5", 3, "ngClass", "src"], ["class", "absolute -top-1 -right-1 min-w-[20px] h-5 px-1 rounded-full bg-[#DE3B40] text-white text-[10px] font-bold flex items-center justify-center shadow-sm", 4, "ngIf"], [1, "absolute", "-top-1", "-right-1", "min-w-[20px]", "h-5", "px-1", "rounded-full", "bg-[#DE3B40]", "text-white", "text-[10px]", "font-bold", "flex", "items-center", "justify-center", "shadow-sm"], [1, "absolute", "right-0", "mt-2", "w-60", "bg-white", "rounded", "shadow-lg", "p-4"], [1, "flex", "items-center", "gap-4", "bg-[#EDF6FE]", "mb-2", "p-4", "rounded-xl"], [1, "text-content", "text-sm", "font-semibold", "overflow-hidden", "whitespace-nowrap", "text-ellipsis", "w-[120px]"], [1, "text-content", "text-xs", "font-light", "overflow-hidden", "whitespace-nowrap", "text-ellipsis", "w-[120px]"], [1, "flex", "items-center", "p-3", "gap-2", "mt-2", "hover:bg-[#EDF6FE]", "rounded-lg", "cursor-pointer", 3, "click"], ["src", "assets/icons/logout.svg", "alt", "", 1, "menu-icon", "w-5"], [1, "text-sm", "text-shade"], [3, "config", "close"]],
      template: function HeaderComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](0, "header", 0)(1, "button", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_1_listener() {
            return ctx.openSidebar();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnamespaceSVG"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](2, "svg", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](3, "path", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵnamespaceHTML"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](4, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](5, HeaderComponent_a_5_Template, 3, 6, "a", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementStart"](6, "div", 6)(7, "button", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵlistener"]("click", function HeaderComponent_Template_button_click_7_listener() {
            return ctx.toggleMenu();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelement"](8, "app-profile-image", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](9, HeaderComponent_div_9_Template, 16, 11, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵtemplate"](10, HeaderComponent_app_delete_detail_10_Template, 1, 2, "app-delete-detail", 10);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵattribute"]("aria-expanded", ctx.sidebarService.sidebarOpen() ? "true" : "false");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.utilityService.hasPermission(_angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵpureFunction0"](7, _c2)));
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵattribute"]("aria-expanded", ctx.isMenuOpen ? "true" : "false");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("profileImage", ctx.sidebarService.profileImg())("size", "md");
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.isMenuOpen);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_6__["ɵɵproperty"]("ngIf", ctx.showLogoutConfirm);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_8__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_8__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_7__.RouterLink, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_4__.DeleteDetailComponent, _shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_5__.ProfileImageComponent, _angular_common__WEBPACK_IMPORTED_MODULE_8__.TitleCasePipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslatePipe],
      styles: [".header[_ngcontent-%COMP%] {\n  box-shadow: 0px 8px 12px -4px rgba(75, 75, 75, 0.04);\n  box-shadow: 0px 8px 12px -4px color-mix(in srgb, var(--content-DEFAULT) 4%, transparent);\n  background-color: var(--shade-50);\n}\n\n.status-activity-spin[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_status-activity-spin 2.4s ease-in-out infinite;\n  transform-origin: center;\n}\n\n@keyframes _ngcontent-%COMP%_status-activity-spin {\n  0%, 18% {\n    transform: rotate(0deg);\n  }\n  42%, 60% {\n    transform: rotate(180deg);\n  }\n  84%, 100% {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlYWRlci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNJLG9EQUFBO0VBQ0Esd0ZBQUE7RUFDQSxpQ0FBQTtBQUNKOztBQUVBO0VBQ0kseURBQUE7RUFDQSx3QkFBQTtBQUNKOztBQUVBO0VBQ0k7SUFDSSx1QkFBQTtFQUNOO0VBQ0U7SUFDSSx5QkFBQTtFQUNOO0VBQ0U7SUFDSSx5QkFBQTtFQUNOO0FBQ0YiLCJmaWxlIjoiaGVhZGVyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmhlYWRlciB7XG4gICAgYm94LXNoYWRvdzogMHB4IDhweCAxMnB4IC00cHggcmdiYSg3NSwgNzUsIDc1LCAwLjA0KTtcbiAgICBib3gtc2hhZG93OiAwcHggOHB4IDEycHggLTRweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSA0JSwgdHJhbnNwYXJlbnQpO1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoYWRlLTUwKVxufVxuXG4uc3RhdHVzLWFjdGl2aXR5LXNwaW4ge1xuICAgIGFuaW1hdGlvbjogc3RhdHVzLWFjdGl2aXR5LXNwaW4gMi40cyBlYXNlLWluLW91dCBpbmZpbml0ZTtcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiBjZW50ZXI7XG59XG5cbkBrZXlmcmFtZXMgc3RhdHVzLWFjdGl2aXR5LXNwaW4ge1xuICAgIDAlLCAxOCUge1xuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgwZGVnKTtcbiAgICB9XG4gICAgNDIlLCA2MCUge1xuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgxODBkZWcpO1xuICAgIH1cbiAgICA4NCUsIDEwMCUge1xuICAgICAgICB0cmFuc2Zvcm06IHJvdGF0ZSgzNjBkZWcpO1xuICAgIH1cbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0L2hlYWRlci9oZWFkZXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDSSxvREFBQTtFQUNBLHdGQUFBO0VBQ0EsaUNBQUE7QUFDSjs7QUFFQTtFQUNJLHlEQUFBO0VBQ0Esd0JBQUE7QUFDSjs7QUFFQTtFQUNJO0lBQ0ksdUJBQUE7RUFDTjtFQUNFO0lBQ0kseUJBQUE7RUFDTjtFQUNFO0lBQ0kseUJBQUE7RUFDTjtBQUNGO0FBQ0EsZ29DQUFnb0MiLCJzb3VyY2VzQ29udGVudCI6WyIuaGVhZGVyIHtcbiAgICBib3gtc2hhZG93OiAwcHggOHB4IDEycHggLTRweCByZ2JhKDc1LCA3NSwgNzUsIDAuMDQpO1xuICAgIGJveC1zaGFkb3c6IDBweCA4cHggMTJweCAtNHB4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1jb250ZW50LURFRkFVTFQpIDQlLCB0cmFuc3BhcmVudCk7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hhZGUtNTApXG59XG5cbi5zdGF0dXMtYWN0aXZpdHktc3BpbiB7XG4gICAgYW5pbWF0aW9uOiBzdGF0dXMtYWN0aXZpdHktc3BpbiAyLjRzIGVhc2UtaW4tb3V0IGluZmluaXRlO1xuICAgIHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlcjtcbn1cblxuQGtleWZyYW1lcyBzdGF0dXMtYWN0aXZpdHktc3BpbiB7XG4gICAgMCUsIDE4JSB7XG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDBkZWcpO1xuICAgIH1cbiAgICA0MiUsIDYwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDE4MGRlZyk7XG4gICAgfVxuICAgIDg0JSwgMTAwJSB7XG4gICAgICAgIHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7XG4gICAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 30755:
/*!*****************************************************!*\
  !*** ./src/app/layout/sidebar/sidebar.component.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidebarComponent: () => (/* binding */ SidebarComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_shared_utility_sidebar_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/sidebar.util */ 76583);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);
/* harmony import */ var _sidebar_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./sidebar.service */ 41883);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-translate/core */ 90852);








function SidebarComponent_ng_container_7_a_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "a", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function SidebarComponent_ng_container_7_a_1_Template_a_click_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r4);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r3.closeSidebar($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "img", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](2, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const menuItem_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]().$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("routerLinkActive", "bg-[#EDF6FE] !text-[#0A58A3]")("routerLink", menuItem_r1.route);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵattribute"]("aria-current", ctx_r2.isActive(menuItem_r1.match) ? "page" : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("src", ctx_r2.isActive(menuItem_r1.match) ? menuItem_r1.lightIcon : menuItem_r1.darkIcon, _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsanitizeUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpipeBind1"](4, 5, menuItem_r1.text));
  }
}
function SidebarComponent_ng_container_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, SidebarComponent_ng_container_7_a_1_Template, 5, 7, "a", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const menuItem_r1 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx_r0.utilitService.hasPermission(menuItem_r1.permission));
  }
}
class SidebarComponent {
  /**
   * Class constructor
   * @param router Router
   * @param utilitService UtilityService
   * @param sidebarService SidebarService
   */
  constructor(router, utilitService, sidebarService) {
    this.router = router;
    this.utilitService = utilitService;
    this.sidebarService = sidebarService;
    this.isSidebarOpen = false;
    this.menuItems = src_app_shared_utility_sidebar_util__WEBPACK_IMPORTED_MODULE_0__.menuItem;
    (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.effect)(() => {
      this.isSidebarOpen = this.sidebarService.sidebarOpen();
    });
  }
  closeSidebar(event) {
    event?.stopPropagation();
    this.sidebarService.sidebarOpen.set(false);
    this.sidebarService.headerOptionShow.set(false);
  }
  /**
   * Function to which match the current route with the substring provided
   * @param substring
   * @returns
   */
  isActive(substring) {
    const currentRoute = this.router.url;
    return currentRoute.includes(substring);
  }
  static {
    this.ɵfac = function SidebarComponent_Factory(t) {
      return new (t || SidebarComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_4__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_1__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_sidebar_service__WEBPACK_IMPORTED_MODULE_2__.SidebarService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: SidebarComponent,
      selectors: [["app-sidebar"]],
      decls: 8,
      vars: 3,
      consts: [[1, "sidebar-backdrop", "lg:h-full", 3, "ngClass", "click"], ["aria-label", "Main navigation", 1, "grid", "sidebar", "p-4", "top-0", "bottom-0", "left-0", "w-[270px]", "bg-white", "fixed", "z-[999]", "lg:static", "h-full", "overflow-y-auto", 3, "ngClass"], [1, "text-shade-80", "text-xl", "min-h-0"], [1, "p-2.5", "pl-0", "mt-1", "flex", "items-center", "rounded-md"], ["src", "assets/images/logo.svg", "alt", "", 1, "logo"], ["src", "assets/icons/E remove.svg", "alt", "remove", 1, "ml-auto", "block", "lg:hidden", 3, "click"], [4, "ngFor", "ngForOf"], ["class", "mt-1 flex text-shade items-center rounded-md px-3 py-4 duration-300 cursor-pointer menu-item focus:outline-none focus:ring-2 focus:ring-primary-100", "tabindex", "0", 3, "routerLinkActive", "routerLink", "click", 4, "ngIf"], ["tabindex", "0", 1, "mt-1", "flex", "text-shade", "items-center", "rounded-md", "px-3", "py-4", "duration-300", "cursor-pointer", "menu-item", "focus:outline-none", "focus:ring-2", "focus:ring-primary-100", 3, "routerLinkActive", "routerLink", "click"], ["alt", "", 1, "menu-icon", "w-5", 3, "src"], [1, "text-sm", "ml-2"]],
      template: function SidebarComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function SidebarComponent_Template_div_click_0_listener($event) {
            return ctx.closeSidebar($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](1, "nav", 1)(2, "div", 2)(3, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](4, "img", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](5, "img", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("click", function SidebarComponent_Template_img_click_5_listener($event) {
            return ctx.closeSidebar($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](6, "div");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](7, SidebarComponent_ng_container_7_Template, 2, 1, "ng-container", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx.isSidebarOpen ? "show" : "hide");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngClass", ctx.isSidebarOpen ? "show" : "hide");
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngForOf", ctx.menuItems);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLink, _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterLinkActive, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__.TranslatePipe],
      styles: [".mobile-header[_ngcontent-%COMP%] {\n  box-shadow: 0px 8px 12px -4px rgba(75, 75, 75, 0.08);\n  box-shadow: 0px 8px 12px -4px color-mix(in srgb, var(--content-DEFAULT) 8%, transparent);\n}\n\n.sidebar[_ngcontent-%COMP%] {\n  transition: all 0.5s ease;\n}\n\n.logo[_ngcontent-%COMP%] {\n  width: min(200px, 65%);\n}\n\n@media screen and (width < 1023px) {\n  .sidebar-backdrop[_ngcontent-%COMP%] {\n    transition: opacity 0.2s ease-in-out;\n  }\n  .sidebar-backdrop.show[_ngcontent-%COMP%] {\n    position: fixed;\n    inset: 0;\n    background-color: rgba(248, 249, 250, 0.5);\n    background-color: color-mix(in srgb, var(--surface-muted) 50%, transparent);\n  }\n  .sidebar-backdrop[_ngcontent-%COMP%]   .sidebar[_ngcontent-%COMP%] {\n    transition: transform 0.2s ease-in-out;\n  }\n  .sidebar-backdrop[_ngcontent-%COMP%]   .sidebar.show[_ngcontent-%COMP%] {\n    transform: translateX(0);\n  }\n  .sidebar-backdrop[_ngcontent-%COMP%]   .sidebar.hide[_ngcontent-%COMP%] {\n    transform: translateX(-100%);\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNpZGViYXIuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxvREFBQTtFQUNBLHdGQUFBO0FBQ0Y7O0FBQ0E7RUFDRSx5QkFBQTtBQUVGOztBQUNFO0VBQ0Usc0JBQUE7QUFFSjs7QUFDQTtFQUNFO0lBQ0Usb0NBQUE7RUFFRjtFQURFO0lBQ0UsZUFBQTtJQUNBLFFBQUE7SUFDQSwwQ0FBQTtJQUNBLDJFQUFBO0VBR0o7RUFERTtJQUNFLHNDQUFBO0VBR0o7RUFGSTtJQUNFLHdCQUFBO0VBSU47RUFESTtJQUNFLDRCQUFBO0VBR047QUFDRiIsImZpbGUiOiJzaWRlYmFyLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLm1vYmlsZS1oZWFkZXJ7XG4gIGJveC1zaGFkb3c6IDBweCA4cHggMTJweCAtNHB4IHJnYmEoNzUsIDc1LCA3NSwgMC4wOCk7XG4gIGJveC1zaGFkb3c6IDBweCA4cHggMTJweCAtNHB4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1jb250ZW50LURFRkFVTFQpIDglLCB0cmFuc3BhcmVudCk7XG59XG4uc2lkZWJhciB7XG4gIHRyYW5zaXRpb246IGFsbCAwLjVzIGVhc2U7XG59XG5cbiAgLmxvZ297XG4gICAgd2lkdGg6IG1pbigyMDBweCw2NSUpO1xuICB9XG5cbkBtZWRpYSBzY3JlZW4gYW5kICh3aWR0aDwxMDIzcHgpIHtcbiAgLnNpZGViYXItYmFja2Ryb3Age1xuICAgIHRyYW5zaXRpb246IG9wYWNpdHkgMC4ycyBlYXNlLWluLW91dDtcbiAgICAmLnNob3cge1xuICAgICAgcG9zaXRpb246IGZpeGVkO1xuICAgICAgaW5zZXQ6IDA7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI0OCwgMjQ5LCAyNTAsIDAuNSk7XG4gICAgICBiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tc3VyZmFjZS1tdXRlZCkgNTAlLCB0cmFuc3BhcmVudCk7XG4gICAgfVxuICAgIC5zaWRlYmFyIHtcbiAgICAgIHRyYW5zaXRpb246IHRyYW5zZm9ybSAwLjJzIGVhc2UtaW4tb3V0O1xuICAgICAgJi5zaG93IHtcbiAgICAgICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVYKDApO1xuICAgICAgfVxuICAgICAgLy8gaGlkZSBzaWRlYmFyXG4gICAgICAmLmhpZGUge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoLTEwMCUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvbGF5b3V0L3NpZGViYXIvc2lkZWJhci5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLG9EQUFBO0VBQ0Esd0ZBQUE7QUFDRjs7QUFDQTtFQUNFLHlCQUFBO0FBRUY7O0FBQ0U7RUFDRSxzQkFBQTtBQUVKOztBQUNBO0VBQ0U7SUFDRSxvQ0FBQTtFQUVGO0VBREU7SUFDRSxlQUFBO0lBQ0EsUUFBQTtJQUNBLDBDQUFBO0lBQ0EsMkVBQUE7RUFHSjtFQURFO0lBQ0Usc0NBQUE7RUFHSjtFQUZJO0lBQ0Usd0JBQUE7RUFJTjtFQURJO0lBQ0UsNEJBQUE7RUFHTjtBQUNGO0FBQ0EsZ2lEQUFnaUQiLCJzb3VyY2VzQ29udGVudCI6WyIubW9iaWxlLWhlYWRlcntcbiAgYm94LXNoYWRvdzogMHB4IDhweCAxMnB4IC00cHggcmdiYSg3NSwgNzUsIDc1LCAwLjA4KTtcbiAgYm94LXNoYWRvdzogMHB4IDhweCAxMnB4IC00cHggY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgOCUsIHRyYW5zcGFyZW50KTtcbn1cbi5zaWRlYmFyIHtcbiAgdHJhbnNpdGlvbjogYWxsIDAuNXMgZWFzZTtcbn1cblxuICAubG9nb3tcbiAgICB3aWR0aDogbWluKDIwMHB4LDY1JSk7XG4gIH1cblxuQG1lZGlhIHNjcmVlbiBhbmQgKHdpZHRoPDEwMjNweCkge1xuICAuc2lkZWJhci1iYWNrZHJvcCB7XG4gICAgdHJhbnNpdGlvbjogb3BhY2l0eSAwLjJzIGVhc2UtaW4tb3V0O1xuICAgICYuc2hvdyB7XG4gICAgICBwb3NpdGlvbjogZml4ZWQ7XG4gICAgICBpbnNldDogMDtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMjQ4LCAyNDksIDI1MCwgMC41KTtcbiAgICAgIGJhY2tncm91bmQtY29sb3I6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zdXJmYWNlLW11dGVkKSA1MCUsIHRyYW5zcGFyZW50KTtcbiAgICB9XG4gICAgLnNpZGViYXIge1xuICAgICAgdHJhbnNpdGlvbjogdHJhbnNmb3JtIDAuMnMgZWFzZS1pbi1vdXQ7XG4gICAgICAmLnNob3cge1xuICAgICAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7XG4gICAgICB9XG4gICAgICAvLyBoaWRlIHNpZGViYXJcbiAgICAgICYuaGlkZSB7XG4gICAgICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtMTAwJSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 85445:
/*!****************************************************************************!*\
  !*** ./src/app/shared/components/profile-image/profile-image.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProfileImageComponent: () => (/* binding */ ProfileImageComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);




function ProfileImageComponent_img_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "img", 3);
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", ctx_r0.profileImage, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeUrl"]);
  }
}
function ProfileImageComponent_ng_template_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 4)(1, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r2.firstCharacter);
  }
}
class ProfileImageComponent {
  constructor(utilityService) {
    this.utilityService = utilityService;
  }
  get firstCharacter() {
    return this.utilityService.loggedInUserData?.name ? this.utilityService.loggedInUserData?.name.charAt(0).toUpperCase() : '';
  }
  static {
    this.ɵfac = function ProfileImageComponent_Factory(t) {
      return new (t || ProfileImageComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__.UtilityService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ProfileImageComponent,
      selectors: [["app-profile-image"]],
      inputs: {
        profileImage: "profileImage",
        size: "size"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
      decls: 4,
      vars: 3,
      consts: [[3, "ngClass"], ["alt", "profile-pic", "class", "object-cover w-full h-full rounded-full", 3, "src", 4, "ngIf", "ngIfElse"], ["defaultImage", ""], ["alt", "profile-pic", 1, "object-cover", "w-full", "h-full", "rounded-full", 3, "src"], [1, "w-full", "h-full", "rounded-full", "flex", "justify-center", "items-center", "text-white", "bg-secondary"]],
      template: function ProfileImageComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, ProfileImageComponent_img_1_Template, 1, 1, "img", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, ProfileImageComponent_ng_template_2_Template, 3, 1, "ng-template", null, 2, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplateRefExtractor"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          const _r1 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵreference"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngClass", ctx.size);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.profileImage)("ngIfElse", _r1);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf],
      styles: [".lg[_ngcontent-%COMP%] {\n  width: 100px;\n  height: 100px;\n  font-size: 64px;\n}\n\n.md[_ngcontent-%COMP%] {\n  width: 42px;\n  height: 42px;\n  font-size: 24px;\n}\n\n.c-md[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  font-size: 20px;\n  font-weight: 700;\n  line-height: 28px;\n}\n@media (max-width: 756px) {\n  .c-md[_ngcontent-%COMP%] {\n    width: 28px;\n    height: 28px;\n    font-size: 14px;\n  }\n}\n\n.sm[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  font-size: 18px;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInByb2ZpbGUtaW1hZ2UuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxZQUFBO0VBQ0EsYUFBQTtFQUNBLGVBQUE7QUFDRjs7QUFDQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtBQUVGOztBQUFBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtBQUdGO0FBRkU7RUFORjtJQU9JLFdBQUE7SUFDQSxZQUFBO0lBQ0EsZUFBQTtFQUtGO0FBQ0Y7O0FBSEE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7QUFNRiIsImZpbGUiOiJwcm9maWxlLWltYWdlLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmxnIHtcbiAgd2lkdGg6IDEwMHB4O1xuICBoZWlnaHQ6IDEwMHB4O1xuICBmb250LXNpemU6IDY0cHg7XG59XG4ubWQge1xuICB3aWR0aDogNDJweDtcbiAgaGVpZ2h0OiA0MnB4O1xuICBmb250LXNpemU6IDI0cHg7XG59XG4uYy1tZCB7XG4gIHdpZHRoOiA0MHB4O1xuICBoZWlnaHQ6IDQwcHg7XG4gIGZvbnQtc2l6ZTogMjBweDtcbiAgZm9udC13ZWlnaHQ6IDcwMDtcbiAgbGluZS1oZWlnaHQ6IDI4cHg7XG4gIEBtZWRpYSAobWF4LXdpZHRoOjc1NnB4KSB7XG4gICAgd2lkdGg6IDI4cHg7XG4gICAgaGVpZ2h0OiAyOHB4O1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgfVxufVxuLnNtIHtcbiAgd2lkdGg6IDMycHg7XG4gIGhlaWdodDogMzJweDtcbiAgZm9udC1zaXplOiAxOHB4O1xufVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvcHJvZmlsZS1pbWFnZS9wcm9maWxlLWltYWdlLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsWUFBQTtFQUNBLGFBQUE7RUFDQSxlQUFBO0FBQ0Y7O0FBQ0E7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7QUFFRjs7QUFBQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7QUFHRjtBQUZFO0VBTkY7SUFPSSxXQUFBO0lBQ0EsWUFBQTtJQUNBLGVBQUE7RUFLRjtBQUNGOztBQUhBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxlQUFBO0FBTUY7QUFDQSxvakNBQW9qQyIsInNvdXJjZXNDb250ZW50IjpbIi5sZyB7XG4gIHdpZHRoOiAxMDBweDtcbiAgaGVpZ2h0OiAxMDBweDtcbiAgZm9udC1zaXplOiA2NHB4O1xufVxuLm1kIHtcbiAgd2lkdGg6IDQycHg7XG4gIGhlaWdodDogNDJweDtcbiAgZm9udC1zaXplOiAyNHB4O1xufVxuLmMtbWQge1xuICB3aWR0aDogNDBweDtcbiAgaGVpZ2h0OiA0MHB4O1xuICBmb250LXNpemU6IDIwcHg7XG4gIGZvbnQtd2VpZ2h0OiA3MDA7XG4gIGxpbmUtaGVpZ2h0OiAyOHB4O1xuICBAbWVkaWEgKG1heC13aWR0aDo3NTZweCkge1xuICAgIHdpZHRoOiAyOHB4O1xuICAgIGhlaWdodDogMjhweDtcbiAgICBmb250LXNpemU6IDE0cHg7XG4gIH1cbn1cbi5zbSB7XG4gIHdpZHRoOiAzMnB4O1xuICBoZWlnaHQ6IDMycHg7XG4gIGZvbnQtc2l6ZTogMThweDtcbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 76583:
/*!************************************************!*\
  !*** ./src/app/shared/utility/sidebar.util.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   menuItem: () => (/* binding */ menuItem)
/* harmony export */ });
const assetURl = 'assets/icons';
const menuItem = [getMenuItems('Dashboard', '/dashboard', 'dashboard.svg', 'dashboard-light.svg', 'dashboard', ['admin', 'manager']), getMenuItems('Home', '/home', 'dashboard.svg', 'dashboard-light.svg', 'home', ['standard', 'power']), getMenuItems('Profile', '/profile', 'profile.svg', 'profile-light.svg', 'profile', ['standard', 'power']), getMenuItems('School Management', '/school-management', 'school-management.svg', 'school-management-light.svg', 'school-management', ['admin', 'manager']), getMenuItems('Teacher Management', '/teacher-management', 'user-management.svg', 'user-management-light.svg', 'teacher-management', ['admin', 'manager']), getMenuItems('Staff Management', '/staff-management', 'staff-management.svg', 'staff-management-light.svg', 'staff-management', ['admin']), getMenuItems('Content Generation', '/content-generation', 'content-generation.svg', 'content-generation-light.svg', 'content-generation', ['standard', 'power']), getMenuItems('Question Paper Generation', '/question-paper', 'question-bank.svg', 'question-bank-light.svg', 'question-paper', ['standard', 'power']), getMenuItems('Chatbot', '/chatbot', 'chatbot.svg', 'chatbot-light.svg', 'chatbot', ['power']), getMenuItems('My Schedules', '/schedule', 'schedule.svg', 'schedule-light.svg', 'schedule', ['standard', 'power']), getMenuItems('Teacher Training', '/teacher-training', 'teacher-training-light.svg', 'teacher-training.svg', 'teacher-training', ['admin', 'manager']), getMenuItems('Content Activity', '/content-activity', 'content-activity.svg', 'content-activity-light.svg', 'content-activity', ['admin', 'manager']), getMenuItems('Audit Log', '/audit-log', 'audit-log-light.svg', 'audit-log.svg', 'audit-log', ['admin', 'manager']), getMenuItems('Help', '/help', 'help-light.svg', 'help.svg', 'help', ['standard', 'power']), getMenuItems('FAQ', '/faq', 'faq-light.svg', 'faq.svg', 'faq', ['admin', 'manager', 'standard', 'power'])];
function getMenuItems(text, route, darkIcon, lightIcon, match, permission) {
  return {
    text,
    route,
    darkIcon: `${assetURl}/${darkIcon}`,
    lightIcon: `${assetURl}/${lightIcon}`,
    match,
    permission
  };
}

/***/ }),

/***/ 61694:
/*!*********************************************!*\
  !*** ./src/app/view/view-routing.module.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewRoutingModule: () => (/* binding */ ViewRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _view_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view.component */ 3432);





const DefaultLandingGuard = () => {
  const router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router);
  let roles = [];
  try {
    roles = JSON.parse(localStorage.getItem('userData') || '{}')?.role || [];
  } catch {
    localStorage.removeItem('userData');
    return router.parseUrl('/auth/sign-in');
  }
  return roles.includes('standard') || roles.includes('power') ? router.parseUrl('/home') : router.parseUrl('/dashboard');
};
const routes = [{
  path: '',
  component: _view_component__WEBPACK_IMPORTED_MODULE_0__.ViewComponent,
  children: [{
    path: '',
    pathMatch: 'full',
    canActivate: [DefaultLandingGuard],
    component: _view_component__WEBPACK_IMPORTED_MODULE_0__.ViewComponent
  },
  // Flat URLs are intentional; keep user/admin top-level child paths unique.
  {
    path: '',
    loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-node_modules_ng2-charts_fesm2020_ng2-charts_mjs"), __webpack_require__.e("default-src_app_core_guards_permission_guard_ts-src_app_shared_components_form-dropdown_form--119cde"), __webpack_require__.e("common"), __webpack_require__.e("src_app_view_user_user_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./user/user.module */ 10723)).then(m => m.UserModule)
  }, {
    path: '',
    loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("default-src_app_shared_services_docx-utility_service_ts-src_app_shared_utility_animations_uti-48fa82"), __webpack_require__.e("default-src_app_view_user_content-generation_content-generation_module_ts"), __webpack_require__.e("default-src_app_core_guards_permission_guard_ts-src_app_shared_components_form-dropdown_form--119cde"), __webpack_require__.e("src_app_view_admin_admin_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./admin/admin.module */ 17743)).then(m => m.AdminModule)
  }]
}];
class ViewRoutingModule {
  static {
    this.ɵfac = function ViewRoutingModule_Factory(t) {
      return new (t || ViewRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: ViewRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](ViewRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
  });
})();

/***/ }),

/***/ 3432:
/*!****************************************!*\
  !*** ./src/app/view/view.component.ts ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewComponent: () => (/* binding */ ViewComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _layout_content_layout_content_layout_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../layout/content-layout/content-layout.component */ 98521);


class ViewComponent {
  static {
    this.ɵfac = function ViewComponent_Factory(t) {
      return new (t || ViewComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: ViewComponent,
      selectors: [["app-view"]],
      decls: 1,
      vars: 0,
      template: function ViewComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "app-content-layout");
        }
      },
      dependencies: [_layout_content_layout_content_layout_component__WEBPACK_IMPORTED_MODULE_0__.ContentLayoutComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 42599:
/*!*************************************!*\
  !*** ./src/app/view/view.module.ts ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ViewModule: () => (/* binding */ ViewModule)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _view_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./view.component */ 3432);
/* harmony import */ var _view_routing_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./view-routing.module */ 61694);
/* harmony import */ var _layout_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../layout/sidebar/sidebar.component */ 30755);
/* harmony import */ var _layout_content_layout_content_layout_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../layout/content-layout/content-layout.component */ 98521);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/components/language-switcher/language-switcher.component */ 5429);
/* harmony import */ var _layout_header_header_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../layout/header/header.component */ 60679);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/components/profile-image/profile-image.component */ 85445);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);











class ViewModule {
  static {
    this.ɵfac = function ViewModule_Factory(t) {
      return new (t || ViewModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({
      type: ViewModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _view_routing_module__WEBPACK_IMPORTED_MODULE_1__.ViewRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__.TranslateModule, _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__.LanguageSwitcherComponent, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__.DeleteDetailComponent, _shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_7__.ProfileImageComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](ViewModule, {
    declarations: [_layout_sidebar_sidebar_component__WEBPACK_IMPORTED_MODULE_2__.SidebarComponent, _layout_header_header_component__WEBPACK_IMPORTED_MODULE_5__.HeaderComponent, _layout_content_layout_content_layout_component__WEBPACK_IMPORTED_MODULE_3__.ContentLayoutComponent, _view_component__WEBPACK_IMPORTED_MODULE_0__.ViewComponent],
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.CommonModule, _view_routing_module__WEBPACK_IMPORTED_MODULE_1__.ViewRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_10__.TranslateModule, _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__.LanguageSwitcherComponent, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__.DeleteDetailComponent, _shared_components_profile_image_profile_image_component__WEBPACK_IMPORTED_MODULE_7__.ProfileImageComponent]
  });
})();

/***/ })

}]);
//# sourceMappingURL=src_app_view_view_module_ts.b58e4297a43a1e0d.js.map