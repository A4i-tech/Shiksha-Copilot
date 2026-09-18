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
});
