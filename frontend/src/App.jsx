// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientesPage from './pages/ClientesPage';
import ProdutosPage from './pages/ProdutosPage'; // 👈 Importar a nova página
// Importe aqui outras páginas no futuro (ex: OrdensServicoPage, CaixaPage)

// import './style.css'; // Se o seu CSS principal estiver aqui

// Componente PixCafezinho (se você o tiver)
function PixCafezinho() {
  return (
    <div className="pix-cafezinho">
      <img src="/pixQrCode.jpeg" alt="QR Code Pix para um cafezinho" />
      <span>Pix para um cafezinho ☕</span>
    </div>
  );
}


function App() {
  return (
    <div className="App">
      <header style={{ background: '#1a1c29', color: 'white', padding: '15px 30px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}>
        <h1 style={{ margin: 0, fontSize: '1.8em' }}>Minha Loja - Gestão</h1>
        <nav>
          <ul style={{ listStyle: 'none', padding: 0, margin: '10px 0 0 0', display: 'flex', gap: '20px' }}>
            <li><Link to="/" style={{ color: '#30e88b', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard (Início)</Link></li>
            <li><Link to="/clientes" style={{ color: '#30e88b', textDecoration: 'none', fontWeight: 'bold' }}>Clientes</Link></li>
            <li><Link to="/produtos" style={{ color: '#30e88b', textDecoration: 'none', fontWeight: 'bold' }}>Produtos</Link></li>
            {/* Adicione links para Ordens de Serviço, Caixa, etc. aqui */}
          </ul>
        </nav>
      </header>

      <main style={{ padding: '0 20px' }}>
        <Routes>
          {/* A rota "/" pode ser um DashboardPage no futuro */}
          <Route path="/" element={<div><h2>Bem-vindo ao Sistema!</h2><p>Selecione uma opção no menu acima.</p></div>} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          {/* Defina outras rotas aqui */}
        </Routes>
      </main>

      {/* <PixCafezinho /> */} {/* Se quiser manter o PixCafezinho, descomente e certifique-se que o componente está definido */}
    </div>
  );
}

export default App;