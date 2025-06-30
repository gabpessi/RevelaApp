import { useState, useEffect } from 'react';
import styles from './Profile.module.css';

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState('/default-profile.png');
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: 'Tito Luiz Pereira',
    cpf: '073.802.079-62',
    dataNascimento: '1998-05-11',
    telefone: '(48) 91234-5678',
    cidade: 'Florianópolis',
    estado: 'SC',
    pais: 'Brasil',
    equipamento: 'Canon EOS R6',
    especialidades: ['Retrato', 'Natureza'],
    novaEspecialidade: '',
    instagram: '',
    facebook: '',
    linkedin: '',
    posts: [
      { id: 1, imagem: '/img/post1.jpg', descricao: 'Primeiro post' },
      { id: 2, imagem: '/img/post2.jpg', descricao: 'Segundo post' }
    ]
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddEspecialidade = () => {
    if (
      formData.novaEspecialidade &&
      !formData.especialidades.includes(formData.novaEspecialidade)
    ) {
      setFormData((prev) => ({
        ...prev,
        especialidades: [...prev.especialidades, prev.novaEspecialidade],
        novaEspecialidade: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsEditing(false);
    // Aqui você pode fazer o fetch para salvar no backend
  };

  return (
    <div className={styles.profileContainer}>
      <div className={styles.profileHeader}>
        <img
          src={previewImage || profileImage}
          alt="Foto de perfil"
          className={styles.profileImage}
        />
        {isEditing && <input type="file" onChange={handleImageChange} />}
        <button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? 'Salvar alterações' : 'Editar perfil'}
        </button>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        {[
          ['Nome completo', 'fullName'],
          ['CPF', 'cpf'],
          ['Data de nascimento', 'dataNascimento'],
          ['Telefone', 'telefone'],
          ['Cidade', 'cidade'],
          ['Estado', 'estado'],
          ['País', 'pais'],
          ['Equipamento', 'equipamento']
        ].map(([label, name]) => (
          <div key={name} className={styles.field}>
            <label>{label}</label>
            {isEditing ? (
              <input name={name} value={formData[name]} onChange={handleChange} />
            ) : (
              <p>{formData[name]}</p>
            )}
          </div>
        ))}

        <div className={styles.field}>
          <label>Especialidades</label>
          {isEditing ? (
            <div>
              <input
                name="novaEspecialidade"
                value={formData.novaEspecialidade}
                onChange={handleChange}
                placeholder="Ex: Retrato, Natureza..."
              />
              <button type="button" onClick={handleAddEspecialidade}>
                Adicionar
              </button>
            </div>
          ) : null}
          <div className={styles.tags}>
            {formData.especialidades.map((esp, i) => (
              <span key={i} className={styles.tag}>{esp}</span>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label>Redes sociais</label>
          <div className={styles.socialLinks}>
            {formData.instagram && (
              <a href={formData.instagram} target="_blank" rel="noreferrer">
                📸 Instagram
              </a>
            )}
            {formData.facebook && (
              <a href={formData.facebook} target="_blank" rel="noreferrer">
                📘 Facebook
              </a>
            )}
            {formData.linkedin && (
              <a href={formData.linkedin} target="_blank" rel="noreferrer">
                💼 LinkedIn
              </a>
            )}
          </div>
        </div>

        {isEditing && <button type="submit">Salvar</button>}
      </form>

      <div className={styles.postsSection}>
        <h3>Criações</h3>
        <div className={styles.postsGrid}>
          {[...formData.posts].reverse().map((post) => (
            <div key={post.id} className={styles.postCard}>
              <img src={post.imagem} alt={post.descricao} />
              <p>{post.descricao}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
