// frontend/src/pages/OrdensServicoPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import OrdemServicoForm from '../components/OrdensServico/OrdemServicoForm';
import OrdemServicoList from '../components/OrdensServico/OrdemServicoList';
import { getOrdensServico } from '../services/apiOrdemServico';
import { getClientes } from '../services/apiCliente';

function OrdensServicoPage() {
  const [ordensServico, setOrdensServico] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [osParaEditar, setOsParaEditar] = useState(null); // O.S. selecionada para edição
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarDadosDaPagina = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Promise.all para buscar OS e Clientes em paralelo
      const [dataOS, dataClientes] = await Promise.all([
        getOrdensServico(),
        getClientes()
      ]);
      setOrdensServico(dataOS || []);
      setClientes(dataClientes || []);
    } catch (err) {
      setError('Falha ao carregar dados para a página de Ordens de Serviço.');
      console.error(err);
      setOrdensServico([]);
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosDaPagina();
  }, [carregarDadosDaPagina]);

  const handleOsSalva = () => {
    setOsParaEditar(null); // Limpa o formulário (volta para modo de criação)
    carregarDadosDaPagina(); // Recarrega a lista de OS
  };

  const handleIniciarEdicao = (os) => {
    setOsParaEditar(os);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o topo (onde o formulário está)
  };

  const handleEdicaoCancelada = () => {
    setOsParaEditar(null); // Limpa o formulário
  };

  if (loading && ordensServico.length === 0) return <p>Carregando Ordens de Serviço...</p>;
  // Não exibe o erro principal se for apenas a lista de OS vazia e não um erro de fato
  if (error && ordensServico.length === 0 && clientes.length === 0) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="os-page" style={{ padding: '20px' }}>
      <h2>Gestão de Ordens de Serviço</h2>
      <OrdemServicoForm
        onOsSalva={handleOsSalva}
        osParaEditar={osParaEditar}
        onEdicaoCancelada={handleEdicaoCancelada}
        clientes={clientes} // Passa a lista de clientes para o formulário
      />
      
      {/* Exibe erro se houver, mesmo com OS ou Clientes na tela */}
      {error && <p style={{ color: '#ff8a8a', background: '#4b2323', padding: '10px', borderRadius: '7px', textAlign: 'center', margin: '15px 0' }}>{error}</p>}

      {loading && ordensServico.length > 0 && <p>Atualizando lista de Ordens de Serviço...</p>}
      <OrdemServicoList
        ordensServico={ordensServico}
        onOsDeletada={handleOsSalva} // Recarregar a lista também após deletar
        onEditarOs={handleIniciarEdicao}
      />
    </div>
  );
}

export default OrdensServicoPage;