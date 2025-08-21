exports.successResponse = (res, status = 200, message, data = {}) => {
  res.status(status).json({ success: true, message, data });
};

exports.errorResponse = (res, status = 400, message) => {
  res.status(status).json({ success: false, error: message });
};
