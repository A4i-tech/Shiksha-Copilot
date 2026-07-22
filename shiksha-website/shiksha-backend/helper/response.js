const formatApiReponse = (success, message, data, code) => {
	const res = { success, message, data };
	if (code) res.code = code;
	return res;
};

module.exports = formatApiReponse;
