const express = require('express');
const router = express.Router();
const { sql, poolPromise } = require('../keys');
const { isLoggedIn } = require('../lib/auth');
const helpers = require('../lib/helpers');

// Formulario para crear usuario
router.get('/usuarios/agregar', isLoggedIn, async (req, res) => {
    const pool = await poolPromise;
    const roles = await pool.request().query('SELECT * FROM Rol');
    res.render('add/usuario', {
        title: 'Agregar Usuario',
        roles: roles.recordset
    });
});

// Procesar creación de usuario
router.post('/usuarios/agregar', isLoggedIn, async (req, res) => {
    try {
        const { nombre_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo_electronico, contrasenia, id_rol } = req.body;
        const pool = await poolPromise;

        const hashedPassword = await helpers.encryptPassword(contrasenia);

        await pool.request()
            .input('nombre_usuario', sql.VarChar(50), nombre_usuario)
            .input('primer_nombre', sql.VarChar(50), primer_nombre)
            .input('segundo_nombre', sql.VarChar(50), segundo_nombre)
            .input('primer_apellido', sql.VarChar(50), primer_apellido)
            .input('segundo_apellido', sql.VarChar(50), segundo_apellido)
            .input('correo_electronico', sql.VarChar(100), correo_electronico)
            .input('contrasenia', sql.VarChar(255), hashedPassword)
            .input('id_rol', sql.Int, id_rol)
            .query(`
                INSERT INTO Usuario (Nombre_Usuario, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Correo_Electronico, Contrasenia, Id_Rol)
                VALUES (@nombre_usuario, @primer_nombre, @segundo_nombre, @primer_apellido, @segundo_apellido, @correo_electronico, @contrasenia, @id_rol)
            `);

        req.flash('success_msg', 'Usuario creado exitosamente.');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Error al crear usuario:', error);
        req.flash('error_msg', 'Error al crear el usuario.');
        res.redirect('/usuarios/agregar');
    }
});

module.exports = router;
