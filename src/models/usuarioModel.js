const bcrypt = require('bcryptjs')
const pool = require('../keys');

const guardarEnBaseDatos = async (querySQLServer) => {
    return ejecutarSQLServer(querySQLServer);
};

const ejecutarSQLServer = async (query) => {
    const conSQL = await pool.poolPromise;
    return conSQL.request().query(query);
};

exports.addUsuario = async ({ nombre_usuario, primer_nombre, segundo_nombre, primer_apellido, segundo_apellido, correo_electronico, contrasenia, confirmar_contrasenia, id_rol }) => {
    try {
        if (contrasenia !== confirmar_contrasenia) {
            throw new Error('Las contraseñas no coinciden');
        }

        const hash = await bcrypt.hash(contrasenia, 10);
        
        const query = `
            INSERT INTO Usuario (Nombre_Usuario, Primer_Nombre, Segundo_Nombre, Primer_Apellido, Segundo_Apellido, Correo_Electronico, Contrasenia, Id_Rol)
            VALUES ('${nombre_usuario}', '${primer_nombre}', '${segundo_nombre}', '${primer_apellido}', '${segundo_apellido}', '${correo_electronico}', '${hash}', ${id_rol})
        `;

        await guardarEnBaseDatos(query);

        return { message: 'Usuario creado correctamente' };

    } catch (err) {
        console.error(err);
        throw new Error('Error al crear el usuario: ' + err.message);
    }
};

exports.obtenerRoles = async () => {
    try {
        const query = 'SELECT * FROM Rol';
        const resultado = await ejecutarSQLServer(query);
        return resultado.recordset;
    } catch (error) {
        console.error('Error al obtener roles:', error);
        throw new Error('Error al obtener los roles desde la base de datos');
    }
};

exports.getUsuario = async () =>{
    const conSQL = await pool.poolPromise;
    const result = await conSQL.request().query(`
            SELECT 
                U.Id_Usuario,
                U.Nombre_Usuario,
                U.Primer_Nombre,
                U.Segundo_Nombre,
                U.Primer_Apellido,
                U.Segundo_Apellido,
                U.Correo_Electronico,
                R.Rol AS Nombre_Rol
            FROM Usuario U
            INNER JOIN Rol R ON U.Id_Rol = R.Id_Rol
            ORDER BY U.Id_Usuario ASC
    `);
    return result.recordset;
};