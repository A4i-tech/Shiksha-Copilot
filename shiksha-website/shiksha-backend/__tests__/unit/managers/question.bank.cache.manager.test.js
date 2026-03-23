const QuestionBankCacheManager = require('../../../managers/question.bank.cache.manager');

describe('QuestionBankCacheManager', () => {
    let manager;

    beforeEach(() => {
        manager = new QuestionBankCacheManager();
    });

    it('should be defined', () => {
        expect(manager).toBeDefined();
    });

    it('should be an instance of QuestionBankCacheManager', () => {
        expect(manager).toBeInstanceOf(QuestionBankCacheManager);
    });
});
