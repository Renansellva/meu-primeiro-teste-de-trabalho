// backend/src/routes/produtoRoutes.js
import express from 'express';
import { criarProduto, listarProdutos } from '../controllers/produtoController.js'; // Criaremos este controller

const router = express.Router();

// Rota para listar todos os produtos/peças (GET /api/produtos)
router.get('/', listarProdutos);

// Rota para criar um novo produto/peça (POST /api/produtos)
router.post('/', criarProduto);

// (Adicionaremos mais rotas aqui depois: buscar por ID, atualizar, deletar)

export default router;