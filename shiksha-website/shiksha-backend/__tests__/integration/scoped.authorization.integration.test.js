require("dotenv").config();

const axios = require("axios");
const crypto = require("crypto");
const ExcelJS = require("exceljs");

const baseUrl = process.env.SHIKSHA_BASE_URL;
const superuserPhone = process.env.SHIKSHA_SU_PHONE;
const superuserPin = process.env.SHIKSHA_SU_PIN;

if (!baseUrl) throw new Error("SHIKSHA_BASE_URL is required");
if (!superuserPhone) throw new Error("SHIKSHA_SU_PHONE is required");
if (!superuserPin) throw new Error("SHIKSHA_SU_PIN is required");

async function request(path, method, token, body) {
  const response = await axios({
    url: `${baseUrl}${path}`,
    method,
    headers: token ? { Authorization: token } : {},
    data: body,
    validateStatus: () => true,
  });
  return { status: response.status, body: response.data };
}

function expectSuccess(response) {
  expect(response).toMatchObject({ status: 200, body: { success: true } });
  return response.body.data;
}

function expectDenied(response, message) {
  expect(response).toMatchObject({ status: 400, body: { success: false } });
  if (message) expect(response.body.message).toBe(message);
}

describe("scoped authorisation", () => {
  const suffix = Date.now();
  const operatorPermissions = [
    "dashboard.admin.view", "school.read", "school.list", "school.create", "school.edit", "school.delete", "school.export",
    "teacher.view", "teacher.create", "teacher.edit", "teacher.delete", "teacher.export",
    "staff.view", "staff.create", "staff.edit", "staff.delete", "role.assign", "role.view", "profile.view", "profile.edit",
    "content.activity.view", "content.activity.export", "training.view", "training.edit", "audit.view", "chat.use",
  ];
  const ids = { roles: [], users: [], schools: [], content: [], activities: [], batches: [] };
  let rootToken;
  let actorToken;
  let schoolActorToken;
  let mixedStaffToken;
  let actor;
  let schoolActor;
  let teacherRole;
  let operatorRole;
  let globalRole;
  let localTeacher;
  let remoteTeacher;
  let mixedStaff;
  let localBatch;
  let remoteBatch;
  let localSchool;
  let remoteSchool;

  const teacherBody = (name, phone, school, roles = [{ roleId: teacherRole._id, dep: school._id }]) => ({
    identity: { name, phone, email: "", address: "" },
    roles,
    profiles: { teacher: { facilities: [], classes: [], isProfileCompleted: false } },
  });

  beforeAll(async () => {
    const login = await request("/api/auth/validate-otp", "POST", null, { phone: superuserPhone, otp: superuserPin });
    const loginData = expectSuccess(login);
    rootToken = loginData.token;
    expect(loginData.user).not.toHaveProperty("otp");
    expect(loginData.user).not.toHaveProperty("recovery");
    expect(loginData.user).not.toHaveProperty("loginAttempts");
    expect(loginData.user).not.toHaveProperty("rememberMeToken");

    const [me, schools] = await Promise.all([
      request("/api/auth/me", "GET", rootToken),
      request("/api/school/list?limit=1000&includeDeleted=0", "GET", rootToken),
    ]);
    const rootUser = expectSuccess(me);
    const schoolList = expectSuccess(schools).results;
    localSchool = schoolList.find((school) => school.district);
    remoteSchool = schoolList.find((school) => school.district && school.district !== localSchool.district);
    expect(localSchool).toBeDefined();
    expect(remoteSchool).toBeDefined();

    const createRole = async (name, permissions, scopeType) => {
      const role = expectSuccess(await request("/api/roles", "POST", rootToken, {
        name: `${name} ${suffix}`,
        description: "Scoped authorisation integration fixture",
        permissions,
        scopeType,
      }));
      ids.roles.push(role._id);
      return role;
    };

    operatorRole = await createRole("District operator", operatorPermissions, "DISTRICT");
    teacherRole = await createRole("School user", [], "SCHOOL");
    globalRole = await createRole("Global user", [], "GLOBAL");
    const repeatedGrantRole = await createRole("Repeated grant", ["help.view"], "DISTRICT");
    const roleManagerRole = await createRole("Role manager", ["role.manage"], "UNBOUND");
    const schoolReaderRole = await createRole("School reader", ["school.read", "school.list", "teacher.view"], "SCHOOL");

    localTeacher = expectSuccess(await request("/api/users", "POST", rootToken, teacherBody(
      "Local Integration Teacher",
      `7${String(suffix).slice(-9)}`,
      localSchool
    )));
    remoteTeacher = expectSuccess(await request("/api/users", "POST", rootToken, teacherBody(
      "Remote Integration Teacher",
      `8${String(suffix).slice(-9)}`,
      remoteSchool
    )));
    mixedStaff = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: "Mixed Scope Integration Staff", phone: `6${String(suffix + 8).slice(-9)}`, email: "", address: "" },
      roles: [
        { roleId: operatorRole._id, dep: localSchool.district },
        { roleId: operatorRole._id, dep: remoteSchool.district },
      ],
      profiles: { admin: { state: localSchool.state } },
    }));
    ids.users.push(localTeacher._id, remoteTeacher._id, mixedStaff._id);

    actor = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: "Scoped Integration Actor", phone: `9${String(suffix).slice(-9)}`, email: "", address: "" },
      roles: [
        { roleId: operatorRole._id, dep: localSchool.district },
        { roleId: repeatedGrantRole._id, dep: localSchool.district },
        { roleId: repeatedGrantRole._id, dep: remoteSchool.district },
        { roleId: roleManagerRole._id },
      ],
      profiles: { admin: { state: localSchool.state } },
    }));
    ids.users.push(actor._id);
    schoolActor = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: "School Integration Actor", phone: `6${String(suffix).slice(-9)}`, email: "", address: "" },
      roles: [{ roleId: schoolReaderRole._id, dep: localSchool._id }],
      profiles: { admin: { state: localSchool.state } },
    }));
    ids.users.push(schoolActor._id);
    [actorToken, schoolActorToken, mixedStaffToken] = await Promise.all([actor, schoolActor, mixedStaff].map(async (user) =>
      expectSuccess(await request("/api/devtools/sessions", "POST", rootToken, { userId: user._id })).token
    ));

    const fixtures = expectSuccess(await request("/api/devtools/fixtures", "POST", rootToken, {
      contentActivities: [
        { generatedBy: localTeacher._id, sourceName: `Local source ${suffix}`, generatedName: `Local generated ${suffix}` },
        { generatedBy: remoteTeacher._id, sourceName: `Remote source ${suffix}`, generatedName: `Remote generated ${suffix}` },
      ],
      trainingBatches: [
        {
          batchName: `Local batch ${suffix}`,
          description: "Integration batch",
          scheduleDate: new Date(),
          trainingType: "offline",
          createdBy: actor._id,
        },
        {
          batchName: `Remote batch ${suffix}`,
          description: "Integration batch",
          scheduleDate: new Date(),
          trainingType: "offline",
          createdBy: remoteTeacher._id,
        },
      ],
    }));
    ids.content.push(...fixtures.content);
    ids.activities.push(...fixtures.activities);
    ids.batches.push(...fixtures.batches.map((item) => item._id));
    [localBatch, remoteBatch] = fixtures.batches;
    expect(rootUser._id).not.toBe(actor._id);
  });

  afterAll(async () => {
    if (rootToken) await request("/api/devtools/fixtures", "DELETE", rootToken, ids);
  });

  it("returns every grant when one permission is assigned at two scopes", async () => {
    const me = expectSuccess(await request("/api/auth/me", "GET", actorToken));
    const grants = me.permissions.filter((grant) => grant.permission === "help.view");

    expect(grants).toEqual(expect.arrayContaining([
      { permission: "help.view", scopeType: "DISTRICT", dep: localSchool.district },
      { permission: "help.view", scopeType: "DISTRICT", dep: remoteSchool.district },
    ]));
    expect(grants).toHaveLength(2);
  });

  it("applies list, filter, and direct-read boundaries across scoped resources", async () => {
    const lists = [
      {
        path: "/api/school/list?limit=1000&includeDeleted=0",
        filteredPath: `/api/school/list?limit=1000&filter[district]=${encodeURIComponent(localSchool.district)}`,
        hostilePath: `/api/school/list?limit=1000&filter[district]=${encodeURIComponent(remoteSchool.district)}`,
        local: (item) => item._id === localSchool._id,
        remote: (item) => item._id === remoteSchool._id,
      },
      {
        path: "/api/users?limit=1000&filter[profileType]=teacher",
        filteredPath: `/api/users?limit=1000&filter[profileType]=teacher&filter[district]=${encodeURIComponent(localSchool.district)}`,
        hostilePath: `/api/users?limit=1000&filter[profileType]=teacher&filter[district]=${encodeURIComponent(remoteSchool.district)}`,
        local: (item) => item._id === localTeacher._id,
        remote: (item) => item._id === remoteTeacher._id,
      },
      {
        path: "/api/content-activity?limit=100",
        filteredPath: `/api/content-activity?limit=100&filter[district]=${encodeURIComponent(localSchool.district)}`,
        hostilePath: `/api/content-activity?limit=100&filter[district]=${encodeURIComponent(remoteSchool.district)}`,
        local: (item) => item.userName === localTeacher.identity.name,
        remote: (item) => item.userName === remoteTeacher.identity.name,
      },
    ];
    for (const resource of lists) {
      const list = expectSuccess(await request(resource.path, "GET", actorToken)).results;
      const filtered = expectSuccess(await request(resource.filteredPath, "GET", actorToken)).results;
      const hostile = expectSuccess(await request(resource.hostilePath, "GET", actorToken)).results;
      expect(list.some(resource.local)).toBe(true);
      expect(list.some(resource.remote)).toBe(false);
      expect(filtered.some(resource.local)).toBe(true);
      expect(filtered.some(resource.remote)).toBe(false);
      expect(hostile).toHaveLength(0);
    }

    const reads = [
      {
        local: `/api/school/${localSchool._id}`,
        remote: `/api/school/${remoteSchool._id}`,
        message: "School is outside your scope",
      },
      {
        local: `/api/users/${localTeacher._id}`,
        remote: `/api/users/${remoteTeacher._id}`,
      },
      {
        local: `/api/master-lesson/activity/${ids.content[0]}?activityId=${ids.activities[0]}`,
        remote: `/api/master-lesson/activity/${ids.content[2]}?activityId=${ids.activities[1]}`,
        message: "Activity is outside your scope",
      },
    ];
    for (const resource of reads) {
      expectSuccess(await request(resource.local, "GET", actorToken));
      expectDenied(await request(resource.remote, "GET", actorToken), resource.message);
    }
  });

  it("limits school-scoped users to their assigned school", async () => {
    const schools = expectSuccess(await request("/api/school/list?limit=1000&includeDeleted=0", "GET", schoolActorToken));
    const teachers = expectSuccess(await request("/api/users?limit=1000&filter[profileType]=teacher", "GET", schoolActorToken));

    expect(schools.results.map((school) => school._id)).toEqual([localSchool._id]);
    expect(teachers.results).toEqual(expect.arrayContaining([expect.objectContaining({ _id: localTeacher._id })]));
    expect(teachers.results.some((user) => user._id === remoteTeacher._id)).toBe(false);
    expectDenied(await request(`/api/school/${remoteSchool._id}`, "GET", schoolActorToken), "School is outside your scope");
  });

  it("supports profile self-service without a school dependency", async () => {
    const profile = expectSuccess(await request(`/api/users/${mixedStaff._id}/profile`, "GET", mixedStaffToken));
    expect(profile).toMatchObject({ _id: mixedStaff._id, identity: mixedStaff.identity });

    expectDenied(await request("/api/profile", "PUT", mixedStaffToken, { classes: [], facilities: [] }), "Teaching profile not found");
    expectSuccess(await request("/api/auth/me", "GET", mixedStaffToken));
    expectSuccess(await request("/api/profile/language", "PATCH", mixedStaffToken, { preferredLanguage: "tg" }));
    const updated = expectSuccess(await request(`/api/users/${mixedStaff._id}/profile`, "GET", mixedStaffToken));
    expect(updated.preferredLanguage).toBe("tg");
  });

  it("intersects dashboard filters with the actor scope", async () => {
    const [localDashboard, remoteDashboard] = await Promise.all([
      request(`/api/dashboard/admin?schoolId=${localSchool._id}`, "GET", actorToken),
      request(`/api/dashboard/admin?schoolId=${remoteSchool._id}`, "GET", actorToken),
    ]);
    const localMetrics = expectSuccess(localDashboard);
    const remoteMetrics = expectSuccess(remoteDashboard);
    const localCounts = localMetrics.userCounts.userCounts;
    const remoteCounts = remoteMetrics.userCounts.userCounts;

    expect(localCounts.activeUsers + localCounts.inactiveUsers).toBeGreaterThan(0);
    expect(remoteCounts.activeUsers + remoteCounts.inactiveUsers).toBe(0);
  });

  it("keeps non-global training access tied to the batch creator", async () => {
    const batches = await request("/api/teacher-training-batches/", "GET", actorToken);
    expect(batches.status).toBe(200);
    expect(batches.body.map((batch) => batch._id)).toEqual([String(localBatch._id)]);
    expect((await request(`/api/teacher-training-batches/${localBatch._id}`, "GET", actorToken)).status).toBe(200);
    expect((await request(`/api/teacher-training-batches/${remoteBatch._id}`, "GET", actorToken)).status).toBe(403);
    expect((await request(`/api/teacher-training-batches/${remoteBatch._id}`, "DELETE", actorToken)).status).toBe(403);
  });

  it("exports only data inside the actor scope", async () => {
    const startedAt = new Date();
    await Promise.all([
      request("/api/school/export?limit=1000", "GET", actorToken).then(expectSuccess),
      request("/api/users/export?limit=1000", "GET", actorToken).then(expectSuccess),
      request(`/api/content-activity/export?filter[district]=${encodeURIComponent(localSchool.district)}`, "GET", actorToken).then(expectSuccess),
    ]);

    const eventTypes = ["Schools Export", "Teachers Export", "Content Activity Export"];
    const logs = [];
    for (let attempt = 0; attempt < 60 && logs.length < eventTypes.length; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const found = expectSuccess(await request("/api/audit/log?limit=1000", "GET", rootToken)).results
        .filter((log) => log.userId === actor._id && eventTypes.includes(log.eventType) && new Date(log.createdAt) >= startedAt);
      logs.splice(0, logs.length, ...found);
    }
    expect(logs).toHaveLength(3);
    expect(logs.every((log) => log.status === "success")).toBe(true);
    const sheets = {};
    for (const log of logs) {
      const response = await axios.get(log.logUrl, { responseType: "arraybuffer" });
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(response.data);
      sheets[log.eventType] = workbook.worksheets[0];
    }
    const values = (sheet, column) => sheet.getColumn(column).values.slice(2);
    expect(values(sheets["Schools Export"], 1)).toContain(localSchool.schoolId);
    expect(values(sheets["Schools Export"], 1)).not.toContain(remoteSchool.schoolId);
    expect(values(sheets["Teachers Export"], 1)).toContain(localTeacher.identity.name);
    expect(values(sheets["Teachers Export"], 1)).not.toContain(remoteTeacher.identity.name);
    expect(values(sheets["Content Activity Export"], 1)).toContain(localTeacher.identity.name);
    expect(values(sheets["Content Activity Export"], 1)).not.toContain(remoteTeacher.identity.name);
  }, 60000);

  it("enforces complete staff scope and applies permission removal immediately", async () => {
    expectDenied(await request("/api/users?limit=100&filter[profileType]=admin", "GET", schoolActorToken));
    const staff = expectSuccess(await request("/api/users?limit=100&filter[profileType]=admin", "GET", actorToken)).results;
    expect(staff.some((user) => user._id === mixedStaff._id)).toBe(false);

    expectSuccess(await request(`/api/roles/${operatorRole._id}`, "PUT", rootToken, {
      permissions: operatorPermissions.filter((permission) => permission !== "school.list"),
    }));
    const revoked = await request("/api/school/list?limit=1", "GET", actorToken);
    expect(revoked).toMatchObject({ status: 403, body: { success: false } });
    expectSuccess(await request(`/api/roles/${operatorRole._id}`, "PUT", rootToken, { permissions: operatorPermissions }));
    expectSuccess(await request("/api/school/list?limit=1", "GET", actorToken));

    expect((await request("/api/chat/restart", "POST", actorToken)).status).toBe(200);
    expectSuccess(await request(`/api/roles/${operatorRole._id}`, "PUT", rootToken, {
      permissions: operatorPermissions.filter((permission) => permission !== "chat.use"),
    }));
    expect(await request("/api/chat/restart", "POST", actorToken)).toMatchObject({ status: 403, body: { success: false } });
    expectSuccess(await request(`/api/roles/${operatorRole._id}`, "PUT", rootToken, { permissions: operatorPermissions }));
  });

  it("keeps lifecycle changes behind delete permissions", async () => {
    expectDenied(await request(`/api/users/${localTeacher._id}`, "PUT", actorToken, { isDeleted: true }));
    expectSuccess(await request(`/api/roles/${operatorRole._id}`, "PUT", rootToken, {
      permissions: operatorPermissions.filter((permission) => !["school.delete", "teacher.delete", "staff.delete"].includes(permission)),
    }));
    for (const [method, path] of [
      ["PUT", `/api/school/deactivate/${localSchool._id}`],
      ["PUT", `/api/users/${localTeacher._id}/deactivate`],
      ["PUT", `/api/users/${mixedStaff._id}/deactivate`],
    ]) {
      expect(await request(path, method, actorToken)).toMatchObject({ status: 403, body: { success: false } });
    }
    expectSuccess(await request(`/api/roles/${operatorRole._id}`, "PUT", rootToken, { permissions: operatorPermissions }));
  });

  it("enforces scope on school create, update, activation, deactivation, and deletion", async () => {
    const body = {
      name: `Scoped Integration School ${suffix}`,
      schoolId: Number(`8${String(suffix).slice(-10)}`),
      type: "urban",
      boards: ["BSE-TG"],
      state: localSchool.state,
      zone: localSchool.zone,
      district: localSchool.district,
      block: localSchool.block,
      mediums: ["english"],
      academicYearStartDate: "2026-06-01",
      academicYearEndDate: "2027-03-31",
      classes: [],
    };
    const createdSchool = expectSuccess(await request("/api/school/create", "POST", actorToken, body));
    ids.schools.push(createdSchool._id);

    expectDenied(await request("/api/school/create", "POST", actorToken, {
      ...body,
      name: `Remote Integration School ${suffix}`,
      schoolId: body.schoolId + 1,
      state: remoteSchool.state,
      zone: remoteSchool.zone,
      district: remoteSchool.district,
      block: remoteSchool.block,
    }), "School is outside your scope");

    const updated = expectSuccess(await request(`/api/school/update/${createdSchool._id}`, "PUT", actorToken, {
      ...body,
      name: `Updated Scoped Integration School ${suffix}`,
    }));
    expect(updated.name).toBe(`Updated Scoped Integration School ${suffix}`);

    expectSuccess(await request(`/api/school/deactivate/${createdSchool._id}`, "PUT", actorToken));
    expectSuccess(await request(`/api/school/activate/${createdSchool._id}`, "PUT", actorToken));
    const remoteMutations = [
      ["PUT", `/api/school/update/${remoteSchool._id}`, { ...body, schoolId: remoteSchool.schoolId, name: remoteSchool.name }],
      ["PUT", `/api/school/deactivate/${remoteSchool._id}`],
      ["PUT", `/api/school/activate/${remoteSchool._id}`],
      ["DELETE", `/api/school/${remoteSchool._id}`],
    ];
    for (const [method, path, data] of remoteMutations) {
      expectDenied(await request(path, method, actorToken, data), "School is outside your scope");
    }
    expectSuccess(await request(`/api/school/${createdSchool._id}`, "DELETE", actorToken));
  });

  it("enforces scope on user mutations", async () => {
    expectSuccess(await request(`/api/users/${localTeacher._id}`, "PUT", actorToken, {
      identity: { ...localTeacher.identity, name: "Updated Local Integration Teacher" },
    }));
    expectSuccess(await request(`/api/users/${localTeacher._id}/deactivate`, "PUT", actorToken));
    expectSuccess(await request(`/api/users/${localTeacher._id}/activate`, "PUT", actorToken));
    const remoteMutations = [
      ["PUT", `/api/users/${remoteTeacher._id}`, { profiles: { teacher: { isProfileCompleted: true } } }],
      ["PUT", `/api/users/${remoteTeacher._id}/deactivate`],
      ["PUT", `/api/users/${remoteTeacher._id}/activate`],
      ["DELETE", `/api/users/${remoteTeacher._id}`],
    ];
    for (const [method, path, data] of remoteMutations) {
      expectDenied(await request(path, method, actorToken, data), "User is outside your scope");
    }
    expectSuccess(await request(`/api/users/${localTeacher._id}`, "DELETE", actorToken));
  });

  it("allows in-scope user creation and rejects invalid, duplicate, and broader assignments", async () => {
    const local = expectSuccess(await request("/api/users", "POST", actorToken, teacherBody(
      "Created Local Integration Teacher",
      `6${String(suffix + 1).slice(-9)}`,
      localSchool
    )));
    ids.users.push(local._id);

    const adminBody = (name, phone, roles) => ({
      identity: { name, phone, email: "", address: "" },
      roles,
      profiles: { admin: { state: localSchool.state } },
    });
    const rejected = [
      {
        body: teacherBody("Blocked Remote Integration Teacher", `6${String(suffix + 2).slice(-9)}`, remoteSchool),
        message: "Role assignment is outside your scope",
      },
      {
        body: teacherBody("Duplicate Assignment Teacher", `6${String(suffix + 3).slice(-9)}`, localSchool, [
          { roleId: teacherRole._id, dep: localSchool._id },
          { roleId: teacherRole._id, dep: localSchool._id },
        ]),
        message: "Duplicate role assignment",
      },
      {
        body: teacherBody("Invalid Dependency Teacher", `6${String(suffix + 4).slice(-9)}`, localSchool, [
          { roleId: teacherRole._id, dep: crypto.randomBytes(12).toString("hex") },
        ]),
        message: "SCHOOL scope dependency does not exist",
      },
      {
        body: adminBody("Escalated Integration Admin", `6${String(suffix + 5).slice(-9)}`, [{ roleId: globalRole._id }]),
        message: "Role assignment is outside your scope",
      },
      {
        body: adminBody("Missing Dependency Admin", `6${String(suffix + 6).slice(-9)}`, [{ roleId: operatorRole._id }]),
        message: "DISTRICT scope requires a dependency",
      },
      {
        body: adminBody("Invalid Dependency Admin", `6${String(suffix + 7).slice(-9)}`, [
          { roleId: operatorRole._id, dep: `Missing District ${suffix}` },
        ]),
        message: "DISTRICT scope dependency does not exist",
      },
    ];
    for (const test of rejected) {
      expectDenied(await request("/api/users", "POST", actorToken, test.body), test.message);
    }
  });

  it("protects assigned roles from deletion and scope changes", async () => {
    expectDenied(await request(`/api/roles/${operatorRole._id}`, "DELETE", actorToken), "Assigned roles cannot be deleted");
    expectDenied(await request(`/api/roles/${operatorRole._id}`, "PUT", actorToken, {
      scopeType: "STATE",
    }), "Assigned role scope cannot be changed");
  });
});
