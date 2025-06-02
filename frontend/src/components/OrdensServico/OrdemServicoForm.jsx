// frontend/src/components/OrdensServico/OrdemServicoForm.jsx
import React, { useState, useEffect } from 'react';
import { createOrdemServico, updateOrdemServico } from '../../services/apiOrdemServico';

// Props: onOsSalva, osParaEditar, onEdicaoCancelada, clientes, produtosDisponiveis
function OrdemServicoForm({ onOsSalva, osParaEditar, onEdicaoCancelada, clientes, produtosDisponiveis }) {
  // Estados para os campos da OS
  const [clienteId, setClienteId] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [marcaEquipamento, setMarcaEquipamento] = useState('');
  const [modeloEquipamento, setModeloEquipamento] = useState('');
  const [numeroSerieImei, setNumeroSerieImei] = useState('');
  const [defeitoRelatadoCliente, setDefeitoRelatadoCliente] = useState('');
  const [acessoriosDeixados, setAcessoriosDeixados] = useState('');
  const [valorServicoMaoDeObra, setValorServicoMaoDeObra] = useState('');
  // valorTotalPecas será influenciado pela lista de peças adicionadas
  const [valorDesconto, setValorDesconto] = useState('');
  const [statusOs, setStatusOs] = useState('Orçamento'); // Status inicial padrão
  const [diagnosticoTecnico, setDiagnosticoTecnico] = useState('');
  const [servicoExecutado, setServicoExecutado] = useState('');
  // pecasUtilizadasDescricao não é mais um input direto, será gerado pelo backend
  const [observacoesInternas, setObservacoesInternas] = useState('');
  const [dataPrevisaoEntrega, setDataPrevisaoEntrega] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');

  // Estados para gerenciar a adição de peças
  const [pecasNaOS, setPecasNaOS] = useState([]); // Array de { produto_id, nome_produto, quantidade, preco_venda_unitario_aplicado }
  const [pecaSelecionadaId, setPecaSelecionadaId] = useState('');
  const [quantidadePeca, setQuantidadePeca] = useState(1);
  const [precoVendaPecaAplicado, setPrecoVendaPecaAplicado] = useState('');

  // Estados de controle do formulário
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const ehModoEdicao = Boolean(osParaEditar && osParaEditar.id);

  // Função para limpar todos os campos do formulário
  const limparFormularioCompleto = () => {
    setClienteId(''); setTipoEquipamento(''); setMarcaEquipamento('');
    setModeloEquipamento(''); setNumeroSerieImei(''); setDefeitoRelatadoCliente('');
    setAcessoriosDeixados(''); setValorServicoMaoDeObra('');
    setValorDesconto(''); setStatusOs('Orçamento'); setDiagnosticoTecnico('');
    setServicoExecutado(''); setObservacoesInternas('');
    setDataPrevisaoEntrega(''); setFormaPagamento('');
    setPecasNaOS([]);
    limparCamposDeAdicionarPeca();
    setErro(''); setSucesso('');
  };

  // Função para limpar campos de adição de peça
  const limparCamposDeAdicionarPeca = () => {
    setPecaSelecionadaId('');
    setQuantidadePeca(1);
    setPrecoVendaPecaAplicado('');
  };
  
  // Preenche o formulário ao entrar no modo de edição ou limpa ao sair
  useEffect(() => {
    if (ehModoEdicao && osParaEditar) {
      setClienteId(String(osParaEditar.cliente_id || ''));
      setTipoEquipamento(osParaEditar.tipo_equipamento || '');
      setMarcaEquipamento(osParaEditar.marca_equipamento || '');
      setModeloEquipamento(osParaEditar.modelo_equipamento || '');
      setNumeroSerieImei(osParaEditar.numero_serie_imei || '');
      setDefeitoRelatadoCliente(osParaEditar.defeito_relatado_cliente || '');
      setAcessoriosDeixados(osParaEditar.acessorios_deixados || '');
      setValorServicoMaoDeObra(osParaEditar.valor_servico_mao_de_obra !== null ? String(osParaEditar.valor_servico_mao_de_obra) : '0');
      // O valor_total_pecas é calculado a partir das peças, mas podemos mostrar o valor salvo
      // setValorTotalPecasInput(osParaEditar.valor_total_pecas !== null ? String(osParaEditar.valor_total_pecas) : '0');
      setValorDesconto(osParaEditar.valor_desconto !== null ? String(osParaEditar.valor_desconto) : '0');
      setStatusOs(osParaEditar.status_os || 'Orçamento');
      setDiagnosticoTecnico(osParaEditar.diagnostico_tecnico || '');
      setServicoExecutado(osParaEditar.servico_executado || '');
      // Para preencher 'pecasNaOS' ao editar, precisaríamos que 'osParaEditar' viesse com um array estruturado de peças.
      // Como o backend armazena uma string descritiva e recalcula com base no 'pecasSelecionadas' enviado,
      // a lista de peças aqui começará vazia no modo de edição. O usuário precisará re-adicionar as peças
      // se a intenção for modificar o conjunto de peças da OS.
      setPecasNaOS([]); // Para simplificar a edição de peças por enquanto.
      setObservacoesInternas(osParaEditar.observacoes_internas || '');
      const dataFormatada = osParaEditar.data_previsao_entrega ? osParaEditar.data_previsao_entrega.split('T')[0] : '';
      setDataPrevisaoEntrega(dataFormatada);
      setFormaPagamento(osParaEditar.forma_pagamento || '');
      setSucesso(''); setErro('');
    } else {
      limparFormularioCompleto();
    }
  }, [osParaEditar]);

  // Atualiza o preço da peça automaticamente quando uma peça é selecionada no dropdown
  useEffect(() => {
    if (pecaSelecionadaId && produtosDisponiveis) {
      const produtoInfo = produtosDisponiveis.find(p => p.id === parseInt(pecaSelecionadaId, 10));
      if (produtoInfo && produtoInfo.preco_venda_padrao !== null) {
        setPrecoVendaPecaAplicado(String(produtoInfo.preco_venda_padrao));
      } else {
        setPrecoVendaPecaAplicado('');
      }
    } else {
      // Limpa o preço se nenhuma peça estiver selecionada ou se o produto não for encontrado
      if (!pecaSelecionadaId) setPrecoVendaPecaAplicado('');
    }
  }, [pecaSelecionadaId, produtosDisponiveis]);

  const handleAdicionarPeca = () => {
    if (!pecaSelecionadaId || quantidadePeca <= 0 || !precoVendaPecaAplicado.trim() || parseFloat(precoVendaPecaAplicado) < 0) {
      alert("Selecione uma peça, e informe quantidade positiva e preço de venda unitário válidos.");
      return;
    }
    const produtoInfo = produtosDisponiveis.find(p => p.id === parseInt(pecaSelecionadaId, 10));
    if (!produtoInfo) {
      alert("Peça selecionada não encontrada na lista de produtos disponíveis.");
      return;
    }
    const pecaJaAdicionada = pecasNaOS.find(p => p.produto_id === produtoInfo.id);
    if (pecaJaAdicionada) {
      alert(`A peça "${produtoInfo.nome_produto}" já foi adicionada. Remova-a primeiro se desejar alterar a quantidade ou preço.`);
      return;
    }

    setPecasNaOS(prevPecas => [
      ...prevPecas,
      {
        produto_id: produtoInfo.id,
        nome_produto: produtoInfo.nome_produto,
        quantidade: parseInt(quantidadePeca, 10),
        preco_venda_unitario_aplicado: parseFloat(precoVendaPecaAplicado),
      }
    ]);
    limparCamposDeAdicionarPeca();
  };

  const handleRemoverPeca = (produtoIdParaRemover) => {
    setPecasNaOS(prevPecas => prevPecas.filter(p => p.produto_id !== produtoIdParaRemover));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro(''); setSucesso('');

    if (!clienteId || !tipoEquipamento || !marcaEquipamento || !modeloEquipamento || !defeitoRelatadoCliente || valorServicoMaoDeObra.trim() === '') {
      setErro('Cliente, tipo, marca, modelo, defeito e valor da mão de obra são obrigatórios.');
      return;
    }
    setEnviando(true);

    const dadosOS = {
      cliente_id: parseInt(clienteId, 10),
      tipo_equipamento: tipoEquipamento,
      marca_equipamento: marcaEquipamento,
      modelo_equipamento: modeloEquipamento,
      numero_serie_imei: numeroSerieImei || null,
      defeito_relatado_cliente: defeitoRelatadoCliente,
      acessorios_deixados: acessoriosDeixados || null,
      valor_servico_mao_de_obra: parseFloat(valorServicoMaoDeObra),
      valor_desconto: valorDesconto ? parseFloat(valorDesconto) : 0,
      status_os: statusOs,
      diagnostico_tecnico: diagnosticoTecnico || null,
      servico_executado: servicoExecutado || null,
      observacoes_internas: observacoesInternas || null,
      data_previsao_entrega: dataPrevisaoEntrega || null,
      forma_pagamento: formaPagamento || null,
      // Envia o array estruturado de peças para o backend
      pecasSelecionadas: pecasNaOS.map(p => ({
        produto_id: p.produto_id,
        quantidade: p.quantidade,
        preco_venda_unitario_aplicado: p.preco_venda_unitario_aplicado
      }))
      // O backend calculará valor_total_pecas e pecas_utilizadas (string)
    };

    try {
      if (ehModoEdicao) {
        const osAtualizada = await updateOrdemServico(osParaEditar.id, dadosOS);
        setSucesso(`O.S. #${osAtualizada.numero_os || osParaEditar.numero_os} atualizada com sucesso!`);
      } else {
        const osCriada = await createOrdemServico(dadosOS);
        setSucesso(`O.S. #${osCriada.numero_os} criada com sucesso!`);
      }
      if (onOsSalva) {
        onOsSalva(); 
      }
    } catch (error) {
      setErro(error.response?.data?.erro || `Falha ao ${ehModoEdicao ? 'atualizar' : 'criar'} O.S.`);
    }
    setEnviando(false);
  };

  const listaStatusOS = [
    "Orçamento", "Aguardando Aprovação", "Aprovado", "Em Análise", 
    "Aguardando Peças", "Em Reparo", "Pronto para Retirada", 
    "Entregue", "Pago", "Finalizado e Pago", "Cancelado", "Sem Reparo"
  ];
  const listaFormasPagamento = ["", "Espécie", "Pix", "Cartão de Crédito", "Cartão de Débito", "Transferência Bancária", "Outro"];

  const valorTotalPecasAdicionadas = pecasNaOS.reduce((acc, peca) => acc + (peca.preco_venda_unitario_aplicado * peca.quantidade), 0);

  return (
    <form onSubmit={handleSubmit} className="os-form" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)' }}>
      <h3 style={{color: '#30e88b', marginTop: 0, marginBottom: '20px'}}>{ehModoEdicao ? `Editando O.S. #${osParaEditar?.numero_os || 'ID ' + osParaEditar?.id}` : 'Nova Ordem de Serviço'}</h3>
      {erro && <p style={{ color: '#ff8a8a', background: '#4b2323', padding: '8px', borderRadius: '4px', marginBottom: '15px' }}>{erro}</p>}
      {sucesso && <p style={{ color: '#30e88b', background: '#223c29', padding: '8px', borderRadius: '4px', marginBottom: '15px'  }}>{sucesso}</p>}
      
      {/* --- Seção Dados da OS e Cliente --- */}
      <h4 style={{color: '#c7d0f7', marginTop: '0px', marginBottom: '15px'}}>Dados Gerais e do Cliente</h4>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px 20px'}}>
        <div>
          <label htmlFor="clienteIdOS">Cliente:*</label>
          <select id="clienteIdOS" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required disabled={ehModoEdicao}>
            <option value="">Selecione um cliente</option>
            {clientes && clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.nome_completo}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="statusOsForm">Status:*</label>
          <select id="statusOsForm" value={statusOs} onChange={(e) => setStatusOs(e.target.value)} required>
            {listaStatusOS.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
        </div>
      </div>

      <h4 style={{color: '#c7d0f7', marginTop: '20px', marginBottom: '15px'}}>Dados do Equipamento</h4>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px 20px'}}>
        <div>
          <label htmlFor="tipoEquipamentoOS">Tipo Equipamento:*</label>
          <input type="text" id="tipoEquipamentoOS" value={tipoEquipamento} onChange={(e) => setTipoEquipamento(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="marcaEquipamentoOS">Marca:*</label>
          <input type="text" id="marcaEquipamentoOS" value={marcaEquipamento} onChange={(e) => setMarcaEquipamento(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="modeloEquipamentoOS">Modelo:*</label>
          <input type="text" id="modeloEquipamentoOS" value={modeloEquipamento} onChange={(e) => setModeloEquipamento(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="numeroSerieImeiOS">Nº Série / IMEI:</label>
          <input type="text" id="numeroSerieImeiOS" value={numeroSerieImei} onChange={(e) => setNumeroSerieImei(e.target.value)} />
        </div>
      </div>
      <div style={{marginTop: '15px'}}>
        <label htmlFor="defeitoRelatadoOS">Defeito Relatado Cliente:*</label>
        <textarea id="defeitoRelatadoOS" value={defeitoRelatadoCliente} onChange={(e) => setDefeitoRelatadoCliente(e.target.value)} required rows="3" />
      </div>
      <div style={{marginTop: '15px'}}>
        <label htmlFor="acessoriosDeixadosOS">Acessórios Deixados:</label>
        <input type="text" id="acessoriosDeixadosOS" value={acessoriosDeixados} onChange={(e) => setAcessoriosDeixados(e.target.value)} />
      </div>

      {/* --- Seção de Peças --- */}
      <h4 style={{color: '#30e88b', marginTop: '25px', marginBottom: '15px', borderTop: '1px solid #313b5f', paddingTop: '15px'}}>Peças/Produtos Utilizados na O.S.</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1fr 2fr auto', gap: '10px', alignItems: 'flex-end', marginBottom: '10px', paddingBottom: '15px', borderBottom: '1px solid #313b5f' }}>
        <div>
          <label htmlFor="pecaSelecionadaId">Peça/Produto:</label>
          <select id="pecaSelecionadaId" value={pecaSelecionadaId} onChange={(e) => setPecaSelecionadaId(e.target.value)}>
            <option value="">Selecione uma peça</option>
            {produtosDisponiveis && produtosDisponiveis.map(p => (
              <option key={p.id} value={p.id} disabled={p.quantidade_estoque === 0 && !pecasNaOS.find(pnOs => pnOs.produto_id === p.id) }>
                {p.nome_produto} (Estoque: {p.quantidade_estoque})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="quantidadePeca">Qtd.:</label>
          <input type="number" id="quantidadePeca" value={quantidadePeca} onChange={(e) => setQuantidadePeca(e.target.value)} min="1" style={{width: '100%'}} />
        </div>
        <div>
          <label htmlFor="precoVendaPecaAplicado">Preço Venda Unit. (R$):</label>
          <input type="number" id="precoVendaPecaAplicado" value={precoVendaPecaAplicado} onChange={(e) => setPrecoVendaPecaAplicado(e.target.value)} step="0.01" min="0" style={{width: '100%'}} />
        </div>
        <button type="button" onClick={handleAdicionarPeca} className="button" style={{padding: '10px 15px'}}>Adicionar Peça</button>
      </div>
      {pecasNaOS.length > 0 && (
        <div style={{marginTop: '0px', marginBottom: '15px'}}>
          <h5>Peças Adicionadas:</h5>
          <ul style={{listStyle: 'none', padding:0}}>
            {pecasNaOS.map((peca, index) => (
              <li key={`${peca.produto_id}-${index}`} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: index === pecasNaOS.length - 1 ? 'none' : '1px dashed #4a5568'}}>
                <span>{peca.quantidade}x {peca.nome_produto} @ R$ {parseFloat(peca.preco_venda_unitario_aplicado).toFixed(2)}</span>
                <span>Subtotal: R$ {(peca.quantidade * peca.preco_venda_unitario_aplicado).toFixed(2)}</span>
                <button type="button" onClick={() => handleRemoverPeca(peca.produto_id)} style={{background: 'none', border: 'none', color: '#ff8a8a', cursor: 'pointer', fontSize: '1.2em', padding: '0 5px'}}>&times;</button>
              </li>
            ))}
          </ul>
          <p style={{textAlign: 'right', fontWeight: 'bold', marginTop: '10px', color: '#30e88b'}}>+ Valor Total das Peças Adicionadas: R$ {valorTotalPecasAdicionadas.toFixed(2)}</p>
        </div>
      )}

      {/* --- Seção Detalhes Técnicos e Financeiros da OS --- */}
      <h4 style={{color: '#c7d0f7', marginTop: '25px', marginBottom: '15px', borderTop: '1px solid #313b5f', paddingTop: '15px'}}>Detalhes Técnicos e Outros Custos da OS</h4>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px 20px'}}>
        <div>
          <label htmlFor="valorServicoOS">Mão de Obra (R$):*</label>
          <input type="number" id="valorServicoOS" value={valorServicoMaoDeObra} onChange={(e) => setValorServicoMaoDeObra(e.target.value)} required step="0.01" min="0" />
        </div>
        <div>
          <label htmlFor="valorDescontoOS">Desconto Total na OS (R$):</label>
          <input type="number" id="valorDescontoOS" value={valorDesconto} onChange={(e) => setValorDesconto(e.target.value)} step="0.01" min="0" />
        </div>
      </div>
      <div style={{marginTop: '15px'}}>
        <label htmlFor="diagnosticoTecnicoOS">Diagnóstico Técnico:</label>
        <textarea id="diagnosticoTecnicoOS" value={diagnosticoTecnico} onChange={(e) => setDiagnosticoTecnico(e.target.value)} rows="3" />
      </div>
      <div style={{marginTop: '15px'}}>
        <label htmlFor="servicoExecutadoOS">Serviço Executado:</label>
        <textarea id="servicoExecutadoOS" value={servicoExecutado} onChange={(e) => setServicoExecutado(e.target.value)} rows="3" />
      </div>
      <div style={{marginTop: '15px'}}>
        <label htmlFor="observacoesInternasOS">Observações Internas:</label>
        <textarea id="observacoesInternasOS" value={observacoesInternas} onChange={(e) => setObservacoesInternas(e.target.value)} rows="2" />
      </div>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px 20px', marginTop: '15px'}}>
        <div>
            <label htmlFor="dataPrevisaoEntregaOS">Previsão de Entrega:</label>
            <input type="date" id="dataPrevisaoEntregaOS" value={dataPrevisaoEntrega} onChange={(e) => setDataPrevisaoEntrega(e.target.value)} />
        </div>
        <div>
            <label htmlFor="formaPagamentoOS">Forma de Pagamento:</label>
            <select id="formaPagamentoOS" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)}>
                <option value="">Selecione</option>
                {listaFormasPagamento.map(forma => <option key={forma} value={forma}>{forma}</option>)}
            </select>
        </div>
      </div>

      <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
        <button type="submit" disabled={enviando} className="btn-enviar">
          {enviando ? (ehModoEdicao ? 'Salvando Alterações...' : 'Criando OS...') : (ehModoEdicao ? 'Salvar Alterações da OS' : 'Criar Ordem de Serviço')}
        </button>
        {ehModoEdicao && (
          <button type="button" onClick={() => { if(onEdicaoCancelada) onEdicaoCancelada(); }} className="button" style={{ backgroundColor: '#6c757d' }}>
            Cancelar Edição
          </button>
        )}
      </div>
    </form>
  );
}

export default OrdemServicoForm;