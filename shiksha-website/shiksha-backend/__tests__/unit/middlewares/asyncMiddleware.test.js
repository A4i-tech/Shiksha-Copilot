const asyncMiddleware = require('../../../middlewares/asyncMiddleware');

describe('asyncMiddleware', () => {
    let mockReq;
    let mockRes;
    let mockNext;

    beforeEach(() => {
        mockReq = {};
        mockRes = {};
        mockNext = jest.fn();
        jest.clearAllMocks();
        console.error = jest.fn();
    });

    it('should call handler with req and res', async () => {
        const mockHandler = jest.fn().mockResolvedValue(undefined);
        const middleware = asyncMiddleware(mockHandler);

        await middleware(mockReq, mockRes, mockNext);

        expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when handler throws', async () => {
        const error = new Error('Handler error');
        const mockHandler = jest.fn().mockRejectedValue(error);
        const middleware = asyncMiddleware(mockHandler);

        await middleware(mockReq, mockRes, mockNext);

        expect(mockHandler).toHaveBeenCalledWith(mockReq, mockRes);
        expect(console.error).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledWith(error);
    });

    it('should handle synchronous errors', async () => {
        const error = new Error('Sync error');
        const mockHandler = jest.fn(() => {
            throw error;
        });
        const middleware = asyncMiddleware(mockHandler);

        await middleware(mockReq, mockRes, mockNext);

        expect(console.error).toHaveBeenCalledWith(error);
        expect(mockNext).toHaveBeenCalledWith(error);
    });
});
