// frontend/src/App.jsx
import React from 'react';
// Importe NavLink em vez de apenas Link, ou junto com Link se usar ambos
import { Routes, Route, NavLink, Link } from 'react-router-dom';
import ClientesPage from './pages/ClientesPage';
import ProdutosPage from './pages/ProdutosPage';
import OrdensServicoPage from './pages/OrdensServicoPage';
import CaixaPage from './pages/CaixaPage';
import RelatoriosPage from './pages/RelatoriosPage';

// ... (Componente PixCafezinho se existir) ...

function App() {
  return (
    <div className="App">
      <header className="app-header"> {/* Adicionada uma classe para estilização */}
        <div className="logo-title">
          {/* Você pode até colocar um logo pequeno aqui no futuro */}
          <h1>Minha Loja - Gestão</h1>
        </div>
        <nav className="app-nav">
          <ul>
            {/* Usando NavLink para o estilo 'active' */}
            <li><NavLink to="/" className="nav-button" end>Dashboard</NavLink></li>
            <li><NavLink to="/clientes" className="nav-button">Clientes</NavLink></li>
            <li><NavLink to="/produtos" className="nav-button">Produtos</NavLink></li>
            <li><NavLink to="/ordens-servico" className="nav-button">Ordens de Serviço</NavLink></li>
            <li><NavLink to="/caixa" className="nav-button">Controle de Caixa</NavLink></li>
            <li><NavLink to="/relatorios" className="nav-button">Relatórios</NavLink></li>
          </ul>
        </nav>
      </header>

      <main style={{ padding: '20px', minHeight: 'calc(100vh - 180px)' }}> {/* Ajuste o minHeight se o header/footer mudarem de tamanho */}
        <Routes>
          <Route path="/" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2>Bem-vindo ao Sistema de Gestão!</h2>
              <p>Selecione uma opção no menu acima para começar.</p>
            </div>
          } />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/produtos" element={<ProdutosPage />} />
          <Route path="/ordens-servico" element={<OrdensServicoPage />} />
          <Route path="/caixa" element={<CaixaPage />} />
          <Route path="/relatorios" element={<RelatoriosPage />} />
          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2>Página Não Encontrada (Erro 404)</h2>
              <p>A página que você está procurando não existe.</p>
              <Link to="/" className="nav-button" style={{marginTop: '20px', display: 'inline-block'}}>Voltar para o Dashboard</Link>
            </div>
          } />
        </Routes>
      </main>

      {/* <PixCafezinho /> */}
      <footer className="app-footer"> {/* Adicionada uma classe */}
        <p>&copy; {new Date().getFullYear()} Minha Loja - Sistema de Gestão. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;