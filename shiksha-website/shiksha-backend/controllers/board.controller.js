const handleError = require("../helper/handleError.js");
const BoardManager = require("../managers/board.manager.js");
const BaseController = require("./base.controller.js");

/** @extends {BaseController<BoardManager>} */
class BoardController extends BaseController {
    constructor() {
        super(new BoardManager());
    }

    async getByName(req, res) {
        let result = await this.manager.getByName(req);
        if (result.success) {
            return res.status(200).json(result);
        }

        handleError(result, res);
    }

    async update(req, res) {
        let result = await this.manager.update(req);

        if (result.success) {
            return res.status(200).json(result);
        }

        handleError(result, res);
    }
}

module.exports = BoardController;
