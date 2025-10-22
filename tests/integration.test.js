const request = require('supertest');
const { app, server } = require('../src/index'); 
const { poolPromise } = require('../src/keys'); 

afterAll(async () => {
    const pool = await poolPromise;
    await pool.close();
    server.close();
});


// ========= PRUEBAS PARA RUTAS DE ÍNDICE Y AUTENTICACIÓN =========
describe('GET / y Rutas de Autenticación', () => {
    it('Debería responder con status 200 para GET /login', async () => {
        const response = await request(app).get('/login');
        expect(response.statusCode).toBe(200);
    });

    it('Debería redirigir de / a /dashboard si está autenticado (simulado)', async () => {
        const response = await request(app).get('/');
        expect(response.statusCode).toBe(200); 
    });
    
    it('Debería mostrar el dashboard para GET /dashboard (requiere auth)', async () => {
        const response = await request(app).get('/dashboard');
        expect(response.statusCode).toBe(302); // 302 es el código para redirección
    });
});


// ========= PRUEBAS PARA RUTAS DE PRODUCTOS =========
describe('Rutas /producto', () => {
    it('GET /table - Debería obtener la tabla de productos (requiere auth)', async () => {
        const response = await request(app).get('/producto/table');
        expect(response.statusCode).toBe(302);
    });

    it('GET /add - Debería mostrar el formulario para añadir producto (requiere auth)', async () => {
        const response = await request(app).get('/producto/add');
        expect(response.statusCode).toBe(302);
    });
    
    it('GET /editar/:id - Debería obtener un producto para editar (requiere auth)', async () => {
        const response = await request(app).get('/producto/editar/1'); // Usa un ID que exista
        expect(response.statusCode).toBe(302);
    });

    it('POST /actualizar - Debería actualizar un producto existente (requiere auth)', async () => {
        const response = await request(app)
            .post('/producto/actualizar')
            .send({
                id_producto: 1, 
                nombre_producto: 'Producto de Prueba Actualizado',
                descripcion: 'Nueva descripción actualizada',
                precio_unitario: 150.50,
                stock_actual: 45,
                umbral_minimo: 15,
                Id_Categoria: 1, 
                Id_Proveedor: 1
            });
        expect(response.statusCode).toBe(302);
    });

    it('POST /guardar - Debería crear un nuevo producto (requiere auth)', async () => {
        const response = await request(app)
            .post('/producto/guardar')
            .send({
                nombre_producto: 'Producto de Prueba',
                descripcion: 'Descripción de prueba',
                precio_unitario: 100,
                stock_actual: 50,
                umbral_minimo: 10,
                Id_Categoria: 1,
                Id_Proveedor: 1
            });
        expect(response.statusCode).toBe(302);
    });

    it('POST /eliminar/:id - Debería eliminar un producto (requiere auth)', async () => {
        const response = await request(app).post('/producto/eliminar/99'); 
        expect(response.statusCode).toBe(302);
    });
});


// ========= PRUEBAS PARA RUTAS DE USUARIOS =========
describe('Rutas /usuario', () => {
    it('GET /table - Debería obtener la tabla de usuarios (requiere auth)', async () => {
        const response = await request(app).get('/usuario/table');
        expect(response.statusCode).toBe(302);
    });

    it('GET /editar/:id - Debería obtener un usuario para editar (requiere auth)', async () => {
        const response = await request(app).get('/usuario/editar/1');
        expect(response.statusCode).toBe(302);
    });
    
    it('POST /eliminar/:id - Debería eliminar un usuario (requiere auth)', async () => {
        const response = await request(app).post('/usuario/eliminar/99');
        expect(response.statusCode).toBe(302);
    });

    it('POST /guardar - Debería crear un nuevo usuario (requiere auth)', async () => {
        const response = await request(app)
            .post('/usuario/guardar')
            .send({
                nombre_usuario: 'Usuario de Prueba',
                correo_electronico: 'usuario@prueba.test',
                contrasena: 'contrasenaSegura123',
                rol: 'admin'
            });
        expect(response.statusCode).toBe(302);
    });

    it('POST /actualizar/:id - Debería actualizar un usuario existente (requiere auth)', async () => {
        const response = await request(app)
            .post('/usuario/actualizar/1')
            .send({
                nombre_usuario: 'Usuario Actualizado',
                correo_electronico: 'usuario_actualizado@prueba.test',
                contrasena: 'nuevaContrasenaSegura123',
                rol: 'admin'
            });
        expect(response.statusCode).toBe(302);
    });

    it('POST /eliminar/:id - Debería eliminar un usuario (requiere auth)', async () => {
        const response = await request(app).post('/usuario/eliminar/99');
        expect(response.statusCode).toBe(302);
    });

});

// ========= PRUEBAS PARA RUTAS DE TRANSACCIONES =========
describe('Rutas /transaccion', () => {
    it('GET /table - Debería obtener la tabla de transacciones (requiere auth)', async () => {
        const response = await request(app).get('/transaccion/table');
        expect(response.statusCode).toBe(302);
    });

    it('GET /add - Debería mostrar el form para añadir transacción (requiere auth)', async () => {
        const response = await request(app).get('/transaccion/add');
        expect(response.statusCode).toBe(302);
    });

    it('POST /guardar - Debería crear una nueva transacción (requiere auth)', async () => {
        const response = await request(app)
            .post('/transaccion/guardar')
            .send({
                id_producto: 1,
                cantidad: 2,
                precio: 100,
                fecha: new Date()
            });
        expect(response.statusCode).toBe(302);
    });

    it('GET /ver/:id - Debería obtener una transacción para ver (requiere auth)', async () => {
        const response = await request(app).get('/transaccion/ver/1'); 
        expect(response.statusCode).toBe(302);
    });
});

// ========= PRUEBAS PARA RUTAS DE PROVEEDORES =========
describe('Rutas /proveedor', () => {
    it('GET /table - Debería obtener la tabla de proveedores (requiere auth)', async () => {
        const response = await request(app).get('/proveedor/table');
        expect(response.statusCode).toBe(302); 
    });

    it('GET /add - Debería mostrar el formulario para añadir proveedor (requiere auth)', async () => {
        const response = await request(app).get('/proveedor/add');
        expect(response.statusCode).toBe(302);
    });

    it('GET /editar/:id - Debería obtener un proveedor para editar (requiere auth)', async () => {
        const response = await request(app).get('/proveedor/editar/1');
        expect(response.statusCode).toBe(302);
    });

    it('POST /guardar - Debería crear un nuevo proveedor (requiere auth)', async () => {
        const response = await request(app)
            .post('/proveedor/guardar')
            .send({
                nombre_proveedor: 'Proveedor de Prueba',
                direccion: 'Calle Falsa 123',
                telefono: '555-1234',
                correo_electronico: 'contacto@proveedor.test'
            });
        expect(response.statusCode).toBe(302);
    });

    it('POST /actualizar - Debería actualizar un proveedor existente (requiere auth)', async () => {
        const response = await request(app)
            .post('/proveedor/actualizar')
            .send({
                id: 1,
                nombre_proveedor: 'Proveedor Actualizado',
                direccion: 'Calle Actualizada 123',
                telefono: '555-5678',
                correo_electronico: 'contacto@proveedoractualizado.test'
            });
        expect(response.statusCode).toBe(302);
    });

    it('POST /eliminar/:id - Debería eliminar un proveedor (requiere auth)', async () => {
        const response = await request(app).post('/proveedor/eliminar/99');
        expect(response.statusCode).toBe(302);
    });
});

// ========= PRUEBAS PARA RUTAS DE CATEGORÍAS =========
describe('Rutas /categoria', () => {
    it('GET /table - Debería obtener la tabla de categorías (requiere auth)', async () => {
        const response = await request(app).get('/categoria/table');
        expect(response.statusCode).toBe(302);
    });

    it('GET /add - Debería mostrar el formulario para añadir categoría (requiere auth)', async () => {
        const response = await request(app).get('/categoria/add');
        expect(response.statusCode).toBe(302);
    });

    it('GET /editar/:id - Debería obtener una categoría para editar (requiere auth)', async () => {
        const response = await request(app).get('/categoria/editar/1');
        expect(response.statusCode).toBe(302);
    });

    it('POST /guardar - Debería crear una nueva categoría (requiere auth)', async () => {
        const response = await request(app)
            .post('/categoria/guardar')
            .send({
                nombre_categoria: 'Categoría de Prueba',
                descripcion_categoria: 'Descripción de prueba'
            });
        expect(response.statusCode).toBe(302);
    });

    it('POST /actualizar - Debería actualizar una categoría existente (requiere auth)', async () => {
        const response = await request(app)
            .post('/categoria/actualizar')
            .send({
                id: 1,
                nombre_categoria: 'Categoría Actualizada',
                descripcion_categoria: 'Descripción actualizada'
            });
        expect(response.statusCode).toBe(302);
    });

    it('POST /eliminar/:id - Debería eliminar una categoría (requiere auth)', async () => {
        const response = await request(app).post('/categoria/eliminar/99');
        expect(response.statusCode).toBe(302);
    });
});