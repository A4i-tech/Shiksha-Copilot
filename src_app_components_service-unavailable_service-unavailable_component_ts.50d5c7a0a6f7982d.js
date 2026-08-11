"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_components_service-unavailable_service-unavailable_component_ts"],{

/***/ 87045:
/*!*********************************************************************************!*\
  !*** ./src/app/components/service-unavailable/service-unavailable.component.ts ***!
  \*********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ServiceUnavailableComponent: () => (/* binding */ ServiceUnavailableComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/router */ 95072);



class ServiceUnavailableComponent {
  constructor(router) {
    this.router = router;
  }
  retry() {
    this.router.navigateByUrl('/');
  }
  static {
    this.ɵfac = function ServiceUnavailableComponent_Factory(t) {
      return new (t || ServiceUnavailableComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_1__.Router));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: ServiceUnavailableComponent,
      selectors: [["app-service-unavailable"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 13,
      vars: 0,
      consts: [[1, "fixed", "bg-shade-50", "w-full", "h-12", "service-unavailable-header"], [1, "flex", "items-center", "gap-4", "mt-3", "ml-3"], ["src", "assets/images/logo.svg", "alt", "", 1, "logo"], ["id", "main-content", "tabindex", "-1", 1, "service-unavailable-wrapper", "p-4", "min-h-screen", "flex", "items-center", "justify-center"], [1, "w-[90%]", "md:w-1/2", "text-center"], [1, "text-4xl", "text-content", "mb-4"], [1, "font-bold", "text-primary", "mb-4"], [1, "text-content-70", "mb-8"], ["type", "button", 1, "px-6", "py-4", "bg-primary", "text-white", "rounded", 3, "click"]],
      template: function ServiceUnavailableComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "header", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](3, "main", 3)(4, "div", 4)(5, "h1", 5);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](6, "503");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "h2", 6);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "Service Unavailable");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "p", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](10, " We're having trouble reaching our servers right now. Please check again after some time. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](11, "button", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function ServiceUnavailableComponent_Template_button_click_11_listener() {
            return ctx.retry();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, " Retry ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule],
      styles: [".service-unavailable-header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {\n  width: min(150px, 50%);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNlcnZpY2UtdW5hdmFpbGFibGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFDRSxzQkFBQTtBQUFKIiwiZmlsZSI6InNlcnZpY2UtdW5hdmFpbGFibGUuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuc2VydmljZS11bmF2YWlsYWJsZS1oZWFkZXIge1xuICAubG9nbyB7XG4gICAgd2lkdGg6IG1pbigxNTBweCwgNTAlKTtcbiAgfVxufVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy9zZXJ2aWNlLXVuYXZhaWxhYmxlL3NlcnZpY2UtdW5hdmFpbGFibGUuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQ0U7RUFDRSxzQkFBQTtBQUFKO0FBQ0Esb1lBQW9ZIiwic291cmNlc0NvbnRlbnQiOlsiLnNlcnZpY2UtdW5hdmFpbGFibGUtaGVhZGVyIHtcbiAgLmxvZ28ge1xuICAgIHdpZHRoOiBtaW4oMTUwcHgsIDUwJSk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_components_service-unavailable_service-unavailable_component_ts.50d5c7a0a6f7982d.js.map