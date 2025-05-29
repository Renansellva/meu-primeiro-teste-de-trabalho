// backend/src/migrations/timestamp_create_ordens_de_servico_table.js

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
  return knex.schema.createTable('ordens_de_servico', (table) => {
    table.increments('id').primary();
    table
      .integer('cliente_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('clientes')
      .onUpdate('CASCADE')
      .onDelete('RESTRICT'); // Impede deletar cliente se tiver O.S. associada

    table.string('numero_os').notNullable().unique(); // Número único da O.S.
    table.string('tipo_equipamento').notNullable();
    table.string('marca_equipamento').notNullable();
    table.string('modelo_equipamento').notNullable();
    table.string('numero_serie_imei');
    table.text('defeito_relatado_cliente').notNullable();
    table.text('diagnostico_tecnico');
    table.text('servico_executado');
    table.text('pecas_utilizadas'); // Pode ser um JSON como string
    table.decimal('valor_servico_mao_de_obra', 10, 2).notNullable();
    table.decimal('valor_total_pecas', 10, 2).defaultTo(0);
    table.decimal('valor_desconto', 10, 2).defaultTo(0);
    table.decimal('valor_total_os', 10, 2).notNullable();
    table.string('forma_pagamento');
    table.string('status_os').notNullable().defaultTo('Orçamento'); // Ex: Orçamento, Aguardando Aprovação, Em Reparo, Pronto, Entregue, Cancelado
    table.text('observacoes_internas');
    table.text('acessorios_deixados');
    table.string('senha_equipamento');
    table.boolean('servico_autorizado_cliente').defaultTo(false);
    table.date('data_previsao_entrega');
    table.timestamp('data_entrega_efetiva');
    table.timestamp('data_orcamento');
    table.timestamp('data_aprovacao_orcamento');
    table.integer('garantia_servico'); // Em dias

    table.timestamp('data_entrada').defaultTo(knex.fn.now());
    table.timestamp('data_criacao_os').defaultTo(knex.fn.now());
    table.timestamp('data_atualizacao_os').defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex) {
  return knex.schema.dropTable('ordens_de_servico');
}