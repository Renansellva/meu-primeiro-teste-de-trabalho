// frontend/src/services/apiCliente.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api'; // Ou a URL do seu backend de produção

// Função para buscar todos os clientes (já existente)
export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clientes`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// Função para criar um novo cliente (já existente)
export const createCliente = async (clienteData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/clientes`, clienteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cliente:", error.response ? error.response.data : error.message);
    throw error;
  }
};

// --- NOVA FUNÇÃO ABAIXO ---
// Função para deletar um cliente pelo ID
export const deleteCliente = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/clientes/${id}`);
    return response.data; // Geralmente retorna uma mensagem de sucesso
  } catch (error) {
    console.error(`Erro ao deletar cliente ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

// (Aqui você adicionará as funções para getClientePorId, updateCliente depois)
// export const getClientePorId = async (id) => { ... };
// export const updateCliente = async (id, clienteData) => { ... };