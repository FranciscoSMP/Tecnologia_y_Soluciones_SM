-- Crear base de datos
CREATE DATABASE InventarioDB;
GO
USE InventarioDB;
GO

-- ========================
-- TABLA: Proveedor
-- ========================
CREATE TABLE Proveedor (
    id_proveedor INT IDENTITY(1,1) PRIMARY KEY,
    nit VARCHAR(20) NOT NULL UNIQUE,
    nombre_comercial VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20),
    correo_electronico VARCHAR(100)
);

-- ========================
-- TABLA: Categoria
-- ========================
CREATE TABLE Categoria (
    id_categoria INT IDENTITY(1,1) PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- ========================
-- TABLA: Producto
-- ========================
CREATE TABLE Producto (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio_unitario DECIMAL(10,2) NOT NULL,
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_proveedor)
);

-- ========================
-- TABLA: Existencias (Stock)
-- ========================
CREATE TABLE Existencias (
    id_existencia INT IDENTITY(1,1) PRIMARY KEY,
    sku VARCHAR(50) NOT NULL UNIQUE,
    id_producto INT NOT NULL,
    cantidad_disponible INT NOT NULL DEFAULT 0,
    umbral_minimo INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);
GO


-- ==========================================
-- 2. Crear procedimiento almacenado para insertar
-- ==========================================
CREATE PROCEDURE spInsertExistencia
    @id_producto INT,
    @cantidad_disponible INT,
    @umbral_minimo INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_existencia INT;
    DECLARE @sku VARCHAR(50);
    DECLARE @categoria_nombre VARCHAR(100);

    -- Obtener el nombre de la categoría del producto
    SELECT @categoria_nombre = c.nombre_categoria
    FROM Producto p
    INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
    WHERE p.id_producto = @id_producto;

    -- Insertar la fila temporalmente para obtener id_existencia
    INSERT INTO Existencias (sku, id_producto, cantidad_disponible, umbral_minimo)
    VALUES ('TEMP', @id_producto, @cantidad_disponible, @umbral_minimo);

    -- Obtener el id_insertado
    SET @id_existencia = SCOPE_IDENTITY();

    -- Generar SKU final
    SET @sku = CONCAT(UPPER(LEFT(@categoria_nombre,3)), '-', @id_producto, '-', @id_existencia);

    -- Actualizar la fila con el SKU final
    UPDATE Existencias
    SET sku = @sku
    WHERE id_existencia = @id_existencia;
END;
GO

-- ========================
-- TABLA: Usuario
-- ========================
CREATE TABLE Usuario (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre_usuario VARCHAR(50) UNIQUE NOT NULL,
    nombre_completo VARCHAR(100),
    correo_electronico VARCHAR(100),
    contrasena VARCHAR(255) NOT NULL
);

-- ========================
-- TABLA: Rol y Permisos
-- ========================
CREATE TABLE RolPermisos (
    id_rol INT IDENTITY(1,1) PRIMARY KEY,
    nombre_rol VARCHAR(50) NOT NULL,
    descripcion TEXT,
    permisos TEXT
);

-- Relación Usuario - Rol
CREATE TABLE UsuarioRol (
    id_usuario INT NOT NULL,
    id_rol INT NOT NULL,
    PRIMARY KEY (id_usuario, id_rol),
    FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario),
    FOREIGN KEY (id_rol) REFERENCES RolPermisos(id_rol)
);

-- ========================
-- TABLA: Transaccion
-- ========================
CREATE TABLE Transaccion (
    id_transaccion INT IDENTITY(1,1) PRIMARY KEY,
    tipo VARCHAR(50) NOT NULL, -- Ejemplo: Entrada, Salida
    motivo TEXT,
    fecha DATETIME NOT NULL,
    usuario_responsable INT NOT NULL,
    FOREIGN KEY (usuario_responsable) REFERENCES Usuario(id_usuario)
);

