// backend/src/controllers/clienteController.js
import db from '../config/database.js';

// Função para CRIAR um novo cliente (você já tem esta)
export async function criarCliente(req, res) {
  const {
    nome_completo,
    telefone_principal,
    telefone_secundario,
    email,
    endereco_rua_numero,
    endereco_complemento,
    endereco_bairro,
    endereco_cidade,
    endereco_estado,
    endereco_cep,
    data_nascimento,
    observacoes
  } = req.body;

  if (!nome_completo || !telefone_principal) {
    return res.status(400).json({ erro: 'Nome completo e telefone principal são obrigatórios.' });
  }

  try {
    const [id] = await db('clientes').insert({
      nome_completo,
      telefone_principal,
      telefone_secundario,
      email,
      endereco_rua_numero,
      endereco_complemento,
      endereco_bairro,
      endereco_cidade,
      endereco_estado,
      endereco_cep,
      data_nascimento: data_nascimento || null,
      observacoes,
    }).returning('id');

    const novoCliente = await db('clientes').where({ id }).first();
    res.status(201).json(novoCliente);
  } catch (error) {
    console.error("Erro ao criar cliente:", error);
    res.status(500).json({ erro: 'Erro ao criar cliente no banco de dados.', detalhe: error.message });
  }
}

// Função para LISTAR todos os clientes (você já tem esta)
export async function listarClientes(req, res) {
  try {
    const clientes = await db('clientes').select('*');
    res.status(200).json(clientes);
  } catch (error) {
    console.error("Erro ao listar clientes:", error);
    res.status(500).json({ erro: 'Erro ao listar clientes do banco de dados.', detalhe: error.message });
  }
}

// --- NOVAS FUNÇÕES ABAIXO ---

// Função para BUSCAR um cliente pelo ID
export async function buscarClientePorId(req, res) {
  const { id } = req.params; // Pega o ID dos parâmetros da rota

  try {
    const cliente = await db('clientes').where({ id }).first(); // .first() pega o primeiro resultado

    if (cliente) {
      res.status(200).json(cliente);
    } else {
      res.status(404).json({ erro: 'Cliente não encontrado.' }); // Status 404 (Not Found)
    }
  } catch (error) {
    console.error("Erro ao buscar cliente:", error);
    res.status(500).json({ erro: 'Erro ao buscar cliente no banco de dados.', detalhe: error.message });
  }
}

// Função para ATUALIZAR um cliente
export async function atualizarCliente(req, res) {
  const { id } = req.params;
  const dadosAtualizados = req.body; // Pega todos os dados enviados no corpo

  // Remove campos que não devem ser atualizados diretamente ou que são indefinidos
  // (data_cadastro é automático, data_atualizacao será atualizado pelo Knex)
  delete dadosAtualizados.id;
  delete dadosAtualizados.data_cadastro;

  // Adiciona/atualiza o campo data_atualizacao
  dadosAtualizados.data_atualizacao = db.fn.now();

  // Validação básica (pode ser mais robusta)
  if (Object.keys(dadosAtualizados).length === 0 && dadosAtualizados.constructor === Object) {
      return res.status(400).json({ erro: 'Nenhum dado fornecido para atualização.' });
  }


  try {
    const atualizado = await db('clientes')
      .where({ id })
      .update(dadosAtualizados);

    if (atualizado) { // Knex update retorna o número de linhas afetadas
      const clienteAtualizado = await db('clientes').where({ id }).first();
      res.status(200).json(clienteAtualizado);
    } else {
      res.status(404).json({ erro: 'Cliente não encontrado para atualização.' });
    }
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error);
    // Verifica se o erro é devido a uma constraint unique (ex: email duplicado)
    if (error.code === 'SQLITE_CONSTRAINT' && error.message.includes('UNIQUE constraint failed: clientes.email')) {
        return res.status(409).json({ erro: 'O email fornecido já está em uso por outro cliente.', detalhe: error.message });
    }
    res.status(500).json({ erro: 'Erro ao atualizar cliente no banco de dados.', detalhe: error.message });
  }
}

// Função para DELETAR um cliente
export async function deletarCliente(req, res) {
  const { id } = req.params;

  try {
    const deletado = await db('clientes').where({ id }).del(); // .del() ou .delete()

    if (deletado) { // Knex delete retorna o número de linhas afetadas
      res.status(200).json({ mensagem: 'Cliente deletado com sucesso.' });
      // Ou, para um 'No Content' response: res.status(204).send();
    } else {
      res.status(404).json({ erro: 'Cliente não encontrado para deleção.' });
    }
  } catch (error) {
    console.error("Erro ao deletar cliente:", error);
    res.status(500).json({ erro: 'Erro ao deletar cliente no banco de dados.', detalhe: error.message });
  }
}