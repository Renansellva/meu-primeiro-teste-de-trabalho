// frontend/src/pages/OrdensServicoPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import OrdemServicoForm from '../components/OrdensServico/OrdemServicoForm';
import OrdemServicoList from '../components/OrdensServico/OrdemServicoList';
import { getOrdensServico } from '../services/apiOrdemServico';

function OrdensServicoPage() {
  const [ordensServico, setOrdensServico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarOrdensServico = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getOrdensServico();
      setOrdensServico(data);
    } catch (err) {
      setError('Falha ao carregar Ordens de Serviço.');
      console.error(err);
      setOrdensServico([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarOrdensServico();
  }, [carregarOrdensServico]);

  const handleOrdemServicoCriada = () => {
    carregarOrdensServico(); // Recarrega a lista após criar uma nova OS
  };

  if (loading && ordensServico.length === 0) return <p>Carregando Ordens de Serviço...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="os-page" style={{ padding: '20px' }}>
      <h2>Gestão de Ordens de Serviço</h2>
      <OrdemServicoForm onOrdemServicoCriada={handleOrdemServicoCriada} />
      {loading && ordensServico.length > 0 && <p>Atualizando lista...</p>}
      <OrdemServicoList ordensServico={ordensServico} />
    </div>
  );
}

export default OrdensServicoPage;