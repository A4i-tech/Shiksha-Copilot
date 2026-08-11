"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["main"],{

/***/ 94114:
/*!***************************************!*\
  !*** ./src/app/app-routing.module.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppRoutingModule: () => (/* binding */ AppRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/guards/auth.guard */ 34978);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);




const routes = [{
  path: 'auth',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_auth_auth_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./auth/auth.module */ 60841)).then(m => m.AuthModule)
}, {
  path: 'faq',
  loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_components_faq_faq_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./components/faq/faq.component */ 59613)).then(c => c.FaqComponent)
}, {
  path: 'error/503',
  loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_components_service-unavailable_service-unavailable_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./components/service-unavailable/service-unavailable.component */ 87045)).then(c => c.ServiceUnavailableComponent)
}, {
  path: '',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_view_view_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./view/view.module */ 42599)).then(m => m.ViewModule),
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
}, {
  path: '**',
  loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_components_page-not-found_page-not-found_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./components/page-not-found/page-not-found.component */ 83999)).then(c => c.PageNotFoundComponent)
}];
class AppRoutingModule {
  static {
    this.ɵfac = function AppRoutingModule_Factory(t) {
      return new (t || AppRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineNgModule"]({
      type: AppRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule.forRoot(routes, {
        useHash: true
      }), _angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsetNgModuleScope"](AppRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__.RouterModule]
  });
})();

/***/ }),

/***/ 20092:
/*!**********************************!*\
  !*** ./src/app/app.component.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppComponent: () => (/* binding */ AppComponent)
/* harmony export */ });
/* harmony import */ var _shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shared/utility/constant.util */ 64487);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _auth_sign_in_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./auth/sign-in.service */ 44283);
/* harmony import */ var _core_services_utility_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/services/utility.service */ 8128);
/* harmony import */ var _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/services/authorization.service */ 70581);
/* harmony import */ var _core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/services/loader-message.service */ 79365);
/* harmony import */ var _shared_services_idle_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shared/services/idle.service */ 7628);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ngx-spinner */ 61249);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngx-translate/core */ 90852);












const _c0 = function (a4) {
  return {
    heading: "Idle Time",
    confirmationText: "idle message",
    primaryButtonLabel: "Continue",
    primaryButtonType: "logout",
    idleTime: a4
  };
};
function AppComponent_app_delete_detail_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "app-delete-detail", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵlistener"]("close", function AppComponent_app_delete_detail_9_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵrestoreView"](_r2);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵresetView"](ctx_r1.closeModal($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpureFunction1"](2, _c0, ctx_r0.idleTime))("showCancelBtn", false);
  }
}
class AppComponent {
  constructor(authService, utilityService, authorizationService, loaderMessage, idleService, router) {
    this.authService = authService;
    this.utilityService = utilityService;
    this.authorizationService = authorizationService;
    this.loaderMessage = loaderMessage;
    this.idleService = idleService;
    this.router = router;
    this.title = 'shiksha-frontend';
    this.showIdleWarning = false;
    this.idleTime = Math.round((_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.IDLE_WARNING_THRESHOLD + _shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.IDLE_START_THRESHOLD) / 60);
    this.clipboardObserver = null;
    this.handleBeforeUnload = () => this.idleService.stopWatching();
  }
  ngOnInit() {
    // ngx-clipboard injects a hidden utility textarea. aria-hidden="true" alone removes
    // it from the a11y tree (an aria-label on a hidden element is never announced).
    const patchClipboardTextareas = () => {
      document.querySelectorAll('textarea').forEach(textarea => {
        if (!textarea.hasAttribute('aria-hidden') && textarea.style.opacity === '0') {
          textarea.setAttribute('aria-hidden', 'true');
        }
      });
    };
    this.clipboardObserver = new MutationObserver(patchClipboardTextareas);
    this.clipboardObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
    patchClipboardTextareas(); // initial scan: observer only fires on future mutations
    this.idleService.idleIndicator.subscribe({
      next: () => {
        this.showIdleWarning = true;
      }
    });
    if (this.authorizationService.isLoggedIn()) {
      this.authService.authMe().subscribe({
        next: res => {
          const user = {
            ...res.data.user,
            permissions: res.data.permissions,
            _sessionVersion: _shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.SESSION_VERSION
          };
          localStorage.setItem('userData', JSON.stringify(user));
          if (this.router.url === '/error/503') this.router.navigateByUrl('/');
        },
        error: err => {
          if (err.status === 0 || err.status >= 500) this.router.navigate(['/error/503']);else this.utilityService.handleError(err);
        }
      });
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload);
  }
  // ------ Idle modal close ------
  closeModal(val) {
    if (val !== 'close') {
      this.idleService.startWatching();
    }
    this.showIdleWarning = false;
  }
  ngOnDestroy() {
    this.clipboardObserver?.disconnect();
    window.removeEventListener('beforeunload', this.handleBeforeUnload);
  }
  static {
    this.ɵfac = function AppComponent_Factory(t) {
      return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_auth_sign_in_service__WEBPACK_IMPORTED_MODULE_1__.SignInService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_utility_service__WEBPACK_IMPORTED_MODULE_2__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_authorization_service__WEBPACK_IMPORTED_MODULE_3__.AuthorizationService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_4__.LoaderMessageService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_shared_services_idle_service__WEBPACK_IMPORTED_MODULE_5__.IdleService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_8__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 10,
      vars: 6,
      consts: [["role", "region", "aria-label", "Skip navigation and loading status"], ["href", "#main-content", 1, "sr-only", "focus:not-sr-only", "focus:fixed", "focus:top-2", "focus:left-2", "focus:z-50", "focus:px-4", "focus:py-2", "focus:bg-white", "focus:border", "focus:border-primary", "focus:rounded", "focus:shadow-lg"], ["data-testid", "loading-spinner", "bdColor", "rgba(255, 255, 255, 0.92)", "size", "medium", "color", "#46A0F1", "type", "ball-scale-multiple"], [1, "text-gray-800", "text-sm"], [3, "config", "showCancelBtn", "close", 4, "ngIf"], [3, "config", "showCancelBtn", "close"]],
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](0, "div", 0)(1, "a", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](2, " Skip to main content ");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementStart"](3, "ngx-spinner", 2)(4, "p", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtext"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](6, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipe"](7, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵelement"](8, "router-outlet");
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtemplate"](9, AppComponent_app_delete_detail_9_Template, 1, 4, "app-delete-detail", 4);
        }
        if (rf & 2) {
          let tmp_0_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](6, 2, (tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵpipeBind1"](7, 4, ctx.loaderMessage.message$)) !== null && tmp_0_0 !== undefined ? tmp_0_0 : ""));
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵproperty"]("ngIf", ctx.showIdleWarning);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_9__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_8__.RouterOutlet, ngx_spinner__WEBPACK_IMPORTED_MODULE_10__.NgxSpinnerComponent, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_6__.DeleteDetailComponent, _angular_common__WEBPACK_IMPORTED_MODULE_9__.AsyncPipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslatePipe],
      styles: ["/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJhcHAuY29tcG9uZW50LnNjc3MifQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvYXBwLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFDQSxnS0FBZ0siLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ }),

/***/ 50635:
/*!*******************************!*\
  !*** ./src/app/app.module.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AppModule: () => (/* binding */ AppModule)
/* harmony export */ });
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! @angular/platform-browser */ 80436);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 94114);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 20092);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var _core_interceptors_http_config_interceptor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/interceptors/http-config.interceptor */ 88581);
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ngx-spinner */ 61249);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/platform-browser/animations */ 43835);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _shared_utility_common_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/utility/common.util */ 83940);
/* harmony import */ var _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/components/language-switcher/language-switcher.component */ 5429);
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_28__ = __webpack_require__(/*! ngx-toastr */ 96371);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ng_idle_core__WEBPACK_IMPORTED_MODULE_29__ = __webpack_require__(/*! @ng-idle/core */ 87491);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/dialog */ 12587);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/form-field */ 24950);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/input */ 95541);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/checkbox */ 97024);
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/radio */ 53804);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/select */ 25175);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @angular/material/icon */ 93840);
/* harmony import */ var _shared_components_baseline_survey_baseline_survey_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shared/components/baseline-survey/baseline-survey.component */ 74589);
/* harmony import */ var _shared_components_endline_survey_endline_survey_component__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./shared/components/endline-survey/endline-survey.component */ 635);
/* harmony import */ var _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./shared/components/dropdown/dropdown.component */ 62157);
/* harmony import */ var _core_services_baseline_survey_dialog_service__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./core/services/baseline-survey-dialog.service */ 66235);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 37580);















// Material










// Components



// Services





class AppModule {
  /**
   * Class constructor
   * @param translateService
   */
  constructor(translateService) {
    this.translateService = translateService;
    const data = localStorage.getItem('userData') ?? '';
    if (data) {
      const loggedInUser = JSON.parse(data);
      this.translateService.use(loggedInUser.preferredLanguage);
    }
  }
  static {
    this.ɵfac = function AppModule_Factory(t) {
      return new (t || AppModule)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵinject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslateService));
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineInjector"]({
      providers: [{
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HTTP_INTERCEPTORS,
        useClass: _core_interceptors_http_config_interceptor__WEBPACK_IMPORTED_MODULE_2__.HttpConfigInterceptor,
        multi: true
      }, _angular_common__WEBPACK_IMPORTED_MODULE_13__.DatePipe, _core_services_baseline_survey_dialog_service__WEBPACK_IMPORTED_MODULE_9__.BaselineSurveyDialogService],
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_15__.BrowserAnimationsModule, ngx_spinner__WEBPACK_IMPORTED_MODULE_16__.NgxSpinnerModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_17__.ReactiveFormsModule,
      // Material
      _angular_material_dialog__WEBPACK_IMPORTED_MODULE_18__.MatDialogModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_19__.MatButtonModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_20__.MatFormFieldModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_21__.MatInputModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_22__.MatCheckboxModule, _angular_material_radio__WEBPACK_IMPORTED_MODULE_23__.MatRadioModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_24__.MatSelectModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_25__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_26__.MatProgressSpinnerModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_27__.MatIconModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslateModule.forRoot({
        loader: {
          provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslateLoader,
          useFactory: _shared_utility_common_util__WEBPACK_IMPORTED_MODULE_3__.HttpLoaderFactory,
          deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HttpClient]
        }
      }), _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__.LanguageSwitcherComponent, _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_8__.DropdownComponent, ngx_toastr__WEBPACK_IMPORTED_MODULE_28__.ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: 'toast-bottom-right'
      }), _ng_idle_core__WEBPACK_IMPORTED_MODULE_29__.NgIdleModule.forRoot(), _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_5__.DeleteDetailComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _shared_components_baseline_survey_baseline_survey_component__WEBPACK_IMPORTED_MODULE_6__.BaselineSurveyComponent, _shared_components_endline_survey_endline_survey_component__WEBPACK_IMPORTED_MODULE_7__.EndlineSurveyComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_14__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_15__.BrowserAnimationsModule, ngx_spinner__WEBPACK_IMPORTED_MODULE_16__.NgxSpinnerModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_12__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_17__.ReactiveFormsModule,
    // Material
    _angular_material_dialog__WEBPACK_IMPORTED_MODULE_18__.MatDialogModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_19__.MatButtonModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_20__.MatFormFieldModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_21__.MatInputModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_22__.MatCheckboxModule, _angular_material_radio__WEBPACK_IMPORTED_MODULE_23__.MatRadioModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_24__.MatSelectModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_25__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_26__.MatProgressSpinnerModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_27__.MatIconModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_11__.TranslateModule, _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__.LanguageSwitcherComponent, _shared_components_dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_8__.DropdownComponent, ngx_toastr__WEBPACK_IMPORTED_MODULE_28__.ToastrModule, _ng_idle_core__WEBPACK_IMPORTED_MODULE_29__.NgIdleModule, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_5__.DeleteDetailComponent]
  });
})();

/***/ }),

/***/ 44283:
/*!*****************************************!*\
  !*** ./src/app/auth/sign-in.service.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SignInService: () => (/* binding */ SignInService)
/* harmony export */ });
/* harmony import */ var _core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../core/services/base-rest.service */ 32146);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 46443);




class SignInService extends _core_services_base_rest_service__WEBPACK_IMPORTED_MODULE_0__.BaseRestService {
  /**
   * Class constructor
   * @param http
   */
  constructor(http) {
    super(http);
    this.baseUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl;
    this.setUri('auth');
  }
  /**
   * send the phone number to validate
   * Backend auto-detects user type (Admin or Teacher) from phone number
   * @param mobile_number
   * @returns
   */
  validateMobileNumber(reqBody) {
    return this.post(`get-otp`, reqBody);
  }
  /**
   * validate the otp values
   * Backend auto-detects user type (Admin or Teacher) from phone number
   * @param otpval
   * @param phoneNumber
   * @returns
   */
  validateOTP(otpval, phoneNumber, captchaToken, recovery = false) {
    return this.post(`validate-otp`, {
      phone: phoneNumber,
      otp: otpval,
      ...(captchaToken && {
        captchaToken
      }),
      ...(recovery && {
        recovery
      })
    });
  }
  /**
   * Auth me
   * @returns
   */
  authMe() {
    return this.get('me');
  }
  static {
    this.ɵfac = function SignInService_Factory(t) {
      return new (t || SignInService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: SignInService,
      factory: SignInService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 34978:
/*!*******************************************!*\
  !*** ./src/app/core/guards/auth.guard.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthGuard: () => (/* binding */ AuthGuard)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _services_authorization_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/authorization.service */ 70581);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);




const AuthGuard = (route, state) => {
  const router = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router);
  const authorizationService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_services_authorization_service__WEBPACK_IMPORTED_MODULE_0__.AuthorizationService);
  if (authorizationService.isLoggedIn()) return true;
  localStorage.clear();
  return router.parseUrl(src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.LOGIN_ROUTE);
};

/***/ }),

/***/ 88581:
/*!**************************************************************!*\
  !*** ./src/app/core/interceptors/http-config.interceptor.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpConfigInterceptor: () => (/* binding */ HttpConfigInterceptor)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 61318);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 77919);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! rxjs */ 89475);
/* harmony import */ var _services_loader_message_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../services/loader-message.service */ 79365);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ngx-spinner */ 61249);
/* harmony import */ var _services_utility_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/utility.service */ 8128);
/* harmony import */ var _services_authorization_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/authorization.service */ 70581);








class HttpConfigInterceptor {
  /**
   * Class constructor
   * @param spinner NgxSpinnerService
   * @param utilityService UtilityService
   * @param authorizationService AuthorizationService
   */
  constructor(spinner, utilityService, authorizationService, loaderMessage) {
    this.spinner = spinner;
    this.utilityService = utilityService;
    this.authorizationService = authorizationService;
    this.loaderMessage = loaderMessage;
    this.pendingRequests = 0;
  }
  intercept(request, next) {
    this.pendingRequests += 1;
    if (!src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.LOADER_RESTRICTED_URLS.some(api => request.url.includes(api))) {
      this.loaderMessage.set(request.context.get(_services_loader_message_service__WEBPACK_IMPORTED_MODULE_0__.LOADER_MESSAGE));
    }
    if (this.pendingRequests === 1 && !src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.LOADER_RESTRICTED_URLS.some(api => request.url.includes(api))) {
      this.spinner.show();
    }
    const token = localStorage.getItem('token');
    const headers = {
      authorization: `${token}`
    };
    const authReq = request.clone({
      setHeaders: headers
    });
    return next.handle(authReq).pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.catchError)(error => {
      if (error.status === 401 && this.authorizationService.isLoggedIn()) {
        this.utilityService.logout();
      }
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.throwError)(() => error);
    }), (0,rxjs__WEBPACK_IMPORTED_MODULE_6__.finalize)(() => {
      this.pendingRequests -= 1;
      if (this.pendingRequests === 0) {
        this.spinner.hide();
        this.loaderMessage.set();
      }
    }));
  }
  static {
    this.ɵfac = function HttpConfigInterceptor_Factory(t) {
      return new (t || HttpConfigInterceptor)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](ngx_spinner__WEBPACK_IMPORTED_MODULE_8__.NgxSpinnerService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_services_utility_service__WEBPACK_IMPORTED_MODULE_2__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_services_authorization_service__WEBPACK_IMPORTED_MODULE_3__.AuthorizationService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_services_loader_message_service__WEBPACK_IMPORTED_MODULE_0__.LoaderMessageService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjectable"]({
      token: HttpConfigInterceptor,
      factory: HttpConfigInterceptor.ɵfac
    });
  }
}

/***/ }),

/***/ 70581:
/*!********************************************************!*\
  !*** ./src/app/core/services/authorization.service.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AuthorizationService: () => (/* binding */ AuthorizationService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/utility/constant.util */ 64487);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/router */ 95072);




class AuthorizationService {
  /**
   * Class constructor
   * @param router
   */
  constructor(router) {
    this.router = router;
    /**
     * subject which results true false based on user login information
     */
    this.loggedIn = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(false);
    this.loggedIn.next(this.isLoggedIn());
  }
  /**
   * Method to check if the user is logged in
   * @returns boolean
   */
  isLoggedIn() {
    const token = this.getLocalStorageItem('token');
    const userData = this.getLocalStorageItem('userData');
    return !!token && !!userData && JSON.parse(userData)._sessionVersion === src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.SESSION_VERSION;
  }
  /**
   * Method to get the current login status as an Observable
   * @returns Observable
   */
  getLoggedInStatus() {
    return this.loggedIn.asObservable();
  }
  /**
   * Method to set a value in localStorage
   * @param key
   * @param value
   */
  setLocalStorageItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }
  /**
   * Method to get a value from localStorage
   * @param key
   * @returns
   */
  getLocalStorageItem(key) {
    const value = localStorage.getItem(key);
    return value;
  }
  /**
   * Method to remove a value from localStorage
   * @param key
   */
  removeLocalStorageItem(key) {
    localStorage.removeItem(key);
  }
  /**
   * Method to set token to localstorage
   * @param token
   */
  setToken(token) {
    this.setLocalStorageItem('token', token);
    this.loggedIn.next(true);
    this.router.navigate(['/']);
  }
  /**
   * Method to perform logout
   */
  logout() {
    this.removeLocalStorageItem('token');
    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }
  static {
    this.ɵfac = function AuthorizationService_Factory(t) {
      return new (t || AuthorizationService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__.Router));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: AuthorizationService,
      factory: AuthorizationService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 32146:
/*!****************************************************!*\
  !*** ./src/app/core/services/base-rest.service.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaseRestService: () => (/* binding */ BaseRestService)
/* harmony export */ });
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);



class BaseRestService {
  /**
   * Class constructor
   * @param http
   */
  constructor(http) {
    this.http = http;
    this.apiUrl = src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl;
    this.apiUri = '';
  }
  /**
   * Method to make get request
   * @param url
   * @param params
   * @returns
   */
  get(url, params) {
    return this.http.get(`${this.getUrl()}${url}`, {
      params
    });
  }
  /**
   * Method to make post request
   * @param url
   * @param body
   * @returns
   */
  post(url, body) {
    return this.http.post(`${this.getUrl()}${url}`, body);
  }
  /**
   * Method to make put request
   * @param url
   * @param body
   * @returns
   */
  put(url, body) {
    return this.http.put(`${this.getUrl()}${url}`, body);
  }
  /**
   * Method to make patch request
   * @param url
   * @param body
   * @returns
   */
  patch(url, body) {
    return this.http.patch(`${this.getUrl()}${url}`, body);
  }
  /**
   * Method to make delete request
   * @param url
   * @returns
   */
  delete(url) {
    return this.http.delete(`${this.getUrl()}${url}`);
  }
  /**
   * Method to set uri, when this class is extended use this method to set the uri or module name
   * @param uri
   */
  setUri(uri) {
    this.apiUri = uri;
  }
  /**
   * Method to get base url attached with uri
   * @returns
   */
  getUrl() {
    let url = `${this.apiUrl}/${this.apiUri}/`;
    return url;
  }
  static {
    this.ɵfac = function BaseRestService_Factory(t) {
      return new (t || BaseRestService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: BaseRestService,
      factory: BaseRestService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 66235:
/*!*****************************************************************!*\
  !*** ./src/app/core/services/baseline-survey-dialog.service.ts ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaselineSurveyDialogService: () => (/* binding */ BaselineSurveyDialogService)
/* harmony export */ });
/* harmony import */ var _home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/dialog */ 12587);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var src_app_shared_components_baseline_survey_baseline_survey_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/components/baseline-survey/baseline-survey.component */ 74589);
/* harmony import */ var _baseline_survey_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./baseline-survey.service */ 91296);







class BaselineSurveyDialogService {
  constructor() {
    this.dialog = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.inject)(_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialog);
    this.surveyService = (0,_angular_core__WEBPACK_IMPORTED_MODULE_3__.inject)(_baseline_survey_service__WEBPACK_IMPORTED_MODULE_2__.BaselineSurveyService);
  }
  /**
   * Opens the baseline survey dialog.
   * @param force - if true, Remind Me Later button is hidden (mandatory)
   * @param remindLaterCount - current remind count passed into the dialog
   * @param maxReminders - max allowed reminders (from API)
   * @returns Promise resolving to:
   * - `true` if survey submitted/completed
   * - `'remind'` if user selected "Remind me later"
   * - `false` if closed or failed to open otherwise
   */
  openSurvey() {
    var _this = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (force = false, remindLaterCount = 0, maxReminders = 3) {
      // Prevent stacking multiple instances of the baseline survey dialog
      const isOpen = _this.dialog.openDialogs.some(d => d.componentInstance instanceof src_app_shared_components_baseline_survey_baseline_survey_component__WEBPACK_IMPORTED_MODULE_1__.BaselineSurveyComponent);
      if (isOpen) {
        return false;
      }
      const ref = _this.dialog.open(src_app_shared_components_baseline_survey_baseline_survey_component__WEBPACK_IMPORTED_MODULE_1__.BaselineSurveyComponent, {
        width: '720px',
        maxWidth: '95vw',
        disableClose: true,
        closeOnNavigation: false,
        autoFocus: true,
        ariaLabel: 'Baseline survey',
        data: {
          force,
          isMandatory: force,
          remindLaterCount,
          maxReminders
        }
      });
      const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_5__.firstValueFrom)(ref.afterClosed());
      if (result === true) {
        _this.surveyService.setCompleted(true);
        return true;
      } else if (result === 'remind') {
        return 'remind';
      }
      // Unexpected close (error, null, etc.) — do NOT dismiss for session
      return false;
    }).apply(this, arguments);
  }
  static {
    this.ɵfac = function BaselineSurveyDialogService_Factory(t) {
      return new (t || BaselineSurveyDialogService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjectable"]({
      token: BaselineSurveyDialogService,
      factory: BaselineSurveyDialogService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 91296:
/*!**********************************************************!*\
  !*** ./src/app/core/services/baseline-survey.service.ts ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaselineSurveyService: () => (/* binding */ BaselineSurveyService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 59452);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! rxjs/operators */ 70271);
/* harmony import */ var rxjs_operators__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs/operators */ 61318);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common/http */ 46443);





class BaselineSurveyService {
  constructor(http) {
    this.http = http;
    this.baseUrl = `${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/baseline-surveys`;
    this.surveyCompleted = null;
    this.cachedUserId = null;
    this.dismissedInSession = false;
  }
  isDismissed() {
    return this.dismissedInSession;
  }
  setDismissed(val) {
    this.dismissedInSession = val;
  }
  setCompleted(val) {
    this.surveyCompleted = val;
  }
  /** Call this on login to reset all session-level caches */
  resetSession() {
    this.dismissedInSession = false;
    this.surveyCompleted = null;
    this.cachedUserId = null;
  }
  getUserId() {
    try {
      const stored = localStorage.getItem('userData');
      return stored ? JSON.parse(stored)?._id || null : null;
    } catch {
      return null;
    }
  }
  resetCacheIfNeeded(userId) {
    if (!userId) {
      this.cachedUserId = null;
      this.surveyCompleted = null;
      this.dismissedInSession = false;
      return;
    }
    if (userId !== this.cachedUserId) {
      this.cachedUserId = userId;
      this.surveyCompleted = null;
      this.dismissedInSession = false;
    }
  }
  checkCompleted() {
    const uid = this.getUserId();
    this.resetCacheIfNeeded(uid);
    if (this.surveyCompleted === true) {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)({
        success: true,
        data: {
          completed: true,
          remindLaterCount: 0,
          isMandatory: false,
          maxReminders: 0
        }
      });
    }
    return this.http.get(`${this.baseUrl}/check`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(res => {
      const completed = !!res?.data?.completed;
      this.surveyCompleted = completed;
      return {
        success: !!res?.success,
        data: {
          completed,
          remindLaterCount: res?.data?.remindLaterCount ?? 0,
          isMandatory: !!res?.data?.isMandatory,
          maxReminders: res?.data?.maxReminders ?? 0
        }
      };
    }));
  }
  submitSurvey(surveyData) {
    return this.http.post(this.baseUrl, surveyData).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(response => {
      if (response.success) {
        const uid = this.getUserId();
        this.resetCacheIfNeeded(uid);
        this.surveyCompleted = true;
      }
      return response;
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      if (error?.status === 409) {
        const uid = this.getUserId();
        this.resetCacheIfNeeded(uid);
        this.surveyCompleted = true;
        return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)({
          success: true,
          message: 'Already submitted'
        });
      }
      console.error('Error submitting survey:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)({
        success: false,
        message: 'Failed to submit survey'
      });
    }));
  }
  remindLater() {
    return this.http.patch(`${this.baseUrl}/remind-later`, {}).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error('Error recording remind later:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)({
        success: false
      });
    }));
  }
  static {
    this.ɵfac = function BaselineSurveyService_Factory(t) {
      return new (t || BaselineSurveyService)(_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_5__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_4__["ɵɵdefineInjectable"]({
      token: BaselineSurveyService,
      factory: BaselineSurveyService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 62048:
/*!*********************************************************!*\
  !*** ./src/app/core/services/endline-survey.service.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EndlineSurveyService: () => (/* binding */ EndlineSurveyService)
/* harmony export */ });
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common/http */ 46443);



class EndlineSurveyService {
  constructor(http) {
    this.http = http;
    this.url = `${src_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/endline-surveys`;
  }
  checkStatus() {
    return this.http.get(`${this.url}/check`);
  }
  submitSurvey(data) {
    return this.http.post(this.url, data);
  }
  static {
    this.ɵfac = function EndlineSurveyService_Factory(t) {
      return new (t || EndlineSurveyService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_2__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: EndlineSurveyService,
      factory: EndlineSurveyService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 79365:
/*!*********************************************************!*\
  !*** ./src/app/core/services/loader-message.service.ts ***!
  \*********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LOADER_MESSAGE: () => (/* binding */ LOADER_MESSAGE),
/* harmony export */   LoaderMessageService: () => (/* binding */ LoaderMessageService)
/* harmony export */ });
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);



const DEFAULT_LOADER_MESSAGE = 'Loading...';
const LOADER_MESSAGE = new _angular_common_http__WEBPACK_IMPORTED_MODULE_0__.HttpContextToken(() => null);
class LoaderMessageService {
  constructor() {
    this.message$ = new rxjs__WEBPACK_IMPORTED_MODULE_1__.BehaviorSubject(DEFAULT_LOADER_MESSAGE);
  }
  set(message) {
    this.message$.next(message ?? DEFAULT_LOADER_MESSAGE);
  }
  static {
    this.ɵfac = function LoaderMessageService_Factory(t) {
      return new (t || LoaderMessageService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: LoaderMessageService,
      factory: LoaderMessageService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 8128:
/*!**************************************************!*\
  !*** ./src/app/core/services/utility.service.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UtilityService: () => (/* binding */ UtilityService)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var marked__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! marked */ 60997);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ngx-toastr */ 96371);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/platform-browser */ 80436);
/* harmony import */ var ngx_clipboard__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ngx-clipboard */ 46881);








