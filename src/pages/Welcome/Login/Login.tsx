import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import '../AuthForms.css'
import api from "../../../api/axios";
import { duration } from "@mui/material";

interface Props {
  triggerExit: () => void;
}

export default function Login({ triggerExit }: Props){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()


    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError('')
        if (localStorage.getItem('token')) {
            navigate('/');
            console.log('Already logged in');
            return null;
        }
        if (!username || !password) {
            setError('Please enter both username and password');
            return;
        }
        try{
            const res = await api.get(`/users?username=${username}&password=${password}`)
            if(res.data.length===0){
                setError('Incorrect password or email');
                return;
            }
            localStorage.setItem('token', 'fake-jwt-token');
            triggerExit();
        }
        catch (err){
            setError('Login error');
            console.log(err)
        }
    }

    return (
        <div className="auth-form-body">
            <div className="auth-form-container">
                <div className="auth-form-form-container">
                    <motion.div 
                    initial={{ opacity: 0}} 
                    animate={{opacity: 1, transition: { delay: 1.5, duration: 2 } }} 
                    exit={{opacity: 0, transition: { duration: 1.5}}} >
                    <p className="auth-form-message">Welcome back!</p>
                    </motion.div>
                    <div className="auth-form-form-body">
                        <h2 className="auth-form-type">Log in</h2>
                        <form onSubmit={handleSubmit} className="auth-form-form">
                            <input className="auth-form-form-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"></input>
                            <input className="auth-form-form-input" type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                            {error &&  <p className="auth-form-error-msg">{error}</p>}
                            <button className="auth-form-form-button" type='submit'>Login</button>
                        </form>
                        <p className="auth-form-form-navigation">
                            New here? <a className="auth-form-form-navigation-link" onClick={()=> navigate('/register')}>Create account</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}