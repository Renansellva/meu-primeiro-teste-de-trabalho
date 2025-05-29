// frontend/src/components/Clientes/ClienteList.jsx
import React from 'react';
import { deleteCliente } from '../../services/apiCliente'; // Importa a função

// Props:
// clientes (array de clientes para listar)
// onClienteDeletado (função para ser chamada após deletar um cliente, para atualizar a lista na ClientesPage)
function ClienteList({ clientes, onClienteDeletado }) {
  if (!clientes || clientes.length === 0) {
    return <p>Nenhum cliente cadastrado ainda.</p>;
  }

  const handleDelete = async (id, nome) => {
    // Confirmação antes de deletar
    if (window.confirm(`Tem certeza que deseja deletar o cliente "${nome}" (ID: ${id})?`)) {
      try {
        await deleteCliente(id);
        alert(`Cliente "${nome}" deletado com sucesso!`);
        if (onClienteDeletado) {
          onClienteDeletado(id); // Notifica o componente pai que um cliente foi deletado
        }
      } catch (error) {
        alert('Falha ao deletar cliente. Verifique o console.');
        console.error("Erro ao deletar cliente no componente:", error);
      }
    }
  };

  return (
    <div className="cliente-list">
      <h3>Clientes Cadastrados</h3>
      <ul style={{ listStyleType: 'none', padding: 0 }}>
        {clientes.map(cliente => (
          <li key={cliente.id} style={{ border: '1px solid #eee', padding: '10px', marginBottom: '10px', borderRadius: '4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <strong>{cliente.nome_completo}</strong> (ID: {cliente.id})<br />
              Telefone: {cliente.telefone_principal}<br />
              Email: {cliente.email || 'N/A'}<br />
              Endereço: {cliente.endereco_rua_numero || 'N/A'}
            </div>
            <div>
              {/* Botão Editar virá aqui no futuro */}
              <button
                onClick={() => handleDelete(cliente.id, cliente.nome_completo)}
                style={{ backgroundColor: '#e53e3e', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer', marginLeft: '10px' }}
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

export default ClienteList;