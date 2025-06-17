// frontend/src/pages/LoginPage.jsx
import React, { useState } from 'react';

// Props: onLoginSuccess é uma função que será chamada quando o login for bem-sucedido
function LoginPage({ onLoginSuccess }) {
  const [usuario, setUsuario] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  // A lógica de login acontece aqui, diretamente no frontend
  const handleSubmit = (e) => {
    e.preventDefault();
    setErro('');
    setCarregando(true);

    // Simula uma pequena demora, como se fosse uma chamada de API
    setTimeout(() => {
      // Verifica se o usuário e senha correspondem aos valores fixos
      if (usuario === 'nordeste' && senha === 'R1020ç') {
        // Deu certo!
        console.log("Login bem-sucedido!");
        // Guarda a informação de que o usuário está logado no localStorage do navegador
        localStorage.setItem('usuarioLogado', 'true');
        // Chama a função passada pelo App.jsx para atualizar o estado da aplicação
        onLoginSuccess();
      } else {
        // Deu errado!
        setErro('Usuário ou senha inválidos.');
      }
      setCarregando(false);
    }, 500); // 500ms de delay
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '400px', margin: 'auto', padding: '30px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)', boxShadow: '0 4px 15px rgba(0,0,0,0.2)' }}>
        <h2 style={{ textAlign: 'center', color: '#30e88b', marginBottom: '25px' }}>Login - Minha Loja</h2>
        <form onSubmit={handleSubmit}>
          {erro && <p style={{ color: '#ff8a8a', background: '#4b2323', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>{erro}</p>}
          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="usuario" style={{ display: 'block', marginBottom: '5px', color: '#c7d0f7' }}>Usuário:</label>
            <input
              type="text"
              id="usuario"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              // placeholder="nordeste"
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="senha" style={{ display: 'block', marginBottom: '5px', color: '#c7d0f7' }}>Senha:</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              // placeholder="R1020ç"
            />
          </div>
          <button type="submit" className="btn-enviar" style={{ width: '100%' }} disabled={carregando}>
            {carregando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;