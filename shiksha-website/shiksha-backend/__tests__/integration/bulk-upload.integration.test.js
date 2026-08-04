require("dotenv").config();

const axios = require("axios");
const ExcelJS = require("exceljs");
const FormData = require("form-data");

const baseUrl = process.env.SHIKSHA_BASE_URL;
const superuserPhone = process.env.SHIKSHA_SU_PHONE;
const superuserPin = process.env.SHIKSHA_SU_PIN;
const spreadsheetType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

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
  expect(response).toMatchObject({ status: 200 });
  if ("success" in response.body) expect(response.body.success).toBe(true);
  return response.body.data;
}

async function upload(path, token, workbook, filename) {
  const form = new FormData();
  form.append("file", Buffer.from(await workbook.xlsx.writeBuffer()), { filename, contentType: spreadsheetType });
  const response = await axios.post(`${baseUrl}${path}`, form, {
    headers: { Authorization: token, ...form.getHeaders() },
    validateStatus: () => true,
  });
  return { status: response.status, body: response.data };
}

describe("management bulk uploads", () => {
  const suffix = String(Date.now());
  const schoolCode = Number(`8${suffix.slice(-10)}`);
  const teacherPhone = `7${suffix.slice(-9)}`;
  const ids = { roles: [], users: [], schools: [], classes: [], auditLogs: [], content: [], activities: [], batches: [] };
  let token;
  let user;
  let school;
  let remoteSchool;
  let schoolRole;
  let elevatedSchoolRole;
  let scopedUser;
  let scopedToken;

  beforeAll(async () => {
    const login = expectSuccess(await request("/api/auth/validate-otp", "POST", null, { phone: superuserPhone, otp: superuserPin }));
    token = login.token;
    const [me, schools, roles] = await Promise.all([
      request("/api/auth/me", "GET", token),
      request("/api/school/list?limit=1000&includeDeleted=0", "GET", token),
      request("/api/roles?limit=1000", "GET", token),
    ]);
    user = expectSuccess(me).user;
    const schoolList = expectSuccess(schools).results;
    school = schoolList.find((item) => item.state && item.zone && item.district && item.block && item.boards?.length && item.mediums?.length);
    remoteSchool = schoolList.find((item) => item.district && item.district !== school.district && item.boards?.length && item.mediums?.length);
    schoolRole = expectSuccess(roles).results.find((role) => role.scopeType === "SCHOOL" && !role.permissions.includes("generation.status.view"));
    expect(school).toBeDefined();
    expect(remoteSchool).toBeDefined();
    expect(schoolRole).toBeDefined();

    const scopedRole = expectSuccess(await request("/api/roles", "POST", token, {
      name: `Bulk upload operator ${suffix}`,
      description: "Bulk upload integration fixture",
      permissions: ["audit.view", "school.create", "user.import"],
      scopeType: "DISTRICT",
    }));
    elevatedSchoolRole = expectSuccess(await request("/api/roles", "POST", token, {
      name: `Elevated school role ${suffix}`,
      description: "Bulk upload privilege escalation fixture",
      permissions: [...schoolRole.permissions, "generation.status.view"],
      scopeType: "SCHOOL",
    }));
    ids.roles.push(scopedRole._id, elevatedSchoolRole._id);
    scopedUser = expectSuccess(await request("/api/users", "POST", token, {
      identity: { name: "Bulk Upload Integration Operator", phone: `9${suffix.slice(-9)}`, email: "" },
      roles: [{ roleId: scopedRole._id, dep: { state: school.state, zone: school.zone, district: school.district } }],
      profiles: { admin: { state: school.state } },
    }));
    ids.users.push(scopedUser._id);
    scopedToken = expectSuccess(await request("/api/devtools/sessions", "POST", token, { userId: scopedUser._id })).token;
  });

  afterAll(async () => {
    if (token) await request("/api/devtools/fixtures", "DELETE", token, ids);
  });

  async function waitForImport(eventType, actorId, startedAt, statuses) {
    for (let attempt = 0; attempt < 60; attempt++) {
      const logs = expectSuccess(await request("/api/audit/log?limit=1000", "GET", token)).results;
      const matches = logs.filter((item) => item.eventType === eventType && item.userId === actorId && new Date(item.createdAt) >= startedAt);
      if (statuses.every((status) => matches.some((item) => item.status === status))) {
        ids.auditLogs.push(...matches.map((item) => item._id));
        return matches;
      }
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    throw new Error(`${eventType} did not complete`);
  }

  it("imports a school and its classes", async () => {
    const workbook = new ExcelJS.Workbook();
    const schoolSheet = workbook.addWorksheet("school");
    schoolSheet.addRow(["diseCode", "name", "board", "state", "zone", "district", "taluk", "medium", "academicYearStartDate", "academicYearEndDate"]);
    schoolSheet.addRow([schoolCode, `Bulk Upload School ${suffix}`, school.boards[0], school.state, school.zone, school.district, school.block, school.mediums[0], "2026-06-01", "2027-03-31"]);
    const classSheet = workbook.addWorksheet("class");
    classSheet.addRow(["diseCode", "board", "medium", "standard", "boys", "girls"]);
    classSheet.addRow([schoolCode, school.boards[0], school.mediums[0], 6, 12, 13]);

    const startedAt = new Date();
    expectSuccess(await upload("/api/school/bulk-upload", token, workbook, "schools.xlsx"));
    const [log] = await waitForImport("Schools Import", user._id, startedAt, ["success"]);
    expect(log).toMatchObject({ status: "success" });

    const schools = expectSuccess(await request(`/api/school/list?limit=10&search=${schoolCode}`, "GET", token)).results;
    expect(schools).toHaveLength(1);
    ids.schools.push(schools[0]._id);
    const imported = expectSuccess(await request(`/api/school/${schools[0]._id}`, "GET", token));
    expect(imported).toMatchObject({ schoolId: schoolCode, name: `Bulk Upload School ${suffix}` });
    expect(imported.classes).toEqual(expect.arrayContaining([
      expect.objectContaining({
        board: school.boards[0],
        medium: school.mediums[0],
        classDetails: expect.arrayContaining([expect.objectContaining({ standard: 6, boysStrength: 12, girlsStrength: 13 })]),
      }),
    ]));
    ids.classes.push(...imported.classes.map((item) => item._id));
  }, 60000);

  it("imports a teacher with a school assignment", async () => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("teacher");
    sheet.addRow(["name", "phone", "diseCode", "role"]);
    sheet.addRow([`Bulk Upload Teacher ${suffix}`, teacherPhone, school.schoolId, schoolRole.name]);

    const startedAt = new Date();
    expectSuccess(await upload("/api/users/import", token, workbook, "teachers.xlsx"));
    const [log] = await waitForImport("Teachers Import", user._id, startedAt, ["success"]);
    expect(log).toMatchObject({ status: "success" });

    const teachers = expectSuccess(await request(`/api/users?limit=10&filter[profileType]=teacher&search=${teacherPhone}`, "GET", token)).results;
    expect(teachers).toHaveLength(1);
    ids.users.push(teachers[0]._id);
    const imported = expectSuccess(await request(`/api/users/${teachers[0]._id}`, "GET", token));
    expect(imported).toMatchObject({
      identity: { name: `Bulk Upload Teacher ${suffix}`, phone: teacherPhone },
      roles: [expect.objectContaining({ dep: school._id, role: expect.objectContaining({ _id: schoolRole._id }) })],
    });
  }, 60000);

  it("imports only teachers inside the operator scope", async () => {
    const localPhone = `6${suffix.slice(-9)}`;
    const remotePhone = `8${suffix.slice(-9)}`;
    const elevatedPhone = `7${String(Number(suffix) + 1).slice(-9)}`;
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("teacher");
    sheet.addRow(["name", "phone", "diseCode", "role"]);
    sheet.addRow([`Local Scoped Teacher ${suffix}`, localPhone, school.schoolId, schoolRole.name]);
    sheet.addRow([`Remote Scoped Teacher ${suffix}`, remotePhone, remoteSchool.schoolId, schoolRole.name]);
    sheet.addRow([`Elevated Scoped Teacher ${suffix}`, elevatedPhone, school.schoolId, elevatedSchoolRole.name]);

    const startedAt = new Date();
    expectSuccess(await upload("/api/users/import", scopedToken, workbook, "scoped-teachers.xlsx"));
    const logs = await waitForImport("Teachers Import", scopedUser._id, startedAt, ["success", "failure"]);
    const failureLog = logs.find((item) => item.status === "failure");
    const errorWorkbook = new ExcelJS.Workbook();
    await errorWorkbook.xlsx.load((await axios.get(failureLog.logUrl, { responseType: "arraybuffer" })).data);
    expect(errorWorkbook.getWorksheet("Validation Errors").getColumn(2).values).toContain(
      `School with diseCode ${remoteSchool.schoolId} is outside your scope`
    );

    const local = expectSuccess(await request("/api/users/lookup", "POST", token, { phone: localPhone }));
    const remote = await request("/api/users/lookup", "POST", token, { phone: remotePhone });
    const elevated = expectSuccess(await request("/api/users/lookup", "POST", token, { phone: elevatedPhone }));
    expect(local.identity.phone).toBe(localPhone);
    expect(remote.body.success).toBe(false);
    expect(elevated.identity.phone).toBe(elevatedPhone);
    ids.users.push(local._id, elevated._id);
  }, 60000);

  it("imports only schools inside the operator scope", async () => {
    const localCode = Number(`7${suffix.slice(-10)}`);
    const remoteCode = Number(`6${suffix.slice(-10)}`);
    const workbook = new ExcelJS.Workbook();
    const schoolSheet = workbook.addWorksheet("school");
    schoolSheet.addRow(["diseCode", "name", "board", "state", "zone", "district", "taluk", "medium", "academicYearStartDate", "academicYearEndDate"]);
    schoolSheet.addRow([localCode, `Local Scoped School ${suffix}`, school.boards[0], school.state, school.zone, school.district, school.block, school.mediums[0], "2026-06-01", "2027-03-31"]);
    schoolSheet.addRow([remoteCode, `Remote Scoped School ${suffix}`, remoteSchool.boards[0], remoteSchool.state, remoteSchool.zone, remoteSchool.district, remoteSchool.block, remoteSchool.mediums[0], "2026-06-01", "2027-03-31"]);
    workbook.addWorksheet("class").addRow(["diseCode", "board", "medium", "standard", "boys", "girls"]);

    const startedAt = new Date();
    expectSuccess(await upload("/api/school/bulk-upload", scopedToken, workbook, "scoped-schools.xlsx"));
    const [log] = await waitForImport("Schools Import", scopedUser._id, startedAt, ["success"]);
    const summary = new ExcelJS.Workbook();
    await summary.xlsx.load((await axios.get(log.logUrl, { responseType: "arraybuffer" })).data);
    expect(summary.getWorksheet("Errors").getColumn(2).values).toContain("School is outside your scope");

    const local = expectSuccess(await request(`/api/school/list?limit=10&search=${localCode}`, "GET", token)).results;
    const remote = expectSuccess(await request(`/api/school/list?limit=10&search=${remoteCode}`, "GET", token)).results;
    expect(local).toHaveLength(1);
    expect(remote).toHaveLength(0);
    ids.schools.push(local[0]._id);
  }, 60000);
});
