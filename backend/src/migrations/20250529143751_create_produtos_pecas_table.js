// backend/src/migrations/timestamp_create_produtos_pecas_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('produtos_pecas', (table) => {
    table.increments('id').primary();
    table.string('nome_produto').notNullable().unique();
    table.string('codigo_interno').unique();
    table.text('descricao');
    table.string('unidade_medida');
    table.integer('quantidade_estoque').notNullable().defaultTo(0);
    table.integer('estoque_minimo').defaultTo(0);
    table.decimal('preco_custo_medio', 10, 2);
    table.decimal('preco_venda_padrao', 10, 2);
    table.string('fornecedor_principal');
    table.string('localizacao_estoque');
    table.date('data_ultima_compra');
    table.timestamp('data_cadastro').defaultTo(knex.fn.now());
    table.timestamp('data_atualizacao').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('produtos_pecas');
}