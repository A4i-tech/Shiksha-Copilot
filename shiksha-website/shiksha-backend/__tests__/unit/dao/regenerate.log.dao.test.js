const RegenerateLogDao = require('../../../dao/regenerate.log.dao');

describe('RegenerateLogDao', () => {
    let dao;

    beforeEach(() => {
        dao = new RegenerateLogDao();
    });

    it('should be defined', () => {
        expect(dao).toBeDefined();
    });

    it('should be an instance of RegenerateLogDao', () => {
        expect(dao).toBeInstanceOf(RegenerateLogDao);
    });
});
