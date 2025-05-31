// frontend/src/services/apiOrdemServico.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

// Função para buscar todas as Ordens de Serviço
export const getOrdensServico = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/ordens-servico`);
    // O backend já faz o join e retorna 'nome_cliente'
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar Ordens de Serviço:", error.response ? error.response.data : error.message);
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

// (Adicionaremos getOrdemServicoPorId, updateOrdemServico, deleteOrdemServico aqui depois)