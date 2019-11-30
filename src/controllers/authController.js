const User = require('../models/user');
const Telefone = require('../models/telefone');
const jwt = require('jsonwebtoken');
const mysqlConnection = require('../database/index');
const { addUserRows, selectRow, addTelRows, executeQuery } = require('../database/manager');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../util/validation');




exports.register = async (req, res) => {

    console.log('REGISTER');

    // Validação dos dados
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ mensagem: error.details[0].message });

    try {

        const { nome, email, senha, telefones, cep } = req.body;



        // Verifica email ja utilizado
        selectRow(mysqlConnection, 'users', `email = '${email}'`, async (error, result) => {

            if (error) return res.status(400).json({ mensagem: result });


            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(senha, salt);


            // Criação do usuario
            addUserRows(mysqlConnection, [[nome, email, hashPassword, cep]], async (erro, result) => {

                if (erro) return res.status(400).json({ message: result });

                const user_id = result;

                addTelRows(mysqlConnection, user_id, telefones, (error, result) => {

                    if (erro) return res.status(400).json({ message: result });

                    // Obtem os dados salvo no BD
                    var sql = `SELECT * From users WHERE id = ${user_id}`
                    executeQuery(mysqlConnection, sql, (error, result) => {

                        if (erro) return res.status(400).json({ message: result });

                        const user = result[0];
                        const token = jwt.sign({ id: user_id }, process.env.SECRET);
                        user.token = token;
                        user.telefones = telefones;

                        res.json({ user });

                    });

                });


            });

        });


    } catch (err) {
        return res.status(400).json({ mensagem: 'Registration failed' });
    }
}


exports.login = async (req, res) => {

    // Validação dos dados
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ mensagem: error.details[0].message });

    const { email, senha } = req.body;

    // SELECIONA O USUARIO
    const user = { id: 5, email: 'teste@teste.com', senha: '$2a$10$cYuJDphmR2OenjcPPmLTBuh9PTQ5V/37uKfZAvIq3PAbMZl3H0stC' };

    if (!user) return res.status(400).json({ mensagem: 'Usuário e/ou senha inválidos' });

    const validPass = await bcrypt.compare(senha, user.senha);
    if (!validPass) return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });

    const token = jwt.sign({ id: user.id }, process.env.SECRET);

    res.header('auth-token', token).json({ mensagem: 'Login Sucesso' });
    // res.status(200).json({ mensagem: 'Login Sucesso', token: token });
}


exports.search = (req, res) => {


    res.status(200).json({ mensagem: 'Chegou no search' });
}