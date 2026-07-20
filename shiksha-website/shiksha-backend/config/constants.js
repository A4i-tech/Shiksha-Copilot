let MESSAGES = {
	UPDATE_SUCCESS: "Data updated successfully!",
	UPDATE_FAIL: "Failed to update data!",
};

const CHAT_LIMIT = 20;

const REGENERATION_LIMIT = 3;

const MAX_REMIND_LATER = parseInt(process.env.MAX_REMIND_LATER, 10) || 2;

module.exports = { MESSAGES, CHAT_LIMIT, REGENERATION_LIMIT, MAX_REMIND_LATER };
