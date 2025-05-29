// backend/src/config/database.js
import knex from 'knex';
import knexfileConfig from '../../knexfile.js';

// Determina qual configuração usar (desenvolvimento por padrão)
const environment = process.env.NODE_ENV || 'development';
const config = knexfileConfig[environment];

const db = knex(config);

export default db;