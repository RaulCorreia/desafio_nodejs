
const jwt = require('jsonwebtoken');

// Middleware para verificação de token

exports.verifyJWT = (req, res, next) => {

    var auth = req.headers['authorization'];
    if (!auth) return res.status(401).json({ message: 'Não autorizado' });

    var token = auth.split(' ');

    jwt.verify(token[1], process.env.SECRET, function (err, decoded) {
        if (err) return res.status(500).json({ message: 'Não autorizado' });

        req.userId = decoded.id;
        next();
    });
}