exports.successResponse = (res, message, data = {}, status = 200) => {
    res.status(status).json({ success: true, message, ...data });
};

exports.errorResponse = (res, message, status = 400) => {
    res.status(status).json({ success: false, error: message });
};