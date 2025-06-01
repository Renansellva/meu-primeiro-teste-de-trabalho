// backend/src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importação das rotas dos diferentes módulos
import clienteRoutes from './routes/clienteRoutes.js';
import ordemServicoRoutes from './routes/ordemServicoRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import caixaRoutes from './routes/caixaRoutes.js';
import relatoriosRoutes from './routes/relatoriosRoutes.js'; // Deve estar aqui

dotenv.config({ path: '../.env' }); // Ajuste o path se seu .env estiver em outro lugar

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Rota de teste inicial
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API da Minha Loja! O servidor está funcionando corretamente.' });
});

// Montagem das Rotas da API
app.use('/api/clientes', clienteRoutes);
app.use('/api/ordens-servico', ordemServicoRoutes);
app.use('/api/produtos', produtoRoutes);
app.use('/api/caixa', caixaRoutes);
app.use('/api/relatorios', relatoriosRoutes); // Garanta que esta linha existe

// Middleware para tratar rotas não encontradas (404)
app.use((req, res, next) => {
  res.status(404).json({ erro: 'Ops! A rota que você tentou acessar não foi encontrada.' });
});

// Middleware global para tratamento de erros
app.use((err, req, res, next) => {
  console.error("Ocorreu um erro no servidor:", err.stack || err.message || err);
  const statusCode = err.status || 500;
  const errorMessage = process.env.NODE_ENV === 'production' ? 
    'Ocorreu um erro interno no servidor. Tente novamente mais tarde.' : 
    err.message || 'Erro interno do servidor.';
  
  res.status(statusCode).json({ 
    erro: errorMessage,
    ...(process.env.NODE_ENV !== 'production' && { detalhe: err.stack })
  });
});

export default app;