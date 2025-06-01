// frontend/src/App.jsx
import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import ClientesPage from './pages/ClientesPage';
import ProdutosPage from './pages/ProdutosPage';
import OrdensServicoPage from './pages/OrdensServicoPage';
import RelatoriosPage from './pages/RelatoriosPage'; // Importa a página de Relatórios

// Se você tiver estilos globais que quer aplicar aqui ou no main.jsx
// import './style.css'; // ou o nome do seu arquivo CSS principal

// Componente PixCafezinho (opcional, você pode remover se não for usar)
function PixCafezinho() {
  return (
    <div className="pix-cafezinho">
      {/* Certifique-se que esta imagem está na pasta /public */}
      <img src="/pixQrCode.jpeg" alt="QR Code Pix para um cafezinho" />
      <span>Pix para um cafezinho ☕</span>
    </div>
  );
}

function App() { // A função principal do seu aplicativo
  return (
    <div className="App">
      <header style={{
        background: '#1a1c29', // Um tom escuro para o cabeçalho
        color: 'white',
        padding: '15px 30px',
        marginBottom: '20px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.25)' // Sombra mais suave
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8em', textAlign: 'left' }}>Minha Loja - Gestão</h1>
        <nav style={{ marginTop: '10px' }}>
          <ul style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexWrap: 'wrap', // Permite que os botões quebrem linha em telas menores
            justifyContent: 'flex-start', // Alinha à esquerda
            gap: '10px' // Espaço entre os botões
          }}>
            <li><Link to="/" className="nav-button">Dashboard</Link></li>
            <li><Link to="/clientes" className="nav-button">Clientes</Link></li>
            <li><Link to="/produtos" className="nav-button">Produtos</Link></li>
            <li><Link to="/ordens-servico" className="nav-button">Ordens de Serviço</Link></li>
            <li><Link to="/relatorios" className="nav-button">Relatórios</Link></li>
            {/* Adicione mais links de navegação aqui no futuro */}
          </ul>
        </nav>
      </header>

      <main style={{ padding: '0 20px 20px 20px' }}> {/* Adicionado padding inferior */}
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
          <Route path="/relatorios" element={<RelatoriosPage />} />
          {/* Defina outras rotas para os módulos de Caixa, etc. aqui */}
        </Routes>
      </main>

      {/* Se quiser manter o PixCafezinho, descomente a linha abaixo e garanta que o componente está definido */}
      {/* <PixCafezinho /> */}

      <footer style={{ textAlign: 'center', padding: '20px', marginTop: '40px', borderTop: '1px solid #333', color: '#aaa' }}>
        <p>&copy; {new Date().getFullYear()} Minha Loja - Sistema de Gestão</p>
      </footer>
    </div>
  );
}

export default App; // 👈 ESSA LINHA GARANTE A EXPORTAÇÃO PADRÃO