const Joi = require('@hapi/joi');

// Validação do body de registro
const registerValidation = (data) => {

    const schema = Joi.object({
        nome: Joi.string().min(4).required(),
        email: Joi.string().min(6).required().email(),
        senha: Joi.string().min(6).required(),
        cep: Joi.string().min(9).required(),
        telefones: Joi.array().items({ numero: Joi.string().min(8).required(), ddd: Joi.string().min(2).required() })
    });

    return schema.validate(data);
};


// Validação do body de login
const loginValidation = (data) => {

    const schema = Joi.object({
        email: Joi.string().email().required(),
        senha: Joi.string().required()
    });

    return schema.validate(data);
}


module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;