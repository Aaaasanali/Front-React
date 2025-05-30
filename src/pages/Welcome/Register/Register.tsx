import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../../../api/axios"
import '../AuthForms.css'

interface Props {
    triggerExit: () => void;
}

export default function Register({ triggerExit }: Props){
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [firstname, setFirstName] = useState('')
    const [lastname, setLastName] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setError('');
        if (localStorage.getItem('token')) {
            navigate('/');
            return null;
        }
        if (!username || !password || !firstname || !lastname) {
            setError('Please fill in all fields');
            return;
        }
        try{
            console.log('Registering:', username, password);
            const res = await api.get(`/users?username=${username}`)
            if (res.data.length>0){
                setError('User with such username already exists');
                return;
            }
            
            const newUser = {username, password, firstname, lastname}
            await api.post(`/users`, newUser)
            localStorage.setItem('token', 'fake-jwt-token');
            triggerExit();
            navigate('/');
        }
        catch (err){
            setError('Ошибка регистрации');
            console.error(err);
        }
    }

    return (
        <div className="auth-form-body">
            <div className="auth-form-container">
                <div className="auth-form-form-container">
                    <motion.div  initial={{ opacity: 0}} 
                    animate={{opacity: 1, transition: { delay: 1.5, duration: 2 } }} 
                    exit={{opacity: 0, transition: { duration: 1.5}}} >
                    <p className="auth-form-message">Welcome!</p>
                    </motion.div>
                    <div className="auth-form-form-body">
                        <h2 className="auth-form-type">Register</h2>
                        <form onSubmit={handleSubmit} className="auth-form-form-registration">
                            <input className="auth-form-form-input" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username"></input>
                            <input className="auth-form-form-input" type='password' value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"></input>
                            <input className="auth-form-form-input" value={firstname} onChange={(e) => setFirstName(e.target.value)} placeholder="First Name"></input>
                            <input className="auth-form-form-input" value={lastname} onChange={(e) => setLastName(e.target.value)} placeholder="Last Name"></input>
                            {error && <p className="auth-form-error-msg">{error}</p>}
                            <button className="auth-form-form-button-registration" type='submit'>Create account</button>
                        </form>
                        <p className="auth-form-form-navigation">
                            Already have an account? <a className="auth-form-form-navigation-link" onClick={()=> navigate('/login')}>Login</a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}