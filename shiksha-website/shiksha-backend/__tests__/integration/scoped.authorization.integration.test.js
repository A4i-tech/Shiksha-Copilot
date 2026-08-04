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
    "school.read", "school.list", "school.create", "school.edit", "school.delete", "school.export",
    "user.view", "user.create", "user.edit", "user.delete", "user.export",
    "role.assign", "role.view", "profile.view", "profile.edit",
    "content.activity.view", "content.activity.export", "training.view", "training.edit", "audit.view", "chat.use",
  ];
  const ids = { roles: [], users: [], schools: [], classes: [], auditLogs: [], content: [], activities: [], batches: [] };
  let rootToken;
  let actorToken;
  let delegateToken;
  let schoolActorToken;
  let mixedStaffToken;
  let actor;
  let schoolActor;
  let teacherRole;
  let operatorRole;
  let globalRole;
  let unboundRole;
  let elevatedRole;
  let localTeacher;
  let remoteTeacher;
  let mixedStaff;
  let localBatch;
  let remoteBatch;
  let localSchool;
  let remoteSchool;
  let collisionToken;
  let collisionLocalSchool;
  let collisionRemoteSchool;

  const teacherBody = (name, phone, school, roles = [{ roleId: teacherRole._id, dep: school._id }]) => ({
    identity: { name, phone, email: "", address: "" },
    roles,
    profiles: { teacher: { facilities: [], classes: [], isProfileCompleted: false } },
  });
  const districtDep = (school) => ({ state: school.state, zone: school.zone, district: school.district });
  const blockDep = (school) => ({ ...districtDep(school), block: school.block });

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
      request("/api/school/list?limit=0&includeDeleted=0", "GET", rootToken),
    ]);
    const rootUser = expectSuccess(me);
    const schoolList = expectSuccess(schools).results;
    localSchool = schoolList.find((school) => school.district);
    remoteSchool = schoolList.find((school) => school.district && school.district !== localSchool.district);
    collisionLocalSchool = schoolList.find((school) => school.block && schoolList.some((candidate) =>
      candidate.block === school.block && candidate._id !== school._id &&
      (candidate.state !== school.state || candidate.zone !== school.zone || candidate.district !== school.district)
    ));
    collisionRemoteSchool = schoolList.find((school) =>
      school.block === collisionLocalSchool.block &&
      (school.state !== collisionLocalSchool.state || school.zone !== collisionLocalSchool.zone || school.district !== collisionLocalSchool.district)
    );
    expect(localSchool).toBeDefined();
    expect(remoteSchool).toBeDefined();
    expect(collisionLocalSchool).toBeDefined();
    expect(collisionRemoteSchool).toBeDefined();

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
    teacherRole = await createRole("School user", ["generation.status.view"], "SCHOOL");
    globalRole = await createRole("Global teacher creator", ["role.assign", "user.create", "user.view"], "GLOBAL");
    elevatedRole = await createRole("Elevated district role", ["generation.status.view"], "DISTRICT");
    const repeatedGrantRole = await createRole("Repeated grant", ["help.view"], "DISTRICT");
    const roleManagerRole = await createRole("Role manager", ["role.manage"], "UNBOUND");
    const delegateRole = await createRole("Role delegate", ["role.delegate"], "STATE");
    const schoolReaderRole = await createRole("School reader", ["role.assign", "school.read", "school.list", "user.create", "user.view"], "SCHOOL");
    unboundRole = await createRole("Unbound user", [], "UNBOUND");
    const blockReaderRole = await createRole("Block reader", ["school.list"], "BLOCK");

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
        { roleId: operatorRole._id, dep: districtDep(localSchool) },
        { roleId: operatorRole._id, dep: districtDep(remoteSchool) },
      ],
      profiles: { admin: { state: localSchool.state } },
    }));
    ids.users.push(localTeacher._id, remoteTeacher._id, mixedStaff._id);

    actor = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: "Scoped Integration Actor", phone: `9${String(suffix).slice(-9)}`, email: "", address: "" },
      roles: [
        { roleId: operatorRole._id, dep: districtDep(localSchool) },
        { roleId: repeatedGrantRole._id, dep: districtDep(localSchool) },
        { roleId: repeatedGrantRole._id, dep: districtDep(remoteSchool) },
        { roleId: roleManagerRole._id },
      ],
      profiles: { admin: { state: localSchool.state } },
    }));
    ids.users.push(actor._id);
    const delegateActor = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: "Role Delegation Integration Actor", phone: `7${String(suffix + 31).slice(-9)}`, email: "", address: "" },
      roles: [
        { roleId: roleManagerRole._id },
        { roleId: delegateRole._id, dep: { state: localSchool.state } },
      ],
      profiles: { admin: { state: localSchool.state } },
    }));
    ids.users.push(delegateActor._id);
    schoolActor = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: "School Integration Actor", phone: `6${String(suffix).slice(-9)}`, email: "", address: "" },
      roles: [{ roleId: schoolReaderRole._id, dep: localSchool._id }],
      profiles: { admin: { state: localSchool.state } },
    }));
    ids.users.push(schoolActor._id);
    const collisionActor = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: "Block Collision Integration Actor", phone: `8${String(suffix + 9).slice(-9)}`, email: "", address: "" },
      roles: [{ roleId: blockReaderRole._id, dep: blockDep(collisionLocalSchool) }],
      profiles: { admin: { state: collisionLocalSchool.state } },
    }));
    ids.users.push(collisionActor._id);
    [actorToken, delegateToken, schoolActorToken, mixedStaffToken, collisionToken] = await Promise.all([actor, delegateActor, schoolActor, mixedStaff, collisionActor].map(async (user) =>
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
          createdBy: remoteTeacher._id,
          assignedTeachers: [localTeacher._id],
        },
        {
          batchName: `Remote batch ${suffix}`,
          description: "Integration batch",
          scheduleDate: new Date(),
          trainingType: "offline",
          createdBy: remoteTeacher._id,
          assignedTeachers: [remoteTeacher._id],
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
      { permission: "help.view", scopeType: "DISTRICT", dep: districtDep(localSchool) },
      { permission: "help.view", scopeType: "DISTRICT", dep: districtDep(remoteSchool) },
    ]));
    expect(grants).toHaveLength(2);
  });

  it("keeps identical block names isolated by their full region path", async () => {
    const schools = expectSuccess(await request("/api/school/list?limit=0&includeDeleted=0", "GET", collisionToken)).results;
    expect(schools.some((school) => school._id === collisionLocalSchool._id)).toBe(true);
    expect(schools.some((school) => school._id === collisionRemoteSchool._id)).toBe(false);
  });

  it("lists role assignees within the actor's role-view scope", async () => {
    const allTeachers = expectSuccess(await request(`/api/roles/${teacherRole._id}/users?limit=10`, "GET", rootToken));
    expect(allTeachers.results.map((user) => user._id)).toEqual(expect.arrayContaining([localTeacher._id, remoteTeacher._id]));

    const districtUsers = expectSuccess(await request(`/api/roles/${operatorRole._id}/users?limit=10`, "GET", actorToken));
    expect(districtUsers.results.map((user) => user._id)).toEqual(expect.arrayContaining([actor._id, mixedStaff._id]));

    const schoolUsers = expectSuccess(await request(`/api/roles/${teacherRole._id}/users?limit=10`, "GET", actorToken));
    expect(schoolUsers.results.map((user) => user._id)).toContain(localTeacher._id);
    expect(schoolUsers.results.map((user) => user._id)).not.toContain(remoteTeacher._id);
  });

  it("lists roles for assignment without role-management access", async () => {
    expectSuccess(await request("/api/roles", "GET", schoolActorToken));
    expect(await request("/api/roles/permissions", "GET", schoolActorToken)).toMatchObject({ status: 403 });
  });

  it("applies list, filter, and direct-read boundaries across scoped resources", async () => {
    const lists = [
      {
        path: `/api/school/list?limit=10&search=${localSchool.schoolId}`,
        remotePath: `/api/school/list?limit=10&search=${remoteSchool.schoolId}`,
        filteredPath: `/api/school/list?limit=10&search=${localSchool.schoolId}&filter[district]=${encodeURIComponent(localSchool.district)}`,
        hostilePath: `/api/school/list?limit=10&search=${localSchool.schoolId}&filter[district]=${encodeURIComponent(remoteSchool.district)}`,
        local: (item) => item._id === localSchool._id,
        remote: (item) => item._id === remoteSchool._id,
      },
      {
        path: `/api/users?limit=10&filter[profileType]=teacher&search=${localTeacher.identity.phone}`,
        remotePath: `/api/users?limit=10&filter[profileType]=teacher&search=${remoteTeacher.identity.phone}`,
        filteredPath: `/api/users?limit=10&filter[profileType]=teacher&search=${localTeacher.identity.phone}&filter[district]=${encodeURIComponent(localSchool.district)}`,
        hostilePath: `/api/users?limit=10&filter[profileType]=teacher&search=${localTeacher.identity.phone}&filter[district]=${encodeURIComponent(remoteSchool.district)}`,
        local: (item) => item._id === localTeacher._id,
        remote: (item) => item._id === remoteTeacher._id,
      },
      {
        path: `/api/content-activity?limit=10&search=${encodeURIComponent(localTeacher.identity.name)}`,
        remotePath: `/api/content-activity?limit=10&search=${encodeURIComponent(remoteTeacher.identity.name)}`,
        filteredPath: `/api/content-activity?limit=10&search=${encodeURIComponent(localTeacher.identity.name)}&filter[district]=${encodeURIComponent(localSchool.district)}`,
        hostilePath: `/api/content-activity?limit=10&search=${encodeURIComponent(localTeacher.identity.name)}&filter[district]=${encodeURIComponent(remoteSchool.district)}`,
        local: (item) => item.userName === localTeacher.identity.name,
        remote: (item) => item.userName === remoteTeacher.identity.name,
      },
    ];
    for (const resource of lists) {
      const list = expectSuccess(await request(resource.path, "GET", actorToken)).results;
      const remote = expectSuccess(await request(resource.remotePath, "GET", actorToken)).results;
      const filtered = expectSuccess(await request(resource.filteredPath, "GET", actorToken)).results;
      const hostile = expectSuccess(await request(resource.hostilePath, "GET", actorToken)).results;
      expect(list.some(resource.local)).toBe(true);
      expect(list.some(resource.remote)).toBe(false);
      expect(remote).toHaveLength(0);
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

  it("requires an explicit user profile type", async () => {
    expectDenied(await request("/api/users?limit=100", "GET", rootToken));
    const teachers = expectSuccess(await request("/api/users?limit=100&filter[profileType]=teacher", "GET", rootToken)).results;
    expect(teachers.every((user) => user.profiles.teacher)).toBe(true);
    expect(await request("/api/users?limit=100&filter[profileType]=admin", "GET", rootToken))
      .toMatchObject({ status: 200, body: { success: true } });
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

  it("removes the teaching profile with the final school assignment", async () => {
    const user = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: "Teacher to Staff Integration User", phone: `9${String(suffix + 11).slice(-9)}`, email: "", address: "" },
      roles: [{ roleId: teacherRole._id, dep: localSchool._id }, { roleId: unboundRole._id }],
      profiles: { teacher: { facilities: [], classes: [], isProfileCompleted: false }, admin: { state: localSchool.state } },
    }));
    ids.users.push(user._id);

    expectSuccess(await request(`/api/users/${user._id}`, "PUT", rootToken, { roles: [{ _id: user.roles[1]._id, roleId: unboundRole._id }] }));
    const updated = expectSuccess(await request(`/api/users/${user._id}`, "GET", rootToken));
    expect(updated.profiles).toEqual({ admin: { state: localSchool.state } });
  });

  it("scopes training batches by their assigned teachers", async () => {
    const batches = await request("/api/teacher-training-batches/", "GET", actorToken);
    expect(batches.status).toBe(200);
    expect(batches.body.map((batch) => batch._id)).toContain(String(localBatch._id));
    expect(batches.body.map((batch) => batch._id)).not.toContain(String(remoteBatch._id));
    expect((await request(`/api/teacher-training-batches/${localBatch._id}`, "GET", actorToken)).status).toBe(200);
    expect((await request(`/api/teacher-training-batches/${remoteBatch._id}`, "GET", actorToken)).status).toBe(403);
    expect((await request(`/api/teacher-training-batches/${remoteBatch._id}`, "DELETE", actorToken)).status).toBe(403);
    expect((await request(`/api/teacher-training-batches/${localBatch._id}/assign-teacher`, "POST", actorToken, {
      teacherId: remoteTeacher._id,
    })).status).toBe(403);
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
      const found = expectSuccess(await request(`/api/audit/log?limit=20&filter[userId]=${actor._id}`, "GET", rootToken)).results
        .filter((log) => eventTypes.includes(log.eventType) && new Date(log.createdAt) >= startedAt);
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
    const schoolStaff = expectSuccess(await request("/api/users?limit=100&filter[profileType]=admin", "GET", schoolActorToken)).results;
    expect(schoolStaff.map((user) => user._id)).toContain(schoolActor._id);
    expect(schoolStaff.map((user) => user._id)).not.toContain(mixedStaff._id);
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
      permissions: operatorPermissions.filter((permission) => !["school.delete", "user.delete"].includes(permission)),
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
    const activated = expectSuccess(await request(`/api/school/activate/${createdSchool._id}`, "PUT", actorToken));
    expect(activated.isDeleted).toBe(false);
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
    const peer = expectSuccess(await request("/api/users", "POST", rootToken, {
      identity: { name: "Equal Scope Integration Manager", phone: `6${String(suffix + 30).slice(-9)}`, email: "", address: "" },
      roles: [{ roleId: operatorRole._id, dep: districtDep(localSchool) }],
      profiles: { admin: { state: localSchool.state } },
    }));
    ids.users.push(peer._id);
    expectDenied(await request(`/api/users/${peer._id}`, "PUT", actorToken, {
      identity: { ...peer.identity, name: "Edited Equal Scope Integration Manager" },
    }));
    expectDenied(await request(`/api/users/${peer._id}/deactivate`, "PUT", actorToken));

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
      expectDenied(await request(path, method, actorToken, data));
    }
    expectSuccess(await request(`/api/users/${localTeacher._id}`, "DELETE", actorToken));
  });

  it("allows in-scope user creation and rejects invalid, duplicate, and broader assignments", async () => {
    const local = expectSuccess(await request("/api/users", "POST", actorToken, teacherBody(
      "Created Local Integration Teacher",
      `6${String(suffix + 1).slice(-9)}`,
      localSchool
    )));

    const adminBody = (name, phone, roles) => ({
      identity: { name, phone, email: "", address: "" },
      roles,
      profiles: { admin: { state: localSchool.state } },
    });
    const global = expectSuccess(await request("/api/users", "POST", rootToken, teacherBody(
      "Created Global Integration Teacher",
      `7${String(suffix + 12).slice(-9)}`,
      remoteSchool
    )));
    ids.users.push(local._id, global._id);

    const rejected = [
      {
        body: teacherBody("Blocked Remote Integration Teacher", `6${String(suffix + 2).slice(-9)}`, remoteSchool),
        message: "Role assignment must be below your scope",
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
        message: "Role assignment must be below your scope",
      },
      {
        body: adminBody("Missing Dependency Admin", `6${String(suffix + 6).slice(-9)}`, [{ roleId: operatorRole._id }]),
        message: "DISTRICT scope requires a dependency",
      },
      {
        body: adminBody("Invalid Dependency Admin", `6${String(suffix + 7).slice(-9)}`, [
          { roleId: operatorRole._id, dep: { state: localSchool.state, zone: localSchool.zone, district: `Missing District ${suffix}` } },
        ]),
        message: "DISTRICT scope dependency does not exist",
      },
      {
        body: adminBody("Equal Scope Integration Staff", `6${String(suffix + 9).slice(-9)}`, [
          { roleId: elevatedRole._id, dep: districtDep(localSchool) },
        ]),
        message: "Role assignment must be below your scope",
      },
    ];
    for (const test of rejected) {
      expectDenied(await request("/api/users", "POST", actorToken, test.body), test.message);
    }
    expectDenied(await request("/api/users", "POST", schoolActorToken, teacherBody(
      "Equal School Scope Integration Teacher",
      `6${String(suffix + 13).slice(-9)}`,
      localSchool
    )), "Role assignment must be below your scope");
    expectDenied(await request("/api/users", "POST", rootToken, adminBody(
      "Equal Global Scope Integration Staff",
      `6${String(suffix + 14).slice(-9)}`,
      [{ roleId: globalRole._id }]
    )), "Role assignment must be below your scope");
    expectDenied(await request(`/api/users/${local._id}`, "PUT", actorToken, {
      roles: [
        { _id: local.roles[0]._id, roleId: teacherRole._id, dep: localSchool._id },
        { roleId: elevatedRole._id, dep: districtDep(localSchool) },
      ],
    }), "Role assignment must be below your scope");
  });

  it("edits mixed-scope teachers and invalidates their session when assignments change", async () => {
    const capabilityRole = expectSuccess(await request("/api/roles", "POST", rootToken, {
      name: `School capability ${suffix}`,
      description: "Mixed-scope teacher integration fixture",
      permissions: ["generation.status.view"],
      scopeType: "SCHOOL",
    }));
    ids.roles.push(capabilityRole._id);

    const teacher = expectSuccess(await request("/api/users", "POST", rootToken, teacherBody(
      "Mixed Scope Integration Teacher",
      `7${String(suffix + 20).slice(-9)}`,
      localSchool,
      [{ roleId: capabilityRole._id, dep: localSchool._id }, { roleId: unboundRole._id }]
    )));
    ids.users.push(teacher._id);
    const teacherSession = expectSuccess(await request("/api/devtools/sessions", "POST", rootToken, { userId: teacher._id }));
    const assignments = [
      { _id: teacher.roles[0]._id, roleId: capabilityRole._id, dep: localSchool._id },
      { _id: teacher.roles[1]._id, roleId: unboundRole._id },
    ];

    expectSuccess(await request(`/api/users/${teacher._id}`, "PUT", rootToken, {
      identity: { name: "Edited Mixed Scope Integration Teacher", phone: teacher.identity.phone },
      roles: assignments,
    }));
    expectSuccess(await request("/api/auth/me", "GET", teacherSession.token));

    expectSuccess(await request(`/api/users/${teacher._id}`, "PUT", rootToken, {
      roles: [{ ...assignments[0], dep: remoteSchool._id }, assignments[1]],
    }));
    expect(await request("/api/auth/me", "GET", teacherSession.token)).toMatchObject({
      status: 401,
      body: { success: false, message: "Account details updated. Please login to continue" },
    });
    const updated = expectSuccess(await request(`/api/users/${teacher._id}`, "GET", rootToken));
    expect(updated.roles).toEqual(expect.arrayContaining([
      expect.objectContaining({ _id: teacher.roles[0]._id, dep: remoteSchool._id, role: expect.objectContaining({ _id: capabilityRole._id }) }),
      expect.objectContaining({ _id: teacher.roles[1]._id, role: expect.objectContaining({ _id: unboundRole._id }) }),
    ]));
  });

  it("prevents privilege escalation through role management", async () => {
    expectDenied(await request(`/api/users/${actor._id}`, "PUT", actorToken, {
      roles: [{ roleId: operatorRole._id, dep: districtDep(localSchool) }],
    }), "You cannot change your own role assignments");
    expectDenied(await request(`/api/roles/${operatorRole._id}`, "DELETE", actorToken), "Assigned roles cannot be deleted");
    expectDenied(await request(`/api/roles/${operatorRole._id}`, "PUT", actorToken, {
      scopeType: "STATE",
    }), "Roles assigned to your account cannot be edited");
    expectDenied(await request("/api/roles", "POST", actorToken, {
      name: `Escalated role ${suffix}`,
      description: "",
      permissions: ["generation.status.view"],
      scopeType: "UNBOUND",
    }), "Cannot grant permissions you do not hold");
  });

  it("allows explicit permission delegation regardless of delegate scope", async () => {
    const role = expectSuccess(await request("/api/roles", "POST", delegateToken, {
      name: `Delegated role ${suffix}`,
      description: "",
      permissions: ["generation.status.view"],
      scopeType: "SCHOOL",
    }));
    ids.roles.push(role._id);

    const updated = expectSuccess(await request(`/api/roles/${role._id}`, "PUT", delegateToken, {
      permissions: ["chat.use"],
    }));
    expect(updated.permissions).toEqual(["chat.use"]);
  });
});
