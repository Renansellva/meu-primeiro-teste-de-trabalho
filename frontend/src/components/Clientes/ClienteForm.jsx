// frontend/src/components/Clientes/ClienteForm.jsx
import React, { useState, useEffect } from 'react';
import { createCliente, updateCliente } from '../../services/apiCliente';
import toast from 'react-hot-toast'; // Vamos usar toast para feedback!

function ClienteForm({ onClienteSalvo, clienteParaEditar, onEdicaoCancelada }) {
  // Estados para os campos do formulário
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefonePrincipal, setTelefonePrincipal] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState('');
  const [observacoes, setObservacoes] = useState('');
  
  const [enviando, setEnviando] = useState(false);

  const ehModoEdicao = Boolean(clienteParaEditar && clienteParaEditar.id);

  const limparFormulario = () => {
    setNomeCompleto('');
    setTelefonePrincipal('');
    setEmail('');
    setEndereco('');
    setObservacoes('');
  };

  // Efeito para preencher o formulário quando um cliente for selecionado para edição
  useEffect(() => {
    if (ehModoEdicao) {
      setNomeCompleto(clienteParaEditar.nome_completo || '');
      setTelefonePrincipal(clienteParaEditar.telefone_principal || '');
      setEmail(clienteParaEditar.email || '');
      setEndereco(clienteParaEditar.endereco_rua_numero || ''); // Ajuste para o campo de endereço que você usa
      setObservacoes(clienteParaEditar.observacoes || '');
    } else {
      limparFormulario();
    }
  }, [clienteParaEditar, ehModoEdicao]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nomeCompleto || !telefonePrincipal) {
      toast.error('Nome completo e telefone principal são obrigatórios.');
      return;
    }
    setEnviando(true);
    
    const dadosCliente = {
      nome_completo: nomeCompleto,
      telefone_principal: telefonePrincipal,
      email: email || null,
      endereco_rua_numero: endereco || null, // Ajuste para os campos de endereço do seu backend
      observacoes: observacoes || null,
    };

    try {
      if (ehModoEdicao) {
        const clienteAtualizado = await updateCliente(clienteParaEditar.id, dadosCliente);
        toast.success(`Cliente "${clienteAtualizado.nome_completo}" atualizado com sucesso!`);
      } else {
        const clienteCriado = await createCliente(dadosCliente);
        toast.success(`Cliente "${clienteCriado.nome_completo}" cadastrado com sucesso!`);
      }
      if (onClienteSalvo) {
        onClienteSalvo(); // Avisa a página pai para recarregar a lista e limpar o modo edição
      }
    } catch (error) {
      const erroMsg = error.response?.data?.erro || `Falha ao ${ehModoEdicao ? 'atualizar' : 'cadastrar'} cliente.`;
      toast.error(erroMsg);
    }
    setEnviando(false);
  };

  return (
    <div className="form-section"> {/* Usando a classe genérica de formulário */}
      <form onSubmit={handleSubmit}>
        <h3>{ehModoEdicao ? `Editando Cliente: ${clienteParaEditar.nome_completo}` : 'Cadastrar Novo Cliente'}</h3>
        
        <div>
          <label htmlFor="nomeCompleto">Nome Completo:*</label>
          <input type="text" id="nomeCompleto" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="telefonePrincipal">Telefone Principal:*</label>
          <input type="text" id="telefonePrincipal" value={telefonePrincipal} onChange={(e) => setTelefonePrincipal(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label htmlFor="endereco">Endereço (Rua, Número):</label>
          <input type="text" id="endereco" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
        </div>
        <div>
          <label htmlFor="observacoes">Observações:</label>
          <textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows="3" />
        </div>
        
        <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
          <button type="submit" disabled={enviando} className="btn-enviar">
            {enviando ? (ehModoEdicao ? 'Salvando...' : 'Salvando...') : (ehModoEdicao ? 'Salvar Alterações' : 'Salvar Cliente')}
          </button>
          {ehModoEdicao && (
            <button type="button" onClick={onEdicaoCancelada} className="button" style={{ backgroundColor: '#6c757d' }}>
              Cancelar Edição
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default ClienteForm;