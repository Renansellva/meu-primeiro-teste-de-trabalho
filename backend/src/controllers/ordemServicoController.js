// backend/src/controllers/ordemServicoController.js
import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid'; // Para gerar o número da OS

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
    pecas_utilizadas,
    valor_servico_mao_de_obra,
    valor_total_pecas = 0,
    valor_desconto = 0,
    status_os = 'Orçamento',
    observacoes_internas,
    acessorios_deixados,
    senha_equipamento,
    servico_autorizado_cliente = false, // Default para false
    data_previsao_entrega,
    garantia_servico,
    data_orcamento, // Adicionado
    data_aprovacao_orcamento, // Adicionado
    forma_pagamento // Adicionado
  } = req.body;

  if (!cliente_id || !tipo_equipamento || !marca_equipamento || !modelo_equipamento || !defeito_relatado_cliente || valor_servico_mao_de_obra === undefined) {
    return res.status(400).json({
      erro: 'Campos obrigatórios faltando: cliente_id, tipo_equipamento, marca_equipamento, modelo_equipamento, defeito_relatado_cliente, valor_servico_mao_de_obra.'
    });
  }

  const numero_os = `OS-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;
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
      data_orcamento: data_orcamento || null,
      data_aprovacao_orcamento: data_aprovacao_orcamento || null,
      garantia_servico: garantia_servico || null,
      forma_pagamento
      // data_entrada, data_criacao_os, data_atualizacao_os usarão os defaults do DB ou serão preenchidos na atualização
    }).returning('id');

    const novaOS = await db('ordens_de_servico')
      .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
      .select('ordens_de_servico.*', 'clientes.nome_completo as nome_cliente')
      .where('ordens_de_servico.id', id)
      .first();

    res.status(201).json(novaOS);
  } catch (error) {
    console.error("Erro ao criar Ordem de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao criar Ordem de Serviço.', detalhe: error.message });
  }
}

// Função para LISTAR todas as Ordens de Serviço
export async function listarOrdensServico(req, res) {
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

// Função para BUSCAR uma Ordem de Serviço pelo ID
export async function buscarOrdemServicoPorId(req, res) {
  const { id } = req.params;
  try {
    const ordemServico = await db('ordens_de_servico')
      .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
      .select(
        'ordens_de_servico.*',
        'clientes.nome_completo as nome_cliente',
        'clientes.telefone_principal as telefone_cliente',
        'clientes.email as email_cliente'
      )
      .where('ordens_de_servico.id', id)
      .first();

    if (ordemServico) {
      res.status(200).json(ordemServico);
    } else {
      res.status(404).json({ erro: 'Ordem de Serviço não encontrada.' });
    }
  } catch (error) {
    console.error("Erro ao buscar Ordem de Serviço por ID:", error);
    res.status(500).json({ erro: 'Erro ao buscar Ordem de Serviço no banco de dados.', detalhe: error.message });
  }
}

// Função para ATUALIZAR uma Ordem de Serviço existente
export async function atualizarOrdemServico(req, res) {
  const { id } = req.params;
  const dadosEntrada = req.body;

  const camposPermitidos = [
    'cliente_id', 'tipo_equipamento', 'marca_equipamento', 'modelo_equipamento',
    'numero_serie_imei', 'defeito_relatado_cliente', 'diagnostico_tecnico',
    'servico_executado', 'pecas_utilizadas', 'valor_servico_mao_de_obra',
    'valor_total_pecas', 'valor_desconto', 'status_os', 'observacoes_internas',
    'acessorios_deixados', 'senha_equipamento', 'servico_autorizado_cliente',
    'data_previsao_entrega', 'data_entrega_efetiva', 'data_orcamento',
    'data_aprovacao_orcamento', 'garantia_servico', 'forma_pagamento'
  ];

  const dadosParaAtualizar = {};
  let algumCampoValidoPresente = false;
  let statusAnterior = null;

  for (const campo of camposPermitidos) {
    if (dadosEntrada[campo] !== undefined) {
      dadosParaAtualizar[campo] = dadosEntrada[campo];
      algumCampoValidoPresente = true;
    }
  }

  if (!algumCampoValidoPresente) {
    return res.status(400).json({ erro: 'Nenhum dado válido fornecido para atualização.' });
  }

  dadosParaAtualizar.data_atualizacao_os = db.fn.now();

  try {
    await db.transaction(async (trx) => {
      const osAtual = await trx('ordens_de_servico').where({ id }).first();
      if (!osAtual) {
        const err = new Error('Ordem de Serviço não encontrada para atualização.');
        err.status = 404;
        throw err;
      }
      statusAnterior = osAtual.status_os;

      if (dadosParaAtualizar.cliente_id && dadosParaAtualizar.cliente_id !== osAtual.cliente_id) {
        const clienteExistente = await trx('clientes').where({ id: dadosParaAtualizar.cliente_id }).first();
        if (!clienteExistente) {
          const err = new Error('Novo cliente_id fornecido para atualização não foi encontrado.');
          err.status = 404;
          throw err;
        }
      }

      if (
        dadosParaAtualizar.valor_servico_mao_de_obra !== undefined ||
        dadosParaAtualizar.valor_total_pecas !== undefined ||
        dadosParaAtualizar.valor_desconto !== undefined
      ) {
        const maoDeObra = dadosParaAtualizar.valor_servico_mao_de_obra !== undefined ? Number(dadosParaAtualizar.valor_servico_mao_de_obra) : Number(osAtual.valor_servico_mao_de_obra);
        const pecas = dadosParaAtualizar.valor_total_pecas !== undefined ? Number(dadosParaAtualizar.valor_total_pecas) : Number(osAtual.valor_total_pecas);
        const desconto = dadosParaAtualizar.valor_desconto !== undefined ? Number(dadosParaAtualizar.valor_desconto) : Number(osAtual.valor_desconto);
        dadosParaAtualizar.valor_total_os = (maoDeObra + pecas) - desconto;
      } else if (osAtual.valor_total_os === null || osAtual.valor_total_os === undefined || typeof osAtual.valor_total_os !== 'number') {
         // Se não houver atualização nos valores, mas o valor total ainda não foi calculado ou é inválido, calcula-o com os valores atuais ou defaults.
        dadosParaAtualizar.valor_total_os = (Number(osAtual.valor_servico_mao_de_obra) + Number(osAtual.valor_total_pecas || 0)) - Number(osAtual.valor_desconto || 0);
      }


      await trx('ordens_de_servico')
        .where({ id })
        .update(dadosParaAtualizar);

      const statusNovo = dadosParaAtualizar.status_os || statusAnterior;
      const valorFinalOSCalculado = dadosParaAtualizar.valor_total_os !== undefined ? dadosParaAtualizar.valor_total_os : osAtual.valor_total_os;

      const statusDePagamento = ["Entregue", "Pago", "Finalizado e Pago"]; // Ajuste conforme seus status

      if (statusDePagamento.includes(statusNovo) && !statusDePagamento.includes(statusAnterior) && valorFinalOSCalculado > 0) {
        await trx('itens_de_caixa').insert({
          descricao: `Recebimento O.S. #${osAtual.numero_os} (ID OS: ${id})`,
          tipo_movimentacao: 'Entrada',
          valor: valorFinalOSCalculado,
          data_movimentacao: db.fn.now(),
          categoria: 'Receita de Serviço',
          ordem_servico_id: id,
          cliente_id: osAtual.cliente_id,
          observacoes: `Pagamento referente à O.S. ${osAtual.numero_os}`
        });
        console.log(`Lançamento no caixa para O.S. ${id} no valor de ${valorFinalOSCalculado} realizado.`);
      }

      const osAtualizada = await trx('ordens_de_servico')
        .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
        .select('ordens_de_servico.*', 'clientes.nome_completo as nome_cliente')
        .where('ordens_de_servico.id', id)
        .first();

      res.status(200).json(osAtualizada);
    });
  } catch (error) {
    console.error("Erro ao atualizar Ordem de Serviço:", error);
    if (error.status) {
      return res.status(error.status).json({ erro: error.message });
    }
    res.status(500).json({ erro: 'Erro ao atualizar Ordem de Serviço no banco de dados.', detalhe: error.message });
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
    res.status(500).json({ erro: 'Erro ao deletar Ordem de Serviço.', detalhe: error.message });
  }
}