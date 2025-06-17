// backend/src/controllers/ordemServicoController.js
import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Função para CRIAR uma nova Ordem de Serviço (SIMPLIFICADA)
export async function criarOrdemServico(req, res) {
  const {
    cliente_id,
    tipo_equipamento,
    marca_equipamento,
    modelo_equipamento,
    defeito_relatado_cliente,
    // --- Valores agora são digitados diretamente ---
    valor_servico_mao_de_obra = 0,
    valor_total_pecas = 0,
    valor_desconto = 0,
    valor_total_os = 0, // O usuário vai digitar ou calcular no frontend
    // --- Peças é um campo de texto simples ---
    pecas_utilizadas, 
    // --- Outros campos ---
    status_os = 'Orçamento'
  } = req.body;

  if (!cliente_id || !tipo_equipamento || !defeito_relatado_cliente) {
    return res.status(400).json({ erro: 'Cliente, tipo de equipamento e defeito relatado são obrigatórios.' });
  }

  const numero_os = `OS-${Date.now()}-${uuidv4().substring(0, 4).toUpperCase()}`;
  
  try {
    const clienteExistente = await db('clientes').where({ id: cliente_id }).first();
    if (!clienteExistente) {
      return res.status(404).json({ erro: 'Cliente não encontrado.' });
    }

    const [id] = await db('ordens_de_servico').insert({
      cliente_id,
      numero_os,
      tipo_equipamento,
      marca_equipamento,
      modelo_equipamento,
      defeito_relatado_cliente,
      pecas_utilizadas, // Apenas salva o texto que o usuário digitou
      valor_servico_mao_de_obra: parseFloat(valor_servico_mao_de_obra),
      valor_total_pecas: parseFloat(valor_total_pecas),
      valor_desconto: parseFloat(valor_desconto),
      valor_total_os: parseFloat(valor_total_os),
      status_os
    }).returning('id');

    const novaOS = await db('ordens_de_servico').where({ id }).first();
    res.status(201).json(novaOS);
  } catch (error) {
    console.error("Erro ao criar Ordem de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao criar Ordem de Serviço.' });
  }
}


// Função para ATUALIZAR uma Ordem de Serviço (SIMPLIFICADA)
export async function atualizarOrdemServico(req, res) {
  const { id } = req.params;
  const dadosParaAtualizar = req.body;

  // Remova campos que não queremos que sejam atualizados diretamente
  delete dadosParaAtualizar.id;
  delete dadosParaAtualizar.numero_os; // Geralmente não se muda o número da OS
  delete dadosParaAtualizar.data_criacao_os;

  // Adiciona a data de atualização
  dadosParaAtualizar.data_atualizacao_os = db.fn.now();

  try {
    const atualizado = await db('ordens_de_servico').where({ id }).update(dadosParaAtualizar);

    if (atualizado) {
      // Lógica de integração com o caixa ao pagar (mantida)
      const osAtual = await db('ordens_de_servico').where({ id }).first();
      // O status_os ANTERIOR não é facilmente acessível aqui sem uma busca prévia,
      // então a lógica de lançar no caixa ao pagar pode precisar de ajuste ou ser simplificada
      // para sempre verificar se o status é de pagamento e se uma entrada de caixa JÁ não existe para esta OS.
      // Por simplicidade, vamos remover a integração automática com o caixa nesta versão simplificada.
      // O lançamento no caixa será feito manualmente na página do Caixa.

      const osAtualizadaComCliente = await db('ordens_de_servico')
        .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
        .select('ordens_de_servico.*', 'clientes.nome_completo as nome_cliente')
        .where('ordens_de_servico.id', id)
        .first();

      res.status(200).json(osAtualizadaComCliente);
    } else {
      res.status(404).json({ erro: 'Ordem de Serviço não encontrada para atualização.' });
    }
  } catch (error) {
    console.error("Erro ao atualizar Ordem de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao atualizar Ordem de Serviço.' });
  }
}


// As outras funções (listar, buscar por id, deletar) podem continuar como estavam,
// pois são mais simples e não envolvem a lógica complexa de peças.
// Aqui estão elas para garantir que o arquivo fique completo:

// Função para LISTAR todas as Ordens de Serviço
export async function listarOrdensServico(req, res) {
  try {
    const ordens = await db('ordens_de_servico')
      .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
      .select('ordens_de_servico.*', 'clientes.nome_completo as nome_cliente')
      .orderBy('ordens_de_servico.data_criacao_os', 'desc');
    res.status(200).json(ordens);
  } catch (error) {
    console.error("Erro ao listar Ordens de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao listar Ordens de Serviço.' });
  }
}

// Função para BUSCAR uma Ordem de Serviço pelo ID
export async function buscarOrdemServicoPorId(req, res) {
  const { id } = req.params;
  try {
    const ordemServico = await db('ordens_de_servico')
      .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
      .select('ordens_de_servico.*', 'clientes.nome_completo as nome_cliente')
      .where('ordens_de_servico.id', id)
      .first();
    if (ordemServico) {
      res.status(200).json(ordemServico);
    } else {
      res.status(404).json({ erro: 'Ordem de Serviço não encontrada.' });
    }
  } catch (error) {
    console.error("Erro ao buscar Ordem de Serviço por ID:", error);
    res.status(500).json({ erro: 'Erro ao buscar Ordem de Serviço.' });
  }
}

// Função para DELETAR uma Ordem de Serviço
export async function deletarOrdemServico(req, res) {
  const { id } = req.params;
  try {
    const deletado = await db('ordens_de_servico').where({ id }).del();
    if (deletado) {
      res.status(200).json({ mensagem: 'Ordem de Serviço deletada com sucesso.' });
    } else {
      res.status(404).json({ erro: 'Ordem de Serviço não encontrada para deleção.' });
    }
  } catch (error) {
    console.error("Erro ao deletar Ordem de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao deletar Ordem de Serviço.' });
  }
}