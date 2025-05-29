// backend/src/migrations/SEU_ARQUIVO_DE_MIGRATION_AQUI.js
// Substitua SEU_ARQUIVO_DE_MIGRATION_AQUI pelo nome real do seu arquivo

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('clientes', (table) => {
    table.increments('id').primary(); // Chave Primária, Auto-incremento
    table.string('nome_completo').notNullable();
    table.string('telefone_principal').notNullable();
    table.string('telefone_secundario');
    table.string('email').unique();
    table.string('endereco_rua_numero');
    table.string('endereco_complemento');
    table.string('endereco_bairro');
    table.string('endereco_cidade');
    table.string('endereco_estado', 2); // Limite de 2 caracteres para UF
    table.string('endereco_cep');
    table.date('data_nascimento');
    table.text('observacoes');
    table.timestamp('data_cadastro').defaultTo(knex.fn.now());
    table.timestamp('data_atualizacao').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('clientes');
}