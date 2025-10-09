const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../lib/auth');
const productoController = require('../controllers/productoController');

router.get('/add', ensureAuthenticated, productoController.producto);

router.post('/guardar', ensureAuthenticated, productoController.addProducto);

module.exports = router;