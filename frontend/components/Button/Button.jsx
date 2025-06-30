import styles from './Button.module.css';

function Button({ children, onClick, type = 'button', className = '', disabled, style }) {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${className}`}
      disabled={disabled}
      style={style}
    >
      {children}
    </button>
  );
}

export default Button;
