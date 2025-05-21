const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
    try {
        // Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');
        console.log(`Token: ${token}`);
        
        if (!token) {
            return res.status(401).json({
                status: 'error',
                message: 'No authentication token, access denied'
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Add user from payload
        req.user = decoded;
        console.log(decoded);
        
        next();
    } catch (error) {
        console.log(error);
        
        res.status(401).json({
            status: 'error',
            message: 'Token is not valid'
        });
    }
};

module.exports = auth;
