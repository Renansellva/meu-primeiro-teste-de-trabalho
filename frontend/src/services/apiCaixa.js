// frontend/src/services/apiCaixa.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // URL base do seu backend

// Função para buscar todas as movimentações de caixa (com filtros opcionais)
export const getMovimentacoesCaixa = async (params = {}) => {
  // params pode conter { tipo, mes, ano, dia, categoria, cliente_id, ordem_servico_id }
  try {
    const response = await axios.get(`${API_BASE_URL}/caixa`, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar movimentações de caixa:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para registrar uma nova movimentação de caixa
export const createMovimentacaoCaixa = async (movimentacaoData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/caixa`, movimentacaoData);
    return response.data; // Retorna a movimentação criada
  } catch (error) {
    console.error("Erro ao registrar movimentação de caixa:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// (Funções para atualizar ou deletar movimentações de caixa podem ser adicionadas aqui no futuro, se necessário)