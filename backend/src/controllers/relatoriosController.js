// backend/src/controllers/relatoriosController.js
import db from '../config/database.js';

// Relatório: Total de Receita com Venda de Produtos
export async function getTotalReceitaVendaProdutos(req, res) {
  const { dataInicio, dataFim } = req.query;
  try {
    let query = db('itens_de_caixa')
      .where({
        tipo_movimentacao: 'Entrada',
        // Ajuste esta categoria se você usa um nome diferente para registrar vendas de produtos no caixa
        categoria: 'Venda de Produto' 
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

// Relatório: Valor do Estoque Atual a Preço de Custo (CORRIGIDO)
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
        categoria: 'Compra de Produto' // Ou 'Compra de Estoque', 'Despesa com Peças', etc.
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

// Relatório: Listagem de Vendas por Dia (detalhes das vendas)
export async function getVendasPorDia(req, res) {
  const { dataInicio, dataFim } = req.query;
  try {
    let query = db('itens_de_caixa')
      .select(
        // Para SQLite, date() funciona bem. Para outros bancos, pode ser diferente.
        db.raw('date(data_movimentacao) as dia_venda'), 
        'descricao',
        'valor',
        'id as id_movimentacao_caixa' // ID da movimentação do caixa
      )
      .where({
        tipo_movimentacao: 'Entrada',
        // Ajuste esta categoria se necessário
        categoria: 'Venda de Produto' 
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