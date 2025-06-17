// frontend/src/pages/DashboardPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
// Se você for usar ícones no futuro, pode importá-los aqui.
// import { FaPlusCircle, FaBoxes, FaCashRegister } from 'react-icons/fa';

function DashboardPage() {
  return (
    <div className="dashboard-page">
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Dashboard</h2>
      
      {/* Seção de Acessos Rápidos */}
      <div className="quick-actions-container">
        <Link to="/ordens-servico" className="quick-action-button">
          {/* <FaPlusCircle size={24} style={{ marginRight: '10px' }} /> */}
          <span>+ Nova Ordem de Serviço</span>
        </Link>
        
        <Link to="/produtos" className="quick-action-button">
          {/* <FaBoxes size={24} style={{ marginRight: '10px' }} /> */}
          <span>+ Novo Produto</span>
        </Link>
        
        <Link to="/caixa" className="quick-action-button">
          {/* <FaCashRegister size={24} style={{ marginRight: '10px' }} /> */}
          <span>+ Registrar Despesa/Saída</span>
        </Link>
      </div>

      {/* Seção de Resumos (a ser implementada no futuro) */}
      <div className="dashboard-summary" style={{marginTop: '50px'}}>
        <h3 style={{textAlign: 'center', color: '#aaa'}}>Resumos Rápidos (em breve)</h3>
        {/* Aqui entrarão os cartões para "OS Abertas", "Estoque Baixo", "Saldo do Caixa", etc. */}
      </div>
    </div>
  );
}

export default DashboardPage;