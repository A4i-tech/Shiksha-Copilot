const QuestionBankDao = require('../../../dao/question.bank.dao');

describe('QuestionBankDao', () => {
    let dao;

    beforeEach(() => {
        dao = new QuestionBankDao();
    });

    it('should be defined', () => {
        expect(dao).toBeDefined();
    });

    it('should be an instance of QuestionBankDao', () => {
        expect(dao).toBeInstanceOf(QuestionBankDao);
    });
});