class UtilityService {
  /**
   * Class constructor
   * @param toastr ToastrService
   */
  constructor(toastr, datePipe, router, domSanitizer, clipboardService) {
    this.toastr = toastr;
    this.datePipe = datePipe;
    this.router = router;
    this.domSanitizer = domSanitizer;
    this.clipboardService = clipboardService;
    this.regexPattern = {
      phoneRegex: /^[6789]\d{9}$/,
      emailRegex: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,8}$/
    };
    // constructor
  }

  get loggedInUserData() {
    const userInfo = localStorage.getItem('userData');
    return userInfo ? JSON.parse(userInfo) : null;
  }
  /**
   * Function to handle response and show toaster
   * @param res response
   */
  handleResponse(res) {
    if (res.success) {
      this.showSuccess(res.message);
    }
  }
  /**
   * Function to error response and show toaster
   * @param err error
   */
  handleError(err) {
    if (Array.isArray(err.error?.error)) return this.showError(err.error.error.join(', '));
    const fallback = err.status === 401 ? 'Unauthorized. Please login again.' : err.status >= 500 ? 'Server error. Please try again later.' : 'An error occurred. Please try again.';
    this.showError(err.error?.message || err.error?.error || fallback);
  }
  /**
   * Function to show success toaster
   * @param message
   */
  showSuccess(message) {
    this.toastr.success(message);
  }
  /**
   * Function to show error toaster
   * @param message
   */
  showError(message) {
    this.toastr.error(message);
    const container = document.querySelector('.toast-container');
    container?.setAttribute('aria-live', 'assertive');
  }
  /**
   * Function to show warning toaster
   * @param message
   */
  showWarning(message) {
    this.toastr.info(message);
  }
  /**
   * Function to check permission
   * @param premissions
   * @returns
   */
  hasPermission(permissions) {
    return permissions.some(permission => this.getPermission(permission));
  }
  getPermission(permission) {
    const user = this.loggedInUserData;
    if (!user) return null;
    const grants = user.permissions.filter(grant => grant.permission === permission);
    return grants.length ? grants : null;
  }
  hasGlobalPermission(permission) {
    return this.getPermission(permission)?.some(grant => grant.scopeType === 'GLOBAL') === true;
  }
  /**
   * Function to vaidate array of object of classes
   * @param array
   * @returns
   */
  validateArray(array) {
    for (const obj of array) {
      for (const key in obj) {
        const value = obj[key];
        if (value === null || value === '' || Array.isArray(value) && !this.validateArray(value)) {
          return false;
        }
      }
    }
    return true;
  }
  /**
   * Function to remove keys form object and create new obj
   * @param obj
   * @param keysToRemove
   * @returns
   */
  removeKeys(obj, keysToRemove) {
    const removedObj = {};
    const newObj = {};
    for (const key in obj) {
      if (keysToRemove.includes(key)) {
        removedObj[key] = obj[key];
      } else {
        newObj[key] = obj[key];
      }
    }
    return {
      newObj,
      removedObj
    };
  }
  /**
   * Function to filter data for dropdown
   * @param filterArr
   * @param filterCriteria
   * @param filterValue
   * @returns
   */
  filterDropdownValues(filterArr, filterCriteria, filterValue) {
    return filterArr.filter(val => val[filterCriteria] === filterValue)[0];
  }
  formateDate(dateTime) {
    if (dateTime) {
      return {
        ...dateTime,
        date: this.datePipe.transform(dateTime.date, 'yyyy-MM-dd')
      };
    } else {
      return {};
    }
  }
  formatValue(value) {
    if (typeof value === 'string') {
      return value;
    } else if (Array.isArray(value)) {
      return value.join(', ');
    } else {
      return '';
    }
  }
  /**
  * format the response to the one format which don't contain the repeated board
  * @param val
  * @returns
  */
  formatResponse(val) {
    const groupedData = [];
    val.forEach(item => {
      const {
        board,
        medium,
        class: classValue,
        ...itemWithoutBoardMediumClass
      } = item;
      let boardEntry = groupedData.find(entry => entry.board === board);
      if (!boardEntry) {
        boardEntry = {
          board: board,
          mediums: []
        };
        groupedData.push(boardEntry);
      }
      let mediumEntry = boardEntry.mediums.find(entry => entry.medium === medium);
      if (!mediumEntry) {
        mediumEntry = {
          medium: medium,
          classes: []
        };
        boardEntry.mediums.push(mediumEntry);
      }
      let classEntry = mediumEntry.classes.find(entry => entry.class === classValue);
      if (!classEntry) {
        classEntry = {
          class: classValue,
          data: []
        };
        mediumEntry.classes.push(classEntry);
      }
      classEntry.data.push(itemWithoutBoardMediumClass);
    });
    return groupedData;
  }
  /**
   * Function to reset array values
   * @param arr array
   * @param indexToIgnore ingnore index
   * @returns boolean array
   */
  resetArrayIfTrueInBetween(arr, indexToIgnore) {
    let encounteredTrue = false;
    for (let i = 0; i < arr.length; i++) {
      if (i !== indexToIgnore) {
        if (arr[i] === true) {
          encounteredTrue = true;
        }
        if (encounteredTrue) {
          arr[i] = false;
        }
      }
    }
    return arr;
  }
  setResourceDetailsValue(facilityControl, resourceDetailsDropdown, i, val) {
    facilityControl.get('details')?.setValue([]);
    facilityControl.get('otherType')?.reset();
    resourceDetailsDropdown[i] = [];
    if (val) {
      if (val.type === 'Others') {
        facilityControl.get('typeChipSet')?.setValue(false);
        facilityControl.get('detailsChipSet')?.setValue(false);
        facilityControl.get('otherType')?.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required);
        facilityControl.get('otherType')?.updateValueAndValidity();
      } else {
        facilityControl.get('typeChipSet')?.setValue(true);
        facilityControl.get('detailsChipSet')?.setValue(true);
        facilityControl.get('otherType')?.clearValidators();
        facilityControl.get('otherType')?.updateValueAndValidity();
        resourceDetailsDropdown[i] = [...val.facilities];
      }
      facilityControl.get('details')?.setValidators(_angular_forms__WEBPACK_IMPORTED_MODULE_1__.Validators.required);
      facilityControl.get('details')?.updateValueAndValidity();
    } else {
      facilityControl.get('details')?.clearValidators();
      facilityControl.get('details')?.updateValueAndValidity();
      facilityControl.get('otherType')?.clearValidators();
      facilityControl.get('otherType')?.updateValueAndValidity();
    }
  }
  /**
   * Function to remove empty objects
   * @param arr
   * @returns
   */
  removeEmptyObjects(arr) {
    return arr.filter(obj => {
      return !Object.values(obj).every(value => {
        if (typeof value === 'string') {
          return value.trim() === '';
        } else {
          return value === null || value === undefined;
        }
      });
    });
  }
  /**
   * Function to remove empty type object
   * @param arr
   * @returns
   */
  removeObjectsWithEmptyType(arr) {
    return arr.filter(obj => obj.type !== null && obj.type !== undefined && obj.type !== '');
  }
  /**
   * Function to check duplicates in array of objects
   * @param arr
   * @returns
   */
  hasDuplicates(arr) {
    const seen = new Set();
    for (const obj of arr) {
      const objString = JSON.stringify(obj);
      if (seen.has(objString)) {
        return true;
      } else {
        seen.add(objString);
      }
    }
    return false;
  }
  /**
    * Function to check duplicate board and medium
    * @param array
    * @returns
    */
  hasDuplicateBoardMedium(array) {
    let seen = new Set();
    for (let obj of array) {
      let key = obj['board'] + '|' + obj['medium'];
      if (seen.has(key)) {
        return true;
      }
      seen.add(key);
    }
    return false;
  }
  /**
   * function to format chatper
   * @param data
   * @returns
   */
  formatChapterDropdown(data) {
    let formattedData = data;
    if (formattedData) {
      formattedData.forEach(ele => {
        ele.displayValue = `${ele.orderNumber}. ${ele.topics}`;
      });
    }
    return formattedData;
  }
  formatSubjectDropdown(data) {
    let formattedData = data;
    if (formattedData) {
      formattedData.forEach(ele => {
        ele.displayName = this.getSubjectDisplayName(ele);
      });
    }
    return formattedData;
  }
  getSubjectDisplayName(ele) {
    if (ele?.sem) {
      return `${ele.name} Sem${ele.sem}`;
    } else {
      return `${ele.name}`;
    }
  }
  extractVideoId(url) {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const matches = url.match(regex);
    return matches ? matches[1] : '';
  }
  trustUrl(videoUrl) {
    const videoId = this.extractVideoId(videoUrl);
    if (videoId) {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${videoId}`);
    } else {
      return this.domSanitizer.bypassSecurityTrustResourceUrl(videoUrl);
    }
  }
  formatSubjecter(subjectArr) {
    const formatedSubjects = subjectArr.reduce((acc, obj) => {
      let existingItem = acc.find(item => item.name === obj.name);
      if (existingItem) {
        existingItem.data.push(obj.subject);
      } else {
        acc.push({
          name: obj.name,
          value: obj.subject,
          data: [obj.subject]
        });
      }
      return acc;
    }, []);
    return formatedSubjects;
  }
  intToRoman(num) {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const symbols = ["M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"];
    let romanNumeral = "";
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        romanNumeral += symbols[i];
        num -= values[i];
      }
    }
    return romanNumeral;
  }
  shuffleOptions(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]];
    }
    return arr;
  }
  copyToClipboard(rawText, version) {
    if (version === 1) {
      let formattedText = rawText.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\*\*(.*?)\*\*/g, '$1').replace(/###/g, '').trim();
      this.clipboardService.copy(formattedText);
    } else {
      const markedText = (0,marked__WEBPACK_IMPORTED_MODULE_0__.marked)(rawText);
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = markedText;
      const processedText = tempDiv.textContent || tempDiv.innerText || '';
      this.clipboardService.copy(processedText);
    }
    this.showSuccess("Copied to clipboard");
  }
  getCceTools(type, medium) {
    if (medium === 'english') {
      switch (type) {
        case "cce_tools_math_science":
          return {
            "ENGAGE": "Observation",
            "EXPLORE": "Observation",
            "ELABORATE": "Observation/Discussion",
            "EXPLAIN": "Discussion",
            "EVALUATE": "Questionnaire"
          };
        case "cce_tools_social":
          return {
            "ENGAGE": "Observation.",
            "EXPLORE": "Observation",
            "ELABORATE": "Observation/Discussion",
            "EXPLAIN": "Discussion",
            "EVALUATE": "Questionnaire"
          };
        case "cce_tools_english":
          return {
            "ENGAGE": "Observation",
            "EXPLORE": "Observation",
            "ELABORATE": "Read Aloud/Discussion",
            "EXPLAIN": "Discussion",
            "EVALUATE": "Questionnaire"
          };
        default:
          return null;
      }
    } else if (medium === 'kannada') {
      switch (type) {
        case "cce_tools_math_science":
          return {
            "ENGAGE": "ವೀಕ್ಷಣೆ",
            "EXPLORE": "ವೀಕ್ಷಣೆ",
            "ELABORATE": "ವೀಕ್ಷಣೆ/ಚರ್ಚೆ",
            "EXPLAIN": "ಚರ್ಚೆ",
            "EVALUATE": "ಪ್ರಶ್ನಾವಳಿ"
          };
        case "cce_tools_social":
          return {
            "ENGAGE": "ವೀಕ್ಷಣೆ.",
            "EXPLORE": "ವೀಕ್ಷಣೆ",
            "ELABORATE": "ವೀಕ್ಷಣೆ/ಚರ್ಚೆ",
            "EXPLAIN": "ಚರ್ಚೆ",
            "EVALUATE": "ಪ್ರಶ್ನಾವಳಿ"
          };
        case "cce_tools_english":
          return {
            "ENGAGE": "ವೀಕ್ಷಣೆ",
            "EXPLORE": "ವೀಕ್ಷಣೆ",
            "ELABORATE": "ಗಟ್ಟಿಯಾಗಿ ಓದಿ/ಚರ್ಚೆ",
            "EXPLAIN": "ಚರ್ಚೆ",
            "EVALUATE": "ಪ್ರಶ್ನಾವಳಿ"
          };
        default:
          return null;
      }
    } else {
      return null;
    }
  }
  /**
   * Function called on logout
   */
  logout() {
    localStorage.clear();
    this.router.navigate(['/auth']);
  }
  static {
    this.ɵfac = function UtilityService_Factory(t) {
      return new (t || UtilityService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](ngx_toastr__WEBPACK_IMPORTED_MODULE_3__.ToastrService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common__WEBPACK_IMPORTED_MODULE_4__.DatePipe), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_platform_browser__WEBPACK_IMPORTED_MODULE_6__.DomSanitizer), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](ngx_clipboard__WEBPACK_IMPORTED_MODULE_7__.ClipboardService));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: UtilityService,
      factory: UtilityService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 74589:
/*!********************************************************************************!*\
  !*** ./src/app/shared/components/baseline-survey/baseline-survey.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BaselineSurveyComponent: () => (/* binding */ BaselineSurveyComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/dialog */ 12587);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_baseline_survey_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/baseline-survey.service */ 91296);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/icon */ 93840);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @ngx-translate/core */ 90852);











function BaselineSurveyComponent_div_5_span_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 17);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "You have reached the maximum number of reminders. Please complete the survey to continue.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_div_5_button_14_span_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Remind me later");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_div_5_button_14_mat_spinner_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 22);
  }
}
function BaselineSurveyComponent_div_5_button_14_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span", 23);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("(", ctx_r7.maxReminders - ctx_r7.remindLaterCount, " left)");
  }
}
function BaselineSurveyComponent_div_5_button_14_Template(rf, ctx) {
  if (rf & 1) {
    const _r9 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_div_5_button_14_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r9);
      const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r8.onRemindLater());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](1, BaselineSurveyComponent_div_5_button_14_span_1_Template, 2, 0, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, BaselineSurveyComponent_div_5_button_14_mat_spinner_2_Template, 1, 0, "mat-spinner", 20);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](3, BaselineSurveyComponent_div_5_button_14_span_3_Template, 2, 1, "span", 21);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r4.reminding);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r4.reminding);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r4.reminding);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r4.remindLaterCount > 0);
  }
}
function BaselineSurveyComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 8)(1, "div", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "\uD83D\uDCDD");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "div", 10)(4, "span", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](5, "\u23F1 About 3 minutes");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "9 quick questions");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, BaselineSurveyComponent_div_5_span_8_Template, 2, 0, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](9, "h1");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10, "Baseline Survey");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "Your feedback helps us make Shiksha copilot more useful for teachers. This is not a test or evaluation, please answer based on your actual experience.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, BaselineSurveyComponent_div_5_button_14_Template, 4, 4, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](15, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_div_5_Template_button_click_15_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r11);
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r10.goNext());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](16, "Let's start \u2192");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r0.isMandatory);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r0.isMandatory);
  }
}
function BaselineSurveyComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 24)(1, "div", 25);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "\u2713");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "h1");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Thank you!");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6, "Your responses were submitted. They'll help make shiksha copilot more useful for teachers.");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
}
function BaselineSurveyComponent_form_7_div_6_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "div", 38);
  }
  if (rf & 2) {
    const i_r26 = ctx.index;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("done", i_r26 < ctx_r12.currentStep)("current", i_r26 === ctx_r12.currentStep);
  }
}
function BaselineSurveyComponent_form_7_ng_container_8_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r32 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_ng_container_8_div_6_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r32);
      const o_r30 = restoredCtx.$implicit;
      const ctx_r31 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r31.toggleArray("plans", o_r30));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r30 = ctx.$implicit;
    const ctx_r27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("selected", ctx_r27.isChecked("plans", o_r30));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r30);
  }
}
function BaselineSurveyComponent_form_7_ng_container_8_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please specify. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_8_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, BaselineSurveyComponent_form_7_ng_container_8_div_7_div_2_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r28 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_0_0 = ctx_r28.surveyForm.get("plansOther")) == null ? null : tmp_0_0.invalid) && ((tmp_0_0 = ctx_r28.surveyForm.get("plansOther")) == null ? null : tmp_0_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_8_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select at least one option to continue. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "How do you currently prepare your lesson plans?");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Select all that apply");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BaselineSurveyComponent_form_7_ng_container_8_div_6_Template, 4, 3, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, BaselineSurveyComponent_form_7_ng_container_8_div_7_Template, 3, 1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, BaselineSurveyComponent_form_7_ng_container_8_div_8_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r13.planOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r13.showPlansOther);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx_r13.surveyForm.get("plans")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx_r13.surveyForm.get("plans")) == null ? null : tmp_2_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_9_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r39 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_ng_container_9_div_6_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r39);
      const o_r37 = restoredCtx.$implicit;
      const ctx_r38 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r38.toggleArray("devices", o_r37));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r37 = ctx.$implicit;
    const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("selected", ctx_r34.isChecked("devices", o_r37));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r37);
  }
}
function BaselineSurveyComponent_form_7_ng_container_9_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please specify. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_9_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, BaselineSurveyComponent_form_7_ng_container_9_div_7_div_2_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r35 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_0_0 = ctx_r35.surveyForm.get("devicesOther")) == null ? null : tmp_0_0.invalid) && ((tmp_0_0 = ctx_r35.surveyForm.get("devicesOther")) == null ? null : tmp_0_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_9_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select at least one option to continue. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Which of these do you use while preparing lesson plans?");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Select all that apply");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BaselineSurveyComponent_form_7_ng_container_9_div_6_Template, 4, 3, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, BaselineSurveyComponent_form_7_ng_container_9_div_7_Template, 3, 1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, BaselineSurveyComponent_form_7_ng_container_9_div_8_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r14.deviceOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r14.showDevicesOther);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx_r14.surveyForm.get("devices")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx_r14.surveyForm.get("devices")) == null ? null : tmp_2_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_10_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r45 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_ng_container_10_div_6_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r45);
      const o_r43 = restoredCtx.$implicit;
      const ctx_r44 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r44.selectRadioValue("weeklyLessonPlans", o_r43));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r43 = ctx.$implicit;
    const ctx_r41 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("selected", ((tmp_0_0 = ctx_r41.surveyForm.get("weeklyLessonPlans")) == null ? null : tmp_0_0.value) === o_r43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r43);
  }
}
function BaselineSurveyComponent_form_7_ng_container_10_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select how many lesson plans you create. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "How many lesson plans do you create in a week?");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Pick one");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BaselineSurveyComponent_form_7_ng_container_10_div_6_Template, 4, 3, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, BaselineSurveyComponent_form_7_ng_container_10_div_7_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r15 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    let tmp_1_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r15.weeklyOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_1_0 = ctx_r15.surveyForm.get("weeklyLessonPlans")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx_r15.surveyForm.get("weeklyLessonPlans")) == null ? null : tmp_1_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_11_div_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 56);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r46 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"](" \u2139\uFE0F ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](2, 1, ctx_r46.exclusiveOptionMessage("lessonPlanComponents")), " ");
  }
}
function BaselineSurveyComponent_form_7_ng_container_11_div_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r52 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 57);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_ng_container_11_div_7_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r52);
      const o_r50 = restoredCtx.$implicit;
      const ctx_r51 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](!ctx_r51.isOptionDisabled("lessonPlanComponents", o_r50) && ctx_r51.toggleArray("lessonPlanComponents", o_r50));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](1, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r50 = ctx.$implicit;
    const ctx_r47 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("selected", ctx_r47.isChecked("lessonPlanComponents", o_r50))("disabled", ctx_r47.isOptionDisabled("lessonPlanComponents", o_r50));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("title", ctx_r47.isOptionDisabled("lessonPlanComponents", o_r50) ? _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](1, 6, ctx_r47.exclusiveOptionMessage("lessonPlanComponents")) : null);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r50);
  }
}
function BaselineSurveyComponent_form_7_ng_container_11_div_8_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please specify. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_11_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 58);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, BaselineSurveyComponent_form_7_ng_container_11_div_8_div_2_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r48 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_0_0 = ctx_r48.surveyForm.get("lessonPlanComponentsOther")) == null ? null : tmp_0_0.invalid) && ((tmp_0_0 = ctx_r48.surveyForm.get("lessonPlanComponentsOther")) == null ? null : tmp_0_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_11_div_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select at least one component. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Which components do you include in your lesson plans?");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Select all that apply");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, BaselineSurveyComponent_form_7_ng_container_11_div_5_Template, 3, 3, "div", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](6, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, BaselineSurveyComponent_form_7_ng_container_11_div_7_Template, 5, 8, "div", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, BaselineSurveyComponent_form_7_ng_container_11_div_8_Template, 3, 1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, BaselineSurveyComponent_form_7_ng_container_11_div_9_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r16 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    let tmp_3_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r16.isExclusiveOptionActive("lessonPlanComponents"));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r16.componentOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r16.showLessonComponentsOther);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_3_0 = ctx_r16.surveyForm.get("lessonPlanComponents")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r16.surveyForm.get("lessonPlanComponents")) == null ? null : tmp_3_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_12_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r59 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_ng_container_12_div_6_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r59);
      const o_r57 = restoredCtx.$implicit;
      const ctx_r58 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r58.selectRadioValue("timePerLessonPlan", o_r57));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r57 = ctx.$implicit;
    const ctx_r54 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("selected", ((tmp_0_0 = ctx_r54.surveyForm.get("timePerLessonPlan")) == null ? null : tmp_0_0.value) === o_r57);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r57);
  }
}
function BaselineSurveyComponent_form_7_ng_container_12_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please specify. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_12_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 59);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, BaselineSurveyComponent_form_7_ng_container_12_div_7_div_2_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r55 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_0_0 = ctx_r55.surveyForm.get("timePerLessonPlanOther")) == null ? null : tmp_0_0.invalid) && ((tmp_0_0 = ctx_r55.surveyForm.get("timePerLessonPlanOther")) == null ? null : tmp_0_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_12_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select an approximate time. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "On average, how much time do you spend preparing one lesson plan?");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Pick one");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BaselineSurveyComponent_form_7_ng_container_12_div_6_Template, 4, 3, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, BaselineSurveyComponent_form_7_ng_container_12_div_7_Template, 3, 1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, BaselineSurveyComponent_form_7_ng_container_12_div_8_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r17 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r17.timePerLessonOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r17.showTimePerLessonOther);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx_r17.surveyForm.get("timePerLessonPlan")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx_r17.surveyForm.get("timePerLessonPlan")) == null ? null : tmp_2_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_13_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r66 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_ng_container_13_div_6_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r66);
      const o_r64 = restoredCtx.$implicit;
      const ctx_r65 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r65.toggleArray("resourcesUsed", o_r64));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r64 = ctx.$implicit;
    const ctx_r61 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("selected", ctx_r61.isChecked("resourcesUsed", o_r64));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r64);
  }
}
function BaselineSurveyComponent_form_7_ng_container_13_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please specify. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_13_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 60);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, BaselineSurveyComponent_form_7_ng_container_13_div_7_div_2_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r62 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_0_0 = ctx_r62.surveyForm.get("resourcesUsedOther")) == null ? null : tmp_0_0.invalid) && ((tmp_0_0 = ctx_r62.surveyForm.get("resourcesUsedOther")) == null ? null : tmp_0_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_13_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select at least one resource. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_13_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Which resources do you use while preparing lesson plans?");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Select all that apply");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BaselineSurveyComponent_form_7_ng_container_13_div_6_Template, 4, 3, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, BaselineSurveyComponent_form_7_ng_container_13_div_7_Template, 3, 1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, BaselineSurveyComponent_form_7_ng_container_13_div_8_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r18.resourceOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r18.showResourcesOther);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx_r18.surveyForm.get("resourcesUsed")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx_r18.surveyForm.get("resourcesUsed")) == null ? null : tmp_2_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_14_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r73 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_ng_container_14_div_6_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r73);
      const o_r71 = restoredCtx.$implicit;
      const ctx_r72 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r72.selectRadioValue("timeForAssessments", o_r71));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r71 = ctx.$implicit;
    const ctx_r68 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("selected", ((tmp_0_0 = ctx_r68.surveyForm.get("timeForAssessments")) == null ? null : tmp_0_0.value) === o_r71);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r71);
  }
}
function BaselineSurveyComponent_form_7_ng_container_14_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please specify. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_14_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 61);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, BaselineSurveyComponent_form_7_ng_container_14_div_7_div_2_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r69 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_0_0 = ctx_r69.surveyForm.get("timeForAssessmentsOther")) == null ? null : tmp_0_0.invalid) && ((tmp_0_0 = ctx_r69.surveyForm.get("timeForAssessmentsOther")) == null ? null : tmp_0_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_14_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select how much time you spend on assessments. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_14_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "On average, how much time do you spend creating questions for one Formative Assessment? ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Pick one");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BaselineSurveyComponent_form_7_ng_container_14_div_6_Template, 4, 3, "div", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, BaselineSurveyComponent_form_7_ng_container_14_div_7_Template, 3, 1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, BaselineSurveyComponent_form_7_ng_container_14_div_8_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r19 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r19.timeAssessmentOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r19.showTimeAssessmentsOther);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx_r19.surveyForm.get("timeForAssessments")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx_r19.surveyForm.get("timeForAssessments")) == null ? null : tmp_2_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_15_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r80 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_ng_container_15_div_6_Template_div_click_0_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r80);
      const o_r78 = restoredCtx.$implicit;
      const ctx_r79 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r79.toggleArray("questionBalance", o_r78));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r78 = ctx.$implicit;
    const ctx_r75 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("selected", ctx_r75.isChecked("questionBalance", o_r78));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r78);
  }
}
function BaselineSurveyComponent_form_7_ng_container_15_div_7_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please specify. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_15_div_7_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 62);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](2, BaselineSurveyComponent_form_7_ng_container_15_div_7_div_2_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r76 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](3);
    let tmp_0_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_0_0 = ctx_r76.surveyForm.get("questionBalanceOther")) == null ? null : tmp_0_0.invalid) && ((tmp_0_0 = ctx_r76.surveyForm.get("questionBalanceOther")) == null ? null : tmp_0_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_15_div_8_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select at least one option. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_form_7_ng_container_15_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "How do you ensure your question paper has a good balance of easy, medium and difficult questions?");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Select all that apply");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 41);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BaselineSurveyComponent_form_7_ng_container_15_div_6_Template, 4, 3, "div", 42);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, BaselineSurveyComponent_form_7_ng_container_15_div_7_Template, 3, 1, "div", 43);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, BaselineSurveyComponent_form_7_ng_container_15_div_8_Template, 2, 0, "div", 44);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r20 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    let tmp_2_0;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r20.questionBalanceOptions);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r20.showQuestionBalanceOther);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_2_0 = ctx_r20.surveyForm.get("questionBalance")) == null ? null : tmp_2_0.invalid) && ((tmp_2_0 = ctx_r20.surveyForm.get("questionBalance")) == null ? null : tmp_2_0.touched));
  }
}
function BaselineSurveyComponent_form_7_ng_container_16_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](1, "h2", 39);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "Anything else you'd like us to know?");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "p", 40);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4, "Optional");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](5, "textarea", 63);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementContainerEnd"]();
  }
}
function BaselineSurveyComponent_form_7_span_21_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r22 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r22.nextButtonLabel);
  }
}
function BaselineSurveyComponent_form_7_mat_spinner_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 64);
  }
}
function BaselineSurveyComponent_form_7_div_23_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 65)(1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "error_outline");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r24.error);
  }
}
function BaselineSurveyComponent_form_7_Template(rf, ctx) {
  if (rf & 1) {
    const _r83 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "form", 26)(1, "div", 27)(2, "div", 28)(3, "span", 29);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "div", 30);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BaselineSurveyComponent_form_7_div_6_Template, 1, 4, "div", 31);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](7, "div", 32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](8, BaselineSurveyComponent_form_7_ng_container_8_Template, 9, 3, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](9, BaselineSurveyComponent_form_7_ng_container_9_Template, 9, 3, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](10, BaselineSurveyComponent_form_7_ng_container_10_Template, 8, 2, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](11, BaselineSurveyComponent_form_7_ng_container_11_Template, 10, 4, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](12, BaselineSurveyComponent_form_7_ng_container_12_Template, 9, 3, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](13, BaselineSurveyComponent_form_7_ng_container_13_Template, 9, 3, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](14, BaselineSurveyComponent_form_7_ng_container_14_Template, 9, 3, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](15, BaselineSurveyComponent_form_7_ng_container_15_Template, 9, 3, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](16, BaselineSurveyComponent_form_7_ng_container_16_Template, 6, 0, "ng-container", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 33)(18, "button", 34);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_Template_button_click_18_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r83);
      const ctx_r82 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r82.goBack());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](19, "\u2190 Back");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](20, "button", 35);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_form_7_Template_button_click_20_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r83);
      const ctx_r84 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r84.goNext());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](21, BaselineSurveyComponent_form_7_span_21_Template, 2, 1, "span", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](22, BaselineSurveyComponent_form_7_mat_spinner_22_Template, 1, 0, "mat-spinner", 36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](23, BaselineSurveyComponent_form_7_div_23_Template, 5, 1, "div", 37);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx_r2.surveyForm);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("Question ", ctx_r2.currentStep + 1, " of ", ctx_r2.totalSteps, "");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx_r2.stepProgressArray);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.currentStep === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.currentStep === 1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.currentStep === 2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.currentStep === 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.currentStep === 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.currentStep === 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.currentStep === 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.currentStep === 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.currentStep === 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r2.currentStep === 0);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r2.submitting);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx_r2.submitting);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.submitting);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx_r2.error);
  }
}
class BaselineSurveyComponent {
  get totalSteps() {
    return this.stepControlNames.length;
  }
  /** Used purely to *ngFor the tally track ticks */
  get stepProgressArray() {
    return Array.from({
      length: this.totalSteps
    });
  }
  get isLastStep() {
    return this.currentStep === this.totalSteps - 1;
  }
  get nextButtonLabel() {
    return this.isLastStep ? 'Submit survey' : 'Next';
  }
  get remindLaterCount() {
    return this.data.remindLaterCount;
  }
  get isMandatory() {
    return this.data?.isMandatory === true;
  }
  constructor(fb, surveyService, snackBar, dialogRef, data) {
    this.fb = fb;
    this.surveyService = surveyService;
    this.snackBar = snackBar;
    this.dialogRef = dialogRef;
    this.data = data;
    this.submitting = false;
    this.reminding = false;
    this.submitted = false;
    this.error = null;
    /** -1 = intro screen, 0..totalSteps-1 = question steps */
    this.currentStep = -1;
    // Order of form controls that make up each step of the wizard.
    this.stepControlNames = ['plans', 'devices', 'weeklyLessonPlans', 'lessonPlanComponents', 'timePerLessonPlan', 'resourcesUsed', 'timeForAssessments', 'questionBalance', 'otherNotes'];
    // Q1 – How do you currently prepare your lesson plans?
    this.planOptions = ['Paper-based (Notebook/Register)', 'Digital documents (Word, Google Docs, PowerPoint, etc.)', 'Other'];
    // Q2 – Which devices do you use while preparing lesson plans?
    this.deviceOptions = ['School desktop/laptop/tablet', 'Personal desktop/laptop/tablet', 'Personal mobile phone', "Another person's device (family/friend/colleague)", 'Books/Notes only (No digital device)', 'Other'];
    // Q3 – How many lesson plans per week?
    this.weeklyOptions = ['1', '2', '3', '4', 'More than 5'];
    // Q4 – Which components do you include?
    this.componentOptions = ['Hands-on activities', 'Real-world examples / Analogies', 'Stories', 'Videos', 'Classroom discussion', 'None of the above', 'Other'];
    // Q5 – Time per lesson plan (radio)
    this.timePerLessonOptions = ['Less than 15 minutes', '15–30 minutes', '30–60 minutes', '60–90 minutes', 'More than 90 minutes', 'Other'];
    // Q6 – Resources used
    this.resourceOptions = ['School textbooks', 'Other textbooks / Reference books', 'DIKSHA', 'Educational websites (Khan Academy etc.)', 'YouTube', 'AI tools (ChatGPT, Shiksha Copilot, Gemini, etc.)', 'Search engines (Google, Bing, etc.)', 'Other'];
    // Q7 – Time for formative assessment (radio)
    this.timeAssessmentOptions = ['Less than 15 minutes', '15–30 minutes', '30–60 minutes', '60–90 minutes', 'More than 90 minutes', 'Other'];
    // Q8 – Question balance strategy (multi-select)
    this.questionBalanceOptions = ['I use my own experience', 'I refer to previous question papers', 'I discuss with colleagues', 'I follow a blueprint/guidelines', 'I do not specifically check this', 'Other'];
    // Maps each checkbox-array control to its "Other" free-text control,
    // so the text becomes required exactly when "Other" is checked.
    this.otherFieldMap = {
      plans: 'plansOther',
      devices: 'devicesOther',
      lessonPlanComponents: 'lessonPlanComponentsOther',
      resourcesUsed: 'resourcesUsedOther',
      questionBalance: 'questionBalanceOther'
    };
    // Same idea, but for the radio-style questions handled via selectRadioValue().
    this.radioOtherFieldMap = {
      timePerLessonPlan: 'timePerLessonPlanOther',
      timeForAssessments: 'timeForAssessmentsOther'
    };
    // Checkbox-array controls where one option is exclusive of all the others
    // (e.g. "None of the above" wipes out and disables every other choice).
    this.exclusiveOptionMap = {
      lessonPlanComponents: 'None of the above'
    };
    this.surveyForm = this.fb.group({
      // Q1
      plans: this.fb.array([], [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, this.minSelectedCheckboxes(1)]),
      plansOther: [''],
      // Q2
      devices: this.fb.array([], [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, this.minSelectedCheckboxes(1)]),
      devicesOther: [''],
      // Q3
      weeklyLessonPlans: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      // Q4
      lessonPlanComponents: this.fb.array([], [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, this.minSelectedCheckboxes(1)]),
      lessonPlanComponentsOther: [''],
      // Q5
      timePerLessonPlan: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      timePerLessonPlanOther: [''],
      // Q6
      resourcesUsed: this.fb.array([], [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, this.minSelectedCheckboxes(1)]),
      resourcesUsedOther: [''],
      // Q7
      timeForAssessments: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      timeForAssessmentsOther: [''],
      // Q8
      questionBalance: this.fb.array([], [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, this.minSelectedCheckboxes(1)]),
      questionBalanceOther: [''],
      // Q9
      otherNotes: ['']
    });
  }
  /** Custom validator for minimum selected checkboxes */
  minSelectedCheckboxes(min = 1) {
    return control => {
      if (!(control instanceof _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormArray)) return null;
      const totalSelected = control.controls.map(c => c.value).reduce((prev, next) => next ? prev + 1 : prev, 0);
      return totalSelected >= min ? null : {
        required: true
      };
    };
  }
  /** Turns the required validator on/off for a given "Other" text control. */
  updateOtherValidator(controlName, required) {
    const control = this.surveyForm.get(controlName);
    if (!control) return;
    if (required) {
      control.setValidators([_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required]);
    } else {
      control.clearValidators();
      control.setValue('');
    }
    control.updateValueAndValidity();
  }
  toggleArray(controlName, value) {
    const formArray = this.surveyForm.get(controlName);
    const exclusiveOption = this.exclusiveOptionMap[controlName];
    if (exclusiveOption) {
      if (value === exclusiveOption) {
        // Toggling "None of the above" itself: either select it alone, or clear it.
        const alreadySelected = this.isChecked(controlName, exclusiveOption);
        formArray.clear();
        if (!alreadySelected) {
          formArray.push(new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl(exclusiveOption));
        }
        const otherControlName = this.otherFieldMap[controlName];
        if (otherControlName) {
          this.updateOtherValidator(otherControlName, false);
        }
        formArray.updateValueAndValidity();
        formArray.markAsTouched();
        return;
      }
      // Selecting any other option should not coexist with "None of the above".
      if (this.isOptionDisabled(controlName, value)) {
        return; // guarded in the template too, but block here just in case
      }
    }

    const index = formArray.value.indexOf(value);
    if (index === -1) {
      formArray.push(new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl(value));
    } else {
      formArray.removeAt(index);
    }
    formArray.updateValueAndValidity();
    formArray.markAsTouched();
    const otherControlName = this.otherFieldMap[controlName];
    if (otherControlName) {
      this.updateOtherValidator(otherControlName, this.isChecked(controlName, 'Other'));
    }
  }
  isChecked(controlName, value) {
    const formArray = this.surveyForm.get(controlName);
    return formArray.value.includes(value);
  }
  isOptionDisabled(controlName, option) {
    const exclusiveOption = this.exclusiveOptionMap[controlName];
    if (!exclusiveOption || option === exclusiveOption) return false;
    return this.isChecked(controlName, exclusiveOption);
  }
  /** True when this control's exclusive option (e.g. "None of the above") is selected. */
  isExclusiveOptionActive(controlName) {
    const exclusiveOption = this.exclusiveOptionMap[controlName];
    if (!exclusiveOption) return false;
    return this.isChecked(controlName, exclusiveOption);
  }
  /** Text explaining why the other options are locked, for tooltips/notes. */
  exclusiveOptionMessage(controlName) {
    const exclusiveOption = this.exclusiveOptionMap[controlName];
    return exclusiveOption ? `Deselect "${exclusiveOption}" to choose another option.` : '';
  }
  /** Sets a single-value (radio-style) control and marks it touched */
  selectRadioValue(controlName, value) {
    const control = this.surveyForm.get(controlName);
    control?.setValue(value);
    control?.markAsTouched();
    const otherControlName = this.radioOtherFieldMap[controlName];
    if (otherControlName) {
      this.updateOtherValidator(otherControlName, value === 'Other');
    }
  }
  // "Other" visibility getters
  get showPlansOther() {
    return this.isChecked('plans', 'Other');
  }
  get showDevicesOther() {
    return this.isChecked('devices', 'Other');
  }
  get showLessonComponentsOther() {
    return this.isChecked('lessonPlanComponents', 'Other');
  }
  get showTimePerLessonOther() {
    return this.surveyForm.get('timePerLessonPlan')?.value === 'Other';
  }
  get showResourcesOther() {
    return this.isChecked('resourcesUsed', 'Other');
  }
  get showTimeAssessmentsOther() {
    return this.surveyForm.get('timeForAssessments')?.value === 'Other';
  }
  get showQuestionBalanceOther() {
    return this.isChecked('questionBalance', 'Other');
  }
  /** Moves from the intro screen into question 1 */
  startSurvey() {
    this.currentStep = 0;
  }
  goNext() {
    if (this.currentStep === -1) {
      this.startSurvey();
      return;
    }
    const controlName = this.stepControlNames[this.currentStep];
    const control = controlName ? this.surveyForm.get(controlName) : null;
    if (control && control.invalid) {
      control.markAsTouched();
      return;
    }
    // Block advancing if this step's "Other" text is required but still empty.
    const otherControlName = this.otherFieldMap[controlName] || this.radioOtherFieldMap[controlName];
    if (otherControlName) {
      const otherControl = this.surveyForm.get(otherControlName);
      if (otherControl && otherControl.invalid) {
        otherControl.markAsTouched();
        return;
      }
    }
    if (this.isLastStep) {
      this.onSubmit();
      return;
    }
    this.currentStep++;
  }
  goBack() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }
  onSubmit() {
    if (this.surveyForm.invalid) {
      this.markTouched(this.surveyForm);
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.submitting = true;
    this.error = null;
    this.surveyService.submitSurvey(this.surveyForm.value).subscribe({
      next: response => {
        this.submitting = false;
        if (response.success) {
          this.submitted = true;
          this.snackBar.open('Survey submitted successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          // brief pause so the "thank you" state is visible before the dialog closes
          setTimeout(() => this.dialogRef.close(true), 1300);
        } else {
          this.error = response.message || 'Failed to submit survey. Please try again.';
        }
      },
      error: error => {
        console.error('Error submitting survey:', error);
        this.error = 'An error occurred while submitting the survey. Please try again.';
        this.submitting = false;
      }
    });
  }
  get maxReminders() {
    return this.data?.maxReminders ?? 3;
  }
  onRemindLater() {
    if (this.isMandatory) return;
    this.reminding = true;
    this.error = null;
    this.surveyService.remindLater().subscribe({
      next: res => {
        this.reminding = false;
        if (res && res.success) {
          this.dialogRef.close('remind');
        } else {
          this.error = 'Failed to postpone the survey. Please try again.';
        }
      },
      error: err => {
        console.error('Error postponing survey:', err);
        this.reminding = false;
        this.error = 'An error occurred while postponing. Please try again.';
      }
    });
  }
  markTouched(group) {
    Object.values(group.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroup || control instanceof _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormArray) {
        this.markTouched(control);
      }
    });
  }
  static {
    this.ɵfac = function BaselineSurveyComponent_Factory(t) {
      return new (t || BaselineSurveyComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_core_services_baseline_survey_service__WEBPACK_IMPORTED_MODULE_0__.BaselineSurveyService), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_3__.MatSnackBar), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialogRef), _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MAT_DIALOG_DATA));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: BaselineSurveyComponent,
      selectors: [["app-baseline-survey"]],
      decls: 8,
      vars: 3,
      consts: [[1, "survey-wrapper"], [1, "wizard-card"], ["rel", "preconnect", "href", "https://fonts.googleapis.com"], ["rel", "preconnect", "href", "https://fonts.gstatic.com", "crossorigin", ""], ["href", "https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap", "rel", "stylesheet"], ["class", "intro-screen", 4, "ngIf"], ["class", "done-screen", 4, "ngIf"], ["class", "wizard-form", 3, "formGroup", 4, "ngIf"], [1, "intro-screen"], [1, "intro-badge"], [1, "intro-pills"], [1, "pill", "pill-time"], [1, "pill"], ["class", "pill pill-warn", 4, "ngIf"], [1, "intro-actions"], ["type", "button", "class", "btn btn-remind", 3, "disabled", "click", 4, "ngIf"], ["type", "button", 1, "btn", "btn-start", 3, "click"], [1, "pill", "pill-warn"], ["type", "button", 1, "btn", "btn-remind", 3, "disabled", "click"], [4, "ngIf"], ["diameter", "18", 4, "ngIf"], ["class", "remind-count", 4, "ngIf"], ["diameter", "18"], [1, "remind-count"], [1, "done-screen"], [1, "done-badge"], [1, "wizard-form", 3, "formGroup"], [1, "progress-block"], [1, "progress-top"], [1, "progress-label"], [1, "tally-track"], ["class", "tally", 3, "done", "current", 4, "ngFor", "ngForOf"], [1, "stage"], [1, "nav"], ["type", "button", 1, "btn", "btn-back", 3, "disabled", "click"], ["type", "button", 1, "btn", "btn-next", 3, "disabled", "click"], ["diameter", "20", 4, "ngIf"], ["class", "error-message", 4, "ngIf"], [1, "tally"], [1, "question"], [1, "hint"], [1, "options"], ["class", "opt check", 3, "selected", "click", 4, "ngFor", "ngForOf"], ["class", "other-box", 4, "ngIf"], ["class", "field-nudge", 4, "ngIf"], [1, "opt", "check", 3, "click"], [1, "mark"], [1, "other-box"], ["type", "text", "formControlName", "plansOther", "placeholder", "Please specify"], [1, "field-nudge"], ["type", "text", "formControlName", "devicesOther", "placeholder", "Please specify"], [1, "options", "grid2"], ["class", "opt radio", 3, "selected", "click", 4, "ngFor", "ngForOf"], [1, "opt", "radio", 3, "click"], ["class", "exclusive-note", 4, "ngIf"], ["class", "opt check", 3, "selected", "disabled", "title", "click", 4, "ngFor", "ngForOf"], [1, "exclusive-note"], [1, "opt", "check", 3, "title", "click"], ["type", "text", "formControlName", "lessonPlanComponentsOther", "placeholder", "Please specify other components"], ["type", "text", "formControlName", "timePerLessonPlanOther", "placeholder", "Please specify"], ["type", "text", "formControlName", "resourcesUsedOther", "placeholder", "Please specify other resources"], ["type", "text", "formControlName", "timeForAssessmentsOther", "placeholder", "Please specify"], ["type", "text", "formControlName", "questionBalanceOther", "placeholder", "Please specify"], ["formControlName", "otherNotes", "rows", "4", "placeholder", "Share any thoughts..."], ["diameter", "20"], [1, "error-message"]],
      template: function BaselineSurveyComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "link", 2)(3, "link", 3)(4, "link", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](5, BaselineSurveyComponent_div_5_Template, 17, 2, "div", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](6, BaselineSurveyComponent_div_6_Template, 7, 0, "div", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](7, BaselineSurveyComponent_form_7_Template, 24, 18, "form", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.currentStep === -1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.submitted);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.currentStep > -1 && !ctx.submitted);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_6__.MatProgressSpinner, _angular_material_icon__WEBPACK_IMPORTED_MODULE_7__.MatIcon, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_8__.TranslatePipe],
      styles: ["@charset \"UTF-8\";\n\n\n.survey-wrapper[_ngcontent-%COMP%] {\n  --blue: #3F91DA;\n  --blue-deep: #1a4d7a;\n  --blue-pale: #EAF3FB;\n  --ink: #1E293B;\n  --ink-soft: #475569;\n  --line: #E2E8F0;\n  --panel: #F8FAFC;\n  --success: #2E9E6F;\n  --danger: #DC2626;\n  --warn-bg: #FFF3E0;\n  --warn-border: #FFE0B2;\n  --warn-text: #92601A;\n  --disabled-bg: #F1F5F9;\n  --disabled-border: #E2E8F0;\n  --disabled-text: #94A3B8;\n  font-family: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n  width: 100%;\n  box-sizing: border-box;\n  \n\n  \n\n  \n\n  \n\n  \n\n\n  \n\n\n  \n\n\n  \n\n  \n\n  \n\n  \n\n}\n.survey-wrapper   [_nghost-%COMP%]     .mat-dialog-container {\n  padding: 0;\n  max-width: 100vw;\n  overflow: hidden;\n  box-shadow: 0 25px 50px -12px rgba(30, 41, 59, 0.25);\n}\n.survey-wrapper[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .wizard-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 640px;\n  margin: 0 auto;\n  background: #ffffff;\n  max-height: 85vh;\n  overflow-y: auto;\n  overflow-x: hidden;\n  position: relative;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .intro-screen[_ngcontent-%COMP%] {\n  padding: 44px 36px 40px;\n  text-align: center;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .intro-badge[_ngcontent-%COMP%] {\n  width: 64px;\n  height: 64px;\n  border-radius: 50%;\n  background: linear-gradient(135deg, var(--blue), var(--blue-deep));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 28px;\n  margin: 0 auto 18px;\n  box-shadow: 0 10px 24px -8px rgba(63, 145, 218, 0.5);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .intro-pills[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  justify-content: center;\n  flex-wrap: wrap;\n  margin-bottom: 20px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .pill[_ngcontent-%COMP%] {\n  font-size: 0.78rem;\n  font-weight: 600;\n  padding: 6px 14px;\n  border-radius: 20px;\n  background: #EAF3FB;\n  color: #0F3A5C;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .pill-time[_ngcontent-%COMP%] {\n  background: #EAF3FB;\n  color: #0F3A5C;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .pill-warn[_ngcontent-%COMP%] {\n  background: #FEF2F2;\n  color: var(--danger);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .intro-screen[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-family: \"Baloo 2\", sans-serif;\n  font-size: 1.6rem;\n  font-weight: 600;\n  color: var(--ink);\n  margin: 0 0 10px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .intro-screen[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--ink-soft);\n  font-size: 0.95rem;\n  line-height: 1.6;\n  max-width: 440px;\n  margin: 0 auto 28px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .intro-actions[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n  max-width: 340px;\n  margin: 0 auto;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .done-screen[_ngcontent-%COMP%] {\n  padding: 56px 36px;\n  text-align: center;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .done-badge[_ngcontent-%COMP%] {\n  width: 72px;\n  height: 72px;\n  border-radius: 50%;\n  background: linear-gradient(135deg, #3EBE8C, var(--success));\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 32px;\n  color: white;\n  margin: 0 auto 20px;\n  box-shadow: 0 10px 24px -8px rgba(46, 158, 111, 0.45);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .done-screen[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%] {\n  font-family: \"Baloo 2\", sans-serif;\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: var(--ink);\n  margin: 0 0 8px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .done-screen[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--ink-soft);\n  font-size: 0.93rem;\n  line-height: 1.6;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .progress-block[_ngcontent-%COMP%] {\n  padding: 24px 32px 0;\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .progress-top[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .progress-label[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--ink-soft);\n  font-weight: 500;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .tally-track[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 5px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .tally[_ngcontent-%COMP%] {\n  flex: 1;\n  height: 8px;\n  border-radius: 6px;\n  background: var(--line);\n  position: relative;\n  overflow: hidden;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .tally[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  inset: 0;\n  background: linear-gradient(90deg, var(--blue), var(--blue-deep));\n  transform: scaleX(0);\n  transform-origin: left;\n  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);\n  border-radius: 6px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .tally.done[_ngcontent-%COMP%]::after {\n  transform: scaleX(1);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .tally.current[_ngcontent-%COMP%]::after {\n  transform: scaleX(1);\n  opacity: 0.55;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .stage[_ngcontent-%COMP%] {\n  padding: 28px 32px 24px;\n  min-height: 320px;\n  display: flex;\n  flex-direction: column;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .question[_ngcontent-%COMP%] {\n  font-family: \"Baloo 2\", sans-serif;\n  font-size: 1.25rem;\n  font-weight: 600;\n  line-height: 1.4;\n  color: var(--ink);\n  margin: 0 0 4px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .hint[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  color: var(--ink-soft);\n  margin: 0 0 20px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .exclusive-note[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  font-size: 0.82rem;\n  color: var(--warn-text);\n  background: var(--warn-bg);\n  border: 1px solid var(--warn-border);\n  border-radius: 10px;\n  padding: 10px 14px;\n  margin-bottom: 14px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .options[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 10px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .options.grid2[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 1fr 1fr;\n  gap: 10px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  padding: 14px 16px;\n  border-radius: 14px;\n  border: 1.5px solid var(--line);\n  background: var(--panel);\n  cursor: pointer;\n  font-size: 0.95rem;\n  font-weight: 500;\n  color: var(--ink);\n  transition: all 0.15s ease;\n  -webkit-user-select: none;\n          user-select: none;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt[_ngcontent-%COMP%]:hover {\n  border-color: #A9CBEA;\n  background: var(--blue-pale);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt[_ngcontent-%COMP%]   .mark[_ngcontent-%COMP%] {\n  width: 22px;\n  height: 22px;\n  border-radius: 7px;\n  border: 2px solid #C9D6E4;\n  background: #fff;\n  flex-shrink: 0;\n  position: relative;\n  transition: all 0.15s ease;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.radio[_ngcontent-%COMP%]   .mark[_ngcontent-%COMP%] {\n  border-radius: 50%;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.selected[_ngcontent-%COMP%] {\n  background: var(--blue-pale);\n  border-color: var(--blue);\n  color: var(--blue-deep);\n  font-weight: 600;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.selected[_ngcontent-%COMP%]   .mark[_ngcontent-%COMP%] {\n  background: var(--blue);\n  border-color: var(--blue);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.selected.check[_ngcontent-%COMP%]   .mark[_ngcontent-%COMP%]::after {\n  content: \"\u2713\";\n  position: absolute;\n  inset: 0;\n  color: white;\n  font-size: 14px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.selected.radio[_ngcontent-%COMP%]   .mark[_ngcontent-%COMP%]::after {\n  content: \"\";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: white;\n  transform: translate(-50%, -50%);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.disabled[_ngcontent-%COMP%] {\n  background: var(--disabled-bg);\n  border-color: var(--disabled-border);\n  color: var(--disabled-text);\n  cursor: not-allowed;\n  pointer-events: none;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.disabled[_ngcontent-%COMP%]:hover {\n  background: var(--disabled-bg);\n  border-color: var(--disabled-border);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.disabled[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: var(--disabled-text);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.disabled[_ngcontent-%COMP%]   .mark[_ngcontent-%COMP%] {\n  background: var(--disabled-border);\n  border-color: #CBD5E1;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.disabled.selected[_ngcontent-%COMP%] {\n  background: var(--disabled-bg);\n  border-color: var(--disabled-border);\n  color: var(--disabled-text);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .opt.disabled.selected[_ngcontent-%COMP%]   .mark[_ngcontent-%COMP%] {\n  background: #CBD5E1;\n  border-color: #CBD5E1;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .other-box[_ngcontent-%COMP%] {\n  margin-top: 12px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .other-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 12px 14px;\n  border-radius: 12px;\n  border: 1.5px solid var(--line);\n  font-family: \"Inter\", sans-serif;\n  font-size: 0.92rem;\n  background: var(--panel);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .other-box[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--blue);\n  background: white;\n  box-shadow: 0 0 0 3px rgba(63, 145, 218, 0.12);\n}\n.survey-wrapper[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%] {\n  width: 100%;\n  min-height: 120px;\n  border-radius: 14px;\n  border: 1.5px solid var(--line);\n  padding: 14px 16px;\n  font-family: \"Inter\", sans-serif;\n  font-size: 0.95rem;\n  resize: vertical;\n  background: var(--panel);\n}\n.survey-wrapper[_ngcontent-%COMP%]   textarea[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--blue);\n  background: white;\n  box-shadow: 0 0 0 3px rgba(63, 145, 218, 0.12);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .field-nudge[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: var(--danger);\n  margin-top: 10px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .nav[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  gap: 16px;\n  padding: 18px 32px 28px;\n  border-top: 1px solid var(--line);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn[_ngcontent-%COMP%] {\n  font-family: \"Inter\", sans-serif;\n  font-weight: 600;\n  font-size: 0.92rem;\n  border: none;\n  border-radius: 12px;\n  padding: 12px 22px;\n  cursor: pointer;\n  transition: all 0.15s ease;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n  gap: 6px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-back[_ngcontent-%COMP%] {\n  background: transparent;\n  color: var(--ink-soft);\n  padding-left: 8px;\n  padding-right: 8px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-back[_ngcontent-%COMP%]:hover:not(:disabled) {\n  color: var(--ink);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-back[_ngcontent-%COMP%]:disabled {\n  opacity: 0;\n  pointer-events: none;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-next[_ngcontent-%COMP%], .survey-wrapper[_ngcontent-%COMP%]   .btn-start[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--blue), var(--blue-deep));\n  color: white;\n  box-shadow: 0 8px 20px -6px rgba(44, 116, 181, 0.45);\n  min-width: 130px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-next[_ngcontent-%COMP%]:hover:not(:disabled), .survey-wrapper[_ngcontent-%COMP%]   .btn-start[_ngcontent-%COMP%]:hover:not(:disabled) {\n  transform: translateY(-1px);\n  box-shadow: 0 10px 24px -6px rgba(44, 116, 181, 0.55);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-next[_ngcontent-%COMP%]:disabled {\n  opacity: 0.7;\n  cursor: not-allowed;\n  transform: none;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-remind[_ngcontent-%COMP%] {\n  background: #F8FAFC;\n  color: var(--ink-soft);\n  border: 1.5px solid var(--line);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-remind[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: #F1F5F9;\n  border-color: #CBD5E1;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .remind-count[_ngcontent-%COMP%] {\n  font-size: 0.8em;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  color: var(--danger);\n  background: #FEF2F2;\n  padding: 14px 20px 18px;\n  margin: 0 32px 20px;\n  border-radius: 12px;\n  font-size: 14px;\n  font-weight: 500;\n  border: 1px solid #FECACA;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n  flex-shrink: 0;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .wizard-card[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 8px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .wizard-card[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: var(--panel);\n  border-radius: 4px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .wizard-card[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: #CBD5E1;\n  border-radius: 4px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .wizard-card[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: #94A3B8;\n}\n@media (max-width: 768px) {\n  .survey-wrapper[_ngcontent-%COMP%]   .wizard-card[_ngcontent-%COMP%] {\n    max-height: 90vh;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .intro-screen[_ngcontent-%COMP%] {\n    padding: 32px 24px 28px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .progress-block[_ngcontent-%COMP%] {\n    padding: 20px 20px 0;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .stage[_ngcontent-%COMP%] {\n    padding: 22px 20px 18px;\n    min-height: 260px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .nav[_ngcontent-%COMP%] {\n    padding: 16px 20px 22px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .options.grid2[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr 1fr;\n  }\n}\n@media (max-width: 480px) {\n  .survey-wrapper[_ngcontent-%COMP%]   .options.grid2[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .intro-actions[_ngcontent-%COMP%] {\n    max-width: 100%;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2VsaW5lLXN1cnZleS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQkFBZ0I7QUFFaEIseURBQUE7QUFDQTtFQVFFLGVBQUE7RUFDQSxvQkFBQTtFQUNBLG9CQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0Esc0JBQUE7RUFDQSxvQkFBQTtFQUNBLHNCQUFBO0VBQ0EsMEJBQUE7RUFDQSx3QkFBQTtFQUVBLHVGQUFBO0VBTUEsV0FBQTtFQUNBLHNCQUFBO0VBaUJBLHVDQUFBO0VBc0VBLHNDQUFBO0VBa0NBLGlEQUFBO0VBc0RBLHlDQUFBO0VBdUJBOytDQUFBO0VBa0dBOzBFQUFBO0VBd0JBO3VCQUFBO0VBMkRBLDhCQUFBO0VBNEVBLHdDQUFBO0VBc0JBLG9DQUFBO0VBbUJBLHFDQUFBO0FBL2VGO0FBL0JFO0VBQ0UsVUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxvREFBQTtBQWlDSjtBQUxFO0VBQ0Usc0JBQUE7QUFPSjtBQUpFO0VBQ0UsV0FBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7QUFNSjtBQUZFO0VBQ0UsdUJBQUE7RUFDQSxrQkFBQTtBQUlKO0FBREU7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0Esa0VBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLG9EQUFBO0FBR0o7QUFBRTtFQUNFLGFBQUE7RUFDQSxRQUFBO0VBQ0EsdUJBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7QUFFSjtBQUNFO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLGNBQUE7QUFDSjtBQUVFO0VBQ0UsbUJBQUE7RUFDQSxjQUFBO0FBQUo7QUFHRTtFQUNFLG1CQUFBO0VBQ0Esb0JBQUE7QUFESjtBQUlFO0VBQ0Usa0NBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtBQUZKO0FBS0U7RUFDRSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0FBSEo7QUFNRTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUFKSjtBQVFFO0VBQ0Usa0JBQUE7RUFDQSxrQkFBQTtBQU5KO0FBU0U7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsNERBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGVBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSxxREFBQTtBQVBKO0FBVUU7RUFDRSxrQ0FBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLGVBQUE7QUFSSjtBQVdFO0VBQ0Usc0JBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBVEo7QUFhRTtFQUNFLG9CQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtBQVhKO0FBY0U7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtBQVpKO0FBZUU7RUFDRSxrQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZ0JBQUE7QUFiSjtBQWdCRTtFQUNFLGFBQUE7RUFDQSxRQUFBO0FBZEo7QUFpQkU7RUFDRSxPQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBZko7QUFrQkU7RUFDRSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxRQUFBO0VBQ0EsaUVBQUE7RUFDQSxvQkFBQTtFQUNBLHNCQUFBO0VBQ0EsdURBQUE7RUFDQSxrQkFBQTtBQWhCSjtBQW1CRTtFQUNFLG9CQUFBO0FBakJKO0FBb0JFO0VBQ0Usb0JBQUE7RUFDQSxhQUFBO0FBbEJKO0FBc0JFO0VBQ0UsdUJBQUE7RUFDQSxpQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtBQXBCSjtBQXVCRTtFQUNFLGtDQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0FBckJKO0FBd0JFO0VBQ0Usa0JBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0FBdEJKO0FBMkJFO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtFQUNBLGtCQUFBO0VBQ0EsdUJBQUE7RUFDQSwwQkFBQTtFQUNBLG9DQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0FBekJKO0FBNEJFO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtBQTFCSjtBQTZCRTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLFNBQUE7QUEzQko7QUE4QkU7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtFQUNBLCtCQUFBO0VBQ0Esd0JBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsMEJBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0FBNUJKO0FBK0JFO0VBQ0UscUJBQUE7RUFDQSw0QkFBQTtBQTdCSjtBQWdDRTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsMEJBQUE7QUE5Qko7QUFpQ0U7RUFDRSxrQkFBQTtBQS9CSjtBQWtDRTtFQUNFLDRCQUFBO0VBQ0EseUJBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0FBaENKO0FBbUNFO0VBQ0UsdUJBQUE7RUFDQSx5QkFBQTtBQWpDSjtBQW9DRTtFQUNFLFlBQUE7RUFDQSxrQkFBQTtFQUNBLFFBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FBbENKO0FBcUNFO0VBQ0UsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQ0FBQTtBQW5DSjtBQXdDRTtFQUNFLDhCQUFBO0VBQ0Esb0NBQUE7RUFDQSwyQkFBQTtFQUNBLG1CQUFBO0VBQ0Esb0JBQUE7QUF0Q0o7QUF5Q0U7RUFDRSw4QkFBQTtFQUNBLG9DQUFBO0FBdkNKO0FBMENFO0VBQ0UsMkJBQUE7QUF4Q0o7QUEyQ0U7RUFDRSxrQ0FBQTtFQUNBLHFCQUFBO0FBekNKO0FBOENFO0VBQ0UsOEJBQUE7RUFDQSxvQ0FBQTtFQUNBLDJCQUFBO0FBNUNKO0FBK0NFO0VBQ0UsbUJBQUE7RUFDQSxxQkFBQTtBQTdDSjtBQWdERTtFQUNFLGdCQUFBO0FBOUNKO0FBaURFO0VBQ0UsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7RUFDQSwrQkFBQTtFQUNBLGdDQUFBO0VBQ0Esa0JBQUE7RUFDQSx3QkFBQTtBQS9DSjtBQWtERTtFQUNFLGFBQUE7RUFDQSx5QkFBQTtFQUNBLGlCQUFBO0VBQ0EsOENBQUE7QUFoREo7QUFtREU7RUFDRSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLCtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQ0FBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSx3QkFBQTtBQWpESjtBQW9ERTtFQUNFLGFBQUE7RUFDQSx5QkFBQTtFQUNBLGlCQUFBO0VBQ0EsOENBQUE7QUFsREo7QUFxREU7RUFDRSxpQkFBQTtFQUNBLG9CQUFBO0VBQ0EsZ0JBQUE7QUFuREo7QUF1REU7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSx1QkFBQTtFQUNBLGlDQUFBO0FBckRKO0FBd0RFO0VBQ0UsZ0NBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0EsMEJBQUE7RUFDQSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxRQUFBO0FBdERKO0FBeURFO0VBQ0UsdUJBQUE7RUFDQSxzQkFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7QUF2REo7QUEwREU7RUFDRSxpQkFBQTtBQXhESjtBQTJERTtFQUNFLFVBQUE7RUFDQSxvQkFBQTtBQXpESjtBQTRERTs7RUFFRSxrRUFBQTtFQUNBLFlBQUE7RUFDQSxvREFBQTtFQUNBLGdCQUFBO0FBMURKO0FBNkRFOztFQUVFLDJCQUFBO0VBQ0EscURBQUE7QUEzREo7QUE4REU7RUFDRSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0FBNURKO0FBK0RFO0VBQ0UsbUJBQUE7RUFDQSxzQkFBQTtFQUNBLCtCQUFBO0FBN0RKO0FBZ0VFO0VBQ0UsbUJBQUE7RUFDQSxxQkFBQTtBQTlESjtBQWlFRTtFQUNFLGdCQUFBO0FBL0RKO0FBbUVFO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSx5QkFBQTtBQWpFSjtBQW9FRTtFQUNFLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGNBQUE7QUFsRUo7QUFzRUU7RUFDRSxVQUFBO0FBcEVKO0FBdUVFO0VBQ0Usd0JBQUE7RUFDQSxrQkFBQTtBQXJFSjtBQXdFRTtFQUNFLG1CQUFBO0VBQ0Esa0JBQUE7QUF0RUo7QUF5RUU7RUFDRSxtQkFBQTtBQXZFSjtBQTJFRTtFQUNFO0lBQ0UsZ0JBQUE7RUF6RUo7RUE0RUU7SUFDRSx1QkFBQTtFQTFFSjtFQTZFRTtJQUNFLG9CQUFBO0VBM0VKO0VBOEVFO0lBQ0UsdUJBQUE7SUFDQSxpQkFBQTtFQTVFSjtFQStFRTtJQUNFLHVCQUFBO0VBN0VKO0VBZ0ZFO0lBQ0UsOEJBQUE7RUE5RUo7QUFDRjtBQWlGRTtFQUNFO0lBQ0UsMEJBQUE7RUEvRUo7RUFrRkU7SUFDRSxlQUFBO0VBaEZKO0FBQ0YiLCJmaWxlIjoiYmFzZWxpbmUtc3VydmV5LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmFsb28rMjp3Z2h0QDUwMDs2MDA7NzAwJmZhbWlseT1JbnRlcjp3Z2h0QDQwMDs1MDA7NjAwOzcwMCZkaXNwbGF5PXN3YXAnKTtcblxuLyogTWFrZSB0aGUgQW5ndWxhciBNYXRlcmlhbCBkaWFsb2cgaHVnIHRoZSB3aXphcmQgY2FyZCAqL1xuLnN1cnZleS13cmFwcGVyIHtcbiAgOmhvc3QgOjpuZy1kZWVwIC5tYXQtZGlhbG9nLWNvbnRhaW5lciB7XG4gICAgcGFkZGluZzogMDtcbiAgICBtYXgtd2lkdGg6IDEwMHZ3O1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgYm94LXNoYWRvdzogMCAyNXB4IDUwcHggLTEycHggcmdiYSgzMCwgNDEsIDU5LCAwLjI1KTtcbiAgfVxuXG4gIC0tYmx1ZTogIzNGOTFEQTtcbiAgLS1ibHVlLWRlZXA6ICMxYTRkN2E7XG4gIC0tYmx1ZS1wYWxlOiAjRUFGM0ZCO1xuICAtLWluazogIzFFMjkzQjtcbiAgLS1pbmstc29mdDogIzQ3NTU2OTtcbiAgLS1saW5lOiAjRTJFOEYwO1xuICAtLXBhbmVsOiAjRjhGQUZDO1xuICAtLXN1Y2Nlc3M6ICMyRTlFNkY7XG4gIC0tZGFuZ2VyOiAjREMyNjI2O1xuICAtLXdhcm4tYmc6ICNGRkYzRTA7XG4gIC0td2Fybi1ib3JkZXI6ICNGRkUwQjI7XG4gIC0td2Fybi10ZXh0OiAjOTI2MDFBO1xuICAtLWRpc2FibGVkLWJnOiAjRjFGNUY5O1xuICAtLWRpc2FibGVkLWJvcmRlcjogI0UyRThGMDtcbiAgLS1kaXNhYmxlZC10ZXh0OiAjOTRBM0I4O1xuXG4gIGZvbnQtZmFtaWx5OiAnSW50ZXInLFxuICAtYXBwbGUtc3lzdGVtLFxuICBCbGlua01hY1N5c3RlbUZvbnQsXG4gICdTZWdvZSBVSScsXG4gIFJvYm90byxcbiAgc2Fucy1zZXJpZjtcbiAgd2lkdGg6IDEwMCU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgKiB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgfVxuXG4gIC53aXphcmQtY2FyZCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWF4LXdpZHRoOiA2NDBweDtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xuICAgIG1heC1oZWlnaHQ6IDg1dmg7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBJTlRSTyBTQ1JFRU4gLS0tLS0tLS0tLSAqL1xuICAuaW50cm8tc2NyZWVuIHtcbiAgICBwYWRkaW5nOiA0NHB4IDM2cHggNDBweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cblxuICAuaW50cm8tYmFkZ2Uge1xuICAgIHdpZHRoOiA2NHB4O1xuICAgIGhlaWdodDogNjRweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyKC0tYmx1ZSksIHZhcigtLWJsdWUtZGVlcCkpO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBmb250LXNpemU6IDI4cHg7XG4gICAgbWFyZ2luOiAwIGF1dG8gMThweDtcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCAtOHB4IHJnYmEoNjMsIDE0NSwgMjE4LCAwLjUpO1xuICB9XG5cbiAgLmludHJvLXBpbGxzIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGdhcDogOHB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICB9XG5cbiAgLnBpbGwge1xuICAgIGZvbnQtc2l6ZTogMC43OHJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIHBhZGRpbmc6IDZweCAxNHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XG4gICAgYmFja2dyb3VuZDogI0VBRjNGQjtcbiAgICBjb2xvcjogIzBGM0E1QztcbiAgfVxuXG4gIC5waWxsLXRpbWUge1xuICAgIGJhY2tncm91bmQ6ICNFQUYzRkI7XG4gICAgY29sb3I6ICMwRjNBNUM7XG4gIH1cblxuICAucGlsbC13YXJuIHtcbiAgICBiYWNrZ3JvdW5kOiAjRkVGMkYyO1xuICAgIGNvbG9yOiB2YXIoLS1kYW5nZXIpO1xuICB9XG5cbiAgLmludHJvLXNjcmVlbiBoMSB7XG4gICAgZm9udC1mYW1pbHk6ICdCYWxvbyAyJywgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDEuNnJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGNvbG9yOiB2YXIoLS1pbmspO1xuICAgIG1hcmdpbjogMCAwIDEwcHg7XG4gIH1cblxuICAuaW50cm8tc2NyZWVuIHAge1xuICAgIGNvbG9yOiB2YXIoLS1pbmstc29mdCk7XG4gICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjY7XG4gICAgbWF4LXdpZHRoOiA0NDBweDtcbiAgICBtYXJnaW46IDAgYXV0byAyOHB4O1xuICB9XG5cbiAgLmludHJvLWFjdGlvbnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDEwcHg7XG4gICAgbWF4LXdpZHRoOiAzNDBweDtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgfVxuXG4gIC8qIC0tLS0tLS0tLS0gRE9ORSBTQ1JFRU4gLS0tLS0tLS0tLSAqL1xuICAuZG9uZS1zY3JlZW4ge1xuICAgIHBhZGRpbmc6IDU2cHggMzZweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cblxuICAuZG9uZS1iYWRnZSB7XG4gICAgd2lkdGg6IDcycHg7XG4gICAgaGVpZ2h0OiA3MnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjM0VCRThDLCB2YXIoLS1zdWNjZXNzKSk7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGZvbnQtc2l6ZTogMzJweDtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgbWFyZ2luOiAwIGF1dG8gMjBweDtcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCAtOHB4IHJnYmEoNDYsIDE1OCwgMTExLCAwLjQ1KTtcbiAgfVxuXG4gIC5kb25lLXNjcmVlbiBoMSB7XG4gICAgZm9udC1mYW1pbHk6ICdCYWxvbyAyJywgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGNvbG9yOiB2YXIoLS1pbmspO1xuICAgIG1hcmdpbjogMCAwIDhweDtcbiAgfVxuXG4gIC5kb25lLXNjcmVlbiBwIHtcbiAgICBjb2xvcjogdmFyKC0taW5rLXNvZnQpO1xuICAgIGZvbnQtc2l6ZTogMC45M3JlbTtcbiAgICBsaW5lLWhlaWdodDogMS42O1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBQUk9HUkVTUyAvIFRBTExZIFRSQUNLIC0tLS0tLS0tLS0gKi9cbiAgLnByb2dyZXNzLWJsb2NrIHtcbiAgICBwYWRkaW5nOiAyNHB4IDMycHggMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiAxMHB4O1xuICB9XG5cbiAgLnByb2dyZXNzLXRvcCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxuXG4gIC5wcm9ncmVzcy1sYWJlbCB7XG4gICAgZm9udC1zaXplOiAwLjg1cmVtO1xuICAgIGNvbG9yOiB2YXIoLS1pbmstc29mdCk7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuXG4gIC50YWxseS10cmFjayB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBnYXA6IDVweDtcbiAgfVxuXG4gIC50YWxseSB7XG4gICAgZmxleDogMTtcbiAgICBoZWlnaHQ6IDhweDtcbiAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tbGluZSk7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gIH1cblxuICAudGFsbHk6OmFmdGVyIHtcbiAgICBjb250ZW50OiAnJztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgaW5zZXQ6IDA7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCB2YXIoLS1ibHVlKSwgdmFyKC0tYmx1ZS1kZWVwKSk7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVgoMCk7XG4gICAgdHJhbnNmb3JtLW9yaWdpbjogbGVmdDtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC40cyBjdWJpYy1iZXppZXIoLjQsIDAsIC4yLCAxKTtcbiAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIH1cblxuICAudGFsbHkuZG9uZTo6YWZ0ZXIge1xuICAgIHRyYW5zZm9ybTogc2NhbGVYKDEpO1xuICB9XG5cbiAgLnRhbGx5LmN1cnJlbnQ6OmFmdGVyIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWCgxKTtcbiAgICBvcGFjaXR5OiAwLjU1O1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBRVUVTVElPTiBTVEFHRSAtLS0tLS0tLS0tICovXG4gIC5zdGFnZSB7XG4gICAgcGFkZGluZzogMjhweCAzMnB4IDI0cHg7XG4gICAgbWluLWhlaWdodDogMzIwcHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB9XG5cbiAgLnF1ZXN0aW9uIHtcbiAgICBmb250LWZhbWlseTogJ0JhbG9vIDInLCBzYW5zLXNlcmlmO1xuICAgIGZvbnQtc2l6ZTogMS4yNXJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gICAgY29sb3I6IHZhcigtLWluayk7XG4gICAgbWFyZ2luOiAwIDAgNHB4O1xuICB9XG5cbiAgLmhpbnQge1xuICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICBjb2xvcjogdmFyKC0taW5rLXNvZnQpO1xuICAgIG1hcmdpbjogMCAwIDIwcHg7XG4gIH1cblxuICAvKiBFeHBsYW5hdG9yeSBub3RlIHNob3duIHdoZW4gYW4gZXhjbHVzaXZlIG9wdGlvbiAoZS5nLiBcIk5vbmUgb2YgdGhlIGFib3ZlXCIpXG4gICAgIGlzIHNlbGVjdGVkIGFuZCBvdGhlciBvcHRpb25zIGFyZSBsb2NrZWQgKi9cbiAgLmV4Y2x1c2l2ZS1ub3RlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG4gICAgZm9udC1zaXplOiAwLjgycmVtO1xuICAgIGNvbG9yOiB2YXIoLS13YXJuLXRleHQpO1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXdhcm4tYmcpO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXdhcm4tYm9yZGVyKTtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIHBhZGRpbmc6IDEwcHggMTRweDtcbiAgICBtYXJnaW4tYm90dG9tOiAxNHB4O1xuICB9XG5cbiAgLm9wdGlvbnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDEwcHg7XG4gIH1cblxuICAub3B0aW9ucy5ncmlkMiB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XG4gICAgZ2FwOiAxMHB4O1xuICB9XG5cbiAgLm9wdCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMTJweDtcbiAgICBwYWRkaW5nOiAxNHB4IDE2cHg7XG4gICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICBib3JkZXI6IDEuNXB4IHNvbGlkIHZhcigtLWxpbmUpO1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXBhbmVsKTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgY29sb3I6IHZhcigtLWluayk7XG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMTVzIGVhc2U7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIH1cblxuICAub3B0OmhvdmVyIHtcbiAgICBib3JkZXItY29sb3I6ICNBOUNCRUE7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmx1ZS1wYWxlKTtcbiAgfVxuXG4gIC5vcHQgLm1hcmsge1xuICAgIHdpZHRoOiAyMnB4O1xuICAgIGhlaWdodDogMjJweDtcbiAgICBib3JkZXItcmFkaXVzOiA3cHg7XG4gICAgYm9yZGVyOiAycHggc29saWQgI0M5RDZFNDtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4xNXMgZWFzZTtcbiAgfVxuXG4gIC5vcHQucmFkaW8gLm1hcmsge1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgfVxuXG4gIC5vcHQuc2VsZWN0ZWQge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJsdWUtcGFsZSk7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1ibHVlKTtcbiAgICBjb2xvcjogdmFyKC0tYmx1ZS1kZWVwKTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICB9XG5cbiAgLm9wdC5zZWxlY3RlZCAubWFyayB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmx1ZSk7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1ibHVlKTtcbiAgfVxuXG4gIC5vcHQuc2VsZWN0ZWQuY2hlY2sgLm1hcms6OmFmdGVyIHtcbiAgICBjb250ZW50OiAn4pyTJztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgaW5zZXQ6IDA7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIH1cblxuICAub3B0LnNlbGVjdGVkLnJhZGlvIC5tYXJrOjphZnRlciB7XG4gICAgY29udGVudDogJyc7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogNTAlO1xuICAgIGxlZnQ6IDUwJTtcbiAgICB3aWR0aDogOHB4O1xuICAgIGhlaWdodDogOHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgfVxuXG4gIC8qIERpc2FibGVkIG9wdGlvbjogY2xlYXJseSBncmV5ZWQgb3V0LCBub3QganVzdCBzbGlnaHRseSBmYWRlZC5cbiAgICAgVXNlZCB3aGVuIGFuIGV4Y2x1c2l2ZSBvcHRpb24gbGlrZSBcIk5vbmUgb2YgdGhlIGFib3ZlXCIgaXMgc2VsZWN0ZWQuICovXG4gIC5vcHQuZGlzYWJsZWQge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWRpc2FibGVkLWJnKTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWRpc2FibGVkLWJvcmRlcik7XG4gICAgY29sb3I6IHZhcigtLWRpc2FibGVkLXRleHQpO1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cblxuICAub3B0LmRpc2FibGVkOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1kaXNhYmxlZC1iZyk7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1kaXNhYmxlZC1ib3JkZXIpO1xuICB9XG5cbiAgLm9wdC5kaXNhYmxlZCBzcGFuIHtcbiAgICBjb2xvcjogdmFyKC0tZGlzYWJsZWQtdGV4dCk7XG4gIH1cblxuICAub3B0LmRpc2FibGVkIC5tYXJrIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1kaXNhYmxlZC1ib3JkZXIpO1xuICAgIGJvcmRlci1jb2xvcjogI0NCRDVFMTtcbiAgfVxuXG4gIC8qIEluIGNhc2UgYW4gb3B0aW9uIHdhcyBjaGVja2VkIGJlZm9yZSBiZWNvbWluZyBkaXNhYmxlZCwga2VlcCBpdCBtdXRlZFxuICAgICByYXRoZXIgdGhhbiBibHVlICovXG4gIC5vcHQuZGlzYWJsZWQuc2VsZWN0ZWQge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWRpc2FibGVkLWJnKTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWRpc2FibGVkLWJvcmRlcik7XG4gICAgY29sb3I6IHZhcigtLWRpc2FibGVkLXRleHQpO1xuICB9XG5cbiAgLm9wdC5kaXNhYmxlZC5zZWxlY3RlZCAubWFyayB7XG4gICAgYmFja2dyb3VuZDogI0NCRDVFMTtcbiAgICBib3JkZXItY29sb3I6ICNDQkQ1RTE7XG4gIH1cblxuICAub3RoZXItYm94IHtcbiAgICBtYXJnaW4tdG9wOiAxMnB4O1xuICB9XG5cbiAgLm90aGVyLWJveCBpbnB1dCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcGFkZGluZzogMTJweCAxNHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgYm9yZGVyOiAxLjVweCBzb2xpZCB2YXIoLS1saW5lKTtcbiAgICBmb250LWZhbWlseTogJ0ludGVyJywgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDAuOTJyZW07XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcGFuZWwpO1xuICB9XG5cbiAgLm90aGVyLWJveCBpbnB1dDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWJsdWUpO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDYzLCAxNDUsIDIxOCwgMC4xMik7XG4gIH1cblxuICB0ZXh0YXJlYSB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWluLWhlaWdodDogMTIwcHg7XG4gICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICBib3JkZXI6IDEuNXB4IHNvbGlkIHZhcigtLWxpbmUpO1xuICAgIHBhZGRpbmc6IDE0cHggMTZweDtcbiAgICBmb250LWZhbWlseTogJ0ludGVyJywgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDAuOTVyZW07XG4gICAgcmVzaXplOiB2ZXJ0aWNhbDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wYW5lbCk7XG4gIH1cblxuICB0ZXh0YXJlYTpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWJsdWUpO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDYzLCAxNDUsIDIxOCwgMC4xMik7XG4gIH1cblxuICAuZmllbGQtbnVkZ2Uge1xuICAgIGZvbnQtc2l6ZTogMC44cmVtO1xuICAgIGNvbG9yOiB2YXIoLS1kYW5nZXIpO1xuICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tIE5BViAtLS0tLS0tLS0tICovXG4gIC5uYXYge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxNnB4O1xuICAgIHBhZGRpbmc6IDE4cHggMzJweCAyOHB4O1xuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcbiAgfVxuXG4gIC5idG4ge1xuICAgIGZvbnQtZmFtaWx5OiAnSW50ZXInLCBzYW5zLXNlcmlmO1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgZm9udC1zaXplOiAwLjkycmVtO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgIHBhZGRpbmc6IDEycHggMjJweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMTVzIGVhc2U7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBnYXA6IDZweDtcbiAgfVxuXG4gIC5idG4tYmFjayB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgY29sb3I6IHZhcigtLWluay1zb2Z0KTtcbiAgICBwYWRkaW5nLWxlZnQ6IDhweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA4cHg7XG4gIH1cblxuICAuYnRuLWJhY2s6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgIGNvbG9yOiB2YXIoLS1pbmspO1xuICB9XG5cbiAgLmJ0bi1iYWNrOmRpc2FibGVkIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG5cbiAgLmJ0bi1uZXh0LFxuICAuYnRuLXN0YXJ0IHtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1ibHVlKSwgdmFyKC0tYmx1ZS1kZWVwKSk7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggLTZweCByZ2JhKDQ0LCAxMTYsIDE4MSwgMC40NSk7XG4gICAgbWluLXdpZHRoOiAxMzBweDtcbiAgfVxuXG4gIC5idG4tbmV4dDpob3Zlcjpub3QoOmRpc2FibGVkKSxcbiAgLmJ0bi1zdGFydDpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpO1xuICAgIGJveC1zaGFkb3c6IDAgMTBweCAyNHB4IC02cHggcmdiYSg0NCwgMTE2LCAxODEsIDAuNTUpO1xuICB9XG5cbiAgLmJ0bi1uZXh0OmRpc2FibGVkIHtcbiAgICBvcGFjaXR5OiAwLjc7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICB0cmFuc2Zvcm06IG5vbmU7XG4gIH1cblxuICAuYnRuLXJlbWluZCB7XG4gICAgYmFja2dyb3VuZDogI0Y4RkFGQztcbiAgICBjb2xvcjogdmFyKC0taW5rLXNvZnQpO1xuICAgIGJvcmRlcjogMS41cHggc29saWQgdmFyKC0tbGluZSk7XG4gIH1cblxuICAuYnRuLXJlbWluZDpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgYmFja2dyb3VuZDogI0YxRjVGOTtcbiAgICBib3JkZXItY29sb3I6ICNDQkQ1RTE7XG4gIH1cblxuICAucmVtaW5kLWNvdW50IHtcbiAgICBmb250LXNpemU6IDAuOGVtO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBFUlJPUiBNRVNTQUdFIC0tLS0tLS0tLS0gKi9cbiAgLmVycm9yLW1lc3NhZ2Uge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEycHg7XG4gICAgY29sb3I6IHZhcigtLWRhbmdlcik7XG4gICAgYmFja2dyb3VuZDogI0ZFRjJGMjtcbiAgICBwYWRkaW5nOiAxNHB4IDIwcHggMThweDtcbiAgICBtYXJnaW46IDAgMzJweCAyMHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI0ZFQ0FDQTtcbiAgfVxuXG4gIC5lcnJvci1tZXNzYWdlIG1hdC1pY29uIHtcbiAgICBmb250LXNpemU6IDIwcHg7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICAgIGZsZXgtc2hyaW5rOiAwO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBTQ1JPTExCQVIgLS0tLS0tLS0tLSAqL1xuICAud2l6YXJkLWNhcmQ6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICB3aWR0aDogOHB4O1xuICB9XG5cbiAgLndpemFyZC1jYXJkOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcGFuZWwpO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgfVxuXG4gIC53aXphcmQtY2FyZDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJhY2tncm91bmQ6ICNDQkQ1RTE7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB9XG5cbiAgLndpemFyZC1jYXJkOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogIzk0QTNCODtcbiAgfVxuXG4gIC8qIC0tLS0tLS0tLS0gUkVTUE9OU0lWRSAtLS0tLS0tLS0tICovXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAgIC53aXphcmQtY2FyZCB7XG4gICAgICBtYXgtaGVpZ2h0OiA5MHZoO1xuICAgIH1cblxuICAgIC5pbnRyby1zY3JlZW4ge1xuICAgICAgcGFkZGluZzogMzJweCAyNHB4IDI4cHg7XG4gICAgfVxuXG4gICAgLnByb2dyZXNzLWJsb2NrIHtcbiAgICAgIHBhZGRpbmc6IDIwcHggMjBweCAwO1xuICAgIH1cblxuICAgIC5zdGFnZSB7XG4gICAgICBwYWRkaW5nOiAyMnB4IDIwcHggMThweDtcbiAgICAgIG1pbi1oZWlnaHQ6IDI2MHB4O1xuICAgIH1cblxuICAgIC5uYXYge1xuICAgICAgcGFkZGluZzogMTZweCAyMHB4IDIycHg7XG4gICAgfVxuXG4gICAgLm9wdGlvbnMuZ3JpZDIge1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xuICAgIH1cbiAgfVxuXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCkge1xuICAgIC5vcHRpb25zLmdyaWQyIHtcbiAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICAgIH1cblxuICAgIC5pbnRyby1hY3Rpb25zIHtcbiAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICB9XG4gIH1cbn0iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvYmFzZWxpbmUtc3VydmV5L2Jhc2VsaW5lLXN1cnZleS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxnQkFBZ0I7QUFFaEIseURBQUE7QUFDQTtFQVFFLGVBQUE7RUFDQSxvQkFBQTtFQUNBLG9CQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxpQkFBQTtFQUNBLGtCQUFBO0VBQ0Esc0JBQUE7RUFDQSxvQkFBQTtFQUNBLHNCQUFBO0VBQ0EsMEJBQUE7RUFDQSx3QkFBQTtFQUVBLHVGQUFBO0VBTUEsV0FBQTtFQUNBLHNCQUFBO0VBaUJBLHVDQUFBO0VBc0VBLHNDQUFBO0VBa0NBLGlEQUFBO0VBc0RBLHlDQUFBO0VBdUJBOytDQUFBO0VBa0dBOzBFQUFBO0VBd0JBO3VCQUFBO0VBMkRBLDhCQUFBO0VBNEVBLHdDQUFBO0VBc0JBLG9DQUFBO0VBbUJBLHFDQUFBO0FBL2VGO0FBL0JFO0VBQ0UsVUFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxvREFBQTtBQWlDSjtBQUxFO0VBQ0Usc0JBQUE7QUFPSjtBQUpFO0VBQ0UsV0FBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0Esa0JBQUE7QUFNSjtBQUZFO0VBQ0UsdUJBQUE7RUFDQSxrQkFBQTtBQUlKO0FBREU7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0Esa0VBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGVBQUE7RUFDQSxtQkFBQTtFQUNBLG9EQUFBO0FBR0o7QUFBRTtFQUNFLGFBQUE7RUFDQSxRQUFBO0VBQ0EsdUJBQUE7RUFDQSxlQUFBO0VBQ0EsbUJBQUE7QUFFSjtBQUNFO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsbUJBQUE7RUFDQSxtQkFBQTtFQUNBLGNBQUE7QUFDSjtBQUVFO0VBQ0UsbUJBQUE7RUFDQSxjQUFBO0FBQUo7QUFHRTtFQUNFLG1CQUFBO0VBQ0Esb0JBQUE7QUFESjtBQUlFO0VBQ0Usa0NBQUE7RUFDQSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtBQUZKO0FBS0U7RUFDRSxzQkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxnQkFBQTtFQUNBLG1CQUFBO0FBSEo7QUFNRTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxnQkFBQTtFQUNBLGNBQUE7QUFKSjtBQVFFO0VBQ0Usa0JBQUE7RUFDQSxrQkFBQTtBQU5KO0FBU0U7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsNERBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLGVBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSxxREFBQTtBQVBKO0FBVUU7RUFDRSxrQ0FBQTtFQUNBLGlCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLGVBQUE7QUFSSjtBQVdFO0VBQ0Usc0JBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBVEo7QUFhRTtFQUNFLG9CQUFBO0VBQ0EsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtBQVhKO0FBY0U7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtBQVpKO0FBZUU7RUFDRSxrQkFBQTtFQUNBLHNCQUFBO0VBQ0EsZ0JBQUE7QUFiSjtBQWdCRTtFQUNFLGFBQUE7RUFDQSxRQUFBO0FBZEo7QUFpQkU7RUFDRSxPQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsdUJBQUE7RUFDQSxrQkFBQTtFQUNBLGdCQUFBO0FBZko7QUFrQkU7RUFDRSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxRQUFBO0VBQ0EsaUVBQUE7RUFDQSxvQkFBQTtFQUNBLHNCQUFBO0VBQ0EsdURBQUE7RUFDQSxrQkFBQTtBQWhCSjtBQW1CRTtFQUNFLG9CQUFBO0FBakJKO0FBb0JFO0VBQ0Usb0JBQUE7RUFDQSxhQUFBO0FBbEJKO0FBc0JFO0VBQ0UsdUJBQUE7RUFDQSxpQkFBQTtFQUNBLGFBQUE7RUFDQSxzQkFBQTtBQXBCSjtBQXVCRTtFQUNFLGtDQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxlQUFBO0FBckJKO0FBd0JFO0VBQ0Usa0JBQUE7RUFDQSxzQkFBQTtFQUNBLGdCQUFBO0FBdEJKO0FBMkJFO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsUUFBQTtFQUNBLGtCQUFBO0VBQ0EsdUJBQUE7RUFDQSwwQkFBQTtFQUNBLG9DQUFBO0VBQ0EsbUJBQUE7RUFDQSxrQkFBQTtFQUNBLG1CQUFBO0FBekJKO0FBNEJFO0VBQ0UsYUFBQTtFQUNBLHNCQUFBO0VBQ0EsU0FBQTtBQTFCSjtBQTZCRTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLFNBQUE7QUEzQko7QUE4QkU7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtFQUNBLCtCQUFBO0VBQ0Esd0JBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLGlCQUFBO0VBQ0EsMEJBQUE7RUFDQSx5QkFBQTtVQUFBLGlCQUFBO0FBNUJKO0FBK0JFO0VBQ0UscUJBQUE7RUFDQSw0QkFBQTtBQTdCSjtBQWdDRTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtFQUNBLGdCQUFBO0VBQ0EsY0FBQTtFQUNBLGtCQUFBO0VBQ0EsMEJBQUE7QUE5Qko7QUFpQ0U7RUFDRSxrQkFBQTtBQS9CSjtBQWtDRTtFQUNFLDRCQUFBO0VBQ0EseUJBQUE7RUFDQSx1QkFBQTtFQUNBLGdCQUFBO0FBaENKO0FBbUNFO0VBQ0UsdUJBQUE7RUFDQSx5QkFBQTtBQWpDSjtBQW9DRTtFQUNFLFlBQUE7RUFDQSxrQkFBQTtFQUNBLFFBQUE7RUFDQSxZQUFBO0VBQ0EsZUFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FBbENKO0FBcUNFO0VBQ0UsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsUUFBQTtFQUNBLFNBQUE7RUFDQSxVQUFBO0VBQ0EsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQ0FBQTtBQW5DSjtBQXdDRTtFQUNFLDhCQUFBO0VBQ0Esb0NBQUE7RUFDQSwyQkFBQTtFQUNBLG1CQUFBO0VBQ0Esb0JBQUE7QUF0Q0o7QUF5Q0U7RUFDRSw4QkFBQTtFQUNBLG9DQUFBO0FBdkNKO0FBMENFO0VBQ0UsMkJBQUE7QUF4Q0o7QUEyQ0U7RUFDRSxrQ0FBQTtFQUNBLHFCQUFBO0FBekNKO0FBOENFO0VBQ0UsOEJBQUE7RUFDQSxvQ0FBQTtFQUNBLDJCQUFBO0FBNUNKO0FBK0NFO0VBQ0UsbUJBQUE7RUFDQSxxQkFBQTtBQTdDSjtBQWdERTtFQUNFLGdCQUFBO0FBOUNKO0FBaURFO0VBQ0UsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7RUFDQSwrQkFBQTtFQUNBLGdDQUFBO0VBQ0Esa0JBQUE7RUFDQSx3QkFBQTtBQS9DSjtBQWtERTtFQUNFLGFBQUE7RUFDQSx5QkFBQTtFQUNBLGlCQUFBO0VBQ0EsOENBQUE7QUFoREo7QUFtREU7RUFDRSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLCtCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQ0FBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7RUFDQSx3QkFBQTtBQWpESjtBQW9ERTtFQUNFLGFBQUE7RUFDQSx5QkFBQTtFQUNBLGlCQUFBO0VBQ0EsOENBQUE7QUFsREo7QUFxREU7RUFDRSxpQkFBQTtFQUNBLG9CQUFBO0VBQ0EsZ0JBQUE7QUFuREo7QUF1REU7RUFDRSxhQUFBO0VBQ0EsOEJBQUE7RUFDQSxtQkFBQTtFQUNBLFNBQUE7RUFDQSx1QkFBQTtFQUNBLGlDQUFBO0FBckRKO0FBd0RFO0VBQ0UsZ0NBQUE7RUFDQSxnQkFBQTtFQUNBLGtCQUFBO0VBQ0EsWUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0VBQ0EsMEJBQUE7RUFDQSxvQkFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxRQUFBO0FBdERKO0FBeURFO0VBQ0UsdUJBQUE7RUFDQSxzQkFBQTtFQUNBLGlCQUFBO0VBQ0Esa0JBQUE7QUF2REo7QUEwREU7RUFDRSxpQkFBQTtBQXhESjtBQTJERTtFQUNFLFVBQUE7RUFDQSxvQkFBQTtBQXpESjtBQTRERTs7RUFFRSxrRUFBQTtFQUNBLFlBQUE7RUFDQSxvREFBQTtFQUNBLGdCQUFBO0FBMURKO0FBNkRFOztFQUVFLDJCQUFBO0VBQ0EscURBQUE7QUEzREo7QUE4REU7RUFDRSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0FBNURKO0FBK0RFO0VBQ0UsbUJBQUE7RUFDQSxzQkFBQTtFQUNBLCtCQUFBO0FBN0RKO0FBZ0VFO0VBQ0UsbUJBQUE7RUFDQSxxQkFBQTtBQTlESjtBQWlFRTtFQUNFLGdCQUFBO0FBL0RKO0FBbUVFO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsU0FBQTtFQUNBLG9CQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLG1CQUFBO0VBQ0EsbUJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSx5QkFBQTtBQWpFSjtBQW9FRTtFQUNFLGVBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGNBQUE7QUFsRUo7QUFzRUU7RUFDRSxVQUFBO0FBcEVKO0FBdUVFO0VBQ0Usd0JBQUE7RUFDQSxrQkFBQTtBQXJFSjtBQXdFRTtFQUNFLG1CQUFBO0VBQ0Esa0JBQUE7QUF0RUo7QUF5RUU7RUFDRSxtQkFBQTtBQXZFSjtBQTJFRTtFQUNFO0lBQ0UsZ0JBQUE7RUF6RUo7RUE0RUU7SUFDRSx1QkFBQTtFQTFFSjtFQTZFRTtJQUNFLG9CQUFBO0VBM0VKO0VBOEVFO0lBQ0UsdUJBQUE7SUFDQSxpQkFBQTtFQTVFSjtFQStFRTtJQUNFLHVCQUFBO0VBN0VKO0VBZ0ZFO0lBQ0UsOEJBQUE7RUE5RUo7QUFDRjtBQWlGRTtFQUNFO0lBQ0UsMEJBQUE7RUEvRUo7RUFrRkU7SUFDRSxlQUFBO0VBaEZKO0FBQ0Y7QUFFQSxveHFCQUFveHFCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gQGltcG9ydCB1cmwoJ2h0dHBzOi8vZm9udHMuZ29vZ2xlYXBpcy5jb20vY3NzMj9mYW1pbHk9QmFsb28rMjp3Z2h0QDUwMDs2MDA7NzAwJmZhbWlseT1JbnRlcjp3Z2h0QDQwMDs1MDA7NjAwOzcwMCZkaXNwbGF5PXN3YXAnKTtcblxuLyogTWFrZSB0aGUgQW5ndWxhciBNYXRlcmlhbCBkaWFsb2cgaHVnIHRoZSB3aXphcmQgY2FyZCAqL1xuLnN1cnZleS13cmFwcGVyIHtcbiAgOmhvc3QgOjpuZy1kZWVwIC5tYXQtZGlhbG9nLWNvbnRhaW5lciB7XG4gICAgcGFkZGluZzogMDtcbiAgICBtYXgtd2lkdGg6IDEwMHZ3O1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gICAgYm94LXNoYWRvdzogMCAyNXB4IDUwcHggLTEycHggcmdiYSgzMCwgNDEsIDU5LCAwLjI1KTtcbiAgfVxuXG4gIC0tYmx1ZTogIzNGOTFEQTtcbiAgLS1ibHVlLWRlZXA6ICMxYTRkN2E7XG4gIC0tYmx1ZS1wYWxlOiAjRUFGM0ZCO1xuICAtLWluazogIzFFMjkzQjtcbiAgLS1pbmstc29mdDogIzQ3NTU2OTtcbiAgLS1saW5lOiAjRTJFOEYwO1xuICAtLXBhbmVsOiAjRjhGQUZDO1xuICAtLXN1Y2Nlc3M6ICMyRTlFNkY7XG4gIC0tZGFuZ2VyOiAjREMyNjI2O1xuICAtLXdhcm4tYmc6ICNGRkYzRTA7XG4gIC0td2Fybi1ib3JkZXI6ICNGRkUwQjI7XG4gIC0td2Fybi10ZXh0OiAjOTI2MDFBO1xuICAtLWRpc2FibGVkLWJnOiAjRjFGNUY5O1xuICAtLWRpc2FibGVkLWJvcmRlcjogI0UyRThGMDtcbiAgLS1kaXNhYmxlZC10ZXh0OiAjOTRBM0I4O1xuXG4gIGZvbnQtZmFtaWx5OiAnSW50ZXInLFxuICAtYXBwbGUtc3lzdGVtLFxuICBCbGlua01hY1N5c3RlbUZvbnQsXG4gICdTZWdvZSBVSScsXG4gIFJvYm90byxcbiAgc2Fucy1zZXJpZjtcbiAgd2lkdGg6IDEwMCU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG5cbiAgKiB7XG4gICAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbiAgfVxuXG4gIC53aXphcmQtY2FyZCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWF4LXdpZHRoOiA2NDBweDtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgICBiYWNrZ3JvdW5kOiAjZmZmZmZmO1xuICAgIG1heC1oZWlnaHQ6IDg1dmg7XG4gICAgb3ZlcmZsb3cteTogYXV0bztcbiAgICBvdmVyZmxvdy14OiBoaWRkZW47XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBJTlRSTyBTQ1JFRU4gLS0tLS0tLS0tLSAqL1xuICAuaW50cm8tc2NyZWVuIHtcbiAgICBwYWRkaW5nOiA0NHB4IDM2cHggNDBweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cblxuICAuaW50cm8tYmFkZ2Uge1xuICAgIHdpZHRoOiA2NHB4O1xuICAgIGhlaWdodDogNjRweDtcbiAgICBib3JkZXItcmFkaXVzOiA1MCU7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyKC0tYmx1ZSksIHZhcigtLWJsdWUtZGVlcCkpO1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBmb250LXNpemU6IDI4cHg7XG4gICAgbWFyZ2luOiAwIGF1dG8gMThweDtcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCAtOHB4IHJnYmEoNjMsIDE0NSwgMjE4LCAwLjUpO1xuICB9XG5cbiAgLmludHJvLXBpbGxzIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGdhcDogOHB4O1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGZsZXgtd3JhcDogd3JhcDtcbiAgICBtYXJnaW4tYm90dG9tOiAyMHB4O1xuICB9XG5cbiAgLnBpbGwge1xuICAgIGZvbnQtc2l6ZTogMC43OHJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIHBhZGRpbmc6IDZweCAxNHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDIwcHg7XG4gICAgYmFja2dyb3VuZDogI0VBRjNGQjtcbiAgICBjb2xvcjogIzBGM0E1QztcbiAgfVxuXG4gIC5waWxsLXRpbWUge1xuICAgIGJhY2tncm91bmQ6ICNFQUYzRkI7XG4gICAgY29sb3I6ICMwRjNBNUM7XG4gIH1cblxuICAucGlsbC13YXJuIHtcbiAgICBiYWNrZ3JvdW5kOiAjRkVGMkYyO1xuICAgIGNvbG9yOiB2YXIoLS1kYW5nZXIpO1xuICB9XG5cbiAgLmludHJvLXNjcmVlbiBoMSB7XG4gICAgZm9udC1mYW1pbHk6ICdCYWxvbyAyJywgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDEuNnJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGNvbG9yOiB2YXIoLS1pbmspO1xuICAgIG1hcmdpbjogMCAwIDEwcHg7XG4gIH1cblxuICAuaW50cm8tc2NyZWVuIHAge1xuICAgIGNvbG9yOiB2YXIoLS1pbmstc29mdCk7XG4gICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjY7XG4gICAgbWF4LXdpZHRoOiA0NDBweDtcbiAgICBtYXJnaW46IDAgYXV0byAyOHB4O1xuICB9XG5cbiAgLmludHJvLWFjdGlvbnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDEwcHg7XG4gICAgbWF4LXdpZHRoOiAzNDBweDtcbiAgICBtYXJnaW46IDAgYXV0bztcbiAgfVxuXG4gIC8qIC0tLS0tLS0tLS0gRE9ORSBTQ1JFRU4gLS0tLS0tLS0tLSAqL1xuICAuZG9uZS1zY3JlZW4ge1xuICAgIHBhZGRpbmc6IDU2cHggMzZweDtcbiAgICB0ZXh0LWFsaWduOiBjZW50ZXI7XG4gIH1cblxuICAuZG9uZS1iYWRnZSB7XG4gICAgd2lkdGg6IDcycHg7XG4gICAgaGVpZ2h0OiA3MnB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCAjM0VCRThDLCB2YXIoLS1zdWNjZXNzKSk7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xuICAgIGZvbnQtc2l6ZTogMzJweDtcbiAgICBjb2xvcjogd2hpdGU7XG4gICAgbWFyZ2luOiAwIGF1dG8gMjBweDtcbiAgICBib3gtc2hhZG93OiAwIDEwcHggMjRweCAtOHB4IHJnYmEoNDYsIDE1OCwgMTExLCAwLjQ1KTtcbiAgfVxuXG4gIC5kb25lLXNjcmVlbiBoMSB7XG4gICAgZm9udC1mYW1pbHk6ICdCYWxvbyAyJywgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDEuNXJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGNvbG9yOiB2YXIoLS1pbmspO1xuICAgIG1hcmdpbjogMCAwIDhweDtcbiAgfVxuXG4gIC5kb25lLXNjcmVlbiBwIHtcbiAgICBjb2xvcjogdmFyKC0taW5rLXNvZnQpO1xuICAgIGZvbnQtc2l6ZTogMC45M3JlbTtcbiAgICBsaW5lLWhlaWdodDogMS42O1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBQUk9HUkVTUyAvIFRBTExZIFRSQUNLIC0tLS0tLS0tLS0gKi9cbiAgLnByb2dyZXNzLWJsb2NrIHtcbiAgICBwYWRkaW5nOiAyNHB4IDMycHggMDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiAxMHB4O1xuICB9XG5cbiAgLnByb2dyZXNzLXRvcCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgfVxuXG4gIC5wcm9ncmVzcy1sYWJlbCB7XG4gICAgZm9udC1zaXplOiAwLjg1cmVtO1xuICAgIGNvbG9yOiB2YXIoLS1pbmstc29mdCk7XG4gICAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgfVxuXG4gIC50YWxseS10cmFjayB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBnYXA6IDVweDtcbiAgfVxuXG4gIC50YWxseSB7XG4gICAgZmxleDogMTtcbiAgICBoZWlnaHQ6IDhweDtcbiAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tbGluZSk7XG4gICAgcG9zaXRpb246IHJlbGF0aXZlO1xuICAgIG92ZXJmbG93OiBoaWRkZW47XG4gIH1cblxuICAudGFsbHk6OmFmdGVyIHtcbiAgICBjb250ZW50OiAnJztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgaW5zZXQ6IDA7XG4gICAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDkwZGVnLCB2YXIoLS1ibHVlKSwgdmFyKC0tYmx1ZS1kZWVwKSk7XG4gICAgdHJhbnNmb3JtOiBzY2FsZVgoMCk7XG4gICAgdHJhbnNmb3JtLW9yaWdpbjogbGVmdDtcbiAgICB0cmFuc2l0aW9uOiB0cmFuc2Zvcm0gMC40cyBjdWJpYy1iZXppZXIoLjQsIDAsIC4yLCAxKTtcbiAgICBib3JkZXItcmFkaXVzOiA2cHg7XG4gIH1cblxuICAudGFsbHkuZG9uZTo6YWZ0ZXIge1xuICAgIHRyYW5zZm9ybTogc2NhbGVYKDEpO1xuICB9XG5cbiAgLnRhbGx5LmN1cnJlbnQ6OmFmdGVyIHtcbiAgICB0cmFuc2Zvcm06IHNjYWxlWCgxKTtcbiAgICBvcGFjaXR5OiAwLjU1O1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBRVUVTVElPTiBTVEFHRSAtLS0tLS0tLS0tICovXG4gIC5zdGFnZSB7XG4gICAgcGFkZGluZzogMjhweCAzMnB4IDI0cHg7XG4gICAgbWluLWhlaWdodDogMzIwcHg7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICB9XG5cbiAgLnF1ZXN0aW9uIHtcbiAgICBmb250LWZhbWlseTogJ0JhbG9vIDInLCBzYW5zLXNlcmlmO1xuICAgIGZvbnQtc2l6ZTogMS4yNXJlbTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICAgIGxpbmUtaGVpZ2h0OiAxLjQ7XG4gICAgY29sb3I6IHZhcigtLWluayk7XG4gICAgbWFyZ2luOiAwIDAgNHB4O1xuICB9XG5cbiAgLmhpbnQge1xuICAgIGZvbnQtc2l6ZTogMC44NXJlbTtcbiAgICBjb2xvcjogdmFyKC0taW5rLXNvZnQpO1xuICAgIG1hcmdpbjogMCAwIDIwcHg7XG4gIH1cblxuICAvKiBFeHBsYW5hdG9yeSBub3RlIHNob3duIHdoZW4gYW4gZXhjbHVzaXZlIG9wdGlvbiAoZS5nLiBcIk5vbmUgb2YgdGhlIGFib3ZlXCIpXG4gICAgIGlzIHNlbGVjdGVkIGFuZCBvdGhlciBvcHRpb25zIGFyZSBsb2NrZWQgKi9cbiAgLmV4Y2x1c2l2ZS1ub3RlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiA4cHg7XG4gICAgZm9udC1zaXplOiAwLjgycmVtO1xuICAgIGNvbG9yOiB2YXIoLS13YXJuLXRleHQpO1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXdhcm4tYmcpO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLXdhcm4tYm9yZGVyKTtcbiAgICBib3JkZXItcmFkaXVzOiAxMHB4O1xuICAgIHBhZGRpbmc6IDEwcHggMTRweDtcbiAgICBtYXJnaW4tYm90dG9tOiAxNHB4O1xuICB9XG5cbiAgLm9wdGlvbnMge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDEwcHg7XG4gIH1cblxuICAub3B0aW9ucy5ncmlkMiB7XG4gICAgZGlzcGxheTogZ3JpZDtcbiAgICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmciAxZnI7XG4gICAgZ2FwOiAxMHB4O1xuICB9XG5cbiAgLm9wdCB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBhbGlnbi1pdGVtczogY2VudGVyO1xuICAgIGdhcDogMTJweDtcbiAgICBwYWRkaW5nOiAxNHB4IDE2cHg7XG4gICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICBib3JkZXI6IDEuNXB4IHNvbGlkIHZhcigtLWxpbmUpO1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXBhbmVsKTtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgZm9udC1zaXplOiAwLjk1cmVtO1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgY29sb3I6IHZhcigtLWluayk7XG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMTVzIGVhc2U7XG4gICAgdXNlci1zZWxlY3Q6IG5vbmU7XG4gIH1cblxuICAub3B0OmhvdmVyIHtcbiAgICBib3JkZXItY29sb3I6ICNBOUNCRUE7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmx1ZS1wYWxlKTtcbiAgfVxuXG4gIC5vcHQgLm1hcmsge1xuICAgIHdpZHRoOiAyMnB4O1xuICAgIGhlaWdodDogMjJweDtcbiAgICBib3JkZXItcmFkaXVzOiA3cHg7XG4gICAgYm9yZGVyOiAycHggc29saWQgI0M5RDZFNDtcbiAgICBiYWNrZ3JvdW5kOiAjZmZmO1xuICAgIGZsZXgtc2hyaW5rOiAwO1xuICAgIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgICB0cmFuc2l0aW9uOiBhbGwgMC4xNXMgZWFzZTtcbiAgfVxuXG4gIC5vcHQucmFkaW8gLm1hcmsge1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgfVxuXG4gIC5vcHQuc2VsZWN0ZWQge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWJsdWUtcGFsZSk7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1ibHVlKTtcbiAgICBjb2xvcjogdmFyKC0tYmx1ZS1kZWVwKTtcbiAgICBmb250LXdlaWdodDogNjAwO1xuICB9XG5cbiAgLm9wdC5zZWxlY3RlZCAubWFyayB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tYmx1ZSk7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1ibHVlKTtcbiAgfVxuXG4gIC5vcHQuc2VsZWN0ZWQuY2hlY2sgLm1hcms6OmFmdGVyIHtcbiAgICBjb250ZW50OiAnw6LCnMKTJztcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgaW5zZXQ6IDA7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIGZvbnQtc2l6ZTogMTRweDtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIH1cblxuICAub3B0LnNlbGVjdGVkLnJhZGlvIC5tYXJrOjphZnRlciB7XG4gICAgY29udGVudDogJyc7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIHRvcDogNTAlO1xuICAgIGxlZnQ6IDUwJTtcbiAgICB3aWR0aDogOHB4O1xuICAgIGhlaWdodDogOHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgICBiYWNrZ3JvdW5kOiB3aGl0ZTtcbiAgICB0cmFuc2Zvcm06IHRyYW5zbGF0ZSgtNTAlLCAtNTAlKTtcbiAgfVxuXG4gIC8qIERpc2FibGVkIG9wdGlvbjogY2xlYXJseSBncmV5ZWQgb3V0LCBub3QganVzdCBzbGlnaHRseSBmYWRlZC5cbiAgICAgVXNlZCB3aGVuIGFuIGV4Y2x1c2l2ZSBvcHRpb24gbGlrZSBcIk5vbmUgb2YgdGhlIGFib3ZlXCIgaXMgc2VsZWN0ZWQuICovXG4gIC5vcHQuZGlzYWJsZWQge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWRpc2FibGVkLWJnKTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWRpc2FibGVkLWJvcmRlcik7XG4gICAgY29sb3I6IHZhcigtLWRpc2FibGVkLXRleHQpO1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gICAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIH1cblxuICAub3B0LmRpc2FibGVkOmhvdmVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1kaXNhYmxlZC1iZyk7XG4gICAgYm9yZGVyLWNvbG9yOiB2YXIoLS1kaXNhYmxlZC1ib3JkZXIpO1xuICB9XG5cbiAgLm9wdC5kaXNhYmxlZCBzcGFuIHtcbiAgICBjb2xvcjogdmFyKC0tZGlzYWJsZWQtdGV4dCk7XG4gIH1cblxuICAub3B0LmRpc2FibGVkIC5tYXJrIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1kaXNhYmxlZC1ib3JkZXIpO1xuICAgIGJvcmRlci1jb2xvcjogI0NCRDVFMTtcbiAgfVxuXG4gIC8qIEluIGNhc2UgYW4gb3B0aW9uIHdhcyBjaGVja2VkIGJlZm9yZSBiZWNvbWluZyBkaXNhYmxlZCwga2VlcCBpdCBtdXRlZFxuICAgICByYXRoZXIgdGhhbiBibHVlICovXG4gIC5vcHQuZGlzYWJsZWQuc2VsZWN0ZWQge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLWRpc2FibGVkLWJnKTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWRpc2FibGVkLWJvcmRlcik7XG4gICAgY29sb3I6IHZhcigtLWRpc2FibGVkLXRleHQpO1xuICB9XG5cbiAgLm9wdC5kaXNhYmxlZC5zZWxlY3RlZCAubWFyayB7XG4gICAgYmFja2dyb3VuZDogI0NCRDVFMTtcbiAgICBib3JkZXItY29sb3I6ICNDQkQ1RTE7XG4gIH1cblxuICAub3RoZXItYm94IHtcbiAgICBtYXJnaW4tdG9wOiAxMnB4O1xuICB9XG5cbiAgLm90aGVyLWJveCBpbnB1dCB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgcGFkZGluZzogMTJweCAxNHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgYm9yZGVyOiAxLjVweCBzb2xpZCB2YXIoLS1saW5lKTtcbiAgICBmb250LWZhbWlseTogJ0ludGVyJywgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDAuOTJyZW07XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcGFuZWwpO1xuICB9XG5cbiAgLm90aGVyLWJveCBpbnB1dDpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWJsdWUpO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDYzLCAxNDUsIDIxOCwgMC4xMik7XG4gIH1cblxuICB0ZXh0YXJlYSB7XG4gICAgd2lkdGg6IDEwMCU7XG4gICAgbWluLWhlaWdodDogMTIwcHg7XG4gICAgYm9yZGVyLXJhZGl1czogMTRweDtcbiAgICBib3JkZXI6IDEuNXB4IHNvbGlkIHZhcigtLWxpbmUpO1xuICAgIHBhZGRpbmc6IDE0cHggMTZweDtcbiAgICBmb250LWZhbWlseTogJ0ludGVyJywgc2Fucy1zZXJpZjtcbiAgICBmb250LXNpemU6IDAuOTVyZW07XG4gICAgcmVzaXplOiB2ZXJ0aWNhbDtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1wYW5lbCk7XG4gIH1cblxuICB0ZXh0YXJlYTpmb2N1cyB7XG4gICAgb3V0bGluZTogbm9uZTtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWJsdWUpO1xuICAgIGJhY2tncm91bmQ6IHdoaXRlO1xuICAgIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDYzLCAxNDUsIDIxOCwgMC4xMik7XG4gIH1cblxuICAuZmllbGQtbnVkZ2Uge1xuICAgIGZvbnQtc2l6ZTogMC44cmVtO1xuICAgIGNvbG9yOiB2YXIoLS1kYW5nZXIpO1xuICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gIH1cblxuICAvKiAtLS0tLS0tLS0tIE5BViAtLS0tLS0tLS0tICovXG4gIC5uYXYge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAganVzdGlmeS1jb250ZW50OiBzcGFjZS1iZXR3ZWVuO1xuICAgIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gICAgZ2FwOiAxNnB4O1xuICAgIHBhZGRpbmc6IDE4cHggMzJweCAyOHB4O1xuICAgIGJvcmRlci10b3A6IDFweCBzb2xpZCB2YXIoLS1saW5lKTtcbiAgfVxuXG4gIC5idG4ge1xuICAgIGZvbnQtZmFtaWx5OiAnSW50ZXInLCBzYW5zLXNlcmlmO1xuICAgIGZvbnQtd2VpZ2h0OiA2MDA7XG4gICAgZm9udC1zaXplOiAwLjkycmVtO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICAgIHBhZGRpbmc6IDEycHggMjJweDtcbiAgICBjdXJzb3I6IHBvaW50ZXI7XG4gICAgdHJhbnNpdGlvbjogYWxsIDAuMTVzIGVhc2U7XG4gICAgZGlzcGxheTogaW5saW5lLWZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgICBnYXA6IDZweDtcbiAgfVxuXG4gIC5idG4tYmFjayB7XG4gICAgYmFja2dyb3VuZDogdHJhbnNwYXJlbnQ7XG4gICAgY29sb3I6IHZhcigtLWluay1zb2Z0KTtcbiAgICBwYWRkaW5nLWxlZnQ6IDhweDtcbiAgICBwYWRkaW5nLXJpZ2h0OiA4cHg7XG4gIH1cblxuICAuYnRuLWJhY2s6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICAgIGNvbG9yOiB2YXIoLS1pbmspO1xuICB9XG5cbiAgLmJ0bi1iYWNrOmRpc2FibGVkIHtcbiAgICBvcGFjaXR5OiAwO1xuICAgIHBvaW50ZXItZXZlbnRzOiBub25lO1xuICB9XG5cbiAgLmJ0bi1uZXh0LFxuICAuYnRuLXN0YXJ0IHtcbiAgICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1ibHVlKSwgdmFyKC0tYmx1ZS1kZWVwKSk7XG4gICAgY29sb3I6IHdoaXRlO1xuICAgIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggLTZweCByZ2JhKDQ0LCAxMTYsIDE4MSwgMC40NSk7XG4gICAgbWluLXdpZHRoOiAxMzBweDtcbiAgfVxuXG4gIC5idG4tbmV4dDpob3Zlcjpub3QoOmRpc2FibGVkKSxcbiAgLmJ0bi1zdGFydDpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xcHgpO1xuICAgIGJveC1zaGFkb3c6IDAgMTBweCAyNHB4IC02cHggcmdiYSg0NCwgMTE2LCAxODEsIDAuNTUpO1xuICB9XG5cbiAgLmJ0bi1uZXh0OmRpc2FibGVkIHtcbiAgICBvcGFjaXR5OiAwLjc7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgICB0cmFuc2Zvcm06IG5vbmU7XG4gIH1cblxuICAuYnRuLXJlbWluZCB7XG4gICAgYmFja2dyb3VuZDogI0Y4RkFGQztcbiAgICBjb2xvcjogdmFyKC0taW5rLXNvZnQpO1xuICAgIGJvcmRlcjogMS41cHggc29saWQgdmFyKC0tbGluZSk7XG4gIH1cblxuICAuYnRuLXJlbWluZDpob3Zlcjpub3QoOmRpc2FibGVkKSB7XG4gICAgYmFja2dyb3VuZDogI0YxRjVGOTtcbiAgICBib3JkZXItY29sb3I6ICNDQkQ1RTE7XG4gIH1cblxuICAucmVtaW5kLWNvdW50IHtcbiAgICBmb250LXNpemU6IDAuOGVtO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBFUlJPUiBNRVNTQUdFIC0tLS0tLS0tLS0gKi9cbiAgLmVycm9yLW1lc3NhZ2Uge1xuICAgIGRpc3BsYXk6IGZsZXg7XG4gICAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAgICBnYXA6IDEycHg7XG4gICAgY29sb3I6IHZhcigtLWRhbmdlcik7XG4gICAgYmFja2dyb3VuZDogI0ZFRjJGMjtcbiAgICBwYWRkaW5nOiAxNHB4IDIwcHggMThweDtcbiAgICBtYXJnaW46IDAgMzJweCAyMHB4O1xuICAgIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICAgIGZvbnQtd2VpZ2h0OiA1MDA7XG4gICAgYm9yZGVyOiAxcHggc29saWQgI0ZFQ0FDQTtcbiAgfVxuXG4gIC5lcnJvci1tZXNzYWdlIG1hdC1pY29uIHtcbiAgICBmb250LXNpemU6IDIwcHg7XG4gICAgd2lkdGg6IDIwcHg7XG4gICAgaGVpZ2h0OiAyMHB4O1xuICAgIGZsZXgtc2hyaW5rOiAwO1xuICB9XG5cbiAgLyogLS0tLS0tLS0tLSBTQ1JPTExCQVIgLS0tLS0tLS0tLSAqL1xuICAud2l6YXJkLWNhcmQ6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgICB3aWR0aDogOHB4O1xuICB9XG5cbiAgLndpemFyZC1jYXJkOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tcGFuZWwpO1xuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcbiAgfVxuXG4gIC53aXphcmQtY2FyZDo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xuICAgIGJhY2tncm91bmQ6ICNDQkQ1RTE7XG4gICAgYm9yZGVyLXJhZGl1czogNHB4O1xuICB9XG5cbiAgLndpemFyZC1jYXJkOjotd2Via2l0LXNjcm9sbGJhci10aHVtYjpob3ZlciB7XG4gICAgYmFja2dyb3VuZDogIzk0QTNCODtcbiAgfVxuXG4gIC8qIC0tLS0tLS0tLS0gUkVTUE9OU0lWRSAtLS0tLS0tLS0tICovXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAgIC53aXphcmQtY2FyZCB7XG4gICAgICBtYXgtaGVpZ2h0OiA5MHZoO1xuICAgIH1cblxuICAgIC5pbnRyby1zY3JlZW4ge1xuICAgICAgcGFkZGluZzogMzJweCAyNHB4IDI4cHg7XG4gICAgfVxuXG4gICAgLnByb2dyZXNzLWJsb2NrIHtcbiAgICAgIHBhZGRpbmc6IDIwcHggMjBweCAwO1xuICAgIH1cblxuICAgIC5zdGFnZSB7XG4gICAgICBwYWRkaW5nOiAyMnB4IDIwcHggMThweDtcbiAgICAgIG1pbi1oZWlnaHQ6IDI2MHB4O1xuICAgIH1cblxuICAgIC5uYXYge1xuICAgICAgcGFkZGluZzogMTZweCAyMHB4IDIycHg7XG4gICAgfVxuXG4gICAgLm9wdGlvbnMuZ3JpZDIge1xuICAgICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnIgMWZyO1xuICAgIH1cbiAgfVxuXG4gIEBtZWRpYSAobWF4LXdpZHRoOiA0ODBweCkge1xuICAgIC5vcHRpb25zLmdyaWQyIHtcbiAgICAgIGdyaWQtdGVtcGxhdGUtY29sdW1uczogMWZyO1xuICAgIH1cblxuICAgIC5pbnRyby1hY3Rpb25zIHtcbiAgICAgIG1heC13aWR0aDogMTAwJTtcbiAgICB9XG4gIH1cbn0iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 24981:
/*!****************************************************************************!*\
  !*** ./src/app/shared/components/delete-detail/delete-detail.component.ts ***!
  \****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DeleteDetailComponent: () => (/* binding */ DeleteDetailComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/cdk/a11y */ 72102);








function DeleteDetailComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function DeleteDetailComponent_div_6_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r5.closePopUp());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function DeleteDetailComponent_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function DeleteDetailComponent_button_15_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r8);
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r7.closePopUp("close"));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r1.config.cancelButtonLabel ? ctx_r1.config.cancelButtonLabel : "Cancel"));
  }
}
function DeleteDetailComponent_button_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function DeleteDetailComponent_button_16_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r10);
      const ctx_r9 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r9.closePopUp(ctx_r9.config.secondaryButtonType));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 1, ctx_r2.config.secondaryButtonLabel));
  }
}
function DeleteDetailComponent_img_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 17);
  }
  if (rf & 2) {
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("src", ctx_r3.config.primaryButtonIcon, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsanitizeUrl"]);
  }
}
function DeleteDetailComponent_img_22_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 18);
  }
}
const _c0 = function (a0) {
  return {
    minutes: a0
  };
};
const _c1 = function () {
  return ["ok", "logout"];
};
const _c2 = function (a0, a1) {
  return {
    "btn-danger": a0,
    "btn-primary": a1
  };
};
class DeleteDetailComponent {
  constructor() {
    this.close = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.showCancelBtn = true;
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
    if (this.showCancelBtn) {
      this.closePopUp('close');
    }
  }
  closePopUp(val) {
    this.close.emit(val);
  }
  onPrimaryAction() {
    this.close.emit(this.config.primaryButtonType);
  }
  static {
    this.ɵfac = function DeleteDetailComponent_Factory(t) {
      return new (t || DeleteDetailComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: DeleteDetailComponent,
      selectors: [["app-delete-detail"]],
      hostBindings: function DeleteDetailComponent_HostBindings(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("keydown.escape", function DeleteDetailComponent_keydown_escape_HostBindingHandler($event) {
            return ctx.handleEscape($event);
          }, false, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresolveDocument"]);
        }
      },
      inputs: {
        config: "config",
        showCancelBtn: "showCancelBtn"
      },
      outputs: {
        close: "close"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 23,
      vars: 25,
      consts: [["role", "dialog", "aria-modal", "true", "aria-labelledby", "delete-dialog-title", "cdkTrapFocus", "", 1, "backdrop", "fixed", "z-[99]", "inset-0", "w-full", "h-full", "flex", "items-center", "justify-center", 3, "cdkTrapFocusAutoCapture"], [1, "dialogue-warpper", "bg-white", "rounded-lg", "shadow-lg", "mx-2", "w-[500px]"], [1, "header", "flex", "justify-between", "px-5", "py-5"], ["id", "delete-dialog-title", 1, "text-lg", "font-bold", "leading-[26px]"], ["class", " bg-shade-50 rounded-full text-center p-1 cursor-pointer", 3, "click", 4, "ngIf"], [1, "body", "px-5", "py-5"], [1, "text-base", "font-medium"], [1, "footer-container", "p-4"], [1, "buttons", "flex", "items-center", "justify-end", "gap-2"], ["type", "button", "class", "btn-outline-primary", 3, "click", 4, "ngIf"], ["data-testid", "delete-detail-primary-btn", "type", "submit", 1, "flex", "items-center", "justify-center", 3, "ngClass", "click"], ["class", "mr-2", "alt", "", 3, "src", 4, "ngIf"], [1, "mr-1"], ["src", "assets/icons/delete.svg", "alt", "", 4, "ngIf"], [1, "bg-shade-50", "rounded-full", "text-center", "p-1", "cursor-pointer", 3, "click"], ["src", "assets/icons/E remove.svg", "alt", ""], ["type", "button", 1, "btn-outline-primary", 3, "click"], ["alt", "", 1, "mr-2", 3, "src"], ["src", "assets/icons/delete.svg", "alt", ""]],
      template: function DeleteDetailComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h1", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](6, DeleteDetailComponent_div_6_Template, 2, 0, "div", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](7, "hr");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 5)(9, "h2", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](11, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](12, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "div", 7)(14, "div", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](15, DeleteDetailComponent_button_15_Template, 3, 3, "button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](16, DeleteDetailComponent_button_16_Template, 3, 3, "button", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function DeleteDetailComponent_Template_button_click_17_listener() {
            return ctx.onPrimaryAction();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](18, DeleteDetailComponent_img_18_Template, 1, 1, "img", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "span", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](21, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](22, DeleteDetailComponent_img_22_Template, 1, 0, "img", 13);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("cdkTrapFocusAutoCapture", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](5, 10, ctx.config.heading));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showCancelBtn);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.config.idleTime ? _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](11, 12, ctx.config.confirmationText, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](19, _c0, ctx.config.idleTime)) : _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](12, 15, ctx.config.confirmationText));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showCancelBtn);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.secondaryButtonLabel);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction2"](22, _c2, ctx.config.primaryButtonType === "delete", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](21, _c1).includes(ctx.config.primaryButtonType)));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.primaryButtonIcon);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](21, 17, ctx.config.primaryButtonLabel));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.primaryButtonType === "delete");
        }
      },
      dependencies: [_ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_1__.TranslatePipe, _angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_3__.A11yModule, _angular_cdk_a11y__WEBPACK_IMPORTED_MODULE_3__.CdkTrapFocus],
      styles: [".backdrop[_ngcontent-%COMP%] {\n  background-color: rgba(75, 75, 75, 0.5);\n  background-color: color-mix(in srgb, var(--content-DEFAULT) 50%, transparent);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRlbGV0ZS1kZXRhaWwuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDQyx1Q0FBQTtFQUNBLDZFQUFBO0FBQ0QiLCJmaWxlIjoiZGVsZXRlLWRldGFpbC5jb21wb25lbnQuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi5iYWNrZHJvcHtcblx0YmFja2dyb3VuZC1jb2xvcjogcmdiYSg3NSwgNzUsIDc1LCAwLjUpO1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSA1MCUsIHRyYW5zcGFyZW50KTtcbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZGVsZXRlLWRldGFpbC9kZWxldGUtZGV0YWlsLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0MsdUNBQUE7RUFDQSw2RUFBQTtBQUNEO0FBQ0Esd2RBQXdkIiwic291cmNlc0NvbnRlbnQiOlsiLmJhY2tkcm9we1xuXHRiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDc1LCA3NSwgNzUsIDAuNSk7XG5cdGJhY2tncm91bmQtY29sb3I6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1jb250ZW50LURFRkFVTFQpIDUwJSwgdHJhbnNwYXJlbnQpO1xufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 62157:
/*!******************************************************************!*\
  !*** ./src/app/shared/components/dropdown/dropdown.component.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DropdownComponent: () => (/* binding */ DropdownComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @ng-select/ng-select */ 62223);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 90852);










function DropdownComponent_span_4_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function DropdownComponent_span_5_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 8);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 9);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 10);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](4, 1, ctx_r1.config.info), " ");
  }
}
function DropdownComponent_9_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const item_r7 = ctx.item;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r7[ctx_r6.config.bindLabel || "name"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](item_r7.description);
  }
}
function DropdownComponent_9_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, DropdownComponent_9_ng_template_0_Template, 4, 2, "ng-template", 11);
  }
}
function DropdownComponent_10_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "input", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "span", 16);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const item_r9 = ctx.item;
    const item$_r10 = ctx.item$;
    const ctx_r8 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", item$_r10.selected);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](4, 2, ctx_r8.config.bindLabel ? item_r9[ctx_r8.config.bindLabel] : item_r9));
  }
}
function DropdownComponent_10_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, DropdownComponent_10_ng_template_0_Template, 5, 4, "ng-template", 11);
  }
}
function DropdownComponent_11_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r13 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "label", 14)(1, "input", 18);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function DropdownComponent_11_ng_template_0_Template_input_change_1_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r13);
      const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r12.toggleSelectAll($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r11 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("checked", ctx_r11.isSelectAll());
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 2, "Select All"), " ");
  }
}
function DropdownComponent_11_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](0, DropdownComponent_11_ng_template_0_Template, 4, 4, "ng-template", 17);
  }
}
function DropdownComponent_small_12_ng_container_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerStart"](0);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementContainerEnd"]();
  }
  if (rf & 2) {
    const ctx_r14 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate2"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r14.labelText), " ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 4, "is required"), "");
  }
}
function DropdownComponent_small_12_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "small", 19);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, DropdownComponent_small_12_ng_container_1_Template, 4, 6, "ng-container", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("id", ctx_r5.inputId + "-error");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r5.control.errors == null ? null : ctx_r5.control.errors["required"]);
  }
}
class DropdownComponent {
  constructor() {
    this.inputId = `dropdown-${DropdownComponent.nextId++}`;
    this.internalControl = new _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControl(null);
    this.dropDownValues = [];
    this.submitted = false;
    this.mode = '';
    this.valueChange = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.valueUpdate = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.onChange = () => {};
    this.onTouched = () => {};
  }
  static {
    this.nextId = 0;
  }
  ngAfterViewInit() {
    this.select.searchInput.nativeElement.autocomplete = 'new-password';
  }
  get control() {
    return this.dropDownCtrl ?? this.internalControl;
  }
  get labelText() {
    return this.config.fieldName || this.config.labelTxt || this.config.placeHolderTxt;
  }
  get selectedItem() {
    return this.control.value;
  }
  set selectedItem(value) {
    this.control.setValue(value, {
      emitEvent: false
    });
  }
  writeValue(value) {
    this.internalControl.setValue(value, {
      emitEvent: false
    });
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  setDisabledState(disabled) {
    if (disabled) this.internalControl.disable({
      emitEvent: false
    });else this.internalControl.enable({
      emitEvent: false
    });
  }
  valueSelected(selectedOption) {
    this.emit(this.control.value, selectedOption);
  }
  toggleSelectAll(event) {
    const checked = event.target.checked;
    const value = checked ? this.allValues() : [];
    this.control.setValue(value);
    this.emit(value, value);
  }
  isSelectAll() {
    return this.control.value?.length === this.dropDownValues.length;
  }
  emit(value, selectedOption) {
    this.onChange(value);
    this.valueChange.emit(selectedOption);
    this.valueUpdate.emit(value);
  }
  allValues() {
    const valueKey = this.config.selectAllValue || this.config.bindValue;
    if (!valueKey) return this.dropDownValues;
    return this.dropDownValues.map(option => option[valueKey]);
  }
  static {
    this.ɵfac = function DropdownComponent_Factory(t) {
      return new (t || DropdownComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: DropdownComponent,
      selectors: [["app-dropdown"]],
      viewQuery: function DropdownComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵviewQuery"](_ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__.NgSelectComponent, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵloadQuery"]()) && (ctx.select = _t.first);
        }
      },
      inputs: {
        dropDownValues: "dropDownValues",
        dropDownCtrl: "dropDownCtrl",
        config: "config",
        submitted: "submitted",
        mode: "mode"
      },
      outputs: {
        valueChange: "valueChange",
        valueUpdate: "valueUpdate"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
        provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NG_VALUE_ACCESSOR,
        useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => DropdownComponent),
        multi: true
      }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 13,
      vars: 35,
      consts: [[1, "select-wrapper"], [1, "form-control-label", "inline-flex", "items-center", "gap-1", 3, "for"], ["class", "text-[16px] text-error", 4, "ngIf"], ["class", "relative group cursor-help", "tabindex", "0", 4, "ngIf"], [3, "labelForId", "items", "ngClass", "readonly", "placeholder", "notFoundText", "bindLabel", "bindValue", "dropdownPosition", "searchable", "clearable", "addTag", "multiple", "formControl", "closeOnSelect", "change", "blur"], [4, "ngIf"], ["class", "form-control-error", 3, "id", 4, "ngIf"], [1, "text-[16px]", "text-error"], ["tabindex", "0", 1, "relative", "group", "cursor-help"], ["src", "assets/icons/info-primary.svg", "alt", "", 1, "w-4", "h-4"], ["role", "tooltip", 1, "pointer-events-none", "opacity-0", "group-hover:opacity-100", "group-focus:opacity-100", "absolute", "top-5", "left-0", "z-50", "w-72", "rounded", "border", "bg-white", "p-3", "text-xs", "font-normal", "leading-snug", "text-content-60", "shadow-md"], ["ng-option-tmp", ""], [1, "block", "font-bold", "whitespace-normal"], [1, "block", "text-xs", "text-content-60", "whitespace-normal"], [1, "flex", "items-center", "gap-2"], ["type", "checkbox", 3, "checked"], [1, "min-w-0", "whitespace-normal"], ["ng-header-tmp", ""], ["type", "checkbox", 3, "checked", "change"], [1, "form-control-error", 3, "id"]],
      template: function DropdownComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "label", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](3, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](4, DropdownComponent_span_4_Template, 2, 0, "span", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](5, DropdownComponent_span_5_Template, 5, 3, "span", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "ng-select", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("change", function DropdownComponent_Template_ng_select_change_6_listener($event) {
            return ctx.valueSelected($event);
          })("blur", function DropdownComponent_Template_ng_select_blur_6_listener() {
            return ctx.onTouched();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](7, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](8, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](9, DropdownComponent_9_Template, 1, 0, null, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](10, DropdownComponent_10_Template, 1, 0, null, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](11, DropdownComponent_11_Template, 1, 0, null, 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](12, DropdownComponent_small_12_Template, 2, 2, "small", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("sr-only", ctx.config.hideLabel || !ctx.config.fieldName && !ctx.config.labelTxt);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", ctx.inputId);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](3, 29, ctx.labelText), " ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.required && ctx.mode !== "view");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.info);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵclassProp"]("wrap-value", ctx.config.wrapValue);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("labelForId", ctx.inputId)("items", ctx.dropDownValues)("ngClass", ctx.config.isBackground && (ctx.control.disabled || ctx.config.disabled) ? "with-background" : "")("readonly", !!ctx.config.disabled)("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](7, 31, ctx.config.placeHolderTxt))("notFoundText", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](8, 33, "No items found"))("bindLabel", ctx.config.addTag ? "label" : ctx.config.bindLabel || "name")("bindValue", ctx.config.addTag ? "" : ctx.config.bindValue || "value")("dropdownPosition", "auto")("searchable", ctx.config.searchable || false)("clearable", ctx.config.clearableOff ? false : true)("addTag", ctx.config.addTag || false)("multiple", ctx.config.multi || false)("formControl", ctx.control)("closeOnSelect", ctx.config.openOnSelect ? false : true);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵattribute"]("aria-invalid", ctx.submitted && ctx.control.invalid ? "true" : null)("aria-describedby", ctx.submitted && ctx.control.invalid ? ctx.inputId + "-error" : null);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.showDescription);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.multi && ctx.config.selectAllOption);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.multi && ctx.config.selectAllOption && ctx.dropDownValues.length);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.submitted && ctx.control.invalid);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_3__.NgIf, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__.NgSelectModule, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__.NgSelectComponent, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__.NgOptionTemplateDirective, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_2__.NgHeaderTemplateDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.ReactiveFormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormControlDirective, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslatePipe],
      styles: ["[_nghost-%COMP%] {\n  display: block;\n  min-width: 0;\n}\n\n.select-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-focused:not(.ng-select-opened) > .ng-select-container {\n  box-shadow: none;\n  border: 1px solid var(--content-50);\n}\n.select-wrapper[_ngcontent-%COMP%]     .with-background.ng-select .ng-select-container {\n  background: var(--surface-muted) !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-select-container {\n  background-color: var(--surface-DEFAULT) !important;\n  height: 100% !important;\n  border: 1px solid var(--content-50);\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-select-container .ng-value-container {\n  min-width: 0;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.wrap-value.ng-select-single .ng-select-container .ng-value-container {\n  white-space: normal;\n  padding-block: 5px;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.wrap-value .ng-select-container .ng-value, .select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value {\n  min-width: 0;\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value {\n  display: flex;\n  font-size: inherit;\n  max-width: 100%;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-multiple .ng-select-container .ng-value-label {\n  min-width: 0;\n  overflow-wrap: anywhere;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-multiple:not(.ng-select-searchable) .ng-input {\n  position: absolute;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-select-container .ng-value-container .ng-placeholder {\n  color: var(--content-60);\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-disabled > .ng-select-container {\n  background: var(--shade-80) !important;\n  border-color: var(--content-30);\n  cursor: not-allowed;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-arrow-wrapper .ng-arrow {\n  border-color: none !important;\n  border-style: none !important;\n  border-width: 0 !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-arrow-wrapper {\n  background-image: url('drop-down.aad29f04a486a4ef.svg') !important;\n  background-repeat: no-repeat;\n  background-size: 14px 14px;\n  margin-top: 10px;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel.ng-select-bottom {\n  border: none;\n  margin-top: 5px;\n  box-shadow: 0px 4px 9px 0px rgba(75, 75, 75, 0.12);\n  box-shadow: 0px 4px 9px 0px color-mix(in srgb, var(--content-DEFAULT) 12%, transparent);\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel {\n  min-width: 200px !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option {\n  white-space: normal;\n  overflow-wrap: anywhere;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-select-container .ng-value-container .ng-input > input[readonly] {\n  user-select: unset;\n  -webkit-user-select: unset;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected, .select-wrapper[_ngcontent-%COMP%]   .ng-dropdown-panel[_ngcontent-%COMP%]   .ng-dropdown-panel-items[_ngcontent-%COMP%]   .ng-option.ng-option-selected.ng-option-marked[_ngcontent-%COMP%] {\n  background-color: var(--shade-80) !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {\n  background-color: var(--shade-80) !important;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImRyb3Bkb3duLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQVEsY0FBQTtFQUFnQixZQUFBO0FBR3hCOztBQURBO0VBQ0Usa0JBQUE7QUFJRjtBQUhFO0VBR0UsZ0JBQUE7RUFDQSxtQ0FBQTtBQUdKO0FBQUU7RUFDRSwyQ0FBQTtBQUVKO0FBQUU7RUFDRSxtREFBQTtFQUNBLHVCQUFBO0VBQ0EsbUNBQUE7QUFFSjtBQUNFO0VBQ0UsWUFBQTtBQUNKO0FBRUU7RUFDRSxtQkFBQTtFQUNBLGtCQUFBO0FBQUo7QUFHRTs7RUFFRSxZQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtBQURKO0FBSUU7RUFDRSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSxlQUFBO0FBRko7QUFLRTtFQUNFLFlBQUE7RUFDQSx1QkFBQTtBQUhKO0FBTUU7RUFDRSxrQkFBQTtBQUpKO0FBT0U7RUFDRSx3QkFBQTtBQUxKO0FBUUU7RUFDRSxzQ0FBQTtFQUNBLCtCQUFBO0VBQ0EsbUJBQUE7QUFOSjtBQVNFO0VBQ0UsNkJBQUE7RUFDQSw2QkFBQTtFQUNBLDBCQUFBO0FBUEo7QUFTRTtFQUNFLGtFQUFBO0VBQ0EsNEJBQUE7RUFDQSwwQkFBQTtFQUNBLGdCQUFBO0FBUEo7QUFVRTtFQUNFLFlBQUE7RUFDQSxlQUFBO0VBQ0Esa0RBQUE7RUFDQSx1RkFBQTtBQVJKO0FBV0U7RUFDRSwyQkFBQTtBQVRKO0FBWUU7RUFDRSxtQkFBQTtFQUNBLHVCQUFBO0FBVko7QUFhRTtFQUNFLGtCQUFBO0VBQ0EsMEJBQUE7QUFYSjtBQWNFOztFQU9FLDRDQUFBO0FBakJKO0FBb0JFO0VBSUUsNENBQUE7QUFyQkoiLCJmaWxlIjoiZHJvcGRvd24uY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyI6aG9zdCB7IGRpc3BsYXk6IGJsb2NrOyBtaW4td2lkdGg6IDA7IH1cblxuLnNlbGVjdC13cmFwcGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICA6Om5nLWRlZXBcbiAgICAubmctc2VsZWN0Lm5nLXNlbGVjdC1mb2N1c2VkOm5vdCgubmctc2VsZWN0LW9wZW5lZClcbiAgICA+IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBib3gtc2hhZG93OiBub25lO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNvbnRlbnQtNTApO1xuICB9XG5cbiAgOjpuZy1kZWVwIC53aXRoLWJhY2tncm91bmQubmctc2VsZWN0IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLW11dGVkKSAhaW1wb3J0YW50O1xuICB9XG4gIDo6bmctZGVlcCAubmctc2VsZWN0IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAxMDAlICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tY29udGVudC01MCk7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctc2VsZWN0LWNvbnRhaW5lciAubmctdmFsdWUtY29udGFpbmVyIHtcbiAgICBtaW4td2lkdGg6IDA7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdC53cmFwLXZhbHVlLm5nLXNlbGVjdC1zaW5nbGUgLm5nLXNlbGVjdC1jb250YWluZXIgLm5nLXZhbHVlLWNvbnRhaW5lciB7XG4gICAgd2hpdGUtc3BhY2U6IG5vcm1hbDtcbiAgICBwYWRkaW5nLWJsb2NrOiA1cHg7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdC53cmFwLXZhbHVlIC5uZy1zZWxlY3QtY29udGFpbmVyIC5uZy12YWx1ZSxcbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3Qubmctc2VsZWN0LW11bHRpcGxlIC5uZy1zZWxlY3QtY29udGFpbmVyIC5uZy12YWx1ZSB7XG4gICAgbWluLXdpZHRoOiAwO1xuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7XG4gICAgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdC5uZy1zZWxlY3QtbXVsdGlwbGUgLm5nLXNlbGVjdC1jb250YWluZXIgLm5nLXZhbHVlIHtcbiAgICBkaXNwbGF5OiBmbGV4O1xuICAgIGZvbnQtc2l6ZTogaW5oZXJpdDtcbiAgICBtYXgtd2lkdGg6IDEwMCU7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdC5uZy1zZWxlY3QtbXVsdGlwbGUgLm5nLXNlbGVjdC1jb250YWluZXIgLm5nLXZhbHVlLWxhYmVsIHtcbiAgICBtaW4td2lkdGg6IDA7XG4gICAgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdC5uZy1zZWxlY3QtbXVsdGlwbGU6bm90KC5uZy1zZWxlY3Qtc2VhcmNoYWJsZSkgLm5nLWlucHV0IHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctc2VsZWN0LWNvbnRhaW5lciAubmctdmFsdWUtY29udGFpbmVyIC5uZy1wbGFjZWhvbGRlciB7XG4gICAgY29sb3I6IHZhcigtLWNvbnRlbnQtNjApO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3Qubmctc2VsZWN0LWRpc2FibGVkID4gLm5nLXNlbGVjdC1jb250YWluZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXNoYWRlLTgwKSAhaW1wb3J0YW50O1xuICAgIGJvcmRlci1jb2xvcjogdmFyKC0tY29udGVudC0zMCk7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgfVxuXG4gIDo6bmctZGVlcCAubmctc2VsZWN0IC5uZy1hcnJvdy13cmFwcGVyIC5uZy1hcnJvdyB7XG4gICAgYm9yZGVyLWNvbG9yOiBub25lICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXN0eWxlOiBub25lICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIH1cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLWFycm93LXdyYXBwZXIge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcIi4uLy4uLy4uLy4uL2Fzc2V0cy9pY29ucy9kcm9wLWRvd24uc3ZnXCIpICFpbXBvcnRhbnQ7XG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDE0cHggMTRweDtcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1kcm9wZG93bi1wYW5lbC5uZy1zZWxlY3QtYm90dG9tIHtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgbWFyZ2luLXRvcDogNXB4O1xuICAgIGJveC1zaGFkb3c6IDBweCA0cHggOXB4IDBweCByZ2JhKDc1LCA3NSwgNzUsIDAuMTIpO1xuICAgIGJveC1zaGFkb3c6IDBweCA0cHggOXB4IDBweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSAxMiUsIHRyYW5zcGFyZW50KTtcbiAgfVxuXG4gIDo6bmctZGVlcCAubmctZHJvcGRvd24tcGFuZWwge1xuICAgIG1pbi13aWR0aDogMjAwcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIDo6bmctZGVlcCAubmctZHJvcGRvd24tcGFuZWwgLm5nLWRyb3Bkb3duLXBhbmVsLWl0ZW1zIC5uZy1vcHRpb24ge1xuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7XG4gICAgb3ZlcmZsb3ctd3JhcDogYW55d2hlcmU7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctc2VsZWN0LWNvbnRhaW5lciAubmctdmFsdWUtY29udGFpbmVyIC5uZy1pbnB1dD5pbnB1dFtyZWFkb25seV17XG4gICAgdXNlci1zZWxlY3Q6IHVuc2V0O1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IHVuc2V0O1xuICB9XG5cbiAgOjpuZy1kZWVwXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsLWl0ZW1zXG4gICAgLm5nLW9wdGlvbi5uZy1vcHRpb24tc2VsZWN0ZWQsXG4gIC5uZy1kcm9wZG93bi1wYW5lbFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtc1xuICAgIC5uZy1vcHRpb24ubmctb3B0aW9uLXNlbGVjdGVkLm5nLW9wdGlvbi1tYXJrZWQge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoYWRlLTgwKSAhaW1wb3J0YW50O1xuICB9XG5cbiAgOjpuZy1kZWVwXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsLWl0ZW1zXG4gICAgLm5nLW9wdGlvbi5uZy1vcHRpb24tbWFya2VkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGFkZS04MCkgIWltcG9ydGFudDtcbiAgfVxuXG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZHJvcGRvd24vZHJvcGRvd24uY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBUSxjQUFBO0VBQWdCLFlBQUE7QUFHeEI7O0FBREE7RUFDRSxrQkFBQTtBQUlGO0FBSEU7RUFHRSxnQkFBQTtFQUNBLG1DQUFBO0FBR0o7QUFBRTtFQUNFLDJDQUFBO0FBRUo7QUFBRTtFQUNFLG1EQUFBO0VBQ0EsdUJBQUE7RUFDQSxtQ0FBQTtBQUVKO0FBQ0U7RUFDRSxZQUFBO0FBQ0o7QUFFRTtFQUNFLG1CQUFBO0VBQ0Esa0JBQUE7QUFBSjtBQUdFOztFQUVFLFlBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0FBREo7QUFJRTtFQUNFLGFBQUE7RUFDQSxrQkFBQTtFQUNBLGVBQUE7QUFGSjtBQUtFO0VBQ0UsWUFBQTtFQUNBLHVCQUFBO0FBSEo7QUFNRTtFQUNFLGtCQUFBO0FBSko7QUFPRTtFQUNFLHdCQUFBO0FBTEo7QUFRRTtFQUNFLHNDQUFBO0VBQ0EsK0JBQUE7RUFDQSxtQkFBQTtBQU5KO0FBU0U7RUFDRSw2QkFBQTtFQUNBLDZCQUFBO0VBQ0EsMEJBQUE7QUFQSjtBQVNFO0VBQ0Usa0VBQUE7RUFDQSw0QkFBQTtFQUNBLDBCQUFBO0VBQ0EsZ0JBQUE7QUFQSjtBQVVFO0VBQ0UsWUFBQTtFQUNBLGVBQUE7RUFDQSxrREFBQTtFQUNBLHVGQUFBO0FBUko7QUFXRTtFQUNFLDJCQUFBO0FBVEo7QUFZRTtFQUNFLG1CQUFBO0VBQ0EsdUJBQUE7QUFWSjtBQWFFO0VBQ0Usa0JBQUE7RUFDQSwwQkFBQTtBQVhKO0FBY0U7O0VBT0UsNENBQUE7QUFqQko7QUFvQkU7RUFJRSw0Q0FBQTtBQXJCSjtBQUNBLG92S0FBb3ZLIiwic291cmNlc0NvbnRlbnQiOlsiOmhvc3QgeyBkaXNwbGF5OiBibG9jazsgbWluLXdpZHRoOiAwOyB9XG5cbi5zZWxlY3Qtd3JhcHBlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgOjpuZy1kZWVwXG4gICAgLm5nLXNlbGVjdC5uZy1zZWxlY3QtZm9jdXNlZDpub3QoLm5nLXNlbGVjdC1vcGVuZWQpXG4gICAgPiAubmctc2VsZWN0LWNvbnRhaW5lciB7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb250ZW50LTUwKTtcbiAgfVxuXG4gIDo6bmctZGVlcCAud2l0aC1iYWNrZ3JvdW5kLm5nLXNlbGVjdCAubmctc2VsZWN0LWNvbnRhaW5lciB7XG4gICAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1tdXRlZCkgIWltcG9ydGFudDtcbiAgfVxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctc2VsZWN0LWNvbnRhaW5lciB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKSAhaW1wb3J0YW50O1xuICAgIGhlaWdodDogMTAwJSAhaW1wb3J0YW50O1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNvbnRlbnQtNTApO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLXNlbGVjdC1jb250YWluZXIgLm5nLXZhbHVlLWNvbnRhaW5lciB7XG4gICAgbWluLXdpZHRoOiAwO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3Qud3JhcC12YWx1ZS5uZy1zZWxlY3Qtc2luZ2xlIC5uZy1zZWxlY3QtY29udGFpbmVyIC5uZy12YWx1ZS1jb250YWluZXIge1xuICAgIHdoaXRlLXNwYWNlOiBub3JtYWw7XG4gICAgcGFkZGluZy1ibG9jazogNXB4O1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3Qud3JhcC12YWx1ZSAubmctc2VsZWN0LWNvbnRhaW5lciAubmctdmFsdWUsXG4gIDo6bmctZGVlcCAubmctc2VsZWN0Lm5nLXNlbGVjdC1tdWx0aXBsZSAubmctc2VsZWN0LWNvbnRhaW5lciAubmctdmFsdWUge1xuICAgIG1pbi13aWR0aDogMDtcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsO1xuICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3Qubmctc2VsZWN0LW11bHRpcGxlIC5uZy1zZWxlY3QtY29udGFpbmVyIC5uZy12YWx1ZSB7XG4gICAgZGlzcGxheTogZmxleDtcbiAgICBmb250LXNpemU6IGluaGVyaXQ7XG4gICAgbWF4LXdpZHRoOiAxMDAlO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3Qubmctc2VsZWN0LW11bHRpcGxlIC5uZy1zZWxlY3QtY29udGFpbmVyIC5uZy12YWx1ZS1sYWJlbCB7XG4gICAgbWluLXdpZHRoOiAwO1xuICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3Qubmctc2VsZWN0LW11bHRpcGxlOm5vdCgubmctc2VsZWN0LXNlYXJjaGFibGUpIC5uZy1pbnB1dCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLXNlbGVjdC1jb250YWluZXIgLm5nLXZhbHVlLWNvbnRhaW5lciAubmctcGxhY2Vob2xkZXIge1xuICAgIGNvbG9yOiB2YXIoLS1jb250ZW50LTYwKTtcbiAgfVxuXG4gIDo6bmctZGVlcCAubmctc2VsZWN0Lm5nLXNlbGVjdC1kaXNhYmxlZCA+IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zaGFkZS04MCkgIWltcG9ydGFudDtcbiAgICBib3JkZXItY29sb3I6IHZhcigtLWNvbnRlbnQtMzApO1xuICAgIGN1cnNvcjogbm90LWFsbG93ZWQ7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctYXJyb3ctd3JhcHBlciAubmctYXJyb3cge1xuICAgIGJvcmRlci1jb2xvcjogbm9uZSAhaW1wb3J0YW50O1xuICAgIGJvcmRlci1zdHlsZTogbm9uZSAhaW1wb3J0YW50O1xuICAgIGJvcmRlci13aWR0aDogMCAhaW1wb3J0YW50O1xuICB9XG4gIDo6bmctZGVlcCAubmctc2VsZWN0IC5uZy1hcnJvdy13cmFwcGVyIHtcbiAgICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCIuLi8uLi8uLi8uLi9hc3NldHMvaWNvbnMvZHJvcC1kb3duLnN2Z1wiKSAhaW1wb3J0YW50O1xuICAgIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XG4gICAgYmFja2dyb3VuZC1zaXplOiAxNHB4IDE0cHg7XG4gICAgbWFyZ2luLXRvcDogMTBweDtcbiAgfVxuXG4gIDo6bmctZGVlcCAubmctZHJvcGRvd24tcGFuZWwubmctc2VsZWN0LWJvdHRvbSB7XG4gICAgYm9yZGVyOiBub25lO1xuICAgIG1hcmdpbi10b3A6IDVweDtcbiAgICBib3gtc2hhZG93OiAwcHggNHB4IDlweCAwcHggcmdiYSg3NSwgNzUsIDc1LCAwLjEyKTtcbiAgICBib3gtc2hhZG93OiAwcHggNHB4IDlweCAwcHggY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgMTIlLCB0cmFuc3BhcmVudCk7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLWRyb3Bkb3duLXBhbmVsIHtcbiAgICBtaW4td2lkdGg6IDIwMHB4ICFpbXBvcnRhbnQ7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLWRyb3Bkb3duLXBhbmVsIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtcyAubmctb3B0aW9uIHtcbiAgICB3aGl0ZS1zcGFjZTogbm9ybWFsO1xuICAgIG92ZXJmbG93LXdyYXA6IGFueXdoZXJlO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLXNlbGVjdC1jb250YWluZXIgLm5nLXZhbHVlLWNvbnRhaW5lciAubmctaW5wdXQ+aW5wdXRbcmVhZG9ubHlde1xuICAgIHVzZXItc2VsZWN0OiB1bnNldDtcbiAgICAtd2Via2l0LXVzZXItc2VsZWN0OiB1bnNldDtcbiAgfVxuXG4gIDo6bmctZGVlcFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtc1xuICAgIC5uZy1vcHRpb24ubmctb3B0aW9uLXNlbGVjdGVkLFxuICAubmctZHJvcGRvd24tcGFuZWxcbiAgICAubmctZHJvcGRvd24tcGFuZWwtaXRlbXNcbiAgICAubmctb3B0aW9uLm5nLW9wdGlvbi1zZWxlY3RlZC5uZy1vcHRpb24tbWFya2VkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGFkZS04MCkgIWltcG9ydGFudDtcbiAgfVxuXG4gIDo6bmctZGVlcFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtc1xuICAgIC5uZy1vcHRpb24ubmctb3B0aW9uLW1hcmtlZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hhZGUtODApICFpbXBvcnRhbnQ7XG4gIH1cblxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
    });
  }
}

/***/ }),

/***/ 635:
/*!******************************************************************************!*\
  !*** ./src/app/shared/components/endline-survey/endline-survey.component.ts ***!
  \******************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EndlineSurveyComponent: () => (/* binding */ EndlineSurveyComponent)
/* harmony export */ });
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_endline_survey_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/endline-survey.service */ 62048);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/material/dialog */ 12587);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../dropdown/dropdown.component */ 62157);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ngx-translate/core */ 90852);








function EndlineSurveyComponent_label_23_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "label", 10)(1, "input", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function EndlineSurveyComponent_label_23_Template_input_change_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r8);
      const option_r6 = restoredCtx.$implicit;
      const ctx_r7 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r7.toggle("shikshaBenefits", option_r6, $event.target.checked));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r6 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("checked", ctx_r0.checked("shikshaBenefits", option_r6));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](3, 2, option_r6), " ");
  }
}
function EndlineSurveyComponent_input_28_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](0, "input", 12);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](1, "translate");
  }
  if (rf & 2) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](1, 1, "Please specify"));
  }
}
function EndlineSurveyComponent_label_32_Template(rf, ctx) {
  if (rf & 1) {
    const _r11 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "label", 10)(1, "input", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function EndlineSurveyComponent_label_32_Template_input_change_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r11);
      const option_r9 = restoredCtx.$implicit;
      const ctx_r10 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r10.toggle("shikshaContentUsed", option_r9, $event.target.checked));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r9 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("checked", ctx_r2.checked("shikshaContentUsed", option_r9));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](3, 2, option_r9), " ");
  }
}
function EndlineSurveyComponent_label_36_Template(rf, ctx) {
  if (rf & 1) {
    const _r14 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "label", 10)(1, "input", 11);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("change", function EndlineSurveyComponent_label_36_Template_input_change_1_listener($event) {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵrestoreView"](_r14);
      const option_r12 = restoredCtx.$implicit;
      const ctx_r13 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵresetView"](ctx_r13.toggle("shikshaStudentImpact", option_r12, $event.target.checked));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](3, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const option_r12 = ctx.$implicit;
    const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("checked", ctx_r3.checked("shikshaStudentImpact", option_r12));
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"](" ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](3, 2, option_r12), " ");
  }
}
function EndlineSurveyComponent_p_37_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "p", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r4 = _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](2, 1, ctx_r4.error));
  }
}
function EndlineSurveyComponent_span_41_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](1, "\u2026");
    _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
  }
}
class EndlineSurveyComponent {
  constructor(fb, service, dialog) {
    this.fb = fb;
    this.service = service;
    this.dialog = dialog;
    this.submitting = false;
    this.error = '';
    this.options = {
      shikshaTimeUsage: ['< 5 minutes', '5 – 15 minutes', 'Under 30 minutes', 'Over 30 minutes'],
      shikshaUsability: ['Can be used directly in class room', 'Requires some minor modifications', 'Requires significant modifications', 'Not very useful'],
      shikshaBenefits: ['Reduced time I spend on lesson planning', 'Provides quality content', 'Helped me to improve my knowledge', 'Still exploring its usefulness'],
      shikshaTimeUtilization: ['I spend saved time on self-improvement', 'I dedicate more time to interacting with students and helping them with their questions.', 'I use saved time to complete administrative tasks', 'Other:'],
      shikshaContentUsed: ['Questions', 'Real world examples', 'Activities', 'I have not used any of these in my classroom'],
      shikshaStudentImpact: ['Encourages deeper thinking and curiosity', 'Improves problem-solving and reasoning skills', 'Engagement of students at different learning levels', 'Helps students understand concepts', 'I have not used it enough to notice changes']
    };
    this.dropdownOptions = Object.fromEntries(Object.entries(this.options).map(([field, options]) => [field, options.map(value => ({
      name: value,
      value
    }))]));
    this.dropdownConfig = {
      isBackground: false,
      placeHolderTxt: 'Select',
      hideLabel: true
    };
    this.exclusive = {
      shikshaBenefits: 'Still exploring its usefulness',
      shikshaContentUsed: 'I have not used any of these in my classroom',
      shikshaStudentImpact: 'I have not used it enough to notice changes'
    };
    this.form = this.fb.group({
      shikshaTimeUsage: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      shikshaUsability: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      shikshaBenefits: this.fb.array([], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required),
      shikshaTimeUtilization: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required],
      shikshaTimeUtilizationOther: [''],
      shikshaContentUsed: this.fb.array([], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required),
      shikshaStudentImpact: this.fb.array([], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.Validators.required)
    });
  }
  toggle(field, option, checked) {
    const control = this.form.get(field);
    const exclusive = this.exclusive[field];
    if (checked && option === exclusive) {
      control.clear();
      control.push(new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControl(option, {
        nonNullable: true
      }));
      return;
    }
    const exclusiveIndex = control.value.indexOf(exclusive);
    if (checked && exclusiveIndex >= 0) control.removeAt(exclusiveIndex);
    const index = control.value.indexOf(option);
    if (checked && index < 0) control.push(new _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControl(option, {
      nonNullable: true
    }));
    if (!checked && index >= 0) control.removeAt(index);
  }
  checked(field, option) {
    return (this.form.get(field)?.value).includes(option);
  }
  submit() {
    if (this.form.invalid || this.form.value.shikshaTimeUtilization === 'Other:' && !this.form.value.shikshaTimeUtilizationOther?.trim()) {
      this.form.markAllAsTouched();
      this.error = 'Please answer all questions.';
      return;
    }
    this.submitting = true;
    this.error = '';
    this.service.submitSurvey(this.form.getRawValue()).subscribe({
      next: () => this.dialog.close(true),
      error: error => {
        this.submitting = false;
        this.error = error.error?.message || 'Failed to submit survey.';
      }
    });
  }
  static {
    this.ɵfac = function EndlineSurveyComponent_Factory(t) {
      return new (t || EndlineSurveyComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormBuilder), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](src_app_core_services_endline_survey_service__WEBPACK_IMPORTED_MODULE_0__.EndlineSurveyService), _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdirectiveInject"](_angular_material_dialog__WEBPACK_IMPORTED_MODULE_4__.MatDialogRef));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineComponent"]({
      type: EndlineSurveyComponent,
      selectors: [["app-endline-survey"]],
      decls: 42,
      vars: 44,
      consts: [[1, "survey"], [3, "formGroup", "ngSubmit"], ["formControlName", "shikshaTimeUsage", 3, "dropDownValues", "config"], ["formControlName", "shikshaUsability", 3, "dropDownValues", "config"], ["class", "option", 4, "ngFor", "ngForOf"], ["formControlName", "shikshaTimeUtilization", 3, "dropDownValues", "config"], ["formControlName", "shikshaTimeUtilizationOther", 3, "placeholder", 4, "ngIf"], ["class", "error", 4, "ngIf"], ["type", "submit", 1, "btn-primary", 3, "disabled"], [4, "ngIf"], [1, "option"], ["type", "checkbox", 3, "checked", "change"], ["formControlName", "shikshaTimeUtilizationOther", 3, "placeholder"], [1, "error"]],
      template: function EndlineSurveyComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](0, "div", 0)(1, "header")(2, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](5, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](7, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](8, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](10, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](11, "form", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵlistener"]("ngSubmit", function EndlineSurveyComponent_Template_form_ngSubmit_11_listener() {
            return ctx.submit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](12, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](13);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](14, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](15, "app-dropdown", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](16, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](17);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](18, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](19, "app-dropdown", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](20, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](21);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](22, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](23, EndlineSurveyComponent_label_23_Template, 4, 4, "label", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](24, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](25);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](26, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelement"](27, "app-dropdown", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](28, EndlineSurveyComponent_input_28_Template, 2, 3, "input", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](29, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](30);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](31, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](32, EndlineSurveyComponent_label_32_Template, 4, 4, "label", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](33, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](34);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](35, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](36, EndlineSurveyComponent_label_36_Template, 4, 4, "label", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](37, EndlineSurveyComponent_p_37_Template, 3, 3, "p", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementStart"](38, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtext"](39);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipe"](40, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtemplate"](41, EndlineSurveyComponent_span_41_Template, 2, 0, "span", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](4, 24, "Endline Survey"));
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](7, 26, "Takes about 1 minute"));
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](10, 28, "Your responses help us improve Shiksha Copilot."));
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("formGroup", ctx.form);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("1. ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](14, 30, "How much time do you take to prepare a lesson plan using Shiksha Copilot?"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("dropDownValues", ctx.dropdownOptions["shikshaTimeUsage"])("config", ctx.dropdownConfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("2. ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](18, 32, "Is content from Shiksha Copilot directly usable?"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("dropDownValues", ctx.dropdownOptions["shikshaUsability"])("config", ctx.dropdownConfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("3. ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](22, 34, "Which benefits have you experienced?"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.options["shikshaBenefits"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("4. ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](26, 36, "How do you use the time saved?"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("dropDownValues", ctx.dropdownOptions["shikshaTimeUtilization"])("config", ctx.dropdownConfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.form.value.shikshaTimeUtilization === "Other:");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("5. ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](31, 38, "Which generated content do you use in class?"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.options["shikshaContentUsed"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate1"]("6. ", _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](35, 40, "What difference has the content made for students?"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngForOf", ctx.options["shikshaStudentImpact"]);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.error);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("disabled", ctx.submitting);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵpipeBind1"](40, 42, ctx.submitting ? "Submitting" : "Submit Survey"));
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵproperty"]("ngIf", ctx.submitting);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_3__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_3__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_3__.FormControlName, _dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_1__.DropdownComponent, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_6__.TranslatePipe],
      styles: [".survey[_ngcontent-%COMP%] {\n  max-height: 85vh;\n  overflow: auto;\n  padding: 1.5rem;\n  color: #1f2937;\n}\n\nheader[_ngcontent-%COMP%] {\n  background: #eef2ff;\n  border-radius: 0.75rem;\n  padding: 1rem;\n  margin-bottom: 1.5rem;\n}\n\nheader[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  font-size: 1.4rem;\n}\n\nheader[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  float: right;\n  color: #6b7280;\n}\n\nheader[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0.5rem 0 0;\n}\n\nform[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.7rem;\n}\n\nform[_ngcontent-%COMP%]    > label[_ngcontent-%COMP%]:not(.option) {\n  font-weight: 600;\n  margin-top: 0.75rem;\n}\n\nform[_ngcontent-%COMP%]    > input[_ngcontent-%COMP%] {\n  width: 100%;\n  border: 1px solid #d1d5db;\n  border-radius: 0.5rem;\n  padding: 0.65rem;\n  background: white;\n}\n\n.option[_ngcontent-%COMP%] {\n  border: 1px solid #e5e7eb;\n  border-radius: 0.5rem;\n  padding: 0.6rem;\n  cursor: pointer;\n}\n\n.error[_ngcontent-%COMP%] {\n  color: #b91c1c;\n}\n\nbutton[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n}\n\nbutton[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVuZGxpbmUtc3VydmV5LmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQVUsZ0JBQUE7RUFBa0IsY0FBQTtFQUFnQixlQUFBO0VBQWlCLGNBQUE7QUFLN0Q7O0FBSkE7RUFBUyxtQkFBQTtFQUFxQixzQkFBQTtFQUF1QixhQUFBO0VBQWUscUJBQUE7QUFXcEU7O0FBVkE7RUFBZ0IsaUJBQUE7QUFjaEI7O0FBZHFDO0VBQWMsWUFBQTtFQUFjLGNBQUE7QUFtQmpFOztBQW5CbUY7RUFBVyxrQkFBQTtBQXVCOUY7O0FBdEJBO0VBQU8sYUFBQTtFQUFlLHNCQUFBO0VBQXdCLFdBQUE7QUE0QjlDOztBQTNCQTtFQUE0QixnQkFBQTtFQUFrQixtQkFBQTtBQWdDOUM7O0FBL0JBO0VBQWUsV0FBQTtFQUFhLHlCQUFBO0VBQTJCLHFCQUFBO0VBQXNCLGdCQUFBO0VBQWlCLGlCQUFBO0FBdUM5Rjs7QUF0Q0E7RUFBVSx5QkFBQTtFQUEyQixxQkFBQTtFQUFzQixlQUFBO0VBQWdCLGVBQUE7QUE2QzNFOztBQTVDQTtFQUFTLGNBQUE7QUFnRFQ7O0FBaEQyQjtFQUFTLGdCQUFBO0FBb0RwQzs7QUFwRHdEO0VBQWtCLFlBQUE7QUF3RDFFIiwiZmlsZSI6ImVuZGxpbmUtc3VydmV5LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnN1cnZleSB7IG1heC1oZWlnaHQ6IDg1dmg7IG92ZXJmbG93OiBhdXRvOyBwYWRkaW5nOiAxLjVyZW07IGNvbG9yOiAjMWYyOTM3OyB9XG5oZWFkZXIgeyBiYWNrZ3JvdW5kOiAjZWVmMmZmOyBib3JkZXItcmFkaXVzOiAuNzVyZW07IHBhZGRpbmc6IDFyZW07IG1hcmdpbi1ib3R0b206IDEuNXJlbTsgfVxuaGVhZGVyIHN0cm9uZyB7IGZvbnQtc2l6ZTogMS40cmVtOyB9IGhlYWRlciBzcGFuIHsgZmxvYXQ6IHJpZ2h0OyBjb2xvcjogIzZiNzI4MDsgfSBoZWFkZXIgcCB7IG1hcmdpbjogLjVyZW0gMCAwOyB9XG5mb3JtIHsgZGlzcGxheTogZmxleDsgZmxleC1kaXJlY3Rpb246IGNvbHVtbjsgZ2FwOiAuN3JlbTsgfVxuZm9ybSA+IGxhYmVsOm5vdCgub3B0aW9uKSB7IGZvbnQtd2VpZ2h0OiA2MDA7IG1hcmdpbi10b3A6IC43NXJlbTsgfVxuZm9ybSA+IGlucHV0IHsgd2lkdGg6IDEwMCU7IGJvcmRlcjogMXB4IHNvbGlkICNkMWQ1ZGI7IGJvcmRlci1yYWRpdXM6IC41cmVtOyBwYWRkaW5nOiAuNjVyZW07IGJhY2tncm91bmQ6IHdoaXRlOyB9XG4ub3B0aW9uIHsgYm9yZGVyOiAxcHggc29saWQgI2U1ZTdlYjsgYm9yZGVyLXJhZGl1czogLjVyZW07IHBhZGRpbmc6IC42cmVtOyBjdXJzb3I6IHBvaW50ZXI7IH1cbi5lcnJvciB7IGNvbG9yOiAjYjkxYzFjOyB9IGJ1dHRvbiB7IG1hcmdpbi10b3A6IDFyZW07IH0gYnV0dG9uOmRpc2FibGVkIHsgb3BhY2l0eTogLjY7IH1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvZW5kbGluZS1zdXJ2ZXkvZW5kbGluZS1zdXJ2ZXkuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBVSxnQkFBQTtFQUFrQixjQUFBO0VBQWdCLGVBQUE7RUFBaUIsY0FBQTtBQUs3RDs7QUFKQTtFQUFTLG1CQUFBO0VBQXFCLHNCQUFBO0VBQXVCLGFBQUE7RUFBZSxxQkFBQTtBQVdwRTs7QUFWQTtFQUFnQixpQkFBQTtBQWNoQjs7QUFkcUM7RUFBYyxZQUFBO0VBQWMsY0FBQTtBQW1CakU7O0FBbkJtRjtFQUFXLGtCQUFBO0FBdUI5Rjs7QUF0QkE7RUFBTyxhQUFBO0VBQWUsc0JBQUE7RUFBd0IsV0FBQTtBQTRCOUM7O0FBM0JBO0VBQTRCLGdCQUFBO0VBQWtCLG1CQUFBO0FBZ0M5Qzs7QUEvQkE7RUFBZSxXQUFBO0VBQWEseUJBQUE7RUFBMkIscUJBQUE7RUFBc0IsZ0JBQUE7RUFBaUIsaUJBQUE7QUF1QzlGOztBQXRDQTtFQUFVLHlCQUFBO0VBQTJCLHFCQUFBO0VBQXNCLGVBQUE7RUFBZ0IsZUFBQTtBQTZDM0U7O0FBNUNBO0VBQVMsY0FBQTtBQWdEVDs7QUFoRDJCO0VBQVMsZ0JBQUE7QUFvRHBDOztBQXBEd0Q7RUFBa0IsWUFBQTtBQXdEMUU7QUFDQSw0ekRBQTR6RCIsInNvdXJjZXNDb250ZW50IjpbIi5zdXJ2ZXkgeyBtYXgtaGVpZ2h0OiA4NXZoOyBvdmVyZmxvdzogYXV0bzsgcGFkZGluZzogMS41cmVtOyBjb2xvcjogIzFmMjkzNzsgfVxuaGVhZGVyIHsgYmFja2dyb3VuZDogI2VlZjJmZjsgYm9yZGVyLXJhZGl1czogLjc1cmVtOyBwYWRkaW5nOiAxcmVtOyBtYXJnaW4tYm90dG9tOiAxLjVyZW07IH1cbmhlYWRlciBzdHJvbmcgeyBmb250LXNpemU6IDEuNHJlbTsgfSBoZWFkZXIgc3BhbiB7IGZsb2F0OiByaWdodDsgY29sb3I6ICM2YjcyODA7IH0gaGVhZGVyIHAgeyBtYXJnaW46IC41cmVtIDAgMDsgfVxuZm9ybSB7IGRpc3BsYXk6IGZsZXg7IGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47IGdhcDogLjdyZW07IH1cbmZvcm0gPiBsYWJlbDpub3QoLm9wdGlvbikgeyBmb250LXdlaWdodDogNjAwOyBtYXJnaW4tdG9wOiAuNzVyZW07IH1cbmZvcm0gPiBpbnB1dCB7IHdpZHRoOiAxMDAlOyBib3JkZXI6IDFweCBzb2xpZCAjZDFkNWRiOyBib3JkZXItcmFkaXVzOiAuNXJlbTsgcGFkZGluZzogLjY1cmVtOyBiYWNrZ3JvdW5kOiB3aGl0ZTsgfVxuLm9wdGlvbiB7IGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7IGJvcmRlci1yYWRpdXM6IC41cmVtOyBwYWRkaW5nOiAuNnJlbTsgY3Vyc29yOiBwb2ludGVyOyB9XG4uZXJyb3IgeyBjb2xvcjogI2I5MWMxYzsgfSBidXR0b24geyBtYXJnaW4tdG9wOiAxcmVtOyB9IGJ1dHRvbjpkaXNhYmxlZCB7IG9wYWNpdHk6IC42OyB9XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 5429:
/*!************************************************************************************!*\
  !*** ./src/app/shared/components/language-switcher/language-switcher.component.ts ***!
  \************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LanguageSwitcherComponent: () => (/* binding */ LanguageSwitcherComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../dropdown/dropdown.component */ 62157);
/* harmony import */ var _utility_constant_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../utility/constant.util */ 64487);
/* harmony import */ var _delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 90852);









const _c0 = ["languageSwitcher"];
const _c1 = function (a0, a1) {
  return {
    heading: a0,
    confirmationText: a1,
    primaryButtonLabel: "Continue",
    primaryButtonType: "ok"
  };
};
function LanguageSwitcherComponent_app_delete_detail_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "app-delete-detail", 3);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("close", function LanguageSwitcherComponent_app_delete_detail_2_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵrestoreView"](_r3);
      const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵresetView"](ctx_r2.confirmSwitch($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵpureFunction2"](1, _c1, ctx_r1.languageSwitchConfig.heading, ctx_r1.languageSwitchConfig.confirmText));
  }
}
class LanguageSwitcherComponent {
  /**
   * Class constructor
   * @param translateService
   */
  constructor(translateService) {
    this.translateService = translateService;
    this.languageChange = new _angular_core__WEBPACK_IMPORTED_MODULE_3__.EventEmitter();
    this.showLanguageSwitcher = false;
    this.languageSwitchConfig = {
      heading: this.translateService.instant('Switch Language'),
      confirmText: ''
    };
    this.languageDropDownConfig = {
      isBackground: false,
      placeHolderTxt: 'Select Preferred Language',
      bindLabel: 'name',
      bindValue: 'value',
      clearableOff: true,
      labelTxt: 'Select Preferred Language'
    };
  }
  ngOnInit() {
    const state = this.loggedInUser?.school?.state || this.loggedInUser?.profiles?.admin?.state;
    const localLanguage = _utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.LOC_LANGUAGES.find(language => language.state === state)?.value || [];
    this.languageDropdownOptions = [..._utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_LANGUAGE, ...localLanguage];
  }
  /**
   * ngafterviewinit hook used here to set the preferred language
   */
  ngAfterViewInit() {
    this.languageSwitcher.selectedItem = this.loggedInUser.preferredLanguage;
  }
  /**
   * Function trigged on language change
   * @param lang
   */
  changeLanguage(lang) {
    if (lang) {
      this.selectedLanguage = lang;
      this.languageSwitchConfig.confirmText = `${this.translateService.instant('Are you sure you want to switch the application language')}`;
      this.showLanguageSwitcher = true;
    }
  }
  confirmSwitch(val) {
    if (val === 'ok') {
      this.languageChange.emit(this.selectedLanguage);
    } else {
      this.languageSwitcher.selectedItem = this.loggedInUser.preferredLanguage;
    }
    this.showLanguageSwitcher = false;
  }
  static {
    this.ɵfac = function LanguageSwitcherComponent_Factory(t) {
      return new (t || LanguageSwitcherComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: LanguageSwitcherComponent,
      selectors: [["app-language-switcher"]],
      viewQuery: function LanguageSwitcherComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c0, 5);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.languageSwitcher = _t.first);
        }
      },
      inputs: {
        loggedInUser: "loggedInUser"
      },
      outputs: {
        languageChange: "languageChange"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
      decls: 3,
      vars: 3,
      consts: [[3, "dropDownValues", "config", "valueUpdate"], ["languageSwitcher", ""], [3, "config", "close", 4, "ngIf"], [3, "config", "close"]],
      template: function LanguageSwitcherComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "app-dropdown", 0, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function LanguageSwitcherComponent_Template_app_dropdown_valueUpdate_0_listener($event) {
            return ctx.changeLanguage($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, LanguageSwitcherComponent_app_delete_detail_2_Template, 1, 4, "app-delete-detail", 2);
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("dropDownValues", ctx.languageDropdownOptions)("config", ctx.languageDropDownConfig);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.showLanguageSwitcher);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule, _dropdown_dropdown_component__WEBPACK_IMPORTED_MODULE_0__.DropdownComponent, _delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_2__.DeleteDetailComponent],
      encapsulation: 2
    });
  }
}

/***/ }),

/***/ 7628:
/*!*************************************************!*\
  !*** ./src/app/shared/services/idle.service.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IdleService: () => (/* binding */ IdleService)
/* harmony export */ });
/* harmony import */ var _ng_idle_core__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @ng-idle/core */ 87491);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! rxjs */ 10819);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 51567);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _utility_constant_util__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utility/constant.util */ 64487);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _timer_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./timer.service */ 37955);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/common/http */ 46443);










class IdleService {
  constructor(idle, router, timerService, httpClient) {
    this.idle = idle;
    this.router = router;
    this.timerService = timerService;
    this.httpClient = httpClient;
    this.idleThreshold = _utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.IDLE_START_THRESHOLD;
    this.warningThreshold = _utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.IDLE_WARNING_THRESHOLD;
    this.currentModuleTag = null;
    this.previousModuleTag = null;
    this.idleIndicator = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
    this.customIdleTrackerRoutes = [];
    this.skipIdleActivityRoutes = [];
    this.isCustom = false;
    this.isSkip = false;
    this.isCompleted = false;
    this.initializeIdleTracking();
    this.router.events.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_5__.NavigationEnd)).subscribe({
      next: val => {
        const leaf = this.getLeafSnapshot();
        const flags = this.resolveIdleFlags(leaf, val.urlAfterRedirects);
        this.isCustom = flags.isCustom;
        this.isSkip = flags.isSkip;
        this.currentModuleTag = this.resolveTrackingTag(leaf, val.urlAfterRedirects);
        if (this.timerService.getCurrentTime('interaction') && !this.isSkip) {
          let trackObj = {
            moduleName: this.previousModuleTag,
            idleTime: this.timerService.getCurrentTime('idle'),
            interactionTime: this.timerService.getCurrentTime('interaction')
          };
          if (this.planId) {
            trackObj.planId = this.planId;
          }
          if (this.draftId) {
            trackObj.draftId = this.draftId;
            trackObj.isCompleted = this.isCompleted;
          }
          if (trackObj.interactionTime >= _utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.INTERACTION_LOG_THRESHOLD && trackObj.moduleName) {
            this.logActivity(trackObj);
          }
          this.timerService.resetTimer('idle');
          this.timerService.resetTimer('interaction');
          if (!this.isSkip) {
            this.idle.stop();
          }
        }
        if (!this.isCustom) {
          this.startWatching();
        }
      }
    });
  }
  initializeIdleTracking() {
    this.idle.setIdle(this.idleThreshold);
    this.idle.setTimeout(this.warningThreshold);
    this.idle.setInterrupts(_ng_idle_core__WEBPACK_IMPORTED_MODULE_6__.DEFAULT_INTERRUPTSOURCES);
    this.idle.onIdleStart.subscribe(() => {
      this.timerService.startTimer('idle');
      this.timerService.pauseTimer('interaction');
    });
    this.idle.onTimeout.subscribe(() => {
      this.timerService.pauseTimer('idle');
      this.timerService.pauseTimer('interaction');
      this.idleIndicator.next(true);
    });
    this.idle.onIdleEnd.subscribe(() => {
      this.timerService.pauseTimer('idle');
      this.timerService.resumeTimer('interaction');
    });
  }
  getLeafSnapshot() {
    let route = this.router.routerState.snapshot.root;
    while (route.firstChild) {
      route = route.firstChild;
    }
    return route;
  }
  resolveTrackingTag(leaf, url) {
    const map = leaf.data?.['trackingTagMap'];
    const planType = map ? leaf.paramMap.get('planType') : null;
    if (map && planType && map[planType]) {
      return map[planType];
    }
    return leaf.data?.['trackingTag'] ?? url.split('/').filter(Boolean)[0] ?? null;
  }
  resolveIdleFlags(leaf, url) {
    const tracking = leaf.data?.['idleTracking'];
    if (tracking === 'custom') {
      return {
        isCustom: true,
        isSkip: false
      };
    }
    if (tracking === 'skip') {
      return {
        isCustom: false,
        isSkip: true
      };
    }
    return {
      isCustom: this.customIdleTrackerRoutes.includes(url),
      isSkip: this.skipIdleActivityRoutes.includes(url)
    };
  }
  startWatching() {
    if (!this.isCustom) {
      this.previousModuleTag = this.currentModuleTag;
    }
    this.idle.watch();
    this.timerService.startTimer('interaction');
  }
  stopWatching(moduleName) {
    let trackObj = {
      moduleName: moduleName ? moduleName : this.getCurrentModuleName(),
      idleTime: this.timerService.getCurrentTime('idle'),
      interactionTime: this.timerService.getCurrentTime('interaction')
    };
    if (this.planId) {
      trackObj.planId = this.planId;
    }
    if (this.draftId) {
      trackObj.draftId = this.draftId;
      trackObj.isCompleted = this.isCompleted;
    }
    if (trackObj.interactionTime >= _utility_constant_util__WEBPACK_IMPORTED_MODULE_0__.INTERACTION_LOG_THRESHOLD && trackObj.moduleName) {
      this.logActivity(trackObj);
    }
    this.resetIdler();
  }
  getCurrentModuleName() {
    const isDraft = this.getLeafSnapshot().data?.['mode'] === 'draft';
    if (this.isCustom || this.isSkip || isDraft) {
      return null;
    }
    return this.currentModuleTag;
  }
  resetIdler() {
    this.timerService.resetTimer('idle');
    this.timerService.resetTimer('interaction');
    this.idle.stop();
  }
  logActivity(trackObj) {
    this.httpClient.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl}/activity-log`, trackObj).subscribe({
      next: val => {
        this.draftId = null;
        this.planId = null;
        this.isCompleted = false;
      },
      error: err => {
        console.log(err);
      }
    });
  }
  static {
    this.ɵfac = function IdleService_Factory(t) {
      return new (t || IdleService)(_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_ng_idle_core__WEBPACK_IMPORTED_MODULE_6__.Idle), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_5__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_timer_service__WEBPACK_IMPORTED_MODULE_2__.TimerService), _angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_8__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_7__["ɵɵdefineInjectable"]({
      token: IdleService,
      factory: IdleService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 37955:
/*!**************************************************!*\
  !*** ./src/app/shared/services/timer.service.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   TimerService: () => (/* binding */ TimerService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);

class TimerService {
  constructor() {
    this.timers = {};
  }
  startTimer(name) {
    if (!this.timers[name]) {
      this.timers[name] = {
        interval: null,
        startTime: 0,
        elapsedTime: 0,
        isPaused: true
      };
    }
    const timer = this.timers[name];
    if (timer.isPaused) {
      timer.startTime = Date.now() - timer.elapsedTime;
      timer.interval = setInterval(() => {
        timer.elapsedTime = Date.now() - timer.startTime;
      }, 100);
      timer.isPaused = false;
    }
  }
  pauseTimer(name) {
    const timer = this.timers[name];
    if (timer && !timer.isPaused) {
      clearInterval(timer.interval);
      timer.isPaused = true;
    }
  }
  resumeTimer(name) {
    this.startTimer(name);
  }
  resetTimer(name) {
    const timer = this.timers[name];
    if (timer) {
      clearInterval(timer.interval);
      timer.elapsedTime = 0;
      timer.isPaused = true;
    }
  }
  getCurrentTime(name) {
    const timer = this.timers[name];
    return timer ? timer.elapsedTime / 1000 : 0;
  }
  static {
    this.ɵfac = function TimerService_Factory(t) {
      return new (t || TimerService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjectable"]({
      token: TimerService,
      factory: TimerService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 83940:
/*!***********************************************!*\
  !*** ./src/app/shared/utility/common.util.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HttpLoaderFactory: () => (/* binding */ HttpLoaderFactory)
/* harmony export */ });
/* harmony import */ var _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @ngx-translate/http-loader */ 18952);

function HttpLoaderFactory(http) {
  return new _ngx_translate_http_loader__WEBPACK_IMPORTED_MODULE_0__.TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/***/ }),

/***/ 64487:
/*!*************************************************!*\
  !*** ./src/app/shared/utility/constant.util.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   BULK_UPLOAD_FILE_TYPES: () => (/* binding */ BULK_UPLOAD_FILE_TYPES),
