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
      decls: 63,
      vars: 0,
      consts: [[1, "fixed", "bg-shade-50", "w-full", "h-12", "faq-header"], [1, "flex", "items-center", "gap-4", "mt-3", "ml-3", 3, "click"], ["src", "assets/icons/back-arrow.svg", "alt", "", 1, "cursor-pointer"], ["src", "assets/images/logo.svg", "alt", "", 1, "logo"], [1, "faq-wrapper", "p-4"], [1, "flex", "justify-center"], [1, "w-[90%]", "md:w-1/2"], [1, "mt-16", "mb-8", "text-4xl", "text-center", "text-content"], [1, "mt-8"], [1, "font-bold", "text-primary"], [1, "list-disc"], [1, "list-item"], [1, "mt-8", "mb-8"]],
      template: function FaqComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0)(1, "div", 1);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function FaqComponent_Template_div_click_1_listener() {
            return ctx.goBack();
          });
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](2, "img", 2)(3, "img", 3);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "div", 4)(5, "div", 5)(6, "div", 6)(7, "h1", 7);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](8, "FAQ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 8)(10, "h2", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "What is Shiksha copilot?");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "ul", 10)(13, "li", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](14, " Shiksha copilot is a part of project VELLM (universal empowerment with LLMs) from Microsoft Research India. It is a copilot experience built for teachers (through webapp/ telegram) to create their own lesson plans and learning experiences for next classes that they would be teaching using this copilot. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](16, " As a teacher, you can select the curriculum that you are teaching, the grade, the subject and chapter that you would like to teach in your next classes and build engaging learning experiences for teaching in the class. This includes real world examples, analogies, hands on activities, assessments etc. Once these engaging learning experiences are generated, the teacher can validate the content. Shiksha copilot then automatically creates deliverables like lesson plant document, presentation and student handout using this validated lesson plan. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 8)(18, "h2", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](19, "What can Shiksha copilot do?");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](20, "ul", 10)(21, "li", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, " Shiksha copilot plays the role of a virtual assistant to teachers. It assists the teacher by creating more engaging and personalized experiences, driven by learning outcomes thus reducing manual effort and expediating the content creation process. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](23, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](24, " The teachers can create many engaging learning experiences like hands-on-activities, assessments, real-world examples or analogies etc. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](25, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](26, " Once the teachers create the lesson plans, the content would be available in docx and ppt format to be directly consumed in their classroom. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](27, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](28, " Teachers can also interact with in chat in a free-flowing conversation to ask questions or generate new learning experiences. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](29, "div", 8)(30, "h2", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](31, " What is/are Shiksha copilot's intended use(s)? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](32, "ul", 10)(33, "li", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](34, " Shiksha copilot's intended use is working with teachers and empowering teachers across the globe to generate personalized and engaging learning experiences unique to their students' needs, thereby improving the overall learning outcomes. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](35, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](36, " Working with Microsoft Research, India Sikshana Foundation is piloting Shiksha copilot with thousand teachers to understand the usability of such a copilot for teachers and get the feedback to improve the Shiksha copilot prototype. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](37, "div", 8)(38, "h2", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](39, " How was Shiksha copilot evaluated? What metrics are used to measure performance? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](40, "ul", 10)(41, "li", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](42, " Microsoft Research has performed a qualitative analysis to evaluate the quality of the Shiksha copilot system using the internal testing team and received early feedback from Sikshana Foundation. To measure any possible harms through the system, they have performed two rounds of red teaming. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](43, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](44, " Microsoft Research actively performs automatic content moderation on content generated by (and input to) the Shiksha copilot using Azure Content Filtering. Meta prompts are used for providing guidelines to the copilot to generated education related content only and generate the content that is unbased and respectful. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](45, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](46, " Microsoft Research also monitors the system responses through anonymous telemetry to identify ongoing issues with the system and makes periodic improvements. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](47, "div", 8)(48, "h2", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](49, " What are the limitations of Shiksha copilot? How can users minimize the impact of Shiksha copilot's limitations when using the system? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](50, "ul", 10)(51, "li", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](52, " Shiksha copilot generates the content using AI. The AI generated content may have some errors rarely. So, the users of Shiksha copilot should validate the content before using this content in their classrooms. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](53, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](54, " The AI systems used in Shiksha copilot are capable of generating text in languages other than English, but performance for non-English languages needs to be assessed and improved for Shiksha copilot. Shiksha copilot users are requested to provide feedback on specific issues that they see during the pilot deployment. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]()()();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](55, "div", 12)(56, "h2", 9);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](57, " What operational factors and settings allow for effective and responsible use of Shiksha copilot? ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](58, "ul", 10)(59, "li", 11);
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](60, " Shiksha copilot is best used in English language where we have evaluated and applied quality measures and harm mitigations. ");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](61, "li");
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](62, " Shiksha is deployed with human experts like teachers in the loop. So, the teachers should evaluate and validate AI generated responses before delivering the content eventually. This also provides continuous anonymized feedback to improvise the system. ");
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
//# sourceMappingURL=src_app_components_faq_faq_component_ts.75ef5cc6cc85fee0.js.map