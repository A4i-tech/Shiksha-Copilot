const schoolClassAggregation = require('../../../aggregation/school.class.aggregation');

describe('School Class Aggregation', () => {
    it('should be defined', () => {
        expect(schoolClassAggregation).toBeDefined();
    });

    it('should be an object', () => {
        expect(typeof schoolClassAggregation).toBe('object');
    });
});
