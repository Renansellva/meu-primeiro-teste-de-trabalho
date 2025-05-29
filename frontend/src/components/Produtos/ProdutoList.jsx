// frontend/src/components/Produtos/ProdutoList.jsx
import React from 'react';

function ProdutoList({ produtos }) {
  if (!produtos || produtos.length === 0) {
    return <p>Nenhum produto/peça cadastrado(a) ainda.</p>;
  }

  return (
    <div className="produto-list">
      <h3>Produtos/Peças Cadastrados</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {produtos.map(produto => (
          <li key={produto.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px' }}>
            <strong>{produto.nome_produto}</strong> (ID: {produto.id})<br />
            Estoque: {produto.quantidade_estoque} {produto.unidade_medida || ''}<br />
            Preço Venda: R$ {produto.preco_venda_padrao ? parseFloat(produto.preco_venda_padrao).toFixed(2) : 'N/A'}<br />
            {produto.descricao && `Descrição: ${produto.descricao}`}
            {/* Botões Editar/Deletar/Ver Detalhes aqui no futuro */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProdutoList;