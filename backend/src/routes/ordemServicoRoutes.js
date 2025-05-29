// backend/src/routes/ordemServicoRoutes.js
import express from 'express';
import { criarOrdemServico, listarOrdensServico } from '../controllers/ordemServicoController.js'; // Criaremos este controller a seguir

const router = express.Router();

// Rota para listar todas as ordens de serviço (GET /api/ordens-servico)
router.get('/', listarOrdensServico);

// Rota para criar uma nova ordem de serviço (POST /api/ordens-servico)
router.post('/', criarOrdemServico);

// (Adicionaremos mais rotas para O.S. aqui depois: buscar por ID, atualizar, deletar)

export default router;