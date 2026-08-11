"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_admin_leaders-dashboard_leaders-dashboard_component_ts"],{

/***/ 71189:
/*!***************************************************!*\
  !*** ./src/app/core/services/superset.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SupersetService: () => (/* binding */ SupersetService)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! rxjs */ 56196);
/* harmony import */ var _environments_environment__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../../environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common/http */ 46443);




class SupersetService {
  constructor(http) {
    this.http = http;
  }
  getGuestToken() {
    return (0,rxjs__WEBPACK_IMPORTED_MODULE_1__.firstValueFrom)(this.http.post(`${_environments_environment__WEBPACK_IMPORTED_MODULE_0__.environment.apiUrl}/superset/guest-token`, {})).then(res => res.token);
  }
  static {
    this.ɵfac = function SupersetService_Factory(t) {
      return new (t || SupersetService)(_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵinject"](_angular_common_http__WEBPACK_IMPORTED_MODULE_3__.HttpClient));
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjectable"]({
      token: SupersetService,
      factory: SupersetService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 19700:
/*!*****************************************************************************!*\
  !*** ./src/app/view/admin/leaders-dashboard/leaders-dashboard.component.ts ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LeadersDashboardComponent: () => (/* binding */ LeadersDashboardComponent)
/* harmony export */ });
/* harmony import */ var _home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ 89204);
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var src_environments_environment__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/environments/environment */ 45312);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_superset_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/core/services/superset.service */ 71189);
/* harmony import */ var _angular_cdk_layout__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/cdk/layout */ 87912);







