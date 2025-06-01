// frontend/src/services/apiRelatorios.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // URL base do seu backend

export const fetchTotalReceitaVendaProdutos = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/relatorios/receita-venda-produtos`, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar total de receita de venda de produtos:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchValorEstoqueAtualCusto = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/relatorios/valor-estoque-custo`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar valor do estoque atual a custo:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchTotalGastoCompraProdutos = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/relatorios/gasto-compra-produtos`, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar total gasto na compra de produtos:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchVendasPorDia = async (params = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/relatorios/vendas-por-dia`, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vendas por dia:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const fetchFluxoDeCaixaPeriodo = async (params) => {
  if (!params.dataInicio || !params.dataFim) {
    // Considerar lançar um erro ou retornar uma promessa rejeitada se as datas forem obrigatórias
    // para a chamada da API, ou deixar a validação para o componente/backend.
    // Por ora, o backend já valida.
    // console.warn("Data de início e fim são recomendadas para o fluxo de caixa.");
  }
  try {
    const response = await axios.get(`${API_BASE_URL}/relatorios/fluxo-caixa`, { params });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar relatório de fluxo de caixa:", error.response ? error.response.data : error.message);
    throw error;
  }
};