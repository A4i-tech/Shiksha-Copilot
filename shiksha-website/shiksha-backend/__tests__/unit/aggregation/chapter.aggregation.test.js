const chapterAggregation = require('../../../aggregation/chapter.aggregation');

describe('Chapter Aggregation', () => {
    it('should be defined', () => {
        expect(chapterAggregation).toBeDefined();
    });

    it('should be an object', () => {
        expect(typeof chapterAggregation).toBe('object');
    });
});
