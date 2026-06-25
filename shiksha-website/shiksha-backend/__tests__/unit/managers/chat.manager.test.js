const ChatManager = require('../../../managers/chat.manager');
const ChatDao = require('../../../dao/chat.dao');
const { CHAT_LIMIT } = require('../../../config/constants');

jest.mock('../../../dao/chat.dao');
jest.mock('../../../dao/chapter.dao');
jest.mock('../../../dao/master.subject.dao');
jest.mock('../../../dao/teacher.lesson.plan.dao');
jest.mock('../../../dao/master.lesson.dao');
jest.mock('../../../services/chat.bot.service');

describe('ChatManager', () => {
    let chatManager;
    let mockChatDao;

    beforeEach(() => {
        chatManager = new ChatManager();
        mockChatDao = {
            getActiveSession: jest.fn(),
            create: jest.fn(),
            createMessage: jest.fn(),
            getMessagesBySessionId: jest.fn()
        };
        chatManager.dao = mockChatDao;
        chatManager.getTotalSessionMessagesCount = jest.fn();
        jest.clearAllMocks();
    });

    describe('sendMessage', () => {
        it('should create new chat session when none exists', async () => {
            const userId = 'user123';
            const message = 'Hello';
            const mockSession = { _id: 'session123' };

            mockChatDao.getActiveSession.mockResolvedValue(null);
            mockChatDao.create.mockResolvedValue(mockSession);
            mockChatDao.createMessage.mockResolvedValue({});
            chatManager.getTotalSessionMessagesCount.mockResolvedValue(0);
            mockChatDao.getMessagesBySessionId.mockResolvedValue({ messages: [] });

            await chatManager.sendMessage(userId, message);

            expect(mockChatDao.getActiveSession).toHaveBeenCalledWith(userId, expect.any(Date));
            expect(mockChatDao.create).toHaveBeenCalled();
            expect(mockChatDao.createMessage).toHaveBeenCalledWith({
                chatHistoryId: mockSession._id,
                messages: []
            });
        });

        it('should return error when chat limit is exceeded', async () => {
            const userId = 'user123';
            const message = 'Hello';
            const mockSession = { _id: 'session123' };

            mockChatDao.getActiveSession.mockResolvedValue(mockSession);
            chatManager.getTotalSessionMessagesCount.mockResolvedValue(CHAT_LIMIT);

            const result = await chatManager.sendMessage(userId, message);

            expect(result.success).toBe(false);
            expect(result.message).toBe('Session closed due to request limit exceeded');
        });

        it('should use existing session when available', async () => {
            const userId = 'user123';
            const message = 'Hello';
            const mockSession = { _id: 'session123' };

            mockChatDao.getActiveSession.mockResolvedValue(mockSession);
            chatManager.getTotalSessionMessagesCount.mockResolvedValue(5);
            mockChatDao.getMessagesBySessionId.mockResolvedValue({ messages: [] });

            await chatManager.sendMessage(userId, message);

            expect(mockChatDao.create).not.toHaveBeenCalled();
            expect(mockChatDao.getMessagesBySessionId).toHaveBeenCalledWith(mockSession._id);
        });
    });
});
