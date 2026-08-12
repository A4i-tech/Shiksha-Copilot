const handleError = require('../helper/handleError.js');
const ChatManager = require('../managers/chat.manager.js');
const BaseController = require('./base.controller.js');

/** @extends {BaseController<ChatManager>} */
class ChatController extends BaseController {
    constructor() {
        super(new ChatManager());
    }

    async sendMessage(req, res) {
        const { message } = req.body;
        const userId = req.user._id;

        const result = await this.manager.sendMessageStream(userId, message);

        if (!result.success) {
            return res.status(404).json({ message: result.message, data: result.error });
        }

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        result.stream.pipe(res);

        result.stream.on('error', (err) => {
            console.error('Stream error in controller', err);
            res.end();
        });
    }

    async listMessages(req, res) {
        const userId = req.user._id;
        const result = await this.manager.listMessages(userId);
        if (!result.success) {
            return res.status(404).json({ message: result.message, data: result.data });
        }
        return res.status(200).json({ message: result.message, data: result.data });
    }

    async restartSession(req, res) {
        const result = await this.manager.restartSession(req.user._id);
        if (!result.success) {
            return res.status(400).json({ message: result.message, data: result.data });
        }
        return res.status(200).json({ message: result.message, data: result.data });
    }

    async sendLessonMessage(req, res) {
        const { recordId, chapterId } = req.params;
        const userId = req.user._id;
        const { message } = req.body;
        const result = await this.manager.sendLessonMessage(userId, recordId, chapterId, message);
        if (!result.success) {
            return res.status(404).json({ message: result.message, data: result.data });
        }
        return res.status(200).json({ message: result.message, data: result.data });
    }

    async listLessonMessages(req, res) {
        const { recordId, chapterId } = req.params;
        const userId = req.user._id;
        const result = await this.manager.listLessonMessages(recordId, chapterId, userId);
        if (!result.success) {
            return res.status(404).json({ message: result.message, data: result.data });
        }
        return res.status(200).json({ message: result.message, data: result.data });
    }
}

module.exports = ChatController;
