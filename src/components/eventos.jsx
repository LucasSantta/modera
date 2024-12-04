import React, { useState, useEffect } from 'react';
import Modal from "react-modal";
import '../css/Eventos.css';

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEventos, setSelectedEventos] = useState(null);
  const [advertencia, setAdvertencia] = useState('');  

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch('https://volun-api-eight.vercel.app/eventos/');
        if (!response.ok) {
          throw new Error('Erro ao buscar os eventos');
        }
        const data = await response.json();
        setEventos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;


  }

  // LocalStorage para registrar as ações
  const registrarAcao = (acao) => {
    const historico = JSON.parse(localStorage.getItem('historico')) || [];
    historico.push(acao);
    localStorage.setItem('historico', JSON.stringify(historico));
  };

  // Função para excluir um evento
  const handleDeleteEvento = async (evento) => {
    const confirmDelete = window.confirm(`Tem certeza que deseja excluir o evento "${evento.titulo}"?`);
  
    if (!confirmDelete) return;
  
    try {
      const response = await fetch(`https://volun-api-eight.vercel.app/eventos/${evento._id}`, {
        method: 'DELETE',
      });
  
      if (!response.ok) {
        const errorDetails = await response.text();
        console.error('Erro ao excluir o evento:', errorDetails);
        throw new Error('Erro ao excluir o evento');
      }
  
      // Remover o evento excluído do estado
      setEventos((prevEventos) =>
        prevEventos.filter((e) => e._id !== evento._id)
      );
  
      // Registrar ação de exclusão
      registrarAcao(`Moderador excluiu o evento: "${evento.titulo}"`);
      console.log(`Evento "${evento.titulo}" excluído com sucesso.`);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao excluir o evento:', err);
    }
  };
  

  const handleAdvertir = (evento) => {
    setSelectedEventos(evento); 
    setIsModalOpen(true); 
  };

  function truncateText(text, length) {
    if (text.length > length) {
      return text.substring(0, length) + "...";
    }
    return text;
  }
  

   
   const handleApplyAdvertencia = () => {
    if (!advertencia) {
      alert('Por favor, insira uma advertência.');
      return;
    }

     // Registrar a ação de advertência
     registrarAcao(`Moderador advertiu o Evento: ${selectedEventos.titulo} com a mensagem: "${advertencia}"`);


     // Fechar o modal
     setIsModalOpen(false);
     setAdvertencia(''); 
     console.log(`Advertência aplicada ao usuário: ${selectedEventos.titulo}`);
   };


 


  return (
    // Card
    <div className="eventos-container">
      {eventos.map(evento => (
        <div key={evento._id} className="card-x">
          <div className="card-capa-img" style={{ backgroundImage: `url(${evento.imagem})` }}>
            <p><span className="card-title">{evento.titulo}</span></p>
          </div>
          <div className="card-text">
            <p className="card-description-x">{truncateText(evento.descricao, 100)}</p>
            <div className="card-text-first">
              <strong className="card-text-ongname">{evento.ongnome}</strong>
              <strong className="date-container">
                <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 14.5C0 15.3281 0.671875 16 1.5 16H12.5C13.3281 16 14 15.3281 14 14.5V6H0V14.5ZM10 8.375C10 8.16875 10.1688 8 10.375 8H11.625C11.8312 8 12 8.16875 12 8.375V9.625C12 9.83125 11.8312 10 11.625 10H10.375C10.1688 10 10 9.83125 10 9.625V8.375ZM10 12.375C10 12.1688 10.1688 12 10.375 12H11.625C11.8312 12 12 12.1688 12 12.375V13.625C12 13.8312 11.8312 14 11.625 14H10.375C10.1688 14 10 13.8312 10 13.625V12.375ZM6 8.375C6 8.16875 6.16875 8 6.375 8H7.625C7.83125 8 8 8.16875 8 8.375V9.625C8 9.83125 7.83125 10 7.625 10H6.375C6.16875 10 6 9.83125 6 9.625V8.375ZM6 12.375C6 12.1688 6.16875 12 6.375 12H7.625C7.83125 12 8 12.1688 8 12.375V13.625C8 13.8312 7.83125 14 7.625 14H6.375C6.16875 14 6 13.8312 6 13.625V12.375ZM2 8.375C2 8.16875 2.16875 8 2.375 8H3.625C3.83125 8 4 8.16875 4 8.375V9.625C4 9.83125 3.83125 10 3.625 10H2.375C2.16875 10 2 9.83125 2 9.625V8.375ZM2 12.375C2 12.1688 2.16875 12 2.375 12H3.625C3.83125 12 4 12.1688 4 12.375V13.625C4 13.8312 3.83125 14 3.625 14H2.375C2.16875 14 2 13.8312 2 13.625V12.375ZM12.5 2H11V0.5C11 0.225 10.775 0 10.5 0H9.5C9.225 0 9 0.225 9 0.5V2H5V0.5C5 0.225 4.775 0 4.5 0H3.5C3.225 0 3 0.225 3 0.5V2H1.5C0.671875 2 0 2.67188 0 3.5V5H14V3.5C14 2.67188 13.3281 2 12.5 2Z" fill="#1F0171"/>
                </svg>
                <span>{evento.data_inicio}</span>
              </strong>
            </div>
            <div className="card-text-second">
              <span>{evento.endereco}</span>
              <span className="members-container">
                <svg fill="#1f0171" viewBox="0 0 35 35" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12,16.14q-.43,0-.87,0a8.67,8.67,0,0,0-6.43,2.52l-.24.28v8.28H8.54v-4.7l.55-.62.25-.29a11,11,0,0,1,4.71-2.86A6.59,6.59,0,0,1,12,16.14Z" />
                </svg>
                <strong className="bold">{evento.vaga_limite}</strong>
              </span>
            </div>
          </div>
          
          {/* Ações */}
          <div className="card-actions">

          <button
         onClick={() => handleDeleteEvento(evento)}
         style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
>
        <img
        src='src/assets/img/image 34.png'
           alt='Excluir'
           className='icon'
           style={{ marginRight: '10px' }}
        />
        </button>


                <button
                  onClick={() => handleAdvertir(evento)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <img
                    src='src/assets/img/image 33.png'
                    alt='Advertir'
                    className='icon'
                  />
                </button>


          </div>
        </div>
      ))}

      {/* Modal para advertir */}
      <Modal 
        isOpen={isModalOpen} 
        onRequestClose={() => setIsModalOpen(false)} 
        contentLabel="Advertir Evento"
        ariaHideApp={false}
        className="ReactModal__Content"
        overlayClassName="ReactModal__Overlay"
      >
        <h2>Advertir Evento: {selectedEventos?.titulo}</h2>
        <textarea 
          value={advertencia} 
          onChange={(e) => setAdvertencia(e.target.value)} 
          placeholder="Digite a advertência aqui..."
          rows="5"
          className="modal-textarea"
        />
        <div className="modal-buttons">
          <button onClick={handleApplyAdvertencia}>Aplicar Advertência</button>
          <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
        </div>
      </Modal>
    </div>
  );
};


  
export default Eventos;


 