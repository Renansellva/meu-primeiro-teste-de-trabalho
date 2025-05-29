// backend/src/controllers/ordemServicoController.js
import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid'; // Para gerar um número de OS único, se desejado

// Função para CRIAR uma nova Ordem de Serviço
export async function criarOrdemServico(req, res) {
  const {
    cliente_id,
    tipo_equipamento,
    marca_equipamento,
    modelo_equipamento,
    numero_serie_imei,
    defeito_relatado_cliente,
    diagnostico_tecnico,
    servico_executado,
    pecas_utilizadas, // Espera-se uma string (pode ser JSON stringificado)
    valor_servico_mao_de_obra,
    valor_total_pecas = 0, // Valor padrão
    valor_desconto = 0,    // Valor padrão
    status_os = 'Orçamento', // Valor padrão
    observacoes_internas,
    acessorios_deixados,
    senha_equipamento,
    servico_autorizado_cliente,
    data_previsao_entrega,
    garantia_servico
  } = req.body;

  // Validação básica
  if (!cliente_id || !tipo_equipamento || !marca_equipamento || !modelo_equipamento || !defeito_relatado_cliente || valor_servico_mao_de_obra === undefined) {
    return res.status(400).json({
      erro: 'Campos obrigatórios faltando: cliente_id, tipo_equipamento, marca_equipamento, modelo_equipamento, defeito_relatado_cliente, valor_servico_mao_de_obra.'
    });
  }

  // Gerar um número de OS único (exemplo simples: timestamp + parte de UUID)
  // Você pode querer uma lógica mais robusta para isso em produção
  const numero_os = `OS-${Date.now()}-${uuidv4().substring(0, 4)}`;

  // Calcular valor_total_os
  const valorTotalOSCalculado = (Number(valor_servico_mao_de_obra) + Number(valor_total_pecas)) - Number(valor_desconto);

  try {
    // Verifica se o cliente_id existe
    const clienteExistente = await db('clientes').where({ id: cliente_id }).first();
    if (!clienteExistente) {
      return res.status(404).json({ erro: 'Cliente não encontrado com o ID fornecido.' });
    }

    const [id] = await db('ordens_de_servico').insert({
      cliente_id,
      numero_os,
      tipo_equipamento,
      marca_equipamento,
      modelo_equipamento,
      numero_serie_imei,
      defeito_relatado_cliente,
      diagnostico_tecnico,
      servico_executado,
      pecas_utilizadas,
      valor_servico_mao_de_obra,
      valor_total_pecas,
      valor_desconto,
      valor_total_os: valorTotalOSCalculado, // Usar o valor calculado
      status_os,
      observacoes_internas,
      acessorios_deixados,
      senha_equipamento,
      servico_autorizado_cliente,
      data_previsao_entrega: data_previsao_entrega || null,
      garantia_servico: garantia_servico || null,
      // data_entrada, data_criacao_os, data_atualizacao_os usarão os defaults do DB
    }).returning('id');

    const novaOS = await db('ordens_de_servico').where({ id }).first();
    res.status(201).json(novaOS);
  } catch (error) {
    console.error("Erro ao criar Ordem de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao criar Ordem de Serviço.', detalhe: error.message });
  }
}

// Função para LISTAR todas as Ordens de Serviço
export async function listarOrdensServico(req, res) {
  try {
    // Seleciona dados da O.S. e também o nome do cliente associado usando um JOIN
    const ordens = await db('ordens_de_servico')
      .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
      .select(
        'ordens_de_servico.*', // Todos os campos de ordens_de_servico
        'clientes.nome_completo as nome_cliente' // E o nome do cliente
      )
      .orderBy('ordens_de_servico.data_criacao_os', 'desc'); // Ordena pelas mais recentes

    res.status(200).json(ordens);
  } catch (error) {
    console.error("Erro ao listar Ordens de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao listar Ordens de Serviço.', detalhe: error.message });
  }
}