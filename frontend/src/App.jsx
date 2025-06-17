// frontend/src/App.jsx
import React, { useState } from 'react'; // Adicionei useState para o exemplo de logout
import { Routes, Route, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';

// Importação das Páginas
import ClientesPage from './pages/ClientesPage';
import ProdutosPage from './pages/ProdutosPage';
import OrdensServicoPage from './pages/OrdensServicoPage';
import CaixaPage from './pages/CaixaPage';
import RelatoriosPage from './pages/RelatoriosPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage'; // 👈 Importar a nova página

// Funções de Auth de exemplo (se você as moveu para um serviço, importe de lá)
const checkAuth = () => !!localStorage.getItem('usuarioLogado');
const handleLogoutFromApp = (navigate) => {
  localStorage.removeItem('usuarioLogado');
  navigate('/login');
};

// Componente para Rotas Protegidas
function RotaProtegida({ children, onLogout }) {
  if (!checkAuth()) {
    // Se não estiver autenticado, redireciona para o login
    return <Navigate to="/login" />;
  }
  return children;
}


function App() {
  // O estado de login pode ser gerenciado de forma mais robusta com Context API no futuro
  const [autenticado, setAutenticado] = useState(checkAuth());
  const navigate = useNavigate();

  const onLoginSuccess = () => {
    setAutenticado(true);
    navigate('/'); // Navega para o dashboard após login
  };

  const onLogout = () => {
    handleLogoutFromApp(navigate);
    setAutenticado(false);
  };
  
  if (!autenticado) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage onLoginSuccess={onLoginSuccess} />} />
        {/* Qualquer outra rota redireciona para o login se não estiver autenticado */}
        <Route path="*" element={<Navigate to="/login" />} /> 
      </Routes>
    );
  }

  // Layout principal para quando o usuário está autenticado
  return (
    <div className="App">
      <header className="app-header">
        <div className="logo-title">
          <h1>Minha Loja - Gestão</h1>
        </div>
        <nav className="app-nav">
          <ul>
            <li><Link to="/" className="nav-button">Dashboard</Link></li>
            <li><Link to="/clientes" className="nav-button">Clientes</Link></li>
            <li><Link to="/produtos" className="nav-button">Produtos</Link></li>
            <li><Link to="/ordens-servico" className="nav-button">Ordens de Serviço</Link></li>
            <li><Link to="/caixa" className="nav-button">Controle de Caixa</Link></li>
            <li><Link to="/relatorios" className="nav-button">Relatórios</Link></li>
          </ul>
        </nav>
        <div style={{textAlign: 'right'}}>
            <span style={{marginRight: '15px', fontSize: '0.9em'}}>Olá, nordeste!</span>
            <button onClick={onLogout} className="nav-button" style={{backgroundColor: '#6c757d'}}>Sair</button>
        </div>
      </header>

      <main style={{ padding: '20px', minHeight: 'calc(100vh - 180px)' }}>
        <Routes>
          {/* A rota "/" agora renderiza a DashboardPage */}
          <Route path="/" element={<RotaProtegida onLogout={onLogout}><DashboardPage /></RotaProtegida>} />
          
          <Route path="/clientes" element={<RotaProtegida onLogout={onLogout}><ClientesPage /></RotaProtegida>} />
          <Route path="/produtos" element={<RotaProtegida onLogout={onLogout}><ProdutosPage /></RotaProtegida>} />
          <Route path="/ordens-servico" element={<RotaProtegida onLogout={onLogout}><OrdensServicoPage /></RotaProtegida>} />
          <Route path="/caixa" element={<RotaProtegida onLogout={onLogout}><CaixaPage /></RotaProtegida>} />
          <Route path="/relatorios" element={<RotaProtegida onLogout={onLogout}><RelatoriosPage /></RotaProtegida>} />
          
          {/* Se já estiver logado, a rota de login redireciona para o dashboard */}
          <Route path="/login" element={<Navigate to="/" />} />

          <Route path="*" element={
            <div style={{ textAlign: 'center', marginTop: '50px' }}>
              <h2>Página Não Encontrada (Erro 404)</h2>
              <p>A página que você está procurando não existe.</p>
              <Link to="/" className="nav-button" style={{marginTop: '20px', display: 'inline-block'}}>Voltar para o Dashboard</Link>
            </div>
          } />
        </Routes>
      </main>

      <footer className="app-footer">
        <p>&copy; {new Date().getFullYear()} Minha Loja - Sistema de Gestão. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

export default App;