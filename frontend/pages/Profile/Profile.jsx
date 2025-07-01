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
    amigos: [],
    cpf: '',
    telefone: '',
    dataNascimento: '',
    imagem: null,
  });

  const token = localStorage.getItem('token');
  const userId = getUserIdFromToken(token);

  useEffect(() => {
    async function fetchProfile() {
      if (!userId) return;
      try {
        const response = await apiFetch(`/user/${userId}`);
        setFormData({
          sobre: response.sobre || '',
          facebook: response.facebook || '',
          instagram: response.instagram || '',
          linkedin: response.linkedin || '',
          amigos: response.amigos || [],
          cpf: response.cpf || '',
          telefone: response.telefone || '',
          dataNascimento: response.dataNascimento || '',
          imagem: response.imagem || null,
        });
        setProfileImage(response.imagem || '/default-profile.png');
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
    if (!userId) return;
    try {
      const data = new FormData();
      data.append('sobre', formData.sobre);
      data.append('facebook', formData.facebook);
      data.append('instagram', formData.instagram);
      data.append('linkedin', formData.linkedin);
      data.append('cpf', formData.cpf);
      data.append('telefone', formData.telefone);
      data.append('dataNascimento', formData.dataNascimento);
      if (formData.imagem instanceof File) {
        data.append('imagem', formData.imagem);
      }
      await apiFetch(`/user/${userId}`, {
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
        {isEditing && <input type="file" onChange={handleImageChange} />}
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Salvar alterações' : 'Editar perfil'}
        </button>
      </div>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label>Sobre</label>
          {isEditing ? (
            <textarea name="sobre" value={formData.sobre} onChange={handleChange} />
          ) : (
            <p>{formData.sobre}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Facebook</label>
          {isEditing ? (
            <input name="facebook" value={formData.facebook} onChange={handleChange} />
          ) : (
            <p>{formData.facebook}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Instagram</label>
          {isEditing ? (
            <input name="instagram" value={formData.instagram} onChange={handleChange} />
          ) : (
            <p>{formData.instagram}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>LinkedIn</label>
          {isEditing ? (
            <input name="linkedin" value={formData.linkedin} onChange={handleChange} />
          ) : (
            <p>{formData.linkedin}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>CPF</label>
          {isEditing ? (
            <input name="cpf" value={formData.cpf} onChange={handleChange} />
          ) : (
            <p>{formData.cpf}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Telefone</label>
          {isEditing ? (
            <input name="telefone" value={formData.telefone} onChange={handleChange} />
          ) : (
            <p>{formData.telefone}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Data de Nascimento</label>
          {isEditing ? (
            <input name="dataNascimento" type="date" value={formData.dataNascimento} onChange={handleChange} />
          ) : (
            <p>{formData.dataNascimento}</p>
          )}
        </div>
        <div className={styles.field}>
          <label>Amigos</label>
          <div>
            {formData.amigos && formData.amigos.length > 0 ? (
              formData.amigos.map((amigo, i) => (
                <span key={i} className={styles.tag}>{amigo}</span>
              ))
            ) : (
              <span>Nenhum amigo adicionado.</span>
            )}
          </div>
        </div>
        {isEditing && (
          <button type="submit">Salvar</button>
        )}
      </form>
    </div>
  );
}
