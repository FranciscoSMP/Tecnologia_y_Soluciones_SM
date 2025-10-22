require('dotenv').config();
const sql = require('mssql/msnodesqlv8');

const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_NAME,
    driver: 'msnodesqlv8',
    options: {
        trustedConnection: true // Usa autenticación de Windows
    }
};

const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then(pool => {
        console.log(`Conectado a la base de datos ${process.env.DB_NAME}`);
        return pool;
    })
    .catch(err => console.log('Error en la conexión a la base de datos:', err));

module.exports = { sql, poolPromise };
