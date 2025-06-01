// frontend/src/components/OrdensServico/OrdemServicoList.jsx
import React from 'react';
import { deleteOrdemServico } from '../../services/apiOrdemServico'; // Importa deleteOrdemServico

// Props: ordensServico, onOsDeletada, onEditarOs
function OrdemServicoList({ ordensServico, onOsDeletada, onEditarOs }) {
  if (!ordensServico || ordensServico.length === 0) {
    return <p>Nenhuma Ordem de Serviço cadastrada ainda.</p>;
  }

  const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A';
    return new Date(dataISO + 'T00:00:00Z').toLocaleDateString('pt-BR'); // Adiciona Z para UTC
  };
   const formatarDataHora = (dataISO) => {
    if (!dataISO) return 'N/A';
    return new Date(dataISO).toLocaleString('pt-BR', {timeZone: 'America/Sao_Paulo'}); // Ajusta para fuso horário local
  };


  const handleDelete = async (osId, numeroOs) => {
    if (window.confirm(`Tem certeza que deseja deletar a O.S. #${numeroOs}?`)) {
      try {
        await deleteOrdemServico(osId);
        alert(`O.S. #${numeroOs} deletada com sucesso!`);
        if (onOsDeletada) onOsDeletada();
      } catch (error) {
        alert(error.response?.data?.erro || 'Falha ao deletar O.S.');
      }
    }
  };

  return (
    <div className="os-list" style={{marginTop: '20px'}}>
      <h3>Ordens de Serviço Cadastradas</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {ordensServico.map(os => (
          <li key={os.id} style={{ border: '1px solid #313b5f', padding: '15px', marginBottom: '15px', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.8)' }}>
            <p style={{margin: '0 0 5px 0'}}><strong>OS Nº: {os.numero_os}</strong> (ID: {os.id})</p>
            <p style={{margin: '0 0 5px 0'}}>Cliente: {os.nome_cliente || 'N/A'} (ID: {os.cliente_id})</p>
            <p style={{margin: '0 0 5px 0'}}>Equipamento: {os.tipo_equipamento} {os.marca_equipamento} - {os.modelo_equipamento}</p>
            <p style={{margin: '0 0 5px 0'}}>Defeito: {os.defeito_relatado_cliente}</p>
            <p style={{margin: '0 0 8px 0'}}>Status: <strong style={{color: os.status_os === 'Entregue' || os.status_os === 'Finalizado e Pago' ? 'lightgreen' : (os.status_os === 'Cancelado' ? 'lightcoral' : '#5eead4') }}>{os.status_os}</strong></p>
            <p style={{margin: '0 0 8px 0'}}>Valor Total: R$ {os.valor_total_os ? parseFloat(os.valor_total_os).toFixed(2).replace('.',',') : 'A definir'}</p>
            <p style={{margin: '0 0 5px 0', fontSize: '0.9em', color: '#ccc'}}>Entrada: {formatarDataHora(os.data_entrada)}</p>
            {os.data_previsao_entrega && <p style={{margin: '0 0 5px 0', fontSize: '0.9em', color: '#ccc'}}>Previsão: {formatarData(os.data_previsao_entrega)}</p>}
            
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => onEditarOs(os)} 
                className="button" 
                style={{backgroundColor: '#ffc107', color: 'black', padding: '8px 12px', fontSize: '0.9em'}}
              >
                Editar/Ver Detalhes
              </button>
              <button 
                onClick={() => handleDelete(os.id, os.numero_os)} 
                className="button" 
                style={{backgroundColor: '#dc3545', color: 'white', padding: '8px 12px', fontSize: '0.9em'}}
              >
                Deletar OS
              </button>
              {/* Outros botões de ação rápida podem vir aqui, ex: "Mudar Status" */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdemServicoList;