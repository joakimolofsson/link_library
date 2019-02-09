import jwt from 'jsonwebtoken';

async function verifyToken(req, res, next) {
    try {
        const userData = await jwt.verify(req.body.token, process.env.JWTSECRET);
        req.body = userData;
        next();
    } catch(err) {
        return res.json({status: 'Forbidden'});
    }
}

export default verifyToken;