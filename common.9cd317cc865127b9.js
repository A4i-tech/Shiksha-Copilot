(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["common"],{

/***/ 41883:
/*!***************************************************!*\
  !*** ./src/app/layout/sidebar/sidebar.service.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SidebarService: () => (/* binding */ SidebarService)
/* harmony export */ });
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);



class SidebarService {
  constructor() {
    this.util = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.inject)(src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__.UtilityService);
    this.profileImg = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(this.util.loggedInUserData?.profileImage || '');
    this.sidebarOpen = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
    this.headerOptionShow = (0,_angular_core__WEBPACK_IMPORTED_MODULE_1__.signal)(false);
  }
  static {
    this.ɵfac = function SidebarService_Factory(t) {
      return new (t || SidebarService)();
    };
  }
  static {
    this.ɵprov = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineInjectable"]({
      token: SidebarService,
      factory: SidebarService.ɵfac,
      providedIn: 'root'
    });
  }
}

/***/ }),

/***/ 29066:
/*!***************************************************!*\
  !*** ./src/app/shared/utility/animations.util.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   containerAnimation: () => (/* binding */ containerAnimation),
/* harmony export */   fadeInOutAnimation: () => (/* binding */ fadeInOutAnimation),
/* harmony export */   listAnimation: () => (/* binding */ listAnimation),
/* harmony export */   scaleAnimation: () => (/* binding */ scaleAnimation),
/* harmony export */   slideInOutAnimation: () => (/* binding */ slideInOutAnimation),
/* harmony export */   slideLeftRightAnimation: () => (/* binding */ slideLeftRightAnimation),
/* harmony export */   stepperAnimations: () => (/* binding */ stepperAnimations)
/* harmony export */ });
/* harmony import */ var _angular_animations__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/animations */ 47172);

const fadeInOutAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('fadeInOut', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 0
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 1
}))]), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':leave', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 0
}))])]);
const slideInOutAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('slideInOut', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateY(-100%)',
  opacity: 0
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms ease-out', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateY(0)',
  opacity: 1
}))]), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':leave', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms ease-in', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateY(-100%)',
  opacity: 0
}))])]);
const slideLeftRightAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('slideLeftRight', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(-100%)',
  opacity: 0
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms ease-in', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(0)',
  opacity: 1
}))]), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':leave', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms ease-out', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(-100%)',
  opacity: 0
}))])]);
const containerAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('containerAnimation', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(-100%)',
  opacity: 0
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms ease-in', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(0)',
  opacity: 1
}))]), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':leave', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('1800ms ease-out', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(-100%)',
  opacity: 0
}))])]);
const listAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('listAnimation', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)('* => *', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.query)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 0,
  transform: 'translateY(-20px)'
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.stagger)('100ms', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('400ms ease-out', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 1,
  transform: 'none'
})))], {
  optional: true
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.query)(':leave', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.stagger)('50ms', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms ease-in', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.keyframes)([(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 1,
  transform: 'none',
  offset: 0
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  opacity: 0,
  transform: 'translateY(-10px)',
  offset: 1
})])))], {
  optional: true
})])]);
const scaleAnimation = (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('scale', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':enter', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'scale(0.5)',
  opacity: 0
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms cubic-bezier(.8, -0.6, 0.2, 1.5)', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'scale(1)',
  opacity: 1
}))]), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)(':leave', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms cubic-bezier(.8, -0.6, 0.2, 1.5)', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'scale(0.5)',
  opacity: 0
}))])]);
const stepperAnimations = [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.trigger)('stepperAnimation', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)('forward => *', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(0)'
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms ease-out', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(-100%)'
}))]), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.transition)('backward => *', [(0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(0)'
}), (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.animate)('300ms ease-in', (0,_angular_animations__WEBPACK_IMPORTED_MODULE_0__.style)({
  transform: 'translateX(100%)'
}))])])];

/***/ }),

/***/ 43143:
/*!******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm/internal/operators/toArray.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toArray: () => (/* binding */ toArray)
/* harmony export */ });
/* harmony import */ var _reduce__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reduce */ 49923);
/* harmony import */ var _util_lift__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/lift */ 50819);


const arrReducer = (arr, value) => (arr.push(value), arr);
function toArray() {
  return (0,_util_lift__WEBPACK_IMPORTED_MODULE_0__.operate)((source, subscriber) => {
    (0,_reduce__WEBPACK_IMPORTED_MODULE_1__.reduce)(arrReducer, [])(source).subscribe(subscriber);
  });
}

/***/ }),

/***/ 95386:
/*!*****************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/asyncToGenerator.js ***!
  \*****************************************************************/
/***/ ((module) => {

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
      args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
module.exports = _asyncToGenerator, module.exports.__esModule = true, module.exports["default"] = module.exports;

/***/ })

}]);
//# sourceMappingURL=common.9cd317cc865127b9.js.map