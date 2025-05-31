// backend/src/app.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Importação das rotas dos diferentes módulos
import clienteRoutes from './routes/clienteRoutes.js';
import ordemServicoRoutes from './routes/ordemServicoRoutes.js';
import produtoRoutes from './routes/produtoRoutes.js';
import caixaRoutes from './routes/caixaRoutes.js';
import relatoriosRoutes from './routes/relatoriosRoutes.js';

// Carrega variáveis de ambiente do arquivo .env
// Certifique-se que o arquivo .env está na raiz da pasta 'backend/'
// Se o seu server.js está em src/ e app.js também, e .env está em backend/, o path está correto.
dotenv.config({ path: '../.env' });

const app = express();

// Middlewares Globais
app.use(cors()); // Habilita o Cross-Origin Resource Sharing para permitir requisições do seu frontend
app.use(express.json()); // Habilita o parsing de JSON no corpo das requisições

// Rota de teste inicial para verificar se o servidor está no ar
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo à API da Minha Loja! O servidor está funcionando corretamente.' });
});

// Montagem das Rotas da API
// Todas as rotas de clientes serão prefixadas com /api/clientes
app.use('/api/clientes', clienteRoutes);

// Todas as rotas de ordens de serviço serão prefixadas com /api/ordens-servico
app.use('/api/ordens-servico', ordemServicoRoutes);

// Todas as rotas de produtos serão prefixadas com /api/produtos
app.use('/api/produtos', produtoRoutes);

// Todas as rotas de caixa serão prefixadas com /api/caixa
app.use('/api/caixa', caixaRoutes);

// Todas as rotas de relatórios serão prefixadas com /api/relatorios
app.use('/api/relatorios', relatoriosRoutes);

// Middleware para tratar rotas não encontradas (404)
// Este deve vir depois de todas as suas definições de rotas
app.use((req, res, next) => {
  res.status(404).json({ erro: 'Ops! A rota que você tentou acessar não foi encontrada.' });
});

// Middleware global para tratamento de erros
// Este deve ser o último middleware adicionado
app.use((err, req, res, next) => {
  console.error("Ocorreu um erro no servidor:", err.stack || err.message || err);
  // Evita vazar detalhes do erro em ambiente de produção
  const statusCode = err.status || 500;
  const errorMessage = process.env.NODE_ENV === 'production' ? 
    'Ocorreu um erro interno no servidor. Tente novamente mais tarde.' : 
    err.message || 'Erro interno do servidor.';
  
  res.status(statusCode).json({ 
    erro: errorMessage,
    ...(process.env.NODE_ENV !== 'production' && { detalhe: err.stack }) // Mostra stacktrace apenas em desenvolvimento
  });
});

export default app;