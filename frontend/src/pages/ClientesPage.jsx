// frontend/src/pages/ClientesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ClienteForm from '../components/Clientes/ClienteForm';
import ClienteList from '../components/Clientes/ClienteList';
import { getClientes } from '../services/apiCliente'; // Não precisamos mais do deleteCliente aqui diretamente

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarClientes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getClientes();
      setClientes(data);
    } catch (err) {
      setError('Falha ao carregar clientes.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  const handleClienteCriado = (novoCliente) => {
    // Adiciona o novo cliente à lista ou recarrega a lista
    // setClientes(prevClientes => [novoCliente, ...prevClientes]); // Otimista
    carregarClientes(); // Mais simples: recarrega a lista toda
  };

  // Nova função para lidar com a deleção
  const handleClienteDeletado = (idClienteDeletado) => {
    // Atualiza o estado removendo o cliente deletado
    // setClientes(prevClientes => prevClientes.filter(cliente => cliente.id !== idClienteDeletado));
    // Ou, de forma mais simples e garantida (se houver paginação no futuro, por exemplo):
    carregarClientes(); // Recarrega a lista do backend
  };

  if (loading && clientes.length === 0) return <p>Carregando clientes...</p>; // Mostra loading apenas se não houver clientes
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="clientes-page" style={{ padding: '20px' }}>
      <h2>Gestão de Clientes</h2>
      <ClienteForm onClienteCriado={handleClienteCriado} />
      {loading && <p>Atualizando lista...</p>} {/* Feedback de loading para recarregamentos */}
      <ClienteList clientes={clientes} onClienteDeletado={handleClienteDeletado} />
    </div>
  );
}

export default ClientesPage;