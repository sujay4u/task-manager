const jwt = require('jsonwebtoken');
const { errorResponse} = require('../utils/responseHandler');

module.exports = (rq, rs, nxt) =>{
    const authHeader = rq.headers['authorization'];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return errorResponse(rs, 401, "Access token required");

    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user)=>
    {
        if (err) {
            return errorResponse(rs, 403, "Invalid or expired token");
        }
        rq.user = user;
        nxt();
    });
};