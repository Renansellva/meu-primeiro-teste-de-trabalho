// backend/src/routes/clienteRoutes.js
import express from 'express';
import {
  criarCliente,
  listarClientes,
  buscarClientePorId, // Nova importação
  atualizarCliente,   // Nova importação
  deletarCliente      // Nova importação
} from '../controllers/clienteController.js';

const router = express.Router();

// Rota para listar todos os clientes (GET /api/clientes)
router.get('/', listarClientes);

// Rota para criar um novo cliente (POST /api/clientes)
router.post('/', criarCliente);

// Rota para buscar um cliente específico pelo ID (GET /api/clientes/:id)
router.get('/:id', buscarClientePorId);

// Rota para atualizar um cliente específico pelo ID (PUT /api/clientes/:id)
router.put('/:id', atualizarCliente);

// Rota para deletar um cliente específico pelo ID (DELETE /api/clientes/:id)
router.delete('/:id', deletarCliente);

export default router;