const _c0 = ["mountPoint"];
function LeadersDashboardComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](1, "span", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](2, " Loading dashboard... ");
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
}
function LeadersDashboardComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 7);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtext"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
  }
  if (rf & 2) {
    const ctx_r1 = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵnextContext"]();
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtextInterpolate1"](" ", ctx_r1.error, " ");
  }
}
const MOBILE_BREAKPOINT = '(max-width: 768px)';
class LeadersDashboardComponent {
  constructor(supersetService, breakpointObserver) {
    this.supersetService = supersetService;
    this.breakpointObserver = breakpointObserver;
    this.loading = true;
    this.error = '';
    this.embed = null;
    this.timers = [];
    this.resizeDebounce = null;
    this.breakpointSub = null;
    this.resizeObserver = null;
    this.activeUuid = '';
    this.lastObservedWidth = 0;
  }
  get dashboardUuid() {
    const isMobile = this.breakpointObserver.isMatched(MOBILE_BREAKPOINT);
    const mobileUuid = src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.supersetMobileDashboardUuid;
    return isMobile && mobileUuid ? mobileUuid : src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.supersetDashboardUuid;
  }
  ngOnInit() {
    var _this = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.supersetUrl || !src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.supersetDashboardUuid || src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.supersetUrl.startsWith('your_') || src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.supersetDashboardUuid.startsWith('your_')) {
        _this.error = 'Dashboard not configured.';
        _this.loading = false;
        return;
      }
      yield _this.doEmbed();
      // Only react to WIDTH changes — height changes are from our own iframe height writes
      // and must not re-trigger applyScrollSize (would cause infinite loop)
      if (typeof ResizeObserver !== 'undefined') {
        _this.resizeObserver = new ResizeObserver(entries => {
          const width = Math.round(entries[0]?.contentRect.width ?? 0);
          if (width !== _this.lastObservedWidth) {
            _this.lastObservedWidth = width;
            _this.scheduleApplySize();
          }
        });
        _this.resizeObserver.observe(_this.mountPoint.nativeElement);
      }
      // Re-embed when crossing mobile breakpoint if different UUID configured
      _this.breakpointSub = _this.breakpointObserver.observe(MOBILE_BREAKPOINT).subscribe( /*#__PURE__*/(0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
        const newUuid = _this.dashboardUuid;
        if (newUuid !== _this.activeUuid) {
          yield _this.doEmbed();
        }
      }));
    })();
  }
  scheduleApplySize() {
    if (this.resizeDebounce) clearTimeout(this.resizeDebounce);
    this.resizeDebounce = setTimeout(() => {
      // Poll multiple times — Superset/ECharts reflows asynchronously after resize
      [0, 400, 900, 1800].forEach(delay => this.timers.push(setTimeout(() => this.applyScrollSize(), delay)));
    }, 250);
  }
  doEmbed() {
    var _this2 = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      const uuid = _this2.dashboardUuid;
      _this2.activeUuid = uuid;
      _this2.loading = true;
      _this2.error = '';
      _this2.clearTimers();
      if (_this2.mountPoint?.nativeElement) {
        _this2.mountPoint.nativeElement.innerHTML = '';
      }
      try {
        const {
          embedDashboard
        } = yield Promise.all(/*! import() */[__webpack_require__.e("common"), __webpack_require__.e("node_modules_superset-ui_embedded-sdk_lib_index_js")]).then(__webpack_require__.bind(__webpack_require__, /*! @superset-ui/embedded-sdk */ 84119));
        _this2.embed = yield embedDashboard({
          id: uuid,
          supersetDomain: src_environments_environment__WEBPACK_IMPORTED_MODULE_1__.environment.supersetUrl,
          mountPoint: _this2.mountPoint.nativeElement,
          fetchGuestToken: () => _this2.supersetService.getGuestToken(),
          dashboardUiConfig: {
            hideTitle: true,
            hideChartControls: false,
            filters: {
              visible: true,
              expanded: false
            }
          }
        });
        _this2.loading = false;
        // Initial poll — charts render progressively
        [1000, 2000, 4000].forEach(delay => _this2.timers.push(setTimeout(() => _this2.applyScrollSize(), delay)));
      } catch (err) {
        console.error('[superset] embed error:', err);
        _this2.error = 'Failed to load dashboard. Please try again.';
        _this2.loading = false;
      }
    })();
  }
  applyScrollSize() {
    var _this3 = this;
    return (0,_home_runner_work_Shiksha_Copilot_Shiksha_Copilot_shiksha_website_shiksha_frontend_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_0__["default"])(function* () {
      if (!_this3.embed) return;
      const iframe = _this3.mountPoint.nativeElement.querySelector('iframe');
      if (iframe) {
        // Toggle width by 1px to fire ResizeObserver inside iframe — triggers ECharts resize()
        iframe.style.width = 'calc(100% - 1px)';
        yield new Promise(r => requestAnimationFrame(() => r()));
        iframe.style.width = '100%';
      }
      try {
        const size = yield _this3.embed.getScrollSize();
        if (size?.height > 100 && iframe) {
          iframe.style.height = `${size.height}px`;
        }
      } catch {}
    })();
  }
  clearTimers() {
    this.timers.forEach(t => clearTimeout(t));
    this.timers = [];
  }
  ngOnDestroy() {
    this.clearTimers();
    if (this.resizeDebounce) clearTimeout(this.resizeDebounce);
    this.breakpointSub?.unsubscribe();
    this.resizeObserver?.disconnect();
    if (this.mountPoint?.nativeElement) {
      this.mountPoint.nativeElement.innerHTML = '';
    }
  }
  static {
    this.ɵfac = function LeadersDashboardComponent_Factory(t) {
      return new (t || LeadersDashboardComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](src_app_core_services_superset_service__WEBPACK_IMPORTED_MODULE_2__.SupersetService), _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdirectiveInject"](_angular_cdk_layout__WEBPACK_IMPORTED_MODULE_4__.BreakpointObserver));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineComponent"]({
      type: LeadersDashboardComponent,
      selectors: [["app-leaders-dashboard"]],
      viewQuery: function LeadersDashboardComponent_Query(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵviewQuery"](_c0, 7);
        }
        if (rf & 2) {
          let _t;
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵqueryRefresh"](_t = _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵloadQuery"]()) && (ctx.mountPoint = _t.first);
        }
      },
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵStandaloneFeature"]],
      decls: 5,
      vars: 4,
      consts: [[1, "leaders-dashboard-wrapper"], ["class", "state-message", 4, "ngIf"], ["class", "state-message error", 4, "ngIf"], [1, "superset-mount"], ["mountPoint", ""], [1, "state-message"], [1, "spinner"], [1, "state-message", "error"]],
      template: function LeadersDashboardComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementStart"](0, "div", 0);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](1, LeadersDashboardComponent_div_1_Template, 3, 0, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵtemplate"](2, LeadersDashboardComponent_div_2_Template, 2, 1, "div", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelement"](3, "div", 3, 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵelementEnd"]();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵproperty"]("ngIf", ctx.error && !ctx.loading);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵclassProp"]("hidden", ctx.loading || ctx.error);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_5__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_5__.NgIf],
      styles: [".leaders-dashboard-wrapper[_ngcontent-%COMP%] {\n  width: 100%;\n}\n\n.superset-mount[_ngcontent-%COMP%] {\n  width: 100%;\n}\n.superset-mount.hidden[_ngcontent-%COMP%] {\n  display: none;\n}\n.superset-mount[_ngcontent-%COMP%]     iframe {\n  width: 100%;\n  border: none;\n  display: block;\n  min-height: calc(100vh - 120px);\n}\n\n.state-message[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 60px;\n  color: #666;\n  font-size: 16px;\n}\n.state-message.error[_ngcontent-%COMP%] {\n  color: #d32f2f;\n}\n\n.spinner[_ngcontent-%COMP%] {\n  width: 20px;\n  height: 20px;\n  border: 2px solid #ccc;\n  border-top-color: #1976d2;\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 0.8s linear infinite;\n}\n\n@keyframes _ngcontent-%COMP%_spin {\n  to {\n    transform: rotate(360deg);\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImxlYWRlcnMtZGFzaGJvYXJkLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0VBQ0UsV0FBQTtBQUNGOztBQUVBO0VBQ0UsV0FBQTtBQUNGO0FBQ0U7RUFDRSxhQUFBO0FBQ0o7QUFFRTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0EsY0FBQTtFQUNBLCtCQUFBO0FBQUo7O0FBSUE7RUFDRSxhQUFBO0VBQ0EsbUJBQUE7RUFDQSx1QkFBQTtFQUNBLFNBQUE7RUFDQSxhQUFBO0VBQ0EsV0FBQTtFQUNBLGVBQUE7QUFERjtBQUdFO0VBQ0UsY0FBQTtBQURKOztBQUtBO0VBQ0UsV0FBQTtFQUNBLFlBQUE7RUFDQSxzQkFBQTtFQUNBLHlCQUFBO0VBQ0Esa0JBQUE7RUFDQSxvQ0FBQTtBQUZGOztBQUtBO0VBQ0U7SUFBSyx5QkFBQTtFQURMO0FBQ0YiLCJmaWxlIjoibGVhZGVycy1kYXNoYm9hcmQuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIubGVhZGVycy1kYXNoYm9hcmQtd3JhcHBlciB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uc3VwZXJzZXQtbW91bnQge1xuICB3aWR0aDogMTAwJTtcblxuICAmLmhpZGRlbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuXG4gIDo6bmctZGVlcCBpZnJhbWUge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtaW4taGVpZ2h0OiBjYWxjKDEwMHZoIC0gMTIwcHgpO1xuICB9XG59XG5cbi5zdGF0ZS1tZXNzYWdlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGdhcDogMTJweDtcbiAgcGFkZGluZzogNjBweDtcbiAgY29sb3I6ICM2NjY7XG4gIGZvbnQtc2l6ZTogMTZweDtcblxuICAmLmVycm9yIHtcbiAgICBjb2xvcjogI2QzMmYyZjtcbiAgfVxufVxuXG4uc3Bpbm5lciB7XG4gIHdpZHRoOiAyMHB4O1xuICBoZWlnaHQ6IDIwcHg7XG4gIGJvcmRlcjogMnB4IHNvbGlkICNjY2M7XG4gIGJvcmRlci10b3AtY29sb3I6ICMxOTc2ZDI7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBzcGluIDAuOHMgbGluZWFyIGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIHNwaW4ge1xuICB0byB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH1cbn1cbiJdfQ== */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy9hZG1pbi9sZWFkZXJzLWRhc2hib2FyZC9sZWFkZXJzLWRhc2hib2FyZC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUNFLFdBQUE7QUFDRjs7QUFFQTtFQUNFLFdBQUE7QUFDRjtBQUNFO0VBQ0UsYUFBQTtBQUNKO0FBRUU7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGNBQUE7RUFDQSwrQkFBQTtBQUFKOztBQUlBO0VBQ0UsYUFBQTtFQUNBLG1CQUFBO0VBQ0EsdUJBQUE7RUFDQSxTQUFBO0VBQ0EsYUFBQTtFQUNBLFdBQUE7RUFDQSxlQUFBO0FBREY7QUFHRTtFQUNFLGNBQUE7QUFESjs7QUFLQTtFQUNFLFdBQUE7RUFDQSxZQUFBO0VBQ0Esc0JBQUE7RUFDQSx5QkFBQTtFQUNBLGtCQUFBO0VBQ0Esb0NBQUE7QUFGRjs7QUFLQTtFQUNFO0lBQUsseUJBQUE7RUFETDtBQUNGO0FBQ0EsZ2tEQUFna0QiLCJzb3VyY2VzQ29udGVudCI6WyIubGVhZGVycy1kYXNoYm9hcmQtd3JhcHBlciB7XG4gIHdpZHRoOiAxMDAlO1xufVxuXG4uc3VwZXJzZXQtbW91bnQge1xuICB3aWR0aDogMTAwJTtcblxuICAmLmhpZGRlbiB7XG4gICAgZGlzcGxheTogbm9uZTtcbiAgfVxuXG4gIDo6bmctZGVlcCBpZnJhbWUge1xuICAgIHdpZHRoOiAxMDAlO1xuICAgIGJvcmRlcjogbm9uZTtcbiAgICBkaXNwbGF5OiBibG9jaztcbiAgICBtaW4taGVpZ2h0OiBjYWxjKDEwMHZoIC0gMTIwcHgpO1xuICB9XG59XG5cbi5zdGF0ZS1tZXNzYWdlIHtcbiAgZGlzcGxheTogZmxleDtcbiAgYWxpZ24taXRlbXM6IGNlbnRlcjtcbiAganVzdGlmeS1jb250ZW50OiBjZW50ZXI7XG4gIGdhcDogMTJweDtcbiAgcGFkZGluZzogNjBweDtcbiAgY29sb3I6ICM2NjY7XG4gIGZvbnQtc2l6ZTogMTZweDtcblxuICAmLmVycm9yIHtcbiAgICBjb2xvcjogI2QzMmYyZjtcbiAgfVxufVxuXG4uc3Bpbm5lciB7XG4gIHdpZHRoOiAyMHB4O1xuICBoZWlnaHQ6IDIwcHg7XG4gIGJvcmRlcjogMnB4IHNvbGlkICNjY2M7XG4gIGJvcmRlci10b3AtY29sb3I6ICMxOTc2ZDI7XG4gIGJvcmRlci1yYWRpdXM6IDUwJTtcbiAgYW5pbWF0aW9uOiBzcGluIDAuOHMgbGluZWFyIGluZmluaXRlO1xufVxuXG5Aa2V5ZnJhbWVzIHNwaW4ge1xuICB0byB7IHRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_leaders-dashboard_leaders-dashboard_component_ts.46622f3acc2311af.js.map