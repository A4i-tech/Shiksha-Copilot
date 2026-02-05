const AdminUserDao = require('../../../dao/admin.user.dao');

describe('AdminUserDao', () => {
    let dao;

    beforeEach(() => {
        dao = new AdminUserDao();
    });

    it('should be defined', () => {
        expect(dao).toBeDefined();
    });

    it('should be an instance of AdminUserDao', () => {
        expect(dao).toBeInstanceOf(AdminUserDao);
    });
});
