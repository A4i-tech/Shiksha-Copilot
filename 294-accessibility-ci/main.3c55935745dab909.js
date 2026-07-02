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
  path: '',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_view_view_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./view/view.module */ 42599)).then(m => m.ViewModule),
  canActivate: [_core_guards_auth_guard__WEBPACK_IMPORTED_MODULE_0__.AuthGuard]
}, {
  path: 'auth',
  loadChildren: () => Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("src_app_auth_auth_module_ts")]).then(__webpack_require__.bind(__webpack_require__, /*! ./auth/auth.module */ 60841)).then(m => m.AuthModule)
}, {
  path: 'faq',
  loadComponent: () => __webpack_require__.e(/*! import() */ "src_app_components_faq_faq_component_ts").then(__webpack_require__.bind(__webpack_require__, /*! ./components/faq/faq.component */ 59613)).then(c => c.FaqComponent)
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
/* harmony import */ var _home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./shared/utility/constant.util */ 64487);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _auth_sign_in_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./auth/sign-in.service */ 44283);
/* harmony import */ var _core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/services/utility.service */ 8128);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var _core_services_authorization_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/services/authorization.service */ 70581);
/* harmony import */ var _core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/services/loader-message.service */ 79365);
/* harmony import */ var _shared_services_idle_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shared/services/idle.service */ 7628);
/* harmony import */ var _core_services_baseline_survey_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/services/baseline-survey.service */ 91296);
/* harmony import */ var _core_services_baseline_survey_dialog_service__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./core/services/baseline-survey-dialog.service */ 66235);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ngx-spinner */ 61249);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
















