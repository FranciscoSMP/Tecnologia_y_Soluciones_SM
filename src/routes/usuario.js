const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { ensureAuthenticated } = require('../lib/auth');

router.get('/add', ensureAuthenticated, usuarioController.Usuario);

router.post('/guardar', ensureAuthenticated, usuarioController.addUsuario);

router.get('/table', ensureAuthenticated, usuarioController.getUsuario);

module.exports = router;
