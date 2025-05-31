// frontend/src/pages/ProdutosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ProdutoForm from '../components/Produtos/ProdutoForm';
import ProdutoList from '../components/Produtos/ProdutoList';
import { getProdutos, pesquisarProdutosPorNome } from '../services/apiProduto'; // Certifique-se que updateProduto está em apiProduto.js

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null); // Já tínhamos este

  // Função para carregar/recarregar a lista de produtos (seja todos ou resultado da busca)
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
  }, [termoBusca]); // Depende de termoBusca

  useEffect(() => {
    atualizarListaDeProdutos();
  }, [atualizarListaDeProdutos]);

  // Chamada após um produto ser criado OU editado com sucesso
  const handleProdutoSalvo = () => {
    setProdutoEmEdicao(null); // Limpa o modo de edição (formulário volta para "Cadastrar Novo")
    atualizarListaDeProdutos(); // Recarrega a lista
  };

  // Chamada quando o botão "Editar" na lista é clicado
  const handleIniciarEdicao = (produto) => {
    setProdutoEmEdicao(produto);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Rola para o formulário no topo
  };

  // Chamada quando um produto é deletado
  const handleProdutoDeletado = () => {
    setProdutoEmEdicao(null); // Caso o produto em edição seja deletado
    atualizarListaDeProdutos();
  };
  
  const handleBuscaTrigger = () => {
    atualizarListaDeProdutos();
  }

  const limparBuscaEListarTodos = () => {
    setTermoBusca('');
    // A atualização da lista ocorrerá pelo useEffect devido à mudança em termoBusca,
    // mas podemos chamar diretamente para garantir se quisermos.
    // A lógica atual de atualizarListaDeProdutos com termoBusca vazio já lista todos.
  };

  if (loading && produtos.length === 0 && !error && !produtoEmEdicao) return <p>Carregando produtos...</p>;

  return (
    <div className="produtos-page" style={{ padding: '20px' }}>
      <h2>Gestão de Produtos/Peças</h2>
      <ProdutoForm
        onProdutoSalvo={handleProdutoSalvo} // Passa a função de callback unificada
        produtoParaEditar={produtoEmEdicao}
        onEdicaoCancelada={() => {
          setProdutoEmEdicao(null); // Limpa o formulário e estado de edição
          setErro(''); // Limpa possíveis erros do formulário
          setSucesso(''); // Limpa possíveis mensagens de sucesso do formulário (adicionar 'setSucesso' ao ProdutoForm se ainda não tiver)
        }}
      />

      {/* Formulário de Busca (código existente) */}
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
        onProdutoVendido={handleProdutoSalvo} // Pode usar a mesma callback se a venda também precisar recarregar a lista
        onProdutoDeletado={handleProdutoDeletado}
        onEditarProduto={handleIniciarEdicao}
      />
    </div>
  );
}

export default ProdutosPage;