const productoModel = require('../models/productoModel');
const transaccionModel = require('../models/transaccionModel');

exports.mostrarReportes = async (req, res) => {
    try {
        const rol = req.user.Id_Rol;

        if (rol === 1) {
            // Rol administrador: mostrar panel completo de reportes
            const productos = await productoModel.getProducto();
            const valorInventario = productos.reduce((total, p) => total + (p.precio_unitario * p.stock_actual), 0);
            const masVendidos = await transaccionModel.getProductosMasVendidos();
            const bajoStock = productos.filter(p => p.stock_actual <= p.umbral_minimo);
            const totalProductos = productos.length;
            const productosConStock = productos.filter(p => p.stock_actual > 0).length;
            const porcentajeBajoStock = ((bajoStock.length / totalProductos) * 100).toFixed(2);

            res.render('dashboard', {
                user: req.user,
                valorInventario: valorInventario.toFixed(2),
                masVendidos,
                bajoStock,
                totalProductos,
                productosConStock,
                porcentajeBajoStock
            });

        } else if (rol === 2) {
            // Rol empleado: mostrar solo reportes simplificados o vista distinta
            res.render('dashboardEmpleado', {
                user: req.user,
                mensaje: 'Bienvenido al panel del empleado'
            });

        }
        
    } catch (error) {
        console.error('Error generando reportes:', error);
        res.render('dashboard', { error: 'Error al generar los reportes.' });
    }
};
