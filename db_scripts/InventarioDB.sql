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
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- Roles iniciales
INSERT INTO Rol (Rol) VALUES
('Administrador'),
('Cajero');
