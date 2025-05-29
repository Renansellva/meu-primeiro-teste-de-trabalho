// frontend/src/services/apiProduto.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Função para buscar todos os produtos
export const getProdutos = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar produtos:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para criar um novo produto
export const createProduto = async (produtoData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/produtos`, produtoData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar produto:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para buscar um produto pelo ID
export const getProdutoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/produtos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar produto ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para pesquisar produtos por nome
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

// Função para registrar a venda de um produto
export const registrarVendaProduto = async (id, quantidadeVendida) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/produtos/${id}/registrar-venda`, {
      quantidadeVendida
    });
    return response.data;
  } catch (error) {
    console.error(`Erro ao registrar venda do produto ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para ATUALIZAR um produto/peça pelo ID
export const updateProduto = async (id, produtoData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/produtos/${id}`, produtoData);
    return response.data; // Retorna o produto atualizado
  } catch (error) {
    console.error(`Erro ao atualizar produto ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para DELETAR um produto/peça pelo ID
export const deleteProduto = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/produtos/${id}`);
    return response.data; // Geralmente retorna uma mensagem de sucesso
  } catch (error) {
    console.error(`Erro ao deletar produto ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// O trecho abaixo estava duplicado e foi REMOVIDO:
// export const getProdutos = async () => {
//   try {
//     const response = await axios.get(`${API_BASE_URL}/produtos`);
//     return response.data;
//   } catch (error) {
//     console.error("Erro ao buscar produtos:", error.response ? error.response.data : error.message);
//     throw error; // Importante para que a página possa tratar o erro
//   }
// };