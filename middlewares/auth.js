const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
    let token
    //Get token from authorization header
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1]
    }
    // Get token from header
    else {
        token = req.header('x-auth-token')
    }

    // Check if there is no token
    if (!token) {
        res.status(401).json({ mag: 'Authorization denied' })
    }

    // Verify token
    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user
        next()
    } catch (err) {
        res.status(401).json({ msg: 'Token invalid' })
    }
}
