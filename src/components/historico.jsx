import React, { useEffect, useState } from 'react';
import '../css/Historico.css';

const Historico = () => {
  const [historico, setHistorico] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistorico = async () => {
      try {
        const response = await fetch('https://volun-api-eight.vercel.app/acoes-moderacao');
        if (!response.ok) {
          throw new Error('Erro ao buscar o histórico');
        }
        const data = await response.json();
        setHistorico(data);
      } catch (err) {
        console.error('Erro ao carregar o histórico:', err);
        setError('Erro ao carregar o histórico.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistorico();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  if (!historico.length) {
    return <div>Sem histórico registrado.</div>;
  }

  return (
    <div className="historico-container">
      <h2>Histórico de Ações</h2>
      <ul className="historico-list">
        {historico.map((acao, index) => (
          <li key={index} className="historico-item">
            <strong>Ação:</strong> {acao.acao} <br />
            <strong>Moderador:</strong> {acao.moderador_id} <br />
            <strong>Alvo:</strong> {acao.alvo_tipo} (ID: {acao.alvo_id}) <br />
            <strong>Descrição:</strong> {acao.descricao || 'Sem descrição'} <br />
            <strong>Data:</strong> {new Date(acao.data).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Historico;

