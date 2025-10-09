const pool = require('../keys');

const guardarEnBaseDatos = async (querySQLServer) => {
    return ejecutarSQLServer(querySQLServer);
};

const ejecutarSQLServer = async (query) => {
    const conSQL = await pool.poolPromise;
    return conSQL.request().query(query);
};

exports.addProveedor = async ({ nit, nombre_comercial, direccion, telefono, correo_electronico }) => {
    const query = `INSERT INTO proveedor (nit, nombre_comercial, direccion, telefono, correo_electronico) VALUES 
                    ('${nit}', '${nombre_comercial}', '${direccion}', '${telefono}', '${correo_electronico}')`;
    await guardarEnBaseDatos(query);
};

exports.getProveedor = async () => {
    const conSQL = await pool.poolPromise;
    const result = await conSQL.request().query('SELECT * FROM proveedor');
    return result.recordset;
};

exports.getProveedorById = async (id) => {
    const conSQL = await pool.poolPromise;
    const result = await conSQL.request().query(`SELECT * FROM proveedor WHERE id_proveedor = ${id}`);
    return result.recordset[0];
};

exports.updateProveedor = async ({ id_proveedor, nit, nombre_comercial, direccion, telefono, correo_electronico }) => {
    const query = `
        UPDATE proveedor SET 
        nit = '${nit}', 
        nombre_comercial = '${nombre_comercial}',
        direccion = '${direccion}',
        telefono = '${telefono}',
        correo_electronico = '${correo_electronico}'
        WHERE id_proveedor = ${id_proveedor}`;
    await guardarEnBaseDatos(query);
};  

exports.deleteProveedor = async (id) => {
    const query = `DELETE FROM proveedor WHERE id_proveedor = ${id}`;
    await guardarEnBaseDatos(query);
};