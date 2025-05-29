// backend/src/routes/ordemServicoRoutes.js
import express from 'express';
import {
  criarOrdemServico,
  listarOrdensServico,
  buscarOrdemServicoPorId // 👈 Nova importação
} from '../controllers/ordemServicoController.js';

const router = express.Router();

// Rota para listar todas as ordens de serviço
router.get('/', listarOrdensServico);

// Rota para criar uma nova ordem de serviço
router.post('/', criarOrdemServico);

// Rota para buscar uma ordem de serviço específica pelo ID (GET /api/ordens-servico/:id)
router.get('/:id', buscarOrdemServicoPorId); // 👈 Nova rota

// (Adicionaremos mais rotas para O.S. aqui depois: atualizar, deletar)

export default router;
