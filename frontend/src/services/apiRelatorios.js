// frontend/src/services/apiRelatorios.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // URL base do seu backend

// Função para buscar o total de receita com venda de produtos
export const fetchTotalReceitaVendaProdutos = async (params = {}) => {
  try {
    // params pode conter { dataInicio: 'YYYY-MM-DD', dataFim: 'YYYY-MM-DD' }
    const response = await axios.get(`${API_BASE_URL}/relatorios/receita-venda-produtos`, { params });
    return response.data; // Espera-se { totalReceitaVendaProdutos: "123.45" }
  } catch (error) {
    console.error("Erro ao buscar total de receita de venda de produtos:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para buscar o valor do estoque atual a preço de custo
export const fetchValorEstoqueAtualCusto = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/relatorios/valor-estoque-custo`);
    return response.data; // Espera-se { valorEstoqueAtualCusto: "123.45" }
  } catch (error) {
    console.error("Erro ao buscar valor do estoque atual a custo:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para buscar o total gasto na compra de produtos
export const fetchTotalGastoCompraProdutos = async (params = {}) => {
  try {
    // params pode conter { dataInicio: 'YYYY-MM-DD', dataFim: 'YYYY-MM-DD' }
    const response = await axios.get(`${API_BASE_URL}/relatorios/gasto-compra-produtos`, { params });
    return response.data; // Espera-se { totalGastoCompraProdutos: "123.45" }
  } catch (error) {
    console.error("Erro ao buscar total gasto na compra de produtos:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para buscar vendas por dia
export const fetchVendasPorDia = async (params = {}) => {
  try {
    // params pode conter { dataInicio: 'YYYY-MM-DD', dataFim: 'YYYY-MM-DD' }
    const response = await axios.get(`${API_BASE_URL}/relatorios/vendas-por-dia`, { params });
    return response.data; // Espera-se um array de objetos de vendas
  } catch (error) {
    console.error("Erro ao buscar vendas por dia:", error.response ? error.response.data : error.message);
    throw error;
  }
};