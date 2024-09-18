const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.Authorization || req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, 'raj@123', (err, user) => {
            if (err) {
                return res.status(401).json({error: err});
            }

            console.log(user);
            req.user = user;
            next();
        });
    } else {
        res.status(401).json({error: 'not an authorized user'});
    }
};

module.exports = authenticateJWT;