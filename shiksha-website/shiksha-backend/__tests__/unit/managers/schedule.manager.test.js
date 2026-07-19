const ScheduleManager = require("../../../managers/schedule.manager");
const ScheduleDao = require("../../../dao/schedule.dao");
const overlap = require("../../../helper/overlap");

jest.mock("../../../dao/schedule.dao");
jest.mock("../../../helper/overlap");

const request = (scheduleDateTime) => ({
  user: { _id: "teacher-1", roles: [{ role: { scopeType: "SCHOOL" }, dep: "school-1" }] },
  body: { teacherId: "other-teacher", schoolId: "other-school", scheduleDateTime, class: 5, board: "board", medium: "English" },
});

describe("ScheduleManager.create", () => {
  let manager;
  let dao;

  beforeEach(() => {
    jest.clearAllMocks();
    dao = { create: jest.fn().mockResolvedValue({ _id: "schedule-1" }), getParallelSchedules: jest.fn().mockResolvedValue({ canSchedule: true }) };
    ScheduleDao.mockImplementation(() => dao);
    overlap.mockReturnValue(false);
    manager = new ScheduleManager();
  });

  it("uses the authenticated teacher and role dependency", async () => {
    const req = request([{ date: "2024-01-01", fromTime: "09:00", toTime: "10:00" }]);
    await manager.create(req);
    expect(dao.create).toHaveBeenCalledWith({ ...req.body, teacherId: "teacher-1", schoolId: "school-1" });
  });

  it("rejects overlapping entries", async () => {
    overlap.mockReturnValue(true);
    await expect(manager.create(request([]))).resolves.toMatchObject({ success: false, message: "Overlap in entries" });
    expect(dao.create).not.toHaveBeenCalled();
  });

  it("rejects duplicate time slots", async () => {
    const slot = { date: "2024-01-01", fromTime: "09:00", toTime: "10:00" };
    await expect(manager.create(request([slot, slot]))).resolves.toMatchObject({ success: false, message: "Duplicate time slot detected" });
  });
});
