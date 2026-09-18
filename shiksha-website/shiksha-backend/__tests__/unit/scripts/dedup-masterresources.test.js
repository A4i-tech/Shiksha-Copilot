const fs = require("fs");
const path = require("path");
const { MongoMemoryReplSet } = require("mongodb-memory-server");
const { groupKey, pickCanonical } = require("../../../scripts/dedup-masterresources");

describe("dedup-masterresources", () => {
	describe("groupKey", () => {
		it("joins the identity fields in a fixed order", () => {
			const doc = { board: "KSEEB", class: 8, subject: "Science", medium: "english", lessonName: "Nutrition", isAll: true };
			expect(groupKey(doc)).toBe("KSEEB|8|Science|english|Nutrition|true");
		});

		it("does not include chapterId or subTopics - a duplicate can differ on those", () => {
			const a = { board: "KSEEB", class: 8, subject: "Science", medium: "english", lessonName: "Nutrition", isAll: true, chapterId: "id-1", subTopics: ["A"] };
			const b = { board: "KSEEB", class: 8, subject: "Science", medium: "english", lessonName: "Nutrition", isAll: true, chapterId: "id-2", subTopics: ["B"] };
			expect(groupKey(a)).toBe(groupKey(b));
		});
	});

	describe("pickCanonical", () => {
		it("keeps the doc with more combined resources + additionalResources", () => {
			const richer = { _id: "b", resources: [1, 2], additionalResources: [1] };
			const thinner = { _id: "a", resources: [1] };
			expect(pickCanonical([thinner, richer])._id).toBe("b");
		});

		it("tie-breaks on the lexicographically smaller _id when content counts match", () => {
			const first = { _id: "aaa", resources: [1] };
			const second = { _id: "bbb", resources: [1] };
			expect(pickCanonical([second, first])._id).toBe("aaa");
		});

		it("treats missing resources/additionalResources arrays as zero content", () => {
			const withContent = { _id: "b", resources: [1] };
			const withoutContent = { _id: "a" };
			expect(pickCanonical([withoutContent, withContent])._id).toBe("b");
		});
	});

	// Real transaction against a real replica set: run()'s highest-risk behavior
	// (bulkWrite repoint + delete + subTopics fix, all inside one transaction)
	// only proves out against real writes, mocking Mongo here would just
	// assert the mock was called and miss a wrong filter/update shape.
	describe("run", () => {
		let replSet;
		let run;
		let freshMongoose;
		let MasterResource;
		let TeacherLessonPlan;
		let TeacherResourceFeedback;
		let consoleLogSpy;
		let consoleErrorSpy;

		beforeAll(async () => {
			replSet = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
			await replSet.waitUntilRunning();
			process.env.MONGO_URL = replSet.getUri();
			process.argv.push("--apply");
			jest.resetModules();
			// resetModules gives every subsequent require() a fresh module registry,
			// including a fresh mongoose singleton - re-require it here too so the
			// connection this test opens is the SAME singleton the models/script use.
			freshMongoose = require("mongoose");
			({ run } = require("../../../scripts/dedup-masterresources"));
			MasterResource = require("../../../models/master.resource.model");
			TeacherLessonPlan = require("../../../models/teacher.lesson.plan.model");
			TeacherResourceFeedback = require("../../../models/feedback.resource.model");
			await freshMongoose.connect(process.env.MONGO_URL);
		});

		afterAll(async () => {
			if (freshMongoose.connection.readyState !== 0) await freshMongoose.disconnect();
			await replSet.stop();
			process.argv = process.argv.filter((arg) => arg !== "--apply");
			delete process.env.MONGO_URL;
		});

		beforeEach(() => {
			consoleLogSpy = jest.spyOn(console, "log").mockImplementation(() => {});
			consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
		});

		afterEach(async () => {
			// run() disconnects mongoose itself on completion; only one test in
			// this block, so no cross-test DB cleanup is needed here.
			const logFiles = fs
				.readdirSync(path.join(__dirname, "../../../scripts"))
				.filter((f) => f.startsWith("dedup-log-"));
			for (const f of logFiles) fs.unlinkSync(path.join(__dirname, "../../../scripts", f));
			jest.restoreAllMocks();
		});

		it("keeps the richer duplicate, repoints references, deletes the loser, and normalizes malformed subTopics", async () => {
			const identity = { board: "KSEEB", class: 8, subject: "Science", medium: "english", lessonName: "Nutrition", isAll: true };
			const thin = await MasterResource.create({ ...identity, semester: "1", chapterId: new freshMongoose.Types.ObjectId(), resources: [] });
			const rich = await MasterResource.create({ ...identity, semester: "1", chapterId: new freshMongoose.Types.ObjectId(), resources: [{ a: 1 }] });
			const malformed = await MasterResource.create({
				board: "CBSE", class: 9, subject: "Math", medium: "english", lessonName: "Algebra", isAll: false,
				semester: "1", chapterId: new freshMongoose.Types.ObjectId(), subTopics: ["Valid", "  ", "", "Another"],
			});

			const planRef = await TeacherLessonPlan.create({ teacherId: new freshMongoose.Types.ObjectId(), resourceId: thin._id });
			const feedbackRef = await TeacherResourceFeedback.create({ teacherId: new freshMongoose.Types.ObjectId(), resourceId: thin._id });

			await run();
			await freshMongoose.connect(process.env.MONGO_URL); // run() disconnects on completion; reconnect to assert

			expect(await MasterResource.findById(thin._id)).toBeNull();
			expect(await MasterResource.findById(rich._id)).toBeTruthy();

			const updatedPlan = await TeacherLessonPlan.findById(planRef._id);
			expect(updatedPlan.resourceId.toString()).toBe(rich._id.toString());

			const updatedFeedback = await TeacherResourceFeedback.findById(feedbackRef._id);
			expect(updatedFeedback.resourceId.toString()).toBe(rich._id.toString());

			const fixed = await MasterResource.findById(malformed._id);
			expect(fixed.subTopics).toEqual(["Valid", "Another"]);
		});
	});
});
