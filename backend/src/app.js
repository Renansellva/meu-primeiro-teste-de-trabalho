// backend/src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import clienteRoutes from './routes/clienteRoutes.js';
import ordemServicoRoutes from './routes/ordemServicoRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js'; // 👈 Adicione esta linha

dotenv.config({ path: '../.env' });

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API da Minha Loja!' });
});

app.use('/api/clientes', clienteRoutes);
app.use('/api/ordens-servico', ordemServicoRoutes);
app.use('/api/produtos', produtoRoutes); // 👈 Adicione esta linha

export default app;