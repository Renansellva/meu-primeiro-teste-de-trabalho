// frontend/src/components/OrdensServico/OrdemServicoForm.jsx
import React, { useState, useEffect } from 'react';
import { createOrdemServico, updateOrdemServico } from '../../services/apiOrdemServico';
import toast from 'react-hot-toast';

function OrdemServicoForm({ onOsSalva, osParaEditar, onEdicaoCancelada, clientes }) {
  // Estados para os campos do formulário
  const [formData, setFormData] = useState({
    cliente_id: '',
    tipo_equipamento: '',
    marca_equipamento: '',
    modelo_equipamento: '',
    defeito_relatado_cliente: '',
    pecas_utilizadas: '',
    valor_servico_mao_de_obra: '',
    valor_total_pecas: '',
    valor_desconto: '',
    valor_total_os: '',
    status_os: 'Orçamento'
  });

  const [enviando, setEnviando] = useState(false);
  const ehModoEdicao = Boolean(osParaEditar && osParaEditar.id);

  // Efeito para preencher o formulário ao entrar no modo de edição
  useEffect(() => {
    if (ehModoEdicao) {
      setFormData({
        cliente_id: osParaEditar.cliente_id || '',
        tipo_equipamento: osParaEditar.tipo_equipamento || '',
        marca_equipamento: osParaEditar.marca_equipamento || '',
        modelo_equipamento: osParaEditar.modelo_equipamento || '',
        defeito_relatado_cliente: osParaEditar.defeito_relatado_cliente || '',
        pecas_utilizadas: osParaEditar.pecas_utilizadas || '',
        valor_servico_mao_de_obra: osParaEditar.valor_servico_mao_de_obra || '',
        valor_total_pecas: osParaEditar.valor_total_pecas || '',
        valor_desconto: osParaEditar.valor_desconto || '',
        valor_total_os: osParaEditar.valor_total_os || '',
        status_os: osParaEditar.status_os || 'Orçamento'
      });
    } else {
      // Limpa o formulário para modo de criação
      setFormData({
        cliente_id: '', tipo_equipamento: '', marca_equipamento: '', modelo_equipamento: '',
        defeito_relatado_cliente: '', pecas_utilizadas: '', valor_servico_mao_de_obra: '',
        valor_total_pecas: '', valor_desconto: '', valor_total_os: '', status_os: 'Orçamento'
      });
    }
  }, [osParaEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    
    // Converte valores para número antes de enviar
    const dadosParaEnviar = {
      ...formData,
      valor_servico_mao_de_obra: parseFloat(formData.valor_servico_mao_de_obra || 0),
      valor_total_pecas: parseFloat(formData.valor_total_pecas || 0),
      valor_desconto: parseFloat(formData.valor_desconto || 0),
      valor_total_os: parseFloat(formData.valor_total_os || 0)
    };

    try {
      if (ehModoEdicao) {
        await updateOrdemServico(osParaEditar.id, dadosParaEnviar);
        toast.success(`O.S. atualizada com sucesso!`);
      } else {
        await createOrdemServico(dadosParaEnviar);
        toast.success(`O.S. criada com sucesso!`);
      }
      if (onOsSalva) onOsSalva();
    } catch (error) {
      toast.error(error.response?.data?.erro || `Falha ao salvar O.S.`);
    }
    setEnviando(false);
  };

  const listaStatusOS = ["Orçamento", "Aguardando Aprovação", "Aprovado", "Em Reparo", "Pronto para Retirada", "Entregue", "Pago", "Cancelado"];

  return (
    <form onSubmit={handleSubmit} className="os-form">
      <h3>{ehModoEdicao ? `Editando O.S. #${osParaEditar?.numero_os}` : 'Nova Ordem de Serviço'}</h3>
      
      {/* Seção Dados Gerais */}
      <fieldset className="form-section">
        <legend>Dados Gerais</legend>
        <div className="form-grid-2-cols">
          <div>
            <label htmlFor="cliente_id">Cliente:*</label>
            <select name="cliente_id" id="cliente_id" value={formData.cliente_id} onChange={handleChange} required disabled={ehModoEdicao}>
              <option value="">Selecione um cliente</option>
              {clientes && clientes.map(cliente => (
                <option key={cliente.id} value={cliente.id}>{cliente.nome_completo}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="status_os">Status:*</label>
            <select name="status_os" id="status_os" value={formData.status_os} onChange={handleChange} required>
              {listaStatusOS.map(status => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>
        </div>
      </fieldset>

      {/* Seção Equipamento */}
      <fieldset className="form-section">
        <legend>Equipamento e Problema</legend>
        <div className="form-grid-2-cols">
          <div>
            <label htmlFor="tipo_equipamento">Tipo Equipamento:*</label>
            <input type="text" name="tipo_equipamento" id="tipo_equipamento" value={formData.tipo_equipamento} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="marca_equipamento">Marca:</label>
            <input type="text" name="marca_equipamento" id="marca_equipamento" value={formData.marca_equipamento} onChange={handleChange} />
          </div>
        </div>
        <div>
          <label htmlFor="defeito_relatado_cliente">Defeito Relatado:*</label>
          <textarea name="defeito_relatado_cliente" id="defeito_relatado_cliente" value={formData.defeito_relatado_cliente} onChange={handleChange} rows="3" required />
        </div>
      </fieldset>

      {/* Seção Valores e Peças */}
      <fieldset className="form-section">
        <legend>Valores e Peças</legend>
        <div>
            <label htmlFor="pecas_utilizadas">Peças Utilizadas (descrição):</label>
            <textarea name="pecas_utilizadas" id="pecas_utilizadas" value={formData.pecas_utilizadas} onChange={handleChange} rows="2" />
        </div>
        <div className="form-grid-4-cols" style={{marginTop: '15px'}}>
          <div>
            <label htmlFor="valor_servico_mao_de_obra">Mão de Obra (R$):</label>
            <input type="number" name="valor_servico_mao_de_obra" id="valor_servico_mao_de_obra" value={formData.valor_servico_mao_de_obra} onChange={handleChange} step="0.01" />
          </div>
          <div>
            <label htmlFor="valor_total_pecas">Valor Peças (R$):</label>
            <input type="number" name="valor_total_pecas" id="valor_total_pecas" value={formData.valor_total_pecas} onChange={handleChange} step="0.01" />
          </div>
          <div>
            <label htmlFor="valor_desconto">Desconto (R$):</label>
            <input type="number" name="valor_desconto" id="valor_desconto" value={formData.valor_desconto} onChange={handleChange} step="0.01" />
          </div>
          <div>
            <label htmlFor="valor_total_os">Valor Total (R$):</label>
            <input type="number" name="valor_total_os" id="valor_total_os" value={formData.valor_total_os} onChange={handleChange} step="0.01" />
          </div>
        </div>
      </fieldset>
      
      <div style={{ marginTop: '25px', display: 'flex', gap: '10px' }}>
        <button type="submit" disabled={enviando} className="btn-enviar">
          {enviando ? 'Salvando...' : (ehModoEdicao ? 'Salvar Alterações' : 'Criar OS')}
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