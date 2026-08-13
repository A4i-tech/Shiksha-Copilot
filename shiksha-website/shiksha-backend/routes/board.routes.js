const express = require("express");
const router = express.Router();
const asyncMiddleware = require("../middlewares/asyncMiddleware.js");
const BoardController = require("../controllers/board.controller.js");
const {
    validateBoardCreate,
    validateBoardUpdate,
} = require("../validations/board.validation.js");
const { isAuthenticated, requirePermission } = require("../middlewares/auth.js");

const boardController = new BoardController();

router.post(
    "/board/create",
    isAuthenticated,
    requirePermission("content.manage"),
    validateBoardCreate,
    asyncMiddleware(boardController.create.bind(boardController))
);

router.get(
    "/board/list",
    asyncMiddleware(boardController.getAll.bind(boardController))
);

router.get(
    "/board/:id",
    asyncMiddleware(boardController.getById.bind(boardController))
);

router.put(
    "/board/update",
    isAuthenticated,
    requirePermission("content.manage"),
    validateBoardUpdate,
    asyncMiddleware(boardController.update.bind(boardController))
);

router.delete(
    "/board/:id",
    isAuthenticated,
    requirePermission("content.manage"),
    asyncMiddleware(boardController.delete.bind(boardController))
);

module.exports = router;
