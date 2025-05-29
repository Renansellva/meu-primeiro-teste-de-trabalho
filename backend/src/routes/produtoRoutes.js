// backend/src/routes/produtoRoutes.js
import express from 'express';
import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  pesquisarProdutos,
  registrarVendaProduto // 👈 Nova importação
  // (Manter as futuras importações de atualizar e deletar aqui)
} from '../controllers/produtoController.js';

const router = express.Router();

// Rota para listar todos os produtos/peças
router.get('/', listarProdutos);

// Rota para pesquisar produtos por nome
router.get('/pesquisar', pesquisarProdutos);

// Rota para criar um novo produto/peça
router.post('/', criarProduto);

// Rota para buscar um produto/peça específico pelo ID
router.get('/:id', buscarProdutoPorId);

// Rota para registrar a venda de um produto e diminuir o estoque (POST /api/produtos/:id/registrar-venda)
router.post('/:id/registrar-venda', registrarVendaProduto); // 👈 Nova rota

// (Adicionaremos mais rotas aqui depois: atualizar, deletar)

export default router;