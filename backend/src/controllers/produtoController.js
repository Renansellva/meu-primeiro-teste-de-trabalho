// backend/src/controllers/produtoController.js
import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid'; // Se você usa uuid em alguma função de produto

// Função para CRIAR um novo Produto/Peça
export async function criarProduto(req, res) {
  console.log('Corpo da requisição recebido em criarProduto:', req.body);
  const {
    nome_produto,
    codigo_interno,
    descricao,
    unidade_medida,
    quantidade_estoque = 0,
    estoque_minimo = 0,
    preco_custo_medio,
    preco_venda_padrao,
    fornecedor_principal,
    localizacao_estoque,
    data_ultima_compra
  } = req.body;

  if (!nome_produto) {
    return res.status(400).json({ erro: 'O nome do produto/peça é obrigatório.' });
  }

  try {
    const [id] = await db('produtos_pecas').insert({
      nome_produto,
      codigo_interno,
      descricao,
      unidade_medida,
      quantidade_estoque,
      estoque_minimo,
      preco_custo_medio: preco_custo_medio || null,
      preco_venda_padrao: preco_venda_padrao || null,
      fornecedor_principal,
      localizacao_estoque,
      data_ultima_compra: data_ultima_compra || null,
    }).returning('id');

    const novoProduto = await db('produtos_pecas').where({ id }).first();
    res.status(201).json(novoProduto);
  } catch (error) {
    console.error("Erro ao criar produto/peça:", error);
    if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed: produtos_pecas.nome_produto')) {
      return res.status(409).json({ erro: 'Já existe um produto/peça com este nome.' });
    }
    if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed: produtos_pecas.codigo_interno')) {
      return res.status(409).json({ erro: 'Já existe um produto/peça com este código interno.' });
    }
    res.status(500).json({ erro: 'Erro ao criar produto/peça no banco de dados.', detalhe: error.message });
  }
}

// Função para LISTAR todos os Produtos/Peças
export async function listarProdutos(req, res) {
  try {
    const produtos = await db('produtos_pecas')
      .select('*')
      .orderBy('nome_produto', 'asc');
    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos/peças:", error);
    res.status(500).json({ erro: 'Erro ao listar produtos/peças do banco de dados.', detalhe: error.message });
  }
}

// Função para BUSCAR um Produto/Peça pelo ID <<<<<<< VERIFIQUE ESTA FUNÇÃO
export async function buscarProdutoPorId(req, res) {
  const { id } = req.params;
  try {
    const produto = await db('produtos_pecas').where({ id }).first();
    if (produto) {
      res.status(200).json(produto);
    } else {
      res.status(404).json({ erro: 'Produto/Peça não encontrado(a).' });
    }
  } catch (error) {
    console.error("Erro ao buscar produto/peça:", error);
    res.status(500).json({ erro: 'Erro ao buscar produto/peça no banco de dados.', detalhe: error.message });
  }
}

// Função para PESQUISAR Produtos/Peças por nome
export async function pesquisarProdutos(req, res) {
  const { nome } = req.query;
  if (!nome) {
    return res.status(400).json({ erro: 'O parâmetro de busca "nome" é obrigatório.' });
  }
  try {
    const produtosEncontrados = await db('produtos_pecas')
      .where('nome_produto', 'like', `%${nome}%`)
      .select('*')
      .orderBy('nome_produto', 'asc');
    if (produtosEncontrados.length > 0) {
      res.status(200).json(produtosEncontrados);
    } else {
      res.status(404).json({ mensagem: 'Nenhum produto/peça encontrado com este nome.', resultado: [] });
    }
  } catch (error) {
    console.error("Erro ao pesquisar produtos/peças:", error);
    res.status(500).json({ erro: 'Erro ao pesquisar produtos/peças no banco de dados.', detalhe: error.message });
  }
}

// Função para REGISTRAR A VENDA de um Produto/Peça e diminuir o estoque
export async function registrarVendaProduto(req, res) {
  const { id } = req.params;
  const { quantidadeVendida } = req.body;

  if (quantidadeVendida === undefined || typeof quantidadeVendida !== 'number' || quantidadeVendida <= 0) {
    return res.status(400).json({ erro: 'A quantidade vendida deve ser um número positivo.' });
  }

  try {
    await db.transaction(async (trx) => {
      const produto = await trx('produtos_pecas').where({ id }).first();
      if (!produto) {
        const err = new Error('Produto não encontrado.');
        err.status = 404;
        throw err;
      }
      if (produto.quantidade_estoque < quantidadeVendida) {
        const err = new Error('Estoque insuficiente para realizar a venda.');
        err.status = 400;
        throw err;
      }
      const novoEstoque = produto.quantidade_estoque - quantidadeVendida;
      await trx('produtos_pecas')
        .where({ id })
        .update({
          quantidade_estoque: novoEstoque,
          data_atualizacao: db.fn.now()
        });
      const produtoAtualizado = await trx('produtos_pecas').where({ id }).first();
      res.status(200).json({ mensagem: 'Venda registrada e estoque atualizado com sucesso!', produto: produtoAtualizado });
    });
  } catch (error) {
    console.error("Erro ao registrar venda do produto:", error);
    if (error.status) {
      return res.status(error.status).json({ erro: error.message });
    }
    res.status(500).json({ erro: 'Erro ao registrar venda do produto.', detalhe: error.message });
  }
}

// (Funções para ATUALIZAR e DELETAR produtos virão aqui)