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

  const carregarTodosProdutos = useCallback(async () => {
    // ... (código existente da função carregarTodosProdutos) ...
    try {
      setLoading(true);
      setError(null);
      const data = await getProdutos();
      setProdutos(data);
    } catch (err) {
      setError('Falha ao carregar produtos.');
      console.error(err);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarTodosProdutos();
  }, [carregarTodosProdutos]);

  const handleProdutoCriado = () => {
    carregarTodosProdutos();
    setTermoBusca('');
  };

  const handleBuscaProdutos = async () => {
    // ... (código existente da função handleBuscaProdutos) ...
    if (!termoBusca.trim()) {
      carregarTodosProdutos();
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const data = await pesquisarProdutosPorNome(termoBusca);
      setProdutos(data);
      if (data.length === 0) {
        // Opcional: setError(`Nenhum produto encontrado para "${termoBusca}".`);
      }
    } catch (err) {
      setError(`Falha ao buscar produtos por "${termoBusca}".`);
      console.error(err);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  };

  const limparBusca = () => {
    setTermoBusca('');
    carregarTodosProdutos();
  };

  // Função para ser chamada quando um produto é vendido (ou qualquer atualização que precise recarregar a lista)
  const handleProdutoAtualizado = () => {
    // Se estivermos exibindo resultados de uma busca, podemos optar por refazer a busca
    // ou simplesmente carregar todos os produtos. Por simplicidade, vamos recarregar todos.
    if (termoBusca.trim()) {
      handleBuscaProdutos(); // Refaz a busca atual para atualizar os dados
    } else {
      carregarTodosProdutos(); // Ou carrega todos se não houver termo de busca ativo
    }
  };

  if (loading && produtos.length === 0 && !error) return <p>Carregando produtos...</p>;
  // ... (resto da lógica de return) ...

  return (
    <div className="produtos-page" style={{ padding: '20px' }}>
      <h2>Gestão de Produtos/Peças</h2>
      <ProdutoForm onProdutoCriado={handleProdutoCriado} />

      <div className="busca-produtos" style={{ margin: '20px 0', padding: '15px', border: '1px solid #ccc', borderRadius: '8px' }}>
        {/* ... (código do formulário de busca) ... */}
        <h3>Pesquisar Produtos por Nome</h3>
        <input
          type="text"
          placeholder="Digite o nome do produto..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button onClick={handleBuscaProdutos} className="button" style={{ marginRight: '10px' }}>Pesquisar</button>
        {termoBusca && (
          <button onClick={limparBusca} className="button" style={{ backgroundColor: '#6c757d' }}>Limpar Busca</button>
        )}
        {error && loading === false && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>

      {loading && produtos.length > 0 && <p>Atualizando lista...</p>}
      <ProdutoList produtos={produtos} onProdutoVendido={handleProdutoAtualizado} /> {/* 👈 Passar a nova prop */}
    </div>
  );
}

export default ProdutosPage;