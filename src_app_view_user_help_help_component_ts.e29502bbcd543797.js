"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_view_user_help_help_component_ts"],{

/***/ 90814:
/*!**************************************************!*\
  !*** ./src/app/view/user/help/help.component.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   HelpComponent: () => (/* binding */ HelpComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @ngx-translate/core */ 90852);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ 37580);
/* harmony import */ var src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! src/app/core/services/utility.service */ 8128);






function HelpComponent_article_18_Template(rf, ctx) {
  if (rf & 1) {
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "article", 5);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelement"](1, "iframe", 6);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](2, "p");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "translate");
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
  }
  if (rf & 2) {
    const video_r1 = ctx.$implicit;
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("src", video_r1.link, _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵsanitizeResourceUrl"]);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
    _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](4, 2, video_r1.title));
  }
}
class HelpComponent {
  constructor(utilityService) {
    this.utilityService = utilityService;
    this.isTelangana = (this.utilityService.loggedInUserData.school?.state || this.utilityService.loggedInUserData.profiles.admin?.state) === 'Telangana';
    this.videos = (this.isTelangana ? [['User Registration (Telugu)', 'https://youtu.be/DWhDVAWOWrE'], ['Edu Chatbot (Telugu)', 'https://youtu.be/hrqmDiH8f04'], ['Content Generation (Telugu)', 'https://youtu.be/T0v9EoG6iSc'], ['Lesson Plan explanation (Telugu)', 'https://youtu.be/UqNXHuBPskA'], ['Lesson Resources (Telugu)', 'https://youtu.be/Jft0FU_2j2M'], ['Question Paper Generation (Telugu)', 'https://youtu.be/i4v1B6KcSSk'], ['My Schedules (Telugu)', 'https://youtu.be/o3eiDeomKHo'], ['Dashboard Overview (Telugu)', 'https://youtu.be/2oDRVCRVGKM']] : [['User Registration', 'https://youtu.be/qsGd7vCfceo'], ['Content Generation', 'https://youtu.be/qlma8Ah08MY'], ['Learning Outcomes', 'https://youtu.be/1pSDq3UMFk4'], ['Lesson Resources', 'https://youtu.be/GgRNcouN7GU'], ['My Schedules', 'https://youtu.be/NoUajPGaoTE'], ['Dashboard Overview', 'https://youtu.be/cCSbQAAW3vo'], ['Chatbot Assistance', 'https://youtu.be/pVsWGb04Rrs'], ['Lesson Plan Regeneration', 'https://youtu.be/-v0IobwLfZs'], ['Question Paper Generation', 'https://youtu.be/CS7hr4j4w6Y']]).map(([title, url]) => ({
      title,
      link: this.utilityService.trustUrl(url)
    }));
  }
  static {
    this.ɵfac = function HelpComponent_Factory(t) {
      return new (t || HelpComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdirectiveInject"](src_app_core_services_utility_service__WEBPACK_IMPORTED_MODULE_0__.UtilityService));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵdefineComponent"]({
      type: HelpComponent,
      selectors: [["app-help"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵStandaloneFeature"]],
      decls: 19,
      vars: 17,
      consts: [[1, "help-container"], ["data-testid", "help-heading"], [1, "section-title"], [1, "video-grid"], ["data-testid", "help-video-card", 4, "ngFor", "ngForOf"], ["data-testid", "help-video-card"], ["height", "185", "title", "Video guide", "frameborder", "0", "data-testid", "help-video-iframe", "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share", "referrerpolicy", "strict-origin-when-cross-origin", "allowfullscreen", "", 3, "src"]],
      template: function HelpComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](0, "div", 0)(1, "header")(2, "h1", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](4, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](5, "p");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](6);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](7, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](8, "div", 2)(9, "span");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](10);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](11, "h2");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](12);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](13, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](14, "small");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtext"](15);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipe"](16, "translate");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementStart"](17, "div", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtemplate"](18, HelpComponent_article_18_Template, 5, 4, "article", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵelementEnd"]()();
        }
        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](4, 9, "Explore Our Video Guides"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate1"]("", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](7, 11, "Step-by-step videos to guide you through Shiksha copilot features and functionalities"), ".");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵclassProp"]("telugu", ctx.isTelangana);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](1);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](ctx.isTelangana ? "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41" : "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](2);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate"](_angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](13, 13, ctx.isTelangana ? "Telugu Videos" : "Videos"));
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵtextInterpolate2"]("", ctx.videos.length, " ", _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵpipeBind1"](16, 15, "videos"), "");
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵadvance"](3);
          _angular_core__WEBPACK_IMPORTED_MODULE_1__["ɵɵproperty"]("ngForOf", ctx.videos);
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_2__.CommonModule, _angular_common__WEBPACK_IMPORTED_MODULE_2__.NgForOf, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__.TranslateModule, _ngx_translate_core__WEBPACK_IMPORTED_MODULE_3__.TranslatePipe],
      styles: [".help-container[_ngcontent-%COMP%] {\n  padding: 2rem 2.5rem;\n  background: #f8f9fb;\n  min-height: 100vh;\n}\n\nheader[_ngcontent-%COMP%] {\n  border-left: 4px solid #6366f1;\n  padding-left: 1rem;\n  margin-bottom: 2.5rem;\n}\n\nh1[_ngcontent-%COMP%] {\n  font-size: 1.75rem;\n  font-weight: 700;\n  color: #111827;\n  margin: 0 0 0.4rem;\n}\n\nheader[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #6b7280;\n  margin: 0;\n}\n\n.section-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  margin-bottom: 1.25rem;\n}\n\n.section-title[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  color: #5b21b6;\n  background: #ede9fe;\n  border: 1px solid #c4b5fd;\n  border-radius: 1rem;\n  padding: 0.2rem 0.65rem;\n}\n\n.section-title[_ngcontent-%COMP%]   span.telugu[_ngcontent-%COMP%] {\n  color: #92400e;\n  background: #fef3c7;\n  border-color: #fcd34d;\n}\n\n.section-title[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  margin: 0;\n}\n\n.section-title[_ngcontent-%COMP%]   small[_ngcontent-%COMP%] {\n  margin-left: auto;\n  color: #9ca3af;\n}\n\n.video-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(3, minmax(0, 1fr));\n  gap: 1.25rem;\n}\n\narticle[_ngcontent-%COMP%] {\n  background: white;\n  border: 1px solid #e5e7eb;\n  border-radius: 0.75rem;\n  overflow: hidden;\n  transition: 0.2s;\n}\n\narticle[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.0901960784);\n  transform: translateY(-2px);\n}\n\niframe[_ngcontent-%COMP%] {\n  display: block;\n  width: 100%;\n  background: black;\n}\n\narticle[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  padding: 0.65rem 0.85rem;\n  text-align: center;\n  font-weight: 600;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  white-space: nowrap;\n}\n\n@media (max-width: 1023px) {\n  .video-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media (max-width: 767px) {\n  .help-container[_ngcontent-%COMP%] {\n    padding: 1.5rem 1rem;\n  }\n  .video-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n  }\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImhlbHAuY29tcG9uZW50LnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFBa0Isb0JBQUE7RUFBc0IsbUJBQUE7RUFBcUIsaUJBQUE7QUFJN0Q7O0FBSEE7RUFBUyw4QkFBQTtFQUFnQyxrQkFBQTtFQUFvQixxQkFBQTtBQVM3RDs7QUFSQTtFQUFLLGtCQUFBO0VBQW9CLGdCQUFBO0VBQWtCLGNBQUE7RUFBZ0Isa0JBQUE7QUFlM0Q7O0FBZEE7RUFBVyxjQUFBO0VBQWdCLFNBQUE7QUFtQjNCOztBQWxCQTtFQUFpQixhQUFBO0VBQWUsbUJBQUE7RUFBcUIsWUFBQTtFQUFhLHNCQUFBO0FBeUJsRTs7QUF4QkE7RUFBc0IsY0FBQTtFQUFnQixtQkFBQTtFQUFxQix5QkFBQTtFQUEyQixtQkFBQTtFQUFxQix1QkFBQTtBQWdDM0c7O0FBL0JBO0VBQTZCLGNBQUE7RUFBZ0IsbUJBQUE7RUFBcUIscUJBQUE7QUFxQ2xFOztBQXBDQTtFQUFvQixlQUFBO0VBQWlCLGdCQUFBO0VBQWtCLFNBQUE7QUEwQ3ZEOztBQXpDQTtFQUF1QixpQkFBQTtFQUFtQixjQUFBO0FBOEMxQzs7QUE3Q0E7RUFBYyxhQUFBO0VBQWUsZ0RBQUE7RUFBa0QsWUFBQTtBQW1EL0U7O0FBbERBO0VBQVUsaUJBQUE7RUFBbUIseUJBQUE7RUFBMkIsc0JBQUE7RUFBdUIsZ0JBQUE7RUFBa0IsZ0JBQUE7QUEwRGpHOztBQXpEQTtFQUFnQixrREFBQTtFQUFrQywyQkFBQTtBQThEbEQ7O0FBN0RBO0VBQVMsY0FBQTtFQUFnQixXQUFBO0VBQWEsaUJBQUE7QUFtRXRDOztBQWxFQTtFQUFZLFNBQUE7RUFBVyx3QkFBQTtFQUF3QixrQkFBQTtFQUFvQixnQkFBQTtFQUFrQixnQkFBQTtFQUFrQix1QkFBQTtFQUF5QixtQkFBQTtBQTRFaEk7O0FBM0VBO0VBQTZCO0lBQWMsZ0RBQUE7RUFnRnpDO0FBQ0Y7QUFoRkE7RUFBNEI7SUFBa0Isb0JBQUE7RUFvRjVDO0VBcEZvRTtJQUFjLDBCQUFBO0VBdUZsRjtBQUNGIiwiZmlsZSI6ImhlbHAuY29tcG9uZW50LnNjc3MiLCJzb3VyY2VzQ29udGVudCI6WyIuaGVscC1jb250YWluZXIgeyBwYWRkaW5nOiAycmVtIDIuNXJlbTsgYmFja2dyb3VuZDogI2Y4ZjlmYjsgbWluLWhlaWdodDogMTAwdmg7IH1cbmhlYWRlciB7IGJvcmRlci1sZWZ0OiA0cHggc29saWQgIzYzNjZmMTsgcGFkZGluZy1sZWZ0OiAxcmVtOyBtYXJnaW4tYm90dG9tOiAyLjVyZW07IH1cbmgxIHsgZm9udC1zaXplOiAxLjc1cmVtOyBmb250LXdlaWdodDogNzAwOyBjb2xvcjogIzExMTgyNzsgbWFyZ2luOiAwIDAgLjRyZW07IH1cbmhlYWRlciBwIHsgY29sb3I6ICM2YjcyODA7IG1hcmdpbjogMDsgfVxuLnNlY3Rpb24tdGl0bGUgeyBkaXNwbGF5OiBmbGV4OyBhbGlnbi1pdGVtczogY2VudGVyOyBnYXA6IC43NXJlbTsgbWFyZ2luLWJvdHRvbTogMS4yNXJlbTsgfVxuLnNlY3Rpb24tdGl0bGUgc3BhbiB7IGNvbG9yOiAjNWIyMWI2OyBiYWNrZ3JvdW5kOiAjZWRlOWZlOyBib3JkZXI6IDFweCBzb2xpZCAjYzRiNWZkOyBib3JkZXItcmFkaXVzOiAxcmVtOyBwYWRkaW5nOiAuMnJlbSAuNjVyZW07IH1cbi5zZWN0aW9uLXRpdGxlIHNwYW4udGVsdWd1IHsgY29sb3I6ICM5MjQwMGU7IGJhY2tncm91bmQ6ICNmZWYzYzc7IGJvcmRlci1jb2xvcjogI2ZjZDM0ZDsgfVxuLnNlY3Rpb24tdGl0bGUgaDIgeyBmb250LXNpemU6IDFyZW07IGZvbnQtd2VpZ2h0OiA2MDA7IG1hcmdpbjogMDsgfVxuLnNlY3Rpb24tdGl0bGUgc21hbGwgeyBtYXJnaW4tbGVmdDogYXV0bzsgY29sb3I6ICM5Y2EzYWY7IH1cbi52aWRlby1ncmlkIHsgZGlzcGxheTogZ3JpZDsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiByZXBlYXQoMywgbWlubWF4KDAsIDFmcikpOyBnYXA6IDEuMjVyZW07IH1cbmFydGljbGUgeyBiYWNrZ3JvdW5kOiB3aGl0ZTsgYm9yZGVyOiAxcHggc29saWQgI2U1ZTdlYjsgYm9yZGVyLXJhZGl1czogLjc1cmVtOyBvdmVyZmxvdzogaGlkZGVuOyB0cmFuc2l0aW9uOiAuMnM7IH1cbmFydGljbGU6aG92ZXIgeyBib3gtc2hhZG93OiAwIDhweCAyNHB4ICMwMDAwMDAxNzsgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0ycHgpOyB9XG5pZnJhbWUgeyBkaXNwbGF5OiBibG9jazsgd2lkdGg6IDEwMCU7IGJhY2tncm91bmQ6IGJsYWNrOyB9XG5hcnRpY2xlIHAgeyBtYXJnaW46IDA7IHBhZGRpbmc6IC42NXJlbSAuODVyZW07IHRleHQtYWxpZ246IGNlbnRlcjsgZm9udC13ZWlnaHQ6IDYwMDsgb3ZlcmZsb3c6IGhpZGRlbjsgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7IHdoaXRlLXNwYWNlOiBub3dyYXA7IH1cbkBtZWRpYSAobWF4LXdpZHRoOiAxMDIzcHgpIHsgLnZpZGVvLWdyaWQgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgyLCBtaW5tYXgoMCwgMWZyKSk7IH0gfVxuQG1lZGlhIChtYXgtd2lkdGg6IDc2N3B4KSB7IC5oZWxwLWNvbnRhaW5lciB7IHBhZGRpbmc6IDEuNXJlbSAxcmVtOyB9IC52aWRlby1ncmlkIHsgZ3JpZC10ZW1wbGF0ZS1jb2x1bW5zOiAxZnI7IH0gfVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvdmlldy91c2VyL2hlbHAvaGVscC5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtFQUFrQixvQkFBQTtFQUFzQixtQkFBQTtFQUFxQixpQkFBQTtBQUk3RDs7QUFIQTtFQUFTLDhCQUFBO0VBQWdDLGtCQUFBO0VBQW9CLHFCQUFBO0FBUzdEOztBQVJBO0VBQUssa0JBQUE7RUFBb0IsZ0JBQUE7RUFBa0IsY0FBQTtFQUFnQixrQkFBQTtBQWUzRDs7QUFkQTtFQUFXLGNBQUE7RUFBZ0IsU0FBQTtBQW1CM0I7O0FBbEJBO0VBQWlCLGFBQUE7RUFBZSxtQkFBQTtFQUFxQixZQUFBO0VBQWEsc0JBQUE7QUF5QmxFOztBQXhCQTtFQUFzQixjQUFBO0VBQWdCLG1CQUFBO0VBQXFCLHlCQUFBO0VBQTJCLG1CQUFBO0VBQXFCLHVCQUFBO0FBZ0MzRzs7QUEvQkE7RUFBNkIsY0FBQTtFQUFnQixtQkFBQTtFQUFxQixxQkFBQTtBQXFDbEU7O0FBcENBO0VBQW9CLGVBQUE7RUFBaUIsZ0JBQUE7RUFBa0IsU0FBQTtBQTBDdkQ7O0FBekNBO0VBQXVCLGlCQUFBO0VBQW1CLGNBQUE7QUE4QzFDOztBQTdDQTtFQUFjLGFBQUE7RUFBZSxnREFBQTtFQUFrRCxZQUFBO0FBbUQvRTs7QUFsREE7RUFBVSxpQkFBQTtFQUFtQix5QkFBQTtFQUEyQixzQkFBQTtFQUF1QixnQkFBQTtFQUFrQixnQkFBQTtBQTBEakc7O0FBekRBO0VBQWdCLGtEQUFBO0VBQWtDLDJCQUFBO0FBOERsRDs7QUE3REE7RUFBUyxjQUFBO0VBQWdCLFdBQUE7RUFBYSxpQkFBQTtBQW1FdEM7O0FBbEVBO0VBQVksU0FBQTtFQUFXLHdCQUFBO0VBQXdCLGtCQUFBO0VBQW9CLGdCQUFBO0VBQWtCLGdCQUFBO0VBQWtCLHVCQUFBO0VBQXlCLG1CQUFBO0FBNEVoSTs7QUEzRUE7RUFBNkI7SUFBYyxnREFBQTtFQWdGekM7QUFDRjtBQWhGQTtFQUE0QjtJQUFrQixvQkFBQTtFQW9GNUM7RUFwRm9FO0lBQWMsMEJBQUE7RUF1RmxGO0FBQ0Y7QUFDQSw0dEdBQTR0RyIsInNvdXJjZXNDb250ZW50IjpbIi5oZWxwLWNvbnRhaW5lciB7IHBhZGRpbmc6IDJyZW0gMi41cmVtOyBiYWNrZ3JvdW5kOiAjZjhmOWZiOyBtaW4taGVpZ2h0OiAxMDB2aDsgfVxuaGVhZGVyIHsgYm9yZGVyLWxlZnQ6IDRweCBzb2xpZCAjNjM2NmYxOyBwYWRkaW5nLWxlZnQ6IDFyZW07IG1hcmdpbi1ib3R0b206IDIuNXJlbTsgfVxuaDEgeyBmb250LXNpemU6IDEuNzVyZW07IGZvbnQtd2VpZ2h0OiA3MDA7IGNvbG9yOiAjMTExODI3OyBtYXJnaW46IDAgMCAuNHJlbTsgfVxuaGVhZGVyIHAgeyBjb2xvcjogIzZiNzI4MDsgbWFyZ2luOiAwOyB9XG4uc2VjdGlvbi10aXRsZSB7IGRpc3BsYXk6IGZsZXg7IGFsaWduLWl0ZW1zOiBjZW50ZXI7IGdhcDogLjc1cmVtOyBtYXJnaW4tYm90dG9tOiAxLjI1cmVtOyB9XG4uc2VjdGlvbi10aXRsZSBzcGFuIHsgY29sb3I6ICM1YjIxYjY7IGJhY2tncm91bmQ6ICNlZGU5ZmU7IGJvcmRlcjogMXB4IHNvbGlkICNjNGI1ZmQ7IGJvcmRlci1yYWRpdXM6IDFyZW07IHBhZGRpbmc6IC4ycmVtIC42NXJlbTsgfVxuLnNlY3Rpb24tdGl0bGUgc3Bhbi50ZWx1Z3UgeyBjb2xvcjogIzkyNDAwZTsgYmFja2dyb3VuZDogI2ZlZjNjNzsgYm9yZGVyLWNvbG9yOiAjZmNkMzRkOyB9XG4uc2VjdGlvbi10aXRsZSBoMiB7IGZvbnQtc2l6ZTogMXJlbTsgZm9udC13ZWlnaHQ6IDYwMDsgbWFyZ2luOiAwOyB9XG4uc2VjdGlvbi10aXRsZSBzbWFsbCB7IG1hcmdpbi1sZWZ0OiBhdXRvOyBjb2xvcjogIzljYTNhZjsgfVxuLnZpZGVvLWdyaWQgeyBkaXNwbGF5OiBncmlkOyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IHJlcGVhdCgzLCBtaW5tYXgoMCwgMWZyKSk7IGdhcDogMS4yNXJlbTsgfVxuYXJ0aWNsZSB7IGJhY2tncm91bmQ6IHdoaXRlOyBib3JkZXI6IDFweCBzb2xpZCAjZTVlN2ViOyBib3JkZXItcmFkaXVzOiAuNzVyZW07IG92ZXJmbG93OiBoaWRkZW47IHRyYW5zaXRpb246IC4yczsgfVxuYXJ0aWNsZTpob3ZlciB7IGJveC1zaGFkb3c6IDAgOHB4IDI0cHggIzAwMDAwMDE3OyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVkoLTJweCk7IH1cbmlmcmFtZSB7IGRpc3BsYXk6IGJsb2NrOyB3aWR0aDogMTAwJTsgYmFja2dyb3VuZDogYmxhY2s7IH1cbmFydGljbGUgcCB7IG1hcmdpbjogMDsgcGFkZGluZzogLjY1cmVtIC44NXJlbTsgdGV4dC1hbGlnbjogY2VudGVyOyBmb250LXdlaWdodDogNjAwOyBvdmVyZmxvdzogaGlkZGVuOyB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpczsgd2hpdGUtc3BhY2U6IG5vd3JhcDsgfVxuQG1lZGlhIChtYXgtd2lkdGg6IDEwMjNweCkgeyAudmlkZW8tZ3JpZCB7IGdyaWQtdGVtcGxhdGUtY29sdW1uczogcmVwZWF0KDIsIG1pbm1heCgwLCAxZnIpKTsgfSB9XG5AbWVkaWEgKG1heC13aWR0aDogNzY3cHgpIHsgLmhlbHAtY29udGFpbmVyIHsgcGFkZGluZzogMS41cmVtIDFyZW07IH0gLnZpZGVvLWdyaWQgeyBncmlkLXRlbXBsYXRlLWNvbHVtbnM6IDFmcjsgfSB9XG4iXSwic291cmNlUm9vdCI6IiJ9 */"]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_view_user_help_help_component_ts.e29502bbcd543797.js.map