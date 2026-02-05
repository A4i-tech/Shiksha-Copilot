const userAggregation = require('../../../aggregation/user.aggregation');
const User = require('../../../models/user.model');

jest.mock('../../../models/user.model');

describe('User Aggregation', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(userAggregation).toBeDefined();
    });

    it('should be an object', () => {
        expect(typeof userAggregation).toBe('object');
    });
});
