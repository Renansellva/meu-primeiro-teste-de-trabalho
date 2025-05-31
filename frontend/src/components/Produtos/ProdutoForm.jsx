// frontend/src/components/Produtos/ProdutoForm.jsx
import React, { useState, useEffect } from 'react';
// Certifique-se que updateProduto está sendo importado se for usar aqui, ou que onProdutoSalvo lide com isso.
import { createProduto, updateProduto } from '../../services/apiProduto';

// Novas props: produtoParaEditar, onEdicaoCancelada
// Renomeamos onProdutoCriado para onProdutoSalvo para ser mais genérico
function ProdutoForm({ onProdutoSalvo, produtoParaEditar, onEdicaoCancelada }) {
  const [nomeProduto, setNomeProduto] = useState('');
  const [quantidadeEstoque, setQuantidadeEstoque] = useState(''); // Começar como string para o input
  const [precoCusto, setPrecoCusto] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [codigoInterno, setCodigoInterno] = useState('');
  // Adicione mais estados para outros campos: unidade_medida, estoque_minimo, localizacao_estoque, data_ultima_compra

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const ehModoEdicao = Boolean(produtoParaEditar); // Verifica se estamos editando

  // Efeito para preencher o formulário quando produtoParaEditar mudar
  useEffect(() => {
    if (produtoParaEditar) {
      setNomeProduto(produtoParaEditar.nome_produto || '');
      setCodigoInterno(produtoParaEditar.codigo_interno || '');
      setQuantidadeEstoque(produtoParaEditar.quantidade_estoque !== null ? String(produtoParaEditar.quantidade_estoque) : '');
      setPrecoCusto(produtoParaEditar.preco_custo_medio !== null ? String(produtoParaEditar.preco_custo_medio) : '');
      setPrecoVenda(produtoParaEditar.preco_venda_padrao !== null ? String(produtoParaEditar.preco_venda_padrao) : '');
      setFornecedor(produtoParaEditar.fornecedor_principal || '');
      setDescricao(produtoParaEditar.descricao || '');
      // Preencha outros estados aqui
      setSucesso(''); // Limpa mensagens de sucesso anteriores
      setErro('');   // Limpa mensagens de erro anteriores
    } else {
      // Se não há produto para editar (modo de criação ou cancelou edição), limpa o formulário
      setNomeProduto('');
      setCodigoInterno('');
      setQuantidadeEstoque('');
      setPrecoCusto('');
      setPrecoVenda('');
      setFornecedor('');
      setDescricao('');
      // Limpe outros estados aqui
    }
  }, [produtoParaEditar]); // Este efeito roda sempre que produtoParaEditar mudar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!nomeProduto || String(quantidadeEstoque).trim() === '' || !precoVenda) {
      setErro('Nome do produto, quantidade e preço de venda são obrigatórios.');
      return;
    }

    const qtdEstoqueNum = parseInt(quantidadeEstoque, 10);
    if (isNaN(qtdEstoqueNum) || qtdEstoqueNum < 0) {
      setErro('Quantidade em estoque deve ser um número não negativo.');
      return;
    }

    setEnviando(true);
    try {
      const dadosProduto = {
        nome_produto: nomeProduto,
        codigo_interno: codigoInterno || null,
        quantidade_estoque: qtdEstoqueNum,
        preco_custo_medio: precoCusto ? parseFloat(precoCusto) : null,
        preco_venda_padrao: parseFloat(precoVenda),
        fornecedor_principal: fornecedor || null,
        descricao: descricao,
        // Adicione outros campos aqui
      };

      if (ehModoEdicao) {
        // Modo Edição: chama updateProduto
        const produtoAtualizado = await updateProduto(produtoParaEditar.id, dadosProduto);
        setSucesso(`Produto "${produtoAtualizado.nome_produto}" atualizado com sucesso!`);
      } else {
        // Modo Criação: chama createProduto
        const produtoCriado = await createProduto(dadosProduto);
        setSucesso(`Produto "${produtoCriado.nome_produto}" cadastrado com sucesso!`);
      }

      if (onProdutoSalvo) {
        onProdutoSalvo(); // Notifica o componente pai para atualizar a lista e limpar o modo edição
      }
      // Não limpa o formulário aqui se for modo edição, o useEffect cuidará disso quando produtoParaEditar mudar para null

    } catch (error) {
      setErro(error.response?.data?.erro || `Falha ao ${ehModoEdicao ? 'atualizar' : 'cadastrar'} produto.`);
    }
    setEnviando(false);
  };

  return (
    <form onSubmit={handleSubmit} className="produto-form" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>{ehModoEdicao ? 'Editar Produto/Peça' : 'Cadastrar Novo Produto/Peça'}</h3>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}

      {/* Campos do formulário - adicione todos os campos que você quer editar */}
      <div>
        <label htmlFor="nomeProduto">Nome do Produto/Peça:</label>
        <input type="text" id="nomeProduto" value={nomeProduto} onChange={(e) => setNomeProduto(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="codigoInterno">Código Interno:</label>
        <input type="text" id="codigoInterno" value={codigoInterno} onChange={(e) => setCodigoInterno(e.target.value)} />
      </div>
      <div>
        <label htmlFor="quantidadeEstoque">Quantidade em Estoque:</label>
        <input type="number" id="quantidadeEstoque" value={quantidadeEstoque} onChange={(e) => setQuantidadeEstoque(e.target.value)} required min="0" />
      </div>
      <div>
        <label htmlFor="precoCusto">Preço de Custo (R$):</label>
        <input type="number" id="precoCusto" value={precoCusto} onChange={(e) => setPrecoCusto(e.target.value)} step="0.01" min="0" />
      </div>
      <div>
        <label htmlFor="precoVenda">Preço de Venda (R$):</label>
        <input type="number" id="precoVenda" value={precoVenda} onChange={(e) => setPrecoVenda(e.target.value)} required step="0.01" min="0" />
      </div>
      <div>
        <label htmlFor="fornecedor">Fornecedor Principal:</label>
        <input type="text" id="fornecedor" value={fornecedor} onChange={(e) => setFornecedor(e.target.value)} />
      </div>
      <div>
        <label htmlFor="descricao">Descrição:</label>
        <textarea id="descricao" value={descricao} onChange={(e) => setDescricao(e.target.value)} />
      </div>

      <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
        <button type="submit" className="btn-enviar" disabled={enviando}>
          {enviando ? (ehModoEdicao ? 'Salvando Alterações...' : 'Salvando...') : (ehModoEdicao ? 'Salvar Alterações' : 'Salvar Produto')}
        </button>
        {ehModoEdicao && (
          <button type="button" onClick={onEdicaoCancelada} className="button" style={{ backgroundColor: '#6c757d' }}>
            Cancelar Edição
          </button>
        )}
      </div>
    </form>
  );
}

export default ProdutoForm;