/* harmony export */   CCE_TYPE_MAPPER: () => (/* binding */ CCE_TYPE_MAPPER),
/* harmony export */   CLASS_OPTIONS: () => (/* binding */ CLASS_OPTIONS),
/* harmony export */   DEFAULT_LANGUAGE: () => (/* binding */ DEFAULT_LANGUAGE),
/* harmony export */   DOCX_CONFIG: () => (/* binding */ DOCX_CONFIG),
/* harmony export */   IDLE_START_THRESHOLD: () => (/* binding */ IDLE_START_THRESHOLD),
/* harmony export */   IDLE_WARNING_THRESHOLD: () => (/* binding */ IDLE_WARNING_THRESHOLD),
/* harmony export */   INTERACTION_LOG_THRESHOLD: () => (/* binding */ INTERACTION_LOG_THRESHOLD),
/* harmony export */   LOADER_RESTRICTED_URLS: () => (/* binding */ LOADER_RESTRICTED_URLS),
/* harmony export */   LOC_LANGUAGES: () => (/* binding */ LOC_LANGUAGES),
/* harmony export */   LOGIN_ROUTE: () => (/* binding */ LOGIN_ROUTE),
/* harmony export */   MAX_FILE_SIZE: () => (/* binding */ MAX_FILE_SIZE),
/* harmony export */   MEDIUMS: () => (/* binding */ MEDIUMS),
/* harmony export */   QUESTION_SOURCE: () => (/* binding */ QUESTION_SOURCE),
/* harmony export */   SESSION_VERSION: () => (/* binding */ SESSION_VERSION),
/* harmony export */   TEX_MATH_DELIMITERS: () => (/* binding */ TEX_MATH_DELIMITERS),
/* harmony export */   formatMarks: () => (/* binding */ formatMarks)
/* harmony export */ });
const LOGIN_ROUTE = '/auth';
const SESSION_VERSION = 1;
const MAX_FILE_SIZE = 16 * 1024 * 1024;
const BULK_UPLOAD_FILE_TYPES = [".xlsx"];
const DEFAULT_LANGUAGE = [{
  name: 'English',
  value: 'en'
}];
const LOC_LANGUAGES = [{
  state: 'Karnataka',
  value: [{
    name: 'ಕನ್ನಡ',
    value: 'kn'
  }]
}, {
  state: 'Telangana',
  value: [{
    name: 'తెలుగు',
    value: 'tg'
  }]
}];
const MEDIUMS = [{
  name: 'English',
  value: 'english'
}, {
  name: 'Kannada',
  value: 'kannada'
}, {
  name: 'Telugu',
  value: 'telugu'
}];
const CLASS_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const LOADER_RESTRICTED_URLS = ['/chapter/list', '/master-lesson/list/', '/resource-plan/list/', '/teacher-lesson-plan/list', '/presentation/job', '/presentation/jobs', '/presentation/list', '/auth/me', '/chat/', '/lessonchat/'];
const IDLE_START_THRESHOLD = 180;
const IDLE_WARNING_THRESHOLD = 1620;
const INTERACTION_LOG_THRESHOLD = 10;
const QUESTION_SOURCE = {
  AI: 'AI Questions',
  LBA: 'Pre-generated Questions'
};
const formatMarks = marks => String(marks).replace(/(?:^0)?\.5$/, '½');
const CCE_TYPE_MAPPER = {
  'Science': 'cce_tools_math_science',
  'Mathematics': 'cce_tools_math_science',
  'Evs': 'cce_tools_math_science',
  'Social Science': 'cce_tools_social',
  'English': 'cce_tools_english'
};
const TEX_MATH_DELIMITERS = [{
  left: '$$',
  right: '$$',
  display: true
}, {
  left: '$',
  right: '$',
  display: false
}, {
  left: '\\(',
  right: '\\)',
  display: false
}, {
  left: '\\[',
  right: '\\]',
  display: true
}];
const DOCX_CONFIG = {
  spacing: {
    sectionHeader: {
      before: 120,
      after: 120
    },
    questionItem: {
      after: 100
    },
    optionItem: {
      after: 120
    },
    tableCell: {
      before: 50,
      after: 50
    }
  },
  indent: {
    optionLeft: '   '
  }
};

