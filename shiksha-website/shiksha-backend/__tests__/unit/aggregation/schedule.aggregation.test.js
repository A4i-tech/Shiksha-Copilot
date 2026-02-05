const scheduleAggregation = require('../../../aggregation/schedule.aggreagtion');

describe('Schedule Aggregation', () => {
    it('should be defined', () => {
        expect(scheduleAggregation).toBeDefined();
    });

    it('should be an object', () => {
        expect(typeof scheduleAggregation).toBe('object');
    });
});
