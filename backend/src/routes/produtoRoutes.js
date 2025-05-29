// backend/src/routes/produtoRoutes.js
import express from 'express';
import {
  criarProduto,
  listarProdutos,
  buscarProdutoPorId,
  pesquisarProdutos,
  registrarVendaProduto,
  atualizarProduto,
  deletarProduto
} from '../controllers/produtoController.js';

const router = express.Router();

router.get('/', listarProdutos);
router.post('/', criarProduto);
router.get('/pesquisar', pesquisarProdutos); // Lembre-se que a query é ?nome=VALOR
router.get('/:id', buscarProdutoPorId);
router.post('/:id/registrar-venda', registrarVendaProduto);
router.put('/:id', atualizarProduto);
router.delete('/:id', deletarProduto);

export default router;