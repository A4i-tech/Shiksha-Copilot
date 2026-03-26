const ChatController = require('../../../controllers/chat.controller');
const ChatManager = require('../../../managers/chat.manager');
const handleError = require('../../../helper/handleError');

jest.mock('../../../managers/chat.manager');
jest.mock('../../../helper/handleError');

describe('ChatController', () => {
    let chatController;
    let mockReq;
    let mockRes;
    let mockChatManager;

    beforeEach(() => {
        chatController = new ChatController();
        mockReq = {
            body: {},
            params: {},
            query: {},
            user: { _id: 'user123' }
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
            setHeader: jest.fn().mockReturnThis()
        };
        mockChatManager = {
            sendMessage: jest.fn(),
            listMessages: jest.fn(),
            sendLessonMessage: jest.fn(),
            listLessonMessages: jest.fn()
        };
        chatController.chatManager = mockChatManager;
        jest.clearAllMocks();
    });

    describe('sendMessage', () => {
        let mockStream;

        beforeEach(() => {
            mockStream = {
                pipe: jest.fn(),
                on: jest.fn()
            };
        });

        it('should send message successfully', async () => {
            mockReq.body = { message: 'Hello' };
            const mockResult = {
                success: true,
                message: 'Message sent',
                stream: mockStream
            };
            mockChatManager.sendMessageStream = jest.fn().mockResolvedValue(mockResult);

            await chatController.sendMessage(mockReq, mockRes);

            expect(mockChatManager.sendMessageStream).toHaveBeenCalledWith('user123', 'Hello');
            expect(mockRes.setHeader).toHaveBeenCalledWith('Content-Type', 'text/event-stream');
            expect(mockRes.setHeader).toHaveBeenCalledWith('Cache-Control', 'no-cache');
            expect(mockRes.setHeader).toHaveBeenCalledWith('Connection', 'keep-alive');
            expect(mockStream.pipe).toHaveBeenCalledWith(mockRes);
        });

        it('should return 404 when sending fails', async () => {
            mockReq.body = { message: 'Hello' };
            const mockResult = { success: false, message: 'Failed', error: 'Database error' };
            mockChatManager.sendMessageStream = jest.fn().mockResolvedValue(mockResult);

            await chatController.sendMessage(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({
                message: 'Failed',
                data: 'Database error'
            });
        });
    });

    describe('listMessages', () => {
        it('should list messages successfully', async () => {
            const mockResult = { success: true, message: 'Messages found', data: [] };
            mockChatManager.listMessages.mockResolvedValue(mockResult);

            await chatController.listMessages(mockReq, mockRes);

            expect(mockChatManager.listMessages).toHaveBeenCalledWith('user123');
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });

    describe('sendLessonMessage', () => {
        it('should send lesson message successfully', async () => {
            mockReq.params = { recordId: 'record123', chapterId: 'chapter123' };
            mockReq.body = { message: 'Lesson message' };
            const mockResult = { success: true, message: 'Message sent', data: {} };
            mockChatManager.sendLessonMessage.mockResolvedValue(mockResult);

            await chatController.sendLessonMessage(mockReq, mockRes);

            expect(mockChatManager.sendLessonMessage).toHaveBeenCalledWith(
                'user123',
                'record123',
                'chapter123',
                'Lesson message'
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });

    describe('listLessonMessages', () => {
        it('should list lesson messages successfully', async () => {
            mockReq.params = { recordId: 'record123', chapterId: 'chapter123' };
            const mockResult = { success: true, message: 'Messages found', data: [] };
            mockChatManager.listLessonMessages.mockResolvedValue(mockResult);

            await chatController.listLessonMessages(mockReq, mockRes);

            expect(mockChatManager.listLessonMessages).toHaveBeenCalledWith(
                'record123',
                'chapter123',
                'user123',
                'en'
            );
            expect(mockRes.status).toHaveBeenCalledWith(200);
        });
    });
});
