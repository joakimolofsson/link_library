const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    try {
        const userData = await jwt.verify(req.body.token, process.env.JWTSECRET);
        req.tokenUserData = userData;
        next();
    } catch(err) {
        return res.json({status: 'You are logged out, please log in!'});
    }
}

module.exports = verifyToken;