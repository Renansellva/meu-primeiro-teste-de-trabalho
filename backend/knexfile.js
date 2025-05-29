// backend/knexfile.js
import path from 'path';
import { fileURLToPath } from 'url';

// Equivalente a __dirname no ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'dev.sqlite3') // Caminho para o arquivo do banco
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'migrations')
    },
    useNullAsDefault: true // Necessário para SQLite
  },
  // Você pode adicionar configurações para 'staging' e 'production' aqui depois
  // production: {
  //   client: 'postgresql', // Ou outro banco de sua escolha para produção
  //   connection: {
  //     connectionString: process.env.DATABASE_URL, // Exemplo para Heroku/Render com PostgreSQL
  //     ssl: { rejectUnauthorized: false },
  //   },
  //   migrations: {
  //     directory: path.resolve(__dirname, 'src', 'migrations')
  //   },
  //   useNullAsDefault: true
  // }
};