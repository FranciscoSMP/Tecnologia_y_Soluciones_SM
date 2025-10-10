const transaccionModel = require('../models/transaccionModel');
const usuarioModel = require('../models/usuarioModel');
const productoModel = require('../models/productoModel');

const guardarDatos = (model, redirect) => async (req, res) => {
    try {
        // Si el rol es 2 (bodeguero), forzar que el Id_Usuario sea el del usuario en sesión
        if (req.user && req.user.Id_Rol === 2) {
            req.body.Id_Usuario = req.user.Id_Usuario;
        }

        await model(req.body); 
        req.flash('success_msg', 'Transacción registrada correctamente');
        res.redirect(redirect);
    } catch (error) {
        console.error(error);
        req.flash('error_msg', error.message || 'Error al guardar la transacción');
        res.status(500).send('Error al guardar transacción');
    }
};

exports.transaccion = async (req, res) => {
    try {
        const productos = await productoModel.getProducto();
        let usuarios = [];

        // Solo el rol 1 puede elegir usuario
        if (req.user.Id_Rol === 1) {
            usuarios = await usuarioModel.getUsuario();
        }

        res.render('add/transaccion', {
            title: 'Registrar Transacción',
            productos,
            usuarios,
            user: req.user // Se pasa para condicionar la vista
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener datos para registrar la transacción');
    }
};

exports.addTransaccion = guardarDatos(transaccionModel.addTransaccion, '/transaccion/table');

exports.tableTransaccion = async (req, res) => {
    try {
        const rol = req.user.Id_Rol;
        const idUsuario = req.user.Id_Usuario;

        const transacciones = await transaccionModel.getTransacciones(rol, idUsuario);

        res.render('tables/transaccion', {
            title: 'Listado de Transacciones',
            transacciones,
            user: req.user,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', 'Error al listar transacciones');
        res.redirect('/dashboard');
    }
};

exports.verTransaccion = async (req, res) => {
    try {
        const id = req.params.id;
        const rol = req.user.Id_Rol;
        const idUsuario = req.user.Id_Usuario;

        const transaccion = await transaccionModel.getTransaccionById(id, rol, idUsuario);

        res.render('tables/transaccionDetalle', {
            title: 'Detalle de Transacción',
            transaccion,
            user: req.user
        });
    } catch (error) {
        console.error(error);
        req.flash('error_msg', error.message || 'Error al consultar la transacción');
        res.redirect('/transaccion/table');
    }
};

exports.guardarMultiples = async (req, res) => {
    try {
        const transacciones = JSON.parse(req.body.transacciones);
        if (!transacciones || !transacciones.length) {
            req.flash('error_msg', 'No se recibieron transacciones.');
            return res.redirect('/transaccion');
        }

        for (const t of transacciones) {
            await transaccionModel.addTransaccion({
                tipo_transaccion: t.tipo,
                motivo: t.motivo,
                cantidad: t.cantidad,
                id_producto: t.id_producto,
                Id_Usuario: t.Id_Usuario
            });
        }

        req.flash('success_msg', `Se registraron ${transacciones.length} transacciones correctamente.`);
        res.redirect('/transaccion/table');
    } catch (error) {
        console.error('Error al registrar múltiples transacciones:', error);
        req.flash('error_msg', 'Ocurrió un error al registrar las transacciones.');
        res.redirect('/transaccion');
    }
};