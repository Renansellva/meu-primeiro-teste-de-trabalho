// frontend/src/pages/OrdensServicoPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import OrdemServicoForm from '../components/OrdensServico/OrdemServicoForm';
import OrdemServicoList from '../components/OrdensServico/OrdemServicoList';
import { getOrdensServico } from '../services/apiOrdemServico';
import { getClientes } from '../services/apiCliente'; // Para popular o dropdown no formulário

function OrdensServicoPage() {
  const [ordensServico, setOrdensServico] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [osParaEditar, setOsParaEditar] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função unificada para carregar dados da página (OS e Clientes)
  const carregarDadosDaPagina = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dataOS, dataClientes] = await Promise.all([
        getOrdensServico(),
        getClientes()
      ]);
      setOrdensServico(dataOS || []);
      setClientes(dataClientes || []);
    } catch (err) {
      const mensagemErro = 'Falha ao carregar dados para a página de Ordens de Serviço.';
      setError(mensagemErro);
      console.error(mensagemErro, err);
      setOrdensServico([]); // Garante que seja um array em caso de erro
      setClientes([]);     // Garante que seja um array em caso de erro
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarDadosDaPagina();
  }, [carregarDadosDaPagina]);

  // Chamada após uma OS ser criada ou atualizada com sucesso
  const handleOsSalva = () => {
    setOsParaEditar(null); // Limpa o formulário (volta para modo de criação)
    carregarDadosDaPagina(); // Recarrega a lista de OS e Clientes (clientes pode não ter mudado, mas é seguro)
  };

  // Chamada quando o botão "Editar" na lista é clicado
  const handleIniciarEdicao = (os) => {
    setOsParaEditar(os);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o formulário no topo
  };

  // Chamada quando a edição é cancelada no formulário
  const handleEdicaoCancelada = () => {
    setOsParaEditar(null); // Limpa o formulário
  };

  // Chamada após uma OS ser deletada com sucesso
  const handleOsDeletada = () => {
    setOsParaEditar(null); // Caso a OS em edição seja deletada
    carregarDadosDaPagina(); // Recarrega a lista
  };

  // Feedback de loading inicial
  if (loading && ordensServico.length === 0 && clientes.length === 0) {
    return <p style={{textAlign: 'center', marginTop: '30px'}}>Carregando dados da página de Ordens de Serviço...</p>;
  }
  
  // Feedback de erro principal se dados essenciais não carregarem
  if (error && ordensServico.length === 0 && clientes.length === 0) {
    return <p style={{ color: 'red', textAlign: 'center', marginTop: '30px' }}>{error}</p>;
  }

  return (
    <div className="os-page" style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#30e88b', marginBottom: '25px' }}>Gestão de Ordens de Serviço</h2>
      <OrdemServicoForm 
        onOsSalva={handleOsSalva}
        osParaEditar={osParaEditar}
        onEdicaoCancelada={handleEdicaoCancelada}
        clientes={clientes} // Passa a lista de clientes para o formulário
      />
      
      {/* Exibe erro se houver, mesmo com OS ou Clientes na tela, mas de forma menos intrusiva */}
      {error && <p style={{ color: '#ff8a8a', background: '#4b2323', padding: '10px', borderRadius: '7px', textAlign: 'center', margin: '15px 0' }}>{error}</p>}

      {loading && <p style={{textAlign: 'center'}}>Atualizando lista de Ordens de Serviço...</p>}
      <OrdemServicoList
        ordensServico={ordensServico}
        onOsDeletada={handleOsDeletada}
        onEditarOs={handleIniciarEdicao}
      />
    </div>
  );
}

export default OrdensServicoPage;