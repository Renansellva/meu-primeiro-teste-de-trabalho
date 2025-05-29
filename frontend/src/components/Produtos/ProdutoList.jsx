// frontend/src/components/Produtos/ProdutoList.jsx
import React from 'react';
import { registrarVendaProduto } from '../../services/apiProduto'; // 👈 Importar a nova função

// Props:
// produtos (array de produtos para listar)
// onProdutoVendido (função para ser chamada após registrar uma venda, para atualizar a lista na ProdutosPage)
function ProdutoList({ produtos, onProdutoVendido }) { // 👈 Nova prop onProdutoVendido
  if (!produtos || produtos.length === 0) {
    return <p>Nenhum produto/peça cadastrado(a) ainda.</p>;
  }

  const handleRegistrarVenda = async (produtoId, nomeProduto) => {
    const quantidadeStr = window.prompt(`Registrar venda para "${nomeProduto}".\nDigite a quantidade vendida:`, "1");

    if (quantidadeStr === null) { // Usuário cancelou o prompt
      return;
    }

    const quantidadeVendida = parseInt(quantidadeStr, 10);

    if (isNaN(quantidadeVendida) || quantidadeVendida <= 0) {
      alert("Por favor, insira uma quantidade válida (número positivo).");
      return;
    }

    try {
      const resultado = await registrarVendaProduto(produtoId, quantidadeVendida);
      alert(resultado.mensagem || `Venda de ${quantidadeVendida} unidade(s) de "${nomeProduto}" registrada com sucesso!`);
      if (onProdutoVendido) {
        onProdutoVendido(); // Notifica o componente pai para recarregar a lista
      }
    } catch (error) {
      alert(error.response?.data?.erro || 'Falha ao registrar venda. Verifique o console.');
      console.error("Erro ao registrar venda no componente:", error);
    }
  };

  return (
    <div className="produto-list">
      <h3>Produtos/Peças Cadastrados</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {produtos.map(produto => (
          <li key={produto.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{produto.nome_produto}</strong> (ID: {produto.id})<br />
              Estoque: {produto.quantidade_estoque} {produto.unidade_medida || ''}<br />
              Preço Custo: R$ {produto.preco_custo_medio ? parseFloat(produto.preco_custo_medio).toFixed(2) : 'N/A'}<br />
              Preço Venda: R$ {produto.preco_venda_padrao ? parseFloat(produto.preco_venda_padrao).toFixed(2) : 'N/A'}<br />
              Fornecedor: {produto.fornecedor_principal || 'N/A'}<br />
              {produto.descricao && <>Descrição: {produto.descricao}<br /></>}
            </div>
            <div>
              <button
                onClick={() => handleRegistrarVenda(produto.id, produto.nome_produto)}
                className="button" // Reutilizando a classe .button ou crie uma específica
                style={{ backgroundColor: '#28a745', color: 'white', marginLeft: '10px' }} // Um verde para venda
              >
                Registrar Venda
              </button>
              {/* Botões Editar/Deletar aqui no futuro */}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdutoList;