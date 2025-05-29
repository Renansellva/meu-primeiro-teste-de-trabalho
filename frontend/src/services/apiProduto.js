// frontend/src/services/apiProduto.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const getProdutos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos`);
    return response.data;
  } catch (error) { // Bloco catch correto
    console.error("Erro ao buscar produtos:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createProduto = async (produtoData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/produtos`, produtoData);
    return response.data;
  } catch (error) { // Bloco catch correto
    console.error("Erro ao criar produto:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getProdutoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
    return response.data;
  } catch (error) { // 👇 Adicione a chave de abertura aqui
    console.error(`Erro ao buscar produto ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  } // 👆 Adicione a chave de fechamento aqui
};

// (Funções para updateProduto e deleteProduto virão depois)