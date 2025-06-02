// frontend/src/pages/OrdensServicoPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import OrdemServicoForm from '../components/OrdensServico/OrdemServicoForm';
import OrdemServicoList from '../components/OrdensServico/OrdemServicoList';
import { getOrdensServico } from '../services/apiOrdemServico';
import { getClientes } from '../services/apiCliente'; // Para popular o dropdown de clientes no formulário
import { getProdutos } from '../services/apiProduto'; // Para popular a seleção de peças no formulário

function OrdensServicoPage() {
  const [ordensServico, setOrdensServico] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtosDisponiveis, setProdutosDisponiveis] = useState([]); // Para o formulário de OS
  const [osParaEditar, setOsParaEditar] = useState(null); // O.S. selecionada para edição
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função unificada para carregar todos os dados necessários para esta página
  const carregarDadosDaPagina = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Promise.all para buscar OS, Clientes e Produtos em paralelo
      const [dataOS, dataClientes, dataProdutos] = await Promise.all([
        getOrdensServico(),
        getClientes(),
        getProdutos()
      ]);

      setOrdensServico(dataOS || []);
      setClientes(dataClientes || []);
      setProdutosDisponiveis(dataProdutos || []);

      console.log('Clientes carregados na OrdensServicoPage:', dataClientes);
      console.log('Produtos carregados na OrdensServicoPage:', dataProdutos);

    } catch (err) {
      const mensagemErro = 'Falha ao carregar dados para a página de Ordens de Serviço. Verifique o console do navegador e do backend.';
      setError(mensagemErro);
      console.error(mensagemErro, err);
      // Define como arrays vazios em caso de erro para evitar quebras nos componentes filhos
      setOrdensServico([]);
      setClientes([]);
      setProdutosDisponiveis([]);
    } finally {
      setLoading(false);
    }
  }, []); // Não depende de nada para a chamada inicial, mas useCallback é bom se for passada como dep.

  useEffect(() => {
    carregarDadosDaPagina();
  }, [carregarDadosDaPagina]); // Executa ao montar e se carregarDadosDaPagina mudar (o que não deve acontecer)

  // Chamada após uma OS ser criada ou atualizada com sucesso
  const handleOsSalva = () => {
    setOsParaEditar(null); // Limpa o formulário (volta para modo de criação)
    carregarDadosDaPagina(); // Recarrega todos os dados da página
  };

  // Chamada quando o botão "Editar" na lista é clicado
  const handleIniciarEdicao = (os) => {
    setOsParaEditar(os);
    // Rola a tela para o topo onde o formulário geralmente está
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };

  // Chamada quando a edição é cancelada no formulário
  const handleEdicaoCancelada = () => {
    setOsParaEditar(null); // Limpa o formulário
    setError(''); // Limpa possíveis erros do formulário
  };

  // Chamada após uma OS ser deletada com sucesso
  const handleOsDeletada = () => {
    setOsParaEditar(null); // Caso a OS em edição seja deletada
    carregarDadosDaPagina(); // Recarrega a lista
  };

  // Feedback de loading inicial
  if (loading && ordensServico.length === 0 && clientes.length === 0 && produtosDisponiveis.length === 0) {
    return <p style={{textAlign: 'center', marginTop: '30px'}}>Carregando dados da página de Ordens de Serviço...</p>;
  }
  
  // Feedback de erro principal se dados essenciais não carregarem
  // Este erro será mais genérico. Erros específicos de API já são logados no console pelos serviços.
  if (error && ordensServico.length === 0 && clientes.length === 0 && produtosDisponiveis.length === 0) {
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
        produtosDisponiveis={produtosDisponiveis} // Passa a lista de produtos para o formulário
      />
      
      {/* Exibe erro se houver uma mensagem de erro no estado, mesmo com alguns dados na tela */}
      {error && <p style={{ color: '#ff8a8a', background: '#4b2323', padding: '10px', borderRadius: '7px', textAlign: 'center', margin: '15px 0' }}>{error}</p>}

      {/* Feedback de loading para recargas parciais */}
      {loading && (ordensServico.length > 0 || clientes.length > 0 || produtosDisponiveis.length > 0) && <p style={{textAlign: 'center'}}>Atualizando dados...</p>}
      
      <OrdemServicoList
        ordensServico={ordensServico}
        onOsDeletada={handleOsDeletada}
        onEditarOs={handleIniciarEdicao}
      />
    </div>
  );
}

export default OrdensServicoPage;