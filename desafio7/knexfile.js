const dotenv = require("dotenv")
dotenv.config();

const DATABASE_HOST = process.env.DATABASE_HOST_MARIADB || "localhost";
const DATABASE_PORT = process.env.DATABASE_PORT_MARIADB || "3306";
const DATABASE_USER = process.env.DATABASE_USER_MARIADB || "root";
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD_MARIADB || "";
const DATABASE_NAME = process.env.DATABASE_NAME_MARIADB || "ecommerce";

const knexConfig = {
  client: 'mysql',
  connection: {
    host: DATABASE_HOST,
    port: DATABASE_PORT,
    user: DATABASE_USER,
    password: DATABASE_PASSWORD,
    database: DATABASE_NAME,
  },
  migrations: {
    tableName: 'migrations',
    directory: './database/migrations'
  },
  seeds: {
    tableName: 'seeds',
    directory: './database/seeds',
  }
}

module.exports = knexConfig;