const pool = require('../keys');

const guardarEnBaseDatos = async (querySQLServer) => {
    return ejecutarSQLServer(querySQLServer);
};

const ejecutarSQLServer = async (query) => {
    const conSQL = await pool.poolPromise;
    return conSQL.request().query(query);
};

exports.addProducto = async ({ nombre, descripcion, precio_unitario, stock_actual, umbral_minimo, id_categoria, id_proveedor }) => {
    const query = `INSERT INTO producto (nombre, descripcion, precio_unitario, stock_actual, umbral_minimo, id_categoria, id_proveedor) VALUES (
                    '${nombre}', 
                    '${descripcion}', 
                    '${precio_unitario}', 
                    '${stock_actual}', 
                    '${umbral_minimo}',
                    '${id_categoria}',
                    '${id_proveedor}'
    )`;
    await guardarEnBaseDatos(query);
};

exports.getProducto = async () => {
    const conSQL = await pool.poolPromise;
    const result = await conSQL.request().query('SELECT * FROM producto');
    return result.recordset;
};