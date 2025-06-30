import styles from './Create.module.css';
import { IoArrowBack, IoAdd, IoTrash } from 'react-icons/io5';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiFetch } from "../../src/services/api";

export default function Create() {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState("");
    const [isPosting, setIsPosting] = useState(false);
    const navigate = useNavigate();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            // preview da imagem
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const handlePost = async (e) => {
        e.preventDefault();
        if (!description && !image) return;
        setIsPosting(true);
        // pra enviar texto e descrição na mesma requisição
        const formData = new FormData();
        formData.append("text", description);
        if (image) {
            formData.append("imagem", image);
        }
        try {
            await apiFetch("/posts/", {
                method: "POST",
                body: formData,
            });
            setMessage("Post criado com sucesso!");
            setDescription('');
            setImage(null);
            setImagePreview(null);
            setTimeout(() => navigate("/"), 1200);
        } catch (error) {
            setMessage("Erro ao criar post.");
        } finally {
            setIsPosting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <Link to="/"><button className={styles.backButton}>
                    <IoArrowBack size={16} />
                    Voltar
                </button></Link>
                <div className={styles.imageAndText}>
                    <div className={styles.addImage}>
                        <input
                            type="file"
                            id="imageInput"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                        />
                        <label htmlFor="imageInput" className={styles.imageLabel}>
                            {imagePreview ? (
                                <div className={styles.previewContainer}>
                                    <img src={imagePreview} alt="Preview" className={styles.previewImage} />
                                    <button 
                                        className={styles.deleteButton}
                                        onClick={e => { e.preventDefault(); handleRemoveImage(); }}
                                    >
                                        <IoTrash size={24} />
                                    </button>
                                </div>
                            ) : (
                                <div className={styles.plusIcon}>
                                    <IoAdd size={32} />
                                </div>
                            )}
                        </label>
                    </div>
                    <div className={styles.textContent}>
                        <h2>Criar Post</h2>
                        <h4>Descrição</h4>
                        <form onSubmit={handlePost}>
                            <textarea 
                                placeholder="Escreva uma descrição para seu post..."
                                className={styles.description}
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                            />
                            <button className={styles.postButton} type="submit" disabled={isPosting}>
                                {isPosting ? 'Postando...' : 'Postar'}
                            </button>
                        </form>
                        {message && <p>{message}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
}