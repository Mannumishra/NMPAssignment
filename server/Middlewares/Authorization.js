const jwt = require("jsonwebtoken");

const protectAdmin = (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
        req.user = decoded;
        
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ success: false, message: "Access denied, admin only" });
        }

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired, please log in again" });
        }
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const protectUser = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ success: false, message: "No token, authorization denied" });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired, please log in again" });
        }
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};

const verifyBoth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: "No token, authorization denied" });
        }

        const decoded = jwt.decode(token);
        if (!decoded || !decoded.role) {
            return res.status(403).json({ success: false, message: "Access denied, invalid token" });
        }

        let secretKey;
        if (decoded.role === 'Admin') {
            secretKey = process.env.JWT_SECRET_ADMIN;
        } else if (decoded.role === 'User') {
            secretKey = process.env.JWT_SECRET_USER;
        } else {
            return res.status(403).json({ success: false, message: "Access denied" });
        }

        jwt.verify(token, secretKey);
        req.user = decoded;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ success: false, message: "Token expired, please log in again" });
        }
        res.status(401).json({ success: false, message: "Invalid token" });
    }
};


module.exports = { protectAdmin, protectUser, verifyBoth };
