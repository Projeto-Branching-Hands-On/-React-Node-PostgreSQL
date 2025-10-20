import React, { useState, useEffect } from 'react';
import api from '../services/api';

function ClienteCrud() {
  const [clientes, setClientes] = useState([]);
  const [formData, setFormData] = useState({ nome: '', email: '', telefone: '' });
  const [editingId, setEditingId] = useState(null); 


  const fetchClientes = async () => {
    try {
      const response = await api.get('/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (editingId) {
      try {
        const response = await api.put(`/clientes/${editingId}`, formData);
        // Atualiza o cliente na lista local
        setClientes(clientes.map(c => (c.id === editingId ? response.data : c)));
      } catch (error) {
        console.error('Erro ao atualizar cliente:', error);
      }
    } 

    else {
      try {
        const response = await api.post('/clientes', formData);
        // Adiciona o novo cliente na lista local
        setClientes([...clientes, response.data]);
      } catch (error) {
        console.error('Erro ao criar cliente:', error);
      }
    }
    
    resetForm();
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/clientes/${id}`);
      // Remove o cliente da lista local
      setClientes(clientes.filter(c => c.id !== id));
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
    }
  };

  const handleEdit = (cliente) => {
    setEditingId(cliente.id);
    setFormData({ nome: cliente.nome, email: cliente.email, telefone: cliente.telefone });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({ nome: '', email: '', telefone: '' });
  };

  return (
    <div>
      <h2>Gerenciamento de Clientes</h2>

      {/* Formulário de Adição e Edição */}
      <form onSubmit={handleSubmit}>
        <h3>{editingId ? 'Editar Cliente' : 'Adicionar Novo Cliente'}</h3>
        <input 
          type="text" 
          name="nome" 
          placeholder="Nome" 
          value={formData.nome} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formData.email} 
          onChange={handleInputChange} 
          required 
        />
        <input 
          type="text" 
          name="telefone" 
          placeholder="Telefone" 
          value={formData.telefone} 
          onChange={handleInputChange} 
          required 
        />
        <button type="submit">{editingId ? 'Atualizar' : 'Salvar'}</button>
        {editingId && (
          <button type="button" onClick={resetForm}>Cancelar Edição</button>
        )}
      </form>

      <hr />

      {/* Lista de Clientes */}
      <h3>Clientes Cadastrados</h3>
      <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>
                <button onClick={() => handleEdit(cliente)}>Editar</button>
                <button onClick={() => handleDelete(cliente.id)}>Deletar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClienteCrud;