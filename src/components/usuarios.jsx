import React, { useState, useEffect } from 'react';
import Modal from "react-modal";
import '../css/Usuario.css';

const Usuarios = ({ moderadorId }) => {
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUsuario, setSelectedUsuario] = useState(null);
    const [advertencia, setAdvertencia] = useState('');

    useEffect(() => {
        const fetchUsuarios = async () => {
            try {
                console.log(moderadorId)
                const response = await fetch('https://volun-api-eight.vercel.app/usuarios/');
                if (!response.ok) {
                    throw new Error('Erro ao buscar os usuários');
                }
                const data = await response.json();
                setUsuarios(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsuarios();
    }, []);

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>Erro: {error}</div>;
    }

    const registrarAcao = async (acao, alvoId, alvoTipo, descricao) => {
        try {
            const response = await fetch('https://volun-api-eight.vercel.app/acoes-moderacao', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    moderador_id: moderadorId,
                    alvo_tipo: alvoTipo,
                    alvo_id: alvoId,
                    acao: acao,
                    descricao: descricao,      
                    data: new Date().toISOString(), 
                }),
            });
    
            if (!response.ok) {
                throw new Error('Erro ao registrar ação');
            }
        } catch (err) {
            console.error('Erro ao registrar ação:', err);
        }
    };

    const handleSuspender = async (usuario) => {
        const action = usuario.userSuspenso ? 'reativar' : 'suspender';
        if (window.confirm(`Tem certeza que deseja ${action} o usuário ${usuario.nome}?`)) {
            try {
                const response = await fetch(`https://volun-api-eight.vercel.app/usuarios/${usuario._id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ userSuspenso: !usuario.userSuspenso }),
                });
    
                if (!response.ok) {
                    const errorMsg = await response.text();
                    throw new Error(`Erro ao ${action} o usuário: ${errorMsg}`);
                }
    
                const updatedUsuario = { ...usuario, userSuspenso: !usuario.userSuspenso };
                setUsuarios((prevUsuarios) =>
                    prevUsuarios.map((u) => (u._id === usuario._id ? updatedUsuario : u))
                );
    
                await registrarAcao(
                    action,
                    usuario._id,
                    'usuario',
                    `Usuário ${usuario.nome} ${action === 'reativar' ? 'reativado' : 'suspenso'}`
                );
    
                alert(`Usuário ${usuario.nome} foi ${action === 'reativar' ? 'reativado' : 'suspenso'} com sucesso.`);
            } catch (err) {
                console.error(`Erro ao ${action} usuário:`, err);
                alert(`Erro ao ${action} usuário: ${err.message}`);
            }
        }
    };

    const handleDelete = async (usuario) => {
        if (window.confirm(`Tem certeza que deseja excluir o usuário ${usuario.nome}?`)) {
            try {
                const response = await fetch(`https://volun-api-eight.vercel.app/usuarios/${usuario._id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorMsg = await response.text();
                    throw new Error(`Erro ao excluir o usuário: ${errorMsg}`);
                }

                setUsuarios((prevUsuarios) =>
                    prevUsuarios.filter((u) => u._id !== usuario._id)
                );
                await registrarAcao('excluir', usuario._id, 'usuario', `Usuário ${usuario.nome} excluído`);
            } catch (err) {
                setError(err.message);
            }
        }
    };

    const handleAdvertir = (usuario) => {
        setSelectedUsuario(usuario);
        setIsModalOpen(true);
    };

    const handleApplyAdvertencia = async () => {
        if (!advertencia) {
            alert('Por favor, insira uma advertência.');
            return;
        }
        await registrarAcao('advertir', selectedUsuario._id, 'usuario', `Advertência aplicada: ${advertencia}`);
        setIsModalOpen(false);
        setAdvertencia('');
    };

    return (
        <div className="lista-usuario">
            <h1>Página de Usuários</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Sobrenome</th>
                        <th>DDD</th>
                        <th>Telefone</th>
                        <th>Data de Nascimento</th>
                        <th>Status</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {usuarios.map((usuario) => (
                        <tr key={usuario._id} style={{ color: usuario.userSuspenso ? 'red' : 'black' }}>
                            <td>{usuario.nome}</td>
                            <td>{usuario.sobrenome}</td>
                            <td>{usuario.ddd}</td>
                            <td>{usuario.telefone}</td>
                            <td>{usuario.data_nascimento}</td>
                            <td>{usuario.userSuspenso ? 'Suspenso' : 'Ativo'}</td>
                            <td>
                                <button onClick={() => handleDelete(usuario)}>
                                    Excluir
                                </button>
                                <button onClick={() => handleAdvertir(usuario)}>
                                    Advertir
                                </button>
                                <button onClick={() => handleSuspender(usuario)}>
                                    {usuario.userSuspenso ? 'Reativar' : 'Suspender'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={() => setIsModalOpen(false)}
                ariaHideApp={false}
            >
                <h2>Advertir Usuário: {selectedUsuario?.nome}</h2>
                <textarea
                    value={advertencia}
                    onChange={(e) => setAdvertencia(e.target.value)}
                    rows="5"
                />
                <button onClick={handleApplyAdvertencia}>Aplicar Advertência</button>
                <button onClick={() => setIsModalOpen(false)}>Cancelar</button>
            </Modal>
        </div>
    );
};

export default Usuarios;

