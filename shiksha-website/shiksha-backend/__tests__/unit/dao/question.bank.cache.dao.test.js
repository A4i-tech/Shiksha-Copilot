const QuestionBankCacheDao = require('../../../dao/question.bank.cache.dao');

describe('QuestionBankCacheDao', () => {
    let dao;

    beforeEach(() => {
        dao = new QuestionBankCacheDao();
    });

    it('should be defined', () => {
        expect(dao).toBeDefined();
    });

    it('should be an instance of QuestionBankCacheDao', () => {
        expect(dao).toBeInstanceOf(QuestionBankCacheDao);
    });
});
