const pool = require('../keys');

const guardarEnBaseDatos = async (querySQLServer) => {
    return ejecutarSQLServer(querySQLServer);
};

const ejecutarSQLServer = async (query) => {
    const conSQL = await pool.poolPromise;
    return conSQL.request().query(query);
};

exports.addCategoria = async ({ nombre_categoria, descripcion }) => {
    const query = `INSERT INTO categoria (nombre_categoria, descripcion) VALUES ('${nombre_categoria}', '${descripcion}')`;
    await guardarEnBaseDatos(query);
};

exports.getCategoria = async () => {
    const conSQL = await pool.poolPromise;
    const result = await conSQL.request().query('SELECT * FROM categoria');
    return result.recordset;
};

exports.getCategoriaById = async (id) => {
    const conSQL = await pool.poolPromise;
    const result = await conSQL.request().query(`SELECT * FROM categoria WHERE id_categoria = ${id}`);
    return result.recordset[0];
};

exports.updateCategoria = async ({ id_categoria, nombre_categoria, descripcion }) => {
    const query = `
        UPDATE categoria SET 
        nombre_categoria = '${nombre_categoria}', 
        descripcion = '${descripcion}'
        WHERE id_categoria = ${id_categoria}`;
    await guardarEnBaseDatos(query);
};  

exports.deleteCategoria = async (id) => {
    const query = `DELETE FROM categoria WHERE id_categoria = ${id}`;
    await guardarEnBaseDatos(query);
};