const express = require('express');
const router = express.Router();
const { isLoggedIn } = require('../lib/auth');

router.get('/', (req, res) => {
    res.render('index', { title: 'Tecnología y Soluciones SM' });
});

router.get('/dashboard', isLoggedIn, (req, res) => {
    res.render('dashboard', {
        title: 'Panel de Control',
        user: req.user
    });
});

module.exports = router;
