const User = require('../models/user');
const Telefone = require('../models/telefone');

exports.register = (req, res) => {

    console.log('REGISTER');

    const { nome, email, senha, telefones, cep } = req.body;

    try {

        const user = await User.create(req.body);
        res.send({ user });

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
}


exports.login = (req, res) => {

    const { email, senha } = req.body;
    
}