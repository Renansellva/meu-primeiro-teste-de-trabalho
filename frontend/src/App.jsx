// frontend/src/App.jsx
import React from 'react';
import ClientesPage from './pages/ClientesPage';
// Importe seu CSS principal se ainda não o fez no main.jsx
// import './index.css'; // ou './App.css' ou './styles/global.css'

function App() {
  return (
    <div className="App">
      {/* No futuro, aqui você pode ter um Layout com Navbar, Sidebar, etc. */}
      <header style={{ background: '#232946', color: 'white', padding: '10px 20px', textAlign: 'center' }}>
        <h1>Minha Loja - Sistema de Gestão</h1>
      </header>
      <main>
        <ClientesPage />
        {/* Outras páginas viriam aqui através de um sistema de rotas */}
      </main>
      {/* <PixCafezinho /> Se você tiver este componente e quiser mantê-lo global */}
    </div>
  );
}

export default App;