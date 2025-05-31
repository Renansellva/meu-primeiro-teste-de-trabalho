// backend/src/controllers/caixaController.js
import db from '../config/database.js';

// Função para REGISTRAR uma nova Movimentação de Caixa
export async function registrarMovimentacao(req, res) {
  const {
    descricao,
    tipo_movimentacao, // Deve ser 'Entrada' ou 'Saída'
    valor,
    data_movimentacao, // Formato YYYY-MM-DD HH:MM:SS ou apenas YYYY-MM-DD
    ordem_servico_id,
    cliente_id,
    categoria,
    observacoes
  } = req.body;

  // Validação básica
  if (!descricao || !tipo_movimentacao || valor === undefined || !data_movimentacao) {
    return res.status(400).json({ erro: 'Descrição, tipo, valor e data da movimentação são obrigatórios.' });
  }
  if (tipo_movimentacao !== 'Entrada' && tipo_movimentacao !== 'Saída') {
    return res.status(400).json({ erro: 'Tipo de movimentação deve ser "Entrada" ou "Saída".' });
  }
  if (typeof valor !== 'number' || valor <= 0) {
    return res.status(400).json({ erro: 'O valor da movimentação deve ser um número positivo.' });
  }

  try {
    const [id] = await db('itens_de_caixa').insert({
      descricao,
      tipo_movimentacao,
      valor,
      data_movimentacao,
      ordem_servico_id: ordem_servico_id || null,
      cliente_id: cliente_id || null,
      categoria,
      observacoes,
      // data_registro será preenchida automaticamente
    }).returning('id');

    const novaMovimentacao = await db('itens_de_caixa').where({ id }).first();
    res.status(201).json(novaMovimentacao);
  } catch (error) {
    console.error("Erro ao registrar movimentação de caixa:", error);
    res.status(500).json({ erro: 'Erro ao registrar movimentação no banco de dados.', detalhe: error.message });
  }
}

// Função para LISTAR todas as Movimentações de Caixa
export async function listarMovimentacoes(req, res) {
  const { tipo, mes, ano, dia, categoria, cliente_id, ordem_servico_id } = req.query; // Filtros opcionais

  try {
    let query = db('itens_de_caixa')
      .select('itens_de_caixa.*', 'clientes.nome_completo as nome_cliente', 'ordens_de_servico.numero_os')
      .leftJoin('clientes', 'itens_de_caixa.cliente_id', 'clientes.id')
      .leftJoin('ordens_de_servico', 'itens_de_caixa.ordem_servico_id', 'ordens_de_servico.id')
      .orderBy('data_movimentacao', 'desc')
      .orderBy('id', 'desc'); // Para desempate na ordenação

    if (tipo) {
      query = query.where('itens_de_caixa.tipo_movimentacao', tipo);
    }
    if (categoria) {
      query = query.where('itens_de_caixa.categoria', 'like', `%${categoria}%`);
    }
    if (cliente_id) {
        query = query.where('itens_de_caixa.cliente_id', cliente_id);
    }
    if (ordem_servico_id) {
        query = query.where('itens_de_caixa.ordem_servico_id', ordem_servico_id);
    }

    // Filtro por data (mês/ano ou dia específico)
    // Exemplo: /api/caixa?ano=2025&mes=05 ou /api/caixa?data=2025-05-30
    if (req.query.data) { // Filtro por data específica YYYY-MM-DD
        query = query.whereRaw('date(itens_de_caixa.data_movimentacao) = ?', [req.query.data]);
    } else if (ano && mes) { // Filtro por ano e mês
        query = query.whereRaw('strftime("%Y-%m", itens_de_caixa.data_movimentacao) = ?', [`${ano}-${mes.padStart(2, '0')}`]);
    } else if (ano) { // Filtro apenas por ano
        query = query.whereRaw('strftime("%Y", itens_de_caixa.data_movimentacao) = ?', [ano]);
    }


    const movimentacoes = await query;
    res.status(200).json(movimentacoes);
  } catch (error) {
    console.error("Erro ao listar movimentações de caixa:", error);
    res.status(500).json({ erro: 'Erro ao listar movimentações do banco de dados.', detalhe: error.message });
  }
}