// backend/src/migrations/timestamp_create_itens_de_caixa_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('itens_de_caixa', (table) => {
    table.increments('id').primary();
    table.string('descricao').notNullable();
    table.enum('tipo_movimentacao', ['Entrada', 'Saída']).notNullable(); // 'Entrada' ou 'Saída'
    table.decimal('valor', 10, 2).notNullable();
    table.timestamp('data_movimentacao').notNullable().defaultTo(knex.fn.now());

    table.integer('ordem_servico_id').unsigned().nullable()
         .references('id').inTable('ordens_de_servico')
         .onDelete('SET NULL'); // Se a OS for deletada, o ID aqui fica nulo

    table.integer('cliente_id').unsigned().nullable()
         .references('id').inTable('clientes')
         .onDelete('SET NULL'); // Se o Cliente for deletado, o ID aqui fica nulo

    // Opcional: Referência a um produto/peça se a movimentação for de uma venda de item específico
    // table.integer('produto_peca_id').unsigned().nullable()
    //      .references('id').inTable('produtos_pecas')
    //      .onDelete('SET NULL');

    table.string('categoria'); // Ex: "Venda de Serviço", "Compra de Peça", "Despesa Aluguel"
    table.text('observacoes');
    table.timestamp('data_registro').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTableIfExists('itens_de_caixa'); // dropTableIfExists para segurança
}