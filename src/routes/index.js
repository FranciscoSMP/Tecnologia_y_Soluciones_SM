const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../lib/auth');
const passport = require('passport');

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        return res.redirect('/dashboard');
    }
    res.render('index', {
        title: 'Tecnología y Soluciones SM'
    });
});

router.get('/dashboard', ensureAuthenticated, (req, res) => {
    res.render('dashboard', {
        title: 'Panel de Control',
    });
});

router.get('/login', (req, res) => {
    res.render('login', {
        title: 'Iniciar Sesión'
    });
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        req.flash('success_msg', 'Ha cerrado sesión');
        res.redirect('/');
    });
});

module.exports = router;
