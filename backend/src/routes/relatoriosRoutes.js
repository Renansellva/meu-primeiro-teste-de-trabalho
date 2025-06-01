// backend/src/routes/relatoriosRoutes.js
import express from 'express';
import {
  getTotalReceitaVendaProdutos,
  getValorEstoqueAtualCusto,
  getTotalGastoCompraProdutos,
  getVendasPorDia,
  getFluxoDeCaixaPeriodo // Importa a nova função
} from '../controllers/relatoriosController.js';

const router = express.Router();

router.get('/receita-venda-produtos', getTotalReceitaVendaProdutos);
router.get('/valor-estoque-custo', getValorEstoqueAtualCusto);
router.get('/gasto-compra-produtos', getTotalGastoCompraProdutos);
router.get('/vendas-por-dia', getVendasPorDia);
router.get('/fluxo-caixa', getFluxoDeCaixaPeriodo); // Nova rota para Fluxo de Caixa

export default router;