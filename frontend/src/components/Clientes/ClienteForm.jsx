// frontend/src/components/Clientes/ClienteForm.jsx
import React, { useState } from 'react';
import { createCliente } from '../../services/apiCliente';

// Props: onClienteCriado (função para ser chamada após criar um cliente, para atualizar a lista)
function ClienteForm({ onClienteCriado }) {
  const [nomeCompleto, setNomeCompleto] = useState('');
  const [telefonePrincipal, setTelefonePrincipal] = useState('');
  const [email, setEmail] = useState('');
  const [endereco, setEndereco] = useState(''); // Simplificado para um campo por enquanto
  const [observacoes, setObservacoes] = useState('');
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!nomeCompleto || !telefonePrincipal) {
      setErro('Nome completo e telefone principal são obrigatórios.');
      return;
    }
    setEnviando(true);
    try {
      const novoCliente = {
        nome_completo: nomeCompleto,
        telefone_principal: telefonePrincipal,
        email: email,
        // Para simplificar, vamos juntar o endereço aqui, mas o ideal seria ter campos separados
        endereco_rua_numero: endereco,
        observacoes: observacoes,
      };
      const clienteCriado = await createCliente(novoCliente);
      setSucesso(`Cliente "${clienteCriado.nome_completo}" cadastrado com sucesso!`);
      // Limpa o formulário
      setNomeCompleto('');
      setTelefonePrincipal('');
      setEmail('');
      setEndereco('');
      setObservacoes('');
      if (onClienteCriado) {
        onClienteCriado(clienteCriado); // Notifica o componente pai
      }
    } catch (error) {
      setErro(error.response?.data?.erro || 'Falha ao cadastrar cliente. Tente novamente.');
    }
    setEnviando(false);
  };

  return (
    <form onSubmit={handleSubmit} className="cliente-form" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Cadastrar Novo Cliente</h3>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
      <div>
        <label htmlFor="nomeCompleto">Nome Completo:</label>
        <input type="text" id="nomeCompleto" value={nomeCompleto} onChange={(e) => setNomeCompleto(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="telefonePrincipal">Telefone Principal:</label>
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
        <textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} />
      </div>
      <button type="submit" disabled={enviando}>
        {enviando ? 'Salvando...' : 'Salvar Cliente'}
      </button>
    </form>
  );
}

export default ClienteForm;