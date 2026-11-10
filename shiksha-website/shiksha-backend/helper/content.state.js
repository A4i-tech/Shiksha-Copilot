const { CONTENT_STATUS } = require("../constants/content-status");

const stateWord = (record) =>
	record.status === CONTENT_STATUS.UNDER_REVIEW ? "under review" : record.isDeleted ? "deleted" : "live";

module.exports = { stateWord };
