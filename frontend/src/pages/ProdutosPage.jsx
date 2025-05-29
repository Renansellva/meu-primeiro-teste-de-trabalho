// frontend/src/pages/ProdutosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ProdutoForm from '../components/Produtos/ProdutoForm';
import ProdutoList from '../components/Produtos/ProdutoList';
import { getProdutos, pesquisarProdutosPorNome } from '../services/apiProduto';

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null);

  const atualizarListaDeProdutos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      let data;
      if (termoBusca.trim()) {
        data = await pesquisarProdutosPorNome(termoBusca);
      } else {
        data = await getProdutos();
      }
      setProdutos(data);
      if (data.length === 0 && termoBusca.trim()) {
        // Opcional: setError(`Nenhum produto encontrado para "${termoBusca}".`);
      }
    } catch (err) {
      setError(termoBusca.trim() ? `Falha ao buscar produtos por "${termoBusca}".` : 'Falha ao carregar produtos.');
      console.error(err);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }, [termoBusca]); // Depende de termoBusca para refazer a busca correta

  useEffect(() => {
    atualizarListaDeProdutos();
  }, [atualizarListaDeProdutos]);

  const aposModificacaoProduto = () => {
    setProdutoEmEdicao(null); // Limpa o formulário de edição
    // Não limpa termoBusca aqui, para manter o contexto da busca se houver
    atualizarListaDeProdutos();
  };

  const handleIniciarEdicao = (produto) => {
    setProdutoEmEdicao(produto);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBuscaTrigger = () => { // Para o botão de busca
    atualizarListaDeProdutos();
  }

  const limparBuscaEListarTodos = () => {
    setTermoBusca('');
    // A atualização da lista ocorrerá pelo useEffect devido à mudança em termoBusca,
    // mas para garantir que 'getProdutos' seja chamado, podemos ser explícitos
    // ou ajustar 'atualizarListaDeProdutos' para sempre chamar getProdutos se termoBusca for vazio.
    // A lógica atual de atualizarListaDeProdutos já faz isso.
  };


  if (loading && produtos.length === 0 && !error && !produtoEmEdicao ) return <p>Carregando produtos...</p>;

  return (
    <div className="produtos-page" style={{ padding: '20px' }}>
      <h2>Gestão de Produtos/Peças</h2>
      <ProdutoForm
        onProdutoSalvo={aposModificacaoProduto} // Nome genérico para criação ou edição
        produtoParaEditar={produtoEmEdicao}
        onEdicaoCancelada={() => setProdutoEmEdicao(null)}
      />

      <div className="busca-produtos" style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        <h3>Pesquisar Produtos por Nome</h3>
        <input
          type="text"
          placeholder="Digite o nome do produto..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button onClick={handleBuscaTrigger} className="button" style={{ marginRight: '10px' }}>Pesquisar</button>
        {termoBusca && (
          <button onClick={limparBuscaEListarTodos} className="button" style={{ backgroundColor: '#6c757d' }}>Limpar Busca</button>
        )}
        {error && !loading && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>

      {loading && produtos.length > 0 && <p>Atualizando lista...</p>}
      <ProdutoList
        produtos={produtos}
        onProdutoVendido={aposModificacaoProduto} // Reutiliza a mesma função de callback
        onProdutoDeletado={aposModificacaoProduto}
        onEditarProduto={handleIniciarEdicao}
      />
    </div>
  );
}

export default ProdutosPage;