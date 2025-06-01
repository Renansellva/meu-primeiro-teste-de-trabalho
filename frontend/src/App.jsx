// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientesPage from './pages/ClientesPage';
import ProdutosPage from './pages/ProdutosPage';
import OrdensServicoPage from './pages/OrdensServicoPage';
import RelatoriosPage from './pages/RelatoriosPage'; // Importa a página de Relatórios

// ... (Componente PixCafezinho se existir) ...

function App() {
  return (
    <div className="App">
      <header style={{ background: '#1a1c29', /* ... */ }}>
        <h1 style={{ margin: 0, /* ... */ }}>Minha Loja - Gestão</h1>
        <nav style={{ marginTop: '10px' }}>
          <ul style={{ listStyle: 'none', /* ... */ display: 'flex', gap: '10px' }}>
            <li><Link to="/" className="nav-button">Dashboard</Link></li>
            <li><Link to="/clientes" className="nav-button">Clientes</Link></li>
            <li><Link to="/produtos" className="nav-button">Produtos</Link></li>
            <li><Link to="/ordens-servico" className="nav-button">Ordens de Serviço</Link></li>
            <li><Link to="/relatorios" className="nav-button">Relatórios</Link></li> {/* Link para Relatórios */}
          </ul>
        </nav>
      </header>

      <main style={{ padding: '0 20px 20px 20px' }}>
        <Routes>
          <Route path="/" element={<div><h2>Bem-vindo ao Sistema!</h2><p>Selecione uma opção no menu.</p></div>} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/ordens-servico" element={<OrdensServicoPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} /> {/* Rota para Relatórios */}
        </Routes>
      </main>

      {/* <PixCafezinho /> */}
      <footer style={{ textAlign: 'center', /* ... */ }}>
        <p>&copy; {new Date().getFullYear()} Minha Loja - Sistema de Gestão</p>
      </footer>
    </div>
  );
}

export default App;