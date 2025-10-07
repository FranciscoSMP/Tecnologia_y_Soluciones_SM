require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./lib/passport');

const app = express();

// Configuración
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));

app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs'
}));
app.set('view engine', '.hbs');

// Middlewares
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Variables globales
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Rutas
app.use(require('./routes/index'));
app.use(require('./routes/auth'));
app.use(require('./routes/index'));
app.use(require('./routes/usuarios'));


// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Servidor
app.listen(app.get('port'), () => {
    console.log(`Servidor iniciado en el puerto ${app.get('port')}`);
});
