// frontend/src/pages/RelatoriosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  fetchTotalReceitaVendaProdutos,
  fetchValorEstoqueAtualCusto,
  fetchTotalGastoCompraProdutos,
  fetchVendasPorDia
} from '../services/apiRelatorios';

function RelatoriosPage() {
  // Estados para os dados dos relatórios
  const [totalReceita, setTotalReceita] = useState(null);
  const [valorEstoqueCusto, setValorEstoqueCusto] = useState(null);
  const [totalGastoCompras, setTotalGastoCompras] = useState(null);
  const [vendasPorDia, setVendasPorDia] = useState([]);

  // Estados para filtros de data
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  // Estados de loading e erro
  const [loadingReceita, setLoadingReceita] = useState(false);
  const [loadingEstoque, setLoadingEstoque] = useState(false);
  const [loadingGastos, setLoadingGastos] = useState(false);
  const [loadingVendasDia, setLoadingVendasDia] = useState(false);
  const [error, setError] = useState('');

  const formatarValor = (valor) => {
    const numero = parseFloat(valor);
    return isNaN(numero) ? 'N/A' : numero.toFixed(2);
  };

  const carregarRelatorios = useCallback(async () => {
    const params = {};
    if (dataInicio) params.dataInicio = dataInicio;
    if (dataFim) params.dataFim = dataFim;

    // Carregar Total de Receita
    setLoadingReceita(true);
    try {
      const dataReceita = await fetchTotalReceitaVendaProdutos(params);
      setTotalReceita(dataReceita.totalReceitaVendaProdutos);
    } catch (err) {
      setError('Falha ao carregar total de receita.');
      console.error(err);
    } finally {
      setLoadingReceita(false);
    }

    // Carregar Valor do Estoque a Custo (não depende de data)
    setLoadingEstoque(true);
    try {
      const dataEstoque = await fetchValorEstoqueAtualCusto();
      setValorEstoqueCusto(dataEstoque.valorEstoqueAtualCusto);
    } catch (err) {
      // setError('Falha ao carregar valor do estoque.'); // Pode poluir se outros carregarem
      console.error(err);
    } finally {
      setLoadingEstoque(false);
    }

    // Carregar Total Gasto em Compras
    setLoadingGastos(true);
    try {
      const dataGastos = await fetchTotalGastoCompraProdutos(params);
      setTotalGastoCompras(dataGastos.totalGastoCompraProdutos);
    } catch (err) {
      setError('Falha ao carregar total de gastos com compras.');
      console.error(err);
    } finally {
      setLoadingGastos(false);
    }
    
    // Carregar Vendas por Dia
    setLoadingVendasDia(true);
    try {
      const dataVendas = await fetchVendasPorDia(params);
      setVendasPorDia(dataVendas);
    } catch (err) {
      setError('Falha ao carregar vendas por dia.');
      console.error(err);
    } finally {
      setLoadingVendasDia(false);
    }

  }, [dataInicio, dataFim]);

  useEffect(() => {
    // Carrega os relatórios que não dependem de filtro de data inicialmente
    // e os que dependem de filtro se as datas estiverem preenchidas.
    // Ou podemos ter um botão para "Gerar Relatório" com base nas datas.
    // Por agora, vamos carregar tudo, e o filtro afetará na próxima chamada.
    // Para carregar ao montar e quando as datas mudam (se quiser):
    // carregarRelatorios();
    // Ou, para carregar apenas quando o usuário clicar em um botão "Aplicar Filtros / Gerar":
    // Não fazer nada no useEffect e ter um botão.
    
    // Vamos carregar os dados que não dependem de filtro ao montar
    const carregarDadosIniciais = async () => {
        setLoadingEstoque(true);
        try {
            const dataEstoque = await fetchValorEstoqueAtualCusto();
            setValorEstoqueCusto(dataEstoque.valorEstoqueAtualCusto);
        } catch (err) { console.error(err); }
        setLoadingEstoque(false);
    };
    carregarDadosIniciais();
    // Os outros relatórios serão carregados ao clicar no botão "Gerar Relatórios com Filtro"
  }, []); // Roda apenas uma vez ao montar para dados iniciais

  const handleGerarRelatoriosFiltrados = () => {
    setError(''); // Limpa erros anteriores
    carregarRelatorios();
  }

  return (
    <div className="relatorios-page" style={{ padding: '20px' }}>
      <h2>Relatórios da Loja</h2>

      <div className="filtros-relatorios" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Filtrar por Período (para Receitas, Gastos e Vendas/Dia)</h3>
        <label htmlFor="dataInicio" style={{ marginRight: '10px' }}>Data Início:</label>
        <input
          type="date"
          id="dataInicio"
          value={dataInicio}
          onChange={(e) => setDataInicio(e.target.value)}
          style={{ marginRight: '20px' }}
        />
        <label htmlFor="dataFim" style={{ marginRight: '10px' }}>Data Fim:</label>
        <input
          type="date"
          id="dataFim"
          value={dataFim}
          onChange={(e) => setDataFim(e.target.value)}
          style={{ marginRight: '20px' }}
        />
        <button onClick={handleGerarRelatoriosFiltrados} className="button">
          Gerar Relatórios com Filtro
        </button>
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div className="secao-relatorio" style={{ marginBottom: '30px' }}>
        <h3>Sumário Financeiro</h3>
        <p>Total de Receita com Venda de Produtos (período filtrado): 
          <strong> R$ {loadingReceita ? 'Carregando...' : formatarValor(totalReceita)}</strong>
        </p>
        <p>Total Gasto na Compra de Produtos (período filtrado): 
          <strong> R$ {loadingGastos ? 'Carregando...' : formatarValor(totalGastoCompras)}</strong>
        </p>
        <p>Valor do Estoque Atual a Preço de Custo: 
          <strong> R$ {loadingEstoque ? 'Carregando...' : formatarValor(valorEstoqueCusto)}</strong>
        </p>
      </div>

      <div className="secao-relatorio">
        <h3>Vendas por Dia (período filtrado)</h3>
        {loadingVendasDia ? <p>Carregando vendas...</p> : (
          vendasPorDia.length > 0 ? (
            <table border="1" cellPadding="5" style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Descrição da Venda</th>
                  <th>Valor (R$)</th>
                </tr>
              </thead>
              <tbody>
                {vendasPorDia.map((venda, index) => (
                  <tr key={index}> {/* Idealmente, o backend retornaria um ID único para cada item de venda */}
                    <td>{new Date(venda.dia + 'T00:00:00').toLocaleDateString('pt-BR')}</td>
                    <td>{venda.descricao}</td>
                    <td style={{textAlign: 'right'}}>{formatarValor(venda.valor)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Nenhuma venda encontrada para o período selecionado.</p>
          )
        )}
      </div>
    </div>
  );
}

export default RelatoriosPage;