

exports.register = (req, res) => {
    const { nome, email, senha, telefones, cep } = req.body;

    try {

    } catch (err) {
        return res.status(400).send({ error: 'Registration failed' });
    }
}


exports.login = (req, res) => {


}