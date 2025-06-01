// frontend/src/components/OrdensServico/OrdemServicoList.jsx
import React from 'react';
import { deleteOrdemServico } from '../../services/apiOrdemServico';

// Props: ordensServico, onOsDeletada (callback para atualizar lista após deleção), onEditarOs (callback para iniciar edição)
function OrdemServicoList({ ordensServico, onOsDeletada, onEditarOs }) {
  if (!ordensServico || ordensServico.length === 0) {
    return <p>Nenhuma Ordem de Serviço cadastrada ainda.</p>;
  }

  const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A';
    // Adiciona T00:00:00 para que toLocaleDateString interprete corretamente como data local e não dia anterior por UTC
    return new Date(dataISO + 'T00:00:00').toLocaleDateString('pt-BR');
  };

  const formatarDataHora = (dataISO) => {
    if (!dataISO) return 'N/A';
    // Para data e hora, o ideal é o backend retornar em UTC e o frontend formatar para o timezone do usuário
    // new Date(dataISO) já tenta fazer isso.
    return new Date(dataISO).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}); // Exemplo de fuso horário
  };

  const handleDelete = async (osId, numeroOs) => {
    if (window.confirm(`Tem certeza que deseja deletar a O.S. #${numeroOs} (ID: ${osId})?`)) {
      try {
        await deleteOrdemServico(osId);
        alert(`O.S. #${numeroOs} deletada com sucesso!`);
        if (onOsDeletada) {
          onOsDeletada(); // Informa a página pai para recarregar a lista
        }
      } catch (error) {
        alert(error.response?.data?.erro || 'Falha ao deletar O.S. Verifique o console.');
        console.error("Erro ao deletar O.S. no componente:", error);
      }
    }
  };

  return (
    <div className="os-list" style={{marginTop: '30px'}}>
      <h3>Ordens de Serviço Cadastradas</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {ordensServico.map(os => (
          <li key={os.id} style={{ border: '1px solid #313b5f', padding: '15px', marginBottom: '15px', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.8)' }}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px'}}>
              <div>
                <p style={{margin: '0 0 5px 0', fontSize: '1.1em'}}><strong>OS Nº: {os.numero_os}</strong> (ID: {os.id})</p>
                <p style={{margin: '0 0 5px 0'}}>Cliente: {os.nome_cliente || 'N/A'} (ID Cliente: {os.cliente_id})</p>
              </div>
              <p style={{margin: '0', fontSize: '1.1em'}}>Status: <strong style={{color: os.status_os === 'Entregue' || os.status_os === 'Finalizado e Pago' ? 'lightgreen' : (os.status_os === 'Cancelado' ? 'lightcoral' : '#5eead4') }}>{os.status_os}</strong></p>
            </div>
            <p style={{margin: '0 0 5px 0'}}>Equipamento: {os.tipo_equipamento} {os.marca_equipamento} - {os.modelo_equipamento}</p>
            <p style={{margin: '0 0 8px 0'}}>Defeito Relatado: {os.defeito_relatado_cliente}</p>
            <p style={{margin: '0 0 8px 0'}}>Valor Total: R$ {os.valor_total_os ? parseFloat(os.valor_total_os).toFixed(2).replace('.',',') : 'A definir'}</p>
            {os.forma_pagamento && <p style={{margin: '0 0 8px 0'}}>Forma Pgto: <strong>{os.forma_pagamento}</strong></p>}
            <p style={{margin: '0 0 5px 0', fontSize: '0.9em', color: '#ccc'}}>Entrada: {formatarDataHora(os.data_entrada)}</p>
            {os.data_previsao_entrega && <p style={{margin: '0 0 5px 0', fontSize: '0.9em', color: '#ccc'}}>Previsão Entrega: {formatarData(os.data_previsao_entrega)}</p>}
            {os.diagnostico_tecnico && <p style={{margin: '0 0 5px 0', fontSize: '0.9em', color: '#ddd'}}>Diagnóstico: {os.diagnostico_tecnico}</p>}
            {os.servico_executado && <p style={{margin: '0 0 5px 0', fontSize: '0.9em', color: '#ddd'}}>Serviço: {os.servico_executado}</p>}
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
              <button 
                onClick={() => onEditarOs(os)} 
                className="button" 
                style={{backgroundColor: '#ffc107', color: 'black', padding: '8px 12px', fontSize: '0.9em'}}
              >
                Editar / Ver Detalhes
              </button>
              <button 
                onClick={() => handleDelete(os.id, os.numero_os)} 
                className="button" 
                style={{backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', fontSize: '0.9em'}}
              >
                Deletar OS
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdemServicoList;