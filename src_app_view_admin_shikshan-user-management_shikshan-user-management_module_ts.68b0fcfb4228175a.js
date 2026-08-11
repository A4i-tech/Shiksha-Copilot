"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_admin_shikshan-user-management_shikshan-user-management_module_ts"],{

/***/ 59242:
/*!************************************************************************************************!*\
  !*** ./src/app/view/admin/shikshan-user-management/shikshan-user-management-routing.module.ts ***!
  \************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ShikshanUserManagementRoutingModule: () => (/* binding */ ShikshanUserManagementRoutingModule)
/* harmony export */ });
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/router */ 95072);
/* harmony import */ var src_app_shared_components_user_staff_list_user_staff_list_component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/shared/components/user-staff-list/user-staff-list.component */ 74333);
/* harmony import */ var src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/core/guards/permission.guard */ 83811);
/* harmony import */ var src_app_shared_components_user_manage_user_manage_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! src/app/shared/components/user-manage/user-manage.component */ 30293);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ 37580);






const routes = [{
  path: '',
  redirectTo: 'list',
  pathMatch: 'full'
}, {
  path: 'list',
  component: src_app_shared_components_user_staff_list_user_staff_list_component__WEBPACK_IMPORTED_MODULE_0__.UserStaffListComponent,
  data: {
    idleTracking: 'custom'
  }
}, {
  path: 'add',
  component: src_app_shared_components_user_manage_user_manage_component__WEBPACK_IMPORTED_MODULE_2__.UserManageComponent,
  data: {
    permissions: ['user.create'],
    teacherForm: false,
    idleTracking: 'custom'
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard]
}, {
  path: ':id',
  component: src_app_shared_components_user_manage_user_manage_component__WEBPACK_IMPORTED_MODULE_2__.UserManageComponent,
  data: {
    permissions: ['user.view'],
    teacherForm: false,
    idleTracking: 'custom'
  },
  canActivate: [src_app_core_guards_permission_guard__WEBPACK_IMPORTED_MODULE_1__.PermissionGuard]
}];
class ShikshanUserManagementRoutingModule {
  static {
    this.ɵfac = function ShikshanUserManagementRoutingModule_Factory(t) {
      return new (t || ShikshanUserManagementRoutingModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineNgModule"]({
      type: ShikshanUserManagementRoutingModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵdefineInjector"]({
      imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule.forChild(routes), _angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_3__["ɵɵsetNgModuleScope"](ShikshanUserManagementRoutingModule, {
    imports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule],
    exports: [_angular_router__WEBPACK_IMPORTED_MODULE_4__.RouterModule]
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
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _shikshan_user_management_routing_module__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./shikshan-user-management-routing.module */ 59242);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var src_app_shared_components_user_manage_user_manage_component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! src/app/shared/components/user-manage/user-manage.component */ 30293);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/core */ 37580);





class ShikshanUserManagementModule {
  static {
    this.ɵfac = function ShikshanUserManagementModule_Factory(t) {
      return new (t || ShikshanUserManagementModule)();
    };
  }
  static {
    this.ɵmod = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineNgModule"]({
      type: ShikshanUserManagementModule
    });
  }
  static {
    this.ɵinj = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵdefineInjector"]({
      imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _shikshan_user_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.ShikshanUserManagementRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule, src_app_shared_components_user_manage_user_manage_component__WEBPACK_IMPORTED_MODULE_1__.UserManageComponent]
    });
  }
}
(function () {
  (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_2__["ɵɵsetNgModuleScope"](ShikshanUserManagementModule, {
    imports: [_angular_common__WEBPACK_IMPORTED_MODULE_3__.CommonModule, _shikshan_user_management_routing_module__WEBPACK_IMPORTED_MODULE_0__.ShikshanUserManagementRoutingModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_4__.TranslateModule, src_app_shared_components_user_manage_user_manage_component__WEBPACK_IMPORTED_MODULE_1__.UserManageComponent]
  });
})();

/***/ })

}]);
//# sourceMappingURL=src_app_view_admin_shikshan-user-management_shikshan-user-management_module_ts.68b0fcfb4228175a.js.map