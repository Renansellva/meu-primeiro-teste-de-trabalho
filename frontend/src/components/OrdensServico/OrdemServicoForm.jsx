// frontend/src/components/OrdensServico/OrdemServicoForm.jsx
import React, { useState, useEffect } from 'react';
import { createOrdemServico, updateOrdemServico } from '../../services/apiOrdemServico';
// A lista de clientes será passada via props pela OrdensServicoPage

function OrdemServicoForm({ onOsSalva, osParaEditar, onEdicaoCancelada, clientes }) {
  // Estados para os campos do formulário
  const [clienteId, setClienteId] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState(''); // Declarado aqui
  const [marcaEquipamento, setMarcaEquipamento] = useState('');
  const [modeloEquipamento, setModeloEquipamento] = useState('');
  const [numeroSerieImei, setNumeroSerieImei] = useState('');
  const [defeitoRelatadoCliente, setDefeitoRelatadoCliente] = useState('');
  const [acessoriosDeixados, setAcessoriosDeixados] = useState('');
  const [valorServicoMaoDeObra, setValorServicoMaoDeObra] = useState('');
  const [valorTotalPecas, setValorTotalPecas] = useState('');
  const [valorDesconto, setValorDesconto] = useState('');
  const [statusOs, setStatusOs] = useState('Orçamento'); // Status inicial padrão
  const [diagnosticoTecnico, setDiagnosticoTecnico] = useState('');
  const [servicoExecutado, setServicoExecutado] = useState('');
  const [pecasUtilizadas, setPecasUtilizadas] = useState('');
  const [observacoesInternas, setObservacoesInternas] = useState('');
  const [dataPrevisaoEntrega, setDataPrevisaoEntrega] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('');
  // Adicione mais estados se tiver mais campos no seu backend/migration

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const ehModoEdicao = Boolean(osParaEditar && osParaEditar.id);

  const limparFormulario = () => {
    setClienteId('');
    setTipoEquipamento('');
    setMarcaEquipamento('');
    setModeloEquipamento('');
    setNumeroSerieImei('');
    setDefeitoRelatadoCliente('');
    setAcessoriosDeixados('');
    setValorServicoMaoDeObra('');
    setValorTotalPecas('');
    setValorDesconto('');
    setStatusOs('Orçamento');
    setDiagnosticoTecnico('');
    setServicoExecutado('');
    setPecasUtilizadas('');
    setObservacoesInternas('');
    setDataPrevisaoEntrega('');
    setFormaPagamento('');
    setErro('');
    setSucesso('');
  };

  useEffect(() => {
    if (ehModoEdicao) {
      setClienteId(String(osParaEditar.cliente_id || ''));
      setTipoEquipamento(osParaEditar.tipo_equipamento || '');
      setMarcaEquipamento(osParaEditar.marca_equipamento || '');
      setModeloEquipamento(osParaEditar.modelo_equipamento || '');
      setNumeroSerieImei(osParaEditar.numero_serie_imei || '');
      setDefeitoRelatadoCliente(osParaEditar.defeito_relatado_cliente || '');
      setAcessoriosDeixados(osParaEditar.acessorios_deixados || '');
      setValorServicoMaoDeObra(osParaEditar.valor_servico_mao_de_obra !== null ? String(osParaEditar.valor_servico_mao_de_obra) : '');
      setValorTotalPecas(osParaEditar.valor_total_pecas !== null ? String(osParaEditar.valor_total_pecas) : '');
      setValorDesconto(osParaEditar.valor_desconto !== null ? String(osParaEditar.valor_desconto) : '');
      setStatusOs(osParaEditar.status_os || 'Orçamento');
      setDiagnosticoTecnico(osParaEditar.diagnostico_tecnico || '');
      setServicoExecutado(osParaEditar.servico_executado || '');
      setPecasUtilizadas(osParaEditar.pecas_utilizadas || '');
      setObservacoesInternas(osParaEditar.observacoes_internas || '');
      setDataPrevisaoEntrega(osParaEditar.data_previsao_entrega ? osParaEditar.data_previsao_entrega.split('T')[0] : '');
      setFormaPagamento(osParaEditar.forma_pagamento || '');
      setSucesso('');
      setErro('');
    } else {
      limparFormulario();
    }
  }, [osParaEditar]); // Removido ehModoEdicao daqui, pois ele é derivado de osParaEditar

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!clienteId || !tipoEquipamento || !marcaEquipamento || !modeloEquipamento || !defeitoRelatadoCliente || !valorServicoMaoDeObra) {
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
      valor_total_pecas: valorTotalPecas ? parseFloat(valorTotalPecas) : 0,
      valor_desconto: valorDesconto ? parseFloat(valorDesconto) : 0,
      status_os: statusOs,
      diagnostico_tecnico: diagnosticoTecnico || null,
      servico_executado: servicoExecutado || null,
      pecas_utilizadas: pecasUtilizadas || null,
      observacoes_internas: observacoesInternas || null,
      data_previsao_entrega: dataPrevisaoEntrega || null,
      forma_pagamento: formaPagamento || null,
      // Adicione aqui os outros campos da OS que você tem no estado e quer enviar
      // como 'servico_autorizado_cliente', 'garantia_servico', etc.
    };

    try {
      if (ehModoEdicao) {
        const osAtualizada = await updateOrdemServico(osParaEditar.id, dadosOS);
        setSucesso(`O.S. #${osAtualizada.numero_os} atualizada com sucesso!`);
      } else {
        const osCriada = await createOrdemServico(dadosOS);
        setSucesso(`O.S. #${osCriada.numero_os} criada com sucesso!`);
        // Não limpa o formulário aqui imediatamente, o useEffect cuidará disso quando onOsSalva for chamado
        // e osParaEditar for setado para null (pela página pai).
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

  return (
    <form onSubmit={handleSubmit} className="os-form" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #313b5f', borderRadius: '8px', background: 'rgba(28, 33, 54, 0.96)' }}>
      <h3 style={{color: '#30e88b', marginTop: 0, marginBottom: '20px'}}>{ehModoEdicao ? `Editando O.S. #${osParaEditar?.numero_os || 'ID ' + osParaEditar?.id}` : 'Nova Ordem de Serviço'}</h3>
      {erro && <p style={{ color: '#ff8a8a', background: '#4b2323', padding: '8px', borderRadius: '4px', marginBottom: '15px' }}>{erro}</p>}
      {sucesso && <p style={{ color: '#30e88b', background: '#223c29', padding: '8px', borderRadius: '4px', marginBottom: '15px'  }}>{sucesso}</p>}
      
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
        <div>
          <label htmlFor="statusOsForm">Status:*</label>
          <select id="statusOsForm" value={statusOs} onChange={(e) => setStatusOs(e.target.value)} required>
            {listaStatusOS.map(status => <option key={status} value={status}>{status}</option>)}
          </select>
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

      <h4 style={{color: '#30e88b', marginTop: '25px', marginBottom: '15px', borderTop: '1px solid #313b5f', paddingTop: '15px'}}>Detalhes Técnicos e Financeiros</h4>
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px 20px'}}>
        <div>
          <label htmlFor="valorServicoOS">Mão de Obra (R$):*</label>
          <input type="number" id="valorServicoOS" value={valorServicoMaoDeObra} onChange={(e) => setValorServicoMaoDeObra(e.target.value)} required step="0.01" min="0" />
        </div>
        <div>
          <label htmlFor="valorTotalPecasOS">Valor Peças (R$):</label>
          <input type="number" id="valorTotalPecasOS" value={valorTotalPecas} onChange={(e) => setValorTotalPecas(e.target.value)} step="0.01" min="0" />
        </div>
        <div>
          <label htmlFor="valorDescontoOS">Desconto (R$):</label>
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
        <label htmlFor="pecasUtilizadasOS">Peças Utilizadas (descrição):</label>
        <textarea id="pecasUtilizadasOS" value={pecasUtilizadas} onChange={(e) => setPecasUtilizadas(e.target.value)} rows="2" />
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
            <input type="text" id="formaPagamentoOS" value={formaPagamento} onChange={(e) => setFormaPagamento(e.target.value)} />
        </div>
      </div>

      <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
        <button type="submit" disabled={enviando} className="btn-enviar">
          {enviando ? (ehModoEdicao ? 'Salvando...' : 'Criando...') : (ehModoEdicao ? 'Salvar Alterações da OS' : 'Criar OS')}
        </button>
        {ehModoEdicao && (
          <button type="button" onClick={onEdicaoCancelada} className="button" style={{ backgroundColor: '#6c757d' }}>
            Cancelar Edição
          </button>
        )}
      </div>
    </form>
  );
}

export default OrdemServicoForm;