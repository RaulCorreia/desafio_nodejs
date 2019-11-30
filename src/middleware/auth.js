
// Middleware para verificação de token

exports.verifyJWT = (req, res, next) => {

    var auth = req.headers['Authentication'];
    if (!auth) return res.status(401).json({ message: 'No token provided.' });

    var token = auth.split(' ');

    jwt.verify(token[1], process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ message: 'Failed to authenticate token.' });

        req.userId = decoded.id;
        next();
    });
}