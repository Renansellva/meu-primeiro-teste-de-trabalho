// backend/src/routes/ordemServicoRoutes.js
import express from 'express';
import {
  criarOrdemServico,
  listarOrdensServico,
  buscarOrdemServicoPorId,
  atualizarOrdemServico, // 👈 Nova importação
  deletarOrdemServico    // 👈 Nova importação (já vamos adicionar para a próxima etapa)
} from '../controllers/ordemServicoController.js';

const router = express.Router();

// Rota para listar todas as ordens de serviço
router.get('/', listarOrdensServico);

// Rota para criar uma nova ordem de serviço
router.post('/', criarOrdemServico);

// Rota para buscar uma ordem de serviço específica pelo ID
router.get('/:id', buscarOrdemServicoPorId);

// Rota para ATUALIZAR uma ordem de serviço específica pelo ID (PUT /api/ordens-servico/:id)
router.put('/:id', atualizarOrdemServico); // 👈 Nova rota

// Rota para DELETAR uma ordem de serviço específica pelo ID (DELETE /api/ordens-servico/:id)
router.delete('/:id', deletarOrdemServico); // 👈 Nova rota (para a próxima etapa)

export default router;