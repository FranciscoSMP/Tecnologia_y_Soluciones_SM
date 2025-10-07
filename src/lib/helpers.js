const bcrypt = require('bcryptjs');

const helpers = {};

// Encriptar contraseña
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};

// Comparar contraseñas
helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
    } catch (err) {
        console.error('Error al comparar contraseñas:', err);
    }
};

module.exports = helpers;
