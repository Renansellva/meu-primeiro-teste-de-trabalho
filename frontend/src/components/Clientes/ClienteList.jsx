// frontend/src/components/Clientes/ClienteList.jsx
import React from 'react';
import { deleteCliente } from '../../services/apiCliente';
import toast from 'react-hot-toast';

function ClienteList({ clientes, onClienteDeletado, onEditarCliente }) { // 👈 Nova prop onEditarCliente
  if (!clientes || clientes.length === 0) {
    return <p>Nenhum cliente cadastrado ainda.</p>;
  }

  const handleDelete = async (id, nome) => {
    if (window.confirm(`Tem certeza que deseja deletar o cliente "${nome}"?`)) {
      try {
        await deleteCliente(id);
        toast.success(`Cliente "${nome}" deletado com sucesso!`);
        if (onClienteDeletado) onClienteDeletado();
      } catch (error) {
        const erroMsg = error.response?.data?.erro || 'Falha ao deletar cliente.';
        toast.error(erroMsg);
      }
    }
  };

  return (
    <div className="cliente-list">
      <h3>Clientes Cadastrados</h3>
      <ul> {/* Sem estilo inline, usará CSS global */}
        {clientes.map(cliente => (
          <li key={cliente.id}> {/* Sem estilo inline, usará CSS global */}
            <div>
              <strong>{cliente.nome_completo}</strong> (ID: {cliente.id})<br />
              Telefone: {cliente.telefone_principal}<br />
              Email: {cliente.email || 'N/A'}<br />
              Endereço: {cliente.endereco_rua_numero || 'N/A'}
            </div>
            <div className="action-buttons"> {/* Container para os botões */}
              <button
                onClick={() => onEditarCliente(cliente)} // 👈 Chama a função passada pela página
                className="button"
                style={{ backgroundColor: '#ffc107', color: 'black' }}
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(cliente.id, cliente.nome_completo)}
                className="button"
                style={{ backgroundColor: '#e53e3e', color: 'white' }}
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