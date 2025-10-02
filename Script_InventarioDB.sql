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
    sku VARCHAR(50) PRIMARY KEY,   -- SKU alfanumérico
    id_producto INT NOT NULL,
    cantidad_disponible INT NOT NULL DEFAULT 0,
    umbral_minimo INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);

-- Trigger para generar SKU con prefijo de categoría en SQL Server
CREATE TRIGGER generar_sku
ON Existencias
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE e
    SET sku = CONCAT(
        UPPER(LEFT(c.nombre_categoria,3)), 
        '-', i.id_producto, '-', 
        (SELECT COUNT(*) 
         FROM Existencias ex 
         WHERE ex.id_producto = i.id_producto)
    )
    FROM Existencias e
    INNER JOIN inserted i ON e.sku = i.sku
    INNER JOIN Producto p ON i.id_producto = p.id_producto
    INNER JOIN Categoria c ON p.id_categoria = c.id_categoria
    WHERE (i.sku IS NULL OR i.sku = '');
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