const _c0 = function (a4) {
  return {
    heading: "Idle Time",
    confirmationText: "idle message",
    primaryButtonLabel: "Continue",
    primaryButtonType: "logout",
    idleTime: a4
  };
};
function AppComponent_app_delete_detail_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "app-delete-detail", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵlistener"]("close", function AppComponent_app_delete_detail_8_Template_app_delete_detail_close_0_listener($event) {
      _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵrestoreView"](_r2);
      const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵresetView"](ctx_r1.closeModal($event));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("config", _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpureFunction1"](2, _c0, ctx_r0.idleTime))("showCancelBtn", false);
  }
}
class AppComponent {
  constructor(authService, utilityService, router, authorizationService, loaderMessage, idleService, baselineSurveyService, baselineSurveyDialog) {
    this.authService = authService;
    this.utilityService = utilityService;
    this.router = router;
    this.authorizationService = authorizationService;
    this.loaderMessage = loaderMessage;
    this.idleService = idleService;
    this.baselineSurveyService = baselineSurveyService;
    this.baselineSurveyDialog = baselineSurveyDialog;
    this.title = 'shiksha-frontend';
    this.showIdleWarning = false;
    this.idleTime = Math.round((_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.IDLE_WARNING_THRESHOLD + _shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.IDLE_START_THRESHOLD) / 60);
    this.clipboardObserver = null;
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
          const user = res?.data ?? null;
          if (user) {
            localStorage.setItem('userData', JSON.stringify(user));
            // Only teachers / end users should see baseline survey
            if (this.isEndUser(user)) {
              this.checkBaselineStatus();
            }
          }
        },
        error: err => {
          this.utilityService.handleError(err);
          // fallback: use stored data
          const stored = localStorage.getItem('userData');
          if (stored) {
            try {
              const u = JSON.parse(stored);
              if (this.isEndUser(u)) {
                this.checkBaselineStatus();
              }
            } catch {}
          }
        }
      });
    }
    window.addEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }
  // ------ Determine which roles should see survey ------
  isEndUser(user) {
    const roles = Array.isArray(user?.role) ? user.role : [user?.role].filter(Boolean);
    const END_USER_ROLES = new Set(['teacher', 'user', 'end_user', 'librarian']);
    const EXCLUDE = new Set(['manager', 'admin', 'super_admin']);
    if (roles.some(r => EXCLUDE.has(String(r).toLowerCase()))) return false;
    if (roles.some(r => END_USER_ROLES.has(String(r).toLowerCase()))) return true;
    return false;
  }
  // ------ Check baseline survey completion ------
  checkBaselineStatus() {
    var _this = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      try {
        const response = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_11__.firstValueFrom)(_this.baselineSurveyService.checkCompleted());
        if (response?.success && !response.data?.completed) {
          const submitted = yield _this.baselineSurveyDialog.openSurvey();
          if (submitted) {
            _this.utilityService.showSuccess('Thank you for completing the survey!');
          }
        }
      } catch (error) {
        console.error('Error checking baseline survey status:', error);
      }
    })();
  }
  // ------ User leaving tab/window ------
  handleBeforeUnload(event) {
    console.log('User is about to close the tab or navigate away.');
    this.idleService.stopWatching();
  }
  // ------ Idle modal close ------
  closeModal(val) {
    if (val !== 'close') {
      this.idleService.startWatching();
    }
    this.showIdleWarning = false;
  }
  // ------ Update basic user data (legacy support) ------
  updateUserData() {
    this.authService.authMe().subscribe({
      next: res => {
        localStorage.setItem('userData', JSON.stringify(res?.data));
      },
      error: err => {
        this.utilityService.handleError(err);
      }
    });
  }
  ngOnDestroy() {
    this.clipboardObserver?.disconnect();
    window.removeEventListener('beforeunload', this.handleBeforeUnload.bind(this));
  }
  static {
    this.ɵfac = function AppComponent_Factory(t) {
      return new (t || AppComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_auth_sign_in_service__WEBPACK_IMPORTED_MODULE_2__.SignInService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_core_services_utility_service__WEBPACK_IMPORTED_MODULE_3__.UtilityService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_12__.Router), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_core_services_authorization_service__WEBPACK_IMPORTED_MODULE_4__.AuthorizationService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_core_services_loader_message_service__WEBPACK_IMPORTED_MODULE_5__.LoaderMessageService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_shared_services_idle_service__WEBPACK_IMPORTED_MODULE_6__.IdleService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_core_services_baseline_survey_service__WEBPACK_IMPORTED_MODULE_7__.BaselineSurveyService), _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdirectiveInject"](_core_services_baseline_survey_dialog_service__WEBPACK_IMPORTED_MODULE_8__.BaselineSurveyDialogService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵdefineComponent"]({
      type: AppComponent,
      selectors: [["app-root"]],
      decls: 9,
      vars: 6,
      consts: [["href", "#main-content", 1, "sr-only", "focus:not-sr-only", "focus:fixed", "focus:top-2", "focus:left-2", "focus:z-50", "focus:px-4", "focus:py-2", "focus:bg-white", "focus:border", "focus:border-primary", "focus:rounded", "focus:shadow-lg"], ["bdColor", "rgba(240, 240, 240, 0.3)", "size", "medium", "color", "#46A0F1", "type", "ball-scale-multiple"], [1, "text-black", "text-sm"], [3, "config", "showCancelBtn", "close", 4, "ngIf"], [3, "config", "showCancelBtn", "close"]],
      template: function AppComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](0, "a", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](1, " Skip to main content\n");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementStart"](2, "ngx-spinner", 1)(3, "p", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtext"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](5, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipe"](6, "async");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵelement"](7, "router-outlet");
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtemplate"](8, AppComponent_app_delete_detail_8_Template, 1, 4, "app-delete-detail", 3);
        }
        if (rf & 2) {
          let tmp_0_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](5, 2, (tmp_0_0 = _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵpipeBind1"](6, 4, ctx.loaderMessage.message$)) !== null && tmp_0_0 !== undefined ? tmp_0_0 : ""));
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_10__["ɵɵproperty"]("ngIf", ctx.showIdleWarning);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_13__.NgIf, _angular_router__WEBPACK_IMPORTED_MODULE_12__.RouterOutlet, ngx_spinner__WEBPACK_IMPORTED_MODULE_14__.NgxSpinnerComponent, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_9__.DeleteDetailComponent, _angular_common__WEBPACK_IMPORTED_MODULE_13__.AsyncPipe, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_15__.TranslatePipe],
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
/* harmony import */ var _angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @angular/platform-browser */ 80436);
/* harmony import */ var _app_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./app-routing.module */ 94114);
/* harmony import */ var _app_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app.component */ 20092);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @angular/common/http */ 46443);
/* harmony import */ var _core_interceptors_http_config_interceptor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/interceptors/http-config.interceptor */ 88581);
/* harmony import */ var ngx_spinner__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ngx-spinner */ 61249);
/* harmony import */ var _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! @angular/platform-browser/animations */ 43835);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _shared_utility_common_util__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/utility/common.util */ 83940);
/* harmony import */ var _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/components/language-switcher/language-switcher.component */ 5429);
/* harmony import */ var ngx_toastr__WEBPACK_IMPORTED_MODULE_26__ = __webpack_require__(/*! ngx-toastr */ 96371);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ng_idle_core__WEBPACK_IMPORTED_MODULE_27__ = __webpack_require__(/*! @ng-idle/core */ 87491);
/* harmony import */ var _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shared/components/delete-detail/delete-detail.component */ 24981);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! @angular/material/dialog */ 12587);
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_form_field__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! @angular/material/form-field */ 24950);
/* harmony import */ var _angular_material_input__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! @angular/material/input */ 95541);
/* harmony import */ var _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! @angular/material/checkbox */ 97024);
/* harmony import */ var _angular_material_radio__WEBPACK_IMPORTED_MODULE_21__ = __webpack_require__(/*! @angular/material/radio */ 53804);
/* harmony import */ var _angular_material_select__WEBPACK_IMPORTED_MODULE_22__ = __webpack_require__(/*! @angular/material/select */ 25175);
/* harmony import */ var _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_23__ = __webpack_require__(/*! @angular/material/snack-bar */ 3347);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_24__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_25__ = __webpack_require__(/*! @angular/material/icon */ 93840);
/* harmony import */ var _shared_components_baseline_survey_baseline_survey_component__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./shared/components/baseline-survey/baseline-survey.component */ 74589);
/* harmony import */ var _core_services_baseline_survey_dialog_service__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./core/services/baseline-survey-dialog.service */ 66235);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/core */ 37580);















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
      if (loggedInUser?.preferredLanguage) {
        this.translateService.use(loggedInUser.preferredLanguage);
      }
    }
  }
  static {
    this.ɵfac = function AppModule_Factory(t) {
      return new (t || AppModule)(_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵinject"](_ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateService));
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineNgModule"]({
      type: AppModule,
      bootstrap: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent]
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵdefineInjector"]({
      providers: [{
        provide: _angular_common_http__WEBPACK_IMPORTED_MODULE_10__.HTTP_INTERCEPTORS,
        useClass: _core_interceptors_http_config_interceptor__WEBPACK_IMPORTED_MODULE_2__.HttpConfigInterceptor,
        multi: true
      }, _angular_common__WEBPACK_IMPORTED_MODULE_11__.DatePipe, _core_services_baseline_survey_dialog_service__WEBPACK_IMPORTED_MODULE_7__.BaselineSurveyDialogService],
      imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_13__.BrowserAnimationsModule, ngx_spinner__WEBPACK_IMPORTED_MODULE_14__.NgxSpinnerModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_10__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_15__.ReactiveFormsModule,
      // Material
      _angular_material_dialog__WEBPACK_IMPORTED_MODULE_16__.MatDialogModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_17__.MatButtonModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_18__.MatFormFieldModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_19__.MatInputModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_20__.MatCheckboxModule, _angular_material_radio__WEBPACK_IMPORTED_MODULE_21__.MatRadioModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_22__.MatSelectModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_23__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_24__.MatProgressSpinnerModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_25__.MatIconModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateModule.forRoot({
        loader: {
          provide: _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateLoader,
          useFactory: _shared_utility_common_util__WEBPACK_IMPORTED_MODULE_3__.HttpLoaderFactory,
          deps: [_angular_common_http__WEBPACK_IMPORTED_MODULE_10__.HttpClient]
        }
      }), _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__.LanguageSwitcherComponent, ngx_toastr__WEBPACK_IMPORTED_MODULE_26__.ToastrModule.forRoot({
        timeOut: 5000,
        positionClass: 'toast-bottom-right'
      }), _ng_idle_core__WEBPACK_IMPORTED_MODULE_27__.NgIdleModule.forRoot(), _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_5__.DeleteDetailComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_8__["ɵɵsetNgModuleScope"](AppModule, {
    declarations: [_app_component__WEBPACK_IMPORTED_MODULE_1__.AppComponent, _shared_components_baseline_survey_baseline_survey_component__WEBPACK_IMPORTED_MODULE_6__.BaselineSurveyComponent],
    imports: [_angular_platform_browser__WEBPACK_IMPORTED_MODULE_12__.BrowserModule, _app_routing_module__WEBPACK_IMPORTED_MODULE_0__.AppRoutingModule, _angular_platform_browser_animations__WEBPACK_IMPORTED_MODULE_13__.BrowserAnimationsModule, ngx_spinner__WEBPACK_IMPORTED_MODULE_14__.NgxSpinnerModule, _angular_common_http__WEBPACK_IMPORTED_MODULE_10__.HttpClientModule, _angular_forms__WEBPACK_IMPORTED_MODULE_15__.ReactiveFormsModule,
    // Material
    _angular_material_dialog__WEBPACK_IMPORTED_MODULE_16__.MatDialogModule, _angular_material_button__WEBPACK_IMPORTED_MODULE_17__.MatButtonModule, _angular_material_form_field__WEBPACK_IMPORTED_MODULE_18__.MatFormFieldModule, _angular_material_input__WEBPACK_IMPORTED_MODULE_19__.MatInputModule, _angular_material_checkbox__WEBPACK_IMPORTED_MODULE_20__.MatCheckboxModule, _angular_material_radio__WEBPACK_IMPORTED_MODULE_21__.MatRadioModule, _angular_material_select__WEBPACK_IMPORTED_MODULE_22__.MatSelectModule, _angular_material_snack_bar__WEBPACK_IMPORTED_MODULE_23__.MatSnackBarModule, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_24__.MatProgressSpinnerModule, _angular_material_icon__WEBPACK_IMPORTED_MODULE_25__.MatIconModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_9__.TranslateModule, _shared_components_language_switcher_language_switcher_component__WEBPACK_IMPORTED_MODULE_4__.LanguageSwitcherComponent, ngx_toastr__WEBPACK_IMPORTED_MODULE_26__.ToastrModule, _ng_idle_core__WEBPACK_IMPORTED_MODULE_27__.NgIdleModule, _shared_components_delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_5__.DeleteDetailComponent]
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
  validateOTP(otpval, phoneNumber) {
    return this.post(`validate-otp`, {
      phone: phoneNumber,
      otp: otpval
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
  if (authorizationService.isLoggedIn()) {
    return true;
  } else {
    router.navigate([src_app_shared_utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.LOGIN_ROUTE]);
    return false;
  }
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
        this.utilityService.showWarning(error?.error?.message);
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
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ 75797);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ 95072);



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
    this.loggedIn = new rxjs__WEBPACK_IMPORTED_MODULE_0__.BehaviorSubject(false);
    this.loggedIn.next(this.isLoggedIn());
  }
  /**
   * Method to check if the user is logged in
   * @returns boolean
   */
  isLoggedIn() {
    return !!this.getLocalStorageItem('token');
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
      return new (t || AuthorizationService)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵinject"](_angular_router__WEBPACK_IMPORTED_MODULE_2__.Router));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
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
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/material/dialog */ 12587);
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var src_app_shared_components_baseline_survey_baseline_survey_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/components/baseline-survey/baseline-survey.component */ 74589);






class BaselineSurveyDialogService {
  constructor() {
    this.dialog = (0,_angular_core__WEBPACK_IMPORTED_MODULE_2__.inject)(_angular_material_dialog__WEBPACK_IMPORTED_MODULE_3__.MatDialog);
  }
  sessionKey(userId) {
    const year = new Date().getFullYear();
    return `baseline:shown:${userId}:${year}`;
  }
  /** Opens the survey dialog (blocking by default). Returns true if submitted. */
  openSurvey() {
    var _this = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* (force = true) {
      let userId = '';
      try {
        const stored = localStorage.getItem('userData');
        userId = stored ? JSON.parse(stored)?._id || '' : '';
      } catch {}
      const key = userId ? _this.sessionKey(userId) : `baseline:shown:anon:${new Date().getFullYear()}`;
      if (localStorage.getItem(key) === '1') return false;
      const ref = _this.dialog.open(src_app_shared_components_baseline_survey_baseline_survey_component__WEBPACK_IMPORTED_MODULE_1__.BaselineSurveyComponent, {
        width: '720px',
        disableClose: force,
        autoFocus: true,
        data: {
          force
        }
      });
      const result = yield (0,rxjs__WEBPACK_IMPORTED_MODULE_4__.firstValueFrom)(ref.afterClosed());
      if (result === true) localStorage.setItem(key, '1');
      return result === true;
    }).apply(this, arguments);
  }
  static {
    this.ɵfac = function BaselineSurveyDialogService_Factory(t) {
      return new (t || BaselineSurveyDialogService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
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
      return;
    }
    if (userId !== this.cachedUserId) {
      this.cachedUserId = userId;
      this.surveyCompleted = null;
    }
  }
  checkCompleted() {
    const uid = this.getUserId();
    this.resetCacheIfNeeded(uid);
    if (this.surveyCompleted !== null) {
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)({
        success: true,
        data: {
          completed: this.surveyCompleted
        }
      });
    }
    return this.http.get(`${this.baseUrl}/check`).pipe((0,rxjs_operators__WEBPACK_IMPORTED_MODULE_2__.map)(res => {
      const completed = !!res?.data?.completed;
      this.surveyCompleted = completed;
      return {
        success: !!res?.success,
        data: {
          completed
        }
      };
    }), (0,rxjs_operators__WEBPACK_IMPORTED_MODULE_3__.catchError)(error => {
      console.error('Error checking survey status:', error);
      return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.of)({
        success: false,
        data: {
          completed: false
        }
      });
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
    const userInfo = localStorage.getItem('userData') ?? null;
    return JSON.parse(userInfo);
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
    if (err.status === 400) {
      // Handle validation errors (array of error messages)
      if (err.error?.error && Array.isArray(err.error.error)) {
        const errorMessages = err.error.error.join(', ');
        this.showError(errorMessages || 'Validation failed. Please check your input.');
      } else if (err.error?.message) {
        this.showError(err.error.message);
      } else if (err.error?.error) {
        this.showError(err.error.error);
      } else {
        this.showError('An error occurred. Please try again.');
      }
    } else if (err.status === 401) {
      this.showError(err.error?.message || 'Unauthorized. Please login again.');
    } else if (err.status === 500) {
      this.showError('Server error. Please try again later.');
    }
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
  hasPermission(premissions) {
    const data = localStorage.getItem('userData') ?? null;
    const loggedInUser = JSON.parse(data);
    if (loggedInUser) {
      return premissions.some(element => loggedInUser.role.includes(element));
    }
    return false;
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
  /**
   * Returns only the zones assigned to a manager for a given state.
   * @param regionsData - The full regions data array
   * @param user - The logged-in user object (should have .state and .zones)
   * @returns Array of zone objects assigned to the manager for the user's state
   */
  getZonesForManager(regionsData, user) {
    if (!user || !user.state || !user.zones || !Array.isArray(user.zones)) {
      return [];
    }
    const stateObj = regionsData.find(state => state.state === user.state);
    if (!stateObj || !Array.isArray(stateObj.zones)) {
      return [];
    }
    return stateObj.zones.filter(zone => user.zones.includes(zone.name));
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
/* harmony import */ var _angular_material_button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @angular/material/button */ 84175);
/* harmony import */ var _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @angular/material/progress-spinner */ 41134);
/* harmony import */ var _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @angular/material/icon */ 93840);











function BaselineSurveyComponent_label_38_Template(rf, ctx) {
  if (rf & 1) {
    const _r24 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "label", 44)(1, "input", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("change", function BaselineSurveyComponent_label_38_Template_input_change_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r24);
      const o_r22 = restoredCtx.$implicit;
      const ctx_r23 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r23.toggleArray("plans", o_r22));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r22 = ctx.$implicit;
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", ctx_r0.isChecked("plans", o_r22));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r22);
  }
}
function BaselineSurveyComponent_div_39_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select at least one option. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_label_49_Template(rf, ctx) {
  if (rf & 1) {
    const _r27 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "label", 44)(1, "input", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("change", function BaselineSurveyComponent_label_49_Template_input_change_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r27);
      const o_r25 = restoredCtx.$implicit;
      const ctx_r26 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r26.toggleArray("devices", o_r25));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r25 = ctx.$implicit;
    const ctx_r2 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", ctx_r2.isChecked("devices", o_r25));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r25);
  }
}
function BaselineSurveyComponent_div_50_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select at least one option. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_option_63_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const o_r28 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", o_r28);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r28);
  }
}
function BaselineSurveyComponent_div_66_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select how many lesson plans you create. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_label_76_Template(rf, ctx) {
  if (rf & 1) {
    const _r31 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "label", 44)(1, "input", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("change", function BaselineSurveyComponent_label_76_Template_input_change_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r31);
      const o_r29 = restoredCtx.$implicit;
      const ctx_r30 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r30.toggleArray("lessonPlanComponents", o_r29));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r29 = ctx.$implicit;
    const ctx_r6 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", ctx_r6.isChecked("lessonPlanComponents", o_r29));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r29);
  }
}
function BaselineSurveyComponent_div_77_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select at least one component. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_div_78_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 51);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_option_91_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const o_r32 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", o_r32);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r32);
  }
}
function BaselineSurveyComponent_div_94_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select an approximate time. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_div_95_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 52);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_label_105_Template(rf, ctx) {
  if (rf & 1) {
    const _r35 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "label", 44)(1, "input", 45);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("change", function BaselineSurveyComponent_label_105_Template_input_change_1_listener() {
      const restoredCtx = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r35);
      const o_r33 = restoredCtx.$implicit;
      const ctx_r34 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r34.toggleArray("resourcesUsed", o_r33));
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](2, "span", 46);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span", 47);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const o_r33 = ctx.$implicit;
    const ctx_r12 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("checked", ctx_r12.isChecked("resourcesUsed", o_r33));
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r33);
  }
}
function BaselineSurveyComponent_div_106_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select at least one resource. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_div_107_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 53);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_option_120_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "option", 49);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const o_r36 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("value", o_r36);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](o_r36);
  }
}
function BaselineSurveyComponent_div_123_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 48);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Please select how much time you spend on assessments. ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_div_124_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 50);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "input", 54);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_button_134_Template(rf, ctx) {
  if (rf & 1) {
    const _r38 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "button", 55);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("click", function BaselineSurveyComponent_button_134_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵrestoreView"](_r38);
      const ctx_r37 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵresetView"](ctx_r37.onClose());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, " Cancel ");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r18 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx_r18.submitting);
  }
}
function BaselineSurveyComponent_span_136_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](1, "Submit Survey");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
  }
}
function BaselineSurveyComponent_mat_spinner_137_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](0, "mat-spinner", 56);
  }
}
function BaselineSurveyComponent_div_138_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 57)(1, "mat-icon");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](2, "error_outline");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](3, "span");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const ctx_r21 = _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](4);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx_r21.error);
  }
}
class BaselineSurveyComponent {
  constructor(fb, surveyService, snackBar, dialogRef, data) {
    this.fb = fb;
    this.surveyService = surveyService;
    this.snackBar = snackBar;
    this.dialogRef = dialogRef;
    this.data = data;
    this.submitting = false;
    this.error = null;
    // Options
    this.planOptions = ['Paper-based', 'Digital documents (Word/Google Docs/PowerPoint)'];
    this.deviceOptions = ['School desktop/laptop/tablet', 'Personal desktop/laptop/tablet', 'Personal mobile phone', 'Not applicable'];
    this.weeklyOptions = ['1', '2', '3', '4', 'More than 5'];
    this.componentOptions = ['Hands-on activities', 'Real-world examples or analogies', 'Stories', 'Videos', 'Others' // "Others" has input
    ];

    this.timeOptions = ['30 minutes', '60 minutes', '90 minutes', 'Others']; //"Others" has input
    this.resourceOptions = ['Educational websites (Khan Academy)', 'Diksha', 'YouTube', 'Others' // "Others" has input
    ];

    this.assessOptions = ['30 minutes', '60 minutes', '90 minutes', 'Others']; //"Others" has input
    this.surveyForm = this.fb.group({
      plans: this.fb.array([], [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, this.minSelectedCheckboxes(1)]),
      devices: this.fb.array([], [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, this.minSelectedCheckboxes(1)]),
      weeklyLessonPlans: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      lessonPlanComponents: this.fb.array([], [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, this.minSelectedCheckboxes(1)]),
      timePerLessonPlan: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      resourcesUsed: this.fb.array([], [_angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required, this.minSelectedCheckboxes(1)]),
      timeForAssessments: ['', _angular_forms__WEBPACK_IMPORTED_MODULE_2__.Validators.required],
      otherNotes: [''],
      // NEW: "Others" free-text fields
      otherLessonPlanComponent: [''],
      otherResourceUsed: [''],
      otherTimePerLessonPlan: [''],
      otherTimeForAssessments: [''] // when timeForAssessments = "Others"
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
  toggleArray(controlName, value) {
    const formArray = this.surveyForm.get(controlName);
    const index = formArray.value.indexOf(value);
    if (index === -1) {
      formArray.push(new _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControl(value));
    } else {
      formArray.removeAt(index);
    }
    formArray.updateValueAndValidity();
  }
  isChecked(controlName, value) {
    const formArray = this.surveyForm.get(controlName);
    return formArray.value.includes(value);
  }
  // NEW: convenience getters for showing "Others" inputs
  get showOtherLessonComponent() {
    return this.isChecked('lessonPlanComponents', 'Others');
  }
  get showOtherResourceUsed() {
    return this.isChecked('resourcesUsed', 'Others');
  }
  get showOtherTimePerLessonPlan() {
    return this.surveyForm.get('timePerLessonPlan')?.value === 'Others';
  }
  get showOtherTimeForAssessments() {
    return this.surveyForm.get('timeForAssessments')?.value === 'Others';
  }
  onSubmit() {
    if (this.surveyForm.invalid) {
      this.markTouched(this.surveyForm);
      this.error = 'Please fill in all required fields.';
      return;
    }
    this.submitting = true;
    this.error = null;
    const formValue = this.surveyForm.value;
    // OPTIONAL: if you want to merge "Others" text into arrays,
    // uncomment these lines and adjust your API side if needed.
    // if (formValue.otherLessonPlanComponent) {
    //   formValue.lessonPlanComponents = formValue.lessonPlanComponents
    //     .filter((v: string) => v !== 'Others')
    //     .concat(`Others: ${formValue.otherLessonPlanComponent}`);
    // }
    // if (formValue.otherResourceUsed) {
    //   formValue.resourcesUsed = formValue.resourcesUsed
    //     .filter((v: string) => v !== 'Others')
    //     .concat(`Others: ${formValue.otherResourceUsed}`);
    // }
    this.surveyService.submitSurvey(formValue).subscribe({
      next: response => {
        this.submitting = false;
        if (response.success) {
          this.snackBar.open('Survey submitted successfully!', 'Close', {
            duration: 5000,
            panelClass: ['success-snackbar']
          });
          this.dialogRef.close(true);
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
  onClose() {
    if (this.data?.force) {
      return;
    }
    if (this.surveyForm.dirty) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        this.dialogRef.close(false);
      }
    } else {
      this.dialogRef.close(false);
    }
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
      decls: 139,
      vars: 38,
      consts: [[1, "survey-wrapper"], [1, "survey-container"], [1, "survey-hero"], [1, "survey-header"], [1, "survey-title-block"], [1, "survey-pill-row"], [1, "survey-pill", "primary"], [1, "survey-pill"], [1, "survey-info-banner"], [1, "info-icon"], [1, "info-text"], [1, "hero-illustration"], [1, "illustration-container"], [1, "teacher-avatar"], [1, "teacher-icon"], [1, "floating-elements"], [1, "floating-item", "item-1"], [1, "floating-item", "item-2"], [1, "floating-item", "item-3"], [1, "survey-form", 3, "formGroup", "ngSubmit"], [1, "form-group"], [1, "question-header"], [1, "question-number"], [1, "label-pill"], [1, "checkbox-group"], ["class", "checkbox-card", 4, "ngFor", "ngForOf"], ["class", "field-error", 4, "ngIf"], [1, "required-star"], [1, "select-wrapper"], ["formControlName", "weeklyLessonPlans", 1, "form-control"], ["value", ""], [3, "value", 4, "ngFor", "ngForOf"], [1, "select-arrow"], ["class", "other-input", 4, "ngIf"], ["formControlName", "timePerLessonPlan", 1, "form-control"], ["formControlName", "timeForAssessments", 1, "form-control"], [1, "textarea-wrapper"], ["formControlName", "otherNotes", "rows", "3", "placeholder", "Anything else about your lesson planning process that you would like us to know?", 1, "form-control"], [1, "form-actions"], ["mat-button", "", "type", "button", "class", "btn-cancel", 3, "disabled", "click", 4, "ngIf"], ["mat-raised-button", "", "color", "primary", "type", "submit", 1, "btn-submit", 3, "disabled"], [4, "ngIf"], ["diameter", "20", 4, "ngIf"], ["class", "error-message", 4, "ngIf"], [1, "checkbox-card"], ["type", "checkbox", 3, "checked", "change"], [1, "checkmark"], [1, "checkbox-text"], [1, "field-error"], [3, "value"], [1, "other-input"], ["type", "text", "formControlName", "otherLessonPlanComponent", "placeholder", "Please specify other components", 1, "form-control"], ["type", "text", "formControlName", "otherTimePerLessonPlan", "placeholder", "Please specify the time taken", 1, "form-control"], ["type", "text", "formControlName", "otherResourceUsed", "placeholder", "Please specify other resources", 1, "form-control"], ["type", "text", "formControlName", "otherTimeForAssessments", "placeholder", "Please specify the time spent on assessments", 1, "form-control"], ["mat-button", "", "type", "button", 1, "btn-cancel", 3, "disabled", "click"], ["diameter", "20"], [1, "error-message"]],
      template: function BaselineSurveyComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "div", 3)(4, "div", 4)(5, "div", 5)(6, "span", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](7, "Please fill the Baseline Survey");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "span", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](9, "Takes ~ 1 minute");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](10, "div", 8)(11, "div", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12, "\uD83D\uDCA1");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](13, "div", 10)(14, "strong");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15, "Your responses will directly help us to improve the Shiksha copilot portal.");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](16, "div", 11)(17, "div", 12)(18, "div", 13)(19, "div", 14);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](20, "\uD83D\uDC69\u200D\uD83C\uDFEB");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](21, "div", 15)(22, "div", 16);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](23, "\uD83D\uDCDA");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](24, "div", 17);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](25, "\u270F\uFE0F");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](26, "div", 18);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](27, "\uD83D\uDCDD");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()()()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](28, "form", 19);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵlistener"]("ngSubmit", function BaselineSurveyComponent_Template_form_ngSubmit_28_listener() {
            return ctx.onSubmit();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](29, "div", 20)(30, "div", 21)(31, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](32, "1");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](33, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](34, " How do you currently plan your lessons? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](35, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](36, "Select all that apply");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](37, "div", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](38, BaselineSurveyComponent_label_38_Template, 5, 2, "label", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](39, BaselineSurveyComponent_div_39_Template, 2, 0, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](40, "div", 20)(41, "div", 21)(42, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](43, "2");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](44, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](45, " Which device do you use while creating lesson plans? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](46, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](47, "Select all that apply");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](48, "div", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](49, BaselineSurveyComponent_label_49_Template, 5, 2, "label", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](50, BaselineSurveyComponent_div_50_Template, 2, 0, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](51, "div", 20)(52, "div", 21)(53, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](54, "3");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](55, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](56, " How many lesson plans do you create in a week? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](57, "span", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](58, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](59, "div", 28)(60, "select", 29)(61, "option", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](62, "Select");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](63, BaselineSurveyComponent_option_63_Template, 2, 2, "option", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](64, "div", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](65, "\u25BC");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](66, BaselineSurveyComponent_div_66_Template, 2, 0, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](67, "div", 20)(68, "div", 21)(69, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](70, "4");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](71, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](72, " Which components do you include in your lesson plans? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](73, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](74, "Select all that apply");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](75, "div", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](76, BaselineSurveyComponent_label_76_Template, 5, 2, "label", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](77, BaselineSurveyComponent_div_77_Template, 2, 0, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](78, BaselineSurveyComponent_div_78_Template, 2, 0, "div", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](79, "div", 20)(80, "div", 21)(81, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](82, "5");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](83, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](84, " On average, how much time do you spend creating a single lesson plan (including activities such as hands-on tasks, real-world examples, stories, and videos)? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](85, "span", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](86, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](87, "div", 28)(88, "select", 34)(89, "option", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](90, "Select");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](91, BaselineSurveyComponent_option_91_Template, 2, 2, "option", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](92, "div", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](93, "\u25BC");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](94, BaselineSurveyComponent_div_94_Template, 2, 0, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](95, BaselineSurveyComponent_div_95_Template, 2, 0, "div", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](96, "div", 20)(97, "div", 21)(98, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](99, "6");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](100, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](101, " Which resources do you use while planning? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](102, "span", 23);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](103, "Select all that apply");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](104, "div", 24);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](105, BaselineSurveyComponent_label_105_Template, 5, 2, "label", 25);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](106, BaselineSurveyComponent_div_106_Template, 2, 0, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](107, BaselineSurveyComponent_div_107_Template, 2, 0, "div", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](108, "div", 20)(109, "div", 21)(110, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](111, "7");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](112, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](113, " On average, how much time do you spend creating assessments for each subject (Unit level, Formative Assessment, Summative Assessment)? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](114, "span", 27);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](115, "*");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](116, "div", 28)(117, "select", 35)(118, "option", 30);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](119, "Select");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](120, BaselineSurveyComponent_option_120_Template, 2, 2, "option", 31);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](121, "div", 32);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](122, "\u25BC");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](123, BaselineSurveyComponent_div_123_Template, 2, 0, "div", 26);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](124, BaselineSurveyComponent_div_124_Template, 2, 0, "div", 33);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](125, "div", 20)(126, "div", 21)(127, "div", 22);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](128, "8");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](129, "label");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](130, "Other notes or comments (optional)");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](131, "div", 36);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](132, "textarea", 37);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](133, "div", 38);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](134, BaselineSurveyComponent_button_134_Template, 2, 1, "button", 39);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](135, "button", 40);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](136, BaselineSurveyComponent_span_136_Template, 2, 0, "span", 41);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](137, BaselineSurveyComponent_mat_spinner_137_Template, 1, 0, "mat-spinner", 42);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](138, BaselineSurveyComponent_div_138_Template, 5, 1, "div", 43);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()()();
        }
        if (rf & 2) {
          let tmp_1_0;
          let tmp_3_0;
          let tmp_4_0;
          let tmp_6_0;
          let tmp_7_0;
          let tmp_9_0;
          let tmp_10_0;
          let tmp_12_0;
          let tmp_14_0;
          let tmp_16_0;
          let tmp_18_0;
          let tmp_20_0;
          let tmp_22_0;
          let tmp_24_0;
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](28);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("formGroup", ctx.surveyForm);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("has-error", ((tmp_1_0 = ctx.surveyForm.get("plans")) == null ? null : tmp_1_0.invalid) && ((tmp_1_0 = ctx.surveyForm.get("plans")) == null ? null : tmp_1_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.planOptions);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_3_0 = ctx.surveyForm.get("plans")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx.surveyForm.get("plans")) == null ? null : tmp_3_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("has-error", ((tmp_4_0 = ctx.surveyForm.get("devices")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx.surveyForm.get("devices")) == null ? null : tmp_4_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.deviceOptions);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_6_0 = ctx.surveyForm.get("devices")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx.surveyForm.get("devices")) == null ? null : tmp_6_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("has-error", ((tmp_7_0 = ctx.surveyForm.get("weeklyLessonPlans")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx.surveyForm.get("weeklyLessonPlans")) == null ? null : tmp_7_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.weeklyOptions);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_9_0 = ctx.surveyForm.get("weeklyLessonPlans")) == null ? null : tmp_9_0.invalid) && ((tmp_9_0 = ctx.surveyForm.get("weeklyLessonPlans")) == null ? null : tmp_9_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("has-error", ((tmp_10_0 = ctx.surveyForm.get("lessonPlanComponents")) == null ? null : tmp_10_0.invalid) && ((tmp_10_0 = ctx.surveyForm.get("lessonPlanComponents")) == null ? null : tmp_10_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.componentOptions);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_12_0 = ctx.surveyForm.get("lessonPlanComponents")) == null ? null : tmp_12_0.invalid) && ((tmp_12_0 = ctx.surveyForm.get("lessonPlanComponents")) == null ? null : tmp_12_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.showOtherLessonComponent);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("has-error", ((tmp_14_0 = ctx.surveyForm.get("timePerLessonPlan")) == null ? null : tmp_14_0.invalid) && ((tmp_14_0 = ctx.surveyForm.get("timePerLessonPlan")) == null ? null : tmp_14_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.timeOptions);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_16_0 = ctx.surveyForm.get("timePerLessonPlan")) == null ? null : tmp_16_0.invalid) && ((tmp_16_0 = ctx.surveyForm.get("timePerLessonPlan")) == null ? null : tmp_16_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.showOtherTimePerLessonPlan);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("has-error", ((tmp_18_0 = ctx.surveyForm.get("resourcesUsed")) == null ? null : tmp_18_0.invalid) && ((tmp_18_0 = ctx.surveyForm.get("resourcesUsed")) == null ? null : tmp_18_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](9);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.resourceOptions);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_20_0 = ctx.surveyForm.get("resourcesUsed")) == null ? null : tmp_20_0.invalid) && ((tmp_20_0 = ctx.surveyForm.get("resourcesUsed")) == null ? null : tmp_20_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.showOtherResourceUsed);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("has-error", ((tmp_22_0 = ctx.surveyForm.get("timeForAssessments")) == null ? null : tmp_22_0.invalid) && ((tmp_22_0 = ctx.surveyForm.get("timeForAssessments")) == null ? null : tmp_22_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.assessOptions);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ((tmp_24_0 = ctx.surveyForm.get("timeForAssessments")) == null ? null : tmp_24_0.invalid) && ((tmp_24_0 = ctx.surveyForm.get("timeForAssessments")) == null ? null : tmp_24_0.touched));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.showOtherTimeForAssessments);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !(ctx.data == null ? null : ctx.data.force));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("disabled", ctx.surveyForm.invalid || ctx.submitting);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", !ctx.submitting);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.submitting);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngIf", ctx.error);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.NgForOf, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgNoValidate"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgSelectOption, _angular_forms__WEBPACK_IMPORTED_MODULE_2__["ɵNgSelectMultipleOption"], _angular_forms__WEBPACK_IMPORTED_MODULE_2__.DefaultValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.SelectControlValueAccessor, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.NgControlStatusGroup, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormGroupDirective, _angular_forms__WEBPACK_IMPORTED_MODULE_2__.FormControlName, _angular_material_button__WEBPACK_IMPORTED_MODULE_6__.MatButton, _angular_material_progress_spinner__WEBPACK_IMPORTED_MODULE_7__.MatProgressSpinner, _angular_material_icon__WEBPACK_IMPORTED_MODULE_8__.MatIcon],
      styles: ["\n\n.survey-wrapper[_ngcontent-%COMP%] {\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n  \n\n}\n.survey-wrapper   [_nghost-%COMP%]     .mat-dialog-container {\n  padding: 0;\n  max-width: 100vw;\n  overflow: hidden;\n  box-shadow: 0 25px 50px -12px rgba(75, 75, 75, 0.25);\n  box-shadow: 0 25px 50px -12px color-mix(in srgb, var(--content-DEFAULT) 25%, transparent);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 900px;\n  margin: 0 auto;\n  padding: 0;\n  background: linear-gradient(135deg, var(--surface-muted) 0%, var(--shade-80) 100%);\n  font-family: \"Inter\", -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n  max-height: 85vh;\n  overflow-y: auto;\n  overflow-x: hidden;\n  box-sizing: border-box;\n  position: relative;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-hero[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--primary-DEFAULT) 0%, var(--primary-DEFAULT) 100%);\n  padding: 32px 40px 24px;\n  color: var(--surface-DEFAULT);\n  position: relative;\n  overflow: hidden;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-hero[_ngcontent-%COMP%]::before {\n  content: \"\";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\");\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  position: relative;\n  z-index: 1;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-title-block[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n  flex: 1;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-pill-row[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 8px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-pill[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 600;\n  padding: 6px 12px;\n  border-radius: 20px;\n  background: rgba(255, 255, 255, 0.2);\n  background: color-mix(in srgb, var(--surface-DEFAULT) 20%, transparent);\n  color: rgba(255, 255, 255, 0.9);\n  color: color-mix(in srgb, var(--surface-DEFAULT) 90%, transparent);\n  text-transform: uppercase;\n  letter-spacing: 0.04em;\n  backdrop-filter: blur(10px);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-pill.primary[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.3);\n  background: color-mix(in srgb, var(--surface-DEFAULT) 30%, transparent);\n  color: var(--surface-DEFAULT);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-info-banner[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n  background: rgba(255, 255, 255, 0.15);\n  background: color-mix(in srgb, var(--surface-DEFAULT) 15%, transparent);\n  border-radius: 12px;\n  padding: 14px 16px;\n  backdrop-filter: blur(10px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border: 1px solid color-mix(in srgb, var(--surface-DEFAULT) 20%, transparent);\n  max-width: 500px;\n  margin-top: 8px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-info-banner[_ngcontent-%COMP%]   .info-icon[_ngcontent-%COMP%] {\n  width: 28px;\n  height: 28px;\n  border-radius: 999px;\n  background: var(--surface-DEFAULT);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  flex-shrink: 0;\n  color: var(--tertiary-DEFAULT);\n  font-size: 14px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-info-banner[_ngcontent-%COMP%]   .info-text[_ngcontent-%COMP%] {\n  color: var(--surface-DEFAULT);\n  font-size: 0.9rem;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .hero-illustration[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-left: 20px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .illustration-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 140px;\n  height: 140px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .teacher-avatar[_ngcontent-%COMP%] {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  background: var(--surface-DEFAULT);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: absolute;\n  top: 20px;\n  left: 20px;\n  box-shadow: 0 10px 25px rgba(75, 75, 75, 0.15);\n  box-shadow: 0 10px 25px color-mix(in srgb, var(--content-DEFAULT) 15%, transparent);\n  z-index: 2;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .teacher-icon[_ngcontent-%COMP%] {\n  font-size: 40px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .floating-elements[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .floating-item[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 40px;\n  height: 40px;\n  border-radius: 50%;\n  background: var(--surface-DEFAULT);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  box-shadow: 0 5px 15px rgba(75, 75, 75, 0.1);\n  box-shadow: 0 5px 15px color-mix(in srgb, var(--content-DEFAULT) 10%, transparent);\n  animation: _ngcontent-%COMP%_float 6s ease-in-out infinite;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .item-1[_ngcontent-%COMP%] {\n  top: 0;\n  left: 0;\n  animation-delay: 0s;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .item-2[_ngcontent-%COMP%] {\n  top: 10px;\n  right: 0;\n  animation-delay: 2s;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .item-3[_ngcontent-%COMP%] {\n  bottom: 0;\n  left: 50%;\n  transform: translateX(-50%);\n  animation-delay: 4s;\n}\n@keyframes _ngcontent-%COMP%_float {\n  0% {\n    transform: translateY(0px);\n  }\n  50% {\n    transform: translateY(-10px);\n  }\n  100% {\n    transform: translateY(0px);\n  }\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-form[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 24px;\n  padding: 32px 40px;\n  width: 100%;\n  box-sizing: border-box;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 16px;\n  background: var(--surface-DEFAULT);\n  padding: 24px;\n  border-radius: 16px;\n  box-shadow: 0 4px 12px rgba(75, 75, 75, 0.05);\n  box-shadow: 0 4px 12px color-mix(in srgb, var(--content-DEFAULT) 5%, transparent);\n  border: 1px solid rgba(75, 75, 75, 0.04);\n  border: 1px solid color-mix(in srgb, var(--content-DEFAULT) 4%, transparent);\n  transition: all 0.3s ease;\n  position: relative;\n  overflow: hidden;\n  width: 100%;\n  box-sizing: border-box;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 8px 25px rgba(75, 75, 75, 0.08);\n  box-shadow: 0 8px 25px color-mix(in srgb, var(--content-DEFAULT) 8%, transparent);\n  transform: translateY(-2px);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .question-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: flex-start;\n  gap: 12px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .question-number[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  background: linear-gradient(135deg, var(--primary-DEFAULT) 0%, var(--primary-DEFAULT) 100%);\n  color: var(--surface-DEFAULT);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-weight: 600;\n  font-size: 0.9rem;\n  flex-shrink: 0;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%]   label[_ngcontent-%COMP%] {\n  font-weight: 600;\n  color: var(--content-DEFAULT);\n  font-size: 1rem;\n  line-height: 1.5;\n  margin: 0;\n  flex: 1;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .label-pill[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 500;\n  color: var(--primary-DEFAULT);\n  background: var(--primary-50);\n  padding: 4px 10px;\n  border-radius: 20px;\n  margin-left: 8px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .required-star[_ngcontent-%COMP%] {\n  color: var(--error-DEFAULT);\n  font-size: 0.9rem;\n  font-weight: 600;\n  margin-left: 4px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkbox-group[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n  gap: 12px;\n  margin-top: 8px;\n  width: 100%;\n  box-sizing: border-box;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkbox-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  font-weight: 500;\n  cursor: pointer;\n  padding: 14px 16px;\n  margin: 0;\n  font-size: 0.95rem;\n  border-radius: 12px;\n  transition: all 0.2s ease;\n  position: relative;\n  background: var(--surface-muted);\n  border: 1.5px solid transparent;\n  width: 100%;\n  box-sizing: border-box;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkbox-card[_ngcontent-%COMP%]:hover {\n  background: var(--shade-80);\n  border-color: var(--content-30);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkbox-card[_ngcontent-%COMP%]   input[type=checkbox][_ngcontent-%COMP%] {\n  position: absolute;\n  opacity: 0;\n  cursor: pointer;\n  height: 0;\n  width: 0;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkmark[_ngcontent-%COMP%] {\n  height: 20px;\n  width: 20px;\n  background-color: var(--shade-80);\n  border-radius: 6px;\n  border: 2px solid var(--content-30);\n  position: relative;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkbox-card[_ngcontent-%COMP%]:hover   .checkmark[_ngcontent-%COMP%] {\n  border-color: var(--content-50);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkbox-card[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    ~ .checkmark[_ngcontent-%COMP%] {\n  background-color: var(--primary-DEFAULT);\n  border-color: var(--primary-DEFAULT);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkmark[_ngcontent-%COMP%]:after {\n  content: \"\";\n  position: absolute;\n  display: none;\n  left: 6px;\n  top: 2px;\n  width: 5px;\n  height: 10px;\n  border: solid var(--surface-DEFAULT);\n  border-width: 0 2px 2px 0;\n  transform: rotate(45deg);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkbox-card[_ngcontent-%COMP%]   input[_ngcontent-%COMP%]:checked    ~ .checkmark[_ngcontent-%COMP%]:after {\n  display: block;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkbox-card[_ngcontent-%COMP%]:has(input:checked) {\n  background: var(--primary-50);\n  border-color: var(--primary-DEFAULT);\n  color: var(--primary-DEFAULT);\n  font-weight: 600;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .checkbox-text[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .select-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 5px 16px;\n  border: 1.5px solid var(--content-30);\n  border-radius: 12px;\n  font-size: 15px;\n  font-family: inherit;\n  background: var(--surface-muted);\n  transition: all 0.3s ease;\n  box-sizing: border-box;\n  appearance: none;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .form-control[_ngcontent-%COMP%]:focus {\n  outline: none;\n  border-color: var(--primary-DEFAULT);\n  background: var(--surface-DEFAULT);\n  box-shadow: 0 0 0 3px rgba(70, 160, 241, 0.1);\n  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-DEFAULT) 10%, transparent);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .select-arrow[_ngcontent-%COMP%] {\n  position: absolute;\n  right: 16px;\n  top: 50%;\n  transform: translateY(-50%);\n  pointer-events: none;\n  color: var(--content-60);\n  font-size: 12px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .textarea-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.survey-wrapper[_ngcontent-%COMP%]   textarea.form-control[_ngcontent-%COMP%] {\n  min-height: 100px;\n  resize: vertical;\n  line-height: 1.6;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: flex-end;\n  gap: 16px;\n  margin-top: 24px;\n  padding-top: 20px;\n  border-top: 1px solid rgba(75, 75, 75, 0.08);\n  border-top: 1px solid color-mix(in srgb, var(--content-DEFAULT) 8%, transparent);\n  width: 100%;\n  box-sizing: border-box;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%], .survey-wrapper[_ngcontent-%COMP%]   .btn-submit[_ngcontent-%COMP%] {\n  padding: 14px 28px;\n  border-radius: 12px;\n  font-weight: 600;\n  font-size: 15px;\n  border: none;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  min-width: 140px;\n  position: relative;\n  overflow: hidden;\n  box-sizing: border-box;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%] {\n  background: var(--surface-muted);\n  color: var(--content-60);\n  border: 1.5px solid var(--content-30);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: var(--shade-80);\n  color: var(--content-100);\n  border-color: var(--content-50);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 20px rgba(110, 119, 135, 0.15);\n  box-shadow: 0 8px 20px color-mix(in srgb, var(--content-60) 15%, transparent);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-submit[_ngcontent-%COMP%] {\n  background: linear-gradient(135deg, var(--primary-DEFAULT) 0%, var(--tertiary-DEFAULT) 100%);\n  color: var(--surface-DEFAULT);\n  box-shadow: 0 4px 12px rgba(131, 83, 226, 0.3);\n  box-shadow: 0 4px 12px color-mix(in srgb, var(--tertiary-DEFAULT) 30%, transparent);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-submit[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: linear-gradient(135deg, var(--primary-DEFAULT) 0%, var(--tertiary-100) 100%);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 24px rgba(131, 83, 226, 0.4);\n  box-shadow: 0 8px 24px color-mix(in srgb, var(--tertiary-DEFAULT) 40%, transparent);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%]:active:not(:disabled), .survey-wrapper[_ngcontent-%COMP%]   .btn-submit[_ngcontent-%COMP%]:active:not(:disabled) {\n  transform: translateY(0);\n}\n.survey-wrapper[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%]:disabled, .survey-wrapper[_ngcontent-%COMP%]   .btn-submit[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n  transform: none !important;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  color: var(--error-DEFAULT);\n  background: var(--error-50);\n  padding: 16px 20px;\n  border-radius: 12px;\n  margin-top: 20px;\n  font-size: 14px;\n  font-weight: 500;\n  border: 1px solid var(--error-100);\n  width: 100%;\n  box-sizing: border-box;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 20px;\n  width: 20px;\n  height: 20px;\n  flex-shrink: 0;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-container[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 8px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-container[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: var(--shade-80);\n  border-radius: 4px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: linear-gradient(135deg, var(--content-30) 0%, var(--content-50) 100%);\n  border-radius: 4px;\n}\n.survey-wrapper[_ngcontent-%COMP%]   .survey-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: linear-gradient(135deg, var(--content-50) 0%, var(--content-60) 100%);\n}\n@media (max-width: 768px) {\n  .survey-wrapper[_ngcontent-%COMP%]   .survey-container[_ngcontent-%COMP%] {\n    max-height: 90vh;\n    border-radius: 12px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .survey-hero[_ngcontent-%COMP%] {\n    padding: 24px 20px 20px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .survey-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 16px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .hero-illustration[_ngcontent-%COMP%] {\n    margin-left: 0;\n    align-self: center;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .illustration-container[_ngcontent-%COMP%] {\n    width: 120px;\n    height: 120px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .teacher-avatar[_ngcontent-%COMP%] {\n    width: 80px;\n    height: 80px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .teacher-icon[_ngcontent-%COMP%] {\n    font-size: 32px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .floating-item[_ngcontent-%COMP%] {\n    width: 32px;\n    height: 32px;\n    font-size: 14px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .survey-form[_ngcontent-%COMP%] {\n    padding: 24px 20px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%] {\n    padding: 20px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .checkbox-group[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .form-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 12px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .btn-cancel[_ngcontent-%COMP%], .survey-wrapper[_ngcontent-%COMP%]   .btn-submit[_ngcontent-%COMP%] {\n    width: 100%;\n    min-width: auto;\n  }\n}\n@media (max-width: 480px) {\n  .survey-wrapper[_ngcontent-%COMP%]   .survey-container[_ngcontent-%COMP%] {\n    max-height: 95vh;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .survey-hero[_ngcontent-%COMP%] {\n    padding: 20px 16px 16px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .survey-form[_ngcontent-%COMP%] {\n    padding: 20px 16px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .form-group[_ngcontent-%COMP%] {\n    padding: 16px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .question-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 8px;\n  }\n  .survey-wrapper[_ngcontent-%COMP%]   .question-number[_ngcontent-%COMP%] {\n    align-self: flex-start;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImJhc2VsaW5lLXN1cnZleS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSwyREFBQTtBQUVBO0VBU0EsbUJBQUE7RUFlQSxtQkFBQTtFQTZGQSxzQkFBQTtFQStFQSxnQkFBQTtFQVVBLHFCQUFBO0VBdUVBLG1CQUFBO0VBeUZBLG1CQUFBO0VBcUNBLHFCQUFBO0VBV0EsWUFBQTtFQWtFQSxrQkFBQTtFQXdCQSxxQkFBQTtFQW1CQSwyQkFBQTtBQWhnQkE7QUFWQTtFQUNFLFVBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0Esb0RBQUE7RUFDQSx5RkFBQTtBQVlGO0FBUkE7RUFDRSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsVUFBQTtFQUNBLGtGQUFBO0VBQ0EsdUZBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0FBVUY7QUFOQTtFQUNFLDJGQUFBO0VBQ0EsdUJBQUE7RUFDQSw2QkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFRRjtBQUxBO0VBQ0UsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLDhYQUFBO0FBT0Y7QUFKQTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7RUFDQSxVQUFBO0FBTUY7QUFIQTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxPQUFBO0FBS0Y7QUFGQTtFQUNFLGFBQUE7RUFDQSxlQUFBO0VBQ0EsUUFBQTtBQUlGO0FBREE7RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLG9DQUFBO0VBQ0EsdUVBQUE7RUFDQSwrQkFBQTtFQUNBLGtFQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLDJCQUFBO0FBR0Y7QUFBQTtFQUNFLG9DQUFBO0VBQ0EsdUVBQUE7RUFDQSw2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QUE7RUF4REY7RUEyREE7SUFDRSxzQkFBQTtJQUNBLFNBQUE7RUF6REY7RUE0REE7SUFDRSxjQUFBO0lBQ0Esa0JBQUE7RUExREY7RUE2REE7SUFDRSxZQUFBO0lBQ0EsYUFBQTtFQTNERjtFQThEQTtJQUNFLFdBQUE7SUFDQSxZQUFBO0VBNURGO0VBK0RBO0lBQ0UsZUFBQTtFQTdERjtFQWdFQTtJQUNFLFdBQUE7SUFDQSxZQUFBO0lBQ0EsZUFBQTtFQTlERjtFQWlFQTtJQUNFLGtCQUFBO0VBL0RGO0VBa0VBO0lBQ0UsYUFBQTtFQWhFRjtFQW1FQTtJQUNFLDBCQUFBO0VBakVGO0VBb0VBO0lBQ0Usc0JBQUE7SUFDQSxTQUFBO0VBbEVGO0VBcUVBO0lBQ0UsV0FBQTtJQUNBLGVBQUE7RUFuRUY7QUFDRjtBQXNFQTtFQUNFO0lBQ0UsZ0JBQUE7RUFwRUY7RUF1RUE7SUFDRSx1QkFBQTtFQXJFRjtFQXdFQTtJQUNFLGtCQUFBO0VBdEVGO0VBeUVBO0lBQ0UsYUFBQTtFQXZFRjtFQTBFQTtJQUNFLHNCQUFBO0lBQ0EsUUFBQTtFQXhFRjtFQTJFQTtJQUNFLHNCQUFBO0VBekVGO0FBQ0YiLCJmaWxlIjoiYmFzZWxpbmUtc3VydmV5LmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbmV3XG4vKiBNYWtlIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGRpYWxvZyBodWcgdGhlIHN1cnZleSBuaWNlbHkgKi9cblxuLnN1cnZleS13cmFwcGVye1xuOmhvc3QgOjpuZy1kZWVwIC5tYXQtZGlhbG9nLWNvbnRhaW5lciB7XG4gIHBhZGRpbmc6IDA7XG4gIG1heC13aWR0aDogMTAwdnc7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJveC1zaGFkb3c6IDAgMjVweCA1MHB4IC0xMnB4IHJnYmEoNzUsIDc1LCA3NSwgMC4yNSk7XG4gIGJveC1zaGFkb3c6IDAgMjVweCA1MHB4IC0xMnB4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1jb250ZW50LURFRkFVTFQpIDI1JSwgdHJhbnNwYXJlbnQpO1xufVxuXG4vKiBNQUlOIENPTlRBSU5FUiAqL1xuLnN1cnZleS1jb250YWluZXIge1xuICB3aWR0aDogMTAwJTtcbiAgbWF4LXdpZHRoOiA5MDBweDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHBhZGRpbmc6IDA7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHZhcigtLXN1cmZhY2UtbXV0ZWQpIDAlLCB2YXIoLS1zaGFkZS04MCkgMTAwJSk7XG4gIGZvbnQtZmFtaWx5OiAnSW50ZXInLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgc2Fucy1zZXJpZjtcbiAgbWF4LWhlaWdodDogODV2aDtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi8qIEhFQURFUiBTRUNUSU9OICovXG4uc3VydmV5LWhlcm8ge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDAlLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDEwMCUpO1xuICBwYWRkaW5nOiAzMnB4IDQwcHggMjRweDtcbiAgY29sb3I6IHZhcigtLXN1cmZhY2UtREVGQVVMVCk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLnN1cnZleS1oZXJvOjpiZWZvcmUge1xuICBjb250ZW50OiAnJztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIGJhY2tncm91bmQ6IHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgd2lkdGg9JzYwJyBoZWlnaHQ9JzYwJyB2aWV3Qm94PScwIDAgNjAgNjAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCclM0UlM0NnIGZpbGw9JyUyM2ZmZmZmZicgZmlsbC1vcGFjaXR5PScwLjA1JyUzRSUzQ3BhdGggZD0nTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Jy8lM0UlM0MvZyUzRSUzQy9nJTNFJTNDL3N2ZyUzRVwiKTtcbn1cblxuLnN1cnZleS1oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IDE7XG59XG5cbi5zdXJ2ZXktdGl0bGUtYmxvY2sge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDEycHg7XG4gIGZsZXg6IDE7XG59XG5cbi5zdXJ2ZXktcGlsbC1yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogOHB4O1xufVxuXG4uc3VydmV5LXBpbGwge1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHBhZGRpbmc6IDZweCAxMnB4O1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7XG4gIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zdXJmYWNlLURFRkFVTFQpIDIwJSwgdHJhbnNwYXJlbnQpO1xuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xuICBjb2xvcjogY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXN1cmZhY2UtREVGQVVMVCkgOTAlLCB0cmFuc3BhcmVudCk7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGxldHRlci1zcGFjaW5nOiAwLjA0ZW07XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcbn1cblxuLnN1cnZleS1waWxsLnByaW1hcnkge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMyk7XG4gIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zdXJmYWNlLURFRkFVTFQpIDMwJSwgdHJhbnNwYXJlbnQpO1xuICBjb2xvcjogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbn1cblxuLnN1cnZleS1pbmZvLWJhbm5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBnYXA6IDEycHg7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNSk7XG4gIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zdXJmYWNlLURFRkFVTFQpIDE1JSwgdHJhbnNwYXJlbnQpO1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICBwYWRkaW5nOiAxNHB4IDE2cHg7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpO1xuICBib3JkZXI6IDFweCBzb2xpZCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tc3VyZmFjZS1ERUZBVUxUKSAyMCUsIHRyYW5zcGFyZW50KTtcbiAgbWF4LXdpZHRoOiA1MDBweDtcbiAgbWFyZ2luLXRvcDogOHB4O1xufVxuXG4uc3VydmV5LWluZm8tYmFubmVyIC5pbmZvLWljb24ge1xuICB3aWR0aDogMjhweDtcbiAgaGVpZ2h0OiAyOHB4O1xuICBib3JkZXItcmFkaXVzOiA5OTlweDtcbiAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXgtc2hyaW5rOiAwO1xuICBjb2xvcjogdmFyKC0tdGVydGlhcnktREVGQVVMVCk7XG4gIGZvbnQtc2l6ZTogMTRweDtcbn1cblxuLnN1cnZleS1pbmZvLWJhbm5lciAuaW5mby10ZXh0IHtcbiAgY29sb3I6IHZhcigtLXN1cmZhY2UtREVGQVVMVCk7XG4gIGZvbnQtc2l6ZTogMC45cmVtO1xufVxuXG4vKiBIRVJPIElMTFVTVFJBVElPTiAqL1xuLmhlcm8taWxsdXN0cmF0aW9uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbi1sZWZ0OiAyMHB4O1xufVxuXG4uaWxsdXN0cmF0aW9uLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IDE0MHB4O1xuICBoZWlnaHQ6IDE0MHB4O1xufVxuXG4udGVhY2hlci1hdmF0YXIge1xuICB3aWR0aDogMTAwcHg7XG4gIGhlaWdodDogMTAwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAyMHB4O1xuICBsZWZ0OiAyMHB4O1xuICBib3gtc2hhZG93OiAwIDEwcHggMjVweCByZ2JhKDc1LCA3NSwgNzUsIDAuMTUpO1xuICBib3gtc2hhZG93OiAwIDEwcHggMjVweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSAxNSUsIHRyYW5zcGFyZW50KTtcbiAgei1pbmRleDogMjtcbn1cblxuLnRlYWNoZXItaWNvbiB7XG4gIGZvbnQtc2l6ZTogNDBweDtcbn1cblxuLmZsb2F0aW5nLWVsZW1lbnRzIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4uZmxvYXRpbmctaXRlbSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDQwcHg7XG4gIGhlaWdodDogNDBweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYm94LXNoYWRvdzogMCA1cHggMTVweCByZ2JhKDc1LCA3NSwgNzUsIDAuMSk7XG4gIGJveC1zaGFkb3c6IDAgNXB4IDE1cHggY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgMTAlLCB0cmFuc3BhcmVudCk7XG4gIGFuaW1hdGlvbjogZmxvYXQgNnMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5cbi5pdGVtLTEge1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGFuaW1hdGlvbi1kZWxheTogMHM7XG59XG5cbi5pdGVtLTIge1xuICB0b3A6IDEwcHg7XG4gIHJpZ2h0OiAwO1xuICBhbmltYXRpb24tZGVsYXk6IDJzO1xufVxuXG4uaXRlbS0zIHtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiA0cztcbn1cblxuQGtleWZyYW1lcyBmbG9hdCB7XG4gIDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCk7IH1cbiAgNTAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMHB4KTsgfVxuICAxMDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCk7IH1cbn1cblxuLyogRk9STSBMQVlPVVQgKi9cbi5zdXJ2ZXktZm9ybSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogMjRweDtcbiAgcGFkZGluZzogMzJweCA0MHB4O1xuICB3aWR0aDogMTAwJTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLyogUVVFU1RJT04gU1RZTElORyAqL1xuLmZvcm0tZ3JvdXAge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDE2cHg7XG4gIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtREVGQVVMVCk7XG4gIHBhZGRpbmc6IDI0cHg7XG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSg3NSwgNzUsIDc1LCAwLjA1KTtcbiAgYm94LXNoYWRvdzogMCA0cHggMTJweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSA1JSwgdHJhbnNwYXJlbnQpO1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDc1LCA3NSwgNzUsIDAuMDQpO1xuICBib3JkZXI6IDFweCBzb2xpZCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSA0JSwgdHJhbnNwYXJlbnQpO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDAlO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4uZm9ybS1ncm91cDpob3ZlciB7XG4gIGJveC1zaGFkb3c6IDAgOHB4IDI1cHggcmdiYSg3NSwgNzUsIDc1LCAwLjA4KTtcbiAgYm94LXNoYWRvdzogMCA4cHggMjVweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSA4JSwgdHJhbnNwYXJlbnQpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG59XG5cbi5xdWVzdGlvbi1oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZ2FwOiAxMnB4O1xufVxuXG4ucXVlc3Rpb24tbnVtYmVyIHtcbiAgd2lkdGg6IDMycHg7XG4gIGhlaWdodDogMzJweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDAlLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDEwMCUpO1xuICBjb2xvcjogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGZvbnQtc2l6ZTogMC45cmVtO1xuICBmbGV4LXNocmluazogMDtcbn1cblxuLmZvcm0tZ3JvdXAgbGFiZWwge1xuICBmb250LXdlaWdodDogNjAwO1xuICBjb2xvcjogdmFyKC0tY29udGVudC1ERUZBVUxUKTtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBsaW5lLWhlaWdodDogMS41O1xuICBtYXJnaW46IDA7XG4gIGZsZXg6IDE7XG59XG5cbi5sYWJlbC1waWxsIHtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBmb250LXdlaWdodDogNTAwO1xuICBjb2xvcjogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS01MCk7XG4gIHBhZGRpbmc6IDRweCAxMHB4O1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICBtYXJnaW4tbGVmdDogOHB4O1xufVxuXG4ucmVxdWlyZWQtc3RhciB7XG4gIGNvbG9yOiB2YXIoLS1lcnJvci1ERUZBVUxUKTtcbiAgZm9udC1zaXplOiAwLjlyZW07XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIG1hcmdpbi1sZWZ0OiA0cHg7XG59XG5cbi8qIENIRUNLQk9YIEdST1VQICovXG4uY2hlY2tib3gtZ3JvdXAge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDIyMHB4LCAxZnIpKTtcbiAgZ2FwOiAxMnB4O1xuICBtYXJnaW4tdG9wOiA4cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4uY2hlY2tib3gtY2FyZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAxNHB4IDE2cHg7XG4gIG1hcmdpbjogMDtcbiAgZm9udC1zaXplOiAwLjk1cmVtO1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtbXV0ZWQpO1xuICBib3JkZXI6IDEuNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICB3aWR0aDogMTAwJTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLmNoZWNrYm94LWNhcmQ6aG92ZXIge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1zaGFkZS04MCk7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tY29udGVudC0zMCk7XG59XG5cbi5jaGVja2JveC1jYXJkIGlucHV0W3R5cGU9J2NoZWNrYm94J10ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIG9wYWNpdHk6IDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgaGVpZ2h0OiAwO1xuICB3aWR0aDogMDtcbn1cblxuLmNoZWNrbWFyayB7XG4gIGhlaWdodDogMjBweDtcbiAgd2lkdGg6IDIwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoYWRlLTgwKTtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb250ZW50LTMwKTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICBmbGV4LXNocmluazogMDtcbn1cblxuLmNoZWNrYm94LWNhcmQ6aG92ZXIgLmNoZWNrbWFyayB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tY29udGVudC01MCk7XG59XG5cbi5jaGVja2JveC1jYXJkIGlucHV0OmNoZWNrZWQgfiAuY2hlY2ttYXJrIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xufVxuXG4uY2hlY2ttYXJrOmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBkaXNwbGF5OiBub25lO1xuICBsZWZ0OiA2cHg7XG4gIHRvcDogMnB4O1xuICB3aWR0aDogNXB4O1xuICBoZWlnaHQ6IDEwcHg7XG4gIGJvcmRlcjogc29saWQgdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgYm9yZGVyLXdpZHRoOiAwIDJweCAycHggMDtcbiAgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xufVxuXG4uY2hlY2tib3gtY2FyZCBpbnB1dDpjaGVja2VkIH4gLmNoZWNrbWFyazphZnRlciB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4uY2hlY2tib3gtY2FyZDpoYXMoaW5wdXQ6Y2hlY2tlZCkge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LTUwKTtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xuICBjb2xvcjogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbn1cblxuLmNoZWNrYm94LXRleHQge1xuICBmbGV4OiAxO1xufVxuXG4vKiBTRUxFQ1QgU1RZTElORyAqL1xuLnNlbGVjdC13cmFwcGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmZvcm0tY29udHJvbCB7XG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nOiA1cHggMTZweDtcbiAgYm9yZGVyOiAxLjVweCBzb2xpZCB2YXIoLS1jb250ZW50LTMwKTtcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBmb250LWZhbWlseTogaW5oZXJpdDtcbiAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1tdXRlZCk7XG4gIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbi5mb3JtLWNvbnRyb2w6Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xuICBib3JkZXItY29sb3I6IHZhcigtLXByaW1hcnktREVGQVVMVCk7XG4gIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtREVGQVVMVCk7XG4gIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDcwLCAxNjAsIDI0MSwgMC4xKTtcbiAgYm94LXNoYWRvdzogMCAwIDAgM3B4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDEwJSwgdHJhbnNwYXJlbnQpO1xufVxuXG4uc2VsZWN0LWFycm93IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMTZweDtcbiAgdG9wOiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGNvbG9yOiB2YXIoLS1jb250ZW50LTYwKTtcbiAgZm9udC1zaXplOiAxMnB4O1xufVxuXG4vKiBURVhUQVJFQSBTVFlMSU5HICovXG4udGV4dGFyZWEtd3JhcHBlciB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG50ZXh0YXJlYS5mb3JtLWNvbnRyb2wge1xuICBtaW4taGVpZ2h0OiAxMDBweDtcbiAgcmVzaXplOiB2ZXJ0aWNhbDtcbiAgbGluZS1oZWlnaHQ6IDEuNjtcbn1cblxuLyogQUNUSU9OUyAqL1xuLmZvcm0tYWN0aW9ucyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIGdhcDogMTZweDtcbiAgbWFyZ2luLXRvcDogMjRweDtcbiAgcGFkZGluZy10b3A6IDIwcHg7XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCByZ2JhKDc1LCA3NSwgNzUsIDAuMDgpO1xuICBib3JkZXItdG9wOiAxcHggc29saWQgY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgOCUsIHRyYW5zcGFyZW50KTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi5idG4tY2FuY2VsLCAuYnRuLXN1Ym1pdCB7XG4gIHBhZGRpbmc6IDE0cHggMjhweDtcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBib3JkZXI6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjogYWxsIDAuM3MgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKTtcbiAgbWluLXdpZHRoOiAxNDBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4uYnRuLWNhbmNlbCB7XG4gIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtbXV0ZWQpO1xuICBjb2xvcjogdmFyKC0tY29udGVudC02MCk7XG4gIGJvcmRlcjogMS41cHggc29saWQgdmFyKC0tY29udGVudC0zMCk7XG59XG5cbi5idG4tY2FuY2VsOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tc2hhZGUtODApO1xuICBjb2xvcjogdmFyKC0tY29udGVudC0xMDApO1xuICBib3JkZXItY29sb3I6IHZhcigtLWNvbnRlbnQtNTApO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggcmdiYSgxMTAsIDExOSwgMTM1LCAwLjE1KTtcbiAgYm94LXNoYWRvdzogMCA4cHggMjBweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC02MCkgMTUlLCB0cmFuc3BhcmVudCk7XG59XG5cbi5idG4tc3VibWl0IHtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyKC0tcHJpbWFyeS1ERUZBVUxUKSAwJSwgdmFyKC0tdGVydGlhcnktREVGQVVMVCkgMTAwJSk7XG4gIGNvbG9yOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpO1xuICBib3gtc2hhZG93OiAwIDRweCAxMnB4IHJnYmEoMTMxLCA4MywgMjI2LCAwLjMpO1xuICBib3gtc2hhZG93OiAwIDRweCAxMnB4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS10ZXJ0aWFyeS1ERUZBVUxUKSAzMCUsIHRyYW5zcGFyZW50KTtcbn1cblxuLmJ0bi1zdWJtaXQ6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDAlLCB2YXIoLS10ZXJ0aWFyeS0xMDApIDEwMCUpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gIGJveC1zaGFkb3c6IDAgOHB4IDI0cHggcmdiYSgxMzEsIDgzLCAyMjYsIDAuNCk7XG4gIGJveC1zaGFkb3c6IDAgOHB4IDI0cHggY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXRlcnRpYXJ5LURFRkFVTFQpIDQwJSwgdHJhbnNwYXJlbnQpO1xufVxuXG4uYnRuLWNhbmNlbDphY3RpdmU6bm90KDpkaXNhYmxlZCksIC5idG4tc3VibWl0OmFjdGl2ZTpub3QoOmRpc2FibGVkKSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbn1cblxuLmJ0bi1jYW5jZWw6ZGlzYWJsZWQsIC5idG4tc3VibWl0OmRpc2FibGVkIHtcbiAgb3BhY2l0eTogMC42O1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICB0cmFuc2Zvcm06IG5vbmUgIWltcG9ydGFudDtcbn1cblxuLyogRVJST1IgTUVTU0FHRSAqL1xuLmVycm9yLW1lc3NhZ2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEycHg7XG4gIGNvbG9yOiB2YXIoLS1lcnJvci1ERUZBVUxUKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tZXJyb3ItNTApO1xuICBwYWRkaW5nOiAxNnB4IDIwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gIG1hcmdpbi10b3A6IDIwcHg7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tZXJyb3ItMTAwKTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi5lcnJvci1tZXNzYWdlIG1hdC1pY29uIHtcbiAgZm9udC1zaXplOiAyMHB4O1xuICB3aWR0aDogMjBweDtcbiAgaGVpZ2h0OiAyMHB4O1xuICBmbGV4LXNocmluazogMDtcbn1cblxuLyogQ1VTVE9NIFNDUk9MTEJBUiAqL1xuLnN1cnZleS1jb250YWluZXI6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgd2lkdGg6IDhweDtcbn1cblxuLnN1cnZleS1jb250YWluZXI6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tc2hhZGUtODApO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5zdXJ2ZXktY29udGFpbmVyOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHZhcigtLWNvbnRlbnQtMzApIDAlLCB2YXIoLS1jb250ZW50LTUwKSAxMDAlKTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xufVxuXG4uc3VydmV5LWNvbnRhaW5lcjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1jb250ZW50LTUwKSAwJSwgdmFyKC0tY29udGVudC02MCkgMTAwJSk7XG59XG5cbi8qIFJFU1BPTlNJVkUgQlJFQUtQT0lOVFMgKi9cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuc3VydmV5LWNvbnRhaW5lciB7XG4gICAgbWF4LWhlaWdodDogOTB2aDtcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICB9XG4gIFxuICAuc3VydmV5LWhlcm8ge1xuICAgIHBhZGRpbmc6IDI0cHggMjBweCAyMHB4O1xuICB9XG4gIFxuICAuc3VydmV5LWhlYWRlciB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDE2cHg7XG4gIH1cbiAgXG4gIC5oZXJvLWlsbHVzdHJhdGlvbiB7XG4gICAgbWFyZ2luLWxlZnQ6IDA7XG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xuICB9XG4gIFxuICAuaWxsdXN0cmF0aW9uLWNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDEyMHB4O1xuICAgIGhlaWdodDogMTIwcHg7XG4gIH1cbiAgXG4gIC50ZWFjaGVyLWF2YXRhciB7XG4gICAgd2lkdGg6IDgwcHg7XG4gICAgaGVpZ2h0OiA4MHB4O1xuICB9XG4gIFxuICAudGVhY2hlci1pY29uIHtcbiAgICBmb250LXNpemU6IDMycHg7XG4gIH1cbiAgXG4gIC5mbG9hdGluZy1pdGVtIHtcbiAgICB3aWR0aDogMzJweDtcbiAgICBoZWlnaHQ6IDMycHg7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICB9XG4gIFxuICAuc3VydmV5LWZvcm0ge1xuICAgIHBhZGRpbmc6IDI0cHggMjBweDtcbiAgfVxuICBcbiAgLmZvcm0tZ3JvdXAge1xuICAgIHBhZGRpbmc6IDIwcHg7XG4gIH1cbiAgXG4gIC5jaGVja2JveC1ncm91cCB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gIH1cbiAgXG4gIC5mb3JtLWFjdGlvbnMge1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiAxMnB4O1xuICB9XG4gIFxuICAuYnRuLWNhbmNlbCwgLmJ0bi1zdWJtaXQge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1pbi13aWR0aDogYXV0bztcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNDgwcHgpIHtcbiAgLnN1cnZleS1jb250YWluZXIge1xuICAgIG1heC1oZWlnaHQ6IDk1dmg7XG4gIH1cbiAgXG4gIC5zdXJ2ZXktaGVybyB7XG4gICAgcGFkZGluZzogMjBweCAxNnB4IDE2cHg7XG4gIH1cbiAgXG4gIC5zdXJ2ZXktZm9ybSB7XG4gICAgcGFkZGluZzogMjBweCAxNnB4O1xuICB9XG4gIFxuICAuZm9ybS1ncm91cCB7XG4gICAgcGFkZGluZzogMTZweDtcbiAgfVxuICBcbiAgLnF1ZXN0aW9uLWhlYWRlciB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDhweDtcbiAgfVxuICBcbiAgLnF1ZXN0aW9uLW51bWJlciB7XG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcbiAgfVxufVxuXG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvYmFzZWxpbmUtc3VydmV5L2Jhc2VsaW5lLXN1cnZleS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSwyREFBQTtBQUVBO0VBU0EsbUJBQUE7RUFlQSxtQkFBQTtFQTZGQSxzQkFBQTtFQStFQSxnQkFBQTtFQVVBLHFCQUFBO0VBdUVBLG1CQUFBO0VBeUZBLG1CQUFBO0VBcUNBLHFCQUFBO0VBV0EsWUFBQTtFQWtFQSxrQkFBQTtFQXdCQSxxQkFBQTtFQW1CQSwyQkFBQTtBQWhnQkE7QUFWQTtFQUNFLFVBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0Esb0RBQUE7RUFDQSx5RkFBQTtBQVlGO0FBUkE7RUFDRSxXQUFBO0VBQ0EsZ0JBQUE7RUFDQSxjQUFBO0VBQ0EsVUFBQTtFQUNBLGtGQUFBO0VBQ0EsdUZBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxzQkFBQTtFQUNBLGtCQUFBO0FBVUY7QUFOQTtFQUNFLDJGQUFBO0VBQ0EsdUJBQUE7RUFDQSw2QkFBQTtFQUNBLGtCQUFBO0VBQ0EsZ0JBQUE7QUFRRjtBQUxBO0VBQ0UsV0FBQTtFQUNBLGtCQUFBO0VBQ0EsTUFBQTtFQUNBLE9BQUE7RUFDQSxRQUFBO0VBQ0EsU0FBQTtFQUNBLDhYQUFBO0FBT0Y7QUFKQTtFQUNFLGFBQUE7RUFDQSw4QkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7RUFDQSxVQUFBO0FBTUY7QUFIQTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxPQUFBO0FBS0Y7QUFGQTtFQUNFLGFBQUE7RUFDQSxlQUFBO0VBQ0EsUUFBQTtBQUlGO0FBREE7RUFDRSxrQkFBQTtFQUNBLGdCQUFBO0VBQ0EsaUJBQUE7RUFDQSxtQkFBQTtFQUNBLG9DQUFBO0VBQ0EsdUVBQUE7RUFDQSwrQkFBQTtFQUNBLGtFQUFBO0VBQ0EseUJBQUE7RUFDQSxzQkFBQTtFQUNBLDJCQUFBO0FBR0Y7QUFBQTtFQUNFLG9DQUFBO0VBQ0EsdUVBQUE7RUFDQSw2QkFBQTtBQUVGO0FBQ0E7RUFDRSxhQUFBO0VBQ0EsdUJBQUE7RUFDQSxTQUFBO0VBQ0EscUNBQUE7RUFDQSx1RUFBQTtFQUNBLG1CQUFBO0VBQ0Esa0JBQUE7RUFDQSwyQkFBQTtFQUNBLDBDQUFBO0VBQ0EsNkVBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7QUFDRjtBQUVBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxvQkFBQTtFQUNBLGtDQUFBO0VBQ0EsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxjQUFBO0VBQ0EsOEJBQUE7RUFDQSxlQUFBO0FBQUY7QUFHQTtFQUNFLDZCQUFBO0VBQ0EsaUJBQUE7QUFERjtBQUtBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxpQkFBQTtBQUhGO0FBTUE7RUFDRSxrQkFBQTtFQUNBLFlBQUE7RUFDQSxhQUFBO0FBSkY7QUFPQTtFQUNFLFlBQUE7RUFDQSxhQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQ0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0Esa0JBQUE7RUFDQSxTQUFBO0VBQ0EsVUFBQTtFQUNBLDhDQUFBO0VBQ0EsbUZBQUE7RUFDQSxVQUFBO0FBTEY7QUFRQTtFQUNFLGVBQUE7QUFORjtBQVNBO0VBQ0Usa0JBQUE7RUFDQSxXQUFBO0VBQ0EsWUFBQTtBQVBGO0FBVUE7RUFDRSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0Esa0JBQUE7RUFDQSxrQ0FBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsNENBQUE7RUFDQSxrRkFBQTtFQUNBLHdDQUFBO0FBUkY7QUFXQTtFQUNFLE1BQUE7RUFDQSxPQUFBO0VBQ0EsbUJBQUE7QUFURjtBQVlBO0VBQ0UsU0FBQTtFQUNBLFFBQUE7RUFDQSxtQkFBQTtBQVZGO0FBYUE7RUFDRSxTQUFBO0VBQ0EsU0FBQTtFQUNBLDJCQUFBO0VBQ0EsbUJBQUE7QUFYRjtBQWNBO0VBQ0U7SUFBSywwQkFBQTtFQVhMO0VBWUE7SUFBTSw0QkFBQTtFQVROO0VBVUE7SUFBTywwQkFBQTtFQVBQO0FBQ0Y7QUFVQTtFQUNFLGFBQUE7RUFDQSxzQkFBQTtFQUNBLFNBQUE7RUFDQSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxzQkFBQTtBQVJGO0FBWUE7RUFDRSxhQUFBO0VBQ0Esc0JBQUE7RUFDQSxTQUFBO0VBQ0Esa0NBQUE7RUFDQSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSw2Q0FBQTtFQUNBLGlGQUFBO0VBQ0Esd0NBQUE7RUFDQSw0RUFBQTtFQUNBLHlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLFdBQUE7RUFDQSxzQkFBQTtBQVZGO0FBYUE7RUFDRSw2Q0FBQTtFQUNBLGlGQUFBO0VBQ0EsMkJBQUE7QUFYRjtBQWNBO0VBQ0UsYUFBQTtFQUNBLHVCQUFBO0VBQ0EsU0FBQTtBQVpGO0FBZUE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsMkZBQUE7RUFDQSw2QkFBQTtFQUNBLGFBQUE7RUFDQSxtQkFBQTtFQUNBLHVCQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLGNBQUE7QUFiRjtBQWdCQTtFQUNFLGdCQUFBO0VBQ0EsNkJBQUE7RUFDQSxlQUFBO0VBQ0EsZ0JBQUE7RUFDQSxTQUFBO0VBQ0EsT0FBQTtBQWRGO0FBaUJBO0VBQ0Usa0JBQUE7RUFDQSxnQkFBQTtFQUNBLDZCQUFBO0VBQ0EsNkJBQUE7RUFDQSxpQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7QUFmRjtBQWtCQTtFQUNFLDJCQUFBO0VBQ0EsaUJBQUE7RUFDQSxnQkFBQTtFQUNBLGdCQUFBO0FBaEJGO0FBb0JBO0VBQ0UsYUFBQTtFQUNBLDJEQUFBO0VBQ0EsU0FBQTtFQUNBLGVBQUE7RUFDQSxXQUFBO0VBQ0Esc0JBQUE7QUFsQkY7QUFxQkE7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0Esa0JBQUE7RUFDQSxTQUFBO0VBQ0Esa0JBQUE7RUFDQSxtQkFBQTtFQUNBLHlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQ0FBQTtFQUNBLCtCQUFBO0VBQ0EsV0FBQTtFQUNBLHNCQUFBO0FBbkJGO0FBc0JBO0VBQ0UsMkJBQUE7RUFDQSwrQkFBQTtBQXBCRjtBQXVCQTtFQUNFLGtCQUFBO0VBQ0EsVUFBQTtFQUNBLGVBQUE7RUFDQSxTQUFBO0VBQ0EsUUFBQTtBQXJCRjtBQXdCQTtFQUNFLFlBQUE7RUFDQSxXQUFBO0VBQ0EsaUNBQUE7RUFDQSxrQkFBQTtFQUNBLG1DQUFBO0VBQ0Esa0JBQUE7RUFDQSx5QkFBQTtFQUNBLGNBQUE7QUF0QkY7QUF5QkE7RUFDRSwrQkFBQTtBQXZCRjtBQTBCQTtFQUNFLHdDQUFBO0VBQ0Esb0NBQUE7QUF4QkY7QUEyQkE7RUFDRSxXQUFBO0VBQ0Esa0JBQUE7RUFDQSxhQUFBO0VBQ0EsU0FBQTtFQUNBLFFBQUE7RUFDQSxVQUFBO0VBQ0EsWUFBQTtFQUNBLG9DQUFBO0VBQ0EseUJBQUE7RUFDQSx3QkFBQTtBQXpCRjtBQTRCQTtFQUNFLGNBQUE7QUExQkY7QUE2QkE7RUFDRSw2QkFBQTtFQUNBLG9DQUFBO0VBQ0EsNkJBQUE7RUFDQSxnQkFBQTtBQTNCRjtBQThCQTtFQUNFLE9BQUE7QUE1QkY7QUFnQ0E7RUFDRSxrQkFBQTtFQUNBLFdBQUE7QUE5QkY7QUFpQ0E7RUFDRSxXQUFBO0VBQ0EsaUJBQUE7RUFDQSxxQ0FBQTtFQUNBLG1CQUFBO0VBQ0EsZUFBQTtFQUNBLG9CQUFBO0VBQ0EsZ0NBQUE7RUFDQSx5QkFBQTtFQUNBLHNCQUFBO0VBQ0EsZ0JBQUE7QUEvQkY7QUFrQ0E7RUFDRSxhQUFBO0VBQ0Esb0NBQUE7RUFDQSxrQ0FBQTtFQUNBLDZDQUFBO0VBQ0EsaUZBQUE7QUFoQ0Y7QUFtQ0E7RUFDRSxrQkFBQTtFQUNBLFdBQUE7RUFDQSxRQUFBO0VBQ0EsMkJBQUE7RUFDQSxvQkFBQTtFQUNBLHdCQUFBO0VBQ0EsZUFBQTtBQWpDRjtBQXFDQTtFQUNFLFdBQUE7QUFuQ0Y7QUFzQ0E7RUFDRSxpQkFBQTtFQUNBLGdCQUFBO0VBQ0EsZ0JBQUE7QUFwQ0Y7QUF3Q0E7RUFDRSxhQUFBO0VBQ0EseUJBQUE7RUFDQSxTQUFBO0VBQ0EsZ0JBQUE7RUFDQSxpQkFBQTtFQUNBLDRDQUFBO0VBQ0EsZ0ZBQUE7RUFDQSxXQUFBO0VBQ0Esc0JBQUE7QUF0Q0Y7QUF5Q0E7RUFDRSxrQkFBQTtFQUNBLG1CQUFBO0VBQ0EsZ0JBQUE7RUFDQSxlQUFBO0VBQ0EsWUFBQTtFQUNBLGVBQUE7RUFDQSxpREFBQTtFQUNBLGdCQUFBO0VBQ0Esa0JBQUE7RUFDQSxnQkFBQTtFQUNBLHNCQUFBO0FBdkNGO0FBMENBO0VBQ0UsZ0NBQUE7RUFDQSx3QkFBQTtFQUNBLHFDQUFBO0FBeENGO0FBMkNBO0VBQ0UsMkJBQUE7RUFDQSx5QkFBQTtFQUNBLCtCQUFBO0VBQ0EsMkJBQUE7RUFDQSxnREFBQTtFQUNBLDZFQUFBO0FBekNGO0FBNENBO0VBQ0UsNEZBQUE7RUFDQSw2QkFBQTtFQUNBLDhDQUFBO0VBQ0EsbUZBQUE7QUExQ0Y7QUE2Q0E7RUFDRSx3RkFBQTtFQUNBLDJCQUFBO0VBQ0EsOENBQUE7RUFDQSxtRkFBQTtBQTNDRjtBQThDQTtFQUNFLHdCQUFBO0FBNUNGO0FBK0NBO0VBQ0UsWUFBQTtFQUNBLG1CQUFBO0VBQ0EsMEJBQUE7QUE3Q0Y7QUFpREE7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSxTQUFBO0VBQ0EsMkJBQUE7RUFDQSwyQkFBQTtFQUNBLGtCQUFBO0VBQ0EsbUJBQUE7RUFDQSxnQkFBQTtFQUNBLGVBQUE7RUFDQSxnQkFBQTtFQUNBLGtDQUFBO0VBQ0EsV0FBQTtFQUNBLHNCQUFBO0FBL0NGO0FBa0RBO0VBQ0UsZUFBQTtFQUNBLFdBQUE7RUFDQSxZQUFBO0VBQ0EsY0FBQTtBQWhERjtBQW9EQTtFQUNFLFVBQUE7QUFsREY7QUFxREE7RUFDRSwyQkFBQTtFQUNBLGtCQUFBO0FBbkRGO0FBc0RBO0VBQ0UsaUZBQUE7RUFDQSxrQkFBQTtBQXBERjtBQXVEQTtFQUNFLGlGQUFBO0FBckRGO0FBeURBO0VBQ0U7SUFDRSxnQkFBQTtJQUNBLG1CQUFBO0VBdkRGO0VBMERBO0lBQ0UsdUJBQUE7RUF4REY7RUEyREE7SUFDRSxzQkFBQTtJQUNBLFNBQUE7RUF6REY7RUE0REE7SUFDRSxjQUFBO0lBQ0Esa0JBQUE7RUExREY7RUE2REE7SUFDRSxZQUFBO0lBQ0EsYUFBQTtFQTNERjtFQThEQTtJQUNFLFdBQUE7SUFDQSxZQUFBO0VBNURGO0VBK0RBO0lBQ0UsZUFBQTtFQTdERjtFQWdFQTtJQUNFLFdBQUE7SUFDQSxZQUFBO0lBQ0EsZUFBQTtFQTlERjtFQWlFQTtJQUNFLGtCQUFBO0VBL0RGO0VBa0VBO0lBQ0UsYUFBQTtFQWhFRjtFQW1FQTtJQUNFLDBCQUFBO0VBakVGO0VBb0VBO0lBQ0Usc0JBQUE7SUFDQSxTQUFBO0VBbEVGO0VBcUVBO0lBQ0UsV0FBQTtJQUNBLGVBQUE7RUFuRUY7QUFDRjtBQXNFQTtFQUNFO0lBQ0UsZ0JBQUE7RUFwRUY7RUF1RUE7SUFDRSx1QkFBQTtFQXJFRjtFQXdFQTtJQUNFLGtCQUFBO0VBdEVGO0VBeUVBO0lBQ0UsYUFBQTtFQXZFRjtFQTBFQTtJQUNFLHNCQUFBO0lBQ0EsUUFBQTtFQXhFRjtFQTJFQTtJQUNFLHNCQUFBO0VBekVGO0FBQ0Y7QUFDQSw0dHdCQUE0dHdCIiwic291cmNlc0NvbnRlbnQiOlsiLy8gbmV3XG4vKiBNYWtlIHRoZSBBbmd1bGFyIE1hdGVyaWFsIGRpYWxvZyBodWcgdGhlIHN1cnZleSBuaWNlbHkgKi9cblxuLnN1cnZleS13cmFwcGVye1xuOmhvc3QgOjpuZy1kZWVwIC5tYXQtZGlhbG9nLWNvbnRhaW5lciB7XG4gIHBhZGRpbmc6IDA7XG4gIG1heC13aWR0aDogMTAwdnc7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIGJveC1zaGFkb3c6IDAgMjVweCA1MHB4IC0xMnB4IHJnYmEoNzUsIDc1LCA3NSwgMC4yNSk7XG4gIGJveC1zaGFkb3c6IDAgMjVweCA1MHB4IC0xMnB4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1jb250ZW50LURFRkFVTFQpIDI1JSwgdHJhbnNwYXJlbnQpO1xufVxuXG4vKiBNQUlOIENPTlRBSU5FUiAqL1xuLnN1cnZleS1jb250YWluZXIge1xuICB3aWR0aDogMTAwJTtcbiAgbWF4LXdpZHRoOiA5MDBweDtcbiAgbWFyZ2luOiAwIGF1dG87XG4gIHBhZGRpbmc6IDA7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHZhcigtLXN1cmZhY2UtbXV0ZWQpIDAlLCB2YXIoLS1zaGFkZS04MCkgMTAwJSk7XG4gIGZvbnQtZmFtaWx5OiAnSW50ZXInLCAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICdTZWdvZSBVSScsIFJvYm90bywgc2Fucy1zZXJpZjtcbiAgbWF4LWhlaWdodDogODV2aDtcbiAgb3ZlcmZsb3cteTogYXV0bztcbiAgb3ZlcmZsb3cteDogaGlkZGVuO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG59XG5cbi8qIEhFQURFUiBTRUNUSU9OICovXG4uc3VydmV5LWhlcm8ge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDAlLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDEwMCUpO1xuICBwYWRkaW5nOiAzMnB4IDQwcHggMjRweDtcbiAgY29sb3I6IHZhcigtLXN1cmZhY2UtREVGQVVMVCk7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgb3ZlcmZsb3c6IGhpZGRlbjtcbn1cblxuLnN1cnZleS1oZXJvOjpiZWZvcmUge1xuICBjb250ZW50OiAnJztcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIHJpZ2h0OiAwO1xuICBib3R0b206IDA7XG4gIGJhY2tncm91bmQ6IHVybChcImRhdGE6aW1hZ2Uvc3ZnK3htbCwlM0Nzdmcgd2lkdGg9JzYwJyBoZWlnaHQ9JzYwJyB2aWV3Qm94PScwIDAgNjAgNjAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyclM0UlM0NnIGZpbGw9J25vbmUnIGZpbGwtcnVsZT0nZXZlbm9kZCclM0UlM0NnIGZpbGw9JyUyM2ZmZmZmZicgZmlsbC1vcGFjaXR5PScwLjA1JyUzRSUzQ3BhdGggZD0nTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgyVjZoNFY0aC00ek02IDM0di00SDR2NEgwdjJoNHY0aDJ2LTRoNHYtMkg2ek02IDRWMEg0djRIMHYyaDR2NGgyVjZoNFY0SDZ6Jy8lM0UlM0MvZyUzRSUzQy9nJTNFJTNDL3N2ZyUzRVwiKTtcbn1cblxuLnN1cnZleS1oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBqdXN0aWZ5LWNvbnRlbnQ6IHNwYWNlLWJldHdlZW47XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIHotaW5kZXg6IDE7XG59XG5cbi5zdXJ2ZXktdGl0bGUtYmxvY2sge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDEycHg7XG4gIGZsZXg6IDE7XG59XG5cbi5zdXJ2ZXktcGlsbC1yb3cge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LXdyYXA6IHdyYXA7XG4gIGdhcDogOHB4O1xufVxuXG4uc3VydmV5LXBpbGwge1xuICBmb250LXNpemU6IDAuNzVyZW07XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIHBhZGRpbmc6IDZweCAxMnB4O1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMik7XG4gIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zdXJmYWNlLURFRkFVTFQpIDIwJSwgdHJhbnNwYXJlbnQpO1xuICBjb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjkpO1xuICBjb2xvcjogY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXN1cmZhY2UtREVGQVVMVCkgOTAlLCB0cmFuc3BhcmVudCk7XG4gIHRleHQtdHJhbnNmb3JtOiB1cHBlcmNhc2U7XG4gIGxldHRlci1zcGFjaW5nOiAwLjA0ZW07XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcbn1cblxuLnN1cnZleS1waWxsLnByaW1hcnkge1xuICBiYWNrZ3JvdW5kOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMyk7XG4gIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zdXJmYWNlLURFRkFVTFQpIDMwJSwgdHJhbnNwYXJlbnQpO1xuICBjb2xvcjogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbn1cblxuLnN1cnZleS1pbmZvLWJhbm5lciB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBmbGV4LXN0YXJ0O1xuICBnYXA6IDEycHg7XG4gIGJhY2tncm91bmQ6IHJnYmEoMjU1LCAyNTUsIDI1NSwgMC4xNSk7XG4gIGJhY2tncm91bmQ6IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1zdXJmYWNlLURFRkFVTFQpIDE1JSwgdHJhbnNwYXJlbnQpO1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICBwYWRkaW5nOiAxNHB4IDE2cHg7XG4gIGJhY2tkcm9wLWZpbHRlcjogYmx1cigxMHB4KTtcbiAgYm9yZGVyOiAxcHggc29saWQgcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjIpO1xuICBib3JkZXI6IDFweCBzb2xpZCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tc3VyZmFjZS1ERUZBVUxUKSAyMCUsIHRyYW5zcGFyZW50KTtcbiAgbWF4LXdpZHRoOiA1MDBweDtcbiAgbWFyZ2luLXRvcDogOHB4O1xufVxuXG4uc3VydmV5LWluZm8tYmFubmVyIC5pbmZvLWljb24ge1xuICB3aWR0aDogMjhweDtcbiAgaGVpZ2h0OiAyOHB4O1xuICBib3JkZXItcmFkaXVzOiA5OTlweDtcbiAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZsZXgtc2hyaW5rOiAwO1xuICBjb2xvcjogdmFyKC0tdGVydGlhcnktREVGQVVMVCk7XG4gIGZvbnQtc2l6ZTogMTRweDtcbn1cblxuLnN1cnZleS1pbmZvLWJhbm5lciAuaW5mby10ZXh0IHtcbiAgY29sb3I6IHZhcigtLXN1cmZhY2UtREVGQVVMVCk7XG4gIGZvbnQtc2l6ZTogMC45cmVtO1xufVxuXG4vKiBIRVJPIElMTFVTVFJBVElPTiAqL1xuLmhlcm8taWxsdXN0cmF0aW9uIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIG1hcmdpbi1sZWZ0OiAyMHB4O1xufVxuXG4uaWxsdXN0cmF0aW9uLWNvbnRhaW5lciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgd2lkdGg6IDE0MHB4O1xuICBoZWlnaHQ6IDE0MHB4O1xufVxuXG4udGVhY2hlci1hdmF0YXIge1xuICB3aWR0aDogMTAwcHg7XG4gIGhlaWdodDogMTAwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgdG9wOiAyMHB4O1xuICBsZWZ0OiAyMHB4O1xuICBib3gtc2hhZG93OiAwIDEwcHggMjVweCByZ2JhKDc1LCA3NSwgNzUsIDAuMTUpO1xuICBib3gtc2hhZG93OiAwIDEwcHggMjVweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSAxNSUsIHRyYW5zcGFyZW50KTtcbiAgei1pbmRleDogMjtcbn1cblxuLnRlYWNoZXItaWNvbiB7XG4gIGZvbnQtc2l6ZTogNDBweDtcbn1cblxuLmZsb2F0aW5nLWVsZW1lbnRzIHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICB3aWR0aDogMTAwJTtcbiAgaGVpZ2h0OiAxMDAlO1xufVxuXG4uZmxvYXRpbmctaXRlbSB7XG4gIHBvc2l0aW9uOiBhYnNvbHV0ZTtcbiAgd2lkdGg6IDQwcHg7XG4gIGhlaWdodDogNDBweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpO1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBqdXN0aWZ5LWNvbnRlbnQ6IGNlbnRlcjtcbiAgYm94LXNoYWRvdzogMCA1cHggMTVweCByZ2JhKDc1LCA3NSwgNzUsIDAuMSk7XG4gIGJveC1zaGFkb3c6IDAgNXB4IDE1cHggY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgMTAlLCB0cmFuc3BhcmVudCk7XG4gIGFuaW1hdGlvbjogZmxvYXQgNnMgZWFzZS1pbi1vdXQgaW5maW5pdGU7XG59XG5cbi5pdGVtLTEge1xuICB0b3A6IDA7XG4gIGxlZnQ6IDA7XG4gIGFuaW1hdGlvbi1kZWxheTogMHM7XG59XG5cbi5pdGVtLTIge1xuICB0b3A6IDEwcHg7XG4gIHJpZ2h0OiAwO1xuICBhbmltYXRpb24tZGVsYXk6IDJzO1xufVxuXG4uaXRlbS0zIHtcbiAgYm90dG9tOiAwO1xuICBsZWZ0OiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNTAlKTtcbiAgYW5pbWF0aW9uLWRlbGF5OiA0cztcbn1cblxuQGtleWZyYW1lcyBmbG9hdCB7XG4gIDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCk7IH1cbiAgNTAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMHB4KTsgfVxuICAxMDAlIHsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKDBweCk7IH1cbn1cblxuLyogRk9STSBMQVlPVVQgKi9cbi5zdXJ2ZXktZm9ybSB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gIGdhcDogMjRweDtcbiAgcGFkZGluZzogMzJweCA0MHB4O1xuICB3aWR0aDogMTAwJTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLyogUVVFU1RJT04gU1RZTElORyAqL1xuLmZvcm0tZ3JvdXAge1xuICBkaXNwbGF5OiBmbGV4O1xuICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xuICBnYXA6IDE2cHg7XG4gIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtREVGQVVMVCk7XG4gIHBhZGRpbmc6IDI0cHg7XG4gIGJvcmRlci1yYWRpdXM6IDE2cHg7XG4gIGJveC1zaGFkb3c6IDAgNHB4IDEycHggcmdiYSg3NSwgNzUsIDc1LCAwLjA1KTtcbiAgYm94LXNoYWRvdzogMCA0cHggMTJweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSA1JSwgdHJhbnNwYXJlbnQpO1xuICBib3JkZXI6IDFweCBzb2xpZCByZ2JhKDc1LCA3NSwgNzUsIDAuMDQpO1xuICBib3JkZXI6IDFweCBzb2xpZCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSA0JSwgdHJhbnNwYXJlbnQpO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4zcyBlYXNlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIG92ZXJmbG93OiBoaWRkZW47XG4gIHdpZHRoOiAxMDAlO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4uZm9ybS1ncm91cDpob3ZlciB7XG4gIGJveC1zaGFkb3c6IDAgOHB4IDI1cHggcmdiYSg3NSwgNzUsIDc1LCAwLjA4KTtcbiAgYm94LXNoYWRvdzogMCA4cHggMjVweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSA4JSwgdHJhbnNwYXJlbnQpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG59XG5cbi5xdWVzdGlvbi1oZWFkZXIge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogZmxleC1zdGFydDtcbiAgZ2FwOiAxMnB4O1xufVxuXG4ucXVlc3Rpb24tbnVtYmVyIHtcbiAgd2lkdGg6IDMycHg7XG4gIGhlaWdodDogMzJweDtcbiAgYm9yZGVyLXJhZGl1czogNTAlO1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDAlLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDEwMCUpO1xuICBjb2xvcjogdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIGZvbnQtc2l6ZTogMC45cmVtO1xuICBmbGV4LXNocmluazogMDtcbn1cblxuLmZvcm0tZ3JvdXAgbGFiZWwge1xuICBmb250LXdlaWdodDogNjAwO1xuICBjb2xvcjogdmFyKC0tY29udGVudC1ERUZBVUxUKTtcbiAgZm9udC1zaXplOiAxcmVtO1xuICBsaW5lLWhlaWdodDogMS41O1xuICBtYXJnaW46IDA7XG4gIGZsZXg6IDE7XG59XG5cbi5sYWJlbC1waWxsIHtcbiAgZm9udC1zaXplOiAwLjc1cmVtO1xuICBmb250LXdlaWdodDogNTAwO1xuICBjb2xvcjogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tcHJpbWFyeS01MCk7XG4gIHBhZGRpbmc6IDRweCAxMHB4O1xuICBib3JkZXItcmFkaXVzOiAyMHB4O1xuICBtYXJnaW4tbGVmdDogOHB4O1xufVxuXG4ucmVxdWlyZWQtc3RhciB7XG4gIGNvbG9yOiB2YXIoLS1lcnJvci1ERUZBVUxUKTtcbiAgZm9udC1zaXplOiAwLjlyZW07XG4gIGZvbnQtd2VpZ2h0OiA2MDA7XG4gIG1hcmdpbi1sZWZ0OiA0cHg7XG59XG5cbi8qIENIRUNLQk9YIEdST1VQICovXG4uY2hlY2tib3gtZ3JvdXAge1xuICBkaXNwbGF5OiBncmlkO1xuICBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdChhdXRvLWZpdCwgbWlubWF4KDIyMHB4LCAxZnIpKTtcbiAgZ2FwOiAxMnB4O1xuICBtYXJnaW4tdG9wOiA4cHg7XG4gIHdpZHRoOiAxMDAlO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4uY2hlY2tib3gtY2FyZCB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGFsaWduLWl0ZW1zOiBjZW50ZXI7XG4gIGdhcDogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgY3Vyc29yOiBwb2ludGVyO1xuICBwYWRkaW5nOiAxNHB4IDE2cHg7XG4gIG1hcmdpbjogMDtcbiAgZm9udC1zaXplOiAwLjk1cmVtO1xuICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICBwb3NpdGlvbjogcmVsYXRpdmU7XG4gIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtbXV0ZWQpO1xuICBib3JkZXI6IDEuNXB4IHNvbGlkIHRyYW5zcGFyZW50O1xuICB3aWR0aDogMTAwJTtcbiAgYm94LXNpemluZzogYm9yZGVyLWJveDtcbn1cblxuLmNoZWNrYm94LWNhcmQ6aG92ZXIge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1zaGFkZS04MCk7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tY29udGVudC0zMCk7XG59XG5cbi5jaGVja2JveC1jYXJkIGlucHV0W3R5cGU9J2NoZWNrYm94J10ge1xuICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gIG9wYWNpdHk6IDA7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgaGVpZ2h0OiAwO1xuICB3aWR0aDogMDtcbn1cblxuLmNoZWNrbWFyayB7XG4gIGhlaWdodDogMjBweDtcbiAgd2lkdGg6IDIwcHg7XG4gIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoYWRlLTgwKTtcbiAgYm9yZGVyLXJhZGl1czogNnB4O1xuICBib3JkZXI6IDJweCBzb2xpZCB2YXIoLS1jb250ZW50LTMwKTtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB0cmFuc2l0aW9uOiBhbGwgMC4ycyBlYXNlO1xuICBmbGV4LXNocmluazogMDtcbn1cblxuLmNoZWNrYm94LWNhcmQ6aG92ZXIgLmNoZWNrbWFyayB7XG4gIGJvcmRlci1jb2xvcjogdmFyKC0tY29udGVudC01MCk7XG59XG5cbi5jaGVja2JveC1jYXJkIGlucHV0OmNoZWNrZWQgfiAuY2hlY2ttYXJrIHtcbiAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xufVxuXG4uY2hlY2ttYXJrOmFmdGVyIHtcbiAgY29udGVudDogXCJcIjtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICBkaXNwbGF5OiBub25lO1xuICBsZWZ0OiA2cHg7XG4gIHRvcDogMnB4O1xuICB3aWR0aDogNXB4O1xuICBoZWlnaHQ6IDEwcHg7XG4gIGJvcmRlcjogc29saWQgdmFyKC0tc3VyZmFjZS1ERUZBVUxUKTtcbiAgYm9yZGVyLXdpZHRoOiAwIDJweCAycHggMDtcbiAgdHJhbnNmb3JtOiByb3RhdGUoNDVkZWcpO1xufVxuXG4uY2hlY2tib3gtY2FyZCBpbnB1dDpjaGVja2VkIH4gLmNoZWNrbWFyazphZnRlciB7XG4gIGRpc3BsYXk6IGJsb2NrO1xufVxuXG4uY2hlY2tib3gtY2FyZDpoYXMoaW5wdXQ6Y2hlY2tlZCkge1xuICBiYWNrZ3JvdW5kOiB2YXIoLS1wcmltYXJ5LTUwKTtcbiAgYm9yZGVyLWNvbG9yOiB2YXIoLS1wcmltYXJ5LURFRkFVTFQpO1xuICBjb2xvcjogdmFyKC0tcHJpbWFyeS1ERUZBVUxUKTtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbn1cblxuLmNoZWNrYm94LXRleHQge1xuICBmbGV4OiAxO1xufVxuXG4vKiBTRUxFQ1QgU1RZTElORyAqL1xuLnNlbGVjdC13cmFwcGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICB3aWR0aDogMTAwJTtcbn1cblxuLmZvcm0tY29udHJvbCB7XG4gIHdpZHRoOiAxMDAlO1xuICBwYWRkaW5nOiA1cHggMTZweDtcbiAgYm9yZGVyOiAxLjVweCBzb2xpZCB2YXIoLS1jb250ZW50LTMwKTtcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBmb250LWZhbWlseTogaW5oZXJpdDtcbiAgYmFja2dyb3VuZDogdmFyKC0tc3VyZmFjZS1tdXRlZCk7XG4gIHRyYW5zaXRpb246IGFsbCAwLjNzIGVhc2U7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG4gIGFwcGVhcmFuY2U6IG5vbmU7XG59XG5cbi5mb3JtLWNvbnRyb2w6Zm9jdXMge1xuICBvdXRsaW5lOiBub25lO1xuICBib3JkZXItY29sb3I6IHZhcigtLXByaW1hcnktREVGQVVMVCk7XG4gIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtREVGQVVMVCk7XG4gIGJveC1zaGFkb3c6IDAgMCAwIDNweCByZ2JhKDcwLCAxNjAsIDI0MSwgMC4xKTtcbiAgYm94LXNoYWRvdzogMCAwIDAgM3B4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDEwJSwgdHJhbnNwYXJlbnQpO1xufVxuXG4uc2VsZWN0LWFycm93IHtcbiAgcG9zaXRpb246IGFic29sdXRlO1xuICByaWdodDogMTZweDtcbiAgdG9wOiA1MCU7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgtNTAlKTtcbiAgcG9pbnRlci1ldmVudHM6IG5vbmU7XG4gIGNvbG9yOiB2YXIoLS1jb250ZW50LTYwKTtcbiAgZm9udC1zaXplOiAxMnB4O1xufVxuXG4vKiBURVhUQVJFQSBTVFlMSU5HICovXG4udGV4dGFyZWEtd3JhcHBlciB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG50ZXh0YXJlYS5mb3JtLWNvbnRyb2wge1xuICBtaW4taGVpZ2h0OiAxMDBweDtcbiAgcmVzaXplOiB2ZXJ0aWNhbDtcbiAgbGluZS1oZWlnaHQ6IDEuNjtcbn1cblxuLyogQUNUSU9OUyAqL1xuLmZvcm0tYWN0aW9ucyB7XG4gIGRpc3BsYXk6IGZsZXg7XG4gIGp1c3RpZnktY29udGVudDogZmxleC1lbmQ7XG4gIGdhcDogMTZweDtcbiAgbWFyZ2luLXRvcDogMjRweDtcbiAgcGFkZGluZy10b3A6IDIwcHg7XG4gIGJvcmRlci10b3A6IDFweCBzb2xpZCByZ2JhKDc1LCA3NSwgNzUsIDAuMDgpO1xuICBib3JkZXItdG9wOiAxcHggc29saWQgY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLWNvbnRlbnQtREVGQVVMVCkgOCUsIHRyYW5zcGFyZW50KTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi5idG4tY2FuY2VsLCAuYnRuLXN1Ym1pdCB7XG4gIHBhZGRpbmc6IDE0cHggMjhweDtcbiAgYm9yZGVyLXJhZGl1czogMTJweDtcbiAgZm9udC13ZWlnaHQ6IDYwMDtcbiAgZm9udC1zaXplOiAxNXB4O1xuICBib3JkZXI6IG5vbmU7XG4gIGN1cnNvcjogcG9pbnRlcjtcbiAgdHJhbnNpdGlvbjogYWxsIDAuM3MgY3ViaWMtYmV6aWVyKDAuNCwgMCwgMC4yLCAxKTtcbiAgbWluLXdpZHRoOiAxNDBweDtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICBvdmVyZmxvdzogaGlkZGVuO1xuICBib3gtc2l6aW5nOiBib3JkZXItYm94O1xufVxuXG4uYnRuLWNhbmNlbCB7XG4gIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtbXV0ZWQpO1xuICBjb2xvcjogdmFyKC0tY29udGVudC02MCk7XG4gIGJvcmRlcjogMS41cHggc29saWQgdmFyKC0tY29udGVudC0zMCk7XG59XG5cbi5idG4tY2FuY2VsOmhvdmVyOm5vdCg6ZGlzYWJsZWQpIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tc2hhZGUtODApO1xuICBjb2xvcjogdmFyKC0tY29udGVudC0xMDApO1xuICBib3JkZXItY29sb3I6IHZhcigtLWNvbnRlbnQtNTApO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gIGJveC1zaGFkb3c6IDAgOHB4IDIwcHggcmdiYSgxMTAsIDExOSwgMTM1LCAwLjE1KTtcbiAgYm94LXNoYWRvdzogMCA4cHggMjBweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC02MCkgMTUlLCB0cmFuc3BhcmVudCk7XG59XG5cbi5idG4tc3VibWl0IHtcbiAgYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KDEzNWRlZywgdmFyKC0tcHJpbWFyeS1ERUZBVUxUKSAwJSwgdmFyKC0tdGVydGlhcnktREVGQVVMVCkgMTAwJSk7XG4gIGNvbG9yOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpO1xuICBib3gtc2hhZG93OiAwIDRweCAxMnB4IHJnYmEoMTMxLCA4MywgMjI2LCAwLjMpO1xuICBib3gtc2hhZG93OiAwIDRweCAxMnB4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS10ZXJ0aWFyeS1ERUZBVUxUKSAzMCUsIHRyYW5zcGFyZW50KTtcbn1cblxuLmJ0bi1zdWJtaXQ6aG92ZXI6bm90KDpkaXNhYmxlZCkge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1wcmltYXJ5LURFRkFVTFQpIDAlLCB2YXIoLS10ZXJ0aWFyeS0xMDApIDEwMCUpO1xuICB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7XG4gIGJveC1zaGFkb3c6IDAgOHB4IDI0cHggcmdiYSgxMzEsIDgzLCAyMjYsIDAuNCk7XG4gIGJveC1zaGFkb3c6IDAgOHB4IDI0cHggY29sb3ItbWl4KGluIHNyZ2IsIHZhcigtLXRlcnRpYXJ5LURFRkFVTFQpIDQwJSwgdHJhbnNwYXJlbnQpO1xufVxuXG4uYnRuLWNhbmNlbDphY3RpdmU6bm90KDpkaXNhYmxlZCksIC5idG4tc3VibWl0OmFjdGl2ZTpub3QoOmRpc2FibGVkKSB7XG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcbn1cblxuLmJ0bi1jYW5jZWw6ZGlzYWJsZWQsIC5idG4tc3VibWl0OmRpc2FibGVkIHtcbiAgb3BhY2l0eTogMC42O1xuICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICB0cmFuc2Zvcm06IG5vbmUgIWltcG9ydGFudDtcbn1cblxuLyogRVJST1IgTUVTU0FHRSAqL1xuLmVycm9yLW1lc3NhZ2Uge1xuICBkaXNwbGF5OiBmbGV4O1xuICBhbGlnbi1pdGVtczogY2VudGVyO1xuICBnYXA6IDEycHg7XG4gIGNvbG9yOiB2YXIoLS1lcnJvci1ERUZBVUxUKTtcbiAgYmFja2dyb3VuZDogdmFyKC0tZXJyb3ItNTApO1xuICBwYWRkaW5nOiAxNnB4IDIwcHg7XG4gIGJvcmRlci1yYWRpdXM6IDEycHg7XG4gIG1hcmdpbi10b3A6IDIwcHg7XG4gIGZvbnQtc2l6ZTogMTRweDtcbiAgZm9udC13ZWlnaHQ6IDUwMDtcbiAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tZXJyb3ItMTAwKTtcbiAgd2lkdGg6IDEwMCU7XG4gIGJveC1zaXppbmc6IGJvcmRlci1ib3g7XG59XG5cbi5lcnJvci1tZXNzYWdlIG1hdC1pY29uIHtcbiAgZm9udC1zaXplOiAyMHB4O1xuICB3aWR0aDogMjBweDtcbiAgaGVpZ2h0OiAyMHB4O1xuICBmbGV4LXNocmluazogMDtcbn1cblxuLyogQ1VTVE9NIFNDUk9MTEJBUiAqL1xuLnN1cnZleS1jb250YWluZXI6Oi13ZWJraXQtc2Nyb2xsYmFyIHtcbiAgd2lkdGg6IDhweDtcbn1cblxuLnN1cnZleS1jb250YWluZXI6Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcbiAgYmFja2dyb3VuZDogdmFyKC0tc2hhZGUtODApO1xuICBib3JkZXItcmFkaXVzOiA0cHg7XG59XG5cbi5zdXJ2ZXktY29udGFpbmVyOjotd2Via2l0LXNjcm9sbGJhci10aHVtYiB7XG4gIGJhY2tncm91bmQ6IGxpbmVhci1ncmFkaWVudCgxMzVkZWcsIHZhcigtLWNvbnRlbnQtMzApIDAlLCB2YXIoLS1jb250ZW50LTUwKSAxMDAlKTtcbiAgYm9yZGVyLXJhZGl1czogNHB4O1xufVxuXG4uc3VydmV5LWNvbnRhaW5lcjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWI6aG92ZXIge1xuICBiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQoMTM1ZGVnLCB2YXIoLS1jb250ZW50LTUwKSAwJSwgdmFyKC0tY29udGVudC02MCkgMTAwJSk7XG59XG5cbi8qIFJFU1BPTlNJVkUgQlJFQUtQT0lOVFMgKi9cbkBtZWRpYSAobWF4LXdpZHRoOiA3NjhweCkge1xuICAuc3VydmV5LWNvbnRhaW5lciB7XG4gICAgbWF4LWhlaWdodDogOTB2aDtcbiAgICBib3JkZXItcmFkaXVzOiAxMnB4O1xuICB9XG4gIFxuICAuc3VydmV5LWhlcm8ge1xuICAgIHBhZGRpbmc6IDI0cHggMjBweCAyMHB4O1xuICB9XG4gIFxuICAuc3VydmV5LWhlYWRlciB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDE2cHg7XG4gIH1cbiAgXG4gIC5oZXJvLWlsbHVzdHJhdGlvbiB7XG4gICAgbWFyZ2luLWxlZnQ6IDA7XG4gICAgYWxpZ24tc2VsZjogY2VudGVyO1xuICB9XG4gIFxuICAuaWxsdXN0cmF0aW9uLWNvbnRhaW5lciB7XG4gICAgd2lkdGg6IDEyMHB4O1xuICAgIGhlaWdodDogMTIwcHg7XG4gIH1cbiAgXG4gIC50ZWFjaGVyLWF2YXRhciB7XG4gICAgd2lkdGg6IDgwcHg7XG4gICAgaGVpZ2h0OiA4MHB4O1xuICB9XG4gIFxuICAudGVhY2hlci1pY29uIHtcbiAgICBmb250LXNpemU6IDMycHg7XG4gIH1cbiAgXG4gIC5mbG9hdGluZy1pdGVtIHtcbiAgICB3aWR0aDogMzJweDtcbiAgICBoZWlnaHQ6IDMycHg7XG4gICAgZm9udC1zaXplOiAxNHB4O1xuICB9XG4gIFxuICAuc3VydmV5LWZvcm0ge1xuICAgIHBhZGRpbmc6IDI0cHggMjBweDtcbiAgfVxuICBcbiAgLmZvcm0tZ3JvdXAge1xuICAgIHBhZGRpbmc6IDIwcHg7XG4gIH1cbiAgXG4gIC5jaGVja2JveC1ncm91cCB7XG4gICAgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7XG4gIH1cbiAgXG4gIC5mb3JtLWFjdGlvbnMge1xuICAgIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XG4gICAgZ2FwOiAxMnB4O1xuICB9XG4gIFxuICAuYnRuLWNhbmNlbCwgLmJ0bi1zdWJtaXQge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIG1pbi13aWR0aDogYXV0bztcbiAgfVxufVxuXG5AbWVkaWEgKG1heC13aWR0aDogNDgwcHgpIHtcbiAgLnN1cnZleS1jb250YWluZXIge1xuICAgIG1heC1oZWlnaHQ6IDk1dmg7XG4gIH1cbiAgXG4gIC5zdXJ2ZXktaGVybyB7XG4gICAgcGFkZGluZzogMjBweCAxNnB4IDE2cHg7XG4gIH1cbiAgXG4gIC5zdXJ2ZXktZm9ybSB7XG4gICAgcGFkZGluZzogMjBweCAxNnB4O1xuICB9XG4gIFxuICAuZm9ybS1ncm91cCB7XG4gICAgcGFkZGluZzogMTZweDtcbiAgfVxuICBcbiAgLnF1ZXN0aW9uLWhlYWRlciB7XG4gICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcbiAgICBnYXA6IDhweDtcbiAgfVxuICBcbiAgLnF1ZXN0aW9uLW51bWJlciB7XG4gICAgYWxpZ24tc2VsZjogZmxleC1zdGFydDtcbiAgfVxufVxuXG59XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ }),

/***/ 48033:
/*!********************************************************************************!*\
  !*** ./src/app/shared/components/common-dropdown/common-dropdown.component.ts ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CommonDropdownComponent: () => (/* binding */ CommonDropdownComponent)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/forms */ 34456);
