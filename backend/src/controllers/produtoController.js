// backend/src/controllers/produtoController.js
import db from '../config/database.js';

// Função para CRIAR um novo Produto/Peça
export async function criarProduto(req, res) {
  const {
    nome_produto,
    codigo_interno,
    descricao,
    unidade_medida,
    quantidade_estoque = 0, // Default se não fornecido
    estoque_minimo = 0,     // Default se não fornecido
    preco_custo_medio,
    preco_venda_padrao,
    fornecedor_principal,
    localizacao_estoque,
    data_ultima_compra
  } = req.body;

  // Validação básica
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
      // data_cadastro e data_atualizacao usarão os defaults do DB
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
      .orderBy('nome_produto', 'asc'); // Ordena por nome

    res.status(200).json(produtos);
  } catch (error) {
    console.error("Erro ao listar produtos/peças:", error);
    res.status(500).json({ erro: 'Erro ao listar produtos/peças do banco de dados.', detalhe: error.message });
  }
}

// (Adicionaremos as funções para buscar por ID, atualizar, deletar aqui depois)




// backend/src/controllers/produtoController.js
//import db from '../config/database.js';

// ... (funções criarProduto e listarProdutos já existem aqui - mantenha-as) ...

// --- NOVA FUNÇÃO ABAIXO ---

// Função para BUSCAR um Produto/Peça pelo ID
export async function buscarProdutoPorId(req, res) {
  const { id } = req.params; // Pega o ID dos parâmetros da rota

  try {
    const produto = await db('produtos_pecas').where({ id }).first(); // .first() para pegar apenas um resultado

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

// (Adicionaremos as funções para atualizar e deletar aqui depois)