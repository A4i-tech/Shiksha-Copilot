/**
 * Mock implementation of SMS service (Variform)
 * Used to avoid actual SMS sending during testing
 */

const mockSendOTP = jest.fn().mockResolvedValue({
  success: true,
  messageId: 'mock-message-id-12345',
  message: 'OTP sent successfully',
  phone: '9876543210',
});

const mockVerifyOTP = jest.fn().mockResolvedValue({
  success: true,
  verified: true,
  message: 'OTP verified successfully',
});

const mockSendSMS = jest.fn().mockResolvedValue({
  success: true,
  messageId: 'mock-message-id-67890',
  message: 'SMS sent successfully',
  recipient: '9876543210',
});

const VariformService = {
  sendOTP: mockSendOTP,
  verifyOTP: mockVerifyOTP,
  sendSMS: mockSendSMS,
};

module.exports = VariformService;
module.exports.mockSendOTP = mockSendOTP;
module.exports.mockVerifyOTP = mockVerifyOTP;
module.exports.mockSendSMS = mockSendSMS;
