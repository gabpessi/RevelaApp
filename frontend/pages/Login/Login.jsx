import React, { useState } from "react";
import  Button  from "../../components/Button/Button"
import { useNavigate } from 'react-router-dom'
import { apiFetch } from "../../src/services/api";
import  loginImg  from "../../src/assets/login-img.png";
import styles from "./Login.module.css";
import logo from "../../src/assets/revela-logo.png";
import { getUserIdFromToken } from '../../src/utils/jwt';

export default function Login() {


    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [hasError, setHasError] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");
        setHasError(false);
        try {
            const data = await apiFetch("/auth/login", {
                method: "POST",
                body: JSON.stringify({ username, password }),
            });
            localStorage.setItem("token", data.access);
            // decodifica o JWT para pegar o user_id
            const userId = getUserIdFromToken(data.access);
            if (userId) {
              localStorage.setItem("userId", userId);
            }
            navigate('/')
        } catch (error) {
            setMessage("Usuário ou senha inválidos.");
            setHasError(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
        if (hasError) setHasError(false);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        if (hasError) setHasError(false);
    };

    return (
      <div className={styles.content}>
        <img className={styles.loginImg} src={loginImg}/>
        <div className={styles.loginContainer}>
          <h1 className={styles.title}>A rede social dos fotógrafos</h1>
          <div className={styles.logoAndForm}> 
          <img src={logo} alt="Revela Logo" className={styles.logo} />        
            <form className={styles.form} onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Usuário"
                    value={username}
                    onChange={handleUsernameChange}
                    disabled={isLoading}
                    className={`${styles.input} ${hasError ? styles.inputError : ''}`}
                />
                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={handlePasswordChange}
                    disabled={isLoading}
                    className={`${styles.input} ${hasError ? styles.inputError : ''}`}
                />
                <Button 
                    type="submit" 
                    disabled={isLoading}
                    style={isLoading ? { opacity: 0.6, cursor: "not-allowed", backgroundColor: "#b8b8b8" } : {}}
                >
                    {isLoading ? (
                        <div className={styles.spinnerContainer}>
                            <div className={styles.spinner}></div>
                            <span>Entrando...</span>
                        </div>
                    ) : (
                        "Entrar"
                    )}
                </Button>                
            </form>
                <p className={styles.cadastrar}>Não possui conta? <span className={styles.createAccountLink} onClick={() => navigate('/register')}>Criar conta</span></p>
            </div> 
            {message && <p>{message}</p>}
        </div>
        </div>
    );
}