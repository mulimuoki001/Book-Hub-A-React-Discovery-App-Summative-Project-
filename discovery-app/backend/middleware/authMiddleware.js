const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    console.log("Incoming request", req.method, req.path);
    console.log("Cookies", req.cookies);
    console.log("Authorization Header", req.headers.authorization);
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    try {
        const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        console.error(error);
        res.status(400).json({ message: 'Invalid token' });
    }
};