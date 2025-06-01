// frontend/src/pages/RelatoriosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchTotalReceitaVendaProdutos,
  fetchValorEstoqueAtualCusto,
  fetchTotalGastoCompraProdutos,
  fetchVendasPorDia,
  fetchFluxoDeCaixaPeriodo
} from '../services/apiRelatorios';

function RelatoriosPage() {
  // Estados para os dados dos relatórios
  const [totalReceita, setTotalReceita] = useState('0.00');
  const [valorEstoqueCusto, setValorEstoqueCusto] = useState('0.00');
  const [totalGastoCompras, setTotalGastoCompras] = useState('0.00');
  const [vendasPorDia, setVendasPorDia] = useState([]);
  const [fluxoCaixaData, setFluxoCaixaData] = useState({
    totalEntradas: '0.00',
    totalSaidas: '0.00',
    saldoPeriodo: '0.00',
    movimentacoes: []
  });

  // Estados para filtros de data
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Estado de loading unificado
  const [loading, setLoading] = useState({
    geral: false,
    estoque: false,
  });
  const [error, setError] = useState('');

  // Funções de formatação
  const formatarValor = (valor) => {
    const numero = parseFloat(valor);
    return isNaN(numero) ? '0,00' : numero.toFixed(2).replace('.', ',');
  };

  const formatarDataSimples = (dataISO) => {
    if (!dataISO) return 'N/A';
    return new Date(dataISO + 'T00:00:00').toLocaleDateString('pt-BR'); // Adiciona T00:00:00 para UTC
  };
  
  const formatarDataHora = (dataISO) => {
    if (!dataISO) return 'N/A';
    return new Date(dataISO).toLocaleString('pt-BR');
  };

  // Carrega dados que não dependem de filtro ao montar a página
  const carregarDadosIniciais = useCallback(async () => {
    setLoading(prev => ({ ...prev, estoque: true }));
    try {
      const dataEstoque = await fetchValorEstoqueAtualCusto();
      setValorEstoqueCusto(dataEstoque.valorEstoqueAtualCusto);
    } catch (err) { 
      console.error("Erro ao carregar valor do estoque:",err);
      setError(prev => prev + ' Falha ao carregar valor do estoque.');
    }
    setLoading(prev => ({ ...prev, estoque: false }));
  }, []);

  useEffect(() => {
    carregarDadosIniciais();
  }, [carregarDadosIniciais]);

  // Função para carregar todos os relatórios baseados no filtro de data
  const handleGerarRelatoriosFiltrados = async () => {
    if (!dataInicio || !dataFim) {
      setError("Por favor, selecione Data Início e Data Fim para gerar os relatórios do período.");
      // Limpa dados de relatórios que dependem de data para evitar confusão
      setTotalReceita('0.00');
      setTotalGastoCompras('0.00');
      setVendasPorDia([]);
      setFluxoCaixaData({ totalEntradas: '0.00', totalSaidas: '0.00', saldoPeriodo: '0.00', movimentacoes: [] });
      return;
    }
    setError('');
    setLoading(prev => ({ ...prev, geral: true }));

    const params = { dataInicio, dataFim };

    try {
      const [
        dataReceita,
        dataGastos,
        dataVendas,
        dataFluxo
      ] = await Promise.all([
        fetchTotalReceitaVendaProdutos(params).catch(e => { console.error("Receita Error:", e); return {totalReceitaVendaProdutos: null}; }),
        fetchTotalGastoCompraProdutos(params).catch(e => { console.error("Gastos Error:", e); return {totalGastoCompraProdutos: null}; }),
        fetchVendasPorDia(params).catch(e => { console.error("Vendas/Dia Error:", e); return []; }),
        fetchFluxoDeCaixaPeriodo(params).catch(e => { console.error("Fluxo Caixa Error:", e); return null; })
      ]);

      setTotalReceita(dataReceita.totalReceitaVendaProdutos);
      setTotalGastoCompras(dataGastos.totalGastoCompraProdutos);
      setVendasPorDia(dataVendas || []);
      setFluxoCaixaData(dataFluxo || { totalEntradas: '0.00', totalSaidas: '0.00', saldoPeriodo: '0.00', movimentacoes: [] });

    } catch (err) { // Este catch geral pode não ser atingido se os individuais já tratam
      setError('Falha ao carregar um ou mais relatórios do período.');
      console.error("Erro geral ao carregar relatórios filtrados:", err);
    } finally {
      setLoading(prev => ({ ...prev, geral: false }));
    }
  };

  return (
    <div className="relatorios-page" style={{ padding: '20px', fontFamily: "'Inter', sans-serif" }}>
      <h2>Relatórios da Loja</h2>

      <div className="filtros-relatorios" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)' }}>
        <h3 style={{ marginTop: 0, color: '#30e88b' }}>Filtrar por Período</h3>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
          <div>
            <label htmlFor="dataInicio" style={{ marginRight: '5px', display: 'block', marginBottom: '3px', color: '#c7d0f7' }}>Data Início:</label>
            <input type="date" id="dataInicio" value={dataInicio} onChange={(e) => setDataInicio(e.target.value)} />
          </div>
          <div>
            <label htmlFor="dataFim" style={{ marginRight: '5px', display: 'block', marginBottom: '3px', color: '#c7d0f7' }}>Data Fim:</label>
            <input type="date" id="dataFim" value={dataFim} onChange={(e) => setDataFim(e.target.value)} />
          </div>
          <button onClick={handleGerarRelatoriosFiltrados} className="button" disabled={loading.geral || !dataInicio || !dataFim} style={{alignSelf: 'flex-end', padding: '10px 15px'}}>
            {loading.geral ? 'Gerando...' : 'Gerar Relatórios do Período'}
          </button>
        </div>
      </div>

      {error && <p style={{ color: '#ff8a8a', fontWeight: 'bold', background: '#4b2323', padding: '10px', borderRadius: '7px' }}>{error}</p>}

      <div className="secao-relatorio" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)' }}>
        <h3 style={{ marginTop: 0, color: '#30e88b' }}>Sumário Geral</h3>
        <p>Valor Total do Estoque Atual (a Preço de Custo): 
          <strong> R$ {loading.estoque ? '...' : formatarValor(valorEstoqueCusto)}</strong>
        </p>
        <hr style={{margin: '15px 0', borderColor: '#313b5f'}} />
        <h4>Resultados para o Período Selecionado:</h4>
        <p>Total de Receita com Venda de Produtos: 
          <strong> R$ {loading.geral && totalReceita === null ? '...' : formatarValor(totalReceita)}</strong>
        </p>
        <p>Total Gasto na Compra de Produtos (registrado no caixa): 
          <strong> R$ {loading.geral && totalGastoCompras === null ? '...' : formatarValor(totalGastoCompras)}</strong>
        </p>
        {fluxoCaixaData && (
          <>
            <p>Total Entradas no Caixa (Período): <strong>R$ {loading.geral && fluxoCaixaData.totalEntradas === '0.00' && fluxoCaixaData.movimentacoes.length === 0 ? '...' : formatarValor(fluxoCaixaData.totalEntradas)}</strong></p>
            <p>Total Saídas no Caixa (Período): <strong>R$ {loading.geral && fluxoCaixaData.totalSaidas === '0.00' && fluxoCaixaData.movimentacoes.length === 0 ? '...' : formatarValor(fluxoCaixaData.totalSaidas)}</strong></p>
            <p style={{fontWeight: 'bold', color: parseFloat(fluxoCaixaData.saldoPeriodo) >= 0 ? '#30e88b' : '#ff8a8a' }}>
              Saldo do Período no Caixa: <strong>R$ {loading.geral && fluxoCaixaData.saldoPeriodo === '0.00' && fluxoCaixaData.movimentacoes.length === 0 ? '...' : formatarValor(fluxoCaixaData.saldoPeriodo)}</strong>
            </p>
          </>
        )}
      </div>

      {fluxoCaixaData && (
        <div className="secao-relatorio" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)' }}>
          <h3 style={{ marginTop: 0, color: '#30e88b' }}>Extrato do Caixa (Período Selecionado)</h3>
          {loading.geral ? <p>Carregando extrato...</p> : (
            fluxoCaixaData.movimentacoes.length > 0 ? (
              <table className="tabela-relatorio" style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9em', marginTop: '10px'}}>
                <thead>
                  <tr style={{backgroundColor: '#1a1c29', color: '#30e88b'}}>
                    <th style={{padding: '8px', border: '1px solid #313b5f'}}>Data/Hora</th>
                    <th style={{padding: '8px', border: '1px solid #313b5f'}}>Descrição</th>
                    <th style={{padding: '8px', border: '1px solid #313b5f'}}>Categoria</th>
                    <th style={{padding: '8px', border: '1px solid #313b5f'}}>Tipo</th>
                    <th style={{padding: '8px', border: '1px solid #313b5f', textAlign: 'right'}}>Valor (R$)</th>
                    <th style={{padding: '8px', border: '1px solid #313b5f'}}>Cliente</th>
                    <th style={{padding: '8px', border: '1px solid #313b5f'}}>OS Nº</th>
                  </tr>
                </thead>
                <tbody>
                  {fluxoCaixaData.movimentacoes.map((mov, index) => (
                    <tr key={mov.id || index}>
                      <td style={{padding: '8px', border: '1px solid #313b5f'}}>{formatarDataHora(mov.data_movimentacao)}</td>
                      <td style={{padding: '8px', border: '1px solid #313b5f'}}>{mov.descricao}</td>
                      <td style={{padding: '8px', border: '1px solid #313b5f'}}>{mov.categoria || '-'}</td>
                      <td style={{color: mov.tipo_movimentacao === 'Entrada' ? 'lightgreen' : 'lightcoral', fontWeight: 'bold', padding: '8px', border: '1px solid #313b5f'}}>{mov.tipo_movimentacao}</td>
                      <td style={{textAlign: 'right', padding: '8px', border: '1px solid #313b5f'}}>{formatarValor(mov.valor)}</td>
                      <td style={{padding: '8px', border: '1px solid #313b5f'}}>{mov.nome_cliente || '-'}</td>
                      <td style={{padding: '8px', border: '1px solid #313b5f'}}>{mov.numero_os || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>Nenhuma movimentação de caixa encontrada para o período selecionado.</p>
            )
          )}
        </div>
      )}
      
      <div className="secao-relatorio" style={{ padding: '20px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)' }}>
        <h3 style={{ marginTop: 0, color: '#30e88b' }}>Detalhe de Vendas de Produtos (Período Selecionado - do Caixa)</h3>
         {loading.geral ? <p>Carregando vendas...</p> : (
          vendasPorDia.length > 0 ? (
            <table className="tabela-relatorio" style={{width: '100%', borderCollapse: 'collapse', fontSize: '0.9em', marginTop: '10px'}}>
              <thead>
                <tr style={{backgroundColor: '#1a1c29', color: '#30e88b'}}>
                  <th style={{padding: '8px', border: '1px solid #313b5f'}}>Data Venda</th>
                  <th style={{padding: '8px', border: '1px solid #313b5f'}}>Descrição da Venda (Item de Caixa)</th>
                  <th style={{padding: '8px', border: '1px solid #313b5f', textAlign: 'right'}}>Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                {vendasPorDia.map((venda) => ( // Removido 'index' desnecessário se 'venda.id_movimentacao_caixa' for único
                  <tr key={venda.id_movimentacao_caixa}>
                    <td style={{padding: '8px', border: '1px solid #313b5f'}}>{formatarDataSimples(venda.dia_venda)}</td>
                    <td style={{padding: '8px', border: '1px solid #313b5f'}}>{venda.descricao}</td>
                    <td style={{textAlign: 'right', padding: '8px', border: '1px solid #313b5f'}}>{formatarValor(venda.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma venda de produto registrada no caixa para o período selecionado.</p>
          )
        )}
      </div>
    </div>
  );
}

export default RelatoriosPage;