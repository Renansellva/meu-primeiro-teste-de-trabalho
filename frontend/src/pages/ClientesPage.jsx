// frontend/src/pages/ClientesPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ClienteForm from '../components/Clientes/ClienteForm';
import ClienteList from '../components/Clientes/ClienteList';
import Modal from '../components/common/Modal'; // Importar o componente Modal
import { getClientes } from '../services/apiCliente';
import toast from 'react-hot-toast';

function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [clienteEmEdicao, setClienteEmEdicao] = useState(null); // Cliente para edição
  const [isModalOpen, setIsModalOpen] = useState(false); // Estado para controlar o modal

  const carregarClientes = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getClientes();
      setClientes(data || []);
    } catch (err) {
      toast.error('Falha ao carregar a lista de clientes.');
      setClientes([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  // Funções para controlar o modal
  const abrirModalParaCriar = () => {
    setClienteEmEdicao(null); // Garante que o formulário estará em modo de criação
    setIsModalOpen(true);
  };

  const abrirModalParaEditar = (cliente) => {
    setClienteEmEdicao(cliente); // Define qual cliente editar
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setClienteEmEdicao(null); // Limpa o cliente em edição ao fechar
  };

  // Chamada após criar ou editar um cliente com sucesso
  const handleClienteSalvo = () => {
    fecharModal(); // Fecha o modal
    carregarClientes(); // Recarrega a lista
  };
  
  // Chamada após deletar um cliente com sucesso
  const handleClienteDeletado = () => {
    carregarClientes(); // Recarrega a lista
  };


  if (loading && clientes.length === 0) return <p style={{textAlign: 'center', marginTop: '30px'}}>Carregando clientes...</p>;

  return (
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#30e88b' }}>Gestão de Clientes</h2>
        <button onClick={abrirModalParaCriar} className="btn-enviar">+ Novo Cliente</button>
      </div>

      {loading && clientes.length === 0 && <p>Carregando...</p>}
      
      <ClienteList
        clientes={clientes}
        onClienteDeletado={handleClienteDeletado}
        onEditarCliente={abrirModalParaEditar} // Abre o modal para edição
      />

      {/* O Modal com o formulário de cliente dentro */}
      <Modal
        isOpen={isModalOpen}
        onClose={fecharModal}
        title={clienteEmEdicao ? `Editando Cliente: ${clienteEmEdicao.nome_completo}` : "Cadastrar Novo Cliente"}
      >
        <ClienteForm
          onClienteSalvo={handleClienteSalvo}
          clienteParaEditar={clienteEmEdicao}
          onEdicaoCancelada={fecharModal}
        />
      </Modal>
    </div>
  );
}

export default ClientesPage;