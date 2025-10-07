const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { sql, poolPromise } = require('../keys');
const helpers = require('./helpers');

passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('username', sql.VarChar(50), username)
            .query('SELECT * FROM Usuario WHERE Nombre_Usuario = @username');

        if (result.recordset.length === 0) {
            return done(null, false, req.flash('error_msg', 'Usuario no encontrado.'));
        }

        const user = result.recordset[0];
        const validPassword = await helpers.matchPassword(password, user.Contrasenia);

        if (!validPassword) {
            return done(null, false, req.flash('error_msg', 'Contraseña incorrecta.'));
        }

        return done(null, user);

    } catch (error) {
        console.error('Error en la autenticación:', error);
        return done(error);
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.Id_Usuario);
});

passport.deserializeUser(async (id, done) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
                SELECT u.*, r.Rol 
                FROM Usuario u
                INNER JOIN Rol r ON u.Id_Rol = r.Id_Rol
                WHERE u.Id_Usuario = @id
            `);
        done(null, result.recordset[0]);
    } catch (err) {
        done(err, null);
    }
});
