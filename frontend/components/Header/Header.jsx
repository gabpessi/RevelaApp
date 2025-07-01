import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../../src/assets/revela-logo-branco.png';
import styles from './Header.module.css';
import Modal from '../../components/Modal/Modal.jsx';
import { getUserIdFromToken } from '../../src/utils/jwt';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  
  // Pega o userId do token
  const token = localStorage.getItem('token');
  const userId = getUserIdFromToken(token);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  //destaca menu ativo
  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setShowLogoutModal(false);
    navigate('/login');
  };

  return (
    <nav>
      <div className={styles.container}>
        <Link to="/">
          <img className={styles.logo} src={logo} alt="Logo" />
        </Link>
        
        <button 
          className={`${styles.hamburger} ${isMenuOpen ? styles.active : ''}`}
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {/* ícone de hamburguer */}
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`${styles.menu} ${isMenuOpen ? styles.active : ''}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <li className={isActive('/') ? styles.active : ''}>Feed</li>
          </Link>
          <Link to="/create" onClick={() => setIsMenuOpen(false)}>
            <li className={isActive('/create') ? styles.active : ''}>Criar</li>
          </Link>
          <Link to="/messages" onClick={() => setIsMenuOpen(false)}>
            <li className={isActive('/messages') ? styles.active : ''}>Mensagens</li>
          </Link>
          <Link to={`/users/${userId}`} onClick={() => setIsMenuOpen(false)}>
            <li className={isActive('/users') ? styles.active : ''}>Perfil</li>
          </Link>
          <li>
            <button onClick={() => setShowLogoutModal(true)} className={styles.logoutButton}>Sair</button>
          </li>
        </ul>
      </div>
      {/* Modal de confirmação de logout */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
        message="Tem certeza que deseja sair?"
        confirmText="Sim"
        cancelText="Cancelar"
      />
    </nav>
  );
}