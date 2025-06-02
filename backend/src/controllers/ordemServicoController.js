// backend/src/controllers/ordemServicoController.js
import db from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

// Função para CRIAR uma nova Ordem de Serviço (MODIFICADA)
export async function criarOrdemServico(req, res) {
  const {
    cliente_id,
    tipo_equipamento,
    marca_equipamento,
    modelo_equipamento,
    defeito_relatado_cliente,
    valor_servico_mao_de_obra,
    // Campos opcionais já existentes...
    numero_serie_imei,
    acessorios_deixados,
    senha_equipamento,
    status_os = 'Orçamento',
    diagnostico_tecnico,
    servico_executado,
    // pecas_utilizadas (string descritiva será gerada),
    // valor_total_pecas (será calculado),
    valor_desconto = 0,
    observacoes_internas,
    servico_autorizado_cliente = false,
    data_previsao_entrega,
    data_orcamento,
    data_aprovacao_orcamento,
    garantia_servico,
    forma_pagamento,
    // Novo campo esperado do frontend: um array de peças
    pecasSelecionadas // Ex: [{ produto_id: 1, quantidade: 2, preco_venda_unitario_aplicado: 55.00 }, ...]
  } = req.body;

  if (!cliente_id || !tipo_equipamento || !marca_equipamento || !modelo_equipamento || !defeito_relatado_cliente || valor_servico_mao_de_obra === undefined) {
    return res.status(400).json({ erro: 'Campos obrigatórios faltando (cliente, equipamento, defeito, mão de obra).' });
  }

  const numero_os = `OS-${Date.now()}-${uuidv4().substring(0, 6).toUpperCase()}`;
  
  try {
    await db.transaction(async (trx) => {
      const clienteExistente = await trx('clientes').where({ id: cliente_id }).first();
      if (!clienteExistente) {
        const err = new Error('Cliente não encontrado com o ID fornecido.');
        err.status = 404; throw err;
      }

      let valorTotalPecasCalculado = 0;
      let descricaoPecasUtilizadas = []; // Para montar a string descritiva

      if (pecasSelecionadas && pecasSelecionadas.length > 0) {
        for (const pecaInfo of pecasSelecionadas) {
          if (!pecaInfo.produto_id || !pecaInfo.quantidade || pecaInfo.quantidade <= 0 || pecaInfo.preco_venda_unitario_aplicado === undefined) {
            const err = new Error('Dados inválidos para uma das peças selecionadas (produto_id, quantidade > 0, preco_venda_unitario_aplicado são obrigatórios).');
            err.status = 400; throw err;
          }

          const produtoNoEstoque = await trx('produtos_pecas').where({ id: pecaInfo.produto_id }).first();
          if (!produtoNoEstoque) {
            const err = new Error(`Produto/Peça com ID ${pecaInfo.produto_id} não encontrado no estoque.`);
            err.status = 404; throw err;
          }
          if (produtoNoEstoque.quantidade_estoque < pecaInfo.quantidade) {
            const err = new Error(`Estoque insuficiente para "${produtoNoEstoque.nome_produto}". Disponível: ${produtoNoEstoque.quantidade_estoque}, Solicitado: ${pecaInfo.quantidade}.`);
            err.status = 400; throw err;
          }

          // Dar baixa no estoque
          const novoEstoque = produtoNoEstoque.quantidade_estoque - pecaInfo.quantidade;
          await trx('produtos_pecas').where({ id: pecaInfo.produto_id }).update({
            quantidade_estoque: novoEstoque,
            data_atualizacao: db.fn.now()
          });

          // Adicionar ao valor total de peças e à descrição
          valorTotalPecasCalculado += parseFloat(pecaInfo.preco_venda_unitario_aplicado) * parseInt(pecaInfo.quantidade, 10);
          descricaoPecasUtilizadas.push(`${pecaInfo.quantidade}x ${produtoNoEstoque.nome_produto} (R$ ${parseFloat(pecaInfo.preco_venda_unitario_aplicado).toFixed(2)} cada)`);
        }
      }

      const valorTotalOSCalculado = (Number(valor_servico_mao_de_obra) + valorTotalPecasCalculado) - Number(valor_desconto);

      const [id] = await trx('ordens_de_servico').insert({
        cliente_id, numero_os, tipo_equipamento, marca_equipamento, modelo_equipamento,
        numero_serie_imei, defeito_relatado_cliente, acessorios_deixados, diagnostico_tecnico,
        servico_executado,
        pecas_utilizadas: descricaoPecasUtilizadas.join('; ') || null, // Salva a string descritiva
        valor_servico_mao_de_obra: parseFloat(valor_servico_mao_de_obra),
        valor_total_pecas: valorTotalPecasCalculado,
        valor_desconto: parseFloat(valor_desconto),
        valor_total_os: valorTotalOSCalculado,
        status_os, senha_equipamento, servico_autorizado_cliente,
        data_previsao_entrega: data_previsao_entrega || null,
        data_orcamento: data_orcamento || null,
        data_aprovacao_orcamento: data_aprovacao_orcamento || null,
        garantia_servico: garantia_servico || null,
        forma_pagamento: forma_pagamento || null,
        observacoes_internas
      }).returning('id');

      const novaOS = await trx('ordens_de_servico')
        .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
        .select('ordens_de_servico.*', 'clientes.nome_completo as nome_cliente')
        .where('ordens_de_servico.id', id)
        .first();
      res.status(201).json(novaOS);
    });
  } catch (error) {
    console.error("Erro ao criar Ordem de Serviço:", error);
    res.status(error.status || 500).json({ erro: error.message || 'Erro ao criar Ordem de Serviço.' });
  }
}