/***/ }),

/***/ 45312:
/*!*****************************************!*\
  !*** ./src/environments/environment.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   environment: () => (/* binding */ environment)
/* harmony export */ });
const environment = {
  production: false,
  apiUrl: 'https://shiksha-backend-goe8.onrender.com/api',
  CRYPTO_SECRET: 'your_crypto_secret',
  EXP_MONTH: 3,
  turnstileSiteKey: '',
  supersetUrl: 'https://superset.shiksha-dev.a4i-lab.in',
  supersetDashboardUuid: 'a28bffa3-9b9c-447b-be30-f8eb91500711',
  supersetMobileDashboardUuid: '35d238f0-3150-4c56-93f8-fc9e4f024585'
};

/***/ }),

/***/ 84429:
/*!*********************!*\
  !*** ./src/main.ts ***!
  \*********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/platform-browser */ 80436);
/* harmony import */ var _app_app_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app/app.module */ 50635);


_angular_platform_browser__WEBPACK_IMPORTED_MODULE_1__.platformBrowser().bootstrapModule(_app_app_module__WEBPACK_IMPORTED_MODULE_0__.AppModule).catch(err => console.error(err));

/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ __webpack_require__.O(0, ["vendor"], () => (__webpack_exec__(84429)));
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ }
]);
//# sourceMappingURL=main.120202d6bab02650.js.map