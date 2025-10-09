const usuarioModel = require('../models/usuarioModel');

const guardarDatos = (model, redirect) => async (req, res) => {
    try {
        await model(req.body);
        req.flash('success_msg', 'Datos Guardados Correctamente');
        res.redirect(redirect);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error al guardar ${redirect.slice(7)}`);
    }
};

exports.Usuario = async (req, res) => {
    try {
        const roles = await usuarioModel.obtenerRoles();
        res.render('add/usuario', { 
            title: 'Añadir Usuario',
            roles
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener datos');
    }
};

exports.addUsuario = guardarDatos(usuarioModel.addUsuario, '/');

exports.getUsuario = async (req, res) => {
    const result = await usuarioModel.getUsuario();
    res.render('tables/usuario', {
        title: 'Usuarios',
        usuarios: result
    });
}
