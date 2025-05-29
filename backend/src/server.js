// backend/src/server.js
import app from './app.js';

const PORT = process.env.PORT || 3001; // Usaremos uma porta diferente do frontend (ex: 3001)

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend rodando na porta ${PORT}`);
});