// frontend/src/services/apiOrdemServico.js
import axios from 'axios';

// Certifique-se de que esta URL base está correta para o seu backend
const API_BASE_URL = 'http://localhost:3001/api';

// Função para buscar todas as Ordens de Serviço
export const getOrdensServico = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ordens-servico`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Ordens de Serviço:", error.response ? error.response.data : error.message);
    throw error; // Re-lança o erro para ser tratado pelo componente que chamou
  }
};

// Função para buscar uma Ordem de Serviço específica pelo ID
export const getOrdemServicoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ordens-servico/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar Ordem de Serviço ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para criar uma nova Ordem de Serviço
export const createOrdemServico = async (osData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ordens-servico`, osData);
    return response.data; // Retorna a OS criada
  } catch (error) {
    console.error("Erro ao criar Ordem de Serviço:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para ATUALIZAR uma Ordem de Serviço existente pelo ID
export const updateOrdemServico = async (id, osData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/ordens-servico/${id}`, osData);
    return response.data; // Retorna a OS atualizada
  } catch (error) {
    console.error(`Erro ao atualizar Ordem de Serviço ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para DELETAR uma Ordem de Serviço pelo ID
export const deleteOrdemServico = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/ordens-servico/${id}`);
    return response.data; // Geralmente retorna uma mensagem de sucesso
  } catch (error) {
    console.error(`Erro ao deletar Ordem de Serviço ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};