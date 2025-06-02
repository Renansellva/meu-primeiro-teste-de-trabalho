// frontend/src/components/Caixa/MovimentacaoCaixaForm.jsx
import React, { useState } from 'react';
import { createMovimentacaoCaixa } from '../../services/apiCaixa';

function MovimentacaoCaixaForm({ onMovimentacaoCriada }) {
  const [descricao, setDescricao] = useState('');
  const [valor, setValor] = useState('');
  const [tipoMovimentacao, setTipoMovimentacao] = useState('Saída'); // Default para Saída (despesa)
  const [dataMovimentacao, setDataMovimentacao] = useState(new Date().toISOString().split('T')[0]); // Default para hoje
  const [categoria, setCategoria] = useState('');
  const [observacoes, setObservacoes] = useState('');

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const limparFormulario = () => {
    setDescricao('');
    setValor('');
    setTipoMovimentacao('Saída');
    setDataMovimentacao(new Date().toISOString().split('T')[0]);
    setCategoria('');
    setObservacoes('');
    setErro('');
    setSucesso('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!descricao || !valor || !tipoMovimentacao || !dataMovimentacao) {
      setErro('Descrição, valor, tipo e data da movimentação são obrigatórios.');
      return;
    }
    if (parseFloat(valor) <= 0) {
      setErro('O valor da movimentação deve ser positivo.');
      return;
    }

    setEnviando(true);
    try {
      const novaMovimentacao = {
        descricao,
        tipo_movimentacao: tipoMovimentacao,
        valor: parseFloat(valor),
        data_movimentacao: dataMovimentacao, // O backend espera YYYY-MM-DD ou YYYY-MM-DDTHH:mm:ss
        categoria: categoria || null,
        observacoes: observacoes || null,
        // cliente_id e ordem_servico_id não são preenchidos por este formulário manual simples
      };
      const movimentacaoCriada = await createMovimentacaoCaixa(novaMovimentacao);
      setSucesso(`Movimentação de "${movimentacaoCriada.tipo_movimentacao}" no valor de R$ ${parseFloat(movimentacaoCriada.valor).toFixed(2)} registrada com sucesso!`);
      limparFormulario();
      if (onMovimentacaoCriada) {
        onMovimentacaoCriada(movimentacaoCriada);
      }
    } catch (error) {
      setErro(error.response?.data?.erro || 'Falha ao registrar movimentação.');
    }
    setEnviando(false);
  };

  return (
    <form onSubmit={handleSubmit} className="caixa-form" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)' }}>
      <h3 style={{color: '#30e88b', marginTop: 0, marginBottom: '20px'}}>Registrar Nova Movimentação no Caixa</h3>
      {erro && <p style={{ color: '#ff8a8a', background: '#4b2323', padding: '8px', borderRadius: '4px', marginBottom: '15px' }}>{erro}</p>}
      {sucesso && <p style={{ color: '#30e88b', background: '#223c29', padding: '8px', borderRadius: '4px', marginBottom: '15px' }}>{sucesso}</p>}
      
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px 20px'}}>
        <div>
          <label htmlFor="tipoMovimentacao">Tipo:*</label>
          <select id="tipoMovimentacao" value={tipoMovimentacao} onChange={(e) => setTipoMovimentacao(e.target.value)} required>
            <option value="Saída">Saída (Despesa)</option>
            <option value="Entrada">Entrada (Receita)</option>
          </select>
        </div>
        <div>
          <label htmlFor="dataMovimentacao">Data da Movimentação:*</label>
          <input type="date" id="dataMovimentacao" value={dataMovimentacao} onChange={(e) => setDataMovimentacao(e.target.value)} required />
        </div>
        <div style={{gridColumn: 'span 2'}}> {/* Ocupa duas colunas se possível */}
          <label htmlFor="descricaoCaixa">Descrição:*</label>
          <input type="text" id="descricaoCaixa" value={descricao} onChange={(e) => setDescricao(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="valorCaixa">Valor (R$):*</label>
          <input type="number" id="valorCaixa" value={valor} onChange={(e) => setValor(e.target.value)} required step="0.01" min="0.01" />
        </div>
        <div>
          <label htmlFor="categoriaCaixa">Categoria:</label>
          <input type="text" id="categoriaCaixa" value={categoria} onChange={(e) => setCategoria(e.target.value)} placeholder="Ex: Aluguel, Compra de Material, Receita Diversa" />
        </div>
        <div style={{gridColumn: 'span 2'}}>
          <label htmlFor="observacoesCaixa">Observações:</label>
          <textarea id="observacoesCaixa" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows="2" />
        </div>
      </div>
      <button type="submit" disabled={enviando} className="btn-enviar" style={{ marginTop: '20px' }}>
        {enviando ? 'Registrando...' : 'Registrar Movimentação'}
      </button>
    </form>
  );
}

export default MovimentacaoCaixaForm;