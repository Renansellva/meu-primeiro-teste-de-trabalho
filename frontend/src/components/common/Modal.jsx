// frontend/src/components/common/Modal.jsx
import React from 'react';

function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) {
    return null; // Não renderiza nada se não estiver aberto
  }

  return (
    // O 'modal-overlay' é o fundo escurecido
    <div className="modal-overlay" onClick={onClose}>
      {/* O 'modal-content' é a caixa branca onde o conteúdo fica.
          O e.stopPropagation() impede que um clique dentro do modal feche-o. */}
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">{title}</h3>
          <button className="modal-close-button" onClick={onClose}>
            &times; {/* Este é o caractere 'x' para fechar */}
          </button>
        </div>
        <div className="modal-body">
          {children} {/* Aqui é onde nosso formulário será renderizado */}
        </div>
      </div>
    </div>
  );
}

export default Modal;