// Função para ATUALIZAR uma Ordem de Serviço existente (MODIFICADA)
export async function atualizarOrdemServico(req, res) {
  const { id } = req.params;
  const dadosEntrada = req.body; // Pode incluir `pecasSelecionadas` agora

  // ... (lógica de camposPermitidos e dadosParaAtualizar como antes, mas NÃO inclua pecasSelecionadas diretamente em dadosParaAtualizar)
  const camposPermitidos = [ /* ... como antes ... */
    'cliente_id', 'tipo_equipamento', 'marca_equipamento', 'modelo_equipamento',
    'numero_serie_imei', 'defeito_relatado_cliente', 'diagnostico_tecnico',
    'servico_executado', /* NÃO ATUALIZE 'pecas_utilizadas' e 'valor_total_pecas' diretamente aqui */
    'valor_servico_mao_de_obra', 'valor_desconto', 'status_os', 'observacoes_internas',
    'acessorios_deixados', 'senha_equipamento', 'servico_autorizado_cliente',
    'data_previsao_entrega', 'data_entrega_efetiva', 'data_orcamento',
    'data_aprovacao_orcamento', 'garantia_servico', 'forma_pagamento'
  ];
  const dadosParaAtualizar = {};
  let algumCampoValidoPresente = false;
  // ... (loop para popular dadosParaAtualizar com camposPermitidos) ...
  for (const campo of camposPermitidos) {
    if (dadosEntrada[campo] !== undefined) {
      dadosParaAtualizar[campo] = dadosEntrada[campo];
      algumCampoValidoPresente = true;
    }
  }

  // Se a intenção é apenas atualizar as peças, não precisa de outros campos válidos
  if (!algumCampoValidoPresente && (!dadosEntrada.pecasSelecionadas || dadosEntrada.pecasSelecionadas.length === 0)) {
    return res.status(400).json({ erro: 'Nenhum dado válido fornecido para atualização.' });
  }
  
  dadosParaAtualizar.data_atualizacao_os = db.fn.now();

  try {
    await db.transaction(async (trx) => {
      const osAtual = await trx('ordens_de_servico').where({ id: parseInt(id, 10) }).first();
      if (!osAtual) {
        const err = new Error('Ordem de Serviço não encontrada para atualização.');
        err.status = 404; throw err;
      }
      let statusAnterior = osAtual.status_os;

      // Lógica para atualizar cliente_id (como antes)
      if (dadosParaAtualizar.cliente_id && dadosParaAtualizar.cliente_id !== osAtual.cliente_id) {
        // ... (verificação do cliente) ...
        const clienteExistente = await trx('clientes').where({ id: dadosParaAtualizar.cliente_id }).first();
        if (!clienteExistente) {
          const err = new Error('Novo cliente_id fornecido para atualização não foi encontrado.');
          err.status = 404; throw err;
        }
      }

      // Lógica para PEÇAS (nova/modificada)
      // Se 'pecasSelecionadas' for enviado, ele REESCREVE as peças e o valor.
      // Isso significa que o frontend precisa enviar a lista COMPLETA de peças da OS.
      // Uma lógica mais complexa para adicionar/remover/editar peças individualmente exigiria mais endpoints.
      let valorTotalPecasCalculado = osAtual.valor_total_pecas || 0;
      let descricaoPecasUtilizadasArray = osAtual.pecas_utilizadas ? osAtual.pecas_utilizadas.split('; ') : [];

      if (dadosEntrada.pecasSelecionadas !== undefined) { // Se o array de peças for enviado (mesmo que vazio, para limpar)
        // Potencialmente, reverter estoque de peças antigas se a lista mudou (mais complexo, não implementado aqui)
        // Por simplicidade, vamos assumir que `pecasSelecionadas` é a nova lista completa e o estoque só é baixado para elas.
        // Para uma edição real de peças, seria melhor ter uma tabela de junção os_pecas.

        valorTotalPecasCalculado = 0;
        descricaoPecasUtilizadasArray = [];

        if (dadosEntrada.pecasSelecionadas.length > 0) {
            // IMPORTANTE: esta lógica de atualização de peças e estoque é simplificada.
            // Se uma peça foi removida da lista, o estoque dela NÃO é automaticamente devolvido aqui.
            // Se a quantidade de uma peça existente mudou, o estoque NÃO é ajustado diferencialmente aqui.
            // Esta lógica assume que o frontend envia a lista final de peças, e nós damos baixa como se fossem novas.
            // Uma implementação robusta de edição de peças em uma OS exigiria uma tabela separada os_pecas.
            console.warn("Atualizando peças: a lógica de estoque atual é simplificada e pode não reverter estoque de peças removidas/alteradas.");

            for (const pecaInfo of dadosEntrada.pecasSelecionadas) {
                if (!pecaInfo.produto_id || !pecaInfo.quantidade || pecaInfo.quantidade <= 0 || pecaInfo.preco_venda_unitario_aplicado === undefined) {
                    const err = new Error('Dados inválidos para uma das peças selecionadas na atualização.');
                    err.status = 400; throw err;
                }
                const produtoNoEstoque = await trx('produtos_pecas').where({ id: pecaInfo.produto_id }).first();
                if (!produtoNoEstoque) {
                    const err = new Error(`Produto/Peça com ID ${pecaInfo.produto_id} não encontrado.`);
                    err.status = 404; throw err;
                }
                // ATENÇÃO: Esta lógica de baixa de estoque na atualização é problemática
                // se a peça já estava na OS e só a quantidade mudou, ou se a peça foi removida.
                // A melhor abordagem é uma tabela de junção.
                // Para este exemplo, vamos assumir que `pecasSelecionadas` são NOVAS ADIÇÕES ou substituem completamente as antigas,
                // e a baixa de estoque acontece para elas.
                if (produtoNoEstoque.quantidade_estoque < pecaInfo.quantidade) {
                    const err = new Error(`Estoque insuficiente para "${produtoNoEstoque.nome_produto}" na atualização.`);
                    err.status = 400; throw err;
                }
                const novoEstoque = produtoNoEstoque.quantidade_estoque - pecaInfo.quantidade;
                await trx('produtos_pecas').where({ id: pecaInfo.produto_id }).update({
                    quantidade_estoque: novoEstoque,
                    data_atualizacao: db.fn.now()
                });

                valorTotalPecasCalculado += parseFloat(pecaInfo.preco_venda_unitario_aplicado) * parseInt(pecaInfo.quantidade, 10);
                descricaoPecasUtilizadasArray.push(`${pecaInfo.quantidade}x ${produtoNoEstoque.nome_produto} (R$ ${parseFloat(pecaInfo.preco_venda_unitario_aplicado).toFixed(2)} cada)`);
            }
        }
        dadosParaAtualizar.pecas_utilizadas = descricaoPecasUtilizadasArray.join('; ') || null;
        dadosParaAtualizar.valor_total_pecas = valorTotalPecasCalculado;
      }


      // Recalcular valor_total_os com os novos valores
      const maoDeObra = dadosParaAtualizar.valor_servico_mao_de_obra !== undefined ? Number(dadosParaAtualizar.valor_servico_mao_de_obra) : Number(osAtual.valor_servico_mao_de_obra);
      const pecasFinal = dadosParaAtualizar.valor_total_pecas !== undefined ? Number(dadosParaAtualizar.valor_total_pecas) : Number(osAtual.valor_total_pecas || 0);
      const desconto = dadosParaAtualizar.valor_desconto !== undefined ? Number(dadosParaAtualizar.valor_desconto) : Number(osAtual.valor_desconto || 0);
      dadosParaAtualizar.valor_total_os = (maoDeObra + pecasFinal) - desconto;

      await trx('ordens_de_servico').where({ id: parseInt(id, 10) }).update(dadosParaAtualizar);

      // Lógica de integração com o caixa (como antes)
      const statusNovo = dadosParaAtualizar.status_os || statusAnterior;
      const valorFinalOSCalculado = dadosParaAtualizar.valor_total_os; // Já calculado
      const formaPgtoFinal = dadosParaAtualizar.forma_pagamento || osAtual.forma_pagamento || 'N/A';
      const statusDePagamento = ["Entregue", "Pago", "Finalizado e Pago"];

      if (statusDePagamento.includes(statusNovo) && !statusDePagamento.includes(statusAnterior) && valorFinalOSCalculado > 0) {
        await trx('itens_de_caixa').insert({
          descricao: `Recebimento O.S. #${osAtual.numero_os} (ID OS: ${id})`,
          tipo_movimentacao: 'Entrada',
          valor: valorFinalOSCalculado,
          data_movimentacao: db.fn.now(),
          categoria: 'Receita de Serviço',
          ordem_servico_id: parseInt(id, 10),
          cliente_id: osAtual.cliente_id,
          observacoes: `Pagamento referente à O.S. ${osAtual.numero_os}. Forma: ${formaPgtoFinal}`
        });
        console.log(`Lançamento no caixa para O.S. ${id} no valor de ${valorFinalOSCalculado} realizado.`);
      }

      const osAtualizada = await trx('ordens_de_servico')
        .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
        .select('ordens_de_servico.*', 'clientes.nome_completo as nome_cliente')
        .where('ordens_de_servico.id', parseInt(id, 10))
        .first();
      res.status(200).json(osAtualizada);
    });
  } catch (error) {
    console.error("Erro ao atualizar Ordem de Serviço:", error);
    if (error.status) { return res.status(error.status).json({ erro: error.message }); }
    res.status(500).json({ erro: 'Erro ao atualizar Ordem de Serviço no banco de dados.', detalhe: error.message });
  }
}

