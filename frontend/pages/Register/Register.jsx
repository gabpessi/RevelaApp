import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Register.module.css';
import Button from '../../components/Button/Button';
import { apiFetch } from '../../src/services/api';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: '',
    cpf: '',
    dataNascimento: '',
    telefone: '',
    aceitaTermos: false
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [passwordMismatch, setPasswordMismatch] = useState(false);
  const navigate = useNavigate();

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    // Limpa o erro de senha ao digitar
    if (name === 'password' || name === 'password2') {
      setPasswordMismatch(false);
    }
  }

  function validarCPF(cpf) {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return /^\d{11}$/.test(cpfLimpo);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.password2) {
      setError('As senhas não coincidem.');
      setPasswordMismatch(true);
      return;
    }

    if (!validarCPF(formData.cpf)) {
      setError('CPF inválido. Use 11 dígitos numéricos.');
      return;
    }

    if (!formData.aceitaTermos) {
      setError('Você deve aceitar os Termos de Uso e a Política de Privacidade.');
      return;
    }

    // cria um objeto para enviar ao backend sem aceitaTermos
    const { aceitaTermos, ...payload } = formData;

    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload)
      });
      setSuccess('Cadastro realizado com sucesso!');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message || 'Erro ao registrar.');
    }
  }

  return (
    <div className={styles.registerContainer}>
      <h2>Crie sua conta</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <input
          name="username"
          type="text"
          placeholder="Nome de usuário"
          onChange={handleChange}
          required
        />

        <input
          name="email"
          type="email"
          placeholder="Email: exemplo@email.com"
          onChange={handleChange}
          required
        />

        <input
          name="cpf"
          type="text"
          placeholder="CPF: 123.456.789-00"
          maxLength={14}
          value={formData.cpf}
          onChange={handleChange}
        />

        <input
          name="dataNascimento"
          type="date"
          placeholder="Data de nascimento"
          onChange={handleChange}
          required
        />

        <input
          name="telefone"
          type="text"
          placeholder="Telefone: (48) 91234-5678"
          maxLength={15}
          value={formData.telefone}
          onChange={handleChange}
        />
        
      <div className={styles.passwordField}>
        <input
          name="password"
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={formData.password}
          onChange={handleChange}
          required
          className={passwordMismatch ? styles.inputError : ''}
        />
        <span
          className={styles.toggle}
          onClick={() => setShowPassword(prev => !prev)}
        >
          {showPassword ? '⚫️' : '👁'}
        </span>
      </div>

      <div className={styles.passwordField}>
        <input
          name="password2"
          type={showPassword2 ? 'text' : 'password'}
          placeholder="Confirme a senha"
          value={formData.password2}
          onChange={handleChange}
          required
          className={passwordMismatch ? styles.inputError : ''}
        />
        <span
          className={styles.toggle}
          onClick={() => setShowPassword2(prev => !prev)}
        >
          {showPassword2 ? '⚫️' : '👁'}
        </span>
      </div>

        <label className={styles.checkboxLabel}>
          <input
            name="aceitaTermos"
            type="checkbox"
            onChange={handleChange}
          />
          Li e aceito os <a href="/termos" target="_blank">Termos de Uso</a> e a <a href="/privacidade" target="_blank">Política de Privacidade</a>
        </label>

        {error && <p className={styles.error}>{error}</p>}
        {success && <p className={styles.success}>{success}</p>}

        <Button type="submit" className={styles.submitButton}>Registrar</Button>

      </form>
    </div>
  );
}
