const { intersectFilters } = require("../../../helper/scope.helper");

describe("intersectFilters", () => {
	const scope = { schoolId: "s1" };

	it("returns the scope when the caller sent no filter", () => {
		expect(intersectFilters(undefined, scope)).toEqual(scope);
	});

	it("ands a caller filter with the scope so the caller cannot widen it", () => {
		expect(intersectFilters({ schoolId: "s2" }, scope)).toEqual({ $and: [{ schoolId: "s2" }, scope] });
	});

	it("returns the caller filter for an unscoped grant", () => {
		expect(intersectFilters({ a: 1 }, {})).toEqual({ a: 1 });
	});
});
