-- Crear base de datos
CREATE DATABASE InventarioDB;
GO
USE InventarioDB;
GO

CREATE TABLE Rol (
    Id_Rol INT PRIMARY KEY IDENTITY(1,1),
    Rol VARCHAR(50) NOT NULL
);

CREATE TABLE Usuario (
    Id_Usuario INT PRIMARY KEY IDENTITY(1,1),
    Nombre_Usuario VARCHAR(50) NOT NULL UNIQUE,
    Primer_Nombre VARCHAR(50) NOT NULL,
    Segundo_Nombre VARCHAR(50) NULL,
    Primer_Apellido VARCHAR(50) NOT NULL,
    Segundo_Apellido VARCHAR(50) NULL,
    Correo_Electronico VARCHAR(100),
    Contrasenia VARCHAR(255) NOT NULL,
    Id_Rol INT NOT NULL,
    FOREIGN KEY (Id_Rol) REFERENCES Rol(Id_Rol)
);

CREATE TABLE Categoria (
    id_categoria INT IDENTITY(1,1) PRIMARY KEY,
    nombre_categoria VARCHAR(100) NOT NULL,
    descripcion TEXT
);

CREATE TABLE Proveedor (
    id_proveedor INT IDENTITY(1,1) PRIMARY KEY,
    nit VARCHAR(9) NOT NULL,
    nombre_comercial VARCHAR(100) NOT NULL,
    direccion VARCHAR(150),
    telefono VARCHAR(20),
    correo_electronico VARCHAR(100)
);

CREATE TABLE Producto (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    sku NVARCHAR(50) UNIQUE, -- Se generará automáticamente con el trigger
    nombre NVARCHAR(100) NOT NULL,
    descripcion NVARCHAR(MAX),
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0),
    stock_actual INT NOT NULL DEFAULT 0 CHECK (stock_actual >= 0),
    umbral_minimo INT NOT NULL DEFAULT 0 CHECK (umbral_minimo >= 0),
    id_categoria INT NOT NULL,
    id_proveedor INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES Categoria(id_categoria),
    FOREIGN KEY (id_proveedor) REFERENCES Proveedor(id_proveedor)
);
GO

-- ========================
-- TRIGGER PARA GENERAR SKU AUTOMÁTICAMENTE
-- ========================
CREATE TRIGGER tr_GenerarSKU_Producto
ON Producto
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE p
    SET p.sku = CONCAT('TSM-', FORMAT(i.id_producto, 'D6'))
    FROM Producto p
    INNER JOIN inserted i ON p.id_producto = i.id_producto;
END;
GO

-- ========================
-- TABLA: Transaccion (Añadido 'Devolucion' y 'Ajuste' como tipos válidos)
-- ========================
CREATE TABLE Transaccion (
    id_transaccion INT IDENTITY(1,1) PRIMARY KEY,
    tipo_transaccion NVARCHAR(20) NOT NULL CHECK (tipo_transaccion IN ('Entrada', 'Salida', 'Devolucion', 'Ajuste')),
    motivo NVARCHAR(MAX),
    fecha DATETIME NOT NULL DEFAULT GETDATE(),
    cantidad INT NOT NULL, -- Para Ajustes, puede ser un número negativo.
    Id_Usuario INT NOT NULL,
    id_producto INT NOT NULL,
    FOREIGN KEY (Id_Usuario) REFERENCES Usuario(Id_Usuario),
    FOREIGN KEY (id_producto) REFERENCES Producto(id_producto)
);
GO

-- ========================
-- TRIGGER PARA ACTUALIZAR STOCK (Modificado para incluir Devolucion)
-- Garantiza que el stock se actualice con cada movimiento (RF-03).
-- ========================
CREATE TRIGGER tr_ActualizarStock_Transaccion
ON Transaccion
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    UPDATE p
    SET p.stock_actual = p.stock_actual + (
        CASE
            -- Transacciones que suman al stock
            WHEN t.tipo_transaccion IN ('Entrada', 'Devolucion') THEN i.cantidad
            -- Transacción que resta del stock
            WHEN t.tipo_transaccion = 'Salida' THEN -i.cantidad
            -- Transacción de ajuste que puede sumar o restar
            WHEN t.tipo_transaccion = 'Ajuste' THEN i.cantidad -- La cantidad en sí misma será positiva o negativa
            ELSE 0
        END
    )
    FROM Producto p
    INNER JOIN inserted i ON p.id_producto = i.id_producto
    INNER JOIN Transaccion t ON i.id_transaccion = t.id_transaccion;
END;
GO


-- Roles iniciales
INSERT INTO Rol (Rol) VALUES
('Administrador'),
('Bodeguero/a');
