const productoModel = require('../models/productoModel');
const categoriaModel = require('../models/categoriaModel');
const proveedorModel = require('../models/proveedorModel');

const guardarDatos = (model, redirect) => async (req, res) => {
    try {
        await model(req.body); 
        req.flash('success_msg', 'Datos Guardados Correctamente');
        res.redirect(redirect);
    } catch (error) {
        console.error(error);
        res.status(500).send(`Error al guardar ${redirect.slice(7)}`);
    }
};

exports.producto = async (req, res) => {
    try {
        const categoria = await categoriaModel.getCategoria();
        const proveedor = await proveedorModel.getProveedor();
        res.render('add/producto', { 
            title: 'Añadir Producto',
            categoria, proveedor
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener datos');
    }
};

exports.addProducto = guardarDatos(productoModel.addProducto, '/producto/table');
