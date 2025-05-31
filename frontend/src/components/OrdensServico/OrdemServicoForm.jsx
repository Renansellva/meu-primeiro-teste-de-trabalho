// frontend/src/components/OrdensServico/OrdemServicoForm.jsx
import React, { useState, useEffect } from 'react';
import { createOrdemServico } from '../../services/apiOrdemServico';
// Importaremos getClientes para popular o dropdown de clientes
import { getClientes } from '../../services/apiCliente';

function OrdemServicoForm({ onOrdemServicoCriada }) {
  const [clientes, setClientes] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [tipoEquipamento, setTipoEquipamento] = useState('');
  const [marcaEquipamento, setMarcaEquipamento] = useState('');
  const [modeloEquipamento, setModeloEquipamento] = useState('');
  const [defeitoRelatado, setDefeitoRelatado] = useState('');
  const [valorServico, setValorServico] = useState('');
  // Adicione outros estados para os campos da OS conforme necessário (status, etc.)

  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    // Carregar clientes para o dropdown
    const carregarClientesParaForm = async () => {
      try {
        const listaClientes = await getClientes();
        setClientes(listaClientes || []);
        if (listaClientes && listaClientes.length > 0) {
          // Opcional: pré-selecionar o primeiro cliente ou deixar em branco
          // setClienteId(listaClientes[0].id);
        }
      } catch (error) {
        console.error("Erro ao carregar clientes para o formulário OS:", error);
        setErro("Não foi possível carregar a lista de clientes.");
      }
    };
    carregarClientesParaForm();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!clienteId || !tipoEquipamento || !marcaEquipamento || !modeloEquipamento || !defeitoRelatado || !valorServico) {
      setErro('Todos os campos marcados com * são obrigatórios.');
      return;
    }
    setEnviando(true);
    try {
      const novaOS = {
        cliente_id: parseInt(clienteId, 10),
        tipo_equipamento: tipoEquipamento,
        marca_equipamento: marcaEquipamento,
        modelo_equipamento: modeloEquipamento,
        defeito_relatado_cliente: defeitoRelatado,
        valor_servico_mao_de_obra: parseFloat(valorServico),
        // Adicione outros campos aqui. O backend já define status padrão.
      };
      const osCriada = await createOrdemServico(novaOS);
      setSucesso(`Ordem de Serviço "${osCriada.numero_os}" criada com sucesso!`);
      // Limpa o formulário
      setClienteId('');
      setTipoEquipamento('');
      setMarcaEquipamento('');
      setModeloEquipamento('');
      setDefeitoRelatado('');
      setValorServico('');
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
        <label htmlFor="clienteId">Cliente:*</label>
        <select id="clienteId" value={clienteId} onChange={(e) => setClienteId(e.target.value)} required>
          <option value="">Selecione um cliente</option>
          {clientes.map(cliente => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome_completo} (ID: {cliente.id})
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="tipoEquipamento">Tipo do Equipamento:*</label>
        <input type="text" id="tipoEquipamento" value={tipoEquipamento} onChange={(e) => setTipoEquipamento(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="marcaEquipamento">Marca:*</label>
        <input type="text" id="marcaEquipamento" value={marcaEquipamento} onChange={(e) => setMarcaEquipamento(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="modeloEquipamento">Modelo:*</label>
        <input type="text" id="modeloEquipamento" value={modeloEquipamento} onChange={(e) => setModeloEquipamento(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="defeitoRelatado">Defeito Relatado:*</label>
        <textarea id="defeitoRelatado" value={defeitoRelatado} onChange={(e) => setDefeitoRelatado(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="valorServico">Valor da Mão de Obra (R$):*</label>
        <input type="number" id="valorServico" value={valorServico} onChange={(e) => setValorServico(e.target.value)} required step="0.01" min="0" />
      </div>
      {/* Adicionar mais campos aqui: numero_serie_imei, acessorios_deixados, etc. */}
      <button type="submit" disabled={enviando} className="btn-enviar">
        {enviando ? 'Salvando OS...' : 'Salvar Ordem de Serviço'}
      </button>
    </form>
  );
}

export default OrdemServicoForm;