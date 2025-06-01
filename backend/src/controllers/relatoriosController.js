// backend/src/controllers/relatoriosController.js
import db from '../config/database.js';

// Relatório: Total de Receita com Venda de Produtos
export async function getTotalReceitaVendaProdutos(req, res) {
  const { dataInicio, dataFim } = req.query;
  try {
    let query = db('itens_de_caixa')
      .where({
        tipo_movimentacao: 'Entrada',
        categoria: 'Venda de Produto' // Ajuste se sua categoria for diferente
      })
      .sum('valor as totalReceita');

    if (dataInicio && dataFim) {
      query = query.whereBetween('data_movimentacao', [`${dataInicio} 00:00:00`, `${dataFim} 23:59:59`]);
    } else if (dataInicio) {
      query = query.where('data_movimentacao', '>=', `${dataInicio} 00:00:00`);
    } else if (dataFim) {
      query = query.where('data_movimentacao', '<=', `${dataFim} 23:59:59`);
    }

    const resultado = await query.first();
    res.status(200).json({ totalReceitaVendaProdutos: parseFloat(resultado.totalReceita || 0).toFixed(2) });
  } catch (error) {
    console.error("Erro ao calcular total de receita de venda de produtos:", error);
    res.status(500).json({ erro: 'Erro ao calcular total de receita de venda de produtos.', detalhe: error.message });
  }
}

// Relatório: Valor do Estoque Atual a Preço de Custo
export async function getValorEstoqueAtualCusto(req, res) {
  try {
    const resultado = await db('produtos_pecas')
      .sum({ totalValorCusto: db.raw('COALESCE(quantidade_estoque, 0) * COALESCE(preco_custo_medio, 0)') })
      .first();
    
    res.status(200).json({ valorEstoqueAtualCusto: parseFloat(resultado.totalValorCusto || 0).toFixed(2) });
  } catch (error) {
    console.error("Erro ao calcular valor do estoque atual a custo:", error);
    res.status(500).json({ erro: 'Erro ao calcular valor do estoque atual a custo.', detalhe: error.message });
  }
}

// Relatório: Total Gasto na Compra de Produtos (baseado no caixa)
export async function getTotalGastoCompraProdutos(req, res) {
  const { dataInicio, dataFim } = req.query;
  try {
    let query = db('itens_de_caixa')
      .where({
        tipo_movimentacao: 'Saída',
        // Ajuste esta categoria para a que você usa para registrar compras de produtos/estoque
        categoria: 'Compra de Produto' 
      })
      .sum('valor as totalGasto');

    if (dataInicio && dataFim) {
      query = query.whereBetween('data_movimentacao', [`${dataInicio} 00:00:00`, `${dataFim} 23:59:59`]);
    } else if (dataInicio) {
      query = query.where('data_movimentacao', '>=', `${dataInicio} 00:00:00`);
    } else if (dataFim) {
      query = query.where('data_movimentacao', '<=', `${dataFim} 23:59:59`);
    }

    const resultado = await query.first();
    res.status(200).json({ totalGastoCompraProdutos: parseFloat(resultado.totalGasto || 0).toFixed(2) });
  } catch (error) {
    console.error("Erro ao calcular total gasto na compra de produtos:", error);
    res.status(500).json({ erro: 'Erro ao calcular total gasto na compra de produtos.', detalhe: error.message });
  }
}

// Relatório: Listagem de Vendas de Produtos por Dia (detalhes das vendas do caixa)
export async function getVendasPorDia(req, res) {
  const { dataInicio, dataFim } = req.query;
  try {
    let query = db('itens_de_caixa')
      .select(
        db.raw('date(data_movimentacao) as dia_venda'), 
        'descricao',
        'valor',
        'id as id_movimentacao_caixa'
      )
      .where({
        tipo_movimentacao: 'Entrada',
        categoria: 'Venda de Produto' // Ajuste se sua categoria for diferente
      })
      .orderBy('data_movimentacao', 'desc');

    if (dataInicio && dataFim) {
      query = query.whereBetween('data_movimentacao', [`${dataInicio} 00:00:00`, `${dataFim} 23:59:59`]);
    } else if (dataInicio) {
      query = query.where('data_movimentacao', '>=', `${dataInicio} 00:00:00`);
    } else if (dataFim) {
      query = query.where('data_movimentacao', '<=', `${dataFim} 23:59:59`);
    }

    const vendas = await query;
    res.status(200).json(vendas);
  } catch (error) {
    console.error("Erro ao buscar vendas por dia:", error);
    res.status(500).json({ erro: 'Erro ao buscar vendas por dia.', detalhe: error.message });
  }
}

// Relatório: Fluxo de Caixa Detalhado por Período
export async function getFluxoDeCaixaPeriodo(req, res) {
  const { dataInicio, dataFim } = req.query;

  if (!dataInicio || !dataFim) {
    return res.status(400).json({ erro: 'Data de início e data de fim são obrigatórias para este relatório.' });
  }

  try {
    const inicio = `${dataInicio} 00:00:00`;
    const fim = `${dataFim} 23:59:59`;

    const movimentacoes = await db('itens_de_caixa')
      .select('itens_de_caixa.*', 'clientes.nome_completo as nome_cliente', 'ordens_de_servico.numero_os')
      .leftJoin('clientes', 'itens_de_caixa.cliente_id', 'clientes.id')
      .leftJoin('ordens_de_servico', 'itens_de_caixa.ordem_servico_id', 'ordens_de_servico.id')
      .whereBetween('data_movimentacao', [inicio, fim])
      .orderBy('data_movimentacao', 'asc')
      .orderBy('id', 'asc');

    const totais = await db('itens_de_caixa')
      .select('tipo_movimentacao')
      .sum('valor as total')
      .whereBetween('data_movimentacao', [inicio, fim])
      .groupBy('tipo_movimentacao');

    let totalEntradas = 0;
    let totalSaidas = 0;

    totais.forEach(item => {
      if (item.tipo_movimentacao === 'Entrada') {
        totalEntradas = parseFloat(item.total || 0);
      } else if (item.tipo_movimentacao === 'Saída') {
        totalSaidas = parseFloat(item.total || 0);
      }
    });

    const saldoPeriodo = totalEntradas - totalSaidas;

    res.status(200).json({
      periodo: { dataInicio, dataFim },
      totalEntradas: totalEntradas.toFixed(2),
      totalSaidas: totalSaidas.toFixed(2),
      saldoPeriodo: saldoPeriodo.toFixed(2),
      movimentacoes
    });

  } catch (error) {
    console.error("Erro ao gerar relatório de fluxo de caixa:", error);
    res.status(500).json({ erro: 'Erro ao gerar relatório de fluxo de caixa.', detalhe: error.message });
  }
}