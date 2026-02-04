const masterResourceAggregation = require('../../../aggregation/master.resource.aggregation');

describe('Master Resource Aggregation', () => {
    it('should be defined', () => {
        expect(masterResourceAggregation).toBeDefined();
    });

    it('should be an object', () => {
        expect(typeof masterResourceAggregation).toBe('object');
    });
});
