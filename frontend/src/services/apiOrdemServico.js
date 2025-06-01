// frontend/src/services/apiOrdemServico.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const getOrdensServico = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ordens-servico`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Ordens de Serviço:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const getOrdemServicoPorId = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ordens-servico/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar Ordem de Serviço ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createOrdemServico = async (osData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/ordens-servico`, osData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar Ordem de Serviço:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateOrdemServico = async (id, osData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/ordens-servico/${id}`, osData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar Ordem de Serviço ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteOrdemServico = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/ordens-servico/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar Ordem de Serviço ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};