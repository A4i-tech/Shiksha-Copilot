jest.mock("../../../helper/superset.helper.js", () => ({ supersetGet: jest.fn() }));
jest.mock("../../../helper/dashboard.boards.js", () => ({ ...jest.requireActual("../../../helper/dashboard.boards.js"), saveBoard: jest.fn() }));

const CHARTS = require("../../../config/analytics.charts.json");


describe("dashboard sync", () => {
  let sync;
  let supersetGet;
  let saveBoard;

  beforeEach(() => {
    jest.resetModules();
    jest.spyOn(console, "warn").mockImplementation(() => {});
    jest.spyOn(console, "error").mockImplementation(() => {});
    ({ supersetGet } = require("../../../helper/superset.helper.js"));
    ({ saveBoard } = require("../../../helper/dashboard.boards.js"));
    sync = require("../../../helper/dashboard.sync");
  });
  afterEach(() => jest.restoreAllMocks());

  describe("pairBoards", () => {
    it("pairs a board with its -mobile twin and ignores slugs without the board- prefix", () => {
      const dashboards = [
        { id: 1, slug: "board-full" },
        { id: 2, slug: "board-full-mobile" },
        { id: 3, slug: "board-restricted" },
        { id: 4, slug: "my-board-x" },
      ];
      expect(sync.pairBoards(dashboards)).toEqual([
        { boardKey: "full", desktop: dashboards[0], mobile: dashboards[1] },
        { boardKey: "restricted", desktop: dashboards[2], mobile: null },
      ]);
    });
  });

  describe("syncBoards", () => {
    const keys = ["content_type_mix", "active_inactive_users"];
    const dashboards = {
      1: { slug: "board-ok", charts: keys, uuid: "ok-d" },
      2: { slug: "board-ok-mobile", charts: keys, uuid: "ok-m" },
      3: { slug: "board-alone", charts: keys, uuid: "alone-d" },
      4: { slug: "board-unknown", charts: ["not_in_catalog"], uuid: "unknown-d" },
      5: { slug: "board-twin", charts: keys, uuid: "twin-d" },
      6: { slug: "board-twin-mobile", charts: [keys[0]], uuid: "twin-m" },
    };
    beforeEach(() => {
      supersetGet.mockImplementation(async (path) => {
        if (path.startsWith("/dashboard/?q=")) return Object.entries(dashboards).map(([id, d]) => ({ id: Number(id), slug: d.slug }));
        const [, id, kind] = path.match(/^\/dashboard\/(\d+)\/(charts|embedded)$/);
        const d = dashboards[id];
        return kind === "embedded" ? { uuid: d.uuid } : d.charts.map((key) => ({ slice_name: CHARTS.find((chart) => chart.key === key)?.sliceName ?? "Unknown chart" }));
      });
    });

    it("saves boards that match, and skips unknown charts and mobile twins with other charts", async () => {
      expect(await sync.syncBoards()).toEqual(["ok", "alone"]);
      expect(saveBoard).toHaveBeenCalledWith({ boardKey: "ok", chartKeys: keys, desktopUuid: "ok-d", mobileUuid: "ok-m" });
      expect(saveBoard).toHaveBeenCalledWith({ boardKey: "alone", chartKeys: keys, desktopUuid: "alone-d", mobileUuid: null });
      expect(saveBoard).toHaveBeenCalledTimes(2);
    });

    it("runs once inside the throttle window and does not throw when Superset fails", async () => {
      supersetGet.mockRejectedValue(new Error("Superset down"));
      await sync.refreshBoards();
      await sync.refreshBoards();
      expect(supersetGet).toHaveBeenCalledTimes(1);
    });

    it("lets the retry path run a minute after a failed run, not sooner", async () => {
      const now = jest.spyOn(Date, "now").mockReturnValue(1_000_000_000);
      supersetGet.mockRejectedValue(new Error("Superset down"));
      await sync.refreshBoards();
      now.mockReturnValue(1_000_000_000 + 30_000);
      await sync.refreshBoards(true);
      expect(supersetGet).toHaveBeenCalledTimes(1);
      now.mockReturnValue(1_000_000_000 + 61_000);
      await sync.refreshBoards(true);
      expect(supersetGet).toHaveBeenCalledTimes(2);
    });
  });
});
