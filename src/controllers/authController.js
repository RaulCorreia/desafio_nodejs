const User = require('../models/user');
const Telefone = require('../models/telefone');
const mysqlConnection = require('../database/index');
const { addUserRows, selectRow } = require('../database/manager');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../util/validation');




exports.register = async (req, res) => {

    console.log('REGISTER');

    // Validação dos dados
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).json({ mensagem: error.details[0].message });

    try {

        const { nome, email, senha, telefones, cep } = req.body;

        console.log('SELECT ROW');
        // Verifica email ja utilizado
        await selectRow(mysqlConnection, 'users', '*', `email = '${email}'`, 1, (error, result) => {
            if (error) return res.status(400).json({ message: result });

            console.log('RESULT NO CONTROLLER');
            console.log(result);
            console.log(result);
        });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(senha, salt);

        console.log('ADD USER');

        // Criação do usuario
        addUserRows(mysqlConnection, [[nome, email, hashPassword, cep]], telefones, (erro, result) => {

            if (erro) return res.status(400).json({ message: result });

            return res.status(200).json({ sucess: result });
        });




    } catch (err) {
        return res.status(400).json({ error: 'Registration failed' });
    }
}


exports.login = (req, res) => {

    // Validação dos dados
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ mensagem: error.details[0].message });

    const { email, senha } = req.body;

}