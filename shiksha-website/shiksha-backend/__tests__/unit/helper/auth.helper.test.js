const authHelper = require('../../../helper/auth.helper');
const variforrmSMSService = require('../../../services/variform.service');

jest.mock('../../../services/variform.service');

describe('AuthHelper', () => {
    const devtools = process.env.SHIKSHA_DEVTOOLS;

    beforeEach(() => {
        process.env.SHIKSHA_DEVTOOLS = 'false';
        jest.clearAllMocks();
        authHelper.clearSms('1234567890');
    });

    afterAll(() => {
        if (devtools === undefined) delete process.env.SHIKSHA_DEVTOOLS;
        else process.env.SHIKSHA_DEVTOOLS = devtools;
    });

    describe('getOtp', () => {
        it('should generate a 4-digit OTP', () => {
            const otp = authHelper.getOtp();

            expect(otp).toBeDefined();
            expect(otp).toHaveLength(4);
            expect(parseInt(otp)).toBeGreaterThanOrEqual(1000);
            expect(parseInt(otp)).toBeLessThan(10000);
        });

        it('should generate different OTPs on multiple calls', () => {
            const otp1 = authHelper.getOtp();
            const otp2 = authHelper.getOtp();

            expect(typeof otp1).toBe('string');
            expect(typeof otp2).toBe('string');
        });
    });

    describe('sendOtp', () => {
        it('should send OTP successfully', async () => {
            const mockResponse = { success: true, message: 'OTP sent' };
            variforrmSMSService.mockResolvedValue(mockResponse);

            const result = await authHelper.sendOtp('template123', '1234567890', '1234');

            expect(variforrmSMSService).toHaveBeenCalledWith('template123', '1234567890', '1234');
            expect(result).toEqual(mockResponse);
        });

        it('should throw error when SMS service fails', async () => {
            const error = new Error('SMS service error');
            variforrmSMSService.mockRejectedValue(error);

            await expect(authHelper.sendOtp('template123', '1234567890', '1234'))
                .rejects.toThrow('SMS service error');
        });

        it('should capture SMS when devtools are enabled', async () => {
            process.env.SHIKSHA_DEVTOOLS = 'true';

            const result = await authHelper.sendOtp('template123', '1234567890', '7476');

            expect(variforrmSMSService).not.toHaveBeenCalled();
            expect(result).toEqual({ success: true, message: 'SMS captured by devtools' });
            expect(authHelper.getLatestSms('1234567890')).toMatchObject({ phone: '1234567890', pin: '7476' });
        });
    });

    describe('validateOtp', () => {
        it('should return true when OTPs match', () => {
            const result = authHelper.validateOtp('1234', '1234');
            expect(result).toBe(true);
        });

        it('should return false when OTPs do not match', () => {
            const result = authHelper.validateOtp('1234', '5678');
            expect(result).toBe(false);
        });

        it('should return false when OTP is undefined', () => {
            const result = authHelper.validateOtp(undefined, '1234');
            expect(result).toBe(false);
        });

        it('should return false when OTP is null', () => {
            const result = authHelper.validateOtp(null, '1234');
            expect(result).toBe(false);
        });
    });
});