/* harmony import */ var _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ng-select/ng-select */ 62223);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 90852);










function CommonDropdownComponent_label_1_span_3_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1, "*");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function CommonDropdownComponent_label_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "label", 4);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](3, CommonDropdownComponent_label_1_span_3_Template, 2, 0, "span", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r0 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", ctx_r0.inputId);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 3, ctx_r0.config.labelTxt), " ");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx_r0.config.required && ctx_r0.mode !== "view");
  }
}
function CommonDropdownComponent_label_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "label", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](2, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("for", ctx_r1.inputId);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](2, 2, ctx_r1.ariaLabelText));
  }
}
const _c0 = function (a0) {
  return {
    height: a0
  };
};
class CommonDropdownComponent {
  constructor() {
    this.inputId = `common-dropdown-${Math.random().toString(36).slice(2, 10)}`;
    this.dropDownValues = [];
    this.valueUpdate = new _angular_core__WEBPACK_IMPORTED_MODULE_0__.EventEmitter();
    this.onChange = () => {};
    this.onTouched = () => {};
  }
  /** Accessible name for the dropdown: visible label, else placeholder text */
  get ariaLabelText() {
    return this.config?.labelTxt || this.config?.placeHolderTxt || '';
  }
  /**
   * Function trigger for dropdown value change
   * @param val change event value
   */
  valueSelected(val) {
    this.valueUpdate.emit(this.selectedItem);
  }
  writeValue(value) {
    this.selectedItem = value;
  }
  registerOnChange(fn) {
    this.onChange = fn;
  }
  registerOnTouched(fn) {
    this.onTouched = fn;
  }
  static {
    this.ɵfac = function CommonDropdownComponent_Factory(t) {
      return new (t || CommonDropdownComponent)();
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: CommonDropdownComponent,
      selectors: [["app-common-dropdown"]],
      inputs: {
        dropDownValues: "dropDownValues",
        config: "config",
        mode: "mode"
      },
      outputs: {
        valueUpdate: "valueUpdate"
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵProvidersFeature"]([{
        provide: _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NG_VALUE_ACCESSOR,
        useExisting: (0,_angular_core__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(() => CommonDropdownComponent),
        multi: true
      }]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 5,
      vars: 20,
      consts: [[1, "select-wrapper"], ["class", "form-control-label", 3, "for", 4, "ngIf"], ["class", "sr-only", 3, "for", 4, "ngIf"], [3, "labelForId", "items", "ngClass", "bindLabel", "bindValue", "disabled", "placeholder", "dropdownPosition", "searchable", "clearable", "multiple", "ngModel", "ngModelChange"], [1, "form-control-label", 3, "for"], ["class", "text-[16px] text-error", 4, "ngIf"], [1, "text-[16px]", "text-error"], [1, "sr-only", 3, "for"]],
      template: function CommonDropdownComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](1, CommonDropdownComponent_label_1_Template, 4, 5, "label", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](2, CommonDropdownComponent_label_2_Template, 3, 4, "label", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "ng-select", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function CommonDropdownComponent_Template_ng_select_ngModelChange_3_listener($event) {
            return ctx.selectedItem = $event;
          })("ngModelChange", function CommonDropdownComponent_Template_ng_select_ngModelChange_3_listener($event) {
            ctx.onChange($event);
            return ctx.valueSelected($event);
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.config.labelTxt);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", !ctx.config.labelTxt && ctx.ariaLabelText);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵstyleMap"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](18, _c0, ctx.config.height));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("bindLabel", ctx.config.bindLabel ? ctx.config.bindLabel : "name");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpropertyInterpolate"]("bindValue", ctx.config.bindValue ? ctx.config.bindValue : "value");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("labelForId", ctx.inputId)("items", ctx.dropDownValues)("ngClass", ctx.config.isBackground && ctx.config.disabled ? "with-background" : "")("disabled", ctx.config.disabled ? ctx.config.disabled : false)("placeholder", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](4, 16, ctx.config.placeHolderTxt))("dropdownPosition", "auto")("searchable", ctx.config.searchable || false)("clearable", ctx.config.clearableOff ? false : true)("multiple", false)("ngModel", ctx.selectedItem);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgClass, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgIf, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_3__.NgSelectModule, _ng_select_ng_select__WEBPACK_IMPORTED_MODULE_3__.NgSelectComponent, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.FormsModule, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgControlStatus, _angular_forms__WEBPACK_IMPORTED_MODULE_1__.NgModel, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslatePipe],
      styles: [".select-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-focused:not(.ng-select-opened) > .ng-select-container {\n  box-shadow: none;\n  border: 1px solid var(--content-50);\n}\n.select-wrapper[_ngcontent-%COMP%]     .with-background.ng-select .ng-select-container {\n  background: var(--surface-muted) !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-select-container {\n  background-color: var(--surface-DEFAULT) !important;\n  height: 100% !important;\n  border: 1px solid var(--content-50);\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-select-container .ng-value-container .ng-input > input[readonly] {\n  user-select: unset;\n  -webkit-user-select: unset;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-select-container .ng-value-container .ng-placeholder {\n  color: var(--content-60);\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select.ng-select-disabled > .ng-select-container {\n  background: var(--shade-80) !important;\n  border: none;\n  cursor: not-allowed;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-arrow-wrapper .ng-arrow {\n  border-color: none !important;\n  border-style: none !important;\n  border-width: 0 !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-select .ng-arrow-wrapper {\n  background-image: url('drop-down.aad29f04a486a4ef.svg') !important;\n  background-repeat: no-repeat;\n  background-size: 14px 14px;\n  margin-top: 10px;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel.ng-select-bottom {\n  border: none;\n  margin-top: 5px;\n  box-shadow: 0px 4px 9px 0px rgba(75, 75, 75, 0.12);\n  box-shadow: 0px 4px 9px 0px color-mix(in srgb, var(--content-DEFAULT) 12%, transparent);\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel {\n  min-width: 200px !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-selected, .select-wrapper[_ngcontent-%COMP%]   .ng-dropdown-panel[_ngcontent-%COMP%]   .ng-dropdown-panel-items[_ngcontent-%COMP%]   .ng-option.ng-option-selected.ng-option-marked[_ngcontent-%COMP%] {\n  background-color: var(--shade-80) !important;\n}\n.select-wrapper[_ngcontent-%COMP%]     .ng-dropdown-panel .ng-dropdown-panel-items .ng-option.ng-option-marked {\n  background-color: var(--shade-80) !important;\n}\n.select-wrapper[_ngcontent-%COMP%]   .area-label[_ngcontent-%COMP%] {\n  position: absolute;\n  left: 11px;\n  color: var(--content-50);\n  z-index: 1;\n  font-size: 0.875rem;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbW1vbi1kcm9wZG93bi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFBO0FBQ0Y7QUFBRTtFQUdFLGdCQUFBO0VBQ0EsbUNBQUE7QUFBSjtBQUlFO0VBQ0UsMkNBQUE7QUFGSjtBQUlFO0VBQ0UsbURBQUE7RUFDQSx1QkFBQTtFQUNBLG1DQUFBO0FBRko7QUFLRTtFQUNFLGtCQUFBO0VBQ0EsMEJBQUE7QUFISjtBQU9FO0VBQ0Usd0JBQUE7QUFMSjtBQWFFO0VBQ0Usc0NBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7QUFYSjtBQWNFO0VBQ0UsNkJBQUE7RUFDQSw2QkFBQTtFQUNBLDBCQUFBO0FBWko7QUFjRTtFQUNFLGtFQUFBO0VBQ0EsNEJBQUE7RUFDQSwwQkFBQTtFQUNBLGdCQUFBO0FBWko7QUFlRTtFQUNFLFlBQUE7RUFDQSxlQUFBO0VBQ0Esa0RBQUE7RUFDQSx1RkFBQTtBQWJKO0FBZ0JFO0VBQ0UsMkJBQUE7QUFkSjtBQWlCRTs7RUFPRSw0Q0FBQTtBQXBCSjtBQXVCRTtFQUlFLDRDQUFBO0FBeEJKO0FBMkJFO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0Esd0JBQUE7RUFDQSxVQUFBO0VBQ0EsbUJBQUE7QUF6QkoiLCJmaWxlIjoiY29tbW9uLWRyb3Bkb3duLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLnNlbGVjdC13cmFwcGVyIHtcbiAgcG9zaXRpb246IHJlbGF0aXZlO1xuICA6Om5nLWRlZXBcbiAgICAubmctc2VsZWN0Lm5nLXNlbGVjdC1mb2N1c2VkOm5vdCgubmctc2VsZWN0LW9wZW5lZClcbiAgICA+IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBib3gtc2hhZG93OiBub25lO1xuICAgIGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWNvbnRlbnQtNTApO1xuXG4gIH1cblxuICA6Om5nLWRlZXAgLndpdGgtYmFja2dyb3VuZC5uZy1zZWxlY3QgLm5nLXNlbGVjdC1jb250YWluZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXN1cmZhY2UtbXV0ZWQpICFpbXBvcnRhbnQ7XG4gIH1cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLXNlbGVjdC1jb250YWluZXIge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXN1cmZhY2UtREVGQVVMVCkgIWltcG9ydGFudDtcbiAgICBoZWlnaHQ6IDEwMCUgIWltcG9ydGFudDtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb250ZW50LTUwKTtcbiAgfVxuXG4gIDo6bmctZGVlcCAubmctc2VsZWN0IC5uZy1zZWxlY3QtY29udGFpbmVyIC5uZy12YWx1ZS1jb250YWluZXIgLm5nLWlucHV0PmlucHV0W3JlYWRvbmx5XXtcbiAgICB1c2VyLXNlbGVjdDogdW5zZXQ7XG4gICAgLXdlYmtpdC11c2VyLXNlbGVjdDogdW5zZXQ7XG4gIH1cblxuICAvLyBXQ0FHIEFBOiBuZy1zZWxlY3QgZGVmYXVsdCBwbGFjZWhvbGRlciAoIzk5OSwgfjIuODU6MSkgZmFpbHMgY29udHJhc3RcbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLXNlbGVjdC1jb250YWluZXIgLm5nLXZhbHVlLWNvbnRhaW5lciAubmctcGxhY2Vob2xkZXIge1xuICAgIGNvbG9yOiB2YXIoLS1jb250ZW50LTYwKTtcbiAgfVxuXG4gIC8vIDo6bmctZGVlcFxuICAvLyAgIC5uZy1zZWxlY3Qubmctc2VsZWN0LWZvY3VzZWQ6bm90KC5uZy1zZWxlY3Qtb3BlbmVkKVxuICAvLyAgID4gLm5nLXNlbGVjdC1jb250YWluZXIge1xuICAvLyB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3Qubmctc2VsZWN0LWRpc2FibGVkID4gLm5nLXNlbGVjdC1jb250YWluZXIge1xuICAgIGJhY2tncm91bmQ6IHZhcigtLXNoYWRlLTgwKSAhaW1wb3J0YW50O1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBjdXJzb3I6IG5vdC1hbGxvd2VkO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLWFycm93LXdyYXBwZXIgLm5nLWFycm93IHtcbiAgICBib3JkZXItY29sb3I6IG5vbmUgIWltcG9ydGFudDtcbiAgICBib3JkZXItc3R5bGU6IG5vbmUgIWltcG9ydGFudDtcbiAgICBib3JkZXItd2lkdGg6IDAgIWltcG9ydGFudDtcbiAgfVxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctYXJyb3ctd3JhcHBlciB7XG4gICAgYmFja2dyb3VuZC1pbWFnZTogdXJsKFwiLi4vLi4vLi4vLi4vYXNzZXRzL2ljb25zL2Ryb3AtZG93bi5zdmdcIikgIWltcG9ydGFudDtcbiAgICBiYWNrZ3JvdW5kLXJlcGVhdDogbm8tcmVwZWF0O1xuICAgIGJhY2tncm91bmQtc2l6ZTogMTRweCAxNHB4O1xuICAgIG1hcmdpbi10b3A6IDEwcHg7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLWRyb3Bkb3duLXBhbmVsLm5nLXNlbGVjdC1ib3R0b20ge1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBtYXJnaW4tdG9wOiA1cHg7XG4gICAgYm94LXNoYWRvdzogMHB4IDRweCA5cHggMHB4IHJnYmEoNzUsIDc1LCA3NSwgMC4xMik7XG4gICAgYm94LXNoYWRvdzogMHB4IDRweCA5cHggMHB4IGNvbG9yLW1peChpbiBzcmdiLCB2YXIoLS1jb250ZW50LURFRkFVTFQpIDEyJSwgdHJhbnNwYXJlbnQpO1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1kcm9wZG93bi1wYW5lbCB7XG4gICAgbWluLXdpZHRoOiAyMDBweCAhaW1wb3J0YW50O1xuICB9XG5cbiAgOjpuZy1kZWVwXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsLWl0ZW1zXG4gICAgLm5nLW9wdGlvbi5uZy1vcHRpb24tc2VsZWN0ZWQsXG4gIC5uZy1kcm9wZG93bi1wYW5lbFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtc1xuICAgIC5uZy1vcHRpb24ubmctb3B0aW9uLXNlbGVjdGVkLm5nLW9wdGlvbi1tYXJrZWQge1xuICAgIGJhY2tncm91bmQtY29sb3I6IHZhcigtLXNoYWRlLTgwKSAhaW1wb3J0YW50O1xuICB9XG5cbiAgOjpuZy1kZWVwXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsXG4gICAgLm5nLWRyb3Bkb3duLXBhbmVsLWl0ZW1zXG4gICAgLm5nLW9wdGlvbi5uZy1vcHRpb24tbWFya2VkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGFkZS04MCkgIWltcG9ydGFudDtcbiAgfVxuXG4gIC5hcmVhLWxhYmVsIHtcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XG4gICAgbGVmdDogMTFweDtcbiAgICBjb2xvcjogdmFyKC0tY29udGVudC01MCk7XG4gICAgei1pbmRleDogMTtcbiAgICBmb250LXNpemU6IDAuODc1cmVtO1xuICB9XG59XG4iXX0= */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvc2hhcmVkL2NvbXBvbmVudHMvY29tbW9uLWRyb3Bkb3duL2NvbW1vbi1kcm9wZG93bi5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLGtCQUFBO0FBQ0Y7QUFBRTtFQUdFLGdCQUFBO0VBQ0EsbUNBQUE7QUFBSjtBQUlFO0VBQ0UsMkNBQUE7QUFGSjtBQUlFO0VBQ0UsbURBQUE7RUFDQSx1QkFBQTtFQUNBLG1DQUFBO0FBRko7QUFLRTtFQUNFLGtCQUFBO0VBQ0EsMEJBQUE7QUFISjtBQU9FO0VBQ0Usd0JBQUE7QUFMSjtBQWFFO0VBQ0Usc0NBQUE7RUFDQSxZQUFBO0VBQ0EsbUJBQUE7QUFYSjtBQWNFO0VBQ0UsNkJBQUE7RUFDQSw2QkFBQTtFQUNBLDBCQUFBO0FBWko7QUFjRTtFQUNFLGtFQUFBO0VBQ0EsNEJBQUE7RUFDQSwwQkFBQTtFQUNBLGdCQUFBO0FBWko7QUFlRTtFQUNFLFlBQUE7RUFDQSxlQUFBO0VBQ0Esa0RBQUE7RUFDQSx1RkFBQTtBQWJKO0FBZ0JFO0VBQ0UsMkJBQUE7QUFkSjtBQWlCRTs7RUFPRSw0Q0FBQTtBQXBCSjtBQXVCRTtFQUlFLDRDQUFBO0FBeEJKO0FBMkJFO0VBQ0Usa0JBQUE7RUFDQSxVQUFBO0VBQ0Esd0JBQUE7RUFDQSxVQUFBO0VBQ0EsbUJBQUE7QUF6Qko7QUFDQSw0aklBQTRqSSIsInNvdXJjZXNDb250ZW50IjpbIi5zZWxlY3Qtd3JhcHBlciB7XG4gIHBvc2l0aW9uOiByZWxhdGl2ZTtcbiAgOjpuZy1kZWVwXG4gICAgLm5nLXNlbGVjdC5uZy1zZWxlY3QtZm9jdXNlZDpub3QoLm5nLXNlbGVjdC1vcGVuZWQpXG4gICAgPiAubmctc2VsZWN0LWNvbnRhaW5lciB7XG4gICAgYm94LXNoYWRvdzogbm9uZTtcbiAgICBib3JkZXI6IDFweCBzb2xpZCB2YXIoLS1jb250ZW50LTUwKTtcblxuICB9XG5cbiAgOjpuZy1kZWVwIC53aXRoLWJhY2tncm91bmQubmctc2VsZWN0IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zdXJmYWNlLW11dGVkKSAhaW1wb3J0YW50O1xuICB9XG4gIDo6bmctZGVlcCAubmctc2VsZWN0IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zdXJmYWNlLURFRkFVTFQpICFpbXBvcnRhbnQ7XG4gICAgaGVpZ2h0OiAxMDAlICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyOiAxcHggc29saWQgdmFyKC0tY29udGVudC01MCk7XG4gIH1cblxuICA6Om5nLWRlZXAgLm5nLXNlbGVjdCAubmctc2VsZWN0LWNvbnRhaW5lciAubmctdmFsdWUtY29udGFpbmVyIC5uZy1pbnB1dD5pbnB1dFtyZWFkb25seV17XG4gICAgdXNlci1zZWxlY3Q6IHVuc2V0O1xuICAgIC13ZWJraXQtdXNlci1zZWxlY3Q6IHVuc2V0O1xuICB9XG5cbiAgLy8gV0NBRyBBQTogbmctc2VsZWN0IGRlZmF1bHQgcGxhY2Vob2xkZXIgKCM5OTksIH4yLjg1OjEpIGZhaWxzIGNvbnRyYXN0XG4gIDo6bmctZGVlcCAubmctc2VsZWN0IC5uZy1zZWxlY3QtY29udGFpbmVyIC5uZy12YWx1ZS1jb250YWluZXIgLm5nLXBsYWNlaG9sZGVyIHtcbiAgICBjb2xvcjogdmFyKC0tY29udGVudC02MCk7XG4gIH1cblxuICAvLyA6Om5nLWRlZXBcbiAgLy8gICAubmctc2VsZWN0Lm5nLXNlbGVjdC1mb2N1c2VkOm5vdCgubmctc2VsZWN0LW9wZW5lZClcbiAgLy8gICA+IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgLy8gfVxuXG4gIDo6bmctZGVlcCAubmctc2VsZWN0Lm5nLXNlbGVjdC1kaXNhYmxlZCA+IC5uZy1zZWxlY3QtY29udGFpbmVyIHtcbiAgICBiYWNrZ3JvdW5kOiB2YXIoLS1zaGFkZS04MCkgIWltcG9ydGFudDtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgY3Vyc29yOiBub3QtYWxsb3dlZDtcbiAgfVxuXG4gIDo6bmctZGVlcCAubmctc2VsZWN0IC5uZy1hcnJvdy13cmFwcGVyIC5uZy1hcnJvdyB7XG4gICAgYm9yZGVyLWNvbG9yOiBub25lICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXN0eWxlOiBub25lICFpbXBvcnRhbnQ7XG4gICAgYm9yZGVyLXdpZHRoOiAwICFpbXBvcnRhbnQ7XG4gIH1cbiAgOjpuZy1kZWVwIC5uZy1zZWxlY3QgLm5nLWFycm93LXdyYXBwZXIge1xuICAgIGJhY2tncm91bmQtaW1hZ2U6IHVybChcIi4uLy4uLy4uLy4uL2Fzc2V0cy9pY29ucy9kcm9wLWRvd24uc3ZnXCIpICFpbXBvcnRhbnQ7XG4gICAgYmFja2dyb3VuZC1yZXBlYXQ6IG5vLXJlcGVhdDtcbiAgICBiYWNrZ3JvdW5kLXNpemU6IDE0cHggMTRweDtcbiAgICBtYXJnaW4tdG9wOiAxMHB4O1xuICB9XG5cbiAgOjpuZy1kZWVwIC5uZy1kcm9wZG93bi1wYW5lbC5uZy1zZWxlY3QtYm90dG9tIHtcbiAgICBib3JkZXI6IG5vbmU7XG4gICAgbWFyZ2luLXRvcDogNXB4O1xuICAgIGJveC1zaGFkb3c6IDBweCA0cHggOXB4IDBweCByZ2JhKDc1LCA3NSwgNzUsIDAuMTIpO1xuICAgIGJveC1zaGFkb3c6IDBweCA0cHggOXB4IDBweCBjb2xvci1taXgoaW4gc3JnYiwgdmFyKC0tY29udGVudC1ERUZBVUxUKSAxMiUsIHRyYW5zcGFyZW50KTtcbiAgfVxuXG4gIDo6bmctZGVlcCAubmctZHJvcGRvd24tcGFuZWwge1xuICAgIG1pbi13aWR0aDogMjAwcHggIWltcG9ydGFudDtcbiAgfVxuXG4gIDo6bmctZGVlcFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtc1xuICAgIC5uZy1vcHRpb24ubmctb3B0aW9uLXNlbGVjdGVkLFxuICAubmctZHJvcGRvd24tcGFuZWxcbiAgICAubmctZHJvcGRvd24tcGFuZWwtaXRlbXNcbiAgICAubmctb3B0aW9uLm5nLW9wdGlvbi1zZWxlY3RlZC5uZy1vcHRpb24tbWFya2VkIHtcbiAgICBiYWNrZ3JvdW5kLWNvbG9yOiB2YXIoLS1zaGFkZS04MCkgIWltcG9ydGFudDtcbiAgfVxuXG4gIDo6bmctZGVlcFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbFxuICAgIC5uZy1kcm9wZG93bi1wYW5lbC1pdGVtc1xuICAgIC5uZy1vcHRpb24ubmctb3B0aW9uLW1hcmtlZCB7XG4gICAgYmFja2dyb3VuZC1jb2xvcjogdmFyKC0tc2hhZGUtODApICFpbXBvcnRhbnQ7XG4gIH1cblxuICAuYXJlYS1sYWJlbCB7XG4gICAgcG9zaXRpb246IGFic29sdXRlO1xuICAgIGxlZnQ6IDExcHg7XG4gICAgY29sb3I6IHZhcigtLWNvbnRlbnQtNTApO1xuICAgIHotaW5kZXg6IDE7XG4gICAgZm9udC1zaXplOiAwLjg3NXJlbTtcbiAgfVxufVxuIl0sInNvdXJjZVJvb3QiOiIifQ== */"]
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
    const _r4 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 13);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function DeleteDetailComponent_div_6_Template_div_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r4);
      const ctx_r3 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r3.closePopUp());
    });
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](1, "img", 14);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
  }
}
function DeleteDetailComponent_button_15_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵgetCurrentView"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "button", 15);
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function DeleteDetailComponent_button_15_Template_button_click_0_listener() {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵrestoreView"](_r6);
      const ctx_r5 = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵnextContext"]();
      return _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵresetView"](ctx_r5.closePopUp("close"));
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
function DeleteDetailComponent_img_20_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](0, "img", 16);
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
      decls: 21,
      vars: 23,
      consts: [["role", "dialog", "aria-modal", "true", "aria-labelledby", "delete-dialog-title", "cdkTrapFocus", "", 1, "backdrop", "fixed", "z-[99]", "inset-0", "w-full", "h-full", "flex", "items-center", "justify-center", 3, "cdkTrapFocusAutoCapture"], [1, "dialogue-warpper", "bg-white", "rounded-lg", "shadow-lg", "mx-2", "w-[500px]"], [1, "header", "flex", "justify-between", "px-5", "py-5"], ["id", "delete-dialog-title", 1, "text-lg", "font-bold", "leading-[26px]"], ["class", " bg-shade-50 rounded-full text-center p-1 cursor-pointer", 3, "click", 4, "ngIf"], [1, "body", "px-5", "py-5"], [1, "text-base", "font-medium"], [1, "footer-container", "p-4"], [1, "buttons", "flex", "items-center", "justify-end", "gap-2"], ["type", "button", "class", "btn-outline-primary", 3, "click", 4, "ngIf"], ["type", "submit", 1, "flex", "items-center", "justify-center", 3, "ngClass", "click"], [1, "mr-1"], ["src", "assets/icons/delete.svg", "alt", "", 4, "ngIf"], [1, "bg-shade-50", "rounded-full", "text-center", "p-1", "cursor-pointer", 3, "click"], ["src", "assets/icons/E remove.svg", "alt", ""], ["type", "button", 1, "btn-outline-primary", 3, "click"], ["src", "assets/icons/delete.svg", "alt", ""]],
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
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "button", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function DeleteDetailComponent_Template_button_click_16_listener() {
            return ctx.onPrimaryAction();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "span", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](18);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipe"](19, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtemplate"](20, DeleteDetailComponent_img_20_Template, 1, 0, "img", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("cdkTrapFocusAutoCapture", true);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](5, 8, ctx.config.heading));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showCancelBtn);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](ctx.config.idleTime ? _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind2"](11, 10, ctx.config.confirmationText, _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction1"](17, _c0, ctx.config.idleTime)) : _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](12, 13, ctx.config.confirmationText));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngIf", ctx.showCancelBtn);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngClass", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction2"](20, _c2, ctx.config.primaryButtonType === "delete", _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpureFunction0"](19, _c1).includes(ctx.config.primaryButtonType)));
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵpipeBind1"](19, 15, ctx.config.primaryButtonLabel));
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
/* harmony import */ var _common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../common-dropdown/common-dropdown.component */ 48033);
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
      height: 'auto',
      bindLabel: 'name',
      bindValue: 'value',
      clearableOff: true,
      labelTxt: 'Select Preferred Language'
    };
  }
  ngOnInit() {
    const lcl = _utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.LOC_LANGUAGES.filter(e => e.state === this.loggedInUser?.state);
    const localLanguage = lcl[0]?.value;
    this.languageDropdownOptions = [..._utility_constant_util__WEBPACK_IMPORTED_MODULE_1__.DEFAULT_LANGUAGE, ...localLanguage];
  }
  /**
   * ngafterviewinit hook used here to set the preferred language
   */
  ngAfterViewInit() {
    this.languageSwitcher.selectedItem = this.loggedInUser?.preferredLanguage;
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
      this.languageSwitcher.selectedItem = this.loggedInUser?.preferedLanguage;
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
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "app-common-dropdown", 0, 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵlistener"]("valueUpdate", function LanguageSwitcherComponent_Template_app_common_dropdown_valueUpdate_0_listener($event) {
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
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf, _angular_forms__WEBPACK_IMPORTED_MODULE_6__.FormsModule, _common_dropdown_common_dropdown_component__WEBPACK_IMPORTED_MODULE_0__.CommonDropdownComponent, _delete_detail_delete_detail_component__WEBPACK_IMPORTED_MODULE_2__.DeleteDetailComponent],
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
    this.idleIndicator = new rxjs__WEBPACK_IMPORTED_MODULE_3__.Subject();
    this.customIdleTrackerRoutes = ['/auth/signin', '/content-generation', '/question-paper', '/content-generation/lesson-plan', '/content-generation/lesson-resources', '/dashboard', '/school-management', '/teacher-management', '/staff-management', '/content-activity', '/audit-log', '/teacher-training'];
    this.skipIdleActivityRoutes = ['/content-generation/inspect/lesson-plan', '/content-generation/inspect/resource-plan'];
    this.isCustom = false;
    this.isSkip = false;
    this.isCompleted = false;
    this.initializeIdleTracking();
    this.router.events.pipe((0,rxjs__WEBPACK_IMPORTED_MODULE_4__.filter)(event => event instanceof _angular_router__WEBPACK_IMPORTED_MODULE_5__.NavigationEnd)).subscribe({
      next: val => {
        this.moduleName = val.url;
        this.isCustom = this.customIdleTrackerRoutes.includes(val.urlAfterRedirects);
        this.isSkip = this.skipIdleActivityRoutes.includes(val.urlAfterRedirects);
        if (this.timerService.getCurrentTime('interaction') && !this.isSkip) {
          let trackObj = {
            moduleName: this.getModuleName(this.previousModule),
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
  getModuleName(url) {
    const matchedModuleName = this.customModuleMatcher(url);
    if (matchedModuleName) {
      return matchedModuleName;
    }
    return url.split('/').filter(Boolean)[0] || '';
  }
  customModuleMatcher(url) {
    const routePatterns = {
      'view-lp': /^\/content-generation\/lesson-plan\/([a-f0-9]{24})$/,
      'view-lr': /^\/content-generation\/resource-plan\/([a-f0-9]{24})$/,
      'lesson-chat': /^\/content-generation\/lesson-chat/,
      'view-question-bank': /^\/question-paper\/view\/([a-f0-9]{24})$/
    };
    for (const [routeName, pattern] of Object.entries(routePatterns)) {
      if (pattern.test(url)) {
        return routeName;
      }
    }
    return null;
  }
  startWatching() {
    if (!this.isCustom) {
      this.previousModule = this.moduleName;
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
    const isDraft = this.moduleName.includes('draft');
    if (this.isCustom || this.isSkip || isDraft) {
      return null;
    } else {
      return this.getModuleName(this.moduleName);
    }
  }
  resetIdler() {
    this.timerService.resetTimer('idle');
    this.timerService.resetTimer('interaction');
    this.idle.stop();
  }
  logActivity(trackObj) {
    this.httpClient.post(`${src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.apiUrl}/user/activity-log`, trackObj).subscribe({
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
/* harmony export */   TEX_MATH_DELIMITERS: () => (/* binding */ TEX_MATH_DELIMITERS),
/* harmony export */   formatMarks: () => (/* binding */ formatMarks)
/* harmony export */ });
const LOGIN_ROUTE = '/auth';
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
  apiUrl: '',
  CRYPTO_SECRET: 'your_crypto_secret',
  EXP_MONTH: 3
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
//# sourceMappingURL=main.3c55935745dab909.js.map