// ... (suas funções listarOrdensServico, buscarOrdemServicoPorId, deletarOrdemServico MANTENHA-AS) ...
// É importante que buscarOrdemServicoPorId e outras funções que você importa em ordemServicoRoutes.js estejam aqui e exportadas.
// Se o erro anterior era sobre 'buscarOrdemServicoPorId', ele precisa estar definido e exportado neste arquivo.

// Função para LISTAR todas as Ordens de Serviço (exemplo, você já deve ter)
export async function listarOrdensServico(req, res) {
  try {
    const ordens = await db('ordens_de_servico')
      .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
      .select('ordens_de_servico.*', 'clientes.nome_completo as nome_cliente')
      .orderBy('ordens_de_servico.data_criacao_os', 'desc');
    res.status(200).json(ordens);
  } catch (error) {
    console.error("Erro ao listar Ordens de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao listar Ordens de Serviço.', detalhe: error.message });
  }
}

// Função para BUSCAR uma Ordem de Serviço pelo ID (exemplo, você já deve ter)
export async function buscarOrdemServicoPorId(req, res) {
  const { id } = req.params;
  try {
    const ordemServico = await db('ordens_de_servico')
      .join('clientes', 'ordens_de_servico.cliente_id', '=', 'clientes.id')
      .select('ordens_de_servico.*', 'clientes.nome_completo as nome_cliente', 'clientes.telefone_principal as telefone_cliente', 'clientes.email as email_cliente')
      .where('ordens_de_servico.id', parseInt(id, 10))
      .first();
    if (ordemServico) {
      res.status(200).json(ordemServico);
    } else {
      res.status(404).json({ erro: 'Ordem de Serviço não encontrada.' });
    }
  } catch (error) {
    console.error("Erro ao buscar Ordem de Serviço por ID:", error);
    res.status(500).json({ erro: 'Erro ao buscar Ordem de Serviço no banco de dados.', detalhe: error.message });
  }
}

// Função para DELETAR uma Ordem de Serviço (exemplo, você já deve ter)
export async function deletarOrdemServico(req, res) {
  const { id } = req.params;
  try {
    const deletado = await db('ordens_de_servico').where({ id: parseInt(id, 10) }).del();
    if (deletado) {
      res.status(200).json({ mensagem: 'Ordem de Serviço deletada com sucesso.' });
    } else {
      res.status(404).json({ erro: 'Ordem de Serviço não encontrada para deleção.' });
    }
  } catch (error) {
    console.error("Erro ao deletar Ordem de Serviço:", error);
    res.status(500).json({ erro: 'Erro ao deletar Ordem de Serviço.', detalhe: error.message });
  }
}