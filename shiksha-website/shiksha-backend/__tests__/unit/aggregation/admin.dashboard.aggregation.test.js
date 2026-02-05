const adminDashboardAggregation = require('../../../aggregation/admin.dashboard.aggregation');

describe('Admin Dashboard Aggregation', () => {
    it('should be defined', () => {
        expect(adminDashboardAggregation).toBeDefined();
    });

    it('should be an object', () => {
        expect(typeof adminDashboardAggregation).toBe('object');
    });
});
