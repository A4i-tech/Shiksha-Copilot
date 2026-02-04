const SchoolClassController = require('../../../controllers/school.class.controller');

describe('SchoolClassController', () => {
    let controller;

    beforeEach(() => {
        controller = new SchoolClassController();
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('should be an instance of SchoolClassController', () => {
        expect(controller).toBeInstanceOf(SchoolClassController);
    });
});
