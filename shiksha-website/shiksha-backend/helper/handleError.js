const handleError = (data, res) => {
	const statusCode = data.accessError ? 401 : 400;
	data.accessError = undefined;
	return res.status(statusCode).json(data);
};

module.exports = handleError;
