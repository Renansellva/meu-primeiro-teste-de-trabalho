// backend/src/controllers/produtoController.js
import db from '../config/database.js';
// Não precisamos do uuid aqui por enquanto, a menos que você queira gerar códigos de produto automaticamente.

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
      quantidade_estoque: Number(quantidade_estoque), // Garante que seja número
      estoque_minimo: Number(estoque_minimo),       // Garante que seja número
      preco_custo_medio: preco_custo_medio ? parseFloat(preco_custo_medio) : null,
      preco_venda_padrao: preco_venda_padrao ? parseFloat(preco_venda_padrao) : null,
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

// Função para BUSCAR um Produto/Peça pelo ID
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
    console.error("Erro ao buscar produto/peça por ID:", error); // Mensagem de log específica
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
      // Retorna 200 com lista vazia em vez de 404 para indicar que a busca ocorreu, mas nada foi encontrado
      res.status(200).json([]);
      // Se preferir um 404:
      // res.status(404).json({ mensagem: 'Nenhum produto/peça encontrado com este nome.', resultado: [] });
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

// Função para ATUALIZAR um Produto/Peça existente
export async function atualizarProduto(req, res) {
  const { id } = req.params;
  const dadosEntrada = req.body;

  const camposPermitidos = [
    'nome_produto', 'codigo_interno', 'descricao', 'unidade_medida',
    'quantidade_estoque', 'estoque_minimo', 'preco_custo_medio',
    'preco_venda_padrao', 'fornecedor_principal', 'localizacao_estoque',
    'data_ultima_compra'
  ];

  const dadosParaAtualizar = {};
  let algumCampoValidoPresente = false;

  for (const campo of camposPermitidos) {
    if (dadosEntrada[campo] !== undefined) {
      if (campo === 'quantidade_estoque' && (typeof dadosEntrada[campo] !== 'number' || dadosEntrada[campo] < 0)) {
        return res.status(400).json({ erro: 'Quantidade em estoque deve ser um número não negativo.' });
      }
      if ((campo === 'preco_custo_medio' || campo === 'preco_venda_padrao') && dadosEntrada[campo] !== null && (typeof dadosEntrada[campo] !== 'number' || dadosEntrada[campo] < 0)) {
        return res.status(400).json({ erro: `O campo ${campo} deve ser um número não negativo ou nulo.` });
      }
      dadosParaAtualizar[campo] = dadosEntrada[campo];
      algumCampoValidoPresente = true;
    }
  }

  if (!algumCampoValidoPresente) {
    return res.status(400).json({ erro: 'Nenhum dado válido fornecido para atualização.' });
  }

  dadosParaAtualizar.data_atualizacao = db.fn.now();

  try {
    const atualizado = await db('produtos_pecas')
      .where({ id })
      .update(dadosParaAtualizar);

    if (atualizado) {
      const produtoAtualizado = await db('produtos_pecas').where({ id }).first();
      res.status(200).json(produtoAtualizado);
    } else {
      res.status(404).json({ erro: 'Produto/Peça não encontrado(a) para atualização.' });
    }
  } catch (error) {
    console.error("Erro ao atualizar produto/peça:", error);
    if (error.code === 'SQLITE_CONSTRAINT') {
      if (error.message.includes('UNIQUE constraint failed: produtos_pecas.nome_produto')) {
        return res.status(409).json({ erro: 'Já existe um produto/peça com este nome.' });
      }
      if (error.message.includes('UNIQUE constraint failed: produtos_pecas.codigo_interno')) {
        return res.status(409).json({ erro: 'Já existe um produto/peça com este código interno.' });
      }
    }
    res.status(500).json({ erro: 'Erro ao atualizar produto/peça no banco de dados.', detalhe: error.message });
  }
}

// Função para DELETAR um Produto/Peça
export async function deletarProduto(req, res) {
  const { id } = req.params;
  try {
    const deletado = await db('produtos_pecas').where({ id }).del();
    if (deletado) {
      res.status(200).json({ mensagem: 'Produto/Peça deletado(a) com sucesso.' });
    } else {
      res.status(404).json({ erro: 'Produto/Peça não encontrado(a) para deleção.' });
    }
  } catch (error) {
    console.error("Erro ao deletar produto/peça:", error);
     if (error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY' || (error.message && error.message.toLowerCase().includes('foreign key constraint failed'))) {
        return res.status(409).json({ erro: 'Este produto/peça não pode ser deletado pois está associado a outros registros.', detalhe: error.message });
    }
    res.status(500).json({ erro: 'Erro ao deletar produto/peça no banco de dados.', detalhe: error.message });
  }
}