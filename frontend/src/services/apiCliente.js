// frontend/src/services/apiCliente.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3001/api';

export const getClientes = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/clientes`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar clientes:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const createCliente = async (clienteData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/clientes`, clienteData);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar cliente:", error.response ? error.response.data : error.message);
    throw error;
  }
};

export const updateCliente = async (id, clienteData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/clientes/${id}`, clienteData);
    return response.data;
  } catch (error) {
    console.error(`Erro ao atualizar cliente ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};

export const deleteCliente = async (id) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao deletar cliente ${id}:`, error.response ? error.response.data : error.message);
    throw error;
  }
};