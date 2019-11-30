
// Gerenciador do banco de dados


// Criação de tabelas
const createTable = (conn) => {

    const sqlUser = "CREATE TABLE IF NOT EXISTS users (\n" +
        "id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n" +
        "nome VARCHAR(150) NOT NULL,\n" +
        "email VARCHAR(100) NOT NULL,\n" +
        "senha VARCHAR(100) NOT NULL,\n" +
        "cep VARCHAR(9) NOT NULL,\n" +
        "token TEXT NULL,\n" +
        "last_login TIMESTAMP NULL,\n" +
        "created_at TIMESTAMP NOT NULL DEFAULT NOW(),\n" +
        "updated_at TIMESTAMP NOT NULL DEFAULT NOW() ON UPDATE NOW()\n" +
        ");";

    const sqlTelefones = "CREATE TABLE IF NOT EXISTS telefones (\n" +
        "id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n" +
        "user_id INT UNSIGNED NOT NULL,\n" +
        "ddd VARCHAR(2) NOT NULL,\n" +
        "telefone VARCHAR(9) NOT NULL,\n" +
        "created_at TIMESTAMP NOT NULL DEFAULT NOW(),\n" +
        "CONSTRAINT fk_TelUser FOREIGN KEY (user_id) REFERENCES users (id)\n" +
        ");";

    conn.query(sqlUser, function (error, results, fields) {
        if (error) return console.log(error);
        console.log('criou a tabela!');
    });

    conn.query(sqlTelefones, function (error, results, fields) {
        if (error) return console.log(error);
        console.log('criou a tabela!');
    });
}

// Inserir Usuarios
const addUserRows = (conn, values, telefones, callback) => {
    const sql = "INSERT INTO users (nome, email, senha, cep) VALUES ?";

    conn.query(sql, [values], function (error, results, fields) {

        if (error) return callback(true, 'Erro ao salvar usuario');

        return addTelRows(conn, results.insertId, telefones, callback);
    });

}

// Inserir telefones de usuarios
const addTelRows = async (conn, id, telefones, callback) => {
    const sql = "INSERT INTO telefones (user_id, ddd, telefone) VALUES ?";

    conn.query(sql, [telefones.map(item => [id, item.ddd, item.numero])], function (error, results, fields) {

        if (error) return callback(true, 'Erro ao salvar telefones');

        return callback(false, 'Usuario criado com sucesso!');
    });
}

// Inserir telefones de usuarios
const selectRow = async (conn, table, columns = '*', condition, limit = 100, callback) => {

    const sql = `SELECT ${columns} from ${table} WHERE ${condition} LIMIT ${limit}`;

    conn.query(sql, (error, results, fields) => {

        if (error) return callback(true, 'Erro ao verificar email');

        if (results.length)
            return callback(true, 'O Email ja esta sendo utilizado');
        else
            return callback(false, results);
    });

}


module.exports.createTable = createTable;
module.exports.addUserRows = addUserRows;
module.exports.addTelRows = addTelRows;
module.exports.selectRow = selectRow;