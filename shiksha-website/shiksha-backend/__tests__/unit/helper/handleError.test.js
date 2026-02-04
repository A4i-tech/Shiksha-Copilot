const handleError = require('../../../helper/handleError');

describe('handleError', () => {
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis()
        };
        jest.clearAllMocks();
    });

    it('should return 401 when accessError is true', () => {
        const data = {
            success: false,
            message: 'Unauthorized',
            accessError: true
        };

        handleError(data, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: 'Unauthorized',
            accessError: undefined
        });
    });

    it('should return 400 when accessError is false', () => {
        const data = {
            success: false,
            message: 'Bad request',
            accessError: false
        };

        handleError(data, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: 'Bad request',
            accessError: undefined
        });
    });

    it('should return 400 when accessError is undefined', () => {
        const data = {
            success: false,
            message: 'Error occurred'
        };

        handleError(data, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: 'Error occurred',
            accessError: undefined
        });
    });
});
