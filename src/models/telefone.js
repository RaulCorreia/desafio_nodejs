const mongoose = require('mongoose');

const TelefoneSchema = new mongoose.Schema({
    user_id: {
        type: int,
        required: true,
    },
    telefone: {
        type: String,
        required: true,
        unique: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    }
})

const Telefone = mongoose.model('Telefone', TelefoneSchema);

module.exports = Telefone;