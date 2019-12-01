const jwt = require('jsonwebtoken');
const mysqlConnection = require('../database/index');
const { addUserRows, addTelRows, executeQuery } = require('../database/manager');
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
        var selectEmail = "SELECT * FROM users WHERE email = '" + email + "';";
        executeQuery(mysqlConnection, selectEmail, async (error, result) => {

            if (error) return res.status(400).json({ mensagem: result });

            if (result.length) return res.status(400).json({ mensagem: 'E-mail já existente' });


            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(senha, salt);


            // Criação do usuario
            addUserRows(mysqlConnection, [[nome, email, hashPassword, cep]], async (erro, result) => {

                if (erro) return res.status(400).json({ mensagem: result });

                const user_id = result;

                addTelRows(mysqlConnection, user_id, telefones, (error, result) => {

                    if (erro) return res.status(400).json({ mensagem: result });

                    // Obtem os dados salvo no BD
                    var sql = `SELECT * From users WHERE id = ${user_id}`
                    executeQuery(mysqlConnection, sql, (error, result) => {

                        if (erro) return res.status(400).json({ mensagem: result });

                        const user = result[0];
                        const token = jwt.sign({ id: user_id }, process.env.SECRET);
                        user.token = token;
                        user.telefones = telefones;
                        user.geolocation = {
                            "type": "Point",
                            "coordinates": [-73.856077, 40.848447]
                        }

                        // Atualiza o token inserido na tabela
                        let sqlUpdate = `UPDATE users SET token = '${token}' WHERE id = ${user.id};`
                        executeQuery(mysqlConnection, sqlUpdate, (error, result) => {

                            if (erro) return res.status(400).json({ mensagem: result });

                            res.json({ user });
                        });


                    });

                });


            });

        });


    } catch (err) {
        return res.status(400).json({ mensagem: 'Registro falhou' });
    }
}


exports.login = async (req, res) => {

    // Validação dos dados
    let { error } = loginValidation(req.body);
    if (error) return res.status(400).json({ mensagem: error.details[0].message });

    const { email, senha } = req.body;

    try {

        // SELECIONA O USUARIO
        let sqlSelectUser = `SELECT * FROM users WHERE email = '${email}';`;
        executeQuery(mysqlConnection, sqlSelectUser, async (error, result) => {

            if (error) return res.status(400).json({ mensagem: result });

            if (!result.length) return res.status(400).json({ mensagem: 'Usuário e/ou senha inválidos' });

            const user = result[0];

            // Validação de senha
            const validPass = await bcrypt.compare(senha, user.senha);
            if (!validPass) return res.status(401).json({ mensagem: 'Usuário e/ou senha inválidos' });


            let sqlSelectTelefones = `SELECT ddd, telefone FROM telefones WHERE user_id = ${user.id};`;
            executeQuery(mysqlConnection, sqlSelectTelefones, async (error, result) => {

                if (error) return res.status(400).json({ mensagem: result });

                user.telefones = result;
                user.geolocation = {
                    "type": "Point",
                    "coordinates": [-73.856077, 40.848447]
                }

                const token = jwt.sign({ id: user.id }, process.env.SECRET);
                user.token = token;

                let sqlUpdateLastLogin = `UPDATE users SET ultimo_login = now(), token = '${token}' WHERE id = ${user.id};`;
                executeQuery(mysqlConnection, sqlUpdateLastLogin, async (error, result) => {

                    if (error) return res.status(400).json({ mensagem: result });

                    res.json({ user });

                });

            });



        });

    } catch (err) {
        return res.status(400).json({ mensagem: 'Registro falhou' });
    }

}


exports.search = (req, res) => {

    var user_id = req.params.user_id;

    let sqlSelect = `SELECT * FROM users WHERE id = ${user_id};`;
    executeQuery(mysqlConnection, sqlSelect, async (error, result) => {

        if (error) return res.status(400).json({ mensagem: result });
        if (!result.length) return res.json({ mensagem: "Nenhum usuario encontrado" });

        const user = result[0];

        var auth = req.headers['authorization'];

        if (auth.split(' ')[1] != user.token) res.status(400).json({ mensagem: "Não autorizado" });

        var thirtyMinutes = 30 * 60000;
        if (((new Date) - user.ultimo_login) > thirtyMinutes) {
            return res.json({ mensagem: "Sessão inválida" });
        }

        let sqlSelectTelefones = `SELECT ddd, telefone FROM telefones WHERE user_id = ${user.id};`;
        executeQuery(mysqlConnection, sqlSelectTelefones, async (error, result) => {

            if (error) return res.status(400).json({ mensagem: result });

            user.telefones = result;
            user.geolocation = {
                "type": "Point",
                "coordinates": [-73.856077, 40.848447]
            }

            res.json({ user });

        });


    });

}