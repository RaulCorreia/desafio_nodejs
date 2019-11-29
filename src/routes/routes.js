const express = require('express');
const router = express.Router();


router.post('/register', async (req, res) => {

    const { nome, email, senha, telefones, cep } = req.body;

    try {

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }

});


modules.exports = app => app.use('/auth', router);