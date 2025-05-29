// frontend/src/pages/ProdutosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ProdutoForm from '../components/Produtos/ProdutoForm';
import ProdutoList from '../components/Produtos/ProdutoList';
import { getProdutos } from '../services/apiProduto';

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const carregarProdutos = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getProdutos();
      setProdutos(data);
    } catch (err) {
      setError('Falha ao carregar produtos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const handleProdutoCriado = () => {
    carregarProdutos(); // Recarrega a lista após criar um novo produto
  };

  if (loading && produtos.length === 0) return <p>Carregando produtos...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="produtos-page" style={{ padding: '20px' }}>
      <h2>Gestão de Produtos/Peças</h2>
      <ProdutoForm onProdutoCriado={handleProdutoCriado} />
      {loading && produtos.length > 0 && <p>Atualizando lista...</p>}
      <ProdutoList produtos={produtos} />
    </div>
  );
}

export default ProdutosPage;