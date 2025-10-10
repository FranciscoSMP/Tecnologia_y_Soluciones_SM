const productoModel = require('../models/productoModel');
const transaccionModel = require('../models/transaccionModel');

exports.mostrarReportes = async (req, res) => {
    try {
        // Reporte 1: Valor total del inventario
        const productos = await productoModel.getProducto();
        const valorInventario = productos.reduce((total, p) => total + (p.precio_unitario * p.stock_actual), 0);

        // Reporte 2: Productos más vendidos (si existen transacciones de salida)
        const masVendidos = await transaccionModel.getProductosMasVendidos();

        // Reporte 3: Productos con stock bajo
        const bajoStock = productos.filter(p => p.stock_actual <= p.umbral_minimo);

        // Reporte 4: Resumen general
        const totalProductos = productos.length;
        const productosConStock = productos.filter(p => p.stock_actual > 0).length;
        const porcentajeBajoStock = ((bajoStock.length / totalProductos) * 100).toFixed(2);

        res.render('tables/reporte', {
            user: req.user,
            valorInventario: valorInventario.toFixed(2),
            masVendidos,
            bajoStock,
            totalProductos,
            productosConStock,
            porcentajeBajoStock
        });

    } catch (error) {
        console.error('Error generando reportes:', error);
        res.render('tables/reporte', { error: 'Error al generar los reportes.' });
    }
};
