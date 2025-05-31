// backend/src/routes/caixaRoutes.js
import express from 'express';
import { registrarMovimentacao, listarMovimentacoes } from '../controllers/caixaController.js'; // Criaremos este controller

const router = express.Router();

// Rota para listar todas as movimentações de caixa (GET /api/caixa)
// Pode incluir filtros como /api/caixa?tipo=Entrada&mes=2025-05
router.get('/', listarMovimentacoes);

// Rota para registrar uma nova movimentação de caixa (POST /api/caixa)
router.post('/', registrarMovimentacao);

// (Rotas para atualizar ou deletar uma movimentação podem ser adicionadas depois, se necessário)

export default router;