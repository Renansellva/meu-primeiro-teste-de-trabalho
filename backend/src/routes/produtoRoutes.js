// backend/src/routes/produtoRoutes.js
import express from 'express';
import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId // 👈 Nova importação
} from '../controllers/produtoController.js';

const router = express.Router();

// Rota para listar todos os produtos/peças
router.get('/', listarProdutos);

// Rota para criar um novo produto/peça
router.post('/', criarProduto);

// Rota para buscar um produto/peça específico pelo ID (GET /api/produtos/:id)
router.get('/:id', buscarProdutoPorId); // 👈 Nova rota

// (Adicionaremos mais rotas aqui depois: atualizar, deletar)

export default router;