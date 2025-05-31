// frontend/src/components/OrdensServico/OrdemServicoList.jsx
import React from 'react';

function OrdemServicoList({ ordensServico }) {
  if (!ordensServico || ordensServico.length === 0) {
    return <p>Nenhuma Ordem de Serviço cadastrada ainda.</p>;
  }

  return (
    <div className="os-list">
      <h3>Ordens de Serviço Cadastradas</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {ordensServico.map(os => (
          <li key={os.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
            <strong>OS #{os.numero_os}</strong> - Cliente: {os.nome_cliente || 'N/A'} (ID Cliente: {os.cliente_id})<br />
            Equipamento: {os.tipo_equipamento} {os.marca_equipamento} {os.modelo_equipamento}<br />
            Defeito Relatado: {os.defeito_relatado_cliente}<br />
            Status: <strong>{os.status_os}</strong><br />
            Valor Total: R$ {os.valor_total_os ? parseFloat(os.valor_total_os).toFixed(2) : 'A definir'}<br />
            Data Entrada: {new Date(os.data_entrada).toLocaleDateString()}
            {/* Botões Ver Detalhes/Editar/Atualizar Status aqui no futuro */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default OrdemServicoList;