-- ========================
-- TABLA: Detalle de Transacción
-- ========================
CREATE TABLE DetalleTransaccion (
    id_detalle INT IDENTITY(1,1) PRIMARY KEY,
    id_transaccion INT NOT NULL,
    id_producto INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (id_transaccion) REFERENCES Transaccion(id_transaccion),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- ========================
-- TABLA: Reporte
-- ========================
CREATE TABLE Reporte (
    id_reporte INT IDENTITY(1,1) PRIMARY KEY,
    tipo_reporte VARCHAR(50) NOT NULL,
    fecha_generacion DATETIME NOT NULL,
    usuario_solicitante INT NOT NULL,
    FOREIGN KEY (usuario_solicitante) REFERENCES Usuario(id_usuario)
);
GO



USE InventarioDB;
GO

-- ========================
-- DATOS: Proveedor
-- ========================
INSERT INTO Proveedor (nit, nombre_comercial, direccion, telefono, correo_electronico)
VALUES 
('1234567-8', 'TecnoGuate', 'Zona 1, Ciudad de Guatemala', '5555-1111', 'contacto@tecnoguate.com'),
('9876543-2', 'ElectroMaya', 'Zona 10, Ciudad de Guatemala', '5555-2222', 'ventas@electromaya.com'),
('4567891-0', 'CompuExpress', 'Mixco, Guatemala', '5555-3333', 'info@compuexpress.com');

-- ========================
-- DATOS: Categoría
-- ========================
INSERT INTO Categoria (nombre_categoria, descripcion)
VALUES
('Computadoras', 'Laptops, desktops y accesorios relacionados'),
('Accesorios', 'Teclados, mouse, audífonos y periféricos'),
('Redes', 'Routers, switches, cables de red y más');

-- ========================
-- DATOS: Producto
-- ========================
INSERT INTO Producto (nombre, descripcion, precio_unitario, id_categoria, id_proveedor)
VALUES
('Laptop Lenovo ThinkPad', 'Laptop empresarial con procesador Intel i7', 8500.00, 1, 1),
('Mouse Logitech', 'Mouse inalámbrico óptico', 150.00, 2, 2),
('Router TP-Link', 'Router inalámbrico de alta velocidad', 650.00, 3, 3),
('Teclado Mecánico Redragon', 'Teclado retroiluminado mecánico', 400.00, 2, 1),
('Servidor Dell PowerEdge', 'Servidor rack de alto rendimiento', 25000.00, 1, 2);

-- ========================
-- DATOS: Existencias
-- 3. Insertar ejemplos usando el procedimiento
-- ==========================================
EXEC spInsertExistencia @id_producto = 1, @cantidad_disponible = 20, @umbral_minimo = 5;
EXEC spInsertExistencia @id_producto = 2, @cantidad_disponible = 50, @umbral_minimo = 10;
EXEC spInsertExistencia @id_producto = 3, @cantidad_disponible = 15, @umbral_minimo = 5;
EXEC spInsertExistencia @id_producto = 4, @cantidad_disponible = 30, @umbral_minimo = 8;
EXEC spInsertExistencia @id_producto = 5, @cantidad_disponible = 5, @umbral_minimo = 2;

select * from Existencias;




-- ========================
-- DATOS: Usuario
-- ========================
INSERT INTO Usuario (nombre_usuario, nombre_completo, correo_electronico, contrasena)
VALUES
('admin', 'Administrador General', 'admin@inventario.com', 'admin123'),
('jlopez', 'Juan Lopez', 'jlopez@inventario.com', 'juan123'),
('mgarcia', 'Maria Garcia', 'mgarcia@inventario.com', 'maria123');

-- ========================
-- DATOS: Roles y permisos
-- ========================
INSERT INTO RolPermisos (nombre_rol, descripcion, permisos)
VALUES
('Administrador', 'Acceso completo al sistema', 'CRUD completo en todas las tablas'),
('Almacenero', 'Gestión de inventario y transacciones', 'Insertar, actualizar y consultar productos y existencias'),
('Consultor', 'Acceso solo a reportes', 'Lectura de reportes y consultas de productos');

-- ========================
-- Relación Usuario - Rol
-- ========================
INSERT INTO UsuarioRol (id_usuario, id_rol)
VALUES
(1, 1), -- admin -> Administrador
(2, 2), -- jlopez -> Almacenero
(3, 3); -- mgarcia -> Consultor

-- ========================
-- DATOS: Transacciones
-- ========================
INSERT INTO Transaccion (tipo, motivo, fecha, usuario_responsable)
VALUES
('Entrada', 'Ingreso inicial de stock', GETDATE(), 2),
('Salida', 'Venta a cliente final', GETDATE(), 2);

-- ========================
-- DATOS: Detalle de Transacción
-- ========================
INSERT INTO DetalleTransaccion (id_transaccion, id_producto, cantidad, precio_unitario)
VALUES
(1, 1, 10, 8500.00), -- Entrada 10 Laptops
(1, 2, 30, 150.00),  -- Entrada 30 Mouse
(1, 3, 10, 650.00),  -- Entrada 10 Routers
(2, 2, 5, 150.00),   -- Salida 5 Mouse
(2, 1, 2, 8500.00);  -- Salida 2 Laptops

-- ========================
-- DATOS: Reportes
-- ========================
INSERT INTO Reporte (tipo_reporte, fecha_generacion, usuario_solicitante)
VALUES
('Inventario Actual', GETDATE(), 1),
('Movimientos del Día', GETDATE(), 2);


select * from Proveedor;
select * from Categoria;
select * from Producto;
select * from Existencias;
select * from Usuario;
select * from RolPermisos;
select * from UsuarioRol;
select * from Transaccion;
select * from DetalleTransaccion;
select * from Reporte;

