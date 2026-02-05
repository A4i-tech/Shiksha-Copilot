// Route wiring smoke tests: ensure each route module registers handlers without executing real controllers.

jest.mock("express", () => {
  const routers = [];
  const makeRouter = () => {
    const r = {};
    ["get", "post", "put", "delete", "patch"].forEach((m) => {
      r[m] = jest.fn(() => r);
    });
    return r;
  };
  return {
    Router: jest.fn(() => {
      const r = makeRouter();
      routers.push(r);
      return r;
    }),
    __routers: routers,
  };
});

const controllerPaths = [
  "../../../controllers/admin.user.controller.js",
  "../../../controllers/audit.log.controller.js",
  "../../../controllers/auth.controller.js",
  "../../../controllers/baselineSurvey.controller.js",
  "../../../controllers/board.controller.js",
  "../../../controllers/chapter.controller.js",
  "../../../controllers/chat.controller.js",
  "../../../controllers/facility.controller.js",
  "../../../controllers/feedback.lesson.controller.js",
  "../../../controllers/fln.resource.controller.js",
  "../../../controllers/help.videos.controller.js",
  "../../../controllers/lba.qp.controller.js",
  "../../../controllers/lesson.plan.template.controller.js",
  "../../../controllers/master.class.controller.js",
  "../../../controllers/master.lesson.controller.js",
  "../../../controllers/master.resource.controller.js",
  "../../../controllers/master.subject.controller.js",
  "../../../controllers/question.bank.cache.controller.js",
  "../../../controllers/question.bank.controller.js",
  "../../../controllers/region.controller.js",
  "../../../controllers/schedule.controller.js",
  "../../../controllers/school.class.controller.js",
  "../../../controllers/school.controller.js",
  "../../../controllers/subject.controller.js",
  "../../../controllers/teacher.absent.controller.js",
  "../../../controllers/teacher.feedback.controller.js",
  "../../../controllers/teacher.lesson.plan.controller.js",
  "../../../controllers/teacher.training.batch.controller.js",
  "../../../controllers/user.controller.js",
];

const validationPaths = [
  "../../../validations/admin.user.validation.js",
  "../../../validations/auth.validation.js",
  "../../../validations/board.validation.js",
  "../../../validations/facility.validation.js",
  "../../../validations/feedback.lesson.validation.js",
  "../../../validations/master.class.validation.js",
  "../../../validations/master.lesson.validation.js",
  "../../../validations/master.resource.validation.js",
  "../../../validations/master.subject.validation.js",
  "../../../validations/question.bank.validation.js",
  "../../../validations/schedule.validation.js",
  "../../../validations/school.validation.js",
  "../../../validations/school.class.validation.js",
  "../../../validations/subject.validation.js",
  "../../../validations/teacher.feedback.validation.js",
  "../../../validations/teacher.lesson.plan.validation.js",
  "../../../validations/user.validation.js",
];

const mockControllerClass = () =>
  class {
    constructor() {
      return new Proxy(
        {},
        {
          get: () => jest.fn(),
        }
      );
    }
  };

const mockValidationModule = () =>
  new Proxy(
    {},
    {
      get: () => jest.fn(),
    }
  );

const setupSharedMocks = () => {
  jest.doMock("../../../middlewares/asyncMiddleware.js", () =>
    jest.fn((fn) => fn)
  );
  jest.doMock("../../../middlewares/auth.js", () => ({
    isAuthenticated: jest.fn((req, res, next) => next && next()),
    isAdmin: jest.fn((req, res, next) => next && next()),
    isAdminOrManager: jest.fn((req, res, next) => next && next()),
  }));
  jest.doMock("../../../middlewares/uploadMiddleware.js", () => jest.fn());
  jest.doMock("../../../middlewares/multerUploadMiddleware.js", () =>
    jest.fn()
  );
  jest.doMock("../../../middlewares/trainingUploadMiddleware.js", () =>
    jest.fn()
  );

  jest.doMock("multer", () => {
    const stub = () => ({
      single: jest.fn(() => (req, res, next) => next && next()),
      any: jest.fn(() => (req, res, next) => next && next()),
      array: jest.fn(() => (req, res, next) => next && next()),
    });
    stub.memoryStorage = jest.fn(() => ({}));
    return stub;
  });

  controllerPaths.forEach((p) => {
    if (p.includes("baselineSurvey.controller")) {
      jest.doMock(p, () => ({
        checkIfCompleted: jest.fn(),
        submitSurvey: jest.fn(),
      }));
    } else {
      jest.doMock(p, () => mockControllerClass());
    }
  });

  validationPaths.forEach((p) => {
    jest.doMock(p, () => mockValidationModule());
  });
};

const loadRoute = (file) => {
  jest.resetModules();
  setupSharedMocks();
  const express = require("express");
  express.__routers.length = 0;
  require(`../../../routes/${file}`);
  return require("express").__routers[0];
};

const routeCases = [
  { file: "admin.user.routes.js", method: "post", path: "/admin/create" },
  { file: "audit.log.route.js", method: "get", path: "/audit/log" },
  { file: "auth.routes.js", method: "post", path: "/auth/get-otp" },
  {
    file: "baselineSurvey.routes.js",
    method: "get",
    path: "/baseline-surveys/check",
  },
  { file: "board.routes.js", method: "post", path: "/board/create" },
  { file: "chapter.routes.js", method: "get", path: "/chapter/list" },
  { file: "chat.routes.js", method: "post", path: "/chat/message" },
  { file: "facility.routes.js", method: "post", path: "/facility/create" },
  {
    file: "feedback.lesson.routes.js",
    method: "post",
    path: "/lesson-feedback/create",
  },
  { file: "fln.resource.routes.js", method: "get", path: "/fln" },
  {
    file: "help.videos.routes.js",
    method: "post",
    path: "/help-videos/create",
  },
  {
    file: "lba.qp.routes.js",
    method: "post",
    path: "/lba-qp/upload-json-file",
  },
  {
    file: "lesson.plan.template.routes.js",
    method: "post",
    path: "/lesson-plan-template/create",
  },
  {
    file: "master.class.routes.js",
    method: "post",
    path: "/master-class/create",
  },
  {
    file: "master.lesson.routes.js",
    method: "post",
    path: "/master-lesson/create",
  },
  {
    file: "master.resource.routes.js",
    method: "post",
    path: "/resource-plan/create",
  },
  {
    file: "master.subject.routes.js",
    method: "post",
    path: "/master-subject/create",
  },
  {
    file: "question.bank.cache.routes.js",
    method: "post",
    path: "/question-bank-cache/upload-cache",
  },
  {
    file: "question.bank.routes.js",
    method: "post",
    path: "/question-bank/generate-template",
  },
  { file: "region.routes.js", method: "get", path: "/regions/list" },
  { file: "schedule.routes.js", method: "post", path: "/schedule/create" },
  { file: "school.class.routes.js", method: "post", path: "/class/create" },
  { file: "school.routes.js", method: "post", path: "/school/create" },
  { file: "subject.routes.js", method: "post", path: "/subject/create" },
  { file: "teacher.absent.routes.js", method: "get", path: "/teacher-absent" },
  {
    file: "teacher.feedback.routes.js",
    method: "post",
    path: "/teacher-resource-feedback/create",
  },
  {
    file: "teacher.lesson.plan.routes.js",
    method: "get",
    path: "/teacher-lesson-plan/list",
  },
  {
    file: "teacher.training.batch.routes.js",
    method: "post",
    path: "/teacher-training-batches/",
  },
  { file: "user.routes.js", method: "post", path: "/user/create" },
];

describe("route modules wiring", () => {
  routeCases.forEach(({ file, method, path }) => {
    it(`registers ${method.toUpperCase()} ${path} in ${file}`, () => {
      const router = loadRoute(file);
      expect(router[method]).toHaveBeenCalled();
      const [registeredPath] = router[method].mock.calls[0];
      expect(registeredPath).toBe(path);
    });
  });
});
