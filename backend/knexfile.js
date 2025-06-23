import path from 'path';
import { fileURLToPath } from 'url';

// Hack para obter __dirname em módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  // Configuração para seu ambiente de desenvolvimento local
  development: {
    client: 'sqlite3',
    connection: {
      filename: path.resolve(__dirname, 'src', 'database', 'database.db')
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
    useNullAsDefault: true,
  },

  // Configuração para o ambiente de produção na Render
  production: {
    client: 'pg', // PostgreSQL
    connection: {
      connectionString: process.env.DATABASE_URL, // Pega a URL do banco das variáveis de ambiente da Render
      ssl: { rejectUnauthorized: false },
    },
    migrations: {
      directory: path.resolve(__dirname, 'src', 'database', 'migrations')
    },
  }
};