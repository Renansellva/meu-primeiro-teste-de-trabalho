// frontend/src/components/Produtos/ProdutoForm.jsx
import React, { useState } from 'react';
import { createProduto } from '../../services/apiProduto';

function ProdutoForm({ onProdutoCriado }) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(0);
  const [precoVenda, setPrecoVenda] = useState('');
  const [descricao, setDescricao] = useState('');
  const [precoCusto, setPrecoCusto] = useState(''); // 👈 Novo estado
  const [fornecedor, setFornecedor] = useState(''); // 👈 Novo estado
  // Adicione mais estados para outros campos como codigo_interno, unidade_medida, etc., se desejar

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!nomeProduto || quantidadeEstoque < 0 || !precoVenda) {
      setErro('Nome do produto, quantidade e preço de venda são obrigatórios. Quantidade não pode ser negativa.');
      return;
    }
    setEnviando(true);
    try {
      const novoProduto = {
        nome_produto: nomeProduto,
        quantidade_estoque: parseInt(quantidadeEstoque, 10),
        preco_venda_padrao: parseFloat(precoVenda),
        descricao: descricao,
        preco_custo_medio: precoCusto ? parseFloat(precoCusto) : null, // 👈 Incluir novo campo
        fornecedor_principal: fornecedor || null, // 👈 Incluir novo campo
        // Adicione outros campos aqui
      };
      const produtoCriado = await createProduto(novoProduto);
      setSucesso(`Produto "${produtoCriado.nome_produto}" cadastrado com sucesso!`);
      // Limpa o formulário
      setNomeProduto('');
      setQuantidadeEstoque(0);
      setPrecoVenda('');
      setDescricao('');
      setPrecoCusto(''); // 👈 Limpar novo campo
      setFornecedor(''); // 👈 Limpar novo campo
      if (onProdutoCriado) {
        onProdutoCriado(produtoCriado);
      }
    } catch (error) {
      setErro(error.response?.data?.erro || 'Falha ao cadastrar produto. Tente novamente.');
    }
    setEnviando(false);
  };

  return (
    <form onSubmit={handleSubmit} className="produto-form" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Cadastrar Novo Produto/Peça</h3>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
      <div>
        <label htmlFor="nomeProduto">Nome do Produto/Peça:</label>
        <input type="text" id="nomeProduto" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="quantidadeEstoque">Quantidade em Estoque:</label>
        <input type="number" id="quantidadeEstoque" value={quantidadeEstoque} onChange={(e) => setQuantidadeEstoque(e.target.value)} required min="0" />
      </div>
      <div>
        <label htmlFor="precoCusto">Preço de Custo (R$):</label> {/* 👈 Novo campo */}
        <input type="number" id="precoCusto" value={precoCusto} onChange={(e) => setPrecoCusto(e.target.value)} step="0.01" min="0" />
      </div>
      <div>
        <label htmlFor="precoVenda">Preço de Venda (R$):</label>
        <input type="number" id="precoVenda" value={precoVenda} onChange={(e) => setPrecoVenda(e.target.value)} required step="0.01" min="0" />
      </div>
      <div>
        <label htmlFor="fornecedor">Fornecedor Principal:</label> {/* 👈 Novo campo */}
        <input type="text" id="fornecedor" value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} />
      </div>
      <div>
        <label htmlFor="descricao">Descrição:</label>
        <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </div>
      {/* Você pode adicionar mais campos aqui como:
          Código Interno, Unidade de Medida, Estoque Mínimo, Localização no Estoque, Data da Última Compra
      */}
      <button type="submit" disabled={enviando}>
        {enviando ? 'Salvando...' : 'Salvar Produto'}
      </button>
    </form>
  );
}

export default ProdutoForm;