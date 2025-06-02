// frontend/src/pages/CaixaPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import MovimentacaoCaixaForm from '../components/Caixa/MovimentacaoCaixaForm';
import MovimentacaoCaixaList from '../components/Caixa/MovimentacaoCaixaList';
import { getMovimentacoesCaixa } from '../services/apiCaixa';

function CaixaPage() {
  const [movimentacoes, setMovimentacoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros (exemplo simples: tipo)
  const [filtroTipo, setFiltroTipo] = useState(''); // 'Entrada', 'Saída', ou '' para todos
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');


  const carregarMovimentacoes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filtroTipo) params.tipo = filtroTipo;
      if (filtroDataInicio) params.dataInicio = filtroDataInicio;
      if (filtroDataFim) params.dataFim = filtroDataFim;
      // Adicione outros filtros aqui (ex: categoria)

      const data = await getMovimentacoesCaixa(params);
      setMovimentacoes(data || []);
    } catch (err) {
      setError('Falha ao carregar movimentações do caixa.');
      console.error(err);
      setMovimentacoes([]);
    } finally {
      setLoading(false);
    }
  }, [filtroTipo, filtroDataInicio, filtroDataFim]); // Recarrega quando os filtros mudam

  useEffect(() => {
    carregarMovimentacoes();
  }, [carregarMovimentacoes]);

  const handleMovimentacaoCriada = () => {
    carregarMovimentacoes(); // Recarrega a lista após criar uma nova movimentação
  };

  if (loading && movimentacoes.length === 0) return <p style={{textAlign: 'center', marginTop: '30px'}}>Carregando movimentações do caixa...</p>;
  // if (error) return <p style={{ color: 'red' }}>{error}</p>; // Mostra o erro de forma mais proeminente abaixo

  return (
    <div className="caixa-page" style={{ padding: '20px' }}>
      <h2 style={{ textAlign: 'center', color: '#30e88b', marginBottom: '25px' }}>Controle de Caixa</h2>
      <MovimentacaoCaixaForm onMovimentacaoCriada={handleMovimentacaoCriada} />

      <div className="filtros-caixa" style={{ margin: '30px 0', padding: '15px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)' }}>
        <h4 style={{marginTop: 0, color: '#30e88b'}}>Filtrar Movimentações</h4>
        <div style={{display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap'}}>
            <div>
                <label htmlFor="filtroTipoCaixa" style={{marginRight: '5px'}}>Tipo:</label>
                <select id="filtroTipoCaixa" value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
                    <option value="">Todos</option>
                    <option value="Entrada">Entrada</option>
                    <option value="Saída">Saída</option>
                </select>
            </div>
            <div>
                <label htmlFor="filtroDataInicioCaixa" style={{ marginRight: '5px' }}>De:</label>
                <input type="date" id="filtroDataInicioCaixa" value={filtroDataInicio} onChange={(e) => setFiltroDataInicio(e.target.value)} />
            </div>
            <div>
                <label htmlFor="filtroDataFimCaixa" style={{ marginRight: '5px' }}>Até:</label>
                <input type="date" id="filtroDataFimCaixa" value={filtroDataFim} onChange={(e) => setFiltroDataFim(e.target.value)} />
            </div>
            {/* <button onClick={carregarMovimentacoes} className="button">Aplicar Filtros</button> */}
            {/* O useEffect já recarrega ao mudar os filtros */}
        </div>
      </div>
      
      {error && <p style={{ color: '#ff8a8a', background: '#4b2323', padding: '10px', borderRadius: '7px', textAlign: 'center', margin: '15px 0' }}>{error}</p>}
      {loading && <p style={{textAlign: 'center'}}>Atualizando movimentações...</p>}
      <MovimentacaoCaixaList movimentacoes={movimentacoes} />
    </div>
  );
}

export default CaixaPage;