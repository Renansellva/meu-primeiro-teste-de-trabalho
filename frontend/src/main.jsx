// frontend/src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // 👈 Importar
import './style.css'; // Ou o seu arquivo CSS principal

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter> {/* 👈 Envolver o App com BrowserRouter */}
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);