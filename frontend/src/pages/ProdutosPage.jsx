// frontend/src/pages/ProdutosPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import ProdutoForm from '../components/Produtos/ProdutoForm';
import ProdutoList from '../components/Produtos/ProdutoList';
import Modal from '../components/common/Modal'; // 👈 Importar o novo Modal
import { getProdutos, pesquisarProdutosPorNome } from '../services/apiProduto';

function ProdutosPage() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [termoBusca, setTermoBusca] = useState('');
  
  const [produtoEmEdicao, setProdutoEmEdicao] = useState(null); // Produto para edição
  const [isModalOpen, setIsModalOpen] = useState(false); // 👈 Estado para controlar o modal

  const atualizarListaDeProdutos = useCallback(async () => {
    // ... (sua função para carregar produtos como antes) ...
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
    } catch (err) {
      setError('Falha ao carregar produtos.');
      console.error(err);
      setProdutos([]);
    } finally {
      setLoading(false);
    }
  }, [termoBusca]);

  useEffect(() => {
    atualizarListaDeProdutos();
  }, [atualizarListaDeProdutos]);
  
  const abrirModalParaCriar = () => {
    setProdutoEmEdicao(null); // Garante que o formulário estará em modo de criação
    setIsModalOpen(true);
  };

  const abrirModalParaEditar = (produto) => {
    setProdutoEmEdicao(produto); // Define qual produto editar
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
    setProdutoEmEdicao(null); // Limpa o produto em edição ao fechar
  };

  const handleProdutoSalvo = () => {
    fecharModal(); // Fecha o modal após salvar
    atualizarListaDeProdutos(); // E atualiza a lista
  };

  if (loading && produtos.length === 0 && !error) return <p>Carregando produtos...</p>;
  if (error && produtos.length === 0) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="produtos-page" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ margin: 0, color: '#30e88b' }}>Gestão de Produtos/Peças</h2>
        <button onClick={abrirModalParaCriar} className="btn-enviar">+ Novo Produto</button>
      </div>

      <div className="busca-produtos" style={{ marginBottom: '20px', padding: '15px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)' }}>
        <h3 style={{marginTop: 0}}>Pesquisar Produtos por Nome</h3>
        <input
          type="text"
          placeholder="Digite o nome do produto..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          style={{ marginRight: '10px', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button onClick={atualizarListaDeProdutos} className="button" style={{ marginRight: '10px' }}>Pesquisar</button>
        {termoBusca && (
          <button onClick={() => setTermoBusca('')} className="button" style={{ backgroundColor: '#6c757d' }}>Limpar Busca</button>
        )}
      </div>

      {loading && <p>Atualizando lista...</p>}
      {error && !loading && <p style={{ color: 'red' }}>{error}</p>}
      
      <ProdutoList
        produtos={produtos}
        // As funções de venda/deleção agora seriam passadas aqui também
        onProdutoVendido={atualizarListaDeProdutos}
        onProdutoDeletado={atualizarListaDeProdutos}
        onEditarProduto={abrirModalParaEditar} // Abre o modal para edição
      />

      {/* O Modal com o formulário dentro */}
      <Modal
        isOpen={isModalOpen}
        onClose={fecharModal}
        title={produtoEmEdicao ? `Editando Produto: ${produtoEmEdicao.nome_produto}` : "Cadastrar Novo Produto/Peça"}
      >
        <ProdutoForm
          onProdutoSalvo={handleProdutoSalvo}
          produtoParaEditar={produtoEmEdicao}
          onEdicaoCancelada={fecharModal}
        />
      </Modal>
    </div>
  );
}

export default ProdutosPage;