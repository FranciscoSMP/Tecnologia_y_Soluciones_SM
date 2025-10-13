require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });
const bcrypt = require('bcryptjs');
const { sql, poolPromise } = require('../src/keys');

async function crearUsuarioAdministrador() {
    try {
        const pool = await poolPromise;
        if (!pool) throw new Error('No se pudo establecer conexión con la base de datos.');

        const nombreUsuario = 'Francisco';
        const primerNombre = 'Francisco';
        const primerApellido = 'Morales';
        const correo = 'fmoralesp6@miumg.edu.gt';
        const contrasenaPlano = 'r62af79a';
        const hashContrasena = await bcrypt.hash(contrasenaPlano, 10);

        console.log(`Contraseña cifrada para '${nombreUsuario}': ${hashContrasena}`);

        // Verificar si el usuario ya existe
        const usuarioExistente = await pool.request()
            .input('nombre_usuario', sql.VarChar(50), nombreUsuario)
            .query('SELECT * FROM Usuario WHERE Nombre_Usuario = @nombre_usuario');

        if (usuarioExistente.recordset.length > 0) {
            console.log('ℹEl usuario administrador ya existe. No se creará uno nuevo.');
            return;
        }

        // Obtener el rol "Administrador"
        const rolAdmin = await pool.request()
            .input('rol', sql.VarChar(50), 'Administrador')
            .query('SELECT Id_Rol FROM Rol WHERE Rol = @rol');

        if (rolAdmin.recordset.length === 0) {
            throw new Error('No se encontró el rol "Administrador". Verifique la tabla Rol.');
        }

        const idRol = rolAdmin.recordset[0].Id_Rol;

        // Insertar el usuario administrador
        const resultado = await pool.request()
            .input('nombre_usuario', sql.VarChar(50), nombreUsuario)
            .input('primer_nombre', sql.VarChar(50), primerNombre)
            .input('primer_apellido', sql.VarChar(50), primerApellido)
            .input('correo_electronico', sql.VarChar(100), correo)
            .input('contrasenia', sql.VarChar(255), hashContrasena)
            .input('id_rol', sql.Int, idRol)
            .query(`
                INSERT INTO Usuario
                    (Nombre_Usuario, Primer_Nombre, Primer_Apellido, Correo_Electronico, Contrasenia, Id_Rol)
                VALUES
                    (@nombre_usuario, @primer_nombre, @primer_apellido, @correo_electronico, @contrasenia, @id_rol)
            `);

        console.log('Usuario administrador creado correctamente.');
        console.log(`Usuario: ${nombreUsuario} | Correo: ${correo}`);

    } catch (err) {
        console.error('Error al crear el usuario administrador:', err);
    } finally {
        console.log('Script finalizado.');
        process.exit();
    }
}

crearUsuarioAdministrador();