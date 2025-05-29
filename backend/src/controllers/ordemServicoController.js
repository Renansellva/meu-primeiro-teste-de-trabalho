// backend/src/controllers/ordemServicoController.js
import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Função para CRIAR uma nova Ordem de Serviço (você já tem esta)
export async function criarOrdemServico(req, res) {
  // ... (código existente da função criarOrdemServico)
  const {
    cliente_id,
    tipo_equipamento,
    marca_equipamento,
    modelo_equipamento,
    numero_serie_imei,
    defeito_relatado_cliente,
    diagnostico_tecnico,
    servico_executado,
    pecas_utilizadas,
    valor_servico_mao_de_obra,
    valor_total_pecas = 0,
    valor_desconto = 0,
    status_os = 'Orçamento',
    observacoes_internas,
    acessorios_deixados,
    senha_equipamento,
    servico_autorizado_cliente,
    data_previsao_entrega,
    garantia_servico
  } = req.body;

  if (!cliente_id || !tipo_equipamento || !marca_equipamento || !modelo_equipamento || !defeito_relatado_cliente || valor_servico_mao_de_obra === undefined) {
    return res.status(400).json({
      erro: 'Campos obrigatórios faltando: cliente_id, tipo_equipamento, marca_equipamento, modelo_equipamento, defeito_relatado_cliente, valor_servico_mao_de_obra.'
    });
  }
  const numero_os = `OS-${Date.now()}-${uuidv4().substring(0, 4)}`;
  const valorTotalOSCalculado = (Number(valor_servico_mao_de_obra) + Number(valor_total_pecas)) - Number(valor_desconto);

  try {
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
      valor_total_os: valorTotalOSCalculado,
      status_os,
      observacoes_internas,
      acessorios_deixados,
      senha_equipamento,
      servico_autorizado_cliente,
      data_previsao_entrega: data_previsao_entrega || null,
      garantia_servico: garantia_servico || null,
    }).returning('id');

    const novaOS = await db('ordens_de_servico').where({ id }).first();
    res.status(201).json(novaOS);
  } catch (error) {
    console.error("Erro ao criar Ordem de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao criar Ordem de Serviço.', detalhe: error.message });
  }
}

// Função para LISTAR todas as Ordens de Serviço (você já tem esta)
export async function listarOrdensServico(req, res) {
  // ... (código existente da função listarOrdensServico)
  try {
    const ordens = await db('ordens_de_servico')
      .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
      .select(
        'ordens_de_servico.*',
        'clientes.nome_completo as nome_cliente'
      )
      .orderBy('ordens_de_servico.data_criacao_os', 'desc');

    res.status(200).json(ordens);
  } catch (error) {
    console.error("Erro ao listar Ordens de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao listar Ordens de Serviço.', detalhe: error.message });
  }
}

// --- NOVA FUNÇÃO ABAIXO ---

// Função para BUSCAR uma Ordem de Serviço pelo ID
export async function buscarOrdemServicoPorId(req, res) {
  const { id } = req.params; // Pega o ID dos parâmetros da rota (ex: /api/ordens-servico/1)

  try {
    const ordemServico = await db('ordens_de_servico')
      .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
      .select(
        'ordens_de_servico.*',
        'clientes.nome_completo as nome_cliente', // Inclui o nome do cliente
        'clientes.telefone_principal as telefone_cliente', // Exemplo: incluir telefone do cliente
        'clientes.email as email_cliente' // Exemplo: incluir email do cliente
      )
      .where('ordens_de_servico.id', id)
      .first(); // .first() para pegar apenas um resultado

    if (ordemServico) {
      res.status(200).json(ordemServico);
    } else {
      res.status(404).json({ erro: 'Ordem de Serviço não encontrada.' });
    }
  } catch (error) {
    console.error("Erro ao buscar Ordem de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao buscar Ordem de Serviço no banco de dados.', detalhe: error.message });
  }
}

// (Adicionaremos as funções para atualizar e deletar O.S. aqui depois)