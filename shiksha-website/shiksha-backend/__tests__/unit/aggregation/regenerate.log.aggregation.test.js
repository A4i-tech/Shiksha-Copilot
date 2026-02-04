const regenerateLogAggregation = require('../../../aggregation/regenerate.log.aggregation');

describe('Regenerate Log Aggregation', () => {
    it('should be defined', () => {
        expect(regenerateLogAggregation).toBeDefined();
    });

    it('should be an object', () => {
        expect(typeof regenerateLogAggregation).toBe('object');
    });
});
