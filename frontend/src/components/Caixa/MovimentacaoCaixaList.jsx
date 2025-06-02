// frontend/src/components/Caixa/MovimentacaoCaixaList.jsx
import React from 'react';

function MovimentacaoCaixaList({ movimentacoes }) {
  if (!movimentacoes || movimentacoes.length === 0) {
    return <p>Nenhuma movimentação de caixa registrada para o período/filtros selecionados.</p>;
  }

  const formatarDataHora = (dataISO) => {
    if (!dataISO) return 'N/A';
    return new Date(dataISO).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
  };

  const formatarValor = (valor) => {
    const numero = parseFloat(valor);
    return isNaN(numero) ? '0,00' : numero.toFixed(2).replace('.', ',');
  };

  return (
    <div className="caixa-list" style={{ marginTop: '30px' }}>
      <h3>Histórico de Movimentações do Caixa</h3>
      <table className="tabela-relatorio" style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9em', marginTop: '10px' }}>
        <thead>
          <tr style={{ backgroundColor: '#1a1c29', color: '#30e88b' }}>
            <th style={{ padding: '10px', border: '1px solid #313b5f' }}>Data/Hora</th>
            <th style={{ padding: '10px', border: '1px solid #313b5f' }}>Descrição</th>
            <th style={{ padding: '10px', border: '1px solid #313b5f' }}>Categoria</th>
            <th style={{ padding: '10px', border: '1px solid #313b5f' }}>Tipo</th>
            <th style={{ padding: '10px', border: '1px solid #313b5f', textAlign: 'right' }}>Valor (R$)</th>
            <th style={{ padding: '10px', border: '1px solid #313b5f' }}>Cliente</th>
            <th style={{ padding: '10px', border: '1px solid #313b5f' }}>OS Nº</th>
          </tr>
        </thead>
        <tbody>
          {movimentacoes.map((mov) => (
            <tr key={mov.id}>
              <td style={{ padding: '8px', border: '1px solid #313b5f' }}>{formatarDataHora(mov.data_movimentacao)}</td>
              <td style={{ padding: '8px', border: '1px solid #313b5f' }}>{mov.descricao}</td>
              <td style={{ padding: '8px', border: '1px solid #313b5f' }}>{mov.categoria || '-'}</td>
              <td style={{ color: mov.tipo_movimentacao === 'Entrada' ? 'lightgreen' : 'lightcoral', fontWeight: 'bold', padding: '8px', border: '1px solid #313b5f' }}>
                {mov.tipo_movimentacao}
              </td>
              <td style={{ textAlign: 'right', padding: '8px', border: '1px solid #313b5f' }}>{formatarValor(mov.valor)}</td>
              <td style={{ padding: '8px', border: '1px solid #313b5f' }}>{mov.nome_cliente || '-'}</td>
              <td style={{ padding: '8px', border: '1px solid #313b5f' }}>{mov.numero_os || '-'}</td>
              {/* Adicionar botões Editar/Deletar movimentação aqui no futuro, se necessário */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default MovimentacaoCaixaList;