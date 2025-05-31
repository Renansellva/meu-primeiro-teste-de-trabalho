// frontend/src/components/OrdensServico/OrdemServicoList.jsx
import React from 'react';

function OrdemServicoList({ ordensServico }) {
  if (!ordensServico || ordensServico.length === 0) {
    return <p>Nenhuma Ordem de Serviço cadastrada ainda.</p>;
  }

  const formatarData = (dataISO) => {
    if (!dataISO) return 'N/A';
    return new Date(dataISO).toLocaleDateString('pt-BR', { timeZone: 'UTC' }); // Adicionado timeZone UTC para consistência
  };

  return (
    <div className="os-list">
      <h3>Ordens de Serviço Cadastradas</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {ordensServico.map(os => (
          <li key={os.id} style={{ border: '1px solid #eee', padding: '15px', marginBottom: '10px', borderRadius: '8px', background: '#f9f9f9', color: '#333' }}>
            <p><strong>OS Nº: {os.numero_os}</strong> (ID: {os.id})</p>
            <p>Cliente: {os.nome_cliente || 'N/A'} (ID Cliente: {os.cliente_id})</p>
            <p>Equipamento: {os.tipo_equipamento} {os.marca_equipamento} - {os.modelo_equipamento}</p>
            <p>Defeito Relatado: {os.defeito_relatado_cliente}</p>
            <p>Status: <strong style={{color: os.status_os === 'Entregue' ? 'green' : (os.status_os === 'Cancelado' ? 'red' : 'blue') }}>{os.status_os}</strong></p>
            <p>Valor Total: R$ {os.valor_total_os ? parseFloat(os.valor_total_os).toFixed(2) : 'A definir'}</p>
            <p>Data Entrada: {formatarData(os.data_entrada)}</p>
            {os.data_previsao_entrega && <p>Previsão Entrega: {formatarData(os.data_previsao_entrega)}</p>}
            {/* Adicionar botões Ver Detalhes/Editar/Atualizar Status aqui no futuro */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdemServicoList;