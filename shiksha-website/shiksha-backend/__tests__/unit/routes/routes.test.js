// Route wiring smoke tests: confirm each route module registers the
// expected method + path on a real express.Router. No mocking - route
// files only wire dao/model classes at require time, they don't open
// DB or network connections (see config/db.js: connect() is explicit).

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

const getRegisteredRoutes = (file) => {
  const router = require(`../../../routes/${file}`);
  return router.stack
    .filter((layer) => layer.route)
    .map((layer) => ({
      path: layer.route.path,
      methods: Object.keys(layer.route.methods),
    }));
};

describe("route modules wiring", () => {
  routeCases.forEach(({ file, method, path }) => {
    it(`registers ${method.toUpperCase()} ${path} in ${file}`, () => {
      const routes = getRegisteredRoutes(file);
      const match = routes.find(
        (r) => r.path === path && r.methods.includes(method)
      );
      expect(match).toBeDefined();
    });
  });
});
