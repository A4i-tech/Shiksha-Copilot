const MasterClassController = require('../../../controllers/master.class.controller');

describe('MasterClassController', () => {
    let controller;

    beforeEach(() => {
        controller = new MasterClassController();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should be an instance of MasterClassController', () => {
        expect(controller).toBeInstanceOf(MasterClassController);
    });
});
