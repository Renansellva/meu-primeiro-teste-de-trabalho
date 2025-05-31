// frontend/src/pages/OrdensServicoPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import OrdemServicoForm from '../components/OrdensServico/OrdemServicoForm';
import OrdemServicoList from '../components/OrdensServico/OrdemServicoList';
import { getOrdensServico } from '../services/apiOrdemServico';
import { getClientes } from '../services/apiCliente'; // Para popular o dropdown no formulário

function OrdensServicoPage() {
  const [ordensServico, setOrdensServico] = useState([]);
  const [clientes, setClientes] = useState([]); // Estado para a lista de clientes
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarDados = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dataOS, dataClientes] = await Promise.all([
        getOrdensServico(),
        getClientes() // Carrega os clientes para o formulário
      ]);
      setOrdensServico(dataOS || []);
      setClientes(dataClientes || []);
    } catch (err) {
      setError('Falha ao carregar dados da página de Ordens de Serviço.');
      console.error(err);
      setOrdensServico([]);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDados();
  }, [carregarDados]);

  const handleOrdemServicoCriada = () => {
    carregarDados(); // Recarrega tudo (OS e Clientes, embora Clientes possa não mudar)
  };

  if (loading && ordensServico.length === 0) return <p>Carregando Ordens de Serviço...</p>;
  // Não exibe o erro principal se for apenas a lista de OS vazia e não um erro de fato
  if (error && ordensServico.length === 0) return <p style={{ color: 'red' }}>{error}</p>;


  return (
    <div className="os-page" style={{ padding: '20px' }}>
      <h2>Gestão de Ordens de Serviço</h2>
      <OrdemServicoForm 
        onOrdemServicoCriada={handleOrdemServicoCriada} 
        clientes={clientes} // Passa a lista de clientes para o formulário
      />
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Exibe erro se houver, mesmo com OS na tela */}
      {loading && ordensServico.length > 0 && <p>Atualizando lista de Ordens de Serviço...</p>}
      <OrdemServicoList ordensServico={ordensServico} />
    </div>
  );
}

export default OrdensServicoPage;