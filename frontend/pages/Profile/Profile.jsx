import { useState, useEffect } from 'react';
import styles from './Profile.module.css';
import { apiFetch } from '../../src/services/api';
import { getUserIdFromToken } from '../../src/utils/jwt';
import { useParams } from 'react-router-dom';

export default function Profile() {
  const { id: paramId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/default-profile.png');
  const [previewImage, setPreviewImage] = useState(null);
  const [formData, setFormData] = useState({
    sobre: '',
    facebook: '',
    instagram: '',
    linkedin: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    imagem: null,
  });
  const [username, setUsername] = useState('');

  const token = localStorage.getItem('token');
  const userId = paramId || getUserIdFromToken(token);

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;
      try {
        const response = await apiFetch('/user');
        console.log('Dados do usuário recebidos do backend:', response); 
        setUsername(response.username || '');
        setFormData({
          sobre: response.profile?.sobre || '',
          facebook: response.profile?.facebook || '',
          instagram: response.profile?.instagram || '',
          linkedin: response.profile?.linkedin || '',
          cpf: response.profile?.cpf || '',
          telefone: response.profile?.telefone || '',
          dataNascimento: response.profile?.dataNascimento || '',
          imagem: response.profile?.imagem || null,
        });
        setProfileImage(response.profile?.imagem || '/default-profile.png');
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
      }
    }
    fetchProfile();
  }, [userId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
      setProfileImage(imageUrl);
      setFormData(prev => ({ ...prev, imagem: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('profile.sobre', formData.sobre);
      data.append('profile.facebook', formData.facebook);
      data.append('profile.instagram', formData.instagram);
      data.append('profile.linkedin', formData.linkedin);
      data.append('profile.cpf', formData.cpf);
      data.append('profile.telefone', formData.telefone);
      data.append('profile.dataNascimento', formData.dataNascimento);
      if (formData.imagem instanceof File) {
        data.append('profile.imagem', formData.imagem);
      }
     
      await apiFetch(`/user`, {
        method: 'PUT',
        body: data
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Erro ao salvar alterações:', err);
    }
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img src={previewImage || profileImage} alt="Foto de perfil" className={styles.profileImage} />
        <div>
          <h2 className={styles.profileName}>{username}</h2>
          <button onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? 'Salvar alterações' : 'Editar perfil'}
          </button>
        </div>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Sobre</label>
          {isEditing ? (
            <textarea name="sobre" value={formData.sobre} onChange={handleChange} />
          ) : (
            <p>{formData.sobre ? formData.sobre : 'Adicionar'}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Facebook</label>
          {isEditing ? (
            <input name="facebook" value={formData.facebook} onChange={handleChange} />
          ) : (
            <p>{formData.facebook ? formData.facebook : 'Adicionar'}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Instagram</label>
          {isEditing ? (
            <input name="instagram" value={formData.instagram} onChange={handleChange} />
          ) : (
            <p>{formData.instagram ? formData.instagram : 'Adicionar'}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>LinkedIn</label>
          {isEditing ? (
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} />
          ) : (
            <p>{formData.linkedin ? formData.linkedin : 'Adicionar'}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>CPF</label>
          {isEditing ? (
            <input name="cpf" value={formData.cpf} onChange={handleChange} />
          ) : (
            <p>{formData.cpf ? formData.cpf : 'Adicionar'}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Telefone</label>
          {isEditing ? (
            <input name="telefone" value={formData.telefone} onChange={handleChange} />
          ) : (
            <p>{formData.telefone ? formData.telefone : 'Adicionar'}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Data de Nascimento</label>
          {isEditing ? (
            <input name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} />
          ) : (
            <p>{formData.dataNascimento ? formData.dataNascimento : 'Adicionar'}</p>
          )}
        </div>
        {isEditing && (
          <button type="submit">Salvar</button>
        )}
      </form>
    </div>
  );
}
