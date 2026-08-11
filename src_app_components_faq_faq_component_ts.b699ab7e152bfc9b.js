"use strict";
(self["webpackChunkshiksha_frontend"] = self["webpackChunkshiksha_frontend"] || []).push([["src_app_components_faq_faq_component_ts"],{

/***/ 59613:
/*!*************************************************!*\
  !*** ./src/app/components/faq/faq.component.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FaqComponent: () => (/* binding */ FaqComponent)
/* harmony export */ });
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/common */ 60316);
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @angular/core */ 37580);



class FaqComponent {
  /**
   * Class constructor
   * @param location Location
   */
  constructor(location) {
    this.location = location;
  }
  /**
   * method to navigate back
   */
  goBack() {
    this.location.back();
  }
  static {
    this.ɵfac = function FaqComponent_Factory(t) {
      return new (t || FaqComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_common__WEBPACK_IMPORTED_MODULE_1__.Location));
    };
  }
  static {
    this.ɵcmp = /*@__PURE__*/_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: FaqComponent,
      selectors: [["app-faq"]],
      standalone: true,
      features: [_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵStandaloneFeature"]],
      decls: 64,
      vars: 0,
      consts: [[1, "fixed", "bg-shade-50", "w-full", "h-12", "faq-header"], [1, "flex", "items-center", "gap-4", "mt-3", "ml-3"], ["type", "button", "aria-label", "Go back", 1, "flex", "items-center", "bg-transparent", "border-0", "p-0", "cursor-pointer", 3, "click"], ["src", "assets/icons/back-arrow.svg", "alt", ""], ["src", "assets/images/logo.svg", "alt", "", 1, "logo"], ["id", "main-content", "tabindex", "-1", 1, "faq-wrapper", "p-4"], [1, "flex", "justify-center"], [1, "w-[90%]", "md:w-1/2"], [1, "mt-16", "mb-8", "text-4xl", "text-center", "text-content"], [1, "mt-8"], [1, "font-bold", "text-primary"], [1, "list-disc"], [1, "list-item"], [1, "mt-8", "mb-8"]],
      template: function FaqComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "header", 0)(1, "div", 1)(2, "button", 2);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FaqComponent_Template_button_click_2_listener() {
            return ctx.goBack();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](4, "img", 4);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](5, "main", 5)(6, "div", 6)(7, "div", 7)(8, "h1", 8);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](9, "FAQ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "div", 9)(11, "h2", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](12, "What is Shiksha copilot?");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "ul", 11)(14, "li", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](15, " Shiksha copilot is a part of project VELLM (universal empowerment with LLMs) from Microsoft Research India. It is a copilot experience built for teachers (through webapp/ telegram) to create their own lesson plans and learning experiences for next classes that they would be teaching using this copilot. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](17, " As a teacher, you can select the curriculum that you are teaching, the grade, the subject and chapter that you would like to teach in your next classes and build engaging learning experiences for teaching in the class. This includes real world examples, analogies, hands on activities, assessments etc. Once these engaging learning experiences are generated, the teacher can validate the content. Shiksha copilot then automatically creates deliverables like lesson plant document, presentation and student handout using this validated lesson plan. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](18, "div", 9)(19, "h2", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, "What can Shiksha copilot do?");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "ul", 11)(22, "li", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](23, " Shiksha copilot plays the role of a virtual assistant to teachers. It assists the teacher by creating more engaging and personalized experiences, driven by learning outcomes thus reducing manual effort and expediating the content creation process. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](24, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](25, " The teachers can create many engaging learning experiences like hands-on-activities, assessments, real-world examples or analogies etc. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](26, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](27, " Once the teachers create the lesson plans, the content would be available in docx and ppt format to be directly consumed in their classroom. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](28, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](29, " Teachers can also interact with in chat in a free-flowing conversation to ask questions or generate new learning experiences. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](30, "div", 9)(31, "h2", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](32, " What is/are Shiksha copilot's intended use(s)? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](33, "ul", 11)(34, "li", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](35, " Shiksha copilot's intended use is working with teachers and empowering teachers across the globe to generate personalized and engaging learning experiences unique to their students' needs, thereby improving the overall learning outcomes. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](36, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](37, " Working with Microsoft Research, India Sikshana Foundation is piloting Shiksha copilot with thousand teachers to understand the usability of such a copilot for teachers and get the feedback to improve the Shiksha copilot prototype. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](38, "div", 9)(39, "h2", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](40, " How was Shiksha copilot evaluated? What metrics are used to measure performance? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](41, "ul", 11)(42, "li", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](43, " Microsoft Research has performed a qualitative analysis to evaluate the quality of the Shiksha copilot system using the internal testing team and received early feedback from Sikshana Foundation. To measure any possible harms through the system, they have performed two rounds of red teaming. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](44, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](45, " Microsoft Research actively performs automatic content moderation on content generated by (and input to) the Shiksha copilot using Azure Content Filtering. Meta prompts are used for providing guidelines to the copilot to generated education related content only and generate the content that is unbased and respectful. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](46, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](47, " Microsoft Research also monitors the system responses through anonymous telemetry to identify ongoing issues with the system and makes periodic improvements. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](48, "div", 9)(49, "h2", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](50, " What are the limitations of Shiksha copilot? How can users minimize the impact of Shiksha copilot's limitations when using the system? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](51, "ul", 11)(52, "li", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](53, " Shiksha copilot generates the content using AI. The AI generated content may have some errors rarely. So, the users of Shiksha copilot should validate the content before using this content in their classrooms. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](54, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](55, " The AI systems used in Shiksha copilot are capable of generating text in languages other than English, but performance for non-English languages needs to be assessed and improved for Shiksha copilot. Shiksha copilot users are requested to provide feedback on specific issues that they see during the pilot deployment. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](56, "div", 13)(57, "h2", 10);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](58, " What operational factors and settings allow for effective and responsible use of Shiksha copilot? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](59, "ul", 11)(60, "li", 12);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](61, " Shiksha copilot is best used in English language where we have evaluated and applied quality measures and harm mitigations. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](62, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](63, " Shiksha is deployed with human experts like teachers in the loop. So, the teachers should evaluate and validate AI generated responses before delivering the content eventually. This also provides continuous anonymized feedback to improvise the system. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()()()()();
        }
      },
      dependencies: [_angular_common__WEBPACK_IMPORTED_MODULE_1__.CommonModule],
      styles: [".faq-header[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%] {\n  width: min(150px, 50%);\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZhcS5jb21wb25lbnQuc2NzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDRTtFQUNFLHNCQUFBO0FBQUoiLCJmaWxlIjoiZmFxLmNvbXBvbmVudC5zY3NzIiwic291cmNlc0NvbnRlbnQiOlsiLmZhcS1oZWFkZXIge1xuICAubG9nbyB7XG4gICAgd2lkdGg6IG1pbigxNTBweCwgNTAlKTtcbiAgfVxufVxuIl19 */\n/*# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8uL3NyYy9hcHAvY29tcG9uZW50cy9mYXEvZmFxLmNvbXBvbmVudC5zY3NzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNFO0VBQ0Usc0JBQUE7QUFBSjtBQUNBLG9VQUFvVSIsInNvdXJjZXNDb250ZW50IjpbIi5mYXEtaGVhZGVyIHtcbiAgLmxvZ28ge1xuICAgIHdpZHRoOiBtaW4oMTUwcHgsIDUwJSk7XG4gIH1cbn1cbiJdLCJzb3VyY2VSb290IjoiIn0= */"]
    });
  }
}

/***/ })

}]);
//# sourceMappingURL=src_app_components_faq_faq_component_ts.b699ab7e152bfc9b.js.map