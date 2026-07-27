const AuthController = require('../../../controllers/auth.controller');
const AuthManager = require('../../../managers/auth.manager');
const handleError = require('../../../helper/handleError');

jest.mock('../../../managers/auth.manager');
jest.mock('../../../helper/handleError');

describe('AuthController', () => {
    let authController;
    let mockReq;
    let mockRes;
    let mockAuthManager;

    beforeEach(() => {
        authController = new AuthController();
        mockReq = {
            body: {},
            user: null
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            set: jest.fn().mockReturnThis()
        };
        mockAuthManager = {
            getOtp: jest.fn(),
            validateOtp: jest.fn(),
            getUserFromToken: jest.fn()
        };
        authController.authManager = mockAuthManager;
        jest.clearAllMocks();
    });

    describe('getOtp', () => {
        it('should return 200 when OTP is sent successfully', async () => {
            const mockResult = { success: true, message: 'OTP sent', data: null };
            mockAuthManager.getOtp.mockResolvedValue(mockResult);

            await authController.getOtp(mockReq, mockRes);

            expect(mockAuthManager.getOtp).toHaveBeenCalledWith(mockReq);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle error when OTP sending fails', async () => {
            const mockResult = { success: false, message: 'Failed to send OTP', data: null };
            mockAuthManager.getOtp.mockResolvedValue(mockResult);

            await authController.getOtp(mockReq, mockRes);

            expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
        });

        it('should propagate errors instead of responding directly', async () => {
            const error = new Error('Database error');
            mockAuthManager.getOtp.mockRejectedValue(error);

            await expect(authController.getOtp(mockReq, mockRes)).rejects.toThrow('Database error');
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });

    describe('validateOtp', () => {
        it('should return 200 when OTP is validated successfully', async () => {
            const mockResult = { success: true, message: 'OTP validated', data: { token: 'mock-token' } };
            mockAuthManager.validateOtp.mockResolvedValue(mockResult);

            await authController.validateOtp(mockReq, mockRes);

            expect(mockAuthManager.validateOtp).toHaveBeenCalledWith(mockReq);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockResult);
        });

        it('should handle error when OTP validation fails', async () => {
            const mockResult = { success: false, message: 'Invalid OTP', data: null };
            mockAuthManager.validateOtp.mockResolvedValue(mockResult);

            await authController.validateOtp(mockReq, mockRes);

            expect(handleError).toHaveBeenCalledWith(mockResult, mockRes);
        });

        it('should return 403 when CAPTCHA is required', async () => {
            const mockResult = {
                success: false,
                code: 'CAPTCHA_REQUIRED',
                message: 'Complete the CAPTCHA to continue.',
                data: null
            };
            mockAuthManager.validateOtp.mockResolvedValue(mockResult);

            await authController.validateOtp(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(403);
            expect(mockRes.json).toHaveBeenCalledWith(mockResult);
            expect(handleError).not.toHaveBeenCalled();
        });

        it('should return 423 when the account is locked', async () => {
            const mockResult = { success: false, code: 'LOGIN_LOCKED', data: null };
            mockAuthManager.validateOtp.mockResolvedValue(mockResult);

            await authController.validateOtp(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(423);
            expect(mockRes.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return 429 when login is temporarily locked', async () => {
            const mockResult = {
                success: false,
                code: 'LOGIN_LOCKED',
                data: { retryAfterSeconds: 300 }
            };
            mockAuthManager.validateOtp.mockResolvedValue(mockResult);

            await authController.validateOtp(mockReq, mockRes);

            expect(mockRes.set).toHaveBeenCalledWith('Retry-After', '300');
            expect(mockRes.status).toHaveBeenCalledWith(429);
        });

        it('should return 429 when recovery attempts are exhausted', async () => {
            const mockResult = {
                success: false,
                code: 'RECOVERY_LOCKED',
                data: { retryAfterSeconds: 120 }
            };
            mockAuthManager.validateOtp.mockResolvedValue(mockResult);

            await authController.validateOtp(mockReq, mockRes);

            expect(mockRes.set).toHaveBeenCalledWith('Retry-After', '120');
            expect(mockRes.status).toHaveBeenCalledWith(429);
        });

        it('should propagate errors instead of responding directly', async () => {
            const error = new Error('Database error');
            mockAuthManager.validateOtp.mockRejectedValue(error);

            await expect(authController.validateOtp(mockReq, mockRes)).rejects.toThrow('Database error');
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });

    describe('getUserFromToken', () => {
        it('should return 200 when user data is retrieved successfully', async () => {
            mockReq.user = { id: '123', phone: '1234567890' };
            const mockResult = { success: true, message: 'User data', data: { id: '123' } };
            mockAuthManager.getUserFromToken.mockResolvedValue(mockResult);

            await authController.getUserFromToken(mockReq, mockRes);

            expect(mockAuthManager.getUserFromToken).toHaveBeenCalledWith(mockReq);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockResult);
        });

        it('should return 401 when user is not authenticated', async () => {
            mockReq.user = null;

            await authController.getUserFromToken(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(401);
            expect(mockRes.json).toHaveBeenCalledWith({
                success: false,
                messaage: 'Token Expired!',
                data: null
            });
        });

        it('should propagate errors instead of responding directly', async () => {
            mockReq.user = { id: '123' };
            const error = new Error('Database error');
            mockAuthManager.getUserFromToken.mockRejectedValue(error);

            await expect(authController.getUserFromToken(mockReq, mockRes)).rejects.toThrow('Database error');
            expect(mockRes.status).not.toHaveBeenCalled();
        });
    });
});
