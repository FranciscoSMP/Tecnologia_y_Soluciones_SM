const { format } = require('date-fns');
const { es } = require('date-fns/locale');
const pool = require('../keys');

const guardarEnBaseDatos = async (querySQLServer) => {
    return ejecutarSQLServer(querySQLServer);
};

const ejecutarSQLServer = async (query) => {
    const conSQL = await pool.poolPromise;
    return conSQL.request().query(query);
};

exports.addTransaccion = async ({ tipo_transaccion, motivo, cantidad, Id_Usuario, id_producto }) => {
    const tiposValidos = ['Entrada', 'Salida', 'Devolucion', 'Ajuste'];
    if (!tiposValidos.includes(tipo_transaccion)) {
        throw new Error('Tipo de transacción inválido.');
    }

    const cantidadNum = parseInt(cantidad, 10);
    if (Number.isNaN(cantidadNum)) {
        throw new Error('Cantidad inválida.');
    }

    const usuarioId = parseInt(Id_Usuario, 10);
    const productoId = parseInt(id_producto, 10);
    if (Number.isNaN(usuarioId) || Number.isNaN(productoId)) {
        throw new Error('Usuario o producto inválido.');
    }

    const motivoSafe = motivo ? motivo.replace(/'/g, "''") : null;
    const motivoValue = motivoSafe ? `'${motivoSafe}'` : 'NULL';

    const query = `
        INSERT INTO Transaccion (tipo_transaccion, motivo, cantidad, Id_Usuario, id_producto)
        VALUES ('${tipo_transaccion}', ${motivoValue}, ${cantidadNum}, ${usuarioId}, ${productoId})
    `;
    await guardarEnBaseDatos(query);
};

exports.getTransacciones = async (rol, idUsuario) => {
    let query = `
        SELECT 
        transaccion.id_transaccion,
        transaccion.tipo_transaccion,
        transaccion.motivo,
        transaccion.fecha,
        transaccion.cantidad,
        usuario.nombre_usuario,
        producto.nombre
        FROM transaccion
        JOIN usuario ON transaccion.id_usuario = usuario.id_usuario
        JOIN producto ON transaccion.id_producto = producto.id_producto
    `;

    if (rol === 2) {
        query += ` WHERE transaccion.id_usuario = ${idUsuario}`;
    }

    query += ` ORDER BY transaccion.fecha DESC`;

    const result = await ejecutarSQLServer(query);
    const transacciones = result.recordset;

    const transaccionesFormateadas = transacciones.map(t => ({
        ...t,
        fecha: t.fecha
            ? format(new Date(t.fecha), "dd/MM/yyyy HH:mm", { locale: es })
            : 'Sin fecha'
    }));

    return transaccionesFormateadas;
};


// ==============================
//   CONSULTAR TRANSACCIÓN ESPECÍFICA
// ==============================
exports.getTransaccionById = async (id) => {
    const query = `
        SELECT 
        transaccion.id_transaccion,
        transaccion.tipo_transaccion,
        transaccion.motivo,
        transaccion.fecha,
		transaccion.cantidad,
		usuario.nombre_usuario,
		producto.nombre,
        producto.sku
		FROM transaccion
		JOIN usuario ON transaccion.id_usuario = usuario.id_usuario
		JOIN producto ON transaccion.id_producto = producto.id_producto
        WHERE transaccion.id_transaccion = ${id}
    `;

    const result = await ejecutarSQLServer(query);
    const transaccion = result.recordset[0];

    if (!transaccion) {
        throw new Error('Transacción no encontrada.');
    }

    const fechaFormateada = transaccion.fecha
        ? format(new Date(transaccion.fecha), "EEEE d 'de' MMMM 'de' yyyy, HH:mm", { locale: es })
        : 'Sin fecha';

    return { ...transaccion, fecha: fechaFormateada };
};

exports.getProductosMasVendidos = async () => {
    const conSQL = await pool.poolPromise;
    const result = await conSQL.request().query(`
        SELECT TOP 5 
            producto.nombre,
            SUM(transaccion.cantidad) AS total_vendida
        FROM transaccion
        JOIN producto ON transaccion.id_producto = producto.id_producto
        WHERE transaccion.tipo_transaccion = 'SALIDA'
        GROUP BY producto.nombre
        ORDER BY total_vendida DESC
    `);
    return result.recordset;
};