// frontend/src/components/Produtos/ProdutoList.jsx
import React from 'react';
import { registrarVendaProduto, deleteProduto } from '../../services/apiProduto'; // 👈 Importar deleteProduto

// Props:
// produtos (array de produtos para listar)
// onProdutoVendido (função para ser chamada após registrar uma venda)
// onProdutoDeletado (função para ser chamada após deletar um produto) 👈 Nova prop
// onEditarProduto (função para ser chamada ao clicar em editar) 👈 Nova prop
function ProdutoList({ produtos, onProdutoVendido, onProdutoDeletado, onEditarProduto }) {
  if (!produtos || produtos.length === 0) {
    return <p>Nenhum produto/peça cadastrado(a) ainda.</p>;
  }

  const handleRegistrarVenda = async (produtoId, nomeProduto) => {
    const quantidadeStr = window.prompt(`Registrar venda para "${nomeProduto}".\nDigite a quantidade vendida:`, "1");
    if (quantidadeStr === null) return;
    const quantidadeVendida = parseInt(quantidadeStr, 10);
    if (isNaN(quantidadeVendida) || quantidadeVendida <= 0) {
      alert("Por favor, insira uma quantidade válida (número positivo).");
      return;
    }
    try {
      const resultado = await registrarVendaProduto(produtoId, quantidadeVendida);
      alert(resultado.mensagem || `Venda de ${quantidadeVendida} unidade(s) de "${nomeProduto}" registrada!`);
      if (onProdutoVendido) onProdutoVendido();
    } catch (error) {
      alert(error.response?.data?.erro || 'Falha ao registrar venda.');
    }
  };

  const handleDeleteProduto = async (produtoId, nomeProduto) => {
    if (window.confirm(`Tem certeza que deseja deletar o produto "${nomeProduto}" (ID: ${produtoId})?`)) {
      try {
        await deleteProduto(produtoId);
        alert(`Produto "${nomeProduto}" deletado com sucesso!`);
        if (onProdutoDeletado) {
          onProdutoDeletado(produtoId); // Notifica o componente pai
        }
      } catch (error) {
        alert(error.response?.data?.erro || 'Falha ao deletar produto.');
        console.error("Erro ao deletar produto no componente:", error);
      }
    }
  };

  return (
    <div className="produto-list">
      <h3>Produtos/Peças Cadastrados</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {produtos.map(produto => (
          <li key={produto.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
            <div>
              <strong>{produto.nome_produto}</strong> (ID: {produto.id})<br />
              Estoque: {produto.quantidade_estoque} {produto.unidade_medida || ''}<br />
              Preço Custo: R$ {produto.preco_custo_medio ? parseFloat(produto.preco_custo_medio).toFixed(2) : 'N/A'}<br />
              Preço Venda: R$ {produto.preco_venda_padrao ? parseFloat(produto.preco_venda_padrao).toFixed(2) : 'N/A'}<br />
              Fornecedor: {produto.fornecedor_principal || 'N/A'}<br />
              {produto.descricao && <>Descrição: {produto.descricao}<br /></>}
            </div>
            <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}> {/* Container para os botões */}
              <button
                onClick={() => handleRegistrarVenda(produto.id, produto.nome_produto)}
                className="button"
                style={{ backgroundColor: '#28a745', color: 'white', padding: '6px 10px', fontSize: '0.9em' }}
              >
                Registrar Venda
              </button>
              <button
                onClick={() => onEditarProduto(produto)} // Passa o objeto produto inteiro
                className="button"
                style={{ backgroundColor: '#ffc107', color: 'black', padding: '6px 10px', fontSize: '0.9em' }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDeleteProduto(produto.id, produto.nome_produto)}
                className="button"
                style={{ backgroundColor: '#dc3545', color: 'white', padding: '6px 10px', fontSize: '0.9em' }}
              >
                Deletar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdutoList;