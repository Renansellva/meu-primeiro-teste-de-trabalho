// frontend/src/services/apiProduto.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// ... (funções getProdutos, createProduto, getProdutoPorId, pesquisarProdutosPorNome já existentes) ...
export const getProdutos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createProduto = async (produtoData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/produtos`, produtoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar produto:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getProdutoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const pesquisarProdutosPorNome = async (nome) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos/pesquisar`, {
      params: { nome }
    });
    return response.data;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return [];
    }
    console.error(`Erro ao pesquisar produtos por nome "${nome}":`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- NOVA FUNÇÃO ABAIXO ---
export const registrarVendaProduto = async (id, quantidadeVendida) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/produtos/${id}/registrar-venda`, {
      quantidadeVendida // O corpo da requisição será: { "quantidadeVendida": valor }
    });
    return response.data; // Espera-se { mensagem: '...', produto: produtoAtualizado }
  } catch (error) {
    console.error(`Erro ao registrar venda do produto ${id}:`, error.response ? error.response.data : error.message);
    throw error; // Re-lança o erro para ser tratado pelo componente
  }
};

// (Funções para updateProduto e deleteProduto de forma geral virão depois)