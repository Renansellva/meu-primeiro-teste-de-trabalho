// frontend/src/components/OrdensServico/OrdemServicoForm.jsx
import React, { useState, useEffect } from 'react';
import { createOrdemServico } from '../../services/apiOrdemServico';
// Não precisamos mais importar getClientes aqui, será passado via props

function OrdemServicoForm({ onOrdemServicoCriada, clientes }) { // Recebe 'clientes' como prop
  // Estados para os campos do formulário
  const [clienteId, setClienteId] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [marcaEquipamento, setMarcaEquipamento] = useState('');
  const [modeloEquipamento, setModeloEquipamento] = useState('');
  const [numeroSerieImei, setNumeroSerieImei] = useState('');
  const [defeitoRelatadoCliente, setDefeitoRelatadoCliente] = useState('');
  const [acessoriosDeixados, setAcessoriosDeixados] = useState('');
  const [valorServicoMaoDeObra, setValorServicoMaoDeObra] = useState('');
  const [statusOs, setStatusOs] = useState('Orçamento'); // Status inicial padrão

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  const limparFormulario = () => {
    setClienteId('');
    setTipoEquipamento('');
    setMarcaEquipamento('');
    setModeloEquipamento('');
    setNumeroSerieImei('');
    setDefeitoRelatadoCliente('');
    setAcessoriosDeixados('');
    setValorServicoMaoDeObra('');
    setStatusOs('Orçamento');
    setErro('');
    setSucesso('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!clienteId || !tipoEquipamento || !marcaEquipamento || !modeloEquipamento || !defeitoRelatadoCliente || !valorServicoMaoDeObra) {
      setErro('Cliente, tipo, marca, modelo, defeito e valor da mão de obra são obrigatórios.');
      return;
    }
    setEnviando(true);
    try {
      const novaOS = {
        cliente_id: parseInt(clienteId, 10),
        tipo_equipamento: tipoEquipamento,
        marca_equipamento: marcaEquipamento,
        modelo_equipamento: modeloEquipamento,
        numero_serie_imei: numeroSerieImei,
        defeito_relatado_cliente: defeitoRelatadoCliente,
        acessorios_deixados: acessoriosDeixados,
        valor_servico_mao_de_obra: parseFloat(valorServicoMaoDeObra),
        status_os: statusOs,
        // O backend pode calcular valor_total_os e gerar numero_os
      };
      const osCriada = await createOrdemServico(novaOS);
      setSucesso(`Ordem de Serviço "${osCriada.numero_os}" para o cliente ID ${osCriada.cliente_id} criada com sucesso!`);
      limparFormulario();
      if (onOrdemServicoCriada) {
        onOrdemServicoCriada(osCriada);
      }
    } catch (error) {
      setErro(error.response?.data?.erro || 'Falha ao criar Ordem de Serviço.');
    }
    setEnviando(false);
  };

  return (
    <form onSubmit={handleSubmit} className="os-form" style={{ marginBottom: '30px', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h3>Nova Ordem de Serviço</h3>
      {erro && <p style={{ color: 'red' }}>{erro}</p>}
      {sucesso && <p style={{ color: 'green' }}>{sucesso}</p>}
      
      <div>
        <label htmlFor="clienteIdOS">Cliente:*</label>
        <select id="clienteIdOS" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
          <option value="">Selecione um cliente</option>
          {clientes && clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome_completo} (ID: {cliente.id})
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="tipoEquipamentoOS">Tipo do Equipamento:*</label>
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
        <label htmlFor="defeitoRelatadoOS">Defeito Relatado:*</label>
        <textarea id="defeitoRelatadoOS" value={defeitoRelatadoCliente} onChange={(e) => setDefeitoRelatadoCliente(e.target.value)} required />
      </div>

      <div>
        <label htmlFor="acessoriosDeixadosOS">Acessórios Deixados:</label>
        <input type="text" id="acessoriosDeixadosOS" value={acessoriosDeixados} onChange={(e) => setAcessoriosDeixados(e.target.value)} />
      </div>

      <div>
        <label htmlFor="valorServicoOS">Valor da Mão de Obra (R$):*</label>
        <input type="number" id="valorServicoOS" value={valorServicoMaoDeObra} onChange={(e) => setValorServicoMaoDeObra(e.target.value)} required step="0.01" min="0" />
      </div>
      
      <div>
        <label htmlFor="statusOs">Status Inicial:*</label>
        <select id="statusOs" value={statusOs} onChange={(e) => setStatusOs(e.target.value)} required>
          <option value="Orçamento">Orçamento</option>
          <option value="Aguardando Aprovação">Aguardando Aprovação</option>
          <option value="Aguardando Peças">Aguardando Peças</option>
          <option value="Em Análise">Em Análise</option>
          <option value="Em Reparo">Em Reparo</option>
          {/* Adicione outros status conforme sua migration e lógica de negócio */}
        </select>
      </div>

      <button type="submit" disabled={enviando} className="btn-enviar" style={{ marginTop: '15px' }}>
        {enviando ? 'Salvando OS...' : 'Salvar Ordem de Serviço'}
      </button>
    </form>
  );
}

export default OrdemServicoForm;