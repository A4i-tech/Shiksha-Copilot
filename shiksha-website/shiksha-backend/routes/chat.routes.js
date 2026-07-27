const express = require('express');
const router = express.Router();
const asyncMiddleware = require('../middlewares/asyncMiddleware.js');
const ChatController = require('../controllers/chat.controller.js');
const chatController = new ChatController();
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");


router.post(
    '/chat/message',
    isAuthenticated,
    requirePermission("chat.use"),
    asyncMiddleware(chatController.sendMessage.bind(chatController))
);

router.get(
    '/chat/messages',
    isAuthenticated,
    requirePermission("chat.use"),
    asyncMiddleware(chatController.listMessages.bind(chatController))
);

router.post(
    '/chat/restart',
    isAuthenticated,
    requirePermission("chat.use"),
    asyncMiddleware(chatController.restartSession.bind(chatController))
);

router.post(
    '/lessonchat/message/:recordId/:chapterId',
    isAuthenticated,
    requirePermission("chat.use"),
    asyncMiddleware(chatController.sendLessonMessage.bind(chatController))
);

router.get(
    '/lessonchat/messages/:recordId/:chapterId',
    isAuthenticated,
    requirePermission("chat.use"),
    asyncMiddleware(chatController.listLessonMessages.bind(chatController))
);


module.